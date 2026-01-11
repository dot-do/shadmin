/**
 * @file cli/index.ts
 * @description CLI module exports for shadmin
 */

export { scanResources, type ResourceDefinition, type ScanOptions } from './scanner'
export {
  generateImports,
  generateResourceConfig,
  generateEntryPoint,
  type GeneratorOptions,
} from './generator'
export { shadminPlugin, type ShadminPluginOptions, type MdxOptions } from './vite-plugin'
export {
  parseArgs,
  createViteConfig,
  manualChunks,
  type CLIArgs,
  type CLICommand,
  type ViteConfigOptions,
} from './commands'
export {
  loadConfig,
  validateConfig,
  resolveConfigPath,
  mergeConfigWithArgs,
  parseConfigModule,
  defineConfig,
  type ShadminConfig,
  type ConfigEnv,
  type ConfigExport,
  type ResolvedConfig,
  type ValidationResult,
} from './config'
export {
  EXAMPLE_TEMPLATES,
  getTemplateFiles,
  shouldShowInteractiveMenu,
  type ExampleTemplate,
  type InteractiveMenuOptions,
} from './interactive'
export { showInteractiveMenu, InteractiveMenu } from './InteractiveMenu'
export {
  extractTranslationKeys,
  formatExtractionResult,
  type TranslationKey,
  type ExtractionResult,
  type ExtractorOptions,
} from './translation-extractor'
