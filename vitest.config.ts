import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Dedupe React to prevent "Invalid hook call" errors from duplicate React instances.
// This is a nested pnpm workspace (shadmin is a workspace inside ui), which creates
// duplicate React installations in both .pnpm stores. We must force ALL React imports
// to resolve to the SAME physical location.
//
// The problem: Code in packages/shadmin/packages/shadmin/src/ resolves React from
// the local node_modules/.pnpm store, but testing-library and other devDependencies
// may resolve from the parent ui workspace's store. We need to force everything
// to use the SAME React instance.

const __dirname = path.dirname(new URL(import.meta.url).pathname)

// Use the shadmin workspace's React (where the actual source code resolves from)
// This is the React that components will use at runtime
const localNodeModules = path.resolve(__dirname, 'node_modules')

// Helper to find actual package path in pnpm store
function findPackageInPnpmStore(packageName: string): string {
  const pnpmStore = path.join(localNodeModules, '.pnpm')

  // Find directory matching the package pattern (e.g., react@19.2.3, react-dom@19.2.3_react@19.2.3)
  // pnpm uses format: {package}@{version} or {package}@{version}_{peer}@{peerVersion}
  const dirs = fs.readdirSync(pnpmStore)
  const packageDir = dirs.find(d => d.startsWith(`${packageName}@`))

  if (!packageDir) {
    throw new Error(`Could not find ${packageName} in pnpm store: ${pnpmStore}`)
  }

  return path.join(pnpmStore, packageDir, 'node_modules', packageName)
}

// Resolve to the actual pnpm store locations for the shadmin workspace
const reactPath = findPackageInPnpmStore('react')
const reactDomPath = findPackageInPnpmStore('react-dom')
// scheduler is a transitive dependency, find it in react-dom's peer folder
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
    // Benchmark configuration
    benchmark: {
      include: ['packages/**/benchmarks/**/*.bench.{ts,tsx}'],
      reporters: ['default'],
    },
  },
})
