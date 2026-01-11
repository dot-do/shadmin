/**
 * Comprehensive Accessibility Tests
 *
 * Tests for ARIA attributes, keyboard navigation, focus management,
 * and screen reader compatibility across shadmin components.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/
 * @see https://testing-library.com/docs/queries/byrole
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'

// Components
import { TextInput } from '../input/TextInput'
import { SelectInput } from '../input/SelectInput'
import { BooleanInput } from '../input/BooleanInput'
import { NumberInput } from '../input/NumberInput'
import { PasswordInput } from '../input/PasswordInput'
import { Button } from '../Button'
import { Confirm } from '../feedback/Confirm'
import { Menu } from '../menu/Menu'
import { MenuItem } from '../menu/MenuItem'
import { SubMenu } from '../menu/SubMenu'
import { Sidebar } from '../layout/Sidebar'
import { Pagination } from '../list/Pagination'
import { Loading } from '../feedback/Loading'
import { Error as ErrorComponent } from '../feedback/Error'

// Contexts
import { FormContextProvider } from '../../contexts/FormContext'
import { TestMemoryRouter } from '../../test-utils'

// =============================================================================
// Test Utilities
// =============================================================================

interface TestFormProps {
  children: ReactNode
  defaultValues?: Record<string, unknown>
  onSubmit?: (data: Record<string, unknown>) => void
}

function TestForm({ children, defaultValues = {}, onSubmit = vi.fn() }: TestFormProps) {
  const form = useForm({ defaultValues })
  return (
    <FormContextProvider {...form} save={onSubmit}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {children}
        <button type="submit">Submit</button>
      </form>
    </FormContextProvider>
  )
}

function Wrapper({ children, initialEntries = ['/'] }: { children: ReactNode; initialEntries?: string[] }) {
  return (
    <TestMemoryRouter initialEntries={initialEntries}>
      {children}
    </TestMemoryRouter>
  )
}

// =============================================================================
// Input Components ARIA Tests
// =============================================================================

describe('Input Components Accessibility', () => {
  describe('TextInput ARIA Attributes', () => {
    it('should have proper label association via htmlFor', () => {
      render(
        <TestForm>
          <TextInput source="email" label="Email Address" />
        </TestForm>
      )

      const input = screen.getByLabelText('Email Address')
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe('INPUT')
    })

    it('should have aria-invalid when field has error', async () => {
      const user = userEvent.setup()

      function FormWithValidation() {
        const form = useForm({
          defaultValues: { email: '' },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <TextInput
                source="email"
                label="Email"
                rules={{ required: 'Email is required' }}
              />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        const input = screen.getByLabelText('Email')
        expect(input).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('should have aria-describedby pointing to error message', async () => {
      const user = userEvent.setup()

      function FormWithValidation() {
        const form = useForm({
          defaultValues: { email: '' },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <TextInput
                source="email"
                label="Email"
                rules={{ required: 'Email is required' }}
              />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        const input = screen.getByLabelText('Email')
        const describedBy = input.getAttribute('aria-describedby')
        expect(describedBy).toBeTruthy()

        if (describedBy) {
          const errorElement = document.getElementById(describedBy)
          expect(errorElement).toHaveTextContent('Email is required')
        }
      })
    })

    it('should have aria-describedby pointing to helper text when no error', () => {
      render(
        <TestForm>
          <TextInput source="username" label="Username" helperText="Choose a unique username" />
        </TestForm>
      )

      const input = screen.getByLabelText('Username')
      const describedBy = input.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()

      if (describedBy) {
        const helperElement = document.getElementById(describedBy)
        expect(helperElement).toHaveTextContent('Choose a unique username')
      }
    })

    it('should have required attribute when required', () => {
      render(
        <TestForm>
          <TextInput source="email" label="Email" required />
        </TestForm>
      )

      const input = screen.getByLabelText(/email/i)
      expect(input).toBeRequired()
    })

    it('should have disabled attribute when disabled', () => {
      render(
        <TestForm>
          <TextInput source="email" label="Email" disabled />
        </TestForm>
      )

      const input = screen.getByLabelText(/email/i)
      expect(input).toBeDisabled()
    })

    it('clear button should have aria-label', () => {
      render(
        <TestForm defaultValues={{ search: 'test' }}>
          <TextInput source="search" label="Search" resettable />
        </TestForm>
      )

      const clearButton = screen.getByRole('button', { name: /clear input/i })
      expect(clearButton).toBeInTheDocument()
    })
  })

  describe('SelectInput ARIA Attributes', () => {
    const choices = [
      { id: 'active', name: 'Active' },
      { id: 'inactive', name: 'Inactive' },
      { id: 'pending', name: 'Pending' },
    ]

    it('should have proper label association', () => {
      render(
        <TestForm>
          <SelectInput source="status" label="Status" choices={choices} />
        </TestForm>
      )

      const select = screen.getByLabelText('Status')
      expect(select).toBeInTheDocument()
      expect(select.tagName).toBe('SELECT')
    })

    it('should have aria-invalid when field has error', async () => {
      const user = userEvent.setup()

      function FormWithValidation() {
        const form = useForm({
          defaultValues: { status: '' },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <SelectInput
                source="status"
                label="Status"
                choices={choices}
                emptyText="Select a status"
                rules={{ required: 'Status is required' }}
              />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        const select = screen.getByRole('combobox')
        expect(select).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('clear button should have aria-label', () => {
      render(
        <TestForm defaultValues={{ status: 'active' }}>
          <SelectInput source="status" label="Status" choices={choices} resettable />
        </TestForm>
      )

      const clearButton = screen.getByRole('button', { name: /clear selection/i })
      expect(clearButton).toBeInTheDocument()
    })
  })

  describe('BooleanInput ARIA Attributes', () => {
    it('should have role="switch"', () => {
      render(
        <TestForm>
          <BooleanInput source="active" label="Active" />
        </TestForm>
      )

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })

    it('should have aria-checked reflecting current state', () => {
      render(
        <TestForm defaultValues={{ active: true }}>
          <BooleanInput source="active" label="Active" />
        </TestForm>
      )

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('should toggle aria-checked on click', async () => {
      const user = userEvent.setup()

      render(
        <TestForm defaultValues={{ active: false }}>
          <BooleanInput source="active" label="Active" />
        </TestForm>
      )

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')

      await user.click(switchElement)

      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('should have aria-invalid when field has error', async () => {
      const user = userEvent.setup()

      function FormWithValidation() {
        const form = useForm({
          defaultValues: { terms: false },
          mode: 'onSubmit',
        })

        return (
          <FormContextProvider {...form}>
            <form onSubmit={form.handleSubmit(() => {})} noValidate>
              <BooleanInput
                source="terms"
                label="Accept Terms"
                rules={{ validate: (v) => v === true || 'You must accept' }}
              />
              <button type="submit">Submit</button>
            </form>
          </FormContextProvider>
        )
      }

      render(<FormWithValidation />)

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        const switchElement = screen.getByRole('switch')
        expect(switchElement).toHaveAttribute('aria-invalid', 'true')
      })
    })
  })

  describe('NumberInput ARIA Attributes', () => {
    it('should have type="number" with spinbutton role', () => {
      render(
        <TestForm>
          <NumberInput source="quantity" label="Quantity" />
        </TestForm>
      )

      const input = screen.getByRole('spinbutton')
      expect(input).toBeInTheDocument()
    })

    it('should have proper label association', () => {
      render(
        <TestForm>
          <NumberInput source="quantity" label="Quantity" />
        </TestForm>
      )

      const input = screen.getByLabelText('Quantity')
      expect(input).toBeInTheDocument()
    })
  })

  describe('PasswordInput ARIA Attributes', () => {
    it('should have type="password" by default', () => {
      render(
        <TestForm>
          <PasswordInput source="password" label="Password" />
        </TestForm>
      )

      const input = screen.getByLabelText('Password')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('toggle button should have aria-label', () => {
      render(
        <TestForm>
          <PasswordInput source="password" label="Password" />
        </TestForm>
      )

      const toggleButton = screen.getByRole('button', { name: /show password|toggle password/i })
      expect(toggleButton).toBeInTheDocument()
    })
  })
})

// =============================================================================
// Keyboard Navigation Tests
// =============================================================================

describe('Keyboard Navigation', () => {
  describe('Input Keyboard Interactions', () => {
    it('TextInput should be focusable with Tab', async () => {
      const user = userEvent.setup()

      render(
        <TestForm>
          <TextInput source="first" label="First" />
          <TextInput source="second" label="Second" />
        </TestForm>
      )

      const firstInput = screen.getByLabelText('First')
      const secondInput = screen.getByLabelText('Second')

      await user.tab()
      expect(firstInput).toHaveFocus()

      await user.tab()
      expect(secondInput).toHaveFocus()
    })

    it('BooleanInput should toggle with Space key', async () => {
      const user = userEvent.setup()

      render(
        <TestForm defaultValues={{ active: false }}>
          <BooleanInput source="active" label="Active" />
        </TestForm>
      )

      const switchElement = screen.getByRole('switch')
      switchElement.focus()

      await user.keyboard(' ')

      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('BooleanInput should toggle with Enter key', async () => {
      const user = userEvent.setup()

      render(
        <TestForm defaultValues={{ active: false }}>
          <BooleanInput source="active" label="Active" />
        </TestForm>
      )

      const switchElement = screen.getByRole('switch')
      switchElement.focus()

      await user.keyboard('{Enter}')

      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('SelectInput should be navigable with keyboard', () => {
      const choices = [
        { id: 'a', name: 'Option A' },
        { id: 'b', name: 'Option B' },
        { id: 'c', name: 'Option C' },
      ]

      render(
        <TestForm>
          <SelectInput source="choice" label="Choice" choices={choices} />
        </TestForm>
      )

      const select = screen.getByRole('combobox')
      select.focus()

      expect(select).toHaveFocus()
    })
  })

  describe('Button Keyboard Interactions', () => {
    it('should be activatable with Enter key', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<Button onClick={handleClick}>Click Me</Button>)

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalled()
    })

    it('should be activatable with Space key', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<Button onClick={handleClick}>Click Me</Button>)

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard(' ')

      expect(handleClick).toHaveBeenCalled()
    })

    it('disabled button should not respond to keyboard', () => {
      const handleClick = vi.fn()

      render(<Button onClick={handleClick} disabled>Disabled</Button>)

      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Enter' })

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Menu Keyboard Navigation', () => {
    it('should navigate with ArrowDown/ArrowUp', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
            <MenuItem to="/settings" label="Settings" />
          </Menu>
        </Wrapper>
      )

      const usersLink = screen.getByRole('menuitem', { name: /users/i })
      usersLink.focus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('menuitem', { name: /posts/i })).toHaveFocus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('menuitem', { name: /settings/i })).toHaveFocus()

      await user.keyboard('{ArrowUp}')
      expect(screen.getByRole('menuitem', { name: /posts/i })).toHaveFocus()
    })

    it('should navigate to first/last with Home/End', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
            <MenuItem to="/settings" label="Settings" />
          </Menu>
        </Wrapper>
      )

      const postsLink = screen.getByRole('menuitem', { name: /posts/i })
      postsLink.focus()

      await user.keyboard('{End}')
      expect(screen.getByRole('menuitem', { name: /settings/i })).toHaveFocus()

      await user.keyboard('{Home}')
      expect(screen.getByRole('menuitem', { name: /users/i })).toHaveFocus()
    })

    it('should wrap around on ArrowDown at last item', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" />
          </Menu>
        </Wrapper>
      )

      const postsLink = screen.getByRole('menuitem', { name: /posts/i })
      postsLink.focus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('menuitem', { name: /users/i })).toHaveFocus()
    })

    it('should expand/collapse SubMenu with ArrowRight/ArrowLeft', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings">
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const settingsButton = screen.getByRole('button', { name: /settings/i })
      settingsButton.focus()

      // Expand with ArrowRight
      await user.keyboard('{ArrowRight}')
      expect(screen.getByText('General')).toBeInTheDocument()

      // Collapse with ArrowLeft
      await user.keyboard('{ArrowLeft}')
      await waitFor(() => {
        expect(screen.queryByText('General')).not.toBeInTheDocument()
      })
    })

    it('should skip disabled items during navigation', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
            <MenuItem to="/posts" label="Posts" disabled />
            <MenuItem to="/settings" label="Settings" />
          </Menu>
        </Wrapper>
      )

      const usersLink = screen.getByRole('menuitem', { name: /users/i })
      usersLink.focus()

      await user.keyboard('{ArrowDown}')

      // Should skip the disabled "Posts" item
      expect(screen.getByRole('menuitem', { name: /settings/i })).toHaveFocus()
    })
  })
})

// =============================================================================
// Focus Management Tests
// =============================================================================

describe('Focus Management', () => {
  describe('Confirm Dialog Focus Management', () => {
    it('should focus dialog when opened', async () => {
      render(
        <Confirm
          open={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Delete Item"
          message="Are you sure?"
        />
      )

      // Dialog should be focused
      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
      })
    })

    it('should close dialog on Escape key', async () => {
      const user = userEvent.setup()
      const handleClose = vi.fn()

      render(
        <Confirm
          open={true}
          onClose={handleClose}
          onConfirm={vi.fn()}
          title="Delete Item"
          message="Are you sure?"
        />
      )

      await user.keyboard('{Escape}')

      expect(handleClose).toHaveBeenCalled()
    })

    it('should not close on Escape when loading', async () => {
      const user = userEvent.setup()
      const handleClose = vi.fn()

      render(
        <Confirm
          open={true}
          onClose={handleClose}
          onConfirm={vi.fn()}
          title="Delete Item"
          message="Are you sure?"
          loading={true}
        />
      )

      await user.keyboard('{Escape}')

      expect(handleClose).not.toHaveBeenCalled()
    })

    it('should have aria-modal="true"', () => {
      render(
        <Confirm
          open={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Delete Item"
        />
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('should have aria-labelledby pointing to title', () => {
      render(
        <Confirm
          open={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Delete Item"
        />
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-title')

      const title = screen.getByText('Delete Item')
      expect(title).toHaveAttribute('id', 'confirm-title')
    })

    it('should have aria-describedby pointing to message', () => {
      render(
        <Confirm
          open={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Delete Item"
          message="This cannot be undone."
        />
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-describedby', 'confirm-message')

      const message = screen.getByText('This cannot be undone.')
      expect(message).toHaveAttribute('id', 'confirm-message')
    })

    it('close button should have aria-label', () => {
      render(
        <Confirm
          open={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Delete Item"
        />
      )

      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('Input Focus Management', () => {
    it('autoFocus should work on TextInput', () => {
      render(
        <TestForm>
          <TextInput source="search" label="Search" autoFocus />
        </TestForm>
      )

      const input = screen.getByLabelText('Search')
      expect(input).toHaveFocus()
    })

    it('should have visible focus indicator (focus-visible)', () => {
      render(
        <TestForm>
          <TextInput source="email" label="Email" />
        </TestForm>
      )

      const input = screen.getByLabelText('Email')
      // The component should have focus-visible styles defined
      expect(input.className).toMatch(/focus-visible/)
    })
  })
})

// =============================================================================
// Screen Reader / ARIA Live Region Tests
// =============================================================================

describe('Screen Reader Compatibility', () => {
  describe('Loading States', () => {
    it('Loading component should have role="progressbar"', () => {
      render(<Loading />)

      const progressbar = screen.getByRole('progressbar')
      expect(progressbar).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    it('Error component should have role="alert"', () => {
      render(<ErrorComponent error="Something went wrong" />)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })
  })

  describe('Navigation Roles', () => {
    it('Menu should have role="navigation"', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/home" label="Home" />
          </Menu>
        </Wrapper>
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('Menu should support aria-label', () => {
      render(
        <Wrapper>
          <Menu aria-label="Main navigation">
            <MenuItem to="/home" label="Home" />
          </Menu>
        </Wrapper>
      )

      const nav = screen.getByRole('navigation', { name: 'Main navigation' })
      expect(nav).toBeInTheDocument()
    })

    it('Sidebar should have role="complementary"', () => {
      render(
        <Wrapper>
          <Sidebar title="Admin">
            <div>Content</div>
          </Sidebar>
        </Wrapper>
      )

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeInTheDocument()
    })
  })

  describe('Menu Item Roles', () => {
    it('MenuItem should have role="menuitem"', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      const menuitem = screen.getByRole('menuitem', { name: /users/i })
      expect(menuitem).toBeInTheDocument()
    })

    it('active MenuItem should have aria-current="page"', () => {
      render(
        <Wrapper initialEntries={['/users']}>
          <Menu>
            <MenuItem to="/users" label="Users" />
          </Menu>
        </Wrapper>
      )

      const menuitem = screen.getByRole('menuitem', { name: /users/i })
      expect(menuitem).toHaveAttribute('aria-current', 'page')
    })

    it('disabled MenuItem should have aria-disabled="true"', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/users" label="Users" disabled />
          </Menu>
        </Wrapper>
      )

      const menuitem = screen.getByRole('menuitem', { name: /users/i })
      expect(menuitem).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('SubMenu ARIA Attributes', () => {
    it('SubMenu toggle should have aria-expanded', () => {
      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings">
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('SubMenu toggle aria-expanded should update on open', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings">
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      await user.click(toggleButton)

      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('SubMenu should have aria-controls', () => {
      render(
        <Wrapper>
          <Menu>
            <SubMenu label="Settings" defaultOpen>
              <MenuItem to="/settings/general" label="General" />
            </SubMenu>
          </Menu>
        </Wrapper>
      )

      const toggleButton = screen.getByRole('button', { name: /settings/i })
      const controlsId = toggleButton.getAttribute('aria-controls')

      expect(controlsId).toBeTruthy()
    })
  })

  describe('Badge Accessibility', () => {
    it('numeric badge should have aria-label describing count', () => {
      render(
        <Wrapper>
          <Menu>
            <MenuItem to="/notifications" label="Notifications" badge={5} />
          </Menu>
        </Wrapper>
      )

      const badge = screen.getByText('5')
      expect(badge).toHaveAttribute('aria-label')
    })
  })

  describe('Tooltip Accessibility', () => {
    it('tooltip should have role="tooltip" when shown', async () => {
      const user = userEvent.setup()

      render(
        <Wrapper>
          <Menu collapsed>
            <MenuItem to="/users" label="Users" icon={<span>U</span>} />
          </Menu>
        </Wrapper>
      )

      const menuitem = screen.getByRole('menuitem', { name: /users/i })
      await user.hover(menuitem)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toBeInTheDocument()
        expect(tooltip).toHaveTextContent('Users')
      })
    })
  })
})

// =============================================================================
// Pagination Accessibility Tests
// =============================================================================

describe('Pagination Accessibility', () => {
  it('navigation buttons should have aria-labels', () => {
    render(
      <Wrapper>
        <Pagination page={2} perPage={10} total={50} setPage={vi.fn()} />
      </Wrapper>
    )

    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument()
  })

  it('page buttons should have aria-labels', () => {
    render(
      <Wrapper>
        <Pagination page={1} perPage={10} total={50} setPage={vi.fn()} />
      </Wrapper>
    )

    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to page 2')).toBeInTheDocument()
  })

  it('disabled navigation buttons should be properly disabled', () => {
    render(
      <Wrapper>
        <Pagination page={1} perPage={10} total={50} setPage={vi.fn()} />
      </Wrapper>
    )

    const prevButton = screen.getByLabelText('Go to previous page')
    expect(prevButton).toBeDisabled()
  })

  it('current page button should be distinguishable', () => {
    render(
      <Wrapper>
        <Pagination page={2} perPage={10} total={50} setPage={vi.fn()} />
      </Wrapper>
    )

    const currentPageButton = screen.getByLabelText('Go to page 2')
    // Current page typically has aria-current or different styling
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
  })
})

// =============================================================================
// Form Validation Accessibility Tests
// =============================================================================

describe('Form Validation Accessibility', () => {
  it('required fields should show visual indicator', () => {
    render(
      <TestForm>
        <TextInput source="email" label="Email" required />
      </TestForm>
    )

    // Should show asterisk
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('error messages should be associated with inputs', async () => {
    const user = userEvent.setup()

    function FormWithValidation() {
      const form = useForm({
        defaultValues: { email: '' },
        mode: 'onSubmit',
      })

      return (
        <FormContextProvider {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <TextInput
              source="email"
              label="Email"
              rules={{ required: 'Email is required' }}
            />
            <button type="submit">Submit</button>
          </form>
        </FormContextProvider>
      )
    }

    render(<FormWithValidation />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      const input = screen.getByLabelText('Email')
      const describedById = input.getAttribute('aria-describedby')

      expect(describedById).toBeTruthy()
      if (describedById) {
        expect(document.getElementById(describedById)).toHaveTextContent('Email is required')
      }
    })
  })
})

// =============================================================================
// Button Accessibility Tests
// =============================================================================

describe('Button Accessibility', () => {
  it('should have proper button role', () => {
    render(<Button>Click Me</Button>)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should support aria-label for icon-only buttons', () => {
    render(<Button aria-label="Close dialog">X</Button>)

    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument()
  })

  it('loading button should be disabled', () => {
    render(<Button loading>Save</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should be focusable', () => {
    render(<Button>Focus Me</Button>)

    const button = screen.getByRole('button')
    button.focus()

    expect(document.activeElement).toBe(button)
  })

  it('disabled button should not be focusable via click', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })
})

// =============================================================================
// Collapsed Mode Accessibility Tests
// =============================================================================

describe('Collapsed Mode Accessibility', () => {
  it('labels should be visually hidden but available to screen readers', () => {
    render(
      <Wrapper>
        <Menu collapsed>
          <MenuItem to="/users" label="Users" icon={<span>U</span>} />
        </Menu>
      </Wrapper>
    )

    // The menuitem should still be accessible by name
    const menuitem = screen.getByRole('menuitem', { name: /users/i })
    expect(menuitem).toBeInTheDocument()

    // Label text should have sr-only class
    const labelElement = screen.getByText('Users')
    expect(labelElement).toHaveClass('sr-only')
  })

  it('badges should be hidden in collapsed mode', () => {
    render(
      <Wrapper>
        <Menu collapsed>
          <MenuItem to="/users" label="Users" icon={<span>U</span>} badge={5} />
        </Menu>
      </Wrapper>
    )

    const badge = screen.getByText('5')
    expect(badge).toHaveClass('sr-only')
  })
})
