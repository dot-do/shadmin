import { type HTMLAttributes, type ReactNode, Children, cloneElement, isValidElement } from 'react'

import { cn } from '@/utils'

import { useRecordContext, RecordContextProvider } from '../../contexts/RecordContext'

import type { RaRecord } from '../../facade'

export interface SingleFieldListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Children to render for each item.
   * Typically a single field component like ChipField or TextField.
   */
  children?: ReactNode
  /**
   * The data to iterate over.
   * If not provided, expects to be used within a context that provides data (e.g., ArrayField, ReferenceArrayField).
   */
  data?: RaRecord[]
  /**
   * Text/element to display when the list is empty
   */
  empty?: ReactNode
  /**
   * Custom component to link each item (e.g., for navigation)
   */
  linkType?: false | 'show' | 'edit'
  /**
   * Gap between items (Tailwind spacing scale)
   * @default 'gap-1'
   */
  gap?: string
  /**
   * Direction of the list
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical'
}

/**
 * SingleFieldList component renders a list of records as inline items.
 * Typically used with ArrayField or ReferenceArrayField to display array values.
 *
 * @example
 * ```tsx
 * // Basic usage with ArrayField
 * <ArrayField source="tags">
 *   <SingleFieldList>
 *     <ChipField source="name" />
 *   </SingleFieldList>
 * </ArrayField>
 *
 * // With ReferenceArrayField
 * <ReferenceArrayField source="tagIds" reference="tags">
 *   <SingleFieldList>
 *     <ChipField source="name" />
 *   </SingleFieldList>
 * </ReferenceArrayField>
 *
 * // Vertical layout
 * <ArrayField source="items">
 *   <SingleFieldList direction="vertical">
 *     <TextField source="title" />
 *   </SingleFieldList>
 * </ArrayField>
 *
 * // With custom gap
 * <ArrayField source="tags">
 *   <SingleFieldList gap="gap-2">
 *     <ChipField source="name" variant="secondary" />
 *   </SingleFieldList>
 * </ArrayField>
 *
 * // With empty state
 * <ArrayField source="tags">
 *   <SingleFieldList empty={<span>No tags</span>}>
 *     <ChipField source="name" />
 *   </SingleFieldList>
 * </ArrayField>
 * ```
 */
export function SingleFieldList({
  children,
  data: dataProp,
  empty,
  linkType,
  gap = 'gap-1',
  direction = 'horizontal',
  className,
  ...rest
}: SingleFieldListProps) {
  // When used within ArrayField, the record context contains the array data
  // But typically SingleFieldList receives data from parent components
  const record = useRecordContext()

  // Use provided data or empty array
  // Note: When used within ArrayField, each item gets its own RecordContext
  // So SingleFieldList typically just renders its children for each provided record
  const data = dataProp ?? (record ? [record] : [])

  // Handle empty state
  if (!data || data.length === 0) {
    if (empty) {
      return (
        <div className={cn(className)} data-testid="shadmin-single-field-list" {...rest}>
          {empty}
        </div>
      )
    }
    return null
  }

  const isVertical = direction === 'vertical'
  const containerClasses = cn(
    isVertical ? 'flex flex-col' : 'flex flex-wrap items-center',
    gap,
    className
  )

  // If data is provided, iterate and wrap each in RecordContext
  if (dataProp) {
    return (
      <div className={containerClasses} data-testid="shadmin-single-field-list" {...rest}>
        {data.map((item, index) => {
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
        })}
      </div>
    )
  }

  // If no data prop, just render children (assumes parent handles context)
  return (
    <div className={containerClasses} data-testid="shadmin-single-field-list" {...rest}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child)
        }
        return child
      })}
    </div>
  )
}

SingleFieldList.displayName = 'SingleFieldList'
