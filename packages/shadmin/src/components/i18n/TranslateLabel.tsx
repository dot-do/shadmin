/**
 * TranslateLabel - Specialized component for translating field labels
 *
 * Provides a consistent way to translate form field labels with
 * automatic fallback and resource-aware key generation.
 */

import { type HTMLAttributes, forwardRef } from 'react'

import { cn } from '@/utils'

import { useResourceOptional } from '../../contexts/ResourceContext'
import { useTranslate } from '../../hooks/useTranslate'

export interface TranslateLabelProps extends HTMLAttributes<HTMLLabelElement> {
  /** The field source/name to generate translation key from */
  source?: string
  /** Direct translation key (overrides source-based key generation) */
  i18nKey?: string
  /** Resource name (defaults to current resource context) */
  resource?: string
  /** Default label if translation is not found */
  defaultLabel?: string
  /** Whether this label is for a required field */
  required?: boolean
  /** HTML for attribute linking to an input */
  htmlFor?: string
}

/**
 * Generate a translation key for a field label
 * Follows react-admin conventions: resources.{resource}.fields.{source}
 */
function generateLabelKey(
  source: string,
  resource?: string
): string {
  if (resource) {
    return `resources.${resource}.fields.${source}`
  }
  return `fields.${source}`
}

/**
 * Convert a source name to a human-readable label
 * e.g., "firstName" -> "First Name", "created_at" -> "Created At"
 */
function humanize(source: string): string {
  return source
    // Handle camelCase
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Handle snake_case
    .replace(/_/g, ' ')
    // Capitalize first letter of each word
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * TranslateLabel component for form field labels
 *
 * @example
 * ```tsx
 * // Basic usage with source (auto-generates key)
 * <TranslateLabel source="firstName" />
 * // Looks up: resources.{currentResource}.fields.firstName
 *
 * // With explicit resource
 * <TranslateLabel source="email" resource="users" />
 * // Looks up: resources.users.fields.email
 *
 * // With direct translation key
 * <TranslateLabel i18nKey="custom.label.key" />
 *
 * // With default label
 * <TranslateLabel source="customField" defaultLabel="My Custom Field" />
 *
 * // Required field indicator
 * <TranslateLabel source="name" required />
 *
 * // Linked to input
 * <TranslateLabel source="email" htmlFor="email-input" />
 * ```
 */
export const TranslateLabel = forwardRef<HTMLLabelElement, TranslateLabelProps>(
  (
    {
      source,
      i18nKey,
      resource: resourceProp,
      defaultLabel,
      required = false,
      className,
      htmlFor,
      children,
      ...props
    },
    ref
  ) => {
    const translate = useTranslate()
    const resourceContext = useResourceOptional()

    // Determine the resource name
    const resource = resourceProp ?? resourceContext ?? undefined

    // Determine the translation key
    let translationKey: string | undefined
    if (i18nKey) {
      translationKey = i18nKey
    } else if (source) {
      translationKey = generateLabelKey(source, resource)
    }

    // Get the translated label
    let label: string
    if (translationKey) {
      // Determine fallback: defaultLabel or humanized source
      const fallback = defaultLabel ?? (source ? humanize(source) : translationKey)
      label = translate(translationKey, { _: fallback })
    } else if (defaultLabel) {
      label = defaultLabel
    } else if (children && typeof children === 'string') {
      label = children
    } else {
      label = ''
    }

    // If children is provided as ReactNode (not string), render it
    if (children && typeof children !== 'string') {
      return (
        <label
          ref={ref}
          htmlFor={htmlFor}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            className
          )}
          {...props}
        >
          {children}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )
    }

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      >
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
    )
  }
)

TranslateLabel.displayName = 'TranslateLabel'
