import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { ReferenceArrayField } from './ReferenceArrayField'
import { TextField } from './TextField'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { RecordContextProvider } from '../../contexts/RecordContext'

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
  getMany: ReturnType<typeof vi.fn>
}> = {}) {
  return {
    getList: vi.fn(),
    getOne: vi.fn(),
    getMany: overrides.getMany ?? vi.fn().mockResolvedValue({
      data: [
        { id: 1, name: 'Tag 1' },
        { id: 2, name: 'Tag 2' },
      ],
    }),
    getManyReference: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  }
}

describe('ReferenceArrayField', () => {
  describe('data fetching', () => {
    it('should fetch multiple referenced records using useGetMany', async () => {
      const getManyMock = vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'Tag 1' },
          { id: 2, name: 'Tag 2' },
          { id: 3, name: 'Tag 3' },
        ],
      })
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Test Post', tagIds: [1, 2, 3] }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Tag 1')).toBeInTheDocument()
        expect(screen.getByText('Tag 2')).toBeInTheDocument()
        expect(screen.getByText('Tag 3')).toBeInTheDocument()
      })

      expect(getManyMock).toHaveBeenCalledWith('tags', { ids: [1, 2, 3] })
    })

    it('should display loading state while fetching', async () => {
      let resolvePromise: (value: { data: Array<{ id: number; name: string }> }) => void
      const getManyMock = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolvePromise = resolve
        })
      })
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, tagIds: [1, 2] }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      // Should show loading state initially
      expect(screen.getByTestId('reference-array-field-loading')).toBeInTheDocument()

      // Resolve the promise
      resolvePromise!({
        data: [
          { id: 1, name: 'Loaded Tag 1' },
          { id: 2, name: 'Loaded Tag 2' },
        ],
      })

      await waitFor(() => {
        expect(screen.getByText('Loaded Tag 1')).toBeInTheDocument()
        expect(screen.getByText('Loaded Tag 2')).toBeInTheDocument()
      })
    })

    it('should handle error state when fetch fails', async () => {
      const getManyMock = vi.fn().mockRejectedValue(new Error('Network error'))
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, tagIds: [1, 2] }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('reference-array-field-error')).toBeInTheDocument()
      })
    })
  })

  describe('source prop', () => {
    it('should get reference IDs array from source field in record', async () => {
      const getManyMock = vi.fn().mockResolvedValue({
        data: [
          { id: 10, name: 'Category A' },
          { id: 20, name: 'Category B' },
        ],
      })
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, categoryIds: [10, 20] }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="categoryIds" reference="categories">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyMock).toHaveBeenCalledWith('categories', { ids: [10, 20] })
      })
    })

    it('should support nested source path', async () => {
      const getManyMock = vi.fn().mockResolvedValue({
        data: [{ id: 5, name: 'Nested Tag' }],
      })
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, meta: { tagIds: [5] } }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="meta.tagIds" reference="tags">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyMock).toHaveBeenCalledWith('tags', { ids: [5] })
      })
    })
  })

  describe('record prop', () => {
    it('should use record prop over RecordContext', async () => {
      const getManyMock = vi.fn().mockResolvedValue({
        data: [{ id: 99, name: 'From Prop' }],
      })
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const contextRecord = { id: 1, tagIds: [50, 51] }
      const propRecord = { id: 2, tagIds: [99] }

      render(
        <Wrapper>
          <RecordContextProvider value={contextRecord}>
            <ReferenceArrayField source="tagIds" reference="tags" record={propRecord}>
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getManyMock).toHaveBeenCalledWith('tags', { ids: [99] })
      })
    })
  })

  describe('children rendering', () => {
    it('should render children for each referenced record with separate RecordContexts', async () => {
      const getManyMock = vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'Tag 1', color: 'red' },
          { id: 2, name: 'Tag 2', color: 'blue' },
        ],
      })
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, tagIds: [1, 2] }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Tag 1')).toBeInTheDocument()
        expect(screen.getByText('Tag 2')).toBeInTheDocument()
      })
    })

    it('should render items as a list by default', async () => {
      const getManyMock = vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'Tag 1' },
          { id: 2, name: 'Tag 2' },
        ],
      })
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, tagIds: [1, 2] }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags" data-testid="ref-array">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const container = screen.getByTestId('ref-array')
        // Check that items are rendered within the container
        expect(within(container).getByText('Tag 1')).toBeInTheDocument()
        expect(within(container).getByText('Tag 2')).toBeInTheDocument()
      })
    })
  })

  describe('empty value handling', () => {
    it('should render emptyText when source value is null', async () => {
      const getManyMock = vi.fn()
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, tagIds: null }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags" emptyText="No tags">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      expect(screen.getByText('No tags')).toBeInTheDocument()
      expect(getManyMock).not.toHaveBeenCalled()
    })

    it('should render emptyText when source value is undefined', async () => {
      const getManyMock = vi.fn()
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags" emptyText="N/A">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      expect(screen.getByText('N/A')).toBeInTheDocument()
      expect(getManyMock).not.toHaveBeenCalled()
    })

    it('should render emptyText when source value is an empty array', async () => {
      const getManyMock = vi.fn()
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, tagIds: [] }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags" emptyText="No tags assigned">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      expect(screen.getByText('No tags assigned')).toBeInTheDocument()
      expect(getManyMock).not.toHaveBeenCalled()
    })

    it('should render nothing by default when source value is empty', async () => {
      const getManyMock = vi.fn()
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, tagIds: null }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags" data-testid="ref-array">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      const element = screen.getByTestId('ref-array')
      expect(element).toBeEmptyDOMElement()
    })
  })

  describe('className support', () => {
    it('should apply className to the wrapper element', async () => {
      const getManyMock = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
      })
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, tagIds: [1] }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField
              source="tagIds"
              reference="tags"
              className="custom-class"
              data-testid="ref-array"
            >
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const element = screen.getByTestId('ref-array')
        expect(element).toHaveClass('custom-class')
      })
    })
  })

  describe('label support', () => {
    it('should render label when provided', async () => {
      const getManyMock = vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'Tag 1' },
          { id: 2, name: 'Tag 2' },
        ],
      })
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, tagIds: [1, 2] }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags" label="Tags">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Tags')).toBeInTheDocument()
        expect(screen.getByText('Tag 1')).toBeInTheDocument()
        expect(screen.getByText('Tag 2')).toBeInTheDocument()
      })
    })
  })

  describe('order preservation', () => {
    it('should preserve the order of IDs from the source field', async () => {
      const getManyMock = vi.fn().mockResolvedValue({
        data: [
          { id: 3, name: 'Third' },
          { id: 1, name: 'First' },
          { id: 2, name: 'Second' },
        ],
      })
      const dataProvider = createMockDataProvider({ getMany: getManyMock })
      const Wrapper = createWrapper(dataProvider)

      // Order in record should be 1, 2, 3
      const record = { id: 1, tagIds: [1, 2, 3] }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceArrayField source="tagIds" reference="tags" data-testid="ref-array">
              <TextField source="name" />
            </ReferenceArrayField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const container = screen.getByTestId('ref-array')
        const items = within(container).getAllByText(/First|Second|Third/)
        // The items should be in the order specified by the source field: First, Second, Third
        expect(items[0]).toHaveTextContent('First')
        expect(items[1]).toHaveTextContent('Second')
        expect(items[2]).toHaveTextContent('Third')
      })
    })
  })
})
