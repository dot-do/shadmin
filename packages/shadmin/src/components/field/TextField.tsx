import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

export interface TextFieldProps extends HTMLAttributes<HTMLSpanElement> {
  /** The field name in the record to display */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the value */
  label?: string
  /** Text to display when value is empty/null/undefined */
  emptyText?: string
}

/**
 * TextField component displays a text value from a record field.
 *
 * @example
 * ```tsx
 * // Basic usage with RecordContext
 * <RecordContextProvider value={{ id: 1, name: 'John' }}>
 *   <TextField source="name" />
 * </RecordContextProvider>
 *
 * // With nested field access
 * <TextField source="author.name" />
 *
 * // With label
 * <TextField source="name" label="Full Name" />
 *
 * // With custom empty text
 * <TextField source="nickname" emptyText="N/A" />
 * ```
 */
export function TextField({
  source,
  record: recordProp,
  label,
  emptyText = '',
  className,
  ...rest
}: TextFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  const value = get(record, source)
  const displayValue = value == null ? emptyText : String(value)

  if (label) {
    return (
      <div className={cn(className)} {...rest}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <span>{displayValue}</span>
      </div>
    )
  }

  return (
    <span className={cn(className)} {...rest}>
      {displayValue}
    </span>
  )
}

TextField.displayName = 'TextField'
