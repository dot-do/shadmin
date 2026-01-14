import { useForm } from 'react-hook-form'

import { DateTimeInput } from './DateTimeInput'
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

const meta: Meta<typeof DateTimeInput> = {
  title: 'Components/Inputs/DateTimeInput',
  component: DateTimeInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A form input component for datetime selection using the native HTML datetime-local input. Integrates with react-hook-form and supports min/max constraints.',
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
      description: 'Minimum datetime value (YYYY-MM-DDTHH:MM format)',
    },
    max: {
      control: 'text',
      description: 'Maximum datetime value (YYYY-MM-DDTHH:MM format)',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic datetime input with label
 */
export const Default: Story = {
  args: {
    source: 'eventStart',
    label: 'Event Start',
  },
}

/**
 * Datetime input with helper text
 */
export const WithHelperText: Story = {
  args: {
    source: 'meetingTime',
    label: 'Meeting Time',
    helperText: 'Select the date and time for your meeting',
  },
}

/**
 * Required datetime input
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
 * Datetime input with min and max constraints
 */
export const WithMinMax: Story = {
  args: {
    source: 'appointmentTime',
    label: 'Appointment Time',
    min: '2024-01-01T09:00',
    max: '2024-12-31T17:00',
    helperText: 'Select a time during business hours in 2024',
  },
}

/**
 * Datetime input with step for time precision
 */
export const WithStep: Story = {
  args: {
    source: 'preciseTime',
    label: 'Precise Time',
    step: 60,
    helperText: 'Time increments in 1-minute intervals',
  },
}

/**
 * Disabled datetime input with a pre-filled value
 */
export const Disabled: Story = {
  args: {
    source: 'lockedDateTime',
    label: 'Locked DateTime',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ lockedDateTime: '2024-06-15T14:30' }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Datetime input with a default value
 */
export const WithDefaultValue: Story = {
  args: {
    source: 'scheduledTime',
    label: 'Scheduled Time',
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ scheduledTime: '2024-03-20T10:00' }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Datetime input with validation rules
 */
export const WithValidation: Story = {
  args: {
    source: 'futureDateTime',
    label: 'Future DateTime',
    rules: {
      required: 'DateTime is required',
      validate: (value: string) => {
        return new Date(value) > new Date() || 'DateTime must be in the future'
      },
    },
    helperText: 'Select a datetime that is in the future',
  },
}

/**
 * Full width datetime input
 */
export const FullWidth: Story = {
  args: {
    source: 'wideDateTime',
    label: 'Full Width DateTime',
    fullWidth: true,
  },
}
