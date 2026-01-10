import { useState, useCallback, memo, type ButtonHTMLAttributes } from 'react'
import { useListContext } from '@/contexts/ListContext'
import { Button } from '@/components/Button'
import { cn } from '@/utils'

/**
 * Filter icon component
 */
const FilterIcon = memo(function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
})

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
      className={cn('filter-button gap-2', className)}
      onClick={handleClick}
      disabled={disabled}
      aria-expanded={isOpen}
      data-has-filters={hasFilters ? 'true' : 'false'}
      {...props}
    >
      <FilterIcon className="h-4 w-4" />
      {label}
      {hasFilters && (
        <span
          data-testid="filter-count"
          className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
        >
          {activeFilterCount}
        </span>
      )}
    </Button>
  )
}

FilterButton.displayName = 'FilterButton'
