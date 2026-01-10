/**
 * useLogin hook
 * Provides login functionality with auth provider integration
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useAuthProvider } from '../contexts/AuthProviderContext'
import { isHttpError } from '../errors'

export interface UseLoginOptions {
  /** Callback called on successful login */
  onSuccess?: () => void
  /** Callback called on login error */
  onError?: (error: Error) => void
}

export interface LoginOptions {
  /** Where to redirect after login. Set to false to disable redirect */
  redirectTo?: string | false
}

export interface UseLoginResult {
  /** Function to call with credentials to log in */
  login: (credentials: Record<string, unknown>, options?: LoginOptions) => Promise<void>
  /** Whether a login is currently in progress */
  isLoading: boolean
  /** Error from the last login attempt, or null */
  error: Error | null
  /** Retry after duration in seconds (for rate limiting) */
  retryAfter: number | undefined
}

/**
 * useLogin hook for handling authentication
 *
 * @example
 * ```tsx
 * function LoginPage() {
 *   const { login, isLoading, error } = useLogin()
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault()
 *     await login({ username: 'admin', password: 'secret' })
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <p>{error.message}</p>}
 *       <input name="username" />
 *       <input name="password" type="password" />
 *       <button disabled={isLoading}>Login</button>
 *     </form>
 *   )
 * }
 * ```
 */
export function useLogin(options: UseLoginOptions = {}): UseLoginResult {
  const { onSuccess, onError } = options
  const authProvider = useAuthProvider()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const login = useCallback(
    async (credentials: Record<string, unknown>, loginOptions?: LoginOptions) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await authProvider.login(credentials)

        // Handle redirect
        const redirectTo = loginOptions?.redirectTo
        if (redirectTo !== false) {
          const destination = redirectTo || (result as { redirectTo?: string })?.redirectTo || '/'
          navigate(destination)
        }

        onSuccess?.()
      } catch (err) {
        const loginError = err instanceof Error ? err : new Error(String(err))
        setError(loginError)
        onError?.(loginError)
        throw loginError
      } finally {
        setIsLoading(false)
      }
    },
    [authProvider, navigate, onSuccess, onError]
  )

  // Extract retryAfter from rate limiting errors
  const retryAfter = error && isHttpError(error) && error.status === 429
    ? (error.body as { retryAfter?: number } | undefined)?.retryAfter
    : undefined

  return {
    login,
    isLoading,
    error,
    retryAfter,
  }
}
