import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
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
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Shadmin',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
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
      ],
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
