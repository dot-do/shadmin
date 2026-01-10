/**
 * useCanAccess hook
 * Checks if the current user has access to a specific resource/action
 * 100% API-compatible with react-admin
 */

import { usePermissions } from './usePermissions'

/**
 * Parameters for useCanAccess hook
 */
export interface UseCanAccessParams {
  /** Simple permission string or array of permissions */
  permission?: string | string[]
  /** Resource name for resource-based permissions */
  resource?: string
  /** Action name for resource-based permissions */
  action?: string
  /** Require all permissions in array (default: false - any match) */
  requireAll?: boolean
  /** Custom function to check access */
  canAccessCheck?: (permissions: unknown) => boolean
}

/**
 * Return type for useCanAccess hook
 */
export interface UseCanAccessResult {
  /** Whether the user can access */
  canAccess: boolean
  /** Whether permissions are loading */
  isLoading: boolean
  /** Error from fetching permissions */
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
 * Hook to check if the current user has access to a resource/action
 *
 * @param params - Permission check parameters
 * @returns Access result with canAccess boolean, loading state, and error
 *
 * @example
 * ```tsx
 * // Simple permission check
 * const { canAccess } = useCanAccess({ permission: 'admin' })
 *
 * // Resource/action check
 * const { canAccess } = useCanAccess({ resource: 'posts', action: 'edit' })
 *
 * // Custom check function
 * const { canAccess } = useCanAccess({
 *   canAccessCheck: (perms) => perms.level >= 3
 * })
 * ```
 */
export function useCanAccess(params: UseCanAccessParams): UseCanAccessResult {
  const { permission, resource, action, requireAll = false, canAccessCheck } = params
  const { permissions, isLoading, error } = usePermissions()

  // Default to false while loading or on error
  if (isLoading || error || permissions === undefined) {
    return {
      canAccess: false,
      isLoading,
      error,
    }
  }

  let canAccess = false

  // Custom check function takes priority
  if (canAccessCheck) {
    canAccess = canAccessCheck(permissions)
  }
  // Resource/action based permission check
  else if (resource && action) {
    canAccess = checkResourceAction(permissions, resource, action)
  }
  // Simple permission check
  else if (permission) {
    if (Array.isArray(permission)) {
      canAccess = checkPermissionArray(permissions, permission, requireAll)
    } else {
      canAccess = checkPermission(permissions, permission)
    }
  }

  return {
    canAccess,
    isLoading,
    error,
  }
}
