/**
 * ReferenceArrayInput Component Tests
 * Following TDD: RED phase - write failing tests first
 *
 * ReferenceArrayInput is like ReferenceInput but for array fields (many-to-many relationships).
 * It fetches choices from a referenced resource using useGetList and provides them to child components.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { CheckboxGroupInput } from './CheckboxGroupInput'
import { ReferenceArrayInput } from './ReferenceArrayInput'
import { SelectArrayInput } from './SelectArrayInput'
import { DataProviderContext } from '../../contexts/DataProviderContext'
import { FormContextProvider } from '../../contexts/FormContext'

import type { DataProvider } from '../../types'


// Mock data provider
const createMockDataProvider = (overrides: Partial<DataProvider> = {}): DataProvider => ({
  getList: vi.fn().mockResolvedValue({ data: [], total: 0 }),
  getOne: vi.fn().mockResolvedValue({ data: {} }),
  getMany: vi.fn().mockResolvedValue({ data: [] }),
  getManyReference: vi.fn().mockResolvedValue({ data: [], total: 0 }),
  create: vi.fn().mockResolvedValue({ data: {} }),
  update: vi.fn().mockResolvedValue({ data: {} }),
  updateMany: vi.fn().mockResolvedValue({ data: [] }),
  delete: vi.fn().mockResolvedValue({ data: {} }),
  deleteMany: vi.fn().mockResolvedValue({ data: [] }),
  ...overrides,
})

// Helper component to wrap ReferenceArrayInput with all necessary contexts
interface TestFormProps {
  children: React.ReactNode
  defaultValues?: Record<string, unknown>
  onSubmit?: (data: Record<string, unknown>) => void
  dataProvider?: DataProvider
}

function TestForm({
  children,
  defaultValues = {},
  onSubmit = vi.fn(),
  dataProvider = createMockDataProvider(),
}: TestFormProps) {
  const form = useForm({ defaultValues })
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <DataProviderContext.Provider value={dataProvider}>
        <FormContextProvider {...form} save={onSubmit}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {children}
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      </DataProviderContext.Provider>
    </QueryClientProvider>
  )
}

// Sample reference data
const mockTags = [
  { id: 'tech', name: 'Technology' },
  { id: 'news', name: 'News' },
  { id: 'sports', name: 'Sports' },
  { id: 'music', name: 'Music' },
]

const mockCategories = [
  { id: 1, title: 'Category A' },
  { id: 2, title: 'Category B' },
  { id: 3, title: 'Category C' },
]

describe('<ReferenceArrayInput />', () => {
  let mockDataProvider: DataProvider

  beforeEach(() => {
    mockDataProvider = createMockDataProvider({
      getList: vi.fn().mockResolvedValue({ data: mockTags, total: mockTags.length }),
    })
  })

  describe('basic rendering', () => {
    it('renders children with choices from referenced resource', async () => {
      render(
        <TestForm dataProvider={mockDataProvider}>
          <ReferenceArrayInput source="tag_ids" reference="tags">
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(mockDataProvider.getList).toHaveBeenCalledWith(
          'tags',
          expect.objectContaining({
            pagination: expect.any(Object),
            sort: expect.any(Object),
            filter: expect.any(Object),
          })
        )
      })

      // Should render options from the referenced resource
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Technology' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'News' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Sports' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Music' })).toBeInTheDocument()
      })
    })

    it('passes fetched choices to child component', async () => {
      render(
        <TestForm dataProvider={mockDataProvider}>
          <ReferenceArrayInput source="tag_ids" reference="tags">
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options).toHaveLength(4)
      })
    })

    it('shows loading state while fetching data', () => {
      // Delay the response to observe loading state
      const slowDataProvider = createMockDataProvider({
        getList: vi.fn().mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve({ data: mockTags, total: 4 }), 1000))
        ),
      })

      render(
        <TestForm dataProvider={slowDataProvider}>
          <ReferenceArrayInput source="tag_ids" reference="tags">
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      // Child should still render with empty choices during loading
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
  })

  describe('filtering', () => {
    it('supports filter prop to narrow down choices', async () => {
      render(
        <TestForm dataProvider={mockDataProvider}>
          <ReferenceArrayInput source="tag_ids" reference="tags" filter={{ active: true }}>
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(mockDataProvider.getList).toHaveBeenCalledWith(
          'tags',
          expect.objectContaining({
            filter: { active: true },
          })
        )
      })
    })
  })

  describe('sorting', () => {
    it('supports sort prop to order choices', async () => {
      render(
        <TestForm dataProvider={mockDataProvider}>
          <ReferenceArrayInput
            source="tag_ids"
            reference="tags"
            sort={{ field: 'name', order: 'DESC' }}
          >
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(mockDataProvider.getList).toHaveBeenCalledWith(
          'tags',
          expect.objectContaining({
            sort: { field: 'name', order: 'DESC' },
          })
        )
      })
    })
  })

  describe('pagination', () => {
    it('supports perPage prop to limit fetched records', async () => {
      render(
        <TestForm dataProvider={mockDataProvider}>
          <ReferenceArrayInput source="tag_ids" reference="tags" perPage={50}>
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(mockDataProvider.getList).toHaveBeenCalledWith(
          'tags',
          expect.objectContaining({
            pagination: { page: 1, perPage: 50 },
          })
        )
      })
    })

    it('uses default perPage of 25 when not specified', async () => {
      render(
        <TestForm dataProvider={mockDataProvider}>
          <ReferenceArrayInput source="tag_ids" reference="tags">
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(mockDataProvider.getList).toHaveBeenCalledWith(
          'tags',
          expect.objectContaining({
            pagination: { page: 1, perPage: 25 },
          })
        )
      })
    })
  })

  describe('form integration', () => {
    it('stores array of selected IDs in form field', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm dataProvider={mockDataProvider} onSubmit={onSubmit}>
          <ReferenceArrayInput source="tag_ids" reference="tags">
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Technology' })).toBeInTheDocument()
      })

      // Select multiple options
      await user.click(screen.getByRole('option', { name: 'Technology' }))
      await user.click(screen.getByRole('option', { name: 'News' }))

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            tag_ids: expect.arrayContaining(['tech', 'news']),
          }),
          expect.anything()
        )
      })
    })

    it('handles defaultValue array from form context', async () => {
      render(
        <TestForm dataProvider={mockDataProvider} defaultValues={{ tag_ids: ['tech', 'sports'] }}>
          <ReferenceArrayInput source="tag_ids" reference="tags">
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Technology' })).toBeInTheDocument()
      })

      const techOption = screen.getByRole('option', { name: 'Technology' })
      const sportsOption = screen.getByRole('option', { name: 'Sports' })
      const newsOption = screen.getByRole('option', { name: 'News' })

      expect(techOption).toHaveAttribute('aria-selected', 'true')
      expect(sportsOption).toHaveAttribute('aria-selected', 'true')
      expect(newsOption).toHaveAttribute('aria-selected', 'false')
    })

    it('allows adding and removing selections', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm
          dataProvider={mockDataProvider}
          defaultValues={{ tag_ids: ['tech'] }}
          onSubmit={onSubmit}
        >
          <ReferenceArrayInput source="tag_ids" reference="tags">
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Technology' })).toBeInTheDocument()
      })

      // Add another selection
      await user.click(screen.getByRole('option', { name: 'Music' }))

      // Remove original selection
      await user.click(screen.getByRole('option', { name: 'Technology' }))

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ tag_ids: ['music'] }),
          expect.anything()
        )
      })
    })
  })

  describe('custom optionValue and optionText', () => {
    it('supports custom optionText prop', async () => {
      const categoriesDataProvider = createMockDataProvider({
        getList: vi.fn().mockResolvedValue({ data: mockCategories, total: mockCategories.length }),
      })

      render(
        <TestForm dataProvider={categoriesDataProvider}>
          <ReferenceArrayInput source="category_ids" reference="categories">
            <SelectArrayInput source="category_ids" choices={[]} optionText="title" />
          </ReferenceArrayInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Category A' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Category B' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Category C' })).toBeInTheDocument()
      })
    })
  })

  describe('error handling', () => {
    it('handles data provider errors gracefully', async () => {
      const errorDataProvider = createMockDataProvider({
        getList: vi.fn().mockRejectedValue(new Error('Network error')),
      })

      render(
        <TestForm dataProvider={errorDataProvider}>
          <ReferenceArrayInput source="tag_ids" reference="tags">
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      // Should still render without crashing
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      // Options should be empty on error
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
    })
  })

  describe('disabled state', () => {
    it('passes disabled prop to child component', async () => {
      render(
        <TestForm dataProvider={mockDataProvider}>
          <ReferenceArrayInput source="tag_ids" reference="tags" disabled>
            <SelectArrayInput source="tag_ids" choices={[]} />
          </ReferenceArrayInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toHaveAttribute('aria-disabled', 'true')
      })
    })
  })
})

describe('<ReferenceArrayInput /> with CheckboxGroupInput', () => {
  let mockDataProvider: DataProvider

  beforeEach(() => {
    mockDataProvider = createMockDataProvider({
      getList: vi.fn().mockResolvedValue({ data: mockTags, total: mockTags.length }),
    })
  })

  it('renders checkboxes with choices from referenced resource', async () => {
    render(
      <TestForm dataProvider={mockDataProvider}>
        <ReferenceArrayInput source="tag_ids" reference="tags">
          <CheckboxGroupInput source="tag_ids" choices={[]} />
        </ReferenceArrayInput>
      </TestForm>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Technology')).toBeInTheDocument()
      expect(screen.getByLabelText('News')).toBeInTheDocument()
      expect(screen.getByLabelText('Sports')).toBeInTheDocument()
      expect(screen.getByLabelText('Music')).toBeInTheDocument()
    })

    // All should be checkboxes
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(4)
  })

  it('stores array of selected IDs via checkboxes', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm dataProvider={mockDataProvider} onSubmit={onSubmit}>
        <ReferenceArrayInput source="tag_ids" reference="tags">
          <CheckboxGroupInput source="tag_ids" choices={[]} />
        </ReferenceArrayInput>
      </TestForm>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Technology')).toBeInTheDocument()
    })

    // Select checkboxes
    await user.click(screen.getByLabelText('Technology'))
    await user.click(screen.getByLabelText('Sports'))

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tag_ids: expect.arrayContaining(['tech', 'sports']),
        }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue array with checkboxes', async () => {
    render(
      <TestForm dataProvider={mockDataProvider} defaultValues={{ tag_ids: ['news', 'music'] }}>
        <ReferenceArrayInput source="tag_ids" reference="tags">
          <CheckboxGroupInput source="tag_ids" choices={[]} />
        </ReferenceArrayInput>
      </TestForm>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Technology')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('News')).toBeChecked()
    expect(screen.getByLabelText('Music')).toBeChecked()
    expect(screen.getByLabelText('Technology')).not.toBeChecked()
    expect(screen.getByLabelText('Sports')).not.toBeChecked()
  })

  it('allows toggling checkbox selections', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm
        dataProvider={mockDataProvider}
        defaultValues={{ tag_ids: ['tech', 'news'] }}
        onSubmit={onSubmit}
      >
        <ReferenceArrayInput source="tag_ids" reference="tags">
          <CheckboxGroupInput source="tag_ids" choices={[]} />
        </ReferenceArrayInput>
      </TestForm>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Technology')).toBeChecked()
    })

    // Uncheck one
    await user.click(screen.getByLabelText('Technology'))

    // Check another
    await user.click(screen.getByLabelText('Sports'))

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tag_ids: expect.arrayContaining(['news', 'sports']),
        }),
        expect.anything()
      )
    })
  })

  it('supports filter prop with checkboxes', async () => {
    render(
      <TestForm dataProvider={mockDataProvider}>
        <ReferenceArrayInput source="tag_ids" reference="tags" filter={{ featured: true }}>
          <CheckboxGroupInput source="tag_ids" choices={[]} />
        </ReferenceArrayInput>
      </TestForm>
    )

    await waitFor(() => {
      expect(mockDataProvider.getList).toHaveBeenCalledWith(
        'tags',
        expect.objectContaining({
          filter: { featured: true },
        })
      )
    })
  })

  it('supports row layout with checkboxes', async () => {
    render(
      <TestForm dataProvider={mockDataProvider}>
        <ReferenceArrayInput source="tag_ids" reference="tags">
          <CheckboxGroupInput source="tag_ids" choices={[]} row />
        </ReferenceArrayInput>
      </TestForm>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Technology')).toBeInTheDocument()
    })

    const checkboxGroup = screen.getAllByRole('checkbox')[0]!.closest('[role="group"]')
    expect(checkboxGroup).toHaveClass('flex-row')
  })

  it('passes disabled prop to checkboxes', async () => {
    render(
      <TestForm dataProvider={mockDataProvider}>
        <ReferenceArrayInput source="tag_ids" reference="tags" disabled>
          <CheckboxGroupInput source="tag_ids" choices={[]} />
        </ReferenceArrayInput>
      </TestForm>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Technology')).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled()
    })
  })
})
