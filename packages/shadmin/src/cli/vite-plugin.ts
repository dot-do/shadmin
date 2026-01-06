/**
 * @file vite-plugin.ts
 * @description Vite Plugin for shadmin CLI - provides virtual modules and HMR
 */

import { join } from 'path'
import { existsSync } from 'fs'
import type { Plugin, HmrContext, ViteDevServer, IndexHtmlTransformContext } from 'vite'
import { scanResources } from './scanner'
import { generateEntryPoint, type GeneratorOptions } from './generator'

/** Virtual module IDs */
const VIRTUAL_APP_ID = 'virtual:shadmin-app'
const VIRTUAL_ENTRY_ID = 'virtual:shadmin-entry'
const RESOLVED_VIRTUAL_APP_ID = '\0virtual:shadmin-app'
const RESOLVED_VIRTUAL_ENTRY_ID = '\0virtual:shadmin-entry'

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
 */
function generateEntryModule(): string {
  return `import { createRoot } from 'react-dom/client'
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
export function shadminPlugin(options: ShadminPluginOptions): Plugin {
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
          dataProviderImport: resolvedDataProviderImport,
          authProviderImport,
          layoutImport,
          dashboardImport,
          basename,
        }

        return generateEntryPoint(resources, generatorOptions)
      }

      if (id === RESOLVED_VIRTUAL_ENTRY_ID) {
        return generateEntryModule()
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
    transformIndexHtml(html: string, ctx: IndexHtmlTransformContext) {
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
