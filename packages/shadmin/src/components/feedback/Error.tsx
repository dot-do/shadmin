/**
 * Error Component
 * Displays error messages with optional retry functionality
 *
 * Features:
 * - Error icon with message
 * - Optional retry button
 * - Support for Error objects or string messages
 * - Custom action buttons
 */

import * as React from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../Button'

/**
 * Error component props
 */
export interface ErrorProps {
  /** Error object or message string */
  error?: Error | string
  /** Custom title for the error */
  title?: string
  /** Callback when retry button is clicked */
  onRetry?: () => void
  /** Label for the retry button */
  retryLabel?: string
  /** Reset the error boundary */
  resetErrorBoundary?: () => void
  /** Additional CSS class */
  className?: string
  /** Children to render instead of default message */
  children?: React.ReactNode
  /** Hide the error icon */
  hideIcon?: boolean
}

/**
 * Alert circle icon component
 */
function AlertCircleIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

/**
 * Refresh icon component
 */
function RefreshIcon({ className }: { className?: string }) {
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
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  )
}

/**
 * Error - A component for displaying error states
 *
 * @example
 * ```tsx
 * // Simple error message
 * <Error error="Something went wrong" />
 *
 * // With retry button
 * <Error
 *   error={new Error('Failed to load data')}
 *   onRetry={() => refetch()}
 * />
 *
 * // Custom title
 * <Error
 *   title="Unable to save"
 *   error="Network connection lost"
 *   onRetry={handleRetry}
 * />
 * ```
 */
export function Error({
  error,
  title = 'An error occurred',
  onRetry,
  retryLabel = 'Try again',
  resetErrorBoundary,
  className,
  children,
  hideIcon = false,
}: ErrorProps) {
  const errorMessage = error instanceof Error ? error.message : error

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary()
    }
    if (onRetry) {
      onRetry()
    }
  }

  const showRetryButton = onRetry || resetErrorBoundary

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center',
        className
      )}
    >
      {!hideIcon && (
        <AlertCircleIcon className="h-12 w-12 text-destructive" />
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-destructive">{title}</h3>
        {children || (
          errorMessage && (
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          )
        )}
      </div>
      {showRetryButton && (
        <Button
          variant="outline"
          onClick={handleRetry}
          className="mt-2"
        >
          <RefreshIcon className="mr-2 h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

Error.displayName = 'Error'
