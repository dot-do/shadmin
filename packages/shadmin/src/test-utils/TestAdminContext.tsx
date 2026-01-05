/**
 * Test Admin Context - Wrapper with all providers for testing
 * Provides a complete testing environment for admin components
 */

import * as React from 'react'
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { TestMemoryRouter, type TestMemoryRouterProps } from './TestMemoryRouter'
import {
  createMockDataProvider,
  type DataProvider,
  type MockDataProviderOptions,
} from './testDataProvider'
import {
  createMockAuthProvider,
  type AuthProvider,
  type MockAuthProviderOptions,
  type UserIdentity,
  type Permissions,
} from './testAuthProvider'

/**
 * Resource definition for admin
 */
export interface ResourceDefinition {
  name: string
  label?: string
  icon?: React.ComponentType
  options?: Record<string, unknown>
}

/**
 * Admin context value
 */
export interface AdminContextValue {
  dataProvider: DataProvider
  authProvider: AuthProvider
  resources: ResourceDefinition[]
  basePath: string
  title: string
}

/**
 * Admin context
 */
const AdminContext = createContext<AdminContextValue | null>(null)

/**
 * Hook to access admin context
 */
export function useAdminContext(): AdminContextValue {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdminContext must be used within a TestAdminContext')
  }
  return context
}

/**
 * Hook to access data provider
 */
export function useDataProvider(): DataProvider {
  return useAdminContext().dataProvider
}

/**
 * Hook to access auth provider
 */
export function useAuthProvider(): AuthProvider {
  return useAdminContext().authProvider
}

/**
 * Hook to get current user identity
 */
export function useGetIdentity() {
  const authProvider = useAuthProvider()
  const [identity, setIdentity] = React.useState<UserIdentity | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let mounted = true

    const fetchIdentity = async () => {
      try {
        if (authProvider.getIdentity) {
          const data = await authProvider.getIdentity()
          if (mounted) {
            setIdentity(data)
            setLoading(false)
          }
        } else {
          if (mounted) {
            setLoading(false)
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to get identity'))
          setLoading(false)
        }
      }
    }

    void fetchIdentity()

    return () => {
      mounted = false
    }
  }, [authProvider])

  return { identity, loading, error }
}

/**
 * Hook to get permissions
 */
export function usePermissions() {
  const authProvider = useAuthProvider()
  const [permissions, setPermissions] = React.useState<Permissions | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let mounted = true

    const fetchPermissions = async () => {
      try {
        const data = await authProvider.getPermissions()
        if (mounted) {
          setPermissions(data)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to get permissions'))
          setLoading(false)
        }
      }
    }

    void fetchPermissions()

    return () => {
      mounted = false
    }
  }, [authProvider])

  return { permissions, loading, error }
}

/**
 * Props for TestAdminContext
 */
export interface TestAdminContextProps {
  children: ReactNode
  /**
   * Custom data provider (defaults to mock)
   */
  dataProvider?: DataProvider
  /**
   * Options for creating mock data provider
   */
  dataProviderOptions?: MockDataProviderOptions
  /**
   * Custom auth provider (defaults to mock)
   */
  authProvider?: AuthProvider
  /**
   * Options for creating mock auth provider
   */
  authProviderOptions?: MockAuthProviderOptions
  /**
   * Resource definitions
   */
  resources?: ResourceDefinition[]
  /**
   * Base path for the admin
   */
  basePath?: string
  /**
   * Admin title
   */
  title?: string
  /**
   * Router props
   */
  routerProps?: Omit<TestMemoryRouterProps, 'children'>
}

/**
 * Default resources for testing
 */
const defaultResources: ResourceDefinition[] = [
  { name: 'users', label: 'Users' },
  { name: 'posts', label: 'Posts' },
  { name: 'comments', label: 'Comments' },
]

/**
 * Test Admin Context provider
 * Wraps components with all necessary providers for testing
 *
 * @example
 * ```tsx
 * // Basic usage
 * render(
 *   <TestAdminContext>
 *     <UserList />
 *   </TestAdminContext>
 * )
 *
 * // With custom data
 * render(
 *   <TestAdminContext
 *     dataProviderOptions={{
 *       data: {
 *         users: [{ id: 1, name: 'Test' }],
 *       },
 *     }}
 *   >
 *     <UserList />
 *   </TestAdminContext>
 * )
 *
 * // Unauthenticated state
 * render(
 *   <TestAdminContext authProviderOptions={{ isAuthenticated: false }}>
 *     <LoginPage />
 *   </TestAdminContext>
 * )
 * ```
 */
export function TestAdminContext({
  children,
  dataProvider: customDataProvider,
  dataProviderOptions,
  authProvider: customAuthProvider,
  authProviderOptions,
  resources = defaultResources,
  basePath = '/admin',
  title = 'Test Admin',
  routerProps = {},
}: TestAdminContextProps) {
  const dataProvider = useMemo(
    () => customDataProvider ?? createMockDataProvider(dataProviderOptions),
    [customDataProvider, dataProviderOptions]
  )

  const authProvider = useMemo(
    () => customAuthProvider ?? createMockAuthProvider(authProviderOptions),
    [customAuthProvider, authProviderOptions]
  )

  const value = useMemo(
    () => ({
      dataProvider,
      authProvider,
      resources,
      basePath,
      title,
    }),
    [dataProvider, authProvider, resources, basePath, title]
  )

  const { initialEntries = [basePath], ...restRouterProps } = routerProps

  return (
    <TestMemoryRouter initialEntries={initialEntries} {...restRouterProps}>
      <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
    </TestMemoryRouter>
  )
}

/**
 * Create a custom render function with admin context
 * For use with @testing-library/react
 *
 * @example
 * ```tsx
 * import { render, screen } from '@testing-library/react'
 * import { createAdminRender } from './TestAdminContext'
 *
 * const renderAdmin = createAdminRender({
 *   dataProviderOptions: { data: { users: [] } },
 * })
 *
 * test('renders user list', () => {
 *   renderAdmin(<UserList />)
 *   expect(screen.getByText('No users')).toBeInTheDocument()
 * })
 * ```
 */
export function createAdminRender(defaultProps: Omit<TestAdminContextProps, 'children'> = {}) {
  return function adminRender(
    ui: ReactNode,
    props: Omit<TestAdminContextProps, 'children'> = {}
  ): { wrapper: React.FC<{ children: ReactNode }> } {
    const mergedProps = {
      ...defaultProps,
      ...props,
      dataProviderOptions: {
        ...defaultProps.dataProviderOptions,
        ...props.dataProviderOptions,
      },
      authProviderOptions: {
        ...defaultProps.authProviderOptions,
        ...props.authProviderOptions,
      },
      routerProps: {
        ...defaultProps.routerProps,
        ...props.routerProps,
      },
    }

    const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
      <TestAdminContext {...mergedProps}>{children}</TestAdminContext>
    )

    return {
      wrapper: Wrapper,
    }
  }
}

/**
 * Wait for async operations to complete
 * Useful when testing components with data fetching
 */
export async function waitForAdminData(): Promise<void> {
  // Wait for next tick and any pending promises
  await new Promise((resolve) => setTimeout(resolve, 0))
  await new Promise((resolve) => setTimeout(resolve, 0))
}
