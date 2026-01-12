import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { RichTextInput } from './RichTextInput'

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
      <form className="w-full max-w-2xl space-y-6">{children}</form>
    </FormContextProvider>
  )
}

const meta: Meta<typeof RichTextInput> = {
  title: 'Components/Inputs/RichTextInput',
  component: RichTextInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A rich text editor input component with a formatting toolbar. Uses contentEditable with document.execCommand for basic formatting support.',
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
      description: 'Label text displayed above the editor',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the editor',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the editor',
    },
    required: {
      control: 'boolean',
      description: 'Makes the field required',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the editor takes full width',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic rich text input with label
 */
export const Default: Story = {
  args: {
    source: 'content',
    label: 'Content',
  },
}

/**
 * Rich text input with helper text
 */
export const WithHelperText: Story = {
  args: {
    source: 'description',
    label: 'Description',
    helperText: 'Use the toolbar to format your text',
  },
}

/**
 * Required rich text input
 */
export const Required: Story = {
  args: {
    source: 'body',
    label: 'Article Body',
    required: true,
    helperText: 'This field is required',
  },
}

/**
 * Rich text input with validation rules
 */
export const WithValidation: Story = {
  args: {
    source: 'article',
    label: 'Article',
    rules: {
      required: 'Content is required',
      minLength: {
        value: 50,
        message: 'Content must be at least 50 characters',
      },
    },
    helperText: 'Minimum 50 characters required',
  },
}

/**
 * Rich text input with pre-filled content
 */
export const WithDefaultContent: Story = {
  args: {
    source: 'prefilledContent',
    label: 'Pre-filled Content',
  },
  decorators: [
    (Story) => (
      <FormWrapper
        defaultValues={{
          prefilledContent:
            '<h1>Welcome to the Editor</h1><p>This is a <strong>pre-filled</strong> rich text content with some <em>formatted</em> text.</p><ul><li>List item 1</li><li>List item 2</li></ul>',
        }}
      >
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Disabled rich text input
 */
export const Disabled: Story = {
  args: {
    source: 'disabledContent',
    label: 'Disabled Content',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <FormWrapper
        defaultValues={{
          disabledContent:
            '<p>This content cannot be edited because the editor is disabled.</p>',
        }}
      >
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Full width rich text input
 */
export const FullWidth: Story = {
  args: {
    source: 'wideContent',
    label: 'Full Width Content',
    fullWidth: true,
  },
}

/**
 * Rich text input without label
 */
export const NoLabel: Story = {
  args: {
    source: 'unlabeledContent',
    label: false,
    helperText: 'Editor without a visible label',
  },
}

/**
 * Rich text input for blog post
 */
export const BlogPost: Story = {
  args: {
    source: 'blogContent',
    label: 'Blog Post Content',
    helperText: 'Write your blog post here. Use headings, lists, and formatting to structure your content.',
  },
  decorators: [
    (Story) => (
      <FormWrapper
        defaultValues={{
          blogContent:
            '<h1>Getting Started with React</h1><p>React is a popular JavaScript library for building user interfaces.</p><h2>Key Features</h2><ul><li>Component-based architecture</li><li>Virtual DOM for performance</li><li>Large ecosystem of tools</li></ul><p>In this tutorial, we will explore the basics of React development.</p>',
        }}
      >
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Rich text input for product description
 */
export const ProductDescription: Story = {
  args: {
    source: 'productDescription',
    label: 'Product Description',
    helperText: 'Describe your product features and benefits',
  },
}

/**
 * Rich text input for email template
 */
export const EmailTemplate: Story = {
  args: {
    source: 'emailBody',
    label: 'Email Body',
  },
  decorators: [
    (Story) => (
      <FormWrapper
        defaultValues={{
          emailBody:
            '<p>Dear Customer,</p><p>Thank you for your recent purchase. We hope you are enjoying your new product.</p><p>If you have any questions, please do not hesitate to contact our support team.</p><p>Best regards,<br><strong>The Support Team</strong></p>',
        }}
      >
        <Story />
      </FormWrapper>
    ),
  ],
}

/**
 * Multiple rich text editors in a form
 */
export const MultipleEditors: Story = {
  render: () => (
    <FormWrapper>
      <div className="space-y-6">
        <RichTextInput
          source="introduction"
          label="Introduction"
          helperText="Brief introduction paragraph"
        />
        <RichTextInput
          source="mainContent"
          label="Main Content"
          helperText="The main body of your document"
        />
        <RichTextInput
          source="conclusion"
          label="Conclusion"
          helperText="Closing remarks"
        />
      </div>
    </FormWrapper>
  ),
}

/**
 * Rich text input with formatted list examples
 */
export const WithListExamples: Story = {
  args: {
    source: 'listContent',
    label: 'Content with Lists',
  },
  decorators: [
    (Story) => (
      <FormWrapper
        defaultValues={{
          listContent:
            '<h2>Ordered List Example</h2><ol><li>First step</li><li>Second step</li><li>Third step</li></ol><h2>Unordered List Example</h2><ul><li>Item A</li><li>Item B</li><li>Item C</li></ul>',
        }}
      >
        <Story />
      </FormWrapper>
    ),
  ],
}
