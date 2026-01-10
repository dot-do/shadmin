/**
 * useListParams hook tests
 * TDD: RED phase - Write failing tests first
 *
 * Issue: shadmin-1cve
 *
 * This hook manages list parameters (pagination, sorting, filtering) with URL synchronization.
 * The hook should:
 * - Read initial state from URL query params
 * - Update URL when state changes
 * - Handle special characters in filter values
 * - Use sensible defaults when URL params are missing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useListParams } from './useListParams'
import { TestMemoryRouter } from '../test-utils/TestMemoryRouter'

// Test wrapper with router
const createWrapper = (initialEntries: string[] = ['/posts']) => {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <TestMemoryRouter initialEntries={initialEntries}>
        {children}
      </TestMemoryRouter>
    )
  }
}

describe('useListParams', () => {
  describe('Initial State from URL', () => {
    it('should read page from URL query params', () => {
      const wrapper = createWrapper(['/posts?page=3'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.page).toBe(3)
    })

    it('should read perPage from URL query params', () => {
      const wrapper = createWrapper(['/posts?perPage=25'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.perPage).toBe(25)
    })

    it('should read sort field from URL query params', () => {
      const wrapper = createWrapper(['/posts?sort=title'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.sort.field).toBe('title')
    })

    it('should read sort order from URL query params', () => {
      const wrapper = createWrapper(['/posts?sort=title&order=DESC'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.sort.order).toBe('DESC')
    })

    it('should read filter from URL query params as JSON', () => {
      const filter = { search: 'test', status: 'active' }
      const wrapper = createWrapper([`/posts?filter=${encodeURIComponent(JSON.stringify(filter))}`])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.filterValues).toEqual(filter)
    })

    it('should read multiple params from URL', () => {
      const filter = { search: 'hello' }
      const url = `/posts?page=2&perPage=50&sort=createdAt&order=DESC&filter=${encodeURIComponent(JSON.stringify(filter))}`
      const wrapper = createWrapper([url])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.page).toBe(2)
      expect(result.current.perPage).toBe(50)
      expect(result.current.sort).toEqual({ field: 'createdAt', order: 'DESC' })
      expect(result.current.filterValues).toEqual(filter)
    })
  })

  describe('Default Values', () => {
    it('should use default page of 1 when not in URL', () => {
      const wrapper = createWrapper(['/posts'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.page).toBe(1)
    })

    it('should use default perPage of 10 when not in URL', () => {
      const wrapper = createWrapper(['/posts'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.perPage).toBe(10)
    })

    it('should use default sort (id ASC) when not in URL', () => {
      const wrapper = createWrapper(['/posts'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.sort).toEqual({ field: 'id', order: 'ASC' })
    })

    it('should use empty filter when not in URL', () => {
      const wrapper = createWrapper(['/posts'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.filterValues).toEqual({})
    })

    it('should use custom default perPage when provided', () => {
      const wrapper = createWrapper(['/posts'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts', perPage: 25 }),
        { wrapper }
      )

      expect(result.current.perPage).toBe(25)
    })

    it('should use custom default sort when provided', () => {
      const wrapper = createWrapper(['/posts'])

      const { result } = renderHook(
        () => useListParams({
          resource: 'posts',
          sort: { field: 'createdAt', order: 'DESC' }
        }),
        { wrapper }
      )

      expect(result.current.sort).toEqual({ field: 'createdAt', order: 'DESC' })
    })

    it('should use filterDefaultValues when provided', () => {
      const wrapper = createWrapper(['/posts'])

      const { result } = renderHook(
        () => useListParams({
          resource: 'posts',
          filterDefaultValues: { status: 'active' }
        }),
        { wrapper }
      )

      expect(result.current.filterValues).toEqual({ status: 'active' })
    })

    it('should override defaults with URL params', () => {
      const wrapper = createWrapper(['/posts?perPage=50'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts', perPage: 25 }),
        { wrapper }
      )

      // URL should take precedence
      expect(result.current.perPage).toBe(50)
    })
  })

  describe('setFilters updates URL', () => {
    it('should update URL with filter param when setFilters is called', async () => {
      const wrapper = createWrapper(['/posts'])
      let currentSearch = ''

      const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
          <TestMemoryRouter
            initialEntries={['/posts']}
            onNavigate={(location) => {
              currentSearch = location.search
            }}
          >
            {children}
          </TestMemoryRouter>
        )
      }

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.setFilters({ search: 'test' })
      })

      await waitFor(() => {
        expect(currentSearch).toContain('filter=')
        expect(currentSearch).toContain('search')
      })
    })

    it('should encode filter values as JSON in URL', async () => {
      const wrapper = createWrapper(['/posts'])
      let currentSearch = ''

      const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
          <TestMemoryRouter
            initialEntries={['/posts']}
            onNavigate={(location) => {
              currentSearch = location.search
            }}
          >
            {children}
          </TestMemoryRouter>
        )
      }

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.setFilters({ status: 'active', count: 5 })
      })

      await waitFor(() => {
        const params = new URLSearchParams(currentSearch)
        const filterParam = params.get('filter')
        expect(filterParam).toBeTruthy()
        expect(JSON.parse(filterParam!)).toEqual({ status: 'active', count: 5 })
      })
    })

    it('should reset page to 1 when filters change', async () => {
      const wrapper = createWrapper(['/posts?page=5'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.page).toBe(5)

      act(() => {
        result.current.setFilters({ search: 'new search' })
      })

      await waitFor(() => {
        expect(result.current.page).toBe(1)
      })
    })
  })

  describe('setSort updates URL', () => {
    it('should update URL with sort param when setSort is called', async () => {
      let currentSearch = ''

      const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
          <TestMemoryRouter
            initialEntries={['/posts']}
            onNavigate={(location) => {
              currentSearch = location.search
            }}
          >
            {children}
          </TestMemoryRouter>
        )
      }

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.setSort({ field: 'title', order: 'ASC' })
      })

      await waitFor(() => {
        expect(currentSearch).toContain('sort=title')
        expect(currentSearch).toContain('order=ASC')
      })
    })

    it('should update URL with DESC order', async () => {
      let currentSearch = ''

      const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
          <TestMemoryRouter
            initialEntries={['/posts']}
            onNavigate={(location) => {
              currentSearch = location.search
            }}
          >
            {children}
          </TestMemoryRouter>
        )
      }

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.setSort({ field: 'createdAt', order: 'DESC' })
      })

      await waitFor(() => {
        expect(currentSearch).toContain('sort=createdAt')
        expect(currentSearch).toContain('order=DESC')
      })
    })

    it('should reset page to 1 when sort changes', async () => {
      const wrapper = createWrapper(['/posts?page=5'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.page).toBe(5)

      act(() => {
        result.current.setSort({ field: 'title', order: 'DESC' })
      })

      await waitFor(() => {
        expect(result.current.page).toBe(1)
      })
    })
  })

  describe('setPage updates URL', () => {
    it('should update URL with page param when setPage is called', async () => {
      let currentSearch = ''

      const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
          <TestMemoryRouter
            initialEntries={['/posts']}
            onNavigate={(location) => {
              currentSearch = location.search
            }}
          >
            {children}
          </TestMemoryRouter>
        )
      }

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.setPage(2)
      })

      await waitFor(() => {
        expect(currentSearch).toContain('page=2')
      })
    })

    it('should update to higher page numbers', async () => {
      let currentSearch = ''

      const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
          <TestMemoryRouter
            initialEntries={['/posts']}
            onNavigate={(location) => {
              currentSearch = location.search
            }}
          >
            {children}
          </TestMemoryRouter>
        )
      }

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.setPage(10)
      })

      await waitFor(() => {
        expect(currentSearch).toContain('page=10')
      })
    })
  })

  describe('setPerPage updates URL', () => {
    it('should update URL with perPage param when setPerPage is called', async () => {
      let currentSearch = ''

      const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
          <TestMemoryRouter
            initialEntries={['/posts']}
            onNavigate={(location) => {
              currentSearch = location.search
            }}
          >
            {children}
          </TestMemoryRouter>
        )
      }

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.setPerPage(25)
      })

      await waitFor(() => {
        expect(currentSearch).toContain('perPage=25')
      })
    })

    it('should reset page to 1 when perPage changes', async () => {
      const wrapper = createWrapper(['/posts?page=5'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.page).toBe(5)

      act(() => {
        result.current.setPerPage(50)
      })

      await waitFor(() => {
        expect(result.current.page).toBe(1)
      })
    })
  })

  describe('Multiple params combine correctly', () => {
    it('should preserve existing params when updating one param', async () => {
      let currentSearch = ''

      const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
          <TestMemoryRouter
            initialEntries={['/posts?perPage=25&sort=title&order=DESC']}
            onNavigate={(location) => {
              currentSearch = location.search
            }}
          >
            {children}
          </TestMemoryRouter>
        )
      }

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.setPage(3)
      })

      await waitFor(() => {
        expect(currentSearch).toContain('page=3')
        expect(currentSearch).toContain('perPage=25')
        expect(currentSearch).toContain('sort=title')
        expect(currentSearch).toContain('order=DESC')
      })
    })

    it('should handle setting multiple params in sequence', async () => {
      let currentSearch = ''

      const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
          <TestMemoryRouter
            initialEntries={['/posts']}
            onNavigate={(location) => {
              currentSearch = location.search
            }}
          >
            {children}
          </TestMemoryRouter>
        )
      }

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.setPerPage(25)
      })

      act(() => {
        result.current.setSort({ field: 'name', order: 'ASC' })
      })

      act(() => {
        result.current.setFilters({ search: 'test' })
      })

      await waitFor(() => {
        expect(currentSearch).toContain('perPage=25')
        expect(currentSearch).toContain('sort=name')
        expect(currentSearch).toContain('order=ASC')
        expect(currentSearch).toContain('filter=')
      })
    })
  })

  describe('URL decode handles special characters', () => {
    it('should handle filter values with special characters', () => {
      const filter = { search: 'hello & world', name: 'O\'Brien' }
      const wrapper = createWrapper([`/posts?filter=${encodeURIComponent(JSON.stringify(filter))}`])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.filterValues).toEqual(filter)
    })

    it('should handle filter values with unicode characters', () => {
      const filter = { search: 'cafe' }
      const wrapper = createWrapper([`/posts?filter=${encodeURIComponent(JSON.stringify(filter))}`])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.filterValues).toEqual(filter)
    })

    it('should handle filter values with quotes', () => {
      const filter = { search: 'test "quoted" value' }
      const wrapper = createWrapper([`/posts?filter=${encodeURIComponent(JSON.stringify(filter))}`])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.filterValues).toEqual(filter)
    })

    it('should handle sort field with special characters', () => {
      const wrapper = createWrapper(['/posts?sort=first_name'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.sort.field).toBe('first_name')
    })

    it('should handle malformed JSON in filter gracefully', () => {
      const wrapper = createWrapper(['/posts?filter=not-valid-json'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      // Should fallback to empty object
      expect(result.current.filterValues).toEqual({})
    })

    it('should handle empty filter param gracefully', () => {
      const wrapper = createWrapper(['/posts?filter='])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.filterValues).toEqual({})
    })
  })

  describe('disableSyncWithLocation option', () => {
    it('should ignore URL params when disableSyncWithLocation is true', () => {
      const wrapper = createWrapper(['/posts?page=5&perPage=50'])

      const { result } = renderHook(
        () => useListParams({
          resource: 'posts',
          disableSyncWithLocation: true
        }),
        { wrapper }
      )

      // Should use defaults instead of URL values
      expect(result.current.page).toBe(1)
      expect(result.current.perPage).toBe(10)
    })

    it('should not update URL when disableSyncWithLocation is true', async () => {
      let navigateCalled = false

      const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
          <TestMemoryRouter
            initialEntries={['/posts']}
            onNavigate={() => {
              navigateCalled = true
            }}
          >
            {children}
          </TestMemoryRouter>
        )
      }

      const { result } = renderHook(
        () => useListParams({
          resource: 'posts',
          disableSyncWithLocation: true
        }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.setPage(5)
      })

      // Wait a bit to ensure no navigation happens
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(navigateCalled).toBe(false)
    })
  })

  describe('Storekey for multiple lists', () => {
    it('should use resource as storeKey by default', () => {
      const wrapper = createWrapper(['/app?posts.page=3&comments.page=5'])

      const { result: postsResult } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      const { result: commentsResult } = renderHook(
        () => useListParams({ resource: 'comments' }),
        { wrapper }
      )

      // Each should read its own params
      expect(postsResult.current.page).toBe(3)
      expect(commentsResult.current.page).toBe(5)
    })

    it('should use custom storeKey when provided', () => {
      const wrapper = createWrapper(['/app?myList.page=7'])

      const { result } = renderHook(
        () => useListParams({
          resource: 'posts',
          storeKey: 'myList'
        }),
        { wrapper }
      )

      expect(result.current.page).toBe(7)
    })
  })

  describe('Edge cases', () => {
    it('should handle page=0 in URL by defaulting to 1', () => {
      const wrapper = createWrapper(['/posts?page=0'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.page).toBe(1)
    })

    it('should handle negative page in URL by defaulting to 1', () => {
      const wrapper = createWrapper(['/posts?page=-1'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.page).toBe(1)
    })

    it('should handle non-numeric page in URL by defaulting to 1', () => {
      const wrapper = createWrapper(['/posts?page=abc'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.page).toBe(1)
    })

    it('should handle negative perPage in URL by using default', () => {
      const wrapper = createWrapper(['/posts?perPage=-10'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.perPage).toBe(10)
    })

    it('should handle invalid order in URL by defaulting to ASC', () => {
      const wrapper = createWrapper(['/posts?sort=title&order=INVALID'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.sort.order).toBe('ASC')
    })

    it('should handle order without sort field', () => {
      const wrapper = createWrapper(['/posts?order=DESC'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      // Should use default sort since no field specified
      expect(result.current.sort).toEqual({ field: 'id', order: 'ASC' })
    })

    it('should handle deeply nested filter values', () => {
      const filter = {
        author: { name: { contains: 'John' } },
        tags: ['react', 'typescript']
      }
      const wrapper = createWrapper([`/posts?filter=${encodeURIComponent(JSON.stringify(filter))}`])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      expect(result.current.filterValues).toEqual(filter)
    })
  })

  describe('Return value interface', () => {
    it('should return all expected properties', () => {
      const wrapper = createWrapper(['/posts'])

      const { result } = renderHook(
        () => useListParams({ resource: 'posts' }),
        { wrapper }
      )

      // State values
      expect(result.current).toHaveProperty('page')
      expect(result.current).toHaveProperty('perPage')
      expect(result.current).toHaveProperty('sort')
      expect(result.current).toHaveProperty('filterValues')

      // Setters
      expect(result.current).toHaveProperty('setPage')
      expect(result.current).toHaveProperty('setPerPage')
      expect(result.current).toHaveProperty('setSort')
      expect(result.current).toHaveProperty('setFilters')

      // Types
      expect(typeof result.current.setPage).toBe('function')
      expect(typeof result.current.setPerPage).toBe('function')
      expect(typeof result.current.setSort).toBe('function')
      expect(typeof result.current.setFilters).toBe('function')
    })
  })
})
