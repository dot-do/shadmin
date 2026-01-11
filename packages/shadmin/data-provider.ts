import { DataProvider } from 'shadmin'

// Simple in-memory data provider for demo
const data: Record<string, any[]> = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com.ai' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com.ai' },
  ],
}

export const dataProvider: DataProvider = {
  getList: async (resource, _params) => {
    const items = data[resource] || []
    return { data: items, total: items.length }
  },
  getOne: async (resource, params) => {
    const item = (data[resource] || []).find(i => i.id === params.id)
    return { data: item }
  },
  getMany: async (resource, params) => {
    const items = (data[resource] || []).filter(i => params.ids.includes(i.id))
    return { data: items }
  },
  getManyReference: async (resource, params) => {
    const items = (data[resource] || []).filter(i => i[params.target] === params.id)
    return { data: items, total: items.length }
  },
  create: async (resource, params) => {
    const newItem = { ...params.data, id: Date.now() }
    data[resource] = [...(data[resource] || []), newItem]
    return { data: newItem }
  },
  update: async (resource, params) => {
    data[resource] = (data[resource] || []).map(i =>
      i.id === params.id ? { ...i, ...params.data } : i
    )
    return { data: { ...params.previousData, ...params.data } }
  },
  updateMany: async (resource, params) => {
    data[resource] = (data[resource] || []).map(i =>
      params.ids.includes(i.id) ? { ...i, ...params.data } : i
    )
    return { data: params.ids }
  },
  delete: async (resource, params) => {
    const deleted = (data[resource] || []).find(i => i.id === params.id)
    data[resource] = (data[resource] || []).filter(i => i.id !== params.id)
    return { data: deleted }
  },
  deleteMany: async (resource, params) => {
    data[resource] = (data[resource] || []).filter(i => !params.ids.includes(i.id))
    return { data: params.ids }
  },
}
