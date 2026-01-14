/**
 * Unit tests for Translate component
 */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Translate } from './Translate'
import {
  TranslationProvider,
  createDefaultI18nProvider,
} from '../../contexts/TranslationContext'

const messages = {
  en: {
    hello: 'Hello',
    greeting: 'Hello, %{name}!',
    'welcome.message': 'Welcome to our app',
    'items.count': 'one item |||| %{smart_count} items',
    nested: {
      deep: {
        key: 'Deeply nested value',
      },
    },
  },
  fr: {
    hello: 'Bonjour',
    greeting: 'Bonjour, %{name} !',
  },
}

function createTestProvider(locale = 'en') {
  return createDefaultI18nProvider(messages, locale)
}

describe('Translate', () => {
  describe('basic translation', () => {
    it('translates a simple key', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="hello" />
        </TranslationProvider>
      )

      expect(screen.getByText('Hello')).toBeInTheDocument()
    })

    it('returns key if translation is not found', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="unknown.key" />
        </TranslationProvider>
      )

      expect(screen.getByText('unknown.key')).toBeInTheDocument()
    })

    it('uses default value when key is not found', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="missing.key" defaultValue="Fallback text" />
        </TranslationProvider>
      )

      expect(screen.getByText('Fallback text')).toBeInTheDocument()
    })

    it('translates keys with dots', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="welcome.message" />
        </TranslationProvider>
      )

      expect(screen.getByText('Welcome to our app')).toBeInTheDocument()
    })

    it('translates nested keys', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="nested.deep.key" />
        </TranslationProvider>
      )

      expect(screen.getByText('Deeply nested value')).toBeInTheDocument()
    })
  })

  describe('interpolation', () => {
    it('interpolates values', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="greeting" values={{ name: 'World' }} />
        </TranslationProvider>
      )

      expect(screen.getByText('Hello, World!')).toBeInTheDocument()
    })

    it('handles missing interpolation values', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="greeting" />
        </TranslationProvider>
      )

      expect(screen.getByText('Hello, %{name}!')).toBeInTheDocument()
    })
  })

  describe('pluralization', () => {
    it('uses singular form for count of 1', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="items.count" count={1} />
        </TranslationProvider>
      )

      expect(screen.getByText('one item')).toBeInTheDocument()
    })

    it('uses plural form for count greater than 1', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="items.count" count={5} />
        </TranslationProvider>
      )

      expect(screen.getByText('5 items')).toBeInTheDocument()
    })

    it('uses plural form for count of 0', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="items.count" count={0} />
        </TranslationProvider>
      )

      expect(screen.getByText('0 items')).toBeInTheDocument()
    })
  })

  describe('wrapper element', () => {
    it('wraps translation in specified element', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="hello" as="h1" />
        </TranslationProvider>
      )

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Hello')
    })

    it('applies className to wrapper element', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="hello" as="span" className="custom-class" />
        </TranslationProvider>
      )

      const element = screen.getByText('Hello')
      expect(element.tagName).toBe('SPAN')
      expect(element).toHaveClass('custom-class')
    })

    it('renders as different HTML elements', () => {
      const provider = createTestProvider()

      const { container } = render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="hello" as="p" />
        </TranslationProvider>
      )

      expect(container.querySelector('p')).toHaveTextContent('Hello')
    })
  })

  describe('render function', () => {
    it('passes translation to render function', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="hello">
            {(text) => <div data-testid="custom">{text.toUpperCase()}</div>}
          </Translate>
        </TranslationProvider>
      )

      expect(screen.getByTestId('custom')).toHaveTextContent('HELLO')
    })

    it('render function receives interpolated text', () => {
      const provider = createTestProvider()

      render(
        <TranslationProvider i18nProvider={provider}>
          <Translate i18nKey="greeting" values={{ name: 'Test' }}>
            {(text) => <span>{text}</span>}
          </Translate>
        </TranslationProvider>
      )

      expect(screen.getByText('Hello, Test!')).toBeInTheDocument()
    })
  })

  describe('different locales', () => {
    it('translates according to current locale', () => {
      const provider = createTestProvider('fr')

      render(
        <TranslationProvider i18nProvider={provider} locale="fr">
          <Translate i18nKey="hello" />
        </TranslationProvider>
      )

      expect(screen.getByText('Bonjour')).toBeInTheDocument()
    })

    it('interpolates in different locale', () => {
      const provider = createTestProvider('fr')

      render(
        <TranslationProvider i18nProvider={provider} locale="fr">
          <Translate i18nKey="greeting" values={{ name: 'Marie' }} />
        </TranslationProvider>
      )

      expect(screen.getByText('Bonjour, Marie !')).toBeInTheDocument()
    })
  })

  describe('without TranslationProvider', () => {
    it('returns key when no provider is present', () => {
      render(<Translate i18nKey="hello" />)

      expect(screen.getByText('hello')).toBeInTheDocument()
    })

    it('returns default value when no provider is present', () => {
      render(<Translate i18nKey="hello" defaultValue="Default Hello" />)

      expect(screen.getByText('Default Hello')).toBeInTheDocument()
    })
  })
})
