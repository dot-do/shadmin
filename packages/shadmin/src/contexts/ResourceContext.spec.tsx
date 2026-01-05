import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  ResourceContext,
  ResourceContextProvider,
  useResourceContext,
  ResourceDefinitionContextProvider,
  useResourceDefinition,
} from './ResourceContext'

describe('ResourceContext', () => {
  describe('ResourceContext', () => {
    it('should export the React context', () => {
      expect(ResourceContext).toBeDefined()
    })
  })

  describe('ResourceContextProvider', () => {
    it('should provide resource name to children', () => {
      const Consumer = () => {
        const resource = useResourceContext()
        return <div data-testid="resource">{resource}</div>
      }

      render(
        <ResourceContextProvider value="users">
          <Consumer />
        </ResourceContextProvider>
      )

      expect(screen.getByTestId('resource')).toHaveTextContent('users')
    })

    it('should allow nested providers with different resources', () => {
      const Consumer = () => {
        const resource = useResourceContext()
        return <div data-testid="resource">{resource}</div>
      }

      render(
        <ResourceContextProvider value="users">
          <ResourceContextProvider value="posts">
            <Consumer />
          </ResourceContextProvider>
        </ResourceContextProvider>
      )

      expect(screen.getByTestId('resource')).toHaveTextContent('posts')
    })

    it('should work with ResourceDefinitionContext for full resource info', () => {
      const definitions = {
        products: {
          name: 'products',
          options: { label: 'Products' },
        },
      }

      const Consumer = () => {
        const resource = useResourceContext()
        const definition = useResourceDefinition()
        return (
          <div>
            <span data-testid="resource">{resource}</span>
            <span data-testid="label">{definition?.options?.label as string}</span>
          </div>
        )
      }

      render(
        <ResourceDefinitionContextProvider definitions={definitions}>
          <ResourceContextProvider value="products">
            <Consumer />
          </ResourceContextProvider>
        </ResourceDefinitionContextProvider>
      )

      expect(screen.getByTestId('resource')).toHaveTextContent('products')
      expect(screen.getByTestId('label')).toHaveTextContent('Products')
    })
  })

  describe('useResourceContext', () => {
    it('should return undefined when used outside provider', () => {
      const Consumer = () => {
        const resource = useResourceContext()
        return <div data-testid="resource">{resource ?? 'undefined'}</div>
      }

      render(<Consumer />)

      expect(screen.getByTestId('resource')).toHaveTextContent('undefined')
    })

    it('should throw when required and used outside provider', () => {
      const Consumer = () => {
        // This should throw when options.required is true
        useResourceContext({ required: true })
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useResourceContext must be used inside a ResourceContextProvider'
      )
    })

    it('should accept default resource name', () => {
      const Consumer = () => {
        const resource = useResourceContext({ defaultValue: 'fallback' })
        return <div data-testid="resource">{resource}</div>
      }

      render(<Consumer />)

      expect(screen.getByTestId('resource')).toHaveTextContent('fallback')
    })

    it('should return context value over default when inside provider', () => {
      const Consumer = () => {
        const resource = useResourceContext({ defaultValue: 'fallback' })
        return <div data-testid="resource">{resource}</div>
      }

      render(
        <ResourceContextProvider value="actual">
          <Consumer />
        </ResourceContextProvider>
      )

      expect(screen.getByTestId('resource')).toHaveTextContent('actual')
    })
  })
})
