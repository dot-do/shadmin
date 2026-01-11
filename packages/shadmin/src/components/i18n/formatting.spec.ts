/**
 * Unit tests for formatting utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
  formatList,
  getLocaleDisplayName,
} from './formatting'

describe('formatDate', () => {
  const testDate = new Date('2024-01-15T14:30:00Z')

  it('formats date with default options', () => {
    const result = formatDate(testDate, 'en-US')
    expect(result).toMatch(/1\/15\/2024/)
  })

  it('formats date in different locale', () => {
    const result = formatDate(testDate, 'de-DE')
    expect(result).toMatch(/15\.1\.2024/)
  })

  it('accepts Date object', () => {
    const result = formatDate(testDate, 'en-US')
    expect(result).toBeTruthy()
  })

  it('accepts timestamp number', () => {
    const result = formatDate(testDate.getTime(), 'en-US')
    expect(result).toBeTruthy()
  })

  it('accepts ISO string', () => {
    const result = formatDate('2024-01-15T14:30:00Z', 'en-US')
    expect(result).toBeTruthy()
  })

  it('returns empty string for invalid date', () => {
    const result = formatDate('invalid', 'en-US')
    expect(result).toBe('')
  })

  it('applies custom options', () => {
    const result = formatDate(testDate, 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    expect(result).toMatch(/January/)
    expect(result).toMatch(/2024/)
  })
})

describe('formatDateTime', () => {
  const testDate = new Date('2024-01-15T14:30:00Z')

  it('includes both date and time', () => {
    const result = formatDateTime(testDate, 'en-US')
    // dateStyle: 'short' may produce 2-digit year in some environments
    expect(result).toMatch(/1\/15\/(2024|24)/)
    // Time depends on timezone, but should exist
    expect(result.length).toBeGreaterThan(10)
  })
})

describe('formatTime', () => {
  const testDate = new Date('2024-01-15T14:30:00Z')

  it('formats only time portion', () => {
    const result = formatTime(testDate, 'en-US')
    // Should not contain date parts like year
    expect(result).not.toMatch(/2024/)
    // Should be a reasonable time string
    expect(result.length).toBeLessThan(15)
  })
})

describe('formatNumber', () => {
  it('formats number with thousands separator', () => {
    const result = formatNumber(1234567.89, 'en-US')
    expect(result).toBe('1,234,567.89')
  })

  it('formats number in German locale', () => {
    const result = formatNumber(1234567.89, 'de-DE')
    // German uses . for thousands and , for decimal
    expect(result).toMatch(/1\.234\.567,89/)
  })

  it('formats with custom decimal places', () => {
    const result = formatNumber(1234.5, 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    expect(result).toBe('1,234.50')
  })

  it('returns empty string for non-finite numbers', () => {
    expect(formatNumber(Infinity, 'en-US')).toBe('')
    expect(formatNumber(NaN, 'en-US')).toBe('')
  })

  it('handles zero', () => {
    const result = formatNumber(0, 'en-US')
    expect(result).toBe('0')
  })

  it('handles negative numbers', () => {
    const result = formatNumber(-1234.56, 'en-US')
    expect(result).toBe('-1,234.56')
  })
})

describe('formatCurrency', () => {
  it('formats USD currency', () => {
    const result = formatCurrency(1234.56, 'en-US', { currency: 'USD' })
    expect(result).toMatch(/\$1,234\.56/)
  })

  it('formats EUR currency', () => {
    const result = formatCurrency(1234.56, 'de-DE', { currency: 'EUR' })
    // German format: 1.234,56 EUR or 1.234,56 €
    expect(result).toMatch(/EUR|€/)
  })

  it('formats GBP currency', () => {
    const result = formatCurrency(1234.56, 'en-GB', { currency: 'GBP' })
    expect(result).toMatch(/£/)
  })

  it('defaults to USD', () => {
    const result = formatCurrency(100, 'en-US')
    expect(result).toMatch(/\$/)
  })

  it('handles custom decimal places', () => {
    const result = formatCurrency(1234, 'en-US', {
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    expect(result).toBe('$1,234')
  })
})

describe('formatPercent', () => {
  it('formats decimal as percentage', () => {
    const result = formatPercent(0.75, 'en-US')
    expect(result).toBe('75%')
  })

  it('formats 100%', () => {
    const result = formatPercent(1, 'en-US')
    expect(result).toBe('100%')
  })

  it('formats with decimal places', () => {
    const result = formatPercent(0.1234, 'en-US', {
      maximumFractionDigits: 2,
    })
    expect(result).toBe('12.34%')
  })

  it('handles values over 100%', () => {
    const result = formatPercent(1.5, 'en-US')
    expect(result).toBe('150%')
  })
})

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats time in the past (days)', () => {
    const pastDate = new Date('2024-01-13T12:00:00Z') // 2 days ago
    const result = formatRelativeTime(pastDate, 'en-US')
    expect(result).toMatch(/2 days ago/i)
  })

  it('formats time in the future', () => {
    const futureDate = new Date('2024-01-18T12:00:00Z') // 3 days from now
    const result = formatRelativeTime(futureDate, 'en-US')
    expect(result).toMatch(/in 3 days/i)
  })

  it('formats hours', () => {
    const date = new Date('2024-01-15T09:00:00Z') // 3 hours ago
    const result = formatRelativeTime(date, 'en-US')
    expect(result).toMatch(/3 hours ago/i)
  })

  it('returns empty string for invalid date', () => {
    const result = formatRelativeTime('invalid', 'en-US')
    expect(result).toBe('')
  })

  it('handles yesterday/tomorrow with numeric: auto', () => {
    const yesterday = new Date('2024-01-14T12:00:00Z')
    const result = formatRelativeTime(yesterday, 'en-US', { numeric: 'auto' })
    expect(result).toMatch(/yesterday/i)
  })
})

describe('formatList', () => {
  it('formats list with conjunction', () => {
    const result = formatList(['Apple', 'Banana', 'Orange'], 'en-US')
    expect(result).toBe('Apple, Banana, and Orange')
  })

  it('formats two-item list', () => {
    const result = formatList(['Apple', 'Banana'], 'en-US')
    expect(result).toBe('Apple and Banana')
  })

  it('handles single item', () => {
    const result = formatList(['Apple'], 'en-US')
    expect(result).toBe('Apple')
  })

  it('returns empty string for empty list', () => {
    const result = formatList([], 'en-US')
    expect(result).toBe('')
  })

  it('supports disjunction type', () => {
    const result = formatList(['Apple', 'Banana', 'Orange'], 'en-US', {
      type: 'disjunction',
    })
    expect(result).toBe('Apple, Banana, or Orange')
  })
})

describe('getLocaleDisplayName', () => {
  it('returns English name for en', () => {
    const result = getLocaleDisplayName('en')
    expect(result.toLowerCase()).toContain('english')
  })

  it('returns French name for fr in French', () => {
    const result = getLocaleDisplayName('fr', 'fr')
    expect(result.toLowerCase()).toContain('fran')
  })

  it('returns something for invalid locale', () => {
    const result = getLocaleDisplayName('invalid-locale')
    // The result may vary by environment - some parse it, some return it as-is
    expect(result).toBeTruthy()
  })
})
