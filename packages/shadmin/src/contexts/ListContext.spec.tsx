import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  ListContext,
  ListContextProvider,
  useListContext,
  type ListControllerResult,
  type SortPayload,
  type FilterPayload,
} from './ListContext'

interface TestRecord {
  id: number
  name: string
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

describe('ListContext', () => {
  describe('ListContext', () => {
    it('should export the React context', () => {
      expect(ListContext).toBeDefined()
    })
  })

  describe('ListContextProvider', () => {
    it('should provide list context to children', () => {
      const testData: TestRecord[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]
      const contextValue = createTestListContext({ data: testData, total: 2 })

      const Consumer = () => {
        const { data, total } = useListContext<TestRecord>()
        return (
          <div>
            <span data-testid="total">{total}</span>
            <ul>
              {data?.map((item) => (
                <li key={item.id} data-testid={`item-${item.id}`}>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        )
      }

      render(
        <ListContextProvider value={contextValue}>
          <Consumer />
        </ListContextProvider>
      )

      expect(screen.getByTestId('total')).toHaveTextContent('2')
      expect(screen.getByTestId('item-1')).toHaveTextContent('Item 1')
      expect(screen.getByTestId('item-2')).toHaveTextContent('Item 2')
    })
  })

  describe('useListContext', () => {
    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useListContext()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useListContext must be used inside a ListContextProvider'
      )
    })

    it('should return all list controller properties', () => {
      const contextValue = createTestListContext({
        data: [{ id: 1, name: 'Test' }],
        total: 100,
        page: 2,
        perPage: 25,
        isLoading: true,
        sort: { field: 'name', order: 'DESC' },
        filterValues: { status: 'active' },
      })

      const Consumer = () => {
        const {
          data,
          total,
          page,
          perPage,
          isLoading,
          sort,
          filterValues,
        } = useListContext<TestRecord>()
        return (
          <div>
            <span data-testid="data-length">{data?.length}</span>
            <span data-testid="total">{total}</span>
            <span data-testid="page">{page}</span>
            <span data-testid="perPage">{perPage}</span>
            <span data-testid="isLoading">{isLoading ? 'true' : 'false'}</span>
            <span data-testid="sort">{`${sort.field}-${sort.order}`}</span>
            <span data-testid="filters">{JSON.stringify(filterValues)}</span>
          </div>
        )
      }

      render(
        <ListContextProvider value={contextValue}>
          <Consumer />
        </ListContextProvider>
      )

      expect(screen.getByTestId('data-length')).toHaveTextContent('1')
      expect(screen.getByTestId('total')).toHaveTextContent('100')
      expect(screen.getByTestId('page')).toHaveTextContent('2')
      expect(screen.getByTestId('perPage')).toHaveTextContent('25')
      expect(screen.getByTestId('isLoading')).toHaveTextContent('true')
      expect(screen.getByTestId('sort')).toHaveTextContent('name-DESC')
      expect(screen.getByTestId('filters')).toHaveTextContent('{"status":"active"}')
    })

    it('should provide setPage callback', () => {
      const setPage = vi.fn()
      const contextValue = createTestListContext({ setPage })

      const Consumer = () => {
        const { setPage } = useListContext()
        return <button onClick={() => setPage(5)}>Set Page</button>
      }

      render(
        <ListContextProvider value={contextValue}>
          <Consumer />
        </ListContextProvider>
      )

      fireEvent.click(screen.getByText('Set Page'))
      expect(setPage).toHaveBeenCalledWith(5)
    })

    it('should provide setPerPage callback', () => {
      const setPerPage = vi.fn()
      const contextValue = createTestListContext({ setPerPage })

      const Consumer = () => {
        const { setPerPage } = useListContext()
        return <button onClick={() => setPerPage(50)}>Set Per Page</button>
      }

      render(
        <ListContextProvider value={contextValue}>
          <Consumer />
        </ListContextProvider>
      )

      fireEvent.click(screen.getByText('Set Per Page'))
      expect(setPerPage).toHaveBeenCalledWith(50)
    })

    it('should provide setSort callback', () => {
      const setSort = vi.fn()
      const contextValue = createTestListContext({ setSort })

      const Consumer = () => {
        const { setSort } = useListContext()
        return (
          <button onClick={() => setSort({ field: 'name', order: 'DESC' })}>
            Set Sort
          </button>
        )
      }

      render(
        <ListContextProvider value={contextValue}>
          <Consumer />
        </ListContextProvider>
      )

      fireEvent.click(screen.getByText('Set Sort'))
      expect(setSort).toHaveBeenCalledWith({ field: 'name', order: 'DESC' })
    })

    it('should provide setFilters callback', () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      const Consumer = () => {
        const { setFilters } = useListContext()
        return (
          <button onClick={() => setFilters({ status: 'inactive' })}>
            Set Filters
          </button>
        )
      }

      render(
        <ListContextProvider value={contextValue}>
          <Consumer />
        </ListContextProvider>
      )

      fireEvent.click(screen.getByText('Set Filters'))
      expect(setFilters).toHaveBeenCalledWith({ status: 'inactive' })
    })

    it('should provide selection callbacks', () => {
      const onSelect = vi.fn()
      const onToggleItem = vi.fn()
      const onUnselectItems = vi.fn()
      const contextValue = createTestListContext({
        selectedIds: [1, 2],
        onSelect,
        onToggleItem,
        onUnselectItems,
      })

      const Consumer = () => {
        const { selectedIds, onSelect, onToggleItem, onUnselectItems } = useListContext()
        return (
          <div>
            <span data-testid="selected">{selectedIds.join(',')}</span>
            <button onClick={() => onSelect([3, 4])}>Select</button>
            <button onClick={() => onToggleItem(5)}>Toggle</button>
            <button onClick={() => onUnselectItems()}>Unselect</button>
          </div>
        )
      }

      render(
        <ListContextProvider value={contextValue}>
          <Consumer />
        </ListContextProvider>
      )

      expect(screen.getByTestId('selected')).toHaveTextContent('1,2')

      fireEvent.click(screen.getByText('Select'))
      expect(onSelect).toHaveBeenCalledWith([3, 4])

      fireEvent.click(screen.getByText('Toggle'))
      expect(onToggleItem).toHaveBeenCalledWith(5)

      fireEvent.click(screen.getByText('Unselect'))
      expect(onUnselectItems).toHaveBeenCalled()
    })

    it('should provide refetch callback', () => {
      const refetch = vi.fn()
      const contextValue = createTestListContext({ refetch })

      const Consumer = () => {
        const { refetch } = useListContext()
        return <button onClick={() => refetch()}>Refetch</button>
      }

      render(
        <ListContextProvider value={contextValue}>
          <Consumer />
        </ListContextProvider>
      )

      fireEvent.click(screen.getByText('Refetch'))
      expect(refetch).toHaveBeenCalled()
    })

    it('should provide error state', () => {
      const testError = new Error('Test error')
      const contextValue = createTestListContext({ error: testError })

      const Consumer = () => {
        const { error } = useListContext()
        return <div data-testid="error">{error?.message}</div>
      }

      render(
        <ListContextProvider value={contextValue}>
          <Consumer />
        </ListContextProvider>
      )

      expect(screen.getByTestId('error')).toHaveTextContent('Test error')
    })
  })
})
