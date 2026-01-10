/**
 * Menu component exports
 *
 * @module menu
 */

// Menu - Main navigation container
export {
  Menu,
  MenuContext,
  useMenuContext,
  useMenuContextSafe,
  type MenuProps,
  type MenuContextValue,
} from './Menu'

// MenuItem - Individual menu item
export {
  MenuItem,
  type MenuItemProps,
  type BadgeVariant,
} from './MenuItem'

// MenuItemLink - Standalone menu item link component
export { MenuItemLink, type MenuItemLinkProps } from './MenuItemLink'

// DashboardMenuItem - Pre-configured dashboard link
export { DashboardMenuItem, type DashboardMenuItemProps } from './DashboardMenuItem'

// SubMenu - Collapsible submenu container
export { SubMenu, type SubMenuProps } from './SubMenu'

// ResourceItem - Menu item that auto-links to resource list
export { ResourceItem, type ResourceItemProps } from './ResourceItem'
