/**
 * End-to-End Integration Tests
 *
 * Comprehensive integration tests for critical user flows:
 * - Full CRUD operations (Create, Read, Update, Delete)
 * - Filter and search functionality
 * - Pagination behavior
 * - Form validation
 * - Reference field/input behavior
 * - Auth flow (login, logout, permissions)
 *
 * These tests simulate realistic user interactions and verify
 * component coordination across the admin framework.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { AuthProviderContextProvider } from '../../contexts/AuthProviderContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import { ResourceContextProvider } from '../../contexts/ResourceContext'
import { CanAccess } from '../auth/CanAccess'
import { Create } from '../create/Create'
import { Edit } from '../edit/Edit'
import { BooleanField } from '../field/BooleanField'
import { NumberField } from '../field/NumberField'
import { TextField } from '../field/TextField'
import { SimpleForm } from '../form/SimpleForm'
import { BooleanInput } from '../input/BooleanInput'
import { NumberInput } from '../input/NumberInput'
import { TextInput } from '../input/TextInput'
import { Datagrid } from '../list/Datagrid'
import { List } from '../list/List'
import { Show } from '../show/Show'

import type { DataProvider, AuthProvider } from '../../facade'
import type { ReactNode } from 'react'


// =============================================================================
// Test Utilities
// =============================================================================

/**
 * Sample data for testing
 */
const samplePosts = [
  { id: 1, title: 'Introduction to React', authorId: 1, categoryId: 1, views: 1500, published: true, createdAt: '2024-01-15' },
  { id: 2, title: 'Advanced TypeScript', authorId: 2, categoryId: 2, views: 800, published: true, createdAt: '2024-01-20' },
  { id: 3, title: 'Testing Best Practices', authorId: 1, categoryId: 3, views: 1200, published: false, createdAt: '2024-02-01' },
  { id: 4, title: 'State Management Guide', authorId: 3, categoryId: 1, views: 2000, published: true, createdAt: '2024-02-10' },
  { id: 5, title: 'CSS-in-JS Solutions', authorId: 2, categoryId: 2, views: 600, published: true, createdAt: '2024-02-15' },
  { id: 6, title: 'Build Tools Overview', authorId: 3, categoryId: 3, views: 450, published: false, createdAt: '2024-02-20' },
]

const sampleAuthors = [
  { id: 1, name: 'John Smith', email: 'john@example.com.ai' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com.ai' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com.ai' },
]

const sampleCategories = [
  { id: 1, name: 'React', slug: 'react' },
  { id: 2, name: 'TypeScript', slug: 'typescript' },
  { id: 3, name: 'Testing', slug: 'testing' },
]

/**
 * Creates a comprehensive mock data provider
 */
const createMockDataProvider = (
  initialData: {
    posts?: typeof samplePosts
    authors?: typeof sampleAuthors
    categories?: typeof sampleCategories
  } = {}
): DataProvider & { _store: Record<string, unknown[]> } => {
  const store: Record<string, unknown[]> = {
    posts: [...(initialData.posts ?? samplePosts)],
    authors: [...(initialData.authors ?? sampleAuthors)],
    categories: [...(initialData.categories ?? sampleCategories)],
  }

  const getNextId = (resource: string): number => {
    const items = store[resource] ?? []
    const maxId = items.reduce<number>((max, item) => {
      const record = item as { id: number }
      return Math.max(max, record.id)
    }, 0)
    return maxId + 1
  }

  const provider = {
    _store: store,

    getList: vi.fn(async (resource: string, params: { pagination: { page: number; perPage: number }; sort: { field: string; order: string }; filter: Record<string, unknown> }) => {
      const items = store[resource] ?? []
      const { page, perPage } = params.pagination
      const { field, order } = params.sort
      const filter = params.filter

      // Apply filters
      let filtered = items.filter((item) => {
        const record = item as Record<string, unknown>
        for (const [key, value] of Object.entries(filter)) {
          if (value === undefined || value === null || value === '') continue

          // Handle q (search) filter
          if (key === 'q') {
            const searchValue = String(value).toLowerCase()
            const matchesAny = Object.values(record).some((v) =>
              String(v).toLowerCase().includes(searchValue)
            )
            if (!matchesAny) return false
            continue
          }

          // Handle boolean filters
          if (typeof value === 'boolean') {
            if (record[key] !== value) return false
            continue
          }

          // Handle range filters
          if (key.endsWith('_gte')) {
            const field = key.replace('_gte', '')
            if ((record[field] as number) < (value as number)) return false
            continue
          }
          if (key.endsWith('_lte')) {
            const field = key.replace('_lte', '')
            if ((record[field] as number) > (value as number)) return false
            continue
          }

          // Exact match
          if (record[key] !== value) return false
        }
        return true
      })

      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        const recordA = a as Record<string, unknown>
        const recordB = b as Record<string, unknown>
        const aVal = recordA[field]
        const bVal = recordB[field]
        if (aVal === bVal) return 0
        const comparison = aVal! < bVal! ? -1 : 1
        return order === 'ASC' ? comparison : -comparison
      })

      // Apply pagination
      const start = (page - 1) * perPage
      const end = start + perPage
      const paginated = filtered.slice(start, end)

      return {
        data: paginated,
        total: filtered.length,
        pageInfo: {
          hasNextPage: end < filtered.length,
          hasPreviousPage: page > 1,
        },
      }
    }),

    getOne: vi.fn(async (resource: string, params: { id: number | string }) => {
      const items = store[resource] ?? []
      const item = items.find((i) => (i as { id: number | string }).id === params.id || String((i as { id: number | string }).id) === String(params.id))
      if (!item) {
        throw new Error(`Resource ${resource} with id ${params.id} not found`)
      }
      return { data: item }
    }),

    getMany: vi.fn(async (resource: string, params: { ids: (number | string)[] }) => {
      const items = store[resource] ?? []
      const ids = params.ids.map(String)
      const found = items.filter((i) => ids.includes(String((i as { id: number | string }).id)))
      return { data: found }
    }),

    getManyReference: vi.fn(async (resource: string, params: { target: string; id: number | string; pagination: { page: number; perPage: number }; sort: { field: string; order: string } }) => {
      const items = store[resource] ?? []
      const filtered = items.filter((item) => {
        const record = item as Record<string, unknown>
        return String(record[params.target]) === String(params.id)
      })

      const { page, perPage } = params.pagination
      const start = (page - 1) * perPage
      const end = start + perPage
      const paginated = filtered.slice(start, end)

      return { data: paginated, total: filtered.length }
    }),

    create: vi.fn(async (resource: string, params: { data: Record<string, unknown> }) => {
      const newId = getNextId(resource)
      const newItem = { ...params.data, id: newId }
      if (!store[resource]) {
        store[resource] = []
      }
      store[resource].push(newItem)
      return { data: newItem }
    }),

    update: vi.fn(async (resource: string, params: { id: number | string; data: Record<string, unknown> }) => {
      const items = store[resource] ?? []
      const index = items.findIndex((i) => String((i as { id: number | string }).id) === String(params.id))
      if (index === -1) {
        throw new Error(`Resource ${resource} with id ${params.id} not found`)
      }
      const updated = { ...(items[index] as Record<string, unknown>), ...params.data, id: params.id }
      store[resource]![index] = updated
      return { data: updated }
    }),

    updateMany: vi.fn(async (resource: string, params: { ids: (number | string)[]; data: Record<string, unknown> }) => {
      const items = store[resource] ?? []
      const ids = params.ids.map(String)
      items.forEach((item, index) => {
        if (ids.includes(String((item as { id: number | string }).id))) {
          store[resource]![index] = { ...(item as Record<string, unknown>), ...params.data }
        }
      })
      return { data: params.ids }
    }),

    delete: vi.fn(async (resource: string, params: { id: number | string }) => {
      const items = store[resource] ?? []
      const index = items.findIndex((i) => String((i as { id: number | string }).id) === String(params.id))
      if (index === -1) {
        throw new Error(`Resource ${resource} with id ${params.id} not found`)
      }
      const deleted = items[index]
      store[resource]!.splice(index, 1)
      return { data: deleted }
    }),

    deleteMany: vi.fn(async (resource: string, params: { ids: (number | string)[] }) => {
      const ids = params.ids.map(String)
      store[resource] = (store[resource] ?? []).filter((i) => !ids.includes(String((i as { id: number | string }).id)))
      return { data: params.ids }
    }),
  }

  return provider as DataProvider & { _store: Record<string, unknown[]> }
}

/**
 * Creates a mock auth provider
 */
const createMockAuthProvider = (options: {
  isAuthenticated?: boolean
  permissions?: string[]
} = {}): AuthProvider => {
  const { isAuthenticated = true, permissions = ['admin'] } = options

  return {
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    checkAuth: vi.fn().mockImplementation(async () => {
      if (!isAuthenticated) throw new Error('Not authenticated')
    }),
    checkError: vi.fn().mockResolvedValue(undefined),
    getPermissions: vi.fn().mockImplementation(async () => {
      // Return empty permissions if not authenticated
      if (!isAuthenticated) return []
      return permissions
    }),
    getIdentity: vi.fn().mockResolvedValue({
      id: 1,
      fullName: 'Test User',
      email: 'test@example.com.ai',
    }),
  }
}

/**
 * Creates test wrapper with all providers
 */
const createTestWrapper = (
  dataProvider: DataProvider,
  options: {
    initialEntries?: string[]
    resource?: string
    authProvider?: AuthProvider
  } = {}
) => {
  const {
    initialEntries = ['/'],
    resource = 'posts',
    authProvider,
  } = options

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    const content = (
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <MemoryRouter initialEntries={initialEntries}>
              <ResourceContextProvider value={resource}>
                {children}
              </ResourceContextProvider>
            </MemoryRouter>
          </DataProviderContextProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    )

    if (authProvider) {
      return (
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <AuthProviderContextProvider authProvider={authProvider}>
              <DataProviderContextProvider dataProvider={dataProvider}>
                <MemoryRouter initialEntries={initialEntries}>
                  <ResourceContextProvider value={resource}>
                    {children}
                  </ResourceContextProvider>
                </MemoryRouter>
              </DataProviderContextProvider>
            </AuthProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      )
    }

    return content
  }
}

// =============================================================================
// CRUD Flow Integration Tests
// =============================================================================

describe('Full CRUD Flow Integration', () => {
  let dataProvider: ReturnType<typeof createMockDataProvider>
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    dataProvider = createMockDataProvider()
    user = userEvent.setup()
  })

  describe('Create Operation', () => {
    it('should create a new record and persist to data provider', async () => {
      const handleSubmit = vi.fn().mockImplementation(async (data) => {
        await dataProvider.create('posts', { data })
        return data
      })

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: '', views: 0, published: false }}>
              <TextInput source="title" label="Title" />
              <NumberInput source="views" label="Views" />
              <BooleanInput source="published" label="Published" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Fill in the form
      await user.type(screen.getByLabelText('Title'), 'New Integration Test Post')
      await user.clear(screen.getByLabelText('Views'))
      await user.type(screen.getByLabelText('Views'), '100')
      await user.click(screen.getByLabelText('Published'))

      // Submit the form
      await user.click(screen.getByRole('button', { name: /save/i }))

      // Verify data provider was called
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Integration Test Post',
            views: 100,
            published: true,
          }),
          expect.anything()
        )
      })
    })

    it('should handle create errors gracefully', async () => {
      const createError = new Error('Create failed: Server error')
      dataProvider.create = vi.fn().mockRejectedValue(createError)

      const handleSubmit = vi.fn().mockImplementation(async (data) => {
        await dataProvider.create('posts', { data })
      })

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: '' }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      await user.type(screen.getByLabelText('Title'), 'Test Post')
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled()
      })
    })

    it('should prevent double submission', async () => {
      let resolveSubmit: () => void
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve
      })

      const handleSubmit = vi.fn().mockImplementation(async () => {
        await submitPromise
      })

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: '' }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      await user.type(screen.getByLabelText('Title'), 'Test')

      // Click save multiple times quickly
      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      // Button should be disabled during submission
      await waitFor(() => {
        expect(saveButton).toBeDisabled()
      })

      // Resolve the submission
      resolveSubmit!()

      await waitFor(() => {
        // Should only have been called once
        expect(handleSubmit).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Read Operation', () => {
    it('should fetch and display a list of records', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
              <NumberField source="views" />
              <BooleanField source="published" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Introduction to React')).toBeInTheDocument()
      })

      expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.any(Object))
      expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument()
      // NumberField formats with locale - 1500 becomes "1,500" in en-US
      expect(screen.getByText('1,500')).toBeInTheDocument()
    })

    it('should fetch and display a single record', async () => {
      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/1'] })

      render(
        <Wrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
            <NumberField source="views" />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })
    })

    it('should handle not found errors', async () => {
      dataProvider.getOne = vi.fn().mockRejectedValue(new Error('Not found'))

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/999'] })

      render(
        <Wrapper>
          <Show resource="posts" id={999}>
            <TextField source="title" />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 999 })
      })
    })
  })

  describe('Update Operation', () => {
    it('should update an existing record', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Original Title', views: 100, published: true },
      })

      const handleSubmit = vi.fn().mockImplementation(async (data) => {
        await dataProvider.update('posts', { id: 1, data })
        return data
      })

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/1/edit'] })

      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: 'Original Title', views: 100, published: true }}>
              <TextInput source="title" label="Title" />
              <NumberInput source="views" label="Views" />
              <BooleanInput source="published" label="Published" />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      // Wait for the form to be available
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      })

      // Update the title
      const titleInput = screen.getByLabelText('Title')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Title')

      // Submit
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Updated Title',
          }),
          expect.anything()
        )
      })
    })

    it('should handle concurrent edit detection', async () => {
      const concurrentError = new Error('Record has been modified by another user')
      dataProvider.update = vi.fn().mockRejectedValue(concurrentError)

      const handleSubmit = vi.fn().mockImplementation(async (data) => {
        await dataProvider.update('posts', { id: 1, data })
      })

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/1/edit'] })

      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: 'Test' }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('Delete Operation', () => {
    it('should delete a single record', async () => {
      const initialCount = dataProvider._store.posts!.length

      await act(async () => {
        await dataProvider.delete('posts', { id: 1 })
      })

      expect(dataProvider._store.posts!.length).toBe(initialCount - 1)
      expect(dataProvider._store.posts!.find((p: unknown) => (p as { id: number }).id === 1)).toBeUndefined()
    })

    it('should delete multiple records with bulk delete', async () => {
      const initialCount = dataProvider._store.posts!.length

      await act(async () => {
        await dataProvider.deleteMany('posts', { ids: [1, 2, 3] })
      })

      expect(dataProvider._store.posts!.length).toBe(initialCount - 3)
    })

    it('should handle delete errors', async () => {
      dataProvider.delete = vi.fn().mockRejectedValue(new Error('Delete failed'))

      await expect(dataProvider.delete('posts', { id: 1 })).rejects.toThrow('Delete failed')
    })
  })

  describe('Full CRUD Cycle', () => {
    it('should complete create -> read -> update -> delete cycle', async () => {
      // 1. Create
      const createResult = await dataProvider.create('posts', {
        data: { title: 'Cycle Test Post', views: 50, published: false },
      })
      expect(createResult.data).toMatchObject({ title: 'Cycle Test Post' })
      const newId = (createResult.data as { id: number }).id

      // 2. Read
      const readResult = await dataProvider.getOne('posts', { id: newId })
      expect(readResult.data).toMatchObject({ title: 'Cycle Test Post', views: 50 })

      // 3. Update
      await dataProvider.update('posts', {
        id: newId,
        data: { title: 'Updated Cycle Test Post', views: 100 },
      })
      const updatedResult = await dataProvider.getOne('posts', { id: newId })
      expect(updatedResult.data).toMatchObject({ title: 'Updated Cycle Test Post', views: 100 })

      // 4. Delete
      await dataProvider.delete('posts', { id: newId })
      await expect(dataProvider.getOne('posts', { id: newId })).rejects.toThrow()
    })
  })
})

// =============================================================================
// Filter and Search Integration Tests
// =============================================================================

describe('Filter and Search Integration', () => {
  let dataProvider: ReturnType<typeof createMockDataProvider>

  beforeEach(() => {
    dataProvider = createMockDataProvider()
  })

  describe('Text Search (q filter)', () => {
    it('should filter records by search query', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { q: 'react' },
      })

      expect(result.data.length).toBe(1)
      expect((result.data[0] as unknown as { title: string }).title).toBe('Introduction to React')
    })

    it('should return empty results for non-matching search', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { q: 'nonexistent' },
      })

      expect(result.data.length).toBe(0)
    })

    it('should handle case-insensitive search', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { q: 'TYPESCRIPT' },
      })

      expect(result.data.length).toBe(1)
      expect((result.data[0] as unknown as { title: string }).title).toBe('Advanced TypeScript')
    })
  })

  describe('Boolean Filters', () => {
    it('should filter by published status', async () => {
      const publishedResult = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { published: true },
      })

      expect(publishedResult.data.every((p: unknown) => (p as { published: boolean }).published === true)).toBe(true)

      const unpublishedResult = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { published: false },
      })

      expect(unpublishedResult.data.every((p: unknown) => (p as { published: boolean }).published === false)).toBe(true)
    })
  })

  describe('Range Filters', () => {
    it('should filter by minimum views', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { views_gte: 1000 },
      })

      expect(result.data.every((p: unknown) => (p as { views: number }).views >= 1000)).toBe(true)
      expect(result.data.length).toBe(3) // Posts with 1500, 1200, 2000 views
    })

    it('should filter by maximum views', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { views_lte: 700 },
      })

      expect(result.data.every((p: unknown) => (p as { views: number }).views <= 700)).toBe(true)
      expect(result.data.length).toBe(2) // Posts with 600, 450 views
    })

    it('should filter by view range', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { views_gte: 500, views_lte: 1000 },
      })

      expect(result.data.every((p: unknown) => {
        const views = (p as { views: number }).views
        return views >= 500 && views <= 1000
      })).toBe(true)
      expect(result.data.length).toBe(2) // Posts with 800, 600 views
    })
  })

  describe('Reference Filters', () => {
    it('should filter by author reference', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { authorId: 1 },
      })

      expect(result.data.every((p: unknown) => (p as { authorId: number }).authorId === 1)).toBe(true)
      expect(result.data.length).toBe(2)
    })

    it('should filter by category reference', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { categoryId: 2 },
      })

      expect(result.data.every((p: unknown) => (p as { categoryId: number }).categoryId === 2)).toBe(true)
      expect(result.data.length).toBe(2)
    })
  })

  describe('Combined Filters', () => {
    it('should apply multiple filters together', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { published: true, views_gte: 1000 },
      })

      expect(result.data.every((p: unknown) => {
        const post = p as { published: boolean; views: number }
        return post.published === true && post.views >= 1000
      })).toBe(true)
      expect(result.data.length).toBe(2) // Posts with 1500 and 2000 views that are published
    })

    it('should apply search with other filters', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: { q: 'best', published: false },
      })

      expect(result.data.length).toBe(1)
      expect((result.data[0] as unknown as { title: string }).title).toBe('Testing Best Practices')
    })
  })

  describe('Filter Persistence', () => {
    it('should maintain filters across pagination', async () => {
      const page1 = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: { published: true },
      })

      const page2 = await dataProvider.getList('posts', {
        pagination: { page: 2, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: { published: true },
      })

      // Both pages should only contain published posts
      expect(page1.data.every((p: unknown) => (p as { published: boolean }).published === true)).toBe(true)
      expect(page2.data.every((p: unknown) => (p as { published: boolean }).published === true)).toBe(true)

      // Total should reflect filtered count
      expect(page1.total).toBe(page2.total)
    })
  })
})

// =============================================================================
// Pagination Integration Tests
// =============================================================================

describe('Pagination Integration', () => {
  let dataProvider: ReturnType<typeof createMockDataProvider>

  beforeEach(() => {
    dataProvider = createMockDataProvider()
  })

  describe('Basic Pagination', () => {
    it('should return correct page of results', async () => {
      const page1 = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(page1.data.length).toBe(2)
      expect((page1.data[0] as { id: number }).id).toBe(1)
      expect((page1.data[1] as { id: number }).id).toBe(2)

      const page2 = await dataProvider.getList('posts', {
        pagination: { page: 2, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(page2.data.length).toBe(2)
      expect((page2.data[0] as { id: number }).id).toBe(3)
      expect((page2.data[1] as { id: number }).id).toBe(4)
    })

    it('should return correct total count', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(result.total).toBe(6)
    })

    it('should handle last page with fewer items', async () => {
      const lastPage = await dataProvider.getList('posts', {
        pagination: { page: 3, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(lastPage.data.length).toBe(2) // Posts 5 and 6
    })

    it('should return empty for page beyond data', async () => {
      const emptyPage = await dataProvider.getList('posts', {
        pagination: { page: 10, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(emptyPage.data.length).toBe(0)
    })
  })

  describe('Page Info', () => {
    it('should indicate hasNextPage correctly', async () => {
      const page1 = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(page1.pageInfo?.hasNextPage).toBe(true)

      const lastPage = await dataProvider.getList('posts', {
        pagination: { page: 3, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(lastPage.pageInfo?.hasNextPage).toBe(false)
    })

    it('should indicate hasPreviousPage correctly', async () => {
      const page1 = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(page1.pageInfo?.hasPreviousPage).toBe(false)

      const page2 = await dataProvider.getList('posts', {
        pagination: { page: 2, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(page2.pageInfo?.hasPreviousPage).toBe(true)
    })
  })

  describe('Pagination with Sorting', () => {
    it('should paginate sorted results correctly', async () => {
      const page1 = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 2 },
        sort: { field: 'views', order: 'DESC' },
        filter: {},
      })

      // Highest views first
      expect((page1.data[0] as unknown as { views: number }).views).toBe(2000)
      expect((page1.data[1] as unknown as { views: number }).views).toBe(1500)

      const page2 = await dataProvider.getList('posts', {
        pagination: { page: 2, perPage: 2 },
        sort: { field: 'views', order: 'DESC' },
        filter: {},
      })

      expect((page2.data[0] as unknown as { views: number }).views).toBe(1200)
      expect((page2.data[1] as unknown as { views: number }).views).toBe(800)
    })
  })

  describe('Pagination with Filters', () => {
    it('should paginate filtered results correctly', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: { published: true },
      })

      // Total should reflect filtered count
      expect(result.total).toBe(4) // 4 published posts
      expect(result.data.length).toBe(2)
      expect(result.data.every((p: unknown) => (p as { published: boolean }).published === true)).toBe(true)
    })
  })
})

// =============================================================================
// Form Validation Integration Tests
// =============================================================================

describe('Form Validation Integration', () => {
  let dataProvider: ReturnType<typeof createMockDataProvider>
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    dataProvider = createMockDataProvider()
    user = userEvent.setup()
  })

  describe('Form Submission Flow', () => {
    it('should submit form with valid data', async () => {
      const handleSubmit = vi.fn()

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={{ title: '' }}
            >
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      await user.type(screen.getByLabelText('Title'), 'Valid Title')
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Valid Title' }),
          expect.anything()
        )
      })
    })

    it('should submit form with multiple fields', async () => {
      const handleSubmit = vi.fn()

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={{ title: '', views: 0, published: false }}
            >
              <TextInput source="title" label="Title" />
              <NumberInput source="views" label="Views" />
              <BooleanInput source="published" label="Published" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      await user.type(screen.getByLabelText('Title'), 'Test Post')
      await user.clear(screen.getByLabelText('Views'))
      await user.type(screen.getByLabelText('Views'), '500')
      await user.click(screen.getByLabelText('Published'))

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Post',
            views: 500,
            published: true,
          }),
          expect.anything()
        )
      })
    })
  })

  describe('Form State Management', () => {
    it('should track form dirty state', async () => {
      const handleSubmit = vi.fn()

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={{ title: '' }}
            >
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      const input = screen.getByLabelText('Title')

      // Initially empty
      expect(input).toHaveValue('')

      // Type something
      await user.type(input, 'New Value')
      expect(input).toHaveValue('New Value')

      // Clear it
      await user.clear(input)
      expect(input).toHaveValue('')
    })

    it('should handle default values', async () => {
      const handleSubmit = vi.fn()

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={{ title: 'Default Title', views: 100 }}
            >
              <TextInput source="title" label="Title" />
              <NumberInput source="views" label="Views" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      expect(screen.getByLabelText('Title')).toHaveValue('Default Title')
      expect(screen.getByLabelText('Views')).toHaveValue(100)
    })
  })

  describe('Number Input Validation', () => {
    it('should handle number input changes', async () => {
      const handleSubmit = vi.fn()

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={{ views: 0 }}
            >
              <NumberInput source="views" label="Views" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      const viewsInput = screen.getByLabelText('Views')
      await user.clear(viewsInput)
      await user.type(viewsInput, '42')

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ views: 42 }),
          expect.anything()
        )
      })
    })

    it('should handle decimal numbers', async () => {
      const handleSubmit = vi.fn()

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={{ price: 0 }}
            >
              <NumberInput source="price" label="Price" step={0.01} />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      const priceInput = screen.getByLabelText('Price')
      await user.clear(priceInput)
      await user.type(priceInput, '19.99')

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ price: 19.99 }),
          expect.anything()
        )
      })
    })
  })

  describe('Boolean Input Handling', () => {
    it('should toggle boolean values', async () => {
      const handleSubmit = vi.fn()

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={{ published: false }}
            >
              <BooleanInput source="published" label="Published" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Initially false - toggle to true
      await user.click(screen.getByLabelText('Published'))

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ published: true }),
          expect.anything()
        )
      })
    })

    it('should toggle boolean from true to false', async () => {
      const handleSubmit = vi.fn()

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={{ published: true }}
            >
              <BooleanInput source="published" label="Published" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Initially true - toggle to false
      await user.click(screen.getByLabelText('Published'))

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ published: false }),
          expect.anything()
        )
      })
    })
  })

  describe('Form Reset Behavior', () => {
    it('should preserve values until submission', async () => {
      const handleSubmit = vi.fn()

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={{ title: '' }}
            >
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Type a value
      await user.type(screen.getByLabelText('Title'), 'Typed Value')

      // Value should be preserved
      expect(screen.getByLabelText('Title')).toHaveValue('Typed Value')
    })
  })

  describe('Data Transformation', () => {
    it('should apply transform before submission', async () => {
      const handleSubmit = vi.fn()

      const Wrapper = createTestWrapper(dataProvider, { initialEntries: ['/posts/create'] })

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={{ title: '' }}
              transform={(data) => ({
                ...data,
                title: (data.title as string).toUpperCase(),
              })}
            >
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      await user.type(screen.getByLabelText('Title'), 'lowercase title')
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'LOWERCASE TITLE' }),
          expect.anything()
        )
      })
    })
  })
})

// =============================================================================
// Reference Field/Input Integration Tests
// =============================================================================

describe('Reference Field/Input Integration', () => {
  let dataProvider: ReturnType<typeof createMockDataProvider>

  beforeEach(() => {
    dataProvider = createMockDataProvider()
  })

  describe('ReferenceField Display', () => {
    it('should fetch and display referenced record', async () => {
      // Get author for a post
      const authorResult = await dataProvider.getOne('authors', { id: 1 })
      expect((authorResult.data as unknown as { name: string }).name).toBe('John Smith')
    })

    it('should handle multiple reference lookups efficiently', async () => {
      const result = await dataProvider.getMany('authors', { ids: [1, 2] })
      expect(result.data.length).toBe(2)
    })
  })

  describe('getManyReference', () => {
    it('should fetch records by reference field', async () => {
      // Mock getManyReference to return comments for a post
      dataProvider._store.comments = [
        { id: 1, body: 'Great post!', postId: 1 },
        { id: 2, body: 'Thanks!', postId: 1 },
        { id: 3, body: 'Interesting', postId: 2 },
      ]

      const result = await dataProvider.getManyReference('comments', {
        target: 'postId',
        id: 1,
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(result.data.length).toBe(2)
      expect(result.data.every((c: unknown) => (c as { postId: number }).postId === 1)).toBe(true)
    })

    it('should paginate referenced records', async () => {
      dataProvider._store.comments = [
        { id: 1, body: 'Comment 1', postId: 1 },
        { id: 2, body: 'Comment 2', postId: 1 },
        { id: 3, body: 'Comment 3', postId: 1 },
        { id: 4, body: 'Comment 4', postId: 1 },
        { id: 5, body: 'Comment 5', postId: 1 },
      ]

      const page1 = await dataProvider.getManyReference('comments', {
        target: 'postId',
        id: 1,
        pagination: { page: 1, perPage: 2 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(page1.data.length).toBe(2)
      expect(page1.total).toBe(5)
    })
  })

  describe('Reference Data Integrity', () => {
    it('should handle missing references gracefully', async () => {
      // Try to get a non-existent author
      await expect(dataProvider.getOne('authors', { id: 999 })).rejects.toThrow()
    })

    it('should update reference when parent record is updated', async () => {
      // Update an author
      await dataProvider.update('authors', {
        id: 1,
        data: { name: 'John Smith Updated', email: 'john.updated@example.com.ai' },
      })

      // Verify the update
      const result = await dataProvider.getOne('authors', { id: 1 })
      expect((result.data as unknown as { name: string }).name).toBe('John Smith Updated')
    })
  })
})

// =============================================================================
// Auth Flow Integration Tests
// =============================================================================

describe('Auth Flow Integration', () => {
  let authProvider: AuthProvider

  beforeEach(() => {
    authProvider = createMockAuthProvider()
  })

  describe('Authentication Check', () => {
    it('should allow access when authenticated', async () => {
      await expect(authProvider.checkAuth()).resolves.not.toThrow()
    })

    it('should reject access when not authenticated', async () => {
      authProvider = createMockAuthProvider({ isAuthenticated: false })
      await expect(authProvider.checkAuth()).rejects.toThrow('Not authenticated')
    })
  })

  describe('Login Flow', () => {
    it('should authenticate user with valid credentials', async () => {
      await expect(authProvider.login({ username: 'test', password: 'test' })).resolves.not.toThrow()
    })
  })

  describe('Logout Flow', () => {
    it('should log out the user', async () => {
      await expect(authProvider.logout()).resolves.not.toThrow()
      expect(authProvider.logout).toHaveBeenCalled()
    })
  })

  describe('Permission Checks', () => {
    it('should return user permissions', async () => {
      const permissions = await authProvider.getPermissions()
      expect(permissions).toContain('admin')
    })

    it('should return empty permissions when not authenticated', async () => {
      authProvider = createMockAuthProvider({ isAuthenticated: false })
      const permissions = await authProvider.getPermissions()
      expect(permissions).toEqual([])
    })

    it('should return custom permissions', async () => {
      authProvider = createMockAuthProvider({ permissions: ['read', 'write'] })
      const permissions = await authProvider.getPermissions()
      expect(permissions).toEqual(['read', 'write'])
    })
  })

  describe('Identity Retrieval', () => {
    it('should return user identity when authenticated', async () => {
      const identity = await authProvider.getIdentity!()
      expect(identity).toMatchObject({
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com.ai',
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle check error for 401 responses', async () => {
      await expect(authProvider.checkError({ status: 401 })).resolves.not.toThrow()
    })

    it('should handle check error for non-auth errors', async () => {
      await expect(authProvider.checkError({ status: 500 })).resolves.not.toThrow()
    })
  })
})

// =============================================================================
// Component + Auth Integration Tests
// =============================================================================

describe('Component + Auth Integration', () => {
  let dataProvider: ReturnType<typeof createMockDataProvider>
  let authProvider: AuthProvider

  beforeEach(() => {
    dataProvider = createMockDataProvider()
    authProvider = createMockAuthProvider()
  })

  describe('Permission-Based UI', () => {
    it('should show admin-only content for admin users', async () => {
      authProvider = createMockAuthProvider({ permissions: ['admin'] })

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      })

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProviderContextProvider authProvider={authProvider}>
            <CanAccess permission="admin">
              <div data-testid="admin-content">Admin Only Content</div>
            </CanAccess>
          </AuthProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('admin-content')).toBeInTheDocument()
      })
    })

    it('should hide admin content for non-admin users', async () => {
      authProvider = createMockAuthProvider({ permissions: ['user'] })

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      })

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProviderContextProvider authProvider={authProvider}>
            <CanAccess permission="admin">
              <div data-testid="admin-content">Admin Only Content</div>
            </CanAccess>
          </AuthProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument()
      })
    })

    it('should show fallback for unauthorized users', async () => {
      authProvider = createMockAuthProvider({ permissions: ['user'] })

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      })

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProviderContextProvider authProvider={authProvider}>
            <CanAccess
              permission="admin"
              fallback={<div data-testid="fallback">Access Denied</div>}
            >
              <div data-testid="admin-content">Admin Only Content</div>
            </CanAccess>
          </AuthProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback')).toBeInTheDocument()
      })
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument()
    })
  })

  describe('CRUD with Auth', () => {
    it('should call data provider when authenticated', async () => {
      const Wrapper = createTestWrapper(dataProvider, {
        authProvider,
      })

      render(
        <Wrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalled()
      })
    })
  })
})

// =============================================================================
// Sorting Integration Tests
// =============================================================================

describe('Sorting Integration', () => {
  let dataProvider: ReturnType<typeof createMockDataProvider>

  beforeEach(() => {
    dataProvider = createMockDataProvider()
  })

  describe('Single Column Sort', () => {
    it('should sort by ascending order', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'title', order: 'ASC' },
        filter: {},
      })

      const titles = result.data.map((p: unknown) => (p as { title: string }).title)
      const sortedTitles = [...titles].sort()
      expect(titles).toEqual(sortedTitles)
    })

    it('should sort by descending order', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'views', order: 'DESC' },
        filter: {},
      })

      const views = result.data.map((p: unknown) => (p as { views: number }).views)
      const sortedViews = [...views].sort((a, b) => b - a)
      expect(views).toEqual(sortedViews)
    })
  })

  describe('Sort with Pagination', () => {
    it('should maintain sort order across pages', async () => {
      const page1 = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 3 },
        sort: { field: 'views', order: 'DESC' },
        filter: {},
      })

      const page2 = await dataProvider.getList('posts', {
        pagination: { page: 2, perPage: 3 },
        sort: { field: 'views', order: 'DESC' },
        filter: {},
      })

      const page1LastViews = (page1.data[page1.data.length - 1] as unknown as { views: number }).views
      const page2FirstViews = (page2.data[0] as unknown as { views: number }).views

      expect(page1LastViews).toBeGreaterThanOrEqual(page2FirstViews)
    })
  })

  describe('Sort with Filters', () => {
    it('should sort filtered results', async () => {
      const result = await dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'views', order: 'ASC' },
        filter: { published: true },
      })

      // All results should be published
      expect(result.data.every((p: unknown) => (p as { published: boolean }).published === true)).toBe(true)

      // Results should be sorted by views ascending
      const views = result.data.map((p: unknown) => (p as { views: number }).views)
      const sortedViews = [...views].sort((a, b) => a - b)
      expect(views).toEqual(sortedViews)
    })
  })
})

// =============================================================================
// Error Handling Integration Tests
// =============================================================================

describe('Error Handling Integration', () => {
  let dataProvider: ReturnType<typeof createMockDataProvider>

  beforeEach(() => {
    dataProvider = createMockDataProvider()
  })

  describe('Network Errors', () => {
    it('should handle network timeout', async () => {
      dataProvider.getList = vi.fn().mockRejectedValue(new Error('Network timeout'))

      await expect(dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })).rejects.toThrow('Network timeout')
    })

    it('should handle server errors', async () => {
      dataProvider.getList = vi.fn().mockRejectedValue(new Error('Internal Server Error'))

      await expect(dataProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })).rejects.toThrow('Internal Server Error')
    })
  })

  describe('Validation Errors', () => {
    it('should handle validation errors on create', async () => {
      const validationError = new Error('Validation failed')
      ;(validationError as Error & { errors: Record<string, string> }).errors = { title: 'Title is required' }
      dataProvider.create = vi.fn().mockRejectedValue(validationError)

      await expect(dataProvider.create('posts', { data: {} })).rejects.toThrow('Validation failed')
    })

    it('should handle validation errors on update', async () => {
      const validationError = new Error('Validation failed')
      dataProvider.update = vi.fn().mockRejectedValue(validationError)

      await expect(dataProvider.update('posts', { id: 1, data: {} })).rejects.toThrow('Validation failed')
    })
  })

  describe('Not Found Errors', () => {
    it('should handle getOne not found', async () => {
      await expect(dataProvider.getOne('posts', { id: 9999 })).rejects.toThrow('not found')
    })

    it('should handle update not found', async () => {
      await expect(dataProvider.update('posts', { id: 9999, data: { title: 'Test' } })).rejects.toThrow('not found')
    })

    it('should handle delete not found', async () => {
      await expect(dataProvider.delete('posts', { id: 9999 })).rejects.toThrow('not found')
    })
  })
})

// =============================================================================
// Concurrent Operations Integration Tests
// =============================================================================

describe('Concurrent Operations Integration', () => {
  let dataProvider: ReturnType<typeof createMockDataProvider>

  beforeEach(() => {
    dataProvider = createMockDataProvider()
  })

  describe('Parallel Reads', () => {
    it('should handle multiple concurrent getList calls', async () => {
      const results = await Promise.all([
        dataProvider.getList('posts', { pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
        dataProvider.getList('authors', { pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
        dataProvider.getList('categories', { pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
      ])

      expect(results).toHaveLength(3)
      expect(results[0].data.length).toBeGreaterThan(0)
      expect(results[1].data.length).toBeGreaterThan(0)
      expect(results[2].data.length).toBeGreaterThan(0)
    })

    it('should handle multiple concurrent getOne calls', async () => {
      const results = await Promise.all([
        dataProvider.getOne('posts', { id: 1 }),
        dataProvider.getOne('posts', { id: 2 }),
        dataProvider.getOne('authors', { id: 1 }),
      ])

      expect(results).toHaveLength(3)
    })
  })

  describe('Parallel Writes', () => {
    it('should handle multiple concurrent create calls', async () => {
      const results = await Promise.all([
        dataProvider.create('posts', { data: { title: 'Post A', views: 10, published: true } }),
        dataProvider.create('posts', { data: { title: 'Post B', views: 20, published: false } }),
        dataProvider.create('posts', { data: { title: 'Post C', views: 30, published: true } }),
      ])

      expect(results).toHaveLength(3)

      // All should have unique IDs
      const ids = results.map((r) => (r.data as { id: number }).id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(3)
    })
  })

  describe('Mixed Operations', () => {
    it('should handle concurrent reads and writes', async () => {
      const [readResult, createResult] = await Promise.all([
        dataProvider.getList('posts', { pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
        dataProvider.create('posts', { data: { title: 'New Post', views: 0, published: false } }),
      ])

      expect(readResult.data.length).toBeGreaterThan(0)
      expect((createResult.data as unknown as { title: string }).title).toBe('New Post')
    })
  })
})
