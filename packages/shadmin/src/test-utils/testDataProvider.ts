/**
 * Mock DataProvider factory for testing
 * Provides a fully mockable data provider interface for admin components
 */

import { vi } from 'vitest'

import { applyFiltersWithOperators } from '../utils/filterOperators'

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
  RaRecord,
} from '../types'

// Re-export DataProvider for convenience
export type { DataProvider } from '../types'

/**
 * Options for creating a mock data provider
 */
export interface MockDataProviderOptions {
  /**
   * Initial data keyed by resource name
   */
  data?: Record<string, Record<string, unknown>[]>
  /**
   * Delay in ms to simulate network latency
   */
  delay?: number
  /**
   * Custom responses for specific operations
   */
  responses?: {
    getList?: Partial<GetListResult>
    getOne?: Partial<GetOneResult>
    getMany?: Partial<GetManyResult>
    getManyReference?: Partial<GetManyReferenceResult>
    create?: Partial<CreateResult>
    update?: Partial<UpdateResult>
    updateMany?: Partial<UpdateManyResult>
    delete?: Partial<DeleteResult>
    deleteMany?: Partial<DeleteManyResult>
  }
}

/**
 * Default mock data for testing
 */
export const defaultMockData: Record<string, Record<string, unknown>[]> = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com.ai', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com.ai', role: 'user' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com.ai', role: 'user' },
  ],
  posts: [
    { id: 1, title: 'First Post', content: 'Hello World', authorId: 1, published: true },
    { id: 2, title: 'Second Post', content: 'Testing', authorId: 2, published: false },
  ],
  comments: [
    { id: 1, body: 'Great post!', postId: 1, authorId: 2 },
    { id: 2, body: 'Thanks for sharing', postId: 1, authorId: 3 },
  ],
}

/**
 * Creates a delay promise for simulating network latency
 */
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Creates a mock DataProvider for testing
 *
 * @example
 * ```tsx
 * const dataProvider = createMockDataProvider({
 *   data: {
 *     users: [{ id: 1, name: 'Test User' }],
 *   },
 * })
 *
 * // Use with TestAdminContext
 * render(
 *   <TestAdminContext dataProvider={dataProvider}>
 *     <UserList />
 *   </TestAdminContext>
 * )
 * ```
 */
export function createMockDataProvider(options: MockDataProviderOptions = {}): DataProvider {
  const { data = defaultMockData, delay = 0, responses = {} } = options

  // Create a mutable copy of the data
  const store: Record<string, Record<string, unknown>[]> = JSON.parse(JSON.stringify(data))

  const getNextId = (resource: string): number => {
    const items = store[resource] ?? []
    const maxId = items.reduce((max, item) => {
      const id = typeof item['id'] === 'number' ? item['id'] : 0
      return Math.max(max, id)
    }, 0)
    return maxId + 1
  }

  // Cast to DataProvider - the vi.fn wrapper breaks the generic inference,
  // but the implementation is type-safe at runtime
  const provider = {
    getList: vi.fn(async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetListParams
    ): Promise<GetListResult<RecordType>> => {
      if (delay) await wait(delay)

      const items = (store[resource] ?? []) as RecordType[]
      const { page, perPage } = params.pagination
      const { field, order } = params.sort
      const filter = params.filter as Record<string, unknown>

      // Apply filters with operator support
      let filtered = applyFiltersWithOperators(
        items as Record<string, unknown>[],
        filter
      ) as RecordType[]

      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[field]
        const bVal = (b as Record<string, unknown>)[field]
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
        ...responses.getList,
      } as GetListResult<RecordType>
    }),

    getOne: vi.fn(async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetOneParams
    ): Promise<GetOneResult<RecordType>> => {
      if (delay) await wait(delay)

      const items = store[resource] ?? []
      const item = items.find((i) => String(i['id']) === String(params.id))

      if (!item) {
        throw new Error(`Resource ${resource} with id ${params.id} not found`)
      }

      return {
        data: item as RecordType,
        ...responses.getOne,
      } as GetOneResult<RecordType>
    }),

    getMany: vi.fn(async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetManyParams
    ): Promise<GetManyResult<RecordType>> => {
      if (delay) await wait(delay)

      const items = store[resource] ?? []
      const ids = params.ids.map(String)
      const found = items.filter((i) => ids.includes(String(i['id'])))

      return {
        data: found as RecordType[],
        ...responses.getMany,
      } as GetManyResult<RecordType>
    }),

    getManyReference: vi.fn(async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetManyReferenceParams
    ): Promise<GetManyReferenceResult<RecordType>> => {
      if (delay) await wait(delay)

      const items = (store[resource] ?? []) as RecordType[]
      const { target, id, pagination, sort } = params
      const filter = params.filter as Record<string, unknown>

      // Filter by reference
      let filtered = items.filter((item) => {
        return String((item as Record<string, unknown>)[target]) === String(id)
      })

      // Apply additional filters with operator support
      filtered = applyFiltersWithOperators(
        filtered as Record<string, unknown>[],
        filter
      ) as RecordType[]

      // Apply sorting
      const { field, order } = sort
      filtered = [...filtered].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[field]
        const bVal = (b as Record<string, unknown>)[field]
        if (aVal === bVal) return 0
        const comparison = aVal! < bVal! ? -1 : 1
        return order === 'ASC' ? comparison : -comparison
      })

      // Apply pagination
      const { page, perPage } = pagination
      const start = (page - 1) * perPage
      const end = start + perPage
      const paginated = filtered.slice(start, end)

      return {
        data: paginated,
        total: filtered.length,
        ...responses.getManyReference,
      } as GetManyReferenceResult<RecordType>
    }),

    create: vi.fn(async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: CreateParams<TVariables>
    ): Promise<CreateResult<RecordType>> => {
      if (delay) await wait(delay)

      const newId = getNextId(resource)
      const newItem = { ...params.data, id: newId } as unknown as RecordType

      if (!store[resource]) {
        store[resource] = []
      }
      store[resource].push(newItem as Record<string, unknown>)

      return {
        data: newItem,
        ...responses.create,
      } as CreateResult<RecordType>
    }),

    update: vi.fn(async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: UpdateParams<TVariables>
    ): Promise<UpdateResult<RecordType>> => {
      if (delay) await wait(delay)

      const items = store[resource] ?? []
      const index = items.findIndex((i) => String(i['id']) === String(params.id))

      if (index === -1) {
        throw new Error(`Resource ${resource} with id ${params.id} not found`)
      }

      const updated = { ...items[index], ...params.data, id: params.id } as unknown as RecordType
      store[resource]![index] = updated as Record<string, unknown>

      return {
        data: updated,
        ...responses.update,
      } as UpdateResult<RecordType>
    }),

    updateMany: vi.fn(async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: UpdateManyParams<TVariables>
    ): Promise<UpdateManyResult<RecordType>> => {
      if (delay) await wait(delay)

      const items = store[resource] ?? []
      const ids = params.ids.map(String)

      items.forEach((item, index) => {
        if (ids.includes(String(item['id']))) {
          store[resource]![index] = { ...item, ...params.data }
        }
      })

      return {
        data: params.ids,
        ...responses.updateMany,
      } as UpdateManyResult<RecordType>
    }),

    delete: vi.fn(async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>> => {
      if (delay) await wait(delay)

      const items = store[resource] ?? []
      const index = items.findIndex((i) => String(i['id']) === String(params.id))

      if (index === -1) {
        throw new Error(`Resource ${resource} with id ${params.id} not found`)
      }

      const deleted = items[index] as RecordType
      store[resource]!.splice(index, 1)

      return {
        data: deleted,
        ...responses.delete,
      } as DeleteResult<RecordType>
    }),

    deleteMany: vi.fn(async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: DeleteManyParams
    ): Promise<DeleteManyResult<RecordType>> => {
      if (delay) await wait(delay)

      const ids = params.ids.map(String)
      store[resource] = (store[resource] ?? []).filter((i) => !ids.includes(String(i['id'])))

      return {
        data: params.ids,
        ...responses.deleteMany,
      } as DeleteManyResult<RecordType>
    }),
  } as DataProvider

  return provider
}

/**
 * Creates a spy on all data provider methods
 * Useful for verifying calls in tests
 */
export function spyOnDataProvider(dataProvider: DataProvider) {
  return {
    getList: vi.spyOn(dataProvider, 'getList'),
    getOne: vi.spyOn(dataProvider, 'getOne'),
    getMany: vi.spyOn(dataProvider, 'getMany'),
    getManyReference: vi.spyOn(dataProvider, 'getManyReference'),
    create: vi.spyOn(dataProvider, 'create'),
    update: vi.spyOn(dataProvider, 'update'),
    updateMany: vi.spyOn(dataProvider, 'updateMany'),
    delete: vi.spyOn(dataProvider, 'delete'),
    deleteMany: vi.spyOn(dataProvider, 'deleteMany'),
  }
}
