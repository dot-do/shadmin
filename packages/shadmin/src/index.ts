// Shadmin - Modern Admin UI Library
// Built with React 19 and shadcn/ui
// Uses ra-core for headless admin functionality

// Re-export ra-core for drop-in react-admin compatibility
// This provides all hooks, types, and utilities from react-admin's core
export * from 'ra-core'

// Re-export Link from react-router-dom for react-admin compatibility
export { Link } from 'react-router-dom'

// Shadmin components (override ra-ui-materialui with shadcn/ui)
// Note: FormDataConsumer is explicitly exported to override ra-core's version
// with our optimized shadmin implementation that includes useFormData hook
export * from './components'
export { FormDataConsumer, useFormData } from './components/form/FormDataConsumer'

// Shadmin-specific contexts (not in ra-core)
export {
  FormContext,
  FormContextProvider,
  useFormContext,
  useShadminFormContext,
  type ShadminFormContextValue,
  type ShadminFormContext,
  type FormContextProviderProps,
} from './contexts/FormContext'

export {
  ThemeContext,
  ThemeProvider,
  useTheme,
  type ThemeContextValue,
  type Theme,
  type ThemeProviderProps,
} from './contexts/ThemeContext'

// Shadmin-specific hooks (not in ra-core)
export { useMediaQuery } from './hooks/useMediaQuery'

export {
  createQueryHook,
  createSimpleQueryHook,
  createMutationHook,
  createSimpleMutationHook,
  type QueryHookConfig,
  type MutationHookConfig,
  type CacheUpdateHandlers,
  type BaseQueryResult,
  type BaseMutationState,
  type BaseErrorHandling,
  type MutationErrorHandling,
} from './hooks/createDataHook'

export {
  useCreateSuggestionContext,
  CreateSuggestionContext,
  type CreateSuggestionContextValue,
} from './hooks/useCreateSuggestionContext'

// Shadmin types (only export types NOT already in ra-core to avoid duplicates)
export type {
  // Common shadmin-specific types
  BaseProps,
  WithChildren,
  WithClassName,
  AsChildProps,
  Path,
  PathValue,
  LoosePath,
  ComponentProps,
  // Data provider types not in ra-core
  SortOrder,
  // Admin types
  AdminPlugin,
  AdminPluginContext,
  ThemeOptions,
  AdminLayoutProps,
  AdminProps,
} from './types'

// Shadmin utils
export * from './utils'

// Version export
export const VERSION = '0.0.5'
