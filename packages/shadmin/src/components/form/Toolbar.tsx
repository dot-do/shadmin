/**
 * Toolbar Component and related button components
 * Provides form action buttons with integration to form state.
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

import { useShadminFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

// Button variants matching ShadCN patterns
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

// Valid variant types including 'text' as an alias for 'link'
export type ButtonVariant = keyof typeof buttonVariants | 'text'

// Resolve variant aliases (e.g., 'text' -> 'link')
function resolveVariant(variant: ButtonVariant): keyof typeof buttonVariants {
  if (variant === 'text') return 'link'
  return variant
}

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
}

/**
 * Props for Toolbar component
 */
export interface ToolbarProps {
  /**
   * Toolbar children (typically SaveButton, DeleteButton, etc.)
   * If not provided, renders a default SaveButton
   */
  children?: ReactNode
  /**
   * Additional CSS classes for the toolbar container
   */
  className?: string
  /**
   * Whether the form is currently saving (passed to default SaveButton)
   */
  saving?: boolean
  /**
   * Whether the submit button should be disabled (passed to default SaveButton)
   */
  disabled?: boolean
  /**
   * Data attributes and other HTML attributes
   */
  'data-testid'?: string
}

/**
 * Toolbar component for form action buttons.
 * Renders children or a default SaveButton if no children provided.
 *
 * @example
 * ```tsx
 * // Default toolbar with save button
 * <SimpleForm onSubmit={handleSubmit}>
 *   <TextInput source="name" />
 *   <Toolbar />
 * </SimpleForm>
 *
 * // Custom toolbar
 * <SimpleForm onSubmit={handleSubmit}>
 *   <TextInput source="name" />
 *   <Toolbar>
 *     <SaveButton label="Submit" />
 *     <DeleteButton onDelete={handleDelete} />
 *   </Toolbar>
 * </SimpleForm>
 * ```
 */
export function Toolbar({
  children,
  className,
  saving,
  disabled,
  'data-testid': testId,
}: ToolbarProps): ReactElement {
  return (
    <div
      role="toolbar"
      className={cn('flex items-center gap-2 pt-4', className)}
      data-testid={testId ?? 'shadmin-form-toolbar'}
    >
      {children ?? <SaveButton saving={saving} disabled={disabled} />}
    </div>
  )
}

Toolbar.displayName = 'Toolbar'

/**
 * Props for SaveButton component
 */
export interface SaveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button label
   * @default 'Save'
   */
  label?: string
  /**
   * Whether the form is currently saving
   * If not provided, uses the saving state from form context
   */
  saving?: boolean | undefined
  /**
   * Icon to display before the label
   */
  icon?: ReactNode
  /**
   * Button variant. 'text' is an alias for 'link'.
   * @default 'default'
   */
  variant?: ButtonVariant
  /**
   * Button size
   * @default 'default'
   */
  size?: keyof typeof buttonSizes
  /**
   * Button type attribute
   * @default 'submit'
   */
  type?: 'button' | 'submit' | undefined
  /**
   * Mutation options for form submission callbacks
   */
  mutationOptions?: {
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
  } | undefined
  /**
   * Transform function to modify form data before submission
   */
  transform?: ((data: any) => any) | undefined
  /**
   * Style extension prop (for compatibility with MUI-style APIs)
   */
  sx?: unknown | undefined
}

/**
 * SaveButton component for form submission.
 * Shows loading state during submission and integrates with form context.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Toolbar>
 *   <SaveButton />
 * </Toolbar>
 *
 * // Custom label and icon
 * <Toolbar>
 *   <SaveButton label="Submit Form" icon={<CheckIcon />} />
 * </Toolbar>
 * ```
 */
export const SaveButton = forwardRef<HTMLButtonElement, SaveButtonProps>(
  (
    {
      label = 'Save',
      saving: savingProp,
      icon,
      variant = 'default',
      size = 'default',
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const { formState } = useFormContext()
    const { saving: contextSaving } = useShadminFormContext()

    const isSubmitting = savingProp ?? contextSaving ?? formState.isSubmitting

    return (
      <button
        ref={ref}
        type="submit"
        disabled={disabled || isSubmitting}
        data-testid="shadmin-form-submit"
        className={cn(
          buttonBaseStyles,
          buttonVariants[resolveVariant(variant)],
          buttonSizes[size],
          className
        )}
        {...props}
      >
        {isSubmitting ? (
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

SaveButton.displayName = 'SaveButton'

/**
 * Props for DeleteButton component
 */
export interface DeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button label
   * @default 'Delete'
   */
  label?: string
  /**
   * Handler called when delete is confirmed
   */
  onDelete: () => void | Promise<void>
  /**
   * Whether to show confirmation dialog
   * @default true
   */
  confirmDelete?: boolean
  /**
   * Custom confirmation message
   * @default 'Are you sure you want to delete this item?'
   */
  confirmMessage?: string
  /**
   * Icon to display before the label
   */
  icon?: ReactNode
  /**
   * Button variant. 'text' is an alias for 'link'.
   * @default 'destructive'
   */
  variant?: ButtonVariant
  /**
   * Button size
   * @default 'default'
   */
  size?: keyof typeof buttonSizes
}

/**
 * DeleteButton component for deleting records.
 * Shows confirmation dialog before deleting.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Toolbar>
 *   <SaveButton />
 *   <DeleteButton onDelete={handleDelete} />
 * </Toolbar>
 *
 * // Skip confirmation
 * <DeleteButton onDelete={handleDelete} confirmDelete={false} />
 *
 * // Custom confirmation message
 * <DeleteButton
 *   onDelete={handleDelete}
 *   confirmMessage="This will permanently delete the user. Continue?"
 * />
 * ```
 */
export const DeleteButton = forwardRef<HTMLButtonElement, DeleteButtonProps>(
  (
    {
      label = 'Delete',
      onDelete,
      confirmDelete = true,
      confirmMessage = 'Are you sure you want to delete this item?',
      icon,
      variant = 'destructive',
      size = 'default',
      disabled,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)

      if (confirmDelete) {
        const confirmed = window.confirm(confirmMessage)
        if (!confirmed) {
          return
        }
      }

      await onDelete()
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        data-testid="shadmin-form-delete"
        className={cn(
          buttonBaseStyles,
          buttonVariants[resolveVariant(variant)],
          buttonSizes[size],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </button>
    )
  }
)

DeleteButton.displayName = 'DeleteButton'

/**
 * Props for TopToolbar component
 */
export interface TopToolbarProps {
  /**
   * Toolbar children (buttons, filters, etc.)
   */
  children?: ReactNode
  /**
   * Additional CSS classes for the toolbar container
   */
  className?: string
  /**
   * Data attributes and other HTML attributes
   */
  'data-testid'?: string
}

/**
 * TopToolbar - Toolbar component for the top of list/show/edit pages.
 * Used for action buttons like Create, Export, etc.
 *
 * @example
 * ```tsx
 * // In a List component
 * <List
 *   actions={
 *     <TopToolbar>
 *       <CreateButton />
 *       <ExportButton />
 *     </TopToolbar>
 *   }
 * >
 *   <Datagrid>...</Datagrid>
 * </List>
 *
 * // In a Show component
 * <Show
 *   actions={
 *     <TopToolbar>
 *       <EditButton />
 *     </TopToolbar>
 *   }
 * >
 *   <SimpleShowLayout>...</SimpleShowLayout>
 * </Show>
 * ```
 */
export function TopToolbar({
  children,
  className,
  'data-testid': testId,
}: TopToolbarProps): ReactElement {
  return (
    <div
      className={cn('flex items-center justify-end gap-2', className)}
      data-testid={testId ?? 'shadmin-top-toolbar'}
    >
      {children}
    </div>
  )
}

TopToolbar.displayName = 'TopToolbar'
