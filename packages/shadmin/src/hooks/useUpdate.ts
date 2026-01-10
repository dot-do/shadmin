/**
 * useUpdate hook
 * Updates an existing record using the data provider
 * 100% API-compatible with react-admin
 */

import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import {
  isHttpError,
  isValidationError,
  isConflictError as checkConflictError,
  extractFieldErrors,
} from '../errors'
import type {
  RaRecord,
  Identifier,
  UpdateParams,
  UpdateResult,
  GetListResult,
  GetOneResult,
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
  // Error handling enhancements
  fieldErrors: Record<string, string[]> | null
  isServerValidationError: boolean
  isConflictError: boolean
  retryAfter: number | undefined
  getFieldErrors: (field: string) => string[]
  hasFieldError: (field: string) => boolean
  clearError: () => void
  clearFieldError: (field: string) => void
  lastSubmittedData: unknown
  submissionCount: number
  retry: (() => Promise<unknown>) | undefined
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
 * Return type for useUpdate hook - object with mutation function and state
 */
export interface UseUpdateResult<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> extends UseUpdateMutationState<RecordType> {
  /** Async mutation function */
  mutateAsync: (params: UseUpdateMutateParams<TVariables>) => Promise<UpdateResult<RecordType>>
  /** Sync mutation function */
  mutate: (params: UseUpdateMutateParams<TVariables>) => void
}

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
// Helper type for cache snapshot
interface CacheSnapshot {
  getOne: { key: string; data: unknown } | null
  lists: Array<{ key: string; data: unknown }>
}

export function useUpdate<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
>(
  resource?: string,
  options: UseUpdateOptions<RecordType, TVariables> = {}
): UseUpdateResult<RecordType, TVariables> {
  const dataProvider = useDataProvider()
  const queryClient = useQueryClient()

  // Store previous cache state for rollback
  const previousCacheRef = useRef<CacheSnapshot>({ getOne: null, lists: [] })

  // Track last submitted data and submission count
  const [lastSubmittedData, setLastSubmittedData] = useState<unknown>(undefined)
  const [submissionCount, setSubmissionCount] = useState(0)
  const [fieldErrorsState, setFieldErrorsState] = useState<Record<string, string[]>>({})
  const lastMutationParamsRef = useRef<{ resource: string; params: UseUpdateMutateParams<TVariables> } | null>(null)

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
    onMutate: async (variables) => {
      // Track submission
      setLastSubmittedData(variables.params.data)
      setSubmissionCount(prev => prev + 1)
      lastMutationParamsRef.current = variables

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [variables.resource] })

      // Create the optimistic record by merging previousData with new data
      const previousData = variables.params.previousData as RecordType | undefined
      const optimisticRecord = {
        ...previousData,
        ...variables.params.data,
        id: variables.params.id,
      } as RecordType

      const cache = queryClient.getQueryCache()

      // Find and snapshot the getOne cache - need to match any query for this id
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

        // Apply optimistic update to getOne cache using the actual query key
        queryClient.setQueryData<GetOneResult<RecordType>>(query.queryKey, {
          data: optimisticRecord,
        })
      } else {
        previousCacheRef.current.getOne = null
      }

      // Snapshot and apply optimistic update to list caches
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
            data: oldData.data.map((record) =>
              record.id === variables.params.id ? optimisticRecord : record
            ),
          }
        })
      })
    },
    onSuccess: (result, variables) => {
      // Clear field errors on success
      setFieldErrorsState({})

      const cache = queryClient.getQueryCache()

      // Apply the server response to getOne caches - find matching queries
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
        queryClient.setQueryData<GetOneResult<RecordType>>(query.queryKey, {
          data: result.data,
        })
      })

      // Update list caches with server response
      const listQueries = cache.findAll({ queryKey: [variables.resource, 'getList'] })

      listQueries.forEach((query) => {
        queryClient.setQueryData<GetListResult<RecordType>>(query.queryKey, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: oldData.data.map((record) =>
              record.id === variables.params.id ? result.data : record
            ),
          }
        })
      })

      // Clear the snapshot since we succeeded
      previousCacheRef.current = { getOne: null, lists: [] }
    },
    onError: (error) => {
      // Extract field errors from validation errors
      const extractedErrors = extractFieldErrors(error)
      if (extractedErrors) {
        setFieldErrorsState(extractedErrors)
      }

      // Rollback to previous cache state
      const snapshot = previousCacheRef.current

      if (snapshot.getOne) {
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

  // Error handling helpers
  const error = mutation.error ?? null

  const getFieldErrors = useCallback(
    (field: string): string[] => {
      return fieldErrorsState[field] || []
    },
    [fieldErrorsState]
  )

  const hasFieldError = useCallback(
    (field: string): boolean => {
      return (fieldErrorsState[field]?.length ?? 0) > 0
    },
    [fieldErrorsState]
  )

  const clearError = useCallback(() => {
    mutation.reset()
    setFieldErrorsState({})
  }, [mutation])

  const clearFieldError = useCallback((field: string) => {
    setFieldErrorsState((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const retry = useMemo(() => {
    if (!lastMutationParamsRef.current) return undefined
    const params = lastMutationParamsRef.current
    return async () => {
      return mutation.mutateAsync(params)
    }
  }, [mutation])

  // Compute derived error state
  const fieldErrors = useMemo(() => {
    if (!error) return null
    if (Object.keys(fieldErrorsState).length > 0) {
      return fieldErrorsState
    }
    return extractFieldErrors(error)
  }, [error, fieldErrorsState])

  const isServerValidationError = useMemo(() => {
    if (!error) return false
    if (isValidationError(error)) return true
    if (isHttpError(error)) {
      const body = error.body as Record<string, unknown> | undefined
      return (
        (error.status === 400 || error.status === 422) &&
        body?.source === 'server'
      )
    }
    return false
  }, [error])

  const isConflictError = useMemo(() => checkConflictError(error), [error])

  const retryAfter = useMemo(() => {
    if (isHttpError(error) && error?.status === 429) {
      const body = error.body as { retryAfter?: number } | undefined
      return body?.retryAfter
    }
    return undefined
  }, [error])

  // Create mutateAsync function that calls update with pre-configured resource
  const mutateAsync = useCallback(
    (params: UseUpdateMutateParams<TVariables>): Promise<UpdateResult<RecordType>> => {
      if (!resource) {
        throw new Error('Resource must be provided in useUpdate() when using mutateAsync')
      }
      return update(resource, params)
    },
    [update, resource]
  )

  // Create mutate function (fire and forget)
  const mutate = useCallback(
    (params: UseUpdateMutateParams<TVariables>): void => {
      mutateAsync(params).catch(() => {
        // Errors are handled by the mutation state
      })
    },
    [mutateAsync]
  )

  const result: UseUpdateResult<RecordType, TVariables> = useMemo(
    () => ({
      data: mutation.data,
      error,
      isLoading: mutation.isPending,
      isPending: mutation.isPending,
      isSuccess: mutation.isSuccess,
      isError: mutation.isError,
      isIdle: mutation.isIdle,
      reset: mutation.reset,
      // Mutation functions
      mutateAsync,
      mutate,
      // Error handling enhancements
      fieldErrors,
      isServerValidationError,
      isConflictError,
      retryAfter,
      getFieldErrors,
      hasFieldError,
      clearError,
      clearFieldError,
      lastSubmittedData,
      submissionCount,
      retry,
    }),
    [
      mutation.data, error, mutation.isPending, mutation.isSuccess, mutation.isError, mutation.isIdle, mutation.reset,
      mutateAsync, mutate,
      fieldErrors, isServerValidationError, isConflictError, retryAfter, getFieldErrors, hasFieldError,
      clearError, clearFieldError, lastSubmittedData, submissionCount, retry,
    ]
  )

  return result
}
