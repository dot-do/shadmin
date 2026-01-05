/**
 * CoreAdminRoutes
 * Creates routes for all registered resources
 * Handles dashboard, list, create, edit, and show routes
 */

import { type ComponentType, type ReactNode, useMemo } from 'react'
import { ResourceContextProvider } from '../../contexts'
import type { ResourceProps, LayoutProps } from '../../types'

export interface CoreAdminRoutesProps {
  resources: ResourceProps[]
  dashboard?: ComponentType
  layout?: ComponentType<LayoutProps>
  catchAll?: ComponentType
}

/**
 * Simple route matching for testing without react-router
 * In production, this would use React Router v7
 */
const useCurrentPath = () => {
  // For testing purposes, we check window.location
  if (typeof window !== 'undefined') {
    return window.location.pathname
  }
  return '/'
}

/**
 * Match a path pattern against a pathname
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
 * Renders the appropriate component based on the current route
 */
export const CoreAdminRoutes = ({
  resources,
  dashboard: Dashboard,
  layout: Layout,
  catchAll: CatchAll,
}: CoreAdminRoutesProps) => {
  const pathname = useCurrentPath()

  // Find the matching route and component
  const { component, resourceName, params } = useMemo(() => {
    // Check if we're at the root (dashboard)
    if (pathname === '/' || pathname === '') {
      if (Dashboard) {
        return { component: Dashboard, resourceName: null, params: {} }
      }
      // If no dashboard, redirect to first resource with a list
      const firstWithList = resources.find((r) => r.list)
      if (firstWithList) {
        return { component: firstWithList.list!, resourceName: firstWithList.name, params: {} }
      }
      return { component: null, resourceName: null, params: {} }
    }

    // Check each resource for a matching route
    for (const resource of resources) {
      const { name, list, create, edit, show } = resource

      // Check list route: /{resource}
      if (list) {
        const listMatch = matchPath(`/${name}`, pathname)
        if (listMatch.match) {
          return { component: list, resourceName: name, params: listMatch.params }
        }
      }

      // Check create route: /{resource}/create
      if (create) {
        const createMatch = matchPath(`/${name}/create`, pathname)
        if (createMatch.match) {
          return { component: create, resourceName: name, params: createMatch.params }
        }
      }

      // Check show route: /{resource}/:id/show
      if (show) {
        const showMatch = matchPath(`/${name}/:id/show`, pathname)
        if (showMatch.match) {
          return { component: show, resourceName: name, params: showMatch.params }
        }
      }

      // Check edit route: /{resource}/:id
      if (edit) {
        const editMatch = matchPath(`/${name}/:id`, pathname)
        if (editMatch.match) {
          return { component: edit, resourceName: name, params: editMatch.params }
        }
      }
    }

    // No match found
    return { component: CatchAll ?? null, resourceName: null, params: {} }
  }, [pathname, Dashboard, resources, CatchAll])

  // Render the component
  const renderContent = () => {
    if (!component) {
      return null
    }

    const Component = component as ComponentType
    const content = <Component />

    // Wrap with ResourceContext if we have a resource name
    if (resourceName) {
      return (
        <ResourceContextProvider value={resourceName}>
          {content}
        </ResourceContextProvider>
      )
    }

    return content
  }

  const content = renderContent()

  // Wrap with Layout if provided
  if (Layout) {
    return (
      <Layout dashboard={Dashboard}>
        {content}
      </Layout>
    )
  }

  return <>{content}</>
}
