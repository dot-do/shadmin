/**
 * Runtime tests for SelectChoice type guards and validation utilities
 */
import { describe, it, expect } from 'vitest'

import {
  isRecord,
  isChoiceValue,
  isIdNameChoice,
  isValueLabelChoice,
  isBaseSelectChoice,
  validateChoices,
  getChoiceValue,
  getChoiceText,
} from './types'

describe('Choice Type Guards', () => {
  describe('isRecord', () => {
    it('returns true for plain objects', () => {
      expect(isRecord({})).toBe(true)
      expect(isRecord({ id: '1' })).toBe(true)
    })

    it('returns false for non-objects', () => {
      expect(isRecord(null)).toBe(false)
      expect(isRecord(undefined)).toBe(false)
      expect(isRecord('string')).toBe(false)
      expect(isRecord(123)).toBe(false)
      expect(isRecord([])).toBe(false)
    })
  })

  describe('isChoiceValue', () => {
    it('returns true for strings and numbers', () => {
      expect(isChoiceValue('test')).toBe(true)
      expect(isChoiceValue(123)).toBe(true)
      expect(isChoiceValue(0)).toBe(true)
      expect(isChoiceValue('')).toBe(true)
    })

    it('returns false for non-string/number values', () => {
      expect(isChoiceValue(null)).toBe(false)
      expect(isChoiceValue(undefined)).toBe(false)
      expect(isChoiceValue({})).toBe(false)
      expect(isChoiceValue([])).toBe(false)
      expect(isChoiceValue(true)).toBe(false)
    })
  })

  describe('isIdNameChoice', () => {
    it('returns true for objects with id and name', () => {
      expect(isIdNameChoice({ id: '1', name: 'Test' })).toBe(true)
      expect(isIdNameChoice({ id: 123, name: 'Numeric ID' })).toBe(true)
      expect(isIdNameChoice({ id: '1', name: 'Test', extra: 'data' })).toBe(true)
    })

    it('returns false for objects without id or name', () => {
      expect(isIdNameChoice({ id: '1' })).toBe(false)
      expect(isIdNameChoice({ name: 'Test' })).toBe(false)
      expect(isIdNameChoice({})).toBe(false)
    })

    it('returns false for invalid id or name types', () => {
      expect(isIdNameChoice({ id: true, name: 'Test' })).toBe(false)
      expect(isIdNameChoice({ id: '1', name: 123 })).toBe(false)
      expect(isIdNameChoice({ id: {}, name: 'Test' })).toBe(false)
    })
  })

  describe('isValueLabelChoice', () => {
    it('returns true for objects with value and label', () => {
      expect(isValueLabelChoice({ value: 'us', label: 'United States' })).toBe(true)
      expect(isValueLabelChoice({ value: 1, label: 'First' })).toBe(true)
      expect(isValueLabelChoice({ value: 'x', label: 'Y', extra: 'data' })).toBe(true)
    })

    it('returns false for objects without value or label', () => {
      expect(isValueLabelChoice({ value: 'us' })).toBe(false)
      expect(isValueLabelChoice({ label: 'Test' })).toBe(false)
      expect(isValueLabelChoice({})).toBe(false)
    })

    it('returns false for invalid value or label types', () => {
      expect(isValueLabelChoice({ value: true, label: 'Test' })).toBe(false)
      expect(isValueLabelChoice({ value: 'us', label: 123 })).toBe(false)
    })
  })

  describe('isBaseSelectChoice', () => {
    it('returns true for IdNameChoice', () => {
      expect(isBaseSelectChoice({ id: '1', name: 'Test' })).toBe(true)
    })

    it('returns true for ValueLabelChoice', () => {
      expect(isBaseSelectChoice({ value: 'us', label: 'United States' })).toBe(true)
    })

    it('returns false for invalid choices', () => {
      expect(isBaseSelectChoice({})).toBe(false)
      expect(isBaseSelectChoice({ id: '1' })).toBe(false)
      expect(isBaseSelectChoice(null)).toBe(false)
    })
  })
})

describe('Choice Validation Utilities', () => {
  describe('validateChoices', () => {
    it('filters out invalid choices', () => {
      const input = [
        { id: '1', name: 'Valid 1' },
        { invalid: 'data' },
        { id: '2', name: 'Valid 2' },
        null,
        { id: '3' }, // missing name
      ]
      const result = validateChoices(input)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ id: '1', name: 'Valid 1' })
      expect(result[1]).toEqual({ id: '2', name: 'Valid 2' })
    })

    it('supports custom optionValue and optionText', () => {
      const input = [
        { code: 'US', title: 'United States' },
        { code: 'UK', title: 'United Kingdom' },
        { invalid: 'data' },
      ]
      const result = validateChoices(input, 'code', 'title')
      expect(result).toHaveLength(2)
    })

    it('returns empty array for all invalid input', () => {
      const input = [null, undefined, 'string', 123]
      const result = validateChoices(input as unknown[])
      expect(result).toHaveLength(0)
    })
  })

  describe('getChoiceValue', () => {
    it('returns the value for the given key', () => {
      expect(getChoiceValue({ id: '123', name: 'Test' }, 'id')).toBe('123')
      expect(getChoiceValue({ id: 456, name: 'Test' }, 'id')).toBe(456)
    })

    it('returns undefined for missing or invalid values', () => {
      expect(getChoiceValue({ name: 'Test' }, 'id')).toBeUndefined()
      expect(getChoiceValue({ id: true, name: 'Test' }, 'id')).toBeUndefined()
      expect(getChoiceValue({ id: {}, name: 'Test' }, 'id')).toBeUndefined()
    })

    it('uses "id" as default key', () => {
      expect(getChoiceValue({ id: '123', name: 'Test' })).toBe('123')
    })
  })

  describe('getChoiceText', () => {
    it('returns the text for the given key', () => {
      expect(getChoiceText({ id: '1', name: 'Test' }, 'name')).toBe('Test')
      expect(getChoiceText({ id: '1', label: 'Label' }, 'label')).toBe('Label')
    })

    it('converts non-string values to string', () => {
      expect(getChoiceText({ id: '1', name: 123 }, 'name')).toBe('123')
      expect(getChoiceText({ id: '1', name: null }, 'name')).toBe('')
    })

    it('supports function for optionText', () => {
      const choice = { firstName: 'John', lastName: 'Doe' }
      const getText = (c: Record<string, unknown>) => `${c.firstName} ${c.lastName}`
      expect(getChoiceText(choice, getText)).toBe('John Doe')
    })

    it('uses "name" as default key', () => {
      expect(getChoiceText({ id: '1', name: 'Default' })).toBe('Default')
    })
  })
})

describe('Backward Compatibility', () => {
  it('SelectChoice accepts loose typing for backwards compatibility', () => {
    // This test verifies the default generic allows any record
    const choice: Record<string, unknown> = { id: 1, name: 'Test', custom: 'field' }
    expect(getChoiceValue(choice)).toBe(1)
    expect(getChoiceText(choice)).toBe('Test')
  })
})
