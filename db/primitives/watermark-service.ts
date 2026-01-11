/**
 * WatermarkService - Event-time tracking for streaming systems
 *
 * Watermarks track the progress of event-time in stream processing,
 * enabling correct handling of late-arriving data and triggering
 * time-based operations (windowing, timers, etc.)
 *
 * @see https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/
 */

/** Duration type for configuring bounded out-of-orderness */
export interface Duration {
  milliseconds?: number
  seconds?: number
  minutes?: number
}

/** Callback unsubscribe function */
export type Unsubscribe = () => void

/**
 * WatermarkService interface for event-time tracking
 *
 * Features:
 * - Single source watermark advancement
 * - Multi-source watermark aggregation (minimum across all sources)
 * - Idle source handling (don't let idle sources block watermark progress)
 * - Bounded out-of-orderness (allow late events within a configured window)
 * - Watermark callbacks for triggering downstream operations
 */
export interface WatermarkServiceInterface {
  /** Get the current watermark value (event-time progress) */
  current(): number

  /** Advance the watermark from an incoming event timestamp */
  advance(eventTimestamp: number): void

  /** Mark a source as idle (it won't block watermark progress) */
  markIdle(sourceId: string): void

  /** Check if a source is currently marked as idle */
  isIdle(sourceId: string): boolean

  /** Register a new source for multi-source watermark aggregation */
  register(sourceId: string): void

  /** Update a specific source's watermark */
  updateSource(sourceId: string, watermark: number): void

  /** Get the aggregated watermark (minimum across all non-idle sources) */
  aggregated(): number

  /** Configure bounded out-of-orderness for late event handling */
  withBoundedOutOfOrderness(maxLateness: Duration): this

  /** Subscribe to watermark advancement events */
  onAdvance(callback: (watermark: number) => void): Unsubscribe
}

/**
 * WatermarkService stub implementation
 *
 * This is a TDD RED phase stub - all methods throw "Not implemented"
 * The GREEN phase will provide the actual implementation
 */
export class WatermarkService implements WatermarkServiceInterface {
  current(): number {
    throw new Error('Not implemented')
  }

  advance(_eventTimestamp: number): void {
    throw new Error('Not implemented')
  }

  markIdle(_sourceId: string): void {
    throw new Error('Not implemented')
  }

  isIdle(_sourceId: string): boolean {
    throw new Error('Not implemented')
  }

  register(_sourceId: string): void {
    throw new Error('Not implemented')
  }

  updateSource(_sourceId: string, _watermark: number): void {
    throw new Error('Not implemented')
  }

  aggregated(): number {
    throw new Error('Not implemented')
  }

  withBoundedOutOfOrderness(_maxLateness: Duration): this {
    throw new Error('Not implemented')
  }

  onAdvance(_callback: (watermark: number) => void): Unsubscribe {
    throw new Error('Not implemented')
  }
}

/** Factory function to create a new WatermarkService */
export function createWatermarkService(): WatermarkService {
  return new WatermarkService()
}
