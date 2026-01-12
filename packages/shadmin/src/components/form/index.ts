/**
 * Form components exports
 */

// SimpleForm - main form component
export {
  SimpleForm,
  type SimpleFormProps,
  type FormSubmitHandler,
  type SaveHandlerCallbacks,
} from './SimpleForm'

// TabbedForm - Organize form inputs into tabs
export {
  TabbedForm,
  useTabbedFormContext,
  useOptionalTabbedFormContext,
  type TabbedFormProps,
  type TabbedFormContextValue,
  type TabInfo,
} from './TabbedForm'

// FormTab - Individual tab panel for TabbedForm
export {
  FormTab,
  FormTabPanel,
  generateTabName,
  type FormTabProps,
  type FormTabPanelProps,
} from './FormTab'

// FormDataConsumer - access form data in children (render props and hook patterns)
export {
  FormDataConsumer,
  useFormData,
  type FormDataConsumerProps,
  type FormDataConsumerRenderProps,
  type UseFormDataOptions,
} from './FormDataConsumer'

// SimpleFormConfigurable - form with configurable field visibility
export {
  SimpleFormConfigurable,
  type SimpleFormConfigurableProps,
  type FieldConfig,
} from './SimpleFormConfigurable'

// Toolbar and buttons
export {
  Toolbar,
  TopToolbar,
  SaveButton,
  DeleteButton,
  type ToolbarProps,
  type TopToolbarProps,
  type SaveButtonProps,
  type DeleteButtonProps,
} from './Toolbar'
