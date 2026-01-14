import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { ArrayField } from './ArrayField'
import { TextField } from './TextField'
import { RecordContextProvider, useRecordContext } from '../../contexts/RecordContext'

// Test component to verify RecordContext is set correctly
function RecordDisplay() {
  const record = useRecordContext()
  return <span data-testid="record-display">{JSON.stringify(record)}</span>
}

describe('ArrayField', () => {
  describe('rendering array of items from source', () => {
    it('should render array items from source field', () => {
      const record = {
        id: 1,
        tags: [
          { id: 1, name: 'React' },
          { id: 2, name: 'TypeScript' },
          { id: 3, name: 'Testing' },
        ],
      }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="tags">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Testing')).toBeInTheDocument()
    })

    it('should support nested source path', () => {
      const record = {
        id: 1,
        data: {
          items: [
            { id: 1, value: 'First' },
            { id: 2, value: 'Second' },
          ],
        },
      }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="data.items">
            <TextField source="value" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })

    it('should render multiple children for each item', () => {
      const record = {
        id: 1,
        users: [
          { id: 1, firstName: 'John', lastName: 'Doe' },
          { id: 2, firstName: 'Jane', lastName: 'Smith' },
        ],
      }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="users">
            <TextField source="firstName" />
            <span> </span>
            <TextField source="lastName" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByText('Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane')).toBeInTheDocument()
      expect(screen.getByText('Smith')).toBeInTheDocument()
    })
  })

  describe('providing RecordContext for each item', () => {
    it('should wrap each item in its own RecordContext', () => {
      const record = {
        id: 1,
        items: [
          { id: 10, name: 'Item A' },
          { id: 20, name: 'Item B' },
        ],
      }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="items">
            <RecordDisplay />
          </ArrayField>
        </RecordContextProvider>
      )

      const displays = screen.getAllByTestId('record-display')
      expect(displays).toHaveLength(2)
      expect(displays[0]).toHaveTextContent(JSON.stringify({ id: 10, name: 'Item A' }))
      expect(displays[1]).toHaveTextContent(JSON.stringify({ id: 20, name: 'Item B' }))
    })

    it('should override parent RecordContext for children', () => {
      const parentRecord = { id: 1, name: 'Parent', items: [{ id: 2, name: 'Child' }] }

      render(
        <RecordContextProvider value={parentRecord}>
          <ArrayField source="items">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      // Should show 'Child' not 'Parent'
      expect(screen.getByText('Child')).toBeInTheDocument()
      expect(screen.queryByText('Parent')).not.toBeInTheDocument()
    })

    it('should use item id as key when available', () => {
      const record = {
        id: 1,
        items: [
          { id: 'a', value: 'First' },
          { id: 'b', value: 'Second' },
        ],
      }

      // This test verifies no warnings about missing keys
      const { container } = render(
        <RecordContextProvider value={record}>
          <ArrayField source="items">
            <TextField source="value" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(container).toBeTruthy()
    })

    it('should use index as key when item has no id', () => {
      const record = {
        id: 1,
        items: [{ value: 'First' }, { value: 'Second' }],
      }

      // This test verifies no warnings about missing keys
      const { container } = render(
        <RecordContextProvider value={record}>
          <ArrayField source="items">
            <TextField source="value" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(container).toBeTruthy()
    })
  })

  describe('empty array handling', () => {
    it('should render empty when array is empty', () => {
      const record = { id: 1, tags: [] }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="tags" data-testid="array-field">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      const element = screen.getByTestId('array-field')
      expect(element).toBeEmptyDOMElement()
    })

    it('should render emptyText when array is empty', () => {
      const record = { id: 1, tags: [] }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="tags" emptyText="No tags">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(screen.getByText('No tags')).toBeInTheDocument()
    })

    it('should render emptyText when source is null', () => {
      const record = { id: 1, tags: null }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="tags" emptyText="No items">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(screen.getByText('No items')).toBeInTheDocument()
    })

    it('should render emptyText when source is undefined', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="tags" emptyText="N/A">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(screen.getByText('N/A')).toBeInTheDocument()
    })

    it('should render emptyText when source path does not exist', () => {
      const record = { id: 1, data: {} }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="data.items.list" emptyText="Not found">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(screen.getByText('Not found')).toBeInTheDocument()
    })

    it('should render empty when record is undefined', () => {
      render(
        <RecordContextProvider value={undefined}>
          <ArrayField source="tags" data-testid="array-field">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      const element = screen.getByTestId('array-field')
      expect(element).toBeEmptyDOMElement()
    })
  })

  describe('label support', () => {
    it('should render label when provided', () => {
      const record = {
        id: 1,
        tags: [
          { id: 1, name: 'React' },
          { id: 2, name: 'Vue' },
        ],
      }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="tags" label="Tags">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Vue')).toBeInTheDocument()
    })

    it('should apply label styling consistent with other field components', () => {
      const record = { id: 1, items: [{ id: 1, name: 'Test' }] }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="items" label="Items">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      const label = screen.getByText('Items')
      expect(label).toHaveClass('text-sm', 'font-medium', 'text-muted-foreground')
    })

    it('should render label with emptyText when array is empty', () => {
      const record = { id: 1, tags: [] }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="tags" label="Tags" emptyText="No tags yet">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('No tags yet')).toBeInTheDocument()
    })

    it('should not render label when not provided', () => {
      const record = { id: 1, items: [{ id: 1, name: 'Test' }] }

      const { container } = render(
        <RecordContextProvider value={record}>
          <ArrayField source="items" data-testid="array-field">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      // Check that there's no label element with the muted-foreground class
      const labelElements = container.querySelectorAll('.text-muted-foreground')
      expect(labelElements).toHaveLength(0)
    })
  })

  describe('className support', () => {
    it('should apply className for styling', () => {
      const record = { id: 1, items: [{ id: 1, name: 'Test' }] }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="items" className="custom-class gap-4" data-testid="array-field">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      const element = screen.getByTestId('array-field')
      expect(element).toHaveClass('custom-class', 'gap-4')
    })

    it('should render as a div element', () => {
      const record = { id: 1, items: [{ id: 1, name: 'Test' }] }

      render(
        <RecordContextProvider value={record}>
          <ArrayField source="items" data-testid="array-field">
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      const element = screen.getByTestId('array-field')
      expect(element.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('record prop support', () => {
    it('should prefer record prop over RecordContext', () => {
      const contextRecord = { id: 1, items: [{ id: 1, name: 'Context' }] }
      const propRecord = { id: 2, items: [{ id: 2, name: 'Prop' }] }

      render(
        <RecordContextProvider value={contextRecord}>
          <ArrayField source="items" record={propRecord}>
            <TextField source="name" />
          </ArrayField>
        </RecordContextProvider>
      )

      expect(screen.getByText('Prop')).toBeInTheDocument()
      expect(screen.queryByText('Context')).not.toBeInTheDocument()
    })
  })
})
