/**
 * CoreAdminContext
 * Internal component that orchestrates all providers
 * Provides QueryClient, DataProvider, AuthProvider, and ResourceDefinitions
 *
 * Performance Optimizations:
 * 1. QueryClient is separated into its own context to prevent re-renders
 *    when DataProvider changes
 * 2. Each provider layer is memoized independently
 * 3. Children are passed through without re-creating provider tree
 */

import { type ReactNode, useMemo, useState, memo } from 'react'

import {
  QueryClientContextProvider,
  DataProviderContextProvider,
  AuthProviderContextProvider,
  ResourceDefinitionContextProvider,
  type ResourceDefinitions,
} from '../../contexts'

import type { DataProvider, AuthProvider } from '../../facade'

export interface CoreAdminContextProps {
  children: ReactNode
  dataProvider: DataProvider
  authProvider?: AuthProvider | undefined
  basename?: string | undefined
}

/**
 * Inner provider that wraps DataProvider and AuthProvider.
 * Memoized to prevent re-renders when QueryClient changes.
 */
const DataAndAuthProviders = memo(function DataAndAuthProviders({
  children,
  dataProvider,
  authProvider,
}: {
  children: ReactNode
  dataProvider: DataProvider
  authProvider?: AuthProvider | undefined
}) {
  // If authProvider is provided, wrap with it
  if (authProvider) {
    return (
      <DataProviderContextProvider dataProvider={dataProvider}>
        <AuthProviderContextProvider authProvider={authProvider}>
          {children}
        </AuthProviderContextProvider>
      </DataProviderContextProvider>
    )
  }

  // Without authProvider, just wrap with DataProvider
  return (
    <DataProviderContextProvider dataProvider={dataProvider}>
      {children}
    </DataProviderContextProvider>
  )
})

/**
 * Resource definitions provider.
 * Memoized to prevent re-renders from parent context changes.
 */
const ResourceDefinitionsProvider = memo(function ResourceDefinitionsProvider({
  children,
  definitions,
}: {
  children: ReactNode
  definitions: ResourceDefinitions
}) {
  return (
    <ResourceDefinitionContextProvider definitions={definitions}>
      {children}
    </ResourceDefinitionContextProvider>
  )
})

/**
 * CoreAdminContext component
 * Wraps children with all necessary context providers.
 *
 * Provider hierarchy (optimized for minimal re-renders):
 * 1. QueryClientContextProvider - Stable, rarely changes
 * 2. DataProviderContextProvider - Changes only when dataProvider changes
 * 3. AuthProviderContextProvider (optional) - Changes only when authProvider changes
 * 4. ResourceDefinitionContextProvider - Populated by Resource components
 *
 * By splitting into memoized sub-components, a change in one provider
 * (e.g., DataProvider) won't cause all children to unmount/remount.
 */
export const CoreAdminContext = ({
  children,
  dataProvider,
  authProvider,
  basename: _basename,
}: CoreAdminContextProps) => {
  // Resource definitions will be populated by Resource components
  // Using useState ensures stable reference across renders
  const [resourceDefinitions] = useState<ResourceDefinitions>({})

  // Memoize the resource definitions value to prevent unnecessary re-renders
  const memoizedResourceDefinitions = useMemo(
    () => resourceDefinitions,
    [resourceDefinitions]
  )

  return (
    <QueryClientContextProvider>
      <DataAndAuthProviders dataProvider={dataProvider} authProvider={authProvider}>
        <ResourceDefinitionsProvider definitions={memoizedResourceDefinitions}>
          {children}
        </ResourceDefinitionsProvider>
      </DataAndAuthProviders>
    </QueryClientContextProvider>
  )
}
