# Troubleshooting Guide

This guide addresses common issues you may encounter when using shadmin, along with solutions and workarounds.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Runtime Errors](#runtime-errors)
- [Styling Issues](#styling-issues)
- [TypeScript Issues](#typescript-issues)
- [Data Fetching Issues](#data-fetching-issues)
- [Form Issues](#form-issues)
- [Layout Issues](#layout-issues)
- [FAQ](#faq)

---

## Installation Issues

### 1. "Cannot find module 'ra-core'" or Missing Peer Dependencies

**Problem**: Missing peer dependency error when importing from shadmin.

**Solution**: Install the required peer dependencies:

```bash
# Using npm
npm install react@^19.0.0 react-dom@^19.0.0

# Using pnpm
pnpm add react@^19.0.0 react-dom@^19.0.0

# Using yarn
yarn add react@^19.0.0 react-dom@^19.0.0
```

**Note**: shadmin bundles most dependencies internally, but requires React 19+ as a peer dependency.

### 2. "Module not found: Can't resolve 'shadmin'"

**Problem**: Package not found after installation.

**Solution**:

1. Verify installation:
```bash
npm list shadmin
```

2. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. Check your bundler configuration allows node_modules resolution.

### 3. React Version Mismatch

**Problem**: Errors about React version incompatibility or hooks not working.

**Solution**: Ensure you're using React 19:

```bash
npm list react react-dom
```

If using an older version, upgrade:
```bash
npm install react@^19.0.0 react-dom@^19.0.0
```

---

## Runtime Errors

### 4. "Invalid hook call" Error

**Problem**: Getting "Invalid hook call. Hooks can only be called inside of the body of a function component."

**Possible Causes**:
- Multiple React instances in your bundle
- Hooks called outside of a component
- Mismatched React and React DOM versions

**Solution**:

1. Check for duplicate React:
```bash
npm ls react
```

2. Ensure single React instance in your bundler:

```javascript
// vite.config.js
export default {
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
}
```

3. If using npm link or workspaces, ensure React is resolved from the host application.

### 5. "useContext" Returns Undefined

**Problem**: Hooks like `useRecordContext`, `useListContext` return undefined.

**Solution**: Ensure components are wrapped in the appropriate provider hierarchy:

```tsx
// Wrong - Component outside of List context
<MyRecordDisplay />

// Correct - Component inside List
<List>
  <Datagrid>
    <MyRecordDisplay />  {/* Has access to record context */}
  </Datagrid>
</List>
```

### 6. "Cannot read property 'getList' of undefined"

**Problem**: DataProvider methods not available.

**Solution**: Ensure `dataProvider` is passed to `<Admin>`:

```tsx
import { Admin, Resource } from 'shadmin'
import { dataProvider } from './dataProvider'

// Wrong
<Admin>
  <Resource name="posts" list={PostList} />
</Admin>

// Correct
<Admin dataProvider={dataProvider}>
  <Resource name="posts" list={PostList} />
</Admin>
```

---

## Styling Issues

### 7. Styles Not Applying / Unstyled Components

**Problem**: Components appear unstyled or with broken layout.

**Solution**: Ensure Tailwind CSS is configured correctly:

1. Install Tailwind:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Update `tailwind.config.js` to include shadmin:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Include shadmin components
    "./node_modules/shadmin/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. Add Tailwind directives to your CSS:
```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. Import the CSS file in your entry point:
```tsx
// src/main.tsx
import './index.css'
```

### 8. Dark Mode Not Working

**Problem**: Dark mode toggle doesn't change theme, or theme doesn't persist.

**Solution**:

1. Wrap your app with `ThemeProvider`:
```tsx
import { ThemeProvider, Admin } from 'shadmin'

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Admin dataProvider={dataProvider}>
        {/* Resources */}
      </Admin>
    </ThemeProvider>
  )
}
```

2. Add CSS variables for dark mode in your CSS:
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... other variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other variables */
  }
}
```

3. Ensure `darkMode: ["class"]` is in your Tailwind config:
```javascript
// tailwind.config.js
export default {
  darkMode: ["class"],
  // ...
}
```

### 9. CSS Variable Colors Not Working

**Problem**: Colors using CSS variables appear transparent or wrong.

**Solution**: Ensure CSS variables use HSL values without the `hsl()` wrapper:

```css
/* Wrong */
--primary: hsl(221.2, 83.2%, 53.3%);

/* Correct - just the values */
--primary: 221.2 83.2% 53.3%;
```

The Tailwind classes automatically wrap these in `hsl()`.

---

## TypeScript Issues

### 10. TypeScript Errors with Generic Types

**Problem**: TypeScript complains about missing generic type parameters.

**Solution**: Provide explicit type parameters:

```typescript
// Wrong - type not specified
const { data } = useGetList('posts')

// Correct - explicit type
interface Post {
  id: number
  title: string
  author: string
}

const { data } = useGetList<Post>('posts')
```

### 11. "Property does not exist on type" for Record Fields

**Problem**: TypeScript doesn't know the shape of your records.

**Solution**: Define and use proper record types:

```typescript
// Define your record type
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

// Use with hooks
const { data: users } = useGetList<User>('users')

// Use with components
<FunctionField<User>
  source="name"
  render={(record) => record.name.toUpperCase()}  // TypeScript knows `name` exists
/>
```

### 12. Cannot Find Module Declaration

**Problem**: TypeScript can't find type declarations for shadmin.

**Solution**:

1. Ensure TypeScript is configured correctly:
```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    // or "node16" / "nodenext"
  }
}
```

2. If still having issues, try adding to `compilerOptions`:
```json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

---

## Data Fetching Issues

### 13. DataProvider Not Connecting / Network Errors

**Problem**: API calls fail or don't reach your backend.

**Solution**:

1. Verify your DataProvider is configured correctly:
```typescript
import { Admin } from 'shadmin'
import jsonServerProvider from 'ra-data-json-server'

const dataProvider = jsonServerProvider('https://api.example.com')

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      {/* Resources */}
    </Admin>
  )
}
```

2. Check for CORS issues in browser console. Your API must allow requests from your frontend origin.

3. Test your API endpoint directly:
```bash
curl https://api.example.com/posts
```

### 14. Data Not Refreshing After Mutations

**Problem**: List doesn't update after create/edit/delete operations.

**Solution**: Shadmin uses TanStack Query for caching. Mutations should automatically invalidate queries, but if not:

1. Check that your DataProvider returns the expected data format:
```typescript
// create should return the created record
create: async (resource, params) => {
  const response = await fetch(`/api/${resource}`, {
    method: 'POST',
    body: JSON.stringify(params.data),
  })
  const data = await response.json()
  return { data }  // Must include the created record with id
}
```

2. Manually invalidate queries if needed:
```typescript
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

// After a mutation
queryClient.invalidateQueries({ queryKey: ['posts'] })
```

### 15. Debugging Data Fetching Issues

**Problem**: Need to see what's happening with data fetching.

**Solution**: Enable React Query Devtools:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Admin } from 'shadmin'

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      {/* Resources */}
      <ReactQueryDevtools initialIsOpen={false} />
    </Admin>
  )
}
```

Install devtools if needed:
```bash
npm install @tanstack/react-query-devtools
```

---

## Form Issues

### 16. Form Validation Not Working

**Problem**: Validators aren't triggering or error messages don't appear.

**Solution**: Ensure you're using the correct validation syntax:

```tsx
import { required, email, minLength } from 'shadmin'

// Using built-in validators
<TextInput
  source="email"
  validate={[required(), email()]}
/>

// Using react-hook-form rules
<TextInput
  source="password"
  rules={{
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
  }}
/>

// Custom validator function
const validateUsername = (value: string) => {
  if (value && value.length < 3) {
    return 'Username must be at least 3 characters'
  }
  return undefined
}

<TextInput
  source="username"
  validate={validateUsername}
/>
```

### 17. Form Values Not Submitting

**Problem**: Form submits but values are missing or wrong.

**Solution**:

1. Ensure `source` prop matches your data structure:
```tsx
// If your data is { user: { name: 'John' } }
<TextInput source="user.name" />  // Nested source
```

2. Check that inputs are inside a form component:
```tsx
<SimpleForm>
  <TextInput source="title" />  {/* Inside form */}
</SimpleForm>
```

3. For custom inputs, ensure they're registered:
```tsx
import { useInput } from 'shadmin'

function CustomInput({ source }) {
  const { field, fieldState } = useInput({ source })

  return (
    <input
      {...field}
      className={fieldState.error ? 'error' : ''}
    />
  )
}
```

### 18. Default Values Not Appearing in Edit Form

**Problem**: Edit form shows empty even though record has data.

**Solution**: Ensure the record is loaded before rendering the form:

```tsx
import { Edit, SimpleForm, TextInput, useRecordContext } from 'shadmin'

const EditForm = () => {
  const record = useRecordContext()

  if (!record) return <div>Loading...</div>

  return (
    <SimpleForm>
      <TextInput source="title" />
    </SimpleForm>
  )
}

const PostEdit = () => (
  <Edit>
    <EditForm />
  </Edit>
)
```

---

## Layout Issues

### 19. Sidebar Not Showing / Layout Broken

**Problem**: Layout components don't render correctly.

**Solution**: Ensure proper component hierarchy:

```tsx
import { Admin, Resource, Layout } from 'shadmin'

// Custom layout (optional)
const MyLayout = ({ children }) => (
  <Layout
    title="My Admin"
    showThemeToggle
  >
    {children}
  </Layout>
)

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      layout={MyLayout}  // Pass custom layout
    >
      <Resource name="posts" list={PostList} />
    </Admin>
  )
}
```

### 20. Menu Items Not Highlighting Active Route

**Problem**: Sidebar menu doesn't show which page is active.

**Solution**: Ensure `MenuItem` components have correct `to` prop:

```tsx
import { Menu, MenuItem } from 'shadmin'
import { FileText, Users } from 'lucide-react'

const MyMenu = () => (
  <Menu>
    <MenuItem
      to="/posts"
      label="Posts"
      icon={<FileText className="h-4 w-4" />}
    />
    <MenuItem
      to="/users"
      label="Users"
      icon={<Users className="h-4 w-4" />}
    />
  </Menu>
)
```

The `to` prop should match the resource URL pattern (`/{resourceName}`).

---

## FAQ

### Can I use shadmin with an existing react-admin project?

**Yes!** Shadmin is designed as a 100% API-compatible drop-in replacement. Migration steps:

1. Change imports from `'react-admin'` to `'shadmin'`
2. Replace MUI styling (`sx` prop) with Tailwind classes
3. Replace MUI icons with Lucide React or similar
4. Configure Tailwind CSS

See the [Migration Guide](./docs/migration-from-react-admin.md) for detailed instructions.

### Does shadmin support custom themes?

**Yes!** Shadmin uses CSS variables for theming. Customize colors in your global CSS:

```css
:root {
  --primary: 262 83% 58%;       /* Your brand color in HSL */
  --primary-foreground: 0 0% 100%;
  /* ... other variables */
}

.dark {
  --primary: 262 83% 68%;
  /* ... dark mode adjustments */
}
```

See the [Theming Guide](./docs/theming.md) for complete documentation.

### What's the minimum React version required?

**React 19+** is required. Shadmin is built specifically for React 19 and uses its latest features.

### How do I customize the Admin layout?

Pass a custom `layout` prop to the `Admin` component:

```tsx
import { Admin, Layout, Sidebar, AppBar, Menu, MenuItem } from 'shadmin'

const CustomLayout = ({ children }) => (
  <Layout
    title="My Admin"
    appBar={
      <AppBar title="My Admin" showThemeToggle />
    }
    sidebar={
      <Sidebar>
        <Menu>
          <MenuItem to="/posts" label="Posts" />
          <MenuItem to="/users" label="Users" />
        </Menu>
      </Sidebar>
    }
  >
    {children}
  </Layout>
)

<Admin dataProvider={dataProvider} layout={CustomLayout}>
  {/* Resources */}
</Admin>
```

### Can I use existing react-admin DataProviders?

**Yes!** Any DataProvider built for react-admin works with shadmin:

```typescript
import { Admin } from 'shadmin'
import jsonServerProvider from 'ra-data-json-server'
import simpleRestProvider from 'ra-data-simple-rest'

// Both work with shadmin
const provider1 = jsonServerProvider('https://api.example.com')
const provider2 = simpleRestProvider('https://api.example.com')
```

### How do I add authentication?

Use the `authProvider` prop on `Admin`:

```tsx
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
    if (error.status === 401) throw error
  },
  getPermissions: async () => {
    return localStorage.getItem('role')
  },
}

<Admin dataProvider={dataProvider} authProvider={authProvider}>
  {/* Resources */}
</Admin>
```

### How do I show notifications/toasts?

Use the `useNotify` hook:

```tsx
import { useNotify } from 'shadmin'

function MyComponent() {
  const notify = useNotify()

  const handleClick = () => {
    notify('Operation successful!', { type: 'success' })
    // Types: 'success', 'error', 'warning', 'info'
  }

  return <button onClick={handleClick}>Do Something</button>
}
```

### How do I add custom routes?

Use React Router's `Route` component inside `Admin`:

```tsx
import { Admin, Resource, CustomRoutes } from 'shadmin'
import { Route } from 'react-router'

<Admin dataProvider={dataProvider}>
  <Resource name="posts" list={PostList} />

  <CustomRoutes>
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </CustomRoutes>
</Admin>
```

### Is server-side rendering (SSR) supported?

Shadmin is primarily designed for client-side rendering. For Next.js App Router, use client components:

```tsx
// app/admin/page.tsx
'use client'

import { Admin, Resource } from 'shadmin'

export default function AdminPage() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="posts" list={PostList} />
    </Admin>
  )
}
```

### How do I handle file uploads?

Use `FileInput` or `ImageInput`:

```tsx
import { FileInput, ImageInput, ImageField } from 'shadmin'

// Single file
<FileInput source="document" accept=".pdf,.doc,.docx">
  <FileField source="src" title="title" />
</FileInput>

// Multiple images
<ImageInput source="photos" multiple accept="image/*">
  <ImageField source="src" title="title" />
</ImageInput>
```

Your DataProvider needs to handle file uploads (multipart/form-data or base64).

### Where can I get help?

1. Check this troubleshooting guide
2. Review the [documentation](./docs/)
3. Search existing [GitHub issues](https://github.com/nathanclevenger/shadmin/issues)
4. Open a new issue with a minimal reproduction

---

## Related Documentation

- [Installation Guide](./docs/installation.md)
- [Getting Started](./docs/getting-started.md)
- [Migration from react-admin](./docs/migration-from-react-admin.md)
- [Theming Guide](./docs/theming.md)
- [API Reference](./docs/hooks.md)
