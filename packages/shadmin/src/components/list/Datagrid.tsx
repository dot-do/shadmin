import {
  type ReactNode,
  type ReactElement,
  type CSSProperties,
  type MouseEvent,
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type ExpandedState,
} from '@tanstack/react-table'
import { useListContext, type Identifier } from '../../contexts/ListContext'
import { RecordContextProvider } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'
// Note: These components are available for future use
// import { DatagridHeader } from './DatagridHeader'
// import { DatagridBody } from './DatagridBody'
// import { DatagridRow } from './DatagridRow'

/**
 * Cell renderer props for custom cell rendering
 */
export interface CellRendererProps<T = RaRecord> {
  record: T
  column: string
  value: unknown
  rowIndex: number
}

/**
 * Column configuration for Datagrid
 */
export interface DatagridColumn<T = RaRecord> {
  source: string
  label?: string
  sortable?: boolean
  render?: (props: CellRendererProps<T>) => ReactNode | unknown
}

/**
 * Render props children for Datagrid
 */
export interface DatagridRenderProps<T = RaRecord> {
  data: T[]
  columns: DatagridColumn<T>[]
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
  /** Child field components - each becomes a column, or render props function */
  children?: ReactNode | ((props: DatagridRenderProps<T>) => ReactNode)
  /** Explicit column configuration (alternative to children) */
  columns?: DatagridColumn<T>[]
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
  /** Component to render when row is expanded */
  expand?: ReactNode
  /** Function to determine if a row can be expanded */
  isRowExpandable?: (record: T) => boolean
  /** Custom cell renderer for all cells */
  cellRenderer?: (props: CellRendererProps<T>) => ReactNode | unknown
}

/**
 * Extract column source from a child element
 */
function getChildSource(child: ReactElement): string | undefined {
  const props = child.props as { source?: string; 'data-source'?: string }
  return props.source || props['data-source']
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
  expand,
  isRowExpandable,
  cellRenderer,
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

  // Determine if we're showing expand column
  const showExpand = Boolean(expand)

  // Track expanded rows by row index
  const [expandedRows, setExpandedRows] = useState<ExpandedState>({})

  // Use a ref to access expand state in cell renderers without causing column recreation
  const expandedRowsRef = useRef(expandedRows)
  expandedRowsRef.current = expandedRows

  // Check if children is a render props function
  const isRenderProps = typeof children === 'function'

  // Build columns from children or columnsProp
  const { tableColumns, childElements: _childElements, columnConfig } = useMemo(() => {
    const childElements: ReactElement[] = []
    const cols: ColumnDef<T>[] = []
    const columnConfigArray: DatagridColumn<T>[] = []

    if (columnsProp) {
      // Use explicit columns config with per-column render support
      columnsProp.forEach((col, index) => {
        columnConfigArray.push(col)
        cols.push({
          id: col.source,
          accessorKey: col.source,
          header: col.label || capitalize(col.source),
          enableSorting: col.sortable !== false,
          cell: ({ row, getValue }) => {
            const record = row.original
            const value = getValue()
            const rowIndex = row.index

            // If column has its own render function, use it
            if (col.render) {
              return col.render({ record, column: col.source, value, rowIndex })
            }

            // If global cellRenderer is provided, use it
            if (cellRenderer) {
              return cellRenderer({ record, column: col.source, value, rowIndex })
            }

            return String(value ?? '')
          },
        })
      })
    } else if (children && !isRenderProps) {
      // Extract columns from children
      Children.forEach(children as ReactNode, (child) => {
        if (isValidElement(child)) {
          const source = getChildSource(child)
          if (source) {
            childElements.push(child)
            columnConfigArray.push({ source })
            cols.push({
              id: source,
              accessorKey: source,
              header: capitalize(source),
              enableSorting: isChildSortable(child),
              cell: ({ row, getValue }) => {
                const record = row.original
                const value = getValue()
                const rowIndex = row.index

                // If global cellRenderer is provided, use it
                if (cellRenderer) {
                  return cellRenderer({ record, column: source, value, rowIndex })
                }

                return (
                  <RecordContextProvider value={record}>
                    {child}
                  </RecordContextProvider>
                )
              },
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

    return { tableColumns: cols, childElements, columnConfig: columnConfigArray }
  }, [children, columnsProp, cellRenderer, isRenderProps])

  // Toggle row expansion
  const toggleRowExpanded = useCallback((rowIndex: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }))
  }, [])

  // Check if a row can be expanded
  const canRowExpand = useCallback(
    (record: T) => {
      if (!showExpand) return false
      if (isRowExpandable) return isRowExpandable(record)
      return true
    },
    [showExpand, isRowExpandable]
  )

  // Add selection and expand columns if needed
  const finalColumns = useMemo(() => {
    let cols = [...tableColumns]

    // Add expand column at the beginning
    if (showExpand) {
      const expandColumn: ColumnDef<T> = {
        id: 'expand',
        header: '',
        cell: ({ row }) => {
          const record = row.original
          const canExpand = canRowExpand(record)
          if (!canExpand) return null

          // Use ref to access current expand state without causing column recreation
          const isExpanded = !!expandedRowsRef.current[row.index]
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleRowExpanded(row.index)
              }}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
              className="p-1 hover:bg-muted rounded"
            >
              {isExpanded ? '\u25BC' : '\u25B6'}
            </button>
          )
        },
        enableSorting: false,
      }
      cols = [expandColumn, ...cols]
    }

    // Add selection column at the beginning (after expand if present)
    if (showSelection) {
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
      cols = [cols[0], selectionColumn, ...cols.slice(showExpand ? 1 : 0)]
    }

    return cols
  }, [showSelection, showExpand, tableColumns, data, selectedIds, onSelect, onToggleItem, onUnselectItems, canRowExpand, toggleRowExpanded])

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

  // If children is a render props function, call it with data and columns
  if (isRenderProps && typeof children === 'function') {
    return (children as (props: DatagridRenderProps<T>) => ReactNode)({
      data: data ?? [],
      columns: columnConfig,
    })
  }

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
                    data-testid={`column-header-${header.column.id}`}
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
              const isExpanded = showExpand && expandedRows[rowIndex]

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
                  {isExpanded && (
                    <tr className="bg-muted/30">
                      <td colSpan={finalColumns.length} className="p-4">
                        {expand}
                      </td>
                    </tr>
                  )}
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
