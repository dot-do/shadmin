/**
 * DateInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { DateInput } from './DateInput'

// Helper component to wrap DateInput with form context
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

describe('<DateInput />', () => {
  it('renders input with type="date"', () => {
    render(
      <TestForm>
        <DateInput source="birthDate" />
      </TestForm>
    )

    const input = screen.getByLabelText('birthDate')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'date')
    expect(input).toHaveAttribute('name', 'birthDate')
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <DateInput source="birthDate" label="Birth Date" />
      </TestForm>
    )

    expect(screen.getByLabelText('Birth Date')).toBeInTheDocument()
    expect(screen.getByText('Birth Date')).toBeInTheDocument()
  })

  it('supports min and max date props', () => {
    render(
      <TestForm>
        <DateInput source="eventDate" min="2024-01-01" max="2024-12-31" />
      </TestForm>
    )

    const input = screen.getByLabelText('eventDate')
    expect(input).toHaveAttribute('min', '2024-01-01')
    expect(input).toHaveAttribute('max', '2024-12-31')
  })

  it('integrates with react-hook-form and submits value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <DateInput source="startDate" label="Start Date" />
      </TestForm>
    )

    const input = screen.getByLabelText('Start Date')
    await user.clear(input)
    // Note: date input value format is YYYY-MM-DD
    await user.type(input, '2024-06-15')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ startDate: '2024-06-15' }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue from form context', () => {
    render(
      <TestForm defaultValues={{ eventDate: '2024-03-20' }}>
        <DateInput source="eventDate" label="Event Date" />
      </TestForm>
    )

    const input = screen.getByLabelText('Event Date')
    expect(input).toHaveValue('2024-03-20')
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
            <DateInput
              source="deadline"
              label="Deadline"
              rules={{ required: 'Deadline is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Deadline is required')).toBeInTheDocument()
    })
  })

  it('supports disabled prop', () => {
    render(
      <TestForm>
        <DateInput source="date" disabled />
      </TestForm>
    )

    const input = screen.getByLabelText('date')
    expect(input).toBeDisabled()
  })

  it('supports required prop', () => {
    render(
      <TestForm>
        <DateInput source="date" label="Date" required />
      </TestForm>
    )

    // Use regex for partial label match when asterisk is present
    const input = screen.getByLabelText(/^Date/)
    expect(input).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <DateInput source="date" helperText="Select a date in the future" />
      </TestForm>
    )

    expect(screen.getByText('Select a date in the future')).toBeInTheDocument()
  })

  it('supports custom validation', async () => {
    const user = userEvent.setup()
    const today = new Date().toISOString().split('T')[0]

    function FormWithCustomValidation() {
      const form = useForm({
        defaultValues: { futureDate: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <DateInput
              source="futureDate"
              label="Future Date"
              rules={{
                validate: (value: string) => {
                  if (!value) return true
                  return value > today || 'Date must be in the future'
                },
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithCustomValidation />)

    const input = screen.getByLabelText('Future Date')
    await user.type(input, '2020-01-01')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Date must be in the future')).toBeInTheDocument()
    })
  })

  it('supports readOnly prop', () => {
    render(
      <TestForm defaultValues={{ date: '2024-01-01' }}>
        <DateInput source="date" readOnly />
      </TestForm>
    )

    const input = screen.getByLabelText('date')
    expect(input).toHaveAttribute('readonly')
  })

  it('supports fullWidth prop', () => {
    render(
      <TestForm>
        <DateInput source="date" fullWidth />
      </TestForm>
    )

    // The w-full class is on the outermost wrapper div (space-y-2)
    const container = screen.getByLabelText('date').closest('.space-y-2')
    expect(container).toHaveClass('w-full')
  })

  describe('min/max validation', () => {
    it('passes min attribute to native input', () => {
      render(
        <TestForm>
          <DateInput source="date" min="2024-01-01" />
        </TestForm>
      )

      const input = screen.getByLabelText('date')
      expect(input).toHaveAttribute('min', '2024-01-01')
    })

    it('passes max attribute to native input', () => {
      render(
        <TestForm>
          <DateInput source="date" max="2024-12-31" />
        </TestForm>
      )

      const input = screen.getByLabelText('date')
      expect(input).toHaveAttribute('max', '2024-12-31')
    })

    it('passes both min and max attributes to native input', () => {
      render(
        <TestForm>
          <DateInput source="date" min="2024-01-01" max="2024-12-31" />
        </TestForm>
      )

      const input = screen.getByLabelText('date')
      expect(input).toHaveAttribute('min', '2024-01-01')
      expect(input).toHaveAttribute('max', '2024-12-31')
    })

    it('shows validation error when date is before min', async () => {
      const user = userEvent.setup()

      function FormWithMinValidation() {
        const form = useForm({
          defaultValues: { date: '' },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <DateInput source="date" label="Date" min="2024-06-01" />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithMinValidation />)

      const input = screen.getByLabelText('Date')
      await user.type(input, '2024-01-15')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Date must be on or after 2024-06-01')).toBeInTheDocument()
      })
    })

    it('shows validation error when date is after max', async () => {
      const user = userEvent.setup()

      function FormWithMaxValidation() {
        const form = useForm({
          defaultValues: { date: '' },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <DateInput source="date" label="Date" max="2024-06-30" />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithMaxValidation />)

      const input = screen.getByLabelText('Date')
      await user.type(input, '2024-12-15')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Date must be on or before 2024-06-30')).toBeInTheDocument()
      })
    })

    it('shows validation error when date is outside min and max range', async () => {
      const user = userEvent.setup()

      function FormWithRangeValidation() {
        const form = useForm({
          defaultValues: { date: '' },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <DateInput source="date" label="Date" min="2024-03-01" max="2024-09-30" />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithRangeValidation />)

      const input = screen.getByLabelText('Date')
      await user.type(input, '2024-01-15')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Date must be on or after 2024-03-01')).toBeInTheDocument()
      })
    })

    it('does not show validation error when date is within range', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      function FormWithRangeValidation() {
        const form = useForm({
          defaultValues: { date: '' },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <DateInput source="date" label="Date" min="2024-01-01" max="2024-12-31" />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithRangeValidation />)

      const input = screen.getByLabelText('Date')
      await user.type(input, '2024-06-15')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ date: '2024-06-15' }),
          expect.anything()
        )
      })
      expect(screen.queryByText(/Date must be/)).not.toBeInTheDocument()
    })

    it('allows custom minMessage for min validation', async () => {
      const user = userEvent.setup()

      function FormWithCustomMinMessage() {
        const form = useForm({
          defaultValues: { date: '' },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <DateInput
                source="date"
                label="Date"
                min="2024-06-01"
                minMessage="The date is too early"
              />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithCustomMinMessage />)

      const input = screen.getByLabelText('Date')
      await user.type(input, '2024-01-15')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('The date is too early')).toBeInTheDocument()
      })
    })

    it('allows custom maxMessage for max validation', async () => {
      const user = userEvent.setup()

      function FormWithCustomMaxMessage() {
        const form = useForm({
          defaultValues: { date: '' },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <DateInput
                source="date"
                label="Date"
                max="2024-06-30"
                maxMessage="The date is too late"
              />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithCustomMaxMessage />)

      const input = screen.getByLabelText('Date')
      await user.type(input, '2024-12-15')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('The date is too late')).toBeInTheDocument()
      })
    })

    it('does not validate empty value against min/max', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      function FormWithRangeValidation() {
        const form = useForm({
          defaultValues: { date: '' },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <DateInput source="date" label="Date" min="2024-01-01" max="2024-12-31" />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithRangeValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
      expect(screen.queryByText(/Date must be/)).not.toBeInTheDocument()
    })
  })
})
