/**
 * ListActions Component
 * Toolbar wrapper for list action buttons (CreateButton, ExportButton, etc.)
 * Follows shadcn/ui styling patterns.
 */

import { type ReactNode, type ReactElement } from 'react'
import { cn } from '../../utils'

/**
 * Props for ListActions component
 */
export interface ListActionsProps {
  /**
   * Action buttons to render (CreateButton, ExportButton, etc.)
   */
  children?: ReactNode
  /**
   * Additional CSS classes for the container
   */
  className?: string
  /**
   * Data attributes and other HTML attributes
   */
  'data-testid'?: string
}

/**
 * ListActions - Toolbar wrapper for list action buttons.
 * Used to group action buttons like CreateButton, ExportButton, etc.
 *
 * @example
 * ```tsx
 * // Basic usage with CreateButton
 * <List
 *   actions={
 *     <ListActions>
 *       <CreateButton />
 *     </ListActions>
 *   }
 * >
 *   <Datagrid>...</Datagrid>
 * </List>
 *
 * // Multiple action buttons
 * <List
 *   actions={
 *     <ListActions>
 *       <CreateButton />
 *       <ExportButton />
 *     </ListActions>
 *   }
 * >
 *   <Datagrid>...</Datagrid>
 * </List>
 *
 * // Custom buttons
 * <ListActions>
 *   <CreateButton label="Add Post" />
 *   <Button variant="outline" onClick={handleImport}>
 *     Import
 *   </Button>
 * </ListActions>
 * ```
 */
export function ListActions({
  children,
  className,
  'data-testid': testId,
}: ListActionsProps): ReactElement {
  return (
    <div
      className={cn('flex items-center justify-end gap-2', className)}
      data-testid={testId}
    >
      {children}
    </div>
  )
}

ListActions.displayName = 'ListActions'
