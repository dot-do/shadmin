import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  TranslationContext,
  TranslationProvider,
  useTranslationContext,
  useTranslationContextOptional,
  createDefaultI18nProvider,
  type I18nProvider,
} from './TranslationContext'

describe('TranslationContext', () => {
  describe('TranslationContext', () => {
    it('should export the React context', () => {
      expect(TranslationContext).toBeDefined()
    })
  })

  describe('TranslationProvider', () => {
    it('should provide translation context to children', () => {
      const Consumer = () => {
        const { locale } = useTranslationContext()
        return <div data-testid="locale">{locale}</div>
      }

      render(
        <TranslationProvider locale="en">
          <Consumer />
        </TranslationProvider>
      )

      expect(screen.getByTestId('locale')).toHaveTextContent('en')
    })

    it('should use custom i18n provider when provided', () => {
      const mockProvider: I18nProvider = {
        translate: vi.fn().mockReturnValue('translated'),
        changeLocale: vi.fn().mockResolvedValue(undefined),
        getLocale: vi.fn().mockReturnValue('fr'),
      }

      const Consumer = () => {
        const { i18nProvider, locale } = useTranslationContext()
        const result = i18nProvider.translate('test.key')
        return (
          <div>
            <span data-testid="result">{result}</span>
            <span data-testid="locale">{locale}</span>
          </div>
        )
      }

      render(
        <TranslationProvider i18nProvider={mockProvider}>
          <Consumer />
        </TranslationProvider>
      )

      expect(screen.getByTestId('result')).toHaveTextContent('translated')
      expect(screen.getByTestId('locale')).toHaveTextContent('fr')
      expect(mockProvider.translate).toHaveBeenCalledWith('test.key')
    })

    it('should allow changing locale', async () => {
      const user = userEvent.setup()

      const Consumer = () => {
        const { locale, setLocale } = useTranslationContext()
        return (
          <div>
            <span data-testid="locale">{locale}</span>
            <button onClick={() => setLocale('fr')}>Change to French</button>
          </div>
        )
      }

      render(
        <TranslationProvider locale="en">
          <Consumer />
        </TranslationProvider>
      )

      expect(screen.getByTestId('locale')).toHaveTextContent('en')

      await user.click(screen.getByText('Change to French'))

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('fr')
      })
    })
  })

  describe('useTranslationContext', () => {
    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useTranslationContext()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useTranslationContext must be used within a TranslationProvider'
      )
    })

    it('should provide i18nProvider with translate function', () => {
      const Consumer = () => {
        const { i18nProvider } = useTranslationContext()
        return <div data-testid="type">{typeof i18nProvider.translate}</div>
      }

      render(
        <TranslationProvider>
          <Consumer />
        </TranslationProvider>
      )

      expect(screen.getByTestId('type')).toHaveTextContent('function')
    })
  })

  describe('useTranslationContextOptional', () => {
    it('should return null when used outside provider', () => {
      const Consumer = () => {
        const context = useTranslationContextOptional()
        return <div data-testid="result">{context === null ? 'null' : 'defined'}</div>
      }

      render(<Consumer />)

      expect(screen.getByTestId('result')).toHaveTextContent('null')
    })

    it('should return context when inside provider', () => {
      const Consumer = () => {
        const context = useTranslationContextOptional()
        return <div data-testid="result">{context === null ? 'null' : 'defined'}</div>
      }

      render(
        <TranslationProvider>
          <Consumer />
        </TranslationProvider>
      )

      expect(screen.getByTestId('result')).toHaveTextContent('defined')
    })
  })

  describe('createDefaultI18nProvider', () => {
    it('should translate simple keys', () => {
      const messages = {
        en: {
          hello: 'Hello',
          'goodbye': 'Goodbye',
        },
      }

      const provider = createDefaultI18nProvider(messages, 'en')

      expect(provider.translate('hello')).toBe('Hello')
      expect(provider.translate('goodbye')).toBe('Goodbye')
    })

    it('should return key when translation not found', () => {
      const provider = createDefaultI18nProvider({}, 'en')

      expect(provider.translate('unknown.key')).toBe('unknown.key')
    })

    it('should return default value when provided and key not found', () => {
      const provider = createDefaultI18nProvider({}, 'en')

      expect(provider.translate('unknown.key', { _: 'Default' })).toBe('Default')
    })

    it('should support nested keys with dot notation', () => {
      const messages = {
        en: {
          resources: {
            users: {
              name: 'User |||| Users',
              fields: {
                name: 'Name',
                email: 'Email Address',
              },
            },
          },
        },
      }

      const provider = createDefaultI18nProvider(messages, 'en')

      expect(provider.translate('resources.users.fields.name')).toBe('Name')
      expect(provider.translate('resources.users.fields.email')).toBe('Email Address')
    })

    it('should support interpolation with {name} syntax', () => {
      const messages = {
        en: {
          greeting: 'Hello {name}!',
          welcome: 'Welcome to {app}, {name}!',
        },
      }

      const provider = createDefaultI18nProvider(messages, 'en')

      expect(provider.translate('greeting', { name: 'World' })).toBe('Hello World!')
      expect(provider.translate('welcome', { app: 'Shadmin', name: 'User' })).toBe(
        'Welcome to Shadmin, User!'
      )
    })

    it('should support interpolation with %{name} syntax', () => {
      const messages = {
        en: {
          greeting: 'Hello %{name}!',
          count: 'You have %{count} items',
        },
      }

      const provider = createDefaultI18nProvider(messages, 'en')

      expect(provider.translate('greeting', { name: 'World' })).toBe('Hello World!')
      expect(provider.translate('count', { count: 5 })).toBe('You have 5 items')
    })

    it('should support plural forms with |||| separator', () => {
      const messages = {
        en: {
          'items.count': 'One item |||| %{smart_count} items',
          'messages.count': '%{smart_count} message |||| %{smart_count} messages',
        },
      }

      const provider = createDefaultI18nProvider(messages, 'en')

      expect(provider.translate('items.count', { smart_count: 1 })).toBe('One item')
      expect(provider.translate('items.count', { smart_count: 5 })).toBe('5 items')
      expect(provider.translate('messages.count', { smart_count: 1 })).toBe('1 message')
      expect(provider.translate('messages.count', { smart_count: 10 })).toBe('10 messages')
    })

    it('should handle zero count as plural', () => {
      const messages = {
        en: {
          items: 'one item |||| {smart_count} items',
        },
      }

      const provider = createDefaultI18nProvider(messages, 'en')

      expect(provider.translate('items', { smart_count: 0 })).toBe('0 items')
    })

    it('should change locale', async () => {
      const messages = {
        en: { hello: 'Hello' },
        fr: { hello: 'Bonjour' },
      }

      const provider = createDefaultI18nProvider(messages, 'en')

      expect(provider.translate('hello')).toBe('Hello')
      expect(provider.getLocale()).toBe('en')

      await provider.changeLocale('fr')

      expect(provider.translate('hello')).toBe('Bonjour')
      expect(provider.getLocale()).toBe('fr')
    })

    it('should return available locales', () => {
      const messages = {
        en: { hello: 'Hello' },
        fr: { hello: 'Bonjour' },
        de: { hello: 'Hallo' },
      }

      const provider = createDefaultI18nProvider(messages, 'en')
      const locales = provider.getLocales?.()

      expect(locales).toEqual([
        { locale: 'en', name: 'en' },
        { locale: 'fr', name: 'fr' },
        { locale: 'de', name: 'de' },
      ])
    })

    it('should preserve unreplaced placeholders', () => {
      const messages = {
        en: {
          greeting: 'Hello {name}, you have {count} messages',
        },
      }

      const provider = createDefaultI18nProvider(messages, 'en')

      // Only provide partial values
      expect(provider.translate('greeting', { name: 'User' })).toBe(
        'Hello User, you have {count} messages'
      )
    })
  })
})
