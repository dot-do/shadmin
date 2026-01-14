import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { AutocompleteArrayInput } from './AutocompleteArrayInput'
import { CheckboxGroupInput } from './CheckboxGroupInput'
import { ReferenceArrayInput } from './ReferenceArrayInput'
import { SelectArrayInput } from './SelectArrayInput'
import { DataProviderContext } from '../../contexts/DataProviderContext'
import { FormContextProvider } from '../../contexts/FormContext'

import type { DataProvider, RaRecord, GetListResult, GetOneResult, GetManyResult, GetManyReferenceResult, CreateResult, UpdateResult, UpdateManyResult, DeleteResult, DeleteManyResult } from '../../types'
import type { Meta, StoryObj } from '@storybook/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

// Mock data for tags
const mockTags: RaRecord[] = [
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: 'React' },
  { id: 4, name: 'Vue' },
  { id: 5, name: 'Angular' },
  { id: 6, name: 'Node.js' },
  { id: 7, name: 'Python' },
  { id: 8, name: 'Go' },
]

// Mock data for categories
const mockCategories: RaRecord[] = [
  { id: 1, name: 'Frontend', active: true },
  { id: 2, name: 'Backend', active: true },
  { id: 3, name: 'DevOps', active: true },
  { id: 4, name: 'Mobile', active: false },
  { id: 5, name: 'Database', active: true },
]

// Mock DataProvider
const mockDataProvider: DataProvider = {
  getList: async <RecordType extends RaRecord = RaRecord>(resource: string, params: { pagination?: { page?: number; perPage?: number }; sort?: { field: string; order: 'ASC' | 'DESC' }; filter?: Record<string, unknown> }) => {
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay

    let data: RaRecord[] = []

    if (resource === 'tags') {
      data = mockTags
    } else if (resource === 'categories') {
      data = params?.filter?.active
        ? mockCategories.filter((c) => c.active)
        : mockCategories
    }

    // Apply sort if specified
    if (params?.sort?.field) {
      const { field, order } = params.sort
      data = [...data].sort((a, b) => {
        const aVal = a[field]
        const bVal = b[field]
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return order === 'ASC'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }
        return 0
      })
    }

    // Apply pagination
    const perPage = params?.pagination?.perPage ?? 25
    const page = params?.pagination?.page ?? 1
    const startIndex = (page - 1) * perPage
    const paginatedData = data.slice(startIndex, startIndex + perPage)

    return { data: paginatedData, total: data.length } as GetListResult<RecordType>
  },
  getOne: async <RecordType extends RaRecord = RaRecord>() => ({ data: { id: 0 } } as GetOneResult<RecordType>),
  getMany: async <RecordType extends RaRecord = RaRecord>() => ({ data: [] } as GetManyResult<RecordType>),
  getManyReference: async <RecordType extends RaRecord = RaRecord>() => ({ data: [], total: 0 } as GetManyReferenceResult<RecordType>),
  create: async <RecordType extends RaRecord = RaRecord>() => ({ data: { id: 0 } } as CreateResult<RecordType>),
  update: async <RecordType extends RaRecord = RaRecord>() => ({ data: { id: 0 } } as UpdateResult<RecordType>),
  updateMany: async <RecordType extends RaRecord = RaRecord>() => ({ data: [] } as UpdateManyResult<RecordType>),
  delete: async <RecordType extends RaRecord = RaRecord>() => ({ data: { id: 0 } } as DeleteResult<RecordType>),
  deleteMany: async <RecordType extends RaRecord = RaRecord>() => ({ data: [] } as DeleteManyResult<RecordType>),
}

/**
 * Wrapper component that provides all required contexts for stories
 */
function ContextWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode
  defaultValues?: Record<string, unknown>
}) {
  const form = useForm({ defaultValues })
  return (
    <QueryClientProvider client={queryClient}>
      <DataProviderContext.Provider value={mockDataProvider}>
        <FormContextProvider {...form} resource="stories">
          <form className="w-full max-w-md space-y-6">{children}</form>
        </FormContextProvider>
      </DataProviderContext.Provider>
    </QueryClientProvider>
  )
}

const meta: Meta<typeof ReferenceArrayInput> = {
  title: 'Components/Inputs/ReferenceArrayInput',
  component: ReferenceArrayInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A wrapper component for array inputs that fetches choices from a referenced resource. Works with many-to-many relationships, storing an array of IDs.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ContextWrapper>
        <Story />
      </ContextWrapper>
    ),
  ],
  argTypes: {
    source: {
      control: 'text',
      description: 'The field name that will hold the array of reference IDs',
    },
    reference: {
      control: 'text',
      description: 'The referenced resource name to fetch choices from',
    },
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    perPage: {
      control: 'number',
      description: 'Number of choices to fetch per page',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic reference array input with SelectArrayInput
 */
export const Default: Story = {
  args: {
    source: 'tag_ids',
    reference: 'tags',
    children: <SelectArrayInput source="tag_ids" label="Tags" choices={[]} />,
  },
}

/**
 * Reference array input with CheckboxGroupInput
 */
export const WithCheckboxGroup: Story = {
  args: {
    source: 'tag_ids',
    reference: 'tags',
    children: <CheckboxGroupInput source="tag_ids" label="Tags" choices={[]} />,
  },
}

/**
 * Reference array input with AutocompleteArrayInput
 */
export const WithAutocompleteArray: Story = {
  args: {
    source: 'tag_ids',
    reference: 'tags',
    children: <AutocompleteArrayInput source="tag_ids" label="Tags" choices={[]} />,
  },
}

/**
 * Reference array input with filter
 */
export const WithFilter: Story = {
  args: {
    source: 'category_ids',
    reference: 'categories',
    filter: { active: true },
    children: (
      <SelectArrayInput
        source="category_ids"
        label="Categories"
        choices={[]}
        helperText="Only active categories are shown"
      />
    ),
  },
}

/**
 * Reference array input with custom sort
 */
export const WithSort: Story = {
  args: {
    source: 'tag_ids',
    reference: 'tags',
    sort: { field: 'name', order: 'ASC' },
    children: (
      <SelectArrayInput
        source="tag_ids"
        label="Tags"
        choices={[]}
        helperText="Sorted alphabetically"
      />
    ),
  },
}

/**
 * Reference array input with custom perPage
 */
export const WithPerPage: Story = {
  args: {
    source: 'tag_ids',
    reference: 'tags',
    perPage: 5,
    children: (
      <SelectArrayInput
        source="tag_ids"
        label="Tags"
        choices={[]}
        helperText="Limited to 5 choices"
      />
    ),
  },
}

/**
 * Disabled reference array input
 */
export const Disabled: Story = {
  args: {
    source: 'tag_ids',
    reference: 'tags',
    disabled: true,
    children: <SelectArrayInput source="tag_ids" label="Tags" choices={[]} />,
  },
  decorators: [
    (Story) => (
      <ContextWrapper defaultValues={{ tag_ids: [1, 3] }}>
        <Story />
      </ContextWrapper>
    ),
  ],
}

/**
 * Reference array input with pre-selected values
 */
export const WithPreselectedValues: Story = {
  args: {
    source: 'tag_ids',
    reference: 'tags',
    children: (
      <SelectArrayInput
        source="tag_ids"
        label="Tags"
        choices={[]}
        helperText="Some tags are pre-selected"
      />
    ),
  },
  decorators: [
    (Story) => (
      <ContextWrapper defaultValues={{ tag_ids: [1, 2, 3] }}>
        <Story />
      </ContextWrapper>
    ),
  ],
}

/**
 * Horizontal checkbox group layout
 */
export const HorizontalCheckboxGroup: Story = {
  args: {
    source: 'tag_ids',
    reference: 'tags',
    children: <CheckboxGroupInput source="tag_ids" label="Tags" choices={[]} row />,
  },
}

/**
 * Multiple reference array inputs in a form
 */
export const MultipleReferences: Story = {
  args: {
    source: 'tag_ids',
    reference: 'tags',
    children: <SelectArrayInput source="tag_ids" label="Tags" choices={[]} />,
  },
  render: () => (
    <ContextWrapper>
      <div className="space-y-4">
        <ReferenceArrayInput
          source="tag_ids"
          reference="tags"
        >
          <SelectArrayInput source="tag_ids" label="Tags" choices={[]} />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          source="category_ids"
          reference="categories"
          filter={{ active: true }}
        >
          <CheckboxGroupInput
            source="category_ids"
            label="Categories"
            choices={[]}
          />
        </ReferenceArrayInput>
      </div>
    </ContextWrapper>
  ),
}
