/**
 * InfiniteList Component
 * List component with infinite scroll loading instead of pagination
 * API-compatible with react-admin InfiniteList
 *
 * Epic: shadmin-ha1 (P1)
 */

import {
  type ReactNode,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react'
import { ListContextProvider, type FilterPayload, type Identifier } from '../../contexts/ListContext'
import { ResourceContextProvider, useResourceContext } from '../../contexts/ResourceContext'
import { useGetList, type UseGetListOptions } from '../../hooks/useGetList'
import { useListParams } from '../../hooks/useListParams'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

/**
 * Props for InfiniteListBase component
 */
export interface InfiniteListBaseProps<RecordType extends { id: Identifier } = { id: Identifier }> {
  /** The name of the resource to fetch. If not provided, uses ResourceContext */
  resource?: string
  /** Child elements to render inside the ListContext */
  children: ReactNode
  /** Number of records per page. Defaults to 10 */
  perPage?: number
  /** Default sort configuration */
  sort?: { field: string; order: 'ASC' | 'DESC' }
  /** Permanent filter (always applied, cannot be changed by user) */
  filter?: FilterPayload
  /** Default filter values (can be changed by user) */
  filterDefaultValues?: FilterPayload
  /** If true, don't sync list parameters with URL */
  disableSyncWithLocation?: boolean
  /** React Query options to pass to useGetList */
  queryOptions?: UseGetListOptions<RecordType>
  /** Custom store key for URL params (for multiple lists on same page) */
  storeKey?: string
}

/**
 * InfiniteListBase - Core infinite list component that provides ListContext
 */
export function InfiniteListBase<RecordType extends { id: Identifier } = { id: Identifier }>({
  resource: resourceProp,
  children,
  perPage: defaultPerPage = 10,
  sort: defaultSort,
  filter: permanentFilter = {},
  filterDefaultValues = {},
  disableSyncWithLocation = false,
  queryOptions,
  storeKey,
}: InfiniteListBaseProps<RecordType>) {
  // Get resource from context if not provided
  const resourceFromContext = useResourceContext()
  const resource = resourceProp ?? resourceFromContext ?? ''

  if (!resource) {
    throw new Error('InfiniteListBase requires a resource prop or must be used inside a ResourceContextProvider')
  }

  // Track all accumulated data across pages
  const [allData, setAllData] = useState<RecordType[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Use the useListParams hook for URL synchronization
  const {
    page: _page,
    perPage,
    sort,
    filterValues,
    setPage: _setPage,
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

  // Combine permanent filter with user filters
  const combinedFilter = useMemo(
    () => ({ ...permanentFilter, ...filterValues }),
    [permanentFilter, filterValues]
  )

  // Fetch data for current page
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
      pagination: { page: currentPage, perPage },
      sort,
      filter: combinedFilter,
    },
    queryOptions
  )

  // Accumulate data when new page loads
  useEffect(() => {
    if (data && data.length > 0) {
      if (currentPage === 1) {
        setAllData(data)
      } else {
        setAllData((prev) => {
          // Avoid duplicates by checking IDs
          const existingIds = new Set(prev.map((item) => item.id))
          const newItems = data.filter((item) => !existingIds.has(item.id))
          return [...prev, ...newItems]
        })
      }
    }
  }, [data, currentPage])

  // Reset when filters/sort change
  useEffect(() => {
    setCurrentPage(1)
    setAllData([])
  }, [combinedFilter, sort])

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Identifier[]>([])

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

  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    if (!isFetching && total && allData.length < total) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [isFetching, total, allData.length])

  // Check if there's more data to load
  const hasMore = total ? allData.length < total : false

  // Build context value
  const contextValue = useMemo(
    () => ({
      data: allData,
      total,
      isLoading: isLoading && currentPage === 1,
      isFetching,
      error,
      page: currentPage,
      perPage,
      sort,
      filterValues,
      selectedIds,
      resource,
      setPage: setCurrentPage,
      setPerPage,
      setSort,
      setFilters,
      onSelect,
      onToggleItem,
      onUnselectItems,
      refetch,
      // Extra infinite scroll properties
      loadMore,
      hasMore,
    }),
    [
      allData,
      total,
      isLoading,
      isFetching,
      error,
      currentPage,
      perPage,
      sort,
      filterValues,
      selectedIds,
      resource,
      setPerPage,
      setSort,
      setFilters,
      onSelect,
      onToggleItem,
      onUnselectItems,
      refetch,
      loadMore,
      hasMore,
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

/**
 * Props for InfiniteListView component
 */
export interface InfiniteListViewProps {
  /** Child elements to render inside the list container */
  children: ReactNode
  /** Title to display in the list header */
  title?: ReactNode
  /** Custom actions component (e.g., Create button) */
  actions?: ReactElement | ReactElement[] | false | undefined
  /** Filters component for the list */
  filters?: ReactElement | ReactElement[] | undefined
  /** Component to display when the list is empty */
  empty?: ReactElement | undefined
  /** Additional CSS class name */
  className?: string | undefined
  /** Aside content (e.g., bulk action buttons) */
  aside?: ReactElement | undefined
}

/**
 * InfiniteListView - UI wrapper for infinite list display
 */
export function InfiniteListView({
  children,
  title,
  actions,
  filters,
  empty,
  className,
  aside,
}: InfiniteListViewProps) {
  // Import list context with infinite scroll helpers
  const listContext = useListContext()
  const { data, isLoading, total, isFetching } = listContext
  const loadMore = (listContext as { loadMore?: () => void }).loadMore
  const hasMore = (listContext as { hasMore?: boolean }).hasMore

  // Set up intersection observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && loadMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isFetching, loadMore])

  // Show empty component if data is empty and not loading
  const showEmpty = useMemo(
    () => !isLoading && data && data.length === 0 && total === 0 && empty,
    [isLoading, data, total, empty]
  )

  return (
    <Card className={className} data-slot="card">
      {(title || actions || filters) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-4">
            {title && (
              typeof title === 'string' ? (
                <CardTitle>{title}</CardTitle>
              ) : (
                title
              )
            )}
            {filters}
          </div>
          {actions !== false && actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </CardHeader>
      )}
      <CardContent>
        {showEmpty ? empty : children}
        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isFetching ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <span className="text-sm text-muted-foreground">Scroll to load more</span>
            )}
          </div>
        )}
      </CardContent>
      {aside}
    </Card>
  )
}

// Import useListContext for InfiniteListView
import { useListContext } from '../../contexts/ListContext'

/**
 * Props for InfiniteList component
 */
export interface InfiniteListProps<RecordType extends { id: Identifier } = { id: Identifier }>
  extends Omit<InfiniteListBaseProps<RecordType>, 'children'>,
    Pick<InfiniteListViewProps, 'actions' | 'filters' | 'empty' | 'className' | 'aside'> {
  /** Child elements to render inside the list (typically Datagrid) */
  children: ReactNode
  /** Title to display in the list header */
  title?: ReactNode
  /** Exporter function for data export, or false to disable */
  exporter?: ((data: RecordType[]) => void) | false
}

/**
 * InfiniteList - Complete infinite scroll list component
 *
 * Similar to List but uses infinite scroll instead of pagination.
 * Data is automatically loaded as the user scrolls down.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <InfiniteList resource="posts">
 *   <Datagrid>
 *     <TextField source="title" />
 *     <DateField source="createdAt" />
 *   </Datagrid>
 * </InfiniteList>
 *
 * // With all options
 * <InfiniteList
 *   resource="posts"
 *   title="All Posts"
 *   perPage={25}
 *   sort={{ field: 'createdAt', order: 'DESC' }}
 *   filter={{ published: true }}
 *   actions={<CreateButton />}
 * >
 *   <Datagrid>
 *     <TextField source="title" />
 *   </Datagrid>
 * </InfiniteList>
 * ```
 */
export function InfiniteList<RecordType extends { id: Identifier } = { id: Identifier }>({
  // InfiniteListBase props
  resource,
  perPage,
  sort,
  filter,
  filterDefaultValues,
  disableSyncWithLocation,
  queryOptions,
  // InfiniteListView props
  title,
  actions,
  filters,
  empty,
  className,
  aside,
  // Export prop (accepted for API compatibility, not yet implemented)
  exporter: _exporter,
  // Children
  children,
}: InfiniteListProps<RecordType>) {
  return (
    <InfiniteListBase<RecordType>
      resource={resource}
      perPage={perPage}
      sort={sort}
      filter={filter}
      filterDefaultValues={filterDefaultValues}
      disableSyncWithLocation={disableSyncWithLocation}
      queryOptions={queryOptions}
    >
      <InfiniteListView
        title={title}
        actions={actions}
        filters={filters}
        empty={empty}
        className={className}
        aside={aside}
      >
        {children}
      </InfiniteListView>
    </InfiniteListBase>
  )
}

export default InfiniteList
