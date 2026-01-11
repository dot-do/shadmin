/**
 * i18n Components and Utilities
 *
 * Provides components and utilities for internationalization:
 * - LocaleSwitcher: UI for changing the application locale
 * - Translate: Declarative component for translations
 * - TranslateLabel: Specialized component for form field labels
 * - useFormatters: Hook for locale-aware formatting
 * - Formatting utilities: Functions for dates, numbers, currencies, etc.
 */

// Components
export { LocaleSwitcher, type LocaleSwitcherProps } from './LocaleSwitcher'
export { Translate, type TranslateProps } from './Translate'
export { TranslateLabel, type TranslateLabelProps } from './TranslateLabel'

// Hooks
export { useFormatters, type UseFormattersResult } from './useFormatters'

// Formatting utilities
export {
  formatDate,
  formatDateTime,
  formatTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
  formatList,
  getLocaleDisplayName,
  type DateFormatOptions,
  type NumberFormatOptions,
  type CurrencyFormatOptions,
  type RelativeTimeFormatOptions,
} from './formatting'
