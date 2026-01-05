/**
 * LogoutButton component tests
 * TDD: RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { LogoutButton } from './LogoutButton'
import { AuthProviderContextProvider } from '../../contexts/AuthProviderContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import type { AuthProvider } from '../../types'
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

describe('LogoutButton', () => {
  let authProvider: AuthProvider
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    authProvider = createMockAuthProvider()
    user = userEvent.setup()
  })

  describe('rendering', () => {
    it('should render logout button', () => {
      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton />, { wrapper: Wrapper })

      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    })

    it('should render with custom label', () => {
      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton label="Sign Out" />, { wrapper: Wrapper })

      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
    })

    it('should render with icon when icon prop is provided', () => {
      const Wrapper = createWrapper(authProvider)
      const Icon = () => <svg data-testid="logout-icon" />
      render(<LogoutButton icon={<Icon />} />, { wrapper: Wrapper })

      expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
    })

    it('should render icon-only button when iconOnly is true', () => {
      const Wrapper = createWrapper(authProvider)
      const Icon = () => <svg data-testid="logout-icon" />
      render(<LogoutButton icon={<Icon />} iconOnly />, { wrapper: Wrapper })

      expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
      // Should not show label text
      expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    })
  })

  describe('click behavior', () => {
    it('should call useLogout on click', async () => {
      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton />, { wrapper: Wrapper })

      const button = screen.getByRole('button', { name: /logout/i })
      await user.click(button)

      await waitFor(() => {
        expect(authProvider.logout).toHaveBeenCalled()
      })
    })

    it('should show loading state during logout', async () => {
      let resolveLogout: (value: unknown) => void
      const logoutPromise = new Promise((resolve) => {
        resolveLogout = resolve
      })
      authProvider = createMockAuthProvider({
        logout: vi.fn().mockReturnValue(logoutPromise),
      })

      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton loadingLabel="Logging out..." />, { wrapper: Wrapper })

      const button = screen.getByRole('button', { name: /logout/i })
      await user.click(button)

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /logging out/i })).toBeInTheDocument()
      })

      // Button should be disabled during loading
      expect(screen.getByRole('button', { name: /logging out/i })).toBeDisabled()

      // Resolve the logout
      resolveLogout!(undefined)

      // Should return to normal state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
      })
    })
  })

  describe('confirmation dialog', () => {
    it('should show confirmation dialog when confirmTitle is provided', async () => {
      const Wrapper = createWrapper(authProvider)
      render(
        <LogoutButton
          confirmTitle="Confirm Logout"
          confirmMessage="Are you sure you want to logout?"
        />,
        { wrapper: Wrapper }
      )

      const button = screen.getByRole('button', { name: /logout/i })
      await user.click(button)

      // Should show confirmation dialog
      await waitFor(() => {
        expect(screen.getByText('Confirm Logout')).toBeInTheDocument()
        expect(screen.getByText('Are you sure you want to logout?')).toBeInTheDocument()
      })

      // Logout should not be called yet
      expect(authProvider.logout).not.toHaveBeenCalled()
    })

    it('should call logout when confirmation is accepted', async () => {
      const Wrapper = createWrapper(authProvider)
      render(
        <LogoutButton
          confirmTitle="Confirm Logout"
          confirmMessage="Are you sure you want to logout?"
        />,
        { wrapper: Wrapper }
      )

      const button = screen.getByRole('button', { name: /logout/i })
      await user.click(button)

      // Click confirm button
      const confirmButton = await screen.findByRole('button', { name: /confirm/i })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(authProvider.logout).toHaveBeenCalled()
      })
    })

    it('should not call logout when confirmation is cancelled', async () => {
      const Wrapper = createWrapper(authProvider)
      render(
        <LogoutButton
          confirmTitle="Confirm Logout"
          confirmMessage="Are you sure you want to logout?"
        />,
        { wrapper: Wrapper }
      )

      const button = screen.getByRole('button', { name: /logout/i })
      await user.click(button)

      // Click cancel button
      const cancelButton = await screen.findByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(authProvider.logout).not.toHaveBeenCalled()

      // Dialog should be closed
      await waitFor(() => {
        expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument()
      })
    })
  })

  describe('redirect', () => {
    it('should support custom redirectTo', async () => {
      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton redirectTo="/goodbye" />, { wrapper: Wrapper })

      const button = screen.getByRole('button', { name: /logout/i })
      await user.click(button)

      await waitFor(() => {
        expect(authProvider.logout).toHaveBeenCalled()
      })
    })

    it('should support disabling redirect', async () => {
      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton redirectTo={false} />, { wrapper: Wrapper })

      const button = screen.getByRole('button', { name: /logout/i })
      await user.click(button)

      await waitFor(() => {
        expect(authProvider.logout).toHaveBeenCalled()
      })
    })
  })

  describe('custom styling', () => {
    it('should accept className prop', () => {
      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton className="custom-logout-button" />, { wrapper: Wrapper })

      expect(screen.getByRole('button', { name: /logout/i })).toHaveClass('custom-logout-button')
    })

    it('should accept variant prop', () => {
      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton variant="outline" />, { wrapper: Wrapper })

      // Button should have outline variant styling
      const button = screen.getByRole('button', { name: /logout/i })
      expect(button).toBeInTheDocument()
    })

    it('should accept size prop', () => {
      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton size="sm" />, { wrapper: Wrapper })

      // Button should have small size styling
      const button = screen.getByRole('button', { name: /logout/i })
      expect(button).toBeInTheDocument()
    })
  })

  describe('callbacks', () => {
    it('should call onSuccess after successful logout', async () => {
      const onSuccess = vi.fn()
      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton onSuccess={onSuccess} />, { wrapper: Wrapper })

      const button = screen.getByRole('button', { name: /logout/i })
      await user.click(button)

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled()
      })
    })

    it('should call onError on logout failure', async () => {
      const error = new Error('Logout failed')
      authProvider = createMockAuthProvider({
        logout: vi.fn().mockRejectedValue(error),
      })
      const onError = vi.fn()

      const Wrapper = createWrapper(authProvider)
      render(<LogoutButton onError={onError} />, { wrapper: Wrapper })

      const button = screen.getByRole('button', { name: /logout/i })
      await user.click(button)

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error)
      })
    })
  })
})
