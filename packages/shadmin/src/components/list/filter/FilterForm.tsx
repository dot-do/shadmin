import {
  type ReactNode,
  type FormHTMLAttributes,
  useEffect,
  useCallback,
  useContext,
} from 'react'
import { useForm, FormProvider, type UseFormReturn, type FieldValues, type DefaultValues, type Path, type PathValue } from 'react-hook-form'

import { ListContext, type FilterPayload } from '@/contexts/ListContext'
import { cn } from '@/utils'

/**
 * Props for FilterForm component
 */
export interface FilterFormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'onSubmit'> {
  /** Form children - can be ReactNode or render prop */
  children:
    | ReactNode
    | ((props: UseFormReturn<TFieldValues> & { reset: () => void }) => ReactNode)
  /** Default form values */
  defaultValues?: Partial<TFieldValues>
  /** Custom onSubmit handler */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

/**
 * FilterForm component wraps filter inputs and handles form submission.
 * Integrates with ListContext to update filter state.
 *
 * @example
 * ```tsx
 * <FilterForm defaultValues={{ search: '' }}>
 *   <input name="search" />
 *   <button type="submit">Apply</button>
 * </FilterForm>
 * ```
 *
 * @example With render prop for access to form methods
 * ```tsx
 * <FilterForm>
 *   {({ reset }) => (
 *     <>
 *       <input name="search" />
 *       <button type="button" onClick={() => reset()}>Clear</button>
 *     </>
 *   )}
 * </FilterForm>
 * ```
 */
export function FilterForm<TFieldValues extends FieldValues = FieldValues>({
  children,
  className,
  defaultValues,
  onSubmit: customOnSubmit,
  ...props
}: FilterFormProps<TFieldValues>) {
  // Use context optionally - FilterForm can work without ListContext for standalone filter forms
  const listContext = useContext(ListContext)
  const filterValues = listContext?.filterValues ?? {}
  const setFilters = listContext?.setFilters
  const setPage = listContext?.setPage

  // Merge defaultValues with filterValues from context
  const mergedDefaultValues = {
    ...defaultValues,
    ...filterValues,
  } as TFieldValues

  // Type assertion: react-hook-form's generic constraints require DefaultValues<T>
  // but merged values from context may include additional fields not in TFieldValues.
  // This is safe because useForm accepts partial default values at runtime.
  const form = useForm<TFieldValues>({
    defaultValues: mergedDefaultValues as DefaultValues<TFieldValues>,
  })

  const { handleSubmit, reset: formReset, setValue, watch: _watch } = form

  // Sync form values with filterValues from context
  // Type assertion: filterValues keys come from context and may not be statically known.
  // Path<T> and PathValue<T,P> provide type-safe field access at runtime.
  useEffect(() => {
    Object.entries(filterValues).forEach(([key, value]) => {
      setValue(key as Path<TFieldValues>, value as PathValue<TFieldValues, Path<TFieldValues>>)
    })
  }, [filterValues, setValue])

  const handleFormSubmit = useCallback(
    (data: TFieldValues) => {
      // Reset page to 1 when filters change
      setPage?.(1)
      // Update filters in context
      setFilters?.(data as unknown as FilterPayload)
    },
    [setFilters, setPage]
  )

  const handleReset = useCallback(() => {
    // Reset form to empty state
    // Type assertion: defaultValues is Partial<T> but formReset expects DefaultValues<T>.
    // DefaultValues<T> is a mapped type that makes all fields optional with undefined.
    formReset(defaultValues as DefaultValues<TFieldValues>)
    // Reset page to 1
    setPage?.(1)
    // Clear all filters
    setFilters?.({})
  }, [formReset, defaultValues, setPage, setFilters])

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (customOnSubmit) {
        customOnSubmit(e)
      }
      handleSubmit(handleFormSubmit)(e)
    },
    [customOnSubmit, handleSubmit, handleFormSubmit]
  )

  // Prepare props for render prop
  const formProps = {
    ...form,
    reset: handleReset,
  }

  return (
    <FormProvider {...form}>
      <form
        role="form"
        className={cn('filter-form', className)}
        onSubmit={onSubmit}
        data-testid="shadmin-filter-form"
        {...props}
      >
        {typeof children === 'function' ? children(formProps) : children}
      </form>
    </FormProvider>
  )
}

FilterForm.displayName = 'FilterForm'
