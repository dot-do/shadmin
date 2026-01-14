/**
 * ExactlyOnceContext tests for db/primitives/exactly-once-context.ts
 *
 * Tests exactly-once processing semantics including:
 * - Idempotent event processing with deduplication
 * - Atomic transactions with commit/rollback
 * - Outbox pattern for reliable downstream delivery
 * - Checkpoint coordination for recovery
 *
 * RED phase: These tests are designed to fail against the stub implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

import {
  ExactlyOnceContext,
  type CheckpointBarrier,
  type CheckpointState,
  type Transaction,
} from '../exactly-once-context'

describe('ExactlyOnceContext', () => {
  let ctx: ExactlyOnceContext
  let deliveredEvents: unknown[]
  let onDeliver: ReturnType<typeof vi.fn>

  beforeEach(() => {
    deliveredEvents = []
    onDeliver = vi.fn(async (events: unknown[]) => {
      deliveredEvents.push(...events)
    })
    ctx = new ExactlyOnceContext({ onDeliver })
  })

  describe('processOnce - exactly once execution', () => {
    it('should execute function exactly once for a given eventId', async () => {
      const fn = vi.fn().mockResolvedValue('result')

      const result = await ctx.processOnce('event-1', fn)

      expect(result).toBe('result')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should return the same result without re-executing for duplicate eventId', async () => {
      let callCount = 0
      const fn = vi.fn(async () => {
        callCount++
        return `result-${callCount}`
      })

      const result1 = await ctx.processOnce('event-1', fn)
      const result2 = await ctx.processOnce('event-1', fn)

      expect(result1).toBe('result-1')
      expect(result2).toBe('result-1') // Same result, not re-executed
      expect(fn).toHaveBeenCalledTimes(1) // Only called once
    })

    it('should execute different functions for different eventIds', async () => {
      const fn1 = vi.fn().mockResolvedValue('result-1')
      const fn2 = vi.fn().mockResolvedValue('result-2')

      const result1 = await ctx.processOnce('event-1', fn1)
      const result2 = await ctx.processOnce('event-2', fn2)

      expect(result1).toBe('result-1')
      expect(result2).toBe('result-2')
      expect(fn1).toHaveBeenCalledTimes(1)
      expect(fn2).toHaveBeenCalledTimes(1)
    })

    it('should deduplicate even after error in first attempt if already processed', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('transient error'))
        .mockResolvedValueOnce('success')

      // First call fails
      await expect(ctx.processOnce('event-1', fn)).rejects.toThrow('transient error')

      // Second call with same eventId should retry since first failed
      const result = await ctx.processOnce('event-1', fn)
      expect(result).toBe('success')
    })
  })

  describe('isProcessed - event tracking', () => {
    it('should return false for unprocessed eventId', async () => {
      const result = await ctx.isProcessed('never-seen')
      expect(result).toBe(false)
    })

    it('should return true for processed eventId', async () => {
      await ctx.processOnce('event-1', async () => 'done')

      const result = await ctx.isProcessed('event-1')
      expect(result).toBe(true)
    })

    it('should return false for eventId that failed processing', async () => {
      try {
        await ctx.processOnce('failed-event', async () => {
          throw new Error('processing failed')
        })
      } catch {
        // Expected
      }

      const result = await ctx.isProcessed('failed-event')
      expect(result).toBe(false)
    })
  })

  describe('transaction - atomic operations', () => {
    it('should commit all operations atomically on success', async () => {
      const result = await ctx.transaction(async (tx: Transaction) => {
        await tx.put('key1', 'value1')
        await tx.put('key2', 'value2')
        return 'committed'
      })

      expect(result).toBe('committed')

      // Verify values are persisted in a new transaction
      await ctx.transaction(async (tx: Transaction) => {
        expect(await tx.get('key1')).toBe('value1')
        expect(await tx.get('key2')).toBe('value2')
      })
    })

    it('should rollback all operations on error', async () => {
      // First, set an initial value
      await ctx.transaction(async (tx: Transaction) => {
        await tx.put('existing-key', 'original-value')
      })

      // Attempt a transaction that will fail
      try {
        await ctx.transaction(async (tx: Transaction) => {
          await tx.put('existing-key', 'new-value')
          await tx.put('new-key', 'should-not-persist')
          throw new Error('transaction failed')
        })
      } catch {
        // Expected
      }

      // Verify rollback: original value should be preserved
      await ctx.transaction(async (tx: Transaction) => {
        expect(await tx.get('existing-key')).toBe('original-value')
        expect(await tx.get('new-key')).toBeUndefined()
      })
    })

    it('should support get, put, and delete operations', async () => {
      await ctx.transaction(async (tx: Transaction) => {
        await tx.put('key', 'value')
        expect(await tx.get('key')).toBe('value')
        await tx.delete('key')
        expect(await tx.get('key')).toBeUndefined()
      })
    })

    it('should isolate concurrent transactions', async () => {
      // Start two transactions concurrently
      const tx1Promise = ctx.transaction(async (tx: Transaction) => {
        await tx.put('shared-key', 'tx1-value')
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 50))
        return await tx.get('shared-key')
      })

      const tx2Promise = ctx.transaction(async (tx: Transaction) => {
        await tx.put('shared-key', 'tx2-value')
        return await tx.get('shared-key')
      })

      const [tx1Result, tx2Result] = await Promise.all([tx1Promise, tx2Promise])

      // Each transaction should see its own value
      expect(tx1Result).toBe('tx1-value')
      expect(tx2Result).toBe('tx2-value')
    })

    it('should handle nested read-modify-write patterns', async () => {
      await ctx.transaction(async (tx: Transaction) => {
        await tx.put('counter', 0)
      })

      await ctx.transaction(async (tx: Transaction) => {
        const current = (await tx.get('counter')) as number
        await tx.put('counter', current + 1)
      })

      await ctx.transaction(async (tx: Transaction) => {
        expect(await tx.get('counter')).toBe(1)
      })
    })
  })

  describe('emit and flush - outbox pattern', () => {
    it('should buffer emitted events until flush', async () => {
      ctx.emit({ type: 'UserCreated', userId: '1' })
      ctx.emit({ type: 'UserCreated', userId: '2' })

      // Events not delivered yet
      expect(deliveredEvents).toHaveLength(0)

      await ctx.flush()

      expect(deliveredEvents).toHaveLength(2)
      expect(deliveredEvents[0]).toEqual({ type: 'UserCreated', userId: '1' })
      expect(deliveredEvents[1]).toEqual({ type: 'UserCreated', userId: '2' })
    })

    it('should deliver events only after transaction commit', async () => {
      await ctx.transaction(async (tx: Transaction) => {
        tx.emit({ type: 'OrderPlaced', orderId: '1' })
        await tx.put('order-1', { status: 'placed' })
      })

      await ctx.flush()

      expect(deliveredEvents).toHaveLength(1)
      expect(deliveredEvents[0]).toEqual({ type: 'OrderPlaced', orderId: '1' })
    })

    it('should NOT deliver events when transaction rolls back', async () => {
      try {
        await ctx.transaction(async (tx: Transaction) => {
          tx.emit({ type: 'OrderPlaced', orderId: '1' })
          await tx.put('order-1', { status: 'placed' })
          throw new Error('payment failed')
        })
      } catch {
        // Expected
      }

      await ctx.flush()

      expect(deliveredEvents).toHaveLength(0)
    })

    it('should clear buffer after successful flush', async () => {
      ctx.emit({ type: 'Event1' })
      await ctx.flush()

      ctx.emit({ type: 'Event2' })
      await ctx.flush()

      expect(deliveredEvents).toEqual([{ type: 'Event1' }, { type: 'Event2' }])
    })

    it('should handle flush with no events', async () => {
      await ctx.flush()
      expect(onDeliver).not.toHaveBeenCalled()
    })

    it('should preserve event order', async () => {
      for (let i = 0; i < 10; i++) {
        ctx.emit({ index: i })
      }

      await ctx.flush()

      expect(deliveredEvents).toHaveLength(10)
      for (let i = 0; i < 10; i++) {
        expect(deliveredEvents[i]).toEqual({ index: i })
      }
    })
  })

  describe('checkpoint - barrier handling', () => {
    it('should handle checkpoint barrier', async () => {
      const barrier: CheckpointBarrier = {
        id: 'barrier-1',
        timestamp: Date.now(),
        epoch: 1,
      }

      await ctx.onBarrier(barrier)

      const state = await ctx.getCheckpointState()
      expect(state.lastBarrierId).toBe('barrier-1')
      expect(state.epoch).toBe(1)
    })

    it('should flush pending events on barrier', async () => {
      ctx.emit({ type: 'BeforeBarrier' })

      const barrier: CheckpointBarrier = {
        id: 'barrier-1',
        timestamp: Date.now(),
        epoch: 1,
      }

      await ctx.onBarrier(barrier)

      // Events should be flushed as part of barrier processing
      expect(deliveredEvents).toHaveLength(1)
    })

    it('should increment epoch on each barrier', async () => {
      await ctx.onBarrier({ id: 'b1', timestamp: Date.now(), epoch: 1 })
      await ctx.onBarrier({ id: 'b2', timestamp: Date.now(), epoch: 2 })

      const state = await ctx.getCheckpointState()
      expect(state.epoch).toBe(2)
    })
  })

  describe('checkpoint - recovery', () => {
    it('should capture current state in checkpoint', async () => {
      await ctx.processOnce('event-1', async () => 'result-1')
      await ctx.transaction(async (tx: Transaction) => {
        await tx.put('key1', 'value1')
      })

      const state = await ctx.getCheckpointState()

      expect(state.processedEventIds).toContain('event-1')
      expect(state.stateSnapshot).toHaveProperty('key1', 'value1')
    })

    it('should restore from checkpoint state', async () => {
      const checkpointState: CheckpointState = {
        lastBarrierId: 'barrier-5',
        processedEventIds: ['event-1', 'event-2', 'event-3'],
        stateSnapshot: { counter: 42, name: 'test' },
        pendingEvents: [{ type: 'PendingEvent' }],
        epoch: 5,
        timestamp: Date.now(),
      }

      await ctx.restoreFromCheckpoint(checkpointState)

      // Verify restored state
      expect(await ctx.isProcessed('event-1')).toBe(true)
      expect(await ctx.isProcessed('event-2')).toBe(true)
      expect(await ctx.isProcessed('event-3')).toBe(true)
      expect(await ctx.isProcessed('event-4')).toBe(false)

      // Verify state snapshot restored
      await ctx.transaction(async (tx: Transaction) => {
        expect(await tx.get('counter')).toBe(42)
        expect(await tx.get('name')).toBe('test')
      })

      // Verify pending events restored
      await ctx.flush()
      expect(deliveredEvents).toContainEqual({ type: 'PendingEvent' })
    })

    it('should continue processing after recovery', async () => {
      const checkpointState: CheckpointState = {
        lastBarrierId: 'barrier-1',
        processedEventIds: ['event-1'],
        stateSnapshot: {},
        pendingEvents: [],
        epoch: 1,
        timestamp: Date.now(),
      }

      await ctx.restoreFromCheckpoint(checkpointState)

      // Should deduplicate already processed event
      const fn = vi.fn().mockResolvedValue('new-result')
      await ctx.processOnce('event-1', fn)
      expect(fn).not.toHaveBeenCalled()

      // Should process new events
      const result = await ctx.processOnce('event-2', async () => 'event-2-result')
      expect(result).toBe('event-2-result')
    })
  })

  describe('concurrent processOnce - race conditions', () => {
    it('should handle concurrent processOnce calls with same eventId', async () => {
      let executionCount = 0
      const slowFn = vi.fn(async () => {
        executionCount++
        await new Promise((resolve) => setTimeout(resolve, 50))
        return `execution-${executionCount}`
      })

      // Start multiple concurrent calls with the same eventId
      const promises = [
        ctx.processOnce('concurrent-event', slowFn),
        ctx.processOnce('concurrent-event', slowFn),
        ctx.processOnce('concurrent-event', slowFn),
      ]

      const results = await Promise.all(promises)

      // All should return the same result
      expect(results[0]).toBe(results[1])
      expect(results[1]).toBe(results[2])

      // Function should only be executed once
      expect(slowFn).toHaveBeenCalledTimes(1)
    })

    it('should properly serialize concurrent calls for same eventId', async () => {
      const executionOrder: string[] = []

      const fn = vi.fn(async () => {
        executionOrder.push('start')
        await new Promise((resolve) => setTimeout(resolve, 20))
        executionOrder.push('end')
        return 'result'
      })

      await Promise.all([
        ctx.processOnce('event-1', fn),
        ctx.processOnce('event-1', fn),
      ])

      // Should only see one start-end pair
      expect(executionOrder).toEqual(['start', 'end'])
    })
  })

  describe('TTL cleanup - old eventIds', () => {
    it('should allow reprocessing after TTL expires', async () => {
      // Create context with very short TTL
      const shortTtlCtx = new ExactlyOnceContext({
        eventIdTtlMs: 50, // 50ms TTL
        onDeliver,
      })

      const fn = vi.fn()
        .mockResolvedValueOnce('first')
        .mockResolvedValueOnce('second')

      // First processing
      const result1 = await shortTtlCtx.processOnce('event-1', fn)
      expect(result1).toBe('first')
      expect(fn).toHaveBeenCalledTimes(1)

      // Wait for TTL to expire
      await new Promise((resolve) => setTimeout(resolve, 100))

      // After TTL, should reprocess
      const result2 = await shortTtlCtx.processOnce('event-1', fn)
      expect(result2).toBe('second')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should not reprocess before TTL expires', async () => {
      const shortTtlCtx = new ExactlyOnceContext({
        eventIdTtlMs: 1000, // 1 second TTL
        onDeliver,
      })

      const fn = vi.fn()
        .mockResolvedValueOnce('first')
        .mockResolvedValueOnce('second')

      const result1 = await shortTtlCtx.processOnce('event-1', fn)
      expect(result1).toBe('first')

      // Try immediately (before TTL)
      const result2 = await shortTtlCtx.processOnce('event-1', fn)
      expect(result2).toBe('first') // Should return cached result
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('large transaction - stress test', () => {
    it('should handle 1000+ operations in a single transaction', async () => {
      const operationCount = 1000

      await ctx.transaction(async (tx: Transaction) => {
        for (let i = 0; i < operationCount; i++) {
          await tx.put(`key-${i}`, { index: i, data: `value-${i}` })
        }
      })

      // Verify all values persisted
      await ctx.transaction(async (tx: Transaction) => {
        for (let i = 0; i < operationCount; i++) {
          const value = await tx.get(`key-${i}`) as { index: number; data: string }
          expect(value).toEqual({ index: i, data: `value-${i}` })
        }
      })
    })

    it('should rollback large transaction atomically', async () => {
      const operationCount = 500

      try {
        await ctx.transaction(async (tx: Transaction) => {
          for (let i = 0; i < operationCount; i++) {
            await tx.put(`rollback-key-${i}`, i)
          }
          throw new Error('Force rollback')
        })
      } catch {
        // Expected
      }

      // Verify no values persisted
      await ctx.transaction(async (tx: Transaction) => {
        for (let i = 0; i < operationCount; i++) {
          expect(await tx.get(`rollback-key-${i}`)).toBeUndefined()
        }
      })
    })

    it('should handle large number of emitted events', async () => {
      const eventCount = 1000

      await ctx.transaction(async (tx: Transaction) => {
        for (let i = 0; i < eventCount; i++) {
          tx.emit({ type: 'BulkEvent', index: i })
        }
        await tx.put('bulk-complete', true)
      })

      await ctx.flush()

      expect(deliveredEvents).toHaveLength(eventCount)
      expect(deliveredEvents[0]).toEqual({ type: 'BulkEvent', index: 0 })
      expect(deliveredEvents[eventCount - 1]).toEqual({ type: 'BulkEvent', index: eventCount - 1 })
    })
  })

  describe('error handling', () => {
    it('should propagate errors from processOnce function', async () => {
      await expect(
        ctx.processOnce('error-event', async () => {
          throw new Error('Processing error')
        })
      ).rejects.toThrow('Processing error')
    })

    it('should propagate errors from transaction function', async () => {
      await expect(
        ctx.transaction(async () => {
          throw new Error('Transaction error')
        })
      ).rejects.toThrow('Transaction error')
    })

    it('should handle flush delivery failure', async () => {
      const failingDeliver = vi.fn().mockRejectedValue(new Error('Delivery failed'))
      const failCtx = new ExactlyOnceContext({ onDeliver: failingDeliver })

      failCtx.emit({ type: 'Event' })

      await expect(failCtx.flush()).rejects.toThrow('Delivery failed')
    })

    it('should preserve events on flush failure for retry', async () => {
      let attempts = 0
      const eventuallySucceedsDeliver = vi.fn(async (events: unknown[]) => {
        attempts++
        if (attempts < 3) {
          throw new Error('Transient failure')
        }
        deliveredEvents.push(...events)
      })

      const retryCtx = new ExactlyOnceContext({ onDeliver: eventuallySucceedsDeliver })
      retryCtx.emit({ type: 'RetryEvent' })

      // First two attempts fail
      await expect(retryCtx.flush()).rejects.toThrow('Transient failure')
      await expect(retryCtx.flush()).rejects.toThrow('Transient failure')

      // Third attempt succeeds
      await retryCtx.flush()
      expect(deliveredEvents).toContainEqual({ type: 'RetryEvent' })
    })
  })

  describe('edge cases', () => {
    it('should handle empty eventId', async () => {
      const result = await ctx.processOnce('', async () => 'empty-id-result')
      expect(result).toBe('empty-id-result')
    })

    it('should handle very long eventId', async () => {
      const longId = 'x'.repeat(10000)
      const result = await ctx.processOnce(longId, async () => 'long-id-result')
      expect(result).toBe('long-id-result')
      expect(await ctx.isProcessed(longId)).toBe(true)
    })

    it('should handle special characters in eventId', async () => {
      const specialIds = [
        'event/with/slashes',
        'event:with:colons',
        'event.with.dots',
        'event-with-dashes',
        'event_with_underscores',
        'event with spaces',
        'event\twith\ttabs',
        'event\nwith\nnewlines',
      ]

      for (const id of specialIds) {
        const result = await ctx.processOnce(id, async () => `result-${id}`)
        expect(result).toBe(`result-${id}`)
        expect(await ctx.isProcessed(id)).toBe(true)
      }
    })

    it('should handle undefined and null values in state', async () => {
      await ctx.transaction(async (tx: Transaction) => {
        await tx.put('undefined-value', undefined)
        await tx.put('null-value', null)
      })

      await ctx.transaction(async (tx: Transaction) => {
        expect(await tx.get('undefined-value')).toBeUndefined()
        expect(await tx.get('null-value')).toBeNull()
      })
    })

    it('should handle complex nested objects in state', async () => {
      const complexValue = {
        nested: {
          deeply: {
            value: [1, 2, { three: 3 }],
          },
        },
        array: [{ a: 1 }, { b: 2 }],
        date: new Date().toISOString(),
      }

      await ctx.transaction(async (tx: Transaction) => {
        await tx.put('complex', complexValue)
      })

      await ctx.transaction(async (tx: Transaction) => {
        expect(await tx.get('complex')).toEqual(complexValue)
      })
    })

    it('should handle emitting undefined or null events', async () => {
      ctx.emit(undefined)
      ctx.emit(null)
      ctx.emit({ type: 'ValidEvent' })

      await ctx.flush()

      // Behavior depends on implementation - either filter nullish or include them
      expect(deliveredEvents.length).toBeGreaterThanOrEqual(1)
      expect(deliveredEvents).toContainEqual({ type: 'ValidEvent' })
    })
  })
})
