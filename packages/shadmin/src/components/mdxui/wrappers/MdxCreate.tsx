/**
 * MdxCreate - Create view wrapper using @mdxui/admin UI with react-admin context
 *
 * This wrapper provides react-admin's CreateContext around children,
 * enabling use of @mdxui/admin components for creating new records.
 */

import type { ReactNode, ReactElement } from 'react'
import { CreateBase } from '../../../facade'
import { useResourceContext, ResourceContextProvider } from '../../../contexts/ResourceContext'
import type { RaRecord, MutationMode } from '../../../types'

/**
 * Props for MdxCreate component
 */
export interface MdxCreateProps<T extends RaRecord = RaRecord> {
  /** Resource name */
  resource?: string
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
  /** Initial record values */
  record?: Partial<T>
  /** Transform data before submission */
  transform?: (data: Partial<T>) => Partial<T>
  /** Mutation options */
  mutationOptions?: object
}

/**
 * Create view container with styling
 */
function CreateView({
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
 * MdxCreate - Create wrapper using @mdxui/admin components with react-admin context
 *
 * @example
 * ```tsx
 * import { MdxCreate, MdxSimpleForm } from 'shadmin'
 * import { MdxTextInput, MdxBooleanInput } from 'shadmin/mdxui'
 *
 * <MdxCreate resource="users">
 *   <MdxSimpleForm>
 *     <MdxTextInput source="name" label="Name" />
 *     <MdxTextInput source="email" label="Email" />
 *     <MdxBooleanInput source="active" label="Active" />
 *   </MdxSimpleForm>
 * </MdxCreate>
 * ```
 */
export function MdxCreate<T extends RaRecord = RaRecord>({
  resource: resourceProp,
  children,
  title,
  actions,
  className,
  redirect = 'list',
  mutationMode = 'pessimistic',
  disableAuthentication,
  record,
  transform,
  mutationOptions,
}: MdxCreateProps<T>) {
  const resourceContext = useResourceContext()
  const resource = resourceProp ?? resourceContext

  if (!resource) {
    throw new Error('MdxCreate requires a resource prop or to be used inside a ResourceContext')
  }

  return (
    <ResourceContextProvider value={resource}>
      <CreateBase
        resource={resource}
        redirect={redirect}
        mutationMode={mutationMode}
        {...(disableAuthentication !== undefined && { disableAuthentication })}
        {...(record !== undefined && { record })}
        {...(transform !== undefined && { transform })}
        {...(mutationOptions !== undefined && { mutationOptions })}
      >
        <CreateView title={title} {...(actions !== undefined && { actions })} {...(className !== undefined && { className })}>
          {children}
        </CreateView>
      </CreateBase>
    </ResourceContextProvider>
  )
}

export default MdxCreate
