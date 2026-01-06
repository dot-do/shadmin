/**
 * Core types for Shadmin DataProvider integration with mongo.do
 * These types mirror the React Admin DataProvider interface
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RaRecord<IdType extends Identifier = Identifier> = Record<string, any> & {
  id: IdType
}

export type Identifier = string | number

export interface Pagination {
  page: number
  perPage: number
}

export interface SortPayload {
  field: string
  order: 'ASC' | 'DESC'
}

export type FilterPayload = Record<string, unknown>

export interface GetListParams {
  pagination: Pagination
  sort: SortPayload
  filter: FilterPayload
  meta?: Record<string, unknown>
}

export interface GetListResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[]
  total: number
  pageInfo?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
  }
}

export interface GetOneParams {
  id: Identifier
  meta?: Record<string, unknown>
}

export interface GetOneResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType
}

export interface GetManyParams {
  ids: Identifier[]
  meta?: Record<string, unknown>
}

export interface GetManyResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[]
}

export interface GetManyReferenceParams {
  target: string
  id: Identifier
  pagination: Pagination
  sort: SortPayload
  filter: FilterPayload
  meta?: Record<string, unknown>
}

export interface GetManyReferenceResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[]
  total: number
  pageInfo?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
  }
}

export interface CreateParams<T = Record<string, unknown>> {
  data: T
  meta?: Record<string, unknown>
}

export interface CreateResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType
}

export interface UpdateParams<T = Record<string, unknown>> {
  id: Identifier
  data: T
  previousData: RaRecord
  meta?: Record<string, unknown>
}

export interface UpdateResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType
}

export interface UpdateManyParams<T = Record<string, unknown>> {
  ids: Identifier[]
  data: T
  meta?: Record<string, unknown>
}

export interface UpdateManyResult {
  data: Identifier[]
}

export interface DeleteParams<RecordType extends RaRecord = RaRecord> {
  id: Identifier
  previousData?: RecordType
  meta?: Record<string, unknown>
}

export interface DeleteResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType
}

export interface DeleteManyParams {
  ids: Identifier[]
  meta?: Record<string, unknown>
}

export interface DeleteManyResult {
  data: Identifier[]
}

/**
 * The DataProvider interface - identical to React Admin's interface
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

  updateMany: <TVariables = Record<string, unknown>>(
    resource: string,
    params: UpdateManyParams<TVariables>
  ) => Promise<UpdateManyResult>

  delete: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteParams<RecordType>
  ) => Promise<DeleteResult<RecordType>>

  deleteMany: (resource: string, params: DeleteManyParams) => Promise<DeleteManyResult>
}

/**
 * Configuration options for the Mondo DataProvider
 */
export interface MondoDataProviderOptions {
  /**
   * The mongo.do MongoClient instance
   */
  client: MongoClient
  /**
   * The database name to use
   */
  database: string
}

/**
 * MongoDB-specific types for internal use
 */
export interface MongoDocument {
  _id: string | { $oid: string }
  [key: string]: unknown
}

/**
 * Minimal mongo.do client interface
 * This represents the essential API surface we need from mongo.do
 */
export interface MongoClient {
  db(name: string): MongoDatabase
}

export interface MongoDatabase {
  collection<T extends MongoDocument = MongoDocument>(name: string): MongoCollection<T>
}

export interface MongoCollection<T extends MongoDocument = MongoDocument> {
  find(filter?: Record<string, unknown>): FindCursor<T>
  findOne(filter: Record<string, unknown>): Promise<T | null>
  insertOne(doc: Omit<T, '_id'>): Promise<MongoInsertOneResult>
  updateOne(filter: Record<string, unknown>, update: Record<string, unknown>): Promise<MongoUpdateResult>
  updateMany(filter: Record<string, unknown>, update: Record<string, unknown>): Promise<MongoUpdateResult>
  deleteOne(filter: Record<string, unknown>): Promise<MongoDeleteResult>
  deleteMany(filter: Record<string, unknown>): Promise<MongoDeleteResult>
  countDocuments(filter?: Record<string, unknown>): Promise<number>
  aggregate<TResult = T>(pipeline: Record<string, unknown>[]): AggregateCursor<TResult>
}

export interface FindCursor<T> {
  sort(sort: Record<string, 1 | -1>): FindCursor<T>
  skip(n: number): FindCursor<T>
  limit(n: number): FindCursor<T>
  toArray(): Promise<T[]>
}

export interface AggregateCursor<T> {
  toArray(): Promise<T[]>
}

export interface MongoInsertOneResult {
  insertedId: string | { $oid: string }
  acknowledged: boolean
}

export interface MongoUpdateResult {
  matchedCount: number
  modifiedCount: number
  acknowledged: boolean
}

export interface MongoDeleteResult {
  deletedCount: number
  acknowledged: boolean
}
