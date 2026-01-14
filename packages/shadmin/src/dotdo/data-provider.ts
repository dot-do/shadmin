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
import type { DOConfig, DBOptions, DOListResponse, DORecordResponse, DOBatchResponse, DORequestOptions, DOErrorResponse } from './types'

/**
 * Custom error class for dotdo data operation errors
 *
 * Includes structured error information from the dotdo API response
 * to enable proper error handling in the UI.
 */
export class DODataError extends Error {
  /** Error code from dotdo API (e.g., 'NOT_FOUND', 'VALIDATION_ERROR') */
  public readonly code: string
  /** HTTP status code */
  public readonly status: number | undefined
  /** Additional error details from the API */
  public readonly details: Record<string, unknown> | undefined
  /** The resource that was being accessed */
  public readonly resource: string | undefined

  constructor(
    message: string,
    code: string,
    status?: number,
    details?: Record<string, unknown>,
    resource?: string
  ) {
    super(message)
    this.name = 'DODataError'
    this.code = code
    this.status = status
    this.details = details
    this.resource = resource
  }
}

/**
 * Configuration for retry behavior
 */
interface RetryConfig {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
}

/**
 * Sleep for a specified duration
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Calculate exponential backoff delay with jitter
 *
 * Jitter helps prevent thundering herd problems when multiple
 * clients retry simultaneously.
 */
const getBackoffDelay = (attempt: number, config: RetryConfig): number => {
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt)
  const jitter = Math.random() * 0.3 * exponentialDelay // Add up to 30% jitter
  return Math.min(exponentialDelay + jitter, config.maxDelayMs)
}

/**
 * Check if an error is retryable (network errors, 5xx server errors)
 *
 * Non-retryable errors include:
 * - 4xx client errors (bad request, not found, validation errors)
 * - Authentication errors (handled separately)
 */
const isRetryableError = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    // Network errors like "Failed to fetch"
    return true
  }
  if (error instanceof DODataError) {
    // Retry 5xx server errors, but not 4xx client errors
    return error.status !== undefined && error.status >= 500
  }
  return false
}

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
     * Make a single fetch request to the dotdo API
     *
     * @param url - The full URL to fetch
     * @param options - Request options
     * @param resource - Optional resource name for error context
     * @returns The parsed JSON response
     * @throws {DODataError} When the API returns an error
     */
    const doFetchOnce = async <T>(
      url: string,
      options: DORequestOptions = {},
      resource?: string
    ): Promise<T> => {
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
          // Parse dotdo error response format
          const errorData = (await response.json().catch(() => ({} as DOErrorResponse))) as DOErrorResponse
          const errorMessage = errorData.error?.message ?? `HTTP ${response.status}: ${response.statusText}`
          const errorCode = errorData.error?.code ?? `HTTP_${response.status}`
          throw new DODataError(errorMessage, errorCode, response.status, errorData.error?.details, resource)
        }

        // Handle 204 No Content (for DELETE operations)
        if (response.status === 204) {
          return {} as T
        }

        return response.json()
      } catch (error) {
        clearTimeout(timeoutId)
        // Re-wrap non-DODataError fetch errors for consistency
        if (error instanceof DODataError) {
          throw error
        }
        if (error instanceof Error) {
          throw new DODataError(error.message, 'NETWORK_ERROR', undefined, undefined, resource)
        }
        throw new DODataError('Unknown error occurred', 'UNKNOWN_ERROR', undefined, undefined, resource)
      }
    }

    /**
     * Make a fetch request to the dotdo API with retry logic
     *
     * Implements exponential backoff with jitter for transient failures.
     * Retries on network errors and 5xx server errors.
     *
     * @param url - The full URL to fetch
     * @param options - Request options
     * @param resource - Optional resource name for error context
     * @param retryConfig - Optional retry configuration
     * @returns The parsed JSON response
     * @throws {DODataError} When all retries are exhausted or on non-retryable errors
     */
    const doFetch = async <T>(
      url: string,
      options: DORequestOptions = {},
      resource?: string,
      retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
    ): Promise<T> => {
      let lastError: Error | undefined

      for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
        try {
          return await doFetchOnce<T>(url, options, resource)
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error))

          // Don't retry if this was the last attempt or error is not retryable
          if (attempt === retryConfig.maxRetries || !isRetryableError(error)) {
            throw error
          }

          // Wait before retrying with exponential backoff
          const delay = getBackoffDelay(attempt, retryConfig)
          await sleep(delay)
        }
      }

      // This should never be reached due to the throw in the loop, but TypeScript needs it
      throw lastError ?? new DODataError('All retries exhausted', 'RETRY_EXHAUSTED', undefined, undefined, resource)
    }

    /**
     * The DataProvider implementation
     *
     * Implements the react-admin DataProvider interface using dotdo HTTP API.
     * All methods support AbortSignal for request cancellation.
     */
    const dataProvider: DataProvider = {
      /**
       * Fetch a paginated list of records with sorting and filtering
       *
       * Sends GET request to /{resource}?_page=N&_perPage=N&_sortField=X&_sortOrder=Y&...filters
       *
       * @param resource - The resource name (e.g., 'users', 'posts')
       * @param params - Pagination, sorting, and filter parameters
       * @returns Paginated list of records with total count
       * @throws {DODataError} When the API returns an error
       *
       * @example
       * ```ts
       * const { data, total } = await dataProvider.getList('users', {
       *   pagination: { page: 1, perPage: 25 },
       *   sort: { field: 'createdAt', order: 'DESC' },
       *   filter: { role: 'admin' }
       * })
       * ```
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

        const url = buildUrl(resource, undefined, query)
        const fetchOptions: DORequestOptions = {}
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DOListResponse<RecordType>>(url, fetchOptions, resource)

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
       * Fetch a single record by its ID
       *
       * Sends GET request to /{resource}/{id}
       *
       * @param resource - The resource name
       * @param params - Object containing the record ID
       * @returns The requested record
       * @throws {DODataError} When record is not found (404) or other API errors
       *
       * @example
       * ```ts
       * const { data } = await dataProvider.getOne('users', { id: '123' })
       * ```
       */
      getOne: async <RecordType extends RaRecord = RaRecord>(
        resource: string,
        params: GetOneParams
      ): Promise<GetOneResult<RecordType>> => {
        const { id, signal } = params

        const url = buildUrl(resource, String(id))
        const fetchOptions: DORequestOptions = {}
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DORecordResponse<RecordType>>(url, fetchOptions, resource)

        return {
          data: response.data,
        }
      },

      /**
       * Fetch multiple records by their IDs in a single request
       *
       * Sends GET request to /{resource}?ids=1,2,3
       * Useful for resolving references without N+1 queries.
       *
       * @param resource - The resource name
       * @param params - Object containing array of IDs to fetch
       * @returns Array of requested records
       * @throws {DODataError} When the API returns an error
       *
       * @example
       * ```ts
       * const { data } = await dataProvider.getMany('users', { ids: ['1', '2', '3'] })
       * ```
       */
      getMany: async <RecordType extends RaRecord = RaRecord>(
        resource: string,
        params: GetManyParams
      ): Promise<GetManyResult<RecordType>> => {
        const { ids, signal } = params

        const url = buildUrl(resource, undefined, { ids: ids.join(',') })
        const fetchOptions: DORequestOptions = {}
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DOListResponse<RecordType>>(url, fetchOptions, resource)

        return {
          data: response.data,
        }
      },

      /**
       * Fetch records by foreign key reference with pagination
       *
       * Sends GET request to /{resource}?{target}={id}&_page=N&...
       * Used for displaying related records (e.g., comments for a post).
       *
       * @param resource - The resource name to fetch
       * @param params - Target field, reference ID, and pagination params
       * @returns Paginated list of related records
       * @throws {DODataError} When the API returns an error
       *
       * @example
       * ```ts
       * // Get comments for post #123
       * const { data, total } = await dataProvider.getManyReference('comments', {
       *   target: 'postId',
       *   id: '123',
       *   pagination: { page: 1, perPage: 10 },
       *   sort: { field: 'createdAt', order: 'DESC' },
       *   filter: {}
       * })
       * ```
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

        const url = buildUrl(resource, undefined, query)
        const fetchOptions: DORequestOptions = {}
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DOListResponse<RecordType>>(url, fetchOptions, resource)

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
       *
       * Sends POST request to /{resource} with the record data in the body.
       *
       * @param resource - The resource name
       * @param params - Object containing the data for the new record
       * @returns The created record with server-generated fields (id, timestamps)
       * @throws {DODataError} When validation fails or other API errors
       *
       * @example
       * ```ts
       * const { data } = await dataProvider.create('users', {
       *   data: { email: 'new@example.com', name: 'New User' }
       * })
       * ```
       */
      create: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
        resource: string,
        params: CreateParams<TVariables>
      ): Promise<CreateResult<RecordType>> => {
        const { data, signal } = params

        const url = buildUrl(resource)
        const fetchOptions: DORequestOptions = { method: 'POST', body: data }
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DORecordResponse<RecordType>>(url, fetchOptions, resource)

        return {
          data: response.data,
        }
      },

      /**
       * Update an existing record (full replacement)
       *
       * Sends PUT request to /{resource}/{id} with the complete record data.
       * Uses PUT for full replacement semantics.
       *
       * @param resource - The resource name
       * @param params - Object containing record ID and updated data
       * @returns The updated record
       * @throws {DODataError} When record not found, validation fails, or other errors
       *
       * @example
       * ```ts
       * const { data } = await dataProvider.update('users', {
       *   id: '123',
       *   data: { email: 'updated@example.com', name: 'Updated Name' },
       *   previousData: { id: '123', email: 'old@example.com', name: 'Old Name' }
       * })
       * ```
       */
      update: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
        resource: string,
        params: UpdateParams<TVariables>
      ): Promise<UpdateResult<RecordType>> => {
        const { id, data, signal } = params

        const url = buildUrl(resource, String(id))
        const fetchOptions: DORequestOptions = { method: 'PUT', body: data }
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DORecordResponse<RecordType>>(url, fetchOptions, resource)

        return {
          data: response.data,
        }
      },

      /**
       * Update multiple records at once with the same data
       *
       * Sends PUT request to /{resource}?ids=1,2,3 with shared update data.
       * Useful for bulk operations like "mark all as read".
       *
       * @param resource - The resource name
       * @param params - Object containing array of IDs and shared update data
       * @returns Array of updated record IDs
       * @throws {DODataError} When the API returns an error
       *
       * @example
       * ```ts
       * const { data } = await dataProvider.updateMany('notifications', {
       *   ids: ['1', '2', '3'],
       *   data: { read: true }
       * })
       * ```
       */
      updateMany: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
        resource: string,
        params: UpdateManyParams<TVariables>
      ): Promise<UpdateManyResult<RecordType>> => {
        const { ids, data, signal } = params

        const url = buildUrl(resource, undefined, { ids: ids.join(',') })
        const fetchOptions: DORequestOptions = { method: 'PUT', body: data }
        if (signal) fetchOptions.signal = signal
        const response = await doFetch<DOBatchResponse>(url, fetchOptions, resource)

        return {
          data: response.data,
        }
      },

      /**
       * Delete a single record
       *
       * Sends DELETE request to /{resource}/{id}.
       * Returns the previousData if provided (for optimistic updates/undo).
       *
       * @param resource - The resource name
       * @param params - Object containing record ID and optional previousData
       * @returns The deleted record data (if previousData was provided)
       * @throws {DODataError} When record not found or other API errors
       *
       * @example
       * ```ts
       * const { data } = await dataProvider.delete('users', {
       *   id: '123',
       *   previousData: { id: '123', email: 'user@example.com' }
       * })
       * ```
       */
      delete: async <RecordType extends RaRecord = RaRecord>(
        resource: string,
        params: DeleteParams<RecordType>
      ): Promise<DeleteResult<RecordType>> => {
        const { id, previousData, signal } = params

        const url = buildUrl(resource, String(id))
        const fetchOptions: DORequestOptions = { method: 'DELETE' }
        if (signal) fetchOptions.signal = signal
        await doFetch(url, fetchOptions, resource)

        const result: DeleteResult<RecordType> = {}
        if (previousData !== undefined) {
          result.data = previousData
        }
        return result
      },

      /**
       * Delete multiple records at once
       *
       * Sends DELETE request to /{resource}?ids=1,2,3
       * Useful for bulk delete operations.
       *
       * @param resource - The resource name
       * @param params - Object containing array of IDs to delete
       * @returns Array of deleted record IDs
       * @throws {DODataError} When the API returns an error
       *
       * @example
       * ```ts
       * const { data } = await dataProvider.deleteMany('users', {
       *   ids: ['1', '2', '3']
       * })
       * ```
       */
      deleteMany: async <RecordType extends RaRecord = RaRecord>(
        resource: string,
        params: DeleteManyParams
      ): Promise<DeleteManyResult<RecordType>> => {
        const { ids, signal } = params

        const url = buildUrl(resource, undefined, { ids: ids.join(',') })
        const fetchOptions: DORequestOptions = { method: 'DELETE' }
        if (signal) fetchOptions.signal = signal
        await doFetch(url, fetchOptions, resource)

        return {
          data: ids,
        }
      },
    }

    return dataProvider
  }
}

