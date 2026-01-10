/**
 * Admin component type definitions for Shadmin
 * 100% API-compatible with react-admin
 */

import type { ComponentType, ReactNode } from 'react'
import type { DataProvider } from './data-provider'
import type { AuthProvider } from './auth-provider'

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
  dashboard?: ComponentType
  menu?: ComponentType
}

/**
 * Admin component props
 */
export interface AdminProps {
  /** Child Resource components */
  children?: ReactNode
  /** DataProvider for API calls */
  dataProvider: DataProvider
  /** AuthProvider for authentication (optional) */
  authProvider?: AuthProvider
  /** Custom layout component (optional) */
  layout?: ComponentType<AdminLayoutProps>
  /** Dashboard component (optional) */
  dashboard?: ComponentType
  /** Light theme options (optional) */
  theme?: ThemeOptions
  /** Dark theme options (optional) */
  darkTheme?: ThemeOptions
  /** Base path for routing (optional) */
  basename?: string
  /** Error page component (optional) */
  error?: ComponentType<ErrorProps>
  /** Plugins to extend Admin functionality */
  plugins?: AdminPlugin[]
}

export interface ErrorProps {
  error: Error
  errorInfo?: React.ErrorInfo
  resetErrorBoundary?: () => void
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
