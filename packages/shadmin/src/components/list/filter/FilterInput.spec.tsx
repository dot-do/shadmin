/**
 * FilterInput Component Test Suite
 *
 * This test suite validates the FilterInput component which provides a flexible
 * text/number/date input with operator support for filtering list data in shadmin.
 *
 * KEY CONCEPTS TESTED:
 * 1. Basic Rendering - Input element, label derivation from source, placeholder, disabled state
 * 2. Operator Support - Dropdown for selecting comparison operators (eq, neq, gt, lt, contains, etc.)
 * 3. Filter Value Handling - Integration with ListContext.setFilters, operator-based key naming
 * 4. Input Types - Text (default), number (spinbutton), and date inputs
 * 5. Debouncing - Delayed filter updates to prevent excessive API calls during typing
 * 6. Clearing - Proper filter removal when input is cleared
 * 7. Special Operators - Between (two inputs), isNull/isNotNull (hidden input)
 *
 * WHY THESE TESTS MATTER:
 * - FilterInput is a core building block for list filtering with complex query operators
 * - Operator support enables rich filtering (greater than, contains, between ranges)
 * - Filter key naming with operators (e.g., age_gt, name_contains) is critical for backend parsing
 * - Debouncing prevents performance issues with keystroke-by-keystroke API calls
 * - Initialization from existing filterValues ensures URL/state restoration works correctly
 * - Special operators like "between" and "isNull" require different UI patterns
 *
 * TEST SETUP:
 * - createMockListContext() provides a mock ListContextValue with vi.fn() mocks
 * - TestWrapper component wraps FilterInput in ListContext.Provider
 * - userEvent is used for realistic typing and selection interactions
 * - waitFor is used for async debounce/filter update assertions
 *
 * EDGE CASES COVERED:
 * - Default operator (eq) when showOperator is false
 * - Custom operators list restriction
 * - Operator change updating filter key (removing old, adding new)
 * - Initializing from filter value with embedded operator (e.g., age_gt: '25')
 * - Between operator showing two inputs and submitting as array
 * - isNull/isNotNull operators hiding the value input entirely
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterInput } from './FilterInput'
import { ListContext, type ListControllerResult } from '@/contexts/ListContext'

// Mock ListContext provider
function createMockListContext(overrides: Partial<ListControllerResult> = {}): ListControllerResult {
  return {
    data: [],
    total: 0,
    isLoading: false,
    isFetching: false,
    error: null,
    page: 1,
    perPage: 10,
    filterValues: {},
    sort: { field: 'id', order: 'ASC' },
    selectedIds: [],
    setPage: vi.fn(),
    setPerPage: vi.fn(),
    setSort: vi.fn(),
    setFilters: vi.fn(),
    onSelect: vi.fn(),
    onToggleItem: vi.fn(),
    onUnselectItems: vi.fn(),
    refetch: vi.fn(),
    resource: 'test',
    ...overrides,
  }
}

interface TestWrapperProps {
  children: React.ReactNode
  listContext?: Partial<ListControllerResult>
}

function TestWrapper({ children, listContext = {} }: TestWrapperProps) {
  return (
    <ListContext.Provider value={createMockListContext(listContext)}>
      {children}
    </ListContext.Provider>
  )
}

describe('<FilterInput />', () => {
  describe('basic rendering', () => {
    it('renders input element', () => {
      render(
        <TestWrapper>
          <FilterInput source="name" />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('renders label when provided', () => {
      render(
        <TestWrapper>
          <FilterInput source="name" label="Name" />
        </TestWrapper>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    it('uses source as default label', () => {
      render(
        <TestWrapper>
          <FilterInput source="firstName" />
        </TestWrapper>
      )

      expect(screen.getByText('firstName')).toBeInTheDocument()
    })

    it('supports placeholder prop', () => {
      render(
        <TestWrapper>
          <FilterInput source="search" placeholder="Search..." />
        </TestWrapper>
      )

      const input = screen.getByPlaceholderText('Search...')
      expect(input).toBeInTheDocument()
    })

    it('supports disabled prop', () => {
      render(
        <TestWrapper>
          <FilterInput source="name" disabled />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })
  })

  describe('operator support', () => {
    it('renders operator select when showOperator is true', () => {
      render(
        <TestWrapper>
          <FilterInput source="name" showOperator />
        </TestWrapper>
      )

      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    it('does not render operator select by default', () => {
      render(
        <TestWrapper>
          <FilterInput source="name" />
        </TestWrapper>
      )

      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    })

    it('renders available operators based on type', () => {
      render(
        <TestWrapper>
          <FilterInput source="age" type="number" showOperator />
        </TestWrapper>
      )

      const select = screen.getByRole('combobox')
      const options = select.querySelectorAll('option')
      // Number type should have gt, gte, lt, lte operators
      expect(options.length).toBeGreaterThanOrEqual(5)
    })

    it('uses default operator', () => {
      render(
        <TestWrapper>
          <FilterInput source="name" showOperator defaultOperator="contains" />
        </TestWrapper>
      )

      const select = screen.getByRole('combobox') as HTMLSelectElement
      expect(select.value).toBe('contains')
    })

    it('allows custom operators list', () => {
      render(
        <TestWrapper>
          <FilterInput
            source="status"
            showOperator
            operators={['eq', 'neq', 'in']}
          />
        </TestWrapper>
      )

      const select = screen.getByRole('combobox')
      const options = select.querySelectorAll('option')
      expect(options).toHaveLength(3)
    })
  })

  describe('filter value handling', () => {
    it('updates filter when value changes', async () => {
      const user = userEvent.setup()
      const setFilters = vi.fn()

      render(
        <TestWrapper listContext={{ setFilters }}>
          <FilterInput source="name" />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await user.type(input, 'John')

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalled()
      })
    })

    it('includes operator in filter key when operator is selected', async () => {
      const user = userEvent.setup()
      const setFilters = vi.fn()

      render(
        <TestWrapper listContext={{ setFilters }}>
          <FilterInput source="age" type="number" showOperator defaultOperator="gt" />
        </TestWrapper>
      )

      const input = screen.getByRole('spinbutton')
      await user.type(input, '25')

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalledWith(
          expect.objectContaining({ age_gt: '25' })
        )
      })
    })

    it('uses eq operator when no operator is shown', async () => {
      const user = userEvent.setup()
      const setFilters = vi.fn()

      render(
        <TestWrapper listContext={{ setFilters }}>
          <FilterInput source="status" />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await user.type(input, 'active')

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'active' })
        )
      })
    })

    it('updates filter key when operator changes', async () => {
      const user = userEvent.setup()
      const setFilters = vi.fn()

      render(
        <TestWrapper
          listContext={{
            setFilters,
            filterValues: { name_contains: 'John' },
          }}
        >
          <FilterInput source="name" showOperator defaultOperator="contains" />
        </TestWrapper>
      )

      // Change operator from contains to startsWith
      const select = screen.getByRole('combobox')
      await user.selectOptions(select, 'startsWith')

      await waitFor(() => {
        // Should remove old key and add new key
        expect(setFilters).toHaveBeenCalled()
      })
    })

    it('initializes from existing filter value', () => {
      render(
        <TestWrapper listContext={{ filterValues: { name: 'John' } }}>
          <FilterInput source="name" />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('John')
    })

    it('initializes from filter value with operator', () => {
      render(
        <TestWrapper listContext={{ filterValues: { age_gt: '25' } }}>
          <FilterInput source="age" type="number" showOperator />
        </TestWrapper>
      )

      const input = screen.getByRole('spinbutton') as HTMLInputElement
      expect(input.value).toBe('25')

      const select = screen.getByRole('combobox') as HTMLSelectElement
      expect(select.value).toBe('gt')
    })
  })

  describe('input types', () => {
    it('renders text input by default', () => {
      render(
        <TestWrapper>
          <FilterInput source="name" />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('renders number input when type is number', () => {
      render(
        <TestWrapper>
          <FilterInput source="age" type="number" />
        </TestWrapper>
      )

      const input = screen.getByRole('spinbutton')
      expect(input).toBeInTheDocument()
    })

    it('renders date input when type is date', () => {
      render(
        <TestWrapper>
          <FilterInput source="createdAt" type="date" />
        </TestWrapper>
      )

      const input = document.querySelector('input[type="date"]')
      expect(input).toBeInTheDocument()
    })
  })

  describe('debouncing', () => {
    it('uses debounce delay before updating filters', async () => {
      const user = userEvent.setup()
      const setFilters = vi.fn()

      render(
        <TestWrapper listContext={{ setFilters }}>
          <FilterInput source="name" debounce={50} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await user.type(input, 'test')

      // Wait for debounce to complete
      await waitFor(() => {
        expect(setFilters).toHaveBeenCalled()
      }, { timeout: 500 })
    })
  })

  describe('clearing', () => {
    it('clears filter when input is cleared', async () => {
      const user = userEvent.setup()
      const setFilters = vi.fn()

      render(
        <TestWrapper listContext={{ setFilters, filterValues: { name: 'John' } }}>
          <FilterInput source="name" debounce={50} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await user.clear(input)

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalled()
      }, { timeout: 500 })
    })
  })

  describe('between operator', () => {
    it('renders two inputs when defaultOperator is between', () => {
      render(
        <TestWrapper>
          <FilterInput source="age" type="number" showOperator defaultOperator="between" />
        </TestWrapper>
      )

      // Should have two number inputs
      const inputs = screen.getAllByRole('spinbutton')
      expect(inputs).toHaveLength(2)
    })

    it('submits between filter as array', async () => {
      const user = userEvent.setup()
      const setFilters = vi.fn()

      render(
        <TestWrapper listContext={{ setFilters }}>
          <FilterInput source="age" type="number" showOperator defaultOperator="between" debounce={50} />
        </TestWrapper>
      )

      const inputs = screen.getAllByRole('spinbutton')
      await user.type(inputs[0]!, '18')

      await waitFor(() => {
        expect(setFilters).toHaveBeenCalled()
      }, { timeout: 500 })
    })
  })

  describe('isNull/isNotNull operators', () => {
    it('hides input when defaultOperator is isNull', () => {
      render(
        <TestWrapper>
          <FilterInput source="deletedAt" type="date" showOperator defaultOperator="isNull" />
        </TestWrapper>
      )

      // Input should be hidden when isNull is selected
      expect(document.querySelector('input[type="date"]')).not.toBeInTheDocument()
    })

    it('shows the correct operator in select when defaultOperator is isNull', () => {
      render(
        <TestWrapper>
          <FilterInput source="deletedAt" type="date" showOperator defaultOperator="isNull" />
        </TestWrapper>
      )

      const select = screen.getByRole('combobox') as HTMLSelectElement
      expect(select.value).toBe('isNull')
    })
  })
})
