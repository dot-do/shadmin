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
// Note: MdxDatagrid is commented out - requires @mdxui/admin which is optional
export {
  MdxList,
  // MdxDatagrid, // Requires @mdxui/admin - uncomment when installed
  MdxEdit,
  MdxCreate,
  MdxShow,
  MdxSimpleForm,
  type MdxListProps,
  // type MdxDatagridProps, // Requires @mdxui/admin - uncomment when installed
  type MdxEditProps,
  type MdxCreateProps,
  type MdxShowProps,
  type MdxSimpleFormProps,
} from './wrappers'

// =============================================================================
// @mdxui/admin RE-EXPORTS (OPTIONAL PEER DEPENDENCY)
// =============================================================================
// These exports are only available when @mdxui/admin is installed.
// @mdxui/admin is an optional peer dependency - users must install it separately.
//
// When @mdxui/admin is installed, users can import directly from '@mdxui/admin':
//   import { TextField, TextInput, DatabaseGrid } from '@mdxui/admin'
//
// The re-exports below are commented out because the package is optional
// and may not be installed in all environments.
// =============================================================================

// FIELD COMPONENTS (Display-only, for showing data)
// export {
//   TextField as MdxTextField,
//   NumberField as MdxNumberField,
//   DateField as MdxDateField,
//   BooleanField as MdxBooleanField,
//   EmailField as MdxEmailField,
//   UrlField as MdxUrlField,
//   ImageField as MdxImageField,
//   ReferenceField as MdxReferenceField,
//   ArrayField as MdxArrayField,
//   ChipField as MdxChipField,
//   FunctionField as MdxFunctionField,
//   SelectField as MdxSelectField,
//   FileField as MdxFileField,
//   RichTextField as MdxRichTextField,
//   type FieldRecord,
//   type BaseFieldProps,
//   type TextFieldProps as MdxTextFieldProps,
//   type NumberFieldProps as MdxNumberFieldProps,
//   type DateFieldProps as MdxDateFieldProps,
//   type BooleanFieldProps as MdxBooleanFieldProps,
//   type EmailFieldProps as MdxEmailFieldProps,
//   type UrlFieldProps as MdxUrlFieldProps,
//   type ImageFieldProps as MdxImageFieldProps,
//   type ReferenceFieldProps as MdxReferenceFieldProps,
//   type ArrayFieldProps as MdxArrayFieldProps,
//   type ChipFieldProps as MdxChipFieldProps,
//   type FunctionFieldProps as MdxFunctionFieldProps,
//   type SelectFieldChoice as MdxSelectFieldChoice,
//   type SelectFieldProps as MdxSelectFieldProps,
//   type FileValue as MdxFileValue,
//   type FileFieldProps as MdxFileFieldProps,
//   type RichTextFieldProps as MdxRichTextFieldProps,
// } from '@mdxui/admin'

// INPUT COMPONENTS (Form inputs, controlled components)
// export {
//   TextInput as MdxTextInput,
//   NumberInput as MdxNumberInput,
//   SelectInput as MdxSelectInput,
//   BooleanInput as MdxBooleanInput,
//   DateInput as MdxDateInput,
//   DateTimeInput as MdxDateTimeInput,
//   TextareaInput as MdxTextareaInput,
//   PasswordInput as MdxPasswordInput,
//   ReferenceInput as MdxReferenceInput,
//   AutocompleteInput as MdxAutocompleteInput,
//   ArrayInput as MdxArrayInput,
//   FileInput as MdxFileInput,
//   ImageInput as MdxImageInput,
//   SearchInput as MdxSearchInput,
//   type BaseInputProps as MdxBaseInputProps,
//   type TextInputProps as MdxTextInputProps,
//   type NumberInputProps as MdxNumberInputProps,
//   type SelectChoice as MdxSelectChoice,
//   type SelectInputProps as MdxSelectInputProps,
//   type BooleanInputProps as MdxBooleanInputProps,
//   type DateInputProps as MdxDateInputProps,
//   type DateTimeInputProps as MdxDateTimeInputProps,
//   type TextareaInputProps as MdxTextareaInputProps,
//   type PasswordInputProps as MdxPasswordInputProps,
//   type ReferenceInputProps as MdxReferenceInputProps,
//   type AutocompleteInputProps as MdxAutocompleteInputProps,
//   type ArrayInputProps as MdxArrayInputProps,
//   type AcceptProp as MdxAcceptProp,
//   type FileInputProps as MdxFileInputProps,
//   type ImageInputProps as MdxImageInputProps,
//   type SearchInputProps as MdxSearchInputProps,
// } from '@mdxui/admin'

// TABLE EDITOR COMPONENTS (Supabase-style database editor)
// export {
//   DatabaseGrid,
//   DatabaseSidebar,
//   DatabaseSidebarTrigger,
//   ColumnEditorPanel,
//   TableCreatorPanel,
//   TableFilter,
//   applyFilters,
//   matchesFilter,
//   useEditHistory,
//   TextEditor,
//   NumberEditor,
//   BooleanEditor,
//   DateEditor,
//   JsonEditor,
//   SelectEditor,
//   getEditorType,
//   getEditorForColumn,
//   type DatabaseGridProps,
//   type DatabaseColumnDef,
//   type ColumnDataType,
//   type DatabaseSidebarProps,
//   type DatabaseSchema,
//   type DatabaseTable,
//   type ColumnEditorPanelProps,
//   type TableColumn,
//   type ColumnEditorErrors,
//   type ReferenceTable,
//   type TableCreatorPanelProps,
//   type NewTableColumn,
//   type NewTableDefinition,
//   type TableFilterProps,
//   type FilterCondition,
//   type FilterOperator,
//   type TextFilterOperator,
//   type NumberFilterOperator,
//   type BooleanFilterOperator,
//   type DateFilterOperator,
//   type EditOperation,
//   type UseEditHistoryOptions,
//   type UseEditHistoryReturn,
//   type TextEditorProps,
//   type NumberEditorProps,
//   type BooleanEditorProps,
//   type DateEditorProps,
//   type JsonEditorProps,
//   type SelectEditorProps,
//   type SelectOption,
//   type BaseCellEditorProps,
//   type EditorType,
//   type ColumnEditorConfig,
// } from '@mdxui/admin'
