import type { DataProvider } from 'shadmin'

// Types for our resources - with index signatures for RaRecord compatibility
export interface ApiKey {
  id: string
  name: string
  key: string
  prefix: string
  scopes: string[]
  lastUsed: string | null
  createdAt: string
  expiresAt: string | null
  status: 'active' | 'revoked' | 'expired'
  rateLimit: number
  requestCount: number
  [key: string]: unknown
}

export interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  secret: string
  status: 'active' | 'paused' | 'failed'
  createdAt: string
  lastTriggered: string | null
  successRate: number
  failureCount: number
  [key: string]: unknown
}

export interface Log {
  id: string
  timestamp: string
  method: string
  endpoint: string
  statusCode: number
  responseTime: number
  apiKeyId: string
  apiKeyName: string
  requestBody: string | null
  responseBody: string | null
  ip: string
  userAgent: string
  error: string | null
  [key: string]: unknown
}

export interface UsageRecord {
  id: string
  date: string
  apiKeyId: string
  apiKeyName: string
  endpoint: string
  requestCount: number
  successCount: number
  errorCount: number
  avgResponseTime: number
  bandwidthMB: number
  [key: string]: unknown
}

// Mock data
const generateApiKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'sk_live_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const generateSecret = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'whsec_'
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk_live_' + 'x'.repeat(32),
    prefix: 'sk_live_xxxx',
    scopes: ['read', 'write', 'delete'],
    lastUsed: '2026-01-06T10:30:00Z',
    createdAt: '2025-06-15T09:00:00Z',
    expiresAt: null,
    status: 'active',
    rateLimit: 10000,
    requestCount: 1543298,
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'sk_test_' + 'y'.repeat(32),
    prefix: 'sk_test_yyyy',
    scopes: ['read', 'write'],
    lastUsed: '2026-01-05T14:22:00Z',
    createdAt: '2025-08-20T11:00:00Z',
    expiresAt: '2026-08-20T11:00:00Z',
    status: 'active',
    rateLimit: 1000,
    requestCount: 52431,
  },
  {
    id: '3',
    name: 'CI/CD Pipeline Key',
    key: 'sk_test_' + 'z'.repeat(32),
    prefix: 'sk_test_zzzz',
    scopes: ['read'],
    lastUsed: '2026-01-04T08:15:00Z',
    createdAt: '2025-11-10T16:00:00Z',
    expiresAt: '2026-02-10T16:00:00Z',
    status: 'active',
    rateLimit: 5000,
    requestCount: 98234,
  },
  {
    id: '4',
    name: 'Legacy Integration',
    key: 'sk_live_' + 'a'.repeat(32),
    prefix: 'sk_live_aaaa',
    scopes: ['read', 'write'],
    lastUsed: '2025-12-01T12:00:00Z',
    createdAt: '2024-03-01T09:00:00Z',
    expiresAt: '2025-12-31T23:59:59Z',
    status: 'expired',
    rateLimit: 2000,
    requestCount: 892341,
  },
  {
    id: '5',
    name: 'Revoked Test Key',
    key: 'sk_test_' + 'b'.repeat(32),
    prefix: 'sk_test_bbbb',
    scopes: ['read'],
    lastUsed: '2025-10-15T09:30:00Z',
    createdAt: '2025-09-01T10:00:00Z',
    expiresAt: null,
    status: 'revoked',
    rateLimit: 1000,
    requestCount: 12543,
  },
]

const mockWebhooks: Webhook[] = [
  {
    id: '1',
    name: 'Order Created',
    url: 'https://api.myapp.com/webhooks/orders',
    events: ['order.created', 'order.updated', 'order.completed'],
    secret: generateSecret(),
    status: 'active',
    createdAt: '2025-07-01T10:00:00Z',
    lastTriggered: '2026-01-06T10:45:00Z',
    successRate: 99.8,
    failureCount: 3,
  },
  {
    id: '2',
    name: 'User Events',
    url: 'https://api.myapp.com/webhooks/users',
    events: ['user.created', 'user.updated', 'user.deleted'],
    secret: generateSecret(),
    status: 'active',
    createdAt: '2025-08-15T14:00:00Z',
    lastTriggered: '2026-01-06T09:30:00Z',
    successRate: 100,
    failureCount: 0,
  },
  {
    id: '3',
    name: 'Payment Notifications',
    url: 'https://payments.example.com/hooks/receive',
    events: ['payment.succeeded', 'payment.failed', 'refund.created'],
    secret: generateSecret(),
    status: 'failed',
    createdAt: '2025-09-20T08:00:00Z',
    lastTriggered: '2026-01-05T16:20:00Z',
    successRate: 85.2,
    failureCount: 47,
  },
  {
    id: '4',
    name: 'Analytics Pipeline',
    url: 'https://analytics.internal/ingest',
    events: ['event.*'],
    secret: generateSecret(),
    status: 'paused',
    createdAt: '2025-10-05T12:00:00Z',
    lastTriggered: '2025-12-15T18:00:00Z',
    successRate: 97.5,
    failureCount: 12,
  },
]

const mockLogs: Log[] = Array.from({ length: 100 }, (_, i) => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  const endpoints = ['/api/v1/users', '/api/v1/orders', '/api/v1/products', '/api/v1/payments', '/api/v1/webhooks']
  const statusCodes = [200, 201, 400, 401, 403, 404, 500]
  const apiKeys = mockApiKeys.filter(k => k.status === 'active')
  const selectedKey = apiKeys[Math.floor(Math.random() * apiKeys.length)]
  const statusCode = statusCodes[Math.floor(Math.random() * (statusCodes.length - 1))] // Mostly success

  return {
    id: String(i + 1),
    timestamp: new Date(Date.now() - i * 60000 * Math.random() * 10).toISOString(),
    method: methods[Math.floor(Math.random() * methods.length)],
    endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
    statusCode,
    responseTime: Math.floor(Math.random() * 500) + 20,
    apiKeyId: selectedKey.id,
    apiKeyName: selectedKey.name,
    requestBody: Math.random() > 0.5 ? '{"data": "sample request"}' : null,
    responseBody: '{"success": true, "data": {...}}',
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 (compatible; MyApp/1.0)',
    error: statusCode >= 400 ? `Error ${statusCode}: ${statusCode === 400 ? 'Bad Request' : statusCode === 401 ? 'Unauthorized' : statusCode === 403 ? 'Forbidden' : statusCode === 404 ? 'Not Found' : 'Internal Server Error'}` : null,
  }
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

const mockUsage: UsageRecord[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - i)
  const apiKeys = mockApiKeys.filter(k => k.status === 'active')
  const records: UsageRecord[] = []

  apiKeys.forEach((key, keyIndex) => {
    const requestCount = Math.floor(Math.random() * 10000) + 1000
    const errorCount = Math.floor(requestCount * (Math.random() * 0.05))
    records.push({
      id: `${i}-${keyIndex}`,
      date: date.toISOString().split('T')[0],
      apiKeyId: key.id,
      apiKeyName: key.name,
      endpoint: '/api/v1/*',
      requestCount,
      successCount: requestCount - errorCount,
      errorCount,
      avgResponseTime: Math.floor(Math.random() * 200) + 50,
      bandwidthMB: Math.floor(Math.random() * 500) + 50,
    })
  })

  return records
}).flat()

// In-memory storage
let apiKeys = [...mockApiKeys]
let webhooks = [...mockWebhooks]
const logs = [...mockLogs]
const usage = [...mockUsage]

// Helper functions
function applyPagination<T>(data: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage
  return data.slice(start, start + perPage)
}

function applySorting<T>(data: T[], field: string, order: 'ASC' | 'DESC'): T[] {
  return [...data].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[field]
    const bVal = (b as Record<string, unknown>)[field]

    if (aVal === null || aVal === undefined) return order === 'ASC' ? 1 : -1
    if (bVal === null || bVal === undefined) return order === 'ASC' ? -1 : 1

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'ASC' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    if (aVal < bVal) return order === 'ASC' ? -1 : 1
    if (aVal > bVal) return order === 'ASC' ? 1 : -1
    return 0
  })
}

function applyFilter<T>(data: T[], filter: Record<string, unknown>): T[] {
  if (Object.keys(filter).length === 0) return data

  return data.filter(item => {
    return Object.entries(filter).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true

      const itemValue = (item as Record<string, unknown>)[key]

      if (typeof value === 'string' && typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase())
      }

      return itemValue === value
    })
  })
}

// DataProvider implementation
export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination ?? {}
    const { field = 'id', order = 'ASC' } = params.sort ?? {}
    const filter = params.filter

    let data: unknown[]

    switch (resource) {
      case 'api-keys':
        data = apiKeys
        break
      case 'webhooks':
        data = webhooks
        break
      case 'logs':
        data = logs
        break
      case 'usage':
        data = usage
        break
      default:
        throw new Error(`Unknown resource: ${resource}`)
    }

    // Apply filter, sort, and pagination
    let result = applyFilter(data, filter)
    result = applySorting(result, field, order)
    const total = result.length
    result = applyPagination(result, page, perPage)

    return { data: result as never[], total }
  },

  getOne: async (resource, params) => {
    let data: unknown

    switch (resource) {
      case 'api-keys':
        data = apiKeys.find(item => item.id === String(params.id))
        break
      case 'webhooks':
        data = webhooks.find(item => item.id === String(params.id))
        break
      case 'logs':
        data = logs.find(item => item.id === String(params.id))
        break
      case 'usage':
        data = usage.find(item => item.id === String(params.id))
        break
      default:
        throw new Error(`Unknown resource: ${resource}`)
    }

    if (!data) {
      throw new Error(`${resource} not found`)
    }

    return { data: data as never }
  },

  getMany: async (resource, params) => {
    let data: unknown[]

    switch (resource) {
      case 'api-keys':
        data = apiKeys.filter(item => params.ids.includes(item.id))
        break
      case 'webhooks':
        data = webhooks.filter(item => params.ids.includes(item.id))
        break
      case 'logs':
        data = logs.filter(item => params.ids.includes(item.id))
        break
      case 'usage':
        data = usage.filter(item => params.ids.includes(item.id))
        break
      default:
        throw new Error(`Unknown resource: ${resource}`)
    }

    return { data: data as never[] }
  },

  getManyReference: async (resource, params) => {
    const { target, id } = params
    const { page, perPage } = params.pagination
    const { field, order } = params.sort

    let data: unknown[]

    switch (resource) {
      case 'api-keys':
        data = apiKeys.filter(item => (item as Record<string, unknown>)[target] === id)
        break
      case 'webhooks':
        data = webhooks.filter(item => (item as Record<string, unknown>)[target] === id)
        break
      case 'logs':
        data = logs.filter(item => (item as Record<string, unknown>)[target] === id)
        break
      case 'usage':
        data = usage.filter(item => (item as Record<string, unknown>)[target] === id)
        break
      default:
        throw new Error(`Unknown resource: ${resource}`)
    }

    let result = applySorting(data, field, order)
    const total = result.length
    result = applyPagination(result, page, perPage)

    return { data: result as never[], total }
  },

  create: async (resource, params) => {
    const newId = String(Date.now())

    switch (resource) {
      case 'api-keys': {
        const newKey: ApiKey = {
          id: newId,
          name: params.data.name as string,
          key: generateApiKey(),
          prefix: 'sk_live_xxxx',
          scopes: params.data.scopes as string[] || ['read'],
          lastUsed: null,
          createdAt: new Date().toISOString(),
          expiresAt: params.data.expiresAt as string | null || null,
          status: 'active',
          rateLimit: params.data.rateLimit as number || 1000,
          requestCount: 0,
        }
        apiKeys = [...apiKeys, newKey]
        return { data: newKey as never }
      }
      case 'webhooks': {
        const newWebhook: Webhook = {
          id: newId,
          name: params.data.name as string,
          url: params.data.url as string,
          events: params.data.events as string[] || [],
          secret: generateSecret(),
          status: 'active',
          createdAt: new Date().toISOString(),
          lastTriggered: null,
          successRate: 100,
          failureCount: 0,
        }
        webhooks = [...webhooks, newWebhook]
        return { data: newWebhook as never }
      }
      default:
        throw new Error(`Cannot create ${resource}`)
    }
  },

  update: async (resource, params) => {
    switch (resource) {
      case 'api-keys': {
        const index = apiKeys.findIndex(item => item.id === String(params.id))
        if (index === -1) throw new Error('API key not found')

        const updated = { ...apiKeys[index], ...params.data, id: String(params.id) } as ApiKey
        apiKeys = [...apiKeys.slice(0, index), updated, ...apiKeys.slice(index + 1)]
        return { data: updated as never }
      }
      case 'webhooks': {
        const index = webhooks.findIndex(item => item.id === String(params.id))
        if (index === -1) throw new Error('Webhook not found')

        const updated = { ...webhooks[index], ...params.data, id: String(params.id) } as Webhook
        webhooks = [...webhooks.slice(0, index), updated, ...webhooks.slice(index + 1)]
        return { data: updated as never }
      }
      default:
        throw new Error(`Cannot update ${resource}`)
    }
  },

  updateMany: async (resource, params) => {
    const updatedIds: string[] = []

    switch (resource) {
      case 'api-keys': {
        params.ids.forEach(id => {
          const index = apiKeys.findIndex(item => item.id === String(id))
          if (index !== -1) {
            apiKeys[index] = { ...apiKeys[index], ...params.data } as ApiKey
            updatedIds.push(String(id))
          }
        })
        break
      }
      case 'webhooks': {
        params.ids.forEach(id => {
          const index = webhooks.findIndex(item => item.id === String(id))
          if (index !== -1) {
            webhooks[index] = { ...webhooks[index], ...params.data } as Webhook
            updatedIds.push(String(id))
          }
        })
        break
      }
      default:
        throw new Error(`Cannot updateMany ${resource}`)
    }

    return { data: updatedIds }
  },

  delete: async (resource, params) => {
    switch (resource) {
      case 'api-keys': {
        const item = apiKeys.find(k => k.id === String(params.id))
        apiKeys = apiKeys.filter(k => k.id !== String(params.id))
        return { data: item as never }
      }
      case 'webhooks': {
        const item = webhooks.find(w => w.id === String(params.id))
        webhooks = webhooks.filter(w => w.id !== String(params.id))
        return { data: item as never }
      }
      default:
        throw new Error(`Cannot delete ${resource}`)
    }
  },

  deleteMany: async (resource, params) => {
    const deletedIds = params.ids.map(String)

    switch (resource) {
      case 'api-keys':
        apiKeys = apiKeys.filter(k => !deletedIds.includes(k.id))
        break
      case 'webhooks':
        webhooks = webhooks.filter(w => !deletedIds.includes(w.id))
        break
      default:
        throw new Error(`Cannot deleteMany ${resource}`)
    }

    return { data: deletedIds }
  },
}
