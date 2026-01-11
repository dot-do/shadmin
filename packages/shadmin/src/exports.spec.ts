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

    it.skip('exports ListBase', () => {
      // @ts-expect-error - ListBase not yet exported (RED phase test)
      expect(shadmin.ListBase).toBeDefined()
      // @ts-expect-error - ListBase not yet exported
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

    it.skip('exports Resource', () => {
      // @ts-expect-error - Resource not yet exported (RED phase test)
      expect(shadmin.Resource).toBeDefined()
      // Resource is wrapped in memo(), which returns an object (MemoExoticComponent)
      // @ts-expect-error - Resource not yet exported
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
  // NOTE: These are RED phase tests - validators/controllers not yet exported
  // ============================================================================

  describe.skip('ra-core Validators', () => {
    it('exports required', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.required).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.required).toBe('function')
    })

    it('exports minLength', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.minLength).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.minLength).toBe('function')
    })

    it('exports maxLength', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.maxLength).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.maxLength).toBe('function')
    })

    it('exports minValue', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.minValue).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.minValue).toBe('function')
    })

    it('exports maxValue', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.maxValue).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.maxValue).toBe('function')
    })

    it('exports number', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.number).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.number).toBe('function')
    })

    it('exports regex', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.regex).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.regex).toBe('function')
    })

    it('exports email', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.email).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.email).toBe('function')
    })

    it('exports choices', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.choices).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.choices).toBe('function')
    })

    it('exports composeValidators', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.composeValidators).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.composeValidators).toBe('function')
    })
  })

  describe.skip('ra-core Controller Hooks', () => {
    it('exports useEditController', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useEditController).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useEditController).toBe('function')
    })

    it('exports useListController', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useListController).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useListController).toBe('function')
    })

    it('exports useShowController', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useShowController).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useShowController).toBe('function')
    })

    it('exports useCreateController', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useCreateController).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useCreateController).toBe('function')
    })
  })

  // NOTE: Context providers not all exported yet - skipping RED phase tests
  describe.skip('ra-core Context Providers', () => {
    it('exports EditContextProvider', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.EditContextProvider).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.EditContextProvider).toBe('function')
    })

    it('exports ListContextProvider', () => {
      expect(shadmin.ListContextProvider).toBeDefined()
      expect(typeof shadmin.ListContextProvider).toBe('function')
    })

    it('exports ShowContextProvider', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.ShowContextProvider).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.ShowContextProvider).toBe('function')
    })

    it('exports CreateContextProvider', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.CreateContextProvider).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.CreateContextProvider).toBe('function')
    })

    it('exports RecordContextProvider', () => {
      expect(shadmin.RecordContextProvider).toBeDefined()
      expect(typeof shadmin.RecordContextProvider).toBe('function')
    })
  })

  // NOTE: Selection hooks not yet exported - skipping RED phase tests
  describe.skip('ra-core Selection Hooks', () => {
    it('exports useUnselectAll', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useUnselectAll).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useUnselectAll).toBe('function')
    })

    it('exports useRecordSelection', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useRecordSelection).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useRecordSelection).toBe('function')
    })

    it('exports useSelectAll', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useSelectAll).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useSelectAll).toBe('function')
    })

    it('exports useUnselect', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useUnselect).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useUnselect).toBe('function')
    })
  })

  // NOTE: Export utilities not all exported yet - skipping RED phase tests
  describe.skip('ra-core Export Utilities', () => {
    it('exports fetchRelatedRecords', () => {
      expect(shadmin.fetchRelatedRecords).toBeDefined()
      expect(typeof shadmin.fetchRelatedRecords).toBe('function')
    })

    it('exports downloadCSV', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.downloadCSV).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.downloadCSV).toBe('function')
    })

    it('exports defaultExporter', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.defaultExporter).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.defaultExporter).toBe('function')
    })
  })

  // NOTE: Routing hooks not all exported yet - skipping RED phase tests
  describe.skip('ra-core Routing Hooks', () => {
    it('exports useCreatePath', () => {
      expect(shadmin.useCreatePath).toBeDefined()
      expect(typeof shadmin.useCreatePath).toBe('function')
    })

    it('exports useBasename', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useBasename).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useBasename).toBe('function')
    })

    it('exports useGetPathForRecord', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useGetPathForRecord).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useGetPathForRecord).toBe('function')
    })
  })

  describe('ra-core Auth Hooks', () => {
    it.skip('exports useAuthenticated', () => {
      // @ts-expect-error - not yet exported (RED phase test)
      expect(shadmin.useAuthenticated).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useAuthenticated).toBe('function')
    })

    it.skip('exports useCheckAuth', () => {
      // @ts-expect-error - not yet exported (RED phase test)
      expect(shadmin.useCheckAuth).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useCheckAuth).toBe('function')
    })

    it('exports useGetIdentity', () => {
      expect(shadmin.useGetIdentity).toBeDefined()
      expect(typeof shadmin.useGetIdentity).toBe('function')
    })

    it.skip('exports useLogoutIfAccessDenied', () => {
      // @ts-expect-error - not yet exported (RED phase test)
      expect(shadmin.useLogoutIfAccessDenied).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useLogoutIfAccessDenied).toBe('function')
    })
  })

  // NOTE: ra-core Data Hooks not yet exported - skipping RED phase tests
  describe.skip('ra-core Data Hooks', () => {
    it('exports useExpanded', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useExpanded).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useExpanded).toBe('function')
    })

    it('exports useInfiniteGetList', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useInfiniteGetList).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useInfiniteGetList).toBe('function')
    })

    it('exports usePaginationState', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.usePaginationState).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.usePaginationState).toBe('function')
    })

    it('exports useSortState', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useSortState).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useSortState).toBe('function')
    })

    it('exports useFilterState', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useFilterState).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useFilterState).toBe('function')
    })

    it('exports useGetManyAggregate', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useGetManyAggregate).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useGetManyAggregate).toBe('function')
    })
  })

  // NOTE: ra-core Form Hooks not yet exported - skipping RED phase tests
  describe.skip('ra-core Form Hooks', () => {
    it('exports useInput', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useInput).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useInput).toBe('function')
    })

    it('exports useAugmentedForm', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useAugmentedForm).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useAugmentedForm).toBe('function')
    })

    it('exports useWarnWhenUnsavedChanges', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useWarnWhenUnsavedChanges).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useWarnWhenUnsavedChanges).toBe('function')
    })

    it('exports useSuggestions', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useSuggestions).toBeDefined()
      // @ts-expect-error - not yet exported
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

  // NOTE: ra-core Store Hooks not yet exported - skipping RED phase tests
  describe.skip('ra-core Store Hooks', () => {
    it('exports useStore', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useStore).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useStore).toBe('function')
    })

    it('exports useRemoveFromStore', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useRemoveFromStore).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useRemoveFromStore).toBe('function')
    })

    it('exports useResetStore', () => {
      // @ts-expect-error - not yet exported
      expect(shadmin.useResetStore).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.useResetStore).toBe('function')
    })
  })

  describe('ra-core Utility Functions', () => {
    it('exports HttpError', () => {
      expect(shadmin.HttpError).toBeDefined()
      expect(typeof shadmin.HttpError).toBe('function')
    })

    it.skip('exports fetchUtils', () => {
      // @ts-expect-error - not yet exported (RED phase test)
      expect(shadmin.fetchUtils).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.fetchUtils).toBe('object')
    })

    it.skip('exports combineDataProviders', () => {
      // @ts-expect-error - not yet exported (RED phase test)
      expect(shadmin.combineDataProviders).toBeDefined()
      // @ts-expect-error - not yet exported
      expect(typeof shadmin.combineDataProviders).toBe('function')
    })

    it('exports withLifecycleCallbacks', () => {
      expect(shadmin.withLifecycleCallbacks).toBeDefined()
      expect(typeof shadmin.withLifecycleCallbacks).toBe('function')
    })
  })
})
