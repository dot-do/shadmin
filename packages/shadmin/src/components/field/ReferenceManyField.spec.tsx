import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ReferenceManyField } from './ReferenceManyField'
import { TextField } from './TextField'

// Helper to create test wrapper with providers
function createWrapper(dataProvider: ReturnType<typeof createMockDataProvider>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          {children}
        </DataProviderContextProvider>
      </QueryClientProvider>
    )
  }
}

// Mock data provider factory
function createMockDataProvider(overrides: Partial<{
  getManyReference: ReturnType<typeof vi.fn>
}> = {}) {
  return {
    getList: vi.fn(),
    getOne: vi.fn(),
    getMany: vi.fn(),
    getManyReference: overrides.getManyReference ?? vi.fn().mockResolvedValue({
      data: [
        { id: 1, body: 'Comment 1', post_id: 1 },
        { id: 2, body: 'Comment 2', post_id: 1 },
      ],
      total: 2,
    }),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  }
}

describe('ReferenceManyField', () => {
  describe('data fetching', () => {
    it('should fetch related records using useGetManyReference', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [
          { id: 1, body: 'First comment', post_id: 1 },
          { id: 2, body: 'Second comment', post_id: 1 },
          { id: 3, body: 'Third comment', post_id: 1 },
        ],
        total: 3,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Test Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="id" reference="comments" target="post_id">
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('First comment')).toBeInTheDocument()
        expect(screen.getByText('Second comment')).toBeInTheDocument()
        expect(screen.getByText('Third comment')).toBeInTheDocument()
      })

      expect(getManyReferenceMock).toHaveBeenCalledWith('comments', expect.objectContaining({
        target: 'post_id',
        id: 1,
      }))
    })

    it('should use target prop to specify foreign key field', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [{ id: 1, text: 'Review 1', product_id: 42 }],
        total: 1,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 42, name: 'Product' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="id" reference="reviews" target="product_id">
              <TextField source="text" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyReferenceMock).toHaveBeenCalledWith('reviews', expect.objectContaining({
          target: 'product_id',
          id: 42,
        }))
      })
    })

    it('should use reference prop to specify resource', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [{ id: 1, title: 'Article 1', author_id: 5 }],
        total: 1,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 5, name: 'Author' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="id" reference="articles" target="author_id">
              <TextField source="title" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyReferenceMock).toHaveBeenCalledWith('articles', expect.objectContaining({
          target: 'author_id',
          id: 5,
        }))
      })
    })
  })

  describe('children rendering', () => {
    it('should display children for each related record', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [
          { id: 1, body: 'Comment A', author: 'Alice' },
          { id: 2, body: 'Comment B', author: 'Bob' },
        ],
        total: 2,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="id" reference="comments" target="post_id">
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Comment A')).toBeInTheDocument()
        expect(screen.getByText('Comment B')).toBeInTheDocument()
      })
    })

    it('should render children for each record with separate RecordContexts', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [
          { id: 1, body: 'First', votes: 10 },
          { id: 2, body: 'Second', votes: 20 },
        ],
        total: 2,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="id" reference="comments" target="post_id" data-testid="ref-many">
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const container = screen.getByTestId('ref-many')
        expect(within(container).getByText('First')).toBeInTheDocument()
        expect(within(container).getByText('Second')).toBeInTheDocument()
      })
    })

    it('should render multiple children per record', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [
          { id: 1, body: 'Comment body', author: 'John' },
        ],
        total: 1,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="id" reference="comments" target="post_id">
              <TextField source="body" />
              <TextField source="author" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Comment body')).toBeInTheDocument()
        expect(screen.getByText('John')).toBeInTheDocument()
      })
    })
  })

  describe('loading state', () => {
    it('should display loading state while fetching', async () => {
      let resolvePromise: (value: { data: Array<{ id: number; body: string }>; total: number }) => void
      const getManyReferenceMock = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolvePromise = resolve
        })
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="id" reference="comments" target="post_id">
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      // Should show loading state initially
      expect(screen.getByTestId('reference-many-field-loading')).toBeInTheDocument()

      // Resolve the promise
      resolvePromise!({
        data: [{ id: 1, body: 'Loaded comment' }],
        total: 1,
      })

      await waitFor(() => {
        expect(screen.getByText('Loaded comment')).toBeInTheDocument()
      })

      // Loading state should be gone
      expect(screen.queryByTestId('reference-many-field-loading')).not.toBeInTheDocument()
    })
  })

  describe('error state', () => {
    it('should handle error state when fetch fails', async () => {
      const getManyReferenceMock = vi.fn().mockRejectedValue(new Error('Network error'))
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="id" reference="comments" target="post_id">
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('reference-many-field-error')).toBeInTheDocument()
      })
    })

    it('should display error message text', async () => {
      const getManyReferenceMock = vi.fn().mockRejectedValue(new Error('Failed to fetch'))
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="id" reference="comments" target="post_id">
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Error loading references/i)).toBeInTheDocument()
      })
    })
  })

  describe('empty state', () => {
    it('should render emptyText when no related records exist', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [],
        total: 0,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField
              source="id"
              reference="comments"
              target="post_id"
              emptyText="No comments yet"
            >
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('No comments yet')).toBeInTheDocument()
      })
    })

    it('should render nothing by default when no related records and no emptyText', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [],
        total: 0,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField
              source="id"
              reference="comments"
              target="post_id"
              data-testid="ref-many"
            >
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const element = screen.getByTestId('ref-many')
        expect(element).toBeEmptyDOMElement()
      })
    })
  })

  describe('source prop', () => {
    it('should get id from source field in record', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [{ id: 1, body: 'Comment' }],
        total: 1,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 99, uuid: 'abc-123', title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="uuid" reference="comments" target="post_uuid">
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyReferenceMock).toHaveBeenCalledWith('comments', expect.objectContaining({
          target: 'post_uuid',
          id: 'abc-123',
        }))
      })
    })

    it('should support nested source path', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [{ id: 1, body: 'Comment' }],
        total: 1,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, meta: { foreignId: 42 } }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField source="meta.foreignId" reference="comments" target="parent_id">
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyReferenceMock).toHaveBeenCalledWith('comments', expect.objectContaining({
          target: 'parent_id',
          id: 42,
        }))
      })
    })
  })

  describe('record prop', () => {
    it('should use record prop over RecordContext', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [{ id: 1, body: 'Comment from prop' }],
        total: 1,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const contextRecord = { id: 50, title: 'Context Post' }
      const propRecord = { id: 99, title: 'Prop Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={contextRecord}>
            <ReferenceManyField
              source="id"
              reference="comments"
              target="post_id"
              record={propRecord}
            >
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyReferenceMock).toHaveBeenCalledWith('comments', expect.objectContaining({
          id: 99,
        }))
      })
    })
  })

  describe('className support', () => {
    it('should apply className to the wrapper element', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [{ id: 1, body: 'Test' }],
        total: 1,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField
              source="id"
              reference="comments"
              target="post_id"
              className="custom-class"
              data-testid="ref-many"
            >
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const element = screen.getByTestId('ref-many')
        expect(element).toHaveClass('custom-class')
      })
    })
  })

  describe('label support', () => {
    it('should render label when provided', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [
          { id: 1, body: 'Comment 1' },
          { id: 2, body: 'Comment 2' },
        ],
        total: 2,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField
              source="id"
              reference="comments"
              target="post_id"
              label="Comments"
            >
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Comments')).toBeInTheDocument()
        expect(screen.getByText('Comment 1')).toBeInTheDocument()
        expect(screen.getByText('Comment 2')).toBeInTheDocument()
      })
    })
  })

  describe('pagination and sort props', () => {
    it('should pass pagination params to getManyReference', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [{ id: 1, body: 'Comment' }],
        total: 1,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField
              source="id"
              reference="comments"
              target="post_id"
              perPage={25}
              page={2}
            >
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyReferenceMock).toHaveBeenCalledWith('comments', expect.objectContaining({
          pagination: { page: 2, perPage: 25 },
        }))
      })
    })

    it('should pass sort params to getManyReference', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [{ id: 1, body: 'Comment' }],
        total: 1,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField
              source="id"
              reference="comments"
              target="post_id"
              sort={{ field: 'created_at', order: 'DESC' }}
            >
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyReferenceMock).toHaveBeenCalledWith('comments', expect.objectContaining({
          sort: { field: 'created_at', order: 'DESC' },
        }))
      })
    })
  })

  describe('filter prop', () => {
    it('should pass filter params to getManyReference', async () => {
      const getManyReferenceMock = vi.fn().mockResolvedValue({
        data: [{ id: 1, body: 'Approved comment', status: 'approved' }],
        total: 1,
      })
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField
              source="id"
              reference="comments"
              target="post_id"
              filter={{ status: 'approved' }}
            >
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyReferenceMock).toHaveBeenCalledWith('comments', expect.objectContaining({
          filter: { status: 'approved' },
        }))
      })
    })
  })

  describe('empty source handling', () => {
    it('should not fetch when source value is null', async () => {
      const getManyReferenceMock = vi.fn()
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: null, title: 'Post' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField
              source="id"
              reference="comments"
              target="post_id"
              emptyText="No ID"
              data-testid="ref-many"
            >
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      expect(screen.getByText('No ID')).toBeInTheDocument()
      expect(getManyReferenceMock).not.toHaveBeenCalled()
    })

    it('should not fetch when source value is undefined', async () => {
      const getManyReferenceMock = vi.fn()
      const dataProvider = createMockDataProvider({ getManyReference: getManyReferenceMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { title: 'Post without id' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceManyField
              source="id"
              reference="comments"
              target="post_id"
              data-testid="ref-many"
            >
              <TextField source="body" />
            </ReferenceManyField>
          </RecordContextProvider>
        </Wrapper>
      )

      const element = screen.getByTestId('ref-many')
      expect(element).toBeEmptyDOMElement()
      expect(getManyReferenceMock).not.toHaveBeenCalled()
    })
  })
})
