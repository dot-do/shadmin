import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { TextField } from './TextField'

describe('TextField', () => {
  describe('rendering value from record', () => {
    it('should render the value from record field via source prop', () => {
      const record = { id: 1, name: 'John Doe' }

      render(
        <RecordContextProvider value={record}>
          <TextField source="name" />
        </RecordContextProvider>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should support nested field access using dot notation', () => {
      const record = { id: 1, author: { name: 'Jane Smith' } }

      render(
        <RecordContextProvider value={record}>
          <TextField source="author.name" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('should support deeply nested field access', () => {
      const record = { id: 1, data: { user: { profile: { displayName: 'Deep Value' } } } }

      render(
        <RecordContextProvider value={record}>
          <TextField source="data.user.profile.displayName" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Deep Value')).toBeInTheDocument()
    })
  })

  describe('using RecordContext', () => {
    it('should get record from RecordContext when not provided as prop', () => {
      const record = { id: 1, title: 'From Context' }

      render(
        <RecordContextProvider value={record}>
          <TextField source="title" />
        </RecordContextProvider>
      )

      expect(screen.getByText('From Context')).toBeInTheDocument()
    })

    it('should prefer record prop over RecordContext', () => {
      const contextRecord = { id: 1, name: 'Context Record' }
      const propRecord = { id: 2, name: 'Prop Record' }

      render(
        <RecordContextProvider value={contextRecord}>
          <TextField source="name" record={propRecord} />
        </RecordContextProvider>
      )

      expect(screen.getByText('Prop Record')).toBeInTheDocument()
    })
  })

  describe('className support', () => {
    it('should apply className for styling', () => {
      const record = { id: 1, name: 'Test' }

      render(
        <RecordContextProvider value={record}>
          <TextField source="name" className="custom-class text-red-500" />
        </RecordContextProvider>
      )

      const element = screen.getByText('Test')
      expect(element).toHaveClass('custom-class', 'text-red-500')
    })

    it('should render as a span element', () => {
      const record = { id: 1, name: 'Test' }

      render(
        <RecordContextProvider value={record}>
          <TextField source="name" data-testid="text-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('text-field')
      expect(element.tagName.toLowerCase()).toBe('span')
    })
  })

  describe('handling missing/null values', () => {
    it('should render empty string when field is null', () => {
      const record = { id: 1, name: null }

      render(
        <RecordContextProvider value={record}>
          <TextField source="name" data-testid="text-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('text-field')
      expect(element).toBeEmptyDOMElement()
    })

    it('should render empty string when field is undefined', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <TextField source="name" data-testid="text-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('text-field')
      expect(element).toBeEmptyDOMElement()
    })

    it('should render empty string when source path does not exist', () => {
      const record = { id: 1, name: 'John' }

      render(
        <RecordContextProvider value={record}>
          <TextField source="nonexistent.path" data-testid="text-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('text-field')
      expect(element).toBeEmptyDOMElement()
    })

    it('should render empty string when record is undefined', () => {
      render(
        <RecordContextProvider value={undefined}>
          <TextField source="name" data-testid="text-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('text-field')
      expect(element).toBeEmptyDOMElement()
    })

    it('should render custom emptyText when value is missing', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <TextField source="name" emptyText="N/A" />
        </RecordContextProvider>
      )

      expect(screen.getByText('N/A')).toBeInTheDocument()
    })
  })

  describe('label support', () => {
    it('should render label when provided', () => {
      const record = { id: 1, name: 'John' }

      render(
        <RecordContextProvider value={record}>
          <TextField source="name" label="Name" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('John')).toBeInTheDocument()
    })

    it('should not render label when not provided', () => {
      const record = { id: 1, name: 'John' }

      render(
        <RecordContextProvider value={record}>
          <TextField source="name" data-testid="text-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('text-field')
      expect(element.textContent).toBe('John')
    })
  })

  describe('type coercion', () => {
    it('should convert number to string', () => {
      const record = { id: 1, count: 42 }

      render(
        <RecordContextProvider value={record}>
          <TextField source="count" />
        </RecordContextProvider>
      )

      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should convert boolean to string', () => {
      const record = { id: 1, active: true }

      render(
        <RecordContextProvider value={record}>
          <TextField source="active" />
        </RecordContextProvider>
      )

      expect(screen.getByText('true')).toBeInTheDocument()
    })
  })
})
