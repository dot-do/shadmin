import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
  FormProvider,
  useFormContext as useRHFFormContext,
  type UseFormReturn,
  type FieldValues,
} from 'react-hook-form'

import type { RaRecord } from '../types'

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
 * Context for shadmin-specific form properties.
 *
 * Note: The context uses FieldValues as the base type. Type narrowing is done
 * in the consuming hooks through type assertions, which is safe because
 * the provider ensures the correct type is passed.
 */
export const FormContext = createContext<ShadminFormContextValue<FieldValues> | undefined>(undefined)

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
  // Memoize the shadmin context to prevent unnecessary re-renders
  const shadminContext = useMemo<ShadminFormContextValue<T>>(
    () => ({
      record,
      resource,
      save,
      saving,
      mutationMode,
      onDelete,
    }),
    [record, resource, save, saving, mutationMode, onDelete]
  )

  return (
    <FormProvider {...formMethods}>
      {/* TYPE ASSERTION: Context stores FieldValues base type; consumers narrow via generics.
          Safe because T extends FieldValues guarantees structural compatibility.
          See: ARCHITECTURE.md#type-assertions */}
      <FormContext.Provider value={shadminContext as ShadminFormContextValue<FieldValues>}>
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
  const rawContext = useContext(FormContext)
  // TYPE ASSERTION: Provider ensures correct type structure. Context stores FieldValues
  // base type; caller narrows via generic T. See: ARCHITECTURE.md#type-assertions
  const shadminContext = rawContext as ShadminFormContextValue<T> | undefined

  // Memoize the combined context to prevent unnecessary re-renders in consumers
  return useMemo(
    () => ({
      ...rhfContext,
      record: shadminContext?.record,
      resource: shadminContext?.resource,
      save: shadminContext?.save,
      saving: shadminContext?.saving,
      mutationMode: shadminContext?.mutationMode,
      onDelete: shadminContext?.onDelete,
    }),
    [rhfContext, shadminContext]
  )
}
