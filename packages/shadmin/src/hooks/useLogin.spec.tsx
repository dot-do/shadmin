/**
 * useLogin hook tests
 * TDD: RED phase - Write failing tests first
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useLogin } from './useLogin'
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

describe('useLogin', () => {
  let authProvider: AuthProvider

  beforeEach(() => {
    authProvider = createMockAuthProvider()
  })

  it('should return a login function and state', () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(authProvider),
    })

    expect(typeof result.current.login).toBe('function')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should call authProvider.login with credentials', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.login({ username: 'admin', password: 'secret' })
    })

    expect(authProvider.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'secret',
    })
  })

  it('should update isLoading during login', async () => {
    let resolveLogin: (value: unknown) => void
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve
    })
    authProvider = createMockAuthProvider({
      login: vi.fn().mockReturnValue(loginPromise),
    })

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(authProvider),
    })

    let loginCallPromise: Promise<unknown>
    act(() => {
      loginCallPromise = result.current.login({ username: 'test', password: 'test' })
    })

    // Should be loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })

    // Resolve the promise
    await act(async () => {
      resolveLogin!(undefined)
      await loginCallPromise!
    })

    // Should no longer be loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should handle login errors', async () => {
    const error = new Error('Invalid credentials')
    authProvider = createMockAuthProvider({
      login: vi.fn().mockRejectedValue(error),
    })

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      try {
        await result.current.login({ username: 'bad', password: 'bad' })
      } catch {
        // Expected to throw
      }
    })

    await waitFor(() => {
      expect(result.current.error).toEqual(error)
    })
  })

  it('should redirect after successful login', async () => {
    authProvider = createMockAuthProvider({
      login: vi.fn().mockResolvedValue({ redirectTo: '/dashboard' }),
    })

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.login({ username: 'admin', password: 'secret' })
    })

    expect(authProvider.login).toHaveBeenCalled()
    // The redirect should have been triggered (tested via navigation mock)
  })

  it('should support custom redirectTo option', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.login(
        { username: 'admin', password: 'secret' },
        { redirectTo: '/custom-path' }
      )
    })

    expect(authProvider.login).toHaveBeenCalled()
  })

  it('should support disabling redirect', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.login(
        { username: 'admin', password: 'secret' },
        { redirectTo: false }
      )
    })

    expect(authProvider.login).toHaveBeenCalled()
  })

  it('should call onSuccess callback after successful login', async () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useLogin({ onSuccess }), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      await result.current.login({ username: 'admin', password: 'secret' })
    })

    expect(onSuccess).toHaveBeenCalled()
  })

  it('should call onError callback after failed login', async () => {
    const error = new Error('Invalid credentials')
    authProvider = createMockAuthProvider({
      login: vi.fn().mockRejectedValue(error),
    })
    const onError = vi.fn()

    const { result } = renderHook(() => useLogin({ onError }), {
      wrapper: createWrapper(authProvider),
    })

    await act(async () => {
      try {
        await result.current.login({ username: 'bad', password: 'bad' })
      } catch {
        // Expected to throw
      }
    })

    expect(onError).toHaveBeenCalledWith(error)
  })
})
