/**
 * usePermissions hook
 * Fetches and caches permissions from the AuthProvider
 * 100% API-compatible with react-admin
 */

import { useQuery } from '@tanstack/react-query'
import { useAuthProvider } from '../contexts/AuthProviderContext'

/**
 * Options for usePermissions hook
 */
export interface UsePermissionsOptions {
  /** Whether to enable the query */
  enabled?: boolean
  /** Parameters to pass to getPermissions */
  params?: Record<string, unknown>
}

/**
 * Return type for usePermissions hook
 */
export interface UsePermissionsResult<Permissions = unknown> {
  /** The permissions data */
  permissions: Permissions | undefined
  /** Whether the query is loading */
  isLoading: boolean
  /** Error from the query, null if no error */
  error: Error | null
  /** Function to refetch permissions */
  refetch: () => Promise<unknown>
}

/**
 * Hook to fetch permissions from the AuthProvider
 * Caches permissions using React Query to avoid redundant fetches
 *
 * @param options - Optional configuration
 * @returns Permissions data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { permissions, isLoading, error } = usePermissions()
 * ```
 */
export function usePermissions<Permissions = unknown>(
  options: UsePermissionsOptions = {}
): UsePermissionsResult<Permissions> {
  const { enabled = true, params } = options
  const authProvider = useAuthProvider()

  const queryKey = ['permissions', params]

  const query = useQuery<Permissions, Error>({
    queryKey,
    queryFn: () => authProvider.getPermissions(params) as Promise<Permissions>,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    permissions: query.data,
    isLoading: enabled ? query.isLoading : false,
    error: query.error ?? null,
    refetch: query.refetch,
  }
}
