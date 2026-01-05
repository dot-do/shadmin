import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext, type RaRecord } from '../../contexts/RecordContext'

export interface NumberFieldProps extends HTMLAttributes<HTMLSpanElement> {
  /** The field name in the record to display */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the value */
  label?: string
  /** Text to display when value is empty/null/undefined */
  emptyText?: string
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
export function NumberField({
  source,
  record: recordProp,
  label,
  emptyText = '',
  locales,
  options,
  className,
  ...rest
}: NumberFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  const rawValue = get(record, source)

  // Handle null, undefined, or empty values
  if (rawValue == null) {
    if (label) {
      return (
        <div className={cn(className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <span>{emptyText}</span>
        </div>
      )
    }
    return (
      <span className={cn(className)} {...rest}>
        {emptyText}
      </span>
    )
  }

  // Convert to number
  const numValue = typeof rawValue === 'number' ? rawValue : parseFloat(rawValue as string)

  // Check if it's a valid number
  if (isNaN(numValue)) {
    if (label) {
      return (
        <div className={cn(className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <span>{emptyText}</span>
        </div>
      )
    }
    return (
      <span className={cn(className)} {...rest}>
        {emptyText}
      </span>
    )
  }

  // Format the number
  const formatter = new Intl.NumberFormat(locales, options)
  const displayValue = formatter.format(numValue)

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

NumberField.displayName = 'NumberField'
