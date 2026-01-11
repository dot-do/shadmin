/**
 * @file commands.spec.ts
 * @description RED phase TDD tests for the shadmin CLI Commands
 *
 * The CLI Commands module handles:
 * 1. Parsing command line arguments
 * 2. Starting the dev server
 * 3. Building for production
 * 4. Preview production builds
 */

import { describe, it, expect, vi } from 'vitest'

// Mock the Vite React plugin to avoid esbuild issues in test environment
vi.mock('@vitejs/plugin-react', () => ({
  default: () => ({ name: 'vite:react-babel' }),
}))

import {
  parseArgs,
  createViteConfig,
  manualChunks,
  type CLIArgs,
  type CLICommand,
} from './commands'

describe('CLI Commands', () => {
  describe('parseArgs', () => {
    it('should default to dev command when no args', () => {
      const args = parseArgs([])

      expect(args.command).toBe('dev')
    })

    it('should parse dev command', () => {
      const args = parseArgs(['dev'])

      expect(args.command).toBe('dev')
    })

    it('should parse build command', () => {
      const args = parseArgs(['build'])

      expect(args.command).toBe('build')
    })

    it('should parse preview command', () => {
      const args = parseArgs(['preview'])

      expect(args.command).toBe('preview')
    })

    it('should parse --port option', () => {
      const args = parseArgs(['dev', '--port', '3000'])

      expect(args.port).toBe(3000)
    })

    it('should parse -p shorthand for port', () => {
      const args = parseArgs(['dev', '-p', '4000'])

      expect(args.port).toBe(4000)
    })

    it('should parse --host option', () => {
      const args = parseArgs(['dev', '--host', '0.0.0.0'])

      expect(args.host).toBe('0.0.0.0')
    })

    it('should parse --host flag without value for true', () => {
      const args = parseArgs(['dev', '--host'])

      expect(args.host).toBe(true)
    })

    it('should parse --open option', () => {
      const args = parseArgs(['dev', '--open'])

      expect(args.open).toBe(true)
    })

    it('should parse -o shorthand for open', () => {
      const args = parseArgs(['dev', '-o'])

      expect(args.open).toBe(true)
    })

    it('should parse --root option', () => {
      const args = parseArgs(['dev', '--root', '/path/to/app'])

      expect(args.root).toBe('/path/to/app')
    })

    it('should default root to current directory', () => {
      const args = parseArgs([])

      expect(args.root).toBe(process.cwd())
    })

    it('should parse --config option for shadmin config', () => {
      const args = parseArgs(['dev', '--config', './shadmin.config.ts'])

      expect(args.configFile).toBe('./shadmin.config.ts')
    })

    it('should parse -c shorthand for config', () => {
      const args = parseArgs(['dev', '-c', './config.ts'])

      expect(args.configFile).toBe('./config.ts')
    })

    it('should parse --outDir option for build', () => {
      const args = parseArgs(['build', '--outDir', './dist'])

      expect(args.outDir).toBe('./dist')
    })

    it('should default outDir to dist', () => {
      const args = parseArgs(['build'])

      expect(args.outDir).toBe('dist')
    })

    it('should return help command for --help', () => {
      const args = parseArgs(['--help'])

      expect(args.command).toBe('help')
    })

    it('should return help command for -h', () => {
      const args = parseArgs(['-h'])

      expect(args.command).toBe('help')
    })

    it('should return version command for --version', () => {
      const args = parseArgs(['--version'])

      expect(args.command).toBe('version')
    })

    it('should return version command for -v', () => {
      const args = parseArgs(['-v'])

      expect(args.command).toBe('version')
    })

    it('should parse multiple options together', () => {
      const args = parseArgs(['dev', '-p', '8080', '--host', '-o'])

      expect(args.command).toBe('dev')
      expect(args.port).toBe(8080)
      expect(args.host).toBe(true)
      expect(args.open).toBe(true)
    })

    it('should use positional argument as root if provided', () => {
      const args = parseArgs(['./my-app'])

      expect(args.root).toBe('./my-app')
      expect(args.command).toBe('dev')
    })

    it('should handle command with positional root', () => {
      const args = parseArgs(['dev', './my-app'])

      expect(args.command).toBe('dev')
      expect(args.root).toBe('./my-app')
    })
  })

  describe('createViteConfig', () => {
    it('should return valid Vite config', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      })

      expect(config).toBeDefined()
      expect(config.root).toBe('/test/path')
    })

    it('should include shadmin plugin', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      })

      expect(config.plugins).toBeDefined()
      expect(config.plugins?.length).toBeGreaterThan(0)
    })

    it('should include React plugin', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      })

      expect(config.plugins).toBeDefined()
      // React plugin should be included
      const pluginNames = config.plugins?.map((p: any) => p.name)
      expect(pluginNames).toContain('vite:react-babel')
    })

    it('should set server port from args', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
        port: 3000,
      })

      expect(config.server?.port).toBe(3000)
    })

    it('should set server host from args', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
        host: '0.0.0.0',
      })

      expect(config.server?.host).toBe('0.0.0.0')
    })

    it('should set server open from args', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
        open: true,
      })

      expect(config.server?.open).toBe(true)
    })

    it('should set build outDir from args', () => {
      const config = createViteConfig({
        command: 'build',
        root: '/test/path',
        outDir: './custom-dist',
      })

      expect(config.build?.outDir).toBe('./custom-dist')
    })

    it('should configure virtual entry as input', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      })

      // Should use virtual:shadmin-entry as the entry point
      expect(config.build?.rollupOptions?.input).toBeDefined()
    })

    it('should enable JSX transform', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      })

      expect(config.esbuild && (config.esbuild as { jsx?: string }).jsx).toBe('automatic')
    })
  })

  describe('CLIArgs interface', () => {
    it('should have all required properties', () => {
      const args: CLIArgs = {
        command: 'dev',
        root: '/test',
        port: 5173,
        host: true,
        open: false,
        outDir: 'dist',
      }

      expect(args.command).toBe('dev')
      expect(args.root).toBe('/test')
      expect(args.port).toBe(5173)
    })

    it('should accept optional properties', () => {
      const args: CLIArgs = {
        command: 'dev',
        root: '/test',
        configFile: './shadmin.config.ts',
      }

      expect(args.configFile).toBe('./shadmin.config.ts')
    })
  })

  describe('CLICommand type', () => {
    it('should accept valid commands', () => {
      const commands: CLICommand[] = ['dev', 'build', 'preview', 'help', 'version']

      expect(commands).toHaveLength(5)
    })
  })

  describe('createViteConfig with ShadminConfig', () => {
    it('should pass dataProviderImport to plugin', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      }, {
        dataProviderImport: './data-provider',
      })

      expect(config).toBeDefined()
      // The plugin receives the config options
      const shadminPlugin = config.plugins?.find((p: any) => p.name === 'shadmin') as any
      expect(shadminPlugin).toBeDefined()
    })

    it('should pass authProviderImport to plugin', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      }, {
        authProviderImport: './auth-provider',
      })

      expect(config).toBeDefined()
    })

    it('should pass layoutImport to plugin', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      }, {
        layoutImport: './layout',
      })

      expect(config).toBeDefined()
    })

    it('should pass dashboardImport to plugin', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      }, {
        dashboardImport: './dashboard',
      })

      expect(config).toBeDefined()
    })

    it('should pass basename to plugin', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      }, {
        basename: '/admin',
      })

      expect(config).toBeDefined()
    })

    it('should pass resourcesDir to plugin', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
      }, {
        resourcesDir: 'custom-resources',
      })

      expect(config).toBeDefined()
    })

    it('should use all config options together', () => {
      const config = createViteConfig({
        command: 'dev',
        root: '/test/path',
        port: 3000,
      }, {
        dataProviderImport: './dp',
        authProviderImport: './ap',
        layoutImport: './layout',
        dashboardImport: './dashboard',
        basename: '/admin',
        resourcesDir: 'resources',
      })

      expect(config).toBeDefined()
      expect(config.server?.port).toBe(3000)
    })
  })

  describe('Production Build Configuration', () => {
    describe('minification and optimization', () => {
      it('should enable minification for production builds', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        expect(config.build?.minify).toBe('esbuild')
      })

      it('should enable tree shaking for production builds', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        expect(config.build?.rollupOptions?.treeshake).toBe(true)
      })

      it('should set target to modern browsers', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        expect(config.build?.target).toBe('esnext')
      })

      it('should enable sourcemaps for production', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        expect(config.build?.sourcemap).toBe(true)
      })
    })

    describe('code splitting and chunking', () => {
      it('should configure manual chunks for vendor splitting', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        const manualChunks = config.build?.rollupOptions?.output
        expect(manualChunks).toBeDefined()
      })

      it('should split React into vendor chunk', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        const output = config.build?.rollupOptions?.output as any
        const manualChunks = output?.manualChunks

        expect(typeof manualChunks).toBe('function')
        const result = manualChunks('node_modules/react/index.js')
        expect(result).toBe('vendor')
      })

      it('should split React DOM into vendor chunk', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        const output = config.build?.rollupOptions?.output as any
        const manualChunks = output?.manualChunks

        const result = manualChunks('node_modules/react-dom/index.js')
        expect(result).toBe('vendor')
      })

      it('should split shadmin into framework chunk', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        const output = config.build?.rollupOptions?.output as any
        const manualChunks = output?.manualChunks

        const result = manualChunks('node_modules/shadmin/index.js')
        expect(result).toBe('framework')
      })

      it('should set chunk size warning limit', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        expect(config.build?.chunkSizeWarningLimit).toBe(500)
      })
    })

    describe('asset handling', () => {
      it('should configure asset file names with hash', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        const output = config.build?.rollupOptions?.output as any
        expect(output?.assetFileNames).toBe('assets/[name]-[hash][extname]')
      })

      it('should configure chunk file names with hash', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        const output = config.build?.rollupOptions?.output as any
        expect(output?.chunkFileNames).toBe('chunks/[name]-[hash].js')
      })

      it('should configure entry file names with hash', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        const output = config.build?.rollupOptions?.output as any
        expect(output?.entryFileNames).toBe('[name]-[hash].js')
      })
    })

    describe('CSS optimization', () => {
      it('should configure CSS minification', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        expect(config.build?.cssMinify).toBe(true)
      })

      it('should configure CSS code splitting', () => {
        const config = createViteConfig({
          command: 'build',
          root: '/test/path',
        })

        expect(config.build?.cssCodeSplit).toBe(true)
      })
    })
  })

  describe('manualChunks', () => {
    describe('vendor chunk', () => {
      it('should return vendor for react module', () => {
        expect(manualChunks('node_modules/react/index.js')).toBe('vendor')
      })

      it('should return vendor for react-dom module', () => {
        expect(manualChunks('node_modules/react-dom/index.js')).toBe('vendor')
      })

      it('should return vendor for react-dom/client module', () => {
        expect(manualChunks('node_modules/react-dom/client.js')).toBe('vendor')
      })

      it('should return vendor for react submodules', () => {
        expect(manualChunks('node_modules/react/cjs/react.development.js')).toBe('vendor')
      })
    })

    describe('framework chunk', () => {
      it('should return framework for shadmin module', () => {
        expect(manualChunks('node_modules/shadmin/index.js')).toBe('framework')
      })

      it('should return framework for shadmin submodules', () => {
        expect(manualChunks('node_modules/shadmin/components/Admin.js')).toBe('framework')
      })
    })

    describe('application code', () => {
      it('should return undefined for app source files', () => {
        expect(manualChunks('./src/App.tsx')).toBeUndefined()
      })

      it('should return undefined for resource files', () => {
        expect(manualChunks('./resources/posts.tsx')).toBeUndefined()
      })

      it('should return undefined for other node_modules', () => {
        expect(manualChunks('node_modules/lodash/index.js')).toBeUndefined()
      })

      it('should return undefined for non-matching modules', () => {
        expect(manualChunks('/absolute/path/to/file.ts')).toBeUndefined()
      })
    })
  })
})
