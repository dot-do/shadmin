/**
 * Form Validation Performance Benchmarks
 *
 * Measures validation performance with different schema complexities
 * using both shadmin validators and Zod schemas.
 */

import { describe, bench } from 'vitest'
import { z } from 'zod'

import {
  required,
  minLength,
  maxLength,
  email,
  number,
  minValue,
  maxValue,
  regex,
  composeValidators,
  type Validator,
} from '../src/validation/validators'

// Test data
const validFormData = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  bio: 'A software developer with 10 years of experience in building web applications.',
  website: 'https://johndoe.dev',
  phone: '+1-555-0123',
  amount: 1500.50,
  status: 'active',
}

const invalidFormData = {
  name: '',
  email: 'not-an-email',
  age: -5,
  bio: 'Too short',
  website: 'not-a-url',
  phone: 'invalid',
  amount: -100,
  status: 'unknown',
}

// Shadmin Validators
const nameValidator = composeValidators([
  required('Name is required'),
  minLength(2, 'Name must be at least 2 characters'),
  maxLength(100, 'Name must be 100 characters or less'),
])

const emailValidator = composeValidators([
  required('Email is required'),
  email('Invalid email format'),
])

const ageValidator = composeValidators([
  required('Age is required'),
  number('Must be a number'),
  minValue(0, 'Age must be positive'),
  maxValue(150, 'Age must be realistic'),
])

const bioValidator = composeValidators([
  minLength(20, 'Bio must be at least 20 characters'),
  maxLength(1000, 'Bio must be 1000 characters or less'),
])

const urlValidator = regex(
  /^https?:\/\/.+\..+/,
  'Invalid URL format'
)

const phoneValidator = regex(
  /^\+?[\d\s-()]+$/,
  'Invalid phone format'
)

// Zod Schema (for comparison)
const zodSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().min(0).max(150),
  bio: z.string().min(20).max(1000),
  website: z.string().url(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/),
  amount: z.number().positive(),
  status: z.enum(['active', 'inactive', 'pending']),
})

// Complex nested schema
const complexZodSchema = z.object({
  user: z.object({
    profile: z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      avatar: z.string().url().optional(),
    }),
    preferences: z.object({
      theme: z.enum(['light', 'dark', 'system']),
      notifications: z.boolean(),
      language: z.string().min(2).max(5),
    }),
  }),
  billing: z.object({
    address: z.object({
      street: z.string().min(5).max(200),
      city: z.string().min(2).max(100),
      country: z.string().length(2),
      postal: z.string().min(3).max(20),
    }),
    payment: z.object({
      method: z.enum(['card', 'bank', 'paypal']),
      last4: z.string().length(4).optional(),
    }),
  }),
  items: z.array(z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(200),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1).max(100),
})

const complexFormData = {
  user: {
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    },
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en',
    },
  },
  billing: {
    address: {
      street: '123 Main Street',
      city: 'New York',
      country: 'US',
      postal: '10001',
    },
    payment: {
      method: 'card',
      last4: '4242',
    },
  },
  items: Array.from({ length: 10 }, (_, i) => ({
    id: `00000000-0000-0000-0000-00000000000${i}`,
    name: `Item ${i + 1}`,
    quantity: i + 1,
    price: (i + 1) * 10.99,
  })),
}

describe('Form Validation - Shadmin Validators', () => {
  bench('single required validator - valid', async () => {
    const validator = required()
    await validator('John Doe', null)
  })

  bench('single required validator - invalid', async () => {
    const validator = required()
    await validator('', null)
  })

  bench('composed validators (3) - valid', async () => {
    await nameValidator('John Doe', null)
  })

  bench('composed validators (3) - invalid (fails first)', async () => {
    await nameValidator('', null)
  })

  bench('composed validators (3) - invalid (fails last)', async () => {
    await nameValidator('A', null) // Passes required, fails minLength
  })

  bench('email validator - valid', async () => {
    await emailValidator('john@example.com', null)
  })

  bench('email validator - invalid', async () => {
    await emailValidator('not-an-email', null)
  })

  bench('validate all fields - valid form', async () => {
    await Promise.all([
      nameValidator(validFormData.name, validFormData),
      emailValidator(validFormData.email, validFormData),
      ageValidator(validFormData.age, validFormData),
      bioValidator(validFormData.bio, validFormData),
      urlValidator(validFormData.website, validFormData),
      phoneValidator(validFormData.phone, validFormData),
    ])
  })

  bench('validate all fields - invalid form', async () => {
    await Promise.all([
      nameValidator(invalidFormData.name, invalidFormData),
      emailValidator(invalidFormData.email, invalidFormData),
      ageValidator(invalidFormData.age, invalidFormData),
      bioValidator(invalidFormData.bio, invalidFormData),
      urlValidator(invalidFormData.website, invalidFormData),
      phoneValidator(invalidFormData.phone, invalidFormData),
    ])
  })
})

describe('Form Validation - Zod Schema', () => {
  bench('simple schema parse - valid', () => {
    zodSchema.safeParse(validFormData)
  })

  bench('simple schema parse - invalid', () => {
    zodSchema.safeParse(invalidFormData)
  })

  bench('complex nested schema parse - valid', () => {
    complexZodSchema.safeParse(complexFormData)
  })

  bench('complex nested schema - partial validation', () => {
    // Simulate validating just the user section
    const userSchema = complexZodSchema.shape.user
    userSchema.safeParse(complexFormData.user)
  })

  bench('array validation - 10 items', () => {
    const itemsSchema = complexZodSchema.shape.items
    itemsSchema.safeParse(complexFormData.items)
  })

  bench('array validation - 100 items', () => {
    const items100 = Array.from({ length: 100 }, (_, i) => ({
      id: `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`,
      name: `Item ${i + 1}`,
      quantity: i + 1,
      price: (i + 1) * 10.99,
    }))
    const itemsSchema = complexZodSchema.shape.items
    itemsSchema.safeParse(items100)
  })
})

describe('Form Validation - Regex Performance', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  bench('simple email regex - valid', () => {
    emailRegex.test('john@example.com')
  })

  bench('simple email regex - invalid', () => {
    emailRegex.test('not-an-email')
  })

  bench('complex URL regex - valid', () => {
    urlRegex.test('https://www.example.com/path?query=value#hash')
  })

  bench('complex URL regex - invalid', () => {
    urlRegex.test('not a url at all')
  })

  bench('UUID regex - valid', () => {
    uuidRegex.test('550e8400-e29b-41d4-a716-446655440000')
  })

  bench('batch regex validation - 100 emails', () => {
    const emails = Array.from({ length: 100 }, (_, i) => `user${i}@example.com`)
    let valid = 0
    for (const email of emails) {
      if (emailRegex.test(email)) valid++
    }
    return valid
  })
})

describe('Form Validation - Validator Creation', () => {
  bench('create required validator', () => {
    required('Field is required')
  })

  bench('create composed validators (5)', () => {
    composeValidators([
      required('Required'),
      minLength(2, 'Too short'),
      maxLength(100, 'Too long'),
      regex(/^[a-zA-Z\s]+$/, 'Letters only'),
      email('Invalid email'),
    ])
  })

  bench('create Zod schema (simple)', () => {
    z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      age: z.number().min(0).max(150),
    })
  })

  bench('create Zod schema (complex)', () => {
    z.object({
      user: z.object({
        name: z.string(),
        email: z.string().email(),
        profile: z.object({
          bio: z.string().max(1000),
          avatar: z.string().url().optional(),
        }),
      }),
      settings: z.array(z.object({
        key: z.string(),
        value: z.unknown(),
      })),
    })
  })
})
