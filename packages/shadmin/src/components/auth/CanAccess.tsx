/**
 * CanAccess component
 * Conditionally renders children based on user permissions.
 *
 * 100% API-compatible with react-admin.
 *
 * Features:
 * - Simple permission string or array matching
 * - Resource/action based permission checks
 * - Wildcard permission support (e.g., "admin.*")
 * - Custom permission check functions
 * - Render prop pattern for flexible rendering
 * - Loading state handling
 * - Error callbacks
 *
 * @module components/auth/CanAccess
 */

import { useEffect, useMemo, type ReactNode, type ReactElement } from 'react'
import { useCanAccess, type UseCanAccessParams } from '../../hooks/useCanAccess'
import { usePermissions } from '../../hooks/usePermissions'

/**
 * Render prop function signature
 */
export interface CanAccessRenderProps {
  canAccess: boolean
  permissions: unknown
}

/**
 * Fallback function signature
 */
export interface CanAccessFallbackProps {
  permission?: string | string[] | undefined
  resource?: string | undefined
  action?: string | undefined
}

/**
 * Props for CanAccess component
 */
export interface CanAccessProps extends UseCanAccessParams {
  /** Content to render when authorized */
  children: ReactNode | ((props: CanAccessRenderProps) => ReactElement | null)
  /** Content to render when unauthorized */
  fallback?: ReactNode | ((props: CanAccessFallbackProps) => ReactElement | null)
  /** Content to render while loading */
  loading?: ReactNode
  /** Callback when error occurs */
  onError?: (error: Error) => void
}

/**
 * Component that conditionally renders children based on user permissions
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CanAccess permission="admin">
 *   <AdminPanel />
 * </CanAccess>
 *
 * // With fallback
 * <CanAccess permission="admin" fallback={<AccessDenied />}>
 *   <AdminPanel />
 * </CanAccess>
 *
 * // Resource/action based
 * <CanAccess resource="posts" action="edit">
 *   <EditButton />
 * </CanAccess>
 *
 * // Render prop pattern
 * <CanAccess permission="admin">
 *   {({ canAccess, permissions }) => (
 *     <div>{canAccess ? 'Has Access' : 'No Access'}</div>
 *   )}
 * </CanAccess>
 * ```
 */
export function CanAccess({
  children,
  fallback,
  loading,
  onError,
  permission,
  resource,
  action,
  requireAll,
  canAccessCheck,
}: CanAccessProps): ReactElement | null {
  const { canAccess, isLoading, error } = useCanAccess({
    permission,
    resource,
    action,
    requireAll,
    canAccessCheck,
  })
  const { permissions } = usePermissions()

  // Call onError callback when error occurs
  useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])

  // Memoize fallback props to prevent unnecessary re-renders
  const fallbackProps = useMemo(
    () => ({ permission, resource, action }),
    [permission, resource, action]
  )

  // Memoize render props to prevent unnecessary re-renders
  const renderProps = useMemo(
    () => ({ canAccess, permissions }),
    [canAccess, permissions]
  )

  // Show loading state
  if (isLoading) {
    if (loading) {
      return loading as ReactElement
    }
    return null
  }

  // Handle render prop pattern
  if (typeof children === 'function') {
    return children(renderProps)
  }

  // Show children if authorized
  if (canAccess) {
    return children as ReactElement
  }

  // Show fallback if unauthorized
  if (fallback) {
    if (typeof fallback === 'function') {
      return fallback(fallbackProps)
    }
    return fallback as ReactElement
  }

  // Default to null when unauthorized with no fallback
  return null
}

CanAccess.displayName = 'CanAccess'
