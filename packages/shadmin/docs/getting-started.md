# Getting Started with Shadmin

Build modern admin interfaces using React 19 and shadcn/ui components.

## Prerequisites

- **Node.js** 18.0.0 or higher
- **React** 19.0.0 or higher
- **Package Manager**: npm, yarn, or pnpm

## Installation

```bash
npm install shadmin
```

Peer dependencies (install if not already present):

```bash
npm install react@^19 react-dom@^19
```

## Basic Admin Setup

Create your admin application with the `Admin` and `Resource` components:

```tsx
import { Admin, Resource, List, Datagrid, TextField, Create, Edit, SimpleForm, TextInput } from 'shadmin'
import { BrowserRouter } from 'react-router'

// Your data provider (REST, GraphQL, etc.)
const dataProvider = {
  getList: async (resource, params) => {
    // Fetch list data from your API
    return { data: [], total: 0 }
  },
  getOne: async (resource, params) => {
    // Fetch single record
    return { data: { id: params.id } }
  },
  create: async (resource, params) => {
    // Create new record
    return { data: { id: 1, ...params.data } }
  },
  update: async (resource, params) => {
    // Update existing record
    return { data: { id: params.id, ...params.data } }
  },
  delete: async (resource, params) => {
    // Delete record
    return { data: { id: params.id } }
  },
}

function App() {
  return (
    <BrowserRouter>
      <Admin dataProvider={dataProvider} title="My Admin">
        <Resource
          name="posts"
          list={PostList}
          create={PostCreate}
          edit={PostEdit}
        />
      </Admin>
    </BrowserRouter>
  )
}
```

## First Resource Configuration

Define list, create, and edit views for your resource:

### List View

Display records in a sortable, paginated table:

```tsx
import { List, Datagrid, TextField, DateField } from 'shadmin'

function PostList() {
  return (
    <List resource="posts">
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="author" />
        <DateField source="createdAt" />
      </Datagrid>
    </List>
  )
}
```

### Create View

Form for creating new records:

```tsx
import { Create, SimpleForm, TextInput } from 'shadmin'

function PostCreate() {
  return (
    <Create resource="posts">
      <SimpleForm>
        <TextInput source="title" label="Title" required />
        <TextInput source="author" label="Author" />
        <TextInput source="body" label="Content" />
      </SimpleForm>
    </Create>
  )
}
```

### Edit View

Form for updating existing records:

```tsx
import { Edit, SimpleForm, TextInput } from 'shadmin'

function PostEdit() {
  return (
    <Edit resource="posts">
      <SimpleForm>
        <TextInput source="title" label="Title" required />
        <TextInput source="author" label="Author" />
        <TextInput source="body" label="Content" />
      </SimpleForm>
    </Edit>
  )
}
```

## Running the App

Start your development server:

```bash
npm run dev
```

Your admin interface will be available at `http://localhost:5173` (or your configured port).

## Next Steps

- [Data Provider Guide](./data-provider.md) - Connect to REST, GraphQL, or custom APIs
- [Authentication](./authentication.md) - Add login and access control
- [Custom Layout](./layout.md) - Customize sidebar, appbar, and theme
- [Input Components](./inputs.md) - TextInput, SelectInput, DateInput, and more
- [Field Components](./fields.md) - TextField, NumberField, DateField, ReferenceField
- [Forms](./forms.md) - SimpleForm, TabbedForm, validation with Zod
