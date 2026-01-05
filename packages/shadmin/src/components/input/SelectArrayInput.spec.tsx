/**
 * SelectArrayInput Component Tests
 * Following TDD: RED phase - write failing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { SelectArrayInput } from './SelectArrayInput'

// Helper component to wrap SelectArrayInput with form context
interface TestFormProps {
  children: React.ReactNode
  defaultValues?: Record<string, unknown>
  onSubmit?: (data: Record<string, unknown>) => void
}

function TestForm({ children, defaultValues = {}, onSubmit = vi.fn() }: TestFormProps) {
  const form = useForm({ defaultValues })
  return (
    <FormContextProvider {...form} save={onSubmit}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
        <button type="submit">Submit</button>
      </form>
    </FormContextProvider>
  )
}

const defaultChoices = [
  { id: 'tech', name: 'Technology' },
  { id: 'news', name: 'News' },
  { id: 'sports', name: 'Sports' },
  { id: 'music', name: 'Music' },
]

describe('<SelectArrayInput />', () => {
  it('renders with source as name attribute', () => {
    render(
      <TestForm>
        <SelectArrayInput source="tags" choices={defaultChoices} />
      </TestForm>
    )

    // Should render a listbox for multi-select
    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(
      <TestForm>
        <SelectArrayInput source="tags" label="Tags" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByText('Tags')).toBeInTheDocument()
  })

  it('uses source as label when label not provided', () => {
    render(
      <TestForm>
        <SelectArrayInput source="tags" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByText('tags')).toBeInTheDocument()
  })

  it('hides label when label is false', () => {
    render(
      <TestForm>
        <SelectArrayInput source="tags" label={false} choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.queryByText('tags')).not.toBeInTheDocument()
  })

  it('renders all choices as options', () => {
    render(
      <TestForm>
        <SelectArrayInput source="tags" choices={defaultChoices} />
      </TestForm>
    )

    expect(screen.getByRole('option', { name: 'Technology' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'News' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Sports' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Music' })).toBeInTheDocument()
  })

  it('supports custom optionValue and optionText props', () => {
    const customChoices = [
      { value: 'js', label: 'JavaScript' },
      { value: 'ts', label: 'TypeScript' },
    ]

    render(
      <TestForm>
        <SelectArrayInput
          source="languages"
          choices={customChoices}
          optionValue="value"
          optionText="label"
        />
      </TestForm>
    )

    expect(screen.getByRole('option', { name: 'JavaScript' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'TypeScript' })).toBeInTheDocument()
  })

  it('integrates with react-hook-form and stores array of selected values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <SelectArrayInput source="tags" label="Tags" choices={defaultChoices} />
      </TestForm>
    )

    // Select multiple options
    const techOption = screen.getByRole('option', { name: 'Technology' })
    const newsOption = screen.getByRole('option', { name: 'News' })

    await user.click(techOption)
    await user.click(newsOption)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ tags: expect.arrayContaining(['tech', 'news']) }),
        expect.anything()
      )
    })
  })

  it('handles defaultValue array from form context', () => {
    render(
      <TestForm defaultValues={{ tags: ['tech', 'sports'] }}>
        <SelectArrayInput source="tags" label="Tags" choices={defaultChoices} />
      </TestForm>
    )

    const techOption = screen.getByRole('option', { name: 'Technology' })
    const sportsOption = screen.getByRole('option', { name: 'Sports' })
    const newsOption = screen.getByRole('option', { name: 'News' })

    expect(techOption).toHaveAttribute('aria-selected', 'true')
    expect(sportsOption).toHaveAttribute('aria-selected', 'true')
    expect(newsOption).toHaveAttribute('aria-selected', 'false')
  })

  it('allows adding selections', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm defaultValues={{ tags: ['tech'] }} onSubmit={onSubmit}>
        <SelectArrayInput source="tags" label="Tags" choices={defaultChoices} />
      </TestForm>
    )

    // Add another selection
    const musicOption = screen.getByRole('option', { name: 'Music' })
    await user.click(musicOption)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ tags: expect.arrayContaining(['tech', 'music']) }),
        expect.anything()
      )
    })
  })

  it('allows removing selections', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm defaultValues={{ tags: ['tech', 'news'] }} onSubmit={onSubmit}>
        <SelectArrayInput source="tags" label="Tags" choices={defaultChoices} />
      </TestForm>
    )

    // Remove a selection by clicking it again
    const techOption = screen.getByRole('option', { name: 'Technology' })
    await user.click(techOption)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ tags: ['news'] }),
        expect.anything()
      )
    })
  })

  it('supports disabled prop', () => {
    render(
      <TestForm>
        <SelectArrayInput source="tags" choices={defaultChoices} disabled />
      </TestForm>
    )

    const listbox = screen.getByRole('listbox')
    expect(listbox).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not allow selection when disabled', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm onSubmit={onSubmit}>
        <SelectArrayInput source="tags" choices={defaultChoices} disabled />
      </TestForm>
    )

    const techOption = screen.getByRole('option', { name: 'Technology' })
    await user.click(techOption)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.not.objectContaining({ tags: expect.arrayContaining(['tech']) }),
        expect.anything()
      )
    })
  })

  it('supports required prop', () => {
    render(
      <TestForm>
        <SelectArrayInput source="tags" label="Tags" choices={defaultChoices} required />
      </TestForm>
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('displays validation errors', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { tags: [] },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <SelectArrayInput
              source="tags"
              label="Tags"
              choices={defaultChoices}
              rules={{
                validate: (value: string[]) =>
                  (value && value.length > 0) || 'At least one tag is required'
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('At least one tag is required')).toBeInTheDocument()
    })
  })

  it('supports minimum selection validation', async () => {
    const user = userEvent.setup()

    function FormWithMinValidation() {
      const form = useForm({
        defaultValues: { tags: ['tech'] },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <SelectArrayInput
              source="tags"
              label="Tags"
              choices={defaultChoices}
              rules={{
                validate: (value: string[]) =>
                  (value && value.length >= 2) || 'Select at least 2 tags'
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithMinValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Select at least 2 tags')).toBeInTheDocument()
    })
  })

  it('supports helperText prop', () => {
    render(
      <TestForm>
        <SelectArrayInput
          source="tags"
          choices={defaultChoices}
          helperText="Select one or more tags"
        />
      </TestForm>
    )

    expect(screen.getByText('Select one or more tags')).toBeInTheDocument()
  })

  it('supports fullWidth prop', () => {
    render(
      <TestForm>
        <SelectArrayInput source="tags" choices={defaultChoices} fullWidth />
      </TestForm>
    )

    const container = screen.getByRole('listbox').closest('.space-y-2')
    expect(container).toHaveClass('w-full')
  })

  it('supports className prop for custom styling', () => {
    render(
      <TestForm>
        <SelectArrayInput source="tags" choices={defaultChoices} className="custom-class" />
      </TestForm>
    )

    const listbox = screen.getByRole('listbox')
    expect(listbox).toHaveClass('custom-class')
  })

  it('supports optionText as function for custom rendering', () => {
    const choices = [
      { id: 'us', code: 'US', name: 'United States' },
      { id: 'uk', code: 'UK', name: 'United Kingdom' },
    ]

    render(
      <TestForm>
        <SelectArrayInput
          source="countries"
          choices={choices}
          optionText={(choice: { code: string; name: string }) => `${choice.code} - ${choice.name}`}
        />
      </TestForm>
    )

    expect(screen.getByRole('option', { name: 'US - United States' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'UK - United Kingdom' })).toBeInTheDocument()
  })

  it('handles empty choices array', () => {
    render(
      <TestForm>
        <SelectArrayInput source="tags" choices={[]} />
      </TestForm>
    )

    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('shows visual indicator for selected items', async () => {
    const user = userEvent.setup()

    render(
      <TestForm defaultValues={{ tags: ['tech'] }}>
        <SelectArrayInput source="tags" label="Tags" choices={defaultChoices} />
      </TestForm>
    )

    const techOption = screen.getByRole('option', { name: 'Technology' })
    expect(techOption).toHaveAttribute('aria-selected', 'true')

    // Visual indicator (checkmark) should be present
    expect(within(techOption).getByRole('img', { hidden: true })).toBeInTheDocument()
  })
})
