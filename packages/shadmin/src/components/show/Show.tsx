/**
 * Show Component
 * Complete show component combining ShowBase (logic) and UI wrapper
 * 100% API-compatible with react-admin Show
 *
 * Epic: shadmin-ha1 (P1)
 */

import type { ReactNode, ReactElement } from 'react'
import { ShowBase, type ShowBaseProps, type ShowControllerResult } from './ShowBase'
import { ShowView, type ShowViewProps } from './ShowView'
import type { Identifier, RaRecord } from '../../types'

/**
 * Props for Show component
 * Combines ShowBase props (logic) with ShowView props (UI)
 */
export interface ShowProps<RecordType extends RaRecord = RaRecord>
  extends Omit<ShowBaseProps<RecordType>, 'children'>,
    Pick<ShowViewProps, 'actions' | 'empty' | 'className' | 'aside'> {
  /** Child elements to render inside the show (typically fields) */
  children: ReactNode
  /** Title to display in the show header */
  title?: ReactNode
  /** Custom loading component */
  loading?: ReactElement
  /** Custom error component */
  error?: ReactElement
  /** If true, show empty component while loading */
  emptyWhileLoading?: boolean
}

/**
 * Show - Complete show component with record fetching and UI
 *
 * The Show component combines ShowBase (record fetching)
 * with ShowView (Card container, header) to provide a complete show solution.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Show resource="posts" id={1}>
 *   <SimpleShowLayout>
 *     <TextField source="title" />
 *     <DateField source="createdAt" />
 *   </SimpleShowLayout>
 * </Show>
 *
 * // With all options
 * <Show
 *   resource="posts"
 *   id={1}
 *   title="Post Details"
 *   actions={<EditButton />}
 *   aside={<PostAside />}
 * >
 *   <SimpleShowLayout>
 *     <TextField source="title" />
 *     <RichTextField source="content" />
 *     <DateField source="createdAt" />
 *   </SimpleShowLayout>
 * </Show>
 * ```
 */
export function Show<RecordType extends RaRecord = RaRecord>({
  // ShowBase props
  id,
  resource,
  queryOptions,
  // ShowView props
  title,
  actions,
  empty,
  className,
  aside,
  // Show-specific props
  loading,
  error: errorComponent,
  emptyWhileLoading,
  // Children
  children,
}: ShowProps<RecordType>) {
  return (
    <ShowBase<RecordType>
      id={id}
      resource={resource}
      queryOptions={queryOptions}
    >
      {(controllerProps: ShowControllerResult<RecordType>) => (
        <ShowView
          title={title}
          actions={actions}
          empty={empty}
          className={className}
          aside={aside}
          isLoading={controllerProps.isLoading}
          error={controllerProps.error}
          record={controllerProps.record}
          loading={loading}
          errorComponent={errorComponent}
          emptyWhileLoading={emptyWhileLoading}
        >
          {children}
        </ShowView>
      )}
    </ShowBase>
  )
}

export default Show

// Re-export types for convenience
export type { Identifier }
