/**
 * ReferenceArrayInput Component
 * A wrapper component for array inputs that fetches choices from a referenced resource.
 * Works with many-to-many relationships, providing choices to child multi-select components.
 *
 * Similar to ReferenceInput but for array fields - stores an array of IDs.
 */

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { useGetList } from '../../hooks/useGetList'
import type { RaRecord } from '../../types'
import { PAGINATION_DEFAULTS, SORT_DEFAULTS } from '../../constants'

/**
 * Props for ReferenceArrayInput component
 */
export interface ReferenceArrayInputProps {
  /**
   * The field name in the form data. Maps to the stored array of IDs.
   */
  source: string
  /**
   * The name of the resource to fetch choices from.
   */
  reference: string
  /**
   * Filter to apply when fetching choices from the referenced resource.
   */
  filter?: Record<string, unknown>
  /**
   * Sort configuration for fetching choices.
   */
  sort?: {
    field: string
    order: 'ASC' | 'DESC'
  }
  /**
   * Number of records to fetch per page.
   * @default 25
   */
  perPage?: number
  /**
   * Whether the input is disabled.
   */
  disabled?: boolean
  /**
   * Label text for the input.
   */
  label?: string | false
  /**
   * Child component that receives the choices (SelectArrayInput, CheckboxGroupInput, etc.)
   */
  children: ReactNode
}

/**
 * Interface for child component props that can receive choices
 */
interface ChildWithChoices {
  choices: RaRecord[]
  disabled?: boolean
}

/**
 * ReferenceArrayInput component that fetches choices from a referenced resource
 * and passes them to child multi-select components.
 *
 * @example
 * ```tsx
 * // Basic usage with SelectArrayInput
 * <ReferenceArrayInput source="tag_ids" reference="tags">
 *   <SelectArrayInput source="tag_ids" choices={[]} />
 * </ReferenceArrayInput>
 *
 * // With CheckboxGroupInput
 * <ReferenceArrayInput source="category_ids" reference="categories">
 *   <CheckboxGroupInput source="category_ids" choices={[]} />
 * </ReferenceArrayInput>
 *
 * // With filtering
 * <ReferenceArrayInput
 *   source="tag_ids"
 *   reference="tags"
 *   filter={{ active: true }}
 * >
 *   <SelectArrayInput source="tag_ids" choices={[]} />
 * </ReferenceArrayInput>
 *
 * // With sorting
 * <ReferenceArrayInput
 *   source="tag_ids"
 *   reference="tags"
 *   sort={{ field: 'name', order: 'ASC' }}
 * >
 *   <SelectArrayInput source="tag_ids" choices={[]} />
 * </ReferenceArrayInput>
 *
 * // With custom perPage
 * <ReferenceArrayInput source="tag_ids" reference="tags" perPage={100}>
 *   <SelectArrayInput source="tag_ids" choices={[]} />
 * </ReferenceArrayInput>
 * ```
 */
export function ReferenceArrayInput({
  source: _source,
  reference,
  filter = {},
  sort = { field: SORT_DEFAULTS.FIELD, order: SORT_DEFAULTS.ORDER },
  perPage = PAGINATION_DEFAULTS.REFERENCE_PER_PAGE,
  disabled = false,
  children,
}: ReferenceArrayInputProps) {
  // Fetch choices from the referenced resource
  const { data, isLoading: _isLoading, error: _error } = useGetList(reference, {
    pagination: { page: 1, perPage },
    sort,
    filter,
  })

  // Use empty array while loading or on error
  const choices: RaRecord[] = data ?? []

  // Clone the child element and inject the choices prop
  if (isValidElement<ChildWithChoices>(children)) {
    const isDisabled = disabled || children.props.disabled === true
    return cloneElement(children as ReactElement<ChildWithChoices>, {
      choices,
      disabled: isDisabled,
    })
  }

  // If children is not a valid element, render it as-is
  return <>{children}</>
}

ReferenceArrayInput.displayName = 'ReferenceArrayInput'
