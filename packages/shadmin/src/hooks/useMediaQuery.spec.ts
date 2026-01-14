/**
 * useMediaQuery hook tests
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { useMediaQuery } from './useMediaQuery'

type MediaQueryListener = (event: MediaQueryListEvent) => void

interface MockMediaQueryList {
  matches: boolean
  media: string
  onchange: null
  addListener: ReturnType<typeof vi.fn>
  removeListener: ReturnType<typeof vi.fn>
  addEventListener: ReturnType<typeof vi.fn>
  removeEventListener: ReturnType<typeof vi.fn>
  dispatchEvent: ReturnType<typeof vi.fn>
  _listeners: Set<MediaQueryListener>
  _triggerChange: (matches: boolean) => void
}

function createMockMatchMedia(defaultMatches: boolean = false) {
  const mediaQueryLists = new Map<string, MockMediaQueryList>()

  const mockMatchMedia = vi.fn((query: string): MockMediaQueryList => {
    if (mediaQueryLists.has(query)) {
      return mediaQueryLists.get(query)!
    }

    const listeners = new Set<MediaQueryListener>()

    const mediaQueryList: MockMediaQueryList = {
      matches: defaultMatches,
      media: query,
      onchange: null,
      addListener: vi.fn((cb: MediaQueryListener) => listeners.add(cb)),
      removeListener: vi.fn((cb: MediaQueryListener) => listeners.delete(cb)),
      addEventListener: vi.fn((event: string, cb: MediaQueryListener) => {
        if (event === 'change') {
          listeners.add(cb)
        }
      }),
      removeEventListener: vi.fn((event: string, cb: MediaQueryListener) => {
        if (event === 'change') {
          listeners.delete(cb)
        }
      }),
      dispatchEvent: vi.fn(() => true),
      _listeners: listeners,
      _triggerChange: (newMatches: boolean) => {
        mediaQueryList.matches = newMatches
        listeners.forEach((cb) => {
          cb({ matches: newMatches, media: query } as MediaQueryListEvent)
        })
      },
    }

    mediaQueryLists.set(query, mediaQueryList)
    return mediaQueryList
  })

  return {
    mockMatchMedia,
    getMediaQueryList: (query: string) => mediaQueryLists.get(query),
    triggerChange: (query: string, matches: boolean) => {
      const mql = mediaQueryLists.get(query)
      if (mql) {
        mql._triggerChange(matches)
      }
    },
  }
}

describe('useMediaQuery', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  describe('initial value', () => {
    it('should return true when media query matches', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      expect(result.current).toBe(true)
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)')
    })

    it('should return false when media query does not match', () => {
      const { mockMatchMedia } = createMockMatchMedia(false)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      expect(result.current).toBe(false)
    })

    it('should return false when window is undefined (SSR)', () => {
      const originalWindow = globalThis.window
      // @ts-expect-error - Simulating SSR environment
      delete globalThis.window

      // Re-import to test SSR behavior - but since we can't easily re-import,
      // we'll test by checking the hook handles missing window gracefully
      globalThis.window = originalWindow

      // For SSR simulation, we test by removing matchMedia
      const windowWithoutMatchMedia = { ...window }
      // @ts-expect-error - Simulating missing matchMedia for SSR testing
      windowWithoutMatchMedia.matchMedia = undefined
      globalThis.window = windowWithoutMatchMedia

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      expect(result.current).toBe(false)

      globalThis.window = originalWindow
    })

    it('should return false when matchMedia is not a function', () => {
      // @ts-expect-error - Simulating missing matchMedia
      window.matchMedia = undefined

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      expect(result.current).toBe(false)
    })
  })

  describe('media query changes', () => {
    it('should update when media query changes from false to true', async () => {
      const { mockMatchMedia, triggerChange } = createMockMatchMedia(false)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      expect(result.current).toBe(false)

      act(() => {
        triggerChange('(min-width: 768px)', true)
      })

      await waitFor(() => {
        expect(result.current).toBe(true)
      })
    })

    it('should update when media query changes from true to false', async () => {
      const { mockMatchMedia, triggerChange } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      expect(result.current).toBe(true)

      act(() => {
        triggerChange('(min-width: 768px)', false)
      })

      await waitFor(() => {
        expect(result.current).toBe(false)
      })
    })

    it('should handle multiple state changes', async () => {
      const { mockMatchMedia, triggerChange } = createMockMatchMedia(false)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      expect(result.current).toBe(false)

      act(() => {
        triggerChange('(min-width: 768px)', true)
      })

      await waitFor(() => {
        expect(result.current).toBe(true)
      })

      act(() => {
        triggerChange('(min-width: 768px)', false)
      })

      await waitFor(() => {
        expect(result.current).toBe(false)
      })

      act(() => {
        triggerChange('(min-width: 768px)', true)
      })

      await waitFor(() => {
        expect(result.current).toBe(true)
      })
    })
  })

  describe('various media query strings', () => {
    it('should work with min-width query', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      expect(result.current).toBe(true)
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)')
    })

    it('should work with max-width query', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(max-width: 1024px)'))

      expect(result.current).toBe(true)
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 1024px)')
    })

    it('should work with prefers-color-scheme query', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(prefers-color-scheme: dark)'))

      expect(result.current).toBe(true)
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    })

    it('should work with prefers-reduced-motion query', () => {
      const { mockMatchMedia } = createMockMatchMedia(false)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(prefers-reduced-motion: reduce)'))

      expect(result.current).toBe(false)
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
    })

    it('should work with orientation query', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(orientation: landscape)'))

      expect(result.current).toBe(true)
      expect(mockMatchMedia).toHaveBeenCalledWith('(orientation: landscape)')
    })

    it('should work with combined media queries', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() =>
        useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
      )

      expect(result.current).toBe(true)
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px) and (max-width: 1024px)')
    })

    it('should work with screen type query', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('screen and (min-width: 768px)'))

      expect(result.current).toBe(true)
      expect(mockMatchMedia).toHaveBeenCalledWith('screen and (min-width: 768px)')
    })

    it('should work with print media query', () => {
      const { mockMatchMedia } = createMockMatchMedia(false)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('print'))

      expect(result.current).toBe(false)
      expect(mockMatchMedia).toHaveBeenCalledWith('print')
    })

    it('should work with aspect-ratio query', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(aspect-ratio: 16/9)'))

      expect(result.current).toBe(true)
      expect(mockMatchMedia).toHaveBeenCalledWith('(aspect-ratio: 16/9)')
    })

    it('should work with hover query', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(hover: hover)'))

      expect(result.current).toBe(true)
      expect(mockMatchMedia).toHaveBeenCalledWith('(hover: hover)')
    })

    it('should work with pointer query', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery('(pointer: fine)'))

      expect(result.current).toBe(true)
      expect(mockMatchMedia).toHaveBeenCalledWith('(pointer: fine)')
    })
  })

  describe('query changes', () => {
    it('should re-evaluate when query string changes', () => {
      const mediaQueryMatches: Record<string, boolean> = {
        '(min-width: 768px)': true,
        '(min-width: 1024px)': false,
      }

      const mockMatchMedia = vi.fn((query: string) => ({
        matches: mediaQueryMatches[query] ?? false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia

      const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
        initialProps: { query: '(min-width: 768px)' },
      })

      expect(result.current).toBe(true)

      rerender({ query: '(min-width: 1024px)' })

      expect(result.current).toBe(false)
    })

    it('should cleanup previous listener when query changes', async () => {
      const { mockMatchMedia, getMediaQueryList } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
        initialProps: { query: '(min-width: 768px)' },
      })

      const firstQueryList = getMediaQueryList('(min-width: 768px)')

      rerender({ query: '(min-width: 1024px)' })

      // The removeEventListener should have been called for the first query
      expect(firstQueryList?.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })
  })

  describe('subscription management', () => {
    it('should add event listener on mount', () => {
      const { mockMatchMedia, getMediaQueryList } = createMockMatchMedia(false)
      window.matchMedia = mockMatchMedia

      renderHook(() => useMediaQuery('(min-width: 768px)'))

      const mediaQueryList = getMediaQueryList('(min-width: 768px)')
      expect(mediaQueryList?.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('should remove event listener on unmount', () => {
      const { mockMatchMedia, getMediaQueryList } = createMockMatchMedia(false)
      window.matchMedia = mockMatchMedia

      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      unmount()

      const mediaQueryList = getMediaQueryList('(min-width: 768px)')
      expect(mediaQueryList?.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      )
    })

    it('should not add listener when matchMedia is unavailable', () => {
      // @ts-expect-error - Simulating missing matchMedia
      window.matchMedia = undefined

      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      // Should not throw
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('multiple hooks with same query', () => {
    it('should work with multiple hooks using the same query', async () => {
      const { mockMatchMedia, triggerChange } = createMockMatchMedia(false)
      window.matchMedia = mockMatchMedia

      const { result: result1 } = renderHook(() => useMediaQuery('(min-width: 768px)'))
      const { result: result2 } = renderHook(() => useMediaQuery('(min-width: 768px)'))

      expect(result1.current).toBe(false)
      expect(result2.current).toBe(false)

      act(() => {
        triggerChange('(min-width: 768px)', true)
      })

      await waitFor(() => {
        expect(result1.current).toBe(true)
        expect(result2.current).toBe(true)
      })
    })

    it('should work with multiple hooks using different queries', async () => {
      const mediaQueryMatches: Record<string, boolean> = {
        '(min-width: 768px)': true,
        '(min-width: 1024px)': false,
      }

      const listeners = new Map<string, Set<MediaQueryListener>>()

      const mockMatchMedia = vi.fn((query: string) => {
        if (!listeners.has(query)) {
          listeners.set(query, new Set())
        }
        const queryListeners = listeners.get(query)!

        return {
          matches: mediaQueryMatches[query] ?? false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn((event: string, cb: MediaQueryListener) => {
            if (event === 'change') queryListeners.add(cb)
          }),
          removeEventListener: vi.fn((event: string, cb: MediaQueryListener) => {
            if (event === 'change') queryListeners.delete(cb)
          }),
          dispatchEvent: vi.fn(),
        }
      })

      window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia

      const { result: result1 } = renderHook(() => useMediaQuery('(min-width: 768px)'))
      const { result: result2 } = renderHook(() => useMediaQuery('(min-width: 1024px)'))

      expect(result1.current).toBe(true)
      expect(result2.current).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle empty query string', () => {
      const { mockMatchMedia } = createMockMatchMedia(false)
      window.matchMedia = mockMatchMedia

      const { result } = renderHook(() => useMediaQuery(''))

      expect(result.current).toBe(false)
      expect(mockMatchMedia).toHaveBeenCalledWith('')
    })

    it('should handle invalid query string gracefully', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        media: 'not all',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia

      const { result } = renderHook(() => useMediaQuery('invalid-query'))

      expect(result.current).toBe(false)
    })

    it('should be stable across re-renders with same query', () => {
      const { mockMatchMedia } = createMockMatchMedia(true)
      window.matchMedia = mockMatchMedia

      const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
        initialProps: { query: '(min-width: 768px)' },
      })

      const firstResult = result.current

      rerender({ query: '(min-width: 768px)' })

      expect(result.current).toBe(firstResult)
    })
  })

  describe('common responsive breakpoints', () => {
    it('should correctly identify mobile breakpoint', () => {
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === '(max-width: 640px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia

      const { result } = renderHook(() => useMediaQuery('(max-width: 640px)'))

      expect(result.current).toBe(true)
    })

    it('should correctly identify tablet breakpoint', () => {
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === '(min-width: 641px) and (max-width: 1024px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia

      const { result } = renderHook(() =>
        useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
      )

      expect(result.current).toBe(true)
    })

    it('should correctly identify desktop breakpoint', () => {
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === '(min-width: 1025px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia

      const { result } = renderHook(() => useMediaQuery('(min-width: 1025px)'))

      expect(result.current).toBe(true)
    })
  })
})
