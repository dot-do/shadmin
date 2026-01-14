/**
 * Translate - Component wrapper for translations
 *
 * A declarative way to render translated strings in JSX.
 * Supports interpolation and pluralization.
 */

import { type ReactNode, createElement, type JSX } from 'react'

import { useTranslate } from '../../hooks/useTranslate'

import type { TranslateOptions } from '../../contexts/TranslationContext'

export interface TranslateProps {
  /** Translation key */
  i18nKey: string
  /** Default value if key is not found */
  defaultValue?: string
  /** Count for pluralization */
  count?: number
  /** Dynamic values for interpolation */
  values?: Record<string, string | number>
  /** Render function for custom rendering (receives translated string) */
  children?: (translation: string) => ReactNode
  /** HTML element to wrap the translation in */
  as?: keyof JSX.IntrinsicElements
  /** Class name for the wrapper element */
  className?: string
}

/**
 * Translate component for declarative translations
 *
 * @example
 * ```tsx
 * // Simple translation
 * <Translate i18nKey="hello" />
 *
 * // With default value
 * <Translate i18nKey="greeting" defaultValue="Hello there!" />
 *
 * // With interpolation
 * <Translate
 *   i18nKey="welcome"
 *   values={{ name: 'John' }}
 * />
 *
 * // With pluralization
 * <Translate
 *   i18nKey="items.count"
 *   count={5}
 * />
 *
 * // With custom wrapper element
 * <Translate i18nKey="title" as="h1" className="text-2xl font-bold" />
 *
 * // With render function
 * <Translate i18nKey="description">
 *   {(text) => <p className="text-muted-foreground">{text}</p>}
 * </Translate>
 * ```
 */
export function Translate({
  i18nKey,
  defaultValue,
  count,
  values,
  children,
  as: Component,
  className,
}: TranslateProps): ReactNode {
  const translate = useTranslate()

  // Build translation options
  const options: TranslateOptions = {
    ...values,
  }

  // Add default value if provided
  if (defaultValue !== undefined) {
    options._ = defaultValue
  }

  // Add smart_count for pluralization if count is provided
  if (count !== undefined) {
    options.smart_count = count
  }

  // Get the translation
  const translation = translate(i18nKey, options)

  // If children is a render function, use it
  if (typeof children === 'function') {
    return children(translation)
  }

  // If a wrapper element is specified, use it
  if (Component) {
    return createElement(Component, { className }, translation)
  }

  // Return the translation as-is
  return translation
}

Translate.displayName = 'Translate'
