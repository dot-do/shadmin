/**
 * Type declarations for @dotdo/client
 *
 * This declares the optional @dotdo/client dependency for TypeScript.
 * The actual implementation is dynamically imported at runtime.
 */

declare module '@dotdo/client' {
  export interface DOClientOptions {
    timeout?: number | undefined
    batching?: boolean | undefined
    batchWindow?: number | undefined
    maxBatchSize?: number | undefined
    offlineQueueLimit?: number | undefined
    reconnect?: {
      maxAttempts?: number | undefined
      baseDelay?: number | undefined
      maxDelay?: number | undefined
      jitter?: number | undefined
    } | undefined
    auth?: {
      token?: string | undefined
    } | undefined
  }

  export interface DOClient {
    connectionState: 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'failed'
    queuedCallCount: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- External library (@dotdo/client) callback types are untyped
    subscribe(channel: string, callback: (data: any) => void): { unsubscribe: () => void }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- External library event handler signature is untyped
    on(event: string, callback: (...args: any[]) => void): void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- External library event handler signature is untyped
    off(event: string, callback: (...args: any[]) => void): void
    disconnect(): void
    [key: string]: unknown
  }

  export function createClient(baseUrl: string, options?: DOClientOptions): DOClient
}
