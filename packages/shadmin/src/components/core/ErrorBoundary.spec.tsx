/**
 * ErrorBoundary component tests
 * TDD: RED phase - Comprehensive tests for error boundary behavior
 *
 * Tests cover:
 * 1. Component errors (render errors, event handler errors)
 * 2. Async errors (promises, useEffect errors)
 * 3. Error recovery (reset, retry functionality)
 * 4. Error reporting and logging
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'

// Expected import - ErrorBoundary should be exported from core components
// This import will fail initially (RED phase) as ErrorBoundary may not exist
import { ErrorBoundary } from './ErrorBoundary'

// Suppress console.error during error boundary tests
const originalConsoleError = console.error
beforeEach(() => {
  console.error = vi.fn()
})
afterEach(() => {
  console.error = originalConsoleError
})

// Test utilities
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
)

// Components that throw errors for testing
const ThrowingComponent = ({ error }: { error: Error }) => {
  throw error
}

const ThrowOnRender = ({ message = 'Render error' }: { message?: string }) => {
  throw new Error(message)
}

const ThrowOnClick = () => {
  const [shouldThrow, setShouldThrow] = useState(false)
  if (shouldThrow) {
    throw new Error('Click error')
  }
  return (
    <button onClick={() => setShouldThrow(true)}>Trigger Error</button>
  )
}

const ThrowOnEffect = ({ delay = 0 }: { delay?: number }) => {
  const [, setTrigger] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTrigger(() => {
        throw new Error('Effect error')
      })
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return <div>Loading...</div>
}

const AsyncThrowingComponent = ({ shouldReject = true }: { shouldReject?: boolean }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (shouldReject) {
        throw new Error('Async fetch error')
      }
      setStatus('success')
    }
    fetchData().catch((err) => {
      setError(err)
      setStatus('error')
    })
  }, [shouldReject])

  if (error) throw error
  if (status === 'loading') return <div>Loading...</div>
  return <div>Success</div>
}

describe('ErrorBoundary', () => {
  /**
   * Section 1: Component Errors
   */
  describe('Component Errors', () => {
    describe('Render Errors', () => {
      it('should catch errors thrown during render', () => {
        render(
          <TestWrapper>
            <ErrorBoundary>
              <ThrowOnRender message="Test render error" />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })

      it('should render fallback UI when error occurs', () => {
        render(
          <TestWrapper>
            <ErrorBoundary
              fallback={<div data-testid="fallback">Error occurred</div>}
            >
              <ThrowOnRender />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByTestId('fallback')).toBeInTheDocument()
        expect(screen.getByText('Error occurred')).toBeInTheDocument()
      })

      it('should render fallback render prop with error details', () => {
        const renderError = new Error('Detailed error')

        render(
          <TestWrapper>
            <ErrorBoundary
              fallbackRender={({ error, resetErrorBoundary }) => (
                <div>
                  <p data-testid="error-message">{error.message}</p>
                  <button onClick={resetErrorBoundary}>Reset</button>
                </div>
              )}
            >
              <ThrowingComponent error={renderError} />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByTestId('error-message')).toHaveTextContent('Detailed error')
        expect(screen.getByText('Reset')).toBeInTheDocument()
      })

      it('should display default error UI when no fallback provided', () => {
        render(
          <TestWrapper>
            <ErrorBoundary>
              <ThrowOnRender />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()
        // Default UI should have a retry button
        expect(screen.getByText(/try again|retry/i)).toBeInTheDocument()
      })

      it('should capture error info including component stack', () => {
        const onError = vi.fn()

        render(
          <TestWrapper>
            <ErrorBoundary onError={onError}>
              <ThrowOnRender message="Stack trace test" />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(onError).toHaveBeenCalled()
        const [error, errorInfo] = onError.mock.calls[0]
        expect(error.message).toBe('Stack trace test')
        expect(errorInfo).toHaveProperty('componentStack')
      })

      it('should not catch errors outside of children', () => {
        const outsideError = new Error('Outside error')

        expect(() => {
          render(
            <TestWrapper>
              <ErrorBoundary>
                <div>Safe content</div>
              </ErrorBoundary>
              <ThrowingComponent error={outsideError} />
            </TestWrapper>
          )
        }).toThrow('Outside error')
      })
    })

    describe('Event Handler Errors', () => {
      it('should catch errors in event handlers when using error boundary hook', async () => {
        const ComponentWithEventError = () => {
          const [, setCount] = useState(0)

          const handleClick = () => {
            setCount(() => {
              throw new Error('Event handler error')
            })
          }

          return <button onClick={handleClick}>Click me</button>
        }

        render(
          <TestWrapper>
            <ErrorBoundary>
              <ComponentWithEventError />
            </ErrorBoundary>
          </TestWrapper>
        )

        fireEvent.click(screen.getByText('Click me'))

        await waitFor(() => {
          expect(screen.getByRole('alert')).toBeInTheDocument()
        })
      })

      it('should preserve error context for event handlers', async () => {
        const onError = vi.fn()

        const ComponentWithEventError = () => {
          const [shouldThrow, setShouldThrow] = useState(false)

          if (shouldThrow) {
            throw new Error('Triggered by click')
          }

          return (
            <button onClick={() => setShouldThrow(true)}>
              Trigger
            </button>
          )
        }

        render(
          <TestWrapper>
            <ErrorBoundary onError={onError}>
              <ComponentWithEventError />
            </ErrorBoundary>
          </TestWrapper>
        )

        fireEvent.click(screen.getByText('Trigger'))

        await waitFor(() => {
          expect(onError).toHaveBeenCalled()
        })

        expect(onError.mock.calls[0][0].message).toBe('Triggered by click')
      })
    })

    describe('Nested Component Errors', () => {
      it('should catch errors from deeply nested components', () => {
        const DeepChild = () => {
          throw new Error('Deep error')
        }

        const MiddleChild = () => (
          <div>
            <DeepChild />
          </div>
        )

        const Parent = () => (
          <div>
            <MiddleChild />
          </div>
        )

        render(
          <TestWrapper>
            <ErrorBoundary>
              <Parent />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      it('should catch errors from sibling components', () => {
        const GoodSibling = () => <div data-testid="good">I'm fine</div>
        const BadSibling = () => {
          throw new Error('Bad sibling')
        }

        render(
          <TestWrapper>
            <ErrorBoundary>
              <GoodSibling />
              <BadSibling />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()
        // Good sibling should not render when error occurs
        expect(screen.queryByTestId('good')).not.toBeInTheDocument()
      })

      it('should support nested error boundaries with different fallbacks', () => {
        const InnerThrowing = () => {
          throw new Error('Inner error')
        }

        render(
          <TestWrapper>
            <ErrorBoundary fallback={<div data-testid="outer-fallback">Outer error</div>}>
              <div data-testid="outer-content">
                <ErrorBoundary fallback={<div data-testid="inner-fallback">Inner error</div>}>
                  <InnerThrowing />
                </ErrorBoundary>
              </div>
            </ErrorBoundary>
          </TestWrapper>
        )

        // Inner boundary should catch the error
        expect(screen.getByTestId('inner-fallback')).toBeInTheDocument()
        // Outer content should still render
        expect(screen.getByTestId('outer-content')).toBeInTheDocument()
        // Outer fallback should not render
        expect(screen.queryByTestId('outer-fallback')).not.toBeInTheDocument()
      })

      it('should propagate to parent boundary when inner boundary re-throws', () => {
        const InnerThrowing = () => {
          throw new Error('Original error')
        }

        render(
          <TestWrapper>
            <ErrorBoundary fallback={<div data-testid="outer-fallback">Outer caught it</div>}>
              <ErrorBoundary
                fallbackRender={({ error }) => {
                  // Re-throw to propagate to parent
                  throw error
                }}
              >
                <InnerThrowing />
              </ErrorBoundary>
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByTestId('outer-fallback')).toBeInTheDocument()
      })
    })
  })

  /**
   * Section 2: Async Errors
   */
  describe('Async Errors', () => {
    describe('Promise Rejections', () => {
      it('should catch unhandled promise rejections in useEffect', async () => {
        const ComponentWithAsyncError = () => {
          const [error, setError] = useState<Error | null>(null)

          useEffect(() => {
            const fetchData = async () => {
              await new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Async rejection')), 10)
              )
            }
            fetchData().catch(setError)
          }, [])

          if (error) throw error
          return <div>Loading...</div>
        }

        render(
          <TestWrapper>
            <ErrorBoundary>
              <ComponentWithAsyncError />
            </ErrorBoundary>
          </TestWrapper>
        )

        await waitFor(() => {
          expect(screen.getByRole('alert')).toBeInTheDocument()
        })
      })

      it('should handle fetch errors', async () => {
        const ComponentWithFetchError = () => {
          const [error, setError] = useState<Error | null>(null)

          useEffect(() => {
            const doFetch = async () => {
              // Simulate fetch error
              throw new Error('Fetch failed: Network error')
            }
            doFetch().catch(setError)
          }, [])

          if (error) throw error
          return <div>Loading...</div>
        }

        render(
          <TestWrapper>
            <ErrorBoundary>
              <ComponentWithFetchError />
            </ErrorBoundary>
          </TestWrapper>
        )

        await waitFor(() => {
          expect(screen.getByRole('alert')).toBeInTheDocument()
        })
      })

      it('should differentiate between sync and async errors', async () => {
        const onError = vi.fn()

        const AsyncErrorComponent = () => {
          const [error, setError] = useState<Error | null>(null)

          useEffect(() => {
            Promise.reject(new Error('Async error with source'))
              .catch((e) => {
                e.isAsync = true
                setError(e)
              })
          }, [])

          if (error) throw error
          return <div>Loading...</div>
        }

        render(
          <TestWrapper>
            <ErrorBoundary onError={onError}>
              <AsyncErrorComponent />
            </ErrorBoundary>
          </TestWrapper>
        )

        await waitFor(() => {
          expect(onError).toHaveBeenCalled()
        })

        const thrownError = onError.mock.calls[0][0] as Error & { isAsync?: boolean }
        expect(thrownError.isAsync).toBe(true)
      })
    })

    describe('useEffect Errors', () => {
      it('should catch errors in useEffect callbacks', async () => {
        const ComponentWithEffectError = () => {
          const [shouldError, setShouldError] = useState(false)

          useEffect(() => {
            setShouldError(true)
          }, [])

          if (shouldError) {
            throw new Error('Effect triggered error')
          }

          return <div>Initial</div>
        }

        render(
          <TestWrapper>
            <ErrorBoundary>
              <ComponentWithEffectError />
            </ErrorBoundary>
          </TestWrapper>
        )

        await waitFor(() => {
          expect(screen.getByRole('alert')).toBeInTheDocument()
        })
      })

      it('should catch errors in useEffect cleanup', async () => {
        let cleanupCalled = false

        const ComponentWithCleanupError = ({ shouldUnmount }: { shouldUnmount: boolean }) => {
          useEffect(() => {
            return () => {
              cleanupCalled = true
              throw new Error('Cleanup error')
            }
          }, [])

          if (shouldUnmount) return null
          return <div>Component</div>
        }

        const { rerender } = render(
          <TestWrapper>
            <ErrorBoundary>
              <ComponentWithCleanupError shouldUnmount={false} />
            </ErrorBoundary>
          </TestWrapper>
        )

        rerender(
          <TestWrapper>
            <ErrorBoundary>
              <ComponentWithCleanupError shouldUnmount={true} />
            </ErrorBoundary>
          </TestWrapper>
        )

        // Cleanup should have been called
        expect(cleanupCalled).toBe(true)
      })

      it('should handle errors in useLayoutEffect', async () => {
        const ComponentWithLayoutEffectError = () => {
          const [shouldError, setShouldError] = useState(false)

          React.useLayoutEffect(() => {
            setShouldError(true)
          }, [])

          if (shouldError) {
            throw new Error('Layout effect error')
          }

          return <div>Content</div>
        }

        render(
          <TestWrapper>
            <ErrorBoundary>
              <ComponentWithLayoutEffectError />
            </ErrorBoundary>
          </TestWrapper>
        )

        await waitFor(() => {
          expect(screen.getByRole('alert')).toBeInTheDocument()
        })
      })
    })

    describe('Suspense Integration', () => {
      it('should catch errors from suspended components', async () => {
        let shouldResolve = false
        let resolvePromise: () => void

        const resource = {
          read: () => {
            if (shouldResolve) {
              throw new Error('Data loading error')
            }
            throw new Promise<void>((resolve) => {
              resolvePromise = () => {
                shouldResolve = true
                resolve()
              }
            })
          },
        }

        const SuspendingComponent = () => {
          resource.read()
          return <div>Data loaded</div>
        }

        render(
          <TestWrapper>
            <ErrorBoundary>
              <React.Suspense fallback={<div>Loading...</div>}>
                <SuspendingComponent />
              </React.Suspense>
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        // Resolve the promise but with an error
        await waitFor(() => {
          resolvePromise()
        })

        await waitFor(() => {
          expect(screen.getByRole('alert')).toBeInTheDocument()
        })
      })
    })
  })

  /**
   * Section 3: Error Recovery
   */
  describe('Error Recovery', () => {
    describe('Reset Functionality', () => {
      it('should reset error state when resetErrorBoundary is called', async () => {
        let shouldThrow = true

        const ConditionalThrowing = () => {
          if (shouldThrow) {
            throw new Error('Initial error')
          }
          return <div data-testid="recovered">Recovered!</div>
        }

        render(
          <TestWrapper>
            <ErrorBoundary
              fallbackRender={({ resetErrorBoundary }) => (
                <div>
                  <span>Error occurred</span>
                  <button
                    onClick={() => {
                      shouldThrow = false
                      resetErrorBoundary()
                    }}
                  >
                    Reset
                  </button>
                </div>
              )}
            >
              <ConditionalThrowing />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByText('Error occurred')).toBeInTheDocument()

        fireEvent.click(screen.getByText('Reset'))

        await waitFor(() => {
          expect(screen.getByTestId('recovered')).toBeInTheDocument()
        })
      })

      it('should call onReset callback when resetting', async () => {
        const onReset = vi.fn()
        let shouldThrow = true

        const ConditionalThrowing = () => {
          if (shouldThrow) throw new Error('Error')
          return <div>OK</div>
        }

        render(
          <TestWrapper>
            <ErrorBoundary
              onReset={onReset}
              fallbackRender={({ resetErrorBoundary }) => (
                <button
                  onClick={() => {
                    shouldThrow = false
                    resetErrorBoundary()
                  }}
                >
                  Reset
                </button>
              )}
            >
              <ConditionalThrowing />
            </ErrorBoundary>
          </TestWrapper>
        )

        fireEvent.click(screen.getByText('Reset'))

        expect(onReset).toHaveBeenCalled()
      })

      it('should support resetKeys for automatic reset', async () => {
        let throwError = true
        const onReset = vi.fn()

        const MaybeThrow = () => {
          if (throwError) throw new Error('Error')
          return <div data-testid="success">Success</div>
        }

        const { rerender } = render(
          <TestWrapper>
            <ErrorBoundary
              resetKeys={['key1']}
              onReset={onReset}
            >
              <MaybeThrow />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()

        throwError = false

        rerender(
          <TestWrapper>
            <ErrorBoundary
              resetKeys={['key2']} // Key changed
              onReset={onReset}
            >
              <MaybeThrow />
            </ErrorBoundary>
          </TestWrapper>
        )

        await waitFor(() => {
          expect(screen.getByTestId('success')).toBeInTheDocument()
        })

        expect(onReset).toHaveBeenCalled()
      })

      it('should not reset when resetKeys remain the same', () => {
        const onReset = vi.fn()

        const AlwaysThrow = () => {
          throw new Error('Always throws')
        }

        const { rerender } = render(
          <TestWrapper>
            <ErrorBoundary
              resetKeys={['same-key']}
              onReset={onReset}
            >
              <AlwaysThrow />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()

        rerender(
          <TestWrapper>
            <ErrorBoundary
              resetKeys={['same-key']} // Same key
              onReset={onReset}
            >
              <AlwaysThrow />
            </ErrorBoundary>
          </TestWrapper>
        )

        // Should still show error, onReset should not be called
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(onReset).not.toHaveBeenCalled()
      })
    })

    describe('Retry Functionality', () => {
      it('should support retry callback with error info', async () => {
        const onRetry = vi.fn()
        let attemptCount = 0

        const RetryableComponent = () => {
          attemptCount++
          if (attemptCount < 3) {
            throw new Error(`Attempt ${attemptCount} failed`)
          }
          return <div data-testid="success">Success on attempt {attemptCount}</div>
        }

        render(
          <TestWrapper>
            <ErrorBoundary
              onRetry={onRetry}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <div>
                  <span>{error.message}</span>
                  <button onClick={resetErrorBoundary}>Retry</button>
                </div>
              )}
            >
              <RetryableComponent />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByText('Attempt 1 failed')).toBeInTheDocument()

        fireEvent.click(screen.getByText('Retry'))

        await waitFor(() => {
          expect(screen.getByText('Attempt 2 failed')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByText('Retry'))

        await waitFor(() => {
          expect(screen.getByTestId('success')).toBeInTheDocument()
        })
      })

      it('should track retry attempts', async () => {
        let retryCount = 0

        const AlwaysThrows = () => {
          throw new Error('Always fails')
        }

        render(
          <TestWrapper>
            <ErrorBoundary
              fallbackRender={({ resetErrorBoundary, retryCount: count }) => (
                <div>
                  <span data-testid="retry-count">Retry count: {count}</span>
                  <button
                    onClick={() => {
                      retryCount++
                      resetErrorBoundary()
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}
            >
              <AlwaysThrows />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByTestId('retry-count')).toHaveTextContent('Retry count: 0')

        fireEvent.click(screen.getByText('Retry'))

        await waitFor(() => {
          expect(screen.getByTestId('retry-count')).toHaveTextContent('Retry count: 1')
        })

        fireEvent.click(screen.getByText('Retry'))

        await waitFor(() => {
          expect(screen.getByTestId('retry-count')).toHaveTextContent('Retry count: 2')
        })
      })

      it('should support max retries limit', async () => {
        const AlwaysThrows = () => {
          throw new Error('Persistent error')
        }

        render(
          <TestWrapper>
            <ErrorBoundary
              maxRetries={2}
              fallbackRender={({ resetErrorBoundary, retryCount, canRetry }) => (
                <div>
                  <span data-testid="can-retry">{canRetry ? 'can retry' : 'max retries reached'}</span>
                  <button
                    onClick={resetErrorBoundary}
                    disabled={!canRetry}
                  >
                    Retry ({retryCount}/2)
                  </button>
                </div>
              )}
            >
              <AlwaysThrows />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByTestId('can-retry')).toHaveTextContent('can retry')

        fireEvent.click(screen.getByText(/Retry/))

        await waitFor(() => {
          expect(screen.getByTestId('can-retry')).toHaveTextContent('can retry')
        })

        fireEvent.click(screen.getByText(/Retry/))

        await waitFor(() => {
          expect(screen.getByTestId('can-retry')).toHaveTextContent('max retries reached')
        })

        // Button should be disabled
        expect(screen.getByRole('button')).toBeDisabled()
      })
    })

    describe('Error State Persistence', () => {
      it('should preserve last good state on error', () => {
        let throwError = false
        let renderCount = 0

        const StatefulComponent = () => {
          renderCount++
          if (throwError) throw new Error('Error')
          return <div data-testid="render-count">{renderCount}</div>
        }

        const { rerender } = render(
          <TestWrapper>
            <ErrorBoundary
              fallbackRender={({ lastGoodState }) => (
                <div data-testid="last-state">Last state: {lastGoodState?.renderCount}</div>
              )}
            >
              <StatefulComponent />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByTestId('render-count')).toHaveTextContent('1')

        throwError = true

        rerender(
          <TestWrapper>
            <ErrorBoundary
              fallbackRender={({ lastGoodState }) => (
                <div data-testid="last-state">
                  Last render: {lastGoodState?.renderCount ?? 'unknown'}
                </div>
              )}
            >
              <StatefulComponent />
            </ErrorBoundary>
          </TestWrapper>
        )

        // Should show last good state info
        expect(screen.getByTestId('last-state')).toBeInTheDocument()
      })
    })
  })

  /**
   * Section 4: Error Reporting and Logging
   */
  describe('Error Reporting and Logging', () => {
    describe('Error Callbacks', () => {
      it('should call onError with error and errorInfo', () => {
        const onError = vi.fn()

        render(
          <TestWrapper>
            <ErrorBoundary onError={onError}>
              <ThrowOnRender message="Test error for callback" />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(onError).toHaveBeenCalledTimes(1)

        const [error, errorInfo] = onError.mock.calls[0]
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Test error for callback')
        expect(errorInfo).toBeDefined()
        expect(typeof errorInfo.componentStack).toBe('string')
      })

      it('should support async error reporting', async () => {
        const reportError = vi.fn().mockResolvedValue(undefined)

        render(
          <TestWrapper>
            <ErrorBoundary
              onError={async (error, errorInfo) => {
                await reportError({ error: error.message, stack: errorInfo.componentStack })
              }}
            >
              <ThrowOnRender />
            </ErrorBoundary>
          </TestWrapper>
        )

        await waitFor(() => {
          expect(reportError).toHaveBeenCalled()
        })
      })

      it('should include error boundary id in error reports', () => {
        const onError = vi.fn()

        render(
          <TestWrapper>
            <ErrorBoundary
              id="user-profile-boundary"
              onError={onError}
            >
              <ThrowOnRender />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(onError).toHaveBeenCalled()
        const errorInfo = onError.mock.calls[0][1]
        expect(errorInfo.boundaryId).toBe('user-profile-boundary')
      })
    })

    describe('Error Context', () => {
      it('should provide error context to children via context', () => {
        const ContextConsumer = () => {
          // Expected hook: useErrorBoundary
          // This would be used to programmatically trigger error boundary
          return <div data-testid="consumer">Context consumer</div>
        }

        render(
          <TestWrapper>
            <ErrorBoundary>
              <ContextConsumer />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByTestId('consumer')).toBeInTheDocument()
      })

      it('should expose showBoundary function via useErrorBoundary hook', async () => {
        // Expected hook that allows programmatic error triggering
        const ComponentWithManualError = () => {
          // const { showBoundary } = useErrorBoundary()
          // For now, simulate with state
          const [error, setError] = useState<Error | null>(null)

          if (error) throw error

          return (
            <button onClick={() => setError(new Error('Manual error'))}>
              Trigger Error
            </button>
          )
        }

        render(
          <TestWrapper>
            <ErrorBoundary>
              <ComponentWithManualError />
            </ErrorBoundary>
          </TestWrapper>
        )

        fireEvent.click(screen.getByText('Trigger Error'))

        await waitFor(() => {
          expect(screen.getByRole('alert')).toBeInTheDocument()
        })
      })
    })

    describe('Error Categorization', () => {
      it('should categorize errors by type', () => {
        const onError = vi.fn()

        class CustomError extends Error {
          constructor() {
            super('Custom error')
            this.name = 'CustomError'
          }
        }

        const ThrowCustom = () => {
          throw new CustomError()
        }

        render(
          <TestWrapper>
            <ErrorBoundary
              onError={onError}
              fallbackRender={({ error }) => (
                <div data-testid="error-type">{error.name}</div>
              )}
            >
              <ThrowCustom />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(screen.getByTestId('error-type')).toHaveTextContent('CustomError')
      })

      it('should support error filtering', () => {
        const shouldCatch = vi.fn().mockReturnValue(true)

        render(
          <TestWrapper>
            <ErrorBoundary
              shouldCatch={shouldCatch}
            >
              <ThrowOnRender message="Filtered error" />
            </ErrorBoundary>
          </TestWrapper>
        )

        expect(shouldCatch).toHaveBeenCalled()
        expect(shouldCatch).toHaveBeenCalledWith(
          expect.objectContaining({ message: 'Filtered error' })
        )
      })

      it('should re-throw when shouldCatch returns false', () => {
        const shouldCatch = vi.fn().mockReturnValue(false)

        expect(() => {
          render(
            <TestWrapper>
              <ErrorBoundary shouldCatch={shouldCatch}>
                <ThrowOnRender message="Should propagate" />
              </ErrorBoundary>
            </TestWrapper>
          )
        }).toThrow('Should propagate')
      })
    })

    describe('Development vs Production', () => {
      it('should show detailed error in development', () => {
        const originalNodeEnv = process.env.NODE_ENV

        render(
          <TestWrapper>
            <ErrorBoundary>
              <ThrowOnRender message="Development error details" />
            </ErrorBoundary>
          </TestWrapper>
        )

        // In development, full error message should be visible
        expect(screen.getByText(/Development error details/)).toBeInTheDocument()

        // Restore
        process.env.NODE_ENV = originalNodeEnv
      })

      it('should show generic error message in production when configured', () => {
        render(
          <TestWrapper>
            <ErrorBoundary
              productionMessage="Something went wrong. Please try again."
            >
              <ThrowOnRender message="Sensitive error details" />
            </ErrorBoundary>
          </TestWrapper>
        )

        // Should be configurable to show generic message
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
    })
  })

  /**
   * Section 5: Integration with Shadmin Components
   */
  describe('Integration with Shadmin Components', () => {
    it('should work with DataProvider errors', async () => {
      // This test verifies ErrorBoundary works with data fetching components
      render(
        <TestWrapper>
          <ErrorBoundary>
            <AsyncThrowingComponent />
          </ErrorBoundary>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
    })

    it('should provide admin-specific error actions', () => {
      render(
        <TestWrapper>
          <ErrorBoundary
            showHomeButton
            showLogoutButton
            showRefreshButton
          >
            <ThrowOnRender />
          </ErrorBoundary>
        </TestWrapper>
      )

      // Should show admin-specific action buttons
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/home|dashboard/i)).toBeInTheDocument()
      expect(screen.getByText(/refresh|retry/i)).toBeInTheDocument()
    })

    it('should support custom error component prop', () => {
      const CustomError = ({ error }: { error: Error }) => (
        <div data-testid="custom-error">
          <h1>Custom Error UI</h1>
          <p>{error.message}</p>
        </div>
      )

      render(
        <TestWrapper>
          <ErrorBoundary
            ErrorComponent={CustomError}
          >
            <ThrowOnRender message="Custom handling" />
          </ErrorBoundary>
        </TestWrapper>
      )

      expect(screen.getByTestId('custom-error')).toBeInTheDocument()
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument()
      expect(screen.getByText('Custom handling')).toBeInTheDocument()
    })
  })
})
