/**
 * ThemeContext - Provides theme management with light, dark, and system modes
 * Handles localStorage persistence, system preference detection, and CSS class management
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  themes: string[]
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export interface ThemeProviderProps {
  children: ReactNode
  /** Default theme to use */
  defaultTheme?: Theme
  /** Key for localStorage persistence */
  storageKey?: string
  /** Available themes */
  themes?: string[]
  /** Attribute to set on document element */
  attribute?: string | string[]
  /** Force a specific theme (ignores user preference) */
  forcedTheme?: Theme
  /** Disable transitions when theme changes */
  disableTransitionOnChange?: boolean
}

/**
 * ThemeProvider component that manages theme state
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'shadmin-theme',
  themes = ['light', 'dark', 'system'],
  attribute = 'class',
  forcedTheme,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
        return stored
      }
    }
    return defaultTheme
  })

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Compute resolved theme
  const resolvedTheme = useMemo((): 'light' | 'dark' => {
    if (forcedTheme) {
      return forcedTheme === 'system' ? systemTheme : forcedTheme
    }
    return theme === 'system' ? systemTheme : theme
  }, [theme, systemTheme, forcedTheme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    const themeToApply = forcedTheme ? (forcedTheme === 'system' ? systemTheme : forcedTheme) : resolvedTheme

    // Disable transitions temporarily if requested
    let styleElement: HTMLStyleElement | null = null
    if (disableTransitionOnChange) {
      styleElement = document.createElement('style')
      styleElement.textContent = '*, *::before, *::after { transition: none !important; }'
      document.head.appendChild(styleElement)
    }

    // Handle attribute-based theming
    const attributes = Array.isArray(attribute) ? attribute : [attribute]

    for (const attr of attributes) {
      if (attr === 'class') {
        root.classList.remove('light', 'dark')
        root.classList.add(themeToApply)
      } else {
        root.setAttribute(attr, themeToApply)
      }
    }

    // Set color-scheme CSS property
    root.style.colorScheme = themeToApply

    // Re-enable transitions
    if (styleElement) {
      // Use requestAnimationFrame to ensure transitions are disabled for at least one frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          styleElement?.remove()
        })
      })
    }
  }, [resolvedTheme, attribute, disableTransitionOnChange, forcedTheme, systemTheme])

  // Set theme function
  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (!forcedTheme) {
        setThemeState(newTheme)
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, newTheme)
        }
      }
    },
    [storageKey, forcedTheme]
  )

  const value = useMemo(
    (): ThemeContextValue => ({
      theme,
      setTheme,
      resolvedTheme,
      themes,
    }),
    [theme, setTheme, resolvedTheme, themes]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
