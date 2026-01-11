/**
 * Facade Module Index
 *
 * This module provides a complete facade/abstraction layer between shadmin and ra-core.
 * All internal shadmin code should import types from this facade instead of directly
 * from ra-core, enabling independent evolution of the library.
 *
 * ARCHITECTURE:
 * ```
 * External Consumer -> shadmin public API -> ra-core (for compatibility)
 * Internal Component -> facade -> shadmin native types (for decoupling)
 * ```
 *
 * MIGRATION PATH:
 * 1. Phase 1 (Current): Facade re-exports from shadmin's native types
 * 2. Phase 2: Update all internal imports to use facade
 * 3. Phase 3: When ready, remove ra-core dependency entirely
 *
 * USAGE:
 * ```tsx
 * // Instead of:
 * import type { DataProvider, AuthProvider } from 'ra-core'
 *
 * // Use:
 * import type { DataProvider, AuthProvider } from '../facade'
 * ```
 *
 * @module facade
 */

// ============================================================================
// DataProvider Types
// ============================================================================
export type {
  // Core record types
  Identifier,
  RaRecord,
  // Sort and pagination
  SortPayload,
  SortOrder,
  PaginationPayload,
  // Filter types
  FilterOperator,
  FilterKeys,
  TypedFilterPayload,
  FilterPayload,
  // GetList
  GetListParams,
  GetListResult,
  // GetOne
  GetOneParams,
  GetOneResult,
  // GetMany
  GetManyParams,
  GetManyResult,
  // GetManyReference
  GetManyReferenceParams,
  GetManyReferenceResult,
  // Create
  CreateParams,
  CreateResult,
  // Update
  UpdateParams,
  UpdateResult,
  // UpdateMany
  UpdateManyParams,
  UpdateManyResult,
  // Delete
  DeleteParams,
  DeleteResult,
  // DeleteMany
  DeleteManyParams,
  DeleteManyResult,
  // DataProvider interface
  DataProvider,
  TypedDataProvider,
} from './data-provider'

export { createDataProvider, isDataProvider } from './data-provider'

// ============================================================================
// AuthProvider Types
// ============================================================================
export type {
  UserIdentity,
  AuthRedirectResult,
  LoginParams,
  LogoutParams,
  CheckAuthParams,
  GetPermissionsParams,
  CanAccessParams,
  QueryFunctionContext,
  AuthProvider,
} from './auth-provider'

export { createAuthProvider, isAuthProvider, createNoOpAuthProvider } from './auth-provider'

// ============================================================================
// Core Types
// ============================================================================
export type {
  // Resource types
  ResourceOptions,
  ResourceDefinition,
  ResourceProps,
  RecordToStringFunction,
  // Notification types
  NotificationType,
  NotificationPayload,
  // I18n types
  Locale,
  LocaleConfig,
  TranslateFunction,
  I18nProvider,
  // Form types
  MutationMode,
  // List types
  ListControllerResult,
  // Exporter types
  Exporter,
  FetchRelatedRecords,
  // Callback types
  OnSuccess,
  OnError,
  TransformData,
  // Misc types
  ValidUntil,
  CoreLayoutProps,
  LayoutComponent,
  LoadingComponentProps,
  LoadingComponent,
  TitleComponent,
  CatchAllComponent,
  LoginComponent,
  ResourceComponentInjectedProps,
} from './core-types'

// ============================================================================
// React-Admin Core Facade (Hooks, Components, Utilities)
// ============================================================================
// Re-export ra-core functionality through a controlled facade.
// This provides only what consumers need, not the entire ra-core surface area.

// Context Hooks
export {
  useResourceContext,
  useRecordContext,
  useListContext,
  useEditContext,
  useCreateContext,
} from './ra-core'

// Navigation Hooks
export {
  useCreatePath,
  useRedirect,
  useRefresh,
} from './ra-core'

// Data Provider Hooks
export { useDataProvider } from './ra-core'

// Mutation Hooks
export {
  useDelete,
  useDeleteMany,
} from './ra-core'

// Selection Hooks
export { useUnselectAll } from './ra-core'

// Auth Hooks
export {
  useGetIdentity,
  useLogout,
} from './ra-core'

// Base Components (Headless Controllers)
export {
  EditBase,
  ShowBase,
  CreateBase,
} from './ra-core'

// Context Providers (for ResourceContext compatibility)
export {
  ResourceContext,
  ResourceContextProvider,
} from './ra-core'

// Utility Functions
export { fetchRelatedRecords } from './ra-core'

// ============================================================================
// Facade Utilities
// ============================================================================

/**
 * Check if the facade is properly initialized
 * This is a simple utility to verify the module is loaded
 */
export const FACADE_VERSION = '1.0.0'

/**
 * Check if we're running with native types (true) or ra-core types (false)
 * Currently always true as we use shadmin native types
 */
export const isNativeTypes = true
