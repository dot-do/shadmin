/**
 * FilterForm component tests
 * TDD: RED phase - Write failing tests first
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
})
