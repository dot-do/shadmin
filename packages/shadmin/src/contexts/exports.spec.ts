/**
 * Tests to verify context exports from contexts/index.ts
 */

import { describe, it, expect } from 'vitest'
import {
  ThemeContext,
  ThemeProvider,
  useTheme,
  type ThemeContextValue,
  // New split ListContext exports
  ListPaginationContext,
  ListPaginationContextProvider,
  useListPaginationContext,
  usePickPaginationContext,
  type ListPaginationContextValue,
  ListSortContext,
  ListSortContextProvider,
  useListSortContext,
  usePickSortContext,
  type ListSortContextValue,
  ListFilterContext,
  ListFilterContextProvider,
  useListFilterContext,
  usePickFilterContext,
  type ListFilterContextValue,
  ListSelectionContext,
  ListSelectionContextProvider,
  useListSelectionContext,
  usePickSelectionContext,
  type ListSelectionContextValue,
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

describe('Split ListContext exports from contexts/index.ts', () => {
  describe('ListPaginationContext', () => {
    it('should export ListPaginationContext', () => {
      expect(ListPaginationContext).toBeDefined()
    })

    it('should export ListPaginationContextProvider', () => {
      expect(ListPaginationContextProvider).toBeDefined()
    })

    it('should export useListPaginationContext as a function', () => {
      expect(typeof useListPaginationContext).toBe('function')
    })

    it('should export usePickPaginationContext as a function', () => {
      expect(typeof usePickPaginationContext).toBe('function')
    })

    it('should export ListPaginationContextValue type (compile-time check)', () => {
      const typeCheck: ListPaginationContextValue | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('ListSortContext', () => {
    it('should export ListSortContext', () => {
      expect(ListSortContext).toBeDefined()
    })

    it('should export ListSortContextProvider', () => {
      expect(ListSortContextProvider).toBeDefined()
    })

    it('should export useListSortContext as a function', () => {
      expect(typeof useListSortContext).toBe('function')
    })

    it('should export usePickSortContext as a function', () => {
      expect(typeof usePickSortContext).toBe('function')
    })

    it('should export ListSortContextValue type (compile-time check)', () => {
      const typeCheck: ListSortContextValue | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('ListFilterContext', () => {
    it('should export ListFilterContext', () => {
      expect(ListFilterContext).toBeDefined()
    })

    it('should export ListFilterContextProvider', () => {
      expect(ListFilterContextProvider).toBeDefined()
    })

    it('should export useListFilterContext as a function', () => {
      expect(typeof useListFilterContext).toBe('function')
    })

    it('should export usePickFilterContext as a function', () => {
      expect(typeof usePickFilterContext).toBe('function')
    })

    it('should export ListFilterContextValue type (compile-time check)', () => {
      const typeCheck: ListFilterContextValue | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('ListSelectionContext', () => {
    it('should export ListSelectionContext', () => {
      expect(ListSelectionContext).toBeDefined()
    })

    it('should export ListSelectionContextProvider', () => {
      expect(ListSelectionContextProvider).toBeDefined()
    })

    it('should export useListSelectionContext as a function', () => {
      expect(typeof useListSelectionContext).toBe('function')
    })

    it('should export usePickSelectionContext as a function', () => {
      expect(typeof usePickSelectionContext).toBe('function')
    })

    it('should export ListSelectionContextValue type (compile-time check)', () => {
      const typeCheck: ListSelectionContextValue | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })
})
