/**
 * useCreate hook
 * Creates a new record using the data provider
 * 100% API-compatible with react-admin
 */

import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import type {
  RaRecord,
  CreateParams,
  CreateResult,
  GetListResult,
} from '../types'

/**
 * Parameters for the create mutation
 */
export interface UseCreateMutateParams<TData = Record<string, unknown>> {
  data: TData
  meta?: Record<string, unknown>
}

/**
 * Options for useCreate hook
 */
export interface UseCreateOptions<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> extends Omit<
    UseMutationOptions<CreateResult<RecordType>, Error, { resource: string; params: UseCreateMutateParams<TVariables> }>,
    'mutationFn'
  > {}

/**
 * Return type for useCreate hook mutation state
 */
export interface UseCreateMutationState<RecordType extends RaRecord = RaRecord> {
  data: CreateResult<RecordType> | undefined
  error: Error | null
  isLoading: boolean
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  isIdle: boolean
  reset: () => void
}

/**
 * Create function signature when resource is not pre-configured
 */
export type CreateFunction<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> = {
  (resource: string, params: UseCreateMutateParams<TVariables>): Promise<CreateResult<RecordType>>
  (params: UseCreateMutateParams<TVariables>): Promise<CreateResult<RecordType>>
}

/**
 * Return type for useCreate hook
 */
export type UseCreateResult<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> = [CreateFunction<RecordType, TVariables>, UseCreateMutationState<RecordType>]

/**
 * Hook to create a new record using the data provider
 *
 * @param resource - Optional resource name (can be provided when calling create instead)
 * @param options - Optional mutation options
 * @returns Tuple of [create function, mutation state]
 *
 * @example
 * ```tsx
 * // Option 1: Without pre-configured resource
 * const [create, { isLoading }] = useCreate()
 * await create('posts', { data: { title: 'New Post' } })
 *
 * // Option 2: With pre-configured resource
 * const [create, { isLoading }] = useCreate('posts')
 * await create({ data: { title: 'New Post' } })
 * ```
 */
export function useCreate<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
>(
  resource?: string,
  options: UseCreateOptions<RecordType, TVariables> = {}
): UseCreateResult<RecordType, TVariables> {
  const dataProvider = useDataProvider()
  const queryClient = useQueryClient()

  // Store previous cache state for rollback
  const previousCacheRef = useRef<Map<string, unknown>>(new Map())

  const mutation = useMutation<
    CreateResult<RecordType>,
    Error,
    { resource: string; params: UseCreateMutateParams<TVariables> }
  >({
    mutationFn: ({ resource: res, params }) => {
      const createParams: CreateParams<TVariables> = {
        data: params.data,
        ...(params.meta && { meta: params.meta }),
      }
      return dataProvider.create<RecordType, TVariables>(res, createParams)
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [variables.resource, 'getList'] })

      // Snapshot the previous cache for rollback
      const cache = queryClient.getQueryCache()
      const queries = cache.findAll({ queryKey: [variables.resource, 'getList'] })

      previousCacheRef.current.clear()
      queries.forEach((query) => {
        previousCacheRef.current.set(JSON.stringify(query.queryKey), query.state.data)
      })
    },
    onSuccess: (result, variables) => {
      // Granular cache update: add new record to all list caches and update totals
      const cache = queryClient.getQueryCache()
      const queries = cache.findAll({ queryKey: [variables.resource, 'getList'] })

      queries.forEach((query) => {
        queryClient.setQueryData<GetListResult<RecordType>>(query.queryKey, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: [result.data, ...oldData.data],
            total: (oldData.total ?? 0) + 1,
          }
        })
      })

      // Also set the getOne cache for the new record
      queryClient.setQueryData(
        [variables.resource, 'getOne', { id: result.data.id }],
        { data: result.data }
      )

      // Invalidate getManyReference for related resources
      const newData = variables.params.data as Record<string, unknown>
      Object.entries(newData).forEach(([key, value]) => {
        if (key.endsWith('Id') && value != null) {
          // This looks like a foreign key - trigger getManyReference refresh
          try {
            const result = dataProvider.getManyReference?.(variables.resource, {
              target: key,
              id: value as number | string,
              pagination: { page: 1, perPage: 10 },
              sort: { field: 'id', order: 'ASC' },
              filter: {},
            })
            // Handle promise if returned
            if (result && typeof result.catch === 'function') {
              result.catch(() => {
                // Silently ignore if getManyReference fails
              })
            }
          } catch {
            // Silently ignore if getManyReference is not implemented
          }
        }
      })
    },
    onError: (_error, variables) => {
      // Rollback to previous cache state
      previousCacheRef.current.forEach((data, key) => {
        const queryKey = JSON.parse(key)
        queryClient.setQueryData(queryKey, data)
      })
      previousCacheRef.current.clear()
    },
    ...options,
  })

  const create = useCallback(
    async (
      resourceOrParams: string | UseCreateMutateParams<TVariables>,
      maybeParams?: UseCreateMutateParams<TVariables>
    ): Promise<CreateResult<RecordType>> => {
      let actualResource: string
      let actualParams: UseCreateMutateParams<TVariables>

      if (typeof resourceOrParams === 'string') {
        // Called with resource and params
        actualResource = resourceOrParams
        actualParams = maybeParams!
      } else {
        // Called with just params, use pre-configured resource
        if (!resource) {
          throw new Error('Resource must be provided either in useCreate() or in create()')
        }
        actualResource = resource
        actualParams = resourceOrParams
      }

      return mutation.mutateAsync({ resource: actualResource, params: actualParams })
    },
    [mutation, resource]
  ) as CreateFunction<RecordType, TVariables>

  const state: UseCreateMutationState<RecordType> = useMemo(
    () => ({
      data: mutation.data,
      error: mutation.error ?? null,
      isLoading: mutation.isPending,
      isPending: mutation.isPending,
      isSuccess: mutation.isSuccess,
      isError: mutation.isError,
      isIdle: mutation.isIdle,
      reset: mutation.reset,
    }),
    [mutation.data, mutation.error, mutation.isPending, mutation.isSuccess, mutation.isError, mutation.isIdle, mutation.reset]
  )

  return [create, state]
}
