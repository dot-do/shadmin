/**
 * @mdxui/admin Re-exports
 *
 * This module re-exports pure UI components from @mdxui/admin.
 * These components are headless/presentational and can be used independently
 * of react-admin context, or composed with react-admin context wrappers.
 *
 * For react-admin integration, use the wrapped components from shadmin directly
 * (List, Datagrid, Edit, Create, Show, SimpleForm, etc.)
 *
 * For pure UI components without react-admin context, import from this module:
 * - Field components (TextField, NumberField, etc.) - display-only
 * - Input components (TextInput, NumberInput, etc.) - pure controlled inputs
 * - Table Editor components (DatabaseGrid, etc.) - Supabase-style editing
 */

// =============================================================================
// REACT-ADMIN CONTEXT WRAPPERS
// =============================================================================
// Wrapper components that connect @mdxui/admin UI to react-admin context
export {
  MdxList,
  MdxDatagrid,
  MdxEdit,
  MdxCreate,
  MdxShow,
  MdxSimpleForm,
  type MdxListProps,
  type MdxDatagridProps,
  type MdxEditProps,
  type MdxCreateProps,
  type MdxShowProps,
  type MdxSimpleFormProps,
} from './wrappers'

// =============================================================================
// FIELD COMPONENTS (Display-only, for showing data)
// =============================================================================
export {
  // Components
  TextField as MdxTextField,
  NumberField as MdxNumberField,
  DateField as MdxDateField,
  BooleanField as MdxBooleanField,
  EmailField as MdxEmailField,
  UrlField as MdxUrlField,
  ImageField as MdxImageField,
  ReferenceField as MdxReferenceField,
  ArrayField as MdxArrayField,
  ChipField as MdxChipField,
  FunctionField as MdxFunctionField,
  SelectField as MdxSelectField,
  FileField as MdxFileField,
  RichTextField as MdxRichTextField,
  // Types
  type FieldRecord,
  type BaseFieldProps,
  type TextFieldProps as MdxTextFieldProps,
  type NumberFieldProps as MdxNumberFieldProps,
  type DateFieldProps as MdxDateFieldProps,
  type BooleanFieldProps as MdxBooleanFieldProps,
  type EmailFieldProps as MdxEmailFieldProps,
  type UrlFieldProps as MdxUrlFieldProps,
  type ImageFieldProps as MdxImageFieldProps,
  type ReferenceFieldProps as MdxReferenceFieldProps,
  type ArrayFieldProps as MdxArrayFieldProps,
  type ChipFieldProps as MdxChipFieldProps,
  type FunctionFieldProps as MdxFunctionFieldProps,
  type SelectFieldChoice as MdxSelectFieldChoice,
  type SelectFieldProps as MdxSelectFieldProps,
  type FileValue as MdxFileValue,
  type FileFieldProps as MdxFileFieldProps,
  type RichTextFieldProps as MdxRichTextFieldProps,
} from '@mdxui/admin'

// =============================================================================
// INPUT COMPONENTS (Form inputs, controlled components)
// =============================================================================
export {
  // Components
  TextInput as MdxTextInput,
  NumberInput as MdxNumberInput,
  SelectInput as MdxSelectInput,
  BooleanInput as MdxBooleanInput,
  DateInput as MdxDateInput,
  DateTimeInput as MdxDateTimeInput,
  TextareaInput as MdxTextareaInput,
  PasswordInput as MdxPasswordInput,
  ReferenceInput as MdxReferenceInput,
  AutocompleteInput as MdxAutocompleteInput,
  ArrayInput as MdxArrayInput,
  FileInput as MdxFileInput,
  ImageInput as MdxImageInput,
  SearchInput as MdxSearchInput,
  // Types
  type BaseInputProps as MdxBaseInputProps,
  type TextInputProps as MdxTextInputProps,
  type NumberInputProps as MdxNumberInputProps,
  type SelectChoice as MdxSelectChoice,
  type SelectInputProps as MdxSelectInputProps,
  type BooleanInputProps as MdxBooleanInputProps,
  type DateInputProps as MdxDateInputProps,
  type DateTimeInputProps as MdxDateTimeInputProps,
  type TextareaInputProps as MdxTextareaInputProps,
  type PasswordInputProps as MdxPasswordInputProps,
  type ReferenceInputProps as MdxReferenceInputProps,
  type AutocompleteInputProps as MdxAutocompleteInputProps,
  type ArrayInputProps as MdxArrayInputProps,
  type AcceptProp as MdxAcceptProp,
  type FileInputProps as MdxFileInputProps,
  type ImageInputProps as MdxImageInputProps,
  type SearchInputProps as MdxSearchInputProps,
} from '@mdxui/admin'

// =============================================================================
// TABLE EDITOR COMPONENTS (Supabase-style database editor)
// =============================================================================
export {
  // Main components
  DatabaseGrid,
  DatabaseSidebar,
  DatabaseSidebarTrigger,
  ColumnEditorPanel,
  TableCreatorPanel,
  TableFilter,
  // Filter utilities
  applyFilters,
  matchesFilter,
  // Hooks
  useEditHistory,
  // Editors
  TextEditor,
  NumberEditor,
  BooleanEditor,
  DateEditor,
  JsonEditor,
  SelectEditor,
  // Utility functions
  getEditorType,
  getEditorForColumn,
  // Types - Main components
  type DatabaseGridProps,
  type DatabaseColumnDef,
  type ColumnDataType,
  type DatabaseSidebarProps,
  type DatabaseSchema,
  type DatabaseTable,
  type ColumnEditorPanelProps,
  type TableColumn,
  type ColumnEditorErrors,
  type ReferenceTable,
  type TableCreatorPanelProps,
  type NewTableColumn,
  type NewTableDefinition,
  type TableFilterProps,
  type FilterCondition,
  type FilterOperator,
  type TextFilterOperator,
  type NumberFilterOperator,
  type BooleanFilterOperator,
  type DateFilterOperator,
  // Types - Edit history
  type EditOperation,
  type UseEditHistoryOptions,
  type UseEditHistoryReturn,
  // Types - Editors
  type TextEditorProps,
  type NumberEditorProps,
  type BooleanEditorProps,
  type DateEditorProps,
  type JsonEditorProps,
  type SelectEditorProps,
  type SelectOption,
  type BaseCellEditorProps,
  type EditorType,
  type ColumnEditorConfig,
} from '@mdxui/admin'
