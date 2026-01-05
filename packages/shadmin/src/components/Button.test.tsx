/**
 * Unit tests for Button component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('renders with default variant and size', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-primary')
    })

    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })
  })

  describe('variants', () => {
    it('renders default variant', () => {
      render(<Button variant="default">Default</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-primary')
    })

    it('renders destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-destructive')
    })

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      expect(screen.getByRole('button')).toHaveClass('border')
    })

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-secondary')
    })

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')
    })

    it('renders link variant', () => {
      render(<Button variant="link">Link</Button>)
      expect(screen.getByRole('button')).toHaveClass('underline-offset-4')
    })
  })

  describe('sizes', () => {
    it('renders default size', () => {
      render(<Button size="default">Default</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-10')
    })

    it('renders small size', () => {
      render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-9')
    })

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-11')
    })

    it('renders icon size', () => {
      render(<Button size="icon">+</Button>)
      expect(screen.getByRole('button')).toHaveClass('w-10')
    })
  })

  describe('states', () => {
    it('handles click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is disabled when disabled prop is true', () => {
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()

      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('is disabled when loading', () => {
      const handleClick = vi.fn()
      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('shows loading spinner when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      // Check for the loading spinner element
      const spinner = button.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('can be focused', () => {
      render(<Button>Focusable</Button>)
      const button = screen.getByRole('button')

      button.focus()
      expect(document.activeElement).toBe(button)
    })

    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>)
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
    })

    it('has correct role', () => {
      render(<Button>Submit</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('forwarded ref', () => {
    it('forwards ref to button element', () => {
      const ref = vi.fn()
      render(<Button ref={ref}>Ref</Button>)
      expect(ref).toHaveBeenCalled()
      expect(ref.mock.calls[0]?.[0]).toBeInstanceOf(HTMLButtonElement)
    })
  })
})
