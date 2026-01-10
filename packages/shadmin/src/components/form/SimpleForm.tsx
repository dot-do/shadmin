/**
 * SimpleForm Component
 * A form component that renders inputs in a vertical stack with react-hook-form integration.
 */

import {
  useCallback,
  useEffect,
  useState,
  isValidElement,
  Children,
  type FormHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type ComponentType,
} from 'react'
import {
  useForm,
  useFormState,
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
 * Type for save handler that accepts both ra-core SaveHandler and standard form handlers.
 * ra-core's SaveHandler returns Promise<void | RecordType> | Record<string, string>
 * Standard form handlers return void | Promise<void>
 * The second parameter can be either SaveHandlerCallbacks or BaseSyntheticEvent.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormSubmitHandler<T> = (data: T, callbacksOrEvent?: any) => unknown

/**
 * Props passed to the fieldWrapper component
 */
export interface FieldWrapperProps {
  children: ReactNode
  source: string
  label?: string
  isRequired?: boolean
  error?: string
}

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
   * Handler called on form submission with validated data.
   * If not provided, uses the save function from form context.
   * Accepts SaveHandler from ra-core or a standard form submit handler.
   */
  onSubmit?: FormSubmitHandler<T>
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
  /**
   * Custom component to wrap each field
   */
  fieldWrapper?: ComponentType<FieldWrapperProps>
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
  fieldWrapper: FieldWrapper,
  ...formProps
}: SimpleFormProps<T>): ReactElement {
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<Error | null>(null)

  // Build form options, only including defined values
  const formOptions: Parameters<typeof useForm<T>>[0] = {
    mode,
    reValidateMode,
  }
  if (defaultValues !== undefined) formOptions.defaultValues = defaultValues
  if (resolver !== undefined) formOptions.resolver = resolver

  const form = useForm<T>(formOptions)

  const {
    handleSubmit,
    formState: { isDirty, isValid, isSubmitting: _isSubmitting },
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

        if (onSubmit) {
          await onSubmit(processedData, event)
        }

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

  // Render children with fieldWrapper if provided
  const renderChildren = () => {
    if (!FieldWrapper) {
      return children
    }

    return Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child
      }

      const childProps = child.props as {
        source?: string
        label?: string
        rules?: { required?: string | boolean }
      }

      if (!childProps.source) {
        return child
      }

      const source = childProps.source
      const label = childProps.label
      const isRequired = Boolean(
        childProps.rules &&
        (typeof childProps.rules.required === 'string' ||
         childProps.rules.required === true)
      )

      // Build props, only including label if defined
      const wrapperProps: Parameters<typeof FieldWrapperWithError>[0] = {
        FieldWrapper,
        source,
        isRequired,
        control: form.control as unknown as UseFormReturn<FieldValues>['control'],
        children: child,
      }
      if (label !== undefined) wrapperProps.label = label

      return <FieldWrapperWithError key={source} {...wrapperProps} />
    })
  }

  // Type assertion required: TypeScript cannot infer that UseFormReturn<T> is compatible
  // with FormContextProvider's generic parameter when spreading. This is safe because
  // T extends FieldValues, ensuring structural compatibility.
  const formMethods = form as UseFormReturn<FieldValues>

  return (
    <FormContextProvider
      {...formMethods}
      resource={resource}
      record={record}
      saving={saving}
    >
      <form
        role="form"
        onSubmit={handleSubmit(onFormSubmit as (data: T, event?: React.BaseSyntheticEvent) => void | Promise<void>)}
        className={cn('space-y-4', className)}
        noValidate={noValidate}
        {...formProps}
      >
        <div className="flex flex-col space-y-4">
          {renderChildren()}
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
 * Helper component that wraps a field with the fieldWrapper and provides error from form state
 */
function FieldWrapperWithError({
  FieldWrapper,
  source,
  label,
  isRequired,
  control,
  children,
}: {
  FieldWrapper: ComponentType<FieldWrapperProps>
  source: string
  label?: string
  isRequired: boolean
  control: UseFormReturn<FieldValues>['control']
  children: ReactNode
}) {
  const { errors } = useFormState({ control, name: source })
  const fieldError = errors[source]
  const errorMessage = fieldError?.message as string | undefined

  // Build props, only including optional values if defined
  const wrapperProps: FieldWrapperProps = {
    source,
    isRequired,
    children,
  }
  if (label !== undefined) wrapperProps.label = label
  if (errorMessage !== undefined) wrapperProps.error = errorMessage

  return <FieldWrapper {...wrapperProps} />
}

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
