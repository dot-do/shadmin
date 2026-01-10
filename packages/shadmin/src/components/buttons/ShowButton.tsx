/**
 * ShowButton Component
 * Opens the Show view for the current record.
 */

import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Link, type To } from 'react-router-dom'
import { useCreatePath, useResourceContext, useRecordContext, type RaRecord } from 'ra-core'
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
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
}

/**
 * Props for ShowButton component
 */
export interface ShowButtonProps<RecordType extends RaRecord = any>
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * The record to show
   * If not provided, uses the record from context
   */
  record?: RecordType
  /**
   * The resource to show
   * If not provided, uses the resource from context
   */
  resource?: string
  /**
   * Button label
   * @default 'Show'
   */
  label?: string
  /**
   * Icon to display before the label
   */
  icon?: ReactNode
  /**
   * Button variant
   * @default 'default'
   */
  variant?: keyof typeof buttonVariants
  /**
   * Button size
   * @default 'default'
   */
  size?: keyof typeof buttonSizes
  /**
   * Whether to scroll to top after navigation
   * @default true
   */
  scrollToTop?: boolean
  /**
   * Custom path to navigate to
   */
  to?: To
}

/**
 * Opens the Show view for the current record.
 *
 * Reads the record and resource from the context.
 *
 * @example // basic usage
 * import { ShowButton } from 'shadmin';
 *
 * const CommentShowButton = () => (
 *     <ShowButton label="View comment" />
 * );
 */
export const ShowButton = forwardRef<HTMLAnchorElement, ShowButtonProps>(
  <RecordType extends RaRecord = any>(
    {
      record: recordProp,
      resource: resourceProp,
      label = 'Show',
      icon,
      variant = 'default',
      size = 'default',
      scrollToTop = true,
      to: toProp,
      className,
      ...props
    }: ShowButtonProps<RecordType>,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    const resource = useResourceContext({ defaultValue: resourceProp })
    const recordContext = useRecordContext<RecordType>()
    const record = recordProp ?? recordContext
    const createPath = useCreatePath()

    if (!resource || !record) {
      return null
    }

    const to = toProp ?? createPath({ type: 'show', resource, id: record.id })

    return (
      <Link
        ref={ref}
        to={to}
        className={cn(
          buttonBaseStyles,
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        state={scrollToTop ? { _scrollToTop: true } : undefined}
        {...(props as any)}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Link>
    )
  }
) as <RecordType extends RaRecord = any>(
  props: ShowButtonProps<RecordType> & { ref?: React.Ref<HTMLAnchorElement> }
) => React.ReactElement | null

;(ShowButton as any).displayName = 'ShowButton'
