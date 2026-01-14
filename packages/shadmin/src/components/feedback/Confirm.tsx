/**
 * Confirm Component
 * A confirmation dialog for destructive or important actions
 *
 * Features:
 * - Modal dialog with backdrop
 * - Customizable title, message, and buttons
 * - Support for loading state during async operations
 * - Keyboard accessible (Escape to cancel)
 */

import * as React from 'react'
import { useCallback, useEffect, useRef } from 'react'

import { cn } from '../../lib/utils'
import { Button } from '../Button'

/**
 * Confirm component props
 */
export interface ConfirmProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog should close */
  onClose: () => void
  /** Callback when confirm is clicked */
  onConfirm: () => void | Promise<void>
  /** Dialog title */
  title?: string
  /** Dialog message/content */
  message?: string | React.ReactNode
  /** Confirm button label */
  confirmLabel?: string
  /** Cancel button label */
  cancelLabel?: string
  /** Confirm button variant */
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary'
  /** Loading state for async confirm operations */
  loading?: boolean
  /** Additional CSS class for the dialog */
  className?: string
  /** Children to render as custom content */
  children?: React.ReactNode
}

/**
 * Alert triangle icon
 */
function AlertTriangleIcon({ className }: { className?: string }) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

/**
 * X icon for close button
 */
function XIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

/**
 * Confirm - A confirmation dialog component
 *
 * @example
 * ```tsx
 * // Delete confirmation
 * <Confirm
 *   open={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   onConfirm={handleDelete}
 *   title="Delete item?"
 *   message="This action cannot be undone."
 *   confirmVariant="destructive"
 * />
 *
 * // Custom content
 * <Confirm
 *   open={open}
 *   onClose={onClose}
 *   onConfirm={onConfirm}
 *   title="Confirm action"
 * >
 *   <p>Custom content here</p>
 * </Confirm>
 * ```
 */
export function Confirm({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  loading = false,
  className,
  children,
}: ConfirmProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<Element | null>(null)

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose()
      }
    },
    [onClose, loading]
  )

  // Focus trap and keyboard handling
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement
      document.addEventListener('keydown', handleKeyDown)
      // Focus the dialog
      setTimeout(() => {
        dialogRef.current?.focus()
      }, 0)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus()
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleKeyDown])

  // Handle confirm click
  const handleConfirm = async () => {
    await onConfirm()
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      data-testid="shadmin-confirm-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          'relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <XIcon className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangleIcon className="h-12 w-12 text-amber-500" />
          <div className="space-y-2">
            <h2 id="confirm-title" className="text-lg font-semibold">
              {title}
            </h2>
            {children || (
              message && (
                <p id="confirm-message" className="text-sm text-muted-foreground">
                  {message}
                </p>
              )
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            data-testid="shadmin-confirm-cancel"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            loading={loading}
            data-testid="shadmin-confirm-submit"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

Confirm.displayName = 'Confirm'
