/**
 * MdxDatagrid - Wrapper that connects @mdxui/admin's DatabaseGrid to ListContext
 *
 * This component automatically integrates with react-admin's ListContext
 * to display data in @mdxui/admin's Supabase-style DatabaseGrid.
 */

import { useMemo, useCallback, useRef, type ComponentProps } from 'react'
import { DatabaseGrid, type DatabaseColumnDef } from '@mdxui/admin'
import { useListContext, type Identifier } from '../../../contexts/ListContext'
import { useUpdate } from '../../../hooks/useUpdate'
import { useDelete } from '../../../hooks/useDelete'
import { useCreate } from '../../../hooks/useCreate'
import { useResourceContext } from '../../../contexts/ResourceContext'
import type { RaRecord } from '../../../types'

type DatabaseGridType = typeof DatabaseGrid<Record<string, unknown>>
type DatabaseGridBaseProps = ComponentProps<DatabaseGridType>

/**
 * Props for MdxDatagrid component
 */
export interface MdxDatagridProps<T extends RaRecord = RaRecord>
  extends Omit<DatabaseGridBaseProps, 'data' | 'isLoading' | 'onCellUpdate' | 'onInsert' | 'onDeleteRows' | 'onSelectionChange'> {
  /** Column definitions for the grid */
  columns: DatabaseColumnDef[]
  /** Enable inline editing (calls dataProvider.update on cell changes) */
  editable?: boolean
  /** Enable row creation (shows add row button) */
  enableCreate?: boolean
  /** Enable row deletion (shows delete option in context menu) */
  enableDelete?: boolean
  /** Custom empty message */
  emptyMessage?: string
  /** Additional CSS class name */
  className?: string
}

/**
 * MdxDatagrid - DatabaseGrid connected to react-admin's ListContext
 *
 * This component provides a Supabase-style spreadsheet interface that
 * automatically connects to react-admin's data layer.
 *
 * @example
 * ```tsx
 * import { List, MdxDatagrid } from 'shadmin'
 *
 * const columns = [
 *   { accessorKey: 'id', header: 'ID', dataType: 'number', editable: false },
 *   { accessorKey: 'name', header: 'Name', dataType: 'text' },
 *   { accessorKey: 'email', header: 'Email', dataType: 'email' },
 *   { accessorKey: 'active', header: 'Active', dataType: 'boolean' },
 *   { accessorKey: 'created_at', header: 'Created', dataType: 'date', editable: false },
 * ]
 *
 * <List resource="users">
 *   <MdxDatagrid columns={columns} editable enableCreate enableDelete />
 * </List>
 * ```
 */
export function MdxDatagrid<T extends RaRecord = RaRecord>({
  columns,
  editable = false,
  enableCreate = false,
  enableDelete = false,
  emptyMessage = 'No data available',
  className,
  ...rest
}: MdxDatagridProps<T>) {
  const resource = useResourceContext()
  const { data, isLoading, onSelect, onUnselectItems } = useListContext<T>()
  const [update] = useUpdate()
  const [deleteOne] = useDelete()
  const [create] = useCreate()

  // Ref for clearing selection after operations
  const selectionRef = useRef<{ clearSelection: () => void } | null>(null)

  // Convert ListContext data to DatabaseGrid format
  const gridData = useMemo(() => {
    return (data ?? []) as unknown as Record<string, unknown>[]
  }, [data])

  // Handle cell updates via dataProvider
  const handleCellUpdate = useCallback(
    async (rowIndex: number, columnId: string, value: unknown) => {
      if (!editable || !data || !resource) return

      const record = data[rowIndex]
      if (!record) return

      try {
        await update(resource, {
          id: record.id as Identifier,
          data: { [columnId]: value },
          previousData: record,
        })
      } catch {
        // Error handling is delegated to the data provider and error boundaries
      }
    },
    [editable, data, resource, update]
  )

  // Handle row insertion via dataProvider
  const handleInsert = useCallback(
    async (row: Record<string, unknown>) => {
      if (!enableCreate || !resource) return

      try {
        await create(resource, { data: row })
      } catch {
        // Error handling is delegated to the data provider and error boundaries
      }
    },
    [enableCreate, resource, create]
  )

  // Handle row deletion via dataProvider
  const handleDeleteRows = useCallback(
    async (rowIds: string[]) => {
      if (!enableDelete || !resource) return

      try {
        // Delete rows one by one (could be optimized with deleteMany)
        for (const id of rowIds) {
          await deleteOne(resource, { id })
        }
        onUnselectItems()
        selectionRef.current?.clearSelection()
      } catch {
        // Error handling is delegated to the data provider and error boundaries
      }
    },
    [enableDelete, resource, deleteOne, onUnselectItems]
  )

  // Sync selection with ListContext
  const handleSelectionChange = useCallback(
    (selectedRowIds: string[]) => {
      onSelect(selectedRowIds as unknown as Identifier[])
    },
    [onSelect]
  )

  return (
    <DatabaseGrid<Record<string, unknown>>
      data={gridData}
      columns={columns}
      isLoading={isLoading}
      onCellUpdate={editable ? handleCellUpdate : undefined}
      onInsert={enableCreate ? handleInsert : undefined}
      onDeleteRows={enableDelete ? handleDeleteRows : undefined}
      onSelectionChange={handleSelectionChange}
      emptyMessage={emptyMessage}
      className={className}
      {...rest}
    />
  )
}

export default MdxDatagrid
