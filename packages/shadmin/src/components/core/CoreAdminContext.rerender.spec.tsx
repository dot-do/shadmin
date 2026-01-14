/**
 * CoreAdminContext Re-render Optimization Tests
 *
 * These tests verify that splitting CoreAdminContext into focused sub-contexts
 * prevents unnecessary re-renders when unrelated state changes.
 */

import { render } from '@testing-library/react'
import { act , memo, useCallback, useMemo, useState } from 'react'
import { describe, it, expect } from 'vitest'

import {
  QueryClientContextProvider,
  DataProviderContextProvider,
  AuthProviderContextProvider,
  ResourceDefinitionContextProvider,
  useQueryClientInstance,
  useDataProvider,
  useAuthProviderOptional,
  useResourceDefinitions,
} from '../../contexts'
import { createMockDataProvider, createMockAuthProvider } from '../../test-utils'

describe('CoreAdminContext Re-render Optimization', () => {
  describe('Split Context Pattern', () => {
    it('should not re-render QueryClient consumer when DataProvider changes', () => {
      const queryClientRenderCount = { current: 0 }
      const dataProviderRenderCount = { current: 0 }
      let triggerUpdate: () => void = () => {}

      // Memoized consumer that only re-renders when QueryClient context changes
      const QueryClientConsumer = memo(function QueryClientConsumer() {
        queryClientRenderCount.current++
        const client = useQueryClientInstance()
        return (
          <div>
            <span data-testid="query-client">{typeof client.getQueryCache}</span>
            <span data-testid="qc-renders">{queryClientRenderCount.current}</span>
          </div>
        )
      })

      // Memoized consumer that only re-renders when DataProvider context changes
      const DataProviderConsumer = memo(function DataProviderConsumer() {
        dataProviderRenderCount.current++
        const dataProvider = useDataProvider()
        return (
          <div>
            <span data-testid="data-provider">{typeof dataProvider.getList}</span>
            <span data-testid="dp-renders">{dataProviderRenderCount.current}</span>
          </div>
        )
      })

      const TestWrapper = () => {
        const [dataProvider, setDataProvider] = useState(() => createMockDataProvider())

        // Expose the update function
        triggerUpdate = useCallback(() => {
          setDataProvider(createMockDataProvider())
        }, [])

        return (
          <QueryClientContextProvider>
            <DataProviderContextProvider dataProvider={dataProvider}>
              <QueryClientConsumer />
              <DataProviderConsumer />
            </DataProviderContextProvider>
          </QueryClientContextProvider>
        )
      }

      render(<TestWrapper />)

      // Initial render
      expect(queryClientRenderCount.current).toBe(1)
      expect(dataProviderRenderCount.current).toBe(1)

      // Change DataProvider
      act(() => {
        triggerUpdate()
      })

      // DataProvider consumer should re-render (2)
      expect(dataProviderRenderCount.current).toBe(2)
      // QueryClient consumer should NOT re-render (still 1)
      expect(queryClientRenderCount.current).toBe(1)
    })

    it('should not re-render DataProvider consumer when AuthProvider changes', () => {
      const dataProviderRenderCount = { current: 0 }
      const authProviderRenderCount = { current: 0 }
      let triggerUpdate: () => void = () => {}

      const dataProvider = createMockDataProvider()

      // Memoized consumer that only re-renders when DataProvider context changes
      const DataProviderConsumer = memo(function DataProviderConsumer() {
        dataProviderRenderCount.current++
        const dp = useDataProvider()
        return (
          <div>
            <span data-testid="data-provider">{typeof dp.getList}</span>
            <span data-testid="dp-renders">{dataProviderRenderCount.current}</span>
          </div>
        )
      })

      // Memoized consumer that only re-renders when AuthProvider context changes
      const AuthProviderConsumer = memo(function AuthProviderConsumer() {
        authProviderRenderCount.current++
        const authProvider = useAuthProviderOptional()
        return (
          <div>
            <span data-testid="auth-provider">{authProvider ? 'yes' : 'no'}</span>
            <span data-testid="ap-renders">{authProviderRenderCount.current}</span>
          </div>
        )
      })

      const TestWrapper = () => {
        const [authProvider, setAuthProvider] = useState(() => createMockAuthProvider())

        // Expose the update function
        triggerUpdate = useCallback(() => {
          setAuthProvider(createMockAuthProvider())
        }, [])

        return (
          <QueryClientContextProvider>
            <DataProviderContextProvider dataProvider={dataProvider}>
              <AuthProviderContextProvider authProvider={authProvider}>
                <DataProviderConsumer />
                <AuthProviderConsumer />
              </AuthProviderContextProvider>
            </DataProviderContextProvider>
          </QueryClientContextProvider>
        )
      }

      render(<TestWrapper />)

      // Initial render
      expect(dataProviderRenderCount.current).toBe(1)
      expect(authProviderRenderCount.current).toBe(1)

      // Change AuthProvider
      act(() => {
        triggerUpdate()
      })

      // AuthProvider consumer should re-render (2)
      expect(authProviderRenderCount.current).toBe(2)
      // DataProvider consumer should NOT re-render (still 1)
      expect(dataProviderRenderCount.current).toBe(1)
    })

    it('should not re-render ResourceDefinitions consumer when DataProvider changes', () => {
      const resourceRenderCount = { current: 0 }
      const dataProviderRenderCount = { current: 0 }
      let triggerUpdate: () => void = () => {}

      const resourceDefinitions = { users: { name: 'users' } }

      // Memoized consumer that only re-renders when ResourceDefinitions context changes
      const ResourceConsumer = memo(function ResourceConsumer() {
        resourceRenderCount.current++
        const definitions = useResourceDefinitions()
        return (
          <div>
            <span data-testid="resources">{Object.keys(definitions).length}</span>
            <span data-testid="res-renders">{resourceRenderCount.current}</span>
          </div>
        )
      })

      // Memoized consumer that only re-renders when DataProvider context changes
      const DataProviderConsumer = memo(function DataProviderConsumer() {
        dataProviderRenderCount.current++
        const dp = useDataProvider()
        return (
          <div>
            <span data-testid="data-provider">{typeof dp.getList}</span>
            <span data-testid="dp-renders">{dataProviderRenderCount.current}</span>
          </div>
        )
      })

      const TestWrapper = () => {
        const [dataProvider, setDataProvider] = useState(() => createMockDataProvider())

        // Expose the update function
        triggerUpdate = useCallback(() => {
          setDataProvider(createMockDataProvider())
        }, [])

        // Memoize the resource definitions
        const memoizedDefinitions = useMemo(() => resourceDefinitions, [])

        return (
          <QueryClientContextProvider>
            <DataProviderContextProvider dataProvider={dataProvider}>
              <ResourceDefinitionContextProvider definitions={memoizedDefinitions}>
                <ResourceConsumer />
                <DataProviderConsumer />
              </ResourceDefinitionContextProvider>
            </DataProviderContextProvider>
          </QueryClientContextProvider>
        )
      }

      render(<TestWrapper />)

      // Initial render
      expect(resourceRenderCount.current).toBe(1)
      expect(dataProviderRenderCount.current).toBe(1)

      // Change DataProvider
      act(() => {
        triggerUpdate()
      })

      // DataProvider consumer should re-render (2)
      expect(dataProviderRenderCount.current).toBe(2)
      // Resource consumer should NOT re-render (still 1)
      expect(resourceRenderCount.current).toBe(1)
    })
  })

  describe('Context Isolation', () => {
    it('QueryClient, DataProvider, and ResourceDefinitions are independent', () => {
      const renderCounts = {
        queryClient: 0,
        dataProvider: 0,
        resources: 0,
      }
      let triggerUpdate: () => void = () => {}

      const QueryClientConsumer = memo(function QueryClientConsumer() {
        renderCounts.queryClient++
        useQueryClientInstance()
        return <span data-testid="qc-renders">{renderCounts.queryClient}</span>
      })

      const DataProviderConsumer = memo(function DataProviderConsumer() {
        renderCounts.dataProvider++
        useDataProvider()
        return <span data-testid="dp-renders">{renderCounts.dataProvider}</span>
      })

      const ResourceConsumer = memo(function ResourceConsumer() {
        renderCounts.resources++
        useResourceDefinitions()
        return <span data-testid="res-renders">{renderCounts.resources}</span>
      })

      const TestWrapper = () => {
        const [, forceUpdate] = useState(0)
        const dataProvider = useMemo(() => createMockDataProvider(), [])
        const definitions = useMemo(() => ({}), [])

        // Expose the update function
        triggerUpdate = useCallback(() => {
          forceUpdate((n) => n + 1)
        }, [])

        return (
          <QueryClientContextProvider>
            <DataProviderContextProvider dataProvider={dataProvider}>
              <ResourceDefinitionContextProvider definitions={definitions}>
                <QueryClientConsumer />
                <DataProviderConsumer />
                <ResourceConsumer />
              </ResourceDefinitionContextProvider>
            </DataProviderContextProvider>
          </QueryClientContextProvider>
        )
      }

      render(<TestWrapper />)

      // Initial render
      expect(renderCounts.queryClient).toBe(1)
      expect(renderCounts.dataProvider).toBe(1)
      expect(renderCounts.resources).toBe(1)

      // Force a parent update - memoized consumers should not re-render
      act(() => {
        triggerUpdate()
      })

      // All consumers should still be at 1 (memoized)
      expect(renderCounts.queryClient).toBe(1)
      expect(renderCounts.dataProvider).toBe(1)
      expect(renderCounts.resources).toBe(1)
    })
  })
})
