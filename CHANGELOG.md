# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-12

### Added

#### Core Components
- `Admin` - Root provider orchestration with routing, data, and auth providers
- `Resource` - CRUD route registration for data resources
- `CoreAdminContext` - Context provider for admin configuration
- `CoreAdminRoutes` - Route registration and navigation
- `ThemeProvider` - Theme configuration with light/dark mode support
- `ErrorBoundary` - Error handling wrapper

#### List Components (17 components)
- `List`, `ListBase`, `ListView`, `ListToolbar`, `ListActions`
- `Datagrid`, `DatagridBody`, `DatagridHeader`, `DatagridRow`
- `DataTable` - TanStack Table integration
- `VirtualDatagrid`, `VirtualList` - Virtualized lists for large datasets
- `InfiniteList` - Infinite scroll pagination
- `Pagination`, `RowsPerPageSelector`
- `SimpleList` - Mobile-friendly card list
- `EditableDatagrid` - Inline editing support

#### Form Components (6 components)
- `SimpleForm` - Standard form container with validation
- `TabbedForm` - Multi-tab form layout
- `FormTab` - Tab panel for TabbedForm
- `FormDataConsumer` - Access form data in render props
- `SimpleFormConfigurable` - Configurable form with column control
- `Toolbar` - Form action buttons container

#### Field Components (20 field types)
- `TextField` - Text value display
- `NumberField` - Formatted numbers via `Intl.NumberFormat`
- `DateField` - Formatted dates via `Intl.DateTimeFormat`
- `BooleanField` - Badge or icon for boolean values
- `EmailField` - Clickable mailto link
- `UrlField` - External link
- `FileField` - File download link
- `ImageField` - Image display
- `ChipField` - Badge/chip display
- `SelectField` - Display from choices
- `RichTextField` - HTML content rendering
- `FunctionField` - Custom render function
- `ArrayField` - Iterator for array values
- `ReferenceField` - Related record display
- `ReferenceArrayField` - Array of references
- `ReferenceManyField` - List of related records
- `ReferenceManyCount` - Count of related records
- `RecordField` - Access to full record
- `SingleFieldList` - Single-line field iterator
- `TranslatableFields` - i18n field support

#### Input Components (22 input types)
- `TextInput` - Standard text input
- `NumberInput` - Numeric input with formatting
- `PasswordInput` - Password with visibility toggle
- `DateInput` - Date picker
- `DateTimeInput` - Date and time picker
- `TimeInput` - Time picker
- `SelectInput` - Dropdown selection
- `SelectArrayInput` - Multi-select dropdown
- `BooleanInput` - Switch toggle
- `RadioButtonGroupInput` - Radio button group
- `CheckboxGroupInput` - Checkbox array
- `AutocompleteInput` - Searchable select with suggestions
- `AutocompleteArrayInput` - Multi-select autocomplete
- `ReferenceInput` - Related record selection
- `ReferenceArrayInput` - Multiple related records selection
- `FileInput` - File upload
- `ImageInput` - Image upload with preview
- `RichTextInput` - Rich text editor
- `SearchInput` - Search filter input
- `ArrayInput` - Dynamic array field editor
- `SimpleFormIterator` - Array item iterator
- `TranslatableInputs` - i18n input support

#### Button Components (13 components)
- `CreateButton` - Navigate to create view
- `EditButton` - Navigate to edit view
- `ShowButton` - Navigate to show view
- `DeleteWithConfirmButton` - Delete with confirmation dialog
- `CloneButton` - Clone record
- `ExportButton` - Export data
- `FilterButton` - Toggle filter panel
- `ColumnsButton` - Column visibility toggle
- `BulkDeleteButton` - Bulk delete action
- `BulkDeleteWithConfirmButton` - Bulk delete with confirmation
- `BulkExportButton` - Bulk export selected records
- `InspectorButton` - Debug record inspector
- `InPlaceEditor` - Inline edit toggle

#### Layout Components (5 components)
- `Layout` - Main application layout
- `AppBar` - Top navigation bar
- `Sidebar` - Collapsible sidebar navigation
- `ContainerLayout` - Content container wrapper
- `Title` - Page title component

#### Menu Components (6 components)
- `Menu` - Sidebar menu container
- `MenuItem` - Menu item with icon
- `MenuItemLink` - Linked menu item
- `SubMenu` - Collapsible submenu
- `ResourceItem` - Auto-generated resource menu item
- `DashboardMenuItem` - Dashboard link menu item

#### Auth Components (4 components)
- `LoginPage` - Authentication page with form
- `LogoutButton` - Logout action button
- `ProtectedRoute` - Route authentication wrapper
- `CanAccess` - Permission-based rendering

#### Show Components (5 components)
- `Show`, `ShowBase`, `ShowView`
- `SimpleShowLayout` - Single column show layout
- `TabbedShowLayout` - Tabbed show layout

#### Edit Components (3 components)
- `Edit`, `EditBase`, `EditView`

#### Create Components (4 components)
- `Create`, `CreateBase`, `CreateView`, `CreateContext`

#### Feedback Components (5 components)
- `Loading` - Loading spinner
- `Error` - Error display
- `Empty` - Empty state display
- `Confirm` - Confirmation dialog
- `Notification` - Toast notifications

#### i18n Components (3 components)
- `LocaleSwitcher` - Language selector
- `Translate` - Translation wrapper
- `TranslateLabel` - Translated label

#### Hooks (25+ hooks)
Data fetching:
- `useGetList`, `useGetOne`, `useGetMany`, `useGetManyReference`

Mutations:
- `useCreate`, `useUpdate`, `useUpdateMany`, `useDelete`, `useDeleteMany`

Authentication:
- `useLogin`, `useLogout`, `usePermissions`, `useCanAccess`

Navigation and UI:
- `useNotify`, `useRedirect`, `useRefresh`, `useMediaQuery`

Contexts:
- `useDataProvider`, `useRecordContext`, `useListContext`
- `useListParams` (URL state persistence)

Internationalization:
- `useTranslate`, `useLocale`, `useLocaleState`, `useSetLocale`

Utilities:
- `useCreateSuggestionContext`, `useErrorHandling`
- `createQueryHook`, `createMutationHook` (hook factories)

#### Context Providers (14 contexts)
- `AuthProviderContext` - Authentication state
- `DataProviderContext` - Data layer abstraction
- `FormContext` - Form state management
- `ListContext` - List state (data, filters, sorting, pagination)
- `ListFilterContext` - Filter state
- `ListPaginationContext` - Pagination state
- `ListSelectionContext` - Row selection state
- `ListSortContext` - Sort state
- `NotificationContext` - Toast notification state
- `QueryClientContext` - TanStack Query client
- `RecordContext` - Current record data
- `ResourceContext` - Current resource configuration
- `ThemeContext` - Theme state
- `TranslationContext` - i18n state

#### Architecture Features
- **Facade Pattern** - Controlled ra-core interface for future migration flexibility
- **TanStack Query Integration** - React Query v5 for data fetching and caching
- **TanStack Table Integration** - Headless table with virtualization support
- **TypeScript Strict Mode** - Full type safety throughout
- **React 19 Ready** - Built on the latest React
- **Tailwind CSS v4** - Modern utility-first styling with CSS variables

#### Testing
- **136 spec files** with comprehensive test coverage
- Component, hook, and context unit tests
- Integration tests for complex workflows
- Consumer type tests for API stability

### Migration from React Admin

This release provides a **100% API-compatible drop-in replacement** for React Admin:

```typescript
// Before (React Admin)
import { Admin, Resource, List, Datagrid, TextField } from 'react-admin'

// After (Shadmin) - Just change the import!
import { Admin, Resource, List, Datagrid, TextField } from 'shadmin'
```

Key migration benefits:
- **Zero code changes** - Same hooks, same patterns, same components
- **Material UI replaced with ShadCN** - Modern, accessible components
- **Tailwind CSS styling** - Utility-first, theme-aware styling
- **Smaller bundle** - No MUI JSS runtime overhead
- **Copy-paste ownership** - Components live in your codebase

### Breaking Changes from React Admin

**None** - Shadmin is designed for seamless migration from React Admin. All existing patterns, hooks, and component APIs are preserved.

### Notes

- For new projects without existing React Admin code, consider [@mdxui/admin](../admin/) for a lighter-weight alternative without ra-core dependencies.
- See [MIGRATION.md](./MIGRATION.md) for detailed migration guidance and decision tree.
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical implementation details.
