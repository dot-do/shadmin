/**
 * useGetOne hook
 * Fetches a single record by ID from the data provider
 * 100% API-compatible with react-admin
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useDataProvider } from '../contexts/DataProviderContext'
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

  return {
    data: query.data?.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ?? null,
    refetch: query.refetch,
  }
}
