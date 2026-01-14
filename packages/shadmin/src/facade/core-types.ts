/**
 * Core Types Facade
 *
 * This module provides a facade/abstraction layer for core types used throughout shadmin.
 * It defines shadmin's own type definitions that are API-compatible with ra-core.
 *
 * MIGRATION PATH:
 * 1. Internal shadmin code should import from this facade
 * 2. External consumers can still use ra-core types directly
 * 3. When ready to remove ra-core dependency:
 *    - These types are already native to shadmin
 *    - No changes needed in internal code
 *
 * @module facade/core-types
 */

import type { Identifier, RaRecord, SortPayload, FilterPayload } from './data-provider'
import type { ComponentType, ReactNode } from 'react'

// Re-export data-provider types for convenience
export type { Identifier, RaRecord, SortPayload, FilterPayload } from './data-provider'

/**
 * Resource options for customizing resource behavior
 */
export interface ResourceOptions {
  /** Display label for the resource */
  label?: string
  /** Allow additional custom options */
  [key: string]: unknown
}

/**
 * Function to convert a record to a string representation
 */
export type RecordToStringFunction = (record: RaRecord) => string

/**
 * Resource definition stored in the resource context
 */
export interface ResourceDefinition<OptionsType extends ResourceOptions = ResourceOptions> {
  /** The unique name of the resource */
  readonly name: string
  /** Resource options */
  readonly options?: OptionsType
  /** Whether the resource has a list view */
  readonly hasList?: boolean
  /** Whether the resource has an edit view */
  readonly hasEdit?: boolean
  /** Whether the resource has a show view */
  readonly hasShow?: boolean
  /** Whether the resource has a create view */
  readonly hasCreate?: boolean
  /** Icon component for the resource */
  readonly icon?: ComponentType
  /** How to represent a record as a string (for titles, etc.) */
  readonly recordRepresentation?: ReactNode | RecordToStringFunction
}

/**
 * Props for the Resource component
 */
export interface ResourceProps {
  /** The unique name of the resource (used in URLs and API calls) */
  name: string
  /** Component to render for the list view */
  list?: ComponentType
  /** Component to render for the edit view */
  edit?: ComponentType
  /** Component to render for the create view */
  create?: ComponentType
  /** Component to render for the show view */
  show?: ComponentType
  /** Icon component for the resource in menu */
  icon?: ComponentType
  /** Additional resource options */
  options?: ResourceOptions
  /** How to represent a record as a string */
  recordRepresentation?: ReactNode | RecordToStringFunction
  /** Nested resources or other children */
  children?: ReactNode
  /** Intent for the resource (route or registration) */
  intent?: 'route' | 'registration'
  /** Whether the resource has a list view */
  hasList?: boolean
  /** Whether the resource has an edit view */
  hasEdit?: boolean
  /** Whether the resource has a show view */
  hasShow?: boolean
  /** Whether the resource has a create view */
  hasCreate?: boolean
}

/**
 * Notification type enum
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

/**
 * Notification payload for displaying messages
 */
export interface NotificationPayload {
  /** The message to display */
  message: string
  /** The type of notification */
  type?: NotificationType
  /** How long to show the notification (in ms) */
  autoHideDuration?: number
  /** Whether to show on multiple lines */
  multiLine?: boolean
  /** Whether the action can be undone */
  undoable?: boolean
  /** Optional message arguments for translation */
  messageArgs?: Record<string, unknown>
  /** Additional notification options */
  [key: string]: unknown
}

/**
 * Locale identifier (e.g., 'en', 'en-US', 'fr')
 */
export type Locale = string

/**
 * Locale configuration with display name
 */
export interface LocaleConfig {
  /** Locale identifier */
  locale: string
  /** Display name for the locale */
  name: string
}

/**
 * Translation function type
 */
export type TranslateFunction = (key: string, options?: Record<string, unknown>) => string

/**
 * I18n Provider interface for internationalization
 */
export interface I18nProvider {
  /** Translate a key to the current locale */
  translate: TranslateFunction
  /** Change the current locale */
  changeLocale: (locale: Locale, options?: unknown) => Promise<void>
  /** Get the current locale */
  getLocale: () => Locale
  /** Get list of available locales (optional) */
  getLocales?: () => LocaleConfig[]
  /** Allow additional custom methods */
  [key: string]: unknown
}

/**
 * Mutation mode for form submissions
 * - 'pessimistic': Wait for server response before updating UI
 * - 'optimistic': Update UI immediately, rollback on error
 * - 'undoable': Update UI immediately, allow undo for a period
 */
export type MutationMode = 'pessimistic' | 'optimistic' | 'undoable'

/**
 * Sort order type
 */
export type SortOrder = 'ASC' | 'DESC'

/**
 * List controller result - the shape of data returned by useListContext
 */
export interface ListControllerResult<RecordType extends RaRecord = RaRecord> {
  /** The list data */
  data: RecordType[]
  /** Total number of records */
  total: number | undefined
  /** Current page number (1-indexed) */
  page: number
  /** Number of records per page */
  perPage: number
  /** Current sort configuration */
  sort: SortPayload
  /** Current filter values */
  filterValues: FilterPayload
  /** Which filters are displayed */
  displayedFilters: Record<string, boolean>
  /** Function to set filters */
  setFilters: (filters: FilterPayload, displayedFilters?: Record<string, boolean>) => void
  /** Function to set page */
  setPage: (page: number) => void
  /** Function to set perPage */
  setPerPage: (perPage: number) => void
  /** Function to set sort */
  setSort: (sort: SortPayload) => void
  /** Current resource name */
  resource: string
  /** Whether initial data is loading */
  isLoading: boolean
  /** Whether data is being fetched (including refetches) */
  isFetching: boolean
  /** Currently selected record IDs */
  selectedIds: Identifier[]
  /** Function to select records */
  onSelect: (ids: Identifier[]) => void
  /** Function to toggle a single record selection */
  onToggleItem: (id: Identifier) => void
  /** Function to clear selection */
  onUnselectItems: () => void
  /** Error if any */
  error?: Error | null
  /** Function to refetch data */
  refetch?: () => Promise<unknown>
  /** Page info for cursor-based pagination */
  pageInfo?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
  }
}

/**
 * Exporter function type for list exports
 */
export type Exporter<RecordType extends RaRecord = RaRecord> = (
  data: RecordType[],
  fetchRelatedRecords: FetchRelatedRecords,
  dataProvider: unknown,
  resource?: string
) => void | Promise<void>

/**
 * Function to fetch related records for export
 */
export type FetchRelatedRecords = <RecordType = unknown>(
  data: unknown[],
  field: string,
  resource: string
) => Promise<Record<Identifier, RecordType>>

/**
 * Callback for successful mutations
 */
export type OnSuccess = (
  response?: unknown,
  variables?: unknown,
  onMutateResult?: unknown,
  context?: unknown
) => void

/**
 * Callback for failed mutations
 */
export type OnError = (
  error?: Error | unknown,
  variables?: unknown,
  onMutateResult?: unknown,
  context?: unknown
) => void

/**
 * Transform data before mutation
 */
export type TransformData = (
  data: unknown,
  options?: { previousData: unknown }
) => unknown | Promise<unknown>

/**
 * Valid until timestamp for cache invalidation
 */
export type ValidUntil = Date

/**
 * Core layout component props
 */
export interface CoreLayoutProps {
  /** Child components to render */
  children: ReactNode
}

/**
 * Layout component type
 */
export type LayoutComponent = ComponentType<CoreLayoutProps>

/**
 * Loading component props
 */
export interface LoadingComponentProps {
  loadingPrimary?: string
  loadingSecondary?: string
}

/**
 * Loading component type
 */
export type LoadingComponent = ComponentType<LoadingComponentProps>

/**
 * Title component type
 */
export type TitleComponent = string | React.ReactElement

/**
 * Catch-all component type for 404 pages
 */
export type CatchAllComponent = ComponentType<{ title?: TitleComponent }>

/**
 * Login component type
 */
export type LoginComponent = ComponentType<Record<string, never>> | React.ReactElement

/**
 * Props injected into resource components
 */
export interface ResourceComponentInjectedProps {
  permissions?: unknown
  resource?: string
  options?: ResourceOptions
  hasList?: boolean
  hasEdit?: boolean
  hasShow?: boolean
  hasCreate?: boolean
}
