import { createContext, useContext, type ReactNode } from 'react'
import type { RaRecord, Identifier } from '../types'

// Re-export Identifier from types for backward compatibility
export type { Identifier } from '../types'

/**
 * Sort order type
 */
export type SortOrder = 'ASC' | 'DESC'

/**
 * Sort configuration for list queries
 */
export interface SortPayload {
  field: string
  order: SortOrder
}

/**
 * Filter values type - key-value pairs for filtering
 */
export type FilterPayload = Record<string, unknown>

/**
 * Result type for the list controller containing all list state and callbacks
 */
export interface ListControllerResult<T extends RaRecord = RaRecord> {
  /** The list of records */
  data: T[] | undefined
  /** Total number of records matching the filter */
  total: number | undefined
  /** Whether the data is currently loading */
  isLoading: boolean
  /** Whether a background refetch is in progress */
  isFetching: boolean
  /** Error if the query failed */
  error: Error | null
  /** Current page number (1-indexed) */
  page: number
  /** Number of records per page */
  perPage: number
  /** Current sort configuration */
  sort: SortPayload
  /** Current filter values */
  filterValues: FilterPayload
  /** IDs of currently selected records */
  selectedIds: Identifier[]
  /** Resource name */
  resource: string
  /** Callback to change the current page */
  setPage: (page: number) => void
  /** Callback to change items per page */
  setPerPage: (perPage: number) => void
  /** Callback to change sort order */
  setSort: (sort: SortPayload) => void
  /** Callback to change filters */
  setFilters: (filters: FilterPayload) => void
  /** Callback to select records by IDs */
  onSelect: (ids: Identifier[]) => void
  /** Callback to toggle selection of a single record */
  onToggleItem: (id: Identifier) => void
  /** Callback to unselect all records */
  onUnselectItems: () => void
  /** Callback to refetch the data */
  refetch: () => void
}

/**
 * Context to store list controller state and callbacks.
 * Used by List components to share list state with children.
 */
export const ListContext = createContext<ListControllerResult | undefined>(undefined)

ListContext.displayName = 'ListContext'

/**
 * Props for ListContextProvider
 */
export interface ListContextProviderProps<T extends RaRecord = RaRecord> {
  value: ListControllerResult<T>
  children: ReactNode
}

/**
 * Provider component for ListContext.
 * Wraps children with the list controller state.
 *
 * @example
 * ```tsx
 * <ListContextProvider value={listControllerResult}>
 *   <Datagrid />
 * </ListContextProvider>
 * ```
 */
export function ListContextProvider<T extends RaRecord = RaRecord>({
  value,
  children,
}: ListContextProviderProps<T>) {
  return (
    <ListContext.Provider value={value as ListControllerResult}>
      {children}
    </ListContext.Provider>
  )
}

/**
 * Hook to access the list controller from ListContext.
 * Throws an error if used outside of a ListContextProvider.
 *
 * @example
 * ```tsx
 * const { data, total, isLoading, page, perPage, sort, filterValues } = useListContext<MyType>()
 * ```
 */
export function useListContext<T extends RaRecord = RaRecord>(): ListControllerResult<T> {
  const context = useContext(ListContext)
  if (context === undefined) {
    throw new Error('useListContext must be used inside a ListContextProvider')
  }
  return context as ListControllerResult<T>
}
