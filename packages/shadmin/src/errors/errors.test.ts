/**
 * Tests for error extraction utilities
 *
 * Tests the extractFieldErrors function against multiple API response shapes
 * to ensure compatibility with common REST, GraphQL, and validation error formats.
 */

import { describe, it, expect } from 'vitest'

import {
  HttpError,
  ValidationError,
  NetworkError,
  TimeoutError,
  extractFieldErrors,
  isHttpError,
  isValidationError,
  isNetworkError,
  isTimeoutError,
  isNotFoundError,
  isForbiddenError,
  isServerError,
  isConflictError,
} from './index'

describe('extractFieldErrors', () => {
  describe('ValidationError instance (Shape 1)', () => {
    it('extracts errors from ValidationError instance', () => {
      const error = new ValidationError('Validation failed', {
        email: ['Invalid email format'],
        password: ['Must be at least 8 characters', 'Must contain a number'],
      })

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        email: ['Invalid email format'],
        password: ['Must be at least 8 characters', 'Must contain a number'],
      })
    })

    it('handles ValidationError with empty errors', () => {
      const error = new ValidationError('Validation failed', {})

      const result = extractFieldErrors(error)

      expect(result).toEqual({})
    })
  })

  describe('body.errors - Common REST API format (Shape 2)', () => {
    it('extracts errors from HttpError with body.errors', () => {
      const error = new HttpError('Validation failed', 400, {
        errors: {
          email: ['Invalid email format'],
          username: ['Already taken'],
        },
      })

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        email: ['Invalid email format'],
        username: ['Already taken'],
      })
    })

    it('extracts errors from plain object with body.errors', () => {
      const error = {
        body: {
          errors: {
            title: ['Title is required'],
          },
        },
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        title: ['Title is required'],
      })
    })
  })

  describe('response.data.fieldErrors - Spring/REST API format (Shape 3)', () => {
    it('extracts errors from response.data.fieldErrors', () => {
      const error = {
        response: {
          data: {
            fieldErrors: {
              firstName: ['First name is required'],
              lastName: ['Last name is required'],
            },
          },
        },
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        firstName: ['First name is required'],
        lastName: ['Last name is required'],
      })
    })

    it('handles axios-style error with response.data.fieldErrors', () => {
      // Simulating axios error structure
      const error = {
        message: 'Request failed with status code 422',
        response: {
          status: 422,
          data: {
            fieldErrors: {
              age: ['Must be a positive number'],
            },
          },
        },
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        age: ['Must be a positive number'],
      })
    })
  })

  describe('response.data.errors - Alternative REST format (Shape 4)', () => {
    it('extracts errors from response.data.errors', () => {
      const error = {
        response: {
          data: {
            errors: {
              phone: ['Invalid phone number format'],
            },
          },
        },
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        phone: ['Invalid phone number format'],
      })
    })
  })

  describe('details - Zod validation error format (Shape 5)', () => {
    it('extracts errors from details property', () => {
      // Simulating Zod-style error format
      const error = {
        details: {
          name: ['String must contain at least 1 character(s)'],
          email: ['Invalid email'],
        },
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        name: ['String must contain at least 1 character(s)'],
        email: ['Invalid email'],
      })
    })

    it('handles error with details and other properties', () => {
      const error = {
        name: 'ZodError',
        message: 'Validation failed',
        details: {
          price: ['Expected number, received string'],
        },
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        price: ['Expected number, received string'],
      })
    })
  })

  describe('errors[0].extensions.validation - GraphQL format (Shape 6)', () => {
    it('extracts errors from GraphQL error format', () => {
      const error = {
        errors: [
          {
            message: 'Validation failed',
            extensions: {
              code: 'BAD_USER_INPUT',
              validation: {
                email: ['Email already registered'],
                password: ['Password too weak'],
              },
            },
          },
        ],
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        email: ['Email already registered'],
        password: ['Password too weak'],
      })
    })

    it('handles GraphQL error with multiple errors (takes first)', () => {
      const error = {
        errors: [
          {
            extensions: {
              validation: {
                field1: ['Error from first'],
              },
            },
          },
          {
            extensions: {
              validation: {
                field2: ['Error from second'],
              },
            },
          },
        ],
      }

      const result = extractFieldErrors(error)

      // Should extract from first error
      expect(result).toEqual({
        field1: ['Error from first'],
      })
    })
  })

  describe('response.body.errors - Nested body format (Shape 7)', () => {
    it('extracts errors from response.body.errors', () => {
      // Common in some fetch wrappers
      const error = {
        response: {
          body: {
            errors: {
              description: ['Description is too long'],
            },
          },
        },
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        description: ['Description is too long'],
      })
    })
  })

  describe('Direct field errors at root level (Shape 8)', () => {
    it('extracts direct field errors object', () => {
      const error = {
        email: ['Invalid email'],
        password: ['Required'],
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        email: ['Invalid email'],
        password: ['Required'],
      })
    })
  })

  describe('Edge cases and invalid inputs', () => {
    it('returns null for null input', () => {
      expect(extractFieldErrors(null)).toBeNull()
    })

    it('returns null for undefined input', () => {
      expect(extractFieldErrors(undefined)).toBeNull()
    })

    it('returns null for primitive values', () => {
      expect(extractFieldErrors('error')).toBeNull()
      expect(extractFieldErrors(123)).toBeNull()
      expect(extractFieldErrors(true)).toBeNull()
    })

    it('returns empty object for empty field errors object', () => {
      // An empty object {} is technically a valid FieldErrors shape (no fields have errors)
      // This is semantically different from "no error shape found"
      expect(extractFieldErrors({})).toEqual({})
    })

    it('returns null for object without valid error shape', () => {
      const error = {
        message: 'Something went wrong',
        code: 'INTERNAL_ERROR',
      }

      expect(extractFieldErrors(error)).toBeNull()
    })

    it('returns null for array input', () => {
      expect(extractFieldErrors(['error1', 'error2'])).toBeNull()
    })

    it('returns null for errors with wrong value types', () => {
      // Values should be string arrays, not strings
      const error = {
        body: {
          errors: {
            email: 'Invalid email', // string instead of string[]
          },
        },
      }

      expect(extractFieldErrors(error)).toBeNull()
    })

    it('returns null for errors with mixed value types', () => {
      const error = {
        body: {
          errors: {
            email: ['Valid array'],
            password: 'Invalid string', // mixed types
          },
        },
      }

      expect(extractFieldErrors(error)).toBeNull()
    })

    it('returns null for nested errors with non-string array values', () => {
      const error = {
        body: {
          errors: {
            email: [123, 456], // numbers instead of strings
          },
        },
      }

      expect(extractFieldErrors(error)).toBeNull()
    })
  })

  describe('Priority order', () => {
    it('prioritizes ValidationError over other shapes', () => {
      // Create an object that could match multiple shapes
      const validationError = new ValidationError('Validation failed', {
        fromValidation: ['Should be this one'],
      })
      // Add body.errors to make it also match Shape 2
      ;(validationError as unknown as { body: { errors: Record<string, string[]> } }).body = {
        errors: { fromBody: ['Should not be this'] },
      }

      const result = extractFieldErrors(validationError)

      expect(result).toEqual({
        fromValidation: ['Should be this one'],
      })
    })

    it('body.errors takes priority over response.data shapes', () => {
      const error = {
        body: {
          errors: {
            fromBody: ['Priority 1'],
          },
        },
        response: {
          data: {
            fieldErrors: {
              fromResponse: ['Priority 2'],
            },
          },
        },
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        fromBody: ['Priority 1'],
      })
    })
  })
})

describe('Error type guards', () => {
  describe('isHttpError', () => {
    it('returns true for HttpError instance', () => {
      const error = new HttpError('Not Found', 404)
      expect(isHttpError(error)).toBe(true)
    })

    it('returns true for duck-typed HttpError', () => {
      const error = Object.assign(new Error('Not Found'), {
        name: 'HttpError',
        status: 404,
      })
      expect(isHttpError(error)).toBe(true)
    })

    it('returns false for non-HttpError', () => {
      expect(isHttpError(new Error('Generic error'))).toBe(false)
      expect(isHttpError(null)).toBe(false)
      expect(isHttpError({ status: 404 })).toBe(false)
    })
  })

  describe('isValidationError', () => {
    it('returns true for ValidationError instance', () => {
      const error = new ValidationError('Invalid', { field: ['error'] })
      expect(isValidationError(error)).toBe(true)
    })

    it('returns true for duck-typed ValidationError', () => {
      const error = Object.assign(new Error('Invalid'), {
        name: 'ValidationError',
        errors: { field: ['error'] },
      })
      expect(isValidationError(error)).toBe(true)
    })

    it('returns false for non-ValidationError', () => {
      expect(isValidationError(new Error('Generic error'))).toBe(false)
      expect(isValidationError(null)).toBe(false)
    })
  })

  describe('isNetworkError', () => {
    it('returns true for NetworkError instance', () => {
      const error = new NetworkError()
      expect(isNetworkError(error)).toBe(true)
    })

    it('returns false for non-NetworkError', () => {
      expect(isNetworkError(new Error('Generic error'))).toBe(false)
    })
  })

  describe('isTimeoutError', () => {
    it('returns true for TimeoutError instance', () => {
      const error = new TimeoutError()
      expect(isTimeoutError(error)).toBe(true)
    })

    it('returns false for non-TimeoutError', () => {
      expect(isTimeoutError(new Error('Generic error'))).toBe(false)
    })
  })

  describe('isNotFoundError', () => {
    it('returns true for 404 HttpError', () => {
      const error = new HttpError('Not Found', 404)
      expect(isNotFoundError(error)).toBe(true)
    })

    it('returns false for other status codes', () => {
      expect(isNotFoundError(new HttpError('Bad Request', 400))).toBe(false)
      expect(isNotFoundError(new HttpError('Server Error', 500))).toBe(false)
    })
  })

  describe('isForbiddenError', () => {
    it('returns true for 403 HttpError', () => {
      const error = new HttpError('Forbidden', 403)
      expect(isForbiddenError(error)).toBe(true)
    })

    it('returns false for other status codes', () => {
      expect(isForbiddenError(new HttpError('Unauthorized', 401))).toBe(false)
    })
  })

  describe('isServerError', () => {
    it('returns true for 5xx HttpError', () => {
      expect(isServerError(new HttpError('Internal Server Error', 500))).toBe(true)
      expect(isServerError(new HttpError('Bad Gateway', 502))).toBe(true)
      expect(isServerError(new HttpError('Service Unavailable', 503))).toBe(true)
    })

    it('returns false for non-5xx status codes', () => {
      expect(isServerError(new HttpError('Bad Request', 400))).toBe(false)
      expect(isServerError(new HttpError('Not Found', 404))).toBe(false)
    })
  })

  describe('isConflictError', () => {
    it('returns true for 409 HttpError', () => {
      const error = new HttpError('Conflict', 409)
      expect(isConflictError(error)).toBe(true)
    })

    it('returns false for other status codes', () => {
      expect(isConflictError(new HttpError('Bad Request', 400))).toBe(false)
    })
  })
})

describe('Error classes', () => {
  describe('HttpError', () => {
    it('creates HttpError with message and status', () => {
      const error = new HttpError('Not Found', 404)
      expect(error.message).toBe('Not Found')
      expect(error.status).toBe(404)
      expect(error.name).toBe('HttpError')
    })

    it('creates HttpError with body', () => {
      const body = { errors: { field: ['error'] } }
      const error = new HttpError('Bad Request', 400, body)
      expect(error.body).toBe(body)
    })
  })

  describe('ValidationError', () => {
    it('creates ValidationError with message and errors', () => {
      const errors = { email: ['Invalid email'] }
      const error = new ValidationError('Validation failed', errors)
      expect(error.message).toBe('Validation failed')
      expect(error.errors).toBe(errors)
      expect(error.name).toBe('ValidationError')
    })

    it('getFieldErrors returns errors for field', () => {
      const error = new ValidationError('Invalid', {
        email: ['Invalid email'],
        password: ['Too short'],
      })
      expect(error.getFieldErrors('email')).toEqual(['Invalid email'])
      expect(error.getFieldErrors('unknown')).toEqual([])
    })

    it('hasFieldError returns true when field has errors', () => {
      const error = new ValidationError('Invalid', {
        email: ['Invalid email'],
      })
      expect(error.hasFieldError('email')).toBe(true)
      expect(error.hasFieldError('password')).toBe(false)
    })
  })

  describe('NetworkError', () => {
    it('creates NetworkError with default message', () => {
      const error = new NetworkError()
      expect(error.message).toBe('Network request failed')
      expect(error.name).toBe('NetworkError')
    })

    it('creates NetworkError with custom message', () => {
      const error = new NetworkError('Connection refused')
      expect(error.message).toBe('Connection refused')
    })
  })

  describe('TimeoutError', () => {
    it('creates TimeoutError with default message', () => {
      const error = new TimeoutError()
      expect(error.message).toBe('Request timed out')
      expect(error.name).toBe('TimeoutError')
    })

    it('creates TimeoutError with custom message', () => {
      const error = new TimeoutError('Operation timed out after 30s')
      expect(error.message).toBe('Operation timed out after 30s')
    })
  })
})
