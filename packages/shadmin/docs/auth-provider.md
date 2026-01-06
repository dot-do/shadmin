# AuthProvider Interface

The `AuthProvider` interface defines the authentication contract for Shadmin applications. It provides a standardized way to handle user authentication, authorization, and identity management, with 100% API compatibility with react-admin.

## Table of Contents

- [Overview](#overview)
- [Type Definitions](#type-definitions)
- [Methods](#methods)
  - [login](#login)
  - [logout](#logout)
  - [checkAuth](#checkauth)
  - [checkError](#checkerror)
  - [getPermissions](#getpermissions)
  - [getIdentity](#getidentity)
  - [handleCallback](#handlecallback)
- [Implementation Examples](#implementation-examples)
  - [Basic AuthProvider](#basic-authprovider)
  - [JWT Token Handling](#jwt-token-handling)
  - [OAuth Provider](#oauth-provider)
- [Role-Based Access Control](#role-based-access-control)
  - [Role-Based Permissions](#role-based-permissions)
  - [Resource-Level Permissions](#resource-level-permissions)
- [Using the AuthProvider](#using-the-authprovider)
  - [Context and Hooks](#context-and-hooks)
  - [Protected Routes](#protected-routes)

## Overview

The AuthProvider is passed to the Admin component and is used throughout the application to:

- Authenticate users during login
- Handle logout and session cleanup
- Verify authentication status on protected routes
- Handle API errors (like 401/403 responses)
- Fetch user permissions for authorization
- Retrieve user identity for display purposes

## Type Definitions

```typescript
import type { Identifier } from './data-provider'

export interface UserIdentity {
  id: Identifier
  fullName?: string
  avatar?: string
  [key: string]: unknown
}

export interface AuthRedirectResult {
  redirectTo?: string | false
  logoutOnFailure?: boolean
}

export interface AuthProvider {
  login: (params: unknown) => Promise<unknown>
  logout: (params?: unknown) => Promise<void | false | string>
  checkError: (error: unknown) => Promise<void>
  checkAuth: (params?: unknown) => Promise<void>
  getPermissions: (params?: unknown) => Promise<unknown>
  getIdentity?: () => Promise<UserIdentity>
  handleCallback?: (params?: unknown) => Promise<AuthRedirectResult | void | null>
}
```

## Methods

### login

Called when the user attempts to log in. Receives credentials and should authenticate with your backend.

```typescript
login: (params: unknown) => Promise<unknown>
```

**Parameters:**
- `params` - Login credentials (typically `{ username, password }`)

**Returns:**
- A promise that resolves on successful login
- May return an object with `redirectTo` to specify where to redirect after login
- Throws an error if authentication fails

**Example:**
```typescript
const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error('Invalid credentials')
    }

    const { token, user } = await response.json()
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    return { redirectTo: '/dashboard' }
  },
  // ... other methods
}
```

### logout

Called when the user clicks the logout button. Should clear authentication state and optionally redirect.

```typescript
logout: (params?: unknown) => Promise<void | false | string>
```

**Parameters:**
- `params` - Optional parameters (e.g., reason for logout)

**Returns:**
- `void` - Redirect to default login page (`/login`)
- `false` - Do not redirect after logout
- `string` - Custom URL to redirect to

**Example:**
```typescript
const authProvider: AuthProvider = {
  logout: async () => {
    const token = localStorage.getItem('token')

    // Optionally notify the server
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    // Clear local storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    return '/login' // Redirect to login page
  },
  // ... other methods
}
```

### checkAuth

Called when the user navigates to a new location to verify authentication status. Used by `ProtectedRoute` and other guards.

```typescript
checkAuth: (params?: unknown) => Promise<void>
```

**Parameters:**
- `params` - Optional context about the current route

**Returns:**
- Resolves if the user is authenticated
- Rejects if the user is not authenticated (triggers redirect to login)

**Example:**
```typescript
const authProvider: AuthProvider = {
  checkAuth: async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('Not authenticated')
    }

    // Optionally validate token with server
    const response = await fetch('/api/auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      localStorage.removeItem('token')
      throw new Error('Token expired')
    }
  },
  // ... other methods
}
```

### checkError

Called when the API returns an error. Determines if the error should trigger a logout (e.g., 401 Unauthorized).

```typescript
checkError: (error: unknown) => Promise<void>
```

**Parameters:**
- `error` - The error returned by the API (typically contains status code)

**Returns:**
- Resolves if the error doesn't require logout
- Rejects if the user should be logged out

**Example:**
```typescript
const authProvider: AuthProvider = {
  checkError: async (error) => {
    const status = (error as { status?: number })?.status

    if (status === 401 || status === 403) {
      localStorage.removeItem('token')
      throw new Error('Session expired')
    }

    // For other errors, don't log out
    return
  },
  // ... other methods
}
```

### getPermissions

Called to retrieve the user's permissions/roles for authorization decisions.

```typescript
getPermissions: (params?: unknown) => Promise<unknown>
```

**Parameters:**
- `params` - Optional context about what permissions to check

**Returns:**
- Any permissions format your application uses (roles array, permissions object, etc.)

**Example with roles:**
```typescript
const authProvider: AuthProvider = {
  getPermissions: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.roles || [] // ['admin', 'editor']
  },
  // ... other methods
}
```

**Example with granular permissions:**
```typescript
const authProvider: AuthProvider = {
  getPermissions: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.permissions || {}
    // { posts: { read: true, write: true }, users: { read: true, write: false } }
  },
  // ... other methods
}
```

### getIdentity

Optional method to retrieve the current user's identity for display purposes (name, avatar, etc.).

```typescript
getIdentity?: () => Promise<UserIdentity>
```

**Returns:**
- `UserIdentity` object with at least an `id` field

**Example:**
```typescript
const authProvider: AuthProvider = {
  getIdentity: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    return {
      id: user.id,
      fullName: user.name,
      avatar: user.avatar,
      email: user.email, // Additional fields are allowed
    }
  },
  // ... other methods
}
```

### handleCallback

Optional method for handling OAuth callbacks and redirects.

```typescript
handleCallback?: (params?: unknown) => Promise<AuthRedirectResult | void | null>
```

**Parameters:**
- `params` - OAuth callback parameters (code, state, etc.)

**Returns:**
- `AuthRedirectResult` with optional `redirectTo` and `logoutOnFailure`
- `void` or `null` for default behavior

**Example:**
```typescript
const authProvider: AuthProvider = {
  handleCallback: async ({ code, state }) => {
    const response = await fetch('/api/auth/oauth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
    })

    if (!response.ok) {
      return { redirectTo: '/login', logoutOnFailure: true }
    }

    const { token, user } = await response.json()
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    return { redirectTo: '/' }
  },
  // ... other methods
}
```

## Implementation Examples

### Basic AuthProvider

A simple implementation for username/password authentication:

```typescript
import type { AuthProvider } from 'shadmin'

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const { user } = await response.json()
    localStorage.setItem('user', JSON.stringify(user))
  },

  logout: async () => {
    localStorage.removeItem('user')
    return '/login'
  },

  checkAuth: async () => {
    const user = localStorage.getItem('user')
    if (!user) {
      throw new Error('Not authenticated')
    }
  },

  checkError: async (error) => {
    const status = (error as { status?: number })?.status
    if (status === 401 || status === 403) {
      localStorage.removeItem('user')
      throw new Error('Unauthorized')
    }
  },

  getPermissions: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.permissions || []
  },

  getIdentity: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return {
      id: user.id,
      fullName: user.name,
      avatar: user.avatar,
    }
  },
}
```

### JWT Token Handling

A complete implementation with JWT token management, refresh tokens, and automatic token renewal:

```typescript
import type { AuthProvider } from 'shadmin'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  sub: string
  exp: number
  iat: number
  roles: string[]
  name: string
  email: string
  avatar?: string
}

interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Helper to check if token is expired (with 60-second buffer)
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded.exp * 1000 < Date.now() + 60000
  } catch {
    return true
  }
}

// Helper to refresh the access token
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    throw new Error('Token refresh failed')
  }

  const { accessToken, refreshToken: newRefreshToken }: TokenResponse =
    await response.json()

  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)

  return accessToken
}

// Helper to get valid access token (refreshing if needed)
export const getValidToken = async (): Promise<string> => {
  let token = localStorage.getItem(TOKEN_KEY)

  if (!token) {
    throw new Error('No access token')
  }

  if (isTokenExpired(token)) {
    token = await refreshAccessToken()
  }

  return token
}

export const jwtAuthProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Invalid credentials')
    }

    const { accessToken, refreshToken }: TokenResponse = await response.json()

    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)

    return { redirectTo: '/' }
  },

  logout: async () => {
    const token = localStorage.getItem(TOKEN_KEY)

    // Notify server to invalidate refresh token
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {
        // Ignore errors during logout
      }
    }

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)

    return '/login'
  },

  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      throw new Error('Not authenticated')
    }

    // Try to get a valid token (will refresh if needed)
    try {
      await getValidToken()
    } catch {
      throw new Error('Authentication expired')
    }
  },

  checkError: async (error) => {
    const status = (error as { status?: number })?.status

    if (status === 401) {
      // Try to refresh token before logging out
      try {
        await refreshAccessToken()
        return // Token refreshed successfully, don't logout
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        throw new Error('Session expired')
      }
    }

    if (status === 403) {
      throw new Error('Access denied')
    }
  },

  getPermissions: async () => {
    const token = await getValidToken()
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded.roles
  },

  getIdentity: async () => {
    const token = await getValidToken()
    const decoded = jwtDecode<JwtPayload>(token)

    return {
      id: decoded.sub,
      fullName: decoded.name,
      avatar: decoded.avatar,
      email: decoded.email,
    }
  },
}

// Export helper for use in dataProvider fetch calls
export const authFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getValidToken()

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
}
```

### OAuth Provider

Implementation for OAuth/OpenID Connect authentication:

```typescript
import type { AuthProvider } from 'shadmin'

const OAUTH_CONFIG = {
  clientId: process.env.OAUTH_CLIENT_ID!,
  authorizationEndpoint: 'https://auth.example.com/authorize',
  tokenEndpoint: 'https://auth.example.com/token',
  redirectUri: `${window.location.origin}/auth/callback`,
  scope: 'openid profile email',
}

export const oauthProvider: AuthProvider = {
  login: async () => {
    // Generate PKCE code verifier and challenge
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    const state = generateRandomState()

    // Store for callback validation
    sessionStorage.setItem('oauth_code_verifier', codeVerifier)
    sessionStorage.setItem('oauth_state', state)

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: OAUTH_CONFIG.clientId,
      redirect_uri: OAUTH_CONFIG.redirectUri,
      response_type: 'code',
      scope: OAUTH_CONFIG.scope,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    })

    // Redirect to OAuth provider
    window.location.href = `${OAUTH_CONFIG.authorizationEndpoint}?${params}`

    // Return false to prevent default redirect
    return { redirectTo: false }
  },

  handleCallback: async () => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const error = params.get('error')

    if (error) {
      throw new Error(params.get('error_description') || 'OAuth error')
    }

    // Validate state
    const savedState = sessionStorage.getItem('oauth_state')
    if (state !== savedState) {
      throw new Error('Invalid state parameter')
    }

    const codeVerifier = sessionStorage.getItem('oauth_code_verifier')

    // Exchange code for tokens
    const response = await fetch(OAUTH_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code!,
        redirect_uri: OAUTH_CONFIG.redirectUri,
        client_id: OAUTH_CONFIG.clientId,
        code_verifier: codeVerifier!,
      }),
    })

    if (!response.ok) {
      throw new Error('Token exchange failed')
    }

    const tokens = await response.json()

    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('id_token', tokens.id_token)
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token)
    }

    // Cleanup session storage
    sessionStorage.removeItem('oauth_code_verifier')
    sessionStorage.removeItem('oauth_state')

    return { redirectTo: '/' }
  },

  logout: async () => {
    const idToken = localStorage.getItem('id_token')

    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('refresh_token')

    // Redirect to OAuth provider logout (optional)
    if (idToken) {
      const logoutUrl = new URL('https://auth.example.com/logout')
      logoutUrl.searchParams.set('id_token_hint', idToken)
      logoutUrl.searchParams.set(
        'post_logout_redirect_uri',
        `${window.location.origin}/login`
      )
      window.location.href = logoutUrl.toString()
      return false // Prevent default redirect
    }

    return '/login'
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('Not authenticated')
    }
  },

  checkError: async (error) => {
    const status = (error as { status?: number })?.status
    if (status === 401) {
      localStorage.removeItem('access_token')
      throw new Error('Session expired')
    }
  },

  getPermissions: async () => {
    const idToken = localStorage.getItem('id_token')
    if (!idToken) return []

    const payload = JSON.parse(atob(idToken.split('.')[1]))
    return payload.roles || payload.groups || []
  },

  getIdentity: async () => {
    const idToken = localStorage.getItem('id_token')
    if (!idToken) throw new Error('No identity')

    const payload = JSON.parse(atob(idToken.split('.')[1]))
    return {
      id: payload.sub,
      fullName: payload.name,
      avatar: payload.picture,
      email: payload.email,
    }
  },
}

// PKCE helper functions
function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(new Uint8Array(digest))
}

function generateRandomState(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

function base64UrlEncode(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
```

## Role-Based Access Control

### Role-Based Permissions

Implement role checking in your AuthProvider and use `ProtectedRoute` to guard routes:

```typescript
import type { AuthProvider } from 'shadmin'
import { ProtectedRoute } from 'shadmin'

// AuthProvider with role-based permissions
export const roleAuthProvider: AuthProvider = {
  // ... login, logout, checkAuth, checkError

  getPermissions: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    // Return user's roles
    return user.roles // ['admin', 'editor', 'viewer']
  },
}

// Usage in routes
function App() {
  return (
    <Routes>
      {/* Any authenticated user */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Requires admin role */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Requires admin OR editor role */}
      <Route
        path="/posts"
        element={
          <ProtectedRoute requiredRoles={['admin', 'editor']}>
            <PostList />
          </ProtectedRoute>
        }
      />

      {/* Requires BOTH admin AND superuser roles */}
      <Route
        path="/system"
        element={
          <ProtectedRoute requiredRoles={['admin', 'superuser']} requireAllRoles>
            <SystemConfig />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
```

### Resource-Level Permissions

For fine-grained resource permissions:

```typescript
import type { AuthProvider } from 'shadmin'
import { ProtectedRoute } from 'shadmin'

interface ResourcePermissions {
  [resource: string]: {
    list?: boolean
    show?: boolean
    create?: boolean
    edit?: boolean
    delete?: boolean
  }
}

export const resourceAuthProvider: AuthProvider = {
  // ... login, logout, checkAuth, checkError

  getPermissions: async (): Promise<ResourcePermissions> => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    return user.permissions
    // Example: {
    //   posts: { list: true, show: true, create: true, edit: true, delete: false },
    //   users: { list: true, show: true, create: false, edit: false, delete: false },
    //   settings: { list: true, show: true, create: true, edit: true, delete: true }
    // }
  },
}

// Usage with custom permission checker
function App() {
  return (
    <Routes>
      <Route
        path="/posts/create"
        element={
          <ProtectedRoute
            checkPermissions={(permissions: ResourcePermissions) =>
              permissions?.posts?.create === true
            }
          >
            <PostCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/posts/:id/edit"
        element={
          <ProtectedRoute
            checkPermissions={(permissions: ResourcePermissions) =>
              permissions?.posts?.edit === true
            }
          >
            <PostEdit />
          </ProtectedRoute>
        }
      />

      {/* Using requiredPermissions prop for object matching */}
      <Route
        path="/users"
        element={
          <ProtectedRoute
            requiredPermissions={{ 'users.list': true }}
          >
            <UserList />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
```

## Using the AuthProvider

### Context and Hooks

Shadmin provides context and hooks for accessing the AuthProvider:

```typescript
import {
  AuthProviderContextProvider,
  useAuthProvider,
  useAuthProviderOptional,
} from 'shadmin'

// Wrap your app with the provider
function App() {
  return (
    <AuthProviderContextProvider authProvider={authProvider}>
      <YourApp />
    </AuthProviderContextProvider>
  )
}

// Access in components
function UserMenu() {
  const authProvider = useAuthProvider() // Throws if no provider

  const handleLogout = async () => {
    await authProvider.logout()
  }

  return <button onClick={handleLogout}>Logout</button>
}

// Optional access (may return null)
function OptionalFeature() {
  const authProvider = useAuthProviderOptional()

  if (!authProvider) {
    return null // Auth not configured
  }

  // Use authProvider...
}
```

### Built-in Hooks

Shadmin provides convenience hooks for common auth operations:

```typescript
import { useLogin, useLogout } from 'shadmin'

// useLogin hook
function LoginForm() {
  const { login, isLoading, error } = useLogin({
    onSuccess: () => console.log('Logged in!'),
    onError: (err) => console.error('Login failed:', err),
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(
      { username: 'admin', password: 'secret' },
      { redirectTo: '/dashboard' }
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error.message}</p>}
      <input name="username" disabled={isLoading} />
      <input name="password" type="password" disabled={isLoading} />
      <button disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

// useLogout hook
function LogoutButton() {
  const { logout, isLoading } = useLogout({
    onSuccess: () => console.log('Logged out!'),
  })

  return (
    <button onClick={() => logout()} disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
```

### Protected Routes

Use the `ProtectedRoute` component to guard authenticated routes:

```typescript
import { ProtectedRoute } from 'shadmin'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Basic protection */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* With custom loading component */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute loading={<Spinner />}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* With role requirements */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            requiredRoles={['admin']}
            loginPath="/login"
            unauthorizedPath="/unauthorized"
          >
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      {/* With error handling */}
      <Route
        path="/secure"
        element={
          <ProtectedRoute
            onError={(err) => console.error('Auth error:', err)}
            errorComponent={({ error }) => (
              <div>Authentication error: {error.message}</div>
            )}
          >
            <SecurePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
```

### ProtectedRoute Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content to render when authenticated |
| `loading` | `ReactNode` | Default spinner | Loading indicator during auth check |
| `loginPath` | `string` | `'/login'` | Redirect path for unauthenticated users |
| `unauthorizedPath` | `string` | `'/unauthorized'` | Redirect path for unauthorized users |
| `requiredRoles` | `string[]` | - | Roles required for access |
| `requireAllRoles` | `boolean` | `false` | Require all roles (AND) vs any role (OR) |
| `requiredPermissions` | `Record<string, boolean>` | - | Permission object to match |
| `checkPermissions` | `(permissions) => boolean` | - | Custom permission check function |
| `onError` | `(error: Error) => void` | - | Callback for auth errors |
| `errorComponent` | `React.ComponentType<{error}>` | - | Custom error display component |
