/**
 * AuthProvider for dotdo Durable Objects
 *
 * Creates a react-admin compatible AuthProvider that handles
 * authentication with dotdo via HTTP API.
 *
 * @module dotdo/auth-provider
 */

import type { AuthProvider, UserIdentity, LoginParams } from '../facade'

import type { DOConfig, AuthOptions, DOLoginResponse, DOUserIdentity, DORequestOptions } from './types'

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
     * Make a fetch request to the dotdo auth API
     */
    const doFetch = async <T>(endpoint: string, options: DORequestOptions = {}): Promise<T> => {
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
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error?.message ?? `HTTP ${response.status}: ${response.statusText}`)
        }

        // Handle 204 No Content
        if (response.status === 204) {
          return {} as T
        }

        return response.json()
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
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
       * Authenticate user with credentials
       */
      login: async (params: LoginParams): Promise<void> => {
        const { username, password, ...rest } = params

        // TODO: Implement actual dotdo login API call
        // The endpoint and payload format should match dotdo's auth API
        const response = await doFetch<DOLoginResponse>('/auth/login', {
          method: 'POST',
          body: {
            email: username,
            password,
            ...rest,
          },
        })

        // Store token and identity
        storeToken(response.token)
        storeIdentity(response.user)
      },

      /**
       * Log out the current user
       */
      logout: async (): Promise<string> => {
        const token = getStoredToken()

        if (token) {
          // TODO: Implement actual dotdo logout API call (if needed)
          // Some APIs require a logout call to invalidate the token
          try {
            await doFetch('/auth/logout', { method: 'POST' })
          } catch {
            // Ignore logout errors - we'll clear local state anyway
          }
        }

        // Clear local storage
        removeToken()
        removeIdentity()

        return logoutRedirectPath
      },

      /**
       * Check if user is authenticated
       */
      checkAuth: async (): Promise<void> => {
        const token = getStoredToken()

        if (!token) {
          throw new Error('Not authenticated')
        }

        // TODO: Optionally validate token with dotdo API
        // This could call a /auth/me or /auth/validate endpoint
        // For now, we just check if a token exists
        // You might want to check token expiration here
        try {
          await doFetch<DOUserIdentity>('/auth/me')
        } catch (error) {
          removeToken()
          removeIdentity()
          throw error
        }
      },

      /**
       * Check if an error should trigger logout
       */
      checkError: async (error: unknown): Promise<void> => {
        const status = (error as { status?: number }).status

        // 401 Unauthorized or 403 Forbidden should trigger logout
        if (status === 401 || status === 403) {
          removeToken()
          removeIdentity()
          throw error
        }

        // Other errors don't require logout
        return
      },

      /**
       * Get user permissions
       */
      getPermissions: async (): Promise<string[]> => {
        const identity = getStoredIdentity()

        if (!identity) {
          return []
        }

        // Return stored permissions or fetch fresh ones
        if (identity.permissions) {
          return identity.permissions
        }

        // TODO: Optionally fetch permissions from dotdo API
        // This could call a /auth/permissions endpoint
        try {
          const user = await doFetch<DOUserIdentity>('/auth/me')
          storeIdentity(user)
          return user.permissions ?? []
        } catch {
          return []
        }
      },

      /**
       * Get current user identity
       */
      getIdentity: async (): Promise<UserIdentity> => {
        // First try stored identity
        const stored = getStoredIdentity()
        if (stored) {
          return toUserIdentity(stored)
        }

        // Fetch from API if not stored
        // TODO: Implement actual dotdo identity API call
        const user = await doFetch<DOUserIdentity>('/auth/me')
        storeIdentity(user)
        return toUserIdentity(user)
      },

      /**
       * Handle OAuth callback (optional)
       */
      handleCallback: async (): Promise<void> => {
        // TODO: Implement OAuth callback handling if needed
        // This would parse the callback URL, exchange code for token, etc.

        if (typeof window === 'undefined') return

        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const state = params.get('state')

        if (!code) {
          throw new Error('No authorization code in callback')
        }

        // Exchange code for token
        const response = await doFetch<DOLoginResponse>('/auth/callback', {
          method: 'POST',
          body: { code, state },
        })

        storeToken(response.token)
        storeIdentity(response.user)
      },

      /**
       * Check if user can access a specific resource/action
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
        const permissions = Array.isArray(permissionsResult) ? permissionsResult as string[] : []

        // TODO: Implement actual permission checking logic
        // This is a simple implementation - you may want to call a dotdo API
        // for more complex permission checks

        // Check for wildcard permission
        if (permissions.includes('*') || permissions.includes('admin')) {
          return true
        }

        // Check for resource-level permission
        if (permissions.includes(`${resource}:*`) || permissions.includes(`${resource}:${action}`)) {
          return true
        }

        // For record-level permissions, you might need to call the API
        if (record) {
          // TODO: Implement record-level permission check
          // This could call /auth/can-access with resource, action, and record id
        }

        return false
      },
    }

    return authProvider
  }
}
