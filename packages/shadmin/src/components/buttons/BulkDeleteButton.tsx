/**
 * BulkDeleteButton Component
 * Deletes the selected rows.
 */

import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { useDeleteMany, useListContext, useResourceContext, useRefresh, useUnselectAll } from 'ra-core'
import type { MutationMode, Identifier } from '../../facade'
import { cn } from '../../utils'

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
 * Props for BulkDeleteButton component
 */
export interface BulkDeleteButtonProps
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
   * Mutation mode (pessimistic, optimistic, undoable)
   * @default 'undoable'
   */
  mutationMode?: MutationMode
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
 * Deletes the selected rows.
 *
 * To be used inside the <Datagrid bulkActionButtons> prop.
 *
 * @example // basic usage
 * import { BulkDeleteButton, BulkExportButton, List, Datagrid } from 'shadmin';
 *
 * const PostBulkActionButtons = () => (
 *     <>
 *         <BulkExportButton />
 *         <BulkDeleteButton />
 *     </>
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
export const BulkDeleteButton = forwardRef<HTMLButtonElement, BulkDeleteButtonProps>(
  (
    {
      resource: resourceProp,
      label = 'Delete',
      icon,
      variant = 'destructive',
      size = 'default',
      mutationMode = 'undoable',
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
    const resourceContext = useResourceContext()
    const resource = resourceProp ?? resourceContext
    const { selectedIds } = useListContext()
    const refresh = useRefresh()
    const unselectAll = useUnselectAll(resource)
    const [deleteMany, { isPending }] = useDeleteMany()

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)

      if (!resource || !selectedIds || selectedIds.length === 0) {
        return
      }

      deleteMany(
        resource,
        { ids: selectedIds },
        {
          mutationMode,
          onSuccess: (data: Identifier[] | undefined) => {
            unselectAll()
            onSuccess?.(data)
            if (mutationMode !== 'undoable') {
              refresh()
            }
          },
          ...(onError && { onError }),
          ...mutationOptions,
        }
      )
    }

    const hasSelection = selectedIds && selectedIds.length > 0

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || isPending || !hasSelection}
        data-testid="shadmin-bulk-delete-button"
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
    )
  }
)

BulkDeleteButton.displayName = 'BulkDeleteButton'
