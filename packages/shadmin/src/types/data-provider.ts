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
 * Filter payload for list queries.
 * Keys can be field names or field names with operator suffixes (e.g., 'age_gt', 'name_contains').
 *
 * @example
 * ```tsx
 * const filter: FilterPayload = { status: 'active', age_gt: 18 }
 * ```
 */
export type FilterPayload<_T extends RaRecord = RaRecord> = Record<string, unknown>

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
