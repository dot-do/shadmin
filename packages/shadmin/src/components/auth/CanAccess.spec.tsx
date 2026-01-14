/**
 * CanAccess component tests
 * TDD: RED phase - Write failing tests first
 *
 * This component should:
 * 1. Render children when user is authorized
 * 2. Render null when user is unauthorized
 * 3. Render fallback component when provided and unauthorized
 * 4. Handle loading state appropriately
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'


import { CanAccess } from './CanAccess'
import { AuthProviderContextProvider } from '../../contexts/AuthProviderContext'

import type { AuthProvider } from '../../facade'
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

describe('CanAccess', () => {
  let authProvider: AuthProvider

  beforeEach(() => {
    authProvider = createMockAuthProvider()
  })

  describe('rendering children when authorized', () => {
    it('should render children when user has the required permission', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin', 'editor']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })

      expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })

    it('should render children when user has any of the required permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['editor']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission={['admin', 'editor']}>
          <div data-testid="protected-content">Editor or Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })

    it('should render children when user has all required permissions with requireAll', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin', 'editor', 'viewer']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission={['admin', 'editor']} requireAll>
          <div data-testid="protected-content">Admin and Editor Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })

    it('should render children for wildcard permission match', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin.*']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin.read">
          <div data-testid="protected-content">Admin Read Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })
  })

  describe('rendering null when unauthorized', () => {
    it('should render null when user lacks the required permission', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const Wrapper = createWrapper(authProvider)
      const { container } = render(
        <CanAccess permission="admin">
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })

      // Container should be empty (null rendered)
      expect(container.firstChild).toBeNull()
    })

    it('should render null when user has none of the required permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission={['admin', 'editor']}>
          <div data-testid="protected-content">Protected Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })
    })

    it('should render null when user lacks one permission with requireAll', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission={['admin', 'editor']} requireAll>
          <div data-testid="protected-content">Protected Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })
    })

    it('should render null when getPermissions returns empty array', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue([]),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">
          <div data-testid="protected-content">Protected Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })
    })
  })

  describe('fallback rendering', () => {
    it('should render fallback when provided and user is unauthorized', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          permission="admin"
          fallback={<div data-testid="fallback">Access Denied</div>}
        >
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback')).toBeInTheDocument()
      })

      expect(screen.getByText('Access Denied')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('should not render fallback when user is authorized', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          permission="admin"
          fallback={<div data-testid="fallback">Access Denied</div>}
        >
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('fallback')).not.toBeInTheDocument()
    })

    it('should support function as fallback', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          permission="admin"
          fallback={() => <div data-testid="fallback-fn">Not Authorized</div>}
        >
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback-fn')).toBeInTheDocument()
      })

      expect(screen.getByText('Not Authorized')).toBeInTheDocument()
    })

    it('should pass permission info to fallback function', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const fallbackFn = vi.fn().mockReturnValue(<div>Fallback</div>)

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin" fallback={fallbackFn}>
          <div>Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(fallbackFn).toHaveBeenCalled()
      })

      expect(fallbackFn).toHaveBeenCalledWith(
        expect.objectContaining({
          permission: 'admin',
        })
      )
    })
  })

  describe('loading state', () => {
    it('should not render children while loading permissions', async () => {
      let resolvePermissions: (value: unknown) => void
      const permissionsPromise = new Promise((resolve) => {
        resolvePermissions = resolve
      })
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockReturnValue(permissionsPromise),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      // Should not show content while loading
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()

      // Resolve permissions
      resolvePermissions!(['admin'])

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })

    it('should render loading component when provided', async () => {
      let resolvePermissions: (value: unknown) => void
      const permissionsPromise = new Promise((resolve) => {
        resolvePermissions = resolve
      })
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockReturnValue(permissionsPromise),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          permission="admin"
          loading={<div data-testid="loading">Loading permissions...</div>}
        >
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      expect(screen.getByTestId('loading')).toBeInTheDocument()
      expect(screen.getByText('Loading permissions...')).toBeInTheDocument()

      resolvePermissions!(['admin'])

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      })
    })

    it('should hide loading component once permissions are loaded', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          permission="admin"
          loading={<div data-testid="loading">Loading...</div>}
        >
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    it('should not render fallback while loading', async () => {
      let resolvePermissions: (value: unknown) => void
      const permissionsPromise = new Promise((resolve) => {
        resolvePermissions = resolve
      })
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockReturnValue(permissionsPromise),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          permission="admin"
          fallback={<div data-testid="fallback">Access Denied</div>}
          loading={<div data-testid="loading">Loading...</div>}
        >
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      // Should show loading, not fallback
      expect(screen.getByTestId('loading')).toBeInTheDocument()
      expect(screen.queryByTestId('fallback')).not.toBeInTheDocument()

      // Resolve with no permissions - now should show fallback
      resolvePermissions!([])

      await waitFor(() => {
        expect(screen.getByTestId('fallback')).toBeInTheDocument()
      })
    })
  })

  describe('resource and action based permissions', () => {
    it('should support resource and action props', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.read', 'posts.create']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess resource="posts" action="read">
          <div data-testid="protected-content">Posts List</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })

    it('should hide content for unauthorized resource action', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.read']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess resource="posts" action="delete">
          <div data-testid="protected-content">Delete Posts</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })
    })

    it('should support permission object structure', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue({
          posts: { read: true, create: true, delete: false },
        }),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess resource="posts" action="create">
          <div data-testid="protected-content">Create Post</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })
  })

  describe('custom permission check', () => {
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

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess canAccessCheck={canAccessCheck}>
          <div data-testid="protected-content">Engineering Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })

    it('should render fallback when custom check fails', async () => {
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

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          canAccessCheck={canAccessCheck}
          fallback={<div data-testid="fallback">Not Engineering</div>}
        >
          <div data-testid="protected-content">Engineering Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('should render fallback when getPermissions fails', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue(new Error('Failed to fetch')),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          permission="admin"
          fallback={<div data-testid="fallback">Error occurred</div>}
        >
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('should render null when getPermissions fails and no fallback', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue(new Error('Failed to fetch')),
      })

      const Wrapper = createWrapper(authProvider)
      const { container } = render(
        <CanAccess permission="admin">
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })

      expect(container.firstChild).toBeNull()
    })

    it('should support onError callback', async () => {
      const error = new Error('Permission error')
      const onError = vi.fn()
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockRejectedValue(error),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin" onError={onError}>
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error)
      })
    })
  })

  describe('render prop pattern', () => {
    it('should support render prop for children', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">
          {({ canAccess }) => (
            <div data-testid="render-prop">
              {canAccess ? 'Has Access' : 'No Access'}
            </div>
          )}
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('render-prop')).toHaveTextContent('Has Access')
      })
    })

    it('should pass canAccess and permissions to render prop', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin', 'editor']),
      })

      const renderFn = vi.fn().mockReturnValue(<div>Content</div>)

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">{renderFn}</CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(renderFn).toHaveBeenCalledWith(
          expect.objectContaining({
            canAccess: true,
            permissions: ['admin', 'editor'],
          })
        )
      })
    })
  })

  describe('nested CanAccess components', () => {
    it('should support nested CanAccess components', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin', 'posts.delete']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">
          <div data-testid="admin-section">
            Admin Section
            <CanAccess permission="posts.delete">
              <button data-testid="delete-button">Delete Post</button>
            </CanAccess>
          </div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('admin-section')).toBeInTheDocument()
        expect(screen.getByTestId('delete-button')).toBeInTheDocument()
      })
    })

    it('should hide nested content when inner permission fails', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">
          <div data-testid="admin-section">
            Admin Section
            <CanAccess permission="posts.delete">
              <button data-testid="delete-button">Delete Post</button>
            </CanAccess>
          </div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('admin-section')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should maintain focus management when content appears', async () => {
      let resolvePermissions: (value: unknown) => void
      const permissionsPromise = new Promise((resolve) => {
        resolvePermissions = resolve
      })
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockReturnValue(permissionsPromise),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">
          <button data-testid="protected-button">Click Me</button>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      expect(screen.queryByTestId('protected-button')).not.toBeInTheDocument()

      resolvePermissions!(['admin'])

      await waitFor(() => {
        expect(screen.getByTestId('protected-button')).toBeInTheDocument()
      })

      // Button should be focusable
      const button = screen.getByTestId('protected-button')
      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })

  describe('edge cases - undefined/null permissions', () => {
    it('should render null when permissions is undefined', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(undefined),
      })

      const Wrapper = createWrapper(authProvider)
      const { container } = render(
        <CanAccess permission="admin">
          <div data-testid="protected-content">Protected Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })

      expect(container.firstChild).toBeNull()
    })

    it('should render null when permissions is null', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(null),
      })

      const Wrapper = createWrapper(authProvider)
      const { container } = render(
        <CanAccess permission="admin">
          <div data-testid="protected-content">Protected Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })

      expect(container.firstChild).toBeNull()
    })

    it('should render fallback when permissions is undefined', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(undefined),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          permission="admin"
          fallback={<div data-testid="fallback">No permissions</div>}
        >
          <div data-testid="protected-content">Protected Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback')).toBeInTheDocument()
      })
    })
  })

  describe('edge cases - empty permissions', () => {
    it('should not render children when user has empty permission array', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue([]),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })
    })

    it('should render fallback when empty permission array and fallback provided', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue([]),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          permission="admin"
          fallback={<div data-testid="fallback">Access Denied</div>}
        >
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback')).toBeInTheDocument()
      })
    })
  })

  describe('edge cases - global wildcard permission', () => {
    it('should render children when user has global wildcard (*)', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['*']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin.delete.users">
          <div data-testid="protected-content">Super Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })
  })

  describe('edge cases - multiple CanAccess with different permissions', () => {
    it('should render only components user has access to', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['posts.read', 'posts.create']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <div>
          <CanAccess permission="posts.read">
            <div data-testid="read-section">Read Posts</div>
          </CanAccess>
          <CanAccess permission="posts.create">
            <div data-testid="create-section">Create Posts</div>
          </CanAccess>
          <CanAccess permission="posts.delete">
            <div data-testid="delete-section">Delete Posts</div>
          </CanAccess>
        </div>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('read-section')).toBeInTheDocument()
        expect(screen.getByTestId('create-section')).toBeInTheDocument()
        expect(screen.queryByTestId('delete-section')).not.toBeInTheDocument()
      })
    })
  })

  describe('edge cases - render prop with denied access', () => {
    it('should pass canAccess false to render prop when unauthorized', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">
          {({ canAccess }) => (
            <div data-testid="render-prop-result">
              {canAccess ? 'Authorized' : 'Unauthorized'}
            </div>
          )}
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('render-prop-result')).toHaveTextContent('Unauthorized')
      })
    })

    it('should pass permissions to render prop even when canAccess is false', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer', 'guest']),
      })

      const renderFn = vi.fn().mockReturnValue(<div>Content</div>)

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin">{renderFn}</CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(renderFn).toHaveBeenCalledWith({
          canAccess: false,
          permissions: ['viewer', 'guest'],
        })
      })
    })
  })

  describe('edge cases - fallback function receives correct props', () => {
    it('should pass resource and action to fallback function', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const fallbackFn = vi.fn().mockReturnValue(<div data-testid="fallback">Fallback</div>)

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess resource="posts" action="delete" fallback={fallbackFn}>
          <div>Delete Posts</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(fallbackFn).toHaveBeenCalledWith({
          permission: undefined,
          resource: 'posts',
          action: 'delete',
        })
      })
    })

    it('should pass permission array to fallback function', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const fallbackFn = vi.fn().mockReturnValue(<div data-testid="fallback">Fallback</div>)

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission={['admin', 'superuser']} fallback={fallbackFn}>
          <div>Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(fallbackFn).toHaveBeenCalledWith({
          permission: ['admin', 'superuser'],
          resource: undefined,
          action: undefined,
        })
      })
    })
  })

  describe('edge cases - onError callback behavior', () => {
    it('should not call onError when permissions load successfully', async () => {
      const onError = vi.fn()
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin" onError={onError}>
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })

      expect(onError).not.toHaveBeenCalled()
    })

    it('should not call onError when access is denied but no error occurred', async () => {
      const onError = vi.fn()
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['viewer']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission="admin" onError={onError}>
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })

      expect(onError).not.toHaveBeenCalled()
    })
  })

  describe('edge cases - complex permission structures', () => {
    it('should support deeply nested object permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue({
          org: {
            teams: {
              engineering: {
                projects: {
                  read: true,
                  write: true,
                },
              },
            },
          },
        }),
      })

      const customCheck = (perms: unknown) => {
        const p = perms as {
          org?: { teams?: { engineering?: { projects?: { write?: boolean } } } }
        }
        return p?.org?.teams?.engineering?.projects?.write === true
      }

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess canAccessCheck={customCheck}>
          <div data-testid="protected-content">Engineering Project Access</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })
  })

  describe('edge cases - requireAll with permission arrays', () => {
    it('should not render when requireAll is true and user missing some permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission={['admin', 'superuser', 'owner']} requireAll>
          <div data-testid="protected-content">Full Access Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })
    })

    it('should render when requireAll is true and user has all permissions', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin', 'superuser', 'owner', 'viewer']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess permission={['admin', 'superuser', 'owner']} requireAll>
          <div data-testid="protected-content">Full Access Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })
  })

  describe('edge cases - component displayName', () => {
    it('should have displayName set to CanAccess', () => {
      expect(CanAccess.displayName).toBe('CanAccess')
    })
  })

  describe('edge cases - rapid permission changes', () => {
    it('should handle rapid permission updates correctly', async () => {
      const permissionValue = ['admin']
      const getPermissionsMock = vi.fn().mockImplementation(() => {
        return Promise.resolve(permissionValue)
      })

      authProvider = createMockAuthProvider({
        getPermissions: getPermissionsMock,
      })

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 0, // No stale time for this test
          },
        },
      })

      const Wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <AuthProviderContextProvider authProvider={authProvider}>
            {children}
          </AuthProviderContextProvider>
        </QueryClientProvider>
      )

      render(
        <CanAccess permission="admin">
          <div data-testid="protected-content">Admin Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })
  })

  describe('edge cases - custom canAccessCheck returning truthy/falsy values', () => {
    it('should treat truthy non-boolean return as true', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      // Returns truthy string instead of boolean
      const customCheck = () => 'truthy-value' as unknown as boolean

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess canAccessCheck={customCheck}>
          <div data-testid="protected-content">Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })

    it('should treat falsy non-boolean return as false', async () => {
      authProvider = createMockAuthProvider({
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      // Returns 0 (falsy) instead of boolean
      const customCheck = () => 0 as unknown as boolean

      const Wrapper = createWrapper(authProvider)
      render(
        <CanAccess
          canAccessCheck={customCheck}
          fallback={<div data-testid="fallback">No Access</div>}
        >
          <div data-testid="protected-content">Content</div>
        </CanAccess>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback')).toBeInTheDocument()
      })
    })
  })
})
