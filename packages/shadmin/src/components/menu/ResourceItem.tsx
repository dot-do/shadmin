/**
 * ResourceItem Component
 * Menu item that automatically links to a resource's list view
 *
 * Provides:
 * - Auto-generated link based on resource name
 * - Automatic label from resource definition or inflected name
 * - Resource icon support
 *
 * @module ResourceItem
 */

import { forwardRef } from 'react'

import { MenuItem, type MenuItemProps } from './MenuItem'
import { useResourceDefinitions } from '../../contexts/ResourceContext'

/**
 * Inflect a resource name to a human-readable label
 * e.g., "posts" -> "Posts", "user_accounts" -> "User Accounts"
 */
function inflectLabel(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * ResourceItem component props
 */
export interface ResourceItemProps extends Omit<MenuItemProps, 'to' | 'label'> {
  /**
   * The name of the resource (e.g., "posts", "users")
   */
  name: string
  /**
   * Custom label (defaults to inflected resource name or resource definition label)
   */
  label?: string
  /**
   * Custom path (defaults to "/{resource}")
   */
  to?: string
  /**
   * Keyboard shortcut to display next to the menu item
   */
  keyboardShortcut?: string
}

/**
 * ResourceItem - Menu item that links to a resource's list view
 *
 * Automatically generates the link and label based on the resource name.
 * Can also pick up label and icon from resource definitions.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Menu>
 *   <Menu.ResourceItem name="posts" />
 *   <Menu.ResourceItem name="users" />
 * </Menu>
 *
 * // With custom label
 * <Menu.ResourceItem name="posts" label="All Posts" />
 *
 * // With custom icon
 * <Menu.ResourceItem name="posts" icon={<PostIcon />} />
 * ```
 */
export const ResourceItem = forwardRef<HTMLAnchorElement, ResourceItemProps>(
  function ResourceItem({ name, label, to, icon, keyboardShortcut, ...props }, ref) {
    const definitions = useResourceDefinitions()
    const definition = definitions[name]

    // Determine the link path
    const path = to ?? `/${name}`

    // Determine the label (priority: prop > definition > inflected name)
    const displayLabel = label ?? definition?.options?.label ?? inflectLabel(name)

    // Determine the icon (priority: prop > definition icon)
    const displayIcon = icon ?? definition?.icon

    return (
      <MenuItem
        ref={ref}
        to={path}
        label={displayLabel}
        icon={displayIcon}
        data-testid={`resource-menu-item-${name}`}
        {...(keyboardShortcut !== undefined && { keyboardShortcut })}
        {...props}
      />
    )
  }
)

ResourceItem.displayName = 'ResourceItem'
