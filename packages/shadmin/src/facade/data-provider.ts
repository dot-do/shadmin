/**
 * DataProvider Facade
 *
 * This module provides a facade/abstraction layer for DataProvider types.
 * It re-exports from internal shadmin types (which are API-compatible with ra-core)
 * to enable independent evolution of shadmin from ra-core.
 *
 * MIGRATION PATH:
 * 1. Internal shadmin code should import from this facade
 * 2. External consumers can still use ra-core types directly
 * 3. When ready to remove ra-core dependency:
 *    - Update this facade to use fully native types
 *    - No changes needed in internal code
 *
 * @module facade/data-provider
 */

// Import DataProvider for use in functions
import type { DataProvider } from '../types/data-provider'

// Re-export from internal types - these are our own definitions
// that are 100% API-compatible with ra-core
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
} from '../types/data-provider'

/**
 * Helper type for creating a typed DataProvider
 *
 * @example
 * ```tsx
 * const myDataProvider: DataProvider = {
 *   getList: async (resource, params) => { ... },
 *   getOne: async (resource, params) => { ... },
 *   // ... other methods
 * }
 * ```
 */
export type { DataProvider as TypedDataProvider } from '../types/data-provider'

/**
 * Utility function to create a DataProvider with type inference
 * This helps ensure implementations conform to the interface
 *
 * @param provider - DataProvider implementation
 * @returns The same provider with proper typing
 */
export function createDataProvider(provider: DataProvider): DataProvider {
  return provider
}

/**
 * Type guard to check if an object is a valid DataProvider
 *
 * @param obj - Object to check
 * @returns True if the object implements DataProvider interface
 */
export function isDataProvider(obj: unknown): obj is DataProvider {
  if (!obj || typeof obj !== 'object') {
    return false
  }

  const provider = obj as Record<string, unknown>
  return (
    typeof provider.getList === 'function' &&
    typeof provider.getOne === 'function' &&
    typeof provider.getMany === 'function' &&
    typeof provider.getManyReference === 'function' &&
    typeof provider.create === 'function' &&
    typeof provider.update === 'function' &&
    typeof provider.updateMany === 'function' &&
    typeof provider.delete === 'function' &&
    typeof provider.deleteMany === 'function'
  )
}
