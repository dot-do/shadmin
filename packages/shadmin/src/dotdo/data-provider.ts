/**
 * DataProvider for dotdo Durable Objects
 *
 * Creates a react-admin compatible DataProvider that communicates
 * with dotdo Durable Objects via HTTP API.
 *
 * @module dotdo/data-provider
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

import type { DOConfig, DBOptions, DOListResponse, DORecordResponse, DOBatchResponse, DORequestOptions } from './types'

/**
 * Creates a DataProvider factory bound to a dotdo API endpoint
 *
 * @param config - DOConfig with baseUrl and optional settings
 * @returns A function that creates DataProvider instances
 *
 * @example
 * ```tsx
 * const createDB = createDataProviderFactory({
 *   baseUrl: 'https://api.your-app.do'
 * })
 *
 * const dataProvider = createDB({
 *   resourceMapping: { 'users': 'user-profiles' }
 * })
 * ```
 */
export function createDataProviderFactory(config: DOConfig): (options?: DBOptions) => DataProvider {
  return (options?: DBOptions): DataProvider => {
    const { baseUrl, headers: configHeaders = {}, credentials = 'include', timeout = 30000 } = config
    const { resourceMapping = {}, headers: optionHeaders = {} } = options ?? {}

    /**
     * Get the actual resource name for dotdo API
     */
    const getResourceName = (resource: string): string => {
      return resourceMapping[resource] ?? resource
    }

    /**
     * Build the API URL for a resource
     */
    const buildUrl = (resource: string, id?: string | number, query?: Record<string, unknown>): string => {
      const resourceName = getResourceName(resource)
      let url = `${baseUrl}/${resourceName}`

      if (id !== undefined) {
        url += `/${id}`
      }

      if (query && Object.keys(query).length > 0) {
        const params = new URLSearchParams()
        for (const [key, value] of Object.entries(query)) {
          if (value !== undefined && value !== null) {
            params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
          }
        }
        url += `?${params.toString()}`
      }

      return url
    }

    /**
     * Get auth token from localStorage if available
     */
    const getAuthToken = (): string | null => {
      if (typeof window === 'undefined') return null
      return localStorage.getItem('dotdo_auth_token')
    }

    /**
     * Make a fetch request to the dotdo API
     */
    const doFetch = async <T>(url: string, options: DORequestOptions = {}): Promise<T> => {
      const { method = 'GET', body, headers: requestHeaders = {}, signal } = options

      const token = getAuthToken()
      const allHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...configHeaders,
        ...optionHeaders,
        ...requestHeaders,
      }

      if (token) {
        allHeaders['Authorization'] = `Bearer ${token}`
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
          // TODO: Parse dotdo error response and throw appropriate error
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error?.message ?? `HTTP ${response.status}: ${response.statusText}`)
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
       * Get a list of records
       */
      getList: async <RecordType extends RaRecord = RaRecord>(
        resource: string,
        params: GetListParams
      ): Promise<GetListResult<RecordType>> => {
        const { pagination, sort, filter, signal } = params

        const query: Record<string, unknown> = {
          _page: pagination.page,
          _perPage: pagination.perPage,
          _sortField: sort.field,
          _sortOrder: sort.order,
          ...filter,
        }

        // TODO: Implement actual dotdo list API call
        // The query params format should match dotdo's expected format
        const url = buildUrl(resource, undefined, query)
        const fetchOptions: DORequestOptions = {}
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DOListResponse<RecordType>>(url, fetchOptions)

        const result: GetListResult<RecordType> = {
          data: response.data,
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

        // TODO: Implement actual dotdo single record API call
        const url = buildUrl(resource, String(id))
        const fetchOptions: DORequestOptions = {}
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DORecordResponse<RecordType>>(url, fetchOptions)

        return {
          data: response.data,
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

        // TODO: Implement actual dotdo batch get API call
        // Some APIs support ?ids=1,2,3, others need multiple requests
        const url = buildUrl(resource, undefined, { ids: ids.join(',') })
        const fetchOptions: DORequestOptions = {}
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DOListResponse<RecordType>>(url, fetchOptions)

        return {
          data: response.data,
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

        const query: Record<string, unknown> = {
          [target]: id,
          _page: pagination.page,
          _perPage: pagination.perPage,
          _sortField: sort.field,
          _sortOrder: sort.order,
          ...filter,
        }

        // TODO: Implement actual dotdo reference query API call
        const url = buildUrl(resource, undefined, query)
        const fetchOptions: DORequestOptions = {}
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DOListResponse<RecordType>>(url, fetchOptions)

        const result: GetManyReferenceResult<RecordType> = {
          data: response.data,
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

        // TODO: Implement actual dotdo create API call
        const url = buildUrl(resource)
        const fetchOptions: DORequestOptions = { method: 'POST', body: data }
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DORecordResponse<RecordType>>(url, fetchOptions)

        return {
          data: response.data,
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

        // TODO: Implement actual dotdo update API call
        // Consider whether to use PUT (full replace) or PATCH (partial update)
        const url = buildUrl(resource, String(id))
        const fetchOptions: DORequestOptions = { method: 'PUT', body: data }
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DORecordResponse<RecordType>>(url, fetchOptions)

        return {
          data: response.data,
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

        // TODO: Implement actual dotdo batch update API call
        // This could be a single batch endpoint or multiple individual calls
        const url = buildUrl(resource, undefined, { ids: ids.join(',') })
        const fetchOptions: DORequestOptions = { method: 'PUT', body: data }
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DOBatchResponse>(url, fetchOptions)

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

        // TODO: Implement actual dotdo delete API call
        const url = buildUrl(resource, String(id))
        const fetchOptions: DORequestOptions = { method: 'DELETE' }
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

        // TODO: Implement actual dotdo batch delete API call
        // This could be a single batch endpoint or multiple individual calls
        const url = buildUrl(resource, undefined, { ids: ids.join(',') })
        const fetchOptions: DORequestOptions = { method: 'DELETE' }
        if (signal) fetchOptions.signal = signal
        await doFetch(url, fetchOptions)

        return {
          data: ids,
        }
      },
    }

    return dataProvider
  }
}
