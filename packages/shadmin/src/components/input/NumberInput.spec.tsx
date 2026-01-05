/**
 * NumberInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { NumberInput } from './NumberInput'

// Helper component to wrap NumberInput with form context
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

describe('<NumberInput />', () => {
  it('renders input with type="number"', () => {
    render(
      <TestForm>
        <NumberInput source="age" />
      </TestForm>
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('name', 'age')
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <NumberInput source="age" label="Age" />
      </TestForm>
    )

    expect(screen.getByLabelText('Age')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('supports min and max props', () => {
    render(
      <TestForm>
        <NumberInput source="age" min={0} max={120} />
      </TestForm>
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '120')
  })

  it('supports step prop', () => {
    render(
      <TestForm>
        <NumberInput source="price" step={0.01} />
      </TestForm>
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('step', '0.01')
  })

  it('integrates with react-hook-form and submits number value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <NumberInput source="quantity" />
      </TestForm>
    )

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '42')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 42 }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue from form context', () => {
    render(
      <TestForm defaultValues={{ count: 10 }}>
        <NumberInput source="count" />
      </TestForm>
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue(10)
  })

  it('displays validation errors', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { age: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <NumberInput
              source="age"
              label="Age"
              rules={{ required: 'Age is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Age is required')).toBeInTheDocument()
    })
  })

  it('validates min value', async () => {
    const user = userEvent.setup()

    function FormWithMinValidation() {
      const form = useForm({
        defaultValues: { age: 0 },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <NumberInput
              source="age"
              label="Age"
              rules={{
                min: { value: 18, message: 'Must be at least 18' },
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithMinValidation />)

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '10')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Must be at least 18')).toBeInTheDocument()
    })
  })

  it('supports disabled prop', () => {
    render(
      <TestForm>
        <NumberInput source="value" disabled />
      </TestForm>
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toBeDisabled()
  })

  it('supports required prop', () => {
    render(
      <TestForm>
        <NumberInput source="value" label="Value" required />
      </TestForm>
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('supports placeholder prop', () => {
    render(
      <TestForm>
        <NumberInput source="price" placeholder="Enter price" />
      </TestForm>
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('placeholder', 'Enter price')
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <NumberInput source="age" helperText="Enter your age in years" />
      </TestForm>
    )

    expect(screen.getByText('Enter your age in years')).toBeInTheDocument()
  })
})
