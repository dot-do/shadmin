/**
 * useGetList hook
 * Fetches a list of records with pagination, sorting, and filtering
 * 100% API-compatible with react-admin
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import { useAuthProvider } from '../contexts/AuthProviderContext'
import { useQueryErrorHandling } from './useErrorHandling'
import { isHttpError } from '../errors'
import type {
  RaRecord,
  GetListParams,
  GetListResult,
  PaginationPayload,
  SortPayload,
  FilterPayload,
} from '../types'
import { PAGINATION_DEFAULTS, SORT_DEFAULTS } from '../constants'

/**
 * Parameters for useGetList hook.
 */
export interface UseGetListParams {
  pagination?: PaginationPayload
  sort?: SortPayload
  filter?: FilterPayload
  meta?: Record<string, unknown>
}

/**
 * Default parameters for useGetList
 */
const defaultParams: Required<Pick<UseGetListParams, 'pagination' | 'sort' | 'filter'>> = {
  pagination: { page: PAGINATION_DEFAULTS.PAGE, perPage: PAGINATION_DEFAULTS.PER_PAGE },
  sort: { field: SORT_DEFAULTS.FIELD, order: SORT_DEFAULTS.ORDER },
  filter: {},
}

/**
 * Options for useGetList hook
 */
export interface UseGetListOptions<RecordType extends RaRecord = RaRecord>
  extends Omit<UseQueryOptions<GetListResult<RecordType>, Error>, 'queryKey' | 'queryFn'> {
  enabled?: boolean
}

/**
 * Return type for useGetList hook
 */
export interface UseGetListResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[] | undefined
  total: number | undefined
  pageInfo?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
  }
  isLoading: boolean
  isFetching: boolean
  error: Error | null
  refetch: () => Promise<unknown>
  // Error handling enhancements
  isNetworkError: boolean
  isForbidden: boolean
  isNotFound: boolean
  isServerError: boolean
  isTimeout: boolean
  errorCount: number
  shouldRedirectToLogin: boolean
}

/**
 * Hook to fetch a list of records from the data provider
 *
 * @param resource - The resource name to fetch from
 * @param params - Optional parameters for pagination, sorting, and filtering
 * @param options - Optional TanStack Query options
 * @returns Query result with data, total, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, total, isLoading, error } = useGetList('posts', {
 *   pagination: { page: 1, perPage: 10 },
 *   sort: { field: 'id', order: 'DESC' },
 *   filter: { published: true }
 * })
 * ```
 */
export function useGetList<RecordType extends RaRecord = RaRecord>(
  resource: string,
  params: UseGetListParams = {},
  options: UseGetListOptions<RecordType> = {}
): UseGetListResult<RecordType> {
  const dataProvider = useDataProvider()
  let authProvider: { checkError?: (error: Error) => Promise<void> } | undefined
  try {
    authProvider = useAuthProvider()
  } catch {
    // Auth provider not available
  }

  // Merge with defaults
  const mergedParams: GetListParams = {
    pagination: params.pagination ?? defaultParams.pagination,
    sort: params.sort ?? defaultParams.sort,
    filter: params.filter ?? defaultParams.filter,
    ...(params.meta && { meta: params.meta }),
  }

  const queryKey = [
    resource,
    'getList',
    {
      pagination: mergedParams.pagination,
      sort: mergedParams.sort,
      filter: mergedParams.filter,
      meta: mergedParams.meta,
    },
  ]

  const query = useQuery<GetListResult<RecordType>, Error>({
    queryKey,
    queryFn: ({ signal }) => dataProvider.getList<RecordType>(resource, { ...mergedParams, signal }),
    ...options,
  })

  const error = query.error ?? null

  // Check error with auth provider for 401 errors - using useEffect to avoid render-time side effects
  useEffect(() => {
    if (error && isHttpError(error) && error.status === 401 && authProvider?.checkError) {
      authProvider.checkError(error).catch(() => {
        // Auth provider rejected the error - this is expected behavior
      })
    }
  }, [error, authProvider])

  // Use the error handling utilities
  const errorHandling = useQueryErrorHandling(error, () => {
    // This callback is called when auth error is detected in the error handling hook
  })

  const result: UseGetListResult<RecordType> = {
    data: query.data?.data,
    total: query.data?.total,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error,
    refetch: query.refetch,
    // Error handling enhancements
    isNetworkError: errorHandling.isNetworkError,
    isForbidden: errorHandling.isForbidden,
    isNotFound: errorHandling.isNotFound,
    isServerError: errorHandling.isServerError,
    isTimeout: errorHandling.isTimeout,
    errorCount: errorHandling.errorCount,
    shouldRedirectToLogin: errorHandling.shouldRedirectToLogin,
  }

  // Only add pageInfo if it exists
  if (query.data?.pageInfo !== undefined) {
    result.pageInfo = query.data.pageInfo
  }

  return result
}
