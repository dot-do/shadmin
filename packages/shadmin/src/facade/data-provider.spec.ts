/**
 * Facade DataProvider Type Tests
 *
 * This test suite validates the DataProvider type definitions exported by the facade layer.
 * The facade provides a stable, shadmin-specific API that abstracts the underlying ra-core types.
 *
 * KEY CONCEPTS TESTED:
 * 1. Identifier Type - Union of string | number for record IDs
 * 2. RaRecord Type - Base record interface with required 'id' field
 * 3. Payload Types - SortPayload, PaginationPayload, FilterPayload
 * 4. Params/Result Types - For each DataProvider method
 * 5. DataProvider Interface - Complete CRUD interface contract
 * 6. Type Compatibility - Ensuring facade types work with ra-core
 *
 * WHY THESE TESTS MATTER:
 * - The facade layer is shadmin's public API - it must be stable
 * - Type tests catch breaking changes at compile time
 * - DataProvider is THE central abstraction for all data operations
 * - Components depend on these types for type-safe data access
 * - Any ra-core version upgrade must maintain facade compatibility
 *
 * DATAPROVIDER METHODS:
 *
 * Read Operations:
 *   getList(resource, params) → { data: Record[], total?, pageInfo? }
 *     - Fetch paginated, sorted, filtered list
 *     - Supports offset pagination (total) or cursor pagination (pageInfo)
 *
 *   getOne(resource, { id }) → { data: Record }
 *     - Fetch single record by ID
 *
 *   getMany(resource, { ids }) → { data: Record[] }
 *     - Fetch multiple records by ID array (for reference fields)
 *
 *   getManyReference(resource, { target, id, ... }) → { data: Record[], total }
 *     - Fetch related records (e.g., comments for a post)
 *
 * Write Operations:
 *   create(resource, { data }) → { data: Record }
 *     - Create new record, returns created record with ID
 *
 *   update(resource, { id, data, previousData }) → { data: Record }
 *     - Update existing record, previousData enables optimistic locking
 *
 *   updateMany(resource, { ids, data }) → { data: Identifier[] }
 *     - Bulk update, returns array of updated IDs
 *
 *   delete(resource, { id, previousData }) → { data: Record }
 *     - Delete single record
 *
 *   deleteMany(resource, { ids }) → { data: Identifier[] }
 *     - Bulk delete, returns array of deleted IDs
 *
 * COMMON PARAMS:
 *   pagination: { page: number, perPage: number }
 *   sort: { field: string, order: 'ASC' | 'DESC' }
 *   filter: { [key: string]: any } - See filterOperators for key format
 *   meta: { [key: string]: any } - Custom metadata for DataProvider
 *
 * TEST SETUP:
 * - Type tests use explicit type annotations to verify compile-time correctness
 * - Mock implementations verify runtime behavior
 * - vi.fn() mocks enable parameter and call assertions
 *
 * EDGE CASES COVERED:
 * - String vs number identifiers
 * - Generic typing for custom record types
 * - Optional fields (meta, previousData, pageInfo)
 * - Cursor-based pagination via pageInfo
 */

import { describe, it, expect, vi } from 'vitest'

// Import from facade (these imports will fail until we implement the facade)
import type {
  DataProvider,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  GetManyParams,
  GetManyResult,
  GetManyReferenceParams,
  GetManyReferenceResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  UpdateManyParams,
  UpdateManyResult,
  DeleteParams,
  DeleteResult,
  DeleteManyParams,
  DeleteManyResult,
  Identifier,
  RaRecord,
  SortPayload,
  PaginationPayload,
  FilterPayload,
} from './data-provider'

describe('Facade: DataProvider Types', () => {
  describe('Identifier type', () => {
    it('should accept string identifiers', () => {
      const id: Identifier = 'test-id'
      expect(id).toBe('test-id')
    })

    it('should accept number identifiers', () => {
      const id: Identifier = 123
      expect(id).toBe(123)
    })
  })

  describe('RaRecord type', () => {
    it('should require an id field', () => {
      const record: RaRecord = { id: 1 }
      expect(record.id).toBe(1)
    })

    it('should allow additional properties', () => {
      const record: RaRecord = { id: 1, name: 'Test', active: true }
      expect(record.name).toBe('Test')
      expect(record.active).toBe(true)
    })

    it('should allow generic typing for id', () => {
      const record: RaRecord<string> = { id: 'uuid-123' }
      expect(record.id).toBe('uuid-123')
    })
  })

  describe('SortPayload type', () => {
    it('should have field and order properties', () => {
      const sort: SortPayload = { field: 'name', order: 'ASC' }
      expect(sort.field).toBe('name')
      expect(sort.order).toBe('ASC')
    })

    it('should accept DESC order', () => {
      const sort: SortPayload = { field: 'createdAt', order: 'DESC' }
      expect(sort.order).toBe('DESC')
    })
  })

  describe('PaginationPayload type', () => {
    it('should have page and perPage properties', () => {
      const pagination: PaginationPayload = { page: 1, perPage: 25 }
      expect(pagination.page).toBe(1)
      expect(pagination.perPage).toBe(25)
    })
  })

  describe('FilterPayload type', () => {
    it('should accept any key-value pairs', () => {
      const filter: FilterPayload = { status: 'active', age_gte: 18 }
      expect(filter.status).toBe('active')
      expect(filter.age_gte).toBe(18)
    })
  })
})

describe('Facade: DataProvider Interface', () => {
  const mockDataProvider: DataProvider = {
    getList: vi.fn(),
    getOne: vi.fn(),
    getMany: vi.fn(),
    getManyReference: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  }

  describe('getList method', () => {
    it('should accept GetListParams and return GetListResult', async () => {
      const params: GetListParams = {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      }
      const expectedResult: GetListResult = {
        data: [{ id: 1, name: 'Test' }],
        total: 1,
      }

      vi.mocked(mockDataProvider.getList).mockResolvedValueOnce(expectedResult)
      const result = await mockDataProvider.getList('posts', params)

      expect(result.data).toEqual(expectedResult.data)
      expect(result.total).toBe(1)
    })

    it('should support pageInfo for cursor-based pagination', async () => {
      const expectedResult: GetListResult = {
        data: [{ id: 1 }],
        pageInfo: { hasNextPage: true, hasPreviousPage: false },
      }

      vi.mocked(mockDataProvider.getList).mockResolvedValueOnce(expectedResult)
      const result = await mockDataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(result.pageInfo?.hasNextPage).toBe(true)
    })

    it('should support meta parameter', async () => {
      const params: GetListParams = {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
        meta: { includeDeleted: true },
      }

      vi.mocked(mockDataProvider.getList).mockResolvedValueOnce({ data: [], total: 0 })
      await mockDataProvider.getList('posts', params)

      expect(mockDataProvider.getList).toHaveBeenCalledWith('posts', params)
    })
  })

  describe('getOne method', () => {
    it('should accept GetOneParams and return GetOneResult', async () => {
      const params: GetOneParams = { id: 1 }
      const expectedResult: GetOneResult = { data: { id: 1, name: 'Test' } }

      vi.mocked(mockDataProvider.getOne).mockResolvedValueOnce(expectedResult)
      const result = await mockDataProvider.getOne('posts', params)

      expect(result.data.id).toBe(1)
    })

    it('should support string identifiers', async () => {
      const params: GetOneParams = { id: 'uuid-123' }
      vi.mocked(mockDataProvider.getOne).mockResolvedValueOnce({
        data: { id: 'uuid-123' },
      })
      const result = await mockDataProvider.getOne('posts', params)

      expect(result.data.id).toBe('uuid-123')
    })
  })

  describe('getMany method', () => {
    it('should accept GetManyParams and return GetManyResult', async () => {
      const params: GetManyParams = { ids: [1, 2, 3] }
      const expectedResult: GetManyResult = {
        data: [{ id: 1 }, { id: 2 }, { id: 3 }],
      }

      vi.mocked(mockDataProvider.getMany).mockResolvedValueOnce(expectedResult)
      const result = await mockDataProvider.getMany('posts', params)

      expect(result.data).toHaveLength(3)
    })
  })

  describe('getManyReference method', () => {
    it('should accept GetManyReferenceParams and return GetManyReferenceResult', async () => {
      const params: GetManyReferenceParams = {
        target: 'post_id',
        id: 1,
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      }
      const expectedResult: GetManyReferenceResult = {
        data: [{ id: 1, post_id: 1 }],
        total: 1,
      }

      vi.mocked(mockDataProvider.getManyReference).mockResolvedValueOnce(expectedResult)
      const result = await mockDataProvider.getManyReference('comments', params)

      expect((result.data[0] as Record<string, unknown>).post_id).toBe(1)
    })
  })

  describe('create method', () => {
    it('should accept CreateParams and return CreateResult', async () => {
      const params: CreateParams = { data: { name: 'New Post' } }
      const expectedResult: CreateResult = { data: { id: 1, name: 'New Post' } }

      vi.mocked(mockDataProvider.create).mockResolvedValueOnce(expectedResult)
      const result = await mockDataProvider.create('posts', params)

      expect(result.data.id).toBe(1)
    })
  })

  describe('update method', () => {
    it('should accept UpdateParams and return UpdateResult', async () => {
      const params: UpdateParams = {
        id: 1,
        data: { name: 'Updated Post' },
        previousData: { id: 1, name: 'Old Post' },
      }
      const expectedResult: UpdateResult = { data: { id: 1, name: 'Updated Post' } }

      vi.mocked(mockDataProvider.update).mockResolvedValueOnce(expectedResult)
      const result = await mockDataProvider.update('posts', params)

      expect(result.data.name).toBe('Updated Post')
    })
  })

  describe('updateMany method', () => {
    it('should accept UpdateManyParams and return UpdateManyResult', async () => {
      const params: UpdateManyParams = {
        ids: [1, 2, 3],
        data: { status: 'published' },
      }
      const expectedResult: UpdateManyResult = { data: [1, 2, 3] }

      vi.mocked(mockDataProvider.updateMany).mockResolvedValueOnce(expectedResult)
      const result = await mockDataProvider.updateMany('posts', params)

      expect(result.data).toEqual([1, 2, 3])
    })
  })

  describe('delete method', () => {
    it('should accept DeleteParams and return DeleteResult', async () => {
      const params: DeleteParams = { id: 1, previousData: { id: 1, name: 'Post' } }
      const expectedResult: DeleteResult = { data: { id: 1, name: 'Post' } }

      vi.mocked(mockDataProvider.delete).mockResolvedValueOnce(expectedResult)
      const result = await mockDataProvider.delete('posts', params)

      expect(result.data?.id).toBe(1)
    })
  })

  describe('deleteMany method', () => {
    it('should accept DeleteManyParams and return DeleteManyResult', async () => {
      const params: DeleteManyParams = { ids: [1, 2, 3] }
      const expectedResult: DeleteManyResult = { data: [1, 2, 3] }

      vi.mocked(mockDataProvider.deleteMany).mockResolvedValueOnce(expectedResult)
      const result = await mockDataProvider.deleteMany('posts', params)

      expect(result.data).toEqual([1, 2, 3])
    })
  })
})

describe('Facade: DataProvider Type Compatibility', () => {
  it('should be compatible with ra-core DataProvider interface', () => {
    // This test ensures our facade types match the expected shape
    // If the facade is incompatible, TypeScript will fail compilation
    const createMockProvider = (): DataProvider => ({
      getList: async <RecordType extends RaRecord = RaRecord>() =>
        ({ data: [], total: 0 }) as GetListResult<RecordType>,
      getOne: async <RecordType extends RaRecord = RaRecord>() =>
        ({ data: { id: 1 } }) as GetOneResult<RecordType>,
      getMany: async <RecordType extends RaRecord = RaRecord>() =>
        ({ data: [] }) as GetManyResult<RecordType>,
      getManyReference: async <RecordType extends RaRecord = RaRecord>() =>
        ({ data: [], total: 0 }) as GetManyReferenceResult<RecordType>,
      create: async <RecordType extends RaRecord = RaRecord>() =>
        ({ data: { id: 1 } }) as CreateResult<RecordType>,
      update: async <RecordType extends RaRecord = RaRecord>() =>
        ({ data: { id: 1 } }) as UpdateResult<RecordType>,
      updateMany: async () => ({ data: [] }),
      delete: async <RecordType extends RaRecord = RaRecord>() =>
        ({ data: { id: 1 } }) as DeleteResult<RecordType>,
      deleteMany: async () => ({ data: [] }),
    })

    const provider = createMockProvider()
    expect(provider).toBeDefined()
    expect(typeof provider.getList).toBe('function')
    expect(typeof provider.getOne).toBe('function')
    expect(typeof provider.getMany).toBe('function')
    expect(typeof provider.getManyReference).toBe('function')
    expect(typeof provider.create).toBe('function')
    expect(typeof provider.update).toBe('function')
    expect(typeof provider.updateMany).toBe('function')
    expect(typeof provider.delete).toBe('function')
    expect(typeof provider.deleteMany).toBe('function')
  })
})
