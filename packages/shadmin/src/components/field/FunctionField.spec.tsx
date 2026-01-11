import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { FunctionField } from './FunctionField'

describe('FunctionField', () => {
  describe('rendering custom content via render prop', () => {
    it('should render content returned by render function', () => {
      const record = { id: 1, firstName: 'John', lastName: 'Doe' }

      render(
        <RecordContextProvider value={record}>
          <FunctionField render={(r) => `${r?.firstName} ${r?.lastName}`} />
        </RecordContextProvider>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should render ReactNode content from render function', () => {
      const record = { id: 1, status: 'active' }

      render(
        <RecordContextProvider value={record}>
          <FunctionField
            render={(r) => (
              <span data-testid="status-badge" className="badge">
                {String(r?.status ?? '')}
              </span>
            )}
          />
        </RecordContextProvider>
      )

      const badge = screen.getByTestId('status-badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveTextContent('active')
      expect(badge).toHaveClass('badge')
    })

    it('should support complex render logic', () => {
      const record = { id: 1, price: 100, discount: 20 }

      render(
        <RecordContextProvider value={record}>
          <FunctionField
            render={(r) => {
              const price = (r?.price as number) ?? 0
              const discount = (r?.discount as number) ?? 0
              return `$${price - discount}`
            }}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('$80')).toBeInTheDocument()
    })
  })

  describe('passing record to render function', () => {
    it('should pass the current record from context to render function', () => {
      const record = { id: 1, name: 'Test Record', value: 42 }

      render(
        <RecordContextProvider value={record}>
          <FunctionField
            render={(r) => `ID: ${r?.id}, Name: ${r?.name}, Value: ${r?.value}`}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('ID: 1, Name: Test Record, Value: 42')).toBeInTheDocument()
    })

    it('should prefer record prop over RecordContext', () => {
      const contextRecord = { id: 1, name: 'Context Record' }
      const propRecord = { id: 2, name: 'Prop Record' }

      render(
        <RecordContextProvider value={contextRecord}>
          <FunctionField record={propRecord} render={(r) => r?.name} />
        </RecordContextProvider>
      )

      expect(screen.getByText('Prop Record')).toBeInTheDocument()
    })

    it('should pass undefined record to render function when no context', () => {
      render(
        <RecordContextProvider value={undefined}>
          <FunctionField
            render={(r) => (r ? `Has record: ${r.id}` : 'No record')}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('No record')).toBeInTheDocument()
    })
  })

  describe('label support', () => {
    it('should render label when provided', () => {
      const record = { id: 1, firstName: 'John', lastName: 'Doe' }

      render(
        <RecordContextProvider value={record}>
          <FunctionField
            label="Full Name"
            render={(r) => `${r?.firstName} ${r?.lastName}`}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('Full Name')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should not render label when not provided', () => {
      const record = { id: 1, name: 'Test' }

      render(
        <RecordContextProvider value={record}>
          <FunctionField render={(r) => r?.name} data-testid="function-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('function-field')
      expect(element.textContent).toBe('Test')
    })

    it('should apply label styling consistent with other field components', () => {
      const record = { id: 1, value: 'Test' }

      render(
        <RecordContextProvider value={record}>
          <FunctionField label="Test Label" render={(r) => r?.value} />
        </RecordContextProvider>
      )

      const label = screen.getByText('Test Label')
      expect(label).toHaveClass('text-sm', 'font-medium', 'text-muted-foreground')
    })
  })

  describe('empty handling', () => {
    it('should render emptyText when render returns null', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <FunctionField render={() => null} emptyText="No value" />
        </RecordContextProvider>
      )

      expect(screen.getByText('No value')).toBeInTheDocument()
    })

    it('should render emptyText when render returns undefined', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <FunctionField render={() => undefined} emptyText="N/A" />
        </RecordContextProvider>
      )

      expect(screen.getByText('N/A')).toBeInTheDocument()
    })

    it('should render emptyText when render returns empty string', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <FunctionField render={() => ''} emptyText="Empty" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Empty')).toBeInTheDocument()
    })

    it('should render empty when no emptyText and render returns null', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <FunctionField render={() => null} data-testid="function-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('function-field')
      expect(element).toBeEmptyDOMElement()
    })

    it('should not use emptyText when render returns valid content', () => {
      const record = { id: 1, name: 'Valid' }

      render(
        <RecordContextProvider value={record}>
          <FunctionField render={(r) => r?.name} emptyText="N/A" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Valid')).toBeInTheDocument()
      expect(screen.queryByText('N/A')).not.toBeInTheDocument()
    })

    it('should render 0 as valid content not empty', () => {
      const record = { id: 1, count: 0 }

      render(
        <RecordContextProvider value={record}>
          <FunctionField render={(r) => r?.count} emptyText="N/A" />
        </RecordContextProvider>
      )

      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.queryByText('N/A')).not.toBeInTheDocument()
    })

    it('should render false as valid content not empty', () => {
      const record = { id: 1, active: false }

      render(
        <RecordContextProvider value={record}>
          <FunctionField render={(r) => String(r?.active)} emptyText="N/A" />
        </RecordContextProvider>
      )

      expect(screen.getByText('false')).toBeInTheDocument()
      expect(screen.queryByText('N/A')).not.toBeInTheDocument()
    })
  })

  describe('className support', () => {
    it('should apply className for styling', () => {
      const record = { id: 1, name: 'Test' }

      render(
        <RecordContextProvider value={record}>
          <FunctionField
            render={(r) => r?.name}
            className="custom-class text-blue-500"
          />
        </RecordContextProvider>
      )

      const element = screen.getByText('Test')
      expect(element).toHaveClass('custom-class', 'text-blue-500')
    })

    it('should render as a span element by default', () => {
      const record = { id: 1, name: 'Test' }

      render(
        <RecordContextProvider value={record}>
          <FunctionField render={(r) => r?.name} data-testid="function-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('function-field')
      expect(element.tagName.toLowerCase()).toBe('span')
    })
  })
})
