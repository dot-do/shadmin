import type { AuthProvider, UserIdentity } from 'shadmin'

/**
 * Client Portal Auth Provider
 *
 * Demonstrates a complete authentication flow including:
 * - Login with email/password
 * - Session management with localStorage
 * - User identity and permissions
 * - Role-based access control for client users
 */

interface LoginParams {
  email: string
  password: string
}

interface StoredAuth {
  user: UserIdentity
  token: string
  permissions: string[]
}

// Demo client users
const DEMO_CLIENTS: Record<string, { password: string; user: UserIdentity; permissions: string[] }> = {
  'client@example.com': {
    password: 'demo123',
    user: {
      id: 'client-1',
      fullName: 'John Smith',
      email: 'client@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      company: 'Acme Corporation',
      role: 'client',
    },
    permissions: ['projects.read', 'tickets.read', 'tickets.create', 'documents.read', 'documents.upload'],
  },
  'premium@example.com': {
    password: 'demo123',
    user: {
      id: 'client-2',
      fullName: 'Sarah Johnson',
      email: 'premium@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      company: 'Premium Partners LLC',
      role: 'premium_client',
    },
    permissions: [
      'projects.read',
      'projects.analytics',
      'tickets.read',
      'tickets.create',
      'tickets.priority',
      'documents.read',
      'documents.upload',
      'documents.delete',
      'invoices.read',
    ],
  },
}

const AUTH_STORAGE_KEY = 'client_portal_auth'

function getStoredAuth(): StoredAuth | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as StoredAuth
  } catch {
    return null
  }
}

function setStoredAuth(auth: StoredAuth): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
}

function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export const authProvider: AuthProvider = {
  /**
   * Called when the user attempts to log in
   */
  login: async (params: unknown): Promise<void> => {
    const { email, password } = params as LoginParams

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const clientData = DEMO_CLIENTS[email.toLowerCase()]

    if (!clientData || clientData.password !== password) {
      throw new Error('Invalid email or password')
    }

    // Store auth data
    const auth: StoredAuth = {
      user: clientData.user,
      token: `demo-token-${Date.now()}`,
      permissions: clientData.permissions,
    }

    setStoredAuth(auth)
  },

  /**
   * Called when the user clicks on the logout button
   */
  logout: async (): Promise<void> => {
    clearStoredAuth()
    // Return void to redirect to login page
  },

  /**
   * Called when the API returns an error
   */
  checkError: async (error: unknown): Promise<void> => {
    const status = (error as { status?: number }).status

    if (status === 401 || status === 403) {
      clearStoredAuth()
      throw new Error('Session expired')
    }

    // Other errors don't require logout
  },

  /**
   * Called when the user navigates to a new location
   */
  checkAuth: async (): Promise<void> => {
    const auth = getStoredAuth()

    if (!auth || !auth.token) {
      throw new Error('Not authenticated')
    }

    // Optionally validate token expiration here
  },

  /**
   * Called to check user permissions
   */
  getPermissions: async (): Promise<string[]> => {
    const auth = getStoredAuth()
    return auth?.permissions ?? []
  },

  /**
   * Called to get the user identity
   */
  getIdentity: async (): Promise<UserIdentity> => {
    const auth = getStoredAuth()

    if (!auth?.user) {
      throw new Error('Not authenticated')
    }

    return auth.user
  },
}

/**
 * Helper hook-compatible function to check if user has permission
 */
export function hasPermission(permissions: string[], requiredPermission: string): boolean {
  return permissions.includes(requiredPermission)
}

/**
 * Demo credentials for display in login form
 */
export const DEMO_CREDENTIALS = [
  {
    email: 'client@example.com',
    password: 'demo123',
    description: 'Standard Client - Basic access',
  },
  {
    email: 'premium@example.com',
    password: 'demo123',
    description: 'Premium Client - Full access with analytics',
  },
]
