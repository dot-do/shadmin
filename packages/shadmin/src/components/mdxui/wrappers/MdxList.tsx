/**
 * MdxList - List component using @mdxui/admin UI with react-admin context
 *
 * This wrapper provides react-admin's ListContext around children,
 * enabling use of @mdxui/admin's DatabaseGrid or other components
 * with data fetched via react-admin's dataProvider.
 */

import { ListBase, type ListBaseProps } from '../../list/ListBase'
import { ListView } from '../../list/ListView'

import type { Identifier } from '../../../contexts/ListContext'
import type { ReactNode, ReactElement } from 'react'

/**
 * Props for MdxList component
 */
export interface MdxListProps<RecordType extends { id: Identifier } = { id: Identifier }>
  extends Omit<ListBaseProps<RecordType>, 'children' | 'sort' | 'perPage'> {
  /** Child elements to render inside the list */
  children: ReactNode
  /** Title to display in the list header */
  title?: ReactNode
  /** Custom actions component */
  actions?: ReactElement | ReactElement[] | false
  /** Filters component for the list */
  filters?: ReactElement | ReactElement[]
  /** Component to display when the list is empty */
  empty?: ReactElement
  /** Pagination component */
  pagination?: ReactElement | false
  /** Additional CSS class name */
  className?: string
  /** Default sort configuration */
  sort?: { field: string; order: 'ASC' | 'DESC' }
  /** Number of records per page */
  perPage?: number
  /** Exporter function for list data */
  exporter?: ((data: unknown[]) => unknown) | false
}

/**
 * MdxList - List wrapper that provides react-admin context for @mdxui/admin components
 *
 * Use this to integrate @mdxui/admin's DatabaseGrid or other UI components
 * with react-admin's data fetching layer.
 *
 * @example
 * ```tsx
 * import { MdxList, DatabaseGrid } from 'shadmin'
 *
 * // Using DatabaseGrid inside MdxList
 * <MdxList resource="users">
 *   <DatabaseGridWrapper />
 * </MdxList>
 *
 * // DatabaseGridWrapper connects to ListContext
 * function DatabaseGridWrapper() {
 *   const { data, isLoading } = useListContext()
 *   const columns = [
 *     { accessorKey: 'id', header: 'ID', dataType: 'number' },
 *     { accessorKey: 'name', header: 'Name', dataType: 'text' },
 *     { accessorKey: 'email', header: 'Email', dataType: 'email' },
 *   ]
 *   return <DatabaseGrid data={data ?? []} columns={columns} isLoading={isLoading} />
 * }
 * ```
 */
export function MdxList<RecordType extends { id: Identifier } = { id: Identifier }>({
  resource,
  perPage,
  sort,
  filter,
  filterDefaultValues,
  disableSyncWithLocation,
  queryOptions,
  title,
  actions,
  filters,
  empty,
  pagination,
  className,
  exporter: _exporter,
  children,
}: MdxListProps<RecordType>) {
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
      >
        {children}
      </ListView>
    </ListBase>
  )
}

export default MdxList
