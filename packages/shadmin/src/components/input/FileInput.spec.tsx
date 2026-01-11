/**
 * FileInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { FileInput } from './FileInput'

// Helper component to wrap FileInput with form context
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

// Helper to create a mock File
function createMockFile(name: string, size: number, type: string): File {
  const file = new File(['a'.repeat(size)], name, { type })
  return file
}

describe('<FileInput />', () => {
  it('renders file input with source as name attribute', () => {
    render(
      <TestForm>
        <FileInput source="avatar" />
      </TestForm>
    )

    const input = document.querySelector('input[type="file"]')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'avatar')
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <FileInput source="avatar" label="Profile Picture" />
      </TestForm>
    )

    expect(screen.getByText('Profile Picture')).toBeInTheDocument()
  })

  it('uses source as label when label not provided', () => {
    render(
      <TestForm>
        <FileInput source="avatar" />
      </TestForm>
    )

    expect(screen.getByText('avatar')).toBeInTheDocument()
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <FileInput source="avatar" label={false} />
      </TestForm>
    )

    const input = document.querySelector('input[type="file"]')
    expect(input).toBeInTheDocument()
    expect(screen.queryByText('avatar')).not.toBeInTheDocument()
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <FileInput source="avatar" helperText="Upload a profile picture" />
      </TestForm>
    )

    expect(screen.getByText('Upload a profile picture')).toBeInTheDocument()
  })

  it('shows required asterisk when required prop is set', () => {
    render(
      <TestForm>
        <FileInput source="document" label="Document" required />
      </TestForm>
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('supports disabled prop', () => {
    render(
      <TestForm>
        <FileInput source="avatar" disabled />
      </TestForm>
    )

    const input = document.querySelector('input[type="file"]')
    expect(input).toBeDisabled()
  })

  it('supports accept prop for file type filtering', () => {
    render(
      <TestForm>
        <FileInput source="image" accept="image/*" />
      </TestForm>
    )

    const input = document.querySelector('input[type="file"]')
    expect(input).toHaveAttribute('accept', 'image/*')
  })

  it('supports multiple prop for multiple file selection', () => {
    render(
      <TestForm>
        <FileInput source="documents" multiple />
      </TestForm>
    )

    const input = document.querySelector('input[type="file"]')
    expect(input).toHaveAttribute('multiple')
  })

  it('shows file name after selection', async () => {
    const user = userEvent.setup()
    const file = createMockFile('test-document.pdf', 1024, 'application/pdf')

    render(
      <TestForm>
        <FileInput source="document" />
      </TestForm>
    )

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText('test-document.pdf')).toBeInTheDocument()
    })
  })

  it('shows multiple file names when multiple files selected', async () => {
    const user = userEvent.setup()
    const file1 = createMockFile('document1.pdf', 1024, 'application/pdf')
    const file2 = createMockFile('document2.pdf', 2048, 'application/pdf')

    render(
      <TestForm>
        <FileInput source="documents" multiple />
      </TestForm>
    )

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, [file1, file2])

    await waitFor(() => {
      expect(screen.getByText('document1.pdf')).toBeInTheDocument()
      expect(screen.getByText('document2.pdf')).toBeInTheDocument()
    })
  })

  it('integrates with react-hook-form and submits file data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const file = createMockFile('test.pdf', 1024, 'application/pdf')

    render(
      <TestForm onSubmit={onSubmit}>
        <FileInput source="document" />
      </TestForm>
    )

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, file)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          document: expect.any(Array)
        }),
        expect.anything()
      )
      // Verify the file is in the array
      const submittedData = onSubmit.mock.calls[0]![0] as { document: File[] }
      expect(submittedData.document[0]).toBeInstanceOf(File)
      expect(submittedData.document[0]!.name).toBe('test.pdf')
    })
  })

  it('displays validation errors', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { document: null },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <FileInput
              source="document"
              label="Document"
              rules={{ required: 'Document is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Document is required')).toBeInTheDocument()
    })
  })

  it('clears selection when clear button is clicked', async () => {
    const user = userEvent.setup()
    const file = createMockFile('test.pdf', 1024, 'application/pdf')

    render(
      <TestForm>
        <FileInput source="document" />
      </TestForm>
    )

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument()
    })

    // Click clear/remove button
    const clearButton = screen.getByRole('button', { name: /remove|clear|delete/i })
    await user.click(clearButton)

    await waitFor(() => {
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
    })
  })

  it('supports className prop for custom styling', () => {
    render(
      <TestForm>
        <FileInput source="avatar" className="custom-class" />
      </TestForm>
    )

    // The className should be applied to the drop zone container
    const dropZone = screen.getByTestId('file-drop-zone')
    expect(dropZone).toHaveClass('custom-class')
  })

  it('supports fullWidth prop', () => {
    render(
      <TestForm>
        <FileInput source="avatar" fullWidth />
      </TestForm>
    )

    const container = document.querySelector('input[type="file"]')?.closest('.space-y-2')
    expect(container).toHaveClass('w-full')
  })

  // Drag and drop tests
  describe('drag and drop', () => {
    it('renders a drop zone area', () => {
      render(
        <TestForm>
          <FileInput source="document" />
        </TestForm>
      )

      // Should have a visually identifiable drop zone
      const dropZone = screen.getByTestId('file-drop-zone')
      expect(dropZone).toBeInTheDocument()
      expect(dropZone).toHaveTextContent(/drag|drop|browse/i)
    })

    it('shows visual feedback when dragging over drop zone', async () => {
      render(
        <TestForm>
          <FileInput source="document" />
        </TestForm>
      )

      const dropZone = screen.getByTestId('file-drop-zone')

      // Simulate drag enter
      fireEvent.dragEnter(dropZone, {
        dataTransfer: { types: ['Files'] }
      })

      await waitFor(() => {
        // The drop zone should have some visual indication of drag state
        expect(dropZone).toHaveClass('drag-active')
      })
    })

    it('removes visual feedback when dragging leaves drop zone', async () => {
      render(
        <TestForm>
          <FileInput source="document" />
        </TestForm>
      )

      const dropZone = screen.getByTestId('file-drop-zone')

      // Simulate drag enter then leave
      fireEvent.dragEnter(dropZone, {
        dataTransfer: { types: ['Files'] }
      })
      fireEvent.dragLeave(dropZone)

      await waitFor(() => {
        // The drop zone should no longer have drag state class
        expect(dropZone).not.toHaveClass('drag-active')
      })
    })

    it('handles file drop', async () => {
      const file = createMockFile('dropped-file.pdf', 1024, 'application/pdf')

      render(
        <TestForm>
          <FileInput source="document" />
        </TestForm>
      )

      const dropZone = screen.getByTestId('file-drop-zone')

      // Create a mock DataTransfer
      const dataTransfer = {
        files: [file],
        items: [
          {
            kind: 'file',
            type: file.type,
            getAsFile: () => file
          }
        ],
        types: ['Files']
      }

      fireEvent.drop(dropZone, { dataTransfer })

      await waitFor(() => {
        expect(screen.getByText('dropped-file.pdf')).toBeInTheDocument()
      })
    })

    it('handles multiple file drop when multiple prop is set', async () => {
      const file1 = createMockFile('file1.pdf', 1024, 'application/pdf')
      const file2 = createMockFile('file2.pdf', 2048, 'application/pdf')

      render(
        <TestForm>
          <FileInput source="documents" multiple />
        </TestForm>
      )

      const dropZone = screen.getByTestId('file-drop-zone')

      const dataTransfer = {
        files: [file1, file2],
        items: [
          { kind: 'file', type: file1.type, getAsFile: () => file1 },
          { kind: 'file', type: file2.type, getAsFile: () => file2 }
        ],
        types: ['Files']
      }

      fireEvent.drop(dropZone, { dataTransfer })

      await waitFor(() => {
        expect(screen.getByText('file1.pdf')).toBeInTheDocument()
        expect(screen.getByText('file2.pdf')).toBeInTheDocument()
      })
    })

    it('only accepts first file when multiple is not set', async () => {
      const file1 = createMockFile('file1.pdf', 1024, 'application/pdf')
      const file2 = createMockFile('file2.pdf', 2048, 'application/pdf')

      render(
        <TestForm>
          <FileInput source="document" />
        </TestForm>
      )

      const dropZone = screen.getByTestId('file-drop-zone')

      const dataTransfer = {
        files: [file1, file2],
        items: [
          { kind: 'file', type: file1.type, getAsFile: () => file1 },
          { kind: 'file', type: file2.type, getAsFile: () => file2 }
        ],
        types: ['Files']
      }

      fireEvent.drop(dropZone, { dataTransfer })

      await waitFor(() => {
        expect(screen.getByText('file1.pdf')).toBeInTheDocument()
        expect(screen.queryByText('file2.pdf')).not.toBeInTheDocument()
      })
    })

    it('disables drop zone when disabled prop is set', () => {
      render(
        <TestForm>
          <FileInput source="document" disabled />
        </TestForm>
      )

      const dropZone = screen.getByTestId('file-drop-zone')
      expect(dropZone).toHaveClass('opacity-50')
    })
  })

  it('can remove individual files from multiple selection', async () => {
    const user = userEvent.setup()
    const file1 = createMockFile('file1.pdf', 1024, 'application/pdf')
    const file2 = createMockFile('file2.pdf', 2048, 'application/pdf')

    render(
      <TestForm>
        <FileInput source="documents" multiple />
      </TestForm>
    )

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, [file1, file2])

    await waitFor(() => {
      expect(screen.getByText('file1.pdf')).toBeInTheDocument()
      expect(screen.getByText('file2.pdf')).toBeInTheDocument()
    })

    // Find and click the remove button for the first file
    const removeButtons = screen.getAllByRole('button', { name: /remove|clear|delete/i })
    await user.click(removeButtons[0]!)

    await waitFor(() => {
      expect(screen.queryByText('file1.pdf')).not.toBeInTheDocument()
      expect(screen.getByText('file2.pdf')).toBeInTheDocument()
    })
  })
})
