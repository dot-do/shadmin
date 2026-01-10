// Type exports
// Re-exports ra-core types for internal use by shadmin components
// The main index.ts exports ra-core directly, so we need to be careful about
// which types we re-export from here to avoid duplicate export errors

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

// Re-export types from ra-core for internal use
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
} from 'ra-core'

// Data provider types - only export types NOT in ra-core
export type { SortOrder } from './data-provider'

// Admin types - shadmin-specific
export type {
  AdminPlugin,
  AdminPluginContext,
  ThemeOptions,
  AdminLayoutProps,
  AdminProps,
} from './admin'
