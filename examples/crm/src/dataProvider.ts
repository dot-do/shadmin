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
  Identifier,
  RaRecord,
} from 'shadmin'

// Type definitions for CRM entities
export interface Contact extends RaRecord {
  id: Identifier
  firstName: string
  lastName: string
  email: string
  phone: string
  companyId: Identifier
  title: string
  status: 'active' | 'inactive' | 'lead'
  tags: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Company extends RaRecord {
  id: Identifier
  name: string
  industry: string
  website: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  size: 'small' | 'medium' | 'large' | 'enterprise'
  revenue: number
  status: 'active' | 'inactive' | 'prospect'
  createdAt: string
  updatedAt: string
}

export interface Deal extends RaRecord {
  id: Identifier
  title: string
  companyId: Identifier
  contactId: Identifier
  value: number
  currency: string
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  expectedCloseDate: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface Activity extends RaRecord {
  id: Identifier
  type: 'call' | 'email' | 'meeting' | 'task' | 'note'
  subject: string
  description: string
  contactId: Identifier
  companyId: Identifier
  dealId?: Identifier
  dueDate: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

// Mock data
const companies: Company[] = [
  {
    id: 1,
    name: 'Acme Corporation',
    industry: 'Technology',
    website: 'https://acme.example.com.ai',
    phone: '+1 (555) 100-1000',
    address: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    size: 'large',
    revenue: 50000000,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: 2,
    name: 'Globex Industries',
    industry: 'Manufacturing',
    website: 'https://globex.example.com.ai',
    phone: '+1 (555) 200-2000',
    address: '456 Industrial Ave',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    size: 'enterprise',
    revenue: 120000000,
    status: 'active',
    createdAt: '2023-08-22T09:15:00Z',
    updatedAt: '2024-07-10T11:45:00Z',
  },
  {
    id: 3,
    name: 'Initech Solutions',
    industry: 'Software',
    website: 'https://initech.example.com.ai',
    phone: '+1 (555) 300-3000',
    address: '789 Code Lane',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    size: 'medium',
    revenue: 15000000,
    status: 'active',
    createdAt: '2024-02-10T14:20:00Z',
    updatedAt: '2024-08-05T16:00:00Z',
  },
  {
    id: 4,
    name: 'Umbrella Corp',
    industry: 'Biotechnology',
    website: 'https://umbrella.example.com.ai',
    phone: '+1 (555) 400-4000',
    address: '321 Research Blvd',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    size: 'large',
    revenue: 75000000,
    status: 'prospect',
    createdAt: '2024-03-05T08:30:00Z',
    updatedAt: '2024-09-01T10:15:00Z',
  },
  {
    id: 5,
    name: 'Wayne Enterprises',
    industry: 'Conglomerate',
    website: 'https://wayne.example.com.ai',
    phone: '+1 (555) 500-5000',
    address: '1007 Mountain Drive',
    city: 'Gotham',
    state: 'NJ',
    country: 'USA',
    size: 'enterprise',
    revenue: 500000000,
    status: 'active',
    createdAt: '2022-11-01T12:00:00Z',
    updatedAt: '2024-10-15T09:30:00Z',
  },
]

const contacts: Contact[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@acme.example.com.ai',
    phone: '+1 (555) 101-1001',
    companyId: 1,
    title: 'VP of Engineering',
    status: 'active',
    tags: ['decision-maker', 'technical'],
    notes: 'Key contact for technical discussions',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-08-15T14:00:00Z',
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@globex.example.com.ai',
    phone: '+1 (555) 201-2001',
    companyId: 2,
    title: 'Procurement Manager',
    status: 'active',
    tags: ['decision-maker', 'procurement'],
    notes: 'Handles all vendor relationships',
    createdAt: '2023-09-10T11:30:00Z',
    updatedAt: '2024-07-22T16:45:00Z',
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@initech.example.com.ai',
    phone: '+1 (555) 301-3001',
    companyId: 3,
    title: 'CTO',
    status: 'active',
    tags: ['executive', 'technical', 'decision-maker'],
    notes: 'Final decision maker for tech purchases',
    createdAt: '2024-02-15T10:15:00Z',
    updatedAt: '2024-09-05T12:30:00Z',
  },
  {
    id: 4,
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@umbrella.example.com.ai',
    phone: '+1 (555) 401-4001',
    companyId: 4,
    title: 'Research Director',
    status: 'lead',
    tags: ['research', 'technical'],
    notes: 'Initial contact from conference',
    createdAt: '2024-03-10T15:00:00Z',
    updatedAt: '2024-09-20T09:00:00Z',
  },
  {
    id: 5,
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@wayne.example.com.ai',
    phone: '+1 (555) 501-5001',
    companyId: 5,
    title: 'CFO',
    status: 'active',
    tags: ['executive', 'finance', 'decision-maker'],
    notes: 'Oversees all major purchase decisions',
    createdAt: '2022-12-01T08:45:00Z',
    updatedAt: '2024-10-20T11:00:00Z',
  },
  {
    id: 6,
    firstName: 'Lisa',
    lastName: 'Martinez',
    email: 'lisa.martinez@acme.example.com.ai',
    phone: '+1 (555) 102-1002',
    companyId: 1,
    title: 'Project Manager',
    status: 'active',
    tags: ['operations', 'project-management'],
    notes: 'Day-to-day contact for implementations',
    createdAt: '2024-04-05T13:20:00Z',
    updatedAt: '2024-08-30T15:15:00Z',
  },
  {
    id: 7,
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@globex.example.com.ai',
    phone: '+1 (555) 202-2002',
    companyId: 2,
    title: 'IT Director',
    status: 'inactive',
    tags: ['technical', 'it'],
    notes: 'Left company - update contact',
    createdAt: '2023-10-15T09:30:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 8,
    firstName: 'Jennifer',
    lastName: 'Anderson',
    email: 'jennifer.anderson@wayne.example.com.ai',
    phone: '+1 (555) 502-5002',
    companyId: 5,
    title: 'VP of Operations',
    status: 'active',
    tags: ['executive', 'operations'],
    notes: 'Key stakeholder for enterprise deals',
    createdAt: '2023-05-20T14:00:00Z',
    updatedAt: '2024-11-01T09:45:00Z',
  },
]

const deals: Deal[] = [
  {
    id: 1,
    title: 'Acme Enterprise License',
    companyId: 1,
    contactId: 1,
    value: 150000,
    currency: 'USD',
    stage: 'negotiation',
    probability: 75,
    expectedCloseDate: '2025-02-28',
    description: 'Enterprise license renewal with expansion',
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-11-15T14:30:00Z',
  },
  {
    id: 2,
    title: 'Globex Manufacturing Suite',
    companyId: 2,
    contactId: 2,
    value: 280000,
    currency: 'USD',
    stage: 'proposal',
    probability: 50,
    expectedCloseDate: '2025-03-15',
    description: 'Full manufacturing suite implementation',
    createdAt: '2024-07-15T09:00:00Z',
    updatedAt: '2024-11-10T11:00:00Z',
  },
  {
    id: 3,
    title: 'Initech Cloud Migration',
    companyId: 3,
    contactId: 3,
    value: 75000,
    currency: 'USD',
    stage: 'qualification',
    probability: 30,
    expectedCloseDate: '2025-04-30',
    description: 'Cloud infrastructure migration project',
    createdAt: '2024-09-01T14:00:00Z',
    updatedAt: '2024-11-20T16:00:00Z',
  },
  {
    id: 4,
    title: 'Umbrella Research Platform',
    companyId: 4,
    contactId: 4,
    value: 450000,
    currency: 'USD',
    stage: 'prospecting',
    probability: 10,
    expectedCloseDate: '2025-06-30',
    description: 'Research data platform and analytics',
    createdAt: '2024-10-01T11:30:00Z',
    updatedAt: '2024-11-25T10:15:00Z',
  },
  {
    id: 5,
    title: 'Wayne Enterprise Agreement',
    companyId: 5,
    contactId: 5,
    value: 1200000,
    currency: 'USD',
    stage: 'closed_won',
    probability: 100,
    expectedCloseDate: '2024-10-31',
    description: 'Multi-year enterprise agreement',
    createdAt: '2024-03-15T08:00:00Z',
    updatedAt: '2024-10-31T17:00:00Z',
  },
  {
    id: 6,
    title: 'Acme Professional Services',
    companyId: 1,
    contactId: 6,
    value: 45000,
    currency: 'USD',
    stage: 'closed_lost',
    probability: 0,
    expectedCloseDate: '2024-09-30',
    description: 'Professional services engagement - lost to competitor',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-09-30T15:00:00Z',
  },
]

const activities: Activity[] = [
  {
    id: 1,
    type: 'meeting',
    subject: 'Q1 Planning Meeting',
    description: 'Quarterly planning session with Acme leadership',
    contactId: 1,
    companyId: 1,
    dealId: 1,
    dueDate: '2025-01-15T10:00:00Z',
    completed: false,
    priority: 'high',
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-11-20T11:00:00Z',
  },
  {
    id: 2,
    type: 'call',
    subject: 'Follow-up on proposal',
    description: 'Discuss proposal details and address concerns',
    contactId: 2,
    companyId: 2,
    dealId: 2,
    dueDate: '2025-01-10T14:00:00Z',
    completed: false,
    priority: 'high',
    createdAt: '2024-11-10T10:30:00Z',
    updatedAt: '2024-11-22T09:15:00Z',
  },
  {
    id: 3,
    type: 'email',
    subject: 'Send technical documentation',
    description: 'Email cloud migration technical specs to Michael',
    contactId: 3,
    companyId: 3,
    dealId: 3,
    dueDate: '2025-01-08T09:00:00Z',
    completed: false,
    priority: 'medium',
    createdAt: '2024-11-15T14:00:00Z',
    updatedAt: '2024-11-15T14:00:00Z',
  },
  {
    id: 4,
    type: 'task',
    subject: 'Prepare demo environment',
    description: 'Set up demo for Umbrella research platform showcase',
    contactId: 4,
    companyId: 4,
    dealId: 4,
    dueDate: '2025-01-20T12:00:00Z',
    completed: false,
    priority: 'medium',
    createdAt: '2024-11-18T11:00:00Z',
    updatedAt: '2024-11-24T15:30:00Z',
  },
  {
    id: 5,
    type: 'note',
    subject: 'Contract signed',
    description: 'Wayne Enterprise Agreement signed and fully executed',
    contactId: 5,
    companyId: 5,
    dealId: 5,
    dueDate: '2024-10-31T17:00:00Z',
    completed: true,
    priority: 'low',
    createdAt: '2024-10-31T17:00:00Z',
    updatedAt: '2024-10-31T17:00:00Z',
  },
  {
    id: 6,
    type: 'meeting',
    subject: 'Kickoff meeting',
    description: 'Project kickoff with Wayne team',
    contactId: 8,
    companyId: 5,
    dealId: 5,
    dueDate: '2024-11-15T09:00:00Z',
    completed: true,
    priority: 'high',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-15T12:00:00Z',
  },
  {
    id: 7,
    type: 'call',
    subject: 'Discovery call',
    description: 'Initial discovery call with Umbrella Corp',
    contactId: 4,
    companyId: 4,
    dueDate: '2024-11-05T15:00:00Z',
    completed: true,
    priority: 'medium',
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-11-05T16:30:00Z',
  },
  {
    id: 8,
    type: 'email',
    subject: 'Thank you note',
    description: 'Send thank you note after successful negotiation',
    contactId: 1,
    companyId: 1,
    dealId: 1,
    dueDate: '2025-01-05T10:00:00Z',
    completed: false,
    priority: 'low',
    createdAt: '2024-11-25T09:00:00Z',
    updatedAt: '2024-11-25T09:00:00Z',
  },
]

// Type for our mock database
type ResourceData = {
  contacts: Contact[]
  companies: Company[]
  deals: Deal[]
  activities: Activity[]
}

// Mock database
const db: ResourceData = {
  contacts: [...contacts],
  companies: [...companies],
  deals: [...deals],
  activities: [...activities],
}

// Helper function to get next ID
function getNextId(resource: keyof ResourceData): number {
  const items = db[resource]
  const maxId = items.reduce((max, item) => {
    const id = typeof item.id === 'number' ? item.id : parseInt(String(item.id), 10)
    return Math.max(max, id)
  }, 0)
  return maxId + 1
}

// Filter helper
function applyFilter<T extends RaRecord>(data: T[], filter: Record<string, unknown>): T[] {
  return data.filter((item) => {
    return Object.entries(filter).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true

      const itemValue = (item as Record<string, unknown>)[key]

      // Handle string search (case-insensitive contains)
      if (typeof value === 'string' && typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase())
      }

      // Handle array contains
      if (Array.isArray(itemValue) && typeof value === 'string') {
        return itemValue.some((v) => String(v).toLowerCase().includes(value.toLowerCase()))
      }

      // Handle exact match
      return itemValue === value
    })
  })
}

// Sort helper
function applySort<T extends RaRecord>(
  data: T[],
  field: string,
  order: 'ASC' | 'DESC'
): T[] {
  return [...data].sort((a, b) => {
    const aValue = (a as Record<string, unknown>)[field]
    const bValue = (b as Record<string, unknown>)[field]

    if (aValue === bValue) return 0

    let comparison = 0
    if (aValue == null) comparison = 1
    else if (bValue == null) comparison = -1
    else if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue)
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue
    } else {
      comparison = String(aValue).localeCompare(String(bValue))
    }

    return order === 'DESC' ? -comparison : comparison
  })
}

// Pagination helper
function applyPagination<T>(data: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage
  return data.slice(start, start + perPage)
}

// Simulate network delay
function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Create the mock data provider
export const dataProvider: DataProvider = {
  async getList<RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetListParams
  ): Promise<GetListResult<RecordType>> {
    await delay()

    const resourceData = db[resource as keyof ResourceData] as unknown as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    let filtered = applyFilter(resourceData, params.filter)
    const total = filtered.length
    const sorted = applySort(filtered, params.sort.field, params.sort.order)
    const paginated = applyPagination(sorted, params.pagination.page, params.pagination.perPage)

    return {
      data: paginated,
      total,
    }
  },

  async getOne<RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetOneParams
  ): Promise<GetOneResult<RecordType>> {
    await delay()

    const resourceData = db[resource as keyof ResourceData] as unknown as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const record = resourceData.find((item) => item.id === params.id)
    if (!record) {
      throw new Error(`Record not found: ${resource}/${params.id}`)
    }

    return { data: record }
  },

  async getMany<RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyParams
  ): Promise<GetManyResult<RecordType>> {
    await delay()

    const resourceData = db[resource as keyof ResourceData] as unknown as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const records = resourceData.filter((item) => params.ids.includes(item.id))

    return { data: records }
  },

  async getManyReference<RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyReferenceParams
  ): Promise<GetManyReferenceResult<RecordType>> {
    await delay()

    const resourceData = db[resource as keyof ResourceData] as unknown as RecordType[]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    // Filter by reference
    let filtered = resourceData.filter((item) => {
      const targetValue = (item as Record<string, unknown>)[params.target]
      return targetValue === params.id
    })

    // Apply additional filters
    filtered = applyFilter(filtered, params.filter)
    const total = filtered.length
    const sorted = applySort(filtered, params.sort.field, params.sort.order)
    const paginated = applyPagination(sorted, params.pagination.page, params.pagination.perPage)

    return {
      data: paginated,
      total,
    }
  },

  async create<RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: CreateParams
  ): Promise<CreateResult<RecordType>> {
    await delay()

    const resourceData = db[resource as keyof ResourceData]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const now = new Date().toISOString()
    const newRecord = {
      ...params.data,
      id: getNextId(resource as keyof ResourceData),
      createdAt: now,
      updatedAt: now,
    } as unknown as RecordType

    resourceData.push(newRecord as never)

    return { data: newRecord }
  },

  async update<RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: UpdateParams
  ): Promise<UpdateResult<RecordType>> {
    await delay()

    const resourceData = db[resource as keyof ResourceData]
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
      updatedAt: new Date().toISOString(),
    } as unknown as RecordType

    resourceData[index] = updatedRecord as never

    return { data: updatedRecord }
  },

  async updateMany<RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: UpdateManyParams
  ): Promise<UpdateManyResult<RecordType>> {
    await delay()

    const resourceData = db[resource as keyof ResourceData]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const updatedIds: Identifier[] = []
    const now = new Date().toISOString()

    params.ids.forEach((id) => {
      const index = resourceData.findIndex((item) => item.id === id)
      if (index !== -1) {
        resourceData[index] = {
          ...resourceData[index],
          ...params.data,
          id,
          updatedAt: now,
        } as never
        updatedIds.push(id)
      }
    })

    return { data: updatedIds }
  },

  async delete<RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteParams
  ): Promise<DeleteResult<RecordType>> {
    await delay()

    const resourceData = db[resource as keyof ResourceData]
    if (!resourceData) {
      throw new Error(`Unknown resource: ${resource}`)
    }

    const index = resourceData.findIndex((item) => item.id === params.id)
    if (index === -1) {
      throw new Error(`Record not found: ${resource}/${params.id}`)
    }

    const deleted = resourceData[index] as unknown as RecordType
    resourceData.splice(index, 1)

    return { data: deleted }
  },

  async deleteMany<RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteManyParams
  ): Promise<DeleteManyResult<RecordType>> {
    await delay()

    const resourceData = db[resource as keyof ResourceData]
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

// Export mock data for Dashboard metrics
export function getMetrics() {
  const openDeals = db.deals.filter(
    (d) => !['closed_won', 'closed_lost'].includes(d.stage)
  )
  const wonDeals = db.deals.filter((d) => d.stage === 'closed_won')
  const lostDeals = db.deals.filter((d) => d.stage === 'closed_lost')
  const pendingActivities = db.activities.filter((a) => !a.completed)

  return {
    totalContacts: db.contacts.length,
    activeContacts: db.contacts.filter((c) => c.status === 'active').length,
    totalCompanies: db.companies.length,
    activeCompanies: db.companies.filter((c) => c.status === 'active').length,
    totalDeals: db.deals.length,
    openDealsCount: openDeals.length,
    openDealsValue: openDeals.reduce((sum, d) => sum + d.value, 0),
    wonDealsCount: wonDeals.length,
    wonDealsValue: wonDeals.reduce((sum, d) => sum + d.value, 0),
    lostDealsCount: lostDeals.length,
    totalActivities: db.activities.length,
    pendingActivities: pendingActivities.length,
    highPriorityActivities: pendingActivities.filter((a) => a.priority === 'high').length,
    dealsByStage: {
      prospecting: db.deals.filter((d) => d.stage === 'prospecting').length,
      qualification: db.deals.filter((d) => d.stage === 'qualification').length,
      proposal: db.deals.filter((d) => d.stage === 'proposal').length,
      negotiation: db.deals.filter((d) => d.stage === 'negotiation').length,
      closed_won: wonDeals.length,
      closed_lost: lostDeals.length,
    },
    recentDeals: db.deals
      .filter((d) => !['closed_won', 'closed_lost'].includes(d.stage))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5),
    upcomingActivities: db.activities
      .filter((a) => !a.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5),
  }
}
