/**
 * TabbedForm Component
 *
 * A form container that organizes form inputs into multiple tabs with:
 * - Accessible keyboard navigation (Arrow keys, Home, End)
 * - Optional URL synchronization for deep-linking to specific tabs
 * - Per-tab validation error indicators with error counts
 * - Per-tab dirty state tracking
 * - Automatic navigation to first tab with errors on validation failure
 *
 * @module TabbedForm
 */

import * as React from 'react'
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate, matchPath, type NavigateOptions } from 'react-router'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'
import { FormTab, FormTabPanel, generateTabName, type FormTabProps } from './FormTab'

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Tab information extracted from FormTab children.
 * This normalized structure is used internally to render tabs consistently.
 */
export interface TabInfo {
  /** Unique identifier for the tab, used for state management */
  name: string
  /** Display label shown on the tab trigger */
  label: string
  /** Path segment for URL synchronization. Defaults to name if not provided */
  path: string
  /** Optional icon element to display before the label */
  icon?: ReactNode | undefined
  /** Whether the tab is disabled and cannot be selected */
  disabled?: boolean | undefined
  /** Additional CSS class for the tab panel content area */
  className?: string | undefined
  /** Additional CSS class for the tab trigger button */
  triggerClassName?: string | undefined
  /** Optional badge count to display on the tab (e.g., item count) */
  count?: ReactNode | undefined
  /** The tab panel content (form fields, etc.) */
  children: ReactNode
}

/**
 * Context value provided by TabbedForm to its descendants.
 * Allows child components to interact with tab state and access form status per tab.
 */
export interface TabbedFormContextValue {
  /** Currently active tab name */
  activeTab: string
  /** Programmatically switch to a different tab */
  setActiveTab: (tabName: string) => void
  /** Array of all tab configurations */
  tabs: TabInfo[]
  /** Get names of tabs containing dirty (modified) fields */
  getDirtyTabs: () => string[]
  /** Get names of tabs containing validation errors */
  getErrorTabs: () => string[]
  /** Get the count of validation errors for a specific tab */
  getTabErrorCount: (tabName: string) => number
  /** Check if a specific tab has any dirty fields */
  isTabDirty: (tabName: string) => boolean
  /** Check if a specific tab has any validation errors */
  tabHasError: (tabName: string) => boolean
}

// ============================================================================
// Context & Hooks
// ============================================================================

const TabbedFormContext = createContext<TabbedFormContextValue | undefined>(undefined)
TabbedFormContext.displayName = 'TabbedFormContext'

/**
 * Hook to access TabbedForm context.
 * Must be used within a TabbedForm component.
 *
 * @throws {Error} When used outside of a TabbedForm
 *
 * @example
 * ```tsx
 * function TabStatusIndicator() {
 *   const { activeTab, getErrorTabs } = useTabbedFormContext()
 *   const errorTabs = getErrorTabs()
 *   return <div>Active: {activeTab}, Errors in: {errorTabs.join(', ')}</div>
 * }
 * ```
 */
export function useTabbedFormContext(): TabbedFormContextValue {
  const context = useContext(TabbedFormContext)
  if (!context) {
    throw new Error('useTabbedFormContext must be used within a TabbedForm')
  }
  return context
}

/**
 * Hook to optionally access TabbedForm context.
 * Returns undefined when used outside of a TabbedForm (doesn't throw).
 * Useful for components that may or may not be within a TabbedForm.
 */
export function useOptionalTabbedFormContext(): TabbedFormContextValue | undefined {
  return useContext(TabbedFormContext)
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for TabbedForm component
 */
export interface TabbedFormProps {
  /** FormTab children defining each tab */
  children?: ReactNode | undefined
  /** Additional CSS class for the form container */
  className?: string | undefined
  /** Default tab to show on initial mount (by name) */
  defaultTab?: string | undefined
  /** Callback fired when the active tab changes */
  onTabChange?: ((tabName: string) => void) | undefined
  /**
   * Whether to sync active tab with the URL.
   * When enabled, tab changes update the URL path and browser back/forward works.
   * @default false
   */
  syncWithLocation?: boolean | undefined
  /**
   * URL parameter key for tab sync.
   * Currently unused - tabs use path segments instead of query params.
   * @default 'tab'
   * @deprecated Use path prop on FormTab instead
   */
  locationKey?: string | undefined
  /**
   * Validation mode for react-hook-form.
   * Passed through for react-admin compatibility.
   * @default 'onSubmit'
   */
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all' | undefined
  /** Default values for the form fields (react-admin compatibility) */
  defaultValues?: Record<string, unknown> | undefined
  /**
   * Warn users before navigating away from unsaved changes.
   * React-admin compatibility prop.
   */
  warnWhenUnsavedChanges?: boolean | undefined
  /**
   * Custom toolbar element to render form actions.
   * Set to false to hide the toolbar completely.
   */
  toolbar?: ReactElement | false | undefined
  /**
   * Custom submit handler for the form.
   * Supports both ra-core's SaveHandler and regular form submit handlers.
   */
  onSubmit?:
    | ((data: any, callbacks?: { onSuccess?: (data: any) => void; onError?: (error: Error) => void }) => Promise<void | any> | void | Record<string, string>)
    | ((data: any, event?: React.BaseSyntheticEvent) => void | Promise<void> | Promise<unknown>)
    | undefined
}

// ============================================================================
// Utility Functions
// ============================================================================

/** Map of form field source names to their containing tab names */
type FieldTabMap = Map<string, string>

/**
 * Extract tab information from FormTab children.
 * Filters out non-FormTab elements and normalizes props into TabInfo objects.
 */
function extractTabs(children: ReactNode): TabInfo[] {
  const tabs: TabInfo[] = []

  Children.forEach(children, (child) => {
    // Skip null, undefined, booleans, and non-element children
    if (!isValidElement(child)) return
    // Only process FormTab components (ignore other elements)
    if (child.type !== FormTab) return

    const props = child.props as FormTabProps
    // Generate name from label if not explicitly provided
    const name = props.name || generateTabName(props.label)
    // Use explicit path if provided, otherwise use the generated/explicit name
    const path = props.path || name

    tabs.push({
      name,
      label: props.label,
      path,
      icon: props.icon,
      disabled: props.disabled,
      className: props.className,
      triggerClassName: props.triggerClassName,
      count: props.count,
      children: props.children,
    })
  })

  return tabs
}

/**
 * Build a map of field source names to their parent tab names.
 * This mapping is used to:
 * - Determine which tab contains a field with a validation error
 * - Track dirty state per tab based on which fields have been modified
 *
 * @param tabs - Array of tab configurations to scan
 * @returns Map where keys are field source names and values are tab names
 */
function buildFieldTabMap(tabs: TabInfo[]): FieldTabMap {
  const map = new Map<string, string>()

  /**
   * Recursively extract field sources from a React node tree.
   * Looks for elements with a `source` prop (standard for form inputs).
   */
  const extractFieldSources = (node: ReactNode, tabName: string) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return

      const props = child.props as Record<string, unknown>

      // Form inputs use `source` prop to identify their field name
      if (typeof props.source === 'string') {
        map.set(props.source, tabName)
      }

      // Recursively process nested children (e.g., within layout components)
      if (props.children) {
        extractFieldSources(props.children as ReactNode, tabName)
      }
    })
  }

  // Process each tab's children to build the complete field-to-tab mapping
  for (const tab of tabs) {
    extractFieldSources(tab.children, tab.name)
  }

  return map
}

/**
 * Get the URL path segment for a tab.
 *
 * URL Structure Convention:
 * - First tab (index 0): No path segment (uses base URL)
 * - Other tabs: Use their `path` prop, or fall back to their name
 *
 * This follows react-admin's pattern where the default tab doesn't add
 * a path segment, keeping URLs clean for the most common case.
 *
 * @example
 * // Edit route: /users/123
 * // Tab "general" (index 0): /users/123 (no segment)
 * // Tab "settings" (index 1): /users/123/settings
 */
function getTabFullPath(tab: TabInfo, index: number): string {
  // First tab uses empty path to keep base URL clean
  if (index === 0) return ''
  // Other tabs use their explicit path or fall back to name
  return tab.path || index.toString()
}

/**
 * Find a tab by its URL path segment.
 * Returns the tab index if found, -1 otherwise.
 */
function findTabByPath(tabs: TabInfo[], urlPath: string): number {
  return tabs.findIndex((tab, index) => {
    const tabPath = getTabFullPath(tab, index)
    return tabPath === urlPath
  })
}

/**
 * Hook to extract the form's base path from the current URL.
 * This is the URL without any tab path segments.
 *
 * Supports two route patterns:
 * - Edit routes: /{resource}/{id}/* -> /{resource}/{id}
 * - Create routes: /{resource}/create/* -> /{resource}/create
 *
 * @returns The base path, or empty string if not in a recognized route
 */
function useFormRootPath(): string {
  let location: { pathname: string }
  try {
    location = useLocation()
  } catch {
    // Not in a router context - URL sync won't work
    return ''
  }

  // Try edit route pattern first: :resource/:id/*
  const editMatch = matchPath(':resource/:id/*', location.pathname)
  if (editMatch) {
    return editMatch.pathnameBase
  }

  // Try create route pattern: :resource/create/*
  const createMatch = matchPath(':resource/create/*', location.pathname)
  if (createMatch) {
    return createMatch.pathnameBase
  }

  // Unknown route pattern
  return ''
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * TabbedForm - Organizes form inputs into accessible tabs
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Home, End)
 * - URL synchronization for deep-linking
 * - Per-tab error indicators with counts
 * - Per-tab dirty state tracking
 * - Auto-navigation to first tab with errors
 *
 * @example Basic usage
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
 * @example With URL synchronization
 * ```tsx
 * <TabbedForm syncWithLocation>
 *   <FormTab label="Profile" name="profile">
 *     <TextInput source="name" />
 *   </FormTab>
 *   <FormTab label="Security" name="security" path="security">
 *     <TextInput source="password" />
 *   </FormTab>
 * </TabbedForm>
 * // URL changes: /users/1 -> /users/1/security
 * ```
 */

export function TabbedForm({
  children,
  className,
  defaultTab,
  onTabChange,
  syncWithLocation = false,
  locationKey: _locationKey = 'tab',
  mode: _mode,
  defaultValues: _defaultValues,
  warnWhenUnsavedChanges: _warnWhenUnsavedChanges,
  toolbar: _toolbar,
  onSubmit: _onSubmit,
}: TabbedFormProps) {
  // ---------------------------------------------------------------------------
  // Tab Configuration
  // ---------------------------------------------------------------------------

  // Extract tab configuration from FormTab children
  const tabs = useMemo(() => extractTabs(children), [children])

  // Build field-to-tab mapping for error/dirty state association
  const fieldTabMap = useMemo(() => buildFieldTabMap(tabs), [tabs])

  // ---------------------------------------------------------------------------
  // Form Context Integration
  // ---------------------------------------------------------------------------

  // Get form context for dirty/error state tracking
  // Falls back to empty state if no FormContext is available
  const formContext = useFormContext()
  const { formState } = formContext || { formState: { errors: {}, dirtyFields: {} } }

  // ---------------------------------------------------------------------------
  // Router Integration for URL Sync
  // ---------------------------------------------------------------------------

  // Router hooks for URL synchronization (optional feature)
  let location: { pathname: string } | undefined
  let navigate: ((to: string, options?: NavigateOptions) => void) | undefined
  try {
    location = useLocation()
    navigate = useNavigate()
  } catch {
    // Not in a router context - URL sync will be disabled
  }

  const formRootPath = useFormRootPath()

  // Track if this is the initial mount to avoid unnecessary URL updates
  const isInitialMount = useRef(true)

  /**
   * Extract the tab path segment from the current URL.
   * Returns the portion of the pathname after the form's base path.
   */
  const getTabPathFromUrl = useCallback((): string => {
    if (!location || !formRootPath) return ''
    // Extract the portion after the base path (e.g., "/users/1/settings" -> "settings")
    const remaining = location.pathname.slice(formRootPath.length)
    // Remove leading slash if present
    return remaining.replace(/^\//, '')
  }, [location, formRootPath])

  /**
   * Determine the initial active tab based on:
   * 1. URL path (if syncWithLocation is enabled)
   * 2. defaultTab prop
   * 3. First available tab
   */
  const getInitialTab = useCallback(() => {
    // Priority 1: URL-based tab selection (when sync enabled)
    if (syncWithLocation && location) {
      const urlTabPath = getTabPathFromUrl()
      const matchingTabIndex = findTabByPath(tabs, urlTabPath)
      if (matchingTabIndex >= 0) {
        return tabs[matchingTabIndex]!.name
      }
      // If URL has an invalid tab path, fall through to defaults
      // This handles bookmarked URLs with tabs that no longer exist
    }

    // Priority 2: Explicit default tab (if it exists)
    if (defaultTab && tabs.some((t) => t.name === defaultTab)) {
      return defaultTab
    }

    // Priority 3: First tab
    return tabs[0]?.name || ''
  }, [syncWithLocation, location, getTabPathFromUrl, defaultTab, tabs])

  const [activeTab, setActiveTabState] = useState(getInitialTab)

  // ---------------------------------------------------------------------------
  // URL Synchronization Effects
  // ---------------------------------------------------------------------------

  /**
   * Sync tab state with URL changes (browser back/forward navigation).
   * This effect runs when the URL changes externally (not from our navigation).
   */
  useEffect(() => {
    if (!syncWithLocation || !location) return

    const urlTabPath = getTabPathFromUrl()
    const matchingTabIndex = findTabByPath(tabs, urlTabPath)

    if (matchingTabIndex >= 0) {
      const matchingTab = tabs[matchingTabIndex]!
      // Only update if the tab actually changed (avoid loops)
      if (matchingTab.name !== activeTab) {
        setActiveTabState(matchingTab.name)
      }
    }
    // Note: We intentionally don't handle invalid URL paths here.
    // The user stays on their current tab if they navigate to an invalid tab URL.
  }, [syncWithLocation, location?.pathname, getTabPathFromUrl, tabs, activeTab])

  // Mark initial mount as complete after first render
  useEffect(() => {
    isInitialMount.current = false
  }, [])

  // ---------------------------------------------------------------------------
  // Tab Change Handler
  // ---------------------------------------------------------------------------

  /**
   * Handle tab changes from user interaction or programmatic updates.
   * Updates both local state and URL (if syncWithLocation is enabled).
   */
  const setActiveTab = useCallback(
    (tabName: string) => {
      // Validate that the requested tab exists
      const tabIndex = tabs.findIndex((t) => t.name === tabName)
      if (tabIndex < 0) {
        // Silently ignore attempts to switch to non-existent tabs
        // This handles edge cases like stale callbacks
        return
      }

      // Update local state
      setActiveTabState(tabName)

      // Fire callback for external state management
      onTabChange?.(tabName)

      // Update URL if sync is enabled
      if (syncWithLocation && navigate && formRootPath) {
        const tabPath = getTabFullPath(tabs[tabIndex]!, tabIndex)
        const newPath = tabPath ? `${formRootPath}/${tabPath}` : formRootPath
        // Use replace on initial mount to avoid polluting browser history
        // Use push for user-initiated tab changes to enable back navigation
        navigate(newPath)
      }
    },
    [onTabChange, syncWithLocation, navigate, formRootPath, tabs]
  )

  // ---------------------------------------------------------------------------
  // Error & Dirty State Tracking
  // ---------------------------------------------------------------------------

  /**
   * Get the names of all tabs that contain fields with validation errors.
   * Used to display error indicators on tab triggers.
   */
  const getErrorTabs = useCallback(() => {
    const errorTabs = new Set<string>()
    const errorFields = Object.keys(formState.errors)

    for (const field of errorFields) {
      const tabName = fieldTabMap.get(field)
      if (tabName) {
        errorTabs.add(tabName)
      }
    }

    return Array.from(errorTabs)
  }, [formState.errors, fieldTabMap])

  /**
   * Get the count of validation errors for a specific tab.
   * Used to display error count badges on tab triggers.
   */
  const getTabErrorCount = useCallback(
    (tabName: string) => {
      let count = 0
      const errorFields = Object.keys(formState.errors)

      for (const field of errorFields) {
        if (fieldTabMap.get(field) === tabName) {
          count++
        }
      }

      return count
    },
    [formState.errors, fieldTabMap]
  )

  /**
   * Check if a specific tab has any validation errors.
   */
  const tabHasError = useCallback(
    (tabName: string) => {
      return getTabErrorCount(tabName) > 0
    },
    [getTabErrorCount]
  )

  /**
   * Get the names of all tabs that contain dirty (modified) fields.
   */
  const getDirtyTabs = useCallback(() => {
    const dirtyTabs = new Set<string>()
    const dirtyFields = Object.keys(formState.dirtyFields)

    for (const field of dirtyFields) {
      const tabName = fieldTabMap.get(field)
      if (tabName) {
        dirtyTabs.add(tabName)
      }
    }

    return Array.from(dirtyTabs)
  }, [formState.dirtyFields, fieldTabMap])

  /**
   * Check if a specific tab has any dirty (modified) fields.
   */
  const isTabDirty = useCallback(
    (tabName: string) => {
      const dirtyFields = Object.keys(formState.dirtyFields)
      return dirtyFields.some((field) => fieldTabMap.get(field) === tabName)
    },
    [formState.dirtyFields, fieldTabMap]
  )

  // ---------------------------------------------------------------------------
  // Auto-Navigation on Validation Errors
  // ---------------------------------------------------------------------------

  /**
   * Automatically navigate to the first tab with validation errors.
   * This improves UX by ensuring users see the errors immediately after
   * a failed form submission, even if they were on a different tab.
   */
  useEffect(() => {
    const hasErrors = Object.keys(formState.errors).length > 0
    if (!hasErrors) return

    const errorTabs = getErrorTabs()
    const currentTabHasErrors = errorTabs.includes(activeTab)

    // Only switch tabs if the current tab doesn't have errors
    // (user may want to fix current tab's errors first)
    if (errorTabs.length > 0 && !currentTabHasErrors) {
      // Find the first tab (in DOM order) that has errors
      const firstErrorTab = tabs.find((t) => errorTabs.includes(t.name))
      if (firstErrorTab) {
        setActiveTab(firstErrorTab.name)
      }
    }
  }, [formState.errors, activeTab, getErrorTabs, tabs, setActiveTab])

  // ---------------------------------------------------------------------------
  // Context Value
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Keyboard Navigation Handler
  // ---------------------------------------------------------------------------

  /**
   * Handle keyboard navigation within the tab list.
   * Implements WAI-ARIA tabs pattern:
   * - Arrow Left/Right: Move to adjacent tab (with wrapping)
   * - Home: Move to first tab
   * - End: Move to last tab
   * Disabled tabs are automatically skipped.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const currentIndex = tabs.findIndex((t) => t.name === activeTab)
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowRight':
          // Move to next tab, wrap to start if at end
          newIndex = currentIndex + 1
          if (newIndex >= tabs.length) newIndex = 0
          break
        case 'ArrowLeft':
          // Move to previous tab, wrap to end if at start
          newIndex = currentIndex - 1
          if (newIndex < 0) newIndex = tabs.length - 1
          break
        case 'Home':
          // Jump to first tab
          newIndex = 0
          break
        case 'End':
          // Jump to last tab
          newIndex = tabs.length - 1
          break
        default:
          // Ignore other keys
          return
      }

      // Skip disabled tabs by continuing in the same direction
      const maxIterations = tabs.length // Prevent infinite loops if all tabs are disabled
      let iterations = 0
      while (tabs[newIndex]?.disabled && iterations < maxIterations) {
        if (event.key === 'ArrowRight' || event.key === 'End') {
          newIndex = newIndex + 1 >= tabs.length ? 0 : newIndex + 1
        } else {
          newIndex = newIndex - 1 < 0 ? tabs.length - 1 : newIndex - 1
        }
        iterations++
      }

      // Activate the new tab if it changed
      const newTab = tabs[newIndex]
      if (newIndex !== currentIndex && newTab && !newTab.disabled) {
        event.preventDefault()
        setActiveTab(newTab.name)
        // Focus the newly activated tab button
        const tabElement = document.getElementById(`tab-${newTab.name}`)
        tabElement?.focus()
      }
    },
    [activeTab, tabs, setActiveTab]
  )

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Handle empty state gracefully
  if (tabs.length === 0) {
    return (
      <div data-slot="tabbed-form" data-testid="tabbed-form" className={className}>
        <div role="tablist" data-testid="tabbed-form-tablist" />
      </div>
    )
  }

  return (
    <TabbedFormContext.Provider value={contextValue}>
      <div data-slot="tabbed-form" data-testid="tabbed-form" className={cn('w-full', className)}>
        {/* Tab List - follows shadcn/ui Tabs pattern */}
        <div
          role="tablist"
          aria-orientation="horizontal"
          data-testid="tabbed-form-tablist"
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
                data-testid={`tab-${tab.name}`}
                data-state={isActive ? 'active' : 'inactive'}
                data-has-error={hasError ? 'true' : undefined}
                data-error-count={errorCount > 0 ? String(errorCount) : undefined}
                data-dirty={isDirty ? 'true' : undefined}
                disabled={tab.disabled}
                tabIndex={isActive ? 0 : -1}
                onClick={() => !tab.disabled && setActiveTab(tab.name)}
                className={cn(
                  // Base tab trigger styles following shadcn/ui Tabs pattern
                  'form-tab inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:pointer-events-none disabled:opacity-50',
                  // Active/inactive state
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:bg-background/50',
                  // Error state styling
                  hasError && 'text-destructive',
                  tab.triggerClassName
                )}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted-foreground/20 px-1.5 text-xs font-medium">
                    {tab.count}
                  </span>
                )}
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

// Attach FormTab as static property for <TabbedForm.Tab> pattern
TabbedForm.Tab = FormTab

// Re-export FormTab for convenience
export { FormTab } from './FormTab'
export type { FormTabProps } from './FormTab'
