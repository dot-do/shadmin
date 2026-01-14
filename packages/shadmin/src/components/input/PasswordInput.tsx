/**
 * PasswordInput Component
 * A form input component for password entry with show/hide toggle
 */

import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'

import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

/**
 * Props for PasswordInput component
 */
export interface PasswordInputProps<T extends FieldValues = FieldValues>
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
  'disabled:cursor-not-allowed disabled:opacity-50',
  'pr-10' // Extra padding for the toggle button
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
 * Toggle button styling
 */
const toggleButtonStyles = cn(
  'absolute right-3 top-1/2 -translate-y-1/2',
  'text-muted-foreground hover:text-foreground',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm'
)

/**
 * Eye icon for showing password
 */
function EyeIcon({ className }: { className?: string }) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

/**
 * Eye-off icon for hiding password
 */
function EyeOffIcon({ className }: { className?: string }) {
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
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

/**
 * PasswordInput component for form password entry.
 * Integrates with react-hook-form through FormContext.
 * Includes a toggle button to show/hide the password.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PasswordInput source="password" label="Password" />
 *
 * // With validation
 * <PasswordInput
 *   source="password"
 *   label="Password"
 *   rules={{
 *     required: 'Password is required',
 *     minLength: {
 *       value: 8,
 *       message: 'Password must be at least 8 characters',
 *     },
 *   }}
 * />
 *
 * // With autoComplete for password managers
 * <PasswordInput
 *   source="confirmPassword"
 *   label="Confirm Password"
 *   autoComplete="new-password"
 * />
 * ```
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
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
      placeholder,
      autoComplete,
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

    const [showPassword, setShowPassword] = useState(false)

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

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev)
    }

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')} data-testid="shadmin-password-input">
        {showLabel && (
          <label htmlFor={inputId} className={labelStyles}>
            {displayLabel}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
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
            type={showPassword ? 'text' : 'password'}
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
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={toggleButtonStyles}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
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

PasswordInput.displayName = 'PasswordInput'
