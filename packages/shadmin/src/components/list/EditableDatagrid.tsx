/**
 * EditableDatagrid - A datagrid with inline cell editing capabilities
 *
 * Provides cell-level editing with:
 * - Double-click to enter edit mode
 * - Enter to save, Escape to cancel
 * - Tab/Shift+Tab for cell navigation
 * - Inline validation
 * - Batch save option
 * - Integration with data provider's update method
 *
 * @example
 * ```tsx
 * <EditableDatagrid>
 *   <TextField source="name" />
 *   <TextField source="email" />
 * </EditableDatagrid>
 * ```
 */

import {
  type ReactNode,
  type ReactElement,
  type ComponentType,
  type KeyboardEvent,
  type FocusEvent,
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react'
import { useListContext, type Identifier } from '../../contexts/ListContext'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { useDataProvider } from '../../contexts/DataProviderContext'
import type { RaRecord } from '../../types'

/**
 * Edit cell position
 */
interface EditCellPosition {
  rowId: Identifier
  columnIndex: number
  source: string
}

/**
 * Pending change for batch mode
 */
interface PendingChange<T extends RaRecord = RaRecord> {
  record: T
  field: string
  value: unknown
  originalValue: unknown
}

/**
 * Validation function type
 */
export type ValidateFn = (value: unknown) => string | undefined

/**
 * Custom input component props
 */
export interface EditInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => void
  autoFocus?: boolean
}

/**
 * Props for EditableDatagrid component
 */
export interface EditableDatagridProps<T extends RaRecord = RaRecord> {
  /** Child field components */
  children?: ReactNode
  /** Columns that can be edited (if not specified, all columns are editable) */
  editableColumns?: string[]
  /** Columns that are read-only */
  readOnlyColumns?: string[]
  /** Make the entire grid read-only */
  readOnly?: boolean
  /** Validation functions per column */
  validate?: Record<string, ValidateFn>
  /** Custom input components per column */
  editInputs?: Record<string, ComponentType<EditInputProps>>
  /** Enable batch save mode */
  batchSave?: boolean
  /** Callback after successful save */
  onSave?: (record: T) => void
  /** Callback when edit is cancelled */
  onCancel?: () => void
  /** Custom className */
  className?: string
}

/**
 * Extract column source from a child element
 */
function getChildSource(child: ReactElement): string | undefined {
  const props = child.props as { source?: string; 'data-source'?: string }
  return props.source || props['data-source']
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Default text input for editing
 */
function DefaultEditInput({
  value,
  onChange,
  onKeyDown,
  onBlur,
  autoFocus,
  ariaLabel,
}: EditInputProps & { ariaLabel?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [autoFocus])

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={ariaLabel}
    />
  )
}

/**
 * EditableCell component - handles rendering and editing of a single cell
 */
interface EditableCellProps<T extends RaRecord = RaRecord> {
  record: T
  source: string
  columnIndex: number
  isEditing: boolean
  editValue: string
  validationError: string | undefined
  isSaving: boolean
  saveError: string | null
  onDoubleClick: () => void
  onEditValueChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => void
  onBlur: (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => void
  onRetry: () => void
  CustomInput?: ComponentType<EditInputProps> | undefined
  children: ReactNode
}

function EditableCell<T extends RaRecord = RaRecord>({
  record,
  source,
  columnIndex: _columnIndex,
  isEditing,
  editValue,
  validationError,
  isSaving,
  saveError,
  onDoubleClick,
  onEditValueChange,
  onSave: _onSave,
  onCancel: _onCancel,
  onKeyDown,
  onBlur,
  onRetry,
  CustomInput,
  children,
}: EditableCellProps<T>) {
  if (isEditing) {
    const InputComponent = CustomInput
    return (
      <td className="p-2 align-middle" role="cell">
        <div className="flex flex-col gap-1">
          {InputComponent ? (
            <InputComponent
              value={editValue}
              onChange={onEditValueChange}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              autoFocus
            />
          ) : (
            <DefaultEditInput
              value={editValue}
              onChange={onEditValueChange}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              autoFocus
              ariaLabel={`Edit ${source}`}
            />
          )}
          {validationError && (
            <span className="text-red-500 text-xs">{validationError}</span>
          )}
          {isSaving && (
            <span role="status" className="text-gray-500 text-xs">
              Saving...
            </span>
          )}
          {saveError && (
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xs">{saveError}</span>
              <button
                type="button"
                onClick={onRetry}
                className="text-xs text-blue-500 hover:underline"
                aria-label="Retry save"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </td>
    )
  }

  return (
    <td
      className="p-2 align-middle cursor-pointer"
      onDoubleClick={onDoubleClick}
      role="cell"
    >
      <RecordContextProvider value={record}>{children}</RecordContextProvider>
    </td>
  )
}

/**
 * EditableDatagrid component - Datagrid with inline cell editing
 */
export function EditableDatagrid<T extends RaRecord = RaRecord>({
  children,
  editableColumns,
  readOnlyColumns = [],
  readOnly = false,
  validate = {},
  editInputs = {},
  batchSave = false,
  onSave,
  onCancel,
  className = '',
}: EditableDatagridProps<T>) {
  const { data, isLoading, resource, refetch } = useListContext<T>()
  const dataProvider = useDataProvider()

  // Track which cell is being edited
  const [editingCell, setEditingCell] = useState<EditCellPosition | null>(null)
  // Current edit value
  const [editValue, setEditValue] = useState<string>('')
  // Original value when editing started
  const [originalValue, setOriginalValue] = useState<unknown>(null)
  // Validation error for current cell
  const [validationError, setValidationError] = useState<string | undefined>()
  // Saving state
  const [isSaving, setIsSaving] = useState(false)
  // Save error
  const [saveError, setSaveError] = useState<string | null>(null)

  // Batch mode: track pending changes
  const [pendingChanges, setPendingChanges] = useState<Map<string, PendingChange<T>>>(
    new Map()
  )
  // Modified data for display in batch mode
  const [modifiedData, setModifiedData] = useState<Map<Identifier, T>>(new Map())

  // Build column info from children
  const columnInfo = useMemo(() => {
    const cols: Array<{ source: string; element: ReactElement }> = []

    Children.forEach(children as ReactNode, (child) => {
      if (isValidElement(child)) {
        const source = getChildSource(child)
        if (source) {
          cols.push({ source, element: child })
        }
      }
    })

    return cols
  }, [children])

  // Get display data (with batch modifications applied)
  const displayData = useMemo(() => {
    if (!data) return []
    if (!batchSave || modifiedData.size === 0) return data

    return data.map((record) => {
      const modified = modifiedData.get(record.id)
      return modified || record
    })
  }, [data, batchSave, modifiedData])

  // Check if a column is editable
  const isColumnEditable = useCallback(
    (source: string): boolean => {
      if (readOnly) return false
      if (readOnlyColumns.includes(source)) return false
      if (editableColumns) {
        return editableColumns.includes(source)
      }
      return true
    },
    [readOnly, readOnlyColumns, editableColumns]
  )

  // Start editing a cell
  const startEditing = useCallback(
    (record: T, source: string, columnIndex: number) => {
      if (!isColumnEditable(source)) return

      const value = record[source]
      setEditingCell({ rowId: record.id, columnIndex, source })
      setEditValue(String(value ?? ''))
      setOriginalValue(value)
      setValidationError(undefined)
      setSaveError(null)
    },
    [isColumnEditable]
  )

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setEditingCell(null)
    setEditValue('')
    setOriginalValue(null)
    setValidationError(undefined)
    setSaveError(null)
    onCancel?.()
  }, [onCancel])

  // Save the current edit
  const saveEdit = useCallback(async () => {
    if (!editingCell || !data) return

    const record = displayData.find((r) => r.id === editingCell.rowId)
    if (!record) return

    const { source } = editingCell

    // Check if value changed
    if (editValue === String(originalValue ?? '')) {
      setEditingCell(null)
      return
    }

    // Validate
    const validateFn = validate[source]
    if (validateFn) {
      const error = validateFn(editValue)
      if (error) {
        setValidationError(error)
        return
      }
    }

    setValidationError(undefined)

    // In batch mode, store the change but don't save yet
    if (batchSave) {
      const changeKey = `${record.id}-${source}`
      setPendingChanges((prev) => {
        const next = new Map(prev)
        next.set(changeKey, {
          record,
          field: source,
          value: editValue,
          originalValue,
        })
        return next
      })

      // Update modified data for display
      setModifiedData((prev) => {
        const next = new Map(prev)
        const existing = next.get(record.id) || { ...record }
        next.set(record.id, { ...existing, [source]: editValue } as T)
        return next
      })

      setEditingCell(null)
      return
    }

    // Save immediately via data provider
    setIsSaving(true)
    setSaveError(null)

    try {
      const updatedData = { ...record, [source]: editValue }
      await dataProvider.update(resource, {
        id: record.id,
        data: updatedData,
        previousData: record,
      })

      onSave?.(updatedData as T)
      setEditingCell(null)
      refetch()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }, [
    editingCell,
    data,
    displayData,
    editValue,
    originalValue,
    validate,
    batchSave,
    dataProvider,
    resource,
    onSave,
    refetch,
  ])

  // Retry save after error
  const retryEdit = useCallback(() => {
    setSaveError(null)
    saveEdit()
  }, [saveEdit])

  // Navigate to adjacent cell
  const navigateToCell = useCallback(
    (direction: 'next' | 'prev') => {
      if (!editingCell || !displayData.length) return

      const currentRowIndex = displayData.findIndex((r) => r.id === editingCell.rowId)
      if (currentRowIndex === -1) return

      let newRowIndex = currentRowIndex
      let newColumnIndex = editingCell.columnIndex

      if (direction === 'next') {
        // Try next column in same row
        newColumnIndex++
        if (newColumnIndex >= columnInfo.length) {
          // Move to next row
          newRowIndex++
          newColumnIndex = 0
        }
      } else {
        // Try previous column in same row
        newColumnIndex--
        if (newColumnIndex < 0) {
          // Move to previous row
          newRowIndex--
          newColumnIndex = columnInfo.length - 1
        }
      }

      // Check bounds
      if (newRowIndex < 0 || newRowIndex >= displayData.length) {
        // Save current and exit edit mode
        saveEdit()
        return
      }

      // Save current cell first (for batch mode, this stores the change)
      const record = displayData[currentRowIndex]
      if (!record) return
      const { source } = editingCell

      if (editValue !== String(originalValue ?? '')) {
        // In batch mode, store the change
        if (batchSave) {
          const changeKey = `${record.id}-${source}`
          setPendingChanges((prev) => {
            const next = new Map(prev)
            next.set(changeKey, {
              record,
              field: source,
              value: editValue,
              originalValue,
            })
            return next
          })

          setModifiedData((prev) => {
            const next = new Map(prev)
            const existing = next.get(record.id) || { ...record }
            next.set(record.id, { ...existing, [source]: editValue } as T)
            return next
          })
        }
      }

      // Navigate to new cell
      const newRecord = displayData[newRowIndex]
      const newColInfo = columnInfo[newColumnIndex]
      if (!newRecord || !newColInfo) return
      const newSource = newColInfo.source

      if (isColumnEditable(newSource)) {
        const newRecordWithModifications =
          modifiedData.get(newRecord.id) || newRecord
        startEditing(newRecordWithModifications, newSource, newColumnIndex)
      } else {
        // Skip non-editable cells by recursing
        setEditingCell({
          rowId: newRecord.id,
          columnIndex: newColumnIndex,
          source: newSource,
        })
        setEditValue('')
        // Continue navigating in same direction
        setTimeout(() => navigateToCell(direction), 0)
      }
    },
    [
      editingCell,
      displayData,
      columnInfo,
      editValue,
      originalValue,
      batchSave,
      modifiedData,
      isColumnEditable,
      startEditing,
      saveEdit,
    ]
  )

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        saveEdit()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        cancelEditing()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        if (e.shiftKey) {
          navigateToCell('prev')
        } else {
          navigateToCell('next')
        }
      }
    },
    [saveEdit, cancelEditing, navigateToCell]
  )

  // Handle blur
  const handleBlur = useCallback(
    (_e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      // Don't save on blur if there's a validation error or we're saving
      if (validationError || isSaving) return

      // Small delay to allow click events to fire first
      setTimeout(() => {
        if (editingCell) {
          saveEdit()
        }
      }, 100)
    },
    [editingCell, validationError, isSaving, saveEdit]
  )

  // Batch save all pending changes
  const batchSaveAll = useCallback(async () => {
    if (pendingChanges.size === 0) return

    setIsSaving(true)
    setSaveError(null)

    try {
      // Group changes by record ID
      const recordChanges = new Map<Identifier, Record<string, unknown>>()

      pendingChanges.forEach((change) => {
        const existing = recordChanges.get(change.record.id) || {}
        existing[change.field] = change.value
        recordChanges.set(change.record.id, existing)
      })

      // Save each record
      for (const [recordId, changes] of recordChanges) {
        const record = data?.find((r) => r.id === recordId)
        if (!record) continue

        const updatedData = { ...record, ...changes }
        await dataProvider.update(resource, {
          id: recordId,
          data: updatedData,
          previousData: record,
        })

        onSave?.(updatedData as T)
      }

      // Clear pending changes
      setPendingChanges(new Map())
      setModifiedData(new Map())
      refetch()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }, [pendingChanges, data, dataProvider, resource, onSave, refetch])

  // Cancel all pending changes
  const cancelAllChanges = useCallback(() => {
    setPendingChanges(new Map())
    setModifiedData(new Map())
    onCancel?.()
  }, [onCancel])

  // Loading state
  if (isLoading && !data) {
    return (
      <div role="status" aria-label="Loading">
        <table className={`w-full caption-bottom text-sm ${className}`}>
          <thead>
            <tr>
              {columnInfo.map((col) => (
                <th
                  key={col.source}
                  scope="col"
                  className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                >
                  {capitalize(col.source)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} data-testid="skeleton-row" className="animate-pulse">
                {columnInfo.map((col) => (
                  <td key={col.source} className="p-2">
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
  if (!displayData || displayData.length === 0) {
    return (
      <div className="relative w-full overflow-auto">
        <table className={`w-full caption-bottom text-sm ${className}`}>
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              {columnInfo.map((col) => (
                <th
                  key={col.source}
                  scope="col"
                  role="columnheader"
                  className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                >
                  {capitalize(col.source)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columnInfo.length} className="h-24 text-center">
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-auto">
      {/* Batch mode buttons */}
      {batchSave && pendingChanges.size > 0 && (
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={batchSaveAll}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            aria-label="Save all changes"
          >
            Save All
          </button>
          <button
            type="button"
            onClick={cancelAllChanges}
            disabled={isSaving}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 disabled:opacity-50"
            aria-label="Cancel all changes"
          >
            Cancel All
          </button>
        </div>
      )}

      <table className={`w-full caption-bottom text-sm ${className}`}>
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            {columnInfo.map((col) => (
              <th
                key={col.source}
                scope="col"
                role="columnheader"
                className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
              >
                {capitalize(col.source)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {displayData.map((record) => (
            <tr
              key={record.id}
              className="border-b transition-colors hover:bg-muted/50"
              role="row"
            >
              {columnInfo.map((col, columnIndex) => {
                const isThisCellEditing =
                  editingCell?.rowId === record.id &&
                  editingCell?.columnIndex === columnIndex

                return (
                  <EditableCell
                    key={`${record.id}-${col.source}`}
                    record={record}
                    source={col.source}
                    columnIndex={columnIndex}
                    isEditing={isThisCellEditing}
                    editValue={isThisCellEditing ? editValue : ''}
                    validationError={isThisCellEditing ? validationError : undefined}
                    isSaving={isThisCellEditing && isSaving}
                    saveError={isThisCellEditing ? saveError : null}
                    onDoubleClick={() => startEditing(record, col.source, columnIndex)}
                    onEditValueChange={setEditValue}
                    onSave={saveEdit}
                    onCancel={cancelEditing}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onRetry={retryEdit}
                    CustomInput={editInputs[col.source]}
                  >
                    {col.element}
                  </EditableCell>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

EditableDatagrid.displayName = 'EditableDatagrid'
