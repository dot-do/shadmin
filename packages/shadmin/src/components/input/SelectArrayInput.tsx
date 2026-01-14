/**
 * SelectArrayInput Component
 * A form multi-select component for array values that integrates with react-hook-form
 */

import { forwardRef, useId, type HTMLAttributes } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'

import { type SelectArrayChoice } from './types'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

// Re-export SelectArrayChoice for backwards compatibility
export type { SelectArrayChoice } from './types'

/**
 * Props for SelectArrayInput component
 */
export interface SelectArrayInputProps<T extends FieldValues = FieldValues>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /**
   * The field name in the form data. Maps to the stored array value.
   */
  source: Path<T>
  /**
   * Array of choices to display in the select.
   */
  choices: SelectArrayChoice[]
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Allows strongly-typed callbacks without casting; see types.ts OptionTextProp
  optionText?: string | ((choice: any) => string)
  /**
   * Whether the select should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * Whether the input is disabled.
   */
  disabled?: boolean
  /**
   * Whether the input is required.
   */
  required?: boolean
}

/**
 * Listbox styling based on ShadCN patterns.
 */
const listboxStyles = cn(
  'w-full rounded-md border border-input bg-background p-1',
  'ring-offset-background',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
)

const errorListboxStyles = 'border-destructive focus-visible:ring-destructive'

/**
 * Option styling based on ShadCN patterns.
 */
const optionStyles = cn(
  'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm',
  'outline-none',
  'hover:bg-accent hover:text-accent-foreground',
  'aria-selected:bg-accent aria-selected:text-accent-foreground',
  'aria-disabled:pointer-events-none aria-disabled:opacity-50'
)

/**
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * Checkmark icon for selected options
 */
function CheckIcon({ className }: { className?: string }) {
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
      role="img"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

/**
 * SelectArrayInput component for multi-select form fields.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage with default id/name fields
 * <SelectArrayInput
 *   source="tags"
 *   label="Tags"
 *   choices={[
 *     { id: 'tech', name: 'Technology' },
 *     { id: 'news', name: 'News' },
 *   ]}
 * />
 *
 * // With custom value/text fields
 * <SelectArrayInput
 *   source="languages"
 *   label="Languages"
 *   choices={[
 *     { value: 'js', label: 'JavaScript' },
 *     { value: 'ts', label: 'TypeScript' },
 *   ]}
 *   optionValue="value"
 *   optionText="label"
 * />
 *
 * // With validation
 * <SelectArrayInput
 *   source="categories"
 *   label="Categories"
 *   choices={categories}
 *   rules={{
 *     validate: (value) => value.length > 0 || 'Select at least one category'
 *   }}
 * />
 * ```
 */
export const SelectArrayInput = forwardRef<HTMLDivElement, SelectArrayInputProps>(
  (
    {
      source,
      choices,
      label,
      helperText,
      rules,
      optionValue = 'id',
      optionText = 'name',
      fullWidth,
      className,
      disabled,
      required,
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const listboxId = generatedId
    const errorId = `${listboxId}-error`
    const helperId = `${listboxId}-helper`

    const {
      field,
      fieldState: { error },
    } = useController({
      name: source,
      control,
      ...(rules !== undefined && { rules }),
      defaultValue: [] as never,
    })

    const showLabel = label !== false
    const displayLabel = label || source
    const selectedValues: string[] = Array.isArray(field.value) ? field.value : []

    /**
     * Get the display text for a choice
     */
    const getOptionText = (choice: SelectArrayChoice): string => {
      if (typeof optionText === 'function') {
        return optionText(choice)
      }
      return String(choice[optionText] ?? '')
    }

    /**
     * Get the value for a choice
     */
    const getOptionValue = (choice: SelectArrayChoice): string => {
      return String(choice[optionValue] ?? '')
    }

    /**
     * Check if an option is selected
     */
    const isSelected = (choice: SelectArrayChoice): boolean => {
      const value = getOptionValue(choice)
      return selectedValues.includes(value)
    }

    /**
     * Toggle selection of an option
     */
    const toggleOption = (choice: SelectArrayChoice) => {
      if (disabled) return

      const value = getOptionValue(choice)
      const newValues = isSelected(choice)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value]

      field.onChange(newValues)
    }

    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, choice: SelectArrayChoice) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggleOption(choice)
      }
    }

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')} data-testid="shadmin-select-array-input">
        {showLabel && (
          <label id={`${listboxId}-label`} className={labelStyles}>
            {displayLabel}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div
          {...rest}
          ref={ref}
          id={listboxId}
          role="listbox"
          aria-labelledby={showLabel ? `${listboxId}-label` : undefined}
          aria-multiselectable="true"
          aria-disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            listboxStyles,
            error && errorListboxStyles,
            className
          )}
          tabIndex={disabled ? -1 : 0}
          onBlur={field.onBlur}
        >
          {choices.map((choice) => {
            const value = getOptionValue(choice)
            const text = getOptionText(choice)
            const selected = isSelected(choice)

            return (
              <div
                key={value}
                role="option"
                aria-selected={selected}
                aria-disabled={disabled}
                className={optionStyles}
                onClick={() => toggleOption(choice)}
                onKeyDown={(e) => handleKeyDown(e, choice)}
                tabIndex={disabled ? -1 : 0}
              >
                <span className="flex-1">{text}</span>
                {selected && (
                  <CheckIcon className="h-4 w-4 shrink-0" />
                )}
              </div>
            )
          })}
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

SelectArrayInput.displayName = 'SelectArrayInput'
