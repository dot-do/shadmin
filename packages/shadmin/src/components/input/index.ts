/**
 * Input Components
 * Form input components that integrate with react-hook-form through FormContext
 */

// TextInput - Basic text entry
export { TextInput, type TextInputProps } from './TextInput'

// NumberInput - Number entry with min/max/step support
export { NumberInput, type NumberInputProps } from './NumberInput'

// PasswordInput - Password entry with show/hide toggle
export { PasswordInput, type PasswordInputProps } from './PasswordInput'

// DateInput - Date selection using native date input
export { DateInput, type DateInputProps } from './DateInput'

// DateTimeInput - DateTime selection using native datetime-local input
export { DateTimeInput, type DateTimeInputProps } from './DateTimeInput'

// SelectInput - Dropdown selection with choices
export { SelectInput, type SelectInputProps, type SelectChoice } from './SelectInput'

// BooleanInput - Switch/toggle for boolean values
export { BooleanInput, type BooleanInputProps } from './BooleanInput'

// SelectArrayInput - Multi-select for array values
export { SelectArrayInput, type SelectArrayInputProps, type SelectArrayChoice } from './SelectArrayInput'

// RadioButtonGroupInput - Radio button group for single selection
export { RadioButtonGroupInput, type RadioButtonGroupInputProps, type RadioChoice } from './RadioButtonGroupInput'

// CheckboxGroupInput - Checkbox group for multi-selection (array values)
export { CheckboxGroupInput, type CheckboxGroupInputProps, type CheckboxChoice } from './CheckboxGroupInput'

// ReferenceArrayInput - Array input with choices fetched from referenced resource
export { ReferenceArrayInput, type ReferenceArrayInputProps } from './ReferenceArrayInput'

// ReferenceInput - Single reference input with choices fetched from referenced resource
export { ReferenceInput, type ReferenceInputProps, type ReferenceChoice, type ReferenceSort } from './ReferenceInput'

// AutocompleteInput - Typeahead autocomplete input
export { AutocompleteInput, type AutocompleteInputProps, type AutocompleteChoice } from './AutocompleteInput'

// AutocompleteArrayInput - Typeahead autocomplete for multiple selections
export { AutocompleteArrayInput, type AutocompleteArrayInputProps, type AutocompleteArrayChoice } from './AutocompleteArrayInput'

// ArrayInput - Container for array form fields
export { ArrayInput, ArrayInputContext, useArrayInputContext, type ArrayInputProps, type ArrayInputContextValue } from './ArrayInput'

// SimpleFormIterator - Renders items within ArrayInput
export { SimpleFormIterator, type SimpleFormIteratorProps } from './SimpleFormIterator'

// TimeInput - Time picker input
export { TimeInput, type TimeInputProps } from './TimeInput'

// FileInput - File upload with drag-and-drop support
export { FileInput, type FileInputProps } from './FileInput'

// ImageInput - Image upload with preview
export { ImageInput, type ImageInputProps } from './ImageInput'

// RichTextInput - Rich text editor with formatting toolbar
export { RichTextInput, type RichTextInputProps } from './RichTextInput'

// TranslatableInputs - Wrapper for translatable input fields
export {
  TranslatableInputs,
  useTranslatableInputsContext,
  useOptionalTranslatableInputsContext,
  type TranslatableInputsProps,
  type TranslatableInputsContextValue,
} from './TranslatableInputs'

// SearchInput - Text input styled for searching in list filters
export { SearchInput, type SearchInputProps } from './SearchInput'
