/**
 * @file config.spec.ts
 * @description RED phase TDD tests for shadmin configuration file support
 *
 * The config module is responsible for:
 * 1. Loading configuration from shadmin.config.ts files
 * 2. Validating configuration options
 * 3. Merging config with CLI arguments
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdirSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

// These will be implemented in config.ts
import {
  loadConfig,
  validateConfig,
  mergeConfigWithArgs,
  resolveConfigPath,
  type ShadminConfig,
  type ResolvedConfig,
} from './config'

describe('shadmin Configuration', () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(tmpdir(), `shadmin-config-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true })
  })

  describe('ShadminConfig interface', () => {
    it('should define all configurable options', () => {
      const config: ShadminConfig = {
        dataProvider: './data-provider',
        authProvider: './auth-provider',
        layout: './layout',
        dashboard: './dashboard',
        basename: '/admin',
        resourcesDir: 'resources',
      }

      expect(config.dataProvider).toBe('./data-provider')
      expect(config.authProvider).toBe('./auth-provider')
      expect(config.layout).toBe('./layout')
      expect(config.dashboard).toBe('./dashboard')
      expect(config.basename).toBe('/admin')
      expect(config.resourcesDir).toBe('resources')
    })

    it('should allow partial configuration', () => {
      const config: ShadminConfig = {
        dataProvider: './dp',
      }

      expect(config.dataProvider).toBe('./dp')
      expect(config.authProvider).toBeUndefined()
    })
  })

  describe('resolveConfigPath', () => {
    it('should return explicit config path when provided', () => {
      const result = resolveConfigPath(testDir, './custom.config.ts')

      expect(result).toBe(join(testDir, 'custom.config.ts'))
    })

    it('should find shadmin.config.ts in root directory', () => {
      writeFileSync(join(testDir, 'shadmin.config.ts'), 'export default {}')

      const result = resolveConfigPath(testDir)

      expect(result).toBe(join(testDir, 'shadmin.config.ts'))
    })

    it('should find shadmin.config.js if .ts not found', () => {
      writeFileSync(join(testDir, 'shadmin.config.js'), 'module.exports = {}')

      const result = resolveConfigPath(testDir)

      expect(result).toBe(join(testDir, 'shadmin.config.js'))
    })

    it('should return null if no config file exists', () => {
      const result = resolveConfigPath(testDir)

      expect(result).toBeNull()
    })

    it('should prefer .ts over .js config', () => {
      writeFileSync(join(testDir, 'shadmin.config.ts'), 'export default { ts: true }')
      writeFileSync(join(testDir, 'shadmin.config.js'), 'module.exports = { js: true }')

      const result = resolveConfigPath(testDir)

      expect(result).toBe(join(testDir, 'shadmin.config.ts'))
    })
  })

  describe('loadConfig', () => {
    it('should return empty config if file not found', async () => {
      const config = await loadConfig(join(testDir, 'nonexistent.config.ts'))

      expect(config).toEqual({})
    })

    it('should handle object config export', async () => {
      // Test the config loading logic with a mock
      // In real usage, loadConfig will import the file dynamically
      // For testing, we verify the internal logic with parseConfigModule
      const { parseConfigModule } = await import('./config')

      const mockModule = {
        default: {
          dataProvider: './data-provider',
          basename: '/admin',
        },
      }

      const config = parseConfigModule(mockModule, { mode: 'development' })

      expect(config).toBeDefined()
      expect(config.dataProvider).toBe('./data-provider')
      expect(config.basename).toBe('/admin')
    })

    it('should handle function config export', async () => {
      const { parseConfigModule } = await import('./config')

      const mockModule = {
        default: (env: any) => ({
          basename: env.mode === 'production' ? '/admin' : '/',
        }),
      }

      const config = parseConfigModule(mockModule, { mode: 'production' })

      expect(config.basename).toBe('/admin')
    })

    it('should handle function config export with development mode', async () => {
      const { parseConfigModule } = await import('./config')

      const mockModule = {
        default: (env: any) => ({
          basename: env.mode === 'production' ? '/admin' : '/',
        }),
      }

      const config = parseConfigModule(mockModule, { mode: 'development' })

      expect(config.basename).toBe('/')
    })

    it('should handle config with all options', async () => {
      const { parseConfigModule } = await import('./config')

      const mockModule = {
        default: {
          dataProvider: './data-provider',
          authProvider: './auth-provider',
          layout: './layout',
          dashboard: './dashboard',
          basename: '/admin',
          resourcesDir: 'resources',
        },
      }

      const config = parseConfigModule(mockModule, { mode: 'development' })

      expect(config.dataProvider).toBe('./data-provider')
      expect(config.authProvider).toBe('./auth-provider')
      expect(config.layout).toBe('./layout')
      expect(config.dashboard).toBe('./dashboard')
      expect(config.basename).toBe('/admin')
      expect(config.resourcesDir).toBe('resources')
    })

    it('should return empty config if module has no default export', async () => {
      const { parseConfigModule } = await import('./config')

      const mockModule = {}

      const config = parseConfigModule(mockModule, { mode: 'development' })

      expect(config).toEqual({})
    })
  })

  describe('validateConfig', () => {
    it('should pass valid config', () => {
      const config: ShadminConfig = {
        dataProvider: './data-provider',
        basename: '/admin',
      }

      const result = validateConfig(config)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should warn for invalid basename format', () => {
      const config: ShadminConfig = {
        basename: 'admin', // missing leading slash
      }

      const result = validateConfig(config)

      expect(result.warnings).toContain('basename should start with "/"')
    })

    it('should warn for trailing slash in basename', () => {
      const config: ShadminConfig = {
        basename: '/admin/',
      }

      const result = validateConfig(config)

      expect(result.warnings).toContain('basename should not end with "/"')
    })

    it('should error for non-string dataProvider', () => {
      const config = {
        dataProvider: 123,
      } as unknown as ShadminConfig

      const result = validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('dataProvider must be a string')
    })

    it('should error for non-string authProvider', () => {
      const config = {
        authProvider: ['array'],
      } as unknown as ShadminConfig

      const result = validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('authProvider must be a string')
    })

    it('should error for non-string layout', () => {
      const config = {
        layout: { object: true },
      } as unknown as ShadminConfig

      const result = validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('layout must be a string')
    })

    it('should pass with empty config', () => {
      const config: ShadminConfig = {}

      const result = validateConfig(config)

      expect(result.valid).toBe(true)
    })

    it('should return all errors when multiple issues exist', () => {
      const config = {
        dataProvider: 123,
        authProvider: null,
        basename: 'invalid',
      } as unknown as ShadminConfig

      const result = validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })
  })

  describe('mergeConfigWithArgs', () => {
    it('should merge config with CLI args', () => {
      const config: ShadminConfig = {
        dataProvider: './data-provider',
        basename: '/admin',
        resourcesDir: 'resources',
      }

      const args = {
        command: 'dev' as const,
        root: testDir,
        port: 3000,
      }

      const result = mergeConfigWithArgs(config, args)

      expect(result.dataProviderImport).toBe('./data-provider')
      expect(result.basename).toBe('/admin')
      expect(result.resourcesDir).toBe('resources')
      expect(result.root).toBe(testDir)
      expect(result.port).toBe(3000)
    })

    it('should use CLI args over config when both exist', () => {
      const config: ShadminConfig = {
        resourcesDir: 'resources',
      }

      const args = {
        command: 'dev' as const,
        root: testDir,
        resourcesDir: 'custom-resources', // CLI override
      }

      const result = mergeConfigWithArgs(config, args as any)

      expect(result.resourcesDir).toBe('custom-resources')
    })

    it('should convert config paths to plugin format', () => {
      const config: ShadminConfig = {
        dataProvider: './data-provider',
        authProvider: './auth-provider',
        layout: './layout',
        dashboard: './dashboard',
      }

      const args = {
        command: 'dev' as const,
        root: testDir,
      }

      const result = mergeConfigWithArgs(config, args)

      expect(result.dataProviderImport).toBe('./data-provider')
      expect(result.authProviderImport).toBe('./auth-provider')
      expect(result.layoutImport).toBe('./layout')
      expect(result.dashboardImport).toBe('./dashboard')
    })

    it('should handle empty config', () => {
      const config: ShadminConfig = {}

      const args = {
        command: 'dev' as const,
        root: testDir,
      }

      const result = mergeConfigWithArgs(config, args)

      expect(result.root).toBe(testDir)
      expect(result.dataProviderImport).toBeUndefined()
    })

    it('should preserve all CLI args', () => {
      const config: ShadminConfig = {
        basename: '/admin',
      }

      const args = {
        command: 'dev' as const,
        root: testDir,
        port: 8080,
        host: '0.0.0.0',
        open: true,
        outDir: './dist',
      }

      const result = mergeConfigWithArgs(config, args)

      expect(result.port).toBe(8080)
      expect(result.host).toBe('0.0.0.0')
      expect(result.open).toBe(true)
      expect(result.outDir).toBe('./dist')
    })
  })

  describe('ResolvedConfig type', () => {
    it('should have plugin-compatible property names', () => {
      const resolved: ResolvedConfig = {
        root: testDir,
        command: 'dev',
        dataProviderImport: './dp',
        authProviderImport: './auth',
        layoutImport: './layout',
        dashboardImport: './dashboard',
        basename: '/admin',
        resourcesDir: 'resources',
        port: 3000,
        host: 'localhost',
        open: true,
        outDir: 'dist',
      }

      expect(resolved.dataProviderImport).toBe('./dp')
      expect(resolved.authProviderImport).toBe('./auth')
    })
  })

  describe('defineConfig', () => {
    it('should return the same object config', async () => {
      const { defineConfig } = await import('./config')

      const config = {
        dataProvider: './dp',
        basename: '/admin',
      }

      const result = defineConfig(config)

      expect(result).toBe(config)
    })

    it('should return the same function config', async () => {
      const { defineConfig } = await import('./config')

      const configFn = (env: any) => ({
        basename: env.mode === 'production' ? '/admin' : '/',
      })

      const result = defineConfig(configFn)

      expect(result).toBe(configFn)
    })

    it('should provide type safety for config object', async () => {
      const { defineConfig } = await import('./config')

      const config = defineConfig({
        dataProvider: './data-provider',
        authProvider: './auth-provider',
        layout: './layout',
        dashboard: './dashboard',
        basename: '/admin',
        resourcesDir: 'resources',
      })

      expect(config).toBeDefined()
    })
  })

  describe('integration', () => {
    it('should resolve, parse, validate and merge config in one flow', async () => {
      // Create a config file to test resolveConfigPath
      writeFileSync(join(testDir, 'shadmin.config.ts'), 'export default {}')

      const configPath = resolveConfigPath(testDir)
      expect(configPath).not.toBeNull()
      expect(configPath).toBe(join(testDir, 'shadmin.config.ts'))

      // Use parseConfigModule to simulate what loadConfig does internally
      const { parseConfigModule } = await import('./config')

      const mockConfig: ShadminConfig = {
        dataProvider: './my-data-provider',
        authProvider: './my-auth-provider',
        basename: '/my-admin',
      }

      const mockModule = { default: mockConfig }
      const config = parseConfigModule(mockModule, { mode: 'development' })

      expect(config.dataProvider).toBe('./my-data-provider')

      const validation = validateConfig(config)
      expect(validation.valid).toBe(true)

      const args = {
        command: 'dev' as const,
        root: testDir,
        port: 5173,
      }

      const resolved = mergeConfigWithArgs(config, args)
      expect(resolved.dataProviderImport).toBe('./my-data-provider')
      expect(resolved.authProviderImport).toBe('./my-auth-provider')
      expect(resolved.basename).toBe('/my-admin')
      expect(resolved.port).toBe(5173)
    })
  })
})
