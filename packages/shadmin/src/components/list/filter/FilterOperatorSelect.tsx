/**
 * FilterOperatorSelect Component
 * Issue: shadmin-qyay
 *
 * A select component for choosing filter operators (eq, gt, contains, etc.)
 */

import { type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils'
import {
  type FilterOperator,
  type OperatorType,
  FILTER_OPERATOR_LABELS,
  getOperatorsForType,
} from '@/utils/filterOperators'

/**
 * Short symbols for compact mode display
 */
const COMPACT_OPERATOR_SYMBOLS: Record<FilterOperator, string> = {
  eq: '=',
  neq: '!=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  contains: '*',
  startsWith: 'a*',
  endsWith: '*z',
  in: '[]',
  notIn: '![]',
  between: '<>',
  isNull: 'null',
  isNotNull: '!null',
}

/**
 * Props for FilterOperatorSelect component
 */
export interface FilterOperatorSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  /** Current selected operator */
  value: FilterOperator
  /** Callback when operator changes */
  onChange: (operator: FilterOperator) => void
  /** List of available operators (overrides operatorType) */
  operators?: FilterOperator[]
  /** Preset operators based on field type */
  operatorType?: OperatorType
  /** Show compact symbols instead of labels */
  compact?: boolean
}

/**
 * Select styling based on ShadCN patterns
 */
const selectStyles = cn(
  'flex h-10 items-center justify-between rounded-md border border-input',
  'bg-background px-3 py-2 text-sm ring-offset-background',
  'placeholder:text-muted-foreground',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

/**
 * FilterOperatorSelect component for selecting filter comparison operators.
 *
 * @example
 * ```tsx
 * // Basic usage with explicit operators
 * <FilterOperatorSelect
 *   operators={['eq', 'neq', 'contains']}
 *   value={operator}
 *   onChange={setOperator}
 * />
 *
 * // Using type preset
 * <FilterOperatorSelect
 *   operatorType="number"
 *   value={operator}
 *   onChange={setOperator}
 * />
 *
 * // Compact mode
 * <FilterOperatorSelect
 *   operatorType="text"
 *   value={operator}
 *   onChange={setOperator}
 *   compact
 * />
 * ```
 */
export function FilterOperatorSelect({
  value,
  onChange,
  operators,
  operatorType,
  compact = false,
  className,
  disabled,
  ...props
}: FilterOperatorSelectProps) {
  // Determine available operators
  const availableOperators = operators ?? (operatorType ? getOperatorsForType(operatorType) : ['eq', 'neq'])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as FilterOperator)
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className={cn(selectStyles, className)}
      disabled={disabled}
      data-testid="shadmin-filter-operator-select"
      {...props}
    >
      {availableOperators.map((op) => (
        <option key={op} value={op}>
          {compact ? COMPACT_OPERATOR_SYMBOLS[op] : FILTER_OPERATOR_LABELS[op]}
        </option>
      ))}
    </select>
  )
}

FilterOperatorSelect.displayName = 'FilterOperatorSelect'
