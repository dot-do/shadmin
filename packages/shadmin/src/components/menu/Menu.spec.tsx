/**
 * Menu Component Tests
 * TDD: RED phase - Write failing tests first
 *
 * Tests cover:
 * - Menu component with MenuItems
 * - MenuItem with icon, label, link
 * - SubMenu for nested navigation
 * - Active state based on current route
 * - Keyboard navigation
 * - Badges on menu items
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode, ComponentType } from 'react'
import { Menu } from './Menu'
import { MenuItem } from './MenuItem'
import { SubMenu } from './SubMenu'
import { MenuItemLink } from './MenuItemLink'
import { DashboardMenuItem } from './DashboardMenuItem'
import { TestMemoryRouter, useTestLocation } from '../../test-utils'

// Mock icons for testing
const HomeIcon = () => <svg data-testid="home-icon" />
const UsersIcon = () => <svg data-testid="users-icon" />
const SettingsIcon = () => <svg data-testid="settings-icon" />
const PostsIcon = () => <svg data-testid="posts-icon" />
const ChevronIcon = () => <svg data-testid="chevron-icon" />

// Test wrapper with router
function Wrapper({ children, initialEntries = ['/'] }: { children: ReactNode; initialEntries?: string[] }) {
  return (
    <TestMemoryRouter initialEntries={initialEntries}>
      {children}
    </TestMemoryRouter>
  )
}

describe('Menu Component', () => {
  describe('Basic Rendering', () => {
    it('should render a navigation element', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('should render children menu items', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('Posts')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(
        <Wrapper>
          <Menu className="custom-menu">
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByRole('navigation')).toHaveClass('custom-menu')
    })

    it('should render with data-testid attribute', () => {
      render(
        <Wrapper>
          <Menu data-testid="main-menu">
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByTestId('main-menu')).toBeInTheDocument()
    })
  })

  describe('Menu Structure', () => {
    it('should render menu items as a list', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
          </Menu>
        </Wrapper>
      )

      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()

      const items = screen.getAllByRole('listitem')
      expect(items).toHaveLength(2)
    })

    it('should support dense mode', () => {
      render(
        <Wrapper>
          <Menu dense>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('data-dense', 'true')
    })
  })
})

describe('MenuItem Component', () => {
  describe('Basic Rendering', () => {
    it('should render with label', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByText('Users')).toBeInTheDocument()
    })

    it('should render as a link', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/users')
    })

    it('should render with icon', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" icon={<UsersIcon />} />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByTestId('users-icon')).toBeInTheDocument()
    })

    it('should render with icon component', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" icon={UsersIcon} />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByTestId('users-icon')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" className="custom-item" />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      expect(link).toHaveClass('custom-item')
    })
  })

  describe('Active State', () => {
    it('should be active when current route matches', () => {
      render(
        <Wrapper initialEntries={['/users']}>
          <Menu>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      expect(link).toHaveAttribute('data-active', 'true')
    })

    it('should not be active when current route does not match', () => {
      render(
        <Wrapper initialEntries={['/posts']}>
          <Menu>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      expect(link).not.toHaveAttribute('data-active', 'true')
    })

    it('should be active when current route starts with link path', () => {
      render(
        <Wrapper initialEntries={['/users/1/edit']}>
          <Menu>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      expect(link).toHaveAttribute('data-active', 'true')
    })

    it('should support exact match mode', () => {
      render(
        <Wrapper initialEntries={['/users/1']}>
          <Menu>
            <MenuItem to="/users" label="Users" exact />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      expect(link).not.toHaveAttribute('data-active', 'true')
    })

    it('should apply active className when active', () => {
      render(
        <Wrapper initialEntries={['/users']}>
          <Menu>
            <MenuItem to="/users" label="Users" activeClassName="is-active" />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      expect(link).toHaveClass('is-active')
    })
  })

  describe('Badges', () => {
    it('should render badge when provided', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" badge={5} />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render string badge', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" badge="New" />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('should render custom badge component', () => {
      const CustomBadge = () => <span data-testid="custom-badge">Custom</span>

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" badge={<CustomBadge />} />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByTestId('custom-badge')).toBeInTheDocument()
    })

    it('should apply badge variant', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" badge={5} badgeVariant="destructive" />
          </Menu>
        </Wrapper>
      )

      const badge = screen.getByText('5')
      expect(badge).toHaveAttribute('data-variant', 'destructive')
    })
  })

  describe('Disabled State', () => {
    it('should support disabled state', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" disabled />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      expect(link).toHaveAttribute('aria-disabled', 'true')
    })

    it('should not navigate when disabled', async () => {
      const user = userEvent.setup()
      let currentLocation = '/'

      const LocationTracker = () => {
        const location = useTestLocation()
        currentLocation = location.pathname
        return null
      }

      render(
        <Wrapper initialEntries={['/']}>
          <LocationTracker />
          <Menu>
            <MenuItem to="/users" label="Users" disabled />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      await user.click(link)

      expect(currentLocation).toBe('/')
    })
  })

  describe('Tooltip', () => {
    it('should show tooltip when collapsed', async () => {
      render(
        <Wrapper>
          <Menu collapsed>
            <MenuItem to="/users" label="Users" icon={<UsersIcon />} />
          </Menu>
        </Wrapper>
      )

      // Label should be hidden but tooltip should work
      const menuItem = screen.getByRole('listitem')
      expect(menuItem).toHaveAttribute('data-collapsed', 'true')
    })
  })
})

describe('SubMenu Component', () => {
  describe('Basic Rendering', () => {
    it('should render with label', () => {
      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
              <MenuItem to="/settings/security" label="Security" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('should render with icon', () => {
      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
    })

    it('should render children menu items when open', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
              <MenuItem to="/settings/security" label="Security" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      await user.click(toggleButton)

      expect(screen.getByText('General')).toBeInTheDocument()
      expect(screen.getByText('Security')).toBeInTheDocument()
    })

    it('should hide children when closed', () => {
      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      // SubMenu is closed by default, children should not be visible
      expect(screen.queryByText('General')).not.toBeInTheDocument()
    })
  })

  describe('Toggle Behavior', () => {
    it('should toggle open/closed on click', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })

      // Open
      await user.click(toggleButton)
      expect(screen.getByText('General')).toBeInTheDocument()

      // Close
      await user.click(toggleButton)
      await waitFor(() => {
        expect(screen.queryByText('General')).not.toBeInTheDocument()
      })
    })

    it('should support defaultOpen prop', () => {
      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />} defaultOpen>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      expect(screen.getByText('General')).toBeInTheDocument()
    })

    it('should support controlled open state', () => {
      const handleOpenChange = vi.fn()

      render(
        <Wrapper>
          <Menu>
            <SubMenu
              label="Settings"
              icon={<SettingsIcon />}
              open={true}
              onOpenChange={handleOpenChange}
            >
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      expect(screen.getByText('General')).toBeInTheDocument()
    })

    it('should call onOpenChange when toggled', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()

      render(
        <Wrapper>
          <Menu>
            <SubMenu
              label="Settings"
              icon={<SettingsIcon />}
              onOpenChange={handleOpenChange}
            >
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      await user.click(toggleButton)

      expect(handleOpenChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Active State', () => {
    it('should auto-expand when child route is active', () => {
      render(
        <Wrapper initialEntries={['/settings/general']}>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
              <MenuItem to="/settings/security" label="Security" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      // SubMenu should be open because child is active
      expect(screen.getByText('General')).toBeInTheDocument()
    })

    it('should indicate when any child is active', () => {
      render(
        <Wrapper initialEntries={['/settings/general']}>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      expect(toggleButton).toHaveAttribute('data-child-active', 'true')
    })
  })

  describe('Expand/Collapse Icon', () => {
    it('should show expand icon when closed', () => {
      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      expect(toggleButton).toHaveAttribute('data-state', 'closed')
    })

    it('should show collapse icon when open', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      await user.click(toggleButton)

      expect(toggleButton).toHaveAttribute('data-state', 'open')
    })
  })

  describe('Nested SubMenus', () => {
    it('should support nested submenus', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <SubMenu label="Advanced" icon={<SettingsIcon />}>
                <MenuItem to="/settings/advanced/debug" label="Debug" />
              </SubMenu>
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      // Open first level
      const settingsToggle = screen.getByRole('button', { name: /settings/i })
      await user.click(settingsToggle)

      // Open second level
      const advancedToggle = screen.getByRole('button', { name: /advanced/i })
      await user.click(advancedToggle)

      expect(screen.getByText('Debug')).toBeInTheDocument()
    })
  })
})

describe('MenuItemLink Component', () => {
  describe('Basic Rendering', () => {
    it('should render as a link', () => {
      render(
        <Wrapper>
          <MenuItemLink to="/users" primaryText="Users" />
        </Wrapper>
      )

      expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument()
    })

    it('should render with leftIcon', () => {
      render(
        <Wrapper>
          <MenuItemLink to="/users" primaryText="Users" leftIcon={<UsersIcon />} />
        </Wrapper>
      )

      expect(screen.getByTestId('users-icon')).toBeInTheDocument()
    })

    it('should render with rightIcon', () => {
      render(
        <Wrapper>
          <MenuItemLink
            to="/users"
            primaryText="Users"
            rightIcon={<ChevronIcon />}
          />
        </Wrapper>
      )

      expect(screen.getByTestId('chevron-icon')).toBeInTheDocument()
    })

    it('should handle onClick', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(
        <Wrapper>
          <MenuItemLink to="/users" primaryText="Users" onClick={handleClick} />
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      await user.click(link)

      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('Active State', () => {
    it('should apply active styles when route matches', () => {
      render(
        <Wrapper initialEntries={['/users']}>
          <MenuItemLink to="/users" primaryText="Users" />
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      expect(link).toHaveAttribute('data-active', 'true')
    })
  })

  describe('Tooltip', () => {
    it('should show tooltip with sidebarOpen false', () => {
      render(
        <Wrapper>
          <MenuItemLink
            to="/users"
            primaryText="Users"
            leftIcon={<UsersIcon />}
            sidebarOpen={false}
          />
        </Wrapper>
      )

      // When sidebar is collapsed, text should be hidden but accessible via tooltip
      expect(screen.getByRole('link')).toHaveAttribute('data-sidebar-open', 'false')
    })
  })
})

describe('DashboardMenuItem Component', () => {
  describe('Basic Rendering', () => {
    it('should render dashboard link', () => {
      render(
        <Wrapper>
          <Menu>
            <DashboardMenuItem />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    })

    it('should link to root by default', () => {
      render(
        <Wrapper>
          <Menu>
            <DashboardMenuItem />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /dashboard/i })
      expect(link).toHaveAttribute('href', '/')
    })

    it('should support custom path', () => {
      render(
        <Wrapper>
          <Menu>
            <DashboardMenuItem to="/home" />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /dashboard/i })
      expect(link).toHaveAttribute('href', '/home')
    })

    it('should support custom label', () => {
      render(
        <Wrapper>
          <Menu>
            <DashboardMenuItem label="Home" />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    })

    it('should render with icon', () => {
      render(
        <Wrapper>
          <Menu>
            <DashboardMenuItem icon={<HomeIcon />} />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByTestId('home-icon')).toBeInTheDocument()
    })

    it('should be active when at root', () => {
      render(
        <Wrapper initialEntries={['/']}>
          <Menu>
            <DashboardMenuItem />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /dashboard/i })
      expect(link).toHaveAttribute('data-active', 'true')
    })
  })
})

describe('Keyboard Navigation', () => {
  describe('Arrow Key Navigation', () => {
    it('should move focus down with ArrowDown', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
            <MenuItem to="/comments" label="Comments" />
          </Menu>
        </Wrapper>
      )

      const firstLink = screen.getByRole('link', { name: /users/i })
      firstLink.focus()

      await user.keyboard('{ArrowDown}')

      expect(screen.getByRole('link', { name: /posts/i })).toHaveFocus()
    })

    it('should move focus up with ArrowUp', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
            <MenuItem to="/comments" label="Comments" />
          </Menu>
        </Wrapper>
      )

      const secondLink = screen.getByRole('link', { name: /posts/i })
      secondLink.focus()

      await user.keyboard('{ArrowUp}')

      expect(screen.getByRole('link', { name: /users/i })).toHaveFocus()
    })

    it('should wrap to first item when pressing ArrowDown on last item', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
          </Menu>
        </Wrapper>
      )

      const lastLink = screen.getByRole('link', { name: /posts/i })
      lastLink.focus()

      await user.keyboard('{ArrowDown}')

      expect(screen.getByRole('link', { name: /users/i })).toHaveFocus()
    })

    it('should wrap to last item when pressing ArrowUp on first item', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
          </Menu>
        </Wrapper>
      )

      const firstLink = screen.getByRole('link', { name: /users/i })
      firstLink.focus()

      await user.keyboard('{ArrowUp}')

      expect(screen.getByRole('link', { name: /posts/i })).toHaveFocus()
    })
  })

  describe('Home and End Keys', () => {
    it('should focus first item with Home key', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
            <MenuItem to="/comments" label="Comments" />
          </Menu>
        </Wrapper>
      )

      const lastLink = screen.getByRole('link', { name: /comments/i })
      lastLink.focus()

      await user.keyboard('{Home}')

      expect(screen.getByRole('link', { name: /users/i })).toHaveFocus()
    })

    it('should focus last item with End key', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
            <MenuItem to="/comments" label="Comments" />
          </Menu>
        </Wrapper>
      )

      const firstLink = screen.getByRole('link', { name: /users/i })
      firstLink.focus()

      await user.keyboard('{End}')

      expect(screen.getByRole('link', { name: /comments/i })).toHaveFocus()
    })
  })

  describe('Enter and Space Keys', () => {
    it('should activate link with Enter key', async () => {
      const user = userEvent.setup()
      let currentLocation = '/'

      const LocationTracker = () => {
        const location = useTestLocation()
        currentLocation = location.pathname
        return null
      }

      render(
        <Wrapper initialEntries={['/']}>
          <LocationTracker />
          <Menu>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      link.focus()

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(currentLocation).toBe('/users')
      })
    })

    it('should toggle SubMenu with Enter key', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      toggleButton.focus()

      await user.keyboard('{Enter}')

      expect(screen.getByText('General')).toBeInTheDocument()
    })

    it('should toggle SubMenu with Space key', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      toggleButton.focus()

      await user.keyboard(' ')

      expect(screen.getByText('General')).toBeInTheDocument()
    })
  })

  describe('SubMenu Arrow Key Navigation', () => {
    it('should expand SubMenu with ArrowRight', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      toggleButton.focus()

      await user.keyboard('{ArrowRight}')

      expect(screen.getByText('General')).toBeInTheDocument()
    })

    it('should collapse SubMenu with ArrowLeft', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />} defaultOpen>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      toggleButton.focus()

      await user.keyboard('{ArrowLeft}')

      await waitFor(() => {
        expect(screen.queryByText('General')).not.toBeInTheDocument()
      })
    })

    it('should focus first child with ArrowDown when SubMenu is open', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />} defaultOpen>
              <MenuItem to="/settings/general" label="General" />
              <MenuItem to="/settings/security" label="Security" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      toggleButton.focus()

      await user.keyboard('{ArrowDown}')

      expect(screen.getByRole('link', { name: /general/i })).toHaveFocus()
    })
  })

  describe('Focus Management', () => {
    it('should skip disabled items when navigating', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" disabled />
            <MenuItem to="/comments" label="Comments" />
          </Menu>
        </Wrapper>
      )

      const firstLink = screen.getByRole('link', { name: /users/i })
      firstLink.focus()

      await user.keyboard('{ArrowDown}')

      expect(screen.getByRole('link', { name: /comments/i })).toHaveFocus()
    })
  })
})

describe('Accessibility', () => {
  describe('ARIA Attributes', () => {
    it('should have proper aria-label on navigation', () => {
      render(
        <Wrapper>
          <Menu aria-label="Main navigation">
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation')
    })

    it('should have aria-current on active link', () => {
      render(
        <Wrapper initialEntries={['/users']}>
          <Menu>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      const link = screen.getByRole('link', { name: /users/i })
      expect(link).toHaveAttribute('aria-current', 'page')
    })

    it('should have aria-expanded on SubMenu toggle', () => {
      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('should update aria-expanded when SubMenu opens', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      await user.click(toggleButton)

      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should have aria-controls linking to SubMenu content', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      const controlsId = toggleButton.getAttribute('aria-controls')

      await user.click(toggleButton)

      expect(controlsId).toBeTruthy()
      const submenuContent = document.getElementById(controlsId!)
      expect(submenuContent).toBeInTheDocument()
    })
  })

  describe('Screen Reader Support', () => {
    it('should have visually hidden text for icon-only mode', () => {
      render(
        <Wrapper>
          <Menu collapsed>
            <MenuItem to="/users" label="Users" icon={<UsersIcon />} />
          </Menu>
        </Wrapper>
      )

      // Label should be available for screen readers even when visually hidden
      expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument()
    })

    it('should announce badge content', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" badge={5} />
          </Menu>
        </Wrapper>
      )

      const badge = screen.getByText('5')
      expect(badge).toHaveAttribute('aria-label')
    })
  })
})

describe('Collapsed Mode', () => {
  it('should render in collapsed mode', () => {
    render(
      <Wrapper>
        <Menu collapsed>
          <MenuItem to="/users" label="Users" icon={<UsersIcon />} />
        </Menu>
      </Wrapper>
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('data-collapsed', 'true')
  })

  it('should hide labels in collapsed mode', () => {
    render(
      <Wrapper>
        <Menu collapsed>
          <MenuItem to="/users" label="Users" icon={<UsersIcon />} />
        </Menu>
      </Wrapper>
    )

    // Text should be visually hidden (using sr-only or similar)
    const labelElement = screen.getByText('Users')
    expect(labelElement).toHaveClass('sr-only')
  })

  it('should show tooltip with label in collapsed mode', async () => {
    const user = userEvent.setup()

    render(
      <Wrapper>
        <Menu collapsed>
          <MenuItem to="/users" label="Users" icon={<UsersIcon />} />
        </Menu>
      </Wrapper>
    )

    const link = screen.getByRole('link', { name: /users/i })
    await user.hover(link)

    // Tooltip content should be visible
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Users')
    })
  })

  it('should show SubMenu as popup in collapsed mode', async () => {
    const user = userEvent.setup()

    render(
      <Wrapper>
        <Menu collapsed>
          <SubMenu label="Settings" icon={<SettingsIcon />}>
            <MenuItem to="/settings/general" label="General" />
          </SubMenu>
        </Menu>
      </Wrapper>
    )

    const toggleButton = screen.getByRole('button', { name: /settings/i })
    await user.click(toggleButton)

    // SubMenu should appear as a popup/flyout
    const popup = screen.getByRole('menu')
    expect(popup).toBeInTheDocument()
  })
})

describe('Custom Rendering', () => {
  it('should support custom renderItem prop', () => {
    const CustomItem = ({ label }: { label: string }) => (
      <div data-testid="custom-item">{label}</div>
    )

    render(
      <Wrapper>
        <Menu>
          <MenuItem
            to="/users"
            label="Users"
            renderItem={({ label }) => <CustomItem label={label} />}
          />
        </Menu>
      </Wrapper>
    )

    expect(screen.getByTestId('custom-item')).toBeInTheDocument()
  })

  it('should support custom menu component', () => {
    const CustomMenu = ({ children }: { children: ReactNode }) => (
      <nav data-testid="custom-menu">{children}</nav>
    )

    render(
      <Wrapper>
        <Menu component={CustomMenu}>
          <MenuItem to="/users" label="Users" />
        </Menu>
      </Wrapper>
    )

    expect(screen.getByTestId('custom-menu')).toBeInTheDocument()
  })
})
