/**
 * useDelete hook
 * Deletes a single record using the data provider
 * 100% API-compatible with react-admin
 */

import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import type {
  RaRecord,
  Identifier,
  DeleteParams,
  DeleteResult,
  GetListResult,
  GetOneResult,
} from '../types'

// Helper type for cache snapshot
interface DeleteCacheSnapshot {
  getOne: { key: string; data: unknown } | null
  lists: Array<{ key: string; data: unknown }>
}

/**
 * Parameters for the delete mutation
 */
export interface UseDeleteMutateParams<RecordType extends RaRecord = RaRecord> {
  id: Identifier
  previousData?: RecordType
  meta?: Record<string, unknown>
}

/**
 * Options for useDelete hook
 */
export interface UseDeleteOptions<RecordType extends RaRecord = RaRecord>
  extends Omit<
    UseMutationOptions<DeleteResult<RecordType>, Error, { resource: string; params: UseDeleteMutateParams<RecordType> }>,
    'mutationFn'
  > {}

/**
 * Return type for useDelete hook mutation state
 */
export interface UseDeleteMutationState<RecordType extends RaRecord = RaRecord> {
  data: DeleteResult<RecordType> | undefined
  error: Error | null
  isLoading: boolean
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  isIdle: boolean
  reset: () => void
}

/**
 * Delete function signature
 */
export type DeleteFunction<RecordType extends RaRecord = RaRecord> = {
  (resource: string, params: UseDeleteMutateParams<RecordType>): Promise<DeleteResult<RecordType>>
  (params: UseDeleteMutateParams<RecordType>): Promise<DeleteResult<RecordType>>
}

/**
 * Return type for useDelete hook
 */
export type UseDeleteResult<RecordType extends RaRecord = RaRecord> = [
  DeleteFunction<RecordType>,
  UseDeleteMutationState<RecordType>
]

/**
 * Hook to delete a single record
 *
 * @example
 * ```tsx
 * const [deleteRecord, { isLoading }] = useDelete()
 * await deleteRecord('posts', { id: 123 })
 * ```
 */
export function useDelete<RecordType extends RaRecord = RaRecord>(
  resource?: string,
  options: UseDeleteOptions<RecordType> = {}
): UseDeleteResult<RecordType> {
  const dataProvider = useDataProvider()
  const queryClient = useQueryClient()

  // Store previous cache state for rollback
  const previousCacheRef = useRef<DeleteCacheSnapshot>({ getOne: null, lists: [] })

  const mutation = useMutation<
    DeleteResult<RecordType>,
    Error,
    { resource: string; params: UseDeleteMutateParams<RecordType> }
  >({
    mutationFn: ({ resource: res, params }) => {
      const deleteParams: DeleteParams<RecordType> = {
        id: params.id,
        ...(params.previousData && { previousData: params.previousData }),
        ...(params.meta && { meta: params.meta }),
      }
      return dataProvider.delete<RecordType>(res, deleteParams)
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [variables.resource] })

      const cache = queryClient.getQueryCache()

      // Snapshot the previous getOne cache - need to find all matching queries
      // The getOne key can be either { id } or { id, meta }
      const getOneQueries = cache.findAll({
        queryKey: [variables.resource, 'getOne'],
        predicate: (query) => {
          const key = query.queryKey
          if (key.length >= 3 && typeof key[2] === 'object' && key[2] !== null) {
            return (key[2] as { id?: unknown }).id === variables.params.id
          }
          return false
        },
      })

      if (getOneQueries.length > 0) {
        const query = getOneQueries[0]
        previousCacheRef.current.getOne = {
          key: JSON.stringify(query.queryKey),
          data: query.state.data,
        }
        // Optimistically clear getOne cache data - cancel, set to undefined, and remove
        getOneQueries.forEach((q) => {
          queryClient.cancelQueries({ queryKey: q.queryKey, exact: true })
          // Set data to undefined first to prevent refetch
          queryClient.setQueryData(q.queryKey, undefined)
          queryClient.removeQueries({ queryKey: q.queryKey, exact: true })
        })
      } else {
        previousCacheRef.current.getOne = null
      }

      // Snapshot and optimistically update list caches
      const listQueries = cache.findAll({ queryKey: [variables.resource, 'getList'] })

      previousCacheRef.current.lists = []
      listQueries.forEach((query) => {
        previousCacheRef.current.lists.push({
          key: JSON.stringify(query.queryKey),
          data: query.state.data,
        })

        queryClient.setQueryData<GetListResult<RecordType>>(query.queryKey, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: oldData.data.filter((record) => record.id !== variables.params.id),
            total: (oldData.total ?? 0) - 1,
          }
        })
      })
    },
    onSuccess: (_, variables) => {
      // Ensure the record is removed from caches (already done optimistically)
      // Need to match any getOne query for this id
      const cache = queryClient.getQueryCache()
      const getOneQueries = cache.findAll({
        queryKey: [variables.resource, 'getOne'],
        predicate: (query) => {
          const key = query.queryKey
          if (key.length >= 3 && typeof key[2] === 'object' && key[2] !== null) {
            return (key[2] as { id?: unknown }).id === variables.params.id
          }
          return false
        },
      })
      getOneQueries.forEach((query) => {
        queryClient.removeQueries({ queryKey: query.queryKey, exact: true })
      })
      // Clear the snapshot since we succeeded
      previousCacheRef.current = { getOne: null, lists: [] }
    },
    onError: () => {
      // Rollback to previous cache state
      const snapshot = previousCacheRef.current

      if (snapshot.getOne && snapshot.getOne.data) {
        const queryKey = JSON.parse(snapshot.getOne.key)
        queryClient.setQueryData(queryKey, snapshot.getOne.data)
      }

      snapshot.lists.forEach(({ key, data }) => {
        const queryKey = JSON.parse(key)
        queryClient.setQueryData(queryKey, data)
      })

      previousCacheRef.current = { getOne: null, lists: [] }
    },
    ...options,
  })

  const deleteRecord = useCallback(
    async (
      resourceOrParams: string | UseDeleteMutateParams<RecordType>,
      maybeParams?: UseDeleteMutateParams<RecordType>
    ): Promise<DeleteResult<RecordType>> => {
      let actualResource: string
      let actualParams: UseDeleteMutateParams<RecordType>

      if (typeof resourceOrParams === 'string') {
        actualResource = resourceOrParams
        actualParams = maybeParams!
      } else {
        if (!resource) {
          throw new Error('Resource must be provided either in useDelete() or in delete()')
        }
        actualResource = resource
        actualParams = resourceOrParams
      }

      return mutation.mutateAsync({ resource: actualResource, params: actualParams })
    },
    [mutation, resource]
  ) as DeleteFunction<RecordType>

  const state: UseDeleteMutationState<RecordType> = useMemo(
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

  return [deleteRecord, state]
}
