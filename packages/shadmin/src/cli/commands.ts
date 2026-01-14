/**
 * @file commands.ts
 * @description CLI Commands for shadmin - handles argument parsing and Vite config
 */

import react from '@vitejs/plugin-react'

import { shadminPlugin, type ShadminPluginOptions, type MdxOptions } from './vite-plugin'

import type { InlineConfig } from 'vite'

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
export type CLICommand = 'dev' | 'build' | 'preview' | 'help' | 'version' | 'extract-translations'

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
  /** Custom resources directory name */
  resourcesDir?: string
  /** Output format for extract-translations (json or po) */
  format?: 'json' | 'po'
  /** Output file path for extract-translations */
  output?: string
}

/** Valid commands */
const COMMANDS = new Set<CLICommand>(['dev', 'build', 'preview', 'help', 'version', 'extract-translations'])

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
      const portValue = args[++i]
      if (portValue !== undefined) {
        result.port = parseInt(portValue, 10)
      }
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
      const rootValue = args[++i]
      if (rootValue !== undefined) {
        result.root = rootValue
      }
      i++
      continue
    }

    // Config option
    if (arg === '--config' || arg === '-c') {
      const configValue = args[++i]
      if (configValue !== undefined) {
        result.configFile = configValue
      }
      i++
      continue
    }

    // OutDir option
    if (arg === '--outDir') {
      const outDirValue = args[++i]
      if (outDirValue !== undefined) {
        result.outDir = outDirValue
      }
      i++
      continue
    }

    // Resources directory option
    if (arg === '--resources-dir') {
      const resourcesDirValue = args[++i]
      if (resourcesDirValue !== undefined) {
        result.resourcesDir = resourcesDirValue
      }
      i++
      continue
    }

    // Format option (for extract-translations)
    if (arg === '--format' || arg === '-f') {
      const formatValue = args[++i]
      if (formatValue === 'json' || formatValue === 'po') {
        result.format = formatValue
      }
      i++
      continue
    }

    // Output option (for extract-translations)
    if (arg === '--output' || arg === '-O') {
      const outputValue = args[++i]
      if (outputValue !== undefined) {
        result.output = outputValue
      }
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
    if (arg && !arg.startsWith('-')) {
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
    ...(resourcesDir !== undefined && { resourcesDir }),
    ...(dataProviderImport !== undefined && { dataProviderImport }),
    ...(authProviderImport !== undefined && { authProviderImport }),
    ...(layoutImport !== undefined && { layoutImport }),
    ...(dashboardImport !== undefined && { dashboardImport }),
    ...(basename !== undefined && { basename }),
    ...(mdxOptions !== undefined && { mdxOptions }),
  }

  return {
    root,
    plugins: [
      react(),
      shadminPlugin(pluginOptions),
    ],
    server: {
      ...(port !== undefined && { port }),
      ...(host !== undefined && { host }),
      ...(open !== undefined && { open }),
    },
    build: {
      ...(outDir !== undefined && { outDir }),
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
