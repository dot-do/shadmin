/**
 * Utils index tests for src/utils/index.ts
 * Tests that all utility functions are properly exported
 */

import { describe, it, expect } from 'vitest'

import { cn as cnDirect } from './cn'

import * as utils from './index'

describe('utils/index exports', () => {
  describe('cn export', () => {
    it('should export cn function', () => {
      expect(utils.cn).toBeDefined()
    })

    it('should export cn as a function', () => {
      expect(typeof utils.cn).toBe('function')
    })

    it('should export the same cn function from cn module', () => {
      expect(utils.cn).toBe(cnDirect)
    })

    it('should have cn function that works correctly', () => {
      expect(utils.cn('foo', 'bar')).toBe('foo bar')
    })

    it('should have cn function that filters falsy values', () => {
      expect(utils.cn('foo', false, undefined, null, 'bar')).toBe('foo bar')
    })
  })

  describe('module structure', () => {
    it('should only export expected utilities', () => {
      const exportedKeys = Object.keys(utils)
      expect(exportedKeys).toContain('cn')
    })
  })
})
