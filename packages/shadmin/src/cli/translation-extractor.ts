/**
 * @file translation-extractor.ts
 * @description Extracts translation keys from source files using AST parsing
 *
 * Parses:
 * - useTranslate() hook calls and translate() function invocations
 * - Direct translate('key') calls
 * - translate('key', { options }) calls with interpolation
 */

import { existsSync } from 'fs'
import { readdir, readFile, stat, writeFile } from 'fs/promises'
import { join, extname, relative } from 'path'

import ts from 'typescript'

/**
 * Represents an extracted translation key
 */
export interface TranslationKey {
  /** The translation key string */
  key: string
  /** File where the key was found */
  file: string
  /** Line number where the key was found */
  line: number
  /** Column number where the key was found */
  column: number
  /** Default value if provided via _ option */
  defaultValue?: string
  /** Any interpolation parameters used */
  interpolations?: string[]
}

/**
 * Result of translation extraction
 */
export interface ExtractionResult {
  /** All unique translation keys found */
  keys: TranslationKey[]
  /** Number of files scanned */
  filesScanned: number
  /** Files that had parsing errors */
  errors: { file: string; error: string }[]
}

/**
 * Options for the translation extractor
 */
export interface ExtractorOptions {
  /** Root directory to scan */
  rootDir: string
  /** File extensions to scan (default: ['.tsx', '.jsx', '.ts', '.js']) */
  extensions?: string[]
  /** Directories to ignore */
  ignore?: string[]
  /** Output format */
  format?: 'json' | 'po'
  /** Output file path (optional, prints to stdout if not provided) */
  output?: string
}

/** Default options */
const DEFAULT_OPTIONS: Required<Omit<ExtractorOptions, 'output' | 'rootDir'>> = {
  extensions: ['.tsx', '.jsx', '.ts', '.js'],
  ignore: ['node_modules', 'dist', '.git', 'coverage', '__tests__', '*.spec.*', '*.test.*'],
  format: 'json',
}

/**
 * Checks if a file path should be ignored based on ignore patterns
 */
function shouldIgnore(filePath: string, ignore: string[]): boolean {
  for (const pattern of ignore) {
    if (pattern.includes('*')) {
      // Simple glob matching for patterns like *.spec.*
      const regex = new RegExp(pattern.replace(/\./g, '\\.').replace(/\*/g, '.*'))
      if (regex.test(filePath)) {
        return true
      }
    } else if (filePath.includes(pattern)) {
      return true
    }
  }
  return false
}

/**
 * Recursively finds all source files in a directory
 */
async function findSourceFiles(dir: string, extensions: string[], ignore: string[]): Promise<string[]> {
  const files: string[] = []

  if (!existsSync(dir)) {
    return files
  }

  const entries = await readdir(dir)

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry)

      if (shouldIgnore(fullPath, ignore)) {
        return
      }

      const fileStat = await stat(fullPath)

      if (fileStat.isDirectory()) {
        const nestedFiles = await findSourceFiles(fullPath, extensions, ignore)
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
 * Extracts the string value from a string literal or template expression
 */
function getStringValue(node: ts.Node): string | undefined {
  if (ts.isStringLiteral(node)) {
    return node.text
  }
  if (ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text
  }
  return undefined
}

/**
 * Extracts interpolation parameter names from an options object
 */
function getInterpolations(node: ts.ObjectLiteralExpression): string[] {
  const interpolations: string[] = []

  for (const prop of node.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      const name = prop.name.text
      // Skip the _ (default value) and smart_count (pluralization) options
      if (name !== '_' && name !== 'smart_count') {
        interpolations.push(name)
      }
    }
    if (ts.isShorthandPropertyAssignment(prop)) {
      const name = prop.name.text
      if (name !== '_' && name !== 'smart_count') {
        interpolations.push(name)
      }
    }
  }

  return interpolations
}

/**
 * Extracts default value from options object
 */
function getDefaultValue(node: ts.ObjectLiteralExpression): string | undefined {
  for (const prop of node.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      if (prop.name.text === '_') {
        return getStringValue(prop.initializer)
      }
    }
  }
  return undefined
}

/**
 * Parses a single file and extracts translation keys
 */
function parseFile(
  content: string,
  filePath: string,
  rootDir: string
): { keys: TranslationKey[]; error?: string } {
  const keys: TranslationKey[] = []
  const relativePath = relative(rootDir, filePath)

  try {
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    )

    // Track variable names that hold translate function
    const translateVariables = new Set<string>()

    function visit(node: ts.Node) {
      // Detect: const translate = useTranslate()
      // or: const { translate } = useI18n() patterns
      if (ts.isVariableDeclaration(node)) {
        if (
          node.initializer &&
          ts.isCallExpression(node.initializer) &&
          ts.isIdentifier(node.initializer.expression)
        ) {
          const funcName = node.initializer.expression.text
          if (funcName === 'useTranslate') {
            // const translate = useTranslate()
            if (ts.isIdentifier(node.name)) {
              translateVariables.add(node.name.text)
            }
          }
        }
      }

      // Detect: translate('key') or translate('key', { options })
      if (ts.isCallExpression(node)) {
        let isTranslateCall = false

        // Check if it's a direct translate() call or a variable we're tracking
        if (ts.isIdentifier(node.expression)) {
          const funcName = node.expression.text
          if (funcName === 'translate' || translateVariables.has(funcName)) {
            isTranslateCall = true
          }
        }

        if (isTranslateCall && node.arguments.length > 0) {
          const firstArg = node.arguments[0]
          const key = getStringValue(firstArg!)

          if (key) {
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart())

            const translationKey: TranslationKey = {
              key,
              file: relativePath,
              line: line + 1, // 1-indexed
              column: character + 1,
            }

            // Check for options object (second argument)
            if (node.arguments.length > 1) {
              const secondArg = node.arguments[1]
              if (secondArg && ts.isObjectLiteralExpression(secondArg)) {
                const defaultVal = getDefaultValue(secondArg)
                if (defaultVal) {
                  translationKey.defaultValue = defaultVal
                }
                const interpolations = getInterpolations(secondArg)
                if (interpolations.length > 0) {
                  translationKey.interpolations = interpolations
                }
              }
            }

            keys.push(translationKey)
          }
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
  } catch (err) {
    return {
      keys: [],
      error: err instanceof Error ? err.message : String(err),
    }
  }

  return { keys }
}

/**
 * Converts extraction result to JSON format
 */
function toJSON(result: ExtractionResult): string {
  // Group keys by key string, collecting all occurrences
  const keyMap = new Map<string, {
    key: string
    defaultValue?: string
    interpolations?: string[]
    occurrences: { file: string; line: number; column: number }[]
  }>()

  for (const entry of result.keys) {
    const existing = keyMap.get(entry.key)
    if (existing) {
      existing.occurrences.push({
        file: entry.file,
        line: entry.line,
        column: entry.column,
      })
      // Merge interpolations
      if (entry.interpolations) {
        existing.interpolations = [
          ...new Set([...(existing.interpolations || []), ...entry.interpolations]),
        ]
      }
      // Keep first default value found
      if (entry.defaultValue && !existing.defaultValue) {
        existing.defaultValue = entry.defaultValue
      }
    } else {
      const newEntry: {
        key: string
        defaultValue?: string
        interpolations?: string[]
        occurrences: { file: string; line: number; column: number }[]
      } = {
        key: entry.key,
        occurrences: [{ file: entry.file, line: entry.line, column: entry.column }],
      }
      if (entry.defaultValue !== undefined) {
        newEntry.defaultValue = entry.defaultValue
      }
      if (entry.interpolations !== undefined) {
        newEntry.interpolations = entry.interpolations
      }
      keyMap.set(entry.key, newEntry)
    }
  }

  const output = {
    meta: {
      filesScanned: result.filesScanned,
      totalKeys: keyMap.size,
      totalOccurrences: result.keys.length,
      errors: result.errors.length > 0 ? result.errors : undefined,
    },
    keys: Object.fromEntries(
      [...keyMap.values()].sort((a, b) => a.key.localeCompare(b.key)).map((entry) => [
        entry.key,
        {
          defaultValue: entry.defaultValue,
          interpolations: entry.interpolations,
          occurrences: entry.occurrences,
        },
      ])
    ),
  }

  return JSON.stringify(output, null, 2)
}

/**
 * Converts extraction result to PO (gettext) format
 */
function toPO(result: ExtractionResult): string {
  const lines: string[] = []

  // PO file header
  lines.push('# Translation keys extracted by shadmin')
  lines.push('# Generated at: ' + new Date().toISOString())
  lines.push('')
  lines.push('msgid ""')
  lines.push('msgstr ""')
  lines.push('"Content-Type: text/plain; charset=UTF-8\\n"')
  lines.push('"Content-Transfer-Encoding: 8bit\\n"')
  lines.push('')

  // Group keys to avoid duplicates
  const keyMap = new Map<string, {
    defaultValue?: string
    occurrences: { file: string; line: number }[]
  }>()

  for (const entry of result.keys) {
    const existing = keyMap.get(entry.key)
    if (existing) {
      existing.occurrences.push({ file: entry.file, line: entry.line })
      if (entry.defaultValue && !existing.defaultValue) {
        existing.defaultValue = entry.defaultValue
      }
    } else {
      const newEntry: {
        defaultValue?: string
        occurrences: { file: string; line: number }[]
      } = {
        occurrences: [{ file: entry.file, line: entry.line }],
      }
      if (entry.defaultValue !== undefined) {
        newEntry.defaultValue = entry.defaultValue
      }
      keyMap.set(entry.key, newEntry)
    }
  }

  // Sort keys alphabetically
  const sortedKeys = [...keyMap.entries()].sort(([a], [b]) => a.localeCompare(b))

  for (const [key, data] of sortedKeys) {
    // Add file references as comments
    for (const occ of data.occurrences) {
      lines.push(`#: ${occ.file}:${occ.line}`)
    }

    // Escape quotes in the key
    const escapedKey = key.replace(/"/g, '\\"')
    lines.push(`msgid "${escapedKey}"`)

    // Use default value as initial translation if available
    const msgstr = data.defaultValue ? data.defaultValue.replace(/"/g, '\\"') : ''
    lines.push(`msgstr "${msgstr}"`)
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Extracts translation keys from source files
 *
 * @param options - Extraction options
 * @returns Extraction result with all found keys
 *
 * @example
 * ```typescript
 * const result = await extractTranslationKeys({ rootDir: './src' })
 * console.log(result.keys)
 * // [{ key: 'hello', file: 'App.tsx', line: 10, column: 5 }, ...]
 * ```
 */
export async function extractTranslationKeys(
  options: ExtractorOptions
): Promise<ExtractionResult> {
  const { rootDir, extensions, ignore, format, output } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  // Find all source files
  const files = await findSourceFiles(rootDir, extensions, ignore)

  const allKeys: TranslationKey[] = []
  const errors: { file: string; error: string }[] = []

  // Parse each file
  await Promise.all(
    files.map(async (filePath) => {
      const content = await readFile(filePath, 'utf-8')
      const result = parseFile(content, filePath, rootDir)

      allKeys.push(...result.keys)
      if (result.error) {
        errors.push({ file: relative(rootDir, filePath), error: result.error })
      }
    })
  )

  const extractionResult: ExtractionResult = {
    keys: allKeys,
    filesScanned: files.length,
    errors,
  }

  // Generate output in requested format
  const outputContent = format === 'po' ? toPO(extractionResult) : toJSON(extractionResult)

  // Write to file or return
  if (output) {
    await writeFile(output, outputContent, 'utf-8')
  }

  return extractionResult
}

/**
 * Formats extraction result for console output
 */
export function formatExtractionResult(result: ExtractionResult, format: 'json' | 'po'): string {
  return format === 'po' ? toPO(result) : toJSON(result)
}
