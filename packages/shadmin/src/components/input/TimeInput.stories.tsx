import { useForm } from 'react-hook-form'

import { TimeInput } from './TimeInput'
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

const meta: Meta<typeof TimeInput> = {
  title: 'Components/Inputs/TimeInput',
  component: TimeInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A form input component for time selection using the native HTML time input. Integrates with react-hook-form and supports min/max time validation.',
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
      description: 'Minimum time value (HH:MM format)',
    },
    max: {
      control: 'text',
      description: 'Maximum time value (HH:MM format)',
    },
    step: {
      control: 'number',
      description: 'Step granularity in seconds',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic time input with label
 */
export const Default: Story = {
  args: {
    source: 'startTime',
    label: 'Start Time',
  },
}

/**
 * Time input with helper text
 */
export const WithHelperText: Story = {
  args: {
    source: 'meetingTime',
    label: 'Meeting Time',
    helperText: 'Select the time for your meeting',
  },
}

/**
 * Required time input
 */
export const Required: Story = {
  args: {
    source: 'checkInTime',
    label: 'Check-in Time',
    required: true,
    helperText: 'This field is required',
  },
}

/**
 * Time input with min and max constraints (business hours)
 */
export const BusinessHours: Story = {
  args: {
    source: 'appointmentTime',
    label: 'Appointment Time',
    min: '09:00',
    max: '17:00',
    helperText: 'Select a time between 9 AM and 5 PM',
  },
}

/**
 * Time input with custom min/max error messages
 */
export const WithCustomMessages: Story = {
  args: {
    source: 'shiftStart',
    label: 'Shift Start',
    min: '08:00',
    max: '20:00',
    minMessage: 'Shifts cannot start before 8 AM',
    maxMessage: 'Shifts cannot start after 8 PM',
    helperText: 'Enter a valid shift start time',
  },
}

/**
 * Time input with step for granularity (15 minute intervals)
 */
export const WithStep: Story = {
  args: {
    source: 'scheduledTime',
    label: 'Scheduled Time',
    step: 900,
    helperText: 'Time increments in 15-minute intervals',
  },
}

/**
 * Time input with 1-minute precision
 */
export const MinutePrecision: Story = {
  args: {
    source: 'preciseTime',
    label: 'Precise Time',
    step: 60,
    helperText: 'Select time with 1-minute precision',
  },
}

/**
 * Disabled time input with a pre-filled value
 */
export const Disabled: Story = {
  args: {
    source: 'lockedTime',
    label: 'Locked Time',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ lockedTime: '14:30' }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Time input with a default value
 */
export const WithDefaultValue: Story = {
  args: {
    source: 'defaultTime',
    label: 'Default Time',
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ defaultTime: '10:00' }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Full width time input
 */
export const FullWidth: Story = {
  args: {
    source: 'wideTime',
    label: 'Full Width Time',
    fullWidth: true,
  },
}

/**
 * Multiple time inputs for time range selection
 */
export const TimeRange: Story = {
  render: () => (
    <FormWrapper defaultValues={{ openTime: '09:00', closeTime: '17:00' }}>
      <div className="space-y-4">
        <TimeInput source="openTime" label="Opening Time" />
        <TimeInput source="closeTime" label="Closing Time" />
      </div>
    </FormWrapper>
  ),
}
