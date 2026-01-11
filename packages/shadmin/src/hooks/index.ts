/**
 * Hook exports for Shadmin
 * 100% API-compatible with react-admin hooks
 */

// Utility hooks
export { useMediaQuery } from './useMediaQuery'

// Data fetching hooks
export { useGetList, type UseGetListParams, type UseGetListOptions, type UseGetListResult } from './useGetList'
export { useGetOne, type UseGetOneParams, type UseGetOneOptions, type UseGetOneResult } from './useGetOne'
export { useGetMany, type UseGetManyParams, type UseGetManyOptions, type UseGetManyResult } from './useGetMany'
export { useGetManyReference, type UseGetManyReferenceParams, type UseGetManyReferenceOptions, type UseGetManyReferenceResult } from './useGetManyReference'

// Mutation hooks
export { useCreate, type UseCreateMutateParams, type UseCreateOptions, type UseCreateResult, type UseCreateMutationState, type CreateFunction } from './useCreate'
export { useUpdate, type UseUpdateMutateParams, type UseUpdateOptions, type UseUpdateResult, type UseUpdateMutationState, type UpdateFunction } from './useUpdate'
export { useUpdateMany, type UseUpdateManyMutateParams, type UseUpdateManyOptions, type UseUpdateManyResult, type UseUpdateManyMutationState, type UpdateManyFunction } from './useUpdateMany'
export { useDelete, type UseDeleteMutateParams, type UseDeleteOptions, type UseDeleteResult, type UseDeleteMutationState, type DeleteFunction } from './useDelete'
export { useDeleteMany, type UseDeleteManyMutateParams, type UseDeleteManyOptions, type UseDeleteManyResult, type UseDeleteManyMutationState, type DeleteManyFunction } from './useDeleteMany'

// DataProvider hook
export { useDataProvider } from './useDataProvider'

// Notification hook
export { useNotify, type NotifyFunction, type NotificationType, type NotificationOptions } from './useNotify'

// Navigation hook
export { useRedirect, type RedirectTo, type RedirectOptions, type RedirectFunction } from './useRedirect'

// Refresh hook
export { useRefresh, type RefreshOptions, type RefreshFunction } from './useRefresh'

// Auth hooks
export { useLogin, type UseLoginOptions, type LoginOptions, type UseLoginResult } from './useLogin'
export { useLogout, type UseLogoutOptions, type LogoutOptions, type UseLogoutResult } from './useLogout'
export { usePermissions, type UsePermissionsOptions, type UsePermissionsResult } from './usePermissions'
export { useCanAccess, type UseCanAccessParams, type UseCanAccessResult } from './useCanAccess'

// Re-export context hooks for convenience
export { useRecordContext } from '../contexts/RecordContext'
export { useListContext, type ListControllerResult, type SortPayload, type SortOrder, type FilterPayload } from '../contexts/ListContext'

// List params hook (URL state persistence)
export { useListParams, type UseListParamsProps, type UseListParamsResult } from './useListParams'

// Note: RaRecord and Identifier are exported from ra-core in src/index.ts
// Not re-exported here to avoid duplicate export conflicts

// i18n hooks
export { useTranslate, type TranslateFunction, type TranslateOptions } from './useTranslate'
export { useLocale, type UseLocaleResult } from './useLocale'
export { useLocaleState } from './useLocaleState'
export { useSetLocale, type SetLocale } from './useSetLocale'

// Data hook factories - for creating custom data hooks
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
} from './createDataHook'

// Create suggestion context hook (for AutocompleteInput)
export {
  useCreateSuggestionContext,
  CreateSuggestionContext,
  type CreateSuggestionContextValue,
} from './useCreateSuggestionContext'
