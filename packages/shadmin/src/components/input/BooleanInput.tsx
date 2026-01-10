/**
 * BooleanInput Component
 * A form switch/toggle component for boolean values that integrates with react-hook-form
 */

import { forwardRef, useId, type ButtonHTMLAttributes } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

/**
 * Props for BooleanInput component
 */
export interface BooleanInputProps<T extends FieldValues = FieldValues>
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'name' | 'defaultValue' | 'type' | 'role' | 'value' | 'onChange'> {
  /**
   * The field name in the form data. Maps to the `name` attribute on the switch.
   */
  source: Path<T>
  /**
   * Label text displayed next to the switch.
   * If not provided, uses the source field name.
   * Set to `false` to hide the label completely.
   */
  label?: string | false
  /**
   * Helper text displayed below the switch.
   */
  helperText?: string
  /**
   * Validation rules passed to react-hook-form.
   */
  rules?: RegisterOptions<T>
  /**
   * Whether the switch should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * Default value for the field.
   */
  defaultValue?: boolean
  /**
   * Size of the switch.
   * - "small" or "sm": Small size
   * - "default": Default size
   * - "lg": Large size
   */
  size?: 'small' | 'sm' | 'default' | 'lg'
}

/**
 * Base switch styling based on ShadCN Switch component patterns.
 */
const switchBaseStyles = cn(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
  'transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input'
)

/**
 * Size-specific switch styles
 */
const switchSizeStyles = {
  sm: 'h-5 w-9',
  default: 'h-6 w-11',
  lg: 'h-7 w-14',
}

/**
 * Base switch thumb styling
 */
const thumbBaseStyles = cn(
  'pointer-events-none block rounded-full bg-background shadow-lg ring-0',
  'transition-transform'
)

/**
 * Size-specific thumb styles
 */
const thumbSizeStyles = {
  sm: 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
  default: 'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
  lg: 'h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0',
}

/**
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * BooleanInput component for form boolean values.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BooleanInput source="isActive" label="Active" />
 *
 * // With helper text
 * <BooleanInput
 *   source="notifications"
 *   label="Enable Notifications"
 *   helperText="Receive email notifications for updates"
 * />
 *
 * // Without label
 * <BooleanInput source="hidden" label={false} />
 *
 * // With validation
 * <BooleanInput
 *   source="acceptTerms"
 *   label="Accept Terms"
 *   rules={{
 *     validate: (value) => value === true || 'You must accept the terms'
 *   }}
 * />
 * ```
 */
export const BooleanInput = forwardRef<HTMLButtonElement, BooleanInputProps>(
  (
    {
      source,
      label,
      helperText,
      rules,
      fullWidth,
      className,
      disabled,
      defaultValue = false,
      size = 'default',
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const switchId = generatedId
    const errorId = `${switchId}-error`
    const helperId = `${switchId}-helper`

    const {
      field,
      fieldState: { error },
    } = useController({
      name: source,
      control,
      ...(rules && { rules }),
      defaultValue: defaultValue as never,
    })

    // Normalize "small" to "sm"
    const normalizedSize = size === 'small' ? 'sm' : size

    const showLabel = label !== false
    const displayLabel = label || source
    const isChecked = Boolean(field.value)
    const state = isChecked ? 'checked' : 'unchecked'

    const handleClick = () => {
      if (!disabled) {
        field.onChange(!isChecked)
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        if (!disabled) {
          field.onChange(!isChecked)
        }
      }
    }

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')} data-testid="shadmin-boolean-input">
        <label className="flex items-center gap-3">
          <button
            {...rest}
            ref={(e) => {
              field.ref(e)
              if (typeof ref === 'function') {
                ref(e)
              } else if (ref) {
                ref.current = e
              }
            }}
            id={switchId}
            name={field.name}
            type="button"
            role="switch"
            aria-checked={isChecked}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            data-state={state}
            className={cn(switchBaseStyles, switchSizeStyles[normalizedSize], className)}
            disabled={disabled}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onBlur={field.onBlur}
          >
            <span data-state={state} className={cn(thumbBaseStyles, thumbSizeStyles[normalizedSize])} />
          </button>
          {showLabel && (
            <span className={labelStyles}>
              {displayLabel}
            </span>
          )}
        </label>
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

BooleanInput.displayName = 'BooleanInput'
