import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createRequire } from 'module'

// Create a require function for ESM context to use require.resolve
const require = createRequire(import.meta.url)

// Dedupe React to prevent "Invalid hook call" errors from duplicate React instances
// This is a nested pnpm workspace (shadmin is a workspace inside ui), which creates
// duplicate React installations in both .pnpm stores. We must force ALL React imports
// to resolve to the SAME physical location.

// Dynamically resolve React paths to avoid hardcoding versions.
// require.resolve finds the actual installed package location in node_modules,
// then we get the directory containing that package.
const reactPath = path.dirname(require.resolve('react/package.json'))
const reactDomPath = path.dirname(require.resolve('react-dom/package.json'))
// scheduler is a transitive dependency of react-dom, symlinked in its node_modules
const schedulerPath = path.resolve(reactDomPath, '../scheduler')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'packages/shadmin/src'),
      // Force all React imports to use the local pnpm store's installations
      // These are installed together and share the same React internals
      'react': reactPath,
      'react-dom': reactDomPath,
      'react/jsx-runtime': path.join(reactPath, 'jsx-runtime'),
      'react/jsx-dev-runtime': path.join(reactPath, 'jsx-dev-runtime'),
      'react-dom/client': path.join(reactDomPath, 'client'),
      'react-dom/test-utils': path.join(reactDomPath, 'test-utils'),
      'scheduler': schedulerPath,
    },
    // Dedupe ensures dependencies that import React use our single instance
    dedupe: ['react', 'react-dom', 'scheduler'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // CLI tests need node environment (no DOM, works with esbuild)
    environmentMatchGlobs: [
      ['packages/shadmin/src/cli/**/*.spec.ts', 'node'],
      ['db/**/*.test.ts', 'node'],
    ],
    setupFiles: ['./packages/shadmin/src/test-utils/setup.ts'],
    include: ['packages/**/*.spec.{ts,tsx}', 'packages/**/*.test.{ts,tsx}', 'db/**/*.test.{ts,tsx}'],
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
