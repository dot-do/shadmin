# create-shadmin

CLI scaffolding tool for creating [Shadmin](https://github.com/nathanclevenger/shadmin) projects.

## Usage

```bash
# Using npm
npm create shadmin@latest

# Using pnpm
pnpm create shadmin

# Using yarn
yarn create shadmin

# Or with npx
npx create-shadmin@latest
```

## Interactive Setup

The CLI will guide you through the setup process:

```
? Project name: my-admin
? Select a template:
  > default - Basic shadmin setup with Vite
    with-auth - Includes authentication setup
    with-mongo - Includes mongo.do DataProvider
    full - Complete setup with auth and mongo.do
? Package manager:
  > pnpm
    npm
    yarn
```

## Templates

### default

Basic Shadmin setup with Vite and TypeScript:

- React 19
- Shadmin core components
- Tailwind CSS
- Basic resource example

### with-auth

Includes authentication:

- Everything in `default`
- AuthProvider setup
- Login page
- Protected routes

### with-mongo

Includes mongo.do DataProvider:

- Everything in `default`
- shadmin-db package
- mongo.do client configuration
- Environment variables for API key

### full

Complete setup:

- Everything from all templates
- Authentication + mongo.do
- Example resources with full CRUD
- Dashboard component

## Command Line Options

```bash
create-shadmin [project-name] [options]

Options:
  -t, --template <name>  Template to use (default, with-auth, with-mongo, full)
  --no-git               Skip git initialization
  --no-install           Skip dependency installation
  -h, --help             Display help
```

## Examples

```bash
# Create with default template
npm create shadmin my-admin

# Create with specific template
npm create shadmin my-admin --template with-auth

# Create without installing dependencies
npm create shadmin my-admin --no-install
```

## After Creation

```bash
cd my-admin
npm run dev
```

Open http://localhost:5173 to see your admin panel.

## Documentation

See the [Getting Started Guide](../shadmin/docs/getting-started.md) for more information.

## License

MIT
