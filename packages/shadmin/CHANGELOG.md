# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-01-10

### Added
- **100% React Admin API Compatibility** - Drop-in replacement for react-admin
- 122 components covering all React Admin use cases
- Full CRUD views (List, Create, Edit, Show) with Base variants
- TabbedForm and FormTab for multi-tab forms
- Complete input component suite (20+ input types)
- Complete field component suite (15+ field types)
- Reference components (ReferenceInput, ReferenceField, ReferenceManyField)
- Advanced list features (Datagrid, InfiniteList, EditableDatagrid, BulkActions)
- Filter system with FilterButton, FilterForm, SearchInput
- Pagination with configurable rows-per-page
- Menu system with SubMenu, DashboardMenuItem support
- Layout system with Sidebar, AppBar, ContainerLayout
- Permission system (useCanAccess, CanAccess, usePermissions)
- Notification system with useNotify hook
- Error boundary with recovery support
- Theme system with dark mode toggle
- Translation context (i18n-ready)
- Zero-config CLI with `npx shadmin` for dev server

### Features
- **React 19 Ready** - Built for latest React with concurrent features
- **shadcn/ui Styling** - Modern, accessible UI components
- **TailwindCSS** - Utility-first styling, no CSS-in-JS overhead
- **TanStack Query v5** - Powerful data fetching and caching
- **TanStack Table v8** - Advanced table features
- **react-hook-form** - Performant form handling
- **Zod Validation** - Type-safe schema validation
- **Tree-shakeable** - Import only what you need

### Documentation
- Comprehensive getting started guide (1000+ lines)
- Migration guide from React Admin (800+ lines)
- Component API documentation (12K+ lines total)
- 4 complete example applications:
  - CRM with contacts, companies, deals
  - AI Agents Management platform
  - Client Portal with auth
  - Developer Dashboard for APIs

## [0.0.1] - 2026-01-06

### Added
- Initial release
- Core admin components (CoreAdminContext, CoreAdminRoutes, Resource)
- CRUD components (List, Edit, Create, Show)
- Input components (TextInput, NumberInput, SelectInput, PasswordInput, DateTimeInput, BooleanInput, SelectArrayInput, ReferenceInput, ReferenceArrayInput)
- Field components (TextField, NumberField, DateField, BooleanField, EmailField, UrlField, ReferenceField, ReferenceArrayField, FunctionField, ReferenceManyField, ArrayField)
- Form components (SimpleForm, TabbedForm, FormTab, Toolbar, FormDataConsumer)
- Layout components (Layout, AppBar, ContainerLayout)
- Menu components (Menu, MenuItem, MenuItemLink, DashboardMenuItem, SubMenu)
- Auth components (LoginPage, LogoutButton)
- List components with Datagrid, Pagination, Filter, and Search functionality
- DataProvider pattern for data fetching abstraction
- AuthProvider pattern for authentication handling
- TanStack Query integration for server state management
- react-hook-form integration for form handling
- React Router integration for navigation
- shadcn/ui component styling
