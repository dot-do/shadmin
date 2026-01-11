import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageField } from './ImageField'
import { RecordContextProvider } from '../../contexts/RecordContext'

describe('ImageField', () => {
  describe('Basic rendering', () => {
    it('should render an image with src from source field', () => {
      render(
        <RecordContextProvider value={{ id: 1, avatar: 'https://example.com.ai/image.jpg' }}>
          <ImageField source="avatar" />
        </RecordContextProvider>
      )

      const img = screen.getByRole('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'https://example.com.ai/image.jpg')
    })

    it('should render image with default alt text from source', () => {
      render(
        <RecordContextProvider value={{ id: 1, avatar: 'https://example.com.ai/image.jpg' }}>
          <ImageField source="avatar" />
        </RecordContextProvider>
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('alt', 'avatar')
    })

    it('should support custom alt text via title prop', () => {
      render(
        <RecordContextProvider value={{ id: 1, avatar: 'https://example.com.ai/image.jpg' }}>
          <ImageField source="avatar" title="User Avatar" />
        </RecordContextProvider>
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('alt', 'User Avatar')
    })

    it('should support title from record field', () => {
      render(
        <RecordContextProvider value={{ id: 1, avatar: 'https://example.com.ai/image.jpg', name: 'John Doe' }}>
          <ImageField source="avatar" title="name" />
        </RecordContextProvider>
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('alt', 'John Doe')
    })
  })

  describe('Empty state', () => {
    it('should render empty text when value is null', () => {
      render(
        <RecordContextProvider value={{ id: 1, avatar: null }}>
          <ImageField source="avatar" emptyText="No image" />
        </RecordContextProvider>
      )

      expect(screen.getByText('No image')).toBeInTheDocument()
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('should render empty text when value is undefined', () => {
      render(
        <RecordContextProvider value={{ id: 1 }}>
          <ImageField source="avatar" emptyText="No image" />
        </RecordContextProvider>
      )

      expect(screen.getByText('No image')).toBeInTheDocument()
    })

    it('should render nothing when value is empty and no emptyText', () => {
      const { container } = render(
        <RecordContextProvider value={{ id: 1, avatar: null }}>
          <ImageField source="avatar" />
        </RecordContextProvider>
      )

      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(container.querySelector('span')).toHaveTextContent('')
    })
  })

  describe('Record prop', () => {
    it('should use record prop instead of context when provided', () => {
      render(
        <RecordContextProvider value={{ id: 1, avatar: 'https://example.com.ai/context.jpg' }}>
          <ImageField
            source="avatar"
            record={{ id: 2, avatar: 'https://example.com.ai/prop.jpg' }}
          />
        </RecordContextProvider>
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'https://example.com.ai/prop.jpg')
    })
  })

  describe('Nested source', () => {
    it('should support nested field access', () => {
      render(
        <RecordContextProvider value={{ id: 1, profile: { avatar: 'https://example.com.ai/nested.jpg' } }}>
          <ImageField source="profile.avatar" />
        </RecordContextProvider>
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'https://example.com.ai/nested.jpg')
    })
  })

  describe('Label', () => {
    it('should render label when provided', () => {
      render(
        <RecordContextProvider value={{ id: 1, avatar: 'https://example.com.ai/image.jpg' }}>
          <ImageField source="avatar" label="Profile Picture" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Profile Picture')).toBeInTheDocument()
      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply custom className to container', () => {
      const { container } = render(
        <RecordContextProvider value={{ id: 1, avatar: 'https://example.com.ai/image.jpg' }}>
          <ImageField source="avatar" className="custom-class" />
        </RecordContextProvider>
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should apply sx prop styles to image', () => {
      render(
        <RecordContextProvider value={{ id: 1, avatar: 'https://example.com.ai/image.jpg' }}>
          <ImageField source="avatar" sx={{ width: 100, height: 100 }} />
        </RecordContextProvider>
      )

      const img = screen.getByRole('img')
      expect(img).toHaveStyle({ width: '100px', height: '100px' })
    })

    it('should pass through additional HTML attributes', () => {
      render(
        <RecordContextProvider value={{ id: 1, avatar: 'https://example.com.ai/image.jpg' }}>
          <ImageField source="avatar" data-testid="image-field" />
        </RecordContextProvider>
      )

      expect(screen.getByTestId('image-field')).toBeInTheDocument()
    })
  })

  describe('Image source as array', () => {
    it('should render multiple images when source is an array', () => {
      render(
        <RecordContextProvider value={{
          id: 1,
          photos: [
            { src: 'https://example.com.ai/1.jpg', title: 'Photo 1' },
            { src: 'https://example.com.ai/2.jpg', title: 'Photo 2' },
          ]
        }}>
          <ImageField source="photos" src="src" title="title" />
        </RecordContextProvider>
      )

      const images = screen.getAllByRole('img')
      expect(images).toHaveLength(2)
      expect(images[0]).toHaveAttribute('src', 'https://example.com.ai/1.jpg')
      expect(images[0]).toHaveAttribute('alt', 'Photo 1')
      expect(images[1]).toHaveAttribute('src', 'https://example.com.ai/2.jpg')
      expect(images[1]).toHaveAttribute('alt', 'Photo 2')
    })

    it('should use default src property for array items', () => {
      render(
        <RecordContextProvider value={{
          id: 1,
          photos: [
            { url: 'https://example.com.ai/1.jpg' },
            { url: 'https://example.com.ai/2.jpg' },
          ]
        }}>
          <ImageField source="photos" src="url" />
        </RecordContextProvider>
      )

      const images = screen.getAllByRole('img')
      expect(images[0]).toHaveAttribute('src', 'https://example.com.ai/1.jpg')
      expect(images[1]).toHaveAttribute('src', 'https://example.com.ai/2.jpg')
    })
  })
})
