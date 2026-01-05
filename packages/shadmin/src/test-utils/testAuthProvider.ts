/**
 * Mock AuthProvider factory for testing
 * Provides a fully mockable authentication provider interface for admin components
 */

import { vi } from 'vitest'

/**
 * User identity returned by the auth provider
 */
export interface UserIdentity {
  id: string | number
  fullName?: string
  avatar?: string
  email?: string
  [key: string]: unknown
}

/**
 * Login parameters
 */
export interface LoginParams {
  username: string
  password: string
  [key: string]: unknown
}

/**
 * Permission types - can be a string, array of strings, or any custom type
 */
export type Permissions = string | string[] | Record<string, boolean> | unknown

/**
 * AuthProvider interface - main authentication abstraction
 */
export interface AuthProvider {
  /**
   * Authenticate a user with credentials
   */
  login: (params: LoginParams) => Promise<void | string | { redirectTo?: string }>
  /**
   * Log out the current user
   */
  logout: (params?: unknown) => Promise<void | string | false>
  /**
   * Check if the user is authenticated (called on every route change)
   */
  checkAuth: (params?: unknown) => Promise<void>
  /**
   * Called when an API request returns an error
   */
  checkError: (error: unknown) => Promise<void>
  /**
   * Get the user's permissions
   */
  getPermissions: (params?: unknown) => Promise<Permissions>
  /**
   * Get the current user's identity (for display purposes)
   */
  getIdentity?: () => Promise<UserIdentity>
}

/**
 * Options for creating a mock auth provider
 */
export interface MockAuthProviderOptions {
  /**
   * Initial authentication state
   */
  isAuthenticated?: boolean
  /**
   * User identity to return
   */
  identity?: UserIdentity
  /**
   * Permissions to return
   */
  permissions?: Permissions
  /**
   * Delay in ms to simulate network latency
   */
  delay?: number
  /**
   * Valid credentials for login (default: any credentials work)
   */
  validCredentials?: {
    username: string
    password: string
  }
  /**
   * Custom error to throw on authentication failure
   */
  authError?: Error
}

/**
 * Default user identity for testing
 */
export const defaultUserIdentity: UserIdentity = {
  id: 1,
  fullName: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.png',
}

/**
 * Default permissions for testing
 */
export const defaultPermissions: Permissions = ['admin', 'read', 'write']

/**
 * Creates a delay promise for simulating network latency
 */
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Creates a mock AuthProvider for testing
 *
 * @example
 * ```tsx
 * // Basic usage - authenticated by default
 * const authProvider = createMockAuthProvider()
 *
 * // Unauthenticated user
 * const authProvider = createMockAuthProvider({ isAuthenticated: false })
 *
 * // Custom identity and permissions
 * const authProvider = createMockAuthProvider({
 *   identity: { id: 1, fullName: 'Admin User' },
 *   permissions: ['admin', 'superuser'],
 * })
 *
 * // Simulate login validation
 * const authProvider = createMockAuthProvider({
 *   validCredentials: { username: 'admin', password: 'secret' },
 * })
 * ```
 */
export function createMockAuthProvider(options: MockAuthProviderOptions = {}): AuthProvider {
  const {
    isAuthenticated: initialAuth = true,
    identity = defaultUserIdentity,
    permissions = defaultPermissions,
    delay = 0,
    validCredentials,
    authError,
  } = options

  // Mutable authentication state
  let isAuthenticated = initialAuth
  let currentIdentity = identity
  let currentPermissions = permissions

  const provider: AuthProvider = {
    login: vi.fn(async (params: LoginParams) => {
      if (delay) await wait(delay)

      // Check credentials if validation is enabled
      if (validCredentials) {
        if (
          params.username !== validCredentials.username ||
          params.password !== validCredentials.password
        ) {
          throw new Error('Invalid credentials')
        }
      }

      isAuthenticated = true
      return undefined
    }),

    logout: vi.fn(async () => {
      if (delay) await wait(delay)
      isAuthenticated = false
      return undefined
    }),

    checkAuth: vi.fn(async () => {
      if (delay) await wait(delay)

      if (authError) {
        throw authError
      }

      if (!isAuthenticated) {
        throw new Error('Not authenticated')
      }
    }),

    checkError: vi.fn(async (error: unknown) => {
      if (delay) await wait(delay)

      // Check for 401/403 errors
      const errorWithStatus = error as { status?: number; statusCode?: number }
      const status = errorWithStatus?.status ?? errorWithStatus?.statusCode

      if (status === 401 || status === 403) {
        isAuthenticated = false
        throw new Error('Authentication error')
      }
    }),

    getPermissions: vi.fn(async () => {
      if (delay) await wait(delay)

      if (!isAuthenticated) {
        return []
      }

      return currentPermissions
    }),

    getIdentity: vi.fn(async () => {
      if (delay) await wait(delay)

      if (!isAuthenticated) {
        throw new Error('Not authenticated')
      }

      return currentIdentity
    }),
  }

  // Add helper methods for testing (attached to the provider object)
  const providerWithHelpers = provider as AuthProvider & {
    setAuthenticated: (value: boolean) => void
    setIdentity: (newIdentity: UserIdentity) => void
    setPermissions: (newPermissions: Permissions) => void
    getState: () => { isAuthenticated: boolean; identity: UserIdentity; permissions: Permissions }
  }

  providerWithHelpers.setAuthenticated = (value: boolean) => {
    isAuthenticated = value
  }

  providerWithHelpers.setIdentity = (newIdentity: UserIdentity) => {
    currentIdentity = newIdentity
  }

  providerWithHelpers.setPermissions = (newPermissions: Permissions) => {
    currentPermissions = newPermissions
  }

  providerWithHelpers.getState = () => ({
    isAuthenticated,
    identity: currentIdentity,
    permissions: currentPermissions,
  })

  return providerWithHelpers
}

/**
 * Creates an auth provider that always fails authentication
 * Useful for testing login flows and error states
 */
export function createFailingAuthProvider(errorMessage = 'Authentication failed'): AuthProvider {
  return {
    login: vi.fn(async () => {
      throw new Error(errorMessage)
    }),
    logout: vi.fn(async () => undefined),
    checkAuth: vi.fn(async () => {
      throw new Error(errorMessage)
    }),
    checkError: vi.fn(async () => {
      throw new Error(errorMessage)
    }),
    getPermissions: vi.fn(async () => []),
    getIdentity: vi.fn(async () => {
      throw new Error(errorMessage)
    }),
  }
}

/**
 * Creates an auth provider with delayed responses
 * Useful for testing loading states
 */
export function createDelayedAuthProvider(delayMs: number): AuthProvider {
  return createMockAuthProvider({ delay: delayMs })
}

/**
 * Creates a spy on all auth provider methods
 * Useful for verifying calls in tests
 */
export function spyOnAuthProvider(authProvider: AuthProvider) {
  return {
    login: vi.spyOn(authProvider, 'login'),
    logout: vi.spyOn(authProvider, 'logout'),
    checkAuth: vi.spyOn(authProvider, 'checkAuth'),
    checkError: vi.spyOn(authProvider, 'checkError'),
    getPermissions: vi.spyOn(authProvider, 'getPermissions'),
    getIdentity: authProvider.getIdentity ? vi.spyOn(authProvider, 'getIdentity') : undefined,
  }
}
