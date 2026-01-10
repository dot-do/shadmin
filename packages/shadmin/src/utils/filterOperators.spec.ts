/**
 * Tests for filter operator utilities
 * Issue: shadmin-qyay
 */

import { describe, it, expect } from 'vitest'
import {
  FilterOperator,
  parseFilterOperator,
  buildFilterKey,
  applyFilterOperator,
  extractOperatorFromKey,
  isOperatorFilter,
  FILTER_OPERATORS,
  applyFiltersWithOperators,
  getOperatorsForType,
  FILTER_OPERATOR_LABELS,
} from './filterOperators'

describe('filterOperators', () => {
  describe('FILTER_OPERATORS', () => {
    it('should export all expected operators', () => {
      expect(FILTER_OPERATORS).toContain('eq')
      expect(FILTER_OPERATORS).toContain('neq')
      expect(FILTER_OPERATORS).toContain('gt')
      expect(FILTER_OPERATORS).toContain('gte')
      expect(FILTER_OPERATORS).toContain('lt')
      expect(FILTER_OPERATORS).toContain('lte')
      expect(FILTER_OPERATORS).toContain('contains')
      expect(FILTER_OPERATORS).toContain('startsWith')
      expect(FILTER_OPERATORS).toContain('endsWith')
      expect(FILTER_OPERATORS).toContain('in')
      expect(FILTER_OPERATORS).toContain('notIn')
      expect(FILTER_OPERATORS).toContain('between')
      expect(FILTER_OPERATORS).toContain('isNull')
      expect(FILTER_OPERATORS).toContain('isNotNull')
    })
  })

  describe('parseFilterOperator', () => {
    it('should parse eq operator', () => {
      const result = parseFilterOperator('status_eq')
      expect(result).toEqual({ field: 'status', operator: 'eq' })
    })

    it('should parse neq operator', () => {
      const result = parseFilterOperator('status_neq')
      expect(result).toEqual({ field: 'status', operator: 'neq' })
    })

    it('should parse gt operator', () => {
      const result = parseFilterOperator('age_gt')
      expect(result).toEqual({ field: 'age', operator: 'gt' })
    })

    it('should parse gte operator', () => {
      const result = parseFilterOperator('age_gte')
      expect(result).toEqual({ field: 'age', operator: 'gte' })
    })

    it('should parse lt operator', () => {
      const result = parseFilterOperator('price_lt')
      expect(result).toEqual({ field: 'price', operator: 'lt' })
    })

    it('should parse lte operator', () => {
      const result = parseFilterOperator('price_lte')
      expect(result).toEqual({ field: 'price', operator: 'lte' })
    })

    it('should parse contains operator', () => {
      const result = parseFilterOperator('name_contains')
      expect(result).toEqual({ field: 'name', operator: 'contains' })
    })

    it('should parse startsWith operator', () => {
      const result = parseFilterOperator('title_startsWith')
      expect(result).toEqual({ field: 'title', operator: 'startsWith' })
    })

    it('should parse endsWith operator', () => {
      const result = parseFilterOperator('email_endsWith')
      expect(result).toEqual({ field: 'email', operator: 'endsWith' })
    })

    it('should parse in operator', () => {
      const result = parseFilterOperator('category_in')
      expect(result).toEqual({ field: 'category', operator: 'in' })
    })

    it('should parse notIn operator', () => {
      const result = parseFilterOperator('category_notIn')
      expect(result).toEqual({ field: 'category', operator: 'notIn' })
    })

    it('should parse between operator', () => {
      const result = parseFilterOperator('createdAt_between')
      expect(result).toEqual({ field: 'createdAt', operator: 'between' })
    })

    it('should parse isNull operator', () => {
      const result = parseFilterOperator('deletedAt_isNull')
      expect(result).toEqual({ field: 'deletedAt', operator: 'isNull' })
    })

    it('should parse isNotNull operator', () => {
      const result = parseFilterOperator('deletedAt_isNotNull')
      expect(result).toEqual({ field: 'deletedAt', operator: 'isNotNull' })
    })

    it('should default to eq when no operator is specified', () => {
      const result = parseFilterOperator('status')
      expect(result).toEqual({ field: 'status', operator: 'eq' })
    })

    it('should handle field names with underscores', () => {
      const result = parseFilterOperator('created_at_gte')
      expect(result).toEqual({ field: 'created_at', operator: 'gte' })
    })

    it('should handle nested field names with dots', () => {
      const result = parseFilterOperator('user.name_contains')
      expect(result).toEqual({ field: 'user.name', operator: 'contains' })
    })
  })

  describe('buildFilterKey', () => {
    it('should build key with eq operator (default)', () => {
      expect(buildFilterKey('status', 'eq')).toBe('status')
    })

    it('should build key with neq operator', () => {
      expect(buildFilterKey('status', 'neq')).toBe('status_neq')
    })

    it('should build key with gt operator', () => {
      expect(buildFilterKey('age', 'gt')).toBe('age_gt')
    })

    it('should build key with gte operator', () => {
      expect(buildFilterKey('age', 'gte')).toBe('age_gte')
    })

    it('should build key with lt operator', () => {
      expect(buildFilterKey('price', 'lt')).toBe('price_lt')
    })

    it('should build key with lte operator', () => {
      expect(buildFilterKey('price', 'lte')).toBe('price_lte')
    })

    it('should build key with contains operator', () => {
      expect(buildFilterKey('name', 'contains')).toBe('name_contains')
    })

    it('should build key with startsWith operator', () => {
      expect(buildFilterKey('title', 'startsWith')).toBe('title_startsWith')
    })

    it('should build key with endsWith operator', () => {
      expect(buildFilterKey('email', 'endsWith')).toBe('email_endsWith')
    })

    it('should build key with in operator', () => {
      expect(buildFilterKey('category', 'in')).toBe('category_in')
    })

    it('should build key with notIn operator', () => {
      expect(buildFilterKey('category', 'notIn')).toBe('category_notIn')
    })

    it('should build key with between operator', () => {
      expect(buildFilterKey('createdAt', 'between')).toBe('createdAt_between')
    })

    it('should build key with isNull operator', () => {
      expect(buildFilterKey('deletedAt', 'isNull')).toBe('deletedAt_isNull')
    })

    it('should build key with isNotNull operator', () => {
      expect(buildFilterKey('deletedAt', 'isNotNull')).toBe('deletedAt_isNotNull')
    })
  })

  describe('extractOperatorFromKey', () => {
    it('should extract operator from key with operator suffix', () => {
      expect(extractOperatorFromKey('age_gt')).toBe('gt')
      expect(extractOperatorFromKey('name_contains')).toBe('contains')
      expect(extractOperatorFromKey('status_neq')).toBe('neq')
    })

    it('should return eq for keys without operator suffix', () => {
      expect(extractOperatorFromKey('status')).toBe('eq')
      expect(extractOperatorFromKey('name')).toBe('eq')
    })
  })

  describe('isOperatorFilter', () => {
    it('should return true for keys with operator suffix', () => {
      expect(isOperatorFilter('age_gt')).toBe(true)
      expect(isOperatorFilter('name_contains')).toBe(true)
      expect(isOperatorFilter('status_neq')).toBe(true)
    })

    it('should return false for keys without operator suffix', () => {
      expect(isOperatorFilter('status')).toBe(false)
      expect(isOperatorFilter('name')).toBe(false)
    })
  })

  describe('applyFilterOperator', () => {
    describe('eq operator', () => {
      it('should match equal values', () => {
        expect(applyFilterOperator('active', 'eq', 'active')).toBe(true)
        expect(applyFilterOperator(100, 'eq', 100)).toBe(true)
        expect(applyFilterOperator(true, 'eq', true)).toBe(true)
      })

      it('should not match different values', () => {
        expect(applyFilterOperator('active', 'eq', 'inactive')).toBe(false)
        expect(applyFilterOperator(100, 'eq', 200)).toBe(false)
      })

      it('should perform case-insensitive string comparison', () => {
        expect(applyFilterOperator('Active', 'eq', 'active')).toBe(true)
        expect(applyFilterOperator('HELLO', 'eq', 'hello')).toBe(true)
      })
    })

    describe('neq operator', () => {
      it('should match different values', () => {
        expect(applyFilterOperator('active', 'neq', 'inactive')).toBe(true)
        expect(applyFilterOperator(100, 'neq', 200)).toBe(true)
      })

      it('should not match equal values', () => {
        expect(applyFilterOperator('active', 'neq', 'active')).toBe(false)
        expect(applyFilterOperator(100, 'neq', 100)).toBe(false)
      })
    })

    describe('gt operator', () => {
      it('should match values greater than filter value', () => {
        expect(applyFilterOperator(100, 'gt', 50)).toBe(true)
        expect(applyFilterOperator(10.5, 'gt', 10)).toBe(true)
      })

      it('should not match equal or lesser values', () => {
        expect(applyFilterOperator(50, 'gt', 50)).toBe(false)
        expect(applyFilterOperator(50, 'gt', 100)).toBe(false)
      })

      it('should handle date comparisons', () => {
        const later = new Date('2024-01-02').toISOString()
        const earlier = new Date('2024-01-01').toISOString()
        expect(applyFilterOperator(later, 'gt', earlier)).toBe(true)
        expect(applyFilterOperator(earlier, 'gt', later)).toBe(false)
      })
    })

    describe('gte operator', () => {
      it('should match values greater than or equal to filter value', () => {
        expect(applyFilterOperator(100, 'gte', 50)).toBe(true)
        expect(applyFilterOperator(50, 'gte', 50)).toBe(true)
      })

      it('should not match lesser values', () => {
        expect(applyFilterOperator(50, 'gte', 100)).toBe(false)
      })
    })

    describe('lt operator', () => {
      it('should match values less than filter value', () => {
        expect(applyFilterOperator(50, 'lt', 100)).toBe(true)
        expect(applyFilterOperator(10, 'lt', 10.5)).toBe(true)
      })

      it('should not match equal or greater values', () => {
        expect(applyFilterOperator(50, 'lt', 50)).toBe(false)
        expect(applyFilterOperator(100, 'lt', 50)).toBe(false)
      })
    })

    describe('lte operator', () => {
      it('should match values less than or equal to filter value', () => {
        expect(applyFilterOperator(50, 'lte', 100)).toBe(true)
        expect(applyFilterOperator(50, 'lte', 50)).toBe(true)
      })

      it('should not match greater values', () => {
        expect(applyFilterOperator(100, 'lte', 50)).toBe(false)
      })
    })

    describe('contains operator', () => {
      it('should match substring matches', () => {
        expect(applyFilterOperator('Hello World', 'contains', 'World')).toBe(true)
        expect(applyFilterOperator('Hello World', 'contains', 'lo Wo')).toBe(true)
      })

      it('should be case insensitive', () => {
        expect(applyFilterOperator('Hello World', 'contains', 'world')).toBe(true)
        expect(applyFilterOperator('hello world', 'contains', 'WORLD')).toBe(true)
      })

      it('should not match non-substrings', () => {
        expect(applyFilterOperator('Hello World', 'contains', 'Goodbye')).toBe(false)
      })
    })

    describe('startsWith operator', () => {
      it('should match strings starting with filter value', () => {
        expect(applyFilterOperator('Hello World', 'startsWith', 'Hello')).toBe(true)
        expect(applyFilterOperator('test@example.com', 'startsWith', 'test')).toBe(true)
      })

      it('should be case insensitive', () => {
        expect(applyFilterOperator('Hello World', 'startsWith', 'hello')).toBe(true)
      })

      it('should not match non-prefix strings', () => {
        expect(applyFilterOperator('Hello World', 'startsWith', 'World')).toBe(false)
      })
    })

    describe('endsWith operator', () => {
      it('should match strings ending with filter value', () => {
        expect(applyFilterOperator('Hello World', 'endsWith', 'World')).toBe(true)
        expect(applyFilterOperator('test@example.com', 'endsWith', '.com')).toBe(true)
      })

      it('should be case insensitive', () => {
        expect(applyFilterOperator('Hello World', 'endsWith', 'world')).toBe(true)
      })

      it('should not match non-suffix strings', () => {
        expect(applyFilterOperator('Hello World', 'endsWith', 'Hello')).toBe(false)
      })
    })

    describe('in operator', () => {
      it('should match values in the array', () => {
        expect(applyFilterOperator('active', 'in', ['active', 'pending'])).toBe(true)
        expect(applyFilterOperator(1, 'in', [1, 2, 3])).toBe(true)
      })

      it('should not match values not in the array', () => {
        expect(applyFilterOperator('inactive', 'in', ['active', 'pending'])).toBe(false)
        expect(applyFilterOperator(4, 'in', [1, 2, 3])).toBe(false)
      })

      it('should handle empty arrays', () => {
        expect(applyFilterOperator('active', 'in', [])).toBe(false)
      })
    })

    describe('notIn operator', () => {
      it('should match values not in the array', () => {
        expect(applyFilterOperator('inactive', 'notIn', ['active', 'pending'])).toBe(true)
        expect(applyFilterOperator(4, 'notIn', [1, 2, 3])).toBe(true)
      })

      it('should not match values in the array', () => {
        expect(applyFilterOperator('active', 'notIn', ['active', 'pending'])).toBe(false)
        expect(applyFilterOperator(1, 'notIn', [1, 2, 3])).toBe(false)
      })

      it('should handle empty arrays (always true)', () => {
        expect(applyFilterOperator('anything', 'notIn', [])).toBe(true)
      })
    })

    describe('between operator', () => {
      it('should match values within range (inclusive)', () => {
        expect(applyFilterOperator(50, 'between', [0, 100])).toBe(true)
        expect(applyFilterOperator(0, 'between', [0, 100])).toBe(true)
        expect(applyFilterOperator(100, 'between', [0, 100])).toBe(true)
      })

      it('should not match values outside range', () => {
        expect(applyFilterOperator(-1, 'between', [0, 100])).toBe(false)
        expect(applyFilterOperator(101, 'between', [0, 100])).toBe(false)
      })

      it('should handle date ranges', () => {
        const start = '2024-01-01'
        const end = '2024-12-31'
        const middle = '2024-06-15'
        const before = '2023-12-31'

        expect(applyFilterOperator(middle, 'between', [start, end])).toBe(true)
        expect(applyFilterOperator(before, 'between', [start, end])).toBe(false)
      })

      it('should handle invalid range format', () => {
        expect(applyFilterOperator(50, 'between', 'invalid')).toBe(false)
        expect(applyFilterOperator(50, 'between', [0])).toBe(false)
      })
    })

    describe('isNull operator', () => {
      it('should match null values', () => {
        expect(applyFilterOperator(null, 'isNull', true)).toBe(true)
        expect(applyFilterOperator(undefined, 'isNull', true)).toBe(true)
      })

      it('should not match non-null values', () => {
        expect(applyFilterOperator('value', 'isNull', true)).toBe(false)
        expect(applyFilterOperator(0, 'isNull', true)).toBe(false)
        expect(applyFilterOperator('', 'isNull', true)).toBe(false)
      })

      it('should invert when filter value is false', () => {
        expect(applyFilterOperator(null, 'isNull', false)).toBe(false)
        expect(applyFilterOperator('value', 'isNull', false)).toBe(true)
      })
    })

    describe('isNotNull operator', () => {
      it('should match non-null values', () => {
        expect(applyFilterOperator('value', 'isNotNull', true)).toBe(true)
        expect(applyFilterOperator(0, 'isNotNull', true)).toBe(true)
        expect(applyFilterOperator('', 'isNotNull', true)).toBe(true)
      })

      it('should not match null values', () => {
        expect(applyFilterOperator(null, 'isNotNull', true)).toBe(false)
        expect(applyFilterOperator(undefined, 'isNotNull', true)).toBe(false)
      })

      it('should invert when filter value is false', () => {
        expect(applyFilterOperator('value', 'isNotNull', false)).toBe(false)
        expect(applyFilterOperator(null, 'isNotNull', false)).toBe(true)
      })
    })

    describe('edge cases', () => {
      it('should handle null item values for comparison operators', () => {
        expect(applyFilterOperator(null, 'gt', 50)).toBe(false)
        expect(applyFilterOperator(undefined, 'lt', 50)).toBe(false)
      })

      it('should handle numeric strings', () => {
        expect(applyFilterOperator('100', 'gt', 50)).toBe(true)
        expect(applyFilterOperator('100', 'gt', '50')).toBe(true)
      })

      it('should return true for unknown operator (fallback to eq)', () => {
        expect(applyFilterOperator('value', 'unknown' as FilterOperator, 'value')).toBe(true)
      })
    })
  })

  describe('applyFiltersWithOperators', () => {
    const testData = [
      { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', status: 'active', deletedAt: null },
      { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', status: 'pending', deletedAt: null },
      { id: 3, name: 'Bob Wilson', age: 40, email: 'bob@test.org', status: 'active', deletedAt: '2024-01-15' },
      { id: 4, name: 'Alice Brown', age: 35, email: 'alice@example.com', status: 'inactive', deletedAt: null },
    ]

    it('should return all items when no filter is provided', () => {
      expect(applyFiltersWithOperators(testData, {})).toHaveLength(4)
    })

    it('should filter with eq operator (implicit)', () => {
      const result = applyFiltersWithOperators(testData, { status: 'active' })
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toEqual([1, 3])
    })

    it('should filter with gt operator', () => {
      const result = applyFiltersWithOperators(testData, { age_gt: 30 })
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toEqual([3, 4])
    })

    it('should filter with gte operator', () => {
      const result = applyFiltersWithOperators(testData, { age_gte: 30 })
      expect(result).toHaveLength(3)
      expect(result.map(r => r.id)).toEqual([1, 3, 4])
    })

    it('should filter with lt operator', () => {
      const result = applyFiltersWithOperators(testData, { age_lt: 30 })
      expect(result).toHaveLength(1)
      expect(result.map(r => r.id)).toEqual([2])
    })

    it('should filter with lte operator', () => {
      const result = applyFiltersWithOperators(testData, { age_lte: 30 })
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toEqual([1, 2])
    })

    it('should filter with contains operator', () => {
      const result = applyFiltersWithOperators(testData, { name_contains: 'smith' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(2)
    })

    it('should filter with startsWith operator', () => {
      const result = applyFiltersWithOperators(testData, { name_startsWith: 'john' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })

    it('should filter with endsWith operator', () => {
      const result = applyFiltersWithOperators(testData, { email_endsWith: '.org' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(3)
    })

    it('should filter with in operator', () => {
      const result = applyFiltersWithOperators(testData, { status_in: ['active', 'pending'] })
      expect(result).toHaveLength(3)
      expect(result.map(r => r.id)).toEqual([1, 2, 3])
    })

    it('should filter with notIn operator', () => {
      const result = applyFiltersWithOperators(testData, { status_notIn: ['active', 'pending'] })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(4)
    })

    it('should filter with between operator', () => {
      const result = applyFiltersWithOperators(testData, { age_between: [26, 35] })
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toEqual([1, 4])
    })

    it('should filter with isNull operator', () => {
      const result = applyFiltersWithOperators(testData, { deletedAt_isNull: true })
      expect(result).toHaveLength(3)
      expect(result.map(r => r.id)).toEqual([1, 2, 4])
    })

    it('should filter with isNotNull operator', () => {
      const result = applyFiltersWithOperators(testData, { deletedAt_isNotNull: true })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(3)
    })

    it('should filter with neq operator', () => {
      const result = applyFiltersWithOperators(testData, { status_neq: 'active' })
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toEqual([2, 4])
    })

    it('should combine multiple filters (AND logic)', () => {
      const result = applyFiltersWithOperators(testData, {
        age_gte: 30,
        status: 'active',
      })
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toEqual([1, 3])
    })

    it('should skip empty filter values', () => {
      const result = applyFiltersWithOperators(testData, {
        name_contains: '',
        age_gt: undefined,
        status: null,
      })
      expect(result).toHaveLength(4)
    })

    it('should handle nested field names', () => {
      const nestedData = [
        { id: 1, user: { name: 'John', role: 'admin' } },
        { id: 2, user: { name: 'Jane', role: 'user' } },
      ]
      const result = applyFiltersWithOperators(nestedData, { 'user.role': 'admin' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })
  })

  describe('getOperatorsForType', () => {
    it('should return correct operators for text type', () => {
      const operators = getOperatorsForType('text')
      expect(operators).toContain('eq')
      expect(operators).toContain('neq')
      expect(operators).toContain('contains')
      expect(operators).toContain('startsWith')
      expect(operators).toContain('endsWith')
      expect(operators).toContain('isNull')
      expect(operators).toContain('isNotNull')
      expect(operators).not.toContain('gt')
      expect(operators).not.toContain('between')
    })

    it('should return correct operators for number type', () => {
      const operators = getOperatorsForType('number')
      expect(operators).toContain('eq')
      expect(operators).toContain('neq')
      expect(operators).toContain('gt')
      expect(operators).toContain('gte')
      expect(operators).toContain('lt')
      expect(operators).toContain('lte')
      expect(operators).toContain('between')
      expect(operators).toContain('isNull')
      expect(operators).toContain('isNotNull')
      expect(operators).not.toContain('contains')
    })

    it('should return correct operators for date type', () => {
      const operators = getOperatorsForType('date')
      expect(operators).toContain('eq')
      expect(operators).toContain('neq')
      expect(operators).toContain('gt')
      expect(operators).toContain('gte')
      expect(operators).toContain('lt')
      expect(operators).toContain('lte')
      expect(operators).toContain('between')
      expect(operators).toContain('isNull')
      expect(operators).toContain('isNotNull')
    })

    it('should return correct operators for boolean type', () => {
      const operators = getOperatorsForType('boolean')
      expect(operators).toContain('eq')
      expect(operators).toContain('neq')
      expect(operators).toContain('isNull')
      expect(operators).toContain('isNotNull')
      expect(operators).not.toContain('gt')
      expect(operators).not.toContain('contains')
    })

    it('should return correct operators for select type', () => {
      const operators = getOperatorsForType('select')
      expect(operators).toContain('eq')
      expect(operators).toContain('neq')
      expect(operators).toContain('in')
      expect(operators).toContain('notIn')
      expect(operators).toContain('isNull')
      expect(operators).toContain('isNotNull')
      expect(operators).not.toContain('contains')
    })
  })

  describe('FILTER_OPERATOR_LABELS', () => {
    it('should have labels for all operators', () => {
      for (const op of FILTER_OPERATORS) {
        expect(FILTER_OPERATOR_LABELS[op]).toBeDefined()
        expect(typeof FILTER_OPERATOR_LABELS[op]).toBe('string')
      }
    })

    it('should have meaningful labels', () => {
      expect(FILTER_OPERATOR_LABELS.eq).toBe('equals')
      expect(FILTER_OPERATOR_LABELS.neq).toBe('does not equal')
      expect(FILTER_OPERATOR_LABELS.gt).toBe('greater than')
      expect(FILTER_OPERATOR_LABELS.contains).toBe('contains')
      expect(FILTER_OPERATOR_LABELS.between).toBe('is between')
    })
  })
})
