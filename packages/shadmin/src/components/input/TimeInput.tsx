/**
 * TimeInput Component
 * A form input component for time selection that integrates with react-hook-form
 */

import { forwardRef, useId, useMemo, type InputHTMLAttributes } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'

import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

/**
 * Props for TimeInput component
 */
export interface TimeInputProps<T extends FieldValues = FieldValues>
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
   * Additional props passed directly to the input element.
   */
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  /**
   * Whether the input should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * Custom error message when time is before the min time.
   * Defaults to "Time must be on or after {min}"
   */
  minMessage?: string
  /**
   * Custom error message when time is after the max time.
   * Defaults to "Time must be on or before {max}"
   */
  maxMessage?: string
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
 * TimeInput component for form time selection.
 * Uses the native HTML time input for broad browser support.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TimeInput source="startTime" label="Start Time" />
 *
 * // With min/max constraints
 * <TimeInput
 *   source="meetingTime"
 *   label="Meeting Time"
 *   min="09:00"
 *   max="17:00"
 * />
 *
 * // With step for granularity (in seconds)
 * <TimeInput
 *   source="precisetime"
 *   label="Precise Time"
 *   step={60}
 * />
 * ```
 */
export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      source,
      label,
      helperText,
      rules,
      inputProps,
      fullWidth,
      className,
      disabled,
      required,
      readOnly,
      min,
      max,
      minMessage,
      maxMessage,
      step,
      autoFocus,
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const inputId = inputProps?.id || generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    // Convert min/max to strings for comparison (they can be string | number from InputHTMLAttributes)
    const minStr = min !== undefined ? String(min) : undefined
    const maxStr = max !== undefined ? String(max) : undefined

    // Build validation rules including min/max checks
    const validationRules = useMemo((): RegisterOptions => {
      const existingValidate = rules?.validate

      const minMaxValidate = (value: string) => {
        if (!value) return true // Don't validate empty values (use required for that)

        if (minStr && value < minStr) {
          return minMessage || `Time must be on or after ${minStr}`
        }

        if (maxStr && value > maxStr) {
          return maxMessage || `Time must be on or before ${maxStr}`
        }

        return true
      }

      // Merge with existing validate rules
      let mergedValidate: RegisterOptions['validate']

      if (existingValidate) {
        if (typeof existingValidate === 'function') {
          mergedValidate = {
            minMax: minMaxValidate,
            custom: existingValidate,
          }
        } else {
          mergedValidate = {
            minMax: minMaxValidate,
            ...existingValidate,
          }
        }
      } else if (minStr || maxStr) {
        mergedValidate = minMaxValidate
      }

      return {
        ...rules,
        ...(required ? { required: rules?.required || true } : rules?.required !== undefined ? { required: rules.required } : {}),
        ...(mergedValidate !== undefined && { validate: mergedValidate }),
      }
    }, [rules, required, minStr, maxStr, minMessage, maxMessage])

    const {
      field,
      fieldState: { error },
    } = useController({
      name: source,
      control,
      ...(Object.keys(validationRules).length > 0 && { rules: validationRules }),
    })

    const showLabel = label !== false
    const displayLabel = label || source

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')} data-testid="shadmin-time-input">
        {showLabel && (
          <label htmlFor={inputId} className={labelStyles}>
            {displayLabel}
            {required && <span className="text-destructive ml-1">*</span>}
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
          type="time"
          value={field.value ?? ''}
          onChange={field.onChange}
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

TimeInput.displayName = 'TimeInput'
