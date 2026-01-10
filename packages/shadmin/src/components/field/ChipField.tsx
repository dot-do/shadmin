import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

export interface ChipFieldProps extends HTMLAttributes<HTMLSpanElement> {
  /** The field name in the record to display */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the value */
  label?: string
  /** Text to display when value is empty/null/undefined */
  emptyText?: string
  /** Visual variant of the chip */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  /** Size of the chip */
  size?: 'sm' | 'small' | 'default' | 'lg'
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
export function ChipField({
  source,
  record: recordProp,
  label,
  emptyText = '',
  variant = 'default',
  size = 'default',
  className,
  ...rest
}: ChipFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  const value = get(record, source)
  const displayValue = value == null ? emptyText : String(value)

  const isEmpty = value == null || value === ''

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
    className
  )

  if (isEmpty && !emptyText) {
    return label ? (
      <div>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <span />
      </div>
    ) : null
  }

  if (label) {
    return (
      <div>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <span className={chipClasses} {...rest}>
          {displayValue}
        </span>
      </div>
    )
  }

  return (
    <span className={chipClasses} {...rest}>
      {displayValue}
    </span>
  )
}

ChipField.displayName = 'ChipField'
