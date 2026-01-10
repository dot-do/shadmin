import { createContext, useContext, useRef, type ReactNode } from 'react'
import type { RaRecord } from '../types'

// Note: RaRecord is defined in src/types/record.ts
// Import from '../types' for type usage in this file
// Consumers should import RaRecord from '../types' or the main package export

/**
 * Context to store the current record.
 * Used by components like Show, Edit to share the current record with children.
 *
 * Note: The context uses the base RaRecord type. Type narrowing is done
 * in useRecordContext through a type assertion, which is safe because
 * the provider ensures the correct type is passed.
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
 * Check if two records are equal by comparing their id and a shallow comparison of properties
 */
function areRecordsEqual<T extends RaRecord>(prev: T | undefined, next: T | undefined): boolean {
  if (prev === next) return true
  if (!prev || !next) return false
  if (prev.id !== next.id) return false
  // Shallow compare all keys
  const prevKeys = Object.keys(prev)
  const nextKeys = Object.keys(next)
  if (prevKeys.length !== nextKeys.length) return false
  return prevKeys.every((key) => prev[key] === next[key])
}

/**
 * Provider component for RecordContext.
 * Wraps children with the current record value.
 * Uses referential equality optimization to prevent unnecessary re-renders.
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
  // Use ref to maintain stable reference when record content hasn't changed
  const recordRef = useRef<T | undefined>(value)

  // Only update ref if record actually changed
  if (!areRecordsEqual(recordRef.current, value)) {
    recordRef.current = value
  }

  return (
    <RecordContext.Provider value={recordRef.current}>
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
