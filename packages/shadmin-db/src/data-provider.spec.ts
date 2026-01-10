import { describe, it, expect, vi } from 'vitest'
import { createMondoDataProvider } from './data-provider'
import type {
  MongoClient,
  MongoDatabase,
  MongoCollection,
  MongoDocument,
  FindCursor,
  AggregateCursor,
} from './types'

/**
 * Creates a mock MongoClient for testing
 */
function createMockClient(overrides?: {
  find?: MongoDocument[]
  findOne?: MongoDocument | null
  aggregate?: MongoDocument[]
  countDocuments?: number
  insertedId?: string
  matchedCount?: number
  modifiedCount?: number
  deletedCount?: number
}): MongoClient {
  const {
    find = [],
    findOne = null,
    aggregate = [],
    countDocuments = 0,
    insertedId = 'new-id',
    matchedCount = 1,
    modifiedCount = 1,
    deletedCount = 1,
  } = overrides ?? {}

  const mockFindCursor: FindCursor<MongoDocument> = {
    sort: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    toArray: vi.fn().mockResolvedValue(find),
  }

  const mockAggregateCursor: AggregateCursor<MongoDocument> = {
    toArray: vi.fn().mockResolvedValue(aggregate),
  }

  const mockCollection: MongoCollection = {
    find: vi.fn().mockReturnValue(mockFindCursor),
    findOne: vi.fn().mockResolvedValue(findOne),
    insertOne: vi.fn().mockResolvedValue({ insertedId, acknowledged: true }),
    updateOne: vi.fn().mockResolvedValue({ matchedCount, modifiedCount, acknowledged: true }),
    updateMany: vi.fn().mockResolvedValue({ matchedCount, modifiedCount, acknowledged: true }),
    deleteOne: vi.fn().mockResolvedValue({ deletedCount, acknowledged: true }),
    deleteMany: vi.fn().mockResolvedValue({ deletedCount, acknowledged: true }),
    countDocuments: vi.fn().mockResolvedValue(countDocuments),
    aggregate: vi.fn().mockReturnValue(mockAggregateCursor),
  }

  const mockDb: MongoDatabase = {
    collection: vi.fn().mockReturnValue(mockCollection),
  }

  return {
    db: vi.fn().mockReturnValue(mockDb),
  }
}

/**
 * Helper to get the mock collection from a client
 */
function getMockCollection(client: MongoClient): MongoCollection {
  return client.db('test').collection('posts')
}

describe('createMondoDataProvider', () => {
  describe('getList', () => {
    it('fetches list with pagination', async () => {
      const mockDocs = [
        { _id: '1', title: 'Post 1' },
        { _id: '2', title: 'Post 2' },
      ]
      const client = createMockClient({
        aggregate: [{ data: mockDocs, total: [{ count: 10 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(result.data).toHaveLength(2)
      expect(result.data[0]).toEqual({ id: '1', title: 'Post 1' })
      expect(result.data[1]).toEqual({ id: '2', title: 'Post 2' })
      expect(result.total).toBe(10)

      // Verify the client was called correctly
      expect(client.db).toHaveBeenCalledWith('test')
      const mockDb = client.db('test')
      expect(mockDb.collection).toHaveBeenCalledWith('posts')
    })

    it('applies sort', async () => {
      const mockDocs = [
        { _id: '2', title: 'B Post' },
        { _id: '1', title: 'A Post' },
      ]
      const client = createMockClient({
        aggregate: [{ data: mockDocs, total: [{ count: 2 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'title', order: 'DESC' },
        filter: {},
      })

      const collection = getMockCollection(client)
      expect(collection.aggregate).toHaveBeenCalled()
      const aggregatePipeline = (collection.aggregate as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]
      expect(aggregatePipeline).toBeDefined()

      // Find the $sort stage
      const sortStage = aggregatePipeline.find((stage: Record<string, unknown>) => '$sort' in stage)
      expect(sortStage).toBeDefined()
      expect(sortStage.$sort).toEqual({ title: -1 })
    })

    it('applies filters', async () => {
      const mockDocs = [{ _id: '1', title: 'Hello', status: 'published' }]
      const client = createMockClient({
        aggregate: [{ data: mockDocs, total: [{ count: 1 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { status: 'published' },
      })

      const collection = getMockCollection(client)
      const aggregatePipeline = (collection.aggregate as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]

      // Find the $match stage
      const matchStage = aggregatePipeline.find((stage: Record<string, unknown>) => '$match' in stage)
      expect(matchStage).toBeDefined()
      expect(matchStage.$match).toEqual({ status: 'published' })
    })

    it('applies text search when filter has q key', async () => {
      const mockDocs = [{ _id: '1', title: 'Hello World' }]
      const client = createMockClient({
        aggregate: [{ data: mockDocs, total: [{ count: 1 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { q: 'hello' },
      })

      const collection = getMockCollection(client)
      const aggregatePipeline = (collection.aggregate as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]

      const matchStage = aggregatePipeline.find((stage: Record<string, unknown>) => '$match' in stage)
      expect(matchStage).toBeDefined()
      expect(matchStage.$match.$text).toEqual({ $search: 'hello' })
    })

    it('returns total count', async () => {
      const client = createMockClient({
        aggregate: [{ data: [], total: [{ count: 42 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(result.total).toBe(42)
    })

    it('handles second page pagination correctly', async () => {
      const mockDocs = [
        { _id: '11', title: 'Post 11' },
        { _id: '12', title: 'Post 12' },
      ]
      const client = createMockClient({
        aggregate: [{ data: mockDocs, total: [{ count: 25 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await dataProvider.getList('posts', {
        pagination: { page: 2, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      const collection = getMockCollection(client)
      const aggregatePipeline = (collection.aggregate as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]

      // Find the $facet stage - $skip and $limit are nested inside $facet.data
      const facetStage = aggregatePipeline.find((stage: Record<string, unknown>) => '$facet' in stage)
      expect(facetStage).toBeDefined()
      const dataSubPipeline = facetStage.$facet.data as Record<string, unknown>[]
      const skipStage = dataSubPipeline.find((stage: Record<string, unknown>) => '$skip' in stage)
      expect(skipStage).toBeDefined()
      expect(skipStage?.$skip).toBe(10) // (page 2 - 1) * perPage 10 = 10
    })

    it('sorts by _id when sorting by id', async () => {
      const client = createMockClient({
        aggregate: [{ data: [], total: [{ count: 0 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'DESC' },
        filter: {},
      })

      const collection = getMockCollection(client)
      const aggregatePipeline = (collection.aggregate as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]

      const sortStage = aggregatePipeline.find((stage: Record<string, unknown>) => '$sort' in stage)
      expect(sortStage.$sort).toEqual({ _id: -1 })
    })
  })

  describe('getOne', () => {
    it('fetches record by id', async () => {
      const mockDoc = { _id: '123', title: 'My Post', content: 'Hello world' }
      const client = createMockClient({ findOne: mockDoc })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.getOne('posts', { id: '123' })

      expect(result.data).toEqual({ id: '123', title: 'My Post', content: 'Hello world' })

      const collection = getMockCollection(client)
      expect(collection.findOne).toHaveBeenCalledWith({ _id: '123' })
    })

    it('throws on not found', async () => {
      const client = createMockClient({ findOne: null })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await expect(dataProvider.getOne('posts', { id: 'nonexistent' })).rejects.toThrow(
        'Record not found: posts/nonexistent'
      )
    })

    it('handles ObjectId format', async () => {
      const mockDoc = { _id: { $oid: '507f1f77bcf86cd799439011' }, title: 'My Post' }
      const client = createMockClient({ findOne: mockDoc })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.getOne('posts', { id: '507f1f77bcf86cd799439011' })

      expect(result.data.id).toBe('507f1f77bcf86cd799439011')
    })
  })

  describe('getMany', () => {
    it('fetches multiple records by ids', async () => {
      const mockDocs = [
        { _id: '1', title: 'Post 1' },
        { _id: '2', title: 'Post 2' },
        { _id: '3', title: 'Post 3' },
      ]
      const client = createMockClient({ find: mockDocs })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.getMany('posts', { ids: ['1', '2', '3'] })

      expect(result.data).toHaveLength(3)
      expect(result.data[0]).toEqual({ id: '1', title: 'Post 1' })
      expect(result.data[1]).toEqual({ id: '2', title: 'Post 2' })
      expect(result.data[2]).toEqual({ id: '3', title: 'Post 3' })

      const collection = getMockCollection(client)
      expect(collection.find).toHaveBeenCalledWith({ _id: { $in: ['1', '2', '3'] } })
    })

    it('returns empty array for empty ids', async () => {
      const client = createMockClient({ find: [] })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.getMany('posts', { ids: [] })

      expect(result.data).toEqual([])
    })
  })

  describe('getManyReference', () => {
    it('fetches related records', async () => {
      const mockDocs = [
        { _id: 'c1', postId: 'p1', body: 'Comment 1' },
        { _id: 'c2', postId: 'p1', body: 'Comment 2' },
      ]
      const client = createMockClient({
        aggregate: [{ data: mockDocs, total: [{ count: 2 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.getManyReference('comments', {
        target: 'postId',
        id: 'p1',
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(result.data).toHaveLength(2)
      expect(result.data[0]).toEqual({ id: 'c1', postId: 'p1', body: 'Comment 1' })
      expect(result.total).toBe(2)

      const collection = client.db('test').collection('comments')
      const aggregatePipeline = (collection.aggregate as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]

      const matchStage = aggregatePipeline.find((stage: Record<string, unknown>) => '$match' in stage)
      expect(matchStage.$match).toEqual({ postId: 'p1' })
    })

    it('combines target filter with additional filters', async () => {
      const mockDocs = [{ _id: 'c1', postId: 'p1', body: 'Comment 1', approved: true }]
      const client = createMockClient({
        aggregate: [{ data: mockDocs, total: [{ count: 1 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await dataProvider.getManyReference('comments', {
        target: 'postId',
        id: 'p1',
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { approved: true },
      })

      const collection = client.db('test').collection('comments')
      const aggregatePipeline = (collection.aggregate as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]

      const matchStage = aggregatePipeline.find((stage: Record<string, unknown>) => '$match' in stage)
      expect(matchStage.$match).toEqual({ postId: 'p1', approved: true })
    })
  })

  describe('create', () => {
    it('creates new record', async () => {
      const client = createMockClient({ insertedId: 'new-123' })

      // Mock findOne to return the created document
      const collection = getMockCollection(client)
      ;(collection.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        _id: 'new-123',
        title: 'New Post',
        content: 'Hello',
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.create('posts', {
        data: { title: 'New Post', content: 'Hello' },
      })

      expect(collection.insertOne).toHaveBeenCalledWith({ title: 'New Post', content: 'Hello' })
      expect(result.data).toEqual({ id: 'new-123', title: 'New Post', content: 'Hello' })
    })

    it('returns created record with id', async () => {
      const client = createMockClient({ insertedId: 'abc-123' })

      const collection = getMockCollection(client)
      ;(collection.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        _id: 'abc-123',
        name: 'John',
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.create('users', {
        data: { name: 'John' },
      })

      expect(result.data.id).toBe('abc-123')
      expect(result.data.name).toBe('John')
    })

    it('strips id from input data', async () => {
      const client = createMockClient({ insertedId: 'server-generated-id' })

      const collection = getMockCollection(client)
      ;(collection.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        _id: 'server-generated-id',
        title: 'Test',
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await dataProvider.create('posts', {
        data: { id: 'client-id', title: 'Test' } as Record<string, unknown>,
      })

      // Should not include id in the insert
      expect(collection.insertOne).toHaveBeenCalledWith({ title: 'Test' })
    })
  })

  describe('update', () => {
    it('updates existing record', async () => {
      const client = createMockClient({ matchedCount: 1, modifiedCount: 1 })

      const collection = getMockCollection(client)
      ;(collection.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        _id: '123',
        title: 'Updated Title',
        content: 'Updated content',
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.update('posts', {
        id: '123',
        data: { title: 'Updated Title', content: 'Updated content' },
        previousData: { id: '123', title: 'Old Title', content: 'Old content' },
      })

      expect(collection.updateOne).toHaveBeenCalledWith(
        { _id: '123' },
        { $set: { title: 'Updated Title', content: 'Updated content' } }
      )
      expect(result.data).toEqual({ id: '123', title: 'Updated Title', content: 'Updated content' })
    })

    it('throws if record not found', async () => {
      const client = createMockClient({ matchedCount: 0, modifiedCount: 0 })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await expect(
        dataProvider.update('posts', {
          id: 'nonexistent',
          data: { title: 'Test' },
          previousData: { id: 'nonexistent', title: 'Old' },
        })
      ).rejects.toThrow('Record not found: posts/nonexistent')
    })
  })

  describe('updateMany', () => {
    it('updates multiple records', async () => {
      const client = createMockClient({ matchedCount: 3, modifiedCount: 3 })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.updateMany('posts', {
        ids: ['1', '2', '3'],
        data: { status: 'archived' },
      })

      const collection = getMockCollection(client)
      expect(collection.updateMany).toHaveBeenCalledWith(
        { _id: { $in: ['1', '2', '3'] } },
        { $set: { status: 'archived' } }
      )
      expect(result.data).toEqual(['1', '2', '3'])
    })

    it('returns empty array for empty ids', async () => {
      const client = createMockClient()

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.updateMany('posts', {
        ids: [],
        data: { status: 'archived' },
      })

      expect(result.data).toEqual([])
    })
  })

  describe('delete', () => {
    it('deletes record by id', async () => {
      const client = createMockClient({ deletedCount: 1 })

      const collection = getMockCollection(client)
      // Mock findOne to return the document before deletion
      ;(collection.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        _id: '123',
        title: 'To Delete',
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.delete('posts', {
        id: '123',
        previousData: { id: '123', title: 'To Delete' },
      })

      expect(collection.deleteOne).toHaveBeenCalledWith({ _id: '123' })
      expect(result.data).toEqual({ id: '123', title: 'To Delete' })
    })

    it('returns previousData when provided', async () => {
      const client = createMockClient({ deletedCount: 1 })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.delete('posts', {
        id: '456',
        previousData: { id: '456', title: 'Known Title', extra: 'data' },
      })

      expect(result.data).toEqual({ id: '456', title: 'Known Title', extra: 'data' })
    })

    it('fetches record when previousData not provided', async () => {
      const client = createMockClient({ deletedCount: 1 })

      const collection = getMockCollection(client)
      ;(collection.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        _id: '789',
        title: 'Fetched Title',
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.delete('posts', { id: '789' })

      expect(collection.findOne).toHaveBeenCalledWith({ _id: '789' })
      expect(result.data).toEqual({ id: '789', title: 'Fetched Title' })
    })
  })

  describe('deleteMany', () => {
    it('deletes multiple records', async () => {
      const client = createMockClient({ deletedCount: 3 })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.deleteMany('posts', {
        ids: ['1', '2', '3'],
      })

      const collection = getMockCollection(client)
      expect(collection.deleteMany).toHaveBeenCalledWith({ _id: { $in: ['1', '2', '3'] } })
      expect(result.data).toEqual(['1', '2', '3'])
    })

    it('returns empty array for empty ids', async () => {
      const client = createMockClient()

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.deleteMany('posts', { ids: [] })

      expect(result.data).toEqual([])
    })
  })

  describe('id normalization', () => {
    it('normalizes _id to id in output', async () => {
      const client = createMockClient({
        findOne: { _id: 'test-id', name: 'Test' },
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.getOne('items', { id: 'test-id' })

      expect(result.data).toEqual({ id: 'test-id', name: 'Test' })
      expect(result.data).not.toHaveProperty('_id')
    })

    it('handles ObjectId $oid format', async () => {
      const client = createMockClient({
        findOne: { _id: { $oid: '507f1f77bcf86cd799439011' }, name: 'Test' },
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      const result = await dataProvider.getOne('items', { id: '507f1f77bcf86cd799439011' })

      expect(result.data.id).toBe('507f1f77bcf86cd799439011')
    })
  })

  describe('filter operators', () => {
    it('passes through MongoDB operators', async () => {
      const client = createMockClient({
        aggregate: [{ data: [], total: [{ count: 0 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { views: { $gte: 100 } },
      })

      const collection = getMockCollection(client)
      const aggregatePipeline = (collection.aggregate as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]

      const matchStage = aggregatePipeline.find((stage: Record<string, unknown>) => '$match' in stage)
      expect(matchStage.$match).toEqual({ views: { $gte: 100 } })
    })

    it('combines text search with other filters', async () => {
      const client = createMockClient({
        aggregate: [{ data: [], total: [{ count: 0 }] }],
      })

      const dataProvider = createMondoDataProvider({ client, database: 'test' })

      await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { q: 'hello', status: 'published' },
      })

      const collection = getMockCollection(client)
      const aggregatePipeline = (collection.aggregate as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]

      const matchStage = aggregatePipeline.find((stage: Record<string, unknown>) => '$match' in stage)
      expect(matchStage.$match).toEqual({
        $text: { $search: 'hello' },
        status: 'published',
      })
    })
  })
})
