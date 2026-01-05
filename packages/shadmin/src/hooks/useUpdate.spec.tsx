/**
 * useUpdate hook tests
 * TDD: RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useUpdate } from './useUpdate'
import { DataProviderContextProvider } from '../contexts/DataProviderContext'
import type { DataProvider } from '../types'

// Test wrapper with required providers
const createWrapper = (dataProvider: DataProvider) => {
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
          {children}
        </DataProviderContextProvider>
      </QueryClientProvider>
    )
  }
}

describe('useUpdate', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue({
        data: { id: 123, title: 'Updated Post', content: 'Updated content' },
      }),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should return an update function and mutation state', () => {
    const { result } = renderHook(() => useUpdate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [update, state] = result.current

    expect(typeof update).toBe('function')
    expect(state.isLoading).toBe(false)
    expect(state.isPending).toBe(false)
    expect(state.isSuccess).toBe(false)
    expect(state.isError).toBe(false)
  })

  it('should update a record when called', async () => {
    const { result } = renderHook(() => useUpdate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [update] = result.current

    await act(async () => {
      await update('posts', {
        id: 123,
        data: { title: 'Updated Post' },
        previousData: { id: 123, title: 'Old Title' },
      })
    })

    expect(dataProvider.update).toHaveBeenCalledWith('posts', {
      id: 123,
      data: { title: 'Updated Post' },
      previousData: { id: 123, title: 'Old Title' },
    })
  })

  it('should return updated data', async () => {
    const { result } = renderHook(() => useUpdate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [update] = result.current
    let updatedData: unknown

    await act(async () => {
      updatedData = await update('posts', {
        id: 123,
        data: { title: 'Updated' },
      })
    })

    expect(updatedData).toEqual({ data: { id: 123, title: 'Updated Post', content: 'Updated content' } })
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to update')
    dataProvider.update = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(() => useUpdate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [update] = result.current

    await act(async () => {
      try {
        await update('posts', { id: 123, data: { title: 'New' } })
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
    const { result } = renderHook(() => useUpdate(), {
      wrapper: createWrapper(dataProvider),
    })

    const [update] = result.current

    await act(async () => {
      await update('posts', { id: 123, data: { title: 'New' }, meta: { silent: true } })
    })

    expect(dataProvider.update).toHaveBeenCalledWith('posts', {
      id: 123,
      data: { title: 'New' },
      meta: { silent: true },
    })
  })

  it('should support pre-configured resource', async () => {
    const { result } = renderHook(() => useUpdate('posts'), {
      wrapper: createWrapper(dataProvider),
    })

    const [update] = result.current

    await act(async () => {
      await update({ id: 123, data: { title: 'Updated' } })
    })

    expect(dataProvider.update).toHaveBeenCalledWith('posts', {
      id: 123,
      data: { title: 'Updated' },
    })
  })
})
