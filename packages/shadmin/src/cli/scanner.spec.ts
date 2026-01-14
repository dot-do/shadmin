/**
 * @file scanner.spec.ts
 * @description RED phase TDD tests for the shadmin CLI File Scanner
 *
 * The File Scanner is responsible for:
 * 1. Discovering resource files in a directory
 * 2. Parsing resource exports from .tsx/.jsx files
 * 3. Extracting resource metadata (name, components)
 */

import { mkdirSync, writeFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import { scanResources, type ResourceDefinition } from './scanner'

describe('CLI File Scanner', () => {
  let testDir: string

  beforeEach(() => {
    // Create a temporary test directory
    testDir = join(tmpdir(), `shadmin-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    mkdirSync(join(testDir, 'resources'), { recursive: true })
  })

  afterEach(() => {
    // Clean up test directory
    rmSync(testDir, { recursive: true, force: true })
  })

  describe('scanResources', () => {
    it('should return empty array when resources directory is empty', async () => {
      const resources = await scanResources(testDir)
      expect(resources).toEqual([])
    })

    it('should return empty array when resources directory does not exist', async () => {
      const nonExistentDir = join(tmpdir(), 'non-existent-dir')
      const resources = await scanResources(nonExistentDir)
      expect(resources).toEqual([])
    })

    it('should discover a single resource file', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const list = () => <div>Posts List</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources).toHaveLength(1)
      expect(resources[0]).toMatchObject({
        name: 'posts',
        filePath: expect.stringContaining('posts.tsx'),
      })
    })

    it('should discover multiple resource files', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'`
      )
      writeFileSync(
        join(testDir, 'resources', 'users.tsx'),
        `export const name = 'users'`
      )
      writeFileSync(
        join(testDir, 'resources', 'comments.tsx'),
        `export const name = 'comments'`
      )

      const resources = await scanResources(testDir)

      expect(resources).toHaveLength(3)
      const names = resources.map((r) => r.name).sort()
      expect(names).toEqual(['comments', 'posts', 'users'])
    })

    it('should detect list component export', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const list = () => <div>List</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasComponent.list).toBe(true)
    })

    it('should detect edit component export', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const edit = () => <div>Edit</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasComponent.edit).toBe(true)
    })

    it('should detect show component export', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const show = () => <div>Show</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasComponent.show).toBe(true)
    })

    it('should detect create component export', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const create = () => <div>Create</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasComponent.create).toBe(true)
    })

    it('should detect all CRUD components', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const list = () => <div>List</div>
export const edit = () => <div>Edit</div>
export const show = () => <div>Show</div>
export const create = () => <div>Create</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasComponent).toEqual({
        list: true,
        edit: true,
        show: true,
        create: true,
        icon: false,
      })
    })

    it('should handle resources without explicit name export', async () => {
      // Should infer name from filename
      writeFileSync(
        join(testDir, 'resources', 'products.tsx'),
        `
export const list = () => <div>Products</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.name).toBe('products')
    })

    it('should prefer explicit name export over filename', async () => {
      writeFileSync(
        join(testDir, 'resources', 'items.tsx'),
        `
export const name = 'products'
export const list = () => <div>Products</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.name).toBe('products')
    })

    it('should support .jsx files', async () => {
      writeFileSync(
        join(testDir, 'resources', 'categories.jsx'),
        `
export const name = 'categories'
export const list = () => <div>Categories</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources).toHaveLength(1)
      expect(resources[0]!.name).toBe('categories')
    })

    it('should ignore non-resource files', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'`
      )
      writeFileSync(
        join(testDir, 'resources', 'utils.ts'),
        `export const helper = () => {}`
      )
      writeFileSync(
        join(testDir, 'resources', 'readme.md'),
        `# Documentation`
      )

      const resources = await scanResources(testDir)

      expect(resources).toHaveLength(1)
      expect(resources[0]!.name).toBe('posts')
    })

    it('should detect icon export', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const icon = () => <span>📝</span>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasComponent.icon).toBe(true)
    })

    it('should detect recordRepresentation export', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const recordRepresentation = (record) => record.title
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasExport.recordRepresentation).toBe(true)
    })

    it('should detect options export', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const options = { label: 'Blog Posts' }
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasExport.options).toBe(true)
    })

    it('should handle nested resources directory structure', async () => {
      mkdirSync(join(testDir, 'resources', 'admin'), { recursive: true })
      writeFileSync(
        join(testDir, 'resources', 'admin', 'users.tsx'),
        `export const name = 'admin/users'`
      )

      const resources = await scanResources(testDir)

      expect(resources).toHaveLength(1)
      expect(resources[0]!.name).toBe('admin/users')
    })

    it('should include relative import path for each resource', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.importPath).toBe('./resources/posts')
    })
  })

  describe('resource validation', () => {
    it('should flag resources without any CRUD components', async () => {
      writeFileSync(
        join(testDir, 'resources', 'empty.tsx'),
        `
export const name = 'empty'
// No components defined
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.warnings).toContain(
        'Resource "empty" has no CRUD components defined'
      )
    })

    it('should not include warning for valid resources', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const list = () => <div>List</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.warnings).toHaveLength(0)
    })
  })

  describe('file watching support', () => {
    it('should return metadata needed for HMR', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'`
      )

      const resources = await scanResources(testDir)

      // File path needed for HMR module tracking
      expect(resources[0]!.filePath).toBeDefined()
      expect(typeof resources[0]!.filePath).toBe('string')
    })
  })
})

describe('ResourceDefinition type', () => {
  it('should have correct shape', () => {
    const resource: ResourceDefinition = {
      name: 'posts',
      filePath: '/path/to/posts.tsx',
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
    }

    expect(resource.name).toBe('posts')
    expect(resource.hasComponent.list).toBe(true)
  })
})

describe('MDX Resource Scanning', () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(tmpdir(), `shadmin-mdx-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    mkdirSync(join(testDir, 'resources'), { recursive: true })
  })

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true })
  })

  describe('MDX file discovery', () => {
    it('should discover .mdx resource files', async () => {
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

# Documentation

export const list = () => <div>Docs List</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources).toHaveLength(1)
      expect(resources[0]).toMatchObject({
        name: 'docs',
        filePath: expect.stringContaining('docs.mdx'),
      })
    })

    it('should discover MDX files alongside TSX files', async () => {
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

      const resources = await scanResources(testDir)

      expect(resources).toHaveLength(2)
      const names = resources.map((r) => r.name).sort()
      expect(names).toEqual(['docs', 'posts'])
    })

    it('should include .mdx in default extensions', async () => {
      writeFileSync(
        join(testDir, 'resources', 'help.mdx'),
        `---
name: help
---

export const list = () => <div>Help</div>
`
      )

      // Should work without explicitly passing extensions
      const resources = await scanResources(testDir)

      expect(resources).toHaveLength(1)
      expect(resources[0]!.name).toBe('help')
    })
  })

  describe('MDX frontmatter parsing', () => {
    it('should extract resource name from YAML frontmatter', async () => {
      writeFileSync(
        join(testDir, 'resources', 'guide.mdx'),
        `---
name: user-guide
---

# User Guide
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.name).toBe('user-guide')
    })

    it('should fall back to filename when no name in frontmatter', async () => {
      writeFileSync(
        join(testDir, 'resources', 'tutorial.mdx'),
        `---
title: Tutorial
---

# Tutorial
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.name).toBe('tutorial')
    })

    it('should handle MDX files without frontmatter', async () => {
      writeFileSync(
        join(testDir, 'resources', 'readme.mdx'),
        `# README

This is a readme file.

export const list = () => <div>README</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.name).toBe('readme')
    })
  })

  describe('MDX export detection', () => {
    it('should detect list component export in MDX', async () => {
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

export const list = () => <div>Docs List</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasComponent.list).toBe(true)
    })

    it('should detect all CRUD component exports in MDX', async () => {
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

export const list = () => <div>List</div>
export const edit = () => <div>Edit</div>
export const show = () => <div>Show</div>
export const create = () => <div>Create</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasComponent).toEqual({
        list: true,
        edit: true,
        show: true,
        create: true,
        icon: false,
      })
    })

    it('should detect icon export in MDX', async () => {
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

export const icon = () => <span>📚</span>
export const list = () => <div>List</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasComponent.icon).toBe(true)
    })

    it('should detect recordRepresentation export in MDX', async () => {
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

export const recordRepresentation = (record) => record.title
export const list = () => <div>List</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasExport.recordRepresentation).toBe(true)
    })

    it('should detect options export in MDX', async () => {
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

export const options = { label: 'Documentation' }
export const list = () => <div>List</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.hasExport.options).toBe(true)
    })
  })

  describe('MDX import path generation', () => {
    it('should generate correct import path for MDX files', async () => {
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

export const list = () => <div>List</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.importPath).toBe('./resources/docs')
    })

    it('should handle nested MDX files', async () => {
      mkdirSync(join(testDir, 'resources', 'admin'), { recursive: true })
      writeFileSync(
        join(testDir, 'resources', 'admin', 'help.mdx'),
        `---
name: admin/help
---

export const list = () => <div>Admin Help</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.name).toBe('admin/help')
      expect(resources[0]!.importPath).toBe('./resources/admin/help')
    })
  })

  describe('MDX file type detection', () => {
    it('should mark MDX files with isMdx flag', async () => {
      writeFileSync(
        join(testDir, 'resources', 'docs.mdx'),
        `---
name: docs
---

export const list = () => <div>List</div>
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.isMdx).toBe(true)
    })

    it('should mark TSX files without isMdx flag', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.isMdx).toBe(false)
    })
  })

  describe('MDX validation', () => {
    it('should flag MDX resources without CRUD components', async () => {
      writeFileSync(
        join(testDir, 'resources', 'empty.mdx'),
        `---
name: empty
---

# Just markdown content
`
      )

      const resources = await scanResources(testDir)

      expect(resources[0]!.warnings).toContain(
        'Resource "empty" has no CRUD components defined'
      )
    })
  })
})
