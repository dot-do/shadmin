/**
 * useDeleteMany hook
 * Deletes multiple records at once using the data provider
 * 100% API-compatible with react-admin
 */

import type { UseMutationOptions } from '@tanstack/react-query'
import { createSimpleMutationHook } from './createDataHook'
import type {
  RaRecord,
  Identifier,
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
 * Internal hook created by factory
 */
const useDeleteManyInternal = createSimpleMutationHook<
  'deleteMany',
  UseDeleteManyMutateParams,
  DeleteManyResult<RaRecord>,
  RaRecord
>({
  method: 'deleteMany',
  transformParams: (params) => ({
    ids: params.ids,
    ...(params.meta && { meta: params.meta }),
  }),
  cacheHandlers: {
    onSuccess: (queryClient, _, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getList'] })
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getMany'] })
      // Remove individual getOne queries for deleted records
      variables.params.ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: [variables.resource, 'getOne', { id }] })
      })
    },
  },
})

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
  // Cast options to satisfy exactOptionalPropertyTypes
  type InternalOptions = Omit<UseMutationOptions<DeleteManyResult<RaRecord>, Error, { resource: string; params: UseDeleteManyMutateParams }>, 'mutationFn'>
  return useDeleteManyInternal(resource, options as InternalOptions) as UseDeleteManyResult<RecordType>
}
