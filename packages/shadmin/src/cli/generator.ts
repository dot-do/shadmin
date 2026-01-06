/**
 * @file generator.ts
 * @description Entry Generator for shadmin CLI - generates virtual React entry point
 */

import type { ResourceDefinition } from './scanner'

/**
 * Options for the entry generator
 */
export interface GeneratorOptions {
  /** Import path for data provider (e.g., './data-provider') */
  dataProviderImport?: string
  /** Import path for auth provider (e.g., './auth-provider') */
  authProviderImport?: string
  /** Import path for layout component (e.g., './layout') */
  layoutImport?: string
  /** Import path for dashboard component (e.g., './dashboard') */
  dashboardImport?: string
  /** Base URL path for the admin (e.g., '/admin') */
  basename?: string
}

/**
 * Sanitizes a resource name to be a valid JavaScript variable name
 */
function sanitizeVarName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '_')
}

/**
 * Gets the variable name for a resource
 */
function getVarName(resource: ResourceDefinition): string {
  return sanitizeVarName(resource.name)
}

/**
 * Generates import statements for resources
 *
 * @param resources - Array of discovered resources
 * @returns Import statements as a string
 */
export function generateImports(resources: ResourceDefinition[]): string {
  if (resources.length === 0) {
    return ''
  }

  return resources
    .map((resource) => {
      const varName = getVarName(resource)
      return `import * as ${varName} from '${resource.importPath}'`
    })
    .join('\n')
}

/**
 * Generates Resource component configurations
 *
 * @param resources - Array of discovered resources
 * @returns JSX Resource components as a string
 */
export function generateResourceConfig(resources: ResourceDefinition[]): string {
  if (resources.length === 0) {
    return ''
  }

  return resources
    .map((resource) => {
      const varName = getVarName(resource)
      const props: string[] = [`name="${resource.name}"`]

      // Add CRUD component props
      if (resource.hasComponent.list) {
        props.push(`list={${varName}.list}`)
      }
      if (resource.hasComponent.edit) {
        props.push(`edit={${varName}.edit}`)
      }
      if (resource.hasComponent.show) {
        props.push(`show={${varName}.show}`)
      }
      if (resource.hasComponent.create) {
        props.push(`create={${varName}.create}`)
      }
      if (resource.hasComponent.icon) {
        props.push(`icon={${varName}.icon}`)
      }

      // Add additional exports
      if (resource.hasExport.recordRepresentation) {
        props.push(`recordRepresentation={${varName}.recordRepresentation}`)
      }
      if (resource.hasExport.options) {
        props.push(`options={${varName}.options}`)
      }

      return `      <Resource ${props.join(' ')} />`
    })
    .join('\n')
}

/**
 * Generates the complete entry point
 *
 * @param resources - Array of discovered resources
 * @param options - Generator options
 * @returns Complete entry point code as a string
 */
export function generateEntryPoint(
  resources: ResourceDefinition[],
  options: GeneratorOptions = {}
): string {
  const { dataProviderImport, authProviderImport, layoutImport, dashboardImport, basename } =
    options

  // Build imports section
  const imports: string[] = [
    "import { BrowserRouter } from 'react-router'",
    "import { Admin, Resource } from 'shadmin'",
  ]

  // Add optional provider/component imports
  if (dataProviderImport) {
    imports.push(`import { dataProvider } from '${dataProviderImport}'`)
  }
  if (authProviderImport) {
    imports.push(`import { authProvider } from '${authProviderImport}'`)
  }
  if (layoutImport) {
    imports.push(`import { Layout } from '${layoutImport}'`)
  }
  if (dashboardImport) {
    imports.push(`import { Dashboard } from '${dashboardImport}'`)
  }

  // Add resource imports
  const resourceImports = generateImports(resources)
  if (resourceImports) {
    imports.push(resourceImports)
  }

  // Build Admin props (basename goes to BrowserRouter, not Admin)
  const adminProps: string[] = []
  if (dataProviderImport) {
    adminProps.push('dataProvider={dataProvider}')
  }
  if (authProviderImport) {
    adminProps.push('authProvider={authProvider}')
  }
  if (layoutImport) {
    adminProps.push('layout={Layout}')
  }
  if (dashboardImport) {
    adminProps.push('dashboard={Dashboard}')
  }

  // Build Resource components
  const resourceConfig = generateResourceConfig(resources)

  // Generate the entry point
  const adminPropsStr = adminProps.length > 0 ? ` ${adminProps.join(' ')}` : ''
  const resourcesStr = resourceConfig ? `\n${resourceConfig}\n      ` : ''
  const routerPropsStr = basename ? ` basename="${basename}"` : ''

  return `${imports.join('\n')}

export function App() {
  return (
    <BrowserRouter${routerPropsStr}>
      <Admin${adminPropsStr}>${resourcesStr}</Admin>
    </BrowserRouter>
  )
}
`
}
