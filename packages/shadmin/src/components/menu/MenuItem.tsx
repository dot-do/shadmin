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
 */

import * as React from 'react'
import { useEffect, useRef, useState, useCallback, isValidElement, createElement } from 'react'
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
export function MenuItem({
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
  onClick,
  ...props
}: MenuItemProps) {
  const menuContext = useMenuContextSafe()
  const collapsed = menuContext?.collapsed ?? false
  const linkRef = useRef<HTMLAnchorElement>(null)
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
    const element = linkRef.current
    if (element && menuContext) {
      menuContext.registerItem(element)
      return () => menuContext.unregisterItem(element)
    }
  }, [menuContext])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (menuContext && linkRef.current) {
        menuContext.onKeyNavigation(event, linkRef.current)
      }
    },
    [menuContext]
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
    if (isValidElement(icon)) return icon
    if (typeof icon === 'function') {
      return createElement(icon as React.ComponentType)
    }
    return icon
  }

  // Custom render
  if (renderItem) {
    return (
      <li role="listitem" data-collapsed={collapsed ? 'true' : undefined}>
        {renderItem({ label, icon: renderIcon(), active: isActive })}
      </li>
    )
  }

  return (
    <li
      role="listitem"
      data-collapsed={collapsed ? 'true' : undefined}
      className="relative"
      onMouseEnter={() => collapsed && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <a
        ref={linkRef}
        href={to}
        role="link"
        data-active={isActive ? 'true' : undefined}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive && 'bg-accent text-accent-foreground font-medium',
          disabled && 'pointer-events-none opacity-50',
          isActive && activeClassName,
          className
        )}
        {...props}
      >
        {renderIcon()}
        <span className={cn(collapsed && 'sr-only')}>{label}</span>
        {badge !== undefined && badge !== null && (
          <span
            data-variant={badgeVariant}
            aria-label={typeof badge === 'number' ? `${badge} items` : undefined}
            className={cn(
              'ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              badgeVariant === 'default' && 'bg-primary text-primary-foreground',
              badgeVariant === 'secondary' && 'bg-secondary text-secondary-foreground',
              badgeVariant === 'destructive' && 'bg-destructive text-destructive-foreground',
              badgeVariant === 'outline' && 'border border-input bg-background',
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
          className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"
        >
          {label}
          {badge !== undefined && badge !== null && (
            <span className="ml-2 font-medium">({badge})</span>
          )}
        </div>
      )}
    </li>
  )
}

MenuItem.displayName = 'MenuItem'
