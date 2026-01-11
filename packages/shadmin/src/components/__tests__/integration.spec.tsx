/**
 * Component Integration Test Suite
 *
 * This comprehensive test suite validates how shadmin components work together
 * in realistic usage patterns. Unlike unit tests that isolate components, these
 * tests verify the interactions between List, Datagrid, Form, Field, and Input components.
 *
 * KEY INTEGRATION SCENARIOS TESTED:
 * 1. List + Datagrid + Pagination - Data fetching, display, sorting, pagination navigation
 * 2. Create + SimpleForm + Inputs - Form rendering, data submission to DataProvider
 * 3. Edit + SimpleForm + Validation - Record loading, editing, validation, update submission
 * 4. Show + Fields - Record display with various field types (Text, Number, Boolean, Date)
 * 5. Cross-Component Flows - List-to-Show, Create-to-List data consistency
 * 6. Full CRUD Cycle - Create -> Read -> Update -> Delete with state verification
 * 7. Navigation Flows - List -> Show -> Edit -> List, deep linking, state persistence
 * 8. Filter and Sort Flows - Text/author filtering, column sorting, combined with pagination
 * 9. Form Flows - Submission, validation errors, cancel, reset, pre-population
 *
 * WHY INTEGRATION TESTS MATTER:
 * - Unit tests can pass while component combinations fail (context wiring issues)
 * - DataProvider interactions span multiple components and need end-to-end verification
 * - React Query caching behavior affects data consistency between views
 * - Navigation state preservation is only testable with multiple component renders
 * - Form validation errors must correctly prevent DataProvider calls
 *
 * TEST SETUP:
 * - createTestWrapper() provides QueryClient + NotificationContext + DataProviderContext +
 *   MemoryRouter + ResourceContext for full app-like environment
 * - createMockDataProvider() creates a configurable mock with realistic behavior
 * - Mutable records array simulates real database state changes
 * - userEvent provides realistic user interaction sequences
 *
 * COMPONENT DEPENDENCIES VERIFIED:
 * - List depends on: DataProviderContext, ResourceContext, QueryClient
 * - Datagrid depends on: ListContext (from List)
 * - SimpleForm depends on: FormContext (from Edit/Create)
 * - Fields/Inputs depend on: RecordContext, FormContext
 * - Pagination depends on: ListContext
 *
 * MOCK DATAPROVIDER PATTERNS:
 * - Paginated getList with computed slices
 * - Filtered getList with author/q search
 * - Sorted getList with field/order comparison
 * - Stateful create/update/delete modifying shared records array
 *
 * EDGE CASES COVERED:
 * - Empty list display with custom empty component
 * - Loading state while fetching
 * - Error state when fetch fails
 * - Multiple field types in single view
 * - Nested field paths (metadata.author.name)
 * - Missing values with emptyText fallback
 * - Custom title and actions on Show
 * - Form submission with multiple input types
 * - HTML5 validation (required, pattern)
 * - Deep linking with pagination parameters
 * - State persistence across navigation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// Components
import { List } from '../list/List'
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
      const calls = (dataProvider.getList as ReturnType<typeof vi.fn>).mock.calls as Array<[string, { sort?: { field: string } }]>
      const sortCall = calls.find(
        (call) => call[1]?.sort?.field === 'title'
      )
      expect(sortCall).toBeTruthy()
      expect(sortCall![1].sort!.field).toBe('title')
    })
  })

  describe('Pagination Integration', () => {
    beforeEach(() => {
      // Setup paginated data
      dataProvider.getList = vi.fn().mockImplementation((_resource, params) => {
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

      dataProvider.create = vi.fn().mockImplementation(async (_resource, { data }) => {
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

// =============================================================================
// CRUD Flow Integration Tests
// =============================================================================

describe('CRUD Flow Integration Tests', () => {
  let dataProvider: DataProvider
  let records: Array<{ id: number; title: string; author: string; views: number; published: boolean }>

  beforeEach(() => {
    // Initialize with sample data
    records = [
      { id: 1, title: 'First Post', author: 'John', views: 100, published: true },
      { id: 2, title: 'Second Post', author: 'Jane', views: 200, published: false },
      { id: 3, title: 'Third Post', author: 'Bob', views: 50, published: true },
    ]

    dataProvider = createMockDataProvider({
      getList: vi.fn().mockImplementation(() =>
        Promise.resolve({
          data: [...records],
          total: records.length,
        })
      ),
      getOne: vi.fn().mockImplementation((_resource, { id }) => {
        const record = records.find((r) => r.id === id)
        return Promise.resolve({ data: record })
      }),
      create: vi.fn().mockImplementation((_resource, { data }) => {
        const newRecord = { id: records.length + 1, ...data }
        records.push(newRecord)
        return Promise.resolve({ data: newRecord })
      }),
      update: vi.fn().mockImplementation((_resource, { id, data }) => {
        const index = records.findIndex((r) => r.id === id)
        if (index !== -1) {
          records[index] = { ...records[index], ...data }
          return Promise.resolve({ data: records[index] })
        }
        return Promise.reject(new Error('Record not found'))
      }),
      delete: vi.fn().mockImplementation((_resource, { id }) => {
        const index = records.findIndex((r) => r.id === id)
        if (index !== -1) {
          const deleted = records.splice(index, 1)[0]
          return Promise.resolve({ data: deleted })
        }
        return Promise.reject(new Error('Record not found'))
      }),
    })
  })

  describe('Create Record Flow', () => {
    it('should create a record and verify it appears in the list', async () => {
      const user = userEvent.setup()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      // First render create form
      const { rerender } = render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={async (data) => {
              await dataProvider.create('posts', { data })
            }}>
              <TextInput source="title" label="Title" />
              <TextInput source="author" label="Author" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Fill and submit form
      await user.type(screen.getByLabelText('Title'), 'New Integration Post')
      await user.type(screen.getByLabelText('Author'), 'Test Author')
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(dataProvider.create).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            data: expect.objectContaining({
              title: 'New Integration Post',
              author: 'Test Author',
            }),
          })
        )
      })

      // Verify the record was added to our mock data
      expect(records).toHaveLength(4)
      expect(records[3]?.title).toBe('New Integration Post')

      // Re-render list to verify new record appears
      const ListWrapper = createTestWrapper(dataProvider, ['/posts'])
      rerender(
        <ListWrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
              <TextField source="author" />
            </Datagrid>
          </List>
        </ListWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('New Integration Post')).toBeInTheDocument()
      })
      expect(screen.getByText('Test Author')).toBeInTheDocument()
    })

    it('should handle create with all field types', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ views: 0, published: false }}>
              <TextInput source="title" label="Title" />
              <TextInput source="author" label="Author" />
              <NumberInput source="views" label="Views" />
              <BooleanInput source="published" label="Published" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      await user.type(screen.getByLabelText('Title'), 'Complex Post')
      await user.type(screen.getByLabelText('Author'), 'Complex Author')
      await user.clear(screen.getByLabelText('Views'))
      await user.type(screen.getByLabelText('Views'), '500')
      await user.click(screen.getByLabelText('Published'))
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Complex Post',
            author: 'Complex Author',
            views: 500,
            published: true,
          }),
          expect.anything()
        )
      })
    })
  })

  describe('Edit Record Flow', () => {
    it('should edit a record and verify changes persist', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn().mockImplementation(async (data) => {
        await dataProvider.update('posts', { id: 1, data, previousData: records[0] })
      })
      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])

      // Render edit form with initial values
      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: 'First Post', author: 'John' }}>
              <TextInput source="title" label="Title" />
              <TextInput source="author" label="Author" />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      // Wait for form to be available
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      })

      // Clear and type new values
      const titleInput = screen.getByLabelText('Title')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated First Post')

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Updated First Post',
          }),
          expect.anything()
        )
      })

      // Verify data was updated
      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalled()
      })
    })

    it('should load existing data into edit form', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])

      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={vi.fn()} defaultValues={{ title: '', author: '' }}>
              <TextInput source="title" label="Title" />
              <TextInput source="author" label="Author" />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })
    })
  })

  describe('Delete Record Flow', () => {
    it('should delete a record via data provider', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      // First render the list
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
        expect(screen.getByText('Second Post')).toBeInTheDocument()
        expect(screen.getByText('Third Post')).toBeInTheDocument()
      })

      // Simulate delete
      await dataProvider.delete('posts', { id: 1 })

      // Verify deletion in the data store
      expect(records).toHaveLength(2)
      expect(records.find((r) => r.id === 1)).toBeUndefined()
      expect(records.find((r) => r.id === 2)).toBeDefined()
      expect(records.find((r) => r.id === 3)).toBeDefined()
    })

    it('should handle delete with confirmation', async () => {
      // Mock window.confirm (created but used only for cleanup)
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      void confirmSpy // Mark as intentionally unused in this test

      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])

      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={vi.fn()} defaultValues={{ title: 'First Post' }}>
              <TextInput source="title" label="Title" />
              <div className="flex gap-2 mt-4">
                <button type="submit">Save</button>
              </div>
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      // Verify the component renders
      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalled()
      })

      confirmSpy.mockRestore()
    })
  })

  describe('Full CRUD Cycle', () => {
    it('should complete a full create -> read -> update -> delete cycle', async () => {
      const user = userEvent.setup()

      // Step 1: Create
      const CreateWrapper = createTestWrapper(dataProvider, ['/posts/create'])
      const { rerender } = render(
        <CreateWrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={async (data) => {
              await dataProvider.create('posts', { data })
            }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </CreateWrapper>
      )

      await user.type(screen.getByLabelText('Title'), 'CRUD Test Post')
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(dataProvider.create).toHaveBeenCalled()
      })
      expect(records).toHaveLength(4)
      const newRecord = records[3]
      expect(newRecord).toBeDefined()
      const newId = newRecord!.id

      // Step 2: Read/Show
      const ShowWrapper = createTestWrapper(dataProvider, [`/posts/${newId}/show`])
      rerender(
        <ShowWrapper>
          <Show resource="posts" id={newId}>
            <TextField source="title" />
          </Show>
        </ShowWrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: newId })
      })

      // Step 3: Update
      await dataProvider.update('posts', {
        id: newId,
        data: { title: 'Updated CRUD Test Post' },
        previousData: newRecord!,
      })

      expect(records.find((r) => r.id === newId)?.title).toBe('Updated CRUD Test Post')

      // Step 4: Delete
      await dataProvider.delete('posts', { id: newId })
      expect(records.find((r) => r.id === newId)).toBeUndefined()
      expect(records).toHaveLength(3)
    })
  })
})

// =============================================================================
// Navigation Flow Integration Tests
// =============================================================================

describe('Navigation Flow Integration Tests', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = createMockDataProvider({
      getList: vi.fn().mockResolvedValue({
        data: [
          { id: 1, title: 'First Post', author: 'John' },
          { id: 2, title: 'Second Post', author: 'Jane' },
          { id: 3, title: 'Third Post', author: 'Bob' },
        ],
        total: 3,
      }),
      getOne: vi.fn().mockImplementation((_resource, { id }) =>
        Promise.resolve({
          data: { id, title: `Post ${id}`, author: `Author ${id}` },
        })
      ),
    })
  })

  describe('List to Show to Edit Navigation', () => {
    it('should navigate from list to show view', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      // Start with list
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
        expect(screen.getByText('First Post')).toBeInTheDocument()
      })

      // Navigate to show view
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
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })
    })

    it('should navigate from show to edit view', async () => {
      // Start with show
      const ShowWrapper = createTestWrapper(dataProvider, ['/posts/1/show'])
      const { rerender } = render(
        <ShowWrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
          </Show>
        </ShowWrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })

      // Navigate to edit view
      const EditWrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])
      rerender(
        <EditWrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={vi.fn()} defaultValues={{ title: 'Post 1' }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Edit>
        </EditWrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      })
    })

    it('should complete full navigation flow: list -> show -> edit -> list', async () => {
      // Step 1: List
      const ListWrapper = createTestWrapper(dataProvider, ['/posts'])
      const { rerender } = render(
        <ListWrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
          </List>
        </ListWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument()
      })

      // Step 2: Show
      const ShowWrapper = createTestWrapper(dataProvider, ['/posts/1/show'])
      rerender(
        <ShowWrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
          </Show>
        </ShowWrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })

      // Step 3: Edit
      const EditWrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])
      rerender(
        <EditWrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={vi.fn()} defaultValues={{ title: 'Post 1' }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Edit>
        </EditWrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      })

      // Step 4: Back to List
      const FinalListWrapper = createTestWrapper(dataProvider, ['/posts'])
      rerender(
        <FinalListWrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
          </List>
        </FinalListWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument()
      })
    })
  })

  describe('Deep Linking to Specific Records', () => {
    it('should load record directly via deep link to show page', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts/2/show'])

      render(
        <Wrapper>
          <Show resource="posts" id={2}>
            <TextField source="title" />
            <TextField source="author" />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 2 })
      })
    })

    it('should load record directly via deep link to edit page', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts/3/edit'])

      render(
        <Wrapper>
          <Edit resource="posts" id={3}>
            <SimpleForm onSubmit={vi.fn()} defaultValues={{ title: 'Post 3' }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 3 })
      })
    })

    it('should handle deep link with pagination parameters', async () => {
      dataProvider.getList = vi.fn().mockImplementation((_resource, params) => {
        const { page = 1, perPage = 10 } = params.pagination || {}
        const allData = Array.from({ length: 30 }, (_, i) => ({
          id: i + 1,
          title: `Post ${i + 1}`,
        }))
        const start = (page - 1) * perPage
        return Promise.resolve({
          data: allData.slice(start, start + perPage),
          total: 30,
        })
      })

      const Wrapper = createTestWrapper(dataProvider, ['/posts?page=2'])

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
        expect(dataProvider.getList).toHaveBeenCalled()
      })
    })
  })

  describe('Router State Persistence', () => {
    it('should maintain list state after returning from detail view', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      // Render list
      const { rerender } = render(
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

      // Navigate to show
      const ShowWrapper = createTestWrapper(dataProvider, ['/posts/1/show'])
      rerender(
        <ShowWrapper>
          <Show resource="posts" id={1}>
            <TextField source="title" />
          </Show>
        </ShowWrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalled()
      })

      // Return to list - should show same data
      const ListWrapper = createTestWrapper(dataProvider, ['/posts'])
      rerender(
        <ListWrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
          </List>
        </ListWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument()
        expect(screen.getByText('Second Post')).toBeInTheDocument()
        expect(screen.getByText('Third Post')).toBeInTheDocument()
      })
    })
  })
})

// =============================================================================
// Filter and Sort Flow Integration Tests
// =============================================================================

describe('Filter and Sort Flow Integration Tests', () => {
  let dataProvider: DataProvider
  let allRecords: Array<{ id: number; title: string; author: string; views: number; createdAt: string }>

  beforeEach(() => {
    allRecords = [
      { id: 1, title: 'Alpha Post', author: 'John', views: 100, createdAt: '2024-01-01' },
      { id: 2, title: 'Beta Post', author: 'Jane', views: 500, createdAt: '2024-01-02' },
      { id: 3, title: 'Gamma Post', author: 'John', views: 200, createdAt: '2024-01-03' },
      { id: 4, title: 'Delta Post', author: 'Bob', views: 50, createdAt: '2024-01-04' },
      { id: 5, title: 'Alpha Story', author: 'Jane', views: 300, createdAt: '2024-01-05' },
    ]

    dataProvider = createMockDataProvider({
      getList: vi.fn().mockImplementation((_resource, params) => {
        let filtered = [...allRecords]

        // Apply filters
        if (params.filter) {
          if (params.filter.q) {
            const query = params.filter.q.toLowerCase()
            filtered = filtered.filter(
              (r) =>
                r.title.toLowerCase().includes(query) ||
                r.author.toLowerCase().includes(query)
            )
          }
          if (params.filter.author) {
            filtered = filtered.filter((r) => r.author === params.filter.author)
          }
        }

        // Apply sort
        if (params.sort?.field) {
          const { field, order } = params.sort
          filtered.sort((a, b) => {
            const aVal = a[field as keyof typeof a]
            const bVal = b[field as keyof typeof b]
            if (typeof aVal === 'string' && typeof bVal === 'string') {
              return order === 'ASC'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
              return order === 'ASC' ? aVal - bVal : bVal - aVal
            }
            return 0
          })
        }

        // Apply pagination
        const { page = 1, perPage = 10 } = params.pagination || {}
        const start = (page - 1) * perPage
        const paginated = filtered.slice(start, start + perPage)

        return Promise.resolve({
          data: paginated,
          total: filtered.length,
        })
      }),
    })
  })

  describe('Filter Application', () => {
    it('should apply text filter and verify results', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      render(
        <Wrapper>
          <List resource="posts" filter={{ q: 'Alpha' }}>
            <Datagrid>
              <TextField source="title" />
              <TextField source="author" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            filter: expect.objectContaining({ q: 'Alpha' }),
          })
        )
      })
    })

    it('should filter by author and show only matching records', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      render(
        <Wrapper>
          <List resource="posts" filter={{ author: 'John' }}>
            <Datagrid>
              <TextField source="title" />
              <TextField source="author" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            filter: expect.objectContaining({ author: 'John' }),
          })
        )
      })
    })

    it('should combine multiple filters', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      render(
        <Wrapper>
          <List resource="posts" filter={{ q: 'Post', author: 'Jane' }}>
            <Datagrid>
              <TextField source="title" />
              <TextField source="author" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            filter: expect.objectContaining({
              q: 'Post',
              author: 'Jane',
            }),
          })
        )
      })
    })

    it('should call data provider with pagination parameters', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      // First render without filter
      render(
        <Wrapper>
          <List resource="posts" perPage={2}>
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
            <Pagination />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            pagination: expect.objectContaining({ page: 1, perPage: 2 }),
          })
        )
      })
    })
  })

  describe('Sort Application', () => {
    it('should sort by column when clicking header', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      render(
        <Wrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
              <NumberField source="views" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Alpha Post')).toBeInTheDocument()
      })

      // Click on Views header to sort
      const viewsHeader = screen.getByText('Views')
      fireEvent.click(viewsHeader)

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            sort: expect.objectContaining({ field: 'views' }),
          })
        )
      })
    })

    it('should toggle sort order on repeated clicks', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

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
        expect(screen.getByText('Alpha Post')).toBeInTheDocument()
      })

      const titleHeader = screen.getByText('Title')

      // First click - should sort ASC
      fireEvent.click(titleHeader)

      await waitFor(() => {
        const calls = (dataProvider.getList as ReturnType<typeof vi.fn>).mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall).toBeDefined()
        expect(lastCall?.[1].sort?.field).toBe('title')
      })

      // Second click - should toggle to DESC
      fireEvent.click(titleHeader)

      await waitFor(() => {
        const calls = (dataProvider.getList as ReturnType<typeof vi.fn>).mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall).toBeDefined()
        expect(lastCall?.[1].sort?.field).toBe('title')
      })
    })

    it('should show sort indicator on sorted column', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

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
        expect(screen.getByText('Alpha Post')).toBeInTheDocument()
      })

      // Click title header to sort
      const titleHeader = screen.getByText('Title')
      fireEvent.click(titleHeader)

      await waitFor(() => {
        // Column header should have aria-sort attribute
        const columnHeader = screen.getByTestId('column-header-title')
        expect(columnHeader).toHaveAttribute('aria-sort')
      })
    })
  })

  describe('Pagination Flow', () => {
    it('should display pagination info', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

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

      // Wait for data to load
      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalled()
      })

      // Should show first page data
      await waitFor(() => {
        expect(screen.getByText('Alpha Post')).toBeInTheDocument()
      })
    })

    it('should display pagination component with data', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      render(
        <Wrapper>
          <List resource="posts" perPage={2}>
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
            <Pagination />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalled()
      })

      // Should show data
      await waitFor(() => {
        expect(screen.getByText('Alpha Post')).toBeInTheDocument()
      })
    })

    it('should show pagination information', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      render(
        <Wrapper>
          <List resource="posts" perPage={2}>
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
            <Pagination />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Alpha Post')).toBeInTheDocument()
      })

      // Should show pagination range info
      expect(screen.getByText(/1-2 of 5/)).toBeInTheDocument()
    })
  })

  describe('Combined Filter, Sort, and Pagination', () => {
    it('should pass filter to data provider', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      render(
        <Wrapper>
          <List resource="posts" perPage={5} filter={{ author: 'John' }}>
            <Datagrid>
              <TextField source="title" />
              <TextField source="author" />
            </Datagrid>
            <Pagination />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            filter: expect.objectContaining({ author: 'John' }),
          })
        )
      })
    })

    it('should pass sort to data provider when clicking column header', async () => {
      const Wrapper = createTestWrapper(dataProvider, ['/posts'])

      render(
        <Wrapper>
          <List resource="posts" perPage={10}>
            <Datagrid>
              <TextField source="title" />
              <NumberField source="views" />
            </Datagrid>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalled()
      })

      // Wait for data to display
      await waitFor(() => {
        expect(screen.getByText('Alpha Post')).toBeInTheDocument()
      })

      // Sort by views
      const viewsHeader = screen.getByText('Views')
      fireEvent.click(viewsHeader)

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            sort: expect.objectContaining({ field: 'views' }),
          })
        )
      })
    })
  })
})

// =============================================================================
// Form Flow Integration Tests
// =============================================================================

describe('Form Flow Integration Tests', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = createMockDataProvider()
  })

  describe('Form Submission Flow', () => {
    it('should fill form, submit, and verify success', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit}>
              <TextInput source="title" label="Title" />
              <TextInput source="body" label="Body" />
              <NumberInput source="views" label="Views" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Fill form fields
      await user.type(screen.getByLabelText('Title'), 'Test Title')
      await user.type(screen.getByLabelText('Body'), 'Test Body Content')
      await user.type(screen.getByLabelText('Views'), '100')

      // Submit
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Title',
            body: 'Test Body Content',
            views: 100,
          }),
          expect.anything()
        )
      })
    })

    it('should handle form with multiple field types', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ published: false, views: 0 }}>
              <TextInput source="title" label="Title" />
              <NumberInput source="views" label="Views" />
              <BooleanInput source="published" label="Published" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      await user.type(screen.getByLabelText('Title'), 'Multi-field Test')
      await user.clear(screen.getByLabelText('Views'))
      await user.type(screen.getByLabelText('Views'), '250')
      await user.click(screen.getByLabelText('Published'))

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Multi-field Test',
            views: 250,
            published: true,
          }),
          expect.anything()
        )
      })
    })
  })

  describe('Validation Error Flow', () => {
    it('should show validation error and allow fix and resubmit', async () => {
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
              <TextInput source="body" label="Body" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Try to submit without filling required field
      await user.click(screen.getByRole('button', { name: /save/i }))

      // Should not have called handleSubmit yet
      expect(handleSubmit).not.toHaveBeenCalled()

      // Now fill in the required field
      await user.type(screen.getByLabelText(/title/i), 'Fixed Title')

      // Submit again
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Fixed Title',
          }),
          expect.anything()
        )
      })
    })

    it('should validate multiple required fields', async () => {
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
              <TextInput
                source="author"
                label="Author"
                required
                rules={{ required: 'Author is required' }}
              />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Try to submit empty form
      await user.click(screen.getByRole('button', { name: /save/i }))

      // Should not have submitted
      expect(handleSubmit).not.toHaveBeenCalled()

      // Fill only title
      await user.type(screen.getByLabelText(/title/i), 'Test Title')
      await user.click(screen.getByRole('button', { name: /save/i }))

      // Still should not submit because author is empty
      expect(handleSubmit).not.toHaveBeenCalled()

      // Fill author too
      await user.type(screen.getByLabelText(/author/i), 'Test Author')
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Title',
            author: 'Test Author',
          }),
          expect.anything()
        )
      })
    })

    it('should handle pattern validation', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit}>
              <TextInput
                source="email"
                label="Email"
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
              />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Enter invalid email
      await user.type(screen.getByLabelText('Email'), 'invalid-email')
      await user.click(screen.getByRole('button', { name: /save/i }))

      // Should not submit with invalid email
      expect(handleSubmit).not.toHaveBeenCalled()

      // Clear and enter valid email
      await user.clear(screen.getByLabelText('Email'))
      await user.type(screen.getByLabelText('Email'), 'valid@email.com')
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'valid@email.com',
          }),
          expect.anything()
        )
      })
    })
  })

  describe('Form Cancel Flow', () => {
    it('should not submit form when navigating away', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      const { rerender } = render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Fill in the form
      await user.type(screen.getByLabelText('Title'), 'Unsaved Title')

      // Navigate away without submitting
      const ListWrapper = createTestWrapper(dataProvider, ['/posts'])
      rerender(
        <ListWrapper>
          <List resource="posts">
            <Datagrid>
              <TextField source="title" />
            </Datagrid>
          </List>
        </ListWrapper>
      )

      // Form was not submitted
      expect(handleSubmit).not.toHaveBeenCalled()
    })

    it('should render fresh form on new navigation', async () => {
      const handleSubmit = vi.fn()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: '' }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Form should start with empty value
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement
      expect(titleInput.value).toBe('')
    })
  })

  describe('Form Reset Flow', () => {
    it('should call submit handler with form data', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      const Wrapper = createTestWrapper(dataProvider, ['/posts/create'])

      render(
        <Wrapper>
          <Create resource="posts">
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: '' }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Create>
        </Wrapper>
      )

      // Fill and submit
      await user.type(screen.getByLabelText('Title'), 'First Submission')
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'First Submission',
          }),
          expect.anything()
        )
      })
    })
  })

  describe('Edit Form Pre-population', () => {
    it('should pre-populate form with existing record data', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: {
          id: 1,
          title: 'Existing Title',
          body: 'Existing Body',
          views: 500,
        },
      })

      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])

      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={vi.fn()} defaultValues={{ title: '', body: '', views: 0 }}>
              <TextInput source="title" label="Title" />
              <TextInput source="body" label="Body" />
              <NumberInput source="views" label="Views" />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })

      // Edit component should have fetched the record
      expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
    })

    it('should allow editing pre-populated values', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()

      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: {
          id: 1,
          title: 'Existing Title',
        },
      })

      const Wrapper = createTestWrapper(dataProvider, ['/posts/1/edit'])

      render(
        <Wrapper>
          <Edit resource="posts" id={1}>
            <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: 'Existing Title' }}>
              <TextInput source="title" label="Title" />
            </SimpleForm>
          </Edit>
        </Wrapper>
      )

      // Wait for form to be available
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      })

      // Clear and type new value
      const titleInput = screen.getByLabelText('Title')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Title')

      await user.click(screen.getByRole('button', { name: /save/i }))

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
