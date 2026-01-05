/**
 * useDataProvider hook tests
 */

import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useDataProvider } from './useDataProvider'
import { DataProviderContextProvider } from '../contexts/DataProviderContext'
import type { DataProvider } from '../types'

const createWrapper = (dataProvider: DataProvider) => {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <DataProviderContextProvider dataProvider={dataProvider}>
        {children}
      </DataProviderContextProvider>
    )
  }
}

describe('useDataProvider', () => {
  it('should return the data provider', () => {
    const dataProvider: DataProvider = {
      getList: vi.fn(),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }

    const { result } = renderHook(() => useDataProvider(), {
      wrapper: createWrapper(dataProvider),
    })

    expect(result.current).toBe(dataProvider)
  })

  it('should provide access to all data provider methods', () => {
    const dataProvider: DataProvider = {
      getList: vi.fn(),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    }

    const { result } = renderHook(() => useDataProvider(), {
      wrapper: createWrapper(dataProvider),
    })

    expect(typeof result.current.getList).toBe('function')
    expect(typeof result.current.getOne).toBe('function')
    expect(typeof result.current.getMany).toBe('function')
    expect(typeof result.current.getManyReference).toBe('function')
    expect(typeof result.current.create).toBe('function')
    expect(typeof result.current.update).toBe('function')
    expect(typeof result.current.updateMany).toBe('function')
    expect(typeof result.current.delete).toBe('function')
    expect(typeof result.current.deleteMany).toBe('function')
  })

  it('should throw error when used outside DataProviderContext', () => {
    // This test verifies the error handling is in place
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useDataProvider())
    }).toThrow('useDataProvider must be used within a DataProviderContextProvider')

    errorSpy.mockRestore()
  })
})
