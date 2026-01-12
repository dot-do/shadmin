/**
 * Shared types for choice-based input components
 *
 * This module provides type-safe interfaces for select, autocomplete,
 * radio button, and checkbox group inputs.
 */

/**
 * Valid types for choice value fields (id, value, etc.)
 * Most choice values are strings, but numeric IDs are also common.
 */
export type ChoiceValue = string | number

/**
 * Base interface for choices using id/name pattern.
 * This is the most common pattern for choice objects.
 *
 * @example
 * ```tsx
 * const statusChoices: IdNameChoice[] = [
 *   { id: 'active', name: 'Active' },
 *   { id: 'inactive', name: 'Inactive' },
 * ]
 * ```
 */
export interface IdNameChoice {
  id: ChoiceValue
  name: string
  [key: string]: unknown
}

/**
 * Base interface for choices using value/label pattern.
 * Common in HTML native select elements and some UI libraries.
 *
 * @example
 * ```tsx
 * const countryChoices: ValueLabelChoice[] = [
 *   { value: 'us', label: 'United States' },
 *   { value: 'uk', label: 'United Kingdom' },
 * ]
 * ```
 */
export interface ValueLabelChoice {
  value: ChoiceValue
  label: string
  [key: string]: unknown
}

/**
 * Base choice interface that accepts either id/name or value/label patterns.
 * Use this for components that need to support both patterns.
 *
 * @example
 * ```tsx
 * // Both patterns are valid:
 * const choices: BaseSelectChoice[] = [
 *   { id: '1', name: 'Option 1' },
 *   { value: '2', label: 'Option 2' },
 * ]
 * ```
 */
export type BaseSelectChoice = IdNameChoice | ValueLabelChoice

/**
 * Choice interface with generic type parameter for full type safety.
 *
 * The generic parameter T allows you to specify the exact shape of your choice objects,
 * providing full type safety when accessing properties like id, name, value, label, etc.
 *
 * @template T - The shape of the choice object. Defaults to a flexible record type
 *               that allows any string key for backwards compatibility.
 *
 * @example
 * ```tsx
 * // Basic usage with default id/name fields
 * type StatusChoice = SelectChoice<{ id: string; name: string }>
 * const choices: StatusChoice[] = [
 *   { id: 'active', name: 'Active' },
 *   { id: 'inactive', name: 'Inactive' },
 * ]
 *
 * // With numeric ids
 * type UserChoice = SelectChoice<{ id: number; name: string }>
 *
 * // With custom value/label fields
 * type CountryChoice = SelectChoice<{ value: string; label: string; flag: string }>
 *
 * // Backwards compatible - loose typing when generic is omitted
 * const flexibleChoices: SelectChoice[] = [{ id: 1, name: 'One', extra: 'data' }]
 * ```
 */
export type SelectChoice<T extends Record<string, unknown> = Record<string, unknown>> = T

/**
 * Helper type to extract the value type from a choice based on the optionValue field
 *
 * @template T - The choice type
 * @template K - The key to use for the value (defaults to 'id')
 *
 * @example
 * ```tsx
 * type Choice = { id: number; name: string }
 * type IdType = ExtractChoiceValue<Choice, 'id'> // number
 * ```
 */
export type ExtractChoiceValue<
  T extends Record<string, unknown>,
  K extends keyof T = 'id' extends keyof T ? 'id' : never
> = K extends keyof T ? T[K] : unknown

/**
 * Helper type to extract the text type from a choice based on the optionText field
 *
 * @template T - The choice type
 * @template K - The key to use for the text (defaults to 'name')
 *
 * @example
 * ```tsx
 * type Choice = { id: number; name: string }
 * type NameType = ExtractChoiceText<Choice, 'name'> // string
 * ```
 */
export type ExtractChoiceText<
  T extends Record<string, unknown>,
  K extends keyof T = 'name' extends keyof T ? 'name' : never
> = K extends keyof T ? T[K] : unknown

/**
 * Alias types for specific input component contexts.
 * These provide semantic clarity while sharing the same underlying type.
 */

/** Choice type for AutocompleteInput - alias for SelectChoice */
export type AutocompleteChoice<T extends Record<string, unknown> = Record<string, unknown>> = SelectChoice<T>

/** Choice type for RadioButtonGroupInput - alias for SelectChoice */
export type RadioChoice<T extends Record<string, unknown> = Record<string, unknown>> = SelectChoice<T>

/** Choice type for SelectArrayInput - alias for SelectChoice */
export type SelectArrayChoice<T extends Record<string, unknown> = Record<string, unknown>> = SelectChoice<T>

/** Choice type for CheckboxGroupInput - alias for SelectChoice */
export type CheckboxChoice<T extends Record<string, unknown> = Record<string, unknown>> = SelectChoice<T>

/** Choice type for AutocompleteArrayInput - alias for SelectChoice */
export type AutocompleteArrayChoice<T extends Record<string, unknown> = Record<string, unknown>> = SelectChoice<T>

/**
 * Type for optionText prop that can be a string key, function, or React element
 *
 * The function form uses a permissive `any` parameter to allow strongly-typed
 * callbacks like `(choice: MyType) => string` to be passed without type errors.
 * This enables contravariant callback assignment without forcing users to cast.
 *
 * @template T - The choice type (used only for string key inference)
 */
export type OptionTextProp<T extends Record<string, unknown> = Record<string, unknown>> =
  | (keyof T & string)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Allows strongly-typed callbacks without casting; function contravariance requires wider type
  | ((choice: any) => string)
  | React.ReactElement

/**
 * Type for optionValue prop - must be a valid key of the choice type
 *
 * @template T - The choice type
 */
export type OptionValueProp<T extends Record<string, unknown> = Record<string, unknown>> = keyof T & string

// =============================================================================
// Type Guards for Choice Validation
// =============================================================================

/**
 * Type guard to check if an object is a valid record (non-null object).
 *
 * @param value - The value to check
 * @returns True if value is a non-null object
 *
 * @example
 * ```tsx
 * if (isRecord(choice)) {
 *   // choice is Record<string, unknown>
 * }
 * ```
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Type guard to check if a choice has the id/name pattern.
 *
 * @param choice - The choice object to check
 * @returns True if choice has id and name properties with valid types
 *
 * @example
 * ```tsx
 * const choice = { id: '1', name: 'Option 1' }
 * if (isIdNameChoice(choice)) {
 *   // choice.id is ChoiceValue, choice.name is string
 * }
 * ```
 */
export function isIdNameChoice(choice: unknown): choice is IdNameChoice {
  if (!isRecord(choice)) return false
  const { id, name } = choice
  return (
    (typeof id === 'string' || typeof id === 'number') &&
    typeof name === 'string'
  )
}

/**
 * Type guard to check if a choice has the value/label pattern.
 *
 * @param choice - The choice object to check
 * @returns True if choice has value and label properties with valid types
 *
 * @example
 * ```tsx
 * const choice = { value: 'us', label: 'United States' }
 * if (isValueLabelChoice(choice)) {
 *   // choice.value is ChoiceValue, choice.label is string
 * }
 * ```
 */
export function isValueLabelChoice(choice: unknown): choice is ValueLabelChoice {
  if (!isRecord(choice)) return false
  const { value, label } = choice
  return (
    (typeof value === 'string' || typeof value === 'number') &&
    typeof label === 'string'
  )
}

/**
 * Type guard to check if a choice is a valid BaseSelectChoice (either pattern).
 *
 * @param choice - The choice object to check
 * @returns True if choice is valid IdNameChoice or ValueLabelChoice
 *
 * @example
 * ```tsx
 * const choices = [{ id: '1', name: 'A' }, { value: '2', label: 'B' }]
 * const validChoices = choices.filter(isBaseSelectChoice)
 * ```
 */
export function isBaseSelectChoice(choice: unknown): choice is BaseSelectChoice {
  return isIdNameChoice(choice) || isValueLabelChoice(choice)
}

/**
 * Type guard to check if a value is a valid ChoiceValue (string or number).
 *
 * @param value - The value to check
 * @returns True if value is a string or number
 *
 * @example
 * ```tsx
 * if (isChoiceValue(choice.id)) {
 *   // choice.id is ChoiceValue
 * }
 * ```
 */
export function isChoiceValue(value: unknown): value is ChoiceValue {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Validates an array of choices, returning only valid ones.
 * Useful for runtime validation of choice arrays from external sources.
 *
 * @param choices - Array of potential choices
 * @param optionValue - The property name used for the value (default: 'id')
 * @param optionText - The property name used for the text (default: 'name')
 * @returns Array of valid choices
 *
 * @example
 * ```tsx
 * const apiData = await fetchChoices()
 * const validChoices = validateChoices(apiData)
 * // validChoices only contains objects with valid id/name or value/label
 * ```
 */
export function validateChoices<T extends Record<string, unknown>>(
  choices: unknown[],
  optionValue: string = 'id',
  optionText: string = 'name'
): T[] {
  return choices.filter((choice): choice is T => {
    if (!isRecord(choice)) return false
    const value = choice[optionValue]
    const text = choice[optionText]
    return isChoiceValue(value) && typeof text === 'string'
  })
}

/**
 * Gets the value from a choice using the specified key.
 * Returns undefined if the key doesn't exist or the value isn't valid.
 *
 * @param choice - The choice object
 * @param optionValue - The property name to use for the value (default: 'id')
 * @returns The choice value or undefined
 *
 * @example
 * ```tsx
 * const value = getChoiceValue(choice, 'id')
 * if (value !== undefined) {
 *   // value is ChoiceValue (string | number)
 * }
 * ```
 */
export function getChoiceValue(
  choice: Record<string, unknown>,
  optionValue: string = 'id'
): ChoiceValue | undefined {
  const value = choice[optionValue]
  return isChoiceValue(value) ? value : undefined
}

/**
 * Gets the display text from a choice using the specified key or function.
 *
 * @param choice - The choice object
 * @param optionText - Property name or function to get the text (default: 'name')
 * @returns The display text
 *
 * @example
 * ```tsx
 * const text = getChoiceText(choice, 'name')
 * const customText = getChoiceText(choice, (c) => `${c.firstName} ${c.lastName}`)
 * ```
 */
export function getChoiceText(
  choice: Record<string, unknown>,
  optionText: string | ((choice: Record<string, unknown>) => string) = 'name'
): string {
  if (typeof optionText === 'function') {
    return optionText(choice)
  }
  const text = choice[optionText]
  return typeof text === 'string' ? text : String(text ?? '')
}
