/**
 * useDelete hook tests
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'


import { useDelete } from './useDelete'
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

describe('useDelete', () => {
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
      delete: vi.fn().mockResolvedValue({
        data: { id: 123, title: 'Deleted Post' },
      }),
      deleteMany: vi.fn(),
    }
  })

  it('should return a delete function and mutation state', () => {
    const { result } = renderHook(() => useDelete(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteRecord, state] = result.current
    expect(typeof deleteRecord).toBe('function')
    expect(state.isPending).toBe(false)
  })

  it('should delete a record when called', async () => {
    const { result } = renderHook(() => useDelete(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteRecord] = result.current

    await act(async () => {
      await deleteRecord('posts', { id: 123 })
    })

    expect(dataProvider.delete).toHaveBeenCalledWith('posts', { id: 123 })
  })

  it('should return deleted record', async () => {
    const { result } = renderHook(() => useDelete(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteRecord] = result.current
    let response: unknown

    await act(async () => {
      response = await deleteRecord('posts', { id: 123 })
    })

    expect(response).toEqual({ data: { id: 123, title: 'Deleted Post' } })
  })

  it('should support previousData parameter', async () => {
    const { result } = renderHook(() => useDelete(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteRecord] = result.current

    await act(async () => {
      await deleteRecord('posts', { id: 123, previousData: { id: 123, title: 'Old' } })
    })

    expect(dataProvider.delete).toHaveBeenCalledWith('posts', {
      id: 123,
      previousData: { id: 123, title: 'Old' },
    })
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to delete')
    dataProvider.delete = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(() => useDelete(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteRecord] = result.current

    await act(async () => {
      try {
        await deleteRecord('posts', { id: 123 })
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
    const { result } = renderHook(() => useDelete(), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteRecord] = result.current

    await act(async () => {
      await deleteRecord('posts', { id: 123, meta: { softDelete: true } })
    })

    expect(dataProvider.delete).toHaveBeenCalledWith('posts', {
      id: 123,
      meta: { softDelete: true },
    })
  })

  it('should support pre-configured resource', async () => {
    const { result } = renderHook(() => useDelete('posts'), {
      wrapper: createWrapper(dataProvider),
    })

    const [deleteRecord] = result.current

    await act(async () => {
      await deleteRecord({ id: 456 })
    })

    expect(dataProvider.delete).toHaveBeenCalledWith('posts', { id: 456 })
  })
})
