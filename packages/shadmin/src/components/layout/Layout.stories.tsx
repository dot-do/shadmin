import { useState } from 'react'

import { AppBar } from './AppBar'
import { Layout, SidebarProvider, type MenuItem } from './Layout'
import { Sidebar } from './Sidebar'
import { TestMemoryRouter } from '../../test-utils/TestMemoryRouter'
import { Menu } from '../menu/Menu'
import { MenuItem as MenuItemComponent } from '../menu/MenuItem'

import type { Meta, StoryObj } from '@storybook/react'

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

/**
 * Wrapper component that provides router context for stories
 */
function StoryWrapper({
  children,
  initialPath = '/',
}: {
  children: React.ReactNode
  initialPath?: string
}) {
  return (
    <TestMemoryRouter initialEntries={[initialPath]}>
      <div className="h-screen w-full">{children}</div>
    </TestMemoryRouter>
  )
}

// ============================================================================
// Sample Menu Items
// ============================================================================

const defaultMenuItems: MenuItem[] = [
  { name: 'dashboard', label: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'users', label: 'Users', path: '/users', icon: UsersIcon },
  { name: 'projects', label: 'Projects', path: '/projects', icon: FolderIcon },
  { name: 'analytics', label: 'Analytics', path: '/analytics', icon: ChartIcon },
  { name: 'settings', label: 'Settings', path: '/settings', icon: SettingsIcon },
]

const extendedMenuItems: MenuItem[] = [
  { name: 'dashboard', label: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'users', label: 'Users', path: '/users', icon: UsersIcon },
  { name: 'projects', label: 'Projects', path: '/projects', icon: FolderIcon },
  { name: 'analytics', label: 'Analytics', path: '/analytics', icon: ChartIcon },
  { name: 'notifications', label: 'Notifications', path: '/notifications', icon: BellIcon },
  { name: 'settings', label: 'Settings', path: '/settings', icon: SettingsIcon },
]

// ============================================================================
// Custom Menu Component
// ============================================================================

function CustomMenu({ items }: { items?: MenuItem[] }) {
  return (
    <Menu aria-label="Main navigation" className="px-2">
      {items?.map((item) => (
        <MenuItemComponent
          key={item.name}
          to={item.path || `/${item.name}`}
          label={item.label}
          icon={item.icon ? <item.icon className="h-5 w-5" /> : undefined}
        />
      ))}
    </Menu>
  )
}

// ============================================================================
// Sample Content
// ============================================================================

function SampleContent({ title = 'Dashboard' }: { title?: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          Welcome to the admin panel. This is a sample content area.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {['Total Users', 'Revenue', 'Active Projects', 'Pending Tasks'].map((card, i) => (
          <div key={card} className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">{card}</h3>
            <p className="mt-2 text-2xl font-bold">{(i + 1) * 1234}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Activity item {i} happened recently</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Meta
// ============================================================================

/**
 * Layout component for building admin panel structures with sidebar and appbar.
 * Features ShadCN-style Sidebar, responsive behavior, and theme switching support.
 */
const meta = {
  title: 'Components/Layout/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main admin panel structure with SidebarProvider integration for collapsible sidebar, responsive behavior (mobile sidebar as sheet/drawer), custom sidebar/appBar/menu component support, and theme switching support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Application title displayed in sidebar header',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial sidebar open state (uncontrolled)',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showThemeToggle: {
      control: 'boolean',
      description: 'Show theme toggle button in appbar',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description: 'Current theme setting',
      table: {
        defaultValue: { summary: 'system' },
      },
    },
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
} satisfies Meta<typeof Layout>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Stories
// ============================================================================

/**
 * Default layout with sidebar, appbar, and main content area.
 * The sidebar is expanded by default and includes navigation menu.
 */
export const Default: Story = {
  args: {
    title: 'Admin Panel',
    children: <SampleContent />,
  },
}

/**
 * Layout with a custom menu component showing navigation items with icons.
 */
export const WithCustomMenu: Story = {
  args: {
    title: 'Admin Panel',
    menu: CustomMenu,
    menuItems: defaultMenuItems,
    children: <SampleContent />,
  },
}

/**
 * Layout with extended menu items including notifications.
 */
export const ExtendedMenu: Story = {
  args: {
    title: 'My Application',
    menu: CustomMenu,
    menuItems: extendedMenuItems,
    children: <SampleContent title="Home" />,
  },
}

/**
 * Layout with sidebar starting in collapsed state.
 * Click the hamburger menu to expand the sidebar.
 */
export const CollapsedSidebar: Story = {
  args: {
    title: 'Admin Panel',
    defaultOpen: false,
    menu: CustomMenu,
    menuItems: defaultMenuItems,
    children: <SampleContent />,
  },
}

/**
 * Layout with theme toggle button visible in the appbar.
 * Click the sun icon to cycle through themes.
 */
export const WithThemeToggle: Story = {
  args: { children: null },
  render: () => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

    return (
      <Layout
        title="Theme Demo"
        showThemeToggle
        theme={theme}
        onThemeChange={setTheme}
        menu={CustomMenu}
        menuItems={defaultMenuItems}
      >
        <SampleContent title={`Current Theme: ${theme}`} />
      </Layout>
    )
  },
}

/**
 * Controlled sidebar state - useful for managing sidebar state externally.
 */
export const ControlledSidebar: Story = {
  args: { children: null },
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div className="h-screen flex flex-col">
        <div className="p-2 border-b bg-muted/50">
          <button
            onClick={() => setOpen(!open)}
            className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {open ? 'Collapse Sidebar' : 'Expand Sidebar'}
          </button>
        </div>
        <div className="flex-1">
          <Layout
            title="Controlled Demo"
            open={open}
            onOpenChange={setOpen}
            menu={CustomMenu}
            menuItems={defaultMenuItems}
          >
            <SampleContent title={`Sidebar is ${open ? 'expanded' : 'collapsed'}`} />
          </Layout>
        </div>
      </div>
    )
  },
}

/**
 * Layout with custom AppBar component showing user menu and notifications.
 */
export const WithCustomAppBar: Story = {
  args: { children: null },
  render: () => (
    <Layout
      title="Admin Panel"
      menu={CustomMenu}
      menuItems={defaultMenuItems}
      appBar={
        <AppBar
          title="Custom AppBar"
          showSidebarTrigger
          showThemeToggle
          user={{ name: 'John Doe', email: 'john@example.com.ai' }}
          rightContent={
            <button
              className="relative p-2 rounded-md hover:bg-accent"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
          }
        />
      }
    >
      <SampleContent />
    </Layout>
  ),
}

/**
 * Layout with custom Sidebar component including header, footer, and custom content.
 */
export const WithCustomSidebar: Story = {
  args: { children: null },
  render: () => (
    <Layout
      title="Admin Panel"
      sidebar={
        <Sidebar
          title="My App"
          logo={
            <div className="mr-2 h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              A
            </div>
          }
          footer={
            <div className="flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                JD
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
          }
        >
          <Menu aria-label="Main navigation" className="px-2">
            {defaultMenuItems.map((item) => (
              <MenuItemComponent
                key={item.name}
                to={item.path || `/${item.name}`}
                label={item.label}
                icon={item.icon ? <item.icon className="h-5 w-5" /> : undefined}
              />
            ))}
          </Menu>
        </Sidebar>
      }
    >
      <SampleContent />
    </Layout>
  ),
}

/**
 * Mobile responsive view simulation - resize your browser to see mobile behavior.
 * On mobile, the sidebar becomes a drawer that slides in from the left.
 */
export const MobileResponsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    title: 'Mobile Admin',
    menu: CustomMenu,
    menuItems: defaultMenuItems,
    children: <SampleContent title="Mobile View" />,
  },
}

/**
 * Tablet responsive view simulation.
 */
export const TabletResponsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  args: {
    title: 'Tablet Admin',
    menu: CustomMenu,
    menuItems: defaultMenuItems,
    children: <SampleContent title="Tablet View" />,
  },
}

/**
 * Dark theme layout configuration.
 */
export const DarkTheme: Story = {
  args: {
    title: 'Dark Theme',
    theme: 'dark',
    menu: CustomMenu,
    menuItems: defaultMenuItems,
    children: <SampleContent />,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <div className="dark">
          <Story />
        </div>
      </StoryWrapper>
    ),
  ],
}

/**
 * Complete admin layout with all features enabled.
 */
export const CompleteLayout: Story = {
  args: { children: null },
  render: () => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

    return (
      <Layout
        title="Complete Admin"
        showThemeToggle
        theme={theme}
        onThemeChange={setTheme}
        appBar={
          <AppBar
            title="Complete Admin"
            showSidebarTrigger
            showThemeToggle
            onThemeToggle={() => {
              setTheme((prev) =>
                prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'
              )
            }}
            user={{
              name: 'Jane Smith',
              email: 'jane@company.com',
              avatar: 'https://i.pravatar.cc/150?u=jane',
            }}
            rightContent={
              <div className="flex items-center gap-2">
                <button
                  className="relative p-2 rounded-md hover:bg-accent"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                    3
                  </span>
                </button>
              </div>
            }
          />
        }
        sidebar={
          <Sidebar
            title="Complete Admin"
            logo={
              <div className="mr-2 h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">
                CA
              </div>
            }
            footer={
              <div className="text-xs text-muted-foreground">
                <p>Complete Admin v1.0.0</p>
                <p className="mt-1">2024 All rights reserved</p>
              </div>
            }
          >
            <Menu aria-label="Main navigation" className="px-2">
              {extendedMenuItems.map((item) => (
                <MenuItemComponent
                  key={item.name}
                  to={item.path || `/${item.name}`}
                  label={item.label}
                  icon={item.icon ? <item.icon className="h-5 w-5" /> : undefined}
                  {...(item.name === 'notifications' ? { badge: 3, badgeVariant: 'destructive' as const } : {})}
                />
              ))}
            </Menu>
          </Sidebar>
        }
      >
        <SampleContent title="Complete Admin Dashboard" />
      </Layout>
    )
  },
}

/**
 * Minimal layout with no sidebar - just content with appbar.
 */
export const MinimalLayout: Story = {
  args: { children: null },
  render: () => (
    <div className="min-h-screen">
      <AppBar title="Minimal Layout" showThemeToggle />
      <main className="p-4">
        <SampleContent title="Minimal Layout" />
      </main>
    </div>
  ),
}

/**
 * Layout using SidebarProvider directly for more granular control.
 */
export const WithSidebarProvider: Story = {
  args: { children: null },
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <div className="flex min-h-screen w-full">
          <Sidebar title="Provider Demo">
            <Menu aria-label="Main navigation" className="px-2">
              {defaultMenuItems.map((item) => (
                <MenuItemComponent
                  key={item.name}
                  to={item.path || `/${item.name}`}
                  label={item.label}
                  icon={item.icon ? <item.icon className="h-5 w-5" /> : undefined}
                />
              ))}
            </Menu>
          </Sidebar>
          <div className="flex flex-1 flex-col">
            <AppBar title="Provider Demo" showSidebarTrigger />
            <main className="flex-1 overflow-auto p-4">
              <SampleContent title={`Sidebar: ${open ? 'Open' : 'Closed'}`} />
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  },
}

/**
 * Different layout configurations comparison.
 */
export const LayoutConfigurations: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-8 p-4">
      <h2 className="text-xl font-bold">Layout Configuration Examples</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">Default Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Sidebar expanded, with navigation menu and appbar.
          </p>
          <code className="block mt-2 text-xs bg-muted p-2 rounded">
            {`<Layout title="Admin" />`}
          </code>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">Collapsed Sidebar</h3>
          <p className="text-sm text-muted-foreground">
            Sidebar starts collapsed, shows only icons.
          </p>
          <code className="block mt-2 text-xs bg-muted p-2 rounded">
            {`<Layout title="Admin" defaultOpen={false} />`}
          </code>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">With Theme Toggle</h3>
          <p className="text-sm text-muted-foreground">
            Shows theme toggle button in the appbar.
          </p>
          <code className="block mt-2 text-xs bg-muted p-2 rounded">
            {`<Layout title="Admin" showThemeToggle />`}
          </code>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">Controlled State</h3>
          <p className="text-sm text-muted-foreground">
            Sidebar state managed externally.
          </p>
          <code className="block mt-2 text-xs bg-muted p-2 rounded">
            {`<Layout open={open} onOpenChange={setOpen} />`}
          </code>
        </div>
      </div>
    </div>
  ),
}
