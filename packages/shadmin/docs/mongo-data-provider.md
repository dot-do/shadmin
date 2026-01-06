# mongo.do DataProvider

The `shadmin-db` package provides a DataProvider implementation for MongoDB via the [mongo.do](https://mongo.do) API service. This enables you to build admin interfaces directly on top of MongoDB collections with full CRUD support.

## Overview

`shadmin-db` is a separate package that integrates with the Shadmin DataProvider interface, allowing you to:

- Connect to MongoDB via the mongo.do cloud service
- Perform all CRUD operations (create, read, update, delete)
- Use MongoDB query operators for filtering
- Support text search across collections
- Handle pagination, sorting, and reference lookups

---

## Installation

Install the `shadmin-db` package alongside `mongo.do`:

```bash
# Using npm
npm install shadmin-db mongo.do

# Using pnpm
pnpm add shadmin-db mongo.do

# Using yarn
yarn add shadmin-db mongo.do
```

### Peer Dependencies

| Package | Version |
|---------|---------|
| `mongo.do` | `>=0.1.0` |

---

## Configuration

### Basic Setup

```typescript
import { MongoClient } from 'mongo.do'
import { createMondoDataProvider } from 'shadmin-db'

// Initialize the mongo.do client
const client = new MongoClient('your-api-key')

// Create the DataProvider
const dataProvider = createMondoDataProvider({
  client,
  database: 'myapp'
})
```

### With Shadmin Admin

```tsx
import { Admin, Resource, ListGuesser, EditGuesser } from 'shadmin'
import { MongoClient } from 'mongo.do'
import { createMondoDataProvider } from 'shadmin-db'

const client = new MongoClient(process.env.MONGO_DO_API_KEY!)
const dataProvider = createMondoDataProvider({
  client,
  database: 'myapp'
})

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="posts" list={ListGuesser} edit={EditGuesser} />
      <Resource name="users" list={ListGuesser} edit={EditGuesser} />
      <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
    </Admin>
  )
}
```

---

## Authentication Setup

### API Key Configuration

The mongo.do service uses API keys for authentication. Store your API key securely:

```typescript
// .env
MONGO_DO_API_KEY=your-api-key-here
```

```typescript
// app.tsx
const client = new MongoClient(process.env.MONGO_DO_API_KEY!)
```

### Environment-Based Configuration

```typescript
import { MongoClient } from 'mongo.do'
import { createMondoDataProvider } from 'shadmin-db'

const config = {
  development: {
    apiKey: process.env.MONGO_DO_DEV_KEY!,
    database: 'myapp_dev'
  },
  production: {
    apiKey: process.env.MONGO_DO_PROD_KEY!,
    database: 'myapp_prod'
  }
}

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const { apiKey, database } = config[env]

const client = new MongoClient(apiKey)
const dataProvider = createMondoDataProvider({ client, database })
```

### Connection String Format

mongo.do supports standard MongoDB connection string formats:

```typescript
// Direct API key
const client = new MongoClient('mk_live_xxxxxxxxxxxx')

// Connection string format (if supported)
const client = new MongoClient('mongodb+srv://user:pass@cluster.mongo.do/myapp')
```

---

## Collection Mapping

### Resource to Collection Mapping

The DataProvider maps Shadmin resources directly to MongoDB collections. The resource name becomes the collection name:

| Shadmin Resource | MongoDB Collection |
|------------------|-------------------|
| `posts` | `posts` |
| `users` | `users` |
| `comments` | `comments` |

```tsx
// This accesses the "posts" collection in MongoDB
<Resource name="posts" list={PostList} />
```

### ID Field Mapping

MongoDB uses `_id` as the primary key field. The DataProvider automatically handles the conversion:

| MongoDB | Shadmin |
|---------|---------|
| `_id` | `id` |

```typescript
// MongoDB document
{ _id: '507f1f77bcf86cd799439011', title: 'Hello World' }

// Shadmin record (after transformation)
{ id: '507f1f77bcf86cd799439011', title: 'Hello World' }
```

### ObjectId Support

The DataProvider handles both string IDs and MongoDB ObjectId formats:

```typescript
// String _id
{ _id: 'my-custom-id', name: 'Test' }

// ObjectId format (Extended JSON)
{ _id: { $oid: '507f1f77bcf86cd799439011' }, name: 'Test' }
```

Both are normalized to a plain string `id` in the output.

---

## Query Parameters Support

### Filtering

#### Basic Filters

Pass filter values directly to match exact values:

```typescript
const { data } = await dataProvider.getList('posts', {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'id', order: 'ASC' },
  filter: {
    status: 'published',
    authorId: '123'
  }
})
```

This translates to the MongoDB query:

```javascript
{ status: 'published', authorId: '123' }
```

#### MongoDB Operators

You can use MongoDB query operators directly in filters:

```typescript
// Greater than or equal
filter: { views: { $gte: 100 } }

// In array
filter: { status: { $in: ['published', 'draft'] } }

// Less than
filter: { createdAt: { $lt: new Date('2024-01-01') } }

// Exists check
filter: { deletedAt: { $exists: false } }

// Regex pattern
filter: { title: { $regex: '^Hello', $options: 'i' } }
```

#### Text Search

Use the `q` filter key for MongoDB text search:

```typescript
const { data } = await dataProvider.getList('posts', {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'id', order: 'ASC' },
  filter: { q: 'hello world' }
})
```

This translates to:

```javascript
{ $text: { $search: 'hello world' } }
```

**Note:** Text search requires a text index on your collection. Create one via MongoDB:

```javascript
db.posts.createIndex({ title: 'text', content: 'text' })
```

#### Combined Filters

Combine text search with other filters:

```typescript
filter: {
  q: 'hello',
  status: 'published',
  views: { $gte: 100 }
}
```

Translates to:

```javascript
{
  $text: { $search: 'hello' },
  status: 'published',
  views: { $gte: 100 }
}
```

### Sorting

Sorting uses the Shadmin standard format:

```typescript
sort: { field: 'createdAt', order: 'DESC' }
```

Special handling for the `id` field - it's automatically converted to `_id`:

```typescript
// Shadmin sort
sort: { field: 'id', order: 'ASC' }

// MongoDB sort
{ _id: 1 }
```

### Pagination

The DataProvider uses MongoDB aggregation with `$skip` and `$limit` for efficient pagination:

```typescript
pagination: { page: 2, perPage: 25 }
```

This calculates:
- `$skip: (page - 1) * perPage` = 25
- `$limit: perPage` = 25

---

## Usage Examples

### Basic List Component

```tsx
import { List, Datagrid, TextField, DateField, NumberField } from 'shadmin'

function PostList() {
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="status" />
        <NumberField source="views" />
        <DateField source="createdAt" />
      </Datagrid>
    </List>
  )
}
```

### Edit Form

```tsx
import { Edit, SimpleForm, TextInput, SelectInput } from 'shadmin'

function PostEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="title" />
        <TextInput source="content" multiline rows={5} />
        <SelectInput source="status" choices={[
          { id: 'draft', name: 'Draft' },
          { id: 'published', name: 'Published' },
          { id: 'archived', name: 'Archived' }
        ]} />
      </SimpleForm>
    </Edit>
  )
}
```

### Create Form

```tsx
import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput } from 'shadmin'

function PostCreate() {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" required />
        <TextInput source="content" multiline rows={5} />
        <ReferenceInput source="authorId" reference="users">
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  )
}
```

### Reference Field (One-to-Many)

```tsx
import { List, Datagrid, TextField, ReferenceField, ReferenceManyField } from 'shadmin'

function PostList() {
  return (
    <List>
      <Datagrid>
        <TextField source="title" />
        {/* Show author name from users collection */}
        <ReferenceField source="authorId" reference="users">
          <TextField source="name" />
        </ReferenceField>
        {/* Show comment count */}
        <ReferenceManyField
          label="Comments"
          reference="comments"
          target="postId"
        >
          <TextField source="body" />
        </ReferenceManyField>
      </Datagrid>
    </List>
  )
}
```

### Custom Filtering with useGetList

```tsx
import { useGetList } from 'shadmin'

function PublishedPosts() {
  const { data, total, isLoading, error } = useGetList('posts', {
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'createdAt', order: 'DESC' },
    filter: {
      status: 'published',
      views: { $gte: 100 }
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <p>Found {total} popular published posts</p>
      <ul>
        {data?.map(post => (
          <li key={post.id}>
            {post.title} - {post.views} views
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Direct DataProvider Usage

```typescript
import { createMondoDataProvider } from 'shadmin-db'
import { MongoClient } from 'mongo.do'

const client = new MongoClient('your-api-key')
const dataProvider = createMondoDataProvider({ client, database: 'myapp' })

// Fetch a list
const { data, total } = await dataProvider.getList('posts', {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'DESC' },
  filter: { status: 'published' }
})

// Get a single record
const { data: post } = await dataProvider.getOne('posts', { id: '123' })

// Create a new record
const { data: newPost } = await dataProvider.create('posts', {
  data: { title: 'New Post', content: 'Hello world!', status: 'draft' }
})

// Update a record
const { data: updatedPost } = await dataProvider.update('posts', {
  id: '123',
  data: { status: 'published' },
  previousData: post
})

// Delete a record
await dataProvider.delete('posts', { id: '123' })

// Bulk operations
await dataProvider.updateMany('posts', {
  ids: ['1', '2', '3'],
  data: { status: 'archived' }
})

await dataProvider.deleteMany('posts', {
  ids: ['4', '5', '6']
})
```

---

## Error Handling

The DataProvider throws descriptive errors for common failure scenarios:

```typescript
try {
  const { data } = await dataProvider.getOne('posts', { id: 'nonexistent' })
} catch (error) {
  // Error: "Record not found: posts/nonexistent"
}
```

### Error Types

| Scenario | Error Message |
|----------|---------------|
| Record not found | `Record not found: {resource}/{id}` |
| Failed to fetch after create | `Failed to fetch created record: {resource}/{id}` |
| Failed to fetch after update | `Failed to fetch updated record: {resource}/{id}` |
| Update on non-existent record | `Record not found: {resource}/{id}` |

### Handling Errors in Components

```tsx
import { useGetOne } from 'shadmin'

function PostDetail({ id }: { id: string }) {
  const { data, isLoading, error } = useGetOne('posts', { id })

  if (isLoading) return <div>Loading...</div>

  if (error) {
    if (error.message.includes('not found')) {
      return <div>Post not found</div>
    }
    return <div>Error: {error.message}</div>
  }

  return <div>{data?.title}</div>
}
```

---

## TypeScript Support

### Typed Records

```typescript
interface Post {
  id: string
  title: string
  content: string
  status: 'draft' | 'published' | 'archived'
  authorId: string
  views: number
  createdAt: Date
}

// With useGetList
const { data } = useGetList<Post>('posts', {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'DESC' },
  filter: {}
})

// data is typed as Post[]
data?.forEach(post => {
  console.log(post.title) // TypeScript knows this is a string
})
```

### Type Exports

The `shadmin-db` package exports all necessary types:

```typescript
import type {
  DataProvider,
  MondoDataProviderOptions,
  RaRecord,
  Identifier,
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
  DeleteManyResult
} from 'shadmin-db'
```

---

## Advanced Configuration

### Multiple Databases

```typescript
const client = new MongoClient('your-api-key')

const mainDataProvider = createMondoDataProvider({
  client,
  database: 'main_app'
})

const analyticsDataProvider = createMondoDataProvider({
  client,
  database: 'analytics'
})

// Use different providers for different resources
const combinedDataProvider: DataProvider = {
  getList: (resource, params) => {
    if (resource.startsWith('analytics_')) {
      return analyticsDataProvider.getList(resource.replace('analytics_', ''), params)
    }
    return mainDataProvider.getList(resource, params)
  },
  // ... implement other methods similarly
}
```

### Logging and Debugging

```typescript
import { createMondoDataProvider } from 'shadmin-db'

// Wrap the DataProvider with logging
function withLogging(dataProvider: DataProvider): DataProvider {
  return {
    getList: async (resource, params) => {
      console.log('getList', resource, params)
      const result = await dataProvider.getList(resource, params)
      console.log('getList result', result)
      return result
    },
    // ... wrap other methods
  }
}

const baseProvider = createMondoDataProvider({ client, database: 'myapp' })
const dataProvider = withLogging(baseProvider)
```

---

## Related

- [DataProvider Interface](./data-provider.md) - Core DataProvider documentation
- [Getting Started](./getting-started.md) - Shadmin quick start guide
- [Installation](./installation.md) - Full installation instructions
- [shadmin-db source](../../shadmin-db/src/) - Package source code
