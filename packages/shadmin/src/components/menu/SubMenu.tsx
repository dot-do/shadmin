/**
 * SubMenu Component
 * Collapsible submenu for nested navigation
 *
 * Provides:
 * - Expandable/collapsible menu section
 * - Auto-expand when child route is active
 * - Keyboard navigation (ArrowRight/ArrowLeft to expand/collapse)
 * - Icon and label support
 * - Controlled and uncontrolled modes
 *
 * @module SubMenu
 */

import * as React from 'react'
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  isValidElement,
  createElement,
  useId,
  Children,
  forwardRef,
} from 'react'

import { useMenuContextSafe } from './Menu'
import { cn } from '../../lib/utils'
import { useTestLocation, type Location } from '../../test-utils/TestMemoryRouter'

/**
 * SubMenu component props
 */
export interface SubMenuProps {
  /**
   * SubMenu label text
   */
  label: string
  /**
   * Icon element or component
   */
  icon?: React.ReactNode | React.ComponentType
  /**
   * Child menu items
   */
  children: React.ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Default open state (uncontrolled)
   */
  defaultOpen?: boolean
  /**
   * Controlled open state
   */
  open?: boolean
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void
}

/**
 * Check if any child route is active
 */
function hasActiveChild(children: React.ReactNode, currentPath: string): boolean {
  let hasActive = false

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return

    const childProps = child.props as { to?: string; children?: React.ReactNode }

    // Check if this child has a matching path
    if (childProps.to) {
      if (currentPath === childProps.to || currentPath.startsWith(`${childProps.to}/`)) {
        hasActive = true
      }
    }

    // Check nested children (for nested submenus)
    if (childProps.children) {
      if (hasActiveChild(childProps.children, currentPath)) {
        hasActive = true
      }
    }
  })

  return hasActive
}

/**
 * SubMenu - Collapsible menu section
 *
 * @example
 * ```tsx
 * <SubMenu label="Settings" icon={<SettingsIcon />}>
 *   <MenuItem to="/settings/general" label="General" />
 *   <MenuItem to="/settings/security" label="Security" />
 * </SubMenu>
 * ```
 */
export const SubMenu = forwardRef<HTMLButtonElement, SubMenuProps>(function SubMenu(
  {
    label,
    icon,
    children,
    className,
    defaultOpen = false,
    open: controlledOpen,
    onOpenChange,
  },
  forwardedRef
) {
  const menuContext = useMenuContextSafe()
  const collapsed = menuContext?.collapsed ?? false
  const dense = menuContext?.dense ?? false
  const contentId = useId()
  const internalButtonRef = useRef<HTMLButtonElement>(null)
  const buttonRef = forwardedRef || internalButtonRef
  const [showPopup, setShowPopup] = useState(false)

  // Get current location
  let location: Location
  try {
    location = useTestLocation()
  } catch {
    location = { pathname: '/', search: '', hash: '', state: null, key: 'default' }
  }

  const hasActive = useMemo(
    () => hasActiveChild(children, location.pathname),
    [children, location.pathname]
  )

  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(() => {
    // Auto-expand if child is active
    if (hasActive) return true
    return defaultOpen
  })

  // Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  // Auto-expand when child becomes active
  useEffect(() => {
    if (hasActive && !isOpen) {
      if (isControlled) {
        onOpenChange?.(true)
      } else {
        setInternalOpen(true)
      }
    }
  }, [hasActive, isOpen, isControlled, onOpenChange])

  const handleToggle = useCallback(() => {
    const newState = !isOpen
    if (isControlled) {
      onOpenChange?.(newState)
    } else {
      setInternalOpen(newState)
      onOpenChange?.(newState)
    }
  }, [isOpen, isControlled, onOpenChange])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const element = typeof buttonRef === 'function' ? null : buttonRef?.current
      switch (event.key) {
        case 'ArrowRight':
          if (!isOpen) {
            event.preventDefault()
            handleToggle()
          }
          break
        case 'ArrowLeft':
          if (isOpen) {
            event.preventDefault()
            handleToggle()
          }
          break
        case 'ArrowDown':
          if (isOpen) {
            event.preventDefault()
            // Focus first child
            const content = document.getElementById(contentId)
            const firstLink = content?.querySelector('a, button') as HTMLElement | null
            firstLink?.focus()
          } else if (menuContext && element) {
            menuContext.onKeyNavigation(event, element)
          }
          break
        case 'ArrowUp':
        case 'Home':
        case 'End':
          if (menuContext && element) {
            menuContext.onKeyNavigation(event, element)
          }
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleToggle()
          break
      }
    },
    [isOpen, handleToggle, contentId, menuContext, buttonRef]
  )

  // Register with menu context for keyboard navigation
  useEffect(() => {
    const element = typeof buttonRef === 'function' ? null : buttonRef?.current
    if (element && menuContext) {
      menuContext.registerItem(element)
      return () => menuContext.unregisterItem(element)
    }
    return undefined
  }, [menuContext, buttonRef])

  // Render icon
  const renderIcon = () => {
    if (!icon) return null
    const iconElement = isValidElement(icon)
      ? icon
      : typeof icon === 'function'
        ? createElement(icon as React.ComponentType<{ className?: string }>, {
            className: cn('h-4 w-4 shrink-0', dense && 'h-3.5 w-3.5'),
          })
        : icon
    return <span data-slot="submenu-icon" className="shrink-0">{iconElement}</span>
  }

  // Chevron icon component
  const ChevronIcon = () => (
    <svg
      data-slot="submenu-chevron"
      className={cn(
        'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
        isOpen && 'rotate-180'
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )

  // Collapsed mode - show as popup
  if (collapsed) {
    return (
      <li
        role="listitem"
        data-slot="submenu"
        data-testid="submenu"
        data-collapsed="true"
        className="relative"
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        <button
          ref={buttonRef as React.RefObject<HTMLButtonElement>}
          type="button"
          aria-expanded={showPopup}
          aria-controls={contentId}
          aria-haspopup="menu"
          data-slot="submenu-trigger"
          data-testid="submenu-trigger"
          data-state={showPopup ? 'open' : 'closed'}
          data-child-active={hasActive ? 'true' : undefined}
          onClick={() => setShowPopup(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex w-full items-center justify-center rounded-lg p-2 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            hasActive && 'bg-accent/50 text-accent-foreground',
            className
          )}
        >
          {renderIcon()}
          <span className="sr-only">{label}</span>
        </button>

        {showPopup && (
          <div
            id={contentId}
            role="menu"
            data-slot="submenu-popup"
            data-testid="submenu-popup"
            className={cn(
              'absolute left-full top-0 z-50 ml-2 min-w-[180px]',
              'rounded-md border bg-popover p-1 shadow-md',
              'animate-in fade-in-0 zoom-in-95 slide-in-from-left-2'
            )}
          >
            <div
              data-slot="submenu-popup-header"
              className="mb-1 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              {label}
            </div>
            <ul role="list" data-slot="submenu-popup-list">
              {children}
            </ul>
          </div>
        )}
      </li>
    )
  }

  return (
    <li
      role="listitem"
      data-slot="submenu"
      data-testid="submenu"
      className={className}
    >
      <button
        ref={buttonRef as React.RefObject<HTMLButtonElement>}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-haspopup="menu"
        data-slot="submenu-trigger"
        data-testid="submenu-trigger"
        data-state={isOpen ? 'open' : 'closed'}
        data-child-active={hasActive ? 'true' : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          // Base styles
          'group flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-colors',
          // Size variants
          dense ? 'px-2 py-1.5' : 'px-3 py-2',
          // Hover and focus states
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          // Active child indicator
          hasActive && 'bg-accent/50 text-accent-foreground'
        )}
      >
        {renderIcon()}
        <span data-slot="submenu-label" className="flex-1 truncate text-left">
          {label}
        </span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <ul
          id={contentId}
          role="list"
          data-slot="submenu-content"
          data-testid="submenu-content"
          className={cn(
            'mt-1 flex flex-col gap-0.5',
            'ml-4 border-l border-border pl-3'
          )}
        >
          {children}
        </ul>
      )}
    </li>
  )
})

SubMenu.displayName = 'SubMenu'
