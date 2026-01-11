/**
 * SimpleFormIterator Component Tests
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
import { NumberInput } from './NumberInput'

// Helper component to wrap with form context
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

describe('<SimpleFormIterator />', () => {
  describe('rendering children', () => {
    it('renders children for each array item', () => {
      render(
        <TestForm defaultValues={{ items: [{ name: 'Item 1' }, { name: 'Item 2' }] }}>
          <ArrayInput source="items">
            <SimpleFormIterator>
              <TextInput source="name" label="Name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toHaveValue('Item 1')
      expect(inputs[1]).toHaveValue('Item 2')
    })

    it('renders multiple children per item', () => {
      render(
        <TestForm defaultValues={{ products: [{ name: 'Widget', price: 100 }] }}>
          <ArrayInput source="products">
            <SimpleFormIterator>
              <TextInput source="name" label="Name" />
              <NumberInput source="price" label="Price" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.getByLabelText('Name')).toHaveValue('Widget')
      expect(screen.getByLabelText('Price')).toHaveValue(100)
    })

    it('renders empty state when no items', () => {
      render(
        <TestForm defaultValues={{ items: [] }}>
          <ArrayInput source="items">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // No inputs should be rendered
      expect(screen.queryAllByRole('textbox')).toHaveLength(0)
      // Add button should still be visible
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
    })
  })

  describe('add button', () => {
    it('renders add button', () => {
      render(
        <TestForm defaultValues={{ items: [] }}>
          <ArrayInput source="items">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
    })

    it('adds new item with default value when clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestForm defaultValues={{ tags: [] }}>
          <ArrayInput source="tags" defaultValue={{ name: 'New Tag' }}>
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      await user.click(screen.getByRole('button', { name: /add/i }))

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue('New Tag')
      })
    })

    it('adds new item with empty object when no defaultValue', async () => {
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

      await user.click(screen.getByRole('button', { name: /add/i }))

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue('')
      })
    })

    it('disables add button when at maxItems', () => {
      render(
        <TestForm defaultValues={{ items: [{ name: 'A' }, { name: 'B' }] }}>
          <ArrayInput source="items" maxItems={2}>
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
    })

    it('supports custom add button text', () => {
      render(
        <TestForm defaultValues={{ items: [] }}>
          <ArrayInput source="items">
            <SimpleFormIterator addButton="Add New Item">
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.getByRole('button', { name: /add new item/i })).toBeInTheDocument()
    })

    it('hides add button when disableAdd is true', () => {
      render(
        <TestForm defaultValues={{ items: [] }}>
          <ArrayInput source="items">
            <SimpleFormIterator disableAdd>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument()
    })
  })

  describe('remove button', () => {
    it('renders remove button for each item', () => {
      render(
        <TestForm defaultValues={{ items: [{ name: 'A' }, { name: 'B' }] }}>
          <ArrayInput source="items">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      expect(removeButtons).toHaveLength(2)
    })

    it('removes item when clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestForm defaultValues={{ items: [{ name: 'First' }, { name: 'Second' }] }}>
          <ArrayInput source="items">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      await user.click(removeButtons[0]!)

      await waitFor(() => {
        expect(screen.getAllByRole('textbox')).toHaveLength(1)
        expect(screen.getByRole('textbox')).toHaveValue('Second')
      })
    })

    it('disables remove button when at minItems', () => {
      render(
        <TestForm defaultValues={{ items: [{ name: 'Only' }] }}>
          <ArrayInput source="items" minItems={1}>
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled()
    })

    it('hides remove button when disableRemove is true', () => {
      render(
        <TestForm defaultValues={{ items: [{ name: 'Test' }] }}>
          <ArrayInput source="items">
            <SimpleFormIterator disableRemove>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
    })
  })

  describe('disabled state', () => {
    it('disables all children when ArrayInput is disabled', () => {
      render(
        <TestForm defaultValues={{ items: [{ name: 'Test' }] }}>
          <ArrayInput source="items" disabled>
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.getByRole('textbox')).toBeDisabled()
      expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled()
    })
  })

  describe('item ordering', () => {
    it('maintains correct item order after operations', async () => {
      const user = userEvent.setup()

      render(
        <TestForm defaultValues={{ items: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] }}>
          <ArrayInput source="items">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // Remove middle item
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      await user.click(removeButtons[1]!)

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox')
        expect(inputs).toHaveLength(2)
        expect(inputs[0]).toHaveValue('A')
        expect(inputs[1]).toHaveValue('C')
      })
    })
  })

  describe('inline mode', () => {
    it('renders items inline when inline prop is true', () => {
      render(
        <TestForm defaultValues={{ tags: [{ name: 'Tag1' }, { name: 'Tag2' }] }}>
          <ArrayInput source="tags">
            <SimpleFormIterator inline>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // Check for inline layout class
      const itemContainers = screen.getAllByRole('textbox').map(input => input.closest('[data-array-item]'))
      itemContainers.forEach(container => {
        expect(container?.parentElement).toHaveClass('flex-row')
      })
    })
  })

  describe('getItemLabel', () => {
    it('uses getItemLabel for item labeling', () => {
      render(
        <TestForm defaultValues={{ items: [{ name: 'A' }, { name: 'B' }] }}>
          <ArrayInput source="items">
            <SimpleFormIterator getItemLabel={(index) => `Item ${index + 1}`}>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('form integration', () => {
    it('correctly submits array data', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm
          defaultValues={{ items: [{ name: 'Initial' }] }}
          onSubmit={onSubmit}
        >
          <ArrayInput source="items">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // Add a new item
      await user.click(screen.getByRole('button', { name: /add/i }))

      await waitFor(() => {
        expect(screen.getAllByRole('textbox')).toHaveLength(2)
      })

      // Type in the new item
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[1]!, 'Added')

      // Submit
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            items: [{ name: 'Initial' }, { name: 'Added' }],
          }),
          expect.anything()
        )
      })
    })

    it('correctly updates existing items', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm
          defaultValues={{ items: [{ name: 'Original' }] }}
          onSubmit={onSubmit}
        >
          <ArrayInput source="items">
            <SimpleFormIterator>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </TestForm>
      )

      // Clear and type new value
      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, 'Updated')

      // Submit
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            items: [{ name: 'Updated' }],
          }),
          expect.anything()
        )
      })
    })
  })

  describe('error display', () => {
    it('displays error per item when validation fails', async () => {
      const user = userEvent.setup()

      function FormWithItemValidation() {
        const form = useForm({
          defaultValues: {
            items: [{ name: '' }, { name: 'Valid' }]
          },
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

      render(<FormWithItemValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        // Should display error for the first item only
        expect(screen.getByText('Name is required')).toBeInTheDocument()
      })
    })

    it('highlights items with errors using error styling', async () => {
      const user = userEvent.setup()

      function FormWithItemError() {
        const form = useForm({
          defaultValues: {
            items: [{ name: '' }]
          },
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

      render(<FormWithItemError />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        // Input should have error styling (aria-invalid)
        const input = screen.getByRole('textbox')
        expect(input).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('shows errors for multiple items independently', async () => {
      const user = userEvent.setup()

      function FormWithMultipleItemErrors() {
        const form = useForm({
          defaultValues: {
            items: [{ name: '' }, { name: '' }, { name: 'Valid' }]
          },
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

      render(<FormWithMultipleItemErrors />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        // Should display errors for first two items
        const errors = screen.getAllByText('Name is required')
        expect(errors).toHaveLength(2)
      })
    })

    it('clears item error when field is corrected', async () => {
      const user = userEvent.setup()

      function FormWithCorrectableError() {
        const form = useForm({
          defaultValues: {
            items: [{ name: '' }]
          },
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

      render(<FormWithCorrectableError />)

      // First submit should show error
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
      })

      // Fix the error by typing in the field
      const input = screen.getByRole('textbox')
      await user.type(input, 'Fixed')

      // Submit again - error should be gone
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
      })
    })

    it('applies error highlight class to item container when item has errors', async () => {
      const user = userEvent.setup()

      function FormWithErrorHighlight() {
        const form = useForm({
          defaultValues: {
            items: [{ name: '' }]
          },
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

      render(<FormWithErrorHighlight />)

      const itemContainer = screen.getByRole('textbox').closest('[data-array-item]')

      // Before validation, no error class
      expect(itemContainer).not.toHaveAttribute('data-has-error')

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // After validation fails, error class should be applied
      await waitFor(() => {
        expect(itemContainer).toHaveAttribute('data-has-error', 'true')
      })
    })
  })
})
