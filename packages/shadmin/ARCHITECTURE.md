# Shadmin Architecture

This document describes the architectural patterns and decisions in the shadmin package.

## Migration Phases

### Phase 1: Facade Layer ✅ COMPLETE
- Controlled re-exports from ra-core
- Internal code can use either ra-core or facade
- Type definitions established

### Phase 2: Internal Migration ✅ COMPLETE
- All internal imports routed through facade
- Zero direct ra-core imports outside facade
- ESLint rule enforces this
- Logging abstraction added
- Performance monitoring utilities
- Comprehensive test coverage

### Phase 3: Native Implementation (Future)
- Replace facade implementations with native code
- ra-core becomes optional peer dependency
- Timeline: Post v1.0 stabilization

---

## Dependency Rules

### Import Hierarchy
```
1. Components may import from: hooks, contexts, facade, utils, types
2. Hooks may import from: contexts, facade, utils, types
3. Contexts may import from: facade, types
4. Facade may import from: ra-core (only location allowed)
5. Types may import from: nothing (leaf nodes)
```

### Enforced by ESLint
- `no-restricted-imports`: Blocks direct ra-core imports outside facade
- Run `pnpm audit:imports` to verify compliance

### Audit Script
The import audit script (`scripts/audit-imports.ts`) scans for violations:
```bash
pnpm audit:imports
```

---

## Performance

### Context Architecture
- Contexts split by concern (RecordContext, ListContext, FormContext, etc.)
- Sub-contexts prevent cascading re-renders

### Monitoring
- Development profiler available via `@/utils/profiler`
- React DevTools integration via displayName
- Configurable render warnings and callbacks

### Profiler API
```typescript
import { configureRenderMonitor, getRenderSummary } from 'shadmin/utils'

// Configure warnings
configureRenderMonitor({
  warnThreshold: 10,
  verbose: true,
  onExcessiveRenders: (component) => console.warn(`Excessive renders: ${component}`)
})

// Get summary statistics
const summary = getRenderSummary()
// { ComponentA: { count: 3, avgDuration: 4.0, maxDuration: 5.0 }, ... }
```

---

## Logging

### Logger API
```typescript
import { logger, reportError, setErrorHandler } from 'shadmin/utils'

// Development-only logging (silent in production)
logger.debug('message', { data: 123 })
logger.warn('warning')

// Always logs (production + development)
logger.error('error occurred', error)

// Custom error handler integration (e.g., Sentry)
setErrorHandler((error, context) => {
  Sentry.captureException(error, { extra: context })
})
reportError(new Error('something failed'), { userId: '123' })
```

---

## Facade Layer

The facade (`src/facade/`) provides a controlled abstraction between shadmin and ra-core.

```
External Consumer -> shadmin public API -> ra-core (for compatibility)
Internal Component -> facade -> shadmin native types (for decoupling)
```

### Facade Modules
| Module | Purpose |
|--------|---------|
| `data-provider.ts` | DataProvider types and utilities |
| `auth-provider.ts` | AuthProvider types and utilities |
| `core-types.ts` | Resource, notification, i18n types |
| `ra-core.ts` | Controlled re-exports of hooks/components |
| `index.ts` | Main facade exports |

### Usage
```typescript
// Internal code should use:
import { useRecordContext, DataProvider } from '../facade'

// NOT:
import { useRecordContext } from 'ra-core'  // ❌ Blocked by audit
```

---

## Type Assertion Policy

TypeScript type assertions (`as`) are used sparingly in shadmin. Each assertion must be justified with a comment explaining why it's safe. This section documents the categories of justified assertions.

### Categories of Justified Assertions

#### 1. Context Type Narrowing

React contexts cannot be generic at the provider level. We store a base type (e.g., `RaRecord`, `FieldValues`) and use type assertions when consumers retrieve values with a more specific type.

**Pattern:**
```typescript
// Context stores base type
const RecordContext = createContext<RaRecord | undefined>(undefined)

// Consumer narrows via generic
export function useRecordContext<T extends RaRecord>(): T | undefined {
  // TYPE ASSERTION: Context stores RaRecord base type; caller narrows via generic T.
  // Safe because T extends RaRecord guarantees structural compatibility.
  return useContext(RecordContext) as T | undefined
}
```

**Files using this pattern:**
- `src/contexts/RecordContext.tsx` - Record type narrowing
- `src/contexts/ListContext.tsx` - List result type narrowing
- `src/contexts/FormContext.tsx` - Form values type narrowing
- `src/components/create/CreateContext.tsx` - Create context narrowing

#### 2. External Library Boundaries

When interfacing with external libraries that have loose or missing types, we use assertions to bridge the type gap.

**Pattern:**
```typescript
// TYPE ASSERTION: @dotdo/client uses a Proxy-based API where methods are accessed dynamically.
// The client exposes methods via string keys, requiring Record<string, unknown> access pattern.
const clientRecord = client as unknown as Record<string, unknown>

const method = clientRecord[`auth.${methodName}`]
if (typeof method === 'function') {
  // TYPE ASSERTION: Runtime typeof check confirms this is a function.
  return (method as (params?: unknown) => Promise<T>)(params)
}
```

**Files using this pattern:**
- `src/dotdo-react/auth-provider.ts` - DO client method access
- `src/dotdo-react/provider.tsx` - DO client proxy wrapping
- `src/dotdo-react/data-provider.ts` - DO client RPC calls

#### 3. Generic DataProvider Results

DataProvider methods return generic results. The caller specifies the expected record type via generics, and we cast the result to match.

**Pattern:**
```typescript
// TYPE ASSERTIONS NOTE: All client method calls use type assertions because:
// 1. DOClientProxy methods return generic results with unknown record types
// 2. RecordType is provided by the caller and specifies the expected shape
// 3. We cast to the caller's expected RecordType for type-safe consumption
const result = (await client.list(resource, params)) as DOListResult<RecordType>
```

**Files using this pattern:**
- `src/dotdo-react/data-provider.ts` - All DataProvider method implementations

#### 4. React Component Type Constraints

React's type system has limitations with generics in certain patterns (forwardRef, context providers, higher-order components).

**Pattern:**
```typescript
// TypeScript requires double type assertion here because Control<T> and Control<FieldValues>
// don't sufficiently overlap due to react-hook-form's invariant generic constraints.
// This is safe: T extends FieldValues guarantees structural compatibility at runtime.
control: form.control as unknown as UseFormReturn<FieldValues>['control']
```

**Files using this pattern:**
- `src/components/form/SimpleForm.tsx` - Form control type widening
- `src/components/form/TabbedForm.tsx` - Form control type widening
- `src/components/buttons/EditButton.tsx` - forwardRef with generics

#### 5. Callback Contravariance

TypeScript's function parameter contravariance requires wider types for callback parameters to allow strongly-typed callbacks to be passed.

**Pattern:**
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Allows strongly-typed callbacks without casting
optionText?: string | ((choice: any) => string)
```

This allows users to write:
```typescript
<SelectInput optionText={(choice: MyType) => choice.displayName} />
```

Without requiring them to cast their callback.

**Files using this pattern:**
- `src/components/input/types.ts` - OptionTextProp definition
- `src/components/input/SelectInput.tsx`
- `src/components/input/AutocompleteInput.tsx`
- `src/components/input/SelectArrayInput.tsx`
- `src/components/input/RadioButtonGroupInput.tsx`
- `src/components/input/CheckboxGroupInput.tsx`

#### 6. Test Utilities

Test code may use type assertions for dynamic data generation or mocking.

**Pattern:**
```typescript
// TYPE ASSERTION: Test data generation with dynamic types
const newItem = { ...params.data, id: newId } as unknown as RecordType
```

**Files using this pattern:**
- `src/test-utils/testDataProvider.ts` - In-memory data provider for tests
- `src/test-utils/testAuthProvider.ts` - Mock auth provider

### ESLint Configuration

The `@typescript-eslint/no-explicit-any` rule is set to `warn` to allow targeted `any` usage with justification. When using `any`, always include a reason:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- <reason>
```

Common reasons:
- `External library (@dotdo/client) callback types are untyped`
- `Allows strongly-typed callbacks without casting; function contravariance requires wider type`
- `Matches external library event handler signature which is untyped`

### Adding New Type Assertions

When adding a new type assertion:

1. **Consider alternatives first**: Can you use generics, type guards, or narrower types instead?
2. **Add a comment**: Use the format `// TYPE ASSERTION: <reason>`
3. **Reference this document**: Include `See: ARCHITECTURE.md#type-assertions` for complex cases
4. **For eslint-disable**: Always add `-- <reason>` after the rule name

### Related Documentation

- [TypeScript Handbook: Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [React Admin: Type Safety](https://marmelab.com/react-admin/TypeScript.html)

---

## Test Coverage

Phase 2 added comprehensive test coverage across key modules:

### Facade Layer Tests
| File | Coverage |
|------|----------|
| `facade/data-provider.spec.ts` | DataProvider type guards and utilities |
| `facade/auth-provider.spec.ts` | AuthProvider type guards and utilities |
| `facade/core-types.spec.ts` | Core type definitions |

### Utilities Tests
| File | Coverage |
|------|----------|
| `utils/logger.spec.ts` | Logging abstraction, error handlers |
| `utils/profiler.spec.ts` | Render timing, configuration, summaries |
| `utils/cn.spec.ts` | Class name utilities |
| `utils/filterOperators.spec.ts` | Filter operator helpers |

### CLI Tests
| File | Coverage |
|------|----------|
| `cli/generator.spec.ts` | Code generation |
| `cli/scanner.spec.ts` | File scanning |
| `cli/translation-extractor.spec.ts` | i18n extraction |
| `cli/integration.spec.ts` | End-to-end CLI flows |
| `cli/config.spec.ts` | Configuration handling |
| `cli/commands.spec.ts` | Command parsing |
| `cli/interactive.spec.ts` | Interactive prompts |
| `cli/vite-plugin.spec.ts` | Vite plugin integration |

### Type Tests
| File | Coverage |
|------|----------|
| `types/filter-payload.spec.ts` | Filter payload types |
| `components/input/types.spec.ts` | Input component types |
| `consumer-types.spec.ts` | External API types |
| `exports.spec.ts` | Package exports |
| `subpaths.spec.ts` | Subpath exports |
| `typecheck.spec.ts` | Full type compilation |

### Running Tests
```bash
# Run all tests
pnpm test:run

# Run with coverage
pnpm test:coverage

# Run specific test file
npx vitest run src/facade/data-provider.spec.ts
```
