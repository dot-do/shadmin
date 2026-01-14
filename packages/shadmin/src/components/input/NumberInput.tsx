/**
 * NumberInput Component
 * A form input component for number entry that integrates with react-hook-form
 */

import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'

import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'
import { type ValidateProp, mergeValidation, hasRequiredValidator } from '../../validation/adapter'

/**
 * Props for NumberInput component
 */
export interface NumberInputProps<T extends FieldValues = FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue' | 'type'> {
  /**
   * The field name in the form data. Maps to the `name` attribute on the input.
   */
  source: Path<T>
  /**
   * Label text displayed above the input.
   * If not provided, uses the source field name.
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
   * @example
   * validate={required()}
   * validate={[required(), minValue(0)]}
   */
  validate?: ValidateProp
  /**
   * Additional props passed directly to the input element.
   */
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  /**
   * Whether the input should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * Default value for the field.
   */
  defaultValue?: number
}

/**
 * Input styling based on ShadCN Input component patterns.
 */
const inputStyles = cn(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
  'ring-offset-background',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
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
 * NumberInput component for form number entry.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <NumberInput source="age" label="Age" />
 *
 * // With min/max validation
 * <NumberInput
 *   source="quantity"
 *   label="Quantity"
 *   min={1}
 *   max={100}
 *   rules={{
 *     min: { value: 1, message: 'Minimum quantity is 1' },
 *     max: { value: 100, message: 'Maximum quantity is 100' },
 *   }}
 * />
 *
 * // With step for decimals
 * <NumberInput
 *   source="price"
 *   label="Price"
 *   step={0.01}
 * />
 * ```
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      source,
      label,
      helperText,
      rules,
      validate,
      inputProps,
      fullWidth,
      className,
      disabled,
      required,
      readOnly,
      placeholder,
      min,
      max,
      step,
      autoFocus,
      defaultValue,
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const inputId = inputProps?.id || generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

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

    // Convert value to number on change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value === '') {
        field.onChange('')
      } else {
        const numValue = parseFloat(value)
        field.onChange(isNaN(numValue) ? value : numValue)
      }
    }

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')} data-testid="shadmin-number-input">
        {showLabel && (
          <label htmlFor={inputId} className={labelStyles}>
            {displayLabel}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <input
          {...rest}
          {...inputProps}
          ref={(e) => {
            field.ref(e)
            if (typeof ref === 'function') {
              ref(e)
            } else if (ref) {
              ref.current = e
            }
          }}
          id={inputId}
          name={field.name}
          type="number"
          value={field.value ?? ''}
          onChange={handleChange}
          onBlur={field.onBlur}
          className={cn(
            inputStyles,
            error && errorInputStyles,
            className,
            inputProps?.className
          )}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          autoFocus={autoFocus}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
        />
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

NumberInput.displayName = 'NumberInput'
