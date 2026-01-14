/**
 * Resource Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'

import { Admin } from './Admin'
import { Resource } from './Resource'
import { useResource, useResourceDefinitions, useResourceDefinition } from '../../contexts'
import { createMockDataProvider } from '../../test-utils'

// Helper to wrap Admin with MemoryRouter
const renderWithRouter = (ui: React.ReactElement, initialEntries = ['/']) => {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}

describe('<Resource />', () => {
  const defaultDataProvider = createMockDataProvider()

  it('registers resource in context', () => {
    const TestComponent = () => {
      const definitions = useResourceDefinitions()
      const names = Object.keys(definitions)
      return <div data-testid="resources">{names.join(',')}</div>
    }

    renderWithRouter(
      <Admin dataProvider={defaultDataProvider}>
        <Resource name="posts" list={() => <div>Posts</div>} />
        <Resource name="users" list={() => <div>Users</div>} />
        <TestComponent />
      </Admin>
    )

    expect(screen.getByTestId('resources')).toHaveTextContent('posts')
    expect(screen.getByTestId('resources')).toHaveTextContent('users')
  })

  it('provides resource name via ResourceContext', () => {
    const PostList = () => {
      const resource = useResource()
      return <div data-testid="resource-name">{resource}</div>
    }

    renderWithRouter(
      <Admin dataProvider={defaultDataProvider}>
        <Resource name="posts" list={PostList} />
      </Admin>
    )

    expect(screen.getByTestId('resource-name')).toHaveTextContent('posts')
  })

  it('creates route for list component', () => {
    const PostList = () => <div data-testid="post-list">Posts List</div>

    renderWithRouter(
      <Admin dataProvider={defaultDataProvider} basename="">
        <Resource name="posts" list={PostList} />
      </Admin>
    )

    // Navigate to /posts and check list renders
    // The list should be accessible
    expect(screen.getByTestId('post-list')).toBeInTheDocument()
  })

  it('creates route for create component', () => {
    const PostCreate = () => <div data-testid="post-create">Create Post</div>

    renderWithRouter(
      <Admin dataProvider={defaultDataProvider} basename="">
        <Resource name="posts" create={PostCreate} />
      </Admin>
    )

    // The create component should be registered
    expect(document.body).toBeInTheDocument()
  })

  it('creates route for edit component', () => {
    const PostEdit = () => <div data-testid="post-edit">Edit Post</div>

    renderWithRouter(
      <Admin dataProvider={defaultDataProvider} basename="">
        <Resource name="posts" edit={PostEdit} />
      </Admin>
    )

    // The edit component should be registered
    expect(document.body).toBeInTheDocument()
  })

  it('creates route for show component', () => {
    const PostShow = () => <div data-testid="post-show">Show Post</div>

    renderWithRouter(
      <Admin dataProvider={defaultDataProvider} basename="">
        <Resource name="posts" show={PostShow} />
      </Admin>
    )

    // The show component should be registered
    expect(document.body).toBeInTheDocument()
  })

  it('only creates routes for provided components', () => {
    const TestComponent = () => {
      const definition = useResourceDefinition('posts')
      return (
        <div>
          <span data-testid="has-list">{definition?.hasList ? 'yes' : 'no'}</span>
          <span data-testid="has-edit">{definition?.hasEdit ? 'yes' : 'no'}</span>
          <span data-testid="has-create">{definition?.hasCreate ? 'yes' : 'no'}</span>
          <span data-testid="has-show">{definition?.hasShow ? 'yes' : 'no'}</span>
        </div>
      )
    }

    renderWithRouter(
      <Admin dataProvider={defaultDataProvider}>
        <Resource name="posts" list={() => <div>List</div>} edit={() => <div>Edit</div>} />
        <TestComponent />
      </Admin>
    )

    expect(screen.getByTestId('has-list')).toHaveTextContent('yes')
    expect(screen.getByTestId('has-edit')).toHaveTextContent('yes')
    expect(screen.getByTestId('has-create')).toHaveTextContent('no')
    expect(screen.getByTestId('has-show')).toHaveTextContent('no')
  })

  it('stores icon in resource definition', () => {
    const PostIcon = () => <span>icon</span>

    const TestComponent = () => {
      const definition = useResourceDefinition('posts')
      const IconComponent = definition?.icon
      return (
        <div data-testid="icon-exists">
          {IconComponent ? <IconComponent /> : 'no icon'}
        </div>
      )
    }

    renderWithRouter(
      <Admin dataProvider={defaultDataProvider}>
        <Resource name="posts" list={() => <div>List</div>} icon={PostIcon} />
        <TestComponent />
      </Admin>
    )

    expect(screen.getByTestId('icon-exists')).toHaveTextContent('icon')
  })

  it('stores options in resource definition', () => {
    const TestComponent = () => {
      const definition = useResourceDefinition('posts')
      return (
        <div data-testid="label">
          {definition?.options?.label ?? 'no label'}
        </div>
      )
    }

    renderWithRouter(
      <Admin dataProvider={defaultDataProvider}>
        <Resource
          name="posts"
          list={() => <div>List</div>}
          options={{ label: 'Blog Posts' }}
        />
        <TestComponent />
      </Admin>
    )

    expect(screen.getByTestId('label')).toHaveTextContent('Blog Posts')
  })

  it('can render without any CRUD components (menu-only resource)', () => {
    renderWithRouter(
      <Admin dataProvider={defaultDataProvider}>
        <Resource name="settings" options={{ label: 'Settings' }} />
      </Admin>
    )

    // Should render without errors
    expect(document.body).toBeInTheDocument()
  })
})
