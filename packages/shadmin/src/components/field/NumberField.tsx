import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../facade'

export interface NumberFieldProps extends HTMLAttributes<HTMLSpanElement> {
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
  /** Locale(s) to use for number formatting */
  locales?: string | string[]
  /** Options for Intl.NumberFormat */
  options?: Intl.NumberFormatOptions
}

/**
 * NumberField component displays a formatted number value from a record field.
 *
 * @example
 * ```tsx
 * // Basic usage with RecordContext
 * <RecordContextProvider value={{ id: 1, count: 1234 }}>
 *   <NumberField source="count" />
 * </RecordContextProvider>
 *
 * // With currency formatting
 * <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 *
 * // With percentage formatting
 * <NumberField source="rate" options={{ style: 'percent' }} />
 *
 * // With German locale
 * <NumberField source="amount" locales="de-DE" />
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function NumberField({
  source,
  record: recordProp,
  label,
  emptyText,
  locales,
  options,
  className,
  ...rest
}: NumberFieldProps) {
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
        <div className={cn('ra-field', sourceClass, className)} data-testid="shadmin-number-field" {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span>{resolvedEmptyText}</span></p>
        </div>
      )
    }
    return (
      <span className={cn('ra-field', sourceClass, className)} data-testid="shadmin-number-field" {...rest}>
        <p><span>{resolvedEmptyText}</span></p>
      </span>
    )
  }

  // Convert to number
  const numValue = typeof rawValue === 'number' ? rawValue : parseFloat(rawValue as string)

  // Check if it's a valid number
  if (isNaN(numValue)) {
    if (label) {
      return (
        <div className={cn('ra-field', sourceClass, className)} data-testid="shadmin-number-field" {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span>{resolvedEmptyText}</span></p>
        </div>
      )
    }
    return (
      <span className={cn('ra-field', sourceClass, className)} data-testid="shadmin-number-field" {...rest}>
        <p><span>{resolvedEmptyText}</span></p>
      </span>
    )
  }

  // Format the number
  const formatter = new Intl.NumberFormat(locales, options)
  const displayValue = formatter.format(numValue)

  if (label) {
    return (
      <div className={cn('ra-field', sourceClass, className)} data-testid="shadmin-number-field" {...rest}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <p><span>{displayValue}</span></p>
      </div>
    )
  }

  return (
    <span className={cn('ra-field', sourceClass, className)} data-testid="shadmin-number-field" {...rest}>
      <p><span>{displayValue}</span></p>
    </span>
  )
}

NumberField.displayName = 'NumberField'
