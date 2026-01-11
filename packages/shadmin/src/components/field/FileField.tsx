import { type AnchorHTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../facade'

/**
 * File object type for FileField
 */
export interface FileValue {
  src?: string
  url?: string
  title?: string
  [key: string]: unknown
}

export interface FileFieldProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
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
  /**
   * Title for the link text.
   * If it matches a field name in the record/file object, uses that field's value.
   * Otherwise uses the string directly.
   */
  title?: string
  /**
   * For object/array sources, the field name containing the file URL.
   * Defaults to 'src', also checks 'url'.
   */
  src?: string
  /**
   * Whether to download the file instead of opening it
   */
  download?: boolean | string
}

/**
 * Extract filename from URL for display
 */
function getFilename(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop()
    return filename || url
  } catch {
    // If not a valid URL, try to get last path segment
    const parts = url.split('/')
    return parts[parts.length - 1] || url
  }
}

/**
 * FileField component displays a file as a clickable download/view link.
 *
 * @example
 * ```tsx
 * // Basic usage with RecordContext (string URL)
 * <RecordContextProvider value={{ id: 1, document: 'https://example.com.ai/file.pdf' }}>
 *   <FileField source="document" />
 * </RecordContextProvider>
 *
 * // With file object
 * <RecordContextProvider value={{ id: 1, file: { src: 'https://example.com.ai/file.pdf', title: 'My Document' } }}>
 *   <FileField source="file" title="title" />
 * </RecordContextProvider>
 *
 * // With download attribute
 * <FileField source="document" download />
 *
 * // With custom title
 * <FileField source="document" title="Download PDF" />
 *
 * // With label
 * <FileField source="document" label="Attachment" />
 *
 * // With array of files
 * <RecordContextProvider value={{ id: 1, files: [{ src: 'file1.pdf' }, { src: 'file2.pdf' }] }}>
 *   <FileField source="files" />
 * </RecordContextProvider>
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function FileField({
  source,
  record: recordProp,
  label,
  emptyText,
  title,
  src: srcField = 'src',
  download,
  className,
  target = '_blank',
  rel = 'noopener noreferrer',
  ...rest
}: FileFieldProps) {
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
  const isEmpty = value == null || value === '' || (Array.isArray(value) && value.length === 0)

  // Handle empty state
  if (isEmpty) {
    if (label) {
      return (
        <div data-testid="shadmin-file-field">
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <span className={cn(className)} {...rest}>
            {resolvedEmptyText}
          </span>
        </div>
      )
    }
    return (
      <span className={cn(className)} data-testid="shadmin-file-field" {...rest}>
        {resolvedEmptyText}
      </span>
    )
  }

  // Get URL from value
  const getUrl = (item: string | FileValue): string => {
    if (typeof item === 'string') return item
    return String(item[srcField] || item.url || item.src || '')
  }

  // Get display text for a file
  const getDisplayText = (item: string | FileValue, url: string): string => {
    if (title) {
      // Check if title is a field name in the item
      if (typeof item !== 'string') {
        const titleFromItem = item[title]
        if (titleFromItem != null) return String(titleFromItem)
      }
      // Check if title is a field name in the record
      const titleFromRecord = get(record, title)
      if (titleFromRecord != null) return String(titleFromRecord)
      // Use title as-is
      return title
    }
    // Default to filename from URL
    return getFilename(url)
  }

  // Render a single file link
  const renderFileLink = (item: string | FileValue, key?: number | string) => {
    const url = getUrl(item)
    const displayText = getDisplayText(item, url)

    return (
      <a
        key={key}
        href={url}
        target={target}
        rel={rel}
        download={download}
        className={cn(
          'inline-flex items-center gap-1 text-primary hover:underline',
          className
        )}
        {...rest}
      >
        <FileIcon className="h-4 w-4" />
        {displayText}
      </a>
    )
  }

  // Handle array of files
  if (Array.isArray(value)) {
    const content = value.map((item, index) => renderFileLink(item, index))

    if (label) {
      return (
        <div data-testid="shadmin-file-field">
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <div className="flex flex-wrap gap-2">{content}</div>
        </div>
      )
    }

    return <div className="flex flex-wrap gap-2" data-testid="shadmin-file-field">{content}</div>
  }

  // Handle single file (value is string or FileValue object at this point)
  const singleValue = value as string | FileValue
  if (label) {
    return (
      <div data-testid="shadmin-file-field">
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        {renderFileLink(singleValue)}
      </div>
    )
  }

  return <span data-testid="shadmin-file-field">{renderFileLink(singleValue)}</span>
}

/**
 * Simple file icon component
 */
function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14,2 14,8 20,8" />
    </svg>
  )
}

FileField.displayName = 'FileField'
