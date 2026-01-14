import { useForm } from 'react-hook-form'

import { ArrayInput } from './ArrayInput'
import { NumberInput } from './NumberInput'
import { SelectInput } from './SelectInput'
import { SimpleFormIterator } from './SimpleFormIterator'
import { TextInput } from './TextInput'
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
      <form className="w-full max-w-lg space-y-6">{children}</form>
    </FormContextProvider>
  )
}

const meta: Meta<typeof ArrayInput> = {
  title: 'Components/Inputs/ArrayInput',
  component: ArrayInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A form container for managing arrays of form data. Uses react-hook-form useFieldArray internally and works with SimpleFormIterator for rendering items.',
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
      description: 'The field name in the form data for the array',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the array',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the array',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input and all items',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the input takes full width',
    },
    minItems: {
      control: 'number',
      description: 'Minimum number of items in the array',
    },
    maxItems: {
      control: 'number',
      description: 'Maximum number of items in the array',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic array input with a single text field per item
 */
export const Default: Story = {
  args: {
    source: 'tags',
    label: 'Tags',
    children: (
      <SimpleFormIterator>
        <TextInput source="name" label="Tag Name" />
      </SimpleFormIterator>
    ),
  },
}

/**
 * Array input with multiple fields per item
 */
export const MultipleFields: Story = {
  args: {
    source: 'addresses',
    label: 'Addresses',
    children: (
      <SimpleFormIterator>
        <TextInput source="street" label="Street" />
        <TextInput source="city" label="City" />
        <TextInput source="zipCode" label="ZIP Code" />
      </SimpleFormIterator>
    ),
  },
}

/**
 * Array input with helper text
 */
export const WithHelperText: Story = {
  args: {
    source: 'emails',
    label: 'Email Addresses',
    helperText: 'Add one or more email addresses',
    children: (
      <SimpleFormIterator>
        <TextInput source="email" label="Email" placeholder="email@example.com" />
      </SimpleFormIterator>
    ),
  },
}

/**
 * Array input with minimum items constraint
 */
export const WithMinItems: Story = {
  args: {
    source: 'contacts',
    label: 'Emergency Contacts',
    minItems: 1,
    minItemsMessage: 'At least one emergency contact is required',
    children: (
      <SimpleFormIterator>
        <TextInput source="name" label="Name" />
        <TextInput source="phone" label="Phone" />
      </SimpleFormIterator>
    ),
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ contacts: [{ name: '', phone: '' }] }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Array input with maximum items constraint
 */
export const WithMaxItems: Story = {
  args: {
    source: 'references',
    label: 'References',
    maxItems: 3,
    maxItemsMessage: 'Maximum 3 references allowed',
    helperText: 'You can add up to 3 references',
    children: (
      <SimpleFormIterator>
        <TextInput source="name" label="Name" />
        <TextInput source="relationship" label="Relationship" />
      </SimpleFormIterator>
    ),
  },
}

/**
 * Array input with min and max items
 */
export const WithMinMaxItems: Story = {
  args: {
    source: 'skills',
    label: 'Skills',
    minItems: 2,
    maxItems: 5,
    helperText: 'Add between 2 and 5 skills',
    children: (
      <SimpleFormIterator>
        <TextInput source="name" label="Skill Name" />
      </SimpleFormIterator>
    ),
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ skills: [{ name: '' }, { name: '' }] }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Array input with default value for new items
 */
export const WithDefaultValue: Story = {
  args: {
    source: 'items',
    label: 'Order Items',
    defaultValue: { name: '', quantity: 1, price: 0 },
    children: (
      <SimpleFormIterator>
        <TextInput source="name" label="Item Name" />
        <NumberInput source="quantity" label="Quantity" min={1} />
        <NumberInput source="price" label="Price" min={0} step={0.01} />
      </SimpleFormIterator>
    ),
  },
}

/**
 * Array input with inline layout
 */
export const InlineLayout: Story = {
  args: {
    source: 'dimensions',
    label: 'Dimensions',
    children: (
      <SimpleFormIterator inline>
        <NumberInput source="width" label="Width" />
        <NumberInput source="height" label="Height" />
        <NumberInput source="depth" label="Depth" />
      </SimpleFormIterator>
    ),
  },
}

/**
 * Array input with item labels
 */
export const WithItemLabels: Story = {
  args: {
    source: 'steps',
    label: 'Process Steps',
    children: (
      <SimpleFormIterator getItemLabel={(index) => `Step ${index + 1}`}>
        <TextInput source="description" label="Description" />
      </SimpleFormIterator>
    ),
  },
}

/**
 * Array input with disabled add button
 */
export const DisabledAdd: Story = {
  args: {
    source: 'fixed',
    label: 'Fixed Items',
    children: (
      <SimpleFormIterator disableAdd>
        <TextInput source="name" label="Name" />
      </SimpleFormIterator>
    ),
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ fixed: [{ name: 'Item 1' }, { name: 'Item 2' }] }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Array input with disabled remove button
 */
export const DisabledRemove: Story = {
  args: {
    source: 'permanent',
    label: 'Permanent Items',
    children: (
      <SimpleFormIterator disableRemove>
        <TextInput source="name" label="Name" />
      </SimpleFormIterator>
    ),
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ permanent: [{ name: 'Item 1' }] }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Array input with custom add button text
 */
export const CustomAddButton: Story = {
  args: {
    source: 'products',
    label: 'Products',
    children: (
      <SimpleFormIterator addButton="Add Product">
        <TextInput source="name" label="Product Name" />
        <NumberInput source="price" label="Price" />
      </SimpleFormIterator>
    ),
  },
}

/**
 * Disabled array input
 */
export const Disabled: Story = {
  args: {
    source: 'disabledItems',
    label: 'Disabled Items',
    disabled: true,
    children: (
      <SimpleFormIterator>
        <TextInput source="name" label="Name" />
      </SimpleFormIterator>
    ),
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ disabledItems: [{ name: 'Item 1' }, { name: 'Item 2' }] }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Array input with select field
 */
export const WithSelectField: Story = {
  args: {
    source: 'teamMembers',
    label: 'Team Members',
    children: (
      <SimpleFormIterator>
        <TextInput source="name" label="Name" />
        <SelectInput
          source="role"
          label="Role"
          choices={[
            { id: 'developer', name: 'Developer' },
            { id: 'designer', name: 'Designer' },
            { id: 'manager', name: 'Manager' },
            { id: 'qa', name: 'QA Engineer' },
          ]}
        />
      </SimpleFormIterator>
    ),
  },
}

/**
 * Full width array input
 */
export const FullWidth: Story = {
  args: {
    source: 'notes',
    label: 'Notes',
    fullWidth: true,
    children: (
      <SimpleFormIterator>
        <TextInput source="content" label="Note" fullWidth />
      </SimpleFormIterator>
    ),
  },
}

/**
 * Array input with pre-filled data
 */
export const WithPrefilledData: Story = {
  args: {
    source: 'existingItems',
    label: 'Existing Items',
    children: (
      <SimpleFormIterator>
        <TextInput source="name" label="Name" />
        <NumberInput source="quantity" label="Quantity" />
      </SimpleFormIterator>
    ),
  },
  decorators: [
    (Story) => (
      <FormWrapper
        defaultValues={{
          existingItems: [
            { name: 'First Item', quantity: 5 },
            { name: 'Second Item', quantity: 10 },
            { name: 'Third Item', quantity: 3 },
          ],
        }}
      >
        <Story />
      </FormWrapper>
    ),
  ],
}
