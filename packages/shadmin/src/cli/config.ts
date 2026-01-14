/**
 * @file config.ts
 * @description Configuration file support for shadmin CLI
 *
 * Supports loading configuration from:
 * - shadmin.config.ts (TypeScript)
 * - shadmin.config.js (JavaScript)
 */

import { existsSync } from 'fs'
import { join, resolve } from 'path'
import { pathToFileURL } from 'url'

import type { CLIArgs } from './commands'

/**
 * Shadmin configuration options
 */
export interface ShadminConfig {
  /** Import path for data provider */
  dataProvider?: string
  /** Import path for auth provider */
  authProvider?: string
  /** Import path for layout component */
  layout?: string
  /** Import path for dashboard component */
  dashboard?: string
  /** Base URL path for the admin (e.g., '/admin') */
  basename?: string
  /** Custom resources directory name (default: 'resources') */
  resourcesDir?: string
}

/**
 * Environment passed to config function
 */
export interface ConfigEnv {
  /** Build mode (development or production) */
  mode: 'development' | 'production'
}

/**
 * Config file export can be an object or a function
 */
export type ConfigExport = ShadminConfig | ((env: ConfigEnv) => ShadminConfig)

/**
 * Resolved configuration merged with CLI args
 * Uses plugin-compatible property names
 */
export interface ResolvedConfig {
  /** Root directory */
  root: string
  /** CLI command */
  command: CLIArgs['command']
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
  /** Resources directory name */
  resourcesDir?: string
  /** Server port */
  port?: number
  /** Server host */
  host?: string | boolean
  /** Open browser on start */
  open?: boolean
  /** Output directory for build */
  outDir?: string
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether the config is valid */
  valid: boolean
  /** Validation errors (config is invalid) */
  errors: string[]
  /** Validation warnings (config is valid but may have issues) */
  warnings: string[]
}

/** Config file names to search for (in order of preference) */
const CONFIG_FILES = ['shadmin.config.ts', 'shadmin.config.js']

/**
 * Parses a config module export
 * Exported for testing purposes
 *
 * @param configModule - The imported module with a default export
 * @param env - Environment for function configs
 * @returns Parsed configuration object
 */
export function parseConfigModule(
  configModule: { default?: ConfigExport },
  env: ConfigEnv
): ShadminConfig {
  const configExport = configModule.default

  // Return empty config if no default export
  if (configExport === undefined) {
    return {}
  }

  // If it's a function, call it with env
  if (typeof configExport === 'function') {
    return configExport(env)
  }

  // Otherwise return as-is
  return configExport || {}
}

/**
 * Resolves the config file path
 *
 * @param rootDir - Root directory to search in
 * @param explicitPath - Explicit config path if provided via CLI
 * @returns Absolute path to config file or null if not found
 */
export function resolveConfigPath(rootDir: string, explicitPath?: string): string | null {
  // If explicit path provided, resolve it relative to root
  if (explicitPath) {
    return resolve(rootDir, explicitPath)
  }

  // Search for config files in order of preference
  for (const configFile of CONFIG_FILES) {
    const configPath = join(rootDir, configFile)
    if (existsSync(configPath)) {
      return configPath
    }
  }

  return null
}

/**
 * Loads configuration from a config file
 *
 * @param configPath - Absolute path to config file
 * @param env - Optional environment for function configs
 * @returns Loaded configuration object
 */
export async function loadConfig(
  configPath: string,
  env: ConfigEnv = { mode: 'development' }
): Promise<ShadminConfig> {
  // Return empty config if file doesn't exist
  if (!existsSync(configPath)) {
    return {}
  }

  try {
    // Use dynamic import with file URL for cross-platform compatibility
    const fileUrl = pathToFileURL(configPath).href

    // Add timestamp to bust cache during development
    const urlWithTimestamp = `${fileUrl}?t=${Date.now()}`

    // Import the config module
    const configModule = await import(urlWithTimestamp)

    // Use the shared parsing logic
    return parseConfigModule(configModule, env)
  } catch (error) {
    // Re-throw syntax errors
    if (error instanceof SyntaxError) {
      throw error
    }

    // For other import errors, also throw
    throw error
  }
}

/**
 * Validates configuration options
 *
 * @param config - Configuration to validate
 * @returns Validation result with errors and warnings
 */
export function validateConfig(config: ShadminConfig): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate string fields
  const stringFields = [
    'dataProvider',
    'authProvider',
    'layout',
    'dashboard',
    'basename',
    'resourcesDir',
  ] as const

  for (const field of stringFields) {
    const value = config[field]
    if (value !== undefined && typeof value !== 'string') {
      errors.push(`${field} must be a string`)
    }
  }

  // Validate basename format
  if (config.basename !== undefined && typeof config.basename === 'string') {
    if (!config.basename.startsWith('/')) {
      warnings.push('basename should start with "/"')
    }
    if (config.basename.length > 1 && config.basename.endsWith('/')) {
      warnings.push('basename should not end with "/"')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Helper function to define shadmin configuration with TypeScript support
 * Use this in your shadmin.config.ts for type hints
 *
 * @param config - Configuration object or function
 * @returns The same config (identity function for type inference)
 *
 * @example
 * ```typescript
 * // shadmin.config.ts
 * import { defineConfig } from 'shadmin/cli'
 *
 * export default defineConfig({
 *   dataProvider: './data-provider',
 *   authProvider: './auth-provider',
 *   basename: '/admin',
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Function config with environment
 * import { defineConfig } from 'shadmin/cli'
 *
 * export default defineConfig((env) => ({
 *   basename: env.mode === 'production' ? '/admin' : '/',
 * }))
 * ```
 */
export function defineConfig(config: ConfigExport): ConfigExport {
  return config
}

/**
 * Merges config with CLI arguments
 * CLI args take precedence over config file values
 *
 * @param config - Loaded configuration
 * @param args - CLI arguments
 * @returns Resolved configuration with plugin-compatible names
 */
export function mergeConfigWithArgs(
  config: ShadminConfig,
  args: CLIArgs
): ResolvedConfig {
  const resolved: ResolvedConfig = {
    root: args.root,
    command: args.command,
  }

  // Map config properties to plugin-compatible names
  if (config.dataProvider) {
    resolved.dataProviderImport = config.dataProvider
  }
  if (config.authProvider) {
    resolved.authProviderImport = config.authProvider
  }
  if (config.layout) {
    resolved.layoutImport = config.layout
  }
  if (config.dashboard) {
    resolved.dashboardImport = config.dashboard
  }
  if (config.basename) {
    resolved.basename = config.basename
  }

  // ResourcesDir - CLI args override config
  if (args.resourcesDir) {
    resolved.resourcesDir = args.resourcesDir
  } else if (config.resourcesDir) {
    resolved.resourcesDir = config.resourcesDir
  }

  // Copy CLI-only args
  if (args.port !== undefined) {
    resolved.port = args.port
  }
  if (args.host !== undefined) {
    resolved.host = args.host
  }
  if (args.open !== undefined) {
    resolved.open = args.open
  }
  if (args.outDir !== undefined) {
    resolved.outDir = args.outDir
  }

  return resolved
}
