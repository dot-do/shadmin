/**
 * DataProviderContext
 * Provides the DataProvider instance to all components
 * 100% API-compatible with react-admin
 */

import { createContext, useContext, type ReactNode } from 'react'
import type { DataProvider } from '../types'

const DataProviderContext = createContext<DataProvider | null>(null)

export interface DataProviderContextProviderProps {
  children: ReactNode
  dataProvider: DataProvider
}

/**
 * Provider component for DataProvider
 */
export const DataProviderContextProvider = ({
  children,
  dataProvider,
}: DataProviderContextProviderProps) => {
  return (
    <DataProviderContext.Provider value={dataProvider}>
      {children}
    </DataProviderContext.Provider>
  )
}

/**
 * Hook to access the DataProvider
 * @throws Error if used outside of DataProviderContext
 */
export const useDataProvider = (): DataProvider => {
  const context = useContext(DataProviderContext)
  if (context === null) {
    throw new Error('useDataProvider must be used within a DataProviderContextProvider')
  }
  return context
}

/**
 * Hook to optionally access the DataProvider (may return null)
 */
export const useDataProviderOptional = (): DataProvider | null => {
  return useContext(DataProviderContext)
}

export { DataProviderContext }
