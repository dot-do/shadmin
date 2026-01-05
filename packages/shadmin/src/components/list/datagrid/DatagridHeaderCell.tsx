import type { ReactNode, MouseEvent } from 'react'
import type { Header } from '@tanstack/react-table'
import type { RaRecord } from '../../../contexts/RecordContext'
import type { SortPayload } from '../../../contexts/ListContext'

/**
 * Props for DatagridHeaderCell component
 */
export interface DatagridHeaderCellProps<T extends RaRecord = RaRecord> {
  /** Header from TanStack Table */
  header: Header<T, unknown>
  /** Current sort configuration */
  sort?: SortPayload
  /** Handler for sort changes */
  onSortChange?: (field: string) => void
  /** Additional className for the cell */
  className?: string
}

/**
 * DatagridHeaderCell renders an individual table header cell
 *
 * This component handles sorting interactions and displays sort indicators.
 * Used internally by DatagridHeader but can be used separately for custom
 * table implementations.
 *
 * @example
 * ```tsx
 * <DatagridHeaderCell
 *   header={header}
 *   sort={sort}
 *   onSortChange={handleSortChange}
 * />
 * ```
 */
export function DatagridHeaderCell<T extends RaRecord = RaRecord>({
  header,
  sort,
  onSortChange,
  className = '',
}: DatagridHeaderCellProps<T>) {
  const isSorted = sort?.field === header.column.id
  const sortDirection = isSorted
    ? sort?.order === 'ASC'
      ? 'ascending'
      : 'descending'
    : undefined
  const canSort = header.column.getCanSort() && header.column.id !== 'selection'

  const cellClasses = [
    'h-10 px-2 text-left align-middle font-medium text-muted-foreground',
    canSort && 'cursor-pointer select-none',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (e: MouseEvent) => {
    if (canSort && onSortChange) {
      onSortChange(header.column.id)
    }
  }

  // Get header content
  const headerContent = header.isPlaceholder
    ? null
    : typeof header.column.columnDef.header === 'string'
      ? header.column.columnDef.header
      : typeof header.column.columnDef.header === 'function'
        ? null // Function headers are rendered by TanStack Table
        : header.column.columnDef.header

  return (
    <th
      scope="col"
      className={cellClasses}
      aria-sort={sortDirection}
      onClick={canSort ? handleClick : undefined}
    >
      <div className="flex items-center gap-1">
        {headerContent}
        {canSort && isSorted && (
          <span className="ml-1" aria-hidden="true">
            {sort?.order === 'ASC' ? '\u2191' : '\u2193'}
          </span>
        )}
      </div>
    </th>
  )
}

DatagridHeaderCell.displayName = 'DatagridHeaderCell'
