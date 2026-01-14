/**
 * useGetMany hook tests
 * TDD: RED phase - Write failing tests first
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'


import { useGetMany } from './useGetMany'
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

describe('useGetMany', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn(),
      getMany: vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
          { id: 3, name: 'Bob' },
        ],
      }),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should fetch multiple records by ids', async () => {
    const { result } = renderHook(
      () => useGetMany('users', { ids: [1, 2, 3] }),
      { wrapper: createWrapper(dataProvider) }
    )

    // Initially loading
    expect(result.current.isLoading).toBe(true)

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Check result
    expect(result.current.data).toEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' },
    ])
    expect(result.current.error).toBeNull()
  })

  it('should call dataProvider with correct parameters', async () => {
    const { result } = renderHook(
      () => useGetMany('users', { ids: [1, 2, 3] }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getMany).toHaveBeenCalledWith('users', { ids: [1, 2, 3] })
  })

  it('should support string ids', async () => {
    const { result } = renderHook(
      () => useGetMany('users', { ids: ['a', 'b', 'c'] }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getMany).toHaveBeenCalledWith('users', { ids: ['a', 'b', 'c'] })
  })

  it('should handle empty ids array', async () => {
    dataProvider.getMany = vi.fn().mockResolvedValue({ data: [] })

    const { result } = renderHook(
      () => useGetMany('users', { ids: [] }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual([])
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to fetch records')
    dataProvider.getMany = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(
      () => useGetMany('users', { ids: [1, 2] }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toEqual(error)
    expect(result.current.data).toBeUndefined()
  })

  it('should support refetch function', async () => {
    const { result } = renderHook(
      () => useGetMany('users', { ids: [1, 2, 3] }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.refetch).toBeDefined()
    expect(typeof result.current.refetch).toBe('function')

    // Refetch should trigger another call
    await result.current.refetch()

    expect(dataProvider.getMany).toHaveBeenCalledTimes(2)
  })

  it('should return isFetching state', async () => {
    const { result } = renderHook(
      () => useGetMany('users', { ids: [1, 2, 3] }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(typeof result.current.isFetching).toBe('boolean')
  })

  it('should support meta parameter', async () => {
    const { result } = renderHook(
      () => useGetMany('users', { ids: [1, 2], meta: { include: ['posts'] } }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getMany).toHaveBeenCalledWith('users', {
      ids: [1, 2],
      meta: { include: ['posts'] },
    })
  })

  it('should not fetch when enabled is false', async () => {
    const { result } = renderHook(
      () => useGetMany('users', { ids: [1, 2] }, { enabled: false }),
      { wrapper: createWrapper(dataProvider) }
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
    expect(dataProvider.getMany).not.toHaveBeenCalled()
  })
})
