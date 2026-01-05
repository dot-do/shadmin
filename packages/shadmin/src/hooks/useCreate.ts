/**
 * useCreate hook
 * Creates a new record using the data provider
 * 100% API-compatible with react-admin
 */

import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import type {
  RaRecord,
  CreateParams,
  CreateResult,
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
    onSuccess: (data, variables) => {
      // Invalidate list queries for this resource
      queryClient.invalidateQueries({ queryKey: [variables.resource, 'getList'] })
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

  const state: UseCreateMutationState<RecordType> = {
    data: mutation.data,
    error: mutation.error ?? null,
    isLoading: mutation.isPending,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    isIdle: mutation.isIdle,
    reset: mutation.reset,
  }

  return [create, state]
}
