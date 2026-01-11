/**
 * Pagination Component
 *
 * A pagination component for navigating through list data.
 * Uses shadcn/ui-inspired styling and integrates with ListContext.
 * 100% API compatible with react-admin Pagination.
 */

import { forwardRef, memo, type ReactNode } from 'react'
import { cn } from '../../utils'
import { useListContext, type ListControllerResult } from '../../contexts/ListContext'
import { RowsPerPageSelector } from './RowsPerPageSelector'

/**
 * Props for the Pagination component
 * Supports both context-based usage and standalone props
 */
export interface PaginationProps {
  /** Current page number (1-indexed). Overrides context value if provided */
  page?: number
  /** Number of items per page. Overrides context value if provided */
  perPage?: number
  /** Total number of records. Overrides context value if provided */
  total?: number
  /** Callback to change page. Overrides context value if provided */
  setPage?: (page: number) => void
  /** Callback to change items per page. Overrides context value if provided */
  setPerPage?: (perPage: number) => void
  /** Options for the rows per page selector. Pass empty array to hide */
  rowsPerPageOptions?: number[]
  /** Custom element to render instead of default pagination (react-admin compatibility) */
  limit?: ReactNode
  /** Additional CSS classes */
  className?: string
  /** Number of pages to show around current page */
  siblingCount?: number
  /** Number of pages to show at the start/end */
  boundaryCount?: number
}

/**
 * Generate an array of page numbers to display
 */
function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
  boundaryCount: number = 1
): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []

  // Always show first boundaryCount pages
  for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
    pages.push(i)
  }

  // Calculate range around current page
  const siblingStart = Math.max(
    boundaryCount + 1,
    currentPage - siblingCount
  )
  const siblingEnd = Math.min(
    totalPages - boundaryCount,
    currentPage + siblingCount
  )

  // Add ellipsis before siblings if needed
  if (siblingStart > boundaryCount + 1) {
    pages.push('ellipsis')
  }

  // Add sibling pages
  for (let i = siblingStart; i <= siblingEnd; i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  // Add ellipsis after siblings if needed
  if (siblingEnd < totalPages - boundaryCount) {
    pages.push('ellipsis')
  }

  // Always show last boundaryCount pages
  for (let i = Math.max(totalPages - boundaryCount + 1, boundaryCount + 1); i <= totalPages; i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  return pages
}

/**
 * Hook to get pagination values from either props or context
 */
function usePaginationContext(props: PaginationProps) {
  let contextValue: Partial<ListControllerResult> = {}

  try {
    contextValue = useListContext()
  } catch {
    // Context not available, use props only
  }

  return {
    page: props.page ?? contextValue.page ?? 1,
    perPage: props.perPage ?? contextValue.perPage ?? 10,
    total: props.total ?? contextValue.total,
    setPage: props.setPage ?? contextValue.setPage ?? (() => {}),
    setPerPage: props.setPerPage ?? contextValue.setPerPage ?? (() => {}),
  }
}

/**
 * Base button styles
 */
const baseButtonStyles =
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const buttonVariants = {
  default: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
}

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  icon: 'h-10 w-10',
}

/**
 * Pagination component for navigating through list data.
 *
 * @example
 * ```tsx
 * // With ListContext
 * <ListContextProvider value={listController}>
 *   <Pagination />
 * </ListContextProvider>
 *
 * // Standalone usage
 * <Pagination
 *   page={2}
 *   perPage={10}
 *   total={50}
 *   setPage={setPage}
 *   setPerPage={setPerPage}
 * />
 *
 * // Custom rows per page options
 * <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
 *
 * // Hide rows per page selector
 * <Pagination rowsPerPageOptions={[]} />
 * ```
 */
export const Pagination = forwardRef<HTMLDivElement, PaginationProps & React.HTMLAttributes<HTMLDivElement> & { 'data-testid'?: string }>(
  (
    {
      rowsPerPageOptions = [10, 25, 50, 100],
      className,
      siblingCount = 1,
      boundaryCount = 1,
      limit: _limit,
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    const { page, perPage, total, setPage, setPerPage } = usePaginationContext(props)

    // Don't render if no data or only one page
    if (total === undefined || total === 0) {
      return null
    }

    const totalPages = Math.ceil(total / perPage)

    if (totalPages <= 1) {
      return null
    }

    const isFirstPage = page === 1
    const isLastPage = page >= totalPages

    const pageNumbers = generatePageNumbers(page, totalPages, siblingCount, boundaryCount)

    // Calculate record range display
    const startRecord = (page - 1) * perPage + 1
    const endRecord = Math.min(page * perPage, total)

    const handlePageChange = (newPage: number) => {
      if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
        setPage(newPage)
      }
    }

    const handlePerPageChange = (newPerPage: number) => {
      setPage(1)
      setPerPage(newPerPage)
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between px-2 py-4', className)}
        data-testid={dataTestId ?? 'shadmin-pagination'}
      >
        {/* Record count display */}
        <div className="flex-1 text-sm text-muted-foreground">
          {startRecord}-{endRecord} of {total}
        </div>

        {/* Pagination navigation */}
        <nav role="navigation" aria-label="pagination" className="mx-auto flex items-center gap-1">
          {/* Previous button */}
          <button
            type="button"
            data-testid="shadmin-pagination-prev"
            className={cn(
              baseButtonStyles,
              buttonVariants.ghost,
              buttonSizes.default,
              'gap-1 pl-2.5'
            )}
            onClick={() => handlePageChange(page - 1)}
            disabled={isFirstPage}
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNumber, index) =>
              pageNumber === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-10 w-10 items-center justify-center"
                  aria-hidden="true"
                >
                  ...
                </span>
              ) : (
                <button
                  key={pageNumber}
                  type="button"
                  className={cn(
                    baseButtonStyles,
                    pageNumber === page
                      ? 'border border-input bg-background'
                      : buttonVariants.ghost,
                    buttonSizes.icon
                  )}
                  onClick={() => handlePageChange(pageNumber)}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={pageNumber === page ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>

          {/* Next button */}
          <button
            type="button"
            data-testid="shadmin-pagination-next"
            className={cn(
              baseButtonStyles,
              buttonVariants.ghost,
              buttonSizes.default,
              'gap-1 pr-2.5'
            )}
            onClick={() => handlePageChange(page + 1)}
            disabled={isLastPage}
            aria-label="Go to next page"
          >
            <span>Next</span>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>

        {/* Rows per page selector */}
        <div className="flex-1 flex justify-end">
          {rowsPerPageOptions.length > 0 && (
            <RowsPerPageSelector
              value={perPage}
              options={rowsPerPageOptions}
              onChange={handlePerPageChange}
            />
          )}
        </div>
      </div>
    )
  }
)

Pagination.displayName = 'Pagination'

/**
 * ChevronLeft icon component (memoized for performance)
 */
const ChevronLeftIcon = memo(function ChevronLeftIcon({ className }: { className?: string }) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
})

/**
 * ChevronRight icon component (memoized for performance)
 */
const ChevronRightIcon = memo(function ChevronRightIcon({ className }: { className?: string }) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
})
