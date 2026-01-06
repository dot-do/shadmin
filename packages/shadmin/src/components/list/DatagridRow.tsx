import type { ReactNode, CSSProperties, MouseEvent } from 'react'
import type { Row, flexRender as FlexRenderType } from '@tanstack/react-table'
import type { RaRecord } from '../../types'
import { RecordContextProvider } from '../../contexts/RecordContext'
import type { Identifier } from '../../contexts/ListContext'

/**
 * Props for DatagridRow component
 */
export interface DatagridRowProps<T extends RaRecord = RaRecord> {
  /** Row from TanStack Table */
  row: Row<T>
  /** Row index in the data array */
  rowIndex: number
  /** Whether this row is selected */
  isSelected?: boolean
  /** Custom style for this row */
  style?: CSSProperties
  /** Enable hover styles */
  hover?: boolean
  /** Whether the row is clickable */
  isClickable?: boolean
  /** Row click handler */
  onClick?: (record: T, index: number, event: MouseEvent) => void
  /** flexRender function from TanStack */
  flexRender: typeof FlexRenderType
  /** Additional className for the row */
  className?: string
}

/**
 * DatagridRow renders a single table row
 *
 * This component is used internally by Datagrid and DatagridBody but can be
 * used separately for custom table implementations or row customization.
 *
 * @example
 * ```tsx
 * <DatagridRow
 *   row={row}
 *   rowIndex={index}
 *   flexRender={flexRender}
 *   hover
 *   isClickable
 *   onClick={handleRowClick}
 * />
 * ```
 */
export function DatagridRow<T extends RaRecord = RaRecord>({
  row,
  rowIndex,
  isSelected = false,
  style,
  hover = false,
  isClickable = false,
  onClick,
  flexRender,
  className = '',
}: DatagridRowProps<T>) {
  const record = row.original

  const rowClasses = [
    'border-b transition-colors',
    hover && 'hover:bg-muted/50 hover',
    isClickable && 'cursor-pointer',
    isSelected && 'bg-muted',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const rowStyle: CSSProperties = {
    ...style,
    cursor: isClickable ? 'pointer' : undefined,
  }

  const handleClick = isClickable && onClick
    ? (e: MouseEvent) => onClick(record, rowIndex, e)
    : undefined

  return (
    <RecordContextProvider value={record}>
      <tr
        className={rowClasses}
        style={rowStyle}
        onClick={handleClick}
        data-selected={isSelected || undefined}
        data-row-index={rowIndex}
      >
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="p-2 align-middle">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    </RecordContextProvider>
  )
}

DatagridRow.displayName = 'DatagridRow'

/**
 * Props for a simple record row (without TanStack Table)
 */
export interface SimpleDatagridRowProps<T extends RaRecord = RaRecord> {
  /** The record data */
  record: T
  /** Row index in the data array */
  rowIndex: number
  /** Children to render in the row (typically field components) */
  children: ReactNode
  /** Whether this row is selected */
  isSelected?: boolean
  /** Custom style for this row */
  style?: CSSProperties
  /** Enable hover styles */
  hover?: boolean
  /** Whether the row is clickable */
  isClickable?: boolean
  /** Row click handler */
  onClick?: (record: T, index: number, event: MouseEvent) => void
  /** Additional className for the row */
  className?: string
}

/**
 * SimpleDatagridRow renders a table row without TanStack Table dependency
 *
 * Useful for simpler use cases or custom implementations that don't need
 * the full TanStack Table functionality.
 *
 * @example
 * ```tsx
 * <SimpleDatagridRow record={record} rowIndex={0}>
 *   <td><TextField source="name" /></td>
 *   <td><TextField source="email" /></td>
 * </SimpleDatagridRow>
 * ```
 */
export function SimpleDatagridRow<T extends RaRecord = RaRecord>({
  record,
  rowIndex,
  children,
  isSelected = false,
  style,
  hover = false,
  isClickable = false,
  onClick,
  className = '',
}: SimpleDatagridRowProps<T>) {
  const rowClasses = [
    'border-b transition-colors',
    hover && 'hover:bg-muted/50 hover',
    isClickable && 'cursor-pointer',
    isSelected && 'bg-muted',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const rowStyle: CSSProperties = {
    ...style,
    cursor: isClickable ? 'pointer' : undefined,
  }

  const handleClick = isClickable && onClick
    ? (e: MouseEvent) => onClick(record, rowIndex, e)
    : undefined

  return (
    <RecordContextProvider value={record}>
      <tr
        className={rowClasses}
        style={rowStyle}
        onClick={handleClick}
        data-selected={isSelected || undefined}
        data-row-index={rowIndex}
      >
        {children}
      </tr>
    </RecordContextProvider>
  )
}

SimpleDatagridRow.displayName = 'SimpleDatagridRow'
