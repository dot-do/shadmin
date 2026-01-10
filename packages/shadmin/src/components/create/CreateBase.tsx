/**
 * CreateBase Component
 * Core create logic without UI wrapper - provides CreateContext to children
 * 100% API-compatible with react-admin CreateBase
 *
 * Epic: shadmin-ha1 (P1)
 */

import { type ReactNode, useCallback, useMemo, useState, useRef } from 'react'
import { useForm, type FieldValues } from 'react-hook-form'
import { CreateContextProvider, type SaveHandler } from './CreateContext'
import { ResourceContextProvider, useResourceContext } from '../../contexts/ResourceContext'
import { FormContextProvider } from '../../contexts/FormContext'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { useCreate, type UseCreateOptions } from '../../hooks/useCreate'
import { useRedirect, type RedirectTo } from '../../hooks/useRedirect'
import { useNotify } from '../../hooks/useNotify'
import type { RaRecord } from 'ra-core'

/**
 * Transform function type
 */
export type TransformData<TData = Record<string, unknown>> = (
  data: TData
) => TData | Promise<TData>

/**
 * Context passed to onBeforeSave callback for create
 */
export interface CreateBeforeSaveContext<TData = Record<string, unknown>> {
  resource: string
  data: TData
}

/**
 * Context passed to onAfterSave callback for create
 */
export interface CreateAfterSaveContext<RecordType extends RaRecord = RaRecord, TData = Record<string, unknown>> {
  resource: string
  data: TData
  result: { data: RecordType }
}

/**
 * Props for CreateBase component
 */
export interface CreateBaseProps<
  RecordType extends RaRecord = RaRecord,
  TData = Record<string, unknown>,
> {
  /** The name of the resource to create. If not provided, uses ResourceContext */
  resource?: string | undefined
  /** Child elements to render inside the CreateContext */
  children: ReactNode
  /** Where to redirect after successful create. Defaults to 'list' */
  redirect?: RedirectTo | undefined
  /** Function to transform data before submission */
  transform?: TransformData<TData> | undefined
  /** Mutation options passed to useCreate */
  mutationOptions?: UseCreateOptions<RecordType, TData> | undefined
  /** Disable the success notification */
  disableSuccessNotification?: boolean | undefined
  /** Disable the error notification */
  disableErrorNotification?: boolean | undefined
  /** Called before save - can modify data or abort by returning false or throwing */
  onBeforeSave?: (context: CreateBeforeSaveContext<TData>) => TData | false | void | Promise<TData | false | void>
  /** Called after successful save */
  onAfterSave?: (context: CreateAfterSaveContext<RecordType, TData>) => void | Promise<void>
}

/**
 * CreateBase - Core create component that provides CreateContext without UI wrapper
 *
 * Use this component when you want to create a custom create UI while reusing
 * the create logic (form submission, redirect, notifications).
 *
 * @example
 * ```tsx
 * // Basic usage with custom UI
 * <CreateBase resource="posts">
 *   <MyCustomCreateForm />
 * </CreateBase>
 *
 * // With all options
 * <CreateBase
 *   resource="posts"
 *   redirect="show"
 *   transform={(data) => ({ ...data, createdAt: new Date() })}
 *   mutationOptions={{ onSuccess: () => console.log('Created!') }}
 * >
 *   <MyCustomCreateForm />
 * </CreateBase>
 * ```
 */
export function CreateBase<
  RecordType extends RaRecord = RaRecord,
  TData = Record<string, unknown>,
>({
  resource: resourceProp,
  children,
  redirect: redirectTo = 'list',
  transform,
  mutationOptions,
  disableSuccessNotification = false,
  disableErrorNotification = false,
  onBeforeSave,
  onAfterSave,
}: CreateBaseProps<RecordType, TData>) {
  // Get resource from context if not provided
  const resourceFromContext = useResourceContext()
  const resource = resourceProp ?? resourceFromContext ?? ''

  if (!resource) {
    throw new Error(
      'CreateBase requires a resource prop or must be used inside a ResourceContextProvider'
    )
  }

  // Hooks
  const redirect = useRedirect()
  const notify = useNotify()

  // Local error state (for transform errors)
  const [localError, setLocalError] = useState<Error | null>(null)

  // Created record state
  const [record, setRecord] = useState<RaRecord | undefined>(undefined)

  // Saving state
  const [isSaving, setIsSaving] = useState(false)

  // Use ref for callbacks to avoid re-creating useCreate hook
  const callbacksRef = useRef<{
    onSuccess?: (data: RaRecord) => void
    onError?: (error: Error) => void
  }>({})

  // Store original data for onAfterSave callback
  const originalDataRef = useRef<TData | null>(null)

  // Create the mutation with callbacks that read from ref
  const [create, { error: mutationError, reset }] = useCreate<RecordType, TData>(
    resource,
    {
      ...mutationOptions,
      onSuccess: async (result, variables, context, snapshot) => {
        setIsSaving(false)
        setRecord(result.data)

        // Show success notification
        if (!disableSuccessNotification) {
          notify('Element created', { type: 'success' })
        }

        // Call custom onSuccess from mutationOptions
        if (mutationOptions?.onSuccess) {
          mutationOptions.onSuccess(result, variables, context, snapshot)
        }

        // Call onAfterSave if provided
        if (onAfterSave && originalDataRef.current !== null) {
          await onAfterSave({
            resource,
            data: originalDataRef.current,
            result: { data: result.data },
          })
        }

        // Call callback from save()
        if (callbacksRef.current.onSuccess) {
          callbacksRef.current.onSuccess(result.data)
        }

        // Redirect
        if (redirectTo !== false) {
          redirect(redirectTo, resource, result.data.id, {})
        }
      },
      onError: (err, variables, context, snapshot) => {
        setIsSaving(false)

        // Show error notification
        if (!disableErrorNotification) {
          notify(err.message || 'Error: could not create element', { type: 'error' })
        }

        // Call custom onError from mutationOptions
        if (mutationOptions?.onError) {
          mutationOptions.onError(err, variables, context, snapshot)
        }

        // Call callback from save()
        if (callbacksRef.current.onError) {
          callbacksRef.current.onError(err)
        }
      },
    }
  )

  const error = localError ?? mutationError

  // Save handler
  const save: SaveHandler<TData> = useCallback(
    async (data, callbacks) => {
      // Store callbacks in ref so they can be accessed in mutation callbacks
      callbacksRef.current = callbacks ?? {}

      try {
        setLocalError(null)
        setIsSaving(true)

        // Store original data for onAfterSave
        originalDataRef.current = data

        // Call onBeforeSave if provided
        if (onBeforeSave) {
          const beforeSaveResult = await onBeforeSave({
            resource,
            data,
          })

          // If onBeforeSave returns false, abort the save
          if (beforeSaveResult === false) {
            setIsSaving(false)
            return
          }

          // If onBeforeSave returns modified data, use it
          if (beforeSaveResult && typeof beforeSaveResult === 'object') {
            data = beforeSaveResult as TData
            originalDataRef.current = data
          }
        }

        // Apply transform if provided
        let transformedData = data
        if (transform) {
          transformedData = await transform(data)
        }

        // Perform the create mutation
        await create({ data: transformedData })
      } catch (err) {
        setIsSaving(false)
        const error = err instanceof Error ? err : new Error(String(err))
        setLocalError(error)

        // Show error notification for transform errors
        if (!disableErrorNotification) {
          notify(error.message || 'Error: could not create element', { type: 'error' })
        }

        // Call callback
        if (callbacks?.onError) {
          callbacks.onError(error)
        }
      }
    },
    [create, transform, notify, disableErrorNotification, onBeforeSave, resource]
  )

  // Reset handler
  const handleReset = useCallback(() => {
    reset()
    setLocalError(null)
    setRecord(undefined)
    setIsSaving(false)
    callbacksRef.current = {}
  }, [reset])

  // Build context value
  const contextValue = useMemo(
    () => ({
      resource,
      save,
      saving: isSaving,
      error,
      reset: handleReset,
      record,
    }),
    [resource, save, isSaving, error, handleReset, record]
  )

  // Create a form for FormContext (empty for create)
  const form = useForm<FieldValues>({
    defaultValues: {},
  })

  // Create a save wrapper that works with FormContext's expected signature
  const formSave = useCallback(
    async (data: FieldValues) => {
      await save(data as unknown as TData)
    },
    [save]
  )

  // Build form context value for compatibility with useShadminFormContext
  const formContextValue = useMemo(
    () => ({
      ...form,
      record: record ?? undefined,
      resource,
      save: formSave,
      saving: isSaving,
      mutationMode: 'pessimistic' as const,
    }),
    [form, record, resource, formSave, isSaving]
  )

  // Wrap with ResourceContext if resource prop was provided
  const content = (
    <CreateContextProvider value={contextValue}>
      <RecordContextProvider value={record ?? undefined}>
        <FormContextProvider {...formContextValue}>
          {children}
        </FormContextProvider>
      </RecordContextProvider>
    </CreateContextProvider>
  )

  if (resourceProp) {
    return <ResourceContextProvider value={resourceProp}>{content}</ResourceContextProvider>
  }

  return content
}

export default CreateBase
