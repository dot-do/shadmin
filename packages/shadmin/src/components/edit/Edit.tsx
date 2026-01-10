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
import type { Identifier, RaRecord } from '../../facade'
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
 * Spinner icon for loading state
 */
function LoaderIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

/**
 * Alert circle icon for error state
 */
function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

/**
 * Default loading component with improved styling
 */
function DefaultLoading() {
  return (
    <div
      data-testid="edit-loading"
      className="flex flex-col items-center justify-center gap-3 p-8 text-muted-foreground"
    >
      <LoaderIcon className="h-8 w-8 animate-spin" />
      <span className="text-sm">Loading...</span>
    </div>
  )
}

/**
 * Default error component with improved styling following shadcn/ui patterns
 */
function DefaultError({ message }: { message: string }) {
  return (
    <div
      data-testid="edit-error"
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center"
    >
      <AlertCircleIcon className="h-12 w-12 text-destructive" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-destructive">Error loading record</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

/**
 * Internal wrapper that renders EditView with children
 */
function EditViewWrapper({
  children,
  title,
  actions,
  aside,
  className,
}: {
  children: ReactNode
  title?: ReactNode
  actions?: ReactElement | false
  aside?: ReactElement
  className?: string
}) {
  // Build props object, only including defined values to satisfy exactOptionalPropertyTypes
  const viewProps: { title?: ReactNode; actions?: ReactElement | false; aside?: ReactElement; className?: string } = {}
  if (title !== undefined) viewProps.title = title
  if (actions !== undefined) viewProps.actions = actions
  if (aside !== undefined) viewProps.aside = aside
  if (className !== undefined) viewProps.className = className

  return (
    <EditView {...viewProps}>
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
  resource: resourceProp,
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
  loading: LoadingComponent,
  error: ErrorComponent,
  empty: EmptyComponent,
  // Children
  children,
}: EditProps<RecordType>) {
  // Get resource from context if not provided
  const resourceFromContext = useResourceContext()
  const resource = resourceProp ?? resourceFromContext ?? ''

  // Get id from URL if not provided as prop
  const idFromLocation = useIdFromLocation()
  const id = idProp ?? idFromLocation

  if (id === undefined) {
    throw new Error('Edit requires an id prop or must be used in a route with an :id parameter')
  }

  // Separate meta from queryOptions
  const { meta, ...restQueryOptions } = queryOptions ?? {}

  // Build params object, only including meta if defined
  const getOneParams: { id: Identifier; meta?: Record<string, unknown> } = { id }
  if (meta !== undefined) getOneParams.meta = meta

  // Use useGetOne to check loading/error states
  const { data, isLoading, error } = useGetOne<RecordType>(
    resource,
    getOneParams,
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

  // Record not found (data is null/undefined)
  if (!data && EmptyComponent) {
    return EmptyComponent
  }

  // Build EditBase props, only including defined optional values
  const editBaseProps: EditBaseProps<RecordType> = { id, children: null }
  if (resourceProp !== undefined) editBaseProps.resource = resourceProp
  if (mutationMode !== undefined) editBaseProps.mutationMode = mutationMode
  if (redirect !== undefined) editBaseProps.redirect = redirect
  if (transform !== undefined) editBaseProps.transform = transform
  if (queryOptions !== undefined) editBaseProps.queryOptions = queryOptions
  if (mutationOptions !== undefined) editBaseProps.mutationOptions = mutationOptions
  if (disableAuthentication !== undefined) editBaseProps.disableAuthentication = disableAuthentication

  // Build EditViewWrapper props, only including defined values
  const viewWrapperProps: Parameters<typeof EditViewWrapper>[0] = { children }
  if (title !== undefined) viewWrapperProps.title = title
  if (actions !== undefined) viewWrapperProps.actions = actions
  if (aside !== undefined) viewWrapperProps.aside = aside
  if (className !== undefined) viewWrapperProps.className = className

  return (
    <EditBase<RecordType> {...editBaseProps}>
      <EditViewWrapper {...viewWrapperProps} />
    </EditBase>
  )
}

export default Edit

// Re-export types for convenience
export type { RedirectTo, MutationMode, Identifier }
