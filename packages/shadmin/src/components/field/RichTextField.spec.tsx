import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RichTextField } from './RichTextField'
import { RecordContextProvider } from '../../contexts/RecordContext'

describe('RichTextField', () => {
  describe('Basic rendering', () => {
    it('should render HTML content from source field', () => {
      render(
        <RecordContextProvider value={{ id: 1, content: '<p>Hello <strong>World</strong></p>' }}>
          <RichTextField source="content" />
        </RecordContextProvider>
      )

      // The HTML should be rendered as actual elements
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('World')).toBeInTheDocument()
      expect(screen.getByRole('paragraph')).toBeInTheDocument()
    })

    it('should render plain text as-is', () => {
      render(
        <RecordContextProvider value={{ id: 1, content: 'Just plain text' }}>
          <RichTextField source="content" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Just plain text')).toBeInTheDocument()
    })

    it('should render nested HTML tags', () => {
      render(
        <RecordContextProvider value={{ id: 1, content: '<ul><li>Item 1</li><li>Item 2</li></ul>' }}>
          <RichTextField source="content" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByRole('list')).toBeInTheDocument()
    })
  })

  describe('Empty state', () => {
    it('should render empty text when value is null', () => {
      render(
        <RecordContextProvider value={{ id: 1, content: null }}>
          <RichTextField source="content" emptyText="No content" />
        </RecordContextProvider>
      )

      expect(screen.getByText('No content')).toBeInTheDocument()
    })

    it('should render empty text when value is undefined', () => {
      render(
        <RecordContextProvider value={{ id: 1 }}>
          <RichTextField source="content" emptyText="No content" />
        </RecordContextProvider>
      )

      expect(screen.getByText('No content')).toBeInTheDocument()
    })

    it('should render nothing when value is empty and no emptyText', () => {
      const { container } = render(
        <RecordContextProvider value={{ id: 1, content: '' }}>
          <RichTextField source="content" />
        </RecordContextProvider>
      )

      expect(container.querySelector('div')).toHaveTextContent('')
    })
  })

  describe('Record prop', () => {
    it('should use record prop instead of context when provided', () => {
      render(
        <RecordContextProvider value={{ id: 1, content: '<p>From context</p>' }}>
          <RichTextField
            source="content"
            record={{ id: 2, content: '<p>From prop</p>' }}
          />
        </RecordContextProvider>
      )

      expect(screen.getByText('From prop')).toBeInTheDocument()
      expect(screen.queryByText('From context')).not.toBeInTheDocument()
    })
  })

  describe('Nested source', () => {
    it('should support nested field access', () => {
      render(
        <RecordContextProvider value={{ id: 1, post: { body: '<p>Nested content</p>' } }}>
          <RichTextField source="post.body" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Nested content')).toBeInTheDocument()
    })
  })

  describe('Label', () => {
    it('should render label when provided', () => {
      render(
        <RecordContextProvider value={{ id: 1, content: '<p>Body text</p>' }}>
          <RichTextField source="content" label="Article Content" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Article Content')).toBeInTheDocument()
      expect(screen.getByText('Body text')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <RecordContextProvider value={{ id: 1, content: '<p>Text</p>' }}>
          <RichTextField source="content" className="custom-class" />
        </RecordContextProvider>
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should pass through additional HTML attributes', () => {
      const { container } = render(
        <RecordContextProvider value={{ id: 1, content: '<p>Text</p>' }}>
          <RichTextField source="content" data-testid="rich-field" />
        </RecordContextProvider>
      )

      expect(screen.getByTestId('rich-field')).toBeInTheDocument()
    })
  })

  describe('Strip tags option', () => {
    it('should strip HTML tags when stripTags is true', () => {
      render(
        <RecordContextProvider value={{ id: 1, content: '<p>Hello <strong>World</strong></p>' }}>
          <RichTextField source="content" stripTags />
        </RecordContextProvider>
      )

      // Should render as plain text without HTML elements
      expect(screen.getByText('Hello World')).toBeInTheDocument()
      expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
    })

    it('should handle nested tags when stripTags is true', () => {
      render(
        <RecordContextProvider value={{ id: 1, content: '<div><p>Paragraph</p><span>Span</span></div>' }}>
          <RichTextField source="content" stripTags />
        </RecordContextProvider>
      )

      expect(screen.getByText('ParagraphSpan')).toBeInTheDocument()
    })
  })
})
