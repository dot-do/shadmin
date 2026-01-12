/**
 * Logging abstraction for shadmin
 *
 * Provides consistent logging with [shadmin] prefix and environment-aware behavior:
 * - debug/warn: Only logged in development mode
 * - error: Always logged (production and development)
 *
 * Includes extension point for error tracking integration (Sentry, etc.)
 *
 * @example
 * ```ts
 * import { logger } from 'shadmin'
 *
 * logger.debug('Cache invalidated for', resource)
 * logger.warn('Deprecated API usage detected')
 * logger.error('Failed to fetch', error)
 * ```
 *
 * @example
 * ```ts
 * // Integrating with error tracking
 * import { setErrorHandler, reportError } from 'shadmin'
 * import * as Sentry from '@sentry/react'
 *
 * setErrorHandler((error, context) => {
 *   Sentry.captureException(error, { extra: context })
 * })
 *
 * // Later in your code
 * reportError(new Error('Something went wrong'), { userId: '123' })
 * ```
 */

/**
 * Check if we're in development mode
 * Evaluated at call time to support testing
 */
const isDev = (): boolean => process.env.NODE_ENV === 'development'

/**
 * Logger utility with [shadmin] prefix
 *
 * - `debug`: Development-only console.log
 * - `warn`: Development-only console.warn
 * - `error`: Always logs (production and development)
 */
export const logger = {
  /**
   * Log debug information (development only)
   */
  debug: (...args: unknown[]): void => {
    if (isDev()) console.log('[shadmin]', ...args)
  },

  /**
   * Log warnings (development only)
   */
  warn: (...args: unknown[]): void => {
    if (isDev()) console.warn('[shadmin]', ...args)
  },

  /**
   * Log errors (always, in all environments)
   */
  error: (...args: unknown[]): void => {
    // Always log errors - they indicate real problems
    console.error('[shadmin]', ...args)
  },
}

// =============================================================================
// Error Handler Extension Point
// =============================================================================

/**
 * Custom error handler function signature for integration with error tracking services
 *
 * @param error - The error that occurred
 * @param context - Optional contextual information about the error
 */
export type ErrorHandler = (
  error: unknown,
  context?: Record<string, unknown>
) => void

let customErrorHandler: ErrorHandler | null = null

/**
 * Set a custom error handler for integration with error tracking services
 *
 * @param handler - Function to call when errors are reported
 *
 * @example
 * ```ts
 * import { setErrorHandler } from 'shadmin'
 * import * as Sentry from '@sentry/react'
 *
 * setErrorHandler((error, context) => {
 *   Sentry.captureException(error, { extra: context })
 * })
 * ```
 */
export const setErrorHandler = (handler: ErrorHandler): void => {
  customErrorHandler = handler
}

/**
 * Report an error to the logger and any configured error handler
 *
 * Use this for errors that should be tracked/monitored, not just logged.
 *
 * @param error - The error to report
 * @param context - Optional contextual information (user ID, request data, etc.)
 *
 * @example
 * ```ts
 * import { reportError } from 'shadmin'
 *
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   reportError(error, { operation: 'riskyOperation', userId: currentUser.id })
 * }
 * ```
 */
export const reportError = (
  error: unknown,
  context?: Record<string, unknown>
): void => {
  logger.error(error)
  customErrorHandler?.(error, context)
}
