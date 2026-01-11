/**
 * SimpleForm Component Test Suite
 *
 * This comprehensive test suite validates the SimpleForm component which provides
 * a complete form solution integrating react-hook-form with shadmin's admin framework.
 *
 * KEY CONCEPTS TESTED:
 * 1. Basic Props Interface - Children rendering, className/id, resource/record context passing
 * 2. react-hook-form Integration - defaultValues, onSubmit, mode/reValidateMode props
 * 3. FormContext Provider - Exposing form methods to children via useFormContext
 * 4. Validation Handling - Required fields, async validation, error display, resolver support
 * 5. Dirty State Tracking - isDirty, resetOnSubmit, pristine when values match default
 * 6. Submit Button with Loading State - Default save button, loading spinner, disabled when invalid
 * 7. Error Display - Submit error handling, clearable errors, custom onError handler
 * 8. warnWhenUnsavedChanges - beforeunload event handling for unsaved form protection
 * 9. Additional Features - noValidate, sanitizeEmptyValues, transform, onSuccess callback
 *
 * WHY THESE TESTS MATTER:
 * - SimpleForm is THE primary form component for Create/Edit views in shadmin
 * - Proper react-hook-form integration ensures form state, validation, and submission work correctly
 * - Context providers must expose all necessary form methods for custom child components
 * - Dirty state tracking enables "unsaved changes" warnings and conditional UI
 * - The validation system must support both synchronous rules and async server-side validation
 * - Transform and sanitize features enable data normalization before submission
 *
 * TEST SETUP:
 * - renderSimpleForm() helper waits for react-hook-form async initialization
 * - FormContextDisplay/ShadminContextDisplay components expose context for assertions
 * - userEvent provides realistic form interactions (typing, clicking, tabbing)
 * - waitFor handles async validation and submission scenarios
 * - beforeunload event mocking for warnWhenUnsavedChanges tests
 *
 * RELATED COMPONENTS TESTED:
 * - FormDataConsumer - Render prop component for accessing form data reactively
 * - useFormData hook - Hook alternative to FormDataConsumer
 * - Toolbar - Container for form action buttons
 * - SaveButton - Submit button with loading state
 * - DeleteButton - Delete action with confirmation dialog
 *
 * EDGE CASES COVERED:
 * - Multiple validation errors on different fields
 * - Async validation functions
 * - Submission during pending async operation
 * - Form reset after successful submission
 * - warnWhenUnsavedChanges lifecycle (mount, dirty, pristine, unmount)
 * - Custom resolver for schema validation (e.g., Zod)
 * - Transform function modifying data before onSubmit
 * - Empty value sanitization removing blank strings
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act, type RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, useFormContext } from 'react-hook-form'
import { SimpleForm, type SimpleFormProps } from './SimpleForm'
import { FormDataConsumer, useFormData } from './FormDataConsumer'
import { Toolbar, SaveButton, DeleteButton } from './Toolbar'
import { TextInput } from '../input/TextInput'
import { useShadminFormContext } from '../../contexts/FormContext'

/**
 * Helper to render SimpleForm and wait for react-hook-form to initialize.
 * This ensures all async state updates from useForm are complete before assertions.
 */
async function renderSimpleForm(ui: React.ReactElement): Promise<RenderResult> {
  let result: RenderResult
  await act(async () => {
    result = render(ui)
  })
  return result!
}

// Helper component that displays form context values for testing
function FormContextDisplay() {
  const { formState, getValues } = useFormContext()
  return (
    <div data-testid="form-context">
      <span data-testid="is-dirty">{formState.isDirty ? 'dirty' : 'pristine'}</span>
      <span data-testid="is-submitting">{formState.isSubmitting ? 'submitting' : 'idle'}</span>
      <span data-testid="is-valid">{formState.isValid ? 'valid' : 'invalid'}</span>
      <span data-testid="form-values">{JSON.stringify(getValues())}</span>
    </div>
  )
}

// Helper to display shadmin context values
function ShadminContextDisplay() {
  const { saving, resource, record } = useShadminFormContext()
  return (
    <div data-testid="shadmin-context">
      <span data-testid="saving">{saving ? 'saving' : 'not-saving'}</span>
      <span data-testid="resource">{resource || 'no-resource'}</span>
      <span data-testid="record-id">{record?.id || 'no-record'}</span>
    </div>
  )
}

describe('<SimpleForm />', () => {
  describe('Basic Props Interface', () => {
    it('renders children inside a form element', async () => {
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()}>
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
    })

    it('applies className to form element', async () => {
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} className="custom-form-class">
          <TextInput source="name" />
        </SimpleForm>
      )

      expect(screen.getByRole('form')).toHaveClass('custom-form-class')
    })

    it('applies id to form element', async () => {
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} id="my-form">
          <TextInput source="name" />
        </SimpleForm>
      )

      expect(screen.getByRole('form')).toHaveAttribute('id', 'my-form')
    })

    it('passes resource prop to form context', async () => {
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} resource="users">
          <ShadminContextDisplay />
        </SimpleForm>
      )

      expect(screen.getByTestId('resource')).toHaveTextContent('users')
    })

    it('passes record prop to form context', async () => {
      const record = { id: 123, name: 'Test User' }
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} record={record}>
          <ShadminContextDisplay />
        </SimpleForm>
      )

      expect(screen.getByTestId('record-id')).toHaveTextContent('123')
    })

    it('renders multiple children inputs', async () => {
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()}>
          <TextInput source="firstName" label="First Name" />
          <TextInput source="lastName" label="Last Name" />
          <TextInput source="email" label="Email" />
        </SimpleForm>
      )

      expect(screen.getByLabelText('First Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })

    it('renders inputs in a vertical stack layout', async () => {
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()}>
          <TextInput source="firstName" />
          <TextInput source="lastName" />
        </SimpleForm>
      )

      const form = screen.getByRole('form')
      // SimpleForm should use flex-col or space-y for vertical stacking
      expect(form.querySelector('.flex.flex-col') || form.querySelector('.space-y-4')).toBeTruthy()
    })
  })

  describe('react-hook-form Integration', () => {
    it('populates form with defaultValues', async () => {
      const defaultValues = { firstName: 'John', lastName: 'Doe' }
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} defaultValues={defaultValues}>
          <TextInput source="firstName" label="First Name" />
          <TextInput source="lastName" label="Last Name" />
        </SimpleForm>
      )

      expect(screen.getByLabelText('First Name')).toHaveValue('John')
      expect(screen.getByLabelText('Last Name')).toHaveValue('Doe')
    })

    it('calls onSubmit with form data when submitted', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      await renderSimpleForm(
        <SimpleForm onSubmit={onSubmit} defaultValues={{ name: '' }}>
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'John Doe' }),
          expect.anything()
        )
      })
    })

    it('supports async onSubmit handler', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
      })

      await renderSimpleForm(
        <SimpleForm onSubmit={onSubmit} defaultValues={{ name: 'Test' }}>
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it('supports mode prop for validation timing', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ email: '' }}
          mode="onChange"
        >
          <TextInput
            source="email"
            label="Email"
            rules={{ required: 'Email is required' }}
          />
        </SimpleForm>
      )

      const input = screen.getByLabelText('Email')
      await user.type(input, 'a')
      await user.clear(input)

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })
    })

    it('supports reValidateMode prop', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ name: '' }}
          mode="onSubmit"
          reValidateMode="onBlur"
        >
          <TextInput
            source="name"
            label="Name"
            rules={{ required: 'Name is required' }}
          />
        </SimpleForm>
      )

      // Submit to trigger initial validation
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
      })

      // Type a value
      await user.type(screen.getByLabelText('Name'), 'John')

      // Error should still show until blur (reValidateMode)
      // After blur, error should clear
      await user.tab()

      await waitFor(() => {
        expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
      })
    })
  })

  describe('FormContext Provider', () => {
    it('provides react-hook-form context to children', async () => {
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} defaultValues={{ test: 'value' }}>
          <FormContextDisplay />
        </SimpleForm>
      )

      expect(screen.getByTestId('form-values')).toHaveTextContent('{"test":"value"}')
    })

    it('provides shadmin form context to children', async () => {
      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          resource="posts"
          record={{ id: 1, title: 'Test' }}
        >
          <ShadminContextDisplay />
        </SimpleForm>
      )

      expect(screen.getByTestId('resource')).toHaveTextContent('posts')
      expect(screen.getByTestId('record-id')).toHaveTextContent('1')
    })

    it('children can access form methods through useFormContext', async () => {
      const user = userEvent.setup()

      function ChildWithFormAccess() {
        const { setValue } = useFormContext()
        return (
          <button type="button" onClick={() => setValue('name', 'Set Programmatically')}>
            Set Value
          </button>
        )
      }

      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} defaultValues={{ name: '' }}>
          <TextInput source="name" label="Name" />
          <ChildWithFormAccess />
        </SimpleForm>
      )

      await user.click(screen.getByRole('button', { name: 'Set Value' }))

      expect(screen.getByLabelText('Name')).toHaveValue('Set Programmatically')
    })
  })

  describe('Validation Handling', () => {
    it('prevents submission when validation fails', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      await renderSimpleForm(
        <SimpleForm onSubmit={onSubmit} defaultValues={{ email: '' }}>
          <TextInput
            source="email"
            label="Email"
            rules={{ required: 'Email is required' }}
          />
        </SimpleForm>
      )

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('displays validation errors for multiple fields', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} defaultValues={{ firstName: '', lastName: '' }}>
          <TextInput
            source="firstName"
            label="First Name"
            rules={{ required: 'First name is required' }}
          />
          <TextInput
            source="lastName"
            label="Last Name"
            rules={{ required: 'Last name is required' }}
          />
        </SimpleForm>
      )

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument()
        expect(screen.getByText('Last name is required')).toBeInTheDocument()
      })
    })

    it('supports async validation (validate function)', async () => {
      const user = userEvent.setup()
      const asyncValidate = vi.fn().mockImplementation(async (value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        return value === 'taken' ? 'Username is already taken' : true
      })

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ username: '' }}
          mode="onBlur"
        >
          <TextInput
            source="username"
            label="Username"
            rules={{ validate: asyncValidate }}
          />
        </SimpleForm>
      )

      await user.type(screen.getByLabelText('Username'), 'taken')
      await user.tab() // trigger onBlur validation

      await waitFor(() => {
        expect(screen.getByText('Username is already taken')).toBeInTheDocument()
      })
    })

    it('clears errors when valid input is provided', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ name: '' }}
          mode="onChange"
        >
          <TextInput
            source="name"
            label="Name"
            rules={{ required: 'Name is required' }}
          />
        </SimpleForm>
      )

      const input = screen.getByLabelText('Name')
      await user.type(input, 'a')
      await user.clear(input)

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
      })

      await user.type(input, 'John')

      await waitFor(() => {
        expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
      })
    })

    it('supports resolver prop for schema validation (e.g., zod)', async () => {
      // This test verifies the resolver prop is passed to useForm
      const user = userEvent.setup()
      const mockResolver = vi.fn().mockImplementation(async (values: Record<string, unknown>) => {
        const errors: Record<string, { type: string; message: string }> = {}
        if (!values.name) {
          errors.name = { type: 'required', message: 'Name is required by resolver' }
        }
        return {
          values: Object.keys(errors).length === 0 ? values : {},
          errors,
        }
      })

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ name: '' }}
          resolver={mockResolver}
        >
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(mockResolver).toHaveBeenCalled()
      })
    })
  })

  describe('Dirty State Tracking', () => {
    it('tracks dirty state when form values change', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} defaultValues={{ name: 'Original' }}>
          <TextInput source="name" label="Name" />
          <FormContextDisplay />
        </SimpleForm>
      )

      expect(screen.getByTestId('is-dirty')).toHaveTextContent('pristine')

      await user.clear(screen.getByLabelText('Name'))
      await user.type(screen.getByLabelText('Name'), 'Changed')

      await waitFor(() => {
        expect(screen.getByTestId('is-dirty')).toHaveTextContent('dirty')
      })
    })

    it('resets dirty state after successful submit', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ name: 'Original' }}
          resetOnSubmit
        >
          <TextInput source="name" label="Name" />
          <FormContextDisplay />
        </SimpleForm>
      )

      await user.clear(screen.getByLabelText('Name'))
      await user.type(screen.getByLabelText('Name'), 'Changed')

      await waitFor(() => {
        expect(screen.getByTestId('is-dirty')).toHaveTextContent('dirty')
      })

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByTestId('is-dirty')).toHaveTextContent('pristine')
      })
    })

    it('returns to pristine when values match default', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} defaultValues={{ name: 'Original' }}>
          <TextInput source="name" label="Name" />
          <FormContextDisplay />
        </SimpleForm>
      )

      const input = screen.getByLabelText('Name')
      await user.clear(input)
      await user.type(input, 'Changed')

      await waitFor(() => {
        expect(screen.getByTestId('is-dirty')).toHaveTextContent('dirty')
      })

      await user.clear(input)
      await user.type(input, 'Original')

      await waitFor(() => {
        expect(screen.getByTestId('is-dirty')).toHaveTextContent('pristine')
      })
    })
  })

  describe('Submit Button with Loading State', () => {
    it('renders a save button by default', async () => {
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()}>
          <TextInput source="name" />
        </SimpleForm>
      )

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })

    it('shows loading state on submit button during submission', async () => {
      const user = userEvent.setup()
      let resolveSubmit: () => void
      const onSubmit = vi.fn().mockImplementation(() => {
        return new Promise<void>((resolve) => {
          resolveSubmit = resolve
        })
      })

      await renderSimpleForm(
        <SimpleForm onSubmit={onSubmit} defaultValues={{ name: 'Test' }}>
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(saveButton).toBeDisabled()
        // Check for loading indicator (spinner)
        expect(saveButton.querySelector('.animate-spin') || screen.getByTestId('loading-spinner')).toBeTruthy()
      })

      // Resolve the submission
      await act(async () => {
        resolveSubmit!()
      })

      await waitFor(() => {
        expect(saveButton).not.toBeDisabled()
      })
    })

    it('disables submit button when form is invalid', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ name: '' }}
          mode="onChange"
          disableInvalidSubmit
        >
          <TextInput
            source="name"
            label="Name"
            rules={{ required: 'Required' }}
          />
        </SimpleForm>
      )

      // Initially disabled because validation hasn't run
      await user.type(screen.getByLabelText('Name'), 'a')
      await user.clear(screen.getByLabelText('Name'))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
      })
    })

    it('accepts custom toolbar component', async () => {
      function CustomToolbar() {
        return (
          <div data-testid="custom-toolbar">
            <button type="submit">Custom Save</button>
            <button type="button">Custom Cancel</button>
          </div>
        )
      }

      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} toolbar={<CustomToolbar />}>
          <TextInput source="name" />
        </SimpleForm>
      )

      expect(screen.getByTestId('custom-toolbar')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Custom Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Custom Cancel' })).toBeInTheDocument()
    })

    it('hides toolbar when toolbar is false', async () => {
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} toolbar={false}>
          <TextInput source="name" />
        </SimpleForm>
      )

      expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument()
    })

    it('updates saving state in context during submission', async () => {
      const user = userEvent.setup()
      let resolveSubmit: () => void
      const onSubmit = vi.fn().mockImplementation(() => {
        return new Promise<void>((resolve) => {
          resolveSubmit = resolve
        })
      })

      await renderSimpleForm(
        <SimpleForm onSubmit={onSubmit} defaultValues={{ name: 'Test' }}>
          <TextInput source="name" label="Name" />
          <ShadminContextDisplay />
        </SimpleForm>
      )

      expect(screen.getByTestId('saving')).toHaveTextContent('not-saving')

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByTestId('saving')).toHaveTextContent('saving')
      })

      await act(async () => {
        resolveSubmit!()
      })

      await waitFor(() => {
        expect(screen.getByTestId('saving')).toHaveTextContent('not-saving')
      })
    })
  })

  describe('Error Display', () => {
    it('displays submit error when onSubmit throws', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn().mockRejectedValue(new Error('Server error: Failed to save'))

      await renderSimpleForm(
        <SimpleForm onSubmit={onSubmit} defaultValues={{ name: 'Test' }}>
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByText(/server error|failed to save/i)).toBeInTheDocument()
      })
    })

    it('clears submit error on next submission attempt', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
        .mockRejectedValueOnce(new Error('Server error'))
        .mockResolvedValueOnce(undefined)

      await renderSimpleForm(
        <SimpleForm onSubmit={onSubmit} defaultValues={{ name: 'Test' }}>
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      // First submit - error
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument()
      })

      // Second submit - success
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.queryByText(/server error/i)).not.toBeInTheDocument()
      })
    })

    it('accepts custom onError handler', async () => {
      const user = userEvent.setup()
      const onError = vi.fn()
      const error = new Error('Custom error')
      const onSubmit = vi.fn().mockRejectedValue(error)

      await renderSimpleForm(
        <SimpleForm
          onSubmit={onSubmit}
          onError={onError}
          defaultValues={{ name: 'Test' }}
        >
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error)
      })
    })
  })

  describe('warnWhenUnsavedChanges Prop', () => {
    let originalAddEventListener: typeof window.addEventListener
    let originalRemoveEventListener: typeof window.removeEventListener
    let beforeUnloadHandler: ((e: BeforeUnloadEvent) => void) | null = null

    beforeEach(() => {
      originalAddEventListener = window.addEventListener
      originalRemoveEventListener = window.removeEventListener
      beforeUnloadHandler = null

      window.addEventListener = vi.fn((event: string, handler: EventListenerOrEventListenerObject) => {
        if (event === 'beforeunload') {
          beforeUnloadHandler = handler as (e: BeforeUnloadEvent) => void
        }
        originalAddEventListener.call(window, event, handler)
      })

      window.removeEventListener = vi.fn((event: string, handler: EventListenerOrEventListenerObject) => {
        if (event === 'beforeunload' && handler === beforeUnloadHandler) {
          beforeUnloadHandler = null
        }
        originalRemoveEventListener.call(window, event, handler)
      })
    })

    afterEach(() => {
      window.addEventListener = originalAddEventListener
      window.removeEventListener = originalRemoveEventListener
    })

    it('registers beforeunload handler when warnWhenUnsavedChanges is true and form is dirty', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ name: 'Original' }}
          warnWhenUnsavedChanges
        >
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      // Initially no handler (form is pristine)
      expect(beforeUnloadHandler).toBeNull()

      // Make the form dirty
      await user.clear(screen.getByLabelText('Name'))
      await user.type(screen.getByLabelText('Name'), 'Changed')

      await waitFor(() => {
        expect(beforeUnloadHandler).not.toBeNull()
      })
    })

    it('does not register beforeunload handler when warnWhenUnsavedChanges is false', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ name: 'Original' }}
          warnWhenUnsavedChanges={false}
        >
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      await user.clear(screen.getByLabelText('Name'))
      await user.type(screen.getByLabelText('Name'), 'Changed')

      await waitFor(() => {
        expect(beforeUnloadHandler).toBeNull()
      })
    })

    it('removes beforeunload handler when form becomes pristine', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ name: 'Original' }}
          warnWhenUnsavedChanges
        >
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      const input = screen.getByLabelText('Name')

      // Make dirty
      await user.clear(input)
      await user.type(input, 'Changed')

      await waitFor(() => {
        expect(beforeUnloadHandler).not.toBeNull()
      })

      // Make pristine again
      await user.clear(input)
      await user.type(input, 'Original')

      await waitFor(() => {
        expect(beforeUnloadHandler).toBeNull()
      })
    })

    it('removes beforeunload handler on unmount', async () => {
      const user = userEvent.setup()

      let unmount: () => void
      await act(async () => {
        const result = render(
          <SimpleForm
            onSubmit={vi.fn()}
            defaultValues={{ name: 'Original' }}
            warnWhenUnsavedChanges
          >
            <TextInput source="name" label="Name" />
          </SimpleForm>
        )
        unmount = result.unmount
      })

      await user.clear(screen.getByLabelText('Name'))
      await user.type(screen.getByLabelText('Name'), 'Changed')

      await waitFor(() => {
        expect(beforeUnloadHandler).not.toBeNull()
      })

      unmount!()

      expect(beforeUnloadHandler).toBeNull()
    })

    it('beforeunload handler prevents page leave with message', async () => {
      const user = userEvent.setup()

      await renderSimpleForm(
        <SimpleForm
          onSubmit={vi.fn()}
          defaultValues={{ name: 'Original' }}
          warnWhenUnsavedChanges
        >
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      await user.clear(screen.getByLabelText('Name'))
      await user.type(screen.getByLabelText('Name'), 'Changed')

      await waitFor(() => {
        expect(beforeUnloadHandler).not.toBeNull()
      })

      // Simulate beforeunload event
      const event = new Event('beforeunload') as BeforeUnloadEvent
      Object.defineProperty(event, 'returnValue', { writable: true, value: '' })
      beforeUnloadHandler!(event)

      expect(event.returnValue).toBeTruthy()
    })
  })

  describe('Additional Features', () => {
    it('supports noValidate prop', async () => {
      await renderSimpleForm(
        <SimpleForm onSubmit={vi.fn()} noValidate>
          <TextInput source="email" type="email" />
        </SimpleForm>
      )

      expect(screen.getByRole('form')).toHaveAttribute('novalidate')
    })

    it('supports sanitizeEmptyValues prop to remove empty strings', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      await renderSimpleForm(
        <SimpleForm
          onSubmit={onSubmit}
          defaultValues={{ name: '', age: '' }}
          sanitizeEmptyValues
        >
          <TextInput source="name" label="Name" />
          <TextInput source="age" label="Age" />
        </SimpleForm>
      )

      await user.type(screen.getByLabelText('Name'), 'John')
      // Leave age empty
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'John' }),
          expect.anything()
        )
        // age should be undefined or not present
        const calledWith = onSubmit.mock.calls[0][0]
        expect(calledWith.age).toBeUndefined()
      })
    })

    it('transforms values before submit with transform prop', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const transform = vi.fn((data: Record<string, unknown>) => ({
        ...data,
        name: (data.name as string).toUpperCase(),
      }))

      await renderSimpleForm(
        <SimpleForm
          onSubmit={onSubmit}
          defaultValues={{ name: '' }}
          transform={transform}
        >
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      await user.type(screen.getByLabelText('Name'), 'john')
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(transform).toHaveBeenCalledWith(expect.objectContaining({ name: 'john' }))
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'JOHN' }),
          expect.anything()
        )
      })
    })

    it('calls onSuccess callback after successful submission', async () => {
      const user = userEvent.setup()
      const onSuccess = vi.fn()
      const onSubmit = vi.fn().mockResolvedValue({ id: 1 })

      await renderSimpleForm(
        <SimpleForm
          onSubmit={onSubmit}
          onSuccess={onSuccess}
          defaultValues={{ name: 'Test' }}
        >
          <TextInput source="name" label="Name" />
        </SimpleForm>
      )

      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled()
      })
    })
  })
})

describe('<FormDataConsumer />', () => {
  it('provides form data to render function', async () => {
    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} defaultValues={{ firstName: 'John', lastName: 'Doe' }}>
        <FormDataConsumer>
          {({ formData }) => (
            <div data-testid="consumer-output">
              {formData.firstName} {formData.lastName}
            </div>
          )}
        </FormDataConsumer>
      </SimpleForm>
    )

    expect(screen.getByTestId('consumer-output')).toHaveTextContent('John Doe')
  })

  it('updates when form data changes', async () => {
    const user = userEvent.setup()

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} defaultValues={{ name: '' }}>
        <TextInput source="name" label="Name" />
        <FormDataConsumer>
          {({ formData }) => (
            <div data-testid="greeting">
              {formData.name ? `Hello, ${formData.name}!` : 'Enter your name'}
            </div>
          )}
        </FormDataConsumer>
      </SimpleForm>
    )

    expect(screen.getByTestId('greeting')).toHaveTextContent('Enter your name')

    await user.type(screen.getByLabelText('Name'), 'Jane')

    await waitFor(() => {
      expect(screen.getByTestId('greeting')).toHaveTextContent('Hello, Jane!')
    })
  })

  it('provides form methods (setValue, getValues, etc.)', async () => {
    const user = userEvent.setup()

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} defaultValues={{ count: 0 }}>
        <FormDataConsumer>
          {({ formData, setValue }) => (
            <>
              <span data-testid="count">{formData.count}</span>
              <button
                type="button"
                onClick={() => setValue('count', (formData.count as number) + 1)}
              >
                Increment
              </button>
            </>
          )}
        </FormDataConsumer>
      </SimpleForm>
    )

    expect(screen.getByTestId('count')).toHaveTextContent('0')

    await user.click(screen.getByRole('button', { name: 'Increment' }))

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('1')
    })
  })

  it('supports source prop to scope data access', async () => {
    await renderSimpleForm(
      <SimpleForm
        onSubmit={vi.fn()}
        defaultValues={{ user: { firstName: 'John', lastName: 'Doe' } }}
      >
        <FormDataConsumer source="user">
          {({ formData, scopedFormData }) => (
            <div data-testid="scoped-output">
              Scoped: {scopedFormData?.firstName} | Full: {(formData.user as Record<string, string>)?.firstName}
            </div>
          )}
        </FormDataConsumer>
      </SimpleForm>
    )

    expect(screen.getByTestId('scoped-output')).toHaveTextContent('Scoped: John | Full: John')
  })

  it('supports deeply nested source paths', async () => {
    await renderSimpleForm(
      <SimpleForm
        onSubmit={vi.fn()}
        defaultValues={{ user: { address: { city: 'New York', zip: '10001' } } }}
      >
        <FormDataConsumer source="user.address">
          {({ scopedFormData }) => (
            <div data-testid="nested-output">
              City: {scopedFormData?.city}, Zip: {scopedFormData?.zip}
            </div>
          )}
        </FormDataConsumer>
      </SimpleForm>
    )

    expect(screen.getByTestId('nested-output')).toHaveTextContent('City: New York, Zip: 10001')
  })

  it('handles missing nested paths gracefully', async () => {
    await renderSimpleForm(
      <SimpleForm
        onSubmit={vi.fn()}
        defaultValues={{ user: { name: 'John' } }}
      >
        <FormDataConsumer source="user.address.city">
          {({ scopedFormData }) => (
            <div data-testid="missing-output">
              Value: {scopedFormData ?? 'undefined'}
            </div>
          )}
        </FormDataConsumer>
      </SimpleForm>
    )

    expect(screen.getByTestId('missing-output')).toHaveTextContent('Value: undefined')
  })

  it('provides trigger function for manual validation', async () => {
    const user = userEvent.setup()

    await renderSimpleForm(
      <SimpleForm
        onSubmit={vi.fn()}
        defaultValues={{ email: '' }}
        mode="onSubmit"
      >
        <TextInput
          source="email"
          label="Email"
          rules={{ required: 'Email is required' }}
        />
        <FormDataConsumer>
          {({ trigger }) => (
            <button type="button" onClick={() => trigger('email')}>
              Validate Email
            </button>
          )}
        </FormDataConsumer>
      </SimpleForm>
    )

    // Trigger validation manually
    await user.click(screen.getByRole('button', { name: 'Validate Email' }))

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('provides reset function to reset form', async () => {
    const user = userEvent.setup()

    await renderSimpleForm(
      <SimpleForm
        onSubmit={vi.fn()}
        defaultValues={{ name: 'Original' }}
      >
        <TextInput source="name" label="Name" />
        <FormDataConsumer>
          {({ reset }) => (
            <button type="button" onClick={() => reset()}>
              Reset Form
            </button>
          )}
        </FormDataConsumer>
      </SimpleForm>
    )

    // Change the value
    await user.clear(screen.getByLabelText('Name'))
    await user.type(screen.getByLabelText('Name'), 'Changed')

    expect(screen.getByLabelText('Name')).toHaveValue('Changed')

    // Reset the form
    await user.click(screen.getByRole('button', { name: 'Reset Form' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('Original')
    })
  })
})

describe('useFormData hook', () => {
  it('provides form data to component', async () => {
    function FormDataDisplay() {
      const { formData } = useFormData<{ firstName: string; lastName: string }>()
      return (
        <div data-testid="hook-output">
          {formData.firstName} {formData.lastName}
        </div>
      )
    }

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} defaultValues={{ firstName: 'John', lastName: 'Doe' }}>
        <FormDataDisplay />
      </SimpleForm>
    )

    expect(screen.getByTestId('hook-output')).toHaveTextContent('John Doe')
  })

  it('updates when form data changes', async () => {
    const user = userEvent.setup()

    function Greeting() {
      const { formData } = useFormData<{ name: string }>()
      return (
        <div data-testid="hook-greeting">
          {formData.name ? `Hello, ${formData.name}!` : 'Enter your name'}
        </div>
      )
    }

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} defaultValues={{ name: '' }}>
        <TextInput source="name" label="Name" />
        <Greeting />
      </SimpleForm>
    )

    expect(screen.getByTestId('hook-greeting')).toHaveTextContent('Enter your name')

    await user.type(screen.getByLabelText('Name'), 'Jane')

    await waitFor(() => {
      expect(screen.getByTestId('hook-greeting')).toHaveTextContent('Hello, Jane!')
    })
  })

  it('provides setValue for programmatic updates', async () => {
    const user = userEvent.setup()

    function Counter() {
      const { formData, setValue } = useFormData<{ count: number }>()
      return (
        <>
          <span data-testid="hook-count">{formData.count}</span>
          <button
            type="button"
            onClick={() => setValue('count', (formData.count || 0) + 1)}
          >
            Increment
          </button>
        </>
      )
    }

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} defaultValues={{ count: 0 }}>
        <Counter />
      </SimpleForm>
    )

    expect(screen.getByTestId('hook-count')).toHaveTextContent('0')

    await user.click(screen.getByRole('button', { name: 'Increment' }))

    await waitFor(() => {
      expect(screen.getByTestId('hook-count')).toHaveTextContent('1')
    })
  })

  it('supports source option for scoped data', async () => {
    function UserDisplay() {
      const { scopedFormData, formData } = useFormData<{ user: { firstName: string; lastName: string } }>({
        source: 'user',
      })
      return (
        <div data-testid="hook-scoped-output">
          Scoped: {(scopedFormData as { firstName: string })?.firstName} | Full: {formData.user?.firstName}
        </div>
      )
    }

    await renderSimpleForm(
      <SimpleForm
        onSubmit={vi.fn()}
        defaultValues={{ user: { firstName: 'John', lastName: 'Doe' } }}
      >
        <UserDisplay />
      </SimpleForm>
    )

    expect(screen.getByTestId('hook-scoped-output')).toHaveTextContent('Scoped: John | Full: John')
  })

  it('provides access to formState', async () => {
    const user = userEvent.setup()

    function DirtyIndicator() {
      const { formState } = useFormData()
      return (
        <div data-testid="dirty-state">
          {formState.isDirty ? 'Form is dirty' : 'Form is clean'}
        </div>
      )
    }

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} defaultValues={{ name: 'Original' }}>
        <TextInput source="name" label="Name" />
        <DirtyIndicator />
      </SimpleForm>
    )

    expect(screen.getByTestId('dirty-state')).toHaveTextContent('Form is clean')

    await user.clear(screen.getByLabelText('Name'))
    await user.type(screen.getByLabelText('Name'), 'Changed')

    await waitFor(() => {
      expect(screen.getByTestId('dirty-state')).toHaveTextContent('Form is dirty')
    })
  })
})

describe('<Toolbar />', () => {
  it('renders default save button', async () => {
    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar />
      </SimpleForm>
    )

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('renders custom children', async () => {
    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <button type="submit">Custom Submit</button>
          <button type="button">Cancel</button>
        </Toolbar>
      </SimpleForm>
    )

    expect(screen.getByRole('button', { name: 'Custom Submit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('applies className to toolbar container', async () => {
    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar className="custom-toolbar" data-testid="toolbar" />
      </SimpleForm>
    )

    expect(screen.getByTestId('toolbar')).toHaveClass('custom-toolbar')
  })
})

describe('<SaveButton />', () => {
  it('renders with Save label by default', async () => {
    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <SaveButton />
        </Toolbar>
      </SimpleForm>
    )

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('accepts custom label', async () => {
    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <SaveButton label="Submit Form" />
        </Toolbar>
      </SimpleForm>
    )

    expect(screen.getByRole('button', { name: 'Submit Form' })).toBeInTheDocument()
  })

  it('shows loading state when form is submitting', async () => {
    const user = userEvent.setup()
    let resolveSubmit: () => void
    const onSubmit = vi.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => {
        resolveSubmit = resolve
      })
    })

    await renderSimpleForm(
      <SimpleForm onSubmit={onSubmit} defaultValues={{ name: 'Test' }} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <SaveButton data-testid="save-btn" />
        </Toolbar>
      </SimpleForm>
    )

    const saveButton = screen.getByTestId('save-btn')
    await user.click(saveButton)

    await waitFor(() => {
      expect(saveButton).toHaveAttribute('disabled')
    })

    await act(async () => {
      resolveSubmit!()
    })

    await waitFor(() => {
      expect(saveButton).not.toHaveAttribute('disabled')
    })
  })

  it('supports disabled prop', async () => {
    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <SaveButton disabled />
        </Toolbar>
      </SimpleForm>
    )

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
  })

  it('supports icon prop', async () => {
    const CustomIcon = () => <span data-testid="custom-icon">Icon</span>

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <SaveButton icon={<CustomIcon />} />
        </Toolbar>
      </SimpleForm>
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })
})

describe('<DeleteButton />', () => {
  it('renders delete button', async () => {
    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <DeleteButton onDelete={vi.fn()} />
        </Toolbar>
      </SimpleForm>
    )

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('calls onDelete when clicked and confirmed', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    // Mock window.confirm
    const originalConfirm = window.confirm
    window.confirm = vi.fn().mockReturnValue(true)

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <DeleteButton onDelete={onDelete} />
        </Toolbar>
      </SimpleForm>
    )

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(window.confirm).toHaveBeenCalled()
    expect(onDelete).toHaveBeenCalled()

    window.confirm = originalConfirm
  })

  it('does not call onDelete when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    const originalConfirm = window.confirm
    window.confirm = vi.fn().mockReturnValue(false)

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <DeleteButton onDelete={onDelete} />
        </Toolbar>
      </SimpleForm>
    )

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(window.confirm).toHaveBeenCalled()
    expect(onDelete).not.toHaveBeenCalled()

    window.confirm = originalConfirm
  })

  it('skips confirmation when confirmDelete is false', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const confirmSpy = vi.spyOn(window, 'confirm')

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <DeleteButton onDelete={onDelete} confirmDelete={false} />
        </Toolbar>
      </SimpleForm>
    )

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(confirmSpy).not.toHaveBeenCalled()
    expect(onDelete).toHaveBeenCalled()

    confirmSpy.mockRestore()
  })

  it('supports custom confirmMessage', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    await renderSimpleForm(
      <SimpleForm onSubmit={vi.fn()} toolbar={false}>
        <TextInput source="name" />
        <Toolbar>
          <DeleteButton
            onDelete={vi.fn()}
            confirmMessage="Are you really sure you want to delete this?"
          />
        </Toolbar>
      </SimpleForm>
    )

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(confirmSpy).toHaveBeenCalledWith('Are you really sure you want to delete this?')

    confirmSpy.mockRestore()
  })
})
