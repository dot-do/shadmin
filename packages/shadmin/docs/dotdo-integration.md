# dotdo Integration

This document covers the shadmin integration with dotdo Durable Objects. There are two integration modules:

1. **`shadmin/dotdo`** - HTTP-based providers (REST API)
2. **`shadmin/dotdo-react`** - Real-time integration with `@dotdo/client` SDK

## Quick Start

### HTTP Integration (REST API)

```tsx
import { Admin, Resource } from 'shadmin'
import { DO } from 'shadmin/dotdo'

const { Auth, DB } = DO('https://api.your-app.do')

function App() {
  return (
    <Admin dataProvider={DB()} authProvider={Auth()}>
      <Resource name="users" list={UserList} />
      <Resource name="posts" list={PostList} />
    </Admin>
  )
}
```

### Real-time Integration (@dotdo/client)

```tsx
import { Admin, Resource } from 'shadmin'
import {
  ShadminDOProvider,
  createDotdoDataProvider,
  createDotdoAuthProvider,
  useShadminDO
} from 'shadmin/dotdo-react'

function App() {
  return (
    <ShadminDOProvider baseUrl="https://api.your-app.do">
      <AdminWithProviders />
    </ShadminDOProvider>
  )
}

function AdminWithProviders() {
  const { client, getResourceName, connectionState, disconnect } = useShadminDO()

  const dataProvider = useMemo(
    () => createDotdoDataProvider({ client, getResourceName }),
    [client, getResourceName]
  )

  const authProvider = useMemo(
    () => createDotdoAuthProvider({ client, connectionState, disconnect }),
    [client, connectionState, disconnect]
  )

  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="users" />
    </Admin>
  )
}
```

---

## HTTP Integration (`shadmin/dotdo`)

### Configuration

```tsx
import { DO } from 'shadmin/dotdo'

const { Auth, DB } = DO('https://api.your-app.do', {
  // Custom headers for all requests
  headers: { 'X-API-Version': '2' },

  // Request timeout (default: 30000ms)
  timeout: 60000,

  // Credentials mode (default: 'include')
  credentials: 'include',
})
```

#### DOConfig Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | required | Base URL for the dotdo API |
| `headers` | `Record<string, string>` | `{}` | Custom headers for all requests |
| `credentials` | `RequestCredentials` | `'include'` | Fetch credentials mode |
| `timeout` | `number` | `30000` | Request timeout in milliseconds |

### DataProvider (DB)

Create a DataProvider with optional resource mapping:

```tsx
const dataProvider = DB({
  // Map shadmin resources to dotdo collections
  resourceMapping: {
    'users': 'user-accounts',
    'posts': 'blog-posts',
  },

  // Additional headers for data requests
  headers: { 'X-Tenant': 'acme' },
})
```

#### Supported Operations

| Method | HTTP | Endpoint |
|--------|------|----------|
| `getList` | GET | `/{resource}?_page=N&_perPage=N&_sortField=X&_sortOrder=Y&...filters` |
| `getOne` | GET | `/{resource}/{id}` |
| `getMany` | GET | `/{resource}?ids=1,2,3` |
| `getManyReference` | GET | `/{resource}?{target}={id}&_page=N&...` |
| `create` | POST | `/{resource}` |
| `update` | PUT | `/{resource}/{id}` |
| `updateMany` | PUT | `/{resource}?ids=1,2,3` |
| `delete` | DELETE | `/{resource}/{id}` |
| `deleteMany` | DELETE | `/{resource}?ids=1,2,3` |

#### Example Usage

```tsx
// Fetch paginated list with sorting and filtering
const { data, total } = await dataProvider.getList('users', {
  pagination: { page: 1, perPage: 25 },
  sort: { field: 'createdAt', order: 'DESC' },
  filter: { role: 'admin' }
})

// Get single record
const { data: user } = await dataProvider.getOne('users', { id: '123' })

// Create record
const { data: newUser } = await dataProvider.create('users', {
  data: { email: 'user@example.com', name: 'New User' }
})

// Update record
const { data: updated } = await dataProvider.update('users', {
  id: '123',
  data: { name: 'Updated Name' },
  previousData: { id: '123', name: 'Old Name' }
})

// Delete record
await dataProvider.delete('users', { id: '123' })
```

### AuthProvider (Auth)

Create an AuthProvider with optional configuration:

```tsx
const authProvider = Auth({
  // localStorage key for token (default: 'dotdo_auth_token')
  tokenKey: 'my_app_token',

  // localStorage key for identity (default: 'dotdo_user_identity')
  identityKey: 'my_app_identity',

  // Redirect path after logout (default: '/login')
  logoutRedirectPath: '/signin',

  // Additional headers for auth requests
  headers: {},
})
```

#### Auth Endpoints

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| `login` | POST | `/auth/login` | Authenticate with email/password |
| `logout` | POST | `/auth/logout` | Invalidate session |
| `checkAuth` | GET | `/auth/me` | Validate token |
| `getIdentity` | GET | `/auth/me` | Get user identity |
| `getPermissions` | GET | `/auth/me` | Get user permissions |
| `handleCallback` | POST | `/auth/callback` | OAuth callback |
| `canAccess` | POST | `/auth/can-access` | Row-level security check |

#### Example Usage

```tsx
// Login
await authProvider.login({ username: 'user@example.com', password: 'secret' })

// Check if authenticated
await authProvider.checkAuth() // throws if not authenticated

// Get user identity
const identity = await authProvider.getIdentity()
// { id: '123', fullName: 'John Doe', avatar: '...', roles: ['admin'] }

// Get permissions
const permissions = await authProvider.getPermissions()
// ['users:read', 'users:write', 'posts:*']

// Check resource access
const canEdit = await authProvider.canAccess({
  resource: 'users',
  action: 'edit',
  record: { id: '123' }
})
```

#### Permission Checking

`canAccess` implements hierarchical permission checking:

1. **Wildcard** - `'*'` or `'admin'` grants full access
2. **Resource wildcard** - `'users:*'` grants all actions on resource
3. **Specific permission** - `'users:read'` grants specific action
4. **Row-level** - Server check for record-specific permissions

---

## Real-time Integration (`shadmin/dotdo-react`)

### ShadminDOProvider

Wrap your app with the provider to enable real-time features:

```tsx
import { ShadminDOProvider } from 'shadmin/dotdo-react'

function App() {
  return (
    <ShadminDOProvider
      baseUrl="https://api.your-app.do"
      namespace="tenant-123"
      client={{
        timeout: 30000,
        batching: true,
        batchWindow: 0,
        maxBatchSize: 100,
        offlineQueueLimit: 1000,
        reconnect: {
          maxAttempts: 10,
          baseDelay: 1000,
          maxDelay: 30000,
          jitter: 0.3,
        },
      }}
      resourceMapping={{ 'users': 'user-accounts' }}
      realtime={true}
      fallback={<Loading />}
      onConnectionChange={(state) => console.log('Connection:', state)}
      onError={(error) => console.error('Error:', error)}
    >
      <YourApp />
    </ShadminDOProvider>
  )
}
```

#### Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `baseUrl` | `string` | required | Base URL for DO API |
| `namespace` | `string` | - | Multi-tenant namespace |
| `client` | `DOClientConfig` | - | Client configuration |
| `resourceMapping` | `Record<string, string>` | `{}` | Resource name mappings |
| `realtime` | `boolean` | `true` | Enable real-time subscriptions |
| `fallback` | `ReactNode` | - | Loading fallback |
| `onConnectionChange` | `(state) => void` | - | Connection state callback |
| `onError` | `(error) => void` | - | Error callback |

### Connection State Hooks

```tsx
import {
  useShadminDO,
  useShadminDOOptional,
  useDOConnectionState,
  useDOQueueCount
} from 'shadmin/dotdo-react'

function ConnectionIndicator() {
  const state = useDOConnectionState()
  // 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'failed'

  const queueCount = useDOQueueCount()

  return (
    <div>
      <span>Status: {state}</span>
      {queueCount > 0 && <span>Pending: {queueCount}</span>}
    </div>
  )
}
```

### useDOList Hook

Fetch paginated data with real-time updates:

```tsx
import { useDOList } from 'shadmin/dotdo-react'

function UserList() {
  const { data, total, isLoading, error, refetch, connectionState } = useDOList('users', {
    page: 1,
    perPage: 25,
    sortField: 'createdAt',
    sortOrder: 'DESC',
    filter: { active: true },
    realtime: true, // Subscribe to updates
  })

  if (isLoading) return <Loading />
  if (error) return <Error message={error.message} />

  return (
    <DataGrid
      data={data}
      total={total}
      onRefresh={refetch}
    />
  )
}
```

#### useDOList Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `page` | `number` | `1` | Page number (1-indexed) |
| `perPage` | `number` | `10` | Records per page |
| `sortField` | `string` | `'id'` | Sort field |
| `sortOrder` | `'ASC' \| 'DESC'` | `'ASC'` | Sort order |
| `filter` | `Record<string, unknown>` | `{}` | Filter criteria |
| `realtime` | `boolean` | `false` | Enable real-time updates |
| `meta` | `Record<string, unknown>` | - | Additional metadata |

### useDOForm Hook

Handle create, update, and delete operations:

```tsx
import { useDOForm } from 'shadmin/dotdo-react'

function UserForm({ user }) {
  const { create, update, remove, state, connectionState } = useDOForm('users', {
    optimistic: true,
    onSuccess: (data) => toast.success('Saved!'),
    onError: (error) => toast.error(error.message),
  })

  const handleSubmit = async (formData) => {
    try {
      if (user) {
        await update({
          id: user.id,
          data: formData,
          previousData: user,
        })
      } else {
        await create({ data: formData })
      }
    } catch (error) {
      // Error handled by onError callback
    }
  }

  const handleDelete = async () => {
    if (confirm('Delete this user?')) {
      await remove(user.id)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      {state.hasFieldError('email') && (
        <span className="error">{state.getFieldErrors('email')[0]}</span>
      )}

      <input name="name" />
      {state.hasFieldError('name') && (
        <span className="error">{state.getFieldErrors('name')[0]}</span>
      )}

      <button type="submit" disabled={state.isLoading}>
        {state.isLoading ? 'Saving...' : 'Save'}
      </button>

      {user && (
        <button type="button" onClick={handleDelete}>Delete</button>
      )}
    </form>
  )
}
```

#### useDOForm State

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T \| undefined` | Result data |
| `error` | `Error \| null` | Mutation error |
| `isLoading` | `boolean` | Mutation in progress |
| `isPending` | `boolean` | Mutation pending |
| `isSuccess` | `boolean` | Mutation succeeded |
| `isError` | `boolean` | Mutation failed |
| `isIdle` | `boolean` | No mutation started |
| `fieldErrors` | `Record<string, string[]> \| null` | Field validation errors |
| `getFieldErrors(field)` | `string[]` | Get errors for field |
| `hasFieldError(field)` | `boolean` | Check if field has errors |
| `clearError()` | `void` | Clear all errors |
| `clearFieldError(field)` | `void` | Clear specific field error |
| `reset()` | `void` | Reset mutation state |

---

## Error Handling

### Error Classes

Both integrations provide typed error classes:

```tsx
import { DOAuthError, DODataError } from 'shadmin/dotdo'

try {
  await authProvider.login({ username, password })
} catch (error) {
  if (error instanceof DOAuthError) {
    console.log(error.code)    // 'INVALID_CREDENTIALS'
    console.log(error.status)  // 401
    console.log(error.details) // { field: 'password' }
  }
}

try {
  await dataProvider.getOne('users', { id: 'invalid' })
} catch (error) {
  if (error instanceof DODataError) {
    console.log(error.code)     // 'NOT_FOUND'
    console.log(error.status)   // 404
    console.log(error.resource) // 'users'
  }
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHENTICATED` | 401 | No valid token |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `NETWORK_ERROR` | - | Network failure |
| `RETRY_EXHAUSTED` | - | All retries failed |

### Retry Logic

Both providers implement exponential backoff with jitter:

- **Max retries**: 3
- **Base delay**: 1000ms
- **Max delay**: 10000ms
- **Jitter**: up to 30%
- **Retryable errors**: Network errors, 5xx server errors
- **Non-retryable**: 4xx client errors

---

## TypeScript Types

### HTTP Integration Types

```tsx
import type {
  // Configuration
  DOConfig,
  DBOptions,
  AuthOptions,
  DOResult,

  // Response types
  DOListResponse,
  DORecordResponse,
  DOBatchResponse,
  DOLoginResponse,
  DOUserIdentity,
  DOErrorResponse,

  // Request types
  DORequestOptions,
} from 'shadmin/dotdo'
```

### Real-time Integration Types

```tsx
import type {
  // Connection
  ConnectionState,
  SubscriptionHandle,
  DOClientProxy,

  // Config
  DOClientConfig,
  ShadminDOProviderConfig,
  ShadminDOContextValue,

  // Request parameters
  DOListParams,
  DOGetParams,
  DOGetManyParams,
  DOCreateParams,
  DOUpdateParams,
  DOUpdateManyParams,
  DODeleteParams,
  DODeleteManyParams,

  // Response types
  DOListResult,
  DORecordResult,
  DOBatchResult,

  // Hook types
  UseDOListParams,
  UseDOListResult,
  UseDOShowParams,
  UseDOShowResult,
  UseDOFormCreateParams,
  UseDOFormUpdateParams,
  UseDOFormOptions,
  UseDOFormMutationState,
  UseDOFormResult,
} from 'shadmin/dotdo-react'
```

---

## API Response Format

dotdo expects the following response formats from your API:

### List Response

```json
{
  "data": [
    { "id": "1", "name": "User 1" },
    { "id": "2", "name": "User 2" }
  ],
  "total": 100,
  "pageInfo": {
    "hasNextPage": true,
    "hasPreviousPage": false,
    "startCursor": "abc",
    "endCursor": "xyz"
  }
}
```

### Record Response

```json
{
  "data": { "id": "1", "name": "User 1" }
}
```

### Batch Response

```json
{
  "data": ["1", "2", "3"]
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "constraint": "email"
    }
  }
}
```

### Login Response

```json
{
  "token": "eyJ...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatar": "https://...",
    "roles": ["admin"],
    "permissions": ["users:*", "posts:read"]
  },
  "expiresAt": "2024-12-31T23:59:59Z"
}
```
