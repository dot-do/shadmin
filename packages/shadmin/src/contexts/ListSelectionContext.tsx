/**
 * ListSelectionContext - Split context for selection state
 *
 * This context allows components that only care about selection
 * to subscribe to selection changes without re-rendering when
 * other list state (pagination, sort, filter) changes.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Identifier } from '../types'
import type { ListControllerResult } from './ListContext'

/**
 * Context value for selection state
 */
export interface ListSelectionContextValue {
  /** IDs of currently selected records */
  selectedIds: Identifier[]
  /** Callback to select records by IDs */
  onSelect: (ids: Identifier[]) => void
  /** Callback to toggle selection of a single record */
  onToggleItem: (id: Identifier) => void
  /** Callback to unselect all records */
  onUnselectItems: () => void
  /** Resource name */
  resource: string
}

/**
 * Context to store the selection part of the list controller result.
 *
 * Use the useListSelectionContext() hook to read the context.
 * This allows components like <BulkActions> to re-render only when
 * selection-related values change.
 */
export const ListSelectionContext = createContext<ListSelectionContextValue | undefined>(undefined)

ListSelectionContext.displayName = 'ListSelectionContext'

/**
 * Props for ListSelectionContextProvider
 */
export interface ListSelectionContextProviderProps {
  value: Pick<
    ListControllerResult,
    'selectedIds' | 'onSelect' | 'onToggleItem' | 'onUnselectItems' | 'resource'
  >
  children: ReactNode
}

/**
 * Pick selection-related values from the list controller result
 * and memoize them to prevent unnecessary re-renders
 */
export function usePickSelectionContext(
  context: ListControllerResult
): ListSelectionContextValue {
  return useMemo(
    () => ({
      selectedIds: context.selectedIds,
      onSelect: context.onSelect,
      onToggleItem: context.onToggleItem,
      onUnselectItems: context.onUnselectItems,
      resource: context.resource,
    }),
    [
      context.selectedIds,
      context.onSelect,
      context.onToggleItem,
      context.onUnselectItems,
      context.resource,
    ]
  )
}

/**
 * Provider component for ListSelectionContext.
 *
 * @example
 * ```tsx
 * <ListSelectionContextProvider value={listControllerResult}>
 *   <BulkActions />
 * </ListSelectionContextProvider>
 * ```
 */
export function ListSelectionContextProvider({
  value,
  children,
}: ListSelectionContextProviderProps) {
  const memoizedValue = useMemo<ListSelectionContextValue>(
    () => ({
      selectedIds: value.selectedIds,
      onSelect: value.onSelect,
      onToggleItem: value.onToggleItem,
      onUnselectItems: value.onUnselectItems,
      resource: value.resource,
    }),
    [
      value.selectedIds,
      value.onSelect,
      value.onToggleItem,
      value.onUnselectItems,
      value.resource,
    ]
  )

  return (
    <ListSelectionContext.Provider value={memoizedValue}>
      {children}
    </ListSelectionContext.Provider>
  )
}

/**
 * Hook to access the selection context.
 * Throws an error if used outside of a ListSelectionContextProvider.
 *
 * @example
 * ```tsx
 * const { selectedIds, onSelect, onToggleItem, onUnselectItems } = useListSelectionContext()
 * ```
 */
export function useListSelectionContext(): ListSelectionContextValue {
  const context = useContext(ListSelectionContext)
  if (context === undefined) {
    throw new Error(
      'useListSelectionContext must be used inside a ListSelectionContextProvider'
    )
  }
  return context
}

/**
 * Hook to optionally access the selection context (may return undefined)
 */
export function useListSelectionContextOptional(): ListSelectionContextValue | undefined {
  return useContext(ListSelectionContext)
}
