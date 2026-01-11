/**
 * VirtualDatagrid Component
 * High-performance virtualized datagrid for large datasets (10K+ rows)
 * Uses @tanstack/react-virtual for windowing
 *
 * Issue: shadmin-ae57 (P2)
 */

import {
  type ReactNode,
  type ReactElement,
  type CSSProperties,
  type MouseEvent,
  type ComponentType,
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
  createElement,
} from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type Row,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useListContext, type Identifier } from '../../contexts/ListContext'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { cn } from '../../utils'
import type { RaRecord } from '../../types'
import type { DatagridColumn, CellRendererProps, RowClickHandler } from './Datagrid'

/**
 * Props for VirtualDatagrid component
 */
export interface VirtualDatagridProps<T extends RaRecord = RaRecord> {
  /** Child field components - each becomes a column */
  children?: ReactNode
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
  expand?: ReactNode | ComponentType
  /** Function to determine if a row can be expanded */
  isRowExpandable?: (record: T) => boolean
  /** Custom cell renderer for all cells */
  cellRenderer?: (props: CellRendererProps<T>) => ReactNode | unknown
  /** Fixed height of the virtual container (required for virtualization) */
  height?: number | string
  /** Estimated row height for virtualization (default: 48) */
  estimateRowHeight?: number | ((index: number) => number)
  /** Number of rows to render outside visible area (default: 5) */
  overscan?: number
  /** Enable dynamic row height measurement (default: false) */
  dynamicRowHeight?: boolean
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
 * VirtualDatagrid - High-performance virtualized datagrid for large datasets
 *
 * Uses @tanstack/react-virtual for windowing to efficiently render
 * only visible rows, enabling smooth scrolling with 10K+ rows.
 *
 * @example
 * ```tsx
 * // Basic usage - must specify height
 * <VirtualDatagrid height={600}>
 *   <TextField source="name" />
 *   <TextField source="email" />
 * </VirtualDatagrid>
 * ```
 *
 * @example
 * ```tsx
 * // With dynamic row heights
 * <VirtualDatagrid
 *   height={600}
 *   dynamicRowHeight
 *   estimateRowHeight={48}
 *   overscan={10}
 * >
 *   <TextField source="name" />
 *   <TextField source="description" />
 * </VirtualDatagrid>
 * ```
 */
export function VirtualDatagrid<T extends RaRecord = RaRecord>({
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
  height = 600,
  estimateRowHeight = 48,
  overscan = 5,
  dynamicRowHeight = false,
}: VirtualDatagridProps<T>) {
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

  const containerRef = useRef<HTMLDivElement>(null)
  const headerCheckboxRef = useRef<HTMLInputElement>(null)

  // Determine if we're showing selection checkboxes
  const showSelection = Boolean(bulkActionButtons)

  // Determine if we're showing expand column
  const showExpand = Boolean(expand)

  // Track expanded rows by row index
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})

  // Build columns from children or columnsProp
  const { tableColumns } = useMemo(() => {
    const cols: ColumnDef<T>[] = []

    if (columnsProp) {
      // Use explicit columns config with per-column render support
      columnsProp.forEach((col) => {
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
    } else if (children) {
      // Extract columns from children
      Children.forEach(children as ReactNode, (child) => {
        if (isValidElement(child)) {
          const source = getChildSource(child)
          if (source) {
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

    return { tableColumns: cols }
  }, [children, columnsProp, cellRenderer])

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

    // Checkbox styling for shadcn pattern
    const checkboxClassName = 'h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-primary'

    // Add expand column at the beginning
    if (showExpand) {
      const expandColumn: ColumnDef<T> = {
        id: 'expand',
        header: '',
        size: 40,
        cell: ({ row }) => {
          const record = row.original
          const canExpand = canRowExpand(record)
          if (!canExpand) return null

          const isExpanded = expandedRows[row.index] || false
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleRowExpanded(row.index)
              }}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
              className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded-sm',
                'text-muted-foreground hover:bg-muted hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                'transition-colors'
              )}
            >
              <svg
                className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
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
        size: 40,
        header: ({ table }) => (
          <input
            ref={headerCheckboxRef}
            type="checkbox"
            className={checkboxClassName}
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
            data-testid="shadmin-virtual-datagrid-select-all"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={selectedIds.includes(row.original.id as Identifier)}
            onChange={() => onToggleItem(row.original.id as Identifier)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select row ${row.original.id}`}
            data-testid={`shadmin-virtual-datagrid-row-select-${row.index}`}
          />
        ),
        enableSorting: false,
      }
      if (showExpand) {
        // Insert selection after expand column
        const expandCol = cols[0]
        if (expandCol) {
          cols = [expandCol, selectionColumn, ...cols.slice(1)]
        } else {
          cols = [selectionColumn, ...cols]
        }
      } else {
        // Insert selection at the beginning
        cols = [selectionColumn, ...cols]
      }
    }

    return cols
  }, [showSelection, showExpand, tableColumns, data, selectedIds, onSelect, onToggleItem, onUnselectItems, canRowExpand, toggleRowExpanded, expandedRows])

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
  })

  const { rows } = table.getRowModel()

  // Create virtualizer for rows
  const measureElementFn = dynamicRowHeight && typeof window !== 'undefined'
    ? (element: Element) => element?.getBoundingClientRect().height ?? (estimateRowHeight as number)
    : null
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: typeof estimateRowHeight === 'function' ? estimateRowHeight : () => estimateRowHeight,
    overscan,
    ...(measureElementFn && { measureElement: measureElementFn }),
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  // Update header checkbox indeterminate state
  useEffect(() => {
    if (headerCheckboxRef.current && showSelection && data) {
      const someSelected = selectedIds.length > 0 && selectedIds.length < data.length
      headerCheckboxRef.current.indeterminate = someSelected
    }
  }, [selectedIds, data, showSelection])

  // Handle row click
  const handleRowClick = useCallback(
    (record: T, _index: number, event: MouseEvent) => {
      if (rowClick === false || rowClick === undefined) return

      if (typeof rowClick === 'function') {
        rowClick(record, record.id as Identifier, event)
      }
    },
    [rowClick]
  )

  // Determine if rows are clickable
  const isRowClickable = Boolean(rowClick) && rowClick !== false

  // Row height calculation is used inline in the component
  // (keeping size prop available for future use)

  // Build table classes
  const tableClasses = cn(
    'w-full caption-bottom text-sm border-collapse',
    size === 'sm' && 'text-xs compact sm [&_th]:h-8 [&_th]:px-1.5 [&_td]:p-1.5',
    size === 'lg' && 'text-base large lg [&_th]:h-12 [&_th]:px-4 [&_td]:p-4',
    className
  )

  // Container height style
  const containerStyle: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    overflow: 'auto',
  }

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

  if (isEmpty) {
    return (
      <div className="relative w-full overflow-auto" data-testid="shadmin-virtual-datagrid">
        <table className={tableClasses}>
          <thead className="[&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <tr>
              <td colSpan={finalColumns.length} className="h-24 text-center">
                {empty || <span>No data available</span>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  // Render virtual row
  const renderVirtualRow = (virtualRow: (typeof virtualRows)[0], row: Row<T>) => {
    const record = row.original
    const rowIndex = virtualRow.index
    const customStyle = rowStyle ? rowStyle(record, rowIndex) : undefined
    const isExpanded = showExpand && expandedRows[rowIndex]

    return (
      <RecordContextProvider key={row.id} value={record}>
        <tr
          data-index={virtualRow.index}
          ref={dynamicRowHeight ? (node) => rowVirtualizer.measureElement(node) : undefined}
          className={cn(
            'border-b transition-colors',
            hover && 'hover:bg-muted/50',
            isRowClickable && 'cursor-pointer',
            selectedIds.includes(record.id as Identifier) && 'bg-muted/50'
          )}
          style={{
            ...customStyle,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: dynamicRowHeight ? undefined : `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }}
          onClick={
            isRowClickable
              ? (e) => handleRowClick(record, rowIndex, e)
              : undefined
          }
          data-testid={`shadmin-virtual-datagrid-row-${rowIndex}`}
          data-selected={selectedIds.includes(record.id as Identifier) || undefined}
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="p-2 align-middle [&:has([role=checkbox])]:pr-0">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
        {isExpanded && (
          <tr
            className="bg-muted/30"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start + virtualRow.size}px)`,
            }}
          >
            <td colSpan={finalColumns.length} className="p-4">
              {typeof expand === 'function' ? createElement(expand) : expand}
            </td>
          </tr>
        )}
      </RecordContextProvider>
    )
  }

  return (
    <div className="relative w-full" data-testid="shadmin-virtual-datagrid">
      {/* Fixed header */}
      <table className={tableClasses}>
        <thead className="[&_tr]:border-b sticky top-0 z-10 bg-background">
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
                    className={cn(
                      'h-10 px-2 text-left align-middle font-medium text-muted-foreground',
                      '[&:has([role=checkbox])]:pr-0',
                      canSort && 'cursor-pointer select-none hover:text-foreground transition-colors'
                    )}
                    aria-sort={sortDirection}
                    onClick={canSort ? () => handleSortChange(header.column.id) : undefined}
                    style={{ width: header.column.getSize() !== 150 ? header.column.getSize() : undefined }}
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
      </table>

      {/* Virtualized body */}
      <div
        ref={containerRef}
        style={containerStyle}
        className="overflow-auto"
      >
        <table className={tableClasses} style={{ height: totalSize, width: '100%', position: 'relative' }}>
          <tbody className="[&_tr:last-child]:border-0">
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]
              if (!row) return null
              return renderVirtualRow(virtualRow, row)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

VirtualDatagrid.displayName = 'VirtualDatagrid'
