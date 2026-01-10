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

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { CanAccess } from './CanAccess'
import { AuthProviderContextProvider } from '../../contexts/AuthProviderContext'
import type { AuthProvider } from '../../types'

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
})
