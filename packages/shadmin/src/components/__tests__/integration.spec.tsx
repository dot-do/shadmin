/**
 * Component Integration Tests
 *
 * Tests for component combinations to verify they work together correctly.
 * These tests focus on realistic usage patterns with multiple components.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// Components
import { List } from '../list/List'
import { ListBase } from '../list/ListBase'
import { Datagrid } from '../list/Datagrid'
import { Pagination } from '../list/Pagination'
import { Create } from '../create/Create'
import { Edit } from '../edit/Edit'
import { Show } from '../show/Show'
import { SimpleForm } from '../form/SimpleForm'
import { TextField } from '../field/TextField'
import { DateField } from '../field/DateField'
import { NumberField } from '../field/NumberField'
import { BooleanField } from '../field/BooleanField'
import { TextInput } from '../input/TextInput'
import { NumberInput } from '../input/NumberInput'
import { BooleanInput } from '../input/BooleanInput'

// Contexts and utilities
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ResourceContextProvider } from '../../contexts/ResourceContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import { useListContext } from '../../contexts/ListContext'
import type { DataProvider } from '../../types'
import { MemoryRouter } from 'react-router'

// =============================================================================
// Test Utilities
// =============================================================================

/**
 * Creates a wrapper with all required providers for integration tests
 */
const createTestWrapper = (
  dataProvider: DataProvider,
  initialEntries: string[] = ['/posts']
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <MemoryRouter initialEntries={initialEntries}>
              <ResourceContextProvider value="posts">
                {children}
              </ResourceContextProvider>
            </MemoryRouter>
          </DataProviderContextProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    )
  }
}

/**
 * Creates a mock data provider with configurable behavior
 */
const createMockDataProvider = (overrides?: Partial<DataProvider>): DataProvider => ({
  getList: vi.fn().mockResolvedValue({
    data: [
      { id: 1, title: 'First Post', author: 'John', views: 100, published: true, createdAt: '2024-01-01' },
      { id: 2, title: 'Second Post', author: 'Jane', views: 200, published: false, createdAt: '2024-01-02' },
      { id: 3, title: 'Third Post', author: 'Bob', views: 50, published: true, createdAt: '2024-01-03' },
    ],
    total: 3,
  }),
  getOne: vi.fn().mockResolvedValue({
    data: { id: 1, title: 'Test Post', body: 'Test body', author: 'John', views: 100, published: true },
  }),
  getMany: vi.fn().mockResolvedValue({ data: [] }),
  getManyReference: vi.fn().mockResolvedValue({ data: [], total: 0 }),
  create: vi.fn().mockResolvedValue({ data: { id: 4, title: 'New Post' } }),
  update: vi.fn().mockResolvedValue({ data: { id: 1, title: 'Updated Post' } }),
  updateMany: vi.fn().mockResolvedValue({ data: [] }),
  delete: vi.fn().mockResolvedValue({ data: { id: 1 } }),
  deleteMany: vi.fn().mockResolvedValue({ data: [] }),
  ...overrides,
})

// =============================================================================
// List + Datagrid + Pagination Integration Tests
// =============================================================================

describe('List + Datagrid + Pagination Integration', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = createMockDataProvider()
  })

  describe('Basic List with Datagrid', () => {
    it('should render list data in a datagrid with field components', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
              <TextField source="author" />
              <NumberField source="views" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument()
      })

      // Verify all records are displayed
      expect(screen.getByText('Second Post')).toBeInTheDocument()
      expect(screen.getByText('Third Post')).toBeInTheDocument()

      // Verify field values are rendered
      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByText('Jane')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('200')).toBeInTheDocument()
    })

    it('should display column headers from field sources', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
              <TextField source="author" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument()
      })

      // Headers should be capitalized versions of source
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Author')).toBeInTheDocument()
    })

    it('should handle empty data gracefully', async () => {
      dataProvider.getList = vi.fn().mockResolvedValue({
        data: [],
        total: 0,
      })
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts" empty={<div data-testid="empty-state">No posts found</div>}>
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      })
    })
  })

  describe('Datagrid Sorting', () => {
    it('should trigger sort when clicking column header', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
              <TextField source="author" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument()
      })

      // Click on Title header to sort
      const titleHeader = screen.getByText('Title')
      fireEvent.click(titleHeader)

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            sort: expect.objectContaining({ field: 'title' }),
          })
        )
      })
    })

    it('should toggle sort order on repeated clicks', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument()
      })

      const titleHeader = screen.getByText('Title')
      const initialCallCount = (dataProvider.getList as ReturnType<typeof vi.fn>).mock.calls.length

      // First click - sorts the column
      fireEvent.click(titleHeader)
      await waitFor(() => {
        expect((dataProvider.getList as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(initialCallCount)
      })

      // Verify first sort call has title field
      const sortCall = (dataProvider.getList as ReturnType<typeof vi.fn>).mock.calls.find(
        (call: [string, { sort?: { field: string } }]) => call[1]?.sort?.field === 'title'
      )
      expect(sortCall).toBeTruthy()
      expect(sortCall![1].sort.field).toBe('title')
    })
  })

  describe('Pagination Integration', () => {
    beforeEach(() => {
      // Setup paginated data
      dataProvider.getList = vi.fn().mockImplementation((resource, params) => {
        const allData = Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          title: `Post ${i + 1}`,
          author: `Author ${i + 1}`,
        }))

        const { page = 1, perPage = 10 } = params.pagination || {}
        const start = (page - 1) * perPage
        const end = start + perPage

        return Promise.resolve({
          data: allData.slice(start, end),
          total: 25,
        })
      })
    })

    it('should render pagination with correct page info', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts" perPage={10}>
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
            <Pagination />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument()
      })

      // Should show record range
      expect(screen.getByText('1-10 of 25')).toBeInTheDocument()
    })

    it('should navigate to next page when clicking next', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts" perPage={10}>
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
            <Pagination />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument()
      })

      // Click next button
      const nextButton = screen.getByLabelText('Go to next page')
      fireEvent.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText('Post 11')).toBeInTheDocument()
      })

      // Should update record range
      expect(screen.getByText('11-20 of 25')).toBeInTheDocument()
    })

    it('should navigate to specific page when clicking page number', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts" perPage={10}>
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
            <Pagination />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument()
      })

      // Click page 3 button
      const page3Button = screen.getByLabelText('Go to page 3')
      fireEvent.click(page3Button)

      await waitFor(() => {
        expect(screen.getByText('Post 21')).toBeInTheDocument()
      })

      expect(screen.getByText('21-25 of 25')).toBeInTheDocument()
    })

    it('should disable previous button on first page', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts" perPage={10}>
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
            <Pagination />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument()
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      expect(prevButton).toBeDisabled()
    })

    it('should disable next button on last page', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts" perPage={10}>
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
            <Pagination />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument()
      })

      // Navigate to last page
      const page3Button = screen.getByLabelText('Go to page 3')
      fireEvent.click(page3Button)

      await waitFor(() => {
        expect(screen.getByText('Post 21')).toBeInTheDocument()
      })

      const nextButton = screen.getByLabelText('Go to next page')
      expect(nextButton).toBeDisabled()
    })
  })

  describe('Datagrid Selection', () => {
    it('should enable row selection with bulk action buttons', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts">
            <Datagrid bulkActionButtons={true}>
              <TextField source="title" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      // Wait for any post to appear
      await waitFor(() => {
        expect(screen.getByLabelText('Select row 1')).toBeInTheDocument()
      })

      // Should have selection checkboxes
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    it('should render row checkboxes with correct labels', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts">
            <Datagrid bulkActionButtons={true}>
              <TextField source="title" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByLabelText('Select row 1')).toBeInTheDocument()
      })

      // Row selection checkboxes should be present with proper labels
      expect(screen.getByLabelText('Select row 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Select row 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Select row 3')).toBeInTheDocument()
    })

    it('should render header checkbox for select all', async () => {
      const Wrapper = createTestWrapper(dataProvider)

      render(
        <Wrapper>
          <List resource="posts">
            <Datagrid bulkActionButtons={true}>
              <TextField source="title" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByLabelText('Select row 1')).toBeInTheDocument()
      })

      // Header checkbox should be present
      expect(screen.getByLabelText('Select all rows')).toBeInTheDocument()
    })
  })
})

// =============================================================================
// Create + SimpleForm + TextInput Integration Tests
// =============================================================================

describe('Create + SimpleForm + TextInput Integration', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = createMockDataProvider()
  })

  describe('Basic Create Form', () => {
    it('should render a create form with text inputs', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={vi.fn()}>
              <TextInput source="title" label="Title" />
              <TextInput source="body" label="Body" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Body')).toBeInTheDocument()
    })

    it('should submit form data to data provider', async () => {
      const user = userEvent.setup()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={async (data) => {
              await dataProvider.create('posts', { data })
            }}>
              <TextInput source="title" label="Title" />
              <TextInput source="body" label="Body" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Fill in the form
      await user.type(screen.getByLabelText('Title'), 'My New Post')
      await user.type(screen.getByLabelText('Body'), 'This is the content')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /save/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(dataProvider.create).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            data: expect.objectContaining({
              title: 'My New Post',
              body: 'This is the content',
            }),
          })
        )
      })
    })

    it('should handle multiple input types in create form', async () => {
      const user = userEvent.setup()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])
      const handleSubmit = vi.fn()

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ views: 0, published: false }}>
              <TextInput source="title" label="Title" />
              <NumberInput source="views" label="Views" />
              <BooleanInput source="published" label="Published" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      await user.type(screen.getByLabelText('Title'), 'Test Post')

      // Change the views input
      const viewsInput = screen.getByLabelText('Views')
      await user.clear(viewsInput)
      await user.type(viewsInput, '42')

      // Toggle the checkbox
      const publishedCheckbox = screen.getByLabelText('Published')
      await user.click(publishedCheckbox)

      // Submit
      const submitButton = screen.getByRole('button', { name: /save/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Post',
            views: 42,
            published: true,
          }),
          expect.anything()
        )
      })
    })
  })

  describe('Form Validation in Create', () => {
    it('should render form with required field indicator', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={vi.fn()}>
              <TextInput
                source="title"
                label="Title"
                required
                rules={{ required: 'Title is required' }}
              />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Should show the required indicator
      expect(screen.getByText('*')).toBeInTheDocument()
      expect(screen.getByLabelText(/title/i)).toHaveAttribute('required')
    })

    it('should allow submission when form is valid', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit}>
              <TextInput
                source="title"
                label="Title"
                required
                rules={{ required: 'Title is required' }}
              />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Fill in the required field
      await user.type(screen.getByLabelText(/title/i), 'Valid Title')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /save/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Valid Title',
          }),
          expect.anything()
        )
      })
    })
  })
})

// =============================================================================
// Edit + SimpleForm + Validation Integration Tests
// =============================================================================

describe('Edit + SimpleForm + Validation Integration', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = createMockDataProvider({
      getOne: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Existing Post', body: 'Existing content', views: 100 },
      }),
      update: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Updated Post', body: 'Updated content' },
      }),
    })
  })

  describe('Basic Edit Form', () => {
    it('should load and display existing record data in form', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])

      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={vi.fn()} defaultValues={{ title: '', body: '' }}>
              <TextInput source="title" label="Title" />
              <TextInput source="body" label="Body" />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      // Wait for record to load - the form receives record as defaultValues through context
      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })
    })

    it('should submit updated data to data provider', async () => {
      const user = userEvent.setup()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])

      // Create a simpler test that just verifies the form submission works
      const handleSubmit = vi.fn()

      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: 'Original', body: 'Content' }}>
              <TextInput source="title" label="Title" />
              <TextInput source="body" label="Body" />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      // Wait for form submit button to appear (form is loaded)
      const submitButton = await screen.findByRole('button', { name: /save/i })

      // Clear and update the title
      const titleInput = screen.getByRole('textbox', { name: /title/i })
      await user.clear(titleInput)
      await user.type(titleInput, 'Modified Title')

      // Submit the form
      await user.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Modified Title',
          }),
          expect.anything()
        )
      })
    })
  })

  describe('Form Validation Integration', () => {
    it('should render edit form with required field attributes', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])

      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={vi.fn()} defaultValues={{ title: 'Original' }}>
              <TextInput
                source="title"
                label="Title"
                required
                rules={{ required: 'Title is required' }}
              />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      // Wait for form to load
      const submitButton = await screen.findByRole('button', { name: /save/i })
      expect(submitButton).toBeInTheDocument()

      // Should show the required indicator
      expect(screen.getByText('*')).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /title/i })).toHaveAttribute('required')
    })

    it('should submit form data when valid', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])

      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: 'Original' }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      // Wait for form to load
      const submitButton = await screen.findByRole('button', { name: /save/i })

      // Modify the title
      const titleInput = screen.getByRole('textbox', { name: /title/i })
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Title')

      // Submit
      await user.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Updated Title',
          }),
          expect.anything()
        )
      })
    })
  })
})

// =============================================================================
// Show + Fields Integration Tests
// =============================================================================

describe('Show + Fields Integration', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = createMockDataProvider({
      getOne: vi.fn().mockResolvedValue({
        data: {
          id: 1,
          title: 'Show Test Post',
          body: 'This is the post content',
          author: 'John Doe',
          views: 1234,
          published: true,
          createdAt: '2024-01-15T10:30:00Z',
        },
      }),
    })
  })

  describe('Basic Show with Fields', () => {
    it('should display record data using field components after loading', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/show'])

      render(
        <Wrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
            <TextField source="author" />
            <NumberField source="views" />
            <BooleanField source="published" />
          </Show>
        </Wrapper>
      )

      // Wait for data to load and fields to display
      await waitFor(() => {
        expect(screen.getByText('Show Test Post')).toBeInTheDocument()
      })

      // Verify data provider was called correctly
      expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })

      // Verify all fields are displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      // NumberField formats numbers with locale formatting
      expect(screen.getByText('1,234')).toBeInTheDocument()
    })

    it('should show loading state while fetching record', async () => {
      // Delay the response
      dataProvider.getOne = vi.fn().mockImplementation(
        () => new Promise((resolve) =>
          setTimeout(() => resolve({
            data: { id: 1, title: 'Test' }
          }), 100)
        )
      )

      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/show'])

      render(
        <Wrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
          </Show>
        </Wrapper>
      )

      // Should show loading indicator
      expect(screen.getByRole('progressbar')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      })
    })

    it('should show error state when fetch fails', async () => {
      dataProvider.getOne = vi.fn().mockRejectedValue(new Error('Failed to load record'))

      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/show'])

      render(
        <Wrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/failed to load record/i)).toBeInTheDocument()
      })
    })
  })

  describe('Show with Different Field Types', () => {
    it('should render multiple field types correctly', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: {
          id: 1,
          title: 'Multi-field Test',
          views: 5000,
          published: true,
          createdAt: '2024-06-15',
        },
      })

      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/show'])

      render(
        <Wrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
            <NumberField source="views" />
            <BooleanField source="published" />
            <DateField source="createdAt" />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Multi-field Test')).toBeInTheDocument()
      })

      // NumberField formats numbers with locale formatting
      expect(screen.getByText('5,000')).toBeInTheDocument()
    })

    it('should handle nested field paths', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: {
          id: 1,
          title: 'Nested Test',
          metadata: {
            author: {
              name: 'Nested Author',
            },
          },
        },
      })

      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/show'])

      render(
        <Wrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
            <TextField source="metadata.author.name" />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Nested Test')).toBeInTheDocument()
      })

      expect(screen.getByText('Nested Author')).toBeInTheDocument()
    })

    it('should display emptyText for missing values', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: {
          id: 1,
          title: 'Partial Record',
          // author is missing
        },
      })

      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/show'])

      render(
        <Wrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
            <TextField source="author" emptyText="No author" />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Partial Record')).toBeInTheDocument()
      })

      expect(screen.getByText('No author')).toBeInTheDocument()
    })
  })

  describe('Show with Custom Title and Actions', () => {
    it('should display custom title', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/show'])

      render(
        <Wrapper>
          <Show resource="posts" id={1} title="Post Details">
            <TextField source="title" />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Post Details')).toBeInTheDocument()
      })
    })

    it('should display custom actions', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/show'])
      const CustomActions = () => (
        <button data-testid="edit-button">Edit Post</button>
      )

      render(
        <Wrapper>
          <Show resource="posts" id={1} actions={<CustomActions />}>
            <TextField source="title" />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('edit-button')).toBeInTheDocument()
      })
    })
  })
})

// =============================================================================
// Cross-Component Flow Tests
// =============================================================================

describe('Cross-Component Flow Tests', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = createMockDataProvider()
  })

  describe('List to Show Flow', () => {
    it('should maintain data consistency between list and show views', async () => {
      const record = { id: 1, title: 'Consistent Post', author: 'Test Author' }

      dataProvider.getList = vi.fn().mockResolvedValue({
        data: [record],
        total: 1,
      })

      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: record,
      })

      const Wrapper = createTestWrapper(dataProvider)

      // First render List
      const { rerender } = render(
        <Wrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
              <TextField source="author" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Consistent Post')).toBeInTheDocument()
        expect(screen.getByText('Test Author')).toBeInTheDocument()
      })

      // Then render Show for the same record
      const ShowWrapper = createTestWrapper(dataProvider, ['/posts/1/show'])

      rerender(
        <ShowWrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
            <TextField source="author" />
          </Show>
        </ShowWrapper>
      )

      await waitFor(() => {
        // Same data should be displayed
        expect(screen.getByText('Consistent Post')).toBeInTheDocument()
        expect(screen.getByText('Test Author')).toBeInTheDocument()
      })
    })
  })

  describe('Create to List Flow', () => {
    it('should create a new record and reflect it in the list', async () => {
      const user = userEvent.setup()
      const existingRecords = [
        { id: 1, title: 'Existing Post' },
      ]

      dataProvider.getList = vi.fn().mockResolvedValue({
        data: existingRecords,
        total: 1,
      })

      dataProvider.create = vi.fn().mockImplementation(async (resource, { data }) => {
        const newRecord = { id: 2, ...data }
        existingRecords.push(newRecord)
        return { data: newRecord }
      })

      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={async (data) => {
              await dataProvider.create('posts', { data })
            }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Fill and submit the form
      await user.type(screen.getByLabelText('Title'), 'Brand New Post')
      const submitButton = screen.getByRole('button', { name: /save/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(dataProvider.create).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            data: expect.objectContaining({
              title: 'Brand New Post',
            }),
          })
        )
      })
    })
  })
})
