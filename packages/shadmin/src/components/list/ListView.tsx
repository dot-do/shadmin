/**
 * ListView Component
 * UI wrapper for list display - uses ShadCN Card as container
 * 100% API-compatible with react-admin ListView
 *
 * Epic: shadmin-ha1 (P1)
 */

import { type ReactNode, type ReactElement, useMemo } from 'react'
import { useListContext } from '../../contexts/ListContext'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

/**
 * Props for ListView component
 */
export interface ListViewProps {
  /** Child elements to render inside the list container */
  children: ReactNode
  /** Title to display in the list header */
  title?: ReactNode
  /** Custom actions component (e.g., Create button) */
  actions?: ReactElement | ReactElement[] | false | undefined
  /** Filters component for the list */
  filters?: ReactElement | ReactElement[] | undefined
  /** Component to display when the list is empty */
  empty?: ReactElement | undefined
  /** Pagination component */
  pagination?: ReactElement | false | undefined
  /** Additional CSS class name */
  className?: string | undefined
  /** Aside content (e.g., bulk action buttons) */
  aside?: ReactElement | undefined
}

/**
 * ListView - UI wrapper component for list display
 *
 * This component expects to be used inside a ListContextProvider.
 * It provides the visual structure (Card container) for displaying list data.
 *
 * @example
 * ```tsx
 * // Basic usage (inside ListBase or List)
 * <ListContextProvider value={listContext}>
 *   <ListView title="Posts">
 *     <Datagrid>
 *       <TextField source="title" />
 *       <DateField source="createdAt" />
 *     </Datagrid>
 *   </ListView>
 * </ListContextProvider>
 *
 * // With actions and filters
 * <ListView
 *   title="Posts"
 *   actions={<CreateButton />}
 *   filters={<PostFilters />}
 * >
 *   <Datagrid>...</Datagrid>
 * </ListView>
 * ```
 */
export function ListView({
  children,
  title,
  actions,
  filters,
  empty,
  pagination,
  className,
  aside,
}: ListViewProps) {
  const { data, isLoading, total } = useListContext()

  // Show empty component if data is empty and not loading
  const showEmpty = useMemo(
    () => !isLoading && data && data.length === 0 && total === 0 && empty,
    [isLoading, data, total, empty]
  )

  return (
    <Card className={className} data-slot="card" data-testid="shadmin-list-view">
      {(title || actions || filters) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4" data-testid="shadmin-list-header">
          <div className="flex items-center gap-4">
            {title && (
              typeof title === 'string' ? (
                <CardTitle id="react-admin-title">{title}</CardTitle>
              ) : (
                <span id="react-admin-title">{title}</span>
              )
            )}
            {filters}
          </div>
          {actions !== false && actions && (
            <div className="flex items-center gap-2" data-testid="shadmin-list-actions">
              {actions}
            </div>
          )}
        </CardHeader>
      )}
      <CardContent data-testid="shadmin-list-content">
        {showEmpty ? empty : children}
        {pagination !== false && pagination}
      </CardContent>
      {aside}
    </Card>
  )
}

export default ListView
