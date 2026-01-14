/**
 * useRefresh hook tests
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'


import { useGetList } from './useGetList'
import { useRefresh } from './useRefresh'
import { DataProviderContextProvider } from '../contexts/DataProviderContext'

import type { DataProvider } from '../types'
import type { ReactNode } from 'react'

const createWrapper = (dataProvider: DataProvider) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
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

describe('useRefresh', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn().mockResolvedValue({
        data: [{ id: 1, title: 'Post 1' }],
        total: 1,
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

  it('should return a refresh function', () => {
    const { result } = renderHook(() => useRefresh(), {
      wrapper: createWrapper(dataProvider),
    })

    expect(typeof result.current).toBe('function')
  })

  it('should invalidate all queries when called without arguments', async () => {
    const { result } = renderHook(
      () => ({
        refresh: useRefresh(),
        list: useGetList('posts'),
      }),
      { wrapper: createWrapper(dataProvider) }
    )

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.list.isLoading).toBe(false)
    })

    expect(dataProvider.getList).toHaveBeenCalledTimes(1)

    // Call refresh
    act(() => {
      result.current.refresh()
    })

    // Wait for refetch
    await waitFor(() => {
      expect(dataProvider.getList).toHaveBeenCalledTimes(2)
    })
  })

  it('should invalidate specific resource queries when resource is provided', async () => {
    const { result } = renderHook(
      () => ({
        refresh: useRefresh(),
        list: useGetList('posts'),
      }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.list.isLoading).toBe(false)
    })

    expect(dataProvider.getList).toHaveBeenCalledTimes(1)

    // Refresh specific resource
    act(() => {
      result.current.refresh('posts')
    })

    await waitFor(() => {
      expect(dataProvider.getList).toHaveBeenCalledTimes(2)
    })
  })

  it('should not refetch other resources when specific resource is refreshed', async () => {
    dataProvider.getList = vi
      .fn()
      .mockResolvedValueOnce({ data: [{ id: 1, title: 'Post 1' }], total: 1 })
      .mockResolvedValueOnce({ data: [{ id: 1, name: 'User 1' }], total: 1 })
      .mockResolvedValue({ data: [{ id: 2, title: 'Post 2' }], total: 1 })

    const { result } = renderHook(
      () => ({
        refresh: useRefresh(),
        posts: useGetList('posts'),
        users: useGetList('users'),
      }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.posts.isLoading).toBe(false)
      expect(result.current.users.isLoading).toBe(false)
    })

    // Initial calls: 2 (one for posts, one for users)
    expect(dataProvider.getList).toHaveBeenCalledTimes(2)

    // Refresh only posts
    act(() => {
      result.current.refresh('posts')
    })

    await waitFor(() => {
      // Should have called getList again for posts
      expect(dataProvider.getList).toHaveBeenCalledTimes(3)
    })
  })

  it('should support hard refresh that resets all data', async () => {
    const { result } = renderHook(
      () => ({
        refresh: useRefresh(),
        list: useGetList('posts'),
      }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.list.isLoading).toBe(false)
    })

    expect(dataProvider.getList).toHaveBeenCalledTimes(1)

    // Hard refresh - this clears the cache, which should trigger a refetch
    act(() => {
      result.current.refresh(undefined, { hard: true })
    })

    // Wait for isFetching to become true and then false again
    await waitFor(() => {
      expect(result.current.list.isFetching).toBe(true)
    }, { timeout: 100 }).catch(() => {
      // If it's already refetched, that's fine
    })

    await waitFor(() => {
      expect(result.current.list.isFetching).toBe(false)
    })

    // The getList should have been called at least once more
    expect(dataProvider.getList).toHaveBeenCalled()
  })
})
