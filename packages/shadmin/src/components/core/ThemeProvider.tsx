/**
 * ThemeProvider Component
 * Provides theme context and applies CSS custom properties to document root
 *
 * Supports light/dark mode with system preference detection
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'

/**
 * Color value can be a string or nested object for color scales
 */
export type ColorValue = string | { [key: string]: string }

/**
 * Custom theme configuration
 */
export interface CustomTheme {
  colors?: {
    [key: string]: ColorValue
  }
  spacing?: {
    [key: string]: string
  }
  radii?: {
    [key: string]: string
  }
  fonts?: {
    [key: string]: string
  }
}

/**
 * Theme mode: light, dark, or system (follows OS preference)
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Resolved theme mode (always light or dark, never system)
 */
export type ResolvedThemeMode = 'light' | 'dark'

/**
 * Props for ThemeProvider component
 */
export interface CustomThemeProviderProps {
  children: ReactNode
  theme?: CustomTheme
  darkTheme?: CustomTheme
  defaultMode?: ThemeMode
}

/**
 * Theme context value returned by useTheme hook
 */
export interface ThemeContextValue {
  theme: CustomTheme
  mode: ThemeMode
  resolvedMode: ResolvedThemeMode
  isDarkMode: boolean
  setMode: (mode: ThemeMode) => void
  toggleDarkMode: () => void
  getThemeValue: (path: string, defaultValue?: string) => string | undefined
  getCssVariable: (name: string) => string
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Convert camelCase to kebab-case
 */
function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
}

/**
 * Deep merge two theme objects
 */
function mergeThemes(base: CustomTheme, override: CustomTheme): CustomTheme {
  const result: CustomTheme = { ...base }

  if (override.colors) {
    result.colors = { ...base.colors }
    for (const key of Object.keys(override.colors)) {
      const baseValue = base.colors?.[key]
      const overrideValue = override.colors[key]

      if (typeof overrideValue === 'object' && typeof baseValue === 'object') {
        // Merge nested color objects
        result.colors[key] = { ...baseValue, ...overrideValue }
      } else {
        result.colors[key] = overrideValue
      }
    }
  }

  if (override.spacing) {
    result.spacing = { ...base.spacing, ...override.spacing }
  }

  if (override.radii) {
    result.radii = { ...base.radii, ...override.radii }
  }

  if (override.fonts) {
    result.fonts = { ...base.fonts, ...override.fonts }
  }

  return result
}

/**
 * Convert theme object to CSS custom properties
 * Returns an object of variable names to values
 */
function themeToCssVariables(theme: CustomTheme): Map<string, string> {
  const variables = new Map<string, string>()

  // Process colors
  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      const kebabKey = toKebabCase(key)
      if (typeof value === 'string') {
        variables.set(`--color-${kebabKey}`, value)
      } else if (typeof value === 'object') {
        // Nested color object (e.g., brand: { 50: '#xxx', 500: '#xxx' })
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          const nestedKebabKey = toKebabCase(nestedKey)
          variables.set(`--color-${kebabKey}-${nestedKebabKey}`, nestedValue)
        }
      }
    }
  }

  // Process spacing
  if (theme.spacing) {
    for (const [key, value] of Object.entries(theme.spacing)) {
      const kebabKey = toKebabCase(key)
      variables.set(`--spacing-${kebabKey}`, value)
    }
  }

  // Process radii
  if (theme.radii) {
    for (const [key, value] of Object.entries(theme.radii)) {
      const kebabKey = toKebabCase(key)
      variables.set(`--radius-${kebabKey}`, value)
    }
  }

  // Process fonts
  if (theme.fonts) {
    for (const [key, value] of Object.entries(theme.fonts)) {
      const kebabKey = toKebabCase(key)
      variables.set(`--font-${kebabKey}`, value)
    }
  }

  return variables
}

/**
 * Get a value from a theme object using a dot-separated path
 */
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }

  return current
}

/**
 * ThemeProvider component
 * Applies CSS custom properties to document.documentElement and provides theme context
 */
export function ThemeProvider({
  children,
  theme = {},
  darkTheme,
  defaultMode = 'light',
}: CustomThemeProviderProps): ReactNode {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode)
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  // Track applied CSS variables for cleanup
  const appliedVariablesRef = useRef<Set<string>>(new Set())

  // Calculate resolved mode (always light or dark)
  const resolvedMode: ResolvedThemeMode = useMemo(() => {
    if (mode === 'system') {
      return systemPrefersDark ? 'dark' : 'light'
    }
    return mode
  }, [mode, systemPrefersDark])

  const isDarkMode = resolvedMode === 'dark'

  // Calculate the resolved theme (merge light + dark if needed)
  const resolvedTheme: CustomTheme = useMemo(() => {
    if (isDarkMode && darkTheme) {
      return mergeThemes(theme, darkTheme)
    }
    return theme
  }, [theme, darkTheme, isDarkMode])

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent | { matches: boolean }) => {
      setSystemPrefersDark(e.matches)
    }

    // Add listener
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Apply CSS variables to document.documentElement
  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const newVariables = themeToCssVariables(resolvedTheme)

    // Remove old variables that are no longer in the new theme
    for (const varName of appliedVariablesRef.current) {
      if (!newVariables.has(varName)) {
        root.style.removeProperty(varName)
      }
    }

    // Apply new variables
    for (const [varName, value] of newVariables) {
      root.style.setProperty(varName, value)
    }

    // Update tracking
    appliedVariablesRef.current = new Set(newVariables.keys())

    // Cleanup on unmount
    return () => {
      for (const varName of appliedVariablesRef.current) {
        root.style.removeProperty(varName)
      }
      appliedVariablesRef.current.clear()
    }
  }, [resolvedTheme])

  // Set mode function
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
  }, [])

  // Toggle dark mode function
  const toggleDarkMode = useCallback(() => {
    setModeState((currentMode) => {
      if (currentMode === 'system') {
        // When in system mode, toggle based on current resolved value
        return systemPrefersDark ? 'light' : 'dark'
      }
      return currentMode === 'dark' ? 'light' : 'dark'
    })
  }, [systemPrefersDark])

  // Get theme value by path
  const getThemeValue = useCallback(
    (path: string, defaultValue?: string): string | undefined => {
      const value = getValueByPath(resolvedTheme as Record<string, unknown>, path)
      if (typeof value === 'string') {
        return value
      }
      return defaultValue
    },
    [resolvedTheme]
  )

  // Get CSS variable value
  const getCssVariable = useCallback((name: string): string => {
    if (typeof document === 'undefined') return ''
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  }, [])

  const contextValue: ThemeContextValue = useMemo(
    () => ({
      theme: resolvedTheme,
      mode,
      resolvedMode,
      isDarkMode,
      setMode,
      toggleDarkMode,
      getThemeValue,
      getCssVariable,
    }),
    [resolvedTheme, mode, resolvedMode, isDarkMode, setMode, toggleDarkMode, getThemeValue, getCssVariable]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access theme context
 * Must be used within a ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
