/**
 * CoreAdminRoutes
 * Creates routes for all registered resources
 * Handles dashboard, list, create, edit, and show routes
 * Uses React Router 7 for route management
 */

import { type ComponentType, type ReactElement, useMemo, type ReactNode, isValidElement, cloneElement } from 'react'
import { useLocation } from 'react-router'
import { ResourceContextProvider } from '../../contexts'
import type { ResourceProps } from '../../types'

/**
 * Menu item interface for plugin-added menu items
 */
export interface MenuItem {
  name: string
  path: string
  icon?: ReactNode | undefined
}

export interface CoreAdminRoutesProps {
  resources: ResourceProps[]
  dashboard?: ComponentType | undefined
  layout?: ComponentType<{ children: ReactNode; dashboard?: ComponentType }> | ReactElement | undefined
  catchAll?: ComponentType | undefined
  menuItems?: MenuItem[] | undefined
}

/**
 * Match a path pattern against a pathname
 * Used for fallback route matching when React Router routes don't match
 */
const matchPath = (
  pattern: string,
  pathname: string
): { match: boolean; params: Record<string, string> } => {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) {
    return { match: false, params: {} }
  }

  const params: Record<string, string> = {}

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]!
    const pathPart = pathParts[i]!

    if (patternPart.startsWith(':')) {
      // This is a parameter
      const paramName = patternPart.slice(1)
      params[paramName] = pathPart
    } else if (patternPart !== pathPart) {
      return { match: false, params: {} }
    }
  }

  return { match: true, params }
}

/**
 * CoreAdminRoutes component
 * Renders routes for all registered resources using React Router 7
 * Supports nested routes, route params (:id), and proper navigation
 */
export const CoreAdminRoutes = ({
  resources,
  dashboard: Dashboard,
  layout: Layout,
  catchAll: CatchAll,
  menuItems = [],
}: CoreAdminRoutesProps) => {
  // Use React Router's location hook for route matching
  const location = useLocation()
  const pathname = location.pathname

  // Find the matching route and component using our custom matching
  // This provides a fallback for when React Router's Routes don't match
  const { component, resourceName } = useMemo(() => {
    // Check if we're at the root (dashboard)
    if (pathname === '/' || pathname === '') {
      if (Dashboard) {
        return { component: Dashboard, resourceName: null }
      }
      // If no dashboard, redirect to first resource with a list
      const firstWithList = resources.find((r) => r.list)
      if (firstWithList) {
        return { component: firstWithList.list!, resourceName: firstWithList.name }
      }
      return { component: null, resourceName: null }
    }

    // Check each resource for a matching route
    for (const resource of resources) {
      const { name, list, create, edit, show } = resource

      // Check list route: /{resource}
      if (list) {
        const listMatch = matchPath(`/${name}`, pathname)
        if (listMatch.match) {
          return { component: list, resourceName: name }
        }
      }

      // Check create route: /{resource}/create
      if (create) {
        const createMatch = matchPath(`/${name}/create`, pathname)
        if (createMatch.match) {
          return { component: create, resourceName: name }
        }
      }

      // Check show route: /{resource}/:id/show
      if (show) {
        const showMatch = matchPath(`/${name}/:id/show`, pathname)
        if (showMatch.match) {
          return { component: show, resourceName: name }
        }
      }

      // Check edit route: /{resource}/:id
      if (edit) {
        const editMatch = matchPath(`/${name}/:id`, pathname)
        if (editMatch.match) {
          return { component: edit, resourceName: name }
        }
      }
    }

    // No match found
    return { component: CatchAll ?? null, resourceName: null }
  }, [pathname, Dashboard, resources, CatchAll])

  // Render the content using route matching
  const renderContent = () => {
    if (!component) {
      return null
    }

    const Component = component as ComponentType

    // Wrap with ResourceContext if we have a resource name
    if (resourceName) {
      return (
        <ResourceContextProvider value={resourceName}>
          <Component />
        </ResourceContextProvider>
      )
    }

    return <Component />
  }

  const content = renderContent()

  // Render menu items
  const renderMenuItems = () => {
    return menuItems.map((item) => (
      <div key={item.path} data-menu-item data-path={item.path}>
        {item.icon}
        <span>{item.name}</span>
      </div>
    ))
  }

  // Wrap with Layout if provided
  if (Layout) {
    const children = (
      <>
        {renderMenuItems()}
        {content}
      </>
    )

    // Handle both ReactElement and ComponentType layouts
    if (isValidElement(Layout)) {
      // It's a ReactElement, clone it with children
      return cloneElement(Layout, {}, children)
    }

    // It's a ComponentType
    const LayoutComponent = Layout as ComponentType<{ children: ReactNode; dashboard?: ComponentType }>
    return (
      <LayoutComponent dashboard={Dashboard}>
        {children}
      </LayoutComponent>
    )
  }

  return (
    <>
      {renderMenuItems()}
      {content}
    </>
  )
}
