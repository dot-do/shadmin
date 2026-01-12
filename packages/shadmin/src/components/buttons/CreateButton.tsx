/**
 * CreateButton Component
 * Opens the Create view for the current resource.
 */

import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Link, type To, type LinkProps } from 'react-router-dom'
import { useCreatePath, useResourceContext } from 'ra-core'
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
 * Props for CreateButton component
 */
export interface CreateButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * The resource to create
   * If not provided, uses the resource from context
   */
  resource?: string
  /**
   * Button label
   * @default 'Create'
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
 * Opens the Create view for the current resource.
 *
 * Reads the resource from the context if not provided.
 *
 * @example // basic usage
 * import { CreateButton } from 'shadmin';
 *
 * const PostActions = () => (
 *     <CreateButton />
 * );
 *
 * @example // with custom label
 * <CreateButton label="Add Post" resource="posts" />
 */
export const CreateButton = forwardRef<HTMLAnchorElement, CreateButtonProps>(
  (
    {
      resource: resourceProp,
      label = 'Create',
      icon,
      variant = 'default',
      size = 'default',
      scrollToTop = true,
      to: toProp,
      className,
      ...props
    },
    ref
  ) => {
    const resourceContext = useResourceContext()
    const resource = resourceProp ?? resourceContext
    const createPath = useCreatePath()

    if (!resource) {
      return null
    }

    const to = toProp ?? createPath({ type: 'create', resource })

    return (
      <Link
        ref={ref}
        to={to}
        data-testid="shadmin-create-button"
        className={cn(
          buttonBaseStyles,
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        state={scrollToTop ? { _scrollToTop: true } : undefined}
        // Type assertion: ButtonHTMLAttributes includes properties that don't map 1:1 to LinkProps.
        // This is safe because Link accepts all standard anchor attributes.
        {...(props as Partial<LinkProps>)}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Link>
    )
  }
)

CreateButton.displayName = 'CreateButton'
