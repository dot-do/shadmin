/**
 * TranslationContext - i18n provider abstraction
 * 100% API-compatible with react-admin's i18n system
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

/**
 * Translation options for interpolation and pluralization
 */
export interface TranslateOptions {
  /** Default value if key is not found */
  _?: string
  /** Count for pluralization */
  smart_count?: number
  /** Dynamic values for interpolation */
  [key: string]: string | number | undefined
}

/**
 * Translate function signature - matches react-admin
 */
export type TranslateFunction = (
  key: string,
  options?: TranslateOptions
) => string

/**
 * Translation messages structure
 * Supports nested keys via dot notation or nested objects
 */
export type TranslationMessages = {
  [key: string]: string | TranslationMessages
}

/**
 * I18n provider interface - matches react-admin
 */
export interface I18nProvider {
  translate: TranslateFunction
  changeLocale: (locale: string) => Promise<void>
  getLocale: () => string
  getLocales?: () => { locale: string; name: string }[]
}

/**
 * Context value interface
 */
export interface TranslationContextValue {
  locale: string
  setLocale: (locale: string) => void
  i18nProvider: I18nProvider
}

export const TranslationContext = createContext<TranslationContextValue | null>(null)

export interface TranslationProviderProps {
  children: ReactNode
  /** Custom i18n provider */
  i18nProvider?: I18nProvider
  /** Default locale */
  locale?: string
}

/**
 * Get a value from a translation messages object
 * First tries exact key match, then falls back to nested key lookup using dot notation
 */
const getNestedValue = (obj: TranslationMessages, path: string): string | undefined => {
  // First try direct key lookup (for keys with dots in them like 'items.count')
  const directValue = obj[path]
  if (typeof directValue === 'string') {
    return directValue
  }

  // Then try nested lookup
  const keys = path.split('.')
  let current: string | TranslationMessages | undefined = obj

  for (const key of keys) {
    if (current === undefined || typeof current === 'string') {
      return undefined
    }
    current = current[key]
  }

  return typeof current === 'string' ? current : undefined
}


/**
 * Handle plural forms
 * Supports syntax: "one item |||| %{smart_count} items"
 */
const pluralize = (str: string, count: number | undefined): string => {
  if (count === undefined) {
    const firstForm = str.split('||||')[0]
    return firstForm?.trim() ?? str
  }

  const forms = str.split('||||').map(s => s.trim())

  if (forms.length === 1) {
    return forms[0] ?? str
  }

  // Simple plural logic: use first form for 1, second form for everything else
  return count === 1 ? (forms[0] ?? str) : (forms[1] ?? forms[0] ?? str)
}

/**
 * Create a default i18n provider with basic functionality
 */
export const createDefaultI18nProvider = (
  messages: Record<string, TranslationMessages> = {},
  defaultLocale: string = 'en'
): I18nProvider => {
  let currentLocale = defaultLocale

  const translate: TranslateFunction = (key, options = {}) => {
    const localeMessages = messages[currentLocale] || {}
    let translation = getNestedValue(localeMessages, key)

    if (translation === undefined) {
      // Fall back to default value or key
      return options._ ?? key
    }

    // Handle pluralization
    translation = pluralize(translation, options.smart_count)

    // Handle interpolation - replace %{key} and {key} syntax
    translation = translation.replace(/%?\{(\w+)\}/g, (match, varKey) => {
      const value = options[varKey]
      return value !== undefined ? String(value) : match
    })

    return translation
  }

  const changeLocale = async (locale: string): Promise<void> => {
    currentLocale = locale
  }

  const getLocale = (): string => {
    return currentLocale
  }

  const getLocales = (): { locale: string; name: string }[] => {
    return Object.keys(messages).map(locale => ({
      locale,
      name: locale,
    }))
  }

  return {
    translate,
    changeLocale,
    getLocale,
    getLocales,
  }
}

/**
 * TranslationProvider component
 * Provides i18n functionality to the application
 */
export function TranslationProvider({
  children,
  i18nProvider,
  locale: initialLocale = 'en',
}: TranslationProviderProps) {
  const defaultProvider = useMemo(
    () => createDefaultI18nProvider({}, initialLocale),
    [initialLocale]
  )

  const provider = i18nProvider ?? defaultProvider

  const [locale, setLocaleState] = useState<string>(
    provider.getLocale?.() ?? initialLocale
  )

  const setLocale = useCallback(
    (newLocale: string) => {
      provider.changeLocale(newLocale).then(() => {
        setLocaleState(newLocale)
      })
    },
    [provider]
  )

  const value = useMemo(
    (): TranslationContextValue => ({
      locale,
      setLocale,
      i18nProvider: provider,
    }),
    [locale, setLocale, provider]
  )

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

/**
 * Hook to access translation context
 * @throws Error if used outside of TranslationProvider
 */
export function useTranslationContext(): TranslationContextValue {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslationContext must be used within a TranslationProvider')
  }
  return context
}

/**
 * Hook to optionally access translation context (may return null)
 */
export function useTranslationContextOptional(): TranslationContextValue | null {
  return useContext(TranslationContext)
}
