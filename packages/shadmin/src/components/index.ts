// Component exports
// This file will be populated with actual components

export { Button, type ButtonProps } from './Button'

// Core components
// Note: Resource comes from ra-core. Admin uses props-based detection to identify Resource children.
export {
  Admin,
  ResourceRegistrationContext,
  type ResourceRegistrationContextValue,
  // Lifecycle callbacks
  withLifecycleCallbacks,
  type LifecycleCallbackContext,
  type AfterLifecycleCallbackContext,
  type ResourceLifecycleCallbacks,
  // Plugin types
  type AdminPlugin,
  type AdminPluginContext,
  type PluginContextValue,
  type PluginConfig,
  // Component registry
  ComponentRegistry,
  componentRegistry,
  type CustomInputBaseProps,
  type CustomInputRegistration,
  type CustomFieldRegistration,
  // Plugin context and hooks
  PluginContext,
  usePluginContext,
  useOptionalPluginContext,
  useCustomInput,
  useCustomField,
  // Plugin utilities
  createPlugin,
  definePlugin,
  composePlugins,
  isPluginInstalled,
  getPlugin,
  // Renderer props
  type CellRendererProps,
  type FieldWrapperProps,
} from './core'

// List components
// Note: ListBase, ListBaseProps, InfiniteListBase, InfiniteListBaseProps
// are NOT re-exported here as they come from ra-core
export {
  List,
  ListView,
  ListActions,
  ListToolbar,
  Pagination,
  RowsPerPageSelector,
  Datagrid,
  DatagridHeader,
  DatagridBody,
  DatagridRow,
  SimpleDatagridRow,
  SimpleList,
  InfiniteList,
  InfiniteListView,
  DataTable,
  type ListProps,
  type ListViewProps,
  type ListActionsProps,
  type ListToolbarProps,
  type PaginationProps,
  type RowsPerPageSelectorProps,
  type DatagridProps,
  type DatagridColumn,
  type RowClickHandler,
  type DatagridHeaderProps,
  type DatagridBodyProps,
  type DatagridRowProps,
  type SimpleDatagridRowProps,
  type SimpleListProps,
  type InfiniteListProps,
  type InfiniteListViewProps,
  type DataTableProps,
} from './list'

// Input components
export {
  TextInput,
  NumberInput,
  PasswordInput,
  DateInput,
  DateTimeInput,
  SelectInput,
  BooleanInput,
  SelectArrayInput,
  RadioButtonGroupInput,
  CheckboxGroupInput,
  ReferenceInput,
  ReferenceArrayInput,
  AutocompleteInput,
  AutocompleteArrayInput,
  ArrayInput,
  ArrayInputContext,
  useArrayInputContext,
  SimpleFormIterator,
  TimeInput,
  FileInput,
  ImageInput,
  RichTextInput,
  TranslatableInputs,
  useTranslatableInputsContext,
  useOptionalTranslatableInputsContext,
  type TextInputProps,
  type NumberInputProps,
  type PasswordInputProps,
  type DateInputProps,
  type DateTimeInputProps,
  type SelectInputProps,
  type SelectChoice,
  type BooleanInputProps,
  type SelectArrayInputProps,
  type SelectArrayChoice,
  type RadioButtonGroupInputProps,
  type RadioChoice,
  type CheckboxGroupInputProps,
  type CheckboxChoice,
  type ReferenceInputProps,
  type ReferenceChoice,
  type ReferenceSort,
  type ReferenceArrayInputProps,
  type AutocompleteInputProps,
  type AutocompleteChoice,
  type AutocompleteArrayInputProps,
  type AutocompleteArrayChoice,
  type ArrayInputProps,
  type ArrayInputContextValue,
  type SimpleFormIteratorProps,
  type TimeInputProps,
  type FileInputProps,
  type ImageInputProps,
  type RichTextInputProps,
  type TranslatableInputsProps,
  type TranslatableInputsContextValue,
  SearchInput,
  type SearchInputProps,
  // Base choice interfaces for stricter typing
  type IdNameChoice,
  type ValueLabelChoice,
  type BaseSelectChoice,
  // Helper types for type-safe choices
  type ChoiceValue,
  type ExtractChoiceValue,
  type ExtractChoiceText,
  type OptionTextProp,
  type OptionValueProp,
  // Type guards and utilities for choice validation
  isRecord,
  isIdNameChoice,
  isValueLabelChoice,
  isBaseSelectChoice,
  isChoiceValue,
  validateChoices,
  getChoiceValue,
  getChoiceText,
} from './input'

// Field components (display)
export {
  TextField,
  NumberField,
  DateField,
  BooleanField,
  EmailField,
  UrlField,
  ReferenceField,
  ReferenceArrayField,
  ReferenceManyField,
  ReferenceManyCount,
  FunctionField,
  ArrayField,
  RichTextField,
  ImageField,
  ChipField,
  FileField,
  SelectField,
  SingleFieldList,
  TranslatableFields,
  useTranslatableFieldsContext,
  useOptionalTranslatableFieldsContext,
  type TextFieldProps,
  type NumberFieldProps,
  type DateFieldProps,
  type BooleanFieldProps,
  type EmailFieldProps,
  type UrlFieldProps,
  type ReferenceFieldProps,
  type ReferenceArrayFieldProps,
  type ReferenceManyFieldProps,
  type ReferenceManyCountProps,
  type FunctionFieldProps,
  type ArrayFieldProps,
  type RichTextFieldProps,
  type ImageFieldProps,
  type ChipFieldProps,
  type FileFieldProps,
  type FileValue,
  type SelectFieldProps,
  type SelectFieldChoice,
  type SingleFieldListProps,
  type TranslatableFieldsProps,
  type TranslatableFieldsContextValue,
  RecordField,
  type RecordFieldProps,
} from './field'

// Form components
export {
  SimpleForm,
  SimpleFormConfigurable,
  TabbedForm,
  useTabbedFormContext,
  useOptionalTabbedFormContext,
  FormTab,
  FormTabPanel,
  generateTabName,
  FormDataConsumer,
  Toolbar,
  TopToolbar,
  SaveButton,
  DeleteButton,
  type SimpleFormProps,
  type SimpleFormConfigurableProps,
  type FieldConfig,
  type TabbedFormProps,
  type TabbedFormContextValue,
  type TabInfo,
  type FormTabProps,
  type FormTabPanelProps,
  type FormDataConsumerProps,
  type FormDataConsumerRenderProps,
  type ToolbarProps,
  type TopToolbarProps,
  type SaveButtonProps,
  type DeleteButtonProps,
} from './form'

// Create components
// Note: CreateBase, CreateBaseProps, CreateContext, CreateContextProvider, useCreateContext,
// SaveHandler, TransformData are NOT re-exported here as they come from ra-core
export {
  Create,
  CreateView,
  useOptionalCreateContext,
  type CreateProps,
  type CreateViewProps,
  type CreateContextValue,
  type CreateContextProviderProps,
  type RedirectTo,
} from './create'

// Edit components
// Note: EditBase, EditBaseProps, MutationMode, Identifier are NOT re-exported here as they come from ra-core
export {
  Edit,
  EditView,
  type EditProps,
  type EditViewProps,
  type EditActionsProps,
} from './edit'

// Show components
// Note: ShowBase, ShowBaseProps, ShowControllerResult are NOT re-exported here as they come from ra-core
export {
  Show,
  ShowView,
  SimpleShowLayout,
  TabbedShowLayout,
  Tab,
  useTabbedShowLayoutContext,
  useOptionalTabbedShowLayoutContext,
  generateShowTabName,
  type ShowProps,
  type ShowViewProps,
  type SimpleShowLayoutProps,
  type TabbedShowLayoutProps,
  type TabbedShowLayoutContextValue,
  type TabProps,
  type ShowTabInfo,
} from './show'

// Layout components
export {
  Layout,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  Sidebar,
  AppBar,
  ContainerLayout,
  Title,
  TitlePortal,
  TitleContextProvider,
  useTitleContext,
  type LayoutProps,
  type SidebarContextValue,
  type SidebarProps,
  type SidebarMenuItem,
  type AppBarProps,
  type AppBarUser,
  type TitleProps,
  type TitlePortalProps,
  type TitleContextProviderProps,
  type TitleContextValue,
} from './layout'

// Menu components
export {
  Menu,
  MenuContext,
  useMenuContext,
  useMenuContextSafe,
  MenuItem,
  DashboardMenuItem,
  SubMenu,
  ResourceItem,
  type MenuProps,
  type MenuContextValue,
  type MenuItemProps,
  type BadgeVariant,
  type DashboardMenuItemProps,
  type SubMenuProps,
  type ResourceItemProps,
} from './menu'

// Auth components
export {
  LoginPage,
  LogoutButton,
  type LoginPageProps,
  type LogoutButtonProps,
} from './auth'

// Feedback components
export {
  Loading,
  Error,
  Empty,
  Confirm,
  NotificationToast,
  NotificationContainer,
  type LoadingProps,
  type ErrorProps,
  type EmptyProps,
  type ConfirmProps,
  type NotificationToastProps,
  type NotificationContainerProps,
} from './feedback'

// Button components (action buttons for navigation and data manipulation)
export {
  CreateButton,
  EditButton,
  ShowButton,
  CloneButton,
  ExportButton,
  BulkDeleteButton,
  BulkDeleteWithConfirmButton,
  BulkExportButton,
  DeleteWithConfirmButton,
  FilterButton,
  type CreateButtonProps,
  type EditButtonProps,
  type ShowButtonProps,
  type CloneButtonProps,
  type ExportButtonProps,
  type BulkDeleteButtonProps,
  type BulkDeleteWithConfirmButtonProps,
  type BulkExportButtonProps,
  type DeleteWithConfirmButtonProps,
  type FilterButtonProps,
  type FilterDefinition,
  InspectorButton,
  type InspectorButtonProps,
  InPlaceEditor,
  type InPlaceEditorProps,
  ColumnsButton,
  type ColumnsButtonProps,
} from './buttons'

// i18n components (locale switching, translations, formatting)
export {
  LocaleSwitcher,
  Translate,
  TranslateLabel,
  useFormatters,
  // Formatting utilities
  formatDate,
  formatDateTime,
  formatTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
  formatList,
  getLocaleDisplayName,
  // Types
  type LocaleSwitcherProps,
  type TranslateProps,
  type TranslateLabelProps,
  type UseFormattersResult,
  type DateFormatOptions,
  type NumberFormatOptions,
  type CurrencyFormatOptions,
  type RelativeTimeFormatOptions,
} from './i18n'

// =============================================================================
// @MDXUI/ADMIN INTEGRATION
// =============================================================================
// The @mdxui/admin integration is available via a separate import:
//   import { MdxList, MdxDatagrid, DatabaseGrid } from 'shadmin/mdxui'
//
// This requires @mdxui/admin to be installed as a peer dependency.
// See: ./mdxui/index.ts for the full export list.
