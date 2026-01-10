/**
 * ListFilterContext - Split context for filter state
 *
 * This context allows components that only care about filtering
 * to subscribe to filter changes without re-rendering when
 * other list state (pagination, sort, selection) changes.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { FilterPayload } from '../types'
import type { ListControllerResult } from './ListContext'

/**
 * Context value for filter state
 */
export interface ListFilterContextValue {
  /** Current filter values */
  filterValues: FilterPayload
  /** Callback to change filters */
  setFilters: (filters: FilterPayload) => void
  /** Resource name */
  resource: string
}

/**
 * Context to store the filter part of the list controller result.
 *
 * Use the useListFilterContext() hook to read the context.
 * This allows components like <FilterForm> to re-render only when
 * filter-related values change.
 */
export const ListFilterContext = createContext<ListFilterContextValue | undefined>(undefined)

ListFilterContext.displayName = 'ListFilterContext'

/**
 * Props for ListFilterContextProvider
 */
export interface ListFilterContextProviderProps {
  value: Pick<ListControllerResult, 'filterValues' | 'setFilters' | 'resource'>
  children: ReactNode
}

/**
 * Pick filter-related values from the list controller result
 * and memoize them to prevent unnecessary re-renders
 */
export function usePickFilterContext(context: ListControllerResult): ListFilterContextValue {
  return useMemo(
    () => ({
      filterValues: context.filterValues,
      setFilters: context.setFilters,
      resource: context.resource,
    }),
    [context.filterValues, context.setFilters, context.resource]
  )
}

/**
 * Provider component for ListFilterContext.
 *
 * @example
 * ```tsx
 * <ListFilterContextProvider value={listControllerResult}>
 *   <FilterForm />
 * </ListFilterContextProvider>
 * ```
 */
export function ListFilterContextProvider({
  value,
  children,
}: ListFilterContextProviderProps) {
  const memoizedValue = useMemo<ListFilterContextValue>(
    () => ({
      filterValues: value.filterValues,
      setFilters: value.setFilters,
      resource: value.resource,
    }),
    [value.filterValues, value.setFilters, value.resource]
  )

  return (
    <ListFilterContext.Provider value={memoizedValue}>
      {children}
    </ListFilterContext.Provider>
  )
}

/**
 * Hook to access the filter context.
 * Throws an error if used outside of a ListFilterContextProvider.
 *
 * @example
 * ```tsx
 * const { filterValues, setFilters } = useListFilterContext()
 * ```
 */
export function useListFilterContext(): ListFilterContextValue {
  const context = useContext(ListFilterContext)
  if (context === undefined) {
    throw new Error(
      'useListFilterContext must be used inside a ListFilterContextProvider'
    )
  }
  return context
}

/**
 * Hook to optionally access the filter context (may return undefined)
 */
export function useListFilterContextOptional(): ListFilterContextValue | undefined {
  return useContext(ListFilterContext)
}
