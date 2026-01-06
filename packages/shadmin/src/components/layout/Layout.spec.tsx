/**
 * Layout Component Tests
 * TDD: RED phase - Write failing tests first
 *
 * Tests cover:
 * - Basic props interface (children, sidebar, appBar, menu)
 * - ShadCN SidebarProvider integration
 * - Responsive behavior (mobile sidebar toggle)
 * - Custom sidebar/appBar/menu component props
 * - Theme switching support
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { Layout } from './Layout'
import { AppBar } from './AppBar'
import { ContainerLayout } from './ContainerLayout'
import { TestMemoryRouter } from '../../test-utils'

// Test wrapper with router
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <TestMemoryRouter initialEntries={['/']}>
    {children}
  </TestMemoryRouter>
)

describe('Layout Component', () => {
  describe('Basic Props Interface', () => {
    it('should render children in the main content area', () => {
      render(
        <TestWrapper>
          <Layout>
            <div data-testid="content">Main Content</div>
          </Layout>
        </TestWrapper>
      )

      expect(screen.getByTestId('content')).toBeInTheDocument()
      expect(screen.getByText('Main Content')).toBeInTheDocument()
    })

    it('should accept sidebar prop as a ReactNode', () => {
      const CustomSidebar = () => (
        <nav data-testid="custom-sidebar">Custom Sidebar</nav>
      )

      render(
        <TestWrapper>
          <Layout sidebar={<CustomSidebar />}>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      expect(screen.getByTestId('custom-sidebar')).toBeInTheDocument()
    })

    it('should accept appBar prop as a ReactNode', () => {
      const CustomAppBar = () => (
        <header data-testid="custom-appbar">Custom AppBar</header>
      )

      render(
        <TestWrapper>
          <Layout appBar={<CustomAppBar />}>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      expect(screen.getByTestId('custom-appbar')).toBeInTheDocument()
    })

    it('should accept menu prop as a component', () => {
      const CustomMenu = () => (
        <ul data-testid="custom-menu">
          <li>Dashboard</li>
          <li>Users</li>
        </ul>
      )

      render(
        <TestWrapper>
          <Layout menu={CustomMenu}>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      expect(screen.getByTestId('custom-menu')).toBeInTheDocument()
    })

    it('should render default sidebar when no sidebar prop provided', () => {
      render(
        <TestWrapper>
          <Layout>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      // Should have a sidebar container
      expect(screen.getByRole('complementary')).toBeInTheDocument()
    })

    it('should render default appbar when no appBar prop provided', () => {
      render(
        <TestWrapper>
          <Layout>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      // Should have a header/banner
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should accept title prop for sidebar/appbar branding', () => {
      render(
        <TestWrapper>
          <Layout title="My Admin">
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      expect(screen.getByText('My Admin')).toBeInTheDocument()
    })

    it('should accept className prop for custom styling', () => {
      render(
        <TestWrapper>
          <Layout className="custom-layout-class">
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      const layoutContainer = screen.getByTestId('content').closest('[data-layout="root"]')
      expect(layoutContainer).toHaveClass('custom-layout-class')
    })
  })

  describe('ShadCN SidebarProvider Integration', () => {
    it('should wrap content with SidebarProvider', () => {
      render(
        <TestWrapper>
          <Layout>
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      // SidebarProvider should create a container with proper data attributes
      const sidebarWrapper = screen.getByTestId('content').closest('[data-sidebar="wrapper"]')
      expect(sidebarWrapper).toBeInTheDocument()
    })

    it('should render sidebar element with proper structure', () => {
      render(
        <TestWrapper>
          <Layout>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      // Should have a sidebar element
      const sidebar = document.querySelector('[data-sidebar="sidebar"]')
      expect(sidebar).toBeInTheDocument()
    })

    it('should provide sidebar context for toggle functionality', async () => {
      render(
        <TestWrapper>
          <Layout>
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      // Should have a trigger button
      const trigger = screen.getByRole('button', { name: /toggle sidebar/i })
      expect(trigger).toBeInTheDocument()
    })

    it('should support defaultOpen prop for initial sidebar state', () => {
      render(
        <TestWrapper>
          <Layout defaultOpen={false}>
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      // Sidebar should be collapsed by default
      const sidebarWrapper = screen.getByTestId('content').closest('[data-sidebar="wrapper"]')
      expect(sidebarWrapper).toHaveAttribute('data-state', 'collapsed')
    })

    it('should support open prop for controlled sidebar state', () => {
      const onOpenChange = vi.fn()

      render(
        <TestWrapper>
          <Layout open={true} onOpenChange={onOpenChange}>
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      const sidebarWrapper = screen.getByTestId('content').closest('[data-sidebar="wrapper"]')
      expect(sidebarWrapper).toHaveAttribute('data-state', 'expanded')
    })

    it('should call onOpenChange when sidebar state changes', async () => {
      const onOpenChange = vi.fn()
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Layout open={true} onOpenChange={onOpenChange}>
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      const trigger = screen.getByRole('button', { name: /toggle sidebar/i })
      await user.click(trigger)

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Responsive Behavior', () => {
    beforeEach(() => {
      // Reset matchMedia mock for each test
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })
    })

    afterEach(() => {
      // Clean up matchMedia mock to avoid polluting other tests
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: undefined,
      })
    })

    it('should show mobile sidebar trigger on small screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes('max-width'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      render(
        <TestWrapper>
          <Layout>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      // Mobile trigger should be visible
      const mobileTrigger = screen.getByRole('button', { name: /menu/i })
      expect(mobileTrigger).toBeInTheDocument()
    })

    it('should render sidebar as sheet/drawer on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes('max-width'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      render(
        <TestWrapper>
          <Layout>
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      // Should have mobile-specific data attribute
      const layout = screen.getByTestId('content').closest('[data-layout="root"]')
      expect(layout).toHaveAttribute('data-mobile')
    })

    it('should toggle mobile sidebar when trigger clicked', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes('max-width'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Layout>
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      const trigger = screen.getByRole('button', { name: /menu/i })
      await user.click(trigger)

      // Mobile sidebar should be open
      await waitFor(() => {
        const sidebar = document.querySelector('[data-sidebar="sidebar"]')
        expect(sidebar).toHaveAttribute('data-mobile-open', 'true')
      })
    })

    it('should hide desktop sidebar on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes('max-width'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      render(
        <TestWrapper>
          <Layout>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      const sidebar = document.querySelector('[data-sidebar="sidebar"]')
      expect(sidebar).toHaveClass('md:flex')
      expect(sidebar).toHaveClass('hidden')
    })
  })

  describe('Custom Components', () => {
    it('should render custom Sidebar component', () => {
      const CustomSidebar = () => (
        <aside data-testid="my-sidebar">
          <h2>My Sidebar</h2>
          <nav>
            <a href="/home">Home</a>
            <a href="/settings">Settings</a>
          </nav>
        </aside>
      )

      render(
        <TestWrapper>
          <Layout sidebar={<CustomSidebar />}>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      expect(screen.getByTestId('my-sidebar')).toBeInTheDocument()
      expect(screen.getByText('My Sidebar')).toBeInTheDocument()
    })

    it('should render custom AppBar component', () => {
      const CustomAppBar = () => (
        <header data-testid="my-appbar">
          <h1>My Custom Title</h1>
          <button>Profile</button>
        </header>
      )

      render(
        <TestWrapper>
          <Layout appBar={<CustomAppBar />}>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      expect(screen.getByTestId('my-appbar')).toBeInTheDocument()
      expect(screen.getByText('My Custom Title')).toBeInTheDocument()
    })

    it('should render custom Menu component in sidebar', () => {
      const CustomMenu = () => (
        <nav data-testid="my-menu">
          <ul>
            <li>Dashboard</li>
            <li>Posts</li>
            <li>Users</li>
          </ul>
        </nav>
      )

      render(
        <TestWrapper>
          <Layout menu={CustomMenu}>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      expect(screen.getByTestId('my-menu')).toBeInTheDocument()
      expect(screen.getByText('Posts')).toBeInTheDocument()
    })

    it('should pass menu items to Menu component', () => {
      interface MenuItem {
        name: string
        label: string
        icon?: string
      }

      const CustomMenu = ({ items }: { items: MenuItem[] }) => (
        <nav data-testid="my-menu">
          <ul>
            {items.map((item) => (
              <li key={item.name}>{item.label}</li>
            ))}
          </ul>
        </nav>
      )

      const menuItems = [
        { name: 'dashboard', label: 'Dashboard' },
        { name: 'posts', label: 'Posts' },
        { name: 'users', label: 'Users' },
      ]

      render(
        <TestWrapper>
          <Layout menu={CustomMenu} menuItems={menuItems}>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Posts')).toBeInTheDocument()
      expect(screen.getByText('Users')).toBeInTheDocument()
    })
  })

  describe('Theme Switching Support', () => {
    it('should accept theme prop', () => {
      render(
        <TestWrapper>
          <Layout theme="dark">
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      const layout = screen.getByTestId('content').closest('[data-layout="root"]')
      expect(layout).toHaveAttribute('data-theme', 'dark')
    })

    it('should support light theme', () => {
      render(
        <TestWrapper>
          <Layout theme="light">
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      const layout = screen.getByTestId('content').closest('[data-layout="root"]')
      expect(layout).toHaveAttribute('data-theme', 'light')
    })

    it('should support system theme', () => {
      render(
        <TestWrapper>
          <Layout theme="system">
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      const layout = screen.getByTestId('content').closest('[data-layout="root"]')
      expect(layout).toHaveAttribute('data-theme', 'system')
    })

    it('should render theme toggle in appbar when showThemeToggle is true', () => {
      render(
        <TestWrapper>
          <Layout showThemeToggle>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      const themeToggle = screen.getByRole('button', { name: /theme/i })
      expect(themeToggle).toBeInTheDocument()
    })

    it('should call onThemeChange when theme toggle clicked', async () => {
      const onThemeChange = vi.fn()
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Layout theme="light" onThemeChange={onThemeChange} showThemeToggle>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      const themeToggle = screen.getByRole('button', { name: /theme/i })
      await user.click(themeToggle)

      expect(onThemeChange).toHaveBeenCalled()
    })
  })

  describe('Layout Structure', () => {
    it('should have proper semantic structure', () => {
      render(
        <TestWrapper>
          <Layout>
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      // Should have main content area
      expect(screen.getByRole('main')).toBeInTheDocument()

      // Main should contain the children
      const main = screen.getByRole('main')
      expect(main).toContainElement(screen.getByTestId('content'))
    })

    it('should render sidebar before main content', () => {
      render(
        <TestWrapper>
          <Layout>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      const sidebar = screen.getByRole('complementary')
      const main = screen.getByRole('main')

      // Sidebar should come before main in DOM order
      expect(sidebar.compareDocumentPosition(main)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })

    it('should render appbar at the top of main content', () => {
      render(
        <TestWrapper>
          <Layout>
            <div data-testid="content">Content</div>
          </Layout>
        </TestWrapper>
      )

      const header = screen.getByRole('banner')
      const content = screen.getByTestId('content')

      // Header should come before content in DOM order
      expect(header.compareDocumentPosition(content)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })
  })

  describe('Accessibility', () => {
    it('should have accessible sidebar toggle', () => {
      render(
        <TestWrapper>
          <Layout>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      const trigger = screen.getByRole('button', { name: /toggle sidebar/i })
      expect(trigger).toHaveAttribute('aria-label')
    })

    it('should have proper ARIA attributes on sidebar', () => {
      render(
        <TestWrapper>
          <Layout>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Layout>
            <div>Content</div>
          </Layout>
        </TestWrapper>
      )

      const trigger = screen.getByRole('button', { name: /toggle sidebar/i })
      trigger.focus()

      await user.keyboard('{Enter}')

      // Should toggle sidebar
      const sidebarWrapper = document.querySelector('[data-sidebar="wrapper"]')
      expect(sidebarWrapper).toHaveAttribute('data-state')
    })

    describe('Mobile Sidebar Focus Trap (WCAG 2.1 AA)', () => {
      beforeEach(() => {
        // Mock mobile viewport for focus trap tests
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockImplementation((query: string) => ({
            matches: query.includes('max-width'),
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          })),
        })
      })

      afterEach(() => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: undefined,
        })
      })

      it('should trap focus within mobile sidebar when open (Tab cycles within sidebar)', async () => {
        const user = userEvent.setup()

        render(
          <TestWrapper>
            <Layout>
              <div>
                <button data-testid="main-content-button">Main Button</button>
              </div>
            </Layout>
          </TestWrapper>
        )

        // Open mobile sidebar
        const menuTrigger = screen.getByRole('button', { name: /menu/i })
        await user.click(menuTrigger)

        // Wait for sidebar to open
        await waitFor(() => {
          const sidebar = document.querySelector('[data-sidebar="sidebar"]')
          expect(sidebar).toHaveAttribute('data-mobile-open', 'true')
        })

        // Get all focusable elements in sidebar
        const sidebar = document.querySelector('[data-sidebar="sidebar"]')
        const focusableElements = sidebar?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        expect(focusableElements?.length).toBeGreaterThan(0)

        // Focus should be trapped - tabbing from the last element should go to first
        const lastFocusable = focusableElements![focusableElements!.length - 1] as HTMLElement
        lastFocusable.focus()

        await user.tab()

        // Focus should cycle back to first focusable element in sidebar, not escape to main content
        const firstFocusable = focusableElements![0] as HTMLElement
        expect(document.activeElement).toBe(firstFocusable)

        // Verify focus did NOT escape to main content
        expect(screen.getByTestId('main-content-button')).not.toHaveFocus()
      })

      it('should close mobile sidebar when Escape key is pressed', async () => {
        const user = userEvent.setup()

        render(
          <TestWrapper>
            <Layout>
              <div>Content</div>
            </Layout>
          </TestWrapper>
        )

        // Open mobile sidebar
        const menuTrigger = screen.getByRole('button', { name: /menu/i })
        await user.click(menuTrigger)

        // Wait for sidebar to open
        await waitFor(() => {
          const sidebar = document.querySelector('[data-sidebar="sidebar"]')
          expect(sidebar).toHaveAttribute('data-mobile-open', 'true')
        })

        // Press Escape key
        await user.keyboard('{Escape}')

        // Sidebar should be closed
        await waitFor(() => {
          const sidebar = document.querySelector('[data-sidebar="sidebar"]')
          expect(sidebar).not.toHaveAttribute('data-mobile-open', 'true')
        })
      })

      it('should return focus to menu button trigger when sidebar closes', async () => {
        const user = userEvent.setup()

        render(
          <TestWrapper>
            <Layout>
              <div>Content</div>
            </Layout>
          </TestWrapper>
        )

        const menuTrigger = screen.getByRole('button', { name: /menu/i })

        // Open mobile sidebar
        await user.click(menuTrigger)

        // Wait for sidebar to open
        await waitFor(() => {
          const sidebar = document.querySelector('[data-sidebar="sidebar"]')
          expect(sidebar).toHaveAttribute('data-mobile-open', 'true')
        })

        // Close sidebar with Escape
        await user.keyboard('{Escape}')

        // Wait for sidebar to close
        await waitFor(() => {
          const sidebar = document.querySelector('[data-sidebar="sidebar"]')
          expect(sidebar).not.toHaveAttribute('data-mobile-open', 'true')
        })

        // Focus should return to the menu trigger button
        expect(menuTrigger).toHaveFocus()
      })

      it('should move focus to first focusable element when sidebar opens', async () => {
        const user = userEvent.setup()

        render(
          <TestWrapper>
            <Layout>
              <div>Content</div>
            </Layout>
          </TestWrapper>
        )

        // Open mobile sidebar
        const menuTrigger = screen.getByRole('button', { name: /menu/i })
        await user.click(menuTrigger)

        // Wait for sidebar to open
        await waitFor(() => {
          const sidebar = document.querySelector('[data-sidebar="sidebar"]')
          expect(sidebar).toHaveAttribute('data-mobile-open', 'true')
        })

        // Get first focusable element in sidebar
        const sidebar = document.querySelector('[data-sidebar="sidebar"]')
        const focusableElements = sidebar?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        expect(focusableElements?.length).toBeGreaterThan(0)

        // First focusable element should have focus
        const firstFocusable = focusableElements![0] as HTMLElement
        expect(document.activeElement).toBe(firstFocusable)
      })

      it('should wrap focus from first to last element on Shift+Tab (reverse tab)', async () => {
        const user = userEvent.setup()

        render(
          <TestWrapper>
            <Layout>
              <div>
                <button data-testid="main-content-button">Main Button</button>
              </div>
            </Layout>
          </TestWrapper>
        )

        // Open mobile sidebar
        const menuTrigger = screen.getByRole('button', { name: /menu/i })
        await user.click(menuTrigger)

        // Wait for sidebar to open
        await waitFor(() => {
          const sidebar = document.querySelector('[data-sidebar="sidebar"]')
          expect(sidebar).toHaveAttribute('data-mobile-open', 'true')
        })

        // Get all focusable elements in sidebar
        const sidebar = document.querySelector('[data-sidebar="sidebar"]')
        const focusableElements = sidebar?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        expect(focusableElements?.length).toBeGreaterThan(0)

        // Focus the first element
        const firstFocusable = focusableElements![0] as HTMLElement
        firstFocusable.focus()

        // Shift+Tab from first element should wrap to last element
        await user.tab({ shift: true })

        // Focus should wrap to last focusable element in sidebar
        const lastFocusable = focusableElements![focusableElements!.length - 1] as HTMLElement
        expect(document.activeElement).toBe(lastFocusable)

        // Verify focus did NOT escape to main content
        expect(screen.getByTestId('main-content-button')).not.toHaveFocus()
      })
    })
  })
})

describe('AppBar Component', () => {
  it('should render with default content', () => {
    render(
      <TestWrapper>
        <AppBar />
      </TestWrapper>
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should render title when provided', () => {
    render(
      <TestWrapper>
        <AppBar title="My Admin" />
      </TestWrapper>
    )

    expect(screen.getByText('My Admin')).toBeInTheDocument()
  })

  it('should render children as actions', () => {
    render(
      <TestWrapper>
        <AppBar>
          <button data-testid="action">Action</button>
        </AppBar>
      </TestWrapper>
    )

    expect(screen.getByTestId('action')).toBeInTheDocument()
  })

  it('should render user menu when user prop provided', () => {
    const user = { name: 'John Doe', avatar: '/avatar.png' }

    render(
      <TestWrapper>
        <AppBar user={user} />
      </TestWrapper>
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should accept className prop', () => {
    render(
      <TestWrapper>
        <AppBar className="custom-appbar" />
      </TestWrapper>
    )

    expect(screen.getByRole('banner')).toHaveClass('custom-appbar')
  })

  it('should render sidebar trigger', () => {
    render(
      <TestWrapper>
        <AppBar showSidebarTrigger />
      </TestWrapper>
    )

    const trigger = screen.getByRole('button', { name: /toggle sidebar/i })
    expect(trigger).toBeInTheDocument()
  })

  it('should accept leftContent and rightContent props', () => {
    render(
      <TestWrapper>
        <AppBar
          leftContent={<span data-testid="left">Left</span>}
          rightContent={<span data-testid="right">Right</span>}
        />
      </TestWrapper>
    )

    expect(screen.getByTestId('left')).toBeInTheDocument()
    expect(screen.getByTestId('right')).toBeInTheDocument()
  })
})

describe('ContainerLayout Component', () => {
  it('should render children in main content area', () => {
    render(
      <TestWrapper>
        <ContainerLayout>
          <div data-testid="content">Content</div>
        </ContainerLayout>
      </TestWrapper>
    )

    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('should render horizontal navigation', () => {
    render(
      <TestWrapper>
        <ContainerLayout>
          <div>Content</div>
        </ContainerLayout>
      </TestWrapper>
    )

    // Should have a navigation element
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('should accept menu items', () => {
    const menuItems = [
      { name: 'dashboard', label: 'Dashboard', path: '/' },
      { name: 'posts', label: 'Posts', path: '/posts' },
    ]

    render(
      <TestWrapper>
        <ContainerLayout menuItems={menuItems}>
          <div>Content</div>
        </ContainerLayout>
      </TestWrapper>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })

  it('should render logo/title', () => {
    render(
      <TestWrapper>
        <ContainerLayout title="My App">
          <div>Content</div>
        </ContainerLayout>
      </TestWrapper>
    )

    expect(screen.getByText('My App')).toBeInTheDocument()
  })

  it('should render user menu', () => {
    const user = { name: 'Jane Doe' }

    render(
      <TestWrapper>
        <ContainerLayout user={user}>
          <div>Content</div>
        </ContainerLayout>
      </TestWrapper>
    )

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('should use container-based layout (no sidebar)', () => {
    render(
      <TestWrapper>
        <ContainerLayout>
          <div data-testid="content">Content</div>
        </ContainerLayout>
      </TestWrapper>
    )

    // Should not have a sidebar
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })

  it('should have sticky header', () => {
    render(
      <TestWrapper>
        <ContainerLayout>
          <div>Content</div>
        </ContainerLayout>
      </TestWrapper>
    )

    const header = screen.getByRole('banner')
    expect(header).toHaveClass('sticky')
  })

  it('should accept className prop', () => {
    render(
      <TestWrapper>
        <ContainerLayout className="custom-container">
          <div data-testid="content">Content</div>
        </ContainerLayout>
      </TestWrapper>
    )

    const layout = screen.getByTestId('content').closest('[data-layout="container"]')
    expect(layout).toHaveClass('custom-container')
  })

  it('should render mobile hamburger menu', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('max-width'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    render(
      <TestWrapper>
        <ContainerLayout>
          <div>Content</div>
        </ContainerLayout>
      </TestWrapper>
    )

    const menuButton = screen.getByRole('button', { name: /menu/i })
    expect(menuButton).toBeInTheDocument()
  })
})
