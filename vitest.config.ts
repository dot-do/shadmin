import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'packages/shadmin/src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // CLI tests need node environment (no DOM, works with esbuild)
    environmentMatchGlobs: [
      ['packages/shadmin/src/cli/**/*.spec.ts', 'node'],
    ],
    setupFiles: ['./packages/shadmin/src/test-utils/setup.ts'],
    include: ['packages/**/*.spec.{ts,tsx}', 'packages/**/*.test.{ts,tsx}'],
    // Resource optimization
    // Vitest 4: poolOptions moved to top-level (maxForks/minForks → maxWorkers/minWorkers)
    pool: 'forks',
    maxWorkers: 2,
    minWorkers: 1,
    maxConcurrency: 5,
    fileParallelism: false,
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 5000,
    isolate: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/**/src/**/*.{ts,tsx}'],
      exclude: ['**/*.spec.{ts,tsx}', '**/*.test.{ts,tsx}', '**/index.ts'],
    },
  },
})
