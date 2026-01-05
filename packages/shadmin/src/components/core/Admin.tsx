/**
 * Admin Component
 * The root component for a Shadmin application
 * Orchestrates providers, routing, and layout
 *
 * 100% API-compatible with react-admin
 */

import {
  type ReactNode,
  type ReactElement,
  Children,
  isValidElement,
  useState,
  useCallback,
  useMemo,
} from 'react'
import { ResourceDefinitionContextProvider, type ResourceDefinitions } from '../../contexts'
import type { AdminProps, ResourceProps, ResourceDefinition, LayoutProps } from '../../types'
import { CoreAdminContext } from './CoreAdminContext'
import { CoreAdminRoutes } from './CoreAdminRoutes'
import { Resource, ResourceRegistrationContext, type ResourceRegistrationContextValue } from './Resource'

/**
 * Extract Resource children and convert to ResourceProps[]
 */
const extractResourceProps = (children: ReactNode): ResourceProps[] => {
  const resources: ResourceProps[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Resource) {
      const props = child.props as ResourceProps
      resources.push(props)
    }
  })

  return resources
}

/**
 * Admin component
 *
 * @example
 * ```tsx
 * <Admin
 *   dataProvider={dataProvider}
 *   authProvider={authProvider}
 *   layout={MyLayout}
 *   dashboard={Dashboard}
 *   theme={myTheme}
 *   darkTheme={darkTheme}
 *   basename="/admin"
 * >
 *   <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
 *   <Resource name="users" list={UserList} />
 * </Admin>
 * ```
 */
export const Admin = ({
  children,
  dataProvider,
  authProvider,
  layout,
  dashboard,
  theme,
  darkTheme,
  basename = '',
  title = 'Shadmin',
  disableTelemetry,
  loginPage,
  error,
  loading,
  notification,
  ready,
}: AdminProps): ReactElement => {
  // State to track registered resources
  const [registeredResources, setRegisteredResources] = useState<
    Map<string, { definition: ResourceDefinition; props: ResourceProps }>
  >(new Map())

  // Registration functions for Resource components
  const register = useCallback(
    (definition: ResourceDefinition, props: ResourceProps) => {
      setRegisteredResources((prev) => {
        const next = new Map(prev)
        next.set(definition.name, { definition, props })
        return next
      })
    },
    []
  )

  const unregister = useCallback((name: string) => {
    setRegisteredResources((prev) => {
      const next = new Map(prev)
      next.delete(name)
      return next
    })
  }, [])

  const registrationValue: ResourceRegistrationContextValue = useMemo(
    () => ({ register, unregister }),
    [register, unregister]
  )

  // Convert registered resources to definitions object for context
  const resourceDefinitions: ResourceDefinitions = useMemo(() => {
    const definitions: ResourceDefinitions = {}
    registeredResources.forEach(({ definition }, name) => {
      definitions[name] = definition
    })
    return definitions
  }, [registeredResources])

  // Get resources array for routing
  const resourcesArray: ResourceProps[] = useMemo(() => {
    // First try to extract from direct children
    const fromChildren = extractResourceProps(children)
    if (fromChildren.length > 0) {
      return fromChildren
    }

    // Fall back to registered resources
    return Array.from(registeredResources.values()).map(({ props }) => props)
  }, [children, registeredResources])

  return (
    <CoreAdminContext
      dataProvider={dataProvider}
      authProvider={authProvider}
      basename={basename}
    >
      <ResourceDefinitionContextProvider definitions={resourceDefinitions}>
        <ResourceRegistrationContext.Provider value={registrationValue}>
          {/* Render Resource children so they can register */}
          {children}
          {/* Render routes */}
          <CoreAdminRoutes
            resources={resourcesArray}
            dashboard={dashboard}
            layout={layout}
          />
        </ResourceRegistrationContext.Provider>
      </ResourceDefinitionContextProvider>
    </CoreAdminContext>
  )
}
