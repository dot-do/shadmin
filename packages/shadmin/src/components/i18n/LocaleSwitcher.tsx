/**
 * LocaleSwitcher - Dropdown component to change the application locale
 *
 * Provides a user-friendly interface for switching between available locales.
 * Integrates with the TranslationContext to get available locales and change the current one.
 */

import { forwardRef, type SelectHTMLAttributes } from 'react'

import { cn } from '@/utils'

import {
  useTranslationContextOptional,
} from '../../contexts/TranslationContext'

export interface LocaleSwitcherProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value' | 'size'> {
  /** Override available locales (defaults to those from i18nProvider) */
  locales?: { locale: string; name: string }[]
  /** Custom label for the select element */
  label?: string
  /** Custom onChange handler (called with the new locale string) */
  onLocaleChange?: (locale: string) => void
  /** Show locale codes instead of names */
  showCodes?: boolean
  /** Size variant */
  size?: 'default' | 'sm' | 'lg'
}

const sizeStyles = {
  default: 'h-10 px-3 py-2 text-sm',
  sm: 'h-8 px-2 py-1 text-xs',
  lg: 'h-12 px-4 py-3 text-base',
}

/**
 * LocaleSwitcher component for changing the application locale
 *
 * @example
 * ```tsx
 * // Basic usage - uses locales from i18nProvider
 * <LocaleSwitcher />
 *
 * // With custom locales
 * <LocaleSwitcher
 *   locales={[
 *     { locale: 'en', name: 'English' },
 *     { locale: 'fr', name: 'French' },
 *     { locale: 'es', name: 'Spanish' },
 *   ]}
 * />
 *
 * // With custom handler
 * <LocaleSwitcher onLocaleChange={(locale) => console.log('Changed to', locale)} />
 * ```
 */
export const LocaleSwitcher = forwardRef<HTMLSelectElement, LocaleSwitcherProps>(
  (
    {
      className,
      locales: customLocales,
      label,
      onLocaleChange,
      showCodes = false,
      size = 'default',
      disabled,
      ...props
    },
    ref
  ) => {
    const context = useTranslationContextOptional()

    // Get available locales from provider or use custom ones
    const availableLocales =
      customLocales ?? context?.i18nProvider.getLocales?.() ?? []

    // Get current locale
    const currentLocale = context?.locale ?? 'en'

    // Handle locale change
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLocale = e.target.value
      if (context) {
        context.setLocale(newLocale)
      }
      onLocaleChange?.(newLocale)
    }

    // If no locales available, don't render anything
    if (availableLocales.length === 0) {
      return null
    }

    // If only one locale, show it but disable the select
    const isDisabled = disabled || availableLocales.length <= 1

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <select
          ref={ref}
          value={currentLocale}
          onChange={handleChange}
          disabled={isDisabled}
          className={cn(
            'rounded-md border border-input bg-background text-foreground',
            'ring-offset-background transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            sizeStyles[size],
            className
          )}
          {...props}
        >
          {availableLocales.map(({ locale, name }) => (
            <option key={locale} value={locale}>
              {showCodes ? locale.toUpperCase() : name}
            </option>
          ))}
        </select>
      </div>
    )
  }
)

LocaleSwitcher.displayName = 'LocaleSwitcher'
