/**
 * CloneButton Component
 * Opens the Create view with the current record data pre-filled.
 */

import { forwardRef, type ReactNode, type AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

import { useCreatePath, useResourceContext, useRecordContext } from '../../facade'
import { cn } from '../../utils'

import type { RaRecord } from '../../facade'

/**
 * Common HTML anchor attributes that can be spread onto Link component.
 * Excludes href (use 'to' instead) and navigation-specific Link props,
 * but preserves className and other common HTML attributes.
 */
type LinkCompatibleProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>

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
 * Props for CloneButton component
 */
export interface CloneButtonProps<RecordType extends RaRecord = RaRecord>
  extends LinkCompatibleProps {
  /**
   * The record to clone or partial record with initial values.
   * Can be a full record from context (with id) or just initial field values (without id).
   * If not provided, uses the record from context.
   */
  record?: RecordType | Record<string, unknown>
  /**
   * The resource to create
   * If not provided, uses the resource from context
   */
  resource?: string
  /**
   * Button label
   * @default 'Clone'
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
}

/**
 * Opens the Create view with the current record data pre-filled.
 *
 * Reads the record and resource from the context.
 *
 * @example // basic usage
 * import { CloneButton } from 'shadmin';
 *
 * const PostCloneButton = () => (
 *     <CloneButton label="Duplicate" />
 * );
 */
export const CloneButton = forwardRef<HTMLAnchorElement, CloneButtonProps>(
  <RecordType extends RaRecord = RaRecord>(
    {
      record: recordProp,
      resource: resourceProp,
      label = 'Clone',
      icon,
      variant = 'default',
      size = 'default',
      scrollToTop = true,
      className,
      ...props
    }: CloneButtonProps<RecordType>,
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

    const to = createPath({ type: 'create', resource })

    // Clone the record without the id
    const { id, ...recordWithoutId } = record

    return (
      <Link
        ref={ref}
        to={to}
        data-testid="shadmin-clone-button"
        className={cn(
          'button-clone',
          buttonBaseStyles,
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        state={{
          record: recordWithoutId,
          ...(scrollToTop ? { _scrollToTop: true } : {}),
        }}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Link>
    )
  }
) as <RecordType extends RaRecord = RaRecord>(
  props: CloneButtonProps<RecordType> & { ref?: React.Ref<HTMLAnchorElement> }
) => React.ReactElement | null

// displayName set via Object.defineProperty to preserve type safety with generic forwardRef
Object.defineProperty(CloneButton, 'displayName', { value: 'CloneButton' })
