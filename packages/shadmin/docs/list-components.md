# List Components

This document covers all List-related components in shadmin for displaying and managing collections of records.

## Overview

The List component family provides a complete solution for displaying tabular data with:
- Data fetching and pagination
- Sorting and filtering
- Row selection for bulk actions
- Multiple display modes (table, simple list)
- URL synchronization for bookmarkable list states

## Component Hierarchy

```
List (complete solution)
  |-- ListBase (data fetching logic)
  |-- ListView (UI container)
       |-- Datagrid (table display)
       |   |-- DatagridHeader
       |   |-- DatagridBody
       |   |-- DatagridRow
       |-- SimpleList (mobile-friendly)
       |-- Pagination
            |-- RowsPerPageSelector
```

---

## List

The main List component combines `ListBase` (data fetching logic) with `ListView` (UI wrapper) to provide a complete list solution.

### Import

```tsx
import { List } from 'shadmin'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `resource` | `string` | - | The name of the resource to fetch |
| `children` | `ReactNode` | - | Child elements (typically Datagrid) |
| `title` | `ReactNode` | - | Title to display in the list header |
| `perPage` | `number` | `10` | Number of records per page |
| `sort` | `SortPayload` | `{ field: 'id', order: 'ASC' }` | Default sort configuration |
| `filter` | `FilterPayload` | `{}` | Permanent filter (always applied) |
| `filterDefaultValues` | `FilterPayload` | `{}` | Default filter values (can be changed) |
| `disableSyncWithLocation` | `boolean` | `false` | Disable URL synchronization |
| `queryOptions` | `UseGetListOptions` | - | React Query options |
| `actions` | `ReactElement \| false` | - | Custom actions component |
| `filters` | `ReactElement` | - | Filters component |
| `empty` | `ReactElement` | - | Component for empty state |
| `className` | `string` | - | Additional CSS class |
| `aside` | `ReactElement` | - | Aside content |

### Basic Example

```tsx
import { List, Datagrid, TextField, DateField } from 'shadmin'

export function PostList() {
  return (
    <List resource="posts">
      <Datagrid>
        <TextField source="title" />
        <TextField source="author" />
        <DateField source="createdAt" />
      </Datagrid>
    </List>
  )
}
```

### Complete Example

```tsx
import { List, Datagrid, TextField, DateField, SearchInput, CreateButton } from 'shadmin'

export function PostList() {
  return (
    <List
      resource="posts"
      title="All Posts"
      perPage={25}
      sort={{ field: 'createdAt', order: 'DESC' }}
      filter={{ published: true }}
      filterDefaultValues={{ status: 'active' }}
      actions={<CreateButton />}
      filters={<SearchInput source="q" placeholder="Search posts..." />}
      empty={<EmptyPostList />}
    >
      <Datagrid rowClick="edit" bulkActionButtons>
        <TextField source="title" />
        <TextField source="author" />
        <DateField source="createdAt" />
      </Datagrid>
    </List>
  )
}
```

---

## ListBase

`ListBase` provides the data fetching logic without any UI wrapper. Use it when you need complete control over the list UI.

### Import

```tsx
import { ListBase } from 'shadmin'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `resource` | `string` | - | Resource name (uses ResourceContext if not provided) |
| `children` | `ReactNode` | - | Child elements |
| `perPage` | `number` | `10` | Records per page |
| `sort` | `SortPayload` | `{ field: 'id', order: 'ASC' }` | Default sort |
| `filter` | `FilterPayload` | `{}` | Permanent filter |
| `filterDefaultValues` | `FilterPayload` | `{}` | Default filter values |
| `disableSyncWithLocation` | `boolean` | `false` | Disable URL sync |
| `queryOptions` | `UseGetListOptions` | - | React Query options |

### Example

```tsx
import { ListBase, useListContext, Pagination } from 'shadmin'

function CustomListUI() {
  const { data, isLoading, total, page, perPage, setPage } = useListContext()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <ul>
        {data?.map((record) => (
          <li key={record.id}>{record.name}</li>
        ))}
      </ul>
      <Pagination />
    </div>
  )
}

export function CustomList() {
  return (
    <ListBase resource="products" perPage={20}>
      <CustomListUI />
    </ListBase>
  )
}
```

---

## ListView

`ListView` is the UI wrapper component that provides the Card container for displaying list data. It must be used inside a `ListContextProvider`.

### Import

```tsx
import { ListView } from 'shadmin'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Child elements |
| `title` | `ReactNode` | - | List header title |
| `actions` | `ReactElement \| false` | - | Action buttons |
| `filters` | `ReactElement` | - | Filter component |
| `empty` | `ReactElement` | - | Empty state component |
| `className` | `string` | - | Additional CSS class |
| `aside` | `ReactElement` | - | Aside content |

### Example

```tsx
import { ListBase, ListView, Datagrid, TextField } from 'shadmin'

export function PostList() {
  return (
    <ListBase resource="posts">
      <ListView title="Posts" actions={<CreateButton />}>
        <Datagrid>
          <TextField source="title" />
        </Datagrid>
      </ListView>
    </ListBase>
  )
}
```

---

## Datagrid

The `Datagrid` component displays records in a table format with sorting, selection, and expandable rows. It uses TanStack Table v8 internally.

### Import

```tsx
import { Datagrid } from 'shadmin'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Field components (each becomes a column) |
| `columns` | `DatagridColumn[]` | - | Explicit column configuration |
| `bulkActionButtons` | `ReactNode \| boolean` | `false` | Enable selection checkboxes |
| `rowClick` | `'edit' \| 'show' \| false \| Function` | - | Row click behavior |
| `empty` | `ReactNode` | - | Custom empty state |
| `loading` | `ReactNode` | - | Custom loading state |
| `className` | `string` | - | Table CSS class |
| `rowStyle` | `(record, index) => CSSProperties` | - | Dynamic row styles |
| `hover` | `boolean` | `false` | Enable hover styles |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | Table density |
| `expand` | `ReactNode` | - | Expandable row content |
| `isRowExpandable` | `(record) => boolean` | - | Control which rows expand |

### Basic Example

```tsx
import { Datagrid, TextField, EmailField, DateField } from 'shadmin'

<Datagrid>
  <TextField source="name" />
  <EmailField source="email" />
  <DateField source="createdAt" />
</Datagrid>
```

### With Row Selection and Click

```tsx
<Datagrid
  rowClick="edit"
  bulkActionButtons={true}
  hover
>
  <TextField source="name" />
  <TextField source="email" />
</Datagrid>
```

### With Custom Row Click Handler

```tsx
<Datagrid
  rowClick={(record, id, event) => {
    console.log('Clicked record:', record)
    // Navigate or perform custom action
  }}
>
  <TextField source="name" />
</Datagrid>
```

### With Explicit Columns

```tsx
<Datagrid
  columns={[
    { source: 'name', label: 'Full Name', sortable: true },
    { source: 'email', label: 'Email Address' },
    {
      source: 'status',
      label: 'Status',
      render: (record) => (
        <span className={record.status === 'active' ? 'text-green-500' : 'text-red-500'}>
          {record.status}
        </span>
      ),
    },
  ]}
/>
```

### With Expandable Rows

```tsx
<Datagrid
  expand={<OrderDetails />}
  isRowExpandable={(record) => record.hasDetails}
>
  <TextField source="orderNumber" />
  <TextField source="customer" />
  <NumberField source="total" />
</Datagrid>

function OrderDetails() {
  const record = useRecordContext()
  return (
    <div className="p-4">
      <h4>Order Items</h4>
      {record.items.map((item) => (
        <div key={item.id}>{item.name} - ${item.price}</div>
      ))}
    </div>
  )
}
```

### With Custom Row Styles

```tsx
<Datagrid
  rowStyle={(record, index) => ({
    backgroundColor: record.isUrgent ? '#fef2f2' : undefined,
  })}
>
  <TextField source="title" />
  <BooleanField source="isUrgent" />
</Datagrid>
```

---

## SimpleList

`SimpleList` provides a mobile-friendly list display with customizable primary, secondary, and tertiary text.

### Import

```tsx
import { SimpleList } from 'shadmin'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `primaryText` | `string \| (record) => ReactNode` | - | Primary text content |
| `secondaryText` | `string \| (record) => ReactNode` | - | Secondary text content |
| `tertiaryText` | `string \| (record) => ReactNode` | - | Tertiary text (right-aligned) |
| `leftIcon` | `ReactNode \| (record) => ReactNode` | - | Left icon/avatar |
| `rightIcon` | `ReactNode \| (record) => ReactNode` | - | Right icon |
| `linkType` | `'edit' \| 'show' \| false` | `'edit'` | Link behavior |
| `rowClick` | `(id, record) => void` | - | Custom click handler |
| `rowStyle` | `(record, index) => CSSProperties` | - | Dynamic row styles |
| `className` | `string` | - | Additional CSS class |
| `empty` | `ReactNode` | - | Empty state content |
| `linkComponent` | `ComponentType` | - | Custom link component |
| `resource` | `string` | - | Resource name for links |

### Basic Example

```tsx
import { List, SimpleList } from 'shadmin'

export function UserList() {
  return (
    <List resource="users">
      <SimpleList
        primaryText={(record) => record.name}
        secondaryText={(record) => record.email}
        tertiaryText={(record) => new Date(record.createdAt).toLocaleDateString()}
      />
    </List>
  )
}
```

### With Icons

```tsx
import { List, SimpleList } from 'shadmin'
import { Avatar } from './components/Avatar'
import { ChevronRight } from 'lucide-react'

export function UserList() {
  return (
    <List resource="users">
      <SimpleList
        primaryText={(record) => record.name}
        secondaryText={(record) => record.email}
        leftIcon={(record) => (
          <Avatar src={record.avatar} alt={record.name} />
        )}
        rightIcon={<ChevronRight className="h-4 w-4" />}
      />
    </List>
  )
}
```

### Using Field Names as Strings

```tsx
<SimpleList
  primaryText="name"       // Uses record.name
  secondaryText="email"    // Uses record.email
  tertiaryText="role"      // Uses record.role
/>
```

---

## Pagination

The `Pagination` component provides navigation controls for paging through list data.

### Import

```tsx
import { Pagination } from 'shadmin'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | - | Current page (overrides context) |
| `perPage` | `number` | - | Items per page (overrides context) |
| `total` | `number` | - | Total records (overrides context) |
| `setPage` | `(page) => void` | - | Page change handler |
| `setPerPage` | `(perPage) => void` | - | Per page change handler |
| `rowsPerPageOptions` | `number[]` | `[10, 25, 50, 100]` | Per page options |
| `className` | `string` | - | Additional CSS class |
| `siblingCount` | `number` | `1` | Pages around current |
| `boundaryCount` | `number` | `1` | Pages at start/end |
| `limit` | `ReactNode` | - | Custom pagination element |

### With ListContext (Automatic)

```tsx
import { List, Datagrid, TextField, Pagination } from 'shadmin'

export function PostList() {
  return (
    <List resource="posts">
      <Datagrid>
        <TextField source="title" />
      </Datagrid>
      <Pagination />
    </List>
  )
}
```

### Standalone Usage

```tsx
import { Pagination } from 'shadmin'

function MyList() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  return (
    <>
      {/* Your list content */}
      <Pagination
        page={page}
        perPage={perPage}
        total={100}
        setPage={setPage}
        setPerPage={setPerPage}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </>
  )
}
```

### Hide Rows Per Page Selector

```tsx
<Pagination rowsPerPageOptions={[]} />
```

---

## RowsPerPageSelector

A dropdown for selecting the number of rows per page.

### Import

```tsx
import { RowsPerPageSelector } from 'shadmin'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Current value |
| `options` | `number[]` | - | Available options |
| `onChange` | `(value) => void` | - | Change handler |
| `className` | `string` | - | Additional CSS class |
| `label` | `string` | `'Rows per page'` | Accessibility label |

### Example

```tsx
import { RowsPerPageSelector } from 'shadmin'

function MyPagination() {
  const [perPage, setPerPage] = useState(10)

  return (
    <RowsPerPageSelector
      value={perPage}
      options={[10, 25, 50, 100]}
      onChange={setPerPage}
    />
  )
}
```

---

## Filter Components

### FilterButton

A button that toggles filter visibility and shows the count of active filters.

#### Import

```tsx
import { FilterButton } from 'shadmin'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `'Filters'` | Button label |
| `isOpen` | `boolean` | - | Controlled open state |
| `onToggle` | `() => void` | - | Toggle callback |
| `className` | `string` | - | Additional CSS class |
| `disabled` | `boolean` | - | Disable the button |

#### Example

```tsx
import { FilterButton } from 'shadmin'

function PostListActions() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <>
      <FilterButton
        isOpen={showFilters}
        onToggle={() => setShowFilters(!showFilters)}
      />
      {showFilters && <PostFilters />}
    </>
  )
}
```

### FilterForm

A form wrapper that handles filter submission and integrates with ListContext.

#### Import

```tsx
import { FilterForm } from 'shadmin'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode \| ((props) => ReactNode)` | - | Form content |
| `defaultValues` | `object` | - | Default form values |
| `onSubmit` | `(e) => void` | - | Custom submit handler |
| `className` | `string` | - | Additional CSS class |

#### Example with Static Children

```tsx
import { FilterForm } from 'shadmin'

function PostFilters() {
  return (
    <FilterForm defaultValues={{ search: '', category: '' }}>
      <input name="search" placeholder="Search..." />
      <select name="category">
        <option value="">All</option>
        <option value="tech">Tech</option>
        <option value="news">News</option>
      </select>
      <button type="submit">Apply</button>
    </FilterForm>
  )
}
```

#### Example with Render Prop

```tsx
import { FilterForm } from 'shadmin'

function PostFilters() {
  return (
    <FilterForm>
      {({ reset, register }) => (
        <>
          <input {...register('search')} placeholder="Search..." />
          <button type="submit">Apply</button>
          <button type="button" onClick={reset}>Clear</button>
        </>
      )}
    </FilterForm>
  )
}
```

### SearchInput

A debounced text search input that integrates with ListContext.

#### Import

```tsx
import { SearchInput } from 'shadmin'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | `'q'` | Filter key name |
| `debounce` | `number` | `500` | Debounce delay in ms |
| `placeholder` | `string` | `'Search...'` | Input placeholder |
| `className` | `string` | - | Additional CSS class |
| `disabled` | `boolean` | - | Disable input |

#### Example

```tsx
import { List, Datagrid, TextField, SearchInput } from 'shadmin'

export function PostList() {
  return (
    <List
      resource="posts"
      filters={<SearchInput source="q" placeholder="Search posts..." />}
    >
      <Datagrid>
        <TextField source="title" />
      </Datagrid>
    </List>
  )
}
```

#### With Custom Debounce

```tsx
<SearchInput source="search" debounce={300} />
```

---

## Datagrid Sub-Components

These components are used internally by Datagrid but can be used separately for custom implementations.

### DatagridHeader

Renders the table header row(s).

```tsx
import { DatagridHeader } from 'shadmin'

<DatagridHeader
  headerGroups={table.getHeaderGroups()}
  sort={sort}
  onSortChange={handleSortChange}
/>
```

### DatagridBody

Renders the table body with data rows.

```tsx
import { DatagridBody } from 'shadmin'

<DatagridBody
  rows={table.getRowModel().rows}
  isEmpty={data.length === 0}
  columnCount={columns.length}
  flexRender={flexRender}
  selectedIds={selectedIds}
  hover
/>
```

### DatagridRow

Renders a single table row with TanStack Table integration.

```tsx
import { DatagridRow } from 'shadmin'

<DatagridRow
  row={row}
  rowIndex={index}
  flexRender={flexRender}
  hover
  isClickable
  onClick={handleRowClick}
/>
```

### SimpleDatagridRow

A simpler row component without TanStack Table dependency.

```tsx
import { SimpleDatagridRow } from 'shadmin'

<SimpleDatagridRow record={record} rowIndex={0} hover>
  <td><TextField source="name" /></td>
  <td><TextField source="email" /></td>
</SimpleDatagridRow>
```

---

## ListContext

The `ListContext` provides all list state and callbacks to child components.

### useListContext Hook

```tsx
import { useListContext } from 'shadmin'

function MyComponent() {
  const {
    data,           // T[] | undefined - The fetched records
    total,          // number | undefined - Total record count
    isLoading,      // boolean - Loading state
    isFetching,     // boolean - Background refetch state
    error,          // Error | null - Query error
    page,           // number - Current page (1-indexed)
    perPage,        // number - Records per page
    sort,           // SortPayload - { field, order }
    filterValues,   // FilterPayload - Current filters
    selectedIds,    // Identifier[] - Selected record IDs
    resource,       // string - Resource name
    setPage,        // (page: number) => void
    setPerPage,     // (perPage: number) => void
    setSort,        // (sort: SortPayload) => void
    setFilters,     // (filters: FilterPayload) => void
    onSelect,       // (ids: Identifier[]) => void
    onToggleItem,   // (id: Identifier) => void
    onUnselectItems,// () => void
    refetch,        // () => void
  } = useListContext()
}
```

### Types

```tsx
interface SortPayload {
  field: string
  order: 'ASC' | 'DESC'
}

type FilterPayload = Record<string, unknown>

type Identifier = string | number
```

---

## Bulk Actions

Bulk actions are enabled via the `bulkActionButtons` prop on `Datagrid`. When enabled, a selection checkbox column is added and selected IDs are available through `useListContext`.

### Example with Custom Bulk Actions

```tsx
import { List, Datagrid, TextField, useListContext } from 'shadmin'
import { Button } from 'shadmin'

function BulkDeleteButton() {
  const { selectedIds, onUnselectItems, refetch } = useListContext()

  const handleDelete = async () => {
    await deleteMany(selectedIds)
    onUnselectItems()
    refetch()
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={selectedIds.length === 0}
    >
      Delete ({selectedIds.length})
    </Button>
  )
}

function PostListActions() {
  return (
    <div className="flex gap-2">
      <BulkDeleteButton />
      <CreateButton />
    </div>
  )
}

export function PostList() {
  return (
    <List resource="posts" actions={<PostListActions />}>
      <Datagrid bulkActionButtons>
        <TextField source="title" />
        <TextField source="author" />
      </Datagrid>
    </List>
  )
}
```

---

## Complete Example

Here is a complete example showcasing most List features:

```tsx
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  BooleanField,
  SearchInput,
  FilterForm,
  FilterButton,
  Pagination,
  useListContext,
} from 'shadmin'
import { Button } from 'shadmin'

// Bulk actions component
function BulkActions() {
  const { selectedIds, onUnselectItems, refetch } = useListContext()

  if (selectedIds.length === 0) return null

  return (
    <div className="flex gap-2 mb-4">
      <Button variant="outline" onClick={onUnselectItems}>
        Clear Selection ({selectedIds.length})
      </Button>
      <Button variant="destructive">
        Delete Selected
      </Button>
    </div>
  )
}

// Filter form component
function UserFilters() {
  return (
    <FilterForm>
      {({ reset }) => (
        <div className="flex gap-4">
          <SearchInput source="q" placeholder="Search users..." />
          <select name="role" className="border rounded px-2">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <Button type="submit" variant="outline" size="sm">
            Apply
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={reset}>
            Clear
          </Button>
        </div>
      )}
    </FilterForm>
  )
}

// Main list component
export function UserList() {
  return (
    <List
      resource="users"
      title="User Management"
      perPage={25}
      sort={{ field: 'createdAt', order: 'DESC' }}
      filters={<UserFilters />}
      actions={<Button>Create User</Button>}
    >
      <BulkActions />
      <Datagrid
        bulkActionButtons
        rowClick="edit"
        hover
        rowStyle={(record) => ({
          backgroundColor: record.status === 'inactive' ? '#fef2f2' : undefined,
        })}
      >
        <TextField source="name" />
        <EmailField source="email" />
        <TextField source="role" />
        <BooleanField source="isActive" />
        <DateField source="createdAt" />
      </Datagrid>
      <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
    </List>
  )
}
```

---

## Mobile Responsive Example

Use `SimpleList` for mobile views:

```tsx
import { List, Datagrid, SimpleList, TextField } from 'shadmin'
import { useMediaQuery } from './hooks/useMediaQuery'

export function UserList() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <List resource="users">
      {isMobile ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => record.email}
          tertiaryText={(record) => record.role}
        />
      ) : (
        <Datagrid>
          <TextField source="name" />
          <TextField source="email" />
          <TextField source="role" />
        </Datagrid>
      )}
    </List>
  )
}
```

---

## API Reference Summary

### Components

| Component | Description |
|-----------|-------------|
| `List` | Complete list with data fetching and UI |
| `ListBase` | List logic without UI wrapper |
| `ListView` | UI container for list display |
| `Datagrid` | Table display component |
| `DatagridHeader` | Table header component |
| `DatagridBody` | Table body component |
| `DatagridRow` | Single table row |
| `SimpleDatagridRow` | Simple row without TanStack Table |
| `SimpleList` | Mobile-friendly list display |
| `Pagination` | Pagination controls |
| `RowsPerPageSelector` | Per-page dropdown |
| `FilterButton` | Filter toggle button |
| `FilterForm` | Filter form wrapper |
| `SearchInput` | Debounced search input |

### Hooks

| Hook | Description |
|------|-------------|
| `useListContext` | Access list state and callbacks |

### Types

| Type | Description |
|------|-------------|
| `ListProps` | Props for List component |
| `ListBaseProps` | Props for ListBase component |
| `ListViewProps` | Props for ListView component |
| `DatagridProps` | Props for Datagrid component |
| `DatagridColumn` | Column configuration |
| `RowClickHandler` | Row click handler type |
| `SimpleListProps` | Props for SimpleList |
| `PaginationProps` | Props for Pagination |
| `RowsPerPageSelectorProps` | Props for RowsPerPageSelector |
| `FilterButtonProps` | Props for FilterButton |
| `FilterFormProps` | Props for FilterForm |
| `SearchInputProps` | Props for SearchInput |
| `SortPayload` | Sort configuration |
| `FilterPayload` | Filter values |
| `ListControllerResult` | Full list context interface |
