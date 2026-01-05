import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming/create'

/**
 * Custom Storybook theme for shadmin
 */
const shadminTheme = create({
  base: 'light',

  // Brand
  brandTitle: 'shadmin',
  brandUrl: 'https://github.com/nathanclevenger/shadmin',
  brandTarget: '_blank',

  // UI
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,

  // Typography
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',

  // Text colors
  textColor: '#0f172a',
  textInverseColor: '#f8fafc',
  textMutedColor: '#64748b',

  // Toolbar default and active colors
  barTextColor: '#64748b',
  barSelectedColor: '#0f172a',
  barHoverColor: '#0f172a',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e2e8f0',
  inputTextColor: '#0f172a',
  inputBorderRadius: 6,

  // Colors
  colorPrimary: '#0f172a',
  colorSecondary: '#3b82f6',
})

addons.setConfig({
  theme: shadminTheme,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
  enableShortcuts: true,
})
