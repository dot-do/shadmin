// Shadmin - Modern Admin UI Library
// Built with React 19 and shadcn/ui
// Uses ra-core for headless admin functionality

// =============================================================================
// RA-CORE FACADE RE-EXPORTS
// =============================================================================
/**
 * React-Admin Core Facade
 *
 * Instead of `export * from 'ra-core'` (which exports ~400+ items), we use a
 * controlled facade that exports only what consumers actually need. This:
 *
 * 1. **Reduces API surface** - Only exports used functionality
 * 2. **Enables substitution** - Can swap ra-core implementations with native ones
 * 3. **Improves bundle size** - Tree-shaking works better with explicit exports
 * 4. **Documents dependencies** - Makes ra-core usage explicit and auditable
 *
 * For full ra-core compatibility, consumers can still import directly from 'ra-core'.
 *
 * @see facade/ra-core.ts for the complete list of re-exported items
 */

// Context Hooks (from ra-core via facade)
export {
  useCreatePath,
  useEditContext,
  useCreateContext,
} from './facade/ra-core'

// Base Components (Headless Controllers)
export {
  EditBase,
  ShowBase,
  CreateBase,
} from './facade/ra-core'

// Utility Functions
export { fetchRelatedRecords } from './facade/ra-core'

// Auth Hooks (from ra-core via facade)
export { useGetIdentity } from './facade/ra-core'

// Type re-exports from ra-core (for backward compatibility)
export type {
  Identifier,
  RaRecord,
  DataProvider,
  AuthProvider,
  UserIdentity,
  Exporter,
} from './facade/ra-core'

// Re-export Link from react-router-dom for react-admin compatibility
export { Link } from 'react-router-dom'

// =============================================================================
// SHADMIN COMPONENTS
// =============================================================================
// Shadmin components (override ra-ui-materialui with shadcn/ui)
// Note: These exports will override any conflicting ra-core exports above
//
// Explicitly re-export ArrayInputContext and ArrayInputContextValue from shadmin
// to resolve TypeScript's ambiguity error (TS2308)
export {
  ArrayInputContext,
  type ArrayInputContextValue,
} from './components/input/ArrayInput'

// Re-export all other components
export * from './components'

// Explicitly export FormDataConsumer to override ra-core's version
// with our optimized shadmin implementation that includes useFormData hook
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
  type FilterPayload,
  type FilterOperator,
  type FilterKeys,
  type TypedFilterPayload,
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

export { useLocaleState } from './hooks/useLocaleState'

export {
  useSetLocale,
  type SetLocale,
} from './hooks/useSetLocale'

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
// ERROR EXPORTS
// =============================================================================
// Custom error classes for standardized error handling
export {
  HttpError,
  NetworkError,
  TimeoutError,
  ValidationError,
  isHttpError,
  isNetworkError,
  isTimeoutError,
  isValidationError,
  isNotFoundError,
  isForbiddenError,
  isServerError,
  isConflictError,
  extractFieldErrors,
} from './errors'

// =============================================================================
// UTILITY EXPORTS
// =============================================================================
export * from './utils'

// =============================================================================
// CONSTANTS
// =============================================================================
// Configurable defaults for pagination, sorting, timing, and client configuration
export {
  PAGINATION_DEFAULTS,
  SORT_DEFAULTS,
  DEFAULT_SORT,
  TIMING_DEFAULTS,
  QUERY_DEFAULTS,
  DO_CLIENT_DEFAULTS,
  type PaginationConfig,
  type SortConfig,
  type ListQueryConfig,
} from './constants'

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
// MONGO.DO INTEGRATION
// =============================================================================
// createMongoDataProvider for connecting shadmin to mongo.do edge database
// Creates react-admin compatible DataProvider for MongoDB operations at the edge
export {
  createMongoDataProvider,
  type MongoConfig,
  type MongoDataProviderOptions,
  type MongoListResponse,
  type MongoRecordResponse,
  type MongoBatchResponse,
  type MongoWriteResponse,
  type MongoErrorResponse,
  type MongoRequestOptions,
  type MongoFilterOperators,
} from './mongo'

// =============================================================================
// VERSION
// =============================================================================
export const VERSION = '0.0.5'
