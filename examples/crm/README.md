# CRM Example

A complete Customer Relationship Management (CRM) application built with shadmin.

## Features

- **Contacts** - Manage customer contacts with full CRUD operations
- **Companies** - Track companies and their relationships
- **Deals** - Pipeline management for sales deals
- **Activities** - Log calls, meetings, and follow-ups
- **Dashboard** - Overview with key metrics and charts

## Running the Example

```bash
# From the monorepo root
pnpm install
cd examples/crm
pnpm dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
  App.tsx              # Main app with Admin and Resource config
  Dashboard.tsx        # Custom dashboard component
  dataProvider.ts      # Data provider configuration
  resources/
    contacts/          # Contact CRUD views
    companies/         # Company CRUD views
    deals/             # Deal CRUD views
    activities/        # Activity CRUD views
```

## Key Patterns Demonstrated

- **Resource Configuration** - Full CRUD with list, show, edit, create
- **Custom Dashboard** - Statistics cards, charts, recent activity
- **Reference Fields** - Linking contacts to companies
- **Filters and Search** - Advanced filtering on lists

## Stack

- React 19
- shadmin
- TailwindCSS
- Vite
