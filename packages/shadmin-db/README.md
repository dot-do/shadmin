# shadmin-db

mongo.do DataProvider integration for [Shadmin](https://github.com/nathanclevenger/shadmin).

## Installation

```bash
npm install shadmin-db mongo.do
# or
pnpm add shadmin-db mongo.do
# or
yarn add shadmin-db mongo.do
```

## Usage

```tsx
import { Admin, Resource, List, Datagrid, TextField } from 'shadmin'
import { createMongoDataProvider } from 'shadmin-db'
import { MongoClient } from 'mongo.do'

// Create mongo.do client
const client = new MongoClient({
  apiKey: process.env.MONGO_DO_API_KEY,
})

// Create the data provider
const dataProvider = createMongoDataProvider(client)

// Use in your Admin
function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="posts"
        list={() => (
          <List>
            <Datagrid>
              <TextField source="title" />
              <TextField source="author" />
            </Datagrid>
          </List>
        )}
      />
    </Admin>
  )
}
```

## API

### `createMongoDataProvider(client, options?)`

Creates a DataProvider that connects to mongo.do.

#### Parameters

- `client` - A mongo.do `MongoClient` instance
- `options` (optional):
  - `database` - Default database name
  - `idField` - Field to use as ID (default: `_id`)

#### Returns

A DataProvider compatible with Shadmin that implements:

- `getList` - Fetch paginated, sorted, filtered lists
- `getOne` - Fetch a single record by ID
- `getMany` - Fetch multiple records by IDs
- `getManyReference` - Fetch related records
- `create` - Create a new record
- `update` - Update an existing record
- `updateMany` - Bulk update records
- `delete` - Delete a record
- `deleteMany` - Bulk delete records

## Features

- Full CRUD operations via mongo.do
- Pagination with `$skip` and `$limit`
- Sorting with automatic `id` to `_id` conversion
- Filtering with MongoDB query operators
- Text search support
- ObjectId handling (string and Extended JSON formats)

## Documentation

See the [mongo.do DataProvider Guide](../shadmin/docs/mongo-data-provider.md) for detailed documentation.

## License

MIT
