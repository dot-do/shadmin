/**
 * ReferenceArrayField Component
 * Displays multiple related records from an array of IDs
 */

import { type HTMLAttributes, type ReactNode, Children, cloneElement, isValidElement } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext, RecordContextProvider } from '../../contexts/RecordContext'
import { useGetMany } from '../../hooks/useGetMany'
import type { Identifier, RaRecord } from '../../types'

export interface ReferenceArrayFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** The field name in the record that contains the array of reference IDs */
  source: string
  /** The resource name to fetch the referenced records from */
  reference: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the values */
  label?: string
  /**
   * Text to display when the reference array is empty/null/undefined.
   * - string: Display that string
   * - true: Display default empty text
   * - false | undefined: Display nothing
   */
  emptyText?: string | boolean
  /** Children to render for each referenced record */
  children?: ReactNode
  /** Optional sort order for the referenced records */
  sort?: { field: string; order: 'ASC' | 'DESC' }
}

/**
 * ReferenceArrayField component displays multiple related records.
 * It fetches the referenced records using useGetMany and renders children
 * for each record with a separate RecordContext.
 *
 * @example
 * ```tsx
 * // Display tags for a post
 * <RecordContextProvider value={{ id: 1, tagIds: [1, 2, 3] }}>
 *   <ReferenceArrayField source="tagIds" reference="tags">
 *     <TextField source="name" />
 *   </ReferenceArrayField>
 * </RecordContextProvider>
 *
 * // With custom empty text
 * <ReferenceArrayField source="tagIds" reference="tags" emptyText="No tags">
 *   <TextField source="name" />
 * </ReferenceArrayField>
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function ReferenceArrayField({
  source,
  reference,
  record: recordProp,
  label,
  emptyText,
  sort,
  className,
  children,
  ...rest
}: ReferenceArrayFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Resolve emptyText: false/undefined = '', true = default, string = as-is
  const resolvedEmptyText =
    emptyText === false || emptyText === undefined
      ? ''
      : emptyText === true
        ? DEFAULT_EMPTY_TEXT
        : emptyText

  // Get the reference IDs array from the source field
  const referenceIds = get(record, source) as Identifier[] | null | undefined

  // Check if we have valid reference IDs
  const hasReferenceIds = Array.isArray(referenceIds) && referenceIds.length > 0

  // Fetch the referenced records
  const { data, isLoading, error } = useGetMany(
    reference,
    { ids: referenceIds ?? [] },
    { enabled: hasReferenceIds }
  )

  // Handle empty reference IDs
  if (!hasReferenceIds) {
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
      <div className={cn(className)} data-testid="reference-array-field-loading" {...rest}>
        <span className="inline-block h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className={cn(className)} data-testid="reference-array-field-error" {...rest}>
        <span className="text-destructive text-sm">Error loading references</span>
      </div>
    )
  }

  // Sort data based on sort prop or maintain the order of IDs in the source field
  let sortedData = referenceIds
    .map((id) => data?.find((item) => item.id === id))
    .filter((item): item is RaRecord => item != null)

  // Apply custom sort if provided
  if (sort) {
    sortedData = [...sortedData].sort((a, b) => {
      const aValue = get(a, sort.field)
      const bValue = get(b, sort.field)

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return sort.order === 'ASC' ? 1 : -1
      if (bValue == null) return sort.order === 'ASC' ? -1 : 1

      // Compare values
      if (aValue < bValue) return sort.order === 'ASC' ? -1 : 1
      if (aValue > bValue) return sort.order === 'ASC' ? 1 : -1
      return 0
    })
  }

  // Render each referenced record with its own context
  const content = sortedData.map((item) => (
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

ReferenceArrayField.displayName = 'ReferenceArrayField'
