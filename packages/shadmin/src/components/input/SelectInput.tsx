/**
 * SelectInput Component
 * A form select component with choices that integrates with react-hook-form
 */

import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

/**
 * Choice type for select options
 */
export interface SelectChoice {
  [key: string]: unknown
}

/**
 * Props for SelectInput component
 */
export interface SelectInputProps<T extends FieldValues = FieldValues>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'defaultValue'> {
  /**
   * The field name in the form data. Maps to the `name` attribute on the select.
   */
  source: Path<T>
  /**
   * Array of choices to display in the select dropdown.
   */
  choices: SelectChoice[]
  /**
   * Label text displayed above the select.
   * If not provided, uses the source field name.
   * Set to `false` to hide the label completely.
   */
  label?: string | false
  /**
   * Helper text displayed below the select.
   */
  helperText?: string
  /**
   * Validation rules passed to react-hook-form.
   */
  rules?: RegisterOptions<T>
  /**
   * The property name to use as the option value.
   * @default 'id'
   */
  optionValue?: string
  /**
   * The property name to use as the option text, or a function to render custom text.
   * @default 'name'
   */
  optionText?: string | ((choice: SelectChoice) => string)
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
      source,
      choices,
      label,
      helperText,
      rules,
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
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const selectId = selectProps?.id || generatedId
    const errorId = `${selectId}-error`
    const helperId = `${selectId}-helper`

    const {
      field,
      fieldState: { error },
    } = useController({
      name: source,
      control,
      rules: {
        ...rules,
        required: required ? (rules?.required || true) : rules?.required,
      },
    })

    const showLabel = label !== false
    const displayLabel = label || source

    /**
     * Get the display text for a choice
     */
    const getOptionText = (choice: SelectChoice): string => {
      if (typeof optionText === 'function') {
        return optionText(choice)
      }
      return String(choice[optionText] ?? '')
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

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {showLabel && (
          <label htmlFor={selectId} className={labelStyles}>
            {displayLabel}
            {required && <span className="text-destructive ml-1">*</span>}
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
