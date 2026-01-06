import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

export interface RichTextFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** The field name in the record containing HTML content */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the content */
  label?: string
  /** Text to display when value is empty/null/undefined */
  emptyText?: string
  /** Strip HTML tags and render as plain text */
  stripTags?: boolean
}

/**
 * Strip HTML tags from a string
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * RichTextField component displays HTML content from a record field.
 * Uses dangerouslySetInnerHTML to render HTML content.
 *
 * @example
 * ```tsx
 * // Basic usage with RecordContext
 * <RecordContextProvider value={{ id: 1, body: '<p>Hello <strong>World</strong></p>' }}>
 *   <RichTextField source="body" />
 * </RecordContextProvider>
 *
 * // With nested field access
 * <RichTextField source="post.body" />
 *
 * // With label
 * <RichTextField source="content" label="Article Body" />
 *
 * // Strip HTML tags for plain text display
 * <RichTextField source="content" stripTags />
 *
 * // With custom empty text
 * <RichTextField source="content" emptyText="No content available" />
 * ```
 */
export function RichTextField({
  source,
  record: recordProp,
  label,
  emptyText = '',
  stripTags = false,
  className,
  ...rest
}: RichTextFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  const value = get(record, source)
  const isEmpty = value == null || value === ''

  // Handle empty state
  if (isEmpty) {
    if (label) {
      return (
        <div className={cn(className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <span>{emptyText}</span>
        </div>
      )
    }
    return (
      <div className={cn(className)} {...rest}>
        {emptyText}
      </div>
    )
  }

  const htmlContent = String(value)

  // Strip tags mode - render as plain text
  if (stripTags) {
    const plainText = stripHtmlTags(htmlContent)
    if (label) {
      return (
        <div className={cn(className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <span>{plainText}</span>
        </div>
      )
    }
    return (
      <span className={cn(className)} {...rest}>
        {plainText}
      </span>
    )
  }

  // Render HTML content
  if (label) {
    return (
      <div className={cn(className)} {...rest}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    )
  }

  return (
    <div
      className={cn(className)}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      {...rest}
    />
  )
}

RichTextField.displayName = 'RichTextField'
