/**
 * ResourceContext
 * Re-exports ra-core's ResourceContext for compatibility
 *
 * IMPORTANT: We use ra-core's ResourceContext instead of creating our own
 * because ra-core's Resource component provides its own ResourceContextProvider.
 * By using the same context, shadmin components can read values provided by ra-core.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'

import {
  ResourceContext as RaCoreResourceContext,
  ResourceContextProvider as RaCoreResourceContextProvider,
  useResourceContext as useRaCoreResourceContext,
} from '../facade'

import type { ResourceDefinition } from '../types'

// Re-export ra-core's ResourceContext as our own
export const ResourceContext = RaCoreResourceContext

export interface ResourceContextProviderProps {
  children: ReactNode
  value: string
}

/**
 * Provider component for the current resource name
 * Wraps ra-core's ResourceContextProvider
 */
export const ResourceContextProvider = ({
  children,
  value,
}: ResourceContextProviderProps) => {
  return (
    <RaCoreResourceContextProvider value={value}>
      {children}
    </RaCoreResourceContextProvider>
  )
}

/**
 * Hook to get the current resource name
 * @throws Error if used outside of ResourceContext
 */
export const useResource = (): string => {
  const context = useRaCoreResourceContext()
  if (context === undefined) {
    throw new Error('useResource must be used within a ResourceContextProvider')
  }
  return context
}

/**
 * Hook to optionally get the current resource name (may return null)
 */
export const useResourceOptional = (): string | null => {
  const context = useRaCoreResourceContext()
  return context ?? null
}

/**
 * Options for useResourceContext hook
 */
export interface UseResourceContextOptions {
  /** Whether to throw if used outside provider */
  required?: boolean
  /** Default value to use if not in a provider */
  defaultValue?: string
}

/**
 * Hook to access the current resource name from ResourceContext.
 * This is the main hook, matching react-admin API.
 * Returns undefined if used outside of a ResourceContextProvider unless a default is provided.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const resource = useResourceContext()
 *
 * // With default value
 * const resource = useResourceContext({ defaultValue: 'users' })
 *
 * // Throw if not in provider
 * const resource = useResourceContext({ required: true })
 * ```
 */
export function useResourceContext(options?: UseResourceContextOptions): string | undefined {
  // Use ra-core's hook directly - it returns string | undefined
  const context = useRaCoreResourceContext()

  // If required and no value, throw
  if (options?.required && context === undefined) {
    throw new Error('useResourceContext must be used inside a ResourceContextProvider')
  }

  // Return context value or default
  return context ?? options?.defaultValue
}

/**
 * ResourceDefinitionContext
 * Stores all registered resource definitions
 */
export interface ResourceDefinitions {
  [name: string]: ResourceDefinition
}

const ResourceDefinitionContext = createContext<ResourceDefinitions>({})

export interface ResourceDefinitionContextProviderProps {
  children: ReactNode
  definitions: ResourceDefinitions
}

export const ResourceDefinitionContextProvider = ({
  children,
  definitions,
}: ResourceDefinitionContextProviderProps) => {
  const memoizedDefinitions = useMemo(() => definitions, [definitions])
  return (
    <ResourceDefinitionContext.Provider value={memoizedDefinitions}>
      {children}
    </ResourceDefinitionContext.Provider>
  )
}

/**
 * Hook to get all resource definitions
 */
export const useResourceDefinitions = (): ResourceDefinitions => {
  return useContext(ResourceDefinitionContext)
}

/**
 * Hook to get a specific resource definition by name
 */
export const useResourceDefinition = (name?: string): ResourceDefinition | undefined => {
  const definitions = useResourceDefinitions()
  const currentResource = useResourceOptional()
  const resourceName = name ?? currentResource
  return resourceName ? definitions[resourceName] : undefined
}

export { ResourceDefinitionContext }
