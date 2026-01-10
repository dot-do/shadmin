// Type exports
// Common types used across the library

export type {
  BaseProps,
  WithChildren,
  WithClassName,
  AsChildProps,
  Path,
  PathValue,
  LoosePath,
} from './common'

// Core record types - single source of truth
export * from './record'

// Data provider types (also re-exports record types for backwards compatibility)
export * from './data-provider'
// Note: AuthProvider types are exported from ra-core in src/index.ts
// We don't re-export them here to avoid duplicate export conflicts
export * from './resource'
export * from './admin'
