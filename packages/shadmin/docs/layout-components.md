# Layout Components

This guide covers the layout components in shadmin for building admin panel structures with sidebar navigation, app bars, and responsive layouts.

## Overview

The layout system consists of several components that work together:

| Component | Description |
|-----------|-------------|
| `Layout` | Main admin panel structure with sidebar, appbar, and content area |
| `Sidebar` | Collapsible navigation sidebar |
| `AppBar` | Top navigation bar with actions and user menu |
| `Menu` | Navigation menu container |
| `MenuItem` | Individual menu item with icon and badge support |
| `SubMenu` | Collapsible submenu for nested navigation |
| `ContainerLayout` | Alternative layout with horizontal navigation |

## Layout Component

The `Layout` component provides the main admin panel structure with ShadCN-style sidebar, responsive behavior, and theme switching support.

### Basic Usage

```tsx
import { Layout } from 'shadmin'

function App() {
  return (
    <Layout title="Admin Panel">
      <Dashboard />
    </Layout>
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Main content |
| `title` | `string` | - | Application title displayed in sidebar |
| `sidebar` | `ReactNode` | - | Custom sidebar component |
| `appBar` | `ReactNode` | - | Custom appbar component |
| `menu` | `ComponentType<{ items?: MenuItem[] }>` | - | Custom menu component |
| `menuItems` | `MenuItem[]` | - | Menu items to pass to menu component |
| `className` | `string` | - | Additional CSS class |
| `defaultOpen` | `boolean` | `true` | Initial sidebar open state (uncontrolled) |
| `open` | `boolean` | - | Controlled sidebar open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when sidebar state changes |
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | Current theme setting |
| `onThemeChange` | `(theme: 'light' \| 'dark' \| 'system') => void` | - | Callback when theme changes |
| `showThemeToggle` | `boolean` | `false` | Show theme toggle button |

### MenuItem Type

```tsx
interface MenuItem {
  name: string
  label: string
  path?: string
  icon?: ComponentType<{ className?: string }>
}
```

### With Custom Menu

```tsx
import { Layout, Menu, MenuItem } from 'shadmin'
import { HomeIcon, UsersIcon, SettingsIcon } from 'lucide-react'

const menuItems = [
  { name: 'dashboard', label: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'users', label: 'Users', path: '/users', icon: UsersIcon },
  { name: 'settings', label: 'Settings', path: '/settings', icon: SettingsIcon },
]

function CustomMenu({ items }) {
  return (
    <Menu aria-label="Main navigation" className="px-2">
      {items?.map((item) => (
        <MenuItem
          key={item.name}
          to={item.path || `/${item.name}`}
          label={item.label}
          icon={item.icon && <item.icon className="h-5 w-5" />}
        />
      ))}
    </Menu>
  )
}

function App() {
  return (
    <Layout title="Admin Panel" menu={CustomMenu} menuItems={menuItems}>
      <Dashboard />
    </Layout>
  )
}
```

### Controlled Sidebar State

```tsx
import { Layout } from 'shadmin'
import { useState } from 'react'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? 'Collapse' : 'Expand'}
      </button>
      <Layout
        title="Admin Panel"
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      >
        <Dashboard />
      </Layout>
    </>
  )
}
```

### With Theme Toggle

```tsx
import { Layout } from 'shadmin'
import { useState } from 'react'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  return (
    <Layout
      title="Admin Panel"
      showThemeToggle
      theme={theme}
      onThemeChange={setTheme}
    >
      <Dashboard />
    </Layout>
  )
}
```

---

## AppBar Component

The `AppBar` component provides the top navigation bar with sidebar trigger, title, user menu, and custom actions.

### Basic Usage

```tsx
import { AppBar } from 'shadmin'

function MyAppBar() {
  return (
    <AppBar title="Dashboard" showSidebarTrigger />
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | AppBar title |
| `children` | `ReactNode` | - | Child elements (rendered as actions) |
| `user` | `AppBarUser` | - | User data for user menu |
| `className` | `string` | - | Additional CSS class |
| `showSidebarTrigger` | `boolean` | `false` | Show sidebar trigger button |
| `leftContent` | `ReactNode` | - | Custom left content |
| `rightContent` | `ReactNode` | - | Custom right content |
| `showThemeToggle` | `boolean` | `false` | Show theme toggle button |
| `onThemeToggle` | `() => void` | - | Theme toggle callback |

### AppBarUser Type

```tsx
interface AppBarUser {
  name: string
  avatar?: string
  email?: string
}
```

### With User Menu

```tsx
import { AppBar } from 'shadmin'

function MyAppBar() {
  return (
    <AppBar
      title="Admin Panel"
      showSidebarTrigger
      user={{
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg'
      }}
    />
  )
}
```

The user menu automatically displays:
- User avatar (or initials fallback)
- User name
- Dropdown with Profile, Settings, and Log out options

### With Custom Content

```tsx
import { AppBar } from 'shadmin'

function MyAppBar() {
  return (
    <AppBar
      title="Admin"
      showSidebarTrigger
      showThemeToggle
      leftContent={<Breadcrumbs />}
      rightContent={
        <button className="relative p-2 rounded-md hover:bg-accent">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </button>
      }
      user={{ name: 'Jane Smith', email: 'jane@company.com' }}
    />
  )
}
```

---

## Sidebar Component

The `Sidebar` component provides a flexible navigation sidebar with collapsible support, custom header/footer, and mobile drawer mode.

### Basic Usage

```tsx
import { Sidebar, Menu, MenuItem } from 'shadmin'

function MySidebar() {
  return (
    <Sidebar title="Admin Panel">
      <Menu aria-label="Navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon />} />
        <MenuItem to="/users" label="Users" icon={<UsersIcon />} />
      </Menu>
    </Sidebar>
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Sidebar content (menu, links, etc.) |
| `title` | `string` | - | Application title in header |
| `logo` | `ReactNode` | - | Logo element in header |
| `header` | `ReactNode` | - | Custom header content |
| `footer` | `ReactNode` | - | Custom footer content |
| `className` | `string` | - | Additional CSS class |
| `width` | `string` | `'w-72'` | Width when expanded |
| `collapsedWidth` | `string` | `'w-16'` | Width when collapsed |

### With Logo and Footer

```tsx
import { Sidebar, Menu, MenuItem } from 'shadmin'

function MySidebar() {
  return (
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
      <Menu aria-label="Navigation">
        <MenuItem to="/" label="Dashboard" icon={<HomeIcon />} />
      </Menu>
    </Sidebar>
  )
}
```

### With Custom Header

```tsx
import { Sidebar } from 'shadmin'

function MySidebar() {
  return (
    <Sidebar
      header={
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-bold text-lg">Brand</span>
        </div>
      }
    >
      {/* Navigation content */}
    </Sidebar>
  )
}
```

---

## Menu Component

The `Menu` component is the main navigation container that provides keyboard navigation, dense mode, and collapsed mode support.

### Basic Usage

```tsx
import { Menu, MenuItem, SubMenu, DashboardMenuItem } from 'shadmin'

function Navigation() {
  return (
    <Menu aria-label="Main navigation">
      <DashboardMenuItem />
      <MenuItem to="/users" label="Users" icon={<UsersIcon />} />
      <SubMenu label="Settings" icon={<SettingsIcon />}>
        <MenuItem to="/settings/general" label="General" />
        <MenuItem to="/settings/security" label="Security" />
      </SubMenu>
    </Menu>
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Menu items |
| `className` | `string` | - | Additional CSS classes |
| `dense` | `boolean` | `false` | Dense mode for compact display |
| `collapsed` | `boolean` | `false` | Collapsed mode for icon-only display |
| `component` | `ComponentType` | - | Custom container component |
| `aria-label` | `string` | - | ARIA label for accessibility |

### Keyboard Navigation

The Menu component supports full keyboard navigation:

| Key | Action |
|-----|--------|
| `ArrowDown` | Move to next item |
| `ArrowUp` | Move to previous item |
| `Home` | Move to first item |
| `End` | Move to last item |

---

## MenuItem Component

The `MenuItem` component represents an individual navigation item with link, icon, badge, and active state support.

### Basic Usage

```tsx
import { MenuItem } from 'shadmin'

<MenuItem to="/users" label="Users" icon={<UsersIcon />} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `string` | - | Navigation target path |
| `label` | `string` | - | Menu item label text |
| `icon` | `ReactNode \| ComponentType` | - | Icon element or component |
| `className` | `string` | - | Additional CSS classes |
| `activeClassName` | `string` | - | CSS class when active |
| `badge` | `ReactNode` | - | Badge content |
| `badgeVariant` | `BadgeVariant` | `'default'` | Badge styling variant |
| `exact` | `boolean` | `false` | Exact match for active state |
| `disabled` | `boolean` | `false` | Disabled state |
| `renderItem` | `function` | - | Custom render function |

### Badge Variants

```tsx
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'
```

### With Badge

```tsx
import { MenuItem } from 'shadmin'

<MenuItem
  to="/notifications"
  label="Notifications"
  icon={<BellIcon />}
  badge={5}
  badgeVariant="destructive"
/>
```

### Active State

By default, MenuItem uses prefix matching for active state:
- `/users` matches `/users`, `/users/1`, `/users/1/edit`

For exact matching:

```tsx
<MenuItem to="/" label="Home" exact />
```

### Custom Render

```tsx
<MenuItem
  to="/custom"
  label="Custom Item"
  renderItem={({ label, icon, active }) => (
    <div className={active ? 'bg-blue-500' : ''}>
      {icon}
      <span>{label}</span>
    </div>
  )}
/>
```

---

## SubMenu Component

The `SubMenu` component provides collapsible nested navigation with automatic expansion when child routes are active.

### Basic Usage

```tsx
import { SubMenu, MenuItem } from 'shadmin'

<SubMenu label="Settings" icon={<SettingsIcon />}>
  <MenuItem to="/settings/general" label="General" />
  <MenuItem to="/settings/security" label="Security" />
  <MenuItem to="/settings/notifications" label="Notifications" />
</SubMenu>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | SubMenu label text |
| `icon` | `ReactNode \| ComponentType` | - | Icon element or component |
| `children` | `ReactNode` | - | Child menu items |
| `className` | `string` | - | Additional CSS classes |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` | Expand submenu |
| `ArrowLeft` | Collapse submenu |
| `ArrowDown` | Move to next item / focus first child when open |
| `Enter` / `Space` | Toggle submenu |

### Controlled State

```tsx
import { SubMenu, MenuItem } from 'shadmin'
import { useState } from 'react'

function Navigation() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <SubMenu
      label="Settings"
      icon={<SettingsIcon />}
      open={settingsOpen}
      onOpenChange={setSettingsOpen}
    >
      <MenuItem to="/settings/general" label="General" />
      <MenuItem to="/settings/security" label="Security" />
    </SubMenu>
  )
}
```

### Auto-Expand on Active Child

SubMenu automatically expands when navigating to a child route:

```tsx
// If current path is /settings/security, this SubMenu will auto-expand
<SubMenu label="Settings">
  <MenuItem to="/settings/general" label="General" />
  <MenuItem to="/settings/security" label="Security" />
</SubMenu>
```

---

## UserMenu

The UserMenu is built into the `AppBar` component and displays when a `user` prop is provided.

### Features

- Avatar display (or initials fallback)
- User name display
- Dropdown menu with:
  - User name and email
  - Profile link
  - Settings link
  - Log out button

### Usage

```tsx
<AppBar
  user={{
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg'
  }}
/>
```

---

## Theme Toggle

The theme toggle button cycles through `light`, `dark`, and `system` themes.

### In Layout

```tsx
import { Layout } from 'shadmin'
import { useState } from 'react'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  return (
    <Layout
      title="Admin"
      showThemeToggle
      theme={theme}
      onThemeChange={setTheme}
    >
      <Content />
    </Layout>
  )
}
```

### In AppBar

```tsx
import { AppBar } from 'shadmin'

<AppBar
  title="Admin"
  showThemeToggle
  onThemeToggle={() => {
    // Handle theme change
  }}
/>
```

---

## Mobile Responsive Behavior

The layout system automatically adapts to mobile viewports (< 768px):

### Desktop Behavior
- Sidebar displayed as a fixed panel
- Collapsible via toggle button
- Width transitions between expanded (`w-72`) and collapsed (`w-16`)

### Mobile Behavior
- Sidebar hidden by default
- Opens as a slide-in drawer from the left
- Overlay backdrop when open
- Close on overlay click or Escape key
- Focus trap within sidebar when open
- Focus returns to trigger button on close

### Accessibility Features

- **Focus management**: Focus moves to sidebar when opened, returns to trigger when closed
- **Focus trap**: Tab navigation is trapped within mobile sidebar
- **Escape key**: Closes mobile sidebar
- **ARIA attributes**: Proper roles and states for screen readers

### Testing Mobile Layout

```tsx
// In Storybook
export const MobileResponsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    title: 'Mobile Admin',
    children: <Content />,
  },
}
```

---

## Custom Layout Examples

### Complete Admin Layout

```tsx
import {
  Layout,
  AppBar,
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from 'shadmin'
import { useState } from 'react'

function AdminApp() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  return (
    <Layout
      title="Admin"
      showThemeToggle
      theme={theme}
      onThemeChange={setTheme}
      appBar={
        <AppBar
          title="Admin Panel"
          showSidebarTrigger
          showThemeToggle
          onThemeToggle={() => {
            setTheme(prev =>
              prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'
            )
          }}
          user={{
            name: 'Jane Smith',
            email: 'jane@company.com',
            avatar: 'https://example.com/avatar.jpg'
          }}
          rightContent={<NotificationBell />}
        />
      }
      sidebar={
        <Sidebar
          title="Admin"
          logo={<Logo />}
          footer={<AppVersion />}
        >
          <Menu aria-label="Navigation" className="px-2">
            <MenuItem to="/" label="Dashboard" icon={<HomeIcon />} exact />
            <MenuItem to="/users" label="Users" icon={<UsersIcon />} />
            <MenuItem to="/projects" label="Projects" icon={<FolderIcon />} />
            <SubMenu label="Settings" icon={<SettingsIcon />}>
              <MenuItem to="/settings/general" label="General" />
              <MenuItem to="/settings/security" label="Security" />
              <MenuItem to="/settings/billing" label="Billing" />
            </SubMenu>
          </Menu>
        </Sidebar>
      }
    >
      <Outlet />
    </Layout>
  )
}
```

### Using SidebarProvider Directly

For more granular control, use `SidebarProvider` directly:

```tsx
import {
  SidebarProvider,
  Sidebar,
  AppBar,
  useSidebar,
  Menu,
  MenuItem,
} from 'shadmin'
import { useState } from 'react'

function CustomLayout({ children }) {
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="flex min-h-screen w-full">
        <Sidebar title="Provider Demo">
          <Menu aria-label="Navigation" className="px-2">
            <MenuItem to="/" label="Dashboard" />
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <AppBar title="Provider Demo" showSidebarTrigger />
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
```

### Accessing Sidebar State

Use the `useSidebar` hook to access sidebar state within the provider:

```tsx
import { useSidebar } from 'shadmin'

function SidebarStatusIndicator() {
  const { open, isMobile, openMobile, toggleSidebar } = useSidebar()

  return (
    <div>
      <p>Desktop sidebar: {open ? 'Open' : 'Closed'}</p>
      <p>Mobile: {isMobile ? 'Yes' : 'No'}</p>
      <p>Mobile sidebar: {openMobile ? 'Open' : 'Closed'}</p>
      <button onClick={toggleSidebar}>Toggle</button>
    </div>
  )
}
```

### useSidebar Hook Return Value

```tsx
interface SidebarContextValue {
  open: boolean           // Desktop sidebar open state
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  isMobile: boolean       // Is viewport mobile (<768px)
  openMobile: boolean     // Mobile sidebar open state
  setOpenMobile: (open: boolean) => void
}
```

---

## ContainerLayout

An alternative layout with horizontal navigation instead of a sidebar.

### Basic Usage

```tsx
import { ContainerLayout } from 'shadmin'

const menuItems = [
  { name: 'dashboard', label: 'Dashboard', path: '/' },
  { name: 'posts', label: 'Posts', path: '/posts' },
  { name: 'settings', label: 'Settings', path: '/settings' },
]

function App() {
  return (
    <ContainerLayout
      title="My App"
      menuItems={menuItems}
      user={{ name: 'John Doe' }}
    >
      <Outlet />
    </ContainerLayout>
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Main content |
| `menuItems` | `ContainerMenuItem[]` | `[]` | Horizontal navigation items |
| `title` | `string` | - | Application title/logo |
| `user` | `ContainerUser` | - | User information |
| `className` | `string` | - | Additional CSS class |

### ContainerMenuItem Type

```tsx
interface ContainerMenuItem {
  name: string
  label: string
  path: string
  icon?: ReactNode
}
```

### Mobile Behavior

ContainerLayout automatically converts to a hamburger menu on mobile:
- Navigation items collapse into a dropdown
- Hamburger icon toggles the mobile menu
- Active route is highlighted

---

## Data Attributes

Layout components expose data attributes for styling and testing:

| Attribute | Component | Values | Description |
|-----------|-----------|--------|-------------|
| `data-layout` | Layout root | `'root'` | Layout root element |
| `data-sidebar` | Sidebar/Layout | `'sidebar'`, `'wrapper'` | Sidebar elements |
| `data-state` | Layout, Sidebar | `'expanded'`, `'collapsed'` | Sidebar state |
| `data-theme` | Layout | `'light'`, `'dark'`, `'system'` | Current theme |
| `data-mobile` | Layout | `''` (present) | Mobile viewport |
| `data-mobile-open` | Sidebar | `'true'`, `'false'` | Mobile sidebar state |
| `data-dense` | Menu | `'true'` | Dense mode enabled |
| `data-collapsed` | Menu, MenuItem, SubMenu | `'true'` | Collapsed mode |
| `data-active` | MenuItem | `'true'` | Active state |
| `data-variant` | MenuItem badge | Badge variant | Badge styling |
| `data-child-active` | SubMenu | `'true'` | Has active child |

### Example: Custom Styling with Data Attributes

```css
/* Style collapsed sidebar differently */
[data-sidebar="sidebar"][data-state="collapsed"] {
  /* Custom collapsed styles */
}

/* Style active menu items */
[data-active="true"] {
  font-weight: bold;
}

/* Style mobile sidebar */
[data-mobile-open="true"] {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}
```

---

## Exports

```tsx
// Layout exports
export {
  Layout,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  type LayoutProps,
  type SidebarContextValue,
  type MenuItem as LayoutMenuItem,
} from './Layout'

// Sidebar exports
export {
  Sidebar,
  type SidebarProps,
  type SidebarMenuItem,
} from './Sidebar'

// AppBar exports
export {
  AppBar,
  type AppBarProps,
  type AppBarUser,
} from './AppBar'

// ContainerLayout exports
export { ContainerLayout } from './ContainerLayout'

// Menu exports
export {
  Menu,
  MenuItem,
  SubMenu,
  DashboardMenuItem,
  type MenuProps,
  type MenuItemProps,
  type SubMenuProps,
} from './menu'
```
