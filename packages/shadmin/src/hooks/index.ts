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

// Re-export context hooks for convenience
export { useRecordContext, type RaRecord } from '../contexts/RecordContext'
export { useListContext, type ListControllerResult, type SortPayload, type SortOrder, type FilterPayload, type Identifier } from '../contexts/ListContext'
