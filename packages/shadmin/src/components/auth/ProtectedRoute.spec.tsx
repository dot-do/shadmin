/**
 * ProtectedRoute component tests
 * TDD: RED phase - Write failing tests first
 *
 * This component should:
 * 1. Check auth state from AuthProviderContext
 * 2. Show loading spinner during auth check
 * 3. Redirect to /login if not authenticated
 * 4. Render children if authenticated
 * 5. Optionally check roles/permissions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { AuthProviderContextProvider } from '../../contexts/AuthProviderContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import type { AuthProvider } from '../facade'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router'

// Helper component to capture current location for testing redirects
const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

// Test wrapper with required providers
const createWrapper = (authProvider: AuthProvider, initialRoute = '/protected') => {
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
    return (
      <MemoryRouter initialEntries={[initialRoute]}>
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <AuthProviderContextProvider authProvider={authProvider}>
              {children}
              <LocationDisplay />
            </AuthProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      </MemoryRouter>
    )
  }
}

// Wrapper that includes routing context for redirect testing
const createRoutingWrapper = (authProvider: AuthProvider, initialRoute = '/protected') => {
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
    return (
      <MemoryRouter initialEntries={[initialRoute]}>
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <AuthProviderContextProvider authProvider={authProvider}>
              <Routes>
                <Route path="/protected" element={children} />
                <Route path="/login" element={<div>Login Page</div>} />
                <Route path="/custom-login" element={<div>Custom Login Page</div>} />
                <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
              </Routes>
              <LocationDisplay />
            </AuthProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      </MemoryRouter>
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

describe('ProtectedRoute', () => {
  let authProvider: AuthProvider

  beforeEach(() => {
    authProvider = createMockAuthProvider()
  })

  describe('rendering', () => {
    it('should render children when user is authenticated', async () => {
      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
      })
    })

    it('should not render children while auth check is in progress', async () => {
      let resolveCheckAuth: (value: unknown) => void
      const checkAuthPromise = new Promise((resolve) => {
        resolveCheckAuth = resolve
      })
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockReturnValue(checkAuthPromise),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      // Content should not be visible during loading
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()

      // Resolve auth check
      resolveCheckAuth!(undefined)

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
      })
    })
  })

  describe('loading state', () => {
    it('should show loading spinner during auth check', async () => {
      let resolveCheckAuth: (value: unknown) => void
      const checkAuthPromise = new Promise((resolve) => {
        resolveCheckAuth = resolve
      })
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockReturnValue(checkAuthPromise),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      // Should show loading state
      expect(screen.getByRole('status')).toBeInTheDocument()

      // Resolve auth check
      resolveCheckAuth!(undefined)

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      })
    })

    it('should accept custom loading component', async () => {
      let resolveCheckAuth: (value: unknown) => void
      const checkAuthPromise = new Promise((resolve) => {
        resolveCheckAuth = resolve
      })
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockReturnValue(checkAuthPromise),
      })

      const CustomLoader = () => <div data-testid="custom-loader">Custom Loading...</div>

      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute loading={<CustomLoader />}>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      expect(screen.getByTestId('custom-loader')).toBeInTheDocument()
      expect(screen.getByText('Custom Loading...')).toBeInTheDocument()

      resolveCheckAuth!(undefined)

      await waitFor(() => {
        expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument()
      })
    })
  })

  describe('authentication redirect', () => {
    it('should redirect to /login when user is not authenticated', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockRejectedValue(new Error('Not authenticated')),
      })

      const Wrapper = createRoutingWrapper(authProvider)
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent('/login')
      })

      // Protected content should not be visible
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })

    it('should redirect to custom path when loginPath prop is provided', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockRejectedValue(new Error('Not authenticated')),
      })

      const Wrapper = createRoutingWrapper(authProvider)
      render(
        <ProtectedRoute loginPath="/custom-login">
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent('/custom-login')
      })

      expect(screen.getByText('Custom Login Page')).toBeInTheDocument()
    })

    it('should preserve the original location for redirect after login', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockRejectedValue(new Error('Not authenticated')),
      })

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })

      // Capture the navigation state
      let capturedState: unknown

      const CaptureState = () => {
        const location = useLocation()
        capturedState = location.state
        return <div>Login Page</div>
      }

      render(
        <MemoryRouter initialEntries={['/protected/resource/123']}>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <Routes>
                  <Route
                    path="/protected/*"
                    element={
                      <ProtectedRoute>
                        <div>Protected Content</div>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<CaptureState />} />
                </Routes>
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument()
      })

      // Should have preserved the original location in state
      expect(capturedState).toEqual(
        expect.objectContaining({
          from: expect.objectContaining({
            pathname: '/protected/resource/123',
          }),
        })
      )
    })
  })

  describe('role-based access control', () => {
    it('should render children when user has required role', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['admin', 'user']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute requiredRoles={['admin']}>
          <div>Admin Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByText('Admin Content')).toBeInTheDocument()
      })
    })

    it('should render children when user has any of the required roles', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['editor']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute requiredRoles={['admin', 'editor']}>
          <div>Editor or Admin Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByText('Editor or Admin Content')).toBeInTheDocument()
      })
    })

    it('should redirect when user does not have required role', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['user']),
      })

      const Wrapper = createRoutingWrapper(authProvider)
      render(
        <ProtectedRoute requiredRoles={['admin']}>
          <div>Admin Only Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByText('Admin Only Content')).not.toBeInTheDocument()
      })

      // Should redirect to unauthorized page or login
      expect(screen.getByTestId('location')).toHaveTextContent('/unauthorized')
    })

    it('should use custom unauthorizedPath when user lacks permissions', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['user']),
      })

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <Routes>
                  <Route
                    path="/protected"
                    element={
                      <ProtectedRoute
                        requiredRoles={['admin']}
                        unauthorizedPath="/custom-unauthorized"
                      >
                        <div>Admin Content</div>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/custom-unauthorized"
                    element={<div>Custom Unauthorized</div>}
                  />
                </Routes>
                <LocationDisplay />
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent('/custom-unauthorized')
      })
    })

    it('should check permissions with requireAllRoles option', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const Wrapper = createRoutingWrapper(authProvider)
      render(
        <ProtectedRoute requiredRoles={['admin', 'superuser']} requireAllRoles>
          <div>Super Admin Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByText('Super Admin Content')).not.toBeInTheDocument()
      })

      // User has admin but not superuser, should be unauthorized
      expect(screen.getByTestId('location')).toHaveTextContent('/unauthorized')
    })

    it('should render when user has all required roles with requireAllRoles', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['admin', 'superuser', 'user']),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute requiredRoles={['admin', 'superuser']} requireAllRoles>
          <div>Super Admin Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByText('Super Admin Content')).toBeInTheDocument()
      })
    })
  })

  describe('permission-based access control', () => {
    it('should support permission object checking', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue({
          canRead: true,
          canWrite: true,
          canDelete: false,
        }),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute requiredPermissions={{ canWrite: true }}>
          <div>Write Access Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByText('Write Access Content')).toBeInTheDocument()
      })
    })

    it('should deny access when permission is not met', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue({
          canRead: true,
          canWrite: false,
          canDelete: false,
        }),
      })

      const Wrapper = createRoutingWrapper(authProvider)
      render(
        <ProtectedRoute requiredPermissions={{ canDelete: true }}>
          <div>Delete Access Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByText('Delete Access Content')).not.toBeInTheDocument()
        expect(screen.getByTestId('location')).toHaveTextContent('/unauthorized')
      })
    })

    it('should support custom permission check function', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue({
          level: 5,
          department: 'engineering',
        }),
      })

      const customCheck = (permissions: unknown) => {
        const perms = permissions as { level: number; department: string }
        return perms.level >= 3 && perms.department === 'engineering'
      }

      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute checkPermissions={customCheck}>
          <div>Engineering Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByText('Engineering Content')).toBeInTheDocument()
      })
    })

    it('should deny access when custom permission check fails', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue({
          level: 2,
          department: 'marketing',
        }),
      })

      const customCheck = (permissions: unknown) => {
        const perms = permissions as { level: number; department: string }
        return perms.level >= 3 && perms.department === 'engineering'
      }

      const Wrapper = createRoutingWrapper(authProvider)
      render(
        <ProtectedRoute checkPermissions={customCheck}>
          <div>Engineering Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.queryByText('Engineering Content')).not.toBeInTheDocument()
        expect(screen.getByTestId('location')).toHaveTextContent('/unauthorized')
      })
    })
  })

  describe('error handling', () => {
    it('should handle auth check error gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockRejectedValue(new Error('Network error')),
      })

      const Wrapper = createRoutingWrapper(authProvider)
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        // Should redirect to login on error
        expect(screen.getByTestId('location')).toHaveTextContent('/login')
      })

      consoleError.mockRestore()
    })

    it('should handle getPermissions error gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockRejectedValue(new Error('Permission fetch failed')),
      })

      const Wrapper = createRoutingWrapper(authProvider)
      render(
        <ProtectedRoute requiredRoles={['admin']}>
          <div>Admin Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        // Should redirect on permission error
        expect(screen.getByTestId('location')).toHaveTextContent('/unauthorized')
      })

      consoleError.mockRestore()
    })

    it('should call onError callback when auth check fails', async () => {
      const onError = vi.fn()
      const error = new Error('Auth check failed')
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockRejectedValue(error),
      })

      const Wrapper = createRoutingWrapper(authProvider)
      render(
        <ProtectedRoute onError={onError}>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error)
      })
    })

    it('should render custom error component when provided', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockRejectedValue(new Error('Auth error')),
      })

      const ErrorComponent = ({ error }: { error: Error }) => (
        <div data-testid="error-component">Error: {error.message}</div>
      )

      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute errorComponent={ErrorComponent}>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByTestId('error-component')).toBeInTheDocument()
        expect(screen.getByText('Error: Auth error')).toBeInTheDocument()
      })
    })
  })

  describe('auth context integration', () => {
    it('should call checkAuth from AuthProviderContext', async () => {
      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(authProvider.checkAuth).toHaveBeenCalled()
      })
    })

    it('should call getPermissions when requiredRoles is provided', async () => {
      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute requiredRoles={['admin']}>
          <div>Admin Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(authProvider.getPermissions).toHaveBeenCalled()
      })
    })

    it('should not call getPermissions when no role requirements', async () => {
      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
      })

      // Should not fetch permissions if not needed
      expect(authProvider.getPermissions).not.toHaveBeenCalled()
    })
  })

  describe('re-authentication', () => {
    it('should re-check auth when key prop changes', async () => {
      const Wrapper = createWrapper(authProvider)
      const { rerender } = render(
        <ProtectedRoute key="initial">
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      await waitFor(() => {
        expect(authProvider.checkAuth).toHaveBeenCalledTimes(1)
      })

      // Re-render with new key
      rerender(
        <ProtectedRoute key="updated">
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(authProvider.checkAuth).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('without AuthProvider', () => {
    it('should throw error when used outside AuthProviderContext', () => {
      const queryClient = new QueryClient()

      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() =>
        render(
          <MemoryRouter>
            <QueryClientProvider client={queryClient}>
              <ProtectedRoute>
                <div>Content</div>
              </ProtectedRoute>
            </QueryClientProvider>
          </MemoryRouter>
        )
      ).toThrow('useAuthProvider must be used within an AuthProviderContextProvider')

      consoleError.mockRestore()
    })
  })

  describe('accessibility', () => {
    it('should have accessible loading state', async () => {
      let resolveCheckAuth: (value: unknown) => void
      const checkAuthPromise = new Promise((resolve) => {
        resolveCheckAuth = resolve
      })
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockReturnValue(checkAuthPromise),
      })

      const Wrapper = createWrapper(authProvider)
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { wrapper: Wrapper }
      )

      // Loading state should be accessible
      const loader = screen.getByRole('status')
      expect(loader).toHaveAttribute('aria-label', expect.stringMatching(/loading/i))

      resolveCheckAuth!(undefined)
    })
  })
})
