/**
 * Filter operator utilities for advanced filtering
 * Issue: shadmin-qyay
 *
 * Provides MongoDB-style filter operators for list views, compatible with react-admin.
 * Filter keys use underscore suffix notation: field_operator (e.g., age_gt, name_contains)
 */

/**
 * All supported filter operators
 */
export const FILTER_OPERATORS = [
  'eq',        // Equal
  'neq',       // Not equal
  'gt',        // Greater than
  'gte',       // Greater than or equal
  'lt',        // Less than
  'lte',       // Less than or equal
  'contains',  // String contains (case insensitive)
  'startsWith', // String starts with (case insensitive)
  'endsWith',  // String ends with (case insensitive)
  'in',        // Value in array
  'notIn',     // Value not in array
  'between',   // Value between [min, max] (inclusive)
  'isNull',    // Value is null/undefined
  'isNotNull', // Value is not null/undefined
] as const

/**
 * Filter operator type
 */
export type FilterOperator = typeof FILTER_OPERATORS[number]

/**
 * Parsed filter with field and operator
 */
export interface ParsedFilter {
  field: string
  operator: FilterOperator
}

/**
 * Check if a string is a valid filter operator
 */
export function isValidOperator(value: string): value is FilterOperator {
  return FILTER_OPERATORS.includes(value as FilterOperator)
}

/**
 * Parse a filter key into field name and operator
 * Handles keys like 'age_gt', 'name_contains', 'status' (defaults to eq)
 *
 * @param key - Filter key to parse
 * @returns Parsed filter with field and operator
 *
 * @example
 * parseFilterOperator('age_gt') // { field: 'age', operator: 'gt' }
 * parseFilterOperator('name_contains') // { field: 'name', operator: 'contains' }
 * parseFilterOperator('status') // { field: 'status', operator: 'eq' }
 */
export function parseFilterOperator(key: string): ParsedFilter {
  // Try to find a matching operator suffix
  for (const op of FILTER_OPERATORS) {
    const suffix = `_${op}`
    if (key.endsWith(suffix)) {
      return {
        field: key.slice(0, -suffix.length),
        operator: op,
      }
    }
  }

  // No operator found, default to 'eq'
  return {
    field: key,
    operator: 'eq',
  }
}

/**
 * Build a filter key from field name and operator
 * For 'eq' operator, returns just the field name (default behavior)
 *
 * @param field - Field name
 * @param operator - Filter operator
 * @returns Filter key string
 *
 * @example
 * buildFilterKey('age', 'gt') // 'age_gt'
 * buildFilterKey('status', 'eq') // 'status'
 */
export function buildFilterKey(field: string, operator: FilterOperator): string {
  if (operator === 'eq') {
    return field
  }
  return `${field}_${operator}`
}

/**
 * Extract just the operator from a filter key
 *
 * @param key - Filter key
 * @returns The operator or 'eq' if no operator suffix found
 */
export function extractOperatorFromKey(key: string): FilterOperator {
  for (const op of FILTER_OPERATORS) {
    if (key.endsWith(`_${op}`)) {
      return op
    }
  }
  return 'eq'
}

/**
 * Check if a filter key has an operator suffix
 *
 * @param key - Filter key to check
 * @returns true if the key has an operator suffix
 */
export function isOperatorFilter(key: string): boolean {
  for (const op of FILTER_OPERATORS) {
    if (op !== 'eq' && key.endsWith(`_${op}`)) {
      return true
    }
  }
  return false
}

/**
 * Apply a filter operator to compare an item value against a filter value
 *
 * @param itemValue - The value from the item/record
 * @param operator - The filter operator to apply
 * @param filterValue - The filter value to compare against
 * @returns true if the item matches the filter
 *
 * @example
 * applyFilterOperator(100, 'gt', 50) // true
 * applyFilterOperator('Hello World', 'contains', 'World') // true
 * applyFilterOperator('active', 'in', ['active', 'pending']) // true
 */
export function applyFilterOperator(
  itemValue: unknown,
  operator: FilterOperator,
  filterValue: unknown
): boolean {
  switch (operator) {
    case 'eq':
      return compareEqual(itemValue, filterValue)

    case 'neq':
      return !compareEqual(itemValue, filterValue)

    case 'gt':
      return compareNumeric(itemValue, filterValue, (a, b) => a > b)

    case 'gte':
      return compareNumeric(itemValue, filterValue, (a, b) => a >= b)

    case 'lt':
      return compareNumeric(itemValue, filterValue, (a, b) => a < b)

    case 'lte':
      return compareNumeric(itemValue, filterValue, (a, b) => a <= b)

    case 'contains':
      return compareString(itemValue, filterValue, (item, filter) =>
        item.toLowerCase().includes(filter.toLowerCase())
      )

    case 'startsWith':
      return compareString(itemValue, filterValue, (item, filter) =>
        item.toLowerCase().startsWith(filter.toLowerCase())
      )

    case 'endsWith':
      return compareString(itemValue, filterValue, (item, filter) =>
        item.toLowerCase().endsWith(filter.toLowerCase())
      )

    case 'in':
      return compareIn(itemValue, filterValue, false)

    case 'notIn':
      return compareIn(itemValue, filterValue, true)

    case 'between':
      return compareBetween(itemValue, filterValue)

    case 'isNull':
      return compareIsNull(itemValue, filterValue)

    case 'isNotNull':
      return compareIsNotNull(itemValue, filterValue)

    default:
      // Unknown operator, fallback to equality
      return compareEqual(itemValue, filterValue)
  }
}

/**
 * Compare two values for equality (case-insensitive for strings)
 */
function compareEqual(itemValue: unknown, filterValue: unknown): boolean {
  if (typeof itemValue === 'string' && typeof filterValue === 'string') {
    return itemValue.toLowerCase() === filterValue.toLowerCase()
  }
  return itemValue === filterValue
}

/**
 * Compare two values numerically (handles strings that look like numbers)
 */
function compareNumeric(
  itemValue: unknown,
  filterValue: unknown,
  compareFn: (a: number | string, b: number | string) => boolean
): boolean {
  if (itemValue === null || itemValue === undefined) {
    return false
  }

  // Handle numeric strings and dates
  const numericItem = toComparable(itemValue)
  const numericFilter = toComparable(filterValue)

  if (numericItem === null || numericFilter === null) {
    return false
  }

  return compareFn(numericItem, numericFilter)
}

/**
 * Convert a value to a comparable form (number or string for dates)
 */
function toComparable(value: unknown): number | string | null {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    // Try to parse as number
    const num = Number(value)
    if (!isNaN(num) && isFinite(num)) {
      return num
    }
    // Could be a date string, use string comparison
    return value
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  return null
}

/**
 * Compare strings using a custom comparison function
 */
function compareString(
  itemValue: unknown,
  filterValue: unknown,
  compareFn: (item: string, filter: string) => boolean
): boolean {
  const itemStr = String(itemValue ?? '')
  const filterStr = String(filterValue ?? '')
  return compareFn(itemStr, filterStr)
}

/**
 * Check if a value is in (or not in) an array
 */
function compareIn(itemValue: unknown, filterValue: unknown, negate: boolean): boolean {
  if (!Array.isArray(filterValue)) {
    return negate // notIn with non-array is true, in with non-array is false
  }

  if (filterValue.length === 0) {
    return negate // notIn with empty array is true, in with empty array is false
  }

  const isInArray = filterValue.some((v) => compareEqual(itemValue, v))
  return negate ? !isInArray : isInArray
}

/**
 * Check if a value is between min and max (inclusive)
 */
function compareBetween(itemValue: unknown, filterValue: unknown): boolean {
  if (!Array.isArray(filterValue) || filterValue.length < 2) {
    return false
  }

  const [min, max] = filterValue
  const comparableItem = toComparable(itemValue)
  const comparableMin = toComparable(min)
  const comparableMax = toComparable(max)

  if (comparableItem === null || comparableMin === null || comparableMax === null) {
    return false
  }

  return comparableItem >= comparableMin && comparableItem <= comparableMax
}

/**
 * Check if a value is null or undefined
 */
function compareIsNull(itemValue: unknown, filterValue: unknown): boolean {
  const isNull = itemValue === null || itemValue === undefined
  // If filterValue is false, invert the check
  return filterValue === false ? !isNull : isNull
}

/**
 * Check if a value is not null and not undefined
 */
function compareIsNotNull(itemValue: unknown, filterValue: unknown): boolean {
  const isNotNull = itemValue !== null && itemValue !== undefined
  // If filterValue is false, invert the check
  return filterValue === false ? !isNotNull : isNotNull
}

/**
 * Process a filter object and apply operators to filter items
 *
 * @param items - Array of items to filter
 * @param filter - Filter object with field_operator keys
 * @returns Filtered array of items
 *
 * @example
 * const items = [{ age: 30, name: 'John' }, { age: 25, name: 'Jane' }]
 * applyFiltersWithOperators(items, { age_gt: 27 }) // [{ age: 30, name: 'John' }]
 */
export function applyFiltersWithOperators<T extends Record<string, unknown>>(
  items: T[],
  filter: Record<string, unknown>
): T[] {
  if (!filter || Object.keys(filter).length === 0) {
    return items
  }

  return items.filter((item) => {
    return Object.entries(filter).every(([key, filterValue]) => {
      // Skip empty filter values
      if (filterValue === undefined || filterValue === null || filterValue === '') {
        return true
      }

      const { field, operator } = parseFilterOperator(key)
      const itemValue = getNestedValue(item, field)
      return applyFilterOperator(itemValue, operator, filterValue)
    })
  })
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

/**
 * Labels for filter operators (for UI display)
 */
export const FILTER_OPERATOR_LABELS: Record<FilterOperator, string> = {
  eq: 'equals',
  neq: 'does not equal',
  gt: 'greater than',
  gte: 'greater than or equal',
  lt: 'less than',
  lte: 'less than or equal',
  contains: 'contains',
  startsWith: 'starts with',
  endsWith: 'ends with',
  in: 'is one of',
  notIn: 'is not one of',
  between: 'is between',
  isNull: 'is empty',
  isNotNull: 'is not empty',
}

/**
 * Operator type presets for different input types
 */
export type OperatorType = 'text' | 'number' | 'date' | 'boolean' | 'select'

/**
 * Get available operators for a given input type
 */
export function getOperatorsForType(type: OperatorType): FilterOperator[] {
  switch (type) {
    case 'text':
      return ['eq', 'neq', 'contains', 'startsWith', 'endsWith', 'isNull', 'isNotNull']
    case 'number':
      return ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'isNull', 'isNotNull']
    case 'date':
      return ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'isNull', 'isNotNull']
    case 'boolean':
      return ['eq', 'neq', 'isNull', 'isNotNull']
    case 'select':
      return ['eq', 'neq', 'in', 'notIn', 'isNull', 'isNotNull']
    default:
      return ['eq', 'neq']
  }
}
