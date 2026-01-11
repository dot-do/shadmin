/**
 * AuthProvider for @dotdo/react integration
 *
 * Creates a react-admin compatible AuthProvider that uses the DO client
 * from ShadminDOProvider via WebSocket/RPC instead of HTTP.
 *
 * @module dotdo-react/auth-provider
 *
 * @example
 * ```tsx
 * import { ShadminDOProvider, createDotdoAuthProvider, useShadminDO } from 'shadmin/dotdo-react'
 *
 * function App() {
 *   return (
 *     <ShadminDOProvider baseUrl="https://api.your-app.do">
 *       <AdminWithAuth />
 *     </ShadminDOProvider>
 *   )
 * }
 *
 * function AdminWithAuth() {
 *   const { client, connectionState, disconnect } = useShadminDO()
 *   const authProvider = useMemo(
 *     () => createDotdoAuthProvider({ client, connectionState, disconnect }),
 *     [client, connectionState, disconnect]
 *   )
 *
 *   return (
 *     <Admin authProvider={authProvider}>
 *       <Resource name="users" />
 *     </Admin>
 *   )
 * }
 * ```
 */

import type { AuthProvider, UserIdentity, LoginParams } from '../facade'
import { getErrorStatus, getErrorCode, isStringArray } from '../utils/type-guards'

import type { DOClientProxy, ConnectionState } from './types'

/**
 * Configuration for createDotdoAuthProvider
 */
export interface DotdoAuthProviderConfig {
  /**
   * The DO client proxy from ShadminDOContext
   * Provides RPC methods for auth operations
   */
  client: DOClientProxy

  /**
   * Current connection state from ShadminDOContext
   * Used to check if the connection is active
   */
  connectionState: ConnectionState

  /**
   * Disconnect function from ShadminDOContext
   * Called on logout to close the WebSocket connection
   */
  disconnect: () => void
}

/**
 * Options for the AuthProvider factory
 */
export interface DotdoAuthProviderOptions {
  /**
   * Key used to store the auth token in localStorage
   * @default 'dotdo_auth_token'
   */
  tokenKey?: string

  /**
   * Key used to store user identity in localStorage
   * @default 'dotdo_user_identity'
   */
  identityKey?: string

  /**
   * Path to redirect after logout
   * @default '/login'
   */
  logoutRedirectPath?: string

  /**
   * Whether to disconnect the WebSocket on logout
   * @default true
   */
  disconnectOnLogout?: boolean
}

/**
 * Login response from DO auth
 */
export interface DOLoginResponse {
  token: string
  user: DOUserIdentity
  expiresAt?: string
}

/**
 * User identity from DO auth
 */
export interface DOUserIdentity {
  id: string | number
  email?: string
  fullName?: string
  avatar?: string
  roles?: string[]
  permissions?: string[]
  [key: string]: unknown
}

/**
 * Permissions response from DO auth
 */
export interface DOPermissionsResponse {
  permissions: string[]
}

/**
 * Creates an AuthProvider that uses the @dotdo/client WebSocket connection
 *
 * This AuthProvider calls methods on the DO client proxy, which communicates
 * with Durable Objects via WebSocket RPC instead of HTTP fetch.
 *
 * @param config - Configuration with client proxy and connection state
 * @param options - Optional additional configuration
 * @returns An AuthProvider compatible with react-admin/shadmin
 *
 * @example Basic usage with ShadminDOProvider
 * ```tsx
 * function MyAdmin() {
 *   const { client, connectionState, disconnect } = useShadminDO()
 *
 *   const authProvider = useMemo(
 *     () => createDotdoAuthProvider({ client, connectionState, disconnect }),
 *     [client, connectionState, disconnect]
 *   )
 *
 *   return <Admin authProvider={authProvider}>...</Admin>
 * }
 * ```
 *
 * @example With custom options
 * ```tsx
 * const authProvider = createDotdoAuthProvider(
 *   { client, connectionState, disconnect },
 *   {
 *     tokenKey: 'my_app_token',
 *     logoutRedirectPath: '/signin',
 *     disconnectOnLogout: false,
 *   }
 * )
 * ```
 */
export function createDotdoAuthProvider(
  config: DotdoAuthProviderConfig,
  options: DotdoAuthProviderOptions = {}
): AuthProvider {
  const { client, connectionState, disconnect } = config
  const {
    tokenKey = 'dotdo_auth_token',
    identityKey = 'dotdo_user_identity',
    logoutRedirectPath = '/login',
    disconnectOnLogout = true,
  } = options

  // =============================================================================
  // Storage helpers
  // =============================================================================

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

  // =============================================================================
  // RPC helpers
  // =============================================================================

  /**
   * Call an auth method on the DO client
   * Uses the Noun.verb pattern: auth.login, auth.logout, etc.
   */
  const callAuthMethod = async <T>(method: string, params?: unknown): Promise<T> => {
    // The client proxy allows dynamic method access
    // We use the pattern: client[`auth.${method}`](params)
    // Or access via client.auth[method](params) if the client supports namespaced access
    // Cast through unknown first to avoid type narrowing issues
    const clientRecord = client as unknown as Record<string, unknown>

    const authMethod = clientRecord[`auth.${method}`]
    if (typeof authMethod === 'function') {
      return (authMethod as (params?: unknown) => Promise<T>)(params)
    }

    // Fallback: try calling as auth_method
    const fallbackMethod = clientRecord[`auth_${method}`]
    if (typeof fallbackMethod === 'function') {
      return (fallbackMethod as (params?: unknown) => Promise<T>)(params)
    }

    // Last resort: try direct method name
    const directMethod = clientRecord[method]
    if (typeof directMethod === 'function') {
      return (directMethod as (params?: unknown) => Promise<T>)(params)
    }

    throw new Error(`Auth method ${method} not found on client`)
  }

  // =============================================================================
  // AuthProvider implementation
  // =============================================================================

  const authProvider: AuthProvider = {
    /**
     * Authenticate user with credentials via RPC
     */
    login: async (params: LoginParams): Promise<void> => {
      const { username, password, ...rest } = params

      const response = await callAuthMethod<DOLoginResponse>('login', {
        email: username,
        password,
        ...rest,
      })

      // Store token and identity
      storeToken(response.token)
      storeIdentity(response.user)
    },

    /**
     * Log out the current user via RPC
     */
    logout: async (): Promise<string> => {
      const token = getStoredToken()

      if (token) {
        try {
          // Notify the server about logout
          await callAuthMethod('logout', { token })
        } catch {
          // Ignore logout errors - we'll clear local state anyway
        }
      }

      // Clear local storage
      removeToken()
      removeIdentity()

      // Disconnect WebSocket if configured
      if (disconnectOnLogout) {
        disconnect()
      }

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

      // Check connection state
      if (connectionState === 'failed' || connectionState === 'disconnected') {
        // Connection is down, but we have a token - may be temporary
        // Only throw if we want strict checking
      }

      // Validate token with server via RPC
      try {
        const user = await callAuthMethod<DOUserIdentity>('me')
        // Update stored identity if server returns fresh data
        if (user) {
          storeIdentity(user)
        }
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
      // Use type guards for safe property access from unknown error
      const status = getErrorStatus(error)
      const code = getErrorCode(error)

      // 401 Unauthorized or 403 Forbidden should trigger logout
      if (status === 401 || status === 403) {
        removeToken()
        removeIdentity()
        throw error
      }

      // Handle specific error codes
      if (code === 'UNAUTHENTICATED' || code === 'UNAUTHORIZED') {
        removeToken()
        removeIdentity()
        throw error
      }

      // Other errors don't require logout
      return
    },

    /**
     * Get user permissions via RPC
     */
    getPermissions: async (): Promise<string[]> => {
      const identity = getStoredIdentity()

      if (!identity) {
        return []
      }

      // Return stored permissions if available
      if (identity.permissions && identity.permissions.length > 0) {
        return identity.permissions
      }

      // Fetch permissions from server
      try {
        const response = await callAuthMethod<DOPermissionsResponse | string[]>('getPermissions')
        const permissions = Array.isArray(response) ? response : response.permissions
        // Update stored identity with permissions
        storeIdentity({ ...identity, permissions })
        return permissions
      } catch {
        return []
      }
    },

    /**
     * Get current user identity via RPC
     */
    getIdentity: async (): Promise<UserIdentity> => {
      // First try stored identity
      const stored = getStoredIdentity()
      if (stored) {
        return toUserIdentity(stored)
      }

      // Fetch from server via RPC
      const user = await callAuthMethod<DOUserIdentity>('getIdentity')
      storeIdentity(user)
      return toUserIdentity(user)
    },

    /**
     * Handle OAuth callback (optional)
     */
    handleCallback: async (): Promise<void> => {
      if (typeof window === 'undefined') return

      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const state = params.get('state')

      if (!code) {
        throw new Error('No authorization code in callback')
      }

      // Exchange code for token via RPC
      const response = await callAuthMethod<DOLoginResponse>('callback', { code, state })

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
      // Use type guard to safely validate permissions array
      const permissions = isStringArray(permissionsResult) ? permissionsResult : []

      // Check for wildcard permission
      if (permissions.includes('*') || permissions.includes('admin')) {
        return true
      }

      // Check for resource-level permission
      if (permissions.includes(`${resource}:*`) || permissions.includes(`${resource}:${action}`)) {
        return true
      }

      // For record-level permissions, call the server
      if (record) {
        try {
          const result = await callAuthMethod<{ allowed: boolean } | boolean>('canAccess', {
            resource,
            action,
            recordId: record.id,
          })
          return typeof result === 'boolean' ? result : result.allowed
        } catch {
          return false
        }
      }

      return false
    },

    /**
     * Support AbortSignal for cancellation
     */
    supportAbortSignal: true,
  }

  return authProvider
}

/**
 * Type guard to check if an AuthProvider was created by createDotdoAuthProvider
 *
 * Note: This is a basic check since AuthProvider interfaces are identical
 */
export function isDotdoAuthProvider(provider: AuthProvider): boolean {
  return (
    typeof provider.login === 'function' &&
    typeof provider.logout === 'function' &&
    typeof provider.checkAuth === 'function' &&
    typeof provider.checkError === 'function' &&
    typeof provider.getPermissions === 'function' &&
    provider.supportAbortSignal === true
  )
}
