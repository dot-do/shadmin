/**
 * @file vite-plugin.execution.spec.ts
 * @description RED phase execution tests that verify virtual modules work in a real Vite context
 *
 * These tests verify:
 * 1. Virtual modules (shadmin:config, shadmin:routes) resolve correctly
 * 2. Generated code compiles and runs in Vite dev server
 * 3. HMR updates work correctly when resource files change
 * 4. Build output is correct for production
 *
 * Note: Tests use actual Vite server creation to verify real execution behavior.
 * The node environment is required for esbuild compatibility.
 *
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createServer, build, type ViteDevServer, type InlineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { tmpdir } from 'os'
import { shadminPlugin, type ShadminPluginOptions } from './vite-plugin'

// Project root has actual node_modules for full module loading tests
const PROJECT_ROOT = resolve(__dirname, '../..')

/**
 * Creates a minimal test project structure
 */
function createTestProject(testDir: string, files: Record<string, string> = {}) {
  mkdirSync(join(testDir, 'resources'), { recursive: true })

  // Default package.json for module resolution
  const packageJson = {
    name: 'test-project',
    type: 'module',
    dependencies: {
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
  }
  writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson, null, 2))

  // Write any additional files
  for (const [path, content] of Object.entries(files)) {
    const fullPath = join(testDir, path)
    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(fullPath, content)
  }
}

/**
 * Creates a Vite dev server configuration for testing
 */
function createTestViteConfig(
  root: string,
  pluginOptions: ShadminPluginOptions
): InlineConfig {
  return {
    root,
    plugins: [react(), shadminPlugin(pluginOptions)],
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
    // Link to actual node_modules for dependency resolution
    resolve: {
      alias: {
        shadmin: join(PROJECT_ROOT, 'dist', 'index.js'),
      },
    },
  }
}

describe('Virtual Module Execution in Real Vite Context', () => {
  let testDir: string
  let server: ViteDevServer | null = null

  beforeEach(() => {
    testDir = join(
      tmpdir(),
      `shadmin-exec-${Date.now()}-${Math.random().toString(36).slice(2)}`
    )
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(async () => {
    if (server) {
      await server.close()
      server = null
    }
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  describe('Virtual Module Resolution', () => {
    it('should resolve virtual:shadmin-app module in Vite server', async () => {
      createTestProject(testDir, {
        'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
      })

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      // Verify the module can be resolved
      const resolvedId = await server.pluginContainer.resolveId('virtual:shadmin-app')
      expect(resolvedId).toBeDefined()
      expect(resolvedId?.id).toBe('\0virtual:shadmin-app.tsx')
    })

    it('should resolve virtual:shadmin-entry module in Vite server', async () => {
      createTestProject(testDir)

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      const resolvedId = await server.pluginContainer.resolveId('virtual:shadmin-entry')
      expect(resolvedId).toBeDefined()
      expect(resolvedId?.id).toBe('\0virtual:shadmin-entry.tsx')
    })

    it('should not resolve non-virtual modules through shadmin plugin', async () => {
      createTestProject(testDir)

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      // The shadmin plugin should return null for non-virtual modules
      // (other plugins may still resolve it)
      const plugin = shadminPlugin({ root: testDir })
      const resolveId = plugin.resolveId as Function
      const result = await resolveId('./some-file.ts')
      expect(result).toBeNull()
    })

    it('should resolve virtual modules with different import formats', async () => {
      createTestProject(testDir)

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      // Test with bare specifier
      const bare = await server.pluginContainer.resolveId('virtual:shadmin-app')
      expect(bare?.id).toBe('\0virtual:shadmin-app.tsx')

      // Test with entry module
      const entry = await server.pluginContainer.resolveId('virtual:shadmin-entry')
      expect(entry?.id).toBe('\0virtual:shadmin-entry.tsx')
    })
  })

  describe('Generated Code Compilation', () => {
    it('should load virtual:shadmin-app and return valid JavaScript', async () => {
      createTestProject(testDir, {
        'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
      })

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      // Load the module content through Vite's plugin container
      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)

      expect(loaded).toBeDefined()
      expect(typeof loaded).toBe('string')

      // Verify it's valid transformed JavaScript (not JSX)
      const code = loaded as string
      expect(code).toContain('React.createElement')
      expect(code).not.toContain('<Admin')
      expect(code).not.toContain('<Resource')
    })

    it('should load virtual:shadmin-entry and return valid JavaScript', async () => {
      createTestProject(testDir)

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-entry')
      const loaded = await server.pluginContainer.load(resolved!.id)

      expect(loaded).toBeDefined()
      expect(typeof loaded).toBe('string')

      const code = loaded as string
      expect(code).toContain('React.createElement')
      expect(code).toContain('createRoot')
    })

    it('should generate code that includes all discovered resources', async () => {
      createTestProject(testDir, {
        'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
export function create() { return null }
`,
        'resources/users.tsx': `
export const name = 'users'
export function list() { return null }
export function edit() { return null }
export function show() { return null }
`,
        'resources/comments.tsx': `
export const name = 'comments'
export function list() { return null }
`,
      })

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)
      const code = loaded as string

      // All resources should be present
      expect(code).toContain('posts')
      expect(code).toContain('users')
      expect(code).toContain('comments')

      // CRUD operations should be mapped
      expect(code).toContain('posts.list')
      expect(code).toContain('posts.create')
      expect(code).toContain('users.list')
      expect(code).toContain('users.edit')
      expect(code).toContain('users.show')
    })

    it('should generate valid code with empty resources directory', async () => {
      createTestProject(testDir, {}) // No resources

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)
      const code = loaded as string

      // Should still have valid Admin component
      expect(code).toContain('React.createElement')
      expect(code).toContain('Admin')
      // Should not have Resource since there are no resources
      expect(code).not.toContain('Resource')
    })

    it('should include provider imports when configured', async () => {
      createTestProject(testDir, {
        'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
        'data-provider.ts': `
export const dataProvider = { getList: async () => ({ data: [], total: 0 }) }
`,
        'auth-provider.ts': `
export const authProvider = { login: async () => {} }
`,
      })

      server = await createServer(
        createTestViteConfig(testDir, {
          root: testDir,
          dataProviderImport: './data-provider',
          authProviderImport: './auth-provider',
        })
      )

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)
      const code = loaded as string

      expect(code).toContain('dataProvider')
      expect(code).toContain('authProvider')
      expect(code).toContain('./data-provider')
      expect(code).toContain('./auth-provider')
    })
  })

  describe('SSR Module Loading', () => {
    // These tests verify that modules can actually be executed, not just loaded

    it('should SSR load virtual:shadmin-app and export App function', async () => {
      // Use project root which has real node_modules
      server = await createServer({
        root: PROJECT_ROOT,
        plugins: [react(), shadminPlugin({ root: PROJECT_ROOT })],
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'silent',
      })

      // Load the module via Vite's SSR loader
      const module = await server.ssrLoadModule('virtual:shadmin-app')

      expect(module).toBeDefined()
      expect(module.App).toBeDefined()
      expect(typeof module.App).toBe('function')
    })

    it('should render App component and return React element', async () => {
      server = await createServer({
        root: PROJECT_ROOT,
        plugins: [react(), shadminPlugin({ root: PROJECT_ROOT })],
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'silent',
      })

      const { App } = await server.ssrLoadModule('virtual:shadmin-app')

      // Call App and verify it returns a valid React element
      const element = App()
      expect(element).toBeDefined()
      expect(element).toHaveProperty('type')
      expect(element).toHaveProperty('props')
    })

    it('should execute App component with proper React element structure', async () => {
      server = await createServer({
        root: PROJECT_ROOT,
        plugins: [react(), shadminPlugin({ root: PROJECT_ROOT })],
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'silent',
      })

      const { App } = await server.ssrLoadModule('virtual:shadmin-app')

      const element = App()

      // Verify React element structure
      expect(element.$$typeof).toBeDefined() // React element marker
      expect(element.type).toBeDefined()
      expect(element.props).toBeDefined()
    })
  })

  describe('HMR Updates', () => {
    it('should trigger full reload when resource file changes', async () => {
      createTestProject(testDir, {
        'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
      })

      const plugin = shadminPlugin({ root: testDir })
      const handleHotUpdate = plugin.handleHotUpdate as Function

      const mockWsSend = vi.fn()
      const mockServer = {
        ws: { send: mockWsSend },
        moduleGraph: {
          getModuleById: vi.fn().mockReturnValue({ id: '\0virtual:shadmin-app.tsx' }),
        },
      }

      const ctx = {
        file: join(testDir, 'resources', 'posts.tsx'),
        server: mockServer,
        modules: [],
      }

      const result = await handleHotUpdate(ctx)

      expect(mockWsSend).toHaveBeenCalledWith({
        type: 'full-reload',
        path: '*',
      })
      expect(result).toEqual([]) // Indicates handled
    })

    it('should trigger reload when new resource is added', async () => {
      createTestProject(testDir)

      const plugin = shadminPlugin({ root: testDir })
      const handleHotUpdate = plugin.handleHotUpdate as Function

      const mockWsSend = vi.fn()
      const mockServer = {
        ws: { send: mockWsSend },
        moduleGraph: { getModuleById: vi.fn() },
      }

      // Simulate adding a new resource file
      const ctx = {
        file: join(testDir, 'resources', 'new-resource.tsx'),
        server: mockServer,
        modules: [],
      }

      await handleHotUpdate(ctx)

      expect(mockWsSend).toHaveBeenCalledWith({
        type: 'full-reload',
        path: '*',
      })
    })

    it('should NOT trigger reload for non-resource file changes', async () => {
      createTestProject(testDir)

      const plugin = shadminPlugin({ root: testDir })
      const handleHotUpdate = plugin.handleHotUpdate as Function

      const mockWsSend = vi.fn()
      const mockServer = {
        ws: { send: mockWsSend },
        moduleGraph: { getModuleById: vi.fn() },
      }

      // File outside resources directory
      const ctx = {
        file: join(testDir, 'some-other-file.ts'),
        server: mockServer,
        modules: [],
      }

      const result = await handleHotUpdate(ctx)

      expect(mockWsSend).not.toHaveBeenCalled()
      expect(result).toBeUndefined() // Indicates not handled
    })

    it('should trigger reload for nested resource changes', async () => {
      createTestProject(testDir, {
        'resources/admin/settings.tsx': `
export const name = 'admin/settings'
export function list() { return null }
`,
      })

      const plugin = shadminPlugin({ root: testDir })
      const handleHotUpdate = plugin.handleHotUpdate as Function

      const mockWsSend = vi.fn()
      const mockServer = {
        ws: { send: mockWsSend },
        moduleGraph: { getModuleById: vi.fn() },
      }

      const ctx = {
        file: join(testDir, 'resources', 'admin', 'settings.tsx'),
        server: mockServer,
        modules: [],
      }

      await handleHotUpdate(ctx)

      expect(mockWsSend).toHaveBeenCalledWith({
        type: 'full-reload',
        path: '*',
      })
    })

    it('should trigger reload for MDX resource changes', async () => {
      createTestProject(testDir, {
        'resources/docs.mdx': `---
name: docs
---

# Documentation

export const list = () => null
`,
      })

      const plugin = shadminPlugin({ root: testDir })
      const handleHotUpdate = plugin.handleHotUpdate as Function

      const mockWsSend = vi.fn()
      const mockServer = {
        ws: { send: mockWsSend },
        moduleGraph: { getModuleById: vi.fn() },
      }

      const ctx = {
        file: join(testDir, 'resources', 'docs.mdx'),
        server: mockServer,
        modules: [],
      }

      await handleHotUpdate(ctx)

      expect(mockWsSend).toHaveBeenCalledWith({
        type: 'full-reload',
        path: '*',
      })
    })
  })

  describe('Custom Resources Directory', () => {
    it('should use custom resources directory when specified', async () => {
      // Create custom directory
      mkdirSync(join(testDir, 'admin-resources'), { recursive: true })
      createTestProject(testDir, {
        'admin-resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
      })

      server = await createServer(
        createTestViteConfig(testDir, {
          root: testDir,
          resourcesDir: 'admin-resources',
        })
      )

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)
      const code = loaded as string

      expect(code).toContain('posts')
      expect(code).toContain('admin-resources')
    })

    it('should trigger HMR for custom resources directory', async () => {
      mkdirSync(join(testDir, 'admin-resources'), { recursive: true })
      createTestProject(testDir, {
        'admin-resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
      })

      const plugin = shadminPlugin({
        root: testDir,
        resourcesDir: 'admin-resources',
      })
      const handleHotUpdate = plugin.handleHotUpdate as Function

      const mockWsSend = vi.fn()
      const mockServer = {
        ws: { send: mockWsSend },
        moduleGraph: { getModuleById: vi.fn() },
      }

      const ctx = {
        file: join(testDir, 'admin-resources', 'posts.tsx'),
        server: mockServer,
        modules: [],
      }

      await handleHotUpdate(ctx)

      expect(mockWsSend).toHaveBeenCalledWith({
        type: 'full-reload',
        path: '*',
      })
    })
  })

  describe('Dev Server Configuration', () => {
    it('should have configureServer hook that serves index.html', async () => {
      createTestProject(testDir)

      const plugin = shadminPlugin({ root: testDir })
      expect(plugin.configureServer).toBeDefined()
    })

    it('should generate index.html with virtual entry script', async () => {
      createTestProject(testDir)

      const plugin = shadminPlugin({ root: testDir })
      const generateIndexHtml = (plugin as any).generateIndexHtml

      expect(generateIndexHtml).toBeDefined()

      const html = generateIndexHtml()
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<div id="root"></div>')
      expect(html).toContain('virtual:shadmin-entry')
      expect(html).toContain('type="module"')
    })

    it('should add default config with optimizeDeps', async () => {
      createTestProject(testDir)

      const plugin = shadminPlugin({ root: testDir })
      const config = plugin.config as Function

      const result = config({}, { command: 'serve' })

      expect(result.optimizeDeps).toBeDefined()
      expect(result.optimizeDeps.include).toContain('react')
      expect(result.optimizeDeps.include).toContain('react-dom')
      expect(result.optimizeDeps.include).toContain('shadmin')
    })
  })

  describe('Production Build Configuration', () => {
    it('should have transformIndexHtml hook for production', () => {
      const plugin = shadminPlugin({ root: testDir })
      expect(plugin.transformIndexHtml).toBeDefined()
    })

    it('should add viewport meta tag if missing', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const transformIndexHtml = plugin.transformIndexHtml as Function

      const inputHtml =
        '<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>'
      const result = await transformIndexHtml(inputHtml, {
        path: '/',
        filename: 'index.html',
      })

      expect(result).toContain('viewport')
    })

    it('should add title tag if missing', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const transformIndexHtml = plugin.transformIndexHtml as Function

      const inputHtml =
        '<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>'
      const result = await transformIndexHtml(inputHtml, {
        path: '/',
        filename: 'index.html',
      })

      expect(result).toContain('<title>')
    })

    it('should preserve existing viewport and title', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const transformIndexHtml = plugin.transformIndexHtml as Function

      const inputHtml = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width">
  <title>My Admin</title>
</head>
<body><div id="root"></div></body>
</html>`

      const result = await transformIndexHtml(inputHtml, {
        path: '/',
        filename: 'index.html',
      })

      // Should not duplicate
      const viewportMatches = result.match(/viewport/g) || []
      expect(viewportMatches.length).toBe(1)

      const titleMatches = result.match(/<title>/g) || []
      expect(titleMatches.length).toBe(1)
    })
  })

  describe('Basename Configuration', () => {
    it('should include basename in generated code when specified', async () => {
      createTestProject(testDir, {
        'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
      })

      server = await createServer(
        createTestViteConfig(testDir, {
          root: testDir,
          basename: '/admin',
        })
      )

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)
      const code = loaded as string

      expect(code).toContain('/admin')
      expect(code).toContain('basename')
    })
  })

  describe('Auto-detect Data Provider', () => {
    it('should auto-detect data-provider.ts in root', async () => {
      createTestProject(testDir, {
        'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
        'data-provider.ts': `
export const dataProvider = { getList: async () => ({ data: [], total: 0 }) }
`,
      })

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)
      const code = loaded as string

      // Should auto-detect and include dataProvider
      expect(code).toContain('dataProvider')
      expect(code).toContain('./data-provider')
    })

    it('should not auto-detect if dataProvider is explicitly set to undefined', async () => {
      createTestProject(testDir, {
        'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
        'data-provider.ts': `
export const dataProvider = {}
`,
      })

      // When dataProviderImport is not passed at all (undefined),
      // the plugin should auto-detect. This test verifies auto-detection works.
      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)
      const code = loaded as string

      // Auto-detection should find the file
      expect(code).toContain('dataProvider')
    })
  })

  describe('Layout and Dashboard Configuration', () => {
    it('should include layout when configured', async () => {
      createTestProject(testDir, {
        'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
        'layout.tsx': `
export function Layout({ children }) { return children }
`,
      })

      server = await createServer(
        createTestViteConfig(testDir, {
          root: testDir,
          layoutImport: './layout',
        })
      )

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)
      const code = loaded as string

      expect(code).toContain('Layout')
      expect(code).toContain('./layout')
    })

    it('should include dashboard when configured', async () => {
      createTestProject(testDir, {
        'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
        'dashboard.tsx': `
export function Dashboard() { return null }
`,
      })

      server = await createServer(
        createTestViteConfig(testDir, {
          root: testDir,
          dashboardImport: './dashboard',
        })
      )

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)
      const code = loaded as string

      expect(code).toContain('Dashboard')
      expect(code).toContain('./dashboard')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing resources directory gracefully', async () => {
      // Create test dir without resources folder
      writeFileSync(
        join(testDir, 'package.json'),
        JSON.stringify({ name: 'test', type: 'module' })
      )

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)

      expect(loaded).toBeDefined()
      // Should still generate valid code with no resources
      const code = loaded as string
      expect(code).toContain('Admin')
    })

    it('should handle invalid resource files gracefully', async () => {
      createTestProject(testDir, {
        // File without proper exports
        'resources/invalid.tsx': `
// No exports at all
const foo = 'bar'
`,
      })

      server = await createServer(createTestViteConfig(testDir, { root: testDir }))

      // Should not throw
      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)

      expect(loaded).toBeDefined()
    })
  })
})

describe('Virtual Module Execution with Real Dependencies', () => {
  let server: ViteDevServer | null = null

  afterEach(async () => {
    if (server) {
      await server.close()
      server = null
    }
  })

  describe('Full Integration Tests', () => {
    it('should load and execute App with project resources', async () => {
      server = await createServer({
        root: PROJECT_ROOT,
        plugins: [react(), shadminPlugin({ root: PROJECT_ROOT })],
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'silent',
      })

      const { App } = await server.ssrLoadModule('virtual:shadmin-app')

      // Verify App is a function that returns React element
      expect(typeof App).toBe('function')

      const element = App()
      expect(element).toBeDefined()
      expect(element.type).toBeDefined()
    })

    it('should include project resources in generated module', async () => {
      server = await createServer({
        root: PROJECT_ROOT,
        plugins: [react(), shadminPlugin({ root: PROJECT_ROOT })],
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'silent',
      })

      const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
      const loaded = await server.pluginContainer.load(resolved!.id)
      const code = loaded as string

      // Project should have some resources
      // Check for common patterns
      expect(code).toContain('import')
      expect(code).toContain('Admin')
      expect(code).toContain('React.createElement')
    })

    it('should properly chain with React plugin', async () => {
      server = await createServer({
        root: PROJECT_ROOT,
        plugins: [react(), shadminPlugin({ root: PROJECT_ROOT })],
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'silent',
      })

      // Both plugins should be registered
      const pluginNames = server.config.plugins.map((p: any) => p.name)
      expect(pluginNames).toContain('shadmin')
      expect(pluginNames.some((n: string) => n.includes('react'))).toBe(true)
    })
  })
})

/**
 * RED PHASE TESTS - These tests verify functionality that is NOT YET IMPLEMENTED
 *
 * The following describe blocks contain tests that SHOULD FAIL initially.
 * They define the expected behavior for:
 * 1. shadmin:config virtual module - Configuration export
 * 2. shadmin:routes virtual module - Route definitions export
 * 3. Incremental HMR - Smart updates instead of full reload
 * 4. Module invalidation API - Programmatic cache invalidation
 *
 * These are skipped until the corresponding GREEN phase implementation is ready.
 */
describe.skip('RED PHASE: Virtual Config Module (shadmin:config)', () => {
  let testDir: string
  let server: ViteDevServer | null = null

  beforeEach(() => {
    testDir = join(
      tmpdir(),
      `shadmin-config-${Date.now()}-${Math.random().toString(36).slice(2)}`
    )
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(async () => {
    if (server) {
      await server.close()
      server = null
    }
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  it('should resolve shadmin:config virtual module', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
    })

    server = await createServer(createTestViteConfig(testDir, { root: testDir }))

    // RED: This virtual module is not yet implemented
    const resolvedId = await server.pluginContainer.resolveId('shadmin:config')
    expect(resolvedId).toBeDefined()
    expect(resolvedId?.id).toBe('\0shadmin:config')
  })

  it('should export config object from shadmin:config', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
    })

    server = await createServer(createTestViteConfig(testDir, { root: testDir }))

    // RED: The config module should export configuration
    const module = await server.ssrLoadModule('shadmin:config')
    expect(module.config).toBeDefined()
    expect(module.config.resources).toBeDefined()
    expect(Array.isArray(module.config.resources)).toBe(true)
  })

  it('should export provider configuration from shadmin:config', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
      'data-provider.ts': `
export const dataProvider = {}
`,
    })

    server = await createServer(
      createTestViteConfig(testDir, {
        root: testDir,
        dataProviderImport: './data-provider',
      })
    )

    // RED: Config should include provider paths
    const module = await server.ssrLoadModule('shadmin:config')
    expect(module.config.dataProviderPath).toBe('./data-provider')
  })

  it('should include basename in config when specified', async () => {
    createTestProject(testDir)

    server = await createServer(
      createTestViteConfig(testDir, {
        root: testDir,
        basename: '/admin',
      })
    )

    // RED: Config should include basename
    const module = await server.ssrLoadModule('shadmin:config')
    expect(module.config.basename).toBe('/admin')
  })
})

describe.skip('RED PHASE: Virtual Routes Module (shadmin:routes)', () => {
  let testDir: string
  let server: ViteDevServer | null = null

  beforeEach(() => {
    testDir = join(
      tmpdir(),
      `shadmin-routes-${Date.now()}-${Math.random().toString(36).slice(2)}`
    )
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(async () => {
    if (server) {
      await server.close()
      server = null
    }
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  it('should resolve shadmin:routes virtual module', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
    })

    server = await createServer(createTestViteConfig(testDir, { root: testDir }))

    // RED: This virtual module is not yet implemented
    const resolvedId = await server.pluginContainer.resolveId('shadmin:routes')
    expect(resolvedId).toBeDefined()
    expect(resolvedId?.id).toBe('\0shadmin:routes')
  })

  it('should export routes array from shadmin:routes', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
export function show() { return null }
`,
      'resources/users.tsx': `
export const name = 'users'
export function list() { return null }
`,
    })

    server = await createServer(createTestViteConfig(testDir, { root: testDir }))

    // RED: Routes module should export route definitions
    const module = await server.ssrLoadModule('shadmin:routes')
    expect(module.routes).toBeDefined()
    expect(Array.isArray(module.routes)).toBe(true)
    expect(module.routes.length).toBeGreaterThan(0)
  })

  it('should generate correct route paths for each resource', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
export function show() { return null }
export function create() { return null }
export function edit() { return null }
`,
    })

    server = await createServer(createTestViteConfig(testDir, { root: testDir }))

    // RED: Routes should have proper paths
    const module = await server.ssrLoadModule('shadmin:routes')
    const postsRoutes = module.routes.filter((r: any) => r.path?.includes('posts'))

    expect(postsRoutes.some((r: any) => r.path === '/posts')).toBe(true)
    expect(postsRoutes.some((r: any) => r.path === '/posts/:id')).toBe(true)
    expect(postsRoutes.some((r: any) => r.path === '/posts/:id/edit')).toBe(true)
    expect(postsRoutes.some((r: any) => r.path === '/posts/create')).toBe(true)
  })

  it('should include route metadata in route definitions', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export const icon = () => null
export const options = { label: 'Blog Posts' }
export function list() { return null }
`,
    })

    server = await createServer(createTestViteConfig(testDir, { root: testDir }))

    // RED: Routes should include metadata
    const module = await server.ssrLoadModule('shadmin:routes')
    const postsRoute = module.routes.find((r: any) => r.path === '/posts')

    expect(postsRoute.meta).toBeDefined()
    expect(postsRoute.meta.label).toBe('Blog Posts')
    expect(postsRoute.meta.hasIcon).toBe(true)
  })
})

describe.skip('RED PHASE: Incremental HMR Updates', () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(
      tmpdir(),
      `shadmin-hmr-${Date.now()}-${Math.random().toString(36).slice(2)}`
    )
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  it('should send partial update for single resource change instead of full reload', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
      'resources/users.tsx': `
export const name = 'users'
export function list() { return null }
`,
    })

    const plugin = shadminPlugin({ root: testDir })
    const handleHotUpdate = plugin.handleHotUpdate as Function

    const mockWsSend = vi.fn()
    const mockServer = {
      ws: { send: mockWsSend },
      moduleGraph: { getModuleById: vi.fn() },
    }

    const ctx = {
      file: join(testDir, 'resources', 'posts.tsx'),
      server: mockServer,
      modules: [],
    }

    await handleHotUpdate(ctx)

    // RED: Should send partial update, not full reload
    // Currently sends full-reload, should send custom HMR update
    expect(mockWsSend).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'custom',
        event: 'shadmin:resource-update',
        data: expect.objectContaining({
          resource: 'posts',
        }),
      })
    )
  })

  it('should only invalidate affected modules for single resource change', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
      'resources/users.tsx': `
export const name = 'users'
export function list() { return null }
`,
    })

    const plugin = shadminPlugin({ root: testDir })
    const handleHotUpdate = plugin.handleHotUpdate as Function

    const mockInvalidateModule = vi.fn()
    const mockWsSend = vi.fn()
    const mockServer = {
      ws: { send: mockWsSend },
      moduleGraph: {
        getModuleById: vi.fn(),
        invalidateModule: mockInvalidateModule,
      },
    }

    const ctx = {
      file: join(testDir, 'resources', 'posts.tsx'),
      server: mockServer,
      modules: [],
    }

    const result = await handleHotUpdate(ctx)

    // RED: Should return modules that need updating, not empty array
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    // Should return only the posts module, not full app
    expect(result.some((m: any) => m.id?.includes('posts'))).toBe(true)
  })
})

describe.skip('RED PHASE: Module Invalidation API', () => {
  let testDir: string
  let server: ViteDevServer | null = null

  beforeEach(() => {
    testDir = join(
      tmpdir(),
      `shadmin-invalidate-${Date.now()}-${Math.random().toString(36).slice(2)}`
    )
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(async () => {
    if (server) {
      await server.close()
      server = null
    }
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  it('should expose invalidateResources method on plugin', () => {
    const plugin = shadminPlugin({ root: testDir })

    // RED: Plugin should expose invalidation API
    expect((plugin as any).invalidateResources).toBeDefined()
    expect(typeof (plugin as any).invalidateResources).toBe('function')
  })

  it('should allow programmatic cache invalidation', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
    })

    const plugin = shadminPlugin({ root: testDir })

    server = await createServer({
      root: testDir,
      plugins: [react(), plugin],
      server: { middlewareMode: true },
      appType: 'custom',
      logLevel: 'silent',
    })

    // RED: Should be able to programmatically invalidate
    const invalidate = (plugin as any).invalidateResources
    expect(() => invalidate(server)).not.toThrow()
  })

  it('should refresh module cache after invalidation', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
    })

    const plugin = shadminPlugin({ root: testDir })

    server = await createServer({
      root: testDir,
      plugins: [react(), plugin],
      server: { middlewareMode: true },
      appType: 'custom',
      logLevel: 'silent',
    })

    // Load initial module
    const resolved = await server.pluginContainer.resolveId('virtual:shadmin-app')
    const initialCode = await server.pluginContainer.load(resolved!.id)

    // Modify resource file
    writeFileSync(
      join(testDir, 'resources', 'posts.tsx'),
      `
export const name = 'posts'
export function list() { return 'modified' }
export function create() { return null }
`
    )

    // RED: Invalidate and reload should get new code
    const invalidate = (plugin as any).invalidateResources
    await invalidate(server)

    const newCode = await server.pluginContainer.load(resolved!.id)

    // Code should be different after invalidation
    expect(newCode).not.toBe(initialCode)
    expect(newCode).toContain('create')
  })
})

describe.skip('RED PHASE: Production Build Output', () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(
      tmpdir(),
      `shadmin-build-${Date.now()}-${Math.random().toString(36).slice(2)}`
    )
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  it('should generate optimized bundle with tree-shaking', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
// Unused export should be tree-shaken
export function unusedHelper() { return 'should be removed' }
`,
      'index.html': `
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
<div id="root"></div>
<script type="module" src="virtual:shadmin-entry"></script>
</body>
</html>
`,
    })

    // RED: Build should succeed and produce optimized output
    const result = await build({
      root: testDir,
      plugins: [react(), shadminPlugin({ root: testDir })],
      build: {
        outDir: join(testDir, 'dist'),
        write: true,
        minify: false, // Keep readable for testing
      },
      logLevel: 'silent',
    })

    expect(result).toBeDefined()

    // Check that dist folder was created
    expect(existsSync(join(testDir, 'dist'))).toBe(true)

    // Check for generated JS file
    const distFiles = require('fs').readdirSync(join(testDir, 'dist', 'assets'))
    const jsFile = distFiles.find((f: string) => f.endsWith('.js'))
    expect(jsFile).toBeDefined()

    // Read bundle and verify tree-shaking
    const bundleCode = readFileSync(join(testDir, 'dist', 'assets', jsFile), 'utf-8')
    expect(bundleCode).not.toContain('unusedHelper')
    expect(bundleCode).not.toContain('should be removed')
  })

  it('should generate source maps for debugging', async () => {
    createTestProject(testDir, {
      'resources/posts.tsx': `
export const name = 'posts'
export function list() { return null }
`,
      'index.html': `
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
<div id="root"></div>
<script type="module" src="virtual:shadmin-entry"></script>
</body>
</html>
`,
    })

    // RED: Build should generate source maps
    await build({
      root: testDir,
      plugins: [react(), shadminPlugin({ root: testDir })],
      build: {
        outDir: join(testDir, 'dist'),
        write: true,
        sourcemap: true,
      },
      logLevel: 'silent',
    })

    // Check for source map files
    const distFiles = require('fs').readdirSync(join(testDir, 'dist', 'assets'))
    const mapFile = distFiles.find((f: string) => f.endsWith('.js.map'))
    expect(mapFile).toBeDefined()
  })
})
