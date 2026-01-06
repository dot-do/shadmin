# Admin Component

The `Admin` component is the root component for a Shadmin application. It orchestrates providers, routing, and layout, serving as the entry point for your entire admin interface.

**Note**: Shadmin is 100% API-compatible with react-admin.

## Import

```tsx
import { Admin } from 'shadmin'
```

## Basic Usage

```tsx
import { Admin, Resource } from 'shadmin'
import { dataProvider } from './dataProvider'
import { PostList, PostEdit, PostCreate } from './posts'
import { UserList } from './users'

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
    <Resource name="users" list={UserList} />
  </Admin>
)
```

## Props Reference

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `dataProvider` | `DataProvider` | The data provider for API calls. This is the only required prop. |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Child `Resource` components |
| `authProvider` | `AuthProvider` | - | Authentication provider for login/logout and permissions |
| `layout` | `ComponentType<AdminLayoutProps>` | - | Custom layout component wrapping all views |
| `dashboard` | `ComponentType` | - | Dashboard component shown on the home route |
| `theme` | `ThemeOptions` | - | Light theme configuration options |
| `darkTheme` | `ThemeOptions` | - | Dark theme configuration options |
| `basename` | `string` | `''` | Base path for routing (e.g., `/admin`) |
| `title` | `string` | `'Shadmin'` | Application title |
| `disableTelemetry` | `boolean` | - | Disable telemetry if set to `true` |
| `loginPage` | `ComponentType \| false` | - | Custom login page component, or `false` to disable |
| `error` | `ComponentType<ErrorProps>` | `DefaultErrorComponent` | Custom error boundary component |
| `loading` | `ComponentType` | - | Loading indicator component |
| `notification` | `ComponentType` | - | Custom notification component |
| `ready` | `ComponentType` | - | Ready handler component |

## Prop Details

### dataProvider (Required)

The `dataProvider` is the only required prop. It handles all communication with your API. The provider must implement the `DataProvider` interface with these methods:

```typescript
interface DataProvider {
  getList: (resource: string, params: GetListParams) => Promise<GetListResult>
  getOne: (resource: string, params: GetOneParams) => Promise<GetOneResult>
  getMany: (resource: string, params: GetManyParams) => Promise<GetManyResult>
  getManyReference: (resource: string, params: GetManyReferenceParams) => Promise<GetManyReferenceResult>
  create: (resource: string, params: CreateParams) => Promise<CreateResult>
  update: (resource: string, params: UpdateParams) => Promise<UpdateResult>
  updateMany: (resource: string, params: UpdateManyParams) => Promise<UpdateManyResult>
  delete: (resource: string, params: DeleteParams) => Promise<DeleteResult>
  deleteMany: (resource: string, params: DeleteManyParams) => Promise<DeleteManyResult>
}
```

**Example:**

```tsx
import { Admin } from 'shadmin'
import jsonServerProvider from 'ra-data-json-server'

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com')

const App = () => (
  <Admin dataProvider={dataProvider}>
    {/* Resources */}
  </Admin>
)
```

### authProvider

The `authProvider` handles authentication, authorization, and user identity. When provided, Shadmin will protect routes and show login/logout functionality.

```typescript
interface AuthProvider {
  login: (params: unknown) => Promise<unknown>
  logout: (params?: unknown) => Promise<void | false | string>
  checkError: (error: unknown) => Promise<void>
  checkAuth: (params?: unknown) => Promise<void>
  getPermissions: (params?: unknown) => Promise<unknown>
  getIdentity?: () => Promise<UserIdentity>
  handleCallback?: (params?: unknown) => Promise<AuthRedirectResult | void | null>
}
```

**Example:**

```tsx
import { Admin } from 'shadmin'

const authProvider = {
  login: async ({ username, password }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) throw new Error('Invalid credentials')
    const { token } = await response.json()
    localStorage.setItem('token', token)
  },
  logout: async () => {
    localStorage.removeItem('token')
  },
  checkAuth: async () => {
    if (!localStorage.getItem('token')) {
      throw new Error('Not authenticated')
    }
  },
  checkError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      throw new Error('Session expired')
    }
  },
  getPermissions: async () => {
    return localStorage.getItem('permissions')
  },
  getIdentity: async () => {
    return {
      id: 'user-1',
      fullName: 'John Doe',
      avatar: '/avatar.png',
    }
  },
}

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    {/* Resources */}
  </Admin>
)
```

### layout

A custom layout component that wraps all views. Use this to customize the application shell, including the sidebar, app bar, and content area.

```typescript
interface AdminLayoutProps {
  children: ReactNode
  dashboard?: ComponentType
  menu?: ComponentType
}
```

**Example:**

```tsx
import { Admin } from 'shadmin'

const MyLayout = ({ children, dashboard, menu }) => (
  <div className="flex h-screen">
    <aside className="w-64 bg-gray-800">
      {menu && <menu />}
    </aside>
    <main className="flex-1 p-4">
      {children}
    </main>
  </div>
)

const App = () => (
  <Admin dataProvider={dataProvider} layout={MyLayout}>
    {/* Resources */}
  </Admin>
)
```

### dashboard

A component displayed on the root route (`/`). Use this for summary statistics, recent activity, or quick actions.

**Example:**

```tsx
import { Admin } from 'shadmin'

const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Welcome to the Admin</h1>
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="p-4 bg-blue-100 rounded">
        <h2>Total Users</h2>
        <p className="text-3xl font-bold">1,234</p>
      </div>
      <div className="p-4 bg-green-100 rounded">
        <h2>Total Posts</h2>
        <p className="text-3xl font-bold">5,678</p>
      </div>
      <div className="p-4 bg-yellow-100 rounded">
        <h2>Active Orders</h2>
        <p className="text-3xl font-bold">42</p>
      </div>
    </div>
  </div>
)

const App = () => (
  <Admin dataProvider={dataProvider} dashboard={Dashboard}>
    {/* Resources */}
  </Admin>
)
```

### theme and darkTheme

Configure light and dark theme options for the application.

```typescript
interface ThemeOptions {
  palette?: Record<string, unknown>
  typography?: Record<string, unknown>
  [key: string]: unknown
}
```

**Example:**

```tsx
import { Admin } from 'shadmin'

const lightTheme = {
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
}

const darkTheme = {
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
  },
}

const App = () => (
  <Admin
    dataProvider={dataProvider}
    theme={lightTheme}
    darkTheme={darkTheme}
  >
    {/* Resources */}
  </Admin>
)
```

### basename

Sets the base path for all routes. Useful when your admin is mounted at a sub-path.

**Example:**

```tsx
// Admin is accessible at /admin/posts, /admin/users, etc.
const App = () => (
  <Admin dataProvider={dataProvider} basename="/admin">
    <Resource name="posts" list={PostList} />
    <Resource name="users" list={UserList} />
  </Admin>
)
```

### title

Sets the application title displayed in the browser tab and app bar.

**Example:**

```tsx
const App = () => (
  <Admin dataProvider={dataProvider} title="My Company Admin">
    {/* Resources */}
  </Admin>
)
```

### loginPage

A custom login page component, or `false` to disable the built-in login page.

**Example:**

```tsx
import { Admin } from 'shadmin'

const CustomLoginPage = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <form className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <input type="text" placeholder="Username" className="w-full p-2 mb-2 border" />
      <input type="password" placeholder="Password" className="w-full p-2 mb-4 border" />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </form>
  </div>
)

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={CustomLoginPage}
  >
    {/* Resources */}
  </Admin>
)

// Or disable login page entirely
const AppNoLogin = () => (
  <Admin dataProvider={dataProvider} loginPage={false}>
    {/* Resources */}
  </Admin>
)
```

### error

A custom error boundary component shown when an error occurs.

```typescript
interface ErrorProps {
  error: Error
  errorInfo?: React.ErrorInfo
  resetErrorBoundary?: () => void
}
```

**Example:**

```tsx
import { Admin } from 'shadmin'

const CustomErrorPage = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
    <p className="text-gray-600 mt-2">{error.message}</p>
    {resetErrorBoundary && (
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try Again
      </button>
    )}
  </div>
)

const App = () => (
  <Admin dataProvider={dataProvider} error={CustomErrorPage}>
    {/* Resources */}
  </Admin>
)
```

## Provider Integration

The `Admin` component automatically sets up several context providers:

### Provider Hierarchy

```
<QueryClientProvider>           // TanStack Query for data fetching
  <DataProviderContextProvider> // Data provider context
    <AuthProviderContextProvider> // Auth provider context (if authProvider is provided)
      <ResourceDefinitionContextProvider> // Resource definitions
        <ResourceRegistrationContext.Provider> // Resource registration
          <ErrorBoundary>       // Error boundary
            {children}          // Resource components
            <CoreAdminRoutes /> // Route handling
          </ErrorBoundary>
        </ResourceRegistrationContext.Provider>
      </ResourceDefinitionContextProvider>
    </AuthProviderContextProvider>
  </DataProviderContextProvider>
</QueryClientProvider>
```

### QueryClient Configuration

The Admin component creates a TanStack Query client with these defaults:

```typescript
{
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
}
```

## Complete Usage Examples

### Minimal Setup

```tsx
import { Admin, Resource } from 'shadmin'
import jsonServerProvider from 'ra-data-json-server'

const dataProvider = jsonServerProvider('https://api.example.com')

const PostList = () => <div>Post List</div>

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} />
  </Admin>
)

export default App
```

### Full-Featured Setup

```tsx
import { Admin, Resource } from 'shadmin'
import { dataProvider } from './providers/dataProvider'
import { authProvider } from './providers/authProvider'
import { MyLayout } from './layout/MyLayout'
import { Dashboard } from './Dashboard'
import { CustomErrorPage } from './CustomErrorPage'
import { CustomLoginPage } from './CustomLoginPage'

// Resources
import { PostList, PostEdit, PostCreate, PostShow, PostIcon } from './posts'
import { UserList, UserEdit, UserCreate, UserIcon } from './users'
import { CommentList, CommentIcon } from './comments'

const lightTheme = {
  palette: {
    primary: { main: '#1976d2' },
  },
}

const darkTheme = {
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
  },
}

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    layout={MyLayout}
    dashboard={Dashboard}
    theme={lightTheme}
    darkTheme={darkTheme}
    basename="/admin"
    title="My Admin Panel"
    loginPage={CustomLoginPage}
    error={CustomErrorPage}
    disableTelemetry
  >
    <Resource
      name="posts"
      list={PostList}
      edit={PostEdit}
      create={PostCreate}
      show={PostShow}
      icon={PostIcon}
      options={{ label: 'Blog Posts' }}
    />
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      create={UserCreate}
      icon={UserIcon}
      options={{ label: 'User Management' }}
    />
    <Resource
      name="comments"
      list={CommentList}
      icon={CommentIcon}
    />
  </Admin>
)

export default App
```

### Multiple Admin Instances

```tsx
import { Admin, Resource } from 'shadmin'

// Main admin
const MainAdmin = () => (
  <Admin dataProvider={mainDataProvider} basename="/admin">
    <Resource name="posts" list={PostList} />
  </Admin>
)

// Separate reporting admin
const ReportingAdmin = () => (
  <Admin dataProvider={reportingDataProvider} basename="/reports">
    <Resource name="sales" list={SalesList} />
  </Admin>
)
```

## Resource Component

The `Admin` component works with `Resource` children to define manageable entities:

```tsx
interface ResourceProps {
  name: string              // Resource identifier (required)
  list?: ComponentType      // List view component
  edit?: ComponentType      // Edit view component
  create?: ComponentType    // Create view component
  show?: ComponentType      // Show view component
  icon?: ComponentType      // Icon for menu
  options?: ResourceOptions // Additional options like label
  children?: ReactNode      // Nested resources
}
```

Resources automatically generate routes:
- List: `/{basename}/{resource}`
- Create: `/{basename}/{resource}/create`
- Edit: `/{basename}/{resource}/{id}`
- Show: `/{basename}/{resource}/{id}/show`

## Error Handling

The Admin component includes a built-in error boundary that catches errors in child components. The default error component shows:

- Error message
- Retry button to reset the error state

You can provide a custom `error` prop to customize the error UI.

## See Also

- [Data Provider Documentation](./data-provider.md)
- [Auth Provider Documentation](./auth-provider.md)
- [Getting Started Guide](./getting-started.md)
