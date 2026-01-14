/**
 * PasswordInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'

import { PasswordInput } from './PasswordInput'
import { FormContextProvider } from '../../contexts/FormContext'

// Helper component to wrap PasswordInput with form context
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

describe('<PasswordInput />', () => {
  it('renders input with type="password" by default', () => {
    render(
      <TestForm>
        <PasswordInput source="password" />
      </TestForm>
    )

    const input = screen.getByLabelText('password')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('name', 'password')
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <PasswordInput source="password" label="Password" />
      </TestForm>
    )

    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
  })

  it('renders show/hide toggle button', () => {
    render(
      <TestForm>
        <PasswordInput source="password" />
      </TestForm>
    )

    const toggleButton = screen.getByRole('button', { name: /show password|toggle password visibility/i })
    expect(toggleButton).toBeInTheDocument()
  })

  it('toggles password visibility when toggle button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <TestForm>
        <PasswordInput source="password" label="Password" />
      </TestForm>
    )

    const input = screen.getByLabelText('Password')
    const toggleButton = screen.getByRole('button', { name: /show password|toggle password visibility/i })

    // Initially password is hidden
    expect(input).toHaveAttribute('type', 'password')

    // Click to show password
    await user.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')

    // Click to hide password again
    await user.click(toggleButton)
    expect(input).toHaveAttribute('type', 'password')
  })

  it('integrates with react-hook-form and submits value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <PasswordInput source="password" label="Password" />
      </TestForm>
    )

    const input = screen.getByLabelText('Password')
    await user.type(input, 'secret123')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'secret123' }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue from form context', () => {
    render(
      <TestForm defaultValues={{ password: 'default123' }}>
        <PasswordInput source="password" label="Password" />
      </TestForm>
    )

    const input = screen.getByLabelText('Password')
    expect(input).toHaveValue('default123')
  })

  it('displays validation errors', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { password: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <PasswordInput
              source="password"
              label="Password"
              rules={{ required: 'Password is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('validates minimum length', async () => {
    const user = userEvent.setup()

    function FormWithMinLengthValidation() {
      const form = useForm({
        defaultValues: { password: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <PasswordInput
              source="password"
              label="Password"
              rules={{
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithMinLengthValidation />)

    const input = screen.getByLabelText('Password')
    await user.type(input, 'short')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })
  })

  it('supports disabled prop', () => {
    render(
      <TestForm>
        <PasswordInput source="password" disabled />
      </TestForm>
    )

    const input = screen.getByLabelText('password')
    expect(input).toBeDisabled()
  })

  it('supports required prop', () => {
    render(
      <TestForm>
        <PasswordInput source="password" label="Password" required />
      </TestForm>
    )

    // Use regex for partial label match when asterisk is present
    const input = screen.getByLabelText(/^Password/)
    expect(input).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('supports placeholder prop', () => {
    render(
      <TestForm>
        <PasswordInput source="password" placeholder="Enter password" />
      </TestForm>
    )

    const input = screen.getByLabelText('password')
    expect(input).toHaveAttribute('placeholder', 'Enter password')
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <PasswordInput source="password" helperText="Use a strong password" />
      </TestForm>
    )

    expect(screen.getByText('Use a strong password')).toBeInTheDocument()
  })

  it('supports autoComplete prop for password managers', () => {
    render(
      <TestForm>
        <PasswordInput source="password" autoComplete="new-password" />
      </TestForm>
    )

    const input = screen.getByLabelText('password')
    expect(input).toHaveAttribute('autoComplete', 'new-password')
  })

  it('toggle button does not submit the form', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <PasswordInput source="password" label="Password" />
      </TestForm>
    )

    const toggleButton = screen.getByRole('button', { name: /show password|toggle password visibility/i })
    await user.click(toggleButton)

    // Form should not have been submitted
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
