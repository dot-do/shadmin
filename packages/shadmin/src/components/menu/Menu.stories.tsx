import type { Meta, StoryObj } from '@storybook/react'
import { Menu } from './Menu'
import { MenuItem } from './MenuItem'
import { SubMenu } from './SubMenu'
import { DashboardMenuItem } from './DashboardMenuItem'
import { TestMemoryRouter } from '../../test-utils/TestMemoryRouter'

// ============================================================================
// Icon Components
// ============================================================================

const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const FolderIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
)

const ChartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
)

const InboxIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
)

const BellIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
)

// ============================================================================
// Story Wrapper
// ============================================================================

function StoryWrapper({
  children,
  initialPath = '/',
  width = 'w-72',
}: {
  children: React.ReactNode
  initialPath?: string
  width?: string
}) {
  return (
    <TestMemoryRouter initialEntries={[initialPath]}>
      <div className={`${width} min-h-[400px] border rounded-lg bg-sidebar text-sidebar-foreground p-2`}>
        {children}
      </div>
    </TestMemoryRouter>
  )
}

// ============================================================================
// Meta
// ============================================================================

/**
 * Menu provides navigation container with MenuItem and SubMenu support.
 *
 * Features:
 * - Navigation container with proper ARIA attributes
 * - Dense mode for compact display
 * - Collapsed mode for icon-only display
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Nested SubMenu support
 */
const meta = {
  title: 'Components/Menu/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Navigation menu container for sidebar navigation. Supports MenuItem, SubMenu, and DashboardMenuItem components. Includes keyboard navigation and dense/collapsed modes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    dense: {
      control: 'boolean',
      description: 'Compact display mode with reduced padding',
      table: { defaultValue: { summary: 'false' } },
    },
    collapsed: {
      control: 'boolean',
      description: 'Icon-only display mode (for collapsed sidebar)',
      table: { defaultValue: { summary: 'false' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the navigation',
    },
  },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Stories
// ============================================================================

/**
 * Default menu with navigation items and icons.
 */
export const Default: Story = {
  args: { children: null },
  render: () => (
    <StoryWrapper>
      <Menu aria-label="Main navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon className="h-5 w-5" />} />
        <MenuItem to="/users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
        <MenuItem to="/projects" label="Projects" icon={<FolderIcon className="h-5 w-5" />} />
        <MenuItem to="/analytics" label="Analytics" icon={<ChartIcon className="h-5 w-5" />} />
        <MenuItem to="/settings" label="Settings" icon={<SettingsIcon className="h-5 w-5" />} />
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Menu with active item based on current route.
 */
export const WithActiveItem: Story = {
  args: { children: null },
  render: () => (
    <StoryWrapper initialPath="/users">
      <Menu aria-label="Main navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon className="h-5 w-5" />} exact />
        <MenuItem to="/users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
        <MenuItem to="/projects" label="Projects" icon={<FolderIcon className="h-5 w-5" />} />
        <MenuItem to="/settings" label="Settings" icon={<SettingsIcon className="h-5 w-5" />} />
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Menu items with badges showing counts or status.
 */
export const WithBadges: Story = {
  args: { children: null },
  render: () => (
    <StoryWrapper>
      <Menu aria-label="Main navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon className="h-5 w-5" />} />
        <MenuItem
          to="/inbox"
          label="Inbox"
          icon={<InboxIcon className="h-5 w-5" />}
          badge={12}
          badgeVariant="default"
        />
        <MenuItem
          to="/notifications"
          label="Notifications"
          icon={<BellIcon className="h-5 w-5" />}
          badge={3}
          badgeVariant="destructive"
        />
        <MenuItem
          to="/projects"
          label="Projects"
          icon={<FolderIcon className="h-5 w-5" />}
          badge="New"
          badgeVariant="secondary"
        />
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Menu with SubMenu for nested navigation.
 */
export const WithSubMenu: Story = {
  args: { children: null },
  render: () => (
    <StoryWrapper>
      <Menu aria-label="Main navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon className="h-5 w-5" />} />
        <MenuItem to="/users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
        <SubMenu label="Settings" icon={<SettingsIcon className="h-5 w-5" />}>
          <MenuItem to="/settings/general" label="General" />
          <MenuItem to="/settings/security" label="Security" />
          <MenuItem to="/settings/notifications" label="Notifications" />
        </SubMenu>
        <SubMenu label="Analytics" icon={<ChartIcon className="h-5 w-5" />}>
          <MenuItem to="/analytics/overview" label="Overview" />
          <MenuItem to="/analytics/reports" label="Reports" />
          <MenuItem to="/analytics/exports" label="Exports" />
        </SubMenu>
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * SubMenu auto-expands when a child route is active.
 */
export const SubMenuAutoExpand: Story = {
  render: () => (
    <StoryWrapper initialPath="/settings/security">
      <Menu aria-label="Main navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon className="h-5 w-5" />} exact />
        <MenuItem to="/users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
        <SubMenu label="Settings" icon={<SettingsIcon className="h-5 w-5" />}>
          <MenuItem to="/settings/general" label="General" />
          <MenuItem to="/settings/security" label="Security" />
          <MenuItem to="/settings/notifications" label="Notifications" />
        </SubMenu>
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Dense mode with reduced padding for compact display.
 */
export const Dense: Story = {
  args: {
    dense: true,
  },
  render: (args) => (
    <StoryWrapper>
      <Menu {...args} aria-label="Main navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon className="h-4 w-4" />} />
        <MenuItem to="/users" label="Users" icon={<UsersIcon className="h-4 w-4" />} />
        <MenuItem to="/projects" label="Projects" icon={<FolderIcon className="h-4 w-4" />} />
        <MenuItem to="/analytics" label="Analytics" icon={<ChartIcon className="h-4 w-4" />} />
        <MenuItem to="/settings" label="Settings" icon={<SettingsIcon className="h-4 w-4" />} />
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Collapsed mode showing only icons with tooltips on hover.
 */
export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
  render: (args) => (
    <StoryWrapper width="w-16">
      <Menu {...args} aria-label="Main navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon className="h-5 w-5" />} />
        <MenuItem to="/users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
        <MenuItem to="/projects" label="Projects" icon={<FolderIcon className="h-5 w-5" />} />
        <MenuItem to="/settings" label="Settings" icon={<SettingsIcon className="h-5 w-5" />} />
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Collapsed mode with SubMenu showing popup on hover.
 */
export const CollapsedWithSubMenu: Story = {
  args: {
    collapsed: true,
  },
  render: (args) => (
    <StoryWrapper width="w-16">
      <Menu {...args} aria-label="Main navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon className="h-5 w-5" />} />
        <MenuItem to="/users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
        <SubMenu label="Settings" icon={<SettingsIcon className="h-5 w-5" />}>
          <MenuItem to="/settings/general" label="General" />
          <MenuItem to="/settings/security" label="Security" />
          <MenuItem to="/settings/notifications" label="Notifications" />
        </SubMenu>
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Menu with DashboardMenuItem for quick dashboard access.
 */
export const WithDashboardMenuItem: Story = {
  render: () => (
    <StoryWrapper>
      <Menu aria-label="Main navigation">
        <DashboardMenuItem />
        <MenuItem to="/users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
        <MenuItem to="/projects" label="Projects" icon={<FolderIcon className="h-5 w-5" />} />
        <MenuItem to="/settings" label="Settings" icon={<SettingsIcon className="h-5 w-5" />} />
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Menu items with keyboard shortcuts displayed.
 */
export const WithKeyboardShortcuts: Story = {
  render: () => (
    <StoryWrapper>
      <Menu aria-label="Main navigation">
        <MenuItem
          to="/"
          label="Dashboard"
          icon={<HomeIcon className="h-5 w-5" />}
          keyboardShortcut="Ctrl+D"
        />
        <MenuItem
          to="/users"
          label="Users"
          icon={<UsersIcon className="h-5 w-5" />}
          keyboardShortcut="Ctrl+U"
        />
        <MenuItem
          to="/projects"
          label="Projects"
          icon={<FolderIcon className="h-5 w-5" />}
          keyboardShortcut="Ctrl+P"
        />
        <MenuItem
          to="/settings"
          label="Settings"
          icon={<SettingsIcon className="h-5 w-5" />}
          keyboardShortcut="Ctrl+,"
        />
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Disabled menu items.
 */
export const WithDisabledItems: Story = {
  render: () => (
    <StoryWrapper>
      <Menu aria-label="Main navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon className="h-5 w-5" />} />
        <MenuItem to="/users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
        <MenuItem
          to="/premium"
          label="Premium Features"
          icon={<ShieldIcon className="h-5 w-5" />}
          disabled
        />
        <MenuItem
          to="/settings"
          label="Settings"
          icon={<SettingsIcon className="h-5 w-5" />}
          disabled
        />
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Complete menu with all features demonstrated.
 */
export const Complete: Story = {
  render: () => (
    <StoryWrapper initialPath="/users">
      <Menu aria-label="Main navigation">
        <DashboardMenuItem />
        <MenuItem
          to="/users"
          label="Users"
          icon={<UsersIcon className="h-5 w-5" />}
          badge={42}
        />
        <MenuItem
          to="/inbox"
          label="Inbox"
          icon={<InboxIcon className="h-5 w-5" />}
          badge={3}
          badgeVariant="destructive"
        />
        <MenuItem to="/projects" label="Projects" icon={<FolderIcon className="h-5 w-5" />} />
        <SubMenu label="Analytics" icon={<ChartIcon className="h-5 w-5" />}>
          <MenuItem to="/analytics/overview" label="Overview" />
          <MenuItem to="/analytics/reports" label="Reports" badge="New" badgeVariant="secondary" />
          <MenuItem to="/analytics/exports" label="Exports" />
        </SubMenu>
        <SubMenu label="Settings" icon={<SettingsIcon className="h-5 w-5" />}>
          <MenuItem to="/settings/general" label="General" keyboardShortcut="Ctrl+," />
          <MenuItem to="/settings/security" label="Security" />
          <MenuItem to="/settings/notifications" label="Notifications" />
          <MenuItem to="/settings/billing" label="Billing" disabled />
        </SubMenu>
      </Menu>
    </StoryWrapper>
  ),
}

/**
 * Menu items without icons (text only).
 */
export const TextOnly: Story = {
  render: () => (
    <StoryWrapper>
      <Menu aria-label="Main navigation">
        <MenuItem to="/" label="Dashboard" />
        <MenuItem to="/users" label="Users" />
        <MenuItem to="/projects" label="Projects" />
        <MenuItem to="/settings" label="Settings" />
      </Menu>
    </StoryWrapper>
  ),
}
