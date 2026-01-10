/**
 * Custom error classes for standardized error handling
 * These errors provide structured error information for different error types
 */

/**
 * HttpError - Represents HTTP errors with status codes
 * Used for API response errors (400, 401, 403, 404, 500, etc.)
 */
export class HttpError extends Error {
  status: number
  statusText?: string
  body?: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
    // Maintain proper stack trace for where error was thrown (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError)
    }
  }
}

/**
 * NetworkError - Represents network connectivity issues
 * Used when the request cannot reach the server (offline, CORS, DNS, etc.)
 */
export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message)
    this.name = 'NetworkError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError)
    }
  }
}

/**
 * TimeoutError - Represents request timeout
 * Used when a request exceeds the allowed time limit
 */
export class TimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message)
    this.name = 'TimeoutError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutError)
    }
  }
}

/**
 * ValidationError - Represents validation failures with field-level details
 * Used for form validation and server-side validation errors
 */
export class ValidationError extends Error {
  errors: Record<string, string[]>

  constructor(message: string, errors: Record<string, string[]>) {
    super(message)
    this.name = 'ValidationError'
    this.errors = errors
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
  }

  /**
   * Get errors for a specific field
   */
  getFieldErrors(field: string): string[] {
    return this.errors[field] || []
  }

  /**
   * Check if a field has errors
   */
  hasFieldError(field: string): boolean {
    return (this.errors[field]?.length ?? 0) > 0
  }
}

/**
 * Type guard to check if an error is an HttpError
 */
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError || (error instanceof Error && error.name === 'HttpError' && 'status' in error)
}

/**
 * Type guard to check if an error is a NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError || (error instanceof Error && error.name === 'NetworkError')
}

/**
 * Type guard to check if an error is a TimeoutError
 */
export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError || (error instanceof Error && error.name === 'TimeoutError')
}

/**
 * Type guard to check if an error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError || (error instanceof Error && error.name === 'ValidationError' && 'errors' in error)
}

/**
 * Helper to check if an error represents a 404 Not Found
 */
export function isNotFoundError(error: unknown): boolean {
  return isHttpError(error) && error.status === 404
}

/**
 * Helper to check if an error represents a 403 Forbidden
 */
export function isForbiddenError(error: unknown): boolean {
  return isHttpError(error) && error.status === 403
}

/**
 * Helper to check if an error represents a 5xx server error
 */
export function isServerError(error: unknown): boolean {
  return isHttpError(error) && error.status >= 500 && error.status < 600
}

/**
 * Helper to check if an error represents a 409 Conflict
 */
export function isConflictError(error: unknown): boolean {
  return isHttpError(error) && error.status === 409
}

/**
 * Extract field errors from an HTTP error response body
 */
export function extractFieldErrors(error: unknown): Record<string, string[]> | null {
  if (isValidationError(error)) {
    return error.errors
  }
  if (isHttpError(error) && error.body && typeof error.body === 'object') {
    const body = error.body as Record<string, unknown>
    if (body.errors && typeof body.errors === 'object') {
      return body.errors as Record<string, string[]>
    }
  }
  return null
}
