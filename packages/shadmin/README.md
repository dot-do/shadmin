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

## Bundle Size

Shadmin is significantly lighter than react-admin due to using shadcn/ui instead of Material-UI.

### Size Comparison

| Package | Minified + Brotli | Minified + Gzip | Notes |
|---------|-------------------|-----------------|-------|
| **shadmin** (full) | ~132 KB | ~160 KB | All components |
| **shadmin** (list) | ~66 KB | ~80 KB | List + Datagrid only |
| **shadmin** (form) | ~25 KB | ~30 KB | SimpleForm only |
| react-admin | ~180 KB | ~220 KB | Core package only |
| + @mui/material | ~300 KB | ~350 KB | Required peer dependency |
| **react-admin total** | **~480 KB** | **~570 KB** | With MUI |

**Result: shadmin is ~70% smaller than react-admin + MUI**

### Why Shadmin is Smaller

1. **No Material-UI** - MUI adds ~300KB of CSS-in-JS runtime
2. **Tree-shakeable** - Only import what you use via subpath exports
3. **Native CSS** - Uses Tailwind CSS compiled at build time
4. **Modern dependencies** - TanStack Query is lighter than legacy state management

### Measuring Bundle Size

```bash
# Check current sizes
pnpm size

# Analyze what's contributing to size
pnpm size:why
```

### Tree-Shaking with Subpath Exports

Import only what you need to minimize bundle size:

```tsx
// Full import (~132 KB)
import { Admin, List, Datagrid, TextField } from 'shadmin'

// Selective imports (smaller bundles)
import { List, Datagrid } from 'shadmin/components/list'    // ~66 KB
import { SimpleForm } from 'shadmin/components/form'         // ~25 KB
import { useListContext } from 'shadmin/hooks'               // ~22 KB
```

## CLI

Start a development server with zero configuration:

```bash
npx shadmin              # Start dev server
npx shadmin build        # Build for production
npx shadmin preview      # Preview production build
```

The CLI auto-discovers resources in your project and provides an interactive setup if no resources are found.

## Documentation

Full documentation is available at [mdxui.dev/docs/shadmin](https://mdxui.dev/docs/shadmin).

- [Getting Started](https://mdxui.dev/docs/shadmin/getting-started) - Installation and basic setup
- [Components](https://mdxui.dev/docs/shadmin/components) - All UI components
- [Hooks](https://mdxui.dev/docs/shadmin/hooks) - Data fetching and state hooks
- [DataProvider](https://mdxui.dev/docs/shadmin/data-provider) - API interface
- [Migration Guide](https://mdxui.dev/docs/shadmin/migration) - Migrate from react-admin
- [API Reference](https://mdxui.dev/docs/shadmin/api) - Complete TypeDoc reference

### Local Documentation

- [Installation Guide](./docs/installation.md)
- [Getting Started](./docs/getting-started.md)
- [Migration from react-admin](./docs/migration-from-react-admin.md)
- [Theming Guide](./docs/theming.md)
- [Troubleshooting & FAQ](./TROUBLESHOOTING.md)

## License

MIT
