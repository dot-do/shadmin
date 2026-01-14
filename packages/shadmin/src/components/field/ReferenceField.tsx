import { get } from 'lodash-es'
import { type HTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/utils'

import { useRecordContext, RecordContextProvider } from '../../contexts/RecordContext'
import { useGetOne } from '../../hooks/useGetOne'

import type { Identifier, RaRecord } from '../../facade'

export interface ReferenceFieldProps extends HTMLAttributes<HTMLSpanElement> {
  /** The field name in the record that contains the reference ID */
  source: string
  /** The resource name to fetch the referenced record from */
  reference: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the value */
  label?: string
  /**
   * Text to display when the reference value is empty/null/undefined.
   * - string: Display that string
   * - true: Display default empty text
   * - false | undefined: Display nothing
   */
  emptyText?: string | boolean
  /**
   * How to render the link to the referenced record
   * - 'show': Link to the show page
   * - 'edit': Link to the edit page
   * - false: No link
   */
  link?: 'show' | 'edit' | false
  /** Children to render with the referenced record */
  children?: ReactNode
}

/**
 * ReferenceField component displays a related record's field.
 * It fetches the referenced record using useGetOne and renders children
 * with the fetched record in a RecordContext.
 * Wraps content in .ra-field and .ra-field-{source} for react-admin compatibility.
 *
 * @example
 * ```tsx
 * // Display author name for a post
 * <RecordContextProvider value={{ id: 1, authorId: 42 }}>
 *   <ReferenceField source="authorId" reference="users">
 *     <TextField source="name" />
 *   </ReferenceField>
 * </RecordContextProvider>
 *
 * // With link to show page
 * <ReferenceField source="authorId" reference="users" link="show">
 *   <TextField source="name" />
 * </ReferenceField>
 *
 * // Without link
 * <ReferenceField source="authorId" reference="users" link={false}>
 *   <TextField source="name" />
 * </ReferenceField>
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function ReferenceField({
  source,
  reference,
  record: recordProp,
  label,
  emptyText,
  link = false,
  className,
  children,
  ...rest
}: ReferenceFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Resolve emptyText: false/undefined = '', true = default, string = as-is
  const resolvedEmptyText =
    emptyText === false || emptyText === undefined
      ? ''
      : emptyText === true
        ? DEFAULT_EMPTY_TEXT
        : emptyText

  // Get the reference ID from the source field
  const referenceId = get(record, source) as Identifier | null | undefined

  // Check if we have a valid reference ID
  const hasReferenceId = referenceId != null && referenceId !== ''

  // Fetch the referenced record
  const { data, isLoading, error } = useGetOne(
    reference,
    { id: referenceId! },
    { enabled: hasReferenceId }
  )

  // Convert source to valid CSS class name (replace dots with dashes)
  const sourceClass = `ra-field-${source.replace(/\./g, '-')}`

  // Handle empty reference ID
  if (!hasReferenceId) {
    if (resolvedEmptyText) {
      return (
        <span className={cn('ra-field', sourceClass, className)} {...rest}>
          <p><span>{resolvedEmptyText}</span></p>
        </span>
      )
    }
    return <span className={cn('ra-field', sourceClass, className)} {...rest} />
  }

  // Handle loading state
  if (isLoading) {
    return (
      <span className={cn('ra-field', sourceClass, className)} data-testid="reference-field-loading" {...rest}>
        <span className="inline-block h-4 w-16 animate-pulse rounded bg-muted" />
      </span>
    )
  }

  // Handle error state
  if (error) {
    return (
      <span className={cn('ra-field', sourceClass, className)} data-testid="reference-field-error" {...rest}>
        <span className="text-destructive text-sm">Error loading reference</span>
      </span>
    )
  }

  // Render content
  const content = (
    <RecordContextProvider value={data}>
      {children}
    </RecordContextProvider>
  )

  // Wrap in link if specified
  const linkedContent = link ? (
    <a href={`/${reference}/${referenceId}/${link}`} className="underline hover:no-underline">
      {content}
    </a>
  ) : (
    content
  )

  if (label) {
    return (
      <div className={cn('ra-field', sourceClass, className)} {...rest}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <p><span>{linkedContent}</span></p>
      </div>
    )
  }

  return (
    <span className={cn('ra-field', sourceClass, className)} {...rest}>
      <p><span>{linkedContent}</span></p>
    </span>
  )
}

ReferenceField.displayName = 'ReferenceField'
