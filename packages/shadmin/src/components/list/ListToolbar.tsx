/**
 * ListToolbar Component
 * Contains filters and actions for a list view.
 * Follows shadcn/ui styling patterns.
 */

import { type ReactNode, type ReactElement } from 'react'
import { cn } from '../../utils'

/**
 * Props for ListToolbar component
 */
export interface ListToolbarProps {
  /**
   * Filters component to render on the left side
   */
  filters?: ReactNode
  /**
   * Actions component to render on the right side (e.g., ListActions)
   */
  actions?: ReactNode
  /**
   * Additional content to render between filters and actions
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
 * ListToolbar - Contains filters and actions for a list view.
 * Provides a structured layout with filters on the left and actions on the right.
 *
 * @example
 * ```tsx
 * // Basic usage with filters and actions
 * <ListToolbar
 *   filters={<SearchFilter />}
 *   actions={
 *     <ListActions>
 *       <CreateButton />
 *     </ListActions>
 *   }
 * />
 *
 * // With multiple filters
 * <ListToolbar
 *   filters={
 *     <>
 *       <SearchFilter />
 *       <StatusFilter />
 *     </>
 *   }
 *   actions={
 *     <ListActions>
 *       <CreateButton />
 *       <ExportButton />
 *     </ListActions>
 *   }
 * />
 *
 * // Using children for custom content
 * <ListToolbar
 *   filters={<SearchFilter />}
 *   actions={<ListActions><CreateButton /></ListActions>}
 * >
 *   <Badge>100 records</Badge>
 * </ListToolbar>
 * ```
 */
export function ListToolbar({
  filters,
  actions,
  children,
  className,
  'data-testid': testId,
}: ListToolbarProps): ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
      data-testid={testId}
    >
      <div className="flex flex-1 items-center gap-2">
        {filters}
        {children}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}

ListToolbar.displayName = 'ListToolbar'
