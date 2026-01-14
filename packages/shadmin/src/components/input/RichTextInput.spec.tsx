/**
 * RichTextInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { RichTextInput } from './RichTextInput'
import { FormContextProvider } from '../../contexts/FormContext'

// Mock document.execCommand and document.queryCommandState for jsdom
const mockExecCommand = vi.fn()
const mockQueryCommandState = vi.fn()

beforeEach(() => {
  document.execCommand = mockExecCommand
  document.queryCommandState = mockQueryCommandState
  mockExecCommand.mockReturnValue(true)
  mockQueryCommandState.mockReturnValue(false)
})

afterEach(() => {
  vi.clearAllMocks()
})

// Helper component to wrap RichTextInput with form context
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

describe('<RichTextInput />', () => {
  it('renders rich text editor', () => {
    render(
      <TestForm>
        <RichTextInput source="content" />
      </TestForm>
    )

    // Should render an editor element
    const editor = screen.getByRole('textbox')
    expect(editor).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <RichTextInput source="content" label="Content" />
      </TestForm>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('uses source as label when label not provided', () => {
    render(
      <TestForm>
        <RichTextInput source="description" />
      </TestForm>
    )

    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <RichTextInput source="hiddenLabel" label={false} />
      </TestForm>
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByText('hiddenLabel')).not.toBeInTheDocument()
  })

  it('integrates with react-hook-form via FormContext', async () => {
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <RichTextInput source="content" />
      </TestForm>
    )

    const editor = screen.getByRole('textbox')

    // Type into the contenteditable div
    fireEvent.input(editor, { target: { innerHTML: '<p>Hello World</p>' } })

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ content: expect.stringContaining('Hello World') }),
        expect.anything()
      )
    })
  })

  it('sets initial value from form context', () => {
    render(
      <TestForm defaultValues={{ content: '<p>Initial content</p>' }}>
        <RichTextInput source="content" />
      </TestForm>
    )

    expect(screen.getByRole('textbox')).toHaveTextContent('Initial content')
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <RichTextInput source="content" helperText="Enter your content here" />
      </TestForm>
    )

    expect(screen.getByText('Enter your content here')).toBeInTheDocument()
  })

  it('supports required prop and shows asterisk', () => {
    render(
      <TestForm>
        <RichTextInput source="content" label="Content" required />
      </TestForm>
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('displays validation errors', async () => {
    function FormWithValidation() {
      const form = useForm({
        defaultValues: { content: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <RichTextInput
              source="content"
              label="Content"
              rules={{ required: 'Content is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Content is required')).toBeInTheDocument()
    })
  })

  it('supports disabled state', () => {
    render(
      <TestForm>
        <RichTextInput source="content" disabled />
      </TestForm>
    )

    const editor = screen.getByRole('textbox')
    expect(editor).toHaveAttribute('contenteditable', 'false')
  })

  it('handles HTML content', () => {
    render(
      <TestForm defaultValues={{ content: '<p><strong>Bold</strong> and <em>italic</em></p>' }}>
        <RichTextInput source="content" />
      </TestForm>
    )

    const editor = screen.getByRole('textbox')
    expect(editor.innerHTML).toContain('<strong>Bold</strong>')
    expect(editor.innerHTML).toContain('<em>italic</em>')
  })

  it('supports fullWidth prop', () => {
    render(
      <TestForm>
        <RichTextInput source="content" fullWidth />
      </TestForm>
    )

    const container = screen.getByRole('textbox').closest('.space-y-2')
    expect(container).toHaveClass('w-full')
  })

  // Toolbar tests
  describe('Toolbar', () => {
    it('renders bold button', () => {
      render(
        <TestForm>
          <RichTextInput source="content" />
        </TestForm>
      )

      expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument()
    })

    it('renders italic button', () => {
      render(
        <TestForm>
          <RichTextInput source="content" />
        </TestForm>
      )

      expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument()
    })

    it('renders underline button', () => {
      render(
        <TestForm>
          <RichTextInput source="content" />
        </TestForm>
      )

      expect(screen.getByRole('button', { name: /underline/i })).toBeInTheDocument()
    })

    it('renders ordered list button', () => {
      render(
        <TestForm>
          <RichTextInput source="content" />
        </TestForm>
      )

      expect(screen.getByRole('button', { name: /^ordered list$/i })).toBeInTheDocument()
    })

    it('renders unordered list button', () => {
      render(
        <TestForm>
          <RichTextInput source="content" />
        </TestForm>
      )

      expect(screen.getByRole('button', { name: /^unordered list$/i })).toBeInTheDocument()
    })

    it('renders heading buttons', () => {
      render(
        <TestForm>
          <RichTextInput source="content" />
        </TestForm>
      )

      expect(screen.getByRole('button', { name: /heading 1/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /heading 2/i })).toBeInTheDocument()
    })

    it('applies bold formatting when button clicked', async () => {
      render(
        <TestForm>
          <RichTextInput source="content" />
        </TestForm>
      )

      const boldButton = screen.getByRole('button', { name: /bold/i })
      await userEvent.click(boldButton)

      // execCommand should be called with 'bold'
      expect(mockExecCommand).toHaveBeenCalledWith('bold', false)
    })

    it('applies italic formatting when button clicked', async () => {
      render(
        <TestForm>
          <RichTextInput source="content" />
        </TestForm>
      )

      const italicButton = screen.getByRole('button', { name: /italic/i })
      await userEvent.click(italicButton)

      // execCommand should be called with 'italic'
      expect(mockExecCommand).toHaveBeenCalledWith('italic', false)
    })

    it('disables toolbar buttons when editor is disabled', () => {
      render(
        <TestForm>
          <RichTextInput source="content" disabled />
        </TestForm>
      )

      const boldButton = screen.getByRole('button', { name: /bold/i })
      expect(boldButton).toBeDisabled()
    })
  })

  it('supports className prop for custom styling', () => {
    render(
      <TestForm>
        <RichTextInput source="content" className="custom-class" />
      </TestForm>
    )

    const editorWrapper = screen.getByRole('textbox').closest('.rich-text-editor')
    expect(editorWrapper).toHaveClass('custom-class')
  })

  it('has proper aria attributes for accessibility', () => {
    render(
      <TestForm>
        <RichTextInput source="content" label="Content" />
      </TestForm>
    )

    const editor = screen.getByRole('textbox')
    expect(editor).toHaveAttribute('aria-label', 'Content')
  })

  it('shows error styling when validation fails', async () => {
    function FormWithValidation() {
      const form = useForm({
        defaultValues: { content: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <RichTextInput
              source="content"
              label="Content"
              rules={{ required: 'Content is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      const editorWrapper = screen.getByRole('textbox').closest('.editor-container')
      expect(editorWrapper).toHaveClass('border-destructive')
    })
  })
})
