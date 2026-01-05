/**
 * useGetManyReference hook
 * Fetches related records based on a foreign key relationship
 * 100% API-compatible with react-admin
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useDataProvider } from '../contexts/DataProviderContext'
import type {
  RaRecord,
  Identifier,
  GetManyReferenceParams,
  GetManyReferenceResult,
} from '../types'

/**
 * Parameters for useGetManyReference hook
 */
export interface UseGetManyReferenceParams {
  target: string
  id: Identifier
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
 * Default parameters for useGetManyReference
 */
const defaultParams: Required<Pick<UseGetManyReferenceParams, 'pagination' | 'sort' | 'filter'>> = {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'id', order: 'ASC' },
  filter: {},
}

/**
 * Options for useGetManyReference hook
 */
export interface UseGetManyReferenceOptions<RecordType extends RaRecord = RaRecord>
  extends Omit<UseQueryOptions<GetManyReferenceResult<RecordType>, Error>, 'queryKey' | 'queryFn'> {
  enabled?: boolean
}

/**
 * Return type for useGetManyReference hook
 */
export interface UseGetManyReferenceResult<RecordType extends RaRecord = RaRecord> {
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
 * Hook to fetch related records based on a foreign key relationship
 *
 * @param resource - The resource name to fetch from
 * @param params - Parameters including target field and ID
 * @param options - Optional TanStack Query options
 * @returns Query result with data array, total, loading state, and error
 *
 * @example
 * ```tsx
 * // Fetch comments for a specific post
 * const { data, total, isLoading } = useGetManyReference('comments', {
 *   target: 'postId',
 *   id: 123,
 *   pagination: { page: 1, perPage: 10 },
 *   sort: { field: 'createdAt', order: 'DESC' }
 * })
 * ```
 */
export function useGetManyReference<RecordType extends RaRecord = RaRecord>(
  resource: string,
  params: UseGetManyReferenceParams,
  options: UseGetManyReferenceOptions<RecordType> = {}
): UseGetManyReferenceResult<RecordType> {
  const dataProvider = useDataProvider()

  // Merge with defaults
  const getManyReferenceParams: GetManyReferenceParams = {
    target: params.target,
    id: params.id,
    pagination: params.pagination ?? defaultParams.pagination,
    sort: params.sort ?? defaultParams.sort,
    filter: params.filter ?? defaultParams.filter,
    ...(params.meta && { meta: params.meta }),
  }

  const queryKey = [
    resource,
    'getManyReference',
    {
      target: params.target,
      id: params.id,
      pagination: getManyReferenceParams.pagination,
      sort: getManyReferenceParams.sort,
      filter: getManyReferenceParams.filter,
      meta: params.meta,
    },
  ]

  const query = useQuery<GetManyReferenceResult<RecordType>, Error>({
    queryKey,
    queryFn: () => dataProvider.getManyReference<RecordType>(resource, getManyReferenceParams),
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
