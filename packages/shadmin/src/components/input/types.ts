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
 * Base choice interface with generic type parameter for full type safety.
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
 *
 * @template T - The choice type (used only for string key inference)
 */
export type OptionTextProp<T extends Record<string, unknown> = Record<string, unknown>> =
  | (keyof T & string)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((choice: any) => string)
  | React.ReactElement

/**
 * Type for optionValue prop - must be a valid key of the choice type
 *
 * @template T - The choice type
 */
export type OptionValueProp<T extends Record<string, unknown> = Record<string, unknown>> = keyof T & string
