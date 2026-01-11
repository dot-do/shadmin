/**
 * DataProvider for @dotdo/react integration
 *
 * Creates a react-admin compatible DataProvider that uses the DO client
 * from ShadminDOProvider via WebSocket/RPC instead of HTTP.
 *
 * @module dotdo-react/data-provider
 *
 * @example
 * ```tsx
 * import { ShadminDOProvider, createDotdoDataProvider, useShadminDO } from 'shadmin/dotdo-react'
 *
 * function App() {
 *   return (
 *     <ShadminDOProvider baseUrl="https://api.your-app.do">
 *       <AdminWithDataProvider />
 *     </ShadminDOProvider>
 *   )
 * }
 *
 * function AdminWithDataProvider() {
 *   const { client, getResourceName } = useShadminDO()
 *   const dataProvider = useMemo(
 *     () => createDotdoDataProvider({ client, getResourceName }),
 *     [client, getResourceName]
 *   )
 *
 *   return (
 *     <Admin dataProvider={dataProvider}>
 *       <Resource name="users" />
 *     </Admin>
 *   )
 * }
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
  Identifier,
} from '../facade'

import type {
  DOClientProxy,
  DOListResult,
  DORecordResult,
  DOBatchResult,
  DOListParams,
  DOGetParams,
  DOGetManyParams,
  DOCreateParams,
  DOUpdateParams,
  DOUpdateManyParams,
  DODeleteParams,
  DODeleteManyParams,
} from './types'

/**
 * Configuration for createDotdoDataProvider
 */
export interface DotdoDataProviderConfig {
  /**
   * The DO client proxy from ShadminDOContext
   * Provides RPC methods for data operations
   */
  client: DOClientProxy

  /**
   * Function to resolve actual resource names
   * Maps shadmin resource names to DO collection names
   */
  getResourceName: (resource: string) => string
}

/**
 * Options for the DataProvider factory
 */
export interface DotdoDataProviderOptions {
  /**
   * Additional resource name mappings (optional override)
   * @example { 'users': 'user-profiles' }
   */
  resourceMapping?: Record<string, string>
}

/**
 * Creates a DataProvider that uses the @dotdo/client WebSocket connection
 *
 * This DataProvider calls methods on the DO client proxy, which communicates
 * with Durable Objects via WebSocket RPC instead of HTTP fetch.
 *
 * @param config - Configuration with client proxy and resource resolver
 * @param options - Optional additional configuration
 * @returns A DataProvider compatible with react-admin/shadmin
 *
 * @example Basic usage with ShadminDOProvider
 * ```tsx
 * function MyAdmin() {
 *   const { client, getResourceName } = useShadminDO()
 *
 *   const dataProvider = useMemo(
 *     () => createDotdoDataProvider({ client, getResourceName }),
 *     [client, getResourceName]
 *   )
 *
 *   return <Admin dataProvider={dataProvider}>...</Admin>
 * }
 * ```
 *
 * @example With resource mapping override
 * ```tsx
 * const dataProvider = createDotdoDataProvider(
 *   { client, getResourceName },
 *   { resourceMapping: { 'users': 'team-members' } }
 * )
 * ```
 */
export function createDotdoDataProvider(
  config: DotdoDataProviderConfig,
  options: DotdoDataProviderOptions = {}
): DataProvider {
  const { client, getResourceName: baseGetResourceName } = config
  const { resourceMapping = {} } = options

  /**
   * Get the actual resource name, with optional local override
   */
  const getResourceName = (resource: string): string => {
    // Local mapping takes precedence
    if (resourceMapping[resource]) {
      return resourceMapping[resource]
    }
    // Fall back to provider-level mapping
    return baseGetResourceName(resource)
  }

  /**
   * The DataProvider implementation
   */
  const dataProvider: DataProvider = {
    /**
     * Get a list of records
     *
     * Calls client.list(resource, params) via WebSocket RPC
     */
    getList: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetListParams
    ): Promise<GetListResult<RecordType>> => {
      const { pagination, sort, filter, meta } = params
      const resourceName = getResourceName(resource)

      const listParams: DOListParams = {
        pagination: {
          page: pagination.page,
          perPage: pagination.perPage,
        },
        sort: {
          field: sort.field,
          order: sort.order,
        },
        filter,
      }
      if (meta !== undefined) {
        listParams.meta = meta
      }

      const result = (await client.list(resourceName, listParams)) as DOListResult<RecordType>

      const response: GetListResult<RecordType> = {
        data: result.data,
        total: result.total,
      }

      if (result.pageInfo) {
        const pageInfo: { hasNextPage?: boolean; hasPreviousPage?: boolean } = {}
        if (result.pageInfo.hasNextPage !== undefined) {
          pageInfo.hasNextPage = result.pageInfo.hasNextPage
        }
        if (result.pageInfo.hasPreviousPage !== undefined) {
          pageInfo.hasPreviousPage = result.pageInfo.hasPreviousPage
        }
        response.pageInfo = pageInfo
      }

      return response
    },

    /**
     * Get a single record by ID
     *
     * Calls client.get(resource, id) via WebSocket RPC
     */
    getOne: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetOneParams
    ): Promise<GetOneResult<RecordType>> => {
      const { id, meta } = params
      const resourceName = getResourceName(resource)

      const getParams: DOGetParams = { id }
      if (meta !== undefined) {
        getParams.meta = meta
      }

      const result = (await client.get(resourceName, getParams)) as DORecordResult<RecordType>

      return {
        data: result.data,
      }
    },

    /**
     * Get multiple records by IDs
     *
     * Calls client.getMany(resource, ids) via WebSocket RPC
     */
    getMany: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetManyParams
    ): Promise<GetManyResult<RecordType>> => {
      const { ids, meta } = params
      const resourceName = getResourceName(resource)

      const getManyParams: DOGetManyParams = { ids }
      if (meta !== undefined) {
        getManyParams.meta = meta
      }

      const result = (await client.getMany(resourceName, getManyParams)) as DOListResult<RecordType>

      return {
        data: result.data,
      }
    },

    /**
     * Get records by reference (foreign key relationship)
     *
     * Calls client.list(resource, params) with target filter
     */
    getManyReference: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetManyReferenceParams
    ): Promise<GetManyReferenceResult<RecordType>> => {
      const { target, id, pagination, sort, filter, meta } = params
      const resourceName = getResourceName(resource)

      // Add the reference filter
      const referenceFilter = {
        ...filter,
        [target]: id,
      }

      const listParams: DOListParams = {
        pagination: {
          page: pagination.page,
          perPage: pagination.perPage,
        },
        sort: {
          field: sort.field,
          order: sort.order,
        },
        filter: referenceFilter,
      }
      if (meta !== undefined) {
        listParams.meta = meta
      }

      const result = (await client.list(resourceName, listParams)) as DOListResult<RecordType>

      const response: GetManyReferenceResult<RecordType> = {
        data: result.data,
        total: result.total,
      }

      if (result.pageInfo) {
        const pageInfo: { hasNextPage?: boolean; hasPreviousPage?: boolean } = {}
        if (result.pageInfo.hasNextPage !== undefined) {
          pageInfo.hasNextPage = result.pageInfo.hasNextPage
        }
        if (result.pageInfo.hasPreviousPage !== undefined) {
          pageInfo.hasPreviousPage = result.pageInfo.hasPreviousPage
        }
        response.pageInfo = pageInfo
      }

      return response
    },

    /**
     * Create a new record
     *
     * Calls client.create(resource, data) via WebSocket RPC
     */
    create: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: CreateParams<TVariables>
    ): Promise<CreateResult<RecordType>> => {
      const { data, meta } = params
      const resourceName = getResourceName(resource)

      const createParams: DOCreateParams<TVariables> = { data }
      if (meta !== undefined) {
        createParams.meta = meta
      }

      const result = (await client.create(resourceName, createParams)) as DORecordResult<RecordType>

      return {
        data: result.data,
      }
    },

    /**
     * Update an existing record
     *
     * Calls client.update(resource, id, data) via WebSocket RPC
     */
    update: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: UpdateParams<TVariables>
    ): Promise<UpdateResult<RecordType>> => {
      const { id, data, previousData, meta } = params
      const resourceName = getResourceName(resource)

      const updateParams: DOUpdateParams<TVariables> = { id, data }
      if (previousData !== undefined) {
        updateParams.previousData = previousData
      }
      if (meta !== undefined) {
        updateParams.meta = meta
      }

      const result = (await client.update(resourceName, updateParams)) as DORecordResult<RecordType>

      return {
        data: result.data,
      }
    },

    /**
     * Update multiple records at once
     *
     * Calls client.updateMany(resource, ids, data) via WebSocket RPC
     */
    updateMany: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: UpdateManyParams<TVariables>
    ): Promise<UpdateManyResult<RecordType>> => {
      const { ids, data, meta } = params
      const resourceName = getResourceName(resource)

      const updateManyParams: DOUpdateManyParams<TVariables> = { ids, data }
      if (meta !== undefined) {
        updateManyParams.meta = meta
      }

      const result = (await client.updateMany(resourceName, updateManyParams)) as DOBatchResult

      return {
        data: result.data,
      }
    },

    /**
     * Delete a single record
     *
     * Calls client.delete(resource, id) via WebSocket RPC
     */
    delete: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>> => {
      const { id, previousData, meta } = params
      const resourceName = getResourceName(resource)

      const deleteParams: DODeleteParams = { id }
      if (meta !== undefined) {
        deleteParams.meta = meta
      }

      await client.delete(resourceName, deleteParams)

      const result: DeleteResult<RecordType> = {}
      if (previousData !== undefined) {
        result.data = previousData
      }

      return result
    },

    /**
     * Delete multiple records at once
     *
     * Calls client.deleteMany(resource, ids) via WebSocket RPC
     */
    deleteMany: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: DeleteManyParams
    ): Promise<DeleteManyResult<RecordType>> => {
      const { ids, meta } = params
      const resourceName = getResourceName(resource)

      const deleteManyParams: DODeleteManyParams = { ids }
      if (meta !== undefined) {
        deleteManyParams.meta = meta
      }

      await client.deleteMany(resourceName, deleteManyParams)

      return {
        data: ids as Identifier[],
      }
    },
  }

  return dataProvider
}

/**
 * Type guard to check if a DataProvider was created by createDotdoDataProvider
 *
 * Note: This is a basic check and may not be fully accurate
 * since the DataProvider interface is the same as any other implementation.
 */
export function isDotdoDataProvider(provider: DataProvider): boolean {
  // All DataProviders have the same interface, so we can only
  // check if it's a valid DataProvider
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
