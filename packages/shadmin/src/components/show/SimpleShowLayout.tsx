/**
 * SimpleShowLayout Component
 * Provides a simple layout for displaying fields in a Show view
 * 100% API-compatible with react-admin SimpleShowLayout
 *
 * Epic: shadmin-ha1 (P1)
 */

import { type HTMLAttributes, type ReactNode, Children, cloneElement, isValidElement } from 'react'
import { cn } from '../../lib/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

export interface SimpleShowLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Field components to display
   */
  children?: ReactNode
  /**
   * Optional record to use instead of RecordContext
   */
  record?: RaRecord
  /**
   * Gap between fields (Tailwind spacing scale)
   * @default 'gap-4'
   */
  gap?: string
  /**
   * Direction of the layout
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal'
  /**
   * Number of columns for grid layout (only applies when direction is 'horizontal')
   */
  columns?: 1 | 2 | 3 | 4
  /**
   * Whether to add dividers between fields
   * @default false
   */
  divider?: boolean
}

/**
 * SimpleShowLayout component provides a simple layout for displaying fields in a Show view.
 * It renders children in a vertical or horizontal arrangement with consistent spacing.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Show resource="posts" id={1}>
 *   <SimpleShowLayout>
 *     <TextField source="title" label="Title" />
 *     <TextField source="author" label="Author" />
 *     <DateField source="createdAt" label="Created" />
 *   </SimpleShowLayout>
 * </Show>
 *
 * // Horizontal layout with columns
 * <SimpleShowLayout direction="horizontal" columns={2}>
 *   <TextField source="firstName" label="First Name" />
 *   <TextField source="lastName" label="Last Name" />
 *   <EmailField source="email" label="Email" />
 *   <TextField source="phone" label="Phone" />
 * </SimpleShowLayout>
 *
 * // With custom gap
 * <SimpleShowLayout gap="gap-6">
 *   <TextField source="title" />
 *   <RichTextField source="content" />
 * </SimpleShowLayout>
 *
 * // With dividers
 * <SimpleShowLayout divider>
 *   <TextField source="name" label="Name" />
 *   <TextField source="email" label="Email" />
 * </SimpleShowLayout>
 * ```
 */
/**
 * Map columns prop to Tailwind grid classes
 * Using explicit classes for Tailwind JIT compilation
 */
const columnClasses: Record<1 | 2 | 3 | 4, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function SimpleShowLayout({
  children,
  record: recordProp,
  gap = 'gap-4',
  direction = 'vertical',
  columns,
  divider = false,
  className,
  ...rest
}: SimpleShowLayoutProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Don't render anything if no record
  if (!record) {
    return null
  }

  const isHorizontal = direction === 'horizontal'

  // Build layout classes with proper Tailwind grid classes
  const layoutClasses = cn(
    'simple-show-layout',
    isHorizontal
      ? columns
        ? `grid ${columnClasses[columns]}`
        : 'flex flex-wrap'
      : 'flex flex-col',
    gap,
    className
  )

  // Render children with optional dividers
  const childArray = Children.toArray(children).filter(isValidElement)

  if (divider && !isHorizontal) {
    return (
      <div
        className={layoutClasses}
        data-testid="shadmin-simple-show-layout"
        {...rest}
      >
        {childArray.map((child, index) => (
          <div key={index} data-testid={`show-field-${index}`}>
            {cloneElement(child)}
            {index < childArray.length - 1 && (
              <hr className="mt-4 border-border" />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={layoutClasses}
      data-testid="shadmin-simple-show-layout"
      {...rest}
    >
      {childArray.map((child, index) => (
        <div key={index} data-testid={`show-field-${index}`}>
          {cloneElement(child)}
        </div>
      ))}
    </div>
  )
}

SimpleShowLayout.displayName = 'SimpleShowLayout'
