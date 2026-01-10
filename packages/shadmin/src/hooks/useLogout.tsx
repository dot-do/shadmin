/**
 * useLogout hook
 * Provides logout functionality with auth provider integration
 */

import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthProvider } from '../contexts/AuthProviderContext'
import { isNetworkError } from '../errors'

export interface UseLogoutOptions {
  /** Callback called on successful logout */
  onSuccess?: () => void
  /** Callback called on logout error */
  onError?: (error: Error) => void
}

export interface LogoutOptions {
  /** Where to redirect after logout. Set to false to disable redirect */
  redirectTo?: string | false
}

export interface UseLogoutResult {
  /** Function to call to log out */
  logout: (options?: LogoutOptions) => Promise<void>
  /** Whether a logout is currently in progress */
  isLoading: boolean
  /** Error from the last logout attempt, or null */
  error: Error | null
  /** Whether local state has been cleaned regardless of server error */
  isLocalStateCleaned: boolean
}

/**
 * useLogout hook for handling logout/sign-out
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const { logout, isLoading } = useLogout()
 *
 *   const handleClick = async () => {
 *     await logout()
 *   }
 *
 *   return (
 *     <button onClick={handleClick} disabled={isLoading}>
 *       {isLoading ? 'Logging out...' : 'Logout'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useLogout(options: UseLogoutOptions = {}): UseLogoutResult {
  const { onSuccess, onError } = options
  const authProvider = useAuthProvider()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isLocalStateCleaned, setIsLocalStateCleaned] = useState(false)

  // Track when local state should be cleaned (on network errors during logout)
  useEffect(() => {
    if (error && isNetworkError(error)) {
      setIsLocalStateCleaned(true)
    }
  }, [error])

  const logout = useCallback(
    async (logoutOptions?: LogoutOptions) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await authProvider.logout()

        // Clear permissions cache on logout
        queryClient.removeQueries({ queryKey: ['permissions'] })

        // Handle redirect
        // If authProvider.logout returns false, don't redirect
        if (result === false) {
          onSuccess?.()
          return
        }

        const redirectTo = logoutOptions?.redirectTo
        if (redirectTo !== false) {
          // Use custom redirectTo, or result from authProvider, or default to /login
          const destination = redirectTo || (typeof result === 'string' ? result : '/login')
          navigate(destination)
        }

        onSuccess?.()
      } catch (err) {
        const logoutError = err instanceof Error ? err : new Error(String(err))
        setError(logoutError)

        // Even on error, we should clean local state for network errors
        if (isNetworkError(logoutError)) {
          setIsLocalStateCleaned(true)
        }

        onError?.(logoutError)
        throw logoutError
      } finally {
        setIsLoading(false)
      }
    },
    [authProvider, navigate, queryClient, onSuccess, onError]
  )

  return {
    logout,
    isLoading,
    error,
    isLocalStateCleaned,
  }
}
