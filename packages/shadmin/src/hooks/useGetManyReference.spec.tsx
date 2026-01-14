/**
 * useGetManyReference hook tests
 * TDD: RED phase - Write failing tests first
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'


import { useGetManyReference } from './useGetManyReference'
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

describe('useGetManyReference', () => {
  let dataProvider: DataProvider

  beforeEach(() => {
    dataProvider = {
      getList: vi.fn(),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn().mockResolvedValue({
        data: [
          { id: 1, body: 'Great post!', postId: 123 },
          { id: 2, body: 'Thanks for sharing', postId: 123 },
        ],
        total: 2,
      }),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }
  })

  it('should fetch related records', async () => {
    const { result } = renderHook(
      () =>
        useGetManyReference('comments', {
          target: 'postId',
          id: 123,
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'id', order: 'ASC' },
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
      { id: 1, body: 'Great post!', postId: 123 },
      { id: 2, body: 'Thanks for sharing', postId: 123 },
    ])
    expect(result.current.total).toBe(2)
    expect(result.current.error).toBeNull()
  })

  it('should call dataProvider with correct parameters', async () => {
    const { result } = renderHook(
      () =>
        useGetManyReference('comments', {
          target: 'postId',
          id: 456,
          pagination: { page: 2, perPage: 25 },
          sort: { field: 'createdAt', order: 'DESC' },
          filter: { approved: true },
        }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getManyReference).toHaveBeenCalledWith('comments', {
      target: 'postId',
      id: 456,
      pagination: { page: 2, perPage: 25 },
      sort: { field: 'createdAt', order: 'DESC' },
      filter: { approved: true },
    })
  })

  it('should use default pagination and sort if not provided', async () => {
    const { result } = renderHook(
      () =>
        useGetManyReference('comments', {
          target: 'postId',
          id: 123,
        }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getManyReference).toHaveBeenCalledWith('comments', {
      target: 'postId',
      id: 123,
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to fetch related records')
    dataProvider.getManyReference = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(
      () =>
        useGetManyReference('comments', {
          target: 'postId',
          id: 123,
        }),
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
      () =>
        useGetManyReference('comments', {
          target: 'postId',
          id: 123,
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

    expect(dataProvider.getManyReference).toHaveBeenCalledTimes(2)
  })

  it('should include pageInfo when returned by dataProvider', async () => {
    dataProvider.getManyReference = vi.fn().mockResolvedValue({
      data: [{ id: 1, body: 'Comment', postId: 123 }],
      total: 50,
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    })

    const { result } = renderHook(
      () =>
        useGetManyReference('comments', {
          target: 'postId',
          id: 123,
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
        useGetManyReference('comments', {
          target: 'postId',
          id: 123,
          meta: { includeDeleted: true },
        }),
      { wrapper: createWrapper(dataProvider) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(dataProvider.getManyReference).toHaveBeenCalledWith('comments', {
      target: 'postId',
      id: 123,
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
      meta: { includeDeleted: true },
    })
  })

  it('should not fetch when enabled is false', async () => {
    const { result } = renderHook(
      () =>
        useGetManyReference('comments', { target: 'postId', id: 123 }, { enabled: false }),
      { wrapper: createWrapper(dataProvider) }
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
    expect(dataProvider.getManyReference).not.toHaveBeenCalled()
  })
})
