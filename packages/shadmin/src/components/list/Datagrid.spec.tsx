import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Datagrid, type DatagridProps } from './Datagrid'
import { ListContextProvider, type ListControllerResult } from '../../contexts/ListContext'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../contexts/RecordContext'

interface TestRecord extends RaRecord {
  id: number
  name: string
  email: string
  status: string
}

const testData: TestRecord[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
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

// Simple TextField component for testing
const TextField = ({ source }: { source: string }) => {
  const record = useRecordContext<TestRecord>()
  if (!record) return null
  return <span data-testid={`field-${source}`}>{String(record[source] ?? '')}</span>
}

const renderDatagrid = (
  props: Partial<DatagridProps<TestRecord>> = {},
  contextOverrides: Partial<ListControllerResult<TestRecord>> = {}
) => {
  const context = createTestListContext(contextOverrides)
  return {
    ...render(
      <ListContextProvider value={context}>
        <Datagrid {...props}>
          <TextField source="name" />
          <TextField source="email" />
          <TextField source="status" />
        </Datagrid>
      </ListContextProvider>
    ),
    context,
  }
}

describe('Datagrid', () => {
  describe('Basic rendering', () => {
    it('should render a table', () => {
      renderDatagrid()
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('should render table headers based on children sources', () => {
      renderDatagrid()
      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument()
    })

    it('should render all data rows', () => {
      renderDatagrid()
      const rows = screen.getAllByRole('row')
      // 1 header row + 3 data rows
      expect(rows).toHaveLength(4)
    })

    it('should render data in each cell using children components', () => {
      renderDatagrid()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      // There are two 'active' status values, use getAllByText
      expect(screen.getAllByText('active')).toHaveLength(2)
    })

    it('should support custom header labels via headerLabel prop on children', () => {
      const context = createTestListContext()
      render(
        <ListContextProvider value={context}>
          <Datagrid>
            <TextField source="name" />
            <TextField source="email" />
          </Datagrid>
        </ListContextProvider>
      )
      // Default behavior capitalizes source
      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument()
    })
  })

  describe('RecordContext', () => {
    it('should provide RecordContext for each row', () => {
      const RecordDisplay = () => {
        const record = useRecordContext<TestRecord>()
        return record ? (
          <span data-testid={`record-${record.id}`}>{record.name}</span>
        ) : null
      }

      const context = createTestListContext()
      render(
        <ListContextProvider value={context}>
          <Datagrid>
            <RecordDisplay />
          </Datagrid>
        </ListContextProvider>
      )

      expect(screen.getByTestId('record-1')).toHaveTextContent('John Doe')
      expect(screen.getByTestId('record-2')).toHaveTextContent('Jane Smith')
      expect(screen.getByTestId('record-3')).toHaveTextContent('Bob Johnson')
    })
  })

  describe('Column sorting', () => {
    it('should call setSort when clicking a sortable header', async () => {
      const user = userEvent.setup()
      const { context } = renderDatagrid()

      const nameHeader = screen.getByRole('columnheader', { name: /name/i })
      await user.click(nameHeader)

      expect(context.setSort).toHaveBeenCalledWith({
        field: 'name',
        order: 'ASC',
      })
    })

    it('should toggle sort order on subsequent clicks', async () => {
      const user = userEvent.setup()
      const setSort = vi.fn()
      const { rerender } = render(
        <ListContextProvider value={createTestListContext({
          setSort,
          sort: { field: 'name', order: 'ASC' }
        })}>
          <Datagrid>
            <TextField source="name" />
          </Datagrid>
        </ListContextProvider>
      )

      const nameHeader = screen.getByRole('columnheader', { name: /name/i })
      await user.click(nameHeader)

      // When clicking on same column, should toggle to DESC
      expect(setSort).toHaveBeenCalledWith({
        field: 'name',
        order: 'DESC',
      })
    })

    it('should display sort indicator on sorted column', () => {
      renderDatagrid({}, { sort: { field: 'name', order: 'ASC' } })
      const nameHeader = screen.getByRole('columnheader', { name: /name/i })
      // Check for visual sort indicator (aria-sort attribute)
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
    })

    it('should display descending indicator when sorted DESC', () => {
      renderDatagrid({}, { sort: { field: 'name', order: 'DESC' } })
      const nameHeader = screen.getByRole('columnheader', { name: /name/i })
      expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
    })

    it('should allow disabling sort on specific columns', async () => {
      const user = userEvent.setup()
      const setSort = vi.fn()
      const context = createTestListContext({ setSort })

      render(
        <ListContextProvider value={context}>
          <Datagrid>
            <TextField source="name" />
            {/* @ts-expect-error - sortable prop test */}
            <TextField source="email" sortable={false} />
          </Datagrid>
        </ListContextProvider>
      )

      const emailHeader = screen.getByRole('columnheader', { name: /email/i })
      await user.click(emailHeader)

      expect(setSort).not.toHaveBeenCalled()
    })
  })

  describe('Row selection', () => {
    it('should render checkboxes when selection is enabled', () => {
      renderDatagrid({ bulkActionButtons: true })
      // Should have a checkbox in header for select all
      const checkboxes = screen.getAllByRole('checkbox')
      // 1 for header + 3 for rows
      expect(checkboxes).toHaveLength(4)
    })

    it('should not render checkboxes by default', () => {
      renderDatagrid()
      const checkboxes = screen.queryAllByRole('checkbox')
      expect(checkboxes).toHaveLength(0)
    })

    it('should call onToggleItem when clicking a row checkbox', async () => {
      const user = userEvent.setup()
      const { context } = renderDatagrid({ bulkActionButtons: true })

      const checkboxes = screen.getAllByRole('checkbox')
      // Click the first row's checkbox (index 1, since 0 is header)
      await user.click(checkboxes[1])

      expect(context.onToggleItem).toHaveBeenCalledWith(1)
    })

    it('should show checkbox as checked for selected rows', () => {
      renderDatagrid({ bulkActionButtons: true }, { selectedIds: [1, 3] })

      const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
      // Row checkboxes (not header)
      expect(checkboxes[1]).toBeChecked() // id: 1
      expect(checkboxes[2]).not.toBeChecked() // id: 2
      expect(checkboxes[3]).toBeChecked() // id: 3
    })

    it('should select all when clicking header checkbox', async () => {
      const user = userEvent.setup()
      const { context } = renderDatagrid({ bulkActionButtons: true })

      const headerCheckbox = screen.getAllByRole('checkbox')[0]
      await user.click(headerCheckbox)

      expect(context.onSelect).toHaveBeenCalledWith([1, 2, 3])
    })

    it('should unselect all when clicking header checkbox while all selected', async () => {
      const user = userEvent.setup()
      const { context } = renderDatagrid(
        { bulkActionButtons: true },
        { selectedIds: [1, 2, 3] }
      )

      const headerCheckbox = screen.getAllByRole('checkbox')[0]
      await user.click(headerCheckbox)

      expect(context.onUnselectItems).toHaveBeenCalled()
    })

    it('should show indeterminate state when some rows selected', () => {
      renderDatagrid({ bulkActionButtons: true }, { selectedIds: [1] })

      const headerCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement
      // Indeterminate state is set via ref, check aria attribute or class
      expect(headerCheckbox).toHaveProperty('indeterminate', true)
    })
  })

  describe('Row click handling', () => {
    it('should call rowClick handler when clicking a row', async () => {
      const user = userEvent.setup()
      const onRowClick = vi.fn()
      renderDatagrid({ rowClick: onRowClick })

      const rows = screen.getAllByRole('row')
      // Click first data row (index 1)
      await user.click(rows[1])

      expect(onRowClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: 'John Doe' }),
        1,
        expect.any(Object) // event
      )
    })

    it('should support rowClick="edit" for navigation', async () => {
      const user = userEvent.setup()
      const { context } = renderDatagrid({ rowClick: 'edit' })

      const rows = screen.getAllByRole('row')
      await user.click(rows[1])

      // Should have cursor pointer style indicating clickable
      expect(rows[1]).toHaveStyle({ cursor: 'pointer' })
    })

    it('should support rowClick="show" for navigation', async () => {
      renderDatagrid({ rowClick: 'show' })

      const rows = screen.getAllByRole('row')
      expect(rows[1]).toHaveStyle({ cursor: 'pointer' })
    })

    it('should not make rows clickable when rowClick is false', () => {
      renderDatagrid({ rowClick: false })

      const rows = screen.getAllByRole('row')
      // Default cursor, not pointer
      expect(rows[1]).not.toHaveStyle({ cursor: 'pointer' })
    })

    it('should support rowClick as a function returning a path', async () => {
      const user = userEvent.setup()
      const rowClick = vi.fn((record: TestRecord) => `/users/${record.id}`)
      renderDatagrid({ rowClick })

      const rows = screen.getAllByRole('row')
      await user.click(rows[1])

      expect(rowClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
        1,
        expect.any(Object)
      )
    })
  })

  describe('Empty state', () => {
    it('should render empty message when data is empty', () => {
      renderDatagrid({}, { data: [], total: 0 })
      expect(screen.getByText(/no data available/i)).toBeInTheDocument()
    })

    it('should support custom empty component', () => {
      const CustomEmpty = () => <div data-testid="custom-empty">Nothing here!</div>
      renderDatagrid({ empty: <CustomEmpty /> }, { data: [], total: 0 })
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument()
    })

    it('should still render table headers in empty state', () => {
      renderDatagrid({}, { data: [], total: 0 })
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('should render loading indicator when isLoading is true', () => {
      renderDatagrid({}, { isLoading: true, data: undefined })
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should support custom loading component', () => {
      const CustomLoading = () => <div data-testid="custom-loading">Loading...</div>
      renderDatagrid(
        { loading: <CustomLoading /> },
        { isLoading: true, data: undefined }
      )
      expect(screen.getByTestId('custom-loading')).toBeInTheDocument()
    })

    it('should show skeleton rows when loading', () => {
      renderDatagrid({}, { isLoading: true, data: undefined })
      // Should show placeholder skeleton rows
      const skeletonRows = screen.getAllByTestId('skeleton-row')
      expect(skeletonRows.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have proper table structure with thead and tbody', () => {
      renderDatagrid()
      const table = screen.getByRole('table')
      expect(table.querySelector('thead')).toBeInTheDocument()
      expect(table.querySelector('tbody')).toBeInTheDocument()
    })

    it('should use th elements for headers', () => {
      renderDatagrid()
      const headers = screen.getAllByRole('columnheader')
      headers.forEach((header) => {
        expect(header.tagName).toBe('TH')
      })
    })

    it('should have scope="col" on header cells', () => {
      renderDatagrid()
      const headers = screen.getAllByRole('columnheader')
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope', 'col')
      })
    })
  })

  describe('Styling', () => {
    it('should apply custom className to table', () => {
      renderDatagrid({ className: 'custom-table' })
      const table = screen.getByRole('table')
      expect(table).toHaveClass('custom-table')
    })

    it('should apply rowStyle function to rows', () => {
      renderDatagrid({
        rowStyle: (record) => ({
          backgroundColor: record.status === 'active' ? 'rgb(0, 128, 0)' : 'rgb(255, 0, 0)',
        }),
      })

      const rows = screen.getAllByRole('row')
      // First data row (John Doe, active) - index 1 after header row
      expect(rows[1]).toHaveStyle({ backgroundColor: 'rgb(0, 128, 0)' })
      // Second data row (Jane Smith, inactive) - index 2
      expect(rows[2]).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' })
    })

    it('should apply hover styles', () => {
      renderDatagrid({ hover: true })
      // The hover class should be present
      const rows = screen.getAllByRole('row')
      // Data rows should have hover class
      expect(rows[1].className).toMatch(/hover/i)
    })

    it('should apply size prop for density', () => {
      renderDatagrid({ size: 'sm' })
      const table = screen.getByRole('table')
      // Should have compact/small styling class
      expect(table.className).toMatch(/sm|small|compact/i)
    })
  })

  describe('Column configuration', () => {
    it('should support passing columns via props', () => {
      const context = createTestListContext()
      render(
        <ListContextProvider value={context}>
          <Datagrid
            columns={[
              { source: 'name', label: 'Full Name' },
              { source: 'email', label: 'Email Address' },
            ]}
          />
        </ListContextProvider>
      )

      expect(screen.getByRole('columnheader', { name: /full name/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /email address/i })).toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('should throw when used outside ListContextProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <Datagrid>
            <TextField source="name" />
          </Datagrid>
        )
      }).toThrow(/ListContextProvider/i)

      consoleSpy.mockRestore()
    })
  })

  describe('Expandable rows', () => {
    it('should render expand toggle when expand prop is provided', () => {
      const ExpandPanel = () => <div data-testid="expand-panel">Expanded content</div>
      renderDatagrid({ expand: <ExpandPanel /> })

      // Should have expand toggle buttons for each row
      const expandButtons = screen.getAllByRole('button', { name: /expand/i })
      expect(expandButtons).toHaveLength(3) // One per data row
    })

    it('should not render expand toggle by default', () => {
      renderDatagrid()

      const expandButtons = screen.queryAllByRole('button', { name: /expand/i })
      expect(expandButtons).toHaveLength(0)
    })

    it('should show expanded content when clicking expand toggle', async () => {
      const user = userEvent.setup()
      const ExpandPanel = () => <div data-testid="expand-panel">Expanded content</div>
      renderDatagrid({ expand: <ExpandPanel /> })

      // Click expand on first row
      const expandButtons = screen.getAllByRole('button', { name: /expand/i })
      await user.click(expandButtons[0])

      expect(screen.getByTestId('expand-panel')).toBeInTheDocument()
    })

    it('should hide expanded content when clicking expand toggle again', async () => {
      const user = userEvent.setup()
      const ExpandPanel = () => <div data-testid="expand-panel">Expanded content</div>
      renderDatagrid({ expand: <ExpandPanel /> })

      const expandButtons = screen.getAllByRole('button', { name: /expand/i })

      // Expand
      await user.click(expandButtons[0])
      expect(screen.getByTestId('expand-panel')).toBeInTheDocument()

      // Collapse
      await user.click(expandButtons[0])
      expect(screen.queryByTestId('expand-panel')).not.toBeInTheDocument()
    })

    it('should provide RecordContext to expanded content', async () => {
      const user = userEvent.setup()
      const ExpandPanel = () => {
        const record = useRecordContext<TestRecord>()
        return <div data-testid="expand-panel">{record?.email}</div>
      }
      renderDatagrid({ expand: <ExpandPanel /> })

      const expandButtons = screen.getAllByRole('button', { name: /expand/i })
      await user.click(expandButtons[0])

      expect(screen.getByTestId('expand-panel')).toHaveTextContent('john@example.com')
    })

    it('should support expanding multiple rows', async () => {
      const user = userEvent.setup()
      const ExpandPanel = () => {
        const record = useRecordContext<TestRecord>()
        return <div data-testid={`expand-panel-${record?.id}`}>Content for {record?.name}</div>
      }
      renderDatagrid({ expand: <ExpandPanel /> })

      const expandButtons = screen.getAllByRole('button', { name: /expand/i })

      // Expand first row
      await user.click(expandButtons[0])
      // Expand second row
      await user.click(expandButtons[1])

      expect(screen.getByTestId('expand-panel-1')).toBeInTheDocument()
      expect(screen.getByTestId('expand-panel-2')).toBeInTheDocument()
    })

    it('should render expanded row with colspan covering all columns', async () => {
      const user = userEvent.setup()
      const ExpandPanel = () => <div data-testid="expand-panel">Expanded content</div>
      renderDatagrid({ expand: <ExpandPanel /> })

      const expandButtons = screen.getAllByRole('button', { name: /expand/i })
      await user.click(expandButtons[0])

      // Find the expanded row's cell - it should span all columns
      const expandedCell = screen.getByTestId('expand-panel').closest('td')
      // 3 data columns + 1 expand column = 4
      expect(expandedCell).toHaveAttribute('colspan', '4')
    })

    it('should add expand column at the beginning of the table', () => {
      const ExpandPanel = () => <div>Expanded</div>
      renderDatagrid({ expand: <ExpandPanel /> })

      const headers = screen.getAllByRole('columnheader')
      // First column should be empty (expand column)
      expect(headers[0]).toHaveTextContent('')
    })

    it('should toggle aria-expanded attribute on expand button', async () => {
      const user = userEvent.setup()
      const ExpandPanel = () => <div>Expanded</div>
      renderDatagrid({ expand: <ExpandPanel /> })

      const expandButtons = screen.getAllByRole('button', { name: /expand/i })

      // Initially not expanded
      expect(expandButtons[0]).toHaveAttribute('aria-expanded', 'false')

      // Click to expand
      await user.click(expandButtons[0])
      expect(expandButtons[0]).toHaveAttribute('aria-expanded', 'true')

      // Click to collapse
      await user.click(expandButtons[0])
      expect(expandButtons[0]).toHaveAttribute('aria-expanded', 'false')
    })

    it('should support expand as a function for conditional expansion', async () => {
      const user = userEvent.setup()
      const ExpandPanel = () => {
        const record = useRecordContext<TestRecord>()
        return <div data-testid="expand-panel">{record?.name}</div>
      }
      // Only allow expansion for active users
      renderDatagrid({
        expand: <ExpandPanel />,
        isRowExpandable: (record: TestRecord) => record.status === 'active',
      })

      const rows = screen.getAllByRole('row')
      // Row 1 (John Doe - active) - should have expand button
      // Row 2 (Jane Smith - inactive) - should not have expand button
      // Row 3 (Bob Johnson - active) - should have expand button

      const expandButtons = screen.getAllByRole('button', { name: /expand/i })
      // Should only have 2 expand buttons (for active users)
      expect(expandButtons).toHaveLength(2)
    })
  })
})
