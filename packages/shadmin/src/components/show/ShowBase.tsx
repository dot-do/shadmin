/**
 * ShowBase Component
 * Core show logic without UI wrapper - provides RecordContext to children
 * 100% API-compatible with react-admin ShowBase
 *
 * Epic: shadmin-ha1 (P1)
 */

import { type ReactNode, useMemo } from 'react'
import { RecordContextProvider, type RaRecord } from '../../contexts/RecordContext'
import { ResourceContextProvider, useResourceContext } from '../../contexts/ResourceContext'
import { useGetOne, type UseGetOneOptions } from '../../hooks/useGetOne'
import type { Identifier } from '../../types'

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
  queryOptions?: UseGetOneOptions<RecordType> & { meta?: Record<string, unknown> }
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
}: ShowBaseProps<RecordType>) {
  // Get resource from context if not provided
  const resourceFromContext = useResourceContext()
  const resource = resourceProp ?? resourceFromContext ?? ''

  if (!resource) {
    throw new Error('ShowBase requires a resource prop or must be used inside a ResourceContextProvider')
  }

  // Extract meta from queryOptions for the getOne params
  const { meta, ...restQueryOptions } = queryOptions ?? {}

  // Fetch record using useGetOne
  const {
    data: record,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOne<RecordType>(
    resource,
    { id, meta },
    restQueryOptions
  )

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
