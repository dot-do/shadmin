# Developer Dashboard Example

An API management dashboard built with shadmin for developer platforms.

## Features

- **API Keys** - Generate, rotate, and manage API keys
- **Webhooks** - Configure webhook endpoints and events
- **Logs** - Request/response logs with filtering
- **Usage** - API usage metrics and quotas
- **Dashboard** - Overview with usage charts

## Running the Example

```bash
# From the monorepo root
pnpm install
cd examples/developer-dashboard
pnpm dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
  App.tsx              # Main app with Admin and Resource config
  Dashboard.tsx        # Usage metrics dashboard
  dataProvider.ts      # Data provider configuration
  resources/
    api-keys/          # API key management CRUD
    webhooks/          # Webhook configuration CRUD
    logs/              # Request logs (list/show only)
    usage/             # Usage stats (list/show only)
```

## Key Patterns Demonstrated

- **Sensitive Data** - Masked API keys with copy functionality
- **Read-only Resources** - Logs and usage without edit
- **Date Filtering** - Time-range filters on logs
- **Code Display** - Formatted JSON for webhook payloads
- **Status Badges** - Active/inactive, success/error states

## Stack

- React 19
- shadmin
- TailwindCSS
- Vite
