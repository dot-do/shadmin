/**
 * AutocompleteInput Component
 * A form input with autocomplete/typeahead functionality that integrates with react-hook-form
 */

import {
  forwardRef,
  useId,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  type InputHTMLAttributes,
  type ReactElement,
} from 'react'
import {
  useController,
  type RegisterOptions,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'
import { type ValidateProp, mergeValidation, hasRequiredValidator } from '../../validation/adapter'
import { type AutocompleteChoice } from './types'

// Re-export AutocompleteChoice for backwards compatibility
export type { AutocompleteChoice } from './types'

/**
 * Props for AutocompleteInput component
 */
export interface AutocompleteInputProps<T extends FieldValues = FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue'> {
  /**
   * The field name in the form data.
   * Optional when used inside ReferenceInput (provided via context).
   */
  source?: Path<T>
  /**
   * Array of choices to display in the autocomplete dropdown.
   * Optional when used inside ReferenceInput (provided via context).
   */
  choices?: AutocompleteChoice[]
  /**
   * Label text displayed above the input.
   * Set to `false` to hide the label completely.
   */
  label?: string | false
  /**
   * Helper text displayed below the input.
   * Set to `false` to hide the helper text completely.
   */
  helperText?: string | false
  /**
   * Validation rules passed to react-hook-form.
   */
  rules?: RegisterOptions<T>
  /**
   * ReactAdmin-compatible validators for the validate prop.
   * Can be a single validator or array of validators.
   */
  validate?: ValidateProp
  /**
   * The property name to use as the option value.
   * @default 'id'
   */
  optionValue?: string
  /**
   * The property name to use as the option text, a function to render custom text,
   * or a React element for custom rendering.
   * @default 'name'
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Allows strongly-typed callbacks without casting; see types.ts OptionTextProp
  optionText?: string | ((choice: any) => string) | ReactElement
  /**
   * Whether the input should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * Callback to create a new option when the user types a value not in the choices.
   * Should return a promise that resolves to the new choice object.
   * Can also be a React element to render a create dialog.
   */
  create?: ReactElement | ((value: string) => Promise<AutocompleteChoice>)
  /**
   * Legacy prop for create - alias for `create`.
   * @deprecated Use `create` instead
   */
  onCreate?: (value: string) => Promise<AutocompleteChoice>
  /**
   * Debounce delay in milliseconds for filtering.
   * @default 0
   */
  debounce?: number
  /**
   * Open the suggestions dropdown on focus.
   * @default true
   */
  openOnFocus?: boolean
  /**
   * Default value for the field.
   */
  defaultValue?: string
  /**
   * Custom function to determine if a suggestion matches the filter value.
   * Useful for custom matching logic beyond simple text includes.
   */
  matchSuggestion?: (filterValue: any, suggestion: any) => boolean
  /**
   * Custom function to get the input text to display for a selected record.
   * Useful when the display text differs from the option text.
   */
  inputText?: (record: any) => string
}

/**
 * Input styling based on ShadCN Input component patterns.
 */
const inputStyles = cn(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
  'ring-offset-background',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

const errorInputStyles = 'border-destructive focus-visible:ring-destructive'

/**
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * AutocompleteInput component for form selection with typeahead.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * <AutocompleteInput
 *   source="status"
 *   label="Status"
 *   choices={[
 *     { id: 'active', name: 'Active' },
 *     { id: 'inactive', name: 'Inactive' },
 *   ]}
 * />
 * ```
 */
export const AutocompleteInput = forwardRef<
  HTMLInputElement,
  AutocompleteInputProps
>(
  (
    {
      source = '' as Path<FieldValues>,
      choices = [],
      label,
      helperText,
      rules,
      validate,
      optionValue = 'id',
      optionText = 'name',
      fullWidth,
      className,
      disabled,
      required,
      create,
      onCreate,
      debounce: debounceDelay = 0,
      openOnFocus = true,
      defaultValue,
      matchSuggestion,
      inputText,
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const inputId = generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const listboxId = `${inputId}-listbox`

    // Combine create and onCreate (create takes precedence)
    const createHandler = typeof create === 'function' ? create : onCreate

    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [debouncedInputValue, setDebouncedInputValue] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [isCreating, setIsCreating] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Merge validate prop with rules
    const mergedRules = mergeValidation(validate, rules)

    // Determine if field is required (from validate prop or required attribute)
    const isRequired = required || hasRequiredValidator(validate)

    // Build rules object, omitting undefined values for exactOptionalPropertyTypes
    const controllerRules = {
      ...mergedRules,
      ...(required && { required: mergedRules?.required || true }),
    }

    const {
      field,
      fieldState: { error },
    } = useController({
      name: source,
      control,
      defaultValue: defaultValue as never,
      rules: controllerRules,
    })

    const showLabel = label !== false
    const displayLabel = typeof label === 'string' ? label : source

    /**
     * Get the display text for a choice
     * Handles string, function, and React element optionText
     */
    const getOptionText = useCallback((choice: AutocompleteChoice): string => {
      if (typeof optionText === 'function') {
        return optionText(choice)
      }
      // For React elements or when optionText is a string field name
      if (typeof optionText === 'string') {
        return String(choice[optionText] ?? '')
      }
      // For React elements, fall back to name or id
      return String(choice['name'] ?? choice['id'] ?? '')
    }, [optionText])

    /**
     * Get the value for a choice
     */
    const getOptionValue = useCallback((choice: AutocompleteChoice): string => {
      return String(choice[optionValue] ?? '')
    }, [optionValue])

    /**
     * Find a choice by value
     */
    const findChoiceByValue = useCallback((value: unknown): AutocompleteChoice | undefined => {
      return choices.find((c) => getOptionValue(c) === String(value))
    }, [choices, getOptionValue])

    // Sync input value with field value
    useEffect(() => {
      if (field.value) {
        const choice = findChoiceByValue(field.value)
        if (choice) {
          setInputValue(getOptionText(choice))
        }
      } else {
        setInputValue('')
      }
    }, [field.value, choices, findChoiceByValue, getOptionText])

    // Debounce effect for filtering
    useEffect(() => {
      if (debounceDelay > 0) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        debounceTimerRef.current = setTimeout(() => {
          setDebouncedInputValue(inputValue)
        }, debounceDelay)
        return () => {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
          }
        }
      } else {
        setDebouncedInputValue(inputValue)
        return undefined
      }
    }, [inputValue, debounceDelay])

    // Use debounced value for filtering
    const filterValue = debounceDelay > 0 ? debouncedInputValue : inputValue

    // Filter choices based on input
    const filteredChoices = useMemo(() => {
      return filterValue
        ? choices.filter((choice) =>
            getOptionText(choice)
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          )
        : choices
    }, [choices, filterValue, getOptionText])

    // Check if there's an exact match (case-insensitive)
    const hasExactMatch = useMemo(() => {
      if (!inputValue) return true
      return choices.some(
        (choice) =>
          getOptionText(choice).toLowerCase() === inputValue.toLowerCase()
      )
    }, [choices, inputValue, getOptionText])

    // Show create option when createHandler is provided (function), there's input, and no exact match
    const showCreateOption = createHandler && inputValue && !hasExactMatch

    // Total number of options including create option
    const totalOptions = filteredChoices.length + (showCreateOption ? 1 : 0)

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      setIsOpen(true)
      setHighlightedIndex(-1)
    }

    const handleInputFocus = () => {
      if (openOnFocus) {
        setIsOpen(true)
      }
    }

    const handleSelect = (choice: AutocompleteChoice) => {
      const value = getOptionValue(choice)
      field.onChange(value)
      setInputValue(getOptionText(choice))
      setIsOpen(false)
    }

    const handleCreate = async () => {
      if (!createHandler || !inputValue || isCreating) return

      setIsCreating(true)
      try {
        const newChoice = await createHandler(inputValue)
        const value = getOptionValue(newChoice)
        field.onChange(value)
        setInputValue(getOptionText(newChoice))
        setIsOpen(false)
      } finally {
        setIsCreating(false)
      }
    }

    const handleClear = () => {
      field.onChange('')
      setInputValue('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < totalOptions - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (highlightedIndex >= 0) {
          // Check if we're on the create option
          if (showCreateOption && highlightedIndex === filteredChoices.length) {
            handleCreate()
          } else if (filteredChoices[highlightedIndex]) {
            handleSelect(filteredChoices[highlightedIndex])
          }
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    return (
      <div
        className={cn('space-y-2', fullWidth && 'w-full')}
        ref={containerRef}
        data-testid="shadmin-autocomplete-input"
      >
        {showLabel && (
          <label htmlFor={inputId} className={labelStyles}>
            {displayLabel}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            {...rest}
            ref={(e) => {
              field.ref(e)
              if (typeof ref === 'function') {
                ref(e)
              } else if (ref) {
                ref.current = e
              }
            }}
            id={inputId}
            name={source}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-autocomplete="list"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            onBlur={field.onBlur}
            className={cn(
              inputStyles,
              error && errorInputStyles,
              'pr-10',
              className
            )}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
          />
          {/* Clear button */}
          {inputValue && !disabled && (
            <button
              type="button"
              aria-label="Clear"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          {/* Dropdown */}
          {isOpen && (
            <ul
              id={listboxId}
              role="listbox"
              className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            >
              {filteredChoices.length === 0 && !showCreateOption ? (
                <li className="px-2 py-1.5 text-sm text-muted-foreground">
                  No options
                </li>
              ) : (
                <>
                  {filteredChoices.map((choice, index) => (
                    <li
                      key={getOptionValue(choice)}
                      role="option"
                      aria-selected={highlightedIndex === index}
                      onClick={() => handleSelect(choice)}
                      className={cn(
                        'cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none',
                        'hover:bg-accent hover:text-accent-foreground',
                        highlightedIndex === index &&
                          'bg-accent text-accent-foreground'
                      )}
                    >
                      {getOptionText(choice)}
                    </li>
                  ))}
                  {showCreateOption && (
                    <li
                      key="__create__"
                      role="option"
                      aria-selected={highlightedIndex === filteredChoices.length}
                      onClick={handleCreate}
                      className={cn(
                        'cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none',
                        'hover:bg-accent hover:text-accent-foreground',
                        highlightedIndex === filteredChoices.length &&
                          'bg-accent text-accent-foreground'
                      )}
                    >
                      Create "{inputValue}"
                    </li>
                  )}
                </>
              )}
            </ul>
          )}
        </div>
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {error.message}
          </p>
        )}
      </div>
    )
  }
)

AutocompleteInput.displayName = 'AutocompleteInput'
