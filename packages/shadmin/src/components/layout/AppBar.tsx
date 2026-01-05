/**
 * AppBar Component
 * Top navigation bar for the admin layout
 *
 * Features:
 * - Sidebar trigger integration
 * - Title display
 * - User menu support
 * - Custom left/right content areas
 * - Theme toggle support
 */

import * as React from 'react'
import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { useSidebar, SidebarTrigger } from './Layout'

// ============================================================================
// Types
// ============================================================================

export interface AppBarUser {
  name: string
  avatar?: string
  email?: string
}

export interface AppBarProps {
  /** AppBar title */
  title?: string
  /** Child elements (rendered as actions) */
  children?: ReactNode
  /** User data for user menu */
  user?: AppBarUser
  /** Additional CSS class */
  className?: string
  /** Show sidebar trigger */
  showSidebarTrigger?: boolean
  /** Custom left content */
  leftContent?: ReactNode
  /** Custom right content */
  rightContent?: ReactNode
  /** Show theme toggle */
  showThemeToggle?: boolean
  /** Theme toggle callback */
  onThemeToggle?: () => void
}

// ============================================================================
// User Menu
// ============================================================================

interface UserMenuProps {
  user: AppBarUser
}

function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1',
          'text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <span className="text-xs font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="hidden md:inline">{user.name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            className={cn(
              'absolute right-0 top-full z-50 mt-1',
              'min-w-[160px] rounded-md border bg-popover p-1 shadow-lg',
              'animate-in fade-in-0 zoom-in-95'
            )}
          >
            <div className="px-2 py-1.5 text-sm font-semibold">
              {user.name}
            </div>
            {user.email && (
              <div className="px-2 pb-1.5 text-xs text-muted-foreground">
                {user.email}
              </div>
            )}
            <div className="-mx-1 my-1 h-px bg-border" />
            <button
              role="menuitem"
              className={cn(
                'flex w-full items-center rounded-sm px-2 py-1.5 text-sm',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:bg-accent focus:text-accent-foreground focus:outline-none'
              )}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </button>
            <button
              role="menuitem"
              className={cn(
                'flex w-full items-center rounded-sm px-2 py-1.5 text-sm',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:bg-accent focus:text-accent-foreground focus:outline-none'
              )}
              onClick={() => setIsOpen(false)}
            >
              Settings
            </button>
            <div className="-mx-1 my-1 h-px bg-border" />
            <button
              role="menuitem"
              className={cn(
                'flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive',
                'hover:bg-destructive/10',
                'focus:bg-destructive/10 focus:outline-none'
              )}
              onClick={() => setIsOpen(false)}
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// Theme Toggle
// ============================================================================

interface ThemeToggleProps {
  onToggle?: () => void
}

function ThemeToggle({ onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2',
        'text-sm font-medium ring-offset-background transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
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
        className="h-5 w-5"
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
  )
}

// ============================================================================
// AppBar Component
// ============================================================================

/**
 * AppBar component
 * Provides the top navigation bar for admin layouts
 *
 * @example
 * ```tsx
 * <AppBar title="Dashboard" showSidebarTrigger>
 *   <button>Action</button>
 * </AppBar>
 *
 * // With user menu
 * <AppBar
 *   title="My Admin"
 *   user={{ name: 'John Doe', avatar: '/avatar.png' }}
 * />
 *
 * // With custom content
 * <AppBar
 *   leftContent={<Breadcrumbs />}
 *   rightContent={<Notifications />}
 * />
 * ```
 */
export function AppBar({
  title,
  children,
  user,
  className,
  showSidebarTrigger = false,
  leftContent,
  rightContent,
  showThemeToggle = false,
  onThemeToggle,
}: AppBarProps) {
  // Try to get sidebar context, but don't fail if not available
  let sidebarContext: ReturnType<typeof useSidebar> | null = null
  try {
    sidebarContext = useSidebar()
  } catch {
    // Not within a SidebarProvider, that's okay
  }

  return (
    <header
      role="banner"
      className={cn(
        'sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4',
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2">
        {/* Sidebar Trigger */}
        {showSidebarTrigger && (
          sidebarContext ? (
            <SidebarTrigger />
          ) : (
            <button
              type="button"
              className={cn(
                'inline-flex items-center justify-center rounded-md p-2',
                'text-sm font-medium ring-offset-background transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50'
              )}
              aria-label="Toggle sidebar"
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
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          )
        )}

        {/* Title */}
        {title && (
          <h1 className="text-lg font-semibold">{title}</h1>
        )}

        {/* Custom Left Content */}
        {leftContent}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Custom Right Content */}
        {rightContent}

        {/* Actions (children) */}
        {children}

        {/* Theme Toggle */}
        {showThemeToggle && <ThemeToggle onToggle={onThemeToggle} />}

        {/* User Menu */}
        {user && <UserMenu user={user} />}
      </div>
    </header>
  )
}

export type { AppBarUser }
