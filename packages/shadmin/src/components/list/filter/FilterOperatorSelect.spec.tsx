/**
 * FilterOperatorSelect Component Tests
 * Issue: shadmin-qyay
 * TDD: RED phase - write failing tests first
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
