/**
 * FormDataConsumer Component and useFormData Hook
 *
 * Provides reactive access to form data within form children.
 * Two patterns are supported:
 * 1. Render props pattern via FormDataConsumer component
 * 2. Hook pattern via useFormData hook
 *
 * Both patterns efficiently watch form values and re-render only when
 * the watched data changes, leveraging react-hook-form's useWatch.
 *
 * @module FormDataConsumer
 */

import { useMemo, type ReactNode } from 'react'
import { useFormContext, useWatch, type FieldValues, type UseFormReturn, type Path } from 'react-hook-form'

/**
 * Type helper for extracting nested property types from an object
 * Used for type-safe scoped form data access
 */
type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? PathValue<T[Key], Rest>
    : unknown
  : P extends keyof T
    ? T[P]
    : unknown

/**
 * Props passed to the FormDataConsumer render function.
 * Contains the current form data and methods to interact with the form.
 *
 * @template T - The form data type extending FieldValues
 * @template TSource - Optional source path for scoped data access
 */
export interface FormDataConsumerRenderProps<
  T extends FieldValues = FieldValues,
  TSource extends string | undefined = undefined
> {
  /**
   * Current form data (all watched values).
   * Updates reactively when any form field changes.
   */
  formData: T
  /**
   * Scoped form data when source prop is provided.
   * Contains only the data at the specified path.
   * Type is inferred from the source path when possible.
   */
  scopedFormData: TSource extends string ? PathValue<T, TSource> : undefined
  /**
   * Set a form field value programmatically.
   * @see https://react-hook-form.com/docs/useform/setvalue
   */
  setValue: UseFormReturn<T>['setValue']
  /**
   * Get current form values (snapshot, not reactive).
   * @see https://react-hook-form.com/docs/useform/getvalues
   */
  getValues: UseFormReturn<T>['getValues']
  /**
   * Form state from react-hook-form (errors, isDirty, isValid, etc.).
   * @see https://react-hook-form.com/docs/useform/formstate
   */
  formState: UseFormReturn<T>['formState']
  /**
   * Trigger validation for specific fields or the entire form.
   * @see https://react-hook-form.com/docs/useform/trigger
   */
  trigger: UseFormReturn<T>['trigger']
  /**
   * Reset form to default values or provided values.
   * @see https://react-hook-form.com/docs/useform/reset
   */
  reset: UseFormReturn<T>['reset']
  /**
   * Clear errors for specific fields or all fields.
   * @see https://react-hook-form.com/docs/useform/clearerrors
   */
  clearErrors: UseFormReturn<T>['clearErrors']
  /**
   * Set error for a specific field manually.
   * @see https://react-hook-form.com/docs/useform/seterror
   */
  setError: UseFormReturn<T>['setError']
}

/**
 * Props for FormDataConsumer component
 *
 * @template T - The form data type extending FieldValues
 * @template TSource - Optional source path type for scoped data access
 */
export interface FormDataConsumerProps<
  T extends FieldValues = FieldValues,
  TSource extends Path<T> | undefined = undefined
> {
  /**
   * Render function that receives form data and methods.
   * Called on every form data change with updated values.
   */
  children: (props: FormDataConsumerRenderProps<T, TSource extends Path<T> ? TSource : undefined>) => ReactNode
  /**
   * Optional source path to scope the form data.
   * When provided, scopedFormData will contain only the data at that path.
   * Supports dot notation for nested access (e.g., "user.address.city").
   */
  source?: TSource
}

/**
 * Get nested value from an object using dot notation path.
 * Safely traverses the object tree, returning undefined for missing paths.
 *
 * @param obj - The object to traverse
 * @param path - Dot-notation path (e.g., "user.address.city")
 * @returns The value at the path, or undefined if not found
 *
 * @example
 * getNestedValue({ user: { name: 'John' } }, 'user.name') // 'John'
 * getNestedValue({ user: { name: 'John' } }, 'user.age')  // undefined
 */
function getNestedValue<T>(obj: Record<string, unknown>, path: string): T | undefined {
  if (!path) return undefined

  const parts = path.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined
    }
    if (typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[part]
  }

  return current as T | undefined
}

/**
 * Options for the useFormData hook
 */
export interface UseFormDataOptions<T extends FieldValues = FieldValues> {
  /**
   * Optional source path to scope the form data.
   * When provided, scopedFormData will contain only the data at that path.
   */
  source?: Path<T> | undefined
}

/**
 * Hook for accessing form data reactively.
 * Alternative to FormDataConsumer for cases where hooks are preferred over render props.
 *
 * This hook must be used within a FormProvider context (e.g., inside SimpleForm).
 *
 * @template T - The form data type extending FieldValues
 * @param options - Optional configuration with source path for scoped data
 * @returns Object containing form data, scoped data, and form methods
 *
 * @example
 * ```tsx
 * // Basic usage - access all form data
 * function MyComponent() {
 *   const { formData, setValue } = useFormData<MyFormType>()
 *
 *   return (
 *     <button onClick={() => setValue('count', formData.count + 1)}>
 *       Count: {formData.count}
 *     </button>
 *   )
 * }
 *
 * // With scoped data access
 * function AddressDisplay() {
 *   const { scopedFormData } = useFormData<MyFormType>({ source: 'address' })
 *
 *   return <div>City: {scopedFormData?.city}</div>
 * }
 * ```
 *
 * @throws Error if used outside of a FormProvider context
 */
export function useFormData<T extends FieldValues = FieldValues>(
  options: UseFormDataOptions<T> = {}
): FormDataConsumerRenderProps<T, typeof options.source> {
  const { source } = options

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

  // Memoize scoped data computation
  const scopedFormData = useMemo(() => {
    if (!source) return undefined
    return getNestedValue<PathValue<T, typeof source>>(
      formData as unknown as Record<string, unknown>,
      source
    )
  }, [formData, source])

  // Memoize the return object to prevent unnecessary re-renders in consumers
  // Note: formState is a Proxy and changes on every render, but its internal
  // values are stable. Methods are stable references from useFormContext.
  return useMemo(
    () => ({
      formData,
      scopedFormData: scopedFormData as typeof options.source extends string
        ? PathValue<T, typeof options.source>
        : undefined,
      setValue,
      getValues,
      formState,
      trigger,
      reset,
      clearErrors,
      setError,
    }),
    [formData, scopedFormData, setValue, getValues, formState, trigger, reset, clearErrors, setError]
  )
}

/**
 * FormDataConsumer component for accessing form data in render props pattern.
 * Allows children to reactively access and modify form data.
 *
 * For a hooks-based alternative, see {@link useFormData}.
 *
 * @template T - The form data type extending FieldValues
 * @template TSource - Optional source path type for scoped data access
 *
 * @example
 * ```tsx
 * // Basic usage - conditional rendering based on form data
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
 * // Using form methods to programmatically update values
 * <FormDataConsumer>
 *   {({ formData, setValue }) => (
 *     <button
 *       type="button"
 *       onClick={() => setValue('quantity', (formData.quantity || 0) + 1)}
 *     >
 *       Increment ({formData.quantity})
 *     </button>
 *   )}
 * </FormDataConsumer>
 *
 * // With scoped data access for nested objects
 * <FormDataConsumer source="address">
 *   {({ scopedFormData, formData }) => (
 *     <div>
 *       Street: {scopedFormData?.street}
 *       Full data: {JSON.stringify(formData)}
 *     </div>
 *   )}
 * </FormDataConsumer>
 *
 * // Accessing form state for validation display
 * <FormDataConsumer>
 *   {({ formState }) => (
 *     formState.errors.email && (
 *       <div className="error">{formState.errors.email.message}</div>
 *     )
 *   )}
 * </FormDataConsumer>
 * ```
 */
export function FormDataConsumer<
  T extends FieldValues = FieldValues,
  TSource extends Path<T> | undefined = undefined
>({
  children,
  source,
}: FormDataConsumerProps<T, TSource>): ReactNode {
  // Delegate to useFormData hook for implementation
  // This ensures consistent behavior between component and hook patterns
  const formDataProps = useFormData<T>({ source: source as Path<T> | undefined })

  // Cast is safe because the types are designed to match
  return children(formDataProps as FormDataConsumerRenderProps<T, TSource extends Path<T> ? TSource : undefined>)
}

FormDataConsumer.displayName = 'FormDataConsumer'
