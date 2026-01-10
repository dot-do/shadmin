/**
 * @file vite-plugin.execution.spec.ts
 * @description Execution tests that verify generated code works at runtime
 *
 * These tests verify:
 * 1. Generated code structure is correct
 * 2. Virtual modules can be loaded when dependencies are available
 * 3. App component exports correctly
 *
 * Note: Tests that load modules via Vite ssrLoadModule need real node_modules.
 * Tests that just check code structure work with isolated temp directories.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import { tmpdir } from 'os'
import { shadminPlugin } from './vite-plugin'

// Project root has actual node_modules for full module loading tests
const PROJECT_ROOT = resolve(__dirname, '../..')

describe('Virtual Module Execution Tests', () => {
  let testDir: string
  let server: ViteDevServer | null = null

  beforeEach(() => {
    testDir = join(tmpdir(), `shadmin-exec-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    mkdirSync(testDir, { recursive: true })
    mkdirSync(join(testDir, 'resources'), { recursive: true })
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

  describe('Code Structure Validation', () => {
    it('generated app code has correct React.createElement syntax', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport function list() { return null }`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function
      const code = await load('\0virtual:shadmin-app.tsx')

      // Verify classic JSX transform (React.createElement, not jsx())
      expect(code).toContain('import React from "react"')
      expect(code).toContain('React.createElement')
      expect(code).not.toContain('jsx(')
      expect(code).not.toContain('react/jsx-runtime')
    })

    it('generated entry code has correct React.createElement syntax', async () => {
      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function
      const code = await load('\0virtual:shadmin-entry.tsx')

      // Verify classic JSX transform
      expect(code).toContain('import React from "react"')
      expect(code).toContain('React.createElement(App')
      expect(code).not.toContain('jsx(')
      expect(code).not.toContain('react/jsx-runtime')
    })

    it('generated code includes all CRUD operations from resources', async () => {
      writeFileSync(
        join(testDir, 'resources', 'users.tsx'),
        `
export const name = 'users'
export function list() { return null }
export function edit() { return null }
export function show() { return null }
export function create() { return null }
`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function
      const code = await load('\0virtual:shadmin-app.tsx')

      // All CRUD operations should be included
      expect(code).toContain('users.list')
      expect(code).toContain('users.edit')
      expect(code).toContain('users.show')
      expect(code).toContain('users.create')
    })

    it('generated code handles multiple resources', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport function list() { return null }`
      )
      writeFileSync(
        join(testDir, 'resources', 'users.tsx'),
        `export const name = 'users'\nexport function list() { return null }`
      )
      writeFileSync(
        join(testDir, 'resources', 'comments.tsx'),
        `export const name = 'comments'\nexport function list() { return null }`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function
      const code = await load('\0virtual:shadmin-app.tsx')

      // All resources should be imported and used
      expect(code).toContain('import * as posts from')
      expect(code).toContain('import * as users from')
      expect(code).toContain('import * as comments from')
      expect(code).toContain('name: "posts"')
      expect(code).toContain('name: "users"')
      expect(code).toContain('name: "comments"')
    })

    it('generated code handles nested resources', async () => {
      mkdirSync(join(testDir, 'resources', 'admin'), { recursive: true })
      writeFileSync(
        join(testDir, 'resources', 'admin', 'settings.tsx'),
        `export const name = 'admin/settings'\nexport function list() { return null }`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function
      const code = await load('\0virtual:shadmin-app.tsx')

      // Nested resource should be imported with sanitized variable name
      expect(code).toContain('import * as admin_settings from')
      expect(code).toContain('name: "admin/settings"')
    })

    it('generated code handles empty resources directory', async () => {
      // No resources added - directory is empty
      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function
      const code = await load('\0virtual:shadmin-app.tsx')

      // Should generate valid Admin without resources
      expect(code).toContain('React.createElement(Admin')
      expect(code).not.toContain('Resource')
    })
  })

  describe('Module Loading with Real Dependencies', () => {
    // These tests use the actual project root which has node_modules
    // They verify that the generated code can actually be loaded by Vite

    it('should load virtual:shadmin-app and export App function', async () => {
      // Use the project's existing resources directory
      server = await createServer({
        root: PROJECT_ROOT,
        plugins: [
          react(),
          shadminPlugin({ root: PROJECT_ROOT }),
        ],
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'silent',
      })

      // Load the module via Vite's SSR module loader
      const module = await server.ssrLoadModule('virtual:shadmin-app')

      // Verify module exports App
      expect(module).toBeDefined()
      expect(module.App).toBeDefined()
      expect(typeof module.App).toBe('function')
    })

    // Note: The entry module contains document.getElementById('root') which
    // can't run in SSR (Node has no DOM). The entry module is validated
    // through the Code Structure Validation tests above, and through
    // the dev server working correctly in browser.

    it('App component should be callable and return React element', async () => {
      server = await createServer({
        root: PROJECT_ROOT,
        plugins: [
          react(),
          shadminPlugin({ root: PROJECT_ROOT }),
        ],
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'silent',
      })

      const { App } = await server.ssrLoadModule('virtual:shadmin-app')

      // Call App and verify it returns a React element
      const element = App()
      expect(element).toBeDefined()
      expect(element).toHaveProperty('type')
      expect(element).toHaveProperty('props')
    })
  })

  describe('Provider Configuration', () => {
    it('generated code includes dataProvider when configured', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport function list() { return null }`
      )
      writeFileSync(
        join(testDir, 'data-provider.ts'),
        `export const dataProvider = { getList: async () => ({ data: [], total: 0 }) }`
      )

      const plugin = shadminPlugin({
        root: testDir,
        dataProviderImport: './data-provider',
      })
      const load = plugin.load as Function
      const code = await load('\0virtual:shadmin-app.tsx')

      expect(code).toContain('import { dataProvider }')
      expect(code).toContain('dataProvider')
    })

    it('auto-detects data-provider.ts in root', async () => {
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport function list() { return null }`
      )
      writeFileSync(
        join(testDir, 'data-provider.ts'),
        `export const dataProvider = {}`
      )

      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function
      const code = await load('\0virtual:shadmin-app.tsx')

      // Should auto-detect and include the data provider
      expect(code).toContain('import { dataProvider }')
    })
  })
})
