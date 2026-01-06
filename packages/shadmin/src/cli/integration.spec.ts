/**
 * @file integration.spec.ts
 * @description Integration tests for the shadmin CLI
 *
 * Tests the full flow from scanning resource files to generating entry points:
 * 1. Create a temp directory with resource files
 * 2. Call the CLI functions to generate the app
 * 3. Verify the generated code is valid
 * 4. Test the full flow from scanning to entry point generation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { scanResources, type ResourceDefinition } from './scanner'
import { generateEntryPoint, generateImports, generateResourceConfig } from './generator'
import { shadminPlugin } from './vite-plugin'
import { parseArgs, createViteConfig } from './commands'

// Mock the Vite React plugin to avoid esbuild issues in test environment
vi.mock('@vitejs/plugin-react', () => ({
  default: () => ({ name: 'vite:react-babel' }),
}))

describe('CLI Integration Tests', () => {
  let testDir: string

  beforeEach(() => {
    // Create a temporary test directory that simulates a real project
    testDir = join(tmpdir(), `shadmin-integration-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    mkdirSync(join(testDir, 'resources'), { recursive: true })
  })

  afterEach(() => {
    // Clean up test directory
    rmSync(testDir, { recursive: true, force: true })
  })

  describe('Full Pipeline: Scan -> Generate -> Validate', () => {
    it('should complete the full flow for a single resource', async () => {
      // Arrange: Create a resource file
      const resourceContent = `
import { Datagrid, List, TextField } from 'shadmin'

export const name = 'posts'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
    </Datagrid>
  </List>
)

export const icon = () => <span>📝</span>
`
      writeFileSync(join(testDir, 'resources', 'posts.tsx'), resourceContent)

      // Act: Scan resources
      const resources = await scanResources(testDir)

      // Assert: Scanner found the resource
      expect(resources).toHaveLength(1)
      expect(resources[0].name).toBe('posts')
      expect(resources[0].hasComponent.list).toBe(true)
      expect(resources[0].hasComponent.icon).toBe(true)

      // Act: Generate entry point
      const entryPoint = generateEntryPoint(resources)

      // Assert: Entry point is valid
      expect(entryPoint).toContain("import { Admin, Resource } from 'shadmin'")
      expect(entryPoint).toContain("import * as posts from './resources/posts'")
      expect(entryPoint).toContain('export function App()')
      expect(entryPoint).toContain('<Admin')
      expect(entryPoint).toContain('<Resource')
      expect(entryPoint).toContain('name="posts"')
      expect(entryPoint).toContain('list={posts.list}')
      expect(entryPoint).toContain('icon={posts.icon}')
    })

    it('should complete the full flow for multiple resources', async () => {
      // Arrange: Create multiple resource files
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const list = () => <div>Posts List</div>
export const edit = () => <div>Edit Post</div>
export const create = () => <div>Create Post</div>
`
      )

      writeFileSync(
        join(testDir, 'resources', 'users.tsx'),
        `
export const name = 'users'
export const list = () => <div>Users List</div>
export const show = () => <div>Show User</div>
`
      )

      writeFileSync(
        join(testDir, 'resources', 'comments.tsx'),
        `
export const name = 'comments'
export const list = () => <div>Comments List</div>
export const recordRepresentation = (record) => record.content
`
      )

      // Act: Scan and generate
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources)

      // Assert: All resources discovered
      expect(resources).toHaveLength(3)
      const names = resources.map((r) => r.name).sort()
      expect(names).toEqual(['comments', 'posts', 'users'])

      // Assert: All resources in entry point
      expect(entryPoint).toContain('name="posts"')
      expect(entryPoint).toContain('name="users"')
      expect(entryPoint).toContain('name="comments"')

      // Assert: Correct components wired up
      expect(entryPoint).toContain('list={posts.list}')
      expect(entryPoint).toContain('edit={posts.edit}')
      expect(entryPoint).toContain('create={posts.create}')
      expect(entryPoint).toContain('list={users.list}')
      expect(entryPoint).toContain('show={users.show}')
      expect(entryPoint).toContain('list={comments.list}')
      expect(entryPoint).toContain('recordRepresentation={comments.recordRepresentation}')
    })

    it('should handle nested resource directories', async () => {
      // Arrange: Create nested directory structure
      mkdirSync(join(testDir, 'resources', 'admin'), { recursive: true })
      mkdirSync(join(testDir, 'resources', 'public'), { recursive: true })

      writeFileSync(
        join(testDir, 'resources', 'admin', 'users.tsx'),
        `
export const name = 'admin/users'
export const list = () => <div>Admin Users</div>
`
      )

      writeFileSync(
        join(testDir, 'resources', 'public', 'articles.tsx'),
        `
export const name = 'public/articles'
export const list = () => <div>Public Articles</div>
`
      )

      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources)

      // Assert
      expect(resources).toHaveLength(2)
      expect(entryPoint).toContain('name="admin/users"')
      expect(entryPoint).toContain('name="public/articles"')
      // Sanitized import names
      expect(entryPoint).toContain('import * as admin_users')
      expect(entryPoint).toContain('import * as public_articles')
    })

    it('should handle resources with all CRUD operations', async () => {
      // Arrange: Create a fully-featured resource
      writeFileSync(
        join(testDir, 'resources', 'products.tsx'),
        `
export const name = 'products'
export const list = () => <div>List</div>
export const edit = () => <div>Edit</div>
export const show = () => <div>Show</div>
export const create = () => <div>Create</div>
export const icon = () => <span>🛍️</span>
export const recordRepresentation = (r) => r.name
export const options = { label: 'Products' }
`
      )

      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources)

      // Assert: All props present
      expect(resources[0].hasComponent).toEqual({
        list: true,
        edit: true,
        show: true,
        create: true,
        icon: true,
      })
      expect(resources[0].hasExport).toEqual({
        recordRepresentation: true,
        options: true,
      })

      // Assert: All props in generated code
      expect(entryPoint).toContain('list={products.list}')
      expect(entryPoint).toContain('edit={products.edit}')
      expect(entryPoint).toContain('show={products.show}')
      expect(entryPoint).toContain('create={products.create}')
      expect(entryPoint).toContain('icon={products.icon}')
      expect(entryPoint).toContain('recordRepresentation={products.recordRepresentation}')
      expect(entryPoint).toContain('options={products.options}')
    })
  })

  describe('Full Pipeline with Options', () => {
    it('should generate entry point with data provider', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )
      writeFileSync(
        join(testDir, 'data-provider.ts'),
        `export const dataProvider = { getList: () => {} }`
      )

      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources, {
        dataProviderImport: './data-provider',
      })

      // Assert
      expect(entryPoint).toContain("import { dataProvider } from './data-provider'")
      expect(entryPoint).toContain('dataProvider={dataProvider}')
    })

    it('should generate entry point with auth provider', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )

      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources, {
        authProviderImport: './auth-provider',
      })

      // Assert
      expect(entryPoint).toContain("import { authProvider } from './auth-provider'")
      expect(entryPoint).toContain('authProvider={authProvider}')
    })

    it('should generate entry point with custom layout and dashboard', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )

      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources, {
        layoutImport: './layout',
        dashboardImport: './dashboard',
      })

      // Assert
      expect(entryPoint).toContain("import { Layout } from './layout'")
      expect(entryPoint).toContain("import { Dashboard } from './dashboard'")
      expect(entryPoint).toContain('layout={Layout}')
      expect(entryPoint).toContain('dashboard={Dashboard}')
    })

    it('should generate entry point with all options combined', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )
      writeFileSync(
        join(testDir, 'resources', 'users.tsx'),
        `export const name = 'users'\nexport const list = () => <div>List</div>`
      )

      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources, {
        dataProviderImport: './data-provider',
        authProviderImport: './auth-provider',
        layoutImport: './layout',
        dashboardImport: './dashboard',
        basename: '/admin',
      })

      // Assert: All imports present
      expect(entryPoint).toContain("import { dataProvider } from './data-provider'")
      expect(entryPoint).toContain("import { authProvider } from './auth-provider'")
      expect(entryPoint).toContain("import { Layout } from './layout'")
      expect(entryPoint).toContain("import { Dashboard } from './dashboard'")

      // Assert: All Admin props present
      expect(entryPoint).toContain('dataProvider={dataProvider}')
      expect(entryPoint).toContain('authProvider={authProvider}')
      expect(entryPoint).toContain('layout={Layout}')
      expect(entryPoint).toContain('dashboard={Dashboard}')
      expect(entryPoint).toContain('basename="/admin"')

      // Assert: All resources present
      expect(entryPoint).toContain('name="posts"')
      expect(entryPoint).toContain('name="users"')
    })
  })

  describe('Vite Plugin Integration', () => {
    it('should generate code through plugin load hook', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )

      // Act
      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function
      const result = await load('\0virtual:shadmin-app')

      // Assert: Generated code includes resources
      expect(result).toContain("import { Admin, Resource } from 'shadmin'")
      expect(result).toContain("import * as posts from './resources/posts'")
      expect(result).toContain('name="posts"')
      expect(result).toContain('list={posts.list}')
    })

    it('should generate entry module through plugin load hook', async () => {
      // Act
      const plugin = shadminPlugin({ root: testDir })
      const load = plugin.load as Function
      const result = await load('\0virtual:shadmin-entry')

      // Assert: Entry module bootstraps React
      expect(result).toContain("import { createRoot } from 'react-dom/client'")
      expect(result).toContain("import { App } from 'virtual:shadmin-app'")
      expect(result).toContain('createRoot')
      expect(result).toContain('.render(<App')
    })

    it('should respect plugin options in generated code', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )

      // Act
      const plugin = shadminPlugin({
        root: testDir,
        dataProviderImport: './custom-dp',
        authProviderImport: './custom-ap',
        basename: '/my-admin',
      })
      const load = plugin.load as Function
      const result = await load('\0virtual:shadmin-app')

      // Assert
      expect(result).toContain("import { dataProvider } from './custom-dp'")
      expect(result).toContain("import { authProvider } from './custom-ap'")
      expect(result).toContain('basename="/my-admin"')
    })

    it('should handle custom resources directory', async () => {
      // Arrange: Use custom directory name
      mkdirSync(join(testDir, 'admin-resources'), { recursive: true })
      writeFileSync(
        join(testDir, 'admin-resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )

      // Act
      const plugin = shadminPlugin({
        root: testDir,
        resourcesDir: 'admin-resources',
      })
      const load = plugin.load as Function
      const result = await load('\0virtual:shadmin-app')

      // Assert
      expect(result).toContain('name="posts"')
      expect(result).toContain("import * as posts from './admin-resources/posts'")
    })
  })

  describe('CLI Args to Vite Config', () => {
    it('should create valid Vite config from parsed args', () => {
      // Arrange: Simulate CLI args
      const args = parseArgs(['dev', '--port', '3000', '--host', '-o'])

      // Act: Create Vite config
      const config = createViteConfig(args)

      // Assert: Config reflects args
      expect(config.root).toBe(process.cwd())
      expect(config.server?.port).toBe(3000)
      expect(config.server?.host).toBe(true)
      expect(config.server?.open).toBe(true)
    })

    it('should create valid build config', () => {
      // Arrange
      const args = parseArgs(['build', '--outDir', './custom-dist'])

      // Act
      const config = createViteConfig(args)

      // Assert
      expect(config.build?.outDir).toBe('./custom-dist')
    })

    it('should include shadmin plugin in config', () => {
      // Arrange
      const args = parseArgs(['dev'])

      // Act
      const config = createViteConfig(args)

      // Assert: shadmin plugin is included
      const pluginNames = config.plugins?.map((p: any) => p.name)
      expect(pluginNames).toContain('shadmin')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty resources directory gracefully', async () => {
      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources)

      // Assert
      expect(resources).toHaveLength(0)
      expect(entryPoint).toContain('<Admin>')
      expect(entryPoint).toContain('</Admin>')
      expect(entryPoint).not.toContain('<Resource')
    })

    it('should handle non-existent resources directory', async () => {
      // Arrange: Use directory without resources folder
      const emptyDir = join(tmpdir(), `shadmin-empty-${Date.now()}`)
      mkdirSync(emptyDir, { recursive: true })

      try {
        // Act
        const resources = await scanResources(emptyDir)
        const entryPoint = generateEntryPoint(resources)

        // Assert
        expect(resources).toHaveLength(0)
        expect(entryPoint).toContain('<Admin>')
      } finally {
        rmSync(emptyDir, { recursive: true, force: true })
      }
    })

    it('should ignore non-tsx/jsx files in resources directory', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )
      writeFileSync(
        join(testDir, 'resources', 'utils.ts'),
        `export const helper = () => {}`
      )
      writeFileSync(
        join(testDir, 'resources', 'README.md'),
        `# Resources`
      )
      writeFileSync(
        join(testDir, 'resources', 'styles.css'),
        `.container { color: red; }`
      )

      // Act
      const resources = await scanResources(testDir)

      // Assert: Only tsx file discovered
      expect(resources).toHaveLength(1)
      expect(resources[0].name).toBe('posts')
    })

    it('should handle resources with no CRUD components', async () => {
      // Arrange: Resource with only name export
      writeFileSync(
        join(testDir, 'resources', 'empty.tsx'),
        `export const name = 'empty'`
      )

      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources)

      // Assert: Resource discovered with warning
      expect(resources).toHaveLength(1)
      expect(resources[0].warnings).toContain('Resource "empty" has no CRUD components defined')

      // Assert: Still generates valid code
      expect(entryPoint).toContain('name="empty"')
      expect(entryPoint).not.toContain('list={')
    })

    it('should handle resources with function export syntax', async () => {
      // Arrange: Use function declaration syntax
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export function list() {
  return <div>List</div>
}
export function edit() {
  return <div>Edit</div>
}
`
      )

      // Act
      const resources = await scanResources(testDir)

      // Assert
      expect(resources[0].hasComponent.list).toBe(true)
      expect(resources[0].hasComponent.edit).toBe(true)
    })

    it('should handle resources with named export syntax', async () => {
      // Arrange: Use named export syntax
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
const name = 'posts'
const list = () => <div>List</div>
const show = () => <div>Show</div>

export { name, list, show }
`
      )

      // Act
      const resources = await scanResources(testDir)

      // Assert
      expect(resources[0].hasComponent.list).toBe(true)
      expect(resources[0].hasComponent.show).toBe(true)
    })

    it('should infer name from filename when not exported', async () => {
      // Arrange: No name export
      writeFileSync(
        join(testDir, 'resources', 'categories.tsx'),
        `export const list = () => <div>Categories</div>`
      )

      // Act
      const resources = await scanResources(testDir)

      // Assert
      expect(resources[0].name).toBe('categories')
    })

    it('should support both .tsx and .jsx extensions', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )
      writeFileSync(
        join(testDir, 'resources', 'users.jsx'),
        `export const name = 'users'\nexport const list = () => <div>List</div>`
      )

      // Act
      const resources = await scanResources(testDir)

      // Assert
      expect(resources).toHaveLength(2)
      const names = resources.map((r) => r.name).sort()
      expect(names).toEqual(['posts', 'users'])
    })
  })

  describe('Generated Code Validation', () => {
    it('should generate syntactically valid JSX', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )

      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources)

      // Assert: Basic JSX structure validation
      // Check for balanced tags
      const adminOpenTags = (entryPoint.match(/<Admin/g) || []).length
      const adminCloseTags = (entryPoint.match(/<\/Admin>/g) || []).length
      expect(adminOpenTags).toBe(1)
      expect(adminCloseTags).toBe(1)

      // Check for proper function syntax
      expect(entryPoint).toMatch(/export function App\(\)\s*\{/)
      expect(entryPoint).toMatch(/return\s*\(/)
    })

    it('should generate valid import statements', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `export const name = 'posts'\nexport const list = () => <div>List</div>`
      )
      writeFileSync(
        join(testDir, 'resources', 'users.tsx'),
        `export const name = 'users'\nexport const list = () => <div>List</div>`
      )

      // Act
      const resources = await scanResources(testDir)
      const imports = generateImports(resources)

      // Assert: Each import is on its own line
      const importLines = imports.split('\n').filter((l) => l.trim())
      expect(importLines).toHaveLength(2)

      // Assert: Import syntax is valid
      importLines.forEach((line) => {
        expect(line).toMatch(/^import \* as \w+ from '[^']+'\s*$/)
      })
    })

    it('should generate valid Resource component props', async () => {
      // Arrange
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
export const name = 'posts'
export const list = () => <div>List</div>
export const edit = () => <div>Edit</div>
`
      )

      // Act
      const resources = await scanResources(testDir)
      const resourceConfig = generateResourceConfig(resources)

      // Assert: Props are properly formatted
      expect(resourceConfig).toContain('name="posts"')
      expect(resourceConfig).toContain('list={posts.list}')
      expect(resourceConfig).toContain('edit={posts.edit}')

      // Assert: No undefined props
      expect(resourceConfig).not.toContain('undefined')
      expect(resourceConfig).not.toContain('show=')
      expect(resourceConfig).not.toContain('create=')
    })
  })

  describe('Real-World Scenarios', () => {
    it('should handle a typical blog application setup', async () => {
      // Arrange: Create a realistic blog admin structure
      writeFileSync(
        join(testDir, 'resources', 'posts.tsx'),
        `
import { Datagrid, List, TextField, DateField, EditButton, Edit, SimpleForm, TextInput, DateInput, Create, Show, SimpleShowLayout } from 'shadmin'

export const name = 'posts'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <DateField source="createdAt" />
      <EditButton />
    </Datagrid>
  </List>
)

export const edit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="content" multiline />
    </SimpleForm>
  </Edit>
)

export const create = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="content" multiline />
    </SimpleForm>
  </Create>
)

export const show = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" />
      <TextField source="content" />
      <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
)

export const recordRepresentation = (record) => record.title
`
      )

      writeFileSync(
        join(testDir, 'resources', 'users.tsx'),
        `
import { Datagrid, List, TextField, EmailField, Edit, SimpleForm, TextInput } from 'shadmin'

export const name = 'users'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
    </Datagrid>
  </List>
)

export const edit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="email" type="email" />
    </SimpleForm>
  </Edit>
)

export const recordRepresentation = (record) => record.name
`
      )

      writeFileSync(
        join(testDir, 'resources', 'comments.tsx'),
        `
import { Datagrid, List, TextField, ReferenceField, DateField } from 'shadmin'

export const name = 'comments'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="postId" reference="posts" />
      <TextField source="content" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
)
`
      )

      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources, {
        dataProviderImport: './data-provider',
        authProviderImport: './auth-provider',
        layoutImport: './layout',
        dashboardImport: './dashboard',
      })

      // Assert: All resources discovered correctly
      expect(resources).toHaveLength(3)

      // Posts should have all CRUD
      const posts = resources.find((r) => r.name === 'posts')!
      expect(posts.hasComponent).toEqual({
        list: true,
        edit: true,
        show: true,
        create: true,
        icon: false,
      })
      expect(posts.hasExport.recordRepresentation).toBe(true)

      // Users should have list and edit
      const users = resources.find((r) => r.name === 'users')!
      expect(users.hasComponent.list).toBe(true)
      expect(users.hasComponent.edit).toBe(true)
      expect(users.hasComponent.create).toBe(false)

      // Comments should only have list
      const comments = resources.find((r) => r.name === 'comments')!
      expect(comments.hasComponent.list).toBe(true)
      expect(comments.hasComponent.edit).toBe(false)

      // Assert: Entry point is complete
      expect(entryPoint).toContain("import { Admin, Resource } from 'shadmin'")
      expect(entryPoint).toContain("import { dataProvider } from './data-provider'")
      expect(entryPoint).toContain("import { authProvider } from './auth-provider'")
      expect(entryPoint).toContain("import { Layout } from './layout'")
      expect(entryPoint).toContain("import { Dashboard } from './dashboard'")
    })

    it('should handle an e-commerce application setup', async () => {
      // Arrange: Create e-commerce admin structure with nested categories
      mkdirSync(join(testDir, 'resources', 'catalog'), { recursive: true })
      mkdirSync(join(testDir, 'resources', 'orders'), { recursive: true })

      writeFileSync(
        join(testDir, 'resources', 'catalog', 'products.tsx'),
        `
export const name = 'catalog/products'
export const list = () => <div>Products</div>
export const edit = () => <div>Edit Product</div>
export const create = () => <div>Create Product</div>
export const icon = () => <span>📦</span>
export const options = { label: 'Products', group: 'Catalog' }
`
      )

      writeFileSync(
        join(testDir, 'resources', 'catalog', 'categories.tsx'),
        `
export const name = 'catalog/categories'
export const list = () => <div>Categories</div>
export const edit = () => <div>Edit Category</div>
export const icon = () => <span>📁</span>
`
      )

      writeFileSync(
        join(testDir, 'resources', 'orders', 'orders.tsx'),
        `
export const name = 'orders/orders'
export const list = () => <div>Orders</div>
export const show = () => <div>Order Details</div>
export const icon = () => <span>🛒</span>
`
      )

      writeFileSync(
        join(testDir, 'resources', 'customers.tsx'),
        `
export const name = 'customers'
export const list = () => <div>Customers</div>
export const show = () => <div>Customer Details</div>
export const recordRepresentation = (r) => \`\${r.firstName} \${r.lastName}\`
`
      )

      // Act
      const resources = await scanResources(testDir)
      const entryPoint = generateEntryPoint(resources, { basename: '/admin' })

      // Assert
      expect(resources).toHaveLength(4)

      // Check nested paths are handled
      const productResource = resources.find((r) => r.name === 'catalog/products')
      expect(productResource).toBeDefined()
      expect(productResource!.hasComponent.icon).toBe(true)
      expect(productResource!.hasExport.options).toBe(true)

      // Check entry point handles nested names
      expect(entryPoint).toContain('name="catalog/products"')
      expect(entryPoint).toContain('name="catalog/categories"')
      expect(entryPoint).toContain('name="orders/orders"')
      expect(entryPoint).toContain('import * as catalog_products')
      expect(entryPoint).toContain('import * as catalog_categories')
      expect(entryPoint).toContain('import * as orders_orders')
    })
  })
})
