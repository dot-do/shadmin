/**
 * useGetMany hook
 * Fetches multiple records by their IDs from the data provider
 * 100% API-compatible with react-admin
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useDataProvider } from '../contexts/DataProviderContext'
import type {
  RaRecord,
  Identifier,
  GetManyParams,
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
  const dataProvider = useDataProvider()

  const getManyParams: GetManyParams = {
    ids: params.ids,
    ...(params.meta && { meta: params.meta }),
  }

  const queryKey = [
    resource,
    'getMany',
    { ids: params.ids, meta: params.meta },
  ]

  const query = useQuery<GetManyResult<RecordType>, Error>({
    queryKey,
    queryFn: () => dataProvider.getMany<RecordType>(resource, getManyParams),
    ...options,
  })

  return {
    data: query.data?.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ?? null,
    refetch: query.refetch,
  }
}
