import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

export interface DateFieldProps extends HTMLAttributes<HTMLSpanElement> {
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
  /** Locale(s) to use for date formatting */
  locales?: string | string[]
  /** Options for Intl.DateTimeFormat */
  options?: Intl.DateTimeFormatOptions
  /** Whether to show time in addition to date */
  showTime?: boolean
}

/**
 * DateField component displays a formatted date value from a record field.
 * Uses Intl.DateTimeFormat for internationalized date formatting.
 * Wraps content in .ra-field and .ra-field-{source} for react-admin compatibility.
 *
 * @example
 * ```tsx
 * // Basic usage with RecordContext
 * <RecordContextProvider value={{ id: 1, createdAt: '2024-01-15' }}>
 *   <DateField source="createdAt" />
 * </RecordContextProvider>
 *
 * // With custom format
 * <DateField source="date" options={{ dateStyle: 'long' }} />
 *
 * // With time
 * <DateField source="date" showTime />
 *
 * // With German locale
 * <DateField source="date" locales="de-DE" />
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function DateField({
  source,
  record: recordProp,
  label,
  emptyText,
  locales,
  options,
  showTime = false,
  className,
  ...rest
}: DateFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Resolve emptyText: false/undefined = '', true = default, string = as-is
  const resolvedEmptyText =
    emptyText === false || emptyText === undefined
      ? ''
      : emptyText === true
        ? DEFAULT_EMPTY_TEXT
        : emptyText

  const rawValue = get(record, source)

  // Convert source to valid CSS class name (replace dots with dashes)
  const sourceClass = `ra-field-${source.replace(/\./g, '-')}`

  // Handle null, undefined, or empty values
  if (rawValue == null) {
    if (label) {
      return (
        <div className={cn('ra-field', sourceClass, className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span>{resolvedEmptyText}</span></p>
        </div>
      )
    }
    return (
      <span className={cn('ra-field', sourceClass, className)} {...rest}>
        <p><span>{resolvedEmptyText}</span></p>
      </span>
    )
  }

  // Convert to Date object
  let dateValue: Date
  if (rawValue instanceof Date) {
    dateValue = rawValue
  } else if (typeof rawValue === 'number') {
    dateValue = new Date(rawValue)
  } else if (typeof rawValue === 'string') {
    dateValue = new Date(rawValue)
  } else {
    // Invalid type
    if (label) {
      return (
        <div className={cn('ra-field', sourceClass, className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span>{resolvedEmptyText}</span></p>
        </div>
      )
    }
    return (
      <span className={cn('ra-field', sourceClass, className)} {...rest}>
        <p><span>{resolvedEmptyText}</span></p>
      </span>
    )
  }

  // Check for invalid date
  if (isNaN(dateValue.getTime())) {
    if (label) {
      return (
        <div className={cn('ra-field', sourceClass, className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span>{resolvedEmptyText}</span></p>
        </div>
      )
    }
    return (
      <span className={cn('ra-field', sourceClass, className)} {...rest}>
        <p><span>{resolvedEmptyText}</span></p>
      </span>
    )
  }

  // Build format options
  let formatOptions = options
  if (showTime && !options) {
    formatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }
  }

  // Format the date
  const formatter = new Intl.DateTimeFormat(locales, formatOptions)
  const displayValue = formatter.format(dateValue)

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

DateField.displayName = 'DateField'
