/**
 * Unit tests for TranslateLabel component
 */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { TranslateLabel } from './TranslateLabel'
import {
  ResourceContextProvider,
} from '../../contexts/ResourceContext'
import {
  TranslationProvider,
  createDefaultI18nProvider,
} from '../../contexts/TranslationContext'

const messages = {
  en: {
    resources: {
      users: {
        fields: {
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email Address',
          created_at: 'Creation Date',
        },
      },
      posts: {
        fields: {
          title: 'Post Title',
          content: 'Post Content',
        },
      },
    },
    fields: {
      name: 'Name',
      description: 'Description',
    },
    'custom.label.key': 'Custom Label',
  },
}

function createTestProvider() {
  return createDefaultI18nProvider(messages, 'en')
}

describe('TranslateLabel', () => {
  describe('basic rendering', () => {
    it('renders a label element', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="name" />
        </TranslationProvider>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    it('applies default label styling', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="name" />
        </TranslationProvider>
      )

      const label = screen.getByText('Name')
      expect(label.tagName).toBe('LABEL')
      expect(label).toHaveClass('text-sm', 'font-medium')
    })

    it('applies custom className', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="name" className="custom-label" />
        </TranslationProvider>
      )

      const label = screen.getByText('Name')
      expect(label).toHaveClass('custom-label')
    })
  })

  describe('resource-aware translation', () => {
    it('translates using resource context', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <ResourceContextProvider value="users">
            <TranslateLabel source="firstName" />
          </ResourceContextProvider>
        </TranslationProvider>
      )

      expect(screen.getByText('First Name')).toBeInTheDocument()
    })

    it('translates using explicit resource prop', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="title" resource="posts" />
        </TranslationProvider>
      )

      expect(screen.getByText('Post Title')).toBeInTheDocument()
    })

    it('explicit resource prop overrides context', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <ResourceContextProvider value="users">
            <TranslateLabel source="title" resource="posts" />
          </ResourceContextProvider>
        </TranslationProvider>
      )

      expect(screen.getByText('Post Title')).toBeInTheDocument()
    })
  })

  describe('direct i18n key', () => {
    it('uses i18nKey directly when provided', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel i18nKey="custom.label.key" />
        </TranslationProvider>
      )

      expect(screen.getByText('Custom Label')).toBeInTheDocument()
    })

    it('i18nKey takes precedence over source', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="firstName" i18nKey="custom.label.key" resource="users" />
        </TranslationProvider>
      )

      expect(screen.getByText('Custom Label')).toBeInTheDocument()
    })
  })

  describe('fallback behavior', () => {
    it('humanizes source name when translation not found', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="unknownField" />
        </TranslationProvider>
      )

      expect(screen.getByText('Unknown Field')).toBeInTheDocument()
    })

    it('handles camelCase source names', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="myCustomField" />
        </TranslationProvider>
      )

      expect(screen.getByText('My Custom Field')).toBeInTheDocument()
    })

    it('handles snake_case source names', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="my_custom_field" />
        </TranslationProvider>
      )

      expect(screen.getByText('My Custom Field')).toBeInTheDocument()
    })

    it('uses defaultLabel when provided', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="unknownField" defaultLabel="My Default Label" />
        </TranslationProvider>
      )

      expect(screen.getByText('My Default Label')).toBeInTheDocument()
    })

    it('defaultLabel takes precedence over humanized name', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="myField" defaultLabel="Override Label" />
        </TranslationProvider>
      )

      expect(screen.getByText('Override Label')).toBeInTheDocument()
    })
  })

  describe('required indicator', () => {
    it('shows asterisk for required fields', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="name" required />
        </TranslationProvider>
      )

      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('asterisk has destructive styling', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="name" required />
        </TranslationProvider>
      )

      const asterisk = screen.getByText('*')
      expect(asterisk).toHaveClass('text-destructive')
    })

    it('does not show asterisk when not required', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="name" />
        </TranslationProvider>
      )

      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })
  })

  describe('htmlFor attribute', () => {
    it('sets htmlFor on label', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel source="name" htmlFor="name-input" />
        </TranslationProvider>
      )

      const label = screen.getByText('Name')
      expect(label).toHaveAttribute('for', 'name-input')
    })
  })

  describe('children rendering', () => {
    it('renders ReactNode children instead of translation', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel>
            <span>Custom Content</span>
          </TranslateLabel>
        </TranslationProvider>
      )

      expect(screen.getByText('Custom Content')).toBeInTheDocument()
    })

    it('shows required indicator with custom children', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <TranslateLabel required>
            <span>Custom Label</span>
          </TranslateLabel>
        </TranslationProvider>
      )

      expect(screen.getByText('Custom Label')).toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument()
    })
  })

  describe('without TranslationProvider', () => {
    it('humanizes source when no provider', () => {
      render(<TranslateLabel source="myFieldName" />)

      expect(screen.getByText('My Field Name')).toBeInTheDocument()
    })

    it('uses defaultLabel when no provider', () => {
      render(<TranslateLabel source="field" defaultLabel="Default" />)

      expect(screen.getByText('Default')).toBeInTheDocument()
    })
  })
})
