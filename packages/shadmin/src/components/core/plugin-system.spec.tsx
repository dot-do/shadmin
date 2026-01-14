/**
 * Plugin System Tests
 *
 * Comprehensive tests for the shadmin plugin system:
 * - ComponentRegistry for custom inputs and fields
 * - Plugin context and hooks
 * - Plugin utilities (createPlugin, composePlugins)
 * - Plugin lifecycle and cleanup
 *
 * Epic: shadmin-zwnj
 */

import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  ComponentRegistry,
  componentRegistry,
  PluginContext,
  usePluginContext,
  useOptionalPluginContext,
  useCustomInput,
  useCustomField,
  createPlugin,
  definePlugin,
  composePlugins,
  isPluginInstalled,
  getPlugin,
  type AdminPlugin,
  type AdminPluginContext,
  type CustomInputBaseProps,
  type PluginContextValue,
} from './extensions'
import { createMockDataProvider } from '../../test-utils'

import type { ReactNode } from 'react'

// =============================================================================
// TEST COMPONENTS
// =============================================================================

const TestColorInput = ({ source, label }: CustomInputBaseProps) => (
  <div data-testid="color-input" data-source={source} data-label={label}>
    Color Input
  </div>
)

const TestBadgeField = ({ source, label }: { source: string; label?: string }) => (
  <div data-testid="badge-field" data-source={source} data-label={label}>
    Badge Field
  </div>
)

const TestSettingsList = () => <div data-testid="settings-list">Settings List</div>
const TestSettingsEdit = () => <div data-testid="settings-edit">Settings Edit</div>

// =============================================================================
// COMPONENT REGISTRY TESTS
// =============================================================================

describe('ComponentRegistry', () => {
  let registry: ComponentRegistry

  beforeEach(() => {
    registry = new ComponentRegistry()
  })

  describe('input registration', () => {
    it('should register a custom input', () => {
      registry.registerInput({
        type: 'colorPicker',
        component: TestColorInput,
        displayName: 'Color Picker',
      })

      expect(registry.hasInput('colorPicker')).toBe(true)
      expect(registry.getInput('colorPicker')).toBe(TestColorInput)
    })

    it('should return undefined for unregistered input type', () => {
      expect(registry.getInput('nonexistent')).toBeUndefined()
      expect(registry.hasInput('nonexistent')).toBe(false)
    })

    it('should overwrite existing input with same type and warn', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const FirstInput = () => <div>First</div>
      const SecondInput = () => <div>Second</div>

      registry.registerInput({
        type: 'colorPicker',
        component: FirstInput,
      })

      registry.registerInput({
        type: 'colorPicker',
        component: SecondInput,
      })

      expect(warnSpy).toHaveBeenCalledWith(
        'Custom input type "colorPicker" is already registered. Overwriting.'
      )
      expect(registry.getInput('colorPicker')).toBe(SecondInput)

      warnSpy.mockRestore()
    })

    it('should unregister an input', () => {
      registry.registerInput({
        type: 'colorPicker',
        component: TestColorInput,
      })

      const result = registry.unregisterInput('colorPicker')

      expect(result).toBe(true)
      expect(registry.hasInput('colorPicker')).toBe(false)
    })

    it('should return false when unregistering non-existent input', () => {
      const result = registry.unregisterInput('nonexistent')
      expect(result).toBe(false)
    })

    it('should get full registration info', () => {
      registry.registerInput({
        type: 'colorPicker',
        component: TestColorInput,
        displayName: 'Color Picker',
        description: 'A color picker input',
      })

      const registration = registry.getInputRegistration('colorPicker')

      expect(registration).toEqual({
        type: 'colorPicker',
        component: TestColorInput,
        displayName: 'Color Picker',
        description: 'A color picker input',
      })
    })

    it('should list all registered input types', () => {
      registry.registerInput({ type: 'color', component: TestColorInput })
      registry.registerInput({ type: 'rating', component: TestColorInput })
      registry.registerInput({ type: 'slider', component: TestColorInput })

      const types = registry.getRegisteredInputTypes()

      expect(types).toHaveLength(3)
      expect(types).toContain('color')
      expect(types).toContain('rating')
      expect(types).toContain('slider')
    })

    it('should get all input registrations', () => {
      registry.registerInput({ type: 'color', component: TestColorInput, displayName: 'Color' })
      registry.registerInput({ type: 'rating', component: TestColorInput, displayName: 'Rating' })

      const registrations = registry.getAllInputRegistrations()

      expect(registrations).toHaveLength(2)
      expect(registrations.map((r) => r.type)).toEqual(['color', 'rating'])
    })
  })

  describe('field registration', () => {
    it('should register a custom field', () => {
      registry.registerField({
        type: 'badge',
        component: TestBadgeField,
        displayName: 'Badge',
      })

      expect(registry.hasField('badge')).toBe(true)
      expect(registry.getField('badge')).toBe(TestBadgeField)
    })

    it('should return undefined for unregistered field type', () => {
      expect(registry.getField('nonexistent')).toBeUndefined()
      expect(registry.hasField('nonexistent')).toBe(false)
    })

    it('should overwrite existing field with same type and warn', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const FirstField = () => <div>First</div>
      const SecondField = () => <div>Second</div>

      registry.registerField({ type: 'badge', component: FirstField })
      registry.registerField({ type: 'badge', component: SecondField })

      expect(warnSpy).toHaveBeenCalledWith(
        'Custom field type "badge" is already registered. Overwriting.'
      )
      expect(registry.getField('badge')).toBe(SecondField)

      warnSpy.mockRestore()
    })

    it('should unregister a field', () => {
      registry.registerField({ type: 'badge', component: TestBadgeField })

      const result = registry.unregisterField('badge')

      expect(result).toBe(true)
      expect(registry.hasField('badge')).toBe(false)
    })

    it('should get full field registration info', () => {
      registry.registerField({
        type: 'badge',
        component: TestBadgeField,
        displayName: 'Badge',
        description: 'A badge display field',
      })

      const registration = registry.getFieldRegistration('badge')

      expect(registration).toEqual({
        type: 'badge',
        component: TestBadgeField,
        displayName: 'Badge',
        description: 'A badge display field',
      })
    })

    it('should list all registered field types', () => {
      registry.registerField({ type: 'badge', component: TestBadgeField })
      registry.registerField({ type: 'avatar', component: TestBadgeField })

      const types = registry.getRegisteredFieldTypes()

      expect(types).toHaveLength(2)
      expect(types).toContain('badge')
      expect(types).toContain('avatar')
    })
  })

  describe('subscription', () => {
    it('should notify listeners when input is registered', () => {
      const listener = vi.fn()
      registry.subscribe(listener)

      registry.registerInput({ type: 'color', component: TestColorInput })

      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('should notify listeners when input is unregistered', () => {
      registry.registerInput({ type: 'color', component: TestColorInput })

      const listener = vi.fn()
      registry.subscribe(listener)

      registry.unregisterInput('color')

      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('should notify listeners when field is registered', () => {
      const listener = vi.fn()
      registry.subscribe(listener)

      registry.registerField({ type: 'badge', component: TestBadgeField })

      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('should allow unsubscribing', () => {
      const listener = vi.fn()
      const unsubscribe = registry.subscribe(listener)

      registry.registerInput({ type: 'color', component: TestColorInput })
      expect(listener).toHaveBeenCalledTimes(1)

      unsubscribe()

      registry.registerInput({ type: 'rating', component: TestColorInput })
      expect(listener).toHaveBeenCalledTimes(1) // Still 1, not called again
    })
  })

  describe('clear', () => {
    it('should clear all registrations', () => {
      registry.registerInput({ type: 'color', component: TestColorInput })
      registry.registerInput({ type: 'rating', component: TestColorInput })
      registry.registerField({ type: 'badge', component: TestBadgeField })

      registry.clear()

      expect(registry.getRegisteredInputTypes()).toHaveLength(0)
      expect(registry.getRegisteredFieldTypes()).toHaveLength(0)
    })

    it('should notify listeners when cleared', () => {
      registry.registerInput({ type: 'color', component: TestColorInput })

      const listener = vi.fn()
      registry.subscribe(listener)

      registry.clear()

      expect(listener).toHaveBeenCalledTimes(1)
    })
  })
})

// =============================================================================
// GLOBAL REGISTRY TESTS
// =============================================================================

describe('Global componentRegistry', () => {
  afterEach(() => {
    componentRegistry.clear()
  })

  it('should be a singleton instance', () => {
    expect(componentRegistry).toBeInstanceOf(ComponentRegistry)
  })

  it('should persist registrations across usages', () => {
    componentRegistry.registerInput({ type: 'color', component: TestColorInput })

    expect(componentRegistry.hasInput('color')).toBe(true)
  })
})

// =============================================================================
// PLUGIN CONTEXT AND HOOKS TESTS
// =============================================================================

describe('Plugin Context and Hooks', () => {
  const createMockPluginContext = (): PluginContextValue => ({
    dataProvider: createMockDataProvider(),
    addResource: vi.fn(),
    addMenuItem: vi.fn(),
    wrapDataProvider: vi.fn(),
    onUnmount: vi.fn(),
    componentRegistry: new ComponentRegistry(),
    installedPlugins: ['test-plugin'],
  })

  describe('usePluginContext', () => {
    it('should return context when available', () => {
      const mockContext = createMockPluginContext()

      const { result } = renderHook(() => usePluginContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PluginContext.Provider value={mockContext}>{children}</PluginContext.Provider>
        ),
      })

      expect(result.current).toBe(mockContext)
    })

    it('should throw error when context is not available', () => {
      // Suppress console.error for expected error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => usePluginContext())
      }).toThrow('usePluginContext must be used within a PluginContextProvider')

      consoleSpy.mockRestore()
    })
  })

  describe('useOptionalPluginContext', () => {
    it('should return context when available', () => {
      const mockContext = createMockPluginContext()

      const { result } = renderHook(() => useOptionalPluginContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PluginContext.Provider value={mockContext}>{children}</PluginContext.Provider>
        ),
      })

      expect(result.current).toBe(mockContext)
    })

    it('should return null when context is not available', () => {
      const { result } = renderHook(() => useOptionalPluginContext())
      expect(result.current).toBeNull()
    })
  })

  describe('useCustomInput', () => {
    afterEach(() => {
      componentRegistry.clear()
    })

    it('should return input from context registry', () => {
      const mockContext = createMockPluginContext()
      mockContext.componentRegistry.registerInput({
        type: 'color',
        component: TestColorInput,
      })

      const { result } = renderHook(() => useCustomInput('color'), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PluginContext.Provider value={mockContext}>{children}</PluginContext.Provider>
        ),
      })

      expect(result.current).toBe(TestColorInput)
    })

    it('should fall back to global registry when not in context', () => {
      componentRegistry.registerInput({
        type: 'color',
        component: TestColorInput,
      })

      const { result } = renderHook(() => useCustomInput('color'))

      expect(result.current).toBe(TestColorInput)
    })

    it('should return undefined for unregistered type', () => {
      const { result } = renderHook(() => useCustomInput('nonexistent'))
      expect(result.current).toBeUndefined()
    })
  })

  describe('useCustomField', () => {
    afterEach(() => {
      componentRegistry.clear()
    })

    it('should return field from context registry', () => {
      const mockContext = createMockPluginContext()
      mockContext.componentRegistry.registerField({
        type: 'badge',
        component: TestBadgeField,
      })

      const { result } = renderHook(() => useCustomField('badge'), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PluginContext.Provider value={mockContext}>{children}</PluginContext.Provider>
        ),
      })

      expect(result.current).toBe(TestBadgeField)
    })

    it('should fall back to global registry when not in context', () => {
      componentRegistry.registerField({
        type: 'badge',
        component: TestBadgeField,
      })

      const { result } = renderHook(() => useCustomField('badge'))

      expect(result.current).toBe(TestBadgeField)
    })
  })
})

// =============================================================================
// PLUGIN UTILITIES TESTS
// =============================================================================

describe('createPlugin', () => {
  let mockContext: AdminPluginContext

  beforeEach(() => {
    mockContext = {
      dataProvider: createMockDataProvider(),
      addResource: vi.fn(),
      addMenuItem: vi.fn(),
      wrapDataProvider: vi.fn(),
      onUnmount: vi.fn(),
    }
  })

  afterEach(() => {
    componentRegistry.clear()
  })

  it('should create a plugin with name', () => {
    const plugin = createPlugin({
      name: 'my-plugin',
    })

    expect(plugin.name).toBe('my-plugin')
    expect(typeof plugin.install).toBe('function')
  })

  it('should register inputs when installed', () => {
    const plugin = createPlugin({
      name: 'input-plugin',
      inputs: [
        {
          type: 'colorPicker',
          component: TestColorInput,
          displayName: 'Color Picker',
        },
      ],
    })

    plugin.install(mockContext)

    expect(componentRegistry.hasInput('colorPicker')).toBe(true)
  })

  it('should register fields when installed', () => {
    const plugin = createPlugin({
      name: 'field-plugin',
      fields: [
        {
          type: 'badge',
          component: TestBadgeField,
          displayName: 'Badge',
        },
      ],
    })

    plugin.install(mockContext)

    expect(componentRegistry.hasField('badge')).toBe(true)
  })

  it('should add resources when installed', () => {
    const plugin = createPlugin({
      name: 'resource-plugin',
      resources: [
        {
          name: 'settings',
          list: TestSettingsList,
          edit: TestSettingsEdit,
        },
      ],
    })

    plugin.install(mockContext)

    expect(mockContext.addResource).toHaveBeenCalledWith({
      name: 'settings',
      list: TestSettingsList,
      edit: TestSettingsEdit,
    })
  })

  it('should add menu items when installed', () => {
    const plugin = createPlugin({
      name: 'menu-plugin',
      menuItems: [
        {
          name: 'Settings',
          path: '/settings',
        },
      ],
    })

    plugin.install(mockContext)

    expect(mockContext.addMenuItem).toHaveBeenCalledWith({
      name: 'Settings',
      path: '/settings',
    })
  })

  it('should wrap data provider with lifecycle callbacks', () => {
    const beforeCreate = vi.fn()

    const plugin = createPlugin({
      name: 'lifecycle-plugin',
      lifecycleCallbacks: [
        {
          resource: 'posts',
          beforeCreate,
        },
      ],
    })

    plugin.install(mockContext)

    expect(mockContext.wrapDataProvider).toHaveBeenCalled()
  })

  it('should call custom install function', () => {
    const customInstall = vi.fn()

    const plugin = createPlugin({
      name: 'custom-plugin',
      install: customInstall,
    })

    plugin.install(mockContext)

    expect(customInstall).toHaveBeenCalledWith(mockContext)
  })

  it('should return cleanup function that unregisters inputs', () => {
    const plugin = createPlugin({
      name: 'cleanup-plugin',
      inputs: [
        {
          type: 'colorPicker',
          component: TestColorInput,
        },
      ],
    })

    const cleanup = plugin.install(mockContext)

    expect(componentRegistry.hasInput('colorPicker')).toBe(true)

    cleanup?.()

    expect(componentRegistry.hasInput('colorPicker')).toBe(false)
  })

  it('should return cleanup function that unregisters fields', () => {
    const plugin = createPlugin({
      name: 'cleanup-plugin',
      fields: [
        {
          type: 'badge',
          component: TestBadgeField,
        },
      ],
    })

    const cleanup = plugin.install(mockContext)

    expect(componentRegistry.hasField('badge')).toBe(true)

    cleanup?.()

    expect(componentRegistry.hasField('badge')).toBe(false)
  })

  it('should call custom cleanup function', () => {
    const customCleanup = vi.fn()

    const plugin = createPlugin({
      name: 'custom-cleanup-plugin',
      install: () => customCleanup,
    })

    const cleanup = plugin.install(mockContext)
    cleanup?.()

    expect(customCleanup).toHaveBeenCalled()
  })
})

describe('definePlugin', () => {
  it('should be an alias for createPlugin', () => {
    expect(definePlugin).toBe(createPlugin)
  })
})

describe('composePlugins', () => {
  let mockContext: AdminPluginContext

  beforeEach(() => {
    mockContext = {
      dataProvider: createMockDataProvider(),
      addResource: vi.fn(),
      addMenuItem: vi.fn(),
      wrapDataProvider: vi.fn(),
      onUnmount: vi.fn(),
    }
  })

  afterEach(() => {
    componentRegistry.clear()
  })

  it('should create a composed plugin with combined name', () => {
    const plugin1 = createPlugin({ name: 'plugin-1' })
    const plugin2 = createPlugin({ name: 'plugin-2' })

    const composed = composePlugins('my-suite', plugin1, plugin2)

    expect(composed.name).toBe('my-suite')
  })

  it('should install all composed plugins', () => {
    const install1 = vi.fn()
    const install2 = vi.fn()

    const plugin1: AdminPlugin = { name: 'plugin-1', install: install1 }
    const plugin2: AdminPlugin = { name: 'plugin-2', install: install2 }

    const composed = composePlugins('suite', plugin1, plugin2)
    composed.install(mockContext)

    expect(install1).toHaveBeenCalledWith(mockContext)
    expect(install2).toHaveBeenCalledWith(mockContext)
  })

  it('should call all cleanup functions when composed cleanup is called', () => {
    const cleanup1 = vi.fn()
    const cleanup2 = vi.fn()

    const plugin1: AdminPlugin = { name: 'plugin-1', install: () => cleanup1 }
    const plugin2: AdminPlugin = { name: 'plugin-2', install: () => cleanup2 }

    const composed = composePlugins('suite', plugin1, plugin2)
    const composedCleanup = composed.install(mockContext)

    composedCleanup?.()

    expect(cleanup1).toHaveBeenCalled()
    expect(cleanup2).toHaveBeenCalled()
  })

  it('should handle plugins without cleanup functions', () => {
    const plugin1: AdminPlugin = { name: 'plugin-1', install: vi.fn() }
    const cleanup2 = vi.fn()
    const plugin2: AdminPlugin = { name: 'plugin-2', install: () => cleanup2 }

    const composed = composePlugins('suite', plugin1, plugin2)
    const composedCleanup = composed.install(mockContext)

    composedCleanup?.()

    expect(cleanup2).toHaveBeenCalled()
  })

  it('should return undefined cleanup when no plugins have cleanup', () => {
    const plugin1: AdminPlugin = { name: 'plugin-1', install: vi.fn() }
    const plugin2: AdminPlugin = { name: 'plugin-2', install: vi.fn() }

    const composed = composePlugins('suite', plugin1, plugin2)
    const composedCleanup = composed.install(mockContext)

    expect(composedCleanup).toBeUndefined()
  })
})

describe('isPluginInstalled', () => {
  it('should return true if plugin is in list', () => {
    const plugins: AdminPlugin[] = [
      { name: 'plugin-1', install: vi.fn() },
      { name: 'plugin-2', install: vi.fn() },
    ]

    expect(isPluginInstalled(plugins, 'plugin-1')).toBe(true)
    expect(isPluginInstalled(plugins, 'plugin-2')).toBe(true)
  })

  it('should return false if plugin is not in list', () => {
    const plugins: AdminPlugin[] = [{ name: 'plugin-1', install: vi.fn() }]

    expect(isPluginInstalled(plugins, 'plugin-2')).toBe(false)
  })

  it('should return false for empty list', () => {
    expect(isPluginInstalled([], 'plugin-1')).toBe(false)
  })
})

describe('getPlugin', () => {
  it('should return plugin by name', () => {
    const plugin1: AdminPlugin = { name: 'plugin-1', install: vi.fn() }
    const plugin2: AdminPlugin = { name: 'plugin-2', install: vi.fn() }
    const plugins = [plugin1, plugin2]

    expect(getPlugin(plugins, 'plugin-1')).toBe(plugin1)
    expect(getPlugin(plugins, 'plugin-2')).toBe(plugin2)
  })

  it('should return undefined for non-existent plugin', () => {
    const plugins: AdminPlugin[] = [{ name: 'plugin-1', install: vi.fn() }]

    expect(getPlugin(plugins, 'plugin-2')).toBeUndefined()
  })

  it('should return undefined for empty list', () => {
    expect(getPlugin([], 'plugin-1')).toBeUndefined()
  })
})

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('Plugin System Integration', () => {
  let mockContext: AdminPluginContext

  beforeEach(() => {
    mockContext = {
      dataProvider: createMockDataProvider(),
      addResource: vi.fn(),
      addMenuItem: vi.fn(),
      wrapDataProvider: vi.fn(),
      onUnmount: vi.fn(),
    }
  })

  afterEach(() => {
    componentRegistry.clear()
  })

  it('should support complex plugin configuration', () => {
    const plugin = createPlugin({
      name: 'advanced-plugin',
      version: '1.0.0',
      inputs: [
        {
          type: 'colorPicker',
          component: TestColorInput,
          displayName: 'Color Picker',
        },
      ],
      fields: [
        {
          type: 'badge',
          component: TestBadgeField,
          displayName: 'Badge',
        },
      ],
      resources: [
        {
          name: 'settings',
          list: TestSettingsList,
          edit: TestSettingsEdit,
        },
      ],
      menuItems: [
        {
          name: 'Settings',
          path: '/settings',
        },
      ],
      install: ({ addMenuItem }) => {
        addMenuItem({
          name: 'Custom Menu',
          path: '/custom',
        })
      },
    })

    plugin.install(mockContext)

    expect(componentRegistry.hasInput('colorPicker')).toBe(true)
    expect(componentRegistry.hasField('badge')).toBe(true)
    expect(mockContext.addResource).toHaveBeenCalled()
    expect(mockContext.addMenuItem).toHaveBeenCalledTimes(2)
  })

  it('should support plugin composition with different feature sets', () => {
    const inputPlugin = createPlugin({
      name: 'input-plugin',
      inputs: [{ type: 'color', component: TestColorInput }],
    })

    const menuPlugin = createPlugin({
      name: 'menu-plugin',
      menuItems: [{ name: 'Menu', path: '/menu' }],
    })

    const resourcePlugin = createPlugin({
      name: 'resource-plugin',
      resources: [{ name: 'resource', list: TestSettingsList }],
    })

    const suite = composePlugins('suite', inputPlugin, menuPlugin, resourcePlugin)
    const cleanup = suite.install(mockContext)

    expect(componentRegistry.hasInput('color')).toBe(true)
    expect(mockContext.addMenuItem).toHaveBeenCalled()
    expect(mockContext.addResource).toHaveBeenCalled()

    cleanup?.()

    expect(componentRegistry.hasInput('color')).toBe(false)
  })
})
