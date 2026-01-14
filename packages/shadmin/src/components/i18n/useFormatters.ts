/**
 * useFormatters - Hook providing locale-aware formatting functions
 *
 * Returns memoized formatting functions that respect the current locale
 * from the TranslationContext.
 */

import { useCallback, useMemo } from 'react'

import {
  formatDate,
  formatDateTime,
  formatTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
  formatList,
  type DateFormatOptions,
  type NumberFormatOptions,
  type CurrencyFormatOptions,
  type RelativeTimeFormatOptions,
} from './formatting'
import { useTranslationContextOptional } from '../../contexts/TranslationContext'

/**
 * Return type for useFormatters hook
 */
export interface UseFormattersResult {
  /** Current locale */
  locale: string
  /** Format a date */
  date: (date: Date | number | string, options?: DateFormatOptions) => string
  /** Format a date with time */
  dateTime: (date: Date | number | string, options?: DateFormatOptions) => string
  /** Format a time */
  time: (date: Date | number | string, options?: DateFormatOptions) => string
  /** Format a number */
  number: (value: number, options?: NumberFormatOptions) => string
  /** Format a currency value */
  currency: (value: number, options?: CurrencyFormatOptions) => string
  /** Format a percentage */
  percent: (value: number, options?: NumberFormatOptions) => string
  /** Format a relative time */
  relativeTime: (date: Date | number | string, options?: RelativeTimeFormatOptions) => string
  /** Format a list */
  list: (items: string[], options?: Intl.ListFormatOptions) => string
}

/**
 * Hook that returns locale-aware formatting functions
 *
 * All formatters use the current locale from TranslationContext,
 * but can be overridden per-call via options.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const format = useFormatters()
 *
 *   return (
 *     <div>
 *       <p>Date: {format.date(new Date())}</p>
 *       <p>Price: {format.currency(1234.56, { currency: 'EUR' })}</p>
 *       <p>Updated: {format.relativeTime(lastUpdated)}</p>
 *       <p>Count: {format.number(1000000)}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFormatters(): UseFormattersResult {
  const context = useTranslationContextOptional()
  const locale = context?.locale ?? 'en'

  const date = useCallback(
    (dateValue: Date | number | string, options?: DateFormatOptions) =>
      formatDate(dateValue, options?.locale ?? locale, options),
    [locale]
  )

  const dateTime = useCallback(
    (dateValue: Date | number | string, options?: DateFormatOptions) =>
      formatDateTime(dateValue, options?.locale ?? locale, options),
    [locale]
  )

  const time = useCallback(
    (dateValue: Date | number | string, options?: DateFormatOptions) =>
      formatTime(dateValue, options?.locale ?? locale, options),
    [locale]
  )

  const number = useCallback(
    (value: number, options?: NumberFormatOptions) =>
      formatNumber(value, options?.locale ?? locale, options),
    [locale]
  )

  const currency = useCallback(
    (value: number, options?: CurrencyFormatOptions) =>
      formatCurrency(value, options?.locale ?? locale, options),
    [locale]
  )

  const percent = useCallback(
    (value: number, options?: NumberFormatOptions) =>
      formatPercent(value, options?.locale ?? locale, options),
    [locale]
  )

  const relativeTime = useCallback(
    (dateValue: Date | number | string, options?: RelativeTimeFormatOptions) =>
      formatRelativeTime(dateValue, options?.locale ?? locale, options),
    [locale]
  )

  const list = useCallback(
    (items: string[], options?: Intl.ListFormatOptions) =>
      formatList(items, locale, options),
    [locale]
  )

  return useMemo(
    () => ({
      locale,
      date,
      dateTime,
      time,
      number,
      currency,
      percent,
      relativeTime,
      list,
    }),
    [locale, date, dateTime, time, number, currency, percent, relativeTime, list]
  )
}
