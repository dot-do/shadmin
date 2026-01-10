/**
 * FilterInput Component
 * Issue: shadmin-qyay
 *
 * A filter input component that supports operator selection for advanced filtering.
 * Integrates with ListContext to update filter values.
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type InputHTMLAttributes,
} from 'react'
import { useListContext } from '@/contexts/ListContext'
import { cn } from '@/utils'
import {
  type FilterOperator,
  buildFilterKey,
  getOperatorsForType,
  type OperatorType,
} from '@/utils/filterOperators'
import { FilterOperatorSelect } from './FilterOperatorSelect'

/**
 * Input type mapping for operator types
 */
type FilterInputType = 'text' | 'number' | 'date' | 'datetime-local'

/**
 * Props for FilterInput component
 */
export interface FilterInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  /** Field source name (will be used as filter key) */
  source: string
  /** Label text for the input */
  label?: string | false
  /** Input type (affects available operators) */
  type?: FilterInputType
  /** Show operator selector */
  showOperator?: boolean
  /** Default operator (when showOperator is true) */
  defaultOperator?: FilterOperator
  /** Available operators (overrides type-based defaults) */
  operators?: FilterOperator[]
  /** Debounce delay in milliseconds */
  debounce?: number
  /**
   * If true, shows a remove button to hide/clear this filter.
   * Useful for dynamic filters that can be shown/hidden.
   */
  hideable?: boolean
  /** Callback when the filter is hidden/removed */
  onHide?: (source: string) => void
}

/**
 * Input styling based on ShadCN patterns
 */
const inputStyles = cn(
  'flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm',
  'ring-offset-background placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * Map input type to operator type for determining available operators
 */
function getOperatorTypeFromInputType(inputType: FilterInputType): OperatorType {
  switch (inputType) {
    case 'number':
      return 'number'
    case 'date':
    case 'datetime-local':
      return 'date'
    default:
      return 'text'
  }
}

/**
 * Find the current filter value and operator from filter values
 */
function findFilterValueAndOperator(
  source: string,
  filterValues: Record<string, unknown>,
  availableOperators: FilterOperator[]
): { value: unknown; operator: FilterOperator } {
  // First check for exact match (eq operator)
  if (source in filterValues) {
    return { value: filterValues[source], operator: 'eq' }
  }

  // Check for operator suffixed keys
  for (const op of availableOperators) {
    const key = buildFilterKey(source, op)
    if (key in filterValues) {
      return { value: filterValues[key], operator: op }
    }
  }

  return { value: '', operator: 'eq' }
}

/**
 * FilterInput component for advanced filter inputs with operator support.
 *
 * @example
 * ```tsx
 * // Basic text filter
 * <FilterInput source="name" label="Name" />
 *
 * // With operator selection
 * <FilterInput source="age" type="number" showOperator />
 *
 * // With specific operators
 * <FilterInput
 *   source="status"
 *   showOperator
 *   operators={['eq', 'neq', 'in']}
 * />
 *
 * // Date filter with default operator
 * <FilterInput
 *   source="createdAt"
 *   type="date"
 *   showOperator
 *   defaultOperator="gte"
 * />
 * ```
 */
export function FilterInput({
  source,
  label,
  type = 'text',
  showOperator = false,
  defaultOperator = 'eq',
  operators,
  debounce = 300,
  className,
  disabled,
  placeholder,
  hideable = false,
  onHide,
  ...props
}: FilterInputProps) {
  const { filterValues, setFilters, setPage } = useListContext()

  // Determine available operators
  const operatorType = getOperatorTypeFromInputType(type)
  const availableOperators = operators ?? getOperatorsForType(operatorType)

  // Local state for input value and operator
  // Initialize lazily to properly capture initial values
  const [value, setValue] = useState<string | [string, string]>(() => {
    const currentFilter = findFilterValueAndOperator(source, filterValues, availableOperators)
    if (currentFilter.operator === 'between' && Array.isArray(currentFilter.value)) {
      return [String(currentFilter.value[0] ?? ''), String(currentFilter.value[1] ?? '')]
    }
    return String(currentFilter.value ?? '')
  })

  const [operator, setOperator] = useState<FilterOperator>(() => {
    const currentFilter = findFilterValueAndOperator(source, filterValues, availableOperators)
    // If there's an existing filter value, use that operator; otherwise use defaultOperator
    if (currentFilter.value !== '' && currentFilter.value !== undefined && currentFilter.value !== null) {
      return currentFilter.operator
    }
    return defaultOperator
  })

  // Track previous filter key for cleanup
  const prevFilterKeyRef = useRef<string | null>(null)

  // Initialize ref on first render
  if (prevFilterKeyRef.current === null) {
    prevFilterKeyRef.current = buildFilterKey(source, operator)
  }

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync with external filter values
  // Only sync when there's actually a filter value set externally
  useEffect(() => {
    const current = findFilterValueAndOperator(source, filterValues, availableOperators)
    // Only update if there's an actual filter value
    const hasValue = current.value !== '' && current.value !== undefined && current.value !== null
    if (hasValue) {
      if (current.operator === 'between' && Array.isArray(current.value)) {
        setValue([String(current.value[0] ?? ''), String(current.value[1] ?? '')])
      } else {
        setValue(String(current.value))
      }
      setOperator(current.operator)
    }
  }, [filterValues, source, availableOperators])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Update filters function
  const updateFilters = useCallback(
    (newValue: string | [string, string] | undefined, newOperator: FilterOperator) => {
      const newFilterKey = buildFilterKey(source, newOperator)
      const prevFilterKey = prevFilterKeyRef.current

      // Reset page to 1 when filters change
      setPage(1)

      // Build new filter values
      const newFilterValues = { ...filterValues }

      // Remove previous filter key if different
      if (prevFilterKey && prevFilterKey !== newFilterKey) {
        delete newFilterValues[prevFilterKey]
      }

      // Handle null operators (isNull, isNotNull)
      if (newOperator === 'isNull' || newOperator === 'isNotNull') {
        newFilterValues[newFilterKey] = true
      } else if (newOperator === 'between') {
        // Handle between operator (array value)
        if (Array.isArray(newValue) && (newValue[0] || newValue[1])) {
          newFilterValues[newFilterKey] = newValue
        } else {
          delete newFilterValues[newFilterKey]
        }
      } else if (newValue && newValue !== '') {
        // Normal value
        newFilterValues[newFilterKey] = newValue
      } else {
        // Empty value - remove filter
        delete newFilterValues[newFilterKey]
      }

      prevFilterKeyRef.current = newFilterKey
      setFilters(newFilterValues)
    },
    [filterValues, setFilters, setPage, source]
  )

  // Debounced value change handler
  const handleValueChange = useCallback(
    (newValue: string | [string, string]) => {
      setValue(newValue)

      // Clear existing timeout
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Debounce the filter update
      debounceTimerRef.current = setTimeout(() => {
        updateFilters(newValue, operator)
      }, debounce)
    },
    [debounce, operator, updateFilters]
  )

  // Operator change handler (immediate, no debounce)
  const handleOperatorChange = useCallback(
    (newOperator: FilterOperator) => {
      setOperator(newOperator)

      // Clear any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // If switching to/from null operators, update immediately
      if (newOperator === 'isNull' || newOperator === 'isNotNull') {
        updateFilters(undefined, newOperator)
      } else if (operator === 'isNull' || operator === 'isNotNull') {
        // Switching from null operator, reset value
        setValue('')
        updateFilters('', newOperator)
      } else if (newOperator === 'between') {
        // Switching to between, need array value
        const betweenValue: [string, string] = Array.isArray(value)
          ? value
          : [String(value), '']
        setValue(betweenValue)
        updateFilters(betweenValue, newOperator)
      } else if (operator === 'between') {
        // Switching from between, use first value
        const singleValue = Array.isArray(value) ? value[0] : String(value)
        setValue(singleValue)
        updateFilters(singleValue, newOperator)
      } else {
        // Normal operator change
        updateFilters(Array.isArray(value) ? value[0] : value, newOperator)
      }
    },
    [operator, updateFilters, value]
  )

  // Determine what to render based on operator
  const isNullOperator = operator === 'isNull' || operator === 'isNotNull'
  const isBetweenOperator = operator === 'between'

  const showLabel = label !== false
  const displayLabel = label || source

  // Handle hiding the filter
  const handleHide = useCallback(() => {
    // Clear the filter value
    const newFilterValues = { ...filterValues }
    const filterKey = buildFilterKey(source, operator)
    delete newFilterValues[filterKey]
    // Also delete the base source key in case it exists
    delete newFilterValues[source]
    setFilters(newFilterValues)
    setPage(1)
    // Notify parent
    if (onHide) {
      onHide(source)
    }
  }, [filterValues, setFilters, setPage, source, operator, onHide])

  return (
    <div className="space-y-2" data-testid="shadmin-filter-input" data-source={source}>
      {showLabel && <label className={labelStyles}>{displayLabel}</label>}
      <div className="flex gap-2">
        {showOperator && (
          <FilterOperatorSelect
            operators={availableOperators}
            value={operator}
            onChange={handleOperatorChange}
            disabled={disabled}
            aria-label={`${displayLabel} operator`}
            className="w-auto min-w-[120px]"
          />
        )}

        {!isNullOperator && !isBetweenOperator && (
          <input
            type={type}
            name={source}
            value={Array.isArray(value) ? value[0] : value}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(inputStyles, 'flex-1', className)}
            {...props}
          />
        )}

        {!isNullOperator && isBetweenOperator && (
          <>
            <input
              type={type}
              name={`${source}_min`}
              value={Array.isArray(value) ? value[0] : value}
              onChange={(e) => {
                const newValue: [string, string] = [
                  e.target.value,
                  Array.isArray(value) ? value[1] : '',
                ]
                handleValueChange(newValue)
              }}
              placeholder="Min"
              disabled={disabled}
              className={cn(inputStyles, 'flex-1', className)}
              {...props}
            />
            <span className="flex items-center text-muted-foreground">-</span>
            <input
              type={type}
              name={`${source}_max`}
              value={Array.isArray(value) ? value[1] : ''}
              onChange={(e) => {
                const newValue: [string, string] = [
                  Array.isArray(value) ? value[0] : String(value),
                  e.target.value,
                ]
                handleValueChange(newValue)
              }}
              placeholder="Max"
              disabled={disabled}
              className={cn(inputStyles, 'flex-1', className)}
              {...props}
            />
          </>
        )}

        {hideable && (
          <button
            type="button"
            onClick={handleHide}
            title="Remove this filter"
            aria-label="Remove this filter"
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-md',
              'text-muted-foreground hover:text-foreground hover:bg-accent',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

FilterInput.displayName = 'FilterInput'
