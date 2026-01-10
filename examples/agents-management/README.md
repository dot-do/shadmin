# AI Agents Management Example

An AI agents management platform built with shadmin for managing LLM-powered agents.

## Features

- **Agents** - Create and configure AI agents with different models and parameters
- **Conversations** - View conversation history and transcripts
- **Tools** - Manage function calling tools available to agents
- **Prompts** - System prompt library and versioning
- **Dashboard** - Usage metrics and agent performance

## Running the Example

```bash
# From the monorepo root
pnpm install
cd examples/agents-management
pnpm dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
  App.tsx              # Main app with Admin and Resource config
  Dashboard.tsx        # Agent metrics dashboard
  dataProvider.ts      # Data provider configuration
  resources/
    agents/            # Agent configuration CRUD
    conversations/     # Conversation viewer (list/show only)
    tools/             # Tool definition CRUD
    prompts/           # Prompt template CRUD
```

## Key Patterns Demonstrated

- **Custom Layout** - Branded layout with custom styling
- **Read-only Resources** - Conversations without edit/create
- **JSON Fields** - Displaying agent configuration objects
- **Status Indicators** - Agent active/inactive states

## Stack

- React 19
- shadmin
- TailwindCSS
- Vite
