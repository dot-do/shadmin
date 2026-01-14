/**
 * Show Component
 * Complete show component combining ShowBase (logic) and UI wrapper
 * 100% API-compatible with react-admin Show
 *
 * Epic: shadmin-ha1 (P1)
 */

import { useLocation } from 'react-router'

import { ShowBase, type ShowBaseProps, type ShowControllerResult } from './ShowBase'
import { ShowView, type ShowViewProps } from './ShowView'

import type { Identifier, RaRecord } from '../../types'
import type { ReactNode, ReactElement } from 'react'

/**
 * Extract the record ID from the current URL path.
 * Handles routes like /{resource}/:id and /{resource}/:id/show
 */
function useIdFromLocation(): Identifier | undefined {
  let pathname: string
  try {
    const location = useLocation()
    pathname = location.pathname
  } catch {
    // Not in a router context
    return undefined
  }

  // Split the path and find the ID segment
  // Routes are: /{resource}/:id (edit) or /{resource}/:id/show
  const segments = pathname.split('/').filter(Boolean)

  // For edit route: /{resource}/:id -> segments[1] is the id
  // For show route: /{resource}/:id/show -> segments[1] is the id
  if (segments.length >= 2) {
    const potentialId = segments[1]
    // Return the id (could be numeric or string)
    if (potentialId && potentialId !== 'create') {
      // Check if it looks like an id (not a route segment like 'create', 'show', etc.)
      return potentialId
    }
  }

  return undefined
}

/**
 * Props for Show component
 * Combines ShowBase props (logic) with ShowView props (UI)
 */
export interface ShowProps<RecordType extends RaRecord = RaRecord>
  extends Omit<ShowBaseProps<RecordType>, 'children' | 'id'>,
    Pick<ShowViewProps, 'actions' | 'empty' | 'className' | 'aside'> {
  /** The record ID to show. If not provided, will be inferred from route params */
  id?: Identifier
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
 * The `id` prop is optional - if not provided, it will be inferred from the URL
 * route parameters (e.g., from `/{resource}/:id/show`).
 *
 * @example
 * ```tsx
 * // Basic usage - id inferred from route
 * <Show resource="posts">
 *   <SimpleShowLayout>
 *     <TextField source="title" />
 *     <DateField source="createdAt" />
 *   </SimpleShowLayout>
 * </Show>
 *
 * // With explicit id
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
  id: idProp,
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
  // Get id from URL if not provided as prop
  const idFromLocation = useIdFromLocation()
  const id = idProp ?? idFromLocation

  if (id === undefined) {
    throw new Error('Show requires an id prop or must be used in a route with an :id parameter')
  }

  return (
    <ShowBase<RecordType>
      id={id}
      {...(resource !== undefined && { resource })}
      {...(queryOptions !== undefined && { queryOptions })}
    >
      {(controllerProps: ShowControllerResult<RecordType>) => (
        <ShowView
          {...(title !== undefined && { title })}
          {...(actions !== undefined && { actions })}
          {...(empty !== undefined && { empty })}
          {...(className !== undefined && { className })}
          {...(aside !== undefined && { aside })}
          isLoading={controllerProps.isLoading}
          {...(controllerProps.error !== null && { error: controllerProps.error })}
          {...(controllerProps.record !== undefined && { record: controllerProps.record })}
          {...(loading !== undefined && { loading })}
          {...(errorComponent !== undefined && { errorComponent })}
          {...(emptyWhileLoading !== undefined && { emptyWhileLoading })}
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
