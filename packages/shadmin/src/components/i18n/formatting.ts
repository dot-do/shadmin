/**
 * Locale-aware formatting utilities
 *
 * Provides functions for formatting dates, numbers, currencies, and
 * relative times according to the current locale.
 */

/**
 * Options for date formatting
 */
export interface DateFormatOptions extends Intl.DateTimeFormatOptions {
  /** Custom locale override */
  locale?: string
}

/**
 * Options for number formatting
 */
export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  /** Custom locale override */
  locale?: string
}

/**
 * Options for relative time formatting
 */
export interface RelativeTimeFormatOptions extends Intl.RelativeTimeFormatOptions {
  /** Custom locale override */
  locale?: string
}

/**
 * Options for currency formatting
 */
export interface CurrencyFormatOptions extends Omit<Intl.NumberFormatOptions, 'style' | 'currency'> {
  /** Custom locale override */
  locale?: string
  /** Currency code (e.g., 'USD', 'EUR', 'GBP') */
  currency?: string
}

/**
 * Format a date according to the locale
 *
 * @example
 * ```ts
 * formatDate(new Date(), 'en-US')
 * // "1/15/2024"
 *
 * formatDate(new Date(), 'de-DE', { dateStyle: 'full' })
 * // "Montag, 15. Januar 2024"
 * ```
 */
export function formatDate(
  date: Date | number | string,
  locale: string = 'en',
  options: DateFormatOptions = {}
): string {
  const { locale: _overrideLocale, ...intlOptions } = options
  const dateObj = date instanceof Date ? date : new Date(date)

  // Return empty string for invalid dates
  if (Number.isNaN(dateObj.getTime())) {
    return ''
  }

  try {
    return new Intl.DateTimeFormat(locale, intlOptions).format(dateObj)
  } catch {
    // Fallback to ISO string if locale is invalid
    return dateObj.toISOString().split('T')[0] ?? ''
  }
}

/**
 * Format a date with time according to the locale
 *
 * @example
 * ```ts
 * formatDateTime(new Date(), 'en-US')
 * // "1/15/2024, 3:30 PM"
 *
 * formatDateTime(new Date(), 'fr-FR')
 * // "15/01/2024 15:30"
 * ```
 */
export function formatDateTime(
  date: Date | number | string,
  locale: string = 'en',
  options: DateFormatOptions = {}
): string {
  return formatDate(date, locale, {
    dateStyle: 'short',
    timeStyle: 'short',
    ...options,
  })
}

/**
 * Format a time according to the locale
 *
 * @example
 * ```ts
 * formatTime(new Date(), 'en-US')
 * // "3:30 PM"
 *
 * formatTime(new Date(), 'de-DE')
 * // "15:30"
 * ```
 */
export function formatTime(
  date: Date | number | string,
  locale: string = 'en',
  options: DateFormatOptions = {}
): string {
  return formatDate(date, locale, {
    timeStyle: 'short',
    ...options,
  })
}

/**
 * Format a number according to the locale
 *
 * @example
 * ```ts
 * formatNumber(1234567.89, 'en-US')
 * // "1,234,567.89"
 *
 * formatNumber(1234567.89, 'de-DE')
 * // "1.234.567,89"
 *
 * formatNumber(0.75, 'en-US', { style: 'percent' })
 * // "75%"
 * ```
 */
export function formatNumber(
  value: number,
  locale: string = 'en',
  options: NumberFormatOptions = {}
): string {
  const { locale: _overrideLocale, ...intlOptions } = options

  if (!Number.isFinite(value)) {
    return ''
  }

  try {
    return new Intl.NumberFormat(locale, intlOptions).format(value)
  } catch {
    // Fallback to basic formatting
    return value.toLocaleString()
  }
}

/**
 * Format a currency value according to the locale
 *
 * @example
 * ```ts
 * formatCurrency(1234.56, 'en-US', { currency: 'USD' })
 * // "$1,234.56"
 *
 * formatCurrency(1234.56, 'de-DE', { currency: 'EUR' })
 * // "1.234,56 EUR"
 *
 * formatCurrency(1234.56, 'ja-JP', { currency: 'JPY' })
 * // "JPY 1,235"
 * ```
 */
export function formatCurrency(
  value: number,
  locale: string = 'en',
  options: CurrencyFormatOptions = {}
): string {
  const { locale: _overrideLocale, currency = 'USD', ...intlOptions } = options

  return formatNumber(value, locale, {
    style: 'currency',
    currency,
    ...intlOptions,
  })
}

/**
 * Format a percentage according to the locale
 *
 * @example
 * ```ts
 * formatPercent(0.75, 'en-US')
 * // "75%"
 *
 * formatPercent(0.1234, 'de-DE', { maximumFractionDigits: 2 })
 * // "12,34 %"
 * ```
 */
export function formatPercent(
  value: number,
  locale: string = 'en',
  options: NumberFormatOptions = {}
): string {
  return formatNumber(value, locale, {
    style: 'percent',
    ...options,
  })
}

/**
 * Relative time units for calculation
 */
type RelativeTimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'

const TIME_UNITS: { unit: RelativeTimeUnit; seconds: number }[] = [
  { unit: 'year', seconds: 31536000 },
  { unit: 'month', seconds: 2592000 },
  { unit: 'week', seconds: 604800 },
  { unit: 'day', seconds: 86400 },
  { unit: 'hour', seconds: 3600 },
  { unit: 'minute', seconds: 60 },
  { unit: 'second', seconds: 1 },
]

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 *
 * @example
 * ```ts
 * const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
 * formatRelativeTime(pastDate, 'en-US')
 * // "2 days ago"
 *
 * const futureDate = new Date(Date.now() + 3 * 60 * 60 * 1000)
 * formatRelativeTime(futureDate, 'de-DE')
 * // "in 3 Stunden"
 * ```
 */
export function formatRelativeTime(
  date: Date | number | string,
  locale: string = 'en',
  options: RelativeTimeFormatOptions = {}
): string {
  const { locale: _overrideLocale, ...intlOptions } = options
  const dateObj = date instanceof Date ? date : new Date(date)

  if (Number.isNaN(dateObj.getTime())) {
    return ''
  }

  const now = Date.now()
  const diffInSeconds = Math.round((dateObj.getTime() - now) / 1000)

  // Find the appropriate time unit
  for (const { unit, seconds } of TIME_UNITS) {
    if (Math.abs(diffInSeconds) >= seconds || unit === 'second') {
      const value = Math.round(diffInSeconds / seconds)
      try {
        return new Intl.RelativeTimeFormat(locale, {
          numeric: 'auto',
          ...intlOptions,
        }).format(value, unit)
      } catch {
        // Fallback for unsupported locales
        const absValue = Math.abs(value)
        const unitName = absValue === 1 ? unit : `${unit}s`
        return value < 0 ? `${absValue} ${unitName} ago` : `in ${absValue} ${unitName}`
      }
    }
  }

  return ''
}

/**
 * Format a list according to the locale
 *
 * @example
 * ```ts
 * formatList(['Apple', 'Banana', 'Orange'], 'en-US')
 * // "Apple, Banana, and Orange"
 *
 * formatList(['Apple', 'Banana', 'Orange'], 'de-DE')
 * // "Apple, Banana und Orange"
 * ```
 */
export function formatList(
  items: string[],
  locale: string = 'en',
  options: Intl.ListFormatOptions = {}
): string {
  if (items.length === 0) {
    return ''
  }

  try {
    return new Intl.ListFormat(locale, {
      style: 'long',
      type: 'conjunction',
      ...options,
    }).format(items)
  } catch {
    // Fallback for unsupported locales
    return items.join(', ')
  }
}

/**
 * Get the display name of a locale in its own language
 *
 * @example
 * ```ts
 * getLocaleDisplayName('en')
 * // "English"
 *
 * getLocaleDisplayName('de', 'de')
 * // "Deutsch"
 *
 * getLocaleDisplayName('ja', 'ja')
 * // "Japanese"
 * ```
 */
export function getLocaleDisplayName(
  localeCode: string,
  displayLocale: string = localeCode
): string {
  try {
    const displayNames = new Intl.DisplayNames([displayLocale], { type: 'language' })
    return displayNames.of(localeCode) ?? localeCode
  } catch {
    return localeCode
  }
}
