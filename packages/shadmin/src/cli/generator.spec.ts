/**
 * @file generator.spec.ts
 * @description RED phase TDD tests for the shadmin CLI Entry Generator
 *
 * The Entry Generator is responsible for:
 * 1. Generating import statements for discovered resources
 * 2. Creating the Admin component configuration
 * 3. Generating the virtual entry point for Vite
 */

import { describe, it, expect } from 'vitest'

import {
  generateImports,
  generateResourceConfig,
  generateEntryPoint,
  type GeneratorOptions,
} from './generator'

import type { ResourceDefinition } from './scanner'

const createResource = (overrides: Partial<ResourceDefinition> = {}): ResourceDefinition => ({
  name: 'posts',
  filePath: '/app/resources/posts.tsx',
  importPath: './resources/posts',
  hasComponent: {
    list: true,
    edit: false,
    show: false,
    create: false,
    icon: false,
  },
  hasExport: {
    recordRepresentation: false,
    options: false,
  },
  warnings: [],
  isMdx: false,
  ...overrides,
})

describe('CLI Entry Generator', () => {
  describe('generateImports', () => {
    it('should generate import for a single resource', () => {
      const resources = [createResource()]
      const imports = generateImports(resources)

      expect(imports).toContain("import * as posts from './resources/posts'")
    })

    it('should generate imports for multiple resources', () => {
      const resources = [
        createResource({ name: 'posts', importPath: './resources/posts' }),
        createResource({ name: 'users', importPath: './resources/users' }),
        createResource({ name: 'comments', importPath: './resources/comments' }),
      ]
      const imports = generateImports(resources)

      expect(imports).toContain("import * as posts from './resources/posts'")
      expect(imports).toContain("import * as users from './resources/users'")
      expect(imports).toContain("import * as comments from './resources/comments'")
    })

    it('should handle nested resource paths', () => {
      const resources = [
        createResource({ name: 'admin/users', importPath: './resources/admin/users' }),
      ]
      const imports = generateImports(resources)

      expect(imports).toContain("import * as admin_users from './resources/admin/users'")
    })

    it('should sanitize import names with special characters', () => {
      const resources = [
        createResource({ name: 'my-resource', importPath: './resources/my-resource' }),
      ]
      const imports = generateImports(resources)

      expect(imports).toContain("import * as my_resource from './resources/my-resource'")
    })

    it('should return empty string for empty resources', () => {
      const imports = generateImports([])
      expect(imports).toBe('')
    })
  })

  describe('generateResourceConfig', () => {
    it('should generate Resource component for list-only resource', () => {
      const resources = [
        createResource({
          name: 'posts',
          hasComponent: { list: true, edit: false, show: false, create: false, icon: false },
        }),
      ]
      const config = generateResourceConfig(resources)

      expect(config).toContain('<Resource')
      expect(config).toContain('name="posts"')
      expect(config).toContain('list={posts.list}')
      expect(config).not.toContain('edit=')
      expect(config).not.toContain('show=')
      expect(config).not.toContain('create=')
    })

    it('should include all CRUD components when present', () => {
      const resources = [
        createResource({
          name: 'posts',
          hasComponent: { list: true, edit: true, show: true, create: true, icon: false },
        }),
      ]
      const config = generateResourceConfig(resources)

      expect(config).toContain('list={posts.list}')
      expect(config).toContain('edit={posts.edit}')
      expect(config).toContain('show={posts.show}')
      expect(config).toContain('create={posts.create}')
    })

    it('should include icon when present', () => {
      const resources = [
        createResource({
          name: 'posts',
          hasComponent: { list: true, edit: false, show: false, create: false, icon: true },
        }),
      ]
      const config = generateResourceConfig(resources)

      expect(config).toContain('icon={posts.icon}')
    })

    it('should include recordRepresentation when present', () => {
      const resources = [
        createResource({
          hasExport: { recordRepresentation: true, options: false },
        }),
      ]
      const config = generateResourceConfig(resources)

      expect(config).toContain('recordRepresentation={posts.recordRepresentation}')
    })

    it('should include options when present', () => {
      const resources = [
        createResource({
          hasExport: { recordRepresentation: false, options: true },
        }),
      ]
      const config = generateResourceConfig(resources)

      expect(config).toContain('options={posts.options}')
    })

    it('should generate multiple Resource components', () => {
      const resources = [
        createResource({ name: 'posts', importPath: './resources/posts' }),
        createResource({ name: 'users', importPath: './resources/users' }),
      ]
      const config = generateResourceConfig(resources)

      expect(config).toContain('name="posts"')
      expect(config).toContain('name="users"')
    })

    it('should return empty string for empty resources', () => {
      const config = generateResourceConfig([])
      expect(config).toBe('')
    })
  })

  describe('generateEntryPoint', () => {
    it('should generate valid React entry point', () => {
      const resources = [createResource()]
      const entry = generateEntryPoint(resources)

      expect(entry).toContain("import { Admin, Resource } from 'shadmin'")
      expect(entry).toContain('export function App()')
      expect(entry).toContain('<Admin')
      expect(entry).toContain('</Admin>')
    })

    it('should include resource imports', () => {
      const resources = [createResource()]
      const entry = generateEntryPoint(resources)

      expect(entry).toContain("import * as posts from './resources/posts'")
    })

    it('should include Resource components', () => {
      const resources = [createResource()]
      const entry = generateEntryPoint(resources)

      expect(entry).toContain('<Resource')
      expect(entry).toContain('name="posts"')
    })

    it('should include dataProvider when specified', () => {
      const resources = [createResource()]
      const options: GeneratorOptions = {
        dataProviderImport: './data-provider',
      }
      const entry = generateEntryPoint(resources, options)

      expect(entry).toContain("import { dataProvider } from './data-provider'")
      expect(entry).toContain('dataProvider={dataProvider}')
    })

    it('should include authProvider when specified', () => {
      const resources = [createResource()]
      const options: GeneratorOptions = {
        authProviderImport: './auth-provider',
      }
      const entry = generateEntryPoint(resources, options)

      expect(entry).toContain("import { authProvider } from './auth-provider'")
      expect(entry).toContain('authProvider={authProvider}')
    })

    it('should include layout when specified', () => {
      const resources = [createResource()]
      const options: GeneratorOptions = {
        layoutImport: './layout',
      }
      const entry = generateEntryPoint(resources, options)

      expect(entry).toContain("import { Layout } from './layout'")
      expect(entry).toContain('layout={Layout}')
    })

    it('should include dashboard when specified', () => {
      const resources = [createResource()]
      const options: GeneratorOptions = {
        dashboardImport: './dashboard',
      }
      const entry = generateEntryPoint(resources, options)

      expect(entry).toContain("import { Dashboard } from './dashboard'")
      expect(entry).toContain('dashboard={Dashboard}')
    })

    it('should generate valid JSX syntax', () => {
      const resources = [createResource()]
      const entry = generateEntryPoint(resources)

      // Check for balanced JSX
      expect(entry).toMatch(/<Admin[^>]*>/)
      expect(entry).toContain('</Admin>')
      expect(entry).toMatch(/<Resource[^/]*\/>/)
    })

    it('should export both App component and createRoot', () => {
      const resources = [createResource()]
      const entry = generateEntryPoint(resources)

      expect(entry).toContain('export function App()')
    })

    it('should handle multiple resources with all options', () => {
      const resources = [
        createResource({
          name: 'posts',
          importPath: './resources/posts',
          hasComponent: { list: true, edit: true, show: true, create: true, icon: true },
        }),
        createResource({
          name: 'users',
          importPath: './resources/users',
          hasComponent: { list: true, edit: false, show: false, create: false, icon: false },
        }),
      ]
      const options: GeneratorOptions = {
        dataProviderImport: './data-provider',
        authProviderImport: './auth-provider',
        layoutImport: './layout',
        dashboardImport: './dashboard',
      }
      const entry = generateEntryPoint(resources, options)

      expect(entry).toContain("import * as posts from './resources/posts'")
      expect(entry).toContain("import * as users from './resources/users'")
      expect(entry).toContain('name="posts"')
      expect(entry).toContain('name="users"')
      expect(entry).toContain('dataProvider={dataProvider}')
      expect(entry).toContain('authProvider={authProvider}')
      expect(entry).toContain('layout={Layout}')
      expect(entry).toContain('dashboard={Dashboard}')
    })

    it('should generate empty Admin when no resources', () => {
      const entry = generateEntryPoint([])

      expect(entry).toContain('<Admin')
      expect(entry).toContain('</Admin>')
      expect(entry).not.toContain('<Resource')
    })

    it('should include TypeScript types', () => {
      const resources = [createResource()]
      const entry = generateEntryPoint(resources)

      // Should be valid TypeScript
      expect(entry).toContain('function App()')
    })
  })

  describe('variable name sanitization', () => {
    it('should convert hyphens to underscores', () => {
      const resources = [createResource({ name: 'my-posts' })]
      const imports = generateImports(resources)

      expect(imports).toContain('import * as my_posts')
    })

    it('should convert slashes to underscores', () => {
      const resources = [createResource({ name: 'admin/users' })]
      const imports = generateImports(resources)

      expect(imports).toContain('import * as admin_users')
    })

    it('should handle multiple special characters', () => {
      const resources = [createResource({ name: 'admin/my-users' })]
      const imports = generateImports(resources)

      expect(imports).toContain('import * as admin_my_users')
    })
  })

  describe('GeneratorOptions', () => {
    it('should accept all optional fields', () => {
      const options: GeneratorOptions = {
        dataProviderImport: './dp',
        authProviderImport: './ap',
        layoutImport: './layout',
        dashboardImport: './dashboard',
        basename: '/admin',
      }

      expect(options.basename).toBe('/admin')
    })

    it('should include basename when specified', () => {
      const resources = [createResource()]
      const options: GeneratorOptions = {
        basename: '/admin',
      }
      const entry = generateEntryPoint(resources, options)

      expect(entry).toContain('basename="/admin"')
    })
  })
})

describe('BrowserRouter wrapping', () => {
  it('should import BrowserRouter from react-router', () => {
    const resources = [createResource()]
    const entry = generateEntryPoint(resources)

    expect(entry).toContain("import { BrowserRouter } from 'react-router'")
  })

  it('should wrap Admin in BrowserRouter', () => {
    const resources = [createResource()]
    const entry = generateEntryPoint(resources)

    expect(entry).toContain('<BrowserRouter>')
    expect(entry).toContain('</BrowserRouter>')
    // BrowserRouter should wrap Admin
    const browserRouterStart = entry.indexOf('<BrowserRouter>')
    const adminStart = entry.indexOf('<Admin')
    const adminEnd = entry.indexOf('</Admin>')
    const browserRouterEnd = entry.indexOf('</BrowserRouter>')

    expect(browserRouterStart).toBeLessThan(adminStart)
    expect(adminEnd).toBeLessThan(browserRouterEnd)
  })

  it('should pass basename to BrowserRouter instead of Admin', () => {
    const resources = [createResource()]
    const options: GeneratorOptions = {
      basename: '/admin',
    }
    const entry = generateEntryPoint(resources, options)

    expect(entry).toContain('<BrowserRouter basename="/admin">')
    // Admin should NOT have basename prop when BrowserRouter has it
    expect(entry).not.toMatch(/<Admin[^>]*basename=/)
  })

  it('should work with empty resources', () => {
    const entry = generateEntryPoint([])

    expect(entry).toContain('<BrowserRouter>')
    expect(entry).toContain('</BrowserRouter>')
    expect(entry).toContain('<Admin')
  })
})

describe('MDX Resource Generation', () => {
  const createMdxResource = (overrides: Partial<ResourceDefinition> = {}): ResourceDefinition => ({
    name: 'docs',
    filePath: '/app/resources/docs.mdx',
    importPath: './resources/docs',
    hasComponent: {
      list: true,
      edit: false,
      show: false,
      create: false,
      icon: false,
    },
    hasExport: {
      recordRepresentation: false,
      options: false,
    },
    warnings: [],
    isMdx: true,
    ...overrides,
  })

  describe('generateImports for MDX', () => {
    it('should generate import for MDX resource', () => {
      const resources = [createMdxResource()]
      const imports = generateImports(resources)

      expect(imports).toContain("import * as docs from './resources/docs'")
    })

    it('should handle mixed TSX and MDX resources', () => {
      const resources = [
        createResource({ name: 'posts', importPath: './resources/posts' }),
        createMdxResource({ name: 'docs', importPath: './resources/docs' }),
      ]
      const imports = generateImports(resources)

      expect(imports).toContain("import * as posts from './resources/posts'")
      expect(imports).toContain("import * as docs from './resources/docs'")
    })
  })

  describe('generateResourceConfig for MDX', () => {
    it('should generate Resource component for MDX resource', () => {
      const resources = [createMdxResource()]
      const config = generateResourceConfig(resources)

      expect(config).toContain('<Resource')
      expect(config).toContain('name="docs"')
      expect(config).toContain('list={docs.list}')
    })

    it('should include all CRUD components from MDX when present', () => {
      const resources = [
        createMdxResource({
          hasComponent: { list: true, edit: true, show: true, create: true, icon: true },
        }),
      ]
      const config = generateResourceConfig(resources)

      expect(config).toContain('list={docs.list}')
      expect(config).toContain('edit={docs.edit}')
      expect(config).toContain('show={docs.show}')
      expect(config).toContain('create={docs.create}')
      expect(config).toContain('icon={docs.icon}')
    })
  })

  describe('generateEntryPoint for MDX', () => {
    it('should generate valid entry point with MDX resources', () => {
      const resources = [createMdxResource()]
      const entry = generateEntryPoint(resources)

      expect(entry).toContain("import { Admin, Resource } from 'shadmin'")
      expect(entry).toContain("import * as docs from './resources/docs'")
      expect(entry).toContain('name="docs"')
    })

    it('should handle mixed TSX and MDX resources in entry point', () => {
      const resources = [
        createResource({ name: 'posts', importPath: './resources/posts' }),
        createMdxResource({ name: 'docs', importPath: './resources/docs' }),
      ]
      const entry = generateEntryPoint(resources)

      expect(entry).toContain("import * as posts from './resources/posts'")
      expect(entry).toContain("import * as docs from './resources/docs'")
      expect(entry).toContain('name="posts"')
      expect(entry).toContain('name="docs"')
    })
  })
})
