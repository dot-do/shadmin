/**
 * Validation Adapter
 *
 * Converts ReactAdmin-style validator functions to react-hook-form rules.
 * This allows the familiar ReactAdmin `validate` prop API while using
 * react-hook-form under the hood.
 */

import type { RegisterOptions, FieldValues, Path } from 'react-hook-form'
import type { Validator } from './validators'

/**
 * Type for the validate prop - can be a single validator or array of validators
 */
export type ValidateProp = Validator | Validator[]

/**
 * Check if any validator in the list is a required validator
 */
export function hasRequiredValidator(validate: ValidateProp | undefined): boolean {
  if (!validate) return false

  const validators = Array.isArray(validate) ? validate : [validate]
  return validators.some(v => v.isRequired === true)
}

/**
 * Convert ReactAdmin-style validators to react-hook-form validate function
 */
export function adaptValidators<T extends FieldValues>(
  validators: ValidateProp | undefined
): RegisterOptions<T>['validate'] | undefined {
  if (!validators) return undefined

  const validatorList = Array.isArray(validators) ? validators : [validators]

  if (validatorList.length === 0) return undefined

  return async (value: unknown, formValues: T): Promise<string | true> => {
    for (const validator of validatorList) {
      const error = await validator(value, formValues, null)
      if (error) {
        return error
      }
    }
    return true
  }
}

/**
 * Merge validate prop with existing rules
 * The validate validators run first, then the rules validators
 */
export function mergeValidation<T extends FieldValues, P extends Path<T>>(
  validate: ValidateProp | undefined,
  rules: RegisterOptions<T, P> | undefined
): RegisterOptions<T, P> {
  const adaptedValidate = adaptValidators<T>(validate)

  if (!adaptedValidate && !rules) {
    return {} as RegisterOptions<T, P>
  }

  if (!adaptedValidate) {
    return rules || ({} as RegisterOptions<T, P>)
  }

  if (!rules) {
    return {
      validate: adaptedValidate,
    } as RegisterOptions<T, P>
  }

  // Merge validate and rules
  // The adapted validators run as part of the validate function
  // We need to combine with any existing validate from rules
  const existingValidate = rules.validate

  const combinedValidate = async (value: unknown, formValues: T): Promise<string | true> => {
    // Run adapted validators first
    const adaptedResult = await adaptedValidate(value, formValues)
    if (adaptedResult !== true) {
      return adaptedResult
    }

    // Then run existing validate from rules if present
    if (existingValidate) {
      if (typeof existingValidate === 'function') {
        const result = await existingValidate(value, formValues)
        if (result !== true && result !== undefined) {
          return result as string
        }
      } else if (typeof existingValidate === 'object') {
        // It's an object of validator functions
        for (const [key, validator] of Object.entries(existingValidate)) {
          if (typeof validator === 'function') {
            const result = await (validator as (v: unknown, fv: T) => string | true | Promise<string | true>)(value, formValues)
            if (result !== true && result !== undefined) {
              return result as string
            }
          }
        }
      }
    }

    return true
  }

  return {
    ...rules,
    validate: combinedValidate,
  } as RegisterOptions<T, P>
}
