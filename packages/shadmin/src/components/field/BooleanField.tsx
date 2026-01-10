import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../facade'

export interface BooleanFieldProps extends HTMLAttributes<HTMLSpanElement> {
  /** The field name in the record to display */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the value */
  label?: string
  /** Label to display when value is true (replaces icon) */
  valueLabelTrue?: string
  /** Label to display when value is false (replaces icon) */
  valueLabelFalse?: string
  /** CSS class for true icon color */
  trueIconColor?: string
  /** CSS class for false icon color */
  falseIconColor?: string
}

/**
 * CheckIcon component for true values
 */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/**
 * XIcon component for false values
 */
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

/**
 * BooleanField component displays a boolean value as a checkmark or x icon.
 *
 * @example
 * ```tsx
 * // Basic usage with RecordContext
 * <RecordContextProvider value={{ id: 1, active: true }}>
 *   <BooleanField source="active" />
 * </RecordContextProvider>
 *
 * // With custom labels
 * <BooleanField source="active" valueLabelTrue="Yes" valueLabelFalse="No" />
 *
 * // With custom icon colors
 * <BooleanField source="active" trueIconColor="text-green-500" falseIconColor="text-red-500" />
 * ```
 */
export function BooleanField({
  source,
  record: recordProp,
  label,
  valueLabelTrue,
  valueLabelFalse,
  trueIconColor = 'text-green-600',
  falseIconColor = 'text-red-600',
  className,
  ...rest
}: BooleanFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  const rawValue = get(record, source)

  // Convert source to valid CSS class name (replace dots with dashes)
  const sourceClass = `ra-field-${source.replace(/\./g, '-')}`

  // Handle null/undefined
  if (rawValue == null) {
    if (label) {
      return (
        <div className={cn('ra-field', sourceClass, className)} data-testid="shadmin-boolean-field" {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span /></p>
        </div>
      )
    }
    return <span className={cn('ra-field', sourceClass, className)} data-testid="shadmin-boolean-field" {...rest} />
  }

  // Determine boolean value
  let boolValue: boolean
  if (typeof rawValue === 'boolean') {
    boolValue = rawValue
  } else if (typeof rawValue === 'string') {
    boolValue = rawValue !== '' && rawValue.toLowerCase() !== 'false'
  } else if (typeof rawValue === 'number') {
    boolValue = rawValue !== 0
  } else {
    boolValue = Boolean(rawValue)
  }

  // Render with custom labels
  if (valueLabelTrue && valueLabelFalse) {
    if (label) {
      return (
        <div className={cn('ra-field', sourceClass, className)} data-testid="shadmin-boolean-field" {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <p><span>{boolValue ? valueLabelTrue : valueLabelFalse}</span></p>
        </div>
      )
    }
    return (
      <span className={cn('ra-field', sourceClass, className)} data-testid="shadmin-boolean-field" {...rest}>
        <p><span>{boolValue ? valueLabelTrue : valueLabelFalse}</span></p>
      </span>
    )
  }

  // Render with icons
  const icon = boolValue ? (
    <CheckIcon className={trueIconColor} />
  ) : (
    <XIcon className={falseIconColor} />
  )

  if (label) {
    return (
      <div className={cn('ra-field', sourceClass, className)} data-testid="shadmin-boolean-field" {...rest} aria-label={String(boolValue)}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <p><span className="inline-flex items-center">{icon}</span></p>
      </div>
    )
  }

  return (
    <span className={cn('ra-field', sourceClass, 'inline-flex items-center', className)} aria-label={String(boolValue)} data-testid="shadmin-boolean-field" {...rest}>
      <p><span>{icon}</span></p>
    </span>
  )
}

BooleanField.displayName = 'BooleanField'
