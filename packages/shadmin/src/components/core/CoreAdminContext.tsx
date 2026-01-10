/**
 * CoreAdminContext
 * Internal component that orchestrates all providers
 * Provides QueryClient, DataProvider, AuthProvider, and ResourceDefinitions
 */

import { type ReactNode, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  DataProviderContextProvider,
  AuthProviderContextProvider,
  ResourceDefinitionContextProvider,
  type ResourceDefinitions,
} from '../../contexts'
import type { DataProvider } from '../../types'
import type { AuthProvider } from 'ra-core'

export interface CoreAdminContextProps {
  children: ReactNode
  dataProvider: DataProvider
  authProvider?: AuthProvider | undefined
  basename?: string | undefined
}

/**
 * CoreAdminContext component
 * Wraps children with all necessary context providers
 */
export const CoreAdminContext = ({
  children,
  dataProvider,
  authProvider,
  basename: _basename,
}: CoreAdminContextProps) => {
  // Create QueryClient with sensible defaults
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  // Resource definitions will be populated by Resource components
  const [resourceDefinitions] = useState<ResourceDefinitions>({})

  // Wrap with all providers
  const content = useMemo(() => {
    let result = (
      <ResourceDefinitionContextProvider definitions={resourceDefinitions}>
        {children}
      </ResourceDefinitionContextProvider>
    )

    // Conditionally wrap with AuthProvider
    if (authProvider) {
      result = (
        <AuthProviderContextProvider authProvider={authProvider}>
          {result}
        </AuthProviderContextProvider>
      )
    }

    return result
  }, [children, authProvider, resourceDefinitions])

  return (
    <QueryClientProvider client={queryClient}>
      <DataProviderContextProvider dataProvider={dataProvider}>
        {content}
      </DataProviderContextProvider>
    </QueryClientProvider>
  )
}
