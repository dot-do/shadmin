/**
 * ListBase Component
 * Core list logic without UI wrapper - provides ListContext to children
 * 100% API-compatible with react-admin ListBase
 *
 * Epic: shadmin-ha1 (P1)
 */

import { type ReactNode, useCallback, useMemo, useState, useEffect } from 'react'
import { ListContextProvider, type SortPayload, type FilterPayload, type Identifier } from '../../contexts/ListContext'
import { ResourceContextProvider, useResourceContext } from '../../contexts/ResourceContext'
import { useGetList, type UseGetListOptions } from '../../hooks/useGetList'
import { useTestSearchParams, useTestLocation } from '../../test-utils/TestMemoryRouter'

/**
 * Props for ListBase component
 */
export interface ListBaseProps<RecordType extends { id: Identifier } = { id: Identifier }> {
  /** The name of the resource to fetch. If not provided, uses ResourceContext */
  resource?: string
  /** Child elements to render inside the ListContext */
  children: ReactNode
  /** Number of records per page. Defaults to 10 */
  perPage?: number
  /** Default sort configuration */
  sort?: SortPayload
  /** Permanent filter (always applied, cannot be changed by user) */
  filter?: FilterPayload
  /** Default filter values (can be changed by user) */
  filterDefaultValues?: FilterPayload
  /** If true, don't sync list parameters with URL */
  disableSyncWithLocation?: boolean
  /** React Query options to pass to useGetList */
  queryOptions?: UseGetListOptions<RecordType>
}

/**
 * Default sort configuration
 */
const defaultSort: SortPayload = { field: 'id', order: 'ASC' }

/**
 * Parse URL search params to extract list parameters
 */
function parseListParamsFromUrl(searchParams: URLSearchParams): {
  page?: number
  perPage?: number
  sort?: SortPayload
  filter?: FilterPayload
} {
  const result: ReturnType<typeof parseListParamsFromUrl> = {}

  const pageParam = searchParams.get('page')
  if (pageParam) {
    const page = parseInt(pageParam, 10)
    if (!isNaN(page) && page > 0) {
      result.page = page
    }
  }

  const perPageParam = searchParams.get('perPage')
  if (perPageParam) {
    const perPage = parseInt(perPageParam, 10)
    if (!isNaN(perPage) && perPage > 0) {
      result.perPage = perPage
    }
  }

  const sortField = searchParams.get('sort')
  const sortOrder = searchParams.get('order')
  if (sortField) {
    result.sort = {
      field: sortField,
      order: sortOrder === 'DESC' ? 'DESC' : 'ASC',
    }
  }

  const filterParam = searchParams.get('filter')
  if (filterParam) {
    try {
      result.filter = JSON.parse(filterParam)
    } catch {
      // Invalid JSON, ignore
    }
  }

  return result
}

/**
 * Serialize list parameters to URL search params
 */
function serializeListParamsToUrl(
  params: {
    page: number
    perPage: number
    sort: SortPayload
    filter: FilterPayload
  },
  defaults: {
    page: number
    perPage: number
    sort: SortPayload
  }
): URLSearchParams {
  const searchParams = new URLSearchParams()

  if (params.page !== defaults.page) {
    searchParams.set('page', String(params.page))
  }

  if (params.perPage !== defaults.perPage) {
    searchParams.set('perPage', String(params.perPage))
  }

  if (params.sort.field !== defaults.sort.field || params.sort.order !== defaults.sort.order) {
    searchParams.set('sort', params.sort.field)
    searchParams.set('order', params.sort.order)
  }

  if (Object.keys(params.filter).length > 0) {
    searchParams.set('filter', JSON.stringify(params.filter))
  }

  return searchParams
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
  perPage: defaultPerPage = 10,
  sort: defaultSortProp,
  filter: permanentFilter = {},
  filterDefaultValues = {},
  disableSyncWithLocation = false,
  queryOptions,
}: ListBaseProps<RecordType>) {
  // Get resource from context if not provided
  const resourceFromContext = useResourceContext()
  const resource = resourceProp ?? resourceFromContext ?? ''

  if (!resource) {
    throw new Error('ListBase requires a resource prop or must be used inside a ResourceContextProvider')
  }

  // URL sync hooks
  let searchParams: URLSearchParams
  let setSearchParams: (params: URLSearchParams | Record<string, string>) => void

  try {
    const result = useTestSearchParams()
    searchParams = result[0]
    setSearchParams = result[1]
  } catch {
    // Not in a router context, use empty defaults
    searchParams = new URLSearchParams()
    setSearchParams = () => {}
  }

  // Parse initial values from URL if sync is enabled
  const urlParams = useMemo(() => {
    if (disableSyncWithLocation) {
      return {}
    }
    return parseListParamsFromUrl(searchParams)
  }, [disableSyncWithLocation, searchParams])

  // Default sort (prop takes precedence over hardcoded default)
  const defaultSortConfig = defaultSortProp ?? defaultSort

  // State for list parameters
  const [page, setPageState] = useState(urlParams.page ?? 1)
  const [perPage, setPerPageState] = useState(urlParams.perPage ?? defaultPerPage)
  const [sort, setSortState] = useState<SortPayload>(urlParams.sort ?? defaultSortConfig)
  const [filterValues, setFilterValuesState] = useState<FilterPayload>(
    urlParams.filter ?? filterDefaultValues
  )
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

  // Update URL when parameters change
  useEffect(() => {
    if (disableSyncWithLocation) return

    const newParams = serializeListParamsToUrl(
      { page, perPage, sort, filter: filterValues },
      { page: 1, perPage: defaultPerPage, sort: defaultSortConfig }
    )

    setSearchParams(newParams)
  }, [page, perPage, sort, filterValues, disableSyncWithLocation, defaultPerPage, defaultSortConfig, setSearchParams])

  // Callbacks for state changes
  const setPage = useCallback((newPage: number) => {
    setPageState(newPage)
  }, [])

  const setPerPage = useCallback((newPerPage: number) => {
    setPerPageState(newPerPage)
    setPageState(1) // Reset to page 1 when perPage changes
  }, [])

  const setSort = useCallback((newSort: SortPayload) => {
    setSortState(newSort)
    setPageState(1) // Reset to page 1 when sort changes
  }, [])

  const setFilters = useCallback((newFilters: FilterPayload) => {
    setFilterValuesState(newFilters)
    setPageState(1) // Reset to page 1 when filters change
  }, [])

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
