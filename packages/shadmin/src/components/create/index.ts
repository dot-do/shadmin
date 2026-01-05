/**
 * Create component exports
 * 100% API-compatible with react-admin
 */

// Main Create component
export { Create, type CreateProps, type RedirectTo, type TransformData } from './Create'
export { default } from './Create'

// CreateBase (logic layer)
export { CreateBase, type CreateBaseProps } from './CreateBase'

// CreateView (UI layer)
export { CreateView, type CreateViewProps } from './CreateView'

// CreateContext
export {
  CreateContext,
  CreateContextProvider,
  useCreateContext,
  useOptionalCreateContext,
  type CreateContextValue,
  type CreateContextProviderProps,
  type SaveHandler,
} from './CreateContext'
