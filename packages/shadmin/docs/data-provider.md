# DataProvider Interface

The `DataProvider` is the core abstraction for all data fetching and mutation operations in Shadmin. It provides a unified interface for communicating with any backend (REST, GraphQL, custom APIs, etc.) and is 100% API-compatible with react-admin.

## Overview

The DataProvider interface defines 9 methods for CRUD operations:

| Method | Description |
|--------|-------------|
| `getList` | Fetch a list of records with pagination, sorting, and filtering |
| `getOne` | Fetch a single record by ID |
| `getMany` | Fetch multiple records by their IDs |
| `getManyReference` | Fetch records referencing another record |
| `create` | Create a new record |
| `update` | Update an existing record |
| `updateMany` | Update multiple records |
| `delete` | Delete a single record |
| `deleteMany` | Delete multiple records |

## Type Definitions

### Core Types

```typescript
type Identifier = string | number

type RaRecord<IdentifierType extends Identifier = Identifier> = {
  id: IdentifierType
  [key: string]: unknown
}
```

### DataProvider Interface

```typescript
interface DataProvider {
  getList: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetListParams
  ) => Promise<GetListResult<RecordType>>

  getOne: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetOneParams
  ) => Promise<GetOneResult<RecordType>>

  getMany: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyParams
  ) => Promise<GetManyResult<RecordType>>

  getManyReference: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyReferenceParams
  ) => Promise<GetManyReferenceResult<RecordType>>

  create: <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
    resource: string,
    params: CreateParams<TVariables>
  ) => Promise<CreateResult<RecordType>>

  update: <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
    resource: string,
    params: UpdateParams<TVariables>
  ) => Promise<UpdateResult<RecordType>>

  updateMany: <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
    resource: string,
    params: UpdateManyParams<TVariables>
  ) => Promise<UpdateManyResult<RecordType>>

  delete: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteParams<RecordType>
  ) => Promise<DeleteResult<RecordType>>

  deleteMany: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteManyParams
  ) => Promise<DeleteManyResult<RecordType>>
}
```

---

## Method Reference

### getList

Fetches a paginated, sorted, and filtered list of records.

#### Parameters

```typescript
interface GetListParams {
  pagination: { page: number; perPage: number }
  sort: { field: string; order: 'ASC' | 'DESC' }
  filter: Record<string, unknown>
  meta?: Record<string, unknown>
}
```

#### Response

```typescript
interface GetListResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[]
  total?: number
  pageInfo?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
  }
}
```

#### Example

```typescript
// Request
const result = await dataProvider.getList('posts', {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'DESC' },
  filter: { published: true, authorId: 5 }
})

// Response
{
  data: [
    { id: 1, title: 'Hello World', published: true, authorId: 5, createdAt: '2024-01-15' },
    { id: 2, title: 'Getting Started', published: true, authorId: 5, createdAt: '2024-01-10' },
    // ...
  ],
  total: 42,
  pageInfo: {
    hasNextPage: true,
    hasPreviousPage: false
  }
}
```

---

### getOne

Fetches a single record by its identifier.

#### Parameters

```typescript
interface GetOneParams {
  id: Identifier
  meta?: Record<string, unknown>
}
```

#### Response

```typescript
interface GetOneResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType
}
```

#### Example

```typescript
// Request
const result = await dataProvider.getOne('posts', { id: 123 })

// Response
{
  data: {
    id: 123,
    title: 'Hello World',
    content: 'This is my first post...',
    authorId: 5,
    published: true,
    createdAt: '2024-01-15'
  }
}
```

---

### getMany

Fetches multiple records by their IDs. Useful for resolving references.

#### Parameters

```typescript
interface GetManyParams {
  ids: Identifier[]
  meta?: Record<string, unknown>
}
```

#### Response

```typescript
interface GetManyResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[]
}
```

#### Example

```typescript
// Request
const result = await dataProvider.getMany('users', { ids: [1, 2, 3] })

// Response
{
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com.ai' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com.ai' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com.ai' }
  ]
}
```

---

### getManyReference

Fetches records that reference another record. Used for one-to-many relationships.

#### Parameters

```typescript
interface GetManyReferenceParams {
  target: string                              // The field that references the parent
  id: Identifier                              // The parent record's ID
  pagination: { page: number; perPage: number }
  sort: { field: string; order: 'ASC' | 'DESC' }
  filter: Record<string, unknown>
  meta?: Record<string, unknown>
}
```

#### Response

```typescript
interface GetManyReferenceResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType[]
  total?: number
  pageInfo?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
  }
}
```

#### Example

```typescript
// Request: Get all comments for post #123
const result = await dataProvider.getManyReference('comments', {
  target: 'postId',
  id: 123,
  pagination: { page: 1, perPage: 25 },
  sort: { field: 'createdAt', order: 'DESC' },
  filter: {}
})

// Response
{
  data: [
    { id: 1, body: 'Great post!', postId: 123, authorId: 2 },
    { id: 2, body: 'Thanks for sharing', postId: 123, authorId: 3 }
  ],
  total: 2
}
```

---

### create

Creates a new record.

#### Parameters

```typescript
interface CreateParams<T = Record<string, unknown>> {
  data: T
  meta?: Record<string, unknown>
}
```

#### Response

```typescript
interface CreateResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType  // The created record with its new ID
}
```

#### Example

```typescript
// Request
const result = await dataProvider.create('posts', {
  data: {
    title: 'New Post',
    content: 'This is the content...',
    authorId: 5,
    published: false
  }
})

// Response
{
  data: {
    id: 124,  // Generated by the backend
    title: 'New Post',
    content: 'This is the content...',
    authorId: 5,
    published: false,
    createdAt: '2024-01-20'
  }
}
```

---

### update

Updates an existing record.

#### Parameters

```typescript
interface UpdateParams<T = Record<string, unknown>> {
  id: Identifier
  data: T                    // The updated fields
  previousData?: T           // The record before update (for optimistic updates)
  meta?: Record<string, unknown>
}
```

#### Response

```typescript
interface UpdateResult<RecordType extends RaRecord = RaRecord> {
  data: RecordType  // The updated record
}
```

#### Example

```typescript
// Request
const result = await dataProvider.update('posts', {
  id: 123,
  data: {
    title: 'Updated Title',
    published: true
  },
  previousData: {
    id: 123,
    title: 'Old Title',
    published: false
  }
})

// Response
{
  data: {
    id: 123,
    title: 'Updated Title',
    content: 'This is my first post...',
    authorId: 5,
    published: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  }
}
```

---

### updateMany

Updates multiple records with the same data.

#### Parameters

```typescript
interface UpdateManyParams<T = Record<string, unknown>> {
  ids: Identifier[]
  data: T
  meta?: Record<string, unknown>
}
```

#### Response

```typescript
interface UpdateManyResult<RecordType extends RaRecord = RaRecord> {
  data?: RecordType['id'][]  // Array of updated record IDs
}
```

#### Example

```typescript
// Request: Publish multiple posts at once
const result = await dataProvider.updateMany('posts', {
  ids: [1, 2, 3],
  data: { published: true }
})

// Response
{
  data: [1, 2, 3]
}
```

---

### delete

Deletes a single record.

#### Parameters

```typescript
interface DeleteParams<RecordType extends RaRecord = RaRecord> {
  id: Identifier
  previousData?: RecordType  // For optimistic updates
  meta?: Record<string, unknown>
}
```

#### Response

```typescript
interface DeleteResult<RecordType extends RaRecord = RaRecord> {
  data?: RecordType  // The deleted record
}
```

#### Example

```typescript
// Request
const result = await dataProvider.delete('posts', {
  id: 123,
  previousData: { id: 123, title: 'Post to delete' }
})

// Response
{
  data: {
    id: 123,
    title: 'Post to delete',
    content: '...',
    authorId: 5
  }
}
```

---

### deleteMany

Deletes multiple records.

#### Parameters

```typescript
interface DeleteManyParams {
  ids: Identifier[]
  meta?: Record<string, unknown>
}
```

#### Response

```typescript
interface DeleteManyResult<RecordType extends RaRecord = RaRecord> {
  data?: RecordType['id'][]  // Array of deleted record IDs
}
```

#### Example

```typescript
// Request
const result = await dataProvider.deleteMany('posts', {
  ids: [1, 2, 3]
})

// Response
{
  data: [1, 2, 3]
}
```

---

## Creating a Custom DataProvider

Here is a complete example of implementing a custom DataProvider for a REST API:

```typescript
import type { DataProvider } from 'shadmin'

const API_URL = 'https://api.example.com.ai'

export const restDataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    const query = new URLSearchParams({
      _page: String(page),
      _limit: String(perPage),
      _sort: field,
      _order: order,
      ...Object.fromEntries(
        Object.entries(params.filter).map(([key, value]) => [key, String(value)])
      )
    })

    const response = await fetch(`${API_URL}/${resource}?${query}`)
    const data = await response.json()
    const total = parseInt(response.headers.get('X-Total-Count') || '0', 10)

    return { data, total }
  },

  getOne: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`)
    const data = await response.json()
    return { data }
  },

  getMany: async (resource, params) => {
    const query = params.ids.map(id => `id=${id}`).join('&')
    const response = await fetch(`${API_URL}/${resource}?${query}`)
    const data = await response.json()
    return { data }
  },

  getManyReference: async (resource, params) => {
    const { target, id, pagination, sort, filter } = params
    const query = new URLSearchParams({
      [target]: String(id),
      _page: String(pagination.page),
      _limit: String(pagination.perPage),
      _sort: sort.field,
      _order: sort.order,
      ...Object.fromEntries(
        Object.entries(filter).map(([key, value]) => [key, String(value)])
      )
    })

    const response = await fetch(`${API_URL}/${resource}?${query}`)
    const data = await response.json()
    const total = parseInt(response.headers.get('X-Total-Count') || '0', 10)

    return { data, total }
  },

  create: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.data)
    })
    const data = await response.json()
    return { data }
  },

  update: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.data)
    })
    const data = await response.json()
    return { data }
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map(id =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params.data)
        })
      )
    )
    return { data: params.ids }
  },

  delete: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    return { data }
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map(id =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: 'DELETE'
        })
      )
    )
    return { data: params.ids }
  }
}
```

---

## Using the DataProvider

### In Components

Use the `useDataProvider` hook to access the DataProvider directly:

```tsx
import { useDataProvider } from 'shadmin'

function MyComponent() {
  const dataProvider = useDataProvider()

  const fetchPosts = async () => {
    const result = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'id', order: 'ASC' },
      filter: {}
    })
    console.log(result.data)
  }

  return <button onClick={fetchPosts}>Fetch Posts</button>
}
```

### With Hooks (Recommended)

Shadmin provides specialized hooks that wrap DataProvider methods with TanStack Query for caching, loading states, and error handling:

```tsx
import { useGetList, useCreate, useUpdate, useDelete } from 'shadmin'

function PostList() {
  // Fetch list with automatic caching
  const { data, total, isLoading, error } = useGetList('posts', {
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'createdAt', order: 'DESC' },
    filter: { published: true }
  })

  // Create mutation
  const [create, { isLoading: isCreating }] = useCreate('posts')

  const handleCreate = async () => {
    await create({ data: { title: 'New Post' } })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <button onClick={handleCreate} disabled={isCreating}>
        Create Post
      </button>
      <ul>
        {data?.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <p>Total: {total}</p>
    </div>
  )
}
```

---

## Testing with Mock DataProvider

Shadmin provides a `createMockDataProvider` utility for testing:

```tsx
import { createMockDataProvider, TestAdminContext } from 'shadmin/test-utils'
import { render, screen } from '@testing-library/react'

const mockDataProvider = createMockDataProvider({
  data: {
    posts: [
      { id: 1, title: 'Test Post', published: true },
      { id: 2, title: 'Draft Post', published: false }
    ],
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com.ai' }
    ]
  },
  delay: 0  // Optional: simulate network latency
})

test('renders post list', async () => {
  render(
    <TestAdminContext dataProvider={mockDataProvider}>
      <PostList />
    </TestAdminContext>
  )

  expect(await screen.findByText('Test Post')).toBeInTheDocument()
})
```

---

## Meta Parameter

All DataProvider methods accept an optional `meta` parameter for passing additional context:

```typescript
const result = await dataProvider.getList('posts', {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'id', order: 'ASC' },
  filter: {},
  meta: {
    // Custom metadata passed to your DataProvider implementation
    includeDeleted: true,
    tenantId: 'acme-corp',
    fields: ['id', 'title', 'summary']  // Field selection
  }
})
```

---

## Error Handling

DataProvider methods should throw errors for failed operations:

```typescript
const dataProvider: DataProvider = {
  getOne: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Resource ${resource} with id ${params.id} not found`)
      }
      throw new Error(`HTTP error: ${response.status}`)
    }

    const data = await response.json()
    return { data }
  },
  // ... other methods
}
```

Errors are automatically caught by the hooks and exposed through the `error` property:

```tsx
const { data, error, isLoading } = useGetOne('posts', { id: 123 })

if (error) {
  return <div>Error: {error.message}</div>
}
```

---

## Related

- [Source: `/src/types/data-provider.ts`](../src/types/data-provider.ts)
- [Test Utils: `/src/test-utils/testDataProvider.ts`](../src/test-utils/testDataProvider.ts)
- [Context: `/src/contexts/DataProviderContext.tsx`](../src/contexts/DataProviderContext.tsx)
