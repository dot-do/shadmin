/**
 * TabbedForm Component Test Suite
 *
 * This comprehensive test suite validates the TabbedForm component which provides
 * multi-tabbed form organization with validation error tracking per tab.
 *
 * KEY CONCEPTS TESTED:
 * 1. Basic Rendering - FormTab children, tab list/triggers, first tab active by default
 * 2. Tab Navigation - Click to switch, keyboard navigation (arrow keys), defaultTab prop
 * 3. react-hook-form Integration - All inputs registered across all tabs, values preserved on switch
 * 4. Validation Across Tabs - Errors displayed on correct tab, navigation to first error tab
 * 5. Tab Error Indicators - data-has-error attribute, error count badges, indicator clearing
 * 6. Dirty State Tracking Per Tab - data-dirty attribute, getDirtyTabs() context method
 * 7. URL Sync for Active Tab - syncWithLocation prop, tab path in URL, restoration on mount
 * 8. TabbedForm Context - activeTab, setActiveTab(), tabs array via useTabbedFormContext
 * 9. FormTab Component - Children rendering, name/label props, icon/disabled/className support
 * 10. Accessibility - ARIA tablist, tab, tabpanel roles, aria-selected, aria-controls
 *
 * WHY THESE TESTS MATTER:
 * - TabbedForm enables complex forms to be organized into logical sections
 * - ALL form inputs must register even when their tab is not visible (for submission)
 * - Validation errors must guide users to the tab containing the invalid field
 * - Error/dirty indicators on tabs provide at-a-glance feedback
 * - URL sync allows deep linking to specific tabs and browser back/forward support
 * - Proper accessibility ensures screen reader navigation works correctly
 *
 * TEST SETUP:
 * - TestFormWrapper provides useForm + FormContextProvider + TestMemoryRouter
 * - renderTabbedForm helper simplifies common setup patterns
 * - userEvent handles tab clicks and keyboard navigation
 * - waitFor manages async validation state changes
 * - TestMemoryRouter enables URL sync testing with controlled history
 *
 * EDGE CASES COVERED:
 * - Values preserved when switching between tabs multiple times
 * - Multiple validation errors across different tabs
 * - First tab with error activated on submission from later tab
 * - Error count badge for tabs with multiple invalid fields
 * - Dirty state tracking with getDirtyTabs() returning correct tab names
 * - URL path sync with custom path prop on FormTab
 * - Tab name generation from label when name prop not provided
 * - Disabled tabs not selectable
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormContextProvider } from '../../contexts/FormContext'
import { useLocation } from 'react-router'
import { TestMemoryRouter } from '../../test-utils/TestMemoryRouter'
import { TabbedForm, useTabbedFormContext, type TabbedFormContextValue } from './TabbedForm'
import { FormTab } from './FormTab'
import { TextInput } from '../input/TextInput'

// Helper component to wrap TabbedForm with form context
interface TestFormWrapperProps {
  children: React.ReactNode
  defaultValues?: Record<string, unknown>
  onSubmit?: (data: Record<string, unknown>) => void
}

function TestFormWrapper({
  children,
  defaultValues = {},
  onSubmit = vi.fn(),
}: TestFormWrapperProps) {
  const form = useForm({ defaultValues, mode: 'onSubmit' })
  return (
    <TestMemoryRouter>
      <FormContextProvider {...form} save={onSubmit}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {children}
          <button type="submit">Submit</button>
        </form>
      </FormContextProvider>
    </TestMemoryRouter>
  )
}

describe('<TabbedForm />', () => {
  describe('Basic Rendering', () => {
    it('renders with FormTab children', () => {
      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="General">
              <TextInput source="name" label="Name" />
            </FormTab>
            <FormTab label="Details">
              <TextInput source="description" label="Description" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      // Should render tabs list with tab triggers
      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'General' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument()
    })

    it('renders first tab content by default', () => {
      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="General">
              <TextInput source="name" label="Name" />
            </FormTab>
            <FormTab label="Details">
              <TextInput source="description" label="Description" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      // First tab content should be visible
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      // Second tab content should not be visible (though may be in DOM for form registration)
    })

    it('accepts className prop for custom styling', () => {
      render(
        <TestFormWrapper>
          <TabbedForm className="custom-form-class">
            <FormTab label="Tab 1">
              <TextInput source="field1" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      const tabsContainer = screen.getByRole('tablist').closest('[data-slot="tabbed-form"]')
      expect(tabsContainer).toHaveClass('custom-form-class')
    })

    it('renders without children gracefully', () => {
      render(
        <TestFormWrapper>
          <TabbedForm />
        </TestFormWrapper>
      )

      // Should render tabs container even without children
      expect(screen.queryByRole('tablist')).toBeInTheDocument()
    })
  })

  describe('Tab Navigation', () => {
    it('switches tab content when clicking a tab trigger', async () => {
      const user = userEvent.setup()

      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="General">
              <TextInput source="name" label="Name" />
            </FormTab>
            <FormTab label="Details">
              <TextInput source="description" label="Description" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      // Initially first tab is active
      expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute(
        'aria-selected',
        'true'
      )

      // Click second tab
      await user.click(screen.getByRole('tab', { name: 'Details' }))

      // Second tab should now be active
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
      expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute(
        'aria-selected',
        'false'
      )
    })

    it('supports keyboard navigation between tabs', async () => {
      const user = userEvent.setup()

      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="Tab 1">
              <TextInput source="field1" />
            </FormTab>
            <FormTab label="Tab 2">
              <TextInput source="field2" />
            </FormTab>
            <FormTab label="Tab 3">
              <TextInput source="field3" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      // Focus first tab
      const firstTab = screen.getByRole('tab', { name: 'Tab 1' })
      firstTab.focus()

      // Press right arrow to move to next tab
      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus()

      // Press right arrow again
      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveFocus()
    })

    it('supports defaultTab prop to set initial active tab', () => {
      render(
        <TestFormWrapper>
          <TabbedForm defaultTab="details">
            <FormTab label="General" name="general">
              <TextInput source="name" label="Name" />
            </FormTab>
            <FormTab label="Details" name="details">
              <TextInput source="description" label="Description" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
    })

    it('calls onTabChange callback when tab changes', async () => {
      const user = userEvent.setup()
      const onTabChange = vi.fn()

      render(
        <TestFormWrapper>
          <TabbedForm onTabChange={onTabChange}>
            <FormTab label="General" name="general">
              <TextInput source="name" />
            </FormTab>
            <FormTab label="Details" name="details">
              <TextInput source="description" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      await user.click(screen.getByRole('tab', { name: 'Details' }))

      expect(onTabChange).toHaveBeenCalledWith('details')
    })
  })

  describe('react-hook-form Integration', () => {
    it('registers all form inputs across all tabs', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <TestFormWrapper onSubmit={onSubmit}>
          <TabbedForm>
            <FormTab label="General">
              <TextInput source="name" label="Name" />
            </FormTab>
            <FormTab label="Details">
              <TextInput source="description" label="Description" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      // Fill in first tab
      await user.type(screen.getByLabelText('Name'), 'John Doe')

      // Switch to second tab
      await user.click(screen.getByRole('tab', { name: 'Details' }))

      // Fill in second tab
      await user.type(screen.getByLabelText('Description'), 'Test description')

      // Submit the form
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // All values from all tabs should be submitted
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Doe',
            description: 'Test description',
          }),
          expect.anything()
        )
      })
    })

    it('preserves form values when switching between tabs', async () => {
      const user = userEvent.setup()

      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="General">
              <TextInput source="name" label="Name" />
            </FormTab>
            <FormTab label="Details">
              <TextInput source="description" label="Description" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      // Fill in first tab
      const nameInput = screen.getByLabelText('Name')
      await user.type(nameInput, 'Preserved Value')

      // Switch to second tab
      await user.click(screen.getByRole('tab', { name: 'Details' }))

      // Switch back to first tab
      await user.click(screen.getByRole('tab', { name: 'General' }))

      // Value should be preserved
      expect(screen.getByLabelText('Name')).toHaveValue('Preserved Value')
    })

    it('handles defaultValues from form context', () => {
      render(
        <TestFormWrapper defaultValues={{ name: 'Default Name', description: 'Default Desc' }}>
          <TabbedForm>
            <FormTab label="General">
              <TextInput source="name" label="Name" />
            </FormTab>
            <FormTab label="Details">
              <TextInput source="description" label="Description" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      expect(screen.getByLabelText('Name')).toHaveValue('Default Name')
    })
  })

  describe('Validation Across Tabs', () => {
    it('displays validation errors on the correct tab', async () => {
      const user = userEvent.setup()

      function FormWithValidation() {
        const form = useForm({
          defaultValues: { name: '', email: '' },
          mode: 'onSubmit',
        })

        return (
          <TestMemoryRouter>
            <FormContextProvider {...form}>
              <form onSubmit={form.handleSubmit(() => {})} noValidate>
                <TabbedForm>
                  <FormTab label="General" name="general">
                    <TextInput
                      source="name"
                      label="Name"
                      rules={{ required: 'Name is required' }}
                    />
                  </FormTab>
                  <FormTab label="Contact" name="contact">
                    <TextInput
                      source="email"
                      label="Email"
                      rules={{ required: 'Email is required' }}
                    />
                  </FormTab>
                </TabbedForm>
                <button type="submit">Submit</button>
              </form>
            </FormContextProvider>
          </TestMemoryRouter>
        )
      }

      render(<FormWithValidation />)

      // Submit without filling any fields
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // Should show error on first tab
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
      })
    })

    it('navigates to first tab with errors on submit', async () => {
      const user = userEvent.setup()

      function FormWithValidation() {
        const form = useForm({
          defaultValues: { name: '', description: '' },
          mode: 'onSubmit',
        })

        return (
          <TestMemoryRouter>
            <FormContextProvider {...form}>
              <form onSubmit={form.handleSubmit(() => {})} noValidate>
                <TabbedForm>
                  <FormTab label="General" name="general">
                    <TextInput
                      source="name"
                      label="Name"
                      rules={{ required: 'Name is required' }}
                    />
                  </FormTab>
                  <FormTab label="Details" name="details">
                    <TextInput source="description" label="Description" />
                  </FormTab>
                </TabbedForm>
                <button type="submit">Submit</button>
              </form>
            </FormContextProvider>
          </TestMemoryRouter>
        )
      }

      render(<FormWithValidation />)

      // Navigate to second tab first
      await user.click(screen.getByRole('tab', { name: 'Details' }))

      // Submit with error in first tab
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // Should navigate back to first tab and show error
      await waitFor(() => {
        // Use regex to match tab name that may include error badge content
        expect(screen.getByRole('tab', { name: /General/ })).toHaveAttribute(
          'aria-selected',
          'true'
        )
      })
    })
  })

  describe('Tab Error Indicators', () => {
    it('shows error indicator on tabs with validation errors', async () => {
      const user = userEvent.setup()

      function FormWithValidation() {
        const form = useForm({
          defaultValues: { name: '', email: '' },
          mode: 'onSubmit',
        })

        return (
          <TestMemoryRouter>
            <FormContextProvider {...form}>
              <form onSubmit={form.handleSubmit(() => {})} noValidate>
                <TabbedForm>
                  <FormTab label="General" name="general">
                    <TextInput
                      source="name"
                      label="Name"
                      rules={{ required: 'Name is required' }}
                    />
                  </FormTab>
                  <FormTab label="Contact" name="contact">
                    <TextInput
                      source="email"
                      label="Email"
                      rules={{ required: 'Email is required' }}
                    />
                  </FormTab>
                </TabbedForm>
                <button type="submit">Submit</button>
              </form>
            </FormContextProvider>
          </TestMemoryRouter>
        )
      }

      render(<FormWithValidation />)

      // Submit without filling any fields
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // Both tabs should show error indicators (use regex to match tabs with error badges)
      await waitFor(() => {
        const generalTab = screen.getByRole('tab', { name: /General/ })
        const contactTab = screen.getByRole('tab', { name: /Contact/ })

        // Error indicator can be an icon, badge, or aria attribute
        expect(generalTab).toHaveAttribute('data-has-error', 'true')
        expect(contactTab).toHaveAttribute('data-has-error', 'true')
      })
    })

    it('clears error indicator when errors are resolved', async () => {
      const user = userEvent.setup()

      function FormWithValidation() {
        const form = useForm({
          defaultValues: { name: '' },
          mode: 'onSubmit',
        })

        return (
          <TestMemoryRouter>
            <FormContextProvider {...form}>
              <form onSubmit={form.handleSubmit(() => {})} noValidate>
                <TabbedForm>
                  <FormTab label="General" name="general">
                    <TextInput
                      source="name"
                      label="Name"
                      rules={{ required: 'Name is required' }}
                    />
                  </FormTab>
                </TabbedForm>
                <button type="submit">Submit</button>
              </form>
            </FormContextProvider>
          </TestMemoryRouter>
        )
      }

      render(<FormWithValidation />)

      // Submit to trigger validation error
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /General/ })).toHaveAttribute(
          'data-has-error',
          'true'
        )
      })

      // Fill in the required field
      await user.type(screen.getByLabelText('Name'), 'John')

      // Submit again
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // Error indicator should be cleared
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /General/ })).not.toHaveAttribute(
          'data-has-error',
          'true'
        )
      })
    })

    it('shows error count badge on tabs with multiple errors', async () => {
      const user = userEvent.setup()

      function FormWithMultipleFields() {
        const form = useForm({
          defaultValues: { firstName: '', lastName: '', email: '' },
          mode: 'onSubmit',
        })

        return (
          <TestMemoryRouter>
            <FormContextProvider {...form}>
              <form onSubmit={form.handleSubmit(() => {})} noValidate>
                <TabbedForm>
                  <FormTab label="Personal" name="personal">
                    <TextInput
                      source="firstName"
                      label="First Name"
                      rules={{ required: 'First name is required' }}
                    />
                    <TextInput
                      source="lastName"
                      label="Last Name"
                      rules={{ required: 'Last name is required' }}
                    />
                  </FormTab>
                  <FormTab label="Contact" name="contact">
                    <TextInput source="email" label="Email" />
                  </FormTab>
                </TabbedForm>
                <button type="submit">Submit</button>
              </form>
            </FormContextProvider>
          </TestMemoryRouter>
        )
      }

      render(<FormWithMultipleFields />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        const personalTab = screen.getByRole('tab', { name: /Personal/ })
        // Check for error count indicator (e.g., badge or data attribute)
        expect(personalTab).toHaveAttribute('data-error-count', '2')
      })
    })
  })

  describe('Dirty State Tracking Per Tab', () => {
    it('tracks dirty state per tab', async () => {
      const user = userEvent.setup()

      function FormWithDirtyTracking() {
        const form = useForm({
          defaultValues: { name: '', description: '' },
        })

        return (
          <TestMemoryRouter>
            <FormContextProvider {...form}>
              <TabbedForm>
                <FormTab label="General" name="general">
                  <TextInput source="name" label="Name" />
                </FormTab>
                <FormTab label="Details" name="details">
                  <TextInput source="description" label="Description" />
                </FormTab>
              </TabbedForm>
            </FormContextProvider>
          </TestMemoryRouter>
        )
      }

      render(<FormWithDirtyTracking />)

      // Initially no tab is dirty
      expect(screen.getByRole('tab', { name: 'General' })).not.toHaveAttribute(
        'data-dirty',
        'true'
      )

      // Modify field in first tab
      await user.type(screen.getByLabelText('Name'), 'Modified')

      // First tab should now be dirty
      expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute(
        'data-dirty',
        'true'
      )

      // Second tab should not be dirty
      expect(screen.getByRole('tab', { name: 'Details' })).not.toHaveAttribute(
        'data-dirty',
        'true'
      )
    })

    it('provides dirty fields info through context', async () => {
      const user = userEvent.setup()
      let contextValue: TabbedFormContextValue | undefined

      function ContextConsumer() {
        contextValue = useTabbedFormContext()
        return null
      }

      function FormWithContext() {
        const form = useForm({
          defaultValues: { name: '', description: '' },
        })

        return (
          <TestMemoryRouter>
            <FormContextProvider {...form}>
              <TabbedForm>
                <FormTab label="General" name="general">
                  <TextInput source="name" label="Name" />
                  <ContextConsumer />
                </FormTab>
                <FormTab label="Details" name="details">
                  <TextInput source="description" label="Description" />
                </FormTab>
              </TabbedForm>
            </FormContextProvider>
          </TestMemoryRouter>
        )
      }

      render(<FormWithContext />)

      await user.type(screen.getByLabelText('Name'), 'Test')

      await waitFor(() => {
        expect(contextValue?.getDirtyTabs()).toContain('general')
        expect(contextValue?.getDirtyTabs()).not.toContain('details')
      })
    })
  })

  describe('URL Sync for Active Tab', () => {
    it('syncs active tab to URL when syncWithLocation is true', async () => {
      const user = userEvent.setup()
      let currentLocation: { pathname: string } | undefined

      function LocationReader() {
        // Use react-router's useLocation since TabbedForm uses react-router's navigate
        const location = useLocation()
        currentLocation = location
        return null
      }

      function FormWithUrlSync() {
        const form = useForm({ defaultValues: {} })

        return (
          <TestMemoryRouter initialEntries={['/users/1']}>
            <FormContextProvider {...form}>
              <TabbedForm syncWithLocation>
                <FormTab label="General" name="general">
                  <TextInput source="name" />
                </FormTab>
                <FormTab label="Details" name="details" path="details">
                  <TextInput source="description" />
                </FormTab>
              </TabbedForm>
              <LocationReader />
            </FormContextProvider>
          </TestMemoryRouter>
        )
      }

      render(<FormWithUrlSync />)

      await user.click(screen.getByRole('tab', { name: 'Details' }))

      await waitFor(() => {
        // URL should be updated to include tab path segment
        expect(currentLocation?.pathname).toBe('/users/1/details')
      })
    })

    it('restores active tab from URL on mount', () => {
      function FormWithUrlSync() {
        const form = useForm({ defaultValues: {} })

        return (
          // Start at edit route with 'details' tab path
          <TestMemoryRouter initialEntries={['/users/1/details']}>
            <FormContextProvider {...form}>
              <TabbedForm syncWithLocation>
                <FormTab label="General" name="general">
                  <TextInput source="name" />
                </FormTab>
                <FormTab label="Details" name="details" path="details">
                  <TextInput source="description" />
                </FormTab>
              </TabbedForm>
            </FormContextProvider>
          </TestMemoryRouter>
        )
      }

      render(<FormWithUrlSync />)

      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
    })

    it('uses custom tab path when provided', async () => {
      const user = userEvent.setup()
      let currentLocation: { pathname: string } | undefined

      function LocationReader() {
        // Use react-router's useLocation since TabbedForm uses react-router's navigate
        const location = useLocation()
        currentLocation = location
        return null
      }

      function FormWithCustomPath() {
        const form = useForm({ defaultValues: {} })

        return (
          <TestMemoryRouter initialEntries={['/users/1']}>
            <FormContextProvider {...form}>
              <TabbedForm syncWithLocation>
                <FormTab label="General" name="general">
                  <TextInput source="name" />
                </FormTab>
                <FormTab label="Details" name="details" path="security">
                  <TextInput source="description" />
                </FormTab>
              </TabbedForm>
              <LocationReader />
            </FormContextProvider>
          </TestMemoryRouter>
        )
      }

      render(<FormWithCustomPath />)

      await user.click(screen.getByRole('tab', { name: 'Details' }))

      await waitFor(() => {
        // URL should use the custom 'security' path instead of 'details'
        expect(currentLocation?.pathname).toBe('/users/1/security')
      })
    })
  })

  describe('TabbedForm Context', () => {
    it('provides context with current tab info', () => {
      let contextValue: TabbedFormContextValue | undefined

      function ContextConsumer() {
        contextValue = useTabbedFormContext()
        return <div data-testid="context-consumer" />
      }

      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="General" name="general">
              <ContextConsumer />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      expect(contextValue).toBeDefined()
      expect(contextValue?.activeTab).toBe('general')
    })

    it('provides setActiveTab function through context', async () => {
      const user = userEvent.setup()
      let contextValue: TabbedFormContextValue | undefined

      function ContextConsumer() {
        contextValue = useTabbedFormContext()
        return (
          <button type="button" onClick={() => contextValue?.setActiveTab('details')}>
            Go to Details
          </button>
        )
      }

      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="General" name="general">
              <ContextConsumer />
            </FormTab>
            <FormTab label="Details" name="details">
              <TextInput source="description" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      await user.click(screen.getByRole('button', { name: 'Go to Details' }))

      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
    })

    it('provides tabs info through context', () => {
      let contextValue: TabbedFormContextValue | undefined

      function ContextConsumer() {
        contextValue = useTabbedFormContext()
        return null
      }

      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="General" name="general">
              <ContextConsumer />
            </FormTab>
            <FormTab label="Details" name="details">
              <TextInput source="description" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      expect(contextValue?.tabs).toHaveLength(2)
      expect(contextValue?.tabs[0]).toEqual(
        expect.objectContaining({ name: 'general', label: 'General' })
      )
    })
  })

  describe('FormTab Component', () => {
    it('renders children within tab panel', () => {
      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="Test Tab">
              <div data-testid="tab-content">Tab Content</div>
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      expect(screen.getByTestId('tab-content')).toBeInTheDocument()
    })

    it('accepts custom name prop', () => {
      let contextValue: TabbedFormContextValue | undefined

      function ContextConsumer() {
        contextValue = useTabbedFormContext()
        return null
      }

      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="General Info" name="general-info">
              <ContextConsumer />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      expect(contextValue?.activeTab).toBe('general-info')
    })

    it('generates name from label if not provided', () => {
      let contextValue: TabbedFormContextValue | undefined

      function ContextConsumer() {
        contextValue = useTabbedFormContext()
        return null
      }

      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="General Info">
              <ContextConsumer />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      // Should generate a slug from the label
      expect(contextValue?.activeTab).toBe('general-info')
    })

    it('supports icon prop', () => {
      const UserIcon = () => <svg data-testid="user-icon" />

      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="Users" icon={<UserIcon />}>
              <TextInput source="name" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      expect(screen.getByTestId('user-icon')).toBeInTheDocument()
    })

    it('supports disabled prop', () => {
      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="Enabled">
              <TextInput source="field1" />
            </FormTab>
            <FormTab label="Disabled" disabled>
              <TextInput source="field2" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      const disabledTab = screen.getByRole('tab', { name: 'Disabled' })
      expect(disabledTab).toBeDisabled()
    })

    it('supports className prop for tab panel styling', () => {
      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="Styled Tab" className="custom-panel-class">
              <TextInput source="name" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      const tabPanel = screen.getByRole('tabpanel')
      expect(tabPanel).toHaveClass('custom-panel-class')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes for tabs', () => {
      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="Tab 1" name="tab1">
              <TextInput source="field1" />
            </FormTab>
            <FormTab label="Tab 2" name="tab2">
              <TextInput source="field2" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toBeInTheDocument()

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(2)

      // First tab should be selected
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false')

      // Tab panel should be present (with multiple tabs, both panels may render but only one visible)
      const tabpanels = screen.getAllByRole('tabpanel')
      expect(tabpanels.length).toBeGreaterThanOrEqual(1)
    })

    it('associates tab with its panel using aria-controls', () => {
      render(
        <TestFormWrapper>
          <TabbedForm>
            <FormTab label="Test Tab" name="test">
              <TextInput source="field" />
            </FormTab>
          </TabbedForm>
        </TestFormWrapper>
      )

      const tab = screen.getByRole('tab')
      const panel = screen.getByRole('tabpanel')

      const controlsId = tab.getAttribute('aria-controls')
      expect(panel).toHaveAttribute('id', controlsId)
    })
  })
})
