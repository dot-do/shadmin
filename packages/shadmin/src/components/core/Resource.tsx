/**
 * Resource Component
 * Declares a resource to be managed by the Admin
 * Creates routes for CRUD operations and registers in ResourceDefinitionContext
 */

import { type ReactNode, useEffect, useMemo, memo } from 'react'
import type { ResourceProps, ResourceDefinition } from 'ra-core'

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
const ResourceComponent = ({
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

  // Create the resource definition - memoized for stable reference
  const definition: ResourceDefinition = useMemo(
    () => ({
      name,
      ...(icon !== undefined && { icon }),
      ...(options !== undefined && { options }),
      hasList: !!list,
      hasEdit: !!edit,
      hasCreate: !!create,
      hasShow: !!show,
    }),
    [name, icon, options, list, edit, create, show]
  )

  // Memoize props object to avoid recreation on each render
  const resourceProps: ResourceProps = useMemo(
    () => ({
      name,
      ...(list !== undefined && { list }),
      ...(edit !== undefined && { edit }),
      ...(create !== undefined && { create }),
      ...(show !== undefined && { show }),
      ...(icon !== undefined && { icon }),
      ...(options !== undefined && { options }),
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
    return undefined
  }, [registration, definition, resourceProps, name])

  // Resource doesn't render anything directly
  // The Admin component handles rendering routes
  return children ?? null
}

/**
 * Memoized Resource component to prevent unnecessary re-renders
 * when parent components update but resource props remain unchanged
 */
export const Resource = memo(ResourceComponent)

// Type helper for extracting resource props
export type ResourcePropsFromResource<R extends typeof Resource> = R extends (
  props: infer P
) => ReactNode
  ? P
  : never
