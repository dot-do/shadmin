/**
 * SimpleForm Component
 * A form component that renders inputs in a vertical stack with react-hook-form integration.
 */

import {
  useCallback,
  useEffect,
  useState,
  type FormHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Mode,
  type Resolver,
  type UseFormReturn,
} from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import type { RaRecord } from '../../types'
import { cn } from '../../utils'
import { Toolbar as DefaultToolbar } from './Toolbar'

/**
 * Props for SimpleForm component
 */
export interface SimpleFormProps<T extends FieldValues = FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onError'> {
  /**
   * Form children (typically input components)
   */
  children?: ReactNode
  /**
   * Handler called on form submission with validated data
   */
  onSubmit: (data: T, event?: React.BaseSyntheticEvent) => void | Promise<void>
  /**
   * Default values for the form fields
   */
  defaultValues?: DefaultValues<T>
  /**
   * Resource name for context
   */
  resource?: string
  /**
   * Record being edited for context
   */
  record?: RaRecord
  /**
   * Validation mode - when to trigger validation
   * @default 'onSubmit'
   */
  mode?: Mode
  /**
   * Re-validation mode after initial submission
   * @default 'onChange'
   */
  reValidateMode?: 'onBlur' | 'onChange' | 'onSubmit'
  /**
   * Schema resolver for validation (e.g., zod, yup)
   */
  resolver?: Resolver<T>
  /**
   * Toolbar component or false to hide toolbar
   */
  toolbar?: ReactElement | false
  /**
   * Reset form after successful submission
   */
  resetOnSubmit?: boolean
  /**
   * Disable submit button when form is invalid
   */
  disableInvalidSubmit?: boolean
  /**
   * Show warning before leaving page with unsaved changes
   */
  warnWhenUnsavedChanges?: boolean
  /**
   * Remove empty string values from submitted data
   */
  sanitizeEmptyValues?: boolean
  /**
   * Transform data before submission
   */
  transform?: (data: T) => T
  /**
   * Handler called on successful submission
   */
  onSuccess?: () => void
  /**
   * Handler called on submission error
   */
  onError?: (error: Error) => void
}

/**
 * Sanitize empty values from form data
 */
function sanitizeData<T extends FieldValues>(data: T): T {
  const result: Record<string, unknown> = {}
  for (const key in data) {
    const value = data[key]
    if (value !== '' && value !== null && value !== undefined) {
      result[key] = value
    }
  }
  return result as T
}

/**
 * SimpleForm component for rendering form inputs in a vertical stack.
 * Integrates with react-hook-form for state management and ShadCN components for UI.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SimpleForm onSubmit={handleSubmit} defaultValues={{ name: '' }}>
 *   <TextInput source="name" label="Name" />
 * </SimpleForm>
 *
 * // With validation and custom toolbar
 * <SimpleForm
 *   onSubmit={handleSubmit}
 *   defaultValues={{ email: '' }}
 *   mode="onChange"
 *   toolbar={<Toolbar><SaveButton /><CancelButton /></Toolbar>}
 * >
 *   <TextInput source="email" rules={{ required: 'Email is required' }} />
 * </SimpleForm>
 *
 * // With unsaved changes warning
 * <SimpleForm
 *   onSubmit={handleSubmit}
 *   warnWhenUnsavedChanges
 * >
 *   <TextInput source="title" />
 * </SimpleForm>
 * ```
 */
export function SimpleForm<T extends FieldValues = FieldValues>({
  children,
  onSubmit,
  defaultValues,
  resource,
  record,
  mode = 'onSubmit',
  reValidateMode = 'onChange',
  resolver,
  toolbar,
  resetOnSubmit = false,
  disableInvalidSubmit = false,
  warnWhenUnsavedChanges = false,
  sanitizeEmptyValues = false,
  transform,
  onSuccess,
  onError,
  className,
  noValidate,
  ...formProps
}: SimpleFormProps<T>): ReactElement {
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<Error | null>(null)

  const form = useForm<T>({
    defaultValues,
    mode,
    reValidateMode,
    resolver,
  })

  const {
    handleSubmit,
    formState: { isDirty, isValid, isSubmitting },
    reset,
  } = form

  // Handle unsaved changes warning
  useUnsavedChangesWarning(warnWhenUnsavedChanges && isDirty)

  const onFormSubmit = useCallback(
    async (data: T, event?: React.BaseSyntheticEvent) => {
      setSubmitError(null)
      setSaving(true)

      try {
        let processedData = data

        // Sanitize empty values if enabled
        if (sanitizeEmptyValues) {
          processedData = sanitizeData(processedData)
        }

        // Transform data if transform function provided
        if (transform) {
          processedData = transform(processedData)
        }

        await onSubmit(processedData, event)

        // Reset form on successful submit if enabled
        if (resetOnSubmit) {
          reset(processedData as DefaultValues<T>)
        }

        // Call success callback
        onSuccess?.()
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        setSubmitError(err)
        onError?.(err)
      } finally {
        setSaving(false)
      }
    },
    [onSubmit, sanitizeEmptyValues, transform, resetOnSubmit, reset, onSuccess, onError]
  )

  const renderToolbar = () => {
    if (toolbar === false) {
      return null
    }
    if (toolbar) {
      return toolbar
    }
    return (
      <DefaultToolbar
        saving={saving}
        disabled={disableInvalidSubmit && !isValid}
      />
    )
  }

  return (
    <FormContextProvider
      {...(form as unknown as UseFormReturn<FieldValues>)}
      resource={resource}
      record={record}
      saving={saving}
    >
      <form
        role="form"
        onSubmit={handleSubmit(onFormSubmit)}
        className={cn('space-y-4', className)}
        noValidate={noValidate}
        {...formProps}
      >
        <div className="flex flex-col space-y-4">
          {children}
        </div>
        {submitError && (
          <div className="text-sm text-destructive" role="alert">
            {submitError.message}
          </div>
        )}
        {renderToolbar()}
      </form>
    </FormContextProvider>
  )
}

SimpleForm.displayName = 'SimpleForm'

/**
 * Hook to handle beforeunload warning when there are unsaved changes
 */
function useUnsavedChangesWarning(shouldWarn: boolean): void {
  useEffect(() => {
    if (!shouldWarn) {
      return
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
      return e.returnValue
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [shouldWarn])
}
