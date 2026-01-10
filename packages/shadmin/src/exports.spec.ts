/**
 * Export Verification Tests
 *
 * These tests verify that all expected components, hooks, and utilities
 * are properly exported from the shadmin package entry point.
 */

import { describe, it, expect } from 'vitest'

// Import everything from the main package entry point
import * as shadmin from './index'

describe('Package Exports', () => {
  describe('Field Components', () => {
    it('exports TextField', () => {
      expect(shadmin.TextField).toBeDefined()
      expect(typeof shadmin.TextField).toBe('function')
    })

    it('exports NumberField', () => {
      expect(shadmin.NumberField).toBeDefined()
      expect(typeof shadmin.NumberField).toBe('function')
    })

    it('exports DateField', () => {
      expect(shadmin.DateField).toBeDefined()
      expect(typeof shadmin.DateField).toBe('function')
    })

    it('exports BooleanField', () => {
      expect(shadmin.BooleanField).toBeDefined()
      expect(typeof shadmin.BooleanField).toBe('function')
    })

    it('exports EmailField', () => {
      expect(shadmin.EmailField).toBeDefined()
      expect(typeof shadmin.EmailField).toBe('function')
    })

    it('exports UrlField', () => {
      expect(shadmin.UrlField).toBeDefined()
      expect(typeof shadmin.UrlField).toBe('function')
    })

    it('exports ReferenceField', () => {
      expect(shadmin.ReferenceField).toBeDefined()
      expect(typeof shadmin.ReferenceField).toBe('function')
    })

    it('exports ReferenceArrayField', () => {
      expect(shadmin.ReferenceArrayField).toBeDefined()
      expect(typeof shadmin.ReferenceArrayField).toBe('function')
    })

    it('exports ReferenceManyField', () => {
      expect(shadmin.ReferenceManyField).toBeDefined()
      expect(typeof shadmin.ReferenceManyField).toBe('function')
    })

    it('exports FunctionField', () => {
      expect(shadmin.FunctionField).toBeDefined()
      expect(typeof shadmin.FunctionField).toBe('function')
    })

    it('exports ArrayField', () => {
      expect(shadmin.ArrayField).toBeDefined()
      expect(typeof shadmin.ArrayField).toBe('function')
    })

    it('exports RichTextField', () => {
      expect(shadmin.RichTextField).toBeDefined()
      expect(typeof shadmin.RichTextField).toBe('function')
    })

    it('exports ImageField', () => {
      expect(shadmin.ImageField).toBeDefined()
      expect(typeof shadmin.ImageField).toBe('function')
    })
  })

  describe('Input Components', () => {
    // Note: Input components use forwardRef which returns an object, not a function
    // We check for 'object' type since forwardRef components have $$typeof Symbol
    it('exports TextInput', () => {
      expect(shadmin.TextInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.TextInput)
    })

    it('exports NumberInput', () => {
      expect(shadmin.NumberInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.NumberInput)
    })

    it('exports BooleanInput', () => {
      expect(shadmin.BooleanInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.BooleanInput)
    })

    it('exports DateInput', () => {
      expect(shadmin.DateInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.DateInput)
    })

    it('exports DateTimeInput', () => {
      expect(shadmin.DateTimeInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.DateTimeInput)
    })

    it('exports SelectInput', () => {
      expect(shadmin.SelectInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.SelectInput)
    })

    it('exports AutocompleteInput', () => {
      expect(shadmin.AutocompleteInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.AutocompleteInput)
    })

    it('exports RadioButtonGroupInput', () => {
      expect(shadmin.RadioButtonGroupInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.RadioButtonGroupInput)
    })

    it('exports CheckboxGroupInput', () => {
      expect(shadmin.CheckboxGroupInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.CheckboxGroupInput)
    })

    it('exports ReferenceInput', () => {
      expect(shadmin.ReferenceInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.ReferenceInput)
    })

    it('exports ReferenceArrayInput', () => {
      expect(shadmin.ReferenceArrayInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.ReferenceArrayInput)
    })

    it('exports ArrayInput', () => {
      expect(shadmin.ArrayInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.ArrayInput)
    })

    it('exports FileInput', () => {
      expect(shadmin.FileInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.FileInput)
    })

    it('exports ImageInput', () => {
      expect(shadmin.ImageInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.ImageInput)
    })

    it('exports RichTextInput', () => {
      expect(shadmin.RichTextInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.RichTextInput)
    })

    it('exports PasswordInput', () => {
      expect(shadmin.PasswordInput).toBeDefined()
      expect(['function', 'object']).toContain(typeof shadmin.PasswordInput)
    })
  })

  describe('List Components', () => {
    it('exports Datagrid', () => {
      expect(shadmin.Datagrid).toBeDefined()
      expect(typeof shadmin.Datagrid).toBe('function')
    })

    it('exports SimpleList', () => {
      expect(shadmin.SimpleList).toBeDefined()
      expect(typeof shadmin.SimpleList).toBe('function')
    })

    it('exports List', () => {
      expect(shadmin.List).toBeDefined()
      expect(typeof shadmin.List).toBe('function')
    })

    it('exports ListBase', () => {
      expect(shadmin.ListBase).toBeDefined()
      expect(typeof shadmin.ListBase).toBe('function')
    })
  })

  describe('Layout Components', () => {
    it('exports Layout', () => {
      expect(shadmin.Layout).toBeDefined()
      expect(typeof shadmin.Layout).toBe('function')
    })

    it('exports Sidebar', () => {
      expect(shadmin.Sidebar).toBeDefined()
      expect(typeof shadmin.Sidebar).toBe('function')
    })

    it('exports Menu', () => {
      expect(shadmin.Menu).toBeDefined()
      // Menu is a forwardRef component (object) with static properties
      expect(typeof shadmin.Menu === 'function' || typeof shadmin.Menu === 'object').toBe(true)
    })

    it('exports MenuItem', () => {
      expect(shadmin.MenuItem).toBeDefined()
      // MenuItem is a forwardRef component (object)
      expect(typeof shadmin.MenuItem === 'function' || typeof shadmin.MenuItem === 'object').toBe(true)
    })

    it('exports AppBar', () => {
      expect(shadmin.AppBar).toBeDefined()
      expect(typeof shadmin.AppBar).toBe('function')
    })
  })

  describe('CRUD Components', () => {
    it('exports Create', () => {
      expect(shadmin.Create).toBeDefined()
      expect(typeof shadmin.Create).toBe('function')
    })

    it('exports CreateBase', () => {
      expect(shadmin.CreateBase).toBeDefined()
      expect(typeof shadmin.CreateBase).toBe('function')
    })

    it('exports Edit', () => {
      expect(shadmin.Edit).toBeDefined()
      expect(typeof shadmin.Edit).toBe('function')
    })

    it('exports EditBase', () => {
      expect(shadmin.EditBase).toBeDefined()
      expect(typeof shadmin.EditBase).toBe('function')
    })

    it('exports Show', () => {
      expect(shadmin.Show).toBeDefined()
      expect(typeof shadmin.Show).toBe('function')
    })

    it('exports ShowBase', () => {
      expect(shadmin.ShowBase).toBeDefined()
      expect(typeof shadmin.ShowBase).toBe('function')
    })

    it('exports SimpleForm', () => {
      expect(shadmin.SimpleForm).toBeDefined()
      expect(typeof shadmin.SimpleForm).toBe('function')
    })

    it('exports TabbedForm', () => {
      expect(shadmin.TabbedForm).toBeDefined()
      expect(typeof shadmin.TabbedForm).toBe('function')
    })
  })

  describe('Core Components', () => {
    it('exports Admin', () => {
      expect(shadmin.Admin).toBeDefined()
      expect(typeof shadmin.Admin).toBe('function')
    })

    it('exports Resource', () => {
      expect(shadmin.Resource).toBeDefined()
      // Resource is wrapped in memo(), which returns an object (MemoExoticComponent)
      expect(typeof shadmin.Resource).toMatch(/function|object/)
    })
  })

  describe('Context Hooks', () => {
    it('exports useRecordContext', () => {
      expect(shadmin.useRecordContext).toBeDefined()
      expect(typeof shadmin.useRecordContext).toBe('function')
    })

    it('exports useListContext', () => {
      expect(shadmin.useListContext).toBeDefined()
      expect(typeof shadmin.useListContext).toBe('function')
    })

    it('exports useFormContext', () => {
      expect(shadmin.useFormContext).toBeDefined()
      expect(typeof shadmin.useFormContext).toBe('function')
    })

    it('exports useResourceContext', () => {
      expect(shadmin.useResourceContext).toBeDefined()
      expect(typeof shadmin.useResourceContext).toBe('function')
    })

    it('exports useDataProvider', () => {
      expect(shadmin.useDataProvider).toBeDefined()
      expect(typeof shadmin.useDataProvider).toBe('function')
    })

    it('exports useAuthProvider', () => {
      expect(shadmin.useAuthProvider).toBeDefined()
      expect(typeof shadmin.useAuthProvider).toBe('function')
    })

    it('exports useNotify', () => {
      expect(shadmin.useNotify).toBeDefined()
      expect(typeof shadmin.useNotify).toBe('function')
    })

    it('exports useRedirect', () => {
      expect(shadmin.useRedirect).toBeDefined()
      expect(typeof shadmin.useRedirect).toBe('function')
    })

    it('exports useRefresh', () => {
      expect(shadmin.useRefresh).toBeDefined()
      expect(typeof shadmin.useRefresh).toBe('function')
    })

    it('exports useGetList', () => {
      expect(shadmin.useGetList).toBeDefined()
      expect(typeof shadmin.useGetList).toBe('function')
    })

    it('exports useGetOne', () => {
      expect(shadmin.useGetOne).toBeDefined()
      expect(typeof shadmin.useGetOne).toBe('function')
    })

    it('exports useGetMany', () => {
      expect(shadmin.useGetMany).toBeDefined()
      expect(typeof shadmin.useGetMany).toBe('function')
    })

    it('exports useCreate', () => {
      expect(shadmin.useCreate).toBeDefined()
      expect(typeof shadmin.useCreate).toBe('function')
    })

    it('exports useUpdate', () => {
      expect(shadmin.useUpdate).toBeDefined()
      expect(typeof shadmin.useUpdate).toBe('function')
    })

    it('exports useDelete', () => {
      expect(shadmin.useDelete).toBeDefined()
      expect(typeof shadmin.useDelete).toBe('function')
    })

    it('exports useLogin', () => {
      expect(shadmin.useLogin).toBeDefined()
      expect(typeof shadmin.useLogin).toBe('function')
    })

    it('exports useLogout', () => {
      expect(shadmin.useLogout).toBeDefined()
      expect(typeof shadmin.useLogout).toBe('function')
    })
  })
})
