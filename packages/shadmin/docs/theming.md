# Theming Guide

Shadmin provides a comprehensive theming system built on CSS variables and Tailwind CSS, enabling seamless light/dark mode support and extensive customization options.

## Table of Contents

- [CSS Variables and Tailwind Integration](#css-variables-and-tailwind-integration)
- [Light/Dark/System Theme Modes](#lightdarksystem-theme-modes)
- [Custom Theme Configuration](#custom-theme-configuration)
- [Theme Toggle Component](#theme-toggle-component)
- [Color Customization](#color-customization)
- [Component Styling with cn() Utility](#component-styling-with-cn-utility)

## CSS Variables and Tailwind Integration

Shadmin uses CSS custom properties (variables) in HSL format for all color values. This approach integrates seamlessly with Tailwind CSS and enables runtime theme switching without JavaScript-based class swapping.

### Setting Up Your CSS

Add the following to your global CSS file (e.g., `index.css` or `globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Tailwind Configuration

Ensure your `tailwind.config.js` includes the shadmin source files:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Include shadmin components
    '../../shadmin/src/**/*.{js,ts,jsx,tsx}',
    // Or if using as a package:
    // './node_modules/shadmin/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### CSS Variable Reference

| Variable | Light Mode | Dark Mode | Description |
|----------|------------|-----------|-------------|
| `--background` | White | Near black | Main background color |
| `--foreground` | Dark gray | Light gray | Primary text color |
| `--primary` | Blue | Lighter blue | Primary brand color |
| `--primary-foreground` | Light | Dark | Text on primary backgrounds |
| `--secondary` | Light gray | Dark gray | Secondary elements |
| `--muted` | Light gray | Dark gray | Muted/subdued elements |
| `--muted-foreground` | Medium gray | Light gray | Text for muted elements |
| `--accent` | Light gray | Dark gray | Accent/highlight color |
| `--destructive` | Red | Dark red | Error/danger states |
| `--border` | Light gray | Dark gray | Border colors |
| `--input` | Light gray | Dark gray | Form input borders |
| `--ring` | Blue | Blue | Focus ring color |
| `--radius` | 0.5rem | 0.5rem | Border radius |

## Light/Dark/System Theme Modes

Shadmin supports three theme modes:

- **Light**: Forces light theme
- **Dark**: Forces dark theme
- **System**: Automatically matches the user's operating system preference

### Using ThemeProvider

Wrap your application with `ThemeProvider` to enable theme management:

```tsx
import { ThemeProvider } from 'shadmin'

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <YourApp />
    </ThemeProvider>
  )
}
```

### ThemeProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Initial theme |
| `storageKey` | `string` | `'shadmin-theme'` | localStorage key for persistence |
| `themes` | `string[]` | `['light', 'dark', 'system']` | Available themes |
| `attribute` | `string \| string[]` | `'class'` | HTML attribute for theme |
| `forcedTheme` | `Theme` | - | Force a specific theme |
| `disableTransitionOnChange` | `boolean` | `false` | Disable transitions during theme change |

### Using the useTheme Hook

Access and control the current theme with the `useTheme` hook:

```tsx
import { useTheme } from 'shadmin'

function ThemeDisplay() {
  const { theme, setTheme, resolvedTheme, themes } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <p>Available themes: {themes.join(', ')}</p>

      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

### ThemeContextValue

The `useTheme` hook returns:

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `'light' \| 'dark' \| 'system'` | Current theme setting |
| `setTheme` | `(theme: Theme) => void` | Function to change theme |
| `resolvedTheme` | `'light' \| 'dark'` | Actual applied theme (resolves 'system') |
| `themes` | `string[]` | List of available themes |

## Custom Theme Configuration

### Layout Component Theme Support

The `Layout` component includes built-in theme support:

```tsx
import { Layout } from 'shadmin'

function AdminApp() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  return (
    <Layout
      title="Admin Panel"
      theme={theme}
      onThemeChange={setTheme}
      showThemeToggle={true}
    >
      <YourContent />
    </Layout>
  )
}
```

### Layout Theme Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | Current theme |
| `onThemeChange` | `(theme: Theme) => void` | - | Theme change callback |
| `showThemeToggle` | `boolean` | `false` | Show theme toggle button |

### Custom Attribute Theming

You can apply themes using different HTML attributes:

```tsx
// Using data attribute instead of class
<ThemeProvider attribute="data-theme">
  <App />
</ThemeProvider>

// Using multiple attributes
<ThemeProvider attribute={['class', 'data-theme']}>
  <App />
</ThemeProvider>
```

### Forced Theme

Force a specific theme for certain pages or components:

```tsx
// Force dark theme for a specific section
<ThemeProvider forcedTheme="dark">
  <DarkOnlySection />
</ThemeProvider>
```

## Theme Toggle Component

### Built-in Theme Toggle

The `Layout` component includes a built-in theme toggle in the AppBar:

```tsx
<Layout
  showThemeToggle={true}
  theme={theme}
  onThemeChange={setTheme}
>
  <Content />
</Layout>
```

### Custom Theme Toggle

Create a custom theme toggle button:

```tsx
import { useTheme } from 'shadmin'
import { cn } from 'shadmin/lib/utils'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const cycleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(nextTheme)
  }

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      {resolvedTheme === 'dark' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  )
}
```

### Theme Selector Dropdown

For more control, create a dropdown selector:

```tsx
import { useTheme } from 'shadmin'

function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme()

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
      className="rounded-md border border-input bg-background px-3 py-2"
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </option>
      ))}
    </select>
  )
}
```

## Color Customization

### Creating Custom Color Schemes

Define your own color palette by modifying the CSS variables:

```css
:root {
  /* Custom brand colors */
  --primary: 262 83% 58%;          /* Purple */
  --primary-foreground: 0 0% 100%; /* White */

  /* Custom accent */
  --accent: 262 30% 96%;
  --accent-foreground: 262 83% 58%;

  /* Custom destructive */
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;
}

.dark {
  /* Dark mode adjustments */
  --primary: 262 83% 68%;
  --primary-foreground: 262 47% 11%;

  --accent: 262 30% 17%;
  --accent-foreground: 262 83% 68%;
}
```

### Using Custom Colors in Components

Shadmin components automatically use CSS variables:

```tsx
// Button uses --primary and --primary-foreground
<Button variant="default">Primary Button</Button>

// Uses --destructive colors
<Button variant="destructive">Delete</Button>

// Uses --secondary colors
<Button variant="secondary">Secondary</Button>
```

### Dark Mode Specific Styles

Use Tailwind's `dark:` modifier for dark-mode-specific styles:

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">
    Adapts to current theme
  </p>
</div>
```

Example from Notification component:

```tsx
const variantStyles = {
  success: {
    container: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-800 dark:text-green-200',
  },
  error: {
    container: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-800 dark:text-red-200',
  },
  // ... more variants
}
```

## Component Styling with cn() Utility

The `cn()` utility function is the foundation of component styling in Shadmin. It combines `clsx` for conditional classes with `tailwind-merge` for intelligent class merging.

### Basic Usage

```tsx
import { cn } from 'shadmin/lib/utils'

// Simple class merging
cn('px-4 py-2', 'bg-blue-500')
// => 'px-4 py-2 bg-blue-500'

// Conditional classes
cn('base-class', isActive && 'active-class')
// => 'base-class active-class' or 'base-class'

// Object syntax
cn('base', { 'active': isActive, 'disabled': isDisabled })
```

### Handling Tailwind Conflicts

`cn()` intelligently resolves conflicting Tailwind classes:

```tsx
// Later classes override earlier ones
cn('bg-red-500', 'bg-blue-500')
// => 'bg-blue-500'

// Works with variants
cn('hover:bg-red-500', 'hover:bg-blue-500')
// => 'hover:bg-blue-500'

// Dark mode variants merge correctly
cn('bg-white', 'dark:bg-gray-900')
// => 'bg-white dark:bg-gray-900'
```

### Component Styling Pattern

The standard pattern for stylable components:

```tsx
import { cn } from 'shadmin/lib/utils'

interface MyComponentProps {
  className?: string
  variant?: 'default' | 'primary' | 'secondary'
}

const variants = {
  default: 'bg-background text-foreground',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
}

function MyComponent({ className, variant = 'default' }: MyComponentProps) {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-md p-4 transition-colors',
        // Variant styles
        variants[variant],
        // Allow consumer overrides
        className
      )}
    >
      {/* content */}
    </div>
  )
}
```

### Button Component Example

Here's how the Button component uses `cn()`:

```tsx
const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
}

export const Button = ({ className, variant, size, ...props }) => (
  <button
    className={cn(
      // Base styles
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium',
      'ring-offset-background transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      // Variant and size
      buttonVariants[variant],
      buttonSizes[size],
      // Consumer overrides
      className
    )}
    {...props}
  />
)
```

### Conditional Styling

Use `cn()` for complex conditional styles:

```tsx
function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-1 text-xs font-medium',
        status === 'active' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        status === 'inactive' && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      )}
    >
      {status}
    </span>
  )
}
```

### Arrays and Nested Conditions

```tsx
cn(
  'base-class',
  [
    'array-class-1',
    condition && 'conditional-array-class',
    'array-class-2',
  ],
  {
    'object-true': true,
    'object-false': false,
  }
)
```

## Best Practices

1. **Always use CSS variables** for colors that should adapt to themes
2. **Use `cn()`** for all component class names to enable proper overrides
3. **Provide `className` prop** on components to allow style customization
4. **Test both themes** when developing components
5. **Use `resolvedTheme`** when you need the actual applied theme (not 'system')
6. **Set `disableTransitionOnChange`** if theme transitions cause visual glitches
7. **Persist theme preference** using the built-in localStorage support

## Related Documentation

- [Layout Components](./layout-components.md) - Layout component with theme integration
- [Installation](./installation.md) - Setting up Tailwind CSS
- [Getting Started](./getting-started.md) - Quick start guide
