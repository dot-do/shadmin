/**
 * @file interactive.ts
 * @description Interactive CLI menu using React Ink for example scaffolding
 */

import type { ResourceDefinition } from './scanner'

/**
 * Example template definition
 */
export interface ExampleTemplate {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** Emoji icon */
  icon?: string
}

/**
 * Options for shouldShowInteractiveMenu
 */
export interface InteractiveMenuOptions {
  /** Force showing the menu even with resources */
  forceInteractive?: boolean
  /** Running in CI environment */
  isCI?: boolean
}

/**
 * Available example templates
 */
export const EXAMPLE_TEMPLATES: ExampleTemplate[] = [
  {
    id: 'basic',
    name: 'Basic Admin',
    description: 'Minimal setup with users resource',
    icon: '📦',
  },
  {
    id: 'blog',
    name: 'Blog Admin',
    description: 'Posts, categories, and comments',
    icon: '📝',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Admin',
    description: 'Products, orders, and customers',
    icon: '🛒',
  },
  {
    id: 'crm',
    name: 'CRM Admin',
    description: 'Contacts, companies, and deals',
    icon: '👥',
  },
  {
    id: 'content',
    name: 'Content Management',
    description: 'Pages, media, and navigation',
    icon: '📄',
  },
]

/**
 * Template file contents
 */
type TemplateFiles = Record<string, string>

/**
 * Shared shadmin.config.ts content for all templates
 */
const SHADMIN_CONFIG = `import { defineConfig } from 'shadmin/cli'

export default defineConfig({
  dataProvider: './data-provider',
})
`

/**
 * Basic template files
 */
const BASIC_TEMPLATE: TemplateFiles = {
  'shadmin.config.ts': SHADMIN_CONFIG,
  'resources/users.tsx': `import { List, Datagrid, TextField, EmailField, Edit, SimpleForm, TextInput } from 'shadmin'

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

export const icon = () => <span>👤</span>
`,
  'data-provider.ts': `import { DataProvider } from 'shadmin'

// Simple in-memory data provider for demo
const data: Record<string, any[]> = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ],
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const items = data[resource] || []
    return { data: items, total: items.length }
  },
  getOne: async (resource, params) => {
    const item = (data[resource] || []).find(i => i.id === params.id)
    return { data: item }
  },
  getMany: async (resource, params) => {
    const items = (data[resource] || []).filter(i => params.ids.includes(i.id))
    return { data: items }
  },
  getManyReference: async (resource, params) => {
    const items = (data[resource] || []).filter(i => i[params.target] === params.id)
    return { data: items, total: items.length }
  },
  create: async (resource, params) => {
    const newItem = { ...params.data, id: Date.now() }
    data[resource] = [...(data[resource] || []), newItem]
    return { data: newItem }
  },
  update: async (resource, params) => {
    data[resource] = (data[resource] || []).map(i =>
      i.id === params.id ? { ...i, ...params.data } : i
    )
    return { data: { ...params.previousData, ...params.data } }
  },
  updateMany: async (resource, params) => {
    data[resource] = (data[resource] || []).map(i =>
      params.ids.includes(i.id) ? { ...i, ...params.data } : i
    )
    return { data: params.ids }
  },
  delete: async (resource, params) => {
    const deleted = (data[resource] || []).find(i => i.id === params.id)
    data[resource] = (data[resource] || []).filter(i => i.id !== params.id)
    return { data: deleted }
  },
  deleteMany: async (resource, params) => {
    data[resource] = (data[resource] || []).filter(i => !params.ids.includes(i.id))
    return { data: params.ids }
  },
}
`,
}

/**
 * Blog template files
 */
const BLOG_TEMPLATE: TemplateFiles = {
  'resources/posts.tsx': `import { List, Datagrid, TextField, DateField, ReferenceField, Edit, SimpleForm, TextInput, ReferenceInput } from 'shadmin'

export const name = 'posts'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <ReferenceField source="authorId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="publishedAt" />
    </Datagrid>
  </List>
)

export const edit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="content" multiline />
      <ReferenceInput source="authorId" reference="users" />
    </SimpleForm>
  </Edit>
)

export const icon = () => <span>📝</span>
`,
  'resources/users.tsx': `import { List, Datagrid, TextField, EmailField } from 'shadmin'

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

export const icon = () => <span>👤</span>
`,
  'resources/categories.tsx': `import { List, Datagrid, TextField, Edit, SimpleForm, TextInput } from 'shadmin'

export const name = 'categories'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
    </Datagrid>
  </List>
)

export const edit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="slug" />
    </SimpleForm>
  </Edit>
)

export const icon = () => <span>📁</span>
`,
  'data-provider.ts': BASIC_TEMPLATE['data-provider.ts']!,
  'shadmin.config.ts': SHADMIN_CONFIG,
}

/**
 * E-commerce template files
 */
const ECOMMERCE_TEMPLATE: TemplateFiles = {
  'resources/products.tsx': `import { List, Datagrid, TextField, NumberField, Edit, SimpleForm, TextInput, NumberInput } from 'shadmin'

export const name = 'products'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="sku" />
      <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
      <NumberField source="stock" />
    </Datagrid>
  </List>
)

export const edit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="sku" />
      <TextInput source="description" multiline />
      <NumberInput source="price" />
      <NumberInput source="stock" />
    </SimpleForm>
  </Edit>
)

export const icon = () => <span>📦</span>
`,
  'resources/orders.tsx': `import { List, Datagrid, TextField, NumberField, DateField, ReferenceField } from 'shadmin'

export const name = 'orders'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="customerId" reference="customers">
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="total" options={{ style: 'currency', currency: 'USD' }} />
      <TextField source="status" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
)

export const icon = () => <span>🛍️</span>
`,
  'resources/customers.tsx': `import { List, Datagrid, TextField, EmailField } from 'shadmin'

export const name = 'customers'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="phone" />
    </Datagrid>
  </List>
)

export const icon = () => <span>👥</span>
`,
  'data-provider.ts': BASIC_TEMPLATE['data-provider.ts']!,
  'shadmin.config.ts': SHADMIN_CONFIG,
}

/**
 * CRM template files
 */
const CRM_TEMPLATE: TemplateFiles = {
  'resources/contacts.tsx': `import { List, Datagrid, TextField, EmailField, ReferenceField } from 'shadmin'

export const name = 'contacts'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <EmailField source="email" />
      <ReferenceField source="companyId" reference="companies">
        <TextField source="name" />
      </ReferenceField>
    </Datagrid>
  </List>
)

export const icon = () => <span>👤</span>
`,
  'resources/companies.tsx': `import { List, Datagrid, TextField, UrlField } from 'shadmin'

export const name = 'companies'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="industry" />
      <UrlField source="website" />
    </Datagrid>
  </List>
)

export const icon = () => <span>🏢</span>
`,
  'resources/deals.tsx': `import { List, Datagrid, TextField, NumberField, ReferenceField } from 'shadmin'

export const name = 'deals'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <ReferenceField source="companyId" reference="companies">
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="value" options={{ style: 'currency', currency: 'USD' }} />
      <TextField source="stage" />
    </Datagrid>
  </List>
)

export const icon = () => <span>💰</span>
`,
  'data-provider.ts': BASIC_TEMPLATE['data-provider.ts']!,
  'shadmin.config.ts': SHADMIN_CONFIG,
}

/**
 * Content management template files
 */
const CONTENT_TEMPLATE: TemplateFiles = {
  'resources/pages.tsx': `import { List, Datagrid, TextField, DateField, BooleanField } from 'shadmin'

export const name = 'pages'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <BooleanField source="published" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
)

export const icon = () => <span>📄</span>
`,
  'resources/media.tsx': `import { List, Datagrid, TextField, NumberField, DateField } from 'shadmin'

export const name = 'media'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="filename" />
      <TextField source="mimeType" />
      <NumberField source="size" />
      <DateField source="uploadedAt" />
    </Datagrid>
  </List>
)

export const icon = () => <span>🖼️</span>
`,
  'resources/navigation.tsx': `import { List, Datagrid, TextField, NumberField } from 'shadmin'

export const name = 'navigation'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="label" />
      <TextField source="url" />
      <NumberField source="order" />
    </Datagrid>
  </List>
)

export const icon = () => <span>🧭</span>
`,
  'data-provider.ts': BASIC_TEMPLATE['data-provider.ts']!,
  'shadmin.config.ts': SHADMIN_CONFIG,
}

/**
 * Template registry
 */
const TEMPLATE_REGISTRY: Record<string, TemplateFiles> = {
  basic: BASIC_TEMPLATE,
  blog: BLOG_TEMPLATE,
  ecommerce: ECOMMERCE_TEMPLATE,
  crm: CRM_TEMPLATE,
  content: CONTENT_TEMPLATE,
}

/**
 * Gets the files for a template
 *
 * @param templateId - Template identifier
 * @returns Object mapping file paths to contents
 */
export function getTemplateFiles(templateId: string): TemplateFiles {
  return TEMPLATE_REGISTRY[templateId] || {}
}

/**
 * Determines if the interactive menu should be shown
 *
 * @param resources - Discovered resources
 * @param options - Menu options
 * @returns Whether to show the menu
 */
export function shouldShowInteractiveMenu(
  resources: ResourceDefinition[],
  options: InteractiveMenuOptions = {}
): boolean {
  const { forceInteractive, isCI } = options

  // Never show in CI
  if (isCI) {
    return false
  }

  // Show if forced or no resources
  if (forceInteractive) {
    return true
  }

  return resources.length === 0
}
