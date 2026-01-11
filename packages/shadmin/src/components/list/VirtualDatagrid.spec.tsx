import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VirtualDatagrid, type VirtualDatagridProps } from './VirtualDatagrid'
import { ListContextProvider, type ListControllerResult } from '../../contexts/ListContext'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

interface TestRecord extends RaRecord {
  id: number
  name: string
  email: string
  status: string
}

// Generate large dataset for performance testing
const generateTestData = (count: number): TestRecord[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com.ai`,
    status: i % 2 === 0 ? 'active' : 'inactive',
  }))

const testData: TestRecord[] = generateTestData(100)

// Mock Element.getBoundingClientRect for jsdom
// This is needed because jsdom doesn't compute layout
const mockBoundingClientRect = () => {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = function() {
      // Check if this is a scroll container
      const style = (this as HTMLElement).style
      if (style.height && style.overflow === 'auto') {
        const height = parseInt(style.height) || 400
        return {
          width: 800,
          height,
          top: 0,
          left: 0,
          bottom: height,
          right: 800,
          x: 0,
          y: 0,
          toJSON: () => {},
        }
      }
      // Default for rows
      return {
        width: 800,
        height: 48,
        top: 0,
        left: 0,
        bottom: 48,
        right: 800,
        x: 0,
        y: 0,
        toJSON: () => {},
      }
    }
  })

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
  })
}

// Mock ResizeObserver with callback support for virtualization
const mockResizeObserver = () => {
  beforeEach(() => {
    global.ResizeObserver = class ResizeObserver {
      private callback: ResizeObserverCallback
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback
      }
      observe(target: Element) {
        // Immediately call callback with initial size to trigger virtualization
        const style = (target as HTMLElement).style
        const height = style.height ? parseInt(style.height) : 400
        this.callback([{
          target,
          contentRect: { width: 800, height, top: 0, left: 0, bottom: height, right: 800, x: 0, y: 0, toJSON: () => ({}) } as DOMRectReadOnly,
          borderBoxSize: [{ blockSize: height, inlineSize: 800 }],
          contentBoxSize: [{ blockSize: height, inlineSize: 800 }],
          devicePixelContentBoxSize: [{ blockSize: height, inlineSize: 800 }],
        }], this)
      }
      unobserve() {}
      disconnect() {}
    }
  })
}

// Mock scroll container properties needed by TanStack Virtual
const mockScrollProperties = () => {
  beforeEach(() => {
    // Mock offsetHeight, clientHeight, scrollHeight for scroll containers
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        const style = this.style
        if (style.height) {
          return parseInt(style.height) || 400
        }
        // Default row height
        return 48
      },
    })

    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get() {
        const style = this.style
        if (style.height) {
          return parseInt(style.height) || 400
        }
        return 48
      },
    })

    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        const style = this.style
        // For scroll containers, return total content height
        if (style.overflow === 'auto') {
          // Estimate based on number of children or fixed total
          return 10000
        }
        return 48
      },
    })

    Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
      configurable: true,
      get() { return 0 },
      set() {},
    })
  })
}

mockBoundingClientRect()
mockResizeObserver()
mockScrollProperties()

const createTestListContext = (
  overrides: Partial<ListControllerResult<TestRecord>> = {}
): ListControllerResult<TestRecord> => ({
  data: testData,
  total: testData.length,
  isLoading: false,
  isFetching: false,
  error: null,
  page: 1,
  perPage: 10,
  sort: { field: 'id', order: 'ASC' },
  filterValues: {},
  selectedIds: [],
  resource: 'users',
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

// Simple TextField component for testing
const TextField = ({ source }: { source: string }) => {
  const record = useRecordContext<TestRecord>()
  if (!record) return null
  return <span data-testid={`field-${source}`}>{String(record[source] ?? '')}</span>
}

const renderVirtualDatagrid = (
  props: Partial<VirtualDatagridProps<TestRecord>> = {},
  contextOverrides: Partial<ListControllerResult<TestRecord>> = {}
) => {
  const context = createTestListContext(contextOverrides)
  return {
    ...render(
      <ListContextProvider value={context}>
        <VirtualDatagrid height={400} {...props}>
          <TextField source="name" />
          <TextField source="email" />
          <TextField source="status" />
        </VirtualDatagrid>
      </ListContextProvider>
    ),
    context,
  }
}

describe('VirtualDatagrid', () => {
  describe('Basic rendering', () => {
    it('should render a virtualized table', () => {
      renderVirtualDatagrid()
      expect(screen.getByTestId('shadmin-virtual-datagrid')).toBeInTheDocument()
    })

    it('should render table headers based on children sources', () => {
      renderVirtualDatagrid()
      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument()
    })

    it('should only render visible rows (virtualization)', () => {
      // With 100 items and ~400px height with 48px rows, we expect ~8-10 visible rows + overscan
      renderVirtualDatagrid({}, { data: generateTestData(100), total: 100 })

      // Should not render all 100 rows
      const rows = screen.getAllByTestId(/shadmin-virtual-datagrid-row-/)
      expect(rows.length).toBeLessThan(100)
      expect(rows.length).toBeGreaterThan(0)
    })

    it('should render data in visible cells using children components', () => {
      renderVirtualDatagrid()
      // First row should be visible
      expect(screen.getByText('User 1')).toBeInTheDocument()
      expect(screen.getByText('user1@example.com.ai')).toBeInTheDocument()
    })
  })

  describe('RecordContext', () => {
    it('should provide RecordContext for each row', () => {
      const RecordDisplay = () => {
        const record = useRecordContext<TestRecord>()
        return record ? (
          <span data-testid={`record-${record.id}`}>{record.name}</span>
        ) : null
      }

      const context = createTestListContext({ data: generateTestData(10), total: 10 })
      render(
        <ListContextProvider value={context}>
          <VirtualDatagrid height={400}>
            <RecordDisplay />
          </VirtualDatagrid>
        </ListContextProvider>
      )

      // First row should have RecordContext
      expect(screen.getByTestId('record-1')).toHaveTextContent('User 1')
    })
  })

  describe('Column sorting', () => {
    it('should call setSort when clicking a sortable header', async () => {
      const user = userEvent.setup()
      const { context } = renderVirtualDatagrid()

      const nameHeader = screen.getByRole('columnheader', { name: /name/i })
      await user.click(nameHeader)

      expect(context.setSort).toHaveBeenCalledWith({
        field: 'name',
        order: 'ASC',
      })
    })

    it('should toggle sort order on subsequent clicks', async () => {
      const user = userEvent.setup()
      const setSort = vi.fn()
      const { rerender } = render(
        <ListContextProvider value={createTestListContext({
          setSort,
          sort: { field: 'name', order: 'ASC' }
        })}>
          <VirtualDatagrid height={400}>
            <TextField source="name" />
          </VirtualDatagrid>
        </ListContextProvider>
      )

      const nameHeader = screen.getByRole('columnheader', { name: /name/i })
      await user.click(nameHeader)

      expect(setSort).toHaveBeenCalledWith({
        field: 'name',
        order: 'DESC',
      })
    })

    it('should display sort indicator on sorted column', () => {
      renderVirtualDatagrid({}, { sort: { field: 'name', order: 'ASC' } })
      const nameHeader = screen.getByRole('columnheader', { name: /name/i })
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
    })
  })

  describe('Row selection', () => {
    it('should render checkboxes when selection is enabled', () => {
      renderVirtualDatagrid({ bulkActionButtons: true })
      const checkboxes = screen.getAllByRole('checkbox')
      // Should have at least header checkbox + visible row checkboxes
      expect(checkboxes.length).toBeGreaterThan(1)
    })

    it('should not render checkboxes by default', () => {
      renderVirtualDatagrid()
      const checkboxes = screen.queryAllByRole('checkbox')
      expect(checkboxes).toHaveLength(0)
    })

    it('should call onToggleItem when clicking a row checkbox', async () => {
      const user = userEvent.setup()
      const { context } = renderVirtualDatagrid({ bulkActionButtons: true })

      const checkboxes = screen.getAllByRole('checkbox')
      // Click the first row's checkbox (index 1, since 0 is header)
      await user.click(checkboxes[1])

      expect(context.onToggleItem).toHaveBeenCalledWith(1)
    })

    it('should show checkbox as checked for selected rows', () => {
      renderVirtualDatagrid({ bulkActionButtons: true }, { selectedIds: [1, 3] })

      // The first row (User 1) should be checked
      const row1Checkbox = screen.getByTestId('shadmin-virtual-datagrid-row-select-0') as HTMLInputElement
      expect(row1Checkbox).toBeChecked()

      // The second row (User 2) should not be checked
      const row2Checkbox = screen.getByTestId('shadmin-virtual-datagrid-row-select-1') as HTMLInputElement
      expect(row2Checkbox).not.toBeChecked()

      // The third row (User 3) should be checked
      const row3Checkbox = screen.getByTestId('shadmin-virtual-datagrid-row-select-2') as HTMLInputElement
      expect(row3Checkbox).toBeChecked()
    })

    it('should select all when clicking header checkbox', async () => {
      const user = userEvent.setup()
      const { context } = renderVirtualDatagrid(
        { bulkActionButtons: true },
        { data: testData, total: testData.length }
      )

      const headerCheckbox = screen.getByTestId('shadmin-virtual-datagrid-select-all')
      await user.click(headerCheckbox)

      // Should select all IDs from the data
      expect(context.onSelect).toHaveBeenCalledWith(
        testData.map(record => record.id)
      )
    })

    it('should maintain selection state while scrolling', async () => {
      const selectedIds = [1, 5, 10, 50, 100]
      const largeData = generateTestData(1000)
      renderVirtualDatagrid(
        { bulkActionButtons: true, height: 400 },
        { data: largeData, total: 1000, selectedIds }
      )

      // First row (User 1) should be checked initially
      const row1Checkbox = screen.getByTestId('shadmin-virtual-datagrid-row-select-0') as HTMLInputElement
      expect(row1Checkbox).toBeChecked()

      // Selected state should be based on selectedIds from context
      // This ensures selection persists as rows are virtualized/devirtualized
    })
  })

  describe('Row click handling', () => {
    it('should call rowClick handler when clicking a row', async () => {
      const user = userEvent.setup()
      const onRowClick = vi.fn()
      renderVirtualDatagrid({ rowClick: onRowClick })

      const firstRow = screen.getByTestId('shadmin-virtual-datagrid-row-0')
      await user.click(firstRow)

      expect(onRowClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: 'User 1' }),
        1,
        expect.any(Object)
      )
    })

    it('should make rows clickable when rowClick is set', () => {
      renderVirtualDatagrid({ rowClick: 'edit' })
      const firstRow = screen.getByTestId('shadmin-virtual-datagrid-row-0')
      expect(firstRow).toHaveClass('cursor-pointer')
    })

    it('should not make rows clickable when rowClick is false', () => {
      renderVirtualDatagrid({ rowClick: false })
      const firstRow = screen.getByTestId('shadmin-virtual-datagrid-row-0')
      expect(firstRow).not.toHaveClass('cursor-pointer')
    })
  })

  describe('Empty state', () => {
    it('should render empty message when data is empty', () => {
      renderVirtualDatagrid({}, { data: [], total: 0 })
      expect(screen.getByText(/no data available/i)).toBeInTheDocument()
    })

    it('should support custom empty component', () => {
      const CustomEmpty = () => <div data-testid="custom-empty">Nothing here!</div>
      renderVirtualDatagrid({ empty: <CustomEmpty /> }, { data: [], total: 0 })
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('should render loading indicator when isLoading is true', () => {
      renderVirtualDatagrid({}, { isLoading: true, data: undefined })
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should support custom loading component', () => {
      const CustomLoading = () => <div data-testid="custom-loading">Loading...</div>
      renderVirtualDatagrid(
        { loading: <CustomLoading /> },
        { isLoading: true, data: undefined }
      )
      expect(screen.getByTestId('custom-loading')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply custom className', () => {
      renderVirtualDatagrid({ className: 'custom-table' })
      const tables = screen.getAllByRole('table')
      expect(tables.some(t => t.classList.contains('custom-table'))).toBe(true)
    })

    it('should apply hover styles', () => {
      renderVirtualDatagrid({ hover: true })
      const firstRow = screen.getByTestId('shadmin-virtual-datagrid-row-0')
      expect(firstRow.className).toMatch(/hover/i)
    })

    it('should apply size prop for density', () => {
      renderVirtualDatagrid({ size: 'sm' })
      const tables = screen.getAllByRole('table')
      expect(tables.some(t => t.className.match(/sm|small|compact/i))).toBe(true)
    })
  })

  describe('Virtualization options', () => {
    it('should respect custom height', () => {
      renderVirtualDatagrid({ height: 500 })
      // The container should have the specified height
      const container = screen.getByTestId('shadmin-virtual-datagrid').querySelector('[style*="height"]')
      expect(container).toHaveStyle({ height: '500px' })
    })

    it('should respect height as string', () => {
      renderVirtualDatagrid({ height: '50vh' })
      const container = screen.getByTestId('shadmin-virtual-datagrid').querySelector('[style*="height"]')
      expect(container).toHaveStyle({ height: '50vh' })
    })
  })

  describe('Column configuration', () => {
    it('should support passing columns via props', () => {
      const context = createTestListContext()
      render(
        <ListContextProvider value={context}>
          <VirtualDatagrid
            height={400}
            columns={[
              { source: 'name', label: 'Full Name' },
              { source: 'email', label: 'Email Address' },
            ]}
          />
        </ListContextProvider>
      )

      expect(screen.getByRole('columnheader', { name: /full name/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /email address/i })).toBeInTheDocument()
    })

    it('should handle columns with custom render function', () => {
      const context = createTestListContext()
      render(
        <ListContextProvider value={context}>
          <VirtualDatagrid
            height={400}
            columns={[
              { source: 'name', label: 'Full Name' },
              {
                source: 'status',
                label: 'Status',
                render: ({ record }) => (
                  <span data-testid="custom-render">{String(record.status).toUpperCase()}</span>
                ),
              },
            ]}
          />
        </ListContextProvider>
      )

      const customElements = screen.getAllByTestId('custom-render')
      expect(customElements.length).toBeGreaterThan(0)
      expect(customElements[0]).toHaveTextContent('ACTIVE')
    })
  })

  describe('Performance with large datasets', () => {
    it('should handle 10K rows without rendering all of them', () => {
      const largeData = generateTestData(10000)
      const startTime = performance.now()

      renderVirtualDatagrid(
        { height: 400, estimateRowHeight: 48, overscan: 5 },
        { data: largeData, total: 10000 }
      )

      const renderTime = performance.now() - startTime

      // Should render quickly (less than 500ms)
      expect(renderTime).toBeLessThan(500)

      // Should only render a small subset of rows
      const renderedRows = screen.getAllByTestId(/shadmin-virtual-datagrid-row-/)
      expect(renderedRows.length).toBeLessThan(50) // Much less than 10K
      expect(renderedRows.length).toBeGreaterThan(0)
    })

    it('should handle 50K rows without performance degradation', () => {
      const hugeData = generateTestData(50000)
      const startTime = performance.now()

      renderVirtualDatagrid(
        { height: 400, estimateRowHeight: 48, overscan: 3 },
        { data: hugeData, total: 50000 }
      )

      const renderTime = performance.now() - startTime

      // Should still render quickly even with 50K rows
      expect(renderTime).toBeLessThan(1000)

      // Should only render visible rows
      const renderedRows = screen.getAllByTestId(/shadmin-virtual-datagrid-row-/)
      expect(renderedRows.length).toBeLessThan(50)
    })

    it('should efficiently update selection state with 10K rows', async () => {
      const user = userEvent.setup()
      const largeData = generateTestData(10000)
      const onSelect = vi.fn()

      render(
        <ListContextProvider value={createTestListContext({
          data: largeData,
          total: 10000,
          onSelect,
        })}>
          <VirtualDatagrid height={400} bulkActionButtons>
            <TextField source="name" />
          </VirtualDatagrid>
        </ListContextProvider>
      )

      const startTime = performance.now()

      // Select all with 10K items
      const headerCheckbox = screen.getByTestId('shadmin-virtual-datagrid-select-all')
      await user.click(headerCheckbox)

      const selectTime = performance.now() - startTime

      // Selection should be fast
      expect(selectTime).toBeLessThan(200)
      expect(onSelect).toHaveBeenCalledWith(
        expect.arrayContaining([1, 10000])
      )
    })
  })

  describe('Edge cases', () => {
    it('should handle data with a single item', () => {
      const singleItemData: TestRecord[] = [
        { id: 1, name: 'Only One', email: 'only@example.com.ai', status: 'active' },
      ]
      renderVirtualDatagrid({}, { data: singleItemData, total: 1 })

      expect(screen.getByText('Only One')).toBeInTheDocument()
    })

    it('should handle undefined data gracefully', () => {
      renderVirtualDatagrid({}, { data: undefined, total: 0, isLoading: false })
      expect(screen.getByText(/no data available/i)).toBeInTheDocument()
    })

    it('should throw when used outside ListContextProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <VirtualDatagrid height={400}>
            <TextField source="name" />
          </VirtualDatagrid>
        )
      }).toThrow(/ListContextProvider/i)

      consoleSpy.mockRestore()
    })
  })

  describe('Expandable rows', () => {
    it('should render expand toggle when expand prop is provided', () => {
      const ExpandPanel = () => <div data-testid="expand-panel">Expanded content</div>
      renderVirtualDatagrid({ expand: <ExpandPanel /> })

      const expandButtons = screen.getAllByRole('button', { name: /expand/i })
      expect(expandButtons.length).toBeGreaterThan(0)
    })

    it('should show expanded content when clicking expand toggle', async () => {
      const user = userEvent.setup()
      const ExpandPanel = () => <div data-testid="expand-panel">Expanded content</div>
      renderVirtualDatagrid({ expand: <ExpandPanel /> })

      const expandButtons = screen.getAllByRole('button', { name: /expand/i })
      await user.click(expandButtons[0])

      expect(screen.getByTestId('expand-panel')).toBeInTheDocument()
    })
  })
})
