/**
 * ShowBase Component Tests
 * TDD: RED phase - Write failing tests first
 *
 * Epic: shadmin-ha1 (P1)
 *
 * Tests cover:
 * - ShowBase provides record context
 * - ShowBase handles loading state
 * - ShowBase handles error state
 * - ShowBase supports transform prop
 * - ShowBase triggers aside callbacks
 * - Show + SimpleShowLayout integration
 * - ShowBase fetches record on mount
 * - ShowBase refetches on id change
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ShowBase, type ShowControllerResult } from './ShowBase'
import { useRecordContext } from '../../contexts/RecordContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ResourceContextProvider, useResourceContext } from '../../contexts/ResourceContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import type { DataProvider, RaRecord } from '../../types'
import { TestMemoryRouter } from '../../test-utils'

/**
 * Create a test wrapper with all required providers
 */
const createWrapper = (
  dataProvider: DataProvider,
  initialEntries: string[] = ['/posts/1']
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <NotificationContextProvider>
            <TestMemoryRouter initialEntries={initialEntries}>
              <ResourceContextProvider value="posts">
                {children}
              </ResourceContextProvider>
            </TestMemoryRouter>
          </NotificationContextProvider>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )
  }
}

/**
 * Create a minimal wrapper without ResourceContext
 */
const createMinimalWrapper = (
  dataProvider: DataProvider,
  initialEntries: string[] = ['/posts/1']
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <NotificationContextProvider>
            <TestMemoryRouter initialEntries={initialEntries}>
              {children}
            </TestMemoryRouter>
          </NotificationContextProvider>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )
  }
}

/**
 * Record display component for testing context
 */
const RecordDisplay = () => {
  const record = useRecordContext()
  return (
    <div>
      <span data-testid="record-id">{record?.id as number}</span>
      <span data-testid="record-title">{record?.title as string}</span>
    </div>
  )
}

/**
 * Resource display component for testing ResourceContext
 */
const ResourceDisplay = () => {
  const resource = useResourceContext()
  return <span data-testid="resource">{resource}</span>
}

describe('ShowBase Component', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Test Post', content: 'Test content' },
      }),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  describe('Record Context', () => {
    it('should provide record through RecordContext', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-id')).toHaveTextContent('1')
        expect(screen.getByTestId('record-title')).toHaveTextContent('Test Post')
      })
    })

    it('should update RecordContext when data changes', async () => {
      dataProvider.getOne = vi.fn()
        .mockResolvedValueOnce({ data: { id: 1, title: 'First Title' } })
        .mockResolvedValueOnce({ data: { id: 2, title: 'Second Title' } })

      const Wrapper = createWrapper(dataProvider)

      const { rerender } = render(
        <Wrapper>
          <ShowBase id={1}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('First Title')
      })

      rerender(
        <Wrapper>
          <ShowBase id={2}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('Second Title')
      })
    })

    it('should provide record to children via render prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ record }) => (
              <div data-testid="render-prop-record">
                {record?.title as string}
              </div>
            )}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('render-prop-record')).toHaveTextContent('Test Post')
      })
    })

    it('should provide undefined record before data is loaded', () => {
      dataProvider.getOne = vi.fn().mockImplementation(() => new Promise(() => {}))
      const Wrapper = createWrapper(dataProvider)

      let capturedRecord: RaRecord | undefined

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ record }) => {
              capturedRecord = record
              return <div data-testid="content">{record ? 'loaded' : 'loading'}</div>
            }}
          </ShowBase>
        </Wrapper>
      )

      expect(capturedRecord).toBeUndefined()
      expect(screen.getByTestId('content')).toHaveTextContent('loading')
    })
  })

  describe('Loading State', () => {
    it('should provide isLoading=true while fetching', () => {
      dataProvider.getOne = vi.fn().mockImplementation(() => new Promise(() => {}))
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ isLoading }) => (
              <div data-testid="loading-state">{isLoading ? 'loading' : 'loaded'}</div>
            )}
          </ShowBase>
        </Wrapper>
      )

      expect(screen.getByTestId('loading-state')).toHaveTextContent('loading')
    })

    it('should provide isLoading=false after fetch completes', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ isLoading }) => (
              <div data-testid="loading-state">{isLoading ? 'loading' : 'loaded'}</div>
            )}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded')
      })
    })

    it('should provide isFetching for background refetches', async () => {
      let resolveSecondFetch: () => void
      let fetchCount = 0

      dataProvider.getOne = vi.fn().mockImplementation(() => {
        fetchCount++
        if (fetchCount === 1) {
          return Promise.resolve({ data: { id: 1, title: 'First' } })
        }
        return new Promise((resolve) => {
          resolveSecondFetch = () => resolve({ data: { id: 1, title: 'Second' } })
        })
      })

      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ isFetching, refetch }) => (
              <div>
                <div data-testid="fetching-state">{isFetching ? 'fetching' : 'idle'}</div>
                <button data-testid="refetch-btn" onClick={() => refetch()}>Refetch</button>
              </div>
            )}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('fetching-state')).toHaveTextContent('idle')
      })

      fireEvent.click(screen.getByTestId('refetch-btn'))

      await waitFor(() => {
        expect(screen.getByTestId('fetching-state')).toHaveTextContent('fetching')
      })

      resolveSecondFetch!()

      await waitFor(() => {
        expect(screen.getByTestId('fetching-state')).toHaveTextContent('idle')
      })
    })
  })

  describe('Error State', () => {
    it('should provide error when fetch fails', async () => {
      const error = new Error('Network error')
      dataProvider.getOne = vi.fn().mockRejectedValue(error)
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ error }) => (
              <div data-testid="error-state">{error ? error.message : 'no error'}</div>
            )}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toHaveTextContent('Network error')
      })
    })

    it('should provide error=null when fetch succeeds', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ error }) => (
              <div data-testid="error-state">{error ? error.message : 'no error'}</div>
            )}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toHaveTextContent('no error')
      })
    })

    it('should handle 404 not found errors', async () => {
      const error = new Error('Resource posts with id 999 not found')
      dataProvider.getOne = vi.fn().mockRejectedValue(error)
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={999}>
            {({ error }) => (
              <div data-testid="error-message">{error?.message ?? 'no error'}</div>
            )}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('not found')
      })
    })
  })

  describe('Transform Prop', () => {
    it('should transform record data before providing to context', async () => {
      const transform = vi.fn((record: RaRecord) => ({
        ...record,
        title: `Transformed: ${record.title}`,
      }))

      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1} transform={transform}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(transform).toHaveBeenCalledWith({ id: 1, title: 'Test Post', content: 'Test content' })
        expect(screen.getByTestId('record-title')).toHaveTextContent('Transformed: Test Post')
      })
    })

    it('should call transform with full record data', async () => {
      const transform = vi.fn((record: RaRecord) => ({
        ...record,
        processed: true,
      }))

      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1} transform={transform}>
            {({ record }) => (
              <div data-testid="processed">{record?.processed ? 'yes' : 'no'}</div>
            )}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('processed')).toHaveTextContent('yes')
      })
    })

    it('should not call transform when record is undefined', async () => {
      dataProvider.getOne = vi.fn().mockRejectedValue(new Error('Not found'))
      const transform = vi.fn((record: RaRecord) => record)

      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1} transform={transform}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(transform).not.toHaveBeenCalled()
      })
    })
  })

  describe('Aside Callbacks', () => {
    it('should call onLoad callback when record is loaded', async () => {
      const onLoad = vi.fn()
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1} onLoad={onLoad}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(onLoad).toHaveBeenCalledWith({ id: 1, title: 'Test Post', content: 'Test content' })
      })
    })

    it('should call onError callback when fetch fails', async () => {
      const error = new Error('Fetch failed')
      dataProvider.getOne = vi.fn().mockRejectedValue(error)
      const onError = vi.fn()

      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1} onError={onError}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error)
      })
    })

    it('should call onMount callback when component mounts', () => {
      const onMount = vi.fn()
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1} onMount={onMount}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      expect(onMount).toHaveBeenCalledTimes(1)
    })

    it('should call onUnmount callback when component unmounts', async () => {
      const onUnmount = vi.fn()
      const Wrapper = createWrapper(dataProvider)

      const { unmount } = render(
        <Wrapper>
          <ShowBase id={1} onUnmount={onUnmount}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      expect(onUnmount).not.toHaveBeenCalled()

      unmount()

      expect(onUnmount).toHaveBeenCalledTimes(1)
    })
  })

  describe('Fetching Behavior', () => {
    it('should fetch record on mount', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledTimes(1)
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: 1 }))
      })
    })

    it('should refetch when id changes', async () => {
      const Wrapper = createWrapper(dataProvider)

      dataProvider.getOne = vi.fn()
        .mockResolvedValueOnce({ data: { id: 1, title: 'Post 1' } })
        .mockResolvedValueOnce({ data: { id: 2, title: 'Post 2' } })

      const { rerender } = render(
        <Wrapper>
          <ShowBase id={1}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('Post 1')
      })

      rerender(
        <Wrapper>
          <ShowBase id={2}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: 2 }))
        expect(screen.getByTestId('record-title')).toHaveTextContent('Post 2')
      })
    })

    it('should refetch when resource changes', async () => {
      const Wrapper = createMinimalWrapper(dataProvider)

      dataProvider.getOne = vi.fn()
        .mockResolvedValueOnce({ data: { id: 1, title: 'Post 1' } })
        .mockResolvedValueOnce({ data: { id: 1, title: 'Comment 1' } })

      const { rerender } = render(
        <Wrapper>
          <ShowBase resource="posts" id={1}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: 1 }))
      })

      rerender(
        <Wrapper>
          <ShowBase resource="comments" id={1}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('comments', expect.objectContaining({ id: 1 }))
      })
    })

    it('should pass meta to data provider', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1} queryOptions={{ meta: { include: ['author', 'comments'] } }}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            id: 1,
            meta: { include: ['author', 'comments'] },
          })
        )
      })
    })

    it('should support refetch callback', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ refetch }) => (
              <button data-testid="refetch-btn" onClick={() => refetch()}>
                Refetch
              </button>
            )}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledTimes(1)
      })

      fireEvent.click(screen.getByTestId('refetch-btn'))

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Resource Context', () => {
    it('should use resource from ResourceContext if not provided', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            <ResourceDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.any(Object))
      })
    })

    it('should override ResourceContext with resource prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase resource="comments" id={1}>
            <ResourceDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('comments', expect.any(Object))
      })
    })

    it('should throw error when no resource is provided or in context', () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <QueryClientProvider client={queryClient}>
            <DataProviderContextProvider dataProvider={dataProvider}>
              <ShowBase id={1}>
                <RecordDisplay />
              </ShowBase>
            </DataProviderContextProvider>
          </QueryClientProvider>
        )
      }).toThrow('ShowBase requires a resource prop or must be used inside a ResourceContextProvider')

      consoleError.mockRestore()
    })

    it('should provide resource through ResourceContext when resource prop is used', async () => {
      const Wrapper = createMinimalWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase resource="posts" id={1}>
            <ResourceDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('resource')).toHaveTextContent('posts')
      })
    })
  })

  describe('Controller Result', () => {
    it('should provide complete controller result to render prop', async () => {
      const Wrapper = createWrapper(dataProvider)
      let controllerResult: ShowControllerResult | null = null

      render(
        <Wrapper>
          <ShowBase id={1}>
            {(props) => {
              controllerResult = props
              return <div data-testid="content">Loaded</div>
            }}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(controllerResult).not.toBeNull()
        expect(controllerResult!.record).toEqual({ id: 1, title: 'Test Post', content: 'Test content' })
        expect(controllerResult!.isLoading).toBe(false)
        expect(controllerResult!.isFetching).toBe(false)
        expect(controllerResult!.error).toBeNull()
        expect(typeof controllerResult!.refetch).toBe('function')
        expect(controllerResult!.resource).toBe('posts')
        expect(controllerResult!.id).toBe(1)
      })
    })

    it('should provide id in controller result', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={42}>
            {({ id }) => <div data-testid="id-value">{id}</div>}
          </ShowBase>
        </Wrapper>
      )

      expect(screen.getByTestId('id-value')).toHaveTextContent('42')
    })

    it('should provide resource in controller result', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ resource }) => <div data-testid="resource-value">{resource}</div>}
          </ShowBase>
        </Wrapper>
      )

      expect(screen.getByTestId('resource-value')).toHaveTextContent('posts')
    })
  })

  describe('Query Options', () => {
    it('should pass queryOptions to useGetOne', async () => {
      const onSuccess = vi.fn()
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase
            id={1}
            queryOptions={{
              onSuccess,
              staleTime: 5000,
            }}
          >
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith({ id: 1, title: 'Test Post', content: 'Test content' })
      })
    })

    it('should support enabled option', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase
            id={1}
            queryOptions={{ enabled: false }}
          >
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      // Wait a bit to ensure fetch doesn't happen
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(dataProvider.getOne).not.toHaveBeenCalled()
    })

    it('should support refetchOnMount option', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase
            id={1}
            queryOptions={{ refetchOnMount: false }}
          >
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Integration with SimpleShowLayout', () => {
    /**
     * Note: These tests verify the pattern for ShowBase + layout integration.
     * SimpleShowLayout component may need to be implemented.
     */

    it('should work with simple children layout', async () => {
      const Wrapper = createWrapper(dataProvider)

      // Simulating SimpleShowLayout pattern
      const SimpleLayout = ({ children }: { children: ReactNode }) => {
        return <div data-testid="simple-layout">{children}</div>
      }

      const TextField = ({ source }: { source: string }) => {
        const record = useRecordContext()
        return <div data-testid={`field-${source}`}>{record?.[source] as string}</div>
      }

      render(
        <Wrapper>
          <ShowBase id={1}>
            <SimpleLayout>
              <TextField source="title" />
              <TextField source="content" />
            </SimpleLayout>
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('simple-layout')).toBeInTheDocument()
        expect(screen.getByTestId('field-title')).toHaveTextContent('Test Post')
        expect(screen.getByTestId('field-content')).toHaveTextContent('Test content')
      })
    })

    it('should work with render prop and custom layout', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ record, isLoading, error }) => (
              <div data-testid="custom-layout">
                {isLoading && <div data-testid="loading">Loading...</div>}
                {error && <div data-testid="error">{error.message}</div>}
                {record && (
                  <div data-testid="record-data">
                    <h1>{record.title as string}</h1>
                    <p>{record.content as string}</p>
                  </div>
                )}
              </div>
            )}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('custom-layout')).toBeInTheDocument()
        expect(screen.getByTestId('record-data')).toBeInTheDocument()
        expect(screen.getByText('Test Post')).toBeInTheDocument()
      })
    })

    it('should support nested ShowBase components', async () => {
      dataProvider.getOne = vi.fn().mockImplementation((resource, params) => {
        if (resource === 'posts') {
          return Promise.resolve({ data: { id: params.id, title: 'Post', authorId: 2 } })
        }
        if (resource === 'authors') {
          return Promise.resolve({ data: { id: params.id, name: 'John Doe' } })
        }
        return Promise.reject(new Error('Unknown resource'))
      })

      const Wrapper = createMinimalWrapper(dataProvider)

      const AuthorField = () => {
        const record = useRecordContext()
        const authorId = record?.authorId as number

        if (!authorId) return null

        return (
          <ShowBase resource="authors" id={authorId}>
            {({ record: author }) => (
              <span data-testid="author-name">{author?.name as string}</span>
            )}
          </ShowBase>
        )
      }

      render(
        <Wrapper>
          <ShowBase resource="posts" id={1}>
            <div>
              <RecordDisplay />
              <AuthorField />
            </div>
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('Post')
        expect(screen.getByTestId('author-name')).toHaveTextContent('John Doe')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle string IDs', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: { id: 'uuid-123', title: 'UUID Post' },
      })

      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id="uuid-123">
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: 'uuid-123' }))
        expect(screen.getByTestId('record-id')).toHaveTextContent('uuid-123')
      })
    })

    it('should handle numeric string IDs', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: { id: '123', title: 'Numeric String ID Post' },
      })

      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id="123">
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: '123' }))
      })
    })

    it('should handle null values in record', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: { id: 1, title: null, content: null },
      })

      const Wrapper = createWrapper(dataProvider)

      const NullableFields = () => {
        const record = useRecordContext()
        return (
          <div>
            <span data-testid="title">{(record?.title as string) ?? 'No title'}</span>
            <span data-testid="content">{(record?.content as string) ?? 'No content'}</span>
          </div>
        )
      }

      render(
        <Wrapper>
          <ShowBase id={1}>
            <NullableFields />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('No title')
        expect(screen.getByTestId('content')).toHaveTextContent('No content')
      })
    })

    it('should handle rapid id changes', async () => {
      dataProvider.getOne = vi.fn().mockImplementation((_resource, params) => {
        return Promise.resolve({ data: { id: params.id, title: `Post ${params.id}` } })
      })

      const Wrapper = createWrapper(dataProvider)

      const { rerender } = render(
        <Wrapper>
          <ShowBase id={1}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      // Rapid changes
      rerender(
        <Wrapper>
          <ShowBase id={2}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      rerender(
        <Wrapper>
          <ShowBase id={3}>
            <RecordDisplay />
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('Post 3')
      })
    })

    it('should handle empty record', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: { id: 1 },
      })

      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <ShowBase id={1}>
            {({ record }) => (
              <div data-testid="record-keys">
                {Object.keys(record ?? {}).join(',')}
              </div>
            )}
          </ShowBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-keys')).toHaveTextContent('id')
      })
    })
  })
})
