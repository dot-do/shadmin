# Shadmin

**A 100% API-compatible drop-in replacement for React Admin using ShadCN UI** - Modern, beautiful admin interfaces with native mongo.do integration.

[![npm version](https://img.shields.io/npm/v/shadmin.svg)](https://www.npmjs.com/package/shadmin)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Why Shadmin?

React Admin's architecture is excellent - the problem is MUI's dated aesthetics and heavy runtime. Shadmin preserves the API, replaces the rendering layer:

- **Drop-in Replacement** - Just change your import, keep your existing code
- **Modern Aesthetics** - ShadCN components with Tailwind CSS v4 and CSS variables
- **Native mongo.do Integration** - Zero-config data layer for edge deployment
- **Lightweight Runtime** - No MUI JSS overhead, just utility classes
- **Copy-Paste Ownership** - Components live in your codebase, fully customizable
- **React 19 Ready** - Built on the latest React with TanStack Query

```typescript
// Before (React Admin)
import { Admin, Resource, List, Datagrid, TextField } from 'react-admin'

// After (Shadmin) - Just change the import!
import { Admin, Resource, List, Datagrid, TextField } from 'shadmin'
```

---

## Features

### Core Components

| Component | Description |
|-----------|-------------|
| `<Admin>` | Root provider orchestration with routing, data, and auth providers |
| `<Resource>` | CRUD route registration for a data resource |
| `<List>` | List view with pagination, sorting, and filtering |
| `<Datagrid>` | Data table powered by TanStack Table |
| `<Create>` | Create form wrapper with record creation |
| `<Edit>` | Edit form wrapper with record update |
| `<Show>` | Read-only detail view |
| `<SimpleForm>` | Form container with validation |
| `<TabbedForm>` | Multi-tab form layout |

### Field Components

| Field | Description |
|-------|-------------|
| `TextField` | Renders text values |
| `NumberField` | Formatted numbers via `Intl.NumberFormat` |
| `DateField` | Formatted dates via `Intl.DateTimeFormat` |
| `BooleanField` | Badge or icon for boolean values |
| `EmailField` | Clickable mailto link |
| `UrlField` | External link |
| `ReferenceField` | Fetches and renders related records |
| `ReferenceManyField` | Renders a list of related records |
| `ReferenceArrayField` | Renders an array of references |
| `ArrayField` | Iterator for array values |
| `FunctionField` | Custom render function |

### Input Components

| Input | Description |
|-------|-------------|
| `TextInput` | Standard text input with label |
| `NumberInput` | Numeric input with formatting |
| `PasswordInput` | Password input with visibility toggle |
| `DateTimeInput` | Date and time picker |
| `SelectInput` | Dropdown selection |
| `SelectArrayInput` | Multi-select dropdown |
| `BooleanInput` | Switch toggle |
| `RadioButtonGroupInput` | Radio button group |
| `CheckboxGroupInput` | Checkbox array |

### Layout & Navigation

| Component | Description |
|-----------|-------------|
| `Layout` | Main layout with sidebar |
| `AppBar` | Top navigation bar |
| `Menu` | Sidebar navigation |
| `MenuItem` | Menu item with icon |
| `SubMenu` | Collapsible submenu |

### Data Provider (9 Methods)

| Method | Description |
|--------|-------------|
| `getList` | Fetch a list with pagination, sorting, filtering |
| `getOne` | Fetch a single record by ID |
| `getMany` | Fetch multiple records by IDs |
| `getManyReference` | Fetch related records |
| `create` | Create a new record |
| `update` | Update a single record |
| `updateMany` | Update multiple records |
| `delete` | Delete a single record |
| `deleteMany` | Delete multiple records |

---

## Quick Start

### Install

```bash
npm install shadmin
```

### Basic Usage

```tsx
import { Admin, Resource, List, Datagrid, TextField, DateField } from 'shadmin'
import { createMondoDataProvider } from 'shadmin-db'
import { MongoClient } from 'mongo.do'

// Connect to mongo.do
const client = new MongoClient('https://your-worker.workers.dev')
const dataProvider = createMondoDataProvider({ client, database: 'myapp' })

// Define your list view
const PostList = () => (
  <List>
    <Datagrid>
      <TextField source="title" />
      <TextField source="author" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
)

// Create your admin
export const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} />
    <Resource name="users" list={UserList} />
  </Admin>
)
```

### Scaffold a New Project

```bash
npx create-shadmin my-admin
cd my-admin
npm run dev
```

---

## Quick Start Example: ToDo App

A complete, copy-pastable ToDo application in under 100 lines:

```tsx
import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  BooleanField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  DataProvider,
} from 'shadmin'

// In-memory mock data provider
let todos = [
  { id: 1, title: 'Learn Shadmin', completed: true },
  { id: 2, title: 'Build an admin panel', completed: false },
  { id: 3, title: 'Deploy to production', completed: false },
]
let nextId = 4

const dataProvider: DataProvider = {
  getList: async () => ({ data: todos, total: todos.length }),
  getOne: async (resource, { id }) => ({
    data: todos.find((t) => t.id === Number(id))!,
  }),
  getMany: async (resource, { ids }) => ({
    data: todos.filter((t) => ids.includes(t.id)),
  }),
  getManyReference: async () => ({ data: [], total: 0 }),
  create: async (resource, { data }) => {
    const newTodo = { ...data, id: nextId++ }
    todos.push(newTodo)
    return { data: newTodo }
  },
  update: async (resource, { id, data }) => {
    const index = todos.findIndex((t) => t.id === Number(id))
    todos[index] = { ...todos[index], ...data }
    return { data: todos[index] }
  },
  updateMany: async (resource, { ids, data }) => {
    ids.forEach((id) => {
      const index = todos.findIndex((t) => t.id === Number(id))
      todos[index] = { ...todos[index], ...data }
    })
    return { data: ids }
  },
  delete: async (resource, { id }) => {
    const deleted = todos.find((t) => t.id === Number(id))!
    todos = todos.filter((t) => t.id !== Number(id))
    return { data: deleted }
  },
  deleteMany: async (resource, { ids }) => {
    todos = todos.filter((t) => !ids.includes(t.id))
    return { data: ids }
  },
}

// List view with Datagrid
const TodoList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <BooleanField source="completed" />
    </Datagrid>
  </List>
)

// Create form
const TodoCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" />
      <BooleanInput source="completed" defaultValue={false} />
    </SimpleForm>
  </Create>
)

// Edit form
const TodoEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <BooleanInput source="completed" />
    </SimpleForm>
  </Edit>
)

// App entry point
export default function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="todos"
        list={TodoList}
        create={TodoCreate}
        edit={TodoEdit}
      />
    </Admin>
  )
}
```

Run it:

```bash
npm install shadmin
# Add the above code to your App.tsx and start your dev server
```

---

## Examples

### List with Filters and Pagination

```tsx
import { List, Datagrid, TextField, DateField, SearchInput, FilterButton } from 'shadmin'

const PostFilters = [
  <SearchInput source="q" alwaysOn />,
  <SelectInput source="status" choices={[
    { id: 'draft', name: 'Draft' },
    { id: 'published', name: 'Published' },
  ]} />,
]

const PostList = () => (
  <List
    filters={PostFilters}
    sort={{ field: 'createdAt', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid>
      <TextField source="title" />
      <TextField source="author" />
      <DateField source="createdAt" />
      <BooleanField source="published" />
    </Datagrid>
  </List>
)
```

### Create and Edit Forms

```tsx
import { Create, Edit, SimpleForm, TextInput, DateTimeInput, SelectInput } from 'shadmin'

const PostCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={required()} />
      <TextInput source="body" multiline rows={5} />
      <SelectInput source="status" choices={[
        { id: 'draft', name: 'Draft' },
        { id: 'published', name: 'Published' },
      ]} />
    </SimpleForm>
  </Create>
)

const PostEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" validate={required()} />
      <TextInput source="body" multiline rows={5} />
      <DateTimeInput source="publishedAt" />
    </SimpleForm>
  </Edit>
)
```

### Tabbed Form

```tsx
import { Edit, TabbedForm, FormTab, TextInput, ReferenceArrayInput } from 'shadmin'

const PostEdit = () => (
  <Edit>
    <TabbedForm>
      <FormTab label="Content">
        <TextInput source="title" />
        <TextInput source="body" multiline />
      </FormTab>
      <FormTab label="Metadata">
        <DateTimeInput source="publishedAt" />
        <ReferenceArrayInput source="tags" reference="tags" />
      </FormTab>
    </TabbedForm>
  </Edit>
)
```

### Show View with References

```tsx
import { Show, SimpleShowLayout, TextField, DateField, ReferenceField, ReferenceManyField, Datagrid } from 'shadmin'

const PostShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" />
      <ReferenceField source="authorId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="createdAt" />
      <ReferenceManyField reference="comments" target="postId" label="Comments">
        <Datagrid>
          <TextField source="body" />
          <DateField source="createdAt" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
)
```

### Custom Data Provider

```tsx
import { DataProvider } from 'shadmin'

const myDataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    const response = await fetch(`/api/${resource}?page=${page}&perPage=${perPage}&sort=${field}&order=${order}`)
    const { data, total } = await response.json()
    return { data, total }
  },
  getOne: async (resource, params) => {
    const response = await fetch(`/api/${resource}/${params.id}`)
    const data = await response.json()
    return { data }
  },
  // ... implement other methods
}
```

---

## Architecture

```
+-----------------------------------------------------------------------------+
|                           Your App                                          |
|         <Admin dataProvider={mondoProvider} authProvider={...}>             |
|           <Resource name="users" list={UserList} edit={UserEdit} />         |
|         </Admin>                                                            |
+-----------------------------------------------------------------------------+
|                         SHADMIN LAYER                                       |
|  +-----------------------------------------------------------------------+  |
|  | Components (React Admin API-compatible, ShadCN-rendered)              |  |
|  |  * Admin, Resource, List, Datagrid, Create, Edit, Show                |  |
|  |  * Field components (TextField, DateField, ReferenceField...)         |  |
|  |  * Input components (TextInput, DateInput, SelectInput...)            |  |
|  |  * Layout (Sidebar, AppBar, Breadcrumb)                               |  |
|  +-----------------------------------------------------------------------+  |
|  +-----------------------------------------------------------------------+  |
|  | Contexts & Hooks (identical to React Admin)                           |  |
|  |  * RecordContext, ListContext, FormContext, ResourceContext           |  |
|  |  * useRecordContext, useDataProvider, useNotify, useRedirect          |  |
|  +-----------------------------------------------------------------------+  |
|  +-----------------------------------------------------------------------+  |
|  | DataProvider Interface (9 methods, identical signature)               |  |
|  |  * getList, getOne, getMany, getManyReference                         |  |
|  |  * create, update, updateMany, delete, deleteMany                     |  |
|  +-----------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------+
|                       MONGO.DO DATA LAYER (Optional)                        |
|  +-----------------------------------------------------------------------+  |
|  | mondoDataProvider (native integration)                                |  |
|  |  * Translates DataProvider calls -> mongo.do RPC                      |  |
|  |  * Optimistic updates with change stream sync                         |  |
|  |  * Connection pooling & request deduplication (built into mongo.do)   |  |
|  +-----------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------+
```

---

## Packages

| Package | Description |
|---------|-------------|
| `shadmin` | Core components, hooks, and contexts |
| `shadmin-db` | mongo.do DataProvider integration |
| `create-shadmin` | CLI scaffolding tool |

---

## Configuration

### With mongo.do

```tsx
import { Admin, Resource } from 'shadmin'
import { createMondoDataProvider } from 'shadmin-db'
import { MongoClient } from 'mongo.do'

const client = new MongoClient('https://your-worker.workers.dev')
const dataProvider = createMondoDataProvider({
  client,
  database: 'myapp',
})

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} />
  </Admin>
)
```

### With Authentication

```tsx
import { Admin, Resource } from 'shadmin'

const authProvider = {
  login: async ({ username, password }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) throw new Error('Login failed')
    const { token } = await response.json()
    localStorage.setItem('token', token)
  },
  logout: async () => {
    localStorage.removeItem('token')
  },
  checkAuth: async () => {
    if (!localStorage.getItem('token')) throw new Error('Not authenticated')
  },
  checkError: async (error) => {
    if (error.status === 401) {
      localStorage.removeItem('token')
      throw new Error('Session expired')
    }
  },
  getPermissions: async () => {
    return localStorage.getItem('permissions')
  },
}

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name="posts" list={PostList} />
  </Admin>
)
```

### Custom Layout

```tsx
import { Admin, Resource, Layout, Menu, MenuItem, AppBar } from 'shadmin'

const CustomMenu = () => (
  <Menu>
    <MenuItem to="/posts" primaryText="Posts" leftIcon={<FileIcon />} />
    <MenuItem to="/users" primaryText="Users" leftIcon={<UserIcon />} />
  </Menu>
)

const CustomLayout = (props) => (
  <Layout {...props} menu={CustomMenu} appBar={AppBar} />
)

const App = () => (
  <Admin dataProvider={dataProvider} layout={CustomLayout}>
    <Resource name="posts" list={PostList} />
  </Admin>
)
```

---

## Technology Stack

| Category | Technology |
|----------|------------|
| **Runtime** | React 19, TypeScript 5.7 |
| **Build** | Vite, vite-plugin-dts |
| **Styling** | Tailwind CSS v4, CSS Variables |
| **Components** | ShadCN UI, Radix UI |
| **Forms** | react-hook-form, Zod |
| **Tables** | TanStack Table |
| **Routing** | React Router v7 |
| **State** | TanStack Query |
| **Testing** | Vitest, React Testing Library, Playwright |
| **Visual Testing** | Storybook 8, Chromatic |
| **Package Manager** | pnpm workspaces |

---

## Development

```bash
# Clone the repository
git clone https://github.com/nathanclevenger/shadmin.git
cd shadmin

# Install dependencies
pnpm install

# Run all packages in dev mode
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test --coverage

# Run Storybook
pnpm storybook

# Build all packages
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format code
pnpm format
```

### Running Tests

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests with Playwright
pnpm test:e2e

# Visual regression with Chromatic
pnpm chromatic
```

### Project Structure

```
packages/
  shadmin/                  # Main package
    src/
      components/
        core/               # Admin, Resource, CoreAdminContext
        list/               # List, Datagrid, Pagination, Filters
        detail/             # Create, Edit, Show
        form/               # SimpleForm, TabbedForm, Toolbar
        field/              # TextField, DateField, ReferenceField...
        input/              # TextInput, SelectInput, ReferenceInput...
        layout/             # Layout, Sidebar, AppBar, Menu
        auth/               # Login, Logout, AuthRequired
      contexts/             # RecordContext, ListContext, FormContext...
      hooks/                # useGetList, useCreate, useNotify...
      types/                # TypeScript interfaces
      utils/                # Shared utilities
  shadmin-db/            # mongo.do integration
    src/
      data-provider.ts      # createMondoDataProvider
  create-shadmin/           # CLI scaffolding
    src/
      index.ts              # CLI entry point
    templates/              # Project templates
```

---

## License

MIT - see [LICENSE](LICENSE)

---

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests following TDD (RED -> GREEN -> REFACTOR)
4. Add Storybook stories for new components
5. Ensure all tests pass (`pnpm test`)
6. Submit a pull request

---

<p align="center">
  <strong>Built for the edge. Designed for AI. Styled with taste.</strong>
</p>
