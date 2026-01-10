/**
 * TextInput Component
 * A form input component for text entry that integrates with react-hook-form
 */

import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'
import { type ValidateProp, mergeValidation, hasRequiredValidator } from '../../validation/adapter'

/**
 * Props for TextInput component
 */
export interface TextInputProps<T extends FieldValues = FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue'> {
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
   * validate={[required(), minLength(3)]}
   */
  validate?: ValidateProp
  /**
   * Additional props passed directly to the input element.
   */
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  /**
   * Props passed to the underlying Input component (Material-UI style passthrough).
   * Alias for inputProps for react-admin compatibility.
   */
  InputProps?: InputHTMLAttributes<HTMLInputElement>
  /**
   * Whether the input should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * If true, renders a textarea element instead of an input.
   * For react-admin compatibility.
   */
  multiline?: boolean
  /**
   * Number of rows for multiline mode.
   */
  rows?: number
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
 * Input styling based on ShadCN Input component patterns.
 */
const inputStyles = cn(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
  'ring-offset-background',
  'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

const errorInputStyles = 'border-destructive focus-visible:ring-destructive'

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
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * TextInput component for form text entry.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TextInput source="firstName" label="First Name" />
 *
 * // With validation
 * <TextInput
 *   source="email"
 *   label="Email"
 *   rules={{
 *     required: 'Email is required',
 *     pattern: {
 *       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
 *       message: 'Invalid email format',
 *     },
 *   }}
 * />
 *
 * // With helper text
 * <TextInput
 *   source="username"
 *   label="Username"
 *   helperText="Choose a unique username"
 * />
 * ```
 */
export const TextInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextInputProps>(
  (
    {
      source,
      label,
      helperText,
      rules,
      validate,
      inputProps,
      InputProps,
      fullWidth,
      className,
      disabled,
      required,
      readOnly,
      placeholder,
      maxLength,
      autoFocus,
      multiline,
      rows,
      defaultValue,
      resettable,
      ...rest
    },
    ref
  ) => {
    // Merge inputProps and InputProps (InputProps takes precedence for react-admin compat)
    const mergedInputProps = { ...inputProps, ...InputProps }
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

    // Determine if clear button should be shown
    const showClearButton = resettable && field.value && !disabled && !readOnly

    // Handler to clear/reset the field value
    const handleClear = () => {
      field.onChange('')
    }

    // Common props for both input and textarea
    const commonProps = {
      id: inputId,
      name: field.name,
      value: field.value ?? '',
      onChange: field.onChange,
      onBlur: field.onBlur,
      className: cn(
        inputStyles,
        multiline && 'min-h-20 resize-y',
        error && errorInputStyles,
        resettable && 'pr-10',
        className,
        mergedInputProps?.className
      ),
      disabled,
      required,
      readOnly,
      placeholder,
      maxLength,
      autoFocus,
      'aria-invalid': error ? ('true' as const) : undefined,
      'aria-describedby': error ? errorId : helperText ? helperId : undefined,
    }

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {showLabel && (
          <label htmlFor={inputId} className={labelStyles}>
            {displayLabel}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className={cn('relative', fullWidth && 'w-full')}>
          {multiline ? (
            <textarea
              {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              {...(mergedInputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              {...commonProps}
              rows={rows}
              ref={(e) => {
                field.ref(e)
                if (typeof ref === 'function') {
                  ref(e as HTMLInputElement | HTMLTextAreaElement)
                } else if (ref) {
                  (ref as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = e
                }
              }}
            />
          ) : (
            <input
              {...rest}
              {...mergedInputProps}
              {...commonProps}
              type="text"
              ref={(e) => {
                field.ref(e)
                if (typeof ref === 'function') {
                  ref(e as HTMLInputElement | HTMLTextAreaElement)
                } else if (ref) {
                  (ref as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = e
                }
              }}
            />
          )}
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'p-1 rounded-sm',
                'text-muted-foreground hover:text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'transition-colors'
              )}
              aria-label="Clear input"
            >
              <XIcon className="h-4 w-4" />
            </button>
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

TextInput.displayName = 'TextInput'
