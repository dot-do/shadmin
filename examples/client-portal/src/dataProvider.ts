import type {
  DataProvider,
  GetListParams,
  GetOneParams,
  GetManyParams,
  GetManyReferenceParams,
  CreateParams,
  UpdateParams,
  UpdateManyParams,
  DeleteParams,
  DeleteManyParams,
  RaRecord,
  Identifier,
} from 'shadmin'

/**
 * Client Portal Data Provider
 *
 * Mock data provider demonstrating client-facing data:
 * - Projects: Client's active and completed projects
 * - Tickets: Support tickets and requests
 * - Documents: Shared files and documents
 */

// Types for client portal resources
export interface Project extends RaRecord {
  name: string
  description: string
  status: 'planning' | 'in_progress' | 'review' | 'completed'
  progress: number
  startDate: string
  dueDate: string
  clientId: string
  budget: number
  spent: number
  manager: string
  tasks: { total: number; completed: number }
}

export interface Ticket extends RaRecord {
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'waiting_client' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'technical' | 'billing' | 'general' | 'feature_request'
  createdAt: string
  updatedAt: string
  clientId: string
  assignedTo: string | null
  messages: number
}

export interface Document extends RaRecord {
  name: string
  type: 'contract' | 'invoice' | 'report' | 'deliverable' | 'other'
  fileType: 'pdf' | 'doc' | 'xls' | 'zip' | 'img'
  size: number
  uploadedAt: string
  uploadedBy: string
  projectId: string | null
  url: string
}

// Mock data storage
const mockData: {
  projects: Project[]
  tickets: Ticket[]
  documents: Document[]
} = {
  projects: [
    {
      id: 'proj-1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with new branding',
      status: 'in_progress',
      progress: 65,
      startDate: '2024-01-15',
      dueDate: '2024-04-30',
      clientId: 'client-1',
      budget: 25000,
      spent: 16250,
      manager: 'Alice Cooper',
      tasks: { total: 24, completed: 16 },
    },
    {
      id: 'proj-2',
      name: 'Mobile App Development',
      description: 'iOS and Android app for customer engagement',
      status: 'planning',
      progress: 15,
      startDate: '2024-03-01',
      dueDate: '2024-08-31',
      clientId: 'client-1',
      budget: 75000,
      spent: 11250,
      manager: 'Bob Wilson',
      tasks: { total: 48, completed: 7 },
    },
    {
      id: 'proj-3',
      name: 'SEO Campaign',
      description: 'Comprehensive SEO strategy and implementation',
      status: 'completed',
      progress: 100,
      startDate: '2023-10-01',
      dueDate: '2024-01-31',
      clientId: 'client-1',
      budget: 12000,
      spent: 11800,
      manager: 'Carol Davis',
      tasks: { total: 18, completed: 18 },
    },
    {
      id: 'proj-4',
      name: 'Brand Strategy',
      description: 'Comprehensive brand identity development',
      status: 'review',
      progress: 90,
      startDate: '2024-01-01',
      dueDate: '2024-03-15',
      clientId: 'client-2',
      budget: 35000,
      spent: 31500,
      manager: 'Diana Prince',
      tasks: { total: 15, completed: 14 },
    },
  ],
  tickets: [
    {
      id: 'ticket-1',
      subject: 'Homepage loading slowly',
      description: 'The homepage takes more than 5 seconds to load on mobile devices',
      status: 'in_progress',
      priority: 'high',
      category: 'technical',
      createdAt: '2024-02-15T10:30:00Z',
      updatedAt: '2024-02-16T14:22:00Z',
      clientId: 'client-1',
      assignedTo: 'tech-team',
      messages: 4,
    },
    {
      id: 'ticket-2',
      subject: 'Update contact information',
      description: 'Please update our phone number on the contact page',
      status: 'resolved',
      priority: 'low',
      category: 'general',
      createdAt: '2024-02-10T09:15:00Z',
      updatedAt: '2024-02-11T11:00:00Z',
      clientId: 'client-1',
      assignedTo: null,
      messages: 2,
    },
    {
      id: 'ticket-3',
      subject: 'Invoice discrepancy',
      description: 'The February invoice shows different hours than agreed',
      status: 'waiting_client',
      priority: 'medium',
      category: 'billing',
      createdAt: '2024-02-20T16:45:00Z',
      updatedAt: '2024-02-21T09:30:00Z',
      clientId: 'client-1',
      assignedTo: 'billing-team',
      messages: 3,
    },
    {
      id: 'ticket-4',
      subject: 'Request for dark mode feature',
      description: 'Would like to add dark mode support to the mobile app',
      status: 'open',
      priority: 'medium',
      category: 'feature_request',
      createdAt: '2024-02-22T08:00:00Z',
      updatedAt: '2024-02-22T08:00:00Z',
      clientId: 'client-1',
      assignedTo: null,
      messages: 1,
    },
    {
      id: 'ticket-5',
      subject: 'SSL Certificate renewal',
      description: 'Certificate expires next month, need renewal confirmation',
      status: 'open',
      priority: 'urgent',
      category: 'technical',
      createdAt: '2024-02-23T11:20:00Z',
      updatedAt: '2024-02-23T11:20:00Z',
      clientId: 'client-2',
      assignedTo: null,
      messages: 1,
    },
  ],
  documents: [
    {
      id: 'doc-1',
      name: 'Website Redesign - Contract',
      type: 'contract',
      fileType: 'pdf',
      size: 245000,
      uploadedAt: '2024-01-10T12:00:00Z',
      uploadedBy: 'system',
      projectId: 'proj-1',
      url: '/documents/contract-proj-1.pdf',
    },
    {
      id: 'doc-2',
      name: 'January 2024 Invoice',
      type: 'invoice',
      fileType: 'pdf',
      size: 128000,
      uploadedAt: '2024-02-01T10:00:00Z',
      uploadedBy: 'system',
      projectId: null,
      url: '/documents/invoice-jan-2024.pdf',
    },
    {
      id: 'doc-3',
      name: 'SEO Campaign - Final Report',
      type: 'report',
      fileType: 'pdf',
      size: 1560000,
      uploadedAt: '2024-02-05T15:30:00Z',
      uploadedBy: 'Carol Davis',
      projectId: 'proj-3',
      url: '/documents/seo-report-final.pdf',
    },
    {
      id: 'doc-4',
      name: 'Homepage Mockups v2',
      type: 'deliverable',
      fileType: 'zip',
      size: 8750000,
      uploadedAt: '2024-02-18T09:45:00Z',
      uploadedBy: 'Alice Cooper',
      projectId: 'proj-1',
      url: '/documents/homepage-mockups-v2.zip',
    },
    {
      id: 'doc-5',
      name: 'February 2024 Invoice',
      type: 'invoice',
      fileType: 'pdf',
      size: 135000,
      uploadedAt: '2024-03-01T10:00:00Z',
      uploadedBy: 'system',
      projectId: null,
      url: '/documents/invoice-feb-2024.pdf',
    },
    {
      id: 'doc-6',
      name: 'Mobile App Wireframes',
      type: 'deliverable',
      fileType: 'pdf',
      size: 3200000,
      uploadedAt: '2024-03-05T14:20:00Z',
      uploadedBy: 'Bob Wilson',
      projectId: 'proj-2',
      url: '/documents/mobile-wireframes.pdf',
    },
  ],
}

// Helper functions
function getNextId(resource: string): string {
  const prefix = resource.slice(0, -1)
  const items = mockData[resource as keyof typeof mockData] as RaRecord[]
  const maxId = items.reduce((max, item) => {
    const num = parseInt(String(item.id).split('-')[1] || '0', 10)
    return num > max ? num : max
  }, 0)
  return `${prefix}-${maxId + 1}`
}

function filterData<T extends RaRecord>(
  data: T[],
  filter: Record<string, unknown>
): T[] {
  return data.filter((item) => {
    return Object.entries(filter).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true

      const itemValue = item[key as keyof T]

      // Handle search/q filter
      if (key === 'q' && typeof value === 'string') {
        const searchValue = value.toLowerCase()
        return Object.values(item).some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(searchValue)
        )
      }

      // Handle array values (e.g., status in ['open', 'in_progress'])
      if (Array.isArray(value)) {
        return value.includes(itemValue)
      }

      return itemValue === value
    })
  })
}

function sortData<T extends RaRecord>(
  data: T[],
  field: string,
  order: 'ASC' | 'DESC'
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[field as keyof T]
    const bVal = b[field as keyof T]

    if (aVal === bVal) return 0
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    const comparison = aVal < bVal ? -1 : 1
    return order === 'ASC' ? comparison : -comparison
  })
}

function paginateData<T>(
  data: T[],
  page: number,
  perPage: number
): T[] {
  const start = (page - 1) * perPage
  return data.slice(start, start + perPage)
}

// Simulate network delay
const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const dataProvider: DataProvider = {
  getList: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetListParams
  ) => {
    await delay()

    const resourceData = mockData[resource as keyof typeof mockData] as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    let data = filterData(resourceData, params.filter)
    const total = data.length

    data = sortData(data, params.sort.field, params.sort.order)
    data = paginateData(data, params.pagination.page, params.pagination.perPage)

    return { data, total }
  },

  getOne: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetOneParams
  ) => {
    await delay()

    const resourceData = mockData[resource as keyof typeof mockData] as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const record = resourceData.find((item) => item.id === params.id)
    if (!record) {
      throw new Error(`Record not found: ${resource}/${params.id}`)
    }

    return { data: record }
  },

  getMany: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyParams
  ) => {
    await delay()

    const resourceData = mockData[resource as keyof typeof mockData] as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const data = resourceData.filter((item) => params.ids.includes(item.id))
    return { data }
  },

  getManyReference: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyReferenceParams
  ) => {
    await delay()

    const resourceData = mockData[resource as keyof typeof mockData] as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    let data = resourceData.filter(
      (item) => (item as Record<string, unknown>)[params.target] === params.id
    )

    data = filterData(data, params.filter)
    const total = data.length

    data = sortData(data, params.sort.field, params.sort.order)
    data = paginateData(data, params.pagination.page, params.pagination.perPage)

    return { data, total }
  },

  create: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: CreateParams
  ) => {
    await delay(300)

    const resourceData = mockData[resource as keyof typeof mockData] as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const newRecord = {
      ...params.data,
      id: getNextId(resource),
    } as RecordType

    resourceData.push(newRecord)
    return { data: newRecord }
  },

  update: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: UpdateParams
  ) => {
    await delay(300)

    const resourceData = mockData[resource as keyof typeof mockData] as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const index = resourceData.findIndex((item) => item.id === params.id)
    if (index === -1) {
      throw new Error(`Record not found: ${resource}/${params.id}`)
    }

    const updatedRecord = {
      ...resourceData[index],
      ...params.data,
      id: params.id,
    } as RecordType

    resourceData[index] = updatedRecord
    return { data: updatedRecord }
  },

  updateMany: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: UpdateManyParams
  ) => {
    await delay(300)

    const resourceData = mockData[resource as keyof typeof mockData] as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const updatedIds: Identifier[] = []

    params.ids.forEach((id) => {
      const index = resourceData.findIndex((item) => item.id === id)
      if (index !== -1) {
        resourceData[index] = { ...resourceData[index], ...params.data }
        updatedIds.push(id)
      }
    })

    return { data: updatedIds }
  },

  delete: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteParams
  ) => {
    await delay(300)

    const resourceData = mockData[resource as keyof typeof mockData] as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const index = resourceData.findIndex((item) => item.id === params.id)
    if (index === -1) {
      throw new Error(`Record not found: ${resource}/${params.id}`)
    }

    const [deletedRecord] = resourceData.splice(index, 1)
    return { data: deletedRecord }
  },

  deleteMany: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteManyParams
  ) => {
    await delay(300)

    const resourceData = mockData[resource as keyof typeof mockData] as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const deletedIds: Identifier[] = []

    params.ids.forEach((id) => {
      const index = resourceData.findIndex((item) => item.id === id)
      if (index !== -1) {
        resourceData.splice(index, 1)
        deletedIds.push(id)
      }
    })

    return { data: deletedIds }
  },
}
