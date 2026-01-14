/**
 * MdxSimpleForm - Form component that connects @mdxui/admin inputs to react-admin context
 *
 * This component provides form state management via react-hook-form while
 * connecting to react-admin's save functionality through EditContext/CreateContext.
 */

import { useCallback, Children, isValidElement, cloneElement, type ReactNode, type ReactElement } from 'react'
import { useForm, FormProvider, type DefaultValues, type Path, type PathValue, type SubmitHandler } from 'react-hook-form'

import { useEditContext, useCreateContext } from '../../../facade'
import { cn } from '../../../utils'

import type { RaRecord } from '../../../types'

/**
 * Props for MdxSimpleForm component
 */
export interface MdxSimpleFormProps<T extends RaRecord = RaRecord> {
  /** Form children (input components) */
  children: ReactNode
  /** Additional CSS class name */
  className?: string
  /** Default values for the form */
  defaultValues?: Partial<T>
  /** Toolbar component */
  toolbar?: ReactElement | false
  /** Validation mode */
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all'
  /** Revalidation mode */
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit'
  /** Transform data before submission */
  transform?: (data: Partial<T>) => Partial<T>
  /** Callback on submit */
  onSubmit?: (data: T) => void
}

/**
 * Default toolbar with save button
 */
function DefaultToolbar() {
  return (
    <div className="flex items-center justify-end gap-2 pt-4 border-t">
      <button
        type="submit"
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium',
          'ring-offset-background transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          'h-10 px-4 py-2'
        )}
      >
        Save
      </button>
    </div>
  )
}

/**
 * MdxSimpleForm - Form that connects @mdxui/admin inputs to react-admin
 *
 * This form component:
 * 1. Provides react-hook-form context to children
 * 2. Connects to EditContext or CreateContext for data
 * 3. Handles form submission via react-admin's save function
 *
 * @example
 * ```tsx
 * import { MdxEdit, MdxSimpleForm } from 'shadmin'
 * import { MdxTextInput, MdxBooleanInput } from 'shadmin/mdxui'
 *
 * <MdxEdit resource="users">
 *   <MdxSimpleForm>
 *     <MdxTextInput source="name" label="Name" />
 *     <MdxTextInput source="email" label="Email" />
 *     <MdxBooleanInput source="active" label="Active" />
 *   </MdxSimpleForm>
 * </MdxEdit>
 * ```
 */
export function MdxSimpleForm<T extends RaRecord = RaRecord>({
  children,
  className,
  defaultValues: defaultValuesProp,
  toolbar,
  mode = 'onBlur',
  reValidateMode = 'onChange',
  transform,
  onSubmit: onSubmitProp,
}: MdxSimpleFormProps<T>) {
  // Try to get context from Edit or Create
  const editContext = useEditContext()
  const createContext = useCreateContext()

  // Determine which context we're in
  const isEdit = Boolean(editContext?.record)
  const context = isEdit ? editContext : createContext
  const { record, save } = context ?? {}

  // Merge default values with record data
  const defaultValues = {
    ...(defaultValuesProp ?? {}),
    ...(record ?? {}),
  } as T

  // Initialize form
  // Type assertion: react-hook-form requires DefaultValues<T> but T extends RaRecord,
  // which includes { id } that may not be in the merged default values at edit time.
  const methods = useForm<T>({
    defaultValues: defaultValues as DefaultValues<T>,
    mode,
    reValidateMode,
  })

  const { handleSubmit, formState: { errors } } = methods

  // Handle form submission
  const onSubmit = useCallback(
    async (data: T) => {
      // Apply transform if provided
      const transformedData = transform ? transform(data) : data

      // Call custom onSubmit if provided
      if (onSubmitProp) {
        onSubmitProp(transformedData as T)
        return
      }

      // Otherwise use react-admin's save function
      if (save) {
        await save(transformedData, {
          onSuccess: () => {
            // Handle redirect if needed
          },
        })
      }
    },
    [save, transform, onSubmitProp]
  )

  // Clone children to inject form props
  const formChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child

    const props = child.props as { source?: string }
    if (!props.source) return child

    const source = props.source
    const fieldError = errors[source as keyof typeof errors]

    // Inject form registration and error state
    // Type assertion: source comes from child props and is dynamically accessed.
    // Path<T> provides type-safe field paths at runtime.
    type FieldPath = Path<T>
    type FieldValue = PathValue<T, FieldPath>
    return cloneElement(child, {
      ...methods.register(source as FieldPath),
      error: fieldError?.message as string | undefined,
      value: methods.getValues(source as FieldPath),
      onChange: (value: unknown) => methods.setValue(source as FieldPath, value as FieldValue),
    } as Record<string, unknown>)
  })

  return (
    <FormProvider {...methods}>
      {/* Type assertion: onSubmit is async but SubmitHandler expects sync return.
          This is safe because handleSubmit handles the Promise internally. */}
      <form onSubmit={handleSubmit(onSubmit as SubmitHandler<T>)} className={cn('space-y-4', className)}>
        <div className="space-y-4">
          {formChildren}
        </div>
        {toolbar !== false && (toolbar ?? <DefaultToolbar />)}
      </form>
    </FormProvider>
  )
}

export default MdxSimpleForm
