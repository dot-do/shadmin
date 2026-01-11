/**
 * WatermarkService Tests - TDD RED Phase
 *
 * These tests verify the WatermarkService for event-time tracking in streaming systems.
 * All tests are expected to FAIL in the RED phase since the implementation throws "Not implemented".
 *
 * Test Categories:
 * 1. Single source watermark advancement
 * 2. Multi-source watermark aggregation (min)
 * 3. Idle source handling (don't block watermark)
 * 4. Bounded out-of-orderness behavior
 * 5. Out-of-order events don't regress watermark
 * 6. Watermark callbacks fire correctly
 * 7. Edge cases: no sources, all idle, negative timestamps
 * 8. High-frequency updates (1M+ events)
 *
 * @see dotdo-ezq9a - RED phase issue
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  WatermarkService,
  createWatermarkService,
  type Duration,
  type Unsubscribe,
} from '../watermark-service'

describe('WatermarkService', () => {
  let service: WatermarkService

  beforeEach(() => {
    service = createWatermarkService()
  })

  describe('Single Source Watermark Advancement', () => {
    it('should initialize with watermark at 0 or negative infinity', () => {
      const current = service.current()
      expect(current).toBeLessThanOrEqual(0)
    })

    it('should advance watermark when processing an event', () => {
      const eventTime = 1000
      service.advance(eventTime)
      expect(service.current()).toBe(eventTime)
    })

    it('should advance watermark to the highest seen event time', () => {
      service.advance(1000)
      service.advance(2000)
      service.advance(1500)
      expect(service.current()).toBe(2000)
    })

    it('should handle sequential event timestamps', () => {
      for (let i = 0; i < 100; i++) {
        service.advance(i * 100)
      }
      expect(service.current()).toBe(9900)
    })

    it('should handle large timestamp values', () => {
      const largeTimestamp = Date.now() + 1000000000
      service.advance(largeTimestamp)
      expect(service.current()).toBe(largeTimestamp)
    })
  })

  describe('Out-of-Order Events', () => {
    it('should not regress watermark for late events', () => {
      service.advance(5000)
      service.advance(3000) // Late event
      expect(service.current()).toBe(5000)
    })

    it('should maintain watermark through many out-of-order events', () => {
      const timestamps = [1000, 3000, 2000, 5000, 4000, 6000, 1500]
      timestamps.forEach((ts) => service.advance(ts))
      expect(service.current()).toBe(6000)
    })

    it('should handle duplicate timestamps', () => {
      service.advance(1000)
      service.advance(1000)
      service.advance(1000)
      expect(service.current()).toBe(1000)
    })
  })

  describe('Multi-Source Watermark Aggregation', () => {
    it('should register multiple sources', () => {
      service.register('source-1')
      service.register('source-2')
      service.register('source-3')
      // Should not throw
      expect(true).toBe(true)
    })

    it('should track watermarks per source', () => {
      service.register('source-1')
      service.register('source-2')
      service.updateSource('source-1', 1000)
      service.updateSource('source-2', 2000)
      // Aggregated should be min of all sources
      expect(service.aggregated()).toBe(1000)
    })

    it('should return minimum watermark across all sources', () => {
      service.register('source-1')
      service.register('source-2')
      service.register('source-3')
      service.updateSource('source-1', 5000)
      service.updateSource('source-2', 3000)
      service.updateSource('source-3', 7000)
      expect(service.aggregated()).toBe(3000)
    })

    it('should update aggregated watermark when slowest source advances', () => {
      service.register('source-1')
      service.register('source-2')
      service.updateSource('source-1', 1000)
      service.updateSource('source-2', 5000)
      expect(service.aggregated()).toBe(1000)

      service.updateSource('source-1', 4000)
      expect(service.aggregated()).toBe(4000)
    })

    it('should handle source registration after updates', () => {
      service.register('source-1')
      service.updateSource('source-1', 5000)
      service.register('source-2') // New source starts at 0 or -Infinity
      expect(service.aggregated()).toBeLessThanOrEqual(0)
    })

    it('should not regress source watermarks', () => {
      service.register('source-1')
      service.updateSource('source-1', 5000)
      service.updateSource('source-1', 3000) // Should be ignored
      expect(service.aggregated()).toBe(5000)
    })
  })

  describe('Idle Source Handling', () => {
    it('should mark a source as idle', () => {
      service.register('source-1')
      service.markIdle('source-1')
      expect(service.isIdle('source-1')).toBe(true)
    })

    it('should return false for non-idle sources', () => {
      service.register('source-1')
      expect(service.isIdle('source-1')).toBe(false)
    })

    it('should exclude idle sources from aggregation', () => {
      service.register('source-1')
      service.register('source-2')
      service.updateSource('source-1', 1000) // Slow source
      service.updateSource('source-2', 5000)

      service.markIdle('source-1') // Mark slow source as idle
      expect(service.aggregated()).toBe(5000) // Should now use source-2
    })

    it('should handle multiple idle sources', () => {
      service.register('source-1')
      service.register('source-2')
      service.register('source-3')
      service.updateSource('source-1', 1000)
      service.updateSource('source-2', 2000)
      service.updateSource('source-3', 3000)

      service.markIdle('source-1')
      service.markIdle('source-2')
      expect(service.aggregated()).toBe(3000)
    })

    it('should include source in aggregation when it becomes active again', () => {
      service.register('source-1')
      service.register('source-2')
      service.updateSource('source-1', 1000)
      service.updateSource('source-2', 5000)

      service.markIdle('source-1')
      expect(service.aggregated()).toBe(5000)

      // Source becomes active again by sending an event
      service.updateSource('source-1', 6000)
      expect(service.isIdle('source-1')).toBe(false)
      expect(service.aggregated()).toBe(5000) // Now source-2 is the minimum
    })

    it('should handle idle source that was never registered', () => {
      expect(() => service.markIdle('unknown-source')).not.toThrow()
      expect(service.isIdle('unknown-source')).toBe(false)
    })
  })

  describe('Bounded Out-of-Orderness', () => {
    it('should accept Duration configuration', () => {
      const duration: Duration = { milliseconds: 5000 }
      const result = service.withBoundedOutOfOrderness(duration)
      expect(result).toBe(service) // Should return this for chaining
    })

    it('should subtract max lateness from watermark', () => {
      service.withBoundedOutOfOrderness({ milliseconds: 1000 })
      service.advance(5000)
      // Watermark should be eventTime - maxLateness = 4000
      expect(service.current()).toBe(4000)
    })

    it('should handle seconds-based duration', () => {
      service.withBoundedOutOfOrderness({ seconds: 5 })
      service.advance(10000)
      // 5 seconds = 5000 ms, so watermark = 10000 - 5000 = 5000
      expect(service.current()).toBe(5000)
    })

    it('should handle minutes-based duration', () => {
      service.withBoundedOutOfOrderness({ minutes: 1 })
      service.advance(120000)
      // 1 minute = 60000 ms, so watermark = 120000 - 60000 = 60000
      expect(service.current()).toBe(60000)
    })

    it('should combine duration units', () => {
      service.withBoundedOutOfOrderness({
        minutes: 1,
        seconds: 30,
        milliseconds: 500,
      })
      // Total: 60000 + 30000 + 500 = 90500 ms
      service.advance(100000)
      expect(service.current()).toBe(9500) // 100000 - 90500
    })

    it('should not allow negative watermark from bounded lateness', () => {
      service.withBoundedOutOfOrderness({ seconds: 10 })
      service.advance(5000) // 5000 - 10000 = -5000
      // Watermark should be clamped to 0 or the min value
      expect(service.current()).toBeLessThanOrEqual(0)
    })

    it('should apply bounded lateness to aggregated watermark', () => {
      service.withBoundedOutOfOrderness({ milliseconds: 2000 })
      service.register('source-1')
      service.register('source-2')
      service.updateSource('source-1', 5000)
      service.updateSource('source-2', 8000)
      // Min is 5000, minus lateness 2000 = 3000
      expect(service.aggregated()).toBe(3000)
    })
  })

  describe('Watermark Callbacks', () => {
    it('should register an onAdvance callback', () => {
      const callback = vi.fn()
      const unsubscribe = service.onAdvance(callback)
      expect(typeof unsubscribe).toBe('function')
    })

    it('should fire callback when watermark advances', () => {
      const callback = vi.fn()
      service.onAdvance(callback)
      service.advance(1000)
      expect(callback).toHaveBeenCalledWith(1000)
    })

    it('should not fire callback when watermark does not advance', () => {
      const callback = vi.fn()
      service.advance(5000) // Initial advance
      service.onAdvance(callback)
      service.advance(3000) // Late event, no advancement
      expect(callback).not.toHaveBeenCalled()
    })

    it('should fire callback with correct value for each advancement', () => {
      const callback = vi.fn()
      service.onAdvance(callback)
      service.advance(1000)
      service.advance(2000)
      service.advance(3000)
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenNthCalledWith(1, 1000)
      expect(callback).toHaveBeenNthCalledWith(2, 2000)
      expect(callback).toHaveBeenNthCalledWith(3, 3000)
    })

    it('should support multiple callbacks', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()
      service.onAdvance(callback1)
      service.onAdvance(callback2)
      service.advance(1000)
      expect(callback1).toHaveBeenCalledWith(1000)
      expect(callback2).toHaveBeenCalledWith(1000)
    })

    it('should unsubscribe callback correctly', () => {
      const callback = vi.fn()
      const unsubscribe = service.onAdvance(callback)
      service.advance(1000)
      expect(callback).toHaveBeenCalledTimes(1)

      unsubscribe()
      service.advance(2000)
      expect(callback).toHaveBeenCalledTimes(1) // Still 1, not called again
    })

    it('should handle unsubscribe called multiple times', () => {
      const callback = vi.fn()
      const unsubscribe = service.onAdvance(callback)
      unsubscribe()
      expect(() => unsubscribe()).not.toThrow()
    })

    it('should fire callback for aggregated watermark advancement', () => {
      const callback = vi.fn()
      service.register('source-1')
      service.register('source-2')
      service.onAdvance(callback)

      service.updateSource('source-1', 1000)
      service.updateSource('source-2', 500)
      // Aggregated starts at min (0 or -Inf), advances to 500
      expect(callback).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    describe('No Sources', () => {
      it('should return valid watermark with no registered sources', () => {
        const current = service.current()
        expect(typeof current).toBe('number')
      })

      it('should return valid aggregated watermark with no sources', () => {
        const aggregated = service.aggregated()
        expect(typeof aggregated).toBe('number')
      })
    })

    describe('All Sources Idle', () => {
      it('should handle all sources being idle', () => {
        service.register('source-1')
        service.register('source-2')
        service.updateSource('source-1', 1000)
        service.updateSource('source-2', 2000)
        service.markIdle('source-1')
        service.markIdle('source-2')
        // When all sources are idle, should return the max known watermark
        // or positive infinity to allow processing to continue
        const aggregated = service.aggregated()
        expect(aggregated).toBeGreaterThanOrEqual(2000)
      })
    })

    describe('Negative Timestamps', () => {
      it('should handle negative event timestamps', () => {
        service.advance(-1000)
        expect(service.current()).toBe(-1000)
      })

      it('should advance from negative to positive timestamps', () => {
        service.advance(-1000)
        service.advance(1000)
        expect(service.current()).toBe(1000)
      })

      it('should not regress to more negative values', () => {
        service.advance(-500)
        service.advance(-1000)
        expect(service.current()).toBe(-500)
      })
    })

    describe('Zero Timestamp', () => {
      it('should handle zero timestamp correctly', () => {
        service.advance(0)
        expect(service.current()).toBe(0)
      })

      it('should advance from zero', () => {
        service.advance(0)
        service.advance(1000)
        expect(service.current()).toBe(1000)
      })
    })

    describe('Timestamp Boundaries', () => {
      it('should handle Number.MAX_SAFE_INTEGER', () => {
        service.advance(Number.MAX_SAFE_INTEGER)
        expect(service.current()).toBe(Number.MAX_SAFE_INTEGER)
      })

      it('should handle Number.MIN_SAFE_INTEGER', () => {
        service.advance(Number.MIN_SAFE_INTEGER)
        expect(service.current()).toBe(Number.MIN_SAFE_INTEGER)
      })
    })

    describe('Source ID Edge Cases', () => {
      it('should handle empty string source ID', () => {
        service.register('')
        service.updateSource('', 1000)
        expect(service.aggregated()).toBe(1000)
      })

      it('should handle source IDs with special characters', () => {
        service.register('source:1/test@example.com')
        service.updateSource('source:1/test@example.com', 1000)
        expect(service.aggregated()).toBe(1000)
      })

      it('should handle unicode source IDs', () => {
        service.register('source-\u{1F4A7}')
        service.updateSource('source-\u{1F4A7}', 1000)
        expect(service.aggregated()).toBe(1000)
      })
    })
  })

  describe('High-Frequency Updates (Performance)', () => {
    it('should handle 100,000 sequential events efficiently', () => {
      const start = performance.now()
      for (let i = 0; i < 100_000; i++) {
        service.advance(i)
      }
      const elapsed = performance.now() - start
      expect(service.current()).toBe(99_999)
      // Should complete in under 1 second
      expect(elapsed).toBeLessThan(1000)
    })

    it('should handle 100,000 out-of-order events efficiently', () => {
      const start = performance.now()
      // Generate shuffled timestamps
      const timestamps = Array.from({ length: 100_000 }, (_, i) => i)
      for (let i = timestamps.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[timestamps[i], timestamps[j]] = [timestamps[j], timestamps[i]]
      }

      for (const ts of timestamps) {
        service.advance(ts)
      }
      const elapsed = performance.now() - start
      expect(service.current()).toBe(99_999)
      // Should complete in under 2 seconds
      expect(elapsed).toBeLessThan(2000)
    })

    it('should handle 10,000 source updates across 100 sources', () => {
      const sourceCount = 100
      const updatesPerSource = 100

      // Register sources
      for (let i = 0; i < sourceCount; i++) {
        service.register(`source-${i}`)
      }

      const start = performance.now()
      for (let update = 0; update < updatesPerSource; update++) {
        for (let source = 0; source < sourceCount; source++) {
          service.updateSource(`source-${source}`, update * 100)
        }
      }
      const elapsed = performance.now() - start

      // All sources at same watermark, so aggregated should be max
      expect(service.aggregated()).toBe((updatesPerSource - 1) * 100)
      // Should complete in under 1 second
      expect(elapsed).toBeLessThan(1000)
    })

    it('should handle rapid callback invocations', () => {
      const callback = vi.fn()
      service.onAdvance(callback)

      const start = performance.now()
      for (let i = 0; i < 10_000; i++) {
        service.advance(i)
      }
      const elapsed = performance.now() - start

      expect(callback).toHaveBeenCalledTimes(10_000)
      // Should complete in under 1 second
      expect(elapsed).toBeLessThan(1000)
    })

    it('should handle many subscribers efficiently', () => {
      const callbacks = Array.from({ length: 100 }, () => vi.fn())
      callbacks.forEach((cb) => service.onAdvance(cb))

      const start = performance.now()
      for (let i = 0; i < 1_000; i++) {
        service.advance(i)
      }
      const elapsed = performance.now() - start

      callbacks.forEach((cb) => {
        expect(cb).toHaveBeenCalledTimes(1_000)
      })
      // Should complete in under 2 seconds
      expect(elapsed).toBeLessThan(2000)
    })
  })

  describe('Factory Function', () => {
    it('should create independent instances', () => {
      const service1 = createWatermarkService()
      const service2 = createWatermarkService()

      service1.advance(1000)
      service2.advance(5000)

      expect(service1.current()).toBe(1000)
      expect(service2.current()).toBe(5000)
    })

    it('should create instances with isolated source tracking', () => {
      const service1 = createWatermarkService()
      const service2 = createWatermarkService()

      service1.register('source-1')
      service2.register('source-2')

      service1.updateSource('source-1', 1000)
      service2.updateSource('source-2', 2000)

      expect(service1.aggregated()).toBe(1000)
      expect(service2.aggregated()).toBe(2000)
    })
  })

  describe('Method Chaining', () => {
    it('should support fluent configuration', () => {
      const result = service.withBoundedOutOfOrderness({ seconds: 5 })
      expect(result).toBe(service)
    })

    it('should allow chained withBoundedOutOfOrderness calls', () => {
      // Later call should override previous
      service
        .withBoundedOutOfOrderness({ seconds: 5 })
        .withBoundedOutOfOrderness({ seconds: 10 })

      service.advance(20000)
      // 10 seconds = 10000 ms lateness
      expect(service.current()).toBe(10000)
    })
  })
})
