import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import type { DataProvider } from '../../types'
import { TextField } from './TextField'
import { NumberField } from './NumberField'
import { DateField } from './DateField'
import { BooleanField } from './BooleanField'
import { EmailField } from './EmailField'
import { UrlField } from './UrlField'
import { ImageField } from './ImageField'
import { ReferenceField } from './ReferenceField'
import { ChipField } from './ChipField'
import { FunctionField } from './FunctionField'

// Sample record for demonstrations
const sampleRecord = {
  id: 1,
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  website: 'https://example.com/profile/john-doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  photos: [
    { src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', caption: 'Profile' },
    { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', caption: 'Work' },
  ],
  age: 32,
  salary: 125000.5,
  rating: 0.9543,
  views: 1234567,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: new Date('2024-06-20T14:45:00Z'),
  active: true,
  verified: false,
  premium: 1,
  status: 'active',
  role: 'admin',
  priority: 'high',
  authorId: 42,
  nested: {
    field: 'Nested Value',
    deep: {
      value: 'Deep Nested Value',
    },
  },
}

// Mock data provider for ReferenceField
const mockDataProvider = {
  getList: async () => ({ data: [], total: 0 }),
  getOne: async (_resource: string, { id }: { id: unknown }) => ({
    data: {
      id,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Editor',
    },
  }),
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  create: async () => ({ data: { id: 1 } }),
  update: async () => ({ data: { id: 1 } }),
  updateMany: async () => ({ data: [] }),
  delete: async () => ({ data: { id: 1 } }),
  deleteMany: async () => ({ data: [] }),
} as DataProvider

// Wrapper with RecordContext
const RecordWrapper = ({ children }: { children: React.ReactNode }) => (
  <RecordContextProvider value={sampleRecord}>
    {children}
  </RecordContextProvider>
)

// Wrapper with QueryClient and DataProvider for ReferenceField
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

const FullWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <DataProviderContextProvider dataProvider={mockDataProvider}>
      <RecordContextProvider value={sampleRecord}>
        {children}
      </RecordContextProvider>
    </DataProviderContextProvider>
  </QueryClientProvider>
)

// =============================================================================
// TextField Stories
// =============================================================================

const textFieldMeta: Meta<typeof TextField> = {
  title: 'Components/Fields/TextField',
  component: TextField,
  decorators: [(Story) => <RecordWrapper><Story /></RecordWrapper>],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays a text value from a record field. Supports nested field access and custom empty text.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    source: {
      control: 'text',
      description: 'The field name in the record to display',
    },
    label: {
      control: 'text',
      description: 'Optional label to display above the value',
    },
    emptyText: {
      control: 'text',
      description: 'Text to display when value is empty/null/undefined',
    },
  },
}

export default textFieldMeta

type TextFieldStory = StoryObj<typeof TextField>

/**
 * Basic text field displaying the name from the record
 */
export const TextFieldBasic: TextFieldStory = {
  args: {
    source: 'name',
  },
}

/**
 * TextField with a label displayed above the value
 */
export const TextFieldWithLabel: TextFieldStory = {
  args: {
    source: 'name',
    label: 'Full Name',
  },
}

/**
 * Accessing nested fields using dot notation
 */
export const TextFieldNested: TextFieldStory = {
  args: {
    source: 'nested.field',
  },
}

/**
 * Deep nested field access
 */
export const TextFieldDeepNested: TextFieldStory = {
  args: {
    source: 'nested.deep.value',
  },
}

/**
 * Custom text when field value is empty
 */
export const TextFieldEmpty: TextFieldStory = {
  args: {
    source: 'nonexistent',
    emptyText: 'N/A',
  },
}

/**
 * TextField with custom styling
 */
export const TextFieldStyled: TextFieldStory = {
  args: {
    source: 'name',
    className: 'text-lg font-bold text-primary',
  },
}

// =============================================================================
// NumberField Stories
// =============================================================================

/**
 * Basic number display
 */
export const NumberFieldBasic: StoryObj<typeof NumberField> = {
  render: () => (
    <RecordWrapper>
      <NumberField source="age" />
    </RecordWrapper>
  ),
  name: 'NumberField - Basic',
}

/**
 * Currency formatting
 */
export const NumberFieldCurrency: StoryObj<typeof NumberField> = {
  render: () => (
    <RecordWrapper>
      <NumberField
        source="salary"
        options={{ style: 'currency', currency: 'USD' }}
      />
    </RecordWrapper>
  ),
  name: 'NumberField - Currency',
}

/**
 * Percentage formatting
 */
export const NumberFieldPercent: StoryObj<typeof NumberField> = {
  render: () => (
    <RecordWrapper>
      <NumberField
        source="rating"
        options={{ style: 'percent', maximumFractionDigits: 1 }}
      />
    </RecordWrapper>
  ),
  name: 'NumberField - Percent',
}

/**
 * With thousands separator
 */
export const NumberFieldThousands: StoryObj<typeof NumberField> = {
  render: () => (
    <RecordWrapper>
      <NumberField source="views" />
    </RecordWrapper>
  ),
  name: 'NumberField - Thousands',
}

/**
 * German locale formatting
 */
export const NumberFieldLocale: StoryObj<typeof NumberField> = {
  render: () => (
    <RecordWrapper>
      <NumberField
        source="salary"
        locales="de-DE"
        options={{ style: 'currency', currency: 'EUR' }}
      />
    </RecordWrapper>
  ),
  name: 'NumberField - German Locale',
}

/**
 * NumberField with label
 */
export const NumberFieldWithLabel: StoryObj<typeof NumberField> = {
  render: () => (
    <RecordWrapper>
      <NumberField
        source="salary"
        label="Annual Salary"
        options={{ style: 'currency', currency: 'USD' }}
      />
    </RecordWrapper>
  ),
  name: 'NumberField - With Label',
}

// =============================================================================
// DateField Stories
// =============================================================================

/**
 * Basic date display
 */
export const DateFieldBasic: StoryObj<typeof DateField> = {
  render: () => (
    <RecordWrapper>
      <DateField source="createdAt" />
    </RecordWrapper>
  ),
  name: 'DateField - Basic',
}

/**
 * With time display
 */
export const DateFieldWithTime: StoryObj<typeof DateField> = {
  render: () => (
    <RecordWrapper>
      <DateField source="createdAt" showTime />
    </RecordWrapper>
  ),
  name: 'DateField - With Time',
}

/**
 * Long date format
 */
export const DateFieldLong: StoryObj<typeof DateField> = {
  render: () => (
    <RecordWrapper>
      <DateField
        source="createdAt"
        options={{ dateStyle: 'long' }}
      />
    </RecordWrapper>
  ),
  name: 'DateField - Long Format',
}

/**
 * Full date and time format
 */
export const DateFieldFull: StoryObj<typeof DateField> = {
  render: () => (
    <RecordWrapper>
      <DateField
        source="createdAt"
        options={{ dateStyle: 'full', timeStyle: 'short' }}
      />
    </RecordWrapper>
  ),
  name: 'DateField - Full Format',
}

/**
 * German locale formatting
 */
export const DateFieldLocale: StoryObj<typeof DateField> = {
  render: () => (
    <RecordWrapper>
      <DateField source="createdAt" locales="de-DE" />
    </RecordWrapper>
  ),
  name: 'DateField - German Locale',
}

/**
 * DateField with label
 */
export const DateFieldWithLabel: StoryObj<typeof DateField> = {
  render: () => (
    <RecordWrapper>
      <DateField source="createdAt" label="Created At" showTime />
    </RecordWrapper>
  ),
  name: 'DateField - With Label',
}

// =============================================================================
// BooleanField Stories
// =============================================================================

/**
 * True value with check icon
 */
export const BooleanFieldTrue: StoryObj<typeof BooleanField> = {
  render: () => (
    <RecordWrapper>
      <BooleanField source="active" />
    </RecordWrapper>
  ),
  name: 'BooleanField - True',
}

/**
 * False value with X icon
 */
export const BooleanFieldFalse: StoryObj<typeof BooleanField> = {
  render: () => (
    <RecordWrapper>
      <BooleanField source="verified" />
    </RecordWrapper>
  ),
  name: 'BooleanField - False',
}

/**
 * Custom text labels instead of icons
 */
export const BooleanFieldLabels: StoryObj<typeof BooleanField> = {
  render: () => (
    <RecordWrapper>
      <div className="space-y-2">
        <BooleanField
          source="active"
          valueLabelTrue="Yes"
          valueLabelFalse="No"
        />
        <BooleanField
          source="verified"
          valueLabelTrue="Verified"
          valueLabelFalse="Not Verified"
        />
      </div>
    </RecordWrapper>
  ),
  name: 'BooleanField - Custom Labels',
}

/**
 * Custom icon colors
 */
export const BooleanFieldColors: StoryObj<typeof BooleanField> = {
  render: () => (
    <RecordWrapper>
      <div className="space-x-4">
        <BooleanField
          source="active"
          trueIconColor="text-blue-500"
          falseIconColor="text-gray-400"
        />
        <BooleanField
          source="verified"
          trueIconColor="text-emerald-600"
          falseIconColor="text-amber-500"
        />
      </div>
    </RecordWrapper>
  ),
  name: 'BooleanField - Custom Colors',
}

/**
 * BooleanField with label
 */
export const BooleanFieldWithLabel: StoryObj<typeof BooleanField> = {
  render: () => (
    <RecordWrapper>
      <div className="space-y-4">
        <BooleanField source="active" label="Active Status" />
        <BooleanField source="verified" label="Verified" />
      </div>
    </RecordWrapper>
  ),
  name: 'BooleanField - With Label',
}

/**
 * Truthy number value (1)
 */
export const BooleanFieldNumber: StoryObj<typeof BooleanField> = {
  render: () => (
    <RecordWrapper>
      <BooleanField source="premium" label="Premium Member" />
    </RecordWrapper>
  ),
  name: 'BooleanField - Number Value',
}

// =============================================================================
// EmailField Stories
// =============================================================================

/**
 * Basic clickable email
 */
export const EmailFieldBasic: StoryObj<typeof EmailField> = {
  render: () => (
    <RecordWrapper>
      <EmailField source="email" />
    </RecordWrapper>
  ),
  name: 'EmailField - Basic',
}

/**
 * EmailField with label
 */
export const EmailFieldWithLabel: StoryObj<typeof EmailField> = {
  render: () => (
    <RecordWrapper>
      <EmailField source="email" label="Email Address" />
    </RecordWrapper>
  ),
  name: 'EmailField - With Label',
}

/**
 * Custom styling
 */
export const EmailFieldStyled: StoryObj<typeof EmailField> = {
  render: () => (
    <RecordWrapper>
      <EmailField
        source="email"
        className="text-blue-600 font-medium"
      />
    </RecordWrapper>
  ),
  name: 'EmailField - Styled',
}

/**
 * Empty email with fallback text
 */
export const EmailFieldEmpty: StoryObj<typeof EmailField> = {
  render: () => (
    <RecordWrapper>
      <EmailField source="nonexistent" emptyText="No email provided" />
    </RecordWrapper>
  ),
  name: 'EmailField - Empty',
}

// =============================================================================
// UrlField Stories
// =============================================================================

/**
 * Basic clickable URL
 */
export const UrlFieldBasic: StoryObj<typeof UrlField> = {
  render: () => (
    <RecordWrapper>
      <UrlField source="website" />
    </RecordWrapper>
  ),
  name: 'UrlField - Basic',
}

/**
 * With custom link text
 */
export const UrlFieldCustomText: StoryObj<typeof UrlField> = {
  render: () => (
    <RecordWrapper>
      <UrlField source="website" text="Visit Website" />
    </RecordWrapper>
  ),
  name: 'UrlField - Custom Text',
}

/**
 * Truncated to domain only
 */
export const UrlFieldTruncated: StoryObj<typeof UrlField> = {
  render: () => (
    <RecordWrapper>
      <UrlField source="website" truncateUrl />
    </RecordWrapper>
  ),
  name: 'UrlField - Truncated',
}

/**
 * Opens in same tab
 */
export const UrlFieldSameTab: StoryObj<typeof UrlField> = {
  render: () => (
    <RecordWrapper>
      <UrlField source="website" target="_self" />
    </RecordWrapper>
  ),
  name: 'UrlField - Same Tab',
}

/**
 * UrlField with label
 */
export const UrlFieldWithLabel: StoryObj<typeof UrlField> = {
  render: () => (
    <RecordWrapper>
      <UrlField source="website" label="Website" truncateUrl />
    </RecordWrapper>
  ),
  name: 'UrlField - With Label',
}

// =============================================================================
// ImageField Stories
// =============================================================================

/**
 * Basic single image
 */
export const ImageFieldBasic: StoryObj<typeof ImageField> = {
  render: () => (
    <RecordWrapper>
      <ImageField source="avatar" />
    </RecordWrapper>
  ),
  name: 'ImageField - Basic',
}

/**
 * With custom dimensions
 */
export const ImageFieldSized: StoryObj<typeof ImageField> = {
  render: () => (
    <RecordWrapper>
      <ImageField
        source="avatar"
        sx={{ width: 100, height: 100, borderRadius: '50%' }}
      />
    </RecordWrapper>
  ),
  name: 'ImageField - Sized',
}

/**
 * With custom alt text
 */
export const ImageFieldAlt: StoryObj<typeof ImageField> = {
  render: () => (
    <RecordWrapper>
      <ImageField source="avatar" title="name" />
    </RecordWrapper>
  ),
  name: 'ImageField - Alt from Field',
}

/**
 * Array of images
 */
export const ImageFieldArray: StoryObj<typeof ImageField> = {
  render: () => (
    <RecordWrapper>
      <ImageField
        source="photos"
        src="src"
        title="caption"
        sx={{ width: 80, height: 80, borderRadius: 8 }}
      />
    </RecordWrapper>
  ),
  name: 'ImageField - Array',
}

/**
 * ImageField with label
 */
export const ImageFieldWithLabel: StoryObj<typeof ImageField> = {
  render: () => (
    <RecordWrapper>
      <ImageField
        source="avatar"
        label="Profile Picture"
        sx={{ width: 80, height: 80, borderRadius: '50%' }}
      />
    </RecordWrapper>
  ),
  name: 'ImageField - With Label',
}

/**
 * Empty image with fallback
 */
export const ImageFieldEmpty: StoryObj<typeof ImageField> = {
  render: () => (
    <RecordWrapper>
      <ImageField source="nonexistent" emptyText="No image available" />
    </RecordWrapper>
  ),
  name: 'ImageField - Empty',
}

// =============================================================================
// ChipField Stories
// =============================================================================

/**
 * Basic chip/badge display
 */
export const ChipFieldBasic: StoryObj<typeof ChipField> = {
  render: () => (
    <RecordWrapper>
      <ChipField source="status" />
    </RecordWrapper>
  ),
  name: 'ChipField - Basic',
}

/**
 * Secondary variant
 */
export const ChipFieldSecondary: StoryObj<typeof ChipField> = {
  render: () => (
    <RecordWrapper>
      <ChipField source="role" variant="secondary" />
    </RecordWrapper>
  ),
  name: 'ChipField - Secondary',
}

/**
 * Destructive variant
 */
export const ChipFieldDestructive: StoryObj<typeof ChipField> = {
  render: () => (
    <RecordWrapper>
      <ChipField source="priority" variant="destructive" />
    </RecordWrapper>
  ),
  name: 'ChipField - Destructive',
}

/**
 * Outline variant
 */
export const ChipFieldOutline: StoryObj<typeof ChipField> = {
  render: () => (
    <RecordWrapper>
      <ChipField source="status" variant="outline" />
    </RecordWrapper>
  ),
  name: 'ChipField - Outline',
}

/**
 * All sizes
 */
export const ChipFieldSizes: StoryObj<typeof ChipField> = {
  render: () => (
    <RecordWrapper>
      <div className="flex items-center gap-2">
        <ChipField source="status" size="sm" />
        <ChipField source="status" size="default" />
        <ChipField source="status" size="lg" />
      </div>
    </RecordWrapper>
  ),
  name: 'ChipField - Sizes',
}

/**
 * All variants together
 */
export const ChipFieldAllVariants: StoryObj<typeof ChipField> = {
  render: () => (
    <RecordWrapper>
      <div className="flex flex-wrap gap-2">
        <ChipField source="status" variant="default" />
        <ChipField source="role" variant="secondary" />
        <ChipField source="priority" variant="destructive" />
        <ChipField source="status" variant="outline" />
      </div>
    </RecordWrapper>
  ),
  name: 'ChipField - All Variants',
}

/**
 * ChipField with label
 */
export const ChipFieldWithLabel: StoryObj<typeof ChipField> = {
  render: () => (
    <RecordWrapper>
      <ChipField source="status" label="Status" variant="secondary" />
    </RecordWrapper>
  ),
  name: 'ChipField - With Label',
}

// =============================================================================
// FunctionField Stories
// =============================================================================

/**
 * Combine multiple fields
 */
export const FunctionFieldCombine: StoryObj<typeof FunctionField> = {
  render: () => (
    <RecordWrapper>
      <FunctionField
        render={(record) => `${record?.firstName} ${record?.lastName}`}
      />
    </RecordWrapper>
  ),
  name: 'FunctionField - Combine Fields',
}

/**
 * Custom JSX rendering
 */
export const FunctionFieldJSX: StoryObj<typeof FunctionField> = {
  render: () => (
    <RecordWrapper>
      <FunctionField
        render={(record) => (
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-medium">{String(record?.name ?? '')}</span>
          </span>
        )}
      />
    </RecordWrapper>
  ),
  name: 'FunctionField - Custom JSX',
}

/**
 * Conditional rendering
 */
export const FunctionFieldConditional: StoryObj<typeof FunctionField> = {
  render: () => (
    <RecordWrapper>
      <FunctionField
        render={(record) => (
          <span className={record?.active ? 'text-green-600' : 'text-red-600'}>
            {record?.active ? 'Active' : 'Inactive'}
          </span>
        )}
      />
    </RecordWrapper>
  ),
  name: 'FunctionField - Conditional',
}

/**
 * Computed value
 */
export const FunctionFieldComputed: StoryObj<typeof FunctionField> = {
  render: () => (
    <RecordWrapper>
      <FunctionField
        render={(record) => {
          const views = Number(record?.views ?? 0)
          if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
          if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`
          return `${views} views`
        }}
      />
    </RecordWrapper>
  ),
  name: 'FunctionField - Computed',
}

/**
 * FunctionField with label
 */
export const FunctionFieldWithLabel: StoryObj<typeof FunctionField> = {
  render: () => (
    <RecordWrapper>
      <FunctionField
        label="Full Name"
        render={(record) => `${record?.firstName} ${record?.lastName}`}
      />
    </RecordWrapper>
  ),
  name: 'FunctionField - With Label',
}

/**
 * With empty text fallback
 */
export const FunctionFieldEmpty: StoryObj<typeof FunctionField> = {
  render: () => (
    <RecordWrapper>
      <FunctionField
        render={(record) => record?.nonexistent as string | undefined}
        emptyText="Not available"
      />
    </RecordWrapper>
  ),
  name: 'FunctionField - Empty',
}

// =============================================================================
// ReferenceField Stories
// =============================================================================

/**
 * Basic reference to another resource
 */
export const ReferenceFieldBasic: StoryObj<typeof ReferenceField> = {
  render: () => (
    <FullWrapper>
      <ReferenceField source="authorId" reference="users">
        <TextField source="name" />
      </ReferenceField>
    </FullWrapper>
  ),
  name: 'ReferenceField - Basic',
}

/**
 * With link to show page
 */
export const ReferenceFieldWithLink: StoryObj<typeof ReferenceField> = {
  render: () => (
    <FullWrapper>
      <ReferenceField source="authorId" reference="users" link="show">
        <TextField source="name" />
      </ReferenceField>
    </FullWrapper>
  ),
  name: 'ReferenceField - With Link',
}

/**
 * With multiple child fields
 */
export const ReferenceFieldMultiple: StoryObj<typeof ReferenceField> = {
  render: () => (
    <FullWrapper>
      <ReferenceField source="authorId" reference="users">
        <div className="flex flex-col">
          <TextField source="name" className="font-medium" />
          <TextField source="role" className="text-sm text-muted-foreground" />
        </div>
      </ReferenceField>
    </FullWrapper>
  ),
  name: 'ReferenceField - Multiple Children',
}

/**
 * With chip display
 */
export const ReferenceFieldChip: StoryObj<typeof ReferenceField> = {
  render: () => (
    <FullWrapper>
      <ReferenceField source="authorId" reference="users">
        <ChipField source="role" variant="secondary" />
      </ReferenceField>
    </FullWrapper>
  ),
  name: 'ReferenceField - With Chip',
}

/**
 * Empty reference with fallback
 */
export const ReferenceFieldEmpty: StoryObj<typeof ReferenceField> = {
  render: () => (
    <FullWrapper>
      <ReferenceField source="nonexistent" reference="users" emptyText="No author">
        <TextField source="name" />
      </ReferenceField>
    </FullWrapper>
  ),
  name: 'ReferenceField - Empty',
}

// =============================================================================
// Combined Showcase
// =============================================================================

/**
 * Showcase of all field components together
 */
export const AllFieldsShowcase: StoryObj = {
  render: () => (
    <FullWrapper>
      <div className="space-y-6 p-4">
        <h2 className="text-xl font-bold">Field Components Showcase</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Text & Data</h3>
            <TextField source="name" label="Name" />
            <NumberField source="salary" label="Salary" options={{ style: 'currency', currency: 'USD' }} />
            <DateField source="createdAt" label="Created" showTime />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Boolean & Status</h3>
            <BooleanField source="active" label="Active" />
            <BooleanField source="verified" label="Verified" valueLabelTrue="Yes" valueLabelFalse="No" />
            <ChipField source="status" label="Status" variant="secondary" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Links & Media</h3>
            <EmailField source="email" label="Email" />
            <UrlField source="website" label="Website" truncateUrl />
            <ImageField source="avatar" label="Avatar" sx={{ width: 60, height: 60, borderRadius: '50%' }} />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Custom & References</h3>
            <FunctionField
              label="Full Name"
              render={(record) => `${record?.firstName} ${record?.lastName}`}
            />
            <ReferenceField source="authorId" reference="users" label="Author">
              <TextField source="name" />
            </ReferenceField>
          </div>
        </div>
      </div>
    </FullWrapper>
  ),
  name: 'All Fields - Showcase',
}
