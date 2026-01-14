/**
 * AutocompleteInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'

import { AutocompleteInput } from './AutocompleteInput'
import { FormContextProvider } from '../../contexts/FormContext'

// Helper component to wrap AutocompleteInput with form context
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

const defaultChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'pending', name: 'Pending' },
]

describe('<AutocompleteInput />', () => {
  it('renders input with source as name attribute', () => {
    render(
      <TestForm>
        <AutocompleteInput source="status" choices={defaultChoices} />
      </TestForm>
    )

    const input = screen.getByRole('combobox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'status')
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <AutocompleteInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('shows dropdown with filtered choices when typing', async () => {
    const user = userEvent.setup()

    render(
      <TestForm>
        <AutocompleteInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    const input = screen.getByLabelText('Status')
    await user.click(input)
    await user.type(input, 'act')

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Inactive' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Pending' })).not.toBeInTheDocument()
    })
  })

  it('selects a choice when clicked', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <AutocompleteInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    const input = screen.getByLabelText('Status')
    await user.click(input)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('option', { name: 'Active' }))

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'active' }),
        expect.anything()
      )
    })
  })

  it('supports custom optionValue and optionText props', async () => {
    const user = userEvent.setup()
    const customChoices = [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
    ]

    render(
      <TestForm>
        <AutocompleteInput
          source="country"
          label="Country"
          choices={customChoices}
          optionValue="value"
          optionText="label"
        />
      </TestForm>
    )

    const input = screen.getByLabelText('Country')
    await user.click(input)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'United Kingdom' })).toBeInTheDocument()
    })
  })

  it('handles defaultValue from form context', async () => {
    render(
      <TestForm defaultValues={{ status: 'inactive' }}>
        <AutocompleteInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    const input = screen.getByLabelText('Status')
    expect(input).toHaveValue('Inactive')
  })

  it('displays validation errors', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { status: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <AutocompleteInput
              source="status"
              label="Status"
              choices={defaultChoices}
              rules={{ required: 'Status is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Status is required')).toBeInTheDocument()
    })
  })

  it('supports disabled prop', () => {
    render(
      <TestForm>
        <AutocompleteInput source="status" choices={defaultChoices} disabled />
      </TestForm>
    )

    const input = screen.getByRole('combobox')
    expect(input).toBeDisabled()
  })

  it('supports required prop', () => {
    render(
      <TestForm>
        <AutocompleteInput source="status" label="Status" choices={defaultChoices} required />
      </TestForm>
    )

    const input = screen.getByLabelText(/^Status/)
    expect(input).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <AutocompleteInput
          source="status"
          choices={defaultChoices}
          helperText="Start typing to search"
        />
      </TestForm>
    )

    expect(screen.getByText('Start typing to search')).toBeInTheDocument()
  })

  it('supports fullWidth prop', () => {
    render(
      <TestForm>
        <AutocompleteInput source="status" choices={defaultChoices} fullWidth />
      </TestForm>
    )

    const container = screen.getByRole('combobox').closest('div')?.parentElement
    expect(container).toHaveClass('w-full')
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <AutocompleteInput source="status" choices={defaultChoices} label={false} />
      </TestForm>
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.queryByText('status')).not.toBeInTheDocument()
  })

  it('supports optionText as function for custom rendering', async () => {
    const user = userEvent.setup()
    const choices = [
      { id: 'us', code: 'US', name: 'United States' },
      { id: 'uk', code: 'UK', name: 'United Kingdom' },
    ]

    render(
      <TestForm>
        <AutocompleteInput
          source="country"
          label="Country"
          choices={choices}
          optionText={(choice: { code: string; name: string }) => `${choice.code} - ${choice.name}`}
        />
      </TestForm>
    )

    const input = screen.getByLabelText('Country')
    await user.click(input)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'US - United States' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'UK - United Kingdom' })).toBeInTheDocument()
    })
  })

  it('clears input when clear button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <TestForm defaultValues={{ status: 'active' }}>
        <AutocompleteInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    const input = screen.getByLabelText('Status')
    expect(input).toHaveValue('Active')

    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)

    expect(input).toHaveValue('')
  })

  it('filters choices case-insensitively', async () => {
    const user = userEvent.setup()

    render(
      <TestForm>
        <AutocompleteInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    const input = screen.getByLabelText('Status')
    await user.click(input)
    await user.type(input, 'ACTIVE')

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument()
    })
  })

  it('shows no options message when no matches found', async () => {
    const user = userEvent.setup()

    render(
      <TestForm>
        <AutocompleteInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    const input = screen.getByLabelText('Status')
    await user.click(input)
    await user.type(input, 'xyz')

    await waitFor(() => {
      expect(screen.getByText('No options')).toBeInTheDocument()
    })
  })

  // Tests for onCreate callback functionality
  describe('onCreate callback', () => {
    it('shows create option when onCreate is provided and no match found', async () => {
      const user = userEvent.setup()
      const onCreate = vi.fn()

      render(
        <TestForm>
          <AutocompleteInput
            source="status"
            label="Status"
            choices={defaultChoices}
            onCreate={onCreate}
          />
        </TestForm>
      )

      const input = screen.getByLabelText('Status')
      await user.click(input)
      await user.type(input, 'newstatus')

      await waitFor(() => {
        expect(screen.getByRole('option', { name: /create "newstatus"/i })).toBeInTheDocument()
      })
    })

    it('calls onCreate when create option is clicked', async () => {
      const user = userEvent.setup()
      const onCreate = vi.fn().mockResolvedValue({ id: 'newstatus', name: 'newstatus' })

      render(
        <TestForm>
          <AutocompleteInput
            source="status"
            label="Status"
            choices={defaultChoices}
            onCreate={onCreate}
          />
        </TestForm>
      )

      const input = screen.getByLabelText('Status')
      await user.click(input)
      await user.type(input, 'newstatus')

      await waitFor(() => {
        expect(screen.getByRole('option', { name: /create "newstatus"/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('option', { name: /create "newstatus"/i }))

      await waitFor(() => {
        expect(onCreate).toHaveBeenCalledWith('newstatus')
      })
    })

    it('sets the new value after onCreate returns', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const onCreate = vi.fn().mockResolvedValue({ id: 'new-id', name: 'New Status' })

      render(
        <TestForm onSubmit={onSubmit}>
          <AutocompleteInput
            source="status"
            label="Status"
            choices={defaultChoices}
            onCreate={onCreate}
          />
        </TestForm>
      )

      const input = screen.getByLabelText('Status')
      await user.click(input)
      await user.type(input, 'New Status')

      await waitFor(() => {
        expect(screen.getByRole('option', { name: /create "New Status"/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('option', { name: /create "New Status"/i }))

      await waitFor(() => {
        expect(input).toHaveValue('New Status')
      })

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'new-id' }),
          expect.anything()
        )
      })
    })

    it('does not show create option when there is an exact match', async () => {
      const user = userEvent.setup()
      const onCreate = vi.fn()

      render(
        <TestForm>
          <AutocompleteInput
            source="status"
            label="Status"
            choices={defaultChoices}
            onCreate={onCreate}
          />
        </TestForm>
      )

      const input = screen.getByLabelText('Status')
      await user.click(input)
      await user.type(input, 'Active')

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument()
        expect(screen.queryByRole('option', { name: /create/i })).not.toBeInTheDocument()
      })
    })

    it('shows create option only when onCreate is provided', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <AutocompleteInput
            source="status"
            label="Status"
            choices={defaultChoices}
          />
        </TestForm>
      )

      const input = screen.getByLabelText('Status')
      await user.click(input)
      await user.type(input, 'newstatus')

      await waitFor(() => {
        expect(screen.getByText('No options')).toBeInTheDocument()
        expect(screen.queryByRole('option', { name: /create/i })).not.toBeInTheDocument()
      })
    })

    it('allows creating option via Enter key', async () => {
      const user = userEvent.setup()
      const onCreate = vi.fn().mockResolvedValue({ id: 'new-id', name: 'newstatus' })

      render(
        <TestForm>
          <AutocompleteInput
            source="status"
            label="Status"
            choices={defaultChoices}
            onCreate={onCreate}
          />
        </TestForm>
      )

      const input = screen.getByLabelText('Status')
      await user.click(input)
      await user.type(input, 'newstatus')

      // Navigate to create option with arrow down
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(onCreate).toHaveBeenCalledWith('newstatus')
      })
    })
  })

  // Tests for debounce functionality
  describe('debounce', () => {
    it('debounces filter input when debounce prop is provided', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <AutocompleteInput
            source="status"
            label="Status"
            choices={defaultChoices}
            debounce={50}
          />
        </TestForm>
      )

      const input = screen.getByLabelText('Status')
      await user.click(input)
      await user.type(input, 'act')

      // After debounce, should filter
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument()
        expect(screen.queryByRole('option', { name: 'Pending' })).not.toBeInTheDocument()
      }, { timeout: 200 })
    })
  })

  // Tests for keyboard navigation
  describe('keyboard navigation', () => {
    it('navigates options with arrow keys', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <TestForm>
          <AutocompleteInput source="status" label="Status" choices={defaultChoices} />
        </TestForm>
      )

      const input = screen.getByLabelText('Status')
      await user.click(input)

      // Wait for dropdown to open
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      // Press ArrowDown to highlight first option
      await user.keyboard('{ArrowDown}')

      const activeOption = screen.getByRole('option', { name: 'Active' })
      expect(activeOption).toHaveAttribute('aria-selected', 'true')
    })

    it('selects option with Enter key', async () => {
      const user = userEvent.setup({ delay: null })
      const onSubmit = vi.fn()

      render(
        <TestForm onSubmit={onSubmit}>
          <AutocompleteInput source="status" label="Status" choices={defaultChoices} />
        </TestForm>
      )

      const input = screen.getByLabelText('Status')
      await user.click(input)

      // Wait for dropdown
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      await user.keyboard('{ArrowDown}{Enter}')

      expect(input).toHaveValue('Active')

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'active' }),
          expect.anything()
        )
      })
    })

    it('closes dropdown with Escape key', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <TestForm>
          <AutocompleteInput source="status" label="Status" choices={defaultChoices} />
        </TestForm>
      )

      const input = screen.getByLabelText('Status')
      await user.click(input)

      // Wait for dropdown to open
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })
  })
})
