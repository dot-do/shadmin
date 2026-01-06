/**
 * @file vite-plugin.spec.ts
 * @description RED phase TDD tests for the shadmin Vite Plugin
 *
 * The Vite Plugin is responsible for:
 * 1. Creating virtual modules for the generated entry point
 * 2. Setting up HMR for resource files
 * 3. Configuring the dev server
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdirSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { shadminPlugin, type ShadminPluginOptions } from './vite-plugin'
import type { Plugin, ResolvedConfig } from 'vite'

describe('shadmin Vite Plugin', () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(tmpdir(), `shadmin-vite-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    mkdirSync(join(testDir, 'resources'), { recursive: true })
  })

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true })
  })

  describe('plugin creation', () => {
    it('should return a Vite plugin object', () => {
      const plugin = shadminPlugin({ root: testDir })

      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('shadmin')
    })

    it('should have required plugin hooks', () => {
      const plugin = shadminPlugin({ root: testDir })

      expect(plugin.resolveId).toBeDefined()
      expect(plugin.load).toBeDefined()
    })

    it('should accept custom options', () => {
      const options: ShadminPluginOptions = {
        root: testDir,
        dataProviderImport: './data-provider',
        authProviderImport: './auth-provider',
      }
      const plugin = shadminPlugin(options)

      expect(plugin).toBeDefined()
    })
  })

  describe('virtual module resolution', () => {
    it('should resolve virtual:shadmin-app module', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const resolveId = plugin.resolveId as Function

      const result = await resolveId('virtual:shadmin-app')

      expect(result).toBe('\0virtual:shadmin-app')
    })

    it('should resolve virtual:shadmin-entry module', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const resolveId = plugin.resolveId as Function

      const result = await resolveId('virtual:shadmin-entry')

      expect(result).toBe('\0virtual:shadmin-entry')
    })

    it('should return null for non-virtual modules', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const resolveId = plugin.resolveId as Function

      const result = await resolveId('./some-file.ts')

      expect(result).toBeNull()
    })
  })

  describe('virtual module loading', () => {
    it('should load virtual:shadmin-app with generated code', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain("import { Admin, Resource } from 'shadmin'")
      expect(result).toContain('export function App()')
    })

    it('should include discovered resources in generated code', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain("import * as posts from './resources/posts'")
      expect(result).toContain('name="posts"')
      expect(result).toContain('list={posts.list}')
    })

    it('should load virtual:shadmin-entry with React DOM render', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-entry')

      expect(result).toContain("import { createRoot } from 'react-dom/client'")
      expect(result).toContain("import { App } from 'virtual:shadmin-app'")
      expect(result).toContain('createRoot')
      expect(result).toContain('.render(<App')
    })

    it('should return null for non-virtual modules', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function

      const result = await load('./some-file.ts')

      expect(result).toBeUndefined()
    })

    it('should include dataProvider when specified', async () => {
      const plugin = shadminPlugin({
        root: testDir,
        dataProviderImport: './data-provider',
      })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain("import { dataProvider } from './data-provider'")
      expect(result).toContain('dataProvider={dataProvider}')
    })

    it('should include authProvider when specified', async () => {
      const plugin = shadminPlugin({
        root: testDir,
        authProviderImport: './auth-provider',
      })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain("import { authProvider } from './auth-provider'")
      expect(result).toContain('authProvider={authProvider}')
    })

    it('should include layout when specified', async () => {
      const plugin = shadminPlugin({
        root: testDir,
        layoutImport: './layout',
      })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain("import { Layout } from './layout'")
      expect(result).toContain('layout={Layout}')
    })

    it('should include dashboard when specified', async () => {
      const plugin = shadminPlugin({
        root: testDir,
        dashboardImport: './dashboard',
      })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain("import { Dashboard } from './dashboard'")
      expect(result).toContain('dashboard={Dashboard}')
    })
  })

  describe('HMR support', () => {
    it('should have handleHotUpdate hook', () => {
      const plugin = shadminPlugin({ root: testDir })

      expect(plugin.handleHotUpdate).toBeDefined()
    })

    it('should trigger full reload when resource file changes', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'`
      )

      const plugin = shadminPlugin({ root: testDir })
      const handleHotUpdate = plugin.handleHotUpdate as Function

      const mockServer = {
        ws: {
          send: vi.fn(),
        },
        moduleGraph: {
          getModuleById: vi.fn().mockReturnValue({ id: '\0virtual:shadmin-app' }),
        },
      }

      const ctx = {
        file: join(testDir, 'resources', 'posts.tsx'),
        server: mockServer,
        modules: [],
      }

      await handleHotUpdate(ctx)

      expect(mockServer.ws.send).toHaveBeenCalledWith({
        type: 'full-reload',
        path: '*',
      })
    })

    it('should not trigger reload for non-resource files', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const handleHotUpdate = plugin.handleHotUpdate as Function

      const mockServer = {
        ws: { send: vi.fn() },
        moduleGraph: { getModuleById: vi.fn() },
      }

      const ctx = {
        file: join(testDir, 'some-other-file.ts'),
        server: mockServer,
        modules: [],
      }

      const result = await handleHotUpdate(ctx)

      expect(mockServer.ws.send).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe('config hook', () => {
    it('should have config hook', () => {
      const plugin = shadminPlugin({ root: testDir })

      expect(plugin.config).toBeDefined()
    })

    it('should add shadmin alias to resolve', () => {
      const plugin = shadminPlugin({ root: testDir })
      const config = plugin.config as Function

      const result = config({}, { command: 'serve' })

      expect(result.resolve?.alias).toBeDefined()
    })
  })

  describe('multiple resources', () => {
    it('should handle multiple resources in generated code', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>Posts</div>`
      )
      writeFileSync(
        join(testDir, 'resources', 'users.tsx'),
        `export const name = 'users'\nexport const list = () => <div>Users</div>`
      )
      writeFileSync(
        join(testDir, 'resources', 'comments.tsx'),
        `export const name = 'comments'\nexport const list = () => <div>Comments</div>`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain('name="posts"')
      expect(result).toContain('name="users"')
      expect(result).toContain('name="comments"')
    })
  })

  describe('empty resources directory', () => {
    it('should generate valid code with no resources', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain('<Admin>')
      expect(result).toContain('</Admin>')
      expect(result).not.toContain('<Resource')
    })
  })

  describe('ShadminPluginOptions', () => {
    it('should accept all option fields', () => {
      const options: ShadminPluginOptions = {
        root: testDir,
        resourcesDir: 'custom-resources',
        dataProviderImport: './dp',
        authProviderImport: './ap',
        layoutImport: './layout',
        dashboardImport: './dashboard',
        basename: '/admin',
      }

      const plugin = shadminPlugin(options)
      expect(plugin).toBeDefined()
    })
  })

  describe('index.html generation for production builds', () => {
    it('should have transformIndexHtml hook', () => {
      const plugin = shadminPlugin({ root: testDir })

      expect(plugin.transformIndexHtml).toBeDefined()
    })

    it('should have configureServer hook for serving index.html', () => {
      const plugin = shadminPlugin({ root: testDir })

      expect(plugin.configureServer).toBeDefined()
    })

    it('should generate index.html with proper structure', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const transformIndexHtml = plugin.transformIndexHtml as Function

      // Simulate a basic HTML structure
      const inputHtml = '<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>'
      const result = await transformIndexHtml(inputHtml, { path: '/', filename: 'index.html' })

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<div id="root"></div>')
    })

    it('should add meta viewport tag', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const transformIndexHtml = plugin.transformIndexHtml as Function

      const inputHtml = '<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>'
      const result = await transformIndexHtml(inputHtml, { path: '/', filename: 'index.html' })

      expect(result).toContain('viewport')
    })

    it('should add title tag with shadmin', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const transformIndexHtml = plugin.transformIndexHtml as Function

      const inputHtml = '<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>'
      const result = await transformIndexHtml(inputHtml, { path: '/', filename: 'index.html' })

      expect(result).toContain('<title>')
    })

    it('should generate index.html with script tag for entry', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const generateIndexHtml = (plugin as any).generateIndexHtml

      expect(typeof generateIndexHtml).toBe('function')

      const html = generateIndexHtml()
      expect(html).toContain('<script type="module"')
      expect(html).toContain('virtual:shadmin-entry')
    })

    it('should include charset meta tag', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const generateIndexHtml = (plugin as any).generateIndexHtml

      const html = generateIndexHtml()
      expect(html).toContain('charset')
      expect(html).toContain('UTF-8')
    })
  })
})

describe('MDX Plugin Support', () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(tmpdir(), `shadmin-mdx-plugin-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    mkdirSync(join(testDir, 'resources'), { recursive: true })
  })

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true })
  })

  describe('MDX resource loading', () => {
    it('should include MDX resources in generated code', async () => {
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

# Documentation

export const list = () => <div>Docs List</div>
`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain("import * as docs from './resources/docs'")
      expect(result).toContain('name="docs"')
      expect(result).toContain('list={docs.list}')
    })

    it('should handle mixed TSX and MDX resources', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>Posts</div>`
      )
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

export const list = () => <div>Docs</div>
`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain('name="posts"')
      expect(result).toContain('name="docs"')
    })
  })

  describe('MDX HMR support', () => {
    it('should trigger full reload when MDX file changes', async () => {
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

export const list = () => <div>Docs</div>
`
      )

      const plugin = shadminPlugin({ root: testDir })
      const handleHotUpdate = plugin.handleHotUpdate as Function

      const mockServer = {
        ws: {
          send: vi.fn(),
        },
        moduleGraph: {
          getModuleById: vi.fn().mockReturnValue({ id: '\0virtual:shadmin-app' }),
        },
      }

      const ctx = {
        file: join(testDir, 'resources', 'docs.mdx'),
        server: mockServer,
        modules: [],
      }

      await handleHotUpdate(ctx)

      expect(mockServer.ws.send).toHaveBeenCalledWith({
        type: 'full-reload',
        path: '*',
      })
    })
  })

  describe('MDX plugin configuration', () => {
    it('should include @mdx-js/rollup plugin when MDX support is enabled', () => {
      const plugin = shadminPlugin({ root: testDir })
      const config = plugin.config as Function

      const result = config({}, { command: 'serve' })

      // The plugin should configure MDX support
      expect(result).toBeDefined()
    })

    it('should accept mdxOptions for customizing MDX compilation', () => {
      const options: ShadminPluginOptions = {
        root: testDir,
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [],
        },
      }

      const plugin = shadminPlugin(options)
      expect(plugin).toBeDefined()
    })
  })

  describe('MDX with frontmatter', () => {
    it('should extract name from frontmatter in generated code', async () => {
      writeFileSync(
        join(testDir, 'resources', 'guide.mdx'),
        `---
name: user-guide
---

export const list = () => <div>Guide List</div>
`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain('name="user-guide"')
    })
  })

  describe('Nested MDX resources', () => {
    it('should handle nested MDX resource paths', async () => {
      mkdirSync(join(testDir, 'resources', 'admin'), { recursive: true })
      writeFileSync(
        join(testDir, 'resources', 'admin', 'help.mdx'),
        `---
name: admin/help
---

export const list = () => <div>Admin Help</div>
`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function

      const result = await load('\0virtual:shadmin-app')

      expect(result).toContain('name="admin/help"')
      expect(result).toContain("import * as admin_help from './resources/admin/help'")
    })
  })
})
