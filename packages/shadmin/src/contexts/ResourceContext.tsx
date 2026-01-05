/**
 * ResourceContext
 * Provides the current resource name and definition
 * 100% API-compatible with react-admin
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ResourceDefinition } from '../types'

/**
 * ResourceContext provides just the resource name (string)
 * For the full resource definition, use ResourceDefinitionContext
 */
const ResourceContext = createContext<string | null>(null)

export interface ResourceContextProviderProps {
  children: ReactNode
  value: string
}

/**
 * Provider component for the current resource name
 */
export const ResourceContextProvider = ({
  children,
  value,
}: ResourceContextProviderProps) => {
  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  )
}

/**
 * Hook to get the current resource name
 * @throws Error if used outside of ResourceContext
 */
export const useResource = (): string => {
  const context = useContext(ResourceContext)
  if (context === null) {
    throw new Error('useResource must be used within a ResourceContextProvider')
  }
  return context
}

/**
 * Hook to optionally get the current resource name (may return null)
 */
export const useResourceOptional = (): string | null => {
  return useContext(ResourceContext)
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
  const context = useContext(ResourceContext)

  // If required and no value, throw
  if (options?.required && context === null) {
    throw new Error('useResourceContext must be used inside a ResourceContextProvider')
  }

  // Return context value or default
  return context ?? options?.defaultValue ?? undefined
}

export { ResourceContext }

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
