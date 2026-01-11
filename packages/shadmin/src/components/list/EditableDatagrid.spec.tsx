import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditableDatagrid, type EditableDatagridProps } from './EditableDatagrid'
import { ListContextProvider, type ListControllerResult } from '../../contexts/ListContext'
import { DataProviderContext } from '../../contexts/DataProviderContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord, DataProvider } from '../../types'

interface TestRecord extends RaRecord {
  id: number
  name: string
  email: string
  status: string
}

const testData: TestRecord[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com.ai', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com.ai', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com.ai', status: 'active' },
]

const createTestListContext = (
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

const createMockDataProvider = (): DataProvider => ({
  getList: vi.fn(),
  getOne: vi.fn(),
  getMany: vi.fn(),
  getManyReference: vi.fn(),
  create: vi.fn(),
  update: vi.fn().mockImplementation(async (resource, params) => ({
    data: { ...params.previousData, ...params.data, id: params.id },
  })),
  updateMany: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
})

// Simple TextField component for testing
const TextField = ({ source }: { source: string }) => {
  const record = useRecordContext<TestRecord>()
  if (!record) return null
  return <span data-testid={`field-${source}`}>{String(record[source] ?? '')}</span>
}

const renderEditableDatagrid = (
  props: Partial<EditableDatagridProps<TestRecord>> = {},
  contextOverrides: Partial<ListControllerResult<TestRecord>> = {},
  dataProvider: DataProvider = createMockDataProvider()
) => {
  const context = createTestListContext(contextOverrides)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <DataProviderContext.Provider value={dataProvider}>
          <ListContextProvider value={context}>
            <EditableDatagrid {...props}>
              <TextField source="name" />
              <TextField source="email" />
              <TextField source="status" />
            </EditableDatagrid>
          </ListContextProvider>
        </DataProviderContext.Provider>
      </QueryClientProvider>
    ),
    context,
    dataProvider,
    queryClient,
  }
}

describe('EditableDatagrid', () => {
  describe('Basic rendering', () => {
    it('should render a table with data', () => {
      renderEditableDatagrid()
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com.ai')).toBeInTheDocument()
    })

    it('should render table headers', () => {
      renderEditableDatagrid()
      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument()
    })

    it('should not show edit UI by default', () => {
      renderEditableDatagrid()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })

  describe('Entering edit mode', () => {
    it('should enter edit mode on double-click on a cell', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveValue('John Doe')
    })

    it('should enter edit mode when editable column is specified', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid({
        editableColumns: ['name', 'email'],
      })

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should not enter edit mode on non-editable columns', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid({
        editableColumns: ['name'], // Only name is editable
      })

      const statusCell = screen.getAllByText('active')[0]
      await user.dblClick(statusCell)

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('should focus the input when entering edit mode', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      expect(input).toHaveFocus()
    })

    it('should select all text when entering edit mode', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.selectionStart).toBe(0)
      expect(input.selectionEnd).toBe(input.value.length)
    })
  })

  describe('Saving changes', () => {
    it('should save on Enter key press', async () => {
      const user = userEvent.setup()
      const { dataProvider } = renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, 'John Updated{Enter}')

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalledWith(
          'users',
          expect.objectContaining({
            id: 1,
            data: expect.objectContaining({ name: 'John Updated' }),
          })
        )
      })
    })

    it('should save on blur', async () => {
      const user = userEvent.setup()
      const { dataProvider } = renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, 'John Updated')

      // Click outside to blur
      await user.click(document.body)

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalledWith(
          'users',
          expect.objectContaining({
            id: 1,
            data: expect.objectContaining({ name: 'John Updated' }),
          })
        )
      })
    })

    it('should exit edit mode after saving', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      await user.type(input, '{Enter}')

      await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      })
    })

    it('should not call update if value has not changed', async () => {
      const user = userEvent.setup()
      const { dataProvider } = renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      // Just press Enter without changing anything
      await user.type(input, '{Enter}')

      expect(dataProvider.update).not.toHaveBeenCalled()
    })

    it('should call onSave callback after successful save', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      renderEditableDatagrid({ onSave })

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, 'John Updated{Enter}')

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({ id: 1, name: 'John Updated' })
        )
      })
    })
  })

  describe('Canceling changes', () => {
    it('should cancel on Escape key press', async () => {
      const user = userEvent.setup()
      const { dataProvider } = renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, 'John Updated{Escape}')

      // Should exit edit mode
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      // Should not have called update
      expect(dataProvider.update).not.toHaveBeenCalled()
      // Original value should be restored
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should restore original value on cancel', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, 'Something Different{Escape}')

      // Original value should be displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should call onCancel callback when canceling', async () => {
      const user = userEvent.setup()
      const onCancel = vi.fn()
      renderEditableDatagrid({ onCancel })

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      await user.type(screen.getByRole('textbox'), '{Escape}')

      expect(onCancel).toHaveBeenCalled()
    })
  })

  describe('Keyboard navigation', () => {
    it('should move to next cell on Tab', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      // Tab should move to the next cell (email)
      await user.tab()

      await waitFor(() => {
        const input = screen.getByRole('textbox')
        expect(input).toHaveValue('john@example.com.ai')
      })
    })

    it('should move to previous cell on Shift+Tab', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid()

      // Start editing the email cell
      const emailCell = screen.getByText('john@example.com.ai')
      await user.dblClick(emailCell)

      // Shift+Tab should move to the previous cell (name)
      await user.tab({ shift: true })

      await waitFor(() => {
        const input = screen.getByRole('textbox')
        expect(input).toHaveValue('John Doe')
      })
    })

    it('should move to next row cell on Tab at end of row', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid()

      // Start editing the status cell (last in row)
      const statusCell = screen.getAllByText('active')[0]
      await user.dblClick(statusCell)

      // Tab should move to first cell of next row (Jane's name)
      await user.tab()

      await waitFor(() => {
        const input = screen.getByRole('textbox')
        expect(input).toHaveValue('Jane Smith')
      })
    })
  })

  describe('Validation', () => {
    it('should support inline validation', async () => {
      const user = userEvent.setup()
      const validate = vi.fn().mockReturnValue('Name is required')
      renderEditableDatagrid({
        validate: {
          name: validate,
        },
      })

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, '{Enter}')

      expect(validate).toHaveBeenCalledWith('')
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })

    it('should not save when validation fails', async () => {
      const user = userEvent.setup()
      const validate = vi.fn().mockReturnValue('Name is required')
      const { dataProvider } = renderEditableDatagrid({
        validate: {
          name: validate,
        },
      })

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, '{Enter}')

      expect(dataProvider.update).not.toHaveBeenCalled()
    })

    it('should clear validation error when value is corrected', async () => {
      const user = userEvent.setup()
      const validate = vi.fn()
        .mockReturnValueOnce('Name is required')
        .mockReturnValueOnce(undefined)
      renderEditableDatagrid({
        validate: {
          name: validate,
        },
      })

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, '{Enter}')

      // Error should be displayed
      expect(screen.getByText('Name is required')).toBeInTheDocument()

      // Type a new value
      await user.type(input, 'Valid Name{Enter}')

      // Error should be cleared
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
    })
  })

  describe('Batch save', () => {
    it('should support batch save mode', async () => {
      const user = userEvent.setup()
      const { dataProvider } = renderEditableDatagrid({
        batchSave: true,
      })

      // Edit first row
      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'John Updated{Enter}')

      // Edit second row
      const nameCell2 = screen.getByText('Jane Smith')
      await user.dblClick(nameCell2)
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'Jane Updated{Enter}')

      // No save calls yet
      expect(dataProvider.update).not.toHaveBeenCalled()

      // Click batch save button
      await user.click(screen.getByRole('button', { name: /save all/i }))

      // Now both should be saved
      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalledTimes(2)
      })
    })

    it('should show save all button when in batch mode with pending changes', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid({
        batchSave: true,
      })

      // Initially no save button
      expect(screen.queryByRole('button', { name: /save all/i })).not.toBeInTheDocument()

      // Edit a cell
      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'John Updated{Enter}')

      // Save button should appear
      expect(screen.getByRole('button', { name: /save all/i })).toBeInTheDocument()
    })

    it('should show cancel all button when in batch mode with pending changes', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid({
        batchSave: true,
      })

      // Edit a cell
      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'John Updated{Enter}')

      // Cancel button should appear
      expect(screen.getByRole('button', { name: /cancel all/i })).toBeInTheDocument()
    })

    it('should revert all changes when clicking cancel all', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid({
        batchSave: true,
      })

      // Edit first row
      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'John Updated{Enter}')

      // Click cancel all
      await user.click(screen.getByRole('button', { name: /cancel all/i }))

      // Original value should be restored
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Loading and error states', () => {
    it('should show loading indicator while saving', async () => {
      const user = userEvent.setup()
      let resolveUpdate: () => void
      const updatePromise = new Promise<void>((resolve) => {
        resolveUpdate = resolve
      })

      const dataProvider = createMockDataProvider()
      dataProvider.update = vi.fn().mockImplementation(() =>
        updatePromise.then(() => ({ data: { id: 1, name: 'Updated' } }))
      )

      renderEditableDatagrid({}, {}, dataProvider)

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'John Updated{Enter}')

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
      })

      // Resolve the update
      resolveUpdate!()
    })

    it('should show error message when save fails', async () => {
      const user = userEvent.setup()
      const dataProvider = createMockDataProvider()
      dataProvider.update = vi.fn().mockRejectedValue(new Error('Save failed'))

      renderEditableDatagrid({}, {}, dataProvider)

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'John Updated{Enter}')

      await waitFor(() => {
        expect(screen.getByText(/save failed/i)).toBeInTheDocument()
      })
    })

    it('should allow retry after save failure', async () => {
      const user = userEvent.setup()
      const dataProvider = createMockDataProvider()
      dataProvider.update = vi.fn()
        .mockRejectedValueOnce(new Error('Save failed'))
        .mockResolvedValueOnce({ data: { id: 1, name: 'John Updated' } })

      renderEditableDatagrid({}, {}, dataProvider)

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'John Updated{Enter}')

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/save failed/i)).toBeInTheDocument()
      })

      // Click retry button
      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)

      // Should call update again
      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Read-only mode', () => {
    it('should not enter edit mode when readOnly is true', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid({
        readOnly: true,
      })

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('should support readOnly per column', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid({
        readOnlyColumns: ['status'],
      })

      // Can edit name
      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      await user.keyboard('{Escape}')

      // Cannot edit status
      const statusCell = screen.getAllByText('active')[0]
      await user.dblClick(statusCell)
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })

  describe('Custom input components', () => {
    it('should support custom input component per column', async () => {
      const user = userEvent.setup()
      const CustomInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <select data-testid="custom-input" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      )

      renderEditableDatagrid({
        editInputs: {
          status: CustomInput,
        },
      })

      const statusCell = screen.getAllByText('active')[0]
      await user.dblClick(statusCell)

      expect(screen.getByTestId('custom-input')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should announce edit mode to screen readers', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-label', expect.stringContaining('name'))
    })

    it('should have proper aria attributes on editable cells', () => {
      renderEditableDatagrid()

      const rows = screen.getAllByRole('row')
      // First data row
      const cells = within(rows[1]).getAllByRole('cell')
      // Cells should indicate they are editable
      cells.forEach((cell) => {
        expect(cell).toHaveAttribute('role', 'cell')
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle empty data gracefully', () => {
      renderEditableDatagrid({}, { data: [], total: 0 })
      expect(screen.getByText(/no data available/i)).toBeInTheDocument()
    })

    it('should handle null values in cells', async () => {
      const user = userEvent.setup()
      const nullData = [
        { id: 1, name: null as unknown as string, email: 'test@test.com', status: 'active' },
      ]
      renderEditableDatagrid({}, { data: nullData, total: 1 })

      // Find the cell with null value (will render as empty)
      const row = screen.getAllByRole('row')[1]
      const cells = within(row).getAllByRole('cell')
      await user.dblClick(cells[0])

      expect(screen.getByRole('textbox')).toHaveValue('')
    })

    it('should handle rapid double-clicks gracefully', async () => {
      const user = userEvent.setup()
      renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)
      await user.dblClick(nameCell)

      // Should still have only one input
      expect(screen.getAllByRole('textbox')).toHaveLength(1)
    })

    it('should preserve other field values when editing one field', async () => {
      const user = userEvent.setup()
      const { dataProvider } = renderEditableDatagrid()

      const nameCell = screen.getByText('John Doe')
      await user.dblClick(nameCell)
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'John Updated{Enter}')

      await waitFor(() => {
        expect(dataProvider.update).toHaveBeenCalledWith(
          'users',
          expect.objectContaining({
            previousData: expect.objectContaining({
              email: 'john@example.com.ai',
              status: 'active',
            }),
          })
        )
      })
    })
  })
})
