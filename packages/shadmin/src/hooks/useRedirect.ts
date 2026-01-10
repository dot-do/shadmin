/**
 * useRedirect hook
 * Navigate programmatically to different views
 * 100% API-compatible with react-admin
 */

import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import type { Identifier } from '../types'

/**
 * Redirect target types matching react-admin
 */
export type RedirectTo = 'list' | 'show' | 'edit' | 'create' | false | string

/**
 * Options for redirect
 */
export interface RedirectOptions {
  /** Base path for the resource */
  basePath?: string
  /** State to pass with the navigation */
  state?: Record<string, unknown>
  /** Replace instead of push to history */
  replace?: boolean
}

/**
 * Redirect function signature
 */
export type RedirectFunction = (
  redirectTo: RedirectTo,
  resource?: string,
  id?: Identifier,
  options?: RedirectOptions
) => void

/**
 * Build the path for a given redirect target
 */
function buildPath(
  redirectTo: RedirectTo,
  resource?: string,
  id?: Identifier,
  basePath?: string
): string | null {
  if (redirectTo === false) {
    return null
  }

  if (
    redirectTo !== 'list' &&
    redirectTo !== 'show' &&
    redirectTo !== 'edit' &&
    redirectTo !== 'create'
  ) {
    // It's a custom path string
    return redirectTo
  }

  const base = basePath ?? ''
  const resourcePath = resource ? `${base}/${resource}` : base

  switch (redirectTo) {
    case 'list':
      return resourcePath
    case 'create':
      return `${resourcePath}/create`
    case 'edit':
      return id !== undefined ? `${resourcePath}/${id}` : resourcePath
    case 'show':
      return id !== undefined ? `${resourcePath}/${id}/show` : resourcePath
    default:
      return resourcePath
  }
}

/**
 * Hook to navigate programmatically
 *
 * @returns A function to redirect to different views
 *
 * @example
 * ```tsx
 * const redirect = useRedirect()
 *
 * // Navigate to list
 * redirect('list', 'posts')
 *
 * // Navigate to show view
 * redirect('show', 'posts', 123)
 *
 * // Navigate to edit view
 * redirect('edit', 'posts', 123)
 *
 * // Navigate to create view
 * redirect('create', 'posts')
 *
 * // Navigate to custom path
 * redirect('/custom/path')
 *
 * // Prevent redirect
 * redirect(false)
 * ```
 */
export function useRedirect(): RedirectFunction {
  const navigate = useNavigate()

  return useCallback<RedirectFunction>(
    (redirectTo, resource, id, options = {}) => {
      const path = buildPath(redirectTo, resource, id, options.basePath)

      if (path === null) {
        // false was passed, don't redirect
        return
      }

      navigate(path, {
        ...(options.replace !== undefined && { replace: options.replace }),
        ...(options.state !== undefined && { state: options.state }),
      })
    },
    [navigate]
  )
}
