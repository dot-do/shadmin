/**
 * Factory functions for creating data hooks
 * Reduces code duplication and ensures consistent behavior across all data hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { useDataProvider } from '../contexts/DataProviderContext'
import { useAuthProvider } from '../contexts/AuthProviderContext'
import { useQueryErrorHandling } from './useErrorHandling'
import {
  isHttpError,
  isValidationError,
  isConflictError as checkConflictError,
  extractFieldErrors,
} from '../errors'
import type { RaRecord, DataProvider } from '../types'

// ============================================================================
// Shared Types
// ============================================================================

/**
 * Base error handling result shared by all hooks
 */
export interface BaseErrorHandling {
  isNetworkError: boolean
  isForbidden: boolean
  isNotFound: boolean
  isServerError: boolean
  isTimeout: boolean
  errorCount: number
  shouldRedirectToLogin: boolean
}

/**
 * Mutation-specific error handling
 */
export interface MutationErrorHandling {
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

// ============================================================================
// Query Hook Factory
// ============================================================================

/**
 * Configuration for creating a query hook
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface QueryHookConfig<
  TMethod extends keyof DataProvider,
  TParams,
  TResult,
  _TRecordType extends RaRecord = RaRecord
> {
  /** The data provider method name */
  method: TMethod

  /** Build the query key from resource and params */
  getQueryKey: (resource: string, params: TParams) => readonly unknown[]

  /** Transform params before calling data provider (e.g., merge with defaults) */
  transformParams?: (params: TParams) => Parameters<DataProvider[TMethod]>[1]

  /** Transform the query result to the hook return shape */
  transformResult: (
    data: Awaited<ReturnType<DataProvider[TMethod]>> | undefined
  ) => TResult

  /** Whether this hook should use auth provider error checking */
  useAuthErrorCheck?: boolean
}

/**
 * Base query hook result
 */
export interface BaseQueryResult {
  isLoading: boolean
  isFetching: boolean
  error: Error | null
  refetch: () => Promise<unknown>
}

/**
 * Creates a query hook with standardized behavior
 */
export function createQueryHook<
  TMethod extends keyof DataProvider,
  TParams,
  TResult,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _TRecordType extends RaRecord = RaRecord,
  TOptions extends Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'> = Omit<
    UseQueryOptions<unknown, Error>,
    'queryKey' | 'queryFn'
  >
>(config: QueryHookConfig<TMethod, TParams, TResult, _TRecordType>) {
  const { method, getQueryKey, transformParams, transformResult, useAuthErrorCheck = true } = config

  return function useDataQuery(
    resource: string,
    params: TParams,
    options: TOptions = {} as TOptions
  ): TResult & BaseQueryResult & BaseErrorHandling {
    const dataProvider = useDataProvider()

    // Conditionally use auth provider for error checking
    let authProvider: { checkError?: (error: Error) => Promise<void> } | undefined
    if (useAuthErrorCheck) {
      try {
        authProvider = useAuthProvider()
      } catch {
        // Auth provider not available
      }
    }

    const queryKey = getQueryKey(resource, params)
    const transformedParams = transformParams
      ? transformParams(params)
      : (params as Parameters<DataProvider[TMethod]>[1])

    const query = useQuery({
      queryKey,
      queryFn: () =>
        (dataProvider[method] as (resource: string, params: unknown) => Promise<unknown>)(
          resource,
          transformedParams
        ),
      ...options,
    })

    const error = query.error ?? null

    // Check error with auth provider for 401 errors
    useEffect(() => {
      if (error && isHttpError(error) && error.status === 401 && authProvider?.checkError) {
        authProvider.checkError(error).catch(() => {
          // Auth provider rejected the error - this is expected behavior
        })
      }
    }, [error, authProvider])

    // Use the error handling utilities
    const errorHandling = useQueryErrorHandling(error, () => {
      // This callback is called when auth error is detected
    }, query.isFetching)

    const result = transformResult(query.data as Awaited<ReturnType<DataProvider[TMethod]>> | undefined)

    return {
      ...result,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error,
      refetch: query.refetch,
      // Error handling enhancements
      isNetworkError: errorHandling.isNetworkError,
      isForbidden: errorHandling.isForbidden,
      isNotFound: errorHandling.isNotFound,
      isServerError: errorHandling.isServerError,
      isTimeout: errorHandling.isTimeout,
      errorCount: errorHandling.errorCount,
      shouldRedirectToLogin: errorHandling.shouldRedirectToLogin,
    }
  }
}

// ============================================================================
// Simple Query Hook Factory (without error enhancements)
// ============================================================================

/**
 * Creates a simpler query hook without auth error checking
 */
export function createSimpleQueryHook<
  TMethod extends keyof DataProvider,
  TParams,
  TResult,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _TRecordType extends RaRecord = RaRecord,
  TOptions extends Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'> = Omit<
    UseQueryOptions<unknown, Error>,
    'queryKey' | 'queryFn'
  >
>(config: Omit<QueryHookConfig<TMethod, TParams, TResult, _TRecordType>, 'useAuthErrorCheck'>) {
  const { method, getQueryKey, transformParams, transformResult } = config

  return function useSimpleDataQuery(
    resource: string,
    params: TParams,
    options: TOptions = {} as TOptions
  ): TResult & Omit<BaseQueryResult, 'isNetworkError' | 'isForbidden' | 'isNotFound' | 'isServerError' | 'isTimeout' | 'errorCount' | 'shouldRedirectToLogin'> {
    const dataProvider = useDataProvider()

    const queryKey = getQueryKey(resource, params)
    const transformedParams = transformParams
      ? transformParams(params)
      : (params as Parameters<DataProvider[TMethod]>[1])

    const query = useQuery({
      queryKey,
      queryFn: () =>
        (dataProvider[method] as (resource: string, params: unknown) => Promise<unknown>)(
          resource,
          transformedParams
        ),
      ...options,
    })

    const result = transformResult(query.data as Awaited<ReturnType<DataProvider[TMethod]>> | undefined)

    return {
      ...result,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error: query.error ?? null,
      refetch: query.refetch,
    }
  }
}

// ============================================================================
// Mutation Hook Factory
// ============================================================================

/**
 * Cache update handler for mutations
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CacheUpdateHandlers<_TRecordType extends RaRecord, TParams, TResult> {
  /** Called before mutation to capture cache state */
  onMutate?: (
    queryClient: ReturnType<typeof useQueryClient>,
    variables: { resource: string; params: TParams }
  ) => Promise<unknown>

  /** Called after successful mutation to update cache */
  onSuccess?: (
    queryClient: ReturnType<typeof useQueryClient>,
    result: TResult,
    variables: { resource: string; params: TParams },
    context: unknown
  ) => void

  /** Called on error to rollback cache */
  onError?: (
    queryClient: ReturnType<typeof useQueryClient>,
    error: Error,
    variables: { resource: string; params: TParams },
    context: unknown
  ) => void
}

/**
 * Configuration for creating a mutation hook
 */
export interface MutationHookConfig<
  TMethod extends keyof DataProvider,
  TParams,
  TResult,
  TRecordType extends RaRecord = RaRecord
> {
  /** The data provider method name */
  method: TMethod

  /** Transform params before calling data provider */
  transformParams?: (params: TParams) => Parameters<DataProvider[TMethod]>[1]

  /** Cache update handlers */
  cacheHandlers?: CacheUpdateHandlers<TRecordType, TParams, TResult>

  /** Extract the data for tracking submissions */
  getSubmittedData?: (params: TParams) => unknown
}

/**
 * Base mutation state
 */
export interface BaseMutationState<TResult> {
  data: TResult | undefined
  error: Error | null
  isLoading: boolean
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  isIdle: boolean
  reset: () => void
}

/**
 * Creates a mutation hook with standardized behavior
 */
export function createMutationHook<
  TMethod extends keyof DataProvider,
  TParams,
  TResult,
  TRecordType extends RaRecord = RaRecord,
  TOptions extends Omit<
    UseMutationOptions<TResult, Error, { resource: string; params: TParams }>,
    'mutationFn'
  > = Omit<UseMutationOptions<TResult, Error, { resource: string; params: TParams }>, 'mutationFn'>
>(config: MutationHookConfig<TMethod, TParams, TResult, TRecordType>) {
  const { method, transformParams, cacheHandlers, getSubmittedData } = config

  return function useMutationHook(
    resource?: string,
    options: TOptions = {} as TOptions
  ): BaseMutationState<TResult> &
    MutationErrorHandling & {
      mutateAsync: (params: TParams) => Promise<TResult>
      mutate: (params: TParams) => void
    } {
    const dataProvider = useDataProvider()
    const queryClient = useQueryClient()

    // Store previous cache state for rollback
    const contextRef = useRef<unknown>(undefined)

    // Track last submitted data and submission count
    const [lastSubmittedData, setLastSubmittedData] = useState<unknown>(undefined)
    const [submissionCount, setSubmissionCount] = useState(0)
    const [fieldErrorsState, setFieldErrorsState] = useState<Record<string, string[]>>({})
    const lastMutationParamsRef = useRef<{ resource: string; params: TParams } | null>(null)

    const mutation = useMutation<TResult, Error, { resource: string; params: TParams }>({
      mutationFn: ({ resource: res, params }) => {
        const transformedParams = transformParams
          ? transformParams(params)
          : (params as Parameters<DataProvider[TMethod]>[1])
        return (dataProvider[method] as (resource: string, params: unknown) => Promise<TResult>)(
          res,
          transformedParams
        )
      },
      onMutate: async (variables) => {
        // Track submission
        const submittedData = getSubmittedData
          ? getSubmittedData(variables.params)
          : variables.params
        setLastSubmittedData(submittedData)
        setSubmissionCount((prev) => prev + 1)
        lastMutationParamsRef.current = variables

        // Call custom onMutate handler
        if (cacheHandlers?.onMutate) {
          contextRef.current = await cacheHandlers.onMutate(queryClient, variables)
        }

        return contextRef.current
      },
      onSuccess: (result, variables, context) => {
        // Clear field errors on success
        setFieldErrorsState({})

        // Call custom onSuccess handler
        if (cacheHandlers?.onSuccess) {
          cacheHandlers.onSuccess(queryClient, result, variables, context)
        }
      },
      onError: (error, variables, context) => {
        // Extract field errors from validation errors
        const extractedErrors = extractFieldErrors(error)
        if (extractedErrors) {
          setFieldErrorsState(extractedErrors)
        }

        // Call custom onError handler
        if (cacheHandlers?.onError) {
          cacheHandlers.onError(queryClient, error, variables, context)
        }
      },
      ...options,
    })

    const mutateAsync = useCallback(
      async (params: TParams): Promise<TResult> => {
        if (!resource) {
          throw new Error(`Resource must be provided either in hook call or in mutateAsync`)
        }
        return mutation.mutateAsync({ resource, params })
      },
      [mutation, resource]
    )

    const mutate = useCallback(
      (params: TParams): void => {
        mutateAsync(params).catch(() => {
          // Errors are handled by the mutation state
        })
      },
      [mutateAsync]
    )

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
        return (error.status === 400 || error.status === 422) && body?.source === 'server'
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

    return useMemo(
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
        mutation.data,
        error,
        mutation.isPending,
        mutation.isSuccess,
        mutation.isError,
        mutation.isIdle,
        mutation.reset,
        mutateAsync,
        mutate,
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
      ]
    )
  }
}

// ============================================================================
// Simple Mutation Hook Factory (for updateMany, deleteMany without enhanced error handling)
// ============================================================================

/**
 * Creates a simpler mutation hook that returns a tuple [mutate, state]
 */
export function createSimpleMutationHook<
  TMethod extends keyof DataProvider,
  TParams,
  TResult,
  TRecordType extends RaRecord = RaRecord,
  TOptions extends Omit<
    UseMutationOptions<TResult, Error, { resource: string; params: TParams }>,
    'mutationFn'
  > = Omit<UseMutationOptions<TResult, Error, { resource: string; params: TParams }>, 'mutationFn'>
>(config: Omit<MutationHookConfig<TMethod, TParams, TResult, TRecordType>, 'getSubmittedData'>) {
  const { method, transformParams, cacheHandlers } = config

  type MutateFunction = {
    (resource: string, params: TParams): Promise<TResult>
    (params: TParams): Promise<TResult>
  }

  type SimpleMutationState = {
    data: TResult | undefined
    error: Error | null
    isLoading: boolean
    isPending: boolean
    isSuccess: boolean
    isError: boolean
    isIdle: boolean
    reset: () => void
  }

  return function useSimpleMutationHook(
    resource?: string,
    options: TOptions = {} as TOptions
  ): [MutateFunction, SimpleMutationState] {
    const dataProvider = useDataProvider()
    const queryClient = useQueryClient()

    const contextRef = useRef<unknown>(undefined)

    const mutation = useMutation<TResult, Error, { resource: string; params: TParams }>({
      mutationFn: ({ resource: res, params }) => {
        const transformedParams = transformParams
          ? transformParams(params)
          : (params as Parameters<DataProvider[TMethod]>[1])
        return (dataProvider[method] as (resource: string, params: unknown) => Promise<TResult>)(
          res,
          transformedParams
        )
      },
      onMutate: async (variables) => {
        if (cacheHandlers?.onMutate) {
          contextRef.current = await cacheHandlers.onMutate(queryClient, variables)
        }
        return contextRef.current
      },
      onSuccess: (result, variables, context) => {
        if (cacheHandlers?.onSuccess) {
          cacheHandlers.onSuccess(queryClient, result, variables, context)
        }
      },
      onError: (error, variables, context) => {
        if (cacheHandlers?.onError) {
          cacheHandlers.onError(queryClient, error, variables, context)
        }
      },
      ...options,
    })

    const mutateAsync = useCallback(
      async (
        resourceOrParams: string | TParams,
        maybeParams?: TParams
      ): Promise<TResult> => {
        let actualResource: string
        let actualParams: TParams

        if (typeof resourceOrParams === 'string') {
          actualResource = resourceOrParams
          actualParams = maybeParams!
        } else {
          if (!resource) {
            throw new Error('Resource must be provided either in hook call or in mutate()')
          }
          actualResource = resource
          actualParams = resourceOrParams
        }

        return mutation.mutateAsync({ resource: actualResource, params: actualParams })
      },
      [mutation, resource]
    ) as MutateFunction

    const state: SimpleMutationState = useMemo(
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
      [
        mutation.data,
        mutation.error,
        mutation.isPending,
        mutation.isSuccess,
        mutation.isError,
        mutation.isIdle,
        mutation.reset,
      ]
    )

    return [mutateAsync, state]
  }
}
