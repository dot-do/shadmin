/**
 * useLocaleState hook
 * Returns an array with current locale and setLocale function
 * 100% API-compatible with react-admin
 */

import { useCallback } from 'react'
import {
  useTranslationContextOptional,
} from '../contexts/TranslationContext'

/**
 * Hook to get and set the current locale as a tuple
 * This is an alternative API to useLocale that returns an array like useState
 * @returns Tuple of [locale, setLocale]
 *
 * @example
 * ```tsx
 * const [locale, setLocale] = useLocaleState()
 *
 * return (
 *   <select value={locale} onChange={(e) => setLocale(e.target.value)}>
 *     <option value="en">English</option>
 *     <option value="fr">French</option>
 *   </select>
 * )
 * ```
 */
export function useLocaleState(): [string, (locale: string) => void] {
  const context = useTranslationContextOptional()

  const setLocale = useCallback(
    (newLocale: string): void => {
      if (context) {
        context.setLocale(newLocale)
      }
    },
    [context]
  )

  return [context?.locale ?? 'en', setLocale]
}
