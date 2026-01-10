/**
 * TabbedShowLayout Component
 * Organizes show fields into tabs using accessible tab navigation
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
import { cn } from '../../utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

/**
 * Tab information extracted from Tab children
 */
export interface ShowTabInfo {
  name: string
  label: string
  icon?: ReactNode | undefined
  disabled?: boolean | undefined
  className?: string | undefined
  triggerClassName?: string | undefined
  children: ReactNode
  count?: number | ReactNode | undefined
  path?: string | undefined
}

/**
 * Context value for TabbedShowLayout
 */
export interface TabbedShowLayoutContextValue {
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
  tabs: ShowTabInfo[]
}

/**
 * TabbedShowLayout context
 */
const TabbedShowLayoutContext = createContext<TabbedShowLayoutContextValue | undefined>(undefined)

TabbedShowLayoutContext.displayName = 'TabbedShowLayoutContext'

/**
 * Hook to access TabbedShowLayout context
 */
export function useTabbedShowLayoutContext(): TabbedShowLayoutContextValue {
  const context = useContext(TabbedShowLayoutContext)
  if (!context) {
    throw new Error('useTabbedShowLayoutContext must be used within a TabbedShowLayout')
  }
  return context
}

/**
 * Hook to optionally access TabbedShowLayout context (doesn't throw if not available)
 */
export function useOptionalTabbedShowLayoutContext(): TabbedShowLayoutContextValue | undefined {
  return useContext(TabbedShowLayoutContext)
}

/**
 * Props for Tab component
 */
export interface TabProps {
  /**
   * Label displayed on the tab trigger
   */
  label: string
  /**
   * Unique name/identifier for the tab.
   * If not provided, will be generated from the label.
   */
  name?: string
  /**
   * Content to render inside the tab panel
   */
  children?: ReactNode
  /**
   * Optional icon to display before the label
   */
  icon?: ReactNode
  /**
   * Whether the tab is disabled
   */
  disabled?: boolean
  /**
   * Additional CSS class for the tab panel
   */
  className?: string
  /**
   * Additional CSS class for the tab trigger
   */
  triggerClassName?: string
  /**
   * Optional count badge to display on the tab
   */
  count?: number | ReactNode
  /**
   * Optional path for tab navigation (for URL sync)
   */
  path?: string
}

/**
 * Generate a slug from a label string
 */
export function generateShowTabName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Tab - Individual tab panel component for TabbedShowLayout
 *
 * This component is used as a child of TabbedShowLayout to define individual tabs.
 * It doesn't render anything on its own - TabbedShowLayout extracts the props and
 * renders the appropriate UI.
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

/**
 * Props for TabbedShowLayout component
 */
export interface TabbedShowLayoutProps {
  /**
   * Tab children
   */
  children?: ReactNode
  /**
   * Additional CSS class for the layout container
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
  /**
   * Optional record to use instead of RecordContext
   */
  record?: RaRecord
  /**
   * Gap between fields within each tab panel
   * @default 'gap-4'
   */
  gap?: string
}

/**
 * Extract tab information from Tab children
 */
function extractTabs(children: ReactNode): ShowTabInfo[] {
  const tabs: ShowTabInfo[] = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    if (child.type !== Tab) return

    const props = child.props as TabProps
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
 * TabbedShowLayout - Organizes show fields into accessible tabs
 *
 * @example
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
 *     <Tab label="Metadata">
 *       <TextField source="author" label="Author" />
 *       <ArrayField source="tags">
 *         <SingleFieldList>
 *           <ChipField source="name" />
 *         </SingleFieldList>
 *       </ArrayField>
 *     </Tab>
 *   </TabbedShowLayout>
 * </Show>
 * ```
 *
 * @example
 * ```tsx
 * // With URL sync
 * <TabbedShowLayout syncWithLocation>
 *   <Tab label="Details" name="details">
 *     <TextField source="name" />
 *   </Tab>
 * </TabbedShowLayout>
 * ```
 */
export function TabbedShowLayout({
  children,
  className,
  defaultTab,
  onTabChange,
  syncWithLocation = false,
  locationKey = 'tab',
  record: recordProp,
  gap = 'gap-4',
}: TabbedShowLayoutProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Extract tab configuration from children
  const tabs = useMemo(() => extractTabs(children), [children])

  // Get URL search params (simplified - in production would use router)
  const getUrlTab = useCallback(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get(locationKey)
  }, [locationKey])

  // Determine initial tab
  const getInitialTab = useCallback(() => {
    if (syncWithLocation) {
      const urlTab = getUrlTab()
      if (urlTab && tabs.some((t) => t.name === urlTab)) {
        return urlTab
      }
    }
    if (defaultTab && tabs.some((t) => t.name === defaultTab)) {
      return defaultTab
    }
    return tabs[0]?.name || ''
  }, [syncWithLocation, getUrlTab, defaultTab, tabs])

  const [activeTab, setActiveTabState] = useState(getInitialTab)

  // Sync with URL on mount
  useEffect(() => {
    if (syncWithLocation) {
      const urlTab = getUrlTab()
      if (urlTab && tabs.some((t) => t.name === urlTab)) {
        setActiveTabState(urlTab)
      }
    }
  }, [syncWithLocation, getUrlTab, tabs])

  // Handle tab change
  const setActiveTab = useCallback(
    (tabName: string) => {
      setActiveTabState(tabName)
      onTabChange?.(tabName)

      if (syncWithLocation && typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.set(locationKey, tabName)
        window.history.pushState({}, '', url.toString())
      }
    },
    [onTabChange, syncWithLocation, locationKey]
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

      const targetTab = tabs[newIndex]
      if (newIndex !== currentIndex && targetTab) {
        event.preventDefault()
        setActiveTab(targetTab.name)
        // Focus the new tab
        const tabElement = document.getElementById(`show-tab-${targetTab.name}`)
        tabElement?.focus()
      }
    },
    [activeTab, tabs, setActiveTab]
  )

  // Context value
  const contextValue = useMemo<TabbedShowLayoutContextValue>(
    () => ({
      activeTab,
      setActiveTab,
      tabs,
    }),
    [activeTab, setActiveTab, tabs]
  )

  // Don't render if no record
  if (!record) {
    return null
  }

  if (tabs.length === 0) {
    return (
      <div data-slot="tabbed-show-layout" className={className}>
        <div role="tablist" />
      </div>
    )
  }

  return (
    <TabbedShowLayoutContext.Provider value={contextValue}>
      <div data-slot="tabbed-show-layout" className={cn('w-full', className)}>
        {/* Tab List */}
        <div
          role="tablist"
          aria-orientation="horizontal"
          className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground"
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
