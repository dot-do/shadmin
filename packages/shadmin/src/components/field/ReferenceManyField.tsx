/**
 * ReferenceManyField Component
 * Fetches related records using a foreign key (one-to-many relationship)
 */

import { type HTMLAttributes, type ReactNode, Children, cloneElement, isValidElement } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext, RecordContextProvider } from '../../contexts/RecordContext'
import { useGetManyReference } from '../../hooks/useGetManyReference'
import type { Identifier } from '../../facade'

export interface ReferenceManyFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** The field name in the record that contains the ID to look up (defaults to 'id' if not provided) */
  source?: string
  /** The resource name to fetch the related records from */
  reference: string
  /** The foreign key field name in the referenced resource */
  target: string
  /** Optional record to use instead of RecordContext (doesn't require id, just needs the source field) */
  record?: Record<string, unknown>
  /** Optional label to display above the values */
  label?: string
  /**
   * Text to display when there are no related records.
   * - string: Display that string
   * - true: Display default empty text
   * - false | undefined: Display nothing
   */
  emptyText?: string | boolean
  /** Number of records per page (default: 10) */
  perPage?: number
  /** Page number (default: 1) */
  page?: number
  /** Sort configuration */
  sort?: {
    field: string
    order: 'ASC' | 'DESC'
  }
  /** Filter configuration */
  filter?: Record<string, unknown>
  /** Children to render for each related record */
  children?: ReactNode
}

/**
 * ReferenceManyField component fetches and displays related records using a foreign key.
 * It uses useGetManyReference to fetch records from the referenced resource
 * where the target field matches the source field value from the current record.
 *
 * @example
 * ```tsx
 * // Display comments for a post
 * <RecordContextProvider value={{ id: 1, title: 'My Post' }}>
 *   <ReferenceManyField source="id" reference="comments" target="post_id">
 *     <TextField source="body" />
 *   </ReferenceManyField>
 * </RecordContextProvider>
 *
 * // With pagination and sorting
 * <ReferenceManyField
 *   source="id"
 *   reference="comments"
 *   target="post_id"
 *   perPage={5}
 *   sort={{ field: 'created_at', order: 'DESC' }}
 * >
 *   <TextField source="body" />
 * </ReferenceManyField>
 *
 * // With empty text
 * <ReferenceManyField
 *   source="id"
 *   reference="comments"
 *   target="post_id"
 *   emptyText="No comments yet"
 * >
 *   <TextField source="body" />
 * </ReferenceManyField>
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function ReferenceManyField({
  source = 'id',
  reference,
  target,
  record: recordProp,
  label,
  emptyText,
  perPage = 10,
  page = 1,
  sort,
  filter,
  className,
  children,
  ...rest
}: ReferenceManyFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Resolve emptyText: false/undefined = '', true = default, string = as-is
  const resolvedEmptyText =
    emptyText === false || emptyText === undefined
      ? ''
      : emptyText === true
        ? DEFAULT_EMPTY_TEXT
        : emptyText

  // Get the ID from the source field (defaults to 'id')
  const sourceId = get(record, source) as Identifier | null | undefined

  // Check if we have a valid source ID
  const hasSourceId = sourceId != null && sourceId !== ''

  // Fetch the related records
  const { data, isLoading, error } = useGetManyReference(
    reference,
    {
      target,
      id: sourceId!,
      pagination: { page, perPage },
      ...(sort && { sort }),
      ...(filter && { filter }),
    },
    { enabled: hasSourceId }
  )

  // Handle empty source ID
  if (!hasSourceId) {
    if (resolvedEmptyText) {
      return (
        <div className={cn(className)} {...rest}>
          {resolvedEmptyText}
        </div>
      )
    }
    return <div className={cn(className)} {...rest} />
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className={cn(className)} data-testid="reference-many-field-loading" {...rest}>
        <span className="inline-block h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className={cn(className)} data-testid="reference-many-field-error" {...rest}>
        <span className="text-destructive text-sm">Error loading references</span>
      </div>
    )
  }

  // Handle empty data
  if (!data || data.length === 0) {
    if (resolvedEmptyText) {
      return (
        <div className={cn(className)} {...rest}>
          {resolvedEmptyText}
        </div>
      )
    }
    return <div className={cn(className)} {...rest} />
  }

  // Render each related record with its own context
  const content = data.map((item) => (
    <RecordContextProvider key={item.id} value={item}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child)
        }
        return child
      })}
    </RecordContextProvider>
  ))

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

ReferenceManyField.displayName = 'ReferenceManyField'
