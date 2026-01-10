/**
 * Facade Core Types Tests
 * RED Phase: Define tests for core type abstractions
 *
 * These tests verify that the facade layer properly abstracts ra-core
 * and provides a stable API for shadmin components.
 */

import { describe, it, expect } from 'vitest'

// Import from facade (these imports will fail until we implement the facade)
import type {
  // Resource types
  ResourceDefinition,
  ResourceOptions,
  ResourceProps,
  // Notification types
  NotificationType,
  NotificationPayload,
  // I18n types
  I18nProvider,
  TranslateFunction,
  Locale,
  // Form types
  MutationMode,
  // List types
  ListControllerResult,
} from './core-types'

describe('Facade: Resource Types', () => {
  describe('ResourceDefinition type', () => {
    it('should have required name property', () => {
      const definition: ResourceDefinition = {
        name: 'posts',
      }
      expect(definition.name).toBe('posts')
    })

    it('should support optional view flags', () => {
      const definition: ResourceDefinition = {
        name: 'posts',
        hasList: true,
        hasEdit: true,
        hasCreate: true,
        hasShow: true,
      }
      expect(definition.hasList).toBe(true)
      expect(definition.hasEdit).toBe(true)
    })

    it('should support icon and options', () => {
      const IconComponent = () => null
      const definition: ResourceDefinition = {
        name: 'posts',
        icon: IconComponent,
        options: { label: 'Blog Posts' },
      }
      expect(definition.icon).toBe(IconComponent)
      expect(definition.options?.label).toBe('Blog Posts')
    })
  })

  describe('ResourceOptions type', () => {
    it('should support label property', () => {
      const options: ResourceOptions = {
        label: 'Custom Label',
      }
      expect(options.label).toBe('Custom Label')
    })

    it('should allow arbitrary additional properties', () => {
      const options: ResourceOptions = {
        label: 'Posts',
        customOption: true,
        nested: { value: 123 },
      }
      expect(options.customOption).toBe(true)
    })
  })

  describe('ResourceProps type', () => {
    it('should have required name property', () => {
      const props: ResourceProps = {
        name: 'posts',
      }
      expect(props.name).toBe('posts')
    })

    it('should support CRUD component props', () => {
      const ListComponent = () => null
      const EditComponent = () => null
      const CreateComponent = () => null
      const ShowComponent = () => null

      const props: ResourceProps = {
        name: 'posts',
        list: ListComponent,
        edit: EditComponent,
        create: CreateComponent,
        show: ShowComponent,
      }

      expect(props.list).toBe(ListComponent)
      expect(props.edit).toBe(EditComponent)
      expect(props.create).toBe(CreateComponent)
      expect(props.show).toBe(ShowComponent)
    })
  })
})

describe('Facade: Notification Types', () => {
  describe('NotificationType', () => {
    it('should support success type', () => {
      const type: NotificationType = 'success'
      expect(type).toBe('success')
    })

    it('should support error type', () => {
      const type: NotificationType = 'error'
      expect(type).toBe('error')
    })

    it('should support warning type', () => {
      const type: NotificationType = 'warning'
      expect(type).toBe('warning')
    })

    it('should support info type', () => {
      const type: NotificationType = 'info'
      expect(type).toBe('info')
    })
  })

  describe('NotificationPayload type', () => {
    it('should have required message property', () => {
      const payload: NotificationPayload = {
        message: 'Operation successful',
      }
      expect(payload.message).toBe('Operation successful')
    })

    it('should support optional properties', () => {
      const payload: NotificationPayload = {
        message: 'Error occurred',
        type: 'error',
        autoHideDuration: 5000,
        multiLine: true,
        undoable: false,
      }
      expect(payload.type).toBe('error')
      expect(payload.autoHideDuration).toBe(5000)
      expect(payload.multiLine).toBe(true)
      expect(payload.undoable).toBe(false)
    })
  })
})

describe('Facade: I18n Types', () => {
  describe('Locale type', () => {
    it('should be a string', () => {
      const locale: Locale = 'en'
      expect(locale).toBe('en')
    })

    it('should support locale with region', () => {
      const locale: Locale = 'en-US'
      expect(locale).toBe('en-US')
    })
  })

  describe('TranslateFunction type', () => {
    it('should accept key and return string', () => {
      const translate: TranslateFunction = (key: string) => key
      expect(translate('ra.action.save')).toBe('ra.action.save')
    })

    it('should accept options parameter', () => {
      const translate: TranslateFunction = (key: string, options?: Record<string, unknown>) => {
        if (options?.name) {
          return `Hello, ${options.name}!`
        }
        return key
      }
      expect(translate('greeting', { name: 'World' })).toBe('Hello, World!')
    })
  })

  describe('I18nProvider type', () => {
    it('should have translate method', () => {
      const i18nProvider: I18nProvider = {
        translate: (key: string) => key,
        changeLocale: async () => {},
        getLocale: () => 'en',
      }
      expect(i18nProvider.translate('test.key')).toBe('test.key')
    })

    it('should have changeLocale method', async () => {
      let currentLocale = 'en'
      const i18nProvider: I18nProvider = {
        translate: (key: string) => key,
        changeLocale: async (locale: Locale) => {
          currentLocale = locale
        },
        getLocale: () => currentLocale,
      }

      await i18nProvider.changeLocale('fr')
      expect(i18nProvider.getLocale()).toBe('fr')
    })

    it('should have getLocale method', () => {
      const i18nProvider: I18nProvider = {
        translate: (key: string) => key,
        changeLocale: async () => {},
        getLocale: () => 'de',
      }
      expect(i18nProvider.getLocale()).toBe('de')
    })
  })
})

describe('Facade: Form Types', () => {
  describe('MutationMode type', () => {
    it('should support pessimistic mode', () => {
      const mode: MutationMode = 'pessimistic'
      expect(mode).toBe('pessimistic')
    })

    it('should support optimistic mode', () => {
      const mode: MutationMode = 'optimistic'
      expect(mode).toBe('optimistic')
    })

    it('should support undoable mode', () => {
      const mode: MutationMode = 'undoable'
      expect(mode).toBe('undoable')
    })
  })
})

describe('Facade: List Types', () => {
  describe('ListControllerResult type', () => {
    it('should have required properties', () => {
      const result: ListControllerResult = {
        data: [{ id: 1 }, { id: 2 }],
        total: 100,
        page: 1,
        perPage: 10,
        sort: { field: 'id', order: 'ASC' },
        filterValues: {},
        displayedFilters: {},
        setFilters: () => {},
        setPage: () => {},
        setPerPage: () => {},
        setSort: () => {},
        resource: 'posts',
        isLoading: false,
        isFetching: false,
        selectedIds: [],
        onSelect: () => {},
        onToggleItem: () => {},
        onUnselectItems: () => {},
      }

      expect(result.data).toHaveLength(2)
      expect(result.total).toBe(100)
      expect(result.page).toBe(1)
      expect(result.resource).toBe('posts')
    })

    it('should support optional properties', () => {
      const result: ListControllerResult = {
        data: [],
        total: 0,
        page: 1,
        perPage: 10,
        sort: { field: 'id', order: 'ASC' },
        filterValues: { status: 'active' },
        displayedFilters: { status: true },
        setFilters: () => {},
        setPage: () => {},
        setPerPage: () => {},
        setSort: () => {},
        resource: 'posts',
        isLoading: false,
        isFetching: false,
        selectedIds: [1, 2],
        onSelect: () => {},
        onToggleItem: () => {},
        onUnselectItems: () => {},
        error: new Error('Failed to load'),
        refetch: () => Promise.resolve(),
      }

      expect(result.error?.message).toBe('Failed to load')
      expect(result.selectedIds).toEqual([1, 2])
    })
  })
})

describe('Facade: Type Re-exports', () => {
  it('should provide all necessary types for internal use', () => {
    // This test just ensures the types compile correctly
    // The actual verification is done by TypeScript at compile time
    const resourceDef: ResourceDefinition = { name: 'test' }
    const notification: NotificationPayload = { message: 'test' }
    const mode: MutationMode = 'pessimistic'

    expect(resourceDef).toBeDefined()
    expect(notification).toBeDefined()
    expect(mode).toBe('pessimistic')
  })
})
