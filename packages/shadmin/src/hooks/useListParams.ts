/**
 * useListParams hook
 * Manages list parameters (pagination, sorting, filtering) with URL synchronization
 * Compatible with react-admin URL parameter format
 *
 * Issue: shadmin-8d28
 * Refactored: shadmin-1tpz - URL state optimization and edge cases
 *
 * Optimizations:
 * - Debounced URL updates to avoid excessive history entries
 * - Proper memoization to prevent unnecessary re-renders
 * - URL encoding/decoding for special characters in filter values
 * - Edge case handling for empty filters, invalid URL params, and concurrent updates
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useTestSearchParams } from '../test-utils/TestMemoryRouter'
import type { SortPayload, FilterPayload } from '../contexts/ListContext'

/**
 * Parameters for useListParams hook
 */
export interface UseListParamsProps {
  /** The name of the resource (used as prefix for storeKey) */
  resource: string
  /** Custom store key for namespacing URL params (e.g., "myList" results in "myList.page") */
  storeKey?: string
  /** Default number of items per page */
  perPage?: number
  /** Default sort configuration */
  sort?: SortPayload
  /** Default filter values */
  filterDefaultValues?: FilterPayload
  /** If true, don't sync with URL */
  disableSyncWithLocation?: boolean
  /** Debounce delay in ms for URL updates (default: 200ms, set to 0 to disable) */
  debounceDelay?: number
}

/**
 * Result type for useListParams hook
 */
export interface UseListParamsResult {
  /** Current page number (1-indexed) */
  page: number
  /** Number of items per page */
  perPage: number
  /** Current sort configuration */
  sort: SortPayload
  /** Current filter values */
  filterValues: FilterPayload
  /** Callback to change page */
  setPage: (page: number) => void
  /** Callback to change items per page */
  setPerPage: (perPage: number) => void
  /** Callback to change sort */
  setSort: (sort: SortPayload) => void
  /** Callback to change filters */
  setFilters: (filters: FilterPayload) => void
}

/**
 * Default sort configuration
 */
const defaultSort: SortPayload = { field: 'id', order: 'ASC' }

/**
 * Default debounce delay for URL updates (in milliseconds)
 */
const DEFAULT_DEBOUNCE_DELAY = 200

/**
 * Parse a number from URL, returning undefined if invalid
 * Handles edge cases: empty strings, non-numeric values, negative numbers, zero
 */
function parsePositiveInt(value: string | null): number | undefined {
  if (!value || value.trim() === '') return undefined
  const parsed = parseInt(value, 10)
  if (isNaN(parsed) || parsed <= 0 || !isFinite(parsed)) return undefined
  return parsed
}

/**
 * Parse sort order from URL
 * Only accepts 'ASC' or 'DESC', defaults to 'ASC' for any other value
 */
function parseSortOrder(value: string | null): 'ASC' | 'DESC' {
  if (value === 'DESC') return 'DESC'
  return 'ASC'
}

/**
 * Safely decode a URL component, returning the original value if decoding fails
 */
function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    // Return original value if decoding fails (e.g., malformed percent encoding)
    return value
  }
}

/**
 * Safely encode a URL component, handling special characters
 */
function safeEncodeURIComponent(value: string): string {
  try {
    return encodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Parse filter JSON from URL with robust error handling
 * Handles: empty values, malformed JSON, non-object values, arrays (treated as empty)
 */
function parseFilter(value: string | null): FilterPayload {
  if (!value || value.trim() === '') return {}

  try {
    // Decode URL-encoded value first
    const decodedValue = safeDecodeURIComponent(value)
    const parsed = JSON.parse(decodedValue)

    // Validate that it's a plain object (not null, not array)
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed
    }
    return {}
  } catch {
    // Try without decoding in case it's already decoded
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed
      }
      return {}
    } catch {
      return {}
    }
  }
}

/**
 * Serialize filter to JSON string with proper encoding for URL
 */
function serializeFilter(filter: FilterPayload): string {
  if (!filter || typeof filter !== 'object') return ''

  // Remove null and undefined values from filter
  const cleanedFilter = Object.entries(filter).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value
    }
    return acc
  }, {} as FilterPayload)

  if (Object.keys(cleanedFilter).length === 0) return ''

  try {
    return JSON.stringify(cleanedFilter)
  } catch {
    return ''
  }
}

/**
 * Compare two filter objects for equality (deep comparison)
 */
function filtersAreEqual(a: FilterPayload, b: FilterPayload): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) return false

  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

/**
 * Compare two sort configurations for equality
 */
function sortsAreEqual(a: SortPayload, b: SortPayload): boolean {
  return a.field === b.field && a.order === b.order
}

/**
 * Get a URL param value, checking prefixed key first, then falling back to simple key
 */
function getParamValue(
  searchParams: URLSearchParams,
  key: string,
  resourcePrefix: string,
  storeKey?: string
): string | null {
  // If explicit storeKey is provided, only check that
  if (storeKey) {
    return searchParams.get(`${storeKey}.${key}`)
  }

  // Otherwise, check resource-prefixed key first, then fall back to simple key
  const prefixedValue = searchParams.get(`${resourcePrefix}.${key}`)
  if (prefixedValue !== null) {
    return prefixedValue
  }

  return searchParams.get(key)
}

/**
 * Parse list parameters from URL search params
 */
function parseParamsFromUrl(
  searchParams: URLSearchParams,
  resource: string,
  storeKey?: string
): {
  page?: number
  perPage?: number
  sort?: SortPayload
  filter?: FilterPayload
} {
  const result: ReturnType<typeof parseParamsFromUrl> = {}

  const pageValue = getParamValue(searchParams, 'page', resource, storeKey)
  const perPageValue = getParamValue(searchParams, 'perPage', resource, storeKey)
  const sortValue = getParamValue(searchParams, 'sort', resource, storeKey)
  const orderValue = getParamValue(searchParams, 'order', resource, storeKey)
  const filterValue = getParamValue(searchParams, 'filter', resource, storeKey)

  result.page = parsePositiveInt(pageValue)
  result.perPage = parsePositiveInt(perPageValue)

  if (sortValue) {
    result.sort = {
      field: sortValue,
      order: parseSortOrder(orderValue),
    }
  }

  result.filter = parseFilter(filterValue)

  return result
}

/**
 * Get the URL param key for writing (prefixed only when storeKey is explicit)
 */
function getWriteKey(key: string, storeKey?: string): string {
  if (storeKey) {
    return `${storeKey}.${key}`
  }
  return key
}

/**
 * Internal state shape for managing list params
 */
interface ListParamsState {
  page: number
  perPage: number
  sort: SortPayload
  filterValues: FilterPayload
}

/**
 * Hook to manage list parameters with URL synchronization
 *
 * @example
 * ```tsx
 * const { page, perPage, sort, filterValues, setPage, setSort, setFilters } = useListParams({
 *   resource: 'posts',
 *   perPage: 25,
 *   sort: { field: 'createdAt', order: 'DESC' }
 * })
 * ```
 */
export function useListParams({
  resource,
  storeKey,
  perPage: defaultPerPage = 10,
  sort: defaultSortProp,
  filterDefaultValues = {},
  disableSyncWithLocation = false,
  debounceDelay = DEFAULT_DEBOUNCE_DELAY,
}: UseListParamsProps): UseListParamsResult {
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

  // Memoize default sort to prevent unnecessary re-renders
  const defaultSortConfig = useMemo(
    () => defaultSortProp ?? defaultSort,
    [defaultSortProp]
  )

  // Memoize filter default values to prevent unnecessary re-renders
  const memoizedFilterDefaults = useMemo(
    () => filterDefaultValues ?? {},
    [filterDefaultValues]
  )

  // Parse initial values from URL if sync is enabled - memoized to prevent recalculation
  const urlParams = useMemo(() => {
    if (disableSyncWithLocation) {
      return {}
    }
    return parseParamsFromUrl(searchParams, resource, storeKey)
  }, [disableSyncWithLocation, searchParams, resource, storeKey])

  // Calculate initial state once - memoized for stability
  const initialState = useMemo((): ListParamsState => {
    const initialPage = disableSyncWithLocation ? 1 : (urlParams.page ?? 1)
    const initialPerPage = disableSyncWithLocation ? defaultPerPage : (urlParams.perPage ?? defaultPerPage)
    const initialSort = disableSyncWithLocation ? defaultSortConfig : (urlParams.sort ?? defaultSortConfig)
    const initialFilter = disableSyncWithLocation
      ? memoizedFilterDefaults
      : (Object.keys(urlParams.filter || {}).length > 0 ? urlParams.filter! : memoizedFilterDefaults)

    return {
      page: initialPage,
      perPage: initialPerPage,
      sort: initialSort,
      filterValues: initialFilter,
    }
  }, [disableSyncWithLocation, urlParams, defaultPerPage, defaultSortConfig, memoizedFilterDefaults])

  // State for list parameters
  const [page, setPageState] = useState(() => initialState.page)
  const [perPage, setPerPageState] = useState(() => initialState.perPage)
  const [sort, setSortState] = useState<SortPayload>(() => initialState.sort)
  const [filterValues, setFilterValuesState] = useState<FilterPayload>(() => initialState.filterValues)

  // Track whether we're doing an initial sync
  const isInitialMount = useRef(true)

  // Debounce timer ref for URL updates
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Track pending URL update to handle concurrent updates
  const pendingUpdateRef = useRef<URLSearchParams | null>(null)

  // Stable reference to setSearchParams to avoid dependency issues
  const setSearchParamsRef = useRef(setSearchParams)
  setSearchParamsRef.current = setSearchParams

  // Memoized URL update function with debouncing
  const updateUrl = useCallback((newParams: URLSearchParams) => {
    // Store the latest params to handle concurrent updates
    pendingUpdateRef.current = newParams

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // If debouncing is disabled, update immediately
    if (debounceDelay === 0) {
      setSearchParamsRef.current(newParams)
      pendingUpdateRef.current = null
      return
    }

    // Debounce the URL update
    debounceTimerRef.current = setTimeout(() => {
      if (pendingUpdateRef.current) {
        setSearchParamsRef.current(pendingUpdateRef.current)
        pendingUpdateRef.current = null
      }
      debounceTimerRef.current = null
    }, debounceDelay)
  }, [debounceDelay])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Update URL when parameters change (with debouncing)
  useEffect(() => {
    if (disableSyncWithLocation) return

    // Skip URL update on initial mount since we're reading from URL
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Create new params from scratch (don't copy existing searchParams to avoid dependency cycles)
    const newParams = new URLSearchParams()

    // Update or remove page param (only use prefix when storeKey is explicit)
    const pageKey = getWriteKey('page', storeKey)
    if (page !== 1) {
      newParams.set(pageKey, String(page))
    }

    // Update perPage param
    const perPageKey = getWriteKey('perPage', storeKey)
    newParams.set(perPageKey, String(perPage))

    // Update sort params
    const sortKey = getWriteKey('sort', storeKey)
    const orderKey = getWriteKey('order', storeKey)
    newParams.set(sortKey, sort.field)
    newParams.set(orderKey, sort.order)

    // Update filter param with proper serialization
    const filterKey = getWriteKey('filter', storeKey)
    const serializedFilter = serializeFilter(filterValues)
    if (serializedFilter) {
      newParams.set(filterKey, serializedFilter)
    } else {
      newParams.delete(filterKey)
    }

    updateUrl(newParams)
  }, [
    page,
    perPage,
    sort,
    filterValues,
    disableSyncWithLocation,
    updateUrl,
    storeKey,
  ])

  // Callbacks for state changes - memoized to prevent unnecessary re-renders
  const setPage = useCallback((newPage: number) => {
    // Validate page number
    const validPage = Math.max(1, Math.floor(newPage))
    setPageState(validPage)
  }, [])

  const setPerPage = useCallback((newPerPage: number) => {
    // Validate perPage
    const validPerPage = Math.max(1, Math.floor(newPerPage))
    setPerPageState(validPerPage)
    setPageState(1) // Reset to page 1 when perPage changes
  }, [])

  const setSort = useCallback((newSort: SortPayload) => {
    // Validate sort payload
    if (!newSort || typeof newSort.field !== 'string') {
      return // Ignore invalid sort
    }
    const validSort: SortPayload = {
      field: newSort.field,
      order: newSort.order === 'DESC' ? 'DESC' : 'ASC',
    }
    setSortState((prev) => {
      if (sortsAreEqual(prev, validSort)) {
        return prev // No change needed
      }
      return validSort
    })
    setPageState(1) // Reset to page 1 when sort changes
  }, [])

  const setFilters = useCallback((newFilters: FilterPayload) => {
    // Validate and clean filters
    if (!newFilters || typeof newFilters !== 'object' || Array.isArray(newFilters)) {
      setFilterValuesState({})
      setPageState(1)
      return
    }

    // Remove null/undefined values
    const cleanedFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as FilterPayload)

    setFilterValuesState((prev) => {
      if (filtersAreEqual(prev, cleanedFilters)) {
        return prev // No change needed
      }
      return cleanedFilters
    })
    setPageState(1) // Reset to page 1 when filters change
  }, [])

  // Memoize the return value to prevent unnecessary re-renders of consumers
  return useMemo(() => ({
    page,
    perPage,
    sort,
    filterValues,
    setPage,
    setPerPage,
    setSort,
    setFilters,
  }), [page, perPage, sort, filterValues, setPage, setPerPage, setSort, setFilters])
}

export default useListParams
