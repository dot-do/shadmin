import * as React from 'react'
import type { Preview, Decorator } from '@storybook/react'
import { withThemeByClassName } from '@storybook/addon-themes'

// Import global styles - adjust path as needed when styles are created
// import '../packages/shadmin/src/styles/globals.css'

/**
 * Admin context decorator for Storybook
 * Provides necessary context for components that require admin providers
 */
const withAdminContext: Decorator = (Story, _context) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Story />
    </div>
  )
}

/**
 * Router decorator for components that use routing
 */
const withRouter: Decorator = (Story) => {
  return <Story />
}

/**
 * Query client decorator for components that use React Query
 */
const withQueryClient: Decorator = (Story) => {
  // Note: Add QueryClientProvider when React Query is properly set up
  return <Story />
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
        {
          name: 'gray',
          value: '#f4f4f5',
        },
      ],
    },
    layout: 'centered',
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'Components',
          ['Primitives', 'Forms', 'Data Display', 'Navigation', 'Feedback', 'Layout'],
          'Hooks',
          'Utilities',
          '*',
        ],
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
        wide: {
          name: 'Wide',
          styles: { width: '1536px', height: '960px' },
        },
      },
    },
    // Chromatic visual regression testing configuration
    chromatic: {
      // Test at mobile (320px), tablet (768px), and desktop (1200px) viewports
      viewports: [320, 768, 1200],
    },
  },
  decorators: [
    withAdminContext,
    withRouter,
    withQueryClient,
    // Theme switcher - uses class-based dark mode
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  tags: ['autodocs'],
}

export default preview
