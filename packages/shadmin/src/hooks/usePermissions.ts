/**
 * usePermissions hook
 * Fetches and caches permissions from the AuthProvider.
 *
 * 100% API-compatible with react-admin.
 *
 * Features:
 * - Automatic caching via React Query (5 minute stale time)
 * - Lazy loading support via enabled option
 * - Manual refetch capability
 * - Error handling with typed errors
 *
 * @module hooks/usePermissions
 */

import { useMemo } from 'react'
import { useQuery, type QueryObserverResult } from '@tanstack/react-query'
import { useAuthProvider } from '../contexts/AuthProviderContext'

/**
 * Options for usePermissions hook
 */
export interface UsePermissionsOptions {
  /** Whether to enable the query. @default true */
  enabled?: boolean
  /** Parameters to pass to getPermissions */
  params?: Record<string, unknown>
}

/**
 * Return type for usePermissions hook
 */
export interface UsePermissionsResult<Permissions = unknown> {
  /** The permissions data, undefined while loading or on error */
  permissions: Permissions | undefined
  /** Whether the query is in initial loading state */
  isLoading: boolean
  /** Error from the query, null if no error */
  error: Error | null
  /** Function to manually refetch permissions */
  refetch: () => Promise<QueryObserverResult<Permissions, Error>>
}

/**
 * Hook to fetch permissions from the AuthProvider.
 * Caches permissions using React Query to avoid redundant fetches.
 *
 * @typeParam Permissions - The type of permissions returned by the AuthProvider
 * @param options - Optional configuration for enabling/disabling and params
 * @returns Object containing permissions data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { permissions, isLoading, error } = usePermissions()
 *
 * // With TypeScript generic
 * const { permissions } = usePermissions<string[]>()
 * // permissions is typed as string[] | undefined
 *
 * // Conditional fetching
 * const { permissions } = usePermissions({ enabled: isLoggedIn })
 *
 * // With params
 * const { permissions } = usePermissions({ params: { scope: 'admin' } })
 *
 * // Manual refetch
 * const { refetch } = usePermissions()
 * await refetch()
 * ```
 */
export function usePermissions<Permissions = unknown>(
  options: UsePermissionsOptions = {}
): UsePermissionsResult<Permissions> {
  const { enabled = true, params } = options
  const authProvider = useAuthProvider()

  // Memoize query key to prevent unnecessary re-renders
  const queryKey = useMemo(
    () => ['permissions', params] as const,
    [params]
  )

  const query = useQuery<Permissions, Error>({
    queryKey,
    queryFn: async () => {
      if (!authProvider.getPermissions) {
        throw new Error('AuthProvider does not implement getPermissions')
      }
      return authProvider.getPermissions(params) as Promise<Permissions>
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      permissions: query.data,
      isLoading: enabled ? query.isLoading : false,
      error: query.error ?? null,
      refetch: query.refetch,
    }),
    [query.data, enabled, query.isLoading, query.error, query.refetch]
  )
}
