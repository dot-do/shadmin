/**
 * FilterOperatorSelect Component Test Suite
 *
 * This test suite validates the FilterOperatorSelect component which provides
 * a dropdown for selecting filter operators (equals, greater than, contains, etc.).
 *
 * KEY CONCEPTS TESTED:
 * 1. Basic Rendering - Select element with provided operators as options
 * 2. Value Management - Current value selection and onChange callback
 * 3. Human-Readable Labels - Mapping operator codes to display text (eq -> "equals")
 * 4. Compact Mode - Short notation (eq -> "=") for space-constrained UIs
 * 5. Operator Type Presets - Text, number, and date operator sets
 * 6. Accessibility - aria-label support, disabled state
 *
 * WHY THESE TESTS MATTER:
 * - FilterOperatorSelect enables rich filtering beyond simple equality checks
 * - Human-readable labels improve UX by making operator meaning clear
 * - Preset operator types ensure appropriate operators for each data type
 * - Compact mode is essential for dense UI layouts (e.g., inline filters)
 * - The onChange callback must emit the correct operator value for filter updates
 *
 * TEST SETUP:
 * - Direct component rendering (no context needed)
 * - vi.fn() mocks for onChange callback
 * - userEvent for realistic select option changes
 *
 * OPERATOR TYPES:
 * - Text: eq, neq, contains, startsWith, endsWith, isNull, isNotNull
 * - Number: eq, neq, gt, gte, lt, lte, between, isNull, isNotNull
 * - Date: eq, neq, gt, gte, lt, lte, between, isNull, isNotNull
 *
 * EDGE CASES COVERED:
 * - Custom operators list restricting available options
 * - Compact mode displaying symbols instead of words
 * - Type presets providing appropriate operator sets
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterOperatorSelect } from './FilterOperatorSelect'
import type { FilterOperator } from '@/utils/filterOperators'

describe('<FilterOperatorSelect />', () => {
  const defaultOperators: FilterOperator[] = ['eq', 'neq', 'contains', 'startsWith', 'endsWith']

  it('renders select element with operators', () => {
    render(
      <FilterOperatorSelect
        operators={defaultOperators}
        value="eq"
        onChange={vi.fn()}
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('renders all provided operators as options', () => {
    render(
      <FilterOperatorSelect
        operators={defaultOperators}
        value="eq"
        onChange={vi.fn()}
      />
    )

    const select = screen.getByRole('combobox')
    const options = select.querySelectorAll('option')
    expect(options).toHaveLength(defaultOperators.length)
  })

  it('shows current value as selected', () => {
    render(
      <FilterOperatorSelect
        operators={defaultOperators}
        value="contains"
        onChange={vi.fn()}
      />
    )

    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('contains')
  })

  it('calls onChange when operator is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <FilterOperatorSelect
        operators={defaultOperators}
        value="eq"
        onChange={onChange}
      />
    )

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'contains')

    expect(onChange).toHaveBeenCalledWith('contains')
  })

  it('displays human-readable labels for operators', () => {
    render(
      <FilterOperatorSelect
        operators={['eq', 'gt', 'gte', 'lt', 'lte']}
        value="eq"
        onChange={vi.fn()}
      />
    )

    expect(screen.getByText('equals')).toBeInTheDocument()
    expect(screen.getByText('greater than')).toBeInTheDocument()
    expect(screen.getByText('greater than or equal')).toBeInTheDocument()
    expect(screen.getByText('less than')).toBeInTheDocument()
    expect(screen.getByText('less than or equal')).toBeInTheDocument()
  })

  it('supports disabled prop', () => {
    render(
      <FilterOperatorSelect
        operators={defaultOperators}
        value="eq"
        onChange={vi.fn()}
        disabled
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })

  it('supports className prop', () => {
    render(
      <FilterOperatorSelect
        operators={defaultOperators}
        value="eq"
        onChange={vi.fn()}
        className="custom-class"
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('custom-class')
  })

  it('supports aria-label prop', () => {
    render(
      <FilterOperatorSelect
        operators={defaultOperators}
        value="eq"
        onChange={vi.fn()}
        aria-label="Select filter operator"
      />
    )

    const select = screen.getByLabelText('Select filter operator')
    expect(select).toBeInTheDocument()
  })

  it('renders compact mode without labels', () => {
    render(
      <FilterOperatorSelect
        operators={['eq', 'neq']}
        value="eq"
        onChange={vi.fn()}
        compact
      />
    )

    // In compact mode, display symbol/short notation
    expect(screen.getByText('=')).toBeInTheDocument()
  })

  describe('operator type presets', () => {
    it('can use text operators preset', () => {
      render(
        <FilterOperatorSelect
          operatorType="text"
          value="eq"
          onChange={vi.fn()}
        />
      )

      const select = screen.getByRole('combobox')
      const options = select.querySelectorAll('option')
      // text type should include: eq, neq, contains, startsWith, endsWith, isNull, isNotNull
      expect(options.length).toBeGreaterThanOrEqual(5)
    })

    it('can use number operators preset', () => {
      render(
        <FilterOperatorSelect
          operatorType="number"
          value="eq"
          onChange={vi.fn()}
        />
      )

      const select = screen.getByRole('combobox')
      const options = select.querySelectorAll('option')
      // number type should include: eq, neq, gt, gte, lt, lte, between, isNull, isNotNull
      expect(options.length).toBeGreaterThanOrEqual(7)
    })

    it('can use date operators preset', () => {
      render(
        <FilterOperatorSelect
          operatorType="date"
          value="eq"
          onChange={vi.fn()}
        />
      )

      const select = screen.getByRole('combobox')
      const options = select.querySelectorAll('option')
      // date type should include: eq, neq, gt, gte, lt, lte, between, isNull, isNotNull
      expect(options.length).toBeGreaterThanOrEqual(7)
    })
  })
})
