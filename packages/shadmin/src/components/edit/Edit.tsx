/**
 * Edit Component
 * Complete edit component combining EditBase (logic) and EditView (UI)
 * 100% API-compatible with react-admin Edit
 *
 * Epic: shadmin-ha1 (P1)
 */

import type { ReactNode, ReactElement } from 'react'
import { useLocation } from 'react-router'
import { EditBase, type EditBaseProps, type RedirectTo } from './EditBase'
import { EditView, type EditViewProps } from './EditView'
// Note: useRecordContext available for future use
// import { useRecordContext } from '../../contexts/RecordContext'
import { useGetOne } from '../../hooks/useGetOne'
import { useResourceContext } from '../../contexts/ResourceContext'
import type { Identifier, RaRecord } from '../../types'
import type { MutationMode } from '../../contexts/FormContext'

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
 * Props for Edit component
 * Combines EditBase props (logic) with EditView props (UI)
 */
export interface EditProps<RecordType extends RaRecord = RaRecord>
  extends Omit<EditBaseProps<RecordType>, 'children' | 'id'>,
    Pick<EditViewProps, 'actions' | 'aside' | 'className'> {
  /** The record ID to edit. If not provided, will be inferred from route params */
  id?: Identifier
  /** Child elements to render inside the edit form */
  children: ReactNode
  /** Title to display in the edit header */
  title?: ReactNode
  /** Custom loading component */
  loading?: ReactElement
  /** Custom error component */
  error?: ReactElement
  /** Component to display when record is not found */
  empty?: ReactElement
}

/**
 * Default loading component
 */
function DefaultLoading() {
  return (
    <div data-testid="edit-loading" className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

/**
 * Default error component
 */
function DefaultError({ message }: { message: string }) {
  return (
    <div data-testid="edit-error" className="p-4 text-destructive">
      {message}
    </div>
  )
}

/**
 * Internal wrapper that handles loading/error states
 */
function EditContent<RecordType extends RaRecord = RaRecord>({
  children,
  title,
  actions,
  aside,
  className,
  loading: LoadingComponent,
  error: ErrorComponent,
  empty: EmptyComponent,
  resource: resourceProp,
  id: idProp,
  queryOptions,
}: EditProps<RecordType>) {
  // Get resource from context if not provided
  const resourceFromContext = useResourceContext()
  const resource = resourceProp ?? resourceFromContext ?? ''

  // Get id from URL if not provided as prop
  const idFromLocation = useIdFromLocation()
  const id = idProp ?? idFromLocation

  // Separate meta from queryOptions
  const { meta, ...restQueryOptions } = queryOptions ?? {}

  // Use useGetOne to check loading/error states
  const { data, isLoading, error } = useGetOne<RecordType>(
    resource,
    { id: id!, meta },
    restQueryOptions
  )

  // Show loading state
  if (isLoading) {
    return LoadingComponent ?? <DefaultLoading />
  }

  // Show error state
  if (error) {
    const isNotFound = error.message?.toLowerCase().includes('not found')

    if (isNotFound && EmptyComponent) {
      return EmptyComponent
    }

    if (ErrorComponent) {
      return ErrorComponent
    }

    return <DefaultError message={error.message} />
  }

  // Record not found
  if (!data && EmptyComponent) {
    return EmptyComponent
  }

  return (
    <EditView
      title={title}
      actions={actions}
      aside={aside}
      className={className}
    >
      {children}
    </EditView>
  )
}

/**
 * Edit - Complete edit component with data fetching and UI
 *
 * The Edit component combines EditBase (data fetching, form state, save logic)
 * with EditView (Card container, header) to provide a complete edit solution.
 *
 * The `id` prop is optional - if not provided, it will be inferred from the URL
 * route parameters (e.g., from `/{resource}/:id`).
 *
 * @example
 * ```tsx
 * // Basic usage - id inferred from route
 * <Edit resource="posts">
 *   <SimpleForm>
 *     <TextInput source="title" />
 *     <TextInput source="body" />
 *   </SimpleForm>
 * </Edit>
 *
 * // With explicit id
 * <Edit resource="posts" id={1}>
 *   <SimpleForm>
 *     <TextInput source="title" />
 *     <TextInput source="body" />
 *   </SimpleForm>
 * </Edit>
 *
 * // With all options
 * <Edit
 *   resource="posts"
 *   id={1}
 *   title="Edit Post"
 *   mutationMode="optimistic"
 *   redirect="list"
 *   actions={<DeleteButton />}
 *   aside={<PostHistory />}
 * >
 *   <SimpleForm>
 *     <TextInput source="title" />
 *     <TextInput source="body" />
 *   </SimpleForm>
 * </Edit>
 * ```
 */
export function Edit<RecordType extends RaRecord = RaRecord>({
  // EditBase props
  resource,
  id: idProp,
  mutationMode,
  redirect,
  transform,
  queryOptions,
  mutationOptions,
  disableAuthentication,
  // EditView props
  title,
  actions,
  aside,
  className,
  // Edit-specific props
  loading,
  error,
  empty,
  // Children
  children,
}: EditProps<RecordType>) {
  // Get id from URL if not provided as prop
  const idFromLocation = useIdFromLocation()
  const id = idProp ?? idFromLocation

  if (id === undefined) {
    throw new Error('Edit requires an id prop or must be used in a route with an :id parameter')
  }

  return (
    <EditBase<RecordType>
      resource={resource}
      id={id}
      mutationMode={mutationMode}
      redirect={redirect}
      transform={transform}
      queryOptions={queryOptions}
      mutationOptions={mutationOptions}
      disableAuthentication={disableAuthentication}
    >
      <EditContent<RecordType>
        resource={resource}
        id={id}
        title={title}
        actions={actions}
        aside={aside}
        className={className}
        loading={loading}
        error={error}
        empty={empty}
        queryOptions={queryOptions}
      >
        {children}
      </EditContent>
    </EditBase>
  )
}

export default Edit

// Re-export types for convenience
export type { RedirectTo, MutationMode, Identifier }
