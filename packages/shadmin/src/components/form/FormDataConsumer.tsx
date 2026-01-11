/**
 * FormDataConsumer Component and useFormData Hook
 *
 * Provides reactive access to form data within form children.
 *
 * **RECOMMENDED**: Use the `useFormData` hook for new code.
 * The `FormDataConsumer` component is provided for backward compatibility
 * but the hooks pattern is preferred for cleaner, more composable code.
 *
 * ## Migration from FormDataConsumer to useFormData
 *
 * The render props pattern creates deeper nesting and makes code harder to test.
 * The hooks pattern is more composable and follows React best practices.
 *
 * ### Before (Render Props - Legacy Pattern)
 * ```tsx
 * <SimpleForm onSubmit={handleSubmit}>
 *   <TextInput source="type" />
 *   <FormDataConsumer>
 *     {({ formData, setValue }) => (
 *       formData.type === 'premium' && (
 *         <TextInput source="discountCode" />
 *       )
 *     )}
 *   </FormDataConsumer>
 * </SimpleForm>
 * ```
 *
 * ### After (Hooks - Recommended Pattern)
 * ```tsx
 * function ConditionalDiscountCode() {
 *   const { formData } = useFormData<{ type: string }>()
 *   if (formData.type !== 'premium') return null
 *   return <TextInput source="discountCode" />
 * }
 *
 * <SimpleForm onSubmit={handleSubmit}>
 *   <TextInput source="type" />
 *   <ConditionalDiscountCode />
 * </SimpleForm>
 * ```
 *
 * ## Benefits of Hooks Pattern
 *
 * 1. **Testability**: Components using hooks are easier to test in isolation
 * 2. **Composition**: Hooks compose naturally with other hooks
 * 3. **Readability**: Less nesting, clearer data flow
 * 4. **Type Safety**: TypeScript inference works better with hooks
 * 5. **Reusability**: Extract logic into custom hooks
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
 *
 * **This is the RECOMMENDED pattern** for accessing form data in shadmin.
 * It provides cleaner, more composable code compared to the render props pattern.
 *
 * This hook must be used within a FormProvider context (e.g., inside SimpleForm).
 *
 * @template T - The form data type extending FieldValues
 * @param options - Optional configuration with source path for scoped data
 * @returns Object containing form data, scoped data, and form methods
 *
 * ## Basic Usage
 *
 * @example
 * ```tsx
 * // Access all form data
 * function MyComponent() {
 *   const { formData, setValue } = useFormData<MyFormType>()
 *
 *   return (
 *     <button onClick={() => setValue('count', formData.count + 1)}>
 *       Count: {formData.count}
 *     </button>
 *   )
 * }
 * ```
 *
 * ## Conditional Rendering
 *
 * @example
 * ```tsx
 * // Show/hide fields based on form values
 * function PremiumFields() {
 *   const { formData } = useFormData<{ tier: string }>()
 *
 *   if (formData.tier !== 'premium') return null
 *
 *   return (
 *     <>
 *       <TextInput source="discountCode" />
 *       <NumberInput source="customLimit" />
 *     </>
 *   )
 * }
 * ```
 *
 * ## Scoped Data Access
 *
 * @example
 * ```tsx
 * // Access nested data with type safety
 * interface UserForm {
 *   user: { address: { city: string; zip: string } }
 * }
 *
 * function AddressDisplay() {
 *   const { scopedFormData } = useFormData<UserForm>({ source: 'user.address' })
 *
 *   return (
 *     <div>
 *       City: {scopedFormData?.city}, Zip: {scopedFormData?.zip}
 *     </div>
 *   )
 * }
 * ```
 *
 * ## Validation and Form State
 *
 * @example
 * ```tsx
 * // Access form state and trigger validation
 * function FormStatus() {
 *   const { formState, trigger } = useFormData()
 *
 *   return (
 *     <div>
 *       <span>{formState.isDirty ? 'Modified' : 'Unchanged'}</span>
 *       <button type="button" onClick={() => trigger()}>
 *         Validate All
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 *
 * ## Computed Values
 *
 * @example
 * ```tsx
 * // Create derived values from form data
 * function OrderTotal() {
 *   const { formData } = useFormData<{ items: { price: number; qty: number }[] }>()
 *
 *   const total = useMemo(() =>
 *     formData.items?.reduce((sum, item) => sum + item.price * item.qty, 0) ?? 0,
 *     [formData.items]
 *   )
 *
 *   return <div>Total: ${total.toFixed(2)}</div>
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
 *
 * **DEPRECATION NOTICE**: This component uses the render props pattern which
 * creates deeper nesting and is harder to test. Consider migrating to the
 * `useFormData` hook for new code.
 *
 * @deprecated Prefer using `useFormData` hook instead. See module documentation
 * for migration examples. This component will continue to work but the hooks
 * pattern is the recommended approach.
 *
 * @template T - The form data type extending FieldValues
 * @template TSource - Optional source path type for scoped data access
 *
 * ## Why Migrate to useFormData?
 *
 * | Aspect | FormDataConsumer | useFormData |
 * |--------|------------------|-------------|
 * | Nesting | Deep nesting with render props | Flat component structure |
 * | Testing | Hard to test inline functions | Easy to test components |
 * | Types | Complex generic inference | Cleaner type inference |
 * | Composition | Limited | Composes with other hooks |
 *
 * ## Migration Example
 *
 * @example
 * ```tsx
 * // Before (FormDataConsumer)
 * <FormDataConsumer>
 *   {({ formData }) => (
 *     formData.type === 'premium' && <TextInput source="code" />
 *   )}
 * </FormDataConsumer>
 *
 * // After (useFormData hook)
 * function PremiumField() {
 *   const { formData } = useFormData<{ type: string }>()
 *   if (formData.type !== 'premium') return null
 *   return <TextInput source="code" />
 * }
 * ```
 *
 * ## Legacy Usage Examples
 *
 * These patterns still work but are not recommended for new code:
 *
 * @example
 * ```tsx
 * // Conditional rendering based on form data
 * <FormDataConsumer>
 *   {({ formData }) => (
 *     formData.type === 'premium' && (
 *       <TextInput source="discountCode" />
 *     )
 *   )}
 * </FormDataConsumer>
 *
 * // Programmatically update values
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
 * // Scoped data access for nested objects
 * <FormDataConsumer source="address">
 *   {({ scopedFormData }) => (
 *     <div>Street: {scopedFormData?.street}</div>
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
