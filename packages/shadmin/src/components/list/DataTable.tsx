import type { RaRecord } from '../../types'
import { Datagrid, type DatagridProps } from './Datagrid'

/**
 * Props for DataTable component
 * Extends all Datagrid props for full compatibility
 */
export interface DataTableProps<T extends RaRecord = RaRecord> extends DatagridProps<T> {}

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
  return <Datagrid<T> {...props} />
}

DataTable.displayName = 'DataTable'
