import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { TextInput } from './TextInput'
import { NumberInput } from './NumberInput'
import { PasswordInput } from './PasswordInput'
import { SelectInput } from './SelectInput'
import { AutocompleteInput } from './AutocompleteInput'
import { BooleanInput } from './BooleanInput'
import { RadioButtonGroupInput } from './RadioButtonGroupInput'
import { CheckboxGroupInput } from './CheckboxGroupInput'

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

// ============================================================================
// TextInput Stories
// ============================================================================

const textInputMeta = {
  title: 'Components/Inputs/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A form input component for text entry that integrates with react-hook-form. Supports validation, helper text, and various states.',
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
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
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
  },
} satisfies Meta<typeof TextInput>

export default textInputMeta
type TextInputStory = StoryObj<typeof textInputMeta>

/**
 * Basic text input with label
 */
export const Default: TextInputStory = {
  args: {
    source: 'firstName',
    label: 'First Name',
  },
}

/**
 * Text input with placeholder text
 */
export const WithPlaceholder: TextInputStory = {
  args: {
    source: 'email',
    label: 'Email Address',
    placeholder: 'you@example.com',
  },
}

/**
 * Text input with helper text
 */
export const WithHelperText: TextInputStory = {
  args: {
    source: 'username',
    label: 'Username',
    helperText: 'Choose a unique username (3-20 characters)',
  },
}

/**
 * Required text input
 */
export const Required: TextInputStory = {
  args: {
    source: 'requiredField',
    label: 'Required Field',
    required: true,
  },
}

/**
 * Disabled text input
 */
export const Disabled: TextInputStory = {
  args: {
    source: 'disabledField',
    label: 'Disabled Field',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ disabledField: 'Cannot edit this' }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Text input with validation
 */
export const WithValidation: TextInputStory = {
  args: {
    source: 'validatedEmail',
    label: 'Email',
    rules: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email format',
      },
    },
  },
  render: (args) => (
    <FormWrapper>
      <TextInput {...args} />
      <p className="text-sm text-muted-foreground mt-2">
        Try entering an invalid email to see validation
      </p>
    </FormWrapper>
  ),
}

/**
 * Read-only text input
 */
export const ReadOnly: TextInputStory = {
  args: {
    source: 'readOnlyField',
    label: 'Read Only Field',
    readOnly: true,
  },
  decorators: [
    (Story) => (
      <FormWrapper defaultValues={{ readOnlyField: 'Read-only content' }}>
        <Story />
      </FormWrapper>
    ),
  ],
}

// ============================================================================
// NumberInput Stories
// ============================================================================

export const NumberInputDefault: StoryObj<typeof NumberInput> = {
  name: 'NumberInput / Default',
  render: () => (
    <FormWrapper>
      <NumberInput source="age" label="Age" />
    </FormWrapper>
  ),
}

export const NumberInputWithMinMax: StoryObj<typeof NumberInput> = {
  name: 'NumberInput / With Min/Max',
  render: () => (
    <FormWrapper defaultValues={{ quantity: 5 }}>
      <NumberInput
        source="quantity"
        label="Quantity"
        min={1}
        max={100}
        helperText="Enter a value between 1 and 100"
      />
    </FormWrapper>
  ),
}

export const NumberInputWithStep: StoryObj<typeof NumberInput> = {
  name: 'NumberInput / With Step',
  render: () => (
    <FormWrapper defaultValues={{ price: 9.99 }}>
      <NumberInput
        source="price"
        label="Price"
        step={0.01}
        min={0}
        placeholder="0.00"
        helperText="Enter price with up to 2 decimal places"
      />
    </FormWrapper>
  ),
}

export const NumberInputWithValidation: StoryObj<typeof NumberInput> = {
  name: 'NumberInput / With Validation',
  render: () => (
    <FormWrapper>
      <NumberInput
        source="rating"
        label="Rating"
        min={1}
        max={5}
        rules={{
          required: 'Rating is required',
          min: { value: 1, message: 'Minimum rating is 1' },
          max: { value: 5, message: 'Maximum rating is 5' },
        }}
      />
    </FormWrapper>
  ),
}

export const NumberInputDisabled: StoryObj<typeof NumberInput> = {
  name: 'NumberInput / Disabled',
  render: () => (
    <FormWrapper defaultValues={{ total: 42 }}>
      <NumberInput source="total" label="Total (Auto-calculated)" disabled />
    </FormWrapper>
  ),
}

// ============================================================================
// PasswordInput Stories
// ============================================================================

export const PasswordInputDefault: StoryObj<typeof PasswordInput> = {
  name: 'PasswordInput / Default',
  render: () => (
    <FormWrapper>
      <PasswordInput source="password" label="Password" />
    </FormWrapper>
  ),
}

export const PasswordInputWithToggle: StoryObj<typeof PasswordInput> = {
  name: 'PasswordInput / Show/Hide Toggle',
  render: () => (
    <FormWrapper>
      <PasswordInput
        source="secret"
        label="Secret Key"
        helperText="Click the eye icon to toggle visibility"
      />
    </FormWrapper>
  ),
}

export const PasswordInputWithValidation: StoryObj<typeof PasswordInput> = {
  name: 'PasswordInput / With Validation',
  render: () => (
    <FormWrapper>
      <PasswordInput
        source="securePassword"
        label="Create Password"
        placeholder="Enter a strong password"
        rules={{
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            message:
              'Password must contain uppercase, lowercase, and a number',
          },
        }}
        helperText="Must be at least 8 characters with uppercase, lowercase, and numbers"
      />
    </FormWrapper>
  ),
}

export const PasswordInputConfirmation: StoryObj<typeof PasswordInput> = {
  name: 'PasswordInput / Confirmation Pattern',
  render: () => (
    <FormWrapper>
      <div className="space-y-4">
        <PasswordInput
          source="newPassword"
          label="New Password"
          autoComplete="new-password"
          required
        />
        <PasswordInput
          source="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          required
        />
      </div>
    </FormWrapper>
  ),
}

// ============================================================================
// SelectInput Stories
// ============================================================================

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'pending', name: 'Pending' },
]

const countryChoices = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
]

const userChoices = [
  { id: 1, firstName: 'John', lastName: 'Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Smith' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson' },
]

const disabledChoices = [
  { id: 'free', name: 'Free', disabled: false },
  { id: 'basic', name: 'Basic', disabled: false },
  { id: 'pro', name: 'Pro', disabled: true },
  { id: 'enterprise', name: 'Enterprise', disabled: true },
]

export const SelectInputDefault: StoryObj<typeof SelectInput> = {
  name: 'SelectInput / Default',
  render: () => (
    <FormWrapper>
      <SelectInput source="status" label="Status" choices={statusChoices} />
    </FormWrapper>
  ),
}

export const SelectInputWithPlaceholder: StoryObj<typeof SelectInput> = {
  name: 'SelectInput / With Placeholder',
  render: () => (
    <FormWrapper>
      <SelectInput
        source="status"
        label="Status"
        choices={statusChoices}
        emptyText="Select a status..."
      />
    </FormWrapper>
  ),
}

export const SelectInputCustomFields: StoryObj<typeof SelectInput> = {
  name: 'SelectInput / Custom Value/Text Fields',
  render: () => (
    <FormWrapper>
      <SelectInput
        source="country"
        label="Country"
        choices={countryChoices}
        optionValue="value"
        optionText="label"
        emptyText="Select a country..."
      />
    </FormWrapper>
  ),
}

export const SelectInputCustomRenderer: StoryObj<typeof SelectInput> = {
  name: 'SelectInput / Custom Text Renderer',
  render: () => (
    <FormWrapper>
      <SelectInput
        source="user"
        label="Assign To"
        choices={userChoices}
        optionText={(choice) =>
          `${choice.firstName as string} ${choice.lastName as string}`
        }
        emptyText="Select a user..."
      />
    </FormWrapper>
  ),
}

export const SelectInputDisabledOptions: StoryObj<typeof SelectInput> = {
  name: 'SelectInput / Disabled Options',
  render: () => (
    <FormWrapper>
      <SelectInput
        source="plan"
        label="Subscription Plan"
        choices={disabledChoices}
        disableValue="disabled"
        helperText="Pro and Enterprise plans are coming soon"
      />
    </FormWrapper>
  ),
}

export const SelectInputRequired: StoryObj<typeof SelectInput> = {
  name: 'SelectInput / Required',
  render: () => (
    <FormWrapper>
      <SelectInput
        source="category"
        label="Category"
        choices={statusChoices}
        required
        emptyText="Select a category..."
      />
    </FormWrapper>
  ),
}

// ============================================================================
// AutocompleteInput Stories
// ============================================================================

const tagChoices = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue' },
  { id: 'angular', name: 'Angular' },
  { id: 'svelte', name: 'Svelte' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'nodejs', name: 'Node.js' },
  { id: 'python', name: 'Python' },
]

export const AutocompleteInputDefault: StoryObj<typeof AutocompleteInput> = {
  name: 'AutocompleteInput / Default',
  render: () => (
    <FormWrapper>
      <AutocompleteInput
        source="technology"
        label="Technology"
        choices={tagChoices}
      />
    </FormWrapper>
  ),
}

export const AutocompleteInputWithFilter: StoryObj<typeof AutocompleteInput> = {
  name: 'AutocompleteInput / Filtering',
  render: () => (
    <FormWrapper>
      <AutocompleteInput
        source="framework"
        label="Framework"
        choices={tagChoices}
        helperText="Type to filter options"
      />
    </FormWrapper>
  ),
}

export const AutocompleteInputWithDebounce: StoryObj<typeof AutocompleteInput> =
  {
    name: 'AutocompleteInput / With Debounce',
    render: () => (
      <FormWrapper>
        <AutocompleteInput
          source="search"
          label="Search (Debounced)"
          choices={tagChoices}
          debounce={300}
          helperText="300ms debounce on filtering"
        />
      </FormWrapper>
    ),
  }

export const AutocompleteInputWithCreate: StoryObj<typeof AutocompleteInput> = {
  name: 'AutocompleteInput / Create New Option',
  render: () => (
    <FormWrapper>
      <AutocompleteInput
        source="customTag"
        label="Tags"
        choices={tagChoices}
        onCreate={async (value) => {
          // Simulate async creation
          await new Promise((resolve) => setTimeout(resolve, 500))
          return { id: value.toLowerCase(), name: value }
        }}
        helperText="Type a new value and press Enter to create"
      />
    </FormWrapper>
  ),
}

export const AutocompleteInputPreselected: StoryObj<typeof AutocompleteInput> =
  {
    name: 'AutocompleteInput / Pre-selected Value',
    render: () => (
      <FormWrapper defaultValues={{ language: 'typescript' }}>
        <AutocompleteInput
          source="language"
          label="Primary Language"
          choices={tagChoices}
        />
      </FormWrapper>
    ),
  }

// ============================================================================
// BooleanInput (Checkbox) Stories
// ============================================================================

export const BooleanInputDefault: StoryObj<typeof BooleanInput> = {
  name: 'BooleanInput / Default',
  render: () => (
    <FormWrapper>
      <BooleanInput source="isActive" label="Active" />
    </FormWrapper>
  ),
}

export const BooleanInputChecked: StoryObj<typeof BooleanInput> = {
  name: 'BooleanInput / Checked State',
  render: () => (
    <FormWrapper defaultValues={{ enabled: true }}>
      <BooleanInput source="enabled" label="Enabled" />
    </FormWrapper>
  ),
}

export const BooleanInputWithHelperText: StoryObj<typeof BooleanInput> = {
  name: 'BooleanInput / With Helper Text',
  render: () => (
    <FormWrapper>
      <BooleanInput
        source="notifications"
        label="Enable Notifications"
        helperText="Receive email notifications for important updates"
      />
    </FormWrapper>
  ),
}

export const BooleanInputDisabled: StoryObj<typeof BooleanInput> = {
  name: 'BooleanInput / Disabled',
  render: () => (
    <FormWrapper defaultValues={{ locked: true }}>
      <div className="space-y-4">
        <BooleanInput source="locked" label="Locked (checked)" disabled />
        <BooleanInput source="unlocked" label="Unlocked (unchecked)" disabled />
      </div>
    </FormWrapper>
  ),
}

export const BooleanInputMultiple: StoryObj<typeof BooleanInput> = {
  name: 'BooleanInput / Multiple Toggles',
  render: () => (
    <FormWrapper
      defaultValues={{
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
      }}
    >
      <div className="space-y-4">
        <BooleanInput source="emailNotifications" label="Email Notifications" />
        <BooleanInput source="smsNotifications" label="SMS Notifications" />
        <BooleanInput source="pushNotifications" label="Push Notifications" />
      </div>
    </FormWrapper>
  ),
}

// ============================================================================
// RadioButtonGroupInput Stories
// ============================================================================

const priorityChoices = [
  { id: 'low', name: 'Low' },
  { id: 'medium', name: 'Medium' },
  { id: 'high', name: 'High' },
  { id: 'urgent', name: 'Urgent' },
]

const sizeChoices = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
]

const shippingChoices = [
  { id: 'standard', name: 'Standard (5-7 days)', disabled: false },
  { id: 'express', name: 'Express (2-3 days)', disabled: false },
  { id: 'overnight', name: 'Overnight (unavailable)', disabled: true },
]

export const RadioButtonGroupDefault: StoryObj<typeof RadioButtonGroupInput> = {
  name: 'RadioButtonGroup / Default',
  render: () => (
    <FormWrapper>
      <RadioButtonGroupInput
        source="priority"
        label="Priority"
        choices={priorityChoices}
      />
    </FormWrapper>
  ),
}

export const RadioButtonGroupHorizontal: StoryObj<
  typeof RadioButtonGroupInput
> = {
  name: 'RadioButtonGroup / Horizontal Layout',
  render: () => (
    <FormWrapper>
      <RadioButtonGroupInput
        source="priority"
        label="Priority"
        choices={priorityChoices}
        row
      />
    </FormWrapper>
  ),
}

export const RadioButtonGroupCustomFields: StoryObj<
  typeof RadioButtonGroupInput
> = {
  name: 'RadioButtonGroup / Custom Fields',
  render: () => (
    <FormWrapper>
      <RadioButtonGroupInput
        source="size"
        label="Size"
        choices={sizeChoices}
        optionValue="value"
        optionText="label"
        row
      />
    </FormWrapper>
  ),
}

export const RadioButtonGroupDisabledOptions: StoryObj<
  typeof RadioButtonGroupInput
> = {
  name: 'RadioButtonGroup / Disabled Options',
  render: () => (
    <FormWrapper>
      <RadioButtonGroupInput
        source="shipping"
        label="Shipping Method"
        choices={shippingChoices}
        disableValue="disabled"
      />
    </FormWrapper>
  ),
}

export const RadioButtonGroupPreselected: StoryObj<
  typeof RadioButtonGroupInput
> = {
  name: 'RadioButtonGroup / Pre-selected',
  render: () => (
    <FormWrapper defaultValues={{ priority: 'medium' }}>
      <RadioButtonGroupInput
        source="priority"
        label="Priority"
        choices={priorityChoices}
        helperText="Medium priority is selected by default"
      />
    </FormWrapper>
  ),
}

export const RadioButtonGroupRequired: StoryObj<typeof RadioButtonGroupInput> =
  {
    name: 'RadioButtonGroup / Required',
    render: () => (
      <FormWrapper>
        <RadioButtonGroupInput
          source="paymentMethod"
          label="Payment Method"
          choices={[
            { id: 'card', name: 'Credit Card' },
            { id: 'paypal', name: 'PayPal' },
            { id: 'bank', name: 'Bank Transfer' },
          ]}
          required
        />
      </FormWrapper>
    ),
  }

// ============================================================================
// CheckboxGroupInput Stories
// ============================================================================

const permissionChoices = [
  { id: 'read', name: 'Read' },
  { id: 'write', name: 'Write' },
  { id: 'delete', name: 'Delete' },
  { id: 'admin', name: 'Admin' },
]

const featureChoices = [
  { value: 'dark_mode', label: 'Dark Mode' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'api_access', label: 'API Access' },
]

const interestChoices = [
  { id: 'tech', name: 'Technology', disabled: false },
  { id: 'sports', name: 'Sports', disabled: false },
  { id: 'music', name: 'Music', disabled: false },
  { id: 'premium', name: 'Premium Content (coming soon)', disabled: true },
]

export const CheckboxGroupDefault: StoryObj<typeof CheckboxGroupInput> = {
  name: 'CheckboxGroup / Default',
  render: () => (
    <FormWrapper>
      <CheckboxGroupInput
        source="permissions"
        label="Permissions"
        choices={permissionChoices}
      />
    </FormWrapper>
  ),
}

export const CheckboxGroupHorizontal: StoryObj<typeof CheckboxGroupInput> = {
  name: 'CheckboxGroup / Horizontal Layout',
  render: () => (
    <FormWrapper>
      <CheckboxGroupInput
        source="permissions"
        label="Permissions"
        choices={permissionChoices}
        row
      />
    </FormWrapper>
  ),
}

export const CheckboxGroupCustomFields: StoryObj<typeof CheckboxGroupInput> = {
  name: 'CheckboxGroup / Custom Fields',
  render: () => (
    <FormWrapper>
      <CheckboxGroupInput
        source="features"
        label="Enable Features"
        choices={featureChoices}
        optionValue="value"
        optionText="label"
      />
    </FormWrapper>
  ),
}

export const CheckboxGroupDisabledOptions: StoryObj<typeof CheckboxGroupInput> =
  {
    name: 'CheckboxGroup / Disabled Options',
    render: () => (
      <FormWrapper>
        <CheckboxGroupInput
          source="interests"
          label="Interests"
          choices={interestChoices}
          disableValue="disabled"
        />
      </FormWrapper>
    ),
  }

export const CheckboxGroupPreselected: StoryObj<typeof CheckboxGroupInput> = {
  name: 'CheckboxGroup / Pre-selected Values',
  render: () => (
    <FormWrapper defaultValues={{ permissions: ['read', 'write'] }}>
      <CheckboxGroupInput
        source="permissions"
        label="Permissions"
        choices={permissionChoices}
        helperText="Read and Write are selected by default"
      />
    </FormWrapper>
  ),
}

export const CheckboxGroupWithValidation: StoryObj<typeof CheckboxGroupInput> =
  {
    name: 'CheckboxGroup / With Validation',
    render: () => (
      <FormWrapper>
        <CheckboxGroupInput
          source="agreements"
          label="Accept Agreements"
          choices={[
            { id: 'terms', name: 'Terms of Service' },
            { id: 'privacy', name: 'Privacy Policy' },
            { id: 'marketing', name: 'Marketing Communications (optional)' },
          ]}
          rules={{
            validate: (value: string[]) =>
              (value?.length >= 2 &&
                value.includes('terms') &&
                value.includes('privacy')) ||
              'You must accept Terms of Service and Privacy Policy',
          }}
        />
      </FormWrapper>
    ),
  }

// ============================================================================
// Complete Form Example
// ============================================================================

export const CompleteFormExample: StoryObj = {
  name: 'Complete Form Example',
  render: () => (
    <FormWrapper
      defaultValues={{
        firstName: '',
        lastName: '',
        email: '',
        age: undefined,
        password: '',
        status: 'active',
        country: '',
        technology: '',
        isSubscribed: false,
        priority: 'medium',
        permissions: ['read'],
      }}
    >
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">User Registration Form</h2>

        <div className="grid grid-cols-2 gap-4">
          <TextInput source="firstName" label="First Name" required />
          <TextInput source="lastName" label="Last Name" required />
        </div>

        <TextInput
          source="email"
          label="Email"
          placeholder="you@example.com"
          required
          rules={{
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
          }}
        />

        <NumberInput source="age" label="Age" min={18} max={120} />

        <PasswordInput
          source="password"
          label="Password"
          required
          rules={{
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          }}
        />

        <SelectInput
          source="status"
          label="Account Status"
          choices={statusChoices}
        />

        <SelectInput
          source="country"
          label="Country"
          choices={countryChoices}
          optionValue="value"
          optionText="label"
          emptyText="Select your country..."
        />

        <AutocompleteInput
          source="technology"
          label="Primary Technology"
          choices={tagChoices}
        />

        <BooleanInput
          source="isSubscribed"
          label="Subscribe to Newsletter"
          helperText="Receive weekly updates about new features"
        />

        <RadioButtonGroupInput
          source="priority"
          label="Communication Preference"
          choices={[
            { id: 'email', name: 'Email' },
            { id: 'sms', name: 'SMS' },
            { id: 'phone', name: 'Phone' },
          ]}
          row
        />

        <CheckboxGroupInput
          source="permissions"
          label="Access Permissions"
          choices={permissionChoices}
        />
      </div>
    </FormWrapper>
  ),
}
