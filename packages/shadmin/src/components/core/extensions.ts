/**
 * Component Extensions
 *
 * This module provides extensibility patterns for shadmin:
 * - withLifecycleCallbacks: HOC to wrap data provider with lifecycle hooks
 * - Plugin system types and utilities
 * - Custom input/field registry for extensible components
 * - Plugin context and hooks for accessing plugin state
 *
 * Epic: shadmin-zwnj
 */

import { createContext, useContext, type ComponentType, type ReactNode } from 'react'

import type { DataProvider } from '../../facade'

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
  children: ReactNode
  source: string
  label?: string
  isRequired?: boolean
  error?: string
}

// =============================================================================
// CUSTOM INPUT/FIELD REGISTRY
// =============================================================================

/**
 * Base props that all custom inputs must accept
 */
export interface CustomInputBaseProps {
  source: string
  label?: string
  disabled?: boolean
  helperText?: string
  validate?: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Allow any additional props for flexibility
  [key: string]: any
}

/**
 * Custom input registration entry
 */
export interface CustomInputRegistration {
  /** Unique type identifier for this input */
  type: string
  /** The input component */
  component: ComponentType<CustomInputBaseProps>
  /** Human-readable name for the input type */
  displayName?: string
  /** Description of what this input is for */
  description?: string
}

/**
 * Custom field registration entry (for display-only fields)
 */
export interface CustomFieldRegistration {
  /** Unique type identifier for this field */
  type: string
  /** The field component */
  component: ComponentType<{ source: string; record?: unknown; label?: string }>
  /** Human-readable name for the field type */
  displayName?: string
  /** Description of what this field is for */
  description?: string
}

/**
 * Registry for custom inputs and fields
 *
 * This allows plugins to register custom input types that can be used
 * in forms and lists throughout the admin interface.
 *
 * @example
 * ```tsx
 * // Register a custom color picker input
 * inputRegistry.registerInput({
 *   type: 'colorPicker',
 *   component: ColorPickerInput,
 *   displayName: 'Color Picker',
 *   description: 'A color picker with preset colors',
 * })
 *
 * // Later, get the input component
 * const ColorPicker = inputRegistry.getInput('colorPicker')
 * ```
 */
export class ComponentRegistry {
  private inputs: Map<string, CustomInputRegistration> = new Map()
  private fields: Map<string, CustomFieldRegistration> = new Map()
  private listeners: Set<() => void> = new Set()

  /**
   * Register a custom input component
   */
  registerInput(registration: CustomInputRegistration): void {
    if (this.inputs.has(registration.type)) {
      console.warn(`Custom input type "${registration.type}" is already registered. Overwriting.`)
    }
    this.inputs.set(registration.type, registration)
    this.notifyListeners()
  }

  /**
   * Unregister a custom input component
   */
  unregisterInput(type: string): boolean {
    const result = this.inputs.delete(type)
    if (result) {
      this.notifyListeners()
    }
    return result
  }

  /**
   * Get a registered input component by type
   */
  getInput(type: string): ComponentType<CustomInputBaseProps> | undefined {
    return this.inputs.get(type)?.component
  }

  /**
   * Get full registration info for an input type
   */
  getInputRegistration(type: string): CustomInputRegistration | undefined {
    return this.inputs.get(type)
  }

  /**
   * Get all registered input types
   */
  getRegisteredInputTypes(): string[] {
    return Array.from(this.inputs.keys())
  }

  /**
   * Get all input registrations
   */
  getAllInputRegistrations(): CustomInputRegistration[] {
    return Array.from(this.inputs.values())
  }

  /**
   * Check if an input type is registered
   */
  hasInput(type: string): boolean {
    return this.inputs.has(type)
  }

  /**
   * Register a custom field component (for display-only)
   */
  registerField(registration: CustomFieldRegistration): void {
    if (this.fields.has(registration.type)) {
      console.warn(`Custom field type "${registration.type}" is already registered. Overwriting.`)
    }
    this.fields.set(registration.type, registration)
    this.notifyListeners()
  }

  /**
   * Unregister a custom field component
   */
  unregisterField(type: string): boolean {
    const result = this.fields.delete(type)
    if (result) {
      this.notifyListeners()
    }
    return result
  }

  /**
   * Get a registered field component by type
   */
  getField(type: string): ComponentType<{ source: string; record?: unknown; label?: string }> | undefined {
    return this.fields.get(type)?.component
  }

  /**
   * Get full registration info for a field type
   */
  getFieldRegistration(type: string): CustomFieldRegistration | undefined {
    return this.fields.get(type)
  }

  /**
   * Get all registered field types
   */
  getRegisteredFieldTypes(): string[] {
    return Array.from(this.fields.keys())
  }

  /**
   * Get all field registrations
   */
  getAllFieldRegistrations(): CustomFieldRegistration[] {
    return Array.from(this.fields.values())
  }

  /**
   * Check if a field type is registered
   */
  hasField(type: string): boolean {
    return this.fields.has(type)
  }

  /**
   * Subscribe to registry changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.inputs.clear()
    this.fields.clear()
    this.notifyListeners()
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener())
  }
}

/**
 * Global component registry instance
 *
 * This is the default registry used by the plugin system.
 * Plugins can register custom inputs and fields here.
 */
export const componentRegistry = new ComponentRegistry()

// =============================================================================
// PLUGIN CONTEXT AND HOOKS
// =============================================================================

/**
 * Extended plugin context with component registry
 */
export interface PluginContextValue extends AdminPluginContext {
  /** Component registry for custom inputs/fields */
  componentRegistry: ComponentRegistry
  /** List of installed plugin names */
  installedPlugins: string[]
}

/**
 * Context for accessing plugin system from components
 */
export const PluginContext = createContext<PluginContextValue | null>(null)

/**
 * Hook to access the plugin context
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { componentRegistry, installedPlugins } = usePluginContext()
 *
 *   const CustomInput = componentRegistry.getInput('myCustomInput')
 *   if (CustomInput) {
 *     return <CustomInput source="field" />
 *   }
 *   return <TextInput source="field" />
 * }
 * ```
 */
export function usePluginContext(): PluginContextValue {
  const context = useContext(PluginContext)
  if (!context) {
    throw new Error('usePluginContext must be used within a PluginContextProvider')
  }
  return context
}

/**
 * Optional hook to access plugin context (returns null if not available)
 */
export function useOptionalPluginContext(): PluginContextValue | null {
  return useContext(PluginContext)
}

/**
 * Hook to get a custom input component from the registry
 *
 * @example
 * ```tsx
 * function MyForm() {
 *   const ColorPicker = useCustomInput('colorPicker')
 *   if (ColorPicker) {
 *     return <ColorPicker source="color" />
 *   }
 *   return <TextInput source="color" />
 * }
 * ```
 */
export function useCustomInput(type: string): ComponentType<CustomInputBaseProps> | undefined {
  const context = useOptionalPluginContext()
  return context?.componentRegistry.getInput(type) ?? componentRegistry.getInput(type)
}

/**
 * Hook to get a custom field component from the registry
 */
export function useCustomField(type: string): ComponentType<{ source: string; record?: unknown; label?: string }> | undefined {
  const context = useOptionalPluginContext()
  return context?.componentRegistry.getField(type) ?? componentRegistry.getField(type)
}

// =============================================================================
// PLUGIN UTILITIES
// =============================================================================

/**
 * Configuration for creating a plugin
 */
export interface PluginConfig {
  /** Unique name for the plugin */
  name: string
  /** Plugin version (semver) */
  version?: string
  /** Dependencies on other plugins */
  dependencies?: string[]
  /** Custom inputs to register */
  inputs?: CustomInputRegistration[]
  /** Custom fields to register */
  fields?: CustomFieldRegistration[]
  /** Resources to add */
  resources?: Array<{
    name: string
    list?: ComponentType
    edit?: ComponentType
    create?: ComponentType
    show?: ComponentType
  }>
  /** Menu items to add */
  menuItems?: Array<{
    name: string
    path: string
    icon?: ReactNode
  }>
  /** Lifecycle callbacks for resources */
  lifecycleCallbacks?: ResourceLifecycleCallbacks[]
  /** Custom install logic */
  install?: (context: AdminPluginContext) => void | (() => void)
}

/**
 * Create a plugin from a configuration object
 *
 * This is a helper function that simplifies plugin creation by allowing
 * declarative configuration instead of imperative code.
 *
 * @example
 * ```tsx
 * const myPlugin = createPlugin({
 *   name: 'my-plugin',
 *   version: '1.0.0',
 *   inputs: [
 *     {
 *       type: 'colorPicker',
 *       component: ColorPickerInput,
 *       displayName: 'Color Picker',
 *     },
 *   ],
 *   resources: [
 *     {
 *       name: 'settings',
 *       list: SettingsList,
 *       edit: SettingsEdit,
 *     },
 *   ],
 *   menuItems: [
 *     { name: 'Settings', path: '/settings', icon: <SettingsIcon /> },
 *   ],
 *   lifecycleCallbacks: [
 *     {
 *       resource: 'posts',
 *       beforeCreate: async ({ params }) => {
 *         return { ...params, data: { ...params.data, createdAt: new Date() } }
 *       },
 *     },
 *   ],
 * })
 * ```
 */
export function createPlugin(config: PluginConfig): AdminPlugin {
  return {
    name: config.name,
    install: (context): void | (() => void) => {
      const cleanupFunctions: Array<() => void> = []

      // Register custom inputs
      if (config.inputs) {
        config.inputs.forEach((input) => {
          componentRegistry.registerInput(input)
        })
        cleanupFunctions.push(() => {
          config.inputs?.forEach((input) => {
            componentRegistry.unregisterInput(input.type)
          })
        })
      }

      // Register custom fields
      if (config.fields) {
        config.fields.forEach((field) => {
          componentRegistry.registerField(field)
        })
        cleanupFunctions.push(() => {
          config.fields?.forEach((field) => {
            componentRegistry.unregisterField(field.type)
          })
        })
      }

      // Add resources
      if (config.resources) {
        config.resources.forEach((resource) => {
          context.addResource(resource)
        })
      }

      // Add menu items
      if (config.menuItems) {
        config.menuItems.forEach((menuItem) => {
          context.addMenuItem(menuItem)
        })
      }

      // Wrap data provider with lifecycle callbacks
      if (config.lifecycleCallbacks && config.lifecycleCallbacks.length > 0) {
        context.wrapDataProvider((dp) => withLifecycleCallbacks(dp, config.lifecycleCallbacks!))
      }

      // Call custom install logic
      if (config.install) {
        const customCleanup = config.install(context)
        if (typeof customCleanup === 'function') {
          cleanupFunctions.push(customCleanup)
        }
      }

      // Return combined cleanup function
      if (cleanupFunctions.length > 0) {
        return () => {
          cleanupFunctions.forEach((cleanup) => cleanup())
        }
      }
      return undefined
    },
  }
}

/**
 * Type-safe plugin definition helper
 *
 * This is an alias for createPlugin that provides better IDE support
 * and makes the intent clearer when defining plugins.
 *
 * @example
 * ```tsx
 * export const analyticsPlugin = definePlugin({
 *   name: 'analytics',
 *   version: '1.0.0',
 *   install: ({ addMenuItem }) => {
 *     addMenuItem({
 *       name: 'Analytics',
 *       path: '/analytics',
 *       icon: <ChartIcon />,
 *     })
 *   },
 * })
 * ```
 */
export const definePlugin = createPlugin

/**
 * Compose multiple plugins into a single plugin
 *
 * This is useful when you want to group related plugins together
 * or create a "suite" of plugins.
 *
 * @example
 * ```tsx
 * const adminSuite = composePlugins(
 *   'admin-suite',
 *   analyticsPlugin,
 *   settingsPlugin,
 *   notificationsPlugin
 * )
 *
 * // Use as a single plugin
 * <Admin plugins={[adminSuite]}>
 *   ...
 * </Admin>
 * ```
 */
export function composePlugins(name: string, ...plugins: AdminPlugin[]): AdminPlugin {
  return {
    name,
    install: (context): void | (() => void) => {
      const cleanupFunctions: Array<() => void> = []

      plugins.forEach((plugin) => {
        const cleanup = plugin.install(context)
        if (typeof cleanup === 'function') {
          cleanupFunctions.push(cleanup)
        }
      })

      if (cleanupFunctions.length > 0) {
        return () => {
          cleanupFunctions.forEach((cleanup) => cleanup())
        }
      }
      return undefined
    },
  }
}

/**
 * Check if a plugin is installed
 */
export function isPluginInstalled(plugins: AdminPlugin[], pluginName: string): boolean {
  return plugins.some((plugin) => plugin.name === pluginName)
}

/**
 * Get plugin by name from a list of plugins
 */
export function getPlugin(plugins: AdminPlugin[], pluginName: string): AdminPlugin | undefined {
  return plugins.find((plugin) => plugin.name === pluginName)
}
