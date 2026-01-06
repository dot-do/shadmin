import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecordContextProvider, useRecordContext } from '../../contexts/RecordContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ReferenceField } from './ReferenceField'
import { TextField } from './TextField'

// Test component to verify RecordContext nesting
function RecordContextVerifier({ expectedId }: { expectedId: number | string }) {
  const record = useRecordContext()
  return (
    <span data-testid="record-context-verifier">
      {record?.id === expectedId ? 'correct-record' : `wrong-record-${record?.id}`}
    </span>
  )
}

// Custom child component for testing custom children rendering
function CustomChildComponent() {
  const record = useRecordContext()
  return (
    <div data-testid="custom-child">
      <span data-testid="custom-name">{record?.name}</span>
      <span data-testid="custom-role">{record?.role}</span>
    </div>
  )
}

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

    it('should not render label when not provided', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'John' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users" data-testid="ref-field">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const element = screen.getByTestId('ref-field')
        expect(element.tagName.toLowerCase()).toBe('span')
        expect(screen.getByText('John')).toBeInTheDocument()
      })
    })
  })

  describe('link prop variants', () => {
    it('should render link with href to edit page when link="edit"', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'John Doe' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users" link="edit">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/users/42/edit')
      })
    })

    it('should render link with href to show page when link="show"', async () => {
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

    it('should default to no link when link prop is not provided', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'John Doe' },
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

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.queryByRole('link')).not.toBeInTheDocument()
      })
    })

    it('should use string reference ID in link href', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 'abc-123', name: 'String ID User' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 'abc-123' }

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
        expect(link).toHaveAttribute('href', '/users/abc-123/show')
      })
    })
  })

  describe('empty reference ID handling', () => {
    it('should not fetch when reference ID is empty string', async () => {
      const getOneMock = vi.fn()
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: '' }

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
      expect(getOneMock).not.toHaveBeenCalled()
    })

    it('should render emptyText when reference ID is empty string', async () => {
      const getOneMock = vi.fn()
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: '' }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users" emptyText="Not assigned">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      expect(screen.getByText('Not assigned')).toBeInTheDocument()
      expect(getOneMock).not.toHaveBeenCalled()
    })

    it('should handle zero as valid reference ID', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 0, name: 'Zero ID User' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 0 }

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
        expect(screen.getByText('Zero ID User')).toBeInTheDocument()
      })
      expect(getOneMock).toHaveBeenCalledWith('users', { id: 0 })
    })
  })

  describe('RecordContext nesting for children', () => {
    it('should provide referenced record to children via RecordContext', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'Referenced User', role: 'Admin' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users">
              <RecordContextVerifier expectedId={42} />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('correct-record')).toBeInTheDocument()
      })
    })

    it('should override parent RecordContext with referenced record', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 99, name: 'Inner Record' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const outerRecord = { id: 1, authorId: 99, name: 'Outer Record' }

      render(
        <Wrapper>
          <RecordContextProvider value={outerRecord}>
            <ReferenceField source="authorId" reference="users">
              <TextField source="name" data-testid="inner-name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Inner Record')).toBeInTheDocument()
      })
    })
  })

  describe('custom children rendering', () => {
    it('should render custom component children with referenced record', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'John Smith', role: 'Editor' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users">
              <CustomChildComponent />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('custom-child')).toBeInTheDocument()
        expect(screen.getByTestId('custom-name')).toHaveTextContent('John Smith')
        expect(screen.getByTestId('custom-role')).toHaveTextContent('Editor')
      })
    })

    it('should render multiple children components', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users">
              <TextField source="firstName" />
              <span> </span>
              <TextField source="lastName" />
              <span> - </span>
              <TextField source="email" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
        expect(screen.getByText('Doe')).toBeInTheDocument()
        expect(screen.getByText('john@example.com')).toBeInTheDocument()
      })
    })

    it('should render without children', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 42, name: 'No Children' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 42 }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="authorId" reference="users" data-testid="ref-field" />
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const element = screen.getByTestId('ref-field')
        expect(element).toBeInTheDocument()
      })
    })
  })

  describe('nested source field access', () => {
    it('should support deeply nested source paths', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 100, name: 'Deep Nested' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, data: { relations: { author: { userId: 100 } } } }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="data.relations.author.userId" reference="users">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Deep Nested')).toBeInTheDocument()
      })
      expect(getOneMock).toHaveBeenCalledWith('users', { id: 100 })
    })

    it('should handle missing nested path gracefully', async () => {
      const getOneMock = vi.fn()
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, data: {} }

      render(
        <Wrapper>
          <RecordContextProvider value={record}>
            <ReferenceField source="data.author.id" reference="users" emptyText="No reference" data-testid="ref-field">
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      expect(screen.getByText('No reference')).toBeInTheDocument()
      expect(getOneMock).not.toHaveBeenCalled()
    })
  })

  describe('reference ID types', () => {
    it('should support string reference IDs', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 'uuid-123-456', name: 'UUID User' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 'uuid-123-456' }

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
        expect(screen.getByText('UUID User')).toBeInTheDocument()
      })
      expect(getOneMock).toHaveBeenCalledWith('users', { id: 'uuid-123-456' })
    })

    it('should support numeric reference IDs', async () => {
      const getOneMock = vi.fn().mockResolvedValue({
        data: { id: 12345, name: 'Numeric User' },
      })
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 12345 }

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
        expect(screen.getByText('Numeric User')).toBeInTheDocument()
      })
      expect(getOneMock).toHaveBeenCalledWith('users', { id: 12345 })
    })
  })

  describe('error state display', () => {
    it('should display error message when fetch fails', async () => {
      const getOneMock = vi.fn().mockRejectedValue(new Error('404 Not Found'))
      const dataProvider = createMockDataProvider({ getOne: getOneMock })
      const Wrapper = createWrapper(dataProvider)

      const record = { id: 1, authorId: 999 }

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
        const errorElement = screen.getByTestId('reference-field-error')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Error loading reference')
      })
    })
  })

  describe('loading state display', () => {
    it('should show animated loading placeholder during fetch', async () => {
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

      // Should show loading state with animated placeholder
      const loadingElement = screen.getByTestId('reference-field-loading')
      expect(loadingElement).toBeInTheDocument()
      expect(loadingElement.querySelector('.animate-pulse')).toBeInTheDocument()

      // Resolve and verify loading disappears
      resolvePromise!({ data: { id: 42, name: 'Loaded' } })

      await waitFor(() => {
        expect(screen.queryByTestId('reference-field-loading')).not.toBeInTheDocument()
        expect(screen.getByText('Loaded')).toBeInTheDocument()
      })
    })
  })

  describe('HTML attributes passthrough', () => {
    it('should pass through data-testid attribute', async () => {
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
              data-testid="custom-testid"
              id="custom-id"
            >
              <TextField source="name" />
            </ReferenceField>
          </RecordContextProvider>
        </Wrapper>
      )

      await waitFor(() => {
        const element = screen.getByTestId('custom-testid')
        expect(element).toBeInTheDocument()
        expect(element).toHaveAttribute('id', 'custom-id')
      })
    })
  })

  describe('displayName', () => {
    it('should have correct displayName for debugging', () => {
      expect(ReferenceField.displayName).toBe('ReferenceField')
    })
  })
})
