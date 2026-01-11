/**
 * cn utility tests for src/utils/cn.ts
 * Tests the lightweight cn() function that filters and joins class names
 */

import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn (lightweight class name utility)', () => {
  describe('basic functionality', () => {
    it('should join single class name', () => {
      expect(cn('foo')).toBe('foo')
    })

    it('should join multiple class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should join three or more class names', () => {
      expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz')
    })

    it('should handle no arguments', () => {
      expect(cn()).toBe('')
    })

    it('should handle empty string', () => {
      expect(cn('')).toBe('')
    })
  })

  describe('undefined handling', () => {
    it('should filter out undefined at start', () => {
      expect(cn(undefined, 'foo', 'bar')).toBe('foo bar')
    })

    it('should filter out undefined in middle', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    })

    it('should filter out undefined at end', () => {
      expect(cn('foo', 'bar', undefined)).toBe('foo bar')
    })

    it('should filter out multiple undefined values', () => {
      expect(cn(undefined, 'foo', undefined, 'bar', undefined)).toBe('foo bar')
    })

    it('should handle all undefined values', () => {
      expect(cn(undefined, undefined, undefined)).toBe('')
    })
  })

  describe('null handling', () => {
    it('should filter out null at start', () => {
      expect(cn(null, 'foo', 'bar')).toBe('foo bar')
    })

    it('should filter out null in middle', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar')
    })

    it('should filter out null at end', () => {
      expect(cn('foo', 'bar', null)).toBe('foo bar')
    })

    it('should filter out multiple null values', () => {
      expect(cn(null, 'foo', null, 'bar', null)).toBe('foo bar')
    })

    it('should handle all null values', () => {
      expect(cn(null, null, null)).toBe('')
    })
  })

  describe('false handling', () => {
    it('should filter out false at start', () => {
      expect(cn(false, 'foo', 'bar')).toBe('foo bar')
    })

    it('should filter out false in middle', () => {
      expect(cn('foo', false, 'bar')).toBe('foo bar')
    })

    it('should filter out false at end', () => {
      expect(cn('foo', 'bar', false)).toBe('foo bar')
    })

    it('should filter out multiple false values', () => {
      expect(cn(false, 'foo', false, 'bar', false)).toBe('foo bar')
    })

    it('should handle all false values', () => {
      expect(cn(false, false, false)).toBe('')
    })
  })

  describe('mixed falsy value handling', () => {
    it('should filter out all falsy values together', () => {
      expect(cn(undefined, null, false, 'foo', undefined, null, false, 'bar')).toBe('foo bar')
    })

    it('should handle only falsy values', () => {
      expect(cn(undefined, null, false)).toBe('')
    })

    it('should handle alternating falsy and truthy values', () => {
      expect(cn(undefined, 'a', null, 'b', false, 'c')).toBe('a b c')
    })

    it('should handle falsy values between valid classes', () => {
      expect(cn('first', undefined, null, false, 'last')).toBe('first last')
    })
  })

  describe('conditional class names', () => {
    it('should include class when condition is true', () => {
      const isActive = true
      expect(cn('base', isActive && 'active')).toBe('base active')
    })

    it('should exclude class when condition is false', () => {
      const isActive = false
      expect(cn('base', isActive && 'active')).toBe('base')
    })

    it('should handle multiple conditions', () => {
      const isActive = true
      const isDisabled = false
      const isLarge = true
      expect(cn('base', isActive && 'active', isDisabled && 'disabled', isLarge && 'large')).toBe(
        'base active large'
      )
    })

    it('should handle all false conditions', () => {
      const a = false
      const b = false
      const c = false
      expect(cn(a && 'a', b && 'b', c && 'c')).toBe('')
    })

    it('should handle all true conditions', () => {
      const a = true
      const b = true
      const c = true
      expect(cn(a && 'a', b && 'b', c && 'c')).toBe('a b c')
    })
  })

  describe('ternary operator usage', () => {
    it('should handle ternary for variant selection', () => {
      const variant = 'primary'
      expect(cn('btn', variant === 'primary' ? 'btn-primary' : 'btn-secondary')).toBe(
        'btn btn-primary'
      )
    })

    it('should handle ternary for secondary variant', () => {
      const variant: string = 'secondary'
      expect(cn('btn', variant === 'primary' ? 'btn-primary' : 'btn-secondary')).toBe(
        'btn btn-secondary'
      )
    })

    it('should handle nested ternary', () => {
      const size: string = 'large'
      expect(
        cn('btn', size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : 'btn-md')
      ).toBe('btn btn-lg')
    })
  })

  describe('empty string handling', () => {
    it('should filter out empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar')
    })

    it('should handle multiple empty strings', () => {
      expect(cn('', 'foo', '', '', 'bar', '')).toBe('foo bar')
    })

    it('should handle only empty strings', () => {
      expect(cn('', '', '')).toBe('')
    })
  })

  describe('whitespace handling', () => {
    it('should preserve whitespace within class names', () => {
      // Note: class names with spaces are invalid CSS, but the function doesn't validate
      expect(cn('foo bar')).toBe('foo bar')
    })

    it('should handle class names with leading/trailing spaces', () => {
      expect(cn(' foo ', ' bar ')).toBe(' foo   bar ')
    })
  })

  describe('real-world scenarios', () => {
    it('should handle button styling pattern', () => {
      const isLoading = false
      const isDisabled = false
      expect(
        cn(
          'btn',
          'btn-primary',
          isLoading && 'btn-loading',
          isDisabled && 'btn-disabled'
        )
      ).toBe('btn btn-primary')
    })

    it('should handle button with loading state', () => {
      const isLoading = true
      const isDisabled = false
      expect(
        cn(
          'btn',
          'btn-primary',
          isLoading && 'btn-loading',
          isDisabled && 'btn-disabled'
        )
      ).toBe('btn btn-primary btn-loading')
    })

    it('should handle card component pattern', () => {
      const isSelected = true
      const isHoverable = true
      expect(cn('card', isSelected && 'card-selected', isHoverable && 'card-hoverable')).toBe(
        'card card-selected card-hoverable'
      )
    })

    it('should handle navigation link pattern', () => {
      const isActive = true
      const isExternal = false
      expect(cn('nav-link', isActive && 'nav-link-active', isExternal && 'external')).toBe(
        'nav-link nav-link-active'
      )
    })

    it('should handle form input with validation', () => {
      const hasError = true
      const isTouched = true
      expect(
        cn('input', isTouched && hasError && 'input-error', isTouched && !hasError && 'input-valid')
      ).toBe('input input-error')
    })

    it('should handle responsive classes', () => {
      expect(cn('text-sm', 'md:text-base', 'lg:text-lg')).toBe('text-sm md:text-base lg:text-lg')
    })

    it('should handle tailwind utility classes', () => {
      expect(cn('flex', 'items-center', 'justify-between', 'p-4', 'bg-white')).toBe(
        'flex items-center justify-between p-4 bg-white'
      )
    })
  })

  describe('type safety', () => {
    it('should accept string as first argument', () => {
      expect(cn('foo')).toBe('foo')
    })

    it('should accept undefined as argument', () => {
      expect(cn(undefined)).toBe('')
    })

    it('should accept null as argument', () => {
      expect(cn(null)).toBe('')
    })

    it('should accept false as argument', () => {
      expect(cn(false)).toBe('')
    })

    it('should accept boolean expression result', () => {
      const condition = true
      expect(cn(condition && 'active')).toBe('active')
    })
  })

  describe('edge cases', () => {
    it('should handle very long list of classes', () => {
      const classes = Array.from({ length: 50 }, (_, i) => `class-${i}`)
      const result = cn(...classes)
      expect(result.split(' ')).toHaveLength(50)
      expect(result).toContain('class-0')
      expect(result).toContain('class-49')
    })

    it('should handle single character class names', () => {
      expect(cn('a', 'b', 'c')).toBe('a b c')
    })

    it('should handle numeric-looking class names', () => {
      expect(cn('p-4', 'm-2', 'h-10')).toBe('p-4 m-2 h-10')
    })

    it('should handle class names with special characters', () => {
      expect(cn('hover:bg-blue-500', 'focus:ring-2', 'dark:text-white')).toBe(
        'hover:bg-blue-500 focus:ring-2 dark:text-white'
      )
    })

    it('should handle arbitrary value syntax', () => {
      expect(cn('w-[200px]', 'h-[100px]', 'bg-[#ff0000]')).toBe('w-[200px] h-[100px] bg-[#ff0000]')
    })

    it('should handle negative values', () => {
      expect(cn('-mt-4', '-ml-2', 'pt-4')).toBe('-mt-4 -ml-2 pt-4')
    })

    it('should handle important modifier', () => {
      expect(cn('!p-4', '!m-0')).toBe('!p-4 !m-0')
    })
  })

  describe('comparison with documentation examples', () => {
    it('should match example: cn("foo", "bar") => "foo bar"', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should match example: cn("foo", false && "bar") => "foo"', () => {
      expect(cn('foo', false && 'bar')).toBe('foo')
    })

    it('should match example: cn("foo", undefined, "bar") => "foo bar"', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    })
  })

  describe('performance considerations', () => {
    it('should handle empty input efficiently', () => {
      expect(cn()).toBe('')
    })

    it('should handle single input efficiently', () => {
      expect(cn('single-class')).toBe('single-class')
    })

    it('should handle sparse arrays with many falsy values', () => {
      expect(
        cn(
          false,
          undefined,
          null,
          'valid-1',
          false,
          undefined,
          null,
          'valid-2',
          false,
          undefined,
          null
        )
      ).toBe('valid-1 valid-2')
    })
  })
})
