import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ReferenceField } from './ReferenceField'
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
  getOne: ReturnType<typeof vi.fn>
}> = {}) {
  return {
    getList: vi.fn(),
    getOne: overrides.getOne ?? vi.fn().mockResolvedValue({ data: { id: 1, name: 'John Doe' } }),
    getMany: vi.fn(),
    getManyReference: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  }
}

describe('ReferenceField', () => {
  describe('data fetching', () => {
    it('should fetch referenced record using useGetOne', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'Referenced Author' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, title: 'Test Post', authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Referenced Author')).toBeInTheDocument()
      })

      expect(getOneMock).toHaveBeenCalledWith('users', { id: 42 })
    })

    it('should display loading state while fetching', async () => {
      let resolvePromise: (value: { data: { id: number; name: string } }) => void
      const getOneMock = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolvePromise = resolve
        })
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      // Should show loading state initially
      expect(screen.getByTestId('reference-field-loading')).toBeInTheDocument()

      // Resolve the promise
      resolvePromise!({ data: { id: 42, name: 'Loaded Author' } })

      await waitFor(() => {
        expect(screen.getByText('Loaded Author')).toBeInTheDocument()
      })
    })

    it('should handle error state when fetch fails', async () => {
      const getOneMock = vi.fn().mockRejectedValue(new Error('Network error'))
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('reference-field-error')).toBeInTheDocument()
      })
    })
  })

  describe('source prop', () => {
    it('should get reference ID from source field in record', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 5, name: 'Category Name' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, categoryId: 5 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="categoryId" reference="categories">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getOneMock).toHaveBeenCalledWith('categories', { id: 5 })
      })
    })

    it('should support nested source path', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 10, name: 'Nested Ref' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, meta: { authorId: 10 } }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="meta.authorId" reference="users">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getOneMock).toHaveBeenCalledWith('users', { id: 10 })
      })
    })
  })

  describe('record prop', () => {
    it('should use record prop over RecordContext', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 99, name: 'From Prop' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const contextRecord = { id: 1, authorId: 50 }
      const propRecord = { id: 2, authorId: 99 }

      render(
        <Wrapper>
          <RecordContextProvider value={contextRecord}>
            <ReferenceField source="authorId" reference="users" record={propRecord}>
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(getOneMock).toHaveBeenCalledWith('users', { id: 99 })
      })
    })
  })

  describe('children rendering', () => {
    it('should render children with referenced record in RecordContext', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'John', email: 'john@example.com' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users">
              <TextField source="name" />
              <TextField source="email" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
        expect(screen.getByText('john@example.com')).toBeInTheDocument()
      })
    })

    it('should render a link by default if link prop is not false', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'John Doe' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users" link="show">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/users/42/show')
      })
    })

    it('should not render a link when link prop is false', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'John Doe' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users" link={false}>
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.queryByRole('link')).not.toBeInTheDocument()
      })
    })
  })

  describe('empty value handling', () => {
    it('should render emptyText when source value is null', async () => {
      const getOneMock = vi.fn()
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: null }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users" emptyText="No author">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      expect(screen.getByText('No author')).toBeInTheDocument()
      expect(getOneMock).not.toHaveBeenCalled()
    })

    it('should render emptyText when source value is undefined', async () => {
      const getOneMock = vi.fn()
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users" emptyText="N/A">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      expect(screen.getByText('N/A')).toBeInTheDocument()
      expect(getOneMock).not.toHaveBeenCalled()
    })

    it('should render nothing by default when source value is empty', async () => {
      const getOneMock = vi.fn()
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: null }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users" data-testid="ref-field">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      const element = screen.getByTestId('ref-field')
      expect(element).toBeEmptyDOMElement()
    })
  })

  describe('className support', () => {
    it('should apply className to the wrapper element', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'Test' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField
              source="authorId"
              reference="users"
              className="custom-class"
              data-testid="ref-field"
            >
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const element = screen.getByTestId('ref-field')
        expect(element).toHaveClass('custom-class')
      })
    })
  })

  describe('label support', () => {
    it('should render label when provided', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'John' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users" label="Author">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Author')).toBeInTheDocument()
        expect(screen.getByText('John')).toBeInTheDocument()
      })
    })
  })
})
