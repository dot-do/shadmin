/**
 * Admin component type definitions for Shadmin
 * 100% API-compatible with react-admin
 */

import type { ComponentType, ReactNode, ReactElement } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import type { DataProvider } from './data-provider'
import type { AuthProvider } from 'ra-core'
import type { I18nProvider } from '../contexts'

/**
 * Plugin interface for extending Admin functionality
 */
export interface AdminPlugin {
  name: string
  install: (context: AdminPluginContext) => void | (() => void)
}

/**
 * Context passed to plugin install function
 */
export interface AdminPluginContext {
  dataProvider: DataProvider
  addResource: (resource: { name: string; list?: ComponentType; edit?: ComponentType; create?: ComponentType; show?: ComponentType }) => void
  addMenuItem: (item: { name: string; path: string; icon?: ReactNode }) => void
  wrapDataProvider: (wrapper: (dp: DataProvider) => DataProvider) => void
  onUnmount: (cleanup: () => void) => void
}

export interface ThemeOptions {
  palette?: Record<string, unknown>
  typography?: Record<string, unknown>
  [key: string]: unknown
}

/**
 * Simplified layout props interface for Admin component
 * The full LayoutProps is exported from components/layout/Layout.tsx
 */
export interface AdminLayoutProps {
  children: ReactNode
  dashboard?: ComponentType | undefined
  menu?: ComponentType | undefined
}

/**
 * Admin component props
 */
export interface AdminProps {
  /** Child Resource components */
  children?: ReactNode | undefined
  /** DataProvider for API calls */
  dataProvider?: DataProvider | undefined
  /** AuthProvider for authentication (optional) */
  authProvider?: AuthProvider | undefined
  /** I18nProvider for internationalization (optional) */
  i18nProvider?: I18nProvider | undefined
  /** Custom QueryClient instance (optional) */
  queryClient?: QueryClient | undefined
  /** Application title (optional) */
  title?: string | undefined
  /** Custom layout component (optional) */
  layout?: ComponentType<{ children: ReactNode }> | ReactElement | undefined
  /** Dashboard component (optional) */
  dashboard?: ComponentType | undefined
  /** Light theme options (optional) */
  theme?: ThemeOptions | undefined
  /** Dark theme options (optional) */
  darkTheme?: ThemeOptions | undefined
  /** Base path for routing (optional) */
  basename?: string | undefined
  /** Error page component (optional) */
  error?: ComponentType<ErrorProps> | undefined
  /** Plugins to extend Admin functionality */
  plugins?: AdminPlugin[] | undefined
}

export interface ErrorProps {
  error: Error
  errorInfo?: React.ErrorInfo | undefined
  resetErrorBoundary?: () => void | undefined
}

/**
 * Notification types
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationPayload {
  message: string
  type?: NotificationType
  autoHideDuration?: number
  multiLine?: boolean
  undoable?: boolean
}
