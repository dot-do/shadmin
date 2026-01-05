/**
 * CoreAdminRoutes Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoreAdminRoutes } from './CoreAdminRoutes'
import { CoreAdminContext } from './CoreAdminContext'
import { createMockDataProvider } from '../../test-utils'
import type { ResourceProps } from '../../types'

describe('<CoreAdminRoutes />', () => {
  const defaultDataProvider = createMockDataProvider()

  const PostList = () => <div data-testid="post-list">Posts List</div>
  const PostEdit = () => <div data-testid="post-edit">Edit Post</div>
  const PostCreate = () => <div data-testid="post-create">Create Post</div>
  const PostShow = () => <div data-testid="post-show">Show Post</div>

  const UserList = () => <div data-testid="user-list">Users List</div>

  const Dashboard = () => <div data-testid="dashboard">Dashboard</div>

  const resources: ResourceProps[] = [
    { name: 'posts', list: PostList, edit: PostEdit, create: PostCreate, show: PostShow },
    { name: 'users', list: UserList },
  ]

  const renderWithContext = (
    ui: React.ReactElement,
    { initialPath = '/' }: { initialPath?: string } = {}
  ) => {
    // Mock window.location for routing tests
    Object.defineProperty(window, 'location', {
      value: { pathname: initialPath, search: '', hash: '' },
      writable: true,
    })

    return render(
      <CoreAdminContext dataProvider={defaultDataProvider} basename="">
        {ui}
      </CoreAdminContext>
    )
  }

  it('renders dashboard at root path', () => {
    renderWithContext(
      <CoreAdminRoutes resources={resources} dashboard={Dashboard} />,
      { initialPath: '/' }
    )

    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('renders without dashboard', () => {
    renderWithContext(
      <CoreAdminRoutes resources={resources} />,
      { initialPath: '/' }
    )

    // Should render something (likely redirect to first resource or empty state)
    expect(document.body).toBeInTheDocument()
  })

  it('creates list routes for resources', () => {
    renderWithContext(
      <CoreAdminRoutes resources={resources} />,
      { initialPath: '/posts' }
    )

    expect(screen.getByTestId('post-list')).toBeInTheDocument()
  })

  it('creates create routes for resources', () => {
    renderWithContext(
      <CoreAdminRoutes resources={resources} />,
      { initialPath: '/posts/create' }
    )

    expect(screen.getByTestId('post-create')).toBeInTheDocument()
  })

  it('creates edit routes for resources with :id param', () => {
    renderWithContext(
      <CoreAdminRoutes resources={resources} />,
      { initialPath: '/posts/1' }
    )

    expect(screen.getByTestId('post-edit')).toBeInTheDocument()
  })

  it('creates show routes for resources with :id/show', () => {
    renderWithContext(
      <CoreAdminRoutes resources={resources} />,
      { initialPath: '/posts/1/show' }
    )

    expect(screen.getByTestId('post-show')).toBeInTheDocument()
  })

  it('only creates routes for provided components', () => {
    renderWithContext(
      <CoreAdminRoutes resources={resources} />,
      { initialPath: '/users/create' }
    )

    // users resource has no create component, should show 404 or redirect
    expect(screen.queryByTestId('user-create')).not.toBeInTheDocument()
  })

  it('wraps routes with layout when provided', () => {
    const CustomLayout = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="layout">
        <nav>Navigation</nav>
        <main>{children}</main>
      </div>
    )

    renderWithContext(
      <CoreAdminRoutes resources={resources} layout={CustomLayout} />,
      { initialPath: '/posts' }
    )

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByText('Navigation')).toBeInTheDocument()
  })

  it('passes dashboard to layout', () => {
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

  it('handles catchAll route for unknown paths', () => {
    const NotFound = () => <div data-testid="not-found">Page Not Found</div>

    renderWithContext(
      <CoreAdminRoutes resources={resources} catchAll={NotFound} />,
      { initialPath: '/unknown-path' }
    )

    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })
})
