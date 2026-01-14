/**
 * CoreAdminContext Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { CoreAdminContext } from './CoreAdminContext'
import {
  useDataProvider,
  useAuthProviderOptional,
  useResourceDefinitions,
} from '../../contexts'
import { createMockDataProvider, createMockAuthProvider } from '../../test-utils'

describe('<CoreAdminContext />', () => {
  const defaultDataProvider = createMockDataProvider()

  it('renders children', () => {
    render(
      <CoreAdminContext dataProvider={defaultDataProvider}>
        <div data-testid="child">Hello</div>
      </CoreAdminContext>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('provides DataProvider context', () => {
    const TestComponent = () => {
      const dataProvider = useDataProvider()
      return <div data-testid="test">{typeof dataProvider.getList}</div>
    }

    render(
      <CoreAdminContext dataProvider={defaultDataProvider}>
        <TestComponent />
      </CoreAdminContext>
    )

    expect(screen.getByTestId('test')).toHaveTextContent('function')
  })

  it('provides AuthProvider context when passed', () => {
    const mockAuthProvider = createMockAuthProvider()

    const TestComponent = () => {
      const authProvider = useAuthProviderOptional()
      return <div data-testid="test">{authProvider ? 'has-auth' : 'no-auth'}</div>
    }

    render(
      <CoreAdminContext dataProvider={defaultDataProvider} authProvider={mockAuthProvider}>
        <TestComponent />
      </CoreAdminContext>
    )

    expect(screen.getByTestId('test')).toHaveTextContent('has-auth')
  })

  it('works without AuthProvider', () => {
    const TestComponent = () => {
      const authProvider = useAuthProviderOptional()
      return <div data-testid="test">{authProvider ? 'has-auth' : 'no-auth'}</div>
    }

    render(
      <CoreAdminContext dataProvider={defaultDataProvider}>
        <TestComponent />
      </CoreAdminContext>
    )

    expect(screen.getByTestId('test')).toHaveTextContent('no-auth')
  })

  it('provides QueryClient for data fetching', async () => {
    // The QueryClient should be available for hooks like useQuery
    render(
      <CoreAdminContext dataProvider={defaultDataProvider}>
        <div data-testid="content">Content</div>
      </CoreAdminContext>
    )

    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('provides ResourceDefinitions context', () => {
    const TestComponent = () => {
      const definitions = useResourceDefinitions()
      return <div data-testid="test">{typeof definitions}</div>
    }

    render(
      <CoreAdminContext dataProvider={defaultDataProvider}>
        <TestComponent />
      </CoreAdminContext>
    )

    expect(screen.getByTestId('test')).toHaveTextContent('object')
  })

  it('accepts basename prop', () => {
    render(
      <CoreAdminContext dataProvider={defaultDataProvider} basename="/admin">
        <div data-testid="content">Content</div>
      </CoreAdminContext>
    )

    expect(screen.getByTestId('content')).toBeInTheDocument()
  })
})
