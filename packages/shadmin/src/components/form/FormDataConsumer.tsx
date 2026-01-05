/**
 * FormDataConsumer Component
 * Provides access to form data within form children using a render prop pattern.
 */

import { type ReactNode } from 'react'
import { useFormContext, useWatch, type FieldValues, type UseFormReturn } from 'react-hook-form'

/**
 * Props passed to the FormDataConsumer render function
 */
export interface FormDataConsumerRenderProps<T extends FieldValues = FieldValues> {
  /**
   * Current form data (all watched values)
   */
  formData: T
  /**
   * Scoped form data when source prop is provided
   */
  scopedFormData?: unknown
  /**
   * Set a form field value
   */
  setValue: UseFormReturn<T>['setValue']
  /**
   * Get current form values
   */
  getValues: UseFormReturn<T>['getValues']
  /**
   * Form state from react-hook-form
   */
  formState: UseFormReturn<T>['formState']
  /**
   * Trigger validation for specific fields
   */
  trigger: UseFormReturn<T>['trigger']
  /**
   * Reset form to default values
   */
  reset: UseFormReturn<T>['reset']
  /**
   * Clear errors for specific fields
   */
  clearErrors: UseFormReturn<T>['clearErrors']
  /**
   * Set error for a specific field
   */
  setError: UseFormReturn<T>['setError']
}

/**
 * Props for FormDataConsumer component
 */
export interface FormDataConsumerProps<T extends FieldValues = FieldValues> {
  /**
   * Render function that receives form data and methods
   */
  children: (props: FormDataConsumerRenderProps<T>) => ReactNode
  /**
   * Optional source path to scope the form data
   * When provided, scopedFormData will contain only the data at that path
   */
  source?: string
}

/**
 * Get nested value from an object using dot notation path
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

/**
 * FormDataConsumer component for accessing form data in render props pattern.
 * Allows children to reactively access and modify form data.
 *
 * @example
 * ```tsx
 * // Basic usage - access form data
 * <SimpleForm onSubmit={handleSubmit}>
 *   <TextInput source="type" />
 *   <FormDataConsumer>
 *     {({ formData }) => (
 *       formData.type === 'premium' && (
 *         <TextInput source="discountCode" />
 *       )
 *     )}
 *   </FormDataConsumer>
 * </SimpleForm>
 *
 * // Using form methods
 * <FormDataConsumer>
 *   {({ formData, setValue }) => (
 *     <button
 *       type="button"
 *       onClick={() => setValue('quantity', (formData.quantity || 0) + 1)}
 *     >
 *       Increment
 *     </button>
 *   )}
 * </FormDataConsumer>
 *
 * // With scoped data access
 * <FormDataConsumer source="address">
 *   {({ scopedFormData, formData }) => (
 *     <div>
 *       Street: {scopedFormData?.street}
 *       Full data: {JSON.stringify(formData)}
 *     </div>
 *   )}
 * </FormDataConsumer>
 * ```
 */
export function FormDataConsumer<T extends FieldValues = FieldValues>({
  children,
  source,
}: FormDataConsumerProps<T>): ReactNode {
  const {
    control,
    setValue,
    getValues,
    formState,
    trigger,
    reset,
    clearErrors,
    setError,
  } = useFormContext<T>()

  // Watch all form values for reactivity
  const formData = useWatch({ control }) as T

  // Get scoped data if source is provided
  const scopedFormData = source
    ? getNestedValue(formData as unknown as Record<string, unknown>, source)
    : undefined

  return children({
    formData,
    scopedFormData,
    setValue,
    getValues,
    formState,
    trigger,
    reset,
    clearErrors,
    setError,
  })
}

FormDataConsumer.displayName = 'FormDataConsumer'
