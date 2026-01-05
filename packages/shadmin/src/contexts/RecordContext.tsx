import { createContext, useContext, type ReactNode } from 'react'
import type { RaRecord } from '../types'

// Re-export RaRecord for backwards compatibility
export type { RaRecord } from '../types'

/**
 * Context to store the current record.
 * Used by components like Show, Edit to share the current record with children.
 */
export const RecordContext = createContext<RaRecord | undefined>(undefined)

RecordContext.displayName = 'RecordContext'

/**
 * Props for RecordContextProvider
 */
export interface RecordContextProviderProps<T extends RaRecord = RaRecord> {
  value: T | undefined
  children: ReactNode
}

/**
 * Provider component for RecordContext.
 * Wraps children with the current record value.
 *
 * @example
 * ```tsx
 * <RecordContextProvider value={{ id: 1, name: 'John' }}>
 *   <RecordDisplay />
 * </RecordContextProvider>
 * ```
 */
export function RecordContextProvider<T extends RaRecord = RaRecord>({
  value,
  children,
}: RecordContextProviderProps<T>) {
  return (
    <RecordContext.Provider value={value}>
      {children}
    </RecordContext.Provider>
  )
}

/**
 * Hook to access the current record from RecordContext.
 * Returns undefined if used outside of a RecordContextProvider.
 *
 * @example
 * ```tsx
 * const record = useRecordContext<MyType>()
 * // record is MyType | undefined
 * ```
 */
export function useRecordContext<T extends RaRecord = RaRecord>(): T | undefined {
  return useContext(RecordContext) as T | undefined
}
