import { type HTMLAttributes, type ReactNode, Children, cloneElement, isValidElement } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext, RecordContextProvider } from '../../contexts/RecordContext'
import type { RaRecord } from 'ra-core'

export interface ArrayFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** The field name in the record that contains the array */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the array items */
  label?: string
  /**
   * Text to display when array is empty/null/undefined.
   * - string: Display that string
   * - true: Display default empty text
   * - false | undefined: Display nothing
   */
  emptyText?: string | boolean
  /** Children to render for each item in the array */
  children?: ReactNode
}

/**
 * ArrayField component iterates over an array in the record and renders
 * children for each item, wrapping each in its own RecordContext.
 *
 * @example
 * ```tsx
 * // Basic usage with tags array
 * <RecordContextProvider value={{ id: 1, tags: [{ id: 1, name: 'React' }, { id: 2, name: 'Vue' }] }}>
 *   <ArrayField source="tags">
 *     <TextField source="name" />
 *   </ArrayField>
 * </RecordContextProvider>
 *
 * // With nested source path
 * <ArrayField source="data.items">
 *   <TextField source="value" />
 * </ArrayField>
 *
 * // With label
 * <ArrayField source="tags" label="Tags">
 *   <TextField source="name" />
 * </ArrayField>
 *
 * // With empty text
 * <ArrayField source="tags" emptyText="No tags yet">
 *   <TextField source="name" />
 * </ArrayField>
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function ArrayField({
  source,
  record: recordProp,
  label,
  emptyText,
  className,
  children,
  ...rest
}: ArrayFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Resolve emptyText: false/undefined = '', true = default, string = as-is
  const resolvedEmptyText =
    emptyText === false || emptyText === undefined
      ? ''
      : emptyText === true
        ? DEFAULT_EMPTY_TEXT
        : emptyText

  // Get the array from the source field
  const items = get(record, source) as RaRecord[] | null | undefined

  // Check if we have valid array items
  const hasItems = Array.isArray(items) && items.length > 0

  // Handle empty array
  if (!hasItems) {
    if (label) {
      return (
        <div className={cn(className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <span>{resolvedEmptyText}</span>
        </div>
      )
    }

    return (
      <div className={cn(className)} {...rest}>
        {resolvedEmptyText}
      </div>
    )
  }

  // Render each item with its own RecordContext
  const content = items.map((item, index) => {
    // Use item.id if available, otherwise fall back to index
    const key = item.id != null ? item.id : index

    return (
      <RecordContextProvider key={key} value={item}>
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child)
          }
          return child
        })}
      </RecordContextProvider>
    )
  })

  if (label) {
    return (
      <div className={cn(className)} {...rest}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex flex-wrap gap-1">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-wrap gap-1', className)} {...rest}>
      {content}
    </div>
  )
}

ArrayField.displayName = 'ArrayField'
