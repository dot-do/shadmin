import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type InputHTMLAttributes,
} from 'react'
import { useListContext } from '@/contexts/ListContext'
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
}

/**
 * SearchInput component provides a debounced text search filter
 * that integrates with ListContext.
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
 */
export function SearchInput({
  source = 'q',
  debounce = 500,
  placeholder = 'Search...',
  className,
  disabled,
  ...props
}: SearchInputProps) {
  const { filterValues, setFilters, setPage } = useListContext()

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

  const hasValue = value.length > 0

  return (
    <div className="relative inline-flex items-center">
      <input
        type="search"
        role="searchbox"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasValue && 'pr-8',
          className
        )}
        {...props}
      />
      {hasValue && (
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
    </div>
  )
}

SearchInput.displayName = 'SearchInput'
