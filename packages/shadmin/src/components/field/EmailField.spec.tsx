import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecordContextProvider } from '../../contexts/RecordContext'
import { EmailField } from './EmailField'

describe('EmailField', () => {
  describe('rendering value from record', () => {
    it('should render the email as a mailto link', () => {
      const record = { id: 1, email: 'john@example.com' }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'mailto:john@example.com')
      expect(link).toHaveTextContent('john@example.com')
    })

    it('should support nested field access using dot notation', () => {
      const record = { id: 1, contact: { email: 'jane@example.com' } }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="contact.email" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'mailto:jane@example.com')
    })
  })

  describe('using RecordContext', () => {
    it('should get record from RecordContext when not provided as prop', () => {
      const record = { id: 1, email: 'test@example.com' }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" />
        </RecordContextProvider>
      )

      expect(screen.getByRole('link')).toHaveAttribute('href', 'mailto:test@example.com')
    })

    it('should prefer record prop over RecordContext', () => {
      const contextRecord = { id: 1, email: 'context@example.com' }
      const propRecord = { id: 2, email: 'prop@example.com' }

      render(
        <RecordContextProvider value={contextRecord}>
          <EmailField source="email" record={propRecord} />
        </RecordContextProvider>
      )

      expect(screen.getByRole('link')).toHaveAttribute('href', 'mailto:prop@example.com')
    })
  })

  describe('className support', () => {
    it('should apply className to the anchor element', () => {
      const record = { id: 1, email: 'test@example.com' }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" className="custom-link text-blue-500" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-link', 'text-blue-500')
    })

    it('should render as an anchor element', () => {
      const record = { id: 1, email: 'test@example.com' }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link.tagName.toLowerCase()).toBe('a')
    })
  })

  describe('handling missing/null values', () => {
    it('should render nothing when field is null', () => {
      const record = { id: 1, email: null }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" data-testid="email-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('email-field')
      expect(element.textContent).toBe('')
      expect(element.querySelector('a')).toBeNull()
    })

    it('should render nothing when field is undefined', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" data-testid="email-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('email-field')
      expect(element.textContent).toBe('')
    })

    it('should render custom emptyText when value is missing', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" emptyText="No email" />
        </RecordContextProvider>
      )

      expect(screen.getByText('No email')).toBeInTheDocument()
    })

    it('should render nothing when field is empty string', () => {
      const record = { id: 1, email: '' }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" data-testid="email-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('email-field')
      expect(element.textContent).toBe('')
    })
  })

  describe('label support', () => {
    it('should render label when provided', () => {
      const record = { id: 1, email: 'test@example.com' }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" label="Email Address" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Email Address')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveTextContent('test@example.com')
    })
  })

  describe('link behavior', () => {
    it('should open in default tab by default', () => {
      const record = { id: 1, email: 'test@example.com' }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).not.toHaveAttribute('target')
    })

    it('should pass through additional anchor attributes', () => {
      const record = { id: 1, email: 'test@example.com' }

      render(
        <RecordContextProvider value={record}>
          <EmailField source="email" title="Send email" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('title', 'Send email')
    })
  })
})
