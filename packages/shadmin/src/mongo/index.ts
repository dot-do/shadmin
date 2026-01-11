/**
 * mongo.do Integration for shadmin
 *
 * This module provides seamless integration between shadmin and mongo.do,
 * a MongoDB-compatible edge database service.
 *
 * @module mongo
 *
 * @example Basic usage
 * ```tsx
 * import { Admin, Resource } from 'shadmin'
 * import { createMongoDataProvider } from 'shadmin/mongo'
 *
 * const dataProvider = createMongoDataProvider({
 *   baseUrl: 'https://my-database.mongo.do',
 *   apiKey: 'your-api-key'
 * })
 *
 * function App() {
 *   return (
 *     <Admin dataProvider={dataProvider}>
 *       <Resource name="users" list={UserList} />
 *       <Resource name="posts" list={PostList} />
 *     </Admin>
 *   )
 * }
 * ```
 *
 * @example With custom configuration
 * ```tsx
 * const dataProvider = createMongoDataProvider(
 *   {
 *     baseUrl: 'https://my-database.mongo.do',
 *     database: 'production',
 *     apiKey: process.env.MONGO_DO_API_KEY,
 *     timeout: 60000,
 *   },
 *   {
 *     resourceMapping: { 'users': 'user-accounts' },
 *     defaultSortField: 'createdAt',
 *     defaultSortOrder: 'DESC',
 *   }
 * )
 * ```
 */

// Main factory function
export { createMongoDataProvider } from './data-provider'

// Types
export type {
  // Configuration types
  MongoConfig,
  MongoDataProviderOptions,
  // Response types
  MongoListResponse,
  MongoRecordResponse,
  MongoBatchResponse,
  MongoWriteResponse,
  MongoErrorResponse,
  // Request types
  MongoRequestOptions,
  // Filter types
  MongoFilterOperators,
} from './types'
