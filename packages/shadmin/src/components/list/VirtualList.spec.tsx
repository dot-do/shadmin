import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VirtualList, type VirtualListProps } from './VirtualList'
import { ListContextProvider, type ListControllerResult } from '../../contexts/ListContext'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

interface TestRecord extends RaRecord {
  id: number
  name: string
  email: string
  description: string
  status: string
}

// Generate large dataset for performance testing
const generateTestData = (count: number): TestRecord[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    description: `Description for user ${i + 1}. This is some longer text that might vary in height.`,
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
        height: 72,
        top: 0,
        left: 0,
        bottom: 72,
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
        return 72
      },
    })

    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get() {
        const style = this.style
        if (style.height) {
          return parseInt(style.height) || 400
        }
        return 72
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
        return 72
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

const renderVirtualList = (
  props: Partial<VirtualListProps<TestRecord>> = {},
  contextOverrides: Partial<ListControllerResult<TestRecord>> = {}
) => {
  const context = createTestListContext(contextOverrides)
  return {
    ...render(
      <ListContextProvider value={context}>
        <VirtualList
          height={400}
          primaryText={(record) => record.name}
          secondaryText={(record) => record.email}
          {...props}
        />
      </ListContextProvider>
    ),
    context,
  }
}

describe('VirtualList', () => {
  describe('Basic rendering', () => {
    it('should render a virtualized list', () => {
      renderVirtualList()
      expect(screen.getByTestId('shadmin-virtual-list')).toBeInTheDocument()
    })

    it('should render list items', () => {
      renderVirtualList()
      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('should only render visible items (virtualization)', () => {
      // With 100 items and 400px height with ~72px items, we expect ~5-6 visible items + overscan
      renderVirtualList({}, { data: generateTestData(100), total: 100 })

      // Should not render all 100 items
      const items = screen.getAllByTestId(/shadmin-virtual-list-item-/)
      expect(items.length).toBeLessThan(100)
      expect(items.length).toBeGreaterThan(0)
    })

    it('should render primary and secondary text', () => {
      renderVirtualList()
      expect(screen.getByText('User 1')).toBeInTheDocument()
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    })

    it('should render tertiary text', () => {
      renderVirtualList({
        tertiaryText: (record) => record.status,
      })
      // First row should show status - multiple rows may have 'active' so use getAllBy
      const activeStatuses = screen.getAllByText('active')
      expect(activeStatuses.length).toBeGreaterThan(0)
    })
  })

  describe('RecordContext', () => {
    it('should provide RecordContext for each item', () => {
      const RecordDisplay = () => {
        const record = useRecordContext<TestRecord>()
        return record ? (
          <span data-testid={`record-${record.id}`}>{record.name}</span>
        ) : null
      }

      const context = createTestListContext({ data: generateTestData(10), total: 10 })
      render(
        <ListContextProvider value={context}>
          <VirtualList
            height={400}
            primaryText={() => <RecordDisplay />}
          />
        </ListContextProvider>
      )

      expect(screen.getByTestId('record-1')).toHaveTextContent('User 1')
    })
  })

  describe('Avatars and Icons', () => {
    it('should render left avatar', () => {
      renderVirtualList({
        leftAvatar: (record) => <div data-testid={`avatar-${record.id}`}>A</div>,
      })
      expect(screen.getByTestId('avatar-1')).toBeInTheDocument()
    })

    it('should render right avatar', () => {
      renderVirtualList({
        rightAvatar: (record) => <div data-testid={`avatar-right-${record.id}`}>R</div>,
      })
      expect(screen.getByTestId('avatar-right-1')).toBeInTheDocument()
    })

    it('should render left icon', () => {
      renderVirtualList({
        leftIcon: (record) => <span data-testid={`icon-${record.id}`}>*</span>,
      })
      expect(screen.getByTestId('icon-1')).toBeInTheDocument()
    })

    it('should render right icon', () => {
      renderVirtualList({
        rightIcon: (record) => <span data-testid={`icon-right-${record.id}`}>{'>'}</span>,
      })
      expect(screen.getByTestId('icon-right-1')).toBeInTheDocument()
    })
  })

  describe('Row click handling', () => {
    it('should call rowClick handler when clicking an item', async () => {
      const user = userEvent.setup()
      const rowClick = vi.fn()
      renderVirtualList({ rowClick, linkType: false })

      const firstItem = screen.getByTestId('shadmin-virtual-list-item-0')
      const clickableContent = firstItem.querySelector('.cursor-pointer')
      expect(clickableContent).not.toBeNull()
      await user.click(clickableContent!)

      expect(rowClick).toHaveBeenCalledWith(1, 'users', expect.objectContaining({ id: 1 }))
    })
  })

  describe('Links', () => {
    it('should generate edit links by default', () => {
      renderVirtualList()
      // Multiple links are rendered due to virtualization, find the first one for User 1
      const links = screen.getAllByRole('link')
      const user1Link = links.find(l => l.getAttribute('href')?.includes('/1/edit'))
      expect(user1Link).toHaveAttribute('href', '/users/1/edit')
    })

    it('should generate show links when linkType is show', () => {
      renderVirtualList({ linkType: 'show' })
      const links = screen.getAllByRole('link')
      const user1Link = links.find(l => l.getAttribute('href')?.includes('/1/show'))
      expect(user1Link).toHaveAttribute('href', '/users/1/show')
    })

    it('should not render links when linkType is false', () => {
      renderVirtualList({ linkType: false })
      const links = screen.queryAllByRole('link')
      expect(links).toHaveLength(0)
    })

    it('should use custom link function', () => {
      renderVirtualList({
        linkType: (record, id) => `/custom/${id}`,
      })
      const links = screen.getAllByRole('link')
      const user1Link = links.find(l => l.getAttribute('href') === '/custom/1')
      expect(user1Link).toHaveAttribute('href', '/custom/1')
    })
  })

  describe('Empty state', () => {
    it('should render empty message when data is empty', () => {
      renderVirtualList({}, { data: [], total: 0 })
      expect(screen.getByText(/no records found/i)).toBeInTheDocument()
    })

    it('should support custom empty component', () => {
      const CustomEmpty = () => <div data-testid="custom-empty">Nothing here!</div>
      renderVirtualList({ empty: <CustomEmpty /> }, { data: [], total: 0 })
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('should render loading indicator when isLoading is true', () => {
      renderVirtualList({}, { isLoading: true, data: undefined })
      // Should show skeleton items
      const skeletons = screen.getAllByClassName ? [] : document.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('Styling', () => {
    it('should apply custom className', () => {
      renderVirtualList({ className: 'custom-list' })
      const list = screen.getByTestId('shadmin-virtual-list')
      expect(list).toHaveClass('custom-list')
    })

    it('should apply rowStyle function', () => {
      renderVirtualList({
        rowStyle: (record) => ({
          backgroundColor: record.status === 'active' ? 'green' : 'red',
        }),
      })
      // Should have inline styles applied - first record (id: 1) has status 'active' (even id)
      const firstItem = screen.getByTestId('shadmin-virtual-list-item-0')
      const content = firstItem.querySelector('.flex')
      expect(content).toBeInTheDocument()
      // Check that style attribute contains the expected background-color
      expect(content).toHaveAttribute('style', expect.stringContaining('background-color'))
    })
  })

  describe('Virtualization options', () => {
    it('should respect custom height', () => {
      renderVirtualList({ height: 500 })
      const container = screen.getByTestId('shadmin-virtual-list')
      expect(container).toHaveStyle({ height: '500px' })
    })

    it('should respect height as string', () => {
      renderVirtualList({ height: '50vh' })
      const container = screen.getByTestId('shadmin-virtual-list')
      expect(container).toHaveStyle({ height: '50vh' })
    })
  })

  describe('Performance with large datasets', () => {
    it('should handle 10K items without rendering all of them', () => {
      const largeData = generateTestData(10000)
      const startTime = performance.now()

      renderVirtualList(
        { height: 400, estimateItemHeight: 72, overscan: 5 },
        { data: largeData, total: 10000 }
      )

      const renderTime = performance.now() - startTime

      // Should render quickly (less than 500ms)
      expect(renderTime).toBeLessThan(500)

      // Should only render a small subset of items
      const renderedItems = screen.getAllByTestId(/shadmin-virtual-list-item-/)
      expect(renderedItems.length).toBeLessThan(50) // Much less than 10K
      expect(renderedItems.length).toBeGreaterThan(0)
    })

    it('should handle 50K items without performance degradation', () => {
      const hugeData = generateTestData(50000)
      const startTime = performance.now()

      renderVirtualList(
        { height: 400, estimateItemHeight: 72, overscan: 3 },
        { data: hugeData, total: 50000 }
      )

      const renderTime = performance.now() - startTime

      // Should still render quickly even with 50K items
      expect(renderTime).toBeLessThan(1000)

      // Should only render visible items
      const renderedItems = screen.getAllByTestId(/shadmin-virtual-list-item-/)
      expect(renderedItems.length).toBeLessThan(50)
    })
  })

  describe('Edge cases', () => {
    it('should handle data with a single item', () => {
      const singleItemData: TestRecord[] = [
        { id: 1, name: 'Only One', email: 'only@example.com', description: 'desc', status: 'active' },
      ]
      renderVirtualList({}, { data: singleItemData, total: 1 })

      expect(screen.getByText('Only One')).toBeInTheDocument()
    })

    it('should handle undefined data gracefully', () => {
      renderVirtualList({}, { data: undefined, total: 0, isLoading: false })
      expect(screen.getByText(/no records found/i)).toBeInTheDocument()
    })

    it('should throw when used outside ListContextProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <VirtualList
            height={400}
            primaryText={(record: TestRecord) => record.name}
          />
        )
      }).toThrow(/ListContextProvider/i)

      consoleSpy.mockRestore()
    })

    it('should handle null values in record fields', () => {
      const dataWithNulls = [
        { id: 1, name: null, email: 'test@example.com', description: 'desc', status: 'active' },
      ] as unknown as TestRecord[]

      renderVirtualList(
        { primaryText: (record) => record.name || 'No name' },
        { data: dataWithNulls, total: 1 }
      )

      expect(screen.getByText('No name')).toBeInTheDocument()
    })
  })

  describe('Primary text variations', () => {
    it('should accept primaryText as a field name string', () => {
      renderVirtualList({ primaryText: 'name' })
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    it('should accept primaryText as a function', () => {
      renderVirtualList({
        primaryText: (record) => `Hello, ${record.name}!`,
      })
      expect(screen.getByText('Hello, User 1!')).toBeInTheDocument()
    })
  })
})
