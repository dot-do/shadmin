/**
 * dotdo Integration for shadmin
 *
 * This module provides seamless integration between shadmin and dotdo Durable Objects.
 * It creates react-admin compatible DataProvider and AuthProvider instances that
 * communicate with dotdo's HTTP API.
 *
 * @module dotdo
 *
 * @example Basic usage
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
 * @example With custom configuration
 * ```tsx
 * const { Auth, DB } = DO('https://api.your-app.do', {
 *   headers: { 'X-API-Version': '2' },
 *   timeout: 60000,
 * })
 *
 * const dataProvider = DB({
 *   resourceMapping: { 'users': 'user-accounts' }
 * })
 *
 * const authProvider = Auth({
 *   tokenKey: 'my_app_token',
 *   logoutRedirectPath: '/signin',
 * })
 * ```
 */

// Main factory function
export { DO, validateBaseUrl, type DOWithResources } from './do'

// Factory functions for advanced usage
export { createDataProviderFactory, DODataError } from './data-provider'
export { createAuthProviderFactory, DOAuthError } from './auth-provider'

// Types
export type {
  // Configuration types
  DOConfig,
  DBOptions,
  AuthOptions,
  DOResult,
  // Response types
  DOListResponse,
  DORecordResponse,
  DOBatchResponse,
  DOLoginResponse,
  DOUserIdentity,
  DOErrorResponse,
  // Request types
  DORequestOptions,
} from './types'
