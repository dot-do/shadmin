/**
 * @file interactive.spec.ts
 * @description Tests for the interactive CLI menu using React Ink
 */

import { describe, it, expect } from 'vitest'

import {
  EXAMPLE_TEMPLATES,
  getTemplateFiles,
  isValidTemplateId,
  shouldShowInteractiveMenu,
  type ExampleTemplate,
  type TemplateId,
} from './interactive'

describe('Interactive CLI Menu', () => {
  describe('EXAMPLE_TEMPLATES', () => {
    it('should have at least 3 example templates', () => {
      expect(EXAMPLE_TEMPLATES.length).toBeGreaterThanOrEqual(3)
    })

    it('should have required properties for each template', () => {
      for (const template of EXAMPLE_TEMPLATES) {
        expect(template.id).toBeDefined()
        expect(template.name).toBeDefined()
        expect(template.description).toBeDefined()
        expect(typeof template.id).toBe('string')
        expect(typeof template.name).toBe('string')
        expect(typeof template.description).toBe('string')
      }
    })

    it('should include a basic template', () => {
      const basic = EXAMPLE_TEMPLATES.find((t) => t.id === 'basic')
      expect(basic).toBeDefined()
    })

    it('should include a blog example', () => {
      const blog = EXAMPLE_TEMPLATES.find((t) => t.id === 'blog')
      expect(blog).toBeDefined()
    })

    it('should include an e-commerce example', () => {
      const ecommerce = EXAMPLE_TEMPLATES.find((t) => t.id === 'ecommerce')
      expect(ecommerce).toBeDefined()
    })
  })

  describe('getTemplateFiles', () => {
    it('should return files for basic template', () => {
      const files = getTemplateFiles('basic')

      expect(files).toBeDefined()
      expect(Object.keys(files).length).toBeGreaterThan(0)
    })

    it('should include resources directory structure', () => {
      const files = getTemplateFiles('basic')

      const hasResourceFiles = Object.keys(files).some((path) =>
        path.includes('resources/')
      )
      expect(hasResourceFiles).toBe(true)
    })

    it('should return files for blog template', () => {
      const files = getTemplateFiles('blog')

      expect(files).toBeDefined()
      expect(Object.keys(files).some((p) => p.includes('posts'))).toBe(true)
    })

    it('should return files for ecommerce template', () => {
      const files = getTemplateFiles('ecommerce')

      expect(files).toBeDefined()
      expect(Object.keys(files).some((p) => p.includes('products'))).toBe(true)
    })

    it('should return empty object for unknown template', () => {
      const files = getTemplateFiles('unknown-template')

      expect(files).toEqual({})
    })

    it('should include data provider for templates', () => {
      const files = getTemplateFiles('blog')

      const hasDataProvider = Object.keys(files).some(
        (p) => p.includes('data-provider') || p.includes('dataProvider')
      )
      expect(hasDataProvider).toBe(true)
    })

    it('should include shadmin.config.ts for all templates', () => {
      for (const template of EXAMPLE_TEMPLATES) {
        const files = getTemplateFiles(template.id)
        const hasConfig = Object.keys(files).some(
          (p) => p === 'shadmin.config.ts'
        )
        expect(hasConfig, `Template '${template.id}' should include shadmin.config.ts`).toBe(true)
      }
    })

    it('should have config that references data-provider', () => {
      const files = getTemplateFiles('basic')
      const configContent = files['shadmin.config.ts']

      expect(configContent).toBeDefined()
      expect(configContent).toContain('dataProvider')
      expect(configContent).toContain('./data-provider')
    })
  })

  describe('shouldShowInteractiveMenu', () => {
    it('should return true when no resources found', () => {
      const result = shouldShowInteractiveMenu([])

      expect(result).toBe(true)
    })

    it('should return false when resources exist', () => {
      const result = shouldShowInteractiveMenu([
        {
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
          hasExport: { recordRepresentation: false, options: false },
          warnings: [],
          isMdx: false,
        },
      ])

      expect(result).toBe(false)
    })

    it('should return true when forceInteractive is true', () => {
      const result = shouldShowInteractiveMenu([], { forceInteractive: true })

      expect(result).toBe(true)
    })

    it('should return false when running in CI', () => {
      const result = shouldShowInteractiveMenu([], { isCI: true })

      expect(result).toBe(false)
    })
  })

  describe('ExampleTemplate interface', () => {
    it('should match expected shape', () => {
      const template: ExampleTemplate<'basic'> = {
        id: 'basic',
        name: 'Test Template',
        description: 'A test template',
        icon: '🧪',
      }

      expect(template.id).toBe('basic')
      expect(template.name).toBe('Test Template')
      expect(template.description).toBe('A test template')
      expect(template.icon).toBe('🧪')
    })
  })

  describe('isValidTemplateId', () => {
    it('should return true for valid template IDs', () => {
      const validIds: TemplateId[] = ['basic', 'blog', 'ecommerce', 'crm', 'content']
      for (const id of validIds) {
        expect(isValidTemplateId(id)).toBe(true)
      }
    })

    it('should return false for invalid template IDs', () => {
      expect(isValidTemplateId('unknown')).toBe(false)
      expect(isValidTemplateId('test')).toBe(false)
      expect(isValidTemplateId('')).toBe(false)
    })

    it('should work as a type guard', () => {
      const maybeId: string = 'basic'
      if (isValidTemplateId(maybeId)) {
        // TypeScript should narrow maybeId to TemplateId here
        const id: TemplateId = maybeId
        expect(id).toBe('basic')
      }
    })
  })
})
