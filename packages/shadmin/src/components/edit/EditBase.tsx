/**
 * EditBase Component
 * Core edit logic without UI wrapper - provides RecordContext and FormContext to children
 * 100% API-compatible with react-admin EditBase
 *
 * Epic: shadmin-ha1 (P1)
 */

import { type ReactNode, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useForm, type FieldValues } from 'react-hook-form'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { ResourceContextProvider, useResourceContext } from '../../contexts/ResourceContext'
import { FormContextProvider, type MutationMode } from '../../contexts/FormContext'
import { useGetOne, type UseGetOneOptions } from '../../hooks/useGetOne'
import { useUpdate } from '../../hooks/useUpdate'
import { useTestNavigate } from '../../test-utils/TestMemoryRouter'
import { useNotify } from '../../contexts/NotificationContext'
import type { Identifier, RaRecord, UpdateResult } from '../../facade'

/**
 * Redirect option type
 */
export type RedirectTo =
  | 'list'
  | 'show'
  | 'edit'
  | false
  | string
  | ((resource: string, id: Identifier, data?: RaRecord) => string)

/**
 * Context passed to onBeforeSave callback
 */
export interface BeforeSaveContext {
  resource: string
  id: Identifier
  data: Record<string, unknown>
  previousData?: RaRecord
}

/**
 * Context passed to onAfterSave callback
 */
export interface AfterSaveContext<RecordType extends RaRecord = RaRecord> {
  resource: string
  id: Identifier
  data: Record<string, unknown>
  result: UpdateResult<RecordType>
}

/**
 * Props for EditBase component
 */
export interface EditBaseProps<RecordType extends RaRecord = RaRecord> {
  /** The name of the resource to fetch. If not provided, uses ResourceContext */
  resource?: string
  /** The record ID to fetch and edit */
  id: Identifier
  /** Child elements to render inside the context providers */
  children: ReactNode
  /** Mutation mode: pessimistic, optimistic, or undoable */
  mutationMode?: MutationMode
  /** Where to redirect after successful save */
  redirect?: RedirectTo
  /** Transform function to modify data before saving */
  transform?: (data: Record<string, unknown>) => Record<string, unknown> | Promise<Record<string, unknown>>
  /** React Query options for useGetOne */
  queryOptions?: UseGetOneOptions<RecordType> & { meta?: Record<string, unknown> }
  /** Mutation options for useUpdate */
  mutationOptions?: {
    onSuccess?: (data: UpdateResult<RecordType>, variables: unknown, context: unknown) => void
    onError?: (error: Error, variables: unknown, context: unknown) => void
    onSettled?: (data: UpdateResult<RecordType> | undefined, error: Error | null, variables: unknown, context: unknown) => void
  }
  /** Whether to disable authentication check */
  disableAuthentication?: boolean
  /** Called before save - can modify data or abort by returning false or throwing */
  onBeforeSave?: (context: BeforeSaveContext) => Record<string, unknown> | false | void | Promise<Record<string, unknown> | false | void>
  /** Called after successful save */
  onAfterSave?: (context: AfterSaveContext<RecordType>) => void | Promise<void>
}

/**
 * EditBase - Core edit component that provides RecordContext and FormContext without UI wrapper
 *
 * Use this component when you want to create a custom edit UI while reusing
 * the edit logic (record fetching, form state, save functionality).
 *
 * @example
 * ```tsx
 * // Basic usage with custom UI
 * <EditBase resource="posts" id={1}>
 *   <MyCustomEditForm />
 * </EditBase>
 *
 * // With options
 * <EditBase
 *   resource="posts"
 *   id={1}
 *   mutationMode="optimistic"
 *   redirect="list"
 * >
 *   <MyCustomEditForm />
 * </EditBase>
 * ```
 */
export function EditBase<RecordType extends RaRecord = RaRecord>({
  resource: resourceProp,
  id,
  children,
  mutationMode = 'pessimistic',
  redirect: redirectProp = 'list',
  transform,
  queryOptions,
  mutationOptions,
  disableAuthentication: _disableAuthentication = false,
  onBeforeSave,
  onAfterSave,
}: EditBaseProps<RecordType>) {
  // Get resource from context if not provided
  const resourceFromContext = useResourceContext()
  const resource = resourceProp ?? resourceFromContext ?? ''

  if (!resource) {
    throw new Error('EditBase requires a resource prop or must be used inside a ResourceContextProvider')
  }

  // Navigation
  let navigate: (to: string) => void
  try {
    navigate = useTestNavigate()
  } catch {
    // Not in a router context, use noop
    navigate = () => {}
  }

  // Notification
  let notify: ReturnType<typeof useNotify>
  try {
    notify = useNotify()
  } catch {
    // Not in a notification context, use noop
    notify = (() => {}) as ReturnType<typeof useNotify>
  }

  // Separate meta from queryOptions
  const { meta, ...restQueryOptions } = queryOptions ?? {}

  // Build params object, only including meta if defined
  const getOneParams: { id: Identifier; meta?: Record<string, unknown> } = { id }
  if (meta !== undefined) getOneParams.meta = meta

  // Fetch record using useGetOne
  const {
    data: record,
    isLoading: _isLoading,
    isFetching: _isFetching,
    error: _error,
    refetch: _refetch,
  } = useGetOne<RecordType>(
    resource,
    getOneParams,
    restQueryOptions
  )

  // Update mutation
  const [update, { isPending: isUpdating }] = useUpdate<RecordType>(resource)

  // Local record state for optimistic updates
  const [localRecord, setLocalRecord] = useState<RecordType | undefined>(undefined)

  // Sync local record with fetched record
  useEffect(() => {
    if (record) {
      setLocalRecord(record)
    }
  }, [record])

  // The record to show - use localRecord which gets updated after save
  const displayRecord = localRecord ?? record

  // Ref to hold the current displayRecord for use in save callback
  const displayRecordRef = useRef<RecordType | undefined>(displayRecord)
  displayRecordRef.current = displayRecord

  // Form setup
  const form = useForm<FieldValues>({
    defaultValues: displayRecord as FieldValues,
  })

  // Reset form when record changes
  useEffect(() => {
    if (displayRecord) {
      form.reset(displayRecord as FieldValues)
    }
  }, [displayRecord, form])

  // Compute redirect path
  const getRedirectPath = useCallback(
    (data?: RaRecord): string | false => {
      if (redirectProp === false) {
        return false
      }

      if (typeof redirectProp === 'function') {
        return redirectProp(resource, id, data)
      }

      if (typeof redirectProp === 'string') {
        switch (redirectProp) {
          case 'list':
            return `/${resource}`
          case 'show':
            return `/${resource}/${id}/show`
          case 'edit':
            return `/${resource}/${id}`
          default:
            return redirectProp
        }
      }

      return `/${resource}`
    },
    [redirectProp, resource, id]
  )

  // Save function
  const save = useCallback(
    async (values: Record<string, unknown>) => {
      // Use ref to get the most recent record data (works even if displayRecord changed after save was created)
      const previousData = displayRecordRef.current as RecordType

      // Call onBeforeSave if provided
      if (onBeforeSave) {
        const beforeSaveResult = await onBeforeSave({
          resource,
          id,
          data: values,
          previousData,
        })

        // If onBeforeSave returns false, abort the save
        if (beforeSaveResult === false) {
          return
        }

        // If onBeforeSave returns modified data, use it
        if (beforeSaveResult && typeof beforeSaveResult === 'object') {
          values = beforeSaveResult
        }
      }

      // Transform data if transform function provided
      let dataToSave = values
      if (transform) {
        dataToSave = await transform(values)
      }

      // For optimistic mode, update local state immediately
      if (mutationMode === 'optimistic') {
        setLocalRecord((prev) => {
          if (prev) {
            return { ...prev, ...dataToSave } as RecordType
          }
          return prev
        })
      }

      try {
        const result = await update({
          id,
          data: dataToSave,
          previousData: previousData as unknown as Record<string, unknown>,
        })

        // Update local record with server response (for pessimistic mode and also to ensure correct data)
        if (result.data) {
          setLocalRecord(result.data)
        }

        // Call onSuccess callback if provided
        mutationOptions?.onSuccess?.(result, { id, data: dataToSave, previousData }, undefined)

        // Call onAfterSave if provided
        if (onAfterSave) {
          await onAfterSave({
            resource,
            id,
            data: dataToSave,
            result,
          })
        }

        // Show success notification
        notify('Element updated', { type: 'success' })

        // Redirect after successful save
        const redirectPath = getRedirectPath(result.data)
        if (redirectPath !== false) {
          navigate(redirectPath)
        }

        return result
      } catch (err) {
        // For optimistic mode, rollback on error
        if (mutationMode === 'optimistic') {
          setLocalRecord(previousData)
        }

        // Call onError callback if provided
        mutationOptions?.onError?.(err as Error, { id, data: dataToSave, previousData }, undefined)

        // Show error notification
        notify((err as Error).message ?? 'An error occurred', { type: 'error' })

        throw err
      }
    },
    [id, update, transform, mutationMode, mutationOptions, getRedirectPath, navigate, notify, onBeforeSave, onAfterSave, resource]
  )

  // Create a wrapper for save that matches FormContext's expected signature
  const formSave = useCallback(
    async (data: FieldValues): Promise<void> => {
      await save(data as Record<string, unknown>)
    },
    [save]
  )

  // Build context value - only include defined optional properties
  const formContextValue = useMemo(() => {
    type FormContextValue = Parameters<typeof FormContextProvider>[0]
    const base: FormContextValue = {
      ...form,
      resource,
      save: formSave,
      saving: isUpdating,
      mutationMode,
    }
    // Only add record if defined to satisfy exactOptionalPropertyTypes
    if (displayRecord !== undefined) {
      base.record = displayRecord
    }
    return base
  }, [form, displayRecord, resource, formSave, isUpdating, mutationMode])

  // Always render children - let consumer components handle loading/error states
  // This allows Edit component to show loading indicators and error messages
  const content = (
    <RecordContextProvider value={displayRecord}>
      <FormContextProvider {...formContextValue}>
        {children}
      </FormContextProvider>
    </RecordContextProvider>
  )

  if (resourceProp) {
    return (
      <ResourceContextProvider value={resourceProp}>
        {content}
      </ResourceContextProvider>
    )
  }

  return content
}

export default EditBase
