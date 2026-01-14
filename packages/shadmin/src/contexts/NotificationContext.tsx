import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'

import type { NotificationType } from '../types'

// Re-export NotificationType from types for backward compatibility
export type { NotificationType } from '../types'

/**
 * Options for notifications
 */
export interface NotificationOptions {
  /** Type of notification */
  type?: NotificationType
  /** Duration in milliseconds before auto-hide (0 = never auto-hide) */
  autoHideDuration?: number
  /** Whether the notification can be undone */
  undoable?: boolean
  /** Callback when undo is clicked */
  onUndo?: () => void
  /** Additional data to pass with the notification */
  messageArgs?: Record<string, unknown>
  /** Multi-line mode */
  multiLine?: boolean
}

/**
 * A single notification item
 */
export interface Notification {
  /** Unique identifier */
  id: string
  /** The notification message */
  message: string
  /** Notification options */
  options?: NotificationOptions
}

/**
 * Notification context value
 */
export interface NotificationContextValue {
  /** Current notifications */
  notifications: Notification[]
  /** Dismiss a notification by id */
  dismiss: (id: string) => void
  /** Dismiss all notifications */
  dismissAll: () => void
  /** Add a notification (internal use, prefer useNotify) */
  addNotification: (notification: Notification) => void
}

/**
 * Notify function signature (matches react-admin)
 */
export type NotifyFunction = (
  message: string,
  options?: NotificationOptions
) => void

/**
 * Context for notification system
 */
export const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
)

NotificationContext.displayName = 'NotificationContext'

/**
 * Generate a unique ID for notifications
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Props for NotificationContextProvider
 */
export interface NotificationContextProviderProps {
  children: ReactNode
}

/**
 * Provider component for NotificationContext.
 * Manages notification state and provides methods to add/dismiss notifications.
 *
 * @example
 * ```tsx
 * <NotificationContextProvider>
 *   <App />
 * </NotificationContextProvider>
 * ```
 */
export function NotificationContextProvider({
  children,
}: NotificationContextProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  // Track auto-hide timeouts by notification id
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [...prev, notification])
  }, [])

  const dismiss = useCallback((id: string) => {
    // Clear the timeout for this notification if it exists
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    // Clear all pending timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    timeoutsRef.current.clear()
    setNotifications([])
  }, [])

  // Set up auto-hide timeouts for notifications
  useEffect(() => {
    notifications.forEach((notification) => {
      const { autoHideDuration } = notification.options || {}

      // Only set timeout if autoHideDuration is a positive number
      // and we haven't already set a timeout for this notification
      if (
        autoHideDuration &&
        autoHideDuration > 0 &&
        !timeoutsRef.current.has(notification.id)
      ) {
        const timeout = setTimeout(() => {
          dismiss(notification.id)
        }, autoHideDuration)
        timeoutsRef.current.set(notification.id, timeout)
      }
    })
  }, [notifications, dismiss])

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current.clear()
    }
  }, [])

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      dismiss,
      dismissAll,
      addNotification,
    }),
    [notifications, dismiss, dismissAll, addNotification]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

/**
 * Hook to access the full notification context.
 * Throws an error if used outside of NotificationContextProvider.
 *
 * @example
 * ```tsx
 * const { notifications, dismiss, dismissAll } = useNotificationContext()
 * ```
 */
export function useNotificationContext(): NotificationContextValue {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be used inside a NotificationContextProvider'
    )
  }
  return context
}

/**
 * Hook to show notifications.
 * This is the primary hook for displaying notifications (matches react-admin API).
 *
 * @example
 * ```tsx
 * const notify = useNotify()
 *
 * // Simple notification
 * notify('Record saved')
 *
 * // With options
 * notify('Record saved', { type: 'success' })
 * notify('Error occurred', { type: 'error' })
 * notify('Item deleted', { type: 'info', undoable: true, onUndo: handleUndo })
 * ```
 */
export function useNotify(): NotifyFunction {
  const context = useContext(NotificationContext)

  if (context === undefined) {
    throw new Error('useNotify must be used inside a NotificationContextProvider')
  }

  const { addNotification } = context

  return useCallback<NotifyFunction>(
    (message, options) => {
      const notification: Notification = {
        id: generateId(),
        message,
        options: {
          type: 'info',
          ...options,
        },
      }
      addNotification(notification)
    },
    [addNotification]
  )
}
