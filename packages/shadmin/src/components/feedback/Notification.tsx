/**
 * Notification Component
 * Toast notifications for user feedback
 *
 * Features:
 * - Multiple variants (success, error, warning, info)
 * - Auto-dismiss with configurable duration
 * - Manual dismiss option
 * - Undo action support
 * - Stacked notification support
 */

import { useEffect, useState, useCallback } from 'react'
import { cn } from '../../lib/utils'
import type { NotificationType } from '../../facade'

/**
 * Single notification toast props
 */
export interface NotificationToastProps {
  /** Unique identifier */
  id: string
  /** Notification message */
  message: string
  /** Notification type/variant */
  type?: NotificationType | undefined
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  autoHideDuration?: number | undefined
  /** Callback when dismissed */
  onDismiss?: ((id: string) => void) | undefined
  /** Whether the notification supports undo */
  undoable?: boolean | undefined
  /** Callback when undo is clicked */
  onUndo?: (() => void) | undefined
  /** Additional CSS class */
  className?: string | undefined
}

/**
 * X icon for close button
 */
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

/**
 * Check circle icon for success
 */
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}

/**
 * Alert circle icon for error
 */
function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

/**
 * Alert triangle icon for warning
 */
function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

/**
 * Info icon
 */
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

const variantStyles = {
  success: {
    container: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-800 dark:text-green-200',
  },
  error: {
    container: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-800 dark:text-red-200',
  },
  warning: {
    container: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950',
    icon: 'text-amber-600 dark:text-amber-400',
    text: 'text-amber-800 dark:text-amber-200',
  },
  info: {
    container: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-800 dark:text-blue-200',
  },
}

const iconComponents = {
  success: CheckCircleIcon,
  error: AlertCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
}

/**
 * NotificationToast - A single notification toast
 *
 * @example
 * ```tsx
 * <NotificationToast
 *   id="1"
 *   message="Item saved successfully"
 *   type="success"
 *   onDismiss={handleDismiss}
 * />
 * ```
 */
export function NotificationToast({
  id,
  message,
  type = 'info',
  autoHideDuration = 5000,
  onDismiss,
  undoable = false,
  onUndo,
  className,
}: NotificationToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    // Wait for exit animation before actual dismiss
    setTimeout(() => {
      onDismiss?.(id)
    }, 150)
  }, [id, onDismiss])

  const handleUndo = useCallback(() => {
    onUndo?.()
    handleDismiss()
  }, [onUndo, handleDismiss])

  // Auto-dismiss timer
  useEffect(() => {
    if (autoHideDuration > 0) {
      const timer = setTimeout(handleDismiss, autoHideDuration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [autoHideDuration, handleDismiss])

  const styles = variantStyles[type as keyof typeof variantStyles]
  const IconComponent = iconComponents[type as keyof typeof iconComponents]

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg',
        'animate-in slide-in-from-right-full',
        isExiting && 'animate-out fade-out-0 slide-out-to-right-full',
        styles.container,
        className
      )}
    >
      <IconComponent className={cn('mt-0.5 flex-shrink-0', styles.icon)} />
      <div className="flex-1">
        <p className={cn('text-sm font-medium', styles.text)}>{message}</p>
        {undoable && onUndo && (
          <button
            type="button"
            onClick={handleUndo}
            className={cn('mt-1 text-sm font-medium underline', styles.text)}
          >
            Undo
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className={cn(
          'flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10',
          styles.text
        )}
        aria-label="Dismiss notification"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

NotificationToast.displayName = 'NotificationToast'

/**
 * NotificationContainer props
 */
export interface NotificationContainerProps {
  /** Array of notifications to display */
  notifications: Array<{
    id: string
    message: string
    options?: {
      type?: NotificationType
      autoHideDuration?: number
      undoable?: boolean
      onUndo?: () => void
    }
  }>
  /** Callback to dismiss a notification */
  onDismiss: (id: string) => void
  /** Position of the notification container */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  /** Additional CSS class */
  className?: string
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
}

/**
 * NotificationContainer - Container for stacked notifications
 *
 * @example
 * ```tsx
 * const { notifications, dismiss } = useNotificationContext()
 *
 * <NotificationContainer
 *   notifications={notifications}
 *   onDismiss={dismiss}
 *   position="top-right"
 * />
 * ```
 */
export function NotificationContainer({
  notifications,
  onDismiss,
  position = 'top-right',
  className,
}: NotificationContainerProps) {
  if (notifications.length === 0) return null

  return (
    <div
      aria-label="Notifications"
      className={cn(
        'fixed z-50 flex flex-col gap-2 w-full max-w-sm',
        positionStyles[position],
        className
      )}
    >
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.options?.type}
          autoHideDuration={notification.options?.autoHideDuration}
          undoable={notification.options?.undoable}
          onUndo={notification.options?.onUndo}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}

NotificationContainer.displayName = 'NotificationContainer'
