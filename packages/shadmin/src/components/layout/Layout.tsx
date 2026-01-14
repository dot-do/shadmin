/**
 * Layout Component
 * Main admin panel structure with ShadCN-style Sidebar, AppBar, and main content area
 *
 * Features:
 * - SidebarProvider integration for collapsible sidebar
 * - Responsive behavior (mobile sidebar as sheet/drawer)
 * - Custom sidebar/appBar/menu component support
 * - Theme switching support
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type ComponentType,
} from 'react'

import { useMediaQuery } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface MenuItem {
  name: string
  label: string
  path?: string
  icon?: ComponentType<{ className?: string }>
}

export interface LayoutProps {
  /** Main content */
  children: ReactNode
  /** Custom sidebar component - can be a ReactNode or a ComponentType */
  sidebar?: ReactNode | ComponentType | undefined
  /** Custom appbar component - can be a ReactNode or a ComponentType */
  appBar?: ReactNode | ComponentType | undefined
  /** Custom menu component */
  menu?: ComponentType<{ items?: MenuItem[] }> | undefined
  /** Menu items to pass to menu component */
  menuItems?: MenuItem[] | undefined
  /** Application title */
  title?: string | undefined
  /** Additional CSS class */
  className?: string | undefined
  /** Initial sidebar open state (uncontrolled) */
  defaultOpen?: boolean | undefined
  /** Controlled sidebar open state */
  open?: boolean | undefined
  /** Callback when sidebar state changes */
  onOpenChange?: ((open: boolean) => void) | undefined
  /** Theme setting */
  theme?: 'light' | 'dark' | 'system' | undefined
  /** Callback when theme changes */
  onThemeChange?: ((theme: 'light' | 'dark' | 'system') => void) | undefined
  /** Show theme toggle button */
  showThemeToggle?: boolean | undefined
}

// ============================================================================
// Sidebar Context
// ============================================================================

interface SidebarContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  isMobile: boolean
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

// ============================================================================
// Sidebar Provider
// ============================================================================

interface SidebarProviderProps {
  children: ReactNode
  defaultOpen?: boolean
  open?: boolean | undefined
  onOpenChange?: ((open: boolean) => void) | undefined
}

function SidebarProvider({
  children,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
}: SidebarProviderProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [openMobile, setOpenMobile] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const open = controlledOpen ?? internalOpen

  const setOpen = useCallback(
    (value: boolean) => {
      if (onOpenChange) {
        onOpenChange(value)
      } else {
        setInternalOpen(value)
      }
    },
    [onOpenChange]
  )

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev)
    } else {
      setOpen(!open)
    }
  }, [isMobile, open, setOpen])

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggleSidebar,
      isMobile,
      openMobile,
      setOpenMobile,
    }),
    [open, setOpen, toggleSidebar, isMobile, openMobile]
  )

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

SidebarProvider.displayName = 'SidebarProvider'

// ============================================================================
// Sidebar Trigger
// ============================================================================

interface SidebarTriggerProps {
  className?: string
}

function SidebarTrigger({ className }: SidebarTriggerProps) {
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      data-testid="shadmin-sidebar-trigger"
      onClick={toggleSidebar}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md p-2',
        'text-sm font-medium ring-offset-background transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        className
      )}
      aria-label={isMobile ? 'Menu' : 'Toggle sidebar'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    </button>
  )
}

SidebarTrigger.displayName = 'SidebarTrigger'

// ============================================================================
// Default Sidebar
// ============================================================================

interface DefaultSidebarProps {
  title?: string | undefined
  menu?: ComponentType<{ items?: MenuItem[] }> | undefined
  menuItems?: MenuItem[] | undefined
}

function DefaultSidebar({ title, menu: Menu, menuItems }: DefaultSidebarProps) {
  const { open, openMobile, setOpenMobile, isMobile } = useSidebar()
  const sidebarRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const prevOpenMobileRef = useRef(false)

  // Focus management: store trigger and move focus when sidebar opens
  useEffect(() => {
    // Only run when openMobile changes from false to true
    if (openMobile && isMobile && !prevOpenMobileRef.current) {
      // Store the currently focused element (the trigger) before moving focus
      triggerRef.current = document.activeElement as HTMLElement

      // Move focus to first focusable element after a small delay
      if (sidebarRef.current) {
        const focusableElements = sidebarRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        if (firstElement) {
          requestAnimationFrame(() => {
            firstElement.focus()
          })
        }
      }
    }
    prevOpenMobileRef.current = openMobile
  }, [openMobile, isMobile])

  // Handle Escape key to close mobile sidebar
  useEffect(() => {
    if (!openMobile || !isMobile) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const triggerToFocus = triggerRef.current
        setOpenMobile(false)
        // Restore focus to the trigger element synchronously
        // Use setTimeout to ensure state update completes first
        setTimeout(() => {
          triggerToFocus?.focus()
        }, 0)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openMobile, isMobile, setOpenMobile])

  // Focus trap: trap focus within mobile sidebar when open
  useEffect(() => {
    if (!openMobile || !isMobile || !sidebarRef.current) return

    const sidebar = sidebarRef.current
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusableElements = sidebar.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length === 0) return

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]
      if (!firstFocusable || !lastFocusable) return

      if (event.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openMobile, isMobile])

  // Handle closing sidebar and restoring focus
  const handleClose = useCallback(() => {
    setOpenMobile(false)
    // Restore focus to the trigger element
    requestAnimationFrame(() => {
      triggerRef.current?.focus()
    })
  }, [setOpenMobile])

  const sidebarContent = (
    <div data-slot="sidebar-content" className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div data-slot="sidebar-header" className="flex h-14 items-center border-b px-4">
        <span className="font-semibold tracking-tight">{title || 'Admin'}</span>
      </div>

      {/* Sidebar Content */}
      <div data-slot="sidebar-menu" className="flex-1 overflow-auto py-2">
        {Menu ? (
          menuItems ? <Menu items={menuItems} /> : <Menu />
        ) : (
          <nav className="space-y-1 px-2">
            <a
              href="/"
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                'transition-colors hover:bg-accent hover:text-accent-foreground'
              )}
            >
              Dashboard
            </a>
          </nav>
        )}
      </div>

      {/* Sidebar Footer with Profile */}
      <div data-slot="sidebar-footer" className="border-t p-4">
        <button
          type="button"
          aria-label="Profile"
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            JD
          </span>
          <span className="flex-1 truncate text-left">John Doe</span>
        </button>
      </div>
    </div>
  )

  // Mobile sidebar (sheet/drawer)
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {openMobile && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={handleClose}
            aria-hidden="true"
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          ref={sidebarRef}
          role="complementary"
          data-slot="sidebar"
          data-sidebar="sidebar"
          data-testid="shadmin-sidebar"
          data-mobile="true"
          data-mobile-open={openMobile ? 'true' : 'false'}
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-72 border-r bg-sidebar text-sidebar-foreground',
            'transform transition-transform duration-300 ease-in-out',
            'hidden md:flex flex-col',
            openMobile ? 'translate-x-0 flex' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </aside>
      </>
    )
  }

  // Desktop sidebar
  return (
    <aside
      role="complementary"
      data-slot="sidebar"
      data-sidebar="sidebar"
      data-testid="shadmin-sidebar"
      data-state={open ? 'expanded' : 'collapsed'}
      className={cn(
        'hidden md:flex flex-col border-r bg-sidebar text-sidebar-foreground',
        'transition-all duration-300 ease-in-out',
        open ? 'w-72' : 'w-16'
      )}
    >
      {sidebarContent}
    </aside>
  )
}

DefaultSidebar.displayName = 'DefaultSidebar'

// ============================================================================
// Default AppBar
// ============================================================================

interface DefaultAppBarProps {
  title?: string | undefined
  showThemeToggle?: boolean | undefined
  onThemeChange?: (() => void) | undefined
}

function DefaultAppBar({ title, showThemeToggle, onThemeChange }: DefaultAppBarProps) {
  const { isMobile } = useSidebar()

  return (
    <header
      role="banner"
      data-slot="appbar"
      data-testid="shadmin-appbar"
      className={cn(
        'sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'px-4'
      )}
    >
      {/* Sidebar Trigger */}
      <SidebarTrigger />

      {/* Title (mobile only) */}
      {isMobile && title && (
        <span className="font-semibold tracking-tight">{title}</span>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme Toggle */}
      {showThemeToggle && (
        <button
          type="button"
          data-slot="theme-toggle"
          data-testid="shadmin-theme-toggle"
          onClick={onThemeChange}
          className={cn(
            'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md p-2',
            'text-sm font-medium ring-offset-background transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
          )}
          aria-label="Toggle theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </button>
      )}
    </header>
  )
}

DefaultAppBar.displayName = 'DefaultAppBar'

// ============================================================================
// Layout Component
// ============================================================================

/**
 * Layout component
 * Provides the main admin panel structure with sidebar, appbar, and content area
 *
 * @example
 * ```tsx
 * <Layout title="My Admin" theme="dark">
 *   <Dashboard />
 * </Layout>
 *
 * // With custom components
 * <Layout
 *   sidebar={<MySidebar />}
 *   appBar={<MyAppBar />}
 *   menu={MyMenu}
 * >
 *   <Content />
 * </Layout>
 * ```
 */
export function Layout({
  children,
  sidebar,
  appBar,
  menu,
  menuItems,
  title,
  className,
  defaultOpen = true,
  open,
  onOpenChange,
  theme = 'system',
  onThemeChange,
  showThemeToggle = false,
}: LayoutProps) {
  const handleThemeToggle = useCallback(() => {
    if (onThemeChange) {
      const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
      onThemeChange(nextTheme)
    }
  }, [theme, onThemeChange])

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <LayoutInner
        sidebar={sidebar}
        appBar={appBar}
        menu={menu}
        menuItems={menuItems}
        title={title}
        className={className}
        theme={theme}
        onThemeChange={handleThemeToggle}
        showThemeToggle={showThemeToggle}
      >
        {children}
      </LayoutInner>
    </SidebarProvider>
  )
}

interface LayoutInnerProps {
  children: ReactNode
  sidebar?: ReactNode | ComponentType | undefined
  appBar?: ReactNode | ComponentType | undefined
  menu?: ComponentType<{ items?: MenuItem[] }> | undefined
  menuItems?: MenuItem[] | undefined
  title?: string | undefined
  className?: string | undefined
  theme?: 'light' | 'dark' | 'system' | undefined
  onThemeChange: () => void
  showThemeToggle?: boolean | undefined
}

// Helper to check if a value is a component type (function) vs a ReactNode
function isComponentType(value: unknown): value is ComponentType {
  return typeof value === 'function'
}

function LayoutInner({
  children,
  sidebar,
  appBar,
  menu,
  menuItems,
  title,
  className,
  theme,
  onThemeChange,
  showThemeToggle,
}: LayoutInnerProps) {
  const { open, isMobile } = useSidebar()
  const [skipNavVisible, setSkipNavVisible] = useState(false)

  // Show skip nav button on first Tab keypress
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && !skipNavVisible) {
        setSkipNavVisible(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [skipNavVisible])

  // Handle sidebar - can be ReactNode or ComponentType
  const sidebarElement = useMemo(() => {
    if (sidebar === undefined) {
      return <DefaultSidebar title={title} menu={menu} menuItems={menuItems} />
    }
    if (isComponentType(sidebar)) {
      const SidebarComponent = sidebar
      return <SidebarComponent />
    }
    return sidebar
  }, [sidebar, title, menu, menuItems])

  // Handle appBar - can be ReactNode or ComponentType
  const appBarElement = useMemo(() => {
    if (appBar === undefined) {
      return (
        <DefaultAppBar
          title={title}
          showThemeToggle={showThemeToggle}
          onThemeChange={onThemeChange}
        />
      )
    }
    if (isComponentType(appBar)) {
      const AppBarComponent = appBar
      return <AppBarComponent />
    }
    return appBar
  }, [appBar, title, showThemeToggle, onThemeChange])

  return (
    <div
      data-layout="root"
      data-sidebar="wrapper"
      data-state={open ? 'expanded' : 'collapsed'}
      data-theme={theme}
      data-mobile={isMobile ? '' : undefined}
      className={cn('flex min-h-screen w-full', className)}
    >
      {/* Skip Navigation Button */}
      {skipNavVisible && (
        <a
          href="#main-content"
          className={cn(
            'skip-nav-button',
            'sr-only focus:not-sr-only',
            'fixed top-4 left-4 z-[100]',
            'inline-flex items-center justify-center rounded-md px-4 py-2',
            'bg-primary text-primary-foreground font-medium',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        >
          Skip to main content
        </a>
      )}

      {/* Sidebar */}
      {sidebarElement}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* AppBar */}
        {appBarElement}

        {/* Content */}
        <main
          id="main-content"
          role="main"
          data-slot="main-content"
          data-testid="shadmin-main-content"
          className="flex-1 overflow-auto p-4 md:p-6"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

LayoutInner.displayName = 'LayoutInner'
Layout.displayName = 'Layout'

export { SidebarProvider, SidebarTrigger }
export type { SidebarContextValue }
