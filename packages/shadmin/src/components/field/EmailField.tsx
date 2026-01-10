import { type AnchorHTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

export interface EmailFieldProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
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
}

/**
 * EmailField component displays an email as a clickable mailto link.
 *
 * @example
 * ```tsx
 * // Basic usage with RecordContext
 * <RecordContextProvider value={{ id: 1, email: 'john@example.com' }}>
 *   <EmailField source="email" />
 * </RecordContextProvider>
 *
 * // With label
 * <EmailField source="email" label="Email Address" />
 *
 * // With custom styling
 * <EmailField source="email" className="text-blue-600 underline" />
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function EmailField({
  source,
  record: recordProp,
  label,
  emptyText,
  className,
  ...rest
}: EmailFieldProps) {
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

  // Handle null, undefined, or empty string
  if (rawValue == null || rawValue === '') {
    if (label) {
      return (
        <div className={cn('ra-field', sourceClass)}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span className={cn(className)} data-testid={rest['data-testid']}>
            {resolvedEmptyText}
          </span></p>
        </div>
      )
    }
    return (
      <span className={cn('ra-field', sourceClass, className)} data-testid={rest['data-testid']}>
        <p><span>{resolvedEmptyText}</span></p>
      </span>
    )
  }

  const email = String(rawValue)

  if (label) {
    return (
      <div className={cn('ra-field', sourceClass)}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <p><a href={`mailto:${email}`} className={cn('text-primary hover:underline', className)} {...rest}>
          <span>{email}</span>
        </a></p>
      </div>
    )
  }

  return (
    <span className={cn('ra-field', sourceClass)}>
      <p><a href={`mailto:${email}`} className={cn('text-primary hover:underline', className)} {...rest}>
        <span>{email}</span>
      </a></p>
    </span>
  )
}

EmailField.displayName = 'EmailField'
