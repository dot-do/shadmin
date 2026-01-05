import { type ReactNode, type MouseEvent } from 'react'
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
export function MenuItemLink({
  to,
  primaryText,
  leftIcon,
  rightIcon,
  onClick,
  sidebarOpen = true,
  className,
}: MenuItemLinkProps) {
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
      href={to}
      onClick={handleClick}
      data-active={isActive ? 'true' : undefined}
      data-sidebar-open={sidebarOpen ? 'true' : 'false'}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground font-medium',
        !sidebarOpen && 'justify-center px-2',
        className
      )}
    >
      {leftIcon && (
        <span className="flex-shrink-0">
          {leftIcon}
        </span>
      )}
      {sidebarOpen && (
        <span className="flex-1 truncate">{primaryText}</span>
      )}
      {sidebarOpen && rightIcon && (
        <span className="flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </a>
  )
}

MenuItemLink.displayName = 'MenuItemLink'
