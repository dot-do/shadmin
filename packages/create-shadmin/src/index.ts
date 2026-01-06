import { Command } from 'commander'
import prompts from 'prompts'
import pc from 'picocolors'
import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { execSync } from 'node:child_process'

interface ProjectOptions {
  name: string
  template: 'basic' | 'full'
  packageManager: 'pnpm' | 'npm' | 'yarn'
  includeMondo: boolean
}

const program = new Command()

program
  .name('create-shadmin')
  .description('Create a new shadmin admin project')
  .version('0.0.1')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <template>', 'Template to use (basic, full)', 'basic')
  .option('--npm', 'Use npm as package manager')
  .option('--yarn', 'Use yarn as package manager')
  .option('--pnpm', 'Use pnpm as package manager')
  .option('--mondo', 'Include shadmin-db integration')
  .action(async (projectName?: string, options?: { template?: string; npm?: boolean; yarn?: boolean; pnpm?: boolean; mondo?: boolean }) => {
    console.log('')
    console.log(pc.bold(pc.cyan('  create-shadmin')) + pc.dim(' - Create a new shadmin admin project'))
    console.log('')

    const responses = await prompts([
      {
        type: projectName ? null : 'text',
        name: 'name',
        message: 'Project name:',
        initial: 'my-admin',
        validate: (value: string) => {
          if (!value) return 'Project name is required'
          if (!/^[a-z0-9-_]+$/i.test(value)) return 'Project name can only contain letters, numbers, hyphens, and underscores'
          return true
        },
      },
      {
        type: options?.template ? null : 'select',
        name: 'template',
        message: 'Select a template:',
        choices: [
          { title: 'Basic', value: 'basic', description: 'Minimal setup with essential components' },
          { title: 'Full', value: 'full', description: 'Complete admin dashboard with all features' },
        ],
        initial: 0,
      },
      {
        type: options?.npm || options?.yarn || options?.pnpm ? null : 'select',
        name: 'packageManager',
        message: 'Package manager:',
        choices: [
          { title: 'pnpm', value: 'pnpm' },
          { title: 'npm', value: 'npm' },
          { title: 'yarn', value: 'yarn' },
        ],
        initial: 0,
      },
      {
        type: options?.mondo !== undefined ? null : 'confirm',
        name: 'includeMondo',
        message: 'Include shadmin-db (MongoDB integration)?',
        initial: false,
      },
    ])

    const finalOptions: ProjectOptions = {
      name: projectName ?? responses.name,
      template: (options?.template as 'basic' | 'full') ?? responses.template ?? 'basic',
      packageManager: options?.npm ? 'npm' : options?.yarn ? 'yarn' : options?.pnpm ? 'pnpm' : responses.packageManager ?? 'pnpm',
      includeMondo: options?.mondo ?? responses.includeMondo ?? false,
    }

    if (!finalOptions.name) {
      console.log(pc.red('Project name is required'))
      process.exit(1)
    }

    await createProject(finalOptions)
  })

async function createProject(options: ProjectOptions): Promise<void> {
  const { name, template, packageManager, includeMondo } = options
  const projectPath = resolve(process.cwd(), name)

  console.log('')
  console.log(pc.cyan(`Creating project in ${pc.bold(projectPath)}...`))
  console.log('')

  // Create project directory
  await mkdir(projectPath, { recursive: true })

  // Create package.json
  const dependencies: Record<string, string> = {
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    shadmin: '^0.0.1',
  }

  if (includeMondo) {
    dependencies['shadmin-db'] = '^0.0.1'
    dependencies['mongo.do'] = '^0.1.0'
  }

  const devDependencies: Record<string, string> = {
    '@types/react': '^19.0.2',
    '@types/react-dom': '^19.0.2',
    '@vitejs/plugin-react': '^4.3.4',
    typescript: '^5.7.2',
    vite: '^6.0.5',
  }

  const packageJson = {
    name,
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      typecheck: 'tsc --noEmit',
    },
    dependencies,
    devDependencies,
  }

  await writeFile(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2))

  // Create tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      strictNullChecks: true,
      noImplicitAny: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      forceConsistentCasingInFileNames: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'react-jsx',
      skipLibCheck: true,
      baseUrl: '.',
      paths: {
        '@/*': ['./src/*'],
      },
      outDir: './dist',
    },
    include: ['src'],
    exclude: ['node_modules', 'dist'],
  }

  await writeFile(join(projectPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2))

  // Create vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
`

  await writeFile(join(projectPath, 'vite.config.ts'), viteConfig)

  // Create src directory
  await mkdir(join(projectPath, 'src'), { recursive: true })

  // Create index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`

  await writeFile(join(projectPath, 'index.html'), indexHtml)

  // Create main.tsx
  const mainTsx = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`

  await writeFile(join(projectPath, 'src', 'main.tsx'), mainTsx)

  // Create App.tsx
  const appTsx = template === 'full' ? getFullAppTemplate(includeMondo) : getBasicAppTemplate(includeMondo)
  await writeFile(join(projectPath, 'src', 'App.tsx'), appTsx)

  // Create .gitignore
  const gitignore = `node_modules
dist
.env
.env.local
*.log
.DS_Store
`

  await writeFile(join(projectPath, '.gitignore'), gitignore)

  console.log(pc.green('  Created project structure'))

  // Install dependencies
  console.log('')
  console.log(pc.cyan(`Installing dependencies with ${packageManager}...`))

  try {
    const installCmd = packageManager === 'npm' ? 'npm install' : packageManager === 'yarn' ? 'yarn' : 'pnpm install'
    execSync(installCmd, { cwd: projectPath, stdio: 'inherit' })
    console.log(pc.green('  Dependencies installed'))
  } catch {
    console.log(pc.yellow('  Could not install dependencies automatically'))
    console.log(pc.yellow(`  Run "${packageManager} install" manually`))
  }

  // Print success message
  console.log('')
  console.log(pc.green('  Success!') + ' Created ' + pc.bold(name))
  console.log('')
  console.log('  Next steps:')
  console.log('')
  console.log(pc.cyan(`    cd ${name}`))
  console.log(pc.cyan(`    ${packageManager}${packageManager === 'npm' ? ' run' : ''} dev`))
  console.log('')
}

function getBasicAppTemplate(includeMondo: boolean): string {
  if (includeMondo) {
    return `import { Button } from 'shadmin'
// import { createMondoDataProvider } from 'shadmin-db'

export default function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Shadmin</h1>
      <p>Your admin dashboard is ready!</p>
      <Button>Get Started</Button>
    </div>
  )
}
`
  }

  return `import { Button } from 'shadmin'

export default function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Shadmin</h1>
      <p>Your admin dashboard is ready!</p>
      <Button>Get Started</Button>
    </div>
  )
}
`
}

function getFullAppTemplate(includeMondo: boolean): string {
  if (includeMondo) {
    return `import { Button } from 'shadmin'
// import { createMondoDataProvider } from 'shadmin-db'

// Configure your MongoDB connection
// const dataProvider = createMondoDataProvider({
//   client: mongoClient,
//   database: 'your-database'
// })

export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Shadmin Dashboard</h1>
        <p>Full admin template with MongoDB integration</p>
      </header>

      <main>
        <section style={{ marginBottom: '2rem' }}>
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="default">View Users</Button>
            <Button variant="secondary">Manage Content</Button>
            <Button variant="outline">Settings</Button>
          </div>
        </section>

        <section>
          <h2>Getting Started</h2>
          <ol style={{ lineHeight: '2' }}>
            <li>Configure your MongoDB connection in the dataProvider</li>
            <li>Define your resources and their schemas</li>
            <li>Customize the dashboard layout</li>
            <li>Add authentication if needed</li>
          </ol>
        </section>
      </main>
    </div>
  )
}
`
  }

  return `import { Button } from 'shadmin'

export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Shadmin Dashboard</h1>
        <p>Full admin template</p>
      </header>

      <main>
        <section style={{ marginBottom: '2rem' }}>
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="default">View Users</Button>
            <Button variant="secondary">Manage Content</Button>
            <Button variant="outline">Settings</Button>
          </div>
        </section>

        <section>
          <h2>Getting Started</h2>
          <ol style={{ lineHeight: '2' }}>
            <li>Configure your data provider</li>
            <li>Define your resources and their schemas</li>
            <li>Customize the dashboard layout</li>
            <li>Add authentication if needed</li>
          </ol>
        </section>
      </main>
    </div>
  )
}
`
}

program.parse()
