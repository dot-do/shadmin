/**
 * RadioButtonGroupInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { RadioButtonGroupInput } from './RadioButtonGroupInput'

// Helper component to wrap RadioButtonGroupInput with form context
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

describe('<RadioButtonGroupInput />', () => {
  it('renders radio buttons with source as name attribute', () => {
    render(
      <TestForm>
        <RadioButtonGroupInput source="status" choices={defaultChoices} />
      </TestForm>
    )

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'status')
    })
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <RadioButtonGroupInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders all choices as radio options', () => {
    render(
      <TestForm>
        <RadioButtonGroupInput source="status" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByLabelText('Active')).toBeInTheDocument()
    expect(screen.getByLabelText('Inactive')).toBeInTheDocument()
    expect(screen.getByLabelText('Pending')).toBeInTheDocument()
  })

  it('supports custom optionValue and optionText props', () => {
    const customChoices = [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
    ]

    render(
      <TestForm>
        <RadioButtonGroupInput
          source="country"
          choices={customChoices}
          optionValue="value"
          optionText="label"
        />
      </TestForm>
    )

    const usRadio = screen.getByLabelText('United States')
    const ukRadio = screen.getByLabelText('United Kingdom')
    expect(usRadio).toHaveAttribute('value', 'us')
    expect(ukRadio).toHaveAttribute('value', 'uk')
  })

  it('integrates with react-hook-form and submits selected value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <RadioButtonGroupInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    const activeRadio = screen.getByLabelText('Active')
    await user.click(activeRadio)

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
        <RadioButtonGroupInput source="status" label="Status" choices={defaultChoices} />
      </TestForm>
    )

    const inactiveRadio = screen.getByLabelText('Inactive')
    expect(inactiveRadio).toBeChecked()
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
            <RadioButtonGroupInput
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

  it('supports disabled prop on all radios', () => {
    render(
      <TestForm>
        <RadioButtonGroupInput source="status" choices={defaultChoices} disabled />
      </TestForm>
    )

    const radios = screen.getAllByRole('radio')
    radios.forEach((radio) => {
      expect(radio).toBeDisabled()
    })
  })

  it('supports required prop', () => {
    render(
      <TestForm>
        <RadioButtonGroupInput source="status" label="Status" choices={defaultChoices} required />
      </TestForm>
    )

    expect(screen.getByText('*')).toBeInTheDocument()
    const radios = screen.getAllByRole('radio')
    radios.forEach((radio) => {
      expect(radio).toBeRequired()
    })
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <RadioButtonGroupInput
          source="status"
          choices={defaultChoices}
          helperText="Choose the current status"
        />
      </TestForm>
    )

    expect(screen.getByText('Choose the current status')).toBeInTheDocument()
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <RadioButtonGroupInput source="status" choices={defaultChoices} label={false} />
      </TestForm>
    )

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
    expect(screen.queryByText('status')).not.toBeInTheDocument()
  })

  it('supports optionText as function for custom rendering', () => {
    const choices = [
      { id: 'us', code: 'US', name: 'United States' },
      { id: 'uk', code: 'UK', name: 'United Kingdom' },
    ]

    render(
      <TestForm>
        <RadioButtonGroupInput
          source="country"
          choices={choices}
          optionText={(choice: { code: string; name: string }) => `${choice.code} - ${choice.name}`}
        />
      </TestForm>
    )

    expect(screen.getByLabelText('US - United States')).toBeInTheDocument()
    expect(screen.getByLabelText('UK - United Kingdom')).toBeInTheDocument()
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
        <RadioButtonGroupInput source="number" label="Number" choices={numberChoices} />
      </TestForm>
    )

    const twoRadio = screen.getByLabelText('Two')
    await user.click(twoRadio)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ number: '2' }),
        expect.anything()
      )
    })
  })

  it('supports row layout direction', () => {
    render(
      <TestForm>
        <RadioButtonGroupInput source="status" choices={defaultChoices} row />
      </TestForm>
    )

    const radioGroup = screen.getAllByRole('radio')[0].closest('[role="radiogroup"]')
    expect(radioGroup).toHaveClass('flex-row')
  })

  it('supports disableValue to disable specific options', () => {
    const choicesWithDisabled = [
      { id: 'active', name: 'Active', disabled: false },
      { id: 'inactive', name: 'Inactive', disabled: true },
      { id: 'pending', name: 'Pending', disabled: false },
    ]

    render(
      <TestForm>
        <RadioButtonGroupInput
          source="status"
          choices={choicesWithDisabled}
          disableValue="disabled"
        />
      </TestForm>
    )

    expect(screen.getByLabelText('Active')).not.toBeDisabled()
    expect(screen.getByLabelText('Inactive')).toBeDisabled()
    expect(screen.getByLabelText('Pending')).not.toBeDisabled()
  })

  it('updates form value when selection changes', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit} defaultValues={{ status: 'active' }}>
        <RadioButtonGroupInput source="status" choices={defaultChoices} />
      </TestForm>
    )

    // Initially active is selected
    expect(screen.getByLabelText('Active')).toBeChecked()

    // Change to pending
    await user.click(screen.getByLabelText('Pending'))
    expect(screen.getByLabelText('Pending')).toBeChecked()
    expect(screen.getByLabelText('Active')).not.toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'pending' }),
        expect.anything()
      )
    })
  })
})
