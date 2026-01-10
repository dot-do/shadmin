/**
 * @file commands.ts
 * @description CLI Commands for shadmin - handles argument parsing and Vite config
 */

import type { InlineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { shadminPlugin, type ShadminPluginOptions, type MdxOptions } from './vite-plugin'

/**
 * Config options that can be passed to createViteConfig
 */
export interface ViteConfigOptions {
  /** Import path for data provider */
  dataProviderImport?: string
  /** Import path for auth provider */
  authProviderImport?: string
  /** Import path for layout component */
  layoutImport?: string
  /** Import path for dashboard component */
  dashboardImport?: string
  /** Base URL path for the admin */
  basename?: string
  /** Custom resources directory name */
  resourcesDir?: string
  /** MDX compilation options */
  mdxOptions?: MdxOptions
}

/**
 * Available CLI commands
 */
export type CLICommand = 'dev' | 'build' | 'preview' | 'help' | 'version'

/**
 * Parsed CLI arguments
 */
export interface CLIArgs {
  /** The command to run */
  command: CLICommand
  /** Root directory for the project */
  root: string
  /** Port for dev server */
  port?: number
  /** Host for dev server */
  host?: string | boolean
  /** Open browser on start */
  open?: boolean
  /** Output directory for build */
  outDir?: string
  /** Path to shadmin config file */
  configFile?: string
}

/** Valid commands */
const COMMANDS = new Set<CLICommand>(['dev', 'build', 'preview', 'help', 'version'])

/**
 * Parses command line arguments
 *
 * @param args - Command line arguments (without node and script path)
 * @returns Parsed CLI arguments
 */
export function parseArgs(args: string[]): CLIArgs {
  const result: CLIArgs = {
    command: 'dev',
    root: process.cwd(),
    outDir: 'dist',
  }

  let i = 0
  while (i < args.length) {
    const arg = args[i]

    // Help flags
    if (arg === '--help' || arg === '-h') {
      result.command = 'help'
      i++
      continue
    }

    // Version flags
    if (arg === '--version' || arg === '-v') {
      result.command = 'version'
      i++
      continue
    }

    // Port option
    if (arg === '--port' || arg === '-p') {
      result.port = parseInt(args[++i], 10)
      i++
      continue
    }

    // Host option
    if (arg === '--host') {
      const nextArg = args[i + 1]
      if (nextArg && !nextArg.startsWith('-')) {
        result.host = nextArg
        i++
      } else {
        result.host = true
      }
      i++
      continue
    }

    // Open option
    if (arg === '--open' || arg === '-o') {
      result.open = true
      i++
      continue
    }

    // Root option
    if (arg === '--root') {
      result.root = args[++i]
      i++
      continue
    }

    // Config option
    if (arg === '--config' || arg === '-c') {
      result.configFile = args[++i]
      i++
      continue
    }

    // OutDir option
    if (arg === '--outDir') {
      result.outDir = args[++i]
      i++
      continue
    }

    // Check if it's a command
    if (COMMANDS.has(arg as CLICommand)) {
      result.command = arg as CLICommand
      i++
      continue
    }

    // Positional argument - could be root path
    if (!arg.startsWith('-')) {
      result.root = arg
      i++
      continue
    }

    i++
  }

  return result
}

/**
 * Manual chunks function for code splitting
 * Separates vendor libraries from application code
 *
 * @param id - Module ID to check
 * @returns Chunk name or undefined
 *
 * @example
 * ```typescript
 * manualChunks('node_modules/react/index.js') // Returns 'vendor'
 * manualChunks('node_modules/shadmin/index.js') // Returns 'framework'
 * manualChunks('./src/App.tsx') // Returns undefined
 * ```
 */
export function manualChunks(id: string): string | undefined {
  // React and React DOM go into vendor chunk
  if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
    return 'vendor'
  }
  // Shadmin framework goes into its own chunk
  if (id.includes('node_modules/shadmin/')) {
    return 'framework'
  }
  return undefined
}

/**
 * Creates Vite configuration from CLI args
 *
 * @param args - CLI arguments
 * @param configOptions - Optional config options from shadmin.config.ts
 * @returns Vite inline configuration
 */
export function createViteConfig(
  args: Partial<CLIArgs>,
  configOptions: ViteConfigOptions = {}
): InlineConfig {
  const { root = process.cwd(), port, host, open, outDir } = args
  const {
    dataProviderImport,
    authProviderImport,
    layoutImport,
    dashboardImport,
    basename,
    resourcesDir,
    mdxOptions,
  } = configOptions

  // Build shadmin plugin options
  const pluginOptions: ShadminPluginOptions = {
    root,
    resourcesDir,
    dataProviderImport,
    authProviderImport,
    layoutImport,
    dashboardImport,
    basename,
    mdxOptions,
  }

  return {
    root,
    plugins: [
      react(),
      shadminPlugin(pluginOptions),
    ],
    server: {
      port,
      host,
      open,
    },
    build: {
      outDir,
      // Production optimizations
      minify: 'esbuild',
      target: 'esnext',
      sourcemap: true,
      cssMinify: true,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        input: 'virtual:shadmin-entry',
        treeshake: true,
        output: {
          manualChunks,
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'chunks/[name]-[hash].js',
          entryFileNames: '[name]-[hash].js',
        },
      },
    },
    esbuild: {
      jsx: 'automatic',
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'shadmin'],
    },
  }
}
