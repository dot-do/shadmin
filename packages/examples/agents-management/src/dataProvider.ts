/**
 * Mock Data Provider for AI Agents Management
 * Provides simulated data for agents, conversations, tools, and prompts
 */

import type { DataProvider, RaRecord, Identifier } from 'shadmin'

// Types for our domain models
export interface Agent extends RaRecord {
  id: Identifier
  name: string
  description: string
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  tools: Identifier[]
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  updatedAt: string
  conversationCount: number
  totalTokensUsed: number
}

export interface Conversation extends RaRecord {
  id: Identifier
  agentId: Identifier
  userId: string
  title: string
  status: 'active' | 'completed' | 'archived'
  messageCount: number
  tokensUsed: number
  startedAt: string
  lastMessageAt: string
  messages: Message[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  tokensUsed?: number
}

export interface Tool extends RaRecord {
  id: Identifier
  name: string
  description: string
  type: 'function' | 'retrieval' | 'code_interpreter'
  schema: string
  enabled: boolean
  createdAt: string
  usageCount: number
}

export interface Prompt extends RaRecord {
  id: Identifier
  name: string
  description: string
  content: string
  category: 'system' | 'user' | 'template'
  variables: string[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
  usageCount: number
}

// Mock data
const agents: Agent[] = [
  {
    id: 1,
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries and support tickets',
    model: 'claude-3-5-sonnet',
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: 'You are a helpful customer support agent. Be friendly, professional, and resolve issues efficiently.',
    tools: [1, 2],
    status: 'active',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-05T14:30:00Z',
    conversationCount: 1250,
    totalTokensUsed: 2500000,
  },
  {
    id: 2,
    name: 'Code Review Assistant',
    description: 'Reviews code and provides suggestions for improvement',
    model: 'claude-3-5-sonnet',
    temperature: 0.3,
    maxTokens: 8192,
    systemPrompt: 'You are a senior software engineer reviewing code. Focus on best practices, security, and performance.',
    tools: [3],
    status: 'active',
    createdAt: '2025-01-02T09:00:00Z',
    updatedAt: '2025-01-06T11:00:00Z',
    conversationCount: 450,
    totalTokensUsed: 1800000,
  },
  {
    id: 3,
    name: 'Sales Assistant',
    description: 'Helps with sales inquiries and product recommendations',
    model: 'claude-3-opus',
    temperature: 0.8,
    maxTokens: 4096,
    systemPrompt: 'You are a knowledgeable sales assistant. Help customers find the right products and answer their questions.',
    tools: [1, 4],
    status: 'active',
    createdAt: '2025-01-03T08:00:00Z',
    updatedAt: '2025-01-06T09:00:00Z',
    conversationCount: 890,
    totalTokensUsed: 1200000,
  },
  {
    id: 4,
    name: 'Documentation Writer',
    description: 'Generates and maintains technical documentation',
    model: 'claude-3-5-sonnet',
    temperature: 0.5,
    maxTokens: 16384,
    systemPrompt: 'You are a technical writer. Create clear, comprehensive documentation following best practices.',
    tools: [3],
    status: 'inactive',
    createdAt: '2025-01-04T12:00:00Z',
    updatedAt: '2025-01-04T12:00:00Z',
    conversationCount: 125,
    totalTokensUsed: 450000,
  },
  {
    id: 5,
    name: 'Data Analysis Agent',
    description: 'Analyzes data and generates insights',
    model: 'claude-3-opus',
    temperature: 0.2,
    maxTokens: 8192,
    systemPrompt: 'You are a data analyst. Provide accurate analysis and actionable insights from the data provided.',
    tools: [3, 5],
    status: 'draft',
    createdAt: '2025-01-05T15:00:00Z',
    updatedAt: '2025-01-05T15:00:00Z',
    conversationCount: 0,
    totalTokensUsed: 0,
  },
]

const conversations: Conversation[] = [
  {
    id: 1,
    agentId: 1,
    userId: 'user_123',
    title: 'Order Status Inquiry',
    status: 'completed',
    messageCount: 6,
    tokensUsed: 1250,
    startedAt: '2025-01-06T10:00:00Z',
    lastMessageAt: '2025-01-06T10:15:00Z',
    messages: [
      { id: 'm1', role: 'user', content: 'Hi, I need help with my order #12345', timestamp: '2025-01-06T10:00:00Z' },
      { id: 'm2', role: 'assistant', content: 'Hello! I would be happy to help you with your order #12345. Let me look that up for you.', timestamp: '2025-01-06T10:00:30Z', tokensUsed: 45 },
      { id: 'm3', role: 'user', content: 'It says it was shipped but I have not received it yet', timestamp: '2025-01-06T10:02:00Z' },
      { id: 'm4', role: 'assistant', content: 'I can see that your order was shipped on January 4th via Express Shipping. The tracking number is TRK789456. According to the carrier, it should arrive by tomorrow. Would you like me to send you the tracking link?', timestamp: '2025-01-06T10:02:45Z', tokensUsed: 85 },
      { id: 'm5', role: 'user', content: 'Yes please', timestamp: '2025-01-06T10:03:30Z' },
      { id: 'm6', role: 'assistant', content: 'I have sent the tracking link to your email. Is there anything else I can help you with today?', timestamp: '2025-01-06T10:04:00Z', tokensUsed: 35 },
    ],
  },
  {
    id: 2,
    agentId: 1,
    userId: 'user_456',
    title: 'Return Request',
    status: 'active',
    messageCount: 4,
    tokensUsed: 890,
    startedAt: '2025-01-06T11:30:00Z',
    lastMessageAt: '2025-01-06T11:45:00Z',
    messages: [
      { id: 'm1', role: 'user', content: 'I want to return a product I bought last week', timestamp: '2025-01-06T11:30:00Z' },
      { id: 'm2', role: 'assistant', content: 'I can help you with the return process. Could you please provide your order number and let me know which item you would like to return?', timestamp: '2025-01-06T11:30:45Z', tokensUsed: 50 },
      { id: 'm3', role: 'user', content: 'Order #67890, it is the blue wireless headphones', timestamp: '2025-01-06T11:32:00Z' },
      { id: 'm4', role: 'assistant', content: 'Thank you. I found your order for the Blue Wireless Headphones Pro. Since it is within our 30-day return window, you are eligible for a full refund. May I ask the reason for the return? This helps us improve our products.', timestamp: '2025-01-06T11:33:00Z', tokensUsed: 75 },
    ],
  },
  {
    id: 3,
    agentId: 2,
    userId: 'dev_789',
    title: 'React Component Review',
    status: 'completed',
    messageCount: 8,
    tokensUsed: 3200,
    startedAt: '2025-01-05T14:00:00Z',
    lastMessageAt: '2025-01-05T14:45:00Z',
    messages: [
      { id: 'm1', role: 'user', content: 'Can you review this React component for me?', timestamp: '2025-01-05T14:00:00Z' },
      { id: 'm2', role: 'assistant', content: 'Of course! Please share the code and I will provide a detailed review.', timestamp: '2025-01-05T14:00:30Z', tokensUsed: 25 },
      { id: 'm3', role: 'user', content: '```jsx\nfunction UserList({ users }) {\n  return users.map(user => <div>{user.name}</div>)\n}\n```', timestamp: '2025-01-05T14:02:00Z' },
      { id: 'm4', role: 'assistant', content: 'Here is my review of your UserList component:\n\n**Issues Found:**\n1. Missing key prop on mapped elements\n2. No null/undefined check for users array\n3. No TypeScript types\n\n**Suggested Improvements:**\n```jsx\nfunction UserList({ users = [] }) {\n  if (!users.length) return <div>No users found</div>;\n  return (\n    <ul>\n      {users.map(user => (\n        <li key={user.id}>{user.name}</li>\n      ))}\n    </ul>\n  );\n}\n```', timestamp: '2025-01-05T14:03:30Z', tokensUsed: 180 },
    ],
  },
  {
    id: 4,
    agentId: 3,
    userId: 'customer_001',
    title: 'Product Recommendation',
    status: 'completed',
    messageCount: 5,
    tokensUsed: 1100,
    startedAt: '2025-01-06T09:00:00Z',
    lastMessageAt: '2025-01-06T09:20:00Z',
    messages: [
      { id: 'm1', role: 'user', content: 'I am looking for a laptop for video editing', timestamp: '2025-01-06T09:00:00Z' },
      { id: 'm2', role: 'assistant', content: 'Great choice! For video editing, you will want a laptop with a powerful GPU, plenty of RAM, and a high-resolution display. What is your budget range?', timestamp: '2025-01-06T09:01:00Z', tokensUsed: 55 },
    ],
  },
  {
    id: 5,
    agentId: 1,
    userId: 'user_999',
    title: 'Billing Question',
    status: 'archived',
    messageCount: 3,
    tokensUsed: 650,
    startedAt: '2025-01-01T16:00:00Z',
    lastMessageAt: '2025-01-01T16:10:00Z',
    messages: [
      { id: 'm1', role: 'user', content: 'Why was I charged twice for my subscription?', timestamp: '2025-01-01T16:00:00Z' },
      { id: 'm2', role: 'assistant', content: 'I apologize for the confusion. Let me check your billing history right away.', timestamp: '2025-01-01T16:00:30Z', tokensUsed: 30 },
      { id: 'm3', role: 'assistant', content: 'I can see that the duplicate charge was an error on our end. I have initiated a refund for the extra charge, which should appear in your account within 3-5 business days. Is there anything else I can help you with?', timestamp: '2025-01-01T16:02:00Z', tokensUsed: 65 },
    ],
  },
]

const tools: Tool[] = [
  {
    id: 1,
    name: 'search_knowledge_base',
    description: 'Searches the company knowledge base for relevant information',
    type: 'retrieval',
    schema: JSON.stringify({
      type: 'function',
      function: {
        name: 'search_knowledge_base',
        description: 'Search the knowledge base for relevant articles',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
            limit: { type: 'number', description: 'Max results' },
          },
          required: ['query'],
        },
      },
    }, null, 2),
    enabled: true,
    createdAt: '2025-01-01T00:00:00Z',
    usageCount: 5420,
  },
  {
    id: 2,
    name: 'get_order_status',
    description: 'Retrieves the status of a customer order',
    type: 'function',
    schema: JSON.stringify({
      type: 'function',
      function: {
        name: 'get_order_status',
        description: 'Get the current status of an order',
        parameters: {
          type: 'object',
          properties: {
            orderId: { type: 'string', description: 'Order ID' },
          },
          required: ['orderId'],
        },
      },
    }, null, 2),
    enabled: true,
    createdAt: '2025-01-01T00:00:00Z',
    usageCount: 3250,
  },
  {
    id: 3,
    name: 'code_executor',
    description: 'Executes code snippets in a sandboxed environment',
    type: 'code_interpreter',
    schema: JSON.stringify({
      type: 'function',
      function: {
        name: 'code_executor',
        description: 'Execute code in a sandbox',
        parameters: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Code to execute' },
            language: { type: 'string', enum: ['python', 'javascript'] },
          },
          required: ['code', 'language'],
        },
      },
    }, null, 2),
    enabled: true,
    createdAt: '2025-01-02T00:00:00Z',
    usageCount: 1890,
  },
  {
    id: 4,
    name: 'get_product_catalog',
    description: 'Searches the product catalog for items',
    type: 'retrieval',
    schema: JSON.stringify({
      type: 'function',
      function: {
        name: 'get_product_catalog',
        description: 'Search products in the catalog',
        parameters: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'Product category' },
            priceMin: { type: 'number' },
            priceMax: { type: 'number' },
            query: { type: 'string' },
          },
        },
      },
    }, null, 2),
    enabled: true,
    createdAt: '2025-01-03T00:00:00Z',
    usageCount: 2100,
  },
  {
    id: 5,
    name: 'query_database',
    description: 'Executes read-only SQL queries against the data warehouse',
    type: 'function',
    schema: JSON.stringify({
      type: 'function',
      function: {
        name: 'query_database',
        description: 'Execute a read-only SQL query',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'SQL query' },
            database: { type: 'string', enum: ['analytics', 'reporting'] },
          },
          required: ['query', 'database'],
        },
      },
    }, null, 2),
    enabled: false,
    createdAt: '2025-01-04T00:00:00Z',
    usageCount: 450,
  },
]

const prompts: Prompt[] = [
  {
    id: 1,
    name: 'Customer Support System Prompt',
    description: 'Default system prompt for customer support agents',
    content: 'You are a helpful customer support agent for {{company_name}}. Your goals are:\n\n1. Be friendly and professional\n2. Resolve customer issues efficiently\n3. Escalate complex issues when needed\n4. Always verify customer identity before sharing sensitive information\n\nCurrent date: {{current_date}}',
    category: 'system',
    variables: ['company_name', 'current_date'],
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
    usageCount: 1250,
  },
  {
    id: 2,
    name: 'Code Review System Prompt',
    description: 'System prompt for code review assistant',
    content: 'You are a senior software engineer conducting code reviews. Focus on:\n\n1. Code quality and best practices\n2. Security vulnerabilities\n3. Performance optimizations\n4. Readability and maintainability\n\nProvide constructive feedback with specific suggestions for improvement.',
    category: 'system',
    variables: [],
    isDefault: true,
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    usageCount: 450,
  },
  {
    id: 3,
    name: 'Welcome Message Template',
    description: 'Template for greeting customers',
    content: 'Hello {{customer_name}}! Welcome to {{company_name}} support. How can I assist you today?',
    category: 'template',
    variables: ['customer_name', 'company_name'],
    isDefault: false,
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z',
    usageCount: 890,
  },
  {
    id: 4,
    name: 'Escalation Notice',
    description: 'Template for escalating issues to human agents',
    content: 'I understand this is a complex issue. Let me connect you with a specialist who can better assist you. Please hold while I transfer your conversation. Reference number: {{ticket_id}}',
    category: 'template',
    variables: ['ticket_id'],
    isDefault: false,
    createdAt: '2025-01-04T00:00:00Z',
    updatedAt: '2025-01-04T00:00:00Z',
    usageCount: 125,
  },
  {
    id: 5,
    name: 'Sales Inquiry Prompt',
    description: 'User prompt for handling sales inquiries',
    content: 'The customer is asking about: {{inquiry_topic}}\n\nRelevant product categories: {{categories}}\n\nPlease provide helpful product recommendations and answer their questions.',
    category: 'user',
    variables: ['inquiry_topic', 'categories'],
    isDefault: false,
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
    usageCount: 340,
  },
]

// Helper functions
function applyFilter<T extends RaRecord>(
  data: T[],
  filter: Record<string, unknown>
): T[] {
  return data.filter((item) => {
    return Object.entries(filter).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true
      const itemValue = (item as Record<string, unknown>)[key]
      if (typeof value === 'string') {
        return String(itemValue).toLowerCase().includes(value.toLowerCase())
      }
      return itemValue === value
    })
  })
}

function applySort<T extends RaRecord>(
  data: T[],
  sort: { field: string; order: 'ASC' | 'DESC' }
): T[] {
  return [...data].sort((a, b) => {
    const aValue = (a as Record<string, unknown>)[sort.field]
    const bValue = (b as Record<string, unknown>)[sort.field]

    if (aValue === bValue) return 0
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    const comparison = aValue < bValue ? -1 : 1
    return sort.order === 'ASC' ? comparison : -comparison
  })
}

function applyPagination<T>(
  data: T[],
  pagination: { page: number; perPage: number }
): T[] {
  const start = (pagination.page - 1) * pagination.perPage
  return data.slice(start, start + pagination.perPage)
}

// Data storage (mutable for CRUD operations)
const dataStore: Record<string, RaRecord[]> = {
  agents: [...agents],
  conversations: [...conversations],
  tools: [...tools],
  prompts: [...prompts],
}

let nextIds: Record<string, number> = {
  agents: 6,
  conversations: 6,
  tools: 6,
  prompts: 6,
}

// DataProvider implementation
export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const data = dataStore[resource] || []
    let result = [...data]

    if (params.filter) {
      result = applyFilter(result, params.filter)
    }

    if (params.sort) {
      result = applySort(result, params.sort)
    }

    const total = result.length

    if (params.pagination) {
      result = applyPagination(result, params.pagination)
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return { data: result, total }
  },

  getOne: async (resource, params) => {
    const data = dataStore[resource] || []
    const record = data.find((item) => item.id === params.id)

    if (!record) {
      throw new Error(`Record not found: ${resource}/${params.id}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 100))

    return { data: record }
  },

  getMany: async (resource, params) => {
    const data = dataStore[resource] || []
    const records = data.filter((item) => params.ids.includes(item.id))

    await new Promise((resolve) => setTimeout(resolve, 100))

    return { data: records }
  },

  getManyReference: async (resource, params) => {
    const data = dataStore[resource] || []
    let result = data.filter(
      (item) => (item as Record<string, unknown>)[params.target] === params.id
    )

    if (params.filter) {
      result = applyFilter(result, params.filter)
    }

    if (params.sort) {
      result = applySort(result, params.sort)
    }

    const total = result.length

    if (params.pagination) {
      result = applyPagination(result, params.pagination)
    }

    await new Promise((resolve) => setTimeout(resolve, 200))

    return { data: result, total }
  },

  create: async (resource, params) => {
    const id = nextIds[resource]++
    const newRecord = {
      ...params.data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as RaRecord

    dataStore[resource] = [...(dataStore[resource] || []), newRecord]

    await new Promise((resolve) => setTimeout(resolve, 200))

    return { data: newRecord }
  },

  update: async (resource, params) => {
    const data = dataStore[resource] || []
    const index = data.findIndex((item) => item.id === params.id)

    if (index === -1) {
      throw new Error(`Record not found: ${resource}/${params.id}`)
    }

    const updatedRecord = {
      ...data[index],
      ...params.data,
      id: params.id,
      updatedAt: new Date().toISOString(),
    } as RaRecord

    dataStore[resource] = [
      ...data.slice(0, index),
      updatedRecord,
      ...data.slice(index + 1),
    ]

    await new Promise((resolve) => setTimeout(resolve, 200))

    return { data: updatedRecord }
  },

  updateMany: async (resource, params) => {
    const data = dataStore[resource] || []
    const updatedIds: Identifier[] = []

    dataStore[resource] = data.map((item) => {
      if (params.ids.includes(item.id)) {
        updatedIds.push(item.id)
        return {
          ...item,
          ...params.data,
          updatedAt: new Date().toISOString(),
        }
      }
      return item
    })

    await new Promise((resolve) => setTimeout(resolve, 200))

    return { data: updatedIds }
  },

  delete: async (resource, params) => {
    const data = dataStore[resource] || []
    const record = data.find((item) => item.id === params.id)

    if (!record) {
      throw new Error(`Record not found: ${resource}/${params.id}`)
    }

    dataStore[resource] = data.filter((item) => item.id !== params.id)

    await new Promise((resolve) => setTimeout(resolve, 200))

    return { data: record }
  },

  deleteMany: async (resource, params) => {
    const data = dataStore[resource] || []
    const deletedIds = params.ids.filter((id) =>
      data.some((item) => item.id === id)
    )

    dataStore[resource] = data.filter((item) => !params.ids.includes(item.id))

    await new Promise((resolve) => setTimeout(resolve, 200))

    return { data: deletedIds }
  },
}

export default dataProvider
