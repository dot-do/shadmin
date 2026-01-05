/**
 * useGetList hook
 * Fetches a list of records with pagination, sorting, and filtering
 * 100% API-compatible with react-admin
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useDataProvider } from '../contexts/DataProviderContext'
import type {
  RaRecord,
  Identifier,
  GetListParams,
  GetListResult,
} from '../types'

/**
 * Parameters for useGetList hook
 */
export interface UseGetListParams {
  pagination?: {
    page: number
    perPage: number
  }
  sort?: {
    field: string
    order: 'ASC' | 'DESC'
  }
  filter?: Record<string, unknown>
  meta?: Record<string, unknown>
}

/**
 * Default parameters for useGetList
 */
const defaultParams: Required<Pick<UseGetListParams, 'pagination' | 'sort' | 'filter'>> = {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'id', order: 'ASC' },
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
    queryFn: () => dataProvider.getList<RecordType>(resource, mergedParams),
    ...options,
  })

  return {
    data: query.data?.data,
    total: query.data?.total,
    pageInfo: query.data?.pageInfo,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ?? null,
    refetch: query.refetch,
  }
}
