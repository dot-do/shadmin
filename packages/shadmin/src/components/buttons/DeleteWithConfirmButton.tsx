/**
 * DeleteWithConfirmButton Component
 * Deletes the current record with a confirmation dialog.
 */

import { forwardRef, useState, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { useDelete, useRecordContext, useResourceContext, useRedirect, useRefresh } from '../../facade'
import type { RaRecord } from '../../facade'
import { cn } from '../../utils'
import { Confirm } from '../feedback/Confirm'

/**
 * Generic component type with displayName property.
 * Used for typing forwardRef components that need displayName assignment.
 */
interface ComponentWithDisplayName<P> extends React.FC<P> {
  displayName?: string
}

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
 * Props for DeleteWithConfirmButton component
 */
export interface DeleteWithConfirmButtonProps<RecordType extends RaRecord = RaRecord>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The record to delete
   * If not provided, uses the record from context
   */
  record?: RecordType
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
   * Where to redirect after deletion
   * @default 'list'
   */
  redirect?: string | false
  /**
   * Callback called after successful deletion
   * @param data - The deleted record (may be undefined depending on data provider)
   */
  onSuccess?: (data: RecordType | undefined) => void
  /**
   * Callback called on error
   * @param error - The error that occurred during deletion
   */
  onError?: (error: unknown) => void
  /**
   * Additional mutation options passed to the delete mutation
   * Note: onSuccess and onError from mutationOptions are not used - use the component props instead
   */
  mutationOptions?: Omit<Record<string, unknown>, 'onSuccess' | 'onError'>
}

/**
 * Deletes the current record with a confirmation dialog.
 *
 * @example // basic usage
 * import { DeleteWithConfirmButton } from 'shadmin';
 *
 * const PostActions = ({ record }) => (
 *     <DeleteWithConfirmButton record={record} />
 * );
 */
export const DeleteWithConfirmButton = forwardRef<HTMLButtonElement, DeleteWithConfirmButtonProps>(
  <RecordType extends RaRecord = RaRecord>(
    {
      record: recordProp,
      resource: resourceProp,
      label = 'Delete',
      icon,
      variant = 'destructive',
      size = 'default',
      confirmTitle = 'Delete this item?',
      confirmContent = 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmColor = 'warning',
      redirect: redirectTo = 'list',
      onSuccess,
      onError,
      mutationOptions,
      className,
      disabled,
      onClick,
      ...props
    }: DeleteWithConfirmButtonProps<RecordType>,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const resourceContext = useResourceContext()
    const resource = resourceProp ?? resourceContext
    const recordContext = useRecordContext<RecordType>()
    const record = recordProp ?? recordContext
    const redirect = useRedirect()
    const refresh = useRefresh()
    const [deleteOne, { isPending }] = useDelete()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      setIsOpen(true)
    }

    const handleConfirm = async () => {
      if (!resource || !record) {
        setIsOpen(false)
        return
      }

      deleteOne(
        resource,
        { id: record.id, previousData: record },
        {
          mutationMode: 'pessimistic',
          onSuccess: (data: RecordType | undefined) => {
            onSuccess?.(data)
            if (redirectTo) {
              redirect(redirectTo, resource)
            } else {
              refresh()
            }
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

    if (!record) {
      return null
    }

    return (
      <>
        <button
          ref={ref}
          type="button"
          disabled={disabled || isPending}
          data-testid="shadmin-delete-button"
          className={cn(
            'ra-delete-button',
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
          title={typeof confirmTitle === 'string' ? confirmTitle : 'Delete this item?'}
          message={confirmContent}
          loading={isPending}
          confirmVariant={confirmColor === 'warning' ? 'destructive' : 'default'}
        />
      </>
    )
  }
) as <RecordType extends RaRecord = RaRecord>(
  props: DeleteWithConfirmButtonProps<RecordType> & { ref?: React.Ref<HTMLButtonElement> }
) => React.ReactElement | null

// Type assertion: forwardRef with generic constraints doesn't preserve displayName type.
// Using ComponentWithDisplayName provides type-safe displayName assignment.
;(DeleteWithConfirmButton as ComponentWithDisplayName<DeleteWithConfirmButtonProps>).displayName = 'DeleteWithConfirmButton'
