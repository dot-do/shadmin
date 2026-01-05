/**
 * useGetList hook tests
 * TDD: RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useGetList } from './useGetList'
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

describe('useGetList', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn().mockResolvedValue({
        data: [
          { id: 1, title: 'Post 1' },
          { id: 2, title: 'Post 2' },
        ],
        total: 2,
      }),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should fetch list data', async () => {
    const { result } = renderHook(
      () =>
        useGetList('posts', {
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'id', order: 'DESC' },
          filter: {},
        }),
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
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' },
    ])
    expect(result.current.total).toBe(2)
    expect(result.current.error).toBeNull()
  })

  it('should call dataProvider with correct parameters', async () => {
    const { result } = renderHook(
      () =>
        useGetList('posts', {
          pagination: { page: 2, perPage: 25 },
          sort: { field: 'title', order: 'ASC' },
          filter: { published: true },
        }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getList).toHaveBeenCalledWith('posts', {
      pagination: { page: 2, perPage: 25 },
      sort: { field: 'title', order: 'ASC' },
      filter: { published: true },
    })
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to fetch')
    dataProvider.getList = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(
      () =>
        useGetList('posts', {
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'id', order: 'DESC' },
          filter: {},
        }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toEqual(error)
    expect(result.current.data).toBeUndefined()
  })

  it('should use default pagination and sort if not provided', async () => {
    const { result } = renderHook(() => useGetList('posts'), {
      wrapper: createWrapper(dataProvider),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getList).toHaveBeenCalledWith('posts', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
  })

  it('should return isFetching state for background refetches', async () => {
    const { result } = renderHook(
      () =>
        useGetList('posts', {
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'id', order: 'DESC' },
          filter: {},
        }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // isFetching should be available for background fetches
    expect(typeof result.current.isFetching).toBe('boolean')
  })

  it('should support refetch function', async () => {
    const { result } = renderHook(
      () =>
        useGetList('posts', {
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'id', order: 'DESC' },
          filter: {},
        }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.refetch).toBeDefined()
    expect(typeof result.current.refetch).toBe('function')

    // Refetch should trigger another call
    await result.current.refetch()

    expect(dataProvider.getList).toHaveBeenCalledTimes(2)
  })

  it('should include pageInfo when returned by dataProvider', async () => {
    dataProvider.getList = vi.fn().mockResolvedValue({
      data: [{ id: 1, title: 'Post 1' }],
      total: 100,
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    })

    const { result } = renderHook(
      () =>
        useGetList('posts', {
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'id', order: 'DESC' },
          filter: {},
        }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pageInfo).toEqual({
      hasNextPage: true,
      hasPreviousPage: false,
    })
  })

  it('should support meta parameter', async () => {
    const { result } = renderHook(
      () =>
        useGetList('posts', {
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'id', order: 'DESC' },
          filter: {},
          meta: { customParam: 'value' },
        }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getList).toHaveBeenCalledWith('posts', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'id', order: 'DESC' },
      filter: {},
      meta: { customParam: 'value' },
    })
  })
})
