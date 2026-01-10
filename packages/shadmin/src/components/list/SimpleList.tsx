/**
 * SimpleList Component
 * A simplified list display component for mobile-friendly record lists
 *
 * Features:
 * - Simple vertical list layout
 * - Customizable primary/secondary/tertiary text
 * - Link wrapper support
 * - Icon support
 */

import { type ReactNode, type ComponentType, type CSSProperties, useCallback } from 'react'
import { cn } from '../../utils'
import { useListContext } from '../../contexts/ListContext'
import { RecordContextProvider } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

/**
 * SimpleList component props
 */
export interface SimpleListProps<RecordType extends RaRecord = RaRecord> {
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
}

/**
 * SimpleList - A mobile-friendly list component
 *
 * @example
 * ```tsx
 * <SimpleList
 *   primaryText={(record) => record.name}
 *   secondaryText={(record) => record.email}
 *   tertiaryText={(record) => new Date(record.createdAt).toLocaleDateString()}
 *   leftIcon={(record) => <Avatar src={record.avatar} />}
 * />
 * ```
 */
export function SimpleList<RecordType extends RaRecord = RaRecord>({
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
}: SimpleListProps<RecordType>) {
  const { data, isLoading, resource: contextResource } = useListContext<RecordType>()
  const resource = resourceProp ?? contextResource

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
      // Try calling with record first, if the function takes 0 args it will just ignore it
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

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {[...Array(3)].map((_, i) => (
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
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        No records found
      </div>
    )
  }

  return (
    <ul role="list" className={cn('divide-y divide-border', className)}>
      {data.map((record, index) => {
        const link = getLink(record)
        const leftAvatarContent = getAvatar(leftAvatar, record)
        const rightAvatarContent = getAvatar(rightAvatar, record)
        const leftIconContent = getIcon(leftIcon, record)
        const rightIconContent = getIcon(rightIcon, record)
        const primary = getText(primaryText, record)
        const secondary = getText(secondaryText, record)
        const tertiary = getText(tertiaryText, record)
        const style = rowStyle ? rowStyle(record, index) : undefined

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
            <li>
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
  )
}

SimpleList.displayName = 'SimpleList'
