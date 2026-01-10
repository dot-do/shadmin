/**
 * LoginPage Component
 * A complete login page with form for username/password authentication
 */

import { useCallback, useState, type FormEvent } from 'react'
import { useLogin, type LoginOptions } from '../../hooks/useLogin'
import { cn } from '../../utils'

/**
 * Props for LoginPage component
 */
export interface LoginPageProps {
  /**
   * Title displayed at the top of the login form
   * @default "Sign In"
   */
  title?: string
  /**
   * Custom class name for the login page container
   */
  className?: string
  /**
   * Where to redirect after successful login
   * @default "/"
   */
  redirectTo?: string
  /**
   * Custom background image URL
   */
  backgroundImage?: string
  /**
   * Show a "Remember me" checkbox
   */
  showRememberMe?: boolean
  /**
   * Custom submit button text
   * @default "Sign In"
   */
  submitButtonText?: string
  /**
   * Custom loading button text
   * @default "Signing in..."
   */
  loadingButtonText?: string
}

/**
 * Input styling based on ShadCN Input component patterns.
 */
const inputStyles = cn(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
  'ring-offset-background',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

const errorInputStyles = 'border-destructive focus-visible:ring-destructive'

/**
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * Button styling based on ShadCN Button component patterns.
 */
const buttonStyles = cn(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  'ring-offset-background transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  'bg-primary text-primary-foreground hover:bg-primary/90',
  'h-10 px-4 py-2 w-full'
)

/**
 * LoginPage component for user authentication.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LoginPage />
 *
 * // With custom title and redirect
 * <LoginPage
 *   title="Welcome Back"
 *   redirectTo="/dashboard"
 * />
 *
 * // With custom styling
 * <LoginPage
 *   className="my-custom-login"
 *   backgroundImage="/login-bg.jpg"
 * />
 * ```
 */
/**
 * Checkbox styling based on ShadCN Checkbox component patterns.
 */
const checkboxStyles = cn(
  'peer h-4 w-4 shrink-0 rounded-sm border border-primary',
  'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'accent-primary'
)

export function LoginPage({
  title = 'Sign In',
  className,
  redirectTo = '/',
  backgroundImage,
  showRememberMe = false,
  submitButtonText = 'Sign In',
  loadingButtonText = 'Signing in...',
}: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const { login, isLoading, error } = useLogin()

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      // Basic validation
      if (!username.trim() || !password.trim()) {
        return
      }

      const options: LoginOptions = {
        redirectTo,
      }

      try {
        await login({ username, password, rememberMe }, options)
      } catch {
        // Error is handled by useLogin hook and displayed in the UI
      }
    },
    [username, password, rememberMe, login, redirectTo]
  )

  const containerStyles = cn(
    'min-h-screen flex items-center justify-center',
    'bg-background',
    className
  )

  const formContainerStyles = cn(
    'w-full max-w-md mx-auto p-6',
    'bg-card rounded-lg shadow-lg',
    'border border-border'
  )

  const backgroundStyles = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined

  return (
    <div
      className={containerStyles}
      style={backgroundStyles}
      data-testid="login-page"
    >
      <div className={formContainerStyles} data-testid="login-form-container">
        <div className="space-y-6">
          <div className="text-center">
            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              data-testid="login-title"
            >
              {title}
            </h1>
          </div>

          {error && (
            <div
              className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
              role="alert"
              data-testid="login-error"
            >
              {error.message || 'Authentication failed, please retry'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
            <div className="space-y-2">
              <label htmlFor="username" className={labelStyles}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={cn(inputStyles, error && errorInputStyles)}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your username"
                data-testid="login-username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className={labelStyles}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={cn(inputStyles, error && errorInputStyles)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your password"
                data-testid="login-password"
              />
            </div>

            {showRememberMe && (
              <div className="flex items-center space-x-2">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  className={checkboxStyles}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  data-testid="login-remember-me"
                />
                <label
                  htmlFor="remember-me"
                  className={cn(labelStyles, 'cursor-pointer')}
                >
                  Remember me
                </label>
              </div>
            )}

            <button
              type="submit"
              className={buttonStyles}
              disabled={isLoading}
              data-testid="login-submit"
            >
              {isLoading ? loadingButtonText : submitButtonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

LoginPage.displayName = 'LoginPage'
