/**
 * Utils tests for src/lib/utils.ts
 * Tests the cn() function which merges class names with tailwind-merge and clsx
 */

import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn (class name utility)', () => {
  describe('basic functionality', () => {
    it('should merge single class name', () => {
      expect(cn('foo')).toBe('foo')
    })

    it('should merge multiple class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should merge three or more class names', () => {
      expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz')
    })

    it('should handle empty string input', () => {
      expect(cn('')).toBe('')
    })

    it('should handle no arguments', () => {
      expect(cn()).toBe('')
    })
  })

  describe('falsy value handling', () => {
    it('should filter out undefined values', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    })

    it('should filter out null values', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar')
    })

    it('should filter out false values', () => {
      expect(cn('foo', false, 'bar')).toBe('foo bar')
    })

    it('should filter out empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar')
    })

    it('should filter out 0 values', () => {
      expect(cn('foo', 0, 'bar')).toBe('foo bar')
    })

    it('should handle all falsy values at once', () => {
      expect(cn(undefined, null, false, '', 0)).toBe('')
    })

    it('should handle mixed valid and falsy values', () => {
      expect(cn('foo', undefined, 'bar', null, 'baz', false)).toBe('foo bar baz')
    })
  })

  describe('conditional class names', () => {
    it('should handle conditional class with true condition', () => {
      const isActive = true
      expect(cn('base', isActive && 'active')).toBe('base active')
    })

    it('should handle conditional class with false condition', () => {
      const isActive = false
      expect(cn('base', isActive && 'active')).toBe('base')
    })

    it('should handle multiple conditional classes', () => {
      const isActive = true
      const isDisabled = false
      const isLarge = true
      expect(cn('base', isActive && 'active', isDisabled && 'disabled', isLarge && 'large')).toBe(
        'base active large'
      )
    })

    it('should handle ternary operator conditions', () => {
      const variant = 'primary'
      expect(cn('btn', variant === 'primary' ? 'btn-primary' : 'btn-secondary')).toBe(
        'btn btn-primary'
      )
    })
  })

  describe('object syntax (clsx feature)', () => {
    it('should handle object with true values', () => {
      expect(cn({ foo: true, bar: true })).toBe('foo bar')
    })

    it('should handle object with false values', () => {
      expect(cn({ foo: true, bar: false })).toBe('foo')
    })

    it('should handle object with mixed values', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
    })

    it('should handle empty object', () => {
      expect(cn({})).toBe('')
    })

    it('should handle object with all false values', () => {
      expect(cn({ foo: false, bar: false })).toBe('')
    })

    it('should mix objects with strings', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active')
    })

    it('should handle object with undefined values', () => {
      expect(cn({ foo: undefined, bar: true })).toBe('bar')
    })

    it('should handle object with null values', () => {
      expect(cn({ foo: null, bar: true })).toBe('bar')
    })

    it('should handle object with number values (truthy)', () => {
      expect(cn({ foo: 1, bar: 0 })).toBe('foo')
    })
  })

  describe('array syntax (clsx feature)', () => {
    it('should handle array of class names', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })

    it('should handle nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz')
    })

    it('should handle array with falsy values', () => {
      expect(cn(['foo', false, 'bar', undefined])).toBe('foo bar')
    })

    it('should handle empty array', () => {
      expect(cn([])).toBe('')
    })

    it('should mix arrays with strings', () => {
      expect(cn('base', ['variant', 'size'])).toBe('base variant size')
    })

    it('should handle array with objects', () => {
      expect(cn(['foo', { bar: true, baz: false }])).toBe('foo bar')
    })
  })

  describe('tailwind-merge functionality', () => {
    it('should merge conflicting padding classes (last wins)', () => {
      expect(cn('p-4', 'p-8')).toBe('p-8')
    })

    it('should merge conflicting margin classes', () => {
      expect(cn('m-2', 'm-4')).toBe('m-4')
    })

    it('should merge conflicting width classes', () => {
      expect(cn('w-full', 'w-1/2')).toBe('w-1/2')
    })

    it('should merge conflicting height classes', () => {
      expect(cn('h-screen', 'h-full')).toBe('h-full')
    })

    it('should merge conflicting text color classes', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('should merge conflicting background color classes', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })

    it('should merge conflicting flex direction classes', () => {
      expect(cn('flex-row', 'flex-col')).toBe('flex-col')
    })

    it('should merge conflicting justify content classes', () => {
      expect(cn('justify-start', 'justify-center')).toBe('justify-center')
    })

    it('should merge conflicting align items classes', () => {
      expect(cn('items-start', 'items-center')).toBe('items-center')
    })

    it('should preserve non-conflicting classes', () => {
      expect(cn('p-4', 'm-4', 'text-red-500')).toBe('p-4 m-4 text-red-500')
    })

    it('should merge conflicting font size classes', () => {
      expect(cn('text-sm', 'text-lg')).toBe('text-lg')
    })

    it('should merge conflicting font weight classes', () => {
      expect(cn('font-normal', 'font-bold')).toBe('font-bold')
    })

    it('should merge conflicting border radius classes', () => {
      expect(cn('rounded', 'rounded-lg')).toBe('rounded-lg')
    })

    it('should merge conflicting display classes', () => {
      expect(cn('block', 'flex')).toBe('flex')
    })

    it('should merge conflicting position classes', () => {
      expect(cn('relative', 'absolute')).toBe('absolute')
    })
  })

  describe('tailwind responsive prefixes', () => {
    it('should handle responsive prefixes correctly', () => {
      expect(cn('p-4', 'md:p-6', 'lg:p-8')).toBe('p-4 md:p-6 lg:p-8')
    })

    it('should merge conflicting responsive classes at same breakpoint', () => {
      expect(cn('md:p-4', 'md:p-8')).toBe('md:p-8')
    })

    it('should preserve classes at different breakpoints', () => {
      expect(cn('sm:text-sm', 'md:text-base', 'lg:text-lg')).toBe('sm:text-sm md:text-base lg:text-lg')
    })
  })

  describe('tailwind state prefixes', () => {
    it('should handle hover prefix correctly', () => {
      expect(cn('bg-blue-500', 'hover:bg-blue-600')).toBe('bg-blue-500 hover:bg-blue-600')
    })

    it('should merge conflicting hover classes', () => {
      expect(cn('hover:bg-blue-500', 'hover:bg-red-500')).toBe('hover:bg-red-500')
    })

    it('should handle focus prefix correctly', () => {
      expect(cn('ring-0', 'focus:ring-2')).toBe('ring-0 focus:ring-2')
    })

    it('should handle active prefix correctly', () => {
      expect(cn('scale-100', 'active:scale-95')).toBe('scale-100 active:scale-95')
    })

    it('should handle disabled prefix correctly', () => {
      expect(cn('opacity-100', 'disabled:opacity-50')).toBe('opacity-100 disabled:opacity-50')
    })

    it('should handle combined state and responsive prefixes', () => {
      expect(cn('md:hover:bg-blue-600', 'lg:hover:bg-blue-700')).toBe(
        'md:hover:bg-blue-600 lg:hover:bg-blue-700'
      )
    })
  })

  describe('tailwind dark mode', () => {
    it('should handle dark mode prefix correctly', () => {
      expect(cn('bg-white', 'dark:bg-gray-900')).toBe('bg-white dark:bg-gray-900')
    })

    it('should merge conflicting dark mode classes', () => {
      expect(cn('dark:bg-gray-800', 'dark:bg-gray-900')).toBe('dark:bg-gray-900')
    })

    it('should preserve both light and dark mode classes', () => {
      expect(cn('text-gray-900', 'dark:text-gray-100')).toBe('text-gray-900 dark:text-gray-100')
    })
  })

  describe('arbitrary values', () => {
    it('should handle arbitrary padding values', () => {
      expect(cn('p-[10px]')).toBe('p-[10px]')
    })

    it('should handle arbitrary color values', () => {
      expect(cn('bg-[#ff0000]')).toBe('bg-[#ff0000]')
    })

    it('should merge arbitrary with standard values', () => {
      expect(cn('p-4', 'p-[20px]')).toBe('p-[20px]')
    })

    it('should handle arbitrary width values', () => {
      expect(cn('w-[300px]', 'w-full')).toBe('w-full')
    })
  })

  describe('negative values', () => {
    it('should handle negative margin', () => {
      expect(cn('-m-4')).toBe('-m-4')
    })

    it('should merge conflicting negative margins', () => {
      expect(cn('-m-4', '-m-8')).toBe('-m-8')
    })

    it('should preserve negative and positive on different sides', () => {
      expect(cn('-mt-4', 'mb-4')).toBe('-mt-4 mb-4')
    })
  })

  describe('important modifier', () => {
    it('should handle important modifier', () => {
      expect(cn('!p-4')).toBe('!p-4')
    })

    it('should merge important classes', () => {
      expect(cn('!p-4', '!p-8')).toBe('!p-8')
    })
  })

  describe('complex real-world scenarios', () => {
    it('should handle button variant pattern', () => {
      const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium'
      const variantStyles = 'bg-primary text-primary-foreground hover:bg-primary/90'
      const sizeStyles = 'h-10 px-4 py-2'
      expect(cn(baseStyles, variantStyles, sizeStyles)).toBe(
        'inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
      )
    })

    it('should handle component override pattern', () => {
      // Component default styles that can be overridden
      const defaultStyles = 'p-4 m-2 bg-white text-black'
      const userOverrides = 'p-6 bg-gray-100'
      expect(cn(defaultStyles, userOverrides)).toBe('m-2 text-black p-6 bg-gray-100')
    })

    it('should handle conditional variant pattern', () => {
      const isLoading = true
      const isDisabled = false
      expect(
        cn(
          'btn',
          isLoading && 'opacity-50 cursor-wait',
          isDisabled && 'opacity-50 cursor-not-allowed',
          !isLoading && !isDisabled && 'hover:bg-blue-600'
        )
      ).toBe('btn opacity-50 cursor-wait')
    })

    it('should handle card component pattern', () => {
      expect(
        cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          'p-6',
          { 'hover:shadow-lg': true, 'cursor-pointer': false }
        )
      ).toBe('rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg')
    })

    it('should handle form input pattern', () => {
      const hasError = true
      expect(
        cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          hasError && 'border-red-500 focus-visible:ring-red-500'
        )
      ).toBe(
        'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 border-red-500 focus-visible:ring-red-500'
      )
    })

    it('should handle grid layout pattern', () => {
      expect(cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4')).toBe(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      )
    })
  })

  describe('edge cases', () => {
    it('should handle whitespace in class names', () => {
      expect(cn('  foo  ', '  bar  ')).toBe('foo bar')
    })

    it('should handle duplicate class names (non-tailwind classes are not deduplicated)', () => {
      // Note: tailwind-merge only deduplicates conflicting Tailwind classes, not arbitrary duplicates
      expect(cn('foo', 'foo', 'bar')).toBe('foo foo bar')
    })

    it('should deduplicate conflicting Tailwind classes', () => {
      // Tailwind classes are deduplicated when they conflict
      expect(cn('p-4', 'p-4', 'p-4')).toBe('p-4')
    })

    it('should handle very long class lists', () => {
      const classes = Array.from({ length: 100 }, (_, i) => `class-${i}`)
      const result = cn(...classes)
      expect(result.split(' ')).toHaveLength(100)
    })

    it('should handle special characters in arbitrary values', () => {
      expect(cn('bg-[url("/image.png")]')).toBe('bg-[url("/image.png")]')
    })

    it('should handle CSS variables', () => {
      expect(cn('bg-[var(--my-color)]')).toBe('bg-[var(--my-color)]')
    })
  })
})
