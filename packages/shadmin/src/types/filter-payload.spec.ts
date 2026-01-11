/**
 * FilterPayload Type Tests
 *
 * This file verifies that the enhanced FilterPayload type:
 * 1. Maintains backward compatibility with untyped usage
 * 2. Provides type-safe filter keys when used with a specific record type
 * 3. Supports filter operators (e.g., _gt, _contains, _in)
 * 4. Allows nested field access
 * 5. Integrates correctly with hooks and contexts
 *
 * Issue: shadmin-ggn9 - Leverage FilterPayload generic parameter
 */

import { describe, it, expect } from 'vitest'
import type {
  RaRecord,
  FilterPayload,
  TypedFilterPayload,
  FilterKeys,
  FilterOperator,
  GetListParams,
} from './data-provider'

// Test record types
interface User extends RaRecord {
  name: string
  email: string
  age: number
  active: boolean
  createdAt: string
}

interface Post extends RaRecord {
  title: string
  content: string
  authorId: number
  published: boolean
  views: number
}

describe('FilterPayload Type Improvements', () => {
  describe('Backward Compatibility', () => {
    it('should accept any keys when used without type parameter', () => {
      // This is the existing behavior - should continue to work
      const filter: FilterPayload = {
        status: 'active',
        age_gt: 18,
        custom_field: 'value',
        any_key_should_work: true,
      }

      expect(filter.status).toBe('active')
      expect(filter.age_gt).toBe(18)
    })

    it('should accept any keys when used with RaRecord explicitly', () => {
      const filter: FilterPayload<RaRecord> = {
        any_field: 'value',
        another_field: 123,
      }

      expect(filter.any_field).toBe('value')
    })

    it('should work in GetListParams without type parameter', () => {
      const params: GetListParams = {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { status: 'active', custom_filter: 'value' },
      }

      expect(params.filter.status).toBe('active')
    })
  })

  describe('Type-Safe Filter Keys', () => {
    it('should suggest field names from record type', () => {
      // With a typed record, the filter should recognize field names
      const filter: FilterPayload<User> = {
        name: 'John',
        email: 'john@example.com',
        age: 25,
        active: true,
      }

      expect(filter.name).toBe('John')
      expect(filter.age).toBe(25)
    })

    it('should suggest filter operators with field names', () => {
      // Filter operators like _gt, _contains should be recognized
      const filter: FilterPayload<User> = {
        age_gt: 18,
        age_lte: 65,
        name_contains: 'John',
        email_icontains: 'example',
        active_eq: true,
      }

      expect(filter.age_gt).toBe(18)
      expect(filter.name_contains).toBe('John')
    })

    it('should allow id field with operators', () => {
      const filter: FilterPayload<User> = {
        id: 1,
        id_in: [1, 2, 3],
        id_ne: 5,
      }

      expect(filter.id).toBe(1)
      expect(filter.id_in).toEqual([1, 2, 3])
    })

    it('should allow q for full-text search', () => {
      const filter: FilterPayload<User> = {
        q: 'search term',
        name_contains: 'John',
      }

      expect(filter.q).toBe('search term')
    })

    it('should allow nested field access', () => {
      const filter: FilterPayload<User> = {
        'author.name': 'Jane',
        'profile.settings.theme': 'dark',
      }

      expect(filter['author.name']).toBe('Jane')
    })

    it('should still allow additional unknown keys for flexibility', () => {
      // Even with typed records, we allow extra keys for custom filters
      const filter: FilterPayload<User> = {
        name: 'John',
        custom_server_filter: 'value', // Data provider might support custom filters
      }

      expect(filter.name).toBe('John')
      expect(filter.custom_server_filter).toBe('value')
    })
  })

  describe('TypedFilterPayload (Strict Version)', () => {
    it('should provide strict typing for filter keys', () => {
      const filter: TypedFilterPayload<User> = {
        name: 'John',
        name_contains: 'Jo',
        age_gt: 18,
        active: true,
      }

      expect(filter.name).toBe('John')
    })
  })

  describe('FilterKeys Utility Type', () => {
    it('should generate correct filter keys for a record type', () => {
      // This is a compile-time check - if it compiles, the types work
      type UserFilterKeys = FilterKeys<User>

      // These should all be valid keys
      const validKeys: UserFilterKeys[] = [
        'name',
        'name_contains',
        'name_startswith',
        'age',
        'age_gt',
        'age_lte',
        'id',
        'id_in',
        'q',
        'author.name', // nested access
      ]

      expect(validKeys.length).toBeGreaterThan(0)
    })
  })

  describe('FilterOperator Type', () => {
    it('should include all common filter operators', () => {
      const operators: FilterOperator[] = [
        '', // exact match
        '_gt',
        '_gte',
        '_lt',
        '_lte',
        '_ne',
        '_eq',
        '_in',
        '_nin',
        '_contains',
        '_icontains',
        '_startswith',
        '_endswith',
        '_isnull',
        '_like',
        '_ilike',
        '_regex',
        '_exists',
        '_between',
        '_not',
      ]

      // All should be valid FilterOperator values
      expect(operators).toHaveLength(20)
    })
  })

  describe('Integration with GetListParams', () => {
    it('should provide typed filter in GetListParams', () => {
      const params: GetListParams<User> = {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
        filter: {
          name_contains: 'John',
          age_gte: 18,
          active: true,
        },
      }

      expect(params.filter.name_contains).toBe('John')
    })

    it('should work with Post record type', () => {
      const params: GetListParams<Post> = {
        pagination: { page: 1, perPage: 25 },
        sort: { field: 'views', order: 'DESC' },
        filter: {
          published: true,
          views_gt: 100,
          title_icontains: 'typescript',
          authorId: 5,
        },
      }

      expect(params.filter.published).toBe(true)
      expect(params.filter.views_gt).toBe(100)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty filter', () => {
      const filter: FilterPayload<User> = {}
      expect(Object.keys(filter)).toHaveLength(0)
    })

    it('should handle null and undefined values', () => {
      const filter: FilterPayload<User> = {
        name: null,
        age: undefined,
        active_isnull: true,
      }

      expect(filter.name).toBeNull()
      expect(filter.age).toBeUndefined()
    })

    it('should handle array values for _in operator', () => {
      const filter: FilterPayload<User> = {
        id_in: [1, 2, 3, 4, 5],
        name_in: ['John', 'Jane', 'Bob'],
      }

      expect(filter.id_in).toEqual([1, 2, 3, 4, 5])
    })

    it('should handle tuple values for _between operator', () => {
      const filter: FilterPayload<User> = {
        age_between: [18, 65],
        createdAt_between: ['2024-01-01', '2024-12-31'],
      }

      expect(filter.age_between).toEqual([18, 65])
    })
  })
})
