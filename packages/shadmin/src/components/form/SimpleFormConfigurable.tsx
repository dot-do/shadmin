/**
 * SimpleFormConfigurable Component
 * A configurable form component that allows users to show/hide fields.
 * Extends SimpleForm with field configuration capabilities.
 */

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  isValidElement,
  Children,
  cloneElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { type FieldValues } from 'react-hook-form'
import { SimpleForm, type SimpleFormProps } from './SimpleForm'
import { Button } from '../Button'
import { cn } from '../../utils'

/**
 * Configuration for a single field
 */
export interface FieldConfig {
  /** Field source/name */
  source: string
  /** Display label for the field */
  label?: string
  /** Whether the field is currently visible */
  visible: boolean
}

/**
 * Props for SimpleFormConfigurable component
 */
export interface SimpleFormConfigurableProps<T extends FieldValues = FieldValues>
  extends SimpleFormProps<T> {
  /**
   * MUI sx prop for styling (accepted for compatibility, ignored)
   */
  sx?: unknown
  /**
   * Array of field sources to omit (hide) from the form.
   * These fields will not be rendered.
   */
  omit?: string[]
  /**
   * Key for storing field configuration in localStorage.
   * If provided, user preferences will be persisted.
   */
  preferenceKey?: string
  /**
   * Whether to show the configuration panel
   * @default true
   */
  configurable?: boolean
  /**
   * Custom label for the configure button
   * @default 'Configure Fields'
   */
  configureButtonLabel?: string
  /**
   * Callback when field configuration changes
   */
  onConfigChange?: (config: FieldConfig[]) => void
}

/**
 * Extract field information from children
 */
function extractFieldsFromChildren(children: ReactNode): FieldConfig[] {
  const fields: FieldConfig[] = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return
    }

    const props = child.props as {
      source?: string
      label?: string | false
      children?: ReactNode
    }

    if (props.source) {
      fields.push({
        source: props.source,
        label: typeof props.label === 'string' ? props.label : props.source,
        visible: true,
      })
    }

    // Recursively check children
    if (props.children) {
      fields.push(...extractFieldsFromChildren(props.children))
    }
  })

  return fields
}

/**
 * Load configuration from localStorage
 */
function loadConfig(preferenceKey: string): Record<string, boolean> | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(preferenceKey)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }

  return null
}

/**
 * Save configuration to localStorage
 */
function saveConfig(preferenceKey: string, config: Record<string, boolean>): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(preferenceKey, JSON.stringify(config))
  } catch {
    // Ignore storage errors
  }
}

/**
 * FieldConfigurationPanel - UI for configuring which fields are visible
 */
function FieldConfigurationPanel({
  fields,
  onToggle,
  onClose,
}: {
  fields: FieldConfig[]
  onToggle: (source: string) => void
  onClose: () => void
}) {
  return (
    <div className="mb-4 rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">Configure Fields</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <span className="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {fields.map((field) => (
          <label
            key={field.source}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted"
          >
            <input
              type="checkbox"
              checked={field.visible}
              onChange={() => onToggle(field.source)}
              className="h-4 w-4 rounded border-input"
            />
            <span className="truncate">{field.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

/**
 * ConfigureButton - Button to open/close the configuration panel
 */
function ConfigureButton({
  isOpen,
  onClick,
  label,
}: {
  isOpen: boolean
  onClick: () => void
  label: string
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className="mb-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('mr-2 transition-transform', isOpen && 'rotate-90')}
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {label}
    </Button>
  )
}

/**
 * SimpleFormConfigurable - A form with configurable field visibility
 *
 * This component extends SimpleForm with the ability to:
 * - Hide specific fields via the `omit` prop
 * - Allow users to toggle field visibility via a configuration panel
 * - Persist user preferences via localStorage using `preferenceKey`
 *
 * @example
 * ```tsx
 * // Basic usage with omit
 * <SimpleFormConfigurable omit={['internalField', 'hiddenField']}>
 *   <TextInput source="name" />
 *   <TextInput source="email" />
 *   <TextInput source="internalField" /> {/* This will be hidden *\/}
 * </SimpleFormConfigurable>
 *
 * // With preference persistence
 * <SimpleFormConfigurable preferenceKey="user-form-config">
 *   <TextInput source="name" />
 *   <TextInput source="email" />
 *   <TextInput source="phone" />
 * </SimpleFormConfigurable>
 *
 * // Without configuration UI (only omit)
 * <SimpleFormConfigurable omit={['secret']} configurable={false}>
 *   <TextInput source="name" />
 *   <TextInput source="secret" />
 * </SimpleFormConfigurable>
 * ```
 */
export function SimpleFormConfigurable<T extends FieldValues = FieldValues>({
  children,
  omit = [],
  preferenceKey,
  configurable = true,
  configureButtonLabel = 'Configure Fields',
  onConfigChange,
  ...simpleFormProps
}: SimpleFormConfigurableProps<T>): ReactElement {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Extract fields from children
  const allFields = useMemo(
    () => extractFieldsFromChildren(children),
    [children]
  )

  // Initialize visibility state
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, boolean>>(() => {
    // Start with all fields visible
    const initial: Record<string, boolean> = {}
    allFields.forEach((field) => {
      initial[field.source] = true
    })

    // Apply omit prop
    omit.forEach((source) => {
      initial[source] = false
    })

    // Load from preferences if key provided
    if (preferenceKey) {
      const stored = loadConfig(preferenceKey)
      if (stored) {
        Object.keys(stored).forEach((source) => {
          if (source in initial) {
            initial[source] = stored[source]
          }
        })
      }
    }

    return initial
  })

  // Update when omit prop changes
  useEffect(() => {
    setFieldVisibility((prev) => {
      const updated = { ...prev }
      omit.forEach((source) => {
        updated[source] = false
      })
      return updated
    })
  }, [omit])

  // Build field configuration array for the panel
  const fieldConfigs = useMemo((): FieldConfig[] => {
    return allFields.map((field) => ({
      ...field,
      visible: fieldVisibility[field.source] ?? true,
    }))
  }, [allFields, fieldVisibility])

  // Toggle field visibility
  const handleToggle = useCallback(
    (source: string) => {
      setFieldVisibility((prev) => {
        const updated = {
          ...prev,
          [source]: !prev[source],
        }

        // Save to preferences
        if (preferenceKey) {
          saveConfig(preferenceKey, updated)
        }

        // Notify parent
        if (onConfigChange) {
          const configs = allFields.map((field) => ({
            ...field,
            visible: updated[field.source] ?? true,
          }))
          onConfigChange(configs)
        }

        return updated
      })
    },
    [preferenceKey, onConfigChange, allFields]
  )

  // Filter children based on visibility
  const filteredChildren = useMemo(() => {
    const filterChildren = (nodes: ReactNode): ReactNode => {
      return Children.map(nodes, (child) => {
        if (!isValidElement(child)) {
          return child
        }

        const props = child.props as {
          source?: string
          children?: ReactNode
        }

        // If this element has a source and it's hidden, don't render it
        if (props.source && fieldVisibility[props.source] === false) {
          return null
        }

        // If element has children, recursively filter them
        if (props.children) {
          const filteredInnerChildren = filterChildren(props.children)
          return cloneElement(child, {}, filteredInnerChildren)
        }

        return child
      })
    }

    return filterChildren(children)
  }, [children, fieldVisibility])

  return (
    <div>
      {configurable && allFields.length > 0 && (
        <>
          <ConfigureButton
            isOpen={isPanelOpen}
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            label={configureButtonLabel}
          />
          {isPanelOpen && (
            <FieldConfigurationPanel
              fields={fieldConfigs}
              onToggle={handleToggle}
              onClose={() => setIsPanelOpen(false)}
            />
          )}
        </>
      )}
      <SimpleForm {...simpleFormProps}>{filteredChildren}</SimpleForm>
    </div>
  )
}

SimpleFormConfigurable.displayName = 'SimpleFormConfigurable'
