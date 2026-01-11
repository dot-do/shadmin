/**
 * ThemeProvider Tests for Custom Theme System
 * TDD: RED phase - These tests should FAIL because implementation doesn't exist
 *
 * Tests the ability to:
 * - Apply custom theme CSS variables to document root
 * - Support darkTheme when dark mode is enabled
 * - Switch between light/dark themes
 * - Apply custom color tokens
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme, type CustomTheme } from './ThemeProvider'

// Note: ThemeProvider with CustomTheme support does not exist yet - these tests should fail

describe('ThemeProvider - Custom Theme CSS Variables', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Reset document styles
    document.documentElement.removeAttribute('style')
    document.documentElement.classList.remove('light', 'dark')

    // Mock matchMedia
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
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

  describe('theme prop applies CSS variables', () => {
    it('should apply primary color as CSS variable on document root', () => {
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

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-primary')).toBe('#3b82f6')
    })

    it('should apply multiple color tokens as CSS variables', () => {
      const customTheme: CustomTheme = {
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          background: '#ffffff',
          foreground: '#000000',
          muted: '#6b7280',
          accent: '#f59e0b',
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-primary')).toBe('#3b82f6')
      expect(rootStyles.getPropertyValue('--color-secondary')).toBe('#8b5cf6')
      expect(rootStyles.getPropertyValue('--color-background')).toBe('#ffffff')
      expect(rootStyles.getPropertyValue('--color-foreground')).toBe('#000000')
      expect(rootStyles.getPropertyValue('--color-muted')).toBe('#6b7280')
      expect(rootStyles.getPropertyValue('--color-accent')).toBe('#f59e0b')
    })

    it('should apply spacing tokens as CSS variables', () => {
      const customTheme: CustomTheme = {
        spacing: {
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--spacing-xs')).toBe('4px')
      expect(rootStyles.getPropertyValue('--spacing-sm')).toBe('8px')
      expect(rootStyles.getPropertyValue('--spacing-md')).toBe('16px')
      expect(rootStyles.getPropertyValue('--spacing-lg')).toBe('24px')
      expect(rootStyles.getPropertyValue('--spacing-xl')).toBe('32px')
    })

    it('should apply border radius tokens as CSS variables', () => {
      const customTheme: CustomTheme = {
        radii: {
          none: '0',
          sm: '4px',
          md: '8px',
          lg: '12px',
          full: '9999px',
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--radius-none')).toBe('0')
      expect(rootStyles.getPropertyValue('--radius-sm')).toBe('4px')
      expect(rootStyles.getPropertyValue('--radius-md')).toBe('8px')
      expect(rootStyles.getPropertyValue('--radius-lg')).toBe('12px')
      expect(rootStyles.getPropertyValue('--radius-full')).toBe('9999px')
    })

    it('should apply font family tokens as CSS variables', () => {
      const customTheme: CustomTheme = {
        fonts: {
          sans: 'Inter, sans-serif',
          mono: 'Fira Code, monospace',
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--font-sans')).toBe('Inter, sans-serif')
      expect(rootStyles.getPropertyValue('--font-mono')).toBe('Fira Code, monospace')
    })
  })

  describe('darkTheme prop applies when dark mode enabled', () => {
    it('should apply darkTheme colors when mode is dark', () => {
      const lightTheme: CustomTheme = {
        colors: {
          background: '#ffffff',
          foreground: '#000000',
        },
      }

      const darkTheme: CustomTheme = {
        colors: {
          background: '#0a0a0a',
          foreground: '#fafafa',
        },
      }

      render(
        <ThemeProvider theme={lightTheme} darkTheme={darkTheme} defaultMode="dark">
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-background')).toBe('#0a0a0a')
      expect(rootStyles.getPropertyValue('--color-foreground')).toBe('#fafafa')
    })

    it('should apply lightTheme colors when mode is light', () => {
      const lightTheme: CustomTheme = {
        colors: {
          background: '#ffffff',
          foreground: '#000000',
        },
      }

      const darkTheme: CustomTheme = {
        colors: {
          background: '#0a0a0a',
          foreground: '#fafafa',
        },
      }

      render(
        <ThemeProvider theme={lightTheme} darkTheme={darkTheme} defaultMode="light">
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-background')).toBe('#ffffff')
      expect(rootStyles.getPropertyValue('--color-foreground')).toBe('#000000')
    })

    it('should follow system preference when mode is system', () => {
      // Mock system prefers dark
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

      const lightTheme: CustomTheme = {
        colors: {
          background: '#ffffff',
        },
      }

      const darkTheme: CustomTheme = {
        colors: {
          background: '#0a0a0a',
        },
      }

      render(
        <ThemeProvider theme={lightTheme} darkTheme={darkTheme} defaultMode="system">
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      // Should apply dark theme since system prefers dark
      expect(rootStyles.getPropertyValue('--color-background')).toBe('#0a0a0a')
    })

    it('should fall back to light theme colors for tokens not in darkTheme', () => {
      const lightTheme: CustomTheme = {
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
        },
      }

      const darkTheme: CustomTheme = {
        colors: {
          primary: '#60a5fa', // Only override primary
        },
      }

      render(
        <ThemeProvider theme={lightTheme} darkTheme={darkTheme} defaultMode="dark">
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-primary')).toBe('#60a5fa')
      // Secondary should fall back to light theme value
      expect(rootStyles.getPropertyValue('--color-secondary')).toBe('#8b5cf6')
    })
  })

  describe('theme switching between light/dark', () => {
    it('should switch CSS variables when mode changes', () => {
      const lightTheme: CustomTheme = {
        colors: { background: '#ffffff' },
      }

      const darkTheme: CustomTheme = {
        colors: { background: '#0a0a0a' },
      }

      const ThemeSwitcher = () => {
        const { mode, setMode } = useTheme()
        return (
          <div>
            <span data-testid="mode">{mode}</span>
            <button onClick={() => setMode('dark')}>Set Dark</button>
            <button onClick={() => setMode('light')}>Set Light</button>
          </div>
        )
      }

      render(
        <ThemeProvider theme={lightTheme} darkTheme={darkTheme} defaultMode="light">
          <ThemeSwitcher />
        </ThemeProvider>
      )

      // Initially light
      expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#ffffff')

      // Switch to dark
      act(() => {
        fireEvent.click(screen.getByText('Set Dark'))
      })

      expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#0a0a0a')

      // Switch back to light
      act(() => {
        fireEvent.click(screen.getByText('Set Light'))
      })

      expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#ffffff')
    })

    it('should update CSS variables when theme prop changes', () => {
      const initialTheme: CustomTheme = {
        colors: { primary: '#3b82f6' },
      }

      const updatedTheme: CustomTheme = {
        colors: { primary: '#ef4444' },
      }

      const { rerender } = render(
        <ThemeProvider theme={initialTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#3b82f6')

      rerender(
        <ThemeProvider theme={updatedTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#ef4444')
    })
  })

  describe('custom color tokens', () => {
    it('should apply nested color tokens with proper CSS variable naming', () => {
      const customTheme: CustomTheme = {
        colors: {
          brand: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            900: '#1e3a8a',
          },
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-brand-50')).toBe('#eff6ff')
      expect(rootStyles.getPropertyValue('--color-brand-100')).toBe('#dbeafe')
      expect(rootStyles.getPropertyValue('--color-brand-500')).toBe('#3b82f6')
      expect(rootStyles.getPropertyValue('--color-brand-900')).toBe('#1e3a8a')
    })

    it('should apply semantic color tokens', () => {
      const customTheme: CustomTheme = {
        colors: {
          destructive: '#ef4444',
          success: '#22c55e',
          warning: '#f59e0b',
          info: '#3b82f6',
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-destructive')).toBe('#ef4444')
      expect(rootStyles.getPropertyValue('--color-success')).toBe('#22c55e')
      expect(rootStyles.getPropertyValue('--color-warning')).toBe('#f59e0b')
      expect(rootStyles.getPropertyValue('--color-info')).toBe('#3b82f6')
    })

    it('should apply chart colors as CSS variables', () => {
      const customTheme: CustomTheme = {
        colors: {
          chart: {
            1: '#3b82f6',
            2: '#8b5cf6',
            3: '#ec4899',
            4: '#f59e0b',
            5: '#22c55e',
          },
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-chart-1')).toBe('#3b82f6')
      expect(rootStyles.getPropertyValue('--color-chart-2')).toBe('#8b5cf6')
      expect(rootStyles.getPropertyValue('--color-chart-3')).toBe('#ec4899')
      expect(rootStyles.getPropertyValue('--color-chart-4')).toBe('#f59e0b')
      expect(rootStyles.getPropertyValue('--color-chart-5')).toBe('#22c55e')
    })

    it('should apply sidebar-specific colors', () => {
      const customTheme: CustomTheme = {
        colors: {
          sidebar: {
            background: '#f8fafc',
            foreground: '#334155',
            border: '#e2e8f0',
            accent: '#3b82f6',
            accentForeground: '#ffffff',
          },
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-sidebar-background')).toBe('#f8fafc')
      expect(rootStyles.getPropertyValue('--color-sidebar-foreground')).toBe('#334155')
      expect(rootStyles.getPropertyValue('--color-sidebar-border')).toBe('#e2e8f0')
      expect(rootStyles.getPropertyValue('--color-sidebar-accent')).toBe('#3b82f6')
      expect(rootStyles.getPropertyValue('--color-sidebar-accent-foreground')).toBe('#ffffff')
    })

    it('should support HSL color values', () => {
      const customTheme: CustomTheme = {
        colors: {
          primary: 'hsl(217, 91%, 60%)',
          secondary: 'hsl(262, 83%, 58%)',
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-primary')).toBe('hsl(217, 91%, 60%)')
      expect(rootStyles.getPropertyValue('--color-secondary')).toBe('hsl(262, 83%, 58%)')
    })

    it('should support RGB color values', () => {
      const customTheme: CustomTheme = {
        colors: {
          primary: 'rgb(59, 130, 246)',
        },
      }

      render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      const rootStyles = document.documentElement.style
      expect(rootStyles.getPropertyValue('--color-primary')).toBe('rgb(59, 130, 246)')
    })
  })

  describe('CSS variable cleanup', () => {
    it('should remove CSS variables when ThemeProvider unmounts', () => {
      const customTheme: CustomTheme = {
        colors: {
          primary: '#3b82f6',
        },
      }

      const { unmount } = render(
        <ThemeProvider theme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      )

      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#3b82f6')

      unmount()

      // CSS variable should be removed after unmount
      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('')
    })

    it('should clean up old theme variables when theme changes', () => {
      const theme1: CustomTheme = {
        colors: {
          oldToken: '#ff0000',
        },
      }

      const theme2: CustomTheme = {
        colors: {
          newToken: '#00ff00',
        },
      }

      const { rerender } = render(
        <ThemeProvider theme={theme1}>
          <div>Content</div>
        </ThemeProvider>
      )

      expect(document.documentElement.style.getPropertyValue('--color-old-token')).toBe('#ff0000')

      rerender(
        <ThemeProvider theme={theme2}>
          <div>Content</div>
        </ThemeProvider>
      )

      // Old variable should be removed
      expect(document.documentElement.style.getPropertyValue('--color-old-token')).toBe('')
      // New variable should be set
      expect(document.documentElement.style.getPropertyValue('--color-new-token')).toBe('#00ff00')
    })
  })
})
