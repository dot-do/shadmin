/**
 * DashboardMenuItem Component
 * Specialized menu item for dashboard/home link
 *
 * Provides:
 * - Pre-configured dashboard menu item
 * - Default icon
 * - Customizable path and label
 */

import * as React from 'react'
// Note: isValidElement and createElement available for future use
// import { isValidElement, createElement } from 'react'
import { MenuItem, type MenuItemProps } from './MenuItem'

/**
 * DashboardMenuItem component props
 */
export interface DashboardMenuItemProps extends Omit<MenuItemProps, 'to' | 'label' | 'exact'> {
  /**
   * Dashboard path (default: '/')
   */
  to?: string
  /**
   * Dashboard label (default: 'Dashboard')
   */
  label?: string
}

/**
 * Default dashboard icon
 */
function DefaultDashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

/**
 * DashboardMenuItem - Pre-configured menu item for dashboard
 *
 * @example
 * ```tsx
 * // Default dashboard
 * <DashboardMenuItem />
 *
 * // Custom path and label
 * <DashboardMenuItem to="/home" label="Home" />
 *
 * // Custom icon
 * <DashboardMenuItem icon={<HomeIcon />} />
 * ```
 */
export function DashboardMenuItem({
  to = '/',
  label = 'Dashboard',
  icon,
  ...props
}: DashboardMenuItemProps) {
  // Use default icon if none provided
  const menuIcon = icon ?? <DefaultDashboardIcon />

  return (
    <MenuItem
      to={to}
      label={label}
      icon={menuIcon}
      exact // Dashboard should use exact match
      {...props}
    />
  )
}

DashboardMenuItem.displayName = 'DashboardMenuItem'
