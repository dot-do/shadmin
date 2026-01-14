/**
 * QueryClientContext - Provides React Query's QueryClient separately
 *
 * By separating QueryClient into its own context, components that only need
 * the QueryClient (for direct query/mutation operations) won't re-render
 * when DataProvider or AuthProvider changes.
 *
 * This prevents cascading re-renders from the DataProvider changing.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'

import { QUERY_DEFAULTS } from '../constants'

/**
 * Default options for the QueryClient
 */
export const DEFAULT_QUERY_CLIENT_OPTIONS = {
  defaultOptions: {
    queries: {
      staleTime: QUERY_DEFAULTS.STALE_TIME,
      retry: QUERY_DEFAULTS.RETRY_COUNT,
      refetchOnWindowFocus: QUERY_DEFAULTS.REFETCH_ON_WINDOW_FOCUS,
    },
  },
} as const

/**
 * Context for accessing the QueryClient instance directly
 * This allows components to access the client without going through
 * React Query's useQueryClient hook
 */
const QueryClientInstanceContext = createContext<QueryClient | null>(null)

QueryClientInstanceContext.displayName = 'QueryClientInstanceContext'

export interface QueryClientContextProviderProps {
  children: ReactNode
  /**
   * Optional custom QueryClient instance.
   * If not provided, a default one will be created.
   */
  queryClient?: QueryClient
}

/**
 * Provider component that creates and manages the QueryClient.
 *
 * This provider:
 * 1. Creates a stable QueryClient instance (or uses provided one)
 * 2. Wraps with React Query's QueryClientProvider
 * 3. Exposes the client via our own context for direct access
 *
 * @example
 * ```tsx
 * // With default client
 * <QueryClientContextProvider>
 *   <App />
 * </QueryClientContextProvider>
 *
 * // With custom client
 * const myClient = new QueryClient({ ... })
 * <QueryClientContextProvider queryClient={myClient}>
 *   <App />
 * </QueryClientContextProvider>
 * ```
 */
export function QueryClientContextProvider({
  children,
  queryClient: providedQueryClient,
}: QueryClientContextProviderProps) {
  // Create a stable QueryClient instance using useState to ensure
  // it's created only once and persists across re-renders
  const [defaultQueryClient] = useState(() => new QueryClient(DEFAULT_QUERY_CLIENT_OPTIONS))

  // Use provided client or our default
  const queryClient = providedQueryClient ?? defaultQueryClient

  // Memoize the context value to prevent unnecessary re-renders
  // The queryClient reference is stable, so this is effectively constant
  const contextValue = useMemo(() => queryClient, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      <QueryClientInstanceContext.Provider value={contextValue}>
        {children}
      </QueryClientInstanceContext.Provider>
    </QueryClientProvider>
  )
}

/**
 * Hook to access the QueryClient instance directly.
 *
 * This is useful when you need to perform imperative operations
 * like invalidating queries or prefetching.
 *
 * @throws Error if used outside of QueryClientContextProvider
 *
 * @example
 * ```tsx
 * const queryClient = useQueryClientInstance()
 * queryClient.invalidateQueries({ queryKey: ['users'] })
 * ```
 */
export function useQueryClientInstance(): QueryClient {
  const context = useContext(QueryClientInstanceContext)
  if (context === null) {
    throw new Error('useQueryClientInstance must be used within a QueryClientContextProvider')
  }
  return context
}

/**
 * Hook to optionally access the QueryClient instance (may return null)
 * Useful when the hook might be called outside of the provider
 */
export function useQueryClientInstanceOptional(): QueryClient | null {
  return useContext(QueryClientInstanceContext)
}

export { QueryClientInstanceContext }
