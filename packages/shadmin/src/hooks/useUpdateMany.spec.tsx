/**
 * useUpdateMany hook tests
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'


import { useUpdateMany } from './useUpdateMany'
import { DataProviderContextProvider } from '../contexts/DataProviderContext'

import type { DataProvider } from '../types'
import type { ReactNode } from 'react'

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

describe('useUpdateMany', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn().mockResolvedValue({ data: [1, 2, 3] }),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should return an updateMany function and mutation state', () => {
    const { result } = renderHook(() => useUpdateMany(), {
      wrapper: createWrapper(dataProvider),
    })

    const [updateMany, state] = result.current
    expect(typeof updateMany).toBe('function')
    expect(state.isPending).toBe(false)
  })

  it('should update multiple records when called', async () => {
    const { result } = renderHook(() => useUpdateMany(), {
      wrapper: createWrapper(dataProvider),
    })

    const [updateMany] = result.current

    await act(async () => {
      await updateMany('posts', { ids: [1, 2, 3], data: { published: true } })
    })

    expect(dataProvider.updateMany).toHaveBeenCalledWith('posts', {
      ids: [1, 2, 3],
      data: { published: true },
    })
  })

  it('should return updated ids', async () => {
    const { result } = renderHook(() => useUpdateMany(), {
      wrapper: createWrapper(dataProvider),
    })

    const [updateMany] = result.current
    let response: unknown

    await act(async () => {
      response = await updateMany('posts', { ids: [1, 2, 3], data: { status: 'archived' } })
    })

    expect(response).toEqual({ data: [1, 2, 3] })
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to update')
    dataProvider.updateMany = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(() => useUpdateMany(), {
      wrapper: createWrapper(dataProvider),
    })

    const [updateMany] = result.current

    await act(async () => {
      try {
        await updateMany('posts', { ids: [1, 2], data: { status: 'x' } })
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
    const { result } = renderHook(() => useUpdateMany(), {
      wrapper: createWrapper(dataProvider),
    })

    const [updateMany] = result.current

    await act(async () => {
      await updateMany('posts', { ids: [1], data: { x: 1 }, meta: { audit: true } })
    })

    expect(dataProvider.updateMany).toHaveBeenCalledWith('posts', {
      ids: [1],
      data: { x: 1 },
      meta: { audit: true },
    })
  })
})
