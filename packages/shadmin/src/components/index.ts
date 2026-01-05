// Component exports
// This file will be populated with actual components

export { Button, type ButtonProps } from './Button'

// Core components
export {
  Admin,
  Resource,
  CoreAdminContext,
  CoreAdminRoutes,
  ResourceRegistrationContext,
  type CoreAdminContextProps,
  type CoreAdminRoutesProps,
  type ResourceRegistrationContextValue,
} from './core'

// List components
export {
  List,
  ListBase,
  ListView,
  Pagination,
  RowsPerPageSelector,
  Datagrid,
  DatagridHeader,
  DatagridBody,
  DatagridRow,
  SimpleDatagridRow,
  type ListProps,
  type ListBaseProps,
  type ListViewProps,
  type PaginationProps,
  type RowsPerPageSelectorProps,
  type DatagridProps,
  type DatagridColumn,
  type RowClickHandler,
  type DatagridHeaderProps,
  type DatagridBodyProps,
  type DatagridRowProps,
  type SimpleDatagridRowProps,
} from './list'

// Input components
export {
  TextInput,
  NumberInput,
  PasswordInput,
  DateInput,
  SelectInput,
  type TextInputProps,
  type NumberInputProps,
  type PasswordInputProps,
  type DateInputProps,
  type SelectInputProps,
  type SelectChoice,
} from './input'

// Field components (display)
export {
  TextField,
  NumberField,
  DateField,
  BooleanField,
  EmailField,
  UrlField,
  type TextFieldProps,
  type NumberFieldProps,
  type DateFieldProps,
  type BooleanFieldProps,
  type EmailFieldProps,
  type UrlFieldProps,
} from './field'

// Form components
export {
  SimpleForm,
  FormDataConsumer,
  Toolbar,
  SaveButton,
  DeleteButton,
  type SimpleFormProps,
  type FormDataConsumerProps,
  type FormDataConsumerRenderProps,
  type ToolbarProps,
  type SaveButtonProps,
  type DeleteButtonProps,
} from './form'

// Create components
export {
  Create,
  CreateBase,
  CreateView,
  CreateContext,
  CreateContextProvider,
  useCreateContext,
  useOptionalCreateContext,
  type CreateProps,
  type CreateBaseProps,
  type CreateViewProps,
  type CreateContextValue,
  type CreateContextProviderProps,
  type SaveHandler,
  type TransformData,
  type RedirectTo,
} from './create'

// Auth components
export {
  LoginPage,
  LogoutButton,
  type LoginPageProps,
  type LogoutButtonProps,
} from './auth'
