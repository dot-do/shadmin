/**
 * Component Extensions
 *
 * This module provides extensibility patterns for shadmin:
 * - withLifecycleCallbacks: HOC to wrap data provider with lifecycle hooks
 * - Plugin system types and utilities
 * - Custom renderer support
 *
 * Epic: shadmin-zwnj
 */

import type { DataProvider } from 'ra-core'

/**
 * Lifecycle callback context passed to before/after hooks
 */
export interface LifecycleCallbackContext {
  resource: string
  params: unknown
  dataProvider: DataProvider
}

/**
 * Lifecycle callback context for after hooks (includes result)
 */
export interface AfterLifecycleCallbackContext extends LifecycleCallbackContext {
  result: unknown
}

/**
 * Resource lifecycle callback configuration
 */
export interface ResourceLifecycleCallbacks {
  resource: string
  beforeCreate?: (context: LifecycleCallbackContext) => unknown | Promise<unknown>
  afterCreate?: (context: AfterLifecycleCallbackContext) => void | Promise<void>
  beforeUpdate?: (context: LifecycleCallbackContext) => unknown | Promise<unknown>
  afterUpdate?: (context: AfterLifecycleCallbackContext) => void | Promise<void>
  beforeDelete?: (context: LifecycleCallbackContext) => unknown | Promise<unknown>
  afterDelete?: (context: AfterLifecycleCallbackContext) => void | Promise<void>
  beforeGetList?: (context: LifecycleCallbackContext) => unknown | Promise<unknown>
  afterGetList?: (context: AfterLifecycleCallbackContext) => void | Promise<void>
  beforeGetOne?: (context: LifecycleCallbackContext) => unknown | Promise<unknown>
  afterGetOne?: (context: AfterLifecycleCallbackContext) => void | Promise<void>
}

/**
 * Find callbacks for a given resource
 */
function findCallbacksForResource(
  callbacks: ResourceLifecycleCallbacks[],
  resource: string
): ResourceLifecycleCallbacks | undefined {
  return callbacks.find((cb) => cb.resource === resource)
}

/**
 * Wraps a DataProvider with lifecycle callbacks for specific resources.
 *
 * This HOC allows you to intercept and modify data provider operations:
 * - beforeX callbacks can modify params or abort operations (by throwing)
 * - afterX callbacks can perform side effects after operations complete
 *
 * @example
 * ```tsx
 * const wrappedProvider = withLifecycleCallbacks(dataProvider, [
 *   {
 *     resource: 'posts',
 *     beforeCreate: async ({ params }) => {
 *       // Add timestamp
 *       return { ...params, data: { ...params.data, createdAt: new Date() } }
 *     },
 *     afterCreate: async ({ result }) => {
 *       // Log creation
 *       console.log('Created post:', result.data.id)
 *     },
 *   },
 * ])
 * ```
 *
 * @param dataProvider - The original data provider to wrap
 * @param callbacks - Array of resource-specific lifecycle callbacks
 * @returns A wrapped data provider with lifecycle hooks
 */
export function withLifecycleCallbacks(
  dataProvider: DataProvider,
  callbacks: ResourceLifecycleCallbacks[]
): DataProvider {
  const wrapped = {
    getList: async (resource: string, params: Parameters<DataProvider['getList']>[1]) => {
      const resourceCallbacks = findCallbacksForResource(callbacks, resource)
      let finalParams = params

      // Call beforeGetList if defined
      if (resourceCallbacks?.beforeGetList) {
        const result = await resourceCallbacks.beforeGetList({
          resource,
          params,
          dataProvider,
        })
        if (result !== undefined) {
          finalParams = result as typeof params
        }
      }

      const response = await dataProvider.getList(resource, finalParams)

      // Call afterGetList if defined
      if (resourceCallbacks?.afterGetList) {
        await resourceCallbacks.afterGetList({
          resource,
          params: finalParams,
          result: response,
          dataProvider,
        })
      }

      return response
    },

    getOne: async (resource: string, params: Parameters<DataProvider['getOne']>[1]) => {
      const resourceCallbacks = findCallbacksForResource(callbacks, resource)
      let finalParams = params

      // Call beforeGetOne if defined
      if (resourceCallbacks?.beforeGetOne) {
        const result = await resourceCallbacks.beforeGetOne({
          resource,
          params,
          dataProvider,
        })
        if (result !== undefined) {
          finalParams = result as typeof params
        }
      }

      const response = await dataProvider.getOne(resource, finalParams)

      // Call afterGetOne if defined
      if (resourceCallbacks?.afterGetOne) {
        await resourceCallbacks.afterGetOne({
          resource,
          params: finalParams,
          result: response,
          dataProvider,
        })
      }

      return response
    },

    getMany: async (resource: string, params: Parameters<DataProvider['getMany']>[1]) => {
      return dataProvider.getMany(resource, params)
    },

    getManyReference: async (resource: string, params: Parameters<DataProvider['getManyReference']>[1]) => {
      return dataProvider.getManyReference(resource, params)
    },

    create: async (resource: string, params: Parameters<DataProvider['create']>[1]) => {
      const resourceCallbacks = findCallbacksForResource(callbacks, resource)
      let finalParams = params

      // Call beforeCreate if defined
      if (resourceCallbacks?.beforeCreate) {
        const result = await resourceCallbacks.beforeCreate({
          resource,
          params,
          dataProvider,
        })
        if (result !== undefined) {
          finalParams = result as typeof params
        }
      }

      const response = await dataProvider.create(resource, finalParams)

      // Call afterCreate if defined
      if (resourceCallbacks?.afterCreate) {
        await resourceCallbacks.afterCreate({
          resource,
          params: finalParams,
          result: response,
          dataProvider,
        })
      }

      return response
    },

    update: async (resource: string, params: Parameters<DataProvider['update']>[1]) => {
      const resourceCallbacks = findCallbacksForResource(callbacks, resource)
      let finalParams = params

      // Call beforeUpdate if defined
      if (resourceCallbacks?.beforeUpdate) {
        const result = await resourceCallbacks.beforeUpdate({
          resource,
          params,
          dataProvider,
        })
        if (result !== undefined) {
          finalParams = result as typeof params
        }
      }

      const response = await dataProvider.update(resource, finalParams)

      // Call afterUpdate if defined
      if (resourceCallbacks?.afterUpdate) {
        await resourceCallbacks.afterUpdate({
          resource,
          params: finalParams,
          result: response,
          dataProvider,
        })
      }

      return response
    },

    updateMany: async (resource: string, params: Parameters<DataProvider['updateMany']>[1]) => {
      return dataProvider.updateMany(resource, params)
    },

    delete: async (resource: string, params: Parameters<DataProvider['delete']>[1]) => {
      const resourceCallbacks = findCallbacksForResource(callbacks, resource)
      let finalParams = params

      // Call beforeDelete if defined
      if (resourceCallbacks?.beforeDelete) {
        const result = await resourceCallbacks.beforeDelete({
          resource,
          params,
          dataProvider,
        })
        if (result !== undefined) {
          finalParams = result as typeof params
        }
      }

      const response = await dataProvider.delete(resource, finalParams)

      // Call afterDelete if defined
      if (resourceCallbacks?.afterDelete) {
        await resourceCallbacks.afterDelete({
          resource,
          params: finalParams,
          result: response,
          dataProvider,
        })
      }

      return response
    },

    deleteMany: async (resource: string, params: Parameters<DataProvider['deleteMany']>[1]) => {
      return dataProvider.deleteMany(resource, params)
    },
  }

  return wrapped as DataProvider
}

/**
 * Plugin interface for extending Admin functionality
 */
export interface AdminPlugin {
  name: string
  install: (context: AdminPluginContext) => void | (() => void)
}

/**
 * Context passed to plugin install function
 */
export interface AdminPluginContext {
  dataProvider: DataProvider
  addResource: (resource: { name: string; list?: React.ComponentType; edit?: React.ComponentType; create?: React.ComponentType; show?: React.ComponentType }) => void
  addMenuItem: (item: { name: string; path: string; icon?: React.ReactNode }) => void
  wrapDataProvider: (wrapper: (dp: DataProvider) => DataProvider) => void
  onUnmount: (cleanup: () => void) => void
}

/**
 * Cell renderer props for Datagrid
 */
export interface CellRendererProps<T = unknown> {
  record: T
  column: string
  value: unknown
  rowIndex: number
}

/**
 * Field wrapper props for Form
 */
export interface FieldWrapperProps {
  children: React.ReactNode
  source: string
  label?: string
  isRequired?: boolean
  error?: string
}
