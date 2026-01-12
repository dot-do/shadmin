/**
 * EditButton Component
 * Opens the Edit view for the current record.
 */

import { forwardRef, type ReactNode, type AnchorHTMLAttributes } from 'react'
import { Link, type To, type LinkProps } from 'react-router-dom'
import { useCreatePath, useResourceContext, useRecordContext } from '../../facade'
import type { RaRecord } from '../../facade'
import { cn } from '../../utils'

/**
 * Common HTML anchor attributes that can be spread onto Link component.
 * Excludes href (use 'to' instead) and navigation-specific Link props,
 * but preserves className and other common HTML attributes.
 */
type LinkCompatibleProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>

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
 * Props for EditButton component
 */
export interface EditButtonProps<RecordType extends RaRecord = RaRecord>
  extends LinkCompatibleProps {
  /**
   * The record to edit
   * If not provided, uses the record from context
   */
  record?: RecordType
  /**
   * The resource to edit
   * If not provided, uses the resource from context
   */
  resource?: string
  /**
   * Button label
   * @default 'Edit'
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
 * Opens the Edit view for the current record.
 *
 * Reads the record and resource from the context.
 *
 * @example // basic usage
 * import { EditButton } from 'shadmin';
 *
 * const CommentEditButton = () => (
 *     <EditButton label="Edit comment" />
 * );
 */
export const EditButton = forwardRef<HTMLAnchorElement, EditButtonProps>(
  <RecordType extends RaRecord = RaRecord>(
    {
      record: recordProp,
      resource: resourceProp,
      label = 'Edit',
      icon,
      variant = 'default',
      size = 'default',
      scrollToTop = true,
      to: toProp,
      className,
      ...props
    }: EditButtonProps<RecordType>,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    const resourceContext = useResourceContext()
    const resource = resourceProp ?? resourceContext
    const recordContext = useRecordContext<RecordType>()
    const record = recordProp ?? recordContext
    const createPath = useCreatePath()

    if (!resource || !record) {
      return null
    }

    const to = toProp ?? createPath({ type: 'edit', resource, id: record.id })

    return (
      <Link
        ref={ref}
        to={to}
        data-testid="shadmin-edit-button"
        className={cn(
          buttonBaseStyles,
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        state={scrollToTop ? { _scrollToTop: true } : undefined}
        // Type assertion: LinkCompatibleProps includes event handlers that don't map 1:1 to LinkProps.
        // This is safe because Link accepts all standard anchor attributes.
        {...(props as Partial<LinkProps>)}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Link>
    )
  }
) as <RecordType extends RaRecord = RaRecord>(
  props: EditButtonProps<RecordType> & { ref?: React.Ref<HTMLAnchorElement> }
) => React.ReactElement | null

// Type assertion: forwardRef with generic constraints doesn't preserve displayName type.
// Using ComponentWithDisplayName provides type-safe displayName assignment.
;(EditButton as ComponentWithDisplayName<EditButtonProps>).displayName = 'EditButton'
