/**
 * ShowBase Component
 * Core show logic without UI wrapper - provides RecordContext to children
 * 100% API-compatible with react-admin ShowBase
 *
 * Epic: shadmin-ha1 (P1)
 */

import { type ReactNode, useMemo, useEffect, useRef } from 'react'

import { RecordContextProvider } from '../../contexts/RecordContext'
import { ResourceContextProvider, useResourceContext } from '../../contexts/ResourceContext'
import { useGetOne, type UseGetOneOptions } from '../../hooks/useGetOne'

import type { Identifier, RaRecord } from '../../types'

/**
 * Controller result passed to children render prop
 */
export interface ShowControllerResult<RecordType extends RaRecord = RaRecord> {
  /** The fetched record data */
  record: RecordType | undefined
  /** Whether the record is currently being fetched */
  isLoading: boolean
  /** Whether a background refetch is in progress */
  isFetching: boolean
  /** Error that occurred during fetching, if any */
  error: Error | null
  /** Function to refetch the record */
  refetch: () => Promise<unknown>
  /** The resource name */
  resource: string
  /** The record id */
  id: Identifier
}

/**
 * Props for ShowBase component
 */
export interface ShowBaseProps<RecordType extends RaRecord = RaRecord> {
  /** The ID of the record to fetch */
  id: Identifier
  /** The name of the resource to fetch. If not provided, uses ResourceContext */
  resource?: string
  /** Child elements - can be ReactNode or a render function receiving controller result */
  children: ReactNode | ((props: ShowControllerResult<RecordType>) => ReactNode)
  /** React Query options to pass to useGetOne */
  queryOptions?: UseGetOneOptions<RecordType> & { meta?: Record<string, unknown>; onSuccess?: (data: RecordType) => void }
  /** Transform the record data before providing to context */
  transform?: (record: RecordType) => RecordType
  /** Called when data is loaded */
  onLoad?: (record: RecordType) => void
  /** Called when there's an error */
  onError?: (error: Error) => void
  /** Called when component mounts */
  onMount?: () => void
  /** Called when component unmounts */
  onUnmount?: () => void
}

/**
 * ShowBase - Core show component that provides RecordContext without UI wrapper
 *
 * Use this component when you want to create a custom show UI while reusing
 * the show logic (record fetching, context provision).
 *
 * @example
 * ```tsx
 * // Basic usage with custom UI
 * <ShowBase resource="posts" id={1}>
 *   <MyCustomShowUI />
 * </ShowBase>
 *
 * // With render prop for access to controller state
 * <ShowBase resource="posts" id={1}>
 *   {({ record, isLoading, error }) => (
 *     isLoading ? <Loading /> :
 *     error ? <Error error={error} /> :
 *     <MyCustomShowUI record={record} />
 *   )}
 * </ShowBase>
 * ```
 */
export function ShowBase<RecordType extends RaRecord = RaRecord>({
  id,
  resource: resourceProp,
  children,
  queryOptions,
  transform,
  onLoad,
  onError,
  onMount,
  onUnmount,
}: ShowBaseProps<RecordType>) {
  // Get resource from context if not provided
  const resourceFromContext = useResourceContext()
  const resource = resourceProp ?? resourceFromContext ?? ''

  if (!resource) {
    throw new Error('ShowBase requires a resource prop or must be used inside a ResourceContextProvider')
  }

  // Extract meta and onSuccess from queryOptions for the getOne params
  const { meta, onSuccess, ...restQueryOptions } = queryOptions ?? {}

  // Fetch record using useGetOne
  const {
    data: rawRecord,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOne<RecordType>(
    resource,
    meta !== undefined ? { id, meta } : { id },
    restQueryOptions
  )

  // Apply transform if provided and record exists
  const record = useMemo(() => {
    if (rawRecord && transform) {
      return transform(rawRecord)
    }
    return rawRecord
  }, [rawRecord, transform])

  // Track if callbacks have been called to avoid duplicate calls
  const onLoadCalledRef = useRef(false)
  const onErrorCalledRef = useRef(false)
  const prevRecordIdRef = useRef<Identifier | undefined>(undefined)

  // Handle onMount and onUnmount callbacks
  useEffect(() => {
    onMount?.()
    return () => {
      onUnmount?.()
    }
  }, []) // Empty deps - only run on mount/unmount

  // Handle onLoad callback
  useEffect(() => {
    // Reset the flag when id changes
    if (prevRecordIdRef.current !== id) {
      onLoadCalledRef.current = false
      onErrorCalledRef.current = false
      prevRecordIdRef.current = id
    }

    if (rawRecord && !onLoadCalledRef.current) {
      onLoadCalledRef.current = true
      onLoad?.(rawRecord)
      onSuccess?.(rawRecord)
    }
  }, [rawRecord, id, onLoad, onSuccess])

  // Handle onError callback
  useEffect(() => {
    if (error && !onErrorCalledRef.current) {
      onErrorCalledRef.current = true
      onError?.(error)
    }
  }, [error, onError])

  // Build controller result for render prop
  const controllerResult = useMemo<ShowControllerResult<RecordType>>(
    () => ({
      record,
      isLoading,
      isFetching,
      error,
      refetch,
      resource,
      id,
    }),
    [record, isLoading, isFetching, error, refetch, resource, id]
  )

  // Determine content based on children type
  const content = typeof children === 'function' ? children(controllerResult) : children

  // Wrap with RecordContext
  const wrappedContent = (
    <RecordContextProvider value={record}>
      {content}
    </RecordContextProvider>
  )

  // Wrap with ResourceContext if resource prop was provided
  if (resourceProp) {
    return (
      <ResourceContextProvider value={resourceProp}>
        {wrappedContent}
      </ResourceContextProvider>
    )
  }

  return wrappedContent
}

export default ShowBase
