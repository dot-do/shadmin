# shadmin Migration Guide

This document explains when to use shadmin vs @mdxui/admin and how to migrate existing React Admin applications.

## Which Package Should I Use?

Use this decision tree to pick the right package:

```
                    ┌─────────────────────────────┐
                    │  Are you building an admin  │
                    │       dashboard UI?         │
                    └─────────────┬───────────────┘
                                  │
                                 YES
                                  │
                    ┌─────────────▼───────────────┐
                    │ Do you have an EXISTING     │
                    │ react-admin application?    │
                    └─────────────┬───────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
             YES                  │                  NO
              │                   │                   │
              ▼                   │                   ▼
    ┌─────────────────┐           │         ┌─────────────────┐
    │    shadmin      │           │         │  @mdxui/admin   │
    │  (this package) │           │         │                 │
    └────────┬────────┘           │         └────────┬────────┘
             │                    │                  │
             ▼                    │                  ▼
    • Drop-in replacement         │         • Zero ra-core deps
    • Keep ra-core hooks          │         • TanStack Query native
    • Same DataProvider API       │         • Maximum flexibility
    • Minimal code changes        │         • Smaller bundle size
                                  │
                    ┌─────────────▼───────────────┐
                    │ Do you need react-admin's   │
                    │ API compatibility?          │
                    └─────────────┬───────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
             YES                  │                  NO
              │                   │                   │
              ▼                   │                   ▼
    ┌─────────────────┐           │         ┌─────────────────┐
    │    shadmin      │           │         │  @mdxui/admin   │
    │ (API compat)    │           │         │ (fresh start)   │
    └─────────────────┘           │         └─────────────────┘
```

### Quick Reference

| Scenario | Package | Why |
|----------|---------|-----|
| New project, no react-admin | `@mdxui/admin` | Smaller bundle, no legacy patterns |
| Migrating from react-admin | `shadmin` | Drop-in UI replacement |
| Want `useRecordContext` etc. | `shadmin` | Re-exports ra-core hooks |
| Using TanStack Query natively | `@mdxui/admin` | No ra-core abstraction layer |
| Need DataProvider abstraction | `shadmin` | Compatible with react-admin DataProvider |
| Building with dotdo platform | `@mdxui/admin` | Native TanStack integration |

## shadmin vs @mdxui/admin

### When to Use shadmin

Choose **shadmin** if you:

- Have an **existing React Admin application** you want to modernize
- Need **drop-in compatibility** with ra-core hooks and data patterns
- Want to **incrementally migrate** without rewriting business logic
- Require React Admin's **ResourceContext** and **record/resource conventions**
- Use React Admin's **DataProvider/AuthProvider** abstractions

### When to Use @mdxui/admin

Choose **@mdxui/admin** if you:

- Are **starting fresh** with no React Admin codebase
- Want **zero ra-core dependency** (cleaner bundle, no legacy patterns)
- Prefer **TanStack Query native** patterns over React Admin's hooks
- Need **maximum flexibility** in data layer integration
- Are building with the **dotdo platform** (@dotdo/react/tanstack)

### Key Differences

| Aspect | shadmin | @mdxui/admin |
|--------|---------|--------------|
| **ra-core dependency** | Yes (via facade) | No |
| **Hook API** | `useRecordContext`, `useResourceContext` | TanStack Query native |
| **Data Provider** | React Admin DataProvider | Any (TanStack Query) |
| **Migration effort** | Low (drop-in) | Higher (rewrite hooks) |
| **Bundle size** | Larger (includes ra-core) | Smaller |
| **Long-term direction** | Migration path to native | Native from start |

## Migration Path for Existing React Admin Apps

### Phase 1: Replace Material UI with ShadCN

shadmin provides ShadCN-styled versions of all React Admin UI components while maintaining ra-core compatibility.

```tsx
// Before: React Admin with Material UI
import { List, Datagrid, TextField, EditButton } from 'react-admin'

// After: shadmin with same API
import { List, Datagrid, TextField, EditButton } from 'shadmin'
```

**What changes:**
- Visual appearance (Material UI → ShadCN/Tailwind)
- Underlying primitives (MUI → Radix)

**What stays the same:**
- All ra-core hooks work identically
- DataProvider/AuthProvider contracts
- Resource routing and conventions

### Phase 2: Gradual Hook Migration (Optional)

If you want to eventually remove ra-core dependency, shadmin's facade pattern supports gradual migration:

```tsx
// shadmin exports these from ra-core today
import { useRecordContext, useResourceContext } from 'shadmin'

// Future: shadmin can swap to native implementations
// Your code doesn't change
```

### Phase 3: Full Native Migration (Optional)

For teams wanting zero ra-core:

1. Replace `shadmin` imports with `@mdxui/admin`
2. Swap ra-core hooks for TanStack Query patterns
3. Remove DataProvider, use direct API calls with TanStack

## ra-core Exports Used by shadmin

shadmin uses a controlled facade over ra-core, exposing only these exports:

### Context Hooks
- `useResourceContext` - Get current resource name
- `useRecordContext` - Get current record
- `useListContext` - Access list data, pagination, selection
- `useEditContext` - Access edit context (record, save)
- `useCreateContext` - Access create context

### Navigation Hooks
- `useCreatePath` - Create paths for resource routes
- `useRedirect` - Programmatic navigation
- `useRefresh` - Refresh current view data

### Data Hooks
- `useDataProvider` - Access DataProvider instance
- `useDelete` - Delete single record
- `useDeleteMany` - Delete multiple records

### Selection Hooks
- `useUnselectAll` - Clear list selection

### Auth Hooks
- `useGetIdentity` - Get current user identity
- `useLogout` - Log user out

### Base Components
- `EditBase` - Headless edit controller
- `ShowBase` - Headless show controller
- `CreateBase` - Headless create controller

### Context Providers
- `ResourceContext` - Resource context object
- `ResourceContextProvider` - Provider component

### Utilities
- `fetchRelatedRecords` - Fetch related records for export

### Types
- `Identifier`, `RaRecord`, `SortPayload`, `FilterPayload`
- `DataProvider`, `AuthProvider`, `UserIdentity`
- `ListControllerResult`, `Exporter`, `MutationMode`
- `ResourceDefinition`

## Submodule Architecture

shadmin is a **git submodule** in the mdxui monorepo, ensuring:

1. **Isolation** - ra-core dependencies are contained within shadmin
2. **Zero leakage** - No ra-core imports exist outside packages/shadmin
3. **Independent versioning** - shadmin can release independently
4. **Clean separation** - mdxui ecosystem remains ra-core-free

```
projects/ui/
├── packages/
│   ├── admin/          # @mdxui/admin - pure UI, no ra-core
│   ├── primitives/     # @mdxui/primitives - base components
│   ├── shadmin/        # ← git submodule (owns ra-core)
│   │   └── packages/
│   │       └── shadmin/
│   │           └── src/
│   │               └── facade/
│   │                   └── ra-core.ts  # Controlled facade
│   └── ...
```

## Getting Help

- **shadmin issues**: https://github.com/dot-do/shadmin/issues
- **mdxui issues**: https://github.com/dot-do/ui/issues
- **React Admin docs**: https://marmelab.com/react-admin/documentation.html
