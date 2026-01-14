/**
 * ListSortContext - Split context for sort state
 *
 * This context allows components that only care about sorting
 * to subscribe to sort changes without re-rendering when
 * other list state (pagination, filter, selection) changes.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'

import type { SortPayload } from '../types'
import type { ListControllerResult } from './ListContext'

/**
 * Context value for sort state
 */
export interface ListSortContextValue {
  /** Current sort configuration */
  sort: SortPayload
  /** Callback to change sort order */
  setSort: (sort: SortPayload) => void
  /** Resource name */
  resource: string
}

/**
 * Context to store the sort part of the list controller result.
 *
 * Use the useListSortContext() hook to read the context.
 * This allows components like <SortButton> to re-render only when
 * sort-related values change.
 */
export const ListSortContext = createContext<ListSortContextValue | undefined>(undefined)

ListSortContext.displayName = 'ListSortContext'

/**
 * Props for ListSortContextProvider
 */
export interface ListSortContextProviderProps {
  value: Pick<ListControllerResult, 'sort' | 'setSort' | 'resource'>
  children: ReactNode
}

/**
 * Pick sort-related values from the list controller result
 * and memoize them to prevent unnecessary re-renders
 */
export function usePickSortContext(context: ListControllerResult): ListSortContextValue {
  return useMemo(
    () => ({
      sort: context.sort,
      setSort: context.setSort,
      resource: context.resource,
    }),
    [context.sort, context.setSort, context.resource]
  )
}

/**
 * Provider component for ListSortContext.
 *
 * @example
 * ```tsx
 * <ListSortContextProvider value={listControllerResult}>
 *   <SortButton />
 * </ListSortContextProvider>
 * ```
 */
export function ListSortContextProvider({
  value,
  children,
}: ListSortContextProviderProps) {
  const memoizedValue = useMemo<ListSortContextValue>(
    () => ({
      sort: value.sort,
      setSort: value.setSort,
      resource: value.resource,
    }),
    [value.sort, value.setSort, value.resource]
  )

  return (
    <ListSortContext.Provider value={memoizedValue}>
      {children}
    </ListSortContext.Provider>
  )
}

/**
 * Hook to access the sort context.
 * Throws an error if used outside of a ListSortContextProvider.
 *
 * @example
 * ```tsx
 * const { sort, setSort } = useListSortContext()
 * ```
 */
export function useListSortContext(): ListSortContextValue {
  const context = useContext(ListSortContext)
  if (context === undefined) {
    throw new Error(
      'useListSortContext must be used inside a ListSortContextProvider'
    )
  }
  return context
}

/**
 * Hook to optionally access the sort context (may return undefined)
 */
export function useListSortContextOptional(): ListSortContextValue | undefined {
  return useContext(ListSortContext)
}
