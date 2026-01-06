/**
 * Empty Component
 * Displays an empty state message with optional icon and action
 *
 * Features:
 * - Customizable icon
 * - Primary and secondary text
 * - Optional action button
 * - Multiple preset icons
 */

import * as React from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../Button'

/**
 * Empty component props
 */
export interface EmptyProps {
  /** Main message to display */
  message?: string
  /** Secondary description text */
  description?: string
  /** Icon type or custom icon component */
  icon?: 'inbox' | 'search' | 'file' | 'folder' | 'users' | React.ReactNode
  /** Action button text */
  actionLabel?: string
  /** Action button callback */
  onAction?: () => void
  /** Action button variant */
  actionVariant?: 'default' | 'outline' | 'secondary'
  /** Resource name for auto-generated message */
  resource?: string
  /** Additional CSS class */
  className?: string
  /** Children to render as custom content */
  children?: React.ReactNode
}

/**
 * Inbox icon
 */
function InboxIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

/**
 * Search icon
 */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

/**
 * File icon
 */
function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}

/**
 * Folder icon
 */
function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
}

/**
 * Users icon
 */
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

const iconComponents = {
  inbox: InboxIcon,
  search: SearchIcon,
  file: FileIcon,
  folder: FolderIcon,
  users: UsersIcon,
}

/**
 * Empty - A component for displaying empty states
 *
 * @example
 * ```tsx
 * // Simple empty state
 * <Empty message="No items found" />
 *
 * // With description and action
 * <Empty
 *   icon="inbox"
 *   message="No messages"
 *   description="You don't have any messages yet"
 *   actionLabel="Compose"
 *   onAction={() => navigate('/compose')}
 * />
 *
 * // With resource name
 * <Empty resource="users" />
 * ```
 */
export function Empty({
  message,
  description,
  icon = 'inbox',
  actionLabel,
  onAction,
  actionVariant = 'default',
  resource,
  className,
  children,
}: EmptyProps) {
  // Generate default message from resource name
  const displayMessage = message || (resource ? `No ${resource} found` : 'No data available')

  // Render icon
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon
    }

    const IconComponent = iconComponents[icon as keyof typeof iconComponents]
    if (IconComponent) {
      return <IconComponent className="h-16 w-16 text-muted-foreground/50" />
    }

    return <InboxIcon className="h-16 w-16 text-muted-foreground/50" />
  }

  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center',
        className
      )}
    >
      {renderIcon()}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">{displayMessage}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
      {actionLabel && onAction && (
        <Button
          variant={actionVariant}
          onClick={onAction}
          className="mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

Empty.displayName = 'Empty'
