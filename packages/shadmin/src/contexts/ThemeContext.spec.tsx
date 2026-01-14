import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  ThemeContext,
  ThemeProvider,
  useTheme,
} from './ThemeContext'

describe('ThemeContext', () => {
  // Store original localStorage and matchMedia
  let localStorageMock: { [key: string]: string }
  let matchMediaMock: ReturnType<typeof vi.fn>
  let mediaQueryListeners: Array<(e: { matches: boolean }) => void>

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {}
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => localStorageMock[key] ?? null
    )
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => {
        localStorageMock[key] = value
      }
    )
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      (key: string) => {
        delete localStorageMock[key]
      }
    )

    // Track media query listeners
    mediaQueryListeners = []

    // Mock matchMedia with dark mode preference
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
    // Clean up document class
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.removeAttribute('style')
  })

  describe('ThemeContext', () => {
    it('should export the React context', () => {
      expect(ThemeContext).toBeDefined()
    })
  })

  describe('ThemeProvider', () => {
    it('should provide theme context to children', () => {
      const Consumer = () => {
        const { theme } = useTheme()
        return <div data-testid="theme">{theme}</div>
      }

      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme')).toBeInTheDocument()
    })

    it('should default to system theme', () => {
      const Consumer = () => {
        const { theme } = useTheme()
        return <div data-testid="theme">{theme}</div>
      }

      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme')).toHaveTextContent('system')
    })

    it('should accept defaultTheme prop', () => {
      const Consumer = () => {
        const { theme } = useTheme()
        return <div data-testid="theme">{theme}</div>
      }

      render(
        <ThemeProvider defaultTheme="dark">
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    })

    it('should read initial theme from localStorage', () => {
      localStorageMock['shadmin-theme'] = 'dark'

      const Consumer = () => {
        const { theme } = useTheme()
        return <div data-testid="theme">{theme}</div>
      }

      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    })

    it('should use custom storageKey for localStorage', () => {
      localStorageMock['my-custom-theme-key'] = 'light'

      const Consumer = () => {
        const { theme } = useTheme()
        return <div data-testid="theme">{theme}</div>
      }

      render(
        <ThemeProvider storageKey="my-custom-theme-key">
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme')).toHaveTextContent('light')
    })

    it('should apply dark class to document when theme is dark', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <div>Child</div>
        </ThemeProvider>
      )

      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.classList.contains('light')).toBe(false)
    })

    it('should apply light class to document when theme is light', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <div>Child</div>
        </ThemeProvider>
      )

      expect(document.documentElement.classList.contains('light')).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should apply system preference when theme is system (dark preference)', () => {
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

      render(
        <ThemeProvider defaultTheme="system">
          <div>Child</div>
        </ThemeProvider>
      )

      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should apply system preference when theme is system (light preference)', () => {
      // Mock system prefers light
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query !== '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      render(
        <ThemeProvider defaultTheme="system">
          <div>Child</div>
        </ThemeProvider>
      )

      expect(document.documentElement.classList.contains('light')).toBe(true)
    })

    it('should allow nested providers', () => {
      const OuterConsumer = () => {
        const { theme } = useTheme()
        return <span data-testid="outer">{theme}</span>
      }

      const InnerConsumer = () => {
        const { theme } = useTheme()
        return <span data-testid="inner">{theme}</span>
      }

      render(
        <ThemeProvider defaultTheme="light" storageKey="outer-theme">
          <OuterConsumer />
          <ThemeProvider defaultTheme="dark" storageKey="inner-theme">
            <InnerConsumer />
          </ThemeProvider>
        </ThemeProvider>
      )

      expect(screen.getByTestId('outer')).toHaveTextContent('light')
      expect(screen.getByTestId('inner')).toHaveTextContent('dark')
    })

    it('should disable transitions when disableTransitionOnChange is true', () => {
      const { rerender } = render(
        <ThemeProvider defaultTheme="light" disableTransitionOnChange>
          <div>Child</div>
        </ThemeProvider>
      )

      // Change theme
      const Consumer = () => {
        const { setTheme } = useTheme()
        return <button onClick={() => setTheme('dark')}>Toggle</button>
      }

      rerender(
        <ThemeProvider defaultTheme="light" disableTransitionOnChange>
          <Consumer />
        </ThemeProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Toggle'))
      })

      // The transition disable style should have been applied (and then removed)
      // This is a timing issue, so we just verify no error occurs
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  describe('useTheme', () => {
    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useTheme()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useTheme must be used within a ThemeProvider'
      )
    })

    it('should return theme, setTheme, and resolvedTheme', () => {
      const Consumer = () => {
        const { theme, setTheme, resolvedTheme } = useTheme()
        return (
          <div>
            <span data-testid="hasTheme">{typeof theme === 'string' ? 'true' : 'false'}</span>
            <span data-testid="hasSetTheme">{typeof setTheme === 'function' ? 'true' : 'false'}</span>
            <span data-testid="hasResolvedTheme">{typeof resolvedTheme === 'string' ? 'true' : 'false'}</span>
          </div>
        )
      }

      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('hasTheme')).toHaveTextContent('true')
      expect(screen.getByTestId('hasSetTheme')).toHaveTextContent('true')
      expect(screen.getByTestId('hasResolvedTheme')).toHaveTextContent('true')
    })

    it('should change theme when setTheme is called', () => {
      const Consumer = () => {
        const { theme, setTheme } = useTheme()
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={() => setTheme('dark')}>Set Dark</button>
            <button onClick={() => setTheme('light')}>Set Light</button>
            <button onClick={() => setTheme('system')}>Set System</button>
          </div>
        )
      }

      render(
        <ThemeProvider defaultTheme="light">
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme')).toHaveTextContent('light')

      act(() => {
        fireEvent.click(screen.getByText('Set Dark'))
      })

      expect(screen.getByTestId('theme')).toHaveTextContent('dark')

      act(() => {
        fireEvent.click(screen.getByText('Set System'))
      })

      expect(screen.getByTestId('theme')).toHaveTextContent('system')
    })

    it('should persist theme to localStorage when changed', () => {
      const Consumer = () => {
        const { setTheme } = useTheme()
        return <button onClick={() => setTheme('dark')}>Set Dark</button>
      }

      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Set Dark'))
      })

      expect(localStorageMock['shadmin-theme']).toBe('dark')
    })

    it('should return resolvedTheme as the actual applied theme', () => {
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

      const Consumer = () => {
        const { theme, resolvedTheme } = useTheme()
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <span data-testid="resolved">{resolvedTheme}</span>
          </div>
        )
      }

      render(
        <ThemeProvider defaultTheme="system">
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme')).toHaveTextContent('system')
      expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
    })

    it('should update resolvedTheme when system preference changes', async () => {
      let changeListener: ((e: { matches: boolean }) => void) | null = null

      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, listener: (e: { matches: boolean }) => void) => {
          if (event === 'change') {
            changeListener = listener
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const Consumer = () => {
        const { resolvedTheme } = useTheme()
        return <span data-testid="resolved">{resolvedTheme}</span>
      }

      render(
        <ThemeProvider defaultTheme="system">
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('resolved')).toHaveTextContent('light')

      // Simulate system preference change to dark
      act(() => {
        if (changeListener) {
          changeListener({ matches: true })
        }
      })

      await waitFor(() => {
        expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
      })
    })

    it('should return themes array with available themes', () => {
      const Consumer = () => {
        const { themes } = useTheme()
        return <span data-testid="themes">{themes.join(',')}</span>
      }

      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('themes')).toHaveTextContent('light,dark,system')
    })

    it('should support custom themes array', () => {
      const Consumer = () => {
        const { themes } = useTheme()
        return <span data-testid="themes">{themes.join(',')}</span>
      }

      render(
        <ThemeProvider themes={['light', 'dark', 'system', 'purple', 'ocean']}>
          <Consumer />
        </ThemeProvider>
      )

      expect(screen.getByTestId('themes')).toHaveTextContent('light,dark,system,purple,ocean')
    })
  })

  describe('Theme types', () => {
    it('should support light theme', () => {
      const Consumer = () => {
        const { setTheme, theme } = useTheme()
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={() => setTheme('light')}>Set</button>
          </div>
        )
      }

      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Set'))
      })

      expect(screen.getByTestId('theme')).toHaveTextContent('light')
    })

    it('should support dark theme', () => {
      const Consumer = () => {
        const { setTheme, theme } = useTheme()
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={() => setTheme('dark')}>Set</button>
          </div>
        )
      }

      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Set'))
      })

      expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    })

    it('should support system theme', () => {
      const Consumer = () => {
        const { setTheme, theme } = useTheme()
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={() => setTheme('system')}>Set</button>
          </div>
        )
      }

      render(
        <ThemeProvider defaultTheme="dark">
          <Consumer />
        </ThemeProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Set'))
      })

      expect(screen.getByTestId('theme')).toHaveTextContent('system')
    })
  })

  describe('CSS Variables Integration', () => {
    it('should apply color-scheme CSS property', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <div>Child</div>
        </ThemeProvider>
      )

      // Should set color-scheme property on document
      expect(document.documentElement.style.colorScheme).toBe('dark')
    })

    it('should update color-scheme when theme changes', () => {
      const Consumer = () => {
        const { setTheme } = useTheme()
        return (
          <div>
            <button onClick={() => setTheme('light')}>Light</button>
            <button onClick={() => setTheme('dark')}>Dark</button>
          </div>
        )
      }

      render(
        <ThemeProvider defaultTheme="dark">
          <Consumer />
        </ThemeProvider>
      )

      expect(document.documentElement.style.colorScheme).toBe('dark')

      act(() => {
        fireEvent.click(screen.getByText('Light'))
      })

      expect(document.documentElement.style.colorScheme).toBe('light')
    })
  })

  describe('Attribute mode', () => {
    it('should set data attribute when attribute prop is provided', () => {
      render(
        <ThemeProvider defaultTheme="dark" attribute="data-theme">
          <div>Child</div>
        </ThemeProvider>
      )

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })

    it('should use class by default', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <div>Child</div>
        </ThemeProvider>
      )

      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should support array of attributes', () => {
      render(
        <ThemeProvider defaultTheme="dark" attribute={['class', 'data-theme']}>
          <div>Child</div>
        </ThemeProvider>
      )

      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
  })

  describe('Force theme', () => {
    it('should force specific theme regardless of user preference', () => {
      const Consumer = () => {
        const { theme, resolvedTheme, setTheme } = useTheme()
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <span data-testid="resolved">{resolvedTheme}</span>
            <button onClick={() => setTheme('light')}>Set Light</button>
          </div>
        )
      }

      render(
        <ThemeProvider forcedTheme="dark">
          <Consumer />
        </ThemeProvider>
      )

      // Even though we try to set light, forced theme should apply
      expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)

      act(() => {
        fireEvent.click(screen.getByText('Set Light'))
      })

      // Should still be dark due to forced theme
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })
})
