#!/usr/bin/env bun
/**
 * @file bin.ts
 * @description CLI entry point for shadmin
 *
 * Usage:
 *   npx shadmin              # Start dev server (interactive if no resources)
 *   npx shadmin ./my-app     # Start dev server in ./my-app
 *   npx shadmin build        # Build for production
 *   npx shadmin preview      # Preview production build
 */

import { createServer, build, preview } from 'vite'
import { parseArgs, createViteConfig } from './commands'
import { scanResources } from './scanner'
import { shouldShowInteractiveMenu } from './interactive'
import { showInteractiveMenu } from './InteractiveMenu'
import { extractTranslationKeys, formatExtractionResult } from './translation-extractor'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')
const VERSION = pkg.version

const HELP_TEXT = `
shadmin - Zero-config admin runner

Usage:
  shadmin [command] [root] [options]

Commands:
  dev                   Start development server (default)
  build                 Build for production
  preview               Preview production build
  init                  Initialize with example template (interactive)
  extract-translations  Extract translation keys from source files
  help                  Show this help message
  version               Show version number

Options:
  -p, --port <port>    Port number (default: 5173)
  --host [host]        Expose to network (default: localhost)
  -o, --open           Open browser on start
  --root <path>        Root directory (default: .)
  -c, --config <path>  Path to shadmin config file
  --outDir <dir>       Output directory for build (default: dist)
  -h, --help           Show help
  -v, --version        Show version

Extract Translations Options:
  -f, --format <fmt>   Output format: json or po (default: json)
  -O, --output <path>  Write output to file instead of stdout

Examples:
  shadmin                   # Dev server (shows menu if no resources)
  shadmin ./my-admin        # Dev server in ./my-admin
  shadmin -p 3000 -o        # Dev server on port 3000, open browser
  shadmin init              # Interactive template selection
  shadmin build             # Build for production
  shadmin preview           # Preview production build
  shadmin extract-translations              # Extract keys as JSON to stdout
  shadmin extract-translations -f po        # Extract keys as PO format
  shadmin extract-translations -O keys.json # Write to file
`

async function main() {
  const args = parseArgs(process.argv.slice(2))

  switch (args.command) {
    case 'help':
      console.log(HELP_TEXT)
      process.exit(0)
      break

    case 'version':
      console.log(`shadmin v${VERSION}`)
      process.exit(0)
      break

    case 'dev': {
      // Check if we should show interactive menu
      const resources = await scanResources(args.root)
      const isCI = process.env.CI === 'true' || process.env.CI === '1'

      if (shouldShowInteractiveMenu(resources, { isCI })) {
        console.log('')  // Add spacing
        const templateId = await showInteractiveMenu(args.root)

        if (!templateId) {
          console.log('\nExiting...')
          process.exit(0)
        }

        console.log(`\n✓ Created ${templateId} example in ${args.root}`)
        console.log('\nStarting dev server...\n')
      }

      const config = createViteConfig(args)
      const server = await createServer(config)
      await server.listen()
      server.printUrls()
      break
    }

    case 'build': {
      const config = createViteConfig(args)
      await build(config)
      console.log('Build complete!')
      break
    }

    case 'preview': {
      const config = createViteConfig(args)
      const server = await preview(config)
      server.printUrls()
      break
    }

    case 'extract-translations': {
      const format = args.format || 'json'
      const result = await extractTranslationKeys({
        rootDir: args.root,
        format,
        ...(args.output && { output: args.output }),
      })

      // If output file specified, we've already written to it
      if (args.output) {
        console.log(`Extracted ${result.keys.length} translation keys from ${result.filesScanned} files`)
        console.log(`Output written to: ${args.output}`)
      } else {
        // Print to stdout
        console.log(formatExtractionResult(result, format))
      }

      // Report errors if any
      if (result.errors.length > 0) {
        console.error('\nWarning: Some files had parsing errors:')
        for (const err of result.errors) {
          console.error(`  ${err.file}: ${err.error}`)
        }
      }
      break
    }
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
