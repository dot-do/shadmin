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
  type ComponentType,
  Children,
  isValidElement,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react'
import { HashRouter } from 'react-router-dom'
import { ResourceDefinitionContextProvider, NotificationContextProvider, type ResourceDefinitions } from '../../contexts'
import type { ResourceProps, ResourceDefinition, DataProvider } from '../../facade'
import type { AdminProps, AdminPluginContext } from '../../types'
import { CoreAdminContext } from './CoreAdminContext'
import { CoreAdminRoutes } from './CoreAdminRoutes'
import { ResourceRegistrationContext, type ResourceRegistrationContextValue } from './Resource'
import { ThemeProvider, type CustomTheme } from './ThemeProvider'
import { ErrorBoundary } from './ErrorBoundary'
import type { MenuItem } from './CoreAdminRoutes'

/**
 * Check if an element looks like a Resource component based on its props
 * This allows us to detect Resource components regardless of which package they come from
 * We check for 'name' prop plus at least one CRUD operation (list, edit, create, show)
 */
const isResourceElement = (element: ReactElement): element is ReactElement<ResourceProps> => {
  const props = element.props as Record<string, unknown>
  if (typeof props !== 'object' || props === null) {
    return false
  }
  // Must have a string name
  if (!('name' in props) || typeof props.name !== 'string') {
    return false
  }
  // Must have at least one CRUD operation
  const hasCrud = 'list' in props || 'edit' in props || 'create' in props || 'show' in props
  return hasCrud
}

/**
 * Extract Resource children and convert to ResourceProps[]
 * Uses props-based detection to work with Resource from any package (ra-core or shadmin)
 */
const extractResourceProps = (children: ReactNode): ResourceProps[] => {
  const resources: ResourceProps[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child) && isResourceElement(child)) {
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
  i18nProvider,
  queryClient,
  title,
  layout,
  dashboard,
  theme,
  darkTheme,
  basename = '',
  error,
  plugins = [],
}: AdminProps): ReactElement => {
  // Validate dataProvider is provided (runtime validation)
  if (!dataProvider) {
    throw new Error('Admin component requires a dataProvider prop')
  }

  // Note: i18nProvider, queryClient, and title are accepted for API compatibility
  // but may not be fully implemented yet
  void i18nProvider
  void queryClient
  void title

  // State to track registered resources
  const [registeredResources, setRegisteredResources] = useState<
    Map<string, { definition: ResourceDefinition; props: ResourceProps }>
  >(new Map())

  // State for plugin-added resources
  const [pluginResources, setPluginResources] = useState<ResourceProps[]>([])

  // State for plugin-added menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  // State for wrapped data provider
  const [wrappedDataProvider, setWrappedDataProvider] = useState<DataProvider>(dataProvider)

  // Ref to track cleanup functions from plugins
  const cleanupFunctionsRef = useRef<Array<() => void>>([])

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

  // Plugin system functions
  const addResource = useCallback((resource: { name: string; list?: ComponentType; edit?: ComponentType; create?: ComponentType; show?: ComponentType }) => {
    setPluginResources((prev) => {
      // Check if resource already exists
      if (prev.some(r => r.name === resource.name)) {
        return prev
      }
      return [...prev, resource as ResourceProps]
    })
  }, [])

  const addMenuItem = useCallback((item: { name: string; path: string; icon?: ReactNode }) => {
    setMenuItems((prev) => {
      // Check if menu item already exists
      if (prev.some(m => m.path === item.path)) {
        return prev
      }
      return [...prev, item]
    })
  }, [])

  const wrapDataProvider = useCallback((wrapper: (dp: DataProvider) => DataProvider) => {
    setWrappedDataProvider((prev: DataProvider) => wrapper(prev))
  }, [])

  const onUnmount = useCallback((cleanup: () => void) => {
    cleanupFunctionsRef.current.push(cleanup)
  }, [])

  // Install plugins
  useEffect(() => {
    const pluginContext: AdminPluginContext = {
      dataProvider,
      addResource,
      addMenuItem,
      wrapDataProvider,
      onUnmount,
    }

    // Install each plugin
    plugins.forEach((plugin) => {
      if (typeof plugin.install === 'function') {
        const cleanup = plugin.install(pluginContext)
        if (typeof cleanup === 'function') {
          cleanupFunctionsRef.current.push(cleanup)
        }
      }
    })

    // Return cleanup function
    return () => {
      cleanupFunctionsRef.current.forEach((cleanup) => cleanup())
      cleanupFunctionsRef.current = []
    }
  }, [plugins, dataProvider, addResource, addMenuItem, wrapDataProvider, onUnmount])

  // Call authProvider.checkAuth on mount when authProvider is provided
  useEffect(() => {
    if (authProvider?.checkAuth) {
      authProvider.checkAuth({}).catch(() => {
        // Silently handle auth check failures - redirect to login will be handled elsewhere
      })
    }
  }, [authProvider])

  // Convert registered resources to definitions object for context
  const resourceDefinitions: ResourceDefinitions = useMemo(() => {
    const definitions: ResourceDefinitions = {}
    registeredResources.forEach(({ definition }, name) => {
      definitions[name] = definition
    })
    // Add plugin resources
    pluginResources.forEach((resource) => {
      definitions[resource.name] = {
        name: resource.name,
        hasList: !!resource.list,
        hasEdit: !!resource.edit,
        hasShow: !!resource.show,
        hasCreate: !!resource.create,
      }
    })
    return definitions
  }, [registeredResources, pluginResources])

  // Get resources array for routing
  const resourcesArray: ResourceProps[] = useMemo(() => {
    // First try to extract from direct children
    const fromChildren = extractResourceProps(children)

    // Combine children resources with plugin resources
    const allResources = [
      ...fromChildren,
      ...pluginResources,
    ]

    if (allResources.length > 0) {
      return allResources
    }

    // Fall back to registered resources
    return Array.from(registeredResources.values()).map(({ props }) => props)
  }, [children, registeredResources, pluginResources])

  return (
    <HashRouter basename={basename}>
      <ThemeProvider theme={theme as CustomTheme} darkTheme={darkTheme as CustomTheme}>
        <NotificationContextProvider>
          <CoreAdminContext
            dataProvider={wrappedDataProvider}
            authProvider={authProvider}
            basename={basename}
          >
            <ResourceDefinitionContextProvider definitions={resourceDefinitions}>
              <ResourceRegistrationContext.Provider value={registrationValue}>
                <ErrorBoundary
                    fallbackRender={error ? ({ error: err, resetErrorBoundary }) => {
                      const ErrorComponent = error
                      return <ErrorComponent error={err} resetErrorBoundary={resetErrorBoundary} />
                    } : undefined}
                    id="admin-root"
                    showHomeButton
                    showRefreshButton
                  >
                  {/* CoreAdminRoutes provides layout and dashboard routing.
                      Resource children (from ra-core) handle their own resource routing. */}
                  <CoreAdminRoutes
                    resources={resourcesArray}
                    dashboard={dashboard}
                    layout={layout}
                    menuItems={menuItems}
                  >
                    {/* Resource children render inside CoreAdminRoutes' layout */}
                    {children}
                  </CoreAdminRoutes>
                </ErrorBoundary>
              </ResourceRegistrationContext.Provider>
            </ResourceDefinitionContextProvider>
          </CoreAdminContext>
        </NotificationContextProvider>
      </ThemeProvider>
    </HashRouter>
  )
}
