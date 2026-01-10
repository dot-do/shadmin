/**
 * AutocompleteArrayInput Component
 * A form input with autocomplete/typeahead functionality for selecting multiple values.
 * Integrates with react-hook-form and stores selections as an array.
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

/**
 * Choice type for autocomplete options
 */
export interface AutocompleteArrayChoice {
  [key: string]: unknown
}

/**
 * Props for AutocompleteArrayInput component
 */
export interface AutocompleteArrayInputProps<T extends FieldValues = FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue' | 'value'> {
  /**
   * The field name in the form data.
   */
  source: Path<T>
  /**
   * Array of choices to display in the autocomplete dropdown.
   */
  choices: AutocompleteArrayChoice[]
  /**
   * Label text displayed above the input.
   * Set to `false` to hide the label completely.
   */
  label?: string | false
  /**
   * Helper text displayed below the input.
   */
  helperText?: string
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
  optionText?: string | ((choice: AutocompleteArrayChoice) => string) | ReactElement
  /**
   * Whether the input should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * Callback to create a new option when the user types a value not in the choices.
   * Should return a promise that resolves to the new choice object.
   * Can also be a React element to render a create dialog.
   */
  create?: ReactElement | ((value: string) => Promise<AutocompleteArrayChoice>)
  /**
   * Legacy prop for create - alias for `create`.
   * @deprecated Use `create` instead
   */
  onCreate?: (value: string) => Promise<AutocompleteArrayChoice>
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
   * Default value for the field (array of values).
   */
  defaultValue?: string[]
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

const errorInputStyles = 'border-destructive focus-visible:ring-destructive'

/**
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * Badge/chip styling for selected items
 */
const badgeStyles = cn(
  'inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground',
  'hover:bg-secondary/80'
)

/**
 * AutocompleteArrayInput component for multi-selection with typeahead.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * <AutocompleteArrayInput
 *   source="tags"
 *   label="Tags"
 *   choices={[
 *     { id: 'react', name: 'React' },
 *     { id: 'vue', name: 'Vue' },
 *     { id: 'angular', name: 'Angular' },
 *   ]}
 * />
 * ```
 */
export const AutocompleteArrayInput = forwardRef<
  HTMLInputElement,
  AutocompleteArrayInputProps
>(
  (
    {
      source,
      choices,
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
    const inputRef = useRef<HTMLInputElement>(null)
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
      defaultValue: (defaultValue ?? []) as never,
      rules: controllerRules,
    })

    // Ensure field value is always an array
    const selectedValues: string[] = Array.isArray(field.value) ? field.value : []

    const showLabel = label !== false
    const displayLabel = typeof label === 'string' ? label : source

    /**
     * Get the display text for a choice
     * Handles string, function, and React element optionText
     */
    const getOptionText = useCallback((choice: AutocompleteArrayChoice): string => {
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
    const getOptionValue = useCallback((choice: AutocompleteArrayChoice): string => {
      return String(choice[optionValue] ?? '')
    }, [optionValue])

    /**
     * Find a choice by value
     */
    const findChoiceByValue = useCallback((value: unknown): AutocompleteArrayChoice | undefined => {
      return choices.find((c) => getOptionValue(c) === String(value))
    }, [choices, getOptionValue])

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

    // Filter choices based on input and exclude already selected values
    const filteredChoices = useMemo(() => {
      const unselectedChoices = choices.filter(
        (choice) => !selectedValues.includes(getOptionValue(choice))
      )
      return filterValue
        ? unselectedChoices.filter((choice) =>
            getOptionText(choice)
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          )
        : unselectedChoices
    }, [choices, filterValue, getOptionText, getOptionValue, selectedValues])

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

    const handleSelect = (choice: AutocompleteArrayChoice) => {
      const value = getOptionValue(choice)
      if (!selectedValues.includes(value)) {
        field.onChange([...selectedValues, value])
      }
      setInputValue('')
      setIsOpen(false)
      // Keep focus on input for additional selections
      inputRef.current?.focus()
    }

    const handleRemove = (valueToRemove: string) => {
      field.onChange(selectedValues.filter((v) => v !== valueToRemove))
    }

    const handleCreate = async () => {
      if (!createHandler || !inputValue || isCreating) return

      setIsCreating(true)
      try {
        const newChoice = await createHandler(inputValue)
        const value = getOptionValue(newChoice)
        if (!selectedValues.includes(value)) {
          field.onChange([...selectedValues, value])
        }
        setInputValue('')
        setIsOpen(false)
      } finally {
        setIsCreating(false)
      }
    }

    const handleClearAll = () => {
      field.onChange([])
      setInputValue('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
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
      } else if (e.key === 'Backspace' && !inputValue && selectedValues.length > 0) {
        // Remove last selected value when backspace is pressed on empty input
        const lastValue = selectedValues[selectedValues.length - 1]
        if (lastValue !== undefined) {
          handleRemove(lastValue)
        }
      }
    }

    return (
      <div
        className={cn('space-y-2', fullWidth && 'w-full')}
        ref={containerRef}
      >
        {showLabel && (
          <label htmlFor={inputId} className={labelStyles}>
            {displayLabel}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {/* Container for chips and input */}
          <div
            className={cn(
              'flex flex-wrap gap-1 min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'ring-offset-background',
              'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
              disabled && 'cursor-not-allowed opacity-50',
              error && errorInputStyles,
              className
            )}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Selected value chips/badges */}
            {selectedValues.map((value) => {
              const choice = findChoiceByValue(value)
              const displayText = choice ? getOptionText(choice) : value
              return (
                <span key={value} className={badgeStyles}>
                  {displayText}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(value)
                      }}
                      className="ml-0.5 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                      aria-label={`Remove ${displayText}`}
                    >
                      <svg
                        width="12"
                        height="12"
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
                </span>
              )
            })}
            {/* Text input for searching */}
            <input
              {...rest}
              ref={(e) => {
                inputRef.current = e
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
              className="flex-1 min-w-[120px] outline-none bg-transparent placeholder:text-muted-foreground"
              disabled={disabled}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={
                error ? errorId : helperText ? helperId : undefined
              }
            />
          </div>
          {/* Clear all button */}
          {selectedValues.length > 0 && !disabled && (
            <button
              type="button"
              aria-label="Clear all"
              onClick={handleClearAll}
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
              aria-multiselectable="true"
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

AutocompleteArrayInput.displayName = 'AutocompleteArrayInput'
