/**
 * Create Component Tests
 * TDD: RED phase - Write failing tests first
 *
 * Epic: shadmin-ha1 (P1)
 *
 * Tests cover:
 * - Props interface (resource, children, title, etc.)
 * - Form submission handling with useCreate hook
 * - Redirect behavior after successful create (list/show/edit/false options)
 * - Transform prop for data transformation before submit
 * - Loading and error states
 * - Notification on success/failure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation } from 'react-router'
import { Create } from './Create'
import { CreateBase } from './CreateBase'
import { useCreateContext } from './CreateContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ResourceContextProvider } from '../../contexts/ResourceContext'
import { NotificationContextProvider, useNotificationContext } from '../../contexts/NotificationContext'
import type { DataProvider } from '../../types'

// Test wrapper with required providers
const createWrapper = (
  dataProvider: DataProvider,
  initialEntries: string[] = ['/posts/create']
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

// Minimal wrapper without resource context
const createMinimalWrapper = (
  dataProvider: DataProvider,
  initialEntries: string[] = ['/posts/create']
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
              {children}
            </MemoryRouter>
          </DataProviderContextProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    )
  }
}

describe('Create Component', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn().mockResolvedValue({ data: [], total: 0 }),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn().mockResolvedValue({ data: { id: 1, title: 'New Post' } }),
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
          <Create resource="posts">
            <div data-testid="form">Form Content</div>
          </Create>
        </Wrapper>
      )

      expect(screen.getByTestId('form')).toBeInTheDocument()
    })

    it('should infer resource from ResourceContext if not provided', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Create>
            <div data-testid="form">Form Content</div>
          </Create>
        </Wrapper>
      )

      expect(screen.getByTestId('form')).toBeInTheDocument()
    })

    it('should accept title prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Create title="Create New Post">
            <div data-testid="form">Form Content</div>
          </Create>
        </Wrapper>
      )

      expect(screen.getByText('Create New Post')).toBeInTheDocument()
    })

    it('should accept children prop and render inside Card', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Create>
            <div data-testid="form-content">Form Content</div>
          </Create>
        </Wrapper>
      )

      const content = screen.getByTestId('form-content')
      expect(content).toBeInTheDocument()
      // Card should be present (check by data-slot attribute)
      const card = content.closest('[data-slot="card"]')
      expect(card).toBeInTheDocument()
    })

    it('should accept className prop', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Create className="custom-class">
            <div data-testid="form">Form Content</div>
          </Create>
        </Wrapper>
      )

      const card = screen.getByTestId('form').closest('[data-slot="card"]')
      expect(card).toHaveClass('custom-class')
    })

    it('should accept actions prop for custom actions', async () => {
      const Wrapper = createWrapper(dataProvider)
      const CustomActions = () => <button data-testid="custom-action">Custom</button>

      render(
        <Wrapper>
          <Create actions={<CustomActions />}>
            <div data-testid="form">Form Content</div>
          </Create>
        </Wrapper>
      )

      expect(screen.getByTestId('custom-action')).toBeInTheDocument()
    })

    it('should hide default actions when actions={false}', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Create actions={false}>
            <div data-testid="form">Form Content</div>
          </Create>
        </Wrapper>
      )

      // No actions container should be rendered
      expect(screen.queryByTestId('create-actions')).not.toBeInTheDocument()
    })
  })

  describe('Form Submission Handling', () => {
    it('should call dataProvider.create on form submission', async () => {
      const Wrapper = createWrapper(dataProvider)

      const TestForm = () => {
        const { save } = useCreateContext()
        return (
          <form
            data-testid="form"
            onSubmit={(e) => {
              e.preventDefault()
              save({ title: 'New Post' })
            }}
          >
            <button type="submit">Submit</button>
          </form>
        )
      }

      render(
        <Wrapper>
          <Create resource="posts">
            <TestForm />
          </Create>
        </Wrapper>
      )

      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(dataProvider.create).toHaveBeenCalledWith('posts', {
          data: { title: 'New Post' },
        })
      })
    })

    it('should provide save function through context', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })} data-testid="save-btn">
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <Create resource="posts">
            <Consumer />
          </Create>
        </Wrapper>
      )

      expect(screen.getByTestId('save-btn')).toBeInTheDocument()
    })

    it('should provide saving state through context', async () => {
      let resolveSave: (value: unknown) => void
      dataProvider.create = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolveSave = resolve
        })
      })

      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save, saving } = useCreateContext()
        return (
          <div>
            <span data-testid="saving">{saving ? 'true' : 'false'}</span>
            <button onClick={() => save({ title: 'Test' })}>Save</button>
          </div>
        )
      }

      render(
        <Wrapper>
          <Create resource="posts">
            <Consumer />
          </Create>
        </Wrapper>
      )

      expect(screen.getByTestId('saving')).toHaveTextContent('false')

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(screen.getByTestId('saving')).toHaveTextContent('true')
      })

      // Resolve the save
      resolveSave!({ data: { id: 1, title: 'Test' } })

      await waitFor(() => {
        expect(screen.getByTestId('saving')).toHaveTextContent('false')
      })
    })

    it('should provide resource through context', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { resource } = useCreateContext()
        return <span data-testid="resource">{resource}</span>
      }

      render(
        <Wrapper>
          <Create resource="posts">
            <Consumer />
          </Create>
        </Wrapper>
      )

      expect(screen.getByTestId('resource')).toHaveTextContent('posts')
    })
  })

  describe('Redirect Behavior', () => {
    it('should redirect to list by default after successful create', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })

      let currentPathname = ''

      const LocationDisplay = () => {
        const location = useLocation()
        currentPathname = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <DataProviderContextProvider dataProvider={dataProvider}>
              <MemoryRouter initialEntries={['/posts/create']}>
                <ResourceContextProvider value="posts">
                  <LocationDisplay />
                  <Create resource="posts">
                    <Consumer />
                  </Create>
                </ResourceContextProvider>
              </MemoryRouter>
            </DataProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(currentPathname).toBe('/posts')
      })
    })

    it('should redirect to show when redirect="show"', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })

      let currentPathname = ''

      const LocationDisplay = () => {
        const location = useLocation()
        currentPathname = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <DataProviderContextProvider dataProvider={dataProvider}>
              <MemoryRouter initialEntries={['/posts/create']}>
                <ResourceContextProvider value="posts">
                  <LocationDisplay />
                  <Create resource="posts" redirect="show">
                    <Consumer />
                  </Create>
                </ResourceContextProvider>
              </MemoryRouter>
            </DataProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(currentPathname).toBe('/posts/1/show')
      })
    })

    it('should redirect to edit when redirect="edit"', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })

      let currentPathname = ''

      const LocationDisplay = () => {
        const location = useLocation()
        currentPathname = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <DataProviderContextProvider dataProvider={dataProvider}>
              <MemoryRouter initialEntries={['/posts/create']}>
                <ResourceContextProvider value="posts">
                  <LocationDisplay />
                  <Create resource="posts" redirect="edit">
                    <Consumer />
                  </Create>
                </ResourceContextProvider>
              </MemoryRouter>
            </DataProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(currentPathname).toBe('/posts/1')
      })
    })

    it('should not redirect when redirect={false}', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })

      let currentPathname = ''

      const LocationDisplay = () => {
        const location = useLocation()
        currentPathname = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <DataProviderContextProvider dataProvider={dataProvider}>
              <MemoryRouter initialEntries={['/posts/create']}>
                <ResourceContextProvider value="posts">
                  <LocationDisplay />
                  <Create resource="posts" redirect={false}>
                    <Consumer />
                  </Create>
                </ResourceContextProvider>
              </MemoryRouter>
            </DataProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(dataProvider.create).toHaveBeenCalled()
      })

      // Should still be on create page
      expect(currentPathname).toBe('/posts/create')
    })

    it('should redirect to custom path when redirect is a string', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })

      let currentPathname = ''

      const LocationDisplay = () => {
        const location = useLocation()
        currentPathname = location.pathname
        return null
      }

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <DataProviderContextProvider dataProvider={dataProvider}>
              <MemoryRouter initialEntries={['/posts/create']}>
                <ResourceContextProvider value="posts">
                  <LocationDisplay />
                  <Create resource="posts" redirect="/custom/path">
                    <Consumer />
                  </Create>
                </ResourceContextProvider>
              </MemoryRouter>
            </DataProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(currentPathname).toBe('/custom/path')
      })
    })
  })

  describe('Transform Prop', () => {
    it('should transform data before submission', async () => {
      const Wrapper = createWrapper(dataProvider)

      const transform = vi.fn((data: Record<string, unknown>) => ({
        ...data,
        transformed: true,
        createdAt: '2024-01-01',
      }))

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <Wrapper>
          <Create resource="posts" transform={transform}>
            <Consumer />
          </Create>
        </Wrapper>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(transform).toHaveBeenCalledWith({ title: 'Test' })
        expect(dataProvider.create).toHaveBeenCalledWith('posts', {
          data: {
            title: 'Test',
            transformed: true,
            createdAt: '2024-01-01',
          },
        })
      })
    })

    it('should support async transform function', async () => {
      const Wrapper = createWrapper(dataProvider)

      const transform = vi.fn(async (data: Record<string, unknown>) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return {
          ...data,
          asyncTransformed: true,
        }
      })

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <Wrapper>
          <Create resource="posts" transform={transform}>
            <Consumer />
          </Create>
        </Wrapper>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(dataProvider.create).toHaveBeenCalledWith('posts', {
          data: {
            title: 'Test',
            asyncTransformed: true,
          },
        })
      })
    })
  })

  describe('Loading and Error States', () => {
    it('should provide isLoading state', async () => {
      let resolveSave: (value: unknown) => void
      dataProvider.create = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolveSave = resolve
        })
      })

      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save, saving } = useCreateContext()
        return (
          <div>
            <span data-testid="is-loading">{saving ? 'loading' : 'idle'}</span>
            <button onClick={() => save({ title: 'Test' })}>Save</button>
          </div>
        )
      }

      render(
        <Wrapper>
          <Create resource="posts">
            <Consumer />
          </Create>
        </Wrapper>
      )

      expect(screen.getByTestId('is-loading')).toHaveTextContent('idle')

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('loading')
      })

      resolveSave!({ data: { id: 1, title: 'Test' } })

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('idle')
      })
    })

    it('should provide error state after failed submission', async () => {
      const error = new Error('Creation failed')
      dataProvider.create = vi.fn().mockRejectedValue(error)

      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save, error: saveError } = useCreateContext()
        return (
          <div>
            <span data-testid="error">{saveError?.message ?? 'none'}</span>
            <button onClick={() => save({ title: 'Test' })}>Save</button>
          </div>
        )
      }

      render(
        <Wrapper>
          <Create resource="posts">
            <Consumer />
          </Create>
        </Wrapper>
      )

      expect(screen.getByTestId('error')).toHaveTextContent('none')

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Creation failed')
      })
    })
  })

  describe('Notifications', () => {
    it('should show success notification on successful create', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })

      let notifications: Array<{ message: string }> = []

      const NotificationDisplay = () => {
        const { notifications: notifs } = useNotificationContext()
        notifications = notifs
        return null
      }

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <NotificationDisplay />
            <DataProviderContextProvider dataProvider={dataProvider}>
              <MemoryRouter initialEntries={['/posts/create']}>
                <ResourceContextProvider value="posts">
                  <Create resource="posts">
                    <Consumer />
                  </Create>
                </ResourceContextProvider>
              </MemoryRouter>
            </DataProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(notifications.length).toBeGreaterThan(0)
        expect(notifications[0]?.message).toContain('created')
      })
    })

    it('should show error notification on failed create', async () => {
      dataProvider.create = vi.fn().mockRejectedValue(new Error('Server error'))

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })

      let notifications: Array<{ message: string; options?: { type?: string } }> = []

      const NotificationDisplay = () => {
        const { notifications: notifs } = useNotificationContext()
        notifications = notifs
        return null
      }

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <NotificationDisplay />
            <DataProviderContextProvider dataProvider={dataProvider}>
              <MemoryRouter initialEntries={['/posts/create']}>
                <ResourceContextProvider value="posts">
                  <Create resource="posts">
                    <Consumer />
                  </Create>
                </ResourceContextProvider>
              </MemoryRouter>
            </DataProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(notifications.length).toBeGreaterThan(0)
        expect(notifications[0]?.options?.type).toBe('error')
      })
    })

    it('should allow disabling success notification', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })

      let notifications: Array<{ message: string }> = []

      const NotificationDisplay = () => {
        const { notifications: notifs } = useNotificationContext()
        notifications = notifs
        return null
      }

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <NotificationDisplay />
            <DataProviderContextProvider dataProvider={dataProvider}>
              <MemoryRouter initialEntries={['/posts/create']}>
                <ResourceContextProvider value="posts">
                  <Create resource="posts" disableSuccessNotification>
                    <Consumer />
                  </Create>
                </ResourceContextProvider>
              </MemoryRouter>
            </DataProviderContextProvider>
          </NotificationContextProvider>
        </QueryClientProvider>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(dataProvider.create).toHaveBeenCalled()
      })

      // Wait a bit to ensure no notification appears
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(notifications.length).toBe(0)
    })
  })

  describe('Mutation Options', () => {
    it('should accept mutationOptions prop', async () => {
      const onSuccess = vi.fn()
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <Wrapper>
          <Create resource="posts" mutationOptions={{ onSuccess }}>
            <Consumer />
          </Create>
        </Wrapper>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled()
      })
    })

    it('should accept onSuccess callback', async () => {
      const onSuccess = vi.fn()
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <Wrapper>
          <Create resource="posts" mutationOptions={{ onSuccess }}>
            <Consumer />
          </Create>
        </Wrapper>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled()
        // Verify the first argument contains the created data
        const firstArg = onSuccess.mock.calls[0]?.[0]
        expect(firstArg).toEqual({ data: { id: 1, title: 'New Post' } })
      })
    })

    it('should accept onError callback', async () => {
      const error = new Error('Creation failed')
      dataProvider.create = vi.fn().mockRejectedValue(error)
      const onError = vi.fn()
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save } = useCreateContext()
        return (
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        )
      }

      render(
        <Wrapper>
          <Create resource="posts" mutationOptions={{ onError }}>
            <Consumer />
          </Create>
        </Wrapper>
      )

      fireEvent.click(screen.getByText('Save'))

      await waitFor(() => {
        expect(onError).toHaveBeenCalled()
        // Verify the first argument is the error
        const firstArg = onError.mock.calls[0]?.[0]
        expect(firstArg).toEqual(error)
      })
    })
  })

  describe('UI Container (ShadCN Card)', () => {
    it('should render children inside a Card container', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Create>
            <div data-testid="form-content">Form Content</div>
          </Create>
        </Wrapper>
      )

      const content = screen.getByTestId('form-content')
      expect(content).toBeInTheDocument()
      const card = content.closest('[data-slot="card"]')
      expect(card).toBeInTheDocument()
    })

    it('should render title in CardHeader', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <Create title="Create Post">
            <div data-testid="form-content">Form Content</div>
          </Create>
        </Wrapper>
      )

      expect(screen.getByText('Create Post')).toBeInTheDocument()
    })
  })
})

describe('CreateBase Component', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn().mockResolvedValue({ data: [], total: 0 }),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn().mockResolvedValue({ data: { id: 1, title: 'New Post' } }),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should provide create context without UI wrapper', async () => {
    const Wrapper = createWrapper(dataProvider)

    const Consumer = () => {
      const { resource, save, saving } = useCreateContext()
      return (
        <div>
          <span data-testid="resource">{resource}</span>
          <span data-testid="saving">{saving ? 'true' : 'false'}</span>
          <button onClick={() => save({ title: 'Test' })}>Save</button>
        </div>
      )
    }

    render(
      <Wrapper>
        <CreateBase resource="posts">
          <Consumer />
        </CreateBase>
      </Wrapper>
    )

    expect(screen.getByTestId('resource')).toHaveTextContent('posts')
    expect(screen.getByTestId('saving')).toHaveTextContent('false')
  })

  it('should be composable with custom UI', async () => {
    const Wrapper = createWrapper(dataProvider)

    const CustomUI = () => {
      const { save, saving } = useCreateContext()
      return (
        <div data-testid="custom-create">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save({ title: 'Custom Form' })
            }}
          >
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Create'}
            </button>
          </form>
        </div>
      )
    }

    render(
      <Wrapper>
        <CreateBase resource="posts">
          <CustomUI />
        </CreateBase>
      </Wrapper>
    )

    expect(screen.getByTestId('custom-create')).toBeInTheDocument()
    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('should handle form submission with all options', async () => {
    const onSuccess = vi.fn()
    const transform = vi.fn((data: Record<string, unknown>) => ({ ...data, extra: true }))

    const Wrapper = createWrapper(dataProvider)

    const Consumer = () => {
      const { save } = useCreateContext()
      return (
        <button onClick={() => save({ title: 'Test' })}>Save</button>
      )
    }

    render(
      <Wrapper>
        <CreateBase
          resource="posts"
          transform={transform}
          mutationOptions={{ onSuccess }}
        >
          <Consumer />
        </CreateBase>
      </Wrapper>
    )

    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(transform).toHaveBeenCalledWith({ title: 'Test' })
      expect(dataProvider.create).toHaveBeenCalledWith('posts', {
        data: { title: 'Test', extra: true },
      })
      expect(onSuccess).toHaveBeenCalled()
    })
  })
})
