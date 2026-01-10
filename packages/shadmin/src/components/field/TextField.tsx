import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from 'ra-core'

export interface TextFieldProps extends HTMLAttributes<HTMLSpanElement> {
  /** The field name in the record to display */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the value */
  label?: string
  /**
   * Text to display when value is empty/null/undefined.
   * - string: Display that string
   * - true: Display default empty text
   * - false | undefined: Display nothing
   */
  emptyText?: string | boolean
  /** MUI sx prop for styling (accepted for compatibility, ignored) */
  sx?: unknown
}

/**
 * TextField component displays a text value from a record field.
 * Wraps content in .ra-field and .ra-field-{source} for react-admin compatibility.
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
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function TextField({
  source,
  record: recordProp,
  label,
  emptyText,
  className,
  ...rest
}: TextFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  const value = get(record, source)

  // Resolve emptyText: false/undefined = '', true = default, string = as-is
  const resolvedEmptyText =
    emptyText === false || emptyText === undefined
      ? ''
      : emptyText === true
        ? DEFAULT_EMPTY_TEXT
        : emptyText

  const displayValue = value == null ? resolvedEmptyText : String(value)

  // Convert source to valid CSS class name (replace dots with dashes)
  const sourceClass = `ra-field-${source.replace(/\./g, '-')}`

  if (label) {
    return (
      <div className={cn('ra-field', sourceClass, className)} {...rest}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <p><span>{displayValue}</span></p>
      </div>
    )
  }

  return (
    <span className={cn('ra-field', sourceClass, className)} {...rest}>
      <p><span>{displayValue}</span></p>
    </span>
  )
}

TextField.displayName = 'TextField'
