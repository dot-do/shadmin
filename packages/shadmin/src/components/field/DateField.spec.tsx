import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { DateField } from './DateField'
import { RecordContextProvider } from '../../contexts/RecordContext'

describe('DateField', () => {
  describe('rendering value from record', () => {
    it('should render the date value from record field via source prop', () => {
      // Use ISO format with time to avoid timezone issues
      const record = { id: 1, createdAt: '2024-01-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField source="createdAt" />
        </RecordContextProvider>
      )

      // Default locale formatting - just check the year is present
      expect(screen.getByText(/2024/)).toBeInTheDocument()
    })

    it('should support nested field access using dot notation', () => {
      const record = { id: 1, metadata: { publishedAt: '2024-06-20T12:00:00' } }

      render(
        <RecordContextProvider value={record}>
          <DateField source="metadata.publishedAt" />
        </RecordContextProvider>
      )

      expect(screen.getByText(/2024/)).toBeInTheDocument()
    })
  })

  describe('date formatting', () => {
    it('should format date with Intl.DateTimeFormat', () => {
      // Use noon local time to avoid timezone issues
      const record = { id: 1, date: '2024-03-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" locales="en-US" />
        </RecordContextProvider>
      )

      // US format: month/day/year
      expect(screen.getByText('3/15/2024')).toBeInTheDocument()
    })

    it('should support Date objects', () => {
      // Create a date at noon local time
      const date = new Date(2024, 2, 15, 12, 0, 0) // March 15, 2024 at noon
      const record = { id: 1, date }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" locales="en-US" />
        </RecordContextProvider>
      )

      expect(screen.getByText('3/15/2024')).toBeInTheDocument()
    })

    it('should support ISO date strings with timezone', () => {
      const record = { id: 1, date: '2024-03-15T14:30:00.000Z' }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" locales="en-US" />
        </RecordContextProvider>
      )

      // Could be 3/15 or 3/14 depending on timezone
      expect(screen.getByText(/3\/1[45]\/2024/)).toBeInTheDocument()
    })

    it('should support timestamp numbers', () => {
      // Create timestamp for a specific local date
      const date = new Date(2024, 2, 15, 12, 0, 0).getTime()
      const record = { id: 1, date }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" locales="en-US" />
        </RecordContextProvider>
      )

      expect(screen.getByText('3/15/2024')).toBeInTheDocument()
    })

    it('should support custom locale', () => {
      const record = { id: 1, date: '2024-03-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" locales="de-DE" />
        </RecordContextProvider>
      )

      // German format: day.month.year
      expect(screen.getByText('15.3.2024')).toBeInTheDocument()
    })

    it('should support Intl.DateTimeFormat options', () => {
      const record = { id: 1, date: '2024-03-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField
            source="date"
            locales="en-US"
            options={{ year: 'numeric', month: 'long', day: 'numeric' }}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('March 15, 2024')).toBeInTheDocument()
    })

    it('should support short date format', () => {
      const record = { id: 1, date: '2024-03-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField
            source="date"
            locales="en-US"
            options={{ dateStyle: 'short' }}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('3/15/24')).toBeInTheDocument()
    })

    it('should support medium date format', () => {
      const record = { id: 1, date: '2024-03-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField
            source="date"
            locales="en-US"
            options={{ dateStyle: 'medium' }}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('Mar 15, 2024')).toBeInTheDocument()
    })

    it('should support long date format', () => {
      const record = { id: 1, date: '2024-03-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField
            source="date"
            locales="en-US"
            options={{ dateStyle: 'long' }}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('March 15, 2024')).toBeInTheDocument()
    })

    it('should show time when showTime is true', () => {
      const record = { id: 1, date: '2024-03-15T14:30:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" locales="en-US" showTime data-testid="date-field" />
        </RecordContextProvider>
      )

      // Should include time portion
      const element = screen.getByTestId('date-field')
      expect(element.textContent).toMatch(/\d{1,2}:\d{2}/)
    })
  })

  describe('using RecordContext', () => {
    it('should get record from RecordContext when not provided as prop', () => {
      const record = { id: 1, date: '2024-01-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" locales="en-US" />
        </RecordContextProvider>
      )

      expect(screen.getByText('1/15/2024')).toBeInTheDocument()
    })

    it('should prefer record prop over RecordContext', () => {
      const contextRecord = { id: 1, date: '2024-01-15T12:00:00' }
      const propRecord = { id: 2, date: '2024-12-31T12:00:00' }

      render(
        <RecordContextProvider value={contextRecord}>
          <DateField source="date" locales="en-US" record={propRecord} />
        </RecordContextProvider>
      )

      expect(screen.getByText('12/31/2024')).toBeInTheDocument()
    })
  })

  describe('className support', () => {
    it('should apply className for styling', () => {
      const record = { id: 1, date: '2024-03-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" locales="en-US" className="custom-class text-green-500" data-testid="date-field" />
        </RecordContextProvider>
      )

      // className is applied to the wrapper element, not the text element
      const wrapper = screen.getByTestId('date-field')
      expect(wrapper).toHaveClass('custom-class', 'text-green-500')
    })

    it('should render as a span element', () => {
      const record = { id: 1, date: '2024-03-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" data-testid="date-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('date-field')
      expect(element.tagName.toLowerCase()).toBe('span')
    })
  })

  describe('handling missing/null values', () => {
    it('should render empty string when field is null', () => {
      const record = { id: 1, date: null }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" data-testid="date-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('date-field')
      expect(element.textContent).toBe('')
    })

    it('should render empty string when field is undefined', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" data-testid="date-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('date-field')
      expect(element.textContent).toBe('')
    })

    it('should render custom emptyText when value is missing', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" emptyText="No date" />
        </RecordContextProvider>
      )

      expect(screen.getByText('No date')).toBeInTheDocument()
    })

    it('should render empty string for invalid date string', () => {
      const record = { id: 1, date: 'not a date' }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" data-testid="date-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('date-field')
      expect(element.textContent).toBe('')
    })
  })

  describe('label support', () => {
    it('should render label when provided', () => {
      const record = { id: 1, date: '2024-03-15T12:00:00' }

      render(
        <RecordContextProvider value={record}>
          <DateField source="date" locales="en-US" label="Created At" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Created At')).toBeInTheDocument()
      expect(screen.getByText('3/15/2024')).toBeInTheDocument()
    })
  })
})
