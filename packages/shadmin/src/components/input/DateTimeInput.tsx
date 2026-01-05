/**
 * DateTimeInput Component
 * A form input component for datetime selection that integrates with react-hook-form
 */

import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

/**
 * Props for DateTimeInput component
 */
export interface DateTimeInputProps<T extends FieldValues = FieldValues>
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
 * DateTimeInput component for form datetime selection.
 * Uses the native HTML datetime-local input for broad browser support.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <DateTimeInput source="eventStart" label="Event Start" />
 *
 * // With min/max constraints
 * <DateTimeInput
 *   source="meetingTime"
 *   label="Meeting Time"
 *   min="2024-01-01T09:00"
 *   max="2024-12-31T17:00"
 * />
 *
 * // With validation
 * <DateTimeInput
 *   source="deadline"
 *   label="Deadline"
 *   rules={{
 *     required: 'Deadline is required',
 *     validate: (value) => {
 *       return new Date(value) > new Date() || 'DateTime must be in the future'
 *     },
 *   }}
 * />
 * ```
 */
export const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
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

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
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
          type="datetime-local"
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

DateTimeInput.displayName = 'DateTimeInput'
