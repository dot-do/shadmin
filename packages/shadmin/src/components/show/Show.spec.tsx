/**
 * Show Component Tests
 * TDD: RED phase - Write failing tests first
 *
 * Epic: shadmin-ha1 (P1)
 *
 * Tests cover:
 * - Props interface (resource, id, children, title, etc.)
 * - Record fetching using useGetOne hook
 * - RecordContext provider for children
 * - Loading, error, and not found states
 * - Custom aside component support
 * - Actions prop for custom actions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Show } from './Show'
import { ShowBase } from './ShowBase'
import { useRecordContext } from '../../contexts/RecordContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ResourceContextProvider } from '../../contexts/ResourceContext'
import type { DataProvider } from '../../types'
import { TestMemoryRouter } from '../../test-utils'

// Test wrapper with required providers
const createWrapper = (dataProvider: DataProvider, initialEntries: string[] = ['/posts/1']) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <TestMemoryRouter initialEntries={initialEntries}>
            <ResourceContextProvider value="posts">
              {children}
            </ResourceContextProvider>
          </TestMemoryRouter>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )
  }
}

// Minimal wrapper without resource context
const createMinimalWrapper = (dataProvider: DataProvider, initialEntries: string[] = ['/posts/1']) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <TestMemoryRouter initialEntries={initialEntries}>
            {children}
          </TestMemoryRouter>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )
  }
}

describe('Show Component', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Test Post', content: 'Hello World' },
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

  describe('Props Interface', () => {
    it('should accept resource prop', async () => {
      const Wrapper = createMinimalWrapper(dataProvider)

      render(
        <Wrapper>
          <Show resource="posts" id={1}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: 1 }))
      })
    })

    it('should infer resource from ResourceContext if not provided', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: 1 }))
      })
    })

    it('should accept id prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={42}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: 42 }))
      })
    })

    it('should accept string id prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id="abc-123">
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: 'abc-123' }))
      })
    })

    it('should accept title prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1} title="Post Details">
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Post Details')).toBeInTheDocument()
      })
    })

    it('should accept title as ReactNode', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1} title={<h1 data-testid="custom-title">Custom Title</h1>}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('custom-title')).toBeInTheDocument()
      })
    })

    it('should accept actions prop for custom actions', async () => {
      const Wrapper = createWrapper(dataProvider)
      const CustomActions = () => <button data-testid="custom-action">Edit</button>

      render(
        <Wrapper>
          <Show id={1} actions={<CustomActions />}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('custom-action')).toBeInTheDocument()
      })
    })

    it('should accept actions={false} to hide actions', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1} actions={false} title="Post">
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })
    })

    it('should accept aside prop for side content', async () => {
      const Wrapper = createWrapper(dataProvider)
      const Aside = () => <div data-testid="aside">Side Content</div>

      render(
        <Wrapper>
          <Show id={1} aside={<Aside />}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('aside')).toBeInTheDocument()
      })
    })

    it('should accept className prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1} className="custom-class">
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
        const card = screen.getByTestId('content').closest('[data-slot="card"]')
        expect(card).toHaveClass('custom-class')
      })
    })

    it('should accept queryOptions prop for custom React Query options', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1} queryOptions={{ staleTime: 5000 }}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })
    })
  })

  describe('Record Fetching', () => {
    it('should fetch record using useGetOne', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledTimes(1)
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })
    })

    it('should refetch when id changes', async () => {
      const Wrapper = createWrapper(dataProvider)

      const { rerender } = render(
        <Wrapper>
          <Show id={1}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })

      rerender(
        <Wrapper>
          <Show id={2}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 2 })
      })
    })

    it('should pass meta to getOne when provided', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1} queryOptions={{ meta: { include: ['author'] } }}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({
          id: 1,
          meta: { include: ['author'] },
        }))
      })
    })
  })

  describe('RecordContext Provider', () => {
    it('should provide record data through RecordContext', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const record = useRecordContext()
        return (
          <div>
            <span data-testid="record-title">{record?.title as string}</span>
            <span data-testid="record-content">{record?.content as string}</span>
          </div>
        )
      }

      render(
        <Wrapper>
          <Show id={1}>
            <Consumer />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('Test Post')
        expect(screen.getByTestId('record-content')).toHaveTextContent('Hello World')
      })
    })

    it('should provide record id through RecordContext', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const record = useRecordContext()
        return <span data-testid="record-id">{record?.id as number}</span>
      }

      render(
        <Wrapper>
          <Show id={1}>
            <Consumer />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-id')).toHaveTextContent('1')
      })
    })

    it('should update RecordContext when record changes', async () => {
      const Wrapper = createWrapper(dataProvider)

      dataProvider.getOne = vi.fn()
        .mockResolvedValueOnce({ data: { id: 1, title: 'First Post' } })
        .mockResolvedValueOnce({ data: { id: 2, title: 'Second Post' } })

      const Consumer = () => {
        const record = useRecordContext()
        return <span data-testid="record-title">{record?.title as string}</span>
      }

      const { rerender } = render(
        <Wrapper>
          <Show id={1}>
            <Consumer />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('First Post')
      })

      rerender(
        <Wrapper>
          <Show id={2}>
            <Consumer />
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('Second Post')
      })
    })
  })

  describe('Loading State', () => {
    it('should show loading state while fetching', async () => {
      // Make getOne never resolve to keep loading state
      dataProvider.getOne = vi.fn().mockImplementation(() => new Promise(() => {}))
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      // Should show loading indicator (checking for common loading patterns)
      expect(screen.getByRole('progressbar') || screen.getByText(/loading/i) || screen.getByTestId('loading')).toBeTruthy()
    })

    it('should hide loading state after fetch completes', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
        // Loading should not be visible
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      })
    })

    it('should accept custom loading component', async () => {
      dataProvider.getOne = vi.fn().mockImplementation(() => new Promise(() => {}))
      const Wrapper = createWrapper(dataProvider)
      const CustomLoading = () => <div data-testid="custom-loading">Please wait...</div>

      render(
        <Wrapper>
          <Show id={1} loading={<CustomLoading />}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error state when fetch fails', async () => {
      const error = new Error('Network error')
      dataProvider.getOne = vi.fn().mockRejectedValue(error)
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        // The error state shows both "Error" label and "Network error" message
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('should accept custom error component', async () => {
      const error = new Error('Network error')
      dataProvider.getOne = vi.fn().mockRejectedValue(error)
      const Wrapper = createWrapper(dataProvider)
      const CustomError = () => <div data-testid="custom-error">Something went wrong</div>

      render(
        <Wrapper>
          <Show id={1} error={<CustomError />}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('custom-error')).toBeInTheDocument()
      })
    })
  })

  describe('Not Found State', () => {
    it('should show not found when record does not exist', async () => {
      const error = new Error('Resource posts with id 999 not found')
      dataProvider.getOne = vi.fn().mockRejectedValue(error)
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={999}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/not found/i) || screen.getByText(/error/i)).toBeTruthy()
      })
    })

    it('should accept custom empty/not found component', async () => {
      const error = new Error('Resource posts with id 999 not found')
      dataProvider.getOne = vi.fn().mockRejectedValue(error)
      const Wrapper = createWrapper(dataProvider)
      const Empty = () => <div data-testid="empty">Record not found</div>

      render(
        <Wrapper>
          <Show id={999} emptyWhileLoading empty={<Empty />}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('empty')).toBeInTheDocument()
      })
    })
  })

  describe('UI Container', () => {
    it('should render children inside a Card container', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Show id={1}>
            <div data-testid="content">Content</div>
          </Show>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
        // Card should be present
        const card = screen.getByTestId('content').closest('[data-slot="card"]')
        expect(card).toBeInTheDocument()
      })
    })
  })
})

describe('ShowBase Component', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Test Post' },
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

  it('should provide record context without UI wrapper', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const Consumer = () => {
      const record = useRecordContext()
      return <span data-testid="record-title">{record?.title as string}</span>
    }

    render(
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <TestMemoryRouter initialEntries={['/posts/1']}>
            <ResourceContextProvider value="posts">
              <ShowBase id={1}>
                <Consumer />
              </ShowBase>
            </ResourceContextProvider>
          </TestMemoryRouter>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('record-title')).toHaveTextContent('Test Post')
    })
  })

  it('should be composable with custom UI', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const CustomUI = () => {
      const record = useRecordContext()
      return (
        <div data-testid="custom-show">
          <h1>{record?.title as string}</h1>
        </div>
      )
    }

    render(
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <TestMemoryRouter initialEntries={['/posts/1']}>
            <ResourceContextProvider value="posts">
              <ShowBase id={1}>
                <CustomUI />
              </ShowBase>
            </ResourceContextProvider>
          </TestMemoryRouter>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('custom-show')).toBeInTheDocument()
      expect(screen.getByText('Test Post')).toBeInTheDocument()
    })
  })

  it('should accept resource prop', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const Consumer = () => {
      const record = useRecordContext()
      return <span data-testid="record-title">{record?.title as string}</span>
    }

    render(
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <TestMemoryRouter initialEntries={['/posts/1']}>
            <ShowBase resource="posts" id={1}>
              <Consumer />
            </ShowBase>
          </TestMemoryRouter>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.any(Object))
    })
  })

  it('should provide loading state through children render prop', async () => {
    dataProvider.getOne = vi.fn().mockImplementation(() => new Promise(() => {}))

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <TestMemoryRouter initialEntries={['/posts/1']}>
            <ResourceContextProvider value="posts">
              <ShowBase id={1}>
                {({ isLoading }) => (
                  <div data-testid="loading-state">{isLoading ? 'Loading' : 'Loaded'}</div>
                )}
              </ShowBase>
            </ResourceContextProvider>
          </TestMemoryRouter>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )

    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading')
  })

  it('should provide error state through children render prop', async () => {
    const error = new Error('Failed to fetch')
    dataProvider.getOne = vi.fn().mockRejectedValue(error)

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <TestMemoryRouter initialEntries={['/posts/1']}>
            <ResourceContextProvider value="posts">
              <ShowBase id={1}>
                {({ error }) => (
                  <div data-testid="error-state">{error ? error.message : 'No error'}</div>
                )}
              </ShowBase>
            </ResourceContextProvider>
          </TestMemoryRouter>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toHaveTextContent('Failed to fetch')
    })
  })

  it('should provide refetch callback', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <TestMemoryRouter initialEntries={['/posts/1']}>
            <ResourceContextProvider value="posts">
              <ShowBase id={1}>
                {({ refetch }) => (
                  <button data-testid="refetch-btn" onClick={() => refetch()}>
                    Refetch
                  </button>
                )}
              </ShowBase>
            </ResourceContextProvider>
          </TestMemoryRouter>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('refetch-btn')).toBeInTheDocument()
    })

    screen.getByTestId('refetch-btn').click()

    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledTimes(2)
    })
  })
})
