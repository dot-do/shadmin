import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [
        /^node:/,
        'commander',
        'prompts',
        'picocolors',
        'fs',
        'path',
        'url',
        'child_process',
      ],
      output: {
        banner: '#!/usr/bin/env node',
      },
    },
    ssr: true,
    sourcemap: true,
    minify: false,
    target: 'node20',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
