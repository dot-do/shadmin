# Client Portal Example

A customer-facing portal built with shadmin demonstrating authentication and custom layouts.

## Features

- **Authentication** - Login/logout with demo credentials
- **Custom Layout** - Horizontal navigation, branded header/footer
- **Projects** - Track project progress and milestones
- **Support Tickets** - Submit and view support requests
- **Documents** - Access shared documents and files
- **Dashboard** - Client-specific overview

## Running the Example

```bash
# From the monorepo root
pnpm install
cd examples/client-portal
pnpm dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Demo Credentials

Click any demo account on the login page to auto-fill:

- `client@example.com` - Regular client access
- `premium@example.com` - Premium client with extra features

## Project Structure

```
src/
  App.tsx              # App with custom login page and layout
  Dashboard.tsx        # Client dashboard with overview
  authProvider.ts      # Authentication provider
  dataProvider.ts      # Data provider configuration
  resources/
    projects/          # Project tracking (list/show)
    tickets/           # Support tickets (list/show/create)
    documents/         # Document library (list/show)
```

## Key Patterns Demonstrated

- **Custom Auth Provider** - Login, logout, identity management
- **Custom Login Page** - Branded login with demo credentials
- **Custom Layout** - Non-sidebar layout with horizontal nav
- **Client-facing UX** - Simplified interface without admin controls
- **useGetIdentity** - Displaying logged-in user info
- **useLogout** - Logout functionality

## Stack

- React 19
- shadmin
- TailwindCSS
- Vite
