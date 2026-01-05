import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import {
  DataProviderContext,
  DataProviderContextProvider,
  useDataProvider,
  useDataProviderOptional,
} from './DataProviderContext'
import type { DataProvider } from '../types'

const createMockDataProvider = (
  overrides: Partial<DataProvider> = {}
): DataProvider => ({
  getList: vi.fn().mockResolvedValue({ data: [], total: 0 }),
  getOne: vi.fn().mockResolvedValue({ data: { id: 1 } }),
  getMany: vi.fn().mockResolvedValue({ data: [] }),
  getManyReference: vi.fn().mockResolvedValue({ data: [], total: 0 }),
  create: vi.fn().mockResolvedValue({ data: { id: 1 } }),
  update: vi.fn().mockResolvedValue({ data: { id: 1 } }),
  updateMany: vi.fn().mockResolvedValue({ data: [] }),
  delete: vi.fn().mockResolvedValue({ data: { id: 1 } }),
  deleteMany: vi.fn().mockResolvedValue({ data: [] }),
  ...overrides,
})

describe('DataProviderContext', () => {
  describe('DataProviderContext', () => {
    it('should export the React context', () => {
      expect(DataProviderContext).toBeDefined()
    })
  })

  describe('DataProviderContextProvider', () => {
    it('should provide dataProvider to children', async () => {
      const mockDataProvider = createMockDataProvider({
        getList: vi.fn().mockResolvedValue({
          data: [{ id: 1, name: 'Test' }],
          total: 1,
        }),
      })

      const Consumer = () => {
        const dataProvider = useDataProvider()

        const handleLoad = async () => {
          const result = await dataProvider.getList('users', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
          })
          return result.data[0]?.name
        }

        return (
          <button
            onClick={async () => {
              const name = await handleLoad()
              document.getElementById('result')!.textContent = name ?? ''
            }}
          >
            Load
          </button>
        )
      }

      render(
        <DataProviderContextProvider dataProvider={mockDataProvider}>
          <Consumer />
          <div id="result" data-testid="result"></div>
        </DataProviderContextProvider>
      )

      // Click to trigger load
      screen.getByText('Load').click()

      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Test')
      })

      expect(mockDataProvider.getList).toHaveBeenCalledWith('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })
    })
  })

  describe('useDataProvider', () => {
    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useDataProvider()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useDataProvider must be used within a DataProviderContextProvider'
      )
    })

    it('should provide all DataProvider methods', () => {
      const mockDataProvider = createMockDataProvider()

      const Consumer = () => {
        const dataProvider = useDataProvider()
        return (
          <div>
            <span data-testid="getList">{typeof dataProvider.getList}</span>
            <span data-testid="getOne">{typeof dataProvider.getOne}</span>
            <span data-testid="getMany">{typeof dataProvider.getMany}</span>
            <span data-testid="getManyReference">{typeof dataProvider.getManyReference}</span>
            <span data-testid="create">{typeof dataProvider.create}</span>
            <span data-testid="update">{typeof dataProvider.update}</span>
            <span data-testid="updateMany">{typeof dataProvider.updateMany}</span>
            <span data-testid="delete">{typeof dataProvider.delete}</span>
            <span data-testid="deleteMany">{typeof dataProvider.deleteMany}</span>
          </div>
        )
      }

      render(
        <DataProviderContextProvider dataProvider={mockDataProvider}>
          <Consumer />
        </DataProviderContextProvider>
      )

      expect(screen.getByTestId('getList')).toHaveTextContent('function')
      expect(screen.getByTestId('getOne')).toHaveTextContent('function')
      expect(screen.getByTestId('getMany')).toHaveTextContent('function')
      expect(screen.getByTestId('getManyReference')).toHaveTextContent('function')
      expect(screen.getByTestId('create')).toHaveTextContent('function')
      expect(screen.getByTestId('update')).toHaveTextContent('function')
      expect(screen.getByTestId('updateMany')).toHaveTextContent('function')
      expect(screen.getByTestId('delete')).toHaveTextContent('function')
      expect(screen.getByTestId('deleteMany')).toHaveTextContent('function')
    })
  })

  describe('useDataProviderOptional', () => {
    it('should return null when used outside provider', () => {
      const Consumer = () => {
        const dataProvider = useDataProviderOptional()
        return <div data-testid="result">{dataProvider === null ? 'null' : 'defined'}</div>
      }

      render(<Consumer />)

      expect(screen.getByTestId('result')).toHaveTextContent('null')
    })

    it('should return dataProvider when inside provider', () => {
      const mockDataProvider = createMockDataProvider()

      const Consumer = () => {
        const dataProvider = useDataProviderOptional()
        return <div data-testid="result">{dataProvider === null ? 'null' : 'defined'}</div>
      }

      render(
        <DataProviderContextProvider dataProvider={mockDataProvider}>
          <Consumer />
        </DataProviderContextProvider>
      )

      expect(screen.getByTestId('result')).toHaveTextContent('defined')
    })
  })
})
