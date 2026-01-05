/**
 * Resource type definitions for Shadmin
 * 100% API-compatible with react-admin
 */

import type { ComponentType, ReactNode } from 'react'

export interface ResourceOptions {
  label?: string
  [key: string]: unknown
}

/**
 * Resource definition stored in context
 */
export interface ResourceDefinition {
  name: string
  icon?: ComponentType
  options?: ResourceOptions
  hasList?: boolean
  hasEdit?: boolean
  hasCreate?: boolean
  hasShow?: boolean
}

/**
 * Resource component props
 */
export interface ResourceProps {
  /** The name of the resource (used in URLs and API calls) */
  name: string
  /** Component to render for the list view */
  list?: ComponentType
  /** Component to render for the edit view */
  edit?: ComponentType
  /** Component to render for the create view */
  create?: ComponentType
  /** Component to render for the show view */
  show?: ComponentType
  /** Icon component for the resource in menu */
  icon?: ComponentType
  /** Additional resource options */
  options?: ResourceOptions
  /** Nested resources */
  children?: ReactNode
}
