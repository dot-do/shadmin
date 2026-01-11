/**
 * VirtualList Component
 * High-performance virtualized list for large datasets (10K+ rows)
 * Uses @tanstack/react-virtual for windowing
 *
 * Issue: shadmin-ae57 (P2)
 */

import {
  type ReactNode,
  type ComponentType,
  type CSSProperties,
  useCallback,
  useRef,
} from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '../../utils'
import { useListContext } from '../../contexts/ListContext'
import { RecordContextProvider } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

/**
 * VirtualList component props
 */
export interface VirtualListProps<RecordType extends RaRecord = RaRecord> {
  /**
   * Function to get primary text from record
   * Returns ReactNode or unknown (for flexibility with record property access)
   */
  primaryText?: string | ((record: RecordType) => ReactNode | unknown)
  /**
   * Function to get secondary text from record
   * Returns ReactNode or unknown (for flexibility with record property access)
   */
  secondaryText?: string | ((record: RecordType) => ReactNode | unknown)
  /**
   * Function to get tertiary text from record
   * Returns ReactNode or unknown (for flexibility with record property access)
   */
  tertiaryText?: string | ((record: RecordType) => ReactNode | unknown)
  /**
   * Left avatar component or function returning avatar
   */
  leftAvatar?: ((record: RecordType) => ReactNode) | (() => ReactNode)
  /**
   * Right avatar component or function returning avatar
   */
  rightAvatar?: ((record: RecordType) => ReactNode) | (() => ReactNode)
  /**
   * Left icon component or function returning icon
   */
  leftIcon?: (record: RecordType) => ReactNode
  /**
   * Right icon component or function returning icon
   */
  rightIcon?: (record: RecordType) => ReactNode
  /**
   * Link type for row clicks
   */
  linkType?: 'edit' | 'show' | false | ((record: RecordType, id: RecordType['id']) => string)
  /**
   * Custom row click handler
   */
  rowClick?: string | boolean | ((id: RecordType['id'], resource: string, record: RecordType) => string)
  /**
   * Custom row styles function
   */
  rowStyle?: (record: RecordType, index: number) => CSSProperties
  /**
   * Additional CSS class
   */
  className?: string
  /**
   * Empty state content
   */
  empty?: ReactNode
  /**
   * Custom link component
   */
  linkComponent?: ComponentType<{ to: string; children: ReactNode }>
  /**
   * Resource name for link generation
   */
  resource?: string
  /**
   * Fixed height of the virtual container (required for virtualization)
   */
  height?: number | string
  /**
   * Estimated item height for virtualization (default: 72)
   */
  estimateItemHeight?: number | ((index: number) => number)
  /**
   * Number of items to render outside visible area (default: 5)
   */
  overscan?: number
  /**
   * Enable dynamic item height measurement (default: false)
   */
  dynamicItemHeight?: boolean
}

/**
 * VirtualList - High-performance virtualized list for large datasets
 *
 * Uses @tanstack/react-virtual for windowing to efficiently render
 * only visible items, enabling smooth scrolling with 10K+ items.
 *
 * @example
 * ```tsx
 * // Basic usage - must specify height
 * <VirtualList
 *   height={600}
 *   primaryText={(record) => record.name}
 *   secondaryText={(record) => record.email}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With dynamic item heights
 * <VirtualList
 *   height={600}
 *   dynamicItemHeight
 *   estimateItemHeight={72}
 *   primaryText={(record) => record.name}
 *   secondaryText={(record) => record.description}
 * />
 * ```
 */
export function VirtualList<RecordType extends RaRecord = RaRecord>({
  primaryText,
  secondaryText,
  tertiaryText,
  leftAvatar,
  rightAvatar,
  leftIcon,
  rightIcon,
  linkType = 'edit',
  rowClick,
  rowStyle,
  className,
  empty,
  linkComponent: LinkComponent,
  resource: resourceProp,
  height = 600,
  estimateItemHeight = 72,
  overscan = 5,
  dynamicItemHeight = false,
}: VirtualListProps<RecordType>) {
  const { data, isLoading, resource: contextResource } = useListContext<RecordType>()
  const resource = resourceProp ?? contextResource

  const containerRef = useRef<HTMLDivElement>(null)

  const getText = useCallback(
    (
      textProp: string | ((record: RecordType) => ReactNode | unknown) | undefined,
      record: RecordType
    ): ReactNode => {
      if (!textProp) return null
      if (typeof textProp === 'function') return textProp(record) as ReactNode
      // If string, assume it's a field name
      return (record as Record<string, unknown>)[textProp] as ReactNode
    },
    []
  )

  const getIcon = useCallback(
    (
      iconProp: ((record: RecordType) => ReactNode) | undefined,
      record: RecordType
    ): ReactNode => {
      if (!iconProp) return null
      return iconProp(record)
    },
    []
  )

  const getAvatar = useCallback(
    (
      avatarProp: ((record: RecordType) => ReactNode) | (() => ReactNode) | undefined,
      record: RecordType
    ): ReactNode => {
      if (!avatarProp) return null
      return avatarProp(record)
    },
    []
  )

  const handleRowClick = useCallback(
    (record: RecordType) => {
      if (typeof rowClick === 'function') {
        rowClick(record.id, resource ?? '', record)
      }
    },
    [rowClick, resource]
  )

  const getLink = useCallback(
    (record: RecordType): string | null => {
      if (!linkType || !resource) return null
      if (typeof linkType === 'function') {
        return linkType(record, record.id)
      }
      return `/${resource}/${record.id}/${linkType}`
    },
    [linkType, resource]
  )

  // Create virtualizer - only include measureElement when actually needed
  const virtualizerOptions = {
    count: data?.length ?? 0,
    getScrollElement: () => containerRef.current,
    estimateSize: typeof estimateItemHeight === 'function' ? estimateItemHeight : () => estimateItemHeight,
    overscan,
  }
  const rowVirtualizer = useVirtualizer(
    dynamicItemHeight && typeof window !== 'undefined'
      ? {
          ...virtualizerOptions,
          measureElement: (element: Element) => element?.getBoundingClientRect().height ?? (typeof estimateItemHeight === 'number' ? estimateItemHeight : 72),
        }
      : virtualizerOptions
  )

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  // Container style
  const containerStyle: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    overflow: 'auto',
  }

  if (isLoading) {
    return (
      <div
        className={cn('space-y-2', className)}
        data-testid="shadmin-virtual-list"
        style={containerStyle}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card animate-pulse"
          >
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return empty ? (
      <>{empty}</>
    ) : (
      <div
        className={cn('text-center py-8 text-muted-foreground', className)}
        data-testid="shadmin-virtual-list"
      >
        No records found
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={cn('divide-y divide-border', className)}
      data-testid="shadmin-virtual-list"
    >
      <ul
        role="list"
        style={{
          height: totalSize,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const record = data[virtualItem.index]
          if (!record) return null

          const link = getLink(record)
          const leftAvatarContent = getAvatar(leftAvatar, record)
          const rightAvatarContent = getAvatar(rightAvatar, record)
          const leftIconContent = getIcon(leftIcon, record)
          const rightIconContent = getIcon(rightIcon, record)
          const primary = getText(primaryText, record)
          const secondary = getText(secondaryText, record)
          const tertiary = getText(tertiaryText, record)
          const style = rowStyle ? rowStyle(record, virtualItem.index) : undefined

          const content = (
            <div
              className={cn(
                'flex items-center gap-4 p-4',
                'hover:bg-accent/50 transition-colors',
                (link || rowClick) && 'cursor-pointer'
              )}
              style={style}
              onClick={() => !link && handleRowClick(record)}
            >
              {(leftAvatarContent || leftIconContent) && (
                <div className="flex-shrink-0">
                  {leftAvatarContent || leftIconContent}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {primary && (
                  <p className="text-sm font-medium text-foreground truncate">
                    {primary}
                  </p>
                )}
                {secondary && (
                  <p className="text-sm text-muted-foreground truncate">
                    {secondary}
                  </p>
                )}
              </div>
              {tertiary && (
                <div className="flex-shrink-0 text-sm text-muted-foreground">
                  {tertiary}
                </div>
              )}
              {(rightAvatarContent || rightIconContent) && (
                <div className="flex-shrink-0">
                  {rightAvatarContent || rightIconContent}
                </div>
              )}
            </div>
          )

          return (
            <RecordContextProvider key={record.id} value={record}>
              <li
                data-index={virtualItem.index}
                ref={dynamicItemHeight ? (node) => rowVirtualizer.measureElement(node) : undefined}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: dynamicItemHeight ? undefined : `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                data-testid={`shadmin-virtual-list-item-${virtualItem.index}`}
              >
                {link && LinkComponent ? (
                  <LinkComponent to={link}>{content}</LinkComponent>
                ) : link ? (
                  <a href={link} className="block">
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            </RecordContextProvider>
          )
        })}
      </ul>
    </div>
  )
}

VirtualList.displayName = 'VirtualList'
