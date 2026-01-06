# Installation

This guide covers how to install and configure shadmin in your React project.

## Requirements

- React 19.0.0 or higher
- React DOM 19.0.0 or higher
- Node.js 18 or higher

## Package Installation

### npm

```bash
npm install shadmin
```

### yarn

```bash
yarn add shadmin
```

### pnpm

```bash
pnpm add shadmin
```

## Peer Dependencies

shadmin requires React 19 as a peer dependency. If you haven't already installed React, add it to your project:

### npm

```bash
npm install react@^19.0.0 react-dom@^19.0.0
```

### yarn

```bash
yarn add react@^19.0.0 react-dom@^19.0.0
```

### pnpm

```bash
pnpm add react@^19.0.0 react-dom@^19.0.0
```

## Framework Setup

### Vite

Vite is the recommended build tool for shadmin projects.

1. **Create a new Vite project** (if starting fresh):

```bash
npm create vite@latest my-admin-app -- --template react-ts
cd my-admin-app
```

2. **Install shadmin**:

```bash
npm install shadmin
```

3. **Update your `vite.config.ts`**:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

4. **Start the development server**:

```bash
npm run dev
```

### Next.js

shadmin works with Next.js App Router.

1. **Create a new Next.js project** (if starting fresh):

```bash
npx create-next-app@latest my-admin-app --typescript --tailwind --app
cd my-admin-app
```

2. **Install shadmin**:

```bash
npm install shadmin
```

3. **Configure for client components**:

Since shadmin uses React hooks and context, components must be rendered on the client. Create a client wrapper:

```typescript
// app/providers.tsx
'use client'

import { AdminContext } from 'shadmin'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminContext>
      {children}
    </AdminContext>
  )
}
```

4. **Use the provider in your layout**:

```typescript
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### Create React App

> **Note**: Create React App is in maintenance mode. We recommend using Vite for new projects.

1. **Create a new CRA project** (if starting fresh):

```bash
npx create-react-app my-admin-app --template typescript
cd my-admin-app
```

2. **Upgrade to React 19**:

```bash
npm install react@^19.0.0 react-dom@^19.0.0
npm install -D @types/react@^19.0.0 @types/react-dom@^19.0.0
```

3. **Install shadmin**:

```bash
npm install shadmin
```

4. **Start the development server**:

```bash
npm start
```

## TypeScript Configuration

shadmin is written in TypeScript and includes full type definitions. For the best experience, ensure your `tsconfig.json` includes these settings:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### Path Aliases (Optional)

For cleaner imports, configure path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Tailwind CSS Setup

shadmin requires Tailwind CSS for styling. Follow these steps to set it up:

### 1. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/shadmin/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

> **Important**: Include the `node_modules/shadmin/dist/**/*.{js,ts,jsx,tsx}` path to ensure Tailwind processes shadmin's component styles.

### 3. Add Tailwind Directives

Add the Tailwind directives to your main CSS file (e.g., `src/index.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Import the CSS File

Ensure your CSS file is imported in your application entry point:

```typescript
// src/main.tsx (Vite) or src/index.tsx (CRA)
import './index.css'
```

## Included Dependencies

shadmin bundles the following dependencies, so you don't need to install them separately:

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-query` | ^5.90.16 | Server state management |
| `@tanstack/react-table` | ^8.21.3 | Table/DataGrid functionality |
| `react-hook-form` | ^7.70.0 | Form state management |
| `react-router` | ^7.11.0 | Client-side routing |
| `zod` | ^4.3.5 | Schema validation |
| `lodash-es` | ^4.17.22 | Utility functions |

## Verifying Installation

Create a simple test to verify shadmin is installed correctly:

```typescript
// src/App.tsx
import { Admin, Resource, ListGuesser } from 'shadmin'

const dataProvider = {
  getList: async () => ({ data: [], total: 0 }),
  getOne: async () => ({ data: {} }),
  create: async () => ({ data: {} }),
  update: async () => ({ data: {} }),
  delete: async () => ({ data: {} }),
}

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="posts" list={ListGuesser} />
    </Admin>
  )
}

export default App
```

If the application loads without errors, shadmin is correctly installed.

## Next Steps

- [Quick Start Guide](./quick-start.md) - Build your first admin interface
- [Data Providers](./data-providers.md) - Connect to your backend API
- [Components](./components.md) - Explore available components
