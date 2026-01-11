/**
 * Tests for re-render optimization in ListContext
 *
 * These tests verify that splitting ListContext into focused sub-contexts
 * prevents unnecessary re-renders when unrelated state changes.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState, useCallback, memo, useMemo } from 'react'
import {
  ListContextProvider,
  useListContext,
  type ListControllerResult,
} from './ListContext'
import {
  ListPaginationContext,
  ListPaginationContextProvider,
  useListPaginationContext,
} from './ListPaginationContext'
import {
  ListSortContext,
  ListSortContextProvider,
  useListSortContext,
} from './ListSortContext'
import {
  ListFilterContext,
  ListFilterContextProvider,
  useListFilterContext,
} from './ListFilterContext'
import {
  ListSelectionContext,
  ListSelectionContextProvider,
  useListSelectionContext,
} from './ListSelectionContext'

interface TestRecord {
  id: number
  name: string
  [key: string]: unknown
}

const createTestListContext = (
  overrides: Partial<ListControllerResult<TestRecord>> = {}
): ListControllerResult<TestRecord> => ({
  data: [],
  total: 0,
  isLoading: false,
  isFetching: false,
  error: null,
  page: 1,
  perPage: 10,
  sort: { field: 'id', order: 'ASC' },
  filterValues: {},
  selectedIds: [],
  resource: 'test',
  setPage: vi.fn(),
  setPerPage: vi.fn(),
  setSort: vi.fn(),
  setFilters: vi.fn(),
  onSelect: vi.fn(),
  onToggleItem: vi.fn(),
  onUnselectItems: vi.fn(),
  refetch: vi.fn(),
  ...overrides,
})

describe('ListContext Re-render Optimization', () => {
  describe('Split Context Pattern', () => {
    it('should not re-render pagination consumer when sort changes', () => {
      const paginationRenderCount = { current: 0 }
      const sortRenderCount = { current: 0 }

      // Memoized consumer that only re-renders when pagination context changes
      const PaginationConsumer = memo(function PaginationConsumer() {
        paginationRenderCount.current++
        const { page, perPage } = useListPaginationContext()
        return (
          <div>
            <span data-testid="page">{page}</span>
            <span data-testid="perPage">{perPage}</span>
            <span data-testid="pagination-renders">{paginationRenderCount.current}</span>
          </div>
        )
      })

      // Memoized consumer that only re-renders when sort context changes
      const SortConsumer = memo(function SortConsumer() {
        sortRenderCount.current++
        const { sort, setSort } = useListSortContext()
        return (
          <div>
            <span data-testid="sort">{`${sort.field}-${sort.order}`}</span>
            <span data-testid="sort-renders">{sortRenderCount.current}</span>
            <button
              onClick={() => setSort({ field: 'name', order: 'DESC' })}
              data-testid="change-sort"
            >
              Change Sort
            </button>
          </div>
        )
      })

      const TestWrapper = () => {
        const [sort, setSort] = useState<{ field: string; order: 'ASC' | 'DESC' }>({ field: 'id', order: 'ASC' })

        // Stable callbacks using useCallback
        const stableSetSort = useCallback((newSort: { field: string; order: 'ASC' | 'DESC' }) => {
          setSort(newSort)
        }, [])
        const stableSetPage = useCallback(() => {}, [])
        const stableSetPerPage = useCallback(() => {}, [])

        // Memoize pagination context value - depends on stable values
        const paginationValue = useMemo(() => ({
          isLoading: false,
          isFetching: false,
          total: 0,
          page: 1,
          perPage: 10,
          setPage: stableSetPage,
          setPerPage: stableSetPerPage,
          resource: 'test',
        }), [stableSetPage, stableSetPerPage])

        // Memoize sort context value - depends on sort which changes
        const sortValue = useMemo(() => ({
          sort,
          setSort: stableSetSort,
          resource: 'test',
        }), [sort, stableSetSort])

        return (
          <ListPaginationContext.Provider value={paginationValue}>
            <ListSortContext.Provider value={sortValue}>
              <PaginationConsumer />
              <SortConsumer />
            </ListSortContext.Provider>
          </ListPaginationContext.Provider>
        )
      }

      render(<TestWrapper />)

      // Initial render
      expect(paginationRenderCount.current).toBe(1)
      expect(sortRenderCount.current).toBe(1)

      // Change sort - pagination consumer should NOT re-render
      fireEvent.click(screen.getByTestId('change-sort'))

      // Sort consumer should re-render (2)
      expect(sortRenderCount.current).toBe(2)
      // Pagination consumer should NOT re-render (still 1)
      expect(paginationRenderCount.current).toBe(1)
    })

    it('should not re-render filter consumer when pagination changes', () => {
      const filterRenderCount = { current: 0 }
      const paginationRenderCount = { current: 0 }

      // Memoized consumer that only re-renders when filter context changes
      const FilterConsumer = memo(function FilterConsumer() {
        filterRenderCount.current++
        const { filterValues } = useListFilterContext()
        return (
          <div>
            <span data-testid="filters">{JSON.stringify(filterValues)}</span>
            <span data-testid="filter-renders">{filterRenderCount.current}</span>
          </div>
        )
      })

      // Memoized consumer that only re-renders when pagination context changes
      const PaginationConsumer = memo(function PaginationConsumer() {
        paginationRenderCount.current++
        const { page, setPage } = useListPaginationContext()
        return (
          <div>
            <span data-testid="page">{page}</span>
            <span data-testid="pagination-renders">{paginationRenderCount.current}</span>
            <button
              onClick={() => setPage(2)}
              data-testid="change-page"
            >
              Change Page
            </button>
          </div>
        )
      })

      const TestWrapper = () => {
        const [page, setPage] = useState(1)

        // Stable callbacks using useCallback
        const stableSetPage = useCallback((newPage: number) => {
          setPage(newPage)
        }, [])
        const stableSetPerPage = useCallback(() => {}, [])
        const stableSetFilters = useCallback(() => {}, [])

        // Memoize filter context value - stable (no dependencies that change)
        const filterValue = useMemo(() => ({
          filterValues: {},
          setFilters: stableSetFilters,
          resource: 'test',
        }), [stableSetFilters])

        // Memoize pagination context value - depends on page which changes
        const paginationValue = useMemo(() => ({
          isLoading: false,
          isFetching: false,
          total: 0,
          page,
          perPage: 10,
          setPage: stableSetPage,
          setPerPage: stableSetPerPage,
          resource: 'test',
        }), [page, stableSetPage, stableSetPerPage])

        return (
          <ListFilterContext.Provider value={filterValue}>
            <ListPaginationContext.Provider value={paginationValue}>
              <FilterConsumer />
              <PaginationConsumer />
            </ListPaginationContext.Provider>
          </ListFilterContext.Provider>
        )
      }

      render(<TestWrapper />)

      // Initial render
      expect(filterRenderCount.current).toBe(1)
      expect(paginationRenderCount.current).toBe(1)

      // Change page - filter consumer should NOT re-render
      fireEvent.click(screen.getByTestId('change-page'))

      // Pagination consumer should re-render (2)
      expect(paginationRenderCount.current).toBe(2)
      // Filter consumer should NOT re-render (still 1)
      expect(filterRenderCount.current).toBe(1)
    })

    it('should not re-render selection consumer when filter changes', () => {
      const selectionRenderCount = { current: 0 }
      const filterRenderCount = { current: 0 }

      // Memoized consumer that only re-renders when selection context changes
      const SelectionConsumer = memo(function SelectionConsumer() {
        selectionRenderCount.current++
        const { selectedIds } = useListSelectionContext()
        return (
          <div>
            <span data-testid="selected">{selectedIds.join(',') || 'none'}</span>
            <span data-testid="selection-renders">{selectionRenderCount.current}</span>
          </div>
        )
      })

      // Memoized consumer that only re-renders when filter context changes
      const FilterConsumer = memo(function FilterConsumer() {
        filterRenderCount.current++
        const { filterValues, setFilters } = useListFilterContext()
        return (
          <div>
            <span data-testid="filters">{JSON.stringify(filterValues)}</span>
            <span data-testid="filter-renders">{filterRenderCount.current}</span>
            <button
              onClick={() => setFilters({ status: 'active' })}
              data-testid="change-filters"
            >
              Change Filters
            </button>
          </div>
        )
      })

      const TestWrapper = () => {
        const [filterValues, setFilters] = useState<Record<string, unknown>>({})

        // Stable callbacks using useCallback
        const stableSetFilters = useCallback((newFilters: Record<string, unknown>) => {
          setFilters(newFilters)
        }, [])
        const stableOnSelect = useCallback(() => {}, [])
        const stableOnToggleItem = useCallback(() => {}, [])
        const stableOnUnselectItems = useCallback(() => {}, [])

        // Memoize selection context value - stable (no dependencies that change)
        const selectionValue = useMemo(() => ({
          selectedIds: [] as number[],
          onSelect: stableOnSelect,
          onToggleItem: stableOnToggleItem,
          onUnselectItems: stableOnUnselectItems,
          resource: 'test',
        }), [stableOnSelect, stableOnToggleItem, stableOnUnselectItems])

        // Memoize filter context value - depends on filterValues which changes
        const filterValue = useMemo(() => ({
          filterValues,
          setFilters: stableSetFilters,
          resource: 'test',
        }), [filterValues, stableSetFilters])

        return (
          <ListSelectionContext.Provider value={selectionValue}>
            <ListFilterContext.Provider value={filterValue}>
              <SelectionConsumer />
              <FilterConsumer />
            </ListFilterContext.Provider>
          </ListSelectionContext.Provider>
        )
      }

      render(<TestWrapper />)

      // Initial render
      expect(selectionRenderCount.current).toBe(1)
      expect(filterRenderCount.current).toBe(1)

      // Change filters - selection consumer should NOT re-render
      fireEvent.click(screen.getByTestId('change-filters'))

      // Filter consumer should re-render (2)
      expect(filterRenderCount.current).toBe(2)
      // Selection consumer should NOT re-render (still 1)
      expect(selectionRenderCount.current).toBe(1)
    })
  })

  describe('useListPaginationContext', () => {
    it('should provide pagination-related values only', () => {
      const contextValue = createTestListContext({
        page: 3,
        perPage: 25,
        total: 100,
        isLoading: true,
      })

      const Consumer = () => {
        const ctx = useListPaginationContext()
        return (
          <div>
            <span data-testid="page">{ctx.page}</span>
            <span data-testid="perPage">{ctx.perPage}</span>
            <span data-testid="total">{ctx.total}</span>
            <span data-testid="isLoading">{ctx.isLoading ? 'yes' : 'no'}</span>
            <span data-testid="resource">{ctx.resource}</span>
          </div>
        )
      }

      render(
        <ListPaginationContextProvider value={contextValue}>
          <Consumer />
        </ListPaginationContextProvider>
      )

      expect(screen.getByTestId('page')).toHaveTextContent('3')
      expect(screen.getByTestId('perPage')).toHaveTextContent('25')
      expect(screen.getByTestId('total')).toHaveTextContent('100')
      expect(screen.getByTestId('isLoading')).toHaveTextContent('yes')
      expect(screen.getByTestId('resource')).toHaveTextContent('test')
    })

    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useListPaginationContext()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useListPaginationContext must be used inside a ListPaginationContextProvider'
      )
    })
  })

  describe('useListSortContext', () => {
    it('should provide sort-related values only', () => {
      const setSort = vi.fn()
      const contextValue = createTestListContext({
        sort: { field: 'name', order: 'DESC' },
        setSort,
      })

      const Consumer = () => {
        const ctx = useListSortContext()
        return (
          <div>
            <span data-testid="sort">{`${ctx.sort.field}-${ctx.sort.order}`}</span>
            <span data-testid="resource">{ctx.resource}</span>
            <button onClick={() => ctx.setSort({ field: 'id', order: 'ASC' })}>
              Change Sort
            </button>
          </div>
        )
      }

      render(
        <ListSortContextProvider value={contextValue}>
          <Consumer />
        </ListSortContextProvider>
      )

      expect(screen.getByTestId('sort')).toHaveTextContent('name-DESC')
      expect(screen.getByTestId('resource')).toHaveTextContent('test')

      fireEvent.click(screen.getByText('Change Sort'))
      expect(setSort).toHaveBeenCalledWith({ field: 'id', order: 'ASC' })
    })

    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useListSortContext()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useListSortContext must be used inside a ListSortContextProvider'
      )
    })
  })

  describe('useListFilterContext', () => {
    it('should provide filter-related values only', () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({
        filterValues: { status: 'active', category: 'books' },
        setFilters,
      })

      const Consumer = () => {
        const ctx = useListFilterContext()
        return (
          <div>
            <span data-testid="filters">{JSON.stringify(ctx.filterValues)}</span>
            <span data-testid="resource">{ctx.resource}</span>
            <button onClick={() => ctx.setFilters({ status: 'inactive' })}>
              Change Filters
            </button>
          </div>
        )
      }

      render(
        <ListFilterContextProvider value={contextValue}>
          <Consumer />
        </ListFilterContextProvider>
      )

      expect(screen.getByTestId('filters')).toHaveTextContent('{"status":"active","category":"books"}')
      expect(screen.getByTestId('resource')).toHaveTextContent('test')

      fireEvent.click(screen.getByText('Change Filters'))
      expect(setFilters).toHaveBeenCalledWith({ status: 'inactive' })
    })

    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useListFilterContext()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useListFilterContext must be used inside a ListFilterContextProvider'
      )
    })
  })

  describe('useListSelectionContext', () => {
    it('should provide selection-related values only', () => {
      const onSelect = vi.fn()
      const onToggleItem = vi.fn()
      const onUnselectItems = vi.fn()
      const contextValue = createTestListContext({
        selectedIds: [1, 2, 3],
        onSelect,
        onToggleItem,
        onUnselectItems,
      })

      const Consumer = () => {
        const ctx = useListSelectionContext()
        return (
          <div>
            <span data-testid="selected">{ctx.selectedIds.join(',')}</span>
            <span data-testid="resource">{ctx.resource}</span>
            <button onClick={() => ctx.onSelect([4, 5])}>Select</button>
            <button onClick={() => ctx.onToggleItem(6)}>Toggle</button>
            <button onClick={() => ctx.onUnselectItems()}>Unselect</button>
          </div>
        )
      }

      render(
        <ListSelectionContextProvider value={contextValue}>
          <Consumer />
        </ListSelectionContextProvider>
      )

      expect(screen.getByTestId('selected')).toHaveTextContent('1,2,3')
      expect(screen.getByTestId('resource')).toHaveTextContent('test')

      fireEvent.click(screen.getByText('Select'))
      expect(onSelect).toHaveBeenCalledWith([4, 5])

      fireEvent.click(screen.getByText('Toggle'))
      expect(onToggleItem).toHaveBeenCalledWith(6)

      fireEvent.click(screen.getByText('Unselect'))
      expect(onUnselectItems).toHaveBeenCalled()
    })

    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useListSelectionContext()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useListSelectionContext must be used inside a ListSelectionContextProvider'
      )
    })
  })

  describe('Combined ListContextProvider (backward compatibility)', () => {
    it('should provide all sub-contexts when using ListContextProvider', () => {
      const contextValue = createTestListContext({
        page: 2,
        sort: { field: 'name', order: 'DESC' },
        filterValues: { status: 'active' },
        selectedIds: [1, 2],
      })

      const PaginationConsumer = () => {
        const { page } = useListPaginationContext()
        return <span data-testid="page">{page}</span>
      }

      const SortConsumer = () => {
        const { sort } = useListSortContext()
        return <span data-testid="sort">{`${sort.field}-${sort.order}`}</span>
      }

      const FilterConsumer = () => {
        const { filterValues } = useListFilterContext()
        return <span data-testid="filters">{JSON.stringify(filterValues)}</span>
      }

      const SelectionConsumer = () => {
        const { selectedIds } = useListSelectionContext()
        return <span data-testid="selected">{selectedIds.join(',')}</span>
      }

      render(
        <ListContextProvider value={contextValue}>
          <PaginationConsumer />
          <SortConsumer />
          <FilterConsumer />
          <SelectionConsumer />
        </ListContextProvider>
      )

      expect(screen.getByTestId('page')).toHaveTextContent('2')
      expect(screen.getByTestId('sort')).toHaveTextContent('name-DESC')
      expect(screen.getByTestId('filters')).toHaveTextContent('{"status":"active"}')
      expect(screen.getByTestId('selected')).toHaveTextContent('1,2')
    })

    it('should still support useListContext for full context access', () => {
      const contextValue = createTestListContext({
        data: [{ id: 1, name: 'Test' }],
        page: 2,
        sort: { field: 'name', order: 'DESC' },
      })

      const Consumer = () => {
        const ctx = useListContext<TestRecord>()
        return (
          <div>
            <span data-testid="data">{ctx.data?.[0]?.name}</span>
            <span data-testid="page">{ctx.page}</span>
            <span data-testid="sort">{`${ctx.sort.field}-${ctx.sort.order}`}</span>
          </div>
        )
      }

      render(
        <ListContextProvider value={contextValue}>
          <Consumer />
        </ListContextProvider>
      )

      expect(screen.getByTestId('data')).toHaveTextContent('Test')
      expect(screen.getByTestId('page')).toHaveTextContent('2')
      expect(screen.getByTestId('sort')).toHaveTextContent('name-DESC')
    })
  })
})
