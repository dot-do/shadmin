/**
 * SelectInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'

import { SelectInput } from './SelectInput'
import { FormContextProvider } from '../../contexts/FormContext'

// Helper component to wrap SelectInput with form context
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

describe('<SelectInput />', () => {
  it('renders select with source as name attribute', () => {
    render(
      <TestForm>
        <SelectInput source="status" choices={defaultChoices} />
      </TestForm>
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(select).toHaveAttribute('name', 'status')
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <SelectInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders all choices as options', () => {
    render(
      <TestForm>
        <SelectInput source="status" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Inactive' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pending' })).toBeInTheDocument()
  })

  it('renders empty option when emptyText is provided', () => {
    render(
      <TestForm>
        <SelectInput source="status" choices={defaultChoices} emptyText="Select a status" />
      </TestForm>
    )

    expect(screen.getByRole('option', { name: 'Select a status' })).toBeInTheDocument()
  })

  it('supports custom optionValue and optionText props', () => {
    const customChoices = [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
    ]

    render(
      <TestForm>
        <SelectInput
          source="country"
          choices={customChoices}
          optionValue="value"
          optionText="label"
        />
      </TestForm>
    )

    expect(screen.getByRole('option', { name: 'United States' })).toHaveValue('us')
    expect(screen.getByRole('option', { name: 'United Kingdom' })).toHaveValue('uk')
  })

  it('integrates with react-hook-form and submits selected value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <SelectInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    const select = screen.getByLabelText('Status')
    await user.selectOptions(select, 'active')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'active' }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue from form context', () => {
    render(
      <TestForm defaultValues={{ status: 'inactive' }}>
        <SelectInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    const select = screen.getByLabelText('Status')
    expect(select).toHaveValue('inactive')
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
            <SelectInput
              source="status"
              label="Status"
              choices={defaultChoices}
              emptyText="Select a status"
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
        <SelectInput source="status" choices={defaultChoices} disabled />
      </TestForm>
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })

  it('supports required prop', () => {
    render(
      <TestForm>
        <SelectInput source="status" label="Status" choices={defaultChoices} required />
      </TestForm>
    )

    // Use regex for partial label match when asterisk is present
    const select = screen.getByLabelText(/^Status/)
    expect(select).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <SelectInput
          source="status"
          choices={defaultChoices}
          helperText="Choose the current status"
        />
      </TestForm>
    )

    expect(screen.getByText('Choose the current status')).toBeInTheDocument()
  })

  it('supports disableValue to disable specific options', () => {
    const choicesWithDisabled = [
      { id: 'active', name: 'Active', disabled: false },
      { id: 'inactive', name: 'Inactive', disabled: true },
      { id: 'pending', name: 'Pending', disabled: false },
    ]

    render(
      <TestForm>
        <SelectInput
          source="status"
          choices={choicesWithDisabled}
          disableValue="disabled"
        />
      </TestForm>
    )

    expect(screen.getByRole('option', { name: 'Active' })).not.toBeDisabled()
    expect(screen.getByRole('option', { name: 'Inactive' })).toBeDisabled()
    expect(screen.getByRole('option', { name: 'Pending' })).not.toBeDisabled()
  })

  it('supports fullWidth prop', () => {
    render(
      <TestForm>
        <SelectInput source="status" choices={defaultChoices} fullWidth />
      </TestForm>
    )

    const container = screen.getByRole('combobox').closest('div')?.parentElement
    expect(container).toHaveClass('w-full')
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <SelectInput source="status" choices={defaultChoices} label={false} />
      </TestForm>
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.queryByText('status')).not.toBeInTheDocument()
  })

  it('supports optionText as function for custom rendering', () => {
    const choices = [
      { id: 'us', code: 'US', name: 'United States' },
      { id: 'uk', code: 'UK', name: 'United Kingdom' },
    ]

    render(
      <TestForm>
        <SelectInput
          source="country"
          choices={choices}
          optionText={(choice: { code: string; name: string }) => `${choice.code} - ${choice.name}`}
        />
      </TestForm>
    )

    expect(screen.getByRole('option', { name: 'US - United States' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'UK - United Kingdom' })).toBeInTheDocument()
  })

  it('handles number values correctly', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    const numberChoices = [
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' },
      { id: 3, name: 'Three' },
    ]

    render(
      <TestForm onSubmit={onSubmit}>
        <SelectInput source="number" label="Number" choices={numberChoices} />
      </TestForm>
    )

    const select = screen.getByLabelText('Number')
    await user.selectOptions(select, '2')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ number: '2' }),
        expect.anything()
      )
    })
  })
})
