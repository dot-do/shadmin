/**
 * Edit Component
 * Complete edit component combining EditBase (logic) and EditView (UI)
 * 100% API-compatible with react-admin Edit
 *
 * Epic: shadmin-ha1 (P1)
 */

import type { ReactNode, ReactElement } from 'react'
import { EditBase, type EditBaseProps, type RedirectTo } from './EditBase'
import { EditView, type EditViewProps } from './EditView'
import { useRecordContext } from '../../contexts/RecordContext'
import { useGetOne } from '../../hooks/useGetOne'
import { useResourceContext } from '../../contexts/ResourceContext'
import type { Identifier, RaRecord } from '../../types'
import type { MutationMode } from '../../contexts/FormContext'

/**
 * Props for Edit component
 * Combines EditBase props (logic) with EditView props (UI)
 */
export interface EditProps<RecordType extends RaRecord = RaRecord>
  extends Omit<EditBaseProps<RecordType>, 'children'>,
    Pick<EditViewProps, 'actions' | 'aside' | 'className'> {
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
  id,
  queryOptions,
}: EditProps<RecordType>) {
  // Get resource from context if not provided
  const resourceFromContext = useResourceContext()
  const resource = resourceProp ?? resourceFromContext ?? ''

  // Separate meta from queryOptions
  const { meta, ...restQueryOptions } = queryOptions ?? {}

  // Use useGetOne to check loading/error states
  const { data, isLoading, error } = useGetOne<RecordType>(
    resource,
    { id, meta },
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
 * @example
 * ```tsx
 * // Basic usage
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
  id,
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
