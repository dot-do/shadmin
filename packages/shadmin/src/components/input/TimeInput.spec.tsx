/**
 * TimeInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { TimeInput } from './TimeInput'

// Helper component to wrap TimeInput with form context
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

describe('<TimeInput />', () => {
  it('renders input with type="time"', () => {
    render(
      <TestForm>
        <TimeInput source="startTime" />
      </TestForm>
    )

    const input = screen.getByLabelText('startTime')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'time')
    expect(input).toHaveAttribute('name', 'startTime')
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <TimeInput source="startTime" label="Start Time" />
      </TestForm>
    )

    expect(screen.getByLabelText('Start Time')).toBeInTheDocument()
    expect(screen.getByText('Start Time')).toBeInTheDocument()
  })

  it('supports min and max time props', () => {
    render(
      <TestForm>
        <TimeInput source="meetingTime" min="09:00" max="17:00" />
      </TestForm>
    )

    const input = screen.getByLabelText('meetingTime')
    expect(input).toHaveAttribute('min', '09:00')
    expect(input).toHaveAttribute('max', '17:00')
  })

  it('supports step prop for time granularity', () => {
    render(
      <TestForm>
        <TimeInput source="time" step={60} />
      </TestForm>
    )

    const input = screen.getByLabelText('time')
    expect(input).toHaveAttribute('step', '60')
  })

  it('integrates with react-hook-form and submits value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <TimeInput source="startTime" label="Start Time" />
      </TestForm>
    )

    const input = screen.getByLabelText('Start Time')
    await user.clear(input)
    // Note: time input value format is HH:MM
    await user.type(input, '14:30')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ startTime: '14:30' }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue from form context', () => {
    render(
      <TestForm defaultValues={{ meetingTime: '10:30' }}>
        <TimeInput source="meetingTime" label="Meeting Time" />
      </TestForm>
    )

    const input = screen.getByLabelText('Meeting Time')
    expect(input).toHaveValue('10:30')
  })

  it('displays validation errors', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { appointmentTime: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <TimeInput
              source="appointmentTime"
              label="Appointment Time"
              rules={{ required: 'Appointment time is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Appointment time is required')).toBeInTheDocument()
    })
  })

  it('supports disabled prop', () => {
    render(
      <TestForm>
        <TimeInput source="time" disabled />
      </TestForm>
    )

    const input = screen.getByLabelText('time')
    expect(input).toBeDisabled()
  })

  it('supports required prop', () => {
    render(
      <TestForm>
        <TimeInput source="time" label="Time" required />
      </TestForm>
    )

    // Use regex for partial label match when asterisk is present
    const input = screen.getByLabelText(/^Time/)
    expect(input).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <TimeInput source="time" helperText="Select a time during business hours" />
      </TestForm>
    )

    expect(screen.getByText('Select a time during business hours')).toBeInTheDocument()
  })

  it('supports custom validation', async () => {
    const user = userEvent.setup()

    function FormWithCustomValidation() {
      const form = useForm({
        defaultValues: { businessTime: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <TimeInput
              source="businessTime"
              label="Business Time"
              rules={{
                validate: (value: string) => {
                  if (!value) return true
                  const hour = parseInt(value.split(':')[0], 10)
                  return (hour >= 9 && hour < 17) || 'Time must be during business hours (9:00-17:00)'
                },
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithCustomValidation />)

    const input = screen.getByLabelText('Business Time')
    await user.type(input, '20:00')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Time must be during business hours (9:00-17:00)')).toBeInTheDocument()
    })
  })

  it('supports readOnly prop', () => {
    render(
      <TestForm defaultValues={{ time: '09:00' }}>
        <TimeInput source="time" readOnly />
      </TestForm>
    )

    const input = screen.getByLabelText('time')
    expect(input).toHaveAttribute('readonly')
  })

  it('supports fullWidth prop', () => {
    render(
      <TestForm>
        <TimeInput source="time" fullWidth />
      </TestForm>
    )

    // The w-full class is on the outermost wrapper div (space-y-2)
    const container = screen.getByLabelText('time').closest('.space-y-2')
    expect(container).toHaveClass('w-full')
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <TimeInput source="hiddenLabelTime" label={false} />
      </TestForm>
    )

    // Should not have any label element
    expect(screen.queryByText('hiddenLabelTime')).not.toBeInTheDocument()
    // Input should still be accessible by name (time input doesn't have role="textbox")
    const input = document.querySelector('input[name="hiddenLabelTime"]')
    expect(input).toBeInTheDocument()
  })
})
