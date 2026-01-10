/**
 * useCanAccess hook tests
 * TDD: RED phase - Write failing tests first
 *
 * This hook should:
 * 1. Return true when user has the required permission
 * 2. Return false when user lacks the required permission
 * 3. Handle permission arrays (user has one of the required permissions)
 * 4. Handle wildcard permissions (e.g., admin.* matches admin.read, admin.write)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useCanAccess } from './useCanAccess'
import { AuthProviderContextProvider } from '../contexts/AuthProviderContext'
import type { AuthProvider } from 'ra-core'

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

describe('useCanAccess', () => {
  let authProvider: AuthProvider

  beforeEach(() => {
    authProvider = createMockAuthProvider()
  })

  describe('basic permission check', () => {
    it('should return true when user has the required permission', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin', 'editor', 'viewer']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should return false when user lacks the required permission', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
    })

    it('should return false when user has no permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue([]),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
    })
  })

  describe('permission arrays', () => {
    it('should return true when user has any of the required permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['editor']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: ['admin', 'editor'] }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should return false when user has none of the required permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: ['admin', 'editor'] }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
    })

    it('should support requireAll option to require all permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin', 'editor']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: ['admin', 'editor'], requireAll: true }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should return false with requireAll when user lacks one permission', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: ['admin', 'editor'], requireAll: true }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
    })
  })

  describe('wildcard permissions', () => {
    it('should match wildcard permission admin.* to admin.read', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin.*']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin.read' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should match wildcard permission admin.* to admin.write', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin.*']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin.write' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should not match wildcard admin.* to editor.read', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin.*']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'editor.read' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
    })

    it('should match global wildcard * to any permission', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['*']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin.delete.posts' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should match nested wildcard posts.* to posts.create', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.*']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'posts.create' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should match multi-level wildcard posts.comments.* to posts.comments.delete', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.comments.*']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'posts.comments.delete' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })
  })

  describe('resource and action based permissions', () => {
    it('should support resource and action parameters', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.read', 'posts.create']),
      })

      const { result } = renderHook(
        () => useCanAccess({ resource: 'posts', action: 'read' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should deny access for unauthorized resource action', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.read']),
      })

      const { result } = renderHook(
        () => useCanAccess({ resource: 'posts', action: 'delete' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
    })

    it('should support record-level permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue({
          posts: { read: true, create: true, delete: false },
        }),
      })

      const { result } = renderHook(
        () => useCanAccess({ resource: 'posts', action: 'create' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should deny access for denied record-level permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue({
          posts: { read: true, create: true, delete: false },
        }),
      })

      const { result } = renderHook(
        () => useCanAccess({ resource: 'posts', action: 'delete' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
    })
  })

  describe('loading state', () => {
    it('should have isLoading true while permissions are being fetched', async () => {
      let resolvePermissions: (value: unknown) => void
      const permissionsPromise = new Promise((resolve) => {
        resolvePermissions = resolve
      })
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockReturnValue(permissionsPromise),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      expect(result.current.isLoading).toBe(true)
      expect(result.current.canAccess).toBe(false) // Default to false while loading

      resolvePermissions!(['admin'])

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should default canAccess to false during loading', async () => {
      let resolvePermissions: (value: unknown) => void
      const permissionsPromise = new Promise((resolve) => {
        resolvePermissions = resolve
      })
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockReturnValue(permissionsPromise),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      expect(result.current.canAccess).toBe(false)

      resolvePermissions!(['admin'])
    })
  })

  describe('error handling', () => {
    it('should return canAccess false when getPermissions fails', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue(new Error('Failed to fetch')),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
      expect(result.current.error).toBeDefined()
    })

    it('should expose error state', async () => {
      const error = new Error('Permission check failed')
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue(error),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toEqual(error)
    })
  })

  describe('custom permission check function', () => {
    it('should support custom canAccessCheck function', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue({
          level: 5,
          department: 'engineering',
        }),
      })

      const canAccessCheck = (permissions: unknown) => {
        const perms = permissions as { level: number; department: string }
        return perms.level >= 3 && perms.department === 'engineering'
      }

      const { result } = renderHook(
        () => useCanAccess({ canAccessCheck }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should return false when custom check fails', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue({
          level: 2,
          department: 'marketing',
        }),
      })

      const canAccessCheck = (permissions: unknown) => {
        const perms = permissions as { level: number; department: string }
        return perms.level >= 3 && perms.department === 'engineering'
      }

      const { result } = renderHook(
        () => useCanAccess({ canAccessCheck }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
    })
  })

  describe('return value', () => {
    it('should return canAccess, isLoading, and error', async () => {
      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      expect(result.current).toHaveProperty('canAccess')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
    })

    it('should return correct types', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(typeof result.current.canAccess).toBe('boolean')
      expect(typeof result.current.isLoading).toBe('boolean')
    })
  })

  describe('caching', () => {
    it('should use cached permissions from usePermissions', async () => {
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

      // First call
      const { result: result1 } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false)
      })

      // Second call should use cache
      const { result: result2 } = renderHook(
        () => useCanAccess({ permission: 'editor' }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result2.current.isLoading).toBe(false)
      })

      // Should only have called getPermissions once due to caching
      expect(authProvider.getPermissions).toHaveBeenCalledTimes(1)
    })
  })
})
