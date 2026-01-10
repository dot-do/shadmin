/**
 * FilterButton Component
 * Opens a dropdown menu to add filters to a list.
 * Similar to react-admin's FilterButton - shows available filters that can be added.
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactElement,
  type ReactNode,
  type ButtonHTMLAttributes,
  Children,
  isValidElement,
} from 'react'
import { cn } from '../../utils'

/**
 * Filter definition for available filters
 */
export interface FilterDefinition {
  /** Unique identifier for the filter (usually the source field name) */
  source: string
  /** Display label for the filter */
  label?: string
}

/**
 * Props for FilterButton component
 */
export interface FilterButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Available filters to show in dropdown.
   * Can be an array of FilterDefinition objects or React elements with 'source' props.
   */
  filters?: FilterDefinition[] | ReactElement[]
  /**
   * Currently displayed filter sources (these will be hidden from dropdown)
   */
  displayedFilters?: string[]
  /**
   * Disabled filter sources (shown but not clickable)
   */
  disabledFilters?: string[]
  /**
   * Callback when a filter is selected to be added
   */
  onAddFilter?: (source: string) => void
  /**
   * Button label
   * @default 'Add filter'
   */
  label?: string
  /**
   * Icon to display in the button
   */
  icon?: ReactNode
  /**
   * Button variant
   * @default 'outline'
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /**
   * Button size
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'small' | 'lg' | 'icon'
}

const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  small: 'h-9 rounded-md px-3', // alias for 'sm' (react-admin compatibility)
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
}

/**
 * Default filter icon (funnel/filter icon)
 */
function FilterIcon({ className }: { className?: string }) {
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
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

/**
 * Chevron down icon for dropdown indicator
 */
function ChevronDownIcon({ className }: { className?: string }) {
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
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/**
 * Extract filter definitions from React elements or filter definition array
 */
function normalizeFilters(
  filters: FilterDefinition[] | ReactElement[] | undefined
): FilterDefinition[] {
  if (!filters || filters.length === 0) {
    return []
  }

  // Check if first element is a React element
  const firstFilter = filters[0]
  if (isValidElement(firstFilter)) {
    // Extract source and label from React elements
    const elements = filters as ReactElement[]
    return Children.toArray(elements)
      .filter(isValidElement)
      .map((element) => {
        const props = element.props as Record<string, unknown>
        const label = props.label as string | undefined
        const result: FilterDefinition = {
          source: String(props.source || ''),
        }
        if (label !== undefined) {
          result.label = label
        }
        return result
      })
      .filter((f): f is FilterDefinition => Boolean(f.source))
  }

  // Already FilterDefinition array
  return filters as FilterDefinition[]
}

/**
 * Get display label for a filter
 */
function getFilterLabel(filter: FilterDefinition): string {
  if (filter.label) {
    return filter.label
  }
  // Capitalize and convert camelCase to Title Case
  return filter.source
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * FilterButton component opens a dropdown menu to add filters to a list.
 *
 * @example
 * ```tsx
 * // With filter definitions
 * <FilterButton
 *   filters={[
 *     { source: 'status', label: 'Status' },
 *     { source: 'category', label: 'Category' },
 *     { source: 'createdAt', label: 'Created Date' },
 *   ]}
 *   displayedFilters={['status']}
 *   onAddFilter={(source) => addFilter(source)}
 * />
 *
 * // With React filter elements
 * <FilterButton
 *   filters={[
 *     <TextInput source="search" label="Search" />,
 *     <SelectInput source="status" label="Status" />,
 *   ]}
 *   displayedFilters={displayedFilters}
 *   onAddFilter={showFilter}
 * />
 * ```
 */
export function FilterButton({
  filters,
  displayedFilters = [],
  disabledFilters = [],
  onAddFilter,
  label = 'Add filter',
  icon,
  variant = 'outline',
  size = 'default',
  className,
  disabled,
  ...props
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Normalize filters to FilterDefinition array
  const normalizedFilters = normalizeFilters(filters)

  // Get available filters (not already displayed)
  const availableFilters = normalizedFilters.filter(
    (filter) => !displayedFilters.includes(filter.source)
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close dropdown on escape key
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleToggle = useCallback(() => {
    if (!disabled && availableFilters.length > 0) {
      setIsOpen((prev) => !prev)
    }
  }, [disabled, availableFilters.length])

  const handleSelectFilter = useCallback(
    (source: string) => {
      if (onAddFilter && !disabledFilters.includes(source)) {
        onAddFilter(source)
        setIsOpen(false)
      }
    },
    [onAddFilter, disabledFilters]
  )

  // Handle keyboard navigation in menu
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const items = menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
      if (!items || items.length === 0) return

      const currentIndex = Array.from(items).findIndex(
        (item) => item === document.activeElement
      )

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
          ;(items[nextIndex] as HTMLElement).focus()
          break
        case 'ArrowUp':
          event.preventDefault()
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
          ;(items[prevIndex] as HTMLElement).focus()
          break
        case 'Home':
          event.preventDefault()
          ;(items[0] as HTMLElement).focus()
          break
        case 'End':
          event.preventDefault()
          ;(items[items.length - 1] as HTMLElement).focus()
          break
      }
    },
    []
  )

  // Don't render if no filters available
  const hasAvailableFilters = availableFilters.length > 0

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled || !hasAvailableFilters}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        data-testid="shadmin-filter-button"
        className={cn(
          'filter-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
          'ring-offset-background transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        {...props}
      >
        {icon !== undefined ? icon : <FilterIcon className="h-4 w-4" />}
        {size !== 'icon' && <span>{label}</span>}
        {size !== 'icon' && (
          <ChevronDownIcon
            className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
          />
        )}
      </button>

      {isOpen && hasAvailableFilters && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          onKeyDown={handleKeyDown}
          data-testid="shadmin-filter-menu"
          className={cn(
            'absolute left-0 top-full z-50 mt-1 min-w-[180px]',
            'rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
            'animate-in fade-in-0 zoom-in-95'
          )}
        >
          {availableFilters.map((filter) => {
            const isDisabled = disabledFilters.includes(filter.source)
            return (
              <button
                key={filter.source}
                role="menuitem"
                type="button"
                disabled={isDisabled}
                aria-disabled={isDisabled}
                data-key={filter.source}
                onClick={() => handleSelectFilter(filter.source)}
                className={cn(
                  'relative flex w-full cursor-pointer select-none items-center',
                  'rounded-sm px-2 py-1.5 text-sm outline-none',
                  'transition-colors',
                  'focus:bg-accent focus:text-accent-foreground',
                  'hover:bg-accent hover:text-accent-foreground',
                  isDisabled && 'pointer-events-none opacity-50'
                )}
              >
                {getFilterLabel(filter)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

FilterButton.displayName = 'FilterButton'
