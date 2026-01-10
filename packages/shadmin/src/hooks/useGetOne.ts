/**
 * useGetOne hook
 * Fetches a single record by ID from the data provider
 * 100% API-compatible with react-admin
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import { useAuthProvider } from '../contexts/AuthProviderContext'
import { useQueryErrorHandling, analyzeError } from './useErrorHandling'
import { isHttpError } from '../errors'
import type {
  RaRecord,
  Identifier,
  GetOneParams,
  GetOneResult,
} from '../types'

/**
 * Parameters for useGetOne hook
 */
export interface UseGetOneParams {
  id: Identifier
  meta?: Record<string, unknown>
}

/**
 * Options for useGetOne hook
 */
export interface UseGetOneOptions<RecordType extends RaRecord = RaRecord>
  extends Omit<UseQueryOptions<GetOneResult<RecordType>, Error>, 'queryKey' | 'queryFn'> {
  enabled?: boolean
}

/**
 * Return type for useGetOne hook
 */
export interface UseGetOneResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType | undefined
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
 * Hook to fetch a single record from the data provider
 *
 * @param resource - The resource name to fetch from
 * @param params - Parameters including the record ID
 * @param options - Optional TanStack Query options
 * @returns Query result with data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useGetOne('posts', { id: 123 })
 * ```
 */
export function useGetOne<RecordType extends RaRecord = RaRecord>(
  resource: string,
  params: UseGetOneParams,
  options: UseGetOneOptions<RecordType> = {}
): UseGetOneResult<RecordType> {
  const dataProvider = useDataProvider()
  let authProvider: { checkError?: (error: Error) => Promise<void> } | undefined
  try {
    authProvider = useAuthProvider()
  } catch {
    // Auth provider not available
  }

  const getOneParams: GetOneParams = {
    id: params.id,
    ...(params.meta && { meta: params.meta }),
  }

  const queryKey = [
    resource,
    'getOne',
    { id: params.id, meta: params.meta },
  ]

  const query = useQuery<GetOneResult<RecordType>, Error>({
    queryKey,
    queryFn: () => dataProvider.getOne<RecordType>(resource, getOneParams),
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

  // Use the error handling utilities - pass isFetching to track refetch errors
  const errorHandling = useQueryErrorHandling(error, () => {
    // This callback is called when auth error is detected in the error handling hook
  }, query.isFetching)

  return {
    data: query.data?.data,
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
}
