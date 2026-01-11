/**
 * useGetManyReference hook
 * Fetches related records based on a foreign key relationship
 * 100% API-compatible with react-admin
 */

import type { UseQueryOptions } from '@tanstack/react-query'
import { createSimpleQueryHook } from './createDataHook'
import type {
  RaRecord,
  Identifier,
  GetManyReferenceResult,
} from '../types'
import { PAGINATION_DEFAULTS, SORT_DEFAULTS } from '../constants'

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
  pagination: { page: PAGINATION_DEFAULTS.PAGE, perPage: PAGINATION_DEFAULTS.PER_PAGE },
  sort: { field: SORT_DEFAULTS.FIELD, order: SORT_DEFAULTS.ORDER },
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
 * Internal hook created by factory
 */
const useGetManyReferenceInternal = createSimpleQueryHook<
  'getManyReference',
  UseGetManyReferenceParams,
  { data: RaRecord[] | undefined; total: number | undefined; pageInfo?: { hasNextPage?: boolean; hasPreviousPage?: boolean } },
  RaRecord
>({
  method: 'getManyReference',
  getQueryKey: (resource, params) => {
    const mergedPagination = params.pagination ?? defaultParams.pagination
    const mergedSort = params.sort ?? defaultParams.sort
    const mergedFilter = params.filter ?? defaultParams.filter
    return [
      resource,
      'getManyReference',
      {
        target: params.target,
        id: params.id,
        pagination: mergedPagination,
        sort: mergedSort,
        filter: mergedFilter,
        meta: params.meta,
      },
    ]
  },
  transformParams: (params) => ({
    target: params.target,
    id: params.id,
    pagination: params.pagination ?? defaultParams.pagination,
    sort: params.sort ?? defaultParams.sort,
    filter: params.filter ?? defaultParams.filter,
    ...(params.meta && { meta: params.meta }),
  }),
  transformResult: (result) => {
    // Handle pageInfo carefully to satisfy exactOptionalPropertyTypes
    const baseResult: { data: RaRecord[] | undefined; total: number | undefined; pageInfo?: { hasNextPage?: boolean; hasPreviousPage?: boolean } } = {
      data: result?.data,
      total: result?.total,
    }
    if (result?.pageInfo) {
      baseResult.pageInfo = result.pageInfo
    }
    return baseResult
  },
})

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
  // Cast options to satisfy exactOptionalPropertyTypes
  const result = useGetManyReferenceInternal(resource, params, options as Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>)

  // Build result carefully to satisfy exactOptionalPropertyTypes
  const returnValue: UseGetManyReferenceResult<RecordType> = {
    data: result.data as RecordType[] | undefined,
    total: result.total,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    error: result.error,
    refetch: result.refetch,
  }
  if (result.pageInfo) {
    returnValue.pageInfo = result.pageInfo
  }
  return returnValue
}
