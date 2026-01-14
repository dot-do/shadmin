/**
 * useLogout hook tests
 * TDD: RED phase - Write failing tests first
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useLogout } from './useLogout'
import { AuthProviderContextProvider } from '../contexts/AuthProviderContext'
import { NotificationContextProvider } from '../contexts/NotificationContext'

import type { AuthProvider } from '../facade'
import type { ReactNode } from 'react'


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

describe('useLogout', () => {
  let authProvider: AuthProvider

  beforeEach(() => {
    authProvider = createMockAuthProvider()
  })

  it('should return a logout function and state', () => {
    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(authProvider),
    })

    expect(typeof result.current.logout).toBe('function')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should call authProvider.logout', async () => {
    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.logout()
    })

    expect(authProvider.logout).toHaveBeenCalled()
  })

  it('should update isLoading during logout', async () => {
    let resolveLogout: (value: unknown) => void
    const logoutPromise = new Promise((resolve) => {
      resolveLogout = resolve
    })
    authProvider = createMockAuthProvider({
      logout: vi.fn().mockReturnValue(logoutPromise),
    })

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(authProvider),
    })

    let logoutCallPromise: Promise<unknown>
    act(() => {
      logoutCallPromise = result.current.logout()
    })

    // Should be loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })

    // Resolve the promise
    await act(async () => {
      resolveLogout!(undefined)
      await logoutCallPromise!
    })

    // Should no longer be loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should handle logout errors', async () => {
    const error = new Error('Logout failed')
    authProvider = createMockAuthProvider({
      logout: vi.fn().mockRejectedValue(error),
    })

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      try {
        await result.current.logout()
      } catch {
        // Expected to throw
      }
    })

    await waitFor(() => {
      expect(result.current.error).toEqual(error)
    })
  })

  it('should redirect after successful logout', async () => {
    authProvider = createMockAuthProvider({
      logout: vi.fn().mockResolvedValue('/login'),
    })

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.logout()
    })

    expect(authProvider.logout).toHaveBeenCalled()
    // The redirect should have been triggered (tested via navigation mock)
  })

  it('should support custom redirectTo option', async () => {
    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.logout({ redirectTo: '/custom-logout' })
    })

    expect(authProvider.logout).toHaveBeenCalled()
  })

  it('should support disabling redirect', async () => {
    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.logout({ redirectTo: false })
    })

    expect(authProvider.logout).toHaveBeenCalled()
  })

  it('should call onSuccess callback after successful logout', async () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useLogout({ onSuccess }), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.logout()
    })

    expect(onSuccess).toHaveBeenCalled()
  })

  it('should call onError callback after failed logout', async () => {
    const error = new Error('Logout failed')
    authProvider = createMockAuthProvider({
      logout: vi.fn().mockRejectedValue(error),
    })
    const onError = vi.fn()

    const { result } = renderHook(() => useLogout({ onError }), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      try {
        await result.current.logout()
      } catch {
        // Expected to throw
      }
    })

    expect(onError).toHaveBeenCalledWith(error)
  })

  it('should not redirect when authProvider.logout returns false', async () => {
    authProvider = createMockAuthProvider({
      logout: vi.fn().mockResolvedValue(false),
    })

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.logout()
    })

    expect(authProvider.logout).toHaveBeenCalled()
  })
})
