import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { NumberField } from './NumberField'

describe('NumberField', () => {
  describe('rendering value from record', () => {
    it('should render the number value from record field via source prop', () => {
      const record = { id: 1, count: 42 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="count" />
        </RecordContextProvider>
      )

      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should support nested field access using dot notation', () => {
      const record = { id: 1, stats: { views: 1234 } }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="stats.views" />
        </RecordContextProvider>
      )

      expect(screen.getByText('1,234')).toBeInTheDocument()
    })
  })

  describe('number formatting', () => {
    it('should format numbers with thousand separators by default', () => {
      const record = { id: 1, amount: 1234567 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="amount" />
        </RecordContextProvider>
      )

      expect(screen.getByText('1,234,567')).toBeInTheDocument()
    })

    it('should format decimal numbers', () => {
      const record = { id: 1, price: 1234.56 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="price" />
        </RecordContextProvider>
      )

      expect(screen.getByText('1,234.56')).toBeInTheDocument()
    })

    it('should support custom locale', () => {
      const record = { id: 1, price: 1234.56 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="price" locales="de-DE" />
        </RecordContextProvider>
      )

      // German uses comma as decimal separator and period as thousand separator
      expect(screen.getByText('1.234,56')).toBeInTheDocument()
    })

    it('should support Intl.NumberFormat options', () => {
      const record = { id: 1, price: 1234.5 }

      render(
        <RecordContextProvider value={record}>
          <NumberField
            source="price"
            options={{ style: 'currency', currency: 'USD' }}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('$1,234.50')).toBeInTheDocument()
    })

    it('should support minimumFractionDigits option', () => {
      const record = { id: 1, value: 42 }

      render(
        <RecordContextProvider value={record}>
          <NumberField
            source="value"
            options={{ minimumFractionDigits: 2 }}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('42.00')).toBeInTheDocument()
    })

    it('should support maximumFractionDigits option', () => {
      const record = { id: 1, value: 42.12345 }

      render(
        <RecordContextProvider value={record}>
          <NumberField
            source="value"
            options={{ maximumFractionDigits: 2 }}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('42.12')).toBeInTheDocument()
    })

    it('should support percentage style', () => {
      const record = { id: 1, rate: 0.25 }

      render(
        <RecordContextProvider value={record}>
          <NumberField
            source="rate"
            options={{ style: 'percent' }}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('25%')).toBeInTheDocument()
    })
  })

  describe('using RecordContext', () => {
    it('should get record from RecordContext when not provided as prop', () => {
      const record = { id: 1, quantity: 500 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="quantity" />
        </RecordContextProvider>
      )

      expect(screen.getByText('500')).toBeInTheDocument()
    })

    it('should prefer record prop over RecordContext', () => {
      const contextRecord = { id: 1, count: 100 }
      const propRecord = { id: 2, count: 200 }

      render(
        <RecordContextProvider value={contextRecord}>
          <NumberField source="count" record={propRecord} />
        </RecordContextProvider>
      )

      expect(screen.getByText('200')).toBeInTheDocument()
    })
  })

  describe('className support', () => {
    it('should apply className for styling', () => {
      const record = { id: 1, count: 42 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="count" className="custom-class text-blue-500" data-testid="number-field" />
        </RecordContextProvider>
      )

      // className is applied to the wrapper element
      const wrapper = screen.getByTestId('number-field')
      expect(wrapper).toHaveClass('custom-class', 'text-blue-500')
    })

    it('should render as a span element', () => {
      const record = { id: 1, count: 42 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="count" data-testid="number-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('number-field')
      expect(element.tagName.toLowerCase()).toBe('span')
    })
  })

  describe('handling missing/null values', () => {
    it('should render empty string when field is null', () => {
      const record = { id: 1, count: null }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="count" data-testid="number-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('number-field')
      expect(element.textContent).toBe('')
    })

    it('should render empty string when field is undefined', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="count" data-testid="number-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('number-field')
      expect(element.textContent).toBe('')
    })

    it('should render custom emptyText when value is missing', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="count" emptyText="-" />
        </RecordContextProvider>
      )

      expect(screen.getByText('-')).toBeInTheDocument()
    })

    it('should render 0 when value is 0', () => {
      const record = { id: 1, count: 0 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="count" />
        </RecordContextProvider>
      )

      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('label support', () => {
    it('should render label when provided', () => {
      const record = { id: 1, count: 42 }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="count" label="Total Count" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Total Count')).toBeInTheDocument()
      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  describe('handling non-numeric values', () => {
    it('should render empty string for non-numeric string value', () => {
      const record = { id: 1, count: 'not a number' }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="count" data-testid="number-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('number-field')
      expect(element.textContent).toBe('')
    })

    it('should handle numeric strings', () => {
      const record = { id: 1, count: '1234' }

      render(
        <RecordContextProvider value={record}>
          <NumberField source="count" />
        </RecordContextProvider>
      )

      expect(screen.getByText('1,234')).toBeInTheDocument()
    })
  })
})
