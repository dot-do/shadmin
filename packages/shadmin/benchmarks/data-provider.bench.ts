/**
 * DataProvider Performance Benchmarks
 *
 * Measures DataProvider operation performance including:
 * - Request/response serialization
 * - Filter building
 * - Pagination logic
 * - Mock round-trip simulations
 */

import { describe, bench } from 'vitest'

import type {
  DataProvider,
  GetListParams,
  GetListResult,
  RaRecord,
  FilterPayload,
  SortPayload,
} from '../src/types/data-provider'

interface TestRecord extends RaRecord {
  id: number
  name: string
  email: string
  status: string
  createdAt: string
  updatedAt: string
  amount: number
  category: string
  tags: string[]
}

/**
 * Generate mock records
 */
function generateRecords(count: number): TestRecord[] {
  const statuses = ['active', 'inactive', 'pending', 'completed']
  const categories = ['A', 'B', 'C', 'D', 'E']
  const records: TestRecord[] = []

  for (let i = 0; i < count; i++) {
    records.push({
      id: i + 1,
      name: `Record ${i + 1}`,
      email: `record${i + 1}@example.com`,
      status: statuses[i % statuses.length] as string,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
      amount: Math.round(Math.random() * 10000 * 100) / 100,
      category: categories[i % categories.length] as string,
      tags: [`tag${i % 5}`, `tag${(i + 1) % 5}`],
    })
  }

  return records
}

// Pre-generate datasets
const dataset1000 = generateRecords(1000)
const dataset10000 = generateRecords(10000)

/**
 * Create a mock DataProvider for benchmarking
 */
function createMockDataProvider(data: TestRecord[]): DataProvider {
  return {
    getList: async (_resource, params) => {
      const { pagination, sort, filter } = params
      let filtered = [...data]

      // Apply filters
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Handle operator suffixes
            const [field, operator] = key.split('_')
            filtered = filtered.filter((record) => {
              const recordValue = (record as Record<string, unknown>)[field as string]

              switch (operator) {
                case 'gt':
                  return (recordValue as number) > (value as number)
                case 'gte':
                  return (recordValue as number) >= (value as number)
                case 'lt':
                  return (recordValue as number) < (value as number)
                case 'lte':
                  return (recordValue as number) <= (value as number)
                case 'contains':
                  return String(recordValue).includes(String(value))
                case 'in':
                  return Array.isArray(value) && value.includes(recordValue)
                default:
                  return recordValue === value
              }
            })
          }
        })
      }

      // Apply sorting
      if (sort?.field) {
        filtered.sort((a, b) => {
          const aVal = (a as Record<string, unknown>)[sort.field]
          const bVal = (b as Record<string, unknown>)[sort.field]
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
          return sort.order === 'ASC' ? comparison : -comparison
        })
      }

      // Apply pagination
      const start = (pagination.page - 1) * pagination.perPage
      const end = start + pagination.perPage
      const paginated = filtered.slice(start, end)

      return {
        data: paginated as TestRecord[],
        total: filtered.length,
      }
    },
    getOne: async (_resource, params) => {
      const record = data.find((r) => r.id === params.id)
      if (!record) throw new Error('Not found')
      return { data: record }
    },
    getMany: async (_resource, params) => {
      const records = data.filter((r) => params.ids.includes(r.id))
      return { data: records }
    },
    getManyReference: async (_resource, params) => {
      const filtered = data.filter((r) => (r as Record<string, unknown>)[params.target] === params.id)
      return { data: filtered, total: filtered.length }
    },
    create: async (_resource, params) => {
      const newRecord = { id: data.length + 1, ...params.data } as TestRecord
      return { data: newRecord }
    },
    update: async (_resource, params) => {
      const record = data.find((r) => r.id === params.id)
      if (!record) throw new Error('Not found')
      const updated = { ...record, ...params.data } as TestRecord
      return { data: updated }
    },
    updateMany: async (_resource, params) => {
      return { data: params.ids }
    },
    delete: async (_resource, params) => {
      const record = data.find((r) => r.id === params.id)
      return { data: record }
    },
    deleteMany: async (_resource, params) => {
      return { data: params.ids }
    },
  }
}

const provider1000 = createMockDataProvider(dataset1000)
const provider10000 = createMockDataProvider(dataset10000)

describe('DataProvider - getList Operations', () => {
  const defaultParams: GetListParams = {
    pagination: { page: 1, perPage: 25 },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
  }

  bench('getList - 1,000 records, no filter', async () => {
    await provider1000.getList('test', defaultParams)
  })

  bench('getList - 10,000 records, no filter', async () => {
    await provider10000.getList('test', defaultParams)
  })

  bench('getList - 1,000 records, simple filter', async () => {
    await provider1000.getList('test', {
      ...defaultParams,
      filter: { status: 'active' },
    })
  })

  bench('getList - 1,000 records, multiple filters', async () => {
    await provider1000.getList('test', {
      ...defaultParams,
      filter: {
        status: 'active',
        category: 'A',
        amount_gt: 1000,
      },
    })
  })

  bench('getList - 10,000 records, complex filter', async () => {
    await provider10000.getList('test', {
      ...defaultParams,
      filter: {
        status_in: ['active', 'pending'],
        amount_gte: 500,
        amount_lte: 5000,
        name_contains: 'Record',
      },
    })
  })

  bench('getList - sorting DESC', async () => {
    await provider1000.getList('test', {
      ...defaultParams,
      sort: { field: 'amount', order: 'DESC' },
    })
  })

  bench('getList - large page size (100)', async () => {
    await provider1000.getList('test', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
  })
})

describe('DataProvider - getOne/getMany Operations', () => {
  bench('getOne - lookup by ID', async () => {
    await provider1000.getOne('test', { id: 500 })
  })

  bench('getMany - 10 IDs', async () => {
    await provider1000.getMany('test', { ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] })
  })

  bench('getMany - 100 IDs', async () => {
    const ids = Array.from({ length: 100 }, (_, i) => i + 1)
    await provider1000.getMany('test', { ids })
  })
})

describe('DataProvider - Filter Building', () => {
  bench('build simple filter object', () => {
    const filter: FilterPayload = {
      status: 'active',
      category: 'A',
    }
    return filter
  })

  bench('build filter with operators', () => {
    const filter: FilterPayload = {
      status_in: ['active', 'pending'],
      amount_gte: 1000,
      amount_lte: 5000,
      name_contains: 'test',
      createdAt_gt: '2024-01-01',
    }
    return filter
  })

  bench('serialize filter to query string', () => {
    const filter = {
      status: 'active',
      category: 'A',
      amount_gte: 1000,
      tags: ['tag1', 'tag2'],
    }
    const params = new URLSearchParams()
    Object.entries(filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(`${key}[]`, String(v)))
      } else {
        params.append(key, String(value))
      }
    })
    return params.toString()
  })

  bench('parse query string to filter', () => {
    const queryString = 'status=active&category=A&amount_gte=1000&tags[]=tag1&tags[]=tag2'
    const params = new URLSearchParams(queryString)
    const filter: Record<string, unknown> = {}

    params.forEach((value, key) => {
      if (key.endsWith('[]')) {
        const baseKey = key.slice(0, -2)
        if (!filter[baseKey]) {
          filter[baseKey] = []
        }
        (filter[baseKey] as unknown[]).push(value)
      } else {
        filter[key] = value
      }
    })
    return filter
  })
})

describe('DataProvider - Pagination Calculation', () => {
  bench('calculate pagination info - simple', () => {
    const total = 1000
    const page = 5
    const perPage = 25

    const totalPages = Math.ceil(total / perPage)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1
    const start = (page - 1) * perPage + 1
    const end = Math.min(page * perPage, total)

    return { totalPages, hasNextPage, hasPreviousPage, start, end }
  })

  bench('calculate page numbers array', () => {
    const total = 10000
    const page = 50
    const perPage = 25
    const windowSize = 5

    const totalPages = Math.ceil(total / perPage)
    const halfWindow = Math.floor(windowSize / 2)
    let start = Math.max(1, page - halfWindow)
    const end = Math.min(totalPages, start + windowSize - 1)
    start = Math.max(1, end - windowSize + 1)

    const pages: number[] = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  })
})

describe('DataProvider - Response Processing', () => {
  const mockResponse = {
    data: dataset1000.slice(0, 25),
    total: 1000,
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
    },
  }

  bench('clone response data', () => {
    const cloned = {
      ...mockResponse,
      data: [...mockResponse.data],
    }
    return cloned
  })

  bench('deep clone response (JSON)', () => {
    const cloned = JSON.parse(JSON.stringify(mockResponse))
    return cloned
  })

  bench('transform response records', () => {
    const transformed = mockResponse.data.map((record) => ({
      ...record,
      displayName: `${record.name} (${record.email})`,
      formattedAmount: `$${record.amount.toFixed(2)}`,
    }))
    return transformed
  })

  bench('index records by ID', () => {
    const indexed = new Map<number, TestRecord>()
    for (const record of mockResponse.data) {
      indexed.set(record.id, record)
    }
    return indexed
  })
})

describe('DataProvider - Simulated Network Latency', () => {
  // These benchmarks include artificial delays to simulate real network conditions

  const simulateLatency = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  bench('simulated 10ms latency', async () => {
    await simulateLatency(10)
    return provider1000.getList('test', {
      pagination: { page: 1, perPage: 25 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
  }, { time: 5000 })

  bench('simulated 50ms latency', async () => {
    await simulateLatency(50)
    return provider1000.getList('test', {
      pagination: { page: 1, perPage: 25 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
  }, { time: 5000 })
})
