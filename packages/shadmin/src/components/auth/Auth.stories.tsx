/**
 * Auth Component Stories
 * Stories for authentication components: LoginPage, LogoutButton, ProtectedRoute, UserMenu
 */

import { useState, type ReactNode } from 'react'
import { MemoryRouter, Routes, Route, Navigate, useLocation } from 'react-router'

import { LoginPage } from './LoginPage'
import { LogoutButton } from './LogoutButton'
import { ProtectedRoute } from './ProtectedRoute'
import { AuthProviderContextProvider } from '../../contexts/AuthProviderContext'

import type { AuthProvider, UserIdentity } from '../../facade'
import type { Meta, StoryObj } from '@storybook/react'

// ============================================================================
// Mock Auth Provider
// ============================================================================

interface MockAuthProviderOptions {
  isAuthenticated?: boolean
  identity?: UserIdentity
  permissions?: string[] | Record<string, boolean>
  delay?: number
  validCredentials?: { username: string; password: string }
  loginError?: string
}

function createStoryAuthProvider(options: MockAuthProviderOptions = {}): AuthProvider {
  const {
    isAuthenticated: initialAuth = true,
    identity = { id: 1, fullName: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    permissions = ['admin', 'read', 'write'],
    delay = 500,
    validCredentials,
    loginError,
  } = options

  let isAuthenticated = initialAuth

  return {
    login: async (params) => {
      await new Promise((resolve) => setTimeout(resolve, delay))

      if (loginError) {
        throw new Error(loginError)
      }

      if (validCredentials) {
        const credentials = params as { username: string; password: string }
        if (
          credentials.username !== validCredentials.username ||
          credentials.password !== validCredentials.password
        ) {
          throw new Error('Invalid username or password')
        }
      }

      isAuthenticated = true
      return undefined
    },
    logout: async () => {
      await new Promise((resolve) => setTimeout(resolve, delay))
      isAuthenticated = false
      return undefined
    },
    checkAuth: async () => {
      await new Promise((resolve) => setTimeout(resolve, delay / 2))
      if (!isAuthenticated) {
        throw new Error('Not authenticated')
      }
    },
    checkError: async () => undefined,
    getPermissions: async () => {
      await new Promise((resolve) => setTimeout(resolve, delay / 4))
      return permissions
    },
    getIdentity: async () => {
      await new Promise((resolve) => setTimeout(resolve, delay / 4))
      if (!isAuthenticated) {
        throw new Error('Not authenticated')
      }
      return identity
    },
  }
}

// ============================================================================
// Wrapper Components
// ============================================================================

interface AuthWrapperProps {
  children: ReactNode
  authProviderOptions?: MockAuthProviderOptions
}

function AuthWrapper({ children, authProviderOptions = {} }: AuthWrapperProps) {
  const authProvider = createStoryAuthProvider(authProviderOptions)
  return (
    <MemoryRouter>
      <AuthProviderContextProvider authProvider={authProvider}>
        {children}
      </AuthProviderContextProvider>
    </MemoryRouter>
  )
}

// ============================================================================
// UserMenu Component (from AppBar, exported for stories)
// ============================================================================

interface UserMenuProps {
  name: string
  email?: string
  avatar?: string
  onLogout?: () => void
}

function UserMenu({ name, email, avatar, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <span className="text-xs font-medium">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span>{name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-md border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
          >
            <div className="px-2 py-1.5 text-sm font-semibold">{name}</div>
            {email && (
              <div className="px-2 pb-1.5 text-xs text-muted-foreground">
                {email}
              </div>
            )}
            <div className="-mx-1 my-1 h-px bg-border" />
            <button
              role="menuitem"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </button>
            <button
              role="menuitem"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </button>
            <div className="-mx-1 my-1 h-px bg-border" />
            <button
              role="menuitem"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:outline-none"
              onClick={() => {
                setIsOpen(false)
                onLogout?.()
              }}
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// LoginPage Stories
// ============================================================================

const loginPageMeta: Meta<typeof LoginPage> = {
  title: 'Components/Auth/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A complete login page with username/password authentication form. Integrates with AuthProvider for authentication.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => (
      <AuthWrapper authProviderOptions={(context.args as Record<string, unknown>)?.authProviderOptions as MockAuthProviderOptions}>
        <Story />
      </AuthWrapper>
    ),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title displayed at the top of the login form',
    },
    submitButtonText: {
      control: 'text',
      description: 'Text for the submit button',
    },
    loadingButtonText: {
      control: 'text',
      description: 'Text shown while login is in progress',
    },
    redirectTo: {
      control: 'text',
      description: 'URL to redirect to after successful login',
    },
  },
}

export default loginPageMeta

type LoginPageStory = StoryObj<typeof LoginPage & { authProviderOptions?: MockAuthProviderOptions }>

/**
 * Default login form with standard styling
 */
export const Default: LoginPageStory = {
  args: {},
}

/**
 * Login form with custom title and button text
 */
export const CustomTitle: LoginPageStory = {
  args: {
    title: 'Welcome Back',
    submitButtonText: 'Log In',
    loadingButtonText: 'Logging in...',
  },
}

/**
 * Login form with background image
 */
export const WithBackground: LoginPageStory = {
  args: {
    title: 'Admin Portal',
    backgroundImage:
      'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop',
  },
}

/**
 * Simulates a loading state after form submission.
 * Enter any credentials and click Sign In to see the loading state.
 */
export const LoadingState: LoginPageStory = {
  args: {
    loadingButtonText: 'Authenticating...',
  },
  decorators: [
    (Story) => (
      <AuthWrapper authProviderOptions={{ delay: 3000 }}>
        <Story />
      </AuthWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Submit the form to see the loading state (3 second delay).',
      },
    },
  },
}

/**
 * Shows the error state when login fails.
 * Enter any credentials to trigger the error.
 */
export const ErrorState: LoginPageStory = {
  args: {},
  decorators: [
    (Story) => (
      <AuthWrapper
        authProviderOptions={{
          loginError: 'Invalid username or password. Please try again.',
        }}
      >
        <Story />
      </AuthWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Submit the form to see the error state.',
      },
    },
  },
}

/**
 * Login form with credential validation.
 * Use username: "admin" and password: "secret" to log in successfully.
 */
export const WithValidation: LoginPageStory = {
  args: {
    title: 'Secure Login',
  },
  decorators: [
    (Story) => (
      <AuthWrapper
        authProviderOptions={{
          validCredentials: { username: 'admin', password: 'secret' },
        }}
      >
        <div className="relative">
          <Story />
          <div className="absolute bottom-4 left-4 rounded-md bg-muted p-3 text-sm">
            <p className="font-semibold">Demo Credentials:</p>
            <p>Username: admin</p>
            <p>Password: secret</p>
          </div>
        </div>
      </AuthWrapper>
    ),
  ],
}

// ============================================================================
// LogoutButton Stories
// ============================================================================

export const LogoutButtonDefault: StoryObj<typeof LogoutButton> = {
  name: 'LogoutButton / Default',
  render: () => (
    <AuthWrapper>
      <div className="p-8">
        <LogoutButton />
      </div>
    </AuthWrapper>
  ),
}

export const LogoutButtonVariants: StoryObj<typeof LogoutButton> = {
  name: 'LogoutButton / Variants',
  render: () => (
    <AuthWrapper>
      <div className="flex flex-wrap gap-4 p-8">
        <LogoutButton variant="default" label="Default" />
        <LogoutButton variant="outline" label="Outline" />
        <LogoutButton variant="ghost" label="Ghost" />
        <LogoutButton variant="destructive" label="Destructive" />
      </div>
    </AuthWrapper>
  ),
}

export const LogoutButtonSizes: StoryObj<typeof LogoutButton> = {
  name: 'LogoutButton / Sizes',
  render: () => (
    <AuthWrapper>
      <div className="flex flex-wrap items-center gap-4 p-8">
        <LogoutButton size="sm" label="Small" />
        <LogoutButton size="default" label="Default" />
        <LogoutButton size="lg" label="Large" />
        <LogoutButton
          size="icon"
          iconOnly
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          }
        />
      </div>
    </AuthWrapper>
  ),
}

export const LogoutButtonWithIcon: StoryObj<typeof LogoutButton> = {
  name: 'LogoutButton / With Icon',
  render: () => (
    <AuthWrapper>
      <div className="flex flex-wrap gap-4 p-8">
        <LogoutButton
          label="Sign Out"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          }
        />
        <LogoutButton
          variant="outline"
          label="Log Out"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          }
        />
      </div>
    </AuthWrapper>
  ),
}

export const LogoutButtonWithConfirmation: StoryObj<typeof LogoutButton> = {
  name: 'LogoutButton / With Confirmation',
  render: () => (
    <AuthWrapper>
      <div className="p-8">
        <LogoutButton
          label="Logout"
          confirmTitle="Confirm Logout"
          confirmMessage="Are you sure you want to log out? Any unsaved changes will be lost."
          variant="destructive"
        />
      </div>
    </AuthWrapper>
  ),
}

export const LogoutButtonLoading: StoryObj<typeof LogoutButton> = {
  name: 'LogoutButton / Loading State',
  render: () => (
    <AuthWrapper authProviderOptions={{ delay: 3000 }}>
      <div className="p-8">
        <p className="mb-4 text-sm text-muted-foreground">
          Click the button to see the loading state (3 second delay)
        </p>
        <LogoutButton loadingLabel="Signing out..." />
      </div>
    </AuthWrapper>
  ),
}

// ============================================================================
// UserMenu Stories
// ============================================================================

export const UserMenuDefault: StoryObj = {
  name: 'UserMenu / Default',
  render: () => (
    <div className="p-8">
      <UserMenu
        name="John Doe"
        email="john.doe@example.com.ai"
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
      />
    </div>
  ),
}

export const UserMenuNoAvatar: StoryObj = {
  name: 'UserMenu / No Avatar',
  render: () => (
    <div className="p-8">
      <UserMenu name="Jane Smith" email="jane.smith@example.com.ai" />
    </div>
  ),
}

export const UserMenuWithLogout: StoryObj = {
  name: 'UserMenu / With Logout Action',
  render: () => {
    const [logoutCount, setLogoutCount] = useState(0)
    return (
      <div className="p-8">
        <div className="mb-4 text-sm text-muted-foreground">
          Logout clicked: {logoutCount} times
        </div>
        <UserMenu
          name="Admin User"
          email="admin@example.com.ai"
          avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
          onLogout={() => setLogoutCount((c) => c + 1)}
        />
      </div>
    )
  },
}

// ============================================================================
// ProtectedRoute Stories
// ============================================================================

function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        You are viewing protected content. This page is only visible to
        authenticated users.
      </p>
    </div>
  )
}

function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
      <p className="mt-2 text-muted-foreground">
        This page requires admin role to access.
      </p>
    </div>
  )
}

function LoginRedirectPage() {
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Login Required</h1>
        <p className="mt-2 text-muted-foreground">
          You need to log in to access: {from}
        </p>
        <button
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}

function UnauthorizedPage() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Checking authentication...</span>
      </div>
    </div>
  )
}

export const ProtectedRouteAuthenticated: StoryObj = {
  name: 'ProtectedRoute / Authenticated',
  render: () => (
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthProviderContextProvider
        authProvider={createStoryAuthProvider({ isAuthenticated: true })}
      >
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute loading={<LoadingSpinner />}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginRedirectPage />} />
        </Routes>
      </AuthProviderContextProvider>
    </MemoryRouter>
  ),
}

export const ProtectedRouteUnauthenticated: StoryObj = {
  name: 'ProtectedRoute / Unauthenticated (Redirects)',
  render: () => (
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthProviderContextProvider
        authProvider={createStoryAuthProvider({ isAuthenticated: false })}
      >
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute loading={<LoadingSpinner />}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginRedirectPage />} />
        </Routes>
      </AuthProviderContextProvider>
    </MemoryRouter>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When user is not authenticated, they are redirected to the login page.',
      },
    },
  },
}

export const ProtectedRouteWithRoles: StoryObj = {
  name: 'ProtectedRoute / With Role Check',
  render: () => (
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProviderContextProvider
        authProvider={createStoryAuthProvider({
          isAuthenticated: true,
          permissions: ['admin', 'superuser'],
        })}
      >
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                requiredRoles={['admin']}
                loading={<LoadingSpinner />}
              >
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginRedirectPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </AuthProviderContextProvider>
    </MemoryRouter>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User has admin role, so they can access the admin page.',
      },
    },
  },
}

export const ProtectedRouteUnauthorized: StoryObj = {
  name: 'ProtectedRoute / Unauthorized (Missing Role)',
  render: () => (
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProviderContextProvider
        authProvider={createStoryAuthProvider({
          isAuthenticated: true,
          permissions: ['read', 'write'], // No admin role
        })}
      >
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                requiredRoles={['admin']}
                loading={<LoadingSpinner />}
              >
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginRedirectPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </AuthProviderContextProvider>
    </MemoryRouter>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'User is authenticated but lacks the admin role, so they are redirected to the unauthorized page.',
      },
    },
  },
}

export const ProtectedRouteLoading: StoryObj = {
  name: 'ProtectedRoute / Loading State',
  render: () => (
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthProviderContextProvider
        authProvider={createStoryAuthProvider({
          isAuthenticated: true,
          delay: 5000, // Long delay to show loading state
        })}
      >
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute loading={<LoadingSpinner />}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProviderContextProvider>
    </MemoryRouter>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows custom loading component while authentication is being verified.',
      },
    },
  },
}

export const ProtectedRouteCustomError: StoryObj = {
  name: 'ProtectedRoute / Custom Error Component',
  render: () => {
    const ErrorDisplay = ({ error }: { error: Error }) => (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-8 w-8 text-destructive"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Authentication Error</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )

    return (
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProviderContextProvider
          authProvider={createStoryAuthProvider({ isAuthenticated: false })}
        >
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  loading={<LoadingSpinner />}
                  errorComponent={ErrorDisplay}
                >
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginRedirectPage />} />
          </Routes>
        </AuthProviderContextProvider>
      </MemoryRouter>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a custom error component when authentication fails instead of redirecting.',
      },
    },
  },
}

// ============================================================================
// Complete Auth Flow Demo
// ============================================================================

function AuthFlowDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserIdentity | null>(null)

  const authProvider: AuthProvider = {
    login: async (params) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const { username } = params as { username: string }
      setIsLoggedIn(true)
      setCurrentUser({
        id: 1,
        fullName: username || 'Demo User',
      })
    },
    logout: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsLoggedIn(false)
      setCurrentUser(null)
    },
    checkAuth: async () => {
      if (!isLoggedIn) throw new Error('Not authenticated')
    },
    checkError: async () => undefined,
    getPermissions: async () => ['admin'],
    getIdentity: async () => {
      if (!currentUser) throw new Error('Not authenticated')
      return currentUser
    },
  }

  return (
    <MemoryRouter initialEntries={[isLoggedIn ? '/dashboard' : '/login']}>
      <AuthProviderContextProvider authProvider={authProvider}>
        <div className="min-h-[600px] bg-background">
          {/* Header */}
          <header className="border-b bg-background px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Auth Flow Demo</h1>
              {isLoggedIn && currentUser && (
                <div className="flex items-center gap-4">
                  <UserMenu
                    name={currentUser.fullName || 'User'}
                    onLogout={() => {
                      setIsLoggedIn(false)
                      setCurrentUser(null)
                    }}
                  />
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage title="Demo Login" />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold">
                      Welcome, {currentUser?.fullName}!
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      You are now logged in. Use the menu in the header to log out.
                    </p>
                    <div className="mt-6">
                      <LogoutButton variant="outline" />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </AuthProviderContextProvider>
    </MemoryRouter>
  )
}

export const CompleteAuthFlow: StoryObj = {
  name: 'Complete Auth Flow',
  render: () => <AuthFlowDemo />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'A complete demonstration of the authentication flow including login, dashboard access, user menu, and logout functionality.',
      },
    },
  },
}
