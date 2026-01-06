# Resource Component

The `Resource` component is the fundamental building block for declaring data entities in your Shadmin application. It defines the CRUD operations available for a resource and automatically generates the corresponding routes. The API is 100% compatible with react-admin.

## Overview

A resource represents a single entity type in your application (e.g., posts, users, comments). Each resource can have up to four views:

| View | Route | Description |
|------|-------|-------------|
| `list` | `/{resource}` | Display a paginated list of records |
| `create` | `/{resource}/create` | Form to create a new record |
| `edit` | `/{resource}/:id` | Form to edit an existing record |
| `show` | `/{resource}/:id/show` | Read-only view of a single record |

## Basic Usage

```tsx
import { Admin, Resource } from 'shadmin'
import { dataProvider } from './dataProvider'
import { PostList, PostEdit, PostCreate, PostShow } from './posts'

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="posts"
        list={PostList}
        edit={PostEdit}
        create={PostCreate}
        show={PostShow}
      />
    </Admin>
  )
}
```

---

## Props Reference

### ResourceProps

```typescript
interface ResourceProps {
  /** The name of the resource (used in URLs and API calls) */
  name: string
  /** Component to render for the list view */
  list?: ComponentType
  /** Component to render for the edit view */
  edit?: ComponentType
  /** Component to render for the create view */
  create?: ComponentType
  /** Component to render for the show view */
  show?: ComponentType
  /** Icon component for the resource in menu */
  icon?: ComponentType
  /** Additional resource options */
  options?: ResourceOptions
  /** Nested resources */
  children?: ReactNode
}

interface ResourceOptions {
  label?: string
  [key: string]: unknown
}
```

### Props Details

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Unique identifier for the resource. Used in URLs and DataProvider calls. |
| `list` | `ComponentType` | No | Component rendered at `/{name}` |
| `edit` | `ComponentType` | No | Component rendered at `/{name}/:id` |
| `create` | `ComponentType` | No | Component rendered at `/{name}/create` |
| `show` | `ComponentType` | No | Component rendered at `/{name}/:id/show` |
| `icon` | `ComponentType` | No | Icon component for navigation menus |
| `options` | `ResourceOptions` | No | Additional options like custom labels |
| `children` | `ReactNode` | No | Nested content (typically not used) |

---

## CRUD View Props

### list

The `list` prop accepts a component that will be rendered when users navigate to the resource's list route.

```tsx
import { List, Datagrid, TextField, DateField } from 'shadmin'

const PostList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
)

<Resource name="posts" list={PostList} />
```

**Generated Route:** `/posts`

---

### create

The `create` prop accepts a component for creating new records.

```tsx
import { Create, SimpleForm, TextInput } from 'shadmin'

const PostCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="content" multiline />
    </SimpleForm>
  </Create>
)

<Resource name="posts" create={PostCreate} />
```

**Generated Route:** `/posts/create`

---

### edit

The `edit` prop accepts a component for editing existing records.

```tsx
import { Edit, SimpleForm, TextInput } from 'shadmin'

const PostEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="content" multiline />
    </SimpleForm>
  </Edit>
)

<Resource name="posts" edit={PostEdit} />
```

**Generated Route:** `/posts/:id` (e.g., `/posts/123`)

---

### show

The `show` prop accepts a component for displaying a read-only view of a record.

```tsx
import { Show, SimpleShowLayout, TextField, DateField } from 'shadmin'

const PostShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" />
      <TextField source="content" />
      <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
)

<Resource name="posts" show={PostShow} />
```

**Generated Route:** `/posts/:id/show` (e.g., `/posts/123/show`)

---

## Icon Configuration

The `icon` prop allows you to specify an icon component that will be displayed in navigation menus.

```tsx
import { FileText, Users, Settings } from 'lucide-react'

<Admin dataProvider={dataProvider}>
  <Resource
    name="posts"
    list={PostList}
    icon={FileText}
  />
  <Resource
    name="users"
    list={UserList}
    icon={Users}
  />
  <Resource
    name="settings"
    icon={Settings}
    options={{ label: 'Configuration' }}
  />
</Admin>
```

### Custom Icon Components

You can create custom icon components:

```tsx
const CustomPostIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path d="M3 3h18v18H3z" fill="currentColor" />
  </svg>
)

<Resource name="posts" list={PostList} icon={CustomPostIcon} />
```

### Accessing Icons in Components

Icons are stored in the resource definition and can be accessed via context:

```tsx
import { useResourceDefinition } from 'shadmin'

const MyMenuComponent = () => {
  const definition = useResourceDefinition('posts')
  const Icon = definition?.icon

  return (
    <div>
      {Icon && <Icon />}
      <span>{definition?.options?.label ?? 'Posts'}</span>
    </div>
  )
}
```

---

## Route Generation

Shadmin automatically generates routes based on the components you provide to each Resource:

### Route Structure

```
/                       -> Dashboard (if provided to Admin)
/{resource}             -> list component
/{resource}/create      -> create component
/{resource}/:id         -> edit component
/{resource}/:id/show    -> show component
```

### Conditional Route Generation

Routes are only created for the components you provide:

```tsx
// Only creates /posts route (list only)
<Resource name="posts" list={PostList} />

// Creates /posts and /posts/:id routes (list + edit)
<Resource name="posts" list={PostList} edit={PostEdit} />

// Creates all four routes
<Resource
  name="posts"
  list={PostList}
  create={PostCreate}
  edit={PostEdit}
  show={PostShow}
/>
```

### Checking Available Routes

You can check which routes exist for a resource using the `useResourceDefinition` hook:

```tsx
import { useResourceDefinition } from 'shadmin'

const ResourceInfo = () => {
  const definition = useResourceDefinition('posts')

  return (
    <div>
      <p>List available: {definition?.hasList ? 'Yes' : 'No'}</p>
      <p>Create available: {definition?.hasCreate ? 'Yes' : 'No'}</p>
      <p>Edit available: {definition?.hasEdit ? 'Yes' : 'No'}</p>
      <p>Show available: {definition?.hasShow ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

---

## Permissions

Shadmin integrates with the `AuthProvider` to handle permissions. The `getPermissions` method of your AuthProvider determines what actions users can perform.

### AuthProvider Permissions

```typescript
const authProvider: AuthProvider = {
  // ... other methods

  getPermissions: async () => {
    const role = localStorage.getItem('role')
    return {
      role,
      canCreate: role === 'admin',
      canEdit: role === 'admin' || role === 'editor',
      canDelete: role === 'admin',
    }
  }
}
```

### Checking Permissions in Components

Use the `usePermissions` hook to access permissions in your components:

```tsx
import { usePermissions } from 'shadmin'

const PostList = () => {
  const { permissions, isLoading } = usePermissions()

  if (isLoading) return <div>Loading...</div>

  return (
    <List>
      <Datagrid>
        <TextField source="title" />
        {permissions?.canEdit && <EditButton />}
        {permissions?.canDelete && <DeleteButton />}
      </Datagrid>
    </List>
  )
}
```

### Conditional Resource Registration

You can conditionally render Resources based on permissions:

```tsx
import { Admin, Resource, usePermissions } from 'shadmin'

const AdminResources = () => {
  const { permissions } = usePermissions()

  return (
    <>
      <Resource name="posts" list={PostList} edit={PostEdit} />
      {permissions?.role === 'admin' && (
        <Resource name="users" list={UserList} edit={UserEdit} />
      )}
    </>
  )
}
```

### Protected Routes

Use the `ProtectedRoute` component to protect individual views:

```tsx
import { ProtectedRoute, Edit, SimpleForm, TextInput } from 'shadmin'

const ProtectedPostEdit = () => (
  <ProtectedRoute>
    <Edit>
      <SimpleForm>
        <TextInput source="title" />
      </SimpleForm>
    </Edit>
  </ProtectedRoute>
)
```

---

## Complete Examples

### Basic Blog Application

```tsx
import { Admin, Resource } from 'shadmin'
import { FileText, Users, MessageSquare } from 'lucide-react'
import { dataProvider } from './dataProvider'
import { authProvider } from './authProvider'

// Post components
import { PostList, PostCreate, PostEdit, PostShow } from './posts'
// User components
import { UserList, UserEdit } from './users'
// Comment components
import { CommentList } from './comments'

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      title="My Blog Admin"
    >
      <Resource
        name="posts"
        list={PostList}
        create={PostCreate}
        edit={PostEdit}
        show={PostShow}
        icon={FileText}
        options={{ label: 'Blog Posts' }}
      />
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        icon={Users}
      />
      <Resource
        name="comments"
        list={CommentList}
        icon={MessageSquare}
        options={{ label: 'Comments' }}
      />
    </Admin>
  )
}

export default App
```

### E-commerce Dashboard

```tsx
import { Admin, Resource } from 'shadmin'
import { Package, ShoppingCart, Users, Tag, BarChart } from 'lucide-react'

function EcommerceAdmin() {
  return (
    <Admin dataProvider={dataProvider} dashboard={Dashboard}>
      <Resource
        name="products"
        list={ProductList}
        create={ProductCreate}
        edit={ProductEdit}
        show={ProductShow}
        icon={Package}
      />
      <Resource
        name="orders"
        list={OrderList}
        show={OrderShow}
        icon={ShoppingCart}
        options={{ label: 'Orders' }}
      />
      <Resource
        name="customers"
        list={CustomerList}
        edit={CustomerEdit}
        show={CustomerShow}
        icon={Users}
      />
      <Resource
        name="categories"
        list={CategoryList}
        create={CategoryCreate}
        edit={CategoryEdit}
        icon={Tag}
      />
      {/* Menu-only resource (no CRUD views) */}
      <Resource
        name="analytics"
        icon={BarChart}
        options={{ label: 'Analytics Dashboard' }}
      />
    </Admin>
  )
}
```

### Menu-Only Resource

Resources without CRUD components can be used for menu entries:

```tsx
<Resource
  name="settings"
  options={{ label: 'Settings' }}
  icon={Settings}
/>
```

### Minimal Resource (List Only)

```tsx
<Resource name="logs" list={AuditLogList} />
```

### Full CRUD Resource

```tsx
<Resource
  name="posts"
  list={PostList}
  create={PostCreate}
  edit={PostEdit}
  show={PostShow}
  icon={FileText}
  options={{
    label: 'Blog Posts',
    category: 'Content',
    sortOrder: 1
  }}
/>
```

---

## ResourceDefinition Type

When a Resource is registered, it creates a `ResourceDefinition` object stored in context:

```typescript
interface ResourceDefinition {
  name: string
  icon?: ComponentType
  options?: ResourceOptions
  hasList?: boolean
  hasEdit?: boolean
  hasCreate?: boolean
  hasShow?: boolean
}
```

### Accessing Resource Definitions

```tsx
import { useResourceDefinitions, useResourceDefinition } from 'shadmin'

// Get all resource definitions
const AllResources = () => {
  const definitions = useResourceDefinitions()

  return (
    <ul>
      {Object.entries(definitions).map(([name, def]) => (
        <li key={name}>
          {def.options?.label ?? name}
        </li>
      ))}
    </ul>
  )
}

// Get a specific resource definition
const PostInfo = () => {
  const definition = useResourceDefinition('posts')

  if (!definition) return <div>Resource not found</div>

  return (
    <div>
      <h2>{definition.options?.label ?? definition.name}</h2>
      <p>Has List: {definition.hasList ? 'Yes' : 'No'}</p>
      <p>Has Create: {definition.hasCreate ? 'Yes' : 'No'}</p>
      <p>Has Edit: {definition.hasEdit ? 'Yes' : 'No'}</p>
      <p>Has Show: {definition.hasShow ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

---

## Hooks

### useResource

Returns the current resource name from context:

```tsx
import { useResource } from 'shadmin'

const MyComponent = () => {
  const resource = useResource()
  return <div>Current resource: {resource}</div>
}
```

### useResourceDefinition

Returns the definition for a specific resource:

```tsx
import { useResourceDefinition } from 'shadmin'

const MyComponent = () => {
  const definition = useResourceDefinition('posts')
  return <div>Label: {definition?.options?.label}</div>
}
```

### useResourceDefinitions

Returns all registered resource definitions:

```tsx
import { useResourceDefinitions } from 'shadmin'

const ResourceList = () => {
  const definitions = useResourceDefinitions()
  return (
    <ul>
      {Object.keys(definitions).map(name => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  )
}
```

---

## Related

- [Source: `/src/components/core/Resource.tsx`](../src/components/core/Resource.tsx)
- [Types: `/src/types/resource.ts`](../src/types/resource.ts)
- [Tests: `/src/components/core/Resource.spec.tsx`](../src/components/core/Resource.spec.tsx)
- [Admin Component: `/src/components/core/Admin.tsx`](../src/components/core/Admin.tsx)
- [AuthProvider Documentation](./auth-provider.md)
- [DataProvider Documentation](./data-provider.md)
