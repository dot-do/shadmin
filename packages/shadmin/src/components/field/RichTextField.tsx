import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../facade'

export interface RichTextFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** The field name in the record containing HTML content */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the content. Set to `false` to hide the label. */
  label?: string | false
  /**
   * Text to display when value is empty/null/undefined.
   * - string: Display that string
   * - true: Display default empty text
   * - false | undefined: Display nothing
   */
  emptyText?: string | boolean
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
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function RichTextField({
  source,
  record: recordProp,
  label,
  emptyText,
  stripTags = false,
  className,
  ...rest
}: RichTextFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Resolve emptyText: false/undefined = '', true = default, string = as-is
  const resolvedEmptyText =
    emptyText === false || emptyText === undefined
      ? ''
      : emptyText === true
        ? DEFAULT_EMPTY_TEXT
        : emptyText

  const value = get(record, source)
  const isEmpty = value == null || value === ''

  // Convert source to valid CSS class name (replace dots with dashes)
  const sourceClass = `ra-field-${source.replace(/\./g, '-')}`

  // Handle empty state
  if (isEmpty) {
    if (label) {
      return (
        <div className={cn('ra-field', sourceClass, className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span>{resolvedEmptyText}</span></p>
        </div>
      )
    }
    return (
      <div className={cn('ra-field', sourceClass, className)} {...rest}>
        <p><span>{resolvedEmptyText}</span></p>
      </div>
    )
  }

  const htmlContent = String(value)

  // Strip tags mode - render as plain text
  if (stripTags) {
    const plainText = stripHtmlTags(htmlContent)
    if (label) {
      return (
        <div className={cn('ra-field', sourceClass, className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span>{plainText}</span></p>
        </div>
      )
    }
    return (
      <span className={cn('ra-field', sourceClass, className)} {...rest}>
        <p><span>{plainText}</span></p>
      </span>
    )
  }

  // Render HTML content
  if (label) {
    return (
      <div className={cn('ra-field', sourceClass, className)} {...rest}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <p><span dangerouslySetInnerHTML={{ __html: htmlContent }} /></p>
      </div>
    )
  }

  return (
    <div className={cn('ra-field', sourceClass, className)} {...rest}>
      <p><span dangerouslySetInnerHTML={{ __html: htmlContent }} /></p>
    </div>
  )
}

RichTextField.displayName = 'RichTextField'
