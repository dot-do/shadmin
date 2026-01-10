/**
 * Subpath Export Verification Tests
 *
 * These tests verify that subpath imports work correctly for tree-shaking.
 * Users should be able to import from specific subpaths like:
 *   import { List } from 'shadmin/components/list'
 *   import { useGetList } from 'shadmin/hooks'
 *
 * During development, we test these imports via their direct source paths.
 * The package.json exports field will map these subpaths to the correct locations.
 */

import { describe, it, expect } from 'vitest'

describe('Subpath Exports - Components', () => {
  describe('components/list', () => {
    it('exports List components', async () => {
      const listModule = await import('./components/list')

      expect(listModule.List).toBeDefined()
      expect(listModule.ListBase).toBeDefined()
      expect(listModule.ListView).toBeDefined()
      expect(listModule.Datagrid).toBeDefined()
      expect(listModule.SimpleList).toBeDefined()
      expect(listModule.Pagination).toBeDefined()
      expect(listModule.InfiniteList).toBeDefined()
      expect(listModule.EditableDatagrid).toBeDefined()
    })
  })

  describe('components/form', () => {
    it('exports Form components', async () => {
      const formModule = await import('./components/form')

      expect(formModule.SimpleForm).toBeDefined()
      expect(formModule.TabbedForm).toBeDefined()
      expect(formModule.FormTab).toBeDefined()
      expect(formModule.FormDataConsumer).toBeDefined()
      expect(formModule.Toolbar).toBeDefined()
      expect(formModule.SaveButton).toBeDefined()
      expect(formModule.DeleteButton).toBeDefined()
    })
  })

  describe('components/field', () => {
    it('exports Field components', async () => {
      const fieldModule = await import('./components/field')

      expect(fieldModule.TextField).toBeDefined()
      expect(fieldModule.NumberField).toBeDefined()
      expect(fieldModule.DateField).toBeDefined()
      expect(fieldModule.BooleanField).toBeDefined()
      expect(fieldModule.EmailField).toBeDefined()
      expect(fieldModule.UrlField).toBeDefined()
      expect(fieldModule.ReferenceField).toBeDefined()
      expect(fieldModule.ReferenceArrayField).toBeDefined()
      expect(fieldModule.FunctionField).toBeDefined()
      expect(fieldModule.ImageField).toBeDefined()
    })
  })

  describe('components/input', () => {
    it('exports Input components', async () => {
      const inputModule = await import('./components/input')

      expect(inputModule.TextInput).toBeDefined()
      expect(inputModule.NumberInput).toBeDefined()
      expect(inputModule.BooleanInput).toBeDefined()
      expect(inputModule.DateInput).toBeDefined()
      expect(inputModule.SelectInput).toBeDefined()
      expect(inputModule.AutocompleteInput).toBeDefined()
      expect(inputModule.RadioButtonGroupInput).toBeDefined()
      expect(inputModule.CheckboxGroupInput).toBeDefined()
      expect(inputModule.ReferenceInput).toBeDefined()
      expect(inputModule.ArrayInput).toBeDefined()
      expect(inputModule.FileInput).toBeDefined()
      expect(inputModule.ImageInput).toBeDefined()
      expect(inputModule.RichTextInput).toBeDefined()
      expect(inputModule.PasswordInput).toBeDefined()
    })
  })

  describe('components/layout', () => {
    it('exports Layout components', async () => {
      const layoutModule = await import('./components/layout')

      expect(layoutModule.Layout).toBeDefined()
      expect(layoutModule.Sidebar).toBeDefined()
      expect(layoutModule.AppBar).toBeDefined()
      expect(layoutModule.Title).toBeDefined()
      expect(layoutModule.SidebarProvider).toBeDefined()
    })
  })

  describe('components/edit', () => {
    it('exports Edit components', async () => {
      const editModule = await import('./components/edit')

      expect(editModule.Edit).toBeDefined()
      expect(editModule.EditBase).toBeDefined()
    })
  })

  describe('components/create', () => {
    it('exports Create components', async () => {
      const createModule = await import('./components/create')

      expect(createModule.Create).toBeDefined()
      expect(createModule.CreateBase).toBeDefined()
    })
  })

  describe('components/show', () => {
    it('exports Show components', async () => {
      const showModule = await import('./components/show')

      expect(showModule.Show).toBeDefined()
      expect(showModule.ShowBase).toBeDefined()
    })
  })

  describe('components/auth', () => {
    it('exports Auth components', async () => {
      const authModule = await import('./components/auth')

      expect(authModule.LoginPage).toBeDefined()
      expect(authModule.LogoutButton).toBeDefined()
      expect(authModule.CanAccess).toBeDefined()
      expect(authModule.ProtectedRoute).toBeDefined()
    })
  })

  describe('components/buttons', () => {
    it('exports Button components', async () => {
      const buttonsModule = await import('./components/buttons')

      expect(buttonsModule.CreateButton).toBeDefined()
      expect(buttonsModule.EditButton).toBeDefined()
      expect(buttonsModule.ShowButton).toBeDefined()
      expect(buttonsModule.CloneButton).toBeDefined()
      expect(buttonsModule.ExportButton).toBeDefined()
      expect(buttonsModule.BulkDeleteButton).toBeDefined()
    })
  })

  describe('components/menu', () => {
    it('exports Menu components', async () => {
      const menuModule = await import('./components/menu')

      expect(menuModule.Menu).toBeDefined()
      expect(menuModule.MenuItem).toBeDefined()
    })
  })

  describe('components/core', () => {
    it('exports Core components', async () => {
      const coreModule = await import('./components/core')

      expect(coreModule.Admin).toBeDefined()
      expect(coreModule.Resource).toBeDefined()
    })
  })

  describe('components/feedback', () => {
    it('exports Feedback components', async () => {
      const feedbackModule = await import('./components/feedback')

      expect(feedbackModule.Loading).toBeDefined()
      expect(feedbackModule.Error).toBeDefined()
      expect(feedbackModule.Empty).toBeDefined()
      expect(feedbackModule.Confirm).toBeDefined()
      expect(feedbackModule.NotificationToast).toBeDefined()
      expect(feedbackModule.NotificationContainer).toBeDefined()
    })
  })
})

describe('Subpath Exports - Hooks', () => {
  describe('hooks', () => {
    it('exports data fetching hooks', async () => {
      const hooksModule = await import('./hooks')

      expect(hooksModule.useGetList).toBeDefined()
      expect(hooksModule.useGetOne).toBeDefined()
      expect(hooksModule.useGetMany).toBeDefined()
      expect(hooksModule.useGetManyReference).toBeDefined()
    })

    it('exports mutation hooks', async () => {
      const hooksModule = await import('./hooks')

      expect(hooksModule.useCreate).toBeDefined()
      expect(hooksModule.useUpdate).toBeDefined()
      expect(hooksModule.useUpdateMany).toBeDefined()
      expect(hooksModule.useDelete).toBeDefined()
      expect(hooksModule.useDeleteMany).toBeDefined()
    })

    it('exports auth hooks', async () => {
      const hooksModule = await import('./hooks')

      expect(hooksModule.useLogin).toBeDefined()
      expect(hooksModule.useLogout).toBeDefined()
      expect(hooksModule.usePermissions).toBeDefined()
    })

    it('exports utility hooks', async () => {
      const hooksModule = await import('./hooks')

      expect(hooksModule.useNotify).toBeDefined()
      expect(hooksModule.useRedirect).toBeDefined()
      expect(hooksModule.useRefresh).toBeDefined()
      expect(hooksModule.useMediaQuery).toBeDefined()
      expect(hooksModule.useTranslate).toBeDefined()
      expect(hooksModule.useLocale).toBeDefined()
    })

    it('exports context hooks', async () => {
      const hooksModule = await import('./hooks')

      expect(hooksModule.useRecordContext).toBeDefined()
      expect(hooksModule.useListContext).toBeDefined()
      expect(hooksModule.useDataProvider).toBeDefined()
    })

    it('exports hook factory functions', async () => {
      const hooksModule = await import('./hooks')

      expect(hooksModule.createQueryHook).toBeDefined()
      expect(hooksModule.createMutationHook).toBeDefined()
    })
  })
})

describe('Subpath Exports - Contexts', () => {
  describe('contexts', () => {
    it('exports DataProvider context', async () => {
      const contextsModule = await import('./contexts')

      expect(contextsModule.DataProviderContext).toBeDefined()
      expect(contextsModule.DataProviderContextProvider).toBeDefined()
      expect(contextsModule.useDataProvider).toBeDefined()
    })

    it('exports AuthProvider context', async () => {
      const contextsModule = await import('./contexts')

      expect(contextsModule.AuthProviderContext).toBeDefined()
      expect(contextsModule.AuthProviderContextProvider).toBeDefined()
      expect(contextsModule.useAuthProvider).toBeDefined()
    })

    it('exports Resource context', async () => {
      const contextsModule = await import('./contexts')

      expect(contextsModule.ResourceContext).toBeDefined()
      expect(contextsModule.ResourceContextProvider).toBeDefined()
      expect(contextsModule.useResource).toBeDefined()
      expect(contextsModule.useResourceContext).toBeDefined()
    })

    it('exports Record context', async () => {
      const contextsModule = await import('./contexts')

      expect(contextsModule.RecordContext).toBeDefined()
      expect(contextsModule.RecordContextProvider).toBeDefined()
      expect(contextsModule.useRecordContext).toBeDefined()
    })

    it('exports List context', async () => {
      const contextsModule = await import('./contexts')

      expect(contextsModule.ListContext).toBeDefined()
      expect(contextsModule.ListContextProvider).toBeDefined()
      expect(contextsModule.useListContext).toBeDefined()
    })

    it('exports Form context', async () => {
      const contextsModule = await import('./contexts')

      expect(contextsModule.FormContext).toBeDefined()
      expect(contextsModule.FormContextProvider).toBeDefined()
      expect(contextsModule.useFormContext).toBeDefined()
    })

    it('exports Notification context', async () => {
      const contextsModule = await import('./contexts')

      expect(contextsModule.NotificationContext).toBeDefined()
      expect(contextsModule.NotificationContextProvider).toBeDefined()
      expect(contextsModule.useNotify).toBeDefined()
    })

    it('exports Theme context', async () => {
      const contextsModule = await import('./contexts')

      expect(contextsModule.ThemeContext).toBeDefined()
      expect(contextsModule.ThemeProvider).toBeDefined()
      expect(contextsModule.useTheme).toBeDefined()
    })

    it('exports Translation context', async () => {
      const contextsModule = await import('./contexts')

      expect(contextsModule.TranslationContext).toBeDefined()
      expect(contextsModule.TranslationProvider).toBeDefined()
      expect(contextsModule.useTranslationContext).toBeDefined()
    })
  })
})

describe('Subpath Module Independence', () => {
  it('components/list is independently importable', async () => {
    // Verify the module can be imported without side effects from other modules
    const module = await import('./components/list')
    expect(Object.keys(module).length).toBeGreaterThan(0)
  })

  it('hooks is independently importable', async () => {
    const module = await import('./hooks')
    expect(Object.keys(module).length).toBeGreaterThan(0)
  })

  it('contexts is independently importable', async () => {
    const module = await import('./contexts')
    expect(Object.keys(module).length).toBeGreaterThan(0)
  })
})
