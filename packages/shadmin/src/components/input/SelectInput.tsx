/**
 * SelectInput Component
 * A form select component with choices that integrates with react-hook-form
 */

import { forwardRef, useId, type SelectHTMLAttributes, type ReactElement } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'
import { type ValidateProp, mergeValidation, hasRequiredValidator } from '../../validation/adapter'
import { type SelectChoice } from './types'

// Re-export SelectChoice for backwards compatibility
export type { SelectChoice } from './types'

/**
 * Props for SelectInput component
 *
 * @template T - The form field values type (from react-hook-form)
 */
export interface SelectInputProps<T extends FieldValues = FieldValues>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'defaultValue'> {
  /**
   * The field name in the form data. Maps to the `name` attribute on the select.
   * Optional when used inside ReferenceInput (provided via context).
   */
  source?: Path<T>
  /**
   * Array of choices to display in the select dropdown.
   * Optional when used inside ReferenceInput (provided via context).
   */
  choices?: SelectChoice[]
  /**
   * Label text displayed above the select.
   * If not provided, uses the source field name.
   * Set to `false` to hide the label completely.
   */
  label?: string | false
  /**
   * Helper text displayed below the select.
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionText?: string | ((choice: any) => string) | ReactElement
  /**
   * Text to display for the empty/placeholder option.
   * If not provided, no empty option is rendered.
   */
  emptyText?: string
  /**
   * The property name to check for disabling individual options.
   */
  disableValue?: string
  /**
   * Additional props passed directly to the select element.
   */
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>
  /**
   * Whether the select should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * React element to render for creating new options.
   */
  create?: ReactElement
  /**
   * Default value for the field.
   */
  defaultValue?: string
  /**
   * If true, displays a clear button to reset the field value.
   * React-admin compatible prop.
   */
  resettable?: boolean
}

/**
 * Select styling based on ShadCN Select component patterns.
 */
const selectStyles = cn(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
  'ring-offset-background',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'appearance-none cursor-pointer'
)

const errorSelectStyles = 'border-destructive focus:ring-destructive'

/**
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * Chevron icon for select dropdown indicator
 */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/**
 * X icon for clear/reset button
 */
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

/**
 * SelectInput component for form selection.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage with default id/name fields
 * <SelectInput
 *   source="status"
 *   label="Status"
 *   choices={[
 *     { id: 'active', name: 'Active' },
 *     { id: 'inactive', name: 'Inactive' },
 *   ]}
 * />
 *
 * // With custom value/text fields
 * <SelectInput
 *   source="country"
 *   label="Country"
 *   choices={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *   ]}
 *   optionValue="value"
 *   optionText="label"
 * />
 *
 * // With empty placeholder
 * <SelectInput
 *   source="category"
 *   label="Category"
 *   choices={categories}
 *   emptyText="Select a category"
 * />
 *
 * // With custom text renderer
 * <SelectInput
 *   source="user"
 *   label="User"
 *   choices={users}
 *   optionText={(choice) => `${choice.firstName} ${choice.lastName}`}
 * />
 * ```
 */
export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
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
      emptyText,
      disableValue,
      selectProps,
      fullWidth,
      className,
      disabled,
      required,
      autoFocus,
      create,
      defaultValue,
      resettable,
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const selectId = selectProps?.id || generatedId
    const errorId = `${selectId}-error`
    const helperId = `${selectId}-helper`

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
    const displayLabel = label || source

    /**
     * Get the display text for a choice
     * Handles string, function, and React element optionText
     */
    const getOptionText = (choice: SelectChoice): string => {
      if (typeof optionText === 'function') {
        return optionText(choice)
      }
      // For React elements or when optionText is a string field name
      if (typeof optionText === 'string') {
        return String(choice[optionText] ?? '')
      }
      // For React elements, fall back to name or id
      return String(choice['name'] ?? choice['id'] ?? '')
    }

    /**
     * Get the value for a choice
     */
    const getOptionValue = (choice: SelectChoice): string => {
      return String(choice[optionValue] ?? '')
    }

    /**
     * Check if an option should be disabled
     */
    const isOptionDisabled = (choice: SelectChoice): boolean => {
      if (!disableValue) return false
      return Boolean(choice[disableValue])
    }

    // Determine if clear button should be shown
    const showClearButton = resettable && field.value && !disabled

    // Handler to clear/reset the field value
    const handleClear = () => {
      field.onChange('')
    }

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')} data-testid="shadmin-select-input">
        {showLabel && (
          <label htmlFor={selectId} className={labelStyles}>
            {displayLabel}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            {...field}
            {...rest}
            {...selectProps}
            ref={(e) => {
              field.ref(e)
              if (typeof ref === 'function') {
                ref(e)
              } else if (ref) {
                ref.current = e
              }
            }}
            id={selectId}
            className={cn(
              selectStyles,
              error && errorSelectStyles,
              resettable && 'pr-16',
              className,
              selectProps?.className
            )}
            disabled={disabled}
            required={required}
            autoFocus={autoFocus}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
          >
            {emptyText && (
              <option value="">{emptyText}</option>
            )}
            {choices.map((choice) => {
              const value = getOptionValue(choice)
              const text = getOptionText(choice)
              const isDisabled = isOptionDisabled(choice)

              return (
                <option key={value} value={value} disabled={isDisabled}>
                  {text}
                </option>
              )
            })}
          </select>
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'absolute right-8 top-1/2 -translate-y-1/2',
                'p-1 rounded-sm',
                'text-muted-foreground hover:text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'transition-colors'
              )}
              aria-label="Clear selection"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
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

SelectInput.displayName = 'SelectInput'
