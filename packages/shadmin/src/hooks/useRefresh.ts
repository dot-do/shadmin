/**
 * useRefresh hook
 * Refresh the current view or specific resource data
 * 100% API-compatible with react-admin
 */

import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

/**
 * Options for refresh
 */
export interface RefreshOptions {
  /** If true, clears the cache before refetching (hard refresh) */
  hard?: boolean
}

/**
 * Refresh function signature
 */
export type RefreshFunction = (resource?: string, options?: RefreshOptions) => void

/**
 * Hook to refresh data from the data provider
 *
 * @returns A function to trigger data refresh
 *
 * @example
 * ```tsx
 * const refresh = useRefresh()
 *
 * // Refresh all queries
 * refresh()
 *
 * // Refresh specific resource
 * refresh('posts')
 *
 * // Hard refresh (clear cache first)
 * refresh(undefined, { hard: true })
 * ```
 */
export function useRefresh(): RefreshFunction {
  const queryClient = useQueryClient()

  return useCallback<RefreshFunction>(
    (resource, options = {}) => {
      const { hard = false } = options

      if (resource) {
        // Refresh specific resource
        if (hard) {
          queryClient.removeQueries({ queryKey: [resource] })
        }
        queryClient.invalidateQueries({ queryKey: [resource] })
      } else {
        // Refresh all queries
        if (hard) {
          queryClient.clear()
        }
        queryClient.invalidateQueries()
      }
    },
    [queryClient]
  )
}
