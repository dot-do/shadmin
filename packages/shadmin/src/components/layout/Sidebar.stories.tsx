import type { Meta, StoryObj } from '@storybook/react'
import { Sidebar } from './Sidebar'
import { SidebarProvider } from './Layout'
import { Menu } from '../menu/Menu'
import { MenuItem } from '../menu/MenuItem'
import { SubMenu } from '../menu/SubMenu'
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

// ============================================================================
// Story Wrapper
// ============================================================================

function StoryWrapper({
  children,
  initialPath = '/',
}: {
  children: React.ReactNode
  initialPath?: string
}) {
  return (
    <TestMemoryRouter initialEntries={[initialPath]}>
      <div className="flex h-[600px] w-full border rounded-lg overflow-hidden">
        {children}
      </div>
    </TestMemoryRouter>
  )
}

// ============================================================================
// Sample Navigation
// ============================================================================

function SampleNavigation() {
  return (
    <Menu aria-label="Main navigation" className="px-2">
      <MenuItem to="/" label="Dashboard" icon={<HomeIcon className="h-5 w-5" />} />
      <MenuItem to="/users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
      <MenuItem to="/projects" label="Projects" icon={<FolderIcon className="h-5 w-5" />} />
      <SubMenu label="Settings" icon={<SettingsIcon className="h-5 w-5" />}>
        <MenuItem to="/settings/general" label="General" />
        <MenuItem to="/settings/security" label="Security" />
        <MenuItem to="/settings/notifications" label="Notifications" />
      </SubMenu>
    </Menu>
  )
}

// ============================================================================
// Meta
// ============================================================================

/**
 * Sidebar provides collapsible navigation for admin layouts.
 *
 * Features:
 * - Collapsible/expandable with smooth transitions
 * - Mobile responsive (drawer mode on small screens)
 * - Custom header, logo, and footer support
 * - Works with Menu, MenuItem, and SubMenu components
 */
const meta = {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible sidebar navigation component for admin layouts. Supports expanded/collapsed states, custom headers and footers, and integrates with the Menu system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Application title displayed in sidebar header',
    },
    width: {
      control: 'text',
      description: 'Width when expanded (Tailwind class)',
      table: { defaultValue: { summary: 'w-72' } },
    },
    collapsedWidth: {
      control: 'text',
      description: 'Width when collapsed (Tailwind class)',
      table: { defaultValue: { summary: 'w-16' } },
    },
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Stories
// ============================================================================

/**
 * Default expanded sidebar with title and navigation menu.
 */
export const Expanded: Story = {
  args: {
    title: 'Admin Panel',
  },
  render: (args) => (
    <StoryWrapper>
      <SidebarProvider defaultOpen={true}>
        <Sidebar {...args}>
          <SampleNavigation />
        </Sidebar>
        <main className="flex-1 p-6 bg-background">
          <h1 className="text-xl font-semibold">Main Content</h1>
          <p className="text-muted-foreground mt-2">Sidebar is expanded</p>
        </main>
      </SidebarProvider>
    </StoryWrapper>
  ),
}

/**
 * Collapsed sidebar showing only icons.
 * Hover over menu items to see tooltips with labels.
 */
export const Collapsed: Story = {
  args: {
    title: 'Admin Panel',
  },
  render: (args) => (
    <StoryWrapper>
      <SidebarProvider defaultOpen={false}>
        <Sidebar {...args}>
          <SampleNavigation />
        </Sidebar>
        <main className="flex-1 p-6 bg-background">
          <h1 className="text-xl font-semibold">Main Content</h1>
          <p className="text-muted-foreground mt-2">Sidebar is collapsed - hover icons for tooltips</p>
        </main>
      </SidebarProvider>
    </StoryWrapper>
  ),
}

/**
 * Sidebar with custom logo element in the header.
 */
export const WithLogo: Story = {
  args: {
    title: 'My App',
  },
  render: (args) => (
    <StoryWrapper>
      <SidebarProvider defaultOpen={true}>
        <Sidebar
          {...args}
          logo={
            <div className="mr-2 h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              A
            </div>
          }
        >
          <SampleNavigation />
        </Sidebar>
        <main className="flex-1 p-6 bg-background">
          <h1 className="text-xl font-semibold">Main Content</h1>
        </main>
      </SidebarProvider>
    </StoryWrapper>
  ),
}

/**
 * Sidebar with custom footer content showing user profile.
 */
export const WithFooter: Story = {
  args: {
    title: 'Admin Panel',
  },
  render: (args) => (
    <StoryWrapper>
      <SidebarProvider defaultOpen={true}>
        <Sidebar
          {...args}
          footer={
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                JD
              </div>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          }
        >
          <SampleNavigation />
        </Sidebar>
        <main className="flex-1 p-6 bg-background">
          <h1 className="text-xl font-semibold">Main Content</h1>
        </main>
      </SidebarProvider>
    </StoryWrapper>
  ),
}

/**
 * Sidebar with custom header content instead of default title/logo.
 */
export const WithCustomHeader: Story = {
  render: () => (
    <StoryWrapper>
      <SidebarProvider defaultOpen={true}>
        <Sidebar
          header={
            <div className="flex items-center gap-2 w-full">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                  <path d="m2 17 10 5 10-5" />
                  <path d="m2 12 10 5 10-5" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm">Acme Corp</p>
                <p className="text-xs text-muted-foreground">Enterprise</p>
              </div>
            </div>
          }
        >
          <SampleNavigation />
        </Sidebar>
        <main className="flex-1 p-6 bg-background">
          <h1 className="text-xl font-semibold">Main Content</h1>
        </main>
      </SidebarProvider>
    </StoryWrapper>
  ),
}

/**
 * Complete sidebar with logo, navigation, and footer.
 */
export const Complete: Story = {
  render: () => (
    <StoryWrapper>
      <SidebarProvider defaultOpen={true}>
        <Sidebar
          title="Admin Panel"
          logo={
            <div className="mr-2 h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">
              AP
            </div>
          }
          footer={
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Admin Panel v1.0.0</p>
              <p>2024 All rights reserved</p>
            </div>
          }
        >
          <SampleNavigation />
        </Sidebar>
        <main className="flex-1 p-6 bg-background">
          <h1 className="text-xl font-semibold">Main Content</h1>
          <p className="text-muted-foreground mt-2">Complete sidebar configuration</p>
        </main>
      </SidebarProvider>
    </StoryWrapper>
  ),
}

/**
 * Mobile viewport simulation showing sidebar as drawer.
 * The sidebar slides in from the left on mobile devices.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <TestMemoryRouter initialEntries={['/']}>
      <SidebarProvider defaultOpen={false}>
        <div className="flex h-screen w-full flex-col">
          <header className="flex h-14 items-center gap-4 border-b px-4">
            <button
              className="p-2 rounded-md hover:bg-accent"
              aria-label="Open menu"
            >
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
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">Mobile Admin</h1>
          </header>
          <div className="flex flex-1 relative">
            <Sidebar title="Admin Panel">
              <SampleNavigation />
            </Sidebar>
            <main className="flex-1 p-4 bg-background">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <p className="text-muted-foreground mt-2">
                On mobile, tap the menu button to open the sidebar drawer.
              </p>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TestMemoryRouter>
  ),
}

/**
 * Sidebar with custom width configuration.
 */
export const CustomWidth: Story = {
  args: {
    title: 'Wide Sidebar',
    width: 'w-80',
    collapsedWidth: 'w-20',
  },
  render: (args) => (
    <StoryWrapper>
      <SidebarProvider defaultOpen={true}>
        <Sidebar {...args}>
          <SampleNavigation />
        </Sidebar>
        <main className="flex-1 p-6 bg-background">
          <h1 className="text-xl font-semibold">Main Content</h1>
          <p className="text-muted-foreground mt-2">
            Using custom width: {args.width} (expanded) / {args.collapsedWidth} (collapsed)
          </p>
        </main>
      </SidebarProvider>
    </StoryWrapper>
  ),
}
