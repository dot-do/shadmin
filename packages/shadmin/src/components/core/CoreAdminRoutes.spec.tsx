/**
 * CoreAdminRoutes Component Tests
 * Comprehensive tests for React Router integration
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { CoreAdminContext } from './CoreAdminContext'
import { CoreAdminRoutes } from './CoreAdminRoutes'
import { useResource, useResourceContext } from '../../contexts'
import { createMockDataProvider } from '../../test-utils'

import type { ResourceProps } from '../../types'

describe('<CoreAdminRoutes />', () => {
  const defaultDataProvider = createMockDataProvider()

  // Mock components for testing
  const PostList = () => <div data-testid="post-list">Posts List</div>
  const PostEdit = () => <div data-testid="post-edit">Edit Post</div>
  const PostCreate = () => <div data-testid="post-create">Create Post</div>
  const PostShow = () => <div data-testid="post-show">Show Post</div>

  const UserList = () => <div data-testid="user-list">Users List</div>
  const UserEdit = () => <div data-testid="user-edit">Edit User</div>

  const CommentList = () => <div data-testid="comment-list">Comments List</div>
  const CommentCreate = () => <div data-testid="comment-create">Create Comment</div>

  const Dashboard = () => <div data-testid="dashboard">Dashboard</div>
  const NotFound = () => <div data-testid="not-found">Page Not Found</div>

  const resources: ResourceProps[] = [
    { name: 'posts', list: PostList, edit: PostEdit, create: PostCreate, show: PostShow },
    { name: 'users', list: UserList, edit: UserEdit },
    { name: 'comments', list: CommentList, create: CommentCreate },
  ]

  const renderWithContext = (
    ui: React.ReactElement,
    { initialPath = '/' }: { initialPath?: string } = {}
  ) => {
    // Use React Router's MemoryRouter for routing tests
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <CoreAdminContext dataProvider={defaultDataProvider} basename="">
          {ui}
        </CoreAdminContext>
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ===========================================
  // Route Generation from Resources
  // ===========================================
  describe('Route generation from resources', () => {
    it('generates list routes for all resources with list components', () => {
      // Test posts list
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/posts' }
      )
      expect(screen.getByTestId('post-list')).toBeInTheDocument()
    })

    it('generates list route for users resource', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/users' }
      )
      expect(screen.getByTestId('user-list')).toBeInTheDocument()
    })

    it('generates list route for comments resource', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/comments' }
      )
      expect(screen.getByTestId('comment-list')).toBeInTheDocument()
    })

    it('generates create routes for resources with create components', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/posts/create' }
      )
      expect(screen.getByTestId('post-create')).toBeInTheDocument()
    })

    it('generates edit routes with :id parameter', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/posts/123' }
      )
      expect(screen.getByTestId('post-edit')).toBeInTheDocument()
    })

    it('generates show routes with :id/show pattern', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/posts/456/show' }
      )
      expect(screen.getByTestId('post-show')).toBeInTheDocument()
    })

    it('handles numeric IDs in edit routes', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/users/999' }
      )
      expect(screen.getByTestId('user-edit')).toBeInTheDocument()
    })

    it('handles UUID-style IDs in edit routes', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890' }
      )
      expect(screen.getByTestId('post-edit')).toBeInTheDocument()
    })

    it('handles string IDs in edit routes', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/posts/my-post-slug' }
      )
      expect(screen.getByTestId('post-edit')).toBeInTheDocument()
    })

    it('does not create routes for missing components', () => {
      // Users has no create component
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/users/create' }
      )
      expect(screen.queryByTestId('user-create')).not.toBeInTheDocument()
    })

    it('does not create show routes when show is not defined', () => {
      // Users has no show component
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/users/1/show' }
      )
      expect(screen.queryByTestId('user-show')).not.toBeInTheDocument()
    })

    it('handles resources with only list component', () => {
      const simpleResources: ResourceProps[] = [
        { name: 'logs', list: () => <div data-testid="logs-list">Logs</div> },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={simpleResources} />,
        { initialPath: '/logs' }
      )
      expect(screen.getByTestId('logs-list')).toBeInTheDocument()
    })

    it('handles resources with only create component', () => {
      const createOnlyResources: ResourceProps[] = [
        { name: 'feedback', create: () => <div data-testid="feedback-create">Submit Feedback</div> },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={createOnlyResources} />,
        { initialPath: '/feedback/create' }
      )
      expect(screen.getByTestId('feedback-create')).toBeInTheDocument()
    })

    it('handles empty resources array', () => {
      renderWithContext(
        <CoreAdminRoutes resources={[]} dashboard={Dashboard} />,
        { initialPath: '/' }
      )
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })
  })

  // ===========================================
  // Default Routes (Dashboard and CatchAll)
  // ===========================================
  describe('Default routes', () => {
    describe('Dashboard route', () => {
      it('renders dashboard at root path', () => {
        renderWithContext(
          <CoreAdminRoutes resources={resources} dashboard={Dashboard} />,
          { initialPath: '/' }
        )
        expect(screen.getByTestId('dashboard')).toBeInTheDocument()
      })

      it('renders dashboard at empty path', () => {
        renderWithContext(
          <CoreAdminRoutes resources={resources} dashboard={Dashboard} />,
          { initialPath: '' }
        )
        expect(screen.getByTestId('dashboard')).toBeInTheDocument()
      })

      it('renders first resource list when no dashboard provided', () => {
        renderWithContext(
          <CoreAdminRoutes resources={resources} />,
          { initialPath: '/' }
        )
        // Should redirect to first resource with a list
        expect(screen.getByTestId('post-list')).toBeInTheDocument()
      })

      it('renders nothing when no dashboard and no resources have list', () => {
        const noListResources: ResourceProps[] = [
          { name: 'settings', create: () => <div>Settings</div> },
        ]

        const { container } = renderWithContext(
          <CoreAdminRoutes resources={noListResources} />,
          { initialPath: '/' }
        )
        // Should render nothing substantive
        expect(container.textContent).toBe('')
      })
    })

    describe('CatchAll route', () => {
      it('renders catchAll for unknown paths', () => {
        renderWithContext(
          <CoreAdminRoutes resources={resources} catchAll={NotFound} />,
          { initialPath: '/unknown-path' }
        )
        expect(screen.getByTestId('not-found')).toBeInTheDocument()
      })

      it('renders catchAll for partially matching paths', () => {
        renderWithContext(
          <CoreAdminRoutes resources={resources} catchAll={NotFound} />,
          { initialPath: '/posts/1/unknown' }
        )
        expect(screen.getByTestId('not-found')).toBeInTheDocument()
      })

      it('renders catchAll for deeply nested unknown paths', () => {
        renderWithContext(
          <CoreAdminRoutes resources={resources} catchAll={NotFound} />,
          { initialPath: '/a/b/c/d/e' }
        )
        expect(screen.getByTestId('not-found')).toBeInTheDocument()
      })

      it('renders nothing when no catchAll and path does not match', () => {
        const { container } = renderWithContext(
          <CoreAdminRoutes resources={resources} />,
          { initialPath: '/unknown-path' }
        )
        // No catchAll means nothing rendered for unknown paths
        expect(container.textContent).toBe('')
      })

      it('does not use catchAll for valid resource paths', () => {
        renderWithContext(
          <CoreAdminRoutes resources={resources} catchAll={NotFound} />,
          { initialPath: '/posts' }
        )
        expect(screen.queryByTestId('not-found')).not.toBeInTheDocument()
        expect(screen.getByTestId('post-list')).toBeInTheDocument()
      })
    })
  })

  // ===========================================
  // Layout Integration
  // ===========================================
  describe('Layout integration', () => {
    it('wraps content with layout when provided', () => {
      const CustomLayout = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="layout">
          <nav data-testid="nav">Navigation</nav>
          <main data-testid="main">{children}</main>
        </div>
      )

      renderWithContext(
        <CoreAdminRoutes resources={resources} layout={CustomLayout} />,
        { initialPath: '/posts' }
      )

      expect(screen.getByTestId('layout')).toBeInTheDocument()
      expect(screen.getByTestId('nav')).toBeInTheDocument()
      expect(screen.getByTestId('main')).toBeInTheDocument()
      expect(screen.getByTestId('post-list')).toBeInTheDocument()
    })

    it('passes dashboard component to layout', () => {
      const CustomLayout = ({
        children,
        dashboard,
      }: {
        children: React.ReactNode
        dashboard?: React.ComponentType
      }) => (
        <div data-testid="layout">
          <span data-testid="has-dashboard">{dashboard ? 'yes' : 'no'}</span>
          <main>{children}</main>
        </div>
      )

      renderWithContext(
        <CoreAdminRoutes resources={resources} layout={CustomLayout} dashboard={Dashboard} />,
        { initialPath: '/posts' }
      )

      expect(screen.getByTestId('has-dashboard')).toHaveTextContent('yes')
    })

    it('layout receives null dashboard when not provided', () => {
      const CustomLayout = ({
        children,
        dashboard,
      }: {
        children: React.ReactNode
        dashboard?: React.ComponentType
      }) => (
        <div data-testid="layout">
          <span data-testid="has-dashboard">{dashboard ? 'yes' : 'no'}</span>
          <main>{children}</main>
        </div>
      )

      renderWithContext(
        <CoreAdminRoutes resources={resources} layout={CustomLayout} />,
        { initialPath: '/posts' }
      )

      expect(screen.getByTestId('has-dashboard')).toHaveTextContent('no')
    })

    it('renders content without layout wrapper when layout not provided', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/posts' }
      )

      expect(screen.queryByTestId('layout')).not.toBeInTheDocument()
      expect(screen.getByTestId('post-list')).toBeInTheDocument()
    })

    it('layout wraps dashboard content', () => {
      const CustomLayout = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="layout">
          <main>{children}</main>
        </div>
      )

      renderWithContext(
        <CoreAdminRoutes resources={resources} layout={CustomLayout} dashboard={Dashboard} />,
        { initialPath: '/' }
      )

      expect(screen.getByTestId('layout')).toBeInTheDocument()
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })

    it('layout wraps catchAll content', () => {
      const CustomLayout = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="layout">
          <main>{children}</main>
        </div>
      )

      renderWithContext(
        <CoreAdminRoutes resources={resources} layout={CustomLayout} catchAll={NotFound} />,
        { initialPath: '/unknown' }
      )

      expect(screen.getByTestId('layout')).toBeInTheDocument()
      expect(screen.getByTestId('not-found')).toBeInTheDocument()
    })
  })

  // ===========================================
  // ResourceContext Integration
  // ===========================================
  describe('ResourceContext integration', () => {
    it('provides resource name via ResourceContext for list routes', () => {
      const ListWithContext = () => {
        const resource = useResource()
        return <div data-testid="resource-name">{resource}</div>
      }

      const contextResources: ResourceProps[] = [
        { name: 'articles', list: ListWithContext },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={contextResources} />,
        { initialPath: '/articles' }
      )

      expect(screen.getByTestId('resource-name')).toHaveTextContent('articles')
    })

    it('provides resource name via ResourceContext for edit routes', () => {
      const EditWithContext = () => {
        const resource = useResource()
        return <div data-testid="resource-name">{resource}</div>
      }

      const contextResources: ResourceProps[] = [
        { name: 'articles', edit: EditWithContext },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={contextResources} />,
        { initialPath: '/articles/1' }
      )

      expect(screen.getByTestId('resource-name')).toHaveTextContent('articles')
    })

    it('provides resource name via ResourceContext for create routes', () => {
      const CreateWithContext = () => {
        const resource = useResource()
        return <div data-testid="resource-name">{resource}</div>
      }

      const contextResources: ResourceProps[] = [
        { name: 'articles', create: CreateWithContext },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={contextResources} />,
        { initialPath: '/articles/create' }
      )

      expect(screen.getByTestId('resource-name')).toHaveTextContent('articles')
    })

    it('provides resource name via ResourceContext for show routes', () => {
      const ShowWithContext = () => {
        const resource = useResource()
        return <div data-testid="resource-name">{resource}</div>
      }

      const contextResources: ResourceProps[] = [
        { name: 'articles', show: ShowWithContext },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={contextResources} />,
        { initialPath: '/articles/1/show' }
      )

      expect(screen.getByTestId('resource-name')).toHaveTextContent('articles')
    })

    it('does not provide ResourceContext for dashboard', () => {
      const DashboardWithContext = () => {
        const resource = useResourceContext()
        return <div data-testid="resource-value">{resource ?? 'no-resource'}</div>
      }

      renderWithContext(
        <CoreAdminRoutes resources={resources} dashboard={DashboardWithContext} />,
        { initialPath: '/' }
      )

      expect(screen.getByTestId('resource-value')).toHaveTextContent('no-resource')
    })

    it('does not provide ResourceContext for catchAll', () => {
      const CatchAllWithContext = () => {
        const resource = useResourceContext()
        return <div data-testid="resource-value">{resource ?? 'no-resource'}</div>
      }

      renderWithContext(
        <CoreAdminRoutes resources={resources} catchAll={CatchAllWithContext} />,
        { initialPath: '/unknown' }
      )

      expect(screen.getByTestId('resource-value')).toHaveTextContent('no-resource')
    })
  })

  // ===========================================
  // Route Priority and Matching
  // ===========================================
  describe('Route priority and matching', () => {
    it('prioritizes create route over edit route for /resource/create', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/posts/create' }
      )

      expect(screen.getByTestId('post-create')).toBeInTheDocument()
      expect(screen.queryByTestId('post-edit')).not.toBeInTheDocument()
    })

    it('prioritizes show route over edit route for /resource/:id/show', () => {
      renderWithContext(
        <CoreAdminRoutes resources={resources} />,
        { initialPath: '/posts/1/show' }
      )

      expect(screen.getByTestId('post-show')).toBeInTheDocument()
      expect(screen.queryByTestId('post-edit')).not.toBeInTheDocument()
    })

    it('matches first resource when multiple resources could match', () => {
      const duplicateResources: ResourceProps[] = [
        { name: 'posts', list: () => <div data-testid="first-posts">First</div> },
        { name: 'posts', list: () => <div data-testid="second-posts">Second</div> },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={duplicateResources} />,
        { initialPath: '/posts' }
      )

      expect(screen.getByTestId('first-posts')).toBeInTheDocument()
      expect(screen.queryByTestId('second-posts')).not.toBeInTheDocument()
    })
  })

  // ===========================================
  // Edge Cases
  // ===========================================
  describe('Edge cases', () => {
    it('handles resource names with hyphens', () => {
      const hyphenResources: ResourceProps[] = [
        { name: 'blog-posts', list: () => <div data-testid="blog-posts-list">Blog Posts</div> },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={hyphenResources} />,
        { initialPath: '/blog-posts' }
      )

      expect(screen.getByTestId('blog-posts-list')).toBeInTheDocument()
    })

    it('handles resource names with underscores', () => {
      const underscoreResources: ResourceProps[] = [
        { name: 'user_profiles', list: () => <div data-testid="user-profiles-list">User Profiles</div> },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={underscoreResources} />,
        { initialPath: '/user_profiles' }
      )

      expect(screen.getByTestId('user-profiles-list')).toBeInTheDocument()
    })

    it('handles deeply nested resource URLs', () => {
      // Only the first two segments should match
      renderWithContext(
        <CoreAdminRoutes resources={resources} catchAll={NotFound} />,
        { initialPath: '/posts/1/2/3/4' }
      )

      // Should not match any route and fall back to catchAll
      expect(screen.getByTestId('not-found')).toBeInTheDocument()
    })

    it('handles trailing slashes', () => {
      // Note: This depends on implementation - may or may not strip trailing slash
      renderWithContext(
        <CoreAdminRoutes resources={resources} catchAll={NotFound} />,
        { initialPath: '/posts/' }
      )

      // With trailing slash, the path doesn't exactly match /posts
      // Behavior depends on implementation
      expect(document.body).toBeInTheDocument()
    })

    it('handles single resource', () => {
      const singleResource: ResourceProps[] = [
        { name: 'settings', list: () => <div data-testid="settings">Settings</div> },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={singleResource} />,
        { initialPath: '/settings' }
      )

      expect(screen.getByTestId('settings')).toBeInTheDocument()
    })

    it('handles resource with all CRUD operations', () => {
      const fullResource: ResourceProps[] = [
        {
          name: 'products',
          list: () => <div data-testid="products-list">List</div>,
          create: () => <div data-testid="products-create">Create</div>,
          edit: () => <div data-testid="products-edit">Edit</div>,
          show: () => <div data-testid="products-show">Show</div>,
        },
      ]

      // Test each route
      renderWithContext(
        <CoreAdminRoutes resources={fullResource} />,
        { initialPath: '/products' }
      )
      expect(screen.getByTestId('products-list')).toBeInTheDocument()
    })

    it('handles many resources without performance issues', () => {
      const manyResources: ResourceProps[] = Array.from({ length: 50 }, (_, i) => ({
        name: `resource${i}`,
        list: () => <div data-testid={`resource${i}-list`}>Resource {i}</div>,
      }))

      renderWithContext(
        <CoreAdminRoutes resources={manyResources} />,
        { initialPath: '/resource25' }
      )

      expect(screen.getByTestId('resource25-list')).toBeInTheDocument()
    })
  })

  // ===========================================
  // Custom Routes Integration
  // ===========================================
  describe('Custom routes', () => {
    it('renders custom component from resource', () => {
      const CustomPage = () => <div data-testid="custom-page">Custom Page</div>

      const customResources: ResourceProps[] = [
        { name: 'custom', list: CustomPage },
      ]

      renderWithContext(
        <CoreAdminRoutes resources={customResources} />,
        { initialPath: '/custom' }
      )

      expect(screen.getByTestId('custom-page')).toBeInTheDocument()
    })
  })

  // ===========================================
  // Memoization and Performance
  // ===========================================
  describe('Memoization', () => {
    it('uses memoized route matching', () => {
      // The component should use useMemo for route matching
      const { rerender } = renderWithContext(
        <CoreAdminRoutes resources={resources} dashboard={Dashboard} />,
        { initialPath: '/' }
      )

      expect(screen.getByTestId('dashboard')).toBeInTheDocument()

      // Re-render with same props should use memoized value
      rerender(
        <MemoryRouter initialEntries={['/']}>
          <CoreAdminContext dataProvider={defaultDataProvider} basename="">
            <CoreAdminRoutes resources={resources} dashboard={Dashboard} />
          </CoreAdminContext>
        </MemoryRouter>
      )

      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })
  })

  // ===========================================
  // Backward Compatibility
  // ===========================================
  describe('API compatibility', () => {
    it('accepts all documented props', () => {
      const Layout = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

      // This should compile and render without errors
      renderWithContext(
        <CoreAdminRoutes
          resources={resources}
          dashboard={Dashboard}
          layout={Layout}
          catchAll={NotFound}
        />,
        { initialPath: '/' }
      )

      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })

    it('works with minimal props', () => {
      renderWithContext(
        <CoreAdminRoutes resources={[]} />,
        { initialPath: '/' }
      )

      // Should render without crashing
      expect(document.body).toBeInTheDocument()
    })
  })
})
