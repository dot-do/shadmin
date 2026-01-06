/**
 * Data Component Stories
 * Comprehensive Storybook stories for Show, Create, Edit, SimpleForm, and TabbedForm
 */

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

// Contexts
import { RecordContextProvider } from '../../contexts/RecordContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import { FormContextProvider } from '../../contexts/FormContext'
import { ResourceContextProvider } from '../../contexts/ResourceContext'

// Data Components
import { Show } from '../show/Show'
import { Edit } from '../edit/Edit'
import { Create } from '../create/Create'
import { SimpleForm } from './SimpleForm'
import { TabbedForm, FormTab } from './TabbedForm'
import { Toolbar, SaveButton, DeleteButton } from './Toolbar'

// Input Components
import { TextInput } from '../input/TextInput'
import { NumberInput } from '../input/NumberInput'
import { BooleanInput } from '../input/BooleanInput'
import { SelectInput } from '../input/SelectInput'
import { DateInput } from '../input/DateInput'
import { PasswordInput } from '../input/PasswordInput'
import { RadioButtonGroupInput } from '../input/RadioButtonGroupInput'
import { CheckboxGroupInput } from '../input/CheckboxGroupInput'

// Field Components
import { TextField } from '../field/TextField'
import { NumberField } from '../field/NumberField'
import { DateField } from '../field/DateField'
import { BooleanField } from '../field/BooleanField'
import { ChipField } from '../field/ChipField'

// Types
import type { DataProvider, RaRecord } from '../../types'

// =============================================================================
// Mock Data
// =============================================================================

interface Post extends RaRecord {
  id: number
  title: string
  body: string
  status: 'draft' | 'published' | 'archived'
  publishedAt: string | null
  authorId: number
  views: number
  featured: boolean
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface User extends RaRecord {
  id: number
  name: string
  email: string
  role: string
  active: boolean
}

const mockPost: Post = {
  id: 1,
  title: 'Getting Started with Shadmin',
  body: 'This is a comprehensive guide to building admin interfaces with Shadmin. It covers all the essential components and best practices.',
  status: 'published',
  publishedAt: '2024-01-15T10:30:00Z',
  authorId: 42,
  views: 1234,
  featured: true,
  category: 'tutorials',
  tags: ['react', 'typescript', 'admin'],
  createdAt: '2024-01-10T08:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
}

const mockUser: User = {
  id: 42,
  name: 'Jane Smith',
  email: 'jane@example.com',
  role: 'Editor',
  active: true,
}

const categoryChoices = [
  { id: 'tutorials', name: 'Tutorials' },
  { id: 'news', name: 'News' },
  { id: 'updates', name: 'Product Updates' },
  { id: 'engineering', name: 'Engineering' },
]

const statusChoices = [
  { id: 'draft', name: 'Draft' },
  { id: 'published', name: 'Published' },
  { id: 'archived', name: 'Archived' },
]

const tagChoices = [
  { id: 'react', name: 'React' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'admin', name: 'Admin' },
  { id: 'ui', name: 'UI/UX' },
  { id: 'performance', name: 'Performance' },
]

// =============================================================================
// Mock Data Provider
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockDataProvider = (data: Record<string, RaRecord[]> = {}): DataProvider => ({
  getList: async (resource) => {
    const records = data[resource] || []
    return { data: records, total: records.length }
  },
  getOne: async (resource, { id }) => {
    if (resource === 'posts') {
      return { data: mockPost }
    }
    if (resource === 'users') {
      return { data: mockUser }
    }
    return { data: { id } as RaRecord }
  },
  getMany: async (resource, { ids }) => {
    if (resource === 'users') {
      return { data: [mockUser] }
    }
    return { data: ids.map((id) => ({ id })) as RaRecord[] }
  },
  getManyReference: async () => ({ data: [], total: 0 }),
  create: async (_resource, { data: createData }) => {
    console.log('Create called with:', createData)
    return { data: { id: Date.now(), ...createData } as RaRecord }
  },
  update: async (_resource, { id, data: updateData }) => {
    console.log('Update called with:', { id, data: updateData })
    return { data: { id, ...updateData } as RaRecord }
  },
  updateMany: async (_resource, { ids }) => ({ data: ids }),
  delete: async (_resource, { id }) => {
    console.log('Delete called for:', id)
    return { data: { id } as RaRecord }
  },
  deleteMany: async (_resource, { ids }) => ({ data: ids }),
} as DataProvider)

// =============================================================================
// Wrapper Components
// =============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

interface DataProviderWrapperProps {
  children: React.ReactNode
  dataProvider?: DataProvider
  resource?: string
}

function DataProviderWrapper({
  children,
  dataProvider = createMockDataProvider(),
  resource = 'posts',
}: DataProviderWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <ResourceContextProvider value={resource}>
            {children}
          </ResourceContextProvider>
        </DataProviderContextProvider>
      </NotificationContextProvider>
    </QueryClientProvider>
  )
}

interface FormWrapperProps {
  children: React.ReactNode
  defaultValues?: Record<string, unknown>
  resource?: string
  record?: RaRecord
}

function FormWrapper({
  children,
  defaultValues = {},
  resource = 'posts',
  record,
}: FormWrapperProps) {
  const form = useForm({ defaultValues })
  return (
    <FormContextProvider {...form} resource={resource} record={record}>
      <form className="w-full max-w-2xl space-y-6">{children}</form>
    </FormContextProvider>
  )
}

// =============================================================================
// SimpleShowLayout - Custom layout for show views
// =============================================================================

interface SimpleShowLayoutProps {
  children: React.ReactNode
  className?: string
}

function SimpleShowLayout({ children, className }: SimpleShowLayoutProps) {
  return <div className={`space-y-4 ${className || ''}`}>{children}</div>
}

// =============================================================================
// TabbedShowLayout - Tabbed layout for show views
// =============================================================================

interface TabbedShowLayoutProps {
  children: React.ReactNode
  className?: string
}

interface ShowTabProps {
  label: string
  children: React.ReactNode
}

function ShowTab({ children }: ShowTabProps) {
  return <>{children}</>
}

function TabbedShowLayout({ children, className }: TabbedShowLayoutProps) {
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<ShowTabProps> =>
      React.isValidElement(child) && child.type === ShowTab
  )

  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <div className={className}>
      <div className="flex border-b mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === index
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">{tabs[activeTab]?.props.children}</div>
    </div>
  )
}

// =============================================================================
// Story Meta
// =============================================================================

const meta: Meta = {
  title: 'Components/Data/DataComponents',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Data components for building admin interfaces. Includes:
- **Show**: Display record details with various layouts
- **Create**: Create new records with form validation
- **Edit**: Edit existing records with optimistic updates
- **SimpleForm**: Basic vertical form layout
- **TabbedForm**: Multi-tab form organization
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

// =============================================================================
// Show Stories
// =============================================================================

/**
 * Show component with SimpleShowLayout displays record fields in a vertical stack
 */
export const ShowWithSimpleLayout: StoryObj = {
  name: 'Show / Simple Layout',
  render: () => (
    <DataProviderWrapper>
      <RecordContextProvider value={mockPost}>
        <Show resource="posts" id={1} title="Post Details">
          <SimpleShowLayout>
            <TextField source="title" label="Title" />
            <TextField source="body" label="Content" />
            <ChipField source="status" label="Status" variant="secondary" />
            <DateField source="publishedAt" label="Published At" showTime />
            <NumberField source="views" label="Views" />
            <BooleanField source="featured" label="Featured" />
            <DateField source="createdAt" label="Created" />
          </SimpleShowLayout>
        </Show>
      </RecordContextProvider>
    </DataProviderWrapper>
  ),
}

/**
 * Show component with TabbedShowLayout organizes fields into tabs
 */
export const ShowWithTabbedLayout: StoryObj = {
  name: 'Show / Tabbed Layout',
  render: () => (
    <DataProviderWrapper>
      <RecordContextProvider value={mockPost}>
        <Show resource="posts" id={1} title="Post Details">
          <TabbedShowLayout>
            <ShowTab label="General">
              <TextField source="title" label="Title" />
              <TextField source="body" label="Content" />
              <ChipField source="status" label="Status" variant="secondary" />
            </ShowTab>
            <ShowTab label="Publishing">
              <DateField source="publishedAt" label="Published At" showTime />
              <BooleanField source="featured" label="Featured" />
              <NumberField source="views" label="Views" />
            </ShowTab>
            <ShowTab label="Metadata">
              <TextField source="category" label="Category" />
              <DateField source="createdAt" label="Created" />
              <DateField source="updatedAt" label="Last Updated" />
            </ShowTab>
          </TabbedShowLayout>
        </Show>
      </RecordContextProvider>
    </DataProviderWrapper>
  ),
}

/**
 * Show with custom actions in the header
 */
export const ShowWithActions: StoryObj = {
  name: 'Show / With Actions',
  render: () => (
    <DataProviderWrapper>
      <RecordContextProvider value={mockPost}>
        <Show
          resource="posts"
          id={1}
          title="Post Details"
          actions={
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md">
                Edit
              </button>
              <button className="px-3 py-1.5 text-sm border rounded-md">
                Delete
              </button>
            </div>
          }
        >
          <SimpleShowLayout>
            <TextField source="title" label="Title" />
            <TextField source="body" label="Content" />
            <ChipField source="status" label="Status" variant="secondary" />
          </SimpleShowLayout>
        </Show>
      </RecordContextProvider>
    </DataProviderWrapper>
  ),
}

// =============================================================================
// Create Stories
// =============================================================================

/**
 * Create component with SimpleForm for basic record creation
 */
export const CreateWithSimpleForm: StoryObj = {
  name: 'Create / Simple Form',
  render: () => {
    const handleSubmit = async (data: Record<string, unknown>) => {
      console.log('Create submitted:', data)
      alert(`Created: ${JSON.stringify(data, null, 2)}`)
    }

    return (
      <DataProviderWrapper>
        <Create resource="posts" title="Create Post">
          <SimpleForm
            onSubmit={handleSubmit}
            defaultValues={{
              title: '',
              body: '',
              status: 'draft',
              featured: false,
            }}
          >
            <TextInput source="title" label="Title" required />
            <TextInput source="body" label="Content" />
            <SelectInput source="status" label="Status" choices={statusChoices} />
            <SelectInput source="category" label="Category" choices={categoryChoices} />
            <BooleanInput source="featured" label="Featured Post" />
          </SimpleForm>
        </Create>
      </DataProviderWrapper>
    )
  },
}

/**
 * Create component with TabbedForm for complex record creation
 */
export const CreateWithTabbedForm: StoryObj = {
  name: 'Create / Tabbed Form',
  render: () => (
    <DataProviderWrapper>
      <Create resource="posts" title="Create Post">
        <FormWrapper
          defaultValues={{
            title: '',
            body: '',
            status: 'draft',
            featured: false,
            category: '',
            tags: [],
            authorEmail: '',
          }}
        >
          <TabbedForm>
            <FormTab label="Content">
              <TextInput source="title" label="Title" required />
              <TextInput source="body" label="Content" />
            </FormTab>
            <FormTab label="Publishing">
              <SelectInput source="status" label="Status" choices={statusChoices} />
              <SelectInput source="category" label="Category" choices={categoryChoices} />
              <BooleanInput source="featured" label="Featured Post" />
            </FormTab>
            <FormTab label="Settings">
              <CheckboxGroupInput source="tags" label="Tags" choices={tagChoices} />
              <TextInput source="authorEmail" label="Author Email" />
            </FormTab>
          </TabbedForm>
          <Toolbar>
            <SaveButton label="Create Post" />
          </Toolbar>
        </FormWrapper>
      </Create>
    </DataProviderWrapper>
  ),
}

// =============================================================================
// Edit Stories
// =============================================================================

/**
 * Edit component with SimpleForm for basic record editing
 */
export const EditWithSimpleForm: StoryObj = {
  name: 'Edit / Simple Form',
  render: () => {
    const handleSubmit = async (data: Record<string, unknown>) => {
      console.log('Edit submitted:', data)
      alert(`Updated: ${JSON.stringify(data, null, 2)}`)
    }

    return (
      <DataProviderWrapper>
        <RecordContextProvider value={mockPost}>
          <Edit resource="posts" id={1} title="Edit Post">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={mockPost}
              record={mockPost}
            >
              <TextInput source="title" label="Title" required />
              <TextInput source="body" label="Content" />
              <SelectInput source="status" label="Status" choices={statusChoices} />
              <SelectInput source="category" label="Category" choices={categoryChoices} />
              <BooleanInput source="featured" label="Featured Post" />
              <NumberInput source="views" label="Views" disabled />
            </SimpleForm>
          </Edit>
        </RecordContextProvider>
      </DataProviderWrapper>
    )
  },
}

/**
 * Edit component with validation using react-hook-form rules
 */
export const EditWithValidation: StoryObj = {
  name: 'Edit / With Validation',
  render: () => {
    const handleSubmit = async (data: Record<string, unknown>) => {
      console.log('Edit submitted:', data)
      alert(`Updated: ${JSON.stringify(data, null, 2)}`)
    }

    return (
      <DataProviderWrapper>
        <RecordContextProvider value={mockPost}>
          <Edit resource="posts" id={1} title="Edit Post (With Validation)">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={mockPost}
              record={mockPost}
              mode="onBlur"
            >
              <TextInput
                source="title"
                label="Title"
                required
                helperText="Must be at least 5 characters"
                rules={{ minLength: { value: 5, message: 'Title must be at least 5 characters' } }}
              />
              <TextInput
                source="body"
                label="Content"
                required
                helperText="Must be at least 20 characters"
                rules={{ minLength: { value: 20, message: 'Content must be at least 20 characters' } }}
              />
              <SelectInput
                source="status"
                label="Status"
                choices={statusChoices}
                required
              />
              <SelectInput
                source="category"
                label="Category"
                choices={categoryChoices}
                required
              />
              <BooleanInput source="featured" label="Featured Post" />
              <NumberInput source="views" label="Views" disabled />
            </SimpleForm>
          </Edit>
        </RecordContextProvider>
      </DataProviderWrapper>
    )
  },
}

/**
 * Edit component with delete button and custom toolbar
 */
export const EditWithDeleteButton: StoryObj = {
  name: 'Edit / With Delete Button',
  render: () => {
    const handleSubmit = async (data: Record<string, unknown>) => {
      console.log('Edit submitted:', data)
      alert(`Updated: ${JSON.stringify(data, null, 2)}`)
    }

    const handleDelete = async () => {
      console.log('Delete clicked')
      alert('Record deleted!')
    }

    return (
      <DataProviderWrapper>
        <RecordContextProvider value={mockPost}>
          <Edit resource="posts" id={1} title="Edit Post">
            <SimpleForm
              onSubmit={handleSubmit}
              defaultValues={mockPost}
              record={mockPost}
              toolbar={
                <Toolbar>
                  <SaveButton />
                  <DeleteButton onDelete={handleDelete} />
                </Toolbar>
              }
            >
              <TextInput source="title" label="Title" required />
              <TextInput source="body" label="Content" />
              <SelectInput source="status" label="Status" choices={statusChoices} />
            </SimpleForm>
          </Edit>
        </RecordContextProvider>
      </DataProviderWrapper>
    )
  },
}

// =============================================================================
// Form Stories - All Input Types
// =============================================================================

/**
 * SimpleForm showcasing all available input types
 */
export const FormWithAllInputTypes: StoryObj = {
  name: 'Form / All Input Types',
  render: () => {
    const handleSubmit = async (data: Record<string, unknown>) => {
      console.log('Form submitted:', data)
      alert(`Submitted: ${JSON.stringify(data, null, 2)}`)
    }

    const roleChoices = [
      { id: 'admin', name: 'Administrator' },
      { id: 'editor', name: 'Editor' },
      { id: 'viewer', name: 'Viewer' },
    ]

    const notificationChoices = [
      { id: 'email', name: 'Email' },
      { id: 'sms', name: 'SMS' },
      { id: 'push', name: 'Push' },
    ]

    const themeChoices = [
      { id: 'light', name: 'Light' },
      { id: 'dark', name: 'Dark' },
      { id: 'system', name: 'System' },
    ]

    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Complete Form Example</h2>
        <SimpleForm
          onSubmit={handleSubmit}
          defaultValues={{
            username: '',
            email: '',
            password: '',
            age: undefined,
            birthDate: '',
            role: 'viewer',
            isActive: true,
            theme: 'system',
            notifications: ['email'],
            bio: '',
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <TextInput source="username" label="Username" required />
            <TextInput
              source="email"
              label="Email"
              required
              placeholder="you@example.com"
            />
          </div>

          <PasswordInput source="password" label="Password" required />

          <div className="grid grid-cols-2 gap-4">
            <NumberInput source="age" label="Age" min={18} max={120} />
            <DateInput source="birthDate" label="Birth Date" />
          </div>

          <SelectInput source="role" label="Role" choices={roleChoices} required />

          <BooleanInput
            source="isActive"
            label="Active Account"
            helperText="Enable or disable this account"
          />

          <RadioButtonGroupInput
            source="theme"
            label="Theme Preference"
            choices={themeChoices}
            row
          />

          <CheckboxGroupInput
            source="notifications"
            label="Notification Preferences"
            choices={notificationChoices}
            helperText="Select how you want to be notified"
          />

          <TextInput source="bio" label="Bio" helperText="Tell us about yourself" />
        </SimpleForm>
      </div>
    )
  },
}

/**
 * TabbedForm with multiple tabs
 */
export const TabbedFormComplete: StoryObj = {
  name: 'Form / Tabbed Form Complete',
  render: () => (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Multi-Tab Form</h2>
      <FormWrapper
          defaultValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            zipCode: '',
            country: 'us',
            password: '',
            confirmPassword: '',
            twoFactor: false,
            marketing: true,
            terms: false,
          }}
        >
          <TabbedForm>
            <FormTab label="Personal Info">
              <div className="grid grid-cols-2 gap-4">
                <TextInput source="firstName" label="First Name" required />
                <TextInput source="lastName" label="Last Name" required />
              </div>
              <TextInput source="email" label="Email" required />
              <TextInput source="phone" label="Phone Number" />
            </FormTab>

            <FormTab label="Address">
              <TextInput source="address" label="Street Address" />
              <div className="grid grid-cols-2 gap-4">
                <TextInput source="city" label="City" />
                <TextInput source="zipCode" label="ZIP Code" />
              </div>
              <SelectInput
                source="country"
                label="Country"
                choices={[
                  { id: 'us', name: 'United States' },
                  { id: 'uk', name: 'United Kingdom' },
                  { id: 'ca', name: 'Canada' },
                  { id: 'au', name: 'Australia' },
                ]}
              />
            </FormTab>

            <FormTab label="Security">
              <PasswordInput source="password" label="Password" required />
              <PasswordInput source="confirmPassword" label="Confirm Password" required />
              <BooleanInput
                source="twoFactor"
                label="Enable Two-Factor Authentication"
                helperText="Add an extra layer of security to your account"
              />
            </FormTab>

            <FormTab label="Preferences">
              <BooleanInput
                source="marketing"
                label="Receive Marketing Emails"
                helperText="Get updates about new features and promotions"
              />
              <BooleanInput
                source="terms"
                label="Accept Terms and Conditions"
                helperText="Required to create an account"
              />
            </FormTab>
          </TabbedForm>

        <Toolbar>
          <SaveButton label="Create Account" />
        </Toolbar>
      </FormWrapper>
    </div>
  ),
}

/**
 * SimpleForm with warning for unsaved changes
 */
export const FormWithUnsavedWarning: StoryObj = {
  name: 'Form / Unsaved Changes Warning',
  render: () => {
    const handleSubmit = async (data: Record<string, unknown>) => {
      console.log('Form submitted:', data)
      alert(`Submitted: ${JSON.stringify(data, null, 2)}`)
    }

    return (
      <div className="max-w-md">
        <h2 className="text-xl font-bold mb-4">Form with Unsaved Changes Warning</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Make changes and try to navigate away. You will see a warning.
        </p>
        <SimpleForm
          onSubmit={handleSubmit}
          defaultValues={{ title: '', content: '' }}
          warnWhenUnsavedChanges
        >
          <TextInput source="title" label="Title" />
          <TextInput source="content" label="Content" />
        </SimpleForm>
      </div>
    )
  },
}

/**
 * SimpleForm with transform function
 */
export const FormWithTransform: StoryObj = {
  name: 'Form / With Transform',
  render: () => {
    const handleSubmit = async (data: Record<string, unknown>) => {
      console.log('Final data after transform:', data)
      alert(`Submitted (transformed): ${JSON.stringify(data, null, 2)}`)
    }

    const transformData = <T extends Record<string, unknown>>(data: T): T => {
      return {
        ...data,
        title: typeof data.title === 'string' ? data.title.trim().toUpperCase() : data.title,
        slug:
          typeof data.title === 'string'
            ? data.title.toLowerCase().replace(/\s+/g, '-')
            : '',
        submittedAt: new Date().toISOString(),
      } as T
    }

    return (
      <div className="max-w-md">
        <h2 className="text-xl font-bold mb-4">Form with Data Transform</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Title will be uppercased and a slug will be generated automatically.
        </p>
        <SimpleForm
          onSubmit={handleSubmit}
          defaultValues={{ title: '', body: '' }}
          transform={transformData}
        >
          <TextInput source="title" label="Title" helperText="Will be transformed to uppercase" />
          <TextInput source="body" label="Body" />
        </SimpleForm>
      </div>
    )
  },
}

/**
 * SimpleForm with disabled invalid submit
 */
export const FormDisableInvalidSubmit: StoryObj = {
  name: 'Form / Disable Invalid Submit',
  render: () => {
    const handleSubmit = async (data: Record<string, unknown>) => {
      console.log('Form submitted:', data)
      alert(`Submitted: ${JSON.stringify(data, null, 2)}`)
    }

    return (
      <div className="max-w-md">
        <h2 className="text-xl font-bold mb-4">Form with Disabled Submit Button</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Submit button is disabled until all required fields are valid.
        </p>
        <SimpleForm
          onSubmit={handleSubmit}
          defaultValues={{ email: '', name: '' }}
          mode="onChange"
          disableInvalidSubmit
        >
          <TextInput
            source="name"
            label="Name"
            required
            rules={{ minLength: { value: 2, message: 'Name must be at least 2 characters' } }}
          />
          <TextInput
            source="email"
            label="Email"
            required
            rules={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email format',
              },
            }}
          />
        </SimpleForm>
      </div>
    )
  },
}

// =============================================================================
// Complete CRUD Example
// =============================================================================

/**
 * Complete example showing Show, Edit, and Create together
 */
export const CompleteCRUDExample: StoryObj = {
  name: 'Complete CRUD Example',
  render: () => {
    const [view, setView] = React.useState<'show' | 'edit' | 'create'>('show')

    const handleSubmit = async (data: Record<string, unknown>) => {
      console.log('Submitted:', data)
      alert(`${view === 'create' ? 'Created' : 'Updated'}: ${JSON.stringify(data, null, 2)}`)
      setView('show')
    }

    return (
      <DataProviderWrapper>
        <div className="space-y-4">
          {/* Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setView('show')}
              className={`px-4 py-2 text-sm rounded-md ${
                view === 'show' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              Show
            </button>
            <button
              onClick={() => setView('edit')}
              className={`px-4 py-2 text-sm rounded-md ${
                view === 'edit' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setView('create')}
              className={`px-4 py-2 text-sm rounded-md ${
                view === 'create' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              Create
            </button>
          </div>

          {/* Show View */}
          {view === 'show' && (
            <RecordContextProvider value={mockPost}>
              <Show
                resource="posts"
                id={1}
                title="Post Details"
                actions={
                  <button
                    onClick={() => setView('edit')}
                    className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md"
                  >
                    Edit
                  </button>
                }
              >
                <SimpleShowLayout>
                  <TextField source="title" label="Title" />
                  <TextField source="body" label="Content" />
                  <ChipField source="status" label="Status" variant="secondary" />
                  <BooleanField source="featured" label="Featured" />
                  <NumberField source="views" label="Views" />
                  <DateField source="createdAt" label="Created" showTime />
                </SimpleShowLayout>
              </Show>
            </RecordContextProvider>
          )}

          {/* Edit View */}
          {view === 'edit' && (
            <RecordContextProvider value={mockPost}>
              <Edit resource="posts" id={1} title="Edit Post">
                <SimpleForm
                  onSubmit={handleSubmit}
                  defaultValues={mockPost}
                  record={mockPost}
                  toolbar={
                    <Toolbar>
                      <SaveButton />
                      <button
                        type="button"
                        onClick={() => setView('show')}
                        className="px-4 py-2 text-sm border rounded-md"
                      >
                        Cancel
                      </button>
                    </Toolbar>
                  }
                >
                  <TextInput source="title" label="Title" required />
                  <TextInput source="body" label="Content" />
                  <SelectInput source="status" label="Status" choices={statusChoices} />
                  <SelectInput source="category" label="Category" choices={categoryChoices} />
                  <BooleanInput source="featured" label="Featured Post" />
                </SimpleForm>
              </Edit>
            </RecordContextProvider>
          )}

          {/* Create View */}
          {view === 'create' && (
            <Create resource="posts" title="Create New Post">
              <SimpleForm
                onSubmit={handleSubmit}
                defaultValues={{
                  title: '',
                  body: '',
                  status: 'draft',
                  category: '',
                  featured: false,
                }}
                toolbar={
                  <Toolbar>
                    <SaveButton label="Create" />
                    <button
                      type="button"
                      onClick={() => setView('show')}
                      className="px-4 py-2 text-sm border rounded-md"
                    >
                      Cancel
                    </button>
                  </Toolbar>
                }
              >
                <TextInput source="title" label="Title" required />
                <TextInput source="body" label="Content" />
                <SelectInput source="status" label="Status" choices={statusChoices} />
                <SelectInput source="category" label="Category" choices={categoryChoices} />
                <BooleanInput source="featured" label="Featured Post" />
              </SimpleForm>
            </Create>
          )}
        </div>
      </DataProviderWrapper>
    )
  },
}
