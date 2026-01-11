/**
 * mongo.do DataProvider Tests
 *
 * Tests for the mongo.do data provider implementation.
 * Validates CRUD operations, filter conversion, and error handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createMongoDataProvider } from './data-provider'
import type { DataProvider } from '../facade'

// Mock fetch globally
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('createMongoDataProvider', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    vi.clearAllMocks()
    dataProvider = createMongoDataProvider({
      baseUrl: 'https://test.mongo.do',
      apiKey: 'test-api-key',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('configuration', () => {
    it('should create a DataProvider with all required methods', () => {
      expect(dataProvider).toBeDefined()
      expect(typeof dataProvider.getList).toBe('function')
      expect(typeof dataProvider.getOne).toBe('function')
      expect(typeof dataProvider.getMany).toBe('function')
      expect(typeof dataProvider.getManyReference).toBe('function')
      expect(typeof dataProvider.create).toBe('function')
      expect(typeof dataProvider.update).toBe('function')
      expect(typeof dataProvider.updateMany).toBe('function')
      expect(typeof dataProvider.delete).toBe('function')
      expect(typeof dataProvider.deleteMany).toBe('function')
    })

    it('should include Authorization header when apiKey is provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { id: '1', name: 'Test' } }),
      })

      await dataProvider.getOne('users', { id: '1' })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.mongo.do/users/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        })
      )
    })

    it('should use resource mapping when provided', async () => {
      const mappedProvider = createMongoDataProvider(
        { baseUrl: 'https://test.mongo.do' },
        { resourceMapping: { users: 'user-accounts' } }
      )

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { id: '1', name: 'Test' } }),
      })

      await mappedProvider.getOne('users', { id: '1' })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.mongo.do/user-accounts/1',
        expect.any(Object)
      )
    })

    it('should include database in URL when provided', async () => {
      const dbProvider = createMongoDataProvider({
        baseUrl: 'https://test.mongo.do',
        database: 'production',
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { id: '1', name: 'Test' } }),
      })

      await dbProvider.getOne('users', { id: '1' })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.mongo.do/production/users/1',
        expect.any(Object)
      )
    })
  })

  describe('getList', () => {
    it('should fetch a list of records with pagination and sorting', async () => {
      const mockData = {
        data: [
          { _id: '1', name: 'Alice' },
          { _id: '2', name: 'Bob' },
        ],
        total: 2,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await dataProvider.getList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
        filter: {},
      })

      expect(result.data).toHaveLength(2)
      expect(result.data[0]).toHaveProperty('id', '1')
      expect(result.total).toBe(2)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.mongo.do/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            action: 'find',
            filter: {},
            sort: { name: 1 },
            skip: 0,
            limit: 10,
          }),
        })
      )
    })

    it('should convert filter operators to MongoDB format', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0 }),
      })

      await dataProvider.getList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: '_id', order: 'DESC' },
        filter: {
          age_gte: 18,
          age_lte: 65,
          status: 'active',
          name_contains: 'john',
        },
      })

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)

      expect(callBody.filter).toEqual({
        age: { $gte: 18, $lte: 65 },
        status: 'active',
        name: { $regex: 'john', $options: 'i' },
      })
    })

    it('should handle full-text search with q parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0 }),
      })

      await dataProvider.getList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: '_id', order: 'DESC' },
        filter: { q: 'search term' },
      })

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)

      expect(callBody.filter.$or).toBeDefined()
      expect(callBody.filter.$or).toContainEqual({ name: { $regex: 'search term', $options: 'i' } })
    })

    it('should return pageInfo when available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [{ _id: '1' }],
            total: 100,
            pageInfo: { hasNextPage: true, hasPreviousPage: false },
          }),
      })

      const result = await dataProvider.getList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: '_id', order: 'DESC' },
        filter: {},
      })

      expect(result.pageInfo).toEqual({ hasNextPage: true, hasPreviousPage: false })
    })
  })

  describe('getOne', () => {
    it('should fetch a single record by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { _id: '123', name: 'Test User' } }),
      })

      const result = await dataProvider.getOne('users', { id: '123' })

      expect(result.data).toHaveProperty('id', '123')
      expect(result.data).toHaveProperty('name', 'Test User')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.mongo.do/users/123',
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('should handle numeric IDs', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { _id: 123, name: 'Test' } }),
      })

      const result = await dataProvider.getOne('users', { id: 123 })

      expect(mockFetch).toHaveBeenCalledWith('https://test.mongo.do/users/123', expect.any(Object))
      expect(result.data.id).toBe(123)
    })
  })

  describe('getMany', () => {
    it('should fetch multiple records by IDs', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              { _id: '1', name: 'Alice' },
              { _id: '2', name: 'Bob' },
            ],
          }),
      })

      const result = await dataProvider.getMany('users', { ids: ['1', '2'] })

      expect(result.data).toHaveLength(2)
      expect(result.data[0]).toHaveProperty('id', '1')
      expect(result.data[1]).toHaveProperty('id', '2')

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.action).toBe('find')
      expect(callBody.filter._id.$in).toEqual(['1', '2'])
    })
  })

  describe('getManyReference', () => {
    it('should fetch records by foreign key reference', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              { _id: '1', post_id: '10', text: 'Comment 1' },
              { _id: '2', post_id: '10', text: 'Comment 2' },
            ],
            total: 2,
          }),
      })

      const result = await dataProvider.getManyReference('comments', {
        target: 'post_id',
        id: '10',
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'createdAt', order: 'DESC' },
        filter: {},
      })

      expect(result.data).toHaveLength(2)
      expect(result.total).toBe(2)

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.filter.post_id).toBe('10')
    })
  })

  describe('create', () => {
    it('should create a new record', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { _id: 'new-id', name: 'New User', email: 'new@example.com' },
            acknowledged: true,
            insertedId: 'new-id',
          }),
      })

      const result = await dataProvider.create('users', {
        data: { name: 'New User', email: 'new@example.com' },
      })

      expect(result.data).toHaveProperty('id', 'new-id')
      expect(result.data).toHaveProperty('name', 'New User')

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.action).toBe('insertOne')
      expect(callBody.document).toEqual({ name: 'New User', email: 'new@example.com' })
    })
  })

  describe('update', () => {
    it('should update an existing record', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { _id: '123', name: 'Updated User' },
            acknowledged: true,
            modifiedCount: 1,
          }),
      })

      const result = await dataProvider.update('users', {
        id: '123',
        data: { name: 'Updated User' },
        previousData: { id: '123', name: 'Old User' },
      })

      expect(result.data).toHaveProperty('name', 'Updated User')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.mongo.do/users/123',
        expect.objectContaining({ method: 'PUT' })
      )

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.$set).toEqual({ name: 'Updated User' })
    })

    it('should remove id and _id from update data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { _id: '123', name: 'Updated' },
            acknowledged: true,
          }),
      })

      await dataProvider.update('users', {
        id: '123',
        data: { id: '123', _id: '123', name: 'Updated' },
      })

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.$set).not.toHaveProperty('id')
      expect(callBody.$set).not.toHaveProperty('_id')
      expect(callBody.$set).toHaveProperty('name', 'Updated')
    })
  })

  describe('updateMany', () => {
    it('should update multiple records', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: ['1', '2', '3'] }),
      })

      const result = await dataProvider.updateMany('users', {
        ids: ['1', '2', '3'],
        data: { status: 'inactive' },
      })

      expect(result.data).toEqual(['1', '2', '3'])

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.action).toBe('updateMany')
      expect(callBody.filter._id.$in).toEqual(['1', '2', '3'])
      expect(callBody.update.$set).toEqual({ status: 'inactive' })
    })
  })

  describe('delete', () => {
    it('should delete a single record', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ acknowledged: true, deletedCount: 1 }),
      })

      const result = await dataProvider.delete('users', {
        id: '123',
        previousData: { id: '123', name: 'To Delete' },
      })

      expect(result.data).toEqual({ id: '123', name: 'To Delete' })
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.mongo.do/users/123',
        expect.objectContaining({ method: 'DELETE' })
      )
    })

    it('should return empty data when previousData is not provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ acknowledged: true }),
      })

      const result = await dataProvider.delete('users', { id: '123' })

      expect(result.data).toBeUndefined()
    })
  })

  describe('deleteMany', () => {
    it('should delete multiple records', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ acknowledged: true, deletedCount: 3 }),
      })

      const result = await dataProvider.deleteMany('users', { ids: ['1', '2', '3'] })

      expect(result.data).toEqual(['1', '2', '3'])

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.action).toBe('deleteMany')
      expect(callBody.filter._id.$in).toEqual(['1', '2', '3'])
    })
  })

  describe('error handling', () => {
    it('should throw an error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: { message: 'Database error' } }),
      })

      await expect(dataProvider.getOne('users', { id: '1' })).rejects.toThrow('Database error')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(dataProvider.getOne('users', { id: '1' })).rejects.toThrow('Network error')
    })
  })

  describe('filter conversion', () => {
    it('should convert all supported filter operators', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0 }),
      })

      await dataProvider.getList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: '_id', order: 'DESC' },
        filter: {
          score_gt: 50,
          score_lt: 100,
          age_gte: 18,
          age_lte: 65,
          status_ne: 'deleted',
          type_eq: 'premium',
          category_in: ['a', 'b'],
          tag_nin: ['spam'],
          email_startswith: 'test',
          domain_endswith: '.com',
          profile_exists: true,
        },
      })

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)

      expect(callBody.filter.score.$gt).toBe(50)
      expect(callBody.filter.score.$lt).toBe(100)
      expect(callBody.filter.age.$gte).toBe(18)
      expect(callBody.filter.age.$lte).toBe(65)
      expect(callBody.filter.status.$ne).toBe('deleted')
      expect(callBody.filter.type.$eq).toBe('premium')
      expect(callBody.filter.category.$in).toEqual(['a', 'b'])
      expect(callBody.filter.tag.$nin).toEqual(['spam'])
      expect(callBody.filter.email.$regex).toBe('^test')
      expect(callBody.filter.domain.$regex).toBe('.com$')
      expect(callBody.filter.profile.$exists).toBe(true)
    })
  })
})
