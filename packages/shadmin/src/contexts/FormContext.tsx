import { createContext, useContext, type ReactNode } from 'react'
import {
  FormProvider,
  useFormContext as useRHFFormContext,
  type UseFormReturn,
  type FieldValues,
} from 'react-hook-form'
import type { RaRecord } from './RecordContext'

/**
 * Mutation mode for form operations
 * - pessimistic: Wait for server response before updating UI
 * - optimistic: Update UI immediately, rollback on error
 * - undoable: Update UI immediately with undo option
 */
export type MutationMode = 'pessimistic' | 'optimistic' | 'undoable'

/**
 * Shadmin-specific form context properties extending react-hook-form
 */
export interface ShadminFormContextValue<T extends FieldValues = FieldValues> {
  /** The current record being edited */
  record?: RaRecord | undefined
  /** Resource name */
  resource?: string | undefined
  /** Save function */
  save?: ((data: T) => void | Promise<void>) | undefined
  /** Whether the form is currently saving */
  saving?: boolean | undefined
  /** Mutation mode */
  mutationMode?: MutationMode | undefined
  /** Delete function */
  onDelete?: (() => void | Promise<void>) | undefined
}

/**
 * Combined form context type (react-hook-form + shadmin extensions)
 */
export type ShadminFormContext<T extends FieldValues = FieldValues> =
  UseFormReturn<T> & ShadminFormContextValue<T>

/**
 * Context for shadmin-specific form properties
 */
export const FormContext = createContext<ShadminFormContextValue | undefined>(undefined)

FormContext.displayName = 'FormContext'

/**
 * Props for FormContextProvider
 */
export type FormContextProviderProps<T extends FieldValues = FieldValues> =
  ShadminFormContext<T> & {
    children?: ReactNode
  }

/**
 * Provider component for FormContext.
 * Combines react-hook-form's FormProvider with shadmin-specific context.
 *
 * @example
 * ```tsx
 * const form = useForm({ defaultValues: { name: '' } })
 *
 * <FormContextProvider {...form} resource="users" save={handleSave}>
 *   <TextInput source="name" />
 * </FormContextProvider>
 * ```
 */
export function FormContextProvider<T extends FieldValues = FieldValues>({
  children,
  record,
  resource,
  save,
  saving,
  mutationMode,
  onDelete,
  ...formMethods
}: FormContextProviderProps<T>) {
  const shadminContext: ShadminFormContextValue<T> = {
    record,
    resource,
    save,
    saving,
    mutationMode,
    onDelete,
  }

  return (
    <FormProvider {...formMethods}>
      <FormContext.Provider value={shadminContext as ShadminFormContextValue}>
        {children}
      </FormContext.Provider>
    </FormProvider>
  )
}

/**
 * Hook to access react-hook-form methods from FormContext.
 * This is a re-export of react-hook-form's useFormContext.
 * Throws an error if used outside of a FormProvider.
 *
 * @example
 * ```tsx
 * const { control, handleSubmit, formState } = useFormContext<MyFormType>()
 * ```
 */
export function useFormContext<T extends FieldValues = FieldValues>(): UseFormReturn<T> {
  return useRHFFormContext<T>()
}

/**
 * Hook to access the full shadmin form context (react-hook-form + shadmin extensions).
 * Returns undefined for shadmin properties if not provided.
 *
 * @example
 * ```tsx
 * const { record, resource, save, saving, mutationMode, control, handleSubmit } = useShadminFormContext()
 * ```
 */
export function useShadminFormContext<T extends FieldValues = FieldValues>():
  UseFormReturn<T> & ShadminFormContextValue<T> {
  const rhfContext = useRHFFormContext<T>()
  const shadminContext = useContext(FormContext) as ShadminFormContextValue<T> | undefined

  return {
    ...rhfContext,
    record: shadminContext?.record,
    resource: shadminContext?.resource,
    save: shadminContext?.save,
    saving: shadminContext?.saving,
    mutationMode: shadminContext?.mutationMode,
    onDelete: shadminContext?.onDelete,
  }
}
