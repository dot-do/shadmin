/**
 * TranslatableInputs Component
 * Wrapper for form inputs with translation support across multiple locales
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
  type ReactElement,
} from 'react'
import { cn } from '@/utils'

/**
 * Context value for TranslatableInputs
 */
export interface TranslatableInputsContextValue {
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
   * Get the source path for a field in the current locale
   */
  getSource: (source: string) => string
  /**
   * Get the label suffix for the current locale
   */
  getLabelSuffix: () => string
}

/**
 * TranslatableInputs context
 */
const TranslatableInputsContext = createContext<TranslatableInputsContextValue | undefined>(undefined)

TranslatableInputsContext.displayName = 'TranslatableInputsContext'

/**
 * Hook to access TranslatableInputs context
 */
export function useTranslatableInputsContext(): TranslatableInputsContextValue {
  const context = useContext(TranslatableInputsContext)
  if (!context) {
    throw new Error('useTranslatableInputsContext must be used within TranslatableInputs')
  }
  return context
}

/**
 * Hook to optionally access TranslatableInputs context
 */
export function useOptionalTranslatableInputsContext(): TranslatableInputsContextValue | undefined {
  return useContext(TranslatableInputsContext)
}

export interface TranslatableInputsProps {
  /**
   * Input components to display with translation support
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
   * Additional CSS class for the container
   */
  className?: string
  /**
   * Callback when locale changes
   */
  onLocaleChange?: (locale: string) => void
  /**
   * Whether to use tabs for locale selection
   * @default 'tabs'
   */
  selector?: 'tabs' | 'select'
  /**
   * Labels for each locale
   * @example { en: 'English', fr: 'French', de: 'German' }
   */
  localeLabels?: Record<string, string>
  /**
   * Gap between inputs
   * @default 'gap-4'
   */
  gap?: string
  /**
   * The field name pattern for translations
   * 'suffix' - field name becomes source_locale (e.g., title_en)
   * 'nested' - field name becomes locale.source (e.g., en.title)
   * @default 'suffix'
   */
  pattern?: 'suffix' | 'nested'
  /**
   * Whether to show all locales at once or just the selected one
   * @default false
   */
  fullWidth?: boolean
}

/**
 * TranslatableInputs - Wrapper for form inputs with translation support
 *
 * Renders input children with locale switching, allowing users to enter
 * translated content in different languages. The source field names are
 * automatically transformed based on the selected locale.
 *
 * @example
 * ```tsx
 * // Basic usage - creates fields like title_en, title_fr
 * <TranslatableInputs locales={['en', 'fr']}>
 *   <TextInput source="title" />
 *   <TextInput source="description" />
 * </TranslatableInputs>
 *
 * // With nested pattern - creates fields like en.title, fr.title
 * <TranslatableInputs locales={['en', 'fr']} pattern="nested">
 *   <TextInput source="title" />
 *   <TextInput source="description" />
 * </TranslatableInputs>
 *
 * // With custom locale labels
 * <TranslatableInputs
 *   locales={['en', 'fr', 'de']}
 *   localeLabels={{ en: 'English', fr: 'Francais', de: 'Deutsch' }}
 * >
 *   <TextInput source="name" />
 * </TranslatableInputs>
 *
 * // With select dropdown instead of tabs
 * <TranslatableInputs locales={['en', 'fr']} selector="select">
 *   <TextInput source="title" />
 * </TranslatableInputs>
 * ```
 */
export function TranslatableInputs({
  children,
  locales,
  defaultLocale,
  className,
  onLocaleChange,
  selector = 'tabs',
  localeLabels = {},
  gap = 'gap-4',
  pattern = 'suffix',
  fullWidth = false,
}: TranslatableInputsProps) {
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
      if (pattern === 'nested') {
        return `${selectedLocale}.${source}`
      }
      // Default: suffix pattern (e.g., title_en)
      return `${source}_${selectedLocale}`
    },
    [selectedLocale, pattern]
  )

  // Get label suffix for current locale
  const getLabelSuffix = useCallback(() => {
    return ` (${localeLabels[selectedLocale] || selectedLocale.toUpperCase()})`
  }, [selectedLocale, localeLabels])

  // Context value
  const contextValue = useMemo<TranslatableInputsContextValue>(
    () => ({
      selectedLocale,
      selectLocale,
      locales,
      defaultLocale: initialLocale,
      getSource,
      getLabelSuffix,
    }),
    [selectedLocale, selectLocale, locales, initialLocale, getSource, getLabelSuffix]
  )

  // Get locale display label
  const getLocaleLabel = (locale: string) => localeLabels[locale] || locale.toUpperCase()

  // Transform children to use locale-specific sources
  const transformChildren = (locale: string) => {
    const getLocalizedSource = (source: string) => {
      if (pattern === 'nested') {
        return `${locale}.${source}`
      }
      return `${source}_${locale}`
    }

    return Children.map(children, (child) => {
      if (!isValidElement(child)) return child

      const childProps = child.props as { source?: string; label?: string | false }
      if (childProps.source) {
        const newSource = getLocalizedSource(childProps.source)
        const baseLabel = childProps.label !== false ? (childProps.label || childProps.source) : false
        const newLabel = baseLabel !== false ? `${baseLabel} (${getLocaleLabel(locale)})` : false

        return cloneElement(child as ReactElement<{ source: string; label: string | false }>, {
          source: newSource,
          label: newLabel,
        })
      }

      return cloneElement(child as ReactElement<Record<string, unknown>>)
    })
  }

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

  // If fullWidth, show all locales side by side
  if (fullWidth) {
    return (
      <TranslatableInputsContext.Provider value={contextValue}>
        <div data-slot="translatable-inputs" className={cn('space-y-4', className)}>
          <div className={cn('grid', `grid-cols-${locales.length}`, 'gap-4')}>
            {locales.map((locale) => (
              <div key={locale} className={cn('flex flex-col', gap)}>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {getLocaleLabel(locale)}
                </div>
                {transformChildren(locale)}
              </div>
            ))}
          </div>
        </div>
      </TranslatableInputsContext.Provider>
    )
  }

  return (
    <TranslatableInputsContext.Provider value={contextValue}>
      <div data-slot="translatable-inputs" className={cn('space-y-4', className)}>
        {/* Locale Selector */}
        <div className="flex justify-end">
          {renderSelector()}
        </div>

        {/* Inputs for selected locale */}
        <div className={cn('flex flex-col', gap)}>
          {transformChildren(selectedLocale)}
        </div>
      </div>
    </TranslatableInputsContext.Provider>
  )
}

TranslatableInputs.displayName = 'TranslatableInputs'
