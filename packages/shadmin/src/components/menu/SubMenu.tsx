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
} from 'react'
import { cn } from '../../lib/utils'
import { useMenuContextSafe } from './Menu'
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
export function SubMenu({
  label,
  icon,
  children,
  className,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: SubMenuProps) {
  const menuContext = useMenuContextSafe()
  const collapsed = menuContext?.collapsed ?? false
  const contentId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
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
          } else if (menuContext && buttonRef.current) {
            menuContext.onKeyNavigation(event, buttonRef.current)
          }
          break
        case 'ArrowUp':
        case 'Home':
        case 'End':
          if (menuContext && buttonRef.current) {
            menuContext.onKeyNavigation(event, buttonRef.current)
          }
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleToggle()
          break
      }
    },
    [isOpen, handleToggle, contentId, menuContext]
  )

  // Register with menu context for keyboard navigation
  useEffect(() => {
    const element = buttonRef.current
    if (element && menuContext) {
      menuContext.registerItem(element)
      return () => menuContext.unregisterItem(element)
    }
  }, [menuContext])

  // Render icon
  const renderIcon = () => {
    if (!icon) return null
    if (isValidElement(icon)) return icon
    if (typeof icon === 'function') {
      return createElement(icon as React.ComponentType)
    }
    return icon
  }

  // Collapsed mode - show as popup
  if (collapsed) {
    return (
      <li
        role="listitem"
        data-collapsed="true"
        className="relative"
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={showPopup}
          aria-controls={contentId}
          data-state={showPopup ? 'open' : 'closed'}
          data-child-active={hasActive ? 'true' : undefined}
          onClick={() => setShowPopup(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex w-full items-center justify-center rounded-lg p-2 text-sm transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            hasActive && 'bg-accent/50',
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
            className="absolute left-full top-0 z-50 ml-2 min-w-[180px] rounded-md border bg-popover p-1 shadow-md"
          >
            <div className="mb-1 px-2 py-1 text-xs font-medium text-muted-foreground">
              {label}
            </div>
            <ul role="list">{children}</ul>
          </div>
        )}
      </li>
    )
  }

  return (
    <li role="listitem" className={className}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        data-state={isOpen ? 'open' : 'closed'}
        data-child-active={hasActive ? 'true' : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          hasActive && 'bg-accent/50'
        )}
      >
        {renderIcon()}
        <span className="flex-1 text-left">{label}</span>
        <svg
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <ul
          id={contentId}
          role="list"
          className="ml-4 mt-1 flex flex-col gap-1 border-l pl-3"
        >
          {children}
        </ul>
      )}
    </li>
  )
}

SubMenu.displayName = 'SubMenu'
