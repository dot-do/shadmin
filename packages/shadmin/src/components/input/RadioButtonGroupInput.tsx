/**
 * RadioButtonGroupInput Component
 * A form radio button group component with choices that integrates with react-hook-form
 */

import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

/**
 * Choice type for radio options
 */
export interface RadioChoice {
  [key: string]: unknown
}

/**
 * Props for RadioButtonGroupInput component
 */
export interface RadioButtonGroupInputProps<T extends FieldValues = FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue' | 'type'> {
  /**
   * The field name in the form data. Maps to the `name` attribute on the radios.
   */
  source: Path<T>
  /**
   * Array of choices to display as radio buttons.
   */
  choices: RadioChoice[]
  /**
   * Label text displayed above the radio group.
   * If not provided, uses the source field name.
   * Set to `false` to hide the label completely.
   */
  label?: string | false
  /**
   * Helper text displayed below the radio group.
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
  optionText?: string | ((choice: RadioChoice) => string)
  /**
   * The property name to check for disabling individual options.
   */
  disableValue?: string
  /**
   * Whether to display radio buttons in a row (horizontal).
   * @default false (vertical/column layout)
   */
  row?: boolean
}

/**
 * Radio button styling based on ShadCN RadioGroup component patterns.
 */
const radioStyles = cn(
  'aspect-square h-4 w-4 rounded-full border border-primary text-primary',
  'ring-offset-background',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50'
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
 * RadioButtonGroupInput component for form selection.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage with default id/name fields
 * <RadioButtonGroupInput
 *   source="status"
 *   label="Status"
 *   choices={[
 *     { id: 'active', name: 'Active' },
 *     { id: 'inactive', name: 'Inactive' },
 *   ]}
 * />
 *
 * // With custom value/text fields
 * <RadioButtonGroupInput
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
 * // Horizontal layout
 * <RadioButtonGroupInput
 *   source="priority"
 *   label="Priority"
 *   choices={priorities}
 *   row
 * />
 *
 * // With custom text renderer
 * <RadioButtonGroupInput
 *   source="user"
 *   label="User"
 *   choices={users}
 *   optionText={(choice) => `${choice.firstName} ${choice.lastName}`}
 * />
 * ```
 */
export const RadioButtonGroupInput = forwardRef<HTMLInputElement, RadioButtonGroupInputProps>(
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

    const controllerRules = {
      ...rules,
      ...(required ? { required: rules?.required || true } : rules?.required !== undefined ? { required: rules.required } : {}),
    }

    const {
      field,
      fieldState: { error },
    } = useController({
      name: source,
      control,
      ...(Object.keys(controllerRules).length > 0 && { rules: controllerRules }),
    })

    const showLabel = label !== false
    const displayLabel = label || source

    /**
     * Get the display text for a choice
     */
    const getOptionText = (choice: RadioChoice): string => {
      if (typeof optionText === 'function') {
        return optionText(choice)
      }
      return String(choice[optionText] ?? '')
    }

    /**
     * Get the value for a choice
     */
    const getOptionValue = (choice: RadioChoice): string => {
      return String(choice[optionValue] ?? '')
    }

    /**
     * Check if an option should be disabled
     */
    const isOptionDisabled = (choice: RadioChoice): boolean => {
      if (disabled) return true
      if (!disableValue) return false
      return Boolean(choice[disableValue])
    }

    return (
      <div className={cn('space-y-2', className)}>
        {showLabel && (
          <div className={groupLabelStyles}>
            {displayLabel}
            {required && <span className="text-destructive ml-1">*</span>}
          </div>
        )}
        <div
          role="radiogroup"
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

            return (
              <div key={value} className="flex items-center space-x-2">
                <input
                  {...rest}
                  type="radio"
                  id={optionId}
                  name={field.name}
                  value={value}
                  checked={field.value === value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  ref={index === 0 ? ref : undefined}
                  className={cn(radioStyles)}
                  disabled={optionDisabled}
                  required={required}
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

RadioButtonGroupInput.displayName = 'RadioButtonGroupInput'
