/**
 * Unit tests for useFormatters hook
 */

import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useFormatters } from './useFormatters'
import {
  TranslationProvider,
  createDefaultI18nProvider,
} from '../../contexts/TranslationContext'

const messages = {
  en: {},
  fr: {},
  de: {},
}

function createWrapper(locale = 'en') {
  const provider = createDefaultI18nProvider(messages, locale)

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <TranslationProvider i18nProvider={provider} locale={locale}>
        {children}
      </TranslationProvider>
    )
  }
}

describe('useFormatters', () => {
  describe('locale', () => {
    it('returns current locale', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      expect(result.current.locale).toBe('en')
    })

    it('returns different locale', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('fr'),
      })

      expect(result.current.locale).toBe('fr')
    })

    it('defaults to en without provider', () => {
      const { result } = renderHook(() => useFormatters())

      expect(result.current.locale).toBe('en')
    })
  })

  describe('date formatting', () => {
    const testDate = new Date('2024-01-15T14:30:00Z')

    it('formats date with current locale', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const formatted = result.current.date(testDate)
      expect(formatted).toMatch(/1\/15\/2024/)
    })

    it('formats date in German locale', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('de'),
      })

      const formatted = result.current.date(testDate)
      expect(formatted).toMatch(/15\.1\.2024/)
    })

    it('allows locale override', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const formatted = result.current.date(testDate, { locale: 'de-DE' })
      expect(formatted).toMatch(/15\.1\.2024/)
    })
  })

  describe('dateTime formatting', () => {
    const testDate = new Date('2024-01-15T14:30:00Z')

    it('formats date with time', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const formatted = result.current.dateTime(testDate)
      // dateStyle: 'short' may produce 2-digit year in some environments
      expect(formatted).toMatch(/1\/15\/(2024|24)/)
      expect(formatted.length).toBeGreaterThan(10)
    })
  })

  describe('time formatting', () => {
    const testDate = new Date('2024-01-15T14:30:00Z')

    it('formats time only', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const formatted = result.current.time(testDate)
      // Should not contain year
      expect(formatted).not.toMatch(/2024/)
    })
  })

  describe('number formatting', () => {
    it('formats number with current locale', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const formatted = result.current.number(1234567.89)
      expect(formatted).toBe('1,234,567.89')
    })

    it('formats number in German locale', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('de'),
      })

      const formatted = result.current.number(1234567.89)
      expect(formatted).toMatch(/1\.234\.567,89/)
    })

    it('allows custom options', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const formatted = result.current.number(1234.5, {
        minimumFractionDigits: 2,
      })
      expect(formatted).toBe('1,234.50')
    })
  })

  describe('currency formatting', () => {
    it('formats currency with current locale', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const formatted = result.current.currency(1234.56, { currency: 'USD' })
      expect(formatted).toMatch(/\$1,234\.56/)
    })

    it('formats EUR in German locale', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('de'),
      })

      const formatted = result.current.currency(1234.56, { currency: 'EUR' })
      expect(formatted).toMatch(/EUR|€/)
    })
  })

  describe('percent formatting', () => {
    it('formats percentage', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const formatted = result.current.percent(0.75)
      expect(formatted).toBe('75%')
    })
  })

  describe('relativeTime formatting', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('formats relative time', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const pastDate = new Date('2024-01-13T12:00:00Z')
      const formatted = result.current.relativeTime(pastDate)
      expect(formatted).toMatch(/2 days ago/i)
    })
  })

  describe('list formatting', () => {
    it('formats list', () => {
      const { result } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const formatted = result.current.list(['Apple', 'Banana', 'Orange'])
      expect(formatted).toBe('Apple, Banana, and Orange')
    })
  })

  describe('memoization', () => {
    it('returns stable function references', () => {
      const { result, rerender } = renderHook(() => useFormatters(), {
        wrapper: createWrapper('en'),
      })

      const firstDate = result.current.date
      const firstNumber = result.current.number

      rerender()

      expect(result.current.date).toBe(firstDate)
      expect(result.current.number).toBe(firstNumber)
    })
  })
})
