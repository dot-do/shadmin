/**
 * CheckboxGroupInput Component
 * A form checkbox group component with choices that integrates with react-hook-form
 * Stores an array of selected values for multi-select functionality
 */

import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'
import { type CheckboxChoice } from './types'

// Re-export CheckboxChoice for backwards compatibility
export type { CheckboxChoice } from './types'

/**
 * Props for CheckboxGroupInput component
 */
export interface CheckboxGroupInputProps<T extends FieldValues = FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue' | 'type'> {
  /**
   * The field name in the form data. Maps to the `name` attribute on the checkboxes.
   */
  source: Path<T>
  /**
   * Array of choices to display as checkboxes.
   */
  choices: CheckboxChoice[]
  /**
   * Label text displayed above the checkbox group.
   * If not provided, uses the source field name.
   * Set to `false` to hide the label completely.
   */
  label?: string | false
  /**
   * Helper text displayed below the checkbox group.
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionText?: string | ((choice: any) => string)
  /**
   * The property name to check for disabling individual options.
   */
  disableValue?: string
  /**
   * Whether to display checkboxes in a row (horizontal).
   * @default false (vertical/column layout)
   */
  row?: boolean
}

/**
 * Checkbox styling based on ShadCN Checkbox component patterns.
 */
const checkboxStyles = cn(
  'peer h-4 w-4 shrink-0 rounded-sm border border-primary',
  'ring-offset-background',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
  'accent-primary'
)

/**
 * Label styling based on ShadCN Label component patterns.
 */
const groupLabelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * Option label styling
 */
const optionLabelStyles = cn(
  'text-sm font-normal leading-none cursor-pointer',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * CheckboxGroupInput component for multi-select form selection.
 * Integrates with react-hook-form through FormContext.
 * Stores an array of selected values.
 *
 * @example
 * ```tsx
 * // Basic usage with default id/name fields
 * <CheckboxGroupInput
 *   source="permissions"
 *   label="Permissions"
 *   choices={[
 *     { id: 'read', name: 'Read' },
 *     { id: 'write', name: 'Write' },
 *     { id: 'delete', name: 'Delete' },
 *   ]}
 * />
 *
 * // With custom value/text fields
 * <CheckboxGroupInput
 *   source="roles"
 *   label="Roles"
 *   choices={[
 *     { value: 'admin', label: 'Administrator' },
 *     { value: 'user', label: 'Regular User' },
 *   ]}
 *   optionValue="value"
 *   optionText="label"
 * />
 *
 * // Horizontal layout
 * <CheckboxGroupInput
 *   source="features"
 *   label="Features"
 *   choices={features}
 *   row
 * />
 *
 * // With validation
 * <CheckboxGroupInput
 *   source="terms"
 *   label="Agreements"
 *   choices={terms}
 *   rules={{
 *     validate: (value) => value.length > 0 || 'At least one selection is required'
 *   }}
 * />
 * ```
 */
export const CheckboxGroupInput = forwardRef<HTMLInputElement, CheckboxGroupInputProps>(
  (
    {
      source,
      choices,
      label,
      helperText,
      rules,
      optionValue = 'id',
      optionText = 'name',
      disableValue,
      row = false,
      className,
      disabled,
      required,
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const groupId = generatedId
    const errorId = `${groupId}-error`
    const helperId = `${groupId}-helper`

    const {
      field,
      fieldState: { error },
    } = useController({
      name: source,
      control,
      ...(rules !== undefined && { rules }),
      defaultValue: [] as unknown as Parameters<typeof useController<FieldValues, Path<FieldValues>>>['0']['defaultValue'],
    })

    const showLabel = label !== false
    const displayLabel = label || source

    // Ensure field value is always an array
    const selectedValues: string[] = Array.isArray(field.value) ? field.value : []

    /**
     * Get the display text for a choice
     */
    const getOptionText = (choice: CheckboxChoice): string => {
      if (typeof optionText === 'function') {
        return optionText(choice)
      }
      return String(choice[optionText] ?? '')
    }

    /**
     * Get the value for a choice
     */
    const getOptionValue = (choice: CheckboxChoice): string => {
      return String(choice[optionValue] ?? '')
    }

    /**
     * Check if an option should be disabled
     */
    const isOptionDisabled = (choice: CheckboxChoice): boolean => {
      if (disabled) return true
      if (!disableValue) return false
      return Boolean(choice[disableValue])
    }

    /**
     * Handle checkbox change - toggle value in array
     */
    const handleChange = (value: string, isChecked: boolean) => {
      let newValues: string[]
      if (isChecked) {
        // Add value to array
        newValues = [...selectedValues, value]
      } else {
        // Remove value from array
        newValues = selectedValues.filter((v) => v !== value)
      }
      field.onChange(newValues)
    }

    return (
      <div className={cn('space-y-2', className)} data-testid="shadmin-checkbox-group-input">
        {showLabel && (
          <div className={groupLabelStyles}>
            {displayLabel}
            {required && <span className="text-destructive ml-1">*</span>}
          </div>
        )}
        <div
          role="group"
          aria-labelledby={showLabel ? `${groupId}-label` : undefined}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'flex gap-3',
            row ? 'flex-row flex-wrap' : 'flex-col'
          )}
        >
          {choices.map((choice, index) => {
            const value = getOptionValue(choice)
            const text = getOptionText(choice)
            const optionDisabled = isOptionDisabled(choice)
            const optionId = `${groupId}-${value}`
            const isChecked = selectedValues.includes(value)

            return (
              <div key={value} className="flex items-center space-x-2">
                <input
                  {...rest}
                  type="checkbox"
                  id={optionId}
                  name={field.name}
                  value={value}
                  checked={isChecked}
                  onChange={(e) => handleChange(value, e.target.checked)}
                  onBlur={field.onBlur}
                  ref={index === 0 ? ref : undefined}
                  className={cn(checkboxStyles)}
                  disabled={optionDisabled}
                  aria-invalid={error ? 'true' : undefined}
                />
                <label htmlFor={optionId} className={optionLabelStyles}>
                  {text}
                </label>
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

CheckboxGroupInput.displayName = 'CheckboxGroupInput'
