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
            onClick={() => { void save?.({ title: 'Updated' })?.catch(() => { /* expected error */ }) }}
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
      let navigationHappened = false

      const Wrapper = createWrapper(dataProvider)

      const trackedOnSuccess = (data: unknown, variables: unknown, context: unknown) => {
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
            onClick={() => { void save?.({ title: 'Updated' })?.catch(() => { /* expected */ }) }}
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

  /**
   * Optimistic Update Rollback Tests
   *
   * These tests verify that when mutationMode="optimistic" and an update fails,
   * the component correctly rolls back to the PREVIOUS data that was captured
   * BEFORE the mutation started, not potentially stale data from the record.
   *
   * The bug: EditBase.tsx lines 240-242 uses `record` for rollback, but `record`
   * comes from useGetOne and may have been updated by another source during the
   * mutation. The correct behavior is to use `previousData` which is captured
   * at line 202 before the mutation starts.
   *
   * Epic: shadmin-ggtp
   */
  describe('Optimistic update rollback', () => {
    it('should rollback to previousData captured BEFORE mutation starts, not stale record', async () => {
      // Setup: The record starts with 'Original Title'
      const originalRecord = { id: 1, title: 'Original Title', body: 'Original body' }

      // Simulate a scenario where `record` from useGetOne could become stale
      // The dataProvider.update will fail after a delay, during which time
      // the `record` reference might have changed
      dataProvider.getOne = vi.fn().mockResolvedValue({ data: originalRecord })
      dataProvider.update = vi.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Server error')), 100)
        })
      })

      const Wrapper = createWrapper(dataProvider)

      const FormWithRollbackTest = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()
        return (
          <div>
            <span data-testid="current-title">{record?.title as string}</span>
            <button
              data-testid="save-button"
              onClick={() => { void save?.({ title: 'New Title' })?.catch(() => { /* expected */ }) }}
            >
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} mutationMode="optimistic">
            <FormWithRollbackTest />
          </EditBase>
        </Wrapper>
      )

      // Wait for initial data to load
      await waitFor(() => {
        expect(screen.getByTestId('current-title')).toHaveTextContent('Original Title')
      })

      // Click save - this should optimistically update to 'New Title'
      fireEvent.click(screen.getByTestId('save-button'))

      // Verify optimistic update shows new title immediately
      await waitFor(() => {
        expect(screen.getByTestId('current-title')).toHaveTextContent('New Title')
      })

      // Wait for the mutation to fail and rollback to occur
      await waitFor(() => {
        // After rollback, should show 'Original Title' (the previousData captured before mutation)
        // NOT any potentially stale value
        expect(screen.getByTestId('current-title')).toHaveTextContent('Original Title')
      }, { timeout: 200 })

      expect(dataProvider.update).toHaveBeenCalledTimes(1)
    })

    it('should capture previousData BEFORE optimistic update is applied', async () => {
      // This test verifies the order of operations:
      // 1. previousData is captured
      // 2. optimistic update is applied to local state
      // 3. mutation is attempted
      // 4. on failure, rollback uses the captured previousData

      const capturedPreviousData: Record<string, unknown>[] = []

      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Initial Value', version: 1 },
      })

      dataProvider.update = vi.fn().mockImplementation((_resource, params) => {
        // Capture what previousData was passed to the update
        capturedPreviousData.push(params.previousData)
        return Promise.reject(new Error('Forced failure'))
      })

      const Wrapper = createWrapper(dataProvider)

      const FormWithCapture = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()
        return (
          <div>
            <span data-testid="title">{record?.title as string}</span>
            <span data-testid="version">{record?.version as number}</span>
            <button
              data-testid="save-button"
              onClick={() => { void save?.({ title: 'Modified Value', version: 2 })?.catch(() => {}) }}
            >
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} mutationMode="optimistic">
            <FormWithCapture />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Initial Value')
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalled()
      })

      // The previousData passed to update should be the ORIGINAL data
      // captured BEFORE the optimistic update was applied
      expect(capturedPreviousData[0]).toEqual({
        id: 1,
        title: 'Initial Value',
        version: 1,
      })

      // After rollback, form should show original values
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Initial Value')
        expect(screen.getByTestId('version')).toHaveTextContent('1')
      })
    })

    it('should rollback to exact previousData even if record reference changed during mutation', async () => {
      // This test simulates a race condition where the `record` from useGetOne
      // might be refreshed/changed during an in-flight mutation

      const originalData = { id: 1, title: 'Version A', counter: 100 }
      const updatedByOtherSource = { id: 1, title: 'Version B (from another tab)', counter: 200 }

      let getOneCallCount = 0
      dataProvider.getOne = vi.fn().mockImplementation(() => {
        getOneCallCount++
        // First call returns original, subsequent calls return "updated" data
        // simulating another source updating the record
        if (getOneCallCount === 1) {
          return Promise.resolve({ data: originalData })
        }
        return Promise.resolve({ data: updatedByOtherSource })
      })

      let rejectUpdate: (err: Error) => void
      dataProvider.update = vi.fn().mockImplementation(() => {
        return new Promise((_resolve, reject) => {
          rejectUpdate = (err: Error) => reject(err)
        })
      })

      const Wrapper = createWrapper(dataProvider)

      const FormDisplay = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()
        return (
          <div>
            <span data-testid="title">{record?.title as string}</span>
            <span data-testid="counter">{record?.counter as number}</span>
            <button
              data-testid="save-button"
              onClick={() => { void save?.({ title: 'User Edit', counter: 101 })?.catch(() => {}) }}
            >
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} mutationMode="optimistic">
            <FormDisplay />
          </EditBase>
        </Wrapper>
      )

      // Initial load shows 'Version A'
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Version A')
        expect(screen.getByTestId('counter')).toHaveTextContent('100')
      })

      // User clicks save
      fireEvent.click(screen.getByTestId('save-button'))

      // Optimistically shows user's edit
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('User Edit')
      })

      // Now reject the update to trigger rollback
      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalled()
      })

      rejectUpdate!(new Error('Conflict error'))

      // After rollback, should show 'Version A' (the previousData captured before mutation)
      // NOT 'Version B' (what the stale `record` reference might point to)
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Version A')
        expect(screen.getByTestId('counter')).toHaveTextContent('100')
      })
    })

    it('should restore form values to original state after failed optimistic update', async () => {
      dataProvider.getOne = vi.fn().mockResolvedValue({
        data: { id: 1, title: 'Form Original', description: 'Original description' },
      })

      dataProvider.update = vi.fn().mockRejectedValue(new Error('Validation failed'))

      const Wrapper = createWrapper(dataProvider)

      const FormWithInputs = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()
        return (
          <div>
            <div data-testid="form-title">{record?.title as string}</div>
            <div data-testid="form-description">{record?.description as string}</div>
            <button
              data-testid="save-button"
              onClick={() => { void save?.({
                title: 'Changed Title',
                description: 'Changed description'
              })?.catch(() => {}) }}
            >
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} mutationMode="optimistic">
            <FormWithInputs />
          </EditBase>
        </Wrapper>
      )

      // Verify original form values
      await waitFor(() => {
        expect(screen.getByTestId('form-title')).toHaveTextContent('Form Original')
        expect(screen.getByTestId('form-description')).toHaveTextContent('Original description')
      })

      // Attempt save with changed values
      fireEvent.click(screen.getByTestId('save-button'))

      // Optimistically shows changed values
      await waitFor(() => {
        expect(screen.getByTestId('form-title')).toHaveTextContent('Changed Title')
      })

      // After mutation fails, form should be restored to ORIGINAL values
      await waitFor(() => {
        expect(screen.getByTestId('form-title')).toHaveTextContent('Form Original')
        expect(screen.getByTestId('form-description')).toHaveTextContent('Original description')
      })
    })

    it('should use explicitly saved previousData for rollback, not current record state', async () => {
      // This test directly verifies the bug: the rollback should use previousData
      // that was captured at the START of the save function, not the `record`
      // variable which may have a different reference

      let savedPreviousData: Record<string, unknown> | null = null

      const originalRecord = { id: 1, name: 'Snapshot Before Save', timestamp: 1000 }

      dataProvider.getOne = vi.fn().mockResolvedValue({ data: originalRecord })

      dataProvider.update = vi.fn().mockImplementation((_resource, params) => {
        // Store what previousData was when save() was called
        savedPreviousData = params.previousData
        return Promise.reject(new Error('Update rejected'))
      })

      const Wrapper = createWrapper(dataProvider)

      const TestComponent = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()
        return (
          <div>
            <span data-testid="name">{record?.name as string}</span>
            <span data-testid="timestamp">{record?.timestamp as number}</span>
            <button
              data-testid="save-button"
              onClick={() => { void save?.({ name: 'New Name', timestamp: 2000 })?.catch(() => {}) }}
            >
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} mutationMode="optimistic">
            <TestComponent />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('name')).toHaveTextContent('Snapshot Before Save')
      })

      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalled()
      })

      // Verify previousData was correctly captured
      expect(savedPreviousData).toEqual(originalRecord)

      // After rollback, the displayed values should match the savedPreviousData exactly
      await waitFor(() => {
        expect(screen.getByTestId('name')).toHaveTextContent('Snapshot Before Save')
        expect(screen.getByTestId('timestamp')).toHaveTextContent('1000')
      })
    })

    it('should rollback to previousData when record from useGetOne changes during mutation', async () => {
      /**
       * BUG DEMONSTRATION TEST
       *
       * This test exposes the bug in EditBase.tsx lines 240-242 where `record`
       * is used for rollback instead of `previousData`.
       *
       * Scenario:
       * 1. User starts editing record with value "A"
       * 2. User clicks save (optimistic update shows "B")
       * 3. During the mutation, useGetOne returns new data "C" (background refetch)
       * 4. Mutation fails
       * 5. EXPECTED: Rollback to "A" (previousData captured before mutation)
       * 6. ACTUAL (BUG): Rollback to "C" (stale record from closure)
       *
       * The fix should change line 242 from:
       *   setLocalRecord(record)
       * to:
       *   setLocalRecord(previousData)
       */

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnMount: false, refetchOnWindowFocus: false },
          mutations: { retry: false },
        },
      })

      const originalRecord = { id: 1, title: 'Original Value A', version: 1 }
      const backgroundRefetchRecord = { id: 1, title: 'Background Value C', version: 3 }

      let getOneCallCount = 0
      let updatePromiseReject: ((err: Error) => void) | null = null

      const testDataProvider: DataProvider = {
        getList: vi.fn(),
        getOne: vi.fn().mockImplementation(() => {
          getOneCallCount++
          // First call returns original, after invalidation returns background data
          if (getOneCallCount === 1) {
            return Promise.resolve({ data: originalRecord })
          }
          return Promise.resolve({ data: backgroundRefetchRecord })
        }),
        getMany: vi.fn(),
        getManyReference: vi.fn(),
        create: vi.fn(),
        update: vi.fn().mockImplementation(() => {
          return new Promise((_, reject) => {
            updatePromiseReject = reject
          })
        }),
        updateMany: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
      }

      const TestComponent = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()
        return (
          <div>
            <span data-testid="title">{record?.title as string}</span>
            <span data-testid="version">{record?.version as number}</span>
            <button
              data-testid="save-button"
              onClick={() => { void save?.({ title: 'User Edit B', version: 2 })?.catch(() => {}) }}
            >
              Save
            </button>
            <button
              data-testid="refetch-button"
              onClick={() => {
                // Simulate a background refetch by invalidating the query
                queryClient.invalidateQueries({ queryKey: ['posts', 'getOne', { id: 1 }] })
              }}
            >
              Refetch
            </button>
          </div>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={testDataProvider}>
            <NotificationContextProvider>
              <TestMemoryRouter initialEntries={['/posts/1/edit']}>
                <ResourceContextProvider value="posts">
                  <EditBase resource="posts" id={1} mutationMode="optimistic">
                    <TestComponent />
                  </EditBase>
                </ResourceContextProvider>
              </TestMemoryRouter>
            </NotificationContextProvider>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      // Initial load shows 'Original Value A'
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Original Value A')
        expect(screen.getByTestId('version')).toHaveTextContent('1')
      })

      // User clicks save - optimistically updates to 'User Edit B'
      fireEvent.click(screen.getByTestId('save-button'))

      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('User Edit B')
      })

      // Simulate background refetch happening during the mutation
      // This updates the `record` from useGetOne to 'Background Value C'
      fireEvent.click(screen.getByTestId('refetch-button'))

      await waitFor(() => {
        expect(testDataProvider.update).toHaveBeenCalled()
      })

      // Wait for the refetch to potentially update record
      await new Promise(resolve => setTimeout(resolve, 50))

      // Now reject the mutation to trigger rollback
      updatePromiseReject!(new Error('Server conflict'))

      // EXPECTED BEHAVIOR: After rollback, should show 'Original Value A'
      // (the previousData captured BEFORE mutation started)
      //
      // BUG BEHAVIOR: Shows 'Background Value C' (from stale record closure)
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('Original Value A')
        expect(screen.getByTestId('version')).toHaveTextContent('1')
      }, { timeout: 500 })
    })

    it('should not use stale record closure variable for rollback', async () => {
      /**
       * This test directly targets the closure bug.
       *
       * The save() function captures `record` in its closure via useCallback.
       * When save() is called, it should snapshot the current record as previousData
       * and use that snapshot for rollback, not the potentially-stale `record` from
       * the closure which could have been updated by React Query.
       */

      const staleDataDetector = { wasStaleDataUsed: false }

      const initialRecord = { id: 1, content: 'INITIAL', marker: 'initial-marker' }
      const staleRecord = { id: 1, content: 'STALE', marker: 'stale-marker' }

      let recordVersion = 0
      let rejectMutation: ((err: Error) => void) | null = null

      dataProvider.getOne = vi.fn().mockImplementation(() => {
        recordVersion++
        if (recordVersion === 1) {
          return Promise.resolve({ data: initialRecord })
        }
        // Subsequent calls return "stale" data to simulate external update
        return Promise.resolve({ data: staleRecord })
      })

      dataProvider.update = vi.fn().mockImplementation(() => {
        // Trigger a refetch during mutation by returning the promise
        return new Promise((_, reject) => {
          rejectMutation = reject
        })
      })

      const Wrapper = createWrapper(dataProvider)

      const FormWithStaleCheck = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()

        // Check if we're seeing stale data after rollback
        if (record?.marker === 'stale-marker') {
          staleDataDetector.wasStaleDataUsed = true
        }

        return (
          <div>
            <span data-testid="content">{record?.content as string}</span>
            <span data-testid="marker">{record?.marker as string}</span>
            <button
              data-testid="save-button"
              onClick={() => { void save?.({ content: 'EDITED', marker: 'edited-marker' })?.catch(() => {}) }}
            >
              Save
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} mutationMode="optimistic">
            <FormWithStaleCheck />
          </EditBase>
        </Wrapper>
      )

      // Verify initial state
      await waitFor(() => {
        expect(screen.getByTestId('content')).toHaveTextContent('INITIAL')
        expect(screen.getByTestId('marker')).toHaveTextContent('initial-marker')
      })

      // Trigger save
      fireEvent.click(screen.getByTestId('save-button'))

      // Wait for optimistic update
      await waitFor(() => {
        expect(screen.getByTestId('content')).toHaveTextContent('EDITED')
      })

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalled()
      })

      // Reject to trigger rollback
      rejectMutation!(new Error('Conflict'))

      // After rollback, should show INITIAL data (from previousData snapshot)
      // NOT STALE data (from potentially updated record closure)
      await waitFor(() => {
        expect(screen.getByTestId('content')).toHaveTextContent('INITIAL')
        expect(screen.getByTestId('marker')).toHaveTextContent('initial-marker')
      })

      // Verify stale data was never used for rollback
      expect(staleDataDetector.wasStaleDataUsed).toBe(false)
    })

    it('should use localRecord snapshot for rollback when record changes during async save', async () => {
      /**
       * FAILING TEST - Demonstrates the bug in EditBase.tsx
       *
       * The bug: Line 242 uses `record` for rollback, but `record` comes from
       * the useCallback closure which captures the `record` value at the time
       * the save function was created. If record changes during the save operation
       * AND the component re-renders creating a new save function, the rollback
       * could use incorrect data.
       *
       * The correct fix: Use `previousData` (captured at line 202) for rollback,
       * not `record` from the closure. This ensures we always rollback to the
       * exact state that existed when save() was invoked.
       *
       * Expected behavior after fix:
       * - setLocalRecord(previousData) instead of setLocalRecord(record)
       */

      // Track what value is used for rollback
      let rollbackValue: unknown = null

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })

      // Initial record value when user starts editing
      const userEditingRecord = { id: 1, title: 'User Was Editing This', seq: 100 }
      // Value that might come from a background sync/refetch
      const backgroundSyncedRecord = { id: 1, title: 'Background Synced Value', seq: 999 }

      let getOneCallCount = 0
      let updateReject: ((err: Error) => void) | null = null

      const testDataProvider: DataProvider = {
        getList: vi.fn(),
        getOne: vi.fn().mockImplementation(() => {
          getOneCallCount++
          if (getOneCallCount === 1) {
            return Promise.resolve({ data: userEditingRecord })
          }
          // After first call, return the "background synced" value
          return Promise.resolve({ data: backgroundSyncedRecord })
        }),
        getMany: vi.fn(),
        getManyReference: vi.fn(),
        create: vi.fn(),
        update: vi.fn().mockImplementation(() => {
          return new Promise((_, reject) => {
            updateReject = reject
          })
        }),
        updateMany: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
      }

      const TestForm = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()

        // Track what value ends up being displayed after rollback
        rollbackValue = record

        return (
          <div>
            <span data-testid="title">{record?.title as string}</span>
            <span data-testid="seq">{record?.seq as number}</span>
            <button
              data-testid="save-btn"
              onClick={() => { void save?.({ title: 'User New Value', seq: 101 })?.catch(() => {}) }}
            >
              Save
            </button>
            <button
              data-testid="trigger-bg-update"
              onClick={() => {
                // Force a refetch which will return backgroundSyncedRecord
                queryClient.invalidateQueries({ queryKey: ['posts', 'getOne'] })
              }}
            >
              Background Update
            </button>
          </div>
        )
      }

      render(
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={testDataProvider}>
            <NotificationContextProvider>
              <TestMemoryRouter initialEntries={['/posts/1/edit']}>
                <ResourceContextProvider value="posts">
                  <EditBase resource="posts" id={1} mutationMode="optimistic">
                    <TestForm />
                  </EditBase>
                </ResourceContextProvider>
              </TestMemoryRouter>
            </NotificationContextProvider>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )

      // Wait for initial load - user is editing 'User Was Editing This'
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('User Was Editing This')
        expect(screen.getByTestId('seq')).toHaveTextContent('100')
      })

      // User clicks save - this should capture previousData = { title: 'User Was Editing This', seq: 100 }
      fireEvent.click(screen.getByTestId('save-btn'))

      // Optimistic update shows user's new value
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('User New Value')
      })

      // Wait for update to be called
      await waitFor(() => {
        expect(testDataProvider.update).toHaveBeenCalled()
      })

      // Now reject the update - this should trigger rollback
      updateReject!(new Error('Optimistic lock failed'))

      // EXPECTED: Rollback to 'User Was Editing This' (previousData captured at save() invocation)
      // BUG: Might rollback to wrong value if record closure is stale
      await waitFor(() => {
        expect(screen.getByTestId('title')).toHaveTextContent('User Was Editing This')
        expect(screen.getByTestId('seq')).toHaveTextContent('100')
      }, { timeout: 1000 })

      // Verify the rollback value is exactly what was captured before save
      expect(rollbackValue).toEqual(userEditingRecord)
    })

    it('should handle consecutive save attempts with proper previousData isolation', async () => {
      /**
       * FAILING TEST - Tests that each save() call captures its own previousData
       *
       * Scenario:
       * 1. Record starts at state A
       * 2. User saves (optimistically shows B), mutation pending
       * 3. First mutation fails, rollback to A
       * 4. User saves again (optimistically shows C), mutation pending
       * 5. Second mutation fails, rollback should be to A (not B)
       *
       * The bug: If previousData is not properly captured per-invocation,
       * rollback might use incorrect state.
       */

      const rollbackHistory: string[] = []
      const stateA = { id: 1, value: 'STATE_A' }

      const rejectFns: ((err: Error) => void)[] = []

      dataProvider.getOne = vi.fn().mockResolvedValue({ data: stateA })
      dataProvider.update = vi.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          rejectFns.push(reject)
        })
      })

      const Wrapper = createWrapper(dataProvider)

      const MultiSaveForm = () => {
        const record = useRecordContext()
        const { save } = useShadminFormContext()

        // Track all states we see
        if (record?.value) {
          rollbackHistory.push(record.value as string)
        }

        return (
          <div>
            <span data-testid="value">{record?.value as string}</span>
            <button
              data-testid="save-b"
              onClick={() => { void save?.({ value: 'STATE_B' })?.catch(() => {}) }}
            >
              Save B
            </button>
            <button
              data-testid="save-c"
              onClick={() => { void save?.({ value: 'STATE_C' })?.catch(() => {}) }}
            >
              Save C
            </button>
          </div>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} mutationMode="optimistic">
            <MultiSaveForm />
          </EditBase>
        </Wrapper>
      )

      // Initial state A
      await waitFor(() => {
        expect(screen.getByTestId('value')).toHaveTextContent('STATE_A')
      })

      // First save attempt - should capture previousData = STATE_A
      fireEvent.click(screen.getByTestId('save-b'))

      await waitFor(() => {
        expect(screen.getByTestId('value')).toHaveTextContent('STATE_B')
      })

      await waitFor(() => {
        expect(rejectFns.length).toBe(1)
      })

      // First mutation fails - should rollback to STATE_A
      rejectFns[0]!(new Error('First failure'))

      await waitFor(() => {
        expect(screen.getByTestId('value')).toHaveTextContent('STATE_A')
      })

      // Second save attempt - should also capture previousData = STATE_A
      fireEvent.click(screen.getByTestId('save-c'))

      await waitFor(() => {
        expect(screen.getByTestId('value')).toHaveTextContent('STATE_C')
      })

      await waitFor(() => {
        expect(rejectFns.length).toBe(2)
      })

      // Second mutation fails - should rollback to STATE_A (not STATE_B)
      rejectFns[1]!(new Error('Second failure'))

      await waitFor(() => {
        expect(screen.getByTestId('value')).toHaveTextContent('STATE_A')
      })

      // Verify we never saw STATE_B after it should have been rolled back
      const stateAIndexAfterFirstRollback = rollbackHistory.lastIndexOf('STATE_A')
      const stateBAfterFirstRollback = rollbackHistory.slice(stateAIndexAfterFirstRollback + 1).includes('STATE_B')
      expect(stateBAfterFirstRollback).toBe(false)
    })
  })
})
