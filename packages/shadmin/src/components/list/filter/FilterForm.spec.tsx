/**
 * FilterForm Component Test Suite
 *
 * This test suite validates the FilterForm component which provides a wrapper around
 * react-hook-form to manage list filters within the shadmin admin framework.
 *
 * KEY CONCEPTS TESTED:
 * 1. Form Rendering - Basic rendering with children and custom styling
 * 2. Form Submission - Integration with ListContext.setFilters to apply filters
 * 3. ListContext Integration - Syncing form state with context filterValues
 * 4. Filter Reset - Clearing all filters and resetting pagination
 *
 * WHY THESE TESTS MATTER:
 * - FilterForm is the primary mechanism for users to filter data in List views
 * - It must correctly integrate with both react-hook-form and ListContext
 * - Page reset on filter change prevents confusing empty results on high page numbers
 * - The render prop pattern allows flexible filter UI composition
 *
 * TEST SETUP:
 * - createTestListContext() provides a mock ListControllerResult with vi.fn() mocks
 * - Tests wrap FilterForm in ListContextProvider to simulate real usage
 * - userEvent is used for realistic user interactions (typing, clicking)
 *
 * EDGE CASES COVERED:
 * - Empty default values
 * - Null/undefined children
 * - Merging defaultValues with existing filterValues
 * - Multiple form submissions
 * - Enter key submission
 * - Nested object filter values (e.g., 'nested.field')
 * - Exposing all react-hook-form methods to render prop
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterForm } from './FilterForm'
import {
  ListContextProvider,
  type ListControllerResult,
} from '@/contexts/ListContext'

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

describe('FilterForm', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm>
            <input data-testid="filter-input" />
          </FilterForm>
        </ListContextProvider>
      )

      expect(screen.getByTestId('filter-input')).toBeInTheDocument()
    })

    it('renders as a form element', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm>
            <span>Content</span>
          </FilterForm>
        </ListContextProvider>
      )

      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm className="custom-form-class">
            <span>Content</span>
          </FilterForm>
        </ListContextProvider>
      )

      expect(screen.getByRole('form')).toHaveClass('custom-form-class')
    })
  })

  describe('form submission', () => {
    it('calls setFilters on form submit', async () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm defaultValues={{ search: '' }}>
            {({ register }) => (
              <>
                <input {...register('search')} data-testid="search-input" />
                <button type="submit">Submit</button>
              </>
            )}
          </FilterForm>
        </ListContextProvider>
      )

      const input = screen.getByTestId('search-input')
      await userEvent.type(input, 'test query')
      await userEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalledWith(
          expect.objectContaining({ search: 'test query' })
        )
      })
    })

    it('resets page to 1 when filters change', async () => {
      const setFilters = vi.fn()
      const setPage = vi.fn()
      const contextValue = createTestListContext({
        setFilters,
        setPage,
        page: 5,
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm defaultValues={{ search: '' }}>
            {({ register }) => (
              <>
                <input {...register('search')} data-testid="search-input" />
                <button type="submit">Submit</button>
              </>
            )}
          </FilterForm>
        </ListContextProvider>
      )

      await userEvent.type(screen.getByTestId('search-input'), 'test')
      await userEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(setPage).toHaveBeenCalledWith(1)
      })
    })

    it('prevents default form submission', async () => {
      const contextValue = createTestListContext()
      const handleSubmit = vi.fn((e) => e.preventDefault())

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm onSubmit={handleSubmit}>
            <button type="submit">Submit</button>
          </FilterForm>
        </ListContextProvider>
      )

      const form = screen.getByRole('form')
      fireEvent.submit(form)

      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe('integration with ListContext', () => {
    it('initializes form with filterValues from context', () => {
      const contextValue = createTestListContext({
        filterValues: { search: 'initial value', status: 'active' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm>
            {({ register }) => (
              <input {...register('search')} data-testid="search-input" />
            )}
          </FilterForm>
        </ListContextProvider>
      )

      // Form should sync with context filterValues
      expect(screen.getByTestId('search-input')).toHaveValue('initial value')
    })

    it('provides form methods to children via render prop', async () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm>
            {({ reset, register }) => (
              <>
                <input {...register('search')} data-testid="search-input" />
                <button type="button" onClick={() => reset()}>
                  Reset
                </button>
              </>
            )}
          </FilterForm>
        </ListContextProvider>
      )

      expect(screen.getByText('Reset')).toBeInTheDocument()
    })
  })

  describe('clear filters', () => {
    it('clears all filters when reset is called', async () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({
        setFilters,
        filterValues: { search: 'test', status: 'active' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm>
            {({ reset, register }) => (
              <>
                <input {...register('search')} data-testid="search-input" />
                <button type="button" onClick={() => reset()}>
                  Clear
                </button>
              </>
            )}
          </FilterForm>
        </ListContextProvider>
      )

      await userEvent.click(screen.getByText('Clear'))

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalledWith({})
      })
    })
  })

  describe('edge cases', () => {
    it('handles empty defaultValues', async () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm defaultValues={{}}>
            {({ register }) => (
              <>
                <input {...register('search')} data-testid="search-input" />
                <button type="submit">Submit</button>
              </>
            )}
          </FilterForm>
        </ListContextProvider>
      )

      await userEvent.type(screen.getByTestId('search-input'), 'test')
      await userEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalled()
      })
    })

    it('handles undefined children gracefully', () => {
      const contextValue = createTestListContext()

      // Should not crash with null/undefined children
      render(
        <ListContextProvider value={contextValue}>
          <FilterForm>
            {null}
          </FilterForm>
        </ListContextProvider>
      )

      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('merges defaultValues with filterValues from context', () => {
      const contextValue = createTestListContext({
        filterValues: { status: 'active' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm defaultValues={{ search: 'default', status: '' }}>
            {({ register }) => (
              <>
                <input {...register('search')} data-testid="search-input" />
                <input {...register('status')} data-testid="status-input" />
              </>
            )}
          </FilterForm>
        </ListContextProvider>
      )

      // Context filterValues should override defaultValues
      expect(screen.getByTestId('status-input')).toHaveValue('active')
    })

    it('handles multiple form submissions', async () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm defaultValues={{ search: '' }}>
            {({ register }) => (
              <>
                <input {...register('search')} data-testid="search-input" />
                <button type="submit">Submit</button>
              </>
            )}
          </FilterForm>
        </ListContextProvider>
      )

      const input = screen.getByTestId('search-input')

      // First submission
      await userEvent.type(input, 'first')
      await userEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalledWith(
          expect.objectContaining({ search: 'first' })
        )
      })

      // Clear and second submission
      await userEvent.clear(input)
      await userEvent.type(input, 'second')
      await userEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalledWith(
          expect.objectContaining({ search: 'second' })
        )
      })
    })

    it('resets page when reset is called', async () => {
      const setPage = vi.fn()
      const setFilters = vi.fn()
      const contextValue = createTestListContext({
        setPage,
        setFilters,
        page: 5,
        filterValues: { search: 'test' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm>
            {({ reset }) => (
              <button type="button" onClick={() => reset()}>
                Clear
              </button>
            )}
          </FilterForm>
        </ListContextProvider>
      )

      await userEvent.click(screen.getByText('Clear'))

      await waitFor(() => {
        expect(setPage).toHaveBeenCalledWith(1)
      })
    })

    it('handles form submission with Enter key', async () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({ setFilters })

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm defaultValues={{ search: '' }}>
            {({ register }) => (
              <input {...register('search')} data-testid="search-input" />
            )}
          </FilterForm>
        </ListContextProvider>
      )

      const input = screen.getByTestId('search-input')
      await userEvent.type(input, 'enter test{enter}')

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalled()
      })
    })

    it('provides all react-hook-form methods to render prop', () => {
      const contextValue = createTestListContext()

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm>
            {(formMethods) => {
              // Check that standard react-hook-form methods are available
              expect(typeof formMethods.register).toBe('function')
              expect(typeof formMethods.handleSubmit).toBe('function')
              expect(typeof formMethods.watch).toBe('function')
              expect(typeof formMethods.reset).toBe('function')
              expect(typeof formMethods.setValue).toBe('function')
              expect(typeof formMethods.getValues).toBe('function')
              return <span>Form rendered</span>
            }}
          </FilterForm>
        </ListContextProvider>
      )

      expect(screen.getByText('Form rendered')).toBeInTheDocument()
    })

    it('handles nested object values in filters', async () => {
      const setFilters = vi.fn()
      const contextValue = createTestListContext({
        setFilters,
        filterValues: { 'nested.field': 'value' },
      })

      render(
        <ListContextProvider value={contextValue}>
          <FilterForm>
            {({ register }) => (
              <>
                <input {...register('nested.field')} data-testid="nested-input" />
                <button type="submit">Submit</button>
              </>
            )}
          </FilterForm>
        </ListContextProvider>
      )

      expect(screen.getByTestId('nested-input')).toHaveValue('value')
    })
  })
})
