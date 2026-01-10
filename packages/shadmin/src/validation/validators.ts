/**
 * Validator Functions
 *
 * ReactAdmin-compatible validator functions for use with the `validate` prop.
 * These validators provide a familiar API for developers coming from ReactAdmin
 * while integrating seamlessly with react-hook-form under the hood.
 */

/**
 * Result type for validators - can be sync string/undefined or async Promise
 */
export type ValidatorResult = string | undefined | Promise<string | undefined>

/**
 * Validator function signature compatible with ReactAdmin
 */
export type Validator = ((
  value: unknown,
  values: Record<string, unknown> | null,
  props: unknown
) => ValidatorResult) & {
  isRequired?: boolean
}

/**
 * Message can be a string or a function that returns a string
 */
export type MessageFunc = (params: {
  value: unknown
  values: Record<string, unknown> | null
  args: Record<string, unknown> | undefined
}) => string

export type Message = string | MessageFunc

/**
 * Helper to resolve message - handles both string and function messages
 */
const resolveMessage = (
  message: Message | undefined,
  defaultMessage: string,
  value: unknown,
  values: Record<string, unknown> | null,
  args?: Record<string, unknown>
): string => {
  if (typeof message === 'function') {
    return message({ value, values, args })
  }
  return message ?? defaultMessage
}

/**
 * Helper to check if a value is empty
 */
const isEmpty = (value: unknown): boolean => {
  if (value === undefined || value === null || value === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  return false
}

/**
 * Required validator - ensures the field has a value
 */
export function required(message?: Message): Validator {
  const validator: Validator = (
    value: unknown,
    values: Record<string, unknown> | null,
    props: unknown
  ): ValidatorResult => {
    if (isEmpty(value)) {
      return resolveMessage(message, 'Required', value, values, undefined)
    }
    return undefined
  }
  validator.isRequired = true
  return validator
}

/**
 * Minimum length validator - ensures string has at least min characters
 */
export function minLength(min: number, message?: Message): Validator {
  const validator: Validator = (
    value: unknown,
    values: Record<string, unknown> | null,
    props: unknown
  ): ValidatorResult => {
    // Empty values are valid (use required() for mandatory fields)
    if (isEmpty(value)) return undefined
    // Non-string values pass (not applicable)
    if (typeof value !== 'string') return undefined

    if (value.length < min) {
      return resolveMessage(
        message,
        `Must be at least ${min} characters`,
        value,
        values,
        { min }
      )
    }
    return undefined
  }
  return validator
}

/**
 * Maximum length validator - ensures string has at most max characters
 */
export function maxLength(max: number, message?: Message): Validator {
  const validator: Validator = (
    value: unknown,
    values: Record<string, unknown> | null,
    props: unknown
  ): ValidatorResult => {
    // Empty values are valid
    if (isEmpty(value)) return undefined
    // Non-string values pass (not applicable)
    if (typeof value !== 'string') return undefined

    if (value.length > max) {
      return resolveMessage(
        message,
        `Must be ${max} characters or less`,
        value,
        values,
        { max }
      )
    }
    return undefined
  }
  return validator
}

/**
 * Minimum value validator - ensures number is at least min
 */
export function minValue(min: number, message?: Message): Validator {
  const validator: Validator = (
    value: unknown,
    values: Record<string, unknown> | null,
    props: unknown
  ): ValidatorResult => {
    // Empty values are valid
    if (isEmpty(value)) return undefined

    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (typeof numValue !== 'number' || isNaN(numValue)) return undefined

    if (numValue < min) {
      return resolveMessage(
        message,
        `Must be at least ${min}`,
        value,
        values,
        { min }
      )
    }
    return undefined
  }
  return validator
}

/**
 * Maximum value validator - ensures number is at most max
 */
export function maxValue(max: number, message?: Message): Validator {
  const validator: Validator = (
    value: unknown,
    values: Record<string, unknown> | null,
    props: unknown
  ): ValidatorResult => {
    // Empty values are valid
    if (isEmpty(value)) return undefined

    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (typeof numValue !== 'number' || isNaN(numValue)) return undefined

    if (numValue > max) {
      return resolveMessage(
        message,
        `Must be ${max} or less`,
        value,
        values,
        { max }
      )
    }
    return undefined
  }
  return validator
}

// Memoization cache for regex validators
const regexValidatorCache = new Map<string, Validator>()

/**
 * Regex validator - ensures value matches the given pattern
 * Memoizes validators with same pattern and message for performance
 */
export function regex(pattern: RegExp, message: Message): Validator {
  const cacheKey = `${pattern.source}|${pattern.flags}|${typeof message === 'function' ? 'fn' : message}`

  const cached = regexValidatorCache.get(cacheKey)
  if (cached) return cached

  const validator: Validator = (
    value: unknown,
    values: Record<string, unknown> | null,
    props: unknown
  ): ValidatorResult => {
    // Empty values are valid
    if (isEmpty(value)) return undefined
    // Non-string values pass
    if (typeof value !== 'string') return undefined

    if (!pattern.test(value)) {
      return resolveMessage(message, 'Invalid format', value, values, { pattern })
    }
    return undefined
  }

  regexValidatorCache.set(cacheKey, validator)
  return validator
}

// Email pattern - matches common email formats
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Email validator - ensures value is a valid email address
 */
export function email(message?: Message): Validator {
  const validator: Validator = (
    value: unknown,
    values: Record<string, unknown> | null,
    props: unknown
  ): ValidatorResult => {
    // Empty values are valid
    if (isEmpty(value)) return undefined
    // Non-string values pass
    if (typeof value !== 'string') return undefined

    if (!EMAIL_REGEX.test(value)) {
      return resolveMessage(message, 'Invalid email address', value, values, undefined)
    }
    return undefined
  }
  return validator
}

/**
 * Choices validator - ensures value is one of the allowed choices
 */
export function choices(list: unknown[], message: Message): Validator {
  const validator: Validator = (
    value: unknown,
    values: Record<string, unknown> | null,
    props: unknown
  ): ValidatorResult => {
    // Empty values are valid
    if (isEmpty(value)) return undefined

    if (!list.includes(value)) {
      return resolveMessage(message, 'Invalid choice', value, values, { choices: list })
    }
    return undefined
  }
  return validator
}

/**
 * Number validator - ensures value is a valid number
 */
export function number(message?: Message): Validator {
  const validator: Validator = (
    value: unknown,
    values: Record<string, unknown> | null,
    props: unknown
  ): ValidatorResult => {
    // Empty values are valid
    if (isEmpty(value)) return undefined

    // Actual numbers are valid
    if (typeof value === 'number' && !isNaN(value)) return undefined

    // Strings that can be parsed as numbers are valid
    if (typeof value === 'string') {
      const parsed = parseFloat(value)
      if (!isNaN(parsed)) return undefined
    }

    return resolveMessage(message, 'Must be a number', value, values, undefined)
  }
  return validator
}

/**
 * Compose multiple validators into a single validator function.
 * Runs validators in order and returns the first error encountered.
 */
export function composeValidators(
  validators: Validator[] | Validator,
  ...rest: Validator[]
): Validator {
  // Handle both array and spread argument forms
  const validatorList = Array.isArray(validators)
    ? validators
    : [validators, ...rest]

  const validator: Validator = async (
    value: unknown,
    values: Record<string, unknown> | null,
    props: unknown
  ): Promise<string | undefined> => {
    for (const v of validatorList) {
      const result = await v(value, values, props)
      if (result !== undefined) {
        return result
      }
    }
    return undefined
  }
  return validator
}
