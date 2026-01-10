// Core component exports
export { Admin } from './Admin'
export { Resource, ResourceRegistrationContext, type ResourceRegistrationContextValue } from './Resource'
export { CoreAdminContext, type CoreAdminContextProps } from './CoreAdminContext'
export { CoreAdminRoutes, type CoreAdminRoutesProps, type MenuItem } from './CoreAdminRoutes'
export {
  ThemeProvider,
  useTheme,
  type CustomTheme,
  type ThemeMode,
  type ResolvedThemeMode,
  type CustomThemeProviderProps,
  type ThemeContextValue,
  type ColorValue,
} from './ThemeProvider'
export {
  ErrorBoundary,
  useErrorBoundary,
  type ErrorBoundaryProps,
  type ErrorBoundaryErrorInfo,
  type FallbackRenderProps,
  type ErrorComponentProps,
} from './ErrorBoundary'
export {
  withLifecycleCallbacks,
  type LifecycleCallbackContext,
  type AfterLifecycleCallbackContext,
  type ResourceLifecycleCallbacks,
  type AdminPlugin,
  type AdminPluginContext,
  type CellRendererProps,
  type FieldWrapperProps,
} from './extensions'
