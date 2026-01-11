/**
 * DataProvider for mongo.do edge database
 *
 * Creates a react-admin compatible DataProvider that communicates
 * with mongo.do's HTTP API for MongoDB operations at the edge.
 *
 * @module mongo/data-provider
 *
 * @example Basic usage
 * ```tsx
 * import { createMongoDataProvider } from 'shadmin/mongo'
 *
 * const dataProvider = createMongoDataProvider({
 *   baseUrl: 'https://your-database.mongo.do',
 *   apiKey: 'your-api-key'
 * })
 *
 * // Use with shadmin Admin
 * <Admin dataProvider={dataProvider}>
 *   <Resource name="users" />
 * </Admin>
 * ```
 */

import type {
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
  RaRecord,
} from '../facade'

import type {
  MongoConfig,
  MongoDataProviderOptions,
  MongoListResponse,
  MongoRecordResponse,
  MongoBatchResponse,
  MongoWriteResponse,
  MongoRequestOptions,
} from './types'

/**
 * Convert filter operators from react-admin format to MongoDB format
 *
 * @param filter - React-admin filter object with operator suffixes
 * @returns MongoDB-style query object
 */
function convertFilter(filter: Record<string, unknown>): Record<string, unknown> {
  const mongoFilter: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(filter)) {
    // Handle operator suffixes
    if (key.endsWith('_gt')) {
      const field = key.slice(0, -3)
      mongoFilter[field] = { ...((mongoFilter[field] as Record<string, unknown>) ?? {}), $gt: value }
    } else if (key.endsWith('_gte')) {
      const field = key.slice(0, -4)
      mongoFilter[field] = { ...((mongoFilter[field] as Record<string, unknown>) ?? {}), $gte: value }
    } else if (key.endsWith('_lt')) {
      const field = key.slice(0, -3)
      mongoFilter[field] = { ...((mongoFilter[field] as Record<string, unknown>) ?? {}), $lt: value }
    } else if (key.endsWith('_lte')) {
      const field = key.slice(0, -4)
      mongoFilter[field] = { ...((mongoFilter[field] as Record<string, unknown>) ?? {}), $lte: value }
    } else if (key.endsWith('_ne')) {
      const field = key.slice(0, -3)
      mongoFilter[field] = { $ne: value }
    } else if (key.endsWith('_eq')) {
      const field = key.slice(0, -3)
      mongoFilter[field] = { $eq: value }
    } else if (key.endsWith('_in')) {
      const field = key.slice(0, -3)
      mongoFilter[field] = { $in: value }
    } else if (key.endsWith('_nin')) {
      const field = key.slice(0, -4)
      mongoFilter[field] = { $nin: value }
    } else if (key.endsWith('_contains')) {
      const field = key.slice(0, -9)
      mongoFilter[field] = { $regex: value, $options: 'i' }
    } else if (key.endsWith('_icontains')) {
      const field = key.slice(0, -10)
      mongoFilter[field] = { $regex: value, $options: 'i' }
    } else if (key.endsWith('_startswith')) {
      const field = key.slice(0, -11)
      mongoFilter[field] = { $regex: `^${value}`, $options: 'i' }
    } else if (key.endsWith('_endswith')) {
      const field = key.slice(0, -9)
      mongoFilter[field] = { $regex: `${value}$`, $options: 'i' }
    } else if (key.endsWith('_exists')) {
      const field = key.slice(0, -7)
      mongoFilter[field] = { $exists: value }
    } else if (key === 'q') {
      // Full-text search - create $or query across common text fields
      // This is a simple implementation; real apps might want to customize
      if (value && typeof value === 'string') {
        mongoFilter.$or = [
          { name: { $regex: value, $options: 'i' } },
          { title: { $regex: value, $options: 'i' } },
          { description: { $regex: value, $options: 'i' } },
        ]
      }
    } else {
      // Direct equality match
      mongoFilter[key] = value
    }
  }

  return mongoFilter
}

/**
 * Convert sort order from react-admin format to MongoDB format
 */
function convertSort(field: string, order: 'ASC' | 'DESC'): Record<string, 1 | -1> {
  return { [field]: order === 'ASC' ? 1 : -1 }
}

/**
 * Creates a DataProvider for mongo.do edge database
 *
 * @param config - MongoConfig with baseUrl and optional settings
 * @param options - Optional configuration for resource mapping and defaults
 * @returns A DataProvider compatible with react-admin/shadmin
 *
 * @example Basic usage
 * ```tsx
 * const dataProvider = createMongoDataProvider({
 *   baseUrl: 'https://my-db.mongo.do',
 *   apiKey: 'your-api-key'
 * })
 * ```
 *
 * @example With resource mapping
 * ```tsx
 * const dataProvider = createMongoDataProvider(
 *   { baseUrl: 'https://my-db.mongo.do' },
 *   { resourceMapping: { 'users': 'user-accounts' } }
 * )
 * ```
 */
export function createMongoDataProvider(
  config: MongoConfig,
  options: MongoDataProviderOptions = {}
): DataProvider {
  const {
    baseUrl,
    database,
    apiKey,
    headers: configHeaders = {},
    credentials = 'include',
    timeout = 30000,
  } = config

  const {
    resourceMapping = {},
    headers: optionHeaders = {},
    defaultSortField = '_id',
    defaultSortOrder = 'DESC',
  } = options

  /**
   * Get the actual collection name for mongo.do API
   */
  const getCollectionName = (resource: string): string => {
    return resourceMapping[resource] ?? resource
  }

  /**
   * Build the API URL for a collection
   */
  const buildUrl = (collection: string, id?: string | number): string => {
    const base = baseUrl.replace(/\/$/, '')
    let url = database ? `${base}/${database}/${collection}` : `${base}/${collection}`

    if (id !== undefined) {
      url += `/${id}`
    }

    return url
  }

  /**
   * Make a fetch request to the mongo.do API
   */
  const doFetch = async <T>(url: string, requestOptions: MongoRequestOptions = {}): Promise<T> => {
    const { method = 'GET', body, headers: requestHeaders = {}, signal } = requestOptions

    const allHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...configHeaders,
      ...optionHeaders,
      ...requestHeaders,
    }

    if (apiKey) {
      allHeaders['Authorization'] = `Bearer ${apiKey}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: allHeaders,
        credentials,
        signal: signal ?? controller.signal,
      }
      if (body !== undefined) {
        fetchOptions.body = JSON.stringify(body)
      }
      const response = await fetch(url, fetchOptions)

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          (errorData as { error?: { message?: string } }).error?.message ??
            `HTTP ${response.status}: ${response.statusText}`
        )
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  /**
   * The DataProvider implementation
   */
  const dataProvider: DataProvider = {
    /**
     * Get a list of records with pagination, sorting, and filtering
     */
    getList: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetListParams
    ): Promise<GetListResult<RecordType>> => {
      const { pagination, sort, filter, signal } = params
      const collection = getCollectionName(resource)

      const mongoFilter = convertFilter(filter)
      const mongoSort = convertSort(
        sort.field || defaultSortField,
        sort.order || defaultSortOrder
      )

      const query = {
        filter: mongoFilter,
        sort: mongoSort,
        skip: (pagination.page - 1) * pagination.perPage,
        limit: pagination.perPage,
      }

      const url = buildUrl(collection)
      const fetchOptions: MongoRequestOptions = { method: 'POST', body: { action: 'find', ...query } }
      if (signal) fetchOptions.signal = signal

      const response = await doFetch<MongoListResponse<RecordType>>(url, fetchOptions)

      const result: GetListResult<RecordType> = {
        data: response.data.map(normalizeRecord),
        total: response.total,
      }

      if (response.pageInfo) {
        result.pageInfo = response.pageInfo
      }

      return result
    },

    /**
     * Get a single record by ID
     */
    getOne: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetOneParams
    ): Promise<GetOneResult<RecordType>> => {
      const { id, signal } = params
      const collection = getCollectionName(resource)

      const url = buildUrl(collection, String(id))
      const fetchOptions: MongoRequestOptions = {}
      if (signal) fetchOptions.signal = signal

      const response = await doFetch<MongoRecordResponse<RecordType>>(url, fetchOptions)

      return {
        data: normalizeRecord(response.data),
      }
    },

    /**
     * Get multiple records by IDs
     */
    getMany: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetManyParams
    ): Promise<GetManyResult<RecordType>> => {
      const { ids, signal } = params
      const collection = getCollectionName(resource)

      const query = {
        action: 'find',
        filter: { _id: { $in: ids } },
      }

      const url = buildUrl(collection)
      const fetchOptions: MongoRequestOptions = { method: 'POST', body: query }
      if (signal) fetchOptions.signal = signal

      const response = await doFetch<MongoListResponse<RecordType>>(url, fetchOptions)

      return {
        data: response.data.map(normalizeRecord),
      }
    },

    /**
     * Get records by reference (foreign key relationship)
     */
    getManyReference: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetManyReferenceParams
    ): Promise<GetManyReferenceResult<RecordType>> => {
      const { target, id, pagination, sort, filter, signal } = params
      const collection = getCollectionName(resource)

      const mongoFilter = {
        ...convertFilter(filter),
        [target]: id,
      }
      const mongoSort = convertSort(
        sort.field || defaultSortField,
        sort.order || defaultSortOrder
      )

      const query = {
        action: 'find',
        filter: mongoFilter,
        sort: mongoSort,
        skip: (pagination.page - 1) * pagination.perPage,
        limit: pagination.perPage,
      }

      const url = buildUrl(collection)
      const fetchOptions: MongoRequestOptions = { method: 'POST', body: query }
      if (signal) fetchOptions.signal = signal

      const response = await doFetch<MongoListResponse<RecordType>>(url, fetchOptions)

      const result: GetManyReferenceResult<RecordType> = {
        data: response.data.map(normalizeRecord),
        total: response.total,
      }

      if (response.pageInfo) {
        result.pageInfo = response.pageInfo
      }

      return result
    },

    /**
     * Create a new record
     */
    create: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: CreateParams<TVariables>
    ): Promise<CreateResult<RecordType>> => {
      const { data, signal } = params
      const collection = getCollectionName(resource)

      const url = buildUrl(collection)
      const fetchOptions: MongoRequestOptions = {
        method: 'POST',
        body: { action: 'insertOne', document: data },
      }
      if (signal) fetchOptions.signal = signal

      const response = await doFetch<MongoWriteResponse<RecordType>>(url, fetchOptions)

      return {
        data: normalizeRecord(response.data),
      }
    },

    /**
     * Update an existing record
     */
    update: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: UpdateParams<TVariables>
    ): Promise<UpdateResult<RecordType>> => {
      const { id, data, signal } = params
      const collection = getCollectionName(resource)

      // Remove id from data to avoid updating the _id field
      const updateData = { ...(data as Record<string, unknown>) }
      delete updateData.id
      delete updateData._id

      const url = buildUrl(collection, String(id))
      const fetchOptions: MongoRequestOptions = {
        method: 'PUT',
        body: { $set: updateData },
      }
      if (signal) fetchOptions.signal = signal

      const response = await doFetch<MongoWriteResponse<RecordType>>(url, fetchOptions)

      return {
        data: normalizeRecord(response.data),
      }
    },

    /**
     * Update multiple records at once
     */
    updateMany: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: UpdateManyParams<TVariables>
    ): Promise<UpdateManyResult<RecordType>> => {
      const { ids, data, signal } = params
      const collection = getCollectionName(resource)

      const url = buildUrl(collection)
      const fetchOptions: MongoRequestOptions = {
        method: 'POST',
        body: {
          action: 'updateMany',
          filter: { _id: { $in: ids } },
          update: { $set: data },
        },
      }
      if (signal) fetchOptions.signal = signal

      const response = await doFetch<MongoBatchResponse>(url, fetchOptions)

      return {
        data: response.data,
      }
    },

    /**
     * Delete a single record
     */
    delete: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>> => {
      const { id, previousData, signal } = params
      const collection = getCollectionName(resource)

      const url = buildUrl(collection, String(id))
      const fetchOptions: MongoRequestOptions = { method: 'DELETE' }
      if (signal) fetchOptions.signal = signal

      await doFetch(url, fetchOptions)

      const result: DeleteResult<RecordType> = {}
      if (previousData !== undefined) {
        result.data = previousData
      }

      return result
    },

    /**
     * Delete multiple records at once
     */
    deleteMany: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: DeleteManyParams
    ): Promise<DeleteManyResult<RecordType>> => {
      const { ids, signal } = params
      const collection = getCollectionName(resource)

      const url = buildUrl(collection)
      const fetchOptions: MongoRequestOptions = {
        method: 'POST',
        body: {
          action: 'deleteMany',
          filter: { _id: { $in: ids } },
        },
      }
      if (signal) fetchOptions.signal = signal

      await doFetch(url, fetchOptions)

      return {
        data: ids,
      }
    },
  }

  return dataProvider
}

/**
 * Normalize a MongoDB record to react-admin format
 *
 * Converts MongoDB's _id field to id for react-admin compatibility
 */
function normalizeRecord<T extends RaRecord>(record: T): T {
  if (!record) return record

  const normalized = { ...record }

  // Convert _id to id if present
  if ('_id' in normalized && !('id' in normalized)) {
    ;(normalized as RaRecord).id = (normalized as Record<string, unknown>)._id as string | number
  }

  return normalized
}
