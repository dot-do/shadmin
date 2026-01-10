/**
 * Type definitions for dotdo integration
 *
 * These types define the configuration and response shapes
 * for communicating with dotdo Durable Objects.
 *
 * @module dotdo/types
 */

import type { Identifier, RaRecord } from '../facade'

/**
 * Configuration options for the DO() factory
 */
export interface DOConfig {
  /**
   * Base URL for the dotdo API endpoint
   * @example 'https://api.your-app.do'
   */
  baseUrl: string

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
 * Options for the DataProvider factory (DB)
 */
export interface DBOptions {
  /**
   * Optional resource name mappings
   * Maps react-admin resource names to dotdo collection names
   * @example { 'users': 'user-profiles', 'posts': 'blog-posts' }
   */
  resourceMapping?: Record<string, string>

  /**
   * Optional custom headers for data requests
   */
  headers?: Record<string, string>
}

/**
 * Options for the AuthProvider factory (Auth)
 */
export interface AuthOptions {
  /**
   * Key used to store the auth token in localStorage
   * @default 'dotdo_auth_token'
   */
  tokenKey?: string

  /**
   * Key used to store user identity in localStorage
   * @default 'dotdo_user_identity'
   */
  identityKey?: string

  /**
   * Path to redirect after logout
   * @default '/login'
   */
  logoutRedirectPath?: string

  /**
   * Custom headers for auth requests
   */
  headers?: Record<string, string>
}

/**
 * Standard response format from dotdo API for list operations
 */
export interface DOListResponse<T extends RaRecord = RaRecord> {
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
 * Standard response format from dotdo API for single record operations
 */
export interface DORecordResponse<T extends RaRecord = RaRecord> {
  data: T
}

/**
 * Standard response format from dotdo API for batch operations
 */
export interface DOBatchResponse {
  data: Identifier[]
}

/**
 * Auth token response from dotdo login
 */
export interface DOLoginResponse {
  token: string
  user: DOUserIdentity
  expiresAt?: string
}

/**
 * User identity from dotdo
 */
export interface DOUserIdentity {
  id: Identifier
  email?: string
  fullName?: string
  avatar?: string
  roles?: string[]
  permissions?: string[]
  [key: string]: unknown
}

/**
 * Error response from dotdo API
 */
export interface DOErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

/**
 * Request options for fetch calls
 */
export interface DORequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

/**
 * Result from the DO() factory function
 */
export interface DOResult {
  /**
   * Creates a DataProvider for react-admin
   * @param options Optional configuration
   */
  DB: (options?: DBOptions) => import('../facade').DataProvider

  /**
   * Creates an AuthProvider for react-admin
   * @param options Optional configuration
   */
  Auth: (options?: AuthOptions) => import('../facade').AuthProvider
}
