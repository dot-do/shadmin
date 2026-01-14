/**
 * Tests for performance profiling utilities (non-React functionality)
 *
 * Note: React component tests for useRenderMonitor and createProfiledProvider
 * are skipped due to nested pnpm workspace React deduplication issues.
 * The hook and provider are manually tested in Storybook.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  configureRenderMonitor,
  getRenderMonitorConfig,
  recordRenderTiming,
  getRenderTimings,
  clearRenderTimings,
  getRenderSummary,
} from './profiler'

// Save original NODE_ENV
const originalNodeEnv = process.env.NODE_ENV

describe('profiler utilities', () => {
  beforeEach(() => {
    // Ensure we're in development mode for tests
    process.env.NODE_ENV = 'development'
    // Reset global config
    configureRenderMonitor({
      warnThreshold: 10,
      verbose: false,
    })
    // Clear timings
    clearRenderTimings()
    // Clear console mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv
  })

  describe('configureRenderMonitor', () => {
    it('updates global configuration', () => {
      configureRenderMonitor({
        warnThreshold: 5,
        verbose: true,
      })

      const config = getRenderMonitorConfig()
      expect(config.warnThreshold).toBe(5)
      expect(config.verbose).toBe(true)
    })

    it('preserves unset values', () => {
      configureRenderMonitor({ warnThreshold: 5 })

      const config = getRenderMonitorConfig()
      expect(config.warnThreshold).toBe(5)
      expect(config.verbose).toBe(false) // Default preserved
    })

    it('allows setting onExcessiveRenders callback', () => {
      const callback = vi.fn()
      configureRenderMonitor({ onExcessiveRenders: callback })

      const config = getRenderMonitorConfig()
      expect(config.onExcessiveRenders).toBe(callback)
    })
  })

  describe('render timing recording', () => {
    it('records render timings', () => {
      recordRenderTiming('TestComponent', 'mount', 5.5, 10.0, 0, 5)
      recordRenderTiming('TestComponent', 'update', 2.3, 10.0, 10, 15)

      const timings = getRenderTimings()
      expect(timings).toHaveLength(2)
      expect(timings[0]).toEqual({
        name: 'TestComponent',
        phase: 'mount',
        actualDuration: 5.5,
        baseDuration: 10.0,
        startTime: 0,
        commitTime: 5,
      })
    })

    it('filters timings by component name', () => {
      recordRenderTiming('ComponentA', 'mount', 5.0, 10.0, 0, 5)
      recordRenderTiming('ComponentB', 'mount', 3.0, 6.0, 5, 10)
      recordRenderTiming('ComponentA', 'update', 2.0, 10.0, 10, 15)

      const aTimings = getRenderTimings('ComponentA')
      expect(aTimings).toHaveLength(2)
      expect(aTimings.every((t) => t.name === 'ComponentA')).toBe(true)

      const bTimings = getRenderTimings('ComponentB')
      expect(bTimings).toHaveLength(1)
      expect(bTimings[0]?.name).toBe('ComponentB')
    })

    it('clears render timings', () => {
      recordRenderTiming('Test', 'mount', 5.0, 10.0, 0, 5)
      expect(getRenderTimings()).toHaveLength(1)

      clearRenderTimings()
      expect(getRenderTimings()).toHaveLength(0)
    })

    it('limits stored timings to prevent memory leaks', () => {
      // Record 1005 timings
      for (let i = 0; i < 1005; i++) {
        recordRenderTiming(`Test${i}`, 'mount', 1.0, 2.0, i, i + 1)
      }

      // Should only keep last 1000
      expect(getRenderTimings()).toHaveLength(1000)
    })

    it('returns empty array in production mode', () => {
      // Record in dev mode first
      recordRenderTiming('Test', 'mount', 5.0, 10.0, 0, 5)
      expect(getRenderTimings()).toHaveLength(1)

      // Switch to production
      process.env.NODE_ENV = 'production'
      expect(getRenderTimings()).toEqual([])
    })

    it('does not record in production mode', () => {
      process.env.NODE_ENV = 'production'
      recordRenderTiming('Test', 'mount', 5.0, 10.0, 0, 5)

      // Switch back to dev to check
      process.env.NODE_ENV = 'development'
      expect(getRenderTimings()).toHaveLength(0)
    })
  })

  describe('getRenderSummary', () => {
    it('calculates summary statistics', () => {
      recordRenderTiming('ComponentA', 'mount', 5.0, 10.0, 0, 5)
      recordRenderTiming('ComponentA', 'update', 3.0, 10.0, 5, 10)
      recordRenderTiming('ComponentA', 'update', 4.0, 10.0, 10, 15)
      recordRenderTiming('ComponentB', 'mount', 2.0, 4.0, 0, 5)

      const summary = getRenderSummary()

      expect(summary.ComponentA).toEqual({
        count: 3,
        avgDuration: 4.0, // (5 + 3 + 4) / 3
        maxDuration: 5.0,
      })

      expect(summary.ComponentB).toEqual({
        count: 1,
        avgDuration: 2.0,
        maxDuration: 2.0,
      })
    })

    it('returns empty object in production mode', () => {
      recordRenderTiming('Test', 'mount', 5.0, 10.0, 0, 5)

      process.env.NODE_ENV = 'production'
      expect(getRenderSummary()).toEqual({})
    })

    it('handles empty timings', () => {
      const summary = getRenderSummary()
      expect(summary).toEqual({})
    })
  })

  describe('getRenderMonitorConfig', () => {
    it('returns a copy of the config', () => {
      const config1 = getRenderMonitorConfig()
      const config2 = getRenderMonitorConfig()

      // Should be equal but not the same object
      expect(config1).toEqual(config2)
      expect(config1).not.toBe(config2)
    })

    it('returns default config initially', () => {
      const config = getRenderMonitorConfig()
      expect(config.warnThreshold).toBe(10)
      expect(config.verbose).toBe(false)
    })
  })
})
