/**
 * Type definitions for mongo.do integration
 *
 * These types define the configuration and response shapes
 * for communicating with mongo.do edge database.
 *
 * @module mongo/types
 */

import type { Identifier, RaRecord } from '../facade'

/**
 * Configuration options for createMongoDataProvider
 */
export interface MongoConfig {
  /**
   * Base URL for the mongo.do API endpoint
   * @example 'https://your-database.mongo.do'
   */
  baseUrl: string

  /**
   * Optional database name (if not included in baseUrl)
   * @example 'my-database'
   */
  database?: string

  /**
   * Optional API key for authentication
   */
  apiKey?: string

  /**
   * Optional custom headers to include with every request
   */
  headers?: Record<string, string>

  /**
   * Optional request credentials mode
   * @default 'include'
   */
  credentials?: RequestCredentials

  /**
   * Optional timeout in milliseconds
   * @default 30000
   */
  timeout?: number
}

/**
 * Options for the DataProvider factory
 */
export interface MongoDataProviderOptions {
  /**
   * Optional resource name mappings
   * Maps react-admin resource names to mongo.do collection names
   * @example { 'users': 'user-profiles', 'posts': 'blog-posts' }
   */
  resourceMapping?: Record<string, string>

  /**
   * Optional custom headers for data requests
   */
  headers?: Record<string, string>

  /**
   * Default sort field when none specified
   * @default '_id'
   */
  defaultSortField?: string

  /**
   * Default sort order when none specified
   * @default 'DESC'
   */
  defaultSortOrder?: 'ASC' | 'DESC'
}

/**
 * Standard response format from mongo.do API for list operations
 */
export interface MongoListResponse<T extends RaRecord = RaRecord> {
  data: T[]
  total: number
  pageInfo?: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor?: string
    endCursor?: string
  }
}

/**
 * Standard response format from mongo.do API for single record operations
 */
export interface MongoRecordResponse<T extends RaRecord = RaRecord> {
  data: T
}

/**
 * Standard response format from mongo.do API for batch operations
 */
export interface MongoBatchResponse {
  data: Identifier[]
}

/**
 * Standard response format from mongo.do API for write operations
 */
export interface MongoWriteResponse<T extends RaRecord = RaRecord> {
  data: T
  acknowledged: boolean
  insertedId?: Identifier
  modifiedCount?: number
  deletedCount?: number
}

/**
 * Error response from mongo.do API
 */
export interface MongoErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

/**
 * Request options for fetch calls
 */
export interface MongoRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

/**
 * MongoDB-style filter operators mapping
 * Maps react-admin filter operators to MongoDB operators
 */
export interface MongoFilterOperators {
  /** Greater than */
  _gt: '$gt'
  /** Greater than or equal */
  _gte: '$gte'
  /** Less than */
  _lt: '$lt'
  /** Less than or equal */
  _lte: '$lte'
  /** Not equal */
  _ne: '$ne'
  /** Equal (explicit) */
  _eq: '$eq'
  /** In array */
  _in: '$in'
  /** Not in array */
  _nin: '$nin'
  /** Contains substring (regex-based) */
  _contains: '$regex'
  /** Exists check */
  _exists: '$exists'
}
