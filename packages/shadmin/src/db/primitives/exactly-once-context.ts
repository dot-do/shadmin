/**
 * ExactlyOnceContext - Transactional processing with exactly-once semantics
 *
 * Provides idempotent event processing, atomic transactions, and the outbox pattern
 * for reliable downstream delivery. Supports checkpoint coordination for recovery.
 */

/**
 * Checkpoint barrier for coordinating distributed checkpoints
 */
export interface CheckpointBarrier {
  id: string
  timestamp: number
  epoch: number
}

/**
 * Checkpoint state for recovery
 */
export interface CheckpointState {
  lastBarrierId: string
  processedEventIds: string[]
  stateSnapshot: Record<string, unknown>
  pendingEvents: unknown[]
  epoch: number
  timestamp: number
}

/**
 * Transaction interface for atomic operations
 */
export interface Transaction {
  get(key: string): Promise<unknown>
  put(key: string, value: unknown): Promise<void>
  delete(key: string): Promise<void>
  emit(event: unknown): void
}

/**
 * Options for creating an ExactlyOnceContext
 */
export interface ExactlyOnceContextOptions {
  /**
   * TTL in milliseconds for processed event IDs (for dedup cleanup)
   * Default: 24 hours
   */
  eventIdTtlMs?: number

  /**
   * Maximum number of events to buffer before requiring flush
   * Default: 1000
   */
  maxBufferedEvents?: number

  /**
   * Callback for delivering events to downstream systems
   */
  onDeliver?: (events: unknown[]) => Promise<void>
}

/**
 * ExactlyOnceContext interface for transactional processing
 */
export interface IExactlyOnceContext {
  /**
   * Process an event exactly once using eventId for deduplication
   * If the eventId was already processed, returns the cached result
   */
  processOnce<T>(eventId: string, fn: () => Promise<T>): Promise<T>

  /**
   * Check if an event has already been processed
   */
  isProcessed(eventId: string): Promise<boolean>

  /**
   * Execute an atomic transaction
   * All operations commit together or roll back on error
   */
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>

  /**
   * Buffer an event for downstream delivery
   * Events are only delivered after successful commit
   */
  emit(event: unknown): void

  /**
   * Deliver all buffered events to downstream systems
   */
  flush(): Promise<void>

  /**
   * Handle a checkpoint barrier for distributed coordination
   */
  onBarrier(barrier: CheckpointBarrier): Promise<void>

  /**
   * Get the current checkpoint state for persistence
   */
  getCheckpointState(): Promise<CheckpointState>

  /**
   * Restore context from a checkpoint state
   */
  restoreFromCheckpoint(state: CheckpointState): Promise<void>
}

/**
 * ExactlyOnceContext implementation
 *
 * Stub implementation - all methods throw "Not implemented"
 */
export class ExactlyOnceContext implements IExactlyOnceContext {
  constructor(_options?: ExactlyOnceContextOptions) {
    // Stub constructor
  }

  processOnce<T>(_eventId: string, _fn: () => Promise<T>): Promise<T> {
    throw new Error('Not implemented')
  }

  isProcessed(_eventId: string): Promise<boolean> {
    throw new Error('Not implemented')
  }

  transaction<T>(_fn: (tx: Transaction) => Promise<T>): Promise<T> {
    throw new Error('Not implemented')
  }

  emit(_event: unknown): void {
    throw new Error('Not implemented')
  }

  flush(): Promise<void> {
    throw new Error('Not implemented')
  }

  onBarrier(_barrier: CheckpointBarrier): Promise<void> {
    throw new Error('Not implemented')
  }

  getCheckpointState(): Promise<CheckpointState> {
    throw new Error('Not implemented')
  }

  restoreFromCheckpoint(_state: CheckpointState): Promise<void> {
    throw new Error('Not implemented')
  }
}
