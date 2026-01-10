/**
 * RecordField Component (Stub)
 * Displays a field value from the current record.
 *
 * This is a placeholder component - implementation pending.
 */

import type { ReactNode } from 'react'

/**
 * Props for RecordField component
 */
export interface RecordFieldProps {
  /** The field source (property name) in the record */
  source: string
  /** Custom field component to render instead of the default behavior */
  field?: React.ComponentType<any>
  /** Custom label for the field */
  label?: ReactNode
  /** Additional CSS class name */
  className?: string
  /**
   * Text to display when the value is empty.
   * - string: Display that string
   * - true: Display default empty text
   * - false | undefined: Display nothing
   */
  emptyText?: string | boolean
  /** Children to render (optional) */
  children?: ReactNode
}

/**
 * RecordField - Displays a field value from the current record
 *
 * This is a stub component. Full implementation pending.
 *
 * @example
 * ```tsx
 * <RecordField source="name" />
 * <RecordField source="createdAt" field={DateField} />
 * ```
 */
export function RecordField({ field: FieldComponent, ...props }: RecordFieldProps): ReactNode {
  // If a custom field component is provided, render it instead
  if (FieldComponent) {
    return <FieldComponent {...props} />
  }

  // Stub implementation - returns null
  return null
}

export default RecordField
