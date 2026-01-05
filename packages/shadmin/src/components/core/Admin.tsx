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
} from 'react'
import { ResourceDefinitionContextProvider, type ResourceDefinitions } from '../../contexts'
import type { AdminProps, ResourceProps, ResourceDefinition, LayoutProps, ErrorProps } from '../../types'
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
  title = 'Shadmin',
  disableTelemetry,
  loginPage,
  error,
  loading,
  notification,
  ready,
}: AdminProps): ReactElement => {
  // Use custom error component or default
  const ErrorComponent = error ?? DefaultErrorComponent

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
          <ErrorBoundary ErrorComponent={ErrorComponent}>
            {/* Render Resource children so they can register */}
            {children}
            {/* Render routes */}
            <CoreAdminRoutes
              resources={resourcesArray}
              dashboard={dashboard}
              layout={layout}
            />
          </ErrorBoundary>
        </ResourceRegistrationContext.Provider>
      </ResourceDefinitionContextProvider>
    </CoreAdminContext>
  )
}
