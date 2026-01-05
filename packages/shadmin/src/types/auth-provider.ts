/**
 * AuthProvider type definitions for Shadmin
 * 100% API-compatible with react-admin
 */

import type { Identifier } from './data-provider'

export interface UserIdentity {
  id: Identifier
  fullName?: string
  avatar?: string
  [key: string]: unknown
}

export interface AuthRedirectResult {
  redirectTo?: string | false
  logoutOnFailure?: boolean
}

/**
 * AuthProvider interface - identical to react-admin
 */
export interface AuthProvider {
  /** Called when the user attempts to log in */
  login: (params: unknown) => Promise<unknown>

  /** Called when the user clicks on the logout button */
  logout: (params?: unknown) => Promise<void | false | string>

  /** Called when the API returns an error */
  checkError: (error: unknown) => Promise<void>

  /** Called when the user navigates to a new location, to check for authentication */
  checkAuth: (params?: unknown) => Promise<void>

  /** Called when the user navigates to a new location, to check for permissions / roles */
  getPermissions: (params?: unknown) => Promise<unknown>

  /** Called to get the user identity (optional) */
  getIdentity?: () => Promise<UserIdentity>

  /** Called to handle OAuth callbacks (optional) */
  handleCallback?: (params?: unknown) => Promise<AuthRedirectResult | void | null>
}
