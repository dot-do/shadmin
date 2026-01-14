/**
 * Performance profiling utilities for shadmin contexts
 *
 * Development-only tools to identify excessive re-renders and performance bottlenecks.
 * All utilities are no-ops in production to ensure zero overhead.
 *
 * @example
 * ```tsx
 * // In a component
 * import { useRenderMonitor } from 'shadmin'
 *
 * function MyComponent() {
 *   useRenderMonitor('MyComponent')
 *   // ...
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Create a profiled provider
 * import { createProfiledProvider } from 'shadmin'
 *
 * const ProfiledListProvider = createProfiledProvider(ListContext, 'ListContext')
 * ```
 */

// React imports are lazy-loaded to avoid issues in non-React contexts
// and to enable testing of non-React functionality
import { logger } from './logger'

/**
 * Check if we're in development mode
 * Evaluated at call time to support testing
 */
const isDev = (): boolean => process.env.NODE_ENV === 'development'

/**
 * Configuration for render monitoring
 */
export interface RenderMonitorConfig {
  /** Threshold for warning about excessive renders (default: 10) */
  warnThreshold?: number
  /** Whether to log every render (default: false, only logs warnings) */
  verbose?: boolean
  /** Custom warning handler (default: console.warn) */
  onExcessiveRenders?: (componentName: string, count: number) => void
}

/**
 * Global configuration for render monitoring
 */
let globalConfig: RenderMonitorConfig = {
  warnThreshold: 10,
  verbose: false,
}

/**
 * Configure global render monitoring settings
 *
 * @example
 * ```ts
 * import { configureRenderMonitor } from 'shadmin'
 *
 * configureRenderMonitor({
 *   warnThreshold: 5,
 *   verbose: true,
 *   onExcessiveRenders: (name, count) => {
 *     // Send to analytics
 *     analytics.track('excessive_renders', { component: name, count })
 *   },
 * })
 * ```
 */
export function configureRenderMonitor(config: Partial<RenderMonitorConfig>): void {
  globalConfig = { ...globalConfig, ...config }
}

/**
 * Get the current render monitor configuration
 * Primarily for testing purposes
 */
export function getRenderMonitorConfig(): RenderMonitorConfig {
  return { ...globalConfig }
}

/**
 * Result type for useRenderMonitor hook
 */
export interface RenderMonitorResult {
  /** Current render count */
  renderCount: number
  /** Get current render count (useful in callbacks) */
  getRenderCount: () => number
  /** Reset the render counter */
  reset: () => void
}

/**
 * Hook to monitor component re-renders in development mode.
 * No-op in production - zero overhead.
 *
 * @param componentName - Name to identify the component in logs
 * @param config - Optional configuration overrides
 * @returns Render monitoring utilities
 *
 * @example
 * ```tsx
 * function ListRow({ record }) {
 *   const { renderCount } = useRenderMonitor('ListRow', { warnThreshold: 5 })
 *
 *   return <div>{record.name} (renders: {renderCount})</div>
 * }
 * ```
 */
export function useRenderMonitor(
  componentName: string,
  config?: Partial<RenderMonitorConfig>
): RenderMonitorResult {
  // Import React hooks dynamically to avoid bundling issues
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useRef, useEffect } = require('react')

  const renderCountRef = useRef(0)
  const mergedConfig = { ...globalConfig, ...config }

  // Check if we're in development mode (evaluated once per render)
  const isDevMode = isDev()

  // Only increment render count in development
  if (isDevMode) {
    renderCountRef.current++
  }
  const currentCount = renderCountRef.current

  // Log in development - useEffect called unconditionally to satisfy React hooks rules
  useEffect(() => {
    // Skip all logic in production
    if (!isDevMode) return

    if (mergedConfig.verbose) {
      logger.debug(`[RenderMonitor] ${componentName}: Render #${currentCount}`)
    }

    // Check threshold
    if (mergedConfig.warnThreshold && currentCount >= mergedConfig.warnThreshold) {
      const message = `[RenderMonitor] ${componentName}: Excessive re-renders detected (${currentCount})`
      logger.warn(message)
      mergedConfig.onExcessiveRenders?.(componentName, currentCount)
    }
  })

  // Return no-op values in production, actual values in development
  if (!isDevMode) {
    return {
      renderCount: 0,
      getRenderCount: () => 0,
      reset: () => {},
    }
  }

  return {
    renderCount: currentCount,
    getRenderCount: () => renderCountRef.current,
    reset: () => {
      renderCountRef.current = 0
    },
  }
}

/**
 * Props for profiled provider components
 */
export interface ProfiledProviderProps<T> {
  value: T
  children: React.ReactNode
}

/**
 * Create a profiled version of a Context.Provider that logs renders in development.
 * Returns the original Provider in production for zero overhead.
 *
 * @param Context - The React Context to profile
 * @param name - Display name for logging
 * @returns A component that wraps Context.Provider with profiling
 *
 * @example
 * ```tsx
 * import { createProfiledProvider, ListContext } from 'shadmin'
 *
 * const ProfiledListProvider = createProfiledProvider(ListContext, 'ListContext')
 *
 * // Use in place of ListContext.Provider
 * <ProfiledListProvider value={listState}>
 *   <Datagrid />
 * </ProfiledListProvider>
 * ```
 */
export function createProfiledProvider<T>(
  Context: React.Context<T>,
  name: string
): React.ComponentType<ProfiledProviderProps<T>> {
  // Import React dynamically
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react')
  const { useRef, useEffect, createElement } = React

  // In production, return a simple wrapper around the original provider
  if (!isDev()) {
    return function Provider({ value, children }: ProfiledProviderProps<T>) {
      return createElement(Context.Provider, { value }, children)
    }
  }

  // In development, create a profiled wrapper
  function ProfiledProvider({ value, children }: ProfiledProviderProps<T>) {
    const renderCountRef = useRef(0) as { current: number }
    const prevValueRef = useRef(value) as { current: T }

    renderCountRef.current++

    // Check if value reference changed
    const valueChanged = prevValueRef.current !== value
    prevValueRef.current = value

    useEffect(() => {
      logger.debug(
        `[ProfiledProvider] ${name}: Render #${renderCountRef.current}`,
        valueChanged ? '(value changed)' : '(value unchanged)'
      )
    })

    return createElement(Context.Provider, { value }, children)
  }

  ProfiledProvider.displayName = `Profiled(${name})`

  return ProfiledProvider
}

/**
 * Render timing information
 */
export interface RenderTiming {
  /** Component name */
  name: string
  /** Phase: 'mount' or 'update' */
  phase: 'mount' | 'update'
  /** Actual render duration in milliseconds */
  actualDuration: number
  /** Base duration (render time without memoization) */
  baseDuration: number
  /** Start time relative to first render */
  startTime: number
  /** Commit time relative to first render */
  commitTime: number
}

/**
 * Registry of render timings for analysis
 */
const renderTimings: RenderTiming[] = []

/**
 * Record a render timing from React Profiler
 *
 * @example
 * ```tsx
 * import { Profiler } from 'react'
 * import { recordRenderTiming } from 'shadmin'
 *
 * <Profiler id="ListContext" onRender={recordRenderTiming}>
 *   <ListContextProvider value={value}>
 *     {children}
 *   </ListContextProvider>
 * </Profiler>
 * ```
 */
export function recordRenderTiming(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
): void {
  if (!isDev()) return

  renderTimings.push({
    name: id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  })

  // Keep only last 1000 entries to prevent memory leaks
  if (renderTimings.length > 1000) {
    renderTimings.shift()
  }
}

/**
 * Get recorded render timings for analysis
 * Optionally filter by component name
 *
 * @example
 * ```ts
 * import { getRenderTimings } from 'shadmin'
 *
 * // Get all timings
 * const allTimings = getRenderTimings()
 *
 * // Get timings for specific component
 * const listTimings = getRenderTimings('ListContext')
 *
 * // Analyze average render time
 * const avgTime = listTimings.reduce((sum, t) => sum + t.actualDuration, 0) / listTimings.length
 * ```
 */
export function getRenderTimings(componentName?: string): RenderTiming[] {
  if (!isDev()) return []

  if (componentName) {
    return renderTimings.filter((t) => t.name === componentName)
  }
  return [...renderTimings]
}

/**
 * Clear recorded render timings
 */
export function clearRenderTimings(): void {
  renderTimings.length = 0
}

/**
 * Get a summary of render timings for all tracked components
 *
 * @example
 * ```ts
 * import { getRenderSummary } from 'shadmin'
 *
 * const summary = getRenderSummary()
 * // {
 * //   ListContext: { count: 15, avgDuration: 2.3, maxDuration: 8.1 },
 * //   RecordContext: { count: 45, avgDuration: 0.8, maxDuration: 3.2 },
 * // }
 * ```
 */
export function getRenderSummary(): Record<
  string,
  { count: number; avgDuration: number; maxDuration: number }
> {
  if (!isDev()) return {}

  const summary: Record<string, { count: number; totalDuration: number; maxDuration: number }> = {}

  for (const timing of renderTimings) {
    let entry = summary[timing.name]
    if (!entry) {
      entry = { count: 0, totalDuration: 0, maxDuration: 0 }
      summary[timing.name] = entry
    }
    entry.count++
    entry.totalDuration += timing.actualDuration
    entry.maxDuration = Math.max(entry.maxDuration, timing.actualDuration)
  }

  // Convert to final format with averages
  const result: Record<string, { count: number; avgDuration: number; maxDuration: number }> = {}
  for (const [name, data] of Object.entries(summary)) {
    result[name] = {
      count: data.count,
      avgDuration: data.totalDuration / data.count,
      maxDuration: data.maxDuration,
    }
  }

  return result
}
