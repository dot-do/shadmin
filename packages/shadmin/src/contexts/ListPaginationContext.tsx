/**
 * ListPaginationContext - Split context for pagination state
 *
 * This context allows components that only care about pagination
 * to subscribe to pagination changes without re-rendering when
 * other list state (sort, filter, selection) changes.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'

import type { ListControllerResult } from './ListContext'

/**
 * Context value for pagination state
 */
export interface ListPaginationContextValue {
  /** Whether the data is currently loading */
  isLoading: boolean
  /** Whether a background refetch is in progress */
  isFetching: boolean
  /** Total number of records matching the filter */
  total: number | undefined
  /** Current page number (1-indexed) */
  page: number
  /** Number of records per page */
  perPage: number
  /** Callback to change the current page */
  setPage: (page: number) => void
  /** Callback to change items per page */
  setPerPage: (perPage: number) => void
  /** Resource name */
  resource: string
}

/**
 * Context to store the pagination part of the list controller result.
 *
 * Use the useListPaginationContext() hook to read the context.
 * This allows components like <Pagination> to re-render only when
 * pagination-related values change.
 */
export const ListPaginationContext = createContext<ListPaginationContextValue | undefined>(
  undefined
)

ListPaginationContext.displayName = 'ListPaginationContext'

/**
 * Props for ListPaginationContextProvider
 */
export interface ListPaginationContextProviderProps {
  value: Pick<
    ListControllerResult,
    'isLoading' | 'isFetching' | 'total' | 'page' | 'perPage' | 'setPage' | 'setPerPage' | 'resource'
  >
  children: ReactNode
}

/**
 * Pick pagination-related values from the list controller result
 * and memoize them to prevent unnecessary re-renders
 */
export function usePickPaginationContext(
  context: ListControllerResult
): ListPaginationContextValue {
  return useMemo(
    () => ({
      isLoading: context.isLoading,
      isFetching: context.isFetching,
      total: context.total,
      page: context.page,
      perPage: context.perPage,
      setPage: context.setPage,
      setPerPage: context.setPerPage,
      resource: context.resource,
    }),
    [
      context.isLoading,
      context.isFetching,
      context.total,
      context.page,
      context.perPage,
      context.setPage,
      context.setPerPage,
      context.resource,
    ]
  )
}

/**
 * Provider component for ListPaginationContext.
 *
 * @example
 * ```tsx
 * <ListPaginationContextProvider value={listControllerResult}>
 *   <Pagination />
 * </ListPaginationContextProvider>
 * ```
 */
export function ListPaginationContextProvider({
  value,
  children,
}: ListPaginationContextProviderProps) {
  const memoizedValue = useMemo<ListPaginationContextValue>(
    () => ({
      isLoading: value.isLoading,
      isFetching: value.isFetching,
      total: value.total,
      page: value.page,
      perPage: value.perPage,
      setPage: value.setPage,
      setPerPage: value.setPerPage,
      resource: value.resource,
    }),
    [
      value.isLoading,
      value.isFetching,
      value.total,
      value.page,
      value.perPage,
      value.setPage,
      value.setPerPage,
      value.resource,
    ]
  )

  return (
    <ListPaginationContext.Provider value={memoizedValue}>
      {children}
    </ListPaginationContext.Provider>
  )
}

/**
 * Hook to access the pagination context.
 * Throws an error if used outside of a ListPaginationContextProvider.
 *
 * @example
 * ```tsx
 * const { page, perPage, setPage, total } = useListPaginationContext()
 * ```
 */
export function useListPaginationContext(): ListPaginationContextValue {
  const context = useContext(ListPaginationContext)
  if (context === undefined) {
    throw new Error(
      'useListPaginationContext must be used inside a ListPaginationContextProvider'
    )
  }
  return context
}

/**
 * Hook to optionally access the pagination context (may return undefined)
 */
export function useListPaginationContextOptional(): ListPaginationContextValue | undefined {
  return useContext(ListPaginationContext)
}
