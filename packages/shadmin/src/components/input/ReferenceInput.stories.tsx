import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { AutocompleteInput } from './AutocompleteInput'
import { ReferenceInput } from './ReferenceInput'
import { SelectInput } from './SelectInput'
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

// Mock data for authors
const mockAuthors: RaRecord[] = [
  { id: 1, name: 'Jane Austen', email: 'jane@example.com' },
  { id: 2, name: 'Charles Dickens', email: 'charles@example.com' },
  { id: 3, name: 'Mark Twain', email: 'mark@example.com' },
  { id: 4, name: 'Virginia Woolf', email: 'virginia@example.com' },
  { id: 5, name: 'Ernest Hemingway', email: 'ernest@example.com' },
]

// Mock data for categories
const mockCategories: RaRecord[] = [
  { id: 1, name: 'Fiction', isActive: true },
  { id: 2, name: 'Non-Fiction', isActive: true },
  { id: 3, name: 'Science', isActive: true },
  { id: 4, name: 'History', isActive: false },
  { id: 5, name: 'Biography', isActive: true },
]

// Mock DataProvider
const mockDataProvider: DataProvider = {
  getList: async <RecordType extends RaRecord = RaRecord>(resource: string, params: { pagination?: { page?: number; perPage?: number }; sort?: { field: string; order: 'ASC' | 'DESC' }; filter?: Record<string, unknown> }) => {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

    let data: RaRecord[] = []

    if (resource === 'authors') {
      data = mockAuthors
    } else if (resource === 'categories') {
      data = params?.filter?.isActive
        ? mockCategories.filter((c) => c.isActive)
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

const meta: Meta<typeof ReferenceInput> = {
  title: 'Components/Inputs/ReferenceInput',
  component: ReferenceInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A wrapper component that fetches choices from a referenced resource using useGetList and provides them to child input components (SelectInput or AutocompleteInput).',
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
      description: 'The field name that will hold the reference ID',
    },
    reference: {
      control: 'text',
      description: 'The referenced resource name to fetch choices from',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
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
 * Basic reference input with default AutocompleteInput
 */
export const Default: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
  },
}

/**
 * Reference input with SelectInput child
 */
export const WithSelectInput: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
    children: <SelectInput source="authorId" label="Author" choices={[]} />,
  },
}

/**
 * Reference input with AutocompleteInput child
 */
export const WithAutocompleteInput: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
    children: <AutocompleteInput source="authorId" label="Author" choices={[]} />,
  },
}

/**
 * Reference input with custom optionText function
 */
export const CustomOptionText: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
    optionText: (record: RaRecord) => `${record.name} (${record.email})`,
  },
}

/**
 * Reference input with filter
 */
export const WithFilter: Story = {
  args: {
    source: 'categoryId',
    reference: 'categories',
    label: 'Category',
    filter: { isActive: true },
    helperText: 'Only active categories are shown',
  },
}

/**
 * Reference input with custom sort
 */
export const WithSort: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
    sort: { field: 'name', order: 'ASC' },
    helperText: 'Sorted by name A-Z',
  },
}

/**
 * Reference input with custom perPage
 */
export const WithPerPage: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
    perPage: 3,
    helperText: 'Limited to 3 choices',
  },
}

/**
 * Reference input with empty text placeholder
 */
export const WithEmptyText: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
    emptyText: 'Select an author...',
  },
}

/**
 * Reference input with helper text
 */
export const WithHelperText: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
    helperText: 'Select the author of this book',
  },
}

/**
 * Disabled reference input
 */
export const Disabled: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
    disabled: true,
  },
}

/**
 * Reference input with pre-selected value
 */
export const WithPreselectedValue: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
  },
  decorators: [
    (Story) => (
      <ContextWrapper defaultValues={{ authorId: 2 }}>
        <Story />
      </ContextWrapper>
    ),
  ],
}

/**
 * Multiple reference inputs in a form
 */
export const MultipleReferences: Story = {
  args: {
    source: 'authorId',
    reference: 'authors',
    label: 'Author',
  },
  render: () => (
    <ContextWrapper>
      <div className="space-y-4">
        <ReferenceInput
          source="authorId"
          reference="authors"
          label="Author"
        />
        <ReferenceInput
          source="categoryId"
          reference="categories"
          label="Category"
          filter={{ isActive: true }}
        />
      </div>
    </ContextWrapper>
  ),
}
