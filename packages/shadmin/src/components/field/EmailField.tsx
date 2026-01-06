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
  /** Text to display when value is empty/null/undefined */
  emptyText?: string
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
export function EmailField({
  source,
  record: recordProp,
  label,
  emptyText = '',
  className,
  ...rest
}: EmailFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  const rawValue = get(record, source)

  // Handle null, undefined, or empty string
  if (rawValue == null || rawValue === '') {
    if (label) {
      return (
        <div>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <span className={cn(className)} data-testid={rest['data-testid']}>
            {emptyText}
          </span>
        </div>
      )
    }
    return (
      <span className={cn(className)} data-testid={rest['data-testid']}>
        {emptyText}
      </span>
    )
  }

  const email = String(rawValue)

  if (label) {
    return (
      <div>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <a href={`mailto:${email}`} className={cn('text-primary hover:underline', className)} {...rest}>
          {email}
        </a>
      </div>
    )
  }

  return (
    <a href={`mailto:${email}`} className={cn('text-primary hover:underline', className)} {...rest}>
      {email}
    </a>
  )
}

EmailField.displayName = 'EmailField'
