// Shadmin - Modern Admin UI Library
// Built with React 19 and shadcn/ui
// Uses ra-core for headless admin functionality

// =============================================================================
// RA-CORE RE-EXPORTS
// =============================================================================
// Re-export ra-core for drop-in react-admin compatibility
// This provides all hooks, types, and utilities from react-admin's core
export * from 'ra-core'

// Re-export Link from react-router-dom for react-admin compatibility
export { Link } from 'react-router-dom'

// =============================================================================
// SHADMIN COMPONENTS
// =============================================================================
// Shadmin components (override ra-ui-materialui with shadcn/ui)
// Note: FormDataConsumer is explicitly exported to override ra-core's version
// with our optimized shadmin implementation that includes useFormData hook
export * from './components'
export { FormDataConsumer, useFormData } from './components/form/FormDataConsumer'

// =============================================================================
// CONTEXT EXPORTS - Providers, Hooks, and Types
// =============================================================================

// Form Context
export {
  FormContext,
  FormContextProvider,
  useFormContext,
  useShadminFormContext,
  type ShadminFormContextValue,
  type ShadminFormContext,
  type FormContextProviderProps,
  type MutationMode,
} from './contexts/FormContext'

// Theme Context
export {
  ThemeContext,
  ThemeProvider,
  useTheme,
  type ThemeContextValue,
  type Theme,
  type ThemeProviderProps,
} from './contexts/ThemeContext'

// DataProvider Context
export {
  DataProviderContext,
  DataProviderContextProvider,
  useDataProvider,
  useDataProviderOptional,
  type DataProviderContextProviderProps,
} from './contexts/DataProviderContext'

// AuthProvider Context
export {
  AuthProviderContext,
  AuthProviderContextProvider,
  useAuthProvider,
  useAuthProviderOptional,
  type AuthProviderContextProviderProps,
} from './contexts/AuthProviderContext'

// Resource Context
export {
  ResourceContext,
  ResourceContextProvider,
  useResource,
  useResourceOptional,
  useResourceContext,
  ResourceDefinitionContext,
  ResourceDefinitionContextProvider,
  useResourceDefinitions,
  useResourceDefinition,
  type ResourceContextProviderProps,
  type ResourceDefinitions,
  type ResourceDefinitionContextProviderProps,
  type UseResourceContextOptions,
} from './contexts/ResourceContext'

// Record Context
export {
  RecordContext,
  RecordContextProvider,
  useRecordContext,
  type RecordContextProviderProps,
} from './contexts/RecordContext'

// List Context
export {
  ListContext,
  ListContextProvider,
  useListContext,
  type ListControllerResult,
  type ListContextProviderProps,
  type SortPayload,
  type SortOrder,
  type FilterPayload,
} from './contexts/ListContext'

// Notification Context
export {
  NotificationContext,
  NotificationContextProvider,
  useNotify,
  useNotificationContext,
  type NotificationType,
  type NotificationOptions,
  type Notification,
  type NotificationContextValue,
  type NotifyFunction,
  type NotificationContextProviderProps,
} from './contexts/NotificationContext'

// Translation Context
export {
  TranslationContext,
  TranslationProvider,
  useTranslationContext,
  useTranslationContextOptional,
  createDefaultI18nProvider,
  type TranslationContextValue,
  type TranslationProviderProps,
  type TranslateFunction,
  type TranslateOptions,
  type TranslationMessages,
  type I18nProvider,
} from './contexts/TranslationContext'

// =============================================================================
// HOOK EXPORTS - Data Fetching, Mutations, Auth, Navigation
// =============================================================================

// Utility Hooks
export { useMediaQuery } from './hooks/useMediaQuery'

// Data Fetching Hooks
export {
  useGetList,
  type UseGetListParams,
  type UseGetListOptions,
  type UseGetListResult,
} from './hooks/useGetList'

export {
  useGetOne,
  type UseGetOneParams,
  type UseGetOneOptions,
  type UseGetOneResult,
} from './hooks/useGetOne'

export {
  useGetMany,
  type UseGetManyParams,
  type UseGetManyOptions,
  type UseGetManyResult,
} from './hooks/useGetMany'

export {
  useGetManyReference,
  type UseGetManyReferenceParams,
  type UseGetManyReferenceOptions,
  type UseGetManyReferenceResult,
} from './hooks/useGetManyReference'

// Mutation Hooks - Create
export {
  useCreate,
  type UseCreateMutateParams,
  type UseCreateOptions,
  type UseCreateResult,
  type UseCreateMutationState,
  type CreateFunction,
} from './hooks/useCreate'

// Mutation Hooks - Update
export {
  useUpdate,
  type UseUpdateMutateParams,
  type UseUpdateOptions,
  type UseUpdateResult,
  type UseUpdateMutationState,
  type UpdateFunction,
} from './hooks/useUpdate'

export {
  useUpdateMany,
  type UseUpdateManyMutateParams,
  type UseUpdateManyOptions,
  type UseUpdateManyResult,
  type UseUpdateManyMutationState,
  type UpdateManyFunction,
} from './hooks/useUpdateMany'

// Mutation Hooks - Delete
export {
  useDelete,
  type UseDeleteMutateParams,
  type UseDeleteOptions,
  type UseDeleteResult,
  type UseDeleteMutationState,
  type DeleteFunction,
} from './hooks/useDelete'

export {
  useDeleteMany,
  type UseDeleteManyMutateParams,
  type UseDeleteManyOptions,
  type UseDeleteManyResult,
  type UseDeleteManyMutationState,
  type DeleteManyFunction,
} from './hooks/useDeleteMany'

// Auth Hooks
export {
  useLogin,
  type UseLoginOptions,
  type LoginOptions,
  type UseLoginResult,
} from './hooks/useLogin'

export {
  useLogout,
  type UseLogoutOptions,
  type LogoutOptions,
  type UseLogoutResult,
} from './hooks/useLogout'

export {
  usePermissions,
  type UsePermissionsOptions,
  type UsePermissionsResult,
} from './hooks/usePermissions'

export {
  useCanAccess,
  type UseCanAccessParams,
  type UseCanAccessResult,
} from './hooks/useCanAccess'

// Navigation Hooks
export {
  useRedirect,
  type RedirectTo,
  type RedirectOptions,
  type RedirectFunction,
} from './hooks/useRedirect'

export {
  useRefresh,
  type RefreshOptions,
  type RefreshFunction,
} from './hooks/useRefresh'

// List State Management Hooks
export {
  useListParams,
  type UseListParamsProps,
  type UseListParamsResult,
} from './hooks/useListParams'

// i18n Hooks
export {
  useTranslate,
  type TranslateFunction as UseTranslateFunction,
  type TranslateOptions as UseTranslateOptions,
} from './hooks/useTranslate'

export {
  useLocale,
  type UseLocaleResult,
} from './hooks/useLocale'

// Data Hook Factories - For creating custom data hooks
export {
  createQueryHook,
  createSimpleQueryHook,
  createMutationHook,
  createSimpleMutationHook,
  type QueryHookConfig,
  type MutationHookConfig,
  type CacheUpdateHandlers,
  type BaseQueryResult,
  type BaseMutationState,
  type BaseErrorHandling,
  type MutationErrorHandling,
} from './hooks/createDataHook'

// Autocomplete Suggestion Context
export {
  useCreateSuggestionContext,
  CreateSuggestionContext,
  type CreateSuggestionContextValue,
} from './hooks/useCreateSuggestionContext'

// =============================================================================
// TYPE EXPORTS
// =============================================================================
// Shadmin types (only export types NOT already in ra-core to avoid duplicates)
export type {
  // Common shadmin-specific types
  BaseProps,
  WithChildren,
  WithClassName,
  AsChildProps,
  Path,
  PathValue,
  LoosePath,
  ComponentProps,
  // Data provider types not in ra-core
  SortOrder,
  // Admin types
  AdminPlugin,
  AdminPluginContext,
  ThemeOptions,
  AdminLayoutProps,
  AdminProps,
} from './types'

// =============================================================================
// UTILITY EXPORTS
// =============================================================================
export * from './utils'

// =============================================================================
// DOTDO INTEGRATION
// =============================================================================
// DO() helper for connecting shadmin to dotdo Durable Objects
// Creates react-admin compatible DataProvider (DB) and AuthProvider (Auth)
export {
  DO,
  validateBaseUrl,
  createDataProviderFactory,
  createAuthProviderFactory,
  type DOWithResources,
  type DOConfig,
  type DBOptions,
  type AuthOptions,
  type DOResult,
  type DOListResponse,
  type DORecordResponse,
  type DOBatchResponse,
  type DOLoginResponse,
  type DOUserIdentity,
  type DOErrorResponse,
  type DORequestOptions,
} from './dotdo'

// =============================================================================
// VERSION
// =============================================================================
export const VERSION = '0.0.5'
