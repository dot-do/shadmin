/**
 * useGetOne hook tests
 * TDD: RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useGetOne } from './useGetOne'
import { DataProviderContextProvider } from '../contexts/DataProviderContext'
import type { DataProvider } from '../types'

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

describe('useGetOne', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn().mockResolvedValue({
        data: { id: 123, title: 'Test Post', content: 'Hello World' },
      }),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should fetch a single record by id', async () => {
    const { result } = renderHook(() => useGetOne('posts', { id: 123 }), {
      wrapper: createWrapper(dataProvider),
    })

    // Initially loading
    expect(result.current.isLoading).toBe(true)

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Check result
    expect(result.current.data).toEqual({
      id: 123,
      title: 'Test Post',
      content: 'Hello World',
    })
    expect(result.current.error).toBeNull()
  })

  it('should call dataProvider with correct parameters', async () => {
    const { result } = renderHook(() => useGetOne('posts', { id: 456 }), {
      wrapper: createWrapper(dataProvider),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 456 })
  })

  it('should support numeric id', async () => {
    const { result } = renderHook(() => useGetOne('posts', { id: 999 }), {
      wrapper: createWrapper(dataProvider),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 999 })
  })

  it('should support string id', async () => {
    const { result } = renderHook(() => useGetOne('posts', { id: 'abc-123' }), {
      wrapper: createWrapper(dataProvider),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getOne).toHaveBeenCalledWith('posts', { id: 'abc-123' })
  })

  it('should handle errors', async () => {
    const error = new Error('Record not found')
    dataProvider.getOne = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(() => useGetOne('posts', { id: 123 }), {
      wrapper: createWrapper(dataProvider),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toEqual(error)
    expect(result.current.data).toBeUndefined()
  })

  it('should support refetch function', async () => {
    const { result } = renderHook(() => useGetOne('posts', { id: 123 }), {
      wrapper: createWrapper(dataProvider),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.refetch).toBeDefined()
    expect(typeof result.current.refetch).toBe('function')

    // Refetch should trigger another call
    await result.current.refetch()

    expect(dataProvider.getOne).toHaveBeenCalledTimes(2)
  })

  it('should return isFetching state', async () => {
    const { result } = renderHook(() => useGetOne('posts', { id: 123 }), {
      wrapper: createWrapper(dataProvider),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(typeof result.current.isFetching).toBe('boolean')
  })

  it('should support meta parameter', async () => {
    const { result } = renderHook(
      () => useGetOne('posts', { id: 123, meta: { include: ['comments'] } }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getOne).toHaveBeenCalledWith('posts', {
      id: 123,
      meta: { include: ['comments'] },
    })
  })

  it('should not fetch when enabled is false', async () => {
    const { result } = renderHook(
      () => useGetOne('posts', { id: 123 }, { enabled: false }),
      { wrapper: createWrapper(dataProvider) }
    )

    // Should not be loading when disabled
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()

    // Should not have called dataProvider
    expect(dataProvider.getOne).not.toHaveBeenCalled()
  })
})
