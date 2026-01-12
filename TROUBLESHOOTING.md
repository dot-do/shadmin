# Shadmin Troubleshooting Guide

This guide covers common issues when using shadmin and answers to frequently asked questions.

## Table of Contents

- [Common Issues](#common-issues)
  - [Cannot find module 'ra-core'](#cannot-find-module-ra-core)
  - [Form validation not working](#form-validation-not-working)
  - [Styles not applying](#styles-not-applying)
  - [TypeScript errors with generics](#typescript-errors-with-generics)
  - [Context not available](#context-not-available)
  - [DataProvider methods not found](#dataprovider-methods-not-found)
  - [Hooks called outside provider](#hooks-called-outside-provider)
- [FAQ](#faq)
  - [Can I use shadmin with an existing react-admin project?](#can-i-use-shadmin-with-an-existing-react-admin-project)
  - [Does shadmin support custom themes?](#does-shadmin-support-custom-themes)
  - [How do I debug data fetching issues?](#how-do-i-debug-data-fetching-issues)
  - [What's the bundle size compared to react-admin?](#whats-the-bundle-size-compared-to-react-admin)
  - [Where is the migration guide?](#where-is-the-migration-guide)
  - [How do I add custom components?](#how-do-i-add-custom-components)
  - [Can I use shadmin with REST APIs other than mongo.do?](#can-i-use-shadmin-with-rest-apis-other-than-mongodo)

---

## Common Issues

### Cannot find module 'ra-core'

**Error:**
```
Module not found: Error: Can't resolve 'ra-core' in '/path/to/project'
```

**Cause:** shadmin has `ra-core` as a peer dependency to maintain API compatibility with react-admin. This dependency is not automatically installed.

**Solution:**

1. Install the peer dependency:
```bash
npm install ra-core
# or
pnpm add ra-core
```

2. Verify your package.json includes ra-core:
```json
{
  "dependencies": {
    "shadmin": "^0.1.0",
    "ra-core": "^5.0.0"
  }
}
```

**Note:** If you don't need react-admin API compatibility and want a lighter bundle, consider using `@mdxui/admin` instead. See the [Migration Guide](./MIGRATION.md) for details.

---

### Form validation not working

**Symptoms:**
- Validation messages don't appear
- Form submits with invalid data
- `validate` prop seems to be ignored

**Cause:** Importing validators from the wrong package or using incorrect validation syntax.

**Solution:**

1. Import validators from shadmin, not ra-core:
```tsx
// CORRECT
import { required, email, minLength } from 'shadmin'

// INCORRECT - Don't import directly from ra-core
import { required } from 'ra-core'
```

2. Ensure validators are passed correctly:
```tsx
// Single validator
<TextInput source="title" validate={required()} />

// Multiple validators - use array
<TextInput
  source="email"
  validate={[required(), email()]}
/>

// Custom validator function
<TextInput
  source="name"
  validate={(value) => value?.length < 3 ? 'Too short' : undefined}
/>
```

3. Make sure your form is wrapped in `<SimpleForm>` or `<TabbedForm>`:
```tsx
<Create>
  <SimpleForm>  {/* Required wrapper */}
    <TextInput source="title" validate={required()} />
  </SimpleForm>
</Create>
```

---

### Styles not applying

**Symptoms:**
- Components render without styling
- Tailwind classes not working
- ShadCN components look broken

**Cause:** Tailwind CSS is not properly configured to scan shadmin's components.

**Solution:**

1. Update your `tailwind.config.js` to include shadmin in the content paths:
```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/shadmin/dist/**/*.{js,ts,jsx,tsx}',  // Add this line
  ],
  // ... rest of config
}
```

2. For Tailwind CSS v4, ensure your CSS imports are correct:
```css
/* globals.css */
@import "tailwindcss";

/* CSS variables for theming */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  /* ... other variables */
}
```

3. Verify globals.css is imported in your app entry point:
```tsx
// main.tsx or App.tsx
import './globals.css'
```

4. If using CSS variables, ensure they're defined in your CSS:
```css
@layer base {
  :root {
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... */
  }
  .dark {
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... */
  }
}
```

---

### TypeScript errors with generics

**Error:**
```
Type 'RaRecord' is not assignable to type 'MyRecord'.
Property 'customField' is missing in type 'RaRecord'.
```

**Cause:** shadmin's hooks and components use generic types that need explicit type parameters for strict typing.

**Solution:**

1. Provide explicit type parameters to hooks:
```tsx
interface Post {
  id: number
  title: string
  body: string
  authorId: number
}

// With explicit type
const { data } = useGetList<Post>('posts', {
  pagination: { page: 1, perPage: 10 },
})
// data is now Post[] | undefined

// For single records
const { data: post } = useGetOne<Post>('posts', { id: 1 })
// post is now Post | undefined
```

2. Type your DataProvider correctly:
```tsx
import { DataProvider } from 'shadmin'

const myDataProvider: DataProvider = {
  getList: async <RecordType extends RaRecord>(resource, params) => {
    // Implementation
    return { data: [] as RecordType[], total: 0 }
  },
  // ... other methods
}
```

3. For custom field components, use the generic RecordContextProvider:
```tsx
<RecordContextProvider<Post> value={post}>
  <TextField source="title" />  {/* TypeScript knows post has title */}
</RecordContextProvider>
```

---

### Context not available

**Error:**
```
useRecordContext must be used within a RecordContextProvider
useListContext must be used within a ListContextProvider
```

**Cause:** Using context hooks outside their required provider hierarchy.

**Solution:**

1. Ensure your component tree includes the `<Admin>` wrapper:
```tsx
// CORRECT
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} />
  </Admin>
)

// INCORRECT - Missing Admin wrapper
const App = () => (
  <PostList />  // Context hooks will fail
)
```

2. For testing, use the test utilities:
```tsx
import { TestAdminContext, RecordContextProvider } from 'shadmin/test-utils'

// In tests
render(
  <TestAdminContext>
    <RecordContextProvider value={{ id: 1, title: 'Test' }}>
      <TextField source="title" />
    </RecordContextProvider>
  </TestAdminContext>
)
```

3. When using field components outside of List/Show views, wrap them manually:
```tsx
import { RecordContextProvider } from 'shadmin'

const CustomDisplay = ({ record }) => (
  <RecordContextProvider value={record}>
    <TextField source="name" />
    <DateField source="createdAt" />
  </RecordContextProvider>
)
```

---

### DataProvider methods not found

**Error:**
```
TypeError: dataProvider.getList is not a function
TypeError: dataProvider.create is not a function
```

**Cause:** DataProvider implementation is missing required methods or has incorrect signatures.

**Solution:**

1. Implement all 9 required DataProvider methods:
```tsx
import { DataProvider } from 'shadmin'

const myDataProvider: DataProvider = {
  // Required: List operations
  getList: async (resource, params) => ({ data: [], total: 0 }),
  getOne: async (resource, params) => ({ data: { id: params.id } }),
  getMany: async (resource, params) => ({ data: [] }),
  getManyReference: async (resource, params) => ({ data: [], total: 0 }),

  // Required: Mutation operations
  create: async (resource, params) => ({ data: { ...params.data, id: 'new' } }),
  update: async (resource, params) => ({ data: params.data }),
  updateMany: async (resource, params) => ({ data: params.ids }),
  delete: async (resource, params) => ({ data: params.previousData }),
  deleteMany: async (resource, params) => ({ data: params.ids }),
}
```

2. For quick prototyping, use the test data provider:
```tsx
import { testDataProvider } from 'shadmin/test-utils'

// Override only the methods you need
const mockProvider = testDataProvider({
  getList: async () => ({
    data: [{ id: 1, name: 'Test' }],
    total: 1,
  }),
})
```

---

### Hooks called outside provider

**Error:**
```
Invalid hook call. Hooks can only be called inside of the body of a function component.
```

**Cause:** This can occur when:
1. Multiple React instances are loaded
2. Hooks are called in class components
3. Bundle has duplicate React versions

**Solution:**

1. Check for duplicate React versions:
```bash
npm ls react
# or
pnpm why react
```

2. Ensure you're using function components:
```tsx
// CORRECT - Function component
const PostList = () => {
  const { data } = useListContext()
  return <div>{/* ... */}</div>
}

// INCORRECT - Class component
class PostList extends React.Component {
  render() {
    const { data } = useListContext()  // Will fail!
    return <div>{/* ... */}</div>
  }
}
```

3. If using a monorepo, ensure React is deduplicated:
```json
// package.json
{
  "pnpm": {
    "overrides": {
      "react": "^19.0.0",
      "react-dom": "^19.0.0"
    }
  }
}
```

---

## FAQ

### Can I use shadmin with an existing react-admin project?

**Yes!** shadmin is designed as a drop-in replacement for react-admin's UI layer. You can migrate incrementally:

1. **Phase 1 - Swap imports**: Change your imports from `react-admin` to `shadmin`
   ```tsx
   // Before
   import { List, Datagrid, TextField } from 'react-admin'

   // After
   import { List, Datagrid, TextField } from 'shadmin'
   ```

2. **Phase 2 - Keep your DataProvider**: Your existing DataProvider works as-is since shadmin uses the same interface.

3. **Phase 3 - Gradual hook migration** (optional): Over time, you can migrate from ra-core hooks to native TanStack Query patterns if desired.

See [MIGRATION.md](./MIGRATION.md) for the complete migration guide.

---

### Does shadmin support custom themes?

**Yes!** shadmin uses CSS variables and Tailwind CSS for theming. You can customize:

1. **CSS Variables**: Define your color palette in `globals.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  /* ... */
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... */
}
```

2. **Tailwind Config**: Extend the theme:
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
}
```

3. **Component-level overrides**: Use className props:
```tsx
<Datagrid className="border-brand-500">
  <TextField source="title" className="text-brand-900" />
</Datagrid>
```

---

### How do I debug data fetching issues?

1. **Enable TanStack Query DevTools**:
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} />
    <ReactQueryDevtools initialIsOpen={false} />  {/* Add this */}
  </Admin>
)
```

2. **Log DataProvider calls**:
```tsx
const loggingDataProvider = {
  ...myDataProvider,
  getList: async (resource, params) => {
    console.log('getList', resource, params)
    const result = await myDataProvider.getList(resource, params)
    console.log('getList result', result)
    return result
  },
  // ... wrap other methods
}
```

3. **Check Network tab**: Verify API calls are being made with correct parameters.

4. **Validate response format**: DataProvider methods must return:
   - `getList`: `{ data: Record[], total: number }`
   - `getOne`: `{ data: Record }`
   - `create`: `{ data: Record }` (with id)
   - `update`: `{ data: Record }`
   - `delete`: `{ data: Record }`

---

### What's the bundle size compared to react-admin?

shadmin is significantly lighter than react-admin with Material UI:

| Package | Minified | Gzipped |
|---------|----------|---------|
| react-admin + MUI | ~450KB | ~120KB |
| shadmin + ra-core | ~180KB | ~55KB |
| @mdxui/admin (no ra-core) | ~80KB | ~25KB |

**Key differences:**
- **No MUI runtime**: ShadCN uses static Tailwind classes, not JSS
- **Tree-shakable**: Only import what you use
- **Lighter state management**: TanStack Query vs custom ra-core stores

For the smallest bundle, use `@mdxui/admin` which has no ra-core dependency.

---

### Where is the migration guide?

The migration guide is at [MIGRATION.md](./MIGRATION.md). It covers:

- Decision tree: shadmin vs @mdxui/admin
- Phase-by-phase migration from react-admin
- ra-core exports used by shadmin
- Submodule architecture details

---

### How do I add custom components?

shadmin is built on the copy-paste ownership model. You can:

1. **Extend existing components**:
```tsx
import { TextField, TextFieldProps } from 'shadmin'

interface HighlightedTextFieldProps extends TextFieldProps {
  highlightColor?: string
}

const HighlightedTextField = ({ highlightColor = 'yellow', ...props }: HighlightedTextFieldProps) => (
  <span style={{ backgroundColor: highlightColor }}>
    <TextField {...props} />
  </span>
)
```

2. **Create new field components**:
```tsx
import { useRecordContext } from 'shadmin'
import { Badge } from '@/components/ui/badge'

const StatusField = ({ source }: { source: string }) => {
  const record = useRecordContext()
  const status = record?.[source]

  return (
    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
      {status}
    </Badge>
  )
}
```

3. **Create custom inputs**:
```tsx
import { useInput } from 'shadmin'
import { Slider } from '@/components/ui/slider'

const SliderInput = ({ source, min = 0, max = 100 }) => {
  const { field } = useInput({ source })

  return (
    <Slider
      value={[field.value || 0]}
      onValueChange={([value]) => field.onChange(value)}
      min={min}
      max={max}
    />
  )
}
```

---

### Can I use shadmin with REST APIs other than mongo.do?

**Yes!** shadmin works with any REST API through the DataProvider abstraction. You can:

1. **Use existing react-admin DataProviders**:
```tsx
import simpleRestProvider from 'ra-data-simple-rest'

const dataProvider = simpleRestProvider('https://api.example.com')

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} />
  </Admin>
)
```

2. **Create a custom DataProvider** for your API:
```tsx
const customDataProvider: DataProvider = {
  getList: async (resource, { pagination, sort, filter }) => {
    const { page, perPage } = pagination
    const { field, order } = sort

    const response = await fetch(
      `/api/${resource}?page=${page}&limit=${perPage}&sortBy=${field}&order=${order}`
    )
    const json = await response.json()

    return {
      data: json.items,
      total: json.totalCount,
    }
  },
  // ... implement other methods
}
```

3. **Use community DataProviders** from react-admin ecosystem (they're compatible):
   - `ra-data-graphql` - GraphQL
   - `ra-data-supabase` - Supabase
   - `ra-data-firebase` - Firebase
   - `ra-data-prisma` - Prisma

---

## Need More Help?

- **GitHub Issues**: [shadmin issues](https://github.com/dot-do/shadmin/issues)
- **React Admin Docs**: [marmelab.com/react-admin](https://marmelab.com/react-admin/documentation.html) (API reference)
- **Architecture Guide**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Migration Guide**: [MIGRATION.md](./MIGRATION.md)
