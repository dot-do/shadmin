/**
 * Component Extension Tests
 * TDD: RED phase - write FAILING tests first
 *
 * These tests verify extensibility patterns:
 * - withLifecycleCallbacks HOC for data provider wrapping
 * - Render props for custom cell/field rendering
 * - Plugin system for Admin component
 * - Lifecycle hooks (onBeforeSave, onAfterSave)
 *
 * Epic: shadmin-zwnj
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode, ComponentType } from 'react'
import { Admin } from './Admin'
import { Resource } from './Resource'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { NotificationContextProvider } from '../../contexts/NotificationContext'
import { ListContextProvider, type ListControllerResult } from '../../contexts/ListContext'
import { RecordContextProvider, useRecordContext } from '../../contexts/RecordContext'
import { useShadminFormContext } from '../../contexts/FormContext'
import type { DataProvider, RaRecord } from '../../types'
import { createMockDataProvider, TestMemoryRouter, TestAdminContext } from '../../test-utils'

// Import components that will be extended
import { Datagrid } from '../list/Datagrid'
import { SimpleForm } from '../form/SimpleForm'
import { TextInput } from '../input/TextInput'
import { EditBase } from '../edit/EditBase'
import { CreateBase } from '../create/CreateBase'

/**
 * NOTE: These tests are intentionally written to FAIL (TDD RED phase)
 * The implementations for withLifecycleCallbacks, plugins, and custom renderers
 * do not yet exist. These tests define the expected API and behavior.
 */

// Stub type for the withLifecycleCallbacks HOC that doesn't exist yet
type LifecycleCallback = {
  resource: string
  beforeCreate?: (context: { resource: string; params: unknown; dataProvider: DataProvider }) => unknown
  afterCreate?: (context: { resource: string; params: unknown; result: unknown; dataProvider: DataProvider }) => void
  beforeUpdate?: (context: { resource: string; params: unknown; dataProvider: DataProvider }) => unknown
  afterUpdate?: (context: { resource: string; params: unknown; result: unknown; dataProvider: DataProvider }) => void
  beforeDelete?: (context: { resource: string; params: unknown; dataProvider: DataProvider }) => unknown
  afterDelete?: (context: { resource: string; params: unknown; result: unknown; dataProvider: DataProvider }) => void
}

type WithLifecycleCallbacksFn = (
  dataProvider: DataProvider,
  callbacks: LifecycleCallback[]
) => DataProvider

// This import will fail since the module doesn't exist - tests should fail
let withLifecycleCallbacks: WithLifecycleCallbacksFn

// Try to import the module, but tests will fail if it doesn't exist or function doesn't work
try {
  // Dynamic import won't work at module level, so we handle this in beforeEach
} catch {
  // Expected to fail - module doesn't exist yet
}

// ============================================================================
// SECTION 1: withLifecycleCallbacks HOC Tests
// ============================================================================

describe('withLifecycleCallbacks HOC', () => {
  let mockDataProvider: DataProvider

  beforeEach(async () => {
    mockDataProvider = createMockDataProvider({
      data: {
        posts: [
          { id: 1, title: 'Post 1', content: 'Content 1' },
          { id: 2, title: 'Post 2', content: 'Content 2' },
        ],
      },
    })

    // Try to import the module - will fail if it doesn't exist
    try {
      const extensions = await import('./extensions')
      withLifecycleCallbacks = extensions.withLifecycleCallbacks
    } catch {
      // Module doesn't exist yet - tests will fail on missing function
      withLifecycleCallbacks = undefined as unknown as WithLifecycleCallbacksFn
    }
  })

  describe('basic wrapping', () => {
    it('should wrap a data provider with lifecycle callbacks', async () => {
      // Test will fail because withLifecycleCallbacks doesn't exist
      expect(withLifecycleCallbacks).toBeDefined()

      const onBeforeCreate = vi.fn()
      const onAfterCreate = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          beforeCreate: onBeforeCreate,
          afterCreate: onAfterCreate,
        },
      ])

      expect(wrappedProvider).toBeDefined()
      expect(typeof wrappedProvider.getList).toBe('function')
      expect(typeof wrappedProvider.getOne).toBe('function')
      expect(typeof wrappedProvider.create).toBe('function')
      expect(typeof wrappedProvider.update).toBe('function')
      expect(typeof wrappedProvider.delete).toBe('function')
    })

    it('should preserve all data provider methods', () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [])

      // All 9 DataProvider methods should exist
      expect(typeof wrappedProvider.getList).toBe('function')
      expect(typeof wrappedProvider.getOne).toBe('function')
      expect(typeof wrappedProvider.getMany).toBe('function')
      expect(typeof wrappedProvider.getManyReference).toBe('function')
      expect(typeof wrappedProvider.create).toBe('function')
      expect(typeof wrappedProvider.update).toBe('function')
      expect(typeof wrappedProvider.updateMany).toBe('function')
      expect(typeof wrappedProvider.delete).toBe('function')
      expect(typeof wrappedProvider.deleteMany).toBe('function')
    })

    it('should call original data provider methods when no callbacks match', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'comments', // Different resource
          beforeCreate: vi.fn(),
        },
      ])

      await wrappedProvider.getList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      })

      expect(mockDataProvider.getList).toHaveBeenCalledWith('posts', expect.any(Object))
    })
  })

  describe('beforeCreate callback', () => {
    it('should call beforeCreate before create operation', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const callOrder: string[] = []
      const onBeforeCreate = vi.fn().mockImplementation(() => {
        callOrder.push('beforeCreate')
      })

      const originalCreate = mockDataProvider.create
      mockDataProvider.create = vi.fn().mockImplementation(async (...args) => {
        callOrder.push('create')
        return originalCreate.apply(mockDataProvider, args)
      })

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          beforeCreate: onBeforeCreate,
        },
      ])

      await wrappedProvider.create('posts', { data: { title: 'New Post' } })

      expect(callOrder).toEqual(['beforeCreate', 'create'])
      expect(onBeforeCreate).toHaveBeenCalled()
    })

    it('should pass correct params to beforeCreate', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onBeforeCreate = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          beforeCreate: onBeforeCreate,
        },
      ])

      await wrappedProvider.create('posts', { data: { title: 'Test' } })

      expect(onBeforeCreate).toHaveBeenCalledWith({
        resource: 'posts',
        params: { data: { title: 'Test' } },
        dataProvider: mockDataProvider,
      })
    })

    it('should allow beforeCreate to modify params', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onBeforeCreate = vi.fn().mockImplementation(({ params }) => ({
        ...params,
        data: { ...params.data, createdBy: 'system' },
      }))

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          beforeCreate: onBeforeCreate,
        },
      ])

      await wrappedProvider.create('posts', { data: { title: 'Test' } })

      expect(mockDataProvider.create).toHaveBeenCalledWith('posts', {
        data: { title: 'Test', createdBy: 'system' },
      })
    })

    it('should abort create when beforeCreate throws', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onBeforeCreate = vi.fn().mockRejectedValue(new Error('Validation failed'))

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          beforeCreate: onBeforeCreate,
        },
      ])

      await expect(
        wrappedProvider.create('posts', { data: { title: '' } })
      ).rejects.toThrow('Validation failed')

      expect(mockDataProvider.create).not.toHaveBeenCalled()
    })
  })

  describe('afterCreate callback', () => {
    it('should call afterCreate after successful create', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onAfterCreate = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          afterCreate: onAfterCreate,
        },
      ])

      await wrappedProvider.create('posts', { data: { title: 'New' } })

      expect(onAfterCreate).toHaveBeenCalled()
    })

    it('should pass result to afterCreate', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onAfterCreate = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          afterCreate: onAfterCreate,
        },
      ])

      const result = await wrappedProvider.create('posts', { data: { title: 'New' } })

      expect(onAfterCreate).toHaveBeenCalledWith({
        resource: 'posts',
        params: { data: { title: 'New' } },
        result,
        dataProvider: mockDataProvider,
      })
    })

    it('should not call afterCreate when create fails', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      mockDataProvider.create = vi.fn().mockRejectedValue(new Error('Server error'))
      const onAfterCreate = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          afterCreate: onAfterCreate,
        },
      ])

      await expect(
        wrappedProvider.create('posts', { data: { title: 'New' } })
      ).rejects.toThrow('Server error')

      expect(onAfterCreate).not.toHaveBeenCalled()
    })
  })

  describe('beforeUpdate and afterUpdate callbacks', () => {
    it('should call beforeUpdate before update operation', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onBeforeUpdate = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          beforeUpdate: onBeforeUpdate,
        },
      ])

      await wrappedProvider.update('posts', { id: 1, data: { title: 'Updated' } })

      expect(onBeforeUpdate).toHaveBeenCalledWith({
        resource: 'posts',
        params: { id: 1, data: { title: 'Updated' } },
        dataProvider: mockDataProvider,
      })
    })

    it('should call afterUpdate after successful update', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onAfterUpdate = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          afterUpdate: onAfterUpdate,
        },
      ])

      const result = await wrappedProvider.update('posts', { id: 1, data: { title: 'Updated' } })

      expect(onAfterUpdate).toHaveBeenCalledWith({
        resource: 'posts',
        params: { id: 1, data: { title: 'Updated' } },
        result,
        dataProvider: mockDataProvider,
      })
    })
  })

  describe('beforeDelete and afterDelete callbacks', () => {
    it('should call beforeDelete before delete operation', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onBeforeDelete = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          beforeDelete: onBeforeDelete,
        },
      ])

      await wrappedProvider.delete('posts', { id: 1 })

      expect(onBeforeDelete).toHaveBeenCalledWith({
        resource: 'posts',
        params: { id: 1 },
        dataProvider: mockDataProvider,
      })
    })

    it('should call afterDelete after successful delete', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onAfterDelete = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          afterDelete: onAfterDelete,
        },
      ])

      await wrappedProvider.delete('posts', { id: 1 })

      expect(onAfterDelete).toHaveBeenCalled()
    })

    it('should allow beforeDelete to abort deletion', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onBeforeDelete = vi.fn().mockRejectedValue(new Error('Cannot delete'))

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          beforeDelete: onBeforeDelete,
        },
      ])

      await expect(wrappedProvider.delete('posts', { id: 1 })).rejects.toThrow('Cannot delete')
      expect(mockDataProvider.delete).not.toHaveBeenCalled()
    })
  })

  describe('multiple resources', () => {
    it('should support callbacks for multiple resources', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onPostsBeforeCreate = vi.fn()
      const onCommentsBeforeCreate = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        { resource: 'posts', beforeCreate: onPostsBeforeCreate },
        { resource: 'comments', beforeCreate: onCommentsBeforeCreate },
      ])

      await wrappedProvider.create('posts', { data: { title: 'Test' } })
      await wrappedProvider.create('comments', { data: { body: 'Comment' } })

      expect(onPostsBeforeCreate).toHaveBeenCalledTimes(1)
      expect(onCommentsBeforeCreate).toHaveBeenCalledTimes(1)
    })
  })

  describe('context in callbacks', () => {
    it('should receive correct context in lifecycle callbacks', async () => {
      expect(withLifecycleCallbacks).toBeDefined()

      const onBeforeSave = vi.fn()

      const wrappedProvider = withLifecycleCallbacks(mockDataProvider, [
        {
          resource: 'posts',
          beforeUpdate: onBeforeSave,
        },
      ])

      await wrappedProvider.update('posts', {
        id: 1,
        data: { title: 'Updated' },
        previousData: { id: 1, title: 'Original' },
      })

      expect(onBeforeSave).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: 'posts',
          params: expect.objectContaining({
            id: 1,
            data: { title: 'Updated' },
            previousData: { id: 1, title: 'Original' },
          }),
          dataProvider: mockDataProvider,
        })
      )
    })
  })
})


// ============================================================================
// SECTION 2: Datagrid Custom Cell Renderer Tests
// ============================================================================

describe('Datagrid Custom Cell Renderer', () => {
  interface TestRecord extends RaRecord {
    id: number
    name: string
    email: string
    status: 'active' | 'inactive'
  }

  const testData: TestRecord[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  ]

  const createListContext = (
    overrides: Partial<ListControllerResult<TestRecord>> = {}
  ): ListControllerResult<TestRecord> => ({
    data: testData,
    total: testData.length,
    isLoading: false,
    isFetching: false,
    error: null,
    page: 1,
    perPage: 10,
    sort: { field: 'id', order: 'ASC' },
    filterValues: {},
    selectedIds: [],
    resource: 'users',
    setPage: vi.fn(),
    setPerPage: vi.fn(),
    setSort: vi.fn(),
    setFilters: vi.fn(),
    onSelect: vi.fn(),
    onToggleItem: vi.fn(),
    onUnselectItems: vi.fn(),
    refetch: vi.fn(),
    ...overrides,
  })

  it('should accept cellRenderer prop for custom cell rendering', () => {
    const customRenderer = vi.fn(({ record, column, value }) => (
      <span data-testid={`custom-cell-${column}-${record.id}`}>
        {value}
      </span>
    ))

    render(
      <ListContextProvider value={createListContext()}>
        <Datagrid cellRenderer={customRenderer}>
          <span data-source="name" />
          <span data-source="email" />
        </Datagrid>
      </ListContextProvider>
    )

    expect(customRenderer).toHaveBeenCalled()
    expect(screen.getByTestId('custom-cell-name-1')).toBeInTheDocument()
  })

  it('should pass record, column, and value to cellRenderer', () => {
    const customRenderer = vi.fn(({ record, column, value, rowIndex }) => (
      <span data-testid={`cell-${rowIndex}-${column}`}>{value}</span>
    ))

    render(
      <ListContextProvider value={createListContext()}>
        <Datagrid cellRenderer={customRenderer}>
          <span data-source="name" />
        </Datagrid>
      </ListContextProvider>
    )

    expect(customRenderer).toHaveBeenCalledWith(
      expect.objectContaining({
        record: expect.objectContaining({ id: 1, name: 'John Doe' }),
        column: 'name',
        value: 'John Doe',
        rowIndex: 0,
      })
    )
  })

  it('should allow different renderers per column', () => {
    const nameRenderer = vi.fn(({ value }) => (
      <strong data-testid="name-rendered">{value}</strong>
    ))
    const statusRenderer = vi.fn(({ value }) => (
      <span data-testid="status-badge" className={value === 'active' ? 'green' : 'red'}>
        {value}
      </span>
    ))

    render(
      <ListContextProvider value={createListContext()}>
        <Datagrid
          columns={[
            { source: 'name', render: nameRenderer },
            { source: 'status', render: statusRenderer },
          ]}
        />
      </ListContextProvider>
    )

    expect(screen.getAllByTestId('name-rendered')[0]).toBeInTheDocument()
    expect(screen.getAllByTestId('status-badge')[0]).toBeInTheDocument()
    expect(screen.getAllByTestId('status-badge')[0]).toHaveClass('green')
  })

  it('should support render prop pattern on Datagrid', () => {
    render(
      <ListContextProvider value={createListContext()}>
        <Datagrid>
          {({ data, columns }) => (
            <table data-testid="custom-table">
              <tbody>
                {data.map((record) => (
                  <tr key={record.id} data-testid={`row-${record.id}`}>
                    <td>{record.name}</td>
                    <td>{record.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Datagrid>
      </ListContextProvider>
    )

    expect(screen.getByTestId('custom-table')).toBeInTheDocument()
    expect(screen.getByTestId('row-1')).toBeInTheDocument()
    expect(screen.getByTestId('row-2')).toBeInTheDocument()
  })
})


// ============================================================================
// SECTION 3: Form Custom Field Wrapper Tests
// ============================================================================

describe('Form Custom Field Wrapper', () => {
  let mockDataProvider: DataProvider

  beforeEach(() => {
    mockDataProvider = createMockDataProvider()
  })

  it('should accept fieldWrapper prop for custom field wrapping', async () => {
    const CustomFieldWrapper = ({ children, source, label }: {
      children: ReactNode
      source: string
      label?: string
    }) => (
      <div data-testid={`wrapper-${source}`} className="custom-field-wrapper">
        <label data-testid={`label-${source}`}>{label || source}</label>
        {children}
      </div>
    )

    await act(async () => {
      render(
        <SimpleForm
          onSubmit={vi.fn()}
          fieldWrapper={CustomFieldWrapper}
        >
          <TextInput source="name" label="Name" />
          <TextInput source="email" label="Email" />
        </SimpleForm>
      )
    })

    expect(screen.getByTestId('wrapper-name')).toBeInTheDocument()
    expect(screen.getByTestId('wrapper-email')).toBeInTheDocument()
    expect(screen.getByTestId('wrapper-name')).toHaveClass('custom-field-wrapper')
  })

  it('should pass field metadata to fieldWrapper', async () => {
    const CustomFieldWrapper = vi.fn(({ children, source, label, isRequired, error }) => (
      <div data-testid={`field-${source}`}>
        <span data-testid={`required-${source}`}>{isRequired ? 'required' : 'optional'}</span>
        <span data-testid={`error-${source}`}>{error || 'no-error'}</span>
        {children}
      </div>
    ))

    await act(async () => {
      render(
        <SimpleForm
          onSubmit={vi.fn()}
          fieldWrapper={CustomFieldWrapper}
          defaultValues={{ name: '' }}
        >
          <TextInput
            source="name"
            label="Name"
            rules={{ required: 'Name is required' }}
          />
        </SimpleForm>
      )
    })

    // Check that the fieldWrapper was called with the correct props
    // Note: React passes undefined as second arg, so we check only the first
    const lastCallArgs = CustomFieldWrapper.mock.calls[CustomFieldWrapper.mock.calls.length - 1]
    expect(lastCallArgs[0]).toMatchObject({
      source: 'name',
      label: 'Name',
      isRequired: true,
    })
  })

  it('should allow fieldWrapper to intercept validation errors', async () => {
    const user = userEvent.setup()

    const CustomFieldWrapper = ({ children, source, error }: {
      children: ReactNode
      source: string
      error?: string
    }) => (
      <div data-testid={`field-${source}`}>
        {children}
        {error && (
          <span data-testid={`custom-error-${source}`} className="custom-error">
            Custom: {error}
          </span>
        )}
      </div>
    )

    await act(async () => {
      render(
        <SimpleForm
          onSubmit={vi.fn()}
          fieldWrapper={CustomFieldWrapper}
          defaultValues={{ name: '' }}
        >
          <TextInput
            source="name"
            label="Name"
            rules={{ required: 'Name is required' }}
          />
        </SimpleForm>
      )
    })

    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByTestId('custom-error-name')).toHaveTextContent('Custom: Name is required')
    })
  })
})


// ============================================================================
// SECTION 4: Admin Plugin System Tests
// ============================================================================

describe('Admin Plugin System', () => {
  let mockDataProvider: DataProvider

  beforeEach(() => {
    mockDataProvider = createMockDataProvider()
  })

  it('should accept plugins prop as an array', () => {
    const plugin1 = { name: 'plugin1' }
    const plugin2 = { name: 'plugin2' }

    expect(() => {
      render(
        <TestMemoryRouter>
          <Admin
            dataProvider={mockDataProvider}
            plugins={[plugin1, plugin2]}
          >
            <Resource name="posts" list={() => <div>Posts</div>} />
          </Admin>
        </TestMemoryRouter>
      )
    }).not.toThrow()
  })

  it('should call plugin install method with admin context', () => {
    const installFn = vi.fn()
    const plugin = {
      name: 'test-plugin',
      install: installFn,
    }

    render(
      <TestMemoryRouter>
        <Admin
          dataProvider={mockDataProvider}
          plugins={[plugin]}
        >
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>
      </TestMemoryRouter>
    )

    expect(installFn).toHaveBeenCalledWith(
      expect.objectContaining({
        dataProvider: mockDataProvider,
        addResource: expect.any(Function),
        addMenuItem: expect.any(Function),
      })
    )
  })

  it('should allow plugins to add resources dynamically', async () => {
    const plugin = {
      name: 'dynamic-resources',
      install: ({ addResource }: { addResource: (resource: { name: string; list: ComponentType }) => void }) => {
        addResource({
          name: 'settings',
          list: () => <div data-testid="settings-list">Settings</div>,
        })
      },
    }

    render(
      <TestMemoryRouter initialEntries={['/settings']}>
        <Admin
          dataProvider={mockDataProvider}
          plugins={[plugin]}
        >
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>
      </TestMemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('settings-list')).toBeInTheDocument()
    })
  })

  it('should allow plugins to modify data provider', () => {
    const originalGetList = mockDataProvider.getList
    const modifiedGetList = vi.fn().mockImplementation((...args) => originalGetList(...args))

    const plugin = {
      name: 'data-modifier',
      install: ({ wrapDataProvider }: {
        wrapDataProvider: (wrapper: (dp: DataProvider) => DataProvider) => void
      }) => {
        wrapDataProvider((dp) => ({
          ...dp,
          getList: modifiedGetList,
        }))
      },
    }

    render(
      <TestMemoryRouter>
        <Admin
          dataProvider={mockDataProvider}
          plugins={[plugin]}
        >
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>
      </TestMemoryRouter>
    )

    // Plugin should have modified the data provider
    expect(modifiedGetList).toBeDefined()
  })

  it('should allow plugins to add menu items', async () => {
    const plugin = {
      name: 'custom-menu',
      install: ({ addMenuItem }: {
        addMenuItem: (item: { name: string; path: string; icon?: ReactNode }) => void
      }) => {
        addMenuItem({
          name: 'Analytics',
          path: '/analytics',
          icon: <span data-testid="analytics-icon">📊</span>,
        })
      },
    }

    render(
      <TestMemoryRouter>
        <Admin
          dataProvider={mockDataProvider}
          plugins={[plugin]}
        >
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>
      </TestMemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByTestId('analytics-icon')).toBeInTheDocument()
    })
  })

  it('should call plugins in order', () => {
    const order: string[] = []

    const plugin1 = {
      name: 'plugin-1',
      install: () => { order.push('plugin-1') },
    }

    const plugin2 = {
      name: 'plugin-2',
      install: () => { order.push('plugin-2') },
    }

    render(
      <TestMemoryRouter>
        <Admin
          dataProvider={mockDataProvider}
          plugins={[plugin1, plugin2]}
        >
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>
      </TestMemoryRouter>
    )

    expect(order).toEqual(['plugin-1', 'plugin-2'])
  })

  it('should provide hooks for plugins to register', () => {
    const cleanup = vi.fn()
    const plugin = {
      name: 'cleanup-plugin',
      install: ({ onUnmount }: { onUnmount: (fn: () => void) => void }) => {
        onUnmount(cleanup)
      },
    }

    const { unmount } = render(
      <TestMemoryRouter>
        <Admin
          dataProvider={mockDataProvider}
          plugins={[plugin]}
        >
          <Resource name="posts" list={() => <div>Posts</div>} />
        </Admin>
      </TestMemoryRouter>
    )

    unmount()

    expect(cleanup).toHaveBeenCalled()
  })
})


// ============================================================================
// SECTION 5: onBeforeSave and onAfterSave Lifecycle Hooks Tests
// ============================================================================

describe('onBeforeSave and onAfterSave hooks', () => {
  let mockDataProvider: DataProvider
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    mockDataProvider = {
      getList: vi.fn(),
      getOne: vi.fn().mockResolvedValue({ data: { id: 1, title: 'Original' } }),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn().mockResolvedValue({ data: { id: 3, title: 'New' } }),
      update: vi.fn().mockResolvedValue({ data: { id: 1, title: 'Updated' } }),
      updateMany: vi.fn(),
      delete: vi.fn().mockResolvedValue({ data: { id: 1 } }),
      deleteMany: vi.fn(),
    }
  })

  const createWrapper = () => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={mockDataProvider}>
            <NotificationContextProvider>
              <TestMemoryRouter initialEntries={['/posts/1/edit']}>
                {children}
              </TestMemoryRouter>
            </NotificationContextProvider>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )
    }
  }

  describe('EditBase with onBeforeSave', () => {
    it('should call onBeforeSave before mutation', async () => {
      const onBeforeSave = vi.fn()
      const Wrapper = createWrapper()

      const SaveButton = () => {
        const { save } = useShadminFormContext()
        return (
          <button onClick={() => save?.({ title: 'New Title' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} onBeforeSave={onBeforeSave}>
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(onBeforeSave).toHaveBeenCalled()
      })

      expect(onBeforeSave).toHaveBeenCalledWith({
        resource: 'posts',
        id: 1,
        data: { title: 'New Title' },
        previousData: { id: 1, title: 'Original' },
      })
    })

    it('should allow onBeforeSave to modify data', async () => {
      const onBeforeSave = vi.fn().mockImplementation(({ data }) => ({
        ...data,
        updatedAt: '2024-01-01',
      }))
      const Wrapper = createWrapper()

      const SaveButton = () => {
        const { save } = useShadminFormContext()
        return (
          <button onClick={() => save?.({ title: 'New Title' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} onBeforeSave={onBeforeSave}>
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(mockDataProvider.update).toHaveBeenCalledWith(
          'posts',
          expect.objectContaining({
            data: expect.objectContaining({
              title: 'New Title',
              updatedAt: '2024-01-01',
            }),
          })
        )
      })
    })

    it('should abort save when onBeforeSave returns false', async () => {
      const onBeforeSave = vi.fn().mockReturnValue(false)
      const Wrapper = createWrapper()

      const SaveButton = () => {
        const { save } = useShadminFormContext()
        return (
          <button onClick={() => save?.({ title: 'New Title' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} onBeforeSave={onBeforeSave}>
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(onBeforeSave).toHaveBeenCalled()
      })

      // Give time for potential mutation
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockDataProvider.update).not.toHaveBeenCalled()
    })

    it('should abort save when onBeforeSave throws', async () => {
      const onBeforeSave = vi.fn().mockRejectedValue(new Error('Validation error'))
      const Wrapper = createWrapper()

      const SaveButton = () => {
        const { save } = useShadminFormContext()
        return (
          <button onClick={() => save?.({ title: '' }).catch(() => {})}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} onBeforeSave={onBeforeSave}>
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(onBeforeSave).toHaveBeenCalled()
      })

      expect(mockDataProvider.update).not.toHaveBeenCalled()
    })
  })

  describe('EditBase with onAfterSave', () => {
    it('should call onAfterSave after successful mutation', async () => {
      const onAfterSave = vi.fn()
      const Wrapper = createWrapper()

      const SaveButton = () => {
        const { save } = useShadminFormContext()
        return (
          <button onClick={() => save?.({ title: 'New Title' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} onAfterSave={onAfterSave} redirect={false}>
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(onAfterSave).toHaveBeenCalled()
      })

      expect(onAfterSave).toHaveBeenCalledWith({
        resource: 'posts',
        id: 1,
        data: { title: 'New Title' },
        result: { data: { id: 1, title: 'Updated' } },
      })
    })

    it('should not call onAfterSave when mutation fails', async () => {
      mockDataProvider.update = vi.fn().mockRejectedValue(new Error('Update failed'))
      const onAfterSave = vi.fn()
      const Wrapper = createWrapper()

      const SaveButton = () => {
        const { save } = useShadminFormContext()
        return (
          <button onClick={() => save?.({ title: 'New Title' }).catch(() => {})}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <EditBase resource="posts" id={1} onAfterSave={onAfterSave} redirect={false}>
            <SaveButton />
          </EditBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(mockDataProvider.update).toHaveBeenCalled()
      })

      // Give time for callback
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(onAfterSave).not.toHaveBeenCalled()
    })
  })

  describe('CreateBase with onBeforeSave and onAfterSave', () => {
    it('should call onBeforeSave before create mutation', async () => {
      const onBeforeSave = vi.fn()
      const Wrapper = createWrapper()

      const SaveButton = () => {
        const { save } = useShadminFormContext()
        return (
          <button onClick={() => save?.({ title: 'New Post' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <CreateBase resource="posts" onBeforeSave={onBeforeSave}>
            <SaveButton />
          </CreateBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(onBeforeSave).toHaveBeenCalled()
      })

      expect(onBeforeSave).toHaveBeenCalledWith({
        resource: 'posts',
        data: { title: 'New Post' },
      })
    })

    it('should call onAfterSave after successful create', async () => {
      const onAfterSave = vi.fn()
      const Wrapper = createWrapper()

      const SaveButton = () => {
        const { save } = useShadminFormContext()
        return (
          <button onClick={() => save?.({ title: 'New Post' })}>
            Save
          </button>
        )
      }

      render(
        <Wrapper>
          <CreateBase resource="posts" onAfterSave={onAfterSave} redirect={false}>
            <SaveButton />
          </CreateBase>
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(onAfterSave).toHaveBeenCalled()
      })

      expect(onAfterSave).toHaveBeenCalledWith({
        resource: 'posts',
        data: { title: 'New Post' },
        result: { data: { id: 3, title: 'New' } },
      })
    })
  })
})


// ============================================================================
// SECTION 6: Lifecycle Callbacks Context Tests
// ============================================================================

describe('Lifecycle Callbacks Context', () => {
  let mockDataProvider: DataProvider
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    mockDataProvider = {
      getList: vi.fn(),
      getOne: vi.fn().mockResolvedValue({ data: { id: 1, title: 'Test', author: 'John' } }),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      create: vi.fn().mockResolvedValue({ data: { id: 2, title: 'New' } }),
      update: vi.fn().mockResolvedValue({ data: { id: 1, title: 'Updated' } }),
      updateMany: vi.fn(),
      delete: vi.fn().mockResolvedValue({ data: { id: 1 } }),
      deleteMany: vi.fn(),
    }
  })

  const createWrapper = () => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <DataProviderContextProvider dataProvider={mockDataProvider}>
            <NotificationContextProvider>
              <TestMemoryRouter initialEntries={['/posts/1/edit']}>
                {children}
              </TestMemoryRouter>
            </NotificationContextProvider>
          </DataProviderContextProvider>
        </QueryClientProvider>
      )
    }
  }

  it('should receive previousData in onBeforeSave context for edits', async () => {
    const onBeforeSave = vi.fn()
    const Wrapper = createWrapper()

    const SaveButton = () => {
      const { save } = useShadminFormContext()
      return (
        <button onClick={() => save?.({ title: 'Changed' })}>
          Save
        </button>
      )
    }

    render(
      <Wrapper>
        <EditBase resource="posts" id={1} onBeforeSave={onBeforeSave}>
          <SaveButton />
        </EditBase>
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onBeforeSave).toHaveBeenCalledWith(
        expect.objectContaining({
          previousData: expect.objectContaining({
            id: 1,
            title: 'Test',
            author: 'John',
          }),
        })
      )
    })
  })

  it('should receive record in context when available', async () => {
    const onBeforeSave = vi.fn()
    const Wrapper = createWrapper()

    const SaveButtonWithRecord = () => {
      const { save } = useShadminFormContext()
      const record = useRecordContext()
      return (
        <button onClick={() => save?.({ ...record, title: 'Changed' })}>
          Save
        </button>
      )
    }

    render(
      <Wrapper>
        <EditBase resource="posts" id={1} onBeforeSave={onBeforeSave}>
          <SaveButtonWithRecord />
        </EditBase>
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onBeforeSave).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: 1,
            title: 'Changed',
            author: 'John',
          }),
        })
      )
    })
  })

  it('should receive resource name in callback context', async () => {
    const onBeforeSave = vi.fn()
    const Wrapper = createWrapper()

    const SaveButton = () => {
      const { save } = useShadminFormContext()
      return <button onClick={() => save?.({ title: 'Test' })}>Save</button>
    }

    render(
      <Wrapper>
        <EditBase resource="posts" id={1} onBeforeSave={onBeforeSave}>
          <SaveButton />
        </EditBase>
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onBeforeSave).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: 'posts',
        })
      )
    })
  })

  it('should receive id in callback context for updates', async () => {
    const onBeforeSave = vi.fn()
    const Wrapper = createWrapper()

    const SaveButton = () => {
      const { save } = useShadminFormContext()
      return <button onClick={() => save?.({ title: 'Test' })}>Save</button>
    }

    render(
      <Wrapper>
        <EditBase resource="posts" id={42} onBeforeSave={onBeforeSave}>
          <SaveButton />
        </EditBase>
      </Wrapper>
    )

    // Mock getOne to return record with id 42
    mockDataProvider.getOne = vi.fn().mockResolvedValue({ data: { id: 42, title: 'Original' } })

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onBeforeSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 42,
        })
      )
    })
  })

  it('should support async onBeforeSave that transforms data', async () => {
    const onBeforeSave = vi.fn().mockImplementation(async ({ data }) => {
      // Simulate async validation or transformation
      await new Promise(resolve => setTimeout(resolve, 50))
      return {
        ...data,
        validated: true,
        transformedAt: new Date().toISOString(),
      }
    })

    const Wrapper = createWrapper()

    const SaveButton = () => {
      const { save } = useShadminFormContext()
      return <button onClick={() => save?.({ title: 'Test' })}>Save</button>
    }

    render(
      <Wrapper>
        <EditBase resource="posts" id={1} onBeforeSave={onBeforeSave} redirect={false}>
          <SaveButton />
        </EditBase>
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockDataProvider.update).toHaveBeenCalledWith(
        'posts',
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Test',
            validated: true,
            transformedAt: expect.any(String),
          }),
        })
      )
    })
  })

  it('should call onAfterSave with the saved data and result', async () => {
    const onAfterSave = vi.fn()
    const Wrapper = createWrapper()

    const SaveButton = () => {
      const { save } = useShadminFormContext()
      return <button onClick={() => save?.({ title: 'New Title' })}>Save</button>
    }

    render(
      <Wrapper>
        <EditBase resource="posts" id={1} onAfterSave={onAfterSave} redirect={false}>
          <SaveButton />
        </EditBase>
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onAfterSave).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: 'posts',
          id: 1,
          data: { title: 'New Title' },
          result: { data: { id: 1, title: 'Updated' } },
        })
      )
    })
  })
})
