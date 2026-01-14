/**
 * Sidebar Component
 * A flexible sidebar navigation component for admin layouts
 *
 * Features:
 * - Collapsible sidebar
 * - Mobile responsive (drawer mode)
 * - Custom header/footer support
 * - Integration with SidebarProvider from Layout
 */

import { type ReactNode, type ComponentType, useMemo } from 'react'

import { useSidebar } from './Layout'
import { cn } from '../../lib/utils'

/**
 * Menu item type for sidebar navigation
 */
export interface SidebarMenuItem {
  name: string
  label: string
  path?: string
  icon?: ComponentType<{ className?: string }>
}

/**
 * Sidebar component props
 */
export interface SidebarProps {
  /**
   * Sidebar content (menu, links, etc.)
   */
  children?: ReactNode
  /**
   * Application title displayed in sidebar header
   */
  title?: string
  /**
   * Logo element to display in header
   */
  logo?: ReactNode
  /**
   * Custom header content
   */
  header?: ReactNode
  /**
   * Custom footer content
   */
  footer?: ReactNode
  /**
   * Additional CSS class
   */
  className?: string
  /**
   * Width when expanded (default: w-72)
   */
  width?: string
  /**
   * Width when collapsed (default: w-16)
   */
  collapsedWidth?: string
}

/**
 * Sidebar - Navigation sidebar component
 *
 * @example
 * ```tsx
 * <Sidebar title="Admin Panel">
 *   <Menu>
 *     <MenuItem to="/dashboard" label="Dashboard" icon={HomeIcon} />
 *     <MenuItem to="/users" label="Users" icon={UsersIcon} />
 *   </Menu>
 * </Sidebar>
 *
 * // With custom header
 * <Sidebar
 *   header={<Logo />}
 *   footer={<UserProfile />}
 * >
 *   <Navigation />
 * </Sidebar>
 * ```
 */
export function Sidebar({
  children,
  title,
  logo,
  header,
  footer,
  className,
  width = 'w-72',
  collapsedWidth = 'w-16',
}: SidebarProps) {
  // Try to get sidebar context
  let sidebarContext: ReturnType<typeof useSidebar> | null = null
  try {
    sidebarContext = useSidebar()
  } catch {
    // Not within a SidebarProvider, default to expanded
  }

  const { open = true, isMobile = false, openMobile = false, setOpenMobile } = sidebarContext || {}

  const sidebarContent = useMemo(
    () => (
      <div data-slot="sidebar-content" className="flex h-full flex-col">
        {/* Header */}
        {(header || title || logo) && (
          <div
            data-slot="sidebar-header"
            className="flex h-14 shrink-0 items-center gap-2 border-b px-4"
          >
            {header || (
              <>
                {logo}
                {title && (
                  <span className={cn(
                    'font-semibold tracking-tight transition-opacity duration-200',
                    !open && !isMobile && 'opacity-0 w-0 overflow-hidden'
                  )}>
                    {title}
                  </span>
                )}
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div data-slot="sidebar-menu" className="flex-1 overflow-auto py-2">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div data-slot="sidebar-footer" className="mt-auto border-t p-4">
            {footer}
          </div>
        )}
      </div>
    ),
    [children, footer, header, isMobile, logo, open, title]
  )

  // Mobile sidebar (drawer)
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {openMobile && (
          <div
            data-slot="sidebar-overlay"
            className={cn(
              'fixed inset-0 z-40 bg-black/80',
              'transition-opacity duration-300'
            )}
            onClick={() => setOpenMobile?.(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          role="complementary"
          data-slot="sidebar"
          data-sidebar="sidebar"
          data-testid="shadmin-sidebar"
          data-mobile="true"
          data-mobile-open={openMobile ? 'true' : 'false'}
          className={cn(
            'fixed inset-y-0 left-0 z-50 border-r bg-sidebar text-sidebar-foreground',
            width,
            'flex flex-col transform transition-transform duration-300 ease-in-out',
            openMobile ? 'translate-x-0' : '-translate-x-full',
            className
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
        open ? width : collapsedWidth,
        className
      )}
    >
      {sidebarContent}
    </aside>
  )
}

Sidebar.displayName = 'Sidebar'
