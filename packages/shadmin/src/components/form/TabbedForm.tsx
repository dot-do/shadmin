/**
 * TabbedForm Component
 * Organizes form inputs into tabs using accessible tab navigation
 */

import * as React from 'react'
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  Children,
  isValidElement,
  type ReactNode,
} from 'react'
import { useFormContext } from '../../contexts/FormContext'
import { useTestSearchParams } from '../../test-utils/TestMemoryRouter'
import { cn } from '../../utils'
import { FormTab, FormTabPanel, generateTabName, type FormTabProps } from './FormTab'

/**
 * Tab information extracted from FormTab children
 */
export interface TabInfo {
  name: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  className?: string
  triggerClassName?: string
  children: ReactNode
}

/**
 * Context value for TabbedForm
 */
export interface TabbedFormContextValue {
  /**
   * Currently active tab name
   */
  activeTab: string
  /**
   * Set the active tab
   */
  setActiveTab: (tabName: string) => void
  /**
   * All tabs information
   */
  tabs: TabInfo[]
  /**
   * Get tabs that have dirty fields
   */
  getDirtyTabs: () => string[]
  /**
   * Get tabs that have validation errors
   */
  getErrorTabs: () => string[]
  /**
   * Get error count for a specific tab
   */
  getTabErrorCount: (tabName: string) => number
  /**
   * Check if a tab has dirty fields
   */
  isTabDirty: (tabName: string) => boolean
  /**
   * Check if a tab has errors
   */
  tabHasError: (tabName: string) => boolean
}

/**
 * TabbedForm context
 */
const TabbedFormContext = createContext<TabbedFormContextValue | undefined>(undefined)

TabbedFormContext.displayName = 'TabbedFormContext'

/**
 * Hook to access TabbedForm context
 */
export function useTabbedFormContext(): TabbedFormContextValue {
  const context = useContext(TabbedFormContext)
  if (!context) {
    throw new Error('useTabbedFormContext must be used within a TabbedForm')
  }
  return context
}

/**
 * Hook to optionally access TabbedForm context (doesn't throw if not available)
 */
export function useOptionalTabbedFormContext(): TabbedFormContextValue | undefined {
  return useContext(TabbedFormContext)
}

/**
 * Props for TabbedForm component
 */
export interface TabbedFormProps {
  /**
   * FormTab children
   */
  children?: ReactNode
  /**
   * Additional CSS class for the form container
   */
  className?: string
  /**
   * Default tab to show on mount
   */
  defaultTab?: string
  /**
   * Callback when active tab changes
   */
  onTabChange?: (tabName: string) => void
  /**
   * Whether to sync active tab with URL
   */
  syncWithLocation?: boolean
  /**
   * URL parameter key for tab sync (default: 'tab')
   */
  locationKey?: string
}

/**
 * Map of field names to their tab names
 */
type FieldTabMap = Map<string, string>

/**
 * Extract tab information from FormTab children
 */
function extractTabs(children: ReactNode): TabInfo[] {
  const tabs: TabInfo[] = []

  Children.forEach(children, (child, _index) => {
    if (!isValidElement(child)) return
    if (child.type !== FormTab) return

    const props = child.props as FormTabProps
    const name = props.name || generateTabName(props.label)

    tabs.push({
      name,
      label: props.label,
      icon: props.icon,
      disabled: props.disabled,
      className: props.className,
      triggerClassName: props.triggerClassName,
      children: props.children,
    })
  })

  return tabs
}

/**
 * Build a map of field sources to their parent tab names
 * This is used to determine which tab an error belongs to
 */
function buildFieldTabMap(tabs: TabInfo[]): FieldTabMap {
  const map = new Map<string, string>()

  const extractFieldSources = (node: ReactNode, tabName: string) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return

      // Check if this element has a source prop (form input)
      const props = child.props as Record<string, unknown>
      if (typeof props.source === 'string') {
        map.set(props.source, tabName)
      }

      // Recursively check children
      if (props.children) {
        extractFieldSources(props.children as ReactNode, tabName)
      }
    })
  }

  tabs.forEach((tab) => {
    extractFieldSources(tab.children, tab.name)
  })

  return map
}

/**
 * TabbedForm - Organizes form inputs into accessible tabs
 *
 * @example
 * ```tsx
 * <TabbedForm>
 *   <FormTab label="General">
 *     <TextInput source="name" />
 *     <TextInput source="email" />
 *   </FormTab>
 *   <FormTab label="Details">
 *     <TextInput source="description" />
 *   </FormTab>
 * </TabbedForm>
 * ```
 *
 * @example
 * ```tsx
 * // With URL sync
 * <TabbedForm syncWithLocation>
 *   <FormTab label="Settings" name="settings">
 *     <TextInput source="setting1" />
 *   </FormTab>
 * </TabbedForm>
 * ```
 */
export function TabbedForm({
  children,
  className,
  defaultTab,
  onTabChange,
  syncWithLocation = false,
  locationKey = 'tab',
}: TabbedFormProps) {
  // Extract tab configuration from children
  const tabs = useMemo(() => extractTabs(children), [children])

  // Build field-to-tab mapping for error association
  const fieldTabMap = useMemo(() => buildFieldTabMap(tabs), [tabs])

  // Get form context for dirty/error state
  const formContext = useFormContext()
  const { formState } = formContext || { formState: { errors: {}, dirtyFields: {} } }

  // URL sync hook
  const [searchParams, setSearchParams] = useTestSearchParams()

  // Determine initial tab
  const getInitialTab = useCallback(() => {
    if (syncWithLocation) {
      const urlTab = searchParams.get(locationKey)
      if (urlTab && tabs.some((t) => t.name === urlTab)) {
        return urlTab
      }
    }
    if (defaultTab && tabs.some((t) => t.name === defaultTab)) {
      return defaultTab
    }
    return tabs[0]?.name || ''
  }, [syncWithLocation, searchParams, locationKey, defaultTab, tabs])

  const [activeTab, setActiveTabState] = useState(getInitialTab)

  // Sync with URL on mount
  useEffect(() => {
    if (syncWithLocation) {
      const urlTab = searchParams.get(locationKey)
      if (urlTab && tabs.some((t) => t.name === urlTab)) {
        setActiveTabState(urlTab)
      }
    }
  }, [])

  // Handle tab change
  const setActiveTab = useCallback(
    (tabName: string) => {
      setActiveTabState(tabName)
      onTabChange?.(tabName)

      if (syncWithLocation) {
        const newParams = new URLSearchParams(searchParams)
        newParams.set(locationKey, tabName)
        setSearchParams(newParams)
      }
    },
    [onTabChange, syncWithLocation, locationKey, searchParams, setSearchParams]
  )

  // Get tabs with errors
  const getErrorTabs = useCallback(() => {
    const errorTabs = new Set<string>()
    const errorFields = Object.keys(formState.errors)

    errorFields.forEach((field) => {
      const tabName = fieldTabMap.get(field)
      if (tabName) {
        errorTabs.add(tabName)
      }
    })

    return Array.from(errorTabs)
  }, [formState.errors, fieldTabMap])

  // Get error count for a specific tab
  const getTabErrorCount = useCallback(
    (tabName: string) => {
      let count = 0
      const errorFields = Object.keys(formState.errors)

      errorFields.forEach((field) => {
        if (fieldTabMap.get(field) === tabName) {
          count++
        }
      })

      return count
    },
    [formState.errors, fieldTabMap]
  )

  // Check if tab has error
  const tabHasError = useCallback(
    (tabName: string) => {
      return getTabErrorCount(tabName) > 0
    },
    [getTabErrorCount]
  )

  // Get tabs with dirty fields
  const getDirtyTabs = useCallback(() => {
    const dirtyTabs = new Set<string>()
    const dirtyFields = Object.keys(formState.dirtyFields)

    dirtyFields.forEach((field) => {
      const tabName = fieldTabMap.get(field)
      if (tabName) {
        dirtyTabs.add(tabName)
      }
    })

    return Array.from(dirtyTabs)
  }, [formState.dirtyFields, fieldTabMap])

  // Check if tab is dirty
  const isTabDirty = useCallback(
    (tabName: string) => {
      const dirtyFields = Object.keys(formState.dirtyFields)
      return dirtyFields.some((field) => fieldTabMap.get(field) === tabName)
    },
    [formState.dirtyFields, fieldTabMap]
  )

  // Navigate to first tab with error on validation failure
  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      const errorTabs = getErrorTabs()
      if (errorTabs.length > 0 && !errorTabs.includes(activeTab)) {
        // Find the first tab (in order) that has errors
        const firstErrorTab = tabs.find((t) => errorTabs.includes(t.name))
        if (firstErrorTab) {
          setActiveTab(firstErrorTab.name)
        }
      }
    }
  }, [formState.errors, activeTab, getErrorTabs, tabs, setActiveTab])

  // Context value
  const contextValue = useMemo<TabbedFormContextValue>(
    () => ({
      activeTab,
      setActiveTab,
      tabs,
      getDirtyTabs,
      getErrorTabs,
      getTabErrorCount,
      isTabDirty,
      tabHasError,
    }),
    [activeTab, setActiveTab, tabs, getDirtyTabs, getErrorTabs, getTabErrorCount, isTabDirty, tabHasError]
  )

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const currentIndex = tabs.findIndex((t) => t.name === activeTab)
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowRight':
          newIndex = currentIndex + 1
          if (newIndex >= tabs.length) newIndex = 0
          break
        case 'ArrowLeft':
          newIndex = currentIndex - 1
          if (newIndex < 0) newIndex = tabs.length - 1
          break
        case 'Home':
          newIndex = 0
          break
        case 'End':
          newIndex = tabs.length - 1
          break
        default:
          return
      }

      // Skip disabled tabs
      while (tabs[newIndex]?.disabled && newIndex !== currentIndex) {
        if (event.key === 'ArrowRight' || event.key === 'End') {
          newIndex = newIndex + 1 >= tabs.length ? 0 : newIndex + 1
        } else {
          newIndex = newIndex - 1 < 0 ? tabs.length - 1 : newIndex - 1
        }
      }

      if (newIndex !== currentIndex && tabs[newIndex]) {
        event.preventDefault()
        setActiveTab(tabs[newIndex].name)
        // Focus the new tab
        const tabElement = document.getElementById(`tab-${tabs[newIndex].name}`)
        tabElement?.focus()
      }
    },
    [activeTab, tabs, setActiveTab]
  )

  if (tabs.length === 0) {
    return (
      <div data-slot="tabbed-form" className={className}>
        <div role="tablist" />
      </div>
    )
  }

  return (
    <TabbedFormContext.Provider value={contextValue}>
      <div data-slot="tabbed-form" className={cn('w-full', className)}>
        {/* Tab List */}
        <div
          role="tablist"
          aria-orientation="horizontal"
          className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground"
          onKeyDown={handleKeyDown}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name
            const hasError = tabHasError(tab.name)
            const errorCount = getTabErrorCount(tab.name)
            const isDirty = isTabDirty(tab.name)

            return (
              <button
                key={tab.name}
                id={`tab-${tab.name}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.name}`}
                data-state={isActive ? 'active' : 'inactive'}
                data-has-error={hasError ? 'true' : undefined}
                data-error-count={errorCount > 0 ? String(errorCount) : undefined}
                data-dirty={isDirty ? 'true' : undefined}
                disabled={tab.disabled}
                tabIndex={isActive ? 0 : -1}
                onClick={() => !tab.disabled && setActiveTab(tab.name)}
                className={cn(
                  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:pointer-events-none disabled:opacity-50',
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:bg-background/50',
                  hasError && 'text-destructive',
                  tab.triggerClassName
                )}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
                {errorCount > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                    {errorCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Panels - All rendered but only active one visible (for form registration) */}
        {tabs.map((tab) => (
          <FormTabPanel
            key={tab.name}
            value={tab.name}
            isActive={activeTab === tab.name}
            forceRender={true}
            className={tab.className}
          >
            {tab.children}
          </FormTabPanel>
        ))}
      </div>
    </TabbedFormContext.Provider>
  )
}

TabbedForm.displayName = 'TabbedForm'

// Re-export FormTab for convenience
export { FormTab } from './FormTab'
export type { FormTabProps } from './FormTab'
