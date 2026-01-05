/**
 * SearchInput component tests
 * TDD: RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from './SearchInput'
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

describe('SearchInput', () => {
  describe('rendering', () => {
    it('renders as a text input', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput />
        </ListContextProvider>
      )

      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    it('renders with default placeholder', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput />
        </ListContextProvider>
      )

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })

    it('renders with custom placeholder', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput placeholder="Search items..." />
        </ListContextProvider>
      )

      expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput className="custom-input-class" />
        </ListContextProvider>
      )

      expect(screen.getByRole('searchbox')).toHaveClass('custom-input-class')
    })
  })

  describe('debounced input', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('does not call setFilters immediately on input', () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="q" />
        </ListContextProvider>
      )

      const input = screen.getByRole('searchbox')

      // Use fireEvent instead of userEvent with fake timers
      fireEvent.change(input, { target: { value: 't' } })

      // Should not be called immediately
      expect(setFilters).not.toHaveBeenCalled()
    })

    it('calls setFilters after debounce delay', () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="q" debounce={300} />
        </ListContextProvider>
      )

      const input = screen.getByRole('searchbox')
      fireEvent.change(input, { target: { value: 'test' } })

      // Not called yet
      expect(setFilters).not.toHaveBeenCalled()

      // Fast-forward past debounce time
      act(() => {
        vi.advanceTimersByTime(300)
      })

      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'test' })
      )
    })

    it('uses default debounce of 500ms', () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="q" />
        </ListContextProvider>
      )

      const input = screen.getByRole('searchbox')
      fireEvent.change(input, { target: { value: 'test' } })

      // Not enough time
      act(() => {
        vi.advanceTimersByTime(400)
      })

      expect(setFilters).not.toHaveBeenCalled()

      // Enough time
      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(setFilters).toHaveBeenCalled()
    })

    it('debounces multiple keystrokes', () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="q" debounce={300} />
        </ListContextProvider>
      )

      const input = screen.getByRole('searchbox')

      // Simulate typing character by character with delays
      fireEvent.change(input, { target: { value: 't' } })
      act(() => {
        vi.advanceTimersByTime(100)
      })

      fireEvent.change(input, { target: { value: 'te' } })
      act(() => {
        vi.advanceTimersByTime(100)
      })

      fireEvent.change(input, { target: { value: 'tes' } })
      act(() => {
        vi.advanceTimersByTime(100)
      })

      fireEvent.change(input, { target: { value: 'test' } })

      // Still not called
      expect(setFilters).not.toHaveBeenCalled()

      // Wait for full debounce
      act(() => {
        vi.advanceTimersByTime(300)
      })

      expect(setFilters).toHaveBeenCalledTimes(1)
      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'test' })
      )
    })
  })

  describe('filter state integration', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('uses "q" as default source', () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput debounce={0} />
        </ListContextProvider>
      )

      const input = screen.getByRole('searchbox')
      fireEvent.change(input, { target: { value: 'test' } })

      act(() => {
        vi.advanceTimersByTime(0)
      })

      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'test' })
      )
    })

    it('uses custom source when provided', () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="search" debounce={0} />
        </ListContextProvider>
      )

      const input = screen.getByRole('searchbox')
      fireEvent.change(input, { target: { value: 'test' } })

      act(() => {
        vi.advanceTimersByTime(0)
      })

      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'test' })
      )
    })

    it('preserves existing filter values', () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({
        setFilters,
        filterValues: { status: 'active', category: 'tech' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="q" debounce={0} />
        </ListContextProvider>
      )

      const input = screen.getByRole('searchbox')
      fireEvent.change(input, { target: { value: 'test' } })

      act(() => {
        vi.advanceTimersByTime(0)
      })

      expect(setFilters).toHaveBeenCalledWith({
        status: 'active',
        category: 'tech',
        q: 'test',
      })
    })

    it('initializes with value from filterValues', () => {
      vi.useRealTimers() // Don't need fake timers for this test

      const contextValue = createTestListContext({
        filterValues: { q: 'initial search' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="q" />
        </ListContextProvider>
      )

      expect(screen.getByRole('searchbox')).toHaveValue('initial search')
    })

    it('resets page to 1 when search changes', () => {
      const setFilters = vi.fn()
      const setPage = vi.fn()
      const contextValue = createTestListContext({
        setFilters,
        setPage,
        page: 5,
      })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="q" debounce={0} />
        </ListContextProvider>
      )

      const input = screen.getByRole('searchbox')
      fireEvent.change(input, { target: { value: 'test' } })

      act(() => {
        vi.advanceTimersByTime(0)
      })

      expect(setPage).toHaveBeenCalledWith(1)
    })
  })

  describe('clear functionality', () => {
    it('shows clear button when input has value', () => {
      const contextValue = createTestListContext({
        filterValues: { q: 'test' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="q" />
        </ListContextProvider>
      )

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
    })

    it('hides clear button when input is empty', () => {
      const contextValue = createTestListContext({
        filterValues: { q: '' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="q" />
        </ListContextProvider>
      )

      expect(
        screen.queryByRole('button', { name: /clear/i })
      ).not.toBeInTheDocument()
    })

    it('clears input and filter when clear button is clicked', async () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({
        setFilters,
        filterValues: { q: 'test', status: 'active' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput source="q" />
        </ListContextProvider>
      )

      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /clear/i }))

      // Input should be cleared immediately
      expect(screen.getByRole('searchbox')).toHaveValue('')

      // Filter should be updated (without debounce)
      expect(setFilters).toHaveBeenCalledWith({
        status: 'active',
        q: undefined,
      })
    })
  })

  describe('accessibility', () => {
    it('has type="search"', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput />
        </ListContextProvider>
      )

      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search')
    })

    it('supports aria-label', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput aria-label="Search products" />
        </ListContextProvider>
      )

      expect(screen.getByLabelText('Search products')).toBeInTheDocument()
    })

    it('can be disabled', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <SearchInput disabled />
        </ListContextProvider>
      )

      expect(screen.getByRole('searchbox')).toBeDisabled()
    })
  })
})
