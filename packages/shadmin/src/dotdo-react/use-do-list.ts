/**
 * useDOList Hook
 *
 * Durable Objects-backed list hook for fetching paginated data.
 * Integrates with TanStack Query for caching and provides real-time
 * update capabilities via WebSocket subscriptions.
 *
 * @module dotdo-react/use-do-list
 *
 * @example
 * ```tsx
 * import { useDOList } from 'shadmin/dotdo-react'
 *
 * function UserList() {
 *   const { data, total, isLoading, error } = useDOList('users', {
 *     page: 1,
 *     perPage: 10,
 *     sortField: 'createdAt',
 *     sortOrder: 'DESC',
 *     filter: { active: true },
 *   })
 *
 *   if (isLoading) return <Loading />
 *   if (error) return <Error message={error.message} />
 *
 *   return (
 *     <ul>
 *       {data?.map(user => <li key={user.id}>{user.name}</li>)}
 *     </ul>
 *   )
 * }
 * ```
 */

import { useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import { useEffect, useMemo, useCallback } from 'react'
import { useShadminDO, useShadminDOOptional } from './provider'
import type { RaRecord } from '../types'
import type { UseDOListParams, UseDOListResult, DOListResult } from './types'
import { PAGINATION_DEFAULTS, SORT_DEFAULTS } from '../constants'

/**
 * Options for useDOList hook
 */
export interface UseDOListOptions<RecordType extends RaRecord = RaRecord>
  extends Omit<UseQueryOptions<DOListResult<RecordType>, Error>, 'queryKey' | 'queryFn'> {
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
}

/**
 * Default parameters for list queries
 */
const defaultParams: Required<Pick<UseDOListParams, 'page' | 'perPage' | 'sortField' | 'sortOrder' | 'filter'>> = {
  page: PAGINATION_DEFAULTS.PAGE,
  perPage: PAGINATION_DEFAULTS.PER_PAGE,
  sortField: SORT_DEFAULTS.FIELD,
  sortOrder: SORT_DEFAULTS.ORDER,
  filter: {},
}

/**
 * Hook to fetch a list of records from a Durable Object
 *
 * Uses the DO client to call the `list` or `getList` method on the DO,
 * with automatic caching via TanStack Query and optional real-time updates.
 *
 * @param resource - The resource name (collection) to fetch from
 * @param params - Optional pagination, sorting, and filtering parameters
 * @param options - Optional TanStack Query options
 * @returns Query result with data, total, loading state, and error
 *
 * @example Basic usage
 * ```tsx
 * const { data, isLoading } = useDOList('posts')
 * ```
 *
 * @example With pagination and sorting
 * ```tsx
 * const { data, total, isLoading, error } = useDOList('posts', {
 *   page: currentPage,
 *   perPage: 25,
 *   sortField: 'publishedAt',
 *   sortOrder: 'DESC',
 *   filter: { status: 'published' },
 * })
 * ```
 *
 * @example With real-time updates
 * ```tsx
 * const { data } = useDOList('messages', {
 *   realtime: true, // Subscribe to updates
 * })
 * ```
 */
export function useDOList<RecordType extends RaRecord = RaRecord>(
  resource: string,
  params: UseDOListParams = {},
  options: UseDOListOptions<RecordType> = {}
): UseDOListResult<RecordType> {
  const { client, connectionState, getResourceName, subscribe } = useShadminDO()
  const queryClient = useQueryClient()

  // Merge with defaults
  const mergedParams = useMemo(
    () => ({
      page: params.page ?? defaultParams.page,
      perPage: params.perPage ?? defaultParams.perPage,
      sortField: params.sortField ?? defaultParams.sortField,
      sortOrder: params.sortOrder ?? defaultParams.sortOrder,
      filter: params.filter ?? defaultParams.filter,
      meta: params.meta,
    }),
    [params.page, params.perPage, params.sortField, params.sortOrder, params.filter, params.meta]
  )

  // Get the actual resource name
  const resourceName = useMemo(() => getResourceName(resource), [getResourceName, resource])

  // Build query key
  const queryKey = useMemo(
    () => [
      'do',
      resourceName,
      'list',
      {
        page: mergedParams.page,
        perPage: mergedParams.perPage,
        sortField: mergedParams.sortField,
        sortOrder: mergedParams.sortOrder,
        filter: mergedParams.filter,
        meta: mergedParams.meta,
      },
    ],
    [resourceName, mergedParams]
  )

  // Query function that calls the DO
  const queryFn = useCallback(async (): Promise<DOListResult<RecordType>> => {
    // Call the DO's list method
    // The DO should expose a method like: list(resource, params) or getList(resource, params)
    const result = await client.list(resourceName, {
      pagination: {
        page: mergedParams.page,
        perPage: mergedParams.perPage,
      },
      sort: {
        field: mergedParams.sortField,
        order: mergedParams.sortOrder,
      },
      filter: mergedParams.filter,
      meta: mergedParams.meta,
    })

    // Normalize the response
    const response = result as DOListResult<RecordType> | { data: RecordType[]; total?: number }

    return {
      data: response.data,
      total: 'total' in response ? response.total : response.data.length,
      pageInfo: 'pageInfo' in response ? response.pageInfo : undefined,
    }
  }, [client, resourceName, mergedParams])

  // Run the query
  const query = useQuery<DOListResult<RecordType>, Error>({
    queryKey,
    queryFn,
    enabled: connectionState === 'connected' && options.enabled !== false,
    ...options,
  })

  // Set up real-time subscription
  useEffect(() => {
    if (!params.realtime) return

    // Subscribe to resource updates
    const channel = `${resourceName}:list`
    const subscription = subscribe<{ type: string; data: RecordType }>(channel, (event) => {
      // Invalidate the query when data changes
      if (event.type === 'created' || event.type === 'updated' || event.type === 'deleted') {
        queryClient.invalidateQueries({ queryKey: ['do', resourceName, 'list'] })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [params.realtime, resourceName, subscribe, queryClient])

  return {
    data: query.data?.data,
    total: query.data?.total,
    pageInfo: query.data?.pageInfo,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ?? null,
    refetch: query.refetch,
    connectionState,
  }
}

/**
 * Hook to fetch a list with automatic resource inference from context
 *
 * This hook is meant to be used within a ResourceContext where the
 * resource name is already defined.
 *
 * @param params - Optional pagination, sorting, and filtering parameters
 * @param options - Optional TanStack Query options
 * @returns Query result with data, total, loading state, and error
 *
 * @example
 * ```tsx
 * function PostList() {
 *   // Resource is inferred from ResourceContext
 *   const { data } = useDOListContext({
 *     perPage: 20,
 *     sortField: 'createdAt',
 *     sortOrder: 'DESC',
 *   })
 *
 *   return <DataGrid data={data} />
 * }
 * ```
 */
export function useDOListContext<RecordType extends RaRecord = RaRecord>(
  params: UseDOListParams = {},
  options: UseDOListOptions<RecordType> = {}
): UseDOListResult<RecordType> {
  // Import useResourceContext from shadmin
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Avoids circular dependency; dynamic require breaks cycle between dotdo-react and contexts
  const { useResourceContext } = require('../contexts/ResourceContext') as {
    useResourceContext: () => string | undefined
  }

  const resource = useResourceContext()

  if (!resource) {
    throw new Error('useDOListContext must be used within a ResourceContext')
  }

  return useDOList<RecordType>(resource, params, options)
}

/**
 * Hook variant that doesn't throw if DO provider is not available
 *
 * Returns undefined values when not within a ShadminDOProvider,
 * allowing graceful fallback behavior.
 *
 * @param resource - The resource name to fetch from
 * @param params - Optional pagination, sorting, and filtering parameters
 * @param options - Optional TanStack Query options
 * @returns Query result or undefined values if not in provider
 *
 * @example
 * ```tsx
 * function OptionalDOList({ resource }) {
 *   const result = useDOListOptional(resource)
 *
 *   if (result.connectionState === 'disconnected') {
 *     // Fall back to regular data provider
 *     return <RegularList resource={resource} />
 *   }
 *
 *   return <DOList data={result.data} />
 * }
 * ```
 */
export function useDOListOptional<RecordType extends RaRecord = RaRecord>(
  resource: string,
  params: UseDOListParams = {},
  options: UseDOListOptions<RecordType> = {}
): UseDOListResult<RecordType> {
  const context = useShadminDOOptional()

  // If no context, return disconnected state with undefined data
  if (!context) {
    return {
      data: undefined,
      total: undefined,
      pageInfo: undefined,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: async () => {},
      connectionState: 'disconnected',
    }
  }

  // Use the regular hook when context is available
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useDOList<RecordType>(resource, params, options)
}
