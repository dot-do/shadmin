/**
 * EditBase Component Tests
 *
 * These tests specifically verify that EditBase uses proper navigation
 * after successful save operations. The component should navigate to
 * the appropriate path based on the redirect prop.
 *
 * Epic: shadmin-ha1 (P1)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { EditBase } from './EditBase'
import { useRecordContext } from '../../contexts/RecordContext'
import { useShadminFormContext } from '../../contexts/FormContext'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ResourceContextProvider } from '../../contexts/ResourceContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import type { DataProvider } from '../../types'
import { TestMemoryRouter, useTestLocation } from '../../test-utils'

/**
 * Create a test wrapper with all required providers
 */
const createWrapper = (
  dataProvider: DataProvider,
  initialEntries: string[] = ['/posts/1/edit']
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
 * Location tracker component to verify navigation
 */
const LocationTracker = ({ onLocationChange }: { onLocationChange: (path: string) => void }) => {
  const location = useTestLocation()
  onLocationChange(location.pathname)
  return null
}

/**
 * Form consumer component for testing save functionality
 */
const SaveButton = ({ data = { title: 'Updated Title' } }: { data?: Record<string, unknown> }) => {
  const { save } = useShadminFormContext()
  return (
    <button
      data-testid="save-button"
      onClick={() => save?.(data)}
    >
      Save
    </button>
  )
}

/**
 * Record display component
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

describe('EditBase Navigation', () => {
  let dataProvider: DataProvider
  let navigatedPath: string

  beforeEach(() => {
    navigatedPath = '/posts/1/edit'
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Original Title', body: 'Original body' },
      }),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Updated Title', body: 'Updated body' },
      }),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  describe('Navigation after successful save', () => {
    it('should navigate to list by default after successful save', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1}>
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(navigatedPath).toBe('/posts')
      })
    })

    it('should navigate to show view when redirect="show"', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1} redirect="show">
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(navigatedPath).toBe('/posts/1/show')
      })
    })

    it('should navigate to edit view when redirect="edit"', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1} redirect="edit">
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(navigatedPath).toBe('/posts/1')
      })
    })

    it('should navigate to custom path when redirect is a string', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1} redirect="/custom/success">
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(navigatedPath).toBe('/custom/success')
      })
    })

    it('should support redirect as a function', async () => {
      const Wrapper = createWrapper(dataProvider)
      const redirectFn = vi.fn((resource: string, id: number | string) => `/custom/${resource}/${id}/done`)

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1} redirect={redirectFn}>
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(redirectFn).toHaveBeenCalled()
        expect(navigatedPath).toBe('/custom/posts/1/done')
      })
    })

    it('should not navigate when redirect=false', async () => {
      const Wrapper = createWrapper(dataProvider)
      const initialPath = '/posts/1/edit'

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1} redirect={false}>
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalled()
      })

      // Wait a bit to ensure no navigation happens
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(navigatedPath).toBe(initialPath)
    })
  })

  describe('Navigation should not happen on error', () => {
    it('should not navigate when update fails', async () => {
      dataProvider.update = vi.fn().mockRejectedValue(new Error('Update failed'))
      const Wrapper = createWrapper(dataProvider)
      const initialPath = '/posts/1/edit'

      const SaveButtonWithErrorHandling = () => {
        const { save } = useShadminFormContext()
        return (
          <button
            data-testid="save-button"
            onClick={() => save?.({ title: 'Updated' }).catch(() => { /* expected error */ })}
          >
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1}>
            <SaveButtonWithErrorHandling />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalled()
      })

      // Wait a bit to ensure no navigation happens
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(navigatedPath).toBe(initialPath)
    })
  })

  describe('Navigation with different ID types', () => {
    it('should handle numeric IDs in redirect paths', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={123} redirect="show">
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(navigatedPath).toBe('/posts/123/show')
      })
    })

    it('should handle string IDs in redirect paths', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: { id: 'uuid-123', title: 'Test' },
      })
      dataProvider.update = vi.fn().mockResolvedValue({
        data: { id: 'uuid-123', title: 'Updated' },
      })
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id="uuid-123" redirect="show">
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(navigatedPath).toBe('/posts/uuid-123/show')
      })
    })
  })

  describe('Context providers', () => {
    it('should provide record through RecordContext', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <EditBase resource="posts" id={1}>
            <RecordDisplay />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('record-id')).toHaveTextContent('1')
        expect(screen.getByTestId('record-title')).toHaveTextContent('Original Title')
      })
    })

    it('should provide save function through FormContext', async () => {
      const Wrapper = createWrapper(dataProvider)

      const Consumer = () => {
        const { save, saving } = useShadminFormContext()
        return (
          <div>
            <span data-testid="has-save">{save ? 'yes' : 'no'}</span>
            <span data-testid="saving">{saving ? 'true' : 'false'}</span>
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
        expect(screen.getByTestId('has-save')).toHaveTextContent('yes')
        expect(screen.getByTestId('saving')).toHaveTextContent('false')
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
          <EditBase resource="posts" id={1}>
            <Consumer />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('resource')).toHaveTextContent('posts')
      })
    })
  })

  describe('Mutation modes', () => {
    it('should handle optimistic mode with navigation after update', async () => {
      dataProvider.update = vi.fn().mockImplementation(
        () => new Promise((resolve) =>
          setTimeout(() => resolve({ data: { id: 1, title: 'Server Updated' } }), 50)
        )
      )
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1} mutationMode="optimistic">
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      // In optimistic mode, navigation happens after the actual update completes
      await waitFor(() => {
        expect(navigatedPath).toBe('/posts')
      })
    })

    it('should handle pessimistic mode with navigation after update', async () => {
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1} mutationMode="pessimistic">
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(navigatedPath).toBe('/posts')
      })
    })
  })

  describe('Transform function', () => {
    it('should navigate after transform and successful update', async () => {
      const transform = vi.fn((data) => ({ ...data, transformed: true }))
      const Wrapper = createWrapper(dataProvider)

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1} transform={transform}>
            <SaveButton data={{ title: 'Transformed Title' }} />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(transform).toHaveBeenCalled()
        expect(dataProvider.update).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            data: expect.objectContaining({ transformed: true }),
          })
        )
      })

      await waitFor(() => {
        expect(navigatedPath).toBe('/posts')
      })
    })
  })

  describe('Callbacks', () => {
    it('should call onSuccess callback before navigation', async () => {
      const onSuccess = vi.fn()
      let onSuccessCalled = false
      let navigationHappened = false

      const Wrapper = createWrapper(dataProvider)

      const trackedOnSuccess = (data: unknown, variables: unknown, context: unknown) => {
        onSuccessCalled = true
        onSuccess(data, variables, context)
      }

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => {
            if (path === '/posts') {
              navigationHappened = true
            }
          }} />
          <EditBase resource="posts" id={1} mutationOptions={{ onSuccess: trackedOnSuccess }}>
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(navigationHappened).toBe(true)
      })
    })

    it('should call onError callback and not navigate on error', async () => {
      const error = new Error('Update failed')
      dataProvider.update = vi.fn().mockRejectedValue(error)
      const onError = vi.fn()
      const Wrapper = createWrapper(dataProvider)
      const initialPath = '/posts/1/edit'

      const SaveButtonWithErrorHandling = () => {
        const { save } = useShadminFormContext()
        return (
          <button
            data-testid="save-button"
            onClick={() => save?.({ title: 'Updated' }).catch(() => { /* expected */ })}
          >
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <LocationTracker onLocationChange={(path) => { navigatedPath = path }} />
          <EditBase resource="posts" id={1} mutationOptions={{ onError }}>
            <SaveButtonWithErrorHandling />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error, expect.anything(), undefined)
      })

      // Navigation should not happen
      expect(navigatedPath).toBe(initialPath)
    })
  })
})
