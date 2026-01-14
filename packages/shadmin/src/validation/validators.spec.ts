/**
 * Validator Functions Tests
 *
 * Tests for ReactAdmin-compatible validator functions that work with
 * react-hook-form through an adapter layer.
 *
 * ReactAdmin uses: <TextInput validate={[required(), minLength(3)]} />
 * Shadmin uses: <TextInput rules={{ required: 'Required', minLength: { value: 3 } }} />
 *
 * These validators provide ReactAdmin-style API that can be used with the
 * validate prop adapter.
 *
 * TDD Phase: RED - These tests should FAIL because implementation doesn't exist yet.
 */

import { describe, it, expect, vi } from 'vitest'

import {
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  regex,
  email,
  choices,
  number,
  composeValidators,
  Validator,
  ValidatorResult,
} from './validators'

/**
 * Helper to test validators with multiple inputs
 */
const testValidator = async (
  validator: Validator,
  inputs: unknown[],
  expectedMessage: string | undefined
) => {
  const results = await Promise.all(
    inputs.map(input => validator(input, null, null))
  )
  const normalizedResults = results.map(result =>
    result && typeof result === 'object' && 'message' in result
      ? (result as { message: string }).message
      : result
  )

  expect(normalizedResults).toEqual(
    Array(inputs.length).fill(expectedMessage)
  )
}

describe('Validator Functions', () => {
  describe('required()', () => {
    it('should return a validator function', () => {
      const validator = required()
      expect(typeof validator).toBe('function')
    })

    it('should return undefined for non-empty values', async () => {
      await testValidator(required(), ['foo', 12, [1], { a: 1 }], undefined)
    })

    it('should return error message for empty values', async () => {
      await testValidator(
        required(),
        [undefined, '', null, []],
        'Required'
      )
    })

    it('should accept custom error message', async () => {
      await testValidator(
        required('This field is required'),
        [undefined, '', null],
        'This field is required'
      )
    })

    it('should have isRequired property for UI markers', () => {
      const validator = required()
      expect(validator.isRequired).toBe(true)
    })

    it('should accept message as callback function', async () => {
      const messageFn = vi.fn(() => 'Dynamic message')
      const validator = required(messageFn)

      await validator(undefined, null, null)

      expect(messageFn).toHaveBeenCalled()
      expect(messageFn).toHaveBeenCalledWith({
        value: undefined,
        values: null,
        args: undefined,
      })
    })
  })

  describe('minLength()', () => {
    it('should return a validator function', () => {
      const validator = minLength(5)
      expect(typeof validator).toBe('function')
    })

    it('should return undefined for empty values', async () => {
      await testValidator(minLength(5), [undefined, '', null], undefined)
    })

    it('should return undefined for non-string values', async () => {
      await testValidator(minLength(5), [1234, 123456], undefined)
    })

    it('should return undefined when value length equals minimum', async () => {
      await testValidator(minLength(5), ['12345'], undefined)
    })

    it('should return undefined when value length exceeds minimum', async () => {
      await testValidator(minLength(5), ['123456', 'hello world'], undefined)
    })

    it('should return error when value length is less than minimum', async () => {
      await testValidator(
        minLength(5),
        ['1234', '12', 'a'],
        'Must be at least 5 characters'
      )
    })

    it('should accept custom error message', async () => {
      await testValidator(
        minLength(5, 'Too short!'),
        ['1234'],
        'Too short!'
      )
    })

    it('should accept message as callback function', async () => {
      const messageFn = vi.fn(({ args }) => `Min ${args.min} chars`)
      const validator = minLength(5, messageFn)

      const result = await validator('abc', null, null)

      expect(messageFn).toHaveBeenCalledWith({
        value: 'abc',
        values: null,
        args: { min: 5 },
      })
      expect(result).toBe('Min 5 chars')
    })
  })

  describe('maxLength()', () => {
    it('should return a validator function', () => {
      const validator = maxLength(10)
      expect(typeof validator).toBe('function')
    })

    it('should return undefined for empty values', async () => {
      await testValidator(maxLength(5), [undefined, '', null], undefined)
    })

    it('should return undefined for non-string values', async () => {
      await testValidator(maxLength(5), [1234, 123456], undefined)
    })

    it('should return undefined when value length equals maximum', async () => {
      await testValidator(maxLength(5), ['12345'], undefined)
    })

    it('should return undefined when value length is less than maximum', async () => {
      await testValidator(maxLength(5), ['123', 'ab'], undefined)
    })

    it('should return error when value length exceeds maximum', async () => {
      await testValidator(
        maxLength(10),
        ['12345678901', 'this is way too long'],
        'Must be 10 characters or less'
      )
    })

    it('should accept custom error message', async () => {
      await testValidator(
        maxLength(10, 'Too long!'),
        ['12345678901'],
        'Too long!'
      )
    })

    it('should accept message as callback function', async () => {
      const messageFn = vi.fn(({ args }) => `Max ${args.max} chars`)
      const validator = maxLength(5, messageFn)

      const result = await validator('toolongvalue', null, null)

      expect(messageFn).toHaveBeenCalledWith({
        value: 'toolongvalue',
        values: null,
        args: { max: 5 },
      })
      expect(result).toBe('Max 5 chars')
    })
  })

  describe('minValue()', () => {
    it('should return a validator function', () => {
      const validator = minValue(5)
      expect(typeof validator).toBe('function')
    })

    it('should return undefined for empty values', async () => {
      await testValidator(minValue(5), [undefined, '', null], undefined)
    })

    it('should return undefined when value equals minimum', async () => {
      await testValidator(minValue(5), [5], undefined)
    })

    it('should return undefined when value exceeds minimum', async () => {
      await testValidator(minValue(5), [10, 5.5, '10'], undefined)
    })

    it('should return error when value is less than minimum', async () => {
      await testValidator(
        minValue(10),
        [1, 9.5, '5'],
        'Must be at least 10'
      )
    })

    it('should return error when value is 0 and minimum is positive', async () => {
      await testValidator(minValue(10), [0], 'Must be at least 10')
    })

    it('should accept custom error message', async () => {
      await testValidator(
        minValue(10, 'Value too low'),
        [5],
        'Value too low'
      )
    })

    it('should accept message as callback function', async () => {
      const messageFn = vi.fn(({ args }) => `Minimum is ${args.min}`)
      const validator = minValue(10, messageFn)

      const result = await validator(5, null, null)

      expect(messageFn).toHaveBeenCalledWith({
        value: 5,
        values: null,
        args: { min: 10 },
      })
      expect(result).toBe('Minimum is 10')
    })
  })

  describe('maxValue()', () => {
    it('should return a validator function', () => {
      const validator = maxValue(100)
      expect(typeof validator).toBe('function')
    })

    it('should return undefined for empty values', async () => {
      await testValidator(maxValue(5), [undefined, '', null], undefined)
    })

    it('should return undefined when value equals maximum', async () => {
      await testValidator(maxValue(5), [5], undefined)
    })

    it('should return undefined when value is less than maximum', async () => {
      await testValidator(maxValue(5), [4, 4.5, '4'], undefined)
    })

    it('should return error when value exceeds maximum', async () => {
      await testValidator(
        maxValue(10),
        [11, 10.5, '11'],
        'Must be 10 or less'
      )
    })

    it('should return undefined when value is 0', async () => {
      await testValidator(maxValue(10), [0], undefined)
    })

    it('should accept custom error message', async () => {
      await testValidator(
        maxValue(10, 'Value too high'),
        [15],
        'Value too high'
      )
    })

    it('should accept message as callback function', async () => {
      const messageFn = vi.fn(({ args }) => `Maximum is ${args.max}`)
      const validator = maxValue(10, messageFn)

      const result = await validator(15, null, null)

      expect(messageFn).toHaveBeenCalledWith({
        value: 15,
        values: null,
        args: { max: 10 },
      })
      expect(result).toBe('Maximum is 10')
    })
  })

  describe('regex()', () => {
    it('should return a validator function', () => {
      const validator = regex(/foo/, 'Must contain foo')
      expect(typeof validator).toBe('function')
    })

    it('should return undefined for empty values', async () => {
      await testValidator(regex(/foo/, 'not foo'), [undefined, '', null], undefined)
    })

    it('should return undefined for non-string values', async () => {
      await testValidator(regex(/foo/, 'not foo'), [1234, new Date()], undefined)
    })

    it('should return undefined when value matches pattern', async () => {
      await testValidator(
        regex(/foo/, 'not foo'),
        ['foobar', 'barfoo', 'barfoobar', 'foofoo'],
        undefined
      )
    })

    it('should return error when value does not match pattern', async () => {
      await testValidator(
        regex(/foo/, 'Must contain foo'),
        ['bar', 'barfo', 'hello, world'],
        'Must contain foo'
      )
    })

    it('should memoize validator with same pattern and message', () => {
      const validator1 = regex(/foo/, 'placeholder')
      const validator2 = regex(/foo/, 'placeholder')
      expect(validator1).toBe(validator2)
    })

    it('should create new validator for different pattern', () => {
      const validator1 = regex(/foo/, 'placeholder')
      const validator2 = regex(/bar/, 'placeholder')
      expect(validator1).not.toBe(validator2)
    })

    it('should create new validator for different message', () => {
      const validator1 = regex(/foo/, 'message1')
      const validator2 = regex(/foo/, 'message2')
      expect(validator1).not.toBe(validator2)
    })
  })

  describe('email()', () => {
    it('should return a validator function', () => {
      const validator = email()
      expect(typeof validator).toBe('function')
    })

    it('should return undefined for empty values', async () => {
      await testValidator(email(), [undefined, '', null], undefined)
    })

    it('should return undefined for non-string values', async () => {
      await testValidator(email(), [1234, new Date()], undefined)
    })

    it('should return undefined for valid email addresses', async () => {
      await testValidator(
        email(),
        [
          'foo@bar.com',
          'john.doe@mydomain.co.uk',
          'user+tag@example.org',
          'test123@test.io',
        ],
        undefined
      )
    })

    it('should return error for invalid email addresses', async () => {
      await testValidator(
        email(),
        ['foo@bar', 'hello, world', '@missing.com', 'no-at-sign.com'],
        'Invalid email address'
      )
    })

    it('should accept custom error message', async () => {
      await testValidator(
        email('Please enter a valid email'),
        ['invalid'],
        'Please enter a valid email'
      )
    })
  })

  describe('choices()', () => {
    it('should return a validator function', () => {
      const validator = choices(['a', 'b', 'c'], 'Invalid choice')
      expect(typeof validator).toBe('function')
    })

    it('should return undefined for empty values', async () => {
      await testValidator(
        choices([1, 2], 'error'),
        [undefined, '', null],
        undefined
      )
    })

    it('should return undefined when value is in the choice list', async () => {
      await testValidator(choices([1, 2, 3], 'error'), [1, 2, 3], undefined)
    })

    it('should return undefined for string choices', async () => {
      await testValidator(
        choices(['apple', 'banana', 'cherry'], 'error'),
        ['apple', 'banana', 'cherry'],
        undefined
      )
    })

    it('should return error when value is not in the choice list', async () => {
      await testValidator(
        choices([1, 2], 'Must be 1 or 2'),
        ['hello', 3, 4],
        'Must be 1 or 2'
      )
    })

    it('should accept message as callback function', async () => {
      const messageFn = vi.fn(({ args }) => `Choose from: ${args.choices.join(', ')}`)
      const validator = choices(['a', 'b'], messageFn)

      const result = await validator('c', null, null)

      expect(messageFn).toHaveBeenCalledWith({
        value: 'c',
        values: null,
        args: { choices: ['a', 'b'] },
      })
      expect(result).toBe('Choose from: a, b')
    })
  })

  describe('number()', () => {
    it('should return a validator function', () => {
      const validator = number()
      expect(typeof validator).toBe('function')
    })

    it('should return undefined for empty values', async () => {
      await testValidator(number(), [undefined, '', null], undefined)
    })

    it('should return undefined for valid numbers', async () => {
      await testValidator(number(), [123, '123', 0, 2.5, -5, '3.14'], undefined)
    })

    it('should return error for non-numeric values', async () => {
      await testValidator(
        number(),
        ['foo', 'abc123', 'NaN'],
        'Must be a number'
      )
    })

    it('should accept custom error message', async () => {
      await testValidator(
        number('Please enter a valid number'),
        ['not-a-number'],
        'Please enter a valid number'
      )
    })
  })
})

describe('Validator Composition', () => {
  describe('composeValidators()', () => {
    it('should return a validator function', () => {
      const composed = composeValidators([required()])
      expect(typeof composed).toBe('function')
    })

    it('should run all validators in array', async () => {
      const validator = composeValidators([
        required(),
        minLength(5),
      ])

      // Empty value should fail on required
      expect(await validator('', null, null)).toBe('Required')

      // Short value should fail on minLength
      expect(await validator('abc', null, null)).toBe('Must be at least 5 characters')

      // Valid value should pass
      expect(await validator('hello', null, null)).toBeUndefined()
    })

    it('should accept validators as spread arguments', async () => {
      const validator = composeValidators(
        required(),
        minLength(5),
        maxLength(10)
      )

      expect(await validator('', null, null)).toBe('Required')
      expect(await validator('abc', null, null)).toBe('Must be at least 5 characters')
      expect(await validator('12345678901', null, null)).toBe('Must be 10 characters or less')
      expect(await validator('hello', null, null)).toBeUndefined()
    })

    it('should return first error encountered', async () => {
      const validator = composeValidators([
        required(),
        minLength(5),
        maxLength(10),
      ])

      // Empty value hits required first
      const result = await validator('', null, null)
      expect(result).toBe('Required')
    })

    it('should short-circuit on first error (not run remaining validators)', async () => {
      const secondValidator = vi.fn(() => 'Second error')

      const validator = composeValidators([
        required(),
        secondValidator,
      ])

      await validator('', null, null)

      // Second validator should not be called because required failed
      expect(secondValidator).not.toHaveBeenCalled()
    })

    it('should handle async validators', async () => {
      const asyncValidator = vi.fn(async (value: unknown) => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 10))
        return value === 'taken' ? 'Username already taken' : undefined
      })

      const validator = composeValidators([
        required(),
        asyncValidator,
      ])

      expect(await validator('taken', null, null)).toBe('Username already taken')
      expect(await validator('available', null, null)).toBeUndefined()
    })

    it('should handle mixed sync and async validators', async () => {
      const asyncValidator = vi.fn(async (value: unknown) => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return (value as string).includes('bad') ? 'Contains bad word' : undefined
      })

      const validator = composeValidators([
        required(),
        minLength(3),
        asyncValidator,
      ])

      // Sync validators should fail first
      expect(await validator('', null, null)).toBe('Required')
      expect(await validator('ab', null, null)).toBe('Must be at least 3 characters')

      // Async validator should run if sync validators pass
      expect(await validator('bad word', null, null)).toBe('Contains bad word')
      expect(await validator('good', null, null)).toBeUndefined()
    })

    it('should pass values context to all validators', async () => {
      const customValidator = vi.fn((_value, values) => {
        if (values?.password !== values?.confirmPassword) {
          return 'Passwords must match'
        }
        return undefined
      })

      const validator = composeValidators([customValidator])
      const formValues = { password: 'secret', confirmPassword: 'secret' }

      await validator('secret', formValues, null)

      expect(customValidator).toHaveBeenCalledWith('secret', formValues, null)
    })

    it('should return undefined when all validators pass', async () => {
      const validator = composeValidators([
        required(),
        minLength(3),
        maxLength(10),
      ])

      expect(await validator('hello', null, null)).toBeUndefined()
    })

    it('should handle empty validator array', async () => {
      const validator = composeValidators([])
      expect(await validator('anything', null, null)).toBeUndefined()
    })
  })
})

describe('Validator Types', () => {
  it('should export Validator type', () => {
    // Type check - this should compile
    const myValidator: Validator = (value, _values, _props) => {
      return value ? undefined : 'Error'
    }
    expect(typeof myValidator).toBe('function')
  })

  it('should export ValidatorResult type', () => {
    // Type check - ValidatorResult should be string | undefined | Promise<string | undefined>
    const syncResult: ValidatorResult = undefined
    const errorResult: ValidatorResult = 'Error message'
    const promiseResult: ValidatorResult = Promise.resolve('Async error')

    expect(syncResult).toBeUndefined()
    expect(errorResult).toBe('Error message')
    expect(promiseResult).toBeInstanceOf(Promise)
  })
})
