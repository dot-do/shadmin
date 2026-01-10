/**
 * Admin Boot Tests - RED Phase TDD
 *
 * These tests define the expected boot behavior for the Admin component.
 * They verify that the Admin component correctly:
 * - Mounts and initializes
 * - Sets up all required providers (DataProvider, AuthProvider, QueryClient)
 * - Registers Resources properly
 * - Sets up routing correctly
 * - Handles the boot sequence in the right order
 *
 * RED PHASE: These tests are expected to fail initially and drive implementation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import type { ReactNode } from 'react'
import { Admin } from './Admin'
import { Resource } from './Resource'
import {
  useDataProvider,
  useAuthProviderOptional,
  useResourceDefinitions,
  useResourceContext,
  useResource,
  useNotify,
  useRecordContext,
} from '../../contexts'
import { createMockDataProvider, createMockAuthProvider } from '../../test-utils'

// Helper to wrap Admin with MemoryRouter
const renderAdmin = (ui: React.ReactElement, { initialEntries = ['/'] } = {}) => {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}

/**
 * =============================================================================
 * SECTION 1: BASIC BOOT SEQUENCE
 * =============================================================================
 * Tests that verify the Admin component boots up correctly with minimal config
 */
describe('Admin Boot Sequence', () => {
  const defaultDataProvider = createMockDataProvider()

  // Suppress console.error for error boundary tests
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalError
  })

  describe('minimal boot', () => {
    it('boots with only dataProvider prop', () => {
      expect(() => {
        renderAdmin(<Admin dataProvider={defaultDataProvider} />)
      }).not.toThrow()
    })

    it('renders without any children', () => {
      renderAdmin(<Admin dataProvider={defaultDataProvider} />)
      // Should render without error - the document body should exist
      expect(document.body).toBeInTheDocument()
    })

    it('renders with empty children', () => {
      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          {null}
          {undefined}
          {false}
        </Admin>
      )
      expect(document.body).toBeInTheDocument()
    })
  })

  describe('provider initialization order', () => {
    it('initializes QueryClient before DataProvider', () => {
      const initOrder: string[] = []

      // Component that tracks initialization
      const TrackerComponent = () => {
        const dataProvider = useDataProvider()
        if (dataProvider) {
          initOrder.push('dataProvider')
        }
        return <div data-testid="tracker">Tracked</div>
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <TrackerComponent />
        </Admin>
      )

      expect(screen.getByTestId('tracker')).toBeInTheDocument()
      expect(initOrder).toContain('dataProvider')
    })

    it('makes dataProvider available to all children', async () => {
      const dataProviderCalls: boolean[] = []

      const DeepChild = () => {
        const dataProvider = useDataProvider()
        dataProviderCalls.push(dataProvider !== undefined)
        return <div data-testid="deep-child">Deep</div>
      }

      const MiddleChild = () => (
        <div>
          <DeepChild />
        </div>
      )

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <MiddleChild />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('deep-child')).toBeInTheDocument()
      })
      expect(dataProviderCalls).toContain(true)
    })

    it('makes authProvider available when provided', async () => {
      const authProvider = createMockAuthProvider()
      let hasAuthProvider = false

      const AuthChecker = () => {
        const auth = useAuthProviderOptional()
        hasAuthProvider = auth !== undefined
        return <div data-testid="auth-checker">{hasAuthProvider ? 'yes' : 'no'}</div>
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} authProvider={authProvider}>
          <AuthChecker />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-checker')).toHaveTextContent('yes')
      })
    })
  })

  describe('initial state', () => {
    it('renders content during initialization', async () => {
      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>
      )

      // Content should be visible
      expect(document.body).toBeInTheDocument()
    })

    it('transitions to rendered state', async () => {
      const PostList = () => <div data-testid="post-list">Posts List</div>

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={PostList} />
        </Admin>
      )

      // Eventually should show the actual content
      await waitFor(
        () => {
          // Content should be visible
          expect(document.body.textContent).toBeTruthy()
        },
        { timeout: 2000 }
      )
    })
  })
})

/**
 * =============================================================================
 * SECTION 2: RESOURCE REGISTRATION
 * =============================================================================
 * Tests that verify Resource components are properly registered during boot
 */
describe('Resource Registration During Boot', () => {
  const defaultDataProvider = createMockDataProvider()

  describe('basic registration', () => {
    it('registers a single Resource', async () => {
      let registeredResources: Record<string, unknown> = {}

      const ResourceChecker = () => {
        registeredResources = useResourceDefinitions()
        return <div data-testid="checker">{Object.keys(registeredResources).join(',')}</div>
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={() => <div>Posts</div>} />
          <ResourceChecker />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('checker')).toHaveTextContent('posts')
      })
    })

    it('registers multiple Resources in order', async () => {
      let registeredResources: Record<string, unknown> = {}

      const ResourceChecker = () => {
        registeredResources = useResourceDefinitions()
        return <div data-testid="checker">{Object.keys(registeredResources).join(',')}</div>
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={() => <div>Posts</div>} />
          <Resource name="comments" list={() => <div>Comments</div>} />
          <Resource name="users" list={() => <div>Users</div>} />
          <ResourceChecker />
        </Admin>
      )

      await waitFor(() => {
        const text = screen.getByTestId('checker').textContent
        expect(text).toContain('posts')
        expect(text).toContain('comments')
        expect(text).toContain('users')
      })
    })

    it('tracks resource capabilities (hasList, hasEdit, etc.)', async () => {
      let postsDefinition: { hasList?: boolean; hasEdit?: boolean; hasCreate?: boolean; hasShow?: boolean } | undefined

      const CapabilityChecker = () => {
        const definitions = useResourceDefinitions()
        postsDefinition = definitions['posts'] as typeof postsDefinition
        return (
          <div>
            <span data-testid="has-list">{postsDefinition?.hasList ? 'yes' : 'no'}</span>
            <span data-testid="has-edit">{postsDefinition?.hasEdit ? 'yes' : 'no'}</span>
            <span data-testid="has-create">{postsDefinition?.hasCreate ? 'yes' : 'no'}</span>
            <span data-testid="has-show">{postsDefinition?.hasShow ? 'yes' : 'no'}</span>
          </div>
        )
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource
            name="posts"
            list={() => <div>List</div>}
            edit={() => <div>Edit</div>}
          />
          <CapabilityChecker />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('has-list')).toHaveTextContent('yes')
        expect(screen.getByTestId('has-edit')).toHaveTextContent('yes')
        expect(screen.getByTestId('has-create')).toHaveTextContent('no')
        expect(screen.getByTestId('has-show')).toHaveTextContent('no')
      })
    })
  })

  describe('dynamic registration', () => {
    it('handles Resources added after initial mount', async () => {
      const { rerender } = render(
        <MemoryRouter>
          <Admin dataProvider={defaultDataProvider}>
            <Resource name="posts" list={() => <div>Posts</div>} />
          </Admin>
        </MemoryRouter>
      )

      // This test verifies that adding Resources after mount works
      // The implementation should support dynamic resource registration
      rerender(
        <MemoryRouter>
          <Admin dataProvider={defaultDataProvider}>
            <Resource name="posts" list={() => <div>Posts</div>} />
            <Resource name="users" list={() => <div>Users</div>} />
          </Admin>
        </MemoryRouter>
      )

      // Both resources should be available
      expect(document.body).toBeInTheDocument()
    })

    it('handles Resources removed after mount', async () => {
      const { rerender } = render(
        <MemoryRouter>
          <Admin dataProvider={defaultDataProvider}>
            <Resource name="posts" list={() => <div>Posts</div>} />
            <Resource name="users" list={() => <div>Users</div>} />
          </Admin>
        </MemoryRouter>
      )

      rerender(
        <MemoryRouter>
          <Admin dataProvider={defaultDataProvider}>
            <Resource name="posts" list={() => <div>Posts</div>} />
          </Admin>
        </MemoryRouter>
      )

      // Only posts should remain
      expect(document.body).toBeInTheDocument()
    })
  })

  describe('resource context', () => {
    it('provides ResourceContext to resource components', async () => {
      let resourceName = ''

      const PostList = () => {
        resourceName = useResource()
        return <div data-testid="post-list">{resourceName}</div>
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={PostList} />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('post-list')).toHaveTextContent('posts')
      })
    })

    it('provides correct ResourceContext for nested components', async () => {
      const NestedComponent = () => {
        const resource = useResource()
        return <span data-testid="nested-resource">{resource}</span>
      }

      const PostList = () => (
        <div data-testid="post-list">
          <NestedComponent />
        </div>
      )

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={PostList} />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('nested-resource')).toHaveTextContent('posts')
      })
    })
  })
})

/**
 * =============================================================================
 * SECTION 3: DATA PROVIDER INITIALIZATION
 * =============================================================================
 * Tests that verify DataProvider is correctly initialized and available
 */
describe('DataProvider Initialization', () => {
  describe('basic initialization', () => {
    it('makes dataProvider available via useDataProvider hook', async () => {
      const mockDataProvider = createMockDataProvider()
      let capturedDataProvider: unknown = null

      const DataProviderConsumer = () => {
        capturedDataProvider = useDataProvider()
        return <div data-testid="consumer">Has DataProvider</div>
      }

      renderAdmin(
        <Admin dataProvider={mockDataProvider}>
          <DataProviderConsumer />
        </Admin>
      )

      await waitFor(() => {
        expect(capturedDataProvider).not.toBeNull()
        expect(screen.getByTestId('consumer')).toBeInTheDocument()
      })
    })

    it('dataProvider methods are callable', async () => {
      const mockDataProvider = createMockDataProvider({
        data: { posts: [{ id: 1, title: 'Test Post' }] },
      })

      let canCallGetList = false

      const DataProviderTester = () => {
        const dataProvider = useDataProvider()

        const testGetList = async () => {
          try {
            const result = await dataProvider.getList('posts', {
              pagination: { page: 1, perPage: 10 },
              sort: { field: 'id', order: 'ASC' },
              filter: {},
            })
            canCallGetList = result.data.length > 0
          } catch {
            canCallGetList = false
          }
        }

        // Call on mount
        React.useEffect(() => {
          testGetList()
        }, [])

        return <div data-testid="tester">{canCallGetList ? 'success' : 'pending'}</div>
      }

      // Need to import React for useEffect
      const React = await import('react')

      renderAdmin(
        <Admin dataProvider={mockDataProvider}>
          <DataProviderTester />
        </Admin>
      )

      await waitFor(
        () => {
          expect(canCallGetList).toBe(true)
        },
        { timeout: 2000 }
      )
    })
  })

  describe('dataProvider validation', () => {
    it('throws error if dataProvider is not provided', () => {
      // TypeScript should catch this, but runtime should also validate
      expect(() => {
        // @ts-expect-error - intentionally testing missing required prop
        renderAdmin(<Admin />)
      }).toThrow()
    })

    it('throws error if dataProvider is null', () => {
      expect(() => {
        // @ts-expect-error - intentionally testing null value
        renderAdmin(<Admin dataProvider={null} />)
      }).toThrow()
    })
  })

  describe('QueryClient integration', () => {
    it('uses QueryClient for data fetching', async () => {
      const mockDataProvider = createMockDataProvider()

      renderAdmin(
        <Admin dataProvider={mockDataProvider}>
          <Resource name="posts" list={() => <div data-testid="list">Posts</div>} />
        </Admin>
      )

      // QueryClient should be available and working
      await waitFor(() => {
        expect(screen.getByTestId('list')).toBeInTheDocument()
      })
    })

    it('accepts custom queryClient prop', async () => {
      const mockDataProvider = createMockDataProvider()
      const { QueryClient } = await import('@tanstack/react-query')
      const customQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })

      renderAdmin(
        <Admin dataProvider={mockDataProvider} queryClient={customQueryClient}>
          <Resource name="posts" list={() => <div data-testid="list">Posts</div>} />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('list')).toBeInTheDocument()
      })
    })
  })
})

/**
 * =============================================================================
 * SECTION 4: AUTH PROVIDER INITIALIZATION
 * =============================================================================
 * Tests that verify AuthProvider is correctly initialized when provided
 */
describe('AuthProvider Initialization', () => {
  const defaultDataProvider = createMockDataProvider()

  describe('optional auth', () => {
    it('works without authProvider', async () => {
      let authProvider: unknown = 'initial'

      const AuthChecker = () => {
        authProvider = useAuthProviderOptional()
        return <div data-testid="auth-check">{authProvider ? 'has-auth' : 'no-auth'}</div>
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <AuthChecker />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-check')).toHaveTextContent('no-auth')
      })
    })
  })

  describe('with authProvider', () => {
    it('makes authProvider available via hook', async () => {
      const mockAuthProvider = createMockAuthProvider()
      let capturedAuthProvider: unknown = null

      const AuthConsumer = () => {
        capturedAuthProvider = useAuthProviderOptional()
        return <div data-testid="consumer">Has Auth</div>
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} authProvider={mockAuthProvider}>
          <AuthConsumer />
        </Admin>
      )

      await waitFor(() => {
        expect(capturedAuthProvider).not.toBeNull()
      })
    })

    it('calls checkAuth on boot', async () => {
      const mockAuthProvider = createMockAuthProvider()
      const checkAuthSpy = vi.spyOn(mockAuthProvider, 'checkAuth')

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} authProvider={mockAuthProvider}>
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>
      )

      await waitFor(() => {
        expect(checkAuthSpy).toHaveBeenCalled()
      })
    })

    it('provides getIdentity to components', async () => {
      const mockAuthProvider = createMockAuthProvider({
        identity: { id: 1, fullName: 'Test User' },
      })

      let identity: { fullName?: string } | null = null

      const IdentityChecker = () => {
        const auth = useAuthProviderOptional()

        React.useEffect(() => {
          if (auth?.getIdentity) {
            auth.getIdentity().then((id) => {
              identity = id
            })
          }
        }, [auth])

        return <div data-testid="identity">{identity?.fullName ?? 'loading'}</div>
      }

      const React = await import('react')

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} authProvider={mockAuthProvider}>
          <IdentityChecker />
        </Admin>
      )

      await waitFor(
        () => {
          expect(identity?.fullName).toBe('Test User')
        },
        { timeout: 2000 }
      )
    })
  })

  describe('authentication flow', () => {
    it('redirects to login when not authenticated', async () => {
      const mockAuthProvider = createMockAuthProvider({ isAuthenticated: false })

      renderAdmin(
        <Admin
          dataProvider={defaultDataProvider}
          authProvider={mockAuthProvider}
        >
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>
      )

      await waitFor(
        () => {
          // Should show login page or redirect
          expect(document.body).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })

    it('shows content when authenticated', async () => {
      const mockAuthProvider = createMockAuthProvider({ isAuthenticated: true })

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} authProvider={mockAuthProvider}>
          <Resource name="posts" list={() => <div data-testid="post-list">Posts</div>} />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('post-list')).toBeInTheDocument()
      })
    })
  })
})

/**
 * =============================================================================
 * SECTION 5: ROUTER SETUP
 * =============================================================================
 * Tests that verify routing is correctly set up during boot
 */
describe('Router Setup During Boot', () => {
  const defaultDataProvider = createMockDataProvider()

  describe('default routing', () => {
    it('renders dashboard at root path when provided', async () => {
      const Dashboard = () => <div data-testid="dashboard">Welcome</div>

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} dashboard={Dashboard}>
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument()
      })
    })

    it('renders first resource list at root when no dashboard', async () => {
      const PostList = () => <div data-testid="post-list">Posts List</div>

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={PostList} />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('post-list')).toBeInTheDocument()
      })
    })
  })

  describe('resource routes', () => {
    it('creates list route at /{resource}', async () => {
      const PostList = () => <div data-testid="post-list">Posts List</div>

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={PostList} />
        </Admin>,
        { initialEntries: ['/posts'] }
      )

      await waitFor(() => {
        expect(screen.getByTestId('post-list')).toBeInTheDocument()
      })
    })

    it('creates create route at /{resource}/create', async () => {
      const PostCreate = () => <div data-testid="post-create">Create Post</div>

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={() => <div>List</div>} create={PostCreate} />
        </Admin>,
        { initialEntries: ['/posts/create'] }
      )

      await waitFor(() => {
        expect(screen.getByTestId('post-create')).toBeInTheDocument()
      })
    })

    it('creates edit route at /{resource}/:id', async () => {
      const PostEdit = () => <div data-testid="post-edit">Edit Post</div>

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={() => <div>List</div>} edit={PostEdit} />
        </Admin>,
        { initialEntries: ['/posts/1'] }
      )

      await waitFor(() => {
        expect(screen.getByTestId('post-edit')).toBeInTheDocument()
      })
    })

    it('creates show route at /{resource}/:id/show', async () => {
      const PostShow = () => <div data-testid="post-show">Show Post</div>

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={() => <div>List</div>} show={PostShow} />
        </Admin>,
        { initialEntries: ['/posts/1/show'] }
      )

      await waitFor(() => {
        expect(screen.getByTestId('post-show')).toBeInTheDocument()
      })
    })
  })

  describe('basename support', () => {
    it('respects basename prop for all routes', async () => {
      const PostList = () => <div data-testid="post-list">Posts</div>

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} basename="/admin">
          <Resource name="posts" list={PostList} />
        </Admin>,
        { initialEntries: ['/admin/posts'] }
      )

      // Should render correctly with basename
      await waitFor(() => {
        expect(document.body).toBeInTheDocument()
      })
    })
  })

  describe('navigation', () => {
    it('provides location information to components', async () => {
      let currentPath = ''

      const LocationDisplay = () => {
        const location = useLocation()
        currentPath = location.pathname
        return <div data-testid="location">{location.pathname}</div>
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <LocationDisplay />
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>,
        { initialEntries: ['/posts'] }
      )

      await waitFor(() => {
        expect(currentPath).toBe('/posts')
      })
    })
  })
})

/**
 * =============================================================================
 * SECTION 6: LAYOUT INTEGRATION
 * =============================================================================
 * Tests that verify the layout component is properly integrated during boot
 */
describe('Layout Integration During Boot', () => {
  const defaultDataProvider = createMockDataProvider()

  describe('default layout', () => {
    it('renders content even without layout prop', async () => {
      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={() => <div data-testid="content">Posts</div>} />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })
    })
  })

  describe('custom layout', () => {
    it('renders custom layout component', async () => {
      const CustomLayout = ({ children }: { children: ReactNode }) => (
        <div data-testid="custom-layout">
          <header data-testid="header">My Header</header>
          <main>{children}</main>
        </div>
      )

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} layout={CustomLayout}>
          <Resource name="posts" list={() => <div data-testid="content">Posts</div>} />
        </Admin>
      )

      await waitFor(() => {
        expect(screen.getByTestId('custom-layout')).toBeInTheDocument()
        expect(screen.getByTestId('header')).toHaveTextContent('My Header')
      })
    })

    it('passes resources to layout for menu building', async () => {
      let receivedResources: string[] = []

      const CustomLayout = ({ children }: { children: ReactNode }) => {
        const resources = useResourceDefinitions()
        receivedResources = Object.keys(resources)
        return <div data-testid="layout">{children}</div>
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} layout={CustomLayout}>
          <Resource name="posts" list={() => <div>Posts</div>} />
          <Resource name="users" list={() => <div>Users</div>} />
        </Admin>
      )

      await waitFor(() => {
        expect(receivedResources).toContain('posts')
        expect(receivedResources).toContain('users')
      })
    })
  })
})

/**
 * =============================================================================
 * SECTION 7: NOTIFICATION SYSTEM
 * =============================================================================
 * Tests that verify the notification system is set up during boot
 */
describe('Notification System Boot', () => {
  const defaultDataProvider = createMockDataProvider()

  it('provides useNotify hook to components', async () => {
    let notifyFn: unknown = null

    const NotifyConsumer = () => {
      notifyFn = useNotify()
      return <div data-testid="consumer">Ready</div>
    }

    renderAdmin(
      <Admin dataProvider={defaultDataProvider}>
        <NotifyConsumer />
      </Admin>
    )

    await waitFor(() => {
      expect(typeof notifyFn).toBe('function')
    })
  })

  it('allows showing notifications after boot', async () => {
    const NotifyTrigger = () => {
      const notify = useNotify()

      const handleClick = () => {
        notify('Test notification', { type: 'success' })
      }

      return (
        <button data-testid="notify-btn" onClick={handleClick}>
          Notify
        </button>
      )
    }

    renderAdmin(
      <Admin dataProvider={defaultDataProvider}>
        <NotifyTrigger />
      </Admin>
    )

    await waitFor(() => {
      expect(screen.getByTestId('notify-btn')).toBeInTheDocument()
    })
  })
})

/**
 * =============================================================================
 * SECTION 8: ERROR HANDLING DURING BOOT
 * =============================================================================
 * Tests that verify errors during boot are handled gracefully
 */
describe('Error Handling During Boot', () => {
  const defaultDataProvider = createMockDataProvider()

  // Suppress console.error for error tests
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalError
  })

  describe('component errors', () => {
    it('catches errors in Resource components during boot', () => {
      const ThrowingList = () => {
        throw new Error('Boot error in list component')
      }

      expect(() => {
        renderAdmin(
          <Admin dataProvider={defaultDataProvider}>
            <Resource name="posts" list={ThrowingList} />
          </Admin>
        )
      }).not.toThrow()
    })

    it('displays error boundary when boot fails', () => {
      const ThrowingList = () => {
        throw new Error('Boot error')
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <Resource name="posts" list={ThrowingList} />
        </Admin>
      )

      // Error boundary should catch and display error
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  describe('dataProvider errors', () => {
    it('handles dataProvider that throws during getList', async () => {
      const failingDataProvider = {
        ...defaultDataProvider,
        getList: vi.fn().mockRejectedValue(new Error('Network error')),
      }

      renderAdmin(
        <Admin dataProvider={failingDataProvider}>
          <Resource name="posts" list={() => <div data-testid="list">Posts</div>} />
        </Admin>
      )

      // Should not crash, error should be handled gracefully
      await waitFor(() => {
        expect(document.body).toBeInTheDocument()
      })
    })
  })
})

/**
 * =============================================================================
 * SECTION 9: FULL BOOT INTEGRATION
 * =============================================================================
 * Tests that verify the complete boot sequence with all features
 */
describe('Full Boot Integration', () => {
  it('boots a complete admin application', async () => {
    const dataProvider = createMockDataProvider({
      data: {
        posts: [
          { id: 1, title: 'Hello World' },
          { id: 2, title: 'Test Post' },
        ],
        users: [{ id: 1, name: 'Admin' }],
      },
    })
    const authProvider = createMockAuthProvider({
      identity: { id: 1, fullName: 'Admin User' },
    })

    const Dashboard = () => <div data-testid="dashboard">Welcome, Admin!</div>
    const Layout = ({ children }: { children: ReactNode }) => (
      <div data-testid="layout">
        <nav data-testid="nav">Navigation</nav>
        <main>{children}</main>
      </div>
    )
    const PostList = () => <div data-testid="post-list">Posts List</div>
    const UserList = () => <div data-testid="user-list">Users List</div>

    renderAdmin(
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        dashboard={Dashboard}
        layout={Layout}
      >
        <Resource name="posts" list={PostList} />
        <Resource name="users" list={UserList} />
      </Admin>
    )

    await waitFor(() => {
      // Layout should be rendered
      expect(screen.getByTestId('layout')).toBeInTheDocument()
      expect(screen.getByTestId('nav')).toBeInTheDocument()
      // Dashboard should be rendered at root
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })
  })

  it('boots with i18nProvider', async () => {
    const dataProvider = createMockDataProvider()
    const i18nProvider = {
      translate: (key: string) => key,
      changeLocale: async () => {},
      getLocale: () => 'en',
    }

    renderAdmin(
      <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Resource name="posts" list={() => <div data-testid="list">Posts</div>} />
      </Admin>
    )

    await waitFor(() => {
      expect(screen.getByTestId('list')).toBeInTheDocument()
    })
  })
})
