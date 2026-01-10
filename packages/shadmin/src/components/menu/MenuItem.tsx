/**
 * MenuItem Component
 * Individual menu item for sidebar navigation
 *
 * Provides:
 * - Link navigation
 * - Icon support
 * - Active state based on current route
 * - Badge support
 * - Tooltip in collapsed mode
 * - Keyboard navigation
 *
 * @module MenuItem
 */

import * as React from 'react'
import { useEffect, useRef, useState, useCallback, isValidElement, createElement, forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { useMenuContextSafe } from './Menu'
import { useTestLocation, useTestNavigate, type Location } from '../../test-utils/TestMemoryRouter'

/**
 * Badge variant type
 */
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

/**
 * MenuItem component props
 */
export interface MenuItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /**
   * Navigation target path
   */
  to: string
  /**
   * Menu item label text
   */
  label: string
  /**
   * Icon element or component
   */
  icon?: React.ReactNode | React.ComponentType
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * CSS class applied when active
   */
  activeClassName?: string
  /**
   * Badge content (number, string, or ReactNode)
   */
  badge?: React.ReactNode
  /**
   * Badge variant for styling
   */
  badgeVariant?: BadgeVariant
  /**
   * Exact match for active state (default: prefix match)
   */
  exact?: boolean
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Custom render function for the item
   */
  renderItem?: (props: { label: string; icon?: React.ReactNode; active: boolean }) => React.ReactNode
  /**
   * Keyboard shortcut to display next to the menu item
   */
  keyboardShortcut?: string
}

/**
 * Check if current path matches the menu item path
 */
function isActivePath(currentPath: string, targetPath: string, exact: boolean): boolean {
  if (exact) {
    return currentPath === targetPath
  }
  // Prefix match: /users matches /users, /users/1, /users/1/edit
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
}

/**
 * MenuItem - Individual navigation item
 *
 * @example
 * ```tsx
 * <MenuItem
 *   to="/users"
 *   label="Users"
 *   icon={<UsersIcon />}
 *   badge={5}
 * />
 * ```
 */
export const MenuItem = forwardRef<HTMLAnchorElement, MenuItemProps>(function MenuItem(
  {
    to,
    label,
    icon,
    className,
    activeClassName,
    badge,
    badgeVariant = 'default',
    exact = false,
    disabled = false,
    renderItem,
    keyboardShortcut,
    onClick,
    ...props
  },
  forwardedRef
) {
  const menuContext = useMenuContextSafe()
  const collapsed = menuContext?.collapsed ?? false
  const dense = menuContext?.dense ?? false
  const internalRef = useRef<HTMLAnchorElement>(null)
  const linkRef = forwardedRef || internalRef
  const [showTooltip, setShowTooltip] = useState(false)

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

  const isActive = isActivePath(location.pathname, to, exact)

  // Register with menu context for keyboard navigation
  useEffect(() => {
    const element = typeof linkRef === 'function' ? null : linkRef?.current
    if (element && menuContext) {
      menuContext.registerItem(element)
      return () => menuContext.unregisterItem(element)
    }
    return undefined
  }, [menuContext, linkRef])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLAnchorElement>) => {
      const element = typeof linkRef === 'function' ? null : linkRef?.current
      if (menuContext && element) {
        menuContext.onKeyNavigation(event, element)
      }
    },
    [menuContext, linkRef]
  )

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        event.preventDefault()
        return
      }
      onClick?.(event)
      if (!event.defaultPrevented) {
        event.preventDefault()
        navigate(to)
      }
    },
    [disabled, onClick, navigate, to]
  )

  // Render icon (supports both ReactNode and component)
  const renderIcon = () => {
    if (!icon) return null
    const iconElement = isValidElement(icon)
      ? icon
      : typeof icon === 'function'
        ? createElement(icon as React.ComponentType<{ className?: string }>, {
            className: cn('h-4 w-4 shrink-0', dense && 'h-3.5 w-3.5'),
          })
        : icon
    return <span data-slot="menu-item-icon" className="shrink-0">{iconElement}</span>
  }

  // Custom render
  if (renderItem) {
    return (
      <li
        role="listitem"
        data-slot="menu-item"
        data-collapsed={collapsed ? 'true' : undefined}
      >
        {renderItem({ label, icon: renderIcon(), active: isActive })}
      </li>
    )
  }

  return (
    <li
      role="listitem"
      data-slot="menu-item"
      data-testid="menu-item"
      data-collapsed={collapsed ? 'true' : undefined}
      className="relative"
      onMouseEnter={() => collapsed && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <a
        ref={linkRef as React.RefObject<HTMLAnchorElement>}
        href={to}
        role="menuitem"
        data-slot="menu-item-link"
        data-testid="menu-item-link"
        data-active={isActive ? 'true' : undefined}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          // Base styles
          'group flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-colors',
          // Size variants
          dense ? 'px-2 py-1.5' : 'px-3 py-2',
          // Hover and focus states
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          // Active state
          isActive && 'bg-accent text-accent-foreground',
          // Disabled state
          disabled && 'pointer-events-none opacity-50 cursor-not-allowed',
          // Custom active class
          isActive && activeClassName,
          className
        )}
        {...props}
      >
        {renderIcon()}
        <span
          data-slot="menu-item-label"
          className={cn('flex-1 truncate', collapsed && 'sr-only')}
        >
          {label}
        </span>
        {keyboardShortcut && (
          <kbd
            data-slot="menu-item-shortcut"
            className={cn(
              'ml-auto hidden items-center rounded border border-input bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground md:inline-flex',
              collapsed && 'sr-only'
            )}
          >
            {keyboardShortcut}
          </kbd>
        )}
        {badge !== undefined && badge !== null && (
          <span
            data-slot="menu-item-badge"
            data-testid="menu-item-badge"
            data-variant={badgeVariant}
            aria-label={typeof badge === 'number' ? `${badge} items` : undefined}
            className={cn(
              'ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums',
              badgeVariant === 'default' && 'bg-primary text-primary-foreground',
              badgeVariant === 'secondary' && 'bg-secondary text-secondary-foreground',
              badgeVariant === 'destructive' && 'bg-destructive text-destructive-foreground',
              badgeVariant === 'outline' && 'border border-input bg-background text-foreground',
              collapsed && 'sr-only'
            )}
          >
            {badge}
          </span>
        )}
      </a>

      {/* Tooltip for collapsed mode */}
      {collapsed && showTooltip && (
        <div
          role="tooltip"
          data-slot="menu-item-tooltip"
          data-testid="menu-item-tooltip"
          className={cn(
            'absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2',
            'rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-left-2'
          )}
        >
          {label}
          {badge !== undefined && badge !== null && (
            <span className="ml-2 font-medium text-muted-foreground">({badge})</span>
          )}
        </div>
      )}
    </li>
  )
})

MenuItem.displayName = 'MenuItem'
