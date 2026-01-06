import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    // CLI tests need node environment (no DOM, works with esbuild)
    environmentMatchGlobs: [
      ['src/cli/**/*.spec.ts', 'node'],
    ],
    setupFiles: ['./src/test-utils/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    // Memory/CPU optimization settings
    pool: 'forks', // Use forks instead of threads for better memory isolation
    poolOptions: {
      forks: {
        maxForks: 4, // Limit parallel processes
        minForks: 1,
        isolate: true, // Keep test isolation for reliability
      },
    },
    maxConcurrency: 5, // Limit concurrent tests within a file
    fileParallelism: true, // Can be set to false for even lower memory usage
    testTimeout: 10000, // 10s timeout per test
    hookTimeout: 10000, // 10s timeout for hooks
    teardownTimeout: 5000, // 5s for cleanup
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/test-utils/**',
        'src/**/*.d.ts',
        'src/**/index.ts',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
    typecheck: {
      enabled: false,
      tsconfig: './tsconfig.json',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
