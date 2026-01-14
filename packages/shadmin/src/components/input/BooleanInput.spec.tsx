/**
 * BooleanInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'

import { BooleanInput } from './BooleanInput'
import { FormContextProvider } from '../../contexts/FormContext'

// Helper component to wrap BooleanInput with form context
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

describe('<BooleanInput />', () => {
  it('renders switch/toggle control with source as name', () => {
    render(
      <TestForm>
        <BooleanInput source="isActive" />
      </TestForm>
    )

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
    expect(switchElement).toHaveAttribute('name', 'isActive')
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <BooleanInput source="isActive" label="Active" />
      </TestForm>
    )

    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('uses source as label when label not provided', () => {
    render(
      <TestForm>
        <BooleanInput source="isActive" />
      </TestForm>
    )

    expect(screen.getByText('isActive')).toBeInTheDocument()
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <BooleanInput source="isActive" label={false} />
      </TestForm>
    )

    expect(screen.getByRole('switch')).toBeInTheDocument()
    expect(screen.queryByText('isActive')).not.toBeInTheDocument()
  })

  it('integrates with react-hook-form and toggles value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <BooleanInput source="isActive" label="Active" />
      </TestForm>
    )

    const switchElement = screen.getByRole('switch')

    // Initially unchecked (false)
    expect(switchElement).not.toBeChecked()

    // Toggle to true
    await user.click(switchElement)
    expect(switchElement).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: true }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue true from form context', () => {
    render(
      <TestForm defaultValues={{ isActive: true }}>
        <BooleanInput source="isActive" label="Active" />
      </TestForm>
    )

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
  })

  it('handles defaultValue false from form context', () => {
    render(
      <TestForm defaultValues={{ isActive: false }}>
        <BooleanInput source="isActive" label="Active" />
      </TestForm>
    )

    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()
  })

  it('toggles from true to false', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm defaultValues={{ isActive: true }} onSubmit={onSubmit}>
        <BooleanInput source="isActive" label="Active" />
      </TestForm>
    )

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()

    // Toggle to false
    await user.click(switchElement)
    expect(switchElement).not.toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
        expect.anything()
      )
    })
  })

  it('supports disabled prop', () => {
    render(
      <TestForm>
        <BooleanInput source="isActive" disabled />
      </TestForm>
    )

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeDisabled()
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()

    render(
      <TestForm defaultValues={{ isActive: false }}>
        <BooleanInput source="isActive" disabled />
      </TestForm>
    )

    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()

    await user.click(switchElement)
    expect(switchElement).not.toBeChecked()
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <BooleanInput source="isActive" helperText="Enable this feature" />
      </TestForm>
    )

    expect(screen.getByText('Enable this feature')).toBeInTheDocument()
  })

  it('supports className prop for custom styling', () => {
    render(
      <TestForm>
        <BooleanInput source="isActive" className="custom-class" />
      </TestForm>
    )

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('custom-class')
  })

  it('supports fullWidth prop', () => {
    render(
      <TestForm>
        <BooleanInput source="isActive" fullWidth />
      </TestForm>
    )

    const container = screen.getByRole('switch').closest('.space-y-2')
    expect(container).toHaveClass('w-full')
  })

  it('displays validation errors', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { acceptTerms: false },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <BooleanInput
              source="acceptTerms"
              label="Accept Terms"
              rules={{
                validate: (value) => value === true || 'You must accept the terms'
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('You must accept the terms')).toBeInTheDocument()
    })
  })

  it('has proper aria attributes for accessibility', () => {
    render(
      <TestForm>
        <BooleanInput source="isActive" label="Active" />
      </TestForm>
    )

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-checked')
  })

  it('associates label with switch correctly', () => {
    render(
      <TestForm>
        <BooleanInput source="isActive" label="Active" />
      </TestForm>
    )

    const label = screen.getByText('Active')
    const switchElement = screen.getByRole('switch')

    // Label should be clickable to toggle switch
    expect(label.closest('label')).toContainElement(switchElement)
  })
})
