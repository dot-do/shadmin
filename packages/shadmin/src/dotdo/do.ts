/**
 * DO() Factory Function
 *
 * Creates DataProvider (DB) and AuthProvider (Auth) factories
 * for connecting shadmin to dotdo Durable Objects.
 *
 * @module dotdo/do
 */

import { createAuthProviderFactory } from './auth-provider'
import { createDataProviderFactory } from './data-provider'

import type { DOConfig, DOResult, DBOptions, AuthOptions } from './types'
import type { DataProvider, AuthProvider } from '../facade'

/**
 * Create dotdo integration for shadmin
 *
 * This is the main entry point for connecting shadmin to dotdo.
 * It returns `DB` and `Auth` factories that create react-admin compatible
 * DataProvider and AuthProvider instances.
 *
 * @param baseUrl - The base URL of your dotdo API
 * @param config - Optional additional configuration
 * @returns Object with DB and Auth factory functions
 *
 * @example
 * ```tsx
 * import { Admin, Resource } from 'shadmin'
 * import { DO } from 'shadmin'
 *
 * const { Auth, DB } = DO('https://api.your-app.do')
 *
 * function App() {
 *   return (
 *     <Admin dataProvider={DB()} authProvider={Auth()}>
 *       <Resource name="users" list={UserList} />
 *       <Resource name="posts" list={PostList} />
 *     </Admin>
 *   )
 * }
 * ```
 *
 * @example With options
 * ```tsx
 * const { Auth, DB } = DO('https://api.your-app.do', {
 *   headers: { 'X-API-Version': '2' },
 *   timeout: 60000,
 * })
 *
 * // Custom resource mapping
 * const dataProvider = DB({
 *   resourceMapping: {
 *     'users': 'user-accounts',
 *     'posts': 'blog-posts',
 *   }
 * })
 *
 * // Custom auth options
 * const authProvider = Auth({
 *   tokenKey: 'my_app_token',
 *   logoutRedirectPath: '/signin',
 * })
 * ```
 */
export function DO(baseUrl: string, config?: Omit<DOConfig, 'baseUrl'>): DOResult {
  const fullConfig: DOConfig = {
    baseUrl: normalizeBaseUrl(baseUrl),
    ...config,
  }

  const createDB = createDataProviderFactory(fullConfig)
  const createAuth = createAuthProviderFactory(fullConfig)

  return {
    /**
     * Create a DataProvider for react-admin
     *
     * The DataProvider handles all CRUD operations:
     * - getList, getOne, getMany, getManyReference
     * - create, update, updateMany
     * - delete, deleteMany
     *
     * @param options - Optional configuration for the DataProvider
     * @returns A react-admin compatible DataProvider
     */
    DB: (options?: DBOptions): DataProvider => {
      return createDB(options)
    },

    /**
     * Create an AuthProvider for react-admin
     *
     * The AuthProvider handles all authentication operations:
     * - login, logout
     * - checkAuth, checkError
     * - getIdentity, getPermissions
     * - canAccess (optional fine-grained authorization)
     *
     * @param options - Optional configuration for the AuthProvider
     * @returns A react-admin compatible AuthProvider
     */
    Auth: (options?: AuthOptions): AuthProvider => {
      return createAuth(options)
    },
  }
}

/**
 * Normalize the base URL by removing trailing slashes
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

/**
 * Validate that a URL is valid
 * @throws Error if URL is invalid
 */
export function validateBaseUrl(url: string): void {
  try {
    new URL(url)
  } catch {
    throw new Error(`Invalid base URL: ${url}. Must be a valid URL like "https://api.your-app.do"`)
  }
}

/**
 * Type helper for creating typed resource configurations
 *
 * @example
 * ```tsx
 * type MyResources = {
 *   users: { id: string; email: string; name: string }
 *   posts: { id: string; title: string; content: string; authorId: string }
 * }
 *
 * const { DB } = DO<MyResources>('https://api.your-app.do')
 * ```
 */
export type DOWithResources<_Resources extends Record<string, unknown>> = DOResult
