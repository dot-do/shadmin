/**
 * AuthProvider for dotdo Durable Objects
 *
 * Creates a react-admin compatible AuthProvider that handles
 * authentication with dotdo via HTTP API.
 *
 * @module dotdo/auth-provider
 */

import type { AuthProvider, UserIdentity, LoginParams } from '../facade'
import type { DOConfig, AuthOptions, DOLoginResponse, DOUserIdentity, DORequestOptions, DOErrorResponse } from './types'

/**
 * Custom error class for dotdo authentication errors
 */
export class DOAuthError extends Error {
  public readonly code: string
  public readonly status: number | undefined
  public readonly details: Record<string, unknown> | undefined

  constructor(message: string, code: string, status?: number, details?: Record<string, unknown>) {
    super(message)
    this.name = 'DOAuthError'
    this.code = code
    this.status = status
    this.details = details
  }
}

/**
 * Configuration for retry behavior
 */
interface RetryConfig {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
}

/**
 * Sleep for a specified duration
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Calculate exponential backoff delay with jitter
 */
const getBackoffDelay = (attempt: number, config: RetryConfig): number => {
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt)
  const jitter = Math.random() * 0.3 * exponentialDelay // Add up to 30% jitter
  return Math.min(exponentialDelay + jitter, config.maxDelayMs)
}

/**
 * Check if an error is retryable (network errors, 5xx server errors)
 */
const isRetryableError = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    // Network errors like "Failed to fetch"
    return true
  }
  if (error instanceof DOAuthError) {
    // Retry 5xx server errors, but not 4xx client errors
    return error.status !== undefined && error.status >= 500
  }
  return false
}

/**
 * Creates an AuthProvider factory bound to a dotdo API endpoint
 *
 * @param config - DOConfig with baseUrl and optional settings
 * @returns A function that creates AuthProvider instances
 *
 * @example
 * ```tsx
 * const createAuth = createAuthProviderFactory({
 *   baseUrl: 'https://api.your-app.do'
 * })
 *
 * const authProvider = createAuth({
 *   tokenKey: 'my_app_token',
 *   logoutRedirectPath: '/signin'
 * })
 * ```
 */
export function createAuthProviderFactory(config: DOConfig): (options?: AuthOptions) => AuthProvider {
  return (options?: AuthOptions): AuthProvider => {
    const { baseUrl, headers: configHeaders = {}, credentials = 'include', timeout = 30000 } = config

    const {
      tokenKey = 'dotdo_auth_token',
      identityKey = 'dotdo_user_identity',
      logoutRedirectPath = '/login',
      headers: optionHeaders = {},
    } = options ?? {}

    /**
     * Make a single fetch request to the dotdo auth API
     *
     * @param endpoint - The API endpoint (e.g., '/auth/login')
     * @param options - Request options including method, body, headers
     * @returns The parsed JSON response
     * @throws {DOAuthError} When the API returns an error response
     */
    const doFetchOnce = async <T>(endpoint: string, options: DORequestOptions = {}): Promise<T> => {
      const { method = 'GET', body, headers: requestHeaders = {}, signal } = options

      const token = getStoredToken()
      const allHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...configHeaders,
        ...optionHeaders,
        ...requestHeaders,
      }

      if (token) {
        allHeaders['Authorization'] = `Bearer ${token}`
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const fetchOptions: RequestInit = {
          method,
          headers: allHeaders,
          credentials,
          signal: signal ?? controller.signal,
        }
        if (body !== undefined) {
          fetchOptions.body = JSON.stringify(body)
        }
        const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions)

        clearTimeout(timeoutId)

        if (!response.ok) {
          // Parse dotdo error response format
          const errorData = (await response.json().catch(() => ({} as DOErrorResponse))) as DOErrorResponse
          const errorMessage = errorData.error?.message ?? `HTTP ${response.status}: ${response.statusText}`
          const errorCode = errorData.error?.code ?? `HTTP_${response.status}`
          throw new DOAuthError(errorMessage, errorCode, response.status, errorData.error?.details)
        }

        // Handle 204 No Content
        if (response.status === 204) {
          return {} as T
        }

        return response.json()
      } catch (error) {
        clearTimeout(timeoutId)
        // Re-wrap non-DOAuthError fetch errors for consistency
        if (error instanceof DOAuthError) {
          throw error
        }
        if (error instanceof Error) {
          throw new DOAuthError(error.message, 'NETWORK_ERROR')
        }
        throw new DOAuthError('Unknown error occurred', 'UNKNOWN_ERROR')
      }
    }

    /**
     * Make a fetch request to the dotdo auth API with retry logic
     *
     * Implements exponential backoff with jitter for transient failures.
     * Retries on network errors and 5xx server errors.
     *
     * @param endpoint - The API endpoint (e.g., '/auth/login')
     * @param options - Request options including method, body, headers
     * @param retryConfig - Optional retry configuration
     * @returns The parsed JSON response
     * @throws {DOAuthError} When all retries are exhausted or on non-retryable errors
     */
    const doFetch = async <T>(
      endpoint: string,
      options: DORequestOptions = {},
      retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
    ): Promise<T> => {
      let lastError: Error | undefined

      for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
        try {
          return await doFetchOnce<T>(endpoint, options)
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error))

          // Don't retry if this was the last attempt or error is not retryable
          if (attempt === retryConfig.maxRetries || !isRetryableError(error)) {
            throw error
          }

          // Wait before retrying with exponential backoff
          const delay = getBackoffDelay(attempt, retryConfig)
          await sleep(delay)
        }
      }

      // This should never be reached due to the throw in the loop, but TypeScript needs it
      throw lastError ?? new DOAuthError('All retries exhausted', 'RETRY_EXHAUSTED')
    }

    /**
     * Get stored auth token
     */
    const getStoredToken = (): string | null => {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(tokenKey)
    }

    /**
     * Store auth token
     */
    const storeToken = (token: string): void => {
      if (typeof window === 'undefined') return
      localStorage.setItem(tokenKey, token)
    }

    /**
     * Remove stored auth token
     */
    const removeToken = (): void => {
      if (typeof window === 'undefined') return
      localStorage.removeItem(tokenKey)
    }

    /**
     * Get stored user identity
     */
    const getStoredIdentity = (): DOUserIdentity | null => {
      if (typeof window === 'undefined') return null
      const stored = localStorage.getItem(identityKey)
      if (!stored) return null
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }

    /**
     * Store user identity
     */
    const storeIdentity = (identity: DOUserIdentity): void => {
      if (typeof window === 'undefined') return
      localStorage.setItem(identityKey, JSON.stringify(identity))
    }

    /**
     * Remove stored user identity
     */
    const removeIdentity = (): void => {
      if (typeof window === 'undefined') return
      localStorage.removeItem(identityKey)
    }

    /**
     * Convert DOUserIdentity to react-admin UserIdentity
     */
    const toUserIdentity = (doUser: DOUserIdentity): UserIdentity => {
      const { id, fullName, email, avatar, roles, permissions, ...rest } = doUser
      const identity: UserIdentity = {
        ...rest,
        id,
      }
      const displayName = fullName ?? email
      if (displayName !== undefined) {
        identity.fullName = displayName
      }
      if (avatar !== undefined) {
        identity.avatar = avatar
      }
      if (roles !== undefined) {
        identity.roles = roles
      }
      if (permissions !== undefined) {
        identity.permissions = permissions
      }
      return identity
    }

    /**
     * The AuthProvider implementation
     */
    const authProvider: AuthProvider = {
      /**
       * Authenticate user with email/password credentials
       *
       * Sends credentials to POST /auth/login and stores the returned
       * JWT token and user identity in localStorage.
       *
       * @param params - Login parameters containing username (email) and password
       * @throws {DOAuthError} When authentication fails (invalid credentials, account locked, etc.)
       */
      login: async (params: LoginParams): Promise<void> => {
        const { username, password, ...rest } = params

        const response = await doFetch<DOLoginResponse>('/auth/login', {
          method: 'POST',
          body: {
            email: username,
            password,
            ...rest,
          },
        })

        // Store token and identity for subsequent requests
        storeToken(response.token)
        storeIdentity(response.user)
      },

      /**
       * Log out the current user and invalidate their session
       *
       * Calls POST /auth/logout to invalidate the server-side session,
       * then clears local storage regardless of server response.
       *
       * @returns The path to redirect to after logout
       */
      logout: async (): Promise<string> => {
        const token = getStoredToken()

        if (token) {
          // Notify server to invalidate the session/token
          try {
            await doFetch('/auth/logout', { method: 'POST' })
          } catch {
            // Ignore logout errors - we'll clear local state anyway
            // This handles cases where token is already expired
          }
        }

        // Clear local storage
        removeToken()
        removeIdentity()

        return logoutRedirectPath
      },

      /**
       * Verify the current user is still authenticated
       *
       * Validates the stored token by calling GET /auth/me.
       * Clears credentials and throws if validation fails.
       *
       * @throws {DOAuthError} When token is missing, expired, or invalid
       */
      checkAuth: async (): Promise<void> => {
        const token = getStoredToken()

        if (!token) {
          throw new DOAuthError('Not authenticated', 'UNAUTHENTICATED')
        }

        // Validate token with server and refresh user data
        try {
          const user = await doFetch<DOUserIdentity>('/auth/me')
          // Update stored identity with fresh data from server
          storeIdentity(user)
        } catch (error) {
          removeToken()
          removeIdentity()
          throw error
        }
      },

      /**
       * Check if an error should trigger automatic logout
       *
       * Inspects the error for authentication-related status codes
       * (401, 403) and clears credentials if found.
       *
       * @param error - The error to inspect
       * @throws {Error} Re-throws the error if it requires logout
       */
      checkError: async (error: unknown): Promise<void> => {
        // Check for DOAuthError status
        if (error instanceof DOAuthError) {
          if (error.status === 401 || error.status === 403) {
            removeToken()
            removeIdentity()
            throw error
          }
          return
        }

        // Check for generic error with status property
        const status = (error as { status?: number }).status

        if (status === 401 || status === 403) {
          removeToken()
          removeIdentity()
          throw error
        }

        // Other errors don't require logout
        return
      },

      /**
       * Get the current user's permissions
       *
       * Returns cached permissions if available, otherwise fetches
       * fresh permissions from GET /auth/me.
       *
       * @returns Array of permission strings (e.g., ['users:read', 'posts:write'])
       */
      getPermissions: async (): Promise<string[]> => {
        const identity = getStoredIdentity()

        if (!identity) {
          return []
        }

        // Return cached permissions if available
        if (identity.permissions && identity.permissions.length > 0) {
          return identity.permissions
        }

        // Fetch fresh permissions from server
        try {
          const user = await doFetch<DOUserIdentity>('/auth/me')
          storeIdentity(user)
          return user.permissions ?? []
        } catch {
          return []
        }
      },

      /**
       * Get the current user's identity information
       *
       * Returns cached identity if available, otherwise fetches
       * from GET /auth/me.
       *
       * @returns User identity with id, fullName, avatar, etc.
       * @throws {DOAuthError} When not authenticated or fetch fails
       */
      getIdentity: async (): Promise<UserIdentity> => {
        // Return cached identity if available
        const stored = getStoredIdentity()
        if (stored) {
          return toUserIdentity(stored)
        }

        // Fetch fresh identity from server
        const user = await doFetch<DOUserIdentity>('/auth/me')
        storeIdentity(user)
        return toUserIdentity(user)
      },

      /**
       * Handle OAuth callback after redirect from provider
       *
       * Exchanges the authorization code for an access token
       * via POST /auth/callback.
       *
       * @throws {DOAuthError} When callback handling fails
       */
      handleCallback: async (): Promise<void> => {
        if (typeof window === 'undefined') return

        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const state = params.get('state')

        if (!code) {
          throw new DOAuthError('No authorization code in callback', 'MISSING_CODE')
        }

        // Exchange code for token via server
        const response = await doFetch<DOLoginResponse>('/auth/callback', {
          method: 'POST',
          body: { code, state },
        })

        storeToken(response.token)
        storeIdentity(response.user)
      },

      /**
       * Check if user can access a specific resource/action
       *
       * Implements a hierarchical permission check:
       * 1. Wildcard permissions ('*', 'admin') grant full access
       * 2. Resource-level permissions ('users:*', 'users:read')
       * 3. Record-level permissions via server check (for row-level security)
       *
       * @param params - Object containing resource, action, and optional record
       * @returns true if access is allowed, false otherwise
       */
      canAccess: async <RecordType extends Record<string, unknown>>({
        resource,
        action,
        record,
      }: {
        resource: string
        action: string
        record?: RecordType
      }): Promise<boolean> => {
        const permissionsResult = await authProvider.getPermissions({})
        const permissions = Array.isArray(permissionsResult) ? (permissionsResult as string[]) : []

        // Check for wildcard/admin permission - grants full access
        if (permissions.includes('*') || permissions.includes('admin')) {
          return true
        }

        // Check for resource-level wildcard permission
        if (permissions.includes(`${resource}:*`)) {
          return true
        }

        // Check for specific resource:action permission
        if (permissions.includes(`${resource}:${action}`)) {
          return true
        }

        // For record-level permissions, call the server to check row-level security
        if (record && record.id !== undefined) {
          try {
            const result = await doFetch<{ allowed: boolean }>('/auth/can-access', {
              method: 'POST',
              body: {
                resource,
                action,
                recordId: record.id,
              },
            })
            return result.allowed
          } catch {
            // If the server check fails, deny access by default
            return false
          }
        }

        return false
      },
    }

    return authProvider
  }
}

