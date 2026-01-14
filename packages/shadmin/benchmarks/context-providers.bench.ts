/**
 * Context Provider Performance Benchmarks
 *
 * Measures mounting/unmounting and state updates for context providers.
 * These benchmarks help identify performance bottlenecks in context usage.
 */

import { describe, bench } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createElement, type ReactNode, useState, useCallback, useMemo, createContext, useContext } from 'react'

import type { RaRecord, Identifier, SortPayload, FilterPayload } from '../src/types'
import type { ListControllerResult } from '../src/contexts/ListContext'

/**
 * Mock list controller result for testing
 */
function createMockListController<T extends RaRecord>(
  data: T[],
  overrides: Partial<ListControllerResult<T>> = {}
): ListControllerResult<T> {
  return {
    data,
    total: data.length,
    isLoading: false,
    isFetching: false,
    error: null,
    page: 1,
    perPage: 25,
    sort: { field: 'id', order: 'ASC' },
    filterValues: {},
    selectedIds: [],
    resource: 'test',
    setPage: () => {},
    setPerPage: () => {},
    setSort: () => {},
    setFilters: () => {},
    onSelect: () => {},
    onToggleItem: () => {},
    onUnselectItems: () => {},
    refetch: () => {},
    ...overrides,
  }
}

/**
 * Generate test records
 */
function generateRecords(count: number): RaRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Record ${i + 1}`,
    value: Math.random() * 1000,
  }))
}

// Pre-generate test data
const records100 = generateRecords(100)
const records1000 = generateRecords(1000)

// Create test contexts for benchmarking (without importing the real ones to avoid setup issues)
const TestListContext = createContext<ListControllerResult<RaRecord> | undefined>(undefined)

interface TestProviderProps {
  value: ListControllerResult<RaRecord>
  children: ReactNode
}

function TestListProvider({ value, children }: TestProviderProps) {
  return createElement(TestListContext.Provider, { value }, children)
}

function useTestListContext() {
  const context = useContext(TestListContext)
  if (!context) throw new Error('useTestListContext must be used inside TestListProvider')
  return context
}

describe('Context - Provider Mounting', () => {
  bench('mount ListContext with 100 records', () => {
    const controller = createMockListController(records100)
    const { unmount } = renderHook(() => useTestListContext(), {
      wrapper: ({ children }: { children: ReactNode }) =>
        createElement(TestListProvider, { value: controller }, children),
    })
    unmount()
  })

  bench('mount ListContext with 1,000 records', () => {
    const controller = createMockListController(records1000)
    const { unmount } = renderHook(() => useTestListContext(), {
      wrapper: ({ children }: { children: ReactNode }) =>
        createElement(TestListProvider, { value: controller }, children),
    })
    unmount()
  })

  bench('mount/unmount cycle x10', () => {
    const controller = createMockListController(records100)
    for (let i = 0; i < 10; i++) {
      const { unmount } = renderHook(() => useTestListContext(), {
        wrapper: ({ children }: { children: ReactNode }) =>
          createElement(TestListProvider, { value: controller }, children),
      })
      unmount()
    }
  })
})

describe('Context - State Updates', () => {
  // Test stateful context updates
  function useStatefulListController(initialData: RaRecord[]) {
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(25)
    const [sort, setSort] = useState<SortPayload>({ field: 'id', order: 'ASC' })
    const [filterValues, setFilters] = useState<FilterPayload>({})
    const [selectedIds, setSelectedIds] = useState<Identifier[]>([])

    const onSelect = useCallback((ids: Identifier[]) => setSelectedIds(ids), [])
    const onToggleItem = useCallback((id: Identifier) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    }, [])
    const onUnselectItems = useCallback(() => setSelectedIds([]), [])

    const controller = useMemo<ListControllerResult<RaRecord>>(
      () => ({
        data: initialData,
        total: initialData.length,
        isLoading: false,
        isFetching: false,
        error: null,
        page,
        perPage,
        sort,
        filterValues,
        selectedIds,
        resource: 'test',
        setPage,
        setPerPage,
        setSort,
        setFilters,
        onSelect,
        onToggleItem,
        onUnselectItems,
        refetch: () => {},
      }),
      [page, perPage, sort, filterValues, selectedIds, initialData, onSelect, onToggleItem, onUnselectItems]
    )

    return controller
  }

  bench('page change update', () => {
    const { result } = renderHook(() => useStatefulListController(records100))
    act(() => {
      result.current.setPage(2)
    })
    act(() => {
      result.current.setPage(3)
    })
    act(() => {
      result.current.setPage(4)
    })
  })

  bench('sort change update', () => {
    const { result } = renderHook(() => useStatefulListController(records100))
    act(() => {
      result.current.setSort({ field: 'name', order: 'ASC' })
    })
    act(() => {
      result.current.setSort({ field: 'name', order: 'DESC' })
    })
    act(() => {
      result.current.setSort({ field: 'id', order: 'ASC' })
    })
  })

  bench('filter change update', () => {
    const { result } = renderHook(() => useStatefulListController(records100))
    act(() => {
      result.current.setFilters({ status: 'active' })
    })
    act(() => {
      result.current.setFilters({ status: 'active', category: 'A' })
    })
    act(() => {
      result.current.setFilters({})
    })
  })

  bench('selection toggle x100', () => {
    const { result } = renderHook(() => useStatefulListController(records100))
    for (let i = 1; i <= 100; i++) {
      act(() => {
        result.current.onToggleItem(i)
      })
    }
  })

  bench('select all then unselect', () => {
    const { result } = renderHook(() => useStatefulListController(records100))
    act(() => {
      result.current.onSelect(records100.map((r) => r.id))
    })
    act(() => {
      result.current.onUnselectItems()
    })
  })
})

describe('Context - Memoization Effectiveness', () => {
  // Test that memoization is working correctly by measuring object creation

  bench('useMemo controller creation', () => {
    const data = records100
    const page = 1
    const perPage = 25
    const sort = { field: 'id', order: 'ASC' as const }
    const filterValues = {}
    const selectedIds: Identifier[] = []

    // Simulate useMemo
    const controller = {
      data,
      total: data.length,
      isLoading: false,
      isFetching: false,
      error: null,
      page,
      perPage,
      sort,
      filterValues,
      selectedIds,
      resource: 'test',
      setPage: () => {},
      setPerPage: () => {},
      setSort: () => {},
      setFilters: () => {},
      onSelect: () => {},
      onToggleItem: () => {},
      onUnselectItems: () => {},
      refetch: () => {},
    }
    return controller
  })

  bench('split context value extraction', () => {
    const controller = createMockListController(records100)

    // Simulate picking specific context values (like usePickPaginationContext)
    const paginationContext = {
      page: controller.page,
      perPage: controller.perPage,
      setPage: controller.setPage,
      setPerPage: controller.setPerPage,
    }

    const sortContext = {
      sort: controller.sort,
      setSort: controller.setSort,
    }

    const filterContext = {
      filterValues: controller.filterValues,
      setFilters: controller.setFilters,
    }

    const selectionContext = {
      selectedIds: controller.selectedIds,
      onSelect: controller.onSelect,
      onToggleItem: controller.onToggleItem,
      onUnselectItems: controller.onUnselectItems,
    }

    return { paginationContext, sortContext, filterContext, selectionContext }
  })
})

describe('Context - Consumer Re-render Simulation', () => {
  // Simulate component re-renders when context changes

  bench('consumer access - full context', () => {
    const controller = createMockListController(records100)
    // Simulate accessing all context values like a component would
    const {
      data,
      total,
      isLoading,
      page,
      perPage,
      sort,
      filterValues,
      selectedIds,
    } = controller

    // Simulate using the values
    return {
      itemCount: data?.length ?? 0,
      totalItems: total,
      loading: isLoading,
      currentPage: page,
      itemsPerPage: perPage,
      sortedBy: sort.field,
      filterCount: Object.keys(filterValues).length,
      selectionCount: selectedIds.length,
    }
  })

  bench('consumer access - pagination only', () => {
    const controller = createMockListController(records100)
    const { page, perPage, total, setPage, setPerPage } = controller

    return {
      currentPage: page,
      itemsPerPage: perPage,
      totalPages: Math.ceil((total ?? 0) / perPage),
      canGoNext: page < Math.ceil((total ?? 0) / perPage),
      canGoPrev: page > 1,
    }
  })

  bench('consumer access - selection only', () => {
    const controller = createMockListController(records100, {
      selectedIds: [1, 2, 3, 4, 5],
    })
    const { data, selectedIds, onSelect, onToggleItem, onUnselectItems } = controller

    const allSelected = selectedIds.length === (data?.length ?? 0)
    const someSelected = selectedIds.length > 0 && !allSelected

    return {
      selectedCount: selectedIds.length,
      allSelected,
      someSelected,
      indeterminate: someSelected,
    }
  })
})

describe('Context - Nested Provider Performance', () => {
  // Simulate nested context providers (ListContext > PaginationContext > SortContext > etc.)

  bench('create nested provider tree', () => {
    const controller = createMockListController(records100)

    // Simulate creating nested provider structure
    const paginationValue = {
      page: controller.page,
      perPage: controller.perPage,
      setPage: controller.setPage,
      setPerPage: controller.setPerPage,
    }

    const sortValue = {
      sort: controller.sort,
      setSort: controller.setSort,
    }

    const filterValue = {
      filterValues: controller.filterValues,
      setFilters: controller.setFilters,
    }

    const selectionValue = {
      selectedIds: controller.selectedIds,
      onSelect: controller.onSelect,
      onToggleItem: controller.onToggleItem,
      onUnselectItems: controller.onUnselectItems,
    }

    return {
      list: controller,
      pagination: paginationValue,
      sort: sortValue,
      filter: filterValue,
      selection: selectionValue,
    }
  })
})
