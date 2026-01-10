/**
 * AuthProvider type definitions for Shadmin
 * Re-exports from facade for decoupling from ra-core
 */

// Re-export AuthProvider and related types from facade
export type {
  AuthProvider,
  UserIdentity,
  AuthRedirectResult,
  LoginParams,
  LogoutParams,
  CheckAuthParams,
  GetPermissionsParams,
  CanAccessParams,
  QueryFunctionContext,
} from '../facade/auth-provider'
