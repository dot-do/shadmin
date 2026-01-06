/**
 * useUpdateMany hook
 * Updates multiple records at once using the data provider
 * 100% API-compatible with react-admin
 */

import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import type {
  RaRecord,
  Identifier,
  UpdateManyParams,
  UpdateManyResult,
} from '../types'

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
  const dataProvider = useDataProvider()
  const queryClient = useQueryClient()

  const mutation = useMutation<
    UpdateManyResult<RecordType>,
    Error,
    { resource: string; params: UseUpdateManyMutateParams<TVariables> }
  >({
    mutationFn: ({ resource: res, params }) => {
      const updateManyParams: UpdateManyParams<TVariables> = {
        ids: params.ids,
        data: params.data,
        ...(params.meta && { meta: params.meta }),
      }
      return dataProvider.updateMany<RecordType, TVariables>(res, updateManyParams)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getList'] })
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getMany'] })
      // Invalidate individual getOne queries for affected records
      variables.params.ids.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: [variables.resource, 'getOne', { id }] })
      })
    },
    ...options,
  })

  const updateMany = useCallback(
    async (
      resourceOrParams: string | UseUpdateManyMutateParams<TVariables>,
      maybeParams?: UseUpdateManyMutateParams<TVariables>
    ): Promise<UpdateManyResult<RecordType>> => {
      let actualResource: string
      let actualParams: UseUpdateManyMutateParams<TVariables>

      if (typeof resourceOrParams === 'string') {
        actualResource = resourceOrParams
        actualParams = maybeParams!
      } else {
        if (!resource) {
          throw new Error('Resource must be provided either in useUpdateMany() or in updateMany()')
        }
        actualResource = resource
        actualParams = resourceOrParams
      }

      return mutation.mutateAsync({ resource: actualResource, params: actualParams })
    },
    [mutation, resource]
  ) as UpdateManyFunction<RecordType, TVariables>

  const state: UseUpdateManyMutationState<RecordType> = useMemo(
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

  return [updateMany, state]
}
