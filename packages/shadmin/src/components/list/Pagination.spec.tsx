/**
 * Pagination Component Tests
 * Following TDD: RED phase - write failing tests first
 *
 * Tests cover:
 * - Basic rendering with page count
 * - Page navigation (prev/next/specific page)
 * - PerPage selector integration
 * - Disabled states at first/last page
 * - Integration with ListContext
 * - react-admin API compatibility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { Pagination } from './Pagination'
import { ListContextProvider, type ListControllerResult } from '../../contexts/ListContext'

// Helper to create mock ListContext value
const createMockListContext = (overrides: Partial<ListControllerResult> = {}): ListControllerResult => ({
  data: [],
  total: 100,
  isLoading: false,
  isFetching: false,
  error: null,
  page: 1,
  perPage: 10,
  sort: { field: 'id', order: 'ASC' },
  filterValues: {},
  selectedIds: [],
  resource: 'posts',
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

// Wrapper component for testing with ListContext
const TestWrapper = ({
  children,
  contextValue,
}: {
  children: React.ReactNode
  contextValue: ListControllerResult
}) => <ListContextProvider value={contextValue}>{children}</ListContextProvider>

describe('<Pagination />', () => {
  describe('Basic Rendering', () => {
    it('renders pagination with correct page count', () => {
      const context = createMockListContext({ total: 100, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Should show pagination component
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('renders page numbers', () => {
      const context = createMockListContext({ total: 50, perPage: 10, page: 1 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Should display page 1
      expect(screen.getByRole('button', { name: /page 1/i })).toBeInTheDocument()
    })

    it('renders previous and next buttons', () => {
      const context = createMockListContext({ total: 50, perPage: 10, page: 2 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('highlights the current page', () => {
      const context = createMockListContext({ total: 50, perPage: 10, page: 3 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      const currentPageButton = screen.getByRole('button', { name: /page 3/i })
      expect(currentPageButton).toHaveAttribute('aria-current', 'page')
    })

    it('does not render when total is 0', () => {
      const context = createMockListContext({ total: 0, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })

    it('does not render when total is undefined', () => {
      const context = createMockListContext({ total: undefined, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })

    it('does not render when only one page', () => {
      const context = createMockListContext({ total: 5, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })
  })

  describe('Page Navigation', () => {
    it('calls setPage when clicking a page number', () => {
      const setPage = vi.fn()
      const context = createMockListContext({
        total: 50,
        perPage: 10,
        page: 1,
        setPage,
      })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      fireEvent.click(screen.getByRole('button', { name: /page 2/i }))
      expect(setPage).toHaveBeenCalledWith(2)
    })

    it('calls setPage when clicking next button', () => {
      const setPage = vi.fn()
      const context = createMockListContext({
        total: 50,
        perPage: 10,
        page: 2,
        setPage,
      })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(setPage).toHaveBeenCalledWith(3)
    })

    it('calls setPage when clicking previous button', () => {
      const setPage = vi.fn()
      const context = createMockListContext({
        total: 50,
        perPage: 10,
        page: 3,
        setPage,
      })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(setPage).toHaveBeenCalledWith(2)
    })

    it('does not call setPage when clicking current page', () => {
      const setPage = vi.fn()
      const context = createMockListContext({
        total: 50,
        perPage: 10,
        page: 2,
        setPage,
      })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      fireEvent.click(screen.getByRole('button', { name: /page 2/i }))
      expect(setPage).not.toHaveBeenCalled()
    })
  })

  describe('Disabled States', () => {
    it('disables previous button on first page', () => {
      const context = createMockListContext({ total: 50, perPage: 10, page: 1 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    })

    it('enables previous button on pages after first', () => {
      const context = createMockListContext({ total: 50, perPage: 10, page: 2 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: /previous/i })).not.toBeDisabled()
    })

    it('disables next button on last page', () => {
      const context = createMockListContext({ total: 50, perPage: 10, page: 5 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
    })

    it('enables next button on pages before last', () => {
      const context = createMockListContext({ total: 50, perPage: 10, page: 4 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
    })
  })

  describe('Ellipsis for Large Page Counts', () => {
    it('shows ellipsis when there are many pages', () => {
      const context = createMockListContext({ total: 1000, perPage: 10, page: 50 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Should show ellipsis indicators
      expect(screen.getAllByText('...').length).toBeGreaterThan(0)
    })

    it('shows first page link when not at start', () => {
      const context = createMockListContext({ total: 1000, perPage: 10, page: 50 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: /go to page 1$/i })).toBeInTheDocument()
    })

    it('shows last page link when not at end', () => {
      const context = createMockListContext({ total: 1000, perPage: 10, page: 50 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: /page 100/i })).toBeInTheDocument()
    })
  })

  describe('RowsPerPage Selector', () => {
    it('renders rows per page selector by default', () => {
      const context = createMockListContext({ total: 100, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('displays current perPage value', () => {
      const context = createMockListContext({ total: 100, perPage: 25 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('combobox')).toHaveTextContent('25')
    })

    it('calls setPerPage when selection changes', () => {
      const setPerPage = vi.fn()
      const context = createMockListContext({
        total: 100,
        perPage: 10,
        setPerPage,
      })

      render(
        <TestWrapper contextValue={context}>
          <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
        </TestWrapper>
      )

      // Open the select and click an option
      fireEvent.click(screen.getByRole('combobox'))
      fireEvent.click(screen.getByRole('option', { name: '25' }))

      expect(setPerPage).toHaveBeenCalledWith(25)
    })

    it('uses custom rowsPerPageOptions when provided', () => {
      const context = createMockListContext({ total: 100, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination rowsPerPageOptions={[5, 15, 30]} />
        </TestWrapper>
      )

      fireEvent.click(screen.getByRole('combobox'))

      expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: '15' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: '30' })).toBeInTheDocument()
    })

    it('hides rows per page selector when rowsPerPageOptions is empty', () => {
      const context = createMockListContext({ total: 100, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination rowsPerPageOptions={[]} />
        </TestWrapper>
      )

      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    })

    it('resets to page 1 when perPage changes', () => {
      const setPage = vi.fn()
      const setPerPage = vi.fn()
      const context = createMockListContext({
        total: 100,
        perPage: 10,
        page: 5,
        setPage,
        setPerPage,
      })

      render(
        <TestWrapper contextValue={context}>
          <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
        </TestWrapper>
      )

      fireEvent.click(screen.getByRole('combobox'))
      fireEvent.click(screen.getByRole('option', { name: '25' }))

      expect(setPage).toHaveBeenCalledWith(1)
      expect(setPerPage).toHaveBeenCalledWith(25)
    })
  })

  describe('React-Admin API Compatibility', () => {
    it('accepts limit prop as alias for rowsPerPageOptions', () => {
      const context = createMockListContext({ total: 100, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination limit={<></>} />
        </TestWrapper>
      )

      // Should still render pagination
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('displays record count information', () => {
      const context = createMockListContext({
        total: 100,
        perPage: 10,
        page: 2,
      })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Should show "11-20 of 100"
      expect(screen.getByText(/11-20 of 100/i)).toBeInTheDocument()
    })

    it('accepts custom className', () => {
      const context = createMockListContext({ total: 50, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination className="custom-pagination" />
        </TestWrapper>
      )

      expect(screen.getByRole('navigation').parentElement).toHaveClass('custom-pagination')
    })

    it('forwards additional props', () => {
      const context = createMockListContext({ total: 50, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination data-testid="my-pagination" />
        </TestWrapper>
      )

      expect(screen.getByTestId('my-pagination')).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('renders skeleton when loading and no data', () => {
      const context = createMockListContext({
        total: undefined,
        isLoading: true,
        data: undefined,
      })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Should not crash, may show nothing or skeleton
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })

    it('keeps showing pagination while refetching', () => {
      const context = createMockListContext({
        total: 50,
        perPage: 10,
        isFetching: true,
        isLoading: false,
      })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper navigation role', () => {
      const context = createMockListContext({ total: 50, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('has aria-label on navigation', () => {
      const context = createMockListContext({ total: 50, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'pagination')
    })

    it('uses aria-current for current page', () => {
      const context = createMockListContext({ total: 50, perPage: 10, page: 2 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      const currentButton = screen.getByRole('button', { name: /page 2/i })
      expect(currentButton).toHaveAttribute('aria-current', 'page')
    })
  })
})

describe('<Pagination /> with standalone props', () => {
  it('works with explicit props instead of context', () => {
    const setPage = vi.fn()
    const setPerPage = vi.fn()

    render(
      <Pagination
        page={2}
        perPage={10}
        total={50}
        setPage={setPage}
        setPerPage={setPerPage}
      />
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /page 2/i })).toHaveAttribute('aria-current', 'page')
  })

  it('props override context values', () => {
    const contextSetPage = vi.fn()
    const propsSetPage = vi.fn()
    const context = createMockListContext({
      total: 50,
      perPage: 10,
      page: 1,
      setPage: contextSetPage,
    })

    render(
      <TestWrapper contextValue={context}>
        <Pagination page={3} setPage={propsSetPage} />
      </TestWrapper>
    )

    // Should show page 3 as current (from props)
    expect(screen.getByRole('button', { name: /page 3/i })).toHaveAttribute('aria-current', 'page')

    // Click page 2
    fireEvent.click(screen.getByRole('button', { name: /page 2/i }))
    expect(propsSetPage).toHaveBeenCalledWith(2)
    expect(contextSetPage).not.toHaveBeenCalled()
  })
})

describe('<Pagination /> Edge Cases', () => {
  describe('Boundary conditions', () => {
    it('handles exactly 2 pages', () => {
      const context = createMockListContext({ total: 20, perPage: 10, page: 1 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: /page 1/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /page 2/i })).toBeInTheDocument()
      expect(screen.queryByText('...')).not.toBeInTheDocument()
    })

    it('handles page beyond total pages', () => {
      const context = createMockListContext({ total: 50, perPage: 10, page: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Should still render, last page button disabled
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
    })

    it('handles very large page count', () => {
      const context = createMockListContext({ total: 10000, perPage: 10, page: 500 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Should show ellipsis and navigation
      expect(screen.getAllByText('...').length).toBeGreaterThan(0)
      expect(screen.getByRole('button', { name: /page 1$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /page 1000/i })).toBeInTheDocument()
    })

    it('handles page 1 when going to previous', () => {
      const setPage = vi.fn()
      const context = createMockListContext({ total: 50, perPage: 10, page: 1, setPage })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Previous button should be disabled on first page
      const prevButton = screen.getByRole('button', { name: /previous/i })
      expect(prevButton).toBeDisabled()
      fireEvent.click(prevButton)
      expect(setPage).not.toHaveBeenCalled()
    })

    it('handles last page when going to next', () => {
      const setPage = vi.fn()
      const context = createMockListContext({ total: 50, perPage: 10, page: 5, setPage })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Next button should be disabled on last page
      const nextButton = screen.getByRole('button', { name: /next/i })
      expect(nextButton).toBeDisabled()
      fireEvent.click(nextButton)
      expect(setPage).not.toHaveBeenCalled()
    })

    it('handles total that is not evenly divisible by perPage', () => {
      const context = createMockListContext({ total: 57, perPage: 10, page: 6 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Should calculate 6 total pages (57/10 = 5.7, ceil = 6)
      expect(screen.getByRole('button', { name: /page 6/i })).toBeInTheDocument()
      expect(screen.getByText(/51-57 of 57/i)).toBeInTheDocument()
    })
  })

  describe('Record count display', () => {
    it('shows correct range for first page', () => {
      const context = createMockListContext({ total: 100, perPage: 10, page: 1 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByText(/1-10 of 100/i)).toBeInTheDocument()
    })

    it('shows correct range for last page with partial records', () => {
      const context = createMockListContext({ total: 95, perPage: 10, page: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByText(/91-95 of 95/i)).toBeInTheDocument()
    })

    it('shows correct range for middle page', () => {
      const context = createMockListContext({ total: 100, perPage: 25, page: 2 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByText(/26-50 of 100/i)).toBeInTheDocument()
    })
  })

  describe('siblingCount and boundaryCount', () => {
    it('respects custom siblingCount', () => {
      const context = createMockListContext({ total: 200, perPage: 10, page: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination siblingCount={2} />
        </TestWrapper>
      )

      // With siblingCount=2, should show pages 8, 9, 10, 11, 12 around current
      expect(screen.getByRole('button', { name: /page 8/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /page 12/i })).toBeInTheDocument()
    })

    it('respects custom boundaryCount', () => {
      const context = createMockListContext({ total: 200, perPage: 10, page: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination boundaryCount={2} />
        </TestWrapper>
      )

      // With boundaryCount=2, should show first 2 and last 2 pages
      expect(screen.getByRole('button', { name: /go to page 1$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go to page 2$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go to page 19$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go to page 20$/i })).toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('works without context when all props are provided', () => {
      const setPage = vi.fn()
      const setPerPage = vi.fn()

      // Render without ListContext
      render(
        <Pagination
          page={1}
          perPage={10}
          total={50}
          setPage={setPage}
          setPerPage={setPerPage}
        />
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('handles edge case of page greater than calculated total pages', () => {
      const setPage = vi.fn()
      const context = createMockListContext({ total: 50, perPage: 10, page: 10, setPage })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      // Page 10 is beyond the 5 total pages, but component should still render
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  describe('Empty and single page scenarios', () => {
    it('does not render when there are exactly perPage items', () => {
      const context = createMockListContext({ total: 10, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })

    it('renders when there are perPage+1 items', () => {
      const context = createMockListContext({ total: 11, perPage: 10 })

      render(
        <TestWrapper contextValue={context}>
          <Pagination />
        </TestWrapper>
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })
})
