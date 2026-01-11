/**
 * MdxShow - Show view wrapper using @mdxui/admin UI with react-admin context
 *
 * This wrapper provides react-admin's ShowContext around children,
 * enabling use of @mdxui/admin field components for displaying records.
 */

import type { ReactNode, ReactElement } from 'react'
import { useParams } from 'react-router'
import { ShowBase } from 'ra-core'
import { useResourceContext, ResourceContextProvider } from '../../../contexts/ResourceContext'
import type { Identifier } from '../../../contexts/ListContext'
// RaRecord type removed - not used in this file

/**
 * Props for MdxShow component
 */
export interface MdxShowProps {
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
  /** Disable authentication check */
  disableAuthentication?: boolean
  /** Query options for data fetching */
  queryOptions?: object
}

/**
 * Show view container with styling
 */
function ShowView({
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
 * MdxShow - Show wrapper using @mdxui/admin components with react-admin context
 *
 * @example
 * ```tsx
 * import { MdxShow } from 'shadmin'
 * import { MdxTextField, MdxBooleanField, MdxDateField } from 'shadmin/mdxui'
 *
 * <MdxShow resource="users">
 *   <MdxShowLayout>
 *     <MdxTextField source="name" label="Name" />
 *     <MdxTextField source="email" label="Email" />
 *     <MdxBooleanField source="active" label="Active" />
 *     <MdxDateField source="created_at" label="Created" />
 *   </MdxShowLayout>
 * </MdxShow>
 * ```
 */
export function MdxShow({
  resource: resourceProp,
  id: idProp,
  children,
  title,
  actions,
  className,
  disableAuthentication,
  queryOptions,
}: MdxShowProps) {
  const resourceContext = useResourceContext()
  const resource = resourceProp ?? resourceContext
  const params = useParams<{ id: string }>()
  const id = idProp ?? params.id

  if (!resource) {
    throw new Error('MdxShow requires a resource prop or to be used inside a ResourceContext')
  }

  if (!id) {
    throw new Error('MdxShow requires an id prop or to be used with a route that provides an id parameter')
  }

  return (
    <ResourceContextProvider value={resource}>
      <ShowBase
        resource={resource}
        id={id}
        {...(disableAuthentication !== undefined && { disableAuthentication })}
        {...(queryOptions !== undefined && { queryOptions })}
      >
        <ShowView title={title} {...(actions !== undefined && { actions })} {...(className !== undefined && { className })}>
          {children}
        </ShowView>
      </ShowBase>
    </ResourceContextProvider>
  )
}

export default MdxShow
