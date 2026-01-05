/**
 * Resource Component
 * Declares a resource to be managed by the Admin
 * Creates routes for CRUD operations and registers in ResourceDefinitionContext
 */

import { type ReactNode, useEffect, useMemo } from 'react'
import type { ResourceProps, ResourceDefinition } from '../../types'

// Context for registering resources (used internally by Admin)
import { createContext, useContext } from 'react'

export interface ResourceRegistrationContextValue {
  register: (definition: ResourceDefinition, props: ResourceProps) => void
  unregister: (name: string) => void
}

export const ResourceRegistrationContext = createContext<ResourceRegistrationContextValue | null>(
  null
)

/**
 * Resource component
 * Registers the resource in the Admin context and provides route definitions
 *
 * @example
 * ```tsx
 * <Admin dataProvider={dataProvider}>
 *   <Resource
 *     name="posts"
 *     list={PostList}
 *     edit={PostEdit}
 *     create={PostCreate}
 *     show={PostShow}
 *     icon={PostIcon}
 *     options={{ label: 'Blog Posts' }}
 *   />
 * </Admin>
 * ```
 */
export const Resource = ({
  name,
  list,
  edit,
  create,
  show,
  icon,
  options,
  children,
}: ResourceProps): ReactNode => {
  const registration = useContext(ResourceRegistrationContext)

  // Create the resource definition
  const definition: ResourceDefinition = useMemo(
    () => ({
      name,
      icon,
      options,
      hasList: !!list,
      hasEdit: !!edit,
      hasCreate: !!create,
      hasShow: !!show,
    }),
    [name, icon, options, list, edit, create, show]
  )

  // Create props for route generation
  const resourceProps: ResourceProps = useMemo(
    () => ({
      name,
      list,
      edit,
      create,
      show,
      icon,
      options,
    }),
    [name, list, edit, create, show, icon, options]
  )

  // Register the resource when mounted, unregister when unmounted
  useEffect(() => {
    if (registration) {
      registration.register(definition, resourceProps)
      return () => {
        registration.unregister(name)
      }
    }
  }, [registration, definition, resourceProps, name])

  // Resource doesn't render anything directly
  // The Admin component handles rendering routes
  return children ?? null
}

// Type helper for extracting resource props
export type ResourcePropsFromResource<R extends typeof Resource> = R extends (
  props: infer P
) => ReactNode
  ? P
  : never
