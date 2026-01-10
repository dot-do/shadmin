import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type {
  RaRecord,
  Identifier,
  SortPayload,
  FilterPayload,
} from '../types'

// Re-export types for backward compatibility
export type { Identifier, SortPayload, SortOrder, FilterPayload } from '../types'

/**
 * Result type for the list controller containing all list state and callbacks.
 *
 * @template T - The record type for this list, defaults to RaRecord
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
 *
 * Note: The context uses the base RaRecord type. Type narrowing is done
 * in useListContext through a type assertion, which is safe because
 * the provider ensures the correct type is passed.
 */
export const ListContext = createContext<ListControllerResult<RaRecord> | undefined>(undefined)

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
  // Memoize the value to prevent unnecessary re-renders when parent re-renders
  // but the list state hasn't actually changed
  const memoizedValue = useMemo(
    () => value,
    [
      value.data,
      value.total,
      value.isLoading,
      value.isFetching,
      value.error,
      value.page,
      value.perPage,
      value.sort,
      value.filterValues,
      value.selectedIds,
      value.resource,
      value.setPage,
      value.setPerPage,
      value.setSort,
      value.setFilters,
      value.onSelect,
      value.onToggleItem,
      value.onUnselectItems,
      value.refetch,
    ]
  )

  return (
    <ListContext.Provider value={memoizedValue as ListControllerResult<RaRecord>}>
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
