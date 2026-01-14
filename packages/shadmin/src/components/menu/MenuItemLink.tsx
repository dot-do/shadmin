/**
 * MenuItemLink Component
 * A navigation link styled as a menu item
 *
 * @module MenuItemLink
 */

import { type ReactNode, type MouseEvent, forwardRef, useRef } from 'react'

import { cn } from '../../lib/utils'
import {
  useTestLocation,
  useTestNavigate,
  type Location,
} from '../../test-utils/TestMemoryRouter'

/**
 * Props for MenuItemLink component
 */
export interface MenuItemLinkProps {
  /** Target route path */
  to: string
  /** Primary text label */
  primaryText: string
  /** Icon to display on the left */
  leftIcon?: ReactNode
  /** Icon to display on the right */
  rightIcon?: ReactNode
  /** Click handler */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  /** Whether the sidebar is open (affects display) */
  sidebarOpen?: boolean
  /** Additional CSS class name */
  className?: string
}

/**
 * MenuItemLink - A navigation link styled as a menu item
 *
 * This component renders a Link that integrates with react-router
 * and provides visual feedback for the current route.
 *
 * @example
 * ```tsx
 * <MenuItemLink
 *   to="/users"
 *   primaryText="Users"
 *   leftIcon={<UsersIcon />}
 * />
 * ```
 */
export const MenuItemLink = forwardRef<HTMLAnchorElement, MenuItemLinkProps>(
  function MenuItemLink(
    { to, primaryText, leftIcon, rightIcon, onClick, sidebarOpen = true, className },
    forwardedRef
  ) {
    const internalRef = useRef<HTMLAnchorElement>(null)
    const ref = forwardedRef || internalRef

    // Get current location using test router
    let location: Location
    let navigate: ReturnType<typeof useTestNavigate>

    try {
      location = useTestLocation()
      navigate = useTestNavigate()
    } catch {
      // Fallback for when not in router context
      location = { pathname: '/', search: '', hash: '', state: null, key: 'default' }
      navigate = () => {}
    }

    const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`)

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) {
        event.preventDefault()
        navigate(to)
      }
    }

    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={to}
        role="menuitem"
        onClick={handleClick}
        data-slot="menu-item-link"
        data-testid="menu-item-link"
        data-active={isActive ? 'true' : undefined}
        data-sidebar-open={sidebarOpen ? 'true' : 'false'}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          // Base styles
          'group flex items-center gap-3 rounded-lg text-sm font-medium transition-colors',
          // Size based on sidebar state
          sidebarOpen ? 'px-3 py-2' : 'justify-center px-2 py-2',
          // Hover and focus states
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          // Active state
          isActive && 'bg-accent text-accent-foreground',
          className
        )}
      >
        {leftIcon && (
          <span data-slot="menu-item-left-icon" className="shrink-0">
            {leftIcon}
          </span>
        )}
        {sidebarOpen && (
          <span data-slot="menu-item-label" className="flex-1 truncate">
            {primaryText}
          </span>
        )}
        {!sidebarOpen && <span className="sr-only">{primaryText}</span>}
        {sidebarOpen && rightIcon && (
          <span data-slot="menu-item-right-icon" className="shrink-0">
            {rightIcon}
          </span>
        )}
      </a>
    )
  }
)

MenuItemLink.displayName = 'MenuItemLink'
