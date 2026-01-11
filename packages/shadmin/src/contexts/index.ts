// Context exports
export {
  QueryClientInstanceContext,
  QueryClientContextProvider,
  useQueryClientInstance,
  useQueryClientInstanceOptional,
  DEFAULT_QUERY_CLIENT_OPTIONS,
  type QueryClientContextProviderProps,
} from './QueryClientContext'

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

// Note: RaRecord is exported from ra-core in src/index.ts
// Not re-exported here to avoid duplicate export conflicts

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

export {
  ListPaginationContext,
  ListPaginationContextProvider,
  useListPaginationContext,
  useListPaginationContextOptional,
  usePickPaginationContext,
  type ListPaginationContextValue,
  type ListPaginationContextProviderProps,
} from './ListPaginationContext'

export {
  ListSortContext,
  ListSortContextProvider,
  useListSortContext,
  useListSortContextOptional,
  usePickSortContext,
  type ListSortContextValue,
  type ListSortContextProviderProps,
} from './ListSortContext'

export {
  ListFilterContext,
  ListFilterContextProvider,
  useListFilterContext,
  useListFilterContextOptional,
  usePickFilterContext,
  type ListFilterContextValue,
  type ListFilterContextProviderProps,
} from './ListFilterContext'

export {
  ListSelectionContext,
  ListSelectionContextProvider,
  useListSelectionContext,
  useListSelectionContextOptional,
  usePickSelectionContext,
  type ListSelectionContextValue,
  type ListSelectionContextProviderProps,
} from './ListSelectionContext'

// Note: Identifier is exported from ra-core in src/index.ts
// Not re-exported here to avoid duplicate export conflicts

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
} from './TranslationContext'
