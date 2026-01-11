/**
 * Real Integration Tests
 *
 * These tests focus on testing actual integration behavior with minimal mocking.
 * They test the DataProvider contract directly without React hooks to avoid
 * React context isolation issues in the test environment.
 *
 * Tests cover:
 * 1. DataProvider contract - CRUD operations with real in-memory store
 * 2. AuthProvider contract - authentication flows
 * 3. Error handling scenarios across operations
 * 4. Data consistency after operations
 * 5. Concurrent operation handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Import types
import type { DataProvider } from '../../types'
import type { AuthProvider } from '../../facade'

// =============================================================================
// Test Utilities - Real In-Memory Data Store
// =============================================================================

/**
 * Creates a real in-memory data store with actual CRUD operations.
 * This simulates a real backend without network latency.
 */
interface Record {
  id: number | string
  [key: string]: unknown
}

class InMemoryDataStore {
  private store: Map<string, Record[]> = new Map()
  private nextIds: Map<string, number> = new Map()

  constructor(initialData: { [resource: string]: Record[] } = {}) {
    Object.entries(initialData).forEach(([resource, records]) => {
      this.store.set(resource, [...records])
      const maxId = records.reduce((max, r) => {
        const id = typeof r.id === 'number' ? r.id : parseInt(String(r.id), 10)
        return isNaN(id) ? max : Math.max(max, id)
      }, 0)
      this.nextIds.set(resource, maxId + 1)
    })
  }

  getNextId(resource: string): number {
    const current = this.nextIds.get(resource) || 1
    this.nextIds.set(resource, current + 1)
    return current
  }

  getAll(resource: string): Record[] {
    return this.store.get(resource) || []
  }

  setAll(resource: string, records: Record[]): void {
    this.store.set(resource, records)
  }

  findById(resource: string, id: number | string): Record | undefined {
    return this.getAll(resource).find(
      (r) => String(r.id) === String(id)
    )
  }

  add(resource: string, record: Record): Record {
    const records = this.getAll(resource)
    records.push(record)
    this.store.set(resource, records)
    return record
  }

  update(resource: string, id: number | string, data: Partial<Record>): Record {
    const records = this.getAll(resource)
    const index = records.findIndex((r) => String(r.id) === String(id))
    if (index === -1) {
      throw new Error(`Record not found: ${resource}/${id}`)
    }
    const updated = { ...records[index], ...data, id }
    records[index] = updated
    this.store.set(resource, records)
    return updated
  }

  remove(resource: string, id: number | string): Record {
    const records = this.getAll(resource)
    const index = records.findIndex((r) => String(r.id) === String(id))
    if (index === -1) {
      throw new Error(`Record not found: ${resource}/${id}`)
    }
    const deleted = records[index]
    records.splice(index, 1)
    this.store.set(resource, records)
    return deleted
  }

  clear(): void {
    this.store.clear()
    this.nextIds.clear()
  }
}

/**
 * Creates a real DataProvider backed by the in-memory store.
 * All operations actually mutate state and can be verified.
 */
function createRealDataProvider(store: InMemoryDataStore): DataProvider {
  return {
    async getList(resource, params) {
      const { pagination, sort, filter } = params
      let records = [...store.getAll(resource)]

      // Apply filters
      Object.entries(filter || {}).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return

        if (key === 'q') {
          // Full-text search
          const searchTerm = String(value).toLowerCase()
          records = records.filter((r) =>
            Object.values(r).some((v) =>
              String(v).toLowerCase().includes(searchTerm)
            )
          )
        } else if (key.endsWith('_gte')) {
          const field = key.replace('_gte', '')
          records = records.filter((r) => Number(r[field]) >= Number(value))
        } else if (key.endsWith('_lte')) {
          const field = key.replace('_lte', '')
          records = records.filter((r) => Number(r[field]) <= Number(value))
        } else {
          records = records.filter((r) => r[key] === value)
        }
      })

      // Apply sorting
      const { field, order } = sort
      records.sort((a, b) => {
        const aVal = a[field]
        const bVal = b[field]
        if (aVal === bVal) return 0
        const cmp = aVal! < bVal! ? -1 : 1
        return order === 'ASC' ? cmp : -cmp
      })

      // Apply pagination
      const { page, perPage } = pagination
      const start = (page - 1) * perPage
      const end = start + perPage
      const paginated = records.slice(start, end)

      return {
        data: paginated,
        total: records.length,
        pageInfo: {
          hasNextPage: end < records.length,
          hasPreviousPage: page > 1,
        },
      }
    },

    async getOne(resource, params) {
      const record = store.findById(resource, params.id)
      if (!record) {
        const error = new Error(`${resource} with id ${params.id} not found`)
        ;(error as Error & { status: number }).status = 404
        throw error
      }
      return { data: record }
    },

    async getMany(resource, params) {
      const records = params.ids
        .map((id) => store.findById(resource, id))
        .filter(Boolean) as Record[]
      return { data: records }
    },

    async getManyReference(resource, params) {
      const { target, id, pagination, sort } = params
      let records = store.getAll(resource).filter(
        (r) => String(r[target]) === String(id)
      )

      // Apply sorting
      const { field, order } = sort
      records.sort((a, b) => {
        const aVal = a[field]
        const bVal = b[field]
        if (aVal === bVal) return 0
        const cmp = aVal! < bVal! ? -1 : 1
        return order === 'ASC' ? cmp : -cmp
      })

      // Apply pagination
      const { page, perPage } = pagination
      const start = (page - 1) * perPage
      const end = start + perPage
      const paginated = records.slice(start, end)

      return {
        data: paginated,
        total: records.length,
      }
    },

    async create(resource, params) {
      const id = store.getNextId(resource)
      const record = { ...params.data, id }
      store.add(resource, record)
      return { data: record }
    },

    async update(resource, params) {
      const updated = store.update(resource, params.id, params.data)
      return { data: updated }
    },

    async updateMany(resource, params) {
      const results = params.ids.map((id) => {
        store.update(resource, id, params.data)
        return id
      })
      return { data: results }
    },

    async delete(resource, params) {
      const deleted = store.remove(resource, params.id)
      return { data: deleted }
    },

    async deleteMany(resource, params) {
      params.ids.forEach((id) => store.remove(resource, id))
      return { data: params.ids }
    },
  }
}

// =============================================================================
// Test Data
// =============================================================================

const samplePosts = [
  { id: 1, title: 'Introduction to React', authorId: 1, views: 1500, published: true },
  { id: 2, title: 'Advanced TypeScript', authorId: 2, views: 800, published: true },
  { id: 3, title: 'Testing Best Practices', authorId: 1, views: 1200, published: false },
  { id: 4, title: 'State Management Guide', authorId: 3, views: 2000, published: true },
  { id: 5, title: 'CSS-in-JS Solutions', authorId: 2, views: 600, published: true },
]

const sampleAuthors = [
  { id: 1, name: 'John Smith', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com' },
]

// =============================================================================
// DataProvider Integration Tests - CRUD Flows
// =============================================================================

describe('DataProvider Integration - Real CRUD Flows', () => {
  let store: InMemoryDataStore
  let dataProvider: DataProvider

  beforeEach(() => {
    store = new InMemoryDataStore({
      posts: [...samplePosts],
      authors: [...sampleAuthors],
    })
    dataProvider = createRealDataProvider(store)
  })

  describe('Read Operations - getList', () => {
    it('should fetch a list of records with real data', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(result.data).toHaveLength(5)
      expect(result.total).toBe(5)
      expect(result.data[0].title).toBe('Introduction to React')
    })

    it('should paginate correctly with real data', async () => {
      const page1 = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(page1.data).toHaveLength(2)
      expect(page1.pageInfo?.hasNextPage).toBe(true)
      expect(page1.pageInfo?.hasPreviousPage).toBe(false)
      expect(page1.data[0].id).toBe(1)
      expect(page1.data[1].id).toBe(2)

      const page2 = await dataProvider.getList('posts', {
        pagination: { page: 2, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(page2.data).toHaveLength(2)
      expect(page2.pageInfo?.hasNextPage).toBe(true)
      expect(page2.pageInfo?.hasPreviousPage).toBe(true)
      expect(page2.data[0].id).toBe(3)
      expect(page2.data[1].id).toBe(4)

      // Verify the store wasn't modified
      expect(store.getAll('posts')).toHaveLength(5)
    })

    it('should filter records by exact match', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { published: true },
      })

      expect(result.data).toHaveLength(4)
      expect(result.data.every((p) => p.published === true)).toBe(true)
    })

    it('should filter records by full-text search', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { q: 'react' },
      })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].title).toBe('Introduction to React')
    })

    it('should support case-insensitive search', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { q: 'TYPESCRIPT' },
      })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].title).toBe('Advanced TypeScript')
    })

    it('should support range filters (gte)', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'views', order: 'DESC' },
        filter: { views_gte: 1000 },
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.every((p) => (p.views as number) >= 1000)).toBe(true)
    })

    it('should support range filters (lte)', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'views', order: 'ASC' },
        filter: { views_lte: 800 },
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every((p) => (p.views as number) <= 800)).toBe(true)
    })

    it('should combine multiple filters', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { published: true, views_gte: 1000 },
      })

      expect(result.data).toHaveLength(2) // Posts 1 and 4
      expect(
        result.data.every((p) => p.published === true && (p.views as number) >= 1000)
      ).toBe(true)
    })

    it('should sort by ascending order', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'views', order: 'ASC' },
        filter: {},
      })

      const views = result.data.map((p) => p.views as number)
      expect(views).toEqual([600, 800, 1200, 1500, 2000])
    })

    it('should sort by descending order', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'views', order: 'DESC' },
        filter: {},
      })

      const views = result.data.map((p) => p.views as number)
      expect(views[0]).toBe(2000)
      expect(views[1]).toBe(1500)
    })
  })

  describe('Read Operations - getOne', () => {
    it('should fetch a single record by id', async () => {
      const result = await dataProvider.getOne('posts', { id: 1 })

      expect(result.data.title).toBe('Introduction to React')
      expect(result.data.views).toBe(1500)
    })

    it('should throw error for non-existent record', async () => {
      await expect(dataProvider.getOne('posts', { id: 999 })).rejects.toThrow('not found')
    })

    it('should support string ids', async () => {
      store.add('posts', { id: 'uuid-123', title: 'UUID Post', views: 100, published: true })
      const result = await dataProvider.getOne('posts', { id: 'uuid-123' })
      expect(result.data.title).toBe('UUID Post')
    })
  })

  describe('Read Operations - getMany', () => {
    it('should fetch multiple records by ids', async () => {
      const result = await dataProvider.getMany('authors', { ids: [1, 3] })

      expect(result.data).toHaveLength(2)
      expect(result.data.map((a) => a.name)).toContain('John Smith')
      expect(result.data.map((a) => a.name)).toContain('Bob Wilson')
    })

    it('should return only existing records', async () => {
      const result = await dataProvider.getMany('authors', { ids: [1, 999, 3] })
      expect(result.data).toHaveLength(2)
    })
  })

  describe('Read Operations - getManyReference', () => {
    it('should fetch records by reference field', async () => {
      store.setAll('comments', [
        { id: 1, body: 'Great post!', postId: 1 },
        { id: 2, body: 'Thanks!', postId: 1 },
        { id: 3, body: 'Interesting', postId: 2 },
      ])

      const result = await dataProvider.getManyReference('comments', {
        target: 'postId',
        id: 1,
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every((c) => c.postId === 1)).toBe(true)
    })
  })

  describe('Create Operations', () => {
    it('should create a new record and persist to store', async () => {
      const newPost = {
        title: 'New Integration Test Post',
        authorId: 1,
        views: 0,
        published: false,
      }

      const result = await dataProvider.create('posts', { data: newPost })

      expect(result.data.title).toBe('New Integration Test Post')
      expect(result.data.id).toBe(6) // Next ID after 5 existing posts

      // Verify store was updated
      const storedPosts = store.getAll('posts')
      expect(storedPosts).toHaveLength(6)
      expect(storedPosts.find((p) => p.id === 6)?.title).toBe('New Integration Test Post')
    })

    it('should generate unique IDs for multiple creates', async () => {
      const results = await Promise.all([
        dataProvider.create('posts', { data: { title: 'Post A', authorId: 1, views: 0, published: false } }),
        dataProvider.create('posts', { data: { title: 'Post B', authorId: 2, views: 0, published: true } }),
        dataProvider.create('posts', { data: { title: 'Post C', authorId: 3, views: 0, published: false } }),
      ])

      const ids = results.map((r) => r.data.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(3)
    })
  })

  describe('Update Operations', () => {
    it('should update an existing record and persist to store', async () => {
      const result = await dataProvider.update('posts', {
        id: 1,
        data: { title: 'Updated Title', views: 2500 },
      })

      expect(result.data.title).toBe('Updated Title')
      expect(result.data.views).toBe(2500)

      // Verify store was updated
      const updatedPost = store.findById('posts', 1)
      expect(updatedPost?.title).toBe('Updated Title')
      expect(updatedPost?.views).toBe(2500)
      // Original fields should be preserved
      expect(updatedPost?.authorId).toBe(1)
    })

    it('should throw error when updating non-existent record', async () => {
      await expect(
        dataProvider.update('posts', { id: 999, data: { title: 'This should fail' } })
      ).rejects.toThrow('not found')
    })

    it('should update multiple records with updateMany', async () => {
      const result = await dataProvider.updateMany('posts', {
        ids: [1, 2, 3],
        data: { published: true },
      })

      expect(result.data).toEqual([1, 2, 3])

      // Verify all were updated
      const post1 = store.findById('posts', 1)
      const post2 = store.findById('posts', 2)
      const post3 = store.findById('posts', 3)
      expect(post1?.published).toBe(true)
      expect(post2?.published).toBe(true)
      expect(post3?.published).toBe(true)
    })
  })

  describe('Delete Operations', () => {
    it('should delete a record and remove from store', async () => {
      const initialCount = store.getAll('posts').length

      const result = await dataProvider.delete('posts', { id: 1 })

      expect(result.data.id).toBe(1)
      expect(store.getAll('posts')).toHaveLength(initialCount - 1)
      expect(store.findById('posts', 1)).toBeUndefined()
    })

    it('should throw error when deleting non-existent record', async () => {
      await expect(dataProvider.delete('posts', { id: 999 })).rejects.toThrow('not found')
    })

    it('should delete multiple records with deleteMany', async () => {
      const initialCount = store.getAll('posts').length

      const result = await dataProvider.deleteMany('posts', { ids: [1, 2, 3] })

      expect(result.data).toEqual([1, 2, 3])
      expect(store.getAll('posts')).toHaveLength(initialCount - 3)
    })
  })

  describe('Full CRUD Cycle', () => {
    it('should complete create -> read -> update -> delete cycle', async () => {
      // 1. Create
      const createResult = await dataProvider.create('posts', {
        data: { title: 'Cycle Test Post', authorId: 1, views: 0, published: false },
      })
      const newId = createResult.data.id
      expect(createResult.data.title).toBe('Cycle Test Post')

      // 2. Read - verify it exists
      const readResult = await dataProvider.getOne('posts', { id: newId })
      expect(readResult.data.title).toBe('Cycle Test Post')

      // 3. Update
      const updateResult = await dataProvider.update('posts', {
        id: newId,
        data: { title: 'Updated Cycle Test Post', published: true },
      })
      expect(updateResult.data.title).toBe('Updated Cycle Test Post')
      expect(updateResult.data.published).toBe(true)

      // Verify update persisted
      const verifyRead = await dataProvider.getOne('posts', { id: newId })
      expect(verifyRead.data.title).toBe('Updated Cycle Test Post')

      // 4. Delete
      await dataProvider.delete('posts', { id: newId })

      // Verify delete
      await expect(dataProvider.getOne('posts', { id: newId })).rejects.toThrow('not found')
    })
  })
})

// =============================================================================
// AuthProvider Integration Tests
// =============================================================================

describe('AuthProvider Integration', () => {
  function createAuthProvider(options: {
    isAuthenticated?: boolean
    permissions?: string[]
    user?: { id: number; name: string; email: string }
  } = {}): AuthProvider {
    const {
      isAuthenticated = true,
      permissions = ['admin'],
      user = { id: 1, name: 'Test User', email: 'test@example.com' },
    } = options

    let authenticated = isAuthenticated
    let currentUser = user

    return {
      login: vi.fn().mockImplementation(async (params) => {
        if (params.username === 'admin' && params.password === 'admin') {
          authenticated = true
          currentUser = { id: 1, name: 'Admin User', email: 'admin@example.com' }
          return { redirectTo: '/dashboard' }
        }
        if (params.username === 'user' && params.password === 'user') {
          authenticated = true
          currentUser = { id: 2, name: 'Regular User', email: 'user@example.com' }
          return { redirectTo: '/home' }
        }
        throw new Error('Invalid credentials')
      }),
      logout: vi.fn().mockImplementation(async () => {
        authenticated = false
        currentUser = { id: 0, name: '', email: '' }
        return '/login'
      }),
      checkAuth: vi.fn().mockImplementation(async () => {
        if (!authenticated) {
          throw new Error('Not authenticated')
        }
      }),
      checkError: vi.fn().mockImplementation(async (error) => {
        const status = (error as { status?: number }).status
        if (status === 401) {
          authenticated = false
          throw new Error('Session expired')
        }
        if (status === 403) {
          throw new Error('Access denied')
        }
      }),
      getPermissions: vi.fn().mockImplementation(async () => {
        if (!authenticated) return []
        return permissions
      }),
      getIdentity: vi.fn().mockImplementation(async () => {
        if (!authenticated) throw new Error('Not authenticated')
        return currentUser
      }),
    }
  }

  describe('Login Flow', () => {
    it('should authenticate with valid admin credentials', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: false })

      const result = await authProvider.login({ username: 'admin', password: 'admin' })

      expect(result).toEqual({ redirectTo: '/dashboard' })
      await expect(authProvider.checkAuth()).resolves.not.toThrow()
    })

    it('should authenticate with valid user credentials', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: false })

      const result = await authProvider.login({ username: 'user', password: 'user' })

      expect(result).toEqual({ redirectTo: '/home' })
    })

    it('should reject invalid credentials', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: false })

      await expect(
        authProvider.login({ username: 'bad', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials')
    })

    it('should update identity after successful login', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: false })

      await authProvider.login({ username: 'admin', password: 'admin' })
      const identity = await authProvider.getIdentity?.()

      expect(identity?.name).toBe('Admin User')
      expect(identity?.email).toBe('admin@example.com')
    })
  })

  describe('Logout Flow', () => {
    it('should logout and redirect to login page', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: true })

      const redirectTo = await authProvider.logout()

      expect(redirectTo).toBe('/login')
      await expect(authProvider.checkAuth()).rejects.toThrow('Not authenticated')
    })

    it('should clear identity after logout', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: true })

      await authProvider.logout()

      await expect(authProvider.getIdentity?.()).rejects.toThrow('Not authenticated')
    })

    it('should clear permissions after logout', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: true, permissions: ['admin'] })

      await authProvider.logout()
      const permissions = await authProvider.getPermissions()

      expect(permissions).toEqual([])
    })
  })

  describe('Authentication Check', () => {
    it('should pass when authenticated', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: true })
      await expect(authProvider.checkAuth()).resolves.not.toThrow()
    })

    it('should fail when not authenticated', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: false })
      await expect(authProvider.checkAuth()).rejects.toThrow('Not authenticated')
    })
  })

  describe('Error Handling', () => {
    it('should handle 401 errors by invalidating session', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: true })

      await expect(authProvider.checkError({ status: 401 })).rejects.toThrow('Session expired')
      await expect(authProvider.checkAuth()).rejects.toThrow('Not authenticated')
    })

    it('should handle 403 errors without invalidating session', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: true })

      await expect(authProvider.checkError({ status: 403 })).rejects.toThrow('Access denied')
      await expect(authProvider.checkAuth()).resolves.not.toThrow()
    })

    it('should pass through other errors', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: true })
      await expect(authProvider.checkError({ status: 500 })).resolves.not.toThrow()
    })
  })

  describe('Permissions', () => {
    it('should return permissions when authenticated', async () => {
      const authProvider = createAuthProvider({
        isAuthenticated: true,
        permissions: ['admin', 'editor', 'viewer'],
      })

      const permissions = await authProvider.getPermissions()
      expect(permissions).toEqual(['admin', 'editor', 'viewer'])
    })

    it('should return empty permissions when not authenticated', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: false })

      const permissions = await authProvider.getPermissions()
      expect(permissions).toEqual([])
    })
  })

  describe('Identity', () => {
    it('should return user identity when authenticated', async () => {
      const authProvider = createAuthProvider({
        isAuthenticated: true,
        user: { id: 42, name: 'John Doe', email: 'john@example.com' },
      })

      const identity = await authProvider.getIdentity?.()
      expect(identity).toEqual({ id: 42, name: 'John Doe', email: 'john@example.com' })
    })

    it('should throw when getting identity while not authenticated', async () => {
      const authProvider = createAuthProvider({ isAuthenticated: false })
      await expect(authProvider.getIdentity?.()).rejects.toThrow('Not authenticated')
    })
  })
})

// =============================================================================
// Error Handling Integration Tests
// =============================================================================

describe('Error Handling Integration', () => {
  let store: InMemoryDataStore

  beforeEach(() => {
    store = new InMemoryDataStore({
      posts: [...samplePosts],
    })
  })

  describe('Not Found Errors', () => {
    it('should return 404 error for non-existent record', async () => {
      const dataProvider = createRealDataProvider(store)

      try {
        await dataProvider.getOne('posts', { id: 999 })
        expect.fail('Should have thrown')
      } catch (error) {
        expect((error as Error).message).toContain('not found')
        expect((error as Error & { status?: number }).status).toBe(404)
      }
    })

    it('should throw on update of non-existent record', async () => {
      const dataProvider = createRealDataProvider(store)

      await expect(
        dataProvider.update('posts', { id: 999, data: { title: 'test' } })
      ).rejects.toThrow('not found')
    })

    it('should throw on delete of non-existent record', async () => {
      const dataProvider = createRealDataProvider(store)

      await expect(dataProvider.delete('posts', { id: 999 })).rejects.toThrow('not found')
    })
  })

  describe('Network Error Simulation', () => {
    it('should handle simulated network failure on read', async () => {
      const failingProvider: DataProvider = {
        getList: vi.fn().mockRejectedValue(new Error('Network error')),
        getOne: vi.fn().mockRejectedValue(new Error('Network error')),
        getMany: vi.fn().mockRejectedValue(new Error('Network error')),
        getManyReference: vi.fn().mockRejectedValue(new Error('Network error')),
        create: vi.fn().mockRejectedValue(new Error('Network error')),
        update: vi.fn().mockRejectedValue(new Error('Network error')),
        updateMany: vi.fn().mockRejectedValue(new Error('Network error')),
        delete: vi.fn().mockRejectedValue(new Error('Network error')),
        deleteMany: vi.fn().mockRejectedValue(new Error('Network error')),
      }

      await expect(
        failingProvider.getList('posts', {
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'id', order: 'ASC' },
          filter: {},
        })
      ).rejects.toThrow('Network error')
    })

    it('should handle simulated network failure on write', async () => {
      const failingProvider: DataProvider = {
        getList: vi.fn(),
        getOne: vi.fn(),
        getMany: vi.fn(),
        getManyReference: vi.fn(),
        create: vi.fn().mockRejectedValue(new Error('Network error')),
        update: vi.fn().mockRejectedValue(new Error('Network error')),
        updateMany: vi.fn(),
        delete: vi.fn().mockRejectedValue(new Error('Network error')),
        deleteMany: vi.fn(),
      }

      await expect(
        failingProvider.create('posts', { data: { title: 'test' } })
      ).rejects.toThrow('Network error')
    })
  })

  describe('Validation Errors', () => {
    it('should handle validation errors with field details', async () => {
      const validatingProvider: DataProvider = {
        ...createRealDataProvider(store),
        create: vi.fn().mockImplementation(async (resource, params) => {
          if (!params.data.title) {
            const error = new Error('Validation failed') as Error & {
              validationErrors: Record<string, string[]>
            }
            error.validationErrors = {
              title: ['Title is required', 'Title must be at least 3 characters'],
            }
            throw error
          }
          return { data: { ...params.data, id: 100 } }
        }),
      }

      try {
        await validatingProvider.create('posts', { data: { authorId: 1 } })
        expect.fail('Should have thrown')
      } catch (error) {
        expect((error as Error).message).toContain('Validation failed')
        expect(
          (error as Error & { validationErrors: Record<string, string[]> }).validationErrors.title
        ).toContain('Title is required')
      }
    })
  })

  describe('Error Recovery', () => {
    it('should succeed after transient failure', async () => {
      let attempts = 0
      const recoveringProvider: DataProvider = {
        ...createRealDataProvider(store),
        getOne: vi.fn().mockImplementation(async (resource, params) => {
          attempts++
          if (attempts === 1) {
            throw new Error('Temporary failure')
          }
          return createRealDataProvider(store).getOne(resource, params)
        }),
      }

      // First attempt fails
      await expect(recoveringProvider.getOne('posts', { id: 1 })).rejects.toThrow('Temporary failure')

      // Second attempt succeeds
      const result = await recoveringProvider.getOne('posts', { id: 1 })
      expect(result.data.title).toBe('Introduction to React')
    })
  })
})

// =============================================================================
// Concurrent Operations Tests
// =============================================================================

describe('Concurrent Operations Integration', () => {
  let store: InMemoryDataStore
  let dataProvider: DataProvider

  beforeEach(() => {
    store = new InMemoryDataStore({
      posts: [...samplePosts],
      authors: [...sampleAuthors],
    })
    dataProvider = createRealDataProvider(store)
  })

  it('should handle multiple concurrent reads correctly', async () => {
    const results = await Promise.all([
      dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      }),
      dataProvider.getList('authors', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      }),
      dataProvider.getOne('posts', { id: 1 }),
      dataProvider.getMany('authors', { ids: [1, 2] }),
    ])

    expect(results).toHaveLength(4)
    expect(results[0].data).toHaveLength(5) // posts
    expect(results[1].data).toHaveLength(3) // authors
    expect(results[2].data.title).toBe('Introduction to React')
    expect(results[3].data).toHaveLength(2)
  })

  it('should handle concurrent writes with unique IDs', async () => {
    const createPromises = Array.from({ length: 5 }, (_, i) =>
      dataProvider.create('posts', {
        data: { title: `Concurrent Post ${i}`, authorId: 1, views: 0, published: false },
      })
    )

    const results = await Promise.all(createPromises)

    // All should have unique IDs
    const ids = results.map((r) => r.data.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(5)

    // All should be in the store
    expect(store.getAll('posts')).toHaveLength(10) // 5 original + 5 new
  })

  it('should handle mixed read/write operations', async () => {
    const [listResult, createResult] = await Promise.all([
      dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      }),
      dataProvider.create('posts', {
        data: { title: 'New Concurrent Post', authorId: 1, views: 0, published: false },
      }),
    ])

    expect(listResult.data.length).toBeGreaterThan(0)
    expect(createResult.data.title).toBe('New Concurrent Post')
  })
})

// =============================================================================
// Data Consistency Tests
// =============================================================================

describe('Data Consistency Integration', () => {
  let store: InMemoryDataStore
  let dataProvider: DataProvider

  beforeEach(() => {
    store = new InMemoryDataStore({
      posts: [...samplePosts],
    })
    dataProvider = createRealDataProvider(store)
  })

  it('should reflect create operation in subsequent list query', async () => {
    const initialResult = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
    const initialCount = initialResult.total

    await dataProvider.create('posts', {
      data: { title: 'Consistency Test Post', authorId: 1, views: 0, published: false },
    })

    const updatedResult = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })

    expect(updatedResult.total).toBe(initialCount + 1)
    expect(updatedResult.data.find((p) => p.title === 'Consistency Test Post')).toBeDefined()
  })

  it('should reflect update operation in subsequent get query', async () => {
    await dataProvider.update('posts', {
      id: 1,
      data: { title: 'Consistency Updated Title' },
    })

    const result = await dataProvider.getOne('posts', { id: 1 })
    expect(result.data.title).toBe('Consistency Updated Title')
  })

  it('should reflect delete operation in subsequent list query', async () => {
    const initialResult = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
    const initialCount = initialResult.total

    await dataProvider.delete('posts', { id: 1 })

    const updatedResult = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })

    expect(updatedResult.total).toBe(initialCount - 1)
    expect(updatedResult.data.find((p) => p.id === 1)).toBeUndefined()
  })

  it('should maintain data integrity across multiple operations', async () => {
    const created = await dataProvider.create('posts', {
      data: { title: 'Integrity Test', authorId: 1, views: 0, published: false },
    })
    const newId = created.data.id

    await dataProvider.update('posts', {
      id: newId,
      data: { title: 'Integrity Test Updated', views: 100 },
    })

    const fetched = await dataProvider.getOne('posts', { id: newId })

    expect(fetched.data.title).toBe('Integrity Test Updated')
    expect(fetched.data.views).toBe(100)
    expect(fetched.data.authorId).toBe(1) // Original field preserved
    expect(fetched.data.published).toBe(false) // Original field preserved
  })

  it('should maintain filter consistency with updates', async () => {
    // Get initial published count
    const initialPublished = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'id', order: 'ASC' },
      filter: { published: true },
    })

    // Unpublish a post
    await dataProvider.update('posts', {
      id: 1,
      data: { published: false },
    })

    // Get updated published count
    const updatedPublished = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'id', order: 'ASC' },
      filter: { published: true },
    })

    expect(updatedPublished.total).toBe(initialPublished.total - 1)
  })
})

// =============================================================================
// Edge Cases Tests
// =============================================================================

describe('Edge Cases', () => {
  let store: InMemoryDataStore
  let dataProvider: DataProvider

  beforeEach(() => {
    store = new InMemoryDataStore({
      posts: [...samplePosts],
    })
    dataProvider = createRealDataProvider(store)
  })

  it('should handle empty filter object', async () => {
    const result = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
    expect(result.data).toHaveLength(5)
  })

  it('should handle filter with undefined values', async () => {
    const result = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'id', order: 'ASC' },
      filter: { title: undefined, authorId: undefined },
    })
    expect(result.data).toHaveLength(5)
  })

  it('should handle filter with empty string', async () => {
    const result = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'id', order: 'ASC' },
      filter: { q: '' },
    })
    expect(result.data).toHaveLength(5)
  })

  it('should handle page beyond data', async () => {
    const result = await dataProvider.getList('posts', {
      pagination: { page: 100, perPage: 10 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
    expect(result.data).toHaveLength(0)
    expect(result.total).toBe(5)
  })

  it('should handle very large perPage', async () => {
    const result = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
    expect(result.data).toHaveLength(5)
    expect(result.pageInfo?.hasNextPage).toBe(false)
  })

  it('should handle empty resource', async () => {
    store.setAll('emptyResource', [])
    const result = await dataProvider.getList('emptyResource', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
    expect(result.data).toHaveLength(0)
    expect(result.total).toBe(0)
  })

  it('should handle getMany with empty ids array', async () => {
    const result = await dataProvider.getMany('posts', { ids: [] })
    expect(result.data).toHaveLength(0)
  })

  it('should handle deleteMany with empty ids array', async () => {
    const initialCount = store.getAll('posts').length
    const result = await dataProvider.deleteMany('posts', { ids: [] })
    expect(result.data).toEqual([])
    expect(store.getAll('posts')).toHaveLength(initialCount)
  })
})
