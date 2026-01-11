/**
 * useTheme Hook Tests for Custom Theme System
 * TDD: RED phase - These tests should FAIL because implementation doesn't exist
 *
 * Tests the extended useTheme hook that:
 * - Returns current theme object (with custom tokens)
 * - Returns isDarkMode boolean
 * - Returns toggleDarkMode function
 * - Theme updates propagate to consumers
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useTheme, ThemeProvider, type CustomTheme } from '../components/core/ThemeProvider'

// Note: Extended useTheme with custom theme support does not exist yet - these tests should fail

describe('useTheme - Extended Theme Hook', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>
  let mediaQueryListeners: Array<(e: { matches: boolean }) => void>

  beforeEach(() => {
    // Reset document styles
    document.documentElement.removeAttribute('style')
    document.documentElement.classList.remove('light', 'dark')

    mediaQueryListeners = []

    // Mock matchMedia
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, listener: (e: { matches: boolean }) => void) => {
        if (event === 'change') {
          mediaQueryListeners.push(listener)
        }
      }),
      removeEventListener: vi.fn((event: string, listener: (e: { matches: boolean }) => void) => {
        if (event === 'change') {
          const index = mediaQueryListeners.indexOf(listener)
          if (index > -1) {
            mediaQueryListeners.splice(index, 1)
          }
        }
      }),
      dispatchEvent: vi.fn(),
    }))
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.documentElement.removeAttribute('style')
    document.documentElement.classList.remove('light', 'dark')
  })

  // Wrapper to provide ThemeProvider
  const createWrapper = (theme?: CustomTheme, darkTheme?: CustomTheme, defaultMode?: 'light' | 'dark' | 'system') => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <ThemeProvider
          {...(theme !== undefined ? { theme } : {})}
          {...(darkTheme !== undefined ? { darkTheme } : {})}
          {...(defaultMode !== undefined ? { defaultMode } : {})}
        >
          {children}
        </ThemeProvider>
      )
    }
  }

  describe('returns current theme object', () => {
    it('should return the current theme configuration', () => {
      const customTheme: CustomTheme = {
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
        },
        spacing: {
          md: '16px',
        },
      }

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(customTheme),
      })

      expect(result.current.theme).toBeDefined()
      expect(result.current.theme.colors?.primary).toBe('#3b82f6')
      expect(result.current.theme.colors?.secondary).toBe('#8b5cf6')
      expect(result.current.theme.spacing?.md).toBe('16px')
    })

    it('should return resolved theme (merged light + dark) when in dark mode', () => {
      const lightTheme: CustomTheme = {
        colors: {
          primary: '#3b82f6',
          background: '#ffffff',
        },
      }

      const darkTheme: CustomTheme = {
        colors: {
          background: '#0a0a0a',
        },
      }

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(lightTheme, darkTheme, 'dark'),
      })

      // Should have dark background but light primary (fallback)
      expect(result.current.theme.colors?.background).toBe('#0a0a0a')
      expect(result.current.theme.colors?.primary).toBe('#3b82f6')
    })

    it('should return empty theme object when no theme is provided', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      })

      expect(result.current.theme).toBeDefined()
      expect(result.current.theme).toEqual({})
    })

    it('should return deeply nested color tokens', () => {
      const customTheme: CustomTheme = {
        colors: {
          brand: {
            50: '#eff6ff',
            500: '#3b82f6',
            900: '#1e3a8a',
          },
        },
      }

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(customTheme),
      })

      const brand = result.current.theme.colors?.brand as { [key: string]: string } | undefined
      expect(brand?.['50']).toBe('#eff6ff')
      expect(brand?.['500']).toBe('#3b82f6')
      expect(brand?.['900']).toBe('#1e3a8a')
    })
  })

  describe('returns isDarkMode boolean', () => {
    it('should return true when mode is dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'dark'),
      })

      expect(result.current.isDarkMode).toBe(true)
    })

    it('should return false when mode is light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'light'),
      })

      expect(result.current.isDarkMode).toBe(false)
    })

    it('should return true when mode is system and system prefers dark', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'system'),
      })

      expect(result.current.isDarkMode).toBe(true)
    })

    it('should return false when mode is system and system prefers light', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'system'),
      })

      expect(result.current.isDarkMode).toBe(false)
    })

    it('should update isDarkMode when system preference changes', async () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, listener: (e: { matches: boolean }) => void) => {
          if (event === 'change') {
            mediaQueryListeners.push(listener)
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'system'),
      })

      expect(result.current.isDarkMode).toBe(false)

      // Simulate system preference change to dark
      act(() => {
        mediaQueryListeners.forEach((listener) => listener({ matches: true }))
      })

      await waitFor(() => {
        expect(result.current.isDarkMode).toBe(true)
      })
    })
  })

  describe('returns toggleDarkMode function', () => {
    it('should provide toggleDarkMode function', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'light'),
      })

      expect(result.current.toggleDarkMode).toBeDefined()
      expect(typeof result.current.toggleDarkMode).toBe('function')
    })

    it('should toggle from light to dark mode', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'light'),
      })

      expect(result.current.isDarkMode).toBe(false)

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(result.current.isDarkMode).toBe(true)
    })

    it('should toggle from dark to light mode', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'dark'),
      })

      expect(result.current.isDarkMode).toBe(true)

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(result.current.isDarkMode).toBe(false)
    })

    it('should toggle when mode is system (from current resolved value)', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'system'),
      })

      // System prefers dark, so isDarkMode should be true
      expect(result.current.isDarkMode).toBe(true)

      act(() => {
        result.current.toggleDarkMode()
      })

      // After toggle, should be light mode
      expect(result.current.isDarkMode).toBe(false)
      // Mode should change from system to light
      expect(result.current.mode).toBe('light')
    })

    it('should update CSS variables when toggling', () => {
      const lightTheme: CustomTheme = {
        colors: { background: '#ffffff' },
      }

      const darkTheme: CustomTheme = {
        colors: { background: '#0a0a0a' },
      }

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(lightTheme, darkTheme, 'light'),
      })

      expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#ffffff')

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#0a0a0a')
    })
  })

  describe('theme updates propagate to consumers', () => {
    it('should propagate theme changes to multiple consumers', () => {
      const lightTheme: CustomTheme = {
        colors: { primary: '#3b82f6' },
      }

      const darkTheme: CustomTheme = {
        colors: { primary: '#60a5fa' },
      }

      const Consumer1 = () => {
        const { theme, isDarkMode } = useTheme()
        return (
          <div data-testid="consumer1">
            {String(theme.colors?.primary ?? '')} - {isDarkMode ? 'dark' : 'light'}
          </div>
        )
      }

      const Consumer2 = () => {
        const { theme, isDarkMode } = useTheme()
        return (
          <div data-testid="consumer2">
            {String(theme.colors?.primary ?? '')} - {isDarkMode ? 'dark' : 'light'}
          </div>
        )
      }

      const Toggler = () => {
        const { toggleDarkMode } = useTheme()
        return <button onClick={toggleDarkMode}>Toggle</button>
      }

      render(
        <ThemeProvider theme={lightTheme} darkTheme={darkTheme} defaultMode="light">
          <Consumer1 />
          <Consumer2 />
          <Toggler />
        </ThemeProvider>
      )

      expect(screen.getByTestId('consumer1')).toHaveTextContent('#3b82f6 - light')
      expect(screen.getByTestId('consumer2')).toHaveTextContent('#3b82f6 - light')

      act(() => {
        fireEvent.click(screen.getByText('Toggle'))
      })

      expect(screen.getByTestId('consumer1')).toHaveTextContent('#60a5fa - dark')
      expect(screen.getByTestId('consumer2')).toHaveTextContent('#60a5fa - dark')
    })

    it('should re-render consumers when theme prop changes', () => {
      const theme1: CustomTheme = {
        colors: { primary: '#3b82f6' },
      }

      const theme2: CustomTheme = {
        colors: { primary: '#ef4444' },
      }

      const Consumer = () => {
        const { theme } = useTheme()
        return <div data-testid="consumer">{String(theme.colors?.primary ?? '')}</div>
      }

      const { rerender } = render(
        <ThemeProvider theme={theme1}>
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('consumer')).toHaveTextContent('#3b82f6')

      rerender(
        <ThemeProvider theme={theme2}>
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('consumer')).toHaveTextContent('#ef4444')
    })

    it('should provide setMode function to change mode programmatically', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'light'),
      })

      expect(result.current.mode).toBe('light')

      act(() => {
        result.current.setMode('dark')
      })

      expect(result.current.mode).toBe('dark')
      expect(result.current.isDarkMode).toBe(true)

      act(() => {
        result.current.setMode('system')
      })

      expect(result.current.mode).toBe('system')
    })

    it('should provide resolvedMode for the actual applied mode', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(undefined, undefined, 'system'),
      })

      expect(result.current.mode).toBe('system')
      expect(result.current.resolvedMode).toBe('dark')
    })
  })

  describe('getThemeValue helper', () => {
    it('should provide getThemeValue function to access theme values', () => {
      const customTheme: CustomTheme = {
        colors: {
          primary: '#3b82f6',
          brand: {
            500: '#8b5cf6',
          },
        },
      }

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(customTheme),
      })

      expect(result.current.getThemeValue).toBeDefined()
      expect(result.current.getThemeValue('colors.primary')).toBe('#3b82f6')
      expect(result.current.getThemeValue('colors.brand.500')).toBe('#8b5cf6')
    })

    it('should return undefined for non-existent paths', () => {
      const customTheme: CustomTheme = {
        colors: { primary: '#3b82f6' },
      }

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(customTheme),
      })

      expect(result.current.getThemeValue('colors.nonexistent')).toBeUndefined()
    })

    it('should return default value for non-existent paths when provided', () => {
      const customTheme: CustomTheme = {
        colors: { primary: '#3b82f6' },
      }

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(customTheme),
      })

      expect(result.current.getThemeValue('colors.nonexistent', '#000000')).toBe('#000000')
    })
  })

  describe('getCssVariable helper', () => {
    it('should provide getCssVariable function to get computed CSS variable value', () => {
      const customTheme: CustomTheme = {
        colors: {
          primary: '#3b82f6',
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(customTheme),
      })

      expect(result.current.getCssVariable).toBeDefined()
      // Note: In JSDOM, getComputedStyle may not reflect CSS variables correctly
      // but the function should exist and return a string
      expect(typeof result.current.getCssVariable('--color-primary')).toBe('string')
    })
  })
})
