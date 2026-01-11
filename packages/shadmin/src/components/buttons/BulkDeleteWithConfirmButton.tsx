/**
 * BulkDeleteWithConfirmButton Component
 * Deletes the selected rows with a confirmation dialog.
 */

import { forwardRef, useState, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { useDeleteMany, useListContext, useResourceContext, useRefresh, useUnselectAll } from 'ra-core'
import type { Identifier } from '../../facade'
import { cn } from '../../utils'
import { Confirm } from '../feedback/Confirm'

const buttonBaseStyles = cn(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium',
  'ring-offset-background transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50'
)

const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  small: 'h-9 rounded-md px-3', // alias for 'sm' (react-admin compatibility)
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
}

/**
 * Props for BulkDeleteWithConfirmButton component
 */
export interface BulkDeleteWithConfirmButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The resource to delete from
   * If not provided, uses the resource from context
   */
  resource?: string
  /**
   * Button label
   * @default 'Delete'
   */
  label?: string
  /**
   * Icon to display before the label
   */
  icon?: ReactNode
  /**
   * Button variant
   * @default 'destructive'
   */
  variant?: keyof typeof buttonVariants
  /**
   * Button size
   * @default 'default'
   */
  size?: keyof typeof buttonSizes
  /**
   * Confirmation dialog title
   */
  confirmTitle?: ReactNode
  /**
   * Confirmation dialog content
   */
  confirmContent?: ReactNode
  /**
   * Confirmation dialog color
   * @default 'warning'
   */
  confirmColor?: 'primary' | 'warning'
  /**
   * Callback called after successful deletion
   * @param data - Array of deleted record IDs (may be undefined depending on data provider)
   */
  onSuccess?: (data: Identifier[] | undefined) => void
  /**
   * Callback called on error
   * @param error - The error that occurred during deletion
   */
  onError?: (error: unknown) => void
  /**
   * Additional mutation options passed to the deleteMany mutation
   * Note: onSuccess and onError from mutationOptions are not used - use the component props instead
   */
  mutationOptions?: Omit<Record<string, unknown>, 'onSuccess' | 'onError'>
}

/**
 * Deletes the selected rows with a confirmation dialog.
 *
 * To be used inside the <Datagrid bulkActionButtons> prop.
 *
 * @example // basic usage
 * import { BulkDeleteWithConfirmButton, List, Datagrid } from 'shadmin';
 *
 * const PostBulkActionButtons = () => (
 *     <BulkDeleteWithConfirmButton />
 * );
 *
 * export const PostList = () => (
 *     <List>
 *        <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
 *             ...
 *       </Datagrid>
 *     </List>
 * );
 */
export const BulkDeleteWithConfirmButton = forwardRef<HTMLButtonElement, BulkDeleteWithConfirmButtonProps>(
  (
    {
      resource: resourceProp,
      label = 'Delete',
      icon,
      variant = 'destructive',
      size = 'default',
      confirmTitle = 'Delete selected items?',
      confirmContent = 'Are you sure you want to delete the selected items? This action cannot be undone.',
      confirmColor = 'warning',
      onSuccess,
      onError,
      mutationOptions,
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const resourceContext = useResourceContext()
    const resource = resourceProp ?? resourceContext
    const { selectedIds } = useListContext()
    const refresh = useRefresh()
    const unselectAll = useUnselectAll(resource)
    const [deleteMany, { isPending }] = useDeleteMany()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      setIsOpen(true)
    }

    const handleConfirm = async () => {
      if (!resource || !selectedIds || selectedIds.length === 0) {
        setIsOpen(false)
        return
      }

      deleteMany(
        resource,
        { ids: selectedIds },
        {
          mutationMode: 'pessimistic',
          onSuccess: (data: Identifier[] | undefined) => {
            unselectAll()
            onSuccess?.(data)
            refresh()
            setIsOpen(false)
          },
          onError: (error: unknown) => {
            onError?.(error)
            setIsOpen(false)
          },
          ...mutationOptions,
        }
      )
    }

    const handleClose = () => {
      setIsOpen(false)
    }

    const hasSelection = selectedIds && selectedIds.length > 0

    return (
      <>
        <button
          ref={ref}
          type="button"
          disabled={disabled || isPending || !hasSelection}
          className={cn(
            buttonBaseStyles,
            buttonVariants[variant],
            buttonSizes[size],
            className
          )}
          onClick={handleClick}
          {...props}
        >
          {isPending ? (
            <span
              className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              data-testid="loading-spinner"
            />
          ) : icon ? (
            <span className="mr-2">{icon}</span>
          ) : null}
          {label}
        </button>
        <Confirm
          open={isOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={typeof confirmTitle === 'string' ? confirmTitle : 'Delete selected items?'}
          message={confirmContent}
          loading={isPending}
          confirmVariant={confirmColor === 'warning' ? 'destructive' : 'default'}
        />
      </>
    )
  }
)

BulkDeleteWithConfirmButton.displayName = 'BulkDeleteWithConfirmButton'
