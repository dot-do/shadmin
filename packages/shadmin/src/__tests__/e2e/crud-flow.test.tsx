/**
 * E2E Tests for CRUD Flow
 *
 * Tests the complete user journey: List -> Create -> Edit -> Delete
 * Uses React Testing Library with mocked DataProvider
 *
 * Epic: ui-yuga (Shadmin Testing Infrastructure)
 * Issue: ui-p4cv
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import { MemoryRouter, Routes, Route, useNavigate, useLocation } from 'react-router'
import { List } from '../../components/list/List'
import { Create } from '../../components/create/Create'
import { Edit } from '../../components/edit/Edit'
import { Datagrid } from '../../components/list/Datagrid'
import { SimpleForm } from '../../components/form/SimpleForm'
import { TextInput } from '../../components/input/TextInput'
import { Confirm } from '../../components/feedback/Confirm'
import { Button } from '../../components/Button'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ResourceContextProvider } from '../../contexts/ResourceContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import { useCreateContext } from '../../components/create/CreateContext'
import { useRecordContext } from '../../contexts/RecordContext'
import { useDelete } from '../../hooks/useDelete'
import type { DataProvider, RaRecord, Identifier } from '../../types'

// --------------------------------------------------------------------------
// Test Data
// --------------------------------------------------------------------------

interface Post extends RaRecord {
  id: Identifier
  title: string
  body: string
  createdAt: string
}

const mockPosts: Post[] = [
  { id: 1, title: 'First Post', body: 'Content of first post', createdAt: '2024-01-01' },
  { id: 2, title: 'Second Post', body: 'Content of second post', createdAt: '2024-01-02' },
  { id: 3, title: 'Third Post', body: 'Content of third post', createdAt: '2024-01-03' },
  { id: 4, title: 'Fourth Post', body: 'Content of fourth post', createdAt: '2024-01-04' },
  { id: 5, title: 'Fifth Post', body: 'Content of fifth post', createdAt: '2024-01-05' },
]

// --------------------------------------------------------------------------
// Helper Components
// --------------------------------------------------------------------------

/**
 * TextField component for displaying text in datagrid
 */
function TextField({ source }: { source: string }) {
  const record = useRecordContext()
  if (!record) return null
  return <span data-testid={`field-${source}`}>{String(record[source] ?? '')}</span>
}

/**
 * Custom CreateForm that uses useCreateContext
 */
function CreateForm() {
  const { save, saving } = useCreateContext()

  const handleSubmit = (data: Record<string, unknown>) => {
    save(data)
  }

  return (
    <SimpleForm onSubmit={handleSubmit} defaultValues={{ title: '', body: '' }}>
      <TextInput source="title" label="Title" />
      <TextInput source="body" label="Body" multiline rows={4} />
      <Button type="submit" loading={saving} data-testid="save-button">
        Save
      </Button>
    </SimpleForm>
  )
}

/**
 * Custom EditForm that uses RecordContext
 */
function EditForm({ onSave }: { onSave: (data: Record<string, unknown>) => void }) {
  const record = useRecordContext<Post>()

  if (!record) return <div data-testid="edit-form-loading">Loading form...</div>

  return (
    <SimpleForm
      onSubmit={onSave}
      defaultValues={{ title: record.title, body: record.body }}
      record={record}
    >
      <TextInput source="title" label="Title" />
      <TextInput source="body" label="Body" multiline rows={4} />
      <Button type="submit" data-testid="save-button">
        Save
      </Button>
    </SimpleForm>
  )
}

/**
 * Delete button with confirmation dialog
 */
function DeleteButtonWithConfirm({ recordId }: { recordId: Identifier }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteRecord, { isPending }] = useDelete()
  const navigate = useNavigate()

  const handleDelete = useCallback(async () => {
    await deleteRecord('posts', { id: recordId })
    setShowConfirm(false)
    navigate('/posts')
  }, [deleteRecord, recordId, navigate])

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setShowConfirm(true)}
        data-testid="delete-button"
      >
        Delete
      </Button>
      <Confirm
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete this post?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={isPending}
      />
    </>
  )
}

/**
 * Location display for testing navigation
 */
function LocationDisplay() {
  const location = useLocation()
  return <span data-testid="current-location">{location.pathname}</span>
}

// --------------------------------------------------------------------------
// App Component (simulates the full CRUD app)
// --------------------------------------------------------------------------

interface CRUDAppProps {
  dataProvider: DataProvider
  initialEntries?: string[]
}

function CRUDApp({ dataProvider, initialEntries = ['/posts'] }: CRUDAppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <MemoryRouter initialEntries={initialEntries}>
            <ResourceContextProvider value="posts">
              <LocationDisplay />
              <Routes>
                <Route
                  path="/posts"
                  element={
                    <List resource="posts" title="Posts">
                      <Datagrid rowClick="edit" hover>
                        <TextField source="title" />
                        <TextField source="body" />
                        <TextField source="createdAt" />
                      </Datagrid>
                    </List>
                  }
                />
                <Route
                  path="/posts/create"
                  element={
                    <Create resource="posts" title="Create Post">
                      <CreateForm />
                    </Create>
                  }
                />
                <Route
                  path="/posts/:id"
                  element={
                    <EditPage dataProvider={dataProvider} />
                  }
                />
              </Routes>
            </ResourceContextProvider>
          </MemoryRouter>
        </DataProviderContextProvider>
      </NotificationContextProvider>
    </QueryClientProvider>
  )
}

/**
 * Edit page wrapper that extracts ID and handles save
 */
function EditPage({ dataProvider }: { dataProvider: DataProvider }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Extract ID from path
  const pathParts = location.pathname.split('/')
  const idStr = pathParts[pathParts.length - 1] ?? ''
  const id = isNaN(Number(idStr)) ? idStr : Number(idStr)

  const handleSave = useCallback(async (data: Record<string, unknown>) => {
    await dataProvider.update('posts', {
      id,
      data,
      previousData: undefined
    })
    navigate('/posts')
  }, [dataProvider, id, navigate])

  return (
    <Edit resource="posts" id={id} title="Edit Post">
      <EditForm onSave={handleSave} />
      <DeleteButtonWithConfirm recordId={id} />
    </Edit>
  )
}

// --------------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------------

describe('CRUD Flow E2E', () => {
  let dataProvider: DataProvider
  let currentData: Post[]

  beforeEach(() => {
    // Reset data for each test
    currentData = [...mockPosts]

    dataProvider = {
      getList: vi.fn().mockImplementation(async (_resource, params) => {
        let filteredData = [...currentData]

        // Apply sorting
        if (params.sort?.field) {
          filteredData.sort((a, b) => {
            const aVal = String(a[params.sort.field as keyof Post] ?? '')
            const bVal = String(b[params.sort.field as keyof Post] ?? '')
            const comparison = aVal.localeCompare(bVal)
            return params.sort.order === 'DESC' ? -comparison : comparison
          })
        }

        // Apply filtering
        if (params.filter) {
          Object.entries(params.filter).forEach(([key, value]) => {
            if (value) {
              filteredData = filteredData.filter((item) => {
                const itemValue = String(item[key as keyof Post] ?? '').toLowerCase()
                return itemValue.includes(String(value).toLowerCase())
              })
            }
          })
        }

        // Apply pagination
        const { page = 1, perPage = 10 } = params.pagination ?? {}
        const start = (page - 1) * perPage
        const paginatedData = filteredData.slice(start, start + perPage)

        return {
          data: paginatedData,
          total: filteredData.length,
        }
      }),

      getOne: vi.fn().mockImplementation(async (_resource, params) => {
        // Handle both string and number IDs
        const recordId = typeof params.id === 'string' ? parseInt(params.id, 10) : params.id
        const record = currentData.find((item) => item.id === recordId)
        if (!record) {
          throw new Error('Record not found')
        }
        return { data: record }
      }),

      getMany: vi.fn().mockImplementation(async (_resource, params) => {
        const records = currentData.filter((item) => {
          return params.ids.some((id: Identifier) => {
            const searchId = typeof id === 'string' ? parseInt(id, 10) : id
            return item.id === searchId
          })
        })
        return { data: records }
      }),

      getManyReference: vi.fn().mockResolvedValue({ data: [], total: 0 }),

      create: vi.fn().mockImplementation(async (_resource, params) => {
        const newId = Math.max(...currentData.map((p) => Number(p.id))) + 1
        const newRecord: Post = {
          id: newId,
          title: params.data.title as string,
          body: params.data.body as string,
          createdAt: new Date().toISOString().split('T')[0]!,
        }
        currentData.push(newRecord)
        return { data: newRecord }
      }),

      update: vi.fn().mockImplementation(async (_resource, params) => {
        const recordId = typeof params.id === 'string' ? parseInt(params.id, 10) : params.id
        const index = currentData.findIndex((item) => item.id === recordId)
        if (index === -1) {
          throw new Error('Record not found')
        }
        currentData[index] = {
          ...currentData[index]!,
          ...params.data,
          id: recordId,
        } as Post
        return { data: currentData[index]! }
      }),

      updateMany: vi.fn().mockResolvedValue({ data: [] }),

      delete: vi.fn().mockImplementation(async (_resource, params) => {
        const recordId = typeof params.id === 'string' ? parseInt(params.id, 10) : params.id
        const index = currentData.findIndex((item) => item.id === recordId)
        if (index === -1) {
          throw new Error('Record not found')
        }
        const deleted = currentData.splice(index, 1)[0]!
        return { data: deleted }
      }),

      deleteMany: vi.fn().mockImplementation(async (_resource, params) => {
        const deletedIds: Identifier[] = []
        params.ids.forEach((id: Identifier) => {
          const recordId = typeof id === 'string' ? parseInt(id, 10) : id
          const index = currentData.findIndex((item) => item.id === recordId)
          if (index !== -1) {
            currentData.splice(index, 1)
            deletedIds.push(id)
          }
        })
        return { data: deletedIds }
      }),
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // --------------------------------------------------------------------------
  // List View Tests
  // --------------------------------------------------------------------------

  describe('List View', () => {
    it('displays list of records', async () => {
      render(<CRUDApp dataProvider={dataProvider} />)

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByTestId('shadmin-datagrid')).toBeInTheDocument()
      })

      // Verify records are displayed
      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument()
        expect(screen.getByText('Second Post')).toBeInTheDocument()
        expect(screen.getByText('Third Post')).toBeInTheDocument()
      })

      // Verify getList was called
      expect(dataProvider.getList).toHaveBeenCalledWith(
        'posts',
        expect.objectContaining({
          pagination: expect.any(Object),
          sort: expect.any(Object),
          filter: expect.any(Object),
        })
      )
    })

    it('displays correct number of rows', async () => {
      render(<CRUDApp dataProvider={dataProvider} />)

      await waitFor(() => {
        expect(screen.getByTestId('shadmin-datagrid')).toBeInTheDocument()
      })

      // Count rows (excluding header)
      await waitFor(() => {
        const rows = screen.getAllByTestId(/^shadmin-datagrid-row-/)
        expect(rows.length).toBe(5)
      })
    })

    it('displays table headers correctly', async () => {
      render(<CRUDApp dataProvider={dataProvider} />)

      await waitFor(() => {
        expect(screen.getByTestId('shadmin-datagrid')).toBeInTheDocument()
      })

      // Check column headers
      await waitFor(() => {
        expect(screen.getByTestId('column-header-title')).toBeInTheDocument()
        expect(screen.getByTestId('column-header-body')).toBeInTheDocument()
        expect(screen.getByTestId('column-header-createdAt')).toBeInTheDocument()
      })
    })

    it('can sort by column when clicking header', async () => {
      render(<CRUDApp dataProvider={dataProvider} />)

      await waitFor(() => {
        expect(screen.getByTestId('shadmin-datagrid')).toBeInTheDocument()
      })

      // Click on title header to sort
      const titleHeader = screen.getByTestId('column-header-title')
      fireEvent.click(titleHeader)

      // Verify sort was applied
      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            sort: expect.objectContaining({
              field: 'title',
            }),
          })
        )
      })
    })

    it('shows empty state when no records exist', async () => {
      // Override getList to return empty data
      dataProvider.getList = vi.fn().mockResolvedValue({ data: [], total: 0 })

      render(<CRUDApp dataProvider={dataProvider} />)

      await waitFor(() => {
        expect(screen.getByText('No data available')).toBeInTheDocument()
      })
    })
  })

  // --------------------------------------------------------------------------
  // Create Flow Tests
  // --------------------------------------------------------------------------

  describe('Create Flow', () => {
    it('creates a new record', async () => {
      const user = userEvent.setup()

      render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts/create']} />)

      // Wait for form to render
      await waitFor(() => {
        expect(screen.getByTestId('shadmin-form')).toBeInTheDocument()
      })

      // Fill in the form
      const titleInput = screen.getByLabelText('Title')
      const bodyInput = screen.getByLabelText('Body')

      await user.type(titleInput, 'New Test Post')
      await user.type(bodyInput, 'This is the body of the new post')

      // Submit the form
      const saveButton = screen.getByTestId('save-button')
      await user.click(saveButton)

      // Verify create was called with correct data
      await waitFor(() => {
        expect(dataProvider.create).toHaveBeenCalledWith('posts', {
          data: expect.objectContaining({
            title: 'New Test Post',
            body: 'This is the body of the new post',
          }),
        })
      })
    })

    it('shows title on create page', async () => {
      render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts/create']} />)

      await waitFor(() => {
        expect(screen.getByText('Create Post')).toBeInTheDocument()
      })
    })

    it('redirects to list after successful create', async () => {
      const user = userEvent.setup()

      render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts/create']} />)

      await waitFor(() => {
        expect(screen.getByTestId('shadmin-form')).toBeInTheDocument()
      })

      // Fill and submit
      const titleInput = screen.getByLabelText('Title')
      await user.type(titleInput, 'Test')

      const saveButton = screen.getByTestId('save-button')
      await user.click(saveButton)

      // Verify redirect
      await waitFor(() => {
        expect(screen.getByTestId('current-location')).toHaveTextContent('/posts')
      })
    })
  })

  // --------------------------------------------------------------------------
  // Edit Flow Tests
  // --------------------------------------------------------------------------

  describe('Edit Flow', () => {
    it('edits an existing record', async () => {
      const user = userEvent.setup()

      render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts/1']} />)

      // Wait for form to load with existing data
      await waitFor(() => {
        expect(screen.getByTestId('shadmin-form')).toBeInTheDocument()
      })

      // Wait for the record to be loaded
      await waitFor(() => {
        const titleInput = screen.getByLabelText('Title') as HTMLInputElement
        expect(titleInput.value).toBe('First Post')
      })

      // Clear and update the title
      const titleInput = screen.getByLabelText('Title')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Post Title')

      // Submit the form
      const saveButton = screen.getByTestId('save-button')
      await user.click(saveButton)

      // Verify update was called with correct data
      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalledWith('posts', {
          id: 1,
          data: expect.objectContaining({
            title: 'Updated Post Title',
          }),
          previousData: undefined,
        })
      })
    })

    it('loads existing record data into form', async () => {
      render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts/1']} />)

      await waitFor(() => {
        const titleInput = screen.getByLabelText('Title') as HTMLInputElement
        expect(titleInput.value).toBe('First Post')
      })

      await waitFor(() => {
        const bodyInput = screen.getByLabelText('Body') as HTMLTextAreaElement
        expect(bodyInput.value).toBe('Content of first post')
      })
    })

    it('shows loading state while fetching record', async () => {
      // Add delay to getOne to see loading state
      dataProvider.getOne = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockPosts[0] }), 100))
      )

      render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts/1']} />)

      // Should show loading initially
      expect(screen.getByTestId('edit-loading')).toBeInTheDocument()

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByTestId('edit-loading')).not.toBeInTheDocument()
      })
    })

    it('shows error when record not found', async () => {
      dataProvider.getOne = vi.fn().mockRejectedValue(new Error('Record not found'))

      render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts/999']} />)

      await waitFor(() => {
        expect(screen.getByTestId('edit-error')).toBeInTheDocument()
      })
    })
  })

  // --------------------------------------------------------------------------
  // Delete Flow Tests
  // --------------------------------------------------------------------------

  describe('Delete Flow', () => {
    it('deletes a record with confirmation', async () => {
      const user = userEvent.setup()

      render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts/1']} />)

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getByTestId('delete-button')).toBeInTheDocument()
      })

      // Click delete button
      await user.click(screen.getByTestId('delete-button'))

      // Confirm dialog should appear
      await waitFor(() => {
        expect(screen.getByTestId('shadmin-confirm-dialog')).toBeInTheDocument()
        expect(screen.getByText('Delete this post?')).toBeInTheDocument()
      })

      // Click confirm
      await user.click(screen.getByTestId('shadmin-confirm-submit'))

      // Verify delete was called
      await waitFor(() => {
        expect(dataProvider.delete).toHaveBeenCalledWith('posts', { id: 1 })
      })
    })

    it('can cancel delete operation', async () => {
      const user = userEvent.setup()

      render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts/1']} />)

      await waitFor(() => {
        expect(screen.getByTestId('delete-button')).toBeInTheDocument()
      })

      // Click delete button
      await user.click(screen.getByTestId('delete-button'))

      // Confirm dialog should appear
      await waitFor(() => {
        expect(screen.getByTestId('shadmin-confirm-dialog')).toBeInTheDocument()
      })

      // Click cancel
      await user.click(screen.getByTestId('shadmin-confirm-cancel'))

      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByTestId('shadmin-confirm-dialog')).not.toBeInTheDocument()
      })

      // Delete should not be called
      expect(dataProvider.delete).not.toHaveBeenCalled()
    })

    it('redirects to list after successful delete', async () => {
      const user = userEvent.setup()

      render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts/1']} />)

      await waitFor(() => {
        expect(screen.getByTestId('delete-button')).toBeInTheDocument()
      })

      // Delete the record
      await user.click(screen.getByTestId('delete-button'))

      await waitFor(() => {
        expect(screen.getByTestId('shadmin-confirm-dialog')).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('shadmin-confirm-submit'))

      // Wait for redirect to list
      await waitFor(() => {
        expect(screen.getByTestId('current-location')).toHaveTextContent('/posts')
      })
    })
  })

  // --------------------------------------------------------------------------
  // Full CRUD Cycle Test
  // --------------------------------------------------------------------------

  describe('Full CRUD Cycle', () => {
    it('completes full CRUD cycle: List -> Create -> Edit -> Delete', async () => {
      const user = userEvent.setup()

      // Step 1: Start at list view and verify
      const { unmount } = render(<CRUDApp dataProvider={dataProvider} initialEntries={['/posts']} />)

      await waitFor(() => {
        expect(screen.getByTestId('shadmin-datagrid')).toBeInTheDocument()
        expect(screen.getByText('First Post')).toBeInTheDocument()
      })

      // Verify getList was called (verifies List view works)
      expect(dataProvider.getList).toHaveBeenCalled()
      unmount()

      // Step 2: Test Create flow
      const { unmount: unmount2 } = render(
        <CRUDApp dataProvider={dataProvider} initialEntries={['/posts/create']} />
      )

      await waitFor(() => {
        expect(screen.getByTestId('shadmin-form')).toBeInTheDocument()
      })

      const titleInput = screen.getByLabelText('Title')
      await user.type(titleInput, 'CRUD Test Post')

      await user.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(dataProvider.create).toHaveBeenCalledWith('posts', {
          data: expect.objectContaining({ title: 'CRUD Test Post' }),
        })
      })

      // Verify post was created in the mock data
      expect(currentData.length).toBe(6)
      expect(currentData.find((p) => p.title === 'CRUD Test Post')).toBeTruthy()
      unmount2()

      // Step 3: Test Edit flow
      const newPostId = currentData.find((p) => p.title === 'CRUD Test Post')?.id
      const { unmount: unmount3 } = render(
        <CRUDApp dataProvider={dataProvider} initialEntries={[`/posts/${newPostId}`]} />
      )

      await waitFor(() => {
        const editTitleInput = screen.getByLabelText('Title') as HTMLInputElement
        expect(editTitleInput.value).toBe('CRUD Test Post')
      })

      // Verify getOne was called (verifies Edit view works)
      expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: newPostId }))
      unmount3()

      // Step 4: Test Delete flow
      const { unmount: unmount4 } = render(
        <CRUDApp dataProvider={dataProvider} initialEntries={[`/posts/${newPostId}`]} />
      )

      await waitFor(() => {
        expect(screen.getByTestId('delete-button')).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('delete-button'))

      await waitFor(() => {
        expect(screen.getByTestId('shadmin-confirm-dialog')).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('shadmin-confirm-submit'))

      await waitFor(() => {
        expect(dataProvider.delete).toHaveBeenCalledWith('posts', { id: newPostId })
      })

      // Verify post was deleted from mock data
      expect(currentData.find((p) => p.title === 'CRUD Test Post')).toBeUndefined()
      expect(currentData.length).toBe(5) // Back to original count
      unmount4()
    })
  })
})
