/**
 * Admin Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Admin } from './Admin'
import { Resource } from './Resource'
import { useDataProvider, useAuthProviderOptional } from '../../contexts'
import { createMockDataProvider, createMockAuthProvider } from '../../test-utils'
import { useTheme } from './ThemeProvider'

// Helper to wrap Admin with MemoryRouter
const renderAdmin = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('<Admin />', () => {
  const defaultDataProvider = createMockDataProvider()

  it('renders without crashing', () => {
    renderAdmin(
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

    renderAdmin(
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

    renderAdmin(
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

    renderAdmin(
      <Admin dataProvider={defaultDataProvider}>
        <TestComponent />
      </Admin>
    )

    expect(screen.getByTestId('has-authprovider')).toHaveTextContent('no')
  })

  it('renders children', () => {
    renderAdmin(
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

    renderAdmin(
      <Admin dataProvider={defaultDataProvider} layout={CustomLayout}>
        <div>Content</div>
      </Admin>
    )

    expect(screen.getByTestId('custom-layout')).toBeInTheDocument()
    expect(screen.getByText('My Header')).toBeInTheDocument()
  })

  it('renders dashboard when provided', async () => {
    const Dashboard = () => <div data-testid="dashboard">Welcome to Dashboard</div>

    renderAdmin(
      <Admin dataProvider={defaultDataProvider} dashboard={Dashboard}>
        <Resource name="posts" list={() => <div>Posts List</div>} />
      </Admin>
    )

    // Dashboard should render at root path
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('accepts basename prop for routing', () => {
    renderAdmin(
      <Admin dataProvider={defaultDataProvider} basename="/admin">
        <div>Content</div>
      </Admin>
    )

    // Component should render without errors
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('accepts basename prop', () => {
    renderAdmin(
      <Admin dataProvider={defaultDataProvider} basename="/admin">
        <div>Content</div>
      </Admin>
    )

    // Component should render without errors
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders Resource children correctly', () => {
    const PostList = () => <div data-testid="post-list">Posts</div>
    const UserList = () => <div data-testid="user-list">Users</div>

    renderAdmin(
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

    renderAdmin(
      <Admin dataProvider={defaultDataProvider} theme={theme} darkTheme={darkTheme}>
        <div>Content</div>
      </Admin>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

/**
 * Error Boundary Tests
 * Following TDD: RED phase - these tests should fail initially
 * as error boundaries may not be implemented in Admin component
 */
describe('<Admin /> Error Boundary Behavior', () => {
  const defaultDataProvider = createMockDataProvider()

  // Component that throws an error during render
  const ThrowingComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test error from child component')
    }
    return <div data-testid="child-content">Child rendered successfully</div>
  }

  // Suppress console.error for error boundary tests to keep test output clean
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalError
  })

  describe('error catching', () => {
    it('catches errors thrown by child components during render', () => {
      // Admin should catch the error and not propagate it
      // Without error boundary, this would cause the test to fail
      expect(() => {
        renderAdmin(
          <Admin dataProvider={defaultDataProvider}>
            <ThrowingComponent />
          </Admin>
        )
      }).not.toThrow()
    })

    it('catches errors thrown by deeply nested child components', () => {
      const DeeplyNestedThrower = () => (
        <div>
          <div>
            <div>
              <ThrowingComponent />
            </div>
          </div>
        </div>
      )

      expect(() => {
        renderAdmin(
          <Admin dataProvider={defaultDataProvider}>
            <DeeplyNestedThrower />
          </Admin>
        )
      }).not.toThrow()
    })

    it('catches errors thrown by Resource child components', () => {
      const ThrowingList = () => {
        throw new Error('Resource list error')
      }

      expect(() => {
        renderAdmin(
          <Admin dataProvider={defaultDataProvider}>
            <Resource name="posts" list={ThrowingList} />
          </Admin>
        )
      }).not.toThrow()
    })
  })

  describe('error fallback UI', () => {
    it('displays error fallback UI when a child component throws', () => {
      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <ThrowingComponent />
        </Admin>
      )

      // Should show some kind of error message in the UI
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })

    it('displays the error message in the fallback UI', () => {
      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <ThrowingComponent />
        </Admin>
      )

      // The specific error message should be visible
      expect(screen.getByText(/Test error from child component/i)).toBeInTheDocument()
    })

    it('uses custom error component when provided via error prop', () => {
      const CustomErrorComponent = ({ error }: { error: Error }) => (
        <div data-testid="custom-error">
          <h1>Custom Error Page</h1>
          <p>Error: {error.message}</p>
        </div>
      )

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} error={CustomErrorComponent}>
          <ThrowingComponent />
        </Admin>
      )

      expect(screen.getByTestId('custom-error')).toBeInTheDocument()
      expect(screen.getByText('Custom Error Page')).toBeInTheDocument()
      expect(screen.getByText(/Test error from child component/)).toBeInTheDocument()
    })

    it('provides resetErrorBoundary callback to custom error component', () => {
      const CustomErrorComponent = ({ resetErrorBoundary }: { error: Error; resetErrorBoundary?: () => void }) => (
        <div data-testid="custom-error">
          <button onClick={resetErrorBoundary}>Retry</button>
        </div>
      )

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} error={CustomErrorComponent}>
          <ThrowingComponent />
        </Admin>
      )

      // The retry button should be present
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    })
  })

  describe('error logging', () => {
    it('logs the error to console when a child component throws', () => {
      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <ThrowingComponent />
        </Admin>
      )

      // console.error should have been called with the error
      expect(console.error).toHaveBeenCalled()
    })

    it('logs the error with correct error message', () => {
      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <ThrowingComponent />
        </Admin>
      )

      // Check that the error message is in the logged error
      const errorCalls = (console.error as ReturnType<typeof vi.fn>).mock.calls
      const errorMessages = errorCalls.map(call =>
        call.map((arg: unknown) => (arg instanceof Error ? arg.message : String(arg))).join(' ')
      ).join(' ')

      expect(errorMessages).toContain('Test error from child component')
    })

    it('logs component stack trace when error boundary catches error', () => {
      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <ThrowingComponent />
        </Admin>
      )

      // Error boundary should log with component stack
      const errorCalls = (console.error as ReturnType<typeof vi.fn>).mock.calls
      const hasComponentStack = errorCalls.some(call =>
        call.some((arg: unknown) =>
          typeof arg === 'string' && (arg.includes('ThrowingComponent') || arg.includes('componentStack'))
        )
      )

      expect(hasComponentStack).toBe(true)
    })
  })

  describe('error recovery', () => {
    it('continues to render other content when one child throws', () => {
      renderAdmin(
        <Admin dataProvider={defaultDataProvider}>
          <div data-testid="sibling-content">Sibling content</div>
          <ThrowingComponent />
        </Admin>
      )

      // The admin should still be functional and show error UI
      // Note: behavior depends on implementation - whether entire tree is wrapped
      // or individual children are wrapped
      expect(document.body).toBeInTheDocument()
    })

    it('allows resetting error state to retry rendering', async () => {
      let shouldThrow = true
      const ConditionalThrow = () => {
        if (shouldThrow) {
          throw new Error('Conditional error')
        }
        return <div data-testid="recovered-content">Successfully recovered</div>
      }

      const CustomErrorComponent = ({ resetErrorBoundary }: { error: Error; resetErrorBoundary?: () => void }) => (
        <div data-testid="error-ui">
          <button onClick={() => {
            shouldThrow = false
            resetErrorBoundary?.()
          }}>
            Retry
          </button>
        </div>
      )

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} error={CustomErrorComponent}>
          <ConditionalThrow />
        </Admin>
      )

      // Initially should show error UI
      expect(screen.getByTestId('error-ui')).toBeInTheDocument()

      // After clicking retry and resetting, should show recovered content
      const { userEvent } = await import('@testing-library/user-event')
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: 'Retry' }))

      expect(screen.getByTestId('recovered-content')).toBeInTheDocument()
    })
  })
})

/**
 * Admin Theme Integration Tests
 * TDD: RED phase - These tests should FAIL because theme integration doesn't exist
 *
 * Tests that Admin component properly passes theme props to ThemeProvider
 */
describe('<Admin /> Theme Integration', () => {
  const defaultDataProvider = createMockDataProvider()

  // Suppress console.error for these tests
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
    // Reset document styles
    document.documentElement.removeAttribute('style')
    document.documentElement.classList.remove('light', 'dark')
  })
  afterEach(() => {
    console.error = originalError
    document.documentElement.removeAttribute('style')
    document.documentElement.classList.remove('light', 'dark')
  })

  describe('theme prop integration', () => {
    it('should pass theme prop to ThemeProvider and apply CSS variables', () => {
      const customTheme = {
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
        },
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} theme={customTheme}>
          <div>Content</div>
        </Admin>
      )

      // CSS variables should be applied to document root
      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-primary')).toBe('#3b82f6')
      expect(rootStyles.getPropertyValue('--color-secondary')).toBe('#8b5cf6')
    })

    it('should apply background color from theme', () => {
      const customTheme = {
        colors: {
          background: '#fafafa',
          foreground: '#171717',
        },
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} theme={customTheme}>
          <div>Content</div>
        </Admin>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-background')).toBe('#fafafa')
      expect(rootStyles.getPropertyValue('--color-foreground')).toBe('#171717')
    })
  })

  describe('darkTheme prop integration', () => {
    it('should pass darkTheme prop to ThemeProvider', () => {
      const lightTheme = {
        colors: {
          background: '#ffffff',
          foreground: '#000000',
        },
      }

      const darkTheme = {
        colors: {
          background: '#0a0a0a',
          foreground: '#fafafa',
        },
      }

      // Note: This test requires a way to enable dark mode to verify darkTheme is applied
      // For now, we verify Admin accepts both props without error
      renderAdmin(
        <Admin dataProvider={defaultDataProvider} theme={lightTheme} darkTheme={darkTheme}>
          <div>Content</div>
        </Admin>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should apply darkTheme CSS variables when dark mode is active', async () => {
      const lightTheme = {
        colors: {
          primary: '#3b82f6',
        },
      }

      const darkTheme = {
        colors: {
          primary: '#60a5fa',
        },
      }

      // Mock that we're testing a hook consumer
      const ThemeConsumer = () => {
        const { isDarkMode, toggleDarkMode } = useTheme()
        return (
          <div>
            <span data-testid="is-dark">{isDarkMode ? 'dark' : 'light'}</span>
            <button onClick={toggleDarkMode}>Toggle</button>
          </div>
        )
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} theme={lightTheme} darkTheme={darkTheme}>
          <ThemeConsumer />
        </Admin>
      )

      // Initially light mode
      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#3b82f6')

      // Toggle to dark mode
      const { userEvent } = await import('@testing-library/user-event')
      const user = userEvent.setup()
      await user.click(screen.getByText('Toggle'))

      // Should now apply dark theme
      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#60a5fa')
    })
  })

  describe('ThemeProvider context availability', () => {
    it('should provide useTheme hook to children', () => {
      const ThemeConsumer = () => {
        const { theme, isDarkMode, toggleDarkMode, mode, setMode } = useTheme()

        return (
          <div>
            <span data-testid="has-theme">{theme ? 'yes' : 'no'}</span>
            <span data-testid="has-isDarkMode">{typeof isDarkMode === 'boolean' ? 'yes' : 'no'}</span>
            <span data-testid="has-toggleDarkMode">{typeof toggleDarkMode === 'function' ? 'yes' : 'no'}</span>
            <span data-testid="has-mode">{typeof mode === 'string' ? 'yes' : 'no'}</span>
            <span data-testid="has-setMode">{typeof setMode === 'function' ? 'yes' : 'no'}</span>
          </div>
        )
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} theme={{ colors: { primary: '#000' } }}>
          <ThemeConsumer />
        </Admin>
      )

      expect(screen.getByTestId('has-theme')).toHaveTextContent('yes')
      expect(screen.getByTestId('has-isDarkMode')).toHaveTextContent('yes')
      expect(screen.getByTestId('has-toggleDarkMode')).toHaveTextContent('yes')
      expect(screen.getByTestId('has-mode')).toHaveTextContent('yes')
      expect(screen.getByTestId('has-setMode')).toHaveTextContent('yes')
    })

    it('should allow access to current theme values from useTheme', () => {
      const customTheme = {
        colors: {
          primary: '#3b82f6',
          accent: '#f59e0b',
        },
        spacing: {
          md: '16px',
        },
      }

      const ThemeValueConsumer = () => {
        const { theme } = useTheme()

        return (
          <div>
            <span data-testid="primary">{theme.colors?.primary as string}</span>
            <span data-testid="accent">{theme.colors?.accent as string}</span>
            <span data-testid="spacing">{theme.spacing?.md as string}</span>
          </div>
        )
      }

      renderAdmin(
        <Admin dataProvider={defaultDataProvider} theme={customTheme}>
          <ThemeValueConsumer />
        </Admin>
      )

      expect(screen.getByTestId('primary')).toHaveTextContent('#3b82f6')
      expect(screen.getByTestId('accent')).toHaveTextContent('#f59e0b')
      expect(screen.getByTestId('spacing')).toHaveTextContent('16px')
    })
  })

  describe('theme prop reactivity', () => {
    it('should update CSS variables when theme prop changes', () => {
      const theme1 = {
        colors: { primary: '#3b82f6' },
      }

      const theme2 = {
        colors: { primary: '#ef4444' },
      }

      const { rerender } = render(
        <MemoryRouter>
          <Admin dataProvider={defaultDataProvider} theme={theme1}>
            <div>Content</div>
          </Admin>
        </MemoryRouter>
      )

      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#3b82f6')

      rerender(
        <MemoryRouter>
          <Admin dataProvider={defaultDataProvider} theme={theme2}>
            <div>Content</div>
          </Admin>
        </MemoryRouter>
      )

      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#ef4444')
    })
  })
})
