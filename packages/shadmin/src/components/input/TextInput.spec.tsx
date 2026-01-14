/**
 * TextInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'

import { TextInput } from './TextInput'
import { FormContextProvider } from '../../contexts/FormContext'

// Helper component to wrap TextInput with form context
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

describe('<TextInput />', () => {
  it('renders input with source as name attribute', () => {
    render(
      <TestForm>
        <TextInput source="firstName" />
      </TestForm>
    )

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'firstName')
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <TextInput source="firstName" label="First Name" />
      </TestForm>
    )

    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByText('First Name')).toBeInTheDocument()
  })

  it('uses source as label when label not provided', () => {
    render(
      <TestForm>
        <TextInput source="firstName" />
      </TestForm>
    )

    // Should capitalize and humanize the source
    expect(screen.getByLabelText('firstName')).toBeInTheDocument()
  })

  it('supports placeholder prop', () => {
    render(
      <TestForm>
        <TextInput source="email" placeholder="Enter your email" />
      </TestForm>
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', 'Enter your email')
  })

  it('supports disabled prop', () => {
    render(
      <TestForm>
        <TextInput source="email" disabled />
      </TestForm>
    )

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('supports required prop and shows asterisk', () => {
    render(
      <TestForm>
        <TextInput source="email" label="Email" required />
      </TestForm>
    )

    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
    // Should show asterisk in label
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('integrates with react-hook-form and updates value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <TextInput source="username" />
      </TestForm>
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'john_doe')

    expect(input).toHaveValue('john_doe')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'john_doe' }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue from form context', () => {
    render(
      <TestForm defaultValues={{ firstName: 'John' }}>
        <TextInput source="firstName" />
      </TestForm>
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('John')
  })

  it('displays validation errors', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { email: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form
            onSubmit={form.handleSubmit(() => {})}
            noValidate
          >
            <TextInput
              source="email"
              label="Email"
              rules={{ required: 'Email is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('displays pattern validation error', async () => {
    const user = userEvent.setup()

    function FormWithPatternValidation() {
      const form = useForm({
        defaultValues: { email: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <TextInput
              source="email"
              label="Email"
              rules={{
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format',
                },
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithPatternValidation />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'invalid-email')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument()
    })
  })

  it('supports className prop for custom styling', () => {
    render(
      <TestForm>
        <TextInput source="name" className="custom-class" />
      </TestForm>
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('supports readOnly prop', () => {
    render(
      <TestForm defaultValues={{ name: 'Read Only Value' }}>
        <TextInput source="name" readOnly />
      </TestForm>
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <TextInput source="username" helperText="Choose a unique username" />
      </TestForm>
    )

    expect(screen.getByText('Choose a unique username')).toBeInTheDocument()
  })

  it('supports autoFocus prop', () => {
    render(
      <TestForm>
        <TextInput source="search" autoFocus />
      </TestForm>
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveFocus()
  })

  it('supports maxLength prop', () => {
    render(
      <TestForm>
        <TextInput source="bio" maxLength={100} />
      </TestForm>
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('maxLength', '100')
  })

  it('supports inputProps for additional input attributes', () => {
    render(
      <TestForm>
        <TextInput
          source="phone"
          inputProps={{ 'data-testid': 'phone-input', autoComplete: 'tel' } as React.InputHTMLAttributes<HTMLInputElement> & { 'data-testid': string }}
        />
      </TestForm>
    )

    const input = screen.getByTestId('phone-input')
    expect(input).toHaveAttribute('autoComplete', 'tel')
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <TextInput source="hiddenLabel" label={false} />
      </TestForm>
    )

    // Input should exist but without visible label
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByText('hiddenLabel')).not.toBeInTheDocument()
  })

  it('supports fullWidth prop', () => {
    render(
      <TestForm>
        <TextInput source="description" fullWidth />
      </TestForm>
    )

    const container = screen.getByRole('textbox').closest('div')
    expect(container).toHaveClass('w-full')
  })
})
