# Shadmin

**A 100% API-compatible drop-in replacement for React Admin using ShadCN UI**

[![npm version](https://img.shields.io/npm/v/shadmin.svg)](https://www.npmjs.com/package/shadmin)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/nathanclevenger/shadmin/blob/main/LICENSE)

## Installation

```bash
npm install shadmin
```

## Usage

```tsx
import { Admin, Resource, List, Datagrid, TextField, DateField } from 'shadmin'

const PostList = () => (
  <List>
    <Datagrid>
      <TextField source="title" />
      <TextField source="author" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
)

export const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} />
  </Admin>
)
```

## Features

- **Drop-in Replacement** - Change your import from `react-admin` to `shadmin`
- **Modern Aesthetics** - ShadCN components with Tailwind CSS
- **Lightweight Runtime** - No MUI overhead
- **React 19 Ready** - Built on the latest React with TanStack Query
- **Zero-Config CLI** - Run `npx shadmin` to start a dev server instantly

## CLI

Start a development server with zero configuration:

```bash
npx shadmin              # Start dev server
npx shadmin build        # Build for production
npx shadmin preview      # Preview production build
```

The CLI auto-discovers resources in your project and provides an interactive setup if no resources are found.

## Documentation

For full documentation, examples, and API reference, visit the [GitHub repository](https://github.com/nathanclevenger/shadmin).

## License

MIT
