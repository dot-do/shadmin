/**
 * @file vite-plugin.ts
 * @description Vite Plugin for shadmin CLI - provides virtual modules and HMR
 */

import { join } from 'path'
import { existsSync } from 'fs'
import { transform } from 'esbuild'
import type { Plugin, HmrContext, ViteDevServer, IndexHtmlTransformContext } from 'vite'
import { scanResources } from './scanner'
import { generateEntryPoint, type GeneratorOptions } from './generator'

/** Virtual module IDs */
const VIRTUAL_APP_ID = 'virtual:shadmin-app'
const VIRTUAL_ENTRY_ID = 'virtual:shadmin-entry'
// .tsx extension required for Vite to parse JSX correctly
const RESOLVED_VIRTUAL_APP_ID = '\0virtual:shadmin-app.tsx'
const RESOLVED_VIRTUAL_ENTRY_ID = '\0virtual:shadmin-entry.tsx'

/**
 * MDX compilation options
 */
export interface MdxOptions {
  /** Remark plugins for MDX processing */
  remarkPlugins?: unknown[]
  /** Rehype plugins for MDX processing */
  rehypePlugins?: unknown[]
}

/**
 * Options for the shadmin Vite plugin
 */
export interface ShadminPluginOptions {
  /** Root directory to scan for resources */
  root: string
  /** Custom resources directory name (default: 'resources') */
  resourcesDir?: string
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
  /** MDX compilation options */
  mdxOptions?: MdxOptions
}

/**
 * Generates the entry module code that bootstraps React
 * Note: React import required for classic JSX transform (React.createElement)
 */
function generateEntryModule(): string {
  return `import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from 'virtual:shadmin-app'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<App />)
}
`
}

/**
 * Generates the index.html template for production builds
 *
 * @param title - Optional page title (defaults to 'Shadmin')
 * @returns Complete HTML string
 */
function generateIndexHtml(title: string = 'Shadmin'): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <script type="module" src="virtual:shadmin-entry"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
}

/**
 * Creates a Vite plugin for shadmin
 *
 * @param options - Plugin configuration options
 * @returns Vite plugin
 *
 * @example
 * ```typescript
 * import { shadminPlugin } from 'shadmin/cli'
 *
 * export default defineConfig({
 *   plugins: [shadminPlugin({ root: process.cwd() })]
 * })
 * ```
 */
export function shadminPlugin(options: ShadminPluginOptions): Plugin & { generateIndexHtml: typeof generateIndexHtml } {
  const {
    root,
    resourcesDir,
    dataProviderImport,
    authProviderImport,
    layoutImport,
    dashboardImport,
    basename,
  } = options

  const resourcesDirPath = join(root, resourcesDir || 'resources')

  return {
    name: 'shadmin',

    /**
     * Resolve virtual module IDs
     */
    resolveId(id: string) {
      if (id === VIRTUAL_APP_ID) {
        return RESOLVED_VIRTUAL_APP_ID
      }
      if (id === VIRTUAL_ENTRY_ID) {
        return RESOLVED_VIRTUAL_ENTRY_ID
      }
      return null
    },

    /**
     * Load virtual module content
     * Uses esbuild to transform JSX to JS for Vite compatibility
     */
    async load(id: string) {
      if (id === RESOLVED_VIRTUAL_APP_ID) {
        const scanOptions = resourcesDir ? { resourcesDir } : {}
        const resources = await scanResources(root, scanOptions)

        // Auto-detect data-provider.ts if not explicitly configured
        let resolvedDataProviderImport = dataProviderImport
        if (!resolvedDataProviderImport) {
          const dataProviderPath = join(root, 'data-provider.ts')
          if (existsSync(dataProviderPath)) {
            resolvedDataProviderImport = './data-provider'
          }
        }

        const generatorOptions: GeneratorOptions = {
          ...(resolvedDataProviderImport !== undefined && { dataProviderImport: resolvedDataProviderImport }),
          ...(authProviderImport !== undefined && { authProviderImport }),
          ...(layoutImport !== undefined && { layoutImport }),
          ...(dashboardImport !== undefined && { dashboardImport }),
          ...(basename !== undefined && { basename }),
        }

        const jsxCode = generateEntryPoint(resources, generatorOptions)

        // Transform JSX to JS using esbuild with classic transform
        // Classic transform uses React.createElement() instead of jsx() from react/jsx-runtime
        // This avoids module resolution issues with virtual modules
        const result = await transform(jsxCode, {
          loader: 'tsx',
          jsx: 'transform',
          jsxFactory: 'React.createElement',
          jsxFragment: 'React.Fragment',
          format: 'esm',
        })

        return result.code
      }

      if (id === RESOLVED_VIRTUAL_ENTRY_ID) {
        const jsxCode = generateEntryModule()

        // Transform JSX to JS using esbuild with classic transform
        const result = await transform(jsxCode, {
          loader: 'tsx',
          jsx: 'transform',
          jsxFactory: 'React.createElement',
          jsxFragment: 'React.Fragment',
          format: 'esm',
        })

        return result.code
      }

      return undefined
    },

    /**
     * Handle HMR for resource files
     */
    handleHotUpdate(ctx: HmrContext) {
      const { file, server } = ctx

      // Check if the changed file is in the resources directory
      if (file.startsWith(resourcesDirPath)) {
        // Trigger full reload to regenerate the virtual module
        server.ws.send({
          type: 'full-reload',
          path: '*',
        })
        return []
      }

      return undefined
    },

    /**
     * Configure Vite with shadmin defaults
     */
    config() {
      return {
        resolve: {
          alias: {
            // Allow importing from 'virtual:shadmin-app'
          },
        },
        optimizeDeps: {
          include: ['react', 'react-dom', 'shadmin'],
        },
      }
    },

    /**
     * Configure dev server to serve index.html
     */
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use((req, res, next) => {
          // Serve generated index.html for root path
          if (req.url === '/' || req.url === '/index.html') {
            res.setHeader('Content-Type', 'text/html')
            res.end(generateIndexHtml())
            return
          }
          next()
        })
      }
    },

    /**
     * Transform index.html for production builds
     */
    transformIndexHtml(html: string, _ctx: IndexHtmlTransformContext) {
      // For production builds, ensure proper meta tags are present
      let transformedHtml = html

      // Add viewport meta if missing
      if (!transformedHtml.includes('viewport')) {
        transformedHtml = transformedHtml.replace(
          '<head>',
          '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />'
        )
      }

      // Add title if missing
      if (!transformedHtml.includes('<title>')) {
        transformedHtml = transformedHtml.replace(
          '</head>',
          '    <title>Shadmin</title>\n  </head>'
        )
      }

      return transformedHtml
    },

    /**
     * Generate index.html function exposed for testing
     */
    generateIndexHtml,
  }
}
