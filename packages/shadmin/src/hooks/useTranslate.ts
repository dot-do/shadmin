/**
 * useTranslate hook
 * Returns a translate function for i18n
 * 100% API-compatible with react-admin
 */

import { useCallback } from 'react'
import {
  useTranslationContextOptional,
  type TranslateFunction,
  type TranslateOptions,
} from '../contexts/TranslationContext'

/**
 * Hook to get the translate function
 * @returns A function to translate keys to localized strings
 *
 * @example
 * ```tsx
 * const translate = useTranslate()
 * const greeting = translate('hello', { name: 'World' })
 * const items = translate('items.count', { smart_count: 5 })
 * ```
 */
export function useTranslate(): TranslateFunction {
  const context = useTranslationContextOptional()

  const translate = useCallback(
    (key: string, options?: TranslateOptions): string => {
      if (!context) {
        // If no provider, just return the key or default value
        return options?._ ?? key
      }
      return context.i18nProvider.translate(key, options)
    },
    [context]
  )

  return translate
}

export type { TranslateFunction, TranslateOptions }
