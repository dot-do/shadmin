import {
  type ReactNode,
  type FormHTMLAttributes,
  useEffect,
  useCallback,
} from 'react'
import { useForm, FormProvider, type UseFormReturn, type FieldValues } from 'react-hook-form'
import { ListContext, type FilterPayload } from '@/contexts/ListContext'
import { useContext } from 'react'
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

  // Type assertions required: react-hook-form's generic constraints don't allow
  // dynamically constructed default values without explicit casting
  const form = useForm<TFieldValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: mergedDefaultValues as any,
  })

  const { handleSubmit, reset: formReset, setValue, watch: _watch } = form

  // Sync form values with filterValues from context
  // Type assertions required: filterValues keys come from context and may not match TFieldValues at compile time
  useEffect(() => {
    Object.entries(filterValues).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(key as any, value as any)
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
    // Type assertion required: defaultValues may be undefined which useForm accepts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formReset(defaultValues as any)
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
