import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Browser-specific mocks (only apply in jsdom/happy-dom environment)
if (typeof window !== 'undefined') {
  // Mock window.matchMedia for responsive tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock ResizeObserver
  class ResizeObserverMock {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }

  window.ResizeObserver = ResizeObserverMock

  // Mock IntersectionObserver
  class IntersectionObserverMock {
    readonly root: Element | null = null
    readonly rootMargin: string = ''
    readonly thresholds: ReadonlyArray<number> = []

    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn().mockReturnValue([])
  }

  window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver

  // Mock scrollTo
  window.scrollTo = vi.fn()
}
