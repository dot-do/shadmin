import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { DateInput } from './DateInput'

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

const meta: Meta<typeof DateInput> = {
  title: 'Components/Inputs/DateInput',
  component: DateInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A form input component for date selection using the native HTML date input. Integrates with react-hook-form and supports min/max date validation.',
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
    min: {
      control: 'text',
      description: 'Minimum date value (YYYY-MM-DD format)',
    },
    max: {
      control: 'text',
      description: 'Maximum date value (YYYY-MM-DD format)',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic date input with label
 */
export const Default: Story = {
  args: {
    source: 'birthDate',
    label: 'Birth Date',
  },
}

/**
 * Date input with helper text
 */
export const WithHelperText: Story = {
  args: {
    source: 'eventDate',
    label: 'Event Date',
    helperText: 'Select the date for your event',
  },
}

/**
 * Required date input
 */
export const Required: Story = {
  args: {
    source: 'deadline',
    label: 'Deadline',
    required: true,
    helperText: 'This field is required',
  },
}

/**
 * Date input with min and max constraints
 */
export const WithMinMax: Story = {
  args: {
    source: 'appointmentDate',
    label: 'Appointment Date',
    min: '2024-01-01',
    max: '2024-12-31',
    helperText: 'Select a date in 2024',
  },
}

/**
 * Date input with custom min/max error messages
 */
export const WithCustomMessages: Story = {
  args: {
    source: 'startDate',
    label: 'Start Date',
    min: '2024-01-01',
    max: '2024-12-31',
    minMessage: 'Date must be in 2024 or later',
    maxMessage: 'Date must be before 2025',
    helperText: 'Enter a date within the valid range',
  },
}

/**
 * Disabled date input with a pre-filled value
 */
export const Disabled: Story = {
  args: {
    source: 'lockedDate',
    label: 'Locked Date',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ lockedDate: '2024-06-15' }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Date input with a default value
 */
export const WithDefaultValue: Story = {
  args: {
    source: 'scheduledDate',
    label: 'Scheduled Date',
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ scheduledDate: '2024-03-20' }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Date input with validation rules
 */
export const WithValidation: Story = {
  args: {
    source: 'futureDate',
    label: 'Future Date',
    rules: {
      required: 'Date is required',
      validate: (value: string) => {
        const today = new Date().toISOString().split('T')[0] ?? ''
        return value >= today || 'Date must be today or in the future'
      },
    },
    helperText: 'Select a date that is today or later',
  },
}

/**
 * Full width date input
 */
export const FullWidth: Story = {
  args: {
    source: 'wideDate',
    label: 'Full Width Date',
    fullWidth: true,
  },
}
