import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTranslate } from './useTranslate'
import { useLocale } from './useLocale'
import {
  TranslationProvider,
  createDefaultI18nProvider,
  type I18nProvider,
} from '../contexts/TranslationContext'

describe('useTranslate', () => {
  it('should return a translate function', () => {
    const Consumer = () => {
      const translate = useTranslate()
      return <div data-testid="type">{typeof translate}</div>
    }

    render(
      <TranslationProvider>
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('type')).toHaveTextContent('function')
  })

  it('should translate keys to localized strings', () => {
    const messages = {
      en: {
        hello: 'Hello World',
        goodbye: 'Goodbye',
      },
    }
    const i18nProvider = createDefaultI18nProvider(messages, 'en')

    const Consumer = () => {
      const translate = useTranslate()
      return (
        <div>
          <span data-testid="hello">{translate('hello')}</span>
          <span data-testid="goodbye">{translate('goodbye')}</span>
        </div>
      )
    }

    render(
      <TranslationProvider i18nProvider={i18nProvider}>
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('hello')).toHaveTextContent('Hello World')
    expect(screen.getByTestId('goodbye')).toHaveTextContent('Goodbye')
  })

  it('should return key when translation not found', () => {
    const Consumer = () => {
      const translate = useTranslate()
      return <div data-testid="result">{translate('unknown.key')}</div>
    }

    render(
      <TranslationProvider>
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('result')).toHaveTextContent('unknown.key')
  })

  it('should return default value when provided', () => {
    const Consumer = () => {
      const translate = useTranslate()
      return (
        <div data-testid="result">
          {translate('unknown.key', { _: 'Default Value' })}
        </div>
      )
    }

    render(
      <TranslationProvider>
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('result')).toHaveTextContent('Default Value')
  })

  it('should support interpolation', () => {
    const messages = {
      en: {
        greeting: 'Hello {name}, welcome to {app}!',
      },
    }
    const i18nProvider = createDefaultI18nProvider(messages, 'en')

    const Consumer = () => {
      const translate = useTranslate()
      return (
        <div data-testid="result">
          {translate('greeting', { name: 'John', app: 'Shadmin' })}
        </div>
      )
    }

    render(
      <TranslationProvider i18nProvider={i18nProvider}>
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('result')).toHaveTextContent(
      'Hello John, welcome to Shadmin!'
    )
  })

  it('should support plural forms', () => {
    const messages = {
      en: {
        items: '{smart_count} item |||| {smart_count} items',
      },
    }
    const i18nProvider = createDefaultI18nProvider(messages, 'en')

    const Consumer = () => {
      const translate = useTranslate()
      return (
        <div>
          <span data-testid="single">{translate('items', { smart_count: 1 })}</span>
          <span data-testid="plural">{translate('items', { smart_count: 5 })}</span>
        </div>
      )
    }

    render(
      <TranslationProvider i18nProvider={i18nProvider}>
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('single')).toHaveTextContent('1 item')
    expect(screen.getByTestId('plural')).toHaveTextContent('5 items')
  })

  it('should work without provider and return key', () => {
    const Consumer = () => {
      const translate = useTranslate()
      return <div data-testid="result">{translate('some.key')}</div>
    }

    render(<Consumer />)

    expect(screen.getByTestId('result')).toHaveTextContent('some.key')
  })

  it('should work without provider and return default value', () => {
    const Consumer = () => {
      const translate = useTranslate()
      return (
        <div data-testid="result">
          {translate('some.key', { _: 'Fallback' })}
        </div>
      )
    }

    render(<Consumer />)

    expect(screen.getByTestId('result')).toHaveTextContent('Fallback')
  })

  it('should support nested keys', () => {
    const messages = {
      en: {
        resources: {
          users: {
            name: 'User |||| Users',
            fields: {
              firstName: 'First Name',
              lastName: 'Last Name',
            },
          },
        },
      },
    }
    const i18nProvider = createDefaultI18nProvider(messages, 'en')

    const Consumer = () => {
      const translate = useTranslate()
      return (
        <div>
          <span data-testid="name">
            {translate('resources.users.name', { smart_count: 2 })}
          </span>
          <span data-testid="firstName">
            {translate('resources.users.fields.firstName')}
          </span>
        </div>
      )
    }

    render(
      <TranslationProvider i18nProvider={i18nProvider}>
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('name')).toHaveTextContent('Users')
    expect(screen.getByTestId('firstName')).toHaveTextContent('First Name')
  })
})

describe('useLocale', () => {
  it('should return current locale', () => {
    const Consumer = () => {
      const { locale } = useLocale()
      return <div data-testid="locale">{locale}</div>
    }

    render(
      <TranslationProvider locale="fr">
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('locale')).toHaveTextContent('fr')
  })

  it('should return changeLocale function', () => {
    const Consumer = () => {
      const { changeLocale } = useLocale()
      return <div data-testid="type">{typeof changeLocale}</div>
    }

    render(
      <TranslationProvider>
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('type')).toHaveTextContent('function')
  })

  it('should change locale when changeLocale is called', async () => {
    const user = userEvent.setup()

    const Consumer = () => {
      const { locale, changeLocale } = useLocale()
      return (
        <div>
          <span data-testid="locale">{locale}</span>
          <button onClick={() => changeLocale('de')}>Change to German</button>
        </div>
      )
    }

    render(
      <TranslationProvider locale="en">
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('locale')).toHaveTextContent('en')

    await user.click(screen.getByText('Change to German'))

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('de')
    })
  })

  it('should return default locale when used outside provider', () => {
    const Consumer = () => {
      const { locale } = useLocale()
      return <div data-testid="locale">{locale}</div>
    }

    render(<Consumer />)

    expect(screen.getByTestId('locale')).toHaveTextContent('en')
  })

  it('should not throw when changeLocale is called outside provider', () => {
    const Consumer = () => {
      const { changeLocale } = useLocale()
      return <button onClick={() => changeLocale('fr')}>Change</button>
    }

    render(<Consumer />)

    // Should not throw
    expect(() => screen.getByText('Change').click()).not.toThrow()
  })

  it('should update translations when locale changes', async () => {
    const user = userEvent.setup()

    const messages = {
      en: { greeting: 'Hello' },
      fr: { greeting: 'Bonjour' },
    }
    const i18nProvider = createDefaultI18nProvider(messages, 'en')

    const Consumer = () => {
      const translate = useTranslate()
      const { locale, changeLocale } = useLocale()
      return (
        <div>
          <span data-testid="locale">{locale}</span>
          <span data-testid="greeting">{translate('greeting')}</span>
          <button onClick={() => changeLocale('fr')}>Switch to French</button>
        </div>
      )
    }

    render(
      <TranslationProvider i18nProvider={i18nProvider}>
        <Consumer />
      </TranslationProvider>
    )

    expect(screen.getByTestId('locale')).toHaveTextContent('en')
    expect(screen.getByTestId('greeting')).toHaveTextContent('Hello')

    await user.click(screen.getByText('Switch to French'))

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('fr')
      expect(screen.getByTestId('greeting')).toHaveTextContent('Bonjour')
    })
  })
})
