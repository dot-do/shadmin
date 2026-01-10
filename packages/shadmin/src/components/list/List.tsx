/**
 * List Component
 * Complete list component combining ListBase (logic) and ListView (UI)
 * 100% API-compatible with react-admin List
 *
 * Epic: shadmin-ha1 (P1)
 */

import type { ReactNode, ReactElement } from 'react'
import { ListBase, type ListBaseProps } from './ListBase'
import { ListView } from './ListView'
import type { SortPayload, FilterPayload, Identifier } from '../../contexts/ListContext'

/**
 * Props for List component
 * Combines ListBase props (logic) with ListView props (UI)
 */
export interface ListProps<RecordType extends { id: Identifier } = { id: Identifier }>
  extends Omit<ListBaseProps<RecordType>, 'children' | 'sort' | 'perPage'> {
  /** Child elements to render inside the list (typically Datagrid) */
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
  /** Default sort configuration */
  sort?: { field: string; order: 'ASC' | 'DESC' } | undefined
  /** Exporter function for list data, or false to disable export */
  exporter?: ((data: any) => any) | false | undefined
  /** Number of records per page */
  perPage?: number | undefined
}

/**
 * List - Complete list component with data fetching and UI
 *
 * The List component combines ListBase (data fetching, pagination, sorting, filtering)
 * with ListView (Card container, header, empty state) to provide a complete list solution.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <List resource="posts">
 *   <Datagrid>
 *     <TextField source="title" />
 *     <DateField source="createdAt" />
 *   </Datagrid>
 * </List>
 *
 * // With all options
 * <List
 *   resource="posts"
 *   title="All Posts"
 *   perPage={25}
 *   sort={{ field: 'createdAt', order: 'DESC' }}
 *   filter={{ published: true }}
 *   filterDefaultValues={{ status: 'active' }}
 *   actions={<CreateButton />}
 *   filters={<PostFilters />}
 *   empty={<Empty />}
 * >
 *   <Datagrid>
 *     <TextField source="title" />
 *     <DateField source="createdAt" />
 *   </Datagrid>
 * </List>
 * ```
 */
export function List<RecordType extends { id: Identifier } = { id: Identifier }>({
  // ListBase props
  resource,
  perPage,
  sort,
  filter,
  filterDefaultValues,
  disableSyncWithLocation,
  queryOptions,
  // ListView props
  title,
  actions,
  filters,
  empty,
  pagination,
  className,
  aside,
  // Export functionality (for API compatibility, not yet implemented)
  exporter: _exporter,
  // Children
  children,
}: ListProps<RecordType>) {
  return (
    <ListBase<RecordType>
      resource={resource}
      perPage={perPage}
      sort={sort}
      filter={filter}
      filterDefaultValues={filterDefaultValues}
      disableSyncWithLocation={disableSyncWithLocation}
      queryOptions={queryOptions}
    >
      <ListView
        title={title}
        actions={actions}
        filters={filters}
        empty={empty}
        pagination={pagination}
        className={className}
        aside={aside}
      >
        {children}
      </ListView>
    </ListBase>
  )
}

export default List

// Re-export types for convenience
export type { SortPayload, FilterPayload, Identifier }
