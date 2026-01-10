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

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { usePermissions } from './usePermissions'
import { AuthProviderContextProvider } from '../contexts/AuthProviderContext'
import type { AuthProvider } from '../types'

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
})
