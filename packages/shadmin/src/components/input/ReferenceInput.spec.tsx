/**
 * ReferenceInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { FormContextProvider } from '../../contexts/FormContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import type { DataProvider } from '../../types'
import { ReferenceInput } from './ReferenceInput'
import { SelectInput } from './SelectInput'

// Helper to create mock data provider
const createMockDataProvider = (overrides?: Partial<DataProvider>): DataProvider => ({
  getList: vi.fn().mockResolvedValue({
    data: [
      { id: 1, name: 'Author 1' },
      { id: 2, name: 'Author 2' },
      { id: 3, name: 'Author 3' },
    ],
    total: 3,
  }),
  getOne: vi.fn(),
  getMany: vi.fn(),
  getManyReference: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  ...overrides,
})

// Helper component to wrap ReferenceInput with all required contexts
interface TestFormProps {
  children: ReactNode
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
      <DataProviderContextProvider dataProvider={dataProvider}>
        <FormContextProvider {...form} save={onSubmit}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {children}
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      </DataProviderContextProvider>
    </QueryClientProvider>
  )
}

describe('<ReferenceInput />', () => {
  describe('Basic Rendering', () => {
    it('renders with a child input component', async () => {
      render(
        <TestForm>
          <ReferenceInput source="authorId" reference="authors">
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      })

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('shows loading state while fetching choices', () => {
      const slowProvider = createMockDataProvider({
        getList: vi.fn().mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve({ data: [], total: 0 }), 1000))
        ),
      })

      render(
        <TestForm dataProvider={slowProvider}>
          <ReferenceInput source="authorId" reference="authors">
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('passes fetched choices to child input', async () => {
      render(
        <TestForm>
          <ReferenceInput source="authorId" reference="authors">
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Author 1' })).toBeInTheDocument()
      })

      expect(screen.getByRole('option', { name: 'Author 2' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Author 3' })).toBeInTheDocument()
    })
  })

  describe('useGetList Integration', () => {
    it('calls dataProvider.getList with the reference resource', async () => {
      const dataProvider = createMockDataProvider()

      render(
        <TestForm dataProvider={dataProvider}>
          <ReferenceInput source="authorId" reference="authors">
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'authors',
          expect.objectContaining({
            pagination: expect.any(Object),
            sort: expect.any(Object),
            filter: expect.any(Object),
          })
        )
      })
    })

    it('supports custom filter prop', async () => {
      const dataProvider = createMockDataProvider()

      render(
        <TestForm dataProvider={dataProvider}>
          <ReferenceInput
            source="authorId"
            reference="authors"
            filter={{ isActive: true }}
          >
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'authors',
          expect.objectContaining({
            filter: { isActive: true },
          })
        )
      })
    })

    it('supports custom sort prop', async () => {
      const dataProvider = createMockDataProvider()

      render(
        <TestForm dataProvider={dataProvider}>
          <ReferenceInput
            source="authorId"
            reference="authors"
            sort={{ field: 'name', order: 'ASC' }}
          >
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'authors',
          expect.objectContaining({
            sort: { field: 'name', order: 'ASC' },
          })
        )
      })
    })

    it('supports custom perPage prop', async () => {
      const dataProvider = createMockDataProvider()

      render(
        <TestForm dataProvider={dataProvider}>
          <ReferenceInput
            source="authorId"
            reference="authors"
            perPage={50}
          >
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'authors',
          expect.objectContaining({
            pagination: { page: 1, perPage: 50 },
          })
        )
      })
    })
  })

  describe('Error Handling', () => {
    it('displays error message when fetch fails', async () => {
      const errorProvider = createMockDataProvider({
        getList: vi.fn().mockRejectedValue(new Error('Failed to fetch authors')),
      })

      render(
        <TestForm dataProvider={errorProvider}>
          <ReferenceInput source="authorId" reference="authors">
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByText(/failed to fetch authors/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Integration', () => {
    it('integrates with react-hook-form and submits selected value', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm onSubmit={onSubmit}>
          <ReferenceInput source="authorId" reference="authors">
            <SelectInput source="authorId" label="Author" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      // Wait for choices to load
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Author 1' })).toBeInTheDocument()
      })

      const select = screen.getByLabelText('Author')
      await user.selectOptions(select, '2')

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ authorId: '2' }),
          expect.anything()
        )
      })
    })

    it('handles defaultValue from form context', async () => {
      render(
        <TestForm defaultValues={{ authorId: '2' }}>
          <ReferenceInput source="authorId" reference="authors">
            <SelectInput source="authorId" label="Author" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Author 1' })).toBeInTheDocument()
      })

      const select = screen.getByLabelText('Author')
      expect(select).toHaveValue('2')
    })
  })

  describe('Props Passthrough', () => {
    it('passes label prop to child input', async () => {
      render(
        <TestForm>
          <ReferenceInput source="authorId" reference="authors" label="Select Author">
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByText('Select Author')).toBeInTheDocument()
      })
    })

    it('supports disabled state', async () => {
      render(
        <TestForm>
          <ReferenceInput source="authorId" reference="authors" disabled>
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeDisabled()
      })
    })

    it('supports emptyText for empty option', async () => {
      render(
        <TestForm>
          <ReferenceInput source="authorId" reference="authors" emptyText="Choose an author">
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Choose an author' })).toBeInTheDocument()
      })
    })
  })

  describe('Custom optionValue and optionText', () => {
    it('supports custom optionValue prop', async () => {
      const customProvider = createMockDataProvider({
        getList: vi.fn().mockResolvedValue({
          data: [
            { _id: 'a1', title: 'Author A' },
            { _id: 'a2', title: 'Author B' },
          ],
          total: 2,
        }),
      })

      render(
        <TestForm dataProvider={customProvider}>
          <ReferenceInput source="authorId" reference="authors" optionValue="_id" optionText="title">
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Author A' })).toHaveValue('a1')
      })
    })

    it('supports optionText as function', async () => {
      const customProvider = createMockDataProvider({
        getList: vi.fn().mockResolvedValue({
          data: [
            { id: 1, firstName: 'John', lastName: 'Doe' },
            { id: 2, firstName: 'Jane', lastName: 'Smith' },
          ],
          total: 2,
        }),
      })

      render(
        <TestForm dataProvider={customProvider}>
          <ReferenceInput
            source="authorId"
            reference="authors"
            optionText={(record) =>
              `${(record as { firstName: string; lastName: string }).firstName} ${(record as { firstName: string; lastName: string }).lastName}`
            }
          >
            <SelectInput source="authorId" choices={[]} />
          </ReferenceInput>
        </TestForm>
      )

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'John Doe' })).toBeInTheDocument()
      })
      expect(screen.getByRole('option', { name: 'Jane Smith' })).toBeInTheDocument()
    })
  })
})
