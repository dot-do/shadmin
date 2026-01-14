/**
 * useSetLocale hook
 * Returns a function to change the locale
 * 100% API-compatible with react-admin
 */

import { useCallback } from 'react'

import {
  useTranslationContextOptional,
} from '../contexts/TranslationContext'

export type SetLocale = (locale: string) => void

/**
 * Hook to get the setLocale function
 * @returns A function to change the current locale
 *
 * @example
 * ```tsx
 * const setLocale = useSetLocale()
 *
 * return (
 *   <button onClick={() => setLocale('fr')}>
 *     Switch to French
 *   </button>
 * )
 * ```
 */
export function useSetLocale(): SetLocale {
  const context = useTranslationContextOptional()

  const setLocale = useCallback(
    (newLocale: string): void => {
      if (context) {
        context.setLocale(newLocale)
      }
    },
    [context]
  )

  return setLocale
}
