/**
 * Tests to verify ThemeContext exports from contexts/index.ts
 */

import { describe, it, expect } from 'vitest'
import {
  ThemeContext,
  ThemeProvider,
  useTheme,
  type ThemeContextValue,
} from './index'

describe('ThemeContext exports from contexts/index.ts', () => {
  it('should export ThemeContext', () => {
    expect(ThemeContext).toBeDefined()
  })

  it('should export ThemeContext with Provider property', () => {
    expect(ThemeContext).toHaveProperty('Provider')
  })

  it('should export ThemeProvider', () => {
    expect(ThemeProvider).toBeDefined()
  })

  it('should export useTheme as a function', () => {
    expect(useTheme).toBeDefined()
    expect(typeof useTheme).toBe('function')
  })

  it('should export ThemeContextValue type (compile-time check)', () => {
    // This is a compile-time check - if ThemeContextValue is not exported,
    // the import at the top of this file will fail
    const typeCheck: ThemeContextValue | undefined = undefined
    expect(typeCheck).toBeUndefined()
  })
})
