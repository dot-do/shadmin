# Shadmin Hooks Reference

This document provides comprehensive documentation for all hooks available in the Shadmin library. These hooks are designed to be 100% API-compatible with react-admin while leveraging modern React patterns and TanStack Query for data management.

## Table of Contents

- [Data Provider Hooks](#data-provider-hooks)
  - [useDataProvider](#usedataprovider)
  - [useGetList](#usegetlist)
  - [useGetOne](#usegetone)
  - [useGetMany](#usegetmany)
  - [useGetManyReference](#usegetmanyreference)
- [Mutation Hooks](#mutation-hooks)
  - [useCreate](#usecreate)
  - [useUpdate](#useupdate)
  - [useUpdateMany](#useupdatemany)
  - [useDelete](#usedelete)
  - [useDeleteMany](#usedeletemany)
- [Authentication Hooks](#authentication-hooks)
  - [useLogin](#uselogin)
  - [useLogout](#uselogout)
  - [useAuthProvider](#useauthprovider)
- [UI Hooks](#ui-hooks)
  - [useNotify](#usenotify)
  - [useRedirect](#useredirect)
  - [useRefresh](#userefresh)
  - [useMediaQuery](#usemediaquery)
  - [useTheme](#usetheme)
- [Context Hooks](#context-hooks)
  - [useResource](#useresource)
  - [useResourceContext](#useresourcecontext)
  - [useResourceDefinition](#useresourcedefinition)
  - [useRecordContext](#userecordcontext)
  - [useListContext](#uselistcontext)
  - [useFormContext](#useformcontext)
  - [useShadminFormContext](#useshadminformcontext)

---

## Data Provider Hooks

### useDataProvider

Provides direct access to the data provider instance for custom data operations.

#### Signature

```typescript
function useDataProvider(): DataProvider
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `DataProvider` | `DataProvider` | The data provider instance |

#### Example

```tsx
import { useDataProvider } from 'shadmin'

function CustomDataComponent() {
  const dataProvider = useDataProvider()

  const handleCustomOperation = async () => {
    // Direct access to data provider methods
    const result = await dataProvider.getList('posts', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
    console.log(result.data)
  }

  return <button onClick={handleCustomOperation}>Custom Operation</button>
}
```

#### Notes

- Throws an error if used outside of `DataProviderContextProvider`
- Use this hook when you need direct access to the data provider for custom operations not covered by the specialized hooks

---

### useGetList

Fetches a list of records with pagination, sorting, and filtering support.

#### Signature

```typescript
function useGetList<RecordType extends RaRecord = RaRecord>(
  resource: string,
  params?: UseGetListParams,
  options?: UseGetListOptions<RecordType>
): UseGetListResult<RecordType>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | `string` | The resource name to fetch from |
| `params` | `UseGetListParams` | Optional parameters for pagination, sorting, and filtering |
| `options` | `UseGetListOptions` | Optional TanStack Query options |

##### UseGetListParams

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `pagination` | `{ page: number; perPage: number }` | `{ page: 1, perPage: 10 }` | Pagination settings |
| `sort` | `{ field: string; order: 'ASC' \| 'DESC' }` | `{ field: 'id', order: 'ASC' }` | Sort configuration |
| `filter` | `Record<string, unknown>` | `{}` | Filter values |
| `meta` | `Record<string, unknown>` | - | Additional metadata |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `data` | `RecordType[] \| undefined` | The fetched records |
| `total` | `number \| undefined` | Total number of records |
| `pageInfo` | `{ hasNextPage?: boolean; hasPreviousPage?: boolean }` | Pagination info |
| `isLoading` | `boolean` | Whether initial loading is in progress |
| `isFetching` | `boolean` | Whether any fetching is in progress |
| `error` | `Error \| null` | Error if the query failed |
| `refetch` | `() => Promise<unknown>` | Function to refetch data |

#### Example

```tsx
import { useGetList } from 'shadmin'

function PostList() {
  const { data, total, isLoading, error } = useGetList('posts', {
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'createdAt', order: 'DESC' },
    filter: { published: true },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <p>Total: {total} posts</p>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

### useGetOne

Fetches a single record by ID from the data provider.

#### Signature

```typescript
function useGetOne<RecordType extends RaRecord = RaRecord>(
  resource: string,
  params: UseGetOneParams,
  options?: UseGetOneOptions<RecordType>
): UseGetOneResult<RecordType>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | `string` | The resource name to fetch from |
| `params` | `UseGetOneParams` | Parameters including the record ID |
| `options` | `UseGetOneOptions` | Optional TanStack Query options |

##### UseGetOneParams

| Property | Type | Description |
|----------|------|-------------|
| `id` | `Identifier` | The record ID to fetch |
| `meta` | `Record<string, unknown>` | Additional metadata |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `data` | `RecordType \| undefined` | The fetched record |
| `isLoading` | `boolean` | Whether initial loading is in progress |
| `isFetching` | `boolean` | Whether any fetching is in progress |
| `error` | `Error \| null` | Error if the query failed |
| `refetch` | `() => Promise<unknown>` | Function to refetch data |

#### Example

```tsx
import { useGetOne } from 'shadmin'

function PostDetail({ id }: { id: number }) {
  const { data, isLoading, error } = useGetOne('posts', { id })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>{data?.title}</h1>
      <p>{data?.body}</p>
    </div>
  )
}
```

---

### useGetMany

Fetches multiple records by their IDs from the data provider.

#### Signature

```typescript
function useGetMany<RecordType extends RaRecord = RaRecord>(
  resource: string,
  params: UseGetManyParams,
  options?: UseGetManyOptions<RecordType>
): UseGetManyResult<RecordType>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | `string` | The resource name to fetch from |
| `params` | `UseGetManyParams` | Parameters including the array of record IDs |
| `options` | `UseGetManyOptions` | Optional TanStack Query options |

##### UseGetManyParams

| Property | Type | Description |
|----------|------|-------------|
| `ids` | `Identifier[]` | Array of record IDs to fetch |
| `meta` | `Record<string, unknown>` | Additional metadata |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `data` | `RecordType[] \| undefined` | The fetched records |
| `isLoading` | `boolean` | Whether initial loading is in progress |
| `isFetching` | `boolean` | Whether any fetching is in progress |
| `error` | `Error \| null` | Error if the query failed |
| `refetch` | `() => Promise<unknown>` | Function to refetch data |

#### Example

```tsx
import { useGetMany } from 'shadmin'

function SelectedUsers({ userIds }: { userIds: number[] }) {
  const { data, isLoading, error } = useGetMany('users', { ids: userIds })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

---

### useGetManyReference

Fetches related records based on a foreign key relationship.

#### Signature

```typescript
function useGetManyReference<RecordType extends RaRecord = RaRecord>(
  resource: string,
  params: UseGetManyReferenceParams,
  options?: UseGetManyReferenceOptions<RecordType>
): UseGetManyReferenceResult<RecordType>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | `string` | The resource name to fetch from |
| `params` | `UseGetManyReferenceParams` | Parameters including target field and ID |
| `options` | `UseGetManyReferenceOptions` | Optional TanStack Query options |

##### UseGetManyReferenceParams

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `target` | `string` | - | The foreign key field name |
| `id` | `Identifier` | - | The ID to match against the target field |
| `pagination` | `{ page: number; perPage: number }` | `{ page: 1, perPage: 10 }` | Pagination settings |
| `sort` | `{ field: string; order: 'ASC' \| 'DESC' }` | `{ field: 'id', order: 'ASC' }` | Sort configuration |
| `filter` | `Record<string, unknown>` | `{}` | Additional filter values |
| `meta` | `Record<string, unknown>` | - | Additional metadata |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `data` | `RecordType[] \| undefined` | The fetched records |
| `total` | `number \| undefined` | Total number of matching records |
| `pageInfo` | `{ hasNextPage?: boolean; hasPreviousPage?: boolean }` | Pagination info |
| `isLoading` | `boolean` | Whether initial loading is in progress |
| `isFetching` | `boolean` | Whether any fetching is in progress |
| `error` | `Error \| null` | Error if the query failed |
| `refetch` | `() => Promise<unknown>` | Function to refetch data |

#### Example

```tsx
import { useGetManyReference } from 'shadmin'

function PostComments({ postId }: { postId: number }) {
  const { data, total, isLoading } = useGetManyReference('comments', {
    target: 'postId',
    id: postId,
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'createdAt', order: 'DESC' },
  })

  if (isLoading) return <div>Loading comments...</div>

  return (
    <div>
      <h3>{total} Comments</h3>
      {data?.map((comment) => (
        <div key={comment.id}>{comment.body}</div>
      ))}
    </div>
  )
}
```

---

## Mutation Hooks

### useCreate

Creates a new record using the data provider.

#### Signature

```typescript
function useCreate<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
>(
  resource?: string,
  options?: UseCreateOptions<RecordType, TVariables>
): UseCreateResult<RecordType, TVariables>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | `string` | Optional resource name (can be provided when calling create) |
| `options` | `UseCreateOptions` | Optional mutation options |

#### Returns

Returns a tuple `[create, state]`:

##### create function

```typescript
// Option 1: Without pre-configured resource
create(resource: string, params: UseCreateMutateParams<TVariables>): Promise<CreateResult<RecordType>>

// Option 2: With pre-configured resource
create(params: UseCreateMutateParams<TVariables>): Promise<CreateResult<RecordType>>
```

##### UseCreateMutateParams

| Property | Type | Description |
|----------|------|-------------|
| `data` | `TData` | The data for the new record |
| `meta` | `Record<string, unknown>` | Additional metadata |

##### Mutation State

| Property | Type | Description |
|----------|------|-------------|
| `data` | `CreateResult<RecordType> \| undefined` | Result of the mutation |
| `error` | `Error \| null` | Error if the mutation failed |
| `isLoading` | `boolean` | Whether mutation is in progress |
| `isPending` | `boolean` | Whether mutation is pending |
| `isSuccess` | `boolean` | Whether mutation succeeded |
| `isError` | `boolean` | Whether mutation errored |
| `isIdle` | `boolean` | Whether mutation is idle |
| `reset` | `() => void` | Function to reset mutation state |

#### Example

```tsx
import { useCreate } from 'shadmin'

function CreatePostForm() {
  const [create, { isLoading, error }] = useCreate('posts')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    await create({
      data: {
        title: formData.get('title'),
        body: formData.get('body'),
      },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" />
      <textarea name="body" placeholder="Content" />
      <button disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Post'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  )
}
```

---

### useUpdate

Updates an existing record using the data provider.

#### Signature

```typescript
function useUpdate<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
>(
  resource?: string,
  options?: UseUpdateOptions<RecordType, TVariables>
): UseUpdateResult<RecordType, TVariables>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | `string` | Optional resource name (can be provided when calling update) |
| `options` | `UseUpdateOptions` | Optional mutation options |

#### Returns

Returns a tuple `[update, state]`:

##### update function

```typescript
update(resource: string, params: UseUpdateMutateParams<TVariables>): Promise<UpdateResult<RecordType>>
update(params: UseUpdateMutateParams<TVariables>): Promise<UpdateResult<RecordType>>
```

##### UseUpdateMutateParams

| Property | Type | Description |
|----------|------|-------------|
| `id` | `Identifier` | The record ID to update |
| `data` | `TData` | The data to update |
| `previousData` | `TData` | Optional previous data for optimistic updates |
| `meta` | `Record<string, unknown>` | Additional metadata |

##### Mutation State

Same as `useCreate` mutation state.

#### Example

```tsx
import { useUpdate } from 'shadmin'

function EditPostForm({ post }: { post: Post }) {
  const [update, { isLoading }] = useUpdate('posts')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    await update({
      id: post.id,
      data: {
        title: formData.get('title'),
        body: formData.get('body'),
      },
      previousData: post,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" defaultValue={post.title} />
      <textarea name="body" defaultValue={post.body} />
      <button disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

---

### useUpdateMany

Updates multiple records at once using the data provider.

#### Signature

```typescript
function useUpdateMany<
  RecordType extends RaRecord = RaRecord,
  TVariables = Record<string, unknown>
>(
  resource?: string,
  options?: UseUpdateManyOptions<RecordType, TVariables>
): UseUpdateManyResult<RecordType, TVariables>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | `string` | Optional resource name |
| `options` | `UseUpdateManyOptions` | Optional mutation options |

#### Returns

Returns a tuple `[updateMany, state]`:

##### UseUpdateManyMutateParams

| Property | Type | Description |
|----------|------|-------------|
| `ids` | `Identifier[]` | Array of record IDs to update |
| `data` | `TData` | The data to apply to all records |
| `meta` | `Record<string, unknown>` | Additional metadata |

#### Example

```tsx
import { useUpdateMany } from 'shadmin'

function BulkPublishButton({ selectedIds }: { selectedIds: number[] }) {
  const [updateMany, { isLoading }] = useUpdateMany('posts')

  const handlePublish = async () => {
    await updateMany({
      ids: selectedIds,
      data: { published: true },
    })
  }

  return (
    <button onClick={handlePublish} disabled={isLoading}>
      {isLoading ? 'Publishing...' : `Publish ${selectedIds.length} posts`}
    </button>
  )
}
```

---

### useDelete

Deletes a single record using the data provider.

#### Signature

```typescript
function useDelete<RecordType extends RaRecord = RaRecord>(
  resource?: string,
  options?: UseDeleteOptions<RecordType>
): UseDeleteResult<RecordType>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | `string` | Optional resource name |
| `options` | `UseDeleteOptions` | Optional mutation options |

#### Returns

Returns a tuple `[deleteRecord, state]`:

##### UseDeleteMutateParams

| Property | Type | Description |
|----------|------|-------------|
| `id` | `Identifier` | The record ID to delete |
| `previousData` | `RecordType` | Optional previous data for undo functionality |
| `meta` | `Record<string, unknown>` | Additional metadata |

#### Example

```tsx
import { useDelete } from 'shadmin'

function DeletePostButton({ postId }: { postId: number }) {
  const [deleteRecord, { isLoading }] = useDelete('posts')

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      await deleteRecord({ id: postId })
    }
  }

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      {isLoading ? 'Deleting...' : 'Delete'}
    </button>
  )
}
```

---

### useDeleteMany

Deletes multiple records at once using the data provider.

#### Signature

```typescript
function useDeleteMany<RecordType extends RaRecord = RaRecord>(
  resource?: string,
  options?: UseDeleteManyOptions<RecordType>
): UseDeleteManyResult<RecordType>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | `string` | Optional resource name |
| `options` | `UseDeleteManyOptions` | Optional mutation options |

#### Returns

Returns a tuple `[deleteMany, state]`:

##### UseDeleteManyMutateParams

| Property | Type | Description |
|----------|------|-------------|
| `ids` | `Identifier[]` | Array of record IDs to delete |
| `meta` | `Record<string, unknown>` | Additional metadata |

#### Example

```tsx
import { useDeleteMany } from 'shadmin'

function BulkDeleteButton({ selectedIds }: { selectedIds: number[] }) {
  const [deleteMany, { isLoading }] = useDeleteMany('posts')

  const handleDelete = async () => {
    if (confirm(`Delete ${selectedIds.length} items?`)) {
      await deleteMany({ ids: selectedIds })
    }
  }

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      {isLoading ? 'Deleting...' : `Delete ${selectedIds.length} items`}
    </button>
  )
}
```

---

## Authentication Hooks

### useLogin

Provides login functionality with auth provider integration.

#### Signature

```typescript
function useLogin(options?: UseLoginOptions): UseLoginResult
```

#### Parameters

##### UseLoginOptions

| Property | Type | Description |
|----------|------|-------------|
| `onSuccess` | `() => void` | Callback called on successful login |
| `onError` | `(error: Error) => void` | Callback called on login error |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `login` | `(credentials: Record<string, unknown>, options?: LoginOptions) => Promise<void>` | Function to call with credentials |
| `isLoading` | `boolean` | Whether login is in progress |
| `error` | `Error \| null` | Error from the last login attempt |

##### LoginOptions

| Property | Type | Description |
|----------|------|-------------|
| `redirectTo` | `string \| false` | Where to redirect after login. Set to `false` to disable redirect |

#### Example

```tsx
import { useLogin } from 'shadmin'

function LoginPage() {
  const { login, isLoading, error } = useLogin({
    onSuccess: () => console.log('Logged in!'),
    onError: (err) => console.error('Login failed:', err),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    await login({
      username: formData.get('username'),
      password: formData.get('password'),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error.message}</p>}
      <input name="username" placeholder="Username" />
      <input name="password" type="password" placeholder="Password" />
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

---

### useLogout

Provides logout functionality with auth provider integration.

#### Signature

```typescript
function useLogout(options?: UseLogoutOptions): UseLogoutResult
```

#### Parameters

##### UseLogoutOptions

| Property | Type | Description |
|----------|------|-------------|
| `onSuccess` | `() => void` | Callback called on successful logout |
| `onError` | `(error: Error) => void` | Callback called on logout error |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `logout` | `(options?: LogoutOptions) => Promise<void>` | Function to call to log out |
| `isLoading` | `boolean` | Whether logout is in progress |
| `error` | `Error \| null` | Error from the last logout attempt |

##### LogoutOptions

| Property | Type | Description |
|----------|------|-------------|
| `redirectTo` | `string \| false` | Where to redirect after logout. Set to `false` to disable redirect |

#### Example

```tsx
import { useLogout } from 'shadmin'

function LogoutButton() {
  const { logout, isLoading } = useLogout()

  const handleClick = async () => {
    await logout({ redirectTo: '/login' })
  }

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
```

---

### useAuthProvider

Provides direct access to the auth provider instance.

#### Signature

```typescript
function useAuthProvider(): AuthProvider
```

#### Returns

The `AuthProvider` instance.

#### Example

```tsx
import { useAuthProvider } from 'shadmin'

function UserProfile() {
  const authProvider = useAuthProvider()
  const [identity, setIdentity] = useState(null)

  useEffect(() => {
    authProvider.getIdentity?.().then(setIdentity)
  }, [authProvider])

  return <div>Welcome, {identity?.fullName}</div>
}
```

---

## UI Hooks

### useNotify

Shows notifications to the user.

#### Signature

```typescript
function useNotify(): NotifyFunction

type NotifyFunction = (message: string, options?: NotificationOptions) => void
```

#### Parameters

##### NotificationOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Type of notification |
| `autoHideDuration` | `number` | - | Duration in ms before auto-hide (0 = never) |
| `undoable` | `boolean` | `false` | Whether the notification can be undone |
| `onUndo` | `() => void` | - | Callback when undo is clicked |
| `messageArgs` | `Record<string, unknown>` | - | Additional data for the notification |
| `multiLine` | `boolean` | `false` | Multi-line mode |

#### Example

```tsx
import { useNotify } from 'shadmin'

function SaveButton() {
  const notify = useNotify()

  const handleSave = async () => {
    try {
      await saveData()
      notify('Record saved successfully', { type: 'success' })
    } catch (error) {
      notify('Error saving record', { type: 'error' })
    }
  }

  return <button onClick={handleSave}>Save</button>
}

// With undo support
function DeleteButton() {
  const notify = useNotify()

  const handleDelete = () => {
    notify('Item deleted', {
      type: 'info',
      undoable: true,
      onUndo: () => restoreItem(),
    })
  }

  return <button onClick={handleDelete}>Delete</button>
}
```

---

### useRedirect

Navigate programmatically to different views.

#### Signature

```typescript
function useRedirect(): RedirectFunction

type RedirectFunction = (
  redirectTo: RedirectTo,
  resource?: string,
  id?: Identifier,
  options?: RedirectOptions
) => void

type RedirectTo = 'list' | 'show' | 'edit' | 'create' | false | string
```

#### Parameters

##### RedirectOptions

| Property | Type | Description |
|----------|------|-------------|
| `basePath` | `string` | Base path for the resource |
| `state` | `Record<string, unknown>` | State to pass with the navigation |
| `replace` | `boolean` | Replace instead of push to history |

#### Example

```tsx
import { useRedirect } from 'shadmin'

function PostActions({ postId }: { postId: number }) {
  const redirect = useRedirect()

  return (
    <div>
      {/* Navigate to list */}
      <button onClick={() => redirect('list', 'posts')}>Back to List</button>

      {/* Navigate to show view */}
      <button onClick={() => redirect('show', 'posts', postId)}>View</button>

      {/* Navigate to edit view */}
      <button onClick={() => redirect('edit', 'posts', postId)}>Edit</button>

      {/* Navigate to create view */}
      <button onClick={() => redirect('create', 'posts')}>Create New</button>

      {/* Navigate to custom path */}
      <button onClick={() => redirect('/dashboard')}>Dashboard</button>

      {/* Prevent redirect */}
      <button onClick={() => redirect(false)}>Stay Here</button>
    </div>
  )
}
```

---

### useRefresh

Refresh the current view or specific resource data.

#### Signature

```typescript
function useRefresh(): RefreshFunction

type RefreshFunction = (resource?: string, options?: RefreshOptions) => void
```

#### Parameters

##### RefreshOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hard` | `boolean` | `false` | If true, clears the cache before refetching |

#### Example

```tsx
import { useRefresh } from 'shadmin'

function RefreshButton() {
  const refresh = useRefresh()

  return (
    <div>
      {/* Refresh all queries */}
      <button onClick={() => refresh()}>Refresh All</button>

      {/* Refresh specific resource */}
      <button onClick={() => refresh('posts')}>Refresh Posts</button>

      {/* Hard refresh (clear cache first) */}
      <button onClick={() => refresh(undefined, { hard: true })}>
        Hard Refresh
      </button>
    </div>
  )
}
```

---

### useMediaQuery

Check if a media query matches.

#### Signature

```typescript
function useMediaQuery(query: string): boolean
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `string` | The media query string to match |

#### Returns

`boolean` - Whether the media query matches.

#### Example

```tsx
import { useMediaQuery } from 'shadmin'

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  )
}
```

---

### useTheme

Access and manage theme state.

#### Signature

```typescript
function useTheme(): ThemeContextValue

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  themes: string[]
}

type Theme = 'light' | 'dark' | 'system'
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `Theme` | Current theme setting ('light', 'dark', or 'system') |
| `setTheme` | `(theme: Theme) => void` | Function to change the theme |
| `resolvedTheme` | `'light' \| 'dark'` | Actual resolved theme (system is resolved) |
| `themes` | `string[]` | Available theme options |

#### Example

```tsx
import { useTheme } from 'shadmin'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

---

## Context Hooks

### useResource

Get the current resource name from context.

#### Signature

```typescript
function useResource(): string
```

#### Returns

The current resource name as a `string`.

#### Notes

- Throws an error if used outside of `ResourceContextProvider`
- Use `useResourceOptional()` if you want to allow `null` return value

#### Example

```tsx
import { useResource } from 'shadmin'

function ResourceInfo() {
  const resource = useResource()
  return <div>Current resource: {resource}</div>
}
```

---

### useResourceContext

Get the current resource name with options.

#### Signature

```typescript
function useResourceContext(options?: UseResourceContextOptions): string | undefined

interface UseResourceContextOptions {
  required?: boolean
  defaultValue?: string
}
```

#### Parameters

##### UseResourceContextOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `required` | `boolean` | `false` | Throw if not in a provider |
| `defaultValue` | `string` | - | Default value if not in a provider |

#### Example

```tsx
import { useResourceContext } from 'shadmin'

function FlexibleComponent() {
  // Basic usage - returns undefined if not in provider
  const resource = useResourceContext()

  // With default value
  const resourceWithDefault = useResourceContext({ defaultValue: 'users' })

  // Throw if not in provider
  const requiredResource = useResourceContext({ required: true })

  return <div>Resource: {resource}</div>
}
```

---

### useResourceDefinition

Get a specific resource definition by name.

#### Signature

```typescript
function useResourceDefinition(name?: string): ResourceDefinition | undefined
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Resource name (defaults to current resource from context) |

#### Returns

The `ResourceDefinition` for the specified resource, or `undefined` if not found.

#### Example

```tsx
import { useResourceDefinition } from 'shadmin'

function ResourceConfig() {
  // Get definition for current resource
  const definition = useResourceDefinition()

  // Or specify a resource name
  const postsDefinition = useResourceDefinition('posts')

  return (
    <div>
      <p>Has list: {definition?.hasList ? 'Yes' : 'No'}</p>
      <p>Has create: {definition?.hasCreate ? 'Yes' : 'No'}</p>
      <p>Has edit: {definition?.hasEdit ? 'Yes' : 'No'}</p>
      <p>Has show: {definition?.hasShow ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

---

### useRecordContext

Access the current record from context.

#### Signature

```typescript
function useRecordContext<T extends RaRecord = RaRecord>(): T | undefined
```

#### Returns

The current record, or `undefined` if not in a `RecordContextProvider`.

#### Example

```tsx
import { useRecordContext } from 'shadmin'

interface Post {
  id: number
  title: string
  body: string
}

function PostTitle() {
  const record = useRecordContext<Post>()

  if (!record) return null

  return <h1>{record.title}</h1>
}

// Usage in a Show or Edit component
function PostShow() {
  return (
    <Show>
      <PostTitle />
    </Show>
  )
}
```

---

### useListContext

Access the list controller state from context.

#### Signature

```typescript
function useListContext<T extends RaRecord = RaRecord>(): ListControllerResult<T>
```

#### Returns

##### ListControllerResult

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T[] \| undefined` | The list of records |
| `total` | `number \| undefined` | Total number of records |
| `isLoading` | `boolean` | Whether data is loading |
| `isFetching` | `boolean` | Whether a background refetch is in progress |
| `error` | `Error \| null` | Error if the query failed |
| `page` | `number` | Current page number (1-indexed) |
| `perPage` | `number` | Number of records per page |
| `sort` | `SortPayload` | Current sort configuration |
| `filterValues` | `FilterPayload` | Current filter values |
| `selectedIds` | `Identifier[]` | IDs of selected records |
| `resource` | `string` | Resource name |
| `setPage` | `(page: number) => void` | Change current page |
| `setPerPage` | `(perPage: number) => void` | Change items per page |
| `setSort` | `(sort: SortPayload) => void` | Change sort order |
| `setFilters` | `(filters: FilterPayload) => void` | Change filters |
| `onSelect` | `(ids: Identifier[]) => void` | Select records by IDs |
| `onToggleItem` | `(id: Identifier) => void` | Toggle selection of a record |
| `onUnselectItems` | `() => void` | Unselect all records |
| `refetch` | `() => void` | Refetch the data |

#### Example

```tsx
import { useListContext } from 'shadmin'

function CustomDatagrid() {
  const {
    data,
    total,
    isLoading,
    page,
    perPage,
    sort,
    setPage,
    setSort,
    selectedIds,
    onToggleItem,
  } = useListContext<Post>()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <p>Showing {data?.length} of {total} records</p>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th onClick={() => setSort({ field: 'title', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>
              Title {sort.field === 'title' && (sort.order === 'ASC' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((record) => (
            <tr key={record.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(record.id)}
                  onChange={() => onToggleItem(record.id)}
                />
              </td>
              <td>{record.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={() => setPage(page + 1)} disabled={!data || data.length < perPage}>
        Next
      </button>
    </div>
  )
}
```

---

### useFormContext

Access react-hook-form methods from context.

#### Signature

```typescript
function useFormContext<T extends FieldValues = FieldValues>(): UseFormReturn<T>
```

#### Returns

The `UseFormReturn` object from react-hook-form, containing all form methods.

#### Notes

- This is a re-export of react-hook-form's `useFormContext`
- Throws an error if used outside of a `FormProvider`

#### Example

```tsx
import { useFormContext } from 'shadmin'

function CustomInput({ name }: { name: string }) {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div>
      <input {...register(name)} />
      {errors[name] && <span>{errors[name].message}</span>}
    </div>
  )
}
```

---

### useShadminFormContext

Access the full shadmin form context (react-hook-form + shadmin extensions).

#### Signature

```typescript
function useShadminFormContext<T extends FieldValues = FieldValues>():
  UseFormReturn<T> & ShadminFormContextValue<T>
```

#### Returns

Combines react-hook-form's `UseFormReturn` with shadmin-specific properties:

##### ShadminFormContextValue

| Property | Type | Description |
|----------|------|-------------|
| `record` | `RaRecord \| undefined` | The current record being edited |
| `resource` | `string \| undefined` | Resource name |
| `save` | `(data: T) => void \| Promise<void>` | Save function |
| `saving` | `boolean \| undefined` | Whether the form is currently saving |
| `mutationMode` | `MutationMode \| undefined` | Mutation mode ('pessimistic', 'optimistic', 'undoable') |
| `onDelete` | `() => void \| Promise<void>` | Delete function |

#### Example

```tsx
import { useShadminFormContext } from 'shadmin'

function FormToolbar() {
  const {
    handleSubmit,
    formState: { isDirty },
    record,
    save,
    saving,
    onDelete,
    mutationMode,
  } = useShadminFormContext()

  return (
    <div>
      <button
        onClick={handleSubmit(save)}
        disabled={!isDirty || saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      {record?.id && (
        <button onClick={onDelete}>
          Delete
        </button>
      )}
      <span>Mode: {mutationMode}</span>
    </div>
  )
}
```

---

## Cache Management

All data-fetching hooks use TanStack Query for caching. The mutation hooks automatically invalidate related queries:

- `useCreate`: Invalidates `getList` queries for the resource
- `useUpdate`: Invalidates `getList` and `getOne` queries for the resource
- `useUpdateMany`: Invalidates `getList`, `getMany`, and affected `getOne` queries
- `useDelete`: Invalidates `getList`, `getMany`, and removes the `getOne` query
- `useDeleteMany`: Invalidates `getList`, `getMany`, and removes affected `getOne` queries

Use `useRefresh` to manually trigger cache invalidation when needed.

---

## TypeScript Support

All hooks are fully typed and support generic type parameters:

```typescript
import { useGetList, useRecordContext } from 'shadmin'

interface Post {
  id: number
  title: string
  body: string
  authorId: number
}

// Type-safe data fetching
const { data } = useGetList<Post>('posts')
// data is Post[] | undefined

// Type-safe record context
const record = useRecordContext<Post>()
// record is Post | undefined
```
