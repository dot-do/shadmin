import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { AppBar } from './AppBar'
import { SidebarProvider } from './Layout'
import { TestMemoryRouter } from '../../test-utils/TestMemoryRouter'

// ============================================================================
// Icon Components
// ============================================================================

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

const SearchIcon = ({ className }: { className?: string }) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const HelpIcon = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
)

// ============================================================================
// Story Wrapper
// ============================================================================

function StoryWrapper({
  children,
  withSidebar = false,
}: {
  children: React.ReactNode
  withSidebar?: boolean
}) {
  if (withSidebar) {
    return (
      <TestMemoryRouter initialEntries={['/']}>
        <SidebarProvider defaultOpen={true}>
          <div className="w-full max-w-4xl border rounded-lg overflow-hidden">
            {children}
          </div>
        </SidebarProvider>
      </TestMemoryRouter>
    )
  }

  return (
    <TestMemoryRouter initialEntries={['/']}>
      <div className="w-full max-w-4xl border rounded-lg overflow-hidden">
        {children}
      </div>
    </TestMemoryRouter>
  )
}

// ============================================================================
// Meta
// ============================================================================

/**
 * AppBar provides the top navigation bar for admin layouts.
 *
 * Features:
 * - Sidebar trigger integration
 * - Title display
 * - User menu with profile/logout
 * - Theme toggle support
 * - Custom left/right content areas
 */
const meta = {
  title: 'Components/Layout/AppBar',
  component: AppBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Top navigation bar component for admin layouts. Integrates with SidebarProvider for sidebar toggle, includes user menu support, theme toggle, and customizable content areas.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'AppBar title displayed on the left',
    },
    showSidebarTrigger: {
      control: 'boolean',
      description: 'Show sidebar toggle button',
      table: { defaultValue: { summary: 'false' } },
    },
    showThemeToggle: {
      control: 'boolean',
      description: 'Show theme toggle button',
      table: { defaultValue: { summary: 'false' } },
    },
    showUserMenu: {
      control: 'boolean',
      description: 'Show user menu even without user data',
      table: { defaultValue: { summary: 'false' } },
    },
  },
} satisfies Meta<typeof AppBar>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Stories
// ============================================================================

/**
 * Basic AppBar with just a title.
 */
export const Default: Story = {
  args: {
    title: 'Dashboard',
  },
  render: (args) => (
    <StoryWrapper>
      <AppBar {...args} />
      <main className="p-6 bg-background min-h-[200px]">
        <p className="text-muted-foreground">Main content area</p>
      </main>
    </StoryWrapper>
  ),
}

/**
 * AppBar with sidebar trigger button.
 * The trigger integrates with SidebarProvider context.
 */
export const WithSidebarTrigger: Story = {
  args: {
    title: 'Admin Panel',
    showSidebarTrigger: true,
  },
  render: (args) => (
    <StoryWrapper withSidebar>
      <AppBar {...args} />
      <main className="p-6 bg-background min-h-[200px]">
        <p className="text-muted-foreground">Click the hamburger menu to toggle sidebar</p>
      </main>
    </StoryWrapper>
  ),
}

/**
 * AppBar with theme toggle button.
 */
export const WithThemeToggle: Story = {
  args: {
    title: 'Dashboard',
    showThemeToggle: true,
  },
  render: (args) => (
    <StoryWrapper>
      <AppBar {...args} />
      <main className="p-6 bg-background min-h-[200px]">
        <p className="text-muted-foreground">Click the sun icon to toggle theme</p>
      </main>
    </StoryWrapper>
  ),
}

/**
 * AppBar with user menu showing profile dropdown.
 */
export const WithUserMenu: Story = {
  args: {
    title: 'Dashboard',
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  render: (args) => (
    <StoryWrapper>
      <AppBar {...args} />
      <main className="p-6 bg-background min-h-[200px]">
        <p className="text-muted-foreground">Click user avatar to open profile menu</p>
      </main>
    </StoryWrapper>
  ),
}

/**
 * AppBar with user avatar image.
 */
export const WithUserAvatar: Story = {
  args: {
    title: 'Dashboard',
    user: {
      name: 'Jane Smith',
      email: 'jane@company.com',
      avatar: 'https://i.pravatar.cc/150?u=jane',
    },
  },
  render: (args) => (
    <StoryWrapper>
      <AppBar {...args} />
      <main className="p-6 bg-background min-h-[200px]">
        <p className="text-muted-foreground">User menu with custom avatar</p>
      </main>
    </StoryWrapper>
  ),
}

/**
 * AppBar with custom right content (notifications, search, etc).
 */
export const WithRightContent: Story = {
  args: {
    title: 'Dashboard',
    showThemeToggle: true,
  },
  render: (args) => (
    <StoryWrapper>
      <AppBar
        {...args}
        rightContent={
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Search"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            <button
              className="relative p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <button
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Help"
            >
              <HelpIcon className="h-5 w-5" />
            </button>
          </div>
        }
        user={{ name: 'John Doe', email: 'john@example.com' }}
      />
      <main className="p-6 bg-background min-h-[200px]">
        <p className="text-muted-foreground">Custom action buttons in AppBar</p>
      </main>
    </StoryWrapper>
  ),
}

/**
 * AppBar with custom left content (breadcrumbs).
 */
export const WithLeftContent: Story = {
  args: {
    showSidebarTrigger: true,
  },
  render: (args) => (
    <StoryWrapper withSidebar>
      <AppBar
        {...args}
        leftContent={
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Dashboard</a>
            <span>/</span>
            <a href="#" className="hover:text-foreground transition-colors">Users</a>
            <span>/</span>
            <span className="text-foreground font-medium">John Doe</span>
          </nav>
        }
        user={{ name: 'Admin', email: 'admin@example.com' }}
      />
      <main className="p-6 bg-background min-h-[200px]">
        <p className="text-muted-foreground">Breadcrumb navigation in AppBar</p>
      </main>
    </StoryWrapper>
  ),
}

/**
 * AppBar with children rendered as action buttons.
 */
export const WithChildren: Story = {
  args: {
    title: 'Users',
  },
  render: (args) => (
    <StoryWrapper>
      <AppBar {...args} showThemeToggle user={{ name: 'Admin' }}>
        <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          Add User
        </button>
      </AppBar>
      <main className="p-6 bg-background min-h-[200px]">
        <p className="text-muted-foreground">Action button passed as children</p>
      </main>
    </StoryWrapper>
  ),
}

/**
 * Complete AppBar with all features enabled.
 */
export const Complete: Story = {
  render: () => {
    const [notificationCount] = useState(3)

    return (
      <StoryWrapper withSidebar>
        <AppBar
          title="Admin Panel"
          showSidebarTrigger
          showThemeToggle
          leftContent={
            <nav className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground ml-4">
              <a href="#" className="hover:text-foreground transition-colors">Home</a>
              <span>/</span>
              <span className="text-foreground">Dashboard</span>
            </nav>
          }
          rightContent={
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Search"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
              <button
                className="relative p-2 rounded-md hover:bg-accent transition-colors"
                aria-label={`${notificationCount} notifications`}
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                  {notificationCount}
                </span>
              </button>
            </div>
          }
          user={{
            name: 'Jane Smith',
            email: 'jane@company.com',
            avatar: 'https://i.pravatar.cc/150?u=jane',
          }}
          onProfile={() => console.log('Profile clicked')}
          onLogout={() => console.log('Logout clicked')}
        />
        <main className="p-6 bg-background min-h-[200px]">
          <p className="text-muted-foreground">Complete AppBar configuration</p>
        </main>
      </StoryWrapper>
    )
  },
}

/**
 * Minimal AppBar without title - useful for breadcrumb-only navigation.
 */
export const Minimal: Story = {
  args: {
    showSidebarTrigger: true,
  },
  render: (args) => (
    <StoryWrapper withSidebar>
      <AppBar {...args} showThemeToggle />
      <main className="p-6 bg-background min-h-[200px]">
        <h1 className="text-2xl font-bold">Page Title</h1>
        <p className="text-muted-foreground mt-2">Title moved to page content</p>
      </main>
    </StoryWrapper>
  ),
}

/**
 * Mobile viewport showing responsive behavior.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <StoryWrapper withSidebar>
      <AppBar
        title="Mobile"
        showSidebarTrigger
        showThemeToggle
        rightContent={
          <button
            className="relative p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </button>
        }
        user={{ name: 'John Doe' }}
      />
      <main className="p-4 bg-background min-h-[300px]">
        <p className="text-muted-foreground">Mobile viewport - user name hidden, avatar shown</p>
      </main>
    </StoryWrapper>
  ),
}
