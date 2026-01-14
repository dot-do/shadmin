import { get } from 'lodash-es'
import { type AnchorHTMLAttributes } from 'react'

import { cn } from '@/utils'

import { useRecordContext } from '../../contexts/RecordContext'

import type { RaRecord } from '../../facade'

export interface UrlFieldProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
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
  /** Custom text to display instead of the URL */
  text?: string
  /** Whether to truncate the URL to just the domain */
  truncateUrl?: boolean
}

/**
 * Extract domain from URL for display
 */
function getDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return url
  }
}

/**
 * UrlField component displays a URL as a clickable link.
 *
 * @example
 * ```tsx
 * // Basic usage with RecordContext
 * <RecordContextProvider value={{ id: 1, website: 'https://example.com.ai' }}>
 *   <UrlField source="website" />
 * </RecordContextProvider>
 *
 * // With custom text
 * <UrlField source="website" text="Visit Site" />
 *
 * // Truncate to domain
 * <UrlField source="website" truncateUrl />
 *
 * // Open in same tab
 * <UrlField source="website" target="_self" />
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function UrlField({
  source,
  record: recordProp,
  label,
  emptyText,
  text,
  truncateUrl = false,
  className,
  target = '_blank',
  rel = 'noopener noreferrer',
  ...rest
}: UrlFieldProps) {
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
    const testId = (rest as Record<string, unknown>)['data-testid'] as string | undefined
    if (label) {
      return (
        <div className={cn('ra-field', sourceClass)}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span className={cn(className)} data-testid={testId}>
            {resolvedEmptyText}
          </span></p>
        </div>
      )
    }
    return (
      <span className={cn('ra-field', sourceClass, className)} data-testid={testId}>
        <p><span>{resolvedEmptyText}</span></p>
      </span>
    )
  }

  const url = String(rawValue)

  // Determine display text
  let displayText = url
  if (text) {
    displayText = text
  } else if (truncateUrl) {
    displayText = getDomain(url)
  }

  if (label) {
    return (
      <div className={cn('ra-field', sourceClass)}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <p><a
          href={url}
          target={target}
          rel={rel}
          className={cn('text-primary hover:underline', className)}
          {...rest}
        >
          <span>{displayText}</span>
        </a></p>
      </div>
    )
  }

  return (
    <span className={cn('ra-field', sourceClass)}>
      <p><a
        href={url}
        target={target}
        rel={rel}
        className={cn('text-primary hover:underline', className)}
        {...rest}
      >
        <span>{displayText}</span>
      </a></p>
    </span>
  )
}

UrlField.displayName = 'UrlField'
