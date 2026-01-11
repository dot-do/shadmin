/**
 * Consumer Type Export Tests
 *
 * These tests verify that all types that consumers need are properly exported
 * from the shadmin package entry point.
 *
 * TDD Approach - RED phase: These tests define what types should be available.
 */

import { describe, it, expect } from 'vitest'

// Import types from the main package entry point
import type {
  // Input choice types
  SelectChoice,
  SelectArrayChoice,
  RadioChoice,
  CheckboxChoice,
  AutocompleteChoice,
  AutocompleteArrayChoice,
  ReferenceChoice,
  ReferenceSort,
  ArrayInputContextValue,

  // Context types
  FormContextProviderProps,
  DataProviderContextProviderProps,
  AuthProviderContextProviderProps,
  ListContextProviderProps,
  RecordContextProviderProps,
  ResourceContextProviderProps,
  ResourceDefinitionContextProviderProps,
  NotificationContextProviderProps,

  // Context value types
  ListControllerResult,
  NotificationContextValue,
  ResourceDefinitions,

  // Hook return types
  UseGetListParams,
  UseGetListOptions,
  UseGetListResult,
  UseGetOneParams,
  UseGetOneOptions,
  UseGetOneResult,
  UseGetManyParams,
  UseGetManyOptions,
  UseGetManyResult,
  UseGetManyReferenceParams,
  UseGetManyReferenceOptions,
  UseGetManyReferenceResult,
  UseCreateMutateParams,
  UseCreateOptions,
  UseCreateResult,
  UseCreateMutationState,
  CreateFunction,
  UseUpdateMutateParams,
  UseUpdateOptions,
  UseUpdateResult,
  UseUpdateMutationState,
  UpdateFunction,
  UseDeleteMutateParams,
  UseDeleteOptions,
  UseDeleteResult,
  UseDeleteMutationState,
  DeleteFunction,
  UseDeleteManyMutateParams,
  UseDeleteManyOptions,
  UseDeleteManyResult,
  UseDeleteManyMutationState,
  DeleteManyFunction,
  UseUpdateManyMutateParams,
  UseUpdateManyOptions,
  UseUpdateManyResult,
  UseUpdateManyMutationState,
  UpdateManyFunction,

  // Auth hook types
  UseLoginOptions,
  LoginOptions,
  UseLoginResult,
  UseLogoutOptions,
  LogoutOptions,
  UseLogoutResult,
  UsePermissionsOptions,
  UsePermissionsResult,
  UseCanAccessParams,
  UseCanAccessResult,

  // Navigation/utility hook types
  RedirectTo,
  RedirectOptions,
  RedirectFunction,
  NotifyFunction,
  NotificationType,
  NotificationOptions,
  RefreshOptions,
  RefreshFunction,

  // List params types
  UseListParamsProps,
  UseListParamsResult,

  // i18n types
  TranslateFunction,
  TranslateOptions,
  UseLocaleResult,
  TranslationContextValue,
  TranslationProviderProps,
  TranslationMessages,
  I18nProvider,

  // Data hook factory types
  QueryHookConfig,
  MutationHookConfig,
  CacheUpdateHandlers,
  BaseQueryResult,
  BaseMutationState,
  BaseErrorHandling,
  MutationErrorHandling,

  // CreateSuggestion types
  CreateSuggestionContextValue,

  // MutationMode type
  MutationMode,

  // Record type for generic constraints
  RaRecord,
} from './index'

// Import values to verify they exist
import * as shadmin from './index'

describe('Consumer Type Exports', () => {
  describe('Input Choice Types', () => {
    it('exports SelectChoice type', () => {
      const choice: SelectChoice = { id: '1', name: 'Test' }
      expect(choice.id).toBe('1')
    })

    it('exports SelectArrayChoice type', () => {
      const choice: SelectArrayChoice = { id: '1', name: 'Test' }
      expect(choice.id).toBe('1')
    })

    it('exports RadioChoice type', () => {
      const choice: RadioChoice = { id: '1', name: 'Test' }
      expect(choice.id).toBe('1')
    })

    it('exports CheckboxChoice type', () => {
      const choice: CheckboxChoice = { id: '1', name: 'Test' }
      expect(choice.id).toBe('1')
    })

    it('exports AutocompleteChoice type', () => {
      const choice: AutocompleteChoice = { id: '1', name: 'Test' }
      expect(choice.id).toBe('1')
    })

    it('exports AutocompleteArrayChoice type', () => {
      const choice: AutocompleteArrayChoice = { id: '1', name: 'Test' }
      expect(choice.id).toBe('1')
    })

    it('exports ReferenceChoice type', () => {
      const choice: ReferenceChoice = { id: '1', name: 'Test' }
      expect(choice.id).toBe('1')
    })

    it('exports ReferenceSort type', () => {
      const sort: ReferenceSort = { field: 'name', order: 'ASC' }
      expect(sort.field).toBe('name')
    })

    it('exports ArrayInputContextValue type', () => {
      // Type-only check - if it compiles, the type is exported
      const typeCheck: ArrayInputContextValue | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('Context Provider Props Types', () => {
    it('exports FormContextProviderProps type', () => {
      const typeCheck: FormContextProviderProps | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports DataProviderContextProviderProps type', () => {
      const typeCheck: DataProviderContextProviderProps | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports AuthProviderContextProviderProps type', () => {
      const typeCheck: AuthProviderContextProviderProps | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports ListContextProviderProps type', () => {
      const typeCheck: ListContextProviderProps | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports RecordContextProviderProps type', () => {
      const typeCheck: RecordContextProviderProps | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports ResourceContextProviderProps type', () => {
      const typeCheck: ResourceContextProviderProps | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports ResourceDefinitionContextProviderProps type', () => {
      const typeCheck: ResourceDefinitionContextProviderProps | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports NotificationContextProviderProps type', () => {
      const typeCheck: NotificationContextProviderProps | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('Context Value Types', () => {
    it('exports ListControllerResult type', () => {
      const typeCheck: ListControllerResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports NotificationContextValue type', () => {
      const typeCheck: NotificationContextValue | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports ResourceDefinitions type', () => {
      const typeCheck: ResourceDefinitions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('Hook Return Types - Query Hooks', () => {
    it('exports UseGetListParams type', () => {
      const typeCheck: UseGetListParams | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetListOptions type', () => {
      const typeCheck: UseGetListOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetListResult type', () => {
      const typeCheck: UseGetListResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetOneParams type', () => {
      const typeCheck: UseGetOneParams | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetOneOptions type', () => {
      const typeCheck: UseGetOneOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetOneResult type', () => {
      const typeCheck: UseGetOneResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetManyParams type', () => {
      const typeCheck: UseGetManyParams | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetManyOptions type', () => {
      const typeCheck: UseGetManyOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetManyResult type', () => {
      const typeCheck: UseGetManyResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetManyReferenceParams type', () => {
      const typeCheck: UseGetManyReferenceParams | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetManyReferenceOptions type', () => {
      const typeCheck: UseGetManyReferenceOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseGetManyReferenceResult type', () => {
      const typeCheck: UseGetManyReferenceResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('Hook Return Types - Mutation Hooks', () => {
    it('exports UseCreateMutateParams type', () => {
      const typeCheck: UseCreateMutateParams | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseCreateOptions type', () => {
      const typeCheck: UseCreateOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseCreateResult type', () => {
      const typeCheck: UseCreateResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseCreateMutationState type', () => {
      const typeCheck: UseCreateMutationState | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports CreateFunction type', () => {
      const typeCheck: CreateFunction | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseUpdateMutateParams type', () => {
      const typeCheck: UseUpdateMutateParams | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseUpdateOptions type', () => {
      const typeCheck: UseUpdateOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseUpdateResult type', () => {
      const typeCheck: UseUpdateResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseUpdateMutationState type', () => {
      const typeCheck: UseUpdateMutationState | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UpdateFunction type', () => {
      const typeCheck: UpdateFunction | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseDeleteMutateParams type', () => {
      const typeCheck: UseDeleteMutateParams | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseDeleteOptions type', () => {
      const typeCheck: UseDeleteOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseDeleteResult type', () => {
      const typeCheck: UseDeleteResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseDeleteMutationState type', () => {
      const typeCheck: UseDeleteMutationState | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports DeleteFunction type', () => {
      const typeCheck: DeleteFunction | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseDeleteManyMutateParams type', () => {
      const typeCheck: UseDeleteManyMutateParams | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseDeleteManyOptions type', () => {
      const typeCheck: UseDeleteManyOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseDeleteManyResult type', () => {
      const typeCheck: UseDeleteManyResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseDeleteManyMutationState type', () => {
      const typeCheck: UseDeleteManyMutationState | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports DeleteManyFunction type', () => {
      const typeCheck: DeleteManyFunction | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseUpdateManyMutateParams type', () => {
      const typeCheck: UseUpdateManyMutateParams | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseUpdateManyOptions type', () => {
      const typeCheck: UseUpdateManyOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseUpdateManyResult type', () => {
      const typeCheck: UseUpdateManyResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseUpdateManyMutationState type', () => {
      const typeCheck: UseUpdateManyMutationState | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UpdateManyFunction type', () => {
      const typeCheck: UpdateManyFunction | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('Auth Hook Types', () => {
    it('exports UseLoginOptions type', () => {
      const typeCheck: UseLoginOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports LoginOptions type', () => {
      const typeCheck: LoginOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseLoginResult type', () => {
      const typeCheck: UseLoginResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseLogoutOptions type', () => {
      const typeCheck: UseLogoutOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports LogoutOptions type', () => {
      const typeCheck: LogoutOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseLogoutResult type', () => {
      const typeCheck: UseLogoutResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UsePermissionsOptions type', () => {
      const typeCheck: UsePermissionsOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UsePermissionsResult type', () => {
      const typeCheck: UsePermissionsResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseCanAccessParams type', () => {
      const typeCheck: UseCanAccessParams | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseCanAccessResult type', () => {
      const typeCheck: UseCanAccessResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('Navigation/Utility Hook Types', () => {
    it('exports RedirectTo type', () => {
      const typeCheck: RedirectTo | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports RedirectOptions type', () => {
      const typeCheck: RedirectOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports RedirectFunction type', () => {
      const typeCheck: RedirectFunction | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports NotifyFunction type', () => {
      const typeCheck: NotifyFunction | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports NotificationType type', () => {
      const typeCheck: NotificationType | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports NotificationOptions type', () => {
      const typeCheck: NotificationOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports RefreshOptions type', () => {
      const typeCheck: RefreshOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports RefreshFunction type', () => {
      const typeCheck: RefreshFunction | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('List Params Types', () => {
    it('exports UseListParamsProps type', () => {
      const typeCheck: UseListParamsProps | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseListParamsResult type', () => {
      const typeCheck: UseListParamsResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('i18n Types', () => {
    it('exports TranslateFunction type', () => {
      const typeCheck: TranslateFunction | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports TranslateOptions type', () => {
      const typeCheck: TranslateOptions | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports UseLocaleResult type', () => {
      const typeCheck: UseLocaleResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports TranslationContextValue type', () => {
      const typeCheck: TranslationContextValue | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports TranslationProviderProps type', () => {
      const typeCheck: TranslationProviderProps | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports TranslationMessages type', () => {
      const typeCheck: TranslationMessages | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports I18nProvider type', () => {
      const typeCheck: I18nProvider | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('Data Hook Factory Types', () => {
    it('exports QueryHookConfig type', () => {
      // QueryHookConfig requires 3-4 type args: TMethod, TParams, TResult, _TRecordType?
      const typeCheck: QueryHookConfig<'getList', unknown, unknown> | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports MutationHookConfig type', () => {
      // MutationHookConfig requires 3-4 type args: TMethod, TParams, TResult, TRecordType?
      const typeCheck: MutationHookConfig<'create', unknown, unknown> | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports CacheUpdateHandlers type', () => {
      // CacheUpdateHandlers requires 3 type args: _TRecordType extends RaRecord, TParams, TResult
      const typeCheck: CacheUpdateHandlers<RaRecord, unknown, unknown> | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports BaseQueryResult type', () => {
      // BaseQueryResult is not generic
      const typeCheck: BaseQueryResult | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports BaseMutationState type', () => {
      const typeCheck: BaseMutationState<unknown> | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports BaseErrorHandling type', () => {
      const typeCheck: BaseErrorHandling | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports MutationErrorHandling type', () => {
      const typeCheck: MutationErrorHandling | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })
  })

  describe('Misc Types', () => {
    it('exports CreateSuggestionContextValue type', () => {
      const typeCheck: CreateSuggestionContextValue | undefined = undefined
      expect(typeCheck).toBeUndefined()
    })

    it('exports MutationMode type', () => {
      const mode: MutationMode = 'pessimistic'
      expect(mode).toBe('pessimistic')
    })
  })

  describe('Context Exports (Runtime)', () => {
    it('exports DataProviderContext', () => {
      expect(shadmin.DataProviderContext).toBeDefined()
    })

    it('exports DataProviderContextProvider', () => {
      expect(shadmin.DataProviderContextProvider).toBeDefined()
    })

    it('exports AuthProviderContext', () => {
      expect(shadmin.AuthProviderContext).toBeDefined()
    })

    it('exports AuthProviderContextProvider', () => {
      expect(shadmin.AuthProviderContextProvider).toBeDefined()
    })

    it('exports ResourceContext', () => {
      expect(shadmin.ResourceContext).toBeDefined()
    })

    it('exports ResourceContextProvider', () => {
      expect(shadmin.ResourceContextProvider).toBeDefined()
    })

    it('exports ResourceDefinitionContext', () => {
      expect(shadmin.ResourceDefinitionContext).toBeDefined()
    })

    it('exports ResourceDefinitionContextProvider', () => {
      expect(shadmin.ResourceDefinitionContextProvider).toBeDefined()
    })

    it('exports RecordContext', () => {
      expect(shadmin.RecordContext).toBeDefined()
    })

    it('exports RecordContextProvider', () => {
      expect(shadmin.RecordContextProvider).toBeDefined()
    })

    it('exports ListContext', () => {
      expect(shadmin.ListContext).toBeDefined()
    })

    it('exports ListContextProvider', () => {
      expect(shadmin.ListContextProvider).toBeDefined()
    })

    it('exports NotificationContext', () => {
      expect(shadmin.NotificationContext).toBeDefined()
    })

    it('exports NotificationContextProvider', () => {
      expect(shadmin.NotificationContextProvider).toBeDefined()
    })

    it('exports TranslationContext', () => {
      expect(shadmin.TranslationContext).toBeDefined()
    })

    it('exports TranslationProvider', () => {
      expect(shadmin.TranslationProvider).toBeDefined()
    })

    it('exports ArrayInputContext', () => {
      expect(shadmin.ArrayInputContext).toBeDefined()
    })

    it('exports CreateSuggestionContext', () => {
      expect(shadmin.CreateSuggestionContext).toBeDefined()
    })
  })

  describe('Hook Exports (Runtime)', () => {
    it('exports useDataProviderOptional', () => {
      expect(shadmin.useDataProviderOptional).toBeDefined()
      expect(typeof shadmin.useDataProviderOptional).toBe('function')
    })

    it('exports useAuthProviderOptional', () => {
      expect(shadmin.useAuthProviderOptional).toBeDefined()
      expect(typeof shadmin.useAuthProviderOptional).toBe('function')
    })

    it('exports useResourceOptional', () => {
      expect(shadmin.useResourceOptional).toBeDefined()
      expect(typeof shadmin.useResourceOptional).toBe('function')
    })

    it('exports useResource', () => {
      expect(shadmin.useResource).toBeDefined()
      expect(typeof shadmin.useResource).toBe('function')
    })

    it('exports useResourceDefinitions', () => {
      expect(shadmin.useResourceDefinitions).toBeDefined()
      expect(typeof shadmin.useResourceDefinitions).toBe('function')
    })

    it('exports useResourceDefinition', () => {
      expect(shadmin.useResourceDefinition).toBeDefined()
      expect(typeof shadmin.useResourceDefinition).toBe('function')
    })

    it('exports useNotificationContext', () => {
      expect(shadmin.useNotificationContext).toBeDefined()
      expect(typeof shadmin.useNotificationContext).toBe('function')
    })

    it('exports useTranslationContext', () => {
      expect(shadmin.useTranslationContext).toBeDefined()
      expect(typeof shadmin.useTranslationContext).toBe('function')
    })

    it('exports useTranslationContextOptional', () => {
      expect(shadmin.useTranslationContextOptional).toBeDefined()
      expect(typeof shadmin.useTranslationContextOptional).toBe('function')
    })

    it('exports createDefaultI18nProvider', () => {
      expect(shadmin.createDefaultI18nProvider).toBeDefined()
      expect(typeof shadmin.createDefaultI18nProvider).toBe('function')
    })

    it('exports useGetManyReference', () => {
      expect(shadmin.useGetManyReference).toBeDefined()
      expect(typeof shadmin.useGetManyReference).toBe('function')
    })

    it('exports useUpdateMany', () => {
      expect(shadmin.useUpdateMany).toBeDefined()
      expect(typeof shadmin.useUpdateMany).toBe('function')
    })

    it('exports useDeleteMany', () => {
      expect(shadmin.useDeleteMany).toBeDefined()
      expect(typeof shadmin.useDeleteMany).toBe('function')
    })

    it('exports useCanAccess', () => {
      expect(shadmin.useCanAccess).toBeDefined()
      expect(typeof shadmin.useCanAccess).toBe('function')
    })

    it('exports usePermissions', () => {
      expect(shadmin.usePermissions).toBeDefined()
      expect(typeof shadmin.usePermissions).toBe('function')
    })

    it('exports useListParams', () => {
      expect(shadmin.useListParams).toBeDefined()
      expect(typeof shadmin.useListParams).toBe('function')
    })

    it('exports useTranslate', () => {
      expect(shadmin.useTranslate).toBeDefined()
      expect(typeof shadmin.useTranslate).toBe('function')
    })

    it('exports useLocale', () => {
      expect(shadmin.useLocale).toBeDefined()
      expect(typeof shadmin.useLocale).toBe('function')
    })
  })

  describe('Error Classes and Type Guards', () => {
    it('exports HttpError class', () => {
      expect(shadmin.HttpError).toBeDefined()
      const error = new shadmin.HttpError('Not found', 404)
      expect(error.message).toBe('Not found')
      expect(error.status).toBe(404)
    })

    it('exports NetworkError class', () => {
      expect(shadmin.NetworkError).toBeDefined()
      const error = new shadmin.NetworkError('Connection failed')
      expect(error.message).toBe('Connection failed')
    })

    it('exports TimeoutError class', () => {
      expect(shadmin.TimeoutError).toBeDefined()
      const error = new shadmin.TimeoutError('Request timed out')
      expect(error.message).toBe('Request timed out')
    })

    it('exports ValidationError class', () => {
      expect(shadmin.ValidationError).toBeDefined()
      const error = new shadmin.ValidationError('Validation failed', { email: ['Invalid email'] })
      expect(error.message).toBe('Validation failed')
      expect(error.errors.email).toEqual(['Invalid email'])
    })

    it('exports isHttpError type guard', () => {
      expect(shadmin.isHttpError).toBeDefined()
      expect(typeof shadmin.isHttpError).toBe('function')
      expect(shadmin.isHttpError(new shadmin.HttpError('test', 400))).toBe(true)
      expect(shadmin.isHttpError(new Error('test'))).toBe(false)
    })

    it('exports isNetworkError type guard', () => {
      expect(shadmin.isNetworkError).toBeDefined()
      expect(typeof shadmin.isNetworkError).toBe('function')
      expect(shadmin.isNetworkError(new shadmin.NetworkError())).toBe(true)
      expect(shadmin.isNetworkError(new Error('test'))).toBe(false)
    })

    it('exports isTimeoutError type guard', () => {
      expect(shadmin.isTimeoutError).toBeDefined()
      expect(typeof shadmin.isTimeoutError).toBe('function')
      expect(shadmin.isTimeoutError(new shadmin.TimeoutError())).toBe(true)
      expect(shadmin.isTimeoutError(new Error('test'))).toBe(false)
    })

    it('exports isValidationError type guard', () => {
      expect(shadmin.isValidationError).toBeDefined()
      expect(typeof shadmin.isValidationError).toBe('function')
      expect(shadmin.isValidationError(new shadmin.ValidationError('test', {}))).toBe(true)
      expect(shadmin.isValidationError(new Error('test'))).toBe(false)
    })

    it('exports isNotFoundError helper', () => {
      expect(shadmin.isNotFoundError).toBeDefined()
      expect(typeof shadmin.isNotFoundError).toBe('function')
      expect(shadmin.isNotFoundError(new shadmin.HttpError('not found', 404))).toBe(true)
      expect(shadmin.isNotFoundError(new shadmin.HttpError('bad request', 400))).toBe(false)
    })

    it('exports isForbiddenError helper', () => {
      expect(shadmin.isForbiddenError).toBeDefined()
      expect(typeof shadmin.isForbiddenError).toBe('function')
      expect(shadmin.isForbiddenError(new shadmin.HttpError('forbidden', 403))).toBe(true)
      expect(shadmin.isForbiddenError(new shadmin.HttpError('not found', 404))).toBe(false)
    })

    it('exports isServerError helper', () => {
      expect(shadmin.isServerError).toBeDefined()
      expect(typeof shadmin.isServerError).toBe('function')
      expect(shadmin.isServerError(new shadmin.HttpError('server error', 500))).toBe(true)
      expect(shadmin.isServerError(new shadmin.HttpError('bad request', 400))).toBe(false)
    })

    it('exports isConflictError helper', () => {
      expect(shadmin.isConflictError).toBeDefined()
      expect(typeof shadmin.isConflictError).toBe('function')
      expect(shadmin.isConflictError(new shadmin.HttpError('conflict', 409))).toBe(true)
      expect(shadmin.isConflictError(new shadmin.HttpError('not found', 404))).toBe(false)
    })

    it('exports extractFieldErrors helper', () => {
      expect(shadmin.extractFieldErrors).toBeDefined()
      expect(typeof shadmin.extractFieldErrors).toBe('function')
      const validationError = new shadmin.ValidationError('test', { name: ['required'] })
      expect(shadmin.extractFieldErrors(validationError)).toEqual({ name: ['required'] })
    })
  })
})
