/**
 * useUpdate hook
 * Updates an existing record using the data provider
 * 100% API-compatible with react-admin
 */

import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import type {
  RaRecord,
  Identifier,
  UpdateParams,
  UpdateResult,
} from '../types'

/**
 * Parameters for the update mutation
 */
export interface UseUpdateMutateParams<TData = Record<string, unknown>> {
  id: Identifier
  data: TData
  previousData?: TData
  meta?: Record<string, unknown>
}

/**
 * Options for useUpdate hook
 */
export interface UseUpdateOptions<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> extends Omit<
    UseMutationOptions<UpdateResult<RecordType>, Error, { resource: string; params: UseUpdateMutateParams<TVariables> }>,
    'mutationFn'
  > {}

/**
 * Return type for useUpdate hook mutation state
 */
export interface UseUpdateMutationState<RecordType extends RaRecord = RaRecord> {
  data: UpdateResult<RecordType> | undefined
  error: Error | null
  isLoading: boolean
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  isIdle: boolean
  reset: () => void
}

/**
 * Update function signature
 */
export type UpdateFunction<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> = {
  (resource: string, params: UseUpdateMutateParams<TVariables>): Promise<UpdateResult<RecordType>>
  (params: UseUpdateMutateParams<TVariables>): Promise<UpdateResult<RecordType>>
}

/**
 * Return type for useUpdate hook
 */
export type UseUpdateResult<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> = [UpdateFunction<RecordType, TVariables>, UseUpdateMutationState<RecordType>]

/**
 * Hook to update an existing record using the data provider
 *
 * @param resource - Optional resource name (can be provided when calling update instead)
 * @param options - Optional mutation options
 * @returns Tuple of [update function, mutation state]
 *
 * @example
 * ```tsx
 * const [update, { isLoading }] = useUpdate()
 * await update('posts', { id: 123, data: { title: 'Updated' }, previousData: {...} })
 * ```
 */
export function useUpdate<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
>(
  resource?: string,
  options: UseUpdateOptions<RecordType, TVariables> = {}
): UseUpdateResult<RecordType, TVariables> {
  const dataProvider = useDataProvider()
  const queryClient = useQueryClient()

  const mutation = useMutation<
    UpdateResult<RecordType>,
    Error,
    { resource: string; params: UseUpdateMutateParams<TVariables> }
  >({
    mutationFn: ({ resource: res, params }) => {
      const updateParams: UpdateParams<TVariables> = {
        id: params.id,
        data: params.data,
        ...(params.previousData && { previousData: params.previousData }),
        ...(params.meta && { meta: params.meta }),
      }
      return dataProvider.update<RecordType, TVariables>(res, updateParams)
    },
    onSuccess: (_data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getList'] })
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getOne', { id: variables.params.id }] })
    },
    ...options,
  })

  const update = useCallback(
    async (
      resourceOrParams: string | UseUpdateMutateParams<TVariables>,
      maybeParams?: UseUpdateMutateParams<TVariables>
    ): Promise<UpdateResult<RecordType>> => {
      let actualResource: string
      let actualParams: UseUpdateMutateParams<TVariables>

      if (typeof resourceOrParams === 'string') {
        actualResource = resourceOrParams
        actualParams = maybeParams!
      } else {
        if (!resource) {
          throw new Error('Resource must be provided either in useUpdate() or in update()')
        }
        actualResource = resource
        actualParams = resourceOrParams
      }

      return mutation.mutateAsync({ resource: actualResource, params: actualParams })
    },
    [mutation, resource]
  ) as UpdateFunction<RecordType, TVariables>

  const state: UseUpdateMutationState<RecordType> = {
    data: mutation.data,
    error: mutation.error ?? null,
    isLoading: mutation.isPending,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    isIdle: mutation.isIdle,
    reset: mutation.reset,
  }

  return [update, state]
}
