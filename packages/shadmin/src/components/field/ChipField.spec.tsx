import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { ChipField } from './ChipField'
import { RecordContextProvider } from '../../contexts/RecordContext'

describe('ChipField', () => {
  describe('rendering value from record', () => {
    it('should render the value from record field via source prop', () => {
      const record = { id: 1, status: 'active' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="status" />
        </RecordContextProvider>
      )

      expect(screen.getByText('active')).toBeInTheDocument()
    })

    it('should support nested field access using dot notation', () => {
      const record = { id: 1, meta: { status: 'pending' } }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="meta.status" />
        </RecordContextProvider>
      )

      expect(screen.getByText('pending')).toBeInTheDocument()
    })
  })

  describe('using RecordContext', () => {
    it('should get record from RecordContext when not provided as prop', () => {
      const record = { id: 1, role: 'admin' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="role" />
        </RecordContextProvider>
      )

      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    it('should prefer record prop over RecordContext', () => {
      const contextRecord = { id: 1, status: 'context' }
      const propRecord = { id: 2, status: 'prop' }

      render(
        <RecordContextProvider value={contextRecord}>
          <ChipField source="status" record={propRecord} />
        </RecordContextProvider>
      )

      expect(screen.getByText('prop')).toBeInTheDocument()
    })
  })

  describe('variant styles', () => {
    it('should render with default variant', () => {
      const record = { id: 1, status: 'active' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="status" data-testid="chip" />
        </RecordContextProvider>
      )

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('should render with secondary variant', () => {
      const record = { id: 1, status: 'pending' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="status" variant="secondary" data-testid="chip" />
        </RecordContextProvider>
      )

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('should render with destructive variant', () => {
      const record = { id: 1, status: 'error' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="status" variant="destructive" data-testid="chip" />
        </RecordContextProvider>
      )

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('bg-destructive', 'text-destructive-foreground')
    })

    it('should render with outline variant', () => {
      const record = { id: 1, status: 'draft' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="status" variant="outline" data-testid="chip" />
        </RecordContextProvider>
      )

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('border', 'bg-background')
    })
  })

  describe('size styles', () => {
    it('should render with default size', () => {
      const record = { id: 1, tag: 'important' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="tag" data-testid="chip" />
        </RecordContextProvider>
      )

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('text-sm', 'px-2.5')
    })

    it('should render with small size', () => {
      const record = { id: 1, tag: 'small' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="tag" size="sm" data-testid="chip" />
        </RecordContextProvider>
      )

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('text-xs', 'px-2')
    })

    it('should render with large size', () => {
      const record = { id: 1, tag: 'large' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="tag" size="lg" data-testid="chip" />
        </RecordContextProvider>
      )

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('text-base', 'px-3')
    })
  })

  describe('className support', () => {
    it('should apply additional className', () => {
      const record = { id: 1, status: 'test' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="status" className="custom-class" data-testid="chip" />
        </RecordContextProvider>
      )

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('custom-class')
    })

    it('should render as a span element', () => {
      const record = { id: 1, status: 'test' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="status" data-testid="chip" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('chip')
      expect(element.tagName.toLowerCase()).toBe('span')
    })
  })

  describe('handling missing/null values', () => {
    it('should render nothing when field is null and no emptyText', () => {
      const record = { id: 1, status: null }

      const { container } = render(
        <RecordContextProvider value={record}>
          <ChipField source="status" />
        </RecordContextProvider>
      )

      expect(container.textContent).toBe('')
    })

    it('should render nothing when field is undefined and no emptyText', () => {
      const record = { id: 1 }

      const { container } = render(
        <RecordContextProvider value={record}>
          <ChipField source="status" />
        </RecordContextProvider>
      )

      expect(container.textContent).toBe('')
    })

    it('should render emptyText when value is missing', () => {
      const record = { id: 1 }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="status" emptyText="N/A" />
        </RecordContextProvider>
      )

      expect(screen.getByText('N/A')).toBeInTheDocument()
    })
  })

  describe('label support', () => {
    it('should render label when provided', () => {
      const record = { id: 1, status: 'active' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="status" label="Status" />
        </RecordContextProvider>
      )

      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('active')).toBeInTheDocument()
    })

    it('should not render label when not provided', () => {
      const record = { id: 1, status: 'active' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="status" data-testid="chip" />
        </RecordContextProvider>
      )

      const element = screen.getByTestId('chip')
      expect(element.textContent).toBe('active')
    })
  })

  describe('type coercion', () => {
    it('should convert number to string', () => {
      const record = { id: 1, count: 42 }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="count" />
        </RecordContextProvider>
      )

      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should convert boolean to string', () => {
      const record = { id: 1, active: true }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="active" />
        </RecordContextProvider>
      )

      expect(screen.getByText('true')).toBeInTheDocument()
    })
  })

  describe('chip styling', () => {
    it('should have rounded-full class for pill shape', () => {
      const record = { id: 1, tag: 'test' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="tag" data-testid="chip" />
        </RecordContextProvider>
      )

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('rounded-full')
    })

    it('should have font-medium class', () => {
      const record = { id: 1, tag: 'test' }

      render(
        <RecordContextProvider value={record}>
          <ChipField source="tag" data-testid="chip" />
        </RecordContextProvider>
      )

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('font-medium')
    })
  })
})
