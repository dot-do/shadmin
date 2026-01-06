// Context exports
export {
  DataProviderContext,
  DataProviderContextProvider,
  useDataProvider,
  useDataProviderOptional,
  type DataProviderContextProviderProps,
} from './DataProviderContext'

export {
  AuthProviderContext,
  AuthProviderContextProvider,
  useAuthProvider,
  useAuthProviderOptional,
  type AuthProviderContextProviderProps,
} from './AuthProviderContext'

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
} from './ResourceContext'

export {
  RecordContext,
  RecordContextProvider,
  useRecordContext,
  type RecordContextProviderProps,
} from './RecordContext'

// RaRecord is exported from types/record.ts - re-export for backwards compatibility
export type { RaRecord } from '../types'

export {
  ListContext,
  ListContextProvider,
  useListContext,
  type ListControllerResult,
  type ListContextProviderProps,
  type SortPayload,
  type SortOrder,
  type FilterPayload,
} from './ListContext'

// Re-export Identifier from types for backwards compatibility
export type { Identifier } from '../types'

export {
  FormContext,
  FormContextProvider,
  useFormContext,
  useShadminFormContext,
  type MutationMode,
  type ShadminFormContextValue,
  type ShadminFormContext,
  type FormContextProviderProps,
} from './FormContext'

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
} from './NotificationContext'

export {
  ThemeContext,
  ThemeProvider,
  useTheme,
  type ThemeContextValue,
  type Theme,
  type ThemeProviderProps,
} from './ThemeContext'
