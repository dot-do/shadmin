import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { UrlField } from './UrlField'
import { RecordContextProvider } from '../../contexts/RecordContext'

describe('UrlField', () => {
  describe('rendering value from record', () => {
    it('should render the URL as a clickable link', () => {
      const record = { id: 1, website: 'https://example.com.ai' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://example.com.ai')
      expect(link).toHaveTextContent('https://example.com.ai')
    })

    it('should support nested field access using dot notation', () => {
      const record = { id: 1, social: { twitter: 'https://twitter.com/user' } }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="social.twitter" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://twitter.com/user')
    })
  })

  describe('link behavior', () => {
    it('should open in new tab by default', () => {
      const record = { id: 1, website: 'https://example.com.ai' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should allow disabling new tab behavior', () => {
      const record = { id: 1, website: 'https://example.com.ai' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" target="_self" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('target', '_self')
    })

    it('should allow custom rel attribute', () => {
      const record = { id: 1, website: 'https://example.com.ai' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" rel="nofollow" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('rel', 'nofollow')
    })
  })

  describe('using RecordContext', () => {
    it('should get record from RecordContext when not provided as prop', () => {
      const record = { id: 1, url: 'https://test.com' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="url" />
        </RecordContextProvider>
      )

      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://test.com')
    })

    it('should prefer record prop over RecordContext', () => {
      const contextRecord = { id: 1, url: 'https://context.com' }
      const propRecord = { id: 2, url: 'https://prop.com' }

      render(
        <RecordContextProvider value={contextRecord}>
          <UrlField source="url" record={propRecord} />
        </RecordContextProvider>
      )

      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://prop.com')
    })
  })

  describe('className support', () => {
    it('should apply className to the anchor element', () => {
      const record = { id: 1, website: 'https://example.com.ai' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" className="custom-link text-blue-500" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-link', 'text-blue-500')
    })

    it('should render as an anchor element', () => {
      const record = { id: 1, website: 'https://example.com.ai' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link.tagName.toLowerCase()).toBe('a')
    })
  })

  describe('handling missing/null values', () => {
    it('should render nothing when field is null', () => {
      const record = { id: 1, website: null }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" data-testid="url-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('url-field')
      expect(element.textContent).toBe('')
      expect(element.querySelector('a')).toBeNull()
    })

    it('should render nothing when field is undefined', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" data-testid="url-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('url-field')
      expect(element.textContent).toBe('')
    })

    it('should render custom emptyText when value is missing', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" emptyText="No URL" />
        </RecordContextProvider>
      )

      expect(screen.getByText('No URL')).toBeInTheDocument()
    })

    it('should render nothing when field is empty string', () => {
      const record = { id: 1, website: '' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" data-testid="url-field" />
        </RecordContextProvider>
      )

      // The wrapper element contains the ra-field structure but the inner span is empty
      const element = screen.getByTestId('url-field')
      expect(element.textContent).toBe('')
    })
  })

  describe('label support', () => {
    it('should render label when provided', () => {
      const record = { id: 1, website: 'https://example.com.ai' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" label="Website" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Website')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveTextContent('https://example.com.ai')
    })
  })

  describe('custom display text', () => {
    it('should use custom text when provided', () => {
      const record = { id: 1, website: 'https://example.com.ai/very/long/path/to/page' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" text="Visit Site" />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveTextContent('Visit Site')
      expect(link).toHaveAttribute('href', 'https://example.com.ai/very/long/path/to/page')
    })

    it('should truncate URL when truncateUrl is true', () => {
      const record = { id: 1, website: 'https://example.com.ai/very/long/path/to/page' }

      render(
        <RecordContextProvider value={record}>
          <UrlField source="website" truncateUrl />
        </RecordContextProvider>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveTextContent('example.com.ai')
      expect(link).toHaveAttribute('href', 'https://example.com.ai/very/long/path/to/page')
    })
  })
})
