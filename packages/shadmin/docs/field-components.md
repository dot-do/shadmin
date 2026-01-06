# Field Components

Field components are used to display data from records in various formats. They are commonly used within List, Show, and Datagrid components.

## Table of Contents

- [Common Props](#common-props)
- [TextField](#textfield)
- [NumberField](#numberfield)
- [DateField](#datefield)
- [BooleanField](#booleanfield)
- [EmailField](#emailfield)
- [UrlField](#urlfield)
- [ImageField](#imagefield)
- [RichTextField](#richtextfield)
- [ChipField](#chipfield)
- [FunctionField](#functionfield)
- [ArrayField](#arrayfield)
- [ReferenceField](#referencefield)
- [ReferenceArrayField](#referencearrayfield)
- [ReferenceManyField](#referencemanyfield)

---

## Common Props

All Field components share these common props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name in the record to display. Supports nested paths like `"author.name"`. |
| `record` | `RaRecord` | - | Optional record to use instead of RecordContext. |
| `label` | `string` | - | Optional label to display above the value. |
| `emptyText` | `string` | `''` | Text to display when value is empty/null/undefined. |
| `className` | `string` | - | Additional CSS classes. |

---

## TextField

Displays a text value from a record field.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name in the record to display. |
| `emptyText` | `string` | `''` | Text to display when value is empty. |

### Examples

```tsx
// Basic usage with RecordContext
<RecordContextProvider value={{ id: 1, name: 'John' }}>
  <TextField source="name" />
</RecordContextProvider>

// With nested field access
<TextField source="author.name" />

// With label
<TextField source="name" label="Full Name" />

// With custom empty text
<TextField source="nickname" emptyText="N/A" />
```

---

## NumberField

Displays a formatted number value from a record field. Uses `Intl.NumberFormat` for internationalized formatting.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name in the record to display. |
| `locales` | `string \| string[]` | - | Locale(s) to use for number formatting. |
| `options` | `Intl.NumberFormatOptions` | - | Options for `Intl.NumberFormat`. |

### Formatting Options

The `options` prop accepts any valid `Intl.NumberFormatOptions`:

- `style`: `'decimal'`, `'currency'`, `'percent'`, `'unit'`
- `currency`: Currency code (e.g., `'USD'`, `'EUR'`)
- `minimumFractionDigits` / `maximumFractionDigits`
- `notation`: `'standard'`, `'scientific'`, `'engineering'`, `'compact'`

### Examples

```tsx
// Basic usage
<NumberField source="count" />

// With currency formatting
<NumberField
  source="price"
  options={{ style: 'currency', currency: 'USD' }}
/>
// Output: "$1,234.56"

// With percentage formatting
<NumberField
  source="rate"
  options={{ style: 'percent' }}
/>
// Output: "75%" (for value 0.75)

// With German locale
<NumberField source="amount" locales="de-DE" />
// Output: "1.234,56" (for value 1234.56)

// With compact notation
<NumberField
  source="followers"
  options={{ notation: 'compact' }}
/>
// Output: "1.2K" (for value 1234)
```

---

## DateField

Displays a formatted date value from a record field. Uses `Intl.DateTimeFormat` for internationalized formatting.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name in the record to display. |
| `locales` | `string \| string[]` | - | Locale(s) to use for date formatting. |
| `options` | `Intl.DateTimeFormatOptions` | - | Options for `Intl.DateTimeFormat`. |
| `showTime` | `boolean` | `false` | Whether to show time in addition to date. |

### Formatting Options

The `options` prop accepts any valid `Intl.DateTimeFormatOptions`:

- `dateStyle`: `'full'`, `'long'`, `'medium'`, `'short'`
- `timeStyle`: `'full'`, `'long'`, `'medium'`, `'short'`
- `year`, `month`, `day`, `hour`, `minute`, `second`: `'numeric'`, `'2-digit'`
- `weekday`: `'long'`, `'short'`, `'narrow'`

### Examples

```tsx
// Basic usage
<DateField source="createdAt" />

// With custom format
<DateField source="date" options={{ dateStyle: 'long' }} />
// Output: "January 15, 2024"

// With time
<DateField source="date" showTime />
// Output: "1/15/2024, 2:30 PM"

// With German locale
<DateField source="date" locales="de-DE" />
// Output: "15.1.2024"

// Full date with weekday
<DateField
  source="date"
  options={{
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }}
/>
// Output: "Monday, January 15, 2024"
```

---

## BooleanField

Displays a boolean value as a checkmark or x icon.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name in the record to display. |
| `valueLabelTrue` | `string` | - | Label to display when value is true (replaces icon). |
| `valueLabelFalse` | `string` | - | Label to display when value is false (replaces icon). |
| `trueIconColor` | `string` | `'text-green-600'` | CSS class for true icon color. |
| `falseIconColor` | `string` | `'text-red-600'` | CSS class for false icon color. |

### Examples

```tsx
// Basic usage - shows checkmark/x icons
<BooleanField source="active" />

// With custom labels (replaces icons)
<BooleanField
  source="active"
  valueLabelTrue="Yes"
  valueLabelFalse="No"
/>

// With custom icon colors
<BooleanField
  source="active"
  trueIconColor="text-green-500"
  falseIconColor="text-red-500"
/>

// With label
<BooleanField source="isAdmin" label="Administrator" />
```

---

## EmailField

Displays an email as a clickable mailto link.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name in the record containing the email. |

### Examples

```tsx
// Basic usage - creates mailto link
<EmailField source="email" />
// Renders: <a href="mailto:john@example.com">john@example.com</a>

// With label
<EmailField source="email" label="Email Address" />

// With custom styling
<EmailField source="email" className="text-blue-600 underline" />
```

---

## UrlField

Displays a URL as a clickable link. By default, opens in a new tab with security attributes.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name in the record containing the URL. |
| `text` | `string` | - | Custom text to display instead of the URL. |
| `truncateUrl` | `boolean` | `false` | Whether to truncate the URL to just the domain. |
| `target` | `string` | `'_blank'` | Link target attribute. |
| `rel` | `string` | `'noopener noreferrer'` | Link rel attribute for security. |

### Examples

```tsx
// Basic usage - shows full URL
<UrlField source="website" />

// With custom display text
<UrlField source="website" text="Visit Site" />

// Truncate to domain only
<UrlField source="website" truncateUrl />
// Renders: <a href="https://example.com/path">example.com</a>

// Open in same tab
<UrlField source="website" target="_self" />
```

---

## ImageField

Displays an image from a record field. Supports both single images and arrays of images.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name containing the image URL or array of images. |
| `title` | `string` | - | Title for the image alt text. If it matches a field name in the record, uses that field's value. |
| `src` | `string` | `'src'` | For array sources, the field name in each item containing the image URL. |
| `sx` | `CSSProperties` | - | Custom styles for the image element. |

### Examples

```tsx
// Basic usage
<ImageField source="avatar" />

// With custom alt text (literal string)
<ImageField source="avatar" title="User Avatar" />

// With alt text from another field
<ImageField source="avatar" title="name" />
// Uses record.name as alt text

// With label
<ImageField source="avatar" label="Profile Picture" />

// With custom styles
<ImageField
  source="avatar"
  sx={{ width: 100, height: 100, borderRadius: '50%' }}
/>

// With array of images
<ImageField source="photos" src="url" title="caption" />
// Expects: { photos: [{ url: '...', caption: '...' }, ...] }
```

---

## RichTextField

Displays HTML content from a record field. Uses `dangerouslySetInnerHTML` for rendering.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name containing HTML content. |
| `stripTags` | `boolean` | `false` | Strip HTML tags and render as plain text. |

### Examples

```tsx
// Basic usage - renders HTML
<RichTextField source="body" />
// Renders: <div dangerouslySetInnerHTML={{ __html: '<p>Hello <strong>World</strong></p>' }} />

// With nested field access
<RichTextField source="post.body" />

// With label
<RichTextField source="content" label="Article Body" />

// Strip HTML tags for plain text display
<RichTextField source="content" stripTags />
// Renders: "Hello World" (no HTML tags)

// With custom empty text
<RichTextField source="content" emptyText="No content available" />
```

---

## ChipField

Displays a value as a badge/chip. Useful for status fields and tags.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name in the record to display. |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline'` | `'default'` | Visual variant of the chip. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Size of the chip. |

### Variants

- `default`: Primary background with primary foreground text
- `secondary`: Secondary background with secondary foreground text
- `destructive`: Destructive (red) background
- `outline`: Bordered with transparent background

### Examples

```tsx
// Basic usage
<ChipField source="status" />

// With variant
<ChipField source="status" variant="secondary" />

// With destructive variant for errors/warnings
<ChipField source="errorStatus" variant="destructive" />

// With outline variant
<ChipField source="category" variant="outline" />

// With label
<ChipField source="status" label="Status" />

// Small size for compact display
<ChipField source="tag" size="sm" />

// Large size
<ChipField source="priority" size="lg" />
```

---

## FunctionField

Renders custom content based on the record using a render prop. Most flexible field component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `render` | `(record: RaRecord \| undefined) => ReactNode` | required | Function that receives the record and returns content to render. |

### Examples

```tsx
// Combine multiple fields
<FunctionField
  render={(record) => `${record?.firstName} ${record?.lastName}`}
/>

// Custom rendering with JSX
<FunctionField
  render={(record) => (
    <span className="badge">{record?.status}</span>
  )}
/>

// Conditional rendering
<FunctionField
  render={(record) => (
    record?.isVerified
      ? <span className="text-green-500">Verified</span>
      : <span className="text-yellow-500">Pending</span>
  )}
/>

// With label
<FunctionField
  label="Full Name"
  render={(record) => `${record?.firstName} ${record?.lastName}`}
/>

// With empty text fallback
<FunctionField
  render={(record) => record?.nickname}
  emptyText="N/A"
/>

// Complex computations
<FunctionField
  render={(record) => {
    const total = record?.items?.reduce((sum, item) => sum + item.price, 0) || 0
    return `$${total.toFixed(2)}`
  }}
/>
```

---

## ArrayField

Iterates over an array in the record and renders children for each item, wrapping each in its own RecordContext.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name containing the array. |
| `children` | `ReactNode` | - | Children to render for each item in the array. |

### Examples

```tsx
// Basic usage with tags array
<RecordContextProvider value={{
  id: 1,
  tags: [{ id: 1, name: 'React' }, { id: 2, name: 'Vue' }]
}}>
  <ArrayField source="tags">
    <TextField source="name" />
  </ArrayField>
</RecordContextProvider>

// With nested source path
<ArrayField source="data.items">
  <TextField source="value" />
</ArrayField>

// With label
<ArrayField source="tags" label="Tags">
  <TextField source="name" />
</ArrayField>

// With empty text
<ArrayField source="tags" emptyText="No tags yet">
  <TextField source="name" />
</ArrayField>

// With ChipField for tag display
<ArrayField source="tags">
  <ChipField source="name" variant="secondary" />
</ArrayField>
```

---

## ReferenceField

Displays a related record's field by fetching the referenced record. Fetches the referenced record using the `useGetOne` hook.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name containing the reference ID. |
| `reference` | `string` | required | The resource name to fetch the referenced record from. |
| `link` | `'show' \| 'edit' \| false` | `false` | How to render the link to the referenced record. |
| `children` | `ReactNode` | - | Children to render with the referenced record. |

### Examples

```tsx
// Display author name for a post
<RecordContextProvider value={{ id: 1, authorId: 42 }}>
  <ReferenceField source="authorId" reference="users">
    <TextField source="name" />
  </ReferenceField>
</RecordContextProvider>

// With link to show page
<ReferenceField source="authorId" reference="users" link="show">
  <TextField source="name" />
</ReferenceField>

// With link to edit page
<ReferenceField source="authorId" reference="users" link="edit">
  <TextField source="name" />
</ReferenceField>

// Without link
<ReferenceField source="authorId" reference="users" link={false}>
  <TextField source="name" />
</ReferenceField>

// With label
<ReferenceField source="categoryId" reference="categories" label="Category">
  <TextField source="name" />
</ReferenceField>

// Display multiple fields
<ReferenceField source="authorId" reference="users">
  <FunctionField render={(record) => `${record?.name} (${record?.email})`} />
</ReferenceField>
```

---

## ReferenceArrayField

Displays multiple related records from an array of IDs. Fetches referenced records using the `useGetMany` hook.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name containing the array of reference IDs. |
| `reference` | `string` | required | The resource name to fetch the referenced records from. |
| `children` | `ReactNode` | - | Children to render for each referenced record. |

### Examples

```tsx
// Display tags for a post
<RecordContextProvider value={{ id: 1, tagIds: [1, 2, 3] }}>
  <ReferenceArrayField source="tagIds" reference="tags">
    <TextField source="name" />
  </ReferenceArrayField>
</RecordContextProvider>

// With ChipField for visual tags
<ReferenceArrayField source="tagIds" reference="tags">
  <ChipField source="name" variant="secondary" />
</ReferenceArrayField>

// With custom empty text
<ReferenceArrayField source="tagIds" reference="tags" emptyText="No tags">
  <TextField source="name" />
</ReferenceArrayField>

// With label
<ReferenceArrayField source="categoryIds" reference="categories" label="Categories">
  <ChipField source="name" />
</ReferenceArrayField>
```

---

## ReferenceManyField

Fetches related records using a foreign key (one-to-many relationship). Uses `useGetManyReference` hook.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | required | The field name containing the ID to look up. |
| `reference` | `string` | required | The resource name to fetch the related records from. |
| `target` | `string` | required | The foreign key field name in the referenced resource. |
| `perPage` | `number` | `10` | Number of records per page. |
| `page` | `number` | `1` | Page number. |
| `sort` | `{ field: string; order: 'ASC' \| 'DESC' }` | - | Sort configuration. |
| `filter` | `Record<string, unknown>` | - | Filter configuration. |
| `children` | `ReactNode` | - | Children to render for each related record. |

### Examples

```tsx
// Display comments for a post
<RecordContextProvider value={{ id: 1, title: 'My Post' }}>
  <ReferenceManyField source="id" reference="comments" target="post_id">
    <TextField source="body" />
  </ReferenceManyField>
</RecordContextProvider>

// With pagination and sorting
<ReferenceManyField
  source="id"
  reference="comments"
  target="post_id"
  perPage={5}
  sort={{ field: 'created_at', order: 'DESC' }}
>
  <TextField source="body" />
</ReferenceManyField>

// With empty text
<ReferenceManyField
  source="id"
  reference="comments"
  target="post_id"
  emptyText="No comments yet"
>
  <TextField source="body" />
</ReferenceManyField>

// With filtering
<ReferenceManyField
  source="id"
  reference="comments"
  target="post_id"
  filter={{ status: 'approved' }}
>
  <FunctionField
    render={(record) => (
      <div>
        <strong>{record?.author}</strong>: {record?.body}
      </div>
    )}
  />
</ReferenceManyField>

// Display orders for a customer
<ReferenceManyField
  source="id"
  reference="orders"
  target="customer_id"
  label="Orders"
  perPage={10}
  sort={{ field: 'order_date', order: 'DESC' }}
>
  <FunctionField
    render={(record) => `Order #${record?.id} - $${record?.total}`}
  />
</ReferenceManyField>
```

---

## Usage with RecordContext

All Field components can get their record data from a `RecordContextProvider`:

```tsx
import { RecordContextProvider, TextField, NumberField, DateField } from 'shadmin'

function UserShow() {
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    createdAt: '2024-01-15T10:30:00Z'
  }

  return (
    <RecordContextProvider value={user}>
      <div className="space-y-4">
        <TextField source="name" label="Name" />
        <EmailField source="email" label="Email" />
        <NumberField source="age" label="Age" />
        <DateField source="createdAt" label="Member Since" showTime />
      </div>
    </RecordContextProvider>
  )
}
```

## Combining Fields

Fields can be combined to create rich displays:

```tsx
// User card with multiple fields
<RecordContextProvider value={user}>
  <div className="flex items-center gap-4">
    <ImageField
      source="avatar"
      sx={{ width: 64, height: 64, borderRadius: '50%' }}
    />
    <div>
      <FunctionField
        render={(r) => `${r?.firstName} ${r?.lastName}`}
        className="font-bold"
      />
      <EmailField source="email" className="text-sm text-muted-foreground" />
      <ChipField source="role" variant="secondary" size="sm" />
    </div>
  </div>
</RecordContextProvider>
```
