# Tutorial: Building Your First Admin with Shadmin

This step-by-step tutorial will guide you through building a complete admin panel for managing a blog application. You will learn how to set up a project from scratch, connect to a REST API, create list, create, and edit views, add authentication, and customize the layout.

## What You Will Build

By the end of this tutorial, you will have a fully functional admin panel with:

- A posts management interface (list, create, edit, delete)
- A users management interface
- Authentication with login/logout
- A custom layout with navigation
- Ready for deployment

## Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm
- Basic knowledge of React and TypeScript

---

## 1. Project Setup (Vite + React 19)

Let's start by creating a new React project using Vite with TypeScript.

### Create the Project

```bash
npm create vite@latest my-admin -- --template react-ts
cd my-admin
```

### Install Dependencies

```bash
npm install
```

### Verify React 19

Ensure your `package.json` has React 19:

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

If you need to upgrade to React 19:

```bash
npm install react@^19 react-dom@^19
```

### Start the Development Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`.

---

## 2. Installing Shadmin

Now let's add shadmin and its peer dependencies.

### Install Shadmin

```bash
npm install shadmin
```

### Install React Router

Shadmin uses react-router v7 for navigation:

```bash
npm install react-router
```

### Add Tailwind CSS (Recommended)

Shadmin is built with Tailwind CSS and shadcn/ui. Add Tailwind to your project:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Update your `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Create a `src/index.css` file:

```css
@import 'tailwindcss';
```

Import it in your `src/main.tsx`:

```tsx
import './index.css'
```

---

## 3. Creating a DataProvider

The DataProvider is the core abstraction that connects your admin to your backend API. It provides a unified interface for all CRUD operations.

### Understanding the DataProvider Interface

The DataProvider defines 9 methods:

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

### Create a REST DataProvider

Create a new file `src/dataProvider.ts`:

```ts
import type { DataProvider } from 'shadmin'

const API_URL = 'https://jsonplaceholder.typicode.com'

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort

    const query = new URLSearchParams({
      _page: String(page),
      _limit: String(perPage),
      _sort: field,
      _order: order.toLowerCase(),
    })

    // Add filter parameters
    Object.entries(params.filter).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.append(key, String(value))
      }
    })

    const response = await fetch(`${API_URL}/${resource}?${query}`)
    const data = await response.json()
    const total = parseInt(response.headers.get('X-Total-Count') || '100', 10)

    return { data, total }
  },

  getOne: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`)
    const data = await response.json()
    return { data }
  },

  getMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${resource}/${id}`).then((r) => r.json())
      )
    )
    return { data: responses }
  },

  getManyReference: async (resource, params) => {
    const { target, id, pagination, sort, filter } = params

    const query = new URLSearchParams({
      [target]: String(id),
      _page: String(pagination.page),
      _limit: String(pagination.perPage),
      _sort: sort.field,
      _order: sort.order.toLowerCase(),
    })

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.append(key, String(value))
      }
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
      body: JSON.stringify(params.data),
    })
    const data = await response.json()
    return { data }
  },

  update: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.data),
    })
    const data = await response.json()
    return { data }
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params.data),
        })
      )
    )
    return { data: params.ids }
  },

  delete: async (resource, params) => {
    await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: 'DELETE',
    })
    return { data: params.previousData }
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: 'DELETE',
        })
      )
    )
    return { data: params.ids }
  },
}
```

This DataProvider connects to [JSONPlaceholder](https://jsonplaceholder.typicode.com), a free REST API for testing.

---

## 4. Setting Up Admin and Resources

Now let's create the main Admin component and configure resources.

### Create the Admin App

Replace the contents of `src/App.tsx`:

```tsx
import { BrowserRouter } from 'react-router'
import { Admin, Resource } from 'shadmin'
import { dataProvider } from './dataProvider'

// We'll create these components next
import { PostList, PostCreate, PostEdit } from './posts'
import { UserList } from './users'

function App() {
  return (
    <BrowserRouter>
      <Admin
        dataProvider={dataProvider}
        title="My Blog Admin"
      >
        <Resource
          name="posts"
          list={PostList}
          create={PostCreate}
          edit={PostEdit}
        />
        <Resource
          name="users"
          list={UserList}
        />
      </Admin>
    </BrowserRouter>
  )
}

export default App
```

### Understanding Admin and Resource

- **Admin**: The root component that sets up providers, routing, and layout
- **Resource**: Declares a resource with its name and associated views (list, create, edit, show)

The `Admin` component automatically:
- Sets up React Query for data fetching
- Configures routing for each resource
- Renders a layout with navigation
- Manages global state

---

## 5. Creating List, Create, and Edit Views

### Create the Posts Resource

Create a new file `src/posts.tsx`:

```tsx
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  ReferenceField,
  ReferenceInput,
  SelectInput,
} from 'shadmin'

// List View - displays all posts in a table
export function PostList() {
  return (
    <List
      resource="posts"
      title="All Posts"
      perPage={10}
      sort={{ field: 'id', order: 'DESC' }}
    >
      <Datagrid rowClick="edit" hover>
        <TextField source="id" />
        <TextField source="title" />
        <ReferenceField source="userId" reference="users">
          <TextField source="name" />
        </ReferenceField>
      </Datagrid>
    </List>
  )
}

// Create View - form for creating new posts
export function PostCreate() {
  return (
    <Create resource="posts">
      <SimpleForm>
        <TextInput
          source="title"
          label="Title"
          required
          rules={{ required: 'Title is required' }}
        />
        <TextInput
          source="body"
          label="Content"
          required
          rules={{ required: 'Content is required' }}
        />
        <ReferenceInput source="userId" reference="users">
          <SelectInput
            source="userId"
            label="Author"
            emptyText="Select an author"
          />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  )
}

// Edit View - form for editing existing posts
export function PostEdit() {
  return (
    <Edit resource="posts">
      <SimpleForm>
        <TextInput source="id" label="ID" disabled />
        <TextInput
          source="title"
          label="Title"
          required
          rules={{ required: 'Title is required' }}
        />
        <TextInput
          source="body"
          label="Content"
          required
          rules={{ required: 'Content is required' }}
        />
        <ReferenceInput source="userId" reference="users">
          <SelectInput
            source="userId"
            label="Author"
            emptyText="Select an author"
          />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  )
}
```

### Create the Users Resource

Create a new file `src/users.tsx`:

```tsx
import {
  List,
  Datagrid,
  TextField,
  EmailField,
} from 'shadmin'

export function UserList() {
  return (
    <List
      resource="users"
      title="Users"
      perPage={10}
    >
      <Datagrid hover>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="username" />
        <EmailField source="email" />
        <TextField source="phone" />
      </Datagrid>
    </List>
  )
}
```

### Understanding the Components

**List Components:**
- `List`: Fetches data and provides context
- `Datagrid`: Displays records in a table
- `TextField`: Displays text values
- `EmailField`: Displays email with mailto link
- `DateField`: Formats dates
- `ReferenceField`: Fetches and displays related records

**Form Components:**
- `Create`/`Edit`: Container components that handle form submission
- `SimpleForm`: Form wrapper that manages react-hook-form
- `TextInput`: Text field input
- `SelectInput`: Dropdown selection
- `ReferenceInput`: Fetches choices from another resource

### Test Your Admin

Start the dev server and navigate to `http://localhost:5173`:

```bash
npm run dev
```

You should see:
- A sidebar with Posts and Users navigation
- The Posts list with data from JSONPlaceholder
- Clickable rows that navigate to edit forms
- Create buttons for adding new records

---

## 6. Adding Authentication

Now let's add authentication to protect your admin panel.

### Create an AuthProvider

Create a new file `src/authProvider.ts`:

```ts
import type { AuthProvider } from 'shadmin'

// Simulated user database
const users = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' },
  { id: 2, username: 'editor', password: 'editor123', name: 'Editor User', role: 'editor' },
]

export const authProvider: AuthProvider = {
  // Called when the user attempts to log in
  login: async ({ username, password }) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    )

    if (!user) {
      throw new Error('Invalid username or password')
    }

    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      name: user.name,
      role: user.role,
    }))

    return { redirectTo: '/' }
  },

  // Called when the user clicks the logout button
  logout: async () => {
    localStorage.removeItem('user')
    return '/login'
  },

  // Called when navigating to verify authentication
  checkAuth: async () => {
    const user = localStorage.getItem('user')
    if (!user) {
      throw new Error('Not authenticated')
    }
  },

  // Called when the API returns an error
  checkError: async (error) => {
    const status = (error as { status?: number })?.status
    if (status === 401 || status === 403) {
      localStorage.removeItem('user')
      throw new Error('Session expired')
    }
  },

  // Called to get user permissions
  getPermissions: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role ? [user.role] : []
  },

  // Called to get user identity for display
  getIdentity: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return {
      id: user.id,
      fullName: user.name,
    }
  },
}
```

### Create a Login Page

Create a new file `src/LoginPage.tsx`:

```tsx
import { useState, type FormEvent } from 'react'
import { useLogin } from 'shadmin'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useLogin()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login({ username, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Demo credentials: admin / admin123
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

### Update the Admin Component

Update `src/App.tsx` to include the authProvider and login page:

```tsx
import { BrowserRouter } from 'react-router'
import { Admin, Resource } from 'shadmin'
import { dataProvider } from './dataProvider'
import { authProvider } from './authProvider'
import { LoginPage } from './LoginPage'

import { PostList, PostCreate, PostEdit } from './posts'
import { UserList } from './users'

function App() {
  return (
    <BrowserRouter>
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={<LoginPage />}
        title="My Blog Admin"
        requireAuth
      >
        <Resource
          name="posts"
          list={PostList}
          create={PostCreate}
          edit={PostEdit}
        />
        <Resource
          name="users"
          list={UserList}
        />
      </Admin>
    </BrowserRouter>
  )
}

export default App
```

### Test Authentication

1. Refresh the app - you should be redirected to the login page
2. Enter `admin` / `admin123` to log in
3. You should now see the admin panel
4. The user menu in the top right shows the logged-in user

---

## 7. Customizing the Layout

Shadmin provides flexible layout components that you can customize to match your brand.

### Create a Custom Layout

Create a new file `src/CustomLayout.tsx`:

```tsx
import { type ReactNode, useState } from 'react'
import {
  Layout,
  Menu,
  MenuItem,
  DashboardMenuItem,
  useLogout,
} from 'shadmin'
import { Outlet } from 'react-router'

// Icons (you can use lucide-react or any icon library)
const FileTextIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

interface CustomLayoutProps {
  children?: ReactNode
}

function CustomMenu() {
  return (
    <Menu aria-label="Main navigation" className="px-2">
      <DashboardMenuItem />
      <MenuItem
        to="/posts"
        label="Posts"
        icon={<FileTextIcon />}
      />
      <MenuItem
        to="/users"
        label="Users"
        icon={<UsersIcon />}
      />
    </Menu>
  )
}

export function CustomLayout({ children }: CustomLayoutProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const { logout } = useLogout()

  return (
    <Layout
      title="Blog Admin"
      menu={CustomMenu}
      showThemeToggle
      theme={theme}
      onThemeChange={setTheme}
    >
      {children || <Outlet />}
    </Layout>
  )
}
```

### Use the Custom Layout

Update `src/App.tsx`:

```tsx
import { BrowserRouter } from 'react-router'
import { Admin, Resource } from 'shadmin'
import { dataProvider } from './dataProvider'
import { authProvider } from './authProvider'
import { LoginPage } from './LoginPage'
import { CustomLayout } from './CustomLayout'

import { PostList, PostCreate, PostEdit } from './posts'
import { UserList } from './users'

function App() {
  return (
    <BrowserRouter>
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={<LoginPage />}
        layout={CustomLayout}
        title="My Blog Admin"
        requireAuth
      >
        <Resource
          name="posts"
          list={PostList}
          create={PostCreate}
          edit={PostEdit}
        />
        <Resource
          name="users"
          list={UserList}
        />
      </Admin>
    </BrowserRouter>
  )
}

export default App
```

### Add a Dashboard

Create a dashboard component `src/Dashboard.tsx`:

```tsx
import { useGetList } from 'shadmin'

export function Dashboard() {
  const { data: posts, total: totalPosts } = useGetList('posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'id', order: 'DESC' },
    filter: {},
  })

  const { total: totalUsers } = useGetList('users', {
    pagination: { page: 1, perPage: 1 },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Total Posts
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalPosts ?? '-'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalUsers ?? '-'}
          </p>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {posts?.map((post) => (
            <li key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <p className="font-medium text-gray-900 dark:text-white">
                {post.title as string}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

Add the dashboard to your Admin:

```tsx
import { Dashboard } from './Dashboard'

// In App.tsx
<Admin
  dataProvider={dataProvider}
  authProvider={authProvider}
  loginPage={<LoginPage />}
  layout={CustomLayout}
  dashboard={<Dashboard />}
  title="My Blog Admin"
  requireAuth
>
  {/* Resources */}
</Admin>
```

---

## 8. Deploying

Your admin is now ready for deployment. Here are deployment options for popular platforms.

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and configure the build

Or deploy via CLI:

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

1. Push your code to GitHub
2. Import on [Netlify](https://netlify.com)
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

Or create a `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deploy to Cloudflare Pages

1. Push your code to GitHub
2. Create a new Pages project on [Cloudflare](https://pages.cloudflare.com)
3. Configure:
   - Build command: `npm run build`
   - Build output directory: `dist`

### SPA Routing Configuration

Since shadmin is a Single Page Application, configure your server to redirect all routes to `index.html`.

For **nginx**:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

For **Apache** (`.htaccess`):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Environment Variables

For production, store your API URL in environment variables:

Create `.env.production`:

```
VITE_API_URL=https://api.yoursite.com
```

Update your DataProvider:

```ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

---

## Next Steps

Congratulations! You have built a complete admin panel with shadmin. Here are some ways to extend your admin:

### Add More Features

- **Filtering**: Add `SearchInput` and `FilterForm` to your lists
- **Bulk Actions**: Enable `bulkActionButtons` on Datagrid
- **Show View**: Add a `show` prop to Resource for read-only detail views
- **Tabbed Forms**: Use `TabbedForm` for complex edit screens

### Explore More Components

- **Field Components**: `NumberField`, `BooleanField`, `UrlField`, `ReferenceField`
- **Input Components**: `NumberInput`, `BooleanInput`, `DateInput`, `SelectInput`
- **Layout Components**: `Sidebar`, `AppBar`, `Menu`, `SubMenu`

### Learn More

- [DataProvider Documentation](./data-provider.md) - Advanced data fetching patterns
- [AuthProvider Documentation](./auth-provider.md) - JWT, OAuth, and RBAC
- [Layout Components](./layout-components.md) - Customize your admin layout
- [Input Components](./input-components.md) - All available form inputs
- [Field Components](./field-components.md) - All available display fields
- [List Components](./list-components.md) - Datagrid, filters, and pagination

---

## Complete Project Structure

Here is the final project structure:

```
my-admin/
├── src/
│   ├── App.tsx              # Main app with Admin configuration
│   ├── main.tsx             # Entry point
│   ├── index.css            # Tailwind imports
│   ├── dataProvider.ts      # REST API data provider
│   ├── authProvider.ts      # Authentication provider
│   ├── LoginPage.tsx        # Login form component
│   ├── CustomLayout.tsx     # Custom layout with menu
│   ├── Dashboard.tsx        # Dashboard component
│   ├── posts.tsx            # Posts resource views
│   └── users.tsx            # Users resource views
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Summary

In this tutorial, you learned how to:

1. **Set up a project** with Vite and React 19
2. **Install shadmin** and configure Tailwind CSS
3. **Create a DataProvider** to connect to a REST API
4. **Configure Admin and Resources** for your data model
5. **Build List, Create, and Edit views** with Fields and Inputs
6. **Add authentication** with AuthProvider and a login page
7. **Customize the layout** with menus and themes
8. **Deploy** to production platforms

You now have the knowledge to build production-ready admin panels with shadmin. Happy coding!
