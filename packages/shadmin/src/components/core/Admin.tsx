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
  type ErrorInfo,
  Component,
  Children,
  isValidElement,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react'
import { ResourceDefinitionContextProvider, NotificationContextProvider, type ResourceDefinitions } from '../../contexts'
import type { AdminProps, ResourceProps, ResourceDefinition, ErrorProps, DataProvider, AdminPluginContext } from '../../types'
import { CoreAdminContext } from './CoreAdminContext'
import { CoreAdminRoutes } from './CoreAdminRoutes'
import { Resource, ResourceRegistrationContext, type ResourceRegistrationContextValue } from './Resource'
import { ThemeProvider, type CustomTheme } from './ThemeProvider'

/**
 * Menu item added by plugins
 */
export interface MenuItem {
  name: string
  path: string
  icon?: ReactNode
}

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
 * Default error component shown when an error occurs
 */
const DefaultErrorComponent = ({ error, resetErrorBoundary }: ErrorProps) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Something went wrong</h1>
    <p>Error: {error.message}</p>
    {resetErrorBoundary && (
      <button onClick={resetErrorBoundary} style={{ marginTop: '10px' }}>
        Retry
      </button>
    )}
  </div>
)

/**
 * Error Boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary props
 */
interface ErrorBoundaryProps {
  children: ReactNode
  ErrorComponent: ComponentType<ErrorProps>
}

/**
 * Error Boundary class component
 * React error boundaries must be class components
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    // Log error with component stack
    console.error('Error caught by Admin error boundary:', error)
    console.error('Component stack:', errorInfo.componentStack)
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { children, ErrorComponent } = this.props

    if (hasError && error) {
      return (
        <ErrorComponent
          error={error}
          errorInfo={errorInfo ?? undefined}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      )
    }

    return children
  }
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
  error,
  plugins = [],
}: AdminProps): ReactElement => {
  // Validate dataProvider is provided (runtime validation)
  if (!dataProvider) {
    throw new Error('Admin component requires a dataProvider prop')
  }

  // Use custom error component or default
  const ErrorComponent = error ?? DefaultErrorComponent

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
    setWrappedDataProvider((prev) => wrapper(prev))
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
    <ThemeProvider theme={theme as CustomTheme} darkTheme={darkTheme as CustomTheme}>
      <NotificationContextProvider>
        <CoreAdminContext
          dataProvider={wrappedDataProvider}
          authProvider={authProvider}
          basename={basename}
        >
          <ResourceDefinitionContextProvider definitions={resourceDefinitions}>
            <ResourceRegistrationContext.Provider value={registrationValue}>
              <ErrorBoundary ErrorComponent={ErrorComponent}>
                {/* Render Resource children so they can register */}
                {children}
                {/* Render routes with plugin menu items */}
                <CoreAdminRoutes
                  resources={resourcesArray}
                  dashboard={dashboard}
                  layout={layout}
                  menuItems={menuItems}
                />
              </ErrorBoundary>
            </ResourceRegistrationContext.Provider>
          </ResourceDefinitionContextProvider>
        </CoreAdminContext>
      </NotificationContextProvider>
    </ThemeProvider>
  )
}
