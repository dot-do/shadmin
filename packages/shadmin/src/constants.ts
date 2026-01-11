/**
 * Shadmin Constants
 *
 * Centralized configuration defaults for shadmin components and hooks.
 * These values can be overridden via props or configuration.
 *
 * @module constants
 */

/**
 * Default pagination settings for list queries
 */
export const PAGINATION_DEFAULTS = {
  /**
   * Default page number (1-indexed)
   */
  PAGE: 1,
  /**
   * Default number of records per page for list views
   */
  PER_PAGE: 10,
  /**
   * Default number of records per page for reference inputs (autocomplete, select)
   */
  REFERENCE_PER_PAGE: 25,
} as const

/**
 * Default sort configuration for list queries
 */
export const SORT_DEFAULTS = {
  /**
   * Default field to sort by
   */
  FIELD: 'id',
  /**
   * Default sort order
   */
  ORDER: 'ASC' as const,
} as const

/**
 * Default sort payload combining field and order
 */
export const DEFAULT_SORT = {
  field: SORT_DEFAULTS.FIELD,
  order: SORT_DEFAULTS.ORDER,
} as const

/**
 * UI timing defaults (in milliseconds)
 */
export const TIMING_DEFAULTS = {
  /**
   * Debounce delay for URL updates when list params change
   */
  DEBOUNCE_DELAY: 200,
} as const

/**
 * Query client defaults for React Query
 */
export const QUERY_DEFAULTS = {
  /**
   * How long data is considered fresh (5 minutes)
   */
  STALE_TIME: 5 * 60 * 1000,
  /**
   * Number of retry attempts on failure
   */
  RETRY_COUNT: 1,
  /**
   * Whether to refetch when window regains focus
   */
  REFETCH_ON_WINDOW_FOCUS: false,
} as const

/**
 * DO (Durable Objects) client defaults
 */
export const DO_CLIENT_DEFAULTS = {
  /**
   * Request timeout in milliseconds
   */
  TIMEOUT: 30000,
  /**
   * Enable request batching
   */
  BATCHING: true,
  /**
   * Batch window in milliseconds (0 = immediate on microtask)
   */
  BATCH_WINDOW: 0,
  /**
   * Maximum number of requests in a batch
   */
  MAX_BATCH_SIZE: 100,
  /**
   * Maximum number of requests to queue when offline
   */
  OFFLINE_QUEUE_LIMIT: 1000,
  /**
   * Reconnection configuration
   */
  RECONNECT: {
    /**
     * Maximum number of reconnection attempts
     */
    MAX_ATTEMPTS: Infinity,
    /**
     * Base delay between reconnection attempts (ms)
     */
    BASE_DELAY: 1000,
    /**
     * Maximum delay between reconnection attempts (ms)
     */
    MAX_DELAY: 30000,
    /**
     * Random jitter factor for reconnection delay
     */
    JITTER: 0.1,
  },
} as const

/**
 * Configuration interface for overriding pagination defaults
 */
export interface PaginationConfig {
  page?: number
  perPage?: number
}

/**
 * Configuration interface for overriding sort defaults
 */
export interface SortConfig {
  field?: string
  order?: 'ASC' | 'DESC'
}

/**
 * Full configuration interface for list queries
 */
export interface ListQueryConfig extends PaginationConfig, SortConfig {
  filter?: Record<string, unknown>
}
