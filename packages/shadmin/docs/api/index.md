**Shadmin API Reference**

***

# Shadmin API Reference

## Classes

### HttpError

Defined in: [errors/index.ts:10](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L10)

HttpError - Represents HTTP errors with status codes
Used for API response errors (400, 401, 403, 404, 500, etc.)

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new HttpError**(`message`, `status`, `body?`): [`HttpError`](#httperror)

Defined in: [errors/index.ts:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L15)

###### Parameters

###### message

`string`

###### status

`number`

###### body?

`unknown`

###### Returns

[`HttpError`](#httperror)

###### Overrides

`Error.constructor`

#### Properties

##### status

> **status**: `number`

Defined in: [errors/index.ts:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L11)

##### statusText?

> `optional` **statusText**: `string`

Defined in: [errors/index.ts:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L12)

##### body?

> `optional` **body**: `unknown`

Defined in: [errors/index.ts:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L13)

***

### NetworkError

Defined in: [errors/index.ts:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L31)

NetworkError - Represents network connectivity issues
Used when the request cannot reach the server (offline, CORS, DNS, etc.)

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new NetworkError**(`message`): [`NetworkError`](#networkerror)

Defined in: [errors/index.ts:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L32)

###### Parameters

###### message

`string` = `'Network request failed'`

###### Returns

[`NetworkError`](#networkerror)

###### Overrides

`Error.constructor`

***

### TimeoutError

Defined in: [errors/index.ts:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L45)

TimeoutError - Represents request timeout
Used when a request exceeds the allowed time limit

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new TimeoutError**(`message`): [`TimeoutError`](#timeouterror)

Defined in: [errors/index.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L46)

###### Parameters

###### message

`string` = `'Request timed out'`

###### Returns

[`TimeoutError`](#timeouterror)

###### Overrides

`Error.constructor`

***

### ValidationError

Defined in: [errors/index.ts:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L59)

ValidationError - Represents validation failures with field-level details
Used for form validation and server-side validation errors

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new ValidationError**(`message`, `errors`): [`ValidationError`](#validationerror)

Defined in: [errors/index.ts:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L62)

###### Parameters

###### message

`string`

###### errors

`Record`\<`string`, `string`[]\>

###### Returns

[`ValidationError`](#validationerror)

###### Overrides

`Error.constructor`

#### Methods

##### getFieldErrors()

> **getFieldErrors**(`field`): `string`[]

Defined in: [errors/index.ts:74](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L74)

Get errors for a specific field

###### Parameters

###### field

`string`

###### Returns

`string`[]

##### hasFieldError()

> **hasFieldError**(`field`): `boolean`

Defined in: [errors/index.ts:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L81)

Check if a field has errors

###### Parameters

###### field

`string`

###### Returns

`boolean`

#### Properties

##### errors

> **errors**: `Record`\<`string`, `string`[]\>

Defined in: [errors/index.ts:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L60)

## Functions

### LoginPage()

> **LoginPage**(`__namedParameters`): `Element`

Defined in: [components/auth/LoginPage.tsx:113](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LoginPage.tsx#L113)

#### Parameters

##### \_\_namedParameters

[`LoginPageProps`](#loginpageprops)

#### Returns

`Element`

***

### LogoutButton()

> **LogoutButton**(`__namedParameters`): `Element`

Defined in: [components/auth/LogoutButton.tsx:146](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L146)

LogoutButton component for user sign-out.

#### Parameters

##### \_\_namedParameters

[`LogoutButtonProps`](#logoutbuttonprops)

#### Returns

`Element`

#### Example

```tsx
// Basic usage
<LogoutButton />

// With custom label
<LogoutButton label="Sign Out" />

// With icon
<LogoutButton icon={<LogOutIcon />} />

// With confirmation dialog
<LogoutButton
  confirmTitle="Confirm Logout"
  confirmMessage="Are you sure you want to logout?"
/>

// Icon-only button
<LogoutButton icon={<LogOutIcon />} iconOnly />
```

***

### ColumnsButton()

> **ColumnsButton**(`_props`): `ReactNode`

Defined in: [components/buttons/ColumnsButton.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ColumnsButton.tsx#L34)

ColumnsButton - Opens a dropdown to configure visible columns

This is a stub component. Full implementation pending.

#### Parameters

##### \_props

[`ColumnsButtonProps`](#columnsbuttonprops)

#### Returns

`ReactNode`

#### Example

```tsx
<ColumnsButton />
```

***

### FilterButton()

> **FilterButton**(`__namedParameters`): `Element`

Defined in: [components/buttons/FilterButton.tsx:209](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L209)

FilterButton component opens a dropdown menu to add filters to a list.

#### Parameters

##### \_\_namedParameters

[`FilterButtonProps`](#filterbuttonprops)

#### Returns

`Element`

#### Example

```tsx
// With filter definitions
<FilterButton
  filters={[
    { source: 'status', label: 'Status' },
    { source: 'category', label: 'Category' },
    { source: 'createdAt', label: 'Created Date' },
  ]}
  displayedFilters={['status']}
  onAddFilter={(source) => addFilter(source)}
/>

// With React filter elements
<FilterButton
  filters={[
    <TextInput source="search" label="Search" />,
    <SelectInput source="status" label="Status" />,
  ]}
  displayedFilters={displayedFilters}
  onAddFilter={showFilter}
/>
```

***

### InPlaceEditor()

> **InPlaceEditor**(`_props`): `ReactNode`

Defined in: [components/buttons/InPlaceEditor.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InPlaceEditor.tsx#L40)

InPlaceEditor - Enables inline editing of field values

This is a stub component. Full implementation pending.

#### Parameters

##### \_props

[`InPlaceEditorProps`](#inplaceeditorprops)

#### Returns

`ReactNode`

#### Example

```tsx
<InPlaceEditor source="title">
  <TextField source="title" />
</InPlaceEditor>
```

***

### InspectorButton()

> **InspectorButton**(`_props`): `ReactNode`

Defined in: [components/buttons/InspectorButton.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InspectorButton.tsx#L32)

InspectorButton - Opens an inspector panel to view record details

This is a stub component. Full implementation pending.

#### Parameters

##### \_props

[`InspectorButtonProps`](#inspectorbuttonprops)

#### Returns

`ReactNode`

#### Example

```tsx
<InspectorButton />
```

***

### Admin()

> **Admin**(`__namedParameters`): `ReactElement`

Defined in: [components/core/Admin.tsx:87](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/Admin.tsx#L87)

Admin component

#### Parameters

##### \_\_namedParameters

[`AdminProps`](#adminprops)

#### Returns

`ReactElement`

#### Example

```tsx
<Admin
  dataProvider={dataProvider}
  authProvider={authProvider}
  layout={MyLayout}
  dashboard={Dashboard}
  theme={myTheme}
  darkTheme={darkTheme}
  basename="/admin"
>
  <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
  <Resource name="users" list={UserList} />
</Admin>
```

***

### withLifecycleCallbacks()

> **withLifecycleCallbacks**(`dataProvider`, `callbacks`): `DataProvider`

Defined in: [components/core/extensions.ts:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L85)

Wraps a DataProvider with lifecycle callbacks for specific resources.

This HOC allows you to intercept and modify data provider operations:
- beforeX callbacks can modify params or abort operations (by throwing)
- afterX callbacks can perform side effects after operations complete

#### Parameters

##### dataProvider

`DataProvider`

The original data provider to wrap

##### callbacks

[`ResourceLifecycleCallbacks`](#resourcelifecyclecallbacks)[]

Array of resource-specific lifecycle callbacks

#### Returns

`DataProvider`

A wrapped data provider with lifecycle hooks

#### Example

```tsx
const wrappedProvider = withLifecycleCallbacks(dataProvider, [
  {
    resource: 'posts',
    beforeCreate: async ({ params }) => {
      // Add timestamp
      return { ...params, data: { ...params.data, createdAt: new Date() } }
    },
    afterCreate: async ({ result }) => {
      // Log creation
      console.log('Created post:', result.data.id)
    },
  },
])
```

***

### Create()

> **Create**\<`RecordType`, `TData`\>(`__namedParameters`): `Element`

Defined in: [components/create/Create.tsx:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/Create.tsx#L61)

Create - Complete create component with form handling and UI

The Create component combines CreateBase (form submission, redirect, notifications)
with CreateView (Card container, header) to provide a complete create solution.

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TData

`TData` = `Record`\<`string`, `unknown`\>

#### Parameters

##### \_\_namedParameters

[`CreateProps`](#createprops)\<`RecordType`, `TData`\>

#### Returns

`Element`

#### Example

```tsx
// Basic usage
<Create resource="posts">
  <SimpleForm>
    <TextInput source="title" />
    <TextInput source="body" multiline />
  </SimpleForm>
</Create>

// With all options
<Create
  resource="posts"
  title="Create New Post"
  redirect="show"
  transform={(data) => ({ ...data, createdAt: new Date() })}
  mutationOptions={{ onSuccess: () => console.log('Created!') }}
>
  <SimpleForm>
    <TextInput source="title" />
    <TextInput source="body" multiline />
  </SimpleForm>
</Create>
```

***

### useOptionalCreateContext()

> **useOptionalCreateContext**\<`TData`\>(): [`CreateContextValue`](#createcontextvalue)\<`TData`\> \| `undefined`

Defined in: [components/create/CreateContext.tsx:114](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L114)

Hook to optionally access the create context.
Returns undefined if not within a CreateContextProvider.

#### Type Parameters

##### TData

`TData` = `Record`\<`string`, `unknown`\>

#### Returns

[`CreateContextValue`](#createcontextvalue)\<`TData`\> \| `undefined`

#### Example

```tsx
const context = useOptionalCreateContext()
if (context) {
  // Inside a Create component
}
```

***

### CreateView()

> **CreateView**(`__namedParameters`): `Element`

Defined in: [components/create/CreateView.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateView.tsx#L58)

CreateView - UI wrapper component for create display

#### Parameters

##### \_\_namedParameters

[`CreateViewProps`](#createviewprops)

#### Returns

`Element`

***

### Edit()

> **Edit**\<`RecordType`\>(`__namedParameters`): `Element`

Defined in: [components/edit/Edit.tsx:227](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/Edit.tsx#L227)

Edit - Complete edit component with data fetching and UI

The Edit component combines EditBase (data fetching, form state, save logic)
with EditView (Card container, header) to provide a complete edit solution.

The `id` prop is optional - if not provided, it will be inferred from the URL
route parameters (e.g., from `/{resource}/:id`).

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### \_\_namedParameters

[`EditProps`](#editprops)\<`RecordType`\>

#### Returns

`Element`

#### Example

```tsx
// Basic usage - id inferred from route
<Edit resource="posts">
  <SimpleForm>
    <TextInput source="title" />
    <TextInput source="body" />
  </SimpleForm>
</Edit>

// With explicit id
<Edit resource="posts" id={1}>
  <SimpleForm>
    <TextInput source="title" />
    <TextInput source="body" />
  </SimpleForm>
</Edit>

// With all options
<Edit
  resource="posts"
  id={1}
  title="Edit Post"
  mutationMode="optimistic"
  redirect="list"
  actions={<DeleteButton />}
  aside={<PostHistory />}
>
  <SimpleForm>
    <TextInput source="title" />
    <TextInput source="body" />
  </SimpleForm>
</Edit>
```

***

### EditView()

> **EditView**(`__namedParameters`): `Element`

Defined in: [components/edit/EditView.tsx:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L70)

EditView - UI wrapper component for edit display

This component provides the visual structure (Card container) for the edit form.
It's typically used by the Edit component to wrap the form.

#### Parameters

##### \_\_namedParameters

[`EditViewProps`](#editviewprops)

#### Returns

`Element`

#### Example

```tsx
// Basic usage (inside EditBase or Edit)
<EditView title="Edit Post">
  <SimpleForm>
    <TextInput source="title" />
    <TextInput source="body" />
  </SimpleForm>
</EditView>

// With actions and aside
<EditView
  title="Edit Post"
  actions={<DeleteButton />}
  aside={<PostHistory />}
>
  <SimpleForm>...</SimpleForm>
</EditView>
```

***

### Confirm()

> **Confirm**(`__namedParameters`): `Element` \| `null`

Defined in: [components/feedback/Confirm.tsx:118](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L118)

Confirm - A confirmation dialog component

#### Parameters

##### \_\_namedParameters

[`ConfirmProps`](#confirmprops)

#### Returns

`Element` \| `null`

#### Example

```tsx
// Delete confirmation
<Confirm
  open={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete item?"
  message="This action cannot be undone."
  confirmVariant="destructive"
/>

// Custom content
<Confirm
  open={open}
  onClose={onClose}
  onConfirm={onConfirm}
  title="Confirm action"
>
  <p>Custom content here</p>
</Confirm>
```

***

### Empty()

> **Empty**(`__namedParameters`): `Element`

Defined in: [components/feedback/Empty.tsx:185](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L185)

Empty - A component for displaying empty states

#### Parameters

##### \_\_namedParameters

[`EmptyProps`](#emptyprops)

#### Returns

`Element`

#### Example

```tsx
// Simple empty state
<Empty message="No items found" />

// With description and action
<Empty
  icon="inbox"
  message="No messages"
  description="You don't have any messages yet"
  actionLabel="Compose"
  onAction={() => navigate('/compose')}
/>

// With resource name
<Empty resource="users" />
```

***

### Error()

> **Error**(`__namedParameters`): `Element`

Defined in: [components/feedback/Error.tsx:109](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Error.tsx#L109)

Error - A component for displaying error states

#### Parameters

##### \_\_namedParameters

[`ErrorProps`](#errorprops)

#### Returns

`Element`

#### Example

```tsx
// Simple error message
<Error error="Something went wrong" />

// With retry button
<Error
  error={new Error('Failed to load data')}
  onRetry={() => refetch()}
/>

// Custom title
<Error
  title="Unable to save"
  error="Network connection lost"
  onRetry={handleRetry}
/>
```

***

### Loading()

> **Loading**(`__namedParameters`): `Element`

Defined in: [components/feedback/Loading.tsx:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Loading.tsx#L61)

Loading - A spinner component for indicating loading states

#### Parameters

##### \_\_namedParameters

[`LoadingProps`](#loadingprops)

#### Returns

`Element`

#### Example

```tsx
// Simple spinner
<Loading />

// With text and larger size
<Loading size="lg" text="Loading data..." />

// Fullscreen overlay
<Loading fullscreen text="Please wait..." />
```

***

### NotificationToast()

> **NotificationToast**(`__namedParameters`): `Element`

Defined in: [components/feedback/Notification.tsx:200](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L200)

NotificationToast - A single notification toast

#### Parameters

##### \_\_namedParameters

[`NotificationToastProps`](#notificationtoastprops)

#### Returns

`Element`

#### Example

```tsx
<NotificationToast
  id="1"
  message="Item saved successfully"
  type="success"
  onDismiss={handleDismiss}
/>
```

***

### NotificationContainer()

> **NotificationContainer**(`__namedParameters`): `Element` \| `null`

Defined in: [components/feedback/Notification.tsx:326](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L326)

NotificationContainer - Container for stacked notifications

#### Parameters

##### \_\_namedParameters

[`NotificationContainerProps`](#notificationcontainerprops)

#### Returns

`Element` \| `null`

#### Example

```tsx
const { notifications, dismiss } = useNotificationContext()

<NotificationContainer
  notifications={notifications}
  onDismiss={dismiss}
  position="top-right"
/>
```

***

### ArrayField()

> **ArrayField**(`__namedParameters`): `Element`

Defined in: [components/field/ArrayField.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ArrayField.tsx#L57)

#### Parameters

##### \_\_namedParameters

[`ArrayFieldProps`](#arrayfieldprops)

#### Returns

`Element`

***

### BooleanField()

> **BooleanField**(`__namedParameters`): `Element`

Defined in: [components/field/BooleanField.tsx:82](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/BooleanField.tsx#L82)

BooleanField component displays a boolean value as a checkmark or x icon.

#### Parameters

##### \_\_namedParameters

[`BooleanFieldProps`](#booleanfieldprops)

#### Returns

`Element`

#### Example

```tsx
// Basic usage with RecordContext
<RecordContextProvider value={{ id: 1, active: true }}>
  <BooleanField source="active" />
</RecordContextProvider>

// With custom labels
<BooleanField source="active" valueLabelTrue="Yes" valueLabelFalse="No" />

// With custom icon colors
<BooleanField source="active" trueIconColor="text-green-500" falseIconColor="text-red-500" />
```

***

### ChipField()

> **ChipField**(`__namedParameters`): `Element` \| `null`

Defined in: [components/field/ChipField.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ChipField.tsx#L52)

#### Parameters

##### \_\_namedParameters

[`ChipFieldProps`](#chipfieldprops)

#### Returns

`Element` \| `null`

***

### DateField()

> **DateField**(`__namedParameters`): `Element`

Defined in: [components/field/DateField.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/DateField.tsx#L54)

#### Parameters

##### \_\_namedParameters

[`DateFieldProps`](#datefieldprops)

#### Returns

`Element`

***

### EmailField()

> **EmailField**(`__namedParameters`): `Element`

Defined in: [components/field/EmailField.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/EmailField.tsx#L43)

#### Parameters

##### \_\_namedParameters

[`EmailFieldProps`](#emailfieldprops)

#### Returns

`Element`

***

### FileField()

> **FileField**(`__namedParameters`): `Element`

Defined in: [components/field/FileField.tsx:97](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L97)

#### Parameters

##### \_\_namedParameters

[`FileFieldProps`](#filefieldprops)

#### Returns

`Element`

***

### FunctionField()

> **FunctionField**(`__namedParameters`): `Element`

Defined in: [components/field/FunctionField.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FunctionField.tsx#L49)

#### Parameters

##### \_\_namedParameters

[`FunctionFieldProps`](#functionfieldprops)

#### Returns

`Element`

***

### ImageField()

> **ImageField**(`__namedParameters`): `Element`

Defined in: [components/field/ImageField.tsx:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ImageField.tsx#L65)

#### Parameters

##### \_\_namedParameters

[`ImageFieldProps`](#imagefieldprops)

#### Returns

`Element`

***

### NumberField()

> **NumberField**(`__namedParameters`): `Element`

Defined in: [components/field/NumberField.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/NumberField.tsx#L50)

#### Parameters

##### \_\_namedParameters

[`NumberFieldProps`](#numberfieldprops)

#### Returns

`Element`

***

### RecordField()

> **RecordField**(`__namedParameters`): `ReactNode`

Defined in: [components/field/RecordField.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RecordField.tsx#L44)

RecordField - Displays a field value from the current record

This is a stub component. Full implementation pending.

#### Parameters

##### \_\_namedParameters

[`RecordFieldProps`](#recordfieldprops)

#### Returns

`ReactNode`

#### Example

```tsx
<RecordField source="name" />
<RecordField source="createdAt" field={DateField} />
```

***

### ReferenceArrayField()

> **ReferenceArrayField**(`__namedParameters`): `Element`

Defined in: [components/field/ReferenceArrayField.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceArrayField.tsx#L58)

#### Parameters

##### \_\_namedParameters

[`ReferenceArrayFieldProps`](#referencearrayfieldprops)

#### Returns

`Element`

***

### ReferenceField()

> **ReferenceField**(`__namedParameters`): `Element`

Defined in: [components/field/ReferenceField.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceField.tsx#L64)

#### Parameters

##### \_\_namedParameters

[`ReferenceFieldProps`](#referencefieldprops)

#### Returns

`Element`

***

### ReferenceManyCount()

> **ReferenceManyCount**(`__namedParameters`): `Element`

Defined in: [components/field/ReferenceManyCount.tsx:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L65)

ReferenceManyCount - Displays the count of related records

Uses useGetManyReference to count records from the referenced resource
where the target field matches the source field value from the current record.

#### Parameters

##### \_\_namedParameters

[`ReferenceManyCountProps`](#referencemanycountprops)

#### Returns

`Element`

#### Example

```tsx
// Count comments for a post
<RecordContextProvider value={{ id: 1, title: 'My Post' }}>
  <ReferenceManyCount reference="comments" target="post_id" />
</RecordContextProvider>

// With filter
<ReferenceManyCount
  reference="comments"
  target="post_id"
  filter={{ status: 'published' }}
/>

// With link to related records
<ReferenceManyCount
  reference="comments"
  target="post_id"
  link
/>
```

***

### ReferenceManyField()

> **ReferenceManyField**(`__namedParameters`): `Element`

Defined in: [components/field/ReferenceManyField.tsx:86](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L86)

#### Parameters

##### \_\_namedParameters

[`ReferenceManyFieldProps`](#referencemanyfieldprops)

#### Returns

`Element`

***

### RichTextField()

> **RichTextField**(`__namedParameters`): `Element`

Defined in: [components/field/RichTextField.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RichTextField.tsx#L59)

#### Parameters

##### \_\_namedParameters

[`RichTextFieldProps`](#richtextfieldprops)

#### Returns

`Element`

***

### SelectField()

> **SelectField**(`__namedParameters`): `Element`

Defined in: [components/field/SelectField.tsx:95](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L95)

#### Parameters

##### \_\_namedParameters

[`SelectFieldProps`](#selectfieldprops)

#### Returns

`Element`

***

### SingleFieldList()

> **SingleFieldList**(`__namedParameters`): `Element` \| `null`

Defined in: [components/field/SingleFieldList.tsx:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SingleFieldList.tsx#L79)

SingleFieldList component renders a list of records as inline items.
Typically used with ArrayField or ReferenceArrayField to display array values.

#### Parameters

##### \_\_namedParameters

[`SingleFieldListProps`](#singlefieldlistprops)

#### Returns

`Element` \| `null`

#### Example

```tsx
// Basic usage with ArrayField
<ArrayField source="tags">
  <SingleFieldList>
    <ChipField source="name" />
  </SingleFieldList>
</ArrayField>

// With ReferenceArrayField
<ReferenceArrayField source="tagIds" reference="tags">
  <SingleFieldList>
    <ChipField source="name" />
  </SingleFieldList>
</ReferenceArrayField>

// Vertical layout
<ArrayField source="items">
  <SingleFieldList direction="vertical">
    <TextField source="title" />
  </SingleFieldList>
</ArrayField>

// With custom gap
<ArrayField source="tags">
  <SingleFieldList gap="gap-2">
    <ChipField source="name" variant="secondary" />
  </SingleFieldList>
</ArrayField>

// With empty state
<ArrayField source="tags">
  <SingleFieldList empty={<span>No tags</span>}>
    <ChipField source="name" />
  </SingleFieldList>
</ArrayField>
```

***

### TextField()

> **TextField**(`__namedParameters`): `Element`

Defined in: [components/field/TextField.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TextField.tsx#L49)

#### Parameters

##### \_\_namedParameters

[`TextFieldProps`](#textfieldprops)

#### Returns

`Element`

***

### useTranslatableFieldsContext()

> **useTranslatableFieldsContext**(): [`TranslatableFieldsContextValue`](#translatablefieldscontextvalue)

Defined in: [components/field/TranslatableFields.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L58)

Hook to access TranslatableFields context

#### Returns

[`TranslatableFieldsContextValue`](#translatablefieldscontextvalue)

***

### useOptionalTranslatableFieldsContext()

> **useOptionalTranslatableFieldsContext**(): [`TranslatableFieldsContextValue`](#translatablefieldscontextvalue) \| `undefined`

Defined in: [components/field/TranslatableFields.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L69)

Hook to optionally access TranslatableFields context

#### Returns

[`TranslatableFieldsContextValue`](#translatablefieldscontextvalue) \| `undefined`

***

### TranslatableFields()

> **TranslatableFields**(`__namedParameters`): `Element` \| `null`

Defined in: [components/field/TranslatableFields.tsx:157](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L157)

TranslatableFields - Wrapper for displaying fields with translation support

Renders field children with locale switching, allowing users to view
translated content in different languages.

#### Parameters

##### \_\_namedParameters

[`TranslatableFieldsProps`](#translatablefieldsprops)

#### Returns

`Element` \| `null`

#### Example

```tsx
// Basic usage - translations at record.title_en, record.title_fr
<TranslatableFields locales={['en', 'fr']}>
  <TextField source="title" />
  <TextField source="description" />
</TranslatableFields>

// With grouped translations - record.translations.en.title
<TranslatableFields locales={['en', 'fr']} groupKey="translations">
  <TextField source="title" />
  <TextField source="description" />
</TranslatableFields>

// With custom locale labels
<TranslatableFields
  locales={['en', 'fr', 'de']}
  localeLabels={{ en: 'English', fr: 'Francais', de: 'Deutsch' }}
>
  <TextField source="name" />
</TranslatableFields>

// With select dropdown instead of tabs
<TranslatableFields locales={['en', 'fr']} selector="select">
  <TextField source="title" />
</TranslatableFields>
```

***

### UrlField()

> **UrlField**(`__namedParameters`): `Element`

Defined in: [components/field/UrlField.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/UrlField.tsx#L62)

#### Parameters

##### \_\_namedParameters

[`UrlFieldProps`](#urlfieldprops)

#### Returns

`Element`

***

### useFormData()

> **useFormData**\<`T`\>(`options`): [`FormDataConsumerRenderProps`](#formdataconsumerrenderprops)\<`T`, `Path`\<`T`\> \| `undefined`\>

Defined in: [components/form/FormDataConsumer.tsx:298](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L298)

Hook for accessing form data reactively.

**This is the RECOMMENDED pattern** for accessing form data in shadmin.
It provides cleaner, more composable code compared to the render props pattern.

This hook must be used within a FormProvider context (e.g., inside SimpleForm).

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

The form data type extending FieldValues

#### Parameters

##### options

`UseFormDataOptions`\<`T`\> = `{}`

Optional configuration with source path for scoped data

#### Returns

[`FormDataConsumerRenderProps`](#formdataconsumerrenderprops)\<`T`, `Path`\<`T`\> \| `undefined`\>

Object containing form data, scoped data, and form methods

## Basic Usage

#### Examples

```tsx
// Access all form data
function MyComponent() {
  const { formData, setValue } = useFormData<MyFormType>()

  return (
    <button onClick={() => setValue('count', formData.count + 1)}>
      Count: {formData.count}
    </button>
  )
}
```

## Conditional Rendering

```tsx
// Show/hide fields based on form values
function PremiumFields() {
  const { formData } = useFormData<{ tier: string }>()

  if (formData.tier !== 'premium') return null

  return (
    <>
      <TextInput source="discountCode" />
      <NumberInput source="customLimit" />
    </>
  )
}
```

## Scoped Data Access

```tsx
// Access nested data with type safety
interface UserForm {
  user: { address: { city: string; zip: string } }
}

function AddressDisplay() {
  const { scopedFormData } = useFormData<UserForm>({ source: 'user.address' })

  return (
    <div>
      City: {scopedFormData?.city}, Zip: {scopedFormData?.zip}
    </div>
  )
}
```

## Validation and Form State

```tsx
// Access form state and trigger validation
function FormStatus() {
  const { formState, trigger } = useFormData()

  return (
    <div>
      <span>{formState.isDirty ? 'Modified' : 'Unchanged'}</span>
      <button type="button" onClick={() => trigger()}>
        Validate All
      </button>
    </div>
  )
}
```

## Computed Values

```tsx
// Create derived values from form data
function OrderTotal() {
  const { formData } = useFormData<{ items: { price: number; qty: number }[] }>()

  const total = useMemo(() =>
    formData.items?.reduce((sum, item) => sum + item.price * item.qty, 0) ?? 0,
    [formData.items]
  )

  return <div>Total: ${total.toFixed(2)}</div>
}
```

#### Throws

Error if used outside of a FormProvider context

***

### ~~FormDataConsumer()~~

> **FormDataConsumer**\<`T`, `TSource`\>(`__namedParameters`): `ReactNode`

Defined in: [components/form/FormDataConsumer.tsx:424](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L424)

FormDataConsumer component for accessing form data in render props pattern.

**DEPRECATION NOTICE**: This component uses the render props pattern which
creates deeper nesting and is harder to test. Consider migrating to the
`useFormData` hook for new code.

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

The form data type extending FieldValues

##### TSource

`TSource` *extends* `string` \| `undefined` = `undefined`

Optional source path type for scoped data access

## Why Migrate to useFormData?

| Aspect | FormDataConsumer | useFormData |
|--------|------------------|-------------|
| Nesting | Deep nesting with render props | Flat component structure |
| Testing | Hard to test inline functions | Easy to test components |
| Types | Complex generic inference | Cleaner type inference |
| Composition | Limited | Composes with other hooks |

## Migration Example

#### Parameters

##### \_\_namedParameters

[`FormDataConsumerProps`](#formdataconsumerprops)\<`T`, `TSource`\>

#### Returns

`ReactNode`

#### Deprecated

Prefer using `useFormData` hook instead. See module documentation
for migration examples. This component will continue to work but the hooks
pattern is the recommended approach.

#### Examples

```tsx
// Before (FormDataConsumer)
<FormDataConsumer>
  {({ formData }) => (
    formData.type === 'premium' && <TextInput source="code" />
  )}
</FormDataConsumer>

// After (useFormData hook)
function PremiumField() {
  const { formData } = useFormData<{ type: string }>()
  if (formData.type !== 'premium') return null
  return <TextInput source="code" />
}
```

## Legacy Usage Examples

These patterns still work but are not recommended for new code:

```tsx
// Conditional rendering based on form data
<FormDataConsumer>
  {({ formData }) => (
    formData.type === 'premium' && (
      <TextInput source="discountCode" />
    )
  )}
</FormDataConsumer>

// Programmatically update values
<FormDataConsumer>
  {({ formData, setValue }) => (
    <button
      type="button"
      onClick={() => setValue('quantity', (formData.quantity || 0) + 1)}
    >
      Increment ({formData.quantity})
    </button>
  )}
</FormDataConsumer>

// Scoped data access for nested objects
<FormDataConsumer source="address">
  {({ scopedFormData }) => (
    <div>Street: {scopedFormData?.street}</div>
  )}
</FormDataConsumer>
```

***

### generateTabName()

> **generateTabName**(`label`): `string`

Defined in: [components/form/FormTab.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L56)

Generate a slug from a label string

#### Parameters

##### label

`string`

#### Returns

`string`

***

### FormTab()

> **FormTab**(`__namedParameters`): `null`

Defined in: [components/form/FormTab.tsx:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L83)

FormTab - Individual tab panel component for TabbedForm

This component is used as a child of TabbedForm to define individual tabs.
It doesn't render anything on its own - TabbedForm extracts the props and
renders the appropriate UI.

#### Parameters

##### \_\_namedParameters

[`FormTabProps`](#formtabprops)

#### Returns

`null`

#### Example

```tsx
<TabbedForm>
  <FormTab label="General" name="general">
    <TextInput source="name" />
    <TextInput source="email" />
  </FormTab>
  <FormTab label="Details" name="details" icon={<InfoIcon />}>
    <TextInput source="description" />
  </FormTab>
</TabbedForm>
```

***

### FormTabPanel()

> **FormTabPanel**(`__namedParameters`): `Element`

Defined in: [components/form/FormTab.tsx:134](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L134)

FormTabPanel - Internal component for rendering tab panel content
Follows shadcn/ui TabsContent pattern for consistent styling

#### Parameters

##### \_\_namedParameters

[`FormTabPanelProps`](#formtabpanelprops)

#### Returns

`Element`

***

### SimpleForm()

> **SimpleForm**\<`T`\>(`__namedParameters`): `ReactElement`

Defined in: [components/form/SimpleForm.tsx:211](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L211)

SimpleForm component for rendering form inputs in a vertical stack.
Integrates with react-hook-form for state management and ShadCN components for UI.

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Parameters

##### \_\_namedParameters

[`SimpleFormProps`](#simpleformprops)\<`T`\>

#### Returns

`ReactElement`

#### Example

```tsx
// Basic usage
<SimpleForm onSubmit={handleSubmit} defaultValues={{ name: '' }}>
  <TextInput source="name" label="Name" />
</SimpleForm>

// With validation and custom toolbar
<SimpleForm
  onSubmit={handleSubmit}
  defaultValues={{ email: '' }}
  mode="onChange"
  toolbar={<Toolbar><SaveButton /><CancelButton /></Toolbar>}
>
  <TextInput source="email" rules={{ required: 'Email is required' }} />
</SimpleForm>

// With unsaved changes warning
<SimpleForm
  onSubmit={handleSubmit}
  warnWhenUnsavedChanges
>
  <TextInput source="title" />
</SimpleForm>
```

***

### SimpleFormConfigurable()

> **SimpleFormConfigurable**\<`T`\>(`__namedParameters`): `ReactElement`

Defined in: [components/form/SimpleFormConfigurable.tsx:270](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L270)

SimpleFormConfigurable - A form with configurable field visibility

This component extends SimpleForm with the ability to:
- Hide specific fields via the `omit` prop
- Allow users to toggle field visibility via a configuration panel
- Persist user preferences via localStorage using `preferenceKey`

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Parameters

##### \_\_namedParameters

[`SimpleFormConfigurableProps`](#simpleformconfigurableprops)\<`T`\>

#### Returns

`ReactElement`

#### Example

```tsx
// Basic usage with omit
<SimpleFormConfigurable omit={['internalField', 'hiddenField']}>
  <TextInput source="name" />
  <TextInput source="email" />
  <TextInput source="internalField" /> {/* This will be hidden */}
</SimpleFormConfigurable>

// With preference persistence
<SimpleFormConfigurable preferenceKey="user-form-config">
  <TextInput source="name" />
  <TextInput source="email" />
  <TextInput source="phone" />
</SimpleFormConfigurable>

// Without configuration UI (only omit)
<SimpleFormConfigurable omit={['secret']} configurable={false}>
  <TextInput source="name" />
  <TextInput source="secret" />
</SimpleFormConfigurable>
```

***

### useTabbedFormContext()

> **useTabbedFormContext**(): [`TabbedFormContextValue`](#tabbedformcontextvalue)

Defined in: [components/form/TabbedForm.tsx:108](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L108)

Hook to access TabbedForm context.
Must be used within a TabbedForm component.

#### Returns

[`TabbedFormContextValue`](#tabbedformcontextvalue)

#### Throws

When used outside of a TabbedForm

#### Example

```tsx
function TabStatusIndicator() {
  const { activeTab, getErrorTabs } = useTabbedFormContext()
  const errorTabs = getErrorTabs()
  return <div>Active: {activeTab}, Errors in: {errorTabs.join(', ')}</div>
}
```

***

### useOptionalTabbedFormContext()

> **useOptionalTabbedFormContext**(): [`TabbedFormContextValue`](#tabbedformcontextvalue) \| `undefined`

Defined in: [components/form/TabbedForm.tsx:121](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L121)

Hook to optionally access TabbedForm context.
Returns undefined when used outside of a TabbedForm (doesn't throw).
Useful for components that may or may not be within a TabbedForm.

#### Returns

[`TabbedFormContextValue`](#tabbedformcontextvalue) \| `undefined`

***

### TabbedForm()

> **TabbedForm**\<`TData`, `TResult`\>(`__namedParameters`): `Element`

Defined in: [components/form/TabbedForm.tsx:397](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L397)

TabbedForm - Organizes form inputs into accessible tabs

Features:
- Keyboard navigation (Arrow keys, Home, End)
- URL synchronization for deep-linking
- Per-tab error indicators with counts
- Per-tab dirty state tracking
- Auto-navigation to first tab with errors

#### Type Parameters

##### TData

`TData` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

##### TResult

`TResult` = `unknown`

#### Parameters

##### \_\_namedParameters

[`TabbedFormProps`](#tabbedformprops)\<`TData`, `TResult`\>

#### Returns

`Element`

#### Examples

```tsx
<TabbedForm>
  <FormTab label="General">
    <TextInput source="name" />
    <TextInput source="email" />
  </FormTab>
  <FormTab label="Details">
    <TextInput source="description" />
  </FormTab>
</TabbedForm>
```

```tsx
<TabbedForm syncWithLocation>
  <FormTab label="Profile" name="profile">
    <TextInput source="name" />
  </FormTab>
  <FormTab label="Security" name="security" path="security">
    <TextInput source="password" />
  </FormTab>
</TabbedForm>
// URL changes: /users/1 -> /users/1/security
```

***

### Toolbar()

> **Toolbar**(`__namedParameters`): `ReactElement`

Defined in: [components/form/Toolbar.tsx:93](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L93)

Toolbar component for form action buttons.
Renders children or a default SaveButton if no children provided.

#### Parameters

##### \_\_namedParameters

[`ToolbarProps`](#toolbarprops)

#### Returns

`ReactElement`

#### Example

```tsx
// Default toolbar with save button
<SimpleForm onSubmit={handleSubmit}>
  <TextInput source="name" />
  <Toolbar />
</SimpleForm>

// Custom toolbar
<SimpleForm onSubmit={handleSubmit}>
  <TextInput source="name" />
  <Toolbar>
    <SaveButton label="Submit" />
    <DeleteButton onDelete={handleDelete} />
  </Toolbar>
</SimpleForm>
```

***

### TopToolbar()

> **TopToolbar**(`__namedParameters`): `ReactElement`

Defined in: [components/form/Toolbar.tsx:392](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L392)

TopToolbar - Toolbar component for the top of list/show/edit pages.
Used for action buttons like Create, Export, etc.

#### Parameters

##### \_\_namedParameters

[`TopToolbarProps`](#toptoolbarprops)

#### Returns

`ReactElement`

#### Example

```tsx
// In a List component
<List
  actions={
    <TopToolbar>
      <CreateButton />
      <ExportButton />
    </TopToolbar>
  }
>
  <Datagrid>...</Datagrid>
</List>

// In a Show component
<Show
  actions={
    <TopToolbar>
      <EditButton />
    </TopToolbar>
  }
>
  <SimpleShowLayout>...</SimpleShowLayout>
</Show>
```

***

### Translate()

> **Translate**(`__namedParameters`): `ReactNode`

Defined in: [components/i18n/Translate.tsx:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/Translate.tsx#L61)

Translate component for declarative translations

#### Parameters

##### \_\_namedParameters

[`TranslateProps`](#translateprops)

#### Returns

`ReactNode`

#### Example

```tsx
// Simple translation
<Translate i18nKey="hello" />

// With default value
<Translate i18nKey="greeting" defaultValue="Hello there!" />

// With interpolation
<Translate
  i18nKey="welcome"
  values={{ name: 'John' }}
/>

// With pluralization
<Translate
  i18nKey="items.count"
  count={5}
/>

// With custom wrapper element
<Translate i18nKey="title" as="h1" className="text-2xl font-bold" />

// With render function
<Translate i18nKey="description">
  {(text) => <p className="text-muted-foreground">{text}</p>}
</Translate>
```

***

### formatDate()

> **formatDate**(`date`, `locale`, `options`): `string`

Defined in: [components/i18n/formatting.ts:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L54)

Format a date according to the locale

#### Parameters

##### date

`string` | `number` | `Date`

##### locale

`string` = `'en'`

##### options

[`DateFormatOptions`](#dateformatoptions) = `{}`

#### Returns

`string`

#### Example

```ts
formatDate(new Date(), 'en-US')
// "1/15/2024"

formatDate(new Date(), 'de-DE', { dateStyle: 'full' })
// "Montag, 15. Januar 2024"
```

***

### formatDateTime()

> **formatDateTime**(`date`, `locale`, `options`): `string`

Defined in: [components/i18n/formatting.ts:87](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L87)

Format a date with time according to the locale

#### Parameters

##### date

`string` | `number` | `Date`

##### locale

`string` = `'en'`

##### options

[`DateFormatOptions`](#dateformatoptions) = `{}`

#### Returns

`string`

#### Example

```ts
formatDateTime(new Date(), 'en-US')
// "1/15/2024, 3:30 PM"

formatDateTime(new Date(), 'fr-FR')
// "15/01/2024 15:30"
```

***

### formatTime()

> **formatTime**(`date`, `locale`, `options`): `string`

Defined in: [components/i18n/formatting.ts:111](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L111)

Format a time according to the locale

#### Parameters

##### date

`string` | `number` | `Date`

##### locale

`string` = `'en'`

##### options

[`DateFormatOptions`](#dateformatoptions) = `{}`

#### Returns

`string`

#### Example

```ts
formatTime(new Date(), 'en-US')
// "3:30 PM"

formatTime(new Date(), 'de-DE')
// "15:30"
```

***

### formatNumber()

> **formatNumber**(`value`, `locale`, `options`): `string`

Defined in: [components/i18n/formatting.ts:137](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L137)

Format a number according to the locale

#### Parameters

##### value

`number`

##### locale

`string` = `'en'`

##### options

[`NumberFormatOptions`](#numberformatoptions) = `{}`

#### Returns

`string`

#### Example

```ts
formatNumber(1234567.89, 'en-US')
// "1,234,567.89"

formatNumber(1234567.89, 'de-DE')
// "1.234.567,89"

formatNumber(0.75, 'en-US', { style: 'percent' })
// "75%"
```

***

### formatCurrency()

> **formatCurrency**(`value`, `locale`, `options`): `string`

Defined in: [components/i18n/formatting.ts:171](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L171)

Format a currency value according to the locale

#### Parameters

##### value

`number`

##### locale

`string` = `'en'`

##### options

[`CurrencyFormatOptions`](#currencyformatoptions) = `{}`

#### Returns

`string`

#### Example

```ts
formatCurrency(1234.56, 'en-US', { currency: 'USD' })
// "$1,234.56"

formatCurrency(1234.56, 'de-DE', { currency: 'EUR' })
// "1.234,56 EUR"

formatCurrency(1234.56, 'ja-JP', { currency: 'JPY' })
// "JPY 1,235"
```

***

### formatPercent()

> **formatPercent**(`value`, `locale`, `options`): `string`

Defined in: [components/i18n/formatting.ts:197](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L197)

Format a percentage according to the locale

#### Parameters

##### value

`number`

##### locale

`string` = `'en'`

##### options

[`NumberFormatOptions`](#numberformatoptions) = `{}`

#### Returns

`string`

#### Example

```ts
formatPercent(0.75, 'en-US')
// "75%"

formatPercent(0.1234, 'de-DE', { maximumFractionDigits: 2 })
// "12,34 %"
```

***

### formatRelativeTime()

> **formatRelativeTime**(`date`, `locale`, `options`): `string`

Defined in: [components/i18n/formatting.ts:237](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L237)

Format a relative time (e.g., "2 days ago", "in 3 hours")

#### Parameters

##### date

`string` | `number` | `Date`

##### locale

`string` = `'en'`

##### options

[`RelativeTimeFormatOptions`](#relativetimeformatoptions) = `{}`

#### Returns

`string`

#### Example

```ts
const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
formatRelativeTime(pastDate, 'en-US')
// "2 days ago"

const futureDate = new Date(Date.now() + 3 * 60 * 60 * 1000)
formatRelativeTime(futureDate, 'de-DE')
// "in 3 Stunden"
```

***

### formatList()

> **formatList**(`items`, `locale`, `options`): `string`

Defined in: [components/i18n/formatting.ts:285](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L285)

Format a list according to the locale

#### Parameters

##### items

`string`[]

##### locale

`string` = `'en'`

##### options

`ListFormatOptions` = `{}`

#### Returns

`string`

#### Example

```ts
formatList(['Apple', 'Banana', 'Orange'], 'en-US')
// "Apple, Banana, and Orange"

formatList(['Apple', 'Banana', 'Orange'], 'de-DE')
// "Apple, Banana und Orange"
```

***

### getLocaleDisplayName()

> **getLocaleDisplayName**(`localeCode`, `displayLocale`): `string`

Defined in: [components/i18n/formatting.ts:321](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L321)

Get the display name of a locale in its own language

#### Parameters

##### localeCode

`string`

##### displayLocale

`string` = `localeCode`

#### Returns

`string`

#### Example

```ts
getLocaleDisplayName('en')
// "English"

getLocaleDisplayName('de', 'de')
// "Deutsch"

getLocaleDisplayName('ja', 'ja')
// "Japanese"
```

***

### useFormatters()

> **useFormatters**(): [`UseFormattersResult`](#useformattersresult)

Defined in: [components/i18n/useFormatters.ts:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L71)

Hook that returns locale-aware formatting functions

All formatters use the current locale from TranslationContext,
but can be overridden per-call via options.

#### Returns

[`UseFormattersResult`](#useformattersresult)

#### Example

```tsx
function MyComponent() {
  const format = useFormatters()

  return (
    <div>
      <p>Date: {format.date(new Date())}</p>
      <p>Price: {format.currency(1234.56, { currency: 'EUR' })}</p>
      <p>Updated: {format.relativeTime(lastUpdated)}</p>
      <p>Count: {format.number(1000000)}</p>
    </div>
  )
}
```

***

### useArrayInputContext()

> **useArrayInputContext**(): [`ArrayInputContextValue`](#arrayinputcontextvalue)

Defined in: [components/input/ArrayInput.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L53)

Hook to access ArrayInput context

#### Returns

[`ArrayInputContextValue`](#arrayinputcontextvalue)

***

### ReferenceArrayInput()

> **ReferenceArrayInput**(`__namedParameters`): `Element`

Defined in: [components/input/ReferenceArrayInput.tsx:104](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceArrayInput.tsx#L104)

ReferenceArrayInput component that fetches choices from a referenced resource
and passes them to child multi-select components.

#### Parameters

##### \_\_namedParameters

[`ReferenceArrayInputProps`](#referencearrayinputprops)

#### Returns

`Element`

#### Example

```tsx
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

// With custom perPage
<ReferenceArrayInput source="tag_ids" reference="tags" perPage={100}>
  <SelectArrayInput source="tag_ids" choices={[]} />
</ReferenceArrayInput>
```

***

### ReferenceInput()

> **ReferenceInput**(`__namedParameters`): `Element`

Defined in: [components/input/ReferenceInput.tsx:163](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L163)

ReferenceInput component
Fetches choices from a referenced resource using useGetList and provides them to child inputs

#### Parameters

##### \_\_namedParameters

[`ReferenceInputProps`](#referenceinputprops)

#### Returns

`Element`

#### Example

```tsx
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
```

***

### SimpleFormIterator()

> **SimpleFormIterator**(`__namedParameters`): `Element`

Defined in: [components/input/SimpleFormIterator.tsx:190](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SimpleFormIterator.tsx#L190)

SimpleFormIterator component renders the items of an array field.
It must be used within an ArrayInput component.

#### Parameters

##### \_\_namedParameters

[`SimpleFormIteratorProps`](#simpleformiteratorprops)

#### Returns

`Element`

#### Example

```tsx
<ArrayInput source="items">
  <SimpleFormIterator>
    <TextInput source="name" />
  </SimpleFormIterator>
</ArrayInput>
```

***

### useTranslatableInputsContext()

> **useTranslatableInputsContext**(): [`TranslatableInputsContextValue`](#translatableinputscontextvalue)

Defined in: [components/input/TranslatableInputs.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L60)

Hook to access TranslatableInputs context

#### Returns

[`TranslatableInputsContextValue`](#translatableinputscontextvalue)

***

### useOptionalTranslatableInputsContext()

> **useOptionalTranslatableInputsContext**(): [`TranslatableInputsContextValue`](#translatableinputscontextvalue) \| `undefined`

Defined in: [components/input/TranslatableInputs.tsx:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L71)

Hook to optionally access TranslatableInputs context

#### Returns

[`TranslatableInputsContextValue`](#translatableinputscontextvalue) \| `undefined`

***

### TranslatableInputs()

> **TranslatableInputs**(`__namedParameters`): `Element`

Defined in: [components/input/TranslatableInputs.tsx:162](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L162)

TranslatableInputs - Wrapper for form inputs with translation support

Renders input children with locale switching, allowing users to enter
translated content in different languages. The source field names are
automatically transformed based on the selected locale.

#### Parameters

##### \_\_namedParameters

[`TranslatableInputsProps`](#translatableinputsprops)

#### Returns

`Element`

#### Example

```tsx
// Basic usage - creates fields like title_en, title_fr
<TranslatableInputs locales={['en', 'fr']}>
  <TextInput source="title" />
  <TextInput source="description" />
</TranslatableInputs>

// With nested pattern - creates fields like en.title, fr.title
<TranslatableInputs locales={['en', 'fr']} pattern="nested">
  <TextInput source="title" />
  <TextInput source="description" />
</TranslatableInputs>

// With custom locale labels
<TranslatableInputs
  locales={['en', 'fr', 'de']}
  localeLabels={{ en: 'English', fr: 'Francais', de: 'Deutsch' }}
>
  <TextInput source="name" />
</TranslatableInputs>

// With select dropdown instead of tabs
<TranslatableInputs locales={['en', 'fr']} selector="select">
  <TextInput source="title" />
</TranslatableInputs>
```

***

### isRecord()

> **isRecord**(`value`): `value is Record<string, unknown>`

Defined in: [components/input/types.ts:187](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L187)

Type guard to check if an object is a valid record (non-null object).

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is Record<string, unknown>`

True if value is a non-null object

#### Example

```tsx
if (isRecord(choice)) {
  // choice is Record<string, unknown>
}
```

***

### isIdNameChoice()

> **isIdNameChoice**(`choice`): `choice is IdNameChoice`

Defined in: [components/input/types.ts:205](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L205)

Type guard to check if a choice has the id/name pattern.

#### Parameters

##### choice

`unknown`

The choice object to check

#### Returns

`choice is IdNameChoice`

True if choice has id and name properties with valid types

#### Example

```tsx
const choice = { id: '1', name: 'Option 1' }
if (isIdNameChoice(choice)) {
  // choice.id is ChoiceValue, choice.name is string
}
```

***

### isValueLabelChoice()

> **isValueLabelChoice**(`choice`): `choice is ValueLabelChoice`

Defined in: [components/input/types.ts:228](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L228)

Type guard to check if a choice has the value/label pattern.

#### Parameters

##### choice

`unknown`

The choice object to check

#### Returns

`choice is ValueLabelChoice`

True if choice has value and label properties with valid types

#### Example

```tsx
const choice = { value: 'us', label: 'United States' }
if (isValueLabelChoice(choice)) {
  // choice.value is ChoiceValue, choice.label is string
}
```

***

### isBaseSelectChoice()

> **isBaseSelectChoice**(`choice`): `choice is BaseSelectChoice`

Defined in: [components/input/types.ts:249](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L249)

Type guard to check if a choice is a valid BaseSelectChoice (either pattern).

#### Parameters

##### choice

`unknown`

The choice object to check

#### Returns

`choice is BaseSelectChoice`

True if choice is valid IdNameChoice or ValueLabelChoice

#### Example

```tsx
const choices = [{ id: '1', name: 'A' }, { value: '2', label: 'B' }]
const validChoices = choices.filter(isBaseSelectChoice)
```

***

### isChoiceValue()

> **isChoiceValue**(`value`): `value is ChoiceValue`

Defined in: [components/input/types.ts:266](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L266)

Type guard to check if a value is a valid ChoiceValue (string or number).

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is ChoiceValue`

True if value is a string or number

#### Example

```tsx
if (isChoiceValue(choice.id)) {
  // choice.id is ChoiceValue
}
```

***

### validateChoices()

> **validateChoices**\<`T`\>(`choices`, `optionValue`, `optionText`): `T`[]

Defined in: [components/input/types.ts:286](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L286)

Validates an array of choices, returning only valid ones.
Useful for runtime validation of choice arrays from external sources.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### choices

`unknown`[]

Array of potential choices

##### optionValue

`string` = `'id'`

The property name used for the value (default: 'id')

##### optionText

`string` = `'name'`

The property name used for the text (default: 'name')

#### Returns

`T`[]

Array of valid choices

#### Example

```tsx
const apiData = await fetchChoices()
const validChoices = validateChoices(apiData)
// validChoices only contains objects with valid id/name or value/label
```

***

### getChoiceValue()

> **getChoiceValue**(`choice`, `optionValue`): [`ChoiceValue`](#choicevalue) \| `undefined`

Defined in: [components/input/types.ts:315](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L315)

Gets the value from a choice using the specified key.
Returns undefined if the key doesn't exist or the value isn't valid.

#### Parameters

##### choice

`Record`\<`string`, `unknown`\>

The choice object

##### optionValue

`string` = `'id'`

The property name to use for the value (default: 'id')

#### Returns

[`ChoiceValue`](#choicevalue) \| `undefined`

The choice value or undefined

#### Example

```tsx
const value = getChoiceValue(choice, 'id')
if (value !== undefined) {
  // value is ChoiceValue (string | number)
}
```

***

### getChoiceText()

> **getChoiceText**(`choice`, `optionText`): `string`

Defined in: [components/input/types.ts:336](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L336)

Gets the display text from a choice using the specified key or function.

#### Parameters

##### choice

`Record`\<`string`, `unknown`\>

The choice object

##### optionText

Property name or function to get the text (default: 'name')

`string` | (`choice`) => `string`

#### Returns

`string`

The display text

#### Example

```tsx
const text = getChoiceText(choice, 'name')
const customText = getChoiceText(choice, (c) => `${c.firstName} ${c.lastName}`)
```

***

### AppBar()

> **AppBar**(`__namedParameters`): `Element`

Defined in: [components/layout/AppBar.tsx:311](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L311)

AppBar component
Provides the top navigation bar for admin layouts

#### Parameters

##### \_\_namedParameters

[`AppBarProps`](#appbarprops)

#### Returns

`Element`

#### Example

```tsx
<AppBar title="Dashboard" showSidebarTrigger>
  <button>Action</button>
</AppBar>

// With user menu
<AppBar
  title="My Admin"
  user={{ name: 'John Doe', avatar: '/avatar.png' }}
/>

// With custom content
<AppBar
  leftContent={<Breadcrumbs />}
  rightContent={<Notifications />}
/>
```

***

### ContainerLayout()

> **ContainerLayout**(`__namedParameters`): `Element`

Defined in: [components/layout/ContainerLayout.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/ContainerLayout.tsx#L64)

ContainerLayout - A container-based layout with horizontal navigation

Unlike the sidebar-based Layout, ContainerLayout uses a traditional
top navigation bar with horizontal menu items, similar to many
marketing sites and simpler admin panels.

#### Parameters

##### \_\_namedParameters

`ContainerLayoutProps`

#### Returns

`Element`

#### Example

```tsx
<ContainerLayout
  title="My App"
  menuItems={[
    { name: 'dashboard', label: 'Dashboard', path: '/' },
    { name: 'posts', label: 'Posts', path: '/posts' },
  ]}
>
  <Outlet />
</ContainerLayout>
```

***

### useSidebar()

> **useSidebar**(): [`SidebarContextValue`](#sidebarcontextvalue)

Defined in: [components/layout/Layout.tsx:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L81)

#### Returns

[`SidebarContextValue`](#sidebarcontextvalue)

***

### SidebarProvider()

> **SidebarProvider**(`__namedParameters`): `Element`

Defined in: [components/layout/Layout.tsx:100](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L100)

#### Parameters

##### \_\_namedParameters

`SidebarProviderProps`

#### Returns

`Element`

***

### SidebarTrigger()

> **SidebarTrigger**(`__namedParameters`): `Element`

Defined in: [components/layout/Layout.tsx:160](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L160)

#### Parameters

##### \_\_namedParameters

`SidebarTriggerProps`

#### Returns

`Element`

***

### Layout()

> **Layout**(`__namedParameters`): `Element`

Defined in: [components/layout/Layout.tsx:513](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L513)

Layout component
Provides the main admin panel structure with sidebar, appbar, and content area

#### Parameters

##### \_\_namedParameters

[`LayoutProps`](#layoutprops)

#### Returns

`Element`

#### Example

```tsx
<Layout title="My Admin" theme="dark">
  <Dashboard />
</Layout>

// With custom components
<Layout
  sidebar={<MySidebar />}
  appBar={<MyAppBar />}
  menu={MyMenu}
>
  <Content />
</Layout>
```

***

### Sidebar()

> **Sidebar**(`__namedParameters`): `Element`

Defined in: [components/layout/Sidebar.tsx:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L85)

Sidebar - Navigation sidebar component

#### Parameters

##### \_\_namedParameters

[`SidebarProps`](#sidebarprops)

#### Returns

`Element`

#### Example

```tsx
<Sidebar title="Admin Panel">
  <Menu>
    <MenuItem to="/dashboard" label="Dashboard" icon={HomeIcon} />
    <MenuItem to="/users" label="Users" icon={UsersIcon} />
  </Menu>
</Sidebar>

// With custom header
<Sidebar
  header={<Logo />}
  footer={<UserProfile />}
>
  <Navigation />
</Sidebar>
```

***

### useTitleContext()

> **useTitleContext**(): [`TitleContextValue`](#titlecontextvalue) \| `undefined`

Defined in: [components/layout/Title.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L37)

Hook to access the title context

#### Returns

[`TitleContextValue`](#titlecontextvalue) \| `undefined`

***

### TitleContextProvider()

> **TitleContextProvider**(`__namedParameters`): `Element`

Defined in: [components/layout/Title.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L52)

Provider for title context

#### Parameters

##### \_\_namedParameters

[`TitleContextProviderProps`](#titlecontextproviderprops)

#### Returns

`Element`

***

### Title()

> **Title**(`__namedParameters`): `Element` \| `null`

Defined in: [components/layout/Title.tsx:119](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L119)

Title - Sets the page title

This component updates both the displayed title (via TitlePortal) and
optionally the document title.

#### Parameters

##### \_\_namedParameters

[`TitleProps`](#titleprops)

#### Returns

`Element` \| `null`

#### Example

```tsx
// Basic usage
<Title title="Posts List" />

// With default title
<Title defaultTitle="Posts" />

// Dynamic title
<Title title={<span>Editing {record.name}</span>} />
```

***

### TitlePortal()

> **TitlePortal**(`__namedParameters`): `Element` \| `null`

Defined in: [components/layout/Title.tsx:194](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L194)

TitlePortal - Renders the current title from context

Place this component where you want the title to appear in your layout.
It will render whatever title is set via the Title component.

#### Parameters

##### \_\_namedParameters

[`TitlePortalProps`](#titleportalprops)

#### Returns

`Element` \| `null`

#### Example

```tsx
// In your layout
<header>
  <TitlePortal />
</header>

// In a page
<Title title="Dashboard" />
```

***

### DataTable()

> **DataTable**\<`T`\>(`props`): `Element`

Defined in: [components/list/DataTable.tsx:100](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L100)

DataTable component - an advanced data grid wrapper

This is currently a simple stub that wraps the Datagrid component.
It provides the same API as Datagrid and can be enhanced later with
additional features such as:
- Column resizing
- Column reordering
- Advanced filtering
- Column pinning
- Row grouping
- Virtual scrolling for large datasets

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### props

[`DataTableProps`](#datatableprops)\<`T`\>

#### Returns

`Element`

#### Examples

```tsx
<DataTable>
  <TextField source="name" />
  <TextField source="email" />
  <DateField source="createdAt" />
</DataTable>
```

```tsx
// With row click and selection
<DataTable
  rowClick="edit"
  bulkActionButtons={true}
>
  <TextField source="name" />
  <TextField source="email" />
</DataTable>
```

***

### Datagrid()

> **Datagrid**\<`T`\>(`__namedParameters`): `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element` \| `null` \| `undefined`

Defined in: [components/list/Datagrid.tsx:152](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L152)

Datagrid component for displaying tabular data

Compatible with react-admin Datagrid API. Uses TanStack Table v8 for
table logic and renders with ShadCN-style components.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### \_\_namedParameters

[`DatagridProps`](#datagridprops)\<`T`\>

#### Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element` \| `null` \| `undefined`

#### Examples

```tsx
<Datagrid>
  <TextField source="name" />
  <TextField source="email" />
  <DateField source="createdAt" />
</Datagrid>
```

```tsx
// With row click and selection
<Datagrid
  rowClick="edit"
  bulkActionButtons={true}
>
  <TextField source="name" />
  <TextField source="email" />
</Datagrid>
```

***

### DatagridBody()

> **DatagridBody**\<`T`\>(`__namedParameters`): `Element`

Defined in: [components/list/DatagridBody.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L49)

DatagridBody renders the table body with data rows

This component is used internally by Datagrid but can be used
separately for custom table implementations.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### \_\_namedParameters

[`DatagridBodyProps`](#datagridbodyprops)\<`T`\>

#### Returns

`Element`

#### Example

```tsx
<DatagridBody
  rows={table.getRowModel().rows}
  isEmpty={data.length === 0}
  columnCount={columns.length}
  flexRender={flexRender}
/>
```

***

### DatagridHeader()

> **DatagridHeader**\<`T`\>(`__namedParameters`): `Element`

Defined in: [components/list/DatagridHeader.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridHeader.tsx#L36)

DatagridHeader renders the table header row(s)

This component is used internally by Datagrid but can be used
separately for custom table implementations.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### \_\_namedParameters

[`DatagridHeaderProps`](#datagridheaderprops)\<`T`\>

#### Returns

`Element`

#### Example

```tsx
<DatagridHeader
  headerGroups={table.getHeaderGroups()}
  sort={sort}
  onSortChange={handleSortChange}
/>
```

***

### DatagridRow()

> **DatagridRow**\<`T`\>(`__namedParameters`): `Element`

Defined in: [components/list/DatagridRow.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L50)

DatagridRow renders a single table row

This component is used internally by Datagrid and DatagridBody but can be
used separately for custom table implementations or row customization.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### \_\_namedParameters

[`DatagridRowProps`](#datagridrowprops)\<`T`\>

#### Returns

`Element`

#### Example

```tsx
<DatagridRow
  row={row}
  rowIndex={index}
  flexRender={flexRender}
  hover
  isClickable
  onClick={handleRowClick}
/>
```

***

### SimpleDatagridRow()

> **SimpleDatagridRow**\<`T`\>(`__namedParameters`): `Element`

Defined in: [components/list/DatagridRow.tsx:141](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L141)

SimpleDatagridRow renders a table row without TanStack Table dependency

Useful for simpler use cases or custom implementations that don't need
the full TanStack Table functionality.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### \_\_namedParameters

[`SimpleDatagridRowProps`](#simpledatagridrowprops)\<`T`\>

#### Returns

`Element`

#### Example

```tsx
<SimpleDatagridRow record={record} rowIndex={0}>
  <td><TextField source="name" /></td>
  <td><TextField source="email" /></td>
</SimpleDatagridRow>
```

***

### InfiniteListView()

> **InfiniteListView**(`__namedParameters`): `Element`

Defined in: [components/list/InfiniteList.tsx:262](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L262)

InfiniteListView - UI wrapper for infinite list display

#### Parameters

##### \_\_namedParameters

[`InfiniteListViewProps`](#infinitelistviewprops)

#### Returns

`Element`

***

### InfiniteList()

> **InfiniteList**\<`RecordType`\>(`__namedParameters`): `Element`

Defined in: [components/list/InfiniteList.tsx:391](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L391)

InfiniteList - Complete infinite scroll list component

Similar to List but uses infinite scroll instead of pagination.
Data is automatically loaded as the user scrolls down.

#### Type Parameters

##### RecordType

`RecordType` *extends* `object` = \{ `id`: `Identifier`; \}

#### Parameters

##### \_\_namedParameters

[`InfiniteListProps`](#infinitelistprops)\<`RecordType`\>

#### Returns

`Element`

#### Example

```tsx
// Basic usage
<InfiniteList resource="posts">
  <Datagrid>
    <TextField source="title" />
    <DateField source="createdAt" />
  </Datagrid>
</InfiniteList>

// With all options
<InfiniteList
  resource="posts"
  title="All Posts"
  perPage={25}
  sort={{ field: 'createdAt', order: 'DESC' }}
  filter={{ published: true }}
  actions={<CreateButton />}
>
  <Datagrid>
    <TextField source="title" />
  </Datagrid>
</InfiniteList>
```

***

### List()

> **List**\<`RecordType`\>(`__namedParameters`): `Element`

Defined in: [components/list/List.tsx:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L79)

List - Complete list component with data fetching and UI

The List component combines ListBase (data fetching, pagination, sorting, filtering)
with ListView (Card container, header, empty state) to provide a complete list solution.

#### Type Parameters

##### RecordType

`RecordType` *extends* `object` = \{ `id`: `Identifier`; \}

#### Parameters

##### \_\_namedParameters

[`ListProps`](#listprops)\<`RecordType`\>

#### Returns

`Element`

#### Example

```tsx
// Basic usage
<List resource="posts">
  <Datagrid>
    <TextField source="title" />
    <DateField source="createdAt" />
  </Datagrid>
</List>

// With all options
<List
  resource="posts"
  title="All Posts"
  perPage={25}
  sort={{ field: 'createdAt', order: 'DESC' }}
  filter={{ published: true }}
  filterDefaultValues={{ status: 'active' }}
  actions={<CreateButton />}
  filters={<PostFilters />}
  empty={<Empty />}
>
  <Datagrid>
    <TextField source="title" />
    <DateField source="createdAt" />
  </Datagrid>
</List>
```

***

### ListActions()

> **ListActions**(`__namedParameters`): `ReactElement`

Defined in: [components/list/ListActions.tsx:78](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListActions.tsx#L78)

ListActions - Toolbar wrapper for list action buttons.
Used to group action buttons like CreateButton, ExportButton, etc.

#### Parameters

##### \_\_namedParameters

[`ListActionsProps`](#listactionsprops)

#### Returns

`ReactElement`

#### Example

```tsx
// Basic usage with CreateButton
<List
  actions={
    <ListActions>
      <CreateButton />
    </ListActions>
  }
>
  <Datagrid>...</Datagrid>
</List>

// Multiple action buttons
<List
  actions={
    <ListActions>
      <CreateButton />
      <ExportButton />
    </ListActions>
  }
>
  <Datagrid>...</Datagrid>
</List>

// Custom buttons
<ListActions>
  <CreateButton label="Add Post" />
  <Button variant="outline" onClick={handleImport}>
    Import
  </Button>
</ListActions>
```

***

### ListToolbar()

> **ListToolbar**(`__namedParameters`): `ReactElement`

Defined in: [components/list/ListToolbar.tsx:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListToolbar.tsx#L77)

ListToolbar - Contains filters and actions for a list view.
Provides a structured layout with filters on the left and actions on the right.

#### Parameters

##### \_\_namedParameters

[`ListToolbarProps`](#listtoolbarprops)

#### Returns

`ReactElement`

#### Example

```tsx
// Basic usage with filters and actions
<ListToolbar
  filters={<SearchFilter />}
  actions={
    <ListActions>
      <CreateButton />
    </ListActions>
  }
/>

// With multiple filters
<ListToolbar
  filters={
    <>
      <SearchFilter />
      <StatusFilter />
    </>
  }
  actions={
    <ListActions>
      <CreateButton />
      <ExportButton />
    </ListActions>
  }
/>

// Using children for custom content
<ListToolbar
  filters={<SearchFilter />}
  actions={<ListActions><CreateButton /></ListActions>}
>
  <Badge>100 records</Badge>
</ListToolbar>
```

***

### ListView()

> **ListView**(`__namedParameters`): `Element`

Defined in: [components/list/ListView.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListView.tsx#L64)

ListView - UI wrapper component for list display

This component expects to be used inside a ListContextProvider.
It provides the visual structure (Card container) for displaying list data.

#### Parameters

##### \_\_namedParameters

[`ListViewProps`](#listviewprops)

#### Returns

`Element`

#### Example

```tsx
// Basic usage (inside ListBase or List)
<ListContextProvider value={listContext}>
  <ListView title="Posts">
    <Datagrid>
      <TextField source="title" />
      <DateField source="createdAt" />
    </Datagrid>
  </ListView>
</ListContextProvider>

// With actions and filters
<ListView
  title="Posts"
  actions={<CreateButton />}
  filters={<PostFilters />}
>
  <Datagrid>...</Datagrid>
</ListView>
```

***

### SimpleList()

> **SimpleList**\<`RecordType`\>(`__namedParameters`): `Element`

Defined in: [components/list/SimpleList.tsx:96](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L96)

SimpleList - A mobile-friendly list component

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### \_\_namedParameters

[`SimpleListProps`](#simplelistprops)\<`RecordType`\>

#### Returns

`Element`

#### Example

```tsx
<SimpleList
  primaryText={(record) => record.name}
  secondaryText={(record) => record.email}
  tertiaryText={(record) => new Date(record.createdAt).toLocaleDateString()}
  leftIcon={(record) => <Avatar src={record.avatar} />}
/>
```

***

### SearchInput()

> **SearchInput**(`__namedParameters`): `Element`

Defined in: [components/list/filter/SearchInput.tsx:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/filter/SearchInput.tsx#L81)

SearchInput component provides a debounced text search filter
that integrates with ListContext when available.

#### Parameters

##### \_\_namedParameters

[`SearchInputProps`](#searchinputprops)

#### Returns

`Element`

#### Examples

```tsx
<SearchInput source="q" placeholder="Search products..." />
```

```tsx
<SearchInput source="search" debounce={300} />
```

```tsx
<List filters={[<SearchInput source="q" alwaysOn />]}>
  ...
</List>
```

***

### useMenuContext()

> **useMenuContext**(): [`MenuContextValue`](#menucontextvalue)

Defined in: [components/menu/Menu.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L34)

Hook to access menu context

#### Returns

[`MenuContextValue`](#menucontextvalue)

***

### useMenuContextSafe()

> **useMenuContextSafe**(): [`MenuContextValue`](#menucontextvalue) \| `null`

Defined in: [components/menu/Menu.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L45)

Hook to safely access menu context (returns null if not in Menu)

#### Returns

[`MenuContextValue`](#menucontextvalue) \| `null`

***

### Show()

> **Show**\<`RecordType`\>(`__namedParameters`): `Element`

Defined in: [components/show/Show.tsx:111](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/Show.tsx#L111)

Show - Complete show component with record fetching and UI

The Show component combines ShowBase (record fetching)
with ShowView (Card container, header) to provide a complete show solution.

The `id` prop is optional - if not provided, it will be inferred from the URL
route parameters (e.g., from `/{resource}/:id/show`).

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### \_\_namedParameters

[`ShowProps`](#showprops)\<`RecordType`\>

#### Returns

`Element`

#### Example

```tsx
// Basic usage - id inferred from route
<Show resource="posts">
  <SimpleShowLayout>
    <TextField source="title" />
    <DateField source="createdAt" />
  </SimpleShowLayout>
</Show>

// With explicit id
<Show resource="posts" id={1}>
  <SimpleShowLayout>
    <TextField source="title" />
    <DateField source="createdAt" />
  </SimpleShowLayout>
</Show>

// With all options
<Show
  resource="posts"
  id={1}
  title="Post Details"
  actions={<EditButton />}
  aside={<PostAside />}
>
  <SimpleShowLayout>
    <TextField source="title" />
    <RichTextField source="content" />
    <DateField source="createdAt" />
  </SimpleShowLayout>
</Show>
```

***

### ShowView()

> **ShowView**(`__namedParameters`): `Element`

Defined in: [components/show/ShowView.tsx:101](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L101)

ShowView - UI wrapper component for show display

This component provides the visual structure (Card container) for displaying record data.

#### Parameters

##### \_\_namedParameters

[`ShowViewProps`](#showviewprops)

#### Returns

`Element`

#### Example

```tsx
// Basic usage (inside ShowBase)
<ShowBase resource="posts" id={1}>
  {(props) => (
    <ShowView title="Post" {...props}>
      <TextField source="title" />
    </ShowView>
  )}
</ShowBase>

// With actions and aside
<ShowView
  title="Post Details"
  actions={<EditButton />}
  aside={<PostAside />}
>
  <TextField source="title" />
</ShowView>
```

***

### SimpleShowLayout()

> **SimpleShowLayout**(`__namedParameters`): `Element` \| `null`

Defined in: [components/show/SimpleShowLayout.tsx:91](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/SimpleShowLayout.tsx#L91)

#### Parameters

##### \_\_namedParameters

[`SimpleShowLayoutProps`](#simpleshowlayoutprops)

#### Returns

`Element` \| `null`

***

### useTabbedShowLayoutContext()

> **useTabbedShowLayoutContext**(): [`TabbedShowLayoutContextValue`](#tabbedshowlayoutcontextvalue)

Defined in: [components/show/TabbedShowLayout.tsx:84](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L84)

Hook to access TabbedShowLayout context.
Must be used within a TabbedShowLayout component.

#### Returns

[`TabbedShowLayoutContextValue`](#tabbedshowlayoutcontextvalue)

#### Throws

When used outside of a TabbedShowLayout

***

### useOptionalTabbedShowLayoutContext()

> **useOptionalTabbedShowLayoutContext**(): [`TabbedShowLayoutContextValue`](#tabbedshowlayoutcontextvalue) \| `undefined`

Defined in: [components/show/TabbedShowLayout.tsx:96](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L96)

Hook to optionally access TabbedShowLayout context.
Returns undefined when used outside of a TabbedShowLayout (doesn't throw).

#### Returns

[`TabbedShowLayoutContextValue`](#tabbedshowlayoutcontextvalue) \| `undefined`

***

### generateShowTabName()

> **generateShowTabName**(`label`): `string`

Defined in: [components/show/TabbedShowLayout.tsx:136](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L136)

Generate a URL-safe slug from a label string.
Used when Tab doesn't have an explicit name prop.

#### Parameters

##### label

`string`

#### Returns

`string`

***

### Tab()

> **Tab**(`__namedParameters`): `null`

Defined in: [components/show/TabbedShowLayout.tsx:167](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L167)

Tab - Configuration component for TabbedShowLayout tabs.

This is a "configuration" component - it doesn't render anything on its own.
TabbedShowLayout extracts the props and renders the actual tab UI.
This pattern allows for a declarative API similar to react-admin.

#### Parameters

##### \_\_namedParameters

[`TabProps`](#tabprops)

#### Returns

`null`

#### Example

```tsx
<TabbedShowLayout>
  <Tab label="Summary">
    <TextField source="name" />
    <TextField source="email" />
  </Tab>
  <Tab label="Details" icon={<InfoIcon />}>
    <TextField source="description" />
  </Tab>
</TabbedShowLayout>
```

***

### TabbedShowLayout()

> **TabbedShowLayout**(`__namedParameters`): `Element` \| `null`

Defined in: [components/show/TabbedShowLayout.tsx:350](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L350)

TabbedShowLayout - Organizes show (read-only) fields into accessible tabs

Features:
- Keyboard navigation (Arrow keys, Home, End)
- URL synchronization for deep-linking
- Optional badge counts on tabs

#### Parameters

##### \_\_namedParameters

[`TabbedShowLayoutProps`](#tabbedshowlayoutprops)

#### Returns

`Element` \| `null`

#### Examples

```tsx
<Show resource="posts" id={1}>
  <TabbedShowLayout>
    <Tab label="Summary">
      <TextField source="title" label="Title" />
      <DateField source="createdAt" label="Created" />
    </Tab>
    <Tab label="Content">
      <RichTextField source="body" label="Body" />
    </Tab>
  </TabbedShowLayout>
</Show>
```

```tsx
<TabbedShowLayout syncWithLocation>
  <Tab label="Details" name="details">
    <TextField source="name" />
  </Tab>
  <Tab label="Related" name="related" path="related">
    <ReferenceManyField reference="comments" target="post_id">
      <Datagrid>...</Datagrid>
    </ReferenceManyField>
  </Tab>
</TabbedShowLayout>
// URL changes: /posts/1/show -> /posts/1/show/related
```

***

### AuthProviderContextProvider()

> **AuthProviderContextProvider**(`__namedParameters`): `Element`

Defined in: [contexts/AuthProviderContext.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/AuthProviderContext.tsx#L20)

Provider component for AuthProvider

#### Parameters

##### \_\_namedParameters

[`AuthProviderContextProviderProps`](#authprovidercontextproviderprops)

#### Returns

`Element`

***

### useAuthProvider()

> **useAuthProvider**(): `AuthProvider`

Defined in: [contexts/AuthProviderContext.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/AuthProviderContext.tsx#L36)

Hook to access the AuthProvider

#### Returns

`AuthProvider`

#### Throws

Error if used outside of AuthProviderContext

***

### useAuthProviderOptional()

> **useAuthProviderOptional**(): `AuthProvider` \| `null`

Defined in: [contexts/AuthProviderContext.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/AuthProviderContext.tsx#L48)

Hook to optionally access the AuthProvider (may return null)
Useful when auth is optional

#### Returns

`AuthProvider` \| `null`

***

### DataProviderContextProvider()

> **DataProviderContextProvider**(`__namedParameters`): `Element`

Defined in: [contexts/DataProviderContext.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/DataProviderContext.tsx#L20)

Provider component for DataProvider

#### Parameters

##### \_\_namedParameters

[`DataProviderContextProviderProps`](#dataprovidercontextproviderprops)

#### Returns

`Element`

***

### useDataProvider()

> **useDataProvider**(): `DataProvider`

Defined in: [contexts/DataProviderContext.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/DataProviderContext.tsx#L36)

Hook to access the DataProvider

#### Returns

`DataProvider`

#### Throws

Error if used outside of DataProviderContext

***

### useDataProviderOptional()

> **useDataProviderOptional**(): `DataProvider` \| `null`

Defined in: [contexts/DataProviderContext.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/DataProviderContext.tsx#L47)

Hook to optionally access the DataProvider (may return null)

#### Returns

`DataProvider` \| `null`

***

### FormContextProvider()

> **FormContextProvider**\<`T`\>(`__namedParameters`): `Element`

Defined in: [contexts/FormContext.tsx:74](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L74)

Provider component for FormContext.
Combines react-hook-form's FormProvider with shadmin-specific context.

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Parameters

##### \_\_namedParameters

[`FormContextProviderProps`](#formcontextproviderprops)\<`T`\>

#### Returns

`Element`

#### Example

```tsx
const form = useForm({ defaultValues: { name: '' } })

<FormContextProvider {...form} resource="users" save={handleSave}>
  <TextInput source="name" />
</FormContextProvider>
```

***

### useFormContext()

> **useFormContext**\<`T`\>(): `UseFormReturn`\<`T`\>

Defined in: [contexts/FormContext.tsx:116](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L116)

Hook to access react-hook-form methods from FormContext.
This is a re-export of react-hook-form's useFormContext.
Throws an error if used outside of a FormProvider.

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Returns

`UseFormReturn`\<`T`\>

#### Example

```tsx
const { control, handleSubmit, formState } = useFormContext<MyFormType>()
```

***

### useShadminFormContext()

> **useShadminFormContext**\<`T`\>(): `UseFormReturn`\<`T`\> & [`ShadminFormContextValue`](#shadminformcontextvalue)\<`T`\>

Defined in: [contexts/FormContext.tsx:129](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L129)

Hook to access the full shadmin form context (react-hook-form + shadmin extensions).
Returns undefined for shadmin properties if not provided.

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Returns

`UseFormReturn`\<`T`\> & [`ShadminFormContextValue`](#shadminformcontextvalue)\<`T`\>

#### Example

```tsx
const { record, resource, save, saving, mutationMode, control, handleSubmit } = useShadminFormContext()
```

***

### ListContextProvider()

> **ListContextProvider**\<`T`\>(`__namedParameters`): `Element`

Defined in: [contexts/ListContext.tsx:115](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L115)

Provider component for ListContext.
Wraps children with the list controller state and also provides
split sub-contexts (pagination, sort, filter, selection) to enable
optimized re-renders for components that only need a subset of the state.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### \_\_namedParameters

[`ListContextProviderProps`](#listcontextproviderprops)\<`T`\>

#### Returns

`Element`

#### Example

```tsx
<ListContextProvider value={listControllerResult}>
  <Datagrid />
</ListContextProvider>
```

***

### useListContext()

> **useListContext**\<`T`\>(): [`ListControllerResult`](#listcontrollerresult)\<`T`\>

Defined in: [contexts/ListContext.tsx:175](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L175)

Hook to access the list controller from ListContext.
Throws an error if used outside of a ListContextProvider.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Returns

[`ListControllerResult`](#listcontrollerresult)\<`T`\>

#### Example

```tsx
const { data, total, isLoading, page, perPage, sort, filterValues } = useListContext<MyType>()
```

***

### NotificationContextProvider()

> **NotificationContextProvider**(`__namedParameters`): `Element`

Defined in: [contexts/NotificationContext.tsx:102](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L102)

Provider component for NotificationContext.
Manages notification state and provides methods to add/dismiss notifications.

#### Parameters

##### \_\_namedParameters

[`NotificationContextProviderProps`](#notificationcontextproviderprops)

#### Returns

`Element`

#### Example

```tsx
<NotificationContextProvider>
  <App />
</NotificationContextProvider>
```

***

### useNotificationContext()

> **useNotificationContext**(): [`NotificationContextValue`](#notificationcontextvalue)

Defined in: [contexts/NotificationContext.tsx:184](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L184)

Hook to access the full notification context.
Throws an error if used outside of NotificationContextProvider.

#### Returns

[`NotificationContextValue`](#notificationcontextvalue)

#### Example

```tsx
const { notifications, dismiss, dismissAll } = useNotificationContext()
```

***

### useNotify()

> **useNotify**(): [`NotifyFunction`](#notifyfunction)

Defined in: [contexts/NotificationContext.tsx:211](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L211)

Hook to show notifications.
This is the primary hook for displaying notifications (matches react-admin API).

#### Returns

[`NotifyFunction`](#notifyfunction)

#### Example

```tsx
const notify = useNotify()

// Simple notification
notify('Record saved')

// With options
notify('Record saved', { type: 'success' })
notify('Error occurred', { type: 'error' })
notify('Item deleted', { type: 'info', undoable: true, onUndo: handleUndo })
```

***

### RecordContextProvider()

> **RecordContextProvider**\<`T`\>(`__namedParameters`): `Element`

Defined in: [contexts/RecordContext.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/RecordContext.tsx#L54)

Provider component for RecordContext.
Wraps children with the current record value.
Uses referential equality optimization to prevent unnecessary re-renders.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### \_\_namedParameters

[`RecordContextProviderProps`](#recordcontextproviderprops)\<`T`\>

#### Returns

`Element`

#### Example

```tsx
<RecordContextProvider value={{ id: 1, name: 'John' }}>
  <RecordDisplay />
</RecordContextProvider>
```

***

### useRecordContext()

> **useRecordContext**\<`T`\>(): `T` \| `undefined`

Defined in: [contexts/RecordContext.tsx:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/RecordContext.tsx#L83)

Hook to access the current record from RecordContext.
Returns undefined if used outside of a RecordContextProvider.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Returns

`T` \| `undefined`

#### Example

```tsx
const record = useRecordContext<MyType>()
// record is MyType | undefined
```

***

### ResourceContextProvider()

> **ResourceContextProvider**(`__namedParameters`): `Element`

Defined in: [contexts/ResourceContext.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L30)

Provider component for the current resource name
Wraps ra-core's ResourceContextProvider

#### Parameters

##### \_\_namedParameters

[`ResourceContextProviderProps`](#resourcecontextproviderprops)

#### Returns

`Element`

***

### useResource()

> **useResource**(): `string`

Defined in: [contexts/ResourceContext.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L45)

Hook to get the current resource name

#### Returns

`string`

#### Throws

Error if used outside of ResourceContext

***

### useResourceOptional()

> **useResourceOptional**(): `string` \| `null`

Defined in: [contexts/ResourceContext.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L56)

Hook to optionally get the current resource name (may return null)

#### Returns

`string` \| `null`

***

### useResourceContext()

> **useResourceContext**(`options?`): `string` \| `undefined`

Defined in: [contexts/ResourceContext.tsx:88](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L88)

Hook to access the current resource name from ResourceContext.
This is the main hook, matching react-admin API.
Returns undefined if used outside of a ResourceContextProvider unless a default is provided.

#### Parameters

##### options?

[`UseResourceContextOptions`](#useresourcecontextoptions)

#### Returns

`string` \| `undefined`

#### Example

```tsx
// Basic usage
const resource = useResourceContext()

// With default value
const resource = useResourceContext({ defaultValue: 'users' })

// Throw if not in provider
const resource = useResourceContext({ required: true })
```

***

### ResourceDefinitionContextProvider()

> **ResourceDefinitionContextProvider**(`__namedParameters`): `Element`

Defined in: [contexts/ResourceContext.tsx:116](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L116)

#### Parameters

##### \_\_namedParameters

[`ResourceDefinitionContextProviderProps`](#resourcedefinitioncontextproviderprops)

#### Returns

`Element`

***

### useResourceDefinitions()

> **useResourceDefinitions**(): [`ResourceDefinitions`](#resourcedefinitions)

Defined in: [contexts/ResourceContext.tsx:131](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L131)

Hook to get all resource definitions

#### Returns

[`ResourceDefinitions`](#resourcedefinitions)

***

### useResourceDefinition()

> **useResourceDefinition**(`name?`): `ResourceDefinition`\<`ResourceOptions`\> \| `undefined`

Defined in: [contexts/ResourceContext.tsx:138](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L138)

Hook to get a specific resource definition by name

#### Parameters

##### name?

`string`

#### Returns

`ResourceDefinition`\<`ResourceOptions`\> \| `undefined`

***

### ThemeProvider()

> **ThemeProvider**(`__namedParameters`): `Element`

Defined in: [contexts/ThemeContext.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L46)

ThemeProvider component that manages theme state

#### Parameters

##### \_\_namedParameters

[`ThemeProviderProps`](#themeproviderprops)

#### Returns

`Element`

***

### useTheme()

> **useTheme**(): [`ThemeContextValue`](#themecontextvalue)

Defined in: [contexts/ThemeContext.tsx:162](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L162)

Hook to access theme context

#### Returns

[`ThemeContextValue`](#themecontextvalue)

***

### createDefaultI18nProvider()

> **createDefaultI18nProvider**(`messages`, `defaultLocale`): [`I18nProvider`](#i18nprovider)

Defined in: [contexts/TranslationContext.tsx:121](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L121)

Create a default i18n provider with basic functionality

#### Parameters

##### messages

`Record`\<`string`, [`TranslationMessages`](#translationmessages)\> = `{}`

##### defaultLocale

`string` = `'en'`

#### Returns

[`I18nProvider`](#i18nprovider)

***

### TranslationProvider()

> **TranslationProvider**(`__namedParameters`): `Element`

Defined in: [contexts/TranslationContext.tsx:175](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L175)

TranslationProvider component
Provides i18n functionality to the application

#### Parameters

##### \_\_namedParameters

[`TranslationProviderProps`](#translationproviderprops)

#### Returns

`Element`

***

### useTranslationContext()

> **useTranslationContext**(): [`TranslationContextValue`](#translationcontextvalue)

Defined in: [contexts/TranslationContext.tsx:220](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L220)

Hook to access translation context

#### Returns

[`TranslationContextValue`](#translationcontextvalue)

#### Throws

Error if used outside of TranslationProvider

***

### useTranslationContextOptional()

> **useTranslationContextOptional**(): [`TranslationContextValue`](#translationcontextvalue) \| `null`

Defined in: [contexts/TranslationContext.tsx:231](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L231)

Hook to optionally access translation context (may return null)

#### Returns

[`TranslationContextValue`](#translationcontextvalue) \| `null`

***

### createAuthProviderFactory()

> **createAuthProviderFactory**(`config`): (`options?`) => `AuthProvider`

Defined in: [dotdo/auth-provider.ts:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/auth-provider.ts#L32)

Creates an AuthProvider factory bound to a dotdo API endpoint

#### Parameters

##### config

[`DOConfig`](#doconfig)

DOConfig with baseUrl and optional settings

#### Returns

A function that creates AuthProvider instances

> (`options?`): `AuthProvider`

##### Parameters

###### options?

[`AuthOptions`](#authoptions)

##### Returns

`AuthProvider`

#### Example

```tsx
const createAuth = createAuthProviderFactory({
  baseUrl: 'https://api.your-app.do'
})

const authProvider = createAuth({
  tokenKey: 'my_app_token',
  logoutRedirectPath: '/signin'
})
```

***

### createDataProviderFactory()

> **createDataProviderFactory**(`config`): (`options?`) => `DataProvider`

Defined in: [dotdo/data-provider.ts:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/data-provider.ts#L52)

Creates a DataProvider factory bound to a dotdo API endpoint

#### Parameters

##### config

[`DOConfig`](#doconfig)

DOConfig with baseUrl and optional settings

#### Returns

A function that creates DataProvider instances

> (`options?`): `DataProvider`

##### Parameters

###### options?

[`DBOptions`](#dboptions)

##### Returns

`DataProvider`

#### Example

```tsx
const createDB = createDataProviderFactory({
  baseUrl: 'https://api.your-app.do'
})

const dataProvider = createDB({
  resourceMapping: { 'users': 'user-profiles' }
})
```

***

### DO()

> **DO**(`baseUrl`, `config?`): [`DOResult`](#doresult)

Defined in: [dotdo/do.ts:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/do.ts#L65)

Create dotdo integration for shadmin

This is the main entry point for connecting shadmin to dotdo.
It returns `DB` and `Auth` factories that create react-admin compatible
DataProvider and AuthProvider instances.

#### Parameters

##### baseUrl

`string`

The base URL of your dotdo API

##### config?

`Omit`\<[`DOConfig`](#doconfig), `"baseUrl"`\>

Optional additional configuration

#### Returns

[`DOResult`](#doresult)

Object with DB and Auth factory functions

#### Examples

```tsx
import { Admin, Resource } from 'shadmin'
import { DO } from 'shadmin'

const { Auth, DB } = DO('https://api.your-app.do')

function App() {
  return (
    <Admin dataProvider={DB()} authProvider={Auth()}>
      <Resource name="users" list={UserList} />
      <Resource name="posts" list={PostList} />
    </Admin>
  )
}
```

```tsx
const { Auth, DB } = DO('https://api.your-app.do', {
  headers: { 'X-API-Version': '2' },
  timeout: 60000,
})

// Custom resource mapping
const dataProvider = DB({
  resourceMapping: {
    'users': 'user-accounts',
    'posts': 'blog-posts',
  }
})

// Custom auth options
const authProvider = Auth({
  tokenKey: 'my_app_token',
  logoutRedirectPath: '/signin',
})
```

***

### validateBaseUrl()

> **validateBaseUrl**(`url`): `void`

Defined in: [dotdo/do.ts:119](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/do.ts#L119)

Validate that a URL is valid

#### Parameters

##### url

`string`

#### Returns

`void`

#### Throws

Error if URL is invalid

***

### isHttpError()

> **isHttpError**(`error`): `error is HttpError`

Defined in: [errors/index.ts:89](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L89)

Type guard to check if an error is an HttpError

#### Parameters

##### error

`unknown`

#### Returns

`error is HttpError`

***

### isNetworkError()

> **isNetworkError**(`error`): `error is NetworkError`

Defined in: [errors/index.ts:96](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L96)

Type guard to check if an error is a NetworkError

#### Parameters

##### error

`unknown`

#### Returns

`error is NetworkError`

***

### isTimeoutError()

> **isTimeoutError**(`error`): `error is TimeoutError`

Defined in: [errors/index.ts:103](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L103)

Type guard to check if an error is a TimeoutError

#### Parameters

##### error

`unknown`

#### Returns

`error is TimeoutError`

***

### isValidationError()

> **isValidationError**(`error`): `error is ValidationError`

Defined in: [errors/index.ts:110](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L110)

Type guard to check if an error is a ValidationError

#### Parameters

##### error

`unknown`

#### Returns

`error is ValidationError`

***

### isNotFoundError()

> **isNotFoundError**(`error`): `boolean`

Defined in: [errors/index.ts:117](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L117)

Helper to check if an error represents a 404 Not Found

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

***

### isForbiddenError()

> **isForbiddenError**(`error`): `boolean`

Defined in: [errors/index.ts:124](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L124)

Helper to check if an error represents a 403 Forbidden

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

***

### isServerError()

> **isServerError**(`error`): `boolean`

Defined in: [errors/index.ts:131](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L131)

Helper to check if an error represents a 5xx server error

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

***

### isConflictError()

> **isConflictError**(`error`): `boolean`

Defined in: [errors/index.ts:138](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L138)

Helper to check if an error represents a 409 Conflict

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

***

### extractFieldErrors()

> **extractFieldErrors**(`error`): `Record`\<`string`, `string`[]\> \| `null`

Defined in: [errors/index.ts:145](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/errors/index.ts#L145)

Extract field errors from an HTTP error response body

#### Parameters

##### error

`unknown`

#### Returns

`Record`\<`string`, `string`[]\> \| `null`

***

### createQueryHook()

> **createQueryHook**\<`TMethod`, `TParams`, `TResult`, `_TRecordType`, `TOptions`\>(`config`): (`resource`, `params`, `options`) => `TResult` & [`BaseQueryResult`](#basequeryresult) & [`BaseErrorHandling`](#baseerrorhandling)

Defined in: [hooks/createDataHook.ts:104](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L104)

Creates a query hook with standardized behavior

#### Type Parameters

##### TMethod

`TMethod` *extends* keyof `DataProvider`

##### TParams

`TParams`

##### TResult

`TResult`

##### _TRecordType

`_TRecordType` *extends* `RaRecord` = `RaRecord`

##### TOptions

`TOptions` *extends* `Omit`\<`UseQueryOptions`\<`unknown`, `Error`, `unknown`, readonly `unknown`[]\>, `"queryKey"` \| `"queryFn"`\> = `Omit`\<`UseQueryOptions`\<`unknown`, `Error`, `unknown`, readonly `unknown`[]\>, `"queryKey"` \| `"queryFn"`\>

#### Parameters

##### config

[`QueryHookConfig`](#queryhookconfig)\<`TMethod`, `TParams`, `TResult`, `_TRecordType`\>

#### Returns

> (`resource`, `params`, `options`): `TResult` & [`BaseQueryResult`](#basequeryresult) & [`BaseErrorHandling`](#baseerrorhandling)

##### Parameters

###### resource

`string`

###### params

`TParams`

###### options

`TOptions` = `...`

##### Returns

`TResult` & [`BaseQueryResult`](#basequeryresult) & [`BaseErrorHandling`](#baseerrorhandling)

***

### createSimpleQueryHook()

> **createSimpleQueryHook**\<`TMethod`, `TParams`, `TResult`, `_TRecordType`, `TOptions`\>(`config`): (`resource`, `params`, `options`) => `TResult` & `Omit`\<[`BaseQueryResult`](#basequeryresult), `"isNetworkError"` \| `"isForbidden"` \| `"isNotFound"` \| `"isServerError"` \| `"isTimeout"` \| `"errorCount"` \| `"shouldRedirectToLogin"`\>

Defined in: [hooks/createDataHook.ts:192](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L192)

Creates a simpler query hook without auth error checking

#### Type Parameters

##### TMethod

`TMethod` *extends* keyof `DataProvider`

##### TParams

`TParams`

##### TResult

`TResult`

##### _TRecordType

`_TRecordType` *extends* `RaRecord` = `RaRecord`

##### TOptions

`TOptions` *extends* `Omit`\<`UseQueryOptions`\<`unknown`, `Error`, `unknown`, readonly `unknown`[]\>, `"queryKey"` \| `"queryFn"`\> = `Omit`\<`UseQueryOptions`\<`unknown`, `Error`, `unknown`, readonly `unknown`[]\>, `"queryKey"` \| `"queryFn"`\>

#### Parameters

##### config

`Omit`\<[`QueryHookConfig`](#queryhookconfig)\<`TMethod`, `TParams`, `TResult`, `_TRecordType`\>, `"useAuthErrorCheck"`\>

#### Returns

> (`resource`, `params`, `options`): `TResult` & `Omit`\<[`BaseQueryResult`](#basequeryresult), `"isNetworkError"` \| `"isForbidden"` \| `"isNotFound"` \| `"isServerError"` \| `"isTimeout"` \| `"errorCount"` \| `"shouldRedirectToLogin"`\>

##### Parameters

###### resource

`string`

###### params

`TParams`

###### options

`TOptions` = `...`

##### Returns

`TResult` & `Omit`\<[`BaseQueryResult`](#basequeryresult), `"isNetworkError"` \| `"isForbidden"` \| `"isNotFound"` \| `"isServerError"` \| `"isTimeout"` \| `"errorCount"` \| `"shouldRedirectToLogin"`\>

***

### createMutationHook()

> **createMutationHook**\<`TMethod`, `TParams`, `TResult`, `TRecordType`, `TOptions`\>(`config`): (`resource?`, `options`) => [`BaseMutationState`](#basemutationstate)\<`TResult`\> & [`MutationErrorHandling`](#mutationerrorhandling) & `object`

Defined in: [hooks/createDataHook.ts:310](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L310)

Creates a mutation hook with standardized behavior

#### Type Parameters

##### TMethod

`TMethod` *extends* keyof `DataProvider`

##### TParams

`TParams`

##### TResult

`TResult`

##### TRecordType

`TRecordType` *extends* `RaRecord` = `RaRecord`

##### TOptions

`TOptions` *extends* `Omit`\<`UseMutationOptions`\<`TResult`, `Error`, \{ `resource`: `string`; `params`: `TParams`; \}, `unknown`\>, `"mutationFn"`\> = `Omit`\<`UseMutationOptions`\<`TResult`, `Error`, \{ `resource`: `string`; `params`: `TParams`; \}, `unknown`\>, `"mutationFn"`\>

#### Parameters

##### config

[`MutationHookConfig`](#mutationhookconfig)\<`TMethod`, `TParams`, `TResult`, `TRecordType`\>

#### Returns

> (`resource?`, `options?`): [`BaseMutationState`](#basemutationstate)\<`TResult`\> & [`MutationErrorHandling`](#mutationerrorhandling) & `object`

##### Parameters

###### resource?

`string`

###### options?

`TOptions` = `...`

##### Returns

[`BaseMutationState`](#basemutationstate)\<`TResult`\> & [`MutationErrorHandling`](#mutationerrorhandling) & `object`

***

### createSimpleMutationHook()

> **createSimpleMutationHook**\<`TMethod`, `TParams`, `TResult`, `TRecordType`, `TOptions`\>(`config`): (`resource?`, `options`) => \[`MutateFunction`, `SimpleMutationState`\]

Defined in: [hooks/createDataHook.ts:537](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L537)

Creates a simpler mutation hook that returns a tuple [mutate, state]

#### Type Parameters

##### TMethod

`TMethod` *extends* keyof `DataProvider`

##### TParams

`TParams`

##### TResult

`TResult`

##### TRecordType

`TRecordType` *extends* `RaRecord` = `RaRecord`

##### TOptions

`TOptions` *extends* `Omit`\<`UseMutationOptions`\<`TResult`, `Error`, \{ `resource`: `string`; `params`: `TParams`; \}, `unknown`\>, `"mutationFn"`\> = `Omit`\<`UseMutationOptions`\<`TResult`, `Error`, \{ `resource`: `string`; `params`: `TParams`; \}, `unknown`\>, `"mutationFn"`\>

#### Parameters

##### config

`Omit`\<[`MutationHookConfig`](#mutationhookconfig)\<`TMethod`, `TParams`, `TResult`, `TRecordType`\>, `"getSubmittedData"`\>

#### Returns

> (`resource?`, `options?`): \[`MutateFunction`, `SimpleMutationState`\]

##### Parameters

###### resource?

`string`

###### options?

`TOptions` = `...`

##### Returns

\[`MutateFunction`, `SimpleMutationState`\]

***

### useCanAccess()

> **useCanAccess**(`params`): [`UseCanAccessResult`](#usecanaccessresult)

Defined in: [hooks/useCanAccess.ts:177](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L177)

Hook to check if the current user has access to a resource/action.

Priority order for permission checks:
1. Custom canAccessCheck function (if provided)
2. Resource/action based check (if both resource and action provided)
3. Simple permission string or array check

#### Parameters

##### params

[`UseCanAccessParams`](#usecanaccessparams)

Permission check parameters

#### Returns

[`UseCanAccessResult`](#usecanaccessresult)

Object containing canAccess boolean, loading state, and error

#### Example

```tsx
// Simple permission check
const { canAccess } = useCanAccess({ permission: 'admin' })

// Check multiple permissions (any match)
const { canAccess } = useCanAccess({ permission: ['admin', 'editor'] })

// Check multiple permissions (all must match)
const { canAccess } = useCanAccess({
  permission: ['admin', 'editor'],
  requireAll: true
})

// Resource/action check
const { canAccess } = useCanAccess({ resource: 'posts', action: 'edit' })

// Wildcard permissions
// If user has 'admin.*', they can access 'admin.read', 'admin.write', etc.
const { canAccess } = useCanAccess({ permission: 'admin.read' })

// Custom check function
const { canAccess } = useCanAccess({
  canAccessCheck: (perms) => {
    const p = perms as { level: number }
    return p.level >= 3
  }
})

// Conditional rendering based on access
if (isLoading) return <Spinner />
if (!canAccess) return <AccessDenied />
return <ProtectedContent />
```

***

### useCreate()

> **useCreate**\<`RecordType`, `TVariables`\>(`resource?`, `options?`): [`UseCreateResult`](#usecreateresult)\<`RecordType`, `TVariables`\>

Defined in: [hooks/useCreate.ts:108](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L108)

Hook to create a new record using the data provider

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` = `Record`\<`string`, `unknown`\>

#### Parameters

##### resource?

`string`

Optional resource name (can be provided when calling create instead)

##### options?

[`UseCreateOptions`](#usecreateoptions)\<`RecordType`, `TVariables`\> = `{}`

Optional mutation options

#### Returns

[`UseCreateResult`](#usecreateresult)\<`RecordType`, `TVariables`\>

Tuple of [create function, mutation state]

#### Example

```tsx
// Option 1: Without pre-configured resource
const [create, { isLoading }] = useCreate()
await create('posts', { data: { title: 'New Post' } })

// Option 2: With pre-configured resource
const [create, { isLoading }] = useCreate('posts')
await create({ data: { title: 'New Post' } })
```

***

### useCreateSuggestionContext()

> **useCreateSuggestionContext**\<`TChoice`\>(): [`CreateSuggestionContextValue`](#createsuggestioncontextvalue)\<`TChoice`\>

Defined in: [hooks/useCreateSuggestionContext.ts:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreateSuggestionContext.ts#L79)

Hook to access the create suggestion context.
Must be used within a CreateSuggestionContext.Provider.

#### Type Parameters

##### TChoice

`TChoice` = `unknown`

The type of choice being created

#### Returns

[`CreateSuggestionContextValue`](#createsuggestioncontextvalue)\<`TChoice`\>

#### Throws

Error if used outside of a CreateSuggestionContext.Provider

#### Example

```tsx
import { useCreateSuggestionContext, Create, SimpleForm, TextInput } from 'shadmin';
import { Dialog, DialogContent, DialogTitle } from '@shadcn/ui';

interface Author {
  id: number;
  name: string;
}

const CreateAuthor = () => {
  const { filter, onCancel, onCreate } = useCreateSuggestionContext<Author>();

  const handleSubmit = (data: { name: string }) => {
    // Create the author and call onCreate with the result
    createAuthor(data).then(onCreate);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogTitle>Create Author</DialogTitle>
        <SimpleForm onSubmit={handleSubmit} defaultValues={{ name: filter }}>
          <TextInput source="name" />
        </SimpleForm>
      </DialogContent>
    </Dialog>
  );
};
```

***

### useDelete()

> **useDelete**\<`RecordType`\>(`resource?`, `options?`): [`UseDeleteResult`](#usedeleteresult)\<`RecordType`\>

Defined in: [hooks/useDelete.ts:99](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L99)

Hook to delete a single record

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### resource?

`string`

##### options?

[`UseDeleteOptions`](#usedeleteoptions)\<`RecordType`\> = `{}`

#### Returns

[`UseDeleteResult`](#usedeleteresult)\<`RecordType`\>

#### Example

```tsx
const [deleteRecord, { isLoading }] = useDelete()
await deleteRecord('posts', { id: 123 })
```

***

### useDeleteMany()

> **useDeleteMany**\<`RecordType`\>(`resource?`, `options?`): [`UseDeleteManyResult`](#usedeletemanyresult)\<`RecordType`\>

Defined in: [hooks/useDeleteMany.ts:97](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L97)

Hook to delete multiple records at once

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### resource?

`string`

##### options?

[`UseDeleteManyOptions`](#usedeletemanyoptions)\<`RecordType`\> = `{}`

#### Returns

[`UseDeleteManyResult`](#usedeletemanyresult)\<`RecordType`\>

#### Example

```tsx
const [deleteMany, { isLoading }] = useDeleteMany()
await deleteMany('posts', { ids: [1, 2, 3] })
```

***

### useGetList()

> **useGetList**\<`RecordType`\>(`resource`, `params`, `options`): [`UseGetListResult`](#usegetlistresult)\<`RecordType`\>

Defined in: [hooks/useGetList.ts:91](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L91)

Hook to fetch a list of records from the data provider

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### resource

`string`

The resource name to fetch from

##### params

[`UseGetListParams`](#usegetlistparams) = `{}`

Optional parameters for pagination, sorting, and filtering

##### options

[`UseGetListOptions`](#usegetlistoptions)\<`RecordType`\> = `{}`

Optional TanStack Query options

#### Returns

[`UseGetListResult`](#usegetlistresult)\<`RecordType`\>

Query result with data, total, loading state, and error

#### Example

```tsx
const { data, total, isLoading, error } = useGetList('posts', {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'id', order: 'DESC' },
  filter: { published: true }
})
```

***

### useGetMany()

> **useGetMany**\<`RecordType`\>(`resource`, `params`, `options`): [`UseGetManyResult`](#usegetmanyresult)\<`RecordType`\>

Defined in: [hooks/useGetMany.ts:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L79)

Hook to fetch multiple records by their IDs from the data provider

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### resource

`string`

The resource name to fetch from

##### params

[`UseGetManyParams`](#usegetmanyparams)

Parameters including the array of record IDs

##### options

[`UseGetManyOptions`](#usegetmanyoptions)\<`RecordType`\> = `{}`

Optional TanStack Query options

#### Returns

[`UseGetManyResult`](#usegetmanyresult)\<`RecordType`\>

Query result with data array, loading state, and error

#### Example

```tsx
const { data, isLoading, error } = useGetMany('users', { ids: [1, 2, 3] })
```

***

### useGetManyReference()

> **useGetManyReference**\<`RecordType`\>(`resource`, `params`, `options`): [`UseGetManyReferenceResult`](#usegetmanyreferenceresult)\<`RecordType`\>

Defined in: [hooks/useGetManyReference.ts:134](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L134)

Hook to fetch related records based on a foreign key relationship

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### resource

`string`

The resource name to fetch from

##### params

[`UseGetManyReferenceParams`](#usegetmanyreferenceparams)

Parameters including target field and ID

##### options

[`UseGetManyReferenceOptions`](#usegetmanyreferenceoptions)\<`RecordType`\> = `{}`

Optional TanStack Query options

#### Returns

[`UseGetManyReferenceResult`](#usegetmanyreferenceresult)\<`RecordType`\>

Query result with data array, total, loading state, and error

#### Example

```tsx
// Fetch comments for a specific post
const { data, total, isLoading } = useGetManyReference('comments', {
  target: 'postId',
  id: 123,
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'DESC' }
})
```

***

### useGetOne()

> **useGetOne**\<`RecordType`\>(`resource`, `params`, `options`): [`UseGetOneResult`](#usegetoneresult)\<`RecordType`\>

Defined in: [hooks/useGetOne.ts:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L68)

Hook to fetch a single record from the data provider

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### resource

`string`

The resource name to fetch from

##### params

[`UseGetOneParams`](#usegetoneparams)

Parameters including the record ID

##### options

[`UseGetOneOptions`](#usegetoneoptions)\<`RecordType`\> = `{}`

Optional TanStack Query options

#### Returns

[`UseGetOneResult`](#usegetoneresult)\<`RecordType`\>

Query result with data, loading state, and error

#### Example

```tsx
const { data, isLoading, error } = useGetOne('posts', { id: 123 })
```

***

### useListParams()

> **useListParams**(`__namedParameters`): [`UseListParamsResult`](#uselistparamsresult)

Defined in: [hooks/useListParams.ts:274](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L274)

Hook to manage list parameters with URL synchronization

#### Parameters

##### \_\_namedParameters

[`UseListParamsProps`](#uselistparamsprops)

#### Returns

[`UseListParamsResult`](#uselistparamsresult)

#### Example

```tsx
const { page, perPage, sort, filterValues, setPage, setSort, setFilters } = useListParams({
  resource: 'posts',
  perPage: 25,
  sort: { field: 'createdAt', order: 'DESC' }
})
```

***

### useLocale()

> **useLocale**(): [`UseLocaleResult`](#uselocaleresult)

Defined in: [hooks/useLocale.ts:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLocale.ts#L33)

Hook to get and set the current locale

#### Returns

[`UseLocaleResult`](#uselocaleresult)

Object with current locale and changeLocale function

#### Example

```tsx
const { locale, changeLocale } = useLocale()

return (
  <select value={locale} onChange={(e) => changeLocale(e.target.value)}>
    <option value="en">English</option>
    <option value="fr">French</option>
  </select>
)
```

***

### useLocaleState()

> **useLocaleState**(): \[`string`, (`locale`) => `void`\]

Defined in: [hooks/useLocaleState.ts:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLocaleState.ts#L29)

Hook to get and set the current locale as a tuple
This is an alternative API to useLocale that returns an array like useState

#### Returns

\[`string`, (`locale`) => `void`\]

Tuple of [locale, setLocale]

#### Example

```tsx
const [locale, setLocale] = useLocaleState()

return (
  <select value={locale} onChange={(e) => setLocale(e.target.value)}>
    <option value="en">English</option>
    <option value="fr">French</option>
  </select>
)
```

***

### useLogin()

> **useLogin**(`options`): [`UseLoginResult`](#useloginresult)

Defined in: [hooks/useLogin.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L59)

useLogin hook for handling authentication

#### Parameters

##### options

[`UseLoginOptions`](#useloginoptions) = `{}`

#### Returns

[`UseLoginResult`](#useloginresult)

#### Example

```tsx
function LoginPage() {
  const { login, isLoading, error } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login({ username: 'admin', password: 'secret' })
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error.message}</p>}
      <input name="username" />
      <input name="password" type="password" />
      <button disabled={isLoading}>Login</button>
    </form>
  )
}
```

***

### useLogout()

> **useLogout**(`options`): [`UseLogoutResult`](#uselogoutresult)

Defined in: [hooks/useLogout.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L55)

useLogout hook for handling logout/sign-out

#### Parameters

##### options

[`UseLogoutOptions`](#uselogoutoptions) = `{}`

#### Returns

[`UseLogoutResult`](#uselogoutresult)

#### Example

```tsx
function LogoutButton() {
  const { logout, isLoading } = useLogout()

  const handleClick = async () => {
    await logout()
  }

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
```

***

### useMediaQuery()

> **useMediaQuery**(`query`): `boolean`

Defined in: [hooks/useMediaQuery.ts:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useMediaQuery.ts#L14)

Hook to check if a media query matches.

#### Parameters

##### query

`string`

The media query string to match

#### Returns

`boolean`

Whether the media query matches

#### Example

```tsx
const isMobile = useMediaQuery('(max-width: 768px)')
```

***

### usePermissions()

> **usePermissions**\<`Permissions`\>(`options`): [`UsePermissionsResult`](#usepermissionsresult)\<`Permissions`\>

Defined in: [hooks/usePermissions.ts:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/usePermissions.ts#L72)

Hook to fetch permissions from the AuthProvider.
Caches permissions using React Query to avoid redundant fetches.

#### Type Parameters

##### Permissions

`Permissions` = `unknown`

The type of permissions returned by the AuthProvider

#### Parameters

##### options

[`UsePermissionsOptions`](#usepermissionsoptions) = `{}`

Optional configuration for enabling/disabling and params

#### Returns

[`UsePermissionsResult`](#usepermissionsresult)\<`Permissions`\>

Object containing permissions data, loading state, error, and refetch function

#### Example

```tsx
// Basic usage
const { permissions, isLoading, error } = usePermissions()

// With TypeScript generic
const { permissions } = usePermissions<string[]>()
// permissions is typed as string[] | undefined

// Conditional fetching
const { permissions } = usePermissions({ enabled: isLoggedIn })

// With params
const { permissions } = usePermissions({ params: { scope: 'admin' } })

// Manual refetch
const { refetch } = usePermissions()
await refetch()
```

***

### useRedirect()

> **useRedirect**(): [`RedirectFunction`](#redirectfunction)

Defined in: [hooks/useRedirect.ts:106](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRedirect.ts#L106)

Hook to navigate programmatically

#### Returns

[`RedirectFunction`](#redirectfunction)

A function to redirect to different views

#### Example

```tsx
const redirect = useRedirect()

// Navigate to list
redirect('list', 'posts')

// Navigate to show view
redirect('show', 'posts', 123)

// Navigate to edit view
redirect('edit', 'posts', 123)

// Navigate to create view
redirect('create', 'posts')

// Navigate to custom path
redirect('/custom/path')

// Prevent redirect
redirect(false)
```

***

### useRefresh()

> **useRefresh**(): [`RefreshFunction`](#refreshfunction)

Defined in: [hooks/useRefresh.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRefresh.ts#L42)

Hook to refresh data from the data provider

#### Returns

[`RefreshFunction`](#refreshfunction)

A function to trigger data refresh

#### Example

```tsx
const refresh = useRefresh()

// Refresh all queries
refresh()

// Refresh specific resource
refresh('posts')

// Hard refresh (clear cache first)
refresh(undefined, { hard: true })
```

***

### useSetLocale()

> **useSetLocale**(): [`SetLocale`](#setlocale-1)

Defined in: [hooks/useSetLocale.ts:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useSetLocale.ts#L29)

Hook to get the setLocale function

#### Returns

[`SetLocale`](#setlocale-1)

A function to change the current locale

#### Example

```tsx
const setLocale = useSetLocale()

return (
  <button onClick={() => setLocale('fr')}>
    Switch to French
  </button>
)
```

***

### useTranslate()

> **useTranslate**(): [`TranslateFunction`](#translatefunction)

Defined in: [hooks/useTranslate.ts:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useTranslate.ts#L25)

Hook to get the translate function

#### Returns

[`TranslateFunction`](#translatefunction)

A function to translate keys to localized strings

#### Example

```tsx
const translate = useTranslate()
const greeting = translate('hello', { name: 'World' })
const items = translate('items.count', { smart_count: 5 })
```

***

### useUpdate()

> **useUpdate**\<`RecordType`, `TVariables`\>(`resource?`, `options?`): [`UseUpdateResult`](#useupdateresult)\<`RecordType`, `TVariables`\>

Defined in: [hooks/useUpdate.ts:128](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L128)

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` *extends* `Partial`\<`RecordType`\> = `Partial`\<`RecordType`\>

#### Parameters

##### resource?

`string`

##### options?

[`UseUpdateOptions`](#useupdateoptions)\<`RecordType`, `TVariables`\> = `{}`

#### Returns

[`UseUpdateResult`](#useupdateresult)\<`RecordType`, `TVariables`\>

***

### useUpdateMany()

> **useUpdateMany**\<`RecordType`, `TVariables`\>(`resource?`, `options?`): [`UseUpdateManyResult`](#useupdatemanyresult)\<`RecordType`, `TVariables`\>

Defined in: [hooks/useUpdateMany.ts:104](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L104)

Hook to update multiple records at once

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` = `Record`\<`string`, `unknown`\>

#### Parameters

##### resource?

`string`

##### options?

[`UseUpdateManyOptions`](#useupdatemanyoptions)\<`RecordType`, `TVariables`\> = `{}`

#### Returns

[`UseUpdateManyResult`](#useupdatemanyresult)\<`RecordType`, `TVariables`\>

#### Example

```tsx
const [updateMany, { isLoading }] = useUpdateMany()
await updateMany('posts', { ids: [1, 2, 3], data: { published: false } })
```

***

### createMongoDataProvider()

> **createMongoDataProvider**(`config`, `options`): `DataProvider`

Defined in: [mongo/data-provider.ts:157](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/data-provider.ts#L157)

Creates a DataProvider for mongo.do edge database

#### Parameters

##### config

[`MongoConfig`](#mongoconfig)

MongoConfig with baseUrl and optional settings

##### options

[`MongoDataProviderOptions`](#mongodataprovideroptions) = `{}`

Optional configuration for resource mapping and defaults

#### Returns

`DataProvider`

A DataProvider compatible with react-admin/shadmin

#### Examples

```tsx
const dataProvider = createMongoDataProvider({
  baseUrl: 'https://my-db.mongo.do',
  apiKey: 'your-api-key'
})
```

```tsx
const dataProvider = createMongoDataProvider(
  { baseUrl: 'https://my-db.mongo.do' },
  { resourceMapping: { 'users': 'user-accounts' } }
)
```

***

### cn()

> **cn**(...`inputs`): `string`

Defined in: [utils/cn.ts:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/cn.ts#L15)

Utility for conditionally joining class names together.
A lightweight alternative to clsx/classnames.

#### Parameters

##### inputs

...(`string` \| `false` \| `null` \| `undefined`)[]

Class names to join

#### Returns

`string`

Joined class names string

#### Example

```ts
cn('foo', 'bar') // 'foo bar'
cn('foo', false && 'bar') // 'foo'
cn('foo', undefined, 'bar') // 'foo bar'
```

***

### isValidOperator()

> **isValidOperator**(`value`): value is "eq" \| "neq" \| "gt" \| "gte" \| "lt" \| "lte" \| "contains" \| "startsWith" \| "endsWith" \| "in" \| "notIn" \| "between" \| "isNull" \| "isNotNull"

Defined in: [utils/filterOperators.ts:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L45)

Check if a string is a valid filter operator

#### Parameters

##### value

`string`

#### Returns

value is "eq" \| "neq" \| "gt" \| "gte" \| "lt" \| "lte" \| "contains" \| "startsWith" \| "endsWith" \| "in" \| "notIn" \| "between" \| "isNull" \| "isNotNull"

***

### parseFilterOperator()

> **parseFilterOperator**(`key`): [`ParsedFilter`](#parsedfilter)

Defined in: [utils/filterOperators.ts:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L61)

Parse a filter key into field name and operator
Handles keys like 'age_gt', 'name_contains', 'status' (defaults to eq)

#### Parameters

##### key

`string`

Filter key to parse

#### Returns

[`ParsedFilter`](#parsedfilter)

Parsed filter with field and operator

#### Example

```ts
parseFilterOperator('age_gt') // { field: 'age', operator: 'gt' }
parseFilterOperator('name_contains') // { field: 'name', operator: 'contains' }
parseFilterOperator('status') // { field: 'status', operator: 'eq' }
```

***

### buildFilterKey()

> **buildFilterKey**(`field`, `operator`): `string`

Defined in: [utils/filterOperators.ts:92](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L92)

Build a filter key from field name and operator
For 'eq' operator, returns just the field name (default behavior)

#### Parameters

##### field

`string`

Field name

##### operator

Filter operator

`"eq"` | `"neq"` | `"gt"` | `"gte"` | `"lt"` | `"lte"` | `"contains"` | `"startsWith"` | `"endsWith"` | `"in"` | `"notIn"` | `"between"` | `"isNull"` | `"isNotNull"`

#### Returns

`string`

Filter key string

#### Example

```ts
buildFilterKey('age', 'gt') // 'age_gt'
buildFilterKey('status', 'eq') // 'status'
```

***

### extractOperatorFromKey()

> **extractOperatorFromKey**(`key`): `"eq"` \| `"neq"` \| `"gt"` \| `"gte"` \| `"lt"` \| `"lte"` \| `"contains"` \| `"startsWith"` \| `"endsWith"` \| `"in"` \| `"notIn"` \| `"between"` \| `"isNull"` \| `"isNotNull"`

Defined in: [utils/filterOperators.ts:105](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L105)

Extract just the operator from a filter key

#### Parameters

##### key

`string`

Filter key

#### Returns

`"eq"` \| `"neq"` \| `"gt"` \| `"gte"` \| `"lt"` \| `"lte"` \| `"contains"` \| `"startsWith"` \| `"endsWith"` \| `"in"` \| `"notIn"` \| `"between"` \| `"isNull"` \| `"isNotNull"`

The operator or 'eq' if no operator suffix found

***

### isOperatorFilter()

> **isOperatorFilter**(`key`): `boolean`

Defined in: [utils/filterOperators.ts:120](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L120)

Check if a filter key has an operator suffix

#### Parameters

##### key

`string`

Filter key to check

#### Returns

`boolean`

true if the key has an operator suffix

***

### applyFilterOperator()

> **applyFilterOperator**(`itemValue`, `operator`, `filterValue`): `boolean`

Defined in: [utils/filterOperators.ts:142](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L142)

Apply a filter operator to compare an item value against a filter value

#### Parameters

##### itemValue

`unknown`

The value from the item/record

##### operator

The filter operator to apply

`"eq"` | `"neq"` | `"gt"` | `"gte"` | `"lt"` | `"lte"` | `"contains"` | `"startsWith"` | `"endsWith"` | `"in"` | `"notIn"` | `"between"` | `"isNull"` | `"isNotNull"`

##### filterValue

`unknown`

The filter value to compare against

#### Returns

`boolean`

true if the item matches the filter

#### Example

```ts
applyFilterOperator(100, 'gt', 50) // true
applyFilterOperator('Hello World', 'contains', 'World') // true
applyFilterOperator('active', 'in', ['active', 'pending']) // true
```

***

### applyFiltersWithOperators()

> **applyFiltersWithOperators**\<`T`\>(`items`, `filter`): `T`[]

Defined in: [utils/filterOperators.ts:335](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L335)

Process a filter object and apply operators to filter items

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### items

`T`[]

Array of items to filter

##### filter

`Record`\<`string`, `unknown`\>

Filter object with field_operator keys

#### Returns

`T`[]

Filtered array of items

#### Example

```ts
const items = [{ age: 30, name: 'John' }, { age: 25, name: 'Jane' }]
applyFiltersWithOperators(items, { age_gt: 27 }) // [{ age: 30, name: 'John' }]
```

***

### getOperatorsForType()

> **getOperatorsForType**(`type`): (`"eq"` \| `"neq"` \| `"gt"` \| `"gte"` \| `"lt"` \| `"lte"` \| `"contains"` \| `"startsWith"` \| `"endsWith"` \| `"in"` \| `"notIn"` \| `"between"` \| `"isNull"` \| `"isNotNull"`)[]

Defined in: [utils/filterOperators.ts:397](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L397)

Get available operators for a given input type

#### Parameters

##### type

[`OperatorType`](#operatortype)

#### Returns

(`"eq"` \| `"neq"` \| `"gt"` \| `"gte"` \| `"lt"` \| `"lte"` \| `"contains"` \| `"startsWith"` \| `"endsWith"` \| `"in"` \| `"notIn"` \| `"between"` \| `"isNull"` \| `"isNotNull"`)[]

***

### isObject()

> **isObject**(`value`): `value is Record<string, unknown>`

Defined in: [utils/type-guards.ts:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L19)

Check if a value is a non-null object

#### Parameters

##### value

`unknown`

#### Returns

`value is Record<string, unknown>`

***

### isString()

> **isString**(`value`): `value is string`

Defined in: [utils/type-guards.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L26)

Check if a value is a string

#### Parameters

##### value

`unknown`

#### Returns

`value is string`

***

### isNumber()

> **isNumber**(`value`): `value is number`

Defined in: [utils/type-guards.ts:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L33)

Check if a value is a number

#### Parameters

##### value

`unknown`

#### Returns

`value is number`

***

### isBoolean()

> **isBoolean**(`value`): `value is boolean`

Defined in: [utils/type-guards.ts:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L40)

Check if a value is a boolean

#### Parameters

##### value

`unknown`

#### Returns

`value is boolean`

***

### isFunction()

> **isFunction**(`value`): `value is (args: unknown[]) => unknown`

Defined in: [utils/type-guards.ts:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L47)

Check if a value is a function

#### Parameters

##### value

`unknown`

#### Returns

`value is (args: unknown[]) => unknown`

***

### isIdentifier()

> **isIdentifier**(`value`): `value is Identifier`

Defined in: [utils/type-guards.ts:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L54)

Check if a value is a valid Identifier (string or number)

#### Parameters

##### value

`unknown`

#### Returns

`value is Identifier`

***

### hasHttpStatus()

> **hasHttpStatus**(`error`): `error is { status: number }`

Defined in: [utils/type-guards.ts:74](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L74)

Check if an error has an HTTP status code

#### Parameters

##### error

`unknown`

#### Returns

`error is { status: number }`

***

### getErrorStatus()

> **getErrorStatus**(`error`): `number` \| `undefined`

Defined in: [utils/type-guards.ts:89](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L89)

Get HTTP status from an error, or undefined if not present

#### Parameters

##### error

`unknown`

#### Returns

`number` \| `undefined`

***

### hasErrorCode()

> **hasErrorCode**(`error`): `error is { code: string }`

Defined in: [utils/type-guards.ts:107](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L107)

Check if an error has a code property

#### Parameters

##### error

`unknown`

#### Returns

`error is { code: string }`

***

### getErrorCode()

> **getErrorCode**(`error`): `string` \| `undefined`

Defined in: [utils/type-guards.ts:114](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L114)

Get error code from an error, or undefined if not present

#### Parameters

##### error

`unknown`

#### Returns

`string` \| `undefined`

***

### isFieldErrors()

> **isFieldErrors**(`value`): `value is FieldErrors`

Defined in: [utils/type-guards.ts:134](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L134)

Check if a value is a FieldErrors object
(Record<string, string[]>)

#### Parameters

##### value

`unknown`

#### Returns

`value is FieldErrors`

***

### hasBodyErrors()

> **hasBodyErrors**(`body`): `body is { errors: FieldErrors }`

Defined in: [utils/type-guards.ts:145](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L145)

Check if an error body contains field errors in the `errors` property

#### Parameters

##### body

`unknown`

#### Returns

`body is { errors: FieldErrors }`

***

### hasBodyFieldErrors()

> **hasBodyFieldErrors**(`body`): `body is { fieldErrors: FieldErrors }`

Defined in: [utils/type-guards.ts:153](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L153)

Check if an error body contains field errors in the `fieldErrors` property

#### Parameters

##### body

`unknown`

#### Returns

`body is { fieldErrors: FieldErrors }`

***

### isRaRecord()

> **isRaRecord**(`value`): `value is RaRecord`

Defined in: [utils/type-guards.ts:193](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L193)

Check if a value is a RaRecord (has an id property)

#### Parameters

##### value

`unknown`

#### Returns

`value is RaRecord`

***

### isRaRecordArray()

> **isRaRecordArray**(`value`): `value is RaRecord[]`

Defined in: [utils/type-guards.ts:200](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L200)

Check if a value is an array of RaRecords

#### Parameters

##### value

`unknown`

#### Returns

`value is RaRecord[]`

***

### isListResponse()

> **isListResponse**(`value`): `value is ListResponseShape<RaRecord>`

Defined in: [utils/type-guards.ts:219](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L219)

Check if a response is a list response

#### Parameters

##### value

`unknown`

#### Returns

`value is ListResponseShape<RaRecord>`

***

### isRecordResponse()

> **isRecordResponse**(`value`): `value is RecordResponseShape<RaRecord>`

Defined in: [utils/type-guards.ts:236](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L236)

Check if a response is a single record response

#### Parameters

##### value

`unknown`

#### Returns

`value is RecordResponseShape<RaRecord>`

***

### isStringArray()

> **isStringArray**(`value`): `value is string[]`

Defined in: [utils/type-guards.ts:249](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L249)

Check if a value is an array of strings (permissions)

#### Parameters

##### value

`unknown`

#### Returns

`value is string[]`

***

### isPermissionsObject()

> **isPermissionsObject**(`value`): `value is Record<string, boolean>`

Defined in: [utils/type-guards.ts:256](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L256)

Check if permissions is an object with boolean values

#### Parameters

##### value

`unknown`

#### Returns

`value is Record<string, boolean>`

***

### getStringProp()

> **getStringProp**(`obj`, `key`): `string` \| `undefined`

Defined in: [utils/type-guards.ts:268](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L268)

Safely get a string property from an unknown object

#### Parameters

##### obj

`unknown`

##### key

`string`

#### Returns

`string` \| `undefined`

***

### getNumberProp()

> **getNumberProp**(`obj`, `key`): `number` \| `undefined`

Defined in: [utils/type-guards.ts:277](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L277)

Safely get a number property from an unknown object

#### Parameters

##### obj

`unknown`

##### key

`string`

#### Returns

`number` \| `undefined`

***

### getArrayProp()

> **getArrayProp**\<`T`\>(`obj`, `key`, `itemGuard?`): `T`[] \| `undefined`

Defined in: [utils/type-guards.ts:286](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L286)

Safely get an array property from an unknown object

#### Type Parameters

##### T

`T`

#### Parameters

##### obj

`unknown`

##### key

`string`

##### itemGuard?

(`item`) => `item is T`

#### Returns

`T`[] \| `undefined`

***

### getObjectProp()

> **getObjectProp**(`obj`, `key`): `Record`\<`string`, `unknown`\> \| `undefined`

Defined in: [utils/type-guards.ts:301](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L301)

Safely get an object property from an unknown object

#### Parameters

##### obj

`unknown`

##### key

`string`

#### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

***

### hasIdParam()

> **hasIdParam**(`param`): `param is { id: Identifier }`

Defined in: [utils/type-guards.ts:314](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L314)

Check if a query key parameter contains an id

#### Parameters

##### param

`unknown`

#### Returns

`param is { id: Identifier }`

***

### getIdFromParam()

> **getIdFromParam**(`param`): `Identifier` \| `undefined`

Defined in: [utils/type-guards.ts:321](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L321)

Get id from a query key parameter, or undefined

#### Parameters

##### param

`unknown`

#### Returns

`Identifier` \| `undefined`

## Interfaces

### ButtonProps

Defined in: [components/Button.tsx:4](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/Button.tsx#L4)

#### Extends

- `ButtonHTMLAttributes`\<`HTMLButtonElement`\>

#### Properties

##### variant?

> `optional` **variant**: `"text"` \| `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/Button.tsx:6](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/Button.tsx#L6)

Button variant

##### size?

> `optional` **size**: `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/Button.tsx:8](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/Button.tsx#L8)

Button size

##### loading?

> `optional` **loading**: `boolean`

Defined in: [components/Button.tsx:10](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/Button.tsx#L10)

Loading state

##### label?

> `optional` **label**: `ReactNode`

Defined in: [components/Button.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/Button.tsx#L12)

Button label (rendered before children)

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/Button.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/Button.tsx#L14)

Button content

###### Overrides

`ButtonHTMLAttributes.children`

***

### LoginPageProps

Defined in: [components/auth/LoginPage.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LoginPage.tsx#L14)

Props for LoginPage component

#### Properties

##### title?

> `optional` **title**: `string`

Defined in: [components/auth/LoginPage.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LoginPage.tsx#L19)

Title displayed at the top of the login form

###### Default

```ts
"Sign In"
```

##### className?

> `optional` **className**: `string`

Defined in: [components/auth/LoginPage.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LoginPage.tsx#L23)

Custom class name for the login page container

##### redirectTo?

> `optional` **redirectTo**: `string`

Defined in: [components/auth/LoginPage.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LoginPage.tsx#L28)

Where to redirect after successful login

###### Default

```ts
"/"
```

##### backgroundImage?

> `optional` **backgroundImage**: `string`

Defined in: [components/auth/LoginPage.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LoginPage.tsx#L32)

Custom background image URL

##### showRememberMe?

> `optional` **showRememberMe**: `boolean`

Defined in: [components/auth/LoginPage.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LoginPage.tsx#L36)

Show a "Remember me" checkbox

##### submitButtonText?

> `optional` **submitButtonText**: `string`

Defined in: [components/auth/LoginPage.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LoginPage.tsx#L41)

Custom submit button text

###### Default

```ts
"Sign In"
```

##### loadingButtonText?

> `optional` **loadingButtonText**: `string`

Defined in: [components/auth/LoginPage.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LoginPage.tsx#L46)

Custom loading button text

###### Default

```ts
"Signing in..."
```

***

### LogoutButtonProps

Defined in: [components/auth/LogoutButton.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L13)

Props for LogoutButton component

#### Properties

##### label?

> `optional` **label**: `string`

Defined in: [components/auth/LogoutButton.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L18)

Button label text

###### Default

```ts
"Logout"
```

##### loadingLabel?

> `optional` **loadingLabel**: `string`

Defined in: [components/auth/LogoutButton.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L23)

Loading state label text

###### Default

```ts
"Logging out..."
```

##### className?

> `optional` **className**: `string`

Defined in: [components/auth/LogoutButton.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L27)

Custom class name for the button

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/auth/LogoutButton.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L31)

Icon element to display

##### iconOnly?

> `optional` **iconOnly**: `boolean`

Defined in: [components/auth/LogoutButton.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L35)

Show only the icon (no label)

##### redirectTo?

> `optional` **redirectTo**: `string` \| `false`

Defined in: [components/auth/LogoutButton.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L40)

Where to redirect after logout. Set to false to disable redirect

###### Default

```ts
"/login"
```

##### variant?

> `optional` **variant**: `"default"` \| `"destructive"` \| `"outline"` \| `"ghost"`

Defined in: [components/auth/LogoutButton.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L45)

Button variant style

###### Default

```ts
"default"
```

##### size?

> `optional` **size**: `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/auth/LogoutButton.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L50)

Button size

###### Default

```ts
"default"
```

##### confirmTitle?

> `optional` **confirmTitle**: `string`

Defined in: [components/auth/LogoutButton.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L54)

Confirmation dialog title. If provided, shows confirmation before logout

##### confirmMessage?

> `optional` **confirmMessage**: `string`

Defined in: [components/auth/LogoutButton.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L58)

Confirmation dialog message

##### onSuccess()?

> `optional` **onSuccess**: () => `void`

Defined in: [components/auth/LogoutButton.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L62)

Callback called on successful logout

###### Returns

`void`

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [components/auth/LogoutButton.tsx:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/auth/LogoutButton.tsx#L66)

Callback called on logout error

###### Parameters

###### error

`Error`

###### Returns

`void`

***

### BulkDeleteButtonProps

Defined in: [components/buttons/BulkDeleteButton.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L38)

Props for BulkDeleteButton component

#### Extends

- `ButtonHTMLAttributes`\<`HTMLButtonElement`\>

#### Properties

##### resource?

> `optional` **resource**: `string`

Defined in: [components/buttons/BulkDeleteButton.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L44)

The resource to delete from
If not provided, uses the resource from context

###### Overrides

`ButtonHTMLAttributes.resource`

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/BulkDeleteButton.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L49)

Button label

###### Default

```ts
'Delete'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/BulkDeleteButton.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L53)

Icon to display before the label

##### variant?

> `optional` **variant**: `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/buttons/BulkDeleteButton.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L58)

Button variant

###### Default

```ts
'destructive'
```

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/buttons/BulkDeleteButton.tsx:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L63)

Button size

###### Default

```ts
'default'
```

##### mutationMode?

> `optional` **mutationMode**: `MutationMode`

Defined in: [components/buttons/BulkDeleteButton.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L68)

Mutation mode (pessimistic, optimistic, undoable)

###### Default

```ts
'undoable'
```

##### onSuccess()?

> `optional` **onSuccess**: (`data`) => `void`

Defined in: [components/buttons/BulkDeleteButton.tsx:73](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L73)

Callback called after successful deletion

###### Parameters

###### data

Array of deleted record IDs (may be undefined depending on data provider)

`Identifier`[] | `undefined`

###### Returns

`void`

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [components/buttons/BulkDeleteButton.tsx:78](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L78)

Callback called on error

###### Parameters

###### error

`unknown`

The error that occurred during deletion

###### Returns

`void`

###### Overrides

`ButtonHTMLAttributes.onError`

##### mutationOptions?

> `optional` **mutationOptions**: `Omit`\<`Record`\<`string`, `unknown`\>, `"onSuccess"` \| `"onError"`\>

Defined in: [components/buttons/BulkDeleteButton.tsx:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L83)

Additional mutation options passed to the deleteMany mutation
Note: onSuccess and onError from mutationOptions are not used - use the component props instead

***

### BulkDeleteWithConfirmButtonProps

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L39)

Props for BulkDeleteWithConfirmButton component

#### Extends

- `ButtonHTMLAttributes`\<`HTMLButtonElement`\>

#### Properties

##### resource?

> `optional` **resource**: `string`

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L45)

The resource to delete from
If not provided, uses the resource from context

###### Overrides

`ButtonHTMLAttributes.resource`

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L50)

Button label

###### Default

```ts
'Delete'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L54)

Icon to display before the label

##### variant?

> `optional` **variant**: `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L59)

Button variant

###### Default

```ts
'destructive'
```

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L64)

Button size

###### Default

```ts
'default'
```

##### confirmTitle?

> `optional` **confirmTitle**: `ReactNode`

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L68)

Confirmation dialog title

##### confirmContent?

> `optional` **confirmContent**: `ReactNode`

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L72)

Confirmation dialog content

##### confirmColor?

> `optional` **confirmColor**: `"warning"` \| `"primary"`

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L77)

Confirmation dialog color

###### Default

```ts
'warning'
```

##### onSuccess()?

> `optional` **onSuccess**: (`data`) => `void`

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:82](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L82)

Callback called after successful deletion

###### Parameters

###### data

Array of deleted record IDs (may be undefined depending on data provider)

`Identifier`[] | `undefined`

###### Returns

`void`

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:87](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L87)

Callback called on error

###### Parameters

###### error

`unknown`

The error that occurred during deletion

###### Returns

`void`

###### Overrides

`ButtonHTMLAttributes.onError`

##### mutationOptions?

> `optional` **mutationOptions**: `Omit`\<`Record`\<`string`, `unknown`\>, `"onSuccess"` \| `"onError"`\>

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:92](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L92)

Additional mutation options passed to the deleteMany mutation
Note: onSuccess and onError from mutationOptions are not used - use the component props instead

***

### BulkExportButtonProps

Defined in: [components/buttons/BulkExportButton.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkExportButton.tsx#L38)

Props for BulkExportButton component

#### Extends

- `ButtonHTMLAttributes`\<`HTMLButtonElement`\>

#### Properties

##### resource?

> `optional` **resource**: `string`

Defined in: [components/buttons/BulkExportButton.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkExportButton.tsx#L43)

The resource to export
If not provided, uses the resource from context

###### Overrides

`ButtonHTMLAttributes.resource`

##### exporter?

> `optional` **exporter**: `Exporter`

Defined in: [components/buttons/BulkExportButton.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkExportButton.tsx#L48)

Custom exporter function
If not provided, uses the exporter from list context

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/BulkExportButton.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkExportButton.tsx#L53)

Button label

###### Default

```ts
'Export'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/BulkExportButton.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkExportButton.tsx#L57)

Icon to display before the label

##### variant?

> `optional` **variant**: `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/buttons/BulkExportButton.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkExportButton.tsx#L62)

Button variant

###### Default

```ts
'default'
```

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/buttons/BulkExportButton.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkExportButton.tsx#L67)

Button size

###### Default

```ts
'default'
```

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [components/buttons/BulkExportButton.tsx:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkExportButton.tsx#L71)

Additional metadata to pass to the exporter

***

### CloneButtonProps

Defined in: [components/buttons/CloneButton.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CloneButton.tsx#L48)

Props for CloneButton component

#### Extends

- `LinkCompatibleProps`

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### record?

> `optional` **record**: `Record`\<`string`, `unknown`\> \| `RecordType`

Defined in: [components/buttons/CloneButton.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CloneButton.tsx#L55)

The record to clone or partial record with initial values.
Can be a full record from context (with id) or just initial field values (without id).
If not provided, uses the record from context.

##### resource?

> `optional` **resource**: `string`

Defined in: [components/buttons/CloneButton.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CloneButton.tsx#L60)

The resource to create
If not provided, uses the resource from context

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/CloneButton.tsx:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CloneButton.tsx#L65)

Button label

###### Default

```ts
'Clone'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/CloneButton.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CloneButton.tsx#L69)

Icon to display before the label

##### variant?

> `optional` **variant**: `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/buttons/CloneButton.tsx:74](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CloneButton.tsx#L74)

Button variant

###### Default

```ts
'default'
```

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/buttons/CloneButton.tsx:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CloneButton.tsx#L79)

Button size

###### Default

```ts
'default'
```

##### scrollToTop?

> `optional` **scrollToTop**: `boolean`

Defined in: [components/buttons/CloneButton.tsx:84](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CloneButton.tsx#L84)

Whether to scroll to top after navigation

###### Default

```ts
true
```

***

### ColumnsButtonProps

Defined in: [components/buttons/ColumnsButton.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ColumnsButton.tsx#L13)

Props for ColumnsButton component

#### Extends

- `Omit`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>, `"type"`\>

#### Properties

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/ColumnsButton.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ColumnsButton.tsx#L15)

Button label

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/ColumnsButton.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ColumnsButton.tsx#L17)

Icon to display

##### className?

> `optional` **className**: `string`

Defined in: [components/buttons/ColumnsButton.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ColumnsButton.tsx#L19)

Additional CSS class name

###### Overrides

`Omit.className`

##### preferenceKey?

> `optional` **preferenceKey**: `string`

Defined in: [components/buttons/ColumnsButton.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ColumnsButton.tsx#L21)

Preference key for storing column configuration

***

### CreateButtonProps

Defined in: [components/buttons/CreateButton.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CreateButton.tsx#L38)

Props for CreateButton component

#### Extends

- `Omit`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>, `"type"`\>

#### Properties

##### resource?

> `optional` **resource**: `string`

Defined in: [components/buttons/CreateButton.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CreateButton.tsx#L43)

The resource to create
If not provided, uses the resource from context

###### Overrides

`Omit.resource`

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/CreateButton.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CreateButton.tsx#L48)

Button label

###### Default

```ts
'Create'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/CreateButton.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CreateButton.tsx#L52)

Icon to display before the label

##### variant?

> `optional` **variant**: `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/buttons/CreateButton.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CreateButton.tsx#L57)

Button variant

###### Default

```ts
'default'
```

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/buttons/CreateButton.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CreateButton.tsx#L62)

Button size

###### Default

```ts
'default'
```

##### scrollToTop?

> `optional` **scrollToTop**: `boolean`

Defined in: [components/buttons/CreateButton.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CreateButton.tsx#L67)

Whether to scroll to top after navigation

###### Default

```ts
true
```

##### to?

> `optional` **to**: `To`

Defined in: [components/buttons/CreateButton.tsx:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CreateButton.tsx#L71)

Custom path to navigate to

***

### DeleteWithConfirmButtonProps

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L47)

Props for DeleteWithConfirmButton component

#### Extends

- `ButtonHTMLAttributes`\<`HTMLButtonElement`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### record?

> `optional` **record**: `RecordType`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L53)

The record to delete
If not provided, uses the record from context

##### resource?

> `optional` **resource**: `string`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L58)

The resource to delete from
If not provided, uses the resource from context

###### Overrides

`ButtonHTMLAttributes.resource`

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L63)

Button label

###### Default

```ts
'Delete'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L67)

Icon to display before the label

##### variant?

> `optional` **variant**: `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L72)

Button variant

###### Default

```ts
'destructive'
```

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L77)

Button size

###### Default

```ts
'default'
```

##### confirmTitle?

> `optional` **confirmTitle**: `ReactNode`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L81)

Confirmation dialog title

##### confirmContent?

> `optional` **confirmContent**: `ReactNode`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L85)

Confirmation dialog content

##### confirmColor?

> `optional` **confirmColor**: `"warning"` \| `"primary"`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:90](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L90)

Confirmation dialog color

###### Default

```ts
'warning'
```

##### redirect?

> `optional` **redirect**: `string` \| `false`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:95](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L95)

Where to redirect after deletion

###### Default

```ts
'list'
```

##### onSuccess()?

> `optional` **onSuccess**: (`data`) => `void`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:100](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L100)

Callback called after successful deletion

###### Parameters

###### data

The deleted record (may be undefined depending on data provider)

`RecordType` | `undefined`

###### Returns

`void`

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:105](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L105)

Callback called on error

###### Parameters

###### error

`unknown`

The error that occurred during deletion

###### Returns

`void`

###### Overrides

`ButtonHTMLAttributes.onError`

##### mutationOptions?

> `optional` **mutationOptions**: `Omit`\<`Record`\<`string`, `unknown`\>, `"onSuccess"` \| `"onError"`\>

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:110](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L110)

Additional mutation options passed to the delete mutation
Note: onSuccess and onError from mutationOptions are not used - use the component props instead

***

### EditButtonProps

Defined in: [components/buttons/EditButton.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/EditButton.tsx#L56)

Props for EditButton component

#### Extends

- `LinkCompatibleProps`

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### record?

> `optional` **record**: `RecordType`

Defined in: [components/buttons/EditButton.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/EditButton.tsx#L62)

The record to edit
If not provided, uses the record from context

##### resource?

> `optional` **resource**: `string`

Defined in: [components/buttons/EditButton.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/EditButton.tsx#L67)

The resource to edit
If not provided, uses the resource from context

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/EditButton.tsx:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/EditButton.tsx#L72)

Button label

###### Default

```ts
'Edit'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/EditButton.tsx:76](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/EditButton.tsx#L76)

Icon to display before the label

##### variant?

> `optional` **variant**: `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/buttons/EditButton.tsx:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/EditButton.tsx#L81)

Button variant

###### Default

```ts
'default'
```

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/buttons/EditButton.tsx:86](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/EditButton.tsx#L86)

Button size

###### Default

```ts
'default'
```

##### scrollToTop?

> `optional` **scrollToTop**: `boolean`

Defined in: [components/buttons/EditButton.tsx:91](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/EditButton.tsx#L91)

Whether to scroll to top after navigation

###### Default

```ts
true
```

##### to?

> `optional` **to**: `To`

Defined in: [components/buttons/EditButton.tsx:95](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/EditButton.tsx#L95)

Custom path to navigate to

***

### ExportButtonProps

Defined in: [components/buttons/ExportButton.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ExportButton.tsx#L38)

Props for ExportButton component

#### Extends

- `ButtonHTMLAttributes`\<`HTMLButtonElement`\>

#### Properties

##### resource?

> `optional` **resource**: `string`

Defined in: [components/buttons/ExportButton.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ExportButton.tsx#L43)

The resource to export
If not provided, uses the resource from context

###### Overrides

`ButtonHTMLAttributes.resource`

##### exporter?

> `optional` **exporter**: `Exporter`

Defined in: [components/buttons/ExportButton.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ExportButton.tsx#L48)

Custom exporter function
If not provided, uses the exporter from list context

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/ExportButton.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ExportButton.tsx#L53)

Button label

###### Default

```ts
'Export'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/ExportButton.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ExportButton.tsx#L57)

Icon to display before the label

##### variant?

> `optional` **variant**: `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/buttons/ExportButton.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ExportButton.tsx#L62)

Button variant

###### Default

```ts
'default'
```

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/buttons/ExportButton.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ExportButton.tsx#L67)

Button size

###### Default

```ts
'default'
```

##### maxResults?

> `optional` **maxResults**: `number`

Defined in: [components/buttons/ExportButton.tsx:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ExportButton.tsx#L72)

Maximum number of records to export

###### Default

```ts
1000
```

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [components/buttons/ExportButton.tsx:76](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ExportButton.tsx#L76)

Additional metadata to pass to the exporter

***

### FilterDefinition

Defined in: [components/buttons/FilterButton.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L23)

Filter definition for available filters

#### Properties

##### source

> **source**: `string`

Defined in: [components/buttons/FilterButton.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L25)

Unique identifier for the filter (usually the source field name)

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/FilterButton.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L27)

Display label for the filter

***

### FilterButtonProps

Defined in: [components/buttons/FilterButton.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L33)

Props for FilterButton component

#### Extends

- `Omit`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>, `"children"`\>

#### Properties

##### filters?

> `optional` **filters**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[] \| [`FilterDefinition`](#filterdefinition)[]

Defined in: [components/buttons/FilterButton.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L38)

Available filters to show in dropdown.
Can be an array of FilterDefinition objects or React elements with 'source' props.

##### displayedFilters?

> `optional` **displayedFilters**: `string`[]

Defined in: [components/buttons/FilterButton.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L42)

Currently displayed filter sources (these will be hidden from dropdown)

##### disabledFilters?

> `optional` **disabledFilters**: `string`[]

Defined in: [components/buttons/FilterButton.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L46)

Disabled filter sources (shown but not clickable)

##### onAddFilter()?

> `optional` **onAddFilter**: (`source`) => `void`

Defined in: [components/buttons/FilterButton.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L50)

Callback when a filter is selected to be added

###### Parameters

###### source

`string`

###### Returns

`void`

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/FilterButton.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L55)

Button label

###### Default

```ts
'Add filter'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/FilterButton.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L59)

Icon to display in the button

##### variant?

> `optional` **variant**: `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/buttons/FilterButton.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L64)

Button variant

###### Default

```ts
'outline'
```

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/buttons/FilterButton.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/FilterButton.tsx#L69)

Button size

###### Default

```ts
'default'
```

***

### InPlaceEditorProps

Defined in: [components/buttons/InPlaceEditor.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InPlaceEditor.tsx#L13)

Props for InPlaceEditor component

#### Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/buttons/InPlaceEditor.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InPlaceEditor.tsx#L15)

The field source (property name) in the record

##### label?

> `optional` **label**: `ReactNode`

Defined in: [components/buttons/InPlaceEditor.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InPlaceEditor.tsx#L17)

Custom label for the field

##### className?

> `optional` **className**: `string`

Defined in: [components/buttons/InPlaceEditor.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InPlaceEditor.tsx#L19)

Additional CSS class name

###### Overrides

`HTMLAttributes.className`

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/buttons/InPlaceEditor.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InPlaceEditor.tsx#L21)

Children (optional, typically the field display component)

###### Overrides

`HTMLAttributes.children`

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/buttons/InPlaceEditor.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InPlaceEditor.tsx#L23)

Whether the editor is disabled

##### sx?

> `optional` **sx**: `unknown`

Defined in: [components/buttons/InPlaceEditor.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InPlaceEditor.tsx#L25)

MUI sx prop for custom styling

***

### InspectorButtonProps

Defined in: [components/buttons/InspectorButton.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InspectorButton.tsx#L13)

Props for InspectorButton component

#### Extends

- `Omit`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>, `"type"`\>

#### Properties

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/InspectorButton.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InspectorButton.tsx#L15)

Button label

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/InspectorButton.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InspectorButton.tsx#L17)

Icon to display

##### className?

> `optional` **className**: `string`

Defined in: [components/buttons/InspectorButton.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/InspectorButton.tsx#L19)

Additional CSS class name

###### Overrides

`Omit.className`

***

### ShowButtonProps

Defined in: [components/buttons/ShowButton.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ShowButton.tsx#L47)

Props for ShowButton component

#### Extends

- `Omit`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>, `"type"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### record?

> `optional` **record**: `RecordType`

Defined in: [components/buttons/ShowButton.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ShowButton.tsx#L53)

The record to show
If not provided, uses the record from context

##### resource?

> `optional` **resource**: `string`

Defined in: [components/buttons/ShowButton.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ShowButton.tsx#L58)

The resource to show
If not provided, uses the resource from context

###### Overrides

`Omit.resource`

##### label?

> `optional` **label**: `string`

Defined in: [components/buttons/ShowButton.tsx:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ShowButton.tsx#L63)

Button label

###### Default

```ts
'Show'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/buttons/ShowButton.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ShowButton.tsx#L67)

Icon to display before the label

##### variant?

> `optional` **variant**: `"link"` \| `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"`

Defined in: [components/buttons/ShowButton.tsx:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ShowButton.tsx#L72)

Button variant

###### Default

```ts
'default'
```

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/buttons/ShowButton.tsx:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ShowButton.tsx#L77)

Button size

###### Default

```ts
'default'
```

##### scrollToTop?

> `optional` **scrollToTop**: `boolean`

Defined in: [components/buttons/ShowButton.tsx:82](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ShowButton.tsx#L82)

Whether to scroll to top after navigation

###### Default

```ts
true
```

##### to?

> `optional` **to**: `To`

Defined in: [components/buttons/ShowButton.tsx:86](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ShowButton.tsx#L86)

Custom path to navigate to

***

### ResourceRegistrationContextValue

Defined in: [components/core/Resource.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/Resource.tsx#L13)

#### Properties

##### register()

> **register**: (`definition`, `props`) => `void`

Defined in: [components/core/Resource.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/Resource.tsx#L14)

###### Parameters

###### definition

`ResourceDefinition`

###### props

`ResourceProps`

###### Returns

`void`

##### unregister()

> **unregister**: (`name`) => `void`

Defined in: [components/core/Resource.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/Resource.tsx#L15)

###### Parameters

###### name

`string`

###### Returns

`void`

***

### LifecycleCallbackContext

Defined in: [components/core/extensions.ts:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L17)

Lifecycle callback context passed to before/after hooks

#### Extended by

- [`AfterLifecycleCallbackContext`](#afterlifecyclecallbackcontext)

#### Properties

##### resource

> **resource**: `string`

Defined in: [components/core/extensions.ts:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L18)

##### params

> **params**: `unknown`

Defined in: [components/core/extensions.ts:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L19)

##### dataProvider

> **dataProvider**: `DataProvider`

Defined in: [components/core/extensions.ts:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L20)

***

### AfterLifecycleCallbackContext

Defined in: [components/core/extensions.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L26)

Lifecycle callback context for after hooks (includes result)

#### Extends

- [`LifecycleCallbackContext`](#lifecyclecallbackcontext)

#### Properties

##### resource

> **resource**: `string`

Defined in: [components/core/extensions.ts:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L18)

###### Inherited from

[`LifecycleCallbackContext`](#lifecyclecallbackcontext).[`resource`](#resource-9)

##### params

> **params**: `unknown`

Defined in: [components/core/extensions.ts:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L19)

###### Inherited from

[`LifecycleCallbackContext`](#lifecyclecallbackcontext).[`params`](#params)

##### dataProvider

> **dataProvider**: `DataProvider`

Defined in: [components/core/extensions.ts:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L20)

###### Inherited from

[`LifecycleCallbackContext`](#lifecyclecallbackcontext).[`dataProvider`](#dataprovider)

##### result

> **result**: `unknown`

Defined in: [components/core/extensions.ts:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L27)

***

### ResourceLifecycleCallbacks

Defined in: [components/core/extensions.ts:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L33)

Resource lifecycle callback configuration

#### Properties

##### resource

> **resource**: `string`

Defined in: [components/core/extensions.ts:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L34)

##### beforeCreate()?

> `optional` **beforeCreate**: (`context`) => `unknown`

Defined in: [components/core/extensions.ts:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L35)

###### Parameters

###### context

[`LifecycleCallbackContext`](#lifecyclecallbackcontext)

###### Returns

`unknown`

##### afterCreate()?

> `optional` **afterCreate**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [components/core/extensions.ts:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L36)

###### Parameters

###### context

[`AfterLifecycleCallbackContext`](#afterlifecyclecallbackcontext)

###### Returns

`void` \| `Promise`\<`void`\>

##### beforeUpdate()?

> `optional` **beforeUpdate**: (`context`) => `unknown`

Defined in: [components/core/extensions.ts:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L37)

###### Parameters

###### context

[`LifecycleCallbackContext`](#lifecyclecallbackcontext)

###### Returns

`unknown`

##### afterUpdate()?

> `optional` **afterUpdate**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [components/core/extensions.ts:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L38)

###### Parameters

###### context

[`AfterLifecycleCallbackContext`](#afterlifecyclecallbackcontext)

###### Returns

`void` \| `Promise`\<`void`\>

##### beforeDelete()?

> `optional` **beforeDelete**: (`context`) => `unknown`

Defined in: [components/core/extensions.ts:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L39)

###### Parameters

###### context

[`LifecycleCallbackContext`](#lifecyclecallbackcontext)

###### Returns

`unknown`

##### afterDelete()?

> `optional` **afterDelete**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [components/core/extensions.ts:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L40)

###### Parameters

###### context

[`AfterLifecycleCallbackContext`](#afterlifecyclecallbackcontext)

###### Returns

`void` \| `Promise`\<`void`\>

##### beforeGetList()?

> `optional` **beforeGetList**: (`context`) => `unknown`

Defined in: [components/core/extensions.ts:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L41)

###### Parameters

###### context

[`LifecycleCallbackContext`](#lifecyclecallbackcontext)

###### Returns

`unknown`

##### afterGetList()?

> `optional` **afterGetList**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [components/core/extensions.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L42)

###### Parameters

###### context

[`AfterLifecycleCallbackContext`](#afterlifecyclecallbackcontext)

###### Returns

`void` \| `Promise`\<`void`\>

##### beforeGetOne()?

> `optional` **beforeGetOne**: (`context`) => `unknown`

Defined in: [components/core/extensions.ts:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L43)

###### Parameters

###### context

[`LifecycleCallbackContext`](#lifecyclecallbackcontext)

###### Returns

`unknown`

##### afterGetOne()?

> `optional` **afterGetOne**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [components/core/extensions.ts:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L44)

###### Parameters

###### context

[`AfterLifecycleCallbackContext`](#afterlifecyclecallbackcontext)

###### Returns

`void` \| `Promise`\<`void`\>

***

### CellRendererProps

Defined in: [components/core/extensions.ts:287](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L287)

Cell renderer props for Datagrid

#### Type Parameters

##### T

`T` = `unknown`

#### Properties

##### record

> **record**: `T`

Defined in: [components/core/extensions.ts:288](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L288)

##### column

> **column**: `string`

Defined in: [components/core/extensions.ts:289](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L289)

##### value

> **value**: `unknown`

Defined in: [components/core/extensions.ts:290](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L290)

##### rowIndex

> **rowIndex**: `number`

Defined in: [components/core/extensions.ts:291](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L291)

***

### FieldWrapperProps

Defined in: [components/core/extensions.ts:297](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L297)

Field wrapper props for Form

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/core/extensions.ts:298](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L298)

##### source

> **source**: `string`

Defined in: [components/core/extensions.ts:299](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L299)

##### label?

> `optional` **label**: `string`

Defined in: [components/core/extensions.ts:300](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L300)

##### isRequired?

> `optional` **isRequired**: `boolean`

Defined in: [components/core/extensions.ts:301](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L301)

##### error?

> `optional` **error**: `string`

Defined in: [components/core/extensions.ts:302](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/extensions.ts#L302)

***

### CreateProps

Defined in: [components/create/Create.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/Create.tsx#L19)

Props for Create component
Combines CreateBase props (logic) with CreateView props (UI)

#### Extends

- `Omit`\<`CreateBaseProps`\<`RecordType`, `TData`\>, `"children"`\>.`Pick`\<[`CreateViewProps`](#createviewprops), `"actions"` \| `"className"` \| `"aside"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TData

`TData` = `Record`\<`string`, `unknown`\>

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/create/Create.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/Create.tsx#L25)

Child elements to render inside the create form (typically SimpleForm)

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/create/Create.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/Create.tsx#L27)

Title to display in the create header

##### resource?

> `optional` **resource**: `string`

Defined in: [components/create/CreateBase.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateBase.tsx#L52)

The name of the resource to create. If not provided, uses ResourceContext

###### Inherited from

`Omit.resource`

##### redirect?

> `optional` **redirect**: [`RedirectTo`](#redirectto-4)

Defined in: [components/create/CreateBase.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateBase.tsx#L56)

Where to redirect after successful create. Defaults to 'list'

###### Inherited from

`Omit.redirect`

##### transform?

> `optional` **transform**: `TransformData`\<`TData`\>

Defined in: [components/create/CreateBase.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateBase.tsx#L58)

Function to transform data before submission

###### Inherited from

`Omit.transform`

##### mutationOptions?

> `optional` **mutationOptions**: [`UseCreateOptions`](#usecreateoptions)\<`RecordType`, `TData`\>

Defined in: [components/create/CreateBase.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateBase.tsx#L60)

Mutation options passed to useCreate

###### Inherited from

`Omit.mutationOptions`

##### disableSuccessNotification?

> `optional` **disableSuccessNotification**: `boolean`

Defined in: [components/create/CreateBase.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateBase.tsx#L62)

Disable the success notification

###### Inherited from

`Omit.disableSuccessNotification`

##### disableErrorNotification?

> `optional` **disableErrorNotification**: `boolean`

Defined in: [components/create/CreateBase.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateBase.tsx#L64)

Disable the error notification

###### Inherited from

`Omit.disableErrorNotification`

##### onBeforeSave()?

> `optional` **onBeforeSave**: (`context`) => `false` \| `void` \| `TData` \| `Promise`\<`false` \| `void` \| `TData`\>

Defined in: [components/create/CreateBase.tsx:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateBase.tsx#L66)

Called before save - can modify data or abort by returning false or throwing

###### Parameters

###### context

`CreateBeforeSaveContext`\<`TData`\>

###### Returns

`false` \| `void` \| `TData` \| `Promise`\<`false` \| `void` \| `TData`\>

###### Inherited from

`Omit.onBeforeSave`

##### onAfterSave()?

> `optional` **onAfterSave**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [components/create/CreateBase.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateBase.tsx#L68)

Called after successful save

###### Parameters

###### context

`CreateAfterSaveContext`\<`RecordType`, `TData`\>

###### Returns

`void` \| `Promise`\<`void`\>

###### Inherited from

`Omit.onAfterSave`

##### actions?

> `optional` **actions**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/create/CreateView.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateView.tsx#L22)

Custom actions component (e.g., Cancel button)

###### Inherited from

[`CreateViewProps`](#createviewprops).[`actions`](#actions-1)

##### className?

> `optional` **className**: `string`

Defined in: [components/create/CreateView.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateView.tsx#L24)

Additional CSS class name

###### Inherited from

[`CreateViewProps`](#createviewprops).[`className`](#classname-6)

##### aside?

> `optional` **aside**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/create/CreateView.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateView.tsx#L26)

Aside content

###### Inherited from

[`CreateViewProps`](#createviewprops).[`aside`](#aside-1)

***

### CreateContextValue

Defined in: [components/create/CreateContext.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L26)

Context value for Create components

#### Type Parameters

##### TData

`TData` = `Record`\<`string`, `unknown`\>

#### Properties

##### resource

> **resource**: `string`

Defined in: [components/create/CreateContext.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L28)

The resource name

##### save

> **save**: `SaveHandler`\<`TData`\>

Defined in: [components/create/CreateContext.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L30)

Function to save the record

##### saving

> **saving**: `boolean`

Defined in: [components/create/CreateContext.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L32)

Whether a save operation is in progress

##### error

> **error**: `Error` \| `null`

Defined in: [components/create/CreateContext.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L34)

Error from the last save attempt

##### reset()

> **reset**: () => `void`

Defined in: [components/create/CreateContext.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L36)

Reset the error state

###### Returns

`void`

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/create/CreateContext.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L38)

The created record (available after successful save)

***

### CreateContextProviderProps

Defined in: [components/create/CreateContext.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L51)

Props for CreateContextProvider

#### Type Parameters

##### TData

`TData` = `Record`\<`string`, `unknown`\>

#### Properties

##### value

> **value**: [`CreateContextValue`](#createcontextvalue)\<`TData`\>

Defined in: [components/create/CreateContext.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L52)

##### children

> **children**: `ReactNode`

Defined in: [components/create/CreateContext.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateContext.tsx#L53)

***

### CreateViewProps

Defined in: [components/create/CreateView.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateView.tsx#L16)

Props for CreateView component

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/create/CreateView.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateView.tsx#L18)

Child elements to render inside the create container

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/create/CreateView.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateView.tsx#L20)

Title to display in the create header

##### actions?

> `optional` **actions**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/create/CreateView.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateView.tsx#L22)

Custom actions component (e.g., Cancel button)

##### className?

> `optional` **className**: `string`

Defined in: [components/create/CreateView.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateView.tsx#L24)

Additional CSS class name

##### aside?

> `optional` **aside**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/create/CreateView.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/create/CreateView.tsx#L26)

Aside content

***

### EditProps

Defined in: [components/edit/Edit.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/Edit.tsx#L56)

Props for Edit component
Combines EditBase props (logic) with EditView props (UI)

#### Extends

- `Omit`\<`EditBaseProps`\<`RecordType`\>, `"children"` \| `"id"`\>.`Pick`\<[`EditViewProps`](#editviewprops), `"actions"` \| `"aside"` \| `"className"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### id?

> `optional` **id**: `Identifier`

Defined in: [components/edit/Edit.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/Edit.tsx#L60)

The record ID to edit. If not provided, will be inferred from route params

##### children

> **children**: `ReactNode`

Defined in: [components/edit/Edit.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/Edit.tsx#L62)

Child elements to render inside the edit form

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/edit/Edit.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/Edit.tsx#L64)

Title to display in the edit header

##### loading?

> `optional` **loading**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/edit/Edit.tsx:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/Edit.tsx#L66)

Custom loading component

##### error?

> `optional` **error**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/edit/Edit.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/Edit.tsx#L68)

Custom error component

##### empty?

> `optional` **empty**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/edit/Edit.tsx:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/Edit.tsx#L70)

Component to display when record is not found

##### resource?

> `optional` **resource**: `string`

Defined in: [components/edit/EditBase.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditBase.tsx#L56)

The name of the resource to fetch. If not provided, uses ResourceContext

###### Inherited from

`Omit.resource`

##### mutationMode?

> `optional` **mutationMode**: [`MutationMode`](#mutationmode-2)

Defined in: [components/edit/EditBase.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditBase.tsx#L62)

Mutation mode: pessimistic, optimistic, or undoable

###### Inherited from

`Omit.mutationMode`

##### redirect?

> `optional` **redirect**: `RedirectTo`

Defined in: [components/edit/EditBase.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditBase.tsx#L64)

Where to redirect after successful save

###### Inherited from

`Omit.redirect`

##### transform()?

> `optional` **transform**: (`data`) => `Record`\<`string`, `unknown`\> \| `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [components/edit/EditBase.tsx:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditBase.tsx#L66)

Transform function to modify data before saving

###### Parameters

###### data

`Record`\<`string`, `unknown`\>

###### Returns

`Record`\<`string`, `unknown`\> \| `Promise`\<`Record`\<`string`, `unknown`\>\>

###### Inherited from

`Omit.transform`

##### queryOptions?

> `optional` **queryOptions**: [`UseGetOneOptions`](#usegetoneoptions)\<`RecordType`\> & `object`

Defined in: [components/edit/EditBase.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditBase.tsx#L68)

React Query options for useGetOne

###### Type Declaration

###### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

###### Inherited from

`Omit.queryOptions`

##### mutationOptions?

> `optional` **mutationOptions**: `object`

Defined in: [components/edit/EditBase.tsx:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditBase.tsx#L70)

Mutation options for useUpdate

###### onSuccess()?

> `optional` **onSuccess**: (`data`, `variables`, `context`) => `void`

###### Parameters

###### data

`UpdateResult`\<`RecordType`\>

###### variables

`unknown`

###### context

`unknown`

###### Returns

`void`

###### onError()?

> `optional` **onError**: (`error`, `variables`, `context`) => `void`

###### Parameters

###### error

`Error`

###### variables

`unknown`

###### context

`unknown`

###### Returns

`void`

###### onSettled()?

> `optional` **onSettled**: (`data`, `error`, `variables`, `context`) => `void`

###### Parameters

###### data

`UpdateResult`\<`RecordType`\> | `undefined`

###### error

`Error` | `null`

###### variables

`unknown`

###### context

`unknown`

###### Returns

`void`

###### Inherited from

`Omit.mutationOptions`

##### disableAuthentication?

> `optional` **disableAuthentication**: `boolean`

Defined in: [components/edit/EditBase.tsx:76](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditBase.tsx#L76)

Whether to disable authentication check

###### Inherited from

`Omit.disableAuthentication`

##### onBeforeSave()?

> `optional` **onBeforeSave**: (`context`) => `false` \| `void` \| `Record`\<`string`, `unknown`\> \| `Promise`\<`false` \| `void` \| `Record`\<`string`, `unknown`\>\>

Defined in: [components/edit/EditBase.tsx:78](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditBase.tsx#L78)

Called before save - can modify data or abort by returning false or throwing

###### Parameters

###### context

`BeforeSaveContext`

###### Returns

`false` \| `void` \| `Record`\<`string`, `unknown`\> \| `Promise`\<`false` \| `void` \| `Record`\<`string`, `unknown`\>\>

###### Inherited from

`Omit.onBeforeSave`

##### onAfterSave()?

> `optional` **onAfterSave**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [components/edit/EditBase.tsx:80](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditBase.tsx#L80)

Called after successful save

###### Parameters

###### context

`AfterSaveContext`\<`RecordType`\>

###### Returns

`void` \| `Promise`\<`void`\>

###### Inherited from

`Omit.onAfterSave`

##### actions?

> `optional` **actions**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/edit/EditView.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L37)

Custom actions component (e.g., Delete button)

###### Inherited from

[`EditViewProps`](#editviewprops).[`actions`](#actions-3)

##### aside?

> `optional` **aside**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/edit/EditView.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L39)

Aside content (e.g., sidebar)

###### Inherited from

[`EditViewProps`](#editviewprops).[`aside`](#aside-3)

##### className?

> `optional` **className**: `string`

Defined in: [components/edit/EditView.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L41)

Additional CSS class name

###### Inherited from

[`EditViewProps`](#editviewprops).[`className`](#classname-9)

***

### EditActionsProps

Defined in: [components/edit/EditView.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L17)

Props for EditActions component
Used for customizing the actions toolbar in Edit views

#### Properties

##### className?

> `optional` **className**: `string`

Defined in: [components/edit/EditView.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L19)

Additional CSS class name

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/edit/EditView.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L21)

Child elements (action buttons)

##### hasShow?

> `optional` **hasShow**: `boolean`

Defined in: [components/edit/EditView.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L23)

Whether the resource has a show view

##### hasDelete?

> `optional` **hasDelete**: `boolean`

Defined in: [components/edit/EditView.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L25)

Whether the resource allows deletion

***

### EditViewProps

Defined in: [components/edit/EditView.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L31)

Props for EditView component

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/edit/EditView.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L33)

Child elements to render inside the edit container

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/edit/EditView.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L35)

Title to display in the edit header

##### actions?

> `optional` **actions**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/edit/EditView.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L37)

Custom actions component (e.g., Delete button)

##### aside?

> `optional` **aside**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/edit/EditView.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L39)

Aside content (e.g., sidebar)

##### className?

> `optional` **className**: `string`

Defined in: [components/edit/EditView.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/edit/EditView.tsx#L41)

Additional CSS class name

***

### ConfirmProps

Defined in: [components/feedback/Confirm.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L20)

Confirm component props

#### Properties

##### open

> **open**: `boolean`

Defined in: [components/feedback/Confirm.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L22)

Whether the dialog is open

##### onClose()

> **onClose**: () => `void`

Defined in: [components/feedback/Confirm.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L24)

Callback when dialog should close

###### Returns

`void`

##### onConfirm()

> **onConfirm**: () => `void` \| `Promise`\<`void`\>

Defined in: [components/feedback/Confirm.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L26)

Callback when confirm is clicked

###### Returns

`void` \| `Promise`\<`void`\>

##### title?

> `optional` **title**: `string`

Defined in: [components/feedback/Confirm.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L28)

Dialog title

##### message?

> `optional` **message**: `ReactNode`

Defined in: [components/feedback/Confirm.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L30)

Dialog message/content

##### confirmLabel?

> `optional` **confirmLabel**: `string`

Defined in: [components/feedback/Confirm.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L32)

Confirm button label

##### cancelLabel?

> `optional` **cancelLabel**: `string`

Defined in: [components/feedback/Confirm.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L34)

Cancel button label

##### confirmVariant?

> `optional` **confirmVariant**: `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"`

Defined in: [components/feedback/Confirm.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L36)

Confirm button variant

##### loading?

> `optional` **loading**: `boolean`

Defined in: [components/feedback/Confirm.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L38)

Loading state for async confirm operations

##### className?

> `optional` **className**: `string`

Defined in: [components/feedback/Confirm.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L40)

Additional CSS class for the dialog

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/feedback/Confirm.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Confirm.tsx#L42)

Children to render as custom content

***

### EmptyProps

Defined in: [components/feedback/Empty.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L19)

Empty component props

#### Properties

##### message?

> `optional` **message**: `string`

Defined in: [components/feedback/Empty.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L21)

Main message to display

##### description?

> `optional` **description**: `string`

Defined in: [components/feedback/Empty.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L23)

Secondary description text

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/feedback/Empty.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L25)

Icon type or custom icon component

##### actionLabel?

> `optional` **actionLabel**: `string`

Defined in: [components/feedback/Empty.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L27)

Action button text

##### onAction()?

> `optional` **onAction**: () => `void`

Defined in: [components/feedback/Empty.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L29)

Action button callback

###### Returns

`void`

##### actionVariant?

> `optional` **actionVariant**: `"default"` \| `"outline"` \| `"secondary"`

Defined in: [components/feedback/Empty.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L31)

Action button variant

##### resource?

> `optional` **resource**: `string`

Defined in: [components/feedback/Empty.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L33)

Resource name for auto-generated message

##### className?

> `optional` **className**: `string`

Defined in: [components/feedback/Empty.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L35)

Additional CSS class

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/feedback/Empty.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Empty.tsx#L37)

Children to render as custom content

***

### ErrorProps

Defined in: [components/feedback/Error.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Error.tsx#L19)

Error component props

#### Properties

##### error?

> `optional` **error**: `string` \| `Error`

Defined in: [components/feedback/Error.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Error.tsx#L21)

Error object or message string

##### title?

> `optional` **title**: `string`

Defined in: [components/feedback/Error.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Error.tsx#L23)

Custom title for the error

##### onRetry()?

> `optional` **onRetry**: () => `void`

Defined in: [components/feedback/Error.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Error.tsx#L25)

Callback when retry button is clicked

###### Returns

`void`

##### retryLabel?

> `optional` **retryLabel**: `string`

Defined in: [components/feedback/Error.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Error.tsx#L27)

Label for the retry button

##### resetErrorBoundary()?

> `optional` **resetErrorBoundary**: () => `void`

Defined in: [components/feedback/Error.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Error.tsx#L29)

Reset the error boundary

###### Returns

`void`

##### className?

> `optional` **className**: `string`

Defined in: [components/feedback/Error.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Error.tsx#L31)

Additional CSS class

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/feedback/Error.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Error.tsx#L33)

Children to render instead of default message

##### hideIcon?

> `optional` **hideIcon**: `boolean`

Defined in: [components/feedback/Error.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Error.tsx#L35)

Hide the error icon

***

### LoadingProps

Defined in: [components/feedback/Loading.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Loading.tsx#L17)

Loading component props

#### Properties

##### size?

> `optional` **size**: `"default"` \| `"sm"` \| `"lg"` \| `"xl"`

Defined in: [components/feedback/Loading.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Loading.tsx#L19)

Size variant of the spinner

##### text?

> `optional` **text**: `string`

Defined in: [components/feedback/Loading.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Loading.tsx#L21)

Optional text to display below the spinner

##### fullscreen?

> `optional` **fullscreen**: `boolean`

Defined in: [components/feedback/Loading.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Loading.tsx#L23)

Display as fullscreen overlay

##### className?

> `optional` **className**: `string`

Defined in: [components/feedback/Loading.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Loading.tsx#L25)

Custom CSS class for the spinner

##### containerClassName?

> `optional` **containerClassName**: `string`

Defined in: [components/feedback/Loading.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Loading.tsx#L27)

Custom CSS class for the container

##### color?

> `optional` **color**: `string`

Defined in: [components/feedback/Loading.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Loading.tsx#L29)

Primary color for the spinner

***

### NotificationToastProps

Defined in: [components/feedback/Notification.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L20)

Single notification toast props

#### Properties

##### id

> **id**: `string`

Defined in: [components/feedback/Notification.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L22)

Unique identifier

##### message

> **message**: `string`

Defined in: [components/feedback/Notification.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L24)

Notification message

##### type?

> `optional` **type**: [`NotificationType`](#notificationtype)

Defined in: [components/feedback/Notification.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L26)

Notification type/variant

##### autoHideDuration?

> `optional` **autoHideDuration**: `number`

Defined in: [components/feedback/Notification.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L28)

Duration in ms before auto-dismiss (0 = no auto-dismiss)

##### onDismiss()?

> `optional` **onDismiss**: (`id`) => `void`

Defined in: [components/feedback/Notification.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L30)

Callback when dismissed

###### Parameters

###### id

`string`

###### Returns

`void`

##### undoable?

> `optional` **undoable**: `boolean`

Defined in: [components/feedback/Notification.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L32)

Whether the notification supports undo

##### onUndo()?

> `optional` **onUndo**: () => `void`

Defined in: [components/feedback/Notification.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L34)

Callback when undo is clicked

###### Returns

`void`

##### className?

> `optional` **className**: `string`

Defined in: [components/feedback/Notification.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L36)

Additional CSS class

***

### NotificationContainerProps

Defined in: [components/feedback/Notification.tsx:283](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L283)

NotificationContainer props

#### Properties

##### notifications

> **notifications**: `object`[]

Defined in: [components/feedback/Notification.tsx:285](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L285)

Array of notifications to display

###### id

> **id**: `string`

###### message

> **message**: `string`

###### options?

> `optional` **options**: `object`

###### options.type?

> `optional` **type**: [`NotificationType`](#notificationtype)

###### options.autoHideDuration?

> `optional` **autoHideDuration**: `number`

###### options.undoable?

> `optional` **undoable**: `boolean`

###### options.onUndo()?

> `optional` **onUndo**: () => `void`

###### Returns

`void`

##### onDismiss()

> **onDismiss**: (`id`) => `void`

Defined in: [components/feedback/Notification.tsx:296](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L296)

Callback to dismiss a notification

###### Parameters

###### id

`string`

###### Returns

`void`

##### position?

> `optional` **position**: `"top-right"` \| `"top-left"` \| `"bottom-right"` \| `"bottom-left"` \| `"top-center"` \| `"bottom-center"`

Defined in: [components/feedback/Notification.tsx:298](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L298)

Position of the notification container

##### className?

> `optional` **className**: `string`

Defined in: [components/feedback/Notification.tsx:300](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/feedback/Notification.tsx#L300)

Additional CSS class

***

### ArrayFieldProps

Defined in: [components/field/ArrayField.tsx:7](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ArrayField.tsx#L7)

#### Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/ArrayField.tsx:9](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ArrayField.tsx#L9)

The field name in the record that contains the array

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/ArrayField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ArrayField.tsx#L11)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/ArrayField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ArrayField.tsx#L13)

Optional label to display above the array items

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/ArrayField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ArrayField.tsx#L20)

Text to display when array is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/field/ArrayField.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ArrayField.tsx#L22)

Children to render for each item in the array

###### Overrides

`HTMLAttributes.children`

***

### BooleanFieldProps

Defined in: [components/field/BooleanField.tsx:7](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/BooleanField.tsx#L7)

#### Extends

- `HTMLAttributes`\<`HTMLSpanElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/BooleanField.tsx:9](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/BooleanField.tsx#L9)

The field name in the record to display

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/BooleanField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/BooleanField.tsx#L11)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/BooleanField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/BooleanField.tsx#L13)

Optional label to display above the value

##### valueLabelTrue?

> `optional` **valueLabelTrue**: `string`

Defined in: [components/field/BooleanField.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/BooleanField.tsx#L15)

Label to display when value is true (replaces icon)

##### valueLabelFalse?

> `optional` **valueLabelFalse**: `string`

Defined in: [components/field/BooleanField.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/BooleanField.tsx#L17)

Label to display when value is false (replaces icon)

##### trueIconColor?

> `optional` **trueIconColor**: `string`

Defined in: [components/field/BooleanField.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/BooleanField.tsx#L19)

CSS class for true icon color

##### falseIconColor?

> `optional` **falseIconColor**: `string`

Defined in: [components/field/BooleanField.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/BooleanField.tsx#L21)

CSS class for false icon color

***

### ChipFieldProps

Defined in: [components/field/ChipField.tsx:7](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ChipField.tsx#L7)

#### Extends

- `HTMLAttributes`\<`HTMLSpanElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/ChipField.tsx:9](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ChipField.tsx#L9)

The field name in the record to display

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/ChipField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ChipField.tsx#L11)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/ChipField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ChipField.tsx#L13)

Optional label to display above the value

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/ChipField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ChipField.tsx#L20)

Text to display when value is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### variant?

> `optional` **variant**: `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"`

Defined in: [components/field/ChipField.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ChipField.tsx#L22)

Visual variant of the chip

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"`

Defined in: [components/field/ChipField.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ChipField.tsx#L24)

Size of the chip

##### clickable?

> `optional` **clickable**: `boolean`

Defined in: [components/field/ChipField.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ChipField.tsx#L26)

Whether the chip should appear clickable/interactive

***

### DateFieldProps

Defined in: [components/field/DateField.tsx:7](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/DateField.tsx#L7)

#### Extends

- `HTMLAttributes`\<`HTMLSpanElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/DateField.tsx:9](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/DateField.tsx#L9)

The field name in the record to display

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/DateField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/DateField.tsx#L11)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/DateField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/DateField.tsx#L13)

Optional label to display above the value

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/DateField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/DateField.tsx#L20)

Text to display when value is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### locales?

> `optional` **locales**: `string` \| `string`[]

Defined in: [components/field/DateField.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/DateField.tsx#L22)

Locale(s) to use for date formatting

##### options?

> `optional` **options**: `DateTimeFormatOptions`

Defined in: [components/field/DateField.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/DateField.tsx#L24)

Options for Intl.DateTimeFormat

##### showTime?

> `optional` **showTime**: `boolean`

Defined in: [components/field/DateField.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/DateField.tsx#L26)

Whether to show time in addition to date

***

### EmailFieldProps

Defined in: [components/field/EmailField.tsx:7](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/EmailField.tsx#L7)

#### Extends

- `AnchorHTMLAttributes`\<`HTMLAnchorElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/EmailField.tsx:9](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/EmailField.tsx#L9)

The field name in the record to display

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/EmailField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/EmailField.tsx#L11)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/EmailField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/EmailField.tsx#L13)

Optional label to display above the value

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/EmailField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/EmailField.tsx#L20)

Text to display when value is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

***

### FileValue

Defined in: [components/field/FileField.tsx:10](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L10)

File object type for FileField

#### Indexable

\[`key`: `string`\]: `unknown`

#### Properties

##### src?

> `optional` **src**: `string`

Defined in: [components/field/FileField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L11)

##### url?

> `optional` **url**: `string`

Defined in: [components/field/FileField.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L12)

##### title?

> `optional` **title**: `string`

Defined in: [components/field/FileField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L13)

***

### FileFieldProps

Defined in: [components/field/FileField.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L17)

#### Extends

- `Omit`\<`AnchorHTMLAttributes`\<`HTMLAnchorElement`\>, `"title"`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/FileField.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L19)

The field name in the record to display

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/FileField.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L21)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/FileField.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L23)

Optional label to display above the value

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/FileField.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L30)

Text to display when value is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### title?

> `optional` **title**: `string`

Defined in: [components/field/FileField.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L36)

Title for the link text.
If it matches a field name in the record/file object, uses that field's value.
Otherwise uses the string directly.

##### src?

> `optional` **src**: `string`

Defined in: [components/field/FileField.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L41)

For object/array sources, the field name containing the file URL.
Defaults to 'src', also checks 'url'.

##### download?

> `optional` **download**: `string` \| `boolean`

Defined in: [components/field/FileField.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FileField.tsx#L45)

Whether to download the file instead of opening it

###### Overrides

`Omit.download`

***

### FunctionFieldProps

Defined in: [components/field/FunctionField.tsx:6](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FunctionField.tsx#L6)

#### Extends

- `HTMLAttributes`\<`HTMLSpanElement`\>

#### Properties

##### render()

> **render**: (`record`) => `unknown`

Defined in: [components/field/FunctionField.tsx:8](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FunctionField.tsx#L8)

Function that receives the record and returns content to render

###### Parameters

###### record

`RaRecord` | `undefined`

###### Returns

`unknown`

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/FunctionField.tsx:10](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FunctionField.tsx#L10)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/FunctionField.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FunctionField.tsx#L12)

Optional label to display above the value

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/FunctionField.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/FunctionField.tsx#L19)

Text to display when render returns empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

***

### ImageFieldProps

Defined in: [components/field/ImageField.tsx:7](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ImageField.tsx#L7)

#### Extends

- `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"title"`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/ImageField.tsx:9](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ImageField.tsx#L9)

The field name in the record containing the image URL or array of images

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/ImageField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ImageField.tsx#L11)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/ImageField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ImageField.tsx#L13)

Optional label to display above the image

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/ImageField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ImageField.tsx#L20)

Text to display when value is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### title?

> `optional` **title**: `string`

Defined in: [components/field/ImageField.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ImageField.tsx#L26)

Title for the image alt text.
If it matches a field name in the record, uses that field's value.
Otherwise uses the string directly.

##### src?

> `optional` **src**: `string`

Defined in: [components/field/ImageField.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ImageField.tsx#L31)

For array sources, the field name in each item containing the image URL.
Defaults to 'src'.

##### sx?

> `optional` **sx**: `CSSProperties`

Defined in: [components/field/ImageField.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ImageField.tsx#L33)

Custom styles for the image element

***

### NumberFieldProps

Defined in: [components/field/NumberField.tsx:7](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/NumberField.tsx#L7)

#### Extends

- `HTMLAttributes`\<`HTMLSpanElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/NumberField.tsx:9](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/NumberField.tsx#L9)

The field name in the record to display

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/NumberField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/NumberField.tsx#L11)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/NumberField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/NumberField.tsx#L13)

Optional label to display above the value

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/NumberField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/NumberField.tsx#L20)

Text to display when value is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### locales?

> `optional` **locales**: `string` \| `string`[]

Defined in: [components/field/NumberField.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/NumberField.tsx#L22)

Locale(s) to use for number formatting

##### options?

> `optional` **options**: `NumberFormatOptions`

Defined in: [components/field/NumberField.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/NumberField.tsx#L24)

Options for Intl.NumberFormat

***

### RecordFieldProps

Defined in: [components/field/RecordField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RecordField.tsx#L13)

Props for RecordField component

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/RecordField.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RecordField.tsx#L15)

The field source (property name) in the record

##### field?

> `optional` **field**: `ComponentType`\<`any`\>

Defined in: [components/field/RecordField.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RecordField.tsx#L17)

Custom field component to render instead of the default behavior

##### label?

> `optional` **label**: `ReactNode`

Defined in: [components/field/RecordField.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RecordField.tsx#L19)

Custom label for the field

##### className?

> `optional` **className**: `string`

Defined in: [components/field/RecordField.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RecordField.tsx#L21)

Additional CSS class name

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/RecordField.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RecordField.tsx#L28)

Text to display when the value is empty.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/field/RecordField.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RecordField.tsx#L30)

Children to render (optional)

***

### ReferenceArrayFieldProps

Defined in: [components/field/ReferenceArrayField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceArrayField.tsx#L13)

#### Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/ReferenceArrayField.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceArrayField.tsx#L15)

The field name in the record that contains the array of reference IDs

##### reference

> **reference**: `string`

Defined in: [components/field/ReferenceArrayField.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceArrayField.tsx#L17)

The resource name to fetch the referenced records from

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/ReferenceArrayField.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceArrayField.tsx#L19)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/ReferenceArrayField.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceArrayField.tsx#L21)

Optional label to display above the values

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/ReferenceArrayField.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceArrayField.tsx#L28)

Text to display when the reference array is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/field/ReferenceArrayField.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceArrayField.tsx#L30)

Children to render for each referenced record

###### Overrides

`HTMLAttributes.children`

##### sort?

> `optional` **sort**: `object`

Defined in: [components/field/ReferenceArrayField.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceArrayField.tsx#L32)

Optional sort order for the referenced records

###### field

> **field**: `string`

###### order

> **order**: `"ASC"` \| `"DESC"`

***

### ReferenceFieldProps

Defined in: [components/field/ReferenceField.tsx:8](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceField.tsx#L8)

#### Extends

- `HTMLAttributes`\<`HTMLSpanElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/ReferenceField.tsx:10](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceField.tsx#L10)

The field name in the record that contains the reference ID

##### reference

> **reference**: `string`

Defined in: [components/field/ReferenceField.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceField.tsx#L12)

The resource name to fetch the referenced record from

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/ReferenceField.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceField.tsx#L14)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/ReferenceField.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceField.tsx#L16)

Optional label to display above the value

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/ReferenceField.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceField.tsx#L23)

Text to display when the reference value is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### link?

> `optional` **link**: `false` \| `"show"` \| `"edit"`

Defined in: [components/field/ReferenceField.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceField.tsx#L30)

How to render the link to the referenced record
- 'show': Link to the show page
- 'edit': Link to the edit page
- false: No link

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/field/ReferenceField.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceField.tsx#L32)

Children to render with the referenced record

###### Overrides

`HTMLAttributes.children`

***

### ReferenceManyCountProps

Defined in: [components/field/ReferenceManyCount.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L13)

#### Extends

- `Omit`\<`HTMLAttributes`\<`HTMLSpanElement`\>, `"children"`\>

#### Properties

##### source?

> `optional` **source**: `string`

Defined in: [components/field/ReferenceManyCount.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L15)

The field name in the record that contains the ID to look up

##### reference

> **reference**: `string`

Defined in: [components/field/ReferenceManyCount.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L17)

The resource name to fetch the related records from

##### target

> **target**: `string`

Defined in: [components/field/ReferenceManyCount.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L19)

The foreign key field name in the referenced resource

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/ReferenceManyCount.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L21)

Optional record to use instead of RecordContext

##### filter?

> `optional` **filter**: `Record`\<`string`, `unknown`\>

Defined in: [components/field/ReferenceManyCount.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L23)

Filter configuration

##### sort?

> `optional` **sort**: `object`

Defined in: [components/field/ReferenceManyCount.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L25)

Sort configuration

###### field

> **field**: `string`

###### order

> **order**: `"ASC"` \| `"DESC"`

##### link?

> `optional` **link**: `string` \| `boolean`

Defined in: [components/field/ReferenceManyCount.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L30)

Link path for the count (makes it clickable)

##### timeout?

> `optional` **timeout**: `number`

Defined in: [components/field/ReferenceManyCount.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L32)

Timeout for loading state (ms) before showing spinner

##### sx?

> `optional` **sx**: `unknown`

Defined in: [components/field/ReferenceManyCount.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyCount.tsx#L34)

MUI sx prop for styling (accepted for compatibility, ignored)

***

### ReferenceManyFieldProps

Defined in: [components/field/ReferenceManyField.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L14)

#### Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

#### Properties

##### source?

> `optional` **source**: `string`

Defined in: [components/field/ReferenceManyField.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L16)

The field name in the record that contains the ID to look up (defaults to 'id' if not provided)

##### reference

> **reference**: `string`

Defined in: [components/field/ReferenceManyField.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L18)

The resource name to fetch the related records from

##### target

> **target**: `string`

Defined in: [components/field/ReferenceManyField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L20)

The foreign key field name in the referenced resource

##### record?

> `optional` **record**: `Record`\<`string`, `unknown`\>

Defined in: [components/field/ReferenceManyField.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L22)

Optional record to use instead of RecordContext (doesn't require id, just needs the source field)

##### label?

> `optional` **label**: `string`

Defined in: [components/field/ReferenceManyField.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L24)

Optional label to display above the values

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/ReferenceManyField.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L31)

Text to display when there are no related records.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### perPage?

> `optional` **perPage**: `number`

Defined in: [components/field/ReferenceManyField.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L33)

Number of records per page (default: 10)

##### page?

> `optional` **page**: `number`

Defined in: [components/field/ReferenceManyField.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L35)

Page number (default: 1)

##### sort?

> `optional` **sort**: `object`

Defined in: [components/field/ReferenceManyField.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L37)

Sort configuration

###### field

> **field**: `string`

###### order

> **order**: `"ASC"` \| `"DESC"`

##### filter?

> `optional` **filter**: `Record`\<`string`, `unknown`\>

Defined in: [components/field/ReferenceManyField.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L42)

Filter configuration

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/field/ReferenceManyField.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/ReferenceManyField.tsx#L44)

Children to render for each related record

###### Overrides

`HTMLAttributes.children`

***

### RichTextFieldProps

Defined in: [components/field/RichTextField.tsx:7](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RichTextField.tsx#L7)

#### Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/RichTextField.tsx:9](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RichTextField.tsx#L9)

The field name in the record containing HTML content

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/RichTextField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RichTextField.tsx#L11)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/field/RichTextField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RichTextField.tsx#L13)

Optional label to display above the content. Set to `false` to hide the label.

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/RichTextField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RichTextField.tsx#L20)

Text to display when value is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### stripTags?

> `optional` **stripTags**: `boolean`

Defined in: [components/field/RichTextField.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/RichTextField.tsx#L22)

Strip HTML tags and render as plain text

***

### SelectFieldProps

Defined in: [components/field/SelectField.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L14)

#### Extends

- `HTMLAttributes`\<`HTMLSpanElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/SelectField.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L16)

The field name in the record to display

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/SelectField.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L18)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/SelectField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L20)

Optional label to display above the value

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/SelectField.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L27)

Text to display when value is empty/null/undefined or not found in choices.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### choices?

> `optional` **choices**: `Record`\<`string`, `unknown`\>[]

Defined in: [components/field/SelectField.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L32)

Array of choices to look up the display value.
If not provided, displays the raw value.

##### optionValue?

> `optional` **optionValue**: `string`

Defined in: [components/field/SelectField.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L37)

The property name to use as the option value for matching.

###### Default

```ts
'id'
```

##### optionText?

> `optional` **optionText**: `string` \| (`choice`) => `string`

Defined in: [components/field/SelectField.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L42)

The property name to use as the option text, or a function to render custom text.

###### Default

```ts
'name'
```

##### translateChoice?

> `optional` **translateChoice**: `boolean`

Defined in: [components/field/SelectField.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L47)

If true, the value is translated using the provided translate function
(for react-admin compatibility)

***

### SingleFieldListProps

Defined in: [components/field/SingleFieldList.tsx:6](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SingleFieldList.tsx#L6)

#### Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/field/SingleFieldList.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SingleFieldList.tsx#L11)

Children to render for each item.
Typically a single field component like ChipField or TextField.

###### Overrides

`HTMLAttributes.children`

##### data?

> `optional` **data**: `RaRecord`[]

Defined in: [components/field/SingleFieldList.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SingleFieldList.tsx#L16)

The data to iterate over.
If not provided, expects to be used within a context that provides data (e.g., ArrayField, ReferenceArrayField).

##### empty?

> `optional` **empty**: `ReactNode`

Defined in: [components/field/SingleFieldList.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SingleFieldList.tsx#L20)

Text/element to display when the list is empty

##### linkType?

> `optional` **linkType**: `false` \| `"show"` \| `"edit"`

Defined in: [components/field/SingleFieldList.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SingleFieldList.tsx#L24)

Custom component to link each item (e.g., for navigation)

##### gap?

> `optional` **gap**: `string`

Defined in: [components/field/SingleFieldList.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SingleFieldList.tsx#L29)

Gap between items (Tailwind spacing scale)

###### Default

```ts
'gap-1'
```

##### direction?

> `optional` **direction**: `"horizontal"` \| `"vertical"`

Defined in: [components/field/SingleFieldList.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SingleFieldList.tsx#L34)

Direction of the list

###### Default

```ts
'horizontal'
```

***

### TextFieldProps

Defined in: [components/field/TextField.tsx:7](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TextField.tsx#L7)

#### Extends

- `HTMLAttributes`\<`HTMLSpanElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/TextField.tsx:9](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TextField.tsx#L9)

The field name in the record to display

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/TextField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TextField.tsx#L11)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/TextField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TextField.tsx#L13)

Optional label to display above the value

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/TextField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TextField.tsx#L20)

Text to display when value is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### sx?

> `optional` **sx**: `unknown`

Defined in: [components/field/TextField.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TextField.tsx#L22)

MUI sx prop for styling (accepted for compatibility, ignored)

***

### TranslatableFieldsContextValue

Defined in: [components/field/TranslatableFields.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L25)

Context value for TranslatableFields

#### Properties

##### selectedLocale

> **selectedLocale**: `string`

Defined in: [components/field/TranslatableFields.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L29)

Currently selected locale

##### selectLocale()

> **selectLocale**: (`locale`) => `void`

Defined in: [components/field/TranslatableFields.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L33)

Set the selected locale

###### Parameters

###### locale

`string`

###### Returns

`void`

##### locales

> **locales**: `string`[]

Defined in: [components/field/TranslatableFields.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L37)

All available locales

##### defaultLocale

> **defaultLocale**: `string`

Defined in: [components/field/TranslatableFields.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L41)

Default locale

##### getSource()

> **getSource**: (`source`) => `string`

Defined in: [components/field/TranslatableFields.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L45)

Get the field value for the current locale

###### Parameters

###### source

`string`

###### Returns

`string`

***

### TranslatableFieldsProps

Defined in: [components/field/TranslatableFields.tsx:73](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L73)

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/field/TranslatableFields.tsx:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L77)

Field components to display with translation support

##### locales

> **locales**: `string`[]

Defined in: [components/field/TranslatableFields.tsx:82](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L82)

Available locales

###### Example

```ts
['en', 'fr', 'de']
```

##### defaultLocale?

> `optional` **defaultLocale**: `string`

Defined in: [components/field/TranslatableFields.tsx:87](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L87)

Default locale to display

###### Default

```ts
first locale in the array
```

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/TranslatableFields.tsx:91](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L91)

Optional record to use instead of RecordContext

##### className?

> `optional` **className**: `string`

Defined in: [components/field/TranslatableFields.tsx:95](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L95)

Additional CSS class for the container

##### onLocaleChange()?

> `optional` **onLocaleChange**: (`locale`) => `void`

Defined in: [components/field/TranslatableFields.tsx:99](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L99)

Callback when locale changes

###### Parameters

###### locale

`string`

###### Returns

`void`

##### selector?

> `optional` **selector**: `"select"` \| `"tabs"`

Defined in: [components/field/TranslatableFields.tsx:104](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L104)

Whether to use tabs for locale selection

###### Default

```ts
true
```

##### localeLabels?

> `optional` **localeLabels**: `Record`\<`string`, `string`\>

Defined in: [components/field/TranslatableFields.tsx:109](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L109)

Labels for each locale

###### Example

```ts
{ en: 'English', fr: 'French', de: 'German' }
```

##### gap?

> `optional` **gap**: `string`

Defined in: [components/field/TranslatableFields.tsx:114](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L114)

Gap between fields

###### Default

```ts
'gap-4'
```

##### groupKey?

> `optional` **groupKey**: `string`

Defined in: [components/field/TranslatableFields.tsx:120](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/TranslatableFields.tsx#L120)

The field name containing translations (for grouped translations)
If set, translations are expected at record[groupKey][locale][source]
If not set, translations are expected at record[source + locale] or record[locale][source]

***

### UrlFieldProps

Defined in: [components/field/UrlField.tsx:7](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/UrlField.tsx#L7)

#### Extends

- `AnchorHTMLAttributes`\<`HTMLAnchorElement`\>

#### Properties

##### source

> **source**: `string`

Defined in: [components/field/UrlField.tsx:9](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/UrlField.tsx#L9)

The field name in the record to display

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/field/UrlField.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/UrlField.tsx#L11)

Optional record to use instead of RecordContext

##### label?

> `optional` **label**: `string`

Defined in: [components/field/UrlField.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/UrlField.tsx#L13)

Optional label to display above the value

##### emptyText?

> `optional` **emptyText**: `string` \| `boolean`

Defined in: [components/field/UrlField.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/UrlField.tsx#L20)

Text to display when value is empty/null/undefined.
- string: Display that string
- true: Display default empty text
- false | undefined: Display nothing

##### text?

> `optional` **text**: `string`

Defined in: [components/field/UrlField.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/UrlField.tsx#L22)

Custom text to display instead of the URL

##### truncateUrl?

> `optional` **truncateUrl**: `boolean`

Defined in: [components/field/UrlField.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/UrlField.tsx#L24)

Whether to truncate the URL to just the domain

***

### FormDataConsumerRenderProps

Defined in: [components/form/FormDataConsumer.tsx:76](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L76)

Props passed to the FormDataConsumer render function.
Contains the current form data and methods to interact with the form.

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

The form data type extending FieldValues

##### TSource

`TSource` *extends* `string` \| `undefined` = `undefined`

Optional source path for scoped data access

#### Properties

##### formData

> **formData**: `T`

Defined in: [components/form/FormDataConsumer.tsx:84](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L84)

Current form data (all watched values).
Updates reactively when any form field changes.

##### scopedFormData

> **scopedFormData**: `TSource` *extends* `string` ? `PathValue`\<`T`, `TSource`\<`TSource`\>\> : `undefined`

Defined in: [components/form/FormDataConsumer.tsx:90](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L90)

Scoped form data when source prop is provided.
Contains only the data at the specified path.
Type is inferred from the source path when possible.

##### setValue

> **setValue**: `UseFormSetValue`\<`T`\>

Defined in: [components/form/FormDataConsumer.tsx:95](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L95)

Set a form field value programmatically.

###### See

https://react-hook-form.com/docs/useform/setvalue

##### getValues

> **getValues**: `UseFormGetValues`\<`T`\>

Defined in: [components/form/FormDataConsumer.tsx:100](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L100)

Get current form values (snapshot, not reactive).

###### See

https://react-hook-form.com/docs/useform/getvalues

##### formState

> **formState**: `FormState`\<`T`\>

Defined in: [components/form/FormDataConsumer.tsx:105](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L105)

Form state from react-hook-form (errors, isDirty, isValid, etc.).

###### See

https://react-hook-form.com/docs/useform/formstate

##### trigger

> **trigger**: `UseFormTrigger`\<`T`\>

Defined in: [components/form/FormDataConsumer.tsx:110](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L110)

Trigger validation for specific fields or the entire form.

###### See

https://react-hook-form.com/docs/useform/trigger

##### reset

> **reset**: `UseFormReset`\<`T`\>

Defined in: [components/form/FormDataConsumer.tsx:115](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L115)

Reset form to default values or provided values.

###### See

https://react-hook-form.com/docs/useform/reset

##### clearErrors

> **clearErrors**: `UseFormClearErrors`\<`T`\>

Defined in: [components/form/FormDataConsumer.tsx:120](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L120)

Clear errors for specific fields or all fields.

###### See

https://react-hook-form.com/docs/useform/clearerrors

##### setError

> **setError**: `UseFormSetError`\<`T`\>

Defined in: [components/form/FormDataConsumer.tsx:125](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L125)

Set error for a specific field manually.

###### See

https://react-hook-form.com/docs/useform/seterror

***

### FormDataConsumerProps

Defined in: [components/form/FormDataConsumer.tsx:134](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L134)

Props for FormDataConsumer component

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

The form data type extending FieldValues

##### TSource

`TSource` *extends* `Path`\<`T`\> \| `undefined` = `undefined`

Optional source path type for scoped data access

#### Properties

##### children()

> **children**: (`props`) => `ReactNode`

Defined in: [components/form/FormDataConsumer.tsx:142](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L142)

Render function that receives form data and methods.
Called on every form data change with updated values.

###### Parameters

###### props

[`FormDataConsumerRenderProps`](#formdataconsumerrenderprops)\<`T`, `TSource` *extends* `Path`\<`T`\> ? `TSource`\<`TSource`\> : `undefined`\>

###### Returns

`ReactNode`

##### source?

> `optional` **source**: `TSource`

Defined in: [components/form/FormDataConsumer.tsx:148](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormDataConsumer.tsx#L148)

Optional source path to scope the form data.
When provided, scopedFormData will contain only the data at that path.
Supports dot notation for nested access (e.g., "user.address.city").

***

### FormTabProps

Defined in: [components/form/FormTab.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L12)

Props for FormTab component

#### Properties

##### label

> **label**: `string`

Defined in: [components/form/FormTab.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L16)

Label displayed on the tab trigger

##### name?

> `optional` **name**: `string`

Defined in: [components/form/FormTab.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L21)

Unique name/identifier for the tab.
If not provided, will be generated from the label.

##### path?

> `optional` **path**: `string`

Defined in: [components/form/FormTab.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L26)

Path used for URL synchronization when syncWithLocation is enabled.
If not provided, the name (or generated name from label) will be used.

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/form/FormTab.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L30)

Content to render inside the tab panel

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/form/FormTab.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L34)

Optional icon to display before the label

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/form/FormTab.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L38)

Whether the tab is disabled

##### className?

> `optional` **className**: `string`

Defined in: [components/form/FormTab.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L42)

Additional CSS class for the tab panel

##### triggerClassName?

> `optional` **triggerClassName**: `string`

Defined in: [components/form/FormTab.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L46)

Additional CSS class for the tab trigger

##### count?

> `optional` **count**: `ReactNode`

Defined in: [components/form/FormTab.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L50)

Optional badge count to display on the tab

***

### FormTabPanelProps

Defined in: [components/form/FormTab.tsx:106](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L106)

Internal component for rendering the actual tab panel content
Used by TabbedForm to render each tab's children

#### Properties

##### value

> **value**: `string`

Defined in: [components/form/FormTab.tsx:110](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L110)

The tab name/value

##### children

> **children**: `ReactNode`

Defined in: [components/form/FormTab.tsx:114](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L114)

Content to render

##### className?

> `optional` **className**: `string`

Defined in: [components/form/FormTab.tsx:118](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L118)

Additional class names

##### forceRender?

> `optional` **forceRender**: `boolean`

Defined in: [components/form/FormTab.tsx:123](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L123)

Whether to force render content even when tab is not active
This is needed to register form inputs

##### isActive?

> `optional` **isActive**: `boolean`

Defined in: [components/form/FormTab.tsx:127](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/FormTab.tsx#L127)

Whether this tab is currently active

***

### SimpleFormProps

Defined in: [components/form/SimpleForm.tsx:91](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L91)

Props for SimpleForm component

#### Extends

- `Omit`\<`FormHTMLAttributes`\<`HTMLFormElement`\>, `"onSubmit"` \| `"onError"`\>

#### Extended by

- [`SimpleFormConfigurableProps`](#simpleformconfigurableprops)

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/form/SimpleForm.tsx:96](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L96)

Form children (typically input components)

###### Overrides

`Omit.children`

##### onSubmit?

> `optional` **onSubmit**: `FormSubmitHandler`\<`T`, `unknown`\>

Defined in: [components/form/SimpleForm.tsx:102](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L102)

Handler called on form submission with validated data.
If not provided, uses the save function from form context.
Accepts SaveHandler from ra-core or a standard form submit handler.

##### defaultValues?

> `optional` **defaultValues**: `DefaultValues`\<`T`\>

Defined in: [components/form/SimpleForm.tsx:106](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L106)

Default values for the form fields

##### resource?

> `optional` **resource**: `string`

Defined in: [components/form/SimpleForm.tsx:110](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L110)

Resource name for context

###### Overrides

`Omit.resource`

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/form/SimpleForm.tsx:114](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L114)

Record being edited for context

##### mode?

> `optional` **mode**: `"onBlur"` \| `"onChange"` \| `"onSubmit"` \| `"onTouched"` \| `"all"`

Defined in: [components/form/SimpleForm.tsx:119](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L119)

Validation mode - when to trigger validation

###### Default

```ts
'onSubmit'
```

##### reValidateMode?

> `optional` **reValidateMode**: `"onBlur"` \| `"onChange"` \| `"onSubmit"`

Defined in: [components/form/SimpleForm.tsx:124](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L124)

Re-validation mode after initial submission

###### Default

```ts
'onChange'
```

##### resolver?

> `optional` **resolver**: `Resolver`\<`T`\>

Defined in: [components/form/SimpleForm.tsx:128](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L128)

Schema resolver for validation (e.g., zod, yup)

##### toolbar?

> `optional` **toolbar**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/form/SimpleForm.tsx:132](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L132)

Toolbar component or false to hide toolbar

##### resetOnSubmit?

> `optional` **resetOnSubmit**: `boolean`

Defined in: [components/form/SimpleForm.tsx:136](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L136)

Reset form after successful submission

##### disableInvalidSubmit?

> `optional` **disableInvalidSubmit**: `boolean`

Defined in: [components/form/SimpleForm.tsx:140](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L140)

Disable submit button when form is invalid

##### warnWhenUnsavedChanges?

> `optional` **warnWhenUnsavedChanges**: `boolean`

Defined in: [components/form/SimpleForm.tsx:144](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L144)

Show warning before leaving page with unsaved changes

##### sanitizeEmptyValues?

> `optional` **sanitizeEmptyValues**: `boolean`

Defined in: [components/form/SimpleForm.tsx:148](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L148)

Remove empty string values from submitted data

##### transform()?

> `optional` **transform**: (`data`) => `T`

Defined in: [components/form/SimpleForm.tsx:152](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L152)

Transform data before submission

###### Parameters

###### data

`T`

###### Returns

`T`

##### onSuccess()?

> `optional` **onSuccess**: () => `void`

Defined in: [components/form/SimpleForm.tsx:156](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L156)

Handler called on successful submission

###### Returns

`void`

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [components/form/SimpleForm.tsx:160](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L160)

Handler called on submission error

###### Parameters

###### error

`Error`

###### Returns

`void`

##### fieldWrapper?

> `optional` **fieldWrapper**: `ComponentType`\<`FieldWrapperProps`\>

Defined in: [components/form/SimpleForm.tsx:164](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L164)

Custom component to wrap each field

***

### FieldConfig

Defined in: [components/form/SimpleFormConfigurable.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L26)

Configuration for a single field

#### Properties

##### source

> **source**: `string`

Defined in: [components/form/SimpleFormConfigurable.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L28)

Field source/name

##### label?

> `optional` **label**: `string`

Defined in: [components/form/SimpleFormConfigurable.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L30)

Display label for the field

##### visible

> **visible**: `boolean`

Defined in: [components/form/SimpleFormConfigurable.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L32)

Whether the field is currently visible

***

### SimpleFormConfigurableProps

Defined in: [components/form/SimpleFormConfigurable.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L38)

Props for SimpleFormConfigurable component

#### Extends

- [`SimpleFormProps`](#simpleformprops)\<`T`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/form/SimpleForm.tsx:96](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L96)

Form children (typically input components)

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`children`](#children-22)

##### onSubmit?

> `optional` **onSubmit**: `FormSubmitHandler`\<`T`, `unknown`\>

Defined in: [components/form/SimpleForm.tsx:102](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L102)

Handler called on form submission with validated data.
If not provided, uses the save function from form context.
Accepts SaveHandler from ra-core or a standard form submit handler.

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`onSubmit`](#onsubmit)

##### defaultValues?

> `optional` **defaultValues**: `DefaultValues`\<`T`\>

Defined in: [components/form/SimpleForm.tsx:106](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L106)

Default values for the form fields

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`defaultValues`](#defaultvalues)

##### resource?

> `optional` **resource**: `string`

Defined in: [components/form/SimpleForm.tsx:110](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L110)

Resource name for context

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`resource`](#resource-16)

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/form/SimpleForm.tsx:114](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L114)

Record being edited for context

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`record`](#record-24)

##### mode?

> `optional` **mode**: `"onBlur"` \| `"onChange"` \| `"onSubmit"` \| `"onTouched"` \| `"all"`

Defined in: [components/form/SimpleForm.tsx:119](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L119)

Validation mode - when to trigger validation

###### Default

```ts
'onSubmit'
```

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`mode`](#mode)

##### reValidateMode?

> `optional` **reValidateMode**: `"onBlur"` \| `"onChange"` \| `"onSubmit"`

Defined in: [components/form/SimpleForm.tsx:124](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L124)

Re-validation mode after initial submission

###### Default

```ts
'onChange'
```

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`reValidateMode`](#revalidatemode)

##### resolver?

> `optional` **resolver**: `Resolver`\<`T`\>

Defined in: [components/form/SimpleForm.tsx:128](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L128)

Schema resolver for validation (e.g., zod, yup)

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`resolver`](#resolver)

##### toolbar?

> `optional` **toolbar**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/form/SimpleForm.tsx:132](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L132)

Toolbar component or false to hide toolbar

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`toolbar`](#toolbar)

##### resetOnSubmit?

> `optional` **resetOnSubmit**: `boolean`

Defined in: [components/form/SimpleForm.tsx:136](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L136)

Reset form after successful submission

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`resetOnSubmit`](#resetonsubmit)

##### disableInvalidSubmit?

> `optional` **disableInvalidSubmit**: `boolean`

Defined in: [components/form/SimpleForm.tsx:140](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L140)

Disable submit button when form is invalid

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`disableInvalidSubmit`](#disableinvalidsubmit)

##### warnWhenUnsavedChanges?

> `optional` **warnWhenUnsavedChanges**: `boolean`

Defined in: [components/form/SimpleForm.tsx:144](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L144)

Show warning before leaving page with unsaved changes

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`warnWhenUnsavedChanges`](#warnwhenunsavedchanges)

##### sanitizeEmptyValues?

> `optional` **sanitizeEmptyValues**: `boolean`

Defined in: [components/form/SimpleForm.tsx:148](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L148)

Remove empty string values from submitted data

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`sanitizeEmptyValues`](#sanitizeemptyvalues)

##### transform()?

> `optional` **transform**: (`data`) => `T`

Defined in: [components/form/SimpleForm.tsx:152](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L152)

Transform data before submission

###### Parameters

###### data

`T`

###### Returns

`T`

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`transform`](#transform-2)

##### onSuccess()?

> `optional` **onSuccess**: () => `void`

Defined in: [components/form/SimpleForm.tsx:156](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L156)

Handler called on successful submission

###### Returns

`void`

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`onSuccess`](#onsuccess-4)

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [components/form/SimpleForm.tsx:160](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L160)

Handler called on submission error

###### Parameters

###### error

`Error`

###### Returns

`void`

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`onError`](#onerror-4)

##### fieldWrapper?

> `optional` **fieldWrapper**: `ComponentType`\<`FieldWrapperProps`\>

Defined in: [components/form/SimpleForm.tsx:164](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleForm.tsx#L164)

Custom component to wrap each field

###### Inherited from

[`SimpleFormProps`](#simpleformprops).[`fieldWrapper`](#fieldwrapper)

##### sx?

> `optional` **sx**: `unknown`

Defined in: [components/form/SimpleFormConfigurable.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L43)

MUI sx prop for styling (accepted for compatibility, ignored)

##### omit?

> `optional` **omit**: `string`[]

Defined in: [components/form/SimpleFormConfigurable.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L48)

Array of field sources to omit (hide) from the form.
These fields will not be rendered.

##### preferenceKey?

> `optional` **preferenceKey**: `string`

Defined in: [components/form/SimpleFormConfigurable.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L53)

Key for storing field configuration in localStorage.
If provided, user preferences will be persisted.

##### configurable?

> `optional` **configurable**: `boolean`

Defined in: [components/form/SimpleFormConfigurable.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L58)

Whether to show the configuration panel

###### Default

```ts
true
```

##### configureButtonLabel?

> `optional` **configureButtonLabel**: `string`

Defined in: [components/form/SimpleFormConfigurable.tsx:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L63)

Custom label for the configure button

###### Default

```ts
'Configure Fields'
```

##### onConfigChange()?

> `optional` **onConfigChange**: (`config`) => `void`

Defined in: [components/form/SimpleFormConfigurable.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/SimpleFormConfigurable.tsx#L67)

Callback when field configuration changes

###### Parameters

###### config

[`FieldConfig`](#fieldconfig)[]

###### Returns

`void`

***

### TabInfo

Defined in: [components/form/TabbedForm.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L42)

Tab information extracted from FormTab children.
This normalized structure is used internally to render tabs consistently.

#### Properties

##### name

> **name**: `string`

Defined in: [components/form/TabbedForm.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L44)

Unique identifier for the tab, used for state management

##### label

> **label**: `string`

Defined in: [components/form/TabbedForm.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L46)

Display label shown on the tab trigger

##### path

> **path**: `string`

Defined in: [components/form/TabbedForm.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L48)

Path segment for URL synchronization. Defaults to name if not provided

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/form/TabbedForm.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L50)

Optional icon element to display before the label

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/form/TabbedForm.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L52)

Whether the tab is disabled and cannot be selected

##### className?

> `optional` **className**: `string`

Defined in: [components/form/TabbedForm.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L54)

Additional CSS class for the tab panel content area

##### triggerClassName?

> `optional` **triggerClassName**: `string`

Defined in: [components/form/TabbedForm.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L56)

Additional CSS class for the tab trigger button

##### count?

> `optional` **count**: `ReactNode`

Defined in: [components/form/TabbedForm.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L58)

Optional badge count to display on the tab (e.g., item count)

##### children

> **children**: `ReactNode`

Defined in: [components/form/TabbedForm.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L60)

The tab panel content (form fields, etc.)

***

### TabbedFormContextValue

Defined in: [components/form/TabbedForm.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L67)

Context value provided by TabbedForm to its descendants.
Allows child components to interact with tab state and access form status per tab.

#### Properties

##### activeTab

> **activeTab**: `string`

Defined in: [components/form/TabbedForm.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L69)

Currently active tab name

##### setActiveTab()

> **setActiveTab**: (`tabName`) => `void`

Defined in: [components/form/TabbedForm.tsx:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L71)

Programmatically switch to a different tab

###### Parameters

###### tabName

`string`

###### Returns

`void`

##### tabs

> **tabs**: [`TabInfo`](#tabinfo)[]

Defined in: [components/form/TabbedForm.tsx:73](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L73)

Array of all tab configurations

##### getDirtyTabs()

> **getDirtyTabs**: () => `string`[]

Defined in: [components/form/TabbedForm.tsx:75](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L75)

Get names of tabs containing dirty (modified) fields

###### Returns

`string`[]

##### getErrorTabs()

> **getErrorTabs**: () => `string`[]

Defined in: [components/form/TabbedForm.tsx:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L77)

Get names of tabs containing validation errors

###### Returns

`string`[]

##### getTabErrorCount()

> **getTabErrorCount**: (`tabName`) => `number`

Defined in: [components/form/TabbedForm.tsx:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L79)

Get the count of validation errors for a specific tab

###### Parameters

###### tabName

`string`

###### Returns

`number`

##### isTabDirty()

> **isTabDirty**: (`tabName`) => `boolean`

Defined in: [components/form/TabbedForm.tsx:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L81)

Check if a specific tab has any dirty fields

###### Parameters

###### tabName

`string`

###### Returns

`boolean`

##### tabHasError()

> **tabHasError**: (`tabName`) => `boolean`

Defined in: [components/form/TabbedForm.tsx:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L83)

Check if a specific tab has any validation errors

###### Parameters

###### tabName

`string`

###### Returns

`boolean`

***

### TabbedFormProps

Defined in: [components/form/TabbedForm.tsx:135](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L135)

Props for TabbedForm component

#### Type Parameters

##### TData

`TData` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

The form data type, defaults to Record<string, unknown>

##### TResult

`TResult` = `unknown`

The result type for save handler callbacks, defaults to unknown

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/form/TabbedForm.tsx:140](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L140)

FormTab children defining each tab

##### className?

> `optional` **className**: `string`

Defined in: [components/form/TabbedForm.tsx:142](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L142)

Additional CSS class for the form container

##### defaultTab?

> `optional` **defaultTab**: `string`

Defined in: [components/form/TabbedForm.tsx:144](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L144)

Default tab to show on initial mount (by name)

##### onTabChange()?

> `optional` **onTabChange**: (`tabName`) => `void`

Defined in: [components/form/TabbedForm.tsx:146](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L146)

Callback fired when the active tab changes

###### Parameters

###### tabName

`string`

###### Returns

`void`

##### syncWithLocation?

> `optional` **syncWithLocation**: `boolean`

Defined in: [components/form/TabbedForm.tsx:152](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L152)

Whether to sync active tab with the URL.
When enabled, tab changes update the URL path and browser back/forward works.

###### Default

```ts
false
```

##### ~~locationKey?~~

> `optional` **locationKey**: `string`

Defined in: [components/form/TabbedForm.tsx:159](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L159)

URL parameter key for tab sync.
Currently unused - tabs use path segments instead of query params.

###### Default

```ts
'tab'
```

###### Deprecated

Use path prop on FormTab instead

##### mode?

> `optional` **mode**: `"onBlur"` \| `"onChange"` \| `"onSubmit"` \| `"onTouched"` \| `"all"`

Defined in: [components/form/TabbedForm.tsx:165](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L165)

Validation mode for react-hook-form.
Passed through for react-admin compatibility.

###### Default

```ts
'onSubmit'
```

##### defaultValues?

> `optional` **defaultValues**: `TData`

Defined in: [components/form/TabbedForm.tsx:167](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L167)

Default values for the form fields (react-admin compatibility)

##### warnWhenUnsavedChanges?

> `optional` **warnWhenUnsavedChanges**: `boolean`

Defined in: [components/form/TabbedForm.tsx:172](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L172)

Warn users before navigating away from unsaved changes.
React-admin compatibility prop.

##### toolbar?

> `optional` **toolbar**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/form/TabbedForm.tsx:177](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L177)

Custom toolbar element to render form actions.
Set to false to hide the toolbar completely.

##### onSubmit?

> `optional` **onSubmit**: `FormSubmitHandler`\<`TData`, `TResult`\>

Defined in: [components/form/TabbedForm.tsx:201](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/TabbedForm.tsx#L201)

Custom submit handler for the form.
Supports both ra-core's SaveHandler and regular form submit handlers.

The second parameter can be either:
- `SaveHandlerCallbacks` for ra-core style handlers (with onSuccess/onError callbacks)
- `React.BaseSyntheticEvent` for standard form submit handlers (the form event)

###### Example

```tsx
// ra-core style handler
onSubmit={(data, callbacks) => {
  await api.save(data)
  callbacks?.onSuccess?.(savedRecord)
}}

// Standard form handler
onSubmit={(data, event) => {
  event?.preventDefault()
  await api.save(data)
}}
```

***

### ToolbarProps

Defined in: [components/form/Toolbar.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L47)

Props for Toolbar component

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/form/Toolbar.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L52)

Toolbar children (typically SaveButton, DeleteButton, etc.)
If not provided, renders a default SaveButton

##### className?

> `optional` **className**: `string`

Defined in: [components/form/Toolbar.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L56)

Additional CSS classes for the toolbar container

##### saving?

> `optional` **saving**: `boolean`

Defined in: [components/form/Toolbar.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L60)

Whether the form is currently saving (passed to default SaveButton)

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/form/Toolbar.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L64)

Whether the submit button should be disabled (passed to default SaveButton)

##### data-testid?

> `optional` **data-testid**: `string`

Defined in: [components/form/Toolbar.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L68)

Data attributes and other HTML attributes

***

### SaveButtonProps

Defined in: [components/form/Toolbar.tsx:116](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L116)

Props for SaveButton component

#### Extends

- `ButtonHTMLAttributes`\<`HTMLButtonElement`\>

#### Properties

##### label?

> `optional` **label**: `string`

Defined in: [components/form/Toolbar.tsx:121](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L121)

Button label

###### Default

```ts
'Save'
```

##### saving?

> `optional` **saving**: `boolean`

Defined in: [components/form/Toolbar.tsx:126](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L126)

Whether the form is currently saving
If not provided, uses the saving state from form context

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/form/Toolbar.tsx:130](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L130)

Icon to display before the label

##### variant?

> `optional` **variant**: `ButtonVariant`

Defined in: [components/form/Toolbar.tsx:135](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L135)

Button variant. 'text' is an alias for 'link'.

###### Default

```ts
'default'
```

##### size?

> `optional` **size**: `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/form/Toolbar.tsx:140](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L140)

Button size

###### Default

```ts
'default'
```

##### type?

> `optional` **type**: `"button"` \| `"submit"`

Defined in: [components/form/Toolbar.tsx:145](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L145)

Button type attribute

###### Default

```ts
'submit'
```

###### Overrides

`ButtonHTMLAttributes.type`

##### mutationOptions?

> `optional` **mutationOptions**: `object`

Defined in: [components/form/Toolbar.tsx:149](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L149)

Mutation options for form submission callbacks

###### onSuccess()?

> `optional` **onSuccess**: (`data`) => `void`

###### Parameters

###### data

`any`

###### Returns

`void`

###### onError()?

> `optional` **onError**: (`error`) => `void`

###### Parameters

###### error

`any`

###### Returns

`void`

##### transform()?

> `optional` **transform**: (`data`) => `any`

Defined in: [components/form/Toolbar.tsx:156](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L156)

Transform function to modify form data before submission

###### Parameters

###### data

`any`

###### Returns

`any`

##### sx?

> `optional` **sx**: `unknown`

Defined in: [components/form/Toolbar.tsx:160](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L160)

Style extension prop (for compatibility with MUI-style APIs)

***

### DeleteButtonProps

Defined in: [components/form/Toolbar.tsx:232](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L232)

Props for DeleteButton component

#### Extends

- `ButtonHTMLAttributes`\<`HTMLButtonElement`\>

#### Properties

##### label?

> `optional` **label**: `string`

Defined in: [components/form/Toolbar.tsx:237](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L237)

Button label

###### Default

```ts
'Delete'
```

##### onDelete()

> **onDelete**: () => `void` \| `Promise`\<`void`\>

Defined in: [components/form/Toolbar.tsx:241](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L241)

Handler called when delete is confirmed

###### Returns

`void` \| `Promise`\<`void`\>

##### confirmDelete?

> `optional` **confirmDelete**: `boolean`

Defined in: [components/form/Toolbar.tsx:246](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L246)

Whether to show confirmation dialog

###### Default

```ts
true
```

##### confirmMessage?

> `optional` **confirmMessage**: `string`

Defined in: [components/form/Toolbar.tsx:251](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L251)

Custom confirmation message

###### Default

```ts
'Are you sure you want to delete this item?'
```

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/form/Toolbar.tsx:255](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L255)

Icon to display before the label

##### variant?

> `optional` **variant**: `ButtonVariant`

Defined in: [components/form/Toolbar.tsx:260](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L260)

Button variant. 'text' is an alias for 'link'.

###### Default

```ts
'destructive'
```

##### size?

> `optional` **size**: `"default"` \| `"sm"` \| `"lg"` \| `"icon"`

Defined in: [components/form/Toolbar.tsx:265](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L265)

Button size

###### Default

```ts
'default'
```

***

### TopToolbarProps

Defined in: [components/form/Toolbar.tsx:347](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L347)

Props for TopToolbar component

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/form/Toolbar.tsx:351](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L351)

Toolbar children (buttons, filters, etc.)

##### className?

> `optional` **className**: `string`

Defined in: [components/form/Toolbar.tsx:355](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L355)

Additional CSS classes for the toolbar container

##### data-testid?

> `optional` **data-testid**: `string`

Defined in: [components/form/Toolbar.tsx:359](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L359)

Data attributes and other HTML attributes

***

### LocaleSwitcherProps

Defined in: [components/i18n/LocaleSwitcher.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/LocaleSwitcher.tsx#L14)

#### Extends

- `Omit`\<`SelectHTMLAttributes`\<`HTMLSelectElement`\>, `"onChange"` \| `"value"` \| `"size"`\>

#### Properties

##### locales?

> `optional` **locales**: `object`[]

Defined in: [components/i18n/LocaleSwitcher.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/LocaleSwitcher.tsx#L17)

Override available locales (defaults to those from i18nProvider)

###### locale

> **locale**: `string`

###### name

> **name**: `string`

##### label?

> `optional` **label**: `string`

Defined in: [components/i18n/LocaleSwitcher.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/LocaleSwitcher.tsx#L19)

Custom label for the select element

##### onLocaleChange()?

> `optional` **onLocaleChange**: (`locale`) => `void`

Defined in: [components/i18n/LocaleSwitcher.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/LocaleSwitcher.tsx#L21)

Custom onChange handler (called with the new locale string)

###### Parameters

###### locale

`string`

###### Returns

`void`

##### showCodes?

> `optional` **showCodes**: `boolean`

Defined in: [components/i18n/LocaleSwitcher.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/LocaleSwitcher.tsx#L23)

Show locale codes instead of names

##### size?

> `optional` **size**: `"default"` \| `"sm"` \| `"lg"`

Defined in: [components/i18n/LocaleSwitcher.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/LocaleSwitcher.tsx#L25)

Size variant

***

### TranslateProps

Defined in: [components/i18n/Translate.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/Translate.tsx#L12)

#### Properties

##### i18nKey

> **i18nKey**: `string`

Defined in: [components/i18n/Translate.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/Translate.tsx#L14)

Translation key

##### defaultValue?

> `optional` **defaultValue**: `string`

Defined in: [components/i18n/Translate.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/Translate.tsx#L16)

Default value if key is not found

##### count?

> `optional` **count**: `number`

Defined in: [components/i18n/Translate.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/Translate.tsx#L18)

Count for pluralization

##### values?

> `optional` **values**: `Record`\<`string`, `string` \| `number`\>

Defined in: [components/i18n/Translate.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/Translate.tsx#L20)

Dynamic values for interpolation

##### children()?

> `optional` **children**: (`translation`) => `ReactNode`

Defined in: [components/i18n/Translate.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/Translate.tsx#L22)

Render function for custom rendering (receives translated string)

###### Parameters

###### translation

`string`

###### Returns

`ReactNode`

##### as?

> `optional` **as**: keyof IntrinsicElements

Defined in: [components/i18n/Translate.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/Translate.tsx#L24)

HTML element to wrap the translation in

##### className?

> `optional` **className**: `string`

Defined in: [components/i18n/Translate.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/Translate.tsx#L26)

Class name for the wrapper element

***

### TranslateLabelProps

Defined in: [components/i18n/TranslateLabel.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/TranslateLabel.tsx#L13)

#### Extends

- `HTMLAttributes`\<`HTMLLabelElement`\>

#### Properties

##### source?

> `optional` **source**: `string`

Defined in: [components/i18n/TranslateLabel.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/TranslateLabel.tsx#L15)

The field source/name to generate translation key from

##### i18nKey?

> `optional` **i18nKey**: `string`

Defined in: [components/i18n/TranslateLabel.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/TranslateLabel.tsx#L17)

Direct translation key (overrides source-based key generation)

##### resource?

> `optional` **resource**: `string`

Defined in: [components/i18n/TranslateLabel.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/TranslateLabel.tsx#L19)

Resource name (defaults to current resource context)

###### Overrides

`HTMLAttributes.resource`

##### defaultLabel?

> `optional` **defaultLabel**: `string`

Defined in: [components/i18n/TranslateLabel.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/TranslateLabel.tsx#L21)

Default label if translation is not found

##### required?

> `optional` **required**: `boolean`

Defined in: [components/i18n/TranslateLabel.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/TranslateLabel.tsx#L23)

Whether this label is for a required field

##### htmlFor?

> `optional` **htmlFor**: `string`

Defined in: [components/i18n/TranslateLabel.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/TranslateLabel.tsx#L25)

HTML for attribute linking to an input

***

### DateFormatOptions

Defined in: [components/i18n/formatting.ts:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L11)

Options for date formatting

#### Extends

- `DateTimeFormatOptions`

#### Properties

##### locale?

> `optional` **locale**: `string`

Defined in: [components/i18n/formatting.ts:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L13)

Custom locale override

***

### NumberFormatOptions

Defined in: [components/i18n/formatting.ts:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L19)

Options for number formatting

#### Extends

- `NumberFormatOptions`

#### Properties

##### locale?

> `optional` **locale**: `string`

Defined in: [components/i18n/formatting.ts:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L21)

Custom locale override

***

### RelativeTimeFormatOptions

Defined in: [components/i18n/formatting.ts:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L27)

Options for relative time formatting

#### Extends

- `RelativeTimeFormatOptions`

#### Properties

##### locale?

> `optional` **locale**: `string`

Defined in: [components/i18n/formatting.ts:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L29)

Custom locale override

***

### CurrencyFormatOptions

Defined in: [components/i18n/formatting.ts:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L35)

Options for currency formatting

#### Extends

- `Omit`\<`Intl.NumberFormatOptions`, `"style"` \| `"currency"`\>

#### Properties

##### locale?

> `optional` **locale**: `string`

Defined in: [components/i18n/formatting.ts:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L37)

Custom locale override

##### currency?

> `optional` **currency**: `string`

Defined in: [components/i18n/formatting.ts:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/formatting.ts#L39)

Currency code (e.g., 'USD', 'EUR', 'GBP')

***

### UseFormattersResult

Defined in: [components/i18n/useFormatters.ts:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L28)

Return type for useFormatters hook

#### Properties

##### locale

> **locale**: `string`

Defined in: [components/i18n/useFormatters.ts:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L30)

Current locale

##### date()

> **date**: (`date`, `options?`) => `string`

Defined in: [components/i18n/useFormatters.ts:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L32)

Format a date

###### Parameters

###### date

`string` | `number` | `Date`

###### options?

[`DateFormatOptions`](#dateformatoptions)

###### Returns

`string`

##### dateTime()

> **dateTime**: (`date`, `options?`) => `string`

Defined in: [components/i18n/useFormatters.ts:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L34)

Format a date with time

###### Parameters

###### date

`string` | `number` | `Date`

###### options?

[`DateFormatOptions`](#dateformatoptions)

###### Returns

`string`

##### time()

> **time**: (`date`, `options?`) => `string`

Defined in: [components/i18n/useFormatters.ts:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L36)

Format a time

###### Parameters

###### date

`string` | `number` | `Date`

###### options?

[`DateFormatOptions`](#dateformatoptions)

###### Returns

`string`

##### number()

> **number**: (`value`, `options?`) => `string`

Defined in: [components/i18n/useFormatters.ts:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L38)

Format a number

###### Parameters

###### value

`number`

###### options?

[`NumberFormatOptions`](#numberformatoptions)

###### Returns

`string`

##### currency()

> **currency**: (`value`, `options?`) => `string`

Defined in: [components/i18n/useFormatters.ts:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L40)

Format a currency value

###### Parameters

###### value

`number`

###### options?

[`CurrencyFormatOptions`](#currencyformatoptions)

###### Returns

`string`

##### percent()

> **percent**: (`value`, `options?`) => `string`

Defined in: [components/i18n/useFormatters.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L42)

Format a percentage

###### Parameters

###### value

`number`

###### options?

[`NumberFormatOptions`](#numberformatoptions)

###### Returns

`string`

##### relativeTime()

> **relativeTime**: (`date`, `options?`) => `string`

Defined in: [components/i18n/useFormatters.ts:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L44)

Format a relative time

###### Parameters

###### date

`string` | `number` | `Date`

###### options?

[`RelativeTimeFormatOptions`](#relativetimeformatoptions)

###### Returns

`string`

##### list()

> **list**: (`items`, `options?`) => `string`

Defined in: [components/i18n/useFormatters.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/useFormatters.ts#L46)

Format a list

###### Parameters

###### items

`string`[]

###### options?

`ListFormatOptions`

###### Returns

`string`

***

### ArrayInputContextValue

Defined in: [components/input/ArrayInput.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L28)

Context value for ArrayInput

#### Properties

##### source

> **source**: `string`

Defined in: [components/input/ArrayInput.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L30)

The source/field name for the array

##### fieldArray

> **fieldArray**: `UseFieldArrayReturn`\<`FieldValues`, `string`\>

Defined in: [components/input/ArrayInput.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L32)

Field array methods from react-hook-form

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/input/ArrayInput.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L34)

Whether the array is disabled

##### defaultValue?

> `optional` **defaultValue**: `Record`\<`string`, `unknown`\> \| `unknown`[] \| `Record`\<`string`, `unknown`\>[]

Defined in: [components/input/ArrayInput.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L36)

Default value for new items

##### minItems?

> `optional` **minItems**: `number`

Defined in: [components/input/ArrayInput.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L38)

Minimum number of items

##### maxItems?

> `optional` **maxItems**: `number`

Defined in: [components/input/ArrayInput.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L40)

Maximum number of items

***

### ArrayInputProps

Defined in: [components/input/ArrayInput.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L64)

Props for ArrayInput component

#### Extends

- `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"defaultValue"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `ArrayPath`\<`T`\>

Defined in: [components/input/ArrayInput.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L69)

The field name in the form data. Maps to the array field.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/ArrayInput.tsx:75](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L75)

Label text displayed above the array.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/ArrayInput.tsx:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L79)

Helper text displayed below the array.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/ArrayInput.tsx:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L83)

Validation rules passed to react-hook-form.

##### defaultValue?

> `optional` **defaultValue**: `Record`\<`string`, `unknown`\> \| `unknown`[] \| `Record`\<`string`, `unknown`\>[]

Defined in: [components/input/ArrayInput.tsx:87](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L87)

Default value for new items when added.

##### minItems?

> `optional` **minItems**: `number`

Defined in: [components/input/ArrayInput.tsx:91](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L91)

Minimum number of items in the array.

##### maxItems?

> `optional` **maxItems**: `number`

Defined in: [components/input/ArrayInput.tsx:95](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L95)

Maximum number of items in the array.

##### minItemsMessage?

> `optional` **minItemsMessage**: `string`

Defined in: [components/input/ArrayInput.tsx:100](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L100)

Custom error message for minItems validation.
Defaults to "Minimum {minItems} items required"

##### maxItemsMessage?

> `optional` **maxItemsMessage**: `string`

Defined in: [components/input/ArrayInput.tsx:105](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L105)

Custom error message for maxItems validation.
Defaults to "Maximum {maxItems} items allowed"

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/ArrayInput.tsx:109](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L109)

Whether the input should take full width of its container.

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/input/ArrayInput.tsx:113](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L113)

Whether the input is disabled.

##### validate?

> `optional` **validate**: `ValidateProp`

Defined in: [components/input/ArrayInput.tsx:121](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L121)

ReactAdmin-compatible validators for the validate prop.
Can be a single validator or array of validators.

###### Example

```ts
validate={required()}
validate={[required(), minLength(3)]}
```

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/input/ArrayInput.tsx:125](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L125)

Children components (should include SimpleFormIterator)

###### Overrides

`Omit.children`

***

### AutocompleteArrayInputProps

Defined in: [components/input/AutocompleteArrayInput.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L35)

Props for AutocompleteArrayInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"` \| `"value"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source?

> `optional` **source**: `Path`\<`T`\>

Defined in: [components/input/AutocompleteArrayInput.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L41)

The field name in the form data.
Optional when used inside ReferenceInput (provided via context).

##### choices?

> `optional` **choices**: `Record`\<`string`, `unknown`\>[]

Defined in: [components/input/AutocompleteArrayInput.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L46)

Array of choices to display in the autocomplete dropdown.
Optional when used inside ReferenceInput (provided via context).

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/AutocompleteArrayInput.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L51)

Label text displayed above the input.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/AutocompleteArrayInput.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L55)

Helper text displayed below the input.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/AutocompleteArrayInput.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L59)

Validation rules passed to react-hook-form.

##### validate?

> `optional` **validate**: `ValidateProp`

Defined in: [components/input/AutocompleteArrayInput.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L64)

ReactAdmin-compatible validators for the validate prop.
Can be a single validator or array of validators.

##### optionValue?

> `optional` **optionValue**: `string`

Defined in: [components/input/AutocompleteArrayInput.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L69)

The property name to use as the option value.

###### Default

```ts
'id'
```

##### optionText?

> `optional` **optionText**: `string` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| (`choice`) => `string`

Defined in: [components/input/AutocompleteArrayInput.tsx:75](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L75)

The property name to use as the option text, a function to render custom text,
or a React element for custom rendering.

###### Default

```ts
'name'
```

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/AutocompleteArrayInput.tsx:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L79)

Whether the input should take full width of its container.

##### create?

> `optional` **create**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| (`value`) => `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [components/input/AutocompleteArrayInput.tsx:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L85)

Callback to create a new option when the user types a value not in the choices.
Should return a promise that resolves to the new choice object.
Can also be a React element to render a create dialog.

##### ~~onCreate()?~~

> `optional` **onCreate**: (`value`) => `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [components/input/AutocompleteArrayInput.tsx:90](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L90)

Legacy prop for create - alias for `create`.

###### Parameters

###### value

`string`

###### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

###### Deprecated

Use `create` instead

##### debounce?

> `optional` **debounce**: `number`

Defined in: [components/input/AutocompleteArrayInput.tsx:95](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L95)

Debounce delay in milliseconds for filtering.

###### Default

```ts
0
```

##### openOnFocus?

> `optional` **openOnFocus**: `boolean`

Defined in: [components/input/AutocompleteArrayInput.tsx:100](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L100)

Open the suggestions dropdown on focus.

###### Default

```ts
true
```

##### defaultValue?

> `optional` **defaultValue**: `string`[]

Defined in: [components/input/AutocompleteArrayInput.tsx:104](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L104)

Default value for the field (array of values).

##### matchSuggestion()?

> `optional` **matchSuggestion**: (`filterValue`, `suggestion`) => `boolean`

Defined in: [components/input/AutocompleteArrayInput.tsx:109](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L109)

Custom function to determine if a suggestion matches the filter value.
Useful for custom matching logic beyond simple text includes.

###### Parameters

###### filterValue

`any`

###### suggestion

`any`

###### Returns

`boolean`

##### inputText()?

> `optional` **inputText**: (`record`) => `string`

Defined in: [components/input/AutocompleteArrayInput.tsx:114](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L114)

Custom function to get the input text to display for a selected record.
Useful when the display text differs from the option text.

###### Parameters

###### record

`any`

###### Returns

`string`

***

### AutocompleteInputProps

Defined in: [components/input/AutocompleteInput.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L34)

Props for AutocompleteInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source?

> `optional` **source**: `Path`\<`T`\>

Defined in: [components/input/AutocompleteInput.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L40)

The field name in the form data.
Optional when used inside ReferenceInput (provided via context).

##### choices?

> `optional` **choices**: `Record`\<`string`, `unknown`\>[]

Defined in: [components/input/AutocompleteInput.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L45)

Array of choices to display in the autocomplete dropdown.
Optional when used inside ReferenceInput (provided via context).

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/AutocompleteInput.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L50)

Label text displayed above the input.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string` \| `false`

Defined in: [components/input/AutocompleteInput.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L55)

Helper text displayed below the input.
Set to `false` to hide the helper text completely.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/AutocompleteInput.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L59)

Validation rules passed to react-hook-form.

##### validate?

> `optional` **validate**: `ValidateProp`

Defined in: [components/input/AutocompleteInput.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L64)

ReactAdmin-compatible validators for the validate prop.
Can be a single validator or array of validators.

##### optionValue?

> `optional` **optionValue**: `string`

Defined in: [components/input/AutocompleteInput.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L69)

The property name to use as the option value.

###### Default

```ts
'id'
```

##### optionText?

> `optional` **optionText**: `string` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| (`choice`) => `string`

Defined in: [components/input/AutocompleteInput.tsx:76](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L76)

The property name to use as the option text, a function to render custom text,
or a React element for custom rendering.

###### Default

```ts
'name'
```

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/AutocompleteInput.tsx:80](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L80)

Whether the input should take full width of its container.

##### create?

> `optional` **create**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| (`value`) => `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [components/input/AutocompleteInput.tsx:86](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L86)

Callback to create a new option when the user types a value not in the choices.
Should return a promise that resolves to the new choice object.
Can also be a React element to render a create dialog.

##### ~~onCreate()?~~

> `optional` **onCreate**: (`value`) => `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [components/input/AutocompleteInput.tsx:91](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L91)

Legacy prop for create - alias for `create`.

###### Parameters

###### value

`string`

###### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

###### Deprecated

Use `create` instead

##### debounce?

> `optional` **debounce**: `number`

Defined in: [components/input/AutocompleteInput.tsx:96](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L96)

Debounce delay in milliseconds for filtering.

###### Default

```ts
0
```

##### openOnFocus?

> `optional` **openOnFocus**: `boolean`

Defined in: [components/input/AutocompleteInput.tsx:101](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L101)

Open the suggestions dropdown on focus.

###### Default

```ts
true
```

##### defaultValue?

> `optional` **defaultValue**: `string`

Defined in: [components/input/AutocompleteInput.tsx:105](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L105)

Default value for the field.

##### matchSuggestion()?

> `optional` **matchSuggestion**: (`filterValue`, `suggestion`) => `boolean`

Defined in: [components/input/AutocompleteInput.tsx:110](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L110)

Custom function to determine if a suggestion matches the filter value.
Useful for custom matching logic beyond simple text includes.

###### Parameters

###### filterValue

`any`

###### suggestion

`any`

###### Returns

`boolean`

##### inputText()?

> `optional` **inputText**: (`record`) => `string`

Defined in: [components/input/AutocompleteInput.tsx:115](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L115)

Custom function to get the input text to display for a selected record.
Useful when the display text differs from the option text.

###### Parameters

###### record

`any`

###### Returns

`string`

***

### BooleanInputProps

Defined in: [components/input/BooleanInput.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/BooleanInput.tsx#L14)

Props for BooleanInput component

#### Extends

- `Omit`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>, `"name"` \| `"defaultValue"` \| `"type"` \| `"role"` \| `"value"` \| `"onChange"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/BooleanInput.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/BooleanInput.tsx#L19)

The field name in the form data. Maps to the `name` attribute on the switch.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/BooleanInput.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/BooleanInput.tsx#L25)

Label text displayed next to the switch.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/BooleanInput.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/BooleanInput.tsx#L29)

Helper text displayed below the switch.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/BooleanInput.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/BooleanInput.tsx#L33)

Validation rules passed to react-hook-form.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/BooleanInput.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/BooleanInput.tsx#L37)

Whether the switch should take full width of its container.

##### defaultValue?

> `optional` **defaultValue**: `boolean`

Defined in: [components/input/BooleanInput.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/BooleanInput.tsx#L41)

Default value for the field.

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"`

Defined in: [components/input/BooleanInput.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/BooleanInput.tsx#L48)

Size of the switch.
- "small" or "sm": Small size
- "default": Default size
- "lg": Large size

***

### CheckboxGroupInputProps

Defined in: [components/input/CheckboxGroupInput.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L19)

Props for CheckboxGroupInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"` \| `"type"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/CheckboxGroupInput.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L24)

The field name in the form data. Maps to the `name` attribute on the checkboxes.

##### choices

> **choices**: `Record`\<`string`, `unknown`\>[]

Defined in: [components/input/CheckboxGroupInput.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L28)

Array of choices to display as checkboxes.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/CheckboxGroupInput.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L34)

Label text displayed above the checkbox group.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/CheckboxGroupInput.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L38)

Helper text displayed below the checkbox group.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/CheckboxGroupInput.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L42)

Validation rules passed to react-hook-form.

##### optionValue?

> `optional` **optionValue**: `string`

Defined in: [components/input/CheckboxGroupInput.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L47)

The property name to use as the option value.

###### Default

```ts
'id'
```

##### optionText?

> `optional` **optionText**: `string` \| (`choice`) => `string`

Defined in: [components/input/CheckboxGroupInput.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L53)

The property name to use as the option text, or a function to render custom text.

###### Default

```ts
'name'
```

##### disableValue?

> `optional` **disableValue**: `string`

Defined in: [components/input/CheckboxGroupInput.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L57)

The property name to check for disabling individual options.

##### row?

> `optional` **row**: `boolean`

Defined in: [components/input/CheckboxGroupInput.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L62)

Whether to display checkboxes in a row (horizontal).

###### Default

```ts
false (vertical/column layout)
```

***

### DateInputProps

Defined in: [components/input/DateInput.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L14)

Props for DateInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"` \| `"type"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/DateInput.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L19)

The field name in the form data. Maps to the `name` attribute on the input.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/DateInput.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L25)

Label text displayed above the input.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/DateInput.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L29)

Helper text displayed below the input.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/DateInput.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L33)

Validation rules passed to react-hook-form.

##### inputProps?

> `optional` **inputProps**: `InputHTMLAttributes`\<`HTMLInputElement`\>

Defined in: [components/input/DateInput.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L37)

Additional props passed directly to the input element.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/DateInput.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L41)

Whether the input should take full width of its container.

##### minMessage?

> `optional` **minMessage**: `string`

Defined in: [components/input/DateInput.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L46)

Custom error message when date is before the min date.
Defaults to "Date must be on or after {min}"

##### maxMessage?

> `optional` **maxMessage**: `string`

Defined in: [components/input/DateInput.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L51)

Custom error message when date is after the max date.
Defaults to "Date must be on or before {max}"

##### defaultValue?

> `optional` **defaultValue**: `string` \| `Date`

Defined in: [components/input/DateInput.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L56)

Default value for the field.
Accepts ISO date string format (YYYY-MM-DD) or a Date object.

***

### DateTimeInputProps

Defined in: [components/input/DateTimeInput.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateTimeInput.tsx#L14)

Props for DateTimeInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"` \| `"type"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/DateTimeInput.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateTimeInput.tsx#L19)

The field name in the form data. Maps to the `name` attribute on the input.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/DateTimeInput.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateTimeInput.tsx#L25)

Label text displayed above the input.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/DateTimeInput.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateTimeInput.tsx#L29)

Helper text displayed below the input.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/DateTimeInput.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateTimeInput.tsx#L33)

Validation rules passed to react-hook-form.

##### inputProps?

> `optional` **inputProps**: `InputHTMLAttributes`\<`HTMLInputElement`\>

Defined in: [components/input/DateTimeInput.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateTimeInput.tsx#L37)

Additional props passed directly to the input element.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/DateTimeInput.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateTimeInput.tsx#L41)

Whether the input should take full width of its container.

***

### FileInputProps

Defined in: [components/input/FileInput.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/FileInput.tsx#L25)

Props for FileInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"` \| `"type"` \| `"value"` \| `"accept"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/FileInput.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/FileInput.tsx#L30)

The field name in the form data. Maps to the `name` attribute on the input.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/FileInput.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/FileInput.tsx#L36)

Label text displayed above the input.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/FileInput.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/FileInput.tsx#L40)

Helper text displayed below the input.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/FileInput.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/FileInput.tsx#L44)

Validation rules passed to react-hook-form.

##### inputProps?

> `optional` **inputProps**: `InputHTMLAttributes`\<`HTMLInputElement`\>

Defined in: [components/input/FileInput.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/FileInput.tsx#L48)

Additional props passed directly to the input element.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/FileInput.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/FileInput.tsx#L52)

Whether the input should take full width of its container.

##### accept?

> `optional` **accept**: `AcceptProp`

Defined in: [components/input/FileInput.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/FileInput.tsx#L60)

Accepted file types. Can be a string (native HTML) or an object
mapping MIME types to extensions (react-admin/react-dropzone style).

###### Example

```ts
accept="image/*"
accept={{ 'image/*': ['.png', '.jpg'] }}
```

##### defaultValue?

> `optional` **defaultValue**: `File` \| `File`[]

Defined in: [components/input/FileInput.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/FileInput.tsx#L64)

Default value for the field.

***

### ImageInputProps

Defined in: [components/input/ImageInput.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ImageInput.tsx#L32)

Props for ImageInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"` \| `"type"` \| `"value"` \| `"onChange"` \| `"accept"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/ImageInput.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ImageInput.tsx#L37)

The field name in the form data. Maps to the `name` attribute on the input.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/ImageInput.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ImageInput.tsx#L43)

Label text displayed above the input.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/ImageInput.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ImageInput.tsx#L47)

Helper text displayed below the input.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/ImageInput.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ImageInput.tsx#L51)

Validation rules passed to react-hook-form.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/ImageInput.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ImageInput.tsx#L55)

Whether the input should take full width of its container.

##### maxSize?

> `optional` **maxSize**: `number`

Defined in: [components/input/ImageInput.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ImageInput.tsx#L59)

Maximum file size in bytes. Files larger than this will be rejected.

##### accept?

> `optional` **accept**: `ImageAcceptProp`

Defined in: [components/input/ImageInput.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ImageInput.tsx#L67)

Accept specific file types. Can be a string or an object mapping
MIME types to extensions. Defaults to "image/*".

###### Example

```ts
accept="image/*"
accept={{ 'image/*': ['.png', '.jpg'] }}
```

##### defaultValue?

> `optional` **defaultValue**: `File` \| `File`[]

Defined in: [components/input/ImageInput.tsx:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ImageInput.tsx#L71)

Default value for the field.

***

### NumberInputProps

Defined in: [components/input/NumberInput.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/NumberInput.tsx#L15)

Props for NumberInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"` \| `"type"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/NumberInput.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/NumberInput.tsx#L20)

The field name in the form data. Maps to the `name` attribute on the input.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/NumberInput.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/NumberInput.tsx#L26)

Label text displayed above the input.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/NumberInput.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/NumberInput.tsx#L30)

Helper text displayed below the input.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/NumberInput.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/NumberInput.tsx#L34)

Validation rules passed to react-hook-form.

##### validate?

> `optional` **validate**: `ValidateProp`

Defined in: [components/input/NumberInput.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/NumberInput.tsx#L42)

ReactAdmin-compatible validators for the validate prop.
Can be a single validator or array of validators.

###### Example

```ts
validate={required()}
validate={[required(), minValue(0)]}
```

##### inputProps?

> `optional` **inputProps**: `InputHTMLAttributes`\<`HTMLInputElement`\>

Defined in: [components/input/NumberInput.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/NumberInput.tsx#L46)

Additional props passed directly to the input element.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/NumberInput.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/NumberInput.tsx#L50)

Whether the input should take full width of its container.

##### defaultValue?

> `optional` **defaultValue**: `number`

Defined in: [components/input/NumberInput.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/NumberInput.tsx#L54)

Default value for the field.

***

### PasswordInputProps

Defined in: [components/input/PasswordInput.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/PasswordInput.tsx#L14)

Props for PasswordInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"` \| `"type"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/PasswordInput.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/PasswordInput.tsx#L19)

The field name in the form data. Maps to the `name` attribute on the input.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/PasswordInput.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/PasswordInput.tsx#L25)

Label text displayed above the input.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/PasswordInput.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/PasswordInput.tsx#L29)

Helper text displayed below the input.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/PasswordInput.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/PasswordInput.tsx#L33)

Validation rules passed to react-hook-form.

##### inputProps?

> `optional` **inputProps**: `InputHTMLAttributes`\<`HTMLInputElement`\>

Defined in: [components/input/PasswordInput.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/PasswordInput.tsx#L37)

Additional props passed directly to the input element.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/PasswordInput.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/PasswordInput.tsx#L41)

Whether the input should take full width of its container.

***

### RadioButtonGroupInputProps

Defined in: [components/input/RadioButtonGroupInput.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L18)

Props for RadioButtonGroupInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"` \| `"type"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/RadioButtonGroupInput.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L23)

The field name in the form data. Maps to the `name` attribute on the radios.

##### choices

> **choices**: `Record`\<`string`, `unknown`\>[]

Defined in: [components/input/RadioButtonGroupInput.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L27)

Array of choices to display as radio buttons.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/RadioButtonGroupInput.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L33)

Label text displayed above the radio group.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/RadioButtonGroupInput.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L37)

Helper text displayed below the radio group.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/RadioButtonGroupInput.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L41)

Validation rules passed to react-hook-form.

##### optionValue?

> `optional` **optionValue**: `string`

Defined in: [components/input/RadioButtonGroupInput.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L46)

The property name to use as the option value.

###### Default

```ts
'id'
```

##### optionText?

> `optional` **optionText**: `string` \| (`choice`) => `string`

Defined in: [components/input/RadioButtonGroupInput.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L52)

The property name to use as the option text, or a function to render custom text.

###### Default

```ts
'name'
```

##### disableValue?

> `optional` **disableValue**: `string`

Defined in: [components/input/RadioButtonGroupInput.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L56)

The property name to check for disabling individual options.

##### row?

> `optional` **row**: `boolean`

Defined in: [components/input/RadioButtonGroupInput.tsx:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L61)

Whether to display radio buttons in a row (horizontal).

###### Default

```ts
false (vertical/column layout)
```

***

### ReferenceArrayInputProps

Defined in: [components/input/ReferenceArrayInput.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceArrayInput.tsx#L17)

Props for ReferenceArrayInput component

#### Properties

##### source

> **source**: `string`

Defined in: [components/input/ReferenceArrayInput.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceArrayInput.tsx#L21)

The field name in the form data. Maps to the stored array of IDs.

##### reference

> **reference**: `string`

Defined in: [components/input/ReferenceArrayInput.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceArrayInput.tsx#L25)

The name of the resource to fetch choices from.

##### filter?

> `optional` **filter**: `Record`\<`string`, `unknown`\>

Defined in: [components/input/ReferenceArrayInput.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceArrayInput.tsx#L29)

Filter to apply when fetching choices from the referenced resource.

##### sort?

> `optional` **sort**: `object`

Defined in: [components/input/ReferenceArrayInput.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceArrayInput.tsx#L33)

Sort configuration for fetching choices.

###### field

> **field**: `string`

###### order

> **order**: `"ASC"` \| `"DESC"`

##### perPage?

> `optional` **perPage**: `number`

Defined in: [components/input/ReferenceArrayInput.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceArrayInput.tsx#L41)

Number of records to fetch per page.

###### Default

```ts
25
```

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/input/ReferenceArrayInput.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceArrayInput.tsx#L45)

Whether the input is disabled.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/ReferenceArrayInput.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceArrayInput.tsx#L49)

Label text for the input.

##### children

> **children**: `ReactNode`

Defined in: [components/input/ReferenceArrayInput.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceArrayInput.tsx#L53)

Child component that receives the choices (SelectArrayInput, CheckboxGroupInput, etc.)

***

### ReferenceSort

Defined in: [components/input/ReferenceInput.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L23)

Sort configuration for fetching choices

#### Properties

##### field

> **field**: `string`

Defined in: [components/input/ReferenceInput.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L24)

##### order

> **order**: `"ASC"` \| `"DESC"`

Defined in: [components/input/ReferenceInput.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L25)

***

### ReferenceInputProps

Defined in: [components/input/ReferenceInput.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L31)

Props for ReferenceInput component

#### Properties

##### source

> **source**: `string`

Defined in: [components/input/ReferenceInput.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L35)

The field name in the form data that will hold the reference ID

##### reference

> **reference**: `string`

Defined in: [components/input/ReferenceInput.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L39)

The referenced resource name to fetch choices from

##### children?

> `optional` **children**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/input/ReferenceInput.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L44)

Child input component (SelectInput or AutocompleteInput)
Defaults to AutocompleteInput if not provided

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/ReferenceInput.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L48)

Label text displayed above the input

##### filter?

> `optional` **filter**: `Record`\<`string`, `unknown`\>

Defined in: [components/input/ReferenceInput.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L52)

Filter object to apply when fetching choices

##### sort?

> `optional` **sort**: [`ReferenceSort`](#referencesort)

Defined in: [components/input/ReferenceInput.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L56)

Sort configuration for the fetched choices

##### perPage?

> `optional` **perPage**: `number`

Defined in: [components/input/ReferenceInput.tsx:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L61)

Number of choices to fetch per page

###### Default

```ts
25
```

##### optionValue?

> `optional` **optionValue**: `string`

Defined in: [components/input/ReferenceInput.tsx:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L66)

The property name to use as the option value

###### Default

```ts
'id'
```

##### optionText?

> `optional` **optionText**: `string` \| (`record`) => `string`

Defined in: [components/input/ReferenceInput.tsx:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L71)

The property name or function to use for option text

###### Default

```ts
'name'
```

##### emptyText?

> `optional` **emptyText**: `string`

Defined in: [components/input/ReferenceInput.tsx:75](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L75)

Text for the empty/placeholder option

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/input/ReferenceInput.tsx:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L79)

Whether the input is disabled

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/ReferenceInput.tsx:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L83)

Helper text displayed below the input

##### className?

> `optional` **className**: `string`

Defined in: [components/input/ReferenceInput.tsx:87](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L87)

Additional CSS class name

***

### RichTextInputProps

Defined in: [components/input/RichTextInput.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RichTextInput.tsx#L30)

Props for RichTextInput component

#### Extends

- `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"defaultValue"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/RichTextInput.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RichTextInput.tsx#L35)

The field name in the form data. Maps to the `name` attribute on the input.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/RichTextInput.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RichTextInput.tsx#L41)

Label text displayed above the editor.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/RichTextInput.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RichTextInput.tsx#L45)

Helper text displayed below the editor.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/RichTextInput.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RichTextInput.tsx#L49)

Validation rules passed to react-hook-form.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/RichTextInput.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RichTextInput.tsx#L53)

Whether the editor should take full width of its container.

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/input/RichTextInput.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RichTextInput.tsx#L57)

Whether the editor is disabled.

##### required?

> `optional` **required**: `boolean`

Defined in: [components/input/RichTextInput.tsx:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RichTextInput.tsx#L61)

Whether the field is required.

***

### SelectArrayInputProps

Defined in: [components/input/SelectArrayInput.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L18)

Props for SelectArrayInput component

#### Extends

- `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"defaultValue"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/SelectArrayInput.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L23)

The field name in the form data. Maps to the stored array value.

##### choices

> **choices**: `Record`\<`string`, `unknown`\>[]

Defined in: [components/input/SelectArrayInput.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L27)

Array of choices to display in the select.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/SelectArrayInput.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L33)

Label text displayed above the select.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/SelectArrayInput.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L37)

Helper text displayed below the select.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/SelectArrayInput.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L41)

Validation rules passed to react-hook-form.

##### optionValue?

> `optional` **optionValue**: `string`

Defined in: [components/input/SelectArrayInput.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L46)

The property name to use as the option value.

###### Default

```ts
'id'
```

##### optionText?

> `optional` **optionText**: `string` \| (`choice`) => `string`

Defined in: [components/input/SelectArrayInput.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L52)

The property name to use as the option text, or a function to render custom text.

###### Default

```ts
'name'
```

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/SelectArrayInput.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L56)

Whether the select should take full width of its container.

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/input/SelectArrayInput.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L60)

Whether the input is disabled.

##### required?

> `optional` **required**: `boolean`

Defined in: [components/input/SelectArrayInput.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L64)

Whether the input is required.

***

### SelectInputProps

Defined in: [components/input/SelectInput.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L21)

Props for SelectInput component

#### Extends

- `Omit`\<`SelectHTMLAttributes`\<`HTMLSelectElement`\>, `"name"` \| `"defaultValue"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

The form field values type (from react-hook-form)

#### Properties

##### source?

> `optional` **source**: `Path`\<`T`\>

Defined in: [components/input/SelectInput.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L27)

The field name in the form data. Maps to the `name` attribute on the select.
Optional when used inside ReferenceInput (provided via context).

##### choices?

> `optional` **choices**: `Record`\<`string`, `unknown`\>[]

Defined in: [components/input/SelectInput.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L32)

Array of choices to display in the select dropdown.
Optional when used inside ReferenceInput (provided via context).

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/SelectInput.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L38)

Label text displayed above the select.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string` \| `false`

Defined in: [components/input/SelectInput.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L43)

Helper text displayed below the select.
Set to `false` to hide the helper text completely.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/SelectInput.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L47)

Validation rules passed to react-hook-form.

##### validate?

> `optional` **validate**: `ValidateProp`

Defined in: [components/input/SelectInput.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L52)

ReactAdmin-compatible validators for the validate prop.
Can be a single validator or array of validators.

##### optionValue?

> `optional` **optionValue**: `string`

Defined in: [components/input/SelectInput.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L57)

The property name to use as the option value.

###### Default

```ts
'id'
```

##### optionText?

> `optional` **optionText**: `string` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| (`choice`) => `string`

Defined in: [components/input/SelectInput.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L64)

The property name to use as the option text, a function to render custom text,
or a React element for custom rendering.

###### Default

```ts
'name'
```

##### emptyText?

> `optional` **emptyText**: `string`

Defined in: [components/input/SelectInput.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L69)

Text to display for the empty/placeholder option.
If not provided, no empty option is rendered.

##### disableValue?

> `optional` **disableValue**: `string`

Defined in: [components/input/SelectInput.tsx:73](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L73)

The property name to check for disabling individual options.

##### selectProps?

> `optional` **selectProps**: `SelectHTMLAttributes`\<`HTMLSelectElement`\>

Defined in: [components/input/SelectInput.tsx:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L77)

Additional props passed directly to the select element.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/SelectInput.tsx:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L81)

Whether the select should take full width of its container.

##### create?

> `optional` **create**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/input/SelectInput.tsx:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L85)

React element to render for creating new options.

##### defaultValue?

> `optional` **defaultValue**: `string`

Defined in: [components/input/SelectInput.tsx:89](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L89)

Default value for the field.

##### resettable?

> `optional` **resettable**: `boolean`

Defined in: [components/input/SelectInput.tsx:94](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L94)

If true, displays a clear button to reset the field value.
React-admin compatible prop.

***

### SimpleFormIteratorProps

Defined in: [components/input/SimpleFormIterator.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SimpleFormIterator.tsx#L44)

Props for SimpleFormIterator component

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/input/SimpleFormIterator.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SimpleFormIterator.tsx#L48)

Children to render for each array item

##### inline?

> `optional` **inline**: `boolean`

Defined in: [components/input/SimpleFormIterator.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SimpleFormIterator.tsx#L52)

Whether to render items inline

##### disableAdd?

> `optional` **disableAdd**: `boolean`

Defined in: [components/input/SimpleFormIterator.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SimpleFormIterator.tsx#L56)

Whether to disable the add button

##### disableRemove?

> `optional` **disableRemove**: `boolean`

Defined in: [components/input/SimpleFormIterator.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SimpleFormIterator.tsx#L60)

Whether to disable the remove button

##### addButton?

> `optional` **addButton**: `ReactNode`

Defined in: [components/input/SimpleFormIterator.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SimpleFormIterator.tsx#L64)

Custom add button text or element

##### getItemLabel()?

> `optional` **getItemLabel**: (`index`) => `string`

Defined in: [components/input/SimpleFormIterator.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SimpleFormIterator.tsx#L68)

Function to get item label

###### Parameters

###### index

`number`

###### Returns

`string`

##### className?

> `optional` **className**: `string`

Defined in: [components/input/SimpleFormIterator.tsx:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SimpleFormIterator.tsx#L72)

Additional CSS classes

***

### TextInputProps

Defined in: [components/input/TextInput.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L15)

Props for TextInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/TextInput.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L20)

The field name in the form data. Maps to the `name` attribute on the input.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/TextInput.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L26)

Label text displayed above the input.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/TextInput.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L30)

Helper text displayed below the input.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/TextInput.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L34)

Validation rules passed to react-hook-form.

##### validate?

> `optional` **validate**: `ValidateProp`

Defined in: [components/input/TextInput.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L42)

ReactAdmin-compatible validators for the validate prop.
Can be a single validator or array of validators.

###### Example

```ts
validate={required()}
validate={[required(), minLength(3)]}
```

##### inputProps?

> `optional` **inputProps**: `InputHTMLAttributes`\<`HTMLInputElement`\>

Defined in: [components/input/TextInput.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L46)

Additional props passed directly to the input element.

##### InputProps?

> `optional` **InputProps**: `InputHTMLAttributes`\<`HTMLInputElement`\>

Defined in: [components/input/TextInput.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L51)

Props passed to the underlying Input component (Material-UI style passthrough).
Alias for inputProps for react-admin compatibility.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/TextInput.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L55)

Whether the input should take full width of its container.

##### multiline?

> `optional` **multiline**: `boolean`

Defined in: [components/input/TextInput.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L60)

If true, renders a textarea element instead of an input.
For react-admin compatibility.

##### rows?

> `optional` **rows**: `number`

Defined in: [components/input/TextInput.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L64)

Number of rows for multiline mode.

##### defaultValue?

> `optional` **defaultValue**: `string`

Defined in: [components/input/TextInput.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L68)

Default value for the field.

##### resettable?

> `optional` **resettable**: `boolean`

Defined in: [components/input/TextInput.tsx:73](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L73)

If true, displays a clear button to reset the field value.
React-admin compatible prop.

***

### TimeInputProps

Defined in: [components/input/TimeInput.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TimeInput.tsx#L14)

Props for TimeInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"name"` \| `"defaultValue"` \| `"type"`\>

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### source

> **source**: `Path`\<`T`\>

Defined in: [components/input/TimeInput.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TimeInput.tsx#L19)

The field name in the form data. Maps to the `name` attribute on the input.

##### label?

> `optional` **label**: `string` \| `false`

Defined in: [components/input/TimeInput.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TimeInput.tsx#L25)

Label text displayed above the input.
If not provided, uses the source field name.
Set to `false` to hide the label completely.

##### helperText?

> `optional` **helperText**: `string`

Defined in: [components/input/TimeInput.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TimeInput.tsx#L29)

Helper text displayed below the input.

##### rules?

> `optional` **rules**: `RegisterOptions`\<`T`\>

Defined in: [components/input/TimeInput.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TimeInput.tsx#L33)

Validation rules passed to react-hook-form.

##### inputProps?

> `optional` **inputProps**: `InputHTMLAttributes`\<`HTMLInputElement`\>

Defined in: [components/input/TimeInput.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TimeInput.tsx#L37)

Additional props passed directly to the input element.

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/TimeInput.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TimeInput.tsx#L41)

Whether the input should take full width of its container.

##### minMessage?

> `optional` **minMessage**: `string`

Defined in: [components/input/TimeInput.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TimeInput.tsx#L46)

Custom error message when time is before the min time.
Defaults to "Time must be on or after {min}"

##### maxMessage?

> `optional` **maxMessage**: `string`

Defined in: [components/input/TimeInput.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TimeInput.tsx#L51)

Custom error message when time is after the max time.
Defaults to "Time must be on or before {max}"

***

### TranslatableInputsContextValue

Defined in: [components/input/TranslatableInputs.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L23)

Context value for TranslatableInputs

#### Properties

##### selectedLocale

> **selectedLocale**: `string`

Defined in: [components/input/TranslatableInputs.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L27)

Currently selected locale

##### selectLocale()

> **selectLocale**: (`locale`) => `void`

Defined in: [components/input/TranslatableInputs.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L31)

Set the selected locale

###### Parameters

###### locale

`string`

###### Returns

`void`

##### locales

> **locales**: `string`[]

Defined in: [components/input/TranslatableInputs.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L35)

All available locales

##### defaultLocale

> **defaultLocale**: `string`

Defined in: [components/input/TranslatableInputs.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L39)

Default locale

##### getSource()

> **getSource**: (`source`) => `string`

Defined in: [components/input/TranslatableInputs.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L43)

Get the source path for a field in the current locale

###### Parameters

###### source

`string`

###### Returns

`string`

##### getLabelSuffix()

> **getLabelSuffix**: () => `string`

Defined in: [components/input/TranslatableInputs.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L47)

Get the label suffix for the current locale

###### Returns

`string`

***

### TranslatableInputsProps

Defined in: [components/input/TranslatableInputs.tsx:75](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L75)

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/input/TranslatableInputs.tsx:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L79)

Input components to display with translation support

##### locales

> **locales**: `string`[]

Defined in: [components/input/TranslatableInputs.tsx:84](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L84)

Available locales

###### Example

```ts
['en', 'fr', 'de']
```

##### defaultLocale?

> `optional` **defaultLocale**: `string`

Defined in: [components/input/TranslatableInputs.tsx:89](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L89)

Default locale to display

###### Default

```ts
first locale in the array
```

##### className?

> `optional` **className**: `string`

Defined in: [components/input/TranslatableInputs.tsx:93](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L93)

Additional CSS class for the container

##### onLocaleChange()?

> `optional` **onLocaleChange**: (`locale`) => `void`

Defined in: [components/input/TranslatableInputs.tsx:97](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L97)

Callback when locale changes

###### Parameters

###### locale

`string`

###### Returns

`void`

##### selector?

> `optional` **selector**: `"select"` \| `"tabs"`

Defined in: [components/input/TranslatableInputs.tsx:102](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L102)

Whether to use tabs for locale selection

###### Default

```ts
'tabs'
```

##### localeLabels?

> `optional` **localeLabels**: `Record`\<`string`, `string`\>

Defined in: [components/input/TranslatableInputs.tsx:107](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L107)

Labels for each locale

###### Example

```ts
{ en: 'English', fr: 'French', de: 'German' }
```

##### gap?

> `optional` **gap**: `string`

Defined in: [components/input/TranslatableInputs.tsx:112](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L112)

Gap between inputs

###### Default

```ts
'gap-4'
```

##### pattern?

> `optional` **pattern**: `"suffix"` \| `"nested"`

Defined in: [components/input/TranslatableInputs.tsx:119](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L119)

The field name pattern for translations
'suffix' - field name becomes source_locale (e.g., title_en)
'nested' - field name becomes locale.source (e.g., en.title)

###### Default

```ts
'suffix'
```

##### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [components/input/TranslatableInputs.tsx:124](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TranslatableInputs.tsx#L124)

Whether to show all locales at once or just the selected one

###### Default

```ts
false
```

***

### IdNameChoice

Defined in: [components/input/types.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L26)

Base interface for choices using id/name pattern.
This is the most common pattern for choice objects.

#### Example

```tsx
const statusChoices: IdNameChoice[] = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
]
```

#### Indexable

\[`key`: `string`\]: `unknown`

#### Properties

##### id

> **id**: [`ChoiceValue`](#choicevalue)

Defined in: [components/input/types.ts:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L27)

##### name

> **name**: `string`

Defined in: [components/input/types.ts:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L28)

***

### ValueLabelChoice

Defined in: [components/input/types.ts:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L44)

Base interface for choices using value/label pattern.
Common in HTML native select elements and some UI libraries.

#### Example

```tsx
const countryChoices: ValueLabelChoice[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
]
```

#### Indexable

\[`key`: `string`\]: `unknown`

#### Properties

##### value

> **value**: [`ChoiceValue`](#choicevalue)

Defined in: [components/input/types.ts:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L45)

##### label

> **label**: `string`

Defined in: [components/input/types.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L46)

***

### AppBarUser

Defined in: [components/layout/AppBar.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L22)

#### Properties

##### name

> **name**: `string`

Defined in: [components/layout/AppBar.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L23)

##### avatar?

> `optional` **avatar**: `string`

Defined in: [components/layout/AppBar.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L24)

##### email?

> `optional` **email**: `string`

Defined in: [components/layout/AppBar.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L25)

***

### AppBarProps

Defined in: [components/layout/AppBar.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L28)

#### Properties

##### title?

> `optional` **title**: `string`

Defined in: [components/layout/AppBar.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L30)

AppBar title

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/layout/AppBar.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L32)

Child elements (rendered as actions)

##### user?

> `optional` **user**: [`AppBarUser`](#appbaruser)

Defined in: [components/layout/AppBar.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L34)

User data for user menu. If not provided, uses useGetIdentity hook

##### className?

> `optional` **className**: `string`

Defined in: [components/layout/AppBar.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L36)

Additional CSS class

##### showSidebarTrigger?

> `optional` **showSidebarTrigger**: `boolean`

Defined in: [components/layout/AppBar.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L38)

Show sidebar trigger

##### leftContent?

> `optional` **leftContent**: `ReactNode`

Defined in: [components/layout/AppBar.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L40)

Custom left content

##### rightContent?

> `optional` **rightContent**: `ReactNode`

Defined in: [components/layout/AppBar.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L42)

Custom right content

##### showThemeToggle?

> `optional` **showThemeToggle**: `boolean`

Defined in: [components/layout/AppBar.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L44)

Show theme toggle

##### onThemeToggle()?

> `optional` **onThemeToggle**: () => `void`

Defined in: [components/layout/AppBar.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L46)

Theme toggle callback

###### Returns

`void`

##### onProfile()?

> `optional` **onProfile**: () => `void`

Defined in: [components/layout/AppBar.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L48)

Profile button callback

###### Returns

`void`

##### onLogout()?

> `optional` **onLogout**: () => `void`

Defined in: [components/layout/AppBar.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L50)

Logout button callback. If not provided, uses useLogout hook

###### Returns

`void`

##### showUserMenu?

> `optional` **showUserMenu**: `boolean`

Defined in: [components/layout/AppBar.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/AppBar.tsx#L52)

Show user menu even if user data is not available

***

### LayoutProps

Defined in: [components/layout/Layout.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L37)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/layout/Layout.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L39)

Main content

##### sidebar?

> `optional` **sidebar**: `ReactNode` \| `ComponentType`

Defined in: [components/layout/Layout.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L41)

Custom sidebar component - can be a ReactNode or a ComponentType

##### appBar?

> `optional` **appBar**: `ReactNode` \| `ComponentType`

Defined in: [components/layout/Layout.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L43)

Custom appbar component - can be a ReactNode or a ComponentType

##### menu?

> `optional` **menu**: `ComponentType`\<\{ `items?`: `MenuItem`[]; \}\>

Defined in: [components/layout/Layout.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L45)

Custom menu component

##### menuItems?

> `optional` **menuItems**: `MenuItem`[]

Defined in: [components/layout/Layout.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L47)

Menu items to pass to menu component

##### title?

> `optional` **title**: `string`

Defined in: [components/layout/Layout.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L49)

Application title

##### className?

> `optional` **className**: `string`

Defined in: [components/layout/Layout.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L51)

Additional CSS class

##### defaultOpen?

> `optional` **defaultOpen**: `boolean`

Defined in: [components/layout/Layout.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L53)

Initial sidebar open state (uncontrolled)

##### open?

> `optional` **open**: `boolean`

Defined in: [components/layout/Layout.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L55)

Controlled sidebar open state

##### onOpenChange()?

> `optional` **onOpenChange**: (`open`) => `void`

Defined in: [components/layout/Layout.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L57)

Callback when sidebar state changes

###### Parameters

###### open

`boolean`

###### Returns

`void`

##### theme?

> `optional` **theme**: `"light"` \| `"dark"` \| `"system"`

Defined in: [components/layout/Layout.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L59)

Theme setting

##### onThemeChange()?

> `optional` **onThemeChange**: (`theme`) => `void`

Defined in: [components/layout/Layout.tsx:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L61)

Callback when theme changes

###### Parameters

###### theme

`"light"` | `"dark"` | `"system"`

###### Returns

`void`

##### showThemeToggle?

> `optional` **showThemeToggle**: `boolean`

Defined in: [components/layout/Layout.tsx:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L63)

Show theme toggle button

***

### SidebarContextValue

Defined in: [components/layout/Layout.tsx:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L70)

#### Properties

##### open

> **open**: `boolean`

Defined in: [components/layout/Layout.tsx:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L71)

##### setOpen()

> **setOpen**: (`open`) => `void`

Defined in: [components/layout/Layout.tsx:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L72)

###### Parameters

###### open

`boolean`

###### Returns

`void`

##### toggleSidebar()

> **toggleSidebar**: () => `void`

Defined in: [components/layout/Layout.tsx:73](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L73)

###### Returns

`void`

##### isMobile

> **isMobile**: `boolean`

Defined in: [components/layout/Layout.tsx:74](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L74)

##### openMobile

> **openMobile**: `boolean`

Defined in: [components/layout/Layout.tsx:75](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L75)

##### setOpenMobile()

> **setOpenMobile**: (`open`) => `void`

Defined in: [components/layout/Layout.tsx:76](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Layout.tsx#L76)

###### Parameters

###### open

`boolean`

###### Returns

`void`

***

### SidebarMenuItem

Defined in: [components/layout/Sidebar.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L19)

Menu item type for sidebar navigation

#### Properties

##### name

> **name**: `string`

Defined in: [components/layout/Sidebar.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L20)

##### label

> **label**: `string`

Defined in: [components/layout/Sidebar.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L21)

##### path?

> `optional` **path**: `string`

Defined in: [components/layout/Sidebar.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L22)

##### icon?

> `optional` **icon**: `ComponentType`\<\{ `className?`: `string`; \}\>

Defined in: [components/layout/Sidebar.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L23)

***

### SidebarProps

Defined in: [components/layout/Sidebar.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L29)

Sidebar component props

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/layout/Sidebar.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L33)

Sidebar content (menu, links, etc.)

##### title?

> `optional` **title**: `string`

Defined in: [components/layout/Sidebar.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L37)

Application title displayed in sidebar header

##### logo?

> `optional` **logo**: `ReactNode`

Defined in: [components/layout/Sidebar.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L41)

Logo element to display in header

##### header?

> `optional` **header**: `ReactNode`

Defined in: [components/layout/Sidebar.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L45)

Custom header content

##### footer?

> `optional` **footer**: `ReactNode`

Defined in: [components/layout/Sidebar.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L49)

Custom footer content

##### className?

> `optional` **className**: `string`

Defined in: [components/layout/Sidebar.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L53)

Additional CSS class

##### width?

> `optional` **width**: `string`

Defined in: [components/layout/Sidebar.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L57)

Width when expanded (default: w-72)

##### collapsedWidth?

> `optional` **collapsedWidth**: `string`

Defined in: [components/layout/Sidebar.tsx:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Sidebar.tsx#L61)

Width when collapsed (default: w-16)

***

### TitleContextValue

Defined in: [components/layout/Title.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L25)

Title context value

#### Properties

##### title

> **title**: `ReactNode`

Defined in: [components/layout/Title.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L26)

##### setTitle()

> **setTitle**: (`title`) => `void`

Defined in: [components/layout/Title.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L27)

###### Parameters

###### title

`ReactNode`

###### Returns

`void`

***

### TitleContextProviderProps

Defined in: [components/layout/Title.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L44)

Props for TitleContextProvider

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/layout/Title.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L45)

##### defaultTitle?

> `optional` **defaultTitle**: `ReactNode`

Defined in: [components/layout/Title.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L46)

***

### TitleProps

Defined in: [components/layout/Title.tsx:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L77)

Props for Title component

#### Properties

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/layout/Title.tsx:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L81)

The title to display

##### defaultTitle?

> `optional` **defaultTitle**: `string`

Defined in: [components/layout/Title.tsx:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L85)

Default title (used when title is not provided)

##### preferenceKey?

> `optional` **preferenceKey**: `string`

Defined in: [components/layout/Title.tsx:89](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L89)

Preferred source for resource name (e.g., "name" uses record.name)

##### updateDocumentTitle?

> `optional` **updateDocumentTitle**: `boolean`

Defined in: [components/layout/Title.tsx:94](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L94)

Whether to update the document title

###### Default

```ts
true
```

##### className?

> `optional` **className**: `string`

Defined in: [components/layout/Title.tsx:98](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L98)

Additional CSS classes

***

### TitlePortalProps

Defined in: [components/layout/Title.tsx:166](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L166)

Props for TitlePortal component

#### Properties

##### className?

> `optional` **className**: `string`

Defined in: [components/layout/Title.tsx:170](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L170)

Additional CSS classes

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/layout/Title.tsx:174](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/layout/Title.tsx#L174)

Children to render if no title is set

***

### DataTableProps

Defined in: [components/list/DataTable.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L11)

Props for DataTable component
Extends all Datagrid props for full compatibility

#### Extends

- `Omit`\<[`DatagridProps`](#datagridprops)\<`T`\>, `"size"` \| `"rowClick"`\>

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### sx?

> `optional` **sx**: `unknown`

Defined in: [components/list/DataTable.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L13)

MUI sx prop for styling (accepted for compatibility, ignored)

##### sort?

> `optional` **sort**: `object`

Defined in: [components/list/DataTable.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L15)

Sort configuration

###### field

> **field**: `string`

###### order

> **order**: `"ASC"` \| `"DESC"`

##### data?

> `optional` **data**: `T`[]

Defined in: [components/list/DataTable.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L17)

Data records to display

##### isPending?

> `optional` **isPending**: `boolean`

Defined in: [components/list/DataTable.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L19)

Whether data is currently loading

##### total?

> `optional` **total**: `number`

Defined in: [components/list/DataTable.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L21)

Total count of records (for pagination)

##### rowClick?

> `optional` **rowClick**: `string` \| `boolean` \| (`record`, `id`, `event`) => `string` \| `void` \| (`id`, `resource`, `record`) => `string`

Defined in: [components/list/DataTable.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L23)

Row click handler - 'edit', 'show', false, string path, or custom function

##### bulkActionButtons?

> `optional` **bulkActionButtons**: `ReactNode`

Defined in: [components/list/DataTable.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L25)

Bulk action buttons or false to disable

###### Overrides

`Omit.bulkActionButtons`

##### expand?

> `optional` **expand**: `ReactNode` \| `ComponentType`\<`any`\>

Defined in: [components/list/DataTable.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L27)

Expandable row content - component or element to render when row is expanded

###### Overrides

`Omit.expand`

##### hiddenColumns?

> `optional` **hiddenColumns**: `string`[]

Defined in: [components/list/DataTable.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L29)

Columns to hide from the table

##### resource?

> `optional` **resource**: `string`

Defined in: [components/list/DataTable.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L31)

Resource name

##### size?

> `optional` **size**: `"small"` \| `"default"` \| `"sm"` \| `"lg"`

Defined in: [components/list/DataTable.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DataTable.tsx#L33)

Table density size (small is mapped to sm)

##### children?

> `optional` **children**: `ReactNode` \| (`props`) => `ReactNode`

Defined in: [components/list/Datagrid.tsx:73](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L73)

Child field components - each becomes a column, or render props function

###### Inherited from

`Omit.children`

##### columns?

> `optional` **columns**: [`DatagridColumn`](#datagridcolumn)\<`T`\>[]

Defined in: [components/list/Datagrid.tsx:75](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L75)

Explicit column configuration (alternative to children)

###### Inherited from

`Omit.columns`

##### empty?

> `optional` **empty**: `ReactNode`

Defined in: [components/list/Datagrid.tsx:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L81)

Custom empty state component

###### Inherited from

`Omit.empty`

##### loading?

> `optional` **loading**: `ReactNode`

Defined in: [components/list/Datagrid.tsx:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L83)

Custom loading component

###### Inherited from

`Omit.loading`

##### className?

> `optional` **className**: `string`

Defined in: [components/list/Datagrid.tsx:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L85)

Custom className for the table

###### Inherited from

`Omit.className`

##### rowStyle()?

> `optional` **rowStyle**: (`record`, `index`) => `CSSProperties`

Defined in: [components/list/Datagrid.tsx:87](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L87)

Function to compute row styles

###### Parameters

###### record

`T`

###### index

`number`

###### Returns

`CSSProperties`

###### Inherited from

`Omit.rowStyle`

##### hover?

> `optional` **hover**: `boolean`

Defined in: [components/list/Datagrid.tsx:89](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L89)

Enable hover styles on rows

###### Inherited from

`Omit.hover`

##### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [components/list/Datagrid.tsx:93](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L93)

Whether the table is currently loading

###### Inherited from

`Omit.isLoading`

##### isRowExpandable()?

> `optional` **isRowExpandable**: (`record`) => `boolean`

Defined in: [components/list/Datagrid.tsx:97](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L97)

Function to determine if a row can be expanded

###### Parameters

###### record

`T`

###### Returns

`boolean`

###### Inherited from

`Omit.isRowExpandable`

##### cellRenderer()?

> `optional` **cellRenderer**: (`props`) => `unknown`

Defined in: [components/list/Datagrid.tsx:99](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L99)

Custom cell renderer for all cells

###### Parameters

###### props

`CellRendererProps`\<`T`\>

###### Returns

`unknown`

###### Inherited from

`Omit.cellRenderer`

***

### DatagridColumn

Defined in: [components/list/Datagrid.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L44)

Column configuration for Datagrid

#### Type Parameters

##### T

`T` = `RaRecord`

#### Properties

##### source

> **source**: `string`

Defined in: [components/list/Datagrid.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L45)

##### label?

> `optional` **label**: `string`

Defined in: [components/list/Datagrid.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L46)

##### sortable?

> `optional` **sortable**: `boolean`

Defined in: [components/list/Datagrid.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L47)

##### render()?

> `optional` **render**: (`props`) => `unknown`

Defined in: [components/list/Datagrid.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L48)

###### Parameters

###### props

`CellRendererProps`\<`T`\>

###### Returns

`unknown`

***

### DatagridProps

Defined in: [components/list/Datagrid.tsx:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L71)

Props for Datagrid component

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### children?

> `optional` **children**: `ReactNode` \| (`props`) => `ReactNode`

Defined in: [components/list/Datagrid.tsx:73](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L73)

Child field components - each becomes a column, or render props function

##### columns?

> `optional` **columns**: [`DatagridColumn`](#datagridcolumn)\<`T`\>[]

Defined in: [components/list/Datagrid.tsx:75](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L75)

Explicit column configuration (alternative to children)

##### bulkActionButtons?

> `optional` **bulkActionButtons**: `ReactNode`

Defined in: [components/list/Datagrid.tsx:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L77)

Enable bulk action checkboxes

##### rowClick?

> `optional` **rowClick**: [`RowClickHandler`](#rowclickhandler)\<`T`\>

Defined in: [components/list/Datagrid.tsx:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L79)

Row click handler - 'edit', 'show', false, or custom function

##### empty?

> `optional` **empty**: `ReactNode`

Defined in: [components/list/Datagrid.tsx:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L81)

Custom empty state component

##### loading?

> `optional` **loading**: `ReactNode`

Defined in: [components/list/Datagrid.tsx:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L83)

Custom loading component

##### className?

> `optional` **className**: `string`

Defined in: [components/list/Datagrid.tsx:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L85)

Custom className for the table

##### rowStyle()?

> `optional` **rowStyle**: (`record`, `index`) => `CSSProperties`

Defined in: [components/list/Datagrid.tsx:87](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L87)

Function to compute row styles

###### Parameters

###### record

`T`

###### index

`number`

###### Returns

`CSSProperties`

##### hover?

> `optional` **hover**: `boolean`

Defined in: [components/list/Datagrid.tsx:89](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L89)

Enable hover styles on rows

##### size?

> `optional` **size**: `"default"` \| `"sm"` \| `"lg"`

Defined in: [components/list/Datagrid.tsx:91](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L91)

Table density size

##### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [components/list/Datagrid.tsx:93](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L93)

Whether the table is currently loading

##### expand?

> `optional` **expand**: `ReactNode` \| `ComponentType`

Defined in: [components/list/Datagrid.tsx:95](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L95)

Component to render when row is expanded

##### isRowExpandable()?

> `optional` **isRowExpandable**: (`record`) => `boolean`

Defined in: [components/list/Datagrid.tsx:97](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L97)

Function to determine if a row can be expanded

###### Parameters

###### record

`T`

###### Returns

`boolean`

##### cellRenderer()?

> `optional` **cellRenderer**: (`props`) => `unknown`

Defined in: [components/list/Datagrid.tsx:99](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L99)

Custom cell renderer for all cells

###### Parameters

###### props

`CellRendererProps`\<`T`\>

###### Returns

`unknown`

***

### DatagridBodyProps

Defined in: [components/list/DatagridBody.tsx:10](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L10)

Props for DatagridBody component

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### rows

> **rows**: `Row`\<`T`\>[]

Defined in: [components/list/DatagridBody.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L12)

Rows from TanStack Table

##### isEmpty?

> `optional` **isEmpty**: `boolean`

Defined in: [components/list/DatagridBody.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L14)

Whether the data is empty

##### columnCount

> **columnCount**: `number`

Defined in: [components/list/DatagridBody.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L16)

Number of columns for empty state colspan

##### empty?

> `optional` **empty**: `ReactNode`

Defined in: [components/list/DatagridBody.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L18)

Custom empty state content

##### selectedIds?

> `optional` **selectedIds**: `Identifier`[]

Defined in: [components/list/DatagridBody.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L20)

Selected row IDs

##### rowStyle()?

> `optional` **rowStyle**: (`record`, `index`) => `CSSProperties`

Defined in: [components/list/DatagridBody.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L22)

Function to compute row styles

###### Parameters

###### record

`T`

###### index

`number`

###### Returns

`CSSProperties`

##### hover?

> `optional` **hover**: `boolean`

Defined in: [components/list/DatagridBody.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L24)

Enable hover styles on rows

##### isRowClickable?

> `optional` **isRowClickable**: `boolean`

Defined in: [components/list/DatagridBody.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L26)

Whether rows are clickable

##### onRowClick()?

> `optional` **onRowClick**: (`record`, `index`, `event`) => `void`

Defined in: [components/list/DatagridBody.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L28)

Row click handler

###### Parameters

###### record

`T`

###### index

`number`

###### event

`MouseEvent`

###### Returns

`void`

##### flexRender()

> **flexRender**: \<`TProps`\>(`Comp`, `props`) => `ReactNode` \| `Element`

Defined in: [components/list/DatagridBody.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridBody.tsx#L30)

flexRender function from TanStack

If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.

###### Type Parameters

###### TProps

`TProps` *extends* `object`

###### Parameters

###### Comp

`Renderable`\<`TProps`\>

###### props

`TProps`

###### Returns

`ReactNode` \| `Element`

***

### DatagridHeaderProps

Defined in: [components/list/DatagridHeader.tsx:8](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridHeader.tsx#L8)

Props for DatagridHeader component

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### headerGroups

> **headerGroups**: `HeaderGroup`\<`T`\>[]

Defined in: [components/list/DatagridHeader.tsx:10](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridHeader.tsx#L10)

Header groups from TanStack Table

##### sort?

> `optional` **sort**: [`SortPayload`](#sortpayload)\<`RaRecord`\>

Defined in: [components/list/DatagridHeader.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridHeader.tsx#L12)

Current sort configuration

##### onSortChange()?

> `optional` **onSortChange**: (`field`) => `void`

Defined in: [components/list/DatagridHeader.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridHeader.tsx#L14)

Handler for sort changes

###### Parameters

###### field

`string`

###### Returns

`void`

##### showSelection?

> `optional` **showSelection**: `boolean`

Defined in: [components/list/DatagridHeader.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridHeader.tsx#L16)

Whether to show the selection column

##### headerCheckboxRef?

> `optional` **headerCheckboxRef**: `RefObject`\<`HTMLInputElement`\>

Defined in: [components/list/DatagridHeader.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridHeader.tsx#L18)

Header checkbox ref for indeterminate state

***

### DatagridRowProps

Defined in: [components/list/DatagridRow.tsx:11](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L11)

Props for DatagridRow component

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### row

> **row**: `Row`\<`T`\>

Defined in: [components/list/DatagridRow.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L13)

Row from TanStack Table

##### rowIndex

> **rowIndex**: `number`

Defined in: [components/list/DatagridRow.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L15)

Row index in the data array

##### isSelected?

> `optional` **isSelected**: `boolean`

Defined in: [components/list/DatagridRow.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L17)

Whether this row is selected

##### style?

> `optional` **style**: `CSSProperties`

Defined in: [components/list/DatagridRow.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L19)

Custom style for this row

##### hover?

> `optional` **hover**: `boolean`

Defined in: [components/list/DatagridRow.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L21)

Enable hover styles

##### isClickable?

> `optional` **isClickable**: `boolean`

Defined in: [components/list/DatagridRow.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L23)

Whether the row is clickable

##### onClick()?

> `optional` **onClick**: (`record`, `index`, `event`) => `void`

Defined in: [components/list/DatagridRow.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L25)

Row click handler

###### Parameters

###### record

`T`

###### index

`number`

###### event

`MouseEvent`

###### Returns

`void`

##### flexRender()

> **flexRender**: \<`TProps`\>(`Comp`, `props`) => `ReactNode` \| `Element`

Defined in: [components/list/DatagridRow.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L27)

flexRender function from TanStack

If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.

###### Type Parameters

###### TProps

`TProps` *extends* `object`

###### Parameters

###### Comp

`Renderable`\<`TProps`\>

###### props

`TProps`

###### Returns

`ReactNode` \| `Element`

##### className?

> `optional` **className**: `string`

Defined in: [components/list/DatagridRow.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L29)

Additional className for the row

***

### SimpleDatagridRowProps

Defined in: [components/list/DatagridRow.tsx:106](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L106)

Props for a simple record row (without TanStack Table)

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### record

> **record**: `T`

Defined in: [components/list/DatagridRow.tsx:108](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L108)

The record data

##### rowIndex

> **rowIndex**: `number`

Defined in: [components/list/DatagridRow.tsx:110](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L110)

Row index in the data array

##### children

> **children**: `ReactNode`

Defined in: [components/list/DatagridRow.tsx:112](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L112)

Children to render in the row (typically field components)

##### isSelected?

> `optional` **isSelected**: `boolean`

Defined in: [components/list/DatagridRow.tsx:114](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L114)

Whether this row is selected

##### style?

> `optional` **style**: `CSSProperties`

Defined in: [components/list/DatagridRow.tsx:116](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L116)

Custom style for this row

##### hover?

> `optional` **hover**: `boolean`

Defined in: [components/list/DatagridRow.tsx:118](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L118)

Enable hover styles

##### isClickable?

> `optional` **isClickable**: `boolean`

Defined in: [components/list/DatagridRow.tsx:120](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L120)

Whether the row is clickable

##### onClick()?

> `optional` **onClick**: (`record`, `index`, `event`) => `void`

Defined in: [components/list/DatagridRow.tsx:122](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L122)

Row click handler

###### Parameters

###### record

`T`

###### index

`number`

###### event

`MouseEvent`

###### Returns

`void`

##### className?

> `optional` **className**: `string`

Defined in: [components/list/DatagridRow.tsx:124](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/DatagridRow.tsx#L124)

Additional className for the row

***

### InfiniteListViewProps

Defined in: [components/list/InfiniteList.tsx:242](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L242)

Props for InfiniteListView component

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/list/InfiniteList.tsx:244](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L244)

Child elements to render inside the list container

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/list/InfiniteList.tsx:246](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L246)

Title to display in the list header

##### actions?

> `optional` **actions**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

Defined in: [components/list/InfiniteList.tsx:248](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L248)

Custom actions component (e.g., Create button)

##### filters?

> `optional` **filters**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

Defined in: [components/list/InfiniteList.tsx:250](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L250)

Filters component for the list

##### empty?

> `optional` **empty**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/list/InfiniteList.tsx:252](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L252)

Component to display when the list is empty

##### className?

> `optional` **className**: `string`

Defined in: [components/list/InfiniteList.tsx:254](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L254)

Additional CSS class name

##### aside?

> `optional` **aside**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/list/InfiniteList.tsx:256](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L256)

Aside content (e.g., bulk action buttons)

***

### InfiniteListProps

Defined in: [components/list/InfiniteList.tsx:349](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L349)

Props for InfiniteList component

#### Extends

- `Omit`\<`InfiniteListBaseProps`\<`RecordType`\>, `"children"`\>.`Pick`\<[`InfiniteListViewProps`](#infinitelistviewprops), `"actions"` \| `"filters"` \| `"empty"` \| `"className"` \| `"aside"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `object` = \{ `id`: `Identifier`; \}

#### Properties

##### resource?

> `optional` **resource**: `string`

Defined in: [components/list/InfiniteList.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L30)

The name of the resource to fetch. If not provided, uses ResourceContext

###### Inherited from

`Omit.resource`

##### perPage?

> `optional` **perPage**: `number`

Defined in: [components/list/InfiniteList.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L34)

Number of records per page. Defaults to 10

###### Inherited from

`Omit.perPage`

##### sort?

> `optional` **sort**: `object`

Defined in: [components/list/InfiniteList.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L36)

Default sort configuration

###### field

> **field**: `string`

###### order

> **order**: `"ASC"` \| `"DESC"`

###### Inherited from

`Omit.sort`

##### filter?

> `optional` **filter**: [`TypedFilterPayload`](#typedfilterpayload)\<`RaRecord`\> & `Record`\<`string`, `unknown`\>

Defined in: [components/list/InfiniteList.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L38)

Permanent filter (always applied, cannot be changed by user)

###### Inherited from

`Omit.filter`

##### filterDefaultValues?

> `optional` **filterDefaultValues**: [`TypedFilterPayload`](#typedfilterpayload)\<`RaRecord`\> & `Record`\<`string`, `unknown`\>

Defined in: [components/list/InfiniteList.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L40)

Default filter values (can be changed by user)

###### Inherited from

`Omit.filterDefaultValues`

##### disableSyncWithLocation?

> `optional` **disableSyncWithLocation**: `boolean`

Defined in: [components/list/InfiniteList.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L42)

If true, don't sync list parameters with URL

###### Inherited from

`Omit.disableSyncWithLocation`

##### queryOptions?

> `optional` **queryOptions**: [`UseGetListOptions`](#usegetlistoptions)\<`RecordType`\>

Defined in: [components/list/InfiniteList.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L44)

React Query options to pass to useGetList

###### Inherited from

`Omit.queryOptions`

##### storeKey?

> `optional` **storeKey**: `string`

Defined in: [components/list/InfiniteList.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L46)

Custom store key for URL params (for multiple lists on same page)

###### Inherited from

`Omit.storeKey`

##### actions?

> `optional` **actions**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

Defined in: [components/list/InfiniteList.tsx:248](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L248)

Custom actions component (e.g., Create button)

###### Inherited from

[`InfiniteListViewProps`](#infinitelistviewprops).[`actions`](#actions-4)

##### filters?

> `optional` **filters**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

Defined in: [components/list/InfiniteList.tsx:250](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L250)

Filters component for the list

###### Inherited from

[`InfiniteListViewProps`](#infinitelistviewprops).[`filters`](#filters-1)

##### empty?

> `optional` **empty**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/list/InfiniteList.tsx:252](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L252)

Component to display when the list is empty

###### Inherited from

[`InfiniteListViewProps`](#infinitelistviewprops).[`empty`](#empty-8)

##### className?

> `optional` **className**: `string`

Defined in: [components/list/InfiniteList.tsx:254](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L254)

Additional CSS class name

###### Inherited from

[`InfiniteListViewProps`](#infinitelistviewprops).[`className`](#classname-37)

##### aside?

> `optional` **aside**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/list/InfiniteList.tsx:256](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L256)

Aside content (e.g., bulk action buttons)

###### Inherited from

[`InfiniteListViewProps`](#infinitelistviewprops).[`aside`](#aside-4)

##### children

> **children**: `ReactNode`

Defined in: [components/list/InfiniteList.tsx:353](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L353)

Child elements to render inside the list (typically Datagrid)

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/list/InfiniteList.tsx:355](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L355)

Title to display in the list header

##### exporter?

> `optional` **exporter**: `false` \| (`data`) => `void`

Defined in: [components/list/InfiniteList.tsx:357](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/InfiniteList.tsx#L357)

Exporter function for data export, or false to disable

***

### ListProps

Defined in: [components/list/List.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L18)

Props for List component
Combines ListBase props (logic) with ListView props (UI)

#### Extends

- `Omit`\<`ListBaseProps`\<`RecordType`\>, `"children"` \| `"sort"` \| `"perPage"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `object` = \{ `id`: `Identifier`; \}

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/list/List.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L21)

Child elements to render inside the list (typically Datagrid)

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/list/List.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L23)

Title to display in the list header

##### actions?

> `optional` **actions**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

Defined in: [components/list/List.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L25)

Custom actions component (e.g., Create button)

##### filters?

> `optional` **filters**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

Defined in: [components/list/List.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L27)

Filters component for the list

##### empty?

> `optional` **empty**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/list/List.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L29)

Component to display when the list is empty

##### pagination?

> `optional` **pagination**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/list/List.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L31)

Pagination component

##### className?

> `optional` **className**: `string`

Defined in: [components/list/List.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L33)

Additional CSS class name

##### aside?

> `optional` **aside**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/list/List.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L35)

Aside content (e.g., bulk action buttons)

##### sort?

> `optional` **sort**: `object`

Defined in: [components/list/List.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L37)

Default sort configuration

###### field

> **field**: `string`

###### order

> **order**: `"ASC"` \| `"DESC"`

##### exporter?

> `optional` **exporter**: `false` \| (`data`) => `any`

Defined in: [components/list/List.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L39)

Exporter function for list data, or false to disable export

##### perPage?

> `optional` **perPage**: `number`

Defined in: [components/list/List.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/List.tsx#L41)

Number of records per page

##### resource?

> `optional` **resource**: `string`

Defined in: [components/list/ListBase.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListBase.tsx#L21)

The name of the resource to fetch. If not provided, uses ResourceContext

###### Inherited from

`Omit.resource`

##### filter?

> `optional` **filter**: [`TypedFilterPayload`](#typedfilterpayload)\<`RaRecord`\> & `Record`\<`string`, `unknown`\>

Defined in: [components/list/ListBase.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListBase.tsx#L29)

Permanent filter (always applied, cannot be changed by user)

###### Inherited from

`Omit.filter`

##### filterDefaultValues?

> `optional` **filterDefaultValues**: [`TypedFilterPayload`](#typedfilterpayload)\<`RaRecord`\> & `Record`\<`string`, `unknown`\>

Defined in: [components/list/ListBase.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListBase.tsx#L31)

Default filter values (can be changed by user)

###### Inherited from

`Omit.filterDefaultValues`

##### disableSyncWithLocation?

> `optional` **disableSyncWithLocation**: `boolean`

Defined in: [components/list/ListBase.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListBase.tsx#L33)

If true, don't sync list parameters with URL

###### Inherited from

`Omit.disableSyncWithLocation`

##### queryOptions?

> `optional` **queryOptions**: [`UseGetListOptions`](#usegetlistoptions)\<`RecordType`\>

Defined in: [components/list/ListBase.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListBase.tsx#L35)

React Query options to pass to useGetList

###### Inherited from

`Omit.queryOptions`

##### storeKey?

> `optional` **storeKey**: `string`

Defined in: [components/list/ListBase.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListBase.tsx#L37)

Custom store key for URL params (for multiple lists on same page)

###### Inherited from

`Omit.storeKey`

***

### ListActionsProps

Defined in: [components/list/ListActions.tsx:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListActions.tsx#L15)

Props for ListActions component

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/list/ListActions.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListActions.tsx#L19)

Action buttons to render (CreateButton, ExportButton, etc.)

##### className?

> `optional` **className**: `string`

Defined in: [components/list/ListActions.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListActions.tsx#L23)

Additional CSS classes for the container

##### data-testid?

> `optional` **data-testid**: `string`

Defined in: [components/list/ListActions.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListActions.tsx#L27)

Data attributes and other HTML attributes

##### hasCreate?

> `optional` **hasCreate**: `boolean`

Defined in: [components/list/ListActions.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListActions.tsx#L32)

If true, renders a CreateButton automatically

###### Default

```ts
false
```

##### hasExport?

> `optional` **hasExport**: `boolean`

Defined in: [components/list/ListActions.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListActions.tsx#L37)

If true, renders an ExportButton automatically

###### Default

```ts
false
```

***

### ListToolbarProps

Defined in: [components/list/ListToolbar.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListToolbar.tsx#L13)

Props for ListToolbar component

#### Properties

##### filters?

> `optional` **filters**: `ReactNode`

Defined in: [components/list/ListToolbar.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListToolbar.tsx#L17)

Filters component to render on the left side

##### actions?

> `optional` **actions**: `ReactNode`

Defined in: [components/list/ListToolbar.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListToolbar.tsx#L21)

Actions component to render on the right side (e.g., ListActions)

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/list/ListToolbar.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListToolbar.tsx#L25)

Additional content to render between filters and actions

##### className?

> `optional` **className**: `string`

Defined in: [components/list/ListToolbar.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListToolbar.tsx#L29)

Additional CSS classes for the container

##### data-testid?

> `optional` **data-testid**: `string`

Defined in: [components/list/ListToolbar.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListToolbar.tsx#L33)

Data attributes and other HTML attributes

***

### ListViewProps

Defined in: [components/list/ListView.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListView.tsx#L17)

Props for ListView component

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/list/ListView.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListView.tsx#L19)

Child elements to render inside the list container

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/list/ListView.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListView.tsx#L21)

Title to display in the list header

##### actions?

> `optional` **actions**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

Defined in: [components/list/ListView.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListView.tsx#L23)

Custom actions component (e.g., Create button)

##### filters?

> `optional` **filters**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

Defined in: [components/list/ListView.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListView.tsx#L25)

Filters component for the list

##### empty?

> `optional` **empty**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/list/ListView.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListView.tsx#L27)

Component to display when the list is empty

##### pagination?

> `optional` **pagination**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/list/ListView.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListView.tsx#L29)

Pagination component

##### className?

> `optional` **className**: `string`

Defined in: [components/list/ListView.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListView.tsx#L31)

Additional CSS class name

##### aside?

> `optional` **aside**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/list/ListView.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/ListView.tsx#L33)

Aside content (e.g., bulk action buttons)

***

### PaginationProps

Defined in: [components/list/Pagination.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L18)

Props for the Pagination component
Supports both context-based usage and standalone props

#### Properties

##### page?

> `optional` **page**: `number`

Defined in: [components/list/Pagination.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L20)

Current page number (1-indexed). Overrides context value if provided

##### perPage?

> `optional` **perPage**: `number`

Defined in: [components/list/Pagination.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L22)

Number of items per page. Overrides context value if provided

##### total?

> `optional` **total**: `number`

Defined in: [components/list/Pagination.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L24)

Total number of records. Overrides context value if provided

##### setPage()?

> `optional` **setPage**: (`page`) => `void`

Defined in: [components/list/Pagination.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L26)

Callback to change page. Overrides context value if provided

###### Parameters

###### page

`number`

###### Returns

`void`

##### setPerPage()?

> `optional` **setPerPage**: (`perPage`) => `void`

Defined in: [components/list/Pagination.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L28)

Callback to change items per page. Overrides context value if provided

###### Parameters

###### perPage

`number`

###### Returns

`void`

##### rowsPerPageOptions?

> `optional` **rowsPerPageOptions**: `number`[]

Defined in: [components/list/Pagination.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L30)

Options for the rows per page selector. Pass empty array to hide

##### limit?

> `optional` **limit**: `ReactNode`

Defined in: [components/list/Pagination.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L32)

Custom element to render instead of default pagination (react-admin compatibility)

##### className?

> `optional` **className**: `string`

Defined in: [components/list/Pagination.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L34)

Additional CSS classes

##### siblingCount?

> `optional` **siblingCount**: `number`

Defined in: [components/list/Pagination.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L36)

Number of pages to show around current page

##### boundaryCount?

> `optional` **boundaryCount**: `number`

Defined in: [components/list/Pagination.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L38)

Number of pages to show at the start/end

***

### RowsPerPageSelectorProps

Defined in: [components/list/RowsPerPageSelector.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/RowsPerPageSelector.tsx#L14)

Props for the RowsPerPageSelector component

#### Properties

##### value

> **value**: `number`

Defined in: [components/list/RowsPerPageSelector.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/RowsPerPageSelector.tsx#L16)

Current value

##### options

> **options**: `number`[]

Defined in: [components/list/RowsPerPageSelector.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/RowsPerPageSelector.tsx#L18)

Available options

##### onChange()

> **onChange**: (`value`) => `void`

Defined in: [components/list/RowsPerPageSelector.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/RowsPerPageSelector.tsx#L20)

Callback when value changes

###### Parameters

###### value

`number`

###### Returns

`void`

##### className?

> `optional` **className**: `string`

Defined in: [components/list/RowsPerPageSelector.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/RowsPerPageSelector.tsx#L22)

Additional CSS classes

##### label?

> `optional` **label**: `string`

Defined in: [components/list/RowsPerPageSelector.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/RowsPerPageSelector.tsx#L24)

Label for accessibility

***

### SimpleListProps

Defined in: [components/list/SimpleList.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L21)

SimpleList component props

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### primaryText?

> `optional` **primaryText**: `string` \| (`record`) => `unknown`

Defined in: [components/list/SimpleList.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L26)

Function to get primary text from record
Returns ReactNode or unknown (for flexibility with record property access)

##### secondaryText?

> `optional` **secondaryText**: `string` \| (`record`) => `unknown`

Defined in: [components/list/SimpleList.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L31)

Function to get secondary text from record
Returns ReactNode or unknown (for flexibility with record property access)

##### tertiaryText?

> `optional` **tertiaryText**: `string` \| (`record`) => `unknown`

Defined in: [components/list/SimpleList.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L36)

Function to get tertiary text from record
Returns ReactNode or unknown (for flexibility with record property access)

##### leftAvatar?

> `optional` **leftAvatar**: (`record`) => `ReactNode` \| () => `ReactNode`

Defined in: [components/list/SimpleList.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L40)

Left avatar component or function returning avatar

##### rightAvatar?

> `optional` **rightAvatar**: (`record`) => `ReactNode` \| () => `ReactNode`

Defined in: [components/list/SimpleList.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L44)

Right avatar component or function returning avatar

##### leftIcon()?

> `optional` **leftIcon**: (`record`) => `ReactNode`

Defined in: [components/list/SimpleList.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L48)

Left icon component or function returning icon

###### Parameters

###### record

`RecordType`

###### Returns

`ReactNode`

##### rightIcon()?

> `optional` **rightIcon**: (`record`) => `ReactNode`

Defined in: [components/list/SimpleList.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L52)

Right icon component or function returning icon

###### Parameters

###### record

`RecordType`

###### Returns

`ReactNode`

##### linkType?

> `optional` **linkType**: `false` \| `"show"` \| `"edit"` \| (`record`, `id`) => `string`

Defined in: [components/list/SimpleList.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L56)

Link type for row clicks

##### rowClick?

> `optional` **rowClick**: `string` \| `boolean` \| (`id`, `resource`, `record`) => `string`

Defined in: [components/list/SimpleList.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L60)

Custom row click handler

##### rowStyle()?

> `optional` **rowStyle**: (`record`, `index`) => `CSSProperties`

Defined in: [components/list/SimpleList.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L64)

Custom row styles function

###### Parameters

###### record

`RecordType`

###### index

`number`

###### Returns

`CSSProperties`

##### className?

> `optional` **className**: `string`

Defined in: [components/list/SimpleList.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L68)

Additional CSS class

##### empty?

> `optional` **empty**: `ReactNode`

Defined in: [components/list/SimpleList.tsx:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L72)

Empty state content

##### linkComponent?

> `optional` **linkComponent**: `ComponentType`\<\{ `to`: `string`; `children`: `ReactNode`; \}\>

Defined in: [components/list/SimpleList.tsx:76](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L76)

Custom link component

##### resource?

> `optional` **resource**: `string`

Defined in: [components/list/SimpleList.tsx:80](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/SimpleList.tsx#L80)

Resource name for link generation

***

### SearchInputProps

Defined in: [components/list/filter/SearchInput.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/filter/SearchInput.tsx#L16)

Props for SearchInput component

#### Extends

- `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"type"` \| `"onChange"`\>

#### Properties

##### source?

> `optional` **source**: `string`

Defined in: [components/list/filter/SearchInput.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/filter/SearchInput.tsx#L19)

Filter source/key name in filterValues

##### debounce?

> `optional` **debounce**: `number`

Defined in: [components/list/filter/SearchInput.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/filter/SearchInput.tsx#L21)

Debounce delay in milliseconds

##### alwaysOn?

> `optional` **alwaysOn**: `boolean`

Defined in: [components/list/filter/SearchInput.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/filter/SearchInput.tsx#L26)

If true, the input is always displayed (not hideable in filter forms).
This is commonly used for permanent search fields in list toolbars.

##### hideable?

> `optional` **hideable**: `boolean`

Defined in: [components/list/filter/SearchInput.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/filter/SearchInput.tsx#L31)

If true, shows a remove button to hide/clear this filter.
Useful for dynamic filters that can be shown/hidden.

##### onHide()?

> `optional` **onHide**: (`source`) => `void`

Defined in: [components/list/filter/SearchInput.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/filter/SearchInput.tsx#L33)

Callback when the filter is hidden/removed

###### Parameters

###### source

`string`

###### Returns

`void`

***

### DashboardMenuItemProps

Defined in: [components/menu/DashboardMenuItem.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/DashboardMenuItem.tsx#L19)

DashboardMenuItem component props

#### Extends

- `Omit`\<[`MenuItemProps`](#menuitemprops), `"to"` \| `"label"` \| `"exact"`\>

#### Properties

##### to?

> `optional` **to**: `string`

Defined in: [components/menu/DashboardMenuItem.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/DashboardMenuItem.tsx#L23)

Dashboard path (default: '/')

##### label?

> `optional` **label**: `string`

Defined in: [components/menu/DashboardMenuItem.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/DashboardMenuItem.tsx#L27)

Dashboard label (default: 'Dashboard')

##### icon?

> `optional` **icon**: `ReactNode` \| `ComponentType`\<\{ \}\>

Defined in: [components/menu/MenuItem.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L42)

Icon element or component

###### Inherited from

`Omit.icon`

##### className?

> `optional` **className**: `string`

Defined in: [components/menu/MenuItem.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L46)

Additional CSS classes

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`className`](#classname-48)

##### activeClassName?

> `optional` **activeClassName**: `string`

Defined in: [components/menu/MenuItem.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L50)

CSS class applied when active

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`activeClassName`](#activeclassname-1)

##### badge?

> `optional` **badge**: `ReactNode`

Defined in: [components/menu/MenuItem.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L54)

Badge content (number, string, or ReactNode)

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`badge`](#badge-1)

##### badgeVariant?

> `optional` **badgeVariant**: [`BadgeVariant`](#badgevariant-1)

Defined in: [components/menu/MenuItem.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L58)

Badge variant for styling

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`badgeVariant`](#badgevariant-2)

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/menu/MenuItem.tsx:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L66)

Disabled state

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`disabled`](#disabled-11)

##### renderItem()?

> `optional` **renderItem**: (`props`) => `ReactNode`

Defined in: [components/menu/MenuItem.tsx:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L70)

Custom render function for the item

###### Parameters

###### props

###### label

`string`

###### icon?

`ReactNode`

###### active

`boolean`

###### Returns

`ReactNode`

###### Inherited from

`Omit.renderItem`

##### keyboardShortcut?

> `optional` **keyboardShortcut**: `string`

Defined in: [components/menu/MenuItem.tsx:74](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L74)

Keyboard shortcut to display next to the menu item

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`keyboardShortcut`](#keyboardshortcut-1)

***

### MenuContextValue

Defined in: [components/menu/Menu.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L21)

Menu context for sharing state with children

#### Properties

##### dense

> **dense**: `boolean`

Defined in: [components/menu/Menu.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L22)

##### collapsed

> **collapsed**: `boolean`

Defined in: [components/menu/Menu.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L23)

##### onKeyNavigation()

> **onKeyNavigation**: (`event`, `element`) => `void`

Defined in: [components/menu/Menu.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L24)

###### Parameters

###### event

`KeyboardEvent`

###### element

`HTMLElement`

###### Returns

`void`

##### registerItem()

> **registerItem**: (`element`) => `void`

Defined in: [components/menu/Menu.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L25)

###### Parameters

###### element

`HTMLElement`

###### Returns

`void`

##### unregisterItem()

> **unregisterItem**: (`element`) => `void`

Defined in: [components/menu/Menu.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L26)

###### Parameters

###### element

`HTMLElement`

###### Returns

`void`

***

### MenuProps

Defined in: [components/menu/Menu.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L52)

Menu component props

#### Extends

- `Omit`\<`React.HTMLAttributes`\<`HTMLElement`\>, `"component"`\>

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/menu/Menu.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L56)

Menu items (MenuItem, SubMenu, DashboardMenuItem)

###### Overrides

`Omit.children`

##### className?

> `optional` **className**: `string`

Defined in: [components/menu/Menu.tsx:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L60)

Additional CSS classes

###### Overrides

`Omit.className`

##### dense?

> `optional` **dense**: `boolean`

Defined in: [components/menu/Menu.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L64)

Dense mode for compact display

##### collapsed?

> `optional` **collapsed**: `boolean`

Defined in: [components/menu/Menu.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L68)

Collapsed mode for icon-only display

##### component?

> `optional` **component**: `ComponentType`\<\{ `children`: `ReactNode`; \}\>

Defined in: [components/menu/Menu.tsx:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L72)

Custom component to render as menu container

##### aria-label?

> `optional` **aria-label**: `string`

Defined in: [components/menu/Menu.tsx:76](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L76)

ARIA label for the navigation

###### Overrides

`Omit.aria-label`

***

### MenuItemProps

Defined in: [components/menu/MenuItem.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L30)

MenuItem component props

#### Extends

- `Omit`\<`React.AnchorHTMLAttributes`\<`HTMLAnchorElement`\>, `"href"`\>

#### Properties

##### to

> **to**: `string`

Defined in: [components/menu/MenuItem.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L34)

Navigation target path

##### label

> **label**: `string`

Defined in: [components/menu/MenuItem.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L38)

Menu item label text

##### icon?

> `optional` **icon**: `ReactNode` \| `ComponentType`\<\{ \}\>

Defined in: [components/menu/MenuItem.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L42)

Icon element or component

##### className?

> `optional` **className**: `string`

Defined in: [components/menu/MenuItem.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L46)

Additional CSS classes

###### Overrides

`Omit.className`

##### activeClassName?

> `optional` **activeClassName**: `string`

Defined in: [components/menu/MenuItem.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L50)

CSS class applied when active

##### badge?

> `optional` **badge**: `ReactNode`

Defined in: [components/menu/MenuItem.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L54)

Badge content (number, string, or ReactNode)

##### badgeVariant?

> `optional` **badgeVariant**: [`BadgeVariant`](#badgevariant-1)

Defined in: [components/menu/MenuItem.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L58)

Badge variant for styling

##### exact?

> `optional` **exact**: `boolean`

Defined in: [components/menu/MenuItem.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L62)

Exact match for active state (default: prefix match)

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/menu/MenuItem.tsx:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L66)

Disabled state

##### renderItem()?

> `optional` **renderItem**: (`props`) => `ReactNode`

Defined in: [components/menu/MenuItem.tsx:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L70)

Custom render function for the item

###### Parameters

###### props

###### label

`string`

###### icon?

`ReactNode`

###### active

`boolean`

###### Returns

`ReactNode`

##### keyboardShortcut?

> `optional` **keyboardShortcut**: `string`

Defined in: [components/menu/MenuItem.tsx:74](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L74)

Keyboard shortcut to display next to the menu item

***

### ResourceItemProps

Defined in: [components/menu/ResourceItem.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/ResourceItem.tsx#L33)

ResourceItem component props

#### Extends

- `Omit`\<[`MenuItemProps`](#menuitemprops), `"to"` \| `"label"`\>

#### Properties

##### icon?

> `optional` **icon**: `ReactNode` \| `ComponentType`\<\{ \}\>

Defined in: [components/menu/MenuItem.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L42)

Icon element or component

###### Inherited from

`Omit.icon`

##### className?

> `optional` **className**: `string`

Defined in: [components/menu/MenuItem.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L46)

Additional CSS classes

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`className`](#classname-48)

##### activeClassName?

> `optional` **activeClassName**: `string`

Defined in: [components/menu/MenuItem.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L50)

CSS class applied when active

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`activeClassName`](#activeclassname-1)

##### badge?

> `optional` **badge**: `ReactNode`

Defined in: [components/menu/MenuItem.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L54)

Badge content (number, string, or ReactNode)

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`badge`](#badge-1)

##### badgeVariant?

> `optional` **badgeVariant**: [`BadgeVariant`](#badgevariant-1)

Defined in: [components/menu/MenuItem.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L58)

Badge variant for styling

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`badgeVariant`](#badgevariant-2)

##### exact?

> `optional` **exact**: `boolean`

Defined in: [components/menu/MenuItem.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L62)

Exact match for active state (default: prefix match)

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`exact`](#exact)

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/menu/MenuItem.tsx:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L66)

Disabled state

###### Inherited from

[`MenuItemProps`](#menuitemprops).[`disabled`](#disabled-11)

##### renderItem()?

> `optional` **renderItem**: (`props`) => `ReactNode`

Defined in: [components/menu/MenuItem.tsx:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L70)

Custom render function for the item

###### Parameters

###### props

###### label

`string`

###### icon?

`ReactNode`

###### active

`boolean`

###### Returns

`ReactNode`

###### Inherited from

`Omit.renderItem`

##### name

> **name**: `string`

Defined in: [components/menu/ResourceItem.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/ResourceItem.tsx#L37)

The name of the resource (e.g., "posts", "users")

##### label?

> `optional` **label**: `string`

Defined in: [components/menu/ResourceItem.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/ResourceItem.tsx#L41)

Custom label (defaults to inflected resource name or resource definition label)

##### to?

> `optional` **to**: `string`

Defined in: [components/menu/ResourceItem.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/ResourceItem.tsx#L45)

Custom path (defaults to "/{resource}")

##### keyboardShortcut?

> `optional` **keyboardShortcut**: `string`

Defined in: [components/menu/ResourceItem.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/ResourceItem.tsx#L49)

Keyboard shortcut to display next to the menu item

###### Overrides

[`MenuItemProps`](#menuitemprops).[`keyboardShortcut`](#keyboardshortcut-1)

***

### SubMenuProps

Defined in: [components/menu/SubMenu.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/SubMenu.tsx#L35)

SubMenu component props

#### Properties

##### label

> **label**: `string`

Defined in: [components/menu/SubMenu.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/SubMenu.tsx#L39)

SubMenu label text

##### icon?

> `optional` **icon**: `ReactNode` \| `ComponentType`\<\{ \}\>

Defined in: [components/menu/SubMenu.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/SubMenu.tsx#L43)

Icon element or component

##### children

> **children**: `ReactNode`

Defined in: [components/menu/SubMenu.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/SubMenu.tsx#L47)

Child menu items

##### className?

> `optional` **className**: `string`

Defined in: [components/menu/SubMenu.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/SubMenu.tsx#L51)

Additional CSS classes

##### defaultOpen?

> `optional` **defaultOpen**: `boolean`

Defined in: [components/menu/SubMenu.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/SubMenu.tsx#L55)

Default open state (uncontrolled)

##### open?

> `optional` **open**: `boolean`

Defined in: [components/menu/SubMenu.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/SubMenu.tsx#L59)

Controlled open state

##### onOpenChange()?

> `optional` **onOpenChange**: (`open`) => `void`

Defined in: [components/menu/SubMenu.tsx:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/SubMenu.tsx#L63)

Callback when open state changes

###### Parameters

###### open

`boolean`

###### Returns

`void`

***

### ShowProps

Defined in: [components/show/Show.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/Show.tsx#L51)

Props for Show component
Combines ShowBase props (logic) with ShowView props (UI)

#### Extends

- `Omit`\<`ShowBaseProps`\<`RecordType`\>, `"children"` \| `"id"`\>.`Pick`\<[`ShowViewProps`](#showviewprops), `"actions"` \| `"empty"` \| `"className"` \| `"aside"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### id?

> `optional` **id**: `Identifier`

Defined in: [components/show/Show.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/Show.tsx#L55)

The record ID to show. If not provided, will be inferred from route params

##### children

> **children**: `ReactNode`

Defined in: [components/show/Show.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/Show.tsx#L57)

Child elements to render inside the show (typically fields)

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/show/Show.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/Show.tsx#L59)

Title to display in the show header

##### loading?

> `optional` **loading**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/show/Show.tsx:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/Show.tsx#L61)

Custom loading component

##### error?

> `optional` **error**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/show/Show.tsx:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/Show.tsx#L63)

Custom error component

##### emptyWhileLoading?

> `optional` **emptyWhileLoading**: `boolean`

Defined in: [components/show/Show.tsx:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/Show.tsx#L65)

If true, show empty component while loading

##### resource?

> `optional` **resource**: `string`

Defined in: [components/show/ShowBase.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowBase.tsx#L42)

The name of the resource to fetch. If not provided, uses ResourceContext

###### Inherited from

`Omit.resource`

##### queryOptions?

> `optional` **queryOptions**: [`UseGetOneOptions`](#usegetoneoptions)\<`RecordType`\> & `object`

Defined in: [components/show/ShowBase.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowBase.tsx#L46)

React Query options to pass to useGetOne

###### Type Declaration

###### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

###### onSuccess()?

> `optional` **onSuccess**: (`data`) => `void`

###### Parameters

###### data

`RecordType`

###### Returns

`void`

###### Inherited from

`Omit.queryOptions`

##### transform()?

> `optional` **transform**: (`record`) => `RecordType`

Defined in: [components/show/ShowBase.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowBase.tsx#L48)

Transform the record data before providing to context

###### Parameters

###### record

`RecordType`

###### Returns

`RecordType`

###### Inherited from

`Omit.transform`

##### onLoad()?

> `optional` **onLoad**: (`record`) => `void`

Defined in: [components/show/ShowBase.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowBase.tsx#L50)

Called when data is loaded

###### Parameters

###### record

`RecordType`

###### Returns

`void`

###### Inherited from

`Omit.onLoad`

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [components/show/ShowBase.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowBase.tsx#L52)

Called when there's an error

###### Parameters

###### error

`Error`

###### Returns

`void`

###### Inherited from

`Omit.onError`

##### onMount()?

> `optional` **onMount**: () => `void`

Defined in: [components/show/ShowBase.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowBase.tsx#L54)

Called when component mounts

###### Returns

`void`

###### Inherited from

`Omit.onMount`

##### onUnmount()?

> `optional` **onUnmount**: () => `void`

Defined in: [components/show/ShowBase.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowBase.tsx#L56)

Called when component unmounts

###### Returns

`void`

###### Inherited from

`Omit.onUnmount`

##### actions?

> `optional` **actions**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/show/ShowView.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L23)

Custom actions component (e.g., Edit button)

###### Inherited from

[`ShowViewProps`](#showviewprops).[`actions`](#actions-10)

##### empty?

> `optional` **empty**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/show/ShowView.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L25)

Component to display when the record is not found

###### Inherited from

[`ShowViewProps`](#showviewprops).[`empty`](#empty-14)

##### className?

> `optional` **className**: `string`

Defined in: [components/show/ShowView.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L27)

Additional CSS class name

###### Inherited from

[`ShowViewProps`](#showviewprops).[`className`](#classname-52)

##### aside?

> `optional` **aside**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/show/ShowView.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L29)

Aside content (e.g., related information)

###### Inherited from

[`ShowViewProps`](#showviewprops).[`aside`](#aside-9)

***

### ShowViewProps

Defined in: [components/show/ShowView.tsx:17](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L17)

Props for ShowView component

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/show/ShowView.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L19)

Child elements to render inside the show container

##### title?

> `optional` **title**: `ReactNode`

Defined in: [components/show/ShowView.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L21)

Title to display in the show header

##### actions?

> `optional` **actions**: `false` \| `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/show/ShowView.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L23)

Custom actions component (e.g., Edit button)

##### empty?

> `optional` **empty**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/show/ShowView.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L25)

Component to display when the record is not found

##### className?

> `optional` **className**: `string`

Defined in: [components/show/ShowView.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L27)

Additional CSS class name

##### aside?

> `optional` **aside**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/show/ShowView.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L29)

Aside content (e.g., related information)

##### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [components/show/ShowView.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L31)

Whether the record is currently loading

##### error?

> `optional` **error**: `Error` \| `null`

Defined in: [components/show/ShowView.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L33)

Error that occurred during fetching

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/show/ShowView.tsx:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L35)

The fetched record

##### loading?

> `optional` **loading**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/show/ShowView.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L37)

Custom loading component

##### errorComponent?

> `optional` **errorComponent**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [components/show/ShowView.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L39)

Custom error component

##### emptyWhileLoading?

> `optional` **emptyWhileLoading**: `boolean`

Defined in: [components/show/ShowView.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/ShowView.tsx#L41)

If true, show empty component while loading

***

### SimpleShowLayoutProps

Defined in: [components/show/SimpleShowLayout.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/SimpleShowLayout.tsx#L14)

#### Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/show/SimpleShowLayout.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/SimpleShowLayout.tsx#L18)

Field components to display

###### Overrides

`HTMLAttributes.children`

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/show/SimpleShowLayout.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/SimpleShowLayout.tsx#L22)

Optional record to use instead of RecordContext

##### gap?

> `optional` **gap**: `string`

Defined in: [components/show/SimpleShowLayout.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/SimpleShowLayout.tsx#L27)

Gap between fields (Tailwind spacing scale)

###### Default

```ts
'gap-4'
```

##### direction?

> `optional` **direction**: `"horizontal"` \| `"vertical"`

Defined in: [components/show/SimpleShowLayout.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/SimpleShowLayout.tsx#L32)

Direction of the layout

###### Default

```ts
'vertical'
```

##### columns?

> `optional` **columns**: `1` \| `2` \| `4` \| `3`

Defined in: [components/show/SimpleShowLayout.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/SimpleShowLayout.tsx#L36)

Number of columns for grid layout (only applies when direction is 'horizontal')

##### divider?

> `optional` **divider**: `boolean`

Defined in: [components/show/SimpleShowLayout.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/SimpleShowLayout.tsx#L41)

Whether to add dividers between fields

###### Default

```ts
false
```

***

### ShowTabInfo

Defined in: [components/show/TabbedShowLayout.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L38)

Tab information extracted from Tab children.
This normalized structure is used internally to render tabs consistently.

#### Properties

##### name

> **name**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L40)

Unique identifier for the tab

##### label

> **label**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L42)

Display label shown on the tab trigger

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/show/TabbedShowLayout.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L44)

Optional icon element to display before the label

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/show/TabbedShowLayout.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L46)

Whether the tab is disabled and cannot be selected

##### className?

> `optional` **className**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L48)

Additional CSS class for the tab panel content area

##### triggerClassName?

> `optional` **triggerClassName**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L50)

Additional CSS class for the tab trigger button

##### children

> **children**: `ReactNode`

Defined in: [components/show/TabbedShowLayout.tsx:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L52)

The tab panel content (fields, etc.)

##### count?

> `optional` **count**: `ReactNode`

Defined in: [components/show/TabbedShowLayout.tsx:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L54)

Optional count badge to display on the tab (e.g., related item count)

##### path?

> `optional` **path**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L56)

Path segment for URL synchronization

***

### TabbedShowLayoutContextValue

Defined in: [components/show/TabbedShowLayout.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L62)

Context value provided by TabbedShowLayout to its descendants.

#### Properties

##### activeTab

> **activeTab**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L64)

Currently active tab name

##### setActiveTab()

> **setActiveTab**: (`tabName`) => `void`

Defined in: [components/show/TabbedShowLayout.tsx:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L66)

Programmatically switch to a different tab

###### Parameters

###### tabName

`string`

###### Returns

`void`

##### tabs

> **tabs**: [`ShowTabInfo`](#showtabinfo)[]

Defined in: [components/show/TabbedShowLayout.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L68)

Array of all tab configurations

***

### TabProps

Defined in: [components/show/TabbedShowLayout.tsx:107](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L107)

Props for Tab component

#### Properties

##### label

> **label**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:109](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L109)

Label displayed on the tab trigger

##### name?

> `optional` **name**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:111](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L111)

Unique name/identifier for the tab. If not provided, generated from label

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/show/TabbedShowLayout.tsx:113](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L113)

Content to render inside the tab panel

##### icon?

> `optional` **icon**: `ReactNode`

Defined in: [components/show/TabbedShowLayout.tsx:115](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L115)

Optional icon to display before the label

##### disabled?

> `optional` **disabled**: `boolean`

Defined in: [components/show/TabbedShowLayout.tsx:117](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L117)

Whether the tab is disabled

##### className?

> `optional` **className**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:119](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L119)

Additional CSS class for the tab panel

##### triggerClassName?

> `optional` **triggerClassName**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:121](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L121)

Additional CSS class for the tab trigger

##### count?

> `optional` **count**: `ReactNode`

Defined in: [components/show/TabbedShowLayout.tsx:123](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L123)

Optional count badge to display on the tab (e.g., related item count)

##### path?

> `optional` **path**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:125](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L125)

Optional path segment for URL synchronization

***

### TabbedShowLayoutProps

Defined in: [components/show/TabbedShowLayout.tsx:192](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L192)

Props for TabbedShowLayout component

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [components/show/TabbedShowLayout.tsx:194](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L194)

Tab children defining each tab

##### className?

> `optional` **className**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:196](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L196)

Additional CSS class for the layout container

##### defaultTab?

> `optional` **defaultTab**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:198](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L198)

Default tab to show on initial mount (by name)

##### onTabChange()?

> `optional` **onTabChange**: (`tabName`) => `void`

Defined in: [components/show/TabbedShowLayout.tsx:200](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L200)

Callback fired when the active tab changes

###### Parameters

###### tabName

`string`

###### Returns

`void`

##### syncWithLocation?

> `optional` **syncWithLocation**: `boolean`

Defined in: [components/show/TabbedShowLayout.tsx:206](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L206)

Whether to sync active tab with the URL.
When enabled, tab changes update the URL path and browser back/forward works.

###### Default

```ts
false
```

##### ~~locationKey?~~

> `optional` **locationKey**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:213](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L213)

URL parameter key for tab sync.
Currently unused - tabs use path segments instead of query params.

###### Default

```ts
'tab'
```

###### Deprecated

Use path prop on Tab instead

##### record?

> `optional` **record**: `RaRecord`

Defined in: [components/show/TabbedShowLayout.tsx:215](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L215)

Optional record to use instead of RecordContext

##### gap?

> `optional` **gap**: `string`

Defined in: [components/show/TabbedShowLayout.tsx:220](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/show/TabbedShowLayout.tsx#L220)

Gap between fields within each tab panel.

###### Default

```ts
'gap-4'
```

***

### PaginationConfig

Defined in: [constants.ts:128](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L128)

Configuration interface for overriding pagination defaults

#### Extended by

- [`ListQueryConfig`](#listqueryconfig)

#### Properties

##### page?

> `optional` **page**: `number`

Defined in: [constants.ts:129](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L129)

##### perPage?

> `optional` **perPage**: `number`

Defined in: [constants.ts:130](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L130)

***

### SortConfig

Defined in: [constants.ts:136](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L136)

Configuration interface for overriding sort defaults

#### Extended by

- [`ListQueryConfig`](#listqueryconfig)

#### Properties

##### field?

> `optional` **field**: `string`

Defined in: [constants.ts:137](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L137)

##### order?

> `optional` **order**: `"ASC"` \| `"DESC"`

Defined in: [constants.ts:138](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L138)

***

### ListQueryConfig

Defined in: [constants.ts:144](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L144)

Full configuration interface for list queries

#### Extends

- [`PaginationConfig`](#paginationconfig).[`SortConfig`](#sortconfig)

#### Properties

##### page?

> `optional` **page**: `number`

Defined in: [constants.ts:129](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L129)

###### Inherited from

[`PaginationConfig`](#paginationconfig).[`page`](#page-3)

##### perPage?

> `optional` **perPage**: `number`

Defined in: [constants.ts:130](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L130)

###### Inherited from

[`PaginationConfig`](#paginationconfig).[`perPage`](#perpage-6)

##### field?

> `optional` **field**: `string`

Defined in: [constants.ts:137](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L137)

###### Inherited from

[`SortConfig`](#sortconfig).[`field`](#field-4)

##### order?

> `optional` **order**: `"ASC"` \| `"DESC"`

Defined in: [constants.ts:138](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L138)

###### Inherited from

[`SortConfig`](#sortconfig).[`order`](#order-3)

##### filter?

> `optional` **filter**: `Record`\<`string`, `unknown`\>

Defined in: [constants.ts:145](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L145)

***

### AuthProviderContextProviderProps

Defined in: [contexts/AuthProviderContext.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/AuthProviderContext.tsx#L12)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [contexts/AuthProviderContext.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/AuthProviderContext.tsx#L13)

##### authProvider

> **authProvider**: `AuthProvider`

Defined in: [contexts/AuthProviderContext.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/AuthProviderContext.tsx#L14)

***

### DataProviderContextProviderProps

Defined in: [contexts/DataProviderContext.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/DataProviderContext.tsx#L12)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [contexts/DataProviderContext.tsx:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/DataProviderContext.tsx#L13)

##### dataProvider

> **dataProvider**: `DataProvider`

Defined in: [contexts/DataProviderContext.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/DataProviderContext.tsx#L14)

***

### ShadminFormContextValue

Defined in: [contexts/FormContext.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L21)

Shadmin-specific form context properties extending react-hook-form

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

#### Properties

##### record?

> `optional` **record**: `RaRecord`

Defined in: [contexts/FormContext.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L23)

The current record being edited

##### resource?

> `optional` **resource**: `string`

Defined in: [contexts/FormContext.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L25)

Resource name

##### save()?

> `optional` **save**: (`data`) => `void` \| `Promise`\<`void`\>

Defined in: [contexts/FormContext.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L27)

Save function

###### Parameters

###### data

`T`

###### Returns

`void` \| `Promise`\<`void`\>

##### saving?

> `optional` **saving**: `boolean`

Defined in: [contexts/FormContext.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L29)

Whether the form is currently saving

##### mutationMode?

> `optional` **mutationMode**: [`MutationMode`](#mutationmode-2)

Defined in: [contexts/FormContext.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L31)

Mutation mode

##### onDelete()?

> `optional` **onDelete**: () => `void` \| `Promise`\<`void`\>

Defined in: [contexts/FormContext.tsx:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L33)

Delete function

###### Returns

`void` \| `Promise`\<`void`\>

***

### ListControllerResult

Defined in: [contexts/ListContext.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L41)

Result type for the list controller containing all list state and callbacks.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

The record type for this list, defaults to RaRecord

#### Properties

##### data

> **data**: `T`[] \| `undefined`

Defined in: [contexts/ListContext.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L43)

The list of records

##### total

> **total**: `number` \| `undefined`

Defined in: [contexts/ListContext.tsx:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L45)

Total number of records matching the filter

##### isLoading

> **isLoading**: `boolean`

Defined in: [contexts/ListContext.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L47)

Whether the data is currently loading

##### isFetching

> **isFetching**: `boolean`

Defined in: [contexts/ListContext.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L49)

Whether a background refetch is in progress

##### error

> **error**: `Error` \| `null`

Defined in: [contexts/ListContext.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L51)

Error if the query failed

##### page

> **page**: `number`

Defined in: [contexts/ListContext.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L53)

Current page number (1-indexed)

##### perPage

> **perPage**: `number`

Defined in: [contexts/ListContext.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L55)

Number of records per page

##### sort

> **sort**: [`SortPayload`](#sortpayload)

Defined in: [contexts/ListContext.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L57)

Current sort configuration

##### filterValues

> **filterValues**: [`TypedFilterPayload`](#typedfilterpayload)\<`RaRecord`\> & `Record`\<`string`, `unknown`\>

Defined in: [contexts/ListContext.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L59)

Current filter values

##### selectedIds

> **selectedIds**: `Identifier`[]

Defined in: [contexts/ListContext.tsx:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L61)

IDs of currently selected records

##### resource

> **resource**: `string`

Defined in: [contexts/ListContext.tsx:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L63)

Resource name

##### setPage()

> **setPage**: (`page`) => `void`

Defined in: [contexts/ListContext.tsx:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L65)

Callback to change the current page

###### Parameters

###### page

`number`

###### Returns

`void`

##### setPerPage()

> **setPerPage**: (`perPage`) => `void`

Defined in: [contexts/ListContext.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L67)

Callback to change items per page

###### Parameters

###### perPage

`number`

###### Returns

`void`

##### setSort()

> **setSort**: (`sort`) => `void`

Defined in: [contexts/ListContext.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L69)

Callback to change sort order

###### Parameters

###### sort

[`SortPayload`](#sortpayload)

###### Returns

`void`

##### setFilters()

> **setFilters**: (`filters`) => `void`

Defined in: [contexts/ListContext.tsx:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L71)

Callback to change filters

###### Parameters

###### filters

[`TypedFilterPayload`](#typedfilterpayload)\<`RaRecord`\> & `Record`\<`string`, `unknown`\>

###### Returns

`void`

##### onSelect()

> **onSelect**: (`ids`) => `void`

Defined in: [contexts/ListContext.tsx:73](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L73)

Callback to select records by IDs

###### Parameters

###### ids

`Identifier`[]

###### Returns

`void`

##### onToggleItem()

> **onToggleItem**: (`id`) => `void`

Defined in: [contexts/ListContext.tsx:75](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L75)

Callback to toggle selection of a single record

###### Parameters

###### id

`Identifier`

###### Returns

`void`

##### onUnselectItems()

> **onUnselectItems**: () => `void`

Defined in: [contexts/ListContext.tsx:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L77)

Callback to unselect all records

###### Returns

`void`

##### refetch()

> **refetch**: () => `void`

Defined in: [contexts/ListContext.tsx:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L79)

Callback to refetch the data

###### Returns

`void`

***

### ListContextProviderProps

Defined in: [contexts/ListContext.tsx:97](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L97)

Props for ListContextProvider

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### value

> **value**: [`ListControllerResult`](#listcontrollerresult)\<`T`\>

Defined in: [contexts/ListContext.tsx:98](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L98)

##### children

> **children**: `ReactNode`

Defined in: [contexts/ListContext.tsx:99](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L99)

***

### NotificationOptions

Defined in: [contexts/NotificationContext.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L19)

Options for notifications

#### Properties

##### type?

> `optional` **type**: [`NotificationType`](#notificationtype)

Defined in: [contexts/NotificationContext.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L21)

Type of notification

##### autoHideDuration?

> `optional` **autoHideDuration**: `number`

Defined in: [contexts/NotificationContext.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L23)

Duration in milliseconds before auto-hide (0 = never auto-hide)

##### undoable?

> `optional` **undoable**: `boolean`

Defined in: [contexts/NotificationContext.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L25)

Whether the notification can be undone

##### onUndo()?

> `optional` **onUndo**: () => `void`

Defined in: [contexts/NotificationContext.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L27)

Callback when undo is clicked

###### Returns

`void`

##### messageArgs?

> `optional` **messageArgs**: `Record`\<`string`, `unknown`\>

Defined in: [contexts/NotificationContext.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L29)

Additional data to pass with the notification

##### multiLine?

> `optional` **multiLine**: `boolean`

Defined in: [contexts/NotificationContext.tsx:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L31)

Multi-line mode

***

### Notification

Defined in: [contexts/NotificationContext.tsx:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L37)

A single notification item

#### Properties

##### id

> **id**: `string`

Defined in: [contexts/NotificationContext.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L39)

Unique identifier

##### message

> **message**: `string`

Defined in: [contexts/NotificationContext.tsx:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L41)

The notification message

##### options?

> `optional` **options**: [`NotificationOptions`](#notificationoptions)

Defined in: [contexts/NotificationContext.tsx:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L43)

Notification options

***

### NotificationContextValue

Defined in: [contexts/NotificationContext.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L49)

Notification context value

#### Properties

##### notifications

> **notifications**: [`Notification`](#notification)[]

Defined in: [contexts/NotificationContext.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L51)

Current notifications

##### dismiss()

> **dismiss**: (`id`) => `void`

Defined in: [contexts/NotificationContext.tsx:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L53)

Dismiss a notification by id

###### Parameters

###### id

`string`

###### Returns

`void`

##### dismissAll()

> **dismissAll**: () => `void`

Defined in: [contexts/NotificationContext.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L55)

Dismiss all notifications

###### Returns

`void`

##### addNotification()

> **addNotification**: (`notification`) => `void`

Defined in: [contexts/NotificationContext.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L57)

Add a notification (internal use, prefer useNotify)

###### Parameters

###### notification

[`Notification`](#notification)

###### Returns

`void`

***

### NotificationContextProviderProps

Defined in: [contexts/NotificationContext.tsx:87](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L87)

Props for NotificationContextProvider

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [contexts/NotificationContext.tsx:88](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L88)

***

### RecordContextProviderProps

Defined in: [contexts/RecordContext.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/RecordContext.tsx#L23)

Props for RecordContextProvider

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### value

> **value**: `T` \| `undefined`

Defined in: [contexts/RecordContext.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/RecordContext.tsx#L24)

##### children

> **children**: `ReactNode`

Defined in: [contexts/RecordContext.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/RecordContext.tsx#L25)

***

### ResourceContextProviderProps

Defined in: [contexts/ResourceContext.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L21)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [contexts/ResourceContext.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L22)

##### value

> **value**: `string`

Defined in: [contexts/ResourceContext.tsx:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L23)

***

### UseResourceContextOptions

Defined in: [contexts/ResourceContext.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L64)

Options for useResourceContext hook

#### Properties

##### required?

> `optional` **required**: `boolean`

Defined in: [contexts/ResourceContext.tsx:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L66)

Whether to throw if used outside provider

##### defaultValue?

> `optional` **defaultValue**: `string`

Defined in: [contexts/ResourceContext.tsx:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L68)

Default value to use if not in a provider

***

### ResourceDefinitions

Defined in: [contexts/ResourceContext.tsx:105](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L105)

ResourceDefinitionContext
Stores all registered resource definitions

#### Indexable

\[`name`: `string`\]: `ResourceDefinition`\<`ResourceOptions`\>

***

### ResourceDefinitionContextProviderProps

Defined in: [contexts/ResourceContext.tsx:111](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L111)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [contexts/ResourceContext.tsx:112](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L112)

##### definitions

> **definitions**: [`ResourceDefinitions`](#resourcedefinitions)

Defined in: [contexts/ResourceContext.tsx:113](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L113)

***

### ThemeContextValue

Defined in: [contexts/ThemeContext.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L18)

#### Properties

##### theme

> **theme**: [`Theme`](#theme-1)

Defined in: [contexts/ThemeContext.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L19)

##### setTheme()

> **setTheme**: (`theme`) => `void`

Defined in: [contexts/ThemeContext.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L20)

###### Parameters

###### theme

[`Theme`](#theme-1)

###### Returns

`void`

##### resolvedTheme

> **resolvedTheme**: `"light"` \| `"dark"`

Defined in: [contexts/ThemeContext.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L21)

##### themes

> **themes**: `string`[]

Defined in: [contexts/ThemeContext.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L22)

***

### ThemeProviderProps

Defined in: [contexts/ThemeContext.tsx:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L27)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [contexts/ThemeContext.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L28)

##### defaultTheme?

> `optional` **defaultTheme**: [`Theme`](#theme-1)

Defined in: [contexts/ThemeContext.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L30)

Default theme to use

##### storageKey?

> `optional` **storageKey**: `string`

Defined in: [contexts/ThemeContext.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L32)

Key for localStorage persistence

##### themes?

> `optional` **themes**: `string`[]

Defined in: [contexts/ThemeContext.tsx:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L34)

Available themes

##### attribute?

> `optional` **attribute**: `string` \| `string`[]

Defined in: [contexts/ThemeContext.tsx:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L36)

Attribute to set on document element

##### forcedTheme?

> `optional` **forcedTheme**: [`Theme`](#theme-1)

Defined in: [contexts/ThemeContext.tsx:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L38)

Force a specific theme (ignores user preference)

##### disableTransitionOnChange?

> `optional` **disableTransitionOnChange**: `boolean`

Defined in: [contexts/ThemeContext.tsx:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L40)

Disable transitions when theme changes

***

### TranslateOptions

Defined in: [contexts/TranslationContext.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L18)

Translation options for interpolation and pluralization

#### Indexable

\[`key`: `string`\]: `string` \| `number` \| `undefined`

Dynamic values for interpolation

#### Properties

##### \_?

> `optional` **\_**: `string`

Defined in: [contexts/TranslationContext.tsx:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L20)

Default value if key is not found

##### smart\_count?

> `optional` **smart\_count**: `number`

Defined in: [contexts/TranslationContext.tsx:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L22)

Count for pluralization

***

### I18nProvider

Defined in: [contexts/TranslationContext.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L46)

I18n provider interface - matches react-admin

#### Properties

##### translate

> **translate**: [`TranslateFunction`](#translatefunction)

Defined in: [contexts/TranslationContext.tsx:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L47)

##### changeLocale()

> **changeLocale**: (`locale`) => `Promise`\<`void`\>

Defined in: [contexts/TranslationContext.tsx:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L48)

###### Parameters

###### locale

`string`

###### Returns

`Promise`\<`void`\>

##### getLocale()

> **getLocale**: () => `string`

Defined in: [contexts/TranslationContext.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L49)

###### Returns

`string`

##### getLocales()?

> `optional` **getLocales**: () => `object`[]

Defined in: [contexts/TranslationContext.tsx:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L50)

###### Returns

`object`[]

***

### TranslationContextValue

Defined in: [contexts/TranslationContext.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L56)

Context value interface

#### Properties

##### locale

> **locale**: `string`

Defined in: [contexts/TranslationContext.tsx:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L57)

##### setLocale()

> **setLocale**: (`locale`) => `void`

Defined in: [contexts/TranslationContext.tsx:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L58)

###### Parameters

###### locale

`string`

###### Returns

`void`

##### i18nProvider

> **i18nProvider**: [`I18nProvider`](#i18nprovider)

Defined in: [contexts/TranslationContext.tsx:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L59)

***

### TranslationProviderProps

Defined in: [contexts/TranslationContext.tsx:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L64)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [contexts/TranslationContext.tsx:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L65)

##### i18nProvider?

> `optional` **i18nProvider**: [`I18nProvider`](#i18nprovider)

Defined in: [contexts/TranslationContext.tsx:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L67)

Custom i18n provider

##### locale?

> `optional` **locale**: `string`

Defined in: [contexts/TranslationContext.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L69)

Default locale

***

### DOConfig

Defined in: [dotdo/types.ts:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L15)

Configuration options for the DO() factory

#### Properties

##### baseUrl

> **baseUrl**: `string`

Defined in: [dotdo/types.ts:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L20)

Base URL for the dotdo API endpoint

###### Example

```ts
'https://api.your-app.do'
```

##### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [dotdo/types.ts:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L25)

Optional custom headers to include with every request

##### credentials?

> `optional` **credentials**: `RequestCredentials`

Defined in: [dotdo/types.ts:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L31)

Optional request credentials mode

###### Default

```ts
'include'
```

##### timeout?

> `optional` **timeout**: `number`

Defined in: [dotdo/types.ts:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L37)

Optional timeout in milliseconds

###### Default

```ts
30000
```

***

### DBOptions

Defined in: [dotdo/types.ts:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L43)

Options for the DataProvider factory (DB)

#### Properties

##### resourceMapping?

> `optional` **resourceMapping**: `Record`\<`string`, `string`\>

Defined in: [dotdo/types.ts:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L49)

Optional resource name mappings
Maps react-admin resource names to dotdo collection names

###### Example

```ts
{ 'users': 'user-profiles', 'posts': 'blog-posts' }
```

##### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [dotdo/types.ts:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L54)

Optional custom headers for data requests

***

### AuthOptions

Defined in: [dotdo/types.ts:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L60)

Options for the AuthProvider factory (Auth)

#### Properties

##### tokenKey?

> `optional` **tokenKey**: `string`

Defined in: [dotdo/types.ts:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L65)

Key used to store the auth token in localStorage

###### Default

```ts
'dotdo_auth_token'
```

##### identityKey?

> `optional` **identityKey**: `string`

Defined in: [dotdo/types.ts:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L71)

Key used to store user identity in localStorage

###### Default

```ts
'dotdo_user_identity'
```

##### logoutRedirectPath?

> `optional` **logoutRedirectPath**: `string`

Defined in: [dotdo/types.ts:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L77)

Path to redirect after logout

###### Default

```ts
'/login'
```

##### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [dotdo/types.ts:82](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L82)

Custom headers for auth requests

***

### DOListResponse

Defined in: [dotdo/types.ts:88](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L88)

Standard response format from dotdo API for list operations

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `T`[]

Defined in: [dotdo/types.ts:89](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L89)

##### total

> **total**: `number`

Defined in: [dotdo/types.ts:90](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L90)

##### pageInfo?

> `optional` **pageInfo**: `object`

Defined in: [dotdo/types.ts:91](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L91)

###### hasNextPage

> **hasNextPage**: `boolean`

###### hasPreviousPage

> **hasPreviousPage**: `boolean`

###### startCursor?

> `optional` **startCursor**: `string`

###### endCursor?

> `optional` **endCursor**: `string`

***

### DORecordResponse

Defined in: [dotdo/types.ts:102](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L102)

Standard response format from dotdo API for single record operations

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `T`

Defined in: [dotdo/types.ts:103](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L103)

***

### DOBatchResponse

Defined in: [dotdo/types.ts:109](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L109)

Standard response format from dotdo API for batch operations

#### Properties

##### data

> **data**: `Identifier`[]

Defined in: [dotdo/types.ts:110](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L110)

***

### DOLoginResponse

Defined in: [dotdo/types.ts:116](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L116)

Auth token response from dotdo login

#### Properties

##### token

> **token**: `string`

Defined in: [dotdo/types.ts:117](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L117)

##### user

> **user**: [`DOUserIdentity`](#douseridentity)

Defined in: [dotdo/types.ts:118](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L118)

##### expiresAt?

> `optional` **expiresAt**: `string`

Defined in: [dotdo/types.ts:119](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L119)

***

### DOUserIdentity

Defined in: [dotdo/types.ts:125](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L125)

User identity from dotdo

#### Indexable

\[`key`: `string`\]: `unknown`

#### Properties

##### id

> **id**: `Identifier`

Defined in: [dotdo/types.ts:126](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L126)

##### email?

> `optional` **email**: `string`

Defined in: [dotdo/types.ts:127](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L127)

##### fullName?

> `optional` **fullName**: `string`

Defined in: [dotdo/types.ts:128](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L128)

##### avatar?

> `optional` **avatar**: `string`

Defined in: [dotdo/types.ts:129](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L129)

##### roles?

> `optional` **roles**: `string`[]

Defined in: [dotdo/types.ts:130](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L130)

##### permissions?

> `optional` **permissions**: `string`[]

Defined in: [dotdo/types.ts:131](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L131)

***

### DOErrorResponse

Defined in: [dotdo/types.ts:138](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L138)

Error response from dotdo API

#### Properties

##### error

> **error**: `object`

Defined in: [dotdo/types.ts:139](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L139)

###### code

> **code**: `string`

###### message

> **message**: `string`

###### details?

> `optional` **details**: `Record`\<`string`, `unknown`\>

***

### DORequestOptions

Defined in: [dotdo/types.ts:149](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L149)

Request options for fetch calls

#### Properties

##### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"`

Defined in: [dotdo/types.ts:150](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L150)

##### body?

> `optional` **body**: `unknown`

Defined in: [dotdo/types.ts:151](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L151)

##### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [dotdo/types.ts:152](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L152)

##### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [dotdo/types.ts:153](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L153)

***

### DOResult

Defined in: [dotdo/types.ts:159](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L159)

Result from the DO() factory function

#### Properties

##### DB()

> **DB**: (`options?`) => `DataProvider`

Defined in: [dotdo/types.ts:164](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L164)

Creates a DataProvider for react-admin

###### Parameters

###### options?

[`DBOptions`](#dboptions)

Optional configuration

###### Returns

`DataProvider`

##### Auth()

> **Auth**: (`options?`) => `AuthProvider`

Defined in: [dotdo/types.ts:170](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/types.ts#L170)

Creates an AuthProvider for react-admin

###### Parameters

###### options?

[`AuthOptions`](#authoptions)

Optional configuration

###### Returns

`AuthProvider`

***

### BaseErrorHandling

Defined in: [hooks/createDataHook.ts:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L32)

Base error handling result shared by all hooks

#### Properties

##### isNetworkError

> **isNetworkError**: `boolean`

Defined in: [hooks/createDataHook.ts:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L33)

##### isForbidden

> **isForbidden**: `boolean`

Defined in: [hooks/createDataHook.ts:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L34)

##### isNotFound

> **isNotFound**: `boolean`

Defined in: [hooks/createDataHook.ts:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L35)

##### isServerError

> **isServerError**: `boolean`

Defined in: [hooks/createDataHook.ts:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L36)

##### isTimeout

> **isTimeout**: `boolean`

Defined in: [hooks/createDataHook.ts:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L37)

##### errorCount

> **errorCount**: `number`

Defined in: [hooks/createDataHook.ts:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L38)

##### shouldRedirectToLogin

> **shouldRedirectToLogin**: `boolean`

Defined in: [hooks/createDataHook.ts:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L39)

***

### MutationErrorHandling

Defined in: [hooks/createDataHook.ts:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L45)

Mutation-specific error handling

#### Properties

##### fieldErrors

> **fieldErrors**: `Record`\<`string`, `string`[]\> \| `null`

Defined in: [hooks/createDataHook.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L46)

##### isServerValidationError

> **isServerValidationError**: `boolean`

Defined in: [hooks/createDataHook.ts:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L47)

##### isConflictError

> **isConflictError**: `boolean`

Defined in: [hooks/createDataHook.ts:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L48)

##### retryAfter

> **retryAfter**: `number` \| `undefined`

Defined in: [hooks/createDataHook.ts:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L49)

##### getFieldErrors()

> **getFieldErrors**: (`field`) => `string`[]

Defined in: [hooks/createDataHook.ts:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L50)

###### Parameters

###### field

`string`

###### Returns

`string`[]

##### hasFieldError()

> **hasFieldError**: (`field`) => `boolean`

Defined in: [hooks/createDataHook.ts:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L51)

###### Parameters

###### field

`string`

###### Returns

`boolean`

##### clearError()

> **clearError**: () => `void`

Defined in: [hooks/createDataHook.ts:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L52)

###### Returns

`void`

##### clearFieldError()

> **clearFieldError**: (`field`) => `void`

Defined in: [hooks/createDataHook.ts:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L53)

###### Parameters

###### field

`string`

###### Returns

`void`

##### lastSubmittedData

> **lastSubmittedData**: `unknown`

Defined in: [hooks/createDataHook.ts:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L54)

##### submissionCount

> **submissionCount**: `number`

Defined in: [hooks/createDataHook.ts:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L55)

##### retry

> **retry**: () => `Promise`\<`unknown`\> \| `undefined`

Defined in: [hooks/createDataHook.ts:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L56)

***

### QueryHookConfig

Defined in: [hooks/createDataHook.ts:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L67)

Configuration for creating a query hook

#### Type Parameters

##### TMethod

`TMethod` *extends* keyof `DataProvider`

##### TParams

`TParams`

##### TResult

`TResult`

##### _TRecordType

`_TRecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### method

> **method**: `TMethod`

Defined in: [hooks/createDataHook.ts:74](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L74)

The data provider method name

##### getQueryKey()

> **getQueryKey**: (`resource`, `params`) => readonly `unknown`[]

Defined in: [hooks/createDataHook.ts:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L77)

Build the query key from resource and params

###### Parameters

###### resource

`string`

###### params

`TParams`

###### Returns

readonly `unknown`[]

##### transformParams()?

> `optional` **transformParams**: (`params`) => `Parameters`\<`DataProvider`\[`TMethod`\]\>\[`1`\]

Defined in: [hooks/createDataHook.ts:80](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L80)

Transform params before calling data provider (e.g., merge with defaults)

###### Parameters

###### params

`TParams`

###### Returns

`Parameters`\<`DataProvider`\[`TMethod`\]\>\[`1`\]

##### transformResult()

> **transformResult**: (`data`) => `TResult`

Defined in: [hooks/createDataHook.ts:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L83)

Transform the query result to the hook return shape

###### Parameters

###### data

`Awaited`\<`ReturnType`\<`DataProvider`\[`TMethod`\]\>\> | `undefined`

###### Returns

`TResult`

##### useAuthErrorCheck?

> `optional` **useAuthErrorCheck**: `boolean`

Defined in: [hooks/createDataHook.ts:88](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L88)

Whether this hook should use auth provider error checking

***

### BaseQueryResult

Defined in: [hooks/createDataHook.ts:94](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L94)

Base query hook result

#### Properties

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/createDataHook.ts:95](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L95)

##### isFetching

> **isFetching**: `boolean`

Defined in: [hooks/createDataHook.ts:96](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L96)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/createDataHook.ts:97](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L97)

##### refetch()

> **refetch**: () => `Promise`\<`unknown`\>

Defined in: [hooks/createDataHook.ts:98](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L98)

###### Returns

`Promise`\<`unknown`\>

***

### CacheUpdateHandlers

Defined in: [hooks/createDataHook.ts:247](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L247)

Cache update handler for mutations

#### Type Parameters

##### _TRecordType

`_TRecordType` *extends* `RaRecord`

##### TParams

`TParams`

##### TResult

`TResult`

#### Properties

##### onMutate()?

> `optional` **onMutate**: (`queryClient`, `variables`) => `Promise`\<`unknown`\>

Defined in: [hooks/createDataHook.ts:249](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L249)

Called before mutation to capture cache state

###### Parameters

###### queryClient

`QueryClient`

###### variables

###### resource

`string`

###### params

`TParams`

###### Returns

`Promise`\<`unknown`\>

##### onSuccess()?

> `optional` **onSuccess**: (`queryClient`, `result`, `variables`, `context`) => `void`

Defined in: [hooks/createDataHook.ts:255](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L255)

Called after successful mutation to update cache

###### Parameters

###### queryClient

`QueryClient`

###### result

`TResult`

###### variables

###### resource

`string`

###### params

`TParams`

###### context

`unknown`

###### Returns

`void`

##### onError()?

> `optional` **onError**: (`queryClient`, `error`, `variables`, `context`) => `void`

Defined in: [hooks/createDataHook.ts:263](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L263)

Called on error to rollback cache

###### Parameters

###### queryClient

`QueryClient`

###### error

`Error`

###### variables

###### resource

`string`

###### params

`TParams`

###### context

`unknown`

###### Returns

`void`

***

### MutationHookConfig

Defined in: [hooks/createDataHook.ts:274](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L274)

Configuration for creating a mutation hook

#### Type Parameters

##### TMethod

`TMethod` *extends* keyof `DataProvider`

##### TParams

`TParams`

##### TResult

`TResult`

##### TRecordType

`TRecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### method

> **method**: `TMethod`

Defined in: [hooks/createDataHook.ts:281](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L281)

The data provider method name

##### transformParams()?

> `optional` **transformParams**: (`params`) => `Parameters`\<`DataProvider`\[`TMethod`\]\>\[`1`\]

Defined in: [hooks/createDataHook.ts:284](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L284)

Transform params before calling data provider

###### Parameters

###### params

`TParams`

###### Returns

`Parameters`\<`DataProvider`\[`TMethod`\]\>\[`1`\]

##### cacheHandlers?

> `optional` **cacheHandlers**: [`CacheUpdateHandlers`](#cacheupdatehandlers)\<`TRecordType`, `TParams`, `TResult`\>

Defined in: [hooks/createDataHook.ts:287](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L287)

Cache update handlers

##### getSubmittedData()?

> `optional` **getSubmittedData**: (`params`) => `unknown`

Defined in: [hooks/createDataHook.ts:290](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L290)

Extract the data for tracking submissions

###### Parameters

###### params

`TParams`

###### Returns

`unknown`

***

### BaseMutationState

Defined in: [hooks/createDataHook.ts:296](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L296)

Base mutation state

#### Type Parameters

##### TResult

`TResult`

#### Properties

##### data

> **data**: `TResult` \| `undefined`

Defined in: [hooks/createDataHook.ts:297](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L297)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/createDataHook.ts:298](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L298)

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/createDataHook.ts:299](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L299)

##### isPending

> **isPending**: `boolean`

Defined in: [hooks/createDataHook.ts:300](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L300)

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [hooks/createDataHook.ts:301](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L301)

##### isError

> **isError**: `boolean`

Defined in: [hooks/createDataHook.ts:302](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L302)

##### isIdle

> **isIdle**: `boolean`

Defined in: [hooks/createDataHook.ts:303](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L303)

##### reset()

> **reset**: () => `void`

Defined in: [hooks/createDataHook.ts:304](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/createDataHook.ts#L304)

###### Returns

`void`

***

### UseCanAccessParams

Defined in: [hooks/useCanAccess.ts:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L24)

Parameters for useCanAccess hook

#### Properties

##### permission?

> `optional` **permission**: `string` \| `string`[]

Defined in: [hooks/useCanAccess.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L26)

Simple permission string or array of permissions to check

##### resource?

> `optional` **resource**: `string`

Defined in: [hooks/useCanAccess.ts:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L28)

Resource name for resource-based permissions (e.g., "posts")

##### action?

> `optional` **action**: `string`

Defined in: [hooks/useCanAccess.ts:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L30)

Action name for resource-based permissions (e.g., "edit", "delete")

##### requireAll?

> `optional` **requireAll**: `boolean`

Defined in: [hooks/useCanAccess.ts:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L32)

When true, all permissions in the array must match.

###### Default

```ts
false
```

##### canAccessCheck()?

> `optional` **canAccessCheck**: (`permissions`) => `boolean`

Defined in: [hooks/useCanAccess.ts:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L34)

Custom function to check access against permissions object

###### Parameters

###### permissions

`unknown`

###### Returns

`boolean`

***

### UseCanAccessResult

Defined in: [hooks/useCanAccess.ts:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L40)

Return type for useCanAccess hook

#### Properties

##### canAccess

> **canAccess**: `boolean`

Defined in: [hooks/useCanAccess.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L42)

Whether the user has access (false while loading or on error)

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useCanAccess.ts:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L44)

Whether permissions are still being fetched

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useCanAccess.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCanAccess.ts#L46)

Error from fetching permissions, null if no error

***

### UseCreateMutateParams

Defined in: [hooks/useCreate.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L26)

Parameters for the create mutation

#### Type Parameters

##### TData

`TData` = `Record`\<`string`, `unknown`\>

#### Properties

##### data

> **data**: `TData`

Defined in: [hooks/useCreate.ts:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L27)

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useCreate.ts:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L28)

***

### UseCreateOptions

Defined in: [hooks/useCreate.ts:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L34)

Options for useCreate hook

#### Extends

- `Omit`\<`UseMutationOptions`\<`CreateResult`\<`RecordType`\>, `Error`, \{ `resource`: `string`; `params`: [`UseCreateMutateParams`](#usecreatemutateparams)\<`TVariables`\>; \}\>, `"mutationFn"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` = `Record`\<`string`, `unknown`\>

***

### UseCreateMutationState

Defined in: [hooks/useCreate.ts:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L45)

Return type for useCreate hook mutation state

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `CreateResult`\<`RecordType`\> \| `undefined`

Defined in: [hooks/useCreate.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L46)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useCreate.ts:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L47)

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useCreate.ts:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L48)

##### isPending

> **isPending**: `boolean`

Defined in: [hooks/useCreate.ts:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L49)

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [hooks/useCreate.ts:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L50)

##### isError

> **isError**: `boolean`

Defined in: [hooks/useCreate.ts:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L51)

##### isIdle

> **isIdle**: `boolean`

Defined in: [hooks/useCreate.ts:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L52)

##### reset()

> **reset**: () => `void`

Defined in: [hooks/useCreate.ts:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L53)

###### Returns

`void`

##### fieldErrors

> **fieldErrors**: `Record`\<`string`, `string`[]\> \| `null`

Defined in: [hooks/useCreate.ts:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L55)

##### isServerValidationError

> **isServerValidationError**: `boolean`

Defined in: [hooks/useCreate.ts:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L56)

##### isConflictError

> **isConflictError**: `boolean`

Defined in: [hooks/useCreate.ts:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L57)

##### retryAfter

> **retryAfter**: `number` \| `undefined`

Defined in: [hooks/useCreate.ts:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L58)

##### getFieldErrors()

> **getFieldErrors**: (`field`) => `string`[]

Defined in: [hooks/useCreate.ts:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L59)

###### Parameters

###### field

`string`

###### Returns

`string`[]

##### hasFieldError()

> **hasFieldError**: (`field`) => `boolean`

Defined in: [hooks/useCreate.ts:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L60)

###### Parameters

###### field

`string`

###### Returns

`boolean`

##### clearError()

> **clearError**: () => `void`

Defined in: [hooks/useCreate.ts:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L61)

###### Returns

`void`

##### clearFieldError()

> **clearFieldError**: (`field`) => `void`

Defined in: [hooks/useCreate.ts:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L62)

###### Parameters

###### field

`string`

###### Returns

`void`

##### lastSubmittedData

> **lastSubmittedData**: `unknown`

Defined in: [hooks/useCreate.ts:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L63)

##### submissionCount

> **submissionCount**: `number`

Defined in: [hooks/useCreate.ts:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L64)

##### retry

> **retry**: () => `Promise`\<`unknown`\> \| `undefined`

Defined in: [hooks/useCreate.ts:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L65)

***

### CreateSuggestionContextValue

Defined in: [hooks/useCreateSuggestionContext.ts:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreateSuggestionContext.ts#L15)

Context value for creating new suggestions

#### Type Parameters

##### TChoice

`TChoice` = `unknown`

The type of choice being created (defaults to unknown for maximum flexibility)

#### Properties

##### filter?

> `optional` **filter**: `string`

Defined in: [hooks/useCreateSuggestionContext.ts:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreateSuggestionContext.ts#L19)

The current filter/search text entered by the user

##### onCreate()

> **onCreate**: (`choice`) => `void`

Defined in: [hooks/useCreateSuggestionContext.ts:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreateSuggestionContext.ts#L24)

Callback to create a new choice with the given value

###### Parameters

###### choice

`TChoice`

The new choice to create

###### Returns

`void`

##### onCancel()

> **onCancel**: () => `void`

Defined in: [hooks/useCreateSuggestionContext.ts:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreateSuggestionContext.ts#L28)

Callback to cancel the create operation

###### Returns

`void`

***

### UseDeleteMutateParams

Defined in: [hooks/useDelete.ts:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L33)

Parameters for the delete mutation

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### id

> **id**: `Identifier`

Defined in: [hooks/useDelete.ts:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L34)

##### previousData?

> `optional` **previousData**: `RecordType`

Defined in: [hooks/useDelete.ts:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L35)

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useDelete.ts:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L36)

***

### UseDeleteOptions

Defined in: [hooks/useDelete.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L42)

Options for useDelete hook

#### Extends

- `Omit`\<`UseMutationOptions`\<`DeleteResult`\<`RecordType`\>, `Error`, \{ `resource`: `string`; `params`: [`UseDeleteMutateParams`](#usedeletemutateparams)\<`RecordType`\>; \}\>, `"mutationFn"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

***

### UseDeleteMutationState

Defined in: [hooks/useDelete.ts:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L51)

Return type for useDelete hook mutation state

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `DeleteResult`\<`RecordType`\> \| `undefined`

Defined in: [hooks/useDelete.ts:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L52)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useDelete.ts:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L53)

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useDelete.ts:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L54)

##### isPending

> **isPending**: `boolean`

Defined in: [hooks/useDelete.ts:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L55)

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [hooks/useDelete.ts:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L56)

##### isError

> **isError**: `boolean`

Defined in: [hooks/useDelete.ts:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L57)

##### isIdle

> **isIdle**: `boolean`

Defined in: [hooks/useDelete.ts:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L58)

##### reset()

> **reset**: () => `void`

Defined in: [hooks/useDelete.ts:59](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L59)

###### Returns

`void`

##### fieldErrors

> **fieldErrors**: `Record`\<`string`, `string`[]\> \| `null`

Defined in: [hooks/useDelete.ts:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L61)

##### isServerValidationError

> **isServerValidationError**: `boolean`

Defined in: [hooks/useDelete.ts:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L62)

##### isConflictError

> **isConflictError**: `boolean`

Defined in: [hooks/useDelete.ts:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L63)

##### retryAfter

> **retryAfter**: `number` \| `undefined`

Defined in: [hooks/useDelete.ts:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L64)

##### getFieldErrors()

> **getFieldErrors**: (`field`) => `string`[]

Defined in: [hooks/useDelete.ts:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L65)

###### Parameters

###### field

`string`

###### Returns

`string`[]

##### hasFieldError()

> **hasFieldError**: (`field`) => `boolean`

Defined in: [hooks/useDelete.ts:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L66)

###### Parameters

###### field

`string`

###### Returns

`boolean`

##### clearError()

> **clearError**: () => `void`

Defined in: [hooks/useDelete.ts:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L67)

###### Returns

`void`

##### clearFieldError()

> **clearFieldError**: (`field`) => `void`

Defined in: [hooks/useDelete.ts:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L68)

###### Parameters

###### field

`string`

###### Returns

`void`

##### lastSubmittedData

> **lastSubmittedData**: `unknown`

Defined in: [hooks/useDelete.ts:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L69)

##### submissionCount

> **submissionCount**: `number`

Defined in: [hooks/useDelete.ts:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L70)

##### retry

> **retry**: () => `Promise`\<`unknown`\> \| `undefined`

Defined in: [hooks/useDelete.ts:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L71)

***

### UseDeleteManyMutateParams

Defined in: [hooks/useDeleteMany.ts:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L18)

Parameters for the deleteMany mutation

#### Properties

##### ids

> **ids**: `Identifier`[]

Defined in: [hooks/useDeleteMany.ts:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L19)

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useDeleteMany.ts:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L20)

***

### UseDeleteManyOptions

Defined in: [hooks/useDeleteMany.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L26)

Options for useDeleteMany hook

#### Extends

- `Omit`\<`UseMutationOptions`\<`DeleteManyResult`\<`RecordType`\>, `Error`, \{ `resource`: `string`; `params`: [`UseDeleteManyMutateParams`](#usedeletemanymutateparams); \}\>, `"mutationFn"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

***

### UseDeleteManyMutationState

Defined in: [hooks/useDeleteMany.ts:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L35)

Return type for useDeleteMany hook mutation state

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `DeleteManyResult`\<`RecordType`\> \| `undefined`

Defined in: [hooks/useDeleteMany.ts:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L36)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useDeleteMany.ts:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L37)

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useDeleteMany.ts:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L38)

##### isPending

> **isPending**: `boolean`

Defined in: [hooks/useDeleteMany.ts:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L39)

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [hooks/useDeleteMany.ts:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L40)

##### isError

> **isError**: `boolean`

Defined in: [hooks/useDeleteMany.ts:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L41)

##### isIdle

> **isIdle**: `boolean`

Defined in: [hooks/useDeleteMany.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L42)

##### reset()

> **reset**: () => `void`

Defined in: [hooks/useDeleteMany.ts:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L43)

###### Returns

`void`

***

### UseGetListParams

Defined in: [hooks/useGetList.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L26)

Parameters for useGetList hook.

#### Properties

##### pagination?

> `optional` **pagination**: `PaginationPayload`

Defined in: [hooks/useGetList.ts:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L27)

##### sort?

> `optional` **sort**: [`SortPayload`](#sortpayload)\<`RaRecord`\>

Defined in: [hooks/useGetList.ts:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L28)

##### filter?

> `optional` **filter**: [`TypedFilterPayload`](#typedfilterpayload)\<`RaRecord`\> & `Record`\<`string`, `unknown`\>

Defined in: [hooks/useGetList.ts:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L29)

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useGetList.ts:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L30)

***

### UseGetListOptions

Defined in: [hooks/useGetList.ts:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L45)

Options for useGetList hook

#### Extends

- `Omit`\<`UseQueryOptions`\<`GetListResult`\<`RecordType`\>, `Error`\>, `"queryKey"` \| `"queryFn"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### enabled?

> `optional` **enabled**: `boolean`

Defined in: [hooks/useGetList.ts:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L47)

Set this to `false` or a function that returns `false` to disable automatic refetching when the query mounts or changes query keys.
To refetch the query, use the `refetch` method returned from the `useQuery` instance.
Accepts a boolean or function that returns a boolean.
Defaults to `true`.

###### Overrides

`Omit.enabled`

***

### UseGetListResult

Defined in: [hooks/useGetList.ts:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L53)

Return type for useGetList hook

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `RecordType`[] \| `undefined`

Defined in: [hooks/useGetList.ts:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L54)

##### total

> **total**: `number` \| `undefined`

Defined in: [hooks/useGetList.ts:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L55)

##### pageInfo?

> `optional` **pageInfo**: `object`

Defined in: [hooks/useGetList.ts:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L56)

###### hasNextPage?

> `optional` **hasNextPage**: `boolean`

###### hasPreviousPage?

> `optional` **hasPreviousPage**: `boolean`

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useGetList.ts:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L60)

##### isFetching

> **isFetching**: `boolean`

Defined in: [hooks/useGetList.ts:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L61)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useGetList.ts:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L62)

##### refetch()

> **refetch**: () => `Promise`\<`unknown`\>

Defined in: [hooks/useGetList.ts:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L63)

###### Returns

`Promise`\<`unknown`\>

##### isNetworkError

> **isNetworkError**: `boolean`

Defined in: [hooks/useGetList.ts:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L65)

##### isForbidden

> **isForbidden**: `boolean`

Defined in: [hooks/useGetList.ts:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L66)

##### isNotFound

> **isNotFound**: `boolean`

Defined in: [hooks/useGetList.ts:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L67)

##### isServerError

> **isServerError**: `boolean`

Defined in: [hooks/useGetList.ts:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L68)

##### isTimeout

> **isTimeout**: `boolean`

Defined in: [hooks/useGetList.ts:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L69)

##### errorCount

> **errorCount**: `number`

Defined in: [hooks/useGetList.ts:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L70)

##### shouldRedirectToLogin

> **shouldRedirectToLogin**: `boolean`

Defined in: [hooks/useGetList.ts:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetList.ts#L71)

***

### UseGetManyParams

Defined in: [hooks/useGetMany.ts:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L18)

Parameters for useGetMany hook

#### Properties

##### ids

> **ids**: `Identifier`[]

Defined in: [hooks/useGetMany.ts:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L19)

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useGetMany.ts:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L20)

***

### UseGetManyOptions

Defined in: [hooks/useGetMany.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L26)

Options for useGetMany hook

#### Extends

- `Omit`\<`UseQueryOptions`\<`GetManyResult`\<`RecordType`\>, `Error`\>, `"queryKey"` \| `"queryFn"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### enabled?

> `optional` **enabled**: `boolean`

Defined in: [hooks/useGetMany.ts:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L28)

Set this to `false` or a function that returns `false` to disable automatic refetching when the query mounts or changes query keys.
To refetch the query, use the `refetch` method returned from the `useQuery` instance.
Accepts a boolean or function that returns a boolean.
Defaults to `true`.

###### Overrides

`Omit.enabled`

***

### UseGetManyResult

Defined in: [hooks/useGetMany.ts:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L34)

Return type for useGetMany hook

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `RecordType`[] \| `undefined`

Defined in: [hooks/useGetMany.ts:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L35)

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useGetMany.ts:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L36)

##### isFetching

> **isFetching**: `boolean`

Defined in: [hooks/useGetMany.ts:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L37)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useGetMany.ts:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L38)

##### refetch()

> **refetch**: () => `Promise`\<`unknown`\>

Defined in: [hooks/useGetMany.ts:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetMany.ts#L39)

###### Returns

`Promise`\<`unknown`\>

***

### UseGetManyReferenceParams

Defined in: [hooks/useGetManyReference.ts:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L19)

Parameters for useGetManyReference hook

#### Properties

##### target

> **target**: `string`

Defined in: [hooks/useGetManyReference.ts:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L20)

##### id

> **id**: `Identifier`

Defined in: [hooks/useGetManyReference.ts:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L21)

##### pagination?

> `optional` **pagination**: `object`

Defined in: [hooks/useGetManyReference.ts:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L22)

###### page

> **page**: `number`

###### perPage

> **perPage**: `number`

##### sort?

> `optional` **sort**: `object`

Defined in: [hooks/useGetManyReference.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L26)

###### field

> **field**: `string`

###### order

> **order**: `"ASC"` \| `"DESC"`

##### filter?

> `optional` **filter**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useGetManyReference.ts:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L30)

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useGetManyReference.ts:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L31)

***

### UseGetManyReferenceOptions

Defined in: [hooks/useGetManyReference.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L46)

Options for useGetManyReference hook

#### Extends

- `Omit`\<`UseQueryOptions`\<`GetManyReferenceResult`\<`RecordType`\>, `Error`\>, `"queryKey"` \| `"queryFn"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### enabled?

> `optional` **enabled**: `boolean`

Defined in: [hooks/useGetManyReference.ts:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L48)

Set this to `false` or a function that returns `false` to disable automatic refetching when the query mounts or changes query keys.
To refetch the query, use the `refetch` method returned from the `useQuery` instance.
Accepts a boolean or function that returns a boolean.
Defaults to `true`.

###### Overrides

`Omit.enabled`

***

### UseGetManyReferenceResult

Defined in: [hooks/useGetManyReference.ts:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L54)

Return type for useGetManyReference hook

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `RecordType`[] \| `undefined`

Defined in: [hooks/useGetManyReference.ts:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L55)

##### total

> **total**: `number` \| `undefined`

Defined in: [hooks/useGetManyReference.ts:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L56)

##### pageInfo?

> `optional` **pageInfo**: `object`

Defined in: [hooks/useGetManyReference.ts:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L57)

###### hasNextPage?

> `optional` **hasNextPage**: `boolean`

###### hasPreviousPage?

> `optional` **hasPreviousPage**: `boolean`

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useGetManyReference.ts:61](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L61)

##### isFetching

> **isFetching**: `boolean`

Defined in: [hooks/useGetManyReference.ts:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L62)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useGetManyReference.ts:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L63)

##### refetch()

> **refetch**: () => `Promise`\<`unknown`\>

Defined in: [hooks/useGetManyReference.ts:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetManyReference.ts#L64)

###### Returns

`Promise`\<`unknown`\>

***

### UseGetOneParams

Defined in: [hooks/useGetOne.ts:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L23)

Parameters for useGetOne hook

#### Properties

##### id

> **id**: `Identifier`

Defined in: [hooks/useGetOne.ts:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L24)

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useGetOne.ts:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L25)

***

### UseGetOneOptions

Defined in: [hooks/useGetOne.ts:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L31)

Options for useGetOne hook

#### Extends

- `Omit`\<`UseQueryOptions`\<`GetOneResult`\<`RecordType`\>, `Error`\>, `"queryKey"` \| `"queryFn"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### enabled?

> `optional` **enabled**: `boolean`

Defined in: [hooks/useGetOne.ts:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L33)

Set this to `false` or a function that returns `false` to disable automatic refetching when the query mounts or changes query keys.
To refetch the query, use the `refetch` method returned from the `useQuery` instance.
Accepts a boolean or function that returns a boolean.
Defaults to `true`.

###### Overrides

`Omit.enabled`

***

### UseGetOneResult

Defined in: [hooks/useGetOne.ts:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L39)

Return type for useGetOne hook

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `RecordType` \| `undefined`

Defined in: [hooks/useGetOne.ts:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L40)

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useGetOne.ts:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L41)

##### isFetching

> **isFetching**: `boolean`

Defined in: [hooks/useGetOne.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L42)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useGetOne.ts:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L43)

##### refetch()

> **refetch**: () => `Promise`\<`unknown`\>

Defined in: [hooks/useGetOne.ts:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L44)

###### Returns

`Promise`\<`unknown`\>

##### isNetworkError

> **isNetworkError**: `boolean`

Defined in: [hooks/useGetOne.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L46)

##### isForbidden

> **isForbidden**: `boolean`

Defined in: [hooks/useGetOne.ts:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L47)

##### isNotFound

> **isNotFound**: `boolean`

Defined in: [hooks/useGetOne.ts:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L48)

##### isServerError

> **isServerError**: `boolean`

Defined in: [hooks/useGetOne.ts:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L49)

##### isTimeout

> **isTimeout**: `boolean`

Defined in: [hooks/useGetOne.ts:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L50)

##### errorCount

> **errorCount**: `number`

Defined in: [hooks/useGetOne.ts:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L51)

##### shouldRedirectToLogin

> **shouldRedirectToLogin**: `boolean`

Defined in: [hooks/useGetOne.ts:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useGetOne.ts#L52)

***

### UseListParamsProps

Defined in: [hooks/useListParams.ts:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L24)

Parameters for useListParams hook

#### Properties

##### resource

> **resource**: `string`

Defined in: [hooks/useListParams.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L26)

The name of the resource (used as prefix for storeKey)

##### storeKey?

> `optional` **storeKey**: `string`

Defined in: [hooks/useListParams.ts:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L28)

Custom store key for namespacing URL params (e.g., "myList" results in "myList.page")

##### perPage?

> `optional` **perPage**: `number`

Defined in: [hooks/useListParams.ts:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L30)

Default number of items per page

##### sort?

> `optional` **sort**: [`SortPayload`](#sortpayload)\<`RaRecord`\>

Defined in: [hooks/useListParams.ts:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L32)

Default sort configuration

##### filterDefaultValues?

> `optional` **filterDefaultValues**: [`TypedFilterPayload`](#typedfilterpayload)\<`RaRecord`\> & `Record`\<`string`, `unknown`\>

Defined in: [hooks/useListParams.ts:34](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L34)

Default filter values

##### disableSyncWithLocation?

> `optional` **disableSyncWithLocation**: `boolean`

Defined in: [hooks/useListParams.ts:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L36)

If true, don't sync with URL

##### debounceDelay?

> `optional` **debounceDelay**: `number`

Defined in: [hooks/useListParams.ts:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L38)

Debounce delay in ms for URL updates (default: 200ms, set to 0 to disable)

***

### UseListParamsResult

Defined in: [hooks/useListParams.ts:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L44)

Result type for useListParams hook

#### Properties

##### page

> **page**: `number`

Defined in: [hooks/useListParams.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L46)

Current page number (1-indexed)

##### perPage

> **perPage**: `number`

Defined in: [hooks/useListParams.ts:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L48)

Number of items per page

##### sort

> **sort**: [`SortPayload`](#sortpayload)

Defined in: [hooks/useListParams.ts:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L50)

Current sort configuration

##### filterValues

> **filterValues**: [`TypedFilterPayload`](#typedfilterpayload)\<`RaRecord`\> & `Record`\<`string`, `unknown`\>

Defined in: [hooks/useListParams.ts:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L52)

Current filter values

##### setPage()

> **setPage**: (`page`) => `void`

Defined in: [hooks/useListParams.ts:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L54)

Callback to change page

###### Parameters

###### page

`number`

###### Returns

`void`

##### setPerPage()

> **setPerPage**: (`perPage`) => `void`

Defined in: [hooks/useListParams.ts:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L56)

Callback to change items per page

###### Parameters

###### perPage

`number`

###### Returns

`void`

##### setSort()

> **setSort**: (`sort`) => `void`

Defined in: [hooks/useListParams.ts:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L58)

Callback to change sort

###### Parameters

###### sort

[`SortPayload`](#sortpayload)

###### Returns

`void`

##### setFilters()

> **setFilters**: (`filters`) => `void`

Defined in: [hooks/useListParams.ts:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useListParams.ts#L60)

Callback to change filters

###### Parameters

###### filters

[`TypedFilterPayload`](#typedfilterpayload)\<`RaRecord`\> & `Record`\<`string`, `unknown`\>

###### Returns

`void`

***

### UseLocaleResult

Defined in: [hooks/useLocale.ts:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLocale.ts#L12)

#### Properties

##### locale

> **locale**: `string`

Defined in: [hooks/useLocale.ts:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLocale.ts#L13)

##### changeLocale()

> **changeLocale**: (`locale`) => `void`

Defined in: [hooks/useLocale.ts:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLocale.ts#L14)

###### Parameters

###### locale

`string`

###### Returns

`void`

***

### UseLoginOptions

Defined in: [hooks/useLogin.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L12)

#### Properties

##### onSuccess()?

> `optional` **onSuccess**: () => `void`

Defined in: [hooks/useLogin.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L14)

Callback called on successful login

###### Returns

`void`

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [hooks/useLogin.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L16)

Callback called on login error

###### Parameters

###### error

`Error`

###### Returns

`void`

***

### LoginOptions

Defined in: [hooks/useLogin.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L19)

#### Properties

##### redirectTo?

> `optional` **redirectTo**: `string` \| `false`

Defined in: [hooks/useLogin.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L21)

Where to redirect after login. Set to false to disable redirect

***

### UseLoginResult

Defined in: [hooks/useLogin.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L24)

#### Properties

##### login()

> **login**: (`credentials`, `options?`) => `Promise`\<`void`\>

Defined in: [hooks/useLogin.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L26)

Function to call with credentials to log in

###### Parameters

###### credentials

`Record`\<`string`, `unknown`\>

###### options?

[`LoginOptions`](#loginoptions)

###### Returns

`Promise`\<`void`\>

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useLogin.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L28)

Whether a login is currently in progress

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useLogin.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L30)

Error from the last login attempt, or null

##### retryAfter

> **retryAfter**: `number` \| `undefined`

Defined in: [hooks/useLogin.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogin.tsx#L32)

Retry after duration in seconds (for rate limiting)

***

### UseLogoutOptions

Defined in: [hooks/useLogout.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L12)

#### Properties

##### onSuccess()?

> `optional` **onSuccess**: () => `void`

Defined in: [hooks/useLogout.tsx:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L14)

Callback called on successful logout

###### Returns

`void`

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [hooks/useLogout.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L16)

Callback called on logout error

###### Parameters

###### error

`Error`

###### Returns

`void`

***

### LogoutOptions

Defined in: [hooks/useLogout.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L19)

#### Properties

##### redirectTo?

> `optional` **redirectTo**: `string` \| `false`

Defined in: [hooks/useLogout.tsx:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L21)

Where to redirect after logout. Set to false to disable redirect

***

### UseLogoutResult

Defined in: [hooks/useLogout.tsx:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L24)

#### Properties

##### logout()

> **logout**: (`options?`) => `Promise`\<`void`\>

Defined in: [hooks/useLogout.tsx:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L26)

Function to call to log out

###### Parameters

###### options?

[`LogoutOptions`](#logoutoptions)

###### Returns

`Promise`\<`void`\>

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useLogout.tsx:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L28)

Whether a logout is currently in progress

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useLogout.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L30)

Error from the last logout attempt, or null

##### isLocalStateCleaned

> **isLocalStateCleaned**: `boolean`

Defined in: [hooks/useLogout.tsx:32](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useLogout.tsx#L32)

Whether local state has been cleaned regardless of server error

***

### UsePermissionsOptions

Defined in: [hooks/usePermissions.ts:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/usePermissions.ts#L23)

Options for usePermissions hook

#### Properties

##### enabled?

> `optional` **enabled**: `boolean`

Defined in: [hooks/usePermissions.ts:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/usePermissions.ts#L25)

Whether to enable the query.

###### Default

```ts
true
```

##### params?

> `optional` **params**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/usePermissions.ts:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/usePermissions.ts#L27)

Parameters to pass to getPermissions

***

### UsePermissionsResult

Defined in: [hooks/usePermissions.ts:33](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/usePermissions.ts#L33)

Return type for usePermissions hook

#### Type Parameters

##### Permissions

`Permissions` = `unknown`

#### Properties

##### permissions

> **permissions**: `Permissions` \| `undefined`

Defined in: [hooks/usePermissions.ts:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/usePermissions.ts#L35)

The permissions data, undefined while loading or on error

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/usePermissions.ts:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/usePermissions.ts#L37)

Whether the query is in initial loading state

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/usePermissions.ts:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/usePermissions.ts#L39)

Error from the query, null if no error

##### refetch()

> **refetch**: () => `Promise`\<`QueryObserverResult`\<`Permissions`, `Error`\>\>

Defined in: [hooks/usePermissions.ts:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/usePermissions.ts#L41)

Function to manually refetch permissions

###### Returns

`Promise`\<`QueryObserverResult`\<`Permissions`, `Error`\>\>

***

### RedirectOptions

Defined in: [hooks/useRedirect.ts:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRedirect.ts#L19)

Options for redirect

#### Properties

##### basePath?

> `optional` **basePath**: `string`

Defined in: [hooks/useRedirect.ts:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRedirect.ts#L21)

Base path for the resource

##### state?

> `optional` **state**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useRedirect.ts:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRedirect.ts#L23)

State to pass with the navigation

##### replace?

> `optional` **replace**: `boolean`

Defined in: [hooks/useRedirect.ts:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRedirect.ts#L25)

Replace instead of push to history

***

### RefreshOptions

Defined in: [hooks/useRefresh.ts:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRefresh.ts#L13)

Options for refresh

#### Properties

##### hard?

> `optional` **hard**: `boolean`

Defined in: [hooks/useRefresh.ts:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRefresh.ts#L15)

If true, clears the cache before refetching (hard refresh)

***

### UseUpdateMutateParams

Defined in: [hooks/useUpdate.ts:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L43)

Parameters for the update mutation

#### Type Parameters

##### TData

`TData` = `Record`\<`string`, `unknown`\>

#### Properties

##### id

> **id**: `Identifier`

Defined in: [hooks/useUpdate.ts:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L44)

##### data

> **data**: `TData`

Defined in: [hooks/useUpdate.ts:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L45)

##### previousData?

> `optional` **previousData**: `TData`

Defined in: [hooks/useUpdate.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L46)

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useUpdate.ts:47](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L47)

***

### UseUpdateOptions

Defined in: [hooks/useUpdate.ts:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L53)

Options for useUpdate hook

#### Extends

- `Omit`\<`UseMutationOptions`\<`UpdateResult`\<`RecordType`\>, `Error`, \{ `resource`: `string`; `params`: [`UseUpdateMutateParams`](#useupdatemutateparams)\<`TVariables`\>; \}\>, `"mutationFn"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` *extends* `Partial`\<`RecordType`\> = `Partial`\<`RecordType`\>

***

### UseUpdateMutationState

Defined in: [hooks/useUpdate.ts:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L64)

Return type for useUpdate hook mutation state

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `UpdateResult`\<`RecordType`\> \| `undefined`

Defined in: [hooks/useUpdate.ts:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L65)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useUpdate.ts:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L66)

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useUpdate.ts:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L67)

##### isPending

> **isPending**: `boolean`

Defined in: [hooks/useUpdate.ts:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L68)

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [hooks/useUpdate.ts:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L69)

##### isError

> **isError**: `boolean`

Defined in: [hooks/useUpdate.ts:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L70)

##### isIdle

> **isIdle**: `boolean`

Defined in: [hooks/useUpdate.ts:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L71)

##### reset()

> **reset**: () => `void`

Defined in: [hooks/useUpdate.ts:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L72)

###### Returns

`void`

##### fieldErrors

> **fieldErrors**: `Record`\<`string`, `string`[]\> \| `null`

Defined in: [hooks/useUpdate.ts:74](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L74)

##### isServerValidationError

> **isServerValidationError**: `boolean`

Defined in: [hooks/useUpdate.ts:75](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L75)

##### isConflictError

> **isConflictError**: `boolean`

Defined in: [hooks/useUpdate.ts:76](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L76)

##### retryAfter

> **retryAfter**: `number` \| `undefined`

Defined in: [hooks/useUpdate.ts:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L77)

##### getFieldErrors()

> **getFieldErrors**: (`field`) => `string`[]

Defined in: [hooks/useUpdate.ts:78](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L78)

###### Parameters

###### field

`string`

###### Returns

`string`[]

##### hasFieldError()

> **hasFieldError**: (`field`) => `boolean`

Defined in: [hooks/useUpdate.ts:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L79)

###### Parameters

###### field

`string`

###### Returns

`boolean`

##### clearError()

> **clearError**: () => `void`

Defined in: [hooks/useUpdate.ts:80](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L80)

###### Returns

`void`

##### clearFieldError()

> **clearFieldError**: (`field`) => `void`

Defined in: [hooks/useUpdate.ts:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L81)

###### Parameters

###### field

`string`

###### Returns

`void`

##### lastSubmittedData

> **lastSubmittedData**: `unknown`

Defined in: [hooks/useUpdate.ts:82](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L82)

##### submissionCount

> **submissionCount**: `number`

Defined in: [hooks/useUpdate.ts:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L83)

##### retry

> **retry**: () => `Promise`\<`unknown`\> \| `undefined`

Defined in: [hooks/useUpdate.ts:84](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L84)

***

### UseUpdateManyMutateParams

Defined in: [hooks/useUpdateMany.ts:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L18)

Parameters for the updateMany mutation

#### Type Parameters

##### TData

`TData` = `Record`\<`string`, `unknown`\>

#### Properties

##### ids

> **ids**: `Identifier`[]

Defined in: [hooks/useUpdateMany.ts:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L19)

##### data

> **data**: `TData`

Defined in: [hooks/useUpdateMany.ts:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L20)

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [hooks/useUpdateMany.ts:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L21)

***

### UseUpdateManyOptions

Defined in: [hooks/useUpdateMany.ts:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L27)

Options for useUpdateMany hook

#### Extends

- `Omit`\<`UseMutationOptions`\<`UpdateManyResult`\<`RecordType`\>, `Error`, \{ `resource`: `string`; `params`: [`UseUpdateManyMutateParams`](#useupdatemanymutateparams)\<`TVariables`\>; \}\>, `"mutationFn"`\>

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` = `Record`\<`string`, `unknown`\>

***

### UseUpdateManyMutationState

Defined in: [hooks/useUpdateMany.ts:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L38)

Return type for useUpdateMany hook mutation state

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `UpdateManyResult`\<`RecordType`\> \| `undefined`

Defined in: [hooks/useUpdateMany.ts:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L39)

##### error

> **error**: `Error` \| `null`

Defined in: [hooks/useUpdateMany.ts:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L40)

##### isLoading

> **isLoading**: `boolean`

Defined in: [hooks/useUpdateMany.ts:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L41)

##### isPending

> **isPending**: `boolean`

Defined in: [hooks/useUpdateMany.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L42)

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [hooks/useUpdateMany.ts:43](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L43)

##### isError

> **isError**: `boolean`

Defined in: [hooks/useUpdateMany.ts:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L44)

##### isIdle

> **isIdle**: `boolean`

Defined in: [hooks/useUpdateMany.ts:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L45)

##### reset()

> **reset**: () => `void`

Defined in: [hooks/useUpdateMany.ts:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L46)

###### Returns

`void`

***

### MongoConfig

Defined in: [mongo/types.ts:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L15)

Configuration options for createMongoDataProvider

#### Properties

##### baseUrl

> **baseUrl**: `string`

Defined in: [mongo/types.ts:20](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L20)

Base URL for the mongo.do API endpoint

###### Example

```ts
'https://your-database.mongo.do'
```

##### database?

> `optional` **database**: `string`

Defined in: [mongo/types.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L26)

Optional database name (if not included in baseUrl)

###### Example

```ts
'my-database'
```

##### apiKey?

> `optional` **apiKey**: `string`

Defined in: [mongo/types.ts:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L31)

Optional API key for authentication

##### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [mongo/types.ts:36](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L36)

Optional custom headers to include with every request

##### credentials?

> `optional` **credentials**: `RequestCredentials`

Defined in: [mongo/types.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L42)

Optional request credentials mode

###### Default

```ts
'include'
```

##### timeout?

> `optional` **timeout**: `number`

Defined in: [mongo/types.ts:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L48)

Optional timeout in milliseconds

###### Default

```ts
30000
```

***

### MongoDataProviderOptions

Defined in: [mongo/types.ts:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L54)

Options for the DataProvider factory

#### Properties

##### resourceMapping?

> `optional` **resourceMapping**: `Record`\<`string`, `string`\>

Defined in: [mongo/types.ts:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L60)

Optional resource name mappings
Maps react-admin resource names to mongo.do collection names

###### Example

```ts
{ 'users': 'user-profiles', 'posts': 'blog-posts' }
```

##### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [mongo/types.ts:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L65)

Optional custom headers for data requests

##### defaultSortField?

> `optional` **defaultSortField**: `string`

Defined in: [mongo/types.ts:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L71)

Default sort field when none specified

###### Default

```ts
'_id'
```

##### defaultSortOrder?

> `optional` **defaultSortOrder**: `"ASC"` \| `"DESC"`

Defined in: [mongo/types.ts:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L77)

Default sort order when none specified

###### Default

```ts
'DESC'
```

***

### MongoListResponse

Defined in: [mongo/types.ts:83](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L83)

Standard response format from mongo.do API for list operations

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `T`[]

Defined in: [mongo/types.ts:84](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L84)

##### total

> **total**: `number`

Defined in: [mongo/types.ts:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L85)

##### pageInfo?

> `optional` **pageInfo**: `object`

Defined in: [mongo/types.ts:86](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L86)

###### hasNextPage

> **hasNextPage**: `boolean`

###### hasPreviousPage

> **hasPreviousPage**: `boolean`

###### startCursor?

> `optional` **startCursor**: `string`

###### endCursor?

> `optional` **endCursor**: `string`

***

### MongoRecordResponse

Defined in: [mongo/types.ts:97](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L97)

Standard response format from mongo.do API for single record operations

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `T`

Defined in: [mongo/types.ts:98](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L98)

***

### MongoBatchResponse

Defined in: [mongo/types.ts:104](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L104)

Standard response format from mongo.do API for batch operations

#### Properties

##### data

> **data**: `Identifier`[]

Defined in: [mongo/types.ts:105](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L105)

***

### MongoWriteResponse

Defined in: [mongo/types.ts:111](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L111)

Standard response format from mongo.do API for write operations

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### data

> **data**: `T`

Defined in: [mongo/types.ts:112](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L112)

##### acknowledged

> **acknowledged**: `boolean`

Defined in: [mongo/types.ts:113](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L113)

##### insertedId?

> `optional` **insertedId**: `Identifier`

Defined in: [mongo/types.ts:114](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L114)

##### modifiedCount?

> `optional` **modifiedCount**: `number`

Defined in: [mongo/types.ts:115](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L115)

##### deletedCount?

> `optional` **deletedCount**: `number`

Defined in: [mongo/types.ts:116](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L116)

***

### MongoErrorResponse

Defined in: [mongo/types.ts:122](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L122)

Error response from mongo.do API

#### Properties

##### error

> **error**: `object`

Defined in: [mongo/types.ts:123](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L123)

###### code

> **code**: `string`

###### message

> **message**: `string`

###### details?

> `optional` **details**: `Record`\<`string`, `unknown`\>

***

### MongoRequestOptions

Defined in: [mongo/types.ts:133](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L133)

Request options for fetch calls

#### Properties

##### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"`

Defined in: [mongo/types.ts:134](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L134)

##### body?

> `optional` **body**: `unknown`

Defined in: [mongo/types.ts:135](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L135)

##### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [mongo/types.ts:136](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L136)

##### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [mongo/types.ts:137](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L137)

***

### MongoFilterOperators

Defined in: [mongo/types.ts:144](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L144)

MongoDB-style filter operators mapping
Maps react-admin filter operators to MongoDB operators

#### Properties

##### \_gt

> **\_gt**: `"$gt"`

Defined in: [mongo/types.ts:146](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L146)

Greater than

##### \_gte

> **\_gte**: `"$gte"`

Defined in: [mongo/types.ts:148](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L148)

Greater than or equal

##### \_lt

> **\_lt**: `"$lt"`

Defined in: [mongo/types.ts:150](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L150)

Less than

##### \_lte

> **\_lte**: `"$lte"`

Defined in: [mongo/types.ts:152](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L152)

Less than or equal

##### \_ne

> **\_ne**: `"$ne"`

Defined in: [mongo/types.ts:154](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L154)

Not equal

##### \_eq

> **\_eq**: `"$eq"`

Defined in: [mongo/types.ts:156](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L156)

Equal (explicit)

##### \_in

> **\_in**: `"$in"`

Defined in: [mongo/types.ts:158](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L158)

In array

##### \_nin

> **\_nin**: `"$nin"`

Defined in: [mongo/types.ts:160](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L160)

Not in array

##### \_contains

> **\_contains**: `"$regex"`

Defined in: [mongo/types.ts:162](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L162)

Contains substring (regex-based)

##### \_exists

> **\_exists**: `"$exists"`

Defined in: [mongo/types.ts:164](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/mongo/types.ts#L164)

Exists check

***

### AdminPlugin

Defined in: [types/admin.ts:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L13)

Plugin interface for extending Admin functionality

#### Properties

##### name

> **name**: `string`

Defined in: [types/admin.ts:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L14)

##### install()

> **install**: (`context`) => `void` \| () => `void`

Defined in: [types/admin.ts:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L15)

###### Parameters

###### context

[`AdminPluginContext`](#adminplugincontext)

###### Returns

`void` \| () => `void`

***

### AdminPluginContext

Defined in: [types/admin.ts:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L21)

Context passed to plugin install function

#### Properties

##### dataProvider

> **dataProvider**: `DataProvider`

Defined in: [types/admin.ts:22](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L22)

##### addResource()

> **addResource**: (`resource`) => `void`

Defined in: [types/admin.ts:23](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L23)

###### Parameters

###### resource

###### name

`string`

###### list?

`ComponentType`

###### edit?

`ComponentType`

###### create?

`ComponentType`

###### show?

`ComponentType`

###### Returns

`void`

##### addMenuItem()

> **addMenuItem**: (`item`) => `void`

Defined in: [types/admin.ts:24](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L24)

###### Parameters

###### item

###### name

`string`

###### path

`string`

###### icon?

`ReactNode`

###### Returns

`void`

##### wrapDataProvider()

> **wrapDataProvider**: (`wrapper`) => `void`

Defined in: [types/admin.ts:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L25)

###### Parameters

###### wrapper

(`dp`) => `DataProvider`

###### Returns

`void`

##### onUnmount()

> **onUnmount**: (`cleanup`) => `void`

Defined in: [types/admin.ts:26](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L26)

###### Parameters

###### cleanup

() => `void`

###### Returns

`void`

***

### ThemeOptions

Defined in: [types/admin.ts:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L29)

#### Indexable

\[`key`: `string`\]: `unknown`

#### Properties

##### palette?

> `optional` **palette**: `Record`\<`string`, `unknown`\>

Defined in: [types/admin.ts:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L30)

##### typography?

> `optional` **typography**: `Record`\<`string`, `unknown`\>

Defined in: [types/admin.ts:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L31)

***

### AdminLayoutProps

Defined in: [types/admin.ts:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L39)

Simplified layout props interface for Admin component
The full LayoutProps is exported from components/layout/Layout.tsx

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [types/admin.ts:40](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L40)

##### dashboard?

> `optional` **dashboard**: `ComponentType`

Defined in: [types/admin.ts:41](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L41)

##### menu?

> `optional` **menu**: `ComponentType`

Defined in: [types/admin.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L42)

***

### AdminProps

Defined in: [types/admin.ts:48](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L48)

Admin component props

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [types/admin.ts:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L50)

Child Resource components

##### dataProvider?

> `optional` **dataProvider**: `DataProvider`

Defined in: [types/admin.ts:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L52)

DataProvider for API calls

##### authProvider?

> `optional` **authProvider**: `AuthProvider`

Defined in: [types/admin.ts:54](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L54)

AuthProvider for authentication (optional)

##### i18nProvider?

> `optional` **i18nProvider**: `I18nProvider`

Defined in: [types/admin.ts:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L56)

I18nProvider for internationalization (optional)

##### queryClient?

> `optional` **queryClient**: `QueryClient`

Defined in: [types/admin.ts:58](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L58)

Custom QueryClient instance (optional)

##### title?

> `optional` **title**: `string`

Defined in: [types/admin.ts:60](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L60)

Application title (optional)

##### layout?

> `optional` **layout**: `ReactElement`\<`unknown`, string \| JSXElementConstructor\<any\>\> \| `ComponentType`\<\{ `children`: `ReactNode`; \}\>

Defined in: [types/admin.ts:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L62)

Custom layout component (optional)

##### dashboard?

> `optional` **dashboard**: `ComponentType`

Defined in: [types/admin.ts:64](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L64)

Dashboard component (optional)

##### theme?

> `optional` **theme**: [`ThemeOptions`](#themeoptions)

Defined in: [types/admin.ts:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L66)

Light theme options (optional)

##### darkTheme?

> `optional` **darkTheme**: [`ThemeOptions`](#themeoptions)

Defined in: [types/admin.ts:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L68)

Dark theme options (optional)

##### basename?

> `optional` **basename**: `string`

Defined in: [types/admin.ts:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L70)

Base path for routing (optional)

##### error?

> `optional` **error**: `ComponentType`\<`ErrorProps`\>

Defined in: [types/admin.ts:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L72)

Error page component (optional)

##### plugins?

> `optional` **plugins**: [`AdminPlugin`](#adminplugin)[]

Defined in: [types/admin.ts:74](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/admin.ts#L74)

Plugins to extend Admin functionality

***

### BaseProps

Defined in: [types/common.ts:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L68)

Base props for all components

#### Properties

##### className?

> `optional` **className**: `string`

Defined in: [types/common.ts:70](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L70)

Additional CSS class names

##### id?

> `optional` **id**: `string`

Defined in: [types/common.ts:72](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L72)

Component ID

***

### WithChildren

Defined in: [types/common.ts:78](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L78)

Props for components that accept children

#### Properties

##### children?

> `optional` **children**: `ReactNode`

Defined in: [types/common.ts:79](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L79)

***

### WithClassName

Defined in: [types/common.ts:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L85)

Props for components that accept className

#### Properties

##### className?

> `optional` **className**: `string`

Defined in: [types/common.ts:86](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L86)

***

### AsChildProps

Defined in: [types/common.ts:92](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L92)

Props for components that support asChild pattern

#### Properties

##### asChild?

> `optional` **asChild**: `boolean`

Defined in: [types/common.ts:94](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L94)

Render as child element instead of default element

***

### SortPayload

Defined in: [types/data-provider.ts:27](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/data-provider.ts#L27)

Sort payload for list queries.
The field is a string that can be a dot-notation path to a nested property.

#### Example

```tsx
const sort: SortPayload = { field: 'name', order: 'ASC' }
const nestedSort: SortPayload = { field: 'author.name', order: 'DESC' }
```

#### Type Parameters

##### _T

`_T` *extends* `RaRecord` = `RaRecord`

#### Properties

##### field

> **field**: `string`

Defined in: [types/data-provider.ts:28](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/data-provider.ts#L28)

##### order

> **order**: [`SortOrder`](#sortorder)

Defined in: [types/data-provider.ts:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/data-provider.ts#L29)

***

### ParsedFilter

Defined in: [utils/filterOperators.ts:37](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L37)

Parsed filter with field and operator

#### Properties

##### field

> **field**: `string`

Defined in: [utils/filterOperators.ts:38](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L38)

##### operator

> **operator**: `"eq"` \| `"neq"` \| `"gt"` \| `"gte"` \| `"lt"` \| `"lte"` \| `"contains"` \| `"startsWith"` \| `"endsWith"` \| `"in"` \| `"notIn"` \| `"between"` \| `"isNull"` \| `"isNotNull"`

Defined in: [utils/filterOperators.ts:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L39)

***

### HttpErrorShape

Defined in: [utils/type-guards.ts:65](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L65)

Shape of an error with HTTP status

#### Properties

##### status

> **status**: `number`

Defined in: [utils/type-guards.ts:66](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L66)

##### message?

> `optional` **message**: `string`

Defined in: [utils/type-guards.ts:67](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L67)

##### body?

> `optional` **body**: `unknown`

Defined in: [utils/type-guards.ts:68](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L68)

***

### CodedErrorShape

Defined in: [utils/type-guards.ts:99](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L99)

Shape of an error with code property

#### Properties

##### code

> **code**: `string`

Defined in: [utils/type-guards.ts:100](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L100)

##### message?

> `optional` **message**: `string`

Defined in: [utils/type-guards.ts:101](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L101)

***

### ListResponseShape

Defined in: [utils/type-guards.ts:211](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L211)

Shape of a list response

#### Type Parameters

##### T

`T` = `RaRecord`

#### Properties

##### data

> **data**: `T`[]

Defined in: [utils/type-guards.ts:212](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L212)

##### total?

> `optional` **total**: `number`

Defined in: [utils/type-guards.ts:213](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L213)

***

### RecordResponseShape

Defined in: [utils/type-guards.ts:229](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L229)

Shape of a single record response

#### Type Parameters

##### T

`T` = `RaRecord`

#### Properties

##### data

> **data**: `T`

Defined in: [utils/type-guards.ts:230](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L230)

## References

### UseTranslateFunction

Renames and re-exports [TranslateFunction](#translatefunction)

***

### UseTranslateOptions

Renames and re-exports [TranslateOptions](#translateoptions)

## Type Aliases

### SelectFieldChoice

> **SelectFieldChoice**\<`T`\> = [`SelectChoice`](#selectchoice)\<`T`\>

Defined in: [components/field/SelectField.tsx:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/field/SelectField.tsx#L12)

Choice type for SelectField options.
Uses the shared SelectChoice type for consistency.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

***

### ReferenceChoice

> **ReferenceChoice**\<`T`\> = [`SelectChoice`](#selectchoice)\<`T`\>

Defined in: [components/input/ReferenceInput.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ReferenceInput.tsx#L18)

Choice record type for reference inputs.
Uses the shared SelectChoice type for consistency.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

***

### ChoiceValue

> **ChoiceValue** = `string` \| `number`

Defined in: [components/input/types.ts:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L12)

Valid types for choice value fields (id, value, etc.)
Most choice values are strings, but numeric IDs are also common.

***

### BaseSelectChoice

> **BaseSelectChoice** = [`IdNameChoice`](#idnamechoice) \| [`ValueLabelChoice`](#valuelabelchoice)

Defined in: [components/input/types.ts:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L63)

Base choice interface that accepts either id/name or value/label patterns.
Use this for components that need to support both patterns.

#### Example

```tsx
// Both patterns are valid:
const choices: BaseSelectChoice[] = [
  { id: '1', name: 'Option 1' },
  { value: '2', label: 'Option 2' },
]
```

***

### SelectChoice

> **SelectChoice**\<`T`\> = `T`

Defined in: [components/input/types.ts:93](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L93)

Choice interface with generic type parameter for full type safety.

The generic parameter T allows you to specify the exact shape of your choice objects,
providing full type safety when accessing properties like id, name, value, label, etc.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

The shape of the choice object. Defaults to a flexible record type
              that allows any string key for backwards compatibility.

#### Example

```tsx
// Basic usage with default id/name fields
type StatusChoice = SelectChoice<{ id: string; name: string }>
const choices: StatusChoice[] = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
]

// With numeric ids
type UserChoice = SelectChoice<{ id: number; name: string }>

// With custom value/label fields
type CountryChoice = SelectChoice<{ value: string; label: string; flag: string }>

// Backwards compatible - loose typing when generic is omitted
const flexibleChoices: SelectChoice[] = [{ id: 1, name: 'One', extra: 'data' }]
```

***

### ExtractChoiceValue

> **ExtractChoiceValue**\<`T`, `K`\> = `K` *extends* keyof `T` ? `T`\[`K`\] : `unknown`

Defined in: [components/input/types.ts:107](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L107)

Helper type to extract the value type from a choice based on the optionValue field

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

The choice type

##### K

`K` *extends* keyof `T` = `"id"` *extends* keyof `T` ? `"id"` : `never`

The key to use for the value (defaults to 'id')

#### Example

```tsx
type Choice = { id: number; name: string }
type IdType = ExtractChoiceValue<Choice, 'id'> // number
```

***

### ExtractChoiceText

> **ExtractChoiceText**\<`T`, `K`\> = `K` *extends* keyof `T` ? `T`\[`K`\] : `unknown`

Defined in: [components/input/types.ts:124](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L124)

Helper type to extract the text type from a choice based on the optionText field

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

The choice type

##### K

`K` *extends* keyof `T` = `"name"` *extends* keyof `T` ? `"name"` : `never`

The key to use for the text (defaults to 'name')

#### Example

```tsx
type Choice = { id: number; name: string }
type NameType = ExtractChoiceText<Choice, 'name'> // string
```

***

### AutocompleteChoice

> **AutocompleteChoice**\<`T`\> = [`SelectChoice`](#selectchoice)\<`T`\>

Defined in: [components/input/types.ts:135](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L135)

Choice type for AutocompleteInput - alias for SelectChoice

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

***

### RadioChoice

> **RadioChoice**\<`T`\> = [`SelectChoice`](#selectchoice)\<`T`\>

Defined in: [components/input/types.ts:138](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L138)

Choice type for RadioButtonGroupInput - alias for SelectChoice

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

***

### SelectArrayChoice

> **SelectArrayChoice**\<`T`\> = [`SelectChoice`](#selectchoice)\<`T`\>

Defined in: [components/input/types.ts:141](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L141)

Choice type for SelectArrayInput - alias for SelectChoice

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

***

### CheckboxChoice

> **CheckboxChoice**\<`T`\> = [`SelectChoice`](#selectchoice)\<`T`\>

Defined in: [components/input/types.ts:144](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L144)

Choice type for CheckboxGroupInput - alias for SelectChoice

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

***

### AutocompleteArrayChoice

> **AutocompleteArrayChoice**\<`T`\> = [`SelectChoice`](#selectchoice)\<`T`\>

Defined in: [components/input/types.ts:147](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L147)

Choice type for AutocompleteArrayInput - alias for SelectChoice

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

***

### OptionTextProp

> **OptionTextProp**\<`T`\> = keyof `T` & `string` \| (`choice`) => `string` \| `React.ReactElement`

Defined in: [components/input/types.ts:157](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L157)

Type for optionText prop that can be a string key, function, or React element

The function form uses a permissive `any` parameter to allow strongly-typed
callbacks like `(choice: MyType) => string` to be passed without type errors.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

The choice type (used only for string key inference)

***

### OptionValueProp

> **OptionValueProp**\<`T`\> = keyof `T` & `string`

Defined in: [components/input/types.ts:168](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/types.ts#L168)

Type for optionValue prop - must be a valid key of the choice type

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

The choice type

***

### RowClickHandler

> **RowClickHandler**\<`T`\> = `"edit"` \| `"show"` \| `false` \| (`record`, `id`, `event`) => `void` \| `string`

Defined in: [components/list/Datagrid.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Datagrid.tsx#L62)

Row click handler type

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

***

### BadgeVariant

> **BadgeVariant** = `"default"` \| `"secondary"` \| `"destructive"` \| `"outline"`

Defined in: [components/menu/MenuItem.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L25)

Badge variant type

***

### MutationMode

> **MutationMode** = `"pessimistic"` \| `"optimistic"` \| `"undoable"`

Defined in: [contexts/FormContext.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L16)

Mutation mode for form operations
- pessimistic: Wait for server response before updating UI
- optimistic: Update UI immediately, rollback on error
- undoable: Update UI immediately with undo option

***

### ShadminFormContext

> **ShadminFormContext**\<`T`\> = `UseFormReturn`\<`T`\> & [`ShadminFormContextValue`](#shadminformcontextvalue)\<`T`\>

Defined in: [contexts/FormContext.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L39)

Combined form context type (react-hook-form + shadmin extensions)

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

***

### FormContextProviderProps

> **FormContextProviderProps**\<`T`\> = [`ShadminFormContext`](#shadminformcontext)\<`T`\> & `object`

Defined in: [contexts/FormContext.tsx:56](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L56)

Props for FormContextProvider

#### Type Declaration

##### children?

> `optional` **children**: `ReactNode`

#### Type Parameters

##### T

`T` *extends* `FieldValues` = `FieldValues`

***

### NotifyFunction()

> **NotifyFunction** = (`message`, `options?`) => `void`

Defined in: [contexts/NotificationContext.tsx:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L63)

Notify function signature (matches react-admin)

#### Parameters

##### message

`string`

##### options?

[`NotificationOptions`](#notificationoptions)

#### Returns

`void`

***

### Theme

> **Theme** = `"light"` \| `"dark"` \| `"system"`

Defined in: [contexts/ThemeContext.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L16)

***

### TranslateFunction()

> **TranslateFunction** = (`key`, `options?`) => `string`

Defined in: [contexts/TranslationContext.tsx:30](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L30)

Translate function signature - matches react-admin

#### Parameters

##### key

`string`

##### options?

[`TranslateOptions`](#translateoptions)

#### Returns

`string`

***

### TranslationMessages

> **TranslationMessages** = `object`

Defined in: [contexts/TranslationContext.tsx:39](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L39)

Translation messages structure
Supports nested keys via dot notation or nested objects

#### Index Signature

\[`key`: `string`\]: `string` \| [`TranslationMessages`](#translationmessages)

***

### DOWithResources

> **DOWithResources**\<`_Resources`\> = [`DOResult`](#doresult)

Defined in: [dotdo/do.ts:140](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/dotdo/do.ts#L140)

Type helper for creating typed resource configurations

#### Type Parameters

##### _Resources

`_Resources` *extends* `Record`\<`string`, `unknown`\>

#### Example

```tsx
type MyResources = {
  users: { id: string; email: string; name: string }
  posts: { id: string; title: string; content: string; authorId: string }
}

const { DB } = DO<MyResources>('https://api.your-app.do')
```

***

### NotificationType

> **NotificationType** = `"success"` \| `"error"` \| `"warning"` \| `"info"`

Defined in: [facade/core-types.ts:97](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/facade/core-types.ts#L97)

Notification type enum

***

### CreateFunction()

> **CreateFunction**\<`RecordType`, `TVariables`\> = \{(`resource`, `params`): `Promise`\<`CreateResult`\<`RecordType`\>\>; (`params`): `Promise`\<`CreateResult`\<`RecordType`\>\>; \}

Defined in: [hooks/useCreate.ts:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L71)

Create function signature when resource is not pre-configured

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` = `Record`\<`string`, `unknown`\>

#### Call Signature

> (`resource`, `params`): `Promise`\<`CreateResult`\<`RecordType`\>\>

##### Parameters

###### resource

`string`

###### params

[`UseCreateMutateParams`](#usecreatemutateparams)\<`TVariables`\>

##### Returns

`Promise`\<`CreateResult`\<`RecordType`\>\>

#### Call Signature

> (`params`): `Promise`\<`CreateResult`\<`RecordType`\>\>

##### Parameters

###### params

[`UseCreateMutateParams`](#usecreatemutateparams)\<`TVariables`\>

##### Returns

`Promise`\<`CreateResult`\<`RecordType`\>\>

***

### UseCreateResult

> **UseCreateResult**\<`RecordType`, `TVariables`\> = \[[`CreateFunction`](#createfunction)\<`RecordType`, `TVariables`\>, [`UseCreateMutationState`](#usecreatemutationstate)\<`RecordType`\>\]

Defined in: [hooks/useCreate.ts:82](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreate.ts#L82)

Return type for useCreate hook - tuple of [create function, mutation state]

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` = `Record`\<`string`, `unknown`\>

***

### DeleteFunction()

> **DeleteFunction**\<`RecordType`\> = \{(`resource`, `params`): `Promise`\<`DeleteResult`\<`RecordType`\>\>; (`params`): `Promise`\<`DeleteResult`\<`RecordType`\>\>; \}

Defined in: [hooks/useDelete.ts:77](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L77)

Delete function signature

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Call Signature

> (`resource`, `params`): `Promise`\<`DeleteResult`\<`RecordType`\>\>

##### Parameters

###### resource

`string`

###### params

[`UseDeleteMutateParams`](#usedeletemutateparams)\<`RecordType`\>

##### Returns

`Promise`\<`DeleteResult`\<`RecordType`\>\>

#### Call Signature

> (`params`): `Promise`\<`DeleteResult`\<`RecordType`\>\>

##### Parameters

###### params

[`UseDeleteMutateParams`](#usedeletemutateparams)\<`RecordType`\>

##### Returns

`Promise`\<`DeleteResult`\<`RecordType`\>\>

***

### UseDeleteResult

> **UseDeleteResult**\<`RecordType`\> = \[[`DeleteFunction`](#deletefunction)\<`RecordType`\>, [`UseDeleteMutationState`](#usedeletemutationstate)\<`RecordType`\>\]

Defined in: [hooks/useDelete.ts:85](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDelete.ts#L85)

Return type for useDelete hook - tuple of [delete function, mutation state]

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

***

### DeleteManyFunction()

> **DeleteManyFunction**\<`RecordType`\> = \{(`resource`, `params`): `Promise`\<`DeleteManyResult`\<`RecordType`\>\>; (`params`): `Promise`\<`DeleteManyResult`\<`RecordType`\>\>; \}

Defined in: [hooks/useDeleteMany.ts:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L49)

DeleteMany function signature

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Call Signature

> (`resource`, `params`): `Promise`\<`DeleteManyResult`\<`RecordType`\>\>

##### Parameters

###### resource

`string`

###### params

[`UseDeleteManyMutateParams`](#usedeletemanymutateparams)

##### Returns

`Promise`\<`DeleteManyResult`\<`RecordType`\>\>

#### Call Signature

> (`params`): `Promise`\<`DeleteManyResult`\<`RecordType`\>\>

##### Parameters

###### params

[`UseDeleteManyMutateParams`](#usedeletemanymutateparams)

##### Returns

`Promise`\<`DeleteManyResult`\<`RecordType`\>\>

***

### UseDeleteManyResult

> **UseDeleteManyResult**\<`RecordType`\> = \[[`DeleteManyFunction`](#deletemanyfunction)\<`RecordType`\>, [`UseDeleteManyMutationState`](#usedeletemanymutationstate)\<`RecordType`\>\]

Defined in: [hooks/useDeleteMany.ts:57](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useDeleteMany.ts#L57)

Return type for useDeleteMany hook

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

***

### RedirectTo

> **RedirectTo** = `"list"` \| `"show"` \| `"edit"` \| `"create"` \| `false` \| `string`

Defined in: [hooks/useRedirect.ts:14](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRedirect.ts#L14)

Redirect target types matching react-admin

***

### RedirectFunction()

> **RedirectFunction** = (`redirectTo`, `resource?`, `id?`, `options?`) => `void`

Defined in: [hooks/useRedirect.ts:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRedirect.ts#L31)

Redirect function signature

#### Parameters

##### redirectTo

[`RedirectTo`](#redirectto-4)

##### resource?

`string`

##### id?

`Identifier`

##### options?

[`RedirectOptions`](#redirectoptions)

#### Returns

`void`

***

### RefreshFunction()

> **RefreshFunction** = (`resource?`, `options?`) => `void`

Defined in: [hooks/useRefresh.ts:21](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useRefresh.ts#L21)

Refresh function signature

#### Parameters

##### resource?

`string`

##### options?

[`RefreshOptions`](#refreshoptions)

#### Returns

`void`

***

### SetLocale()

> **SetLocale** = (`locale`) => `void`

Defined in: [hooks/useSetLocale.ts:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useSetLocale.ts#L12)

#### Parameters

##### locale

`string`

#### Returns

`void`

***

### UpdateFunction()

> **UpdateFunction**\<`RecordType`, `TVariables`\> = \{(`resource`, `params`): `Promise`\<`UpdateResult`\<`RecordType`\>\>; (`params`): `Promise`\<`UpdateResult`\<`RecordType`\>\>; \}

Defined in: [hooks/useUpdate.ts:90](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L90)

Update function signature

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` *extends* `Partial`\<`RecordType`\> = `Partial`\<`RecordType`\>

#### Call Signature

> (`resource`, `params`): `Promise`\<`UpdateResult`\<`RecordType`\>\>

##### Parameters

###### resource

`string`

###### params

[`UseUpdateMutateParams`](#useupdatemutateparams)\<`TVariables`\>

##### Returns

`Promise`\<`UpdateResult`\<`RecordType`\>\>

#### Call Signature

> (`params`): `Promise`\<`UpdateResult`\<`RecordType`\>\>

##### Parameters

###### params

[`UseUpdateMutateParams`](#useupdatemutateparams)\<`TVariables`\>

##### Returns

`Promise`\<`UpdateResult`\<`RecordType`\>\>

***

### UseUpdateResult

> **UseUpdateResult**\<`RecordType`, `TVariables`\> = \[[`UpdateFunction`](#updatefunction)\<`RecordType`, `TVariables`\>, [`UseUpdateMutationState`](#useupdatemutationstate)\<`RecordType`\>\]

Defined in: [hooks/useUpdate.ts:101](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdate.ts#L101)

Return type for useUpdate hook - tuple of [update function, mutation state]

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` *extends* `Partial`\<`RecordType`\> = `Partial`\<`RecordType`\>

***

### UpdateManyFunction()

> **UpdateManyFunction**\<`RecordType`, `TVariables`\> = \{(`resource`, `params`): `Promise`\<`UpdateManyResult`\<`RecordType`\>\>; (`params`): `Promise`\<`UpdateManyResult`\<`RecordType`\>\>; \}

Defined in: [hooks/useUpdateMany.ts:52](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L52)

UpdateMany function signature

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` = `Record`\<`string`, `unknown`\>

#### Call Signature

> (`resource`, `params`): `Promise`\<`UpdateManyResult`\<`RecordType`\>\>

##### Parameters

###### resource

`string`

###### params

[`UseUpdateManyMutateParams`](#useupdatemanymutateparams)\<`TVariables`\>

##### Returns

`Promise`\<`UpdateManyResult`\<`RecordType`\>\>

#### Call Signature

> (`params`): `Promise`\<`UpdateManyResult`\<`RecordType`\>\>

##### Parameters

###### params

[`UseUpdateManyMutateParams`](#useupdatemanymutateparams)\<`TVariables`\>

##### Returns

`Promise`\<`UpdateManyResult`\<`RecordType`\>\>

***

### UseUpdateManyResult

> **UseUpdateManyResult**\<`RecordType`, `TVariables`\> = \[[`UpdateManyFunction`](#updatemanyfunction)\<`RecordType`, `TVariables`\>, [`UseUpdateManyMutationState`](#useupdatemanymutationstate)\<`RecordType`\>\]

Defined in: [hooks/useUpdateMany.ts:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useUpdateMany.ts#L63)

Return type for useUpdateMany hook

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

##### TVariables

`TVariables` = `Record`\<`string`, `unknown`\>

***

### Path

> **Path**\<`T`, `Depth`\> = `Depth` *extends* `0` ? `never` : `T` *extends* `object` ? \{ \[K in keyof T & string\]: T\[K\] extends object ? K \| \`$\{K\}.$\{Path\<T\[K\], Prev\[Depth\]\>\}\` : K \}\[keyof `T` & `string`\] : `never`

Defined in: [types/common.ts:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L18)

Path type for deep object property access using dot notation.
Provides type-safe access to nested properties in record types.

#### Type Parameters

##### T

`T`

##### Depth

`Depth` *extends* `number` = `4`

#### Example

```tsx
type User = { id: number; profile: { name: string; address: { city: string } } }
type UserPaths = Path<User> // "id" | "profile" | "profile.name" | "profile.address" | "profile.address.city"

// Usage in component props
interface FieldProps<T extends RaRecord> {
  source: Path<T>
}
```

***

### PathValue

> **PathValue**\<`T`, `P`\> = `P` *extends* `` `${infer K}.${infer Rest}` `` ? `K` *extends* keyof `T` ? `Rest` *extends* [`Path`](#path-5)\<`T`\[`K`\]\> ? [`PathValue`](#pathvalue)\<`T`\[`K`\], `Rest`\> : `never` : `never` : `P` *extends* keyof `T` ? `T`\[`P`\] : `never`

Defined in: [types/common.ts:42](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L42)

Get the type of a nested property using dot notation path.

#### Type Parameters

##### T

`T`

##### P

`P` *extends* [`Path`](#path-5)\<`T`\>

#### Example

```tsx
type User = { profile: { name: string } }
type Name = PathValue<User, "profile.name"> // string
```

***

### LoosePath

> **LoosePath**\<`T`\> = [`Path`](#path-5)\<`T`\> \| `string` & `object`

Defined in: [types/common.ts:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L63)

Loose path type that allows any string but provides autocomplete suggestions.
Use this when strict path validation would break backwards compatibility.

#### Type Parameters

##### T

`T`

#### Example

```tsx
interface FieldProps<T extends RaRecord = RaRecord> {
  source: LoosePath<T>  // Suggests known paths but allows any string
}
```

***

### ComponentProps

> **ComponentProps**\<`T`, `P`\> = `P` & `Omit`\<`HTMLAttributes`\<`HTMLElementTagNameMap`\[`T`\]\>, keyof `P`\>

Defined in: [types/common.ts:100](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/common.ts#L100)

Merge component props with HTML element props

#### Type Parameters

##### T

`T` *extends* keyof `JSX.IntrinsicElements` & keyof `HTMLElementTagNameMap`

##### P

`P` = `object`

***

### SortOrder

> **SortOrder** = `"ASC"` \| `"DESC"`

Defined in: [types/data-provider.ts:15](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/data-provider.ts#L15)

Sort order type - ascending or descending

***

### FilterOperator

> **FilterOperator** = `""` \| `"_gt"` \| `"_gte"` \| `"_lt"` \| `"_lte"` \| `"_ne"` \| `"_eq"` \| `"_in"` \| `"_nin"` \| `"_contains"` \| `"_icontains"` \| `"_startswith"` \| `"_endswith"` \| `"_isnull"` \| `"_like"` \| `"_ilike"` \| `"_regex"` \| `"_exists"` \| `"_between"` \| `"_not"`

Defined in: [types/data-provider.ts:50](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/data-provider.ts#L50)

Filter operators that can be appended to field names.
These are common operators used by data providers for server-side filtering.

#### Example

```tsx
// Using operators with field names:
{ age_gt: 18, name_contains: 'john', status_in: ['active', 'pending'] }
```

***

### FilterKeys

> **FilterKeys**\<`T`\> = `FilterableKeys`\<`T`\> \| `` `${FilterableKeys<T>}${Exclude<FilterOperator, "">}` `` \| `"id"` \| `` `id${Exclude<FilterOperator, "">}` `` \| `"q"` \| `` `${string}.${string}` ``

Defined in: [types/data-provider.ts:93](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/data-provider.ts#L93)

Generate filter keys for a record type by combining field names with operators.
This creates all valid filter key combinations for type-safe filtering.

#### Type Parameters

##### T

`T` *extends* `RaRecord`

The record type to generate filter keys for

#### Example

```tsx
interface User extends RaRecord {
  name: string
  age: number
}
// FilterKeys<User> includes: 'name', 'name_contains', 'age', 'age_gt', 'age_lte', etc.
```

***

### TypedFilterPayload

> **TypedFilterPayload**\<`T`\> = `{ [K in FilterKeys<T>]?: unknown }`

Defined in: [types/data-provider.ts:123](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/data-provider.ts#L123)

Typed filter payload for a specific record type.
Provides type-safe filter keys based on the record's fields.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

The record type this filter applies to

#### Example

```tsx
interface User extends RaRecord {
  name: string
  age: number
  active: boolean
}

// Type-safe filter creation:
const filter: TypedFilterPayload<User> = {
  name_contains: 'john',
  age_gte: 18,
  active: true
}
```

***

### FilterPayload

> **FilterPayload**\<`T`\> = `T` *extends* `object` ? \[keyof `Omit`\<`T`, `"id"`\>\] *extends* \[`never`\] ? `Record`\<`string`, `unknown`\> : [`TypedFilterPayload`](#typedfilterpayload)\<`T`\> & `Record`\<`string`, `unknown`\> : `Record`\<`string`, `unknown`\>

Defined in: [types/data-provider.ts:149](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/types/data-provider.ts#L149)

Filter payload for list queries.
Keys can be field names or field names with operator suffixes (e.g., 'age_gt', 'name_contains').

When used with a generic type parameter, provides type-safe filter key suggestions.
Without a type parameter (or with RaRecord), allows any string keys for maximum flexibility.

#### Type Parameters

##### T

`T` *extends* `RaRecord` = `RaRecord`

The record type for type-safe filter keys. Defaults to RaRecord for backward compatibility.

#### Example

```tsx
// Untyped usage (backward compatible):
const filter: FilterPayload = { status: 'active', age_gt: 18 }

// Typed usage (with specific record type):
interface User extends RaRecord {
  name: string
  age: number
}
const typedFilter: FilterPayload<User> = { name_contains: 'john', age_gte: 18 }
```

***

### OperatorType

> **OperatorType** = `"text"` \| `"number"` \| `"date"` \| `"boolean"` \| `"select"`

Defined in: [utils/filterOperators.ts:392](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L392)

Operator type presets for different input types

***

### FieldErrors

> **FieldErrors** = `Record`\<`string`, `string`[]\>

Defined in: [utils/type-guards.ts:128](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/type-guards.ts#L128)

Shape of field errors in API responses

## Variables

### Button

> `const` **Button**: `ForwardRefExoticComponent`\<[`ButtonProps`](#buttonprops) & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [components/Button.tsx:44](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/Button.tsx#L44)

Button component with multiple variants and sizes.

#### Example

```tsx
<Button variant="default" size="lg">
  Click me
</Button>
```

***

### BulkDeleteButton

> `const` **BulkDeleteButton**: `ForwardRefExoticComponent`\<[`BulkDeleteButtonProps`](#bulkdeletebuttonprops) & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [components/buttons/BulkDeleteButton.tsx:109](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteButton.tsx#L109)

Deletes the selected rows.

To be used inside the <Datagrid bulkActionButtons> prop.

#### Example

```ts
// basic usage
import { BulkDeleteButton, BulkExportButton, List, Datagrid } from 'shadmin';

const PostBulkActionButtons = () => (
    <>
        <BulkExportButton />
        <BulkDeleteButton />
    </>
);

export const PostList = () => (
    <List>
       <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
            ...
      </Datagrid>
    </List>
);
```

***

### BulkDeleteWithConfirmButton

> `const` **BulkDeleteWithConfirmButton**: `ForwardRefExoticComponent`\<[`BulkDeleteWithConfirmButtonProps`](#bulkdeletewithconfirmbuttonprops) & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [components/buttons/BulkDeleteWithConfirmButton.tsx:115](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkDeleteWithConfirmButton.tsx#L115)

Deletes the selected rows with a confirmation dialog.

To be used inside the <Datagrid bulkActionButtons> prop.

#### Example

```ts
// basic usage
import { BulkDeleteWithConfirmButton, List, Datagrid } from 'shadmin';

const PostBulkActionButtons = () => (
    <BulkDeleteWithConfirmButton />
);

export const PostList = () => (
    <List>
       <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
            ...
      </Datagrid>
    </List>
);
```

***

### BulkExportButton

> `const` **BulkExportButton**: `ForwardRefExoticComponent`\<[`BulkExportButtonProps`](#bulkexportbuttonprops) & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [components/buttons/BulkExportButton.tsx:97](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/BulkExportButton.tsx#L97)

Exports the selected rows.

To be used inside the <Datagrid bulkActionButtons> prop.

#### Example

```ts
// basic usage
import { BulkDeleteButton, BulkExportButton, List, Datagrid } from 'shadmin';

const PostBulkActionButtons = () => (
    <>
        <BulkExportButton />
        <BulkDeleteButton />
    </>
);

export const PostList = () => (
    <List>
       <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
            ...
      </Datagrid>
    </List>
);
```

***

### CloneButton()

> `const` **CloneButton**: \<`RecordType`\>(`props`) => `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Defined in: [components/buttons/CloneButton.tsx:99](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CloneButton.tsx#L99)

Opens the Create view with the current record data pre-filled.

Reads the record and resource from the context.

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### props

[`CloneButtonProps`](#clonebuttonprops)\<`RecordType`\> & `object`

#### Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

#### Example

```ts
// basic usage
import { CloneButton } from 'shadmin';

const PostCloneButton = () => (
    <CloneButton label="Duplicate" />
);
```

***

### CreateButton

> `const` **CreateButton**: `ForwardRefExoticComponent`\<[`CreateButtonProps`](#createbuttonprops) & `RefAttributes`\<`HTMLAnchorElement`\>\>

Defined in: [components/buttons/CreateButton.tsx:89](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/CreateButton.tsx#L89)

Opens the Create view for the current resource.

Reads the resource from the context if not provided.

#### Examples

```ts
// basic usage
import { CreateButton } from 'shadmin';

const PostActions = () => (
    <CreateButton />
);
```

```ts
// with custom label
<CreateButton label="Add Post" resource="posts" />
```

***

### DeleteWithConfirmButton()

> `const` **DeleteWithConfirmButton**: \<`RecordType`\>(`props`) => `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Defined in: [components/buttons/DeleteWithConfirmButton.tsx:123](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/DeleteWithConfirmButton.tsx#L123)

Deletes the current record with a confirmation dialog.

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### props

[`DeleteWithConfirmButtonProps`](#deletewithconfirmbuttonprops)\<`RecordType`\> & `object`

#### Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

#### Example

```ts
// basic usage
import { DeleteWithConfirmButton } from 'shadmin';

const PostActions = ({ record }) => (
    <DeleteWithConfirmButton record={record} />
);
```

***

### EditButton()

> `const` **EditButton**: \<`RecordType`\>(`props`) => `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Defined in: [components/buttons/EditButton.tsx:110](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/EditButton.tsx#L110)

Opens the Edit view for the current record.

Reads the record and resource from the context.

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### props

[`EditButtonProps`](#editbuttonprops)\<`RecordType`\> & `object`

#### Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

#### Example

```ts
// basic usage
import { EditButton } from 'shadmin';

const CommentEditButton = () => (
    <EditButton label="Edit comment" />
);
```

***

### ExportButton

> `const` **ExportButton**: `ForwardRefExoticComponent`\<[`ExportButtonProps`](#exportbuttonprops) & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [components/buttons/ExportButton.tsx:91](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ExportButton.tsx#L91)

Exports the current list data.

Uses the list context to access data and exporter.

#### Example

```ts
// basic usage
import { ExportButton } from 'shadmin';

const PostListActions = () => (
    <ExportButton />
);
```

***

### ShowButton()

> `const` **ShowButton**: \<`RecordType`\>(`props`) => `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Defined in: [components/buttons/ShowButton.tsx:101](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/buttons/ShowButton.tsx#L101)

Opens the Show view for the current record.

Reads the record and resource from the context.

#### Type Parameters

##### RecordType

`RecordType` *extends* `RaRecord` = `RaRecord`

#### Parameters

##### props

[`ShowButtonProps`](#showbuttonprops)\<`RecordType`\> & `object`

#### Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

#### Example

```ts
// basic usage
import { ShowButton } from 'shadmin';

const CommentShowButton = () => (
    <ShowButton label="View comment" />
);
```

***

### ResourceRegistrationContext

> `const` **ResourceRegistrationContext**: `Context`\<[`ResourceRegistrationContextValue`](#resourceregistrationcontextvalue) \| `null`\>

Defined in: [components/core/Resource.tsx:18](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/core/Resource.tsx#L18)

***

### SaveButton

> `const` **SaveButton**: `ForwardRefExoticComponent`\<[`SaveButtonProps`](#savebuttonprops) & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [components/form/Toolbar.tsx:180](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L180)

SaveButton component for form submission.
Shows loading state during submission and integrates with form context.

#### Example

```tsx
// Basic usage
<Toolbar>
  <SaveButton />
</Toolbar>

// Custom label and icon
<Toolbar>
  <SaveButton label="Submit Form" icon={<CheckIcon />} />
</Toolbar>
```

***

### DeleteButton

> `const` **DeleteButton**: `ForwardRefExoticComponent`\<[`DeleteButtonProps`](#deletebuttonprops) & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [components/form/Toolbar.tsx:290](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/form/Toolbar.tsx#L290)

DeleteButton component for deleting records.
Shows confirmation dialog before deleting.

#### Example

```tsx
// Basic usage
<Toolbar>
  <SaveButton />
  <DeleteButton onDelete={handleDelete} />
</Toolbar>

// Skip confirmation
<DeleteButton onDelete={handleDelete} confirmDelete={false} />

// Custom confirmation message
<DeleteButton
  onDelete={handleDelete}
  confirmMessage="This will permanently delete the user. Continue?"
/>
```

***

### LocaleSwitcher

> `const` **LocaleSwitcher**: `ForwardRefExoticComponent`\<[`LocaleSwitcherProps`](#localeswitcherprops) & `RefAttributes`\<`HTMLSelectElement`\>\>

Defined in: [components/i18n/LocaleSwitcher.tsx:55](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/LocaleSwitcher.tsx#L55)

LocaleSwitcher component for changing the application locale

#### Example

```tsx
// Basic usage - uses locales from i18nProvider
<LocaleSwitcher />

// With custom locales
<LocaleSwitcher
  locales={[
    { locale: 'en', name: 'English' },
    { locale: 'fr', name: 'French' },
    { locale: 'es', name: 'Spanish' },
  ]}
/>

// With custom handler
<LocaleSwitcher onLocaleChange={(locale) => console.log('Changed to', locale)} />
```

***

### TranslateLabel

> `const` **TranslateLabel**: `ForwardRefExoticComponent`\<[`TranslateLabelProps`](#translatelabelprops) & `RefAttributes`\<`HTMLLabelElement`\>\>

Defined in: [components/i18n/TranslateLabel.tsx:82](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/i18n/TranslateLabel.tsx#L82)

TranslateLabel component for form field labels

#### Example

```tsx
// Basic usage with source (auto-generates key)
<TranslateLabel source="firstName" />
// Looks up: resources.{currentResource}.fields.firstName

// With explicit resource
<TranslateLabel source="email" resource="users" />
// Looks up: resources.users.fields.email

// With direct translation key
<TranslateLabel i18nKey="custom.label.key" />

// With default label
<TranslateLabel source="customField" defaultLabel="My Custom Field" />

// Required field indicator
<TranslateLabel source="name" required />

// Linked to input
<TranslateLabel source="email" htmlFor="email-input" />
```

***

### ArrayInputContext

> `const` **ArrayInputContext**: `Context`\<[`ArrayInputContextValue`](#arrayinputcontextvalue) \| `undefined`\>

Defined in: [components/input/ArrayInput.tsx:46](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L46)

Context for ArrayInput to pass field array methods to children

***

### ArrayInput

> `const` **ArrayInput**: `ForwardRefExoticComponent`\<[`ArrayInputProps`](#arrayinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [components/input/ArrayInput.tsx:174](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ArrayInput.tsx#L174)

ArrayInput component for managing arrays of form data.
Integrates with react-hook-form through FormContext using useFieldArray.

#### Example

```tsx
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

***

### AutocompleteArrayInput

> `const` **AutocompleteArrayInput**: `ForwardRefExoticComponent`\<[`AutocompleteArrayInputProps`](#autocompletearrayinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/AutocompleteArrayInput.tsx:152](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteArrayInput.tsx#L152)

AutocompleteArrayInput component for multi-selection with typeahead.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
<AutocompleteArrayInput
  source="tags"
  label="Tags"
  choices={[
    { id: 'react', name: 'React' },
    { id: 'vue', name: 'Vue' },
    { id: 'angular', name: 'Angular' },
  ]}
/>
```

***

### AutocompleteInput

> `const` **AutocompleteInput**: `ForwardRefExoticComponent`\<[`AutocompleteInputProps`](#autocompleteinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/AutocompleteInput.tsx:155](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/AutocompleteInput.tsx#L155)

AutocompleteInput component for form selection with typeahead.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
<AutocompleteInput
  source="status"
  label="Status"
  choices={[
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
  ]}
/>
```

***

### BooleanInput

> `const` **BooleanInput**: `ForwardRefExoticComponent`\<[`BooleanInputProps`](#booleaninputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [components/input/BooleanInput.tsx:125](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/BooleanInput.tsx#L125)

BooleanInput component for form boolean values.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
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

***

### CheckboxGroupInput

> `const` **CheckboxGroupInput**: `ForwardRefExoticComponent`\<[`CheckboxGroupInputProps`](#checkboxgroupinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/CheckboxGroupInput.tsx:142](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/CheckboxGroupInput.tsx#L142)

CheckboxGroupInput component for multi-select form selection.
Integrates with react-hook-form through FormContext.
Stores an array of selected values.

#### Example

```tsx
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

***

### DateInput

> `const` **DateInput**: `ForwardRefExoticComponent`\<[`DateInputProps`](#dateinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/DateInput.tsx:112](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateInput.tsx#L112)

DateInput component for form date selection.
Uses the native HTML date input for broad browser support.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
// Basic usage
<DateInput source="birthDate" label="Birth Date" />

// With min/max constraints
<DateInput
  source="eventDate"
  label="Event Date"
  min="2024-01-01"
  max="2024-12-31"
/>

// With validation
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

***

### DateTimeInput

> `const` **DateTimeInput**: `ForwardRefExoticComponent`\<[`DateTimeInputProps`](#datetimeinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/DateTimeInput.tsx:96](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/DateTimeInput.tsx#L96)

DateTimeInput component for form datetime selection.
Uses the native HTML datetime-local input for broad browser support.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
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

***

### FileInput

> `const` **FileInput**: `ForwardRefExoticComponent`\<[`FileInputProps`](#fileinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/FileInput.tsx:160](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/FileInput.tsx#L160)

***

### ImageInput

> `const` **ImageInput**: `ForwardRefExoticComponent`\<[`ImageInputProps`](#imageinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/ImageInput.tsx:151](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/ImageInput.tsx#L151)

ImageInput component for form image upload with preview.
Supports single and multiple image selection, drag-and-drop, and file size validation.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
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
```

***

### NumberInput

> `const` **NumberInput**: `ForwardRefExoticComponent`\<[`NumberInputProps`](#numberinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/NumberInput.tsx:108](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/NumberInput.tsx#L108)

NumberInput component for form number entry.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
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

***

### PasswordInput

> `const` **PasswordInput**: `ForwardRefExoticComponent`\<[`PasswordInputProps`](#passwordinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/PasswordInput.tsx:154](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/PasswordInput.tsx#L154)

PasswordInput component for form password entry.
Integrates with react-hook-form through FormContext.
Includes a toggle button to show/hide the password.

#### Example

```tsx
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

***

### RadioButtonGroupInput

> `const` **RadioButtonGroupInput**: `ForwardRefExoticComponent`\<[`RadioButtonGroupInputProps`](#radiobuttongroupinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/RadioButtonGroupInput.tsx:135](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RadioButtonGroupInput.tsx#L135)

RadioButtonGroupInput component for form selection.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
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

***

### RichTextInput

> `const` **RichTextInput**: `ForwardRefExoticComponent`\<[`RichTextInputProps`](#richtextinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [components/input/RichTextInput.tsx:285](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/RichTextInput.tsx#L285)

RichTextInput component for form rich text entry.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
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

***

### SelectArrayInput

> `const` **SelectArrayInput**: `ForwardRefExoticComponent`\<[`SelectArrayInputProps`](#selectarrayinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [components/input/SelectArrayInput.tsx:161](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectArrayInput.tsx#L161)

SelectArrayInput component for multi-select form fields.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
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

***

### SelectInput

> `const` **SelectInput**: `ForwardRefExoticComponent`\<[`SelectInputProps`](#selectinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLSelectElement`\>\>

Defined in: [components/input/SelectInput.tsx:208](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/SelectInput.tsx#L208)

SelectInput component for form selection.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
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

***

### TextInput

> `const` **TextInput**: `ForwardRefExoticComponent`\<[`TextInputProps`](#textinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement` \| `HTMLTextAreaElement`\>\>

Defined in: [components/input/TextInput.tsx:151](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TextInput.tsx#L151)

TextInput component for form text entry.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
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
```

***

### TimeInput

> `const` **TimeInput**: `ForwardRefExoticComponent`\<[`TimeInputProps`](#timeinputprops)\<`FieldValues`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [components/input/TimeInput.tsx:101](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/input/TimeInput.tsx#L101)

TimeInput component for form time selection.
Uses the native HTML time input for broad browser support.
Integrates with react-hook-form through FormContext.

#### Example

```tsx
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
  source="precisetime"
  label="Precise Time"
  step={60}
/>
```

***

### Pagination

> `const` **Pagination**: `ForwardRefExoticComponent`\<[`PaginationProps`](#paginationprops) & `HTMLAttributes`\<`HTMLDivElement`\> & `object` & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [components/list/Pagination.tsx:158](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/Pagination.tsx#L158)

Pagination component for navigating through list data.

#### Example

```tsx
// With ListContext
<ListContextProvider value={listController}>
  <Pagination />
</ListContextProvider>

// Standalone usage
<Pagination
  page={2}
  perPage={10}
  total={50}
  setPage={setPage}
  setPerPage={setPerPage}
/>

// Custom rows per page options
<Pagination rowsPerPageOptions={[10, 25, 50, 100]} />

// Hide rows per page selector
<Pagination rowsPerPageOptions={[]} />
```

***

### RowsPerPageSelector

> `const` **RowsPerPageSelector**: `ForwardRefExoticComponent`\<[`RowsPerPageSelectorProps`](#rowsperpageselectorprops) & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [components/list/RowsPerPageSelector.tsx:51](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/list/RowsPerPageSelector.tsx#L51)

RowsPerPageSelector component for selecting page size.

#### Example

```tsx
<RowsPerPageSelector
  value={10}
  options={[10, 25, 50, 100]}
  onChange={(value) => setPerPage(value)}
/>
```

***

### DashboardMenuItem

> `const` **DashboardMenuItem**: `ForwardRefExoticComponent`\<[`DashboardMenuItemProps`](#dashboardmenuitemprops) & `RefAttributes`\<`HTMLAnchorElement`\>\>

Defined in: [components/menu/DashboardMenuItem.tsx:69](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/DashboardMenuItem.tsx#L69)

DashboardMenuItem - Pre-configured menu item for dashboard

#### Example

```tsx
// Default dashboard
<DashboardMenuItem />

// Custom path and label
<DashboardMenuItem to="/home" label="Home" />

// Custom icon
<DashboardMenuItem icon={<HomeIcon />} />
```

***

### MenuContext

> `const` **MenuContext**: `Context`\<[`MenuContextValue`](#menucontextvalue) \| `null`\>

Defined in: [components/menu/Menu.tsx:29](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L29)

***

### Menu

> `const` **Menu**: `MenuComponent`

Defined in: [components/menu/Menu.tsx:208](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/Menu.tsx#L208)

***

### MenuItem

> `const` **MenuItem**: `ForwardRefExoticComponent`\<[`MenuItemProps`](#menuitemprops) & `RefAttributes`\<`HTMLAnchorElement`\>\>

Defined in: [components/menu/MenuItem.tsx:101](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/MenuItem.tsx#L101)

MenuItem - Individual navigation item

#### Example

```tsx
<MenuItem
  to="/users"
  label="Users"
  icon={<UsersIcon />}
  badge={5}
/>
```

***

### ResourceItem

> `const` **ResourceItem**: `ForwardRefExoticComponent`\<[`ResourceItemProps`](#resourceitemprops) & `RefAttributes`\<`HTMLAnchorElement`\>\>

Defined in: [components/menu/ResourceItem.tsx:73](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/ResourceItem.tsx#L73)

ResourceItem - Menu item that links to a resource's list view

Automatically generates the link and label based on the resource name.
Can also pick up label and icon from resource definitions.

#### Example

```tsx
// Basic usage
<Menu>
  <Menu.ResourceItem name="posts" />
  <Menu.ResourceItem name="users" />
</Menu>

// With custom label
<Menu.ResourceItem name="posts" label="All Posts" />

// With custom icon
<Menu.ResourceItem name="posts" icon={<PostIcon />} />
```

***

### SubMenu

> `const` **SubMenu**: `ForwardRefExoticComponent`\<[`SubMenuProps`](#submenuprops) & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [components/menu/SubMenu.tsx:106](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/components/menu/SubMenu.tsx#L106)

SubMenu - Collapsible menu section

#### Example

```tsx
<SubMenu label="Settings" icon={<SettingsIcon />}>
  <MenuItem to="/settings/general" label="General" />
  <MenuItem to="/settings/security" label="Security" />
</SubMenu>
```

***

### PAGINATION\_DEFAULTS

> `const` **PAGINATION\_DEFAULTS**: `object`

Defined in: [constants.ts:13](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L13)

Default pagination settings for list queries

#### Type Declaration

##### PAGE

> `readonly` **PAGE**: `1` = `1`

Default page number (1-indexed)

##### PER\_PAGE

> `readonly` **PER\_PAGE**: `10` = `10`

Default number of records per page for list views

##### REFERENCE\_PER\_PAGE

> `readonly` **REFERENCE\_PER\_PAGE**: `25` = `25`

Default number of records per page for reference inputs (autocomplete, select)

***

### SORT\_DEFAULTS

> `const` **SORT\_DEFAULTS**: `object`

Defined in: [constants.ts:31](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L31)

Default sort configuration for list queries

#### Type Declaration

##### FIELD

> `readonly` **FIELD**: `"id"` = `'id'`

Default field to sort by

##### ORDER

> `readonly` **ORDER**: `"ASC"`

Default sort order

***

### DEFAULT\_SORT

> `const` **DEFAULT\_SORT**: `object`

Defined in: [constants.ts:45](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L45)

Default sort payload combining field and order

#### Type Declaration

##### field

> `readonly` **field**: `"id"` = `SORT_DEFAULTS.FIELD`

##### order

> `readonly` **order**: `"ASC"` = `SORT_DEFAULTS.ORDER`

***

### TIMING\_DEFAULTS

> `const` **TIMING\_DEFAULTS**: `object`

Defined in: [constants.ts:53](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L53)

UI timing defaults (in milliseconds)

#### Type Declaration

##### DEBOUNCE\_DELAY

> `readonly` **DEBOUNCE\_DELAY**: `200` = `200`

Debounce delay for URL updates when list params change

***

### QUERY\_DEFAULTS

> `const` **QUERY\_DEFAULTS**: `object`

Defined in: [constants.ts:63](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L63)

Query client defaults for React Query

#### Type Declaration

##### STALE\_TIME

> `readonly` **STALE\_TIME**: `number`

How long data is considered fresh (5 minutes)

##### RETRY\_COUNT

> `readonly` **RETRY\_COUNT**: `1` = `1`

Number of retry attempts on failure

##### REFETCH\_ON\_WINDOW\_FOCUS

> `readonly` **REFETCH\_ON\_WINDOW\_FOCUS**: `false` = `false`

Whether to refetch when window regains focus

***

### DO\_CLIENT\_DEFAULTS

> `const` **DO\_CLIENT\_DEFAULTS**: `object`

Defined in: [constants.ts:81](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/constants.ts#L81)

DO (Durable Objects) client defaults

#### Type Declaration

##### TIMEOUT

> `readonly` **TIMEOUT**: `30000` = `30000`

Request timeout in milliseconds

##### BATCHING

> `readonly` **BATCHING**: `true` = `true`

Enable request batching

##### BATCH\_WINDOW

> `readonly` **BATCH\_WINDOW**: `0` = `0`

Batch window in milliseconds (0 = immediate on microtask)

##### MAX\_BATCH\_SIZE

> `readonly` **MAX\_BATCH\_SIZE**: `100` = `100`

Maximum number of requests in a batch

##### OFFLINE\_QUEUE\_LIMIT

> `readonly` **OFFLINE\_QUEUE\_LIMIT**: `1000` = `1000`

Maximum number of requests to queue when offline

##### RECONNECT

> `readonly` **RECONNECT**: `object`

Reconnection configuration

###### RECONNECT.MAX\_ATTEMPTS

> `readonly` **MAX\_ATTEMPTS**: `number` = `Infinity`

Maximum number of reconnection attempts

###### RECONNECT.BASE\_DELAY

> `readonly` **BASE\_DELAY**: `1000` = `1000`

Base delay between reconnection attempts (ms)

###### RECONNECT.MAX\_DELAY

> `readonly` **MAX\_DELAY**: `30000` = `30000`

Maximum delay between reconnection attempts (ms)

###### RECONNECT.JITTER

> `readonly` **JITTER**: `0.1` = `0.1`

Random jitter factor for reconnection delay

***

### AuthProviderContext

> `const` **AuthProviderContext**: `Context`\<`AuthProvider` \| `null`\>

Defined in: [contexts/AuthProviderContext.tsx:10](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/AuthProviderContext.tsx#L10)

***

### DataProviderContext

> `const` **DataProviderContext**: `Context`\<`DataProvider` \| `null`\>

Defined in: [contexts/DataProviderContext.tsx:10](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/DataProviderContext.tsx#L10)

***

### FormContext

> `const` **FormContext**: `Context`\<[`ShadminFormContextValue`](#shadminformcontextvalue)\<`FieldValues`\> \| `undefined`\>

Defined in: [contexts/FormContext.tsx:49](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/FormContext.tsx#L49)

Context for shadmin-specific form properties.

Note: The context uses FieldValues as the base type. Type narrowing is done
in the consuming hooks through type assertions, which is safe because
the provider ensures the correct type is passed.

***

### ListContext

> `const` **ListContext**: `Context`\<[`ListControllerResult`](#listcontrollerresult)\<`RaRecord`\> \| `undefined`\>

Defined in: [contexts/ListContext.tsx:90](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ListContext.tsx#L90)

Context to store list controller state and callbacks.
Used by List components to share list state with children.

Note: The context uses the base RaRecord type. Type narrowing is done
in useListContext through a type assertion, which is safe because
the provider ensures the correct type is passed.

***

### NotificationContext

> `const` **NotificationContext**: `Context`\<[`NotificationContextValue`](#notificationcontextvalue) \| `undefined`\>

Defined in: [contexts/NotificationContext.tsx:71](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/NotificationContext.tsx#L71)

Context for notification system

***

### RecordContext

> `const` **RecordContext**: `Context`\<`RaRecord` \| `undefined`\>

Defined in: [contexts/RecordContext.tsx:16](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/RecordContext.tsx#L16)

Context to store the current record.
Used by components like Show, Edit to share the current record with children.

Note: The context uses the base RaRecord type. Type narrowing is done
in useRecordContext through a type assertion, which is safe because
the provider ensures the correct type is passed.

***

### ResourceContext

> `const` **ResourceContext**: `Context`\<`ResourceContextValue`\> = `RaCoreResourceContext`

Defined in: [contexts/ResourceContext.tsx:19](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L19)

***

### ResourceDefinitionContext

> `const` **ResourceDefinitionContext**: `Context`\<[`ResourceDefinitions`](#resourcedefinitions)\>

Defined in: [contexts/ResourceContext.tsx:109](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ResourceContext.tsx#L109)

***

### ThemeContext

> `const` **ThemeContext**: `Context`\<[`ThemeContextValue`](#themecontextvalue) \| `null`\>

Defined in: [contexts/ThemeContext.tsx:25](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/ThemeContext.tsx#L25)

***

### TranslationContext

> `const` **TranslationContext**: `Context`\<[`TranslationContextValue`](#translationcontextvalue) \| `null`\>

Defined in: [contexts/TranslationContext.tsx:62](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/contexts/TranslationContext.tsx#L62)

***

### CreateSuggestionContext

> `const` **CreateSuggestionContext**: `Context`\<[`CreateSuggestionContextValue`](#createsuggestioncontextvalue)\<`unknown`\> \| `undefined`\>

Defined in: [hooks/useCreateSuggestionContext.ts:35](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/hooks/useCreateSuggestionContext.ts#L35)

Context for managing "create new" suggestions in autocomplete inputs.
Used by AutocompleteInput to allow creating new options on-the-fly.

***

### VERSION

> `const` **VERSION**: `"0.0.5"` = `'0.0.5'`

Defined in: [index.ts:472](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/index.ts#L472)

***

### FILTER\_OPERATORS

> `const` **FILTER\_OPERATORS**: readonly \[`"eq"`, `"neq"`, `"gt"`, `"gte"`, `"lt"`, `"lte"`, `"contains"`, `"startsWith"`, `"endsWith"`, `"in"`, `"notIn"`, `"between"`, `"isNull"`, `"isNotNull"`\]

Defined in: [utils/filterOperators.ts:12](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L12)

All supported filter operators

***

### FILTER\_OPERATOR\_LABELS

> `const` **FILTER\_OPERATOR\_LABELS**: `Record`\<`FilterOperator`, `string`\>

Defined in: [utils/filterOperators.ts:372](https://github.com/dot-do/shadmin/blob/11b2a454a017cddcd6a383b77a6ee07b2a929ebd/packages/shadmin/src/utils/filterOperators.ts#L372)

Labels for filter operators (for UI display)
