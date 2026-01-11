/**
 * Type Exports
 *
 * This module re-exports types through the facade layer for internal use.
 * This enables independent evolution from ra-core while maintaining compatibility.
 *
 * ARCHITECTURE:
 * - Internal code imports from '../types' (this file)
 * - This file re-exports from the facade layer
 * - The facade layer uses shadmin's native type definitions
 * - External consumers can still use ra-core types via main index.ts
 */

// Common shadmin-specific types
export type {
  BaseProps,
  WithChildren,
  WithClassName,
  AsChildProps,
  Path,
  PathValue,
  LoosePath,
  ComponentProps,
} from './common'

// Re-export types through the facade layer for internal use
// These are used by components, hooks, and contexts that import from '../types'
export type {
  // Record types
  Identifier,
  RaRecord,
  // Data provider types
  DataProvider,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  GetManyParams,
  GetManyResult,
  GetManyReferenceParams,
  GetManyReferenceResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  UpdateManyParams,
  UpdateManyResult,
  DeleteParams,
  DeleteResult,
  DeleteManyParams,
  DeleteManyResult,
  // Payload types
  PaginationPayload,
  SortPayload,
  SortOrder,
  // Filter types
  FilterOperator,
  FilterKeys,
  TypedFilterPayload,
  FilterPayload,
  // Resource types
  ResourceDefinition,
  ResourceOptions,
  ResourceProps,
  // Notification types
  NotificationType,
  NotificationPayload,
  // Auth types
  AuthProvider,
  UserIdentity,
  AuthRedirectResult,
  // I18n types
  I18nProvider,
  TranslateFunction,
  Locale,
  // Form types
  MutationMode,
} from '../facade'

// Admin types - shadmin-specific
export type {
  AdminPlugin,
  AdminPluginContext,
  ThemeOptions,
  AdminLayoutProps,
  AdminProps,
} from './admin'
