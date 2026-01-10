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
export * from './auth-provider'
export * from './resource'
export * from './admin'
