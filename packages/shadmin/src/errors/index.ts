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
 * Type guard to check if a value is a valid FieldErrors object
 * (Record<string, string[]>)
 */
function isFieldErrors(value: unknown): value is Record<string, string[]> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  return Object.entries(value as Record<string, unknown>).every(
    ([_key, val]) => Array.isArray(val) && val.every((v) => typeof v === 'string')
  )
}

/**
 * Type-safe error shape extractor functions
 * Each function attempts to extract field errors from a specific API response shape
 */
type ErrorShapeExtractor = (error: unknown) => unknown

/**
 * Extract field errors from an HTTP error response body
 *
 * Handles multiple common API response formats:
 * 1. ValidationError instance - Our custom error class
 * 2. body.errors - Common REST API format
 * 3. response.data.fieldErrors - Common in REST APIs (e.g., Spring)
 * 4. response.data.errors - Alternative REST format
 * 5. details - Zod validation error format
 * 6. errors[0].extensions.validation - GraphQL error format
 * 7. response.body.errors - Nested body format (e.g., fetch wrapper)
 *
 * @param error - The error object to extract field errors from
 * @returns A Record<string, string[]> of field errors, or null if not found
 *
 * @example
 * ```ts
 * // REST API error
 * const error = new HttpError('Validation failed', 400, {
 *   errors: { email: ['Invalid email format'] }
 * })
 * extractFieldErrors(error) // { email: ['Invalid email format'] }
 *
 * // GraphQL error
 * const graphqlError = {
 *   errors: [{
 *     extensions: { validation: { username: ['Already taken'] } }
 *   }]
 * }
 * extractFieldErrors(graphqlError) // { username: ['Already taken'] }
 * ```
 */
export function extractFieldErrors(error: unknown): Record<string, string[]> | null {
  // 1. ValidationError instance - our custom error class
  if (isValidationError(error)) {
    return error.errors
  }

  // Define error shape extractors for common API response formats
  const shapeExtractors: ErrorShapeExtractor[] = [
    // 2. body.errors - Common REST API format (HttpError with body)
    (e: unknown) => {
      const obj = e as { body?: { errors?: unknown } } | undefined
      return obj?.body?.errors
    },

    // 3. response.data.fieldErrors - Common in REST APIs (e.g., Spring, axios-wrapped)
    (e: unknown) => {
      const obj = e as { response?: { data?: { fieldErrors?: unknown } } } | undefined
      return obj?.response?.data?.fieldErrors
    },

    // 4. response.data.errors - Alternative REST format
    (e: unknown) => {
      const obj = e as { response?: { data?: { errors?: unknown } } } | undefined
      return obj?.response?.data?.errors
    },

    // 5. details - Zod validation error format
    (e: unknown) => {
      const obj = e as { details?: unknown } | undefined
      return obj?.details
    },

    // 6. errors[0].extensions.validation - GraphQL error format
    (e: unknown) => {
      const obj = e as { errors?: Array<{ extensions?: { validation?: unknown } }> } | undefined
      return obj?.errors?.[0]?.extensions?.validation
    },

    // 7. response.body.errors - Nested body format (e.g., fetch wrapper)
    (e: unknown) => {
      const obj = e as { response?: { body?: { errors?: unknown } } } | undefined
      return obj?.response?.body?.errors
    },

    // 8. Direct field errors object at root level
    (e: unknown) => e,
  ]

  // Try each extractor until we find valid field errors
  for (const extract of shapeExtractors) {
    const result = extract(error)
    if (isFieldErrors(result)) {
      return result
    }
  }

  return null
}
