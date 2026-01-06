/**
 * CreateContext
 * Provides create form state and save function to child components
 * 100% API-compatible with react-admin
 *
 * Epic: shadmin-ha1 (P1)
 */

import { createContext, useContext, memo, type ReactNode } from 'react'
import type { RaRecord } from '../../types'

/**
 * Save function type for creating records
 */
export type SaveHandler<TData = Record<string, unknown>> = (
  data: TData,
  callbacks?: {
    onSuccess?: (data: RaRecord) => void
    onError?: (error: Error) => void
  }
) => Promise<void> | void

/**
 * Context value for Create components
 */
export interface CreateContextValue<TData = Record<string, unknown>> {
  /** The resource name */
  resource: string
  /** Function to save the record */
  save: SaveHandler<TData>
  /** Whether a save operation is in progress */
  saving: boolean
  /** Error from the last save attempt */
  error: Error | null
  /** Reset the error state */
  reset: () => void
  /** The created record (available after successful save) */
  record?: RaRecord | undefined
}

/**
 * Context for Create form state
 */
export const CreateContext = createContext<CreateContextValue | undefined>(undefined)

CreateContext.displayName = 'CreateContext'

/**
 * Props for CreateContextProvider
 */
export interface CreateContextProviderProps<TData = Record<string, unknown>> {
  value: CreateContextValue<TData>
  children: ReactNode
}

/**
 * Provider component for CreateContext.
 * Wraps children with create form state and save function.
 * Memoized to prevent unnecessary re-renders.
 *
 * @example
 * ```tsx
 * <CreateContextProvider value={{ resource: 'posts', save, saving, error, reset }}>
 *   <MyCreateForm />
 * </CreateContextProvider>
 * ```
 */
export const CreateContextProvider = memo(function CreateContextProvider<TData = Record<string, unknown>>({
  value,
  children,
}: CreateContextProviderProps<TData>) {
  return (
    <CreateContext.Provider value={value as CreateContextValue}>
      {children}
    </CreateContext.Provider>
  )
}) as <TData = Record<string, unknown>>(props: CreateContextProviderProps<TData>) => JSX.Element

/**
 * Hook to access the create context.
 * Must be used within a CreateContextProvider.
 *
 * @throws Error if used outside of CreateContextProvider
 *
 * @example
 * ```tsx
 * const { save, saving, error, resource } = useCreateContext()
 *
 * const handleSubmit = (data) => {
 *   save(data)
 * }
 * ```
 */
export function useCreateContext<TData = Record<string, unknown>>(): CreateContextValue<TData> {
  const context = useContext(CreateContext)
  if (context === undefined) {
    throw new Error('useCreateContext must be used within a CreateContextProvider')
  }
  return context as CreateContextValue<TData>
}

/**
 * Hook to optionally access the create context.
 * Returns undefined if not within a CreateContextProvider.
 *
 * @example
 * ```tsx
 * const context = useOptionalCreateContext()
 * if (context) {
 *   // Inside a Create component
 * }
 * ```
 */
export function useOptionalCreateContext<
  TData = Record<string, unknown>,
>(): CreateContextValue<TData> | undefined {
  return useContext(CreateContext) as CreateContextValue<TData> | undefined
}
