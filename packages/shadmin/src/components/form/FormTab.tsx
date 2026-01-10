/**
 * FormTab Component
 * Individual tab panel for TabbedForm
 */

import * as React from 'react'
import { cn } from '../../utils'

/**
 * Props for FormTab component
 */
export interface FormTabProps {
  /**
   * Label displayed on the tab trigger
   */
  label: string
  /**
   * Unique name/identifier for the tab.
   * If not provided, will be generated from the label.
   */
  name?: string | undefined
  /**
   * Path used for URL synchronization when syncWithLocation is enabled.
   * If not provided, the name (or generated name from label) will be used.
   */
  path?: string | undefined
  /**
   * Content to render inside the tab panel
   */
  children?: React.ReactNode | undefined
  /**
   * Optional icon to display before the label
   */
  icon?: React.ReactNode | undefined
  /**
   * Whether the tab is disabled
   */
  disabled?: boolean | undefined
  /**
   * Additional CSS class for the tab panel
   */
  className?: string | undefined
  /**
   * Additional CSS class for the tab trigger
   */
  triggerClassName?: string | undefined
  /**
   * Optional badge count to display on the tab
   */
  count?: React.ReactNode | undefined
}

/**
 * Generate a slug from a label string
 */
export function generateTabName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * FormTab - Individual tab panel component for TabbedForm
 *
 * This component is used as a child of TabbedForm to define individual tabs.
 * It doesn't render anything on its own - TabbedForm extracts the props and
 * renders the appropriate UI.
 *
 * @example
 * ```tsx
 * <TabbedForm>
 *   <FormTab label="General" name="general">
 *     <TextInput source="name" />
 *     <TextInput source="email" />
 *   </FormTab>
 *   <FormTab label="Details" name="details" icon={<InfoIcon />}>
 *     <TextInput source="description" />
 *   </FormTab>
 * </TabbedForm>
 * ```
 */
export function FormTab({
  label: _label,
  name: _name,
  path: _path,
  children: _children,
  icon: _icon,
  disabled: _disabled,
  className: _className,
  triggerClassName: _triggerClassName,
  count: _count,
}: FormTabProps) {
  // This component is a "configuration" component
  // TabbedForm reads the props and renders the actual tab UI
  // The children are rendered by TabbedForm in the appropriate TabsContent
  return null
}

FormTab.displayName = 'FormTab'

/**
 * Internal component for rendering the actual tab panel content
 * Used by TabbedForm to render each tab's children
 */
export interface FormTabPanelProps {
  /**
   * The tab name/value
   */
  value: string
  /**
   * Content to render
   */
  children: React.ReactNode
  /**
   * Additional class names
   */
  className?: string | undefined
  /**
   * Whether to force render content even when tab is not active
   * This is needed to register form inputs
   */
  forceRender?: boolean | undefined
  /**
   * Whether this tab is currently active
   */
  isActive?: boolean | undefined
}

/**
 * FormTabPanel - Internal component for rendering tab panel content
 * Follows shadcn/ui TabsContent pattern for consistent styling
 */
export function FormTabPanel({
  value,
  children,
  className,
  forceRender = true,
  isActive = false,
}: FormTabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      data-testid={`tabpanel-${value}`}
      data-state={isActive ? 'active' : 'inactive'}
      hidden={!isActive && !forceRender}
      className={cn(
        // Tab panel styling following shadcn/ui pattern
        'mt-2 ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        // Hide inactive panels while keeping them in the DOM for form registration
        !isActive && forceRender && 'hidden',
        className
      )}
      tabIndex={0}
    >
      {(isActive || forceRender) && children}
    </div>
  )
}

FormTabPanel.displayName = 'FormTabPanel'
