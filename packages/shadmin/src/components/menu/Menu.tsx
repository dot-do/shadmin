/**
 * Menu Component
 * Main navigation menu container for sidebar navigation
 *
 * Provides:
 * - Navigation container with proper ARIA attributes
 * - Dense mode for compact display
 * - Collapsed mode for icon-only display
 * - Keyboard navigation support
 */

import * as React from 'react'
import { createContext, useContext, useCallback, useRef, useMemo } from 'react'
import { cn } from '../../lib/utils'

/**
 * Menu context for sharing state with children
 */
export interface MenuContextValue {
  dense: boolean
  collapsed: boolean
  onKeyNavigation: (event: React.KeyboardEvent, element: HTMLElement) => void
  registerItem: (element: HTMLElement) => void
  unregisterItem: (element: HTMLElement) => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

/**
 * Hook to access menu context
 */
export function useMenuContext(): MenuContextValue {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenuContext must be used within a Menu component')
  }
  return context
}

/**
 * Hook to safely access menu context (returns null if not in Menu)
 */
export function useMenuContextSafe(): MenuContextValue | null {
  return useContext(MenuContext)
}

/**
 * Menu component props
 */
export interface MenuProps extends Omit<React.HTMLAttributes<HTMLElement>, 'component'> {
  /**
   * Menu items (MenuItem, SubMenu, DashboardMenuItem)
   */
  children: React.ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Dense mode for compact display
   */
  dense?: boolean
  /**
   * Collapsed mode for icon-only display
   */
  collapsed?: boolean
  /**
   * Custom component to render as menu container
   */
  component?: React.ComponentType<{ children: React.ReactNode }>
  /**
   * ARIA label for the navigation
   */
  'aria-label'?: string
}

/**
 * Menu - Main navigation container
 *
 * @example
 * ```tsx
 * <Menu>
 *   <DashboardMenuItem />
 *   <MenuItem to="/users" label="Users" icon={<UsersIcon />} />
 *   <SubMenu label="Settings" icon={<SettingsIcon />}>
 *     <MenuItem to="/settings/general" label="General" />
 *     <MenuItem to="/settings/security" label="Security" />
 *   </SubMenu>
 * </Menu>
 * ```
 */
export function Menu({
  children,
  className,
  dense = false,
  collapsed = false,
  component: Component,
  'aria-label': ariaLabel,
  ...props
}: MenuProps) {
  const itemsRef = useRef<HTMLElement[]>([])

  const registerItem = useCallback((element: HTMLElement) => {
    if (!itemsRef.current.includes(element)) {
      itemsRef.current.push(element)
    }
  }, [])

  const unregisterItem = useCallback((element: HTMLElement) => {
    const index = itemsRef.current.indexOf(element)
    if (index !== -1) {
      itemsRef.current.splice(index, 1)
    }
  }, [])

  const onKeyNavigation = useCallback((event: React.KeyboardEvent, element: HTMLElement) => {
    const items = itemsRef.current.filter(
      (item) => !item.hasAttribute('aria-disabled') || item.getAttribute('aria-disabled') !== 'true'
    )
    const currentIndex = items.indexOf(element)

    if (currentIndex === -1) return

    let nextIndex: number | null = null

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        nextIndex = (currentIndex + 1) % items.length
        break
      case 'ArrowUp':
        event.preventDefault()
        nextIndex = (currentIndex - 1 + items.length) % items.length
        break
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      case 'End':
        event.preventDefault()
        nextIndex = items.length - 1
        break
    }

    if (nextIndex !== null && items[nextIndex]) {
      items[nextIndex].focus()
    }
  }, [])

  const contextValue = useMemo<MenuContextValue>(
    () => ({
      dense,
      collapsed,
      onKeyNavigation,
      registerItem,
      unregisterItem,
    }),
    [dense, collapsed, onKeyNavigation, registerItem, unregisterItem]
  )

  const content = (
    <ul role="list" className="flex flex-col gap-1">
      {children}
    </ul>
  )

  if (Component) {
    return (
      <MenuContext.Provider value={contextValue}>
        <Component>{content}</Component>
      </MenuContext.Provider>
    )
  }

  return (
    <MenuContext.Provider value={contextValue}>
      <nav
        role="navigation"
        aria-label={ariaLabel}
        data-dense={dense ? 'true' : undefined}
        data-collapsed={collapsed ? 'true' : undefined}
        className={cn('flex flex-col', className)}
        {...props}
      >
        {content}
      </nav>
    </MenuContext.Provider>
  )
}

Menu.displayName = 'Menu'

// Import ResourceItem for static property assignment
import { ResourceItem } from './ResourceItem'

// Attach ResourceItem as static property for <Menu.ResourceItem> pattern
Menu.ResourceItem = ResourceItem

export { MenuContext }
