/**
 * @dotdo/react Integration Module
 *
 * This module provides React integration for Durable Objects via the @dotdo/client SDK.
 * It includes a context provider, data provider factory, auth provider factory, and hooks
 * for real-time data access.
 *
 * @module dotdo-react
 *
 * @example Basic Setup with Data and Auth Providers
 * ```tsx
 * import {
 *   ShadminDOProvider,
 *   createDotdoDataProvider,
 *   createDotdoAuthProvider,
 *   useShadminDO
 * } from 'shadmin/dotdo-react'
 *
 * function App() {
 *   return (
 *     <ShadminDOProvider baseUrl="https://api.your-app.do">
 *       <AdminWithProviders />
 *     </ShadminDOProvider>
 *   )
 * }
 *
 * function AdminWithProviders() {
 *   const { client, getResourceName, connectionState, disconnect } = useShadminDO()
 *
 *   const dataProvider = useMemo(
 *     () => createDotdoDataProvider({ client, getResourceName }),
 *     [client, getResourceName]
 *   )
 *
 *   const authProvider = useMemo(
 *     () => createDotdoAuthProvider({ client, connectionState, disconnect }),
 *     [client, connectionState, disconnect]
 *   )
 *
 *   return (
 *     <Admin dataProvider={dataProvider} authProvider={authProvider}>
 *       <Resource name="users" />
 *     </Admin>
 *   )
 * }
 * ```
 *
 * @example Using Hooks Directly
 * ```tsx
 * import { useDOList, useDOForm } from 'shadmin/dotdo-react'
 *
 * function UserList() {
 *   const { data, isLoading } = useDOList('users', {
 *     perPage: 25,
 *     sortField: 'createdAt',
 *     sortOrder: 'DESC',
 *   })
 *
 *   if (isLoading) return <Loading />
 *   return <DataGrid data={data} />
 * }
 *
 * function UserForm({ user }) {
 *   const { create, update, state } = useDOForm('users')
 *
 *   const handleSubmit = async (data) => {
 *     if (user) {
 *       await update({ id: user.id, data })
 *     } else {
 *       await create({ data })
 *     }
 *   }
 *
 *   return <Form onSubmit={handleSubmit} />
 * }
 * ```
 */

// =============================================================================
// Provider
// =============================================================================

export {
  ShadminDOProvider,
  useShadminDO,
  useShadminDOOptional,
  useDOConnectionState,
  useDOQueueCount,
} from './provider'

export type { ShadminDOProviderProps } from './provider'

// =============================================================================
// Data Provider
// =============================================================================

export { createDotdoDataProvider, isDotdoDataProvider } from './data-provider'

export type { DotdoDataProviderConfig, DotdoDataProviderOptions } from './data-provider'

// =============================================================================
// Auth Provider
// =============================================================================

export { createDotdoAuthProvider, isDotdoAuthProvider } from './auth-provider'

export type {
  DotdoAuthProviderConfig,
  DotdoAuthProviderOptions,
  DOLoginResponse,
  DOUserIdentity,
  DOPermissionsResponse,
} from './auth-provider'

// =============================================================================
// Hooks
// =============================================================================

export { useDOList, useDOListContext, useDOListOptional } from './use-do-list'

export type { UseDOListOptions } from './use-do-list'

export { useDOForm, useDOFormOptional } from './use-do-form'

export type { UseDOFormExtendedOptions } from './use-do-form'

// =============================================================================
// Types
// =============================================================================

export type {
  // Connection types
  ConnectionState,
  SubscriptionHandle,
  DOClientProxy,
  // Config types
  DOClientConfig,
  ShadminDOProviderConfig,
  ShadminDOContextValue,
  // Request parameter types
  DOListParams,
  DOGetParams,
  DOGetManyParams,
  DOCreateParams,
  DOUpdateParams,
  DOUpdateManyParams,
  DODeleteParams,
  DODeleteManyParams,
  // Response types
  DOListResult,
  DORecordResult,
  DOBatchResult,
  // Hook types
  UseDOListParams,
  UseDOListResult,
  UseDOShowParams,
  UseDOShowResult,
  UseDOFormCreateParams,
  UseDOFormUpdateParams,
  UseDOFormOptions,
  UseDOFormMutationState,
  UseDOFormResult,
} from './types'
