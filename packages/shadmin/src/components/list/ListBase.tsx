/**
 * ListBase Component
 * Core list logic without UI wrapper - provides ListContext to children
 * 100% API-compatible with react-admin ListBase
 *
 * Epic: shadmin-ha1 (P1)
 */

import { type ReactNode, useCallback, useMemo, useState } from 'react'

import { PAGINATION_DEFAULTS } from '../../constants'
import { ListContextProvider, type FilterPayload, type Identifier } from '../../contexts/ListContext'
import { ResourceContextProvider, useResourceContext } from '../../contexts/ResourceContext'
import { useGetList, type UseGetListOptions } from '../../hooks/useGetList'
import { useListParams } from '../../hooks/useListParams'

/**
 * Props for ListBase component
 */
export interface ListBaseProps<RecordType extends { id: Identifier } = { id: Identifier }> {
  /** The name of the resource to fetch. If not provided, uses ResourceContext */
  resource?: string | undefined
  /** Child elements to render inside the ListContext */
  children: ReactNode
  /** Number of records per page. Defaults to 10 */
  perPage?: number | undefined
  /** Default sort configuration */
  sort?: { field: string; order: 'ASC' | 'DESC' } | undefined
  /** Permanent filter (always applied, cannot be changed by user) */
  filter?: FilterPayload | undefined
  /** Default filter values (can be changed by user) */
  filterDefaultValues?: FilterPayload | undefined
  /** If true, don't sync list parameters with URL */
  disableSyncWithLocation?: boolean | undefined
  /** React Query options to pass to useGetList */
  queryOptions?: UseGetListOptions<RecordType> | undefined
  /** Custom store key for URL params (for multiple lists on same page) */
  storeKey?: string | undefined
}

/**
 * ListBase - Core list component that provides ListContext without UI wrapper
 *
 * Use this component when you want to create a custom list UI while reusing
 * the list logic (pagination, sorting, filtering, data fetching).
 *
 * @example
 * ```tsx
 * // Basic usage with custom UI
 * <ListBase resource="posts">
 *   <MyCustomListUI />
 * </ListBase>
 *
 * // With initial configuration
 * <ListBase
 *   resource="posts"
 *   perPage={25}
 *   sort={{ field: 'createdAt', order: 'DESC' }}
 *   filter={{ published: true }}
 * >
 *   <MyCustomListUI />
 * </ListBase>
 * ```
 */
export function ListBase<RecordType extends { id: Identifier } = { id: Identifier }>({
  resource: resourceProp,
  children,
  perPage: defaultPerPage = PAGINATION_DEFAULTS.PER_PAGE,
  sort: defaultSort,
  filter: permanentFilter = {},
  filterDefaultValues = {},
  disableSyncWithLocation = false,
  queryOptions,
  storeKey,
}: ListBaseProps<RecordType>) {
  // Get resource from context if not provided
  const resourceFromContext = useResourceContext()
  const resource = resourceProp ?? resourceFromContext ?? ''

  if (!resource) {
    throw new Error('ListBase requires a resource prop or must be used inside a ResourceContextProvider')
  }

  // Use the useListParams hook for URL synchronization
  const {
    page,
    perPage,
    sort,
    filterValues,
    setPage,
    setPerPage,
    setSort,
    setFilters,
  } = useListParams({
    resource,
    storeKey,
    perPage: defaultPerPage,
    sort: defaultSort,
    filterDefaultValues,
    disableSyncWithLocation,
  })

  // Selection state (not synced with URL)
  const [selectedIds, setSelectedIds] = useState<Identifier[]>([])

  // Combine permanent filter with user filters
  const combinedFilter = useMemo(
    () => ({ ...permanentFilter, ...filterValues }),
    [permanentFilter, filterValues]
  )

  // Fetch data using useGetList
  const {
    data,
    total,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetList<RecordType>(
    resource,
    {
      pagination: { page, perPage },
      sort,
      filter: combinedFilter,
    },
    queryOptions
  )

  // Selection callbacks
  const onSelect = useCallback((ids: Identifier[]) => {
    setSelectedIds(ids)
  }, [])

  const onToggleItem = useCallback((id: Identifier) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      return [...prev, id]
    })
  }, [])

  const onUnselectItems = useCallback(() => {
    setSelectedIds([])
  }, [])

  // Build context value
  const contextValue = useMemo(
    () => ({
      data,
      total,
      isLoading,
      isFetching,
      error,
      page,
      perPage,
      sort,
      filterValues,
      selectedIds,
      resource,
      setPage,
      setPerPage,
      setSort,
      setFilters,
      onSelect,
      onToggleItem,
      onUnselectItems,
      refetch,
    }),
    [
      data,
      total,
      isLoading,
      isFetching,
      error,
      page,
      perPage,
      sort,
      filterValues,
      selectedIds,
      resource,
      setPage,
      setPerPage,
      setSort,
      setFilters,
      onSelect,
      onToggleItem,
      onUnselectItems,
      refetch,
    ]
  )

  // Wrap with ResourceContext if resource prop was provided
  const content = (
    <ListContextProvider value={contextValue}>
      {children}
    </ListContextProvider>
  )

  if (resourceProp) {
    return (
      <ResourceContextProvider value={resourceProp}>
        {content}
      </ResourceContextProvider>
    )
  }

  return content
}

export default ListBase
