/**
 * ArrayInput Component
 * A form container for managing arrays of form data using react-hook-form's useFieldArray
 */

import {
  createContext,
  useContext,
  forwardRef,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import {
  useFieldArray,
  useFormContext,
  type RegisterOptions,
  type FieldValues,
  type Path,
  type UseFieldArrayReturn,
  type FieldArrayPath,
} from 'react-hook-form'
import { cn } from '../../utils'

/**
 * Context value for ArrayInput
 */
export interface ArrayInputContextValue {
  /** The source/field name for the array */
  source: string
  /** Field array methods from react-hook-form */
  fieldArray: UseFieldArrayReturn<FieldValues, FieldArrayPath<FieldValues>>
  /** Whether the array is disabled */
  disabled?: boolean
  /** Default value for new items */
  defaultValue?: Record<string, unknown>
  /** Minimum number of items */
  minItems?: number
  /** Maximum number of items */
  maxItems?: number
}

/**
 * Context for ArrayInput to pass field array methods to children
 */
export const ArrayInputContext = createContext<ArrayInputContextValue | undefined>(undefined)

ArrayInputContext.displayName = 'ArrayInputContext'

/**
 * Hook to access ArrayInput context
 */
export function useArrayInputContext(): ArrayInputContextValue {
  const context = useContext(ArrayInputContext)
  if (!context) {
    throw new Error('useArrayInputContext must be used within an ArrayInput')
  }
  return context
}

/**
 * Props for ArrayInput component
 */
export interface ArrayInputProps<T extends FieldValues = FieldValues>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /**
   * The field name in the form data. Maps to the array field.
   */
  source: FieldArrayPath<T>
  /**
   * Label text displayed above the array.
   * If not provided, uses the source field name.
   * Set to `false` to hide the label completely.
   */
  label?: string | false
  /**
   * Helper text displayed below the array.
   */
  helperText?: string
  /**
   * Validation rules passed to react-hook-form.
   */
  rules?: RegisterOptions<T>
  /**
   * Default value for new items when added.
   */
  defaultValue?: Record<string, unknown>
  /**
   * Minimum number of items in the array.
   */
  minItems?: number
  /**
   * Maximum number of items in the array.
   */
  maxItems?: number
  /**
   * Whether the input should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * Whether the input is disabled.
   */
  disabled?: boolean
  /**
   * Children components (should include SimpleFormIterator)
   */
  children?: ReactNode
}

/**
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * ArrayInput component for managing arrays of form data.
 * Integrates with react-hook-form through FormContext using useFieldArray.
 *
 * @example
 * ```tsx
 * // Basic usage with tags
 * <ArrayInput source="tags">
 *   <SimpleFormIterator>
 *     <TextInput source="name" />
 *   </SimpleFormIterator>
 * </ArrayInput>
 *
 * // With multiple fields per item
 * <ArrayInput source="addresses" label="Addresses">
 *   <SimpleFormIterator>
 *     <TextInput source="street" label="Street" />
 *     <TextInput source="city" label="City" />
 *     <TextInput source="zipCode" label="ZIP Code" />
 *   </SimpleFormIterator>
 * </ArrayInput>
 *
 * // With min/max constraints
 * <ArrayInput source="contacts" minItems={1} maxItems={5}>
 *   <SimpleFormIterator>
 *     <TextInput source="email" />
 *   </SimpleFormIterator>
 * </ArrayInput>
 *
 * // With default value for new items
 * <ArrayInput source="items" defaultValue={{ name: '', quantity: 1 }}>
 *   <SimpleFormIterator>
 *     <TextInput source="name" />
 *     <NumberInput source="quantity" />
 *   </SimpleFormIterator>
 * </ArrayInput>
 * ```
 */
export const ArrayInput = forwardRef<HTMLDivElement, ArrayInputProps>(
  (
    {
      source,
      label,
      helperText,
      rules,
      defaultValue,
      minItems,
      maxItems,
      fullWidth,
      disabled,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const { control, formState } = useFormContext()
    const generatedId = useId()
    const fieldId = generatedId
    const errorId = `${fieldId}-error`
    const helperId = `${fieldId}-helper`

    const fieldArray = useFieldArray({
      control,
      name: source,
      rules,
    })

    const showLabel = label !== false
    const displayLabel = label || source

    // Get error for the array field
    const error = formState.errors[source]
    const errorMessage = error?.root?.message || error?.message

    const contextValue: ArrayInputContextValue = {
      source,
      fieldArray,
      disabled,
      defaultValue,
      minItems,
      maxItems,
    }

    return (
      <ArrayInputContext.Provider value={contextValue}>
        <div
          {...rest}
          ref={ref}
          role="group"
          aria-labelledby={showLabel ? `${fieldId}-label` : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn('space-y-2', fullWidth && 'w-full', className)}
        >
          {showLabel && (
            <label id={`${fieldId}-label`} className={labelStyles}>
              {displayLabel}
            </label>
          )}
          {children}
          {helperText && !error && (
            <p id={helperId} className="text-sm text-muted-foreground">
              {helperText}
            </p>
          )}
          {errorMessage && (
            <p id={errorId} className="text-sm text-destructive">
              {String(errorMessage)}
            </p>
          )}
        </div>
      </ArrayInputContext.Provider>
    )
  }
)

ArrayInput.displayName = 'ArrayInput'
