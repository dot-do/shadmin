/**
 * DataProvider type definitions for Shadmin
 * 100% API-compatible with react-admin
 */

// Import core record types from single source of truth
import type { Identifier, RaRecord } from './record'

// Re-export for backwards compatibility
export type { Identifier, RaRecord } from './record'

/**
 * Sort order type - ascending or descending
 */
export type SortOrder = 'ASC' | 'DESC'

/**
 * Sort payload for list queries.
 * The field is a string that can be a dot-notation path to a nested property.
 *
 * @example
 * ```tsx
 * const sort: SortPayload = { field: 'name', order: 'ASC' }
 * const nestedSort: SortPayload = { field: 'author.name', order: 'DESC' }
 * ```
 */
export interface SortPayload<_T extends RaRecord = RaRecord> {
  field: string
  order: SortOrder
}

/**
 * Pagination parameters for list queries
 */
export interface PaginationPayload {
  page: number
  perPage: number
}

/**
 * Filter operators that can be appended to field names.
 * These are common operators used by data providers for server-side filtering.
 *
 * @example
 * ```tsx
 * // Using operators with field names:
 * { age_gt: 18, name_contains: 'john', status_in: ['active', 'pending'] }
 * ```
 */
export type FilterOperator =
  | '' // exact match (no suffix)
  | '_gt' // greater than
  | '_gte' // greater than or equal
  | '_lt' // less than
  | '_lte' // less than or equal
  | '_ne' // not equal
  | '_eq' // equal (explicit)
  | '_in' // in array
  | '_nin' // not in array
  | '_contains' // contains substring (case-sensitive)
  | '_icontains' // contains substring (case-insensitive)
  | '_startswith' // starts with
  | '_endswith' // ends with
  | '_isnull' // is null check
  | '_like' // SQL LIKE pattern
  | '_ilike' // SQL ILIKE pattern (case-insensitive)
  | '_regex' // regex match
  | '_exists' // field exists
  | '_between' // between two values
  | '_not' // negation

/**
 * Extract non-id keys from a record type for filter field generation.
 * Excludes 'id' since it's handled separately and includes nested paths.
 */
type FilterableKeys<T extends RaRecord> = Exclude<keyof T, 'id'> & string

/**
 * Generate filter keys for a record type by combining field names with operators.
 * This creates all valid filter key combinations for type-safe filtering.
 *
 * @template T - The record type to generate filter keys for
 *
 * @example
 * ```tsx
 * interface User extends RaRecord {
 *   name: string
 *   age: number
 * }
 * // FilterKeys<User> includes: 'name', 'name_contains', 'age', 'age_gt', 'age_lte', etc.
 * ```
 */
export type FilterKeys<T extends RaRecord> =
  | FilterableKeys<T>
  | `${FilterableKeys<T>}${Exclude<FilterOperator, ''>}`
  | 'id'
  | `id${Exclude<FilterOperator, ''>}`
  | 'q' // common full-text search key
  | `${string}.${string}` // nested field access (e.g., 'author.name')

/**
 * Typed filter payload for a specific record type.
 * Provides type-safe filter keys based on the record's fields.
 *
 * @template T - The record type this filter applies to
 *
 * @example
 * ```tsx
 * interface User extends RaRecord {
 *   name: string
 *   age: number
 *   active: boolean
 * }
 *
 * // Type-safe filter creation:
 * const filter: TypedFilterPayload<User> = {
 *   name_contains: 'john',
 *   age_gte: 18,
 *   active: true
 * }
 * ```
 */
export type TypedFilterPayload<T extends RaRecord = RaRecord> = {
  [K in FilterKeys<T>]?: unknown
}

/**
 * Filter payload for list queries.
 * Keys can be field names or field names with operator suffixes (e.g., 'age_gt', 'name_contains').
 *
 * When used with a generic type parameter, provides type-safe filter key suggestions.
 * Without a type parameter (or with RaRecord), allows any string keys for maximum flexibility.
 *
 * @template T - The record type for type-safe filter keys. Defaults to RaRecord for backward compatibility.
 *
 * @example
 * ```tsx
 * // Untyped usage (backward compatible):
 * const filter: FilterPayload = { status: 'active', age_gt: 18 }
 *
 * // Typed usage (with specific record type):
 * interface User extends RaRecord {
 *   name: string
 *   age: number
 * }
 * const typedFilter: FilterPayload<User> = { name_contains: 'john', age_gte: 18 }
 * ```
 */
export type FilterPayload<T extends RaRecord = RaRecord> =
  // When T is exactly RaRecord (the default), use loose typing for backward compatibility
  T extends { [key: string]: unknown }
    ? [keyof Omit<T, 'id'>] extends [never]
      ? Record<string, unknown> // No specific fields, allow anything
      : TypedFilterPayload<T> & Record<string, unknown> // Has fields, suggest them but allow extras
    : Record<string, unknown>

// GetList
export interface GetListParams<T extends RaRecord = RaRecord> {
  pagination: PaginationPayload
  sort: SortPayload<T>
  filter: FilterPayload<T>
  meta?: Record<string, unknown>
  /** AbortSignal for request cancellation */
  signal?: AbortSignal
}

export interface GetListResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[]
  total?: number
  pageInfo?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
  }
}

// GetOne
export interface GetOneParams {
  id: Identifier
  meta?: Record<string, unknown>
  /** AbortSignal for request cancellation */
  signal?: AbortSignal
}

export interface GetOneResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType
}

// GetMany
export interface GetManyParams {
  ids: Identifier[]
  meta?: Record<string, unknown>
  /** AbortSignal for request cancellation */
  signal?: AbortSignal
}

export interface GetManyResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[]
}

// GetManyReference
export interface GetManyReferenceParams<T extends RaRecord = RaRecord> {
  target: string
  id: Identifier
  pagination: PaginationPayload
  sort: SortPayload<T>
  filter: FilterPayload<T>
  meta?: Record<string, unknown>
  /** AbortSignal for request cancellation */
  signal?: AbortSignal
}

export interface GetManyReferenceResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[]
  total?: number
  pageInfo?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
  }
}

// Create
export interface CreateParams<T = Record<string, unknown>> {
  data: T
  meta?: Record<string, unknown>
  /** AbortSignal for request cancellation */
  signal?: AbortSignal
}

export interface CreateResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType
}

// Update
export interface UpdateParams<T = Record<string, unknown>> {
  id: Identifier
  data: T
  previousData?: T
  meta?: Record<string, unknown>
  /** AbortSignal for request cancellation */
  signal?: AbortSignal
}

export interface UpdateResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType
}

// UpdateMany
export interface UpdateManyParams<T = Record<string, unknown>> {
  ids: Identifier[]
  data: T
  meta?: Record<string, unknown>
  /** AbortSignal for request cancellation */
  signal?: AbortSignal
}

export interface UpdateManyResult<RecordType extends RaRecord = RaRecord> {
  data?: RecordType['id'][]
}

// Delete
export interface DeleteParams<RecordType extends RaRecord = RaRecord> {
  id: Identifier
  previousData?: RecordType
  meta?: Record<string, unknown>
  /** AbortSignal for request cancellation */
  signal?: AbortSignal
}

export interface DeleteResult<RecordType extends RaRecord = RaRecord> {
  data?: RecordType
}

// DeleteMany
export interface DeleteManyParams {
  ids: Identifier[]
  meta?: Record<string, unknown>
  /** AbortSignal for request cancellation */
  signal?: AbortSignal
}

export interface DeleteManyResult<RecordType extends RaRecord = RaRecord> {
  data?: RecordType['id'][]
}

/**
 * DataProvider interface - identical to react-admin
 * All 9 methods for CRUD operations
 */
export interface DataProvider {
  getList: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetListParams
  ) => Promise<GetListResult<RecordType>>

  getOne: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetOneParams
  ) => Promise<GetOneResult<RecordType>>

  getMany: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyParams
  ) => Promise<GetManyResult<RecordType>>

  getManyReference: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyReferenceParams
  ) => Promise<GetManyReferenceResult<RecordType>>

  create: <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
    resource: string,
    params: CreateParams<TVariables>
  ) => Promise<CreateResult<RecordType>>

  update: <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
    resource: string,
    params: UpdateParams<TVariables>
  ) => Promise<UpdateResult<RecordType>>

  updateMany: <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
    resource: string,
    params: UpdateManyParams<TVariables>
  ) => Promise<UpdateManyResult<RecordType>>

  delete: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteParams<RecordType>
  ) => Promise<DeleteResult<RecordType>>

  deleteMany: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteManyParams
  ) => Promise<DeleteManyResult<RecordType>>
}
