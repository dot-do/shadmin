/**
 * Type definitions for @dotdo/react integration with shadmin
 *
 * These types define the configuration and interfaces for connecting
 * shadmin components to Durable Objects via the @dotdo/client SDK.
 *
 * @module dotdo-react/types
 */

import type { RaRecord, Identifier } from '../types'

/**
 * Connection state for the DO client
 */
export type ConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'failed'

/**
 * Configuration for the DO client connection
 */
export interface DOClientConfig {
  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number

  /**
   * Enable request batching for efficiency
   * @default true
   */
  batching?: boolean

  /**
   * Batch window in milliseconds
   * @default 0 (immediate on microtask)
   */
  batchWindow?: number

  /**
   * Maximum batch size
   * @default 100
   */
  maxBatchSize?: number

  /**
   * Maximum offline queue size
   * @default 1000
   */
  offlineQueueLimit?: number

  /**
   * Reconnection configuration
   */
  reconnect?: {
    maxAttempts?: number
    baseDelay?: number
    maxDelay?: number
    jitter?: number
  }

  /**
   * Authentication configuration
   */
  auth?: {
    token?: string
  }
}

/**
 * Configuration for the ShadminDOProvider
 */
export interface ShadminDOProviderConfig {
  /**
   * Base URL for the Durable Object API
   * @example 'https://api.your-app.do'
   */
  baseUrl: string

  /**
   * Optional namespace/tenant identifier
   * Used for multi-tenant applications
   */
  namespace?: string

  /**
   * Client configuration options
   */
  client?: DOClientConfig

  /**
   * Resource name mappings
   * Maps shadmin resource names to DO collection names
   * @example { 'users': 'user-profiles' }
   */
  resourceMapping?: Record<string, string>

  /**
   * Enable real-time subscriptions
   * @default true
   */
  realtime?: boolean
}

/**
 * Context value provided by ShadminDOProvider
 */
export interface ShadminDOContextValue {
  /**
   * The DO client instance for RPC calls
   */
  client: DOClientProxy

  /**
   * Current connection state
   */
  connectionState: ConnectionState

  /**
   * Number of queued RPC calls
   */
  queuedCallCount: number

  /**
   * Provider configuration
   */
  config: ShadminDOProviderConfig

  /**
   * Get the actual resource name for a given shadmin resource
   */
  getResourceName: (resource: string) => string

  /**
   * Subscribe to real-time updates for a resource
   */
  subscribe: <T = unknown>(channel: string, callback: (data: T) => void) => SubscriptionHandle

  /**
   * Disconnect the client
   */
  disconnect: () => void
}

/**
 * Handle for managing subscriptions
 */
export interface SubscriptionHandle {
  /**
   * Unsubscribe from the channel
   */
  unsubscribe: () => void
}

/**
 * Proxy interface for the DO client
 * Provides type-safe method calling via Proxy
 */
export interface DOClientProxy {
  /**
   * Call a method on the Durable Object
   */
  [method: string]: (...args: unknown[]) => Promise<unknown>
}

/**
 * List response from DO
 */
export interface DOListResult<T extends RaRecord = RaRecord> {
  data: T[]
  total: number
  pageInfo?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
    startCursor?: string
    endCursor?: string
  }
}

/**
 * Single record response from DO
 */
export interface DORecordResult<T extends RaRecord = RaRecord> {
  data: T
}

/**
 * Batch operation response from DO
 */
export interface DOBatchResult {
  data: Identifier[]
}

/**
 * Parameters for useDOList hook
 */
export interface UseDOListParams {
  /**
   * Page number (1-indexed)
   * @default 1
   */
  page?: number

  /**
   * Number of records per page
   * @default 10
   */
  perPage?: number

  /**
   * Sort field
   * @default 'id'
   */
  sortField?: string

  /**
   * Sort order
   * @default 'ASC'
   */
  sortOrder?: 'ASC' | 'DESC'

  /**
   * Filter criteria
   */
  filter?: Record<string, unknown>

  /**
   * Additional metadata
   */
  meta?: Record<string, unknown>

  /**
   * Enable real-time updates
   * @default false
   */
  realtime?: boolean
}

/**
 * Return type for useDOList hook
 */
export interface UseDOListResult<T extends RaRecord = RaRecord> {
  /**
   * The list of records
   */
  data: T[] | undefined

  /**
   * Total number of records
   */
  total: number | undefined

  /**
   * Pagination info for cursor-based pagination
   */
  pageInfo?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
  }

  /**
   * Whether the initial load is in progress
   */
  isLoading: boolean

  /**
   * Whether a fetch is in progress (including refetches)
   */
  isFetching: boolean

  /**
   * Error if the request failed
   */
  error: Error | null

  /**
   * Refetch the data
   */
  refetch: () => Promise<unknown>

  /**
   * Connection state
   */
  connectionState: ConnectionState
}

/**
 * Parameters for useDOShow hook
 */
export interface UseDOShowParams {
  /**
   * The record ID to fetch
   */
  id: Identifier

  /**
   * Additional metadata
   */
  meta?: Record<string, unknown>

  /**
   * Enable real-time updates
   * @default false
   */
  realtime?: boolean
}

/**
 * Return type for useDOShow hook
 */
export interface UseDOShowResult<T extends RaRecord = RaRecord> {
  /**
   * The record data
   */
  data: T | undefined

  /**
   * Whether the initial load is in progress
   */
  isLoading: boolean

  /**
   * Whether a fetch is in progress (including refetches)
   */
  isFetching: boolean

  /**
   * Error if the request failed
   */
  error: Error | null

  /**
   * Refetch the data
   */
  refetch: () => Promise<unknown>

  /**
   * Connection state
   */
  connectionState: ConnectionState
}

/**
 * Parameters for useDOForm create operation
 */
export interface UseDOFormCreateParams<T = Record<string, unknown>> {
  /**
   * The data to create
   */
  data: T

  /**
   * Additional metadata
   */
  meta?: Record<string, unknown>
}

/**
 * Parameters for useDOForm update operation
 */
export interface UseDOFormUpdateParams<T = Record<string, unknown>> {
  /**
   * The record ID to update
   */
  id: Identifier

  /**
   * The data to update
   */
  data: T

  /**
   * Previous data for optimistic updates
   */
  previousData?: T

  /**
   * Additional metadata
   */
  meta?: Record<string, unknown>
}

/**
 * Options for useDOForm hook
 */
export interface UseDOFormOptions {
  /**
   * Callback on successful mutation
   */
  onSuccess?: (data: unknown) => void

  /**
   * Callback on mutation error
   */
  onError?: (error: Error) => void

  /**
   * Enable optimistic updates
   * @default true
   */
  optimistic?: boolean
}

/**
 * Mutation state for form operations
 */
export interface UseDOFormMutationState<T extends RaRecord = RaRecord> {
  /**
   * The result data
   */
  data: T | undefined

  /**
   * Error if the mutation failed
   */
  error: Error | null

  /**
   * Whether the mutation is in progress
   */
  isLoading: boolean

  /**
   * Whether the mutation is pending
   */
  isPending: boolean

  /**
   * Whether the mutation succeeded
   */
  isSuccess: boolean

  /**
   * Whether the mutation failed
   */
  isError: boolean

  /**
   * Whether the mutation is idle
   */
  isIdle: boolean

  /**
   * Reset the mutation state
   */
  reset: () => void

  /**
   * Field-level validation errors
   */
  fieldErrors: Record<string, string[]> | null

  /**
   * Get errors for a specific field
   */
  getFieldErrors: (field: string) => string[]

  /**
   * Check if a field has errors
   */
  hasFieldError: (field: string) => boolean

  /**
   * Clear all errors
   */
  clearError: () => void

  /**
   * Clear error for a specific field
   */
  clearFieldError: (field: string) => void
}

/**
 * Return type for useDOForm hook
 */
export interface UseDOFormResult<T extends RaRecord = RaRecord, TVariables = Record<string, unknown>> {
  /**
   * Create a new record
   */
  create: (params: UseDOFormCreateParams<TVariables>) => Promise<T>

  /**
   * Update an existing record
   */
  update: (params: UseDOFormUpdateParams<TVariables>) => Promise<T>

  /**
   * Delete a record
   */
  remove: (id: Identifier) => Promise<void>

  /**
   * Mutation state
   */
  state: UseDOFormMutationState<T>

  /**
   * Connection state
   */
  connectionState: ConnectionState
}
