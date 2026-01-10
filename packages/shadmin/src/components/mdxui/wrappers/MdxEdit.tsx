/**
 * MdxEdit - Edit view wrapper using @mdxui/admin UI with react-admin context
 *
 * This wrapper provides react-admin's EditContext around children,
 * enabling use of @mdxui/admin components for editing records.
 */

import type { ReactNode, ReactElement } from 'react'
import { useParams } from 'react-router'
import { EditBase } from 'ra-core'
import { useResourceContext, ResourceContextProvider } from '../../../contexts/ResourceContext'
import type { Identifier } from '../../../contexts/ListContext'
import type { RaRecord, MutationMode } from '../../../types'

/**
 * Props for MdxEdit component
 */
export interface MdxEditProps<T extends RaRecord = RaRecord> {
  /** Resource name */
  resource?: string
  /** Record ID (optional, defaults to route param) */
  id?: Identifier
  /** Child elements to render */
  children: ReactNode
  /** Title to display */
  title?: ReactNode
  /** Custom actions component */
  actions?: ReactElement | false
  /** Additional CSS class name */
  className?: string
  /** Redirect target after save */
  redirect?: 'list' | 'show' | 'edit' | false | string
  /** Mutation mode */
  mutationMode?: MutationMode
  /** Disable authentication check */
  disableAuthentication?: boolean
  /** Query options for data fetching */
  queryOptions?: object
  /** Mutation options for data updating */
  mutationOptions?: object
}

/**
 * Edit view container with styling
 */
function EditView({
  title,
  actions,
  className,
  children,
}: {
  title?: ReactNode
  actions?: ReactElement | false
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      {(title || actions !== false) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

/**
 * MdxEdit - Edit wrapper using @mdxui/admin components with react-admin context
 *
 * @example
 * ```tsx
 * import { MdxEdit, MdxSimpleForm } from 'shadmin'
 * import { MdxTextInput, MdxBooleanInput } from 'shadmin/mdxui'
 *
 * <MdxEdit resource="users">
 *   <MdxSimpleForm>
 *     <MdxTextInput source="name" label="Name" />
 *     <MdxTextInput source="email" label="Email" />
 *     <MdxBooleanInput source="active" label="Active" />
 *   </MdxSimpleForm>
 * </MdxEdit>
 * ```
 */
export function MdxEdit<T extends RaRecord = RaRecord>({
  resource: resourceProp,
  id: idProp,
  children,
  title,
  actions,
  className,
  redirect = 'list',
  mutationMode = 'pessimistic',
  disableAuthentication,
  queryOptions,
  mutationOptions,
}: MdxEditProps<T>) {
  const resourceContext = useResourceContext()
  const resource = resourceProp ?? resourceContext
  const params = useParams<{ id: string }>()
  const id = idProp ?? params.id

  if (!resource) {
    throw new Error('MdxEdit requires a resource prop or to be used inside a ResourceContext')
  }

  if (!id) {
    throw new Error('MdxEdit requires an id prop or to be used with a route that provides an id parameter')
  }

  return (
    <ResourceContextProvider value={resource}>
      <EditBase
        resource={resource}
        id={id}
        redirect={redirect}
        mutationMode={mutationMode}
        disableAuthentication={disableAuthentication}
        queryOptions={queryOptions}
        mutationOptions={mutationOptions}
      >
        <EditView title={title} actions={actions} className={className}>
          {children}
        </EditView>
      </EditBase>
    </ResourceContextProvider>
  )
}

export default MdxEdit
