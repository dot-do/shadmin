/**
 * useUpdateMany hook
 * Updates multiple records at once using the data provider
 * 100% API-compatible with react-admin
 */

import { createSimpleMutationHook } from './createDataHook'

import type {
  RaRecord,
  Identifier,
  UpdateManyResult,
} from '../types'
import type { UseMutationOptions } from '@tanstack/react-query'

/**
 * Parameters for the updateMany mutation
 */
export interface UseUpdateManyMutateParams<TData = Record<string, unknown>> {
  ids: Identifier[]
  data: TData
  meta?: Record<string, unknown>
}

/**
 * Options for useUpdateMany hook
 */
export interface UseUpdateManyOptions<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> extends Omit<
    UseMutationOptions<UpdateManyResult<RecordType>, Error, { resource: string; params: UseUpdateManyMutateParams<TVariables> }>,
    'mutationFn'
  > {}

/**
 * Return type for useUpdateMany hook mutation state
 */
export interface UseUpdateManyMutationState<RecordType extends RaRecord = RaRecord> {
  data: UpdateManyResult<RecordType> | undefined
  error: Error | null
  isLoading: boolean
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  isIdle: boolean
  reset: () => void
}

/**
 * UpdateMany function signature
 */
export type UpdateManyFunction<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> = {
  (resource: string, params: UseUpdateManyMutateParams<TVariables>): Promise<UpdateManyResult<RecordType>>
  (params: UseUpdateManyMutateParams<TVariables>): Promise<UpdateManyResult<RecordType>>
}

/**
 * Return type for useUpdateMany hook
 */
export type UseUpdateManyResult<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> = [UpdateManyFunction<RecordType, TVariables>, UseUpdateManyMutationState<RecordType>]

/**
 * Internal hook created by factory
 */
const useUpdateManyInternal = createSimpleMutationHook<
  'updateMany',
  UseUpdateManyMutateParams<Record<string, unknown>>,
  UpdateManyResult<RaRecord>,
  RaRecord
>({
  method: 'updateMany',
  transformParams: (params) => ({
    ids: params.ids,
    data: params.data,
    ...(params.meta && { meta: params.meta }),
  }),
  cacheHandlers: {
    onSuccess: (queryClient, _, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getList'] })
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getMany'] })
      // Invalidate individual getOne queries for affected records
      variables.params.ids.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: [variables.resource, 'getOne', { id }] })
      })
    },
  },
})

/**
 * Hook to update multiple records at once
 *
 * @example
 * ```tsx
 * const [updateMany, { isLoading }] = useUpdateMany()
 * await updateMany('posts', { ids: [1, 2, 3], data: { published: false } })
 * ```
 */
export function useUpdateMany<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
>(
  resource?: string,
  options: UseUpdateManyOptions<RecordType, TVariables> = {}
): UseUpdateManyResult<RecordType, TVariables> {
  return useUpdateManyInternal(resource, options as UseUpdateManyOptions<RaRecord, Record<string, unknown>>) as UseUpdateManyResult<RecordType, TVariables>
}
