/**
 * ShadminDOProvider
 *
 * React context provider that combines shadmin context with Durable Objects
 * client from @dotdo/react. Provides real-time connection management and
 * RPC capabilities to child components.
 *
 * @module dotdo-react/provider
 *
 * @example
 * ```tsx
 * import { ShadminDOProvider } from 'shadmin/dotdo-react'
 *
 * function App() {
 *   return (
 *     <ShadminDOProvider
 *       baseUrl="https://api.your-app.do"
 *       namespace="tenant-123"
 *     >
 *       <YourApp />
 *     </ShadminDOProvider>
 *   )
 * }
 * ```
 */

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef, type ReactNode } from 'react'
import type {
  ShadminDOProviderConfig,
  ShadminDOContextValue,
  ConnectionState,
  SubscriptionHandle,
  DOClientProxy,
} from './types'

/**
 * Context for Durable Objects integration
 */
const ShadminDOContext = createContext<ShadminDOContextValue | null>(null)

/**
 * Props for ShadminDOProvider
 */
export interface ShadminDOProviderProps extends ShadminDOProviderConfig {
  /**
   * Child components
   */
  children: ReactNode

  /**
   * Fallback content to show while connecting
   */
  fallback?: ReactNode

  /**
   * Callback when connection state changes
   */
  onConnectionChange?: (state: ConnectionState) => void

  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void
}

/**
 * Internal client wrapper that provides the DO client interface
 * This abstracts the actual @dotdo/client implementation
 */
interface InternalClient {
  connectionState: ConnectionState
  queuedCallCount: number
  call: (method: string, ...args: unknown[]) => Promise<unknown>
  subscribe: <T,>(channel: string, callback: (data: T) => void) => SubscriptionHandle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (event: string, callback: (...args: any[]) => void) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off: (event: string, callback: (...args: any[]) => void) => void
  disconnect: () => void
}

/**
 * Create a mock client for SSR or when @dotdo/client is not available
 */
function createMockClient(): InternalClient {
  return {
    connectionState: 'disconnected',
    queuedCallCount: 0,
    call: async () => {
      throw new Error('DOClient not available. Ensure @dotdo/client is installed.')
    },
    subscribe: () => ({ unsubscribe: () => {} }),
    on: () => {},
    off: () => {},
    disconnect: () => {},
  }
}

/**
 * Create a real client wrapper using @dotdo/client
 * This function dynamically imports the client to support optional dependency
 */
async function createRealClient(
  baseUrl: string,
  config: ShadminDOProviderConfig['client']
): Promise<InternalClient> {
  try {
    // Dynamic import to make @dotdo/client an optional dependency
    const { createClient } = await import('@dotdo/client')

    // Build client options, only including defined values to satisfy exactOptionalPropertyTypes
    const clientOptions: Record<string, unknown> = {
      timeout: config?.timeout ?? 30000,
      batching: config?.batching ?? true,
      batchWindow: config?.batchWindow ?? 0,
      maxBatchSize: config?.maxBatchSize ?? 100,
      offlineQueueLimit: config?.offlineQueueLimit ?? 1000,
      reconnect: config?.reconnect ?? {
        maxAttempts: Infinity,
        baseDelay: 1000,
        maxDelay: 30000,
        jitter: 0.1,
      },
    }
    if (config?.auth !== undefined) {
      clientOptions.auth = config.auth
    }

    const client = createClient(baseUrl, clientOptions)

    return {
      get connectionState() {
        return client.connectionState as ConnectionState
      },
      get queuedCallCount() {
        return client.queuedCallCount
      },
      call: async (method: string, ...args: unknown[]) => {
        // Access the method via proxy and call it
        const fn = (client as Record<string, unknown>)[method]
        if (typeof fn === 'function') {
          return (fn as (...args: unknown[]) => Promise<unknown>)(...args)
        }
        throw new Error(`Method ${method} not found on client`)
      },
      subscribe: <T,>(channel: string, callback: (data: T) => void) => {
        return client.subscribe(channel, callback as (data: unknown) => void)
      },
      on: (event: string, callback: (...args: unknown[]) => void) => {
        client.on(event as 'connectionStateChange', callback as (state: ConnectionState) => void)
      },
      off: (event: string, callback: (...args: unknown[]) => void) => {
        client.off(event as 'connectionStateChange', callback as (state: ConnectionState) => void)
      },
      disconnect: () => {
        client.disconnect()
      },
    }
  } catch {
    console.warn(
      'shadmin/dotdo-react: @dotdo/client not found. Install it with: npm install @dotdo/client'
    )
    return createMockClient()
  }
}

/**
 * ShadminDOProvider component
 *
 * Provides Durable Objects integration context to child components.
 * Manages WebSocket connection, handles reconnection, and provides
 * RPC capabilities via the useDO* hooks.
 *
 * @param props - Provider configuration and children
 * @returns Provider component wrapping children
 *
 * @example Basic usage
 * ```tsx
 * <ShadminDOProvider baseUrl="https://api.your-app.do">
 *   <Admin dataProvider={...}>
 *     <Resource name="users" />
 *   </Admin>
 * </ShadminDOProvider>
 * ```
 *
 * @example With namespace and callbacks
 * ```tsx
 * <ShadminDOProvider
 *   baseUrl="https://api.your-app.do"
 *   namespace="tenant-123"
 *   onConnectionChange={(state) => console.log('Connection:', state)}
 *   onError={(error) => console.error('DO Error:', error)}
 * >
 *   <YourApp />
 * </ShadminDOProvider>
 * ```
 */
export function ShadminDOProvider({
  children,
  fallback,
  onConnectionChange,
  onError,
  baseUrl,
  namespace,
  client: clientConfig,
  resourceMapping = {},
  realtime = true,
}: ShadminDOProviderProps): React.ReactElement {
  // Client state
  const [internalClient, setInternalClient] = useState<InternalClient | null>(null)
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const [queuedCallCount, setQueuedCallCount] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Store callbacks in refs to avoid re-subscriptions
  const onConnectionChangeRef = useRef(onConnectionChange)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onConnectionChangeRef.current = onConnectionChange
    onErrorRef.current = onError
  }, [onConnectionChange, onError])

  // Construct full URL with namespace
  const fullUrl = useMemo(() => {
    if (namespace) {
      return `${baseUrl.replace(/\/$/, '')}/${namespace}`
    }
    return baseUrl
  }, [baseUrl, namespace])

  // Initialize client
  useEffect(() => {
    let mounted = true
    let client: InternalClient | null = null

    const initClient = async () => {
      try {
        client = await createRealClient(fullUrl, clientConfig)

        if (!mounted) {
          client.disconnect()
          return
        }

        // Set up event listeners
        const handleConnectionChange = (state: ConnectionState) => {
          if (mounted) {
            setConnectionState(state)
            onConnectionChangeRef.current?.(state)
          }
        }

        const handleQueueChange = (count: number) => {
          if (mounted) {
            setQueuedCallCount(count)
          }
        }

        const handleError = (error: Error) => {
          if (mounted) {
            onErrorRef.current?.(error)
          }
        }

        client.on('connectionStateChange', handleConnectionChange)
        client.on('queueChange', handleQueueChange)
        client.on('error', handleError)

        setInternalClient(client)
        setConnectionState(client.connectionState)
        setQueuedCallCount(client.queuedCallCount)
        setIsInitialized(true)
      } catch (error) {
        if (mounted) {
          console.error('Failed to initialize DO client:', error)
          setConnectionState('failed')
          onErrorRef.current?.(error instanceof Error ? error : new Error(String(error)))
          setIsInitialized(true)
        }
      }
    }

    initClient()

    return () => {
      mounted = false
      if (client) {
        client.disconnect()
      }
    }
  }, [fullUrl, clientConfig])

  // Create the client proxy that allows calling methods dynamically
  const clientProxy = useMemo<DOClientProxy>(() => {
    return new Proxy({} as DOClientProxy, {
      get(_, prop) {
        if (typeof prop !== 'string') return undefined

        return async (...args: unknown[]) => {
          if (!internalClient) {
            throw new Error('DO client not initialized')
          }
          return internalClient.call(prop, ...args)
        }
      },
    })
  }, [internalClient])

  // Resource name resolver
  const getResourceName = useCallback(
    (resource: string): string => {
      return resourceMapping[resource] ?? resource
    },
    [resourceMapping]
  )

  // Subscribe function
  const subscribe = useCallback(
    <T = unknown>(channel: string, callback: (data: T) => void): SubscriptionHandle => {
      if (!internalClient || !realtime) {
        return { unsubscribe: () => {} }
      }
      return internalClient.subscribe(channel, callback)
    },
    [internalClient, realtime]
  )

  // Disconnect function
  const disconnect = useCallback(() => {
    if (internalClient) {
      internalClient.disconnect()
    }
  }, [internalClient])

  // Build context value
  const contextValue = useMemo<ShadminDOContextValue>(
    () => ({
      client: clientProxy,
      connectionState,
      queuedCallCount,
      config: {
        baseUrl,
        namespace,
        client: clientConfig,
        resourceMapping,
        realtime,
      },
      getResourceName,
      subscribe,
      disconnect,
    }),
    [
      clientProxy,
      connectionState,
      queuedCallCount,
      baseUrl,
      namespace,
      clientConfig,
      resourceMapping,
      realtime,
      getResourceName,
      subscribe,
      disconnect,
    ]
  )

  // Show fallback while initializing
  if (!isInitialized && fallback) {
    return <>{fallback}</>
  }

  return <ShadminDOContext.Provider value={contextValue}>{children}</ShadminDOContext.Provider>
}

/**
 * Hook to access the Durable Objects context
 *
 * @returns The DO context value
 * @throws Error if used outside of ShadminDOProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, connectionState } = useShadminDO()
 *
 *   const handleClick = async () => {
 *     const result = await client.myMethod('arg1', 'arg2')
 *     console.log(result)
 *   }
 *
 *   return (
 *     <div>
 *       <p>Connection: {connectionState}</p>
 *       <button onClick={handleClick}>Call DO</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useShadminDO(): ShadminDOContextValue {
  const context = useContext(ShadminDOContext)

  if (!context) {
    throw new Error('useShadminDO must be used within a ShadminDOProvider')
  }

  return context
}

/**
 * Hook to access the DO context optionally (returns null if not in provider)
 *
 * @returns The DO context value or null
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const doContext = useShadminDOOptional()
 *
 *   if (!doContext) {
 *     return <p>Not connected to Durable Objects</p>
 *   }
 *
 *   return <p>Connected: {doContext.connectionState}</p>
 * }
 * ```
 */
export function useShadminDOOptional(): ShadminDOContextValue | null {
  return useContext(ShadminDOContext)
}

/**
 * Hook to get the current connection state
 *
 * @returns The current connection state
 *
 * @example
 * ```tsx
 * function ConnectionIndicator() {
 *   const state = useDOConnectionState()
 *
 *   return (
 *     <span className={state === 'connected' ? 'text-green' : 'text-red'}>
 *       {state}
 *     </span>
 *   )
 * }
 * ```
 */
export function useDOConnectionState(): ConnectionState {
  const context = useShadminDOOptional()
  return context?.connectionState ?? 'disconnected'
}

/**
 * Hook to get the number of queued RPC calls
 *
 * @returns The number of queued calls
 *
 * @example
 * ```tsx
 * function QueueIndicator() {
 *   const count = useDOQueueCount()
 *
 *   if (count === 0) return null
 *
 *   return <span>Pending: {count}</span>
 * }
 * ```
 */
export function useDOQueueCount(): number {
  const context = useShadminDOOptional()
  return context?.queuedCallCount ?? 0
}
