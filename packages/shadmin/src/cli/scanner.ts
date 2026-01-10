/**
 * @file scanner.ts
 * @description File Scanner for shadmin CLI - discovers resource files
 */

import { existsSync } from 'fs'
import { readdir, readFile, stat } from 'fs/promises'
import { join, basename, extname, relative, dirname } from 'path'

/**
 * Represents a discovered resource definition
 */
export interface ResourceDefinition {
  /** Resource name (from export or inferred from filename) */
  name: string
  /** Absolute path to the resource file */
  filePath: string
  /** Relative import path for code generation */
  importPath: string
  /** Which CRUD components are exported */
  hasComponent: {
    list: boolean
    edit: boolean
    show: boolean
    create: boolean
    icon: boolean
  }
  /** Additional exports detected */
  hasExport: {
    recordRepresentation: boolean
    options: boolean
  }
  /** Validation warnings */
  warnings: string[]
  /** Whether this is an MDX file */
  isMdx: boolean
}

/**
 * Options for the resource scanner
 */
export interface ScanOptions {
  /** Resource directory name (default: 'resources') */
  resourcesDir?: string
  /** File extensions to scan (default: ['.tsx', '.jsx']) */
  extensions?: string[]
}

/** Default options */
const DEFAULT_OPTIONS: Required<ScanOptions> = {
  resourcesDir: 'resources',
  extensions: ['.tsx', '.jsx', '.mdx'],
}

/**
 * Parses YAML frontmatter from MDX content
 * Returns an object with frontmatter values and the content without frontmatter
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?/
  const match = content.match(frontmatterRegex)

  const frontmatterText = match?.[1]
  if (!match || !frontmatterText) {
    return { frontmatter: {}, body: content }
  }

  const body = content.slice(match[0].length)
  const frontmatter: Record<string, string> = {}

  // Parse simple YAML key: value pairs
  const lines = frontmatterText.split('\n')
  for (const line of lines) {
    if (line) {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim()
        const value = line.slice(colonIndex + 1).trim()
        frontmatter[key] = value
      }
    }
  }

  return { frontmatter, body }
}

/**
 * Parses a file to detect exported names
 * Uses simple regex parsing (no AST needed for basic export detection)
 */
function parseExports(content: string): Set<string> {
  const exports = new Set<string>()

  // Match: export const name = ...
  const constExportRegex = /export\s+const\s+(\w+)\s*=/g
  let match
  while ((match = constExportRegex.exec(content)) !== null) {
    const name = match[1]
    if (name) exports.add(name)
  }

  // Match: export function name(...) { ... }
  const funcExportRegex = /export\s+function\s+(\w+)\s*\(/g
  while ((match = funcExportRegex.exec(content)) !== null) {
    const name = match[1]
    if (name) exports.add(name)
  }

  // Match: export { name, ... }
  const namedExportRegex = /export\s*\{([^}]+)\}/g
  while ((match = namedExportRegex.exec(content)) !== null) {
    const matchedNames = match[1]
    if (matchedNames) {
      const names = matchedNames.split(',').map((n) => n.trim().split(/\s+as\s+/)[0]?.trim())
      names.forEach((n) => {
        if (n) exports.add(n)
      })
    }
  }

  // Match: export default
  if (/export\s+default\s/.test(content)) {
    exports.add('default')
  }

  return exports
}

/**
 * Extracts the resource name from exports or filename
 */
function getResourceName(exports: Set<string>, content: string, filename: string): string {
  // Check for explicit name export with value
  if (exports.has('name')) {
    // Try to extract the string value: export const name = 'value' or "value"
    const nameMatch = content.match(/export\s+const\s+name\s*=\s*['"]([^'"]+)['"]/)
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1]
    }
  }

  // Fall back to filename without extension
  return basename(filename, extname(filename))
}

/**
 * Recursively finds all resource files in a directory
 */
async function findResourceFiles(dir: string, extensions: string[]): Promise<string[]> {
  const files: string[] = []

  if (!existsSync(dir)) {
    return files
  }

  const entries = await readdir(dir)

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry)
      const fileStat = await stat(fullPath)

      if (fileStat.isDirectory()) {
        const nestedFiles = await findResourceFiles(fullPath, extensions)
        files.push(...nestedFiles)
      } else if (fileStat.isFile()) {
        const ext = extname(entry)
        if (extensions.includes(ext)) {
          files.push(fullPath)
        }
      }
    })
  )

  return files
}

/**
 * Generates import path from file path
 */
function getImportPath(filePath: string, rootDir: string): string {
  const rel = relative(rootDir, filePath)
  // Remove extension and ensure ./ prefix
  const withoutExt = rel.replace(/\.(tsx|jsx|mdx)$/, '')
  return `./${withoutExt}`
}

/**
 * Parses a resource file and returns its definition
 */
async function parseResourceFile(
  filePath: string,
  rootDir: string,
  resourcesDir: string
): Promise<ResourceDefinition> {
  const content = await readFile(filePath, 'utf-8')
  const filename = basename(filePath)
  const ext = extname(filePath)
  const isMdx = ext === '.mdx'

  // For MDX files, parse frontmatter and use body for export detection
  let contentForExports = content
  let frontmatter: Record<string, string> = {}

  if (isMdx) {
    const parsed = parseFrontmatter(content)
    frontmatter = parsed.frontmatter
    contentForExports = parsed.body
  }

  const exports = parseExports(contentForExports)

  // Determine resource name
  let name: string

  // For MDX files, check frontmatter first
  if (isMdx && frontmatter.name) {
    name = frontmatter.name
  } else {
    name = getResourceName(exports, content, filename)
  }

  // Check for nested directory structure
  const resourcesDirPath = join(rootDir, resourcesDir)
  const relativePath = relative(resourcesDirPath, filePath)
  const dir = dirname(relativePath)
  if (dir !== '.') {
    // For nested paths like admin/users.tsx, use admin/users as name if no explicit name
    const hasExplicitName = isMdx ? !!frontmatter.name : exports.has('name')
    if (!hasExplicitName) {
      name = `${dir}/${basename(filename, extname(filename))}`
    }
  }

  // Detect CRUD components
  const hasComponent = {
    list: exports.has('list'),
    edit: exports.has('edit'),
    show: exports.has('show'),
    create: exports.has('create'),
    icon: exports.has('icon'),
  }

  // Detect additional exports
  const hasExport = {
    recordRepresentation: exports.has('recordRepresentation'),
    options: exports.has('options'),
  }

  // Generate warnings
  const warnings: string[] = []
  const hasCrudComponent = hasComponent.list || hasComponent.edit || hasComponent.show || hasComponent.create
  if (!hasCrudComponent) {
    warnings.push(`Resource "${name}" has no CRUD components defined`)
  }

  return {
    name,
    filePath,
    importPath: getImportPath(filePath, rootDir),
    hasComponent,
    hasExport,
    warnings,
    isMdx,
  }
}

/**
 * Scans a directory for resource files and returns their definitions
 *
 * @param rootDir - The root directory to scan (looks for resources/ subdirectory)
 * @param options - Optional scan configuration
 * @returns Array of discovered resource definitions
 *
 * @example
 * ```typescript
 * const resources = await scanResources('./my-app')
 * console.log(resources)
 * // [{ name: 'posts', hasComponent: { list: true, ... }, ... }]
 * ```
 */
export async function scanResources(
  rootDir: string,
  options: ScanOptions = {}
): Promise<ResourceDefinition[]> {
  const { resourcesDir, extensions } = { ...DEFAULT_OPTIONS, ...options }
  const resourcesDirPath = join(rootDir, resourcesDir)

  // Return empty array if resources directory doesn't exist
  if (!existsSync(resourcesDirPath)) {
    return []
  }

  // Find all resource files
  const files = await findResourceFiles(resourcesDirPath, extensions)

  // Parse each file in parallel for better performance
  const resources = await Promise.all(
    files.map((file) => parseResourceFile(file, rootDir, resourcesDir))
  )

  return resources
}

