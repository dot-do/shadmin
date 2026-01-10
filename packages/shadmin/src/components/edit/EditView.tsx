/**
 * EditView Component
 * UI wrapper for edit display - uses ShadCN Card as container
 * 100% API-compatible with react-admin EditView
 *
 * Epic: shadmin-ha1 (P1)
 */

import type { ReactNode, ReactElement } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { cn } from '../../utils'

/**
 * Props for EditActions component
 * Used for customizing the actions toolbar in Edit views
 */
export interface EditActionsProps {
  /** Additional CSS class name */
  className?: string
  /** Child elements (action buttons) */
  children?: ReactNode
  /** Whether the resource has a show view */
  hasShow?: boolean
  /** Whether the resource allows deletion */
  hasDelete?: boolean
}

/**
 * Props for EditView component
 */
export interface EditViewProps {
  /** Child elements to render inside the edit container */
  children: ReactNode
  /** Title to display in the edit header */
  title?: ReactNode
  /** Custom actions component (e.g., Delete button) */
  actions?: ReactElement | false
  /** Aside content (e.g., sidebar) */
  aside?: ReactElement
  /** Additional CSS class name */
  className?: string
}

/**
 * EditView - UI wrapper component for edit display
 *
 * This component provides the visual structure (Card container) for the edit form.
 * It's typically used by the Edit component to wrap the form.
 *
 * @example
 * ```tsx
 * // Basic usage (inside EditBase or Edit)
 * <EditView title="Edit Post">
 *   <SimpleForm>
 *     <TextInput source="title" />
 *     <TextInput source="body" />
 *   </SimpleForm>
 * </EditView>
 *
 * // With actions and aside
 * <EditView
 *   title="Edit Post"
 *   actions={<DeleteButton />}
 *   aside={<PostHistory />}
 * >
 *   <SimpleForm>...</SimpleForm>
 * </EditView>
 * ```
 */
export function EditView({
  children,
  title,
  actions,
  aside,
  className,
}: EditViewProps) {
  return (
    <div className="edit-page flex gap-4" data-testid="edit-view">
      <Card className={cn('flex-1', className)} data-slot="card" data-testid="edit-card">
        {(title || actions) && (
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-4"
            data-testid="edit-header"
          >
            <div className="flex items-center gap-4">
              {title && (
                typeof title === 'string' ? (
                  <CardTitle data-testid="edit-title">{title}</CardTitle>
                ) : (
                  title
                )
              )}
            </div>
            {actions !== false && actions && (
              <div className="flex items-center gap-2" data-testid="edit-actions">
                {actions}
              </div>
            )}
          </CardHeader>
        )}
        <CardContent data-testid="edit-content">
          {children}
        </CardContent>
      </Card>
      {aside && (
        <div className="edit-aside" data-testid="edit-aside">
          {aside}
        </div>
      )}
    </div>
  )
}

export default EditView
