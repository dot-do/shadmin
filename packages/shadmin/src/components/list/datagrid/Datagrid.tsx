import {
  type ReactNode,
  type ReactElement,
  type CSSProperties,
  type MouseEvent,
  Children,
  isValidElement,
  cloneElement,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { useListContext, type SortPayload, type Identifier } from '../../../contexts/ListContext'
import { RecordContextProvider, type RaRecord } from '../../../contexts/RecordContext'
import { DatagridHeader } from './DatagridHeader'
import { DatagridBody } from './DatagridBody'
import { DatagridRow } from './DatagridRow'

/**
 * Column configuration for Datagrid
 */
export interface DatagridColumn {
  source: string
  label?: string
  sortable?: boolean
  render?: (record: RaRecord) => ReactNode
}

/**
 * Row click handler type
 */
export type RowClickHandler<T extends RaRecord = RaRecord> =
  | 'edit'
  | 'show'
  | false
  | ((record: T, id: Identifier, event: MouseEvent) => void | string)

/**
 * Props for Datagrid component
 */
export interface DatagridProps<T extends RaRecord = RaRecord> {
  /** Child field components - each becomes a column */
  children?: ReactNode
  /** Explicit column configuration (alternative to children) */
  columns?: DatagridColumn[]
  /** Enable bulk action checkboxes */
  bulkActionButtons?: ReactNode | boolean
  /** Row click handler - 'edit', 'show', false, or custom function */
  rowClick?: RowClickHandler<T>
  /** Custom empty state component */
  empty?: ReactNode
  /** Custom loading component */
  loading?: ReactNode
  /** Custom className for the table */
  className?: string
  /** Function to compute row styles */
  rowStyle?: (record: T, index: number) => CSSProperties
  /** Enable hover styles on rows */
  hover?: boolean
  /** Table density size */
  size?: 'default' | 'sm' | 'lg'
  /** Whether the table is currently loading */
  isLoading?: boolean
}

/**
 * Extract column source from a child element
 */
function getChildSource(child: ReactElement): string | undefined {
  const props = child.props as { source?: string }
  return props.source
}

/**
 * Check if a child column is sortable
 */
function isChildSortable(child: ReactElement): boolean {
  const props = child.props as { sortable?: boolean }
  return props.sortable !== false
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Datagrid component for displaying tabular data
 *
 * Compatible with react-admin Datagrid API. Uses TanStack Table v8 for
 * table logic and renders with ShadCN-style components.
 *
 * @example
 * ```tsx
 * <Datagrid>
 *   <TextField source="name" />
 *   <TextField source="email" />
 *   <DateField source="createdAt" />
 * </Datagrid>
 * ```
 *
 * @example
 * ```tsx
 * // With row click and selection
 * <Datagrid
 *   rowClick="edit"
 *   bulkActionButtons={true}
 * >
 *   <TextField source="name" />
 *   <TextField source="email" />
 * </Datagrid>
 * ```
 */
export function Datagrid<T extends RaRecord = RaRecord>({
  children,
  columns: columnsProp,
  bulkActionButtons = false,
  rowClick,
  empty,
  loading,
  className = '',
  rowStyle,
  hover = false,
  size = 'default',
}: DatagridProps<T>) {
  const listContext = useListContext<T>()
  const {
    data,
    isLoading: contextIsLoading,
    sort,
    setSort,
    selectedIds,
    onSelect,
    onToggleItem,
    onUnselectItems,
  } = listContext

  const headerCheckboxRef = useRef<HTMLInputElement>(null)

  // Determine if we're showing selection checkboxes
  const showSelection = Boolean(bulkActionButtons)

  // Build columns from children or columnsProp
  const { tableColumns, childElements } = useMemo(() => {
    const childElements: ReactElement[] = []
    const cols: ColumnDef<T>[] = []

    if (columnsProp) {
      // Use explicit columns config
      columnsProp.forEach((col) => {
        cols.push({
          id: col.source,
          accessorKey: col.source,
          header: col.label || capitalize(col.source),
          enableSorting: col.sortable !== false,
          cell: col.render
            ? ({ row }) => col.render!(row.original as RaRecord)
            : ({ getValue }) => String(getValue() ?? ''),
        })
      })
    } else if (children) {
      // Extract columns from children
      Children.forEach(children, (child) => {
        if (isValidElement(child)) {
          const source = getChildSource(child)
          if (source) {
            childElements.push(child)
            cols.push({
              id: source,
              accessorKey: source,
              header: capitalize(source),
              enableSorting: isChildSortable(child),
              cell: ({ row }) => (
                <RecordContextProvider value={row.original}>
                  {child}
                </RecordContextProvider>
              ),
            })
          } else {
            // Child without source - still include it
            childElements.push(child)
            cols.push({
              id: `col-${cols.length}`,
              header: '',
              enableSorting: false,
              cell: ({ row }) => (
                <RecordContextProvider value={row.original}>
                  {child}
                </RecordContextProvider>
              ),
            })
          }
        }
      })
    }

    return { tableColumns: cols, childElements }
  }, [children, columnsProp])

  // Add selection column if needed
  const finalColumns = useMemo(() => {
    if (!showSelection) return tableColumns

    const selectionColumn: ColumnDef<T> = {
      id: 'selection',
      header: ({ table }) => (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={(e) => {
            if (e.target.checked) {
              const allIds = data?.map((record) => record.id as Identifier) ?? []
              onSelect(allIds)
            } else {
              onUnselectItems()
            }
          }}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id as Identifier)}
          onChange={() => onToggleItem(row.original.id as Identifier)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select row ${row.original.id}`}
        />
      ),
      enableSorting: false,
    }

    return [selectionColumn, ...tableColumns]
  }, [showSelection, tableColumns, data, selectedIds, onSelect, onToggleItem, onUnselectItems])

  // Convert ListContext sort to TanStack sorting state
  const sortingState: SortingState = useMemo(() => {
    if (!sort?.field) return []
    return [{ id: sort.field, desc: sort.order === 'DESC' }]
  }, [sort])

  // Convert selectedIds to TanStack row selection state
  const rowSelection: RowSelectionState = useMemo(() => {
    const selection: RowSelectionState = {}
    if (data) {
      data.forEach((record, index) => {
        if (selectedIds.includes(record.id as Identifier)) {
          selection[index] = true
        }
      })
    }
    return selection
  }, [data, selectedIds])

  // Handle sort change
  const handleSortChange = useCallback(
    (field: string) => {
      const currentField = sort?.field
      const currentOrder = sort?.order

      let newOrder: 'ASC' | 'DESC' = 'ASC'
      if (currentField === field) {
        // Toggle order
        newOrder = currentOrder === 'ASC' ? 'DESC' : 'ASC'
      }

      setSort({ field, order: newOrder })
    },
    [sort, setSort]
  )

  // Create table instance
  const table = useReactTable({
    data: data ?? [],
    columns: finalColumns,
    state: {
      sorting: sortingState,
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
    manualSorting: true, // We handle sorting via ListContext
    enableRowSelection: showSelection,
    manualRowSelection: true, // We handle selection via ListContext
  })

  // Update header checkbox indeterminate state
  useEffect(() => {
    if (headerCheckboxRef.current && showSelection && data) {
      const someSelected = selectedIds.length > 0 && selectedIds.length < data.length
      headerCheckboxRef.current.indeterminate = someSelected
    }
  }, [selectedIds, data, showSelection])

  // Handle row click
  const handleRowClick = useCallback(
    (record: T, index: number, event: MouseEvent) => {
      if (rowClick === false || rowClick === undefined) return

      if (typeof rowClick === 'function') {
        rowClick(record, record.id as Identifier, event)
      }
      // For 'edit' and 'show', navigation would be handled by a router
      // The component just makes rows clickable
    },
    [rowClick]
  )

  // Determine if rows are clickable
  const isRowClickable = rowClick && rowClick !== false

  // Build table classes
  const tableClasses = [
    'w-full caption-bottom text-sm',
    size === 'sm' && 'text-xs compact sm',
    size === 'lg' && 'text-base large',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Loading state
  if (contextIsLoading && !data) {
    if (loading) {
      return <>{loading}</>
    }

    return (
      <div role="status" aria-label="Loading">
        <table className={tableClasses}>
          <thead>
            <tr>
              {finalColumns.map((col, index) => (
                <th key={col.id ?? index} scope="col" className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                  {typeof col.header === 'string' ? col.header : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} data-testid="skeleton-row" className="animate-pulse">
                {finalColumns.map((col, index) => (
                  <td key={col.id ?? index} className="p-2">
                    <div className="h-4 bg-muted rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Empty state
  const isEmpty = !data || data.length === 0

  return (
    <div className="relative w-full overflow-auto">
      <table className={tableClasses}>
        <thead className="[&_tr]:border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50">
              {headerGroup.headers.map((header) => {
                const isSorted = sort?.field === header.column.id
                const sortDirection = isSorted ? (sort?.order === 'ASC' ? 'ascending' : 'descending') : undefined
                const canSort = header.column.getCanSort() && header.column.id !== 'selection'

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
                    onClick={canSort ? () => handleSortChange(header.column.id) : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
        <tbody className="[&_tr:last-child]:border-0">
          {isEmpty ? (
            <tr>
              <td colSpan={finalColumns.length} className="h-24 text-center">
                {empty || <span>No data available</span>}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, rowIndex) => {
              const record = row.original
              const customStyle = rowStyle ? rowStyle(record, rowIndex) : undefined

              return (
                <RecordContextProvider key={row.id} value={record}>
                  <tr
                    className={[
                      'border-b transition-colors',
                      hover && 'hover:bg-muted/50 hover',
                      isRowClickable && 'cursor-pointer',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{
                      ...customStyle,
                      cursor: isRowClickable ? 'pointer' : undefined,
                    }}
                    onClick={
                      isRowClickable
                        ? (e) => handleRowClick(record, rowIndex, e)
                        : undefined
                    }
                    data-selected={selectedIds.includes(record.id as Identifier) || undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                </RecordContextProvider>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

Datagrid.displayName = 'Datagrid'
