/**
 * useCanAccess hook
 * Checks if the current user has access to a specific resource/action.
 *
 * 100% API-compatible with react-admin.
 *
 * Features:
 * - Simple permission string matching
 * - Permission array matching (any or all)
 * - Wildcard permission support (e.g., "admin.*" matches "admin.read")
 * - Resource/action based permissions (e.g., { resource: 'posts', action: 'edit' })
 * - Object-based permission structures
 * - Custom permission check functions
 *
 * @module hooks/useCanAccess
 */

import { useMemo } from 'react'

import { usePermissions } from './usePermissions'

/**
 * Parameters for useCanAccess hook
 */
export interface UseCanAccessParams {
  /** Simple permission string or array of permissions to check */
  permission?: string | string[] | undefined
  /** Resource name for resource-based permissions (e.g., "posts") */
  resource?: string | undefined
  /** Action name for resource-based permissions (e.g., "edit", "delete") */
  action?: string | undefined
  /** When true, all permissions in the array must match. @default false */
  requireAll?: boolean | undefined
  /** Custom function to check access against permissions object */
  canAccessCheck?: ((permissions: unknown) => boolean) | undefined
}

/**
 * Return type for useCanAccess hook
 */
export interface UseCanAccessResult {
  /** Whether the user has access (false while loading or on error) */
  canAccess: boolean
  /** Whether permissions are still being fetched */
  isLoading: boolean
  /** Error from fetching permissions, null if no error */
  error: Error | null
}

/**
 * Check if a user permission matches a required permission
 * Supports wildcards like "admin.*" matching "admin.read"
 */
function matchPermission(userPermission: string, requiredPermission: string): boolean {
  // Exact match
  if (userPermission === requiredPermission) {
    return true
  }

  // Global wildcard matches everything
  if (userPermission === '*') {
    return true
  }

  // Wildcard match (e.g., "admin.*" matches "admin.read")
  if (userPermission.endsWith('.*')) {
    const prefix = userPermission.slice(0, -1) // Remove the '*', keep the dot
    return requiredPermission.startsWith(prefix)
  }

  return false
}

/**
 * Check if user has a specific permission
 */
function checkPermission(
  permissions: unknown,
  requiredPermission: string
): boolean {
  if (Array.isArray(permissions)) {
    return permissions.some((perm) =>
      typeof perm === 'string' ? matchPermission(perm, requiredPermission) : false
    )
  }
  return false
}

/**
 * Check access against permission array
 */
function checkPermissionArray(
  permissions: unknown,
  requiredPermissions: string[],
  requireAll: boolean
): boolean {
  if (requireAll) {
    return requiredPermissions.every((perm) => checkPermission(permissions, perm))
  }
  return requiredPermissions.some((perm) => checkPermission(permissions, perm))
}

/**
 * Check access for resource/action based permissions
 * Supports both array format ["posts.read"] and object format { posts: { read: true } }
 */
function checkResourceAction(
  permissions: unknown,
  resource: string,
  action: string
): boolean {
  const permissionKey = `${resource}.${action}`

  // Check array format
  if (Array.isArray(permissions)) {
    return checkPermission(permissions, permissionKey)
  }

  // Check object format
  if (permissions && typeof permissions === 'object') {
    const perms = permissions as Record<string, unknown>
    const resourcePerms = perms[resource]
    if (resourcePerms && typeof resourcePerms === 'object') {
      const actionPerms = resourcePerms as Record<string, boolean>
      return actionPerms[action] === true
    }
  }

  return false
}

/**
 * Hook to check if the current user has access to a resource/action.
 *
 * Priority order for permission checks:
 * 1. Custom canAccessCheck function (if provided)
 * 2. Resource/action based check (if both resource and action provided)
 * 3. Simple permission string or array check
 *
 * @param params - Permission check parameters
 * @returns Object containing canAccess boolean, loading state, and error
 *
 * @example
 * ```tsx
 * // Simple permission check
 * const { canAccess } = useCanAccess({ permission: 'admin' })
 *
 * // Check multiple permissions (any match)
 * const { canAccess } = useCanAccess({ permission: ['admin', 'editor'] })
 *
 * // Check multiple permissions (all must match)
 * const { canAccess } = useCanAccess({
 *   permission: ['admin', 'editor'],
 *   requireAll: true
 * })
 *
 * // Resource/action check
 * const { canAccess } = useCanAccess({ resource: 'posts', action: 'edit' })
 *
 * // Wildcard permissions
 * // If user has 'admin.*', they can access 'admin.read', 'admin.write', etc.
 * const { canAccess } = useCanAccess({ permission: 'admin.read' })
 *
 * // Custom check function
 * const { canAccess } = useCanAccess({
 *   canAccessCheck: (perms) => {
 *     const p = perms as { level: number }
 *     return p.level >= 3
 *   }
 * })
 *
 * // Conditional rendering based on access
 * if (isLoading) return <Spinner />
 * if (!canAccess) return <AccessDenied />
 * return <ProtectedContent />
 * ```
 */
export function useCanAccess(params: UseCanAccessParams): UseCanAccessResult {
  const { permission, resource, action, requireAll = false, canAccessCheck } = params
  const { permissions, isLoading, error } = usePermissions()

  // Memoize the access check result to prevent unnecessary re-renders
  const canAccess = useMemo(() => {
    // Default to false while loading or on error
    if (isLoading || error || permissions === undefined) {
      return false
    }

    // Custom check function takes priority
    if (canAccessCheck) {
      return canAccessCheck(permissions)
    }

    // Resource/action based permission check
    if (resource && action) {
      return checkResourceAction(permissions, resource, action)
    }

    // Simple permission check
    if (permission) {
      if (Array.isArray(permission)) {
        return checkPermissionArray(permissions, permission, requireAll)
      }
      return checkPermission(permissions, permission)
    }

    return false
  }, [permissions, isLoading, error, canAccessCheck, resource, action, permission, requireAll])

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      canAccess,
      isLoading,
      error,
    }),
    [canAccess, isLoading, error]
  )
}
