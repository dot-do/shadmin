/**
 * usePermissions hook tests
 * TDD: RED phase - Write failing tests first
 *
 * This hook should:
 * 1. Return permissions from AuthProvider.getPermissions()
 * 2. Handle loading state while fetching permissions
 * 3. Handle errors when getPermissions fails
 * 4. Cache permissions to avoid redundant fetches
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'


import { usePermissions } from './usePermissions'
import { AuthProviderContextProvider } from '../contexts/AuthProviderContext'

import type { AuthProvider } from '../facade'
import type { ReactNode } from 'react'

// Test wrapper with required providers
const createWrapper = (authProvider: AuthProvider) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProviderContextProvider authProvider={authProvider}>
          {children}
        </AuthProviderContextProvider>
      </QueryClientProvider>
    )
  }
}

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

describe('usePermissions', () => {
  let authProvider: AuthProvider

  beforeEach(() => {
    authProvider = createMockAuthProvider()
  })

  describe('basic functionality', () => {
    it('should return permissions from AuthProvider.getPermissions()', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin', 'editor']),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toEqual(['admin', 'editor'])
      expect(authProvider.getPermissions).toHaveBeenCalled()
    })

    it('should return permission objects from getPermissions()', async () => {
      const permissionObject = {
        canRead: true,
        canWrite: true,
        canDelete: false,
        roles: ['admin'],
      }
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(permissionObject),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toEqual(permissionObject)
    })

    it('should return undefined permissions initially before fetch completes', () => {
      let resolvePermissions: (value: unknown) => void
      const permissionsPromise = new Promise((resolve) => {
        resolvePermissions = resolve
      })
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockReturnValue(permissionsPromise),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      expect(result.current.permissions).toBeUndefined()

      // Cleanup: resolve the promise
      resolvePermissions!(['admin'])
    })
  })

  describe('loading state', () => {
    it('should have isLoading true while fetching permissions', async () => {
      let resolvePermissions: (value: unknown) => void
      const permissionsPromise = new Promise((resolve) => {
        resolvePermissions = resolve
      })
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockReturnValue(permissionsPromise),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      expect(result.current.isLoading).toBe(true)

      // Resolve permissions
      resolvePermissions!(['admin'])

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should set isLoading to false after permissions are fetched', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['user']),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toEqual(['user'])
    })

    it('should set isLoading to false after error', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue(new Error('Failed to fetch permissions')),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('should set error when getPermissions fails', async () => {
      const error = new Error('Permission fetch failed')
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue(error),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toEqual(error)
      expect(result.current.permissions).toBeUndefined()
    })

    it('should have error as null when fetch succeeds', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBeNull()
    })

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error')
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue(networkError),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.error).toEqual(networkError)
      })
    })
  })

  describe('caching', () => {
    it('should cache permissions and not refetch on subsequent renders', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <AuthProviderContextProvider authProvider={authProvider}>
            {children}
          </AuthProviderContextProvider>
        </QueryClientProvider>
      )

      // First render
      const { result, rerender } = renderHook(() => usePermissions(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(authProvider.getPermissions).toHaveBeenCalledTimes(1)

      // Rerender
      rerender()

      // Should still have permissions without calling getPermissions again
      expect(result.current.permissions).toEqual(['admin'])
      expect(authProvider.getPermissions).toHaveBeenCalledTimes(1)
    })

    it('should share cached permissions across multiple hook instances', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['editor']),
      })

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 5 * 60 * 1000,
          },
        },
      })

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <AuthProviderContextProvider authProvider={authProvider}>
            {children}
          </AuthProviderContextProvider>
        </QueryClientProvider>
      )

      // First hook instance
      const { result: result1 } = renderHook(() => usePermissions(), { wrapper })

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false)
      })

      // Second hook instance should use cached value
      const { result: result2 } = renderHook(() => usePermissions(), { wrapper })

      await waitFor(() => {
        expect(result2.current.isLoading).toBe(false)
      })

      expect(result1.current.permissions).toEqual(['editor'])
      expect(result2.current.permissions).toEqual(['editor'])
      expect(authProvider.getPermissions).toHaveBeenCalledTimes(1)
    })

    it('should support refetch function to force refresh permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi
          .fn()
          .mockResolvedValueOnce(['user'])
          .mockResolvedValueOnce(['admin', 'user']),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toEqual(['user'])
      expect(result.current.refetch).toBeDefined()

      // Force refetch
      await result.current.refetch()

      await waitFor(() => {
        expect(result.current.permissions).toEqual(['admin', 'user'])
      })

      expect(authProvider.getPermissions).toHaveBeenCalledTimes(2)
    })
  })

  describe('options', () => {
    it('should support enabled option to disable fetching', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(() => usePermissions({ enabled: false }), {
        wrapper: createWrapper(authProvider),
      })

      // Should not be loading when disabled
      expect(result.current.isLoading).toBe(false)
      expect(result.current.permissions).toBeUndefined()
      expect(authProvider.getPermissions).not.toHaveBeenCalled()
    })

    it('should pass params to getPermissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const params = { resource: 'posts', action: 'edit' }
      const { result } = renderHook(() => usePermissions({ params }), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(authProvider.getPermissions).toHaveBeenCalledWith(params)
    })
  })

  describe('return value', () => {
    it('should return permissions, isLoading, error, and refetch', async () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      expect(result.current).toHaveProperty('permissions')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('refetch')
    })

    it('should have correct types for return values', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(typeof result.current.isLoading).toBe('boolean')
      expect(typeof result.current.refetch).toBe('function')
      expect(result.current.error === null || result.current.error instanceof Error).toBe(true)
    })
  })

  describe('edge cases - undefined/null permissions', () => {
    it('should treat getPermissions returning undefined as an error (React Query restriction)', async () => {
      // React Query doesn't allow undefined as query data
      // This tests that our hook handles this gracefully
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(undefined),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // React Query treats undefined data as an error
      expect(result.current.error).toBeDefined()
    })

    it('should handle getPermissions returning null', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(null),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('should handle getPermissions returning empty string', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(''),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toBe('')
    })

    it('should handle getPermissions returning zero', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(0),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toBe(0)
    })

    it('should handle getPermissions returning false', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(false),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toBe(false)
    })
  })

  describe('edge cases - various permission data types', () => {
    it('should support string permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue('admin'),
      })

      const { result } = renderHook(() => usePermissions<string>(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toBe('admin')
    })

    it('should support number permissions (role levels)', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(5),
      })

      const { result } = renderHook(() => usePermissions<number>(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toBe(5)
    })

    it('should support complex object permissions', async () => {
      const complexPermissions = {
        role: 'admin',
        level: 5,
        resources: {
          posts: { read: true, write: true, delete: false },
          users: { read: true, write: false, delete: false },
        },
        features: ['dashboard', 'reports', 'settings'],
        metadata: {
          lastUpdated: '2024-01-01',
          version: 2,
        },
      }

      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(complexPermissions),
      })

      const { result } = renderHook(() => usePermissions<typeof complexPermissions>(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toEqual(complexPermissions)
    })

    it('should support Set permissions', async () => {
      const setPermissions = new Set(['admin', 'editor', 'viewer'])

      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(setPermissions),
      })

      const { result } = renderHook(() => usePermissions<Set<string>>(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toBe(setPermissions)
    })

    it('should support Map permissions', async () => {
      const mapPermissions = new Map([
        ['posts', { read: true, write: true }],
        ['users', { read: true, write: false }],
      ])

      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(mapPermissions),
      })

      const { result } = renderHook(() => usePermissions<Map<string, { read: boolean; write: boolean }>>(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toBe(mapPermissions)
    })
  })

  describe('edge cases - error types', () => {
    it('should handle thrown string errors', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue('Permission denied'),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.permissions).toBeUndefined()
    })

    it('should handle thrown custom error objects', async () => {
      class CustomAuthError extends Error {
        code: string
        constructor(message: string, code: string) {
          super(message)
          this.code = code
          this.name = 'CustomAuthError'
        }
      }

      const customError = new CustomAuthError('Not authenticated', 'AUTH_REQUIRED')
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue(customError),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe(customError)
    })

    it('should handle thrown null/undefined', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue(null),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // React Query wraps non-Error values
      expect(result.current.error).toBeDefined()
    })
  })

  describe('edge cases - params handling', () => {
    it('should use different cache keys for different params', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn()
          .mockResolvedValueOnce(['admin'])
          .mockResolvedValueOnce(['editor']),
      })

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 5 * 60 * 1000,
          },
        },
      })

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <AuthProviderContextProvider authProvider={authProvider}>
            {children}
          </AuthProviderContextProvider>
        </QueryClientProvider>
      )

      // First call with params1
      const { result: result1 } = renderHook(
        () => usePermissions({ params: { scope: 'global' } }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false)
      })

      // Second call with different params
      const { result: result2 } = renderHook(
        () => usePermissions({ params: { scope: 'local' } }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result2.current.isLoading).toBe(false)
      })

      // Different params should result in different calls
      expect(authProvider.getPermissions).toHaveBeenCalledTimes(2)
      expect(authProvider.getPermissions).toHaveBeenCalledWith({ scope: 'global' })
      expect(authProvider.getPermissions).toHaveBeenCalledWith({ scope: 'local' })
    })

    it('should pass undefined params when not specified', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(authProvider.getPermissions).toHaveBeenCalledWith(undefined)
    })

    it('should handle empty params object', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(() => usePermissions({ params: {} }), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(authProvider.getPermissions).toHaveBeenCalledWith({})
    })
  })

  describe('edge cases - enabled state transitions', () => {
    it('should start fetching when enabled changes from false to true', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result, rerender } = renderHook(
        ({ enabled }) => usePermissions({ enabled }),
        {
          wrapper: createWrapper(authProvider),
          initialProps: { enabled: false },
        }
      )

      // Initially disabled
      expect(result.current.isLoading).toBe(false)
      expect(result.current.permissions).toBeUndefined()
      expect(authProvider.getPermissions).not.toHaveBeenCalled()

      // Enable fetching
      rerender({ enabled: true })

      await waitFor(() => {
        expect(result.current.permissions).toEqual(['admin'])
      })

      expect(authProvider.getPermissions).toHaveBeenCalledTimes(1)
    })

    it('should maintain cached data when disabled after fetch', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 5 * 60 * 1000,
          },
        },
      })

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <AuthProviderContextProvider authProvider={authProvider}>
            {children}
          </AuthProviderContextProvider>
        </QueryClientProvider>
      )

      const { result, rerender } = renderHook(
        ({ enabled }) => usePermissions({ enabled }),
        {
          wrapper,
          initialProps: { enabled: true },
        }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toEqual(['admin'])

      // Disable - should maintain cached data
      rerender({ enabled: false })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.permissions).toEqual(['admin'])
    })
  })

  describe('edge cases - slow permissions fetch', () => {
    it('should handle very slow permission fetches', async () => {
      let resolvePermissions: (value: unknown) => void
      const slowPromise = new Promise((resolve) => {
        resolvePermissions = resolve
      })

      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockReturnValue(slowPromise),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      // Should be loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.permissions).toBeUndefined()

      // Wait a bit (simulating slow network)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Still loading
      expect(result.current.isLoading).toBe(true)

      // Finally resolve
      resolvePermissions!(['admin'])

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toEqual(['admin'])
    })
  })

  describe('edge cases - refetch behavior', () => {
    it('should update permissions after refetch with different data', async () => {
      let callCount = 0
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockImplementation(() => {
          callCount++
          return Promise.resolve(callCount === 1 ? ['user'] : ['admin', 'user'])
        }),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toEqual(['user'])

      // Refetch
      await result.current.refetch()

      await waitFor(() => {
        expect(result.current.permissions).toEqual(['admin', 'user'])
      })
    })

    it('should handle refetch that fails after successful initial fetch', async () => {
      let callCount = 0
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockImplementation(() => {
          callCount++
          if (callCount === 1) {
            return Promise.resolve(['admin'])
          }
          return Promise.reject(new Error('Refetch failed'))
        }),
      })

      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(authProvider),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.permissions).toEqual(['admin'])

      // Refetch - this will fail
      await result.current.refetch()

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })
    })
  })
})
