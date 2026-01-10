/**
 * useDOForm Hook
 *
 * Durable Objects-backed form hook for create, update, and delete operations.
 * Integrates with TanStack Query for optimistic updates and cache management,
 * with react-hook-form compatible validation error handling.
 *
 * @module dotdo-react/use-do-form
 *
 * @example
 * ```tsx
 * import { useDOForm } from 'shadmin/dotdo-react'
 *
 * function UserForm({ user }) {
 *   const { create, update, state } = useDOForm('users')
 *
 *   const handleSubmit = async (data) => {
 *     if (user) {
 *       await update({ id: user.id, data })
 *     } else {
 *       await create({ data })
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {state.hasFieldError('email') && (
 *         <span>{state.getFieldErrors('email')[0]}</span>
 *       )}
 *       <button disabled={state.isLoading}>Save</button>
 *     </form>
 *   )
 * }
 * ```
 */

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useShadminDO, useShadminDOOptional } from './provider'
import type { RaRecord, Identifier } from '../types'
import type {
  UseDOFormCreateParams,
  UseDOFormUpdateParams,
  UseDOFormOptions,
  UseDOFormResult,
  UseDOFormMutationState,
  DORecordResult,
  DOListResult,
} from './types'

/**
 * Extended options for useDOForm hook
 */
export interface UseDOFormExtendedOptions<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
> extends UseDOFormOptions {
  /**
   * TanStack Mutation options for create
   */
  createOptions?: Omit<
    UseMutationOptions<RecordType, Error, UseDOFormCreateParams<TVariables>>,
    'mutationFn'
  >

  /**
   * TanStack Mutation options for update
   */
  updateOptions?: Omit<
    UseMutationOptions<RecordType, Error, UseDOFormUpdateParams<TVariables>>,
    'mutationFn'
  >

  /**
   * TanStack Mutation options for delete
   */
  deleteOptions?: Omit<UseMutationOptions<void, Error, Identifier>, 'mutationFn'>
}

/**
 * Extract field errors from an error response
 */
function extractFieldErrors(error: Error): Record<string, string[]> | null {
  // Check for validation error shape
  const body = (error as { body?: Record<string, unknown> }).body

  if (body && typeof body === 'object') {
    // Handle { errors: { field: ['message'] } } format
    if ('errors' in body && typeof body.errors === 'object' && body.errors !== null) {
      return body.errors as Record<string, string[]>
    }

    // Handle { fieldErrors: { field: ['message'] } } format
    if ('fieldErrors' in body && typeof body.fieldErrors === 'object' && body.fieldErrors !== null) {
      return body.fieldErrors as Record<string, string[]>
    }

    // Handle { field: ['message'] } format
    const maybeFieldErrors: Record<string, string[]> = {}
    let hasFieldErrors = false

    for (const [key, value] of Object.entries(body)) {
      if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
        maybeFieldErrors[key] = value
        hasFieldErrors = true
      }
    }

    if (hasFieldErrors) {
      return maybeFieldErrors
    }
  }

  return null
}

/**
 * Hook for form operations backed by Durable Objects
 *
 * Provides create, update, and delete functions with optimistic updates,
 * cache management, and field-level error handling.
 *
 * @param resource - The resource name (collection) to operate on
 * @param options - Optional configuration and callbacks
 * @returns Object with mutation functions and state
 *
 * @example Create operation
 * ```tsx
 * const { create, state } = useDOForm('posts')
 *
 * const handleCreate = async () => {
 *   try {
 *     const post = await create({ data: { title: 'New Post' } })
 *     console.log('Created:', post.id)
 *   } catch (error) {
 *     console.error('Failed:', error)
 *   }
 * }
 * ```
 *
 * @example Update with optimistic UI
 * ```tsx
 * const { update, state } = useDOForm('users', {
 *   optimistic: true,
 *   onSuccess: () => toast.success('Saved!'),
 *   onError: (error) => toast.error(error.message),
 * })
 *
 * const handleUpdate = (data) => {
 *   update({ id: userId, data, previousData: currentUser })
 * }
 * ```
 *
 * @example Delete with confirmation
 * ```tsx
 * const { remove, state } = useDOForm('comments')
 *
 * const handleDelete = async (id) => {
 *   if (confirm('Delete this comment?')) {
 *     await remove(id)
 *   }
 * }
 * ```
 */
export function useDOForm<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
>(
  resource: string,
  options: UseDOFormExtendedOptions<RecordType, TVariables> = {}
): UseDOFormResult<RecordType, TVariables> {
  const { client, connectionState, getResourceName } = useShadminDO()
  const queryClient = useQueryClient()

  // Get the actual resource name
  const resourceName = useMemo(() => getResourceName(resource), [getResourceName, resource])

  // Track field errors and submission state
  const [fieldErrorsState, setFieldErrorsState] = useState<Record<string, string[]>>({})
  const lastOperationRef = useRef<'create' | 'update' | 'delete' | null>(null)

  // Store previous cache for rollback
  const previousCacheRef = useRef<{
    lists: Array<{ key: string; data: unknown }>
    record: { key: string; data: unknown } | null
  }>({
    lists: [],
    record: null,
  })

  // ==========================================================================
  // CREATE MUTATION
  // ==========================================================================

  const createMutation = useMutation<RecordType, Error, UseDOFormCreateParams<TVariables>>({
    mutationFn: async (params) => {
      lastOperationRef.current = 'create'

      const result = (await client.create(resourceName, {
        data: params.data,
        meta: params.meta,
      })) as DORecordResult<RecordType>

      return result.data
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['do', resourceName, 'list'] })

      // Snapshot list caches for rollback
      const cache = queryClient.getQueryCache()
      const queries = cache.findAll({ queryKey: ['do', resourceName, 'list'] })

      previousCacheRef.current.lists = queries.map((q) => ({
        key: JSON.stringify(q.queryKey),
        data: q.state.data,
      }))
    },
    onSuccess: (data) => {
      setFieldErrorsState({})

      // Add to list caches
      const cache = queryClient.getQueryCache()
      const queries = cache.findAll({ queryKey: ['do', resourceName, 'list'] })

      queries.forEach((query) => {
        queryClient.setQueryData<DOListResult<RecordType>>(query.queryKey, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: [data, ...oldData.data],
            total: (oldData.total ?? 0) + 1,
          }
        })
      })

      // Set the getOne cache for the new record
      queryClient.setQueryData(['do', resourceName, 'show', { id: data.id }], { data })

      options.onSuccess?.(data)
    },
    onError: (error) => {
      // Extract field errors
      const errors = extractFieldErrors(error)
      if (errors) {
        setFieldErrorsState(errors)
      }

      // Rollback list caches
      previousCacheRef.current.lists.forEach(({ key, data }) => {
        queryClient.setQueryData(JSON.parse(key), data)
      })

      options.onError?.(error)
    },
    ...options.createOptions,
  })

  // ==========================================================================
  // UPDATE MUTATION
  // ==========================================================================

  const updateMutation = useMutation<RecordType, Error, UseDOFormUpdateParams<TVariables>>({
    mutationFn: async (params) => {
      lastOperationRef.current = 'update'

      const result = (await client.update(resourceName, {
        id: params.id,
        data: params.data,
        previousData: params.previousData,
        meta: params.meta,
      })) as DORecordResult<RecordType>

      return result.data
    },
    onMutate: async (variables) => {
      if (options.optimistic === false) return

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['do', resourceName] })

      // Create optimistic record
      const optimisticRecord = {
        ...(variables.previousData as unknown as RecordType),
        ...(variables.data as unknown as Partial<RecordType>),
        id: variables.id,
      } as RecordType

      const cache = queryClient.getQueryCache()

      // Snapshot and update show cache
      const showQueries = cache.findAll({
        queryKey: ['do', resourceName, 'show'],
        predicate: (query) => {
          const key = query.queryKey
          if (key.length >= 4 && typeof key[3] === 'object' && key[3] !== null) {
            return (key[3] as { id?: unknown }).id === variables.id
          }
          return false
        },
      })

      if (showQueries.length > 0) {
        const query = showQueries[0]
        previousCacheRef.current.record = {
          key: JSON.stringify(query.queryKey),
          data: query.state.data,
        }
        queryClient.setQueryData<DORecordResult<RecordType>>(query.queryKey, { data: optimisticRecord })
      }

      // Snapshot and update list caches
      const listQueries = cache.findAll({ queryKey: ['do', resourceName, 'list'] })

      previousCacheRef.current.lists = listQueries.map((q) => ({
        key: JSON.stringify(q.queryKey),
        data: q.state.data,
      }))

      listQueries.forEach((query) => {
        queryClient.setQueryData<DOListResult<RecordType>>(query.queryKey, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: oldData.data.map((record) =>
              record.id === variables.id ? optimisticRecord : record
            ),
          }
        })
      })
    },
    onSuccess: (data, variables) => {
      setFieldErrorsState({})

      const cache = queryClient.getQueryCache()

      // Update show cache with server response
      const showQueries = cache.findAll({
        queryKey: ['do', resourceName, 'show'],
        predicate: (query) => {
          const key = query.queryKey
          if (key.length >= 4 && typeof key[3] === 'object' && key[3] !== null) {
            return (key[3] as { id?: unknown }).id === variables.id
          }
          return false
        },
      })

      showQueries.forEach((query) => {
        queryClient.setQueryData<DORecordResult<RecordType>>(query.queryKey, { data })
      })

      // Update list caches with server response
      const listQueries = cache.findAll({ queryKey: ['do', resourceName, 'list'] })

      listQueries.forEach((query) => {
        queryClient.setQueryData<DOListResult<RecordType>>(query.queryKey, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: oldData.data.map((record) => (record.id === variables.id ? data : record)),
          }
        })
      })

      previousCacheRef.current = { lists: [], record: null }
      options.onSuccess?.(data)
    },
    onError: (error) => {
      // Extract field errors
      const errors = extractFieldErrors(error)
      if (errors) {
        setFieldErrorsState(errors)
      }

      // Rollback caches
      if (previousCacheRef.current.record) {
        const { key, data } = previousCacheRef.current.record
        queryClient.setQueryData(JSON.parse(key), data)
      }

      previousCacheRef.current.lists.forEach(({ key, data }) => {
        queryClient.setQueryData(JSON.parse(key), data)
      })

      previousCacheRef.current = { lists: [], record: null }
      options.onError?.(error)
    },
    ...options.updateOptions,
  })

  // ==========================================================================
  // DELETE MUTATION
  // ==========================================================================

  const deleteMutation = useMutation<void, Error, Identifier>({
    mutationFn: async (id) => {
      lastOperationRef.current = 'delete'
      await client.delete(resourceName, { id })
    },
    onMutate: async (id) => {
      if (options.optimistic === false) return

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['do', resourceName] })

      const cache = queryClient.getQueryCache()

      // Snapshot and remove from list caches
      const listQueries = cache.findAll({ queryKey: ['do', resourceName, 'list'] })

      previousCacheRef.current.lists = listQueries.map((q) => ({
        key: JSON.stringify(q.queryKey),
        data: q.state.data,
      }))

      listQueries.forEach((query) => {
        queryClient.setQueryData<DOListResult<RecordType>>(query.queryKey, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: oldData.data.filter((record) => record.id !== id),
            total: Math.max(0, (oldData.total ?? 0) - 1),
          }
        })
      })

      // Snapshot show cache
      const showQueries = cache.findAll({
        queryKey: ['do', resourceName, 'show'],
        predicate: (query) => {
          const key = query.queryKey
          if (key.length >= 4 && typeof key[3] === 'object' && key[3] !== null) {
            return (key[3] as { id?: unknown }).id === id
          }
          return false
        },
      })

      if (showQueries.length > 0) {
        const query = showQueries[0]
        previousCacheRef.current.record = {
          key: JSON.stringify(query.queryKey),
          data: query.state.data,
        }
        queryClient.removeQueries({ queryKey: query.queryKey })
      }
    },
    onSuccess: () => {
      setFieldErrorsState({})
      previousCacheRef.current = { lists: [], record: null }
      options.onSuccess?.(undefined)
    },
    onError: (error) => {
      // Rollback caches
      if (previousCacheRef.current.record) {
        const { key, data } = previousCacheRef.current.record
        queryClient.setQueryData(JSON.parse(key), data)
      }

      previousCacheRef.current.lists.forEach(({ key, data }) => {
        queryClient.setQueryData(JSON.parse(key), data)
      })

      previousCacheRef.current = { lists: [], record: null }
      options.onError?.(error)
    },
    ...options.deleteOptions,
  })

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================

  const create = useCallback(
    async (params: UseDOFormCreateParams<TVariables>): Promise<RecordType> => {
      return createMutation.mutateAsync(params)
    },
    [createMutation]
  )

  const update = useCallback(
    async (params: UseDOFormUpdateParams<TVariables>): Promise<RecordType> => {
      return updateMutation.mutateAsync(params)
    },
    [updateMutation]
  )

  const remove = useCallback(
    async (id: Identifier): Promise<void> => {
      return deleteMutation.mutateAsync(id)
    },
    [deleteMutation]
  )

  // Error helpers
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
    createMutation.reset()
    updateMutation.reset()
    deleteMutation.reset()
    setFieldErrorsState({})
  }, [createMutation, updateMutation, deleteMutation])

  const clearFieldError = useCallback((field: string) => {
    setFieldErrorsState((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const reset = useCallback(() => {
    createMutation.reset()
    updateMutation.reset()
    deleteMutation.reset()
    setFieldErrorsState({})
    lastOperationRef.current = null
  }, [createMutation, updateMutation, deleteMutation])

  // Derive current state from the last operation
  const currentMutation = useMemo(() => {
    switch (lastOperationRef.current) {
      case 'create':
        return createMutation
      case 'update':
        return updateMutation
      case 'delete':
        return deleteMutation
      default:
        return createMutation
    }
  }, [createMutation, updateMutation, deleteMutation])

  const state: UseDOFormMutationState<RecordType> = useMemo(
    () => ({
      data: currentMutation.data as RecordType | undefined,
      error: currentMutation.error ?? null,
      isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
      isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
      isSuccess: currentMutation.isSuccess,
      isError: currentMutation.isError,
      isIdle: createMutation.isIdle && updateMutation.isIdle && deleteMutation.isIdle,
      reset,
      fieldErrors: Object.keys(fieldErrorsState).length > 0 ? fieldErrorsState : null,
      getFieldErrors,
      hasFieldError,
      clearError,
      clearFieldError,
    }),
    [
      currentMutation,
      createMutation.isPending,
      updateMutation.isPending,
      deleteMutation.isPending,
      createMutation.isIdle,
      updateMutation.isIdle,
      deleteMutation.isIdle,
      reset,
      fieldErrorsState,
      getFieldErrors,
      hasFieldError,
      clearError,
      clearFieldError,
    ]
  )

  return {
    create,
    update,
    remove,
    state,
    connectionState,
  }
}

/**
 * Hook variant that doesn't throw if DO provider is not available
 *
 * Returns no-op functions when not within a ShadminDOProvider,
 * allowing graceful fallback behavior.
 *
 * @param resource - The resource name to operate on
 * @param options - Optional configuration and callbacks
 * @returns Form functions or no-ops if not in provider
 */
export function useDOFormOptional<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
>(
  resource: string,
  options: UseDOFormExtendedOptions<RecordType, TVariables> = {}
): UseDOFormResult<RecordType, TVariables> {
  const context = useShadminDOOptional()

  // If no context, return no-op functions
  if (!context) {
    return {
      create: async () => {
        throw new Error('Not connected to Durable Objects')
      },
      update: async () => {
        throw new Error('Not connected to Durable Objects')
      },
      remove: async () => {
        throw new Error('Not connected to Durable Objects')
      },
      state: {
        data: undefined,
        error: null,
        isLoading: false,
        isPending: false,
        isSuccess: false,
        isError: false,
        isIdle: true,
        reset: () => {},
        fieldErrors: null,
        getFieldErrors: () => [],
        hasFieldError: () => false,
        clearError: () => {},
        clearFieldError: () => {},
      },
      connectionState: 'disconnected',
    }
  }

  // Use the regular hook when context is available
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useDOForm<RecordType, TVariables>(resource, options)
}
