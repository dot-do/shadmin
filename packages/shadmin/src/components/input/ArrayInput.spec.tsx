/**
 * ArrayInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { ArrayInput } from './ArrayInput'
import { SimpleFormIterator } from './SimpleFormIterator'
import { TextInput } from './TextInput'

// Helper component to wrap ArrayInput with form context
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

describe('<ArrayInput />', () => {
  describe('base container', () => {
    it('renders with source as field name', () => {
      render(
        <TestForm defaultValues={{ tags: [] }}>
          <ArrayInput source="tags">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // Should render container with appropriate role
      expect(screen.getByRole('group')).toBeInTheDocument()
    })

    it('renders label when provided', () => {
      render(
        <TestForm defaultValues={{ addresses: [] }}>
          <ArrayInput source="addresses" label="Addresses">
            <SimpleFormIterator>
              <TextInput source="street" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.getByText('Addresses')).toBeInTheDocument()
    })

    it('uses source as label when label not provided', () => {
      render(
        <TestForm defaultValues={{ contacts: [] }}>
          <ArrayInput source="contacts">
            <SimpleFormIterator>
              <TextInput source="email" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.getByText('contacts')).toBeInTheDocument()
    })

    it('hides label when label is false', () => {
      render(
        <TestForm defaultValues={{ items: [] }}>
          <ArrayInput source="items" label={false}>
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.queryByText('items')).not.toBeInTheDocument()
    })

    it('renders with defaultValue items', () => {
      render(
        <TestForm defaultValues={{ tags: [{ name: 'React' }, { name: 'TypeScript' }] }}>
          <ArrayInput source="tags">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toHaveValue('React')
      expect(inputs[1]).toHaveValue('TypeScript')
    })

    it('supports disabled prop', () => {
      render(
        <TestForm defaultValues={{ tags: [{ name: 'Test' }] }}>
          <ArrayInput source="tags" disabled>
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('supports helperText prop', () => {
      render(
        <TestForm defaultValues={{ tags: [] }}>
          <ArrayInput source="tags" helperText="Add your tags here">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.getByText('Add your tags here')).toBeInTheDocument()
    })

    it('supports fullWidth prop', () => {
      render(
        <TestForm defaultValues={{ tags: [] }}>
          <ArrayInput source="tags" fullWidth>
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      const container = screen.getByRole('group')
      expect(container).toHaveClass('w-full')
    })

    it('supports className prop for custom styling', () => {
      render(
        <TestForm defaultValues={{ tags: [] }}>
          <ArrayInput source="tags" className="custom-class">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      const container = screen.getByRole('group')
      expect(container).toHaveClass('custom-class')
    })
  })

  describe('add/remove items', () => {
    it('adds a new item when add button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestForm defaultValues={{ tags: [] }}>
          <ArrayInput source="tags">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // Initially no inputs
      expect(screen.queryAllByRole('textbox')).toHaveLength(0)

      // Click add button
      const addButton = screen.getByRole('button', { name: /add/i })
      await user.click(addButton)

      // Now should have one input
      await waitFor(() => {
        expect(screen.getAllByRole('textbox')).toHaveLength(1)
      })
    })

    it('removes an item when remove button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestForm defaultValues={{ tags: [{ name: 'React' }, { name: 'TypeScript' }] }}>
          <ArrayInput source="tags">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // Initially two inputs
      expect(screen.getAllByRole('textbox')).toHaveLength(2)

      // Click first remove button
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      await user.click(removeButtons[0])

      // Now should have one input with TypeScript
      await waitFor(() => {
        expect(screen.getAllByRole('textbox')).toHaveLength(1)
        expect(screen.getByRole('textbox')).toHaveValue('TypeScript')
      })
    })

    it('respects minItems and disables remove when at minimum', () => {
      render(
        <TestForm defaultValues={{ tags: [{ name: 'Required' }] }}>
          <ArrayInput source="tags" minItems={1}>
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      const removeButton = screen.getByRole('button', { name: /remove/i })
      expect(removeButton).toBeDisabled()
    })

    it('respects maxItems and disables add when at maximum', () => {
      render(
        <TestForm defaultValues={{ tags: [{ name: 'Tag1' }, { name: 'Tag2' }] }}>
          <ArrayInput source="tags" maxItems={2}>
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      const addButton = screen.getByRole('button', { name: /add/i })
      expect(addButton).toBeDisabled()
    })

    it('submits form with array data', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm defaultValues={{ tags: [{ name: 'React' }] }} onSubmit={onSubmit}>
          <ArrayInput source="tags">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // Add a new tag
      const addButton = screen.getByRole('button', { name: /add/i })
      await user.click(addButton)

      // Wait for new input and type in it
      await waitFor(() => {
        expect(screen.getAllByRole('textbox')).toHaveLength(2)
      })

      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[1], 'TypeScript')

      // Submit
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: [{ name: 'React' }, { name: 'TypeScript' }],
          }),
          expect.anything()
        )
      })
    })

    it('handles nested object arrays', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm
          defaultValues={{
            addresses: [{ street: '123 Main St', city: 'New York' }],
          }}
          onSubmit={onSubmit}
        >
          <ArrayInput source="addresses">
            <SimpleFormIterator>
              <TextInput source="street" label="Street" />
              <TextInput source="city" label="City" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // Should have 2 inputs (street and city)
      expect(screen.getAllByRole('textbox')).toHaveLength(2)
      expect(screen.getByLabelText('Street')).toHaveValue('123 Main St')
      expect(screen.getByLabelText('City')).toHaveValue('New York')

      // Submit
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            addresses: [{ street: '123 Main St', city: 'New York' }],
          }),
          expect.anything()
        )
      })
    })

    it('uses defaultValue prop for new items', async () => {
      const user = userEvent.setup()

      render(
        <TestForm defaultValues={{ tags: [] }}>
          <ArrayInput source="tags" defaultValue={{ name: 'Default Tag', priority: 1 }}>
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // Click add button
      const addButton = screen.getByRole('button', { name: /add/i })
      await user.click(addButton)

      // New input should have default value
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue('Default Tag')
      })
    })
  })

  describe('validation', () => {
    it('displays validation error when array is empty and required', async () => {
      const user = userEvent.setup()

      function FormWithValidation() {
        const form = useForm({
          defaultValues: { tags: [] },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ArrayInput
                source="tags"
                rules={{ validate: (v) => (v.length > 0 ? true : 'At least one tag is required') }}
              >
                <SimpleFormIterator>
                  <TextInput source="name" />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('At least one tag is required')).toBeInTheDocument()
      })
    })

    it('validates nested fields individually', async () => {
      const user = userEvent.setup()

      function FormWithNestedValidation() {
        const form = useForm({
          defaultValues: { items: [{ name: '' }] },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ArrayInput source="items">
                <SimpleFormIterator>
                  <TextInput source="name" rules={{ required: 'Name is required' }} />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithNestedValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
      })
    })

    it('shows errors for individual array items', async () => {
      const user = userEvent.setup()

      function FormWithItemValidation() {
        const form = useForm({
          defaultValues: {
            contacts: [
              { email: '' },
              { email: 'valid@email.com' }
            ]
          },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ArrayInput source="contacts">
                <SimpleFormIterator>
                  <TextInput
                    source="email"
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format',
                      }
                    }}
                  />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithItemValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        // First item should show error, second should not
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })
    })

    it('shows array-level errors for minItems constraint', async () => {
      const user = userEvent.setup()

      function FormWithMinItemsValidation() {
        const form = useForm({
          defaultValues: { tags: [{ name: 'One' }] },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ArrayInput
                source="tags"
                minItems={2}
                minItemsMessage="At least 2 items required"
              >
                <SimpleFormIterator>
                  <TextInput source="name" />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithMinItemsValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('At least 2 items required')).toBeInTheDocument()
      })
    })

    it('shows array-level errors for maxItems constraint', async () => {
      const user = userEvent.setup()

      function FormWithMaxItemsValidation() {
        const form = useForm({
          defaultValues: { tags: [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }] },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ArrayInput
                source="tags"
                maxItems={2}
                maxItemsMessage="Maximum 2 items allowed"
              >
                <SimpleFormIterator>
                  <TextInput source="name" />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithMaxItemsValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Maximum 2 items allowed')).toBeInTheDocument()
      })
    })

    it('uses default minItems error message when not provided', async () => {
      const user = userEvent.setup()

      function FormWithDefaultMinItemsMessage() {
        const form = useForm({
          defaultValues: { tags: [{ name: 'One' }] },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ArrayInput source="tags" minItems={2}>
                <SimpleFormIterator>
                  <TextInput source="name" />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithDefaultMinItemsMessage />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Minimum 2 items required')).toBeInTheDocument()
      })
    })

    it('uses default maxItems error message when not provided', async () => {
      const user = userEvent.setup()

      function FormWithDefaultMaxItemsMessage() {
        const form = useForm({
          defaultValues: { tags: [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }] },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ArrayInput source="tags" maxItems={2}>
                <SimpleFormIterator>
                  <TextInput source="name" />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithDefaultMaxItemsMessage />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Maximum 2 items allowed')).toBeInTheDocument()
      })
    })

    it('clears validation errors when constraints are satisfied', async () => {
      const user = userEvent.setup()

      function FormWithDynamicValidation() {
        const form = useForm({
          defaultValues: { tags: [{ name: 'One' }] },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ArrayInput source="tags" minItems={2}>
                <SimpleFormIterator>
                  <TextInput source="name" />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithDynamicValidation />)

      // First submit should show error
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Minimum 2 items required')).toBeInTheDocument()
      })

      // Add another item
      await user.click(screen.getByRole('button', { name: /add/i }))

      // Wait for new item to appear
      await waitFor(() => {
        expect(screen.getAllByRole('textbox')).toHaveLength(2)
      })

      // Type in the new item
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[1], 'Two')

      // Submit again - error should be cleared
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.queryByText('Minimum 2 items required')).not.toBeInTheDocument()
      })
    })

    it('integrates with form-level validation', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      function FormWithFormLevelValidation() {
        const form = useForm({
          defaultValues: {
            name: '',
            tags: [{ name: 'Tag1' }]
          },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form} save={onSubmit}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <TextInput source="name" rules={{ required: 'Name is required' }} />
              <ArrayInput source="tags" minItems={2} minItemsMessage="At least 2 tags required">
                <SimpleFormIterator>
                  <TextInput source="name" />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithFormLevelValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // Both errors should be shown
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
        expect(screen.getByText('At least 2 tags required')).toBeInTheDocument()
      })

      // onSubmit should not have been called
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('sets aria-invalid on array container when validation fails', async () => {
      const user = userEvent.setup()

      function FormWithAriaValidation() {
        const form = useForm({
          defaultValues: { tags: [{ name: 'One' }] },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ArrayInput source="tags" minItems={2}>
                <SimpleFormIterator>
                  <TextInput source="name" />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithAriaValidation />)

      const arrayContainer = screen.getByRole('group')
      expect(arrayContainer).not.toHaveAttribute('aria-invalid')

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(arrayContainer).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('combines minItems/maxItems validation with custom rules', async () => {
      const user = userEvent.setup()

      function FormWithCombinedValidation() {
        const form = useForm({
          defaultValues: { tags: [] },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <ArrayInput
                source="tags"
                minItems={1}
                rules={{ validate: (v) => (v.length > 0 ? true : 'Custom: At least one tag required') }}
              >
                <SimpleFormIterator>
                  <TextInput source="name" />
                </SimpleFormIterator>
              </ArrayInput>
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithCombinedValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // Custom rule message should appear (custom rules take precedence)
      await waitFor(() => {
        expect(screen.getByText(/at least one tag/i)).toBeInTheDocument()
      })
    })
  })
})
