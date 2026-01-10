/**
 * useGetMany hook
 * Fetches multiple records by their IDs from the data provider
 * 100% API-compatible with react-admin
 */

import type { UseQueryOptions } from '@tanstack/react-query'
import { createSimpleQueryHook } from './createDataHook'
import type {
  RaRecord,
  Identifier,
  GetManyResult,
} from '../types'

/**
 * Parameters for useGetMany hook
 */
export interface UseGetManyParams {
  ids: Identifier[]
  meta?: Record<string, unknown>
}

/**
 * Options for useGetMany hook
 */
export interface UseGetManyOptions<RecordType extends RaRecord = RaRecord>
  extends Omit<UseQueryOptions<GetManyResult<RecordType>, Error>, 'queryKey' | 'queryFn'> {
  enabled?: boolean
}

/**
 * Return type for useGetMany hook
 */
export interface UseGetManyResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[] | undefined
  isLoading: boolean
  isFetching: boolean
  error: Error | null
  refetch: () => Promise<unknown>
}

/**
 * Internal hook created by factory
 */
const useGetManyInternal = createSimpleQueryHook<
  'getMany',
  UseGetManyParams,
  { data: RaRecord[] | undefined },
  RaRecord
>({
  method: 'getMany',
  getQueryKey: (resource, params) => [
    resource,
    'getMany',
    { ids: params.ids, meta: params.meta },
  ],
  transformParams: (params) => ({
    ids: params.ids,
    ...(params.meta && { meta: params.meta }),
  }),
  transformResult: (result) => ({
    data: result?.data,
  }),
})

/**
 * Hook to fetch multiple records by their IDs from the data provider
 *
 * @param resource - The resource name to fetch from
 * @param params - Parameters including the array of record IDs
 * @param options - Optional TanStack Query options
 * @returns Query result with data array, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useGetMany('users', { ids: [1, 2, 3] })
 * ```
 */
export function useGetMany<RecordType extends RaRecord = RaRecord>(
  resource: string,
  params: UseGetManyParams,
  options: UseGetManyOptions<RecordType> = {}
): UseGetManyResult<RecordType> {
  // Cast options to satisfy exactOptionalPropertyTypes
  const result = useGetManyInternal(resource, params, options as Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>)
  return {
    data: result.data as RecordType[] | undefined,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    error: result.error,
    refetch: result.refetch,
  }
}
