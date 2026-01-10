/**
 * List Component Tests
 * TDD: RED phase - Write failing tests first
 *
 * Epic: shadmin-ha1 (P1)
 *
 * Tests cover:
 * - Props interface (resource, children, title, etc.)
 * - Pagination state management
 * - Sort state management
 * - Filter state management
 * - URL synchronization
 * - ListContext provider integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { List } from './List'
import { ListBase } from './ListBase'
import { ListView } from './ListView'
import { useListContext, type ListControllerResult } from '../../contexts/ListContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ResourceContextProvider } from '../../contexts/ResourceContext'
import type { DataProvider } from '../../types'
import { TestMemoryRouter, useTestSearchParams, useTestLocation, useTestRouter } from '../../test-utils'

// Test wrapper with required providers
const createWrapper = (dataProvider: DataProvider, initialEntries: string[] = ['/posts']) => {
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
const createMinimalWrapper = (dataProvider: DataProvider, initialEntries: string[] = ['/posts']) => {
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

describe('List Component', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn().mockResolvedValue({
        data: [
          { id: 1, title: 'Post 1' },
          { id: 2, title: 'Post 2' },
        ],
        total: 2,
      }),
      getOne: vi.fn(),
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
          <List resource="posts">
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.any(Object))
      })
    })

    it('should infer resource from ResourceContext if not provided', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.any(Object))
      })
    })

    it('should accept title prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List title="My Posts">
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('My Posts')).toBeInTheDocument()
      })
    })

    it('should accept actions prop for custom actions', async () => {
      const Wrapper = createWrapper(dataProvider)
      const CustomActions = () => <button data-testid="custom-action">Create</button>

      render(
        <Wrapper>
          <List actions={<CustomActions />}>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('custom-action')).toBeInTheDocument()
      })
    })

    it('should accept filters prop for filter inputs', async () => {
      const Wrapper = createWrapper(dataProvider)
      const Filters = () => <input data-testid="filter-input" placeholder="Search" />

      render(
        <Wrapper>
          <List filters={<Filters />}>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('filter-input')).toBeInTheDocument()
      })
    })

    it('should accept perPage prop for default items per page', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List perPage={25}>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          pagination: expect.objectContaining({ perPage: 25 }),
        }))
      })
    })

    it('should accept sort prop for default sort', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List sort={{ field: 'title', order: 'DESC' }}>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          sort: { field: 'title', order: 'DESC' },
        }))
      })
    })

    it('should accept filter prop for default filters', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List filter={{ published: true }}>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          filter: expect.objectContaining({ published: true }),
        }))
      })
    })

    it('should accept filterDefaultValues prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List filterDefaultValues={{ status: 'active' }}>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          filter: expect.objectContaining({ status: 'active' }),
        }))
      })
    })

    it('should accept empty prop to display when no data', async () => {
      dataProvider.getList = vi.fn().mockResolvedValue({
        data: [],
        total: 0,
      })
      const Wrapper = createWrapper(dataProvider)
      const Empty = () => <div data-testid="empty">No posts found</div>

      render(
        <Wrapper>
          <List empty={<Empty />}>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('empty')).toBeInTheDocument()
      })
    })

    it('should accept disableSyncWithLocation prop', async () => {
      const Wrapper = createWrapper(dataProvider, ['/posts?page=2'])

      // With disableSyncWithLocation, should ignore URL params
      render(
        <Wrapper>
          <List disableSyncWithLocation>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          pagination: expect.objectContaining({ page: 1 }), // Should be 1, not 2
        }))
      })
    })

    it('should accept queryOptions prop for custom React Query options', async () => {
      const onSuccess = vi.fn()
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List queryOptions={{ staleTime: 5000 }}>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })
    })
  })

  describe('Pagination State Management', () => {
    it('should start with page 1 by default', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          pagination: expect.objectContaining({ page: 1 }),
        }))
      })
    })

    it('should use default perPage of 10', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          pagination: expect.objectContaining({ perPage: 10 }),
        }))
      })
    })

    it('should provide setPage callback through context', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { page, setPage } = useListContext()
        return (
          <div>
            <span data-testid="page">{page}</span>
            <button onClick={() => setPage(3)}>Go to page 3</button>
          </div>
        )
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('page')).toHaveTextContent('1')
      })

      fireEvent.click(screen.getByText('Go to page 3'))

      await waitFor(() => {
        expect(screen.getByTestId('page')).toHaveTextContent('3')
      })
    })

    it('should provide setPerPage callback through context', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { perPage, setPerPage } = useListContext()
        return (
          <div>
            <span data-testid="perPage">{perPage}</span>
            <button onClick={() => setPerPage(50)}>Show 50</button>
          </div>
        )
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('perPage')).toHaveTextContent('10')
      })

      fireEvent.click(screen.getByText('Show 50'))

      await waitFor(() => {
        expect(screen.getByTestId('perPage')).toHaveTextContent('50')
      })
    })

    it('should reset to page 1 when perPage changes', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { page, perPage, setPage, setPerPage } = useListContext()
        return (
          <div>
            <span data-testid="page">{page}</span>
            <span data-testid="perPage">{perPage}</span>
            <button onClick={() => setPage(5)}>Go to page 5</button>
            <button onClick={() => setPerPage(50)}>Show 50</button>
          </div>
        )
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('page')).toHaveTextContent('1')
      })

      fireEvent.click(screen.getByText('Go to page 5'))

      await waitFor(() => {
        expect(screen.getByTestId('page')).toHaveTextContent('5')
      })

      fireEvent.click(screen.getByText('Show 50'))

      await waitFor(() => {
        expect(screen.getByTestId('page')).toHaveTextContent('1')
        expect(screen.getByTestId('perPage')).toHaveTextContent('50')
      })
    })
  })

  describe('Sort State Management', () => {
    it('should use default sort (id ASC) if not specified', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          sort: { field: 'id', order: 'ASC' },
        }))
      })
    })

    it('should provide setSort callback through context', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { sort, setSort } = useListContext()
        return (
          <div>
            <span data-testid="sort">{`${sort.field}-${sort.order}`}</span>
            <button onClick={() => setSort({ field: 'title', order: 'DESC' })}>
              Sort by title
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('sort')).toHaveTextContent('id-ASC')
      })

      fireEvent.click(screen.getByText('Sort by title'))

      await waitFor(() => {
        expect(screen.getByTestId('sort')).toHaveTextContent('title-DESC')
      })
    })

    it('should reset to page 1 when sort changes', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { page, sort, setPage, setSort } = useListContext()
        return (
          <div>
            <span data-testid="page">{page}</span>
            <span data-testid="sort">{`${sort.field}-${sort.order}`}</span>
            <button onClick={() => setPage(3)}>Go to page 3</button>
            <button onClick={() => setSort({ field: 'title', order: 'DESC' })}>
              Sort by title
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      fireEvent.click(screen.getByText('Go to page 3'))

      await waitFor(() => {
        expect(screen.getByTestId('page')).toHaveTextContent('3')
      })

      fireEvent.click(screen.getByText('Sort by title'))

      await waitFor(() => {
        expect(screen.getByTestId('page')).toHaveTextContent('1')
      })
    })
  })

  describe('Filter State Management', () => {
    it('should start with empty filters by default', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          filter: {},
        }))
      })
    })

    it('should provide setFilters callback through context', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { filterValues, setFilters } = useListContext()
        return (
          <div>
            <span data-testid="filters">{JSON.stringify(filterValues)}</span>
            <button onClick={() => setFilters({ search: 'test' })}>
              Apply filter
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('filters')).toHaveTextContent('{}')
      })

      fireEvent.click(screen.getByText('Apply filter'))

      await waitFor(() => {
        expect(screen.getByTestId('filters')).toHaveTextContent('{"search":"test"}')
      })
    })

    it('should reset to page 1 when filters change', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { page, filterValues, setPage, setFilters } = useListContext()
        return (
          <div>
            <span data-testid="page">{page}</span>
            <span data-testid="filters">{JSON.stringify(filterValues)}</span>
            <button onClick={() => setPage(3)}>Go to page 3</button>
            <button onClick={() => setFilters({ search: 'test' })}>
              Apply filter
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      fireEvent.click(screen.getByText('Go to page 3'))

      await waitFor(() => {
        expect(screen.getByTestId('page')).toHaveTextContent('3')
      })

      fireEvent.click(screen.getByText('Apply filter'))

      await waitFor(() => {
        expect(screen.getByTestId('page')).toHaveTextContent('1')
      })
    })

    it('should merge permanent filter with dynamic filters', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List filter={{ published: true }}>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          filter: { published: true },
        }))
      })
    })
  })

  describe('URL Synchronization', () => {
    it('should read initial page from URL', async () => {
      const Wrapper = createWrapper(dataProvider, ['/posts?page=3'])

      render(
        <Wrapper>
          <List>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          pagination: expect.objectContaining({ page: 3 }),
        }))
      })
    })

    it('should read initial perPage from URL', async () => {
      const Wrapper = createWrapper(dataProvider, ['/posts?perPage=50'])

      render(
        <Wrapper>
          <List>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          pagination: expect.objectContaining({ perPage: 50 }),
        }))
      })
    })

    it('should read initial sort from URL', async () => {
      const Wrapper = createWrapper(dataProvider, ['/posts?sort=title&order=DESC'])

      render(
        <Wrapper>
          <List>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          sort: { field: 'title', order: 'DESC' },
        }))
      })
    })

    it('should read initial filter from URL', async () => {
      const Wrapper = createWrapper(dataProvider, ['/posts?filter={"search":"test"}'])

      render(
        <Wrapper>
          <List>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          filter: expect.objectContaining({ search: 'test' }),
        }))
      })
    })

    it('should update URL when page changes', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationPathname = ''
      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationPathname = location.pathname
        locationSearch = location.search
        return null
      }

      const Consumer = () => {
        const { setPage } = useListContext()
        return <button onClick={() => setPage(5)}>Go to page 5</button>
      }

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List>
                  <Consumer />
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Go to page 5')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Go to page 5'))

      await waitFor(() => {
        expect(locationSearch).toContain('page=5')
      })
    })

    it('should update URL when sort changes', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationSearch = location.search
        return null
      }

      const Consumer = () => {
        const { setSort } = useListContext()
        return (
          <button onClick={() => setSort({ field: 'title', order: 'DESC' })}>
            Sort
          </button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List>
                  <Consumer />
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Sort')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Sort'))

      await waitFor(() => {
        expect(locationSearch).toContain('sort=title')
        expect(locationSearch).toContain('order=DESC')
      })
    })

    it('should update URL when filters change', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationSearch = location.search
        return null
      }

      const Consumer = () => {
        const { setFilters } = useListContext()
        return (
          <button onClick={() => setFilters({ search: 'hello' })}>
            Filter
          </button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List>
                  <Consumer />
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Filter')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Filter'))

      await waitFor(() => {
        expect(locationSearch).toContain('filter=')
      })
    })
  })

  describe('ListContext Provider Integration', () => {
    it('should provide data through context', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { data } = useListContext()
        return (
          <ul>
            {data?.map((item) => (
              <li key={item.id} data-testid={`item-${item.id}`}>
                {String(item.title)}
              </li>
            ))}
          </ul>
        )
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toHaveTextContent('Post 1')
        expect(screen.getByTestId('item-2')).toHaveTextContent('Post 2')
      })
    })

    it('should provide total through context', async () => {
      dataProvider.getList = vi.fn().mockResolvedValue({
        data: [{ id: 1, title: 'Post 1' }],
        total: 100,
      })
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { total } = useListContext()
        return <span data-testid="total">{total}</span>
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('total')).toHaveTextContent('100')
      })
    })

    it('should provide isLoading through context', async () => {
      const Wrapper = createWrapper(dataProvider)
      let isLoadingWasTrue = false

      const Consumer = () => {
        const { isLoading } = useListContext()
        if (isLoading) isLoadingWasTrue = true
        return <span data-testid="loading">{isLoading ? 'true' : 'false'}</span>
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })

      expect(isLoadingWasTrue).toBe(true)
    })

    it('should provide error through context', async () => {
      const error = new Error('Failed to fetch')
      dataProvider.getList = vi.fn().mockRejectedValue(error)
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { error } = useListContext()
        return <span data-testid="error">{error?.message}</span>
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch')
      })
    })

    it('should provide resource through context', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { resource } = useListContext()
        return <span data-testid="resource">{resource}</span>
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('resource')).toHaveTextContent('posts')
      })
    })

    it('should provide refetch callback through context', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { refetch } = useListContext()
        return <button onClick={() => refetch()}>Refresh</button>
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Refresh')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Refresh'))

      await waitFor(() => {
        // Initial call + refetch call
        expect(dataProvider.getList).toHaveBeenCalledTimes(2)
      })
    })

    it('should provide selection state through context', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { selectedIds, onSelect, onToggleItem, onUnselectItems } = useListContext()
        return (
          <div>
            <span data-testid="selected">{selectedIds.join(',')}</span>
            <button onClick={() => onSelect([1, 2])}>Select All</button>
            <button onClick={() => onToggleItem(3)}>Toggle 3</button>
            <button onClick={() => onUnselectItems()}>Clear</button>
          </div>
        )
      }

      render(
        <Wrapper>
          <List>
            <Consumer />
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('selected')).toHaveTextContent('')
      })

      fireEvent.click(screen.getByText('Select All'))

      await waitFor(() => {
        expect(screen.getByTestId('selected')).toHaveTextContent('1,2')
      })

      fireEvent.click(screen.getByText('Toggle 3'))

      await waitFor(() => {
        expect(screen.getByTestId('selected')).toHaveTextContent('1,2,3')
      })

      fireEvent.click(screen.getByText('Clear'))

      await waitFor(() => {
        expect(screen.getByTestId('selected')).toHaveTextContent('')
      })
    })
  })

  describe('UI Container (ShadCN Card)', () => {
    it('should render children inside a Card container', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <List>
            <div data-testid="content">Content</div>
          </List>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
        // Card should be present (we check by role or class)
        const card = screen.getByTestId('content').closest('[data-slot="card"]')
        expect(card).toBeInTheDocument()
      })
    })
  })
})

describe('ListBase Component', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn().mockResolvedValue({
        data: [{ id: 1, title: 'Post 1' }],
        total: 1,
      }),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should provide list context without UI wrapper', async () => {
    const Wrapper = createWrapper(dataProvider)

    const Consumer = () => {
      const { data } = useListContext()
      return <span data-testid="data-length">{data?.length}</span>
    }

    render(
      <Wrapper>
        <ListBase resource="posts">
          <Consumer />
        </ListBase>
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('data-length')).toHaveTextContent('1')
    })
  })

  it('should be composable with custom UI', async () => {
    const Wrapper = createWrapper(dataProvider)

    const CustomUI = () => {
      const { data, isLoading } = useListContext()
      if (isLoading) return <div>Loading...</div>
      return (
        <div data-testid="custom-list">
          {data?.map((item) => (
            <div key={item.id}>{String(item.title)}</div>
          ))}
        </div>
      )
    }

    render(
      <Wrapper>
        <ListBase resource="posts">
          <CustomUI />
        </ListBase>
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('custom-list')).toBeInTheDocument()
      expect(screen.getByText('Post 1')).toBeInTheDocument()
    })
  })
})

describe('ListView Component', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn().mockResolvedValue({
        data: [{ id: 1, title: 'Post 1' }],
        total: 1,
      }),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should render UI container (expects ListContext)', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const mockContextValue: ListControllerResult = {
      data: [{ id: 1, title: 'Post 1' }],
      total: 1,
      isLoading: false,
      isFetching: false,
      error: null,
      page: 1,
      perPage: 10,
      sort: { field: 'id', order: 'ASC' },
      filterValues: {},
      selectedIds: [],
      resource: 'posts',
      setPage: vi.fn(),
      setPerPage: vi.fn(),
      setSort: vi.fn(),
      setFilters: vi.fn(),
      onSelect: vi.fn(),
      onToggleItem: vi.fn(),
      onUnselectItems: vi.fn(),
      refetch: vi.fn(),
    }

    const { ListContextProvider } = await import('../../contexts/ListContext')

    render(
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <ListContextProvider value={mockContextValue}>
            <ListView title="Posts">
              <div data-testid="content">Content</div>
            </ListView>
          </ListContextProvider>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )

    expect(screen.getByText('Posts')).toBeInTheDocument()
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('should display empty component when data is empty', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const mockContextValue: ListControllerResult = {
      data: [],
      total: 0,
      isLoading: false,
      isFetching: false,
      error: null,
      page: 1,
      perPage: 10,
      sort: { field: 'id', order: 'ASC' },
      filterValues: {},
      selectedIds: [],
      resource: 'posts',
      setPage: vi.fn(),
      setPerPage: vi.fn(),
      setSort: vi.fn(),
      setFilters: vi.fn(),
      onSelect: vi.fn(),
      onToggleItem: vi.fn(),
      onUnselectItems: vi.fn(),
      refetch: vi.fn(),
    }

    const { ListContextProvider } = await import('../../contexts/ListContext')
    const Empty = () => <div data-testid="empty">No data</div>

    render(
      <QueryClientProvider client={queryClient}>
        <DataProviderContextProvider dataProvider={dataProvider}>
          <ListContextProvider value={mockContextValue}>
            <ListView title="Posts" empty={<Empty />}>
              <div data-testid="content">Content</div>
            </ListView>
          </ListContextProvider>
        </DataProviderContextProvider>
      </QueryClientProvider>
    )

    expect(screen.getByTestId('empty')).toBeInTheDocument()
  })
})

/**
 * List URL Integration Tests
 * TDD: RED phase - Write failing tests first
 *
 * Issue: shadmin-1cve
 *
 * These tests verify that List component properly integrates with URL state:
 * - Reads initial state from URL on mount
 * - Updates URL when Datagrid sort clicks occur
 * - Updates URL when Pagination clicks occur
 * - Updates URL when Filter changes occur
 */
describe('List URL Integration', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn().mockResolvedValue({
        data: [
          { id: 1, title: 'Post 1', author: 'John' },
          { id: 2, title: 'Post 2', author: 'Jane' },
          { id: 3, title: 'Post 3', author: 'Bob' },
        ],
        total: 30, // Enough for pagination
      }),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  describe('List reads filters from URL on mount', () => {
    it('should read page from URL and use it for data fetching', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts?page=3']}>
              <ResourceContextProvider value="posts">
                <List>
                  <div data-testid="content">Content</div>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          pagination: expect.objectContaining({ page: 3 }),
        }))
      })
    })

    it('should read perPage from URL and use it for data fetching', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts?perPage=50']}>
              <ResourceContextProvider value="posts">
                <List>
                  <div data-testid="content">Content</div>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          pagination: expect.objectContaining({ perPage: 50 }),
        }))
      })
    })

    it('should read sort from URL and use it for data fetching', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts?sort=title&order=DESC']}>
              <ResourceContextProvider value="posts">
                <List>
                  <div data-testid="content">Content</div>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          sort: { field: 'title', order: 'DESC' },
        }))
      })
    })

    it('should read filter from URL and use it for data fetching', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })
      const filter = { search: 'test', status: 'active' }

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={[`/posts?filter=${encodeURIComponent(JSON.stringify(filter))}`]}>
              <ResourceContextProvider value="posts">
                <List>
                  <div data-testid="content">Content</div>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          filter: expect.objectContaining({ search: 'test', status: 'active' }),
        }))
      })
    })

    it('should read multiple URL params and combine them', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })
      const filter = { author: 'John' }
      const url = `/posts?page=2&perPage=25&sort=author&order=ASC&filter=${encodeURIComponent(JSON.stringify(filter))}`

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={[url]}>
              <ResourceContextProvider value="posts">
                <List>
                  <div data-testid="content">Content</div>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', expect.objectContaining({
          pagination: { page: 2, perPage: 25 },
          sort: { field: 'author', order: 'ASC' },
          filter: expect.objectContaining({ author: 'John' }),
        }))
      })
    })
  })

  describe('Datagrid sort clicks update URL', () => {
    it('should update URL when clicking a sortable column header', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationSearch = location.search
        return null
      }

      // Import Datagrid for this test
      const { Datagrid } = await import('./Datagrid')
      const { TextField } = await import('../field/TextField')

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List>
                  <Datagrid>
                    <TextField source="title" />
                    <TextField source="author" />
                  </Datagrid>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('column-header-title')).toBeInTheDocument()
      })

      // Click on title column header to sort
      fireEvent.click(screen.getByTestId('column-header-title'))

      await waitFor(() => {
        expect(locationSearch).toContain('sort=title')
      })
    })

    it('should toggle sort order in URL on subsequent clicks', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationSearch = location.search
        return null
      }

      const { Datagrid } = await import('./Datagrid')
      const { TextField } = await import('../field/TextField')

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts?sort=title&order=ASC']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List>
                  <Datagrid>
                    <TextField source="title" />
                  </Datagrid>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('column-header-title')).toBeInTheDocument()
      })

      // Click on title column header to toggle sort order
      fireEvent.click(screen.getByTestId('column-header-title'))

      await waitFor(() => {
        expect(locationSearch).toContain('order=DESC')
      })
    })
  })

  describe('Pagination clicks update URL', () => {
    it('should update URL when clicking next page', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationSearch = location.search
        return null
      }

      const { Pagination } = await import('./Pagination')

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List pagination={<Pagination />}>
                  <div data-testid="content">Content</div>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /next/i }))

      await waitFor(() => {
        expect(locationSearch).toContain('page=2')
      })
    })

    it('should update URL when clicking a specific page number', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationSearch = location.search
        return null
      }

      const { Pagination } = await import('./Pagination')

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List pagination={<Pagination />}>
                  <div data-testid="content">Content</div>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /page 3/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /page 3/i }))

      await waitFor(() => {
        expect(locationSearch).toContain('page=3')
      })
    })

    it('should update URL when changing perPage', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationSearch = location.search
        return null
      }

      const { Pagination } = await import('./Pagination')

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List pagination={<Pagination rowsPerPageOptions={[10, 25, 50]} />}>
                  <div data-testid="content">Content</div>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument()
      })

      // Open the select dropdown and choose 25
      fireEvent.click(screen.getByRole('combobox'))
      fireEvent.click(screen.getByRole('option', { name: '25' }))

      await waitFor(() => {
        expect(locationSearch).toContain('perPage=25')
      })
    })
  })

  describe('Filter changes update URL', () => {
    it('should update URL when filter values change via setFilters', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationSearch = location.search
        return null
      }

      const FilterButton = () => {
        const { setFilters } = useListContext()
        return (
          <button onClick={() => setFilters({ search: 'hello' })}>
            Apply Filter
          </button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List>
                  <FilterButton />
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Apply Filter')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Apply Filter'))

      await waitFor(() => {
        expect(locationSearch).toContain('filter=')
        const params = new URLSearchParams(locationSearch)
        const filterParam = params.get('filter')
        expect(filterParam).toBeTruthy()
        expect(JSON.parse(filterParam!)).toEqual({ search: 'hello' })
      })
    })

    it('should encode complex filter values in URL', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationSearch = location.search
        return null
      }

      const FilterButton = () => {
        const { setFilters } = useListContext()
        return (
          <button onClick={() => setFilters({
            search: 'test & value',
            status: ['active', 'pending'],
            nested: { field: 'value' }
          })}>
            Apply Complex Filter
          </button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List>
                  <FilterButton />
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Apply Complex Filter')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Apply Complex Filter'))

      await waitFor(() => {
        const params = new URLSearchParams(locationSearch)
        const filterParam = params.get('filter')
        expect(filterParam).toBeTruthy()
        const parsed = JSON.parse(filterParam!)
        expect(parsed.search).toBe('test & value')
        expect(parsed.status).toEqual(['active', 'pending'])
        expect(parsed.nested).toEqual({ field: 'value' })
      })
    })

    it('should clear filter from URL when filter is emptied', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let locationSearch = ''

      const LocationDisplay = () => {
        const location = useTestLocation()
        locationSearch = location.search
        return null
      }

      const FilterControl = () => {
        const { setFilters, filterValues } = useListContext()
        return (
          <div>
            <button onClick={() => setFilters({ search: 'test' })}>Add Filter</button>
            <button onClick={() => setFilters({})}>Clear Filter</button>
            <span data-testid="filter-count">{Object.keys(filterValues).length}</span>
          </div>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List>
                  <FilterControl />
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Add Filter')).toBeInTheDocument()
      })

      // Add a filter
      fireEvent.click(screen.getByText('Add Filter'))

      await waitFor(() => {
        expect(locationSearch).toContain('filter=')
      })

      // Clear the filter
      fireEvent.click(screen.getByText('Clear Filter'))

      await waitFor(() => {
        // Filter param should be removed or empty
        const params = new URLSearchParams(locationSearch)
        const filterParam = params.get('filter')
        if (filterParam) {
          expect(JSON.parse(filterParam)).toEqual({})
        }
      })
    })
  })

  describe('URL state persistence across navigation', () => {
    it('should preserve URL params when navigating back', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      let currentLocation = { pathname: '', search: '' }

      const LocationDisplay = () => {
        const location = useTestLocation()
        currentLocation = { pathname: location.pathname, search: location.search }
        return null
      }

      const NavigationTest = () => {
        const { setPage } = useListContext()
        const { navigate, goBack } = useTestRouter()
        return (
          <div>
            <button onClick={() => setPage(5)}>Go to page 5</button>
            <button onClick={() => navigate('/other')}>Navigate Away</button>
            <button onClick={() => goBack()}>Go Back</button>
          </div>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={['/posts']}>
              <ResourceContextProvider value="posts">
                <LocationDisplay />
                <List>
                  <NavigationTest />
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Go to page 5')).toBeInTheDocument()
      })

      // Set page to 5
      fireEvent.click(screen.getByText('Go to page 5'))

      await waitFor(() => {
        expect(currentLocation.search).toContain('page=5')
      })

      // Navigate away
      fireEvent.click(screen.getByText('Navigate Away'))

      await waitFor(() => {
        expect(currentLocation.pathname).toBe('/other')
      })

      // Go back
      fireEvent.click(screen.getByText('Go Back'))

      await waitFor(() => {
        expect(currentLocation.pathname).toBe('/posts')
        expect(currentLocation.search).toContain('page=5')
      })
    })
  })

  describe('Shareable URLs', () => {
    it('should produce a URL that can be shared and restored', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      // Build a complex URL with all parameters
      const filter = { search: 'react', category: 'tutorial' }
      const shareableUrl = `/posts?page=3&perPage=25&sort=title&order=DESC&filter=${encodeURIComponent(JSON.stringify(filter))}`

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={dataProvider}>
            <TestMemoryRouter initialEntries={[shareableUrl]}>
              <ResourceContextProvider value="posts">
                <List>
                  <div data-testid="content">Content</div>
                </List>
              </ResourceContextProvider>
            </TestMemoryRouter>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      // Verify all params are correctly read and used
      await waitFor(() => {
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', {
          pagination: { page: 3, perPage: 25 },
          sort: { field: 'title', order: 'DESC' },
          filter: { search: 'react', category: 'tutorial' },
        })
      })
    })
  })
})
