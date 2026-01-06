# Migration Guide: react-admin to shadmin

This guide provides a comprehensive walkthrough for migrating your application from react-admin to shadmin. Shadmin is designed to be 100% API-compatible with react-admin, making migration straightforward while offering modern React 19 features and shadcn/ui-based styling.

## Table of Contents

- [Key Differences](#key-differences)
- [Component Mapping](#component-mapping)
- [DataProvider Compatibility](#dataprovider-compatibility)
- [AuthProvider Compatibility](#authprovider-compatibility)
- [Step-by-Step Migration Process](#step-by-step-migration-process)
- [Common Migration Issues and Solutions](#common-migration-issues-and-solutions)
- [Feature Comparison](#feature-comparison)

---

## Key Differences

### Framework and Dependencies

| Aspect | react-admin | shadmin |
|--------|-------------|---------|
| React Version | React 17/18 | React 19+ |
| UI Framework | Material UI (MUI) | shadcn/ui + Tailwind CSS |
| Form Library | react-hook-form | react-hook-form |
| Data Fetching | react-query / TanStack Query | TanStack Query v5 |
| Routing | react-router | react-router v7 |
| Styling | MUI sx prop, CSS-in-JS | Tailwind CSS, className |
| Bundle Size | Larger (MUI included) | Smaller (tree-shakeable) |

### Design Philosophy

1. **Modern React**: shadmin is built for React 19, leveraging the latest features and optimizations.

2. **shadcn/ui Components**: Instead of Material UI, shadmin uses shadcn/ui components which are:
   - Highly customizable
   - Copy-paste friendly
   - Built on Radix UI primitives
   - Styled with Tailwind CSS

3. **Tailwind CSS First**: All styling uses Tailwind CSS utility classes, making customization intuitive for developers familiar with Tailwind.

4. **API Compatibility**: Despite the visual differences, shadmin maintains 100% API compatibility with react-admin for:
   - DataProvider interface
   - AuthProvider interface
   - Core hooks (useGetList, useGetOne, useCreate, useUpdate, useDelete, etc.)
   - Component props (source, resource, label, etc.)

### What Changes

| Area | react-admin | shadmin |
|------|-------------|---------|
| Styling | `sx` prop, MUI `styled()` | `className` with Tailwind |
| Theme | MUI theme object | CSS variables, Tailwind config |
| Icons | MUI icons | Lucide React (or any React icons) |
| Buttons | MUI Button | shadcn Button with variants |
| Forms | MUI TextField, etc. | shadcn Input, Select, etc. |
| Tables | MUI Table | shadcn Table (via TanStack Table) |

### What Stays the Same

- DataProvider interface and all methods
- AuthProvider interface and all methods
- Hook APIs (useGetList, useCreate, useNotify, etc.)
- Component prop names (source, resource, label, etc.)
- Context APIs (RecordContext, ListContext, etc.)
- Resource and Admin component structure

---

## Component Mapping

### Core Components

| react-admin | shadmin | Notes |
|-------------|---------|-------|
| `<Admin>` | `<Admin>` | Same API, different internal providers |
| `<Resource>` | `<Resource>` | Identical API |
| `<CustomRoutes>` | React Router routes | Use react-router directly |

### List Components

| react-admin | shadmin | Notes |
|-------------|---------|-------|
| `<List>` | `<List>` | Same props, shadcn styling |
| `<ListBase>` | `<ListBase>` | Identical |
| `<Datagrid>` | `<Datagrid>` | Uses TanStack Table v8 |
| `<SimpleList>` | `<SimpleList>` | Same API |
| `<Pagination>` | `<Pagination>` | shadcn pagination styling |
| `<FilterButton>` | `<FilterButton>` | Same functionality |
| `<FilterForm>` | `<FilterForm>` | Same API |
| `<SearchInput>` | `<SearchInput>` | Identical |

### Form Components

| react-admin | shadmin | Notes |
|-------------|---------|-------|
| `<SimpleForm>` | `<SimpleForm>` | Same API |
| `<TabbedForm>` | `<TabbedForm>` | Same API |
| `<FormTab>` | `<FormTab>` | Same API |
| `<Toolbar>` | `<Toolbar>` | Same API |
| `<SaveButton>` | `<SaveButton>` | Same API |
| `<DeleteButton>` | `<DeleteButton>` | Same API |

### Input Components

| react-admin | shadmin | Notes |
|-------------|---------|-------|
| `<TextInput>` | `<TextInput>` | Same props |
| `<NumberInput>` | `<NumberInput>` | Same props |
| `<PasswordInput>` | `<PasswordInput>` | Same props |
| `<BooleanInput>` | `<BooleanInput>` | Same props |
| `<DateInput>` | `<DateInput>` | Same props |
| `<DateTimeInput>` | `<DateTimeInput>` | Same props |
| `<TimeInput>` | `<TimeInput>` | Same props |
| `<SelectInput>` | `<SelectInput>` | Same props |
| `<AutocompleteInput>` | `<AutocompleteInput>` | Same props |
| `<RadioButtonGroupInput>` | `<RadioButtonGroupInput>` | Same props |
| `<CheckboxGroupInput>` | `<CheckboxGroupInput>` | Same props |
| `<SelectArrayInput>` | `<SelectArrayInput>` | Same props |
| `<ReferenceInput>` | `<ReferenceInput>` | Same props |
| `<ReferenceArrayInput>` | `<ReferenceArrayInput>` | Same props |
| `<ArrayInput>` | `<ArrayInput>` | Same props |
| `<SimpleFormIterator>` | `<SimpleFormIterator>` | Same props |
| `<FileInput>` | `<FileInput>` | Same props |
| `<ImageInput>` | `<ImageInput>` | Same props |
| `<RichTextInput>` | `<RichTextInput>` | Same props |

### Field Components

| react-admin | shadmin | Notes |
|-------------|---------|-------|
| `<TextField>` | `<TextField>` | Same props |
| `<NumberField>` | `<NumberField>` | Same props |
| `<DateField>` | `<DateField>` | Same props |
| `<BooleanField>` | `<BooleanField>` | Same props |
| `<EmailField>` | `<EmailField>` | Same props |
| `<UrlField>` | `<UrlField>` | Same props |
| `<ImageField>` | `<ImageField>` | Same props |
| `<RichTextField>` | `<RichTextField>` | Same props |
| `<ChipField>` | `<ChipField>` | Same props |
| `<FunctionField>` | `<FunctionField>` | Same props |
| `<ArrayField>` | `<ArrayField>` | Same props |
| `<ReferenceField>` | `<ReferenceField>` | Same props |
| `<ReferenceArrayField>` | `<ReferenceArrayField>` | Same props |
| `<ReferenceManyField>` | `<ReferenceManyField>` | Same props |

### Layout Components

| react-admin | shadmin | Notes |
|-------------|---------|-------|
| `<Layout>` | `<Layout>` | Different styling, same concept |
| `<AppBar>` | `<AppBar>` | shadcn styling |
| `<Sidebar>` | `<Sidebar>` | shadcn styling |
| `<Menu>` | `<Menu>` | Same API |
| `<MenuItem>` / `<MenuItemLink>` | `<MenuItem>` | Same API |
| `<SubMenu>` | `<SubMenu>` | Same API |
| `<DashboardMenuItem>` | `<DashboardMenuItem>` | Same API |
| `<ContainerLayout>` | `<ContainerLayout>` | Horizontal nav alternative |

### CRUD Views

| react-admin | shadmin | Notes |
|-------------|---------|-------|
| `<Create>` | `<Create>` | Same API |
| `<Edit>` | `<Edit>` | Same API |
| `<Show>` | `<Show>` | Same API |
| `<CreateBase>` | `<CreateBase>` | Same API |
| `<EditBase>` | `<EditBase>` | Same API |
| `<ShowBase>` | `<ShowBase>` | Same API |

---

## DataProvider Compatibility

### Interface Compatibility

Shadmin's DataProvider interface is 100% compatible with react-admin. You can use your existing DataProvider without any modifications:

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

  create: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: CreateParams
  ) => Promise<CreateResult<RecordType>>

  update: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: UpdateParams
  ) => Promise<UpdateResult<RecordType>>

  updateMany: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: UpdateManyParams
  ) => Promise<UpdateManyResult<RecordType>>

  delete: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteParams
  ) => Promise<DeleteResult<RecordType>>

  deleteMany: <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteManyParams
  ) => Promise<DeleteManyResult<RecordType>>
}
```

### Using Existing react-admin DataProviders

You can use any existing react-admin DataProvider package directly:

```typescript
// Before (react-admin)
import { Admin } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com')

// After (shadmin) - Same dataProvider works!
import { Admin } from 'shadmin'
import jsonServerProvider from 'ra-data-json-server'

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com')
```

### Compatible DataProvider Packages

These react-admin DataProvider packages work with shadmin:

- `ra-data-json-server` - JSON Server REST backend
- `ra-data-simple-rest` - Simple REST backends
- `ra-data-graphql` - GraphQL backends
- `ra-data-fakerest` - Fake REST for development
- `ra-data-supabase` - Supabase backend
- `ra-data-firebase` - Firebase backend
- Custom DataProviders following the interface

---

## AuthProvider Compatibility

### Interface Compatibility

Shadmin's AuthProvider interface is identical to react-admin:

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

interface UserIdentity {
  id: Identifier
  fullName?: string
  avatar?: string
  [key: string]: unknown
}
```

### Using Existing react-admin AuthProviders

Your existing AuthProvider will work without modification:

```typescript
// Before (react-admin)
import { Admin } from 'react-admin'

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
    if (!localStorage.getItem('token')) throw new Error('Not authenticated')
  },
  checkError: async (error) => {
    if (error.status === 401) throw error
  },
  getPermissions: async () => localStorage.getItem('role'),
  getIdentity: async () => ({
    id: 1,
    fullName: 'John Doe',
  }),
}

// After (shadmin) - Same authProvider works!
import { Admin } from 'shadmin'

// Use the exact same authProvider object
```

---

## Step-by-Step Migration Process

### Step 1: Update Dependencies

```bash
# Remove react-admin and Material UI
npm uninstall react-admin @mui/material @mui/icons-material @emotion/react @emotion/styled

# Install shadmin and its peer dependencies
npm install shadmin react@^19 react-dom@^19

# Install Tailwind CSS (if not already installed)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Configure Tailwind CSS

Create or update your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/shadmin/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind directives to your main CSS file:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 3: Update Imports

Replace react-admin imports with shadmin:

```typescript
// Before
import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
} from 'react-admin'

// After
import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
} from 'shadmin'
```

### Step 4: Update Icon Imports

Replace Material UI icons with Lucide React (or your preferred icon library):

```typescript
// Before
import { PostAdd, People, Settings } from '@mui/icons-material'

// After
npm install lucide-react

import { FileText, Users, Settings } from 'lucide-react'
```

### Step 5: Update Styling

Replace MUI styling with Tailwind CSS:

```tsx
// Before (react-admin with MUI)
<TextField
  source="title"
  sx={{ fontWeight: 'bold', color: 'primary.main' }}
/>

<Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
  <SaveButton />
  <DeleteButton />
</Box>

// After (shadmin with Tailwind)
<TextField
  source="title"
  className="font-bold text-primary"
/>

<div className="flex gap-2 mt-2">
  <SaveButton />
  <DeleteButton />
</div>
```

### Step 6: Update Custom Components

If you have custom components using MUI, convert them to use shadcn/ui:

```tsx
// Before (MUI)
import { Button, Card, CardContent, Typography } from '@mui/material'

const Dashboard = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h5">Welcome</Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </CardContent>
  </Card>
)

// After (shadmin with shadcn)
import { Button } from 'shadmin'
import { Card, CardContent, CardHeader, CardTitle } from 'shadmin'

const Dashboard = () => (
  <Card className="mb-2">
    <CardHeader>
      <CardTitle>Welcome</CardTitle>
    </CardHeader>
    <CardContent>
      <Button variant="default">
        Get Started
      </Button>
    </CardContent>
  </Card>
)
```

### Step 7: Update Theme Configuration

Replace MUI theme with Tailwind/CSS variables:

```tsx
// Before (react-admin with MUI theme)
import { Admin } from 'react-admin'
import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
})

const App = () => (
  <Admin dataProvider={dataProvider} theme={theme}>
    {/* Resources */}
  </Admin>
)

// After (shadmin with CSS variables)
// In your CSS file:
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  /* ... dark mode variables */
}

// In your component:
import { Admin } from 'shadmin'

const App = () => (
  <Admin dataProvider={dataProvider} showThemeToggle>
    {/* Resources */}
  </Admin>
)
```

### Step 8: Update Custom Layouts

```tsx
// Before (react-admin)
import { Layout, AppBar, Menu, Sidebar } from 'react-admin'
import { Box } from '@mui/material'

const MyLayout = (props) => (
  <Layout
    {...props}
    appBar={MyAppBar}
    sidebar={MySidebar}
    menu={MyMenu}
  />
)

// After (shadmin)
import { Layout, AppBar, Sidebar, Menu, MenuItem } from 'shadmin'

const MyLayout = ({ children }) => (
  <Layout
    title="My Admin"
    appBar={
      <AppBar
        title="My Admin"
        showSidebarTrigger
        showThemeToggle
        user={{ name: 'John Doe' }}
      />
    }
    sidebar={
      <Sidebar title="My Admin">
        <Menu aria-label="Navigation">
          <MenuItem to="/posts" label="Posts" icon={<FileText />} />
          <MenuItem to="/users" label="Users" icon={<Users />} />
        </Menu>
      </Sidebar>
    }
  >
    {children}
  </Layout>
)
```

### Step 9: Test Your Application

1. Run your application and check for any console errors
2. Test all CRUD operations
3. Verify authentication flows work correctly
4. Check responsive layouts on different screen sizes
5. Test any custom components or hooks

---

## Common Migration Issues and Solutions

### Issue 1: MUI Components Not Found

**Error:** `Module not found: @mui/material`

**Solution:** Replace MUI components with shadcn equivalents:

```tsx
// Use shadmin's Button instead of MUI Button
import { Button } from 'shadmin'

// Use native HTML or Tailwind for layout
<div className="flex gap-4">...</div>

// Import Card from shadmin
import { Card, CardContent, CardHeader, CardTitle } from 'shadmin'
```

### Issue 2: sx Prop Not Working

**Error:** Component doesn't accept `sx` prop

**Solution:** Replace `sx` with `className` and Tailwind utilities:

```tsx
// Before
<TextField source="name" sx={{ fontWeight: 'bold', mb: 2 }} />

// After
<TextField source="name" className="font-bold mb-2" />
```

### Issue 3: Theme Not Applying

**Solution:** Shadmin uses CSS variables for theming. Update your CSS:

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    /* ... */
  }
}
```

### Issue 4: Icons Not Displaying

**Solution:** Install and use Lucide React icons:

```bash
npm install lucide-react
```

```tsx
import { FileText, Users, Settings, Home } from 'lucide-react'

<Resource name="posts" icon={FileText} list={PostList} />
```

### Issue 5: Form Validation Not Working

**Solution:** Validation rules work the same way, but error display styling is different:

```tsx
<TextInput
  source="email"
  rules={{
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
  }}
/>
```

### Issue 6: Custom Toolbar Components

**Solution:** Update toolbar components to use shadmin's Button:

```tsx
// Before
import { Toolbar, SaveButton, DeleteButton } from 'react-admin'
import { Button } from '@mui/material'

const CustomToolbar = () => (
  <Toolbar>
    <SaveButton />
    <Button onClick={handleCustomAction}>Custom</Button>
    <DeleteButton />
  </Toolbar>
)

// After
import { Toolbar, SaveButton, DeleteButton, Button } from 'shadmin'

const CustomToolbar = () => (
  <Toolbar>
    <SaveButton />
    <Button onClick={handleCustomAction}>Custom</Button>
    <DeleteButton />
  </Toolbar>
)
```

### Issue 7: useStyles or makeStyles Not Found

**Solution:** Replace CSS-in-JS with Tailwind classes:

```tsx
// Before
const useStyles = makeStyles({
  root: {
    display: 'flex',
    padding: '16px',
    backgroundColor: '#f5f5f5',
  },
})

const MyComponent = () => {
  const classes = useStyles()
  return <div className={classes.root}>...</div>
}

// After
const MyComponent = () => (
  <div className="flex p-4 bg-gray-100">...</div>
)
```

### Issue 8: Router Configuration

**Solution:** Shadmin uses react-router v7. Update router configuration if needed:

```tsx
// Before (react-admin handles routing internally)
import { Admin } from 'react-admin'

const App = () => (
  <Admin dataProvider={dataProvider}>
    {/* Resources */}
  </Admin>
)

// After (wrap with BrowserRouter if needed)
import { Admin } from 'shadmin'
import { BrowserRouter } from 'react-router'

const App = () => (
  <BrowserRouter>
    <Admin dataProvider={dataProvider}>
      {/* Resources */}
    </Admin>
  </BrowserRouter>
)
```

### Issue 9: Bulk Action Buttons

**Solution:** Bulk actions work the same way:

```tsx
<Datagrid bulkActionButtons>
  <TextField source="name" />
</Datagrid>

// Or with custom bulk actions
<Datagrid bulkActionButtons={<MyBulkActionButtons />}>
  <TextField source="name" />
</Datagrid>
```

### Issue 10: Empty List Component

**Solution:** Use the `empty` prop:

```tsx
<List
  empty={
    <div className="flex flex-col items-center justify-center py-8">
      <p className="text-muted-foreground">No records found</p>
      <CreateButton className="mt-4" />
    </div>
  }
>
  <Datagrid>...</Datagrid>
</List>
```

---

## Feature Comparison

### Available in Both

- Full CRUD operations
- DataProvider abstraction
- AuthProvider abstraction
- Filtering and sorting
- Pagination
- Bulk actions
- Form validation (react-hook-form)
- Reference fields and inputs
- Nested forms with ArrayInput
- Custom layouts
- Protected routes
- Notifications

### Shadmin Advantages

1. **Smaller Bundle**: No Material UI dependency
2. **Modern React**: Built for React 19
3. **Tailwind CSS**: Familiar utility-class styling
4. **shadcn/ui**: Customizable, accessible components
5. **TanStack Table v8**: Powerful table features
6. **Tree-shakeable**: Import only what you need

### Migration Checklist

- [ ] Update dependencies (remove MUI, add shadmin)
- [ ] Configure Tailwind CSS
- [ ] Update all imports from react-admin to shadmin
- [ ] Replace MUI icons with Lucide React
- [ ] Convert sx props to className with Tailwind
- [ ] Update custom components to use shadcn patterns
- [ ] Configure CSS variables for theming
- [ ] Test all CRUD operations
- [ ] Test authentication flows
- [ ] Test responsive layouts
- [ ] Update any custom hooks or utilities

---

## Getting Help

If you encounter issues during migration:

1. Check the [shadmin documentation](./getting-started.md)
2. Review the [DataProvider documentation](./data-provider.md)
3. Review the [AuthProvider documentation](./auth-provider.md)
4. Open an issue on GitHub

## Related Documentation

- [Getting Started](./getting-started.md)
- [Data Provider](./data-provider.md)
- [Auth Provider](./auth-provider.md)
- [Admin Component](./admin.md)
- [Resource Component](./resource.md)
- [Field Components](./field-components.md)
- [Input Components](./input-components.md)
- [List Components](./list-components.md)
- [Layout Components](./layout-components.md)
