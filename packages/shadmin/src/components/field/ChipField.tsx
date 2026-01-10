import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../facade'

export interface ChipFieldProps extends HTMLAttributes<HTMLSpanElement> {
  /** The field name in the record to display */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the value */
  label?: string
  /**
   * Text to display when value is empty/null/undefined.
   * - string: Display that string
   * - true: Display default empty text
   * - false | undefined: Display nothing
   */
  emptyText?: string | boolean
  /** Visual variant of the chip */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  /** Size of the chip */
  size?: 'sm' | 'small' | 'default' | 'lg'
  /** Whether the chip should appear clickable/interactive */
  clickable?: boolean
}

/**
 * ChipField component displays a value as a badge/chip.
 *
 * @example
 * ```tsx
 * // Basic usage with RecordContext
 * <RecordContextProvider value={{ id: 1, status: 'active' }}>
 *   <ChipField source="status" />
 * </RecordContextProvider>
 *
 * // With variant
 * <ChipField source="status" variant="secondary" />
 *
 * // With label
 * <ChipField source="status" label="Status" />
 *
 * // Small size
 * <ChipField source="tag" size="sm" />
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function ChipField({
  source,
  record: recordProp,
  label,
  emptyText,
  variant = 'default',
  size = 'default',
  clickable,
  className,
  ...rest
}: ChipFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Resolve emptyText: false/undefined = '', true = default, string = as-is
  const resolvedEmptyText =
    emptyText === false || emptyText === undefined
      ? ''
      : emptyText === true
        ? DEFAULT_EMPTY_TEXT
        : emptyText

  const value = get(record, source)
  const displayValue = value == null ? resolvedEmptyText : String(value)

  const isEmpty = value == null || value === ''

  // Convert source to valid CSS class name (replace dots with dashes)
  const sourceClass = `ra-field-${source.replace(/\./g, '-')}`

  // Variant styles
  const variantStyles = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'border border-input bg-background text-foreground',
  }

  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    small: 'text-xs px-2 py-0.5',
    default: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  }

  const chipClasses = cn(
    'inline-flex items-center rounded-full font-medium',
    variantStyles[variant],
    sizeStyles[size],
    clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
    className
  )

  if (isEmpty && !resolvedEmptyText) {
    return label ? (
      <div className={cn('ra-field', sourceClass)}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <p><span /></p>
      </div>
    ) : null
  }

  if (label) {
    return (
      <div className={cn('ra-field', sourceClass)}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <p><span className={chipClasses} {...rest}>
          {displayValue}
        </span></p>
      </div>
    )
  }

  return (
    <span className={cn('ra-field', sourceClass)}>
      <p><span className={chipClasses} {...rest}>
        {displayValue}
      </span></p>
    </span>
  )
}

ChipField.displayName = 'ChipField'
