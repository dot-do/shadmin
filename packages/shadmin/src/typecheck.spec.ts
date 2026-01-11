/**
 * Typecheck Test - TDD RED Phase
 *
 * This test verifies that the shadmin package passes TypeScript type checking.
 * It is currently expected to FAIL with 486+ errors.
 *
 * Root Cause:
 * - Generic/JSX ambiguity in .tsx files (e.g., `<T,>` parsed as JSX)
 * - Missing module declarations (@dotdo/client)
 * - Strict type checking issues (exactOptionalPropertyTypes)
 *
 * Key Files with Issues:
 * - src/dotdo-react/provider.tsx:107 - Cannot find module '@dotdo/client'
 * - src/dotdo-react/provider.tsx:259-261 - Callback type mismatches
 * - src/dotdo-react/provider.tsx:335 - exactOptionalPropertyTypes issue
 * - Many .spec.ts files with 'Object is possibly undefined' errors
 *
 * @see shadmin-4p61 - RED phase issue
 * @see shadmin-f530 - GREEN phase fix (depends on this test)
 */

import { describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(__dirname, '..')

describe('TypeScript Type Checking', () => {
  it('should pass typecheck with zero errors', () => {
    let exitCode = 0
    let errorCount = 0
    let stdout = ''

    try {
      // Run tsc --noEmit and capture output
      const result = execSync('npx tsc --noEmit 2>&1', {
        cwd: packageRoot,
        encoding: 'utf-8',
        timeout: 60000, // 60 second timeout
      })
      stdout = result
    } catch (error: unknown) {
      // tsc returns exit code 2 on errors
      const execError = error as { status?: number; stdout?: string; stderr?: string }
      exitCode = execError.status ?? 1
      stdout = execError.stdout ?? ''

      // Count TypeScript errors in output
      const errorMatches = stdout.match(/error TS\d+/g)
      errorCount = errorMatches?.length ?? 0
    }

    // Document the current failure state
    if (errorCount > 0) {
      console.log(`\n[TDD RED] Typecheck failed with ${errorCount} TypeScript errors`)
      console.log('This is expected in the RED phase. GREEN phase will fix these errors.')
      console.log('\nSample errors (first 10 lines):')
      console.log(stdout.split('\n').slice(0, 10).join('\n'))
    }

    // This assertion should PASS after GREEN phase fixes
    // Currently it will FAIL with 486+ errors
    expect(exitCode, `tsc exited with code ${exitCode}, expected 0 (${errorCount} errors found)`).toBe(0)
    expect(errorCount, `Found ${errorCount} TypeScript errors, expected 0`).toBe(0)
  })

  it('should document current error count for tracking progress', () => {
    let errorCount = 0

    try {
      execSync('npx tsc --noEmit 2>&1', {
        cwd: packageRoot,
        encoding: 'utf-8',
        timeout: 60000,
      })
    } catch (error: unknown) {
      const execError = error as { stdout?: string }
      const stdout = execError.stdout ?? ''
      const errorMatches = stdout.match(/error TS\d+/g)
      errorCount = errorMatches?.length ?? 0
    }

    // Document the current state - this test is informational
    // In RED phase: expect many errors
    // After GREEN phase: expect 0 errors
    console.log(`\n[Progress Tracking] Current TypeScript errors: ${errorCount}`)

    // Track that we have documented the error count
    // This test passes as long as we successfully counted
    expect(errorCount).toBeGreaterThanOrEqual(0)

    // Snapshot the current error count for reference
    // RED phase expects 486 errors (as of 2026-01-10)
    // This number should decrease as fixes are applied
    const EXPECTED_ERRORS_RED_PHASE = 486
    if (errorCount >= EXPECTED_ERRORS_RED_PHASE) {
      console.log(`[RED PHASE CONFIRMED] Error count (${errorCount}) matches or exceeds expected (${EXPECTED_ERRORS_RED_PHASE})`)
    } else if (errorCount > 0) {
      console.log(`[PROGRESS] Error count reduced from ${EXPECTED_ERRORS_RED_PHASE} to ${errorCount}`)
    } else {
      console.log('[GREEN PHASE COMPLETE] All TypeScript errors resolved!')
    }
  })
})
