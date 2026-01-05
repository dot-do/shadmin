/**
 * Menu component exports
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

// MenuItemLink - Menu item as link (alias for MenuItem)
export { MenuItem as MenuItemLink } from './MenuItem'

// DashboardMenuItem - Pre-configured dashboard link
export { DashboardMenuItem, type DashboardMenuItemProps } from './DashboardMenuItem'

// SubMenu - Collapsible submenu container
export { SubMenu, type SubMenuProps } from './SubMenu'
