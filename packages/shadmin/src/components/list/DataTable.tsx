import type { ReactNode } from 'react'
import { get } from 'lodash-es'
import type { RaRecord } from '../../types'
import { useRecordContext } from '../../contexts/RecordContext'
import { Datagrid, type DatagridProps, type CellRendererProps, type RowClickHandler } from './Datagrid'

/**
 * Props for DataTable component
 * Extends all Datagrid props for full compatibility
 */
export interface DataTableProps<T extends RaRecord = RaRecord> extends Omit<DatagridProps<T>, 'size' | 'rowClick'> {
  /** MUI sx prop for styling (accepted for compatibility, ignored) */
  sx?: unknown
  /** Sort configuration */
  sort?: { field: string; order: 'ASC' | 'DESC' }
  /** Data records to display */
  data?: T[]
  /** Whether data is currently loading */
  isPending?: boolean
  /** Total count of records (for pagination) */
  total?: number
  /** Row click handler - 'edit', 'show', false, string path, or custom function */
  rowClick?: RowClickHandler<T> | string | boolean | ((id: any, resource: string, record: T) => string)
  /** Bulk action buttons or false to disable */
  bulkActionButtons?: ReactNode | false
  /** Resource name */
  resource?: string
  /** Table density size (small is mapped to sm) */
  size?: 'default' | 'sm' | 'lg' | 'small'
}

/**
 * Props for DataTable.Col component
 */
export interface DataTableColProps<T extends RaRecord = RaRecord> {
  /** The field name in the record to display (optional if using children or field) */
  source?: string
  /** Optional label for the column header */
  label?: string
  /** Whether the column is sortable */
  sortable?: boolean
  /** Whether to disable sorting for this column */
  disableSort?: boolean
  /** Custom render function for the cell content */
  render?: (props: CellRendererProps<T>) => ReactNode
  /** Field component to use for rendering (e.g., DateField, TextField) */
  field?: React.ComponentType<{ source: string; record?: T }>
  /** Custom className for the column */
  className?: string
  /** Text to display when value is empty/null/undefined */
  emptyText?: string
  /** Children to render directly */
  children?: ReactNode
  /** MUI sx prop for styling (accepted for compatibility, ignored) */
  sx?: unknown
  /** Sort order override for this column */
  sortByOrder?: string
  /** Text alignment for the column */
  align?: 'left' | 'center' | 'right' | string
}

/**
 * DataTable component - an advanced data grid wrapper
 *
 * This is currently a simple stub that wraps the Datagrid component.
 * It provides the same API as Datagrid and can be enhanced later with
 * additional features such as:
 * - Column resizing
 * - Column reordering
 * - Advanced filtering
 * - Column pinning
 * - Row grouping
 * - Virtual scrolling for large datasets
 *
 * @example
 * ```tsx
 * <DataTable>
 *   <TextField source="name" />
 *   <TextField source="email" />
 *   <DateField source="createdAt" />
 * </DataTable>
 * ```
 *
 * @example
 * ```tsx
 * // With row click and selection
 * <DataTable
 *   rowClick="edit"
 *   bulkActionButtons={true}
 * >
 *   <TextField source="name" />
 *   <TextField source="email" />
 * </DataTable>
 * ```
 */
export function DataTable<T extends RaRecord = RaRecord>(props: DataTableProps<T>) {
  const {
    size,
    isPending,
    rowClick,
    // These props are accepted for compatibility but handled differently
    sort: _sort,
    data: _data,
    total: _total,
    resource: _resource,
    isLoading: isLoadingProp,
    ...rest
  } = props

  // Map 'small' to 'sm' for size prop
  const mappedSize: 'default' | 'sm' | 'lg' | undefined = size === 'small' ? 'sm' : size as Exclude<typeof size, 'small'>

  // Map isPending to isLoading
  const isLoading = isPending ?? isLoadingProp

  // Normalize rowClick - convert string/boolean to RowClickHandler
  let normalizedRowClick: DatagridProps<T>['rowClick']
  if (rowClick === undefined) {
    normalizedRowClick = undefined
  } else if (typeof rowClick === 'string') {
    if (rowClick === 'edit' || rowClick === 'show') {
      normalizedRowClick = rowClick
    } else {
      // Other strings are accepted - treat as path
      normalizedRowClick = undefined
    }
  } else if (typeof rowClick === 'boolean') {
    normalizedRowClick = rowClick ? 'edit' : false
  } else if (typeof rowClick === 'function') {
    // If it's the react-admin style function (id, resource, record) => string
    // we need to adapt it to our style (record, id, event) => void | string
    normalizedRowClick = rowClick as DatagridProps<T>['rowClick']
  } else {
    normalizedRowClick = rowClick
  }

  // Build props object, only including defined values to satisfy exactOptionalPropertyTypes
  const datagridProps: DatagridProps<T> = {
    ...rest,
  }

  if (mappedSize !== undefined) {
    datagridProps.size = mappedSize
  }

  if (isLoading !== undefined) {
    datagridProps.isLoading = isLoading
  }

  if (normalizedRowClick !== undefined) {
    datagridProps.rowClick = normalizedRowClick
  }

  return <Datagrid<T> {...datagridProps} />
}

DataTable.displayName = 'DataTable'

/**
 * DataTable.Col component - defines a column for DataTable
 *
 * This component is used as a child of DataTable to define columns.
 * It renders the value from the record at the specified source path.
 *
 * @example
 * ```tsx
 * <DataTable>
 *   <DataTable.Col source="name" />
 *   <DataTable.Col source="email" label="Email Address" />
 *   <DataTable.Col source="status" sortable={false} />
 *   <DataTable.Col
 *     source="createdAt"
 *     render={({ value }) => new Date(value as string).toLocaleDateString()}
 *   />
 * </DataTable>
 * ```
 */
export function DataTableCol<T extends RaRecord = RaRecord>({
  source,
  render,
  field: FieldComponent,
  className,
  emptyText = '',
  children,
  align,
}: DataTableColProps<T>) {
  const record = useRecordContext<T>()
  const value = source ? get(record, source) : undefined

  // Build alignment class
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : ''
  const combinedClassName = [className, alignClass].filter(Boolean).join(' ') || undefined

  // If children are provided, render them directly
  if (children) {
    return <span className={combinedClassName}>{children}</span>
  }

  // If a field component is provided, render it
  if (FieldComponent && source) {
    return (
      <span className={combinedClassName}>
        <FieldComponent source={source} record={record as T} />
      </span>
    )
  }

  if (render && source) {
    return (
      <span className={combinedClassName}>
        {render({ record: record as T, column: source, value, rowIndex: 0 })}
      </span>
    )
  }

  const displayValue = value == null ? emptyText : String(value)

  return <span className={combinedClassName}>{displayValue}</span>
}

DataTableCol.displayName = 'DataTable.Col'

/**
 * Props for DataTable.NumberCol component
 */
export interface DataTableNumberColProps<T extends RaRecord = RaRecord> extends Omit<DataTableColProps<T>, 'align'> {
  /** Number formatting options */
  options?: Intl.NumberFormatOptions
  /** Locale for number formatting */
  locales?: string | string[]
}

/**
 * DataTable.NumberCol component - a column optimized for numeric values
 *
 * This component is a wrapper around DataTable.Col that:
 * - Right-aligns values by default
 * - Formats numbers using Intl.NumberFormat
 *
 * @example
 * ```tsx
 * <DataTable>
 *   <DataTable.Col source="name" />
 *   <DataTable.NumberCol source="price" options={{ style: 'currency', currency: 'USD' }} />
 *   <DataTable.NumberCol source="quantity" />
 * </DataTable>
 * ```
 */
export function DataTableNumberCol<T extends RaRecord = RaRecord>({
  source,
  options,
  locales,
  className,
  emptyText = '',
}: DataTableNumberColProps<T>) {
  const record = useRecordContext<T>()
  const value = source ? get(record, source) : undefined

  // Build alignment class - always right-aligned for numbers
  const alignClass = 'text-right'
  const combinedClassName = [className, alignClass].filter(Boolean).join(' ')

  // Format the number
  let displayValue: string
  if (value == null) {
    displayValue = emptyText
  } else if (typeof value === 'number') {
    displayValue = new Intl.NumberFormat(locales, options).format(value)
  } else {
    const numValue = Number(value)
    displayValue = isNaN(numValue) ? String(value) : new Intl.NumberFormat(locales, options).format(numValue)
  }

  return <span className={combinedClassName}>{displayValue}</span>
}

DataTableNumberCol.displayName = 'DataTable.NumberCol'

// Attach Col as a static property on DataTable
DataTable.Col = DataTableCol

// Attach NumberCol as a static property on DataTable
DataTable.NumberCol = DataTableNumberCol
