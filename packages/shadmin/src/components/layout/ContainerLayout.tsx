import { type ReactNode, useState, useCallback } from 'react'
import { cn } from '../../lib/utils'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import {
  useTestLocation,
  Link,
  type Location,
} from '../../test-utils/TestMemoryRouter'

/**
 * Menu item configuration for ContainerLayout
 */
export interface ContainerMenuItem {
  name: string
  label: string
  path: string
  icon?: ReactNode
}

/**
 * User configuration for ContainerLayout
 */
export interface ContainerUser {
  name: string
  avatar?: string
}

/**
 * Props for ContainerLayout component
 */
export interface ContainerLayoutProps {
  /** Content to render in the main area */
  children: ReactNode
  /** Menu items for horizontal navigation */
  menuItems?: ContainerMenuItem[]
  /** Application title/logo */
  title?: string
  /** User information for user menu */
  user?: ContainerUser
  /** Additional CSS class name */
  className?: string
}

/**
 * ContainerLayout - A container-based layout with horizontal navigation
 *
 * Unlike the sidebar-based Layout, ContainerLayout uses a traditional
 * top navigation bar with horizontal menu items, similar to many
 * marketing sites and simpler admin panels.
 *
 * @example
 * ```tsx
 * <ContainerLayout
 *   title="My App"
 *   menuItems={[
 *     { name: 'dashboard', label: 'Dashboard', path: '/' },
 *     { name: 'posts', label: 'Posts', path: '/posts' },
 *   ]}
 * >
 *   <Outlet />
 * </ContainerLayout>
 * ```
 */
export function ContainerLayout({
  children,
  menuItems = [],
  title,
  user,
  className,
}: ContainerLayoutProps) {
  // Get current location using test router
  let location: Location
  try {
    location = useTestLocation()
  } catch {
    // Fallback for when not in router context
    location = { pathname: '/', search: '', hash: '', state: null, key: 'default' }
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <div
      className={cn('min-h-screen flex flex-col', className)}
      data-layout="container"
    >
      {/* Header with navigation */}
      <header
        role="banner"
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-14 items-center">
          {/* Logo/Title */}
          {title && (
            <div className="mr-4 font-semibold">
              <Link to="/">{title}</Link>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav role="navigation" className="hidden md:flex items-center gap-6 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.path
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger menu */}
          {isMobile && (
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}

          {/* User menu */}
          {user && (
            <div className="ml-auto flex items-center gap-2">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          )}
        </div>

        {/* Mobile menu dropdown */}
        {isMobile && isMobileMenuOpen && (
          <nav className="md:hidden border-t" role="navigation">
            <div className="container py-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    location.pathname === item.path
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                  onClick={closeMobileMenu}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 container py-6">
        {children}
      </main>
    </div>
  )
}

ContainerLayout.displayName = 'ContainerLayout'
