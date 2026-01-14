/**
 * AuthProviderContext
 * Provides the AuthProvider instance to all components
 * 100% API-compatible with react-admin
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'

import type { AuthProvider } from '../facade'

const AuthProviderContext = createContext<AuthProvider | null>(null)

export interface AuthProviderContextProviderProps {
  children: ReactNode
  authProvider: AuthProvider
}

/**
 * Provider component for AuthProvider
 */
export const AuthProviderContextProvider = ({
  children,
  authProvider,
}: AuthProviderContextProviderProps) => {
  const memoizedAuthProvider = useMemo(() => authProvider, [authProvider])
  return (
    <AuthProviderContext.Provider value={memoizedAuthProvider}>
      {children}
    </AuthProviderContext.Provider>
  )
}

/**
 * Hook to access the AuthProvider
 * @throws Error if used outside of AuthProviderContext
 */
export const useAuthProvider = (): AuthProvider => {
  const context = useContext(AuthProviderContext)
  if (context === null) {
    throw new Error('useAuthProvider must be used within an AuthProviderContextProvider')
  }
  return context
}

/**
 * Hook to optionally access the AuthProvider (may return null)
 * Useful when auth is optional
 */
export const useAuthProviderOptional = (): AuthProvider | null => {
  return useContext(AuthProviderContext)
}

export { AuthProviderContext }
