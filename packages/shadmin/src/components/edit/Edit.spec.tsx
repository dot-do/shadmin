/**
 * Edit Component Tests
 * TDD: RED phase - Write failing tests first
 *
 * Epic: shadmin-ha1 (P1)
 *
 * Tests cover:
 * - Props interface (resource, id, title, children, etc.)
 * - Record fetching using useGetOne hook
 * - Form submission with useUpdate hook
 * - Optimistic update handling
 * - Redirect behavior after successful edit
 * - Loading, error, and not found states
 * - RecordContext provider for children
 * - MutationMode options (pessimistic, optimistic, undoable)
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'


import { Edit } from './Edit'
import { EditBase } from './EditBase'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { useShadminFormContext } from '../../contexts/FormContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import { useRecordContext } from '../../contexts/RecordContext'
import { ResourceContextProvider } from '../../contexts/ResourceContext'
import { TestMemoryRouter, useTestLocation } from '../../test-utils'

import type { DataProvider } from '../../types'
import type { ReactNode } from 'react'

// Test wrapper with required providers
const createWrapper = (
  dataProvider: DataProvider,
  initialEntries: string[] = ['/posts/1/edit']
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

// Minimal wrapper without resource context
const createMinimalWrapper = (
  dataProvider: DataProvider,
  initialEntries: string[] = ['/posts/1/edit']
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

describe('Edit Component', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Test Post', body: 'Test body' },
      }),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Updated Post', body: 'Updated body' },
      }),
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
          <Edit resource="posts" id={1}>
            <div data-testid="content">Content</div>
          </Edit>
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
          <Edit id={1}>
            <div data-testid="content">Content</div>
          </Edit>
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
          <Edit id={123}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', expect.objectContaining({ id: 123 }))
      })
    })

    it('should accept title prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Edit id={1} title="Edit Post">
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Edit Post')).toBeInTheDocument()
      })
    })

    it('should accept custom title as ReactNode', async () => {
      const Wrapper = createWrapper(dataProvider)
      const CustomTitle = () => <span data-testid="custom-title">Custom Title</span>

      render(
        <Wrapper>
          <Edit id={1} title={<CustomTitle />}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('custom-title')).toBeInTheDocument()
      })
    })

    it('should accept actions prop for custom actions', async () => {
      const Wrapper = createWrapper(dataProvider)
      const CustomActions = () => <button data-testid="custom-action">Delete</button>

      render(
        <Wrapper>
          <Edit id={1} actions={<CustomActions />}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('custom-action')).toBeInTheDocument()
      })
    })

    it('should accept aside prop for sidebar content', async () => {
      const Wrapper = createWrapper(dataProvider)
      const Aside = () => <div data-testid="aside">Sidebar content</div>

      render(
        <Wrapper>
          <Edit id={1} aside={<Aside />}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('aside')).toBeInTheDocument()
      })
    })

    it('should accept redirect prop to customize redirect after save', async () => {
      const Wrapper = createWrapper(dataProvider)
      let navigatePath = ''

      const LocationTracker = () => {
        const location = useTestLocation()
        navigatePath = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => save?.({ title: 'Updated' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <LocationTracker />
          <Edit id={1} redirect="list">
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(navigatePath).toBe('/posts')
      })
    })

    it('should accept mutationMode prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { mutationMode } = useShadminFormContext()
        return <span data-testid="mode">{mutationMode}</span>
      }

      render(
        <Wrapper>
          <Edit id={1} mutationMode="optimistic">
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('optimistic')
      })
    })

    it('should accept transform prop to modify data before saving', async () => {
      const transform = vi.fn((data) => ({ ...data, transformed: true }))
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => save?.({ title: 'Updated' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <Edit id={1} transform={transform}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(transform).toHaveBeenCalledWith({ title: 'Updated' })
        expect(dataProvider.update).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            data: expect.objectContaining({ transformed: true }),
          })
        )
      })
    })

    it('should accept queryOptions prop for custom React Query options', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Edit id={1} queryOptions={{ staleTime: 5000 }}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })
    })

    it('should accept mutationOptions prop for custom mutation options', async () => {
      const onSuccess = vi.fn()
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => save?.({ title: 'Updated' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <Edit id={1} mutationOptions={{ onSuccess }}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled()
      })
    })

    it('should accept disableAuthentication prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Edit id={1} disableAuthentication>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })
    })
  })

  describe('Record Fetching (useGetOne)', () => {
    it('should fetch record by ID on mount', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Edit id={1}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })
    })

    it('should refetch when ID changes', async () => {
      const Wrapper = createWrapper(dataProvider)

      const { rerender } = render(
        <Wrapper>
          <Edit id={1}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 1 })
      })

      rerender(
        <Wrapper>
          <Edit id={2}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 2 })
      })
    })

    it('should pass meta option to getOne', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Edit id={1} queryOptions={{ meta: { include: ['author'] } }}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(dataProvider.getOne).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({ meta: { include: ['author'] } })
        )
      })
    })
  })

  describe('Form Submission (useUpdate)', () => {
    it('should call update with correct parameters on save', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => save?.({ title: 'Updated Title' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <Edit id={1}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalledWith('posts', {
          id: 1,
          data: { title: 'Updated Title' },
          previousData: { id: 1, title: 'Test Post', body: 'Test body' },
        })
      })
    })

    it('should provide saving state through context', async () => {
      // Slow down the update response
      dataProvider.update = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: { id: 1 } }), 100))
      )
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save, saving } = useShadminFormContext()
        return (
          <div>
            <span data-testid="saving">{saving ? 'true' : 'false'}</span>
            <button data-testid="save" onClick={() => save?.({ title: 'Updated' })}>
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <Edit id={1}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('saving')).toHaveTextContent('false')
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(screen.getByTestId('saving')).toHaveTextContent('true')
      })

      await waitFor(() => {
        expect(screen.getByTestId('saving')).toHaveTextContent('false')
      })
    })

    it('should handle update errors', async () => {
      const error = new Error('Update failed')
      dataProvider.update = vi.fn().mockRejectedValue(error)
      const Wrapper = createWrapper(dataProvider)
      const onError = vi.fn()

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => {
            const result = save?.({ title: 'Updated' })
            if (result instanceof Promise) {
              result.catch(() => {})
            }
          }}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <Edit id={1} mutationOptions={{ onError }}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            id: 1,
            data: expect.objectContaining({ title: 'Updated' }),
          }),
          undefined
        )
      })
    })
  })

  describe('Optimistic Update Handling', () => {
    it('should update UI immediately in optimistic mode', async () => {
      // Slow down the response to verify optimistic update
      dataProvider.update = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: { id: 1, title: 'Server Updated' } }), 100))
      )
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()
        return (
          <div>
            <span data-testid="title">{record?.title as string}</span>
            <button data-testid="save" onClick={() => save?.({ title: 'Optimistic Title' })}>
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <Edit id={1} mutationMode="optimistic">
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Test Post')
      })

      fireEvent.click(screen.getByTestId('save'))

      // Should show optimistic update immediately
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Optimistic Title')
      })
    })

    it('should rollback on error in optimistic mode', async () => {
      dataProvider.update = vi.fn().mockRejectedValue(new Error('Update failed'))
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()
        const handleSave = async () => {
          try {
            await save?.({ title: 'Optimistic Title' })
          } catch {
            // Error expected - rollback should happen
          }
        }
        return (
          <div>
            <span data-testid="title">{record?.title as string}</span>
            <button data-testid="save" onClick={handleSave}>
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <Edit id={1} mutationMode="optimistic">
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Test Post')
      })

      fireEvent.click(screen.getByTestId('save'))

      // Should rollback to original value after error
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Test Post')
      })
    })

    it('should wait for server response in pessimistic mode', async () => {
      dataProvider.update = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: { id: 1, title: 'Server Updated' } }), 100))
      )
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()
        return (
          <div>
            <span data-testid="title">{record?.title as string}</span>
            <button data-testid="save" onClick={() => save?.({ title: 'Pessimistic Title' })}>
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <Edit id={1} mutationMode="pessimistic">
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Test Post')
      })

      fireEvent.click(screen.getByTestId('save'))

      // In pessimistic mode, should wait for server response
      // Title should still be original until server responds
      expect(screen.getByTestId('title')).toHaveTextContent('Test Post')

      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Server Updated')
      })
    })
  })

  describe('Redirect Behavior', () => {
    it('should redirect to list by default after successful save', async () => {
      const Wrapper = createWrapper(dataProvider)
      let navigatePath = ''

      const LocationTracker = () => {
        const location = useTestLocation()
        navigatePath = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => save?.({ title: 'Updated' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <LocationTracker />
          <Edit id={1}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(navigatePath).toBe('/posts')
      })
    })

    it('should redirect to show when redirect="show"', async () => {
      const Wrapper = createWrapper(dataProvider)
      let navigatePath = ''

      const LocationTracker = () => {
        const location = useTestLocation()
        navigatePath = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => save?.({ title: 'Updated' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <LocationTracker />
          <Edit id={1} redirect="show">
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(navigatePath).toBe('/posts/1/show')
      })
    })

    it('should redirect to edit when redirect="edit"', async () => {
      const Wrapper = createWrapper(dataProvider)
      let navigatePath = ''

      const LocationTracker = () => {
        const location = useTestLocation()
        navigatePath = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => save?.({ title: 'Updated' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <LocationTracker />
          <Edit id={1} redirect="edit">
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(navigatePath).toBe('/posts/1')
      })
    })

    it('should not redirect when redirect=false', async () => {
      const Wrapper = createWrapper(dataProvider)
      let navigatePath = ''

      const LocationTracker = () => {
        const location = useTestLocation()
        navigatePath = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => save?.({ title: 'Updated' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <LocationTracker />
          <Edit id={1} redirect={false}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      const initialPath = navigatePath

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalled()
      })

      // Path should remain the same
      expect(navigatePath).toBe(initialPath)
    })

    it('should support custom redirect path', async () => {
      const Wrapper = createWrapper(dataProvider)
      let navigatePath = ''

      const LocationTracker = () => {
        const location = useTestLocation()
        navigatePath = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => save?.({ title: 'Updated' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <LocationTracker />
          <Edit id={1} redirect="/custom/path">
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(navigatePath).toBe('/custom/path')
      })
    })

    it('should support redirect as function', async () => {
      const Wrapper = createWrapper(dataProvider)
      let navigatePath = ''

      const LocationTracker = () => {
        const location = useTestLocation()
        navigatePath = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return (
          <button data-testid="save" onClick={() => save?.({ title: 'Updated' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <LocationTracker />
          <Edit
            id={1}
            redirect={(resource, id, _data) => `/custom/${resource}/${id}`}
          >
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(navigatePath).toBe('/custom/posts/1')
      })
    })
  })

  describe('Loading State', () => {
    it('should show loading indicator while fetching record', async () => {
      // Slow down the response
      dataProvider.getOne = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: { id: 1, title: 'Test' } }), 100))
      )
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Edit id={1}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      // Should show loading initially
      expect(screen.getByTestId('edit-loading')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByTestId('edit-loading')).not.toBeInTheDocument()
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })
    })

    it('should accept custom loading component', async () => {
      dataProvider.getOne = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: { id: 1, title: 'Test' } }), 100))
      )
      const Wrapper = createWrapper(dataProvider)
      const CustomLoading = () => <div data-testid="custom-loading">Custom Loading...</div>

      render(
        <Wrapper>
          <Edit id={1} loading={<CustomLoading />}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByTestId('custom-loading')).not.toBeInTheDocument()
      })
    })
  })

  describe('Error State', () => {
    it('should show error message when fetch fails', async () => {
      const error = new Error('Failed to fetch')
      dataProvider.getOne = vi.fn().mockRejectedValue(error)
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Edit id={1}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
      })
    })

    it('should accept custom error component', async () => {
      const error = new Error('Failed to fetch')
      dataProvider.getOne = vi.fn().mockRejectedValue(error)
      const Wrapper = createWrapper(dataProvider)
      const CustomError = ({ error }: { error: Error }) => (
        <div data-testid="custom-error">Custom Error: {error.message}</div>
      )

      render(
        <Wrapper>
          <Edit id={1} error={<CustomError error={error} />}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('custom-error')).toBeInTheDocument()
      })
    })
  })

  describe('Not Found State', () => {
    it('should show not found message when record does not exist', async () => {
      dataProvider.getOne = vi.fn().mockRejectedValue(new Error('Resource posts with id 999 not found'))
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Edit id={999}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/not found/i)).toBeInTheDocument()
      })
    })

    it('should accept custom empty/not found component', async () => {
      dataProvider.getOne = vi.fn().mockRejectedValue(new Error('Not found'))
      const Wrapper = createWrapper(dataProvider)
      const NotFound = () => <div data-testid="not-found">Record not found</div>

      render(
        <Wrapper>
          <Edit id={999} empty={<NotFound />}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('not-found')).toBeInTheDocument()
      })
    })
  })

  describe('RecordContext Provider', () => {
    it('should provide record through RecordContext', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const record = useRecordContext()
        return (
          <div>
            <span data-testid="record-id">{record?.id as number}</span>
            <span data-testid="record-title">{record?.title as string}</span>
          </div>
        )
      }

      render(
        <Wrapper>
          <Edit id={1}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-id')).toHaveTextContent('1')
        expect(screen.getByTestId('record-title')).toHaveTextContent('Test Post')
      })
    })

    it('should update RecordContext when record is modified', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()
        return (
          <div>
            <span data-testid="record-title">{record?.title as string}</span>
            <button data-testid="save" onClick={() => save?.({ title: 'New Title' })}>
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <Edit id={1} mutationMode="optimistic">
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('Test Post')
      })

      fireEvent.click(screen.getByTestId('save'))

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('New Title')
      })
    })
  })

  describe('FormContext Provider', () => {
    it('should provide save function through FormContext', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save } = useShadminFormContext()
        return <span data-testid="has-save">{save ? 'yes' : 'no'}</span>
      }

      render(
        <Wrapper>
          <Edit id={1}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('has-save')).toHaveTextContent('yes')
      })
    })

    it('should provide resource through FormContext', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { resource } = useShadminFormContext()
        return <span data-testid="resource">{resource}</span>
      }

      render(
        <Wrapper>
          <Edit id={1}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('resource')).toHaveTextContent('posts')
      })
    })

    it('should provide record through FormContext', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { record } = useShadminFormContext()
        return <span data-testid="record-title">{(record?.title as string) ?? 'none'}</span>
      }

      render(
        <Wrapper>
          <Edit id={1}>
            <Consumer />
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-title')).toHaveTextContent('Test Post')
      })
    })
  })

  describe('UI Container', () => {
    it('should render children inside a Card container', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Edit id={1}>
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
        const card = screen.getByTestId('content').closest('[data-slot="card"]')
        expect(card).toBeInTheDocument()
      })
    })

    it('should accept className prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Edit id={1} className="custom-class">
            <div data-testid="content">Content</div>
          </Edit>
        </Wrapper>
      )

      await waitFor(() => {
        const card = screen.getByTestId('content').closest('[data-slot="card"]')
        expect(card).toHaveClass('custom-class')
      })
    })
  })
})

describe('EditBase Component', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Test Post', body: 'Test body' },
      }),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Updated Post', body: 'Updated body' },
      }),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should provide edit context without UI wrapper', async () => {
    const Wrapper = createWrapper(dataProvider)

    const Consumer = () => {
      const record = useRecordContext()
      const { save } = useShadminFormContext()
      return (
        <div>
          <span data-testid="record-title">{record?.title as string}</span>
          <span data-testid="has-save">{save ? 'yes' : 'no'}</span>
        </div>
      )
    }

    render(
      <Wrapper>
        <EditBase resource="posts" id={1}>
          <Consumer />
        </EditBase>
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('record-title')).toHaveTextContent('Test Post')
      expect(screen.getByTestId('has-save')).toHaveTextContent('yes')
    })
  })

  it('should be composable with custom UI', async () => {
    const Wrapper = createWrapper(dataProvider)

    const CustomUI = () => {
      const record = useRecordContext()
      const { save, saving } = useShadminFormContext()
      return (
        <div data-testid="custom-edit">
          <h1>{record?.title as string}</h1>
          <button onClick={() => save?.({ title: 'Custom Updated' })} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )
    }

    render(
      <Wrapper>
        <EditBase resource="posts" id={1}>
          <CustomUI />
        </EditBase>
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('custom-edit')).toBeInTheDocument()
      expect(screen.getByText('Test Post')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(dataProvider.update).toHaveBeenCalledWith(
        'posts',
        expect.objectContaining({
          data: { title: 'Custom Updated' },
        })
      )
    })
  })

  it('should expose loading and error states', async () => {
    dataProvider.getOne = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: { id: 1, title: 'Test' } }), 100))
    )
    const Wrapper = createWrapper(dataProvider)

    const Consumer = () => {
      const record = useRecordContext()
      return <span data-testid="title">{record?.title as string ?? 'Loading...'}</span>
    }

    render(
      <Wrapper>
        <EditBase resource="posts" id={1}>
          <Consumer />
        </EditBase>
      </Wrapper>
    )

    expect(screen.getByTestId('title')).toHaveTextContent('Loading...')

    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('Test')
    })
  })
})
