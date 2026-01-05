/**
 * AutocompleteInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { AutocompleteInput } from './AutocompleteInput'

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
})
