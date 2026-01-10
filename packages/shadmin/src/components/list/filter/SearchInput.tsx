import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  memo,
  type InputHTMLAttributes,
} from 'react'
import { ListContext } from '@/contexts/ListContext'
import { cn } from '@/utils'

/**
 * Props for SearchInput component
 */
export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Filter source/key name in filterValues */
  source?: string
  /** Debounce delay in milliseconds */
  debounce?: number
  /**
   * If true, the input is always displayed (not hideable in filter forms).
   * This is commonly used for permanent search fields in list toolbars.
   */
  alwaysOn?: boolean
  /**
   * If true, shows a remove button to hide/clear this filter.
   * Useful for dynamic filters that can be shown/hidden.
   */
  hideable?: boolean
  /** Callback when the filter is hidden/removed */
  onHide?: (source: string) => void
}

/**
 * Search icon SVG component (memoized for performance)
 */
const SearchIcon = memo(function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
})

/**
 * SearchInput component provides a debounced text search filter
 * that integrates with ListContext when available.
 *
 * @example
 * ```tsx
 * <SearchInput source="q" placeholder="Search products..." />
 * ```
 *
 * @example With custom debounce
 * ```tsx
 * <SearchInput source="search" debounce={300} />
 * ```
 *
 * @example With alwaysOn prop (for permanent filter display)
 * ```tsx
 * <List filters={[<SearchInput source="q" alwaysOn />]}>
 *   ...
 * </List>
 * ```
 */
export function SearchInput({
  source = 'q',
  debounce = 500,
  placeholder = 'Search...',
  className,
  disabled,
  alwaysOn: _alwaysOn,
  hideable = false,
  onHide,
  ...props
}: SearchInputProps) {
  // Try to get ListContext, but don't throw if not available
  const listContext = useContext(ListContext)

  // Extract values from context if available, otherwise use defaults
  const filterValues = listContext?.filterValues ?? {}
  const setFilters = listContext?.setFilters ?? (() => {})
  const setPage = listContext?.setPage ?? (() => {})

  // Initialize value from filterValues
  const initialValue = (filterValues[source] as string) ?? ''
  const [value, setValue] = useState(initialValue)

  // Ref for debounce timeout
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync value with filterValues when they change externally
  useEffect(() => {
    const contextValue = (filterValues[source] as string) ?? ''
    setValue(contextValue)
  }, [filterValues, source])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const updateFilters = useCallback(
    (newValue: string) => {
      // Reset page to 1
      setPage(1)

      // Update filters, preserving existing values
      setFilters({
        ...filterValues,
        [source]: newValue || undefined,
      })
    },
    [setFilters, setPage, filterValues, source]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new debounced timeout
      timeoutRef.current = setTimeout(() => {
        updateFilters(newValue)
      }, debounce)
    },
    [debounce, updateFilters]
  )

  const handleClear = useCallback(() => {
    setValue('')

    // Clear any pending debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Update immediately (no debounce for clear)
    setPage(1)
    setFilters({
      ...filterValues,
      [source]: undefined,
    })
  }, [setFilters, setPage, filterValues, source])

  // Handle hiding the filter
  const handleHide = useCallback(() => {
    // Clear the filter value first
    setValue('')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setPage(1)
    setFilters({
      ...filterValues,
      [source]: undefined,
    })
    // Notify parent
    if (onHide) {
      onHide(source)
    }
  }, [setFilters, setPage, filterValues, source, onHide])

  const hasValue = value.length > 0

  return (
    <div className="relative inline-flex items-center" data-testid="shadmin-search-input" data-source={source}>
      {/* Search icon */}
      <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        role="searchbox"
        name={source}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        data-testid="search-input"
        className={cn(
          'h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasValue && 'pr-8',
          hideable && 'pr-16',
          className
        )}
        {...props}
      />
      {hasValue && !hideable && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 inline-flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
      {hideable && (
        <button
          type="button"
          onClick={handleHide}
          title="Remove this filter"
          aria-label="Remove this filter"
          className="absolute right-2 inline-flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}

SearchInput.displayName = 'SearchInput'
