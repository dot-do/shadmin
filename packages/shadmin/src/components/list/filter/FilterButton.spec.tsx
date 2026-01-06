/**
 * FilterButton component tests
 * TDD: RED phase - Write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterButton } from './FilterButton'
import {
  ListContextProvider,
  type ListControllerResult,
} from '@/contexts/ListContext'

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

describe('FilterButton', () => {
  describe('rendering', () => {
    it('renders as a button', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders with default label "Filters"', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByText('Filters')).toBeInTheDocument()
    })

    it('renders with custom label', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton label="Advanced Filters" />
        </ListContextProvider>
      )

      expect(screen.getByText('Advanced Filters')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton className="custom-button-class" />
        </ListContextProvider>
      )

      expect(screen.getByRole('button')).toHaveClass('custom-button-class')
    })
  })

  describe('toggle visibility', () => {
    it('calls onToggle when clicked', async () => {
      const onToggle = vi.fn()
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton onToggle={onToggle} />
        </ListContextProvider>
      )

      await userEvent.click(screen.getByRole('button'))

      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('toggles internal state when no onToggle provided', async () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      const button = screen.getByRole('button')

      // Initially not expanded
      expect(button).toHaveAttribute('aria-expanded', 'false')

      await userEvent.click(button)

      // After click, should be expanded
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('respects controlled isOpen prop', () => {
      const contextValue = createTestListContext()

      const { rerender } = render(
        <ListContextProvider value={contextValue}>
          <FilterButton isOpen={false} />
        </ListContextProvider>
      )

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'false'
      )

      rerender(
        <ListContextProvider value={contextValue}>
          <FilterButton isOpen={true} />
        </ListContextProvider>
      )

      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('active filter count', () => {
    it('does not show count when no filters are active', () => {
      const contextValue = createTestListContext({ filterValues: {} })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.queryByTestId('filter-count')).not.toBeInTheDocument()
    })

    it('shows count when filters are active', () => {
      const contextValue = createTestListContext({
        filterValues: { status: 'active', category: 'tech' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByTestId('filter-count')).toHaveTextContent('2')
    })

    it('shows count of 1 for single active filter', () => {
      const contextValue = createTestListContext({
        filterValues: { status: 'active' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByTestId('filter-count')).toHaveTextContent('1')
    })

    it('excludes empty string values from count', () => {
      const contextValue = createTestListContext({
        filterValues: { status: 'active', search: '', category: '' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByTestId('filter-count')).toHaveTextContent('1')
    })

    it('excludes null and undefined values from count', () => {
      const contextValue = createTestListContext({
        filterValues: { status: 'active', search: null, category: undefined },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByTestId('filter-count')).toHaveTextContent('1')
    })
  })

  describe('visual states', () => {
    it('shows active styling when filters are applied', () => {
      const contextValue = createTestListContext({
        filterValues: { status: 'active' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByRole('button')).toHaveAttribute('data-has-filters', 'true')
    })

    it('does not show active styling when no filters', () => {
      const contextValue = createTestListContext({ filterValues: {} })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByRole('button')).toHaveAttribute('data-has-filters', 'false')
    })
  })

  describe('accessibility', () => {
    it('has aria-expanded attribute', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded')
    })

    it('supports aria-controls for filter panel', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton aria-controls="filter-panel" />
        </ListContextProvider>
      )

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-controls',
        'filter-panel'
      )
    })

    it('can be disabled', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton disabled />
        </ListContextProvider>
      )

      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('edge cases', () => {
    it('handles multiple filter types correctly', () => {
      const contextValue = createTestListContext({
        filterValues: {
          status: 'active',
          category: 'tech',
          search: 'test',
          tags: ['a', 'b'],
          date: new Date('2024-01-01'),
        },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      // Should count all non-empty values
      expect(screen.getByTestId('filter-count')).toHaveTextContent('5')
    })

    it('handles boolean false as valid filter value', () => {
      const contextValue = createTestListContext({
        filterValues: {
          isActive: false, // false is a valid filter value
          status: 'pending',
        },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      // false should be counted as a valid filter
      expect(screen.getByTestId('filter-count')).toHaveTextContent('2')
    })

    it('handles 0 as valid filter value', () => {
      const contextValue = createTestListContext({
        filterValues: {
          count: 0, // 0 is a valid filter value
        },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByTestId('filter-count')).toHaveTextContent('1')
    })

    it('toggles internal state multiple times', async () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      const button = screen.getByRole('button')

      // Initially false
      expect(button).toHaveAttribute('aria-expanded', 'false')

      // Click once - should be true
      await userEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Click again - should be false
      await userEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'false')

      // Click again - should be true
      await userEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('does not toggle internal state when onToggle is provided', async () => {
      const onToggle = vi.fn()
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton onToggle={onToggle} isOpen={false} />
        </ListContextProvider>
      )

      const button = screen.getByRole('button')

      await userEvent.click(button)

      // Should call onToggle but not change state (controlled mode)
      expect(onToggle).toHaveBeenCalledTimes(1)
      // State should still be false because it's controlled
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('handles very large filter count', () => {
      const manyFilters: Record<string, string> = {}
      for (let i = 0; i < 99; i++) {
        manyFilters[`filter${i}`] = `value${i}`
      }

      const contextValue = createTestListContext({
        filterValues: manyFilters,
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterButton />
        </ListContextProvider>
      )

      expect(screen.getByTestId('filter-count')).toHaveTextContent('99')
    })
  })
})
