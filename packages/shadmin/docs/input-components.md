# Input Components

Shadmin provides a comprehensive set of form input components that integrate seamlessly with react-hook-form through FormContext. All inputs follow ShadCN design patterns and support consistent validation, error display, and accessibility features.

## Table of Contents

- [Common Props](#common-props)
- [Text Inputs](#text-inputs)
  - [TextInput](#textinput)
  - [NumberInput](#numberinput)
  - [PasswordInput](#passwordinput)
- [Date and Time Inputs](#date-and-time-inputs)
  - [DateInput](#dateinput)
  - [DateTimeInput](#datetimeinput)
  - [TimeInput](#timeinput)
- [Selection Inputs](#selection-inputs)
  - [SelectInput](#selectinput)
  - [AutocompleteInput](#autocompleteinput)
  - [RadioButtonGroupInput](#radiobuttongroupinput)
  - [CheckboxGroupInput](#checkboxgroupinput)
  - [SelectArrayInput](#selectarrayinput)
- [Boolean Input](#boolean-input)
  - [BooleanInput](#booleaninput)
- [Reference Inputs](#reference-inputs)
  - [ReferenceInput](#referenceinput)
  - [ReferenceArrayInput](#referencearrayinput)
- [File Inputs](#file-inputs)
  - [FileInput](#fileinput)
  - [ImageInput](#imageinput)
- [Rich Text Input](#rich-text-input)
  - [RichTextInput](#richtextinput)
- [Array Input](#array-input)
  - [ArrayInput](#arrayinput)
  - [SimpleFormIterator](#simpleformiterator)
- [Validation Examples](#validation-examples)

---

## Common Props

All input components share these common props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | Required | The field name in the form data. Maps to the `name` attribute. |
| `label` | `string \| false` | `source` | Label text displayed above the input. Set to `false` to hide. |
| `helperText` | `string` | - | Helper text displayed below the input. |
| `rules` | `RegisterOptions` | - | Validation rules passed to react-hook-form. |
| `disabled` | `boolean` | `false` | Whether the input is disabled. |
| `required` | `boolean` | `false` | Whether the field is required. |
| `fullWidth` | `boolean` | `false` | Whether the input takes full container width. |
| `className` | `string` | - | Additional CSS classes. |

---

## Text Inputs

### TextInput

A basic text input for single-line text entry.

```tsx
import { TextInput } from 'shadmin'

// Basic usage
<TextInput source="firstName" label="First Name" />

// With validation
<TextInput
  source="email"
  label="Email"
  rules={{
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
  }}
/>

// With helper text
<TextInput
  source="username"
  label="Username"
  helperText="Choose a unique username"
/>

// With placeholder and maxLength
<TextInput
  source="bio"
  label="Bio"
  placeholder="Tell us about yourself"
  maxLength={200}
/>
```

**Additional Props:**

| Prop | Type | Description |
|------|------|-------------|
| `placeholder` | `string` | Placeholder text |
| `maxLength` | `number` | Maximum character length |
| `readOnly` | `boolean` | Make input read-only |
| `autoFocus` | `boolean` | Auto-focus on mount |
| `inputProps` | `InputHTMLAttributes` | Additional props for the input element |

---

### NumberInput

A number input with min/max/step support. Hides browser spinner buttons.

```tsx
import { NumberInput } from 'shadmin'

// Basic usage
<NumberInput source="age" label="Age" />

// With min/max validation
<NumberInput
  source="quantity"
  label="Quantity"
  min={1}
  max={100}
  rules={{
    min: { value: 1, message: 'Minimum quantity is 1' },
    max: { value: 100, message: 'Maximum quantity is 100' },
  }}
/>

// With step for decimals
<NumberInput
  source="price"
  label="Price"
  step={0.01}
/>
```

**Additional Props:**

| Prop | Type | Description |
|------|------|-------------|
| `min` | `number` | Minimum value |
| `max` | `number` | Maximum value |
| `step` | `number` | Step increment (e.g., `0.01` for decimals) |

---

### PasswordInput

A password input with show/hide toggle button.

```tsx
import { PasswordInput } from 'shadmin'

// Basic usage
<PasswordInput source="password" label="Password" />

// With validation
<PasswordInput
  source="password"
  label="Password"
  rules={{
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
  }}
/>

// With autoComplete for password managers
<PasswordInput
  source="confirmPassword"
  label="Confirm Password"
  autoComplete="new-password"
/>
```

**Additional Props:**

| Prop | Type | Description |
|------|------|-------------|
| `autoComplete` | `string` | Autocomplete hint for password managers |

---

## Date and Time Inputs

### DateInput

A date picker using the native HTML date input.

```tsx
import { DateInput } from 'shadmin'

// Basic usage
<DateInput source="birthDate" label="Birth Date" />

// With min/max constraints
<DateInput
  source="eventDate"
  label="Event Date"
  min="2024-01-01"
  max="2024-12-31"
/>

// With custom validation
<DateInput
  source="deadline"
  label="Deadline"
  rules={{
    required: 'Deadline is required',
    validate: (value) => {
      const today = new Date().toISOString().split('T')[0]
      return value >= today || 'Date cannot be in the past'
    },
  }}
/>
```

**Additional Props:**

| Prop | Type | Description |
|------|------|-------------|
| `min` | `string` | Minimum date (YYYY-MM-DD format) |
| `max` | `string` | Maximum date (YYYY-MM-DD format) |
| `minMessage` | `string` | Custom error for min date validation |
| `maxMessage` | `string` | Custom error for max date validation |

---

### DateTimeInput

A datetime picker using the native datetime-local input.

```tsx
import { DateTimeInput } from 'shadmin'

// Basic usage
<DateTimeInput source="eventStart" label="Event Start" />

// With min/max constraints
<DateTimeInput
  source="meetingTime"
  label="Meeting Time"
  min="2024-01-01T09:00"
  max="2024-12-31T17:00"
/>

// With validation
<DateTimeInput
  source="deadline"
  label="Deadline"
  rules={{
    required: 'Deadline is required',
    validate: (value) => {
      return new Date(value) > new Date() || 'DateTime must be in the future'
    },
  }}
/>
```

**Additional Props:**

| Prop | Type | Description |
|------|------|-------------|
| `min` | `string` | Minimum datetime (YYYY-MM-DDTHH:MM format) |
| `max` | `string` | Maximum datetime |
| `step` | `number` | Step in seconds |

---

### TimeInput

A time picker using the native HTML time input.

```tsx
import { TimeInput } from 'shadmin'

// Basic usage
<TimeInput source="startTime" label="Start Time" />

// With min/max constraints
<TimeInput
  source="meetingTime"
  label="Meeting Time"
  min="09:00"
  max="17:00"
/>

// With step for granularity (in seconds)
<TimeInput
  source="preciseTime"
  label="Precise Time"
  step={60}
/>
```

**Additional Props:**

| Prop | Type | Description |
|------|------|-------------|
| `min` | `string` | Minimum time (HH:MM format) |
| `max` | `string` | Maximum time |
| `minMessage` | `string` | Custom error for min time validation |
| `maxMessage` | `string` | Custom error for max time validation |
| `step` | `number` | Step in seconds |

---

## Selection Inputs

### SelectInput

A dropdown select for single-value selection.

```tsx
import { SelectInput } from 'shadmin'

// Basic usage with default id/name fields
<SelectInput
  source="status"
  label="Status"
  choices={[
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
  ]}
/>

// With custom value/text fields
<SelectInput
  source="country"
  label="Country"
  choices={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  optionValue="value"
  optionText="label"
/>

// With empty placeholder
<SelectInput
  source="category"
  label="Category"
  choices={categories}
  emptyText="Select a category"
/>

// With custom text renderer
<SelectInput
  source="user"
  label="User"
  choices={users}
  optionText={(choice) => `${choice.firstName} ${choice.lastName}`}
/>
```

**Additional Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `choices` | `SelectChoice[]` | Required | Array of choices |
| `optionValue` | `string` | `'id'` | Property name for option value |
| `optionText` | `string \| ((choice) => string)` | `'name'` | Property name or function for option text |
| `emptyText` | `string` | - | Placeholder option text |
| `disableValue` | `string` | - | Property to check for disabling options |

---

### AutocompleteInput

A typeahead autocomplete input with filtering and optional creation.

```tsx
import { AutocompleteInput } from 'shadmin'

// Basic usage
<AutocompleteInput
  source="status"
  label="Status"
  choices={[
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
  ]}
/>

// With custom value/text fields
<AutocompleteInput
  source="country"
  label="Country"
  choices={countries}
  optionValue="code"
  optionText="name"
/>

// With create functionality
<AutocompleteInput
  source="tag"
  label="Tag"
  choices={tags}
  onCreate={async (value) => {
    const newTag = await createTag(value)
    return newTag
  }}
/>

// With debounce for large lists
<AutocompleteInput
  source="product"
  label="Product"
  choices={products}
  debounce={300}
/>
```

**Additional Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `choices` | `AutocompleteChoice[]` | Required | Array of choices |
| `optionValue` | `string` | `'id'` | Property name for option value |
| `optionText` | `string \| ((choice) => string)` | `'name'` | Property name or function for option text |
| `onCreate` | `(value: string) => Promise<Choice>` | - | Callback to create new options |
| `debounce` | `number` | `0` | Debounce delay in milliseconds |

---

### RadioButtonGroupInput

A group of radio buttons for single selection.

```tsx
import { RadioButtonGroupInput } from 'shadmin'

// Basic usage with default id/name fields
<RadioButtonGroupInput
  source="status"
  label="Status"
  choices={[
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
  ]}
/>

// With custom value/text fields
<RadioButtonGroupInput
  source="country"
  label="Country"
  choices={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  optionValue="value"
  optionText="label"
/>

// Horizontal layout
<RadioButtonGroupInput
  source="priority"
  label="Priority"
  choices={priorities}
  row
/>

// With custom text renderer
<RadioButtonGroupInput
  source="user"
  label="User"
  choices={users}
  optionText={(choice) => `${choice.firstName} ${choice.lastName}`}
/>
```

**Additional Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `choices` | `RadioChoice[]` | Required | Array of choices |
| `optionValue` | `string` | `'id'` | Property name for option value |
| `optionText` | `string \| ((choice) => string)` | `'name'` | Property name or function for option text |
| `disableValue` | `string` | - | Property to check for disabling options |
| `row` | `boolean` | `false` | Display horizontally |

---

### CheckboxGroupInput

A group of checkboxes for multi-selection (stores an array of values).

```tsx
import { CheckboxGroupInput } from 'shadmin'

// Basic usage with default id/name fields
<CheckboxGroupInput
  source="permissions"
  label="Permissions"
  choices={[
    { id: 'read', name: 'Read' },
    { id: 'write', name: 'Write' },
    { id: 'delete', name: 'Delete' },
  ]}
/>

// With custom value/text fields
<CheckboxGroupInput
  source="roles"
  label="Roles"
  choices={[
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'Regular User' },
  ]}
  optionValue="value"
  optionText="label"
/>

// Horizontal layout
<CheckboxGroupInput
  source="features"
  label="Features"
  choices={features}
  row
/>

// With validation
<CheckboxGroupInput
  source="terms"
  label="Agreements"
  choices={terms}
  rules={{
    validate: (value) => value.length > 0 || 'At least one selection is required'
  }}
/>
```

**Additional Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `choices` | `CheckboxChoice[]` | Required | Array of choices |
| `optionValue` | `string` | `'id'` | Property name for option value |
| `optionText` | `string \| ((choice) => string)` | `'name'` | Property name or function for option text |
| `disableValue` | `string` | - | Property to check for disabling options |
| `row` | `boolean` | `false` | Display horizontally |

---

### SelectArrayInput

A multi-select listbox for selecting multiple values (stores an array).

```tsx
import { SelectArrayInput } from 'shadmin'

// Basic usage with default id/name fields
<SelectArrayInput
  source="tags"
  label="Tags"
  choices={[
    { id: 'tech', name: 'Technology' },
    { id: 'news', name: 'News' },
  ]}
/>

// With custom value/text fields
<SelectArrayInput
  source="languages"
  label="Languages"
  choices={[
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
  ]}
  optionValue="value"
  optionText="label"
/>

// With validation
<SelectArrayInput
  source="categories"
  label="Categories"
  choices={categories}
  rules={{
    validate: (value) => value.length > 0 || 'Select at least one category'
  }}
/>
```

**Additional Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `choices` | `SelectArrayChoice[]` | Required | Array of choices |
| `optionValue` | `string` | `'id'` | Property name for option value |
| `optionText` | `string \| ((choice) => string)` | `'name'` | Property name or function for option text |

---

## Boolean Input

### BooleanInput

A switch/toggle for boolean values.

```tsx
import { BooleanInput } from 'shadmin'

// Basic usage
<BooleanInput source="isActive" label="Active" />

// With helper text
<BooleanInput
  source="notifications"
  label="Enable Notifications"
  helperText="Receive email notifications for updates"
/>

// Without label
<BooleanInput source="hidden" label={false} />

// With validation
<BooleanInput
  source="acceptTerms"
  label="Accept Terms"
  rules={{
    validate: (value) => value === true || 'You must accept the terms'
  }}
/>
```

---

## Reference Inputs

### ReferenceInput

Fetches choices from a referenced resource and provides them to child inputs.

```tsx
import { ReferenceInput, SelectInput, AutocompleteInput } from 'shadmin'

// Basic usage with SelectInput
<ReferenceInput source="authorId" reference="authors">
  <SelectInput source="authorId" label="Author" />
</ReferenceInput>

// With custom filter and sort
<ReferenceInput
  source="categoryId"
  reference="categories"
  filter={{ isActive: true }}
  sort={{ field: 'name', order: 'ASC' }}
>
  <SelectInput source="categoryId" label="Category" />
</ReferenceInput>

// With custom optionText function
<ReferenceInput
  source="userId"
  reference="users"
  optionText={(user) => `${user.firstName} ${user.lastName}`}
>
  <AutocompleteInput source="userId" label="User" />
</ReferenceInput>

// With empty text and perPage
<ReferenceInput
  source="productId"
  reference="products"
  perPage={100}
  emptyText="Select a product"
>
  <SelectInput source="productId" label="Product" />
</ReferenceInput>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | Required | Field name for the reference ID |
| `reference` | `string` | Required | Resource name to fetch choices from |
| `children` | `ReactElement` | Required | Child input component |
| `filter` | `Record<string, unknown>` | `{}` | Filter for fetching choices |
| `sort` | `{ field: string, order: 'ASC' \| 'DESC' }` | `{ field: 'id', order: 'ASC' }` | Sort configuration |
| `perPage` | `number` | `25` | Number of choices to fetch |
| `optionValue` | `string` | `'id'` | Property name for option value |
| `optionText` | `string \| ((record) => string)` | `'name'` | Property or function for option text |
| `emptyText` | `string` | - | Placeholder option text |

---

### ReferenceArrayInput

Fetches choices from a referenced resource for array fields (many-to-many relationships).

```tsx
import { ReferenceArrayInput, SelectArrayInput, CheckboxGroupInput } from 'shadmin'

// Basic usage with SelectArrayInput
<ReferenceArrayInput source="tag_ids" reference="tags">
  <SelectArrayInput source="tag_ids" choices={[]} />
</ReferenceArrayInput>

// With CheckboxGroupInput
<ReferenceArrayInput source="category_ids" reference="categories">
  <CheckboxGroupInput source="category_ids" choices={[]} />
</ReferenceArrayInput>

// With filtering
<ReferenceArrayInput
  source="tag_ids"
  reference="tags"
  filter={{ active: true }}
>
  <SelectArrayInput source="tag_ids" choices={[]} />
</ReferenceArrayInput>

// With sorting
<ReferenceArrayInput
  source="tag_ids"
  reference="tags"
  sort={{ field: 'name', order: 'ASC' }}
>
  <SelectArrayInput source="tag_ids" choices={[]} />
</ReferenceArrayInput>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | Required | Field name for the array of IDs |
| `reference` | `string` | Required | Resource name to fetch choices from |
| `children` | `ReactNode` | Required | Child multi-select component |
| `filter` | `Record<string, unknown>` | `{}` | Filter for fetching choices |
| `sort` | `{ field: string, order: 'ASC' \| 'DESC' }` | `{ field: 'id', order: 'ASC' }` | Sort configuration |
| `perPage` | `number` | `25` | Number of choices to fetch |

---

## File Inputs

### FileInput

A file upload input with drag-and-drop support.

```tsx
import { FileInput } from 'shadmin'

// Basic usage
<FileInput source="avatar" label="Profile Picture" />

// With file type restriction
<FileInput
  source="image"
  label="Image"
  accept="image/*"
/>

// Multiple file selection
<FileInput
  source="documents"
  label="Documents"
  multiple
  accept=".pdf,.doc,.docx"
/>

// With validation
<FileInput
  source="resume"
  label="Resume"
  rules={{
    required: 'Resume is required',
    validate: (files) => {
      if (files && files[0]?.size > 5000000) {
        return 'File must be less than 5MB'
      }
      return true
    },
  }}
/>
```

**Additional Props:**

| Prop | Type | Description |
|------|------|-------------|
| `accept` | `string` | Accepted file types (e.g., `'image/*'`, `'.pdf,.doc'`) |
| `multiple` | `boolean` | Allow multiple file selection |

---

### ImageInput

An image upload input with preview and drag-and-drop support.

```tsx
import { ImageInput } from 'shadmin'

// Basic usage
<ImageInput source="avatar" label="Profile Picture" />

// With file size limit (2MB)
<ImageInput
  source="photo"
  label="Photo"
  maxSize={2 * 1024 * 1024}
/>

// Multiple images
<ImageInput
  source="gallery"
  label="Gallery"
  multiple
/>

// With custom accept types
<ImageInput
  source="logo"
  label="Logo"
  accept="image/png,image/svg+xml"
/>
```

**Additional Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accept` | `string` | `'image/*'` | Accepted image types |
| `multiple` | `boolean` | `false` | Allow multiple images |
| `maxSize` | `number` | - | Maximum file size in bytes |

---

## Rich Text Input

### RichTextInput

A rich text editor with formatting toolbar (bold, italic, underline, headings, lists).

```tsx
import { RichTextInput } from 'shadmin'

// Basic usage
<RichTextInput source="content" label="Content" />

// With validation
<RichTextInput
  source="description"
  label="Description"
  rules={{ required: 'Description is required' }}
/>

// With helper text
<RichTextInput
  source="bio"
  label="Biography"
  helperText="Write a short bio about yourself"
/>
```

**Supported Formatting:**
- Bold, Italic, Underline
- Heading 1, Heading 2
- Ordered List, Unordered List

---

## Array Input

### ArrayInput

A container for managing arrays of form data using react-hook-form's useFieldArray.

```tsx
import { ArrayInput, SimpleFormIterator, TextInput, NumberInput } from 'shadmin'

// Basic usage with tags
<ArrayInput source="tags">
  <SimpleFormIterator>
    <TextInput source="name" />
  </SimpleFormIterator>
</ArrayInput>

// With multiple fields per item
<ArrayInput source="addresses" label="Addresses">
  <SimpleFormIterator>
    <TextInput source="street" label="Street" />
    <TextInput source="city" label="City" />
    <TextInput source="zipCode" label="ZIP Code" />
  </SimpleFormIterator>
</ArrayInput>

// With min/max constraints
<ArrayInput source="contacts" minItems={1} maxItems={5}>
  <SimpleFormIterator>
    <TextInput source="email" />
  </SimpleFormIterator>
</ArrayInput>

// With default value for new items
<ArrayInput source="items" defaultValue={{ name: '', quantity: 1 }}>
  <SimpleFormIterator>
    <TextInput source="name" />
    <NumberInput source="quantity" />
  </SimpleFormIterator>
</ArrayInput>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `source` | `string` | Field name for the array |
| `label` | `string \| false` | Label text |
| `defaultValue` | `Record<string, unknown>` | Default value for new items |
| `minItems` | `number` | Minimum number of items |
| `maxItems` | `number` | Maximum number of items |
| `minItemsMessage` | `string` | Custom error for min items |
| `maxItemsMessage` | `string` | Custom error for max items |

---

### SimpleFormIterator

Renders the items within an ArrayInput with add/remove functionality.

```tsx
import { ArrayInput, SimpleFormIterator, TextInput } from 'shadmin'

// Basic usage
<ArrayInput source="items">
  <SimpleFormIterator>
    <TextInput source="name" />
  </SimpleFormIterator>
</ArrayInput>

// Inline layout
<ArrayInput source="tags">
  <SimpleFormIterator inline>
    <TextInput source="name" />
  </SimpleFormIterator>
</ArrayInput>

// With custom add button
<ArrayInput source="items">
  <SimpleFormIterator addButton="Add Item">
    <TextInput source="name" />
  </SimpleFormIterator>
</ArrayInput>

// With item labels
<ArrayInput source="contacts">
  <SimpleFormIterator getItemLabel={(index) => `Contact #${index + 1}`}>
    <TextInput source="name" />
    <TextInput source="email" />
  </SimpleFormIterator>
</ArrayInput>

// Disable add/remove
<ArrayInput source="fixedItems">
  <SimpleFormIterator disableAdd disableRemove>
    <TextInput source="name" />
  </SimpleFormIterator>
</ArrayInput>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inline` | `boolean` | `false` | Render items horizontally |
| `disableAdd` | `boolean` | `false` | Disable the add button |
| `disableRemove` | `boolean` | `false` | Disable remove buttons |
| `addButton` | `ReactNode` | `'Add'` | Custom add button text/element |
| `getItemLabel` | `(index: number) => string` | - | Function to generate item labels |

---

## Validation Examples

### Required Field

```tsx
<TextInput
  source="email"
  label="Email"
  required
  rules={{ required: 'Email is required' }}
/>
```

### Pattern Validation

```tsx
<TextInput
  source="email"
  label="Email"
  rules={{
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
  }}
/>
```

### Min/Max Length

```tsx
<TextInput
  source="username"
  label="Username"
  rules={{
    minLength: { value: 3, message: 'Username must be at least 3 characters' },
    maxLength: { value: 20, message: 'Username must be at most 20 characters' },
  }}
/>
```

### Min/Max Value

```tsx
<NumberInput
  source="age"
  label="Age"
  rules={{
    min: { value: 18, message: 'Must be at least 18' },
    max: { value: 120, message: 'Invalid age' },
  }}
/>
```

### Custom Validation

```tsx
<TextInput
  source="username"
  label="Username"
  rules={{
    validate: async (value) => {
      const isAvailable = await checkUsernameAvailable(value)
      return isAvailable || 'Username is already taken'
    },
  }}
/>
```

### Multiple Validations

```tsx
<PasswordInput
  source="password"
  label="Password"
  rules={{
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
    validate: {
      hasUpperCase: (value) =>
        /[A-Z]/.test(value) || 'Must contain an uppercase letter',
      hasLowerCase: (value) =>
        /[a-z]/.test(value) || 'Must contain a lowercase letter',
      hasNumber: (value) =>
        /\d/.test(value) || 'Must contain a number',
    },
  }}
/>
```

### Array Validation

```tsx
<CheckboxGroupInput
  source="permissions"
  label="Permissions"
  choices={permissions}
  rules={{
    validate: (value) => value.length > 0 || 'Select at least one permission'
  }}
/>
```

### Dependent Field Validation

```tsx
<PasswordInput
  source="confirmPassword"
  label="Confirm Password"
  rules={{
    validate: (value, formValues) =>
      value === formValues.password || 'Passwords do not match',
  }}
/>
```

---

## Importing Components

All input components can be imported from the main package:

```tsx
import {
  TextInput,
  NumberInput,
  PasswordInput,
  DateInput,
  DateTimeInput,
  TimeInput,
  SelectInput,
  AutocompleteInput,
  RadioButtonGroupInput,
  CheckboxGroupInput,
  SelectArrayInput,
  BooleanInput,
  ReferenceInput,
  ReferenceArrayInput,
  FileInput,
  ImageInput,
  RichTextInput,
  ArrayInput,
  SimpleFormIterator,
} from 'shadmin'
```
