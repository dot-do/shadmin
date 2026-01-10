/**
 * @file InteractiveMenu.tsx
 * @description React Ink component for interactive CLI menu
 */

import { useState } from 'react'
import { render, Box, Text } from 'ink'
import SelectInput from 'ink-select-input'
import { EXAMPLE_TEMPLATES, getTemplateFiles, type ExampleTemplate } from './interactive'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'

interface MenuProps {
  /** Root directory to scaffold into */
  rootDir: string
  /** Callback when scaffolding is complete */
  onComplete: (templateId: string) => void
  /** Callback when user exits */
  onExit: () => void
}

/**
 * Interactive menu component
 */
function InteractiveMenu({ rootDir, onComplete, onExit }: MenuProps) {
  const [selected, setSelected] = useState<ExampleTemplate | null>(null)
  const [scaffolding, setScaffolding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const items = [
    ...EXAMPLE_TEMPLATES.map((t) => ({
      label: `${t.icon || '📦'} ${t.name} - ${t.description}`,
      value: t.id,
    })),
    { label: '❌ Exit', value: 'exit' },
  ]

  const handleSelect = async (item: { label: string; value: string }) => {
    if (item.value === 'exit') {
      onExit()
      return
    }

    const template = EXAMPLE_TEMPLATES.find((t) => t.id === item.value)
    if (!template) return

    setSelected(template)
    setScaffolding(true)

    try {
      const files = getTemplateFiles(template.id)

      for (const [filePath, content] of Object.entries(files)) {
        const fullPath = join(rootDir, filePath)
        const dir = dirname(fullPath)

        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true })
        }

        writeFileSync(fullPath, content)
      }

      onComplete(template.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setScaffolding(false)
    }
  }

  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">Error: {error}</Text>
      </Box>
    )
  }

  if (scaffolding) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="green">
          ✓ Scaffolding {selected?.name}...
        </Text>
      </Box>
    )
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          🚀 shadmin - Zero-Config Admin Runner
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text>
          No resources found. Select an example to get started:
        </Text>
      </Box>

      <SelectInput items={items} onSelect={handleSelect} />

      <Box marginTop={1}>
        <Text dimColor>
          Use ↑↓ arrows to navigate, Enter to select
        </Text>
      </Box>
    </Box>
  )
}

/**
 * Renders the interactive menu and returns a promise
 *
 * @param rootDir - Directory to scaffold into
 * @returns Promise resolving to selected template ID or null if exited
 */
export async function showInteractiveMenu(rootDir: string): Promise<string | null> {
  return new Promise((resolve) => {
    const { unmount } = render(
      <InteractiveMenu
        rootDir={rootDir}
        onComplete={(templateId) => {
          unmount()
          resolve(templateId)
        }}
        onExit={() => {
          unmount()
          resolve(null)
        }}
      />
    )
  })
}

export { InteractiveMenu }
