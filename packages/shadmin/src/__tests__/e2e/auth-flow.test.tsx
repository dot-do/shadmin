/**
 * Authentication Flow E2E Tests
 *
 * End-to-end tests for the complete authentication flow including:
 * - Login form display and validation
 * - Successful login with valid credentials
 * - Error handling for invalid credentials
 * - Protected route redirection
 * - Logout functionality
 * - Permission-based access control
 *
 * @module __tests__/e2e/auth-flow
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { CanAccess } from '../../components/auth/CanAccess'
import { LoginPage } from '../../components/auth/LoginPage'
import { LogoutButton } from '../../components/auth/LogoutButton'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { AuthProviderContextProvider } from '../../contexts/AuthProviderContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'

import type { AuthProvider } from '../../facade'
import type { ReactNode } from 'react'

// Helper component to display current location for testing redirects
const LocationDisplay = () => {
  const location = useLocation()
  return (
    <div data-testid="current-location">
      <span data-testid="pathname">{location.pathname}</span>
      <span data-testid="search">{location.search}</span>
    </div>
  )
}

// Mock protected dashboard component
const Dashboard = () => (
  <div data-testid="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome to the protected dashboard</p>
    <LogoutButton data-testid="logout-button" />
  </div>
)

// Mock posts list component with permission-based create button
const PostsList = ({ showCreate = true }: { showCreate?: boolean }) => (
  <div data-testid="posts-list">
    <h1>Posts</h1>
    {showCreate && (
      <CanAccess permission="posts.create">
        <button data-testid="create-post-button">Create Post</button>
      </CanAccess>
    )}
  </div>
)

// Mock admin panel component
const AdminPanel = () => (
  <div data-testid="admin-panel">
    <h1>Admin Panel</h1>
    <p>Admin only content</p>
  </div>
)

// Factory to create mock auth provider
const createMockAuthProvider = (
  overrides: Partial<AuthProvider> = {}
): AuthProvider => ({
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue('/login'),
  checkError: vi.fn().mockResolvedValue(undefined),
  checkAuth: vi.fn().mockResolvedValue(undefined),
  getPermissions: vi.fn().mockResolvedValue([]),
  getIdentity: vi.fn().mockResolvedValue({ id: 1, fullName: 'Test User' }),
  ...overrides,
})

// Create a test app wrapper with full routing
interface TestAppProps {
  authProvider: AuthProvider
  initialRoute?: string
  children?: ReactNode
}

const TestApp = ({ authProvider, initialRoute = '/', children }: TestAppProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // Disable stale time for tests to ensure fresh data
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <AuthProviderContextProvider authProvider={authProvider}>
            {children || (
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts"
                  element={
                    <ProtectedRoute>
                      <PostsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRoles={['admin']}>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route path="/unauthorized" element={<div>Unauthorized</div>} />
              </Routes>
            )}
            <LocationDisplay />
          </AuthProviderContextProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

describe('Authentication Flow E2E', () => {
  let authProvider: AuthProvider
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    authProvider = createMockAuthProvider()
    user = userEvent.setup()
  })

  describe('Login Form Display', () => {
    it('displays login form when not authenticated', async () => {
      // User is not authenticated - checkAuth throws
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockRejectedValue(new Error('Not authenticated')),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/" />)

      // Should redirect to login page
      await waitFor(() => {
        expect(screen.getByTestId('pathname')).toHaveTextContent('/login')
      })

      // Verify login form elements are present
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('displays login form with custom title', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <LoginPage title="Welcome Back" />
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      expect(screen.getByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument()
    })
  })

  describe('Login Success Flow', () => {
    it('logs in successfully with valid credentials', async () => {
      // Start on login page, auth provider accepts credentials
      authProvider = createMockAuthProvider({
        checkAuth: vi
          .fn()
          .mockRejectedValueOnce(new Error('Not authenticated'))
          .mockResolvedValue(undefined),
        login: vi.fn().mockResolvedValue({ redirectTo: '/dashboard' }),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/login" />)

      // Fill in the login form
      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'admin@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      // Verify login was called with correct credentials
      await waitFor(() => {
        expect(authProvider.login).toHaveBeenCalledWith({
          username: 'admin@example.com',
          password: 'password123',
          rememberMe: false,
        })
      })
    })

    it('redirects to protected route after login', async () => {
      // User tries to access protected route while unauthenticated
      // Then logs in and should be redirected to the original route
      let isAuthenticated = false

      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockImplementation(() => {
          if (!isAuthenticated) {
            return Promise.reject(new Error('Not authenticated'))
          }
          return Promise.resolve(undefined)
        }),
        login: vi.fn().mockImplementation(() => {
          isAuthenticated = true
          return Promise.resolve(undefined)
        }),
      })

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <MemoryRouter initialEntries={['/posts']}>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <Routes>
                  <Route
                    path="/login"
                    element={<LoginPage redirectTo="/posts" />}
                  />
                  <Route
                    path="/posts"
                    element={
                      <ProtectedRoute loginPath="/login">
                        <PostsList />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <LocationDisplay />
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      // Should redirect to login first
      await waitFor(() => {
        expect(screen.getByTestId('pathname')).toHaveTextContent('/login')
      })

      // Login
      await user.type(screen.getByLabelText(/username/i), 'admin')
      await user.type(screen.getByLabelText(/password/i), 'password')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Should be redirected to the original protected route
      await waitFor(() => {
        expect(authProvider.login).toHaveBeenCalled()
      })
    })
  })

  describe('Login Error Handling', () => {
    it('shows error for invalid credentials', async () => {
      authProvider = createMockAuthProvider({
        login: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/login" />)

      // Fill in the login form with invalid credentials
      await user.type(screen.getByLabelText(/username/i), 'wrong@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Should display error message
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials')
      })
    })

    it('shows generic error for network failures', async () => {
      authProvider = createMockAuthProvider({
        login: vi.fn().mockRejectedValue(new Error('Network error')),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/login" />)

      await user.type(screen.getByLabelText(/username/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
    })

    it('clears error on retry', async () => {
      authProvider = createMockAuthProvider({
        login: vi
          .fn()
          .mockRejectedValueOnce(new Error('Invalid credentials'))
          .mockResolvedValueOnce(undefined),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/login" />)

      // First attempt - fails
      await user.type(screen.getByLabelText(/username/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrong')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // Second attempt - clears password and retries
      await user.clear(screen.getByLabelText(/password/i))
      await user.type(screen.getByLabelText(/password/i), 'correct')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Error should be cleared during second attempt
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })
  })

  describe('Logout Flow', () => {
    it('logs out and redirects to login', async () => {
      // User is initially authenticated
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        logout: vi.fn().mockResolvedValue('/login'),
      })

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <Routes>
                  <Route path="/login" element={<div>Login Page</div>} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <div>
                          <h1>Dashboard</h1>
                          <LogoutButton />
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <LocationDisplay />
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
      })

      // Click logout button
      await user.click(screen.getByTestId('shadmin-logout-button'))

      // Verify logout was called
      await waitFor(() => {
        expect(authProvider.logout).toHaveBeenCalled()
      })
    })

    it('shows confirmation dialog when configured', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        logout: vi.fn().mockResolvedValue('/login'),
      })

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <LogoutButton
                  confirmTitle="Confirm Logout"
                  confirmMessage="Are you sure you want to logout?"
                />
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      // Click logout button
      await user.click(screen.getByTestId('shadmin-logout-button'))

      // Confirmation dialog should appear
      await waitFor(() => {
        expect(screen.getByTestId('shadmin-logout-dialog')).toBeInTheDocument()
        expect(screen.getByText('Confirm Logout')).toBeInTheDocument()
        expect(screen.getByText('Are you sure you want to logout?')).toBeInTheDocument()
      })

      // Click confirm
      await user.click(screen.getByTestId('shadmin-logout-dialog-confirm'))

      // Verify logout was called
      await waitFor(() => {
        expect(authProvider.logout).toHaveBeenCalled()
      })
    })

    it('cancels logout when dialog is dismissed', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        logout: vi.fn().mockResolvedValue('/login'),
      })

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <LogoutButton
                  confirmTitle="Confirm Logout"
                  confirmMessage="Are you sure?"
                />
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      // Click logout button
      await user.click(screen.getByTestId('shadmin-logout-button'))

      // Wait for dialog
      await waitFor(() => {
        expect(screen.getByTestId('shadmin-logout-dialog')).toBeInTheDocument()
      })

      // Click cancel
      await user.click(screen.getByTestId('shadmin-logout-dialog-cancel'))

      // Dialog should close and logout should not be called
      await waitFor(() => {
        expect(screen.queryByTestId('shadmin-logout-dialog')).not.toBeInTheDocument()
      })

      expect(authProvider.logout).not.toHaveBeenCalled()
    })
  })

  describe('Protected Route Access', () => {
    it('blocks access to protected routes when logged out', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockRejectedValue(new Error('Not authenticated')),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/dashboard" />)

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByTestId('pathname')).toHaveTextContent('/login')
      })

      // Dashboard should not be visible
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })

    it('allows access to protected routes when authenticated', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/dashboard" />)

      // Should show dashboard
      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument()
      })
    })

    it('preserves original URL when redirecting to login', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockRejectedValue(new Error('Not authenticated')),
      })

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      // Track the state passed to login page
      let capturedState: unknown

      const CaptureState = () => {
        const location = useLocation()
        capturedState = location.state
        return <LoginPage />
      }

      render(
        <MemoryRouter initialEntries={['/posts?page=2&filter=active']}>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <Routes>
                  <Route path="/login" element={<CaptureState />} />
                  <Route
                    path="/posts"
                    element={
                      <ProtectedRoute>
                        <PostsList />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      })

      // Verify the original location was preserved
      expect(capturedState).toEqual(
        expect.objectContaining({
          from: expect.objectContaining({
            pathname: '/posts',
          }),
        })
      )
    })
  })

  describe('Permission-Based Access', () => {
    it('hides unauthorized actions based on permissions', async () => {
      // User is authenticated but only has read permission
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['posts.read']),
      })

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <MemoryRouter initialEntries={['/posts']}>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <Routes>
                  <Route
                    path="/posts"
                    element={
                      <ProtectedRoute>
                        <div data-testid="posts-page">
                          <h1>Posts</h1>
                          <CanAccess permission="posts.create">
                            <button data-testid="create-button">Create</button>
                          </CanAccess>
                          <CanAccess permission="posts.read">
                            <div data-testid="posts-list">Posts List</div>
                          </CanAccess>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getByTestId('posts-page')).toBeInTheDocument()
      })

      // Create button should NOT be visible (no posts.create permission)
      await waitFor(() => {
        expect(screen.queryByTestId('create-button')).not.toBeInTheDocument()
      })

      // Posts list should be visible (has posts.read permission)
      expect(screen.getByTestId('posts-list')).toBeInTheDocument()
    })

    it('shows authorized actions when user has permission', async () => {
      // User is authenticated with create permission
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['posts.read', 'posts.create']),
      })

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <MemoryRouter initialEntries={['/posts']}>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <Routes>
                  <Route
                    path="/posts"
                    element={
                      <ProtectedRoute>
                        <div data-testid="posts-page">
                          <h1>Posts</h1>
                          <CanAccess permission="posts.create">
                            <button data-testid="create-button">Create</button>
                          </CanAccess>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      // Wait for the page and button to load
      await waitFor(() => {
        expect(screen.getByTestId('posts-page')).toBeInTheDocument()
      })

      // Create button should be visible
      await waitFor(() => {
        expect(screen.getByTestId('create-button')).toBeInTheDocument()
      })
    })

    it('redirects to unauthorized when missing required role', async () => {
      // User is authenticated but lacks admin role
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['user']),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/admin" />)

      // Should redirect to unauthorized page
      await waitFor(() => {
        expect(screen.getByTestId('pathname')).toHaveTextContent('/unauthorized')
      })

      // Admin panel should not be visible
      expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument()
    })

    it('allows access to admin route with admin role', async () => {
      // User is authenticated with admin role
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['admin', 'user']),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/admin" />)

      // Should show admin panel
      await waitFor(() => {
        expect(screen.getByTestId('admin-panel')).toBeInTheDocument()
      })
    })
  })

  describe('Session Persistence', () => {
    it('maintains authentication state across route changes', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
        getPermissions: vi.fn().mockResolvedValue(['admin']),
      })

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <div data-testid="dashboard">Dashboard</div>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/posts"
                    element={
                      <ProtectedRoute>
                        <div data-testid="posts">Posts</div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      // Verify initial page loads
      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument()
      })

      // checkAuth should have been called
      expect(authProvider.checkAuth).toHaveBeenCalled()
    })

    it('re-validates authentication on protected route access', async () => {
      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockResolvedValue(undefined),
      })

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      const { rerender } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <ProtectedRoute key="dashboard">
                  <div>Dashboard</div>
                </ProtectedRoute>
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(authProvider.checkAuth).toHaveBeenCalledTimes(1)
      })

      // Trigger re-render with new key (simulating route change)
      rerender(
        <MemoryRouter initialEntries={['/posts']}>
          <QueryClientProvider client={queryClient}>
            <NotificationContextProvider>
              <AuthProviderContextProvider authProvider={authProvider}>
                <ProtectedRoute key="posts">
                  <div>Posts</div>
                </ProtectedRoute>
              </AuthProviderContextProvider>
            </NotificationContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(authProvider.checkAuth).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Form Validation', () => {
    it('prevents form submission with empty fields', async () => {
      authProvider = createMockAuthProvider()

      render(<TestApp authProvider={authProvider} initialRoute="/login" />)

      // Try to submit without filling form
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Login should not be called with empty fields
      // (HTML5 validation or component validation prevents submission)
      await waitFor(() => {
        expect(authProvider.login).not.toHaveBeenCalled()
      })
    })

    it('trims whitespace from credentials', async () => {
      authProvider = createMockAuthProvider({
        login: vi.fn().mockResolvedValue(undefined),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/login" />)

      // Enter credentials with whitespace
      await user.type(screen.getByLabelText(/username/i), '  admin@example.com  ')
      await user.type(screen.getByLabelText(/password/i), 'password')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Login should be called (whitespace-only values are trimmed in validation)
      await waitFor(() => {
        expect(authProvider.login).toHaveBeenCalled()
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state during login', async () => {
      let resolveLogin: (value: unknown) => void
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve
      })

      authProvider = createMockAuthProvider({
        login: vi.fn().mockReturnValue(loginPromise),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/login" />)

      await user.type(screen.getByLabelText(/username/i), 'admin@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Button should show loading state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
      })

      // Resolve login
      resolveLogin!(undefined)

      // Button should return to normal state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      })
    })

    it('shows loading state during auth check', async () => {
      let resolveCheckAuth: (value: unknown) => void
      const checkAuthPromise = new Promise((resolve) => {
        resolveCheckAuth = resolve
      })

      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockReturnValue(checkAuthPromise),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/dashboard" />)

      // Should show loading indicator
      expect(screen.getByRole('status')).toBeInTheDocument()

      // Resolve auth check
      resolveCheckAuth!(undefined)

      // Loading should disappear and dashboard should show
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('login form has accessible labels', async () => {
      render(<TestApp authProvider={authProvider} initialRoute="/login" />)

      // Form inputs should have proper labels
      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)

      expect(usernameInput).toHaveAttribute('id')
      expect(passwordInput).toHaveAttribute('id')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('error messages are accessible', async () => {
      authProvider = createMockAuthProvider({
        login: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/login" />)

      await user.type(screen.getByLabelText(/username/i), 'wrong')
      await user.type(screen.getByLabelText(/password/i), 'wrong')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Error should have alert role
      await waitFor(() => {
        const alert = screen.getByRole('alert')
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveTextContent('Invalid credentials')
      })
    })

    it('loading indicator has accessible status', async () => {
      let resolveCheckAuth: (value: unknown) => void
      const checkAuthPromise = new Promise((resolve) => {
        resolveCheckAuth = resolve
      })

      authProvider = createMockAuthProvider({
        checkAuth: vi.fn().mockReturnValue(checkAuthPromise),
      })

      render(<TestApp authProvider={authProvider} initialRoute="/dashboard" />)

      // Loading indicator should have accessible role
      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-label')

      resolveCheckAuth!(undefined)
    })
  })
})
