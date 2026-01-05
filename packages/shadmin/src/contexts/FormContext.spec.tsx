import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useForm, type FieldValues } from 'react-hook-form'
import {
  FormContext,
  FormContextProvider,
  useFormContext,
  useShadminFormContext,
  type ShadminFormContext,
} from './FormContext'

interface TestFormData {
  name: string
  email: string
}

describe('FormContext', () => {
  describe('FormContext', () => {
    it('should export the React context', () => {
      expect(FormContext).toBeDefined()
    })
  })

  describe('FormContextProvider', () => {
    it('should provide form context to children', () => {
      const TestComponent = () => {
        const form = useForm<TestFormData>({
          defaultValues: { name: 'John', email: 'john@example.com' },
        })

        return (
          <FormContextProvider {...form}>
            <Consumer />
          </FormContextProvider>
        )
      }

      const Consumer = () => {
        const { getValues } = useFormContext<TestFormData>()
        const values = getValues()
        return (
          <div>
            <span data-testid="name">{values.name}</span>
            <span data-testid="email">{values.email}</span>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('name')).toHaveTextContent('John')
      expect(screen.getByTestId('email')).toHaveTextContent('john@example.com')
    })

    it('should provide shadmin-specific form state', async () => {
      const onSave = vi.fn()
      const onDelete = vi.fn()

      const TestComponent = () => {
        const form = useForm<TestFormData>({
          defaultValues: { name: 'Test', email: 'test@example.com' },
        })

        const shadminContext: ShadminFormContext<TestFormData> = {
          ...form,
          record: { id: 1, name: 'Test', email: 'test@example.com' },
          resource: 'users',
          save: onSave,
          saving: false,
          mutationMode: 'pessimistic',
          onDelete,
        }

        return (
          <FormContextProvider {...shadminContext}>
            <Consumer />
          </FormContextProvider>
        )
      }

      const Consumer = () => {
        const { record, resource, saving, mutationMode, save, onDelete } =
          useShadminFormContext<TestFormData>()
        return (
          <div>
            <span data-testid="record">{JSON.stringify(record)}</span>
            <span data-testid="resource">{resource}</span>
            <span data-testid="saving">{saving ? 'true' : 'false'}</span>
            <span data-testid="mutationMode">{mutationMode}</span>
            <button onClick={() => save?.({ name: 'New', email: 'new@example.com' })}>
              Save
            </button>
            <button onClick={() => onDelete?.()}>Delete</button>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('resource')).toHaveTextContent('users')
      expect(screen.getByTestId('saving')).toHaveTextContent('false')
      expect(screen.getByTestId('mutationMode')).toHaveTextContent('pessimistic')

      fireEvent.click(screen.getByText('Save'))
      expect(onSave).toHaveBeenCalledWith({ name: 'New', email: 'new@example.com' })

      fireEvent.click(screen.getByText('Delete'))
      expect(onDelete).toHaveBeenCalled()
    })
  })

  describe('useFormContext', () => {
    it('should return null when used outside provider', () => {
      // react-hook-form's useFormContext returns null instead of throwing
      const Consumer = () => {
        const context = useFormContext()
        return <div data-testid="result">{context === null ? 'null' : 'defined'}</div>
      }

      render(<Consumer />)
      expect(screen.getByTestId('result')).toHaveTextContent('null')
    })

    it('should provide react-hook-form methods', async () => {
      const TestComponent = () => {
        const form = useForm<TestFormData>({
          defaultValues: { name: '', email: '' },
        })

        return (
          <FormContextProvider {...form}>
            <FormConsumer />
          </FormContextProvider>
        )
      }

      const FormConsumer = () => {
        const { register, handleSubmit, formState } = useFormContext<TestFormData>()
        const onSubmit = vi.fn()

        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <input data-testid="name-input" {...register('name', { required: true })} />
            <input data-testid="email-input" {...register('email')} />
            <span data-testid="dirty">{formState.isDirty ? 'dirty' : 'clean'}</span>
            <button type="submit">Submit</button>
          </form>
        )
      }

      render(<TestComponent />)

      const nameInput = screen.getByTestId('name-input')
      fireEvent.change(nameInput, { target: { value: 'New Name' } })

      await waitFor(() => {
        expect(screen.getByTestId('dirty')).toHaveTextContent('dirty')
      })
    })

    it('should provide control for controlled inputs', () => {
      const TestComponent = () => {
        const form = useForm<TestFormData>({
          defaultValues: { name: 'Test', email: 'test@example.com' },
        })

        return (
          <FormContextProvider {...form}>
            <Consumer />
          </FormContextProvider>
        )
      }

      const Consumer = () => {
        const { control } = useFormContext<TestFormData>()
        return <div data-testid="control">{control ? 'defined' : 'undefined'}</div>
      }

      render(<TestComponent />)

      expect(screen.getByTestId('control')).toHaveTextContent('defined')
    })
  })

  describe('useShadminFormContext', () => {
    it('should return undefined for shadmin properties when not provided', () => {
      const TestComponent = () => {
        const form = useForm<TestFormData>({
          defaultValues: { name: '', email: '' },
        })

        return (
          <FormContextProvider {...form}>
            <Consumer />
          </FormContextProvider>
        )
      }

      const Consumer = () => {
        const { record, resource, save, saving, mutationMode } =
          useShadminFormContext<TestFormData>()
        return (
          <div>
            <span data-testid="record">{record === undefined ? 'undefined' : 'defined'}</span>
            <span data-testid="resource">{resource ?? 'undefined'}</span>
            <span data-testid="save">{save === undefined ? 'undefined' : 'defined'}</span>
            <span data-testid="saving">{saving === undefined ? 'undefined' : 'defined'}</span>
            <span data-testid="mutationMode">{mutationMode ?? 'undefined'}</span>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('record')).toHaveTextContent('undefined')
      expect(screen.getByTestId('resource')).toHaveTextContent('undefined')
      expect(screen.getByTestId('save')).toHaveTextContent('undefined')
      expect(screen.getByTestId('saving')).toHaveTextContent('undefined')
      expect(screen.getByTestId('mutationMode')).toHaveTextContent('undefined')
    })

    it('should handle optimistic mutation mode', () => {
      const TestComponent = () => {
        const form = useForm<TestFormData>({
          defaultValues: { name: 'Test', email: 'test@example.com' },
        })

        const shadminContext: ShadminFormContext<TestFormData> = {
          ...form,
          mutationMode: 'optimistic',
        }

        return (
          <FormContextProvider {...shadminContext}>
            <Consumer />
          </FormContextProvider>
        )
      }

      const Consumer = () => {
        const { mutationMode } = useShadminFormContext<TestFormData>()
        return <div data-testid="mode">{mutationMode}</div>
      }

      render(<TestComponent />)

      expect(screen.getByTestId('mode')).toHaveTextContent('optimistic')
    })
  })
})
