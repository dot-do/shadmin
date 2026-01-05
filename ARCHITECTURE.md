# Shadmin Architecture

**A 100% API-compatible drop-in replacement for React Admin using ShadCN UI with native mongo.do integration.**

## Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Package Structure](#package-structure)
4. [Component Architecture](#component-architecture)
5. [Testing Strategy](#testing-strategy)
6. [TDD Workflow](#tdd-workflow)
7. [Technology Stack](#technology-stack)
8. [Development Phases](#development-phases)

---

## Overview

Shadmin provides the exact same API surface as React Admin while replacing Material UI with modern ShadCN components. The key insight is that React Admin's architecture is excellent—the problem is MUI's dated aesthetics and heavy runtime. We preserve the API, replace the rendering layer.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Your App                                          │
│         <Admin dataProvider={mondoProvider} authProvider={...}>             │
│           <Resource name="users" list={UserList} edit={UserEdit} />         │
│         </Admin>                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                         SHADMIN LAYER                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Components (React Admin API-compatible, ShadCN-rendered)             │   │
│  │  • Admin, Resource, List, Datagrid, Create, Edit, Show              │   │
│  │  • Field components (TextField, DateField, ReferenceField...)        │   │
│  │  • Input components (TextInput, DateInput, SelectInput...)           │   │
│  │  • Layout (Sidebar, AppBar, Breadcrumb)                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Contexts & Hooks (identical to React Admin)                          │   │
│  │  • RecordContext, ListContext, FormContext, ResourceContext          │   │
│  │  • useRecordContext, useDataProvider, useNotify, useRedirect         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ DataProvider Interface (9 methods, identical signature)              │   │
│  │  • getList, getOne, getMany, getManyReference                        │   │
│  │  • create, update, updateMany, delete, deleteMany                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│                       MONGO.DO DATA LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ mondoDataProvider (native integration)                               │   │
│  │  • Translates DataProvider calls → mongo.do RPC                      │   │
│  │  • Optimistic updates with change stream sync                        │   │
│  │  • Connection pooling & request deduplication (built into mongo.do)  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│                       CLOUDFLARE EDGE                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ MondoDB Durable Object (SQLite storage)                              │   │
│  │  • Query translation (MongoDB → SQL)                                 │   │
│  │  • Aggregation pipeline execution                                    │   │
│  │  • Vector search, full-text search                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Design Philosophy

### 1. API Compatibility First

Every component, hook, and interface matches React Admin's API exactly:

```tsx
// Before (React Admin)
import { Admin, Resource, List, Datagrid, TextField } from 'react-admin'

// After (Shadmin) - Just change the import!
import { Admin, Resource, List, Datagrid, TextField } from 'shadmin'
```

### 2. ShadCN Foundation

- **Copy-paste ownership**: Components live in your codebase
- **CSS Variables**: Theming via `globals.css`, not JSS runtime
- **Tailwind v4**: Modern utility-first styling
- **Radix/Base UI**: Accessible, headless primitives

### 3. Native mongo.do Integration

- Zero-config data layer with `createMondoDataProvider`
- Real-time updates via change streams
- Vector search and full-text search built-in
- Edge-first deployment on Cloudflare Workers

### 4. Test-Driven Development

Every component follows RED → GREEN → REFACTOR:
- **RED**: Write failing tests first (defines the contract)
- **GREEN**: Implement minimum code to pass
- **REFACTOR**: Optimize without changing behavior

---

## Package Structure

```
packages/
├── shadmin/                     # Main package
│   ├── src/
│   │   ├── components/
│   │   │   ├── core/            # Admin, Resource, CoreAdminContext
│   │   │   ├── list/            # List, Datagrid, Pagination, Filters
│   │   │   ├── detail/          # Create, Edit, Show
│   │   │   ├── form/            # SimpleForm, TabbedForm, Toolbar
│   │   │   ├── field/           # TextField, DateField, ReferenceField...
│   │   │   ├── input/           # TextInput, SelectInput, ReferenceInput...
│   │   │   ├── layout/          # Layout, Sidebar, AppBar, Menu
│   │   │   ├── button/          # SaveButton, DeleteButton, EditButton...
│   │   │   └── auth/            # Login, Logout, AuthRequired
│   │   │
│   │   ├── contexts/            # RecordContext, ListContext, FormContext...
│   │   ├── hooks/               # useRecordContext, useGetList, useNotify...
│   │   ├── providers/           # DataProvider implementations
│   │   ├── ui/                  # ShadCN components (copied/customized)
│   │   ├── types/               # TypeScript interfaces
│   │   └── utils/               # Shared utilities
│   │
│   └── package.json
│
├── shadmin-mondo/               # mongo.do integration
│   ├── src/
│   │   ├── data-provider.ts     # createMondoDataProvider
│   │   ├── auth-provider.ts     # createMondoAuthProvider
│   │   └── change-stream.ts     # Real-time updates
│   └── package.json
│
└── create-shadmin/              # CLI scaffolding
    └── src/
```

---

## Component Architecture

### Core Components

| Component | Purpose | ShadCN Foundation |
|-----------|---------|-------------------|
| `<Admin>` | Root provider orchestration | SidebarProvider |
| `<Resource>` | CRUD route registration | React Router |
| `<List>` | List view wrapper | Card |
| `<Datagrid>` | Data table | Data Table (TanStack) |
| `<Create>` | Create form wrapper | Card |
| `<Edit>` | Edit form wrapper | Card |
| `<Show>` | Read-only view | Card |
| `<SimpleForm>` | Form container | Field primitive |
| `<TabbedForm>` | Tabbed form | Tabs + Field |

### Field Components

| Field | Renders As |
|-------|------------|
| `TextField` | `<span>` |
| `NumberField` | Formatted via `Intl.NumberFormat` |
| `DateField` | Formatted via `Intl.DateTimeFormat` |
| `BooleanField` | Badge or icon |
| `EmailField` | `mailto:` link |
| `UrlField` | External link |
| `ChipField` | ShadCN Badge |
| `ReferenceField` | Fetches + renders related record |
| `ArrayField` | Iterator with children |
| `FunctionField` | Custom render function |
| `ImageField` | AspectRatio + img |

### Input Components

| Input | ShadCN Foundation |
|-------|-------------------|
| `TextInput` | Input + Field |
| `NumberInput` | Input type="number" |
| `DateInput` | DatePicker |
| `SelectInput` | Select |
| `AutocompleteInput` | Combobox |
| `RadioButtonGroupInput` | RadioGroup |
| `CheckboxGroupInput` | Checkbox array |
| `BooleanInput` | Switch |
| `ReferenceInput` | Fetches choices + wraps child |
| `ArrayInput` | Dynamic form array |
| `RichTextInput` | Tiptap editor |
| `FileInput` | File upload |

---

## Testing Strategy

### Testing Stack

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit/integration tests |
| **React Testing Library** | Component testing |
| **Playwright** | E2E testing |
| **Storybook 8** | Component development & documentation |
| **Chromatic** | Visual regression testing |

### Test Organization

Tests are **co-located** with source files:

```
src/components/field/
├── TextField.tsx
├── TextField.spec.tsx      # Unit tests
├── TextField.stories.tsx   # Storybook stories
└── index.ts
```

### Test Utilities (Inspired by React Admin)

#### testDataProvider

```typescript
// src/test-utils/testDataProvider.ts
const defaultTestDataProvider: DataProvider = {
  getList: async () => { throw new Error('getList not implemented') },
  getOne: async () => { throw new Error('getOne not implemented') },
  // ... other methods
}

export const testDataProvider = (
  overrides?: Partial<DataProvider>
): DataProvider => ({
  ...defaultTestDataProvider,
  ...overrides,
})
```

Usage:

```typescript
const dataProvider = testDataProvider({
  getOne: jest.fn().mockResolvedValue({ data: { id: 1, name: 'Test' } })
})
```

#### AdminContext Wrapper

```typescript
// src/test-utils/AdminContext.tsx
export const TestAdminContext = ({
  children,
  dataProvider = testDataProvider(),
  authProvider,
}: {
  children: React.ReactNode
  dataProvider?: DataProvider
  authProvider?: AuthProvider
}) => (
  <AdminContext
    dataProvider={dataProvider}
    authProvider={authProvider}
    i18nProvider={defaultI18nProvider}
  >
    {children}
  </AdminContext>
)
```

#### TestMemoryRouter

```typescript
// src/test-utils/TestMemoryRouter.tsx
export const TestMemoryRouter = ({
  children,
  initialEntries = ['/'],
}: {
  children: React.ReactNode
  initialEntries?: string[]
}) => {
  const router = createMemoryRouter([
    { path: '*', element: children }
  ], { initialEntries })
  return <RouterProvider router={router} />
}
```

### Testing Patterns

#### 1. Simple Component Test

```typescript
// TextField.spec.tsx
describe('<TextField />', () => {
  it('renders the field value', () => {
    render(
      <TestAdminContext>
        <RecordContextProvider value={{ id: 1, title: 'Hello' }}>
          <TextField source="title" />
        </RecordContextProvider>
      </TestAdminContext>
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders emptyText when value is null', () => {
    render(
      <TestAdminContext>
        <RecordContextProvider value={{ id: 1, title: null }}>
          <TextField source="title" emptyText="N/A" />
        </RecordContextProvider>
      </TestAdminContext>
    )
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })
})
```

#### 2. Hook Test Pattern

```typescript
// useGetList.spec.tsx
describe('useGetList', () => {
  const TestComponent = ({ callback }: { callback: (result: any) => void }) => {
    const result = useGetList('posts', { pagination: { page: 1, perPage: 10 } })
    callback(result)
    return null
  }

  it('fetches list data', async () => {
    const callback = vi.fn()
    const dataProvider = testDataProvider({
      getList: vi.fn().mockResolvedValue({
        data: [{ id: 1, title: 'Post 1' }],
        total: 1,
      }),
    })

    render(
      <TestAdminContext dataProvider={dataProvider}>
        <TestComponent callback={callback} />
      </TestAdminContext>
    )

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [{ id: 1, title: 'Post 1' }],
          total: 1,
        })
      )
    })
  })
})
```

#### 3. Form Input Test Pattern

```typescript
// TextInput.spec.tsx
describe('<TextInput />', () => {
  it('renders with initial value', () => {
    render(
      <TestAdminContext>
        <ResourceContextProvider value="posts">
          <SimpleForm defaultValues={{ title: 'Hello' }} onSubmit={vi.fn()}>
            <TextInput source="title" />
          </SimpleForm>
        </ResourceContextProvider>
      </TestAdminContext>
    )

    const input = screen.getByLabelText('Title') as HTMLInputElement
    expect(input.value).toBe('Hello')
  })

  it('validates required field on submit', async () => {
    render(
      <TestAdminContext>
        <ResourceContextProvider value="posts">
          <SimpleForm onSubmit={vi.fn()}>
            <TextInput source="title" validate={required()} />
          </SimpleForm>
        </ResourceContextProvider>
      </TestAdminContext>
    )

    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument()
    })
  })
})
```

#### 4. E2E Test Pattern (Playwright)

```typescript
// tests/e2e/create.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Create Page', () => {
  test('creates a new record', async ({ page }) => {
    await page.goto('/posts/create')

    await page.fill('input[name="title"]', 'New Post')
    await page.fill('textarea[name="body"]', 'Post content')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/posts$/)
    await expect(page.locator('.notification')).toContainText('Created')
  })
})
```

#### 5. Visual Test (Storybook + Chromatic)

```typescript
// TextField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from './TextField'
import { TestAdminContext, RecordContextProvider } from '@/test-utils'

const meta: Meta<typeof TextField> = {
  title: 'Fields/TextField',
  component: TextField,
  decorators: [
    (Story) => (
      <TestAdminContext>
        <RecordContextProvider value={{ id: 1, title: 'Hello World' }}>
          <Story />
        </RecordContextProvider>
      </TestAdminContext>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TextField>

export const Default: Story = {
  args: {
    source: 'title',
  },
}

export const WithLabel: Story = {
  args: {
    source: 'title',
    label: 'Post Title',
  },
}

export const EmptyValue: Story = {
  decorators: [
    (Story) => (
      <TestAdminContext>
        <RecordContextProvider value={{ id: 1, title: null }}>
          <Story />
        </RecordContextProvider>
      </TestAdminContext>
    ),
  ],
  args: {
    source: 'title',
    emptyText: 'No title',
  },
}
```

### Test Setup Files

#### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setup.ts'],
    include: ['src/**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.stories.tsx', '**/test-utils/**'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

#### src/test-utils/setup.ts

```typescript
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.scrollTo
vi.stubGlobal('scrollTo', vi.fn())

// Fail on console.error (strict mode)
const originalError = console.error
console.error = (...args: any[]) => {
  originalError.apply(console, args)
  throw new Error('Test failed due to console.error')
}
```

#### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## TDD Workflow

Each component follows this cycle:

### 1. RED Phase

Write failing tests that define the component contract:

```typescript
// TextField.spec.tsx
describe('<TextField />', () => {
  it('renders the value from source prop', () => {
    // This test WILL FAIL - TextField doesn't exist yet
    render(
      <TestAdminContext>
        <RecordContextProvider value={{ id: 1, name: 'Test' }}>
          <TextField source="name" />
        </RecordContextProvider>
      </TestAdminContext>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### 2. GREEN Phase

Write minimum code to make tests pass:

```typescript
// TextField.tsx
export const TextField = ({ source }: { source: string }) => {
  const record = useRecordContext()
  const value = record?.[source]
  return <span>{value}</span>
}
```

### 3. REFACTOR Phase

Improve code quality without changing behavior:

```typescript
// TextField.tsx
export interface TextFieldProps {
  source: string
  label?: string
  emptyText?: string
  className?: string
}

export const TextField = ({
  source,
  label,
  emptyText = '',
  className,
}: TextFieldProps) => {
  const record = useRecordContext()
  const value = get(record, source) // Support nested paths

  if (value == null && emptyText) {
    return <span className={cn('text-muted-foreground', className)}>{emptyText}</span>
  }

  return <span className={className}>{String(value)}</span>
}
```

---

## Technology Stack

| Category | Technology |
|----------|------------|
| **Runtime** | React 19, TypeScript 5.6 |
| **Build** | Vite, tsup |
| **Styling** | Tailwind CSS v4, CSS Variables |
| **Components** | ShadCN UI, Radix UI |
| **Forms** | react-hook-form, Zod |
| **Tables** | TanStack Table |
| **Routing** | React Router v7 |
| **State** | TanStack Query |
| **Testing** | Vitest, RTL, Playwright, Storybook |
| **Visual Testing** | Chromatic |
| **Package Manager** | pnpm workspaces |
| **CI/CD** | GitHub Actions |

---

## Development Phases

### Phase 0: Infrastructure
- [x] Project setup (Vite, TypeScript, monorepo)
- [ ] Testing infrastructure (Vitest, Playwright, Storybook, Chromatic)
- [ ] CI/CD pipeline

### Phase 1: Core Foundation
- [ ] Context system (RecordContext, ListContext, FormContext...)
- [ ] Hook system (useGetList, useCreate, useNotify...)
- [ ] Admin & Resource components
- [ ] mongo.do DataProvider

### Phase 2: List Components
- [ ] List wrapper
- [ ] Datagrid with TanStack Table
- [ ] Pagination
- [ ] Filters

### Phase 3: Detail Components
- [ ] Create/Edit/Show wrappers
- [ ] SimpleForm & TabbedForm
- [ ] Toolbar & buttons

### Phase 4: Field Components
- [ ] Basic fields (Text, Number, Date, Boolean)
- [ ] Link fields (Email, URL)
- [ ] Reference fields
- [ ] Complex fields (Array, Function, Rich)

### Phase 5: Input Components
- [ ] Basic inputs (Text, Number, Password)
- [ ] Date/Time inputs
- [ ] Selection inputs (Select, Autocomplete, Radio, Checkbox)
- [ ] Reference inputs
- [ ] Complex inputs (Array, RichText, File)

### Phase 6: Layout & Polish
- [ ] Layout with Sidebar
- [ ] AppBar & navigation
- [ ] Theming system
- [ ] Auth components

---

## Issue Tracking

All tasks are tracked in the beads issue system. Run `bd ready` to see available work.

### Issue Structure

- **Epics**: High-level feature areas (e.g., "EPIC: Datagrid Component")
- **Tasks**: Individual work items following TDD pattern
  - `RED:` - Write failing tests
  - `GREEN:` - Implement to pass tests
  - `REFACTOR:` - Optimize and clean up
  - `Storybook:` - Create stories
  - `Visual test:` - Add visual snapshots
  - `E2E:` - Add Playwright tests

### Commands

```bash
bd ready           # Show work ready to start
bd list --type=epic # List all epics
bd show <id>       # View issue details
bd update <id> --status=in_progress  # Claim work
bd close <id>      # Mark complete
```

---

## Contributing

1. Pick an issue from `bd ready`
2. Follow TDD: RED → GREEN → REFACTOR
3. Add Storybook stories
4. Ensure all tests pass
5. Submit PR

---

**Built for the edge. Designed for AI. Styled with taste.**
