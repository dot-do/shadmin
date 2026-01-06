/**
 * useDeleteMany hook
 * Deletes multiple records at once using the data provider
 * 100% API-compatible with react-admin
 */

import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import type {
  RaRecord,
  Identifier,
  DeleteManyParams,
  DeleteManyResult,
} from '../types'

/**
 * Parameters for the deleteMany mutation
 */
export interface UseDeleteManyMutateParams {
  ids: Identifier[]
  meta?: Record<string, unknown>
}

/**
 * Options for useDeleteMany hook
 */
export interface UseDeleteManyOptions<RecordType extends RaRecord = RaRecord>
  extends Omit<
    UseMutationOptions<DeleteManyResult<RecordType>, Error, { resource: string; params: UseDeleteManyMutateParams }>,
    'mutationFn'
  > {}

/**
 * Return type for useDeleteMany hook mutation state
 */
export interface UseDeleteManyMutationState<RecordType extends RaRecord = RaRecord> {
  data: DeleteManyResult<RecordType> | undefined
  error: Error | null
  isLoading: boolean
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  isIdle: boolean
  reset: () => void
}

/**
 * DeleteMany function signature
 */
export type DeleteManyFunction<RecordType extends RaRecord = RaRecord> = {
  (resource: string, params: UseDeleteManyMutateParams): Promise<DeleteManyResult<RecordType>>
  (params: UseDeleteManyMutateParams): Promise<DeleteManyResult<RecordType>>
}

/**
 * Return type for useDeleteMany hook
 */
export type UseDeleteManyResult<RecordType extends RaRecord = RaRecord> = [
  DeleteManyFunction<RecordType>,
  UseDeleteManyMutationState<RecordType>
]

/**
 * Hook to delete multiple records at once
 *
 * @example
 * ```tsx
 * const [deleteMany, { isLoading }] = useDeleteMany()
 * await deleteMany('posts', { ids: [1, 2, 3] })
 * ```
 */
export function useDeleteMany<RecordType extends RaRecord = RaRecord>(
  resource?: string,
  options: UseDeleteManyOptions<RecordType> = {}
): UseDeleteManyResult<RecordType> {
  const dataProvider = useDataProvider()
  const queryClient = useQueryClient()

  const mutation = useMutation<
    DeleteManyResult<RecordType>,
    Error,
    { resource: string; params: UseDeleteManyMutateParams }
  >({
    mutationFn: ({ resource: res, params }) => {
      const deleteManyParams: DeleteManyParams = {
        ids: params.ids,
        ...(params.meta && { meta: params.meta }),
      }
      return dataProvider.deleteMany<RecordType>(res, deleteManyParams)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getList'] })
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getMany'] })
      // Remove individual getOne queries for deleted records
      variables.params.ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: [variables.resource, 'getOne', { id }] })
      })
    },
    ...options,
  })

  const deleteMany = useCallback(
    async (
      resourceOrParams: string | UseDeleteManyMutateParams,
      maybeParams?: UseDeleteManyMutateParams
    ): Promise<DeleteManyResult<RecordType>> => {
      let actualResource: string
      let actualParams: UseDeleteManyMutateParams

      if (typeof resourceOrParams === 'string') {
        actualResource = resourceOrParams
        actualParams = maybeParams!
      } else {
        if (!resource) {
          throw new Error('Resource must be provided either in useDeleteMany() or in deleteMany()')
        }
        actualResource = resource
        actualParams = resourceOrParams
      }

      return mutation.mutateAsync({ resource: actualResource, params: actualParams })
    },
    [mutation, resource]
  ) as DeleteManyFunction<RecordType>

  const state: UseDeleteManyMutationState<RecordType> = useMemo(
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

  return [deleteMany, state]
}
