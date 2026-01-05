/**
 * DateTimeInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { DateTimeInput } from './DateTimeInput'

// Helper component to wrap DateTimeInput with form context
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

describe('<DateTimeInput />', () => {
  it('renders input with type="datetime-local"', () => {
    render(
      <TestForm>
        <DateTimeInput source="appointmentDateTime" />
      </TestForm>
    )

    const input = screen.getByLabelText('appointmentDateTime')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'datetime-local')
    expect(input).toHaveAttribute('name', 'appointmentDateTime')
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <DateTimeInput source="appointmentDateTime" label="Appointment Date & Time" />
      </TestForm>
    )

    expect(screen.getByLabelText('Appointment Date & Time')).toBeInTheDocument()
    expect(screen.getByText('Appointment Date & Time')).toBeInTheDocument()
  })

  it('supports min and max datetime props', () => {
    render(
      <TestForm>
        <DateTimeInput source="eventDateTime" min="2024-01-01T09:00" max="2024-12-31T17:00" />
      </TestForm>
    )

    const input = screen.getByLabelText('eventDateTime')
    expect(input).toHaveAttribute('min', '2024-01-01T09:00')
    expect(input).toHaveAttribute('max', '2024-12-31T17:00')
  })

  it('supports step prop for time granularity', () => {
    render(
      <TestForm>
        <DateTimeInput source="datetime" step={60} />
      </TestForm>
    )

    const input = screen.getByLabelText('datetime')
    expect(input).toHaveAttribute('step', '60')
  })

  it('integrates with react-hook-form and submits value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <DateTimeInput source="meetingDateTime" label="Meeting Date & Time" />
      </TestForm>
    )

    const input = screen.getByLabelText('Meeting Date & Time')
    await user.clear(input)
    // Note: datetime-local input value format is YYYY-MM-DDTHH:MM
    await user.type(input, '2024-06-15T14:30')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ meetingDateTime: '2024-06-15T14:30' }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue from form context', () => {
    render(
      <TestForm defaultValues={{ eventDateTime: '2024-03-20T10:30' }}>
        <DateTimeInput source="eventDateTime" label="Event Date & Time" />
      </TestForm>
    )

    const input = screen.getByLabelText('Event Date & Time')
    expect(input).toHaveValue('2024-03-20T10:30')
  })

  it('displays validation errors', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { deadline: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <DateTimeInput
              source="deadline"
              label="Deadline"
              rules={{ required: 'Deadline date and time is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Deadline date and time is required')).toBeInTheDocument()
    })
  })

  it('supports disabled prop', () => {
    render(
      <TestForm>
        <DateTimeInput source="datetime" disabled />
      </TestForm>
    )

    const input = screen.getByLabelText('datetime')
    expect(input).toBeDisabled()
  })

  it('supports required prop', () => {
    render(
      <TestForm>
        <DateTimeInput source="datetime" label="Date & Time" required />
      </TestForm>
    )

    // Use regex for partial label match when asterisk is present
    const input = screen.getByLabelText(/^Date & Time/)
    expect(input).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <DateTimeInput source="datetime" helperText="Select a date and time for your appointment" />
      </TestForm>
    )

    expect(screen.getByText('Select a date and time for your appointment')).toBeInTheDocument()
  })

  it('supports custom validation', async () => {
    const user = userEvent.setup()
    const now = new Date().toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM format

    function FormWithCustomValidation() {
      const form = useForm({
        defaultValues: { futureDateTime: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <DateTimeInput
              source="futureDateTime"
              label="Future Date & Time"
              rules={{
                validate: (value: string) => {
                  if (!value) return true
                  return value > now || 'Date and time must be in the future'
                },
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithCustomValidation />)

    const input = screen.getByLabelText('Future Date & Time')
    await user.type(input, '2020-01-01T10:00')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Date and time must be in the future')).toBeInTheDocument()
    })
  })

  it('supports readOnly prop', () => {
    render(
      <TestForm defaultValues={{ datetime: '2024-01-01T09:00' }}>
        <DateTimeInput source="datetime" readOnly />
      </TestForm>
    )

    const input = screen.getByLabelText('datetime')
    expect(input).toHaveAttribute('readonly')
  })

  it('supports fullWidth prop', () => {
    render(
      <TestForm>
        <DateTimeInput source="datetime" fullWidth />
      </TestForm>
    )

    // The w-full class is on the outermost wrapper div (space-y-2)
    const container = screen.getByLabelText('datetime').closest('.space-y-2')
    expect(container).toHaveClass('w-full')
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <DateTimeInput source="hiddenLabelDateTime" label={false} />
      </TestForm>
    )

    // Should not have any label element
    expect(screen.queryByText('hiddenLabelDateTime')).not.toBeInTheDocument()
    // Input should still be accessible by name
    const input = document.querySelector('input[name="hiddenLabelDateTime"]')
    expect(input).toBeInTheDocument()
  })
})
