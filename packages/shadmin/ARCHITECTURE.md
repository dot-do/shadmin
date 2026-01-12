# Shadmin Architecture

This document describes the architectural patterns and decisions in the shadmin package.

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
