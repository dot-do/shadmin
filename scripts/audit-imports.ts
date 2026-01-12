#!/usr/bin/env tsx
/**
 * Direct Import Audit Script
 *
 * Scans for direct imports from 'ra-core' or 'react-admin' that bypass
 * the shadmin facade layer. Only files in src/facade/ are allowed to
 * import directly from these packages.
 *
 * Usage:
 *   pnpm audit:imports
 *   npx tsx scripts/audit-imports.ts
 *
 * Exit codes:
 *   0 - No violations found
 *   1 - Violations found (or error)
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SHADMIN_SRC = join(__dirname, '../packages/shadmin/src')

// Packages that should only be imported from the facade layer
const FORBIDDEN_PACKAGES = ['ra-core', 'react-admin']

// Directories that are ALLOWED to import from forbidden packages
// (the facade layer itself)
const ALLOWED_DIRECTORIES = ['facade']

// File extensions to scan
const EXTENSIONS = ['.ts', '.tsx']

// Patterns to match import statements (on the whole file, handles multi-line)
// These patterns find the from clause which contains the package name
const IMPORT_FROM_PATTERNS = [
  // from 'package' (captures package name and the line it's on)
  /from\s+['"]([^'"]+)['"]/g,
  // require('package')
  /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
]

interface Violation {
  file: string
  line: number
  lineContent: string
  package: string
}

/**
 * Recursively find all TypeScript files in a directory
 */
function findFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      // Skip node_modules and test directories
      if (entry === 'node_modules' || entry === '__tests__') continue
      findFiles(fullPath, files)
    } else if (stat.isFile() && EXTENSIONS.some((ext) => entry.endsWith(ext))) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Check if a file is in an allowed directory
 */
function isInAllowedDirectory(filePath: string): boolean {
  const relativePath = relative(SHADMIN_SRC, filePath)
  return ALLOWED_DIRECTORIES.some(
    (dir) => relativePath.startsWith(dir + '/') || relativePath.startsWith(dir + '\\')
  )
}

/**
 * Check if an import is from a forbidden package
 */
function isForbiddenPackage(importPath: string): string | null {
  for (const pkg of FORBIDDEN_PACKAGES) {
    // Match exact package name or subpath imports
    if (importPath === pkg || importPath.startsWith(`${pkg}/`)) {
      return pkg
    }
  }
  return null
}

/**
 * Find the line number for a given character index in the file
 */
function getLineNumber(content: string, charIndex: number): number {
  return content.substring(0, charIndex).split('\n').length
}

/**
 * Get the line content at a specific line number
 */
function getLineContent(lines: string[], lineNumber: number): string {
  return lines[lineNumber - 1]?.trim() || ''
}

/**
 * Check if a position in the file is inside a comment
 */
function isInComment(content: string, position: number): boolean {
  // Check for single-line comment
  const lineStart = content.lastIndexOf('\n', position) + 1
  const lineUpToPos = content.substring(lineStart, position)
  if (lineUpToPos.includes('//')) {
    return true
  }

  // Check for multi-line comment
  const beforePos = content.substring(0, position)
  const lastCommentStart = beforePos.lastIndexOf('/*')
  const lastCommentEnd = beforePos.lastIndexOf('*/')
  if (lastCommentStart > lastCommentEnd) {
    return true
  }

  return false
}

/**
 * Scan a file for forbidden imports
 */
function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = []
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // Skip files in allowed directories
  if (isInAllowedDirectory(filePath)) {
    return violations
  }

  // Check each pattern against the full content (handles multi-line imports)
  for (const pattern of IMPORT_FROM_PATTERNS) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0

    let match
    while ((match = pattern.exec(content)) !== null) {
      const importPath = match[1]
      const matchPosition = match.index

      // Skip if inside a comment
      if (isInComment(content, matchPosition)) {
        continue
      }

      const forbiddenPkg = isForbiddenPackage(importPath)

      if (forbiddenPkg) {
        const lineNumber = getLineNumber(content, matchPosition)
        violations.push({
          file: filePath,
          line: lineNumber,
          lineContent: getLineContent(lines, lineNumber),
          package: forbiddenPkg,
        })
      }
    }
  }

  return violations
}

/**
 * Main audit function
 */
async function auditImports() {
  console.log('')
  console.log('='.repeat(70))
  console.log('              DIRECT IMPORT AUDIT')
  console.log('='.repeat(70))
  console.log('')
  console.log(`Scanning: ${SHADMIN_SRC}`)
  console.log(`Forbidden packages: ${FORBIDDEN_PACKAGES.join(', ')}`)
  console.log(`Allowed directories: ${ALLOWED_DIRECTORIES.join(', ')}`)
  console.log('')

  // Find all files
  const files = findFiles(SHADMIN_SRC)
  console.log(`Found ${files.length} TypeScript files to scan`)
  console.log('')

  // Scan all files
  const allViolations: Violation[] = []
  for (const file of files) {
    const violations = scanFile(file)
    allViolations.push(...violations)
  }

  // Group violations by file
  const byFile = new Map<string, Violation[]>()
  for (const violation of allViolations) {
    const relativePath = relative(SHADMIN_SRC, violation.file)
    if (!byFile.has(relativePath)) {
      byFile.set(relativePath, [])
    }
    byFile.get(relativePath)!.push(violation)
  }

  // Print results
  if (allViolations.length === 0) {
    console.log('-'.repeat(70))
    console.log('No violations found!')
    console.log('-'.repeat(70))
    console.log('')
    console.log('='.repeat(70))
    console.log('PASS: All imports go through the facade layer')
    console.log('='.repeat(70))
    process.exit(0)
  }

  // Print violations
  console.log('-'.repeat(70))
  console.log(`Found ${allViolations.length} violation(s) in ${byFile.size} file(s):`)
  console.log('-'.repeat(70))
  console.log('')

  for (const [file, violations] of [...byFile.entries()].sort()) {
    console.log(`${file}:`)
    for (const v of violations) {
      console.log(`  Line ${v.line}: import from '${v.package}'`)
      console.log(`    ${v.lineContent}`)
    }
    console.log('')
  }

  // Print summary
  console.log('-'.repeat(70))
  console.log('Summary by package:')
  console.log('-'.repeat(70))

  const byPackage = new Map<string, number>()
  for (const v of allViolations) {
    byPackage.set(v.package, (byPackage.get(v.package) || 0) + 1)
  }

  for (const [pkg, count] of [...byPackage.entries()].sort()) {
    console.log(`  ${pkg}: ${count} violation(s)`)
  }

  console.log('')
  console.log('-'.repeat(70))
  console.log('How to fix:')
  console.log('-'.repeat(70))
  console.log('')
  console.log('Instead of:')
  console.log("  import { useRecordContext } from 'ra-core'")
  console.log('')
  console.log('Use:')
  console.log("  import { useRecordContext } from '../facade'")
  console.log('')
  console.log('The facade layer in src/facade/ provides all necessary ra-core exports.')
  console.log('')

  console.log('='.repeat(70))
  console.log('FAIL: Direct imports bypass the facade layer')
  console.log('='.repeat(70))
  process.exit(1)
}

// Run the audit
auditImports().catch((error) => {
  console.error('Error running audit:', error)
  process.exit(1)
})
