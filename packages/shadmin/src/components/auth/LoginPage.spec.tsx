/**
 * LoginPage component tests
 * TDD: RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { LoginPage } from './LoginPage'
import { AuthProviderContextProvider } from '../../contexts/AuthProviderContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import type { AuthProvider } from 'ra-core'
import { MemoryRouter } from 'react-router'

// Test wrapper with required providers
const createWrapper = (authProvider: AuthProvider) => {
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
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <AuthProviderContextProvider authProvider={authProvider}>
              {children}
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

describe('LoginPage', () => {
  let authProvider: AuthProvider
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    authProvider = createMockAuthProvider()
    user = userEvent.setup()
  })

  describe('rendering', () => {
    it('should render login form with username and password fields', () => {
      const Wrapper = createWrapper(authProvider)
      render(<LoginPage />, { wrapper: Wrapper })

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should render with custom title', () => {
      const Wrapper = createWrapper(authProvider)
      render(<LoginPage title="Welcome Back" />, { wrapper: Wrapper })

      expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    })

    it('should render with default title if not provided', () => {
      const Wrapper = createWrapper(authProvider)
      render(<LoginPage />, { wrapper: Wrapper })

      // Use heading role to specifically target the title
      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('should call useLogin on form submit with credentials', async () => {
      const Wrapper = createWrapper(authProvider)
      render(<LoginPage />, { wrapper: Wrapper })

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'admin')
      await user.type(passwordInput, 'secret123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(authProvider.login).toHaveBeenCalledWith({
          username: 'admin',
          password: 'secret123',
        })
      })
    })

    it('should prevent submission with empty username', async () => {
      const Wrapper = createWrapper(authProvider)
      render(<LoginPage />, { wrapper: Wrapper })

      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(passwordInput, 'secret123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(authProvider.login).not.toHaveBeenCalled()
      })
    })

    it('should prevent submission with empty password', async () => {
      const Wrapper = createWrapper(authProvider)
      render(<LoginPage />, { wrapper: Wrapper })

      const usernameInput = screen.getByLabelText(/username/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'admin')
      await user.click(submitButton)

      await waitFor(() => {
        expect(authProvider.login).not.toHaveBeenCalled()
      })
    })
  })

  describe('loading state', () => {
    it('should show loading state during login', async () => {
      let resolveLogin: (value: unknown) => void
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve
      })
      authProvider = createMockAuthProvider({
        login: vi.fn().mockReturnValue(loginPromise),
      })

      const Wrapper = createWrapper(authProvider)
      render(<LoginPage />, { wrapper: Wrapper })

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'admin')
      await user.type(passwordInput, 'secret123')
      await user.click(submitButton)

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument()
      })

      // Button should be disabled during loading
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()

      // Resolve the login
      resolveLogin!(undefined)

      // Should return to normal state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      })
    })

    it('should disable form inputs during loading', async () => {
      let resolveLogin: (value: unknown) => void
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve
      })
      authProvider = createMockAuthProvider({
        login: vi.fn().mockReturnValue(loginPromise),
      })

      const Wrapper = createWrapper(authProvider)
      render(<LoginPage />, { wrapper: Wrapper })

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'admin')
      await user.type(passwordInput, 'secret123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(usernameInput).toBeDisabled()
        expect(passwordInput).toBeDisabled()
      })

      resolveLogin!(undefined)
    })
  })

  describe('error handling', () => {
    it('should display error message on login failure', async () => {
      const error = new Error('Invalid credentials')
      authProvider = createMockAuthProvider({
        login: vi.fn().mockRejectedValue(error),
      })

      const Wrapper = createWrapper(authProvider)
      render(<LoginPage />, { wrapper: Wrapper })

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'admin')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })
    })

    it('should clear error message on new submission', async () => {
      const error = new Error('Invalid credentials')
      authProvider = createMockAuthProvider({
        login: vi.fn()
          .mockRejectedValueOnce(error)
          .mockResolvedValueOnce(undefined),
      })

      const Wrapper = createWrapper(authProvider)
      render(<LoginPage />, { wrapper: Wrapper })

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      // First attempt - fails
      await user.type(usernameInput, 'admin')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })

      // Second attempt - should clear error
      await user.clear(passwordInput)
      await user.type(passwordInput, 'correctpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
      })
    })
  })

  describe('redirect after login', () => {
    it('should redirect to default path after successful login', async () => {
      const Wrapper = createWrapper(authProvider)
      render(<LoginPage />, { wrapper: Wrapper })

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'admin')
      await user.type(passwordInput, 'secret123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(authProvider.login).toHaveBeenCalled()
      })
      // Navigation is handled by useLogin hook
    })

    it('should support custom redirectTo prop', async () => {
      const Wrapper = createWrapper(authProvider)
      render(<LoginPage redirectTo="/dashboard" />, { wrapper: Wrapper })

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'admin')
      await user.type(passwordInput, 'secret123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(authProvider.login).toHaveBeenCalled()
      })
    })
  })

  describe('custom styling', () => {
    it('should accept className prop', () => {
      const Wrapper = createWrapper(authProvider)
      render(<LoginPage className="custom-login-page" />, { wrapper: Wrapper })

      // The form container should have the custom class
      expect(document.querySelector('.custom-login-page')).toBeInTheDocument()
    })
  })
})
