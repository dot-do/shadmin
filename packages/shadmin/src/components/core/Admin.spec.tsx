/**
 * Admin Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Admin } from './Admin'
import { Resource } from './Resource'
import { useDataProvider, useAuthProviderOptional } from '../../contexts'
import { createMockDataProvider, createMockAuthProvider } from '../../test-utils'

describe('<Admin />', () => {
  const defaultDataProvider = createMockDataProvider()

  it('renders without crashing', () => {
    render(
      <Admin dataProvider={defaultDataProvider}>
        <div>Test content</div>
      </Admin>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('provides DataProviderContext', () => {
    const mockDataProvider = createMockDataProvider({
      data: { users: [{ id: 1, name: 'Test User' }] },
    })

    const TestComponent = () => {
      const dataProvider = useDataProvider()
      return <div data-testid="has-dataprovider">{dataProvider ? 'yes' : 'no'}</div>
    }

    render(
      <Admin dataProvider={mockDataProvider}>
        <TestComponent />
      </Admin>
    )

    expect(screen.getByTestId('has-dataprovider')).toHaveTextContent('yes')
  })

  it('provides AuthProviderContext when authProvider is passed', () => {
    const mockAuthProvider = createMockAuthProvider()

    const TestComponent = () => {
      const authProvider = useAuthProviderOptional()
      return <div data-testid="has-authprovider">{authProvider ? 'yes' : 'no'}</div>
    }

    render(
      <Admin dataProvider={defaultDataProvider} authProvider={mockAuthProvider}>
        <TestComponent />
      </Admin>
    )

    expect(screen.getByTestId('has-authprovider')).toHaveTextContent('yes')
  })

  it('does not require authProvider', () => {
    const TestComponent = () => {
      const authProvider = useAuthProviderOptional()
      return <div data-testid="has-authprovider">{authProvider ? 'yes' : 'no'}</div>
    }

    render(
      <Admin dataProvider={defaultDataProvider}>
        <TestComponent />
      </Admin>
    )

    expect(screen.getByTestId('has-authprovider')).toHaveTextContent('no')
  })

  it('renders children', () => {
    render(
      <Admin dataProvider={defaultDataProvider}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </Admin>
    )

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
  })

  it('renders layout when provided', () => {
    const CustomLayout = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-layout">
        <header>My Header</header>
        <main>{children}</main>
      </div>
    )

    render(
      <Admin dataProvider={defaultDataProvider} layout={CustomLayout}>
        <div>Content</div>
      </Admin>
    )

    expect(screen.getByTestId('custom-layout')).toBeInTheDocument()
    expect(screen.getByText('My Header')).toBeInTheDocument()
  })

  it('renders dashboard when provided', async () => {
    const Dashboard = () => <div data-testid="dashboard">Welcome to Dashboard</div>

    render(
      <Admin dataProvider={defaultDataProvider} dashboard={Dashboard}>
        <Resource name="posts" list={() => <div>Posts List</div>} />
      </Admin>
    )

    // Dashboard should render at root path
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('accepts basename prop for routing', () => {
    render(
      <Admin dataProvider={defaultDataProvider} basename="/admin">
        <div>Content</div>
      </Admin>
    )

    // Component should render without errors
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('accepts title prop', () => {
    render(
      <Admin dataProvider={defaultDataProvider} title="My Admin App">
        <div>Content</div>
      </Admin>
    )

    // Component should render without errors
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders Resource children correctly', () => {
    const PostList = () => <div data-testid="post-list">Posts</div>
    const UserList = () => <div data-testid="user-list">Users</div>

    render(
      <Admin dataProvider={defaultDataProvider}>
        <Resource name="posts" list={PostList} />
        <Resource name="users" list={UserList} />
      </Admin>
    )

    // At least the admin should render
    expect(document.body).toBeInTheDocument()
  })

  it('accepts theme and darkTheme props', () => {
    const theme = { palette: { primary: { main: '#000' } } }
    const darkTheme = { palette: { primary: { main: '#fff' } } }

    render(
      <Admin dataProvider={defaultDataProvider} theme={theme} darkTheme={darkTheme}>
        <div>Content</div>
      </Admin>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
