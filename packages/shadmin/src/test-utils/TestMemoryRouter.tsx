/**
 * Test Memory Router for routing in tests
 * Provides a lightweight router implementation for testing components that use routing
 */

import * as React from 'react'
import { createContext, useContext, useState, useCallback, useMemo } from 'react'

/**
 * Location object representing the current route
 */
export interface Location {
  pathname: string
  search: string
  hash: string
  state: unknown
  key: string
}

/**
 * Navigation options
 */
export interface NavigateOptions {
  replace?: boolean
  state?: unknown
}

/**
 * Router context value
 */
export interface RouterContextValue {
  location: Location
  navigate: (to: string, options?: NavigateOptions) => void
  goBack: () => void
  goForward: () => void
}

/**
 * Router context
 */
const RouterContext = createContext<RouterContextValue | null>(null)

/**
 * Hook to access router context
 */
export function useTestRouter(): RouterContextValue {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error('useTestRouter must be used within a TestMemoryRouter')
  }
  return context
}

/**
 * Hook to access current location
 */
export function useTestLocation(): Location {
  return useTestRouter().location
}

/**
 * Hook to access navigate function
 */
export function useTestNavigate(): (to: string, options?: NavigateOptions) => void {
  return useTestRouter().navigate
}

/**
 * Parse a URL string into location parts
 */
function parseUrl(url: string): Pick<Location, 'pathname' | 'search' | 'hash'> {
  const hashIndex = url.indexOf('#')
  const searchIndex = url.indexOf('?')

  let pathname = url
  let search = ''
  let hash = ''

  if (hashIndex !== -1) {
    hash = url.slice(hashIndex)
    pathname = url.slice(0, hashIndex)
  }

  if (searchIndex !== -1 && (hashIndex === -1 || searchIndex < hashIndex)) {
    search = pathname.slice(searchIndex, hashIndex !== -1 ? hashIndex : undefined)
    pathname = pathname.slice(0, searchIndex)
  }

  return { pathname: pathname || '/', search, hash }
}

/**
 * Generate a unique key for the location
 */
function generateKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Props for TestMemoryRouter
 */
export interface TestMemoryRouterProps {
  children: React.ReactNode
  /**
   * Initial route entries
   */
  initialEntries?: string[]
  /**
   * Initial index in the history stack
   */
  initialIndex?: number
  /**
   * Callback when navigation occurs
   */
  onNavigate?: (location: Location) => void
}

/**
 * Memory router for testing
 * Provides routing functionality without needing a browser environment
 *
 * @example
 * ```tsx
 * render(
 *   <TestMemoryRouter initialEntries={['/users/1']}>
 *     <UserDetail />
 *   </TestMemoryRouter>
 * )
 * ```
 */
export function TestMemoryRouter({
  children,
  initialEntries = ['/'],
  initialIndex,
  onNavigate,
}: TestMemoryRouterProps) {
  // Initialize history stack
  const [history, setHistory] = useState<Location[]>(() =>
    initialEntries.map((entry) => ({
      ...parseUrl(entry),
      state: null,
      key: generateKey(),
    }))
  )

  const [currentIndex, setCurrentIndex] = useState(
    initialIndex ?? Math.max(0, initialEntries.length - 1)
  )

  const location = history[currentIndex]!

  const navigate = useCallback(
    (to: string, options: NavigateOptions = {}) => {
      const newLocation: Location = {
        ...parseUrl(to),
        state: options.state ?? null,
        key: generateKey(),
      }

      setHistory((prev) => {
        if (options.replace) {
          const newHistory = [...prev]
          newHistory[currentIndex] = newLocation
          return newHistory
        } else {
          // Remove any forward history and add new entry
          return [...prev.slice(0, currentIndex + 1), newLocation]
        }
      })

      if (!options.replace) {
        setCurrentIndex((prev) => prev + 1)
      }

      onNavigate?.(newLocation)
    },
    [currentIndex, onNavigate]
  )

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      onNavigate?.(history[currentIndex - 1]!)
    }
  }, [currentIndex, history, onNavigate])

  const goForward = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      onNavigate?.(history[currentIndex + 1]!)
    }
  }, [currentIndex, history, onNavigate])

  const value = useMemo(
    () => ({
      location,
      navigate,
      goBack,
      goForward,
    }),
    [location, navigate, goBack, goForward]
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

/**
 * Route matching result
 */
export interface RouteMatch {
  params: Record<string, string>
  path: string
  pathname: string
}

/**
 * Match a pathname against a route pattern
 */
export function matchPath(pattern: string, pathname: string): RouteMatch | null {
  // Convert pattern to regex
  const paramNames: string[] = []
  const regexPattern = pattern
    .replace(/\/:([^/]+)/g, (_, paramName) => {
      paramNames.push(paramName as string)
      return '/([^/]+)'
    })
    .replace(/\//g, '\\/')

  const regex = new RegExp(`^${regexPattern}$`)
  const match = pathname.match(regex)

  if (!match) {
    return null
  }

  const params: Record<string, string> = {}
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1] ?? ''
  })

  return {
    params,
    path: pattern,
    pathname,
  }
}

/**
 * Props for Route component
 */
export interface RouteProps {
  path: string
  element: React.ReactNode
}

/**
 * Simple Route component for testing
 */
export function Route({ path, element }: RouteProps) {
  const { location } = useTestRouter()
  const match = matchPath(path, location.pathname)

  if (!match) {
    return null
  }

  return <>{element}</>
}

/**
 * Props for Routes component
 */
export interface RoutesProps {
  children: React.ReactNode
}

/**
 * Routes container that renders matching route
 */
export function Routes({ children }: RoutesProps) {
  const { location } = useTestRouter()

  const routes = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<RouteProps> =>
      React.isValidElement(child) && child.type === Route
  )

  for (const route of routes) {
    const match = matchPath(route.props.path, location.pathname)
    if (match) {
      return <>{route.props.element}</>
    }
  }

  return null
}

/**
 * Props for Link component
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  replace?: boolean
  state?: unknown
}

/**
 * Link component for testing
 */
export function Link({ to, replace, state, children, onClick, ...props }: LinkProps) {
  const { navigate } = useTestRouter()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onClick?.(event)
    navigate(to, { replace, state })
  }

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}

/**
 * Hook to get route params (mock implementation)
 */
export function useTestParams(): Record<string, string> {
  const { location } = useTestRouter()

  // This is a simplified implementation
  // In a real app, you'd get params from route matching
  const params: Record<string, string> = {}

  // Extract common param patterns from pathname
  const idMatch = location.pathname.match(/\/(\d+)(?:\/|$)/)
  if (idMatch) {
    params['id'] = idMatch[1]!
  }

  return params
}

/**
 * Hook to get search params
 */
export function useTestSearchParams(): [
  URLSearchParams,
  (params: URLSearchParams | Record<string, string>) => void,
] {
  const { location, navigate } = useTestRouter()

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])

  const setSearchParams = useCallback(
    (params: URLSearchParams | Record<string, string>) => {
      const newParams = params instanceof URLSearchParams ? params : new URLSearchParams(params)
      const search = newParams.toString()
      navigate(`${location.pathname}${search ? `?${search}` : ''}${location.hash}`, {
        replace: true,
      })
    },
    [location.pathname, location.hash, navigate]
  )

  return [searchParams, setSearchParams]
}
