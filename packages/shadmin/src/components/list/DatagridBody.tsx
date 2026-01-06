import type { ReactNode, CSSProperties, MouseEvent } from 'react'
import type { Row, flexRender as FlexRenderType } from '@tanstack/react-table'
import type { RaRecord } from '../../types'
import { RecordContextProvider } from '../../contexts/RecordContext'
import type { Identifier } from '../../contexts/ListContext'

/**
 * Props for DatagridBody component
 */
export interface DatagridBodyProps<T extends RaRecord = RaRecord> {
  /** Rows from TanStack Table */
  rows: Row<T>[]
  /** Whether the data is empty */
  isEmpty?: boolean
  /** Number of columns for empty state colspan */
  columnCount: number
  /** Custom empty state content */
  empty?: ReactNode
  /** Selected row IDs */
  selectedIds?: Identifier[]
  /** Function to compute row styles */
  rowStyle?: (record: T, index: number) => CSSProperties
  /** Enable hover styles on rows */
  hover?: boolean
  /** Whether rows are clickable */
  isRowClickable?: boolean
  /** Row click handler */
  onRowClick?: (record: T, index: number, event: MouseEvent) => void
  /** flexRender function from TanStack */
  flexRender: typeof FlexRenderType
}

/**
 * DatagridBody renders the table body with data rows
 *
 * This component is used internally by Datagrid but can be used
 * separately for custom table implementations.
 *
 * @example
 * ```tsx
 * <DatagridBody
 *   rows={table.getRowModel().rows}
 *   isEmpty={data.length === 0}
 *   columnCount={columns.length}
 *   flexRender={flexRender}
 * />
 * ```
 */
export function DatagridBody<T extends RaRecord = RaRecord>({
  rows,
  isEmpty = false,
  columnCount,
  empty,
  selectedIds = [],
  rowStyle,
  hover = false,
  isRowClickable = false,
  onRowClick,
  flexRender,
}: DatagridBodyProps<T>) {
  if (isEmpty) {
    return (
      <tbody className="[&_tr:last-child]:border-0">
        <tr>
          <td colSpan={columnCount} className="h-24 text-center">
            {empty || <span>No data available</span>}
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody className="[&_tr:last-child]:border-0">
      {rows.map((row, rowIndex) => {
        const record = row.original
        const customStyle = rowStyle ? rowStyle(record, rowIndex) : undefined
        const isSelected = selectedIds.includes(record.id as Identifier)

        return (
          <RecordContextProvider key={row.id} value={record}>
            <tr
              className={[
                'border-b transition-colors',
                hover && 'hover:bg-muted/50 hover',
                isRowClickable && 'cursor-pointer',
                isSelected && 'bg-muted',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                ...customStyle,
                cursor: isRowClickable ? 'pointer' : undefined,
              }}
              onClick={
                isRowClickable && onRowClick
                  ? (e) => onRowClick(record, rowIndex, e)
                  : undefined
              }
              data-selected={isSelected || undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          </RecordContextProvider>
        )
      })}
    </tbody>
  )
}

DatagridBody.displayName = 'DatagridBody'
