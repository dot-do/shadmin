import { useState, useEffect, useSyncExternalStore, useCallback } from 'react'

/**
 * Hook to check if a media query matches.
 *
 * @param query - The media query string to match
 * @returns Whether the media query matches
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }
    return window.matchMedia(query).matches
  }, [query])

  const getServerSnapshot = useCallback(() => {
    return false
  }, [])

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => {}
      }
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', callback)
      return () => mediaQuery.removeEventListener('change', callback)
    },
    [query]
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
