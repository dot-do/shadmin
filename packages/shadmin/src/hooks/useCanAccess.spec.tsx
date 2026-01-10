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
import type { AuthProvider } from '../facade'

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

  describe('edge cases - undefined/null permissions', () => {
    it('should return false when getPermissions returns undefined (React Query error)', async () => {
      // React Query doesn't allow undefined as query data, causing an error
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(undefined),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When there's an error, canAccess should be false
      expect(result.current.canAccess).toBe(false)
      expect(result.current.error).toBeDefined()
    })

    it('should return false when permissions is null', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(null),
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

    it('should return false when getPermissions returns non-array primitive', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue('admin'),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // String is not an array, so permission check fails
      expect(result.current.canAccess).toBe(false)
    })
  })

  describe('edge cases - permission string matching', () => {
    it('should return false for empty string permission (treated as no permission)', async () => {
      // Empty string is falsy, so it's treated as no permission to check
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: '' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Empty string is falsy, so the permission check falls through to return false
      expect(result.current.canAccess).toBe(false)
    })

    it('should handle permission with special characters', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['user:read:posts']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'user:read:posts' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should not match similar but different permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin-read']),
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

    it('should be case-sensitive in permission matching', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['Admin']),
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

    it('should handle permissions array with non-string values gracefully', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin', 123, null, undefined, { role: 'editor' }]),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Should still find 'admin' despite other non-string values
      expect(result.current.canAccess).toBe(true)
    })
  })

  describe('edge cases - wildcard permissions', () => {
    it('should not match wildcard at wrong position (middle)', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin.*.write']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin.posts.write' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Wildcard only works at the end (admin.*)
      expect(result.current.canAccess).toBe(false)
    })

    it('should handle deeply nested permission paths', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['org.team.project.resource.*']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'org.team.project.resource.action' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })

    it('should not match partial prefix without wildcard', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin.read' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // 'admin' should not match 'admin.read' without wildcard
      expect(result.current.canAccess).toBe(false)
    })

    it('should match exact permission when user has global wildcard', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['*']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: 'deeply.nested.permission.path' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(true)
    })
  })

  describe('edge cases - resource/action with object permissions', () => {
    it('should handle missing resource in permission object', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue({
          posts: { read: true, create: true },
        }),
      })

      const { result } = renderHook(
        () => useCanAccess({ resource: 'comments', action: 'read' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
    })

    it('should handle missing action in permission object', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue({
          posts: { read: true },
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

    it('should handle explicitly false action in permission object', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue({
          posts: { read: true, delete: false },
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

    it('should handle nested null/undefined resource permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue({
          posts: null,
        }),
      })

      const { result } = renderHook(
        () => useCanAccess({ resource: 'posts', action: 'read' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.canAccess).toBe(false)
    })

    it('should prefer resource/action check over wildcard array when both provided', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.read', 'posts.*']),
      })

      const { result } = renderHook(
        () => useCanAccess({ resource: 'posts', action: 'read' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Resource/action check combines to posts.read which is in the array
      expect(result.current.canAccess).toBe(true)
    })
  })

  describe('edge cases - empty params', () => {
    it('should return false when no permission params provided', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(
        () => useCanAccess({}),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // No permission to check = no access
      expect(result.current.canAccess).toBe(false)
    })

    it('should return false when only resource provided without action', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.read']),
      })

      const { result } = renderHook(
        () => useCanAccess({ resource: 'posts' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Resource without action - no full resource/action check performed
      expect(result.current.canAccess).toBe(false)
    })

    it('should return false when only action provided without resource', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.read']),
      })

      const { result } = renderHook(
        () => useCanAccess({ action: 'read' }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Action without resource - no full resource/action check performed
      expect(result.current.canAccess).toBe(false)
    })
  })

  describe('edge cases - requireAll with empty arrays', () => {
    it('should return true when requireAll with empty permission array (vacuously true)', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: [], requireAll: true }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Empty array with requireAll - vacuously true (all zero conditions satisfied)
      // JavaScript's Array.prototype.every returns true for empty arrays
      expect(result.current.canAccess).toBe(true)
    })

    it('should return false with requireAll false and empty permission array', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const { result } = renderHook(
        () => useCanAccess({ permission: [], requireAll: false }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Empty array with requireAll: false uses Array.some which returns false for empty array
      expect(result.current.canAccess).toBe(false)
    })
  })

  describe('canAccessCheck function edge cases', () => {
    it('should prioritize canAccessCheck over permission string', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      // Custom check that returns false even though 'admin' permission exists
      const canAccessCheck = () => false

      const { result } = renderHook(
        () => useCanAccess({ permission: 'admin', canAccessCheck }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // canAccessCheck takes priority and returns false
      expect(result.current.canAccess).toBe(false)
    })

    it('should prioritize canAccessCheck over resource/action', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.read']),
      })

      // Custom check that returns true regardless of resource/action
      const canAccessCheck = () => true

      const { result } = renderHook(
        () => useCanAccess({ resource: 'posts', action: 'delete', canAccessCheck }),
        { wrapper: createWrapper(authProvider) }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // canAccessCheck takes priority and returns true
      expect(result.current.canAccess).toBe(true)
    })
  })
})
