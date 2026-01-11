/**
 * React-Admin Core Facade
 *
 * This module provides a controlled facade over ra-core, exporting only the
 * specific hooks, components, and utilities that shadmin consumers need.
 *
 * ## Why a Facade?
 *
 * Direct re-export of ra-core's entire surface area (`export * from 'ra-core'`)
 * creates tight coupling that makes independent evolution difficult. This facade:
 *
 * 1. **Reduces API surface** - Only exports what consumers actually use
 * 2. **Enables substitution** - Can swap ra-core implementations with native ones
 * 3. **Improves bundle size** - Tree-shaking is more effective with explicit exports
 * 4. **Documents dependencies** - Makes ra-core usage explicit and auditable
 *
 * ## Migration Path
 *
 * Phase 1 (Current): Facade re-exports from ra-core
 * Phase 2: Gradually replace ra-core hooks with native shadmin implementations
 * Phase 3: Remove ra-core dependency entirely
 *
 * ## Usage
 *
 * External consumers should import from 'shadmin' (which re-exports this facade).
 * Internal components should import directly from ra-core for now, but can be
 * migrated to use native implementations as they become available.
 *
 * @module facade/ra-core
 */

// =============================================================================
// CONTEXT HOOKS - Resource and Record Management
// =============================================================================

/**
 * Hook to get the current resource name from context.
 * Used by buttons and other components to determine which resource they operate on.
 */
export { useResourceContext } from 'ra-core'

/**
 * Hook to get the current record from context.
 * Used by buttons to access the record they should act upon.
 */
export { useRecordContext } from 'ra-core'

/**
 * Hook to access list context (data, pagination, selection, etc.)
 * Used by list action buttons like export and bulk delete.
 */
export { useListContext } from 'ra-core'

/**
 * Hook to access edit context (record, save function, etc.)
 * Used by form components in edit views.
 */
export { useEditContext } from 'ra-core'

/**
 * Hook to access create context (save function, etc.)
 * Used by form components in create views.
 */
export { useCreateContext } from 'ra-core'

// =============================================================================
// NAVIGATION HOOKS
// =============================================================================

/**
 * Hook to create paths for resource routes.
 * Used by navigation buttons (Edit, Show, Clone, Create).
 */
export { useCreatePath } from 'ra-core'

/**
 * Hook to programmatically redirect to a route.
 * Used after mutations to navigate to the appropriate view.
 */
export { useRedirect } from 'ra-core'

/**
 * Hook to refresh the current view's data.
 * Used after mutations to ensure data is up-to-date.
 */
export { useRefresh } from 'ra-core'

// =============================================================================
// DATA PROVIDER HOOKS
// =============================================================================

/**
 * Hook to access the DataProvider instance.
 * Used for custom data operations like export.
 */
export { useDataProvider } from 'ra-core'

// =============================================================================
// MUTATION HOOKS
// =============================================================================

/**
 * Hook for deleting a single record.
 * Used by delete buttons.
 */
export { useDelete } from 'ra-core'

/**
 * Hook for deleting multiple records.
 * Used by bulk delete buttons.
 */
export { useDeleteMany } from 'ra-core'

// =============================================================================
// SELECTION HOOKS
// =============================================================================

/**
 * Hook to unselect all records in a list.
 * Used after bulk operations to clear selection.
 */
export { useUnselectAll } from 'ra-core'

// =============================================================================
// AUTH HOOKS
// =============================================================================

/**
 * Hook to get the current user's identity.
 * Used by AppBar to display user information.
 */
export { useGetIdentity } from 'ra-core'

/**
 * Hook to log the user out.
 * Used by AppBar's user menu.
 */
export { useLogout } from 'ra-core'

// =============================================================================
// BASE COMPONENTS - Headless Controllers
// =============================================================================

/**
 * Base component for edit views.
 * Provides EditContext to children without any UI.
 */
export { EditBase } from 'ra-core'

/**
 * Base component for show views.
 * Provides ShowContext to children without any UI.
 */
export { ShowBase } from 'ra-core'

/**
 * Base component for create views.
 * Provides CreateContext to children without any UI.
 */
export { CreateBase } from 'ra-core'

// =============================================================================
// CONTEXT PROVIDERS - For ResourceContext compatibility
// =============================================================================

/**
 * The ResourceContext from ra-core.
 * We re-export this for compatibility with ra-core's Resource component.
 */
export { ResourceContext, ResourceContextProvider } from 'ra-core'

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Utility to fetch related records for export operations.
 * Used by export buttons to resolve references.
 */
export { fetchRelatedRecords } from 'ra-core'

// =============================================================================
// TYPE RE-EXPORTS
// =============================================================================
// Note: Most types should come from the facade's native type definitions.
// These are ra-core-specific types that may be needed for full compatibility.

export type {
  // Core types that consumers may need
  Identifier,
  RaRecord,
  // Sort and filter types
  SortPayload,
  FilterPayload,
  // DataProvider types (consumers may want to implement their own)
  DataProvider,
  // AuthProvider types
  AuthProvider,
  UserIdentity,
  // List controller types
  ListControllerResult,
  // Exporter types
  Exporter,
  // Mutation mode
  MutationMode,
  // Resource types
  ResourceDefinition,
} from 'ra-core'
