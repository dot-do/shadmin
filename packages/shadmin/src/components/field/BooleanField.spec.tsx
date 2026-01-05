import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { BooleanField } from './BooleanField'

describe('BooleanField', () => {
  describe('rendering value from record', () => {
    it('should render checkmark icon when value is true', () => {
      const record = { id: 1, active: true }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      // Check for checkmark SVG (has aria-label or contains specific path)
      expect(element.querySelector('svg')).toBeInTheDocument()
      expect(element).toHaveAttribute('aria-label', 'true')
    })

    it('should render x icon when value is false', () => {
      const record = { id: 1, active: false }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element.querySelector('svg')).toBeInTheDocument()
      expect(element).toHaveAttribute('aria-label', 'false')
    })

    it('should support nested field access using dot notation', () => {
      const record = { id: 1, settings: { enabled: true } }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="settings.enabled" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toHaveAttribute('aria-label', 'true')
    })
  })

  describe('truthy/falsy values', () => {
    it('should treat 1 as true', () => {
      const record = { id: 1, value: 1 }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="value" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toHaveAttribute('aria-label', 'true')
    })

    it('should treat 0 as false', () => {
      const record = { id: 1, value: 0 }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="value" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toHaveAttribute('aria-label', 'false')
    })

    it('should treat "true" string as true', () => {
      const record = { id: 1, value: 'true' }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="value" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toHaveAttribute('aria-label', 'true')
    })

    it('should treat "false" string as false', () => {
      const record = { id: 1, value: 'false' }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="value" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toHaveAttribute('aria-label', 'false')
    })

    it('should treat non-empty string as true', () => {
      const record = { id: 1, value: 'yes' }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="value" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toHaveAttribute('aria-label', 'true')
    })

    it('should treat empty string as false', () => {
      const record = { id: 1, value: '' }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="value" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toHaveAttribute('aria-label', 'false')
    })
  })

  describe('using RecordContext', () => {
    it('should get record from RecordContext when not provided as prop', () => {
      const record = { id: 1, active: true }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toHaveAttribute('aria-label', 'true')
    })

    it('should prefer record prop over RecordContext', () => {
      const contextRecord = { id: 1, active: true }
      const propRecord = { id: 2, active: false }

      render(
        <RecordContextProvider value={contextRecord}>
          <BooleanField source="active" record={propRecord} data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toHaveAttribute('aria-label', 'false')
    })
  })

  describe('className support', () => {
    it('should apply className for styling', () => {
      const record = { id: 1, active: true }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" className="custom-class" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toHaveClass('custom-class')
    })

    it('should render as a span element', () => {
      const record = { id: 1, active: true }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element.tagName.toLowerCase()).toBe('span')
    })
  })

  describe('handling missing/null values', () => {
    it('should render nothing when field is null', () => {
      const record = { id: 1, active: null }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toBeEmptyDOMElement()
    })

    it('should render nothing when field is undefined', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('boolean-field')
      expect(element).toBeEmptyDOMElement()
    })

    it('should render custom valueLabelTrue when true', () => {
      const record = { id: 1, active: true }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" valueLabelTrue="Yes" valueLabelFalse="No" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Yes')).toBeInTheDocument()
    })

    it('should render custom valueLabelFalse when false', () => {
      const record = { id: 1, active: false }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" valueLabelTrue="Yes" valueLabelFalse="No" />
        </RecordContextProvider>
      )

      expect(screen.getByText('No')).toBeInTheDocument()
    })
  })

  describe('label support', () => {
    it('should render label when provided', () => {
      const record = { id: 1, active: true }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" label="Status" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Status')).toBeInTheDocument()
      const field = screen.getByTestId('boolean-field')
      expect(field.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('custom icon colors', () => {
    it('should apply trueIconColor class for true values', () => {
      const record = { id: 1, active: true }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" trueIconColor="text-green-500" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const svg = screen.getByTestId('boolean-field').querySelector('svg')
      expect(svg).toHaveClass('text-green-500')
    })

    it('should apply falseIconColor class for false values', () => {
      const record = { id: 1, active: false }

      render(
        <RecordContextProvider value={record}>
          <BooleanField source="active" falseIconColor="text-red-500" data-testid="boolean-field" />
        </RecordContextProvider>
      )

      const svg = screen.getByTestId('boolean-field').querySelector('svg')
      expect(svg).toHaveClass('text-red-500')
    })
  })
})
