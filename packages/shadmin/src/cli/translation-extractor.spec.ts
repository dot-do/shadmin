/**
 * @file translation-extractor.spec.ts
 * @description Tests for the translation key extraction CLI tool
 *
 * Tests the extraction of translation keys from:
 * - useTranslate() hook calls
 * - translate() function calls
 * - Various patterns with interpolation and default values
 */

import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  extractTranslationKeys,
  formatExtractionResult,
  type TranslationKey,
  type ExtractionResult,
} from './translation-extractor'

describe('Translation Extractor', () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(tmpdir(), `shadmin-i18n-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    mkdirSync(join(testDir, 'src'), { recursive: true })
  })

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true })
  })

  describe('extractTranslationKeys', () => {
    it('should return empty result for empty directory', async () => {
      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toEqual([])
      expect(result.filesScanned).toBe(0)
      expect(result.errors).toEqual([])
    })

    it('should extract translation keys from useTranslate hook', async () => {
      writeFileSync(
        join(testDir, 'src', 'Component.tsx'),
        `
import { useTranslate } from 'shadmin'

function Component() {
  const translate = useTranslate()
  return <div>{translate('hello.world')}</div>
}
`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]).toMatchObject({
        key: 'hello.world',
        file: 'src/Component.tsx',
      })
    })

    it('should extract multiple translation keys from a file', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `
import { useTranslate } from 'shadmin'

function App() {
  const translate = useTranslate()
  return (
    <div>
      <h1>{translate('app.title')}</h1>
      <p>{translate('app.description')}</p>
      <button>{translate('app.button.submit')}</button>
    </div>
  )
}
`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(3)
      const keys = result.keys.map((k) => k.key).sort()
      expect(keys).toEqual(['app.button.submit', 'app.description', 'app.title'])
    })

    it('should extract keys from direct translate function calls', async () => {
      writeFileSync(
        join(testDir, 'src', 'utils.ts'),
        `
function translate(key: string) {
  // Mock translate function
  return key
}

const message = translate('error.not_found')
const warning = translate('warning.low_stock')
`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(2)
      expect(result.keys.map((k) => k.key).sort()).toEqual(['error.not_found', 'warning.low_stock'])
    })

    it('should extract default values from options', async () => {
      writeFileSync(
        join(testDir, 'src', 'Component.tsx'),
        `
import { useTranslate } from 'shadmin'

function Component() {
  const translate = useTranslate()
  return <div>{translate('greeting', { _: 'Hello!' })}</div>
}
`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]).toMatchObject({
        key: 'greeting',
        defaultValue: 'Hello!',
      })
    })

    it('should extract interpolation parameters', async () => {
      writeFileSync(
        join(testDir, 'src', 'Component.tsx'),
        `
import { useTranslate } from 'shadmin'

function Component({ name, count }) {
  const translate = useTranslate()
  return <div>{translate('greeting', { name, count })}</div>
}
`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]?.interpolations).toEqual(['name', 'count'])
    })

    it('should exclude smart_count from interpolations', async () => {
      writeFileSync(
        join(testDir, 'src', 'Component.tsx'),
        `
const translate = useTranslate()
const text = translate('items', { smart_count: 5, label: 'items' })
`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]?.interpolations).toEqual(['label'])
    })

    it('should include line and column information', async () => {
      writeFileSync(
        join(testDir, 'src', 'Component.tsx'),
        `const translate = useTranslate()
const x = translate('test.key')
`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]?.line).toBe(2)
      expect(result.keys[0]?.column).toBeGreaterThan(0)
    })

    it('should scan multiple files', async () => {
      writeFileSync(
        join(testDir, 'src', 'A.tsx'),
        `const translate = useTranslate(); translate('key.a')`
      )
      writeFileSync(
        join(testDir, 'src', 'B.tsx'),
        `const translate = useTranslate(); translate('key.b')`
      )
      writeFileSync(
        join(testDir, 'src', 'C.tsx'),
        `const translate = useTranslate(); translate('key.c')`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.filesScanned).toBe(3)
      expect(result.keys).toHaveLength(3)
    })

    it('should ignore node_modules by default', async () => {
      mkdirSync(join(testDir, 'node_modules', 'some-lib'), { recursive: true })
      writeFileSync(
        join(testDir, 'node_modules', 'some-lib', 'index.tsx'),
        `translate('should.be.ignored')`
      )
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `translate('should.be.included')`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]?.key).toBe('should.be.included')
    })

    it('should ignore test files by default', async () => {
      writeFileSync(
        join(testDir, 'src', 'Component.tsx'),
        `translate('component.key')`
      )
      writeFileSync(
        join(testDir, 'src', 'Component.spec.tsx'),
        `translate('test.key')`
      )
      writeFileSync(
        join(testDir, 'src', 'Component.test.tsx'),
        `translate('test.key.2')`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]?.key).toBe('component.key')
    })

    it('should scan .ts, .tsx, .js, and .jsx files by default', async () => {
      writeFileSync(join(testDir, 'src', 'a.ts'), `translate('from.ts')`)
      writeFileSync(join(testDir, 'src', 'b.tsx'), `translate('from.tsx')`)
      writeFileSync(join(testDir, 'src', 'c.js'), `translate('from.js')`)
      writeFileSync(join(testDir, 'src', 'd.jsx'), `translate('from.jsx')`)

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.filesScanned).toBe(4)
      expect(result.keys).toHaveLength(4)
    })

    it('should write output to file when output option is provided', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `translate('test.key')`
      )

      const outputPath = join(testDir, 'translations.json')
      await extractTranslationKeys({
        rootDir: testDir,
        output: outputPath,
        format: 'json',
      })

      const content = readFileSync(outputPath, 'utf-8')
      const parsed = JSON.parse(content)
      expect(parsed.keys['test.key']).toBeDefined()
    })
  })

  describe('JSON output format', () => {
    it('should produce valid JSON with meta and keys sections', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `translate('hello')`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })
      const json = JSON.parse(formatExtractionResult(result, 'json'))

      expect(json.meta).toBeDefined()
      expect(json.meta.filesScanned).toBe(1)
      expect(json.meta.totalKeys).toBe(1)
      expect(json.keys).toBeDefined()
      expect(json.keys['hello']).toBeDefined()
    })

    it('should group duplicate keys and track all occurrences', async () => {
      writeFileSync(
        join(testDir, 'src', 'A.tsx'),
        `translate('shared.key')`
      )
      writeFileSync(
        join(testDir, 'src', 'B.tsx'),
        `translate('shared.key')`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })
      const json = JSON.parse(formatExtractionResult(result, 'json'))

      expect(json.meta.totalKeys).toBe(1)
      expect(json.meta.totalOccurrences).toBe(2)
      expect(json.keys['shared.key'].occurrences).toHaveLength(2)
    })

    it('should merge interpolations from multiple occurrences', async () => {
      writeFileSync(
        join(testDir, 'src', 'A.tsx'),
        `translate('greeting', { name: 'John' })`
      )
      writeFileSync(
        join(testDir, 'src', 'B.tsx'),
        `translate('greeting', { age: 30 })`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })
      const json = JSON.parse(formatExtractionResult(result, 'json'))

      expect(json.keys['greeting'].interpolations).toContain('name')
      expect(json.keys['greeting'].interpolations).toContain('age')
    })

    it('should sort keys alphabetically', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `
translate('zebra')
translate('apple')
translate('mango')
`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })
      const json = JSON.parse(formatExtractionResult(result, 'json'))
      const keys = Object.keys(json.keys)

      expect(keys).toEqual(['apple', 'mango', 'zebra'])
    })
  })

  describe('PO output format', () => {
    it('should produce valid PO format with header', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `translate('hello')`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })
      const po = formatExtractionResult(result, 'po')

      expect(po).toContain('# Translation keys extracted by shadmin')
      expect(po).toContain('msgid ""')
      expect(po).toContain('msgstr ""')
      expect(po).toContain('"Content-Type: text/plain; charset=UTF-8\\n"')
    })

    it('should include file references as comments', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `translate('hello')`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })
      const po = formatExtractionResult(result, 'po')

      expect(po).toMatch(/#: src\/App\.tsx:\d+/)
    })

    it('should format msgid and msgstr correctly', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `translate('greeting', { _: 'Hello!' })`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })
      const po = formatExtractionResult(result, 'po')

      expect(po).toContain('msgid "greeting"')
      expect(po).toContain('msgstr "Hello!"')
    })

    it('should escape quotes in keys and values', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `translate('say "hello"', { _: 'Say "hi"' })`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })
      const po = formatExtractionResult(result, 'po')

      expect(po).toContain('msgid "say \\"hello\\""')
      expect(po).toContain('msgstr "Say \\"hi\\""')
    })

    it('should include multiple file references for duplicate keys', async () => {
      writeFileSync(
        join(testDir, 'src', 'A.tsx'),
        `translate('shared')`
      )
      writeFileSync(
        join(testDir, 'src', 'B.tsx'),
        `translate('shared')`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })
      const po = formatExtractionResult(result, 'po')

      expect(po).toMatch(/#: src\/A\.tsx:\d+/)
      expect(po).toMatch(/#: src\/B\.tsx:\d+/)
    })
  })

  describe('Error handling', () => {
    it('should handle non-existent directories gracefully', async () => {
      const result = await extractTranslationKeys({
        rootDir: '/non/existent/path',
      })

      expect(result.keys).toEqual([])
      expect(result.filesScanned).toBe(0)
    })

    it('should continue parsing other files when one has syntax errors', async () => {
      writeFileSync(
        join(testDir, 'src', 'good.tsx'),
        `translate('valid.key')`
      )
      writeFileSync(
        join(testDir, 'src', 'bad.tsx'),
        `this is not valid javascript {{{{`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      // Should still extract from the good file
      expect(result.keys.some((k) => k.key === 'valid.key')).toBe(true)
    })
  })

  describe('Advanced patterns', () => {
    it('should handle renamed translate variable', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `
const t = useTranslate()
t('shorthand.key')
`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]?.key).toBe('shorthand.key')
    })

    it('should handle nested directories', async () => {
      mkdirSync(join(testDir, 'src', 'components', 'nested'), { recursive: true })
      writeFileSync(
        join(testDir, 'src', 'components', 'nested', 'Deep.tsx'),
        `translate('deep.nested.key')`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]?.file).toContain('components/nested/Deep.tsx')
    })

    it('should handle template literals as keys (no substitutions)', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        'translate(`template.key`)'
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      expect(result.keys).toHaveLength(1)
      expect(result.keys[0]?.key).toBe('template.key')
    })

    it('should ignore dynamic keys (template literals with substitutions)', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        'translate(`${prefix}.dynamic`)'
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      // Dynamic keys cannot be extracted statically
      expect(result.keys).toHaveLength(0)
    })

    it('should ignore variable keys', async () => {
      writeFileSync(
        join(testDir, 'src', 'App.tsx'),
        `
const key = 'dynamic.key'
translate(key)
`
      )

      const result = await extractTranslationKeys({ rootDir: testDir })

      // Variable keys cannot be extracted statically
      expect(result.keys).toHaveLength(0)
    })
  })
})

describe('TranslationKey type', () => {
  it('should have correct shape', () => {
    const key: TranslationKey = {
      key: 'test.key',
      file: 'App.tsx',
      line: 10,
      column: 5,
      defaultValue: 'Default',
      interpolations: ['name', 'count'],
    }

    expect(key.key).toBe('test.key')
    expect(key.defaultValue).toBe('Default')
    expect(key.interpolations).toEqual(['name', 'count'])
  })
})

describe('ExtractionResult type', () => {
  it('should have correct shape', () => {
    const result: ExtractionResult = {
      keys: [
        { key: 'test', file: 'App.tsx', line: 1, column: 1 },
      ],
      filesScanned: 5,
      errors: [{ file: 'bad.tsx', error: 'Syntax error' }],
    }

    expect(result.keys).toHaveLength(1)
    expect(result.filesScanned).toBe(5)
    expect(result.errors).toHaveLength(1)
  })
})
