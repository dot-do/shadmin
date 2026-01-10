/**
 * TranslatableFields Component
 * Wrapper for displaying translatable field values with locale switching
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext, RecordContextProvider } from '../../contexts/RecordContext'
import type { RaRecord } from '../../facade'

/**
 * Context value for TranslatableFields
 */
export interface TranslatableFieldsContextValue {
  /**
   * Currently selected locale
   */
  selectedLocale: string
  /**
   * Set the selected locale
   */
  selectLocale: (locale: string) => void
  /**
   * All available locales
   */
  locales: string[]
  /**
   * Default locale
   */
  defaultLocale: string
  /**
   * Get the field value for the current locale
   */
  getSource: (source: string) => string
}

/**
 * TranslatableFields context
 */
const TranslatableFieldsContext = createContext<TranslatableFieldsContextValue | undefined>(undefined)

TranslatableFieldsContext.displayName = 'TranslatableFieldsContext'

/**
 * Hook to access TranslatableFields context
 */
export function useTranslatableFieldsContext(): TranslatableFieldsContextValue {
  const context = useContext(TranslatableFieldsContext)
  if (!context) {
    throw new Error('useTranslatableFieldsContext must be used within TranslatableFields')
  }
  return context
}

/**
 * Hook to optionally access TranslatableFields context
 */
export function useOptionalTranslatableFieldsContext(): TranslatableFieldsContextValue | undefined {
  return useContext(TranslatableFieldsContext)
}

export interface TranslatableFieldsProps {
  /**
   * Field components to display with translation support
   */
  children?: ReactNode
  /**
   * Available locales
   * @example ['en', 'fr', 'de']
   */
  locales: string[]
  /**
   * Default locale to display
   * @default first locale in the array
   */
  defaultLocale?: string
  /**
   * Optional record to use instead of RecordContext
   */
  record?: RaRecord
  /**
   * Additional CSS class for the container
   */
  className?: string
  /**
   * Callback when locale changes
   */
  onLocaleChange?: (locale: string) => void
  /**
   * Whether to use tabs for locale selection
   * @default true
   */
  selector?: 'tabs' | 'select'
  /**
   * Labels for each locale
   * @example { en: 'English', fr: 'French', de: 'German' }
   */
  localeLabels?: Record<string, string>
  /**
   * Gap between fields
   * @default 'gap-4'
   */
  gap?: string
  /**
   * The field name containing translations (for grouped translations)
   * If set, translations are expected at record[groupKey][locale][source]
   * If not set, translations are expected at record[source + locale] or record[locale][source]
   */
  groupKey?: string
}

/**
 * TranslatableFields - Wrapper for displaying fields with translation support
 *
 * Renders field children with locale switching, allowing users to view
 * translated content in different languages.
 *
 * @example
 * ```tsx
 * // Basic usage - translations at record.title_en, record.title_fr
 * <TranslatableFields locales={['en', 'fr']}>
 *   <TextField source="title" />
 *   <TextField source="description" />
 * </TranslatableFields>
 *
 * // With grouped translations - record.translations.en.title
 * <TranslatableFields locales={['en', 'fr']} groupKey="translations">
 *   <TextField source="title" />
 *   <TextField source="description" />
 * </TranslatableFields>
 *
 * // With custom locale labels
 * <TranslatableFields
 *   locales={['en', 'fr', 'de']}
 *   localeLabels={{ en: 'English', fr: 'Francais', de: 'Deutsch' }}
 * >
 *   <TextField source="name" />
 * </TranslatableFields>
 *
 * // With select dropdown instead of tabs
 * <TranslatableFields locales={['en', 'fr']} selector="select">
 *   <TextField source="title" />
 * </TranslatableFields>
 * ```
 */
export function TranslatableFields({
  children,
  locales,
  defaultLocale,
  record: recordProp,
  className,
  onLocaleChange,
  selector = 'tabs',
  localeLabels = {},
  gap = 'gap-4',
  groupKey,
}: TranslatableFieldsProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  const initialLocale = defaultLocale || locales[0] || 'en'
  const [selectedLocale, setSelectedLocaleState] = useState(initialLocale)

  // Handle locale change
  const selectLocale = useCallback(
    (locale: string) => {
      setSelectedLocaleState(locale)
      onLocaleChange?.(locale)
    },
    [onLocaleChange]
  )

  // Get the source path for the current locale
  const getSource = useCallback(
    (source: string) => {
      if (groupKey) {
        // Grouped: record[groupKey][locale][source]
        return `${groupKey}.${selectedLocale}.${source}`
      }
      // Default: try record[source_locale] pattern (e.g., title_en)
      return `${source}_${selectedLocale}`
    },
    [selectedLocale, groupKey]
  )

  // Create a virtual record with translated values for the current locale
  const translatedRecord = useMemo(() => {
    if (!record) return undefined

    // Clone the record
    const result = { ...record }

    // If using groupKey, extract values from the locale group
    if (groupKey) {
      const localeData = get(record, `${groupKey}.${selectedLocale}`) as Record<string, unknown> | undefined
      if (localeData) {
        Object.entries(localeData).forEach(([key, value]) => {
          result[key] = value
        })
      }
    } else {
      // Extract values from source_locale pattern
      Object.entries(record).forEach(([key, value]) => {
        const localeSuffix = `_${selectedLocale}`
        if (key.endsWith(localeSuffix)) {
          const baseKey = key.slice(0, -localeSuffix.length)
          result[baseKey] = value
        }
      })
    }

    return result as RaRecord
  }, [record, selectedLocale, groupKey])

  // Context value
  const contextValue = useMemo<TranslatableFieldsContextValue>(
    () => ({
      selectedLocale,
      selectLocale,
      locales,
      defaultLocale: initialLocale,
      getSource,
    }),
    [selectedLocale, selectLocale, locales, initialLocale, getSource]
  )

  // Don't render if no record
  if (!record) {
    return null
  }

  // Get locale display label
  const getLocaleLabel = (locale: string) => localeLabels[locale] || locale.toUpperCase()

  // Render locale selector
  const renderSelector = () => {
    if (selector === 'select') {
      return (
        <select
          value={selectedLocale}
          onChange={(e) => selectLocale(e.target.value)}
          className={cn(
            'flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm',
            'ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        >
          {locales.map((locale) => (
            <option key={locale} value={locale}>
              {getLocaleLabel(locale)}
            </option>
          ))}
        </select>
      )
    }

    // Default: tabs
    return (
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="inline-flex h-9 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground"
      >
        {locales.map((locale) => {
          const isActive = selectedLocale === locale

          return (
            <button
              key={locale}
              role="tab"
              type="button"
              aria-selected={isActive}
              data-state={isActive ? 'active' : 'inactive'}
              onClick={() => selectLocale(locale)}
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'hover:bg-background/50'
              )}
            >
              {getLocaleLabel(locale)}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <TranslatableFieldsContext.Provider value={contextValue}>
      <div data-slot="translatable-fields" className={cn('space-y-4', className)}>
        {/* Locale Selector */}
        <div className="flex justify-end">
          {renderSelector()}
        </div>

        {/* Fields with translated record context */}
        <RecordContextProvider value={translatedRecord}>
          <div className={cn('flex flex-col', gap)}>
            {Children.map(children, (child) => {
              if (isValidElement(child)) {
                return cloneElement(child)
              }
              return child
            })}
          </div>
        </RecordContextProvider>
      </div>
    </TranslatableFieldsContext.Provider>
  )
}

TranslatableFields.displayName = 'TranslatableFields'
