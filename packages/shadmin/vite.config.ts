import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// Entry points for tree-shakable subpath exports
const entries = {
  index: resolve(__dirname, 'src/index.ts'),
  // Component subpaths (granular)
  'components/list': resolve(__dirname, 'src/components/list/index.ts'),
  'components/form': resolve(__dirname, 'src/components/form/index.ts'),
  'components/field': resolve(__dirname, 'src/components/field/index.ts'),
  'components/input': resolve(__dirname, 'src/components/input/index.ts'),
  'components/layout': resolve(__dirname, 'src/components/layout/index.ts'),
  'components/edit': resolve(__dirname, 'src/components/edit/index.ts'),
  'components/create': resolve(__dirname, 'src/components/create/index.ts'),
  'components/show': resolve(__dirname, 'src/components/show/index.ts'),
  'components/auth': resolve(__dirname, 'src/components/auth/index.ts'),
  'components/buttons': resolve(__dirname, 'src/components/buttons/index.ts'),
  'components/menu': resolve(__dirname, 'src/components/menu/index.ts'),
  'components/core': resolve(__dirname, 'src/components/core/index.ts'),
  'components/feedback': resolve(__dirname, 'src/components/feedback/index.ts'),
  // Aggregated components subpath
  components: resolve(__dirname, 'src/components/index.ts'),
  // Hooks and contexts subpaths
  hooks: resolve(__dirname, 'src/hooks/index.ts'),
  contexts: resolve(__dirname, 'src/contexts/index.ts'),
  // Types subpath (type-only imports)
  types: resolve(__dirname, 'src/types/index.ts'),
  // Integration subpaths
  dotdo: resolve(__dirname, 'src/dotdo/index.ts'),
  'dotdo-react': resolve(__dirname, 'src/dotdo-react/index.ts'),
  // Utilities and errors
  utils: resolve(__dirname, 'src/utils/index.ts'),
  errors: resolve(__dirname, 'src/errors/index.ts'),
}

// Common external dependencies
const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react-hook-form',
  'react-router',
  'react-router-dom',
  '@tanstack/react-query',
  '@tanstack/react-table',
  'lodash-es',
  'zod',
  'vitest',
  // ra-core and its dependencies
  'ra-core',
  'date-fns',
  'eventemitter3',
  'inflection',
  'jsonexport',
  'lodash',
  'query-string',
  'react-error-boundary',
  'react-is',
  // dotdo integration dependencies
  '@dotdo/client',
]

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setup.ts'],
    include: ['src/**/*.spec.{ts,tsx}'],
    globals: true,
  },
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.spec.tsx', 'src/test-utils/**/*'],
      outDir: 'dist',
      rollupTypes: false, // Disabled due to ra-core re-export issues
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: entries,
      name: 'Shadmin',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs'
        return `${entryName}.${ext}`
      },
    },
    rollupOptions: {
      external,
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        preserveModules: false,
      },
    },
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
