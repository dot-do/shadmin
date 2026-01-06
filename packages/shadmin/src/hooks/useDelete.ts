/**
 * useDelete hook
 * Deletes a single record using the data provider
 * 100% API-compatible with react-admin
 */

import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import type {
  RaRecord,
  Identifier,
  DeleteParams,
  DeleteResult,
} from '../types'

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getList'] })
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getMany'] })
      queryClient.removeQueries({ queryKey: [variables.resource, 'getOne', { id: variables.params.id }] })
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
