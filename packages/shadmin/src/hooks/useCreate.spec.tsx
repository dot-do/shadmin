/**
 * useCreate hook tests
 * TDD: RED phase - Write failing tests first
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'


import { useCreate } from './useCreate'
import { DataProviderContextProvider } from '../contexts/DataProviderContext'

import type { DataProvider } from '../types'
import type { ReactNode } from 'react'

// Test wrapper with required providers
const createWrapper = (dataProvider: DataProvider) => {
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
          {children}
        </DataProviderContextProvider>
      </QueryClientProvider>
    )
  }
}

describe('useCreate', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn().mockResolvedValue({
        data: { id: 1, title: 'New Post', content: 'Hello World' },
      }),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should return a create function and mutation state', () => {
    const { result } = renderHook(() => useCreate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [create, state] = result.current

    expect(typeof create).toBe('function')
    expect(state.isLoading).toBe(false)
    expect(state.isPending).toBe(false)
    expect(state.isSuccess).toBe(false)
    expect(state.isError).toBe(false)
  })

  it('should create a record when called', async () => {
    const { result } = renderHook(() => useCreate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [create] = result.current

    await act(async () => {
      await create('posts', { data: { title: 'New Post', content: 'Hello World' } })
    })

    expect(dataProvider.create).toHaveBeenCalledWith('posts', {
      data: { title: 'New Post', content: 'Hello World' },
    })
  })

  it('should return created data', async () => {
    const { result } = renderHook(() => useCreate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [create] = result.current
    let createdData: unknown

    await act(async () => {
      createdData = await create('posts', { data: { title: 'New Post' } })
    })

    expect(createdData).toEqual({ data: { id: 1, title: 'New Post', content: 'Hello World' } })
  })

  it('should update isLoading during mutation', async () => {
    let resolveCreate: (value: unknown) => void
    const createPromise = new Promise((resolve) => {
      resolveCreate = resolve
    })
    dataProvider.create = vi.fn().mockReturnValue(createPromise)

    const { result } = renderHook(() => useCreate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [create] = result.current

    let mutationPromise: Promise<unknown>
    act(() => {
      mutationPromise = create('posts', { data: { title: 'New' } })
    })

    // Should be loading
    await waitFor(() => {
      const [, state] = result.current
      expect(state.isPending).toBe(true)
    })

    // Resolve the promise
    await act(async () => {
      resolveCreate!({ data: { id: 1, title: 'New' } })
      await mutationPromise!
    })

    // Should no longer be loading
    await waitFor(() => {
      const [, state] = result.current
      expect(state.isPending).toBe(false)
      expect(state.isSuccess).toBe(true)
    })
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to create')
    dataProvider.create = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(() => useCreate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [create] = result.current

    await act(async () => {
      try {
        await create('posts', { data: { title: 'New' } })
      } catch {
        // Expected to throw
      }
    })

    await waitFor(() => {
      const [, state] = result.current
      expect(state.isError).toBe(true)
      expect(state.error).toEqual(error)
    })
  })

  it('should support meta parameter', async () => {
    const { result } = renderHook(() => useCreate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [create] = result.current

    await act(async () => {
      await create('posts', { data: { title: 'New' }, meta: { notify: true } })
    })

    expect(dataProvider.create).toHaveBeenCalledWith('posts', {
      data: { title: 'New' },
      meta: { notify: true },
    })
  })

  it('should support resource in options for pre-configured hook', async () => {
    const { result } = renderHook(() => useCreate('posts'), {
      wrapper: createWrapper(dataProvider),
    })

    const [create] = result.current

    await act(async () => {
      await create({ data: { title: 'New Post' } })
    })

    expect(dataProvider.create).toHaveBeenCalledWith('posts', {
      data: { title: 'New Post' },
    })
  })

  it('should return data in state after successful mutation', async () => {
    const { result } = renderHook(() => useCreate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [create] = result.current

    await act(async () => {
      await create('posts', { data: { title: 'New' } })
    })

    await waitFor(() => {
      const [, state] = result.current
      expect(state.data).toEqual({ data: { id: 1, title: 'New Post', content: 'Hello World' } })
    })
  })
})
