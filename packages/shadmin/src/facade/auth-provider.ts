/**
 * AuthProvider Facade
 *
 * This module provides a facade/abstraction layer for AuthProvider types.
 * It defines shadmin's own type definitions that are API-compatible with ra-core.
 *
 * MIGRATION PATH:
 * 1. Internal shadmin code should import from this facade
 * 2. External consumers can still use ra-core types directly
 * 3. When ready to remove ra-core dependency:
 *    - These types are already native to shadmin
 *    - No changes needed in internal code
 *
 * @module facade/auth-provider
 */

import type { Identifier } from './data-provider'

/**
 * User identity information returned by AuthProvider.getIdentity()
 */
export interface UserIdentity {
  /** Unique identifier for the user */
  id: Identifier
  /** User's display name */
  fullName?: string
  /** URL to user's avatar image */
  avatar?: string
  /** Allow additional custom properties */
  [key: string]: unknown
}

/**
 * Result from authentication redirect operations
 */
export interface AuthRedirectResult {
  /** Path to redirect to, or false to prevent redirect */
  redirectTo?: string | false
  /** Whether to logout on failure */
  logoutOnFailure?: boolean
}

/**
 * Parameters for the login method
 */
export interface LoginParams {
  /** Username or email */
  username?: string
  /** User's password */
  password?: string
  /** Allow additional custom properties for OAuth, etc. */
  [key: string]: unknown
}

/**
 * Parameters for the logout method
 */
export interface LogoutParams {
  /** Path to redirect to after logout */
  redirectTo?: string
  /** Allow additional custom properties */
  [key: string]: unknown
}

/**
 * Parameters for the checkAuth method
 */
export interface CheckAuthParams {
  /** Current resource being accessed */
  resource?: string
  /** Allow additional custom properties */
  [key: string]: unknown
}

/**
 * Parameters for the getPermissions method
 */
export interface GetPermissionsParams {
  /** Current resource being accessed */
  resource?: string
  /** Allow additional custom properties */
  [key: string]: unknown
}

/**
 * Parameters for the canAccess method
 */
export interface CanAccessParams<RecordType = Record<string, unknown>> {
  /** The resource being accessed */
  resource: string
  /** The action being performed (list, show, edit, create, delete, etc.) */
  action: string
  /** The record being accessed (for record-level permissions) */
  record?: RecordType
  /** Allow additional custom properties */
  [key: string]: unknown
}

/**
 * Query function context for TanStack Query integration
 */
export interface QueryFunctionContext {
  /** AbortSignal for cancellation */
  signal?: AbortSignal
}

/**
 * AuthProvider interface - API-compatible with react-admin
 *
 * The AuthProvider is responsible for handling all authentication
 * and authorization logic in the application.
 *
 * @example
 * ```tsx
 * const authProvider: AuthProvider = {
 *   login: async ({ username, password }) => {
 *     const response = await fetch('/api/login', {
 *       method: 'POST',
 *       body: JSON.stringify({ username, password }),
 *     });
 *     if (!response.ok) throw new Error('Invalid credentials');
 *     const { token } = await response.json();
 *     localStorage.setItem('token', token);
 *   },
 *   logout: async () => {
 *     localStorage.removeItem('token');
 *     return '/login';
 *   },
 *   checkAuth: async () => {
 *     if (!localStorage.getItem('token')) {
 *       throw new Error('Not authenticated');
 *     }
 *   },
 *   checkError: async (error) => {
 *     if (error.status === 401 || error.status === 403) {
 *       throw error;
 *     }
 *   },
 *   getPermissions: async () => {
 *     const token = localStorage.getItem('token');
 *     // decode token to get permissions
 *     return ['admin'];
 *   },
 * }
 * ```
 */
export interface AuthProvider {
  /**
   * Authenticate the user with credentials
   * @param params - Login parameters (username, password, etc.)
   * @returns Promise that resolves with optional redirect result
   */
  login: (params: LoginParams) => Promise<AuthRedirectResult | void | unknown>

  /**
   * Log the user out
   * @param params - Optional logout parameters
   * @returns Promise that resolves with redirect path or void
   */
  logout: (params?: LogoutParams) => Promise<void | false | string>

  /**
   * Check if the user is authenticated
   * @param params - Optional check parameters
   * @throws Should throw if not authenticated
   */
  checkAuth: (params?: CheckAuthParams & QueryFunctionContext) => Promise<void>

  /**
   * Check if an error should trigger logout
   * @param error - The error to check
   * @throws Should throw if the error requires logout
   */
  checkError: (error: Error | unknown) => Promise<void>

  /**
   * Get the current user's permissions
   * @param params - Optional parameters
   * @returns Promise resolving to permissions (can be any type)
   */
  getPermissions: (params?: GetPermissionsParams & QueryFunctionContext) => Promise<unknown>

  /**
   * Get the current user's identity (optional)
   * @param params - Optional query context
   * @returns Promise resolving to user identity
   */
  getIdentity?: (params?: QueryFunctionContext) => Promise<UserIdentity>

  /**
   * Handle OAuth callback (optional)
   * @param params - Optional query context
   * @returns Promise resolving to redirect result
   */
  handleCallback?: (params?: QueryFunctionContext) => Promise<AuthRedirectResult | void | unknown>

  /**
   * Check if user can access a specific resource/action (optional)
   * For fine-grained authorization
   * @param params - Access check parameters
   * @returns Promise resolving to boolean
   */
  canAccess?: <RecordType extends Record<string, unknown> = Record<string, unknown>>(
    params: CanAccessParams<RecordType> & QueryFunctionContext
  ) => Promise<boolean>

  /**
   * Whether the auth provider supports AbortSignal for cancellation
   */
  supportAbortSignal?: boolean

  /** Allow additional custom methods */
  [key: string]: unknown
}

/**
 * Utility function to create an AuthProvider with type inference
 *
 * @param provider - AuthProvider implementation
 * @returns The same provider with proper typing
 */
export function createAuthProvider(provider: AuthProvider): AuthProvider {
  return provider
}

/**
 * Type guard to check if an object is a valid AuthProvider
 *
 * @param obj - Object to check
 * @returns True if the object implements AuthProvider interface
 */
export function isAuthProvider(obj: unknown): obj is AuthProvider {
  if (!obj || typeof obj !== 'object') {
    return false
  }

  const provider = obj as Record<string, unknown>
  return (
    typeof provider.login === 'function' &&
    typeof provider.logout === 'function' &&
    typeof provider.checkAuth === 'function' &&
    typeof provider.checkError === 'function' &&
    typeof provider.getPermissions === 'function'
  )
}

/**
 * Create a no-op AuthProvider for testing or when auth is disabled
 *
 * @returns A minimal AuthProvider that allows all access
 */
export function createNoOpAuthProvider(): AuthProvider {
  return {
    login: async () => {},
    logout: async () => {},
    checkAuth: async () => {},
    checkError: async () => {},
    getPermissions: async () => null,
  }
}
