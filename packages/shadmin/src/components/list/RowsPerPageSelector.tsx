/**
 * RowsPerPageSelector Component
 *
 * A dropdown selector for choosing the number of rows to display per page.
 * Uses shadcn/ui-inspired styling with a custom select implementation.
 */

import { forwardRef, useState, useRef, useEffect, useCallback, memo } from 'react'

import { cn } from '../../utils'

/**
 * Props for the RowsPerPageSelector component
 */
export interface RowsPerPageSelectorProps {
  /** Current value */
  value: number
  /** Available options */
  options: number[]
  /** Callback when value changes */
  onChange: (value: number) => void
  /** Additional CSS classes */
  className?: string
  /** Label for accessibility */
  label?: string
}

/**
 * Base button styles matching shadcn/ui
 */
const selectTriggerStyles =
  'flex h-10 w-[70px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

const selectContentStyles =
  'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'

const selectItemStyles =
  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground'

/**
 * RowsPerPageSelector component for selecting page size.
 *
 * @example
 * ```tsx
 * <RowsPerPageSelector
 *   value={10}
 *   options={[10, 25, 50, 100]}
 *   onChange={(value) => setPerPage(value)}
 * />
 * ```
 */
export const RowsPerPageSelector = forwardRef<HTMLButtonElement, RowsPerPageSelectorProps>(
  ({ value, options, onChange, className, label = 'Rows per page' }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        switch (event.key) {
          case 'Enter':
          case ' ':
            event.preventDefault()
            if (isOpen && highlightedIndex >= 0 && options[highlightedIndex] !== undefined) {
              onChange(options[highlightedIndex])
              setIsOpen(false)
            } else {
              setIsOpen(!isOpen)
            }
            break
          case 'Escape':
            setIsOpen(false)
            break
          case 'ArrowDown':
            event.preventDefault()
            if (!isOpen) {
              setIsOpen(true)
            } else {
              setHighlightedIndex((prev) =>
                prev < options.length - 1 ? prev + 1 : 0
              )
            }
            break
          case 'ArrowUp':
            event.preventDefault()
            if (isOpen) {
              setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : options.length - 1
              )
            }
            break
          case 'Tab':
            setIsOpen(false)
            break
        }
      },
      [isOpen, highlightedIndex, options, onChange]
    )

    const handleToggle = () => {
      setIsOpen(!isOpen)
      if (!isOpen) {
        // Set initial highlighted index to current value
        const currentIndex = options.indexOf(value)
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0)
      }
    }

    const handleSelect = (optionValue: number) => {
      onChange(optionValue)
      setIsOpen(false)
    }

    return (
      <div ref={containerRef} className={cn('relative inline-block', className)} data-testid="shadmin-rows-per-page-selector">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <button
            ref={ref}
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={`${label}, ${value} selected`}
            className={selectTriggerStyles}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
          >
            <span>{value}</span>
            <ChevronDownIcon
              className={cn(
                'h-4 w-4 opacity-50 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>
        </div>

        {isOpen && (
          <div
            className={cn(
              selectContentStyles,
              'absolute right-0 top-full mt-1 w-[70px]'
            )}
            data-state={isOpen ? 'open' : 'closed'}
          >
            <ul
              ref={listRef}
              role="listbox"
              aria-label={label}
              className="p-1"
            >
              {options.map((option, index) => (
                <li
                  key={option}
                  role="option"
                  aria-selected={option === value}
                  className={cn(
                    selectItemStyles,
                    option === value && 'bg-accent',
                    index === highlightedIndex && 'bg-accent'
                  )}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option === value && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
)

RowsPerPageSelector.displayName = 'RowsPerPageSelector'

/**
 * ChevronDown icon component (memoized for performance)
 */
const ChevronDownIcon = memo(function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
})

/**
 * Check icon component (memoized for performance)
 */
const CheckIcon = memo(function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
})
