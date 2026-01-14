import { useForm } from 'react-hook-form'

import { SelectArrayInput } from './SelectArrayInput'
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
  { id: 'tech', name: 'Technology' },
  { id: 'news', name: 'News' },
  { id: 'sports', name: 'Sports' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'science', name: 'Science' },
  { id: 'health', name: 'Health' },
]

const languageChoices = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'py', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rs', label: 'Rust' },
]

const permissionChoices = [
  { id: 'read', name: 'Read' },
  { id: 'write', name: 'Write' },
  { id: 'delete', name: 'Delete' },
  { id: 'admin', name: 'Admin' },
]

const meta: Meta<typeof SelectArrayInput> = {
  title: 'Components/Inputs/SelectArrayInput',
  component: SelectArrayInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A multi-select input component that stores selected values as an array. Uses a listbox interface for selecting multiple options.',
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
    optionValue: {
      control: 'text',
      description: 'The property name to use as the option value',
    },
    optionText: {
      control: 'text',
      description: 'The property name to use as the option text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic multi-select with default id/name fields
 */
export const Default: Story = {
  args: {
    source: 'tags',
    label: 'Tags',
    choices: tagChoices,
  },
}

/**
 * Multi-select with helper text
 */
export const WithHelperText: Story = {
  args: {
    source: 'categories',
    label: 'Categories',
    choices: tagChoices,
    helperText: 'Select one or more categories',
  },
}

/**
 * Multi-select with custom value/text field names
 */
export const CustomFields: Story = {
  args: {
    source: 'languages',
    label: 'Programming Languages',
    choices: languageChoices,
    optionValue: 'value',
    optionText: 'label',
  },
}

/**
 * Multi-select with custom text renderer function
 */
export const CustomTextRenderer: Story = {
  args: {
    source: 'permissions',
    label: 'User Permissions',
    choices: permissionChoices,
    optionText: (choice: { id: string; name: string }) => `Permission: ${choice.name}`,
  },
}

/**
 * Required multi-select
 */
export const Required: Story = {
  args: {
    source: 'requiredTags',
    label: 'Required Tags',
    choices: tagChoices,
    required: true,
    helperText: 'At least one tag must be selected',
  },
}

/**
 * Multi-select with pre-selected values
 */
export const WithPreselectedValues: Story = {
  args: {
    source: 'selectedTags',
    label: 'Tags',
    choices: tagChoices,
    helperText: 'Some tags are pre-selected',
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ selectedTags: ['tech', 'news'] }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Disabled multi-select
 */
export const Disabled: Story = {
  args: {
    source: 'disabledTags',
    label: 'Disabled Tags',
    choices: tagChoices,
    disabled: true,
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ disabledTags: ['tech', 'science'] }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Multi-select with validation rules
 */
export const WithValidation: Story = {
  args: {
    source: 'validatedTags',
    label: 'Tags',
    choices: tagChoices,
    rules: {
      validate: (value: string[]) =>
        value?.length >= 2 || 'Select at least 2 tags',
    },
    helperText: 'Must select at least 2 tags',
  },
}

/**
 * Full width multi-select
 */
export const FullWidth: Story = {
  args: {
    source: 'wideTags',
    label: 'Full Width Tags',
    choices: tagChoices,
    fullWidth: true,
  },
}

/**
 * Multi-select with many options
 */
export const ManyOptions: Story = {
  args: {
    source: 'manyTags',
    label: 'Many Tags',
    choices: [
      ...tagChoices,
      { id: 'finance', name: 'Finance' },
      { id: 'travel', name: 'Travel' },
      { id: 'food', name: 'Food' },
      { id: 'fashion', name: 'Fashion' },
      { id: 'gaming', name: 'Gaming' },
      { id: 'music', name: 'Music' },
    ],
    helperText: 'Scroll to see all options',
  },
}

/**
 * Multi-select for permissions
 */
export const Permissions: Story = {
  args: {
    source: 'permissions',
    label: 'Access Permissions',
    choices: permissionChoices,
    helperText: 'Grant permissions to the user',
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ permissions: ['read'] }}>
        <Story />
      </FormWrapper>
    ),
  ],
}
