import { useForm } from 'react-hook-form'

import { AutocompleteArrayInput } from './AutocompleteArrayInput'
import { FormContextProvider } from '../../contexts/FormContext'

import type { Meta, StoryObj } from '@storybook/react'

/**
 * Wrapper component that provides form context for stories
 */
function FormWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode
  defaultValues?: Record<string, unknown>
}) {
  const form = useForm({ defaultValues })
  return (
    <FormContextProvider {...form} resource="stories">
      <form className="w-full max-w-md space-y-6">{children}</form>
    </FormContextProvider>
  )
}

const tagChoices = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue' },
  { id: 'angular', name: 'Angular' },
  { id: 'svelte', name: 'Svelte' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'nodejs', name: 'Node.js' },
  { id: 'python', name: 'Python' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
]

const userChoices = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  { id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
  { id: '4', firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com' },
]

const skillChoices = [
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'backend', label: 'Backend Development' },
  { value: 'devops', label: 'DevOps' },
  { value: 'design', label: 'UI/UX Design' },
  { value: 'mobile', label: 'Mobile Development' },
]

const meta: Meta<typeof AutocompleteArrayInput> = {
  title: 'Components/Inputs/AutocompleteArrayInput',
  component: AutocompleteArrayInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A multi-select input with autocomplete/typeahead functionality. Supports filtering, creating new options, and displays selected values as removable chips.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <FormWrapper>
        <Story />
      </FormWrapper>
    ),
  ],
  argTypes: {
    source: {
      control: 'text',
      description: 'The field name in the form data',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    required: {
      control: 'boolean',
      description: 'Makes the field required',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the input takes full width',
    },
    debounce: {
      control: 'number',
      description: 'Debounce delay for filtering in milliseconds',
    },
    openOnFocus: {
      control: 'boolean',
      description: 'Open dropdown on focus',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic autocomplete multi-select
 */
export const Default: Story = {
  args: {
    source: 'technologies',
    label: 'Technologies',
    choices: tagChoices,
  },
}

/**
 * Autocomplete with helper text
 */
export const WithHelperText: Story = {
  args: {
    source: 'skills',
    label: 'Skills',
    choices: tagChoices,
    helperText: 'Type to filter and select multiple technologies',
  },
}

/**
 * Autocomplete with custom value/text fields
 */
export const CustomFields: Story = {
  args: {
    source: 'selectedSkills',
    label: 'Skills',
    choices: skillChoices,
    optionValue: 'value',
    optionText: 'label',
  },
}

/**
 * Autocomplete with custom text renderer function
 */
export const CustomTextRenderer: Story = {
  args: {
    source: 'assignees',
    label: 'Assign To',
    choices: userChoices,
    optionText: (choice: Record<string, unknown>) => `${choice.firstName} ${choice.lastName}`,
  },
}

/**
 * Autocomplete with debounced filtering
 */
export const WithDebounce: Story = {
  args: {
    source: 'debouncedTech',
    label: 'Technologies (Debounced)',
    choices: tagChoices,
    debounce: 300,
    helperText: '300ms debounce on filtering',
  },
}

/**
 * Autocomplete with create new option functionality
 */
export const WithCreate: Story = {
  args: {
    source: 'customTags',
    label: 'Tags',
    choices: tagChoices,
    create: async (value: string) => {
      // Simulate async creation
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id: value.toLowerCase().replace(/\s+/g, '-'), name: value }
    },
    helperText: 'Type a new value and press Enter to create',
  },
}

/**
 * Autocomplete with legacy onCreate prop
 */
export const WithOnCreate: Story = {
  args: {
    source: 'customTags2',
    label: 'Tags (Legacy onCreate)',
    choices: tagChoices,
    onCreate: async (value: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id: value.toLowerCase().replace(/\s+/g, '-'), name: value }
    },
    helperText: 'Using legacy onCreate prop',
  },
}

/**
 * Required autocomplete
 */
export const Required: Story = {
  args: {
    source: 'requiredTech',
    label: 'Required Technologies',
    choices: tagChoices,
    required: true,
    helperText: 'At least one technology must be selected',
  },
}

/**
 * Autocomplete with pre-selected values
 */
export const WithPreselectedValues: Story = {
  args: {
    source: 'preselectedTech',
    label: 'Technologies',
    choices: tagChoices,
    helperText: 'Some technologies are pre-selected',
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ preselectedTech: ['react', 'typescript'] }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Disabled autocomplete
 */
export const Disabled: Story = {
  args: {
    source: 'disabledTech',
    label: 'Disabled Technologies',
    choices: tagChoices,
    disabled: true,
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ disabledTech: ['react', 'vue'] }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Autocomplete without opening on focus
 */
export const NoOpenOnFocus: Story = {
  args: {
    source: 'noFocusTech',
    label: 'Technologies',
    choices: tagChoices,
    openOnFocus: false,
    helperText: 'Dropdown does not open on focus, only on typing',
  },
}

/**
 * Autocomplete with validation rules
 */
export const WithValidation: Story = {
  args: {
    source: 'validatedTech',
    label: 'Technologies',
    choices: tagChoices,
    rules: {
      validate: (value: string[]) =>
        (value?.length >= 2 && value?.length <= 5) ||
        'Select between 2 and 5 technologies',
    },
    helperText: 'Must select between 2 and 5 technologies',
  },
}

/**
 * Full width autocomplete
 */
export const FullWidth: Story = {
  args: {
    source: 'wideTech',
    label: 'Full Width Technologies',
    choices: tagChoices,
    fullWidth: true,
  },
}

/**
 * Autocomplete for user assignment
 */
export const UserAssignment: Story = {
  args: {
    source: 'teamMembers',
    label: 'Team Members',
    choices: userChoices,
    optionText: (choice: Record<string, unknown>) => `${choice.firstName} ${choice.lastName} (${choice.email})`,
    helperText: 'Assign team members to this project',
  },
}
