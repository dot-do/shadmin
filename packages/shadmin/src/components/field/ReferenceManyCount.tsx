/**
 * ReferenceManyCount Component
 * Displays a count of related records (one-to-many relationship)
 */

import { get } from 'lodash-es'
import { type HTMLAttributes } from 'react'

import { cn } from '@/utils'

import { useRecordContext } from '../../contexts/RecordContext'
import { useGetManyReference } from '../../hooks/useGetManyReference'

import type { Identifier, RaRecord } from '../../facade'

export interface ReferenceManyCountProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The field name in the record that contains the ID to look up */
  source?: string
  /** The resource name to fetch the related records from */
  reference: string
  /** The foreign key field name in the referenced resource */
  target: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Filter configuration */
  filter?: Record<string, unknown>
  /** Sort configuration */
  sort?: {
    field: string
    order: 'ASC' | 'DESC'
  }
  /** Link path for the count (makes it clickable) */
  link?: string | boolean
  /** Timeout for loading state (ms) before showing spinner */
  timeout?: number
  /** MUI sx prop for styling (accepted for compatibility, ignored) */
  sx?: unknown
}

/**
 * ReferenceManyCount - Displays the count of related records
 *
 * Uses useGetManyReference to count records from the referenced resource
 * where the target field matches the source field value from the current record.
 *
 * @example
 * ```tsx
 * // Count comments for a post
 * <RecordContextProvider value={{ id: 1, title: 'My Post' }}>
 *   <ReferenceManyCount reference="comments" target="post_id" />
 * </RecordContextProvider>
 *
 * // With filter
 * <ReferenceManyCount
 *   reference="comments"
 *   target="post_id"
 *   filter={{ status: 'published' }}
 * />
 *
 * // With link to related records
 * <ReferenceManyCount
 *   reference="comments"
 *   target="post_id"
 *   link
 * />
 * ```
 */
export function ReferenceManyCount({
  source = 'id',
  reference,
  target,
  record: recordProp,
  filter,
  sort,
  link,
  timeout: _timeout,
  className,
  ...rest
}: ReferenceManyCountProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Get the ID from the source field
  const sourceId = get(record, source) as Identifier | null | undefined

  // Check if we have a valid source ID
  const hasSourceId = sourceId != null && sourceId !== ''

  // Fetch the related records (just to get the count)
  const { total, isLoading, error } = useGetManyReference(
    reference,
    {
      target,
      id: sourceId!,
      pagination: { page: 1, perPage: 1 }, // Only need count, not actual data
      ...(sort && { sort }),
      ...(filter && { filter }),
    },
    { enabled: hasSourceId }
  )

  // Handle empty source ID
  if (!hasSourceId) {
    return (
      <span className={cn('text-muted-foreground', className)} {...rest}>
        0
      </span>
    )
  }

  // Handle loading state
  if (isLoading) {
    return (
      <span
        className={cn('inline-block h-4 w-6 animate-pulse rounded bg-muted', className)}
        data-testid="reference-many-count-loading"
        {...rest}
      />
    )
  }

  // Handle error state
  if (error) {
    return (
      <span
        className={cn('text-destructive', className)}
        title="Error loading count"
        {...rest}
      >
        -
      </span>
    )
  }

  const count = total ?? 0

  // If link is provided, render as a link
  if (link) {
    const linkPath = typeof link === 'string'
      ? link
      : `/${reference}?filter=${encodeURIComponent(JSON.stringify({ [target]: sourceId }))}`

    return (
      <a
        href={linkPath}
        className={cn('text-primary hover:underline', className)}
        {...rest}
      >
        {count}
      </a>
    )
  }

  return (
    <span className={cn(className)} {...rest}>
      {count}
    </span>
  )
}

ReferenceManyCount.displayName = 'ReferenceManyCount'
