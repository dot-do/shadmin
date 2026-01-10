/**
 * ErrorBoundary component
 * A React error boundary with comprehensive error handling, recovery, and reporting features
 */

import { Component, createContext, useContext, type ReactNode, type ErrorInfo, type ComponentType } from 'react'

/**
 * Error info provided to callbacks and fallback components
 */
export interface ErrorBoundaryErrorInfo {
  componentStack: string
  boundaryId?: string
}

/**
 * Props for the fallback render function
 */
export interface FallbackRenderProps {
  error: Error
  resetErrorBoundary: () => void
  retryCount: number
  canRetry: boolean
  lastGoodState?: { renderCount?: number }
}

/**
 * Props for custom error components
 */
export interface ErrorComponentProps {
  error: Error
}

/**
 * Props for the ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  children: ReactNode
  /** Static fallback element to render on error */
  fallback?: ReactNode
  /** Function that renders the fallback UI with error details */
  fallbackRender?: (props: FallbackRenderProps) => ReactNode
  /** Custom error component to render */
  ErrorComponent?: ComponentType<ErrorComponentProps>
  /** Called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorBoundaryErrorInfo) => void | Promise<void>
  /** Called when the boundary is reset */
  onReset?: () => void
  /** Called when retry is attempted */
  onRetry?: (error: Error, retryCount: number) => void
  /** Array of values that trigger a reset when changed */
  resetKeys?: unknown[]
  /** Maximum number of retries allowed */
  maxRetries?: number
  /** Unique identifier for this boundary (included in error reports) */
  id?: string
  /** Custom message to show in production */
  productionMessage?: string
  /** Function to determine if error should be caught */
  shouldCatch?: (error: Error) => boolean
  /** Show a button to go to home/dashboard */
  showHomeButton?: boolean
  /** Show a button to log out */
  showLogoutButton?: boolean
  /** Show a button to refresh/retry */
  showRefreshButton?: boolean
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  retryCount: number
  lastGoodRenderCount: number
}

/**
 * Context for error boundary state
 */
interface ErrorBoundaryContextValue {
  showBoundary: (error: Error) => void
  resetBoundary: () => void
  error: Error | null
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextValue | null>(null)

/**
 * Hook to access the error boundary context
 */
export function useErrorBoundary(): ErrorBoundaryContextValue {
  const context = useContext(ErrorBoundaryContext)
  if (!context) {
    // Provide a fallback for components not wrapped in ErrorBoundary
    return {
      showBoundary: () => {},
      resetBoundary: () => {},
      error: null,
    }
  }
  return context
}

/**
 * Default fallback UI component
 */
function DefaultFallback({
  error,
  resetErrorBoundary,
  canRetry,
  showHomeButton,
  showLogoutButton,
  showRefreshButton,
}: FallbackRenderProps & {
  showHomeButton?: boolean
  showLogoutButton?: boolean
  showRefreshButton?: boolean
}) {
  return (
    <div
      role="alert"
      data-testid="error-boundary-fallback"
      style={{
        padding: '20px',
        margin: '20px',
        border: '1px solid #dc2626',
        borderRadius: '8px',
        backgroundColor: '#fef2f2',
      }}
    >
      <h2 style={{ color: '#dc2626', marginTop: 0 }}>Something went wrong</h2>
      <p data-testid="error-message" style={{ color: '#991b1b' }}>{error.message}</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        {(showRefreshButton || canRetry) && (
          <button
            onClick={resetErrorBoundary}
            disabled={!canRetry}
            data-testid="error-retry-button"
            style={{
              padding: '8px 16px',
              backgroundColor: canRetry ? '#2563eb' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: canRetry ? 'pointer' : 'not-allowed',
            }}
          >
            {showRefreshButton ? 'Refresh' : 'Try Again'}
          </button>
        )}
        {showHomeButton && (
          <button
            onClick={() => (window.location.href = '/')}
            data-testid="error-home-button"
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Go to Dashboard
          </button>
        )}
        {showLogoutButton && (
          <button
            onClick={() => (window.location.href = '/login')}
            data-testid="error-logout-button"
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * ErrorBoundary - A React error boundary component with recovery and reporting features
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallbackRender={({ error, resetErrorBoundary }) => (
 *     <div>
 *       <p>Error: {error.message}</p>
 *       <button onClick={resetErrorBoundary}>Retry</button>
 *     </div>
 *   )}
 *   onError={(error, info) => logErrorToService(error, info)}
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private renderCount = 0

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      lastGoodRenderCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, id, shouldCatch } = this.props

    // Check if we should catch this error
    if (shouldCatch && !shouldCatch(error)) {
      // Re-throw if shouldCatch returns false
      throw error
    }

    // Call the onError callback with enhanced error info
    if (onError) {
      const enhancedInfo: ErrorBoundaryErrorInfo = {
        componentStack: errorInfo.componentStack ?? '',
        boundaryId: id,
      }
      // Handle both sync and async onError
      Promise.resolve(onError(error, enhancedInfo)).catch(() => {
        // Silently ignore errors in error handlers
      })
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys, onReset } = this.props
    const { hasError } = this.state

    // Check if resetKeys have changed
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasKeysChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      )
      if (hasKeysChanged) {
        this.resetErrorBoundary()
        onReset?.()
      }
    }
  }

  resetErrorBoundary = (): void => {
    const { onReset, onRetry, maxRetries } = this.props
    const { error, retryCount } = this.state

    // Check if max retries exceeded
    if (maxRetries !== undefined && retryCount >= maxRetries) {
      return
    }

    // Call onRetry with error info
    if (onRetry && error) {
      onRetry(error, retryCount)
    }

    // Update state
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1,
      lastGoodRenderCount: this.renderCount,
    }))

    // Call onReset if provided
    onReset?.()
  }

  showBoundary = (error: Error): void => {
    this.setState({
      hasError: true,
      error,
    })
  }

  render(): ReactNode {
    const {
      children,
      fallback,
      fallbackRender,
      ErrorComponent,
      maxRetries,
      productionMessage,
      showHomeButton,
      showLogoutButton,
      showRefreshButton,
    } = this.props
    const { hasError, error, retryCount, lastGoodRenderCount } = this.state

    // Track render count for last good state
    if (!hasError) {
      this.renderCount++
    }

    // Calculate canRetry
    const canRetry = maxRetries === undefined || retryCount < maxRetries

    // Create context value
    const contextValue: ErrorBoundaryContextValue = {
      showBoundary: this.showBoundary,
      resetBoundary: this.resetErrorBoundary,
      error,
    }

    if (hasError && error) {
      const fallbackProps: FallbackRenderProps = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,
        retryCount,
        canRetry,
        lastGoodState: { renderCount: lastGoodRenderCount },
      }

      // Use custom ErrorComponent if provided
      if (ErrorComponent) {
        return (
          <ErrorBoundaryContext.Provider value={contextValue}>
            <ErrorComponent error={error} />
          </ErrorBoundaryContext.Provider>
        )
      }

      // Use fallbackRender if provided
      if (fallbackRender) {
        return (
          <ErrorBoundaryContext.Provider value={contextValue}>
            {fallbackRender(fallbackProps)}
          </ErrorBoundaryContext.Provider>
        )
      }

      // Use static fallback if provided
      if (fallback) {
        return (
          <ErrorBoundaryContext.Provider value={contextValue}>
            {fallback}
          </ErrorBoundaryContext.Provider>
        )
      }

      // Use default fallback
      // Check if we should show production message
      const displayError =
        productionMessage && process.env.NODE_ENV === 'production'
          ? new Error(productionMessage)
          : error

      return (
        <ErrorBoundaryContext.Provider value={contextValue}>
          <DefaultFallback
            {...fallbackProps}
            error={displayError}
            showHomeButton={showHomeButton}
            showLogoutButton={showLogoutButton}
            showRefreshButton={showRefreshButton}
          />
        </ErrorBoundaryContext.Provider>
      )
    }

    return (
      <ErrorBoundaryContext.Provider value={contextValue}>
        {children}
      </ErrorBoundaryContext.Provider>
    )
  }
}

export default ErrorBoundary
