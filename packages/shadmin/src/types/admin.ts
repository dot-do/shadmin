/**
 * Admin component type definitions for Shadmin
 * 100% API-compatible with react-admin
 */

import type { ComponentType, ReactNode } from 'react'
import type { DataProvider } from './data-provider'
import type { AuthProvider } from './auth-provider'

export interface ThemeOptions {
  palette?: Record<string, unknown>
  typography?: Record<string, unknown>
  [key: string]: unknown
}

export interface LayoutProps {
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
  layout?: ComponentType<LayoutProps>
  /** Dashboard component (optional) */
  dashboard?: ComponentType
  /** Light theme options (optional) */
  theme?: ThemeOptions
  /** Dark theme options (optional) */
  darkTheme?: ThemeOptions
  /** Base path for routing (optional) */
  basename?: string
  /** Application title (optional) */
  title?: string
  /** Disable telemetry (optional) */
  disableTelemetry?: boolean
  /** Login page component (optional) */
  loginPage?: ComponentType | false
  /** Error page component (optional) */
  error?: ComponentType<ErrorProps>
  /** Loading indicator component (optional) */
  loading?: ComponentType
  /** Notification component (optional) */
  notification?: ComponentType
  /** Ready handler (optional) */
  ready?: ComponentType
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
