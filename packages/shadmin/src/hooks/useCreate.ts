/**
 * useCreate hook
 * Creates a new record using the data provider
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
import { logger } from '../utils/logger'
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
 * Return type for useCreate hook - tuple of [create function, mutation state]
 */
export type UseCreateResult<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> = [
  CreateFunction<RecordType, TVariables>,
  UseCreateMutationState<RecordType>
]

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

  // Track last submitted data and submission count
  const [lastSubmittedData, setLastSubmittedData] = useState<unknown>(undefined)
  const [submissionCount, setSubmissionCount] = useState(0)
  const [fieldErrorsState, setFieldErrorsState] = useState<Record<string, string[]>>({})
  const lastMutationParamsRef = useRef<{ resource: string; params: UseCreateMutateParams<TVariables> } | null>(null)

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
      // Track submission
      setLastSubmittedData(variables.params.data)
      setSubmissionCount(prev => prev + 1)
      lastMutationParamsRef.current = variables

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
      // Clear field errors on success
      setFieldErrorsState({})

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
              result.catch((error) => {
                // Log but don't throw - cache invalidation failure shouldn't break create
                logger.warn('getManyReference cache invalidation failed:', error)
              })
            }
          } catch (error) {
            // Log but don't throw - getManyReference may not be implemented
            logger.warn('getManyReference not available or failed:', error)
          }
        }
      })
    },
    onError: (error, _variables) => {
      // Extract field errors from validation errors
      const extractedErrors = extractFieldErrors(error)
      if (extractedErrors) {
        setFieldErrorsState(extractedErrors)
      }

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

  // Create mutateAsync function that calls create with pre-configured resource
  const mutateAsync = useCallback(
    (params: UseCreateMutateParams<TVariables>): Promise<CreateResult<RecordType>> => {
      if (!resource) {
        throw new Error('Resource must be provided in useCreate() when using mutateAsync')
      }
      return create(resource, params)
    },
    [create, resource]
  )

  // Create mutate function (fire and forget) - exported for API compatibility
  const _mutate = useCallback(
    (params: UseCreateMutateParams<TVariables>): void => {
      mutateAsync(params).catch((error) => {
        // Errors are handled by the mutation state, but log in dev for visibility
        logger.warn('useCreate mutate failed (error available in mutation state):', error)
      })
    },
    [mutateAsync]
  )
  // Expose mutate for potential future use
  void _mutate

  const state: UseCreateMutationState<RecordType> = useMemo(
    () => ({
      data: mutation.data,
      error,
      isLoading: mutation.isPending,
      isPending: mutation.isPending,
      isSuccess: mutation.isSuccess,
      isError: mutation.isError,
      isIdle: mutation.isIdle,
      reset: mutation.reset,
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
      fieldErrors, isServerValidationError, isConflictError, retryAfter, getFieldErrors, hasFieldError,
      clearError, clearFieldError, lastSubmittedData, submissionCount, retry,
    ]
  )

  return [create, state] as UseCreateResult<RecordType, TVariables>
}
