/**
 * Mock DataProvider factory for testing
 * Provides a fully mockable data provider interface for admin components
 */

import { vi } from 'vitest'
import { applyFiltersWithOperators } from '../utils/filterOperators'

/**
 * Pagination parameters for list operations
 */
export interface PaginationParams {
  page: number
  perPage: number
}

/**
 * Sort parameters for list operations
 */
export interface SortParams {
  field: string
  order: 'ASC' | 'DESC'
}

/**
 * Filter parameters for list operations
 */
export interface FilterParams {
  [key: string]: unknown
}

/**
 * Parameters for getList operation
 */
export interface GetListParams {
  pagination: PaginationParams
  sort: SortParams
  filter: FilterParams
}

/**
 * Result of getList operation
 */
export interface GetListResult<T = Record<string, unknown>> {
  data: T[]
  total: number
  pageInfo?: {
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Parameters for getOne operation
 */
export interface GetOneParams {
  id: string | number
}

/**
 * Result of getOne operation
 */
export interface GetOneResult<T = Record<string, unknown>> {
  data: T
}

/**
 * Parameters for getMany operation
 */
export interface GetManyParams {
  ids: (string | number)[]
}

/**
 * Result of getMany operation
 */
export interface GetManyResult<T = Record<string, unknown>> {
  data: T[]
}

/**
 * Parameters for getManyReference operation
 */
export interface GetManyReferenceParams {
  target: string
  id: string | number
  pagination: PaginationParams
  sort: SortParams
  filter: FilterParams
}

/**
 * Result of getManyReference operation
 */
export interface GetManyReferenceResult<T = Record<string, unknown>> {
  data: T[]
  total: number
}

/**
 * Parameters for create operation
 */
export interface CreateParams<T = Record<string, unknown>> {
  data: T
}

/**
 * Result of create operation
 */
export interface CreateResult<T = Record<string, unknown>> {
  data: T
}

/**
 * Parameters for update operation
 */
export interface UpdateParams<T = Record<string, unknown>> {
  id: string | number
  data: T
  previousData: T
}

/**
 * Result of update operation
 */
export interface UpdateResult<T = Record<string, unknown>> {
  data: T
}

/**
 * Parameters for updateMany operation
 */
export interface UpdateManyParams<T = Record<string, unknown>> {
  ids: (string | number)[]
  data: T
}

/**
 * Result of updateMany operation
 */
export interface UpdateManyResult {
  data: (string | number)[]
}

/**
 * Parameters for delete operation
 */
export interface DeleteParams<T = Record<string, unknown>> {
  id: string | number
  previousData?: T
}

/**
 * Result of delete operation
 */
export interface DeleteResult<T = Record<string, unknown>> {
  data: T
}

/**
 * Parameters for deleteMany operation
 */
export interface DeleteManyParams {
  ids: (string | number)[]
}

/**
 * Result of deleteMany operation
 */
export interface DeleteManyResult {
  data: (string | number)[]
}

/**
 * DataProvider interface - main data fetching abstraction
 */
export interface DataProvider {
  getList: <T = Record<string, unknown>>(
    resource: string,
    params: GetListParams
  ) => Promise<GetListResult<T>>
  getOne: <T = Record<string, unknown>>(
    resource: string,
    params: GetOneParams
  ) => Promise<GetOneResult<T>>
  getMany: <T = Record<string, unknown>>(
    resource: string,
    params: GetManyParams
  ) => Promise<GetManyResult<T>>
  getManyReference: <T = Record<string, unknown>>(
    resource: string,
    params: GetManyReferenceParams
  ) => Promise<GetManyReferenceResult<T>>
  create: <T = Record<string, unknown>>(
    resource: string,
    params: CreateParams<T>
  ) => Promise<CreateResult<T>>
  update: <T = Record<string, unknown>>(
    resource: string,
    params: UpdateParams<T>
  ) => Promise<UpdateResult<T>>
  updateMany: <T = Record<string, unknown>>(
    resource: string,
    params: UpdateManyParams<T>
  ) => Promise<UpdateManyResult>
  delete: <T = Record<string, unknown>>(
    resource: string,
    params: DeleteParams<T>
  ) => Promise<DeleteResult<T>>
  deleteMany: (resource: string, params: DeleteManyParams) => Promise<DeleteManyResult>
}

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
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user' },
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

  const provider: DataProvider = {
    getList: vi.fn(async <T = Record<string, unknown>>(resource: string, params: GetListParams) => {
      if (delay) await wait(delay)

      const items = (store[resource] ?? []) as T[]
      const { page, perPage } = params.pagination
      const { field, order } = params.sort
      const { filter } = params

      // Apply filters with operator support
      let filtered = applyFiltersWithOperators(
        items as Record<string, unknown>[],
        filter
      ) as T[]

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
      } as GetListResult<T>
    }),

    getOne: vi.fn(async <T = Record<string, unknown>>(resource: string, params: GetOneParams) => {
      if (delay) await wait(delay)

      const items = store[resource] ?? []
      const item = items.find((i) => String(i['id']) === String(params.id))

      if (!item) {
        throw new Error(`Resource ${resource} with id ${params.id} not found`)
      }

      return {
        data: item as T,
        ...responses.getOne,
      } as GetOneResult<T>
    }),

    getMany: vi.fn(async <T = Record<string, unknown>>(resource: string, params: GetManyParams) => {
      if (delay) await wait(delay)

      const items = store[resource] ?? []
      const ids = params.ids.map(String)
      const found = items.filter((i) => ids.includes(String(i['id'])))

      return {
        data: found as T[],
        ...responses.getMany,
      } as GetManyResult<T>
    }),

    getManyReference: vi.fn(
      async <T = Record<string, unknown>>(resource: string, params: GetManyReferenceParams) => {
        if (delay) await wait(delay)

        const items = (store[resource] ?? []) as T[]
        const { target, id, pagination, sort, filter } = params

        // Filter by reference
        let filtered = items.filter((item) => {
          return String((item as Record<string, unknown>)[target]) === String(id)
        })

        // Apply additional filters with operator support
        filtered = applyFiltersWithOperators(
          filtered as Record<string, unknown>[],
          filter
        ) as T[]

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
        } as GetManyReferenceResult<T>
      }
    ),

    create: vi.fn(
      async <T = Record<string, unknown>>(resource: string, params: CreateParams<T>) => {
        if (delay) await wait(delay)

        const newId = getNextId(resource)
        const newItem = { ...params.data, id: newId } as T

        if (!store[resource]) {
          store[resource] = []
        }
        store[resource].push(newItem as Record<string, unknown>)

        return {
          data: newItem,
          ...responses.create,
        } as CreateResult<T>
      }
    ),

    update: vi.fn(
      async <T = Record<string, unknown>>(resource: string, params: UpdateParams<T>) => {
        if (delay) await wait(delay)

        const items = store[resource] ?? []
        const index = items.findIndex((i) => String(i['id']) === String(params.id))

        if (index === -1) {
          throw new Error(`Resource ${resource} with id ${params.id} not found`)
        }

        const updated = { ...items[index], ...params.data, id: params.id } as T
        store[resource]![index] = updated as Record<string, unknown>

        return {
          data: updated,
          ...responses.update,
        } as UpdateResult<T>
      }
    ),

    updateMany: vi.fn(
      async <T = Record<string, unknown>>(resource: string, params: UpdateManyParams<T>) => {
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
        } as UpdateManyResult
      }
    ),

    delete: vi.fn(
      async <T = Record<string, unknown>>(resource: string, params: DeleteParams<T>) => {
        if (delay) await wait(delay)

        const items = store[resource] ?? []
        const index = items.findIndex((i) => String(i['id']) === String(params.id))

        if (index === -1) {
          throw new Error(`Resource ${resource} with id ${params.id} not found`)
        }

        const deleted = items[index] as T
        store[resource]!.splice(index, 1)

        return {
          data: deleted,
          ...responses.delete,
        } as DeleteResult<T>
      }
    ),

    deleteMany: vi.fn(async (resource: string, params: DeleteManyParams) => {
      if (delay) await wait(delay)

      const ids = params.ids.map(String)
      store[resource] = (store[resource] ?? []).filter((i) => !ids.includes(String(i['id'])))

      return {
        data: params.ids,
        ...responses.deleteMany,
      } as DeleteManyResult
    }),
  }

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
