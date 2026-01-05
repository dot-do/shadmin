/**
 * Form components exports
 */

// SimpleForm - main form component
export { SimpleForm, type SimpleFormProps } from './SimpleForm'

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

// FormDataConsumer - access form data in children
export {
  FormDataConsumer,
  type FormDataConsumerProps,
  type FormDataConsumerRenderProps,
} from './FormDataConsumer'

// Toolbar and buttons
export {
  Toolbar,
  SaveButton,
  DeleteButton,
  type ToolbarProps,
  type SaveButtonProps,
  type DeleteButtonProps,
} from './Toolbar'
