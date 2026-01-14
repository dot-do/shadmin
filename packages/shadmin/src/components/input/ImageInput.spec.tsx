/**
 * ImageInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { ImageInput } from './ImageInput'
import { FormContextProvider } from '../../contexts/FormContext'

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

beforeEach(() => {
  mockCreateObjectURL.mockReturnValue('blob:mock-url')
  global.URL.createObjectURL = mockCreateObjectURL
  global.URL.revokeObjectURL = mockRevokeObjectURL
})

afterEach(() => {
  vi.clearAllMocks()
})

// Helper component to wrap ImageInput with form context
interface TestFormProps {
  children: React.ReactNode
  defaultValues?: Record<string, unknown>
  onSubmit?: (data: Record<string, unknown>) => void
}

function TestForm({ children, defaultValues = {}, onSubmit = vi.fn() }: TestFormProps) {
  const form = useForm({ defaultValues })
  return (
    <FormContextProvider {...form} save={onSubmit}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
        <button type="submit">Submit</button>
      </form>
    </FormContextProvider>
  )
}

// Helper function to create a mock File
function createMockFile(name: string, size: number, type: string): File {
  const content = new Array(size).fill('a').join('')
  return new File([content], name, { type })
}

describe('<ImageInput />', () => {
  describe('Basic Rendering', () => {
    it('renders image input', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" />
        </TestForm>
      )

      // Should render a file input with accept="image/*"
      const input = document.querySelector('input[type="file"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('accept', 'image/*')
    })

    it('renders label when provided', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" label="Profile Picture" />
        </TestForm>
      )

      expect(screen.getByText('Profile Picture')).toBeInTheDocument()
    })

    it('uses source as label when label not provided', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" />
        </TestForm>
      )

      expect(screen.getByText('avatar')).toBeInTheDocument()
    })

    it('hides label when label is false', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" label={false} />
        </TestForm>
      )

      expect(screen.queryByText('avatar')).not.toBeInTheDocument()
    })
  })

  describe('Helper Text and Required', () => {
    it('supports helperText prop', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" helperText="Upload a profile picture" />
        </TestForm>
      )

      expect(screen.getByText('Upload a profile picture')).toBeInTheDocument()
    })

    it('supports required prop and shows asterisk', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" label="Avatar" required />
        </TestForm>
      )

      expect(screen.getByText('*')).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('integrates with react-hook-form via FormContext', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm onSubmit={onSubmit}>
          <ImageInput source="avatar" />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.png', 1024, 'image/png')

      await user.upload(input, file)
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ avatar: expect.any(Object) }),
          expect.anything()
        )
      })
    })

    it('shows validation errors', async () => {
      const user = userEvent.setup()

      function FormWithValidation() {
        const form = useForm({
          defaultValues: { avatar: null },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ImageInput
                source="avatar"
                label="Avatar"
                rules={{ required: 'Avatar is required' }}
              />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Avatar is required')).toBeInTheDocument()
      })
    })
  })

  describe('Disabled State', () => {
    it('supports disabled state', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" disabled />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]')
      expect(input).toBeDisabled()
    })

    it('shows disabled styling on drop zone', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" disabled />
        </TestForm>
      )

      const dropZone = screen.getByTestId('image-input-dropzone')
      expect(dropZone).toHaveClass('cursor-not-allowed')
    })
  })

  describe('Accept Only Images', () => {
    it('accepts only image files', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]')
      expect(input).toHaveAttribute('accept', 'image/*')
    })

    it('supports custom accept prop', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" accept="image/png,image/jpeg" />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]')
      expect(input).toHaveAttribute('accept', 'image/png,image/jpeg')
    })
  })

  describe('Image Preview', () => {
    it('shows image preview after selection', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <ImageInput source="avatar" />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.png', 1024, 'image/png')

      await user.upload(input, file)

      await waitFor(() => {
        const previewImage = screen.getByRole('img')
        expect(previewImage).toBeInTheDocument()
        expect(previewImage).toHaveAttribute('src', 'blob:mock-url')
      })
    })

    it('shows file name in preview', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <ImageInput source="avatar" />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('my-photo.png', 1024, 'image/png')

      await user.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('my-photo.png')).toBeInTheDocument()
      })
    })
  })

  describe('Multiple Images', () => {
    it('supports multiple images', () => {
      render(
        <TestForm>
          <ImageInput source="gallery" multiple />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]')
      expect(input).toHaveAttribute('multiple')
    })

    it('shows grid display for multiple images', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <ImageInput source="gallery" multiple />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file1 = createMockFile('photo1.png', 1024, 'image/png')
      const file2 = createMockFile('photo2.png', 1024, 'image/png')

      await user.upload(input, [file1, file2])

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        expect(images.length).toBe(2)
      })
    })
  })

  describe('Remove Images', () => {
    it('supports removing images', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <ImageInput source="avatar" />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.png', 1024, 'image/png')

      await user.upload(input, file)

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument()
      })

      const removeButton = screen.getByRole('button', { name: /remove/i })
      await user.click(removeButton)

      await waitFor(() => {
        expect(screen.queryByRole('img')).not.toBeInTheDocument()
      })
    })

    it('removes specific image from multiple images', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <ImageInput source="gallery" multiple />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file1 = createMockFile('photo1.png', 1024, 'image/png')
      const file2 = createMockFile('photo2.png', 1024, 'image/png')

      await user.upload(input, [file1, file2])

      await waitFor(() => {
        expect(screen.getAllByRole('img').length).toBe(2)
      })

      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      await user.click(removeButtons[0]!)

      await waitFor(() => {
        expect(screen.getAllByRole('img').length).toBe(1)
      })
    })
  })

  describe('Max Size Validation', () => {
    it('supports maxSize prop (file size validation)', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <ImageInput source="avatar" maxSize={1024} />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      // Create a file larger than maxSize
      const largeFile = createMockFile('large.png', 2048, 'image/png')

      await user.upload(input, largeFile)

      await waitFor(() => {
        expect(screen.getByText(/file size exceeds/i)).toBeInTheDocument()
      })
    })

    it('accepts files within maxSize limit', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <ImageInput source="avatar" maxSize={2048} />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const smallFile = createMockFile('small.png', 1024, 'image/png')

      await user.upload(input, smallFile)

      await waitFor(() => {
        expect(screen.queryByText(/file size exceeds/i)).not.toBeInTheDocument()
        expect(screen.getByRole('img')).toBeInTheDocument()
      })
    })
  })

  describe('Drag and Drop', () => {
    it('shows drag-and-drop zone', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" />
        </TestForm>
      )

      const dropZone = screen.getByTestId('image-input-dropzone')
      expect(dropZone).toBeInTheDocument()
      expect(screen.getByText(/drag/i)).toBeInTheDocument()
    })

    it('highlights drop zone on drag over', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" />
        </TestForm>
      )

      const dropZone = screen.getByTestId('image-input-dropzone')

      fireEvent.dragEnter(dropZone)

      expect(dropZone).toHaveClass('border-ring')
    })

    it('handles file drop', async () => {
      render(
        <TestForm>
          <ImageInput source="avatar" />
        </TestForm>
      )

      const dropZone = screen.getByTestId('image-input-dropzone')
      const file = createMockFile('dropped.png', 1024, 'image/png')

      const dataTransfer = {
        files: [file],
        types: ['Files'],
      }

      fireEvent.drop(dropZone, { dataTransfer })

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument()
      })
    })
  })

  describe('Styling', () => {
    it('supports fullWidth prop', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" fullWidth />
        </TestForm>
      )

      const container = screen.getByTestId('image-input-dropzone').closest('.space-y-2')
      expect(container).toHaveClass('w-full')
    })

    it('supports className prop', () => {
      render(
        <TestForm>
          <ImageInput source="avatar" className="custom-class" />
        </TestForm>
      )

      const dropZone = screen.getByTestId('image-input-dropzone')
      expect(dropZone).toHaveClass('custom-class')
    })
  })

  describe('URL Cleanup', () => {
    it('revokes object URLs on unmount', async () => {
      const user = userEvent.setup()

      const { unmount } = render(
        <TestForm>
          <ImageInput source="avatar" />
        </TestForm>
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.png', 1024, 'image/png')

      await user.upload(input, file)

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument()
      })

      unmount()

      expect(mockRevokeObjectURL).toHaveBeenCalled()
    })
  })
})
