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

  // ============================================================================
  // RA-CORE RE-EXPORTS
  // These tests verify that all ra-core APIs are accessible through shadmin
  // for drop-in react-admin compatibility
  // ============================================================================

  describe('ra-core Validators', () => {
    it('exports required', () => {
      expect(shadmin.required).toBeDefined()
      expect(typeof shadmin.required).toBe('function')
    })

    it('exports minLength', () => {
      expect(shadmin.minLength).toBeDefined()
      expect(typeof shadmin.minLength).toBe('function')
    })

    it('exports maxLength', () => {
      expect(shadmin.maxLength).toBeDefined()
      expect(typeof shadmin.maxLength).toBe('function')
    })

    it('exports minValue', () => {
      expect(shadmin.minValue).toBeDefined()
      expect(typeof shadmin.minValue).toBe('function')
    })

    it('exports maxValue', () => {
      expect(shadmin.maxValue).toBeDefined()
      expect(typeof shadmin.maxValue).toBe('function')
    })

    it('exports number', () => {
      expect(shadmin.number).toBeDefined()
      expect(typeof shadmin.number).toBe('function')
    })

    it('exports regex', () => {
      expect(shadmin.regex).toBeDefined()
      expect(typeof shadmin.regex).toBe('function')
    })

    it('exports email', () => {
      expect(shadmin.email).toBeDefined()
      expect(typeof shadmin.email).toBe('function')
    })

    it('exports choices', () => {
      expect(shadmin.choices).toBeDefined()
      expect(typeof shadmin.choices).toBe('function')
    })

    it('exports composeValidators', () => {
      expect(shadmin.composeValidators).toBeDefined()
      expect(typeof shadmin.composeValidators).toBe('function')
    })
  })

  describe('ra-core Controller Hooks', () => {
    it('exports useEditController', () => {
      expect(shadmin.useEditController).toBeDefined()
      expect(typeof shadmin.useEditController).toBe('function')
    })

    it('exports useListController', () => {
      expect(shadmin.useListController).toBeDefined()
      expect(typeof shadmin.useListController).toBe('function')
    })

    it('exports useShowController', () => {
      expect(shadmin.useShowController).toBeDefined()
      expect(typeof shadmin.useShowController).toBe('function')
    })

    it('exports useCreateController', () => {
      expect(shadmin.useCreateController).toBeDefined()
      expect(typeof shadmin.useCreateController).toBe('function')
    })
  })

  describe('ra-core Context Providers', () => {
    it('exports EditContextProvider', () => {
      expect(shadmin.EditContextProvider).toBeDefined()
      expect(typeof shadmin.EditContextProvider).toBe('function')
    })

    it('exports ListContextProvider', () => {
      expect(shadmin.ListContextProvider).toBeDefined()
      expect(typeof shadmin.ListContextProvider).toBe('function')
    })

    it('exports ShowContextProvider', () => {
      expect(shadmin.ShowContextProvider).toBeDefined()
      expect(typeof shadmin.ShowContextProvider).toBe('function')
    })

    it('exports CreateContextProvider', () => {
      expect(shadmin.CreateContextProvider).toBeDefined()
      expect(typeof shadmin.CreateContextProvider).toBe('function')
    })

    it('exports RecordContextProvider', () => {
      expect(shadmin.RecordContextProvider).toBeDefined()
      expect(typeof shadmin.RecordContextProvider).toBe('function')
    })
  })

  describe('ra-core Selection Hooks', () => {
    it('exports useUnselectAll', () => {
      expect(shadmin.useUnselectAll).toBeDefined()
      expect(typeof shadmin.useUnselectAll).toBe('function')
    })

    it('exports useRecordSelection', () => {
      expect(shadmin.useRecordSelection).toBeDefined()
      expect(typeof shadmin.useRecordSelection).toBe('function')
    })

    it('exports useSelectAll', () => {
      expect(shadmin.useSelectAll).toBeDefined()
      expect(typeof shadmin.useSelectAll).toBe('function')
    })

    it('exports useUnselect', () => {
      expect(shadmin.useUnselect).toBeDefined()
      expect(typeof shadmin.useUnselect).toBe('function')
    })
  })

  describe('ra-core Export Utilities', () => {
    it('exports fetchRelatedRecords', () => {
      expect(shadmin.fetchRelatedRecords).toBeDefined()
      expect(typeof shadmin.fetchRelatedRecords).toBe('function')
    })

    it('exports downloadCSV', () => {
      expect(shadmin.downloadCSV).toBeDefined()
      expect(typeof shadmin.downloadCSV).toBe('function')
    })

    it('exports defaultExporter', () => {
      expect(shadmin.defaultExporter).toBeDefined()
      expect(typeof shadmin.defaultExporter).toBe('function')
    })
  })

  describe('ra-core Routing Hooks', () => {
    it('exports useCreatePath', () => {
      expect(shadmin.useCreatePath).toBeDefined()
      expect(typeof shadmin.useCreatePath).toBe('function')
    })

    it('exports useBasename', () => {
      expect(shadmin.useBasename).toBeDefined()
      expect(typeof shadmin.useBasename).toBe('function')
    })

    it('exports useGetPathForRecord', () => {
      expect(shadmin.useGetPathForRecord).toBeDefined()
      expect(typeof shadmin.useGetPathForRecord).toBe('function')
    })
  })

  describe('ra-core Auth Hooks', () => {
    it('exports useAuthenticated', () => {
      expect(shadmin.useAuthenticated).toBeDefined()
      expect(typeof shadmin.useAuthenticated).toBe('function')
    })

    it('exports useCheckAuth', () => {
      expect(shadmin.useCheckAuth).toBeDefined()
      expect(typeof shadmin.useCheckAuth).toBe('function')
    })

    it('exports useGetIdentity', () => {
      expect(shadmin.useGetIdentity).toBeDefined()
      expect(typeof shadmin.useGetIdentity).toBe('function')
    })

    it('exports useLogoutIfAccessDenied', () => {
      expect(shadmin.useLogoutIfAccessDenied).toBeDefined()
      expect(typeof shadmin.useLogoutIfAccessDenied).toBe('function')
    })
  })

  describe('ra-core Data Hooks', () => {
    it('exports useExpanded', () => {
      expect(shadmin.useExpanded).toBeDefined()
      expect(typeof shadmin.useExpanded).toBe('function')
    })

    it('exports useInfiniteGetList', () => {
      expect(shadmin.useInfiniteGetList).toBeDefined()
      expect(typeof shadmin.useInfiniteGetList).toBe('function')
    })

    it('exports usePaginationState', () => {
      expect(shadmin.usePaginationState).toBeDefined()
      expect(typeof shadmin.usePaginationState).toBe('function')
    })

    it('exports useSortState', () => {
      expect(shadmin.useSortState).toBeDefined()
      expect(typeof shadmin.useSortState).toBe('function')
    })

    it('exports useFilterState', () => {
      expect(shadmin.useFilterState).toBeDefined()
      expect(typeof shadmin.useFilterState).toBe('function')
    })

    it('exports useGetManyAggregate', () => {
      expect(shadmin.useGetManyAggregate).toBeDefined()
      expect(typeof shadmin.useGetManyAggregate).toBe('function')
    })
  })

  describe('ra-core Form Hooks', () => {
    it('exports useInput', () => {
      expect(shadmin.useInput).toBeDefined()
      expect(typeof shadmin.useInput).toBe('function')
    })

    it('exports useAugmentedForm', () => {
      expect(shadmin.useAugmentedForm).toBeDefined()
      expect(typeof shadmin.useAugmentedForm).toBe('function')
    })

    it('exports useWarnWhenUnsavedChanges', () => {
      expect(shadmin.useWarnWhenUnsavedChanges).toBeDefined()
      expect(typeof shadmin.useWarnWhenUnsavedChanges).toBe('function')
    })

    it('exports useSuggestions', () => {
      expect(shadmin.useSuggestions).toBeDefined()
      expect(typeof shadmin.useSuggestions).toBe('function')
    })
  })

  describe('ra-core i18n Hooks', () => {
    it('exports useLocaleState', () => {
      expect(shadmin.useLocaleState).toBeDefined()
      expect(typeof shadmin.useLocaleState).toBe('function')
    })

    it('exports useSetLocale', () => {
      expect(shadmin.useSetLocale).toBeDefined()
      expect(typeof shadmin.useSetLocale).toBe('function')
    })
  })

  describe('ra-core Store Hooks', () => {
    it('exports useStore', () => {
      expect(shadmin.useStore).toBeDefined()
      expect(typeof shadmin.useStore).toBe('function')
    })

    it('exports useRemoveFromStore', () => {
      expect(shadmin.useRemoveFromStore).toBeDefined()
      expect(typeof shadmin.useRemoveFromStore).toBe('function')
    })

    it('exports useResetStore', () => {
      expect(shadmin.useResetStore).toBeDefined()
      expect(typeof shadmin.useResetStore).toBe('function')
    })
  })

  describe('ra-core Utility Functions', () => {
    it('exports HttpError', () => {
      expect(shadmin.HttpError).toBeDefined()
      expect(typeof shadmin.HttpError).toBe('function')
    })

    it('exports fetchUtils', () => {
      expect(shadmin.fetchUtils).toBeDefined()
      expect(typeof shadmin.fetchUtils).toBe('object')
    })

    it('exports combineDataProviders', () => {
      expect(shadmin.combineDataProviders).toBeDefined()
      expect(typeof shadmin.combineDataProviders).toBe('function')
    })

    it('exports withLifecycleCallbacks', () => {
      expect(shadmin.withLifecycleCallbacks).toBeDefined()
      expect(typeof shadmin.withLifecycleCallbacks).toBe('function')
    })
  })
})
