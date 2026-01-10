// Shadmin - Modern Admin UI Library
// Built with React 19 and shadcn/ui
// Uses ra-core for headless admin functionality

// Re-export ra-core for drop-in react-admin compatibility
// This provides all hooks, types, and utilities from react-admin's core
export * from 'ra-core'

// Re-export Link from react-router-dom for react-admin compatibility
export { Link } from 'react-router-dom'

// Shadmin components (override ra-ui-materialui with shadcn/ui)
export * from './components'

// Shadmin contexts (will be removed as we migrate to ra-core)
export * from './contexts'

// Shadmin hooks (will be removed as we migrate to ra-core)
export * from './hooks'

// Shadmin types
export * from './types'

// Shadmin utils
export * from './utils'

// Version export
export const VERSION = '0.0.5'
