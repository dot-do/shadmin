/**
 * useDeleteMany hook tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useDeleteMany } from './useDeleteMany'
import { DataProviderContextProvider } from '../contexts/DataProviderContext'
import type { DataProvider } from '../types'

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

describe('useDeleteMany', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn().mockResolvedValue({ data: [1, 2, 3] }),
    }
  })

  it('should return a deleteMany function and mutation state', () => {
    const { result } = renderHook(() => useDeleteMany(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteMany, state] = result.current
    expect(typeof deleteMany).toBe('function')
    expect(state.isPending).toBe(false)
  })

  it('should delete multiple records when called', async () => {
    const { result } = renderHook(() => useDeleteMany(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteMany] = result.current

    await act(async () => {
      await deleteMany('posts', { ids: [1, 2, 3] })
    })

    expect(dataProvider.deleteMany).toHaveBeenCalledWith('posts', { ids: [1, 2, 3] })
  })

  it('should return deleted ids', async () => {
    const { result } = renderHook(() => useDeleteMany(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteMany] = result.current
    let response: unknown

    await act(async () => {
      response = await deleteMany('posts', { ids: [1, 2, 3] })
    })

    expect(response).toEqual({ data: [1, 2, 3] })
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to delete')
    dataProvider.deleteMany = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(() => useDeleteMany(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteMany] = result.current

    await act(async () => {
      try {
        await deleteMany('posts', { ids: [1, 2] })
      } catch {
        // Expected
      }
    })

    await waitFor(() => {
      const [, state] = result.current
      expect(state.isError).toBe(true)
    })
  })

  it('should support meta parameter', async () => {
    const { result } = renderHook(() => useDeleteMany(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteMany] = result.current

    await act(async () => {
      await deleteMany('posts', { ids: [1, 2], meta: { permanent: true } })
    })

    expect(dataProvider.deleteMany).toHaveBeenCalledWith('posts', {
      ids: [1, 2],
      meta: { permanent: true },
    })
  })

  it('should support pre-configured resource', async () => {
    const { result } = renderHook(() => useDeleteMany('posts'), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteMany] = result.current

    await act(async () => {
      await deleteMany({ ids: [4, 5, 6] })
    })

    expect(dataProvider.deleteMany).toHaveBeenCalledWith('posts', { ids: [4, 5, 6] })
  })
})
