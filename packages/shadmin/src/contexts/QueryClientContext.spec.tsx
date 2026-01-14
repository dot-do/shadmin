/**
 * QueryClientContext Tests
 * Verifies that QueryClient is properly separated and accessible
 */

import { QueryClient } from '@tanstack/react-query'
import { render, renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import {
  QueryClientContextProvider,
  useQueryClientInstance,
  useQueryClientInstanceOptional,
  DEFAULT_QUERY_CLIENT_OPTIONS,
} from './QueryClientContext'

describe('QueryClientContext', () => {
  describe('QueryClientContextProvider', () => {
    it('renders children', () => {
      const { container } = render(
        <QueryClientContextProvider>
          <div data-testid="child">Hello</div>
        </QueryClientContextProvider>
      )

      expect(container.querySelector('[data-testid="child"]')).not.toBeNull()
      expect(container.textContent).toContain('Hello')
    })

    it('provides a QueryClient instance', () => {
      const TestComponent = () => {
        const client = useQueryClientInstance()
        return <div data-testid="test">{typeof client.getQueryCache}</div>
      }

      const { container } = render(
        <QueryClientContextProvider>
          <TestComponent />
        </QueryClientContextProvider>
      )

      expect(container.textContent).toContain('function')
    })

    it('uses provided QueryClient when passed', () => {
      const customClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10000,
          },
        },
      })

      const TestComponent = () => {
        const client = useQueryClientInstance()
        // Check if it's the same instance by comparing cache
        const isSameClient = client === customClient
        return <div data-testid="test">{isSameClient ? 'same' : 'different'}</div>
      }

      const { container } = render(
        <QueryClientContextProvider queryClient={customClient}>
          <TestComponent />
        </QueryClientContextProvider>
      )

      expect(container.textContent).toContain('same')
    })

    it('creates a default QueryClient when not provided', () => {
      const TestComponent = () => {
        const client = useQueryClientInstance()
        // Verify it has the expected default options
        const hasCache = client.getQueryCache() !== null
        return <div data-testid="test">{hasCache ? 'has-cache' : 'no-cache'}</div>
      }

      const { container } = render(
        <QueryClientContextProvider>
          <TestComponent />
        </QueryClientContextProvider>
      )

      expect(container.textContent).toContain('has-cache')
    })
  })

  describe('useQueryClientInstance', () => {
    it('returns the QueryClient instance', () => {
      const { result } = renderHook(() => useQueryClientInstance(), {
        wrapper: ({ children }) => (
          <QueryClientContextProvider>{children}</QueryClientContextProvider>
        ),
      })

      expect(result.current).toBeInstanceOf(QueryClient)
      expect(typeof result.current.getQueryCache).toBe('function')
    })

    it('throws error when used outside provider', () => {
      expect(() => {
        renderHook(() => useQueryClientInstance())
      }).toThrow('useQueryClientInstance must be used within a QueryClientContextProvider')
    })
  })

  describe('useQueryClientInstanceOptional', () => {
    it('returns the QueryClient instance when inside provider', () => {
      const { result } = renderHook(() => useQueryClientInstanceOptional(), {
        wrapper: ({ children }) => (
          <QueryClientContextProvider>{children}</QueryClientContextProvider>
        ),
      })

      expect(result.current).toBeInstanceOf(QueryClient)
    })

    it('returns null when used outside provider', () => {
      const { result } = renderHook(() => useQueryClientInstanceOptional())

      expect(result.current).toBeNull()
    })
  })

  describe('DEFAULT_QUERY_CLIENT_OPTIONS', () => {
    it('has sensible default options', () => {
      expect(DEFAULT_QUERY_CLIENT_OPTIONS.defaultOptions.queries.staleTime).toBe(5 * 60 * 1000)
      expect(DEFAULT_QUERY_CLIENT_OPTIONS.defaultOptions.queries.retry).toBe(1)
      expect(DEFAULT_QUERY_CLIENT_OPTIONS.defaultOptions.queries.refetchOnWindowFocus).toBe(false)
    })
  })

  describe('stability', () => {
    it('maintains stable QueryClient reference across re-renders', () => {
      const clients: QueryClient[] = []

      const TestComponent = () => {
        const client = useQueryClientInstance()
        clients.push(client)
        return null
      }

      const { rerender } = render(
        <QueryClientContextProvider>
          <TestComponent />
        </QueryClientContextProvider>
      )

      // Trigger a re-render
      rerender(
        <QueryClientContextProvider>
          <TestComponent />
        </QueryClientContextProvider>
      )

      // Both renders should receive the same client instance
      expect(clients.length).toBe(2)
      expect(clients[0]).toBe(clients[1])
    })
  })
})
