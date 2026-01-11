/**
 * ReferenceInput Component
 * Fetches choices from a referenced resource and provides them to child inputs
 * 100% API-compatible with react-admin
 */

import { cloneElement, type ReactElement } from 'react'
import { useGetList } from '../../hooks/useGetList'
import { cn } from '../../utils'
import { AutocompleteInput } from './AutocompleteInput'
import type { SelectChoice } from './types'
import { PAGINATION_DEFAULTS, SORT_DEFAULTS } from '../../constants'

/**
 * Choice record type for reference inputs.
 * Uses the shared SelectChoice type for consistency.
 */
export type ReferenceChoice<T extends Record<string, unknown> = Record<string, unknown>> = SelectChoice<T>

/**
 * Sort configuration for fetching choices
 */
export interface ReferenceSort {
  field: string
  order: 'ASC' | 'DESC'
}

/**
 * Props for ReferenceInput component
 */
export interface ReferenceInputProps {
  /**
   * The field name in the form data that will hold the reference ID
   */
  source: string
  /**
   * The referenced resource name to fetch choices from
   */
  reference: string
  /**
   * Child input component (SelectInput or AutocompleteInput)
   * Defaults to AutocompleteInput if not provided
   */
  children?: ReactElement
  /**
   * Label text displayed above the input
   */
  label?: string | false
  /**
   * Filter object to apply when fetching choices
   */
  filter?: Record<string, unknown>
  /**
   * Sort configuration for the fetched choices
   */
  sort?: ReferenceSort
  /**
   * Number of choices to fetch per page
   * @default 25
   */
  perPage?: number
  /**
   * The property name to use as the option value
   * @default 'id'
   */
  optionValue?: string
  /**
   * The property name or function to use for option text
   * @default 'name'
   */
  optionText?: string | ((record: ReferenceChoice) => string)
  /**
   * Text for the empty/placeholder option
   */
  emptyText?: string
  /**
   * Whether the input is disabled
   */
  disabled?: boolean
  /**
   * Helper text displayed below the input
   */
  helperText?: string
  /**
   * Additional CSS class name
   */
  className?: string
}

/**
 * Loading indicator component
 */
function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <svg
        className="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>Loading...</span>
    </div>
  )
}

/**
 * Error display component
 */
function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="text-sm text-destructive">
      {message}
    </div>
  )
}

/**
 * ReferenceInput component
 * Fetches choices from a referenced resource using useGetList and provides them to child inputs
 *
 * @example
 * ```tsx
 * // Basic usage with SelectInput
 * <ReferenceInput source="authorId" reference="authors">
 *   <SelectInput source="authorId" label="Author" />
 * </ReferenceInput>
 *
 * // With custom filter and sort
 * <ReferenceInput
 *   source="categoryId"
 *   reference="categories"
 *   filter={{ isActive: true }}
 *   sort={{ field: 'name', order: 'ASC' }}
 * >
 *   <SelectInput source="categoryId" label="Category" />
 * </ReferenceInput>
 *
 * // With custom optionText function
 * <ReferenceInput
 *   source="userId"
 *   reference="users"
 *   optionText={(user) => `${user.firstName} ${user.lastName}`}
 * >
 *   <AutocompleteInput source="userId" label="User" />
 * </ReferenceInput>
 * ```
 */
export function ReferenceInput({
  source,
  reference,
  children,
  label,
  filter = {},
  sort = { field: SORT_DEFAULTS.FIELD, order: SORT_DEFAULTS.ORDER },
  perPage = PAGINATION_DEFAULTS.REFERENCE_PER_PAGE,
  optionValue = 'id',
  optionText = 'name',
  emptyText,
  disabled = false,
  helperText,
  className,
}: ReferenceInputProps) {
  // Fetch choices from the referenced resource
  const { data, isLoading, error } = useGetList(reference, {
    pagination: { page: 1, perPage },
    sort,
    filter,
  })

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        <LoadingIndicator />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={cn('space-y-2', className)}>
        <ErrorDisplay message={error.message} />
      </div>
    )
  }

  // Prepare choices for the child input
  const choices = data ?? []

  // Props to pass to the child input
  const childProps = {
    source,
    choices,
    optionValue,
    optionText,
    disabled,
    ...(label !== undefined && { label }),
    ...(emptyText !== undefined && { emptyText }),
    ...(helperText !== undefined && { helperText }),
  }

  // If no children provided, default to AutocompleteInput
  const childElement = children ? (
    cloneElement(children, childProps)
  ) : (
    <AutocompleteInput {...childProps} />
  )

  return <div className={className} data-testid="shadmin-reference-input">{childElement}</div>
}

ReferenceInput.displayName = 'ReferenceInput'
