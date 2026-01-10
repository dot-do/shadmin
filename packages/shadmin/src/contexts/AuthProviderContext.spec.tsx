import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import {
  AuthProviderContext,
  AuthProviderContextProvider,
  useAuthProvider,
  useAuthProviderOptional,
} from './AuthProviderContext'
import type { AuthProvider } from '../facade'

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

describe('AuthProviderContext', () => {
  describe('AuthProviderContext', () => {
    it('should export the React context', () => {
      expect(AuthProviderContext).toBeDefined()
    })
  })

  describe('AuthProviderContextProvider', () => {
    it('should provide authProvider to children', async () => {
      const mockAuthProvider = createMockAuthProvider({
        getIdentity: vi.fn().mockResolvedValue({
          id: 1,
          fullName: 'John Doe',
          avatar: 'https://example.com/avatar.jpg',
        }),
      })

      const Consumer = () => {
        const authProvider = useAuthProvider()

        const handleGetIdentity = async () => {
          const identity = await authProvider.getIdentity?.()
          return identity?.fullName
        }

        return (
          <button
            onClick={async () => {
              const name = await handleGetIdentity()
              document.getElementById('result')!.textContent = name ?? ''
            }}
          >
            Get Identity
          </button>
        )
      }

      render(
        <AuthProviderContextProvider authProvider={mockAuthProvider}>
          <Consumer />
          <div id="result" data-testid="result"></div>
        </AuthProviderContextProvider>
      )

      screen.getByText('Get Identity').click()

      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('John Doe')
      })

      expect(mockAuthProvider.getIdentity).toHaveBeenCalled()
    })

    it('should allow login flow', async () => {
      const mockAuthProvider = createMockAuthProvider({
        login: vi.fn().mockResolvedValue({ redirectTo: '/dashboard' }),
      })

      const Consumer = () => {
        const authProvider = useAuthProvider()
        return (
          <button
            onClick={async () => {
              await authProvider.login({ username: 'test', password: 'test' })
            }}
          >
            Login
          </button>
        )
      }

      render(
        <AuthProviderContextProvider authProvider={mockAuthProvider}>
          <Consumer />
        </AuthProviderContextProvider>
      )

      screen.getByText('Login').click()

      await waitFor(() => {
        expect(mockAuthProvider.login).toHaveBeenCalledWith({
          username: 'test',
          password: 'test',
        })
      })
    })
  })

  describe('useAuthProvider', () => {
    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useAuthProvider()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useAuthProvider must be used within an AuthProviderContextProvider'
      )
    })

    it('should provide all AuthProvider methods', () => {
      const mockAuthProvider = createMockAuthProvider()

      const Consumer = () => {
        const authProvider = useAuthProvider()
        return (
          <div>
            <span data-testid="login">{typeof authProvider.login}</span>
            <span data-testid="logout">{typeof authProvider.logout}</span>
            <span data-testid="checkError">{typeof authProvider.checkError}</span>
            <span data-testid="checkAuth">{typeof authProvider.checkAuth}</span>
            <span data-testid="getPermissions">{typeof authProvider.getPermissions}</span>
          </div>
        )
      }

      render(
        <AuthProviderContextProvider authProvider={mockAuthProvider}>
          <Consumer />
        </AuthProviderContextProvider>
      )

      expect(screen.getByTestId('login')).toHaveTextContent('function')
      expect(screen.getByTestId('logout')).toHaveTextContent('function')
      expect(screen.getByTestId('checkError')).toHaveTextContent('function')
      expect(screen.getByTestId('checkAuth')).toHaveTextContent('function')
      expect(screen.getByTestId('getPermissions')).toHaveTextContent('function')
    })
  })

  describe('useAuthProviderOptional', () => {
    it('should return null when used outside provider', () => {
      const Consumer = () => {
        const authProvider = useAuthProviderOptional()
        return <div data-testid="result">{authProvider === null ? 'null' : 'defined'}</div>
      }

      render(<Consumer />)

      expect(screen.getByTestId('result')).toHaveTextContent('null')
    })

    it('should return authProvider when inside provider', () => {
      const mockAuthProvider = createMockAuthProvider()

      const Consumer = () => {
        const authProvider = useAuthProviderOptional()
        return <div data-testid="result">{authProvider === null ? 'null' : 'defined'}</div>
      }

      render(
        <AuthProviderContextProvider authProvider={mockAuthProvider}>
          <Consumer />
        </AuthProviderContextProvider>
      )

      expect(screen.getByTestId('result')).toHaveTextContent('defined')
    })
  })
})
