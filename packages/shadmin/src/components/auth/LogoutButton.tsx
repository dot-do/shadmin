/**
 * LogoutButton Component
 * A button component for logging out users with optional confirmation dialog
 */

import { useState, useCallback, type ReactNode } from 'react'
import { useLogout } from '../../hooks/useLogout'
import { cn } from '../../utils'

/**
 * Props for LogoutButton component
 */
export interface LogoutButtonProps {
  /**
   * Button label text
   * @default "Logout"
   */
  label?: string
  /**
   * Loading state label text
   * @default "Logging out..."
   */
  loadingLabel?: string
  /**
   * Custom class name for the button
   */
  className?: string
  /**
   * Icon element to display
   */
  icon?: ReactNode
  /**
   * Show only the icon (no label)
   */
  iconOnly?: boolean
  /**
   * Where to redirect after logout. Set to false to disable redirect
   * @default "/login"
   */
  redirectTo?: string | false
  /**
   * Button variant style
   * @default "default"
   */
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  /**
   * Button size
   * @default "default"
   */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /**
   * Confirmation dialog title. If provided, shows confirmation before logout
   */
  confirmTitle?: string
  /**
   * Confirmation dialog message
   */
  confirmMessage?: string
  /**
   * Callback called on successful logout
   */
  onSuccess?: () => void
  /**
   * Callback called on logout error
   */
  onError?: (error: Error) => void
}

/**
 * Button base styling based on ShadCN Button component patterns.
 */
const buttonBaseStyles = cn(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium',
  'ring-offset-background transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50'
)

/**
 * Button variant styles
 */
const variantStyles = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
}

/**
 * Button size styles
 */
const sizeStyles = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
}

/**
 * Dialog overlay styles
 */
const dialogOverlayStyles = cn(
  'fixed inset-0 z-50 bg-black/80',
  'data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
)

/**
 * Dialog content styles
 */
const dialogContentStyles = cn(
  'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4',
  'border bg-background p-6 shadow-lg duration-200',
  'data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
  'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
  'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
  'sm:rounded-lg'
)

/**
 * LogoutButton component for user sign-out.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LogoutButton />
 *
 * // With custom label
 * <LogoutButton label="Sign Out" />
 *
 * // With icon
 * <LogoutButton icon={<LogOutIcon />} />
 *
 * // With confirmation dialog
 * <LogoutButton
 *   confirmTitle="Confirm Logout"
 *   confirmMessage="Are you sure you want to logout?"
 * />
 *
 * // Icon-only button
 * <LogoutButton icon={<LogOutIcon />} iconOnly />
 * ```
 */
export function LogoutButton({
  label = 'Logout',
  loadingLabel = 'Logging out...',
  className,
  icon,
  iconOnly = false,
  redirectTo,
  variant = 'default',
  size = 'default',
  confirmTitle,
  confirmMessage,
  onSuccess,
  onError,
}: LogoutButtonProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const { logout, isLoading } = useLogout({
    onSuccess,
    onError,
  })

  const handleClick = useCallback(() => {
    if (confirmTitle) {
      setShowConfirmDialog(true)
    } else {
      void performLogout()
    }
  }, [confirmTitle])

  const performLogout = useCallback(async () => {
    try {
      await logout({ redirectTo })
    } catch {
      // Error is handled by useLogout hook and callbacks
    }
  }, [logout, redirectTo])

  const handleConfirm = useCallback(() => {
    setShowConfirmDialog(false)
    void performLogout()
  }, [performLogout])

  const handleCancel = useCallback(() => {
    setShowConfirmDialog(false)
  }, [])

  const buttonStyles = cn(
    'logout',
    buttonBaseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  )

  const displayLabel = isLoading ? loadingLabel : label
  const ariaLabel = iconOnly ? displayLabel : undefined

  return (
    <>
      <button
        type="button"
        className={buttonStyles}
        onClick={handleClick}
        disabled={isLoading}
        aria-label={ariaLabel}
        data-testid="logout-button"
      >
        {icon}
        {!iconOnly && displayLabel}
      </button>

      {showConfirmDialog && (
        <div className="fixed inset-0 z-50" data-testid="logout-dialog">
          <div
            className={dialogOverlayStyles}
            onClick={handleCancel}
            data-state="open"
            data-testid="logout-dialog-overlay"
          />
          <div
            className={dialogContentStyles}
            data-state="open"
            role="dialog"
            data-testid="logout-dialog-content"
          >
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-lg font-semibold" data-testid="logout-dialog-title">
                {confirmTitle}
              </h2>
              {confirmMessage && (
                <p
                  className="text-sm text-muted-foreground"
                  data-testid="logout-dialog-message"
                >
                  {confirmMessage}
                </p>
              )}
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <button
                type="button"
                className={cn(buttonBaseStyles, variantStyles.outline, sizeStyles.default)}
                onClick={handleCancel}
                data-testid="logout-dialog-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                className={cn(buttonBaseStyles, variantStyles.destructive, sizeStyles.default)}
                onClick={handleConfirm}
                data-testid="logout-dialog-confirm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

LogoutButton.displayName = 'LogoutButton'
