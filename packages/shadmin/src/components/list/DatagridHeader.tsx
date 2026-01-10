import type { HeaderGroup } from '@tanstack/react-table'
import type { RaRecord } from '../../types'
import type { SortPayload } from '../../contexts/ListContext'

/**
 * Props for DatagridHeader component
 */
export interface DatagridHeaderProps<T extends RaRecord = RaRecord> {
  /** Header groups from TanStack Table */
  headerGroups: HeaderGroup<T>[]
  /** Current sort configuration */
  sort?: SortPayload
  /** Handler for sort changes */
  onSortChange?: (field: string) => void
  /** Whether to show the selection column */
  showSelection?: boolean
  /** Header checkbox ref for indeterminate state */
  headerCheckboxRef?: React.RefObject<HTMLInputElement>
}

/**
 * DatagridHeader renders the table header row(s)
 *
 * This component is used internally by Datagrid but can be used
 * separately for custom table implementations.
 *
 * @example
 * ```tsx
 * <DatagridHeader
 *   headerGroups={table.getHeaderGroups()}
 *   sort={sort}
 *   onSortChange={handleSortChange}
 * />
 * ```
 */
export function DatagridHeader<T extends RaRecord = RaRecord>({
  headerGroups,
  sort,
  onSortChange,
  showSelection: _showSelection = false,
}: DatagridHeaderProps<T>) {
  return (
    <thead className="[&_tr]:border-b" data-testid="shadmin-datagrid-header">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50">
          {headerGroup.headers.map((header) => {
            const isSorted = sort?.field === header.column.id
            const sortDirection = isSorted
              ? sort?.order === 'ASC'
                ? 'ascending'
                : 'descending'
              : undefined
            const canSort =
              header.column.getCanSort() && header.column.id !== 'selection'

            return (
              <th
                key={header.id}
                scope="col"
                className={[
                  'h-10 px-2 text-left align-middle font-medium text-muted-foreground',
                  canSort && 'cursor-pointer select-none',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-sort={sortDirection}
                onClick={
                  canSort && onSortChange
                    ? () => onSortChange(header.column.id)
                    : undefined
                }
              >
                <div className="flex items-center gap-1">
                  {header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === 'function'
                    ? null // Render function handled by TanStack
                    : header.column.columnDef.header}
                  {canSort && isSorted && (
                    <span className="ml-1">
                      {sort?.order === 'ASC' ? '\u2191' : '\u2193'}
                    </span>
                  )}
                </div>
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}

DatagridHeader.displayName = 'DatagridHeader'
