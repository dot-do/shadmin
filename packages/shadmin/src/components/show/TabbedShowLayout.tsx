/**
 * TabbedShowLayout Component
 *
 * A layout container that organizes show (read-only) fields into tabs with:
 * - Accessible keyboard navigation (Arrow keys, Home, End)
 * - Optional URL synchronization for deep-linking to specific tabs
 * - Optional badge counts on tabs (e.g., related item counts)
 *
 * @module TabbedShowLayout
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
  type ReactNode,
} from 'react'
import { useLocation, useNavigate, matchPath, type NavigateOptions } from 'react-router'
import { cn } from '../../utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Tab information extracted from Tab children.
 * This normalized structure is used internally to render tabs consistently.
 */
export interface ShowTabInfo {
  /** Unique identifier for the tab */
  name: string
  /** Display label shown on the tab trigger */
  label: string
  /** Optional icon element to display before the label */
  icon?: ReactNode | undefined
  /** Whether the tab is disabled and cannot be selected */
  disabled?: boolean | undefined
  /** Additional CSS class for the tab panel content area */
  className?: string | undefined
  /** Additional CSS class for the tab trigger button */
  triggerClassName?: string | undefined
  /** The tab panel content (fields, etc.) */
  children: ReactNode
  /** Optional count badge to display on the tab (e.g., related item count) */
  count?: number | ReactNode | undefined
  /** Path segment for URL synchronization */
  path?: string | undefined
}

/**
 * Context value provided by TabbedShowLayout to its descendants.
 */
export interface TabbedShowLayoutContextValue {
  /** Currently active tab name */
  activeTab: string
  /** Programmatically switch to a different tab */
  setActiveTab: (tabName: string) => void
  /** Array of all tab configurations */
  tabs: ShowTabInfo[]
}

// ============================================================================
// Context & Hooks
// ============================================================================

const TabbedShowLayoutContext = createContext<TabbedShowLayoutContextValue | undefined>(undefined)
TabbedShowLayoutContext.displayName = 'TabbedShowLayoutContext'

/**
 * Hook to access TabbedShowLayout context.
 * Must be used within a TabbedShowLayout component.
 *
 * @throws {Error} When used outside of a TabbedShowLayout
 */
export function useTabbedShowLayoutContext(): TabbedShowLayoutContextValue {
  const context = useContext(TabbedShowLayoutContext)
  if (!context) {
    throw new Error('useTabbedShowLayoutContext must be used within a TabbedShowLayout')
  }
  return context
}

/**
 * Hook to optionally access TabbedShowLayout context.
 * Returns undefined when used outside of a TabbedShowLayout (doesn't throw).
 */
export function useOptionalTabbedShowLayoutContext(): TabbedShowLayoutContextValue | undefined {
  return useContext(TabbedShowLayoutContext)
}

// ============================================================================
// Tab Component Props
// ============================================================================

/**
 * Props for Tab component
 */
export interface TabProps {
  /** Label displayed on the tab trigger */
  label: string
  /** Unique name/identifier for the tab. If not provided, generated from label */
  name?: string
  /** Content to render inside the tab panel */
  children?: ReactNode
  /** Optional icon to display before the label */
  icon?: ReactNode
  /** Whether the tab is disabled */
  disabled?: boolean
  /** Additional CSS class for the tab panel */
  className?: string
  /** Additional CSS class for the tab trigger */
  triggerClassName?: string
  /** Optional count badge to display on the tab (e.g., related item count) */
  count?: number | ReactNode
  /** Optional path segment for URL synchronization */
  path?: string
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a URL-safe slug from a label string.
 * Used when Tab doesn't have an explicit name prop.
 */
export function generateShowTabName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ============================================================================
// Tab Configuration Component
// ============================================================================

/**
 * Tab - Configuration component for TabbedShowLayout tabs.
 *
 * This is a "configuration" component - it doesn't render anything on its own.
 * TabbedShowLayout extracts the props and renders the actual tab UI.
 * This pattern allows for a declarative API similar to react-admin.
 *
 * @example
 * ```tsx
 * <TabbedShowLayout>
 *   <Tab label="Summary">
 *     <TextField source="name" />
 *     <TextField source="email" />
 *   </Tab>
 *   <Tab label="Details" icon={<InfoIcon />}>
 *     <TextField source="description" />
 *   </Tab>
 * </TabbedShowLayout>
 * ```
 */
export function Tab({
  label: _label,
  name: _name,
  children: _children,
  icon: _icon,
  disabled: _disabled,
  className: _className,
  triggerClassName: _triggerClassName,
  count: _count,
  path: _path,
}: TabProps) {
  // This component is a "configuration" component
  // TabbedShowLayout reads the props and renders the actual tab UI
  return null
}

Tab.displayName = 'Tab'

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for TabbedShowLayout component
 */
export interface TabbedShowLayoutProps {
  /** Tab children defining each tab */
  children?: ReactNode
  /** Additional CSS class for the layout container */
  className?: string
  /** Default tab to show on initial mount (by name) */
  defaultTab?: string
  /** Callback fired when the active tab changes */
  onTabChange?: (tabName: string) => void
  /**
   * Whether to sync active tab with the URL.
   * When enabled, tab changes update the URL path and browser back/forward works.
   * @default false
   */
  syncWithLocation?: boolean
  /**
   * URL parameter key for tab sync.
   * Currently unused - tabs use path segments instead of query params.
   * @default 'tab'
   * @deprecated Use path prop on Tab instead
   */
  locationKey?: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /**
   * Gap between fields within each tab panel.
   * @default 'gap-4'
   */
  gap?: string
}

/**
 * Extract tab information from Tab children.
 * Filters out non-Tab elements and normalizes props into ShowTabInfo objects.
 */
function extractTabs(children: ReactNode): ShowTabInfo[] {
  const tabs: ShowTabInfo[] = []

  Children.forEach(children, (child) => {
    // Skip null, undefined, booleans, and non-element children
    if (!isValidElement(child)) return
    // Only process Tab components (ignore other elements)
    if (child.type !== Tab) return

    const props = child.props as TabProps
    // Generate name from label if not explicitly provided
    const name = props.name || generateShowTabName(props.label)

    tabs.push({
      name,
      label: props.label,
      icon: props.icon,
      disabled: props.disabled,
      className: props.className,
      triggerClassName: props.triggerClassName,
      children: props.children,
      count: props.count,
      path: props.path,
    })
  })

  return tabs
}

/**
 * Get the URL path segment for a tab.
 *
 * URL Structure Convention:
 * - First tab (index 0): No path segment (uses base URL)
 * - Other tabs: Use their `path` prop, or fall back to their index
 */
function getShowTabFullPath(tab: ShowTabInfo, index: number): string {
  // First tab uses empty path to keep base URL clean
  if (index === 0) return ''
  // Other tabs use their explicit path or fall back to index
  return tab.path || index.toString()
}

/**
 * Find a tab by its URL path segment.
 * Returns the tab index if found, -1 otherwise.
 */
function findTabByPath(tabs: ShowTabInfo[], urlPath: string): number {
  return tabs.findIndex((tab, index) => {
    const tabPath = getShowTabFullPath(tab, index)
    return tabPath === urlPath
  })
}

/**
 * Hook to extract the show page's base path from the current URL.
 * This is the URL without any tab path segments.
 *
 * Supports the show route pattern: /{resource}/{id}/show/*
 *
 * @returns The base path, or empty string if not in a recognized route
 */
function useShowRootPath(): string {
  let location: { pathname: string }
  try {
    location = useLocation()
  } catch {
    // Not in a router context - URL sync won't work
    return ''
  }

  // Match show route pattern: :resource/:id/show/*
  const showMatch = matchPath(':resource/:id/show/*', location.pathname)
  if (showMatch) {
    return showMatch.pathnameBase
  }

  // Unknown route pattern
  return ''
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * TabbedShowLayout - Organizes show (read-only) fields into accessible tabs
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Home, End)
 * - URL synchronization for deep-linking
 * - Optional badge counts on tabs
 *
 * @example Basic usage
 * ```tsx
 * <Show resource="posts" id={1}>
 *   <TabbedShowLayout>
 *     <Tab label="Summary">
 *       <TextField source="title" label="Title" />
 *       <DateField source="createdAt" label="Created" />
 *     </Tab>
 *     <Tab label="Content">
 *       <RichTextField source="body" label="Body" />
 *     </Tab>
 *   </TabbedShowLayout>
 * </Show>
 * ```
 *
 * @example With URL synchronization
 * ```tsx
 * <TabbedShowLayout syncWithLocation>
 *   <Tab label="Details" name="details">
 *     <TextField source="name" />
 *   </Tab>
 *   <Tab label="Related" name="related" path="related">
 *     <ReferenceManyField reference="comments" target="post_id">
 *       <Datagrid>...</Datagrid>
 *     </ReferenceManyField>
 *   </Tab>
 * </TabbedShowLayout>
 * // URL changes: /posts/1/show -> /posts/1/show/related
 * ```
 */
export function TabbedShowLayout({
  children,
  className,
  defaultTab,
  onTabChange,
  syncWithLocation = false,
  locationKey: _locationKey = 'tab',
  record: recordProp,
  gap = 'gap-4',
}: TabbedShowLayoutProps) {
  // ---------------------------------------------------------------------------
  // Record & Tab Configuration
  // ---------------------------------------------------------------------------

  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Extract tab configuration from Tab children
  const tabs = useMemo(() => extractTabs(children), [children])

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

  const showRootPath = useShowRootPath()

  // Track if this is the initial mount to avoid unnecessary URL updates
  const isInitialMount = useRef(true)

  /**
   * Extract the tab path segment from the current URL.
   * Returns the portion of the pathname after the show page's base path.
   */
  const getTabPathFromUrl = useCallback((): string => {
    if (!location || !showRootPath) return ''
    // Extract the portion after the base path (e.g., "/posts/1/show/related" -> "related")
    const remaining = location.pathname.slice(showRootPath.length)
    // Remove leading slash if present
    return remaining.replace(/^\//, '')
  }, [location, showRootPath])

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
   * This effect runs when the URL changes externally.
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
        return
      }

      // Update local state
      setActiveTabState(tabName)

      // Fire callback for external state management
      onTabChange?.(tabName)

      // Update URL if sync is enabled
      if (syncWithLocation && navigate && showRootPath) {
        const tabPath = getShowTabFullPath(tabs[tabIndex]!, tabIndex)
        const newPath = tabPath ? `${showRootPath}/${tabPath}` : showRootPath
        navigate(newPath)
      }
    },
    [onTabChange, syncWithLocation, navigate, showRootPath, tabs]
  )

  // ---------------------------------------------------------------------------
  // Keyboard Navigation Handler
  // ---------------------------------------------------------------------------

  /**
   * Handle keyboard navigation within the tab list.
   * Implements WAI-ARIA tabs pattern.
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
      const targetTab = tabs[newIndex]
      if (newIndex !== currentIndex && targetTab && !targetTab.disabled) {
        event.preventDefault()
        setActiveTab(targetTab.name)
        // Focus the newly activated tab button
        const tabElement = document.getElementById(`show-tab-${targetTab.name}`)
        tabElement?.focus()
      }
    },
    [activeTab, tabs, setActiveTab]
  )

  // ---------------------------------------------------------------------------
  // Context Value
  // ---------------------------------------------------------------------------

  const contextValue = useMemo<TabbedShowLayoutContextValue>(
    () => ({
      activeTab,
      setActiveTab,
      tabs,
    }),
    [activeTab, setActiveTab, tabs]
  )

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Don't render if no record is available
  if (!record) {
    return null
  }

  // Handle empty state gracefully
  if (tabs.length === 0) {
    return (
      <div
        data-slot="tabbed-show-layout"
        data-testid="tabbed-show-layout"
        className={className}
      >
        <div role="tablist" data-testid="tabbed-show-tablist" />
      </div>
    )
  }

  return (
    <TabbedShowLayoutContext.Provider value={contextValue}>
      <div
        data-slot="tabbed-show-layout"
        data-testid="tabbed-show-layout"
        className={cn('w-full', className)}
      >
        {/* Tab List */}
        <div
          role="tablist"
          aria-orientation="horizontal"
          data-testid="tabbed-show-tablist"
          className="inline-flex h-10 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground"
          onKeyDown={handleKeyDown}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name

            return (
              <button
                key={tab.name}
                id={`show-tab-${tab.name}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`show-tabpanel-${tab.name}`}
                data-state={isActive ? 'active' : 'inactive'}
                data-testid={`show-tab-${tab.name}`}
                disabled={tab.disabled}
                tabIndex={isActive ? 0 : -1}
                onClick={() => !tab.disabled && setActiveTab(tab.name)}
                className={cn(
                  'show-tab',
                  'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:pointer-events-none disabled:opacity-50',
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:bg-background/50 hover:text-foreground/80',
                  tab.triggerClassName
                )}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
                {tab.count != null && (typeof tab.count !== 'number' || tab.count > 0) && (
                  <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground px-1.5">
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Panels */}
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name

          return (
            <div
              key={tab.name}
              role="tabpanel"
              id={`show-tabpanel-${tab.name}`}
              aria-labelledby={`show-tab-${tab.name}`}
              data-state={isActive ? 'active' : 'inactive'}
              data-testid={`show-tabpanel-${tab.name}`}
              hidden={!isActive}
              className={cn(
                'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                !isActive && 'hidden',
                'flex flex-col',
                gap,
                tab.className
              )}
              tabIndex={0}
            >
              {isActive && tab.children}
            </div>
          )
        })}
      </div>
    </TabbedShowLayoutContext.Provider>
  )
}

TabbedShowLayout.displayName = 'TabbedShowLayout'

// Attach Tab as static property for <TabbedShowLayout.Tab> pattern
TabbedShowLayout.Tab = Tab
