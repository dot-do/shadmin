/**
 * Type Guards for Runtime Type Safety
 *
 * These functions provide runtime type checking to replace unsafe type assertions.
 * They validate data at boundaries where external input enters the system.
 *
 * @module utils/type-guards
 */

import type { Identifier, RaRecord } from '../types'

// =============================================================================
// Primitive Type Guards
// =============================================================================

/**
 * Check if a value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * Check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Check if a value is a function
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function'
}

/**
 * Check if a value is a valid Identifier (string or number)
 */
export function isIdentifier(value: unknown): value is Identifier {
  return isString(value) || isNumber(value)
}

// =============================================================================
// Error Type Guards
// =============================================================================

/**
 * Shape of an error with HTTP status
 */
export interface HttpErrorShape {
  status: number
  message?: string
  body?: unknown
}

/**
 * Check if an error has an HTTP status code
 */
export function hasHttpStatus(error: unknown): error is { status: number } {
  return isObject(error) && isNumber(error.status)
}

/**
 * Check if an error is an HttpError-like object
 */
export function isHttpError(error: unknown): error is HttpErrorShape {
  if (!isObject(error)) return false
  return isNumber(error.status)
}

/**
 * Get HTTP status from an error, or undefined if not present
 */
export function getErrorStatus(error: unknown): number | undefined {
  if (hasHttpStatus(error)) {
    return error.status
  }
  return undefined
}

/**
 * Shape of an error with code property
 */
export interface CodedErrorShape {
  code: string
  message?: string
}

/**
 * Check if an error has a code property
 */
export function hasErrorCode(error: unknown): error is { code: string } {
  return isObject(error) && isString(error.code)
}

/**
 * Get error code from an error, or undefined if not present
 */
export function getErrorCode(error: unknown): string | undefined {
  if (hasErrorCode(error)) {
    return error.code
  }
  return undefined
}

// =============================================================================
// Validation Error Type Guards
// =============================================================================

/**
 * Shape of field errors in API responses
 */
export type FieldErrors = Record<string, string[]>

/**
 * Check if a value is a FieldErrors object
 * (Record<string, string[]>)
 */
export function isFieldErrors(value: unknown): value is FieldErrors {
  if (!isObject(value)) return false

  return Object.entries(value).every(
    ([_key, val]) => Array.isArray(val) && val.every((v) => isString(v))
  )
}

/**
 * Check if an error body contains field errors in the `errors` property
 */
export function hasBodyErrors(body: unknown): body is { errors: FieldErrors } {
  if (!isObject(body)) return false
  return 'errors' in body && isFieldErrors(body.errors)
}

/**
 * Check if an error body contains field errors in the `fieldErrors` property
 */
export function hasBodyFieldErrors(body: unknown): body is { fieldErrors: FieldErrors } {
  if (!isObject(body)) return false
  return 'fieldErrors' in body && isFieldErrors(body.fieldErrors)
}

/**
 * Extract field errors from an error body
 * Handles multiple common formats:
 * - { errors: { field: ['message'] } }
 * - { fieldErrors: { field: ['message'] } }
 * - { field: ['message'] } (direct)
 */
export function extractFieldErrors(body: unknown): FieldErrors | null {
  if (!isObject(body)) return null

  // Handle { errors: { field: ['message'] } } format
  if (hasBodyErrors(body)) {
    return body.errors
  }

  // Handle { fieldErrors: { field: ['message'] } } format
  if (hasBodyFieldErrors(body)) {
    return body.fieldErrors
  }

  // Handle { field: ['message'] } format (direct)
  if (isFieldErrors(body)) {
    return body
  }

  return null
}

// =============================================================================
// Record Type Guards
// =============================================================================

/**
 * Check if a value is a RaRecord (has an id property)
 */
export function isRaRecord(value: unknown): value is RaRecord {
  return isObject(value) && isIdentifier(value.id)
}

/**
 * Check if a value is an array of RaRecords
 */
export function isRaRecordArray(value: unknown): value is RaRecord[] {
  return Array.isArray(value) && value.every(isRaRecord)
}

// =============================================================================
// API Response Type Guards
// =============================================================================

/**
 * Shape of a list response
 */
export interface ListResponseShape<T = RaRecord> {
  data: T[]
  total?: number
}

/**
 * Check if a response is a list response
 */
export function isListResponse(value: unknown): value is ListResponseShape {
  if (!isObject(value)) return false
  if (!Array.isArray(value.data)) return false
  if (value.total !== undefined && !isNumber(value.total)) return false
  return true
}

/**
 * Shape of a single record response
 */
export interface RecordResponseShape<T = RaRecord> {
  data: T
}

/**
 * Check if a response is a single record response
 */
export function isRecordResponse(value: unknown): value is RecordResponseShape {
  if (!isObject(value)) return false
  if (!isObject(value.data) && !isRaRecord(value.data)) return false
  return true
}

// =============================================================================
// Permissions Type Guards
// =============================================================================

/**
 * Check if a value is an array of strings (permissions)
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString)
}

/**
 * Check if permissions is an object with boolean values
 */
export function isPermissionsObject(value: unknown): value is Record<string, boolean> {
  if (!isObject(value)) return false
  return Object.values(value).every(isBoolean)
}

// =============================================================================
// Safe Property Access
// =============================================================================

/**
 * Safely get a string property from an unknown object
 */
export function getStringProp(obj: unknown, key: string): string | undefined {
  if (!isObject(obj)) return undefined
  const value = obj[key]
  return isString(value) ? value : undefined
}

/**
 * Safely get a number property from an unknown object
 */
export function getNumberProp(obj: unknown, key: string): number | undefined {
  if (!isObject(obj)) return undefined
  const value = obj[key]
  return isNumber(value) ? value : undefined
}

/**
 * Safely get an array property from an unknown object
 */
export function getArrayProp<T>(
  obj: unknown,
  key: string,
  itemGuard?: (item: unknown) => item is T
): T[] | undefined {
  if (!isObject(obj)) return undefined
  const value = obj[key]
  if (!Array.isArray(value)) return undefined
  if (itemGuard && !value.every(itemGuard)) return undefined
  return value as T[]
}

/**
 * Safely get an object property from an unknown object
 */
export function getObjectProp(obj: unknown, key: string): Record<string, unknown> | undefined {
  if (!isObject(obj)) return undefined
  const value = obj[key]
  return isObject(value) ? value : undefined
}

// =============================================================================
// Query Key Type Guards (for TanStack Query)
// =============================================================================

/**
 * Check if a query key parameter contains an id
 */
export function hasIdParam(param: unknown): param is { id: Identifier } {
  return isObject(param) && isIdentifier(param.id)
}

/**
 * Get id from a query key parameter, or undefined
 */
export function getIdFromParam(param: unknown): Identifier | undefined {
  if (hasIdParam(param)) {
    return param.id
  }
  return undefined
}
