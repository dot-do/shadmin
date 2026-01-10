/**
 * useLocale hook
 * Returns the current locale and a function to change it
 * 100% API-compatible with react-admin
 */

import { useCallback } from 'react'
import {
  useTranslationContext,
  useTranslationContextOptional,
} from '../contexts/TranslationContext'

export interface UseLocaleResult {
  locale: string
  changeLocale: (locale: string) => void
}

/**
 * Hook to get and set the current locale
 * @returns Object with current locale and changeLocale function
 *
 * @example
 * ```tsx
 * const { locale, changeLocale } = useLocale()
 *
 * return (
 *   <select value={locale} onChange={(e) => changeLocale(e.target.value)}>
 *     <option value="en">English</option>
 *     <option value="fr">French</option>
 *   </select>
 * )
 * ```
 */
export function useLocale(): UseLocaleResult {
  const context = useTranslationContextOptional()

  const changeLocale = useCallback(
    (newLocale: string): void => {
      if (context) {
        context.setLocale(newLocale)
      }
    },
    [context]
  )

  return {
    locale: context?.locale ?? 'en',
    changeLocale,
  }
}
