import { useState, useCallback, type ButtonHTMLAttributes } from 'react'
import { useListContext } from '@/contexts/ListContext'
import { Button } from '@/components/Button'
import { cn } from '@/utils'

/**
 * Props for FilterButton component
 */
export interface FilterButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Button label */
  label?: string
  /** Controlled open state */
  isOpen?: boolean
  /** Callback when button is toggled */
  onToggle?: () => void
}

/**
 * Counts the number of active filters (non-empty values)
 */
function countActiveFilters(
  filterValues: Record<string, unknown>
): number {
  return Object.values(filterValues).filter(
    (value) => value !== '' && value !== null && value !== undefined
  ).length
}

/**
 * FilterButton component toggles filter panel visibility and shows
 * the count of active filters.
 *
 * @example
 * ```tsx
 * <FilterButton onToggle={() => setShowFilters(!showFilters)} />
 * ```
 *
 * @example Controlled mode
 * ```tsx
 * <FilterButton isOpen={showFilters} onToggle={() => setShowFilters(!showFilters)} />
 * ```
 */
export function FilterButton({
  label = 'Filters',
  isOpen: controlledIsOpen,
  onToggle,
  className,
  disabled,
  ...props
}: FilterButtonProps) {
  const { filterValues } = useListContext()

  // Internal state for uncontrolled mode
  const [internalIsOpen, setInternalIsOpen] = useState(false)

  // Use controlled value if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen

  const activeFilterCount = countActiveFilters(filterValues)
  const hasFilters = activeFilterCount > 0

  const handleClick = useCallback(() => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalIsOpen((prev) => !prev)
    }
  }, [onToggle])

  return (
    <Button
      type="button"
      variant="outline"
      className={cn('filter-button', className)}
      onClick={handleClick}
      disabled={disabled}
      aria-expanded={isOpen}
      data-has-filters={hasFilters ? 'true' : 'false'}
      {...props}
    >
      {label}
      {hasFilters && (
        <span
          data-testid="filter-count"
          className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
        >
          {activeFilterCount}
        </span>
      )}
    </Button>
  )
}

FilterButton.displayName = 'FilterButton'
