/**
 * useErrorHandling hook tests
 * TDD: RED phase - Comprehensive tests for standardized error handling
 *
 * Tests cover:
 * 1. DataProvider error handling (network, HTTP status codes, validation, timeout)
 * 2. AuthProvider error handling (login failures, session expiration, permission denied)
 * 3. Form submission errors (field-level, server-side validation, submission failures)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { DataProviderContextProvider } from '../contexts/DataProviderContext'
import { AuthProviderContextProvider } from '../contexts/AuthProviderContext'
import { NotificationContextProvider } from '../contexts/NotificationContext'
import { MemoryRouter } from 'react-router'
import type { DataProvider, AuthProvider } from '../types'
import { useGetOne } from './useGetOne'
import { useGetList } from './useGetList'
import { useCreate } from './useCreate'
import { useUpdate } from './useUpdate'
import { useDelete } from './useDelete'
import { useLogin } from './useLogin'
import { useLogout } from './useLogout'
import { HttpError, NetworkError, TimeoutError, ValidationError } from '../errors'

// Test wrapper with required providers
const createWrapper = (
  dataProvider: DataProvider,
  authProvider?: AuthProvider
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    const content = authProvider ? (
      <AuthProviderContextProvider authProvider={authProvider}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          {children}
        </DataProviderContextProvider>
      </AuthProviderContextProvider>
    ) : (
      <DataProviderContextProvider dataProvider={dataProvider}>
        {children}
      </DataProviderContextProvider>
    )

    return (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            {content}
          </NotificationContextProvider>
        </QueryClientProvider>
      </MemoryRouter>
    )
  }
}

const createMockDataProvider = (
  overrides: Partial<DataProvider> = {}
): DataProvider => ({
  getList: vi.fn().mockResolvedValue({ data: [], total: 0 }),
  getOne: vi.fn().mockResolvedValue({ data: { id: 1 } }),
  getMany: vi.fn().mockResolvedValue({ data: [] }),
  getManyReference: vi.fn().mockResolvedValue({ data: [], total: 0 }),
  create: vi.fn().mockResolvedValue({ data: { id: 1 } }),
  update: vi.fn().mockResolvedValue({ data: { id: 1 } }),
  updateMany: vi.fn().mockResolvedValue({ data: [] }),
  delete: vi.fn().mockResolvedValue({ data: { id: 1 } }),
  deleteMany: vi.fn().mockResolvedValue({ data: [] }),
  ...overrides,
})

const createMockAuthProvider = (
  overrides: Partial<AuthProvider> = {}
): AuthProvider => ({
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  checkError: vi.fn().mockResolvedValue(undefined),
  checkAuth: vi.fn().mockResolvedValue(undefined),
  getPermissions: vi.fn().mockResolvedValue([]),
  ...overrides,
})

describe('Error Handling Standardization', () => {
  /**
   * Section 1: DataProvider Error Handling
   */
  describe('DataProvider Error Handling', () => {
    describe('Network Errors', () => {
      it('should handle network errors with proper error type', async () => {
        const networkError = new NetworkError('Failed to fetch')
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockRejectedValue(networkError),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 1 }), {
          wrapper: createWrapper(dataProvider),
        })

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        expect(result.current.error).toBeInstanceOf(NetworkError)
        expect(result.current.error?.name).toBe('NetworkError')
      })

      it('should handle network errors in list queries', async () => {
        const networkError = new NetworkError('Connection refused')
        const dataProvider = createMockDataProvider({
          getList: vi.fn().mockRejectedValue(networkError),
        })

        const { result } = renderHook(
          () => useGetList('posts', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
          }),
          { wrapper: createWrapper(dataProvider) }
        )

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeInstanceOf(NetworkError)
      })

      it('should provide isNetworkError helper for error identification', async () => {
        const networkError = new NetworkError()
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockRejectedValue(networkError),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 1 }), {
          wrapper: createWrapper(dataProvider),
        })

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        // Expected hook enhancement: isNetworkError helper
        expect((result.current as unknown as { isNetworkError?: boolean }).isNetworkError).toBe(true)
      })
    })

    describe('HTTP Status Code Errors', () => {
      it('should handle 400 Bad Request errors', async () => {
        const httpError = new HttpError('Bad Request', 400, {
          message: 'Invalid query parameters',
        })
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockRejectedValue(httpError),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 1 }), {
          wrapper: createWrapper(dataProvider),
        })

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        expect(result.current.error).toBeInstanceOf(HttpError)
        expect((result.current.error as HttpError).status).toBe(400)
      })

      it('should handle 401 Unauthorized errors', async () => {
        const httpError = new HttpError('Unauthorized', 401)
        const authProvider = createMockAuthProvider()
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockRejectedValue(httpError),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 1 }), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        expect((result.current.error as HttpError).status).toBe(401)
        // Expected: authProvider.checkError should be called for 401 errors
        expect(authProvider.checkError).toHaveBeenCalledWith(httpError)
      })

      it('should handle 403 Forbidden errors', async () => {
        const httpError = new HttpError('Forbidden', 403, {
          resource: 'posts',
          action: 'read',
        })
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockRejectedValue(httpError),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 1 }), {
          wrapper: createWrapper(dataProvider),
        })

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        expect((result.current.error as HttpError).status).toBe(403)
        // Expected hook enhancement: isForbidden helper
        expect((result.current as unknown as { isForbidden?: boolean }).isForbidden).toBe(true)
      })

      it('should handle 404 Not Found errors', async () => {
        const httpError = new HttpError('Not Found', 404)
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockRejectedValue(httpError),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 999 }), {
          wrapper: createWrapper(dataProvider),
        })

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        expect((result.current.error as HttpError).status).toBe(404)
        // Expected hook enhancement: isNotFound helper
        expect((result.current as unknown as { isNotFound?: boolean }).isNotFound).toBe(true)
      })

      it('should handle 500 Internal Server Error', async () => {
        const httpError = new HttpError('Internal Server Error', 500)
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockRejectedValue(httpError),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 1 }), {
          wrapper: createWrapper(dataProvider),
        })

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        expect((result.current.error as HttpError).status).toBe(500)
        // Expected hook enhancement: isServerError helper
        expect((result.current as unknown as { isServerError?: boolean }).isServerError).toBe(true)
      })

      it('should preserve error body/details from HTTP errors', async () => {
        const errorBody = {
          code: 'VALIDATION_ERROR',
          details: [
            { field: 'email', message: 'Invalid email format' },
          ],
        }
        const httpError = new HttpError('Bad Request', 400, errorBody)
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(httpError),
        })

        const { result } = renderHook(() => useCreate('users'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: { email: 'invalid' } })
          } catch {
            // Expected to throw
          }
        })

        expect((result.current.error as HttpError).body).toEqual(errorBody)
      })
    })

    describe('Validation Errors', () => {
      it('should handle validation errors with field-level details', async () => {
        const validationError = new ValidationError('Validation failed', {
          email: ['Email is required', 'Must be a valid email'],
          name: ['Name must be at least 2 characters'],
        })
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(validationError),
        })

        const { result } = renderHook(() => useCreate('users'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: { email: '', name: 'a' } })
          } catch {
            // Expected to throw
          }
        })

        expect(result.current.error).toBeInstanceOf(ValidationError)
        expect((result.current.error as ValidationError).errors).toHaveProperty('email')
        expect((result.current.error as ValidationError).errors).toHaveProperty('name')
      })

      it('should provide getFieldErrors helper for validation errors', async () => {
        const validationError = new ValidationError('Validation failed', {
          email: ['Invalid email'],
        })
        const dataProvider = createMockDataProvider({
          update: vi.fn().mockRejectedValue(validationError),
        })

        const { result } = renderHook(() => useUpdate('users'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ id: 1, data: { email: 'bad' } })
          } catch {
            // Expected to throw
          }
        })

        // Expected hook enhancement: getFieldErrors helper
        const getFieldErrors = (result.current as unknown as { getFieldErrors?: (field: string) => string[] }).getFieldErrors
        expect(getFieldErrors).toBeDefined()
        expect(getFieldErrors?.('email')).toEqual(['Invalid email'])
      })
    })

    describe('Timeout Errors', () => {
      it('should handle timeout errors', async () => {
        const timeoutError = new TimeoutError('Request timed out after 30s')
        const dataProvider = createMockDataProvider({
          getList: vi.fn().mockRejectedValue(timeoutError),
        })

        const { result } = renderHook(
          () => useGetList('posts', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
          }),
          { wrapper: createWrapper(dataProvider) }
        )

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        expect(result.current.error).toBeInstanceOf(TimeoutError)
        // Expected hook enhancement: isTimeout helper
        expect((result.current as unknown as { isTimeout?: boolean }).isTimeout).toBe(true)
      })

      it('should provide retry capability for timeout errors', async () => {
        let callCount = 0
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockImplementation(() => {
            callCount++
            if (callCount === 1) {
              return Promise.reject(new TimeoutError())
            }
            return Promise.resolve({ data: { id: 1, title: 'Success' } })
          }),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 1 }), {
          wrapper: createWrapper(dataProvider),
        })

        await waitFor(() => {
          expect(result.current.error).toBeDefined()
        })

        // Retry after timeout
        await act(async () => {
          await result.current.refetch()
        })

        await waitFor(() => {
          expect(result.current.data).toBeDefined()
          expect(result.current.data?.title).toBe('Success')
        })
      })
    })

    describe('Error Recovery', () => {
      it('should clear errors on successful retry', async () => {
        let shouldFail = true
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockImplementation(() => {
            if (shouldFail) {
              return Promise.reject(new HttpError('Server Error', 500))
            }
            return Promise.resolve({ data: { id: 1, name: 'Test' } })
          }),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 1 }), {
          wrapper: createWrapper(dataProvider),
        })

        await waitFor(() => {
          expect(result.current.error).toBeDefined()
        })

        shouldFail = false

        await act(async () => {
          await result.current.refetch()
        })

        await waitFor(() => {
          expect(result.current.error).toBeNull()
          expect(result.current.data).toBeDefined()
        })
      })

      it('should track error count for repeated failures', async () => {
        // Create a mock that returns a new error instance each time
        let errorCount = 0
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockImplementation(() => {
            errorCount++
            return Promise.reject(new HttpError(`Error ${errorCount}`, 500))
          }),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 1 }), {
          wrapper: createWrapper(dataProvider),
        })

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        // Expected hook enhancement: errorCount tracking
        expect((result.current as unknown as { errorCount?: number }).errorCount).toBe(1)

        await act(async () => {
          await result.current.refetch()
        })

        await waitFor(() => {
          expect((result.current as unknown as { errorCount?: number }).errorCount).toBe(2)
        })
      })
    })
  })

  /**
   * Section 2: AuthProvider Error Handling
   */
  describe('AuthProvider Error Handling', () => {
    describe('Login Failures', () => {
      it('should handle invalid credentials error', async () => {
        const authProvider = createMockAuthProvider({
          login: vi.fn().mockRejectedValue(new Error('Invalid username or password')),
        })
        const dataProvider = createMockDataProvider()

        const { result } = renderHook(() => useLogin(), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await act(async () => {
          try {
            await result.current.login({ username: 'bad', password: 'wrong' })
          } catch {
            // Expected to throw
          }
        })

        expect(result.current.error).toBeDefined()
        expect(result.current.error?.message).toBe('Invalid username or password')
      })

      it('should handle account locked error', async () => {
        const lockedError = new Error('Account locked')
        ;(lockedError as Error & { code?: string }).code = 'ACCOUNT_LOCKED'
        const authProvider = createMockAuthProvider({
          login: vi.fn().mockRejectedValue(lockedError),
        })
        const dataProvider = createMockDataProvider()

        const { result } = renderHook(() => useLogin(), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await act(async () => {
          try {
            await result.current.login({ username: 'locked', password: 'password' })
          } catch {
            // Expected to throw
          }
        })

        expect(result.current.error?.message).toBe('Account locked')
        // Expected enhancement: error code preservation
        expect((result.current.error as Error & { code?: string })?.code).toBe('ACCOUNT_LOCKED')
      })

      it('should handle rate limiting on login', async () => {
        const rateLimitError = new HttpError('Too Many Requests', 429, {
          retryAfter: 60,
        })
        const authProvider = createMockAuthProvider({
          login: vi.fn().mockRejectedValue(rateLimitError),
        })
        const dataProvider = createMockDataProvider()

        const { result } = renderHook(() => useLogin(), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await act(async () => {
          try {
            await result.current.login({ username: 'user', password: 'pass' })
          } catch {
            // Expected to throw
          }
        })

        expect((result.current.error as HttpError).status).toBe(429)
        // Expected enhancement: retryAfter extraction
        expect((result.current as unknown as { retryAfter?: number }).retryAfter).toBe(60)
      })

      it('should clear login error on successful retry', async () => {
        let shouldFail = true
        const authProvider = createMockAuthProvider({
          login: vi.fn().mockImplementation(() => {
            if (shouldFail) {
              return Promise.reject(new Error('Invalid credentials'))
            }
            return Promise.resolve(undefined)
          }),
        })
        const dataProvider = createMockDataProvider()

        const { result } = renderHook(() => useLogin(), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await act(async () => {
          try {
            await result.current.login({ username: 'user', password: 'wrong' })
          } catch {
            // Expected to throw
          }
        })

        expect(result.current.error).toBeDefined()

        shouldFail = false

        await act(async () => {
          await result.current.login({ username: 'user', password: 'correct' })
        })

        expect(result.current.error).toBeNull()
      })
    })

    describe('Session Expiration', () => {
      it('should handle session expired during API call', async () => {
        const sessionExpiredError = new HttpError('Session Expired', 401, {
          code: 'SESSION_EXPIRED',
        })
        const authProvider = createMockAuthProvider({
          checkError: vi.fn().mockRejectedValue(new Error('Redirect to login')),
        })
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockRejectedValue(sessionExpiredError),
        })

        const { result } = renderHook(() => useGetOne('posts', { id: 1 }), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        // Wait a bit for the auth check to be called
        await waitFor(() => {
          expect(authProvider.checkError).toHaveBeenCalled()
        })
        // Expected behavior: redirect to login should be triggered
        expect((result.current as unknown as { shouldRedirectToLogin?: boolean }).shouldRedirectToLogin).toBe(true)
      })

      it('should handle token refresh failure', async () => {
        const tokenError = new Error('Token refresh failed')
        ;(tokenError as Error & { code?: string }).code = 'TOKEN_REFRESH_FAILED'
        const authProvider = createMockAuthProvider({
          checkError: vi.fn().mockRejectedValue(tokenError),
        })
        const dataProvider = createMockDataProvider({
          getList: vi.fn().mockRejectedValue(new HttpError('Unauthorized', 401)),
        })

        const { result } = renderHook(
          () => useGetList('posts', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
          }),
          { wrapper: createWrapper(dataProvider, authProvider) }
        )

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        // Wait for the auth check to be called
        await waitFor(() => {
          expect(authProvider.checkError).toHaveBeenCalled()
        })
      })

      it('should preserve original request data during session recovery', async () => {
        const authProvider = createMockAuthProvider({
          checkError: vi.fn().mockResolvedValue(undefined),
        })
        let callCount = 0
        const dataProvider = createMockDataProvider({
          update: vi.fn().mockImplementation((resource, params) => {
            callCount++
            if (callCount === 1) {
              return Promise.reject(new HttpError('Session Expired', 401))
            }
            return Promise.resolve({ data: { id: params.id, ...params.data } })
          }),
        })

        const { result } = renderHook(() => useUpdate('posts'), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        const originalData = { title: 'Updated Title' }

        await act(async () => {
          try {
            await result.current.mutateAsync({ id: 1, data: originalData })
          } catch {
            // First call fails
          }
        })

        // Expected enhancement: original request should be retryable with same data
        const retry = (result.current as unknown as { retry?: () => Promise<unknown> }).retry
        expect(retry).toBeDefined()
      })
    })

    describe('Permission Denied', () => {
      it('should handle permission denied on resource access', async () => {
        const forbiddenError = new HttpError('Forbidden', 403, {
          resource: 'admin-settings',
          requiredRole: 'admin',
        })
        const authProvider = createMockAuthProvider({
          checkError: vi.fn().mockResolvedValue(undefined),
          getPermissions: vi.fn().mockResolvedValue(['user']),
        })
        const dataProvider = createMockDataProvider({
          getOne: vi.fn().mockRejectedValue(forbiddenError),
        })

        const { result } = renderHook(() => useGetOne('admin-settings', { id: 1 }), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toBeDefined()
        expect((result.current.error as HttpError).status).toBe(403)
        // Expected enhancement: permission info in error
        expect((result.current.error as HttpError).body).toEqual({
          resource: 'admin-settings',
          requiredRole: 'admin',
        })
      })

      it('should handle write permission denied', async () => {
        const forbiddenError = new HttpError('Write access denied', 403, {
          action: 'create',
          resource: 'posts',
        })
        const authProvider = createMockAuthProvider()
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(forbiddenError),
        })

        const { result } = renderHook(() => useCreate('posts'), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: { title: 'New Post' } })
          } catch {
            // Expected to throw
          }
        })

        expect((result.current.error as HttpError).status).toBe(403)
        expect((result.current.error as HttpError).body).toMatchObject({
          action: 'create',
          resource: 'posts',
        })
      })

      it('should handle delete permission denied', async () => {
        const forbiddenError = new HttpError('Delete not allowed', 403, {
          action: 'delete',
          resource: 'posts',
          reason: 'Record is protected',
        })
        const authProvider = createMockAuthProvider()
        const dataProvider = createMockDataProvider({
          delete: vi.fn().mockRejectedValue(forbiddenError),
        })

        const { result } = renderHook(() => useDelete('posts'), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ id: 1 })
          } catch {
            // Expected to throw
          }
        })

        expect((result.current.error as HttpError).status).toBe(403)
        expect((result.current.error as HttpError).body).toMatchObject({
          reason: 'Record is protected',
        })
      })
    })

    describe('Logout Error Handling', () => {
      it('should handle logout failure gracefully', async () => {
        const authProvider = createMockAuthProvider({
          logout: vi.fn().mockRejectedValue(new Error('Logout failed')),
        })
        const dataProvider = createMockDataProvider()

        const { result } = renderHook(() => useLogout(), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await act(async () => {
          try {
            await result.current.logout()
          } catch {
            // Expected to throw
          }
        })

        // Expected behavior: should still redirect to login page even on logout error
        expect(result.current.error).toBeDefined()
      })

      it('should clear local state on logout even if server call fails', async () => {
        const authProvider = createMockAuthProvider({
          logout: vi.fn().mockRejectedValue(new NetworkError()),
        })
        const dataProvider = createMockDataProvider()

        const { result } = renderHook(() => useLogout(), {
          wrapper: createWrapper(dataProvider, authProvider),
        })

        await act(async () => {
          try {
            await result.current.logout()
          } catch {
            // Expected to throw
          }
        })

        // Expected enhancement: local state should be cleared regardless of server error
        expect((result.current as unknown as { isLocalStateCleaned?: boolean }).isLocalStateCleaned).toBe(true)
      })
    })
  })

  /**
   * Section 3: Form Submission Errors
   */
  describe('Form Submission Errors', () => {
    describe('Field-Level Validation Errors', () => {
      it('should parse server validation errors into field errors', async () => {
        const validationError = new ValidationError('Validation failed', {
          email: ['Email is already taken'],
          username: ['Username must be unique'],
        })
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(validationError),
        })

        const { result } = renderHook(() => useCreate('users'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({
              data: { email: 'taken@example.com', username: 'taken' },
            })
          } catch {
            // Expected to throw
          }
        })

        const error = result.current.error as ValidationError
        expect(error.errors.email).toContain('Email is already taken')
        expect(error.errors.username).toContain('Username must be unique')
      })

      it('should handle nested field validation errors', async () => {
        const validationError = new ValidationError('Validation failed', {
          'address.street': ['Street is required'],
          'address.city': ['City is required'],
          'contacts.0.email': ['Invalid email format'],
        })
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(validationError),
        })

        const { result } = renderHook(() => useCreate('customers'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({
              data: { address: {}, contacts: [{ email: 'invalid' }] },
            })
          } catch {
            // Expected to throw
          }
        })

        const error = result.current.error as ValidationError
        expect(error.errors['address.street']).toBeDefined()
        expect(error.errors['contacts.0.email']).toBeDefined()
      })

      it('should provide hasFieldError helper', async () => {
        const validationError = new ValidationError('Validation failed', {
          email: ['Invalid'],
        })
        const dataProvider = createMockDataProvider({
          update: vi.fn().mockRejectedValue(validationError),
        })

        const { result } = renderHook(() => useUpdate('users'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ id: 1, data: { email: 'bad' } })
          } catch {
            // Expected to throw
          }
        })

        // Expected enhancement: hasFieldError helper
        const hasFieldError = (result.current as unknown as { hasFieldError?: (field: string) => boolean }).hasFieldError
        expect(hasFieldError).toBeDefined()
        expect(hasFieldError?.('email')).toBe(true)
        expect(hasFieldError?.('name')).toBe(false)
      })
    })

    describe('Server-Side Validation Errors', () => {
      it('should handle 422 Unprocessable Entity', async () => {
        const httpError = new HttpError('Unprocessable Entity', 422, {
          errors: {
            email: ['has already been taken'],
          },
        })
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(httpError),
        })

        const { result } = renderHook(() => useCreate('users'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: { email: 'taken@example.com' } })
          } catch {
            // Expected to throw
          }
        })

        expect((result.current.error as HttpError).status).toBe(422)
        // Expected enhancement: should extract field errors from body
        expect((result.current as unknown as { fieldErrors?: Record<string, string[]> }).fieldErrors).toEqual({
          email: ['has already been taken'],
        })
      })

      it('should handle business logic validation errors', async () => {
        const httpError = new HttpError('Validation Error', 400, {
          code: 'BUSINESS_RULE_VIOLATION',
          message: 'Cannot delete user with active orders',
        })
        const dataProvider = createMockDataProvider({
          delete: vi.fn().mockRejectedValue(httpError),
        })

        const { result } = renderHook(() => useDelete('users'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ id: 1 })
          } catch {
            // Expected to throw
          }
        })

        expect((result.current.error as HttpError).body).toMatchObject({
          code: 'BUSINESS_RULE_VIOLATION',
        })
      })

      it('should differentiate between client and server validation', async () => {
        const serverError = new HttpError('Server Validation Failed', 400, {
          source: 'server',
          errors: { field: ['Server-side error'] },
        })
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(serverError),
        })

        const { result } = renderHook(() => useCreate('records'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: {} })
          } catch {
            // Expected to throw
          }
        })

        // Expected enhancement: isServerValidationError flag
        expect((result.current as unknown as { isServerValidationError?: boolean }).isServerValidationError).toBe(true)
      })
    })

    describe('Submission Failures', () => {
      it('should handle create submission failure', async () => {
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(new Error('Create failed')),
        })

        const { result } = renderHook(() => useCreate('posts'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: { title: 'New Post' } })
          } catch {
            // Expected to throw
          }
        })

        expect(result.current.error).toBeDefined()
        expect(result.current.isError).toBe(true)
      })

      it('should handle update submission failure', async () => {
        const dataProvider = createMockDataProvider({
          update: vi.fn().mockRejectedValue(new Error('Update failed')),
        })

        const { result } = renderHook(() => useUpdate('posts'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ id: 1, data: { title: 'Updated' } })
          } catch {
            // Expected to throw
          }
        })

        expect(result.current.error).toBeDefined()
        expect(result.current.isError).toBe(true)
      })

      it('should handle concurrent modification error', async () => {
        const conflictError = new HttpError('Conflict', 409, {
          message: 'Record was modified by another user',
          currentVersion: 2,
          submittedVersion: 1,
        })
        const dataProvider = createMockDataProvider({
          update: vi.fn().mockRejectedValue(conflictError),
        })

        const { result } = renderHook(() => useUpdate('posts'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ id: 1, data: { title: 'Updated' } })
          } catch {
            // Expected to throw
          }
        })

        expect((result.current.error as HttpError).status).toBe(409)
        // Expected enhancement: isConflictError helper
        expect((result.current as unknown as { isConflictError?: boolean }).isConflictError).toBe(true)
      })

      it('should preserve form data on submission failure for retry', async () => {
        let callCount = 0
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockImplementation(() => {
            callCount++
            if (callCount === 1) {
              return Promise.reject(new HttpError('Server Error', 500))
            }
            return Promise.resolve({ data: { id: 1, title: 'Created' } })
          }),
        })

        const { result } = renderHook(() => useCreate('posts'), {
          wrapper: createWrapper(dataProvider),
        })

        const formData = { title: 'My New Post', content: 'Content here' }

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: formData })
          } catch {
            // Expected to throw
          }
        })

        expect(result.current.error).toBeDefined()

        // Expected enhancement: lastSubmittedData should be preserved
        expect((result.current as unknown as { lastSubmittedData?: typeof formData }).lastSubmittedData).toEqual(formData)
      })

      it('should track submission attempt count', async () => {
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(new Error('Failed')),
        })

        const { result } = renderHook(() => useCreate('posts'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: { title: 'Post' } })
          } catch {
            // Expected
          }
        })

        // Expected enhancement: submission attempt tracking
        expect((result.current as unknown as { submissionCount?: number }).submissionCount).toBe(1)

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: { title: 'Post' } })
          } catch {
            // Expected
          }
        })

        expect((result.current as unknown as { submissionCount?: number }).submissionCount).toBe(2)
      })
    })

    describe('Error Recovery in Forms', () => {
      it('should clear error when user starts editing after error', async () => {
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(new ValidationError('Invalid', { field: ['Error'] })),
        })

        const { result } = renderHook(() => useCreate('posts'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: { field: '' } })
          } catch {
            // Expected
          }
        })

        expect(result.current.error).toBeDefined()

        // Expected enhancement: clearError function
        const clearError = (result.current as unknown as { clearError?: () => void }).clearError
        expect(clearError).toBeDefined()

        act(() => {
          clearError?.()
        })

        expect(result.current.error).toBeNull()
      })

      it('should support partial error clearing for specific fields', async () => {
        const validationError = new ValidationError('Invalid', {
          email: ['Invalid email'],
          name: ['Name required'],
        })
        const dataProvider = createMockDataProvider({
          create: vi.fn().mockRejectedValue(validationError),
        })

        const { result } = renderHook(() => useCreate('users'), {
          wrapper: createWrapper(dataProvider),
        })

        await act(async () => {
          try {
            await result.current.mutateAsync({ data: { email: 'bad', name: '' } })
          } catch {
            // Expected
          }
        })

        // Expected enhancement: clearFieldError function
        const clearFieldError = (result.current as unknown as { clearFieldError?: (field: string) => void }).clearFieldError
        expect(clearFieldError).toBeDefined()

        act(() => {
          clearFieldError?.('email')
        })

        // Email error should be cleared, name error should remain
        const getFieldErrors = (result.current as unknown as { getFieldErrors?: (field: string) => string[] }).getFieldErrors
        expect(getFieldErrors?.('email')).toEqual([])
        expect(getFieldErrors?.('name')).toEqual(['Name required'])
      })
    })
  })

  /**
   * Section 4: Error Utilities
   */
  describe('Error Utilities', () => {
    it('should export HttpError class', () => {
      expect(HttpError).toBeDefined()
      const error = new HttpError('Not Found', 404)
      expect(error.status).toBe(404)
    })

    it('should export NetworkError class', () => {
      expect(NetworkError).toBeDefined()
      const error = new NetworkError()
      expect(error.name).toBe('NetworkError')
    })

    it('should export TimeoutError class', () => {
      expect(TimeoutError).toBeDefined()
      const error = new TimeoutError()
      expect(error.name).toBe('TimeoutError')
    })

    it('should export ValidationError class', () => {
      expect(ValidationError).toBeDefined()
      const error = new ValidationError('Invalid', { field: ['error'] })
      expect(error.errors).toHaveProperty('field')
    })
  })
})
