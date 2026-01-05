/**
 * CreateBase Component
 * Core create logic without UI wrapper - provides CreateContext to children
 * 100% API-compatible with react-admin CreateBase
 *
 * Epic: shadmin-ha1 (P1)
 */

import { type ReactNode, useCallback, useMemo, useState, useRef } from 'react'
import { CreateContextProvider, type SaveHandler } from './CreateContext'
import { ResourceContextProvider, useResourceContext } from '../../contexts/ResourceContext'
import { useCreate, type UseCreateOptions } from '../../hooks/useCreate'
import { useRedirect, type RedirectTo } from '../../hooks/useRedirect'
import { useNotify } from '../../hooks/useNotify'
import type { RaRecord } from '../../types'

/**
 * Transform function type
 */
export type TransformData<TData = Record<string, unknown>> = (
  data: TData
) => TData | Promise<TData>

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

  // Create the mutation with callbacks that read from ref
  const [create, { error: mutationError, reset }] = useCreate<RecordType, TData>(
    resource,
    {
      ...mutationOptions,
      onSuccess: (result, variables, context) => {
        setIsSaving(false)
        setRecord(result.data)

        // Show success notification
        if (!disableSuccessNotification) {
          notify('Element created', { type: 'success' })
        }

        // Call custom onSuccess from mutationOptions
        if (mutationOptions?.onSuccess) {
          mutationOptions.onSuccess(result, variables, context)
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
      onError: (err, variables, context) => {
        setIsSaving(false)

        // Show error notification
        if (!disableErrorNotification) {
          notify(err.message || 'Error: could not create element', { type: 'error' })
        }

        // Call custom onError from mutationOptions
        if (mutationOptions?.onError) {
          mutationOptions.onError(err, variables, context)
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
    [create, transform, notify, disableErrorNotification]
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

  // Wrap with ResourceContext if resource prop was provided
  const content = (
    <CreateContextProvider value={contextValue}>{children}</CreateContextProvider>
  )

  if (resourceProp) {
    return <ResourceContextProvider value={resourceProp}>{content}</ResourceContextProvider>
  }

  return content
}

export default CreateBase
