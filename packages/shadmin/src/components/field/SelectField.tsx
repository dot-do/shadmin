import { type HTMLAttributes } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../facade'
import type { SelectChoice } from '../input/types'

/**
 * Choice type for SelectField options.
 * Uses the shared SelectChoice type for consistency.
 */
export type SelectFieldChoice<T extends Record<string, unknown> = Record<string, unknown>> = SelectChoice<T>

export interface SelectFieldProps extends HTMLAttributes<HTMLSpanElement> {
  /** The field name in the record to display */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the value */
  label?: string
  /**
   * Text to display when value is empty/null/undefined or not found in choices.
   * - string: Display that string
   * - true: Display default empty text
   * - false | undefined: Display nothing
   */
  emptyText?: string | boolean
  /**
   * Array of choices to look up the display value.
   * If not provided, displays the raw value.
   */
  choices?: SelectFieldChoice[]
  /**
   * The property name to use as the option value for matching.
   * @default 'id'
   */
  optionValue?: string
  /**
   * The property name to use as the option text, or a function to render custom text.
   * @default 'name'
   */
  optionText?: string | ((choice: SelectFieldChoice) => string)
  /**
   * If true, the value is translated using the provided translate function
   * (for react-admin compatibility)
   */
  translateChoice?: boolean
}

/**
 * SelectField component displays a value as its corresponding choice label.
 *
 * @example
 * ```tsx
 * // Basic usage with choices
 * <RecordContextProvider value={{ id: 1, status: 'active' }}>
 *   <SelectField
 *     source="status"
 *     choices={[
 *       { id: 'active', name: 'Active' },
 *       { id: 'inactive', name: 'Inactive' },
 *     ]}
 *   />
 * </RecordContextProvider>
 * // Displays: "Active"
 *
 * // With custom value/text fields
 * <SelectField
 *   source="country"
 *   choices={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *   ]}
 *   optionValue="value"
 *   optionText="label"
 * />
 *
 * // With custom text renderer
 * <SelectField
 *   source="userId"
 *   choices={users}
 *   optionText={(choice) => `${choice.firstName} ${choice.lastName}`}
 * />
 *
 * // With label
 * <SelectField source="status" label="Current Status" choices={statusChoices} />
 *
 * // Without choices (displays raw value)
 * <SelectField source="status" />
 * ```
 */
/** Default text shown when emptyText is true */
const DEFAULT_EMPTY_TEXT = ''

export function SelectField({
  source,
  record: recordProp,
  label,
  emptyText,
  choices,
  optionValue = 'id',
  optionText = 'name',
  translateChoice = false,
  className,
  ...rest
}: SelectFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  // Resolve emptyText: false/undefined = '', true = default, string = as-is
  const resolvedEmptyText =
    emptyText === false || emptyText === undefined
      ? ''
      : emptyText === true
        ? DEFAULT_EMPTY_TEXT
        : emptyText

  const rawValue = get(record, source)

  // Handle empty value
  if (rawValue == null || rawValue === '') {
    if (label) {
      return (
        <div className={cn(className)} data-testid="shadmin-select-field" {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <span>{resolvedEmptyText}</span>
        </div>
      )
    }
    return (
      <span className={cn(className)} data-testid="shadmin-select-field" {...rest}>
        {resolvedEmptyText}
      </span>
    )
  }

  // If no choices provided, display raw value
  if (!choices || choices.length === 0) {
    const displayValue = String(rawValue)
    if (label) {
      return (
        <div className={cn(className)} data-testid="shadmin-select-field" {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <span>{displayValue}</span>
        </div>
      )
    }
    return (
      <span className={cn(className)} data-testid="shadmin-select-field" {...rest}>
        {displayValue}
      </span>
    )
  }

  // Find matching choice
  const matchingChoice = choices.find((choice) => {
    const choiceValue = choice[optionValue]
    // Handle both string and number comparisons
    return choiceValue === rawValue || String(choiceValue) === String(rawValue)
  })

  // Get display text
  let displayValue: string
  if (matchingChoice) {
    if (typeof optionText === 'function') {
      displayValue = optionText(matchingChoice)
    } else {
      displayValue = String(matchingChoice[optionText] ?? '')
    }
  } else {
    // No matching choice found, use emptyText or raw value
    displayValue = resolvedEmptyText || String(rawValue)
  }

  if (label) {
    return (
      <div className={cn(className)} data-testid="shadmin-select-field" {...rest}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <span>{displayValue}</span>
      </div>
    )
  }

  return (
    <span className={cn(className)} data-testid="shadmin-select-field" {...rest}>
      {displayValue}
    </span>
  )
}

SelectField.displayName = 'SelectField'
