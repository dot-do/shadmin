/**
 * CheckboxGroupInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { CheckboxGroupInput } from './CheckboxGroupInput'

// Helper component to wrap CheckboxGroupInput with form context
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
  { id: 'read', name: 'Read' },
  { id: 'write', name: 'Write' },
  { id: 'delete', name: 'Delete' },
]

describe('<CheckboxGroupInput />', () => {
  it('renders checkboxes with source as name attribute', () => {
    render(
      <TestForm>
        <CheckboxGroupInput source="permissions" choices={defaultChoices} />
      </TestForm>
    )

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute('name', 'permissions')
    })
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <CheckboxGroupInput source="permissions" label="Permissions" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByText('Permissions')).toBeInTheDocument()
  })

  it('renders all choices as checkbox options', () => {
    render(
      <TestForm>
        <CheckboxGroupInput source="permissions" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByLabelText('Read')).toBeInTheDocument()
    expect(screen.getByLabelText('Write')).toBeInTheDocument()
    expect(screen.getByLabelText('Delete')).toBeInTheDocument()
  })

  it('supports custom optionValue and optionText props', () => {
    const customChoices = [
      { value: 'admin', label: 'Administrator' },
      { value: 'user', label: 'Regular User' },
    ]

    render(
      <TestForm>
        <CheckboxGroupInput
          source="roles"
          choices={customChoices}
          optionValue="value"
          optionText="label"
        />
      </TestForm>
    )

    const adminCheckbox = screen.getByLabelText('Administrator')
    const userCheckbox = screen.getByLabelText('Regular User')
    expect(adminCheckbox).toHaveAttribute('value', 'admin')
    expect(userCheckbox).toHaveAttribute('value', 'user')
  })

  it('integrates with react-hook-form and submits array of selected values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <CheckboxGroupInput source="permissions" label="Permissions" choices={defaultChoices} />
      </TestForm>
    )

    const readCheckbox = screen.getByLabelText('Read')
    const deleteCheckbox = screen.getByLabelText('Delete')
    await user.click(readCheckbox)
    await user.click(deleteCheckbox)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ permissions: ['read', 'delete'] }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue array from form context', () => {
    render(
      <TestForm defaultValues={{ permissions: ['read', 'write'] }}>
        <CheckboxGroupInput source="permissions" label="Permissions" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByLabelText('Read')).toBeChecked()
    expect(screen.getByLabelText('Write')).toBeChecked()
    expect(screen.getByLabelText('Delete')).not.toBeChecked()
  })

  it('displays validation errors', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { permissions: [] },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <CheckboxGroupInput
              source="permissions"
              label="Permissions"
              choices={defaultChoices}
              rules={{
                validate: (value: string[]) =>
                  (value && value.length > 0) || 'At least one permission is required',
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
      expect(screen.getByText('At least one permission is required')).toBeInTheDocument()
    })
  })

  it('supports disabled prop on all checkboxes', () => {
    render(
      <TestForm>
        <CheckboxGroupInput source="permissions" choices={defaultChoices} disabled />
      </TestForm>
    )

    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled()
    })
  })

  it('supports required prop', () => {
    render(
      <TestForm>
        <CheckboxGroupInput
          source="permissions"
          label="Permissions"
          choices={defaultChoices}
          required
        />
      </TestForm>
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <CheckboxGroupInput
          source="permissions"
          choices={defaultChoices}
          helperText="Select all applicable permissions"
        />
      </TestForm>
    )

    expect(screen.getByText('Select all applicable permissions')).toBeInTheDocument()
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <CheckboxGroupInput source="permissions" choices={defaultChoices} label={false} />
      </TestForm>
    )

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
    expect(screen.queryByText('permissions')).not.toBeInTheDocument()
  })

  it('supports optionText as function for custom rendering', () => {
    const choices = [
      { id: 'read', code: 'R', name: 'Read' },
      { id: 'write', code: 'W', name: 'Write' },
    ]

    render(
      <TestForm>
        <CheckboxGroupInput
          source="permissions"
          choices={choices}
          optionText={(choice: { code: string; name: string }) => `${choice.code} - ${choice.name}`}
        />
      </TestForm>
    )

    expect(screen.getByLabelText('R - Read')).toBeInTheDocument()
    expect(screen.getByLabelText('W - Write')).toBeInTheDocument()
  })

  it('handles toggling selections correctly', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit} defaultValues={{ permissions: ['read'] }}>
        <CheckboxGroupInput source="permissions" choices={defaultChoices} />
      </TestForm>
    )

    // Initially read is selected
    expect(screen.getByLabelText('Read')).toBeChecked()

    // Add write
    await user.click(screen.getByLabelText('Write'))
    expect(screen.getByLabelText('Write')).toBeChecked()

    // Remove read
    await user.click(screen.getByLabelText('Read'))
    expect(screen.getByLabelText('Read')).not.toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ permissions: ['write'] }),
        expect.anything()
      )
    })
  })

  it('supports row layout direction', () => {
    render(
      <TestForm>
        <CheckboxGroupInput source="permissions" choices={defaultChoices} row />
      </TestForm>
    )

    const checkboxGroup = screen.getAllByRole('checkbox')[0].closest('[role="group"]')
    expect(checkboxGroup).toHaveClass('flex-row')
  })

  it('supports disableValue to disable specific options', () => {
    const choicesWithDisabled = [
      { id: 'read', name: 'Read', disabled: false },
      { id: 'write', name: 'Write', disabled: true },
      { id: 'delete', name: 'Delete', disabled: false },
    ]

    render(
      <TestForm>
        <CheckboxGroupInput
          source="permissions"
          choices={choicesWithDisabled}
          disableValue="disabled"
        />
      </TestForm>
    )

    expect(screen.getByLabelText('Read')).not.toBeDisabled()
    expect(screen.getByLabelText('Write')).toBeDisabled()
    expect(screen.getByLabelText('Delete')).not.toBeDisabled()
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
        <CheckboxGroupInput source="numbers" label="Numbers" choices={numberChoices} />
      </TestForm>
    )

    await user.click(screen.getByLabelText('One'))
    await user.click(screen.getByLabelText('Three'))

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ numbers: ['1', '3'] }),
        expect.anything()
      )
    })
  })

  it('submits empty array when no checkboxes are selected', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit} defaultValues={{ permissions: [] }}>
        <CheckboxGroupInput source="permissions" choices={defaultChoices} />
      </TestForm>
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ permissions: [] }),
        expect.anything()
      )
    })
  })

  it('maintains correct order of selections', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <CheckboxGroupInput source="permissions" choices={defaultChoices} />
      </TestForm>
    )

    // Select in order: delete, read, write
    await user.click(screen.getByLabelText('Delete'))
    await user.click(screen.getByLabelText('Read'))
    await user.click(screen.getByLabelText('Write'))

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ permissions: ['delete', 'read', 'write'] }),
        expect.anything()
      )
    })
  })
})
