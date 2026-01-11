/**
 * Validate Prop Integration Tests
 *
 * Tests for the `validate` prop on input components that provides
 * ReactAdmin compatibility. The validate prop accepts ReactAdmin-style
 * validator functions and adapts them to work with react-hook-form.
 *
 * ReactAdmin API:
 * <TextInput validate={[required(), minLength(3)]} />
 *
 * Shadmin native API (react-hook-form rules):
 * <TextInput rules={{ required: 'Required', minLength: { value: 3 } }} />
 *
 * The validate prop should work as an adapter layer that converts
 * ReactAdmin validators to react-hook-form validation.
 *
 * TDD Phase: RED - These tests should FAIL because implementation doesn't exist yet.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../contexts/FormContext'
import { TextInput } from '../components/input/TextInput'
import { required, minLength, maxLength, email, composeValidators } from './validators'

// Helper component to wrap inputs with form context
interface TestFormProps {
  children: React.ReactNode
  defaultValues?: Record<string, unknown>
  onSubmit?: (data: Record<string, unknown>) => void
  mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'all'
}

function TestForm({
  children,
  defaultValues = {},
  onSubmit = vi.fn(),
  mode = 'onSubmit',
}: TestFormProps) {
  const form = useForm({ defaultValues, mode })
  return (
    <FormContextProvider {...form} save={onSubmit}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {children}
        <button type="submit">Submit</button>
      </form>
    </FormContextProvider>
  )
}

describe('validate prop integration', () => {
  describe('TextInput with validate prop', () => {
    it('should accept validate prop with single validator', () => {
      render(
        <TestForm>
          <TextInput source="name" validate={required()} />
        </TestForm>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should accept validate prop with array of validators', () => {
      render(
        <TestForm>
          <TextInput
            source="name"
            validate={[required(), minLength(3)]}
          />
        </TestForm>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should show required error when field is empty', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput source="name" validate={required()} />
        </TestForm>
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument()
      })
    })

    it('should show minLength error when value is too short', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput source="name" validate={minLength(5)} />
        </TestForm>
      )

      await user.type(screen.getByRole('textbox'), 'abc')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Must be at least 5 characters')).toBeInTheDocument()
      })
    })

    it('should run all validators in array and show first error', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput
            source="name"
            validate={[required(), minLength(5), maxLength(10)]}
          />
        </TestForm>
      )

      // Empty - should show required error
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument()
      })
    })

    it('should show minLength error after required passes', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput
            source="name"
            validate={[required(), minLength(5)]}
          />
        </TestForm>
      )

      await user.type(screen.getByRole('textbox'), 'abc')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Must be at least 5 characters')).toBeInTheDocument()
      })
    })

    it('should submit successfully when all validators pass', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm onSubmit={onSubmit}>
          <TextInput
            source="name"
            validate={[required(), minLength(3), maxLength(20)]}
          />
        </TestForm>
      )

      await user.type(screen.getByRole('textbox'), 'Valid Name')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Valid Name' }),
          expect.anything()
        )
      })

      expect(screen.queryByText('Required')).not.toBeInTheDocument()
      expect(screen.queryByText(/Must be/)).not.toBeInTheDocument()
    })

    it('should work with email validator', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput source="email" validate={email()} />
        </TestForm>
      )

      await user.type(screen.getByRole('textbox'), 'invalid-email')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    it('should accept valid email', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm onSubmit={onSubmit}>
          <TextInput source="email" validate={email()} />
        </TestForm>
      )

      await user.type(screen.getByRole('textbox'), 'test@example.com.ai')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })

      expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument()
    })
  })

  describe('validate prop with rules prop', () => {
    it('should work alongside rules prop', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput
            source="email"
            validate={required()}
            rules={{ pattern: { value: /test/, message: 'Must contain test' } }}
          />
        </TestForm>
      )

      // Empty should fail on validate (required)
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument()
      })
    })

    it('should run validate validators before rules validators', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput
            source="email"
            validate={required()}
            rules={{ minLength: { value: 10, message: 'Rules minLength error' } }}
          />
        </TestForm>
      )

      // Empty should fail on validate first
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument()
      })

      // With value, should check rules
      await user.type(screen.getByRole('textbox'), 'short')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Rules minLength error')).toBeInTheDocument()
      })
    })

    it('should merge validate and rules validation', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestForm onSubmit={onSubmit}>
          <TextInput
            source="code"
            validate={[required(), minLength(3)]}
            rules={{ maxLength: { value: 10, message: 'Max 10 characters' } }}
          />
        </TestForm>
      )

      // Test that both validate and rules work
      await user.type(screen.getByRole('textbox'), 'ab')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument()
      })

      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'this is way too long for the field')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Max 10 characters')).toBeInTheDocument()
      })

      // Valid value should pass both
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'valid')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('validate error display', () => {
    it('should display error message below input', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput source="name" validate={required('Name is required')} />
        </TestForm>
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        const error = screen.getByText('Name is required')
        expect(error).toBeInTheDocument()
        expect(error).toHaveClass('text-destructive')
      })
    })

    it('should apply error styling to input', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput source="name" validate={required()} />
        </TestForm>
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        const input = screen.getByRole('textbox')
        expect(input).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('should clear error when value becomes valid', async () => {
      const user = userEvent.setup()

      render(
        <TestForm mode="onChange">
          <TextInput source="name" validate={required()} />
        </TestForm>
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument()
      })

      await user.type(screen.getByRole('textbox'), 'valid value')

      await waitFor(() => {
        expect(screen.queryByText('Required')).not.toBeInTheDocument()
      })
    })

    it('should hide helper text when error is shown', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput
            source="name"
            validate={required()}
            helperText="Enter your full name"
          />
        </TestForm>
      )

      // Helper text visible initially
      expect(screen.getByText('Enter your full name')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument()
        expect(screen.queryByText('Enter your full name')).not.toBeInTheDocument()
      })
    })
  })

  describe('async validators with validate prop', () => {
    it('should handle async validators', async () => {
      const user = userEvent.setup()

      const asyncUsernameValidator = async (value: unknown) => {
        await new Promise(resolve => setTimeout(resolve, 50))
        return value === 'taken' ? 'Username already taken' : undefined
      }

      render(
        <TestForm>
          <TextInput
            source="username"
            validate={[required(), asyncUsernameValidator]}
          />
        </TestForm>
      )

      await user.type(screen.getByRole('textbox'), 'taken')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Username already taken')).toBeInTheDocument()
      })
    })

    it('should pass with valid async validation', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      const asyncValidator = async (value: unknown) => {
        await new Promise(resolve => setTimeout(resolve, 50))
        return undefined // valid
      }

      render(
        <TestForm onSubmit={onSubmit}>
          <TextInput
            source="username"
            validate={[required(), asyncValidator]}
          />
        </TestForm>
      )

      await user.type(screen.getByRole('textbox'), 'valid_user')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('validate with composeValidators', () => {
    it('should work with composeValidators helper', async () => {
      const user = userEvent.setup()

      const composedValidator = composeValidators([
        required(),
        minLength(5),
        maxLength(20),
      ])

      render(
        <TestForm>
          <TextInput source="name" validate={composedValidator} />
        </TestForm>
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument()
      })

      await user.type(screen.getByRole('textbox'), 'abc')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByText('Must be at least 5 characters')).toBeInTheDocument()
      })
    })
  })

  describe('required indicator', () => {
    it('should show required indicator when validate includes required()', () => {
      render(
        <TestForm>
          <TextInput source="name" label="Name" validate={required()} />
        </TestForm>
      )

      // Should show asterisk for required field
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('should show required indicator when validate array includes required()', () => {
      render(
        <TestForm>
          <TextInput
            source="name"
            label="Name"
            validate={[required(), minLength(3)]}
          />
        </TestForm>
      )

      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('should not show required indicator when validate does not include required()', () => {
      render(
        <TestForm>
          <TextInput source="name" label="Name" validate={minLength(3)} />
        </TestForm>
      )

      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })
  })
})

describe('validate prop on other input components', () => {
  // Note: These tests ensure the validate prop works on other input types
  // Implementation should add validate prop to all input components

  it.todo('should work on NumberInput')
  it.todo('should work on SelectInput')
  it.todo('should work on DateInput')
  it.todo('should work on BooleanInput')
  it.todo('should work on AutocompleteInput')
})
