#!/usr/bin/env tsx
/**
 * Storybook Coverage Audit Script
 *
 * Audits which shadmin components have Storybook stories and which don't.
 * Exits with code 1 if coverage is below the threshold.
 */

import { glob } from 'glob'
import { dirname, basename, relative, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SHADMIN_SRC = join(__dirname, '../packages/shadmin/src')

// Coverage threshold (percentage)
const COVERAGE_THRESHOLD = 80

async function auditStorybookCoverage() {
  // Find all component files in src/components
  // Exclude test files, story files, spec files, and index files
  const components = await glob('components/**/*.tsx', {
    cwd: SHADMIN_SRC,
    ignore: [
      '**/*.spec.tsx',
      '**/*.spec.ts',
      '**/*.test.tsx',
      '**/*.test.ts',
      '**/*.stories.tsx',
      '**/*.stories.ts',
      '**/index.ts',
      '**/index.tsx',
      // Exclude UI primitives (shadcn components)
      'components/ui/**',
    ],
  })

  // Find all story files
  const stories = await glob('**/*.stories.tsx', {
    cwd: SHADMIN_SRC,
  })

  // Create a map of directories that have stories
  // Stories often cover multiple components in a directory
  // e.g., Field.stories.tsx covers TextField, NumberField, etc.
  const directoriesWithStories = new Set<string>()
  const componentToStory = new Map<string, string>()

  for (const story of stories) {
    const storyDir = dirname(story)
    const storyBase = basename(story, '.stories.tsx')

    // Direct component match (e.g., Button.stories.tsx -> Button.tsx)
    const directMatch = story.replace('.stories.tsx', '.tsx')
    if (components.includes(directMatch)) {
      componentToStory.set(directMatch, story)
    }

    // Directory-level coverage (e.g., Field.stories.tsx covers all in field/)
    directoriesWithStories.add(storyDir)
  }

  // Categorize components
  const covered: string[] = []
  const uncovered: string[] = []

  for (const component of components) {
    const componentDir = dirname(component)

    // Check if component has direct story or is in a directory with stories
    if (componentToStory.has(component)) {
      covered.push(component)
    } else if (directoriesWithStories.has(componentDir)) {
      covered.push(component)
    } else {
      uncovered.push(component)
    }
  }

  // Calculate coverage
  const totalComponents = components.length
  const coveredCount = covered.length
  const uncoveredCount = uncovered.length
  const coveragePercent =
    totalComponents > 0 ? (coveredCount / totalComponents) * 100 : 0

  // Print report
  console.log('')
  console.log('='.repeat(60))
  console.log('           STORYBOOK COVERAGE REPORT')
  console.log('='.repeat(60))
  console.log('')
  console.log(`Total components:  ${totalComponents}`)
  console.log(`Covered:           ${coveredCount}`)
  console.log(`Missing:           ${uncoveredCount}`)
  console.log(`Coverage:          ${coveragePercent.toFixed(1)}%`)
  console.log('')

  // Group uncovered by directory for better readability
  if (uncoveredCount > 0) {
    console.log('-'.repeat(60))
    console.log('Components missing stories:')
    console.log('-'.repeat(60))

    const byDirectory = new Map<string, string[]>()
    for (const comp of uncovered.sort()) {
      const dir = dirname(comp)
      if (!byDirectory.has(dir)) {
        byDirectory.set(dir, [])
      }
      byDirectory.get(dir)!.push(basename(comp))
    }

    for (const [dir, files] of [...byDirectory.entries()].sort()) {
      console.log(`\n  ${dir}/`)
      for (const file of files) {
        console.log(`    - ${file}`)
      }
    }
    console.log('')
  }

  // List stories found
  console.log('-'.repeat(60))
  console.log('Existing stories:')
  console.log('-'.repeat(60))
  for (const story of stories.sort()) {
    console.log(`  - ${story}`)
  }
  console.log('')

  // Exit with appropriate code
  console.log('='.repeat(60))
  if (coveragePercent < COVERAGE_THRESHOLD) {
    console.log(
      `FAIL: Coverage ${coveragePercent.toFixed(1)}% is below ${COVERAGE_THRESHOLD}% threshold`
    )
    console.log('='.repeat(60))
    process.exit(1)
  } else {
    console.log(
      `PASS: Coverage ${coveragePercent.toFixed(1)}% meets ${COVERAGE_THRESHOLD}% threshold`
    )
    console.log('='.repeat(60))
    process.exit(0)
  }
}

// Run the audit
auditStorybookCoverage().catch((error) => {
  console.error('Error running audit:', error)
  process.exit(1)
})
