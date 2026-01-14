/**
 * Unit tests for LocaleSwitcher component
 */

import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { LocaleSwitcher } from './LocaleSwitcher'
import {
  TranslationProvider,
  createDefaultI18nProvider,
} from '../../contexts/TranslationContext'

const englishMessages = {
  hello: 'Hello',
}

const frenchMessages = {
  hello: 'Bonjour',
}

const messages = {
  en: englishMessages,
  fr: frenchMessages,
  de: {},
}

function createTestProvider(defaultLocale = 'en') {
  return createDefaultI18nProvider(messages, defaultLocale)
}

describe('LocaleSwitcher', () => {
  describe('rendering', () => {
    it('renders select element with locales from provider', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <LocaleSwitcher />
        </TranslationProvider>
      )

      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()

      // Check that all locales are rendered as options
      expect(screen.getByRole('option', { name: 'en' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'fr' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'de' })).toBeInTheDocument()
    })

    it('renders custom locales when provided', () => {
      const customLocales = [
        { locale: 'es', name: 'Spanish' },
        { locale: 'it', name: 'Italian' },
      ]

      render(
        <TranslationProvider>
          <LocaleSwitcher locales={customLocales} />
        </TranslationProvider>
      )

      expect(screen.getByRole('option', { name: 'Spanish' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Italian' })).toBeInTheDocument()
    })

    it('renders nothing when no locales are available', () => {
      const emptyProvider = createDefaultI18nProvider({}, 'en')

      const { container } = render(
        <TranslationProvider i18nProvider={emptyProvider}>
          <LocaleSwitcher />
        </TranslationProvider>
      )

      expect(container.querySelector('select')).not.toBeInTheDocument()
    })

    it('renders label when provided', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <LocaleSwitcher label="Select Language" />
        </TranslationProvider>
      )

      expect(screen.getByText('Select Language')).toBeInTheDocument()
    })

    it('shows locale codes when showCodes is true', () => {
      const customLocales = [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'French' },
      ]

      render(
        <TranslationProvider>
          <LocaleSwitcher locales={customLocales} showCodes />
        </TranslationProvider>
      )

      expect(screen.getByRole('option', { name: 'EN' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'FR' })).toBeInTheDocument()
    })
  })

  describe('locale selection', () => {
    it('displays current locale as selected', () => {
      const provider = createTestProvider('fr')

      render(
        <TranslationProvider i18nProvider={provider} locale="fr">
          <LocaleSwitcher />
        </TranslationProvider>
      )

      const select = screen.getByRole('combobox') as HTMLSelectElement
      expect(select.value).toBe('fr')
    })

    it('changes locale when selection changes', async () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <LocaleSwitcher />
        </TranslationProvider>
      )

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'fr' } })

      // After change, the select should reflect the new value
      // The state update is async due to changeLocale being a Promise
      await waitFor(() => {
        expect((select as HTMLSelectElement).value).toBe('fr')
      })
    })

    it('calls onLocaleChange callback', () => {
      const provider = createTestProvider()
      const onLocaleChange = vi.fn()

      render(
        <TranslationProvider i18nProvider={provider}>
          <LocaleSwitcher onLocaleChange={onLocaleChange} />
        </TranslationProvider>
      )

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'de' } })

      expect(onLocaleChange).toHaveBeenCalledWith('de')
    })
  })

  describe('size variants', () => {
    it('renders default size', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <LocaleSwitcher size="default" />
        </TranslationProvider>
      )

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('h-10')
    })

    it('renders small size', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <LocaleSwitcher size="sm" />
        </TranslationProvider>
      )

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('h-8')
    })

    it('renders large size', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <LocaleSwitcher size="lg" />
        </TranslationProvider>
      )

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('h-12')
    })
  })

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <LocaleSwitcher disabled />
        </TranslationProvider>
      )

      const select = screen.getByRole('combobox')
      expect(select).toBeDisabled()
    })

    it('is disabled when only one locale is available', () => {
      const customLocales = [{ locale: 'en', name: 'English' }]

      render(
        <TranslationProvider>
          <LocaleSwitcher locales={customLocales} />
        </TranslationProvider>
      )

      const select = screen.getByRole('combobox')
      expect(select).toBeDisabled()
    })
  })

  describe('without TranslationProvider', () => {
    it('renders with custom locales even without provider', () => {
      const customLocales = [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'French' },
      ]

      render(<LocaleSwitcher locales={customLocales} />)

      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    it('defaults to en locale without provider', () => {
      const customLocales = [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'French' },
      ]

      render(<LocaleSwitcher locales={customLocales} />)

      const select = screen.getByRole('combobox') as HTMLSelectElement
      expect(select.value).toBe('en')
    })
  })

  describe('accessibility', () => {
    it('has proper ARIA attributes', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <LocaleSwitcher aria-label="Language selection" />
        </TranslationProvider>
      )

      expect(screen.getByLabelText('Language selection')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <LocaleSwitcher className="custom-class" />
        </TranslationProvider>
      )

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('custom-class')
    })
  })
})
