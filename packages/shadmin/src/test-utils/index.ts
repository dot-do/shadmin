/**
 * Test utilities for shadmin
 * Exports all testing helpers for component testing
 */

// Data provider testing utilities
export {
  createMockDataProvider,
  spyOnDataProvider,
  defaultMockData,
  type DataProvider,
  type MockDataProviderOptions,
} from './testDataProvider'

// Re-export data provider types from the main types module
export type {
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  GetManyParams,
  GetManyResult,
  GetManyReferenceParams,
  GetManyReferenceResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  UpdateManyParams,
  UpdateManyResult,
  DeleteParams,
  DeleteResult,
  DeleteManyParams,
  DeleteManyResult,
  PaginationPayload,
  SortPayload,
  FilterPayload,
} from '../types'

// Auth provider testing utilities
export {
  createMockAuthProvider,
  createFailingAuthProvider,
  createDelayedAuthProvider,
  spyOnAuthProvider,
  defaultUserIdentity,
  defaultPermissions,
  type AuthProvider,
  type MockAuthProviderOptions,
  type UserIdentity,
  type LoginParams,
  type Permissions,
} from './testAuthProvider'

// Router testing utilities
export {
  TestMemoryRouter,
  useTestRouter,
  useTestLocation,
  useTestNavigate,
  useTestParams,
  useTestSearchParams,
  matchPath,
  Route,
  Routes,
  Link,
  type Location,
  type NavigateOptions,
  type RouterContextValue,
  type TestMemoryRouterProps,
  type RouteMatch,
  type RouteProps,
  type RoutesProps,
  type LinkProps,
} from './TestMemoryRouter'

// Admin context testing utilities
export {
  TestAdminContext,
  useAdminContext,
  useDataProvider,
  useAuthProvider,
  useGetIdentity,
  usePermissions,
  createAdminRender,
  waitForAdminData,
  type AdminContextValue,
  type ResourceDefinition,
  type TestAdminContextProps,
} from './TestAdminContext'

// Re-export testing library utilities for convenience
// Note: These are peer dependencies and need to be installed separately
// export { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
// export { userEvent } from '@testing-library/user-event'
